import { Component, DestroyRef, effect, inject, input, output, signal, untracked } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { validarMensajeCertificado } from '../../../core/services/emision-certificados/vista-previa-pdf';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Params, RouterLink } from '@angular/router';
import { Observable, Subscription, catchError, finalize, forkJoin, map, of, switchMap, throwError, timeout, timer } from 'rxjs';
import { ArchivoPdf } from '../../../core/interfaces/emision-certificados/documento-digital.interface';
import { ErrorApi } from '../../../core/interfaces/api/api-response.interface';
import { DatosOrigen, EvaluacionDocumental, EvaluacionPonente, EvaluacionPonenteActividad, OrigenDocumental } from '../../../core/interfaces/emision-certificados/origenes-certificado.interface';
import { TipoCertificado } from '../../../core/interfaces/emision-certificados/emision-certificados.interface';
import { EmisionCertificadosService } from '../../../core/services/emision-certificados/emision-certificados.service';
import { DocumentoFirmas, DocumentosDigitalesService, RevisionDocumental, mensajeEtapaA } from '../../../core/services/emision-certificados/documentos-digitales.service';
import { CambiosCertificadosService } from '../../../core/services/emision-certificados/cambios-certificados.service';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { VisorPdfComponent } from '../compartidos/visor-pdf.component';

type OperacionReconocimiento = 'informacion' | 'recuperacion' | 'vista_previa' | 'confirmacion' | 'envio';

