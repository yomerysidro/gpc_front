import { afterNextRender, Component, computed, DestroyRef, effect, ElementRef, inject, input, output, signal, untracked, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { EmisionCertificadosService } from '../../../core/services/emision-certificados/emision-certificados.service';
import { RegistroEmision } from '../../../core/interfaces/emision-certificados/emision-certificados.interface';
import { Observable, Subject, Subscription, shareReplay, switchMap } from 'rxjs';
import { Actividad, PersonaActividad } from '../../../core/interfaces/actividades/actividad.interface';
import { ActividadesService } from '../../../core/services/actividades/actividades.service';
import { PersonService } from '../../../core/services/person/person.service';
import { CatalogoParticipantes, DetalleActividadService, ParticipanteDetalle } from './detalle-actividad.service';
import { DialogoComponent } from '../../../shared/components/dialogo/dialogo.component';
import { FormularioEmisionComponent } from '../../emision-certificados/compartidos/formulario-emision.component';
import { EstadoNavegacionListado, ListadoEmisionComponent } from '../../emision-certificados/compartidos/listado-emision.component';
import { DatosAsistenciaContextual, FILTROS_SESIONES_VACIOS } from '../../emision-certificados/actividades/sesiones-asistencia-listado';
import { DialogoConfirmacionComponent } from '../../../shared/components/dialogo-confirmacion/dialogo-confirmacion.component';
import { ListarParticipantesComponent } from '../../participantes/listar-participantes/listar-participantes.component';
import { SesionCertificacion } from '../../../core/interfaces/emision-certificados/certificacion-sesion.interface';

@Component({
  selector: 'app-detalle-actividad', standalone: true,
  imports: [RouterLink, DialogoComponent, FormularioEmisionComponent, ListadoEmisionComponent, DialogoConfirmacionComponent, ListarParticipantesComponent],
  templateUrl: './detalle-actividad.component.html', styleUrl: './detalle-actividad.component.scss',
})
export class DetalleActividadComponent {
  protected readonly auth = inject(AuthService, { optional: true });
  readonly actividadId = input<number | null>(null);
  readonly revision = input(0);
  readonly solicitudRuta = input<string | null>(null);
  readonly operando = input(false);
  readonly volver = output<void>();
  readonly gestionarPonentes = output<Actividad>();
  readonly editarActividad = output<Actividad>();
  readonly cerrarActividad = output<Actividad>();
  protected readonly capacidadesSesiones = signal<ReadonlyMap<number, SesionCertificacion>>(new Map());
  protected readonly erroresCertificacion = signal<Readonly<Record<number, string>>>({});
  protected readonly cargandoCapacidades = signal<readonly number[]>([]);
  protected readonly finalizandoSesion = signal<number | null>(null);
  private readonly confirmarFinalizacion = viewChild.required<DialogoConfirmacionComponent>('confirmarFinalizacion');
  protected capacidadSesion(id: unknown): SesionCertificacion | undefined { return this.capacidadesSesiones().get(Number(id)); }
  protected cargarCapacidades(sesion: RegistroEmision, evento?: Event): void {
    if (evento && !(evento.target as HTMLDetailsElement).open) return;
    const id = Number(sesion['id_actividad_sesion']);
    if (!this.sesiones().includes(sesion) || this.cargandoCapacidades().includes(id)) return;
    this.capacidadesSesiones.update(m => { const nuevo = new Map(m); nuevo.delete(id); return nuevo; });
    this.cargandoCapacidades.update(ids => [...ids, id]);
    this.erroresCertificacion.update(e => ({ ...e, [id]: '' }));
    const actividad = this.actividadId();
    this.solicitudes.add(this.sesionesApi.estadoSesionCertificacion(id).subscribe({
      next: estado => {
        this.cargandoCapacidades.update(ids => ids.filter(i => i !== id));
        if (Number(estado.id_actividad) !== actividad || Number(estado.id_actividad_sesion) !== id) { this.erroresCertificacion.update(e => ({ ...e, [id]: 'Laravel no confirmó la sesión de esta actividad.' })); return; }
        this.capacidadesSesiones.update(actual => new Map(actual).set(id, estado));
        this.sesiones.update(filas => filas.map(f => Number(f['id_actividad_sesion']) === id ? { ...f, estado: estado.estado } : f));
      }, error: error => { this.cargandoCapacidades.update(ids => ids.filter(i => i !== id)); this.erroresCertificacion.update(e => ({ ...e, [id]: `HTTP ${error.status || 0}. ${error.mensaje}` })); },
    }));
  }
  protected puedeFinalizar(sesion: RegistroEmision): boolean {
    return this.sesiones().includes(sesion) && Number(sesion['id_actividad']) === this.actividadId()
      && this.capacidadSesion(sesion['id_actividad_sesion'])?.finalizada !== true
      && this.capacidadSesion(sesion['id_actividad_sesion'])?.puede_finalizarse === true
      && this.finalizandoSesion() === null && !this.panelOcupado();
  }
  protected readonly contadoresActividad = computed(() => [...this.capacidadesSesiones().values()].find(s => s.id_actividad === this.actividadId() && s.contadores)?.contadores);
  protected puedeCertificar(sesion: RegistroEmision): boolean {
    const estado = this.capacidadSesion(sesion['id_actividad_sesion']);
    return this.auth?.tienePermiso('emision.ver') === true && this.auth?.tienePermiso('emision.crear') === true && this.auth?.tienePermiso('participantes.ver') === true && estado?.estado === 'Finalizada' && estado.puede_certificarse === true;
  }
  protected async finalizarSesion(sesion: RegistroEmision): Promise<void> {
    if (!this.puedeFinalizar(sesion) || !await this.confirmarFinalizacion().abrir() || !this.puedeFinalizar(sesion)) return;
    const id = Number(sesion['id_actividad_sesion']); const actividad = this.actividadId()!;
    this.finalizandoSesion.set(id);
    this.solicitudes.add(this.sesionesApi.finalizarSesion(id, actividad).pipe(switchMap(resultado => {
      if (!resultado.finalizada || resultado.sesion.estado !== 'Finalizada' || Number(resultado.sesion.id_actividad_sesion) !== id || Number(resultado.sesion.id_actividad) !== actividad) throw new Error('No se pudo confirmar la finalización de la sesión.');
      // El POST ya confirmó el cierre, aunque falle la consulta posterior de capacidades.
      this.sesiones.update(filas => filas.map(f => Number(f['id_actividad_sesion']) === id ? { ...f, estado: resultado.sesion.estado } : f));
      this.detallesSesiones.delete(id);
      this.capacidadesSesiones.update(m => { const nuevo = new Map(m); nuevo.delete(id); return nuevo; });
      return this.sesionesApi.estadoSesionCertificacion(id);
    })).subscribe({ next: estado => {
      this.finalizandoSesion.set(null);
      if (estado.estado !== 'Finalizada' || Number(estado.id_actividad_sesion) !== id || Number(estado.id_actividad) !== actividad) { this.erroresCertificacion.update(e => ({ ...e, [id]: 'No se pudo confirmar el estado final de la sesión.' })); return; }
      this.capacidadesSesiones.update(m => new Map(m).set(id, estado));
      this.sesiones.update(filas => filas.map(f => Number(f['id_actividad_sesion']) === id ? { ...f, estado: estado.estado } : f));
      if (Number(this.sesionActiva()?.['id_actividad_sesion']) === id) this.sesionActiva.update(s => s ? { ...s, estado: estado.estado } : s);
      this.detallesSesiones.delete(id);
    }, error: error => { this.finalizandoSesion.set(null); this.erroresCertificacion.update(e => ({ ...e, [id]: [error.status ? `HTTP ${error.status}.` : '', error.mensaje || error.message, ...Object.values(error.errores ?? {}).flat()].join(' ') })); this.capacidadesSesiones.update(m => { const nuevo = new Map(m); nuevo.delete(id); return nuevo; }); } }));
  }
  protected asistenciaGuardada(): void {
    const sesion = this.sesionActiva();
    if (sesion && this.capacidadSesion(sesion['id_actividad_sesion'])) this.cargarCapacidades(sesion);
  }
  protected readonly sesionActiva = signal<RegistroEmision | null>(null);
  protected readonly asistenciaAbierta = signal(false);
  protected readonly contextoInscripcion = signal<{ actividad: { id_actividad: number; nombre: string }; sesion: { id: number; nombre: string } } | null>(null);
  protected readonly avisoInscripcion = signal<string | null>(null);
  private readonly modalAsistencia = viewChild.required<DialogoComponent>('modalAsistencia');
  private readonly modalDetalle = viewChild.required<DialogoComponent>('modalDetalle');
  private readonly confirmarDescartar = viewChild.required<DialogoConfirmacionComponent>('confirmarDescartar');
  private confirmandoCierre = false;
  protected readonly asistenciaIniciada = signal(false);
  private readonly sesionAsistencia = signal('');
  protected readonly estadoAsistencia = computed<EstadoNavegacionListado>(() => ({ campo: '', valor: '', pagina: 1,
    filtrosSesiones: { ...FILTROS_SESIONES_VACIOS, actividad: String(this.actividadId()), sesion: this.sesionAsistencia() } }));
  protected readonly datosAsistencia = computed<DatosAsistenciaContextual | null>(() => {
    const actividad = this.actividadContexto();
    if (!actividad || this.cargandoParticipantes() || this.errorParticipantes() || this.cargandoSesiones() || this.errorSesiones() || this.cargandoResumen() || this.errorResumen()) return null;
    return { actividad, sesiones: this.sesiones(), participantes: this.participantes(), asistencias: this.asistencias() };
  });
  protected readonly contextoAsistenciaConfirmado = signal<DatosAsistenciaContextual | null>(null);
  private readonly matrizAsistencia = viewChild(ListadoEmisionComponent);
  protected panelOcupado(): boolean { return this.matrizAsistencia()?.estaGuardando() ?? false; }
  protected abrirPanel(panel: 'detalle' | 'ponentes' | 'asistencia', sesion: RegistroEmision): void {
    if (this.panelOcupado() || !this.sesiones().includes(sesion)) return;
    if (panel === 'ponentes' && !this.auth?.tienePermiso('ponentes-firmantes.ver') || panel === 'asistencia' && !this.auth?.tienePermiso('participantes.ver')) return;
    this.sesionActiva.set(sesion);
    if (panel === 'detalle') { this.verSesion(sesion); this.modalDetalle().abrir(); }
    if (panel === 'ponentes') this.gestionarPonentes.emit(this.actividad()!);
    if (panel === 'asistencia') { this.sesionAsistencia.set(String(sesion['id_actividad_sesion'])); this.asistenciaIniciada.set(true); this.asistenciaAbierta.set(true); this.modalAsistencia().abrir(); }
  }
  protected async cerrarAsistencia(): Promise<void> {
    if (this.panelOcupado() || this.confirmandoCierre) return;
    if (this.matrizAsistencia()?.cambiosPendientes()) {
      this.confirmandoCierre = true;
      const descartar = await this.confirmarDescartar().abrir();
      this.confirmandoCierre = false;
      if (!descartar) return;
      this.matrizAsistencia()?.descartarCambios();
    }
    this.modalAsistencia().cerrar(); this.asistenciaAbierta.set(false);
  }
  protected guardarAsistencia(): void { this.matrizAsistencia()?.guardarAsistencia(); }
  protected puedeGuardarAsistencia(): boolean {
    return this.capacidadSesion(this.sesionActiva()?.['id_actividad_sesion'])?.puede_editar_asistencia !== false && this.sesionActiva()?.['estado'] !== 'Finalizada' && !this.cargandoParticipantes() && !this.errorParticipantes() && !this.cargandoResumen() && !this.errorResumen() && (this.matrizAsistencia()?.puedeGuardarAsistencia() ?? false);
  }
  protected abrirInscripcion(sesion: RegistroEmision): void {
    const actividad = this.actividadContexto();
    if (!actividad || !this.auth?.tienePermiso('participantes.crear') || !this.sesiones().includes(sesion) || Number(sesion['id_actividad']) !== actividad.id_actividad) return;
    this.avisoInscripcion.set(null);
    this.contextoInscripcion.set({ actividad, sesion: { id: Number(sesion['id_actividad_sesion']), nombre: String(sesion['nombre'] || 'Nombre no disponible') } });
  }
  protected inscripcionGuardada(): void {
    this.avisoInscripcion.set('Inscripción confirmada en la actividad. No se ha registrado asistencia.');
    this.cargarParticipantes();
  }
  protected readonly actividadContexto = computed(() => {
    const actividad = this.actividad();
    return actividad ? { id_actividad: actividad.id_actividad, nombre: actividad.nombre } : null;
  });
  protected readonly detalleSesion = signal<RegistroEmision | null>(null);
  protected readonly cargandoDetalleSesion = signal(false);
  protected readonly errorDetalleSesion = signal<string | null>(null);
  private readonly detallesSesiones = new Map<number, RegistroEmision>();
  private consultandoSesion: number | null = null;
  private consultaSesion?: Subscription;
  protected readonly formularioSesion = signal(false);
  protected readonly sesionEditando = signal<number | null>(null);
  private readonly modalSesion = viewChild.required<DialogoComponent>('modalSesion');
  private readonly elementoSesion = viewChild.required('modalSesion', { read: ElementRef<HTMLElement> });
  protected readonly editorSesion = viewChild<FormularioEmisionComponent>('editorSesion');
  protected verSesion(sesion: RegistroEmision): void {
    const actividadId = this.actividad()?.id_actividad;
    const id = Number(sesion['id_actividad_sesion']);
    if (!this.auth?.tienePermiso('actividades.ver') || !actividadId || !Number.isSafeInteger(id) || id < 1 || !this.sesiones().includes(sesion)) return;
    this.errorDetalleSesion.set(null);
    const previo = this.detallesSesiones.get(id);
    if (previo) { this.detalleSesion.set(previo); this.cargandoDetalleSesion.set(false); return; }
    if (this.consultandoSesion === id) { this.detalleSesion.set(null); this.cargandoDetalleSesion.set(true); return; }
    this.consultaSesion?.unsubscribe();
    this.consultandoSesion = id;
    this.detalleSesion.set(null); this.errorDetalleSesion.set(null); this.cargandoDetalleSesion.set(true);
    this.consultaSesion = this.sesionesApi.obtener('activity-session', id).subscribe({
      next: fila => {
        this.consultandoSesion = null;
        this.cargandoDetalleSesion.set(false);
        if (Number(fila['id_actividad']) !== actividadId || Number(fila['id_actividad_sesion']) !== id) {
          this.errorDetalleSesion.set('No se pudo verificar la sesión de esta actividad.'); return;
        }
        this.detalleSesion.set(fila);
        this.detallesSesiones.set(id, fila);
      },
      error: error => { this.consultandoSesion = null; this.cargandoDetalleSesion.set(false); this.errorDetalleSesion.set(this.mensaje(error, 'la sesión')); },
    });
    this.solicitudes.add(this.consultaSesion);
  }
  protected abrirSesion(): void {
    if (!this.actividad() || !this.auth?.tienePermiso('actividades.crear')) return;
    this.sesionEditando.set(null);
    this.formularioSesion.set(true); this.modalSesion().abrir();
  }
  protected editarSesion(): void {
    const sesion = this.detalleSesion();
    if (!sesion || !this.auth?.tienePermiso('actividades.editar') || this.panelOcupado()) return;
    this.sesionEditando.set(Number(sesion['id_actividad_sesion']));
    this.formularioSesion.set(true); this.modalSesion().abrir();
  }
  protected cerrarSesion(evento?: Event): void {
    evento?.preventDefault();
    if (this.editorSesion()?.enviando()) return;
    this.modalSesion().cerrar(); this.formularioSesion.set(false);
  }
  protected sesionGuardada(): void {
    const id = this.sesionEditando();
    if (id) this.detallesSesiones.delete(id);
    this.cerrarSesion(); this.cargarSesiones();
    if (id && this.sesionActiva()) this.verSesion(this.sesionActiva()!);
  }
  private readonly sesionesApi = inject(EmisionCertificadosService);
  protected readonly sesiones = signal<readonly RegistroEmision[]>([]);
  protected readonly errorSesiones = signal<string | null>(null);
  protected readonly cargandoSesiones = signal(false);
  protected readonly asistencias = signal<readonly RegistroEmision[]>([]);
  protected readonly errorResumen = signal<string | null>(null);
  protected readonly cargandoResumen = signal(false);
  private readonly listo = signal(false);
  private readonly actividades = inject(ActividadesService);
  private readonly relaciones = inject(DetalleActividadService);
  private readonly personas = inject(PersonService);
  private readonly destroyRef = inject(DestroyRef);
  private solicitudes = new Subscription();
  protected readonly actividad = signal<Actividad | null>(null);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly sinSeleccion = signal(false);
  protected readonly area = signal('No disponible');
  protected readonly tipo = signal('No disponible');
  protected readonly cargandoArea = signal(false);
  protected readonly cargandoTipo = signal(false);
  protected readonly avisoCatalogos = signal(false);
  protected readonly participantes = signal<readonly ParticipanteDetalle[]>([]);
  protected readonly cargandoParticipantes = signal(true);
  protected readonly errorParticipantes = signal<string | null>(null);
  protected readonly avisosParticipantes = signal<readonly { recurso: CatalogoParticipantes; mensaje: string }[]>([]);
  protected readonly reintentando = signal<readonly CatalogoParticipantes[]>([]);
  private readonly reintentosParticipantes = new Subject<CatalogoParticipantes>();
  private fuentePersonas?: Observable<readonly PersonaActividad[]>;
  private consultaParticipantes?: Subscription;
  constructor() {
    effect(() => {
      const datos = this.datosAsistencia();
      if (datos) this.contextoAsistenciaConfirmado.set(datos);
    }, { allowSignalWrites: true });
    this.destroyRef.onDestroy(() => this.solicitudes.unsubscribe());
    afterNextRender(() => {
      this.listo.set(true);
      const dialogo = this.elementoSesion().nativeElement.querySelector('dialog')!;
      const cancelar = (evento: Event) => this.cerrarSesion(evento);
      dialogo.addEventListener('cancel', cancelar);
      this.destroyRef.onDestroy(() => dialogo.removeEventListener('cancel', cancelar));
    });
    effect(() => {
      this.actividadId();
      if (this.listo()) untracked(() => this.cargar());
    }, { allowSignalWrites: true });
    effect(() => {
      const revision = this.revision();
      if (this.listo() && revision > 0) untracked(() => {
        const id = this.actividad()?.id_actividad;
        if (!id) return;
        this.solicitudes.add(this.actividades.obtener(id).subscribe({
          next: actividad => { if (actividad.id_actividad === id) { this.actividad.set(actividad); this.cargarCatalogos(actividad); } },
          error: error => this.error.set(this.mensaje(error, 'la información actualizada de la actividad')),
        }));
      });
    }, { allowSignalWrites: true });
  }

  protected cargar(): void {
    if (this.formularioSesion()) this.modalSesion().cerrar();
    this.solicitudes.unsubscribe();
    this.solicitudes = new Subscription();
    this.actividad.set(null); this.error.set(null); this.cargando.set(true); this.sinSeleccion.set(false);
    this.participantes.set([]); this.formularioSesion.set(false);
    this.detalleSesion.set(null); this.errorDetalleSesion.set(null); this.cargandoDetalleSesion.set(false);
    this.detallesSesiones.clear(); this.consultandoSesion = null;
    this.modalAsistencia().cerrar(); this.modalDetalle().cerrar(); this.asistenciaAbierta.set(false);
    this.contextoInscripcion.set(null); this.avisoInscripcion.set(null);
    this.sesionActiva.set(null); this.asistenciaIniciada.set(false); this.sesionAsistencia.set('');
    this.contextoAsistenciaConfirmado.set(null);
    this.capacidadesSesiones.set(new Map()); this.erroresCertificacion.set({}); this.cargandoCapacidades.set([]); this.finalizandoSesion.set(null);
    this.sesiones.set([]); this.errorSesiones.set(null); this.cargandoSesiones.set(false);
    this.asistencias.set([]); this.errorResumen.set(null);
    this.cargandoResumen.set(false);
    this.errorParticipantes.set(null);
    this.avisosParticipantes.set([]); this.reintentando.set([]);
    this.cargandoParticipantes.set(true);
    this.area.set('No disponible'); this.tipo.set('No disponible'); this.avisoCatalogos.set(false);
    const seleccion = this.actividadId();
    if (seleccion === null) {
      this.sinSeleccion.set(true); this.cargando.set(false);
      this.cargandoParticipantes.set(false); return;
    }
    const id = Number(seleccion);
    if (!Number.isSafeInteger(id) || id < 1) {
      this.error.set('La actividad solicitada no es válida.'); this.cargando.set(false); return;
    }
    this.solicitudes.add(this.actividades.obtener(id).subscribe({
      next: actividad => {
        if (actividad.id_actividad !== id) {
          this.error.set('No se pudo verificar la actividad solicitada.'); this.cargando.set(false); return;
        }
        this.actividad.set(actividad); this.cargando.set(false);
        if (this.auth?.tienePermiso('actividades.ver')) this.cargarSesiones();
        if (this.auth?.tienePermiso('participantes.ver')) this.cargarResumen();
        this.cargarCatalogos(actividad);
        const personas = this.personas.listar().pipe(shareReplay({ bufferSize: 1, refCount: true }));
        this.fuentePersonas = personas;
        this.cargarParticipantes();
      },
      error: error => { this.error.set(this.mensaje(error, 'la actividad')); this.cargando.set(false); },
    }));
  }

  protected cargarResumen(): void {
    this.cargandoResumen.set(true); this.errorResumen.set(null);
    this.solicitudes.add(this.sesionesApi.listarTodos('attendance').subscribe({
      next: filas => { this.asistencias.set(filas); this.cargandoResumen.set(false); },
      error: error => { this.errorResumen.set(this.mensaje(error, 'el resumen de asistencia')); this.cargandoResumen.set(false); },
    }));
  }

  protected cargarSesiones(): void {
    const id = this.actividad()?.id_actividad; if (!id || this.cargandoSesiones()) return;
    this.cargandoSesiones.set(true); this.errorSesiones.set(null);
    this.solicitudes.add(this.sesionesApi.listarTodos('activity-session').subscribe({
      next: filas => {
        const sesiones = filas.filter(fila => Number(fila['id_actividad']) === id);
        this.sesiones.set(sesiones);
        this.capacidadesSesiones.update(actual => {
          const mapa = new Map(actual);
          for (const sesion of sesiones) if (typeof sesion['puede_finalizarse'] === 'boolean') mapa.set(Number(sesion['id_actividad_sesion']), sesion as unknown as SesionCertificacion);
          return mapa;
        });
        const seleccionada = this.sesionActiva();
        if (seleccionada) {
          const actual = sesiones.find(s => Number(s['id_actividad_sesion']) === Number(seleccionada['id_actividad_sesion']));
          this.sesionActiva.set(actual ?? null);
          if (!actual) { this.modalAsistencia().cerrar(); this.modalDetalle().cerrar(); this.asistenciaIniciada.set(false); }
        }
        this.cargandoSesiones.set(false);
      },
      error: error => { this.errorSesiones.set(this.mensaje(error, 'las sesiones')); this.cargandoSesiones.set(false); },
    }));
  }

  protected reintentarCatalogo(recurso: CatalogoParticipantes): void {
    if (this.reintentando().includes(recurso)) return;
    this.reintentando.update(valores => [...valores, recurso]);
    this.reintentosParticipantes.next(recurso);
  }

  protected cargarParticipantes(): void {
    const id = this.actividad()?.id_actividad;
    if (!id || !this.fuentePersonas) return;
    this.consultaParticipantes?.unsubscribe(); this.errorParticipantes.set(null); this.cargandoParticipantes.set(true);
    this.consultaParticipantes = this.relaciones.consultarParticipantes(id, this.fuentePersonas, (recurso, error) => {
      this.reintentando.update(valores => valores.filter(valor => valor !== recurso));
      this.avisosParticipantes.update(avisos => {
        const anteriores = avisos.filter(aviso => aviso.recurso !== recurso);
        if (!error) return anteriores;
        const ruta = { personas: '/persons/list', tiposParticipacion: '/participation-type' }[recurso];
        const respuesta = error as { status?: number; mensaje?: string; error?: { message?: string } };
        return [...anteriores, { recurso, mensaje: `No se pudo consultar ${ruta}${respuesta.status ? ` (HTTP ${respuesta.status})` : ''}. ${respuesta.mensaje || respuesta.error?.message || 'Información auxiliar no disponible.'}` }];
      });
    }, this.reintentosParticipantes).subscribe({
      next: filas => { this.participantes.set(filas); this.cargandoParticipantes.set(false); },
      error: error => { this.errorParticipantes.set(this.mensaje(error, 'los participantes (/participation)')); this.cargandoParticipantes.set(false); },
    });
    this.solicitudes.add(this.consultaParticipantes);
  }


  private cargarCatalogos(actividad: Actividad): void {
    this.cargandoArea.set(!actividad.area_nombre); this.cargandoTipo.set(!actividad.tipo_actividad_nombre);
    if (actividad.area_nombre) this.area.set(actividad.area_nombre);
    else this.solicitudes.add(this.actividades.listarAreas().subscribe({
      next: filas => { this.area.set(filas.find(fila => fila.id_area === actividad.id_area)?.nombre || 'No disponible'); this.cargandoArea.set(false); },
      error: () => { this.avisoCatalogos.set(true); this.cargandoArea.set(false); },
    }));
    if (actividad.tipo_actividad_nombre) this.tipo.set(actividad.tipo_actividad_nombre);
    else this.solicitudes.add(this.actividades.listarTipos().subscribe({
      next: filas => { this.tipo.set(filas.find(fila => fila.id_tipo_actividad === actividad.id_tipo_actividad)?.nombre || 'No disponible'); this.cargandoTipo.set(false); },
      error: () => { this.avisoCatalogos.set(true); this.cargandoTipo.set(false); },
    }));
  }

  protected fecha(valor: string | null): string {
    if (!valor) return 'No disponible';
    const partes = valor.slice(0, 10).split('-');
    return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : 'No disponible';
  }

  private mensaje(error: unknown, recurso: string): string {
    const status = (error as { status?: number } | null)?.status;
    if (status === 403) return `Laravel denegó la consulta de ${recurso} (HTTP 403).`;
    if (status === 0) return `No se pudo conectar para consultar ${recurso}. Comprueba la conexión e intenta nuevamente.`;
    if (status === 404) return 'La actividad solicitada no está disponible.';
    return `No se pudo cargar ${recurso}. Intenta nuevamente.`;
  }
}
