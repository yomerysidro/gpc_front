import { ArchivoPdf } from '../../../core/interfaces/emision-certificados/documento-digital.interface';
import { decodificarVistaPrevia } from '../../../core/services/emision-certificados/vista-previa-pdf';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { FuncionarioMunicipal, ModalidadFirma, PlanFirmantes } from '../../../core/services/emision-certificados/firma-documental.service';
import { Observable, Subscription, Subject, EMPTY, defer, of, timer, catchError, finalize, map, switchMap, tap, throwError, timeout }  from 'rxjs';
import { ErrorApi } from '../../../core/interfaces/api/api-response.interface';
import { DocumentoFirmas, DocumentosDigitalesService, mensajeEtapaA } from '../../../core/services/emision-certificados/documentos-digitales.service';
import { FirmaDocumentalService, ProgresoFirma, VerificacionFirma, RevisionFirmantes } from '../../../core/services/emision-certificados/firma-documental.service';
import { VisorPdfComponent } from '../../emision-certificados/compartidos/visor-pdf.component';

@Component({
  selector: 'app-detalle-documento', standalone: true, imports: [RouterLink, VisorPdfComponent, FormsModule],
  templateUrl: './detalle-documento.component.html', styleUrls: ['../../emision-certificados/compartidos/emision.scss', './detalle-documento.component.scss'],
})
export class DetalleDocumentoComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(DocumentosDigitalesService);
  private readonly firmas = inject(FirmaDocumentalService);
  private readonly destroy = inject(DestroyRef);
  protected readonly documento = signal<DocumentoFirmas | null>(null);
  protected readonly progreso = signal<ProgresoFirma | null>(null);
  protected readonly integridad = signal<VerificacionFirma | null>(null);
  protected readonly cargas = signal<ReadonlySet<string>>(new Set());
  protected readonly errores = signal<Record<string, string>>({});
  protected readonly paginaRegreso = signal(1);
  private consultas = new Subscription();
  private id = 0;
  private readonly auth = inject(AuthService);
  protected readonly seleccionando = signal(false);
  protected readonly disponibles = signal<FuncionarioMunicipal[]>([]);
  protected readonly seleccion = signal<FuncionarioMunicipal[]>([]);
  protected readonly busqueda = signal('');
  protected readonly modalidad = signal<ModalidadFirma>('PARALELA');
  protected readonly aviso = signal('');
  protected readonly previa = signal<ArchivoPdf | null>(null);
  protected readonly textosPrevia = signal<readonly string[]>([]);
  protected readonly vigente = signal<ArchivoPdf | null>(null);
  protected readonly restaurarVigente = signal(false);
  protected readonly revision = signal<RevisionFirmantes | null>(null);
  protected readonly previaCargando = signal(false);
  protected readonly previaVisible = signal(false);
  protected readonly errorPrevia = signal('');
  private readonly cambios = new Subject<void>();
  private claveRevision = '';
  private claveAsignada: string | null = null;
  private tokenConfirmado: string | null = null;
  private asignacionPendienteVerificacion = false;
  private plan() { return { modalidad: this.modalidad(), firmantes: this.seleccion().map((t,i) => ({ id_persona_trabajador: t.id_persona_trabajador, orden_firma: i + 1 })) }; }
  protected cambiarModalidad(m: ModalidadFirma): void { if (this.ocupada()) return; this.modalidad.set(m); this.actualizarPrevia(); }
  protected previaValida(): boolean {
    return !!this.previa() && !!this.revision() && this.seleccion().length > 0
      && this.claveRevision === JSON.stringify(this.plan())
      && Date.parse(this.revision()!.expires_at) > Date.now()
      && !this.previaCargando() && !this.errorPrevia();
  }
  protected listaParaGuardar(): boolean {
    return this.documento()?.facultades.descargar === true && this.previaValida() && this.previaVisible();
  }
  protected esperandoPrevia(): boolean { return this.seleccionando() && this.seleccion().length > 0; }
  protected pdfVisualizado(archivo: ArchivoPdf): void {
    if (archivo === this.previa() && this.previaValida()) this.previaVisible.set(true);
  }
  protected falloVisor(mensaje: string): void {
    if (!this.esperandoPrevia()) return;
    this.previaVisible.set(false); this.errorPrevia.set(mensaje);
  }
  protected actualizarPrevia(): void {
    // Cachear la descarga inicial no debe realimentar el visor ni renovar su URL.
    // Solo reutilizar esos bytes cuando volvamos desde una vista previa.
    if (this.seleccion().length) this.restaurarVigente.set(true);
    const r = this.revision();
    if (r) this.consultas.add(this.firmas.descartarPdf(this.id, r.token_revision).subscribe({ error: () => {} }));
    this.revision.set(null); this.previaVisible.set(false); this.errorPrevia.set(''); this.cambios.next();
  }
  protected cancelar(): void {
    if (this.ocupada()) return;
    const r = this.revision();
    const restaurar = () => { this.restaurarVigente.set(true); this.seleccionando.set(false); this.cambios.next(); this.revision.set(null); this.previa.set(null); this.previaVisible.set(false); this.errorPrevia.set(''); this.seleccion.set([...(this.progreso()?.firmantes_asignados ?? [])].sort((a,b) => a.orden_firma - b.orden_firma)); this.modalidad.set(this.progreso()?.modalidad ?? 'PARALELA'); };
    if (!r) { restaurar(); return; }
    this.consultar('cancelar', this.firmas.descartarPdf(this.id, r.token_revision), d => { if (!d.descartado) throw new Error(); restaurar(); });
  }
  protected puedeAsignar(): boolean { return this.auth.tienePermiso('emision.editar') && this.progreso()?.facultades?.asignar === true && this.integridad()?.integridad_verificada === true; }
  protected ocupada(): boolean { return ['guardar', 'disponibles', 'cancelar'].some(k => this.cargas().has(k)); }
  protected abrirSeleccion(): void {
    if (!this.puedeAsignar() || this.ocupada() || this.seleccionando()) return;
    this.seleccionando.set(true); this.seleccion.set([]); this.disponibles.set([]); this.aviso.set('');
    this.consultar('disponibles', this.firmas.disponibles(this.id), d => {
      this.disponibles.set(d);
      const ids = [...(this.progreso()?.firmantes_asignados ?? [])].sort((a,b) => a.orden_firma - b.orden_firma);
      this.seleccion.set(ids.map(t => d.find(f => f.id_persona_trabajador === t.id_persona_trabajador)).filter((t): t is FuncionarioMunicipal => !!t));
      this.modalidad.set(this.progreso()?.modalidad ?? 'PARALELA'); this.actualizarPrevia();
    });
  }
  protected filtrados() { const q = this.busqueda().trim().toLocaleLowerCase(); return this.disponibles().filter(t => (t.nombre + ' ' + t.cargo + ' ' + (t.area ?? '')).toLocaleLowerCase().includes(q)); }
  protected marcado(t: FuncionarioMunicipal): boolean { return this.seleccion().some(f => f.id_persona_trabajador === t.id_persona_trabajador); }
  protected alternar(t: FuncionarioMunicipal): void {
    if (this.ocupada()) return;
    this.seleccion.update(a => this.marcado(t) ? a.filter(f => f.id_persona_trabajador !== t.id_persona_trabajador) : a.length < 8 ? [...a, t] : a); this.actualizarPrevia();
  }
  protected mover(i: number, delta: number): void { const a = [...this.seleccion()]; const j = i + delta; if (j < 0 || j >= a.length || this.ocupada()) return; [a[i], a[j]] = [a[j], a[i]]; this.seleccion.set(a); this.actualizarPrevia(); }
  protected guardar(): void {
    if (!this.puedeAsignar() || this.ocupada() || !this.listaParaGuardar()) return;
    const r = this.revision()!; const plan = this.plan(); const clave = JSON.stringify(plan);
    if (this.progreso()?.asignacion_documental_persistida && !this.planPersistidoCoincide(this.progreso(), plan)) {
      this.errores.update(e => ({ ...e, guardar: 'El documento ya tiene otro plan guardado. No se reemplazó la asignación.' }));
      return;
    }
    const yaAsignada = this.claveAsignada === clave || this.planPersistidoCoincide(this.progreso(), plan);
    const descargar = (p: ProgresoFirma) => {
      this.validarPdfConfirmado(p, r.hash_pdf, plan);
      return this.api.archivo(this.id, true, r.hash_pdf).pipe(map(archivo => ({ p, archivo })));
    };
    const asignarNueva = () => defer(() => {
      this.asignacionPendienteVerificacion = true;
      return this.firmas.asignar(this.id, plan.modalidad, plan.firmantes).pipe(tap(() => {
        this.claveAsignada = clave; this.asignacionPendienteVerificacion = false;
      }));
    });
    const asignar: Observable<unknown> = yaAsignada ? of(null) : this.asignacionPendienteVerificacion
      ? this.firmas.progreso(this.id).pipe(switchMap(p => {
        if (!this.esDocumentoRecibido(p.documento)) throw new Error('La recuperación de la asignación corresponde a otro documento.');
        this.progreso.set(p); this.asignacionPendienteVerificacion = false;
        if (this.planPersistidoCoincide(p, plan)) { this.claveAsignada = clave; return of(null); }
        if (p.asignacion_documental_persistida) throw new Error('El documento ya tiene otro plan guardado. No se reemplazó la asignación.');
        return asignarNueva();
      })) : asignarNueva();
    if (yaAsignada) this.claveAsignada = clave;
    this.consultar('guardar', asignar.pipe(
      switchMap(() => this.tokenConfirmado === r.token_revision ? of(null) : this.firmas.confirmarPdf(this.id, r.token_revision).pipe(tap(c => {
        this.validarPdfConfirmado(c, r.hash_pdf, plan);
        this.tokenConfirmado = r.token_revision;
      }))),
      switchMap(() => this.firmas.asignados(this.id)), switchMap(descargar), timeout(25000),
      catchError(error => this.firmas.progreso(this.id).pipe(
        switchMap(p => {
          if (!this.esDocumentoRecibido(p.documento)) throw new Error('La recuperación corresponde a otro documento, certificado o código.');
          this.asignacionPendienteVerificacion = false;
          this.progreso.set(p);
          const coincide = this.planPersistidoCoincide(p, plan);
          if (coincide) this.claveAsignada = clave;
          if (p.asignacion_documental_persistida && !coincide) {
            throw new Error('El documento tiene otro plan de firmas guardado. No se reemplazó ni se repitió la asignación.');
          }
          // Una confirmación puede haberse aplicado aunque se pierda su respuesta HTTP.
          if (coincide && p.pdf_revisado_disponible === true && p.documento.hash_pdf === r.hash_pdf) {
            this.tokenConfirmado = r.token_revision;
            this.aviso.set('PDF confirmado. Recuperando el archivo autorizado.');
            return descargar(p);
          }
          if (this.claveAsignada === clave) {
            this.aviso.set('La asignación quedó guardada; el PDF aún no está confirmado. Revise y reintente la confirmación.');
            if (Date.parse(r.expires_at) <= Date.now() || error?.status === 409) this.actualizarPrevia();
          } else {
            this.aviso.set('No se confirmó el guardado. Se consultó el progreso antes de permitir un reintento.');
          }
          return throwError(() => error);
        }), catchError(recuperacion => {
          if (this.claveAsignada === clave && !this.aviso()) this.aviso.set('La asignación quedó guardada; falta verificar el PDF autorizado. Revise y reintente.');
          return throwError(() => recuperacion);
        })
      ))
    ), ({ p, archivo }) => {
      this.vigente.set(archivo); this.restaurarVigente.set(true); this.progreso.set(p); this.documento.set(p.documento);
      this.revision.set(null); this.previa.set(null); this.previaVisible.set(false); this.seleccionando.set(false);
      this.aviso.set('Certificado preparado correctamente'); this.verificarIntegridad();
    });
  }
  private planPersistidoCoincide(p: ProgresoFirma | null, plan: PlanFirmantes): boolean {
    if (!p?.asignacion_documental_persistida || p.modalidad !== plan.modalidad || !Array.isArray(p.firmantes_asignados)) return false;
    const firmantes = [...p.firmantes_asignados].sort((a, b) => a.orden_firma - b.orden_firma)
      .map(f => ({ id_persona_trabajador: f.id_persona_trabajador, orden_firma: f.orden_firma }));
    return JSON.stringify(firmantes) === JSON.stringify(plan.firmantes);
  }
  private validarPdfConfirmado(p: ProgresoFirma, hash: string, plan: PlanFirmantes): void {
    if (!this.esDocumentoRecibido(p.documento)) throw new Error('El PDF confirmado corresponde a otro documento, certificado o código.');
    if (p.documento.estado_certificado !== 'PENDIENTE_FIRMA') throw new Error('El estado del certificado cambió; vuelva a abrir el documento.');
    if (!this.planPersistidoCoincide(p, plan)) throw new Error('El plan persistido no coincide con los firmantes, orden o modalidad revisados.');
    if (p.pdf_revisado_disponible !== true) throw new Error('La asignación está guardada, pero Laravel no acredita un PDF revisado vigente.');
    if (p.documento.hash_pdf !== hash) throw new Error('La huella del PDF vigente no coincide con la vista previa revisada.');
  }
  ngOnInit(): void {
    this.cambios.pipe(switchMap(() => {
      this.previaCargando.set(false);
      if (!this.seleccionando() || !this.seleccion().length) return EMPTY;
      const plan = this.plan(); const clave = JSON.stringify(plan);
      this.previaCargando.set(true);
      this.cargas.update(c => new Set([...c, 'previa'])); this.errores.update(e => ({ ...e, previa: '' }));
      return timer(150).pipe(switchMap(() => this.firmas.revisarPdf(this.id, plan)), timeout(30000),
        switchMap(async r => {
          if (r.id_certificado_documento !== this.id || r.id_certificado !== this.documento()?.id_certificado || r.codigo_verificacion !== this.documento()?.codigo_verificacion) {
            throw new Error('La vista previa recibida no corresponde al certificado abierto.');
          }
          const planRecibido = { modalidad: r.modalidad, firmantes: r.firmantes?.map(f => ({ id_persona_trabajador: f.id_persona_trabajador, orden_firma: f.orden_firma })) };
          if (JSON.stringify(planRecibido) !== clave) throw new Error('Laravel devolvió una vista previa con otros firmantes, orden o modalidad.');
          if (r.persistido !== false || !r.token_revision || !Number.isFinite(Date.parse(r.expires_at)) || Date.parse(r.expires_at) <= Date.now()) {
            throw new Error('La revisión del PDF está incompleta o vencida. Vuelva a solicitar la vista previa.');
          }
          const archivo = decodificarVistaPrevia({ ...r.vista_previa_pdf, nombre_archivo: 'vista-previa.pdf', persistido: false });
          const digest = await crypto.subtle.digest('SHA-256', await archivo.blob.arrayBuffer());
          if (Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('') !== r.hash_pdf) throw new Error('PDF inválido.');
          return { r, archivo };
        }), tap(({ r, archivo }) => {
          this.claveRevision = clave; this.revision.set(r);
          this.textosPrevia.set(r.firmantes.flatMap(f => [f.nombre, f.cargo]).filter((texto): texto is string => typeof texto === 'string' && !!texto.trim()));
          this.previa.set(archivo);
        }),
        catchError(e => {
          const mensaje = e instanceof Error ? e.message : mensajeEtapaA(e);
          this.errorPrevia.set(mensaje); this.errores.update(a => ({ ...a, previa: mensaje })); return EMPTY;
        }),
        finalize(() => { this.previaCargando.set(false); this.cargas.update(c => { const n = new Set(c); n.delete('previa'); return n; }); }));
    }), takeUntilDestroyed(this.destroy)).subscribe();
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroy)).subscribe(params => {
      this.claveAsignada = null; this.tokenConfirmado = null; this.asignacionPendienteVerificacion = false;
      this.seleccionando.set(false); this.cambios.next(); this.revision.set(null); this.previa.set(null); this.vigente.set(null); this.restaurarVigente.set(false); this.previaVisible.set(false); this.errorPrevia.set('');
      this.consultas.unsubscribe(); this.consultas = new Subscription();
      this.documento.set(null); this.progreso.set(null); this.integridad.set(null);
      this.seleccionando.set(false); this.seleccion.set([]); this.disponibles.set([]); this.aviso.set('');
      this.errores.set({}); this.cargas.set(new Set());
      const valor = params.get('id') ?? '';
      this.id = /^[1-9]\d*$/.test(valor) && Number.isSafeInteger(Number(valor)) ? Number(valor) : 0;
      const pagina = Number(this.route.snapshot.queryParamMap.get('page'));
      this.paginaRegreso.set(Number.isSafeInteger(pagina) && pagina > 0 ? pagina : 1);
      if (!this.id) { this.errores.set({ documento: 'Identificador de documento inválido.' }); return; }
      this.cargarDocumento();
    });
    this.destroy.onDestroy(() => this.consultas.unsubscribe());
  }
  protected cargarDocumento(): void {
    if (!this.id) return;
    this.consultar('documento', this.api.detalleFirmas(this.id), doc => {
      this.documento.set(doc); this.actualizarProgreso(); this.verificarIntegridad();
    });
  }
  protected actualizarProgreso(): void {
    this.consultar('progreso', this.firmas.progreso(this.id), p => {
      if (!this.esDocumentoRecibido(p.documento)) { this.errores.update(e => ({ ...e, progreso: 'El documento cambió. Vuelva a abrirlo antes de continuar.' })); return; }
      const cambioVersion = p.documento.hash_pdf !== this.documento()?.hash_pdf;
      this.progreso.set(p); this.documento.set(p.documento);
      if (cambioVersion) { this.vigente.set(null); this.restaurarVigente.set(false); this.verificarIntegridad(); }
    });
  }
  protected verificarIntegridad(): void {
    const hashConsultado = this.documento()?.hash_pdf;
    this.integridad.set(null);
    this.consultar('integridad', this.firmas.verificacion(this.id), v => {
      if (hashConsultado !== this.documento()?.hash_pdf) { this.verificarIntegridad(); return; }
      if (v.hash_pdf !== this.documento()?.hash_pdf) { this.errores.update(e => ({ ...e, integridad: 'El archivo cambió. Vuelva a abrir el documento.' })); return; }
      this.integridad.set(v);
    });
  }
  protected nombreEstado(estado: string): string { return ({ PENDIENTE_FIRMA: 'Pendiente de firma', PREPARADO: 'Preparado', FIRMADO: 'Firmado', EMITIDO: 'Emitido', ANULADO: 'Anulado' } as Record<string, string>)[estado] ?? estado; }
  protected firmantesOrdenados(): DocumentoFirmas['firmantes'] { return [...(this.progreso()?.firmantes_asignados ?? [])].sort((a, b) => (a.orden_firma ?? 0) - (b.orden_firma ?? 0)); }
  private esDocumentoRecibido(documento: DocumentoFirmas | null | undefined): boolean {
    const recibido = this.documento();
    return !!documento && documento.id_certificado_documento === this.id
      && documento.id_certificado === recibido?.id_certificado
      && documento.codigo_verificacion === recibido?.codigo_verificacion
      // El hash vigente cambia al aprobar. Solo comparar originales cuando ambos endpoints los aportan.
      && (!documento.hash_pdf_original || !recibido?.hash_pdf_original || documento.hash_pdf_original === recibido.hash_pdf_original);
  }
  private consultar<T>(clave: string, solicitud: Observable<T>, recibir: (d: T) => void): void {
    if (this.cargas().has(clave)) return;
    this.cargas.update(c => new Set([...c, clave])); this.errores.update(e => ({ ...e, [clave]: '' }));
    const terminar = () => this.cargas.update(c => { const n = new Set(c); n.delete(clave); return n; });
    this.consultas.add(solicitud.pipe(timeout(30000)).subscribe({ next: d => { terminar(); try { recibir(d); } catch { this.errores.update(e => ({ ...e, [clave]: 'No se pudo validar la respuesta del documento.' })); } }, error: (e: ErrorApi | Error) => {
      terminar(); this.errores.update(actual => ({ ...actual, [clave]: e instanceof Error ? (e.message || 'No se pudo validar la respuesta del documento.') : mensajeEtapaA(e) }));
    } }));
  }
}