@Component({
  selector: 'app-preparacion-origen', standalone: true, imports: [RouterLink, VisorPdfComponent, ReactiveFormsModule],
  templateUrl: './preparacion-origen.component.html', styleUrls: ['../compartidos/emision.scss', './reconocimiento-asistente.scss'],
})
export class PreparacionOrigenComponent {
  readonly origen = input.required<OrigenDocumental>();
  readonly ponente = input<EvaluacionPonente | null>(null);
  readonly asistente = input(false);
  readonly retorno = input<Params>({});
  protected readonly pasoReconocimiento = signal(1);
  protected readonly pdfReconocimientoRevisado = signal<ArchivoPdf | null>(null);
  protected get porSesion(): boolean { return this.ponente()?.origen === 'ponente_sesion'; }
  protected get pasoMensaje(): number { return 2; }
  protected get pasoPdf(): number { return 3; }
  protected get pasoConfirmacion(): number { return 4; }
  protected get pasoEnvio(): number { return this.porSesion ? 4 : 5; }
  protected get pasosReconocimiento(): string[] {
    return this.porSesion
      ? ['Información', 'Texto del reconocimiento', 'Previsualización y confirmación', 'Enviar a Gerencia']
      : ['Datos', 'Mensaje', 'Previsualizar PDF', 'Guardar y continuar', 'Enviar a Gerencia'];
  }
  readonly cerrado = output<void>();
  protected readonly mensajeCertificado = inject(NonNullableFormBuilder).control('', validarMensajeCertificado);
  protected readonly motivoCertificado = inject(NonNullableFormBuilder).control('', c => validarMensajeCertificado(c) || (Array.from(c.value).length > 500 ? { longitudUnicode: true } : null));
  protected textosValidos(): boolean { return this.mensajeCertificado.valid && this.motivoCertificado.valid; }
  private readonly api = inject(EmisionCertificadosService);
  private readonly documentos = inject(DocumentosDigitalesService);
  private readonly cambios = inject(CambiosCertificadosService);
  private readonly auth = inject(AuthService);
  private readonly destroy = inject(DestroyRef);
  private consulta?: Subscription;
  private readonly revisionCaducada = signal(false);
  protected readonly registros = signal<readonly { id: number; nombre: string; estado: string }[]>([]);
  protected readonly evaluacion = signal<EvaluacionDocumental | null>(null);
  protected readonly revision = signal<(RevisionDocumental & { mensaje: string }) | null>(null);
  protected readonly documento = signal<DocumentoFirmas | null>(null);
  protected readonly envio = signal<RevisionDocumental | null>(null);
  protected readonly cargando = signal(false);
  protected readonly operando = signal(false);
  private readonly operacionActual = signal<OperacionReconocimiento | null>(null);
  protected mensajeOperacion(): string {
    // La información disponible permanece visible durante las lecturas iniciales.
    if (this.pasoReconocimiento() === 1) return '';
    switch (this.operacionActual()) {
      case 'informacion': return 'Consultando información…';
      case 'recuperacion': return 'Cargando preparación guardada…';
      case 'vista_previa': return 'Generando vista previa…';
      case 'confirmacion': return 'Confirmando PDF…';
      case 'envio': return 'Enviando a Gerencia…';
      default: return '';
    }
  }
  protected readonly error = signal('');
  protected readonly aviso = signal('');
  protected readonly falloConsultaExistente = signal(false);
  private readonly tiposVigentes = signal<readonly TipoCertificado[]>([]);
  constructor() {
    effect(onCleanup => {
      const r = this.revision();
      this.revisionCaducada.set(false);
      if (!r) return;
      const restante = Date.parse(r.expiresAt) - Date.now();
      if (!Number.isFinite(restante) || restante <= 0) { this.revisionCaducada.set(true); return; }
      const vencimiento = timer(restante).subscribe(() => this.revisionCaducada.set(true));
      onCleanup(() => vencimiento.unsubscribe());
    }, { allowSignalWrites: true });
    effect(() => {
      const d = this.documento();
      if (!this.porSesion || !d) return;
      untracked(() => {
        this.mensajeCertificado.setValue(d.mensaje_aprobado ?? d.mensaje ?? '', { emitEvent: false });
        this.motivoCertificado.setValue(d.motivo ?? '', { emitEvent: false });
        this.mensajeCertificado.disable({ emitEvent: false });
        this.motivoCertificado.disable({ emitEvent: false });
        this.revision.set(null); this.pdfReconocimientoRevisado.set(null);
      });
    }, { allowSignalWrites: true });
    for (const control of [this.mensajeCertificado, this.motivoCertificado]) {
      control.valueChanges.pipe(takeUntilDestroyed(this.destroy)).subscribe(() => {
        if (this.porSesion && !this.documento()) { this.revision.set(null); this.pdfReconocimientoRevisado.set(null); this.envio.set(null); }
      });
    }
    effect(() => { const origen = this.origen(); const ponente = this.ponente(); const asistente = this.asistente(); untracked(() => {
      if (!ponente) { this.cargar(origen); return; }
      this.consulta?.unsubscribe();
      this.limpiar(); this.pasoReconocimiento.set(1); this.evaluacion.set(ponente);
      this.mensajeCertificado.enable({ emitEvent: false }); this.motivoCertificado.enable({ emitEvent: false });
      if (ponente.origen === 'ponente_sesion') {
        this.motivoCertificado.setValue(`Participación como ponente en ${ponente.sesion ?? ''}`.slice(0, 500));
        this.mensajeCertificado.setValue(`Por su valiosa participación como ponente en la sesión ${ponente.sesion ?? ''} de la actividad ${ponente.actividad ?? ''}, compartiendo sus conocimientos y contribuyendo al desarrollo de sus participantes.`.slice(0, 1200));
      }
      const existentes = ponente.certificados_existentes ?? [];
      if (ponente.puede_consultar_certificado_existente && existentes.length === 1) this.abrirExistente(existentes[0].id_certificado);
      else if (!asistente && this.puedePreparar()) this.revisar();
    }); }, { allowSignalWrites: true });
    effect(() => {
      if (!this.asistente() || this.porSesion) return;
      const documento = this.documento(); const envio = this.envio();
      if (documento) this.pasoReconocimiento.set(this.porSesion || envio || documento.estado_certificado !== 'PREPARADO' ? this.pasoEnvio : this.pasoConfirmacion);
    }, { allowSignalWrites: true });
  }
  protected siguienteReconocimiento(): void {
    if (this.porSesion && this.documento()) {
      if (!this.operando()) this.pasoReconocimiento.update(p => Math.min(p + 1, this.pasoEnvio));
      return;
    }
    if (this.porSesion && this.pasoReconocimiento() === this.pasoMensaje) {
      this.mensajeCertificado.markAsTouched(); this.motivoCertificado.markAsTouched();
      if (this.puedeAvanzar()) this.revisar();
      return;
    }
    if (!this.puedeAvanzar()) return;
    if (this.porSesion && this.pasoReconocimiento() === 1) { this.pasoReconocimiento.set(2); return; }
    if (this.pasoReconocimiento() === this.pasoMensaje - 1) {
      this.pasoReconocimiento.set(this.pasoMensaje);
      if (!this.porSesion && !this.revision()) this.revisar();
    } else if (this.pasoReconocimiento() === this.pasoMensaje && this.revision()) this.pasoReconocimiento.set(this.pasoPdf);
  }
  protected anteriorReconocimiento(): void {
    if (!this.operando() && (!this.documento() || this.porSesion) && this.pasoReconocimiento() > 1) this.pasoReconocimiento.update(p => p - 1);
  }
  protected puedeGuardarReconocimiento(): boolean {
    return this.pasoReconocimiento() === this.pasoPdf && this.puedePreparar() && !!this.revision()
      && (!this.porSesion || this.contextoSesionValido() && this.revisionVigente())
      && this.pdfReconocimientoRevisado() === this.revision()?.archivo;
  }
  protected puedeAvanzar(): boolean {
    if (this.porSesion && this.documento()) return !this.operando();
    if (this.falloConsultaExistente() || !this.puedePreparar()) return false;
    if (!this.porSesion) return this.pasoReconocimiento() === 1 || !!this.revision();
    switch (this.pasoReconocimiento()) {
      case 1: return this.contextoSesionValido();
      case 2: return this.contextoSesionValido() && this.textosValidos();
      default: return false;
    }
  }
  private identidadSesionValida(): boolean {
    const e = this.datosPonente();
    return e?.origen === 'ponente_sesion' && e.modalidad_reconocimiento === 'sesion'
      && [e.id_origen, e.id_persona, e.id_persona_ponente].every(id => Number.isSafeInteger(id) && Number(id) > 0)
      && e.id_actividad_ponente === e.id_origen && !!this.nombre().trim();
  }
  private contextoSesionValido(): boolean {
    const e = this.datosPonente();
    return this.identidadSesionValida() && !!e
      && [e.id_actividad, e.id_sesion, e.id_tipo_certificado].every(id => Number.isSafeInteger(id) && Number(id) > 0)
      && !!e.actividad?.trim() && !!e.sesion?.trim() && this.fechaSesion() !== 'No disponible';
  }
  protected revisionVigente(): boolean {
    const r = this.revision();
    return !this.revisionCaducada() && !!r?.mensaje.trim() && Date.parse(r.expiresAt) > Date.now()
      && (!this.porSesion || r.mensaje === this.mensajeCertificado.value && r.motivo === this.motivoCertificado.value);
  }
  protected volverRegistros(): void { if (this.ponente()) this.cerrado.emit(); else this.cargar(); }
  protected cargar(origen = this.origen()): void {
    if (this.ponente()) { this.cerrado.emit(); return; }
    this.consulta?.unsubscribe(); this.limpiar(); this.registros.set([]); this.tiposVigentes.set([]); this.cargando.set(true);
    const permiso = origen === 'practica' ? 'practicantes.ver' : 'reconocimientos.ver';
    if (!this.auth.tienePermiso(permiso)) { this.error.set('No tienes permiso para consultar estos registros.'); this.cargando.set(false); return; }
    const fuente = origen === 'reconocimiento'
      ? this.api.listarTodos('reconocimientos').pipe(map(filas => filas.map(r => ({ id: r.id_reconocimiento, nombre: r.titulo, estado: r.estado }))))
      : this.api.registrosPracticas().pipe(map(filas => filas.map(r => ({ id: r.id_practica,
        nombre: [r.carrera, r.fecha_inicio, r.fecha_fin].filter(Boolean).join(' · '), estado: r.estado }))));
    // Los catálogos son independientes. El tipo de cada registro lo resuelve su evaluación.
    const registros = this.auth.tienePermiso('actividades.ver')
      ? forkJoin({ registros: fuente, catalogos: this.api.catalogosOrigenes() }).pipe(map(d => {
        this.tiposVigentes.set(d.catalogos.tipos_certificado.filter(t => t.estado === true || String(t.estado) === '1'));
        return d.registros;
      })) : fuente;
    this.consulta = registros.pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: filas => { this.registros.set(filas); this.cargando.set(false); },
      error: e => { this.error.set(mensajeEtapaA(e)); this.cargando.set(false); },
    });
  }
  private limpiar(): void {
    this.evaluacion.set(null); this.revision.set(null); this.documento.set(null); this.envio.set(null);
    this.error.set(''); this.aviso.set(''); this.operando.set(false);
    this.operacionActual.set(null);
    this.falloConsultaExistente.set(false);
    this.pdfReconocimientoRevisado.set(null);
  }
  protected consultar(id: number): void {
    if (this.operando() || !this.registros().some(r => r.id === id)) return;
    this.consulta?.unsubscribe(); this.limpiar();
    this.ejecutar(this.api.evaluarOrigen(this.origen(), id), e => this.evaluacion.set(e));
  }
  protected datos(): DatosOrigen | undefined {
    const e = this.evaluacion();
    return e && (e.origen === 'reconocimiento' || e.origen === 'practica') ? e[e.origen] : undefined;
  }
  protected datosPonente(): EvaluacionPonente | null {
    const e = this.evaluacion();
    return e?.origen === 'ponente_actividad' || e?.origen === 'ponente_sesion' ? e : null;
  }
  protected nombre(): string { const d = this.datosPonente() ?? this.datos(); return [d?.nombres, d?.apellido_paterno, d?.apellido_materno].filter(Boolean).join(' '); }
  protected modalidadPonente(): string {
    return this.datosPonente()?.origen === 'ponente_sesion' ? 'Reconocimiento por sesión' : 'Reconocimiento por actividad';
  }
  protected fechaSesion(): string {
    const valor = this.datosPonente()?.origen === 'ponente_sesion' ? this.datosPonente()!.fecha_sesion : null;
    return this.fechaInterfaz(valor);
  }
  protected fechaInterfaz(valor?: string | null): string {
    const partes = /^(\d{4})-(\d{2})-(\d{2})(?:$|T| )/.exec(valor ?? '');
    if (!partes) return 'No disponible';
    const [, anio, mes, dia] = partes;
    const fecha = new Date(`${anio}-${mes}-${dia}T00:00:00Z`);
    return fecha.getUTCFullYear() === +anio && fecha.getUTCMonth() + 1 === +mes && fecha.getUTCDate() === +dia
      ? `${dia}/${mes}/${anio}` : 'No disponible';
  }
  protected nombreSesion(): string {
    const nombre = this.datosPonente()?.sesion?.trim() ?? '';
    const numero = /^(?:sesi[oó]n\s*)+(?:n[.º°o\s]*|#)?\s*(\d+)$/iu.exec(nombre);
    return numero ? `Sesión N.º ${numero[1].padStart(3, '0')}` : nombre || 'No disponible';
  }
  protected motivoReconocimiento(): string {
    return this.datosPonente()?.datos_origen?.titulo || 'No disponible';
  }
  protected tipoNombre(): string {
    const e = this.evaluacion();
    return e?.tipo_certificado || this.tiposVigentes().find(t => t.id_tipo_certificado === e?.id_tipo_certificado)?.nombre_tipo || 'Tipo documental no disponible';
  }
  protected puedePreparar(): boolean {
    const e = this.evaluacion();
    return !!e && e.puede_preparar === true && e.puede_generar_pdf === true
      && e.estado_elegibilidad === 'Elegible' && !(e.certificados_existentes ?? []).some(c => c.id_tipo_certificado === e.id_tipo_certificado)
      && !this.documento() && !this.operando();
  }
  protected revisar(): void {
    const e = this.evaluacion(); if (!e || !this.puedePreparar()) return;
    if (this.porSesion && (!this.contextoSesionValido() || this.pasoReconocimiento() !== this.pasoMensaje)) return;
    if (this.porSesion && !this.textosValidos()) return;
    this.revision.set(null);
    this.pdfReconocimientoRevisado.set(null);
    this.envio.set(null);
    const mensajeSolicitado = this.mensajeCertificado.value;
    const motivoSolicitado = this.motivoCertificado.value;
    const solicitud = e.origen === 'ponente_sesion'
      ? this.documentos.revisarOrigen(e.origen, e.id_origen, { modalidad_reconocimiento: 'sesion', id_sesion: e.id_sesion, mensaje: this.mensajeCertificado.value, motivo: this.motivoCertificado.value })
      : this.documentos.revisarOrigen(e.origen, e.id_origen);
    this.ejecutar(solicitud.pipe(catchError(error => {
      if (!this.esPonente(e) || ![0, 408, 409].includes(error?.status)) return throwError(() => error);
      return this.recuperarVigente(e).pipe(switchMap(vigente => {
        if (!vigente || vigente.id_persona !== e.id_persona) return throwError(() => error);
        this.evaluacion.set(vigente); const existentes = vigente.certificados_existentes ?? [];
        if (vigente.puede_consultar_certificado_existente !== true || existentes.length !== 1) return throwError(() => error);
        return this.recuperarExistente(vigente, existentes[0].id_certificado).pipe(map(d => { this.documento.set(d); return null; }));
      }));
    })), r => {
      if (r?.documento) { this.documento.set(r.documento); if (this.porSesion) this.pasoReconocimiento.set(this.pasoPdf); return; }
      if (this.porSesion && (this.mensajeCertificado.value !== mensajeSolicitado || this.motivoCertificado.value !== motivoSolicitado)) {
        this.error.set('Los textos cambiaron durante la revisión. Genera una nueva vista previa.'); return;
      }
      this.revision.set(r);
      if (this.porSesion && r) this.pasoReconocimiento.set(this.pasoPdf);
    }, undefined, 'vista_previa');
  }
  protected guardar(): void {
    const e = this.evaluacion(); const r = this.revision();
    if (!e || !r || !this.puedePreparar() || this.asistente() && !this.puedeGuardarReconocimiento()) return;
    this.ejecutar(this.documentos.guardarOrigen(e, r), d => {
      this.documento.set(d); this.revision.set(null);
      if (this.porSesion) this.pasoReconocimiento.set(this.pasoEnvio);
      this.aviso.set(this.porSesion ? d.estado_certificado === 'PREPARADO' ? 'Reconocimiento preparado correctamente' : '' : 'Certificado preparado');
      this.cambios.confirmar();
    }, undefined, 'confirmacion');
  }
  protected abrirExistente(id: number): void {
    const e = this.evaluacion(); if (!e || this.operando() || e.puede_consultar_certificado_existente !== true
      || !(e.certificados_existentes ?? []).some(c => c.id_certificado === id && c.id_tipo_certificado === e.id_tipo_certificado)) return;
    if (e.origen === 'ponente_actividad' || e.origen === 'ponente_sesion') {
      this.falloConsultaExistente.set(false);

      this.ejecutar(this.recuperarExistente(e, id), d => { this.documento.set(d); this.revision.set(null); this.envio.set(null); }, error => {
        if (this.porSesion && error.status === 404 && (error as ErrorApi & { evaluacion?: EvaluacionPonente }).evaluacion) {
          this.evaluacion.set((error as ErrorApi & { evaluacion: EvaluacionPonente }).evaluacion);
          this.pasoReconocimiento.set(1); return '';
        }
        this.falloConsultaExistente.set(true);
        this.pasoReconocimiento.set(1);
        if (error.status === 403) return 'No tienes autorización para consultar este reconocimiento.';
        if (error.status === 409) return 'El reconocimiento presenta un conflicto. Actualiza su estado.';
        return 'No se pudo consultar el reconocimiento. Reintentar';
      }, 'recuperacion');
      return;
    }
    this.ejecutar(this.api.obtener('certificados', id).pipe(switchMap(c => {
      if (c.id_certificado !== id || c.id_persona !== e.id_persona || c[`id_${e.origen}`] !== e.id_origen
        || !Number.isSafeInteger(c['id_certificado_documento']) || Number(c['id_certificado_documento']) < 1) throw new Error('No se pudo recuperar el documento existente.');
      return this.documentos.detalleFirmas(Number(c['id_certificado_documento']));
    }), map(d => {
      if (d.id_certificado !== id || d.origen !== e.origen || d.beneficiario?.id_persona !== e.id_persona) throw new Error('No se pudo confirmar el beneficiario del documento.');
      return d;
    })), d => { this.documento.set(d); this.revision.set(null); this.envio.set(null); });
  }
  protected reintentarConsultaExistente(): void {
    const existentes = this.evaluacion()?.certificados_existentes ?? [];
    if (existentes.length === 1) this.abrirExistente(existentes[0].id_certificado);
  }
  protected authGerencia(): boolean { return this.auth.tienePermiso('emision.ver'); }
  protected puedeRemitir(): boolean {
    const d = this.documento(); return !!d && d.estado_certificado === 'PREPARADO' && d.facultades?.remitir === true && d.puede_enviar_gerencia !== false && !this.operando();
  }
  protected estadoReconocimiento(): string {
    const d = this.documento();
    if (d?.estado_certificado === 'PREPARADO') return 'Pendiente de envío a Gerencia';
    if (d?.disponible_rrhh === true || d?.estado_preparacion === 'PREPARADO_ENTREGA') return 'Listo para entrega';
    if (d?.estado_certificado === 'PENDIENTE_FIRMA') return 'Enviado a Gerencia';
    return d?.estado_certificado ?? '';
  }
  /** Solo el clic explícito del paso 4 revisa y remite el documento ya guardado. */
  protected enviarSesion(): void {
    const d = this.documento();
    if (!this.porSesion || this.pasoReconocimiento() !== this.pasoEnvio || !d || !this.puedeRemitir()) return;
    this.ejecutar(this.documentos.obtenerRevisionEnvio(d.id_certificado_documento, d.hash_pdf).pipe(
      switchMap(r => {
        if (Date.parse(r.expiresAt) <= Date.now()) return throwError(() => ({ status: 409, mensaje: 'La revisión venció. Reintenta el envío.', errores: {} }));
        return this.documentos.confirmarEnvio(d.id_certificado_documento, r.token, r.hash);
      }),
      catchError(error => {
        if (![0, 408, 409].includes(error?.status)) return throwError(() => error);
        return this.documentos.detalleFirmas(d.id_certificado_documento).pipe(switchMap(actual => {
          if (actual.id_certificado_documento !== d.id_certificado_documento) return throwError(() => error);
          // Recuperar el estado vigente no remite ni aprueba otra versión del PDF.
          if (actual.estado_certificado === 'PENDIENTE_FIRMA') return of(actual);
          if (actual.estado_certificado === 'PREPARADO') this.documento.set({ ...d, ...actual });
          return throwError(() => error);
        }));
      }),
    ), doc => this.registrarEnvio(doc, d.id_certificado_documento),
    () => 'No se pudo enviar el certificado. Intenta nuevamente.', 'envio');
  }
  protected revisarEnvio(): void {
    const d = this.documento(); if (!d || !this.puedeRemitir()) return;
    this.envio.set(null);
    this.ejecutar(this.documentos.obtenerRevisionEnvio(d.id_certificado_documento, d.hash_pdf).pipe(catchError(error => {
      const e = this.datosPonente();
      if (!this.asistente() || !e || !d.id_certificado || ![0, 408, 409].includes(error?.status)) return throwError(() => error);
      return this.recuperarExistente(e, d.id_certificado).pipe(switchMap(vigente => {
        this.documento.set(vigente);
        return vigente.estado_certificado !== 'PREPARADO' ? of(null) : throwError(() => error);
      }));
    })), r => this.envio.set(r), undefined, 'envio');
  }
  /** Recupera el documento existente del mismo origen, beneficiario, actividad y sesión. */
  private recuperarExistente(e: EvaluacionPonente, certificado: number): Observable<DocumentoFirmas> {
    return e.origen === 'ponente_sesion'
      ? this.documentos.recuperarReconocimientoSesion(e, certificado)
      : this.documentos.recuperarReconocimientoActividad(e, certificado);
  }
  /** Reconfirma el vínculo vigente del ponente antes de reutilizar un guardado incierto. */
  private recuperarVigente(e: EvaluacionPonente): Observable<EvaluacionPonente | null> {
    return e.origen === 'ponente_sesion'
      ? this.api.ponentesCertificacion(e.id_sesion).pipe(timeout(30000),
        map(d => d.ponentes_sesion?.find(p => p.id_actividad_ponente === e.id_origen)?.reconocimiento ?? null))
      : this.api.ponentesActividad(e.id_actividad!).pipe(timeout(30000),
        map(d => d.ponentes.find(p => p.id_actividad_ponente === e.id_origen)?.reconocimiento ?? null));
  }
  private esPonente(e: EvaluacionDocumental): e is EvaluacionPonente {
    return e.origen === 'ponente_actividad' || e.origen === 'ponente_sesion';
  }
  protected enviar(): void {
    const d = this.documento(); const r = this.envio(); if (!d || !r || !this.puedeRemitir()) return;
    this.ejecutar(this.documentos.confirmarEnvio(d.id_certificado_documento, r.token, r.hash), doc => {
      this.registrarEnvio(doc, d.id_certificado_documento);
    }, undefined, 'envio');
  }
  private registrarEnvio(doc: DocumentoFirmas, idDocumento: number): void {
    if (doc.id_certificado_documento !== idDocumento) { this.error.set('No se pudo confirmar el documento enviado.'); return; }
    this.documento.set(this.porSesion ? { ...this.documento(), ...doc } : doc); this.envio.set(null);
    if (doc.estado_certificado === 'PENDIENTE_FIRMA') {
      this.aviso.set('Enviado a Gerencia'); this.cambios.confirmar();
    } else {
      this.error.set('El envío no fue confirmado. Revisa el estado del documento y reintenta.');
    }
  }
  private ejecutar<T>(fuente: Observable<T>, resultado: (dato: T) => void, errorConsulta?: (error: ErrorApi) => string,
    tipo: OperacionReconocimiento = 'informacion'): void {
    this.operacionActual.set(tipo);
    this.operando.set(true); this.error.set(''); this.aviso.set('');
    const operacion = this.asistente() ? fuente.pipe(timeout(240000)) : fuente;
    this.consulta = operacion.pipe(takeUntilDestroyed(this.destroy), finalize(() => {
      this.operando.set(false); this.operacionActual.set(null);
    })).subscribe({
      next: dato => { this.operando.set(false); resultado(dato); },
      error: (e: ErrorApi) => { this.operando.set(false); this.error.set(errorConsulta ? errorConsulta(e) : this.asistente() && e.status === 409
        ? e.mensaje || 'La operación está bloqueada. Actualiza el estado antes de reintentar.' : mensajeEtapaA(e)); },
    });
  }
}
