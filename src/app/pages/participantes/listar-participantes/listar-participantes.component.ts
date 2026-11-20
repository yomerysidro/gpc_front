import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { afterNextRender, Component, computed, DestroyRef, effect, ElementRef, inject, Injector, input, output, signal, untracked, viewChild, WritableSignal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, distinctUntilChanged, map, Observable, of, startWith, Subscription, switchMap } from 'rxjs';
import { ErrorApi } from '../../../core/interfaces/api/api-response.interface';
import { ActividadInscripcion, DocumentoInscripcion, FiltrosInscripcion, Inscripcion, InscripcionPayload, PersonaInscripcion, TipoInscripcion } from '../../../core/interfaces/participantes/participante.interface';
import { ParticipantesService } from '../../../core/services/participantes/participantes.service';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { ESTADOS_INSCRIPCION, estadoInscripcion, fechaHoyLima, filtrarInscripciones, hayDuplicado } from '../../../models/participantes/inscripcion.model';
import { DialogoComponent } from '../../../shared/components/dialogo/dialogo.component';
import { PageTitleComponent } from '../../../shared/components/page-title/page-title.component';
import { HasPermissionDirective } from '../../../shared/directives/has-permission.directive';

type Catalogo = 'personas' | 'actividades' | 'tipos' | 'documentos';

@Component({
  selector: 'app-listar-participantes', standalone: true,
  imports: [RouterLink, ReactiveFormsModule, PageTitleComponent, DialogoComponent, HasPermissionDirective],
  templateUrl: './listar-participantes.component.html', styleUrl: './listar-participantes.component.scss',
})
export class ListarParticipantesComponent {
  readonly contextoIntegrado = input<{ actividad: ActividadInscripcion; sesion: { id: number; nombre: string } } | null>(null);
  readonly inscripcionGuardada = output<Inscripcion>();
  readonly formularioCerrado = output<void>();
  private readonly route = inject(ActivatedRoute, { optional: true });
  private readonly servicio = inject(ParticipantesService);
  protected readonly sesionContexto = toSignal(this.route ? this.route.queryParamMap.pipe(
    map(params => ({ actividad: params.get('id_actividad') ?? params.get('actividad'), sesion: params.get('id_sesion') })),
    distinctUntilChanged((a, b) => a.actividad === b.actividad && a.sesion === b.sesion),
    switchMap(({ actividad, sesion }) => {
      if (sesion === null) return of({ cargando: false, error: null, sesion: null });
      if (!actividad || !/^[1-9]\d*$/.test(sesion) || !Number.isSafeInteger(Number(sesion)) || !/^[1-9]\d*$/.test(actividad)) {
        return of({ cargando: false, error: 'El contexto de sesión no es válido.', sesion: null });
      }
      return this.servicio.sesion(Number(sesion)).pipe(map(fila => {
        if (Number(fila['id_actividad']) !== Number(actividad) || Number(fila['id_actividad_sesion']) !== Number(sesion)) {
          throw new Error('La sesión no pertenece a la actividad seleccionada.');
        }
        return { cargando: false, error: null, sesion: { id: Number(sesion), nombre: String(fila['nombre'] || 'Nombre no disponible') } };
      }), catchError(() => of({ cargando: false, error: 'No se pudo verificar la sesión de esta actividad.', sesion: null })),
        startWith({ cargando: true, error: null, sesion: null }));
    }),
  ) : of({ cargando: false, error: null, sesion: null }), { initialValue: { cargando: false, error: null, sesion: null } });
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly documento = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly dialogoFormulario = viewChild.required<DialogoComponent>('dialogoFormulario');
  private readonly elementoFormulario = viewChild.required('dialogoFormulario', { read: ElementRef<HTMLElement> });
  private readonly botonInscribir = viewChild<ElementRef<HTMLButtonElement>>('botonInscribir');
  private overflowAnterior: string | null = null;
  private readonly dialogoDetalle = viewChild.required<DialogoComponent>('dialogoDetalle');
  private readonly dialogoEstado = viewChild.required<DialogoComponent>('dialogoEstado');
  private solicitudDetalle?: Subscription;
  private consultaContexto?: Subscription;
  private consultaListado?: Subscription;
  private guardado?: Subscription;
  private readonly cargasCatalogos = new Map<Catalogo, Subscription>();
  private inscripcionPendiente = false;
  private readonly listo = signal(false);
  protected readonly parametroContexto = signal<string | null>(null);
  protected readonly actividadContexto = signal<ActividadInscripcion | null>(null);
  protected readonly cargandoContexto = signal(false);
  protected readonly errorContexto = signal<string | null>(null);
  protected readonly actividadesDisponibles = computed(() => this.parametroContexto() !== null
    ? this.actividadContexto() ? [this.actividadContexto()!] : [] : this.actividades());
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
  protected readonly avisosFormulario = computed(() => this.avisosCatalogos().filter(([clave]) => clave !== 'documentos'));
  protected readonly etiquetas: Record<string, string> = { personas: 'Personas', actividades: 'Actividades', tipos: 'Tipos de participación', documentos: 'Documentos' };
  protected readonly cargandoAlgunCatalogo = computed(() => Object.values(this.cargandoCatalogos()).some(Boolean));
  protected readonly catalogosDisponibles = computed(() => ['personas', 'actividades', 'tipos'].every(clave =>
    !this.cargandoCatalogos()[clave as Catalogo] && !this.erroresCatalogos()[clave as Catalogo])
    && this.personas().length > 0 && this.actividadesDisponibles().length > 0 && this.tipos().length > 0);
  private readonly personasPorId = computed(() => new Map(this.personas().map(item => [item.id_persona, item])));
  private readonly actividadesPorId = computed(() => new Map(this.actividadesDisponibles().map(item => [item.id_actividad, item.nombre])));
  private readonly tiposPorId = computed(() => new Map(this.tipos().map(item => [item.id_tipo_participacion, item.nombre])));
  private readonly documentosPorPersona = computed(() => {
    const mapa = new Map<number, string[]>();
    for (const documento of this.documentos()) mapa.set(documento.id_persona, [...(mapa.get(documento.id_persona) ?? []), documento.numero_documento]);
    return mapa;
  });
  protected readonly estados = ESTADOS_INSCRIPCION;
  protected readonly filtros = signal<FiltrosInscripcion>({ busqueda: '', actividad: '', tipo: '', estado: '' });
  protected readonly filtradas = computed(() => this.parametroContexto() !== null && !this.actividadContexto() ? [] : filtrarInscripciones(this.inscripciones(), this.filtros(),
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
    estado: ['Activo', [Validators.required, Validators.pattern(/.*\S.*/), Validators.maxLength(30)]],
  });

