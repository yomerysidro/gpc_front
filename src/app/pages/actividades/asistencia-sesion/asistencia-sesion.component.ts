import { Component, computed, DestroyRef, HostListener, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize, forkJoin, map, of, startWith, Subject, switchMap } from 'rxjs';
import { ActividadesService } from '../../../core/services/actividades/actividades.service';
import { EmisionCertificadosService } from '../../../core/services/emision-certificados/emision-certificados.service';
import { PersonSpeakerService } from '../../../core/services/person-speaker/person-speaker.service';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { ParticipanteSesion, ParticipantesSesion, SesionCertificacion } from '../../../core/interfaces/emision-certificados/certificacion-sesion.interface';
import { RegistroEmision } from '../../../core/interfaces/emision-certificados/emision-certificados.interface';
import { EstadoAsistenciaPonente } from '../../../core/interfaces/emision-certificados/origenes-certificado.interface';
import { ListadoEmisionComponent, EstadoNavegacionListado } from '../../emision-certificados/compartidos/listado-emision.component';
import { DatosAsistenciaContextual, FILTROS_SESIONES_VACIOS } from '../../emision-certificados/actividades/sesiones-asistencia-listado';
import { DialogoConfirmacionComponent } from '../../../shared/components/dialogo-confirmacion/dialogo-confirmacion.component';
import { aErrorApi } from '../../../shared/utils/error-api';
import { ErrorApi } from '../../../core/interfaces/api/api-response.interface';

