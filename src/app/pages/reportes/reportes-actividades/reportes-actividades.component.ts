import { afterNextRender, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { FiltrosReporteActividades, PaginaActividades, ReportesService } from '../../../core/services/reportes/reportes.service';
import { descargarArchivo, fechasValidas, mensajeReporte } from '../reportes.utils';

@Component({
  selector: 'app-reportes-actividades', standalone: true, imports: [FormsModule],
  templateUrl: './reportes-actividades.component.html', styleUrl: './reportes-actividades.component.scss',
})
export class ReportesActividadesComponent {
  readonly auth = inject(AuthService);
  private readonly reportes = inject(ReportesService);
  private readonly destroyRef = inject(DestroyRef);
  readonly pagina = signal<PaginaActividades | null>(null);
  readonly error = signal('');
  readonly cargando = signal(false);
  readonly exportando = signal(false);
  readonly errorExportacion = signal('');
  inicio = ''; fin = ''; busqueda = ''; estado = '';
  aplicado: FiltrosReporteActividades = { desde: '', hasta: '', estado: '', q: '' };

  constructor() { afterNextRender(() => this.consultar()); }

  consultar(): void {
    if (this.cargando() || this.exportando()) return;
    this.error.set('');
    if (!fechasValidas(this.inicio, this.fin)) {
      this.pagina.set(null); this.error.set('La fecha de inicio no puede ser posterior a la fecha de fin.'); return;
    }
    this.aplicado = { desde: this.inicio, hasta: this.fin, estado: this.estado.trim(), q: this.busqueda.trim() };
    this.cargar(1);
  }

  cargar(page: number): void {
    if (this.cargando() || this.exportando()) return;
    this.error.set(''); this.errorExportacion.set(''); this.pagina.set(null);
    if (!this.auth.tienePermiso('reportes.ver') || !this.auth.tienePermiso('actividades.ver')) {
      this.error.set('Necesitas los permisos reportes.ver y actividades.ver para consultar este reporte.'); return;
    }
    this.cargando.set(true);
    this.reportes.actividades(page, this.aplicado).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: pagina => { this.pagina.set(pagina); this.cargando.set(false); },
      error: error => {
        this.error.set((error as { status?: number })?.status === 422
          ? 'Revisa los filtros: fechas válidas, estado de hasta 20 caracteres y búsqueda de hasta 100 caracteres.' : mensajeReporte(error));
        this.cargando.set(false);
      },
    });
  }

  actualizar(): void { this.cargar(this.pagina()?.current_page ?? 1); }
  limpiar(): void {
    if (this.cargando() || this.exportando()) return;
    this.inicio = ''; this.fin = ''; this.busqueda = ''; this.estado = ''; this.consultar();
  }
  hayFiltros(): boolean { return Object.values(this.aplicado).some(valor => valor !== ''); }

  exportar(): void {
    const pagina = this.pagina();
    if (!this.auth.tienePermiso('reportes.exportar') || !pagina?.total || this.cargando() || this.exportando()) return;
    this.exportando.set(true); this.errorExportacion.set('');
    this.reportes.exportar('actividades', this.aplicado).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: archivo => { descargarArchivo('reporte-actividades.csv', archivo); this.exportando.set(false); },
      error: error => { this.errorExportacion.set(mensajeReporte(error)); this.exportando.set(false); },
    });
  }
}
