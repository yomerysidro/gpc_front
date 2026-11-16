import { Component, DestroyRef, HostListener, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, forkJoin, map, of, startWith, Subject, switchMap } from 'rxjs';
import { ActividadesService } from '../../../core/services/actividades/actividades.service';
import { EmisionCertificadosService } from '../../../core/services/emision-certificados/emision-certificados.service';
import { PersonService } from '../../../core/services/person/person.service';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { SesionCertificacion } from '../../../core/interfaces/emision-certificados/certificacion-sesion.interface';
import { RegistroEmision } from '../../../core/interfaces/emision-certificados/emision-certificados.interface';
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
  private readonly personas = inject(PersonService);
  private readonly auth = inject(AuthService);
  protected readonly listado = viewChild(ListadoEmisionComponent);
  private readonly confirmar = viewChild.required(DialogoConfirmacionComponent);
  protected readonly datos = signal<DatosAsistenciaContextual | null>(null);
  protected readonly sesion = signal<(SesionCertificacion & RegistroEmision) | null>(null);
  protected readonly estadoInicial = signal<EstadoNavegacionListado | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly aviso = signal<string | null>(null);
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
        return forkJoin({ participaciones: this.api.listarTodos('participation'), asistencias: this.api.listarTodos('attendance'), personas: this.personas.listar().pipe(catchError(() => { this.aviso.set('No se pudieron consultar los nombres de los participantes.'); return of([]); })) }).pipe(map(({ participaciones, asistencias, personas }) => {
          const nombres = new Map(personas.map(p => [p.id_persona, p]));
          this.datos.set({ actividad: { id_actividad: actividad.id_actividad, nombre: actividad.nombre }, sesiones: [sesion as unknown as RegistroEmision], asistencias,
            participantes: participaciones.filter(p => Number(p['id_actividad']) === this.actividadId).map(p => {
              const persona = nombres.get(Number(p['id_persona']));
              return { id: Number(p['id_participacion']), nombres: persona?.nombres || 'Nombre no disponible', apellidos: [persona?.apellido_paterno, persona?.apellido_materno].filter(Boolean).join(' ') };
            }) }); this.cargando.set(false);
        }));
      }), catchError(error => { this.cargando.set(false); this.error.set(this.mensaje(error)); return of(null); }),
    );
  }

  protected soloLectura(): boolean { return !this.sesion() || this.sesion()!.estado === 'Finalizada' || this.sesion()!.finalizada === true || this.sesion()!.puede_editar_asistencia === false; }
  protected reintentar(): void { if (!this.ocupado()) this.reintentos.next(); }
  protected ocupado(): boolean { return this.cargando() || (this.listado()?.estaGuardando() ?? false); }
  protected guardar(): void { if (!this.soloLectura()) this.listado()?.guardarAsistencia(); }
  protected actualizar(): void {
    if (this.ocupado()) return;
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
    if (this.listado()?.estaGuardando()) return false;
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
