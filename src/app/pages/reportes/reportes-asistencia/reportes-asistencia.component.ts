import { puedeConsultarReporte } from '../reportes.utils';
import { afterNextRender, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { PaginaEmision } from '../../../core/interfaces/emision-certificados/emision-certificados.interface';
import { ActividadReporte, AsistenciaReporte, FiltrosAsistencia, PaginaActividades, PaginaReporte, ReportesService, SesionReporte } from '../../../core/services/reportes/reportes.service';
import { descargarArchivo, fechasValidas, mensajeReporte } from '../reportes.utils';

@Component({
  selector: 'app-reportes-asistencia', standalone: true, imports: [FormsModule],
  templateUrl: './reportes-asistencia.component.html', styleUrl: './reportes-asistencia.component.scss',
})
export class ReportesAsistenciaComponent {
  readonly auth = inject(AuthService);
  private readonly servicio = inject(ReportesService);
  private readonly destroy = inject(DestroyRef);
  readonly pagina = signal<PaginaReporte<AsistenciaReporte> | null>(null);
  readonly actividades = signal<PaginaActividades | null>(null);
  readonly sesiones = signal<PaginaEmision<SesionReporte> | null>(null);
  readonly cargando = signal(false);
  readonly cargandoActividades = signal(false);
  readonly cargandoSesiones = signal(false);
  readonly exportando = signal(false);
  readonly error = signal('');
  readonly errorCatalogo = signal('');
  readonly errorSesiones = signal('');
  readonly errorExportacion = signal('');
  inicio = ''; fin = ''; actividad = ''; sesion = ''; estado = ''; busqueda = ''; buscarActividad = '';
  private actividadElegida: ActividadReporte | null = null;
  private sesionElegida: SesionReporte | null = null;
  private busquedaActividadesAplicada = '';
  aplicado: FiltrosAsistencia = { desde: '', hasta: '', estado: '', q: '', id_actividad: '', id_actividad_sesion: '' };

  constructor() { afterNextRender(() => { this.cargarActividades(); this.consultar(); }); }

  puedeFiltrarActividades(): boolean { return puedeConsultarReporte(this.auth, 'actividades.ver'); }

  cargarActividades(page = 1, nuevaBusqueda = false): void {
    if (this.cargandoActividades() || !this.auth.tienePermiso('reportes.ver') || !puedeConsultarReporte(this.auth, 'actividades.ver') || !puedeConsultarReporte(this.auth, 'participantes.ver')) return;
    if (nuevaBusqueda) this.busquedaActividadesAplicada = this.buscarActividad.trim();
    this.cargandoActividades.set(true); this.errorCatalogo.set('');
    this.servicio.actividades(page, { desde: '', hasta: '', estado: '', q: this.busquedaActividadesAplicada }).pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: pagina => { this.actividades.set(pagina); this.cargandoActividades.set(false); },
      error: error => { this.errorCatalogo.set(mensajeReporte(error)); this.cargandoActividades.set(false); },
    });
  }

  opcionesActividades(): readonly ActividadReporte[] {
    const opciones = this.actividades()?.data ?? [];
    return this.actividadElegida && !opciones.some(item => item.id_actividad === this.actividadElegida?.id_actividad) ? [this.actividadElegida, ...opciones] : opciones;
  }

  seleccionarActividad(): void {
    this.actividadElegida = this.opcionesActividades().find(item => String(item.id_actividad) === this.actividad) ?? null;
    this.sesion = ''; this.sesionElegida = null; this.sesiones.set(null); this.errorSesiones.set('');
    if (this.actividad) this.cargarSesiones();
  }

  cargarSesiones(page = 1): void {
    if (!this.actividad || this.cargandoSesiones()) return;
    this.cargandoSesiones.set(true); this.errorSesiones.set('');
    this.servicio.sesiones(this.actividad, page).pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: pagina => { this.sesiones.set(pagina); this.cargandoSesiones.set(false); },
      error: error => { this.errorSesiones.set(mensajeReporte(error)); this.cargandoSesiones.set(false); },
    });
  }

  opcionesSesiones(): readonly SesionReporte[] {
    const opciones = this.sesiones()?.data ?? [];
    return this.sesionElegida && !opciones.some(item => item.id_actividad_sesion === this.sesionElegida?.id_actividad_sesion) ? [this.sesionElegida, ...opciones] : opciones;
  }

  seleccionarSesion(): void { this.sesionElegida = this.opcionesSesiones().find(item => String(item.id_actividad_sesion) === this.sesion) ?? null; }

  consultar(): void {
    if (this.cargando() || this.exportando()) return;
    this.error.set('');
    if (!fechasValidas(this.inicio, this.fin)) { this.pagina.set(null); this.error.set('La fecha de inicio no puede ser posterior a la fecha de fin.'); return; }
    this.aplicado = { desde: this.inicio, hasta: this.fin, estado: this.estado, q: this.busqueda.trim(), id_actividad: this.actividad, id_actividad_sesion: this.sesion };
    this.cargar(1);
  }

  cargar(page: number): void {
    if (this.cargando() || this.exportando()) return;
    this.error.set(''); this.errorExportacion.set(''); this.pagina.set(null);
    if (!this.auth.tienePermiso('reportes.ver') || !puedeConsultarReporte(this.auth, 'participantes.ver')) { this.error.set('Necesitas los permisos reportes.ver y participantes.ver para consultar las asistencias.'); return; }
    this.cargando.set(true);
    this.servicio.asistencias(page, this.aplicado).pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: pagina => { this.pagina.set(pagina); this.cargando.set(false); },
      error: error => { this.error.set(mensajeReporte(error)); this.cargando.set(false); },
    });
  }

  actualizar(): void { this.cargar(this.pagina()?.current_page ?? 1); }

  limpiar(): void {
    if (this.cargando() || this.exportando() || this.cargandoSesiones()) return;
    this.inicio = ''; this.fin = ''; this.estado = ''; this.busqueda = ''; this.actividad = ''; this.sesion = '';
    this.actividadElegida = null; this.sesionElegida = null; this.sesiones.set(null); this.errorSesiones.set('');
    this.buscarActividad = ''; this.busquedaActividadesAplicada = ''; this.cargarActividades(); this.consultar();
  }

  puedeExportar(): boolean { return puedeConsultarReporte(this.auth, 'reportes.exportar'); }

  exportar(): void {
    if (!puedeConsultarReporte(this.auth, 'reportes.exportar') || this.cargando() || this.exportando() || !this.pagina()?.total) return;
    this.exportando.set(true); this.errorExportacion.set('');
    this.servicio.exportar('asistencia', this.aplicado).pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: archivo => { descargarArchivo('reporte-asistencia.csv', archivo); this.exportando.set(false); },
      error: error => { this.errorExportacion.set(mensajeReporte(error)); this.exportando.set(false); },
    });
  }
}
