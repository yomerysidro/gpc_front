import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { afterNextRender, Component, computed, DestroyRef, ElementRef, inject, Injector, input, OnChanges, output, PLATFORM_ID, signal, SimpleChanges, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, concatMap, defer, from, map, Observable, of, Subscription, switchMap, tap } from 'rxjs';
import { ErrorApi } from '../../../core/interfaces/api/api-response.interface';
import { FiltrosEmision, PaginaEmision, RecursoEmision, RegistroEmision } from '../../../core/interfaces/emision-certificados/emision-certificados.interface';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { EmisionCertificadosService, PERMISOS_EMISION } from '../../../core/services/emision-certificados/emision-certificados.service';
import { DialogoComponent } from '../../../shared/components/dialogo/dialogo.component';
import { DialogoConfirmacionComponent } from '../../../shared/components/dialogo-confirmacion/dialogo-confirmacion.component';
import { CONFIGURACION_EMISION, esEditable, esEliminable } from './emision.config';
import { FormularioEmisionComponent } from './formulario-emision.component';
import { DatosAsistenciaContextual, FILTROS_SESIONES_VACIOS, FiltrosSesionesAsistencia, SesionesAsistenciaListado } from '../actividades/sesiones-asistencia-listado';
import { aErrorApi } from '../../../shared/utils/error-api';
import { ESTADOS_ASISTENCIAS, ESTADOS_SESIONES, etiquetaEstado, resultadoPresencia, resumenPresencia } from '../actividades/estados-sesiones-asistencia';
import { CatalogoClasificacion, ClasificacionesListado, estadoClasificacion, ESTADOS_CLASIFICACIONES } from '../configuracion/tipos-certificado/clasificaciones-listado';

export interface EstadoNavegacionListado {
  readonly campo: string;
  readonly valor: string;
  readonly pagina: number;
  readonly filtrosSesiones?: FiltrosSesionesAsistencia;
  readonly cantidad?: number;
}

interface MarcaPendiente {
  asistencia?: number;
  participacion: number;
  sesion: number;
  estado: 'PRESENTE' | 'AUSENTE';
}

