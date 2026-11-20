import { puedeConsultarReporte } from '../reportes.utils';
import { afterNextRender, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { catchError, forkJoin, map, of } from 'rxjs';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { IndicadorRegistrado, ReportesService, SerieMensual } from '../../../core/services/reportes/reportes.service';
import { descargarCsv, mensajeReporte } from '../reportes.utils';

type TarjetaIndicador = {
  clave: IndicadorRegistrado; nombre: string; permiso: string; icono: string;
  regla: string; valor: number | null; error: string;
  estado: 'pendiente' | 'cargando' | 'exito' | 'error' | 'sin-permiso';
};

@Component({
  selector: 'app-indicadores-generales', standalone: true, imports: [FormsModule],
  templateUrl: './indicadores-generales.component.html', styleUrl: './indicadores-generales.component.scss',
})
export class IndicadoresGeneralesComponent {
  private readonly servicio = inject(ReportesService);
  private readonly destroyRef = inject(DestroyRef);
  readonly auth = inject(AuthService);
  readonly cargando = signal(false);
  readonly consultado = signal(false);
  anio = new Date().getFullYear();
  readonly cargandoSeries = signal(false);
  readonly errorAnio = signal('');
  readonly series = signal<readonly { nombre: string; datos: SerieMensual | null; error: string }[]>([]);
  readonly meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
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
      estado: this.auth.tienePermiso('reportes.ver') && puedeConsultarReporte(this.auth, item.permiso) ? 'cargando' : 'sin-permiso',
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

  cargarSeries(): void {
    if (this.cargandoSeries()) return;
    this.errorAnio.set(''); this.series.set([]);
    if (!Number.isInteger(this.anio) || this.anio < 1900 || this.anio > 2100) { this.errorAnio.set('Ingresa un año entre 1900 y 2100.'); return; }
    const definiciones = [
      { clave: 'actividades' as const, permiso: 'actividades.ver', nombre: 'Actividades por fecha de inicio' },
      { clave: 'certificados' as const, permiso: 'emision.ver', nombre: 'Certificados por fecha de emisión registrada' },
    ].filter(item => this.auth.tienePermiso('reportes.ver') && puedeConsultarReporte(this.auth, item.permiso));
    if (!definiciones.length) { this.errorAnio.set('No tienes permisos para consultar las series de actividades o certificados.'); return; }
    this.cargandoSeries.set(true);
    forkJoin(definiciones.map(item => this.servicio.serie(item.clave, this.anio).pipe(
      map(datos => ({ nombre: item.nombre, datos, error: '' })),
      catchError(error => of({ nombre: item.nombre, datos: null, error: mensajeReporte(error) })),
    ))).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(series => { this.series.set(series); this.cargandoSeries.set(false); });
  }

  anchoBarra(serie: SerieMensual, total: number): number {
    const maximo = Math.max(...serie.meses.map(mes => mes.total));
    return maximo ? total / maximo * 100 : 0;
  }

  autorizadoExportar(): boolean { return puedeConsultarReporte(this.auth, 'reportes.exportar'); }

  puedeExportar(): boolean { return !this.cargando() && this.indicadores().some(item => item.estado === 'exito'); }

  exportar(): void {
    if (!this.autorizadoExportar() || !this.puedeExportar()) return;
    const filas = this.indicadores().filter(item => item.estado === 'exito');
    descargarCsv('indicadores-registros.csv', ['Indicador', 'Total', 'Criterio y alcance', 'Filtros'],
      filas.map(item => [item.nombre, item.valor, item.regla, 'Sin filtros; alcance autorizado del usuario']));
  }
}
