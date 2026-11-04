import { afterNextRender, Component, computed, DestroyRef, ElementRef, HostListener, inject, Injector, signal, viewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ErrorApi } from '../../../core/interfaces/api/api-response.interface';
import {
  Actividad, ActividadPayload, AreaActividad, FiltrosActividad, PonenteAsignado, TipoActividad,
} from '../../../core/interfaces/actividades/actividad.interface';
import { ActividadesService } from '../../../core/services/actividades/actividades.service';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { ESTADOS_ACTIVIDAD, filtrarActividades, periodoActividad, textoObligatorio } from '../../../models/actividades/actividad-form.model';
import { DialogoConfirmacionComponent } from '../../../shared/components/dialogo-confirmacion/dialogo-confirmacion.component';
import { DialogoComponent } from '../../../shared/components/dialogo/dialogo.component';
import { PageTitleComponent } from '../../../shared/components/page-title/page-title.component';
import { HasPermissionDirective } from '../../../shared/directives/has-permission.directive';

@Component({
  selector: 'app-listar-actividades',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, PageTitleComponent, DialogoComponent, DialogoConfirmacionComponent, HasPermissionDirective],
  templateUrl: './listar-actividades.component.html',
  styleUrl: './listar-actividades.component.scss',
})
export class ListarActividadesComponent {
  @HostListener('window:focus')
  protected actualizarAlVolver(): void {
    if (this.auth.tienePermiso('actividades.ver') && !this.cargando() && !this.enviando() && !this.formularioAbierto()) this.cargar();
  }
  private readonly route = inject(ActivatedRoute, { optional: true });
  private readonly servicio = inject(ActividadesService);
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly documento = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly dialogoFormulario = viewChild.required<DialogoComponent>('dialogoFormulario');
  private readonly elementoFormulario = viewChild.required('dialogoFormulario', { read: ElementRef<HTMLElement> });
  private readonly encabezado = viewChild.required<ElementRef<HTMLElement>>('encabezado');
  private overflowAnterior: string | null = null;
  private readonly dialogoDetalle = viewChild.required<DialogoComponent>('dialogoDetalle');
  private readonly dialogoAcciones = viewChild.required<DialogoComponent>('dialogoAcciones');
  private readonly dialogoPonentes = viewChild.required<DialogoComponent>('dialogoPonentes');
  private readonly confirmarPonente = viewChild.required<DialogoConfirmacionComponent>('confirmarPonente');
  protected readonly seleccionada = signal<Actividad | null>(null);
  protected readonly actividadEdicion = signal<Actividad | null>(null);
  protected readonly actividadPonentes = signal<Actividad | null>(null);
  protected readonly opcionesPonentes = signal<readonly { id_persona_ponente: number; nombre: string }[]>([]);
  protected readonly cargandoCatalogoPonentes = signal(false);
  protected readonly errorCatalogoPonentes = signal<string | null>(null);
  protected readonly guardandoPonente = signal(false);
  protected readonly avisoPonentes = signal<string | null>(null);
  protected readonly formPonente = inject(NonNullableFormBuilder).group({ id_persona_ponente: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]] });
  private readonly confirmacionEstado = viewChild.required<DialogoConfirmacionComponent>('confirmacionEstado');
  private solicitudDetalle?: Subscription;
  private solicitudPonentes?: Subscription;
  private solicitudEdicion?: Subscription;
  private destruido = false;

  protected readonly actividades = signal<readonly Actividad[]>([]);
  protected readonly areas = signal<readonly AreaActividad[]>([]);
  protected readonly tipos = signal<readonly TipoActividad[]>([]);
  protected readonly cargando = signal(true);
  protected readonly errorCarga = signal<string | null>(null);
  protected readonly aviso = signal<{ tipo: 'exito' | 'error'; texto: string } | null>(null);
  protected readonly cargandoAreas = signal(true);
  protected readonly cargandoTipos = signal(true);
  protected readonly errorAreas = signal<string | null>(null);
  protected readonly errorTipos = signal<string | null>(null);
  // Un catálogo denegado no impide conservar los IDs reales del detalle y editar otros campos.
  protected readonly catalogosDisponibles = computed(() => !this.cargandoAreas() && !this.cargandoTipos());
  protected readonly areasFiltro = computed(() => {
    const areas = new Map(this.areas().map(area => [area.id_area, area]));
    for (const actividad of [...this.actividades(), ...[this.actividadEdicion()].filter((a): a is Actividad => a !== null)]) {
      if (!areas.has(actividad.id_area)) areas.set(actividad.id_area, { id_area: actividad.id_area, nombre: actividad.area_nombre || `Área #${actividad.id_area}` });
    }
    return [...areas.values()];
  });
  protected readonly tiposEdicion = computed(() => {
    const tipos = new Map<number, Pick<TipoActividad, 'id_tipo_actividad' | 'nombre'>>(this.tipos().map(tipo => [tipo.id_tipo_actividad, tipo]));
    const actual = this.actividadEdicion();
    if (actual && !tipos.has(actual.id_tipo_actividad)) tipos.set(actual.id_tipo_actividad, {
      id_tipo_actividad: actual.id_tipo_actividad, nombre: actual.tipo_actividad_nombre || `Tipo #${actual.id_tipo_actividad}`,
    });
    return [...tipos.values()];
  });
  protected readonly filtros = signal<FiltrosActividad>({ nombre: '', area: '', tipo: '', estado: '' });
  protected readonly filtradas = computed(() => filtrarActividades(this.actividades(), this.filtros()));
  protected readonly estados = ESTADOS_ACTIVIDAD;
  protected readonly porPagina = signal(10);
  protected readonly pagina = signal(1);
  protected readonly totalPaginas = computed(() => Math.max(1, Math.ceil(this.filtradas().length / this.porPagina())));
  protected readonly paginaActual = computed(() => Math.min(this.pagina(), this.totalPaginas()));
  protected readonly visibles = computed(() => this.filtradas().slice(
    (this.paginaActual() - 1) * this.porPagina(), this.paginaActual() * this.porPagina()));
  protected readonly rango = computed(() => ({
    desde: this.filtradas().length ? (this.paginaActual() - 1) * this.porPagina() + 1 : 0,
    hasta: Math.min(this.paginaActual() * this.porPagina(), this.filtradas().length),
    total: this.filtradas().length,
  }));
  protected readonly porCambiarEstado = signal<Actividad | null>(null);
  protected readonly cambiandoEstado = signal(false);
  private readonly nombresAreas = computed(() => new Map(this.areas().map(area => [area.id_area, area.nombre])));
  private readonly nombresTipos = computed(() => new Map(this.tipos().map(tipo => [tipo.id_tipo_actividad, tipo.nombre])));

  protected readonly formularioAbierto = signal(false);
  protected readonly editando = signal<number | null>(null);
  protected readonly cargandoEdicion = signal(false);
  protected readonly enviando = signal(false);
  protected readonly errorFormulario = signal<string | null>(null);
  protected readonly erroresServidor = signal<ErrorApi['errores']>({});
  protected readonly detalle = signal<Actividad | null>(null);
  protected readonly cargandoDetalle = signal(false);
  protected readonly errorDetalle = signal<string | null>(null);
  protected readonly ponentes = signal<readonly PonenteAsignado[]>([]);
  protected readonly cargandoPonentes = signal(false);
  protected readonly errorPonentes = signal<string | null>(null);

  protected readonly form = inject(NonNullableFormBuilder).group({
    id_area: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
    id_tipo_actividad: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
    nombre: ['', [textoObligatorio, Validators.maxLength(100)]],
    descripcion: ['', Validators.maxLength(255)],
    fecha_inicio: ['', Validators.required],
    fecha_fin: ['', Validators.required],
    sede: ['', Validators.maxLength(100)],
    estado: ['Activa', [Validators.required, Validators.pattern(/^(Activa|Cerrada)$/)]],
  }, { validators: periodoActividad });

  constructor() {
    this.destroyRef.onDestroy(() => { this.destruido = true; this.restaurarDesplazamiento(); });
    afterNextRender(() => {
      const dialogo = this.elementoFormulario().nativeElement.querySelector('dialog')!;
      const cancelar = (evento: Event) => {
        evento.preventDefault();
        this.cerrarFormulario();
      };
      dialogo.addEventListener('cancel', cancelar);
      this.destroyRef.onDestroy(() => dialogo.removeEventListener('cancel', cancelar));
      this.cargar();
      this.cargarCatalogos();
      this.route?.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
        const id = Number(params.get('actividad'));
        if (Number.isSafeInteger(id) && id > 0) this.verDetalle({ id_actividad: id });
      });
    });
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.erroresServidor.set({}));
  }

  protected cargar(): void {
    if (this.cambiandoEstado()) return;
    this.cargando.set(true);
    this.errorCarga.set(null);
    this.servicio.listar().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: actividades => { this.actividades.set(actividades); this.cargando.set(false); },
      error: (error: ErrorApi) => {
        this.errorCarga.set(error.status === 403
          ? 'El servidor denegó el listado. Verifica que tu sesión tenga el permiso de lectura de Actividades.'
          : this.mensajeError(error));
        this.cargando.set(false);
      },
    });
  }

  protected cargarCatalogos(): void {
    this.areas.set([]);
    this.cargandoAreas.set(true);
    this.cargandoTipos.set(true);
    this.errorAreas.set(null);
    this.errorTipos.set(null);
    this.servicio.listarAreas().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: areas => {
        this.areas.set(areas); this.cargandoAreas.set(false);
        if (this.editando() === null && !this.form.controls.id_area.value && areas.length === 1) this.form.controls.id_area.setValue(String(areas[0].id_area));
      },
      error: (error: ErrorApi) => {
        this.errorAreas.set(error.status === 403
          ? `El servidor denegó la lectura del catálogo de áreas para tu sesión. ${this.mensajeError(error)}`
          : this.mensajeError(error));
        this.cargandoAreas.set(false);
      },
    });
    this.servicio.listarTipos().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: tipos => { this.tipos.set(tipos); this.cargandoTipos.set(false); },
      error: (error: ErrorApi) => {
        this.errorTipos.set(error.status === 403
          ? 'El servidor denegó la lectura de los tipos de actividad. Esta consulta requiere el permiso de lectura de Actividades.'
          : this.mensajeError(error));
        this.cargandoTipos.set(false);
      },
    });
  }

  protected filtrar(campo: keyof FiltrosActividad, valor: string): void {
    this.filtros.update(filtros => ({ ...filtros, [campo]: valor }));
    this.pagina.set(1);
  }

  protected limpiarFiltros(): void {
    this.filtros.set({ nombre: '', area: '', tipo: '', estado: '' });
    this.pagina.set(1);
  }

  protected cambiarTamanoPagina(valor: string): void {
    const cantidad = Number(valor);
    if (![10, 20, 50].includes(cantidad)) return;
    this.porPagina.set(cantidad);
    this.pagina.set(1);
  }

  protected async pedirCambioEstado(actividad: Actividad): Promise<void> {
    if (actividad.estado !== 'Activa' || !this.auth.tienePermiso('actividades.editar') || this.cambiandoEstado()) return;
    this.porCambiarEstado.set(actividad);
    if (!await this.confirmacionEstado().abrir() || this.destruido
      || !this.auth.tienePermiso('actividades.editar') || this.cambiandoEstado()) return;
    const estado = 'Cerrada';
    this.cambiandoEstado.set(true);
    this.aviso.set(null);
    this.servicio.cambiarEstado(actividad.id_actividad, estado).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: respuesta => {
        this.actividades.update(lista => lista.map(item => item.id_actividad === actividad.id_actividad ? respuesta.data : item));
        this.cambiandoEstado.set(false);
        this.aviso.set({ tipo: 'exito', texto: respuesta.message });
        this.cargar();
      },
      error: (error: ErrorApi) => {
        this.cambiandoEstado.set(false);
        this.aviso.set({ tipo: 'error', texto: this.mensajeError(error) });
      },
    });
  }

  protected nombreArea(id: number, nombre?: string | null): string { return nombre?.trim() || this.nombresAreas().get(id) || this.areasFiltro().find(area => area.id_area === id)?.nombre || `Área #${id}`; }
  protected nombreTipo(id: number, nombre?: string | null): string { return nombre?.trim() || this.nombresTipos().get(id) || `Tipo #${id}`; }
  protected permitido(permiso: string): boolean { return this.auth.tienePermiso(permiso); }

  protected gestionar(actividad: Actividad): void {
    this.seleccionada.set(actividad);
    this.dialogoDetalle().cerrar();
    this.dialogoAcciones().abrir();
  }

  protected ejecutar(accion: 'detalle' | 'editar' | 'ponentes' | 'cerrar', actividad: Actividad): void {
    const permiso = accion === 'detalle' ? 'actividades.ver' : accion === 'ponentes' ? 'ponentes-firmantes.ver' : 'actividades.editar';
    if (!this.permitido(permiso) || (accion === 'cerrar' && actividad.estado !== 'Activa')) return;
    this.dialogoAcciones().cerrar();
    if (accion === 'detalle') this.verDetalle(actividad);
    else if (accion === 'editar') this.abrirFormulario(actividad);
    else if (accion === 'cerrar') void this.pedirCambioEstado(actividad);
    else {
      this.actividadPonentes.set(actividad); this.detalle.set(null); this.ponentes.set([]);
      this.avisoPonentes.set(null); this.formPonente.reset();
      this.dialogoPonentes().abrir(); this.cargarPonentes(); this.cargarCatalogoPonentes();
    }
  }

  protected cargarCatalogoPonentes(): void {
    if (!this.permitido('ponentes-firmantes.ver')) return;
    this.cargandoCatalogoPonentes.set(true); this.errorCatalogoPonentes.set(null); this.opcionesPonentes.set([]);
    this.servicio.listarCatalogoPonentes().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: opciones => { this.opcionesPonentes.set(opciones); this.cargandoCatalogoPonentes.set(false); },
      error: (error: ErrorApi) => { this.errorCatalogoPonentes.set(this.mensajeError(error)); this.cargandoCatalogoPonentes.set(false); },
    });
  }

  protected vincularPonente(): void {
    const actividad = this.actividadPonentes();
    if (!actividad || !this.permitido('ponentes-firmantes.crear') || this.guardandoPonente() || this.cargandoPonentes() || this.errorPonentes()) return;
    this.formPonente.markAllAsTouched();
    const id = Number(this.formPonente.controls.id_persona_ponente.value);
    if (this.formPonente.invalid || !this.opcionesPonentes().some(p => p.id_persona_ponente === id)) return;
    if (this.ponenteAsociado(id)) { this.avisoPonentes.set('El ponente ya está asociado a esta actividad.'); return; }
    this.guardandoPonente.set(true); this.avisoPonentes.set(null);
    this.servicio.vincularPonente(actividad.id_actividad, id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: respuesta => { this.guardandoPonente.set(false); this.avisoPonentes.set(respuesta.message); this.formPonente.reset(); this.cargarPonentes(); },
      error: (error: ErrorApi) => { this.guardandoPonente.set(false); this.avisoPonentes.set(this.mensajeError(error)); },
    });
  }
  protected ponenteAsociado(id: number): boolean { return this.ponentes().some(p => p.id_persona_ponente === id); }

  protected bloquearEscapePonentes(evento: Event): void {
    if (this.guardandoPonente()) evento.preventDefault();
  }

  protected async desvincularPonente(ponente: PonenteAsignado): Promise<void> {
    if (!this.permitido('ponentes-firmantes.eliminar') || this.guardandoPonente()) return;
    if (!await this.confirmarPonente().abrir() || this.destruido || !this.permitido('ponentes-firmantes.eliminar') || this.guardandoPonente()) return;
    this.guardandoPonente.set(true);
    this.servicio.desvincularPonente(ponente.id_actividad_ponente).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: respuesta => { this.guardandoPonente.set(false); this.avisoPonentes.set(respuesta.message); this.cargarPonentes(); },
      error: (error: ErrorApi) => { this.guardandoPonente.set(false); this.avisoPonentes.set(this.mensajeError(error)); },
    });
  }
  protected origenActividad(actividad: Actividad): string {
    return actividad.origen === 'solicitud' ? 'Procedente de solicitud aprobada'
      : actividad.origen === 'sin_solicitud' ? 'Registro administrativo directo' : 'Origen no informado';
  }
  protected rutaSolicitud(): string | null {
    const capacidades = this.auth.capacidadesSolicitudes?.();
    if (capacidades?.consultar_revision) return '/solicitudes/revision';
    if (capacidades?.consultar_gerencia) return '/pendientes/pendientes-aprobacion';
    return this.auth.tienePermiso('solicitudes.propias') ? '/solicitudes/mis-solicitudes' : null;
  }

  protected fecha(valor: string | null): string {
    if (!valor) return '—';
    // Fechas de calendario: no convertir a UTC para evitar desplazar el día en Lima.
    const fecha = valor.slice(0, 10).split('-');
    return fecha.length === 3 ? `${fecha[2]}/${fecha[1]}/${fecha[0]}` : valor;
  }

  protected abrirFormulario(actividad: Actividad | null): void {
    if (!actividad || !this.auth.tienePermiso('actividades.editar')) return;
    if (this.formularioAbierto() || this.enviando() || this.cambiandoEstado()) return;
    this.solicitudEdicion?.unsubscribe();
    this.formularioAbierto.set(true);
    this.overflowAnterior = this.documento.body.style.overflow;
    this.documento.body.style.overflow = 'hidden';
    this.dialogoFormulario().abrir();
    this.editando.set(actividad?.id_actividad ?? null);
    this.actividadEdicion.set(actividad);
    this.errorFormulario.set(null);
    this.erroresServidor.set({});
    this.form.reset();
    this.cargandoEdicion.set(!!actividad);

    this.solicitudEdicion = this.servicio.obtener(actividad.id_actividad)
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: actual => {
          this.actividadEdicion.set(actual);
          this.form.reset({
            id_area: String(actual.id_area), id_tipo_actividad: String(actual.id_tipo_actividad),
            nombre: actual.nombre, descripcion: actual.descripcion ?? '', sede: actual.sede ?? '',
            fecha_inicio: actual.fecha_inicio.slice(0, 10), fecha_fin: actual.fecha_fin?.slice(0, 10) ?? '',
            estado: actual.estado,
          });
          this.cargandoEdicion.set(false);
        },
        error: (error: ErrorApi) => {
          this.cargandoEdicion.set(false);
          this.cerrarFormulario();
          this.aviso.set({ tipo: 'error', texto: this.mensajeError(error) });
        },
      });
  }

  protected cerrarFormulario(): void {
    if (this.enviando()) return;
    this.solicitudEdicion?.unsubscribe();
    this.dialogoFormulario().cerrar();
    this.alCerrarFormulario();
    // También cubre un rechazo inmediato del detalle antes de showModal().
    afterNextRender(() => {
      if (!this.formularioAbierto()) this.dialogoFormulario().cerrar();
    }, { injector: this.injector });
  }

  protected alCerrarFormulario(): void {
    // Ignora un evento close anterior si el usuario ya volvió a abrir el modal.
    if (!this.formularioAbierto() || this.elementoFormulario().nativeElement.querySelector('dialog')?.open) return;
    this.solicitudEdicion?.unsubscribe();
    this.formularioAbierto.set(false);
    this.form.reset();
    this.editando.set(null);
    this.cargandoEdicion.set(false);
    this.errorFormulario.set(null);
    this.erroresServidor.set({});
    this.restaurarDesplazamiento();
    afterNextRender(() => this.encabezado().nativeElement.focus(), { injector: this.injector });
  }

  private restaurarDesplazamiento(): void {
    if (this.overflowAnterior === null) return;
    this.documento.body.style.overflow = this.overflowAnterior;
    this.overflowAnterior = null;
  }

  protected errorCampo(campo: keyof typeof this.form.controls): string | null {
    const control = this.form.controls[campo];
    const servidor = this.erroresServidor()[campo]?.[0];
    if (servidor) return servidor;
    if (!control.touched) return null;
    if (control.hasError('required')) return 'Completa este campo.';
    if (control.hasError('maxlength')) return `Máximo ${control.getError('maxlength').requiredLength} caracteres.`;
    if (control.hasError('pattern')) return 'Selecciona una opción válida.';
    if (campo === 'fecha_fin' && this.form.hasError('periodo')) return 'La fecha de fin no puede ser anterior al inicio.';
    return null;
  }

  protected guardar(): void {
    if (this.editando() === null || !this.formularioAbierto() || this.enviando() || this.cargandoEdicion()) return;
    this.errorFormulario.set(null);
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (!this.auth.tienePermiso('actividades.editar')) {
      this.errorFormulario.set('Guardado pendiente de autorización. Tu sesión no dispone del permiso para esta operación.');
      return;
    }
    if (!this.catalogosDisponibles()) {
      this.errorFormulario.set('Guardado pendiente de conexión: carga las áreas y los tipos de actividad antes de continuar.');
      return;
    }
    const valores = this.form.getRawValue();
    if (!this.areasFiltro().some(area => area.id_area === Number(valores.id_area)) || !this.tiposEdicion().some(tipo => tipo.id_tipo_actividad === Number(valores.id_tipo_actividad))) {
      this.errorFormulario.set('Selecciona un área y un tipo de actividad autorizados.'); return;
    }
    const payload: ActividadPayload = {
      ...valores, id_area: Number(valores.id_area), id_tipo_actividad: Number(valores.id_tipo_actividad),
      nombre: valores.nombre.trim(), estado: valores.estado.trim(),
      descripcion: valores.descripcion.trim() || null, sede: valores.sede.trim() || null,
    };
    this.enviando.set(true);
    this.errorFormulario.set(null);
    this.erroresServidor.set({});
    this.form.disable({ emitEvent: false });
    const id = this.editando();
    if (id === null) return;
    const peticion = this.servicio.actualizar(id, payload);
    peticion.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: respuesta => {
        this.form.enable({ emitEvent: false });
        this.enviando.set(false);
        this.cerrarFormulario();
        this.aviso.set({ tipo: 'exito', texto: respuesta.message });
        this.cargar();
      },
      error: (error: ErrorApi) => {
        this.form.enable({ emitEvent: false });
        this.enviando.set(false);
        this.errorFormulario.set(this.mensajeError(error));
        this.erroresServidor.set(error.errores);
        this.form.markAllAsTouched();
      },
    });
  }

  protected verDetalle(actividad: Pick<Actividad, 'id_actividad'>): void {
    if (!this.auth.tienePermiso('actividades.ver')) return;
    this.cerrarDetalle();
    this.detalle.set(null);
    this.actividadPonentes.set(null);
    this.errorDetalle.set(null);
    this.ponentes.set([]);
    this.errorPonentes.set(null);
    this.cargandoDetalle.set(true);
    this.dialogoDetalle().abrir();
    this.solicitudDetalle = this.servicio.obtener(actividad.id_actividad)
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: detalle => { this.detalle.set(detalle); this.cargandoDetalle.set(false); },
        error: (error: ErrorApi) => { this.errorDetalle.set(this.mensajeError(error)); this.cargandoDetalle.set(false); },
      });
  }

  protected cargarPonentes(): void {
    const actividad = this.actividadPonentes() ?? this.detalle();
    if (!actividad) return;
    this.solicitudPonentes?.unsubscribe();
    this.cargandoPonentes.set(true);
    this.errorPonentes.set(null);
    this.solicitudPonentes = this.servicio.consultarPonentes(actividad.id_actividad)
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: ponentes => { this.ponentes.set(ponentes); this.cargandoPonentes.set(false); },
        error: (error: ErrorApi) => { this.errorPonentes.set(this.mensajeError(error)); this.cargandoPonentes.set(false); },
      });
  }

  protected cerrarDetalle(): void {
    this.solicitudDetalle?.unsubscribe();
    this.solicitudPonentes?.unsubscribe();
  }

  private mensajeError(error: ErrorApi): string {
    return error.status === 0 ? 'No se pudo conectar con el servidor. Comprueba tu conexión e intenta nuevamente.' : error.mensaje;
  }
}