@Component({
  selector: 'app-listado-emision', standalone: true,
  imports: [RouterLink, ReactiveFormsModule, FormularioEmisionComponent, DialogoConfirmacionComponent, DialogoComponent],
  templateUrl: './listado-emision.component.html', styleUrls: ['./emision.scss', './sesiones-asistencia-modal.scss', '../actividades/sesiones-asistencia-listado.scss', '../configuracion/tipos-certificado/clasificaciones.scss'],
  providers: [SesionesAsistenciaListado, ClasificacionesListado],
  host: { '[class.clasificacion]': 'esClasificacion()' },
})
export class ListadoEmisionComponent implements OnChanges {
  inicializado = false;
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly asistenciaContexto = signal<{ id_participacion: number; id_actividad_sesion: number; nombre: string } | null>(null);
  protected readonly presencia = resultadoPresencia;
  protected readonly guardandoMarca = signal<number | null>(null);
  protected readonly guardandoSeleccion = signal(false);
  protected readonly marcasPendientes = signal<readonly MarcaPendiente[]>([]);
  protected readonly erroresMarcas = signal<Readonly<Record<string, string>>>({});
  readonly datosContexto = input<DatosAsistenciaContextual | null>(null);
  readonly accionesExternas = input(false);
  readonly paginaCompleta = input(false);
  readonly recargarTrasGuardar = input(false);
  readonly asistenciasActualizadas = output<readonly RegistroEmision[]>();
  estaGuardando(): boolean { return this.guardandoSeleccion() || this.guardandoMarca() !== null || !!this.formulario()?.enviando(); }
  cambiosPendientes(): number { return this.pendientesSesion().length; }
  puedeGuardarAsistencia(): boolean { return this.enDetalle() && !!this.cambiosPendientes() && !this.estaGuardando() && !this.cargando() && !this.requiereActualizar() && !this.soloLecturaSesion() && this.pendientesSesion().every(m => this.permitido(m.asistencia ? 'editar' : 'crear')); }
  descartarCambios(): void { this.descartarSeleccion(); }
  hayCambiosSinGuardar(): boolean { return !!this.cambiosPendientes() || !!this.formulario()?.hayCambiosSinGuardar(); }
  refrescarAsistencia(): void { this.actualizarAsistencia(); }
  private claveMarca(participacion: number, sesion: number): string { return `${sesion}:${participacion}`; }
  protected pendientesSesion(): readonly MarcaPendiente[] {
    return this.marcasPendientes().filter(m => String(m.sesion) === this.filtrosSesiones.controls.sesion.value);
  }
  protected borrador(fila: RegistroEmision): MarcaPendiente | undefined {
    return this.marcasPendientes().find(m => m.participacion === Number(fila['id_participacion']) && m.sesion === Number(fila['id_actividad_sesion']));
  }
  protected presenciaMostrada(fila: RegistroEmision) {
    const marca = this.enDetalle() ? this.borrador(fila) : undefined;
    return marca ? marca.estado === 'PRESENTE' ? 'presente' : 'ausente' : resultadoPresencia(fila);
  }
  protected errorMarca(fila: RegistroEmision): string | undefined {
    return this.erroresMarcas()[this.claveMarca(Number(fila['id_participacion']), Number(fila['id_actividad_sesion']))];
  }
  protected descartarSeleccion(): void {
    if (this.estaGuardando()) return;
    this.marcasPendientes.update(marcas => marcas.filter(m => String(m.sesion) !== this.filtrosSesiones.controls.sesion.value));
  }
  protected readonly requiereActualizar = signal(false);
  private actualizandoMarcas = false;
  private marcacion?: Subscription;
  protected readonly registrandoSesion = signal(false);
  protected resumenAsistencia() {
    return resumenPresencia(this.catalogosSesiones.matriz(this.filtrosSesiones.controls.actividad.value, this.filtrosSesiones.controls.sesion.value));
  }
  protected registrarSesion(evento: Event): void {
    if (!this.filtrosSesiones.controls.actividad.value || !this.auth.tienePermiso('actividades.crear')) return;
    this.registrandoSesion.set(true); this.abrirFormulario(null, evento);
  }
  protected puedeCrearSesion(): boolean { return this.auth.tienePermiso('actividades.crear'); }
  protected marcarPresencia(fila: RegistroEmision, estado: 'PRESENTE' | 'AUSENTE'): void {
    if (this.estaGuardando() || this.requiereActualizar() || fila['duplicada'] || !this.permitido(fila['id_asistencia'] ? 'editar' : 'crear') || this.soloLecturaSesion()) return;
    const participacion = Number(fila['id_participacion']);
    const sesion = Number(fila['id_actividad_sesion']);
    if (![participacion, sesion].every(id => Number.isSafeInteger(id) && id > 0)) return;
    if (fila['id_asistencia'] && (!Number.isSafeInteger(Number(fila['id_asistencia'])) || Number(fila['id_asistencia']) < 1)) return;
    const actividad = this.filtrosSesiones.controls.actividad.value;
    if (!this.catalogosSesiones.matriz(actividad, String(sesion)).some(registro => Number(registro['id_participacion']) === participacion)) return;
    if (this.enDetalle() && !this.paginaCompleta()) {
      const anterior = this.borrador(fila);
      this.marcasPendientes.update(marcas => [...marcas.filter(m => m.participacion !== participacion || m.sesion !== sesion),
        ...(anterior?.estado === estado || fila['estado'] === estado ? [] : [{ participacion, sesion, estado, asistencia: fila['id_asistencia'] ? Number(fila['id_asistencia']) : undefined }])]);
      this.aviso.set(null); return;
    }
    if (fila['estado'] === estado) return;
    this.guardandoMarca.set(participacion); this.errorOperacion.set(null); this.aviso.set(null);
    let recibido = false;
    this.marcacion = this.confirmarMarca({ participacion, sesion, estado, asistencia: fila['id_asistencia'] ? Number(fila['id_asistencia']) : undefined }, () => recibido = true).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: registro => {
        if (Number(registro['id_participacion']) !== participacion || Number(registro['id_actividad_sesion']) !== sesion || String(registro['estado']).toUpperCase() !== estado) {
          this.guardandoMarca.set(null); this.requiereActualizar.set(true); this.errorOperacion.set('No se pudo verificar la marca guardada. Actualiza la consulta antes de intentar otra operación.'); return;
        }
        this.incorporarMarca(registro);
        this.guardandoMarca.set(null); this.aviso.set('Asistencia confirmada por Laravel.'); this.registroGuardado.emit();
      },
      error: (error: ErrorApi) => {
        this.guardandoMarca.set(null);
        this.requiereActualizar.set(true);
        const campos = Object.values(error.errores ?? {}).flat().join(' ');
        this.errorOperacion.set(`${recibido ? 'Laravel recibió la marca, pero no se pudo confirmar su consulta. ' : ''}${error.status ? `HTTP ${error.status}. ` : ''}${error.mensaje || aErrorApi(error).mensaje} ${campos}`.trim());
      },
    });
  }
  private confirmarMarca(marca: MarcaPendiente, alRecibir?: () => void): Observable<RegistroEmision> {
    const escritura = marca.asistencia
      ? this.api.actualizar('attendance', marca.asistencia, { estado: marca.estado })
      : this.api.crear('attendance', { id_participacion: marca.participacion, id_actividad_sesion: marca.sesion, estado: marca.estado });
    return escritura.pipe(
      switchMap(registro => {
        alRecibir?.();
        const id = Number(registro['id_asistencia'] ?? registro['ID_ASISTENCIA']);
        if (!Number.isSafeInteger(id) || id < 1) throw new Error('Laravel no devolvió el identificador de la asistencia.');
        return this.api.obtener('attendance', id);
      }),
      map(registro => {
        if (Number(registro['id_participacion']) !== marca.participacion || Number(registro['id_actividad_sesion']) !== marca.sesion || String(registro['estado']).toUpperCase() !== marca.estado) {
          throw new Error('No se pudo verificar la marca guardada. Actualiza la consulta antes de reintentar.');
        }
        return registro;
      }),
    );
  }
  private incorporarMarca(registro: RegistroEmision): void {
    this.catalogosSesiones.asistencias = [...this.catalogosSesiones.asistencias.filter(m => Number(m['id_asistencia']) !== Number(registro['id_asistencia'])), registro];
    this.actualizarPaginaContextual();
  }
  private actualizarPaginaContextual(): void {
    this.pagina.set(this.catalogosSesiones.paginar(this.filtrosSesiones.getRawValue(), true, this.numeroPagina, this.cantidad()));
  }
  protected guardarSeleccion(): void {
    const marcas = this.pendientesSesion();
    if (!this.puedeGuardarAsistencia()) return;
    const filas = this.catalogosSesiones.matriz(this.filtrosSesiones.controls.actividad.value, this.filtrosSesiones.controls.sesion.value);
    if (marcas.some(m => !filas.some(f => Number(f['id_participacion']) === m.participacion && Number(f['id_asistencia'] || 0) === (m.asistencia || 0) && !f['duplicada']))) {
      this.requiereActualizar.set(true); this.errorOperacion.set('Actualiza la asistencia antes de guardar: hay registros que requieren regularización.'); return;
    }
    this.guardandoSeleccion.set(true); this.errorOperacion.set(null); this.aviso.set(null); this.erroresMarcas.set({});
    let confirmadas = 0; let fallidas = 0;
    this.marcacion = from(marcas).pipe(concatMap(marca => defer(() => {
      this.guardandoMarca.set(marca.participacion);
      return this.confirmarMarca(marca).pipe(tap(registro => {
        this.incorporarMarca(registro); confirmadas++;
        this.marcasPendientes.update(actuales => actuales.filter(m => m.participacion !== marca.participacion || m.sesion !== marca.sesion));
      }), catchError((error: ErrorApi) => {
        fallidas++; this.requiereActualizar.set(true);
        const mensaje = `${error.status ? `HTTP ${error.status}. ` : ''}${error.mensaje || aErrorApi(error).mensaje} ${Object.values(error.errores ?? {}).flat().join(' ')}`.trim();
        this.erroresMarcas.update(errores => ({ ...errores, [this.claveMarca(marca.participacion, marca.sesion)]: mensaje }));
        return of(null);
      }));
    })), takeUntilDestroyed(this.destroyRef)).subscribe({ complete: () => {
      this.guardandoMarca.set(null); this.guardandoSeleccion.set(false);
      if (confirmadas + fallidas !== marcas.length) return;
      if (fallidas) this.errorOperacion.set(`${confirmadas} marcas confirmadas; ${fallidas} sin confirmar. Actualiza la asistencia antes de reintentar.`);
      else this.aviso.set(`${confirmadas} marcas confirmadas por Laravel.`);
      this.asistenciasActualizadas.emit(this.catalogosSesiones.asistencias);
      if (confirmadas) this.registroGuardado.emit();
      if (confirmadas && this.recargarTrasGuardar()) this.actualizarAsistencia(true);
    } });
  }
  protected actualizarAsistencia(conservarResultado = false): void {
    if (this.estaGuardando()) return;
    if (this.enDetalle() && this.datosContexto()) {
      this.requiereActualizar.set(true);
      this.cargando.set(true); this.errorCarga.set(null);
      this.carga?.unsubscribe();
      const contexto = this.datosContexto()!;
      const sesion = Number(contexto.sesiones[0]?.['id_actividad_sesion']);
      const consulta: Observable<readonly RegistroEmision[]> = contexto.soloSeleccionados
        ? this.api.participantesSesion(sesion).pipe(map(respuesta => {
          if (Number(respuesta.id_actividad) !== contexto.actividad.id_actividad || Number(respuesta.id_actividad_sesion) !== sesion) {
            throw new Error('Laravel no confirmó los participantes de esta sesión.');
          }
          const participantes = respuesta.participantes.filter(p => p.seleccionado && p.id_asistencia != null);
          const asistencias = participantes.map(p => ({
            id_participacion: p.id_participacion, id_actividad_sesion: sesion, id_asistencia: p.id_asistencia,
            estado: p.estado_asistencia, hora_entrada: p.hora_entrada, hora_salida: p.hora_salida,
          }));
          this.catalogosSesiones.usarContexto({
            ...contexto, asistencias,
            participantes: [...new Map(participantes.map(p => [p.id_participacion, {
              id: p.id_participacion, nombres: p.nombre_completo || 'Nombre no disponible', apellidos: '', fechaInscripcion: p.fecha_inscripcion,
            }])).values()],
          });
          return asistencias;
        }))
        : this.api.listarTodos('attendance');
      this.carga = consulta.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: registros => {
          this.catalogosSesiones.asistencias = registros;
          // Un POST ambiguo nunca se repite si la consulta encuentra ya su par inscripción/sesión.
          this.marcasPendientes.update(marcas => marcas.flatMap(m => {
            const existente = registros.find(r => Number(r['id_participacion']) === m.participacion && Number(r['id_actividad_sesion']) === m.sesion);
            if (!existente) return [m];
            return existente['estado'] === m.estado ? [] : [{ ...m, asistencia: Number(existente['id_asistencia']) }];
          }));
          this.requiereActualizar.set(false);
          if (!conservarResultado) { this.erroresMarcas.set({}); this.errorOperacion.set(null); }
          this.cargando.set(false); this.actualizarPaginaContextual(); this.asistenciasActualizadas.emit(registros);
        },
        error: (error: ErrorApi) => { this.cargando.set(false); this.errorCarga.set(error.mensaje || aErrorApi(error).mensaje); },
      }); return;
    }
    this.actualizandoMarcas = true; this.catalogosSesiones.invalidar(); this.cargar(this.numeroPagina);
  }
  protected controlarAsistencia(registro: RegistroEmision): void {
    void this.router.navigate(['/certificaciones/sesiones-asistencia'], { queryParams: { id_actividad: registro['id_actividad'], id_sesion: registro['id_actividad_sesion'], pestana: 'asistencias' } });
  }
  protected marcarAsistencia(registro: RegistroEmision, evento: Event): void {
    if (this.estaGuardando() || this.requiereActualizar() || this.soloLecturaSesion() || this.borrador(registro)) return;
    const check = evento.target as HTMLInputElement;
    if (check instanceof HTMLInputElement) check.checked = false; // Una intención no es una marca guardada.
    if (registro['duplicada'] || !this.permitido(registro['id_asistencia'] ? 'editar' : 'crear')) return;
    this.asistenciaContexto.set({ id_participacion: Number(registro['id_participacion']), id_actividad_sesion: Number(registro['id_actividad_sesion']), nombre: String(registro['participanteNombre']) });
    this.abrirFormulario(registro['id_asistencia'] ? Number(registro['id_asistencia']) : null, evento);
  }
  protected resultadoAsistencia(registro: RegistroEmision): string {
    if (this.enDetalle() && this.borrador(registro)) return `${this.presenciaMostrada(registro) === 'presente' ? 'Presente' : 'Ausente'} · Sin guardar`;
    return { presente: 'Presente', ausente: 'Ausente', pendiente: 'Pendiente', sin_clasificar: 'Sin clasificar: requiere regularización', duplicada: 'Revisar registros duplicados' }[resultadoPresencia(registro)];
  }
  protected soloLecturaSesion(): boolean {
    return this.soloLectura() || this.recurso() === 'attendance' && this.catalogosSesiones.sesiones.some(s => String(s['id_actividad_sesion']) === this.filtrosSesiones.controls.sesion.value && s['estado'] === 'Finalizada');
  }
  readonly recurso = input.required<RecursoEmision>();
  readonly enDetalle = input(false);
  readonly registroGuardado = output<void>();
  readonly tituloEncabezado = input<string>('');
  readonly nuevoUrl = input<string | null>(null);
  readonly editarBase = input<string | null>(null);
  readonly detalleBase = input<string | null>(null);
  readonly filtrosFijos = input<FiltrosEmision>({});
  readonly soloLectura = input(false);
  readonly formularioModal = input(false);
  readonly clasificacion = input(false);
  readonly estadoInicial = input<EstadoNavegacionListado | null>(null);
  readonly reinicioNavegacion = input(0);
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
  protected readonly tituloModal = computed(() => this.registrandoSesion() ? 'Registrar sesión' : (this.editar() === null ? 'Nuevo registro - ' : 'Editar - ') + this.config().titulo);
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

  protected aplicarFiltros(): void {
    const { actividad, sesion } = this.filtrosSesiones.getRawValue();
    const parametros = this.route.snapshot.queryParamMap;
    const cambios = this.actividadContexto()
      ? { id_sesion: sesion || null }
      : { actividad_filtro: actividad || null, sesion_filtro: sesion || null };
    if (!this.enDetalle() && Object.entries(cambios).some(([clave, valor]) => parametros.get(clave) !== valor)) {
      void this.router.navigate([], { relativeTo: this.route, queryParamsHandling: 'merge', replaceUrl: true, queryParams: cambios });
    }
    this.cargar(1);
  }
  protected cambiarActividad(): void {
    this.filtrosSesiones.controls.sesion.setValue('');
    this.aplicarFiltros();
  }
  protected limpiarFiltros(): void {
    const sesion = this.enDetalle() ? this.filtrosSesiones.controls.sesion.value : '';
    this.filtrosSesiones.reset({ ...FILTROS_SESIONES_VACIOS, actividad: this.actividadContexto() ? String(this.actividadContexto()!.id_actividad) : '', sesion });
    this.aplicarFiltros();
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

  ngOnChanges(cambios: SimpleChanges): void {
    const cambioActividad = cambios['actividadContexto'];
    const mismoId = !cambioActividad || cambioActividad.previousValue?.id_actividad === cambioActividad.currentValue?.id_actividad;
    if (this.inicializado && this.enDetalle() && this.datosContexto() && mismoId && Object.keys(cambios).every(clave => ['datosContexto', 'soloLectura', 'actividadContexto', 'accionesExternas', 'recargarTrasGuardar'].includes(clave))) {
      if (cambios['datosContexto']) this.catalogosSesiones.usarContexto(this.datosContexto()!);
      this.actualizarPaginaContextual(); return;
    }
    const mismaActividad = this.inicializado && this.enDetalle() && mismoId && !cambios['recurso'];
    if (!mismaActividad) { this.marcasPendientes.set([]); this.erroresMarcas.set({}); }
    this.marcacion?.unsubscribe(); this.guardandoMarca.set(null); this.guardandoSeleccion.set(false); this.registrandoSesion.set(false);
    if (!mismaActividad) this.requiereActualizar.set(false);
    this.actualizandoMarcas = false;
    this.inicializado = true;
    this.asistenciaContexto.set(null);
    if (this.overflowAnterior !== null) { this.modal().cerrar(); this.restaurarDesplazamiento(); }
    this.editar.set(undefined);
    this.detalle.set(null);
    const reinicio = cambios['reinicioNavegacion'];
    const estado = reinicio && !reinicio.firstChange ? null : this.estadoInicial();
    if (this.enDetalle() && this.datosContexto()) this.catalogosSesiones.usarContexto(this.datosContexto()!);
    else this.catalogosSesiones.invalidar();
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

  protected puedeEliminar(): boolean { return !this.soloLecturaSesion() && esEliminable(this.recurso()) && this.permitido('eliminar'); }

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
          if (this.actualizandoMarcas) { this.requiereActualizar.set(false); this.actualizandoMarcas = false; this.errorOperacion.set(null); }
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
      if (nombre === 'fecha' || nombre === 'fecha_inscripcion') {
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

  protected alGuardar(registro?: RegistroEmision): void {
    if (this.enDetalle() && this.recurso() === 'attendance' && registro) {
      this.cerrarFormulario(); this.incorporarMarca(registro); this.aviso.set('Cambios guardados.');
      this.asistenciasActualizadas.emit(this.catalogosSesiones.asistencias); this.registroGuardado.emit();
      if (this.recargarTrasGuardar()) this.actualizarAsistencia(true);
      return;
    }
    this.catalogoClasificacion.invalidar();
    this.catalogosSesiones.invalidar();
    this.cerrarFormulario(); this.detalle.set(null); this.aviso.set('Cambios guardados.'); this.cargar(1);
    this.registroGuardado.emit();
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
    this.asistenciaContexto.set(null);
    this.registrandoSesion.set(false);
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
