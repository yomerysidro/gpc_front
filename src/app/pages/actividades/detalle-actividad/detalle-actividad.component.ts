import { afterNextRender, Component, computed, DestroyRef, effect, ElementRef, inject, input, output, signal, untracked, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { EmisionCertificadosService } from '../../../core/services/emision-certificados/emision-certificados.service';
import { RegistroEmision } from '../../../core/interfaces/emision-certificados/emision-certificados.interface';
import { EMPTY, Observable, Subject, Subscription, finalize, shareReplay, switchMap, tap } from 'rxjs';
import { Actividad, PersonaActividad } from '../../../core/interfaces/actividades/actividad.interface';
import { ActividadesService } from '../../../core/services/actividades/actividades.service';
import { PersonService } from '../../../core/services/person/person.service';
import { CatalogoParticipantes, DetalleActividadService, ParticipanteDetalle } from './detalle-actividad.service';
import { DialogoComponent } from '../../../shared/components/dialogo/dialogo.component';
import { FormularioEmisionComponent } from '../../emision-certificados/compartidos/formulario-emision.component';
import { DialogoConfirmacionComponent } from '../../../shared/components/dialogo-confirmacion/dialogo-confirmacion.component';
import { ListarParticipantesComponent } from '../../participantes/listar-participantes/listar-participantes.component';
import { SesionCertificacion } from '../../../core/interfaces/emision-certificados/certificacion-sesion.interface';
import { PonentesSesionActividadComponent } from './ponentes-sesion-actividad.component';

@Component({
  selector: 'app-detalle-actividad', standalone: true,
  imports: [PonentesSesionActividadComponent, RouterLink, DialogoComponent, FormularioEmisionComponent, DialogoConfirmacionComponent, ListarParticipantesComponent],
  templateUrl: './detalle-actividad.component.html', styleUrl: './detalle-actividad.component.scss',
})
export class DetalleActividadComponent {
  protected readonly auth = inject(AuthService, { optional: true });
  readonly actividadId = input<number | null>(null);
  readonly revision = input(0);
  readonly solicitudRuta = input<string | null>(null);
  readonly operando = input(false);
  readonly volver = output<void>();
  readonly editarActividad = output<Actividad>();
  readonly cerrarActividad = output<Actividad>();
  protected readonly capacidadesSesiones = signal<ReadonlyMap<number, SesionCertificacion>>(new Map());
  protected readonly erroresCertificacion = signal<Readonly<Record<number, string>>>({});
  protected readonly finalizandoSesion = signal<number | null>(null);
  private readonly confirmarFinalizacion = viewChild.required<DialogoConfirmacionComponent>('confirmarFinalizacion');
  protected capacidadSesion(id: unknown): SesionCertificacion | undefined { return this.capacidadesSesiones().get(Number(id)); }
  protected sesionFinalizada(sesion: RegistroEmision): boolean {
    return sesion['estado'] === 'Finalizada' || sesion['finalizada'] === true
      || this.capacidadSesion(sesion['id_actividad_sesion'])?.finalizada === true;
  }
  protected readonly contadoresActividad = computed(() => [...this.capacidadesSesiones().values()].find(s => s.id_actividad === this.actividadId() && s.contadores)?.contadores);
  protected puedeCertificar(sesion: RegistroEmision): boolean {
    const estado = this.capacidadSesion(sesion['id_actividad_sesion']);
    return this.auth?.tienePermiso('emision.ver') === true && this.auth?.tienePermiso('emision.crear') === true && this.auth?.tienePermiso('participantes.ver') === true && estado?.estado === 'Finalizada' && estado.puede_certificarse === true;
  }
  protected finalizarSesion(sesion: RegistroEmision): void {
    const id = Number(sesion['id_actividad_sesion']);
    const actividad = this.actividadId();
    if (!actividad || Number(sesion['id_actividad']) !== actividad || !this.sesiones().includes(sesion)
      || this.sesionFinalizada(sesion) || this.finalizandoSesion() !== null || this.panelOcupado()) return;
    this.finalizandoSesion.set(id);
    this.erroresCertificacion.update(errores => ({ ...errores, [id]: '' }));
    const verificarContexto = (estado: { id_actividad: number; id_actividad_sesion: number }) => {
      if (Number(estado.id_actividad_sesion) !== id || Number(estado.id_actividad) !== actividad) {
        throw new Error('Laravel no confirmó la sesión de esta actividad.');
      }
    };
    this.solicitudes.add(this.sesionesApi.estadoSesionCertificacion(id).pipe(
      switchMap(async estado => {
        verificarContexto(estado);
        this.aplicarEstadoSesion(id, estado);
        if (estado.finalizada === true || estado.estado === 'Finalizada') return false;
        if (estado.puede_finalizarse !== true) {
          throw new Error(estado.motivos_bloqueo_finalizacion?.join(' ') || 'Laravel no autorizó la finalización de la sesión.');
        }
        return this.confirmarFinalizacion().abrir();
      }),
      switchMap(confirmada => confirmada && this.actividadId() === actividad ? this.sesionesApi.finalizarSesion(id, actividad) : EMPTY),
      switchMap(resultado => {
        verificarContexto(resultado.sesion);
        if (!resultado.finalizada || resultado.sesion.estado !== 'Finalizada') {
          throw new Error(resultado.motivos_bloqueo?.join(' ') || 'No se pudo confirmar la finalización de la sesión.');
        }
        this.aplicarEstadoSesion(id, {
          ...this.capacidadSesion(id), ...resultado.sesion, finalizada: true, puede_finalizarse: false,
          motivos_bloqueo_finalizacion: [], puede_certificarse: false, motivos_bloqueo_certificacion: [],
        });
        this.liberarFinalizacion(id);
        return this.sesionesApi.estadoSesionCertificacion(id);
      }),
      tap(estado => {
        verificarContexto(estado);
        if (estado.estado !== 'Finalizada' && estado.finalizada !== true) {
          throw new Error('No se pudo confirmar el estado final de la sesión.');
        }
        this.aplicarEstadoSesion(id, estado);
      }),
      finalize(() => this.liberarFinalizacion(id)),
    ).subscribe({
      error: error => this.erroresCertificacion.update(errores => ({
        ...errores, [id]: [error.mensaje || error.message, ...Object.values(error.errores ?? {}).flat()].filter(Boolean).join(' '),
      })),
    }));
  }
  private liberarFinalizacion(id: number): void {
    if (this.finalizandoSesion() === id) this.finalizandoSesion.set(null);
  }

  private aplicarEstadoSesion(id: number, estado: SesionCertificacion): void {
    const nombreEstado = estado.finalizada === true ? 'Finalizada' : estado.estado;
    this.capacidadesSesiones.update(mapa => new Map(mapa).set(id, estado));
    this.sesiones.update(filas => filas.map(fila => Number(fila['id_actividad_sesion']) === id ? { ...fila, estado: nombreEstado } : fila));
    this.sesionActiva.update(fila => fila && Number(fila['id_actividad_sesion']) === id ? { ...fila, estado: nombreEstado } : fila);
    this.detallesSesiones.delete(id);
  }
  private readonly router = inject(Router);
  protected readonly sesionActiva = signal<RegistroEmision | null>(null);
  protected readonly sesionPonentes = signal<RegistroEmision | null>(null);
  private readonly modalPonentesSesion = viewChild.required<DialogoComponent>('modalPonentesSesion');
  protected readonly contextoInscripcion = signal<{ actividad: { id_actividad: number; nombre: string }; sesion: { id: number; nombre: string } } | null>(null);
  protected readonly avisoInscripcion = signal<string | null>(null);
  private readonly modalDetalle = viewChild.required<DialogoComponent>('modalDetalle');
  protected panelOcupado(): boolean { return false; }
  protected abrirPanel(panel: 'detalle' | 'ponentes' | 'asistencia', sesion: RegistroEmision): void {
    if (this.panelOcupado() || !this.sesiones().includes(sesion)) return;
    if (panel === 'ponentes' && !this.auth?.tienePermiso('ponentes-firmantes.ver') || panel === 'asistencia' && !this.auth?.tienePermiso('participantes.ver')) return;
    this.sesionActiva.set(sesion);
    if (panel === 'detalle') { this.verSesion(sesion); this.modalDetalle().abrir(); }
    if (panel === 'ponentes') {
      // La asignación se realiza exclusivamente sobre la sesión real seleccionada.
      this.sesionPonentes.set(sesion);
      this.modalPonentesSesion().abrir();
    }
    if (panel === 'asistencia') void this.router.navigate(['/certificaciones/actividades', this.actividadId(), 'sesiones', sesion['id_actividad_sesion'], 'asistencia']);
  }
  protected cerrarPonentesSesion(): void { this.sesionPonentes.set(null); }
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
    this.modalDetalle().cerrar();
    this.modalPonentesSesion().cerrar(); this.sesionPonentes.set(null);
    this.contextoInscripcion.set(null); this.avisoInscripcion.set(null);
    this.sesionActiva.set(null);
    this.capacidadesSesiones.set(new Map()); this.erroresCertificacion.set({}); this.finalizandoSesion.set(null);
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
        const capacidades = new Map<number, SesionCertificacion>();
        for (const sesion of sesiones) if (typeof sesion['puede_finalizarse'] === 'boolean' || sesion['contadores']) capacidades.set(Number(sesion['id_actividad_sesion']), sesion as unknown as SesionCertificacion);
        this.capacidadesSesiones.set(capacidades);
        const seleccionada = this.sesionActiva();
        if (seleccionada) {
          const actual = sesiones.find(s => Number(s['id_actividad_sesion']) === Number(seleccionada['id_actividad_sesion']));
          this.sesionActiva.set(actual ?? null);
          if (!actual) { this.modalDetalle().cerrar(); }
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
