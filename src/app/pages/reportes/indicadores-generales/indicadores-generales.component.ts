import { afterNextRender, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, forkJoin, map, of } from 'rxjs';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { IndicadorRegistrado, ReportesService } from '../../../core/services/reportes/reportes.service';
import { descargarCsv, mensajeReporte } from '../reportes.utils';

type TarjetaIndicador = {
  clave: IndicadorRegistrado; nombre: string; permiso: string; icono: string;
  regla: string; valor: number | null; error: string;
  estado: 'pendiente' | 'cargando' | 'exito' | 'error' | 'sin-permiso';
};

@Component({
  selector: 'app-indicadores-generales', standalone: true,
  templateUrl: './indicadores-generales.component.html', styleUrl: './indicadores-generales.component.scss',
})
export class IndicadoresGeneralesComponent {
  private readonly servicio = inject(ReportesService);
  private readonly destroyRef = inject(DestroyRef);
  readonly auth = inject(AuthService);
  readonly cargando = signal(false);
  readonly consultado = signal(false);
  private readonly definiciones = [
    { clave: 'actividades', nombre: 'Actividades registradas', permiso: 'actividades.ver', icono: 'event', regla: 'Total de registros de certificado.actividad, todos los estados y fechas; cada actividad cuenta una vez.' },
    { clave: 'certificados', nombre: 'Certificados registrados', permiso: 'emision.ver', icono: 'workspace_premium', regla: 'Total de registros de certificado.certificado, todos los estados y fechas. No exige documento generado, firma ni entrega y no cuenta documentos de reemisión.' },
    { clave: 'participaciones', nombre: 'Participaciones registradas', permiso: 'participantes.ver', icono: 'group', regla: 'Total de registros de certificado.participacion, todos los estados y fechas. Una persona en dos actividades cuenta como dos participaciones; no son personas únicas.' },
    { clave: 'asistencias', nombre: 'Asistencias registradas', permiso: 'participantes.ver', icono: 'how_to_reg', regla: 'Total de registros de certificado.asistencia, todos los estados y fechas; cada registro cuenta una vez, sin inferir ausencias ni calcular porcentajes.' },
  ] as const;
  readonly indicadores = signal<readonly TarjetaIndicador[]>(this.tarjetasIniciales());

  constructor() { afterNextRender(() => this.consultar()); }

  private tarjetasIniciales(): readonly TarjetaIndicador[] {
    return this.definiciones.map(item => ({ ...item, valor: null, error: '', estado: 'pendiente' }));
  }

  consultar(): void {
    if (this.cargando()) return;
    this.consultado.set(true);
    const tarjetas: readonly TarjetaIndicador[] = this.tarjetasIniciales().map(item => ({
      ...item,
      estado: this.auth.tienePermiso('reportes.ver') && this.auth.tienePermiso(item.permiso) ? 'cargando' : 'sin-permiso',
    }));
    this.indicadores.set(tarjetas);
    this.cargando.set(tarjetas.some(item => item.estado === 'cargando'));
    forkJoin(tarjetas.map(item => item.estado !== 'cargando' ? of(item) : this.servicio.totalRegistrados(item.clave).pipe(
      map(valor => ({ ...item, valor, estado: 'exito' as const })),
      catchError(error => of({ ...item, valor: null, estado: 'error' as const, error: mensajeReporte(error) })),
    ))).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(resultado => {
      this.indicadores.set(resultado);
      this.cargando.set(false);
    });
  }

  limpiar(): void {
    if (!this.cargando()) { this.indicadores.set(this.tarjetasIniciales()); this.consultado.set(false); }
  }

  puedeExportar(): boolean { return !this.cargando() && this.indicadores().some(item => item.estado === 'exito'); }

  exportar(): void {
    if (!this.auth.tienePermiso('reportes.exportar') || !this.puedeExportar()) return;
    const filas = this.indicadores().filter(item => item.estado === 'exito');
    descargarCsv('indicadores-registros.csv', ['Indicador', 'Total', 'Criterio y alcance', 'Filtros'],
      filas.map(item => [item.nombre, item.valor, item.regla, 'Sin filtros; alcance autorizado del usuario']));
  }
}
