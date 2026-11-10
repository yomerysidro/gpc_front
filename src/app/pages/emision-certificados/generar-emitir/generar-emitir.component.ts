import { DatePipe, formatDate } from '@angular/common';
import { Component, DestroyRef, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { FormularioCertificadoComponent } from '../certificados/formulario-certificado/formulario-certificado.component';
import { ESCRITURA_EMISION_AUTORIZADA } from '../../../core/services/emision-certificados/operaciones-emision';
import { catchError, distinctUntilChanged, forkJoin, map, Observable, of, startWith, Subscription, switchMap } from 'rxjs';
import { ErrorApi } from '../../../core/interfaces/api/api-response.interface';
import { PaginaEmision, Reconocimiento, RegistroEmision, TipoCertificado } from '../../../core/interfaces/emision-certificados/emision-certificados.interface';
import { BeneficiarioCertificacion, EvaluacionCertificacion, OrigenCertificacion, PendienteCertificacion } from '../../../core/interfaces/emision-certificados/certificacion-sesion.interface';
import { SeleccionCertificado } from '../../../core/interfaces/emision-certificados/preparacion-documental.interface';
import { EmisionCertificadosService } from '../../../core/services/emision-certificados/emision-certificados.service';
import { PracticeService } from '../../../core/services/practice/practice.service';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { PageTitleComponent } from '../../../shared/components/page-title/page-title.component';
import { ListarCertificadosComponent } from '../certificados/listar-certificados/listar-certificados.component';
import { VisorCertificadoComponent } from '../compartidos/visor-certificado.component';
import { etiquetaEstado } from '../compartidos/estado-emision';
import { DocumentosDigitalesService, mensajeDocumento, VistaPreviaSesion } from '../../../core/services/emision-certificados/documentos-digitales.service';
import { ArchivoPdf } from '../../../core/interfaces/emision-certificados/documento-digital.interface';
import { validarMensajeCertificado } from '../../../core/services/emision-certificados/vista-previa-pdf';
import { DocumentoGenerado } from '../../../core/interfaces/emision-certificados/documento-digital.interface';
import { VisorPdfComponent } from '../compartidos/visor-pdf.component';
import { enlaceVerificacionSeguro } from '../../../core/security/url-documental';
import { estadoBeneficiario, mismoContexto, motivosPreparacion, motivoEmision } from './estado-beneficiario';
function contextoParametros(parametros: ParamMap): string {
  return JSON.stringify([...parametros.keys].sort().map(clave => [clave, parametros.getAll(clave)]));
}
type SolicitudContexto = { modalidad: 'general' } | { modalidad: 'invalido'; error: string }
  | { modalidad: 'sesion' | 'actividad'; actividad: number; sesion: number | null };
interface ContextoEmision {
  general: boolean;
  modalidad: 'sesion' | 'actividad' | null;
  cargando: boolean;
  error: string | null;
  actividad: RegistroEmision | null;
  sesion: RegistroEmision | null;
}
function solicitarContexto(parametros: ParamMap): SolicitudContexto {
  if (!['id_actividad', 'id_sesion', 'modalidad'].some(clave => parametros.has(clave))) return { modalidad: 'general' };
  const error = { modalidad: 'invalido' as const, error: 'El contexto de certificación no es válido. Revisa la actividad, la sesión y el origen.' };
  if (['id_actividad', 'id_sesion', 'modalidad', 'origen'].some(clave => parametros.getAll(clave).length > 1)) return error;
  const actividad = parametros.get('id_actividad'); const sesion = parametros.get('id_sesion');
  const modalidad = parametros.get('modalidad') ?? (sesion === null ? 'actividad' : 'sesion');
  const idValido = (valor: string | null) => valor !== null && /^[1-9]\d*$/.test(valor) && Number.isSafeInteger(Number(valor));
  if (!idValido(actividad) || !['participacion', modalidad].includes(parametros.get('origen') ?? '')
    || !['actividad', 'sesion'].includes(modalidad) || (modalidad === 'sesion' ? !idValido(sesion) : sesion !== null)) return error;
  return { modalidad: modalidad as 'sesion' | 'actividad', actividad: Number(actividad), sesion: sesion === null ? null : Number(sesion) };
}
@Component({
  selector: 'app-generar-emitir', standalone: true,
  imports: [DatePipe, ReactiveFormsModule, RouterLink, PageTitleComponent, ListarCertificadosComponent, VisorCertificadoComponent, FormularioCertificadoComponent, VisorPdfComponent],
  templateUrl: './generar-emitir.component.html', styleUrls: ['../compartidos/emision.scss', './generar-emitir.component.scss'],
})
export class GenerarEmitirComponent {
  protected readonly pasoBeneficiario = signal<1 | 2 | 3 | 4>(1);
  protected readonly mensajeCertificado = inject(NonNullableFormBuilder).control('', [validarMensajeCertificado]);
  protected readonly avisoMensaje = 'El mensaje se utilizará para generar el PDF de vista previa. Todavía no se almacena como certificado emitido.';
  protected readonly pdfPrevio = signal<{ archivo: ArchivoPdf; datos: Omit<VistaPreviaSesion, 'vista_previa_pdf'>; mensaje: string; clave: string } | null>(null);
  protected readonly generandoPrevia = signal(false);
  protected readonly errorPrevia = signal<string | null>(null);
  protected readonly revisoPrevia = signal(false);
  private solicitudPrevia?: Subscription;
  private invalidarPrevia(): void {
    this.solicitudPrevia?.unsubscribe(); this.pdfPrevio.set(null); this.generandoPrevia.set(false); this.revisoPrevia.set(false); this.errorPrevia.set(null);
  }
  protected editarMensaje(): void { this.revisoPrevia.set(false); this.pasoBeneficiario.set(2); }
  protected continuarConfirmacion(): void {
    if (this.pdfPrevio()?.mensaje === this.mensajeCertificado.value && this.pdfPrevio()?.clave === this.claveBorrador() && !this.generandoPrevia()) this.pasoBeneficiario.set(4);
  }
  protected previsualizarPdf(): void {
    if (this.generandoPrevia()) return;
    this.mensajeCertificado.markAsTouched();
    const v = this.revisionBeneficiario();
    if (!v || this.mensajeCertificado.invalid) return;
    const sesion = Number(v.beneficiario.id_sesion); const participacion = v.beneficiario.id_participacion; const tipo = Number(v.tipo.id_tipo_certificado);
    if (!this.puedeRevisar(v.beneficiario, v.evaluacion) || v.evaluacion.origen !== 'sesion'
      || ![sesion, participacion, tipo].every(id => Number.isSafeInteger(id) && id > 0)) {
      this.errorPrevia.set('No se pudo confirmar la sesión, participación y tipo de certificado.'); return;
    }
    const mensaje = this.mensajeCertificado.value; const clave = this.claveBorrador()!;
    this.invalidarPrevia(); this.generandoPrevia.set(true);
    this.solicitudPrevia = this.documentosApi.vistaPrevia(sesion, participacion, tipo, mensaje).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: resultado => {
        if (clave !== this.claveBorrador() || mensaje !== this.mensajeCertificado.value) return;
        this.generandoPrevia.set(false);
        if (Number(resultado.datos.contexto.id_persona) !== v.beneficiario.id_persona || Number(resultado.datos.contexto.id_actividad) !== v.beneficiario.id_actividad) {
          this.errorPrevia.set('Laravel devolvió un PDF de otro contexto.'); return;
        }
        this.pdfPrevio.set({ ...resultado, mensaje, clave }); this.pasoBeneficiario.set(3);
      }, error: (e: ErrorApi) => { this.generandoPrevia.set(false); this.errorPrevia.set(mensajeDocumento(e)); },
    });
  }
  private readonly borradoresMensaje = new Map<string, string>();
  private claveBorrador(): string | null {
    const v = this.revisionBeneficiario();
    return v ? [v.beneficiario.id_persona, v.beneficiario.id_participacion, v.evaluacion.contexto.id_actividad, v.beneficiario.id_sesion, v.tipo.id_tipo_certificado].join(':') : null;
  }
  protected textoSugerido(): string {
    const v = this.revisionBeneficiario(); if (!v) return '';
    const fecha = v.sesion?.['fecha'] ?? (v.evaluacion.origen === 'actividad' ? v.actividad?.['fecha_inicio'] : null);
    let fechaTexto = ''; if (typeof fecha === 'string' && !Number.isNaN(Date.parse(fecha))) fechaTexto = formatDate(fecha, 'dd/MM/yyyy', 'en-US');
    return `Por su participación en la actividad ${v.evaluacion.contexto.nombre_actividad}${v.evaluacion.contexto.nombre_sesion ? ', correspondiente a la sesión ' + v.evaluacion.contexto.nombre_sesion : ''}${fechaTexto ? ', realizada el ' + fechaTexto : ''}, organizada por la Municipalidad Distrital de Morales.`;
  }
  protected avanzarBeneficiario(): void {
    if (!this.revisionBeneficiario()) return;
    if (this.pasoBeneficiario() === 1) this.pasoBeneficiario.set(2);
    else if (this.pasoBeneficiario() === 2) {
      this.mensajeCertificado.markAsTouched();
      if (this.mensajeCertificado.valid) this.previsualizarPdf();
    }
  }
  protected readonly estadoBeneficiario = estadoBeneficiario;
  protected readonly motivosPreparacion = motivosPreparacion;
  protected readonly motivoEmision = motivoEmision;
  protected readonly revisionBeneficiario = signal<{ beneficiario: BeneficiarioCertificacion; tipo: TipoCertificado; evaluacion: EvaluacionCertificacion; actividad: RegistroEmision | null; sesion: RegistroEmision | null } | null>(null);
  protected readonly cargandoRevision = signal(false);
  protected readonly errorRevision = signal<string | null>(null);
  private consultaRevision?: Subscription;
  protected cerrarRevision(): void {
    this.invalidarPrevia();
    const clave = this.claveBorrador(); if (clave) this.borradoresMensaje.set(clave, this.mensajeCertificado.value);
    this.consultaRevision?.unsubscribe(); this.revisionBeneficiario.set(null); this.errorRevision.set(null); this.cargandoRevision.set(false);
    this.pasoBeneficiario.set(1);
  }
  protected puedeRevisar(b: BeneficiarioCertificacion, r: EvaluacionCertificacion): boolean {
    return this.auth.tienePermiso('participantes.ver') && this.evaluacion() === r && r.beneficiarios.data.includes(b)
      && mismoContexto(b, r) && this.tiposEvaluacion().some(t => Number(t.id_tipo_certificado) === Number(b.id_tipo_certificado));
  }
  protected revisarBeneficiario(b: BeneficiarioCertificacion, r: EvaluacionCertificacion): void {
    if (!this.puedeRevisar(b, r)) return;
    this.cerrarRevision(); this.cargandoRevision.set(true);
    const tipo = this.tiposEvaluacion().find(t => Number(t.id_tipo_certificado) === Number(b.id_tipo_certificado))!;
    const actividadId = Number(r.contexto.id_actividad); const sesionId = r.origen === 'sesion' ? Number(r.contexto.id_sesion) : null;
    const actividad = [this.contexto().actividad, ...this.actividadesFiltro()].find(a => a && Number(a['id_actividad']) === actividadId) ?? null;
    const sesion = [this.contexto().sesion, ...this.sesionesFiltro()].find(s => s && Number(s['id_actividad_sesion']) === sesionId && Number(s['id_actividad']) === actividadId) ?? null;
    const consultar = this.auth.tienePermiso('actividades.ver');
    this.consultaRevision = forkJoin({
      actividad: actividad ? of(actividad) : consultar ? this.api.obtener('activity', actividadId) : of(null),
      sesion: sesion || sesionId === null ? of(sesion) : consultar ? this.api.obtener('activity-session', sesionId) : of(null),
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: datos => {
        this.cargandoRevision.set(false);
        if (this.evaluacion() !== r || datos.actividad && Number(datos.actividad['id_actividad']) !== actividadId
          || datos.sesion && (Number(datos.sesion['id_actividad_sesion']) !== sesionId || Number(datos.sesion['id_actividad']) !== actividadId)) {
          this.errorRevision.set('Laravel no confirmó el contexto de la revisión.'); return;
        }
        if (datos.actividad && !this.actividadesFiltro().some(a => Number(a['id_actividad']) === actividadId)) this.actividadesFiltro.update(a => [...a, datos.actividad!]);
        if (datos.sesion && !this.sesionesFiltro().some(s => Number(s['id_actividad_sesion']) === sesionId)) this.sesionesFiltro.update(s => [...s, datos.sesion!]);
        this.revisionBeneficiario.set({ beneficiario: b, tipo, evaluacion: r, ...datos });
        this.mensajeCertificado.setValue(this.borradoresMensaje.get(this.claveBorrador()!) ?? this.textoSugerido());
        this.mensajeCertificado.markAsUntouched(); this.pasoBeneficiario.set(1);
      }, error: (e: ErrorApi) => { this.cargandoRevision.set(false); this.errorRevision.set(this.mensajeConsulta(e)); },
    });
  }
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly escrituraAutorizada = inject(ESCRITURA_EMISION_AUTORIZADA);
  protected readonly formulario = viewChild(FormularioCertificadoComponent);
  protected readonly contextosFormulario = signal([contextoParametros(this.route.snapshot.queryParamMap)]);
  protected readonly modo = signal<'existente' | 'nuevo'>('existente');
  private readonly api = inject(EmisionCertificadosService);
  private readonly documentosApi = inject(DocumentosDigitalesService);
  protected readonly generado = signal<DocumentoGenerado | null>(null);
  protected readonly generando = signal(false);
  protected readonly errorGeneracion = signal<string | null>(null);
  protected readonly enlaceVerificacion = enlaceVerificacionSeguro;
  private generacion?: Subscription;
  protected puedeGenerarPdf(): boolean {
    const registro = this.seleccion()?.registro;
    return this.contexto().general && !!registro?.id_certificado && !!registro.id_participacion
      && !registro.id_practica && !registro.id_reconocimiento && this.auth.tienePermiso('emision.crear')
      && !this.cargando() && !this.error() && !this.generando();
  }
  protected generarPdf(): void {
    if (!this.puedeGenerarPdf() || this.generado()) return;
    this.generando.set(true); this.errorGeneracion.set(null);
    this.generacion = this.documentosApi.generar(this.seleccion()!.registro.id_certificado!).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: documento => { this.generado.set(documento); this.generando.set(false); },
      error: (e: ErrorApi) => { this.errorGeneracion.set(mensajeDocumento(e)); this.generando.set(false); },
    });
  }
  private readonly practicas = inject(PracticeService);
  protected readonly auth = inject(AuthService);
  protected readonly seccion = signal<'pendientes' | 'preparaciones'>('pendientes');
  protected readonly preparacionesVisitadas = signal(false);
  protected readonly viendoBeneficiarios = signal(false);
  protected readonly elegibilidad = signal('');
  protected volverPendientes(): void { this.cerrarRevision(); this.viendoBeneficiarios.set(false); }
  protected readonly contexto = toSignal(this.route.queryParamMap.pipe(
    map(solicitarContexto), distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
    switchMap((solicitud): Observable<ContextoEmision> => {
      const base: ContextoEmision = { general: solicitud.modalidad === 'general', modalidad: null, cargando: false, error: null, actividad: null, sesion: null };
      if (solicitud.modalidad === 'general') return of(base);
      if (solicitud.modalidad === 'invalido') return of({ ...base, error: solicitud.error });
      base.modalidad = solicitud.modalidad;
      if (!this.auth.tienePermiso('actividades.ver')) return of({ ...base, error: 'No tienes permiso para verificar la actividad y su sesión.' });
      return forkJoin({ actividad: this.api.obtener('activity', solicitud.actividad),
        sesion: solicitud.sesion === null ? of(null) : this.api.obtener('activity-session', solicitud.sesion) }).pipe(
        map(({ actividad, sesion }) => {
          if (Number(actividad['id_actividad']) !== solicitud.actividad || typeof actividad['nombre'] !== 'string' || !actividad['nombre'].trim()
            || (solicitud.sesion !== null && (!sesion || Number(sesion['id_actividad_sesion']) !== solicitud.sesion || Number(sesion['id_actividad']) !== solicitud.actividad || typeof sesion['nombre'] !== 'string' || !sesion['nombre'].trim()))) {
            throw new Error('Laravel no confirmó la correspondencia entre la actividad y la sesión.');
          }
          return { ...base, actividad, sesion };
        }), catchError((error: ErrorApi | Error) => of({ ...base, error: error instanceof Error ? error.message : `${error.status ? `HTTP ${error.status}. ` : ''}${error.mensaje || 'No se pudo verificar el contexto.'}` })),
        startWith({ ...base, cargando: true }));
    }),
  ), { initialValue: { general: solicitarContexto(this.route.snapshot.queryParamMap).modalidad === 'general', modalidad: null, cargando: false, error: null, actividad: null, sesion: null } as ContextoEmision });
  private readonly destroyRef = inject(DestroyRef);
  private carga?: Subscription;
  protected readonly paso = signal(1);
  protected readonly seleccion = signal<SeleccionCertificado | null>(null);
  protected readonly origen = signal<string | null>(null);
  protected readonly reconocimiento = signal<Reconocimiento | null>(null);
  protected readonly asignaciones = signal<readonly { firma: number; orden: number }[]>([]);
  protected readonly error = signal<string | null>(null);
  protected readonly cargando = signal(false);
  protected readonly estado = etiquetaEstado;
  protected readonly pasos = ['Seleccionar origen y registro', 'Preparar certificado', 'Revisar documento', 'Generar y emitir'];
  protected readonly revision = inject(NonNullableFormBuilder).group({ datos: [false, Validators.requiredTrue], origen: [false, Validators.requiredTrue] });
  protected readonly filtrosPendientes = inject(NonNullableFormBuilder).group({ origen: 'sesion', actividad: '', sesion: '', tipo: '', cantidad: '20' });
  protected readonly sesionesFiltro = signal<readonly RegistroEmision[]>([]);
  protected readonly pendientes = signal<PaginaEmision<PendienteCertificacion> | null>(null);
  protected readonly evaluacion = signal<EvaluacionCertificacion | null>(null);
  protected readonly cargandoPendientes = signal(false);
  protected readonly cargandoBeneficiarios = signal(false);
  protected readonly errorPendientes = signal<string | null>(null);
  protected readonly errorBeneficiarios = signal<string | null>(null);
  protected readonly errorCatalogos = signal<string | null>(null);
  protected readonly tiposEvaluacion = signal<readonly TipoCertificado[]>([]);
  protected readonly actividadesFiltro = signal<readonly RegistroEmision[]>([]);
  private destinoBeneficiarios: { origen: OrigenCertificacion; actividad: number; sesion: number | null } | null = null;
  private consultaPendientes?: Subscription;
  private consultaBeneficiarios?: Subscription;
  private consultaCatalogos?: Subscription;
  private catalogosCargados = false;
  constructor() {
    this.mensajeCertificado.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.invalidarPrevia());
    if (solicitarContexto(this.route.snapshot.queryParamMap).modalidad === 'general') {
      this.cargarPendientes(); this.cargarCatalogosEvaluacion();
    }
    effect(() => {
      const ctx = this.contexto();
      if (!ctx.general && ctx.actividad && !ctx.error && !ctx.cargando) untracked(() => {
        this.filtrosPendientes.patchValue({ origen: ctx.modalidad!, actividad: String(ctx.actividad!['id_actividad']), tipo: '' });
        this.destinoBeneficiarios = { origen: ctx.modalidad!, actividad: Number(ctx.actividad!['id_actividad']), sesion: ctx.sesion ? Number(ctx.sesion['id_actividad_sesion']) : null };
        this.viendoBeneficiarios.set(true); this.cargarPendientes(); this.cargarCatalogosEvaluacion();
      });
    }, { allowSignalWrites: true });
    let contexto = contextoParametros(this.route.snapshot.queryParamMap);
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(parametros => {
      const siguiente = contextoParametros(parametros);
      if (siguiente === contexto) return;
      contexto = siguiente; this.cerrarRevision(); this.generacion?.unsubscribe(); this.generado.set(null); this.generando.set(false); this.carga?.unsubscribe(); this.seleccion.set(null); this.error.set(null); this.cargando.set(false);
      this.consultaPendientes?.unsubscribe(); this.consultaBeneficiarios?.unsubscribe(); this.consultaCatalogos?.unsubscribe();
      this.pendientes.set(null); this.evaluacion.set(null); this.destinoBeneficiarios = null;
      this.cargandoPendientes.set(false); this.cargandoBeneficiarios.set(false); this.errorPendientes.set(null); this.errorBeneficiarios.set(null);
      this.filtrosPendientes.reset({ origen: 'sesion', actividad: '', tipo: '', cantidad: '20' });
      this.catalogosCargados = false; this.tiposEvaluacion.set([]); this.actividadesFiltro.set([]);
      this.contextosFormulario.set([siguiente]);
      const general = solicitarContexto(parametros).modalidad === 'general';
      this.seccion.set('pendientes'); this.preparacionesVisitadas.set(false); this.viendoBeneficiarios.set(false);
      this.modo.set('existente');
      this.paso.set(1);
      if (general) { this.cargarPendientes(); this.cargarCatalogosEvaluacion(); }
    });
  }
  protected seleccionar(seleccion: SeleccionCertificado, preparado = false): void {
    if (!this.contexto().general || seleccion.registro.id_certificado === null) return;
    this.generacion?.unsubscribe(); this.generado.set(null); this.generando.set(false); this.errorGeneracion.set(null);
    this.carga?.unsubscribe(); this.seleccion.set(seleccion); this.origen.set(null); this.reconocimiento.set(null); this.asignaciones.set([]);
    this.error.set(null); this.revision.reset(); this.paso.set(preparado ? 3 : 2); this.cargando.set(true);
    const fila = seleccion.registro;
    if ([fila.id_participacion, fila.id_practica, fila.id_reconocimiento].filter(id => id !== null).length !== 1) {
      this.error.set('El certificado debe tener exactamente un origen válido.'); this.cargando.set(false); return;
    }
    const permisos = fila.id_participacion ? 'participantes.ver' : fila.id_practica ? 'practicantes.ver' : 'reconocimientos.ver';
    if (!this.auth.tienePermiso(permisos)) { this.error.set(`No tienes el permiso ${permisos} para revisar este origen.`); this.cargando.set(false); return; }
    const origen: Observable<{ texto: string; actividad: number | null; reconocimiento: Reconocimiento | null }> = fila.id_participacion ? this.api.obtener('participation', fila.id_participacion).pipe(
      switchMap(participacion => this.api.obtener('activity', Number(participacion['id_actividad'])).pipe(map(actividad => ({ texto: `Participación #${fila.id_participacion} · ${actividad['nombre']}`, actividad: Number(actividad['id_actividad']), reconocimiento: null })))),
    ) : fila.id_reconocimiento ? this.api.obtener('reconocimientos', fila.id_reconocimiento).pipe(map(registro => ({ texto: `Reconocimiento #${registro.id_reconocimiento} · ${registro.titulo}`, actividad: null, reconocimiento: registro })))
      : fila.id_practica ? this.practicas.obtener(fila.id_practica).pipe(map(practica => ({ texto: `Práctica #${practica.id_practica} · ${practica.carrera} · ${practica.fecha_inicio} – ${practica.fecha_fin ?? 'Sin fin registrado'}`, actividad: null, reconocimiento: null })))
        : of({ texto: 'No hay origen asociado', actividad: null, reconocimiento: null });
    this.carga = origen.pipe(switchMap(datos => forkJoin({
      documentos: preparado ? this.api.documentosIdentidad().pipe(catchError(() => of({} as Readonly<Partial<Record<number, string>>>))) : of(null),
      datos: of(datos), asignaciones: datos.actividad && this.auth.tienePermiso('ponentes-firmantes.ver')
        ? this.api.listarTodos('actividades-firmas', { id_actividad: datos.actividad }).pipe(catchError((error: ErrorApi) => { this.error.set('Asignaciones: ' + error.mensaje); return of(null); })) : of(null),
    })), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: ({ datos, asignaciones, documentos }) => { if (documentos) this.seleccion.set({ ...seleccion, dni: documentos[fila.id_persona] ?? null }); this.origen.set(datos.texto); this.reconocimiento.set(datos.reconocimiento); this.asignaciones.set((asignaciones ?? []).map(firma => ({ firma: firma.id_firma, orden: firma.orden_firma })).sort((a, b) => a.orden - b.orden)); this.cargando.set(false); },
      error: (error: ErrorApi | Error) => { this.error.set(error instanceof Error ? error.message : error.mensaje); this.cargando.set(false); },
    });
  }
  protected avanzar(): void {
    if (!this.contexto().general) return;
    if (!this.seleccion() || this.cargando() || this.error()) return;
    if (this.paso() === 2) { this.revision.markAllAsTouched(); if (this.revision.invalid || !this.origen() || this.error()) return; }
    this.paso.update(paso => Math.min(4, paso + 1));
  }
  protected volver(): void { this.paso.update(paso => Math.max(1, paso - 1)); }
  protected cancelar(): void {
    if (this.generando()) return;
    this.generacion?.unsubscribe(); this.generado.set(null);
    this.carga?.unsubscribe(); this.seleccion.set(null); this.error.set(null); this.cargando.set(false); this.revision.reset();
    this.modo.set('existente'); this.paso.set(1);
    void this.router.navigate([], { relativeTo: this.route, queryParams: {}, replaceUrl: true });
  }
  protected nuevo(): void {
    if (!this.contexto().general || !this.auth.tienePermiso('emision.crear')) return;
    this.seleccion.set(null); this.modo.set('nuevo'); this.paso.set(1);
  }
  protected cambiarSeccion(seccion: 'pendientes' | 'preparaciones'): void {
    this.seccion.set(seccion);
    if (seccion === 'preparaciones' && this.contexto().general) this.preparacionesVisitadas.set(true);
    if (seccion === 'pendientes' && !this.pendientes() && !this.cargandoPendientes() && !this.contexto().error && !this.contexto().cargando) { this.cargarPendientes(); this.cargarCatalogosEvaluacion(); }
  }
  protected nombreTipoEvaluacion(id: number | null): string {
    return id === null ? 'Sin tipo determinado' : this.tiposEvaluacion().find(t => Number(t.id_tipo_certificado) === Number(id))?.nombre_tipo ?? 'Nombre no disponible';
  }
  private mensajeConsulta(error: ErrorApi): string {
    return `${error.status ? `HTTP ${error.status}. ` : ''}${error.mensaje} ${Object.values(error.errores ?? {}).flat().join(' ')}`.trim();
  }
  protected cargarCatalogosEvaluacion(): void {
    if (this.catalogosCargados) return;
    this.catalogosCargados = true; this.errorCatalogos.set(null);
    this.consultaCatalogos = forkJoin({ tipos: this.api.listarTodos('tipos-certificado'),
      actividades: this.contexto().general ? this.api.listarTodos('activity') : of([]), sesiones: this.contexto().general ? this.api.listarTodos('activity-session') : of([]) }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: datos => { this.tiposEvaluacion.set(datos.tipos); this.actividadesFiltro.set(datos.actividades); this.sesionesFiltro.set(datos.sesiones); },
      error: error => { this.catalogosCargados = false; this.errorCatalogos.set(this.mensajeConsulta(error)); },
    });
  }
  protected aplicarFiltrosPendientes(): void {
    this.cerrarRevision();
    this.consultaBeneficiarios?.unsubscribe(); this.evaluacion.set(null);
    if (this.contexto().general) this.destinoBeneficiarios = null;
    if (['practica', 'reconocimiento'].includes(this.filtrosPendientes.controls.origen.value)) return;
    this.cargarPendientes();
    if (this.destinoBeneficiarios) this.cargarBeneficiarios();
  }
  protected cargarPendientes(pagina = 1): void {
    const ctx = this.contexto(); if (ctx.error || ctx.cargando || ['practica', 'reconocimiento'].includes(this.filtrosPendientes.controls.origen.value)) return;
    this.consultaPendientes?.unsubscribe(); this.errorPendientes.set(null); this.cargandoPendientes.set(true);
    const f = this.filtrosPendientes.getRawValue();
    const origen: OrigenCertificacion = ctx.general ? f.origen === 'actividad' ? 'actividad' : 'sesion' : ctx.modalidad!;
    const actividad = ctx.general ? f.actividad : String(ctx.actividad!['id_actividad']);
    this.consultaPendientes = this.api.pendientesCertificacion({ origen, id_actividad: actividad || null,
      id_sesion: !ctx.general && ctx.sesion ? Number(ctx.sesion['id_actividad_sesion']) : f.sesion || null,
      id_tipo_certificado: f.tipo || null, page: pagina, per_page: Number(f.cantidad) }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: datos => {
        this.cargandoPendientes.set(false);
        if (!Array.isArray(datos.data) || datos.data.some(r => r.origen !== origen || (actividad && Number(r.id_actividad) !== Number(actividad)) || (!ctx.general && ctx.sesion && Number(r.id_sesion) !== Number(ctx.sesion['id_actividad_sesion'])))) {
          this.pendientes.set(null); this.errorPendientes.set('Laravel devolvió registros de otro contexto.'); return;
        }
        this.pendientes.set(datos);
      }, error: error => { this.cargandoPendientes.set(false); this.pendientes.set(null); this.errorPendientes.set(this.mensajeConsulta(error)); },
    });
  }
  protected consultarBeneficiarios(fila: PendienteCertificacion): void {
    this.elegibilidad.set('');
    if (!this.filtrosPendientes.controls.tipo.value) {
      const compatibles = this.tiposEvaluacion().filter(t => fila.tipos_certificado_permitidos?.includes(Number(t.id_tipo_certificado)));
      if (compatibles.length === 1) this.filtrosPendientes.controls.tipo.setValue(String(compatibles[0].id_tipo_certificado));
    }
    this.viendoBeneficiarios.set(true);
    this.destinoBeneficiarios = { origen: fila.origen, actividad: Number(fila.id_actividad), sesion: fila.id_sesion === null ? null : Number(fila.id_sesion) };
    this.cargarBeneficiarios();
  }
  protected cargarBeneficiarios(pagina = 1): void {
    this.cerrarRevision();
    const d = this.destinoBeneficiarios; if (!d) return;
    this.consultaBeneficiarios?.unsubscribe(); this.evaluacion.set(null); this.errorBeneficiarios.set(null);
    if (!this.auth.tienePermiso('participantes.ver')) { this.errorBeneficiarios.set('No tienes el permiso participantes.ver para consultar beneficiarios.'); return; }
    const tipo = this.filtrosPendientes.controls.tipo.value;
    if (!this.tiposEvaluacion().some(t => String(t.id_tipo_certificado) === tipo)) {
      this.errorBeneficiarios.set('Selecciona un tipo de certificado válido para consultar beneficiarios.'); return;
    }
    this.cargandoBeneficiarios.set(true);
    this.consultaBeneficiarios = this.api.beneficiariosCertificacion(d.origen, d.sesion ?? d.actividad,
      { origen: d.origen, id_actividad: d.actividad, id_sesion: d.sesion, id_tipo_certificado: this.filtrosPendientes.controls.tipo.value || null,
        page: pagina, per_page: Number(this.filtrosPendientes.controls.cantidad.value) }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: datos => {
        this.cargandoBeneficiarios.set(false);
        if (datos.origen !== d.origen || Number(datos.contexto.id_actividad) !== d.actividad || (d.origen === 'sesion' && Number(datos.contexto.id_sesion) !== d.sesion)
          || datos.beneficiarios.data.some(b => Number(b.id_actividad) !== d.actividad || (d.origen === 'sesion' ? Number(b.id_sesion) !== d.sesion : b.id_sesion !== null))) {
          this.errorBeneficiarios.set('Laravel devolvió beneficiarios de otro contexto.'); return;
        }
        this.evaluacion.set(datos);
      }, error: error => { this.cargandoBeneficiarios.set(false); this.errorBeneficiarios.set(this.mensajeConsulta(error)); },
    });
  }
  protected teclearSecciones(evento: KeyboardEvent): void {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(evento.key)) return;
    evento.preventDefault();
    const destino = evento.key === 'Home' ? 'pendientes' : evento.key === 'End' ? 'preparaciones' : this.seccion() === 'pendientes' ? 'preparaciones' : 'pendientes';
    this.cambiarSeccion(destino);
    (evento.currentTarget as HTMLElement).querySelector<HTMLElement>('#emision-tab-' + destino)?.focus();
  }
}