  constructor() {
    effect(() => {
      const contexto = this.contextoIntegrado();
      if (this.listo() && contexto) untracked(() => this.establecerContexto(String(contexto.actividad.id_actividad), contexto.actividad));
    }, { allowSignalWrites: true });
    this.destroyRef.onDestroy(() => this.restaurarDesplazamiento());
    afterNextRender(() => {
      const dialogo = this.elementoFormulario().nativeElement.querySelector('dialog')!;
      const cancelar = (evento: Event) => { evento.preventDefault(); this.cerrarFormulario(); };
      dialogo.addEventListener('cancel', cancelar);
      this.destroyRef.onDestroy(() => dialogo.removeEventListener('cancel', cancelar));
      this.listo.set(true);
      if (this.contextoIntegrado()) return;
      if (this.route) this.route.queryParamMap.pipe(map(params => params.get('id_actividad') ?? params.get('actividad')),
        distinctUntilChanged(), takeUntilDestroyed(this.destroyRef)).subscribe(valor => { if (!this.contextoIntegrado()) this.establecerContexto(valor); });
      else this.establecerContexto(null);
    });
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.erroresServidor.set({}));
  }
  protected cargar(): void {
    this.consultaListado?.unsubscribe();
    this.cargando.set(true); this.errorCarga.set(null);
    this.consultaListado = this.servicio.listar().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: datos => { this.inscripciones.set(datos); this.cargando.set(false); },
      error: (error: ErrorApi) => { this.errorCarga.set(this.mensajeError(error)); this.cargando.set(false); },
    });
  }
  protected cargarCatalogos(): void {
    this.cargandoCatalogos.set({ personas: true, actividades: true, tipos: true, documentos: false });
    this.cargarCatalogo('personas', this.servicio.personas(), this.personas);
    if (this.parametroContexto() === null) this.cargarCatalogo('actividades', this.servicio.actividades(), this.actividades);
    else this.cargandoCatalogos.update(estado => ({ ...estado, actividades: false }));
    this.cargarCatalogo('tipos', this.servicio.tipos(), this.tipos);
    // Los documentos solo enriquecen la búsqueda del listado general. No forman parte del payload de inscripción.
    if (this.parametroContexto() === null && this.auth.tienePermiso('personas.ver')) {
      this.cargarCatalogo('documentos', this.servicio.documentos(), this.documentos);
    } else {
      this.documentos.set([]); this.erroresCatalogos.update(errores => ({ ...errores, documentos: undefined }));
    }
  }
  private cargarCatalogo<T>(clave: Catalogo, consulta: Observable<readonly T[]>, destino: WritableSignal<readonly T[]>): void {
    this.cargasCatalogos.get(clave)?.unsubscribe(); destino.set([]);
    this.cargandoCatalogos.update(estado => ({ ...estado, [clave]: true }));
    this.erroresCatalogos.update(errores => ({ ...errores, [clave]: undefined }));
    this.cargasCatalogos.set(clave, consulta.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: datos => { destino.set(datos); this.cargandoCatalogos.update(estado => ({ ...estado, [clave]: false })); this.intentarInscripcionContextual(); },
      error: (error: ErrorApi) => {
        this.erroresCatalogos.update(errores => ({ ...errores, [clave]: this.mensajeError(error) }));
        this.cargandoCatalogos.update(estado => ({ ...estado, [clave]: false }));
      },
    }));
  }
  private establecerContexto(valor: string | null, validada?: ActividadInscripcion): void {
    this.guardado?.unsubscribe(); this.enviando.set(false);
    for (const carga of this.cargasCatalogos.values()) carga.unsubscribe();
    this.cargasCatalogos.clear();
    this.consultaContexto?.unsubscribe();
    this.solicitudDetalle?.unsubscribe();
    this.dialogoFormulario().cerrar(); this.formularioAbierto.set(false); this.restaurarDesplazamiento();
    this.form.enable({ emitEvent: false }); this.form.reset(); this.editando.set(null);
    this.actividadContexto.set(null); this.parametroContexto.set(valor); this.errorContexto.set(null);
    this.inscripcionPendiente = valor !== null && this.route?.snapshot.queryParamMap.get('inscribir') !== 'no';
    this.filtros.set({ busqueda: '', actividad: '', tipo: '', estado: '' }); this.pagina.set(1);
    this.cargandoContexto.set(valor !== null);
    this.erroresCatalogos.set({}); this.actividades.set([]); this.personas.set([]); this.tipos.set([]); this.documentos.set([]);
    this.cargandoCatalogos.set({ personas: false, actividades: false, tipos: false, documentos: false });
    this.cargar();
    if (validada && this.contextoIntegrado()) {
      this.actividadContexto.set(validada); this.cargandoContexto.set(false);
      this.filtros.update(f => ({ ...f, actividad: String(validada.id_actividad) }));
      this.inscripcionPendiente = false; this.cargarCatalogos(); this.abrirFormulario(null); return;
    }
    if (valor !== null) {
      if (!/^[1-9]\d*$/.test(valor) || !Number.isSafeInteger(Number(valor))) {
        this.errorContexto.set('El identificador de actividad no es válido.'); this.cargandoContexto.set(false); return;
      }
      if (!this.auth.tienePermiso('participantes.ver')) {
        this.errorContexto.set('Tu sesión no tiene permiso para consultar participantes.'); this.cargandoContexto.set(false); return;
      }
      this.consultaContexto = this.servicio.actividad(Number(valor)).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: actividad => {
          if (actividad.id_actividad !== Number(valor) || !actividad.nombre?.trim()) {
            this.errorContexto.set('Laravel no confirmó la actividad solicitada.'); this.cargandoContexto.set(false); return;
          }
          this.actividadContexto.set(actividad); this.filtros.update(f => ({ ...f, actividad: String(actividad.id_actividad) }));
          this.cargandoContexto.set(false); this.cargarCatalogos();
        },
        error: (error: ErrorApi) => { this.cargandoContexto.set(false); this.errorContexto.set(this.mensajeError(error)); },
      });
      return;
    }
    this.cargarCatalogos();
  }
  private intentarInscripcionContextual(): void {
    if (!this.inscripcionPendiente || !this.actividadContexto() || !this.catalogosDisponibles()
      || !this.auth.tienePermiso('participantes.crear')) return;
    this.inscripcionPendiente = false; this.abrirFormulario(null);
  }
  protected puedeInscribir(): boolean {
    return this.auth.tienePermiso('participantes.crear') && (this.parametroContexto() === null || !!this.actividadContexto() && !this.errorContexto());
  }
  protected filtrar(clave: keyof FiltrosInscripcion, valor: string): void {
    if (clave === 'actividad' && this.parametroContexto() !== null) return;
    this.filtros.update(filtros => ({ ...filtros, [clave]: valor })); this.pagina.set(1);
  }
  protected limpiarFiltros(): void { this.filtros.set({ busqueda: '', actividad: this.actividadContexto() ? String(this.actividadContexto()!.id_actividad) : '', tipo: '', estado: '' }); this.pagina.set(1); }
  protected cambiarTamano(valor: string): void { if ([10, 20, 50].includes(Number(valor))) { this.porPagina.set(Number(valor)); this.pagina.set(1); } }
  protected etiquetaEstado(valor: string): string {
    return valor === 'sd' ? 'Estado sin descripción (sd)' : estadoInscripcion(valor);
  }
  protected esEstadoOfrecido(valor: string): boolean { return this.estados.some(estado => estado.valor === valor); }
  protected nombrePersona(id: number): string {
    const persona = this.personasPorId().get(id);
    return persona ? [persona.nombres, persona.apellido_paterno, persona.apellido_materno].filter(Boolean).join(' ') : 'Nombre no disponible';
  }
  protected documentoPersona(id: number): string { return this.documentosPorPersona().get(id)?.join(' / ') ?? ''; }
  protected nombreActividad(id: number): string { return this.actividadesPorId().get(id) ?? 'Nombre no disponible'; }
  protected nombreTipo(id: number): string { return this.tiposPorId().get(id) ?? 'Nombre no disponible'; }
  protected fecha(valor: string): string { const [anio, mes, dia] = valor.slice(0, 10).split('-'); return `${dia}/${mes}/${anio}`; }
  protected abrirFormulario(item: Inscripcion | null): void {
    if (!item && !this.auth.tienePermiso('participantes.crear')) return;
    if (this.parametroContexto() !== null && (!this.actividadContexto() || this.cargandoContexto() || this.errorContexto())) return;
    if (this.formularioAbierto() || this.enviando() || this.guardandoEstado() || (item && !this.auth.tienePermiso('participantes.editar'))) return;
    if (!item) this.inscripcionPendiente = false;
    this.solicitudDetalle?.unsubscribe(); this.editando.set(item?.id_participacion ?? null);
    this.overflowAnterior = this.documento.body.style.overflow;
    this.documento.body.style.overflow = 'hidden';
    this.dialogoFormulario().abrir();
    this.formularioAbierto.set(true); this.errorFormulario.set(null); this.erroresServidor.set({});
    this.form.enable({ emitEvent: false }); this.form.reset({ fecha_inscripcion: fechaHoyLima() }); this.cargandoEdicion.set(!!item);
    if (!item) {
      const id = Number(this.filtros().actividad);
      if (this.actividadesPorId().has(id)) this.form.controls.id_actividad.setValue(String(id));
      this.protegerCampos();
      return;
    }
    this.solicitudDetalle = this.servicio.obtener(item.id_participacion).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: actual => { this.form.reset({ id_persona: String(actual.id_persona), id_actividad: String(actual.id_actividad),
        id_tipo_participacion: String(actual.id_tipo_participacion), fecha_inscripcion: actual.fecha_inscripcion.slice(0, 10), estado: actual.estado });
        if (this.actividadContexto() && actual.id_actividad !== this.actividadContexto()!.id_actividad) { this.errorFormulario.set('La inscripción no pertenece a esta actividad.'); return; }
        this.protegerCampos(); this.cargandoEdicion.set(false); },
      error: (error: ErrorApi) => { this.cargandoEdicion.set(false); this.errorFormulario.set(this.mensajeError(error)); },
    });
  }
  protected cerrarFormulario(): void {
    if (this.enviando()) return;
    this.dialogoFormulario().cerrar();
    this.alCerrarFormulario();
    afterNextRender(() => {
      if (!this.formularioAbierto()) this.dialogoFormulario().cerrar();
    }, { injector: this.injector });
  }
  protected alCerrarFormulario(): void {
    if (!this.formularioAbierto() || this.elementoFormulario().nativeElement.querySelector('dialog')?.open) return;
    this.solicitudDetalle?.unsubscribe();
    this.formularioAbierto.set(false);
    this.form.reset(); this.editando.set(null); this.cargandoEdicion.set(false);
    this.errorFormulario.set(null); this.erroresServidor.set({});
    this.restaurarDesplazamiento();
    afterNextRender(() => this.botonInscribir()?.nativeElement.focus(), { injector: this.injector });
    if (this.contextoIntegrado()) this.formularioCerrado.emit();
  }
  private restaurarDesplazamiento(): void {
    if (this.overflowAnterior === null) return;
    this.documento.body.style.overflow = this.overflowAnterior;
    this.overflowAnterior = null;
  }
  protected errorCampo(clave: keyof typeof this.form.controls): string | null {
    if (this.erroresServidor()[clave]?.[0]) return this.erroresServidor()[clave][0];
    const control = this.form.controls[clave];
    if (!control.touched || control.valid) return null;
    return control.hasError('maxlength') ? 'Máximo 30 caracteres.' : 'Completa este campo con un valor válido.';
  }
  protected guardar(): void {
    if (!this.formularioAbierto() || this.enviando() || this.cargandoEdicion()) return;
    this.errorFormulario.set(null);
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const id = this.editando();
    if (!this.auth.tienePermiso(id === null ? 'participantes.crear' : 'participantes.editar')) {
      this.errorFormulario.set('Tu sesión no tiene permiso para guardar esta inscripción.'); return;
    }
    const valores = this.form.getRawValue();
    const payload: InscripcionPayload = { id_persona: Number(valores.id_persona), id_actividad: Number(valores.id_actividad),
      id_tipo_participacion: Number(valores.id_tipo_participacion), fecha_inscripcion: valores.fecha_inscripcion, estado: valores.estado.trim() };
    if (this.parametroContexto() !== null && payload.id_actividad !== this.actividadContexto()?.id_actividad) {
      this.errorFormulario.set('La actividad debe coincidir con el contexto validado.'); return;
    }
    if (!this.catalogosDisponibles() || !this.personasPorId().has(payload.id_persona) || !this.actividadesPorId().has(payload.id_actividad) || !this.tiposPorId().has(payload.id_tipo_participacion)) {
      this.errorFormulario.set('Selecciona personas, actividades y tipos de los catálogos disponibles. Puedes reintentar su carga.'); return;
    }
    const sesion = this.contextoIntegrado()?.sesion ?? this.sesionContexto().sesion;
    if (id === null && sesion) payload.id_actividad_sesion = sesion.id;
    if (payload.id_actividad_sesion === undefined && hayDuplicado(this.inscripciones(), payload.id_persona, payload.id_actividad, id)) {
      this.errorFormulario.set('La persona ya está inscrita en esta actividad.'); return;
    }
    this.enviando.set(true); this.form.disable({ emitEvent: false });
    const consulta = id === null ? this.servicio.crear(payload) : this.servicio.actualizar(id, payload);
    this.guardado = consulta.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: respuesta => {
        this.form.enable({ emitEvent: false }); this.enviando.set(false); this.cerrarFormulario();
        if (this.contextoIntegrado()) { this.inscripcionGuardada.emit(respuesta.data); return; }
        this.aviso.set({ tipo: 'exito', texto: respuesta.message }); this.limpiarFiltros(); this.cargar();
      },
      error: (error: ErrorApi) => {
        this.form.enable({ emitEvent: false }); this.protegerCampos(); this.enviando.set(false); this.errorFormulario.set(this.mensajeError(error));
        this.erroresServidor.set(error.errores); this.form.markAllAsTouched();
      },
    });
  }
  private protegerCampos(): void {
    if (this.editando() === null && (this.contextoIntegrado()?.sesion ?? this.sesionContexto().sesion)) {
      this.form.controls.fecha_inscripcion.disable({ emitEvent: false });
    }
    const actividad = this.actividadContexto();
    if (actividad) { this.form.controls.id_actividad.setValue(String(actividad.id_actividad), { emitEvent: false }); this.form.controls.id_actividad.disable({ emitEvent: false }); }
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
    return error.status === 403 ? `${error.mensaje || 'Lectura u operación no autorizada'} (HTTP 403).`
      : error.status === 401 ? `${error.mensaje || 'La sesión no está autenticada'} (HTTP 401).`
      : error.status === 0 ? error.mensaje || 'No se pudo conectar con el servidor.' : `${error.mensaje} (HTTP ${error.status})`;
  }
}
