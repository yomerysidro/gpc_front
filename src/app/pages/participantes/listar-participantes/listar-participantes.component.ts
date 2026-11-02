import { afterNextRender, Component, computed, DestroyRef, inject, signal, viewChild, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { ErrorApi } from '../../../core/interfaces/api/api-response.interface';
import { ActividadInscripcion, DocumentoInscripcion, FiltrosInscripcion, Inscripcion, InscripcionPayload, PersonaInscripcion, TipoInscripcion } from '../../../core/interfaces/participantes/participante.interface';
import { ParticipantesService } from '../../../core/services/participantes/participantes.service';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { fechaHoyLima, filtrarInscripciones, hayDuplicado } from '../../../models/participantes/inscripcion.model';
import { DialogoComponent } from '../../../shared/components/dialogo/dialogo.component';
import { PageTitleComponent } from '../../../shared/components/page-title/page-title.component';
import { HasPermissionDirective } from '../../../shared/directives/has-permission.directive';

type Catalogo = 'personas' | 'actividades' | 'tipos' | 'documentos';

@Component({
  selector: 'app-listar-participantes', standalone: true,
  imports: [ReactiveFormsModule, PageTitleComponent, DialogoComponent, HasPermissionDirective],
  templateUrl: './listar-participantes.component.html', styleUrl: './listar-participantes.component.scss',
})
export class ListarParticipantesComponent {
  private readonly servicio = inject(ParticipantesService);
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogoDetalle = viewChild.required<DialogoComponent>('dialogoDetalle');
  private readonly dialogoEstado = viewChild.required<DialogoComponent>('dialogoEstado');
  private solicitudDetalle?: Subscription;
  protected readonly inscripciones = signal<readonly Inscripcion[]>([]);
  protected readonly personas = signal<readonly PersonaInscripcion[]>([]);
  protected readonly actividades = signal<readonly ActividadInscripcion[]>([]);
  protected readonly tipos = signal<readonly TipoInscripcion[]>([]);
  protected readonly documentos = signal<readonly DocumentoInscripcion[]>([]);
  protected readonly cargando = signal(true);
  protected readonly errorCarga = signal<string | null>(null);
  protected readonly cargandoCatalogos = signal<Record<Catalogo, boolean>>({ personas: true, actividades: true, tipos: true, documentos: true });
  protected readonly erroresCatalogos = signal<Partial<Record<Catalogo, string>>>({});
  protected readonly avisosCatalogos = computed(() => Object.entries(this.erroresCatalogos()).filter(([, mensaje]) => !!mensaje));
  protected readonly etiquetas: Record<string, string> = { personas: 'Personas', actividades: 'Actividades', tipos: 'Tipos de participación', documentos: 'Documentos' };
  protected readonly cargandoAlgunCatalogo = computed(() => Object.values(this.cargandoCatalogos()).some(Boolean));
  protected readonly catalogosDisponibles = computed(() => ['personas', 'actividades', 'tipos'].every(clave =>
    !this.cargandoCatalogos()[clave as Catalogo] && !this.erroresCatalogos()[clave as Catalogo])
    && this.personas().length > 0 && this.actividades().length > 0 && this.tipos().length > 0);
  private readonly personasPorId = computed(() => new Map(this.personas().map(item => [item.id_persona, item])));
  private readonly actividadesPorId = computed(() => new Map(this.actividades().map(item => [item.id_actividad, item.nombre])));
  private readonly tiposPorId = computed(() => new Map(this.tipos().map(item => [item.id_tipo_participacion, item.nombre])));
  private readonly documentosPorPersona = computed(() => {
    const mapa = new Map<number, string[]>();
    for (const documento of this.documentos()) mapa.set(documento.id_persona, [...(mapa.get(documento.id_persona) ?? []), documento.numero_documento]);
    return mapa;
  });
  protected readonly estados = computed(() => [...new Set(this.inscripciones().map(item => item.estado))].sort());
  protected readonly filtros = signal<FiltrosInscripcion>({ busqueda: '', actividad: '', tipo: '', estado: '' });
  protected readonly filtradas = computed(() => filtrarInscripciones(this.inscripciones(), this.filtros(),
    id => `${this.nombrePersona(id)} ${this.documentoPersona(id)}`));
  protected readonly pagina = signal(1);
  protected readonly porPagina = signal(10);
  protected readonly totalPaginas = computed(() => Math.max(1, Math.ceil(this.filtradas().length / this.porPagina())));
  protected readonly paginaActual = computed(() => Math.min(this.pagina(), this.totalPaginas()));
  protected readonly visibles = computed(() => this.filtradas().slice((this.paginaActual() - 1) * this.porPagina(), this.paginaActual() * this.porPagina()));
  protected readonly rango = computed(() => ({ desde: this.filtradas().length ? (this.paginaActual() - 1) * this.porPagina() + 1 : 0,
    hasta: Math.min(this.paginaActual() * this.porPagina(), this.filtradas().length), total: this.filtradas().length }));
  protected readonly formularioAbierto = signal(false);
  protected readonly editando = signal<number | null>(null);
  protected readonly cargandoEdicion = signal(false);
  protected readonly enviando = signal(false);
  protected readonly errorFormulario = signal<string | null>(null);
  protected readonly erroresServidor = signal<ErrorApi['errores']>({});
  protected readonly aviso = signal<{ tipo: 'exito' | 'error'; texto: string } | null>(null);
  protected readonly detalle = signal<Inscripcion | null>(null);
  protected readonly cargandoDetalle = signal(false);
  protected readonly errorDetalle = signal<string | null>(null);
  protected readonly porCambiarEstado = signal<Inscripcion | null>(null);
  protected readonly guardandoEstado = signal(false);
  protected readonly errorEstado = signal<string | null>(null);
  protected readonly nuevoEstado = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/.*\S.*/), Validators.maxLength(30)] });
  protected readonly form = inject(NonNullableFormBuilder).group({
    id_persona: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
    id_actividad: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
    id_tipo_participacion: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
    fecha_inscripcion: [fechaHoyLima(), Validators.required],
    estado: ['', [Validators.required, Validators.pattern(/.*\S.*/), Validators.maxLength(30)]],
  });

  constructor() {
    afterNextRender(() => { this.cargar(); this.cargarCatalogos(); });
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.erroresServidor.set({}));
  }
  protected cargar(): void {
    this.cargando.set(true); this.errorCarga.set(null);
    this.servicio.listar().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: datos => { this.inscripciones.set(datos); this.cargando.set(false); },
      error: (error: ErrorApi) => { this.errorCarga.set(this.mensajeError(error)); this.cargando.set(false); },
    });
  }
  protected cargarCatalogos(): void {
    this.cargarCatalogo('personas', this.servicio.personas(), this.personas);
    this.cargarCatalogo('actividades', this.servicio.actividades(), this.actividades);
    this.cargarCatalogo('tipos', this.servicio.tipos(), this.tipos);
    this.cargarCatalogo('documentos', this.servicio.documentos(), this.documentos);
  }
  private cargarCatalogo<T>(clave: Catalogo, consulta: Observable<readonly T[]>, destino: WritableSignal<readonly T[]>): void {
    this.cargandoCatalogos.update(estado => ({ ...estado, [clave]: true }));
    this.erroresCatalogos.update(errores => ({ ...errores, [clave]: undefined }));
    consulta.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: datos => { destino.set(datos); this.cargandoCatalogos.update(estado => ({ ...estado, [clave]: false })); },
      error: (error: ErrorApi) => {
        this.erroresCatalogos.update(errores => ({ ...errores, [clave]: this.mensajeError(error) }));
        this.cargandoCatalogos.update(estado => ({ ...estado, [clave]: false }));
      },
    });
  }
  protected filtrar(clave: keyof FiltrosInscripcion, valor: string): void { this.filtros.update(filtros => ({ ...filtros, [clave]: valor })); this.pagina.set(1); }
  protected limpiarFiltros(): void { this.filtros.set({ busqueda: '', actividad: '', tipo: '', estado: '' }); this.pagina.set(1); }
  protected cambiarTamano(valor: string): void { if ([10, 20, 50].includes(Number(valor))) { this.porPagina.set(Number(valor)); this.pagina.set(1); } }
  protected nombrePersona(id: number): string {
    const persona = this.personasPorId().get(id);
    return persona ? [persona.nombres, persona.apellido_paterno, persona.apellido_materno].filter(Boolean).join(' ') : `Persona no disponible (#${id})`;
  }
  protected documentoPersona(id: number): string { return this.documentosPorPersona().get(id)?.join(' / ') ?? ''; }
  protected nombreActividad(id: number): string { return this.actividadesPorId().get(id) ?? `Actividad no disponible (#${id})`; }
  protected nombreTipo(id: number): string { return this.tiposPorId().get(id) ?? `Tipo no disponible (#${id})`; }
  protected fecha(valor: string): string { const [anio, mes, dia] = valor.slice(0, 10).split('-'); return `${dia}/${mes}/${anio}`; }
  protected abrirFormulario(item: Inscripcion | null): void {
    if (this.enviando() || this.guardandoEstado() || (item && !this.auth.tienePermiso('participantes.editar'))) return;
    this.solicitudDetalle?.unsubscribe(); this.editando.set(item?.id_participacion ?? null);
    this.formularioAbierto.set(true); this.errorFormulario.set(null); this.erroresServidor.set({});
    this.form.reset({ fecha_inscripcion: fechaHoyLima() }); this.cargandoEdicion.set(!!item);
    if (!item) return;
    this.solicitudDetalle = this.servicio.obtener(item.id_participacion).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: actual => { this.form.reset({ id_persona: String(actual.id_persona), id_actividad: String(actual.id_actividad),
        id_tipo_participacion: String(actual.id_tipo_participacion), fecha_inscripcion: actual.fecha_inscripcion.slice(0, 10), estado: actual.estado }); this.cargandoEdicion.set(false); },
      error: (error: ErrorApi) => { this.cargandoEdicion.set(false); this.errorFormulario.set(this.mensajeError(error)); },
    });
  }
  protected cerrarFormulario(): void { if (!this.enviando()) { this.solicitudDetalle?.unsubscribe(); this.formularioAbierto.set(false); } }
  protected errorCampo(clave: keyof typeof this.form.controls): string | null {
    if (this.erroresServidor()[clave]?.[0]) return this.erroresServidor()[clave][0];
    const control = this.form.controls[clave];
    if (!control.touched || control.valid) return null;
    return control.hasError('maxlength') ? 'Máximo 30 caracteres.' : 'Completa este campo con un valor válido.';
  }
  protected guardar(): void {
    if (this.enviando() || this.cargandoEdicion()) return;
    this.errorFormulario.set(null);
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const id = this.editando();
    if (!this.auth.tienePermiso(id === null ? 'participantes.crear' : 'participantes.editar')) {
      this.errorFormulario.set('Tu sesión no tiene permiso para guardar esta inscripción.'); return;
    }
    const valores = this.form.getRawValue();
    const payload: InscripcionPayload = { id_persona: Number(valores.id_persona), id_actividad: Number(valores.id_actividad),
      id_tipo_participacion: Number(valores.id_tipo_participacion), fecha_inscripcion: valores.fecha_inscripcion, estado: valores.estado.trim() };
    if (!this.catalogosDisponibles() || !this.personasPorId().has(payload.id_persona) || !this.actividadesPorId().has(payload.id_actividad) || !this.tiposPorId().has(payload.id_tipo_participacion)) {
      this.errorFormulario.set('Selecciona personas, actividades y tipos de los catálogos disponibles. Puedes reintentar su carga.'); return;
    }
    if (hayDuplicado(this.inscripciones(), payload.id_persona, payload.id_actividad, id)) {
      this.errorFormulario.set('La persona ya está inscrita en esta actividad.'); return;
    }
    this.enviando.set(true); this.form.disable({ emitEvent: false });
    const consulta = id === null ? this.servicio.crear(payload) : this.servicio.actualizar(id, payload);
    consulta.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: respuesta => {
        this.form.enable({ emitEvent: false }); this.enviando.set(false); this.formularioAbierto.set(false);
        this.aviso.set({ tipo: 'exito', texto: respuesta.message }); this.limpiarFiltros(); this.cargar();
      },
      error: (error: ErrorApi) => {
        this.form.enable({ emitEvent: false }); this.enviando.set(false); this.errorFormulario.set(this.mensajeError(error));
        this.erroresServidor.set(error.errores); this.form.markAllAsTouched();
      },
    });
  }
  protected verDetalle(item: Inscripcion): void {
    if (!this.auth.tienePermiso('participantes.ver')) return;
    this.solicitudDetalle?.unsubscribe(); this.detalle.set(null); this.errorDetalle.set(null); this.cargandoDetalle.set(true); this.dialogoDetalle().abrir();
    this.solicitudDetalle = this.servicio.obtener(item.id_participacion).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: detalle => { this.detalle.set(detalle); this.cargandoDetalle.set(false); },
      error: (error: ErrorApi) => { this.errorDetalle.set(this.mensajeError(error)); this.cargandoDetalle.set(false); },
    });
  }
  protected cerrarDetalle(): void { this.solicitudDetalle?.unsubscribe(); }
  protected abrirEstado(item: Inscripcion): void {
    if (!this.auth.tienePermiso('participantes.editar') || this.guardandoEstado()) return;
    this.porCambiarEstado.set(item); this.nuevoEstado.reset(item.estado); this.errorEstado.set(null); this.dialogoEstado().abrir();
  }
  protected confirmarEstado(): void {
    if (this.guardandoEstado()) return;
    this.nuevoEstado.markAsTouched();
    const item = this.porCambiarEstado();
    if (!item || this.nuevoEstado.invalid) return;
    if (!this.auth.tienePermiso('participantes.editar')) { this.errorEstado.set('Tu sesión no tiene permiso para actualizar.'); return; }
    this.guardandoEstado.set(true); this.errorEstado.set(null);
    this.servicio.cambiarEstado(item.id_participacion, this.nuevoEstado.value.trim()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: respuesta => {
        this.inscripciones.update(lista => lista.map(fila => fila.id_participacion === item.id_participacion ? respuesta.data : fila));
        this.guardandoEstado.set(false); this.dialogoEstado().cerrar(); this.aviso.set({ tipo: 'exito', texto: respuesta.message });
      },
      error: (error: ErrorApi) => { this.guardandoEstado.set(false); this.errorEstado.set(this.mensajeError(error)); },
    });
  }
  private mensajeError(error: ErrorApi): string {
    return error.status === 403 ? 'Lectura u operación no autorizada (HTTP 403).'
      : error.status === 401 ? 'La sesión no está autenticada (HTTP 401).'
      : error.status === 0 ? error.mensaje || 'No se pudo conectar con el servidor.' : `${error.mensaje} (HTTP ${error.status})`;
  }
}