@Component({
  selector: 'app-asistencia-sesion', standalone: true,
  imports: [ListadoEmisionComponent, DialogoConfirmacionComponent],
  templateUrl: './asistencia-sesion.component.html', styleUrl: './asistencia-sesion.component.scss',
})
export class AsistenciaSesionComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(EmisionCertificadosService);
  private readonly actividades = inject(ActividadesService);
  private readonly personasPonentes = inject(PersonSpeakerService);
  private readonly auth = inject(AuthService);
  protected readonly listado = viewChild(ListadoEmisionComponent);
  private readonly confirmar = viewChild.required(DialogoConfirmacionComponent);
  protected readonly datos = signal<DatosAsistenciaContextual | null>(null);
  protected readonly sesion = signal<(SesionCertificacion & RegistroEmision) | null>(null);
  protected readonly estadoInicial = signal<EstadoNavegacionListado | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly aviso = signal<string | null>(null);
  protected readonly ponentes = signal<readonly {
    id: number; nombre: string; cargo: string | null; estado?: EstadoAsistenciaPonente | null;
  }[]>([]);
  protected readonly resumenPonentes = computed(() => {
    const filas = this.ponentes();
    if (filas.some(fila => fila.estado === undefined)) return null;
    const presentes = filas.filter(fila => fila.estado === 'PRESENTE').length;
    const ausentes = filas.filter(fila => fila.estado === 'AUSENTE').length;
    return { presentes, ausentes, pendientes: filas.length - presentes - ausentes };
  });
  protected readonly guardandoPonente = signal<number | null>(null);
  protected readonly avisoPonentes = signal<string | null>(null);
  protected readonly candidatos = signal<readonly ParticipanteSesion[] | null>(null);
  protected readonly candidato = signal<number | null>(null);
  protected readonly seleccionando = signal(false);
  protected readonly cargando = signal(true);
  private actividadId = 0;
  private sesionId = 0;
  private confirmando?: Promise<boolean>;
  private readonly reintentos = new Subject<void>();

  constructor() {
    this.route.paramMap.pipe(switchMap(parametros => {
      this.actividadId = Number(parametros.get('idActividad'));
      this.sesionId = Number(parametros.get('idSesion'));
      return this.reintentos.pipe(startWith(undefined), switchMap(() => this.consulta()));
    }), takeUntilDestroyed()).subscribe();
  }

  private consulta() {
    this.datos.set(null); this.sesion.set(null); this.error.set(null); this.aviso.set(null); this.cargando.set(true);
    this.ponentes.set([]); this.avisoPonentes.set(null); this.candidatos.set(null); this.candidato.set(null);
    if (![this.actividadId, this.sesionId].every(id => Number.isSafeInteger(id) && id > 0)) {
      this.error.set('La actividad o la sesión solicitada no es válida.'); this.cargando.set(false); return of(null);
    }
    if (!this.auth.tienePermiso('actividades.ver') || !this.auth.tienePermiso('participantes.ver')) {
      this.error.set('No tienes permiso para consultar esta asistencia.'); this.cargando.set(false); return of(null);
    }
    return forkJoin({ actividad: this.actividades.obtener(this.actividadId), sesion: this.api.estadoSesionCertificacion(this.sesionId) }).pipe(
      switchMap(({ actividad, sesion }) => {
        if (actividad.id_actividad !== this.actividadId || Number(sesion.id_actividad) !== this.actividadId || Number(sesion.id_actividad_sesion) !== this.sesionId) throw new Error('No se pudo verificar la sesión de esta actividad.');
        this.sesion.set(sesion as SesionCertificacion & RegistroEmision);
        this.estadoInicial.set({ campo: '', valor: '', pagina: 1, filtrosSesiones: { ...FILTROS_SESIONES_VACIOS, actividad: String(this.actividadId), sesion: String(this.sesionId) } });
        const incluirCandidatos = !this.soloLectura();
        return forkJoin({
          seleccion: this.api.participantesSesion(this.sesionId, incluirCandidatos),
          ponentes: this.consultarPonentes(),
        }).pipe(map(({ seleccion, ponentes }) => {
          const participantesSesion = this.verificarSeleccion(seleccion);
          const filas = participantesSesion.filter(p => p.seleccionado && p.id_asistencia != null);
          const participantes = [...new Map((incluirCandidatos ? participantesSesion : filas).map(p => [p.id_participacion, p])).values()];
          this.datos.set({
            actividad: { id_actividad: actividad.id_actividad, nombre: actividad.nombre },
            sesiones: [sesion as unknown as RegistroEmision],
            soloSeleccionados: !incluirCandidatos,
            incluirCandidatos,
            participantes: participantes.map(p => ({ id: p.id_participacion, nombres: p.nombre_completo || 'Nombre no disponible', apellidos: '', fechaInscripcion: p.fecha_inscripcion })),
            asistencias: filas.map(p => ({
              id_participacion: p.id_participacion, id_actividad_sesion: this.sesionId, id_asistencia: p.id_asistencia,
              estado: p.estado_asistencia, hora_entrada: p.hora_entrada, hora_salida: p.hora_salida,
            })),
          });
          this.ponentes.set(ponentes);
          this.cargando.set(false);
        }));
      }), catchError(error => { this.cargando.set(false); this.error.set(this.mensaje(error)); return of(null); }),
    );
  }

  private consultarPonentes() {
    if (!this.auth.tienePermiso('ponentes-firmantes.ver')) {
      this.avisoPonentes.set('No tienes permiso para consultar los ponentes.');
      return of([]);
    }
    return forkJoin({
      gestion: this.api.ponentesSesion(this.actividadId, this.sesionId),
      cargos: this.personasPonentes.listar().pipe(catchError(() => of([]))),
    }).pipe(map(({ gestion, cargos }) => {
      const catalogo = new Map(cargos.map(p => [p.id_persona_ponente, p.cargo]));
      const personas = new Map(gestion.ponentes_disponibles.map(p => [p.id_persona_ponente, p]));
      return gestion.vinculos.map(v => {
        const persona = v.nombres ? v : personas.get(v.id_persona_ponente);
        return {
          id: v.id_actividad_ponente,
          nombre: [persona?.nombres, persona?.apellido_paterno, persona?.apellido_materno].filter(Boolean).join(' ') || 'Nombre no disponible',
          cargo: catalogo.get(v.id_persona_ponente) ?? null,
          estado: v.estado_asistencia,
        };
      });
    }), catchError(error => { this.avisoPonentes.set(this.mensaje(error)); return of([]); }));
  }

  protected puedeMarcarPonentes(): boolean {
    return !this.soloLectura() && this.auth.tienePermiso('participantes.editar');
  }

  protected marcarPonente(id: number, estado: EstadoAsistenciaPonente): void {
    const ponente = this.ponentes().find(fila => fila.id === id);
    if (this.ocupado() || !this.puedeMarcarPonentes() || ponente?.estado === undefined || ponente.estado === estado) return;
    const sesion = this.sesionId;
    this.guardandoPonente.set(id);
    this.avisoPonentes.set(null);
    this.api.marcarAsistenciaPonente(this.actividadId, sesion, id, estado).pipe(
      takeUntilDestroyed(this.destroyRef), finalize(() => this.guardandoPonente.set(null)),
    ).subscribe({
      next: confirmado => {
        if (sesion === this.sesionId) this.ponentes.update(filas => filas.map(fila => fila.id === id ? { ...fila, estado: confirmado } : fila));
      },
      error: error => { if (sesion === this.sesionId) this.avisoPonentes.set(this.mensaje(error)); },
    });
  }

  private verificarSeleccion(respuesta: ParticipantesSesion): readonly ParticipanteSesion[] {
    if (Number(respuesta?.id_actividad) !== this.actividadId || Number(respuesta?.id_actividad_sesion) !== this.sesionId ||
        !Array.isArray(respuesta?.participantes)) {
      throw new Error('Laravel no confirmó los participantes de esta sesión.');
    }
    return respuesta.participantes;
  }

  protected puedeAgregar(): boolean {
    return !!this.datos() && !this.soloLectura() && this.auth.tienePermiso('participantes.crear') && !this.listado()?.hayCambiosSinGuardar();
  }

  protected consultarCandidatos(): void {
    if (!this.puedeAgregar() || this.ocupado()) return;
    this.seleccionando.set(true);
    this.aviso.set(null);
    this.candidatos.set(null);
    this.candidato.set(null);
    this.api.participantesSesion(this.sesionId, true).pipe(
      map(respuesta => this.verificarSeleccion(respuesta).filter(p => !p.seleccionado)),
      takeUntilDestroyed(this.destroyRef), finalize(() => this.seleccionando.set(false)),
    ).subscribe({ next: filas => this.candidatos.set(filas), error: e => this.aviso.set(this.mensaje(e)) });
  }

  protected agregarParticipante(): void {
    const id = this.candidato();
    if (!this.puedeAgregar() || this.ocupado() || !id || !this.candidatos()?.some(p => p.id_participacion === id)) return;
    this.seleccionando.set(true);
    this.aviso.set(null);
    this.api.seleccionarParticipantesSesion(this.sesionId, [id]).pipe(
      map(respuesta => this.verificarSeleccion(respuesta)),
      takeUntilDestroyed(this.destroyRef), finalize(() => this.seleccionando.set(false)),
    ).subscribe({ next: () => this.reintentos.next(), error: e => this.aviso.set(this.mensaje(e)) });
  }

  protected totalPendientes(contadores: NonNullable<SesionCertificacion['contadores']>): number | string {
    const { pendientes, participantes_sesion: conMarca } = contadores;
    if (pendientes == null || conMarca == null) return 'Sin dato';
    return pendientes + Math.max(0, (this.datos()?.participantes.length ?? conMarca) - conMarca);
  }

  protected soloLectura(): boolean { return !this.sesion() || this.sesion()!.estado === 'Finalizada' || this.sesion()!.finalizada === true || this.sesion()!.puede_editar_asistencia === false; }
  protected reintentar(): void { if (!this.ocupado()) this.reintentos.next(); }
  protected ocupado(): boolean { return this.cargando() || this.seleccionando() || this.guardandoPonente() !== null || (this.listado()?.estaGuardando() ?? false); }
  protected actualizar(): void {
    if (this.ocupado()) return;
    if (!this.listado()?.hayCambiosSinGuardar()) { this.reintentos.next(); return; }
    this.listado()?.refrescarAsistencia(); this.actualizarSesion();
  }
  protected actualizarSesion(): void {
    const actividad = this.actividadId; const sesion = this.sesionId;
    this.api.estadoSesionCertificacion(sesion).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: actual => {
        if (this.sesionId !== sesion || this.actividadId !== actividad) return;
        if (Number(actual.id_actividad) !== actividad || Number(actual.id_actividad_sesion) !== sesion) { this.sesion.set(null); this.error.set('No se pudo verificar la sesión de esta actividad.'); return; }
        this.sesion.update(anterior => ({ ...anterior, ...actual }) as SesionCertificacion & RegistroEmision);
      }, error: error => { if (this.sesionId === sesion) { this.sesion.set(null); this.error.set(this.mensaje(error)); } },
    });
  }
  protected volver(): void { if (!this.ocupado()) void this.router.navigate(['/certificaciones/actividades'], { queryParams: { id_actividad: this.actividadId } }); }
  async puedeSalir(): Promise<boolean> {
    if (this.seleccionando() || this.guardandoPonente() !== null || this.listado()?.estaGuardando()) return false;
    if (!this.listado()?.hayCambiosSinGuardar()) return true;
    this.confirmando ??= this.confirmar().abrir().then(descartar => { if (descartar) this.listado()?.descartarCambios(); return descartar; }).finally(() => this.confirmando = undefined);
    return this.confirmando;
  }
  @HostListener('window:beforeunload', ['$event']) antesDeSalir(evento: BeforeUnloadEvent): void {
    if (this.listado()?.hayCambiosSinGuardar() || this.listado()?.estaGuardando()) { evento.preventDefault(); evento.returnValue = ''; }
  }
  protected fecha(valor: unknown): string { const partes = String(valor || '').slice(0, 10).split('-'); return partes.length === 3 ? partes.reverse().join('/') : 'Fecha no disponible'; }
  private mensaje(error: unknown): string {
    const api = error && typeof error === 'object' && 'mensaje' in error ? error as ErrorApi : aErrorApi(error);
    return `${api.status ? 'HTTP ' + api.status + '. ' : ''}${error instanceof Error ? error.message : api.mensaje}`;
  }
  private readonly destroyRef = inject(DestroyRef);
}
