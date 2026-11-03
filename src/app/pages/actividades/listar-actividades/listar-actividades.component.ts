import { afterNextRender, Component, computed, DestroyRef, ElementRef, inject, Injector, signal, viewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
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
  imports: [ReactiveFormsModule, PageTitleComponent, DialogoComponent, DialogoConfirmacionComponent, HasPermissionDirective],
  templateUrl: './listar-actividades.component.html',
  styleUrl: './listar-actividades.component.scss',
})
export class ListarActividadesComponent {
  private readonly servicio = inject(ActividadesService);
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly documento = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly dialogoFormulario = viewChild.required<DialogoComponent>('dialogoFormulario');
  private readonly elementoFormulario = viewChild.required('dialogoFormulario', { read: ElementRef<HTMLElement> });
  private readonly botonNueva = viewChild.required<ElementRef<HTMLButtonElement>>('botonNueva');
  private overflowAnterior: string | null = null;
  private readonly dialogoDetalle = viewChild.required<DialogoComponent>('dialogoDetalle');
  private readonly confirmacion = viewChild.required(DialogoConfirmacionComponent);
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
  protected readonly catalogosDisponibles = computed(() => !this.cargandoAreas() && !this.cargandoTipos()
    && !this.errorAreas() && !this.errorTipos() && this.areas().length > 0 && this.tipos().length > 0);
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
  protected readonly eliminando = signal(false);
  protected readonly porEliminar = signal<Actividad | null>(null);
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
    });
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.erroresServidor.set({}));
  }

  protected cargar(): void {
    if (this.eliminando() || this.cambiandoEstado()) return;
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
    this.cargandoAreas.set(true);
    this.cargandoTipos.set(true);
    this.errorAreas.set(null);
    this.errorTipos.set(null);
    this.servicio.listarAreas().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: areas => { this.areas.set(areas); this.cargandoAreas.set(false); },
      error: (error: ErrorApi) => {
        this.errorAreas.set(error.status === 403
          ? 'El servidor denegó la lectura del catálogo de áreas para tu sesión. Solicita la revisión del acceso a este catálogo.'
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
    if (!this.auth.tienePermiso('actividades.editar') || this.cambiandoEstado() || this.eliminando()) return;
    this.porCambiarEstado.set(actividad);
    if (!await this.confirmacionEstado().abrir() || this.destruido
      || !this.auth.tienePermiso('actividades.editar') || this.cambiandoEstado() || this.eliminando()) return;
    const estado = actividad.estado === 'Activa' ? 'Cerrada' : 'Activa';
    this.cambiandoEstado.set(true);
    this.aviso.set(null);
    this.servicio.cambiarEstado(actividad.id_actividad, estado).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: respuesta => {
        this.actividades.update(lista => lista.map(item => item.id_actividad === actividad.id_actividad ? respuesta.data : item));
        this.cambiandoEstado.set(false);
        this.aviso.set({ tipo: 'exito', texto: respuesta.message });
      },
      error: (error: ErrorApi) => {
        this.cambiandoEstado.set(false);
        this.aviso.set({ tipo: 'error', texto: this.mensajeError(error) });
      },
    });
  }

  protected nombreArea(id: number): string { return this.nombresAreas().get(id) ?? 'Área no disponible'; }
  protected nombreTipo(id: number): string { return this.nombresTipos().get(id) ?? 'Tipo no disponible'; }

  protected fecha(valor: string | null): string {
    if (!valor) return '—';
    // Fechas de calendario: no convertir a UTC para evitar desplazar el día en Lima.
    const fecha = valor.slice(0, 10).split('-');
    return fecha.length === 3 ? `${fecha[2]}/${fecha[1]}/${fecha[0]}` : valor;
  }

  protected abrirFormulario(actividad: Actividad | null): void {
    // La apertura del alta es visual; guardar sigue exigiendo el permiso real.
    if (actividad && !this.auth.tienePermiso('actividades.editar')) return;
    if (this.formularioAbierto() || this.enviando() || this.eliminando() || this.cambiandoEstado()) return;
    this.solicitudEdicion?.unsubscribe();
    this.formularioAbierto.set(true);
    this.overflowAnterior = this.documento.body.style.overflow;
    this.documento.body.style.overflow = 'hidden';
    this.dialogoFormulario().abrir();
    this.editando.set(actividad?.id_actividad ?? null);
    this.errorFormulario.set(null);
    this.erroresServidor.set({});
    this.form.reset();
    this.cargandoEdicion.set(!!actividad);
    if (!actividad) return;

    this.solicitudEdicion = this.servicio.obtener(actividad.id_actividad)
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: actual => {
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
    afterNextRender(() => this.botonNueva().nativeElement.focus(), { injector: this.injector });
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
    if (this.enviando() || this.cargandoEdicion()) return;
    this.errorFormulario.set(null);
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (!this.auth.tienePermiso(this.editando() === null ? 'actividades.crear' : 'actividades.editar')) {
      this.errorFormulario.set('Guardado pendiente de autorización. Tu sesión no dispone del permiso para esta operación.');
      return;
    }
    if (!this.catalogosDisponibles()) {
      this.errorFormulario.set('Guardado pendiente de conexión: carga las áreas y los tipos de actividad antes de continuar.');
      return;
    }
    const valores = this.form.getRawValue();
    const payload: ActividadPayload = {
      ...valores, id_area: Number(valores.id_area), id_tipo_actividad: Number(valores.id_tipo_actividad),
      nombre: valores.nombre.trim(), estado: this.editando() === null ? 'Activa' : valores.estado.trim(),
      descripcion: valores.descripcion.trim() || null, sede: valores.sede.trim() || null,
    };
    this.enviando.set(true);
    this.errorFormulario.set(null);
    this.erroresServidor.set({});
    this.form.disable({ emitEvent: false });
    const id = this.editando();
    const peticion = id === null ? this.servicio.crear(payload) : this.servicio.actualizar(id, payload);
    peticion.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: respuesta => {
        this.form.enable({ emitEvent: false });
        this.enviando.set(false);
        this.cerrarFormulario();
        this.aviso.set({ tipo: 'exito', texto: respuesta.message });
        if (id === null) this.limpiarFiltros();
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

  protected verDetalle(actividad: Actividad): void {
    if (!this.auth.tienePermiso('actividades.ver')) return;
    this.cerrarDetalle();
    this.detalle.set(null);
    this.errorDetalle.set(null);
    this.ponentes.set([]);
    this.errorPonentes.set(null);
    this.cargandoDetalle.set(true);
    this.dialogoDetalle().abrir();
    this.solicitudDetalle = this.servicio.obtener(actividad.id_actividad)
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: detalle => { this.detalle.set(detalle); this.cargandoDetalle.set(false); this.cargarPonentes(); },
        error: (error: ErrorApi) => { this.errorDetalle.set(this.mensajeError(error)); this.cargandoDetalle.set(false); },
      });
  }

  protected cargarPonentes(): void {
    const actividad = this.detalle();
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

  protected async eliminar(actividad: Actividad): Promise<void> {
    if (!this.auth.tienePermiso('actividades.eliminar')) return;
    if (this.eliminando() || this.cambiandoEstado()) return;
    this.porEliminar.set(actividad);
    if (!await this.confirmacion().abrir() || this.destruido || this.cambiandoEstado() || !this.auth.tienePermiso('actividades.eliminar')) return;
    this.eliminando.set(true);
    this.servicio.eliminar(actividad.id_actividad).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: respuesta => {
        this.eliminando.set(false);
        this.aviso.set({ tipo: 'exito', texto: respuesta.message });
        this.cargar();
      },
      error: (error: ErrorApi) => {
        this.eliminando.set(false);
        this.aviso.set({ tipo: 'error', texto: this.mensajeError(error) });
      },
    });
  }

  private mensajeError(error: ErrorApi): string {
    return error.status === 0 ? 'No se pudo conectar con el servidor. Comprueba tu conexión e intenta nuevamente.' : error.mensaje;
  }
}
