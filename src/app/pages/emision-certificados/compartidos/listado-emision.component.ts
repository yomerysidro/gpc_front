import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { afterNextRender, Component, computed, DestroyRef, ElementRef, inject, Injector, input, OnChanges, PLATFORM_ID, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { map, Subscription } from 'rxjs';
import { ErrorApi } from '../../../core/interfaces/api/api-response.interface';
import { FiltrosEmision, PaginaEmision, RecursoEmision, RegistroEmision } from '../../../core/interfaces/emision-certificados/emision-certificados.interface';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { EmisionCertificadosService, PERMISOS_EMISION } from '../../../core/services/emision-certificados/emision-certificados.service';
import { DialogoComponent } from '../../../shared/components/dialogo/dialogo.component';
import { DialogoConfirmacionComponent } from '../../../shared/components/dialogo-confirmacion/dialogo-confirmacion.component';
import { CONFIGURACION_EMISION, esEditable, esEliminable } from './emision.config';
import { FormularioEmisionComponent } from './formulario-emision.component';
import { FILTROS_SESIONES_VACIOS, FiltrosSesionesAsistencia, SesionesAsistenciaListado } from '../actividades/sesiones-asistencia-listado';
import { aErrorApi } from '../../../shared/utils/error-api';
import { ESTADOS_ASISTENCIAS, ESTADOS_SESIONES, etiquetaEstado } from '../actividades/estados-sesiones-asistencia';
import { CatalogoClasificacion, ClasificacionesListado, estadoClasificacion, ESTADOS_CLASIFICACIONES } from '../configuracion/tipos-certificado/clasificaciones-listado';

export interface EstadoNavegacionListado {
  readonly campo: string;
  readonly valor: string;
  readonly pagina: number;
  readonly filtrosSesiones?: FiltrosSesionesAsistencia;
  readonly cantidad?: number;
}

@Component({
  selector: 'app-listado-emision', standalone: true,
  imports: [RouterLink, ReactiveFormsModule, FormularioEmisionComponent, DialogoConfirmacionComponent, DialogoComponent],
  templateUrl: './listado-emision.component.html', styleUrls: ['./emision.scss', './sesiones-asistencia-modal.scss', '../actividades/sesiones-asistencia-listado.scss', '../configuracion/tipos-certificado/clasificaciones.scss'],
  providers: [SesionesAsistenciaListado, ClasificacionesListado],
  host: { '[class.clasificacion]': 'esClasificacion()' },
})
export class ListadoEmisionComponent implements OnChanges {
  readonly recurso = input.required<RecursoEmision>();
  readonly tituloEncabezado = input<string>('');
  readonly nuevoUrl = input<string | null>(null);
  readonly editarBase = input<string | null>(null);
  readonly detalleBase = input<string | null>(null);
  readonly filtrosFijos = input<FiltrosEmision>({});
  readonly soloLectura = input(false);
  readonly formularioModal = input(false);
  readonly clasificacion = input(false);
  readonly estadoInicial = input<EstadoNavegacionListado | null>(null);
  readonly actividadContexto = input<{ id_actividad: number; nombre: string } | null>(null);
  protected readonly actividadFormulario = signal<{ id_actividad: number; nombre: string } | null>(null);
  private numeroPagina = 1;
  private readonly api = inject(EmisionCertificadosService);
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly plataforma = inject(PLATFORM_ID);
  private readonly documento = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly modal = viewChild.required<DialogoComponent>('modalRegistro');
  private readonly elementoModal = viewChild.required('modalRegistro', { read: ElementRef<HTMLElement> });
  private readonly formulario = viewChild(FormularioEmisionComponent);
  private overflowAnterior: string | null = null;
  private disparador: HTMLElement | null = null;
  protected readonly usaModal = computed(() => this.recurso() === 'activity-session' || this.recurso() === 'attendance');
  protected readonly mostrarModal = computed(() => this.usaModal() || this.formularioModal());
  protected readonly tituloModal = computed(() => (this.editar() === null ? 'Nuevo registro - ' : 'Editar - ') + this.config().titulo);
  private readonly confirmacion = viewChild.required(DialogoConfirmacionComponent);
  private carga?: Subscription;
  private detalleCarga?: Subscription;
  protected readonly config = computed(() => CONFIGURACION_EMISION[this.recurso()]);
  protected readonly editable = computed(() => { const recurso = this.recurso(); return esEditable(recurso) ? recurso : null; });
  protected readonly pagina = signal<PaginaEmision<RegistroEmision> | null>(null);
  protected readonly cargando = signal(false);
  protected readonly errorCarga = signal<string | null>(null);
  protected readonly aviso = signal<string | null>(null);
  protected readonly errorOperacion = signal<string | null>(null);
  protected readonly eliminando = signal(false);
  protected readonly editar = signal<number | null | undefined>(undefined);
  protected readonly detalle = signal<RegistroEmision | null>(null);
  protected readonly cargandoDetalle = signal(false);
  protected readonly relaciones = signal<Readonly<Record<string, Readonly<Record<number, string>>>>>({});
  protected readonly errorRelaciones = signal<Readonly<Record<string, string>>>({});
  private relacionesCarga = new Subscription();
  protected readonly filtro = inject(NonNullableFormBuilder).group({ campo: [''], valor: [''] });
  protected readonly catalogosSesiones = inject(SesionesAsistenciaListado);
  protected readonly filtrosSesiones = inject(NonNullableFormBuilder).group({ ...FILTROS_SESIONES_VACIOS });
  protected readonly cantidad = signal(10);
  protected readonly esClasificacion = computed(() => this.clasificacion() && ['ativicty-type', 'participation-type', 'tipos-certificado'].includes(this.recurso()));
  private readonly catalogoClasificacion = inject(ClasificacionesListado);
  protected readonly filtrosClasificacion = inject(NonNullableFormBuilder).group({ nombre: '', estado: '' });
  protected readonly estadosClasificaciones = ESTADOS_CLASIFICACIONES;
  protected limpiarClasificacion(): void { this.filtrosClasificacion.reset(); this.cargar(1); }
  protected readonly opcionesEstado = computed(() => this.recurso() === 'attendance' ? ESTADOS_ASISTENCIAS : ESTADOS_SESIONES.filter(estado => estado.valor !== 'cerrado'));

  protected aplicarFiltros(): void { this.cargar(1); }
  protected cambiarActividad(): void {
    this.filtrosSesiones.controls.sesion.setValue('');
    this.aplicarFiltros();
  }
  protected limpiarFiltros(): void {
    this.filtrosSesiones.reset({ ...FILTROS_SESIONES_VACIOS, actividad: this.actividadContexto() ? String(this.actividadContexto()!.id_actividad) : '' });
    this.cargar(1);
  }
  protected cambiarCantidad(valor: string): void {
    const cantidad = Number(valor);
    if (![5, 10, 50].includes(cantidad)) return;
    this.cantidad.set(cantidad); this.cargar(1);
  }
  protected tituloColumna(nombre: string, titulo: string): string {
    if (!this.usaModal()) return titulo;
    return nombre === 'nombre' ? 'Nombre de sesión' : nombre === 'id_participacion' ? 'Participante' : titulo;
  }
  protected inicioRango(pagina: PaginaEmision<RegistroEmision>): number {
    return pagina.total ? (pagina.current_page - 1) * pagina.per_page + 1 : 0;
  }
  protected finRango(pagina: PaginaEmision<RegistroEmision>): number {
    return pagina.total ? this.inicioRango(pagina) + pagina.data.length - 1 : 0;
  }

  constructor() {
    this.destroyRef.onDestroy(() => this.restaurarDesplazamiento());
    afterNextRender(() => {
      const dialogo = this.elementoModal().nativeElement.querySelector('dialog')!;
      const cancelar = (evento: Event) => { evento.preventDefault(); this.cerrarFormulario(); };
      dialogo.addEventListener('cancel', cancelar);
      this.destroyRef.onDestroy(() => dialogo.removeEventListener('cancel', cancelar));
    });
  }

  ngOnChanges(): void {
    if (this.overflowAnterior !== null) { this.modal().cerrar(); this.restaurarDesplazamiento(); }
    this.editar.set(undefined);
    this.detalle.set(null);
    const estado = this.estadoInicial();
    this.catalogosSesiones.invalidar();
    this.catalogoClasificacion.invalidar();
    this.filtrosClasificacion.reset();
    this.filtrosSesiones.reset(estado?.filtrosSesiones ?? FILTROS_SESIONES_VACIOS, { emitEvent: false });
    if (this.actividadContexto()) {
      this.filtrosSesiones.controls.actividad.setValue(String(this.actividadContexto()!.id_actividad), { emitEvent: false });
      this.filtrosSesiones.controls.actividad.disable({ emitEvent: false });
    } else this.filtrosSesiones.controls.actividad.enable({ emitEvent: false });
    this.cantidad.set(estado?.cantidad ?? 10);
    if (estado) this.filtro.patchValue({ campo: estado.campo, valor: estado.valor }, { emitEvent: false });
    if (isPlatformBrowser(this.plataforma)) this.cargar(estado?.pagina ?? 1);
  }

  /** Solo estado de navegación; los registros siempre se vuelven a consultar con sus permisos. */
  obtenerEstadoNavegacion(): EstadoNavegacionListado {
    return { ...this.filtro.getRawValue(), pagina: this.pagina()?.current_page ?? this.numeroPagina,
      filtrosSesiones: this.filtrosSesiones.getRawValue(), cantidad: this.cantidad() };
  }

  protected permitido(accion: string): boolean {
    return this.auth.tienePermiso(`${PERMISOS_EMISION[this.recurso()]}.${accion}`);
  }

  protected puedeEliminar(): boolean { return !this.soloLectura() && esEliminable(this.recurso()) && this.permitido('eliminar'); }

  protected cargar(numero = 1): void {
    this.numeroPagina = numero;
    this.relacionesCarga.unsubscribe(); this.relacionesCarga = new Subscription(); this.relaciones.set({}); this.errorRelaciones.set({});
    this.carga?.unsubscribe();
    this.errorCarga.set(null);
    this.pagina.set(null);
    if (!this.permitido('ver')) { this.errorCarga.set('No tienes permiso para consultar estos registros.'); return; }
    if (this.esClasificacion()) {
      this.cargando.set(true);
      this.carga = this.catalogoClasificacion.cargar(this.recurso() as CatalogoClasificacion).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          const filtros = this.filtrosClasificacion.getRawValue();
          this.pagina.set(this.catalogoClasificacion.paginar(filtros.nombre, filtros.estado, numero, this.cantidad()));
          this.cargando.set(false);
        },
        error: (error: ErrorApi) => { this.cargando.set(false); this.errorCarga.set(error.mensaje ?? aErrorApi(error).mensaje); },
      });
      return;
    }
    if (this.usaModal()) {
      this.cargando.set(true);
      this.carga = this.catalogosSesiones.cargar(this.recurso() === 'attendance', this.actividadContexto()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          this.pagina.set(this.catalogosSesiones.paginar(this.filtrosSesiones.getRawValue(), this.recurso() === 'attendance', numero, this.cantidad()));
          this.cargando.set(false);
        },
        error: (error: ErrorApi) => { this.cargando.set(false); this.errorCarga.set(error.mensaje ?? aErrorApi(error).mensaje); },
      });
      return;
    }
    const { campo, valor } = this.filtro.getRawValue();
    const filtros: Record<string, string | number | boolean | null | undefined> = { page: numero, per_page: 20 };
    if (this.config().filtros.some(filtro => filtro.nombre === campo) && valor.trim()) filtros[campo] = valor.trim();
    Object.assign(filtros, this.filtrosFijos());
    this.cargando.set(true);
    this.carga = this.api.listar(this.recurso(), filtros).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: pagina => { this.pagina.set(pagina); this.cargando.set(false); if (pagina.data.length) this.cargarRelaciones(); },
      error: (error: ErrorApi) => { this.cargando.set(false); this.errorCarga.set(error.mensaje); },
    });
  }

  protected identificar(registro: RegistroEmision): number { return Number(registro[this.config().clave]); }
  protected mostrar(valor: RegistroEmision[string] | undefined): string {
    return valor === null || valor === undefined || valor === '' ? '—' : typeof valor === 'boolean' ? valor ? 'Sí' : 'No' : String(valor);
  }

  protected mostrarCampo(registro: RegistroEmision, nombre: string): string {
    if (this.esClasificacion() && nombre === 'estado') {
      return ESTADOS_CLASIFICACIONES.find(opcion => opcion.valor === estadoClasificacion(registro[nombre]))?.etiqueta ?? this.mostrar(registro[nombre]);
    }
    if (this.usaModal()) {
      if (nombre === 'estado') return etiquetaEstado(registro[nombre], this.recurso() === 'attendance');
      if (nombre === 'id_actividad') return this.mostrar(registro['actividadNombre']);
      if (nombre === 'id_participacion') return this.mostrar(registro['participanteNombre']);
      if (nombre === 'id_actividad_sesion') return this.mostrar(registro['sesionNombre']);
      if (nombre === 'fecha') {
        const fecha = String(registro[nombre] ?? '').match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (fecha) return `${fecha[3]}/${fecha[2]}/${fecha[1]}`;
      }
    }
    const id = Number(registro[nombre]);
    return this.relaciones()[nombre]?.[id] ?? this.mostrar(registro[nombre]);
  }

  protected erroresRelaciones(): readonly string[] { return Object.values(this.errorRelaciones()); }

  private cargarRelaciones(): void {
    for (const campo of this.config().columnas.filter(campo => campo.relacion)) {
      const peticion = campo.relacion === 'gestion' ? this.api.relaciones(campo.nombre)
        : this.api.listarTodos(campo.relacion!).pipe(map(registros => registros.map(registro => {
          const cfg = CONFIGURACION_EMISION[campo.relacion as RecursoEmision];
          const id = Number(registro[cfg.clave]);
          return { id, texto: String(registro['nombre_tipo'] ?? registro['titulo'] ?? registro['codigo_verificacion'] ?? `Registro #${id}`) };
        })));
      this.relacionesCarga.add(peticion.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: opciones => this.relaciones.update(actual => ({ ...actual, [campo.nombre]: Object.fromEntries(opciones.map(opcion => [opcion.id, opcion.texto])) })),
        error: (error: ErrorApi) => this.errorRelaciones.update(actual => ({ ...actual, [campo.nombre]: `${campo.titulo}: ${error.mensaje}` })),
      }));
    }
  }

  protected verDetalle(registro: RegistroEmision): void {
    this.detalleCarga?.unsubscribe();
    this.detalle.set(null);
    this.errorOperacion.set(null);
    this.cargandoDetalle.set(true);
    this.detalleCarga = this.api.obtener(this.recurso(), this.identificar(registro)).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: detalle => { this.detalle.set(detalle); this.cargandoDetalle.set(false); },
      error: (error: ErrorApi) => { this.errorOperacion.set(error.mensaje); this.cargandoDetalle.set(false); },
    });
  }

  protected camposDetalle() {
    return [...new Map([...this.config().columnas, ...this.config().campos]
      .filter(campo => !['passphrase', 'ruta_archivo', 'ruta_archivo_pfx'].includes(campo.nombre))
      .map(campo => [campo.nombre, campo])).values()];
  }

  protected alGuardar(): void {
    this.catalogoClasificacion.invalidar();
    this.catalogosSesiones.invalidar();
    this.cerrarFormulario(); this.detalle.set(null); this.aviso.set('Cambios guardados.'); this.cargar(1);
  }

  protected abrirFormulario(id: number | null, evento?: Event): void {
    const seleccion = this.catalogosSesiones.actividades.find(a => String(a['id_actividad']) === this.filtrosSesiones.controls.actividad.value);
    this.actividadFormulario.set(this.actividadContexto() ?? (seleccion ? { id_actividad: Number(seleccion['id_actividad']), nombre: String(seleccion['nombre']) } : null));
    if (this.mostrarModal()) {
      if (this.editar() !== undefined || this.eliminando()) return;
      this.aviso.set(null);
      this.errorOperacion.set(null);
      this.detalleCarga?.unsubscribe();
      this.detalle.set(null);
      this.cargandoDetalle.set(false);
    }
    this.editar.set(id);
    if (this.mostrarModal()) {
      this.disparador = (evento?.currentTarget ?? this.documento.activeElement) as HTMLElement | null;
      this.overflowAnterior = this.documento.body.style.overflow;
      this.documento.body.style.overflow = 'hidden';
      this.modal().abrir();
    }
  }

  protected cerrarFormulario(): void {
    if (this.formulario()?.enviando()) return;
    if (!this.mostrarModal()) { this.editar.set(undefined); return; }
    this.modal().cerrar(); this.alCerrarModal();
    afterNextRender(() => {
      if (this.editar() === undefined) this.modal().cerrar();
    }, { injector: this.injector });
  }

  protected alCerrarModal(): void {
    if (this.editar() === undefined || this.elementoModal().nativeElement.querySelector('dialog')?.open) return;
    this.editar.set(undefined);
    this.restaurarDesplazamiento();
    const disparador = this.disparador;
    this.disparador = null;
    afterNextRender(() => { if (disparador?.isConnected) disparador.focus(); }, { injector: this.injector });
  }

  private restaurarDesplazamiento(): void {
    if (this.overflowAnterior === null) return;
    this.documento.body.style.overflow = this.overflowAnterior;
    this.overflowAnterior = null;
  }

  protected async eliminar(registro: RegistroEmision): Promise<void> {
    const recurso = this.recurso();
    if (this.eliminando() || !this.puedeEliminar() || !esEliminable(recurso)) return;
    if (!await this.confirmacion().abrir()) return;
    this.eliminando.set(true);
    this.errorOperacion.set(null);
    this.api.eliminar(recurso, this.identificar(registro)).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => { this.catalogoClasificacion.invalidar(); this.catalogosSesiones.invalidar(); this.eliminando.set(false); this.detalle.set(null); this.aviso.set('Registro eliminado.'); this.cargar(1); },
      error: (error: ErrorApi) => { this.eliminando.set(false); this.errorOperacion.set(error.mensaje); },
    });
  }
}
