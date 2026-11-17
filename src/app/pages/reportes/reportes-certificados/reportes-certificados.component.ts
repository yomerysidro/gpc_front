import { afterNextRender, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { PaginaEmision, TipoCertificado } from '../../../core/interfaces/emision-certificados/emision-certificados.interface';
import { CertificadoReporte, FiltrosCertificados, PaginaReporte, ReportesService } from '../../../core/services/reportes/reportes.service';
import { descargarArchivo, estadoCertificado, fechasValidas, mensajeReporte } from '../reportes.utils';

@Component({
  selector: 'app-reportes-certificados', standalone: true, imports: [FormsModule],
  templateUrl: './reportes-certificados.component.html', styleUrl: './reportes-certificados.component.scss',
})
export class ReportesCertificadosComponent {
  readonly auth = inject(AuthService);
  private readonly servicio = inject(ReportesService);
  private readonly destroyRef = inject(DestroyRef);
  readonly pagina = signal<PaginaReporte<CertificadoReporte> | null>(null);
  readonly catalogo = signal<PaginaEmision<TipoCertificado> | null>(null);
  readonly cargando = signal(false);
  readonly cargandoTipos = signal(false);
  readonly error = signal('');
  readonly errorTipos = signal('');
  readonly consultado = signal(false);
  readonly exportando = signal(false);
  readonly errorExportacion = signal('');
  inicio = ''; fin = ''; estado = ''; tipo = ''; busqueda = '';
  private tipoElegido: TipoCertificado | null = null;
  estadoDocumento = '';
  aplicado: FiltrosCertificados = { desde: '', hasta: '', estado: '', id_tipo_certificado: '', q: '', estado_documento: '' };
  readonly estadoTexto = estadoCertificado;

  constructor() { afterNextRender(() => { this.cargarTipos(); this.consultar(); }); }

  cargarTipos(page = 1): void {
    if (!this.auth.tienePermiso('reportes.ver') || !this.auth.tienePermiso('emision.ver') || this.cargandoTipos()) return;
    this.cargandoTipos.set(true); this.errorTipos.set('');
    this.servicio.tipos(page).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: pagina => { this.catalogo.set(pagina); this.cargandoTipos.set(false); },
      error: error => { this.errorTipos.set(mensajeReporte(error)); this.cargandoTipos.set(false); },
    });
  }

  consultar(): void {
    if (this.cargando() || this.exportando()) return;
    this.error.set('');
    if (!fechasValidas(this.inicio, this.fin)) { this.pagina.set(null); this.error.set('La fecha de inicio no puede ser posterior a la fecha de fin.'); return; }
    this.aplicado = { desde: this.inicio, hasta: this.fin, estado: this.estado.trim(), id_tipo_certificado: this.tipo, q: this.busqueda.trim(), estado_documento: this.estadoDocumento.trim() };
    this.cargar(1);
  }

  cargar(page: number): void {
    if (this.cargando() || this.exportando()) return;
    this.error.set(''); this.errorExportacion.set(''); this.pagina.set(null); this.consultado.set(true);
    if (!this.auth.tienePermiso('reportes.ver') || !this.auth.tienePermiso('emision.ver')) { this.error.set('Necesitas los permisos reportes.ver y emision.ver para consultar los certificados.'); return; }
    this.cargando.set(true);
    this.servicio.certificadosReporte(page, this.aplicado).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: pagina => { this.pagina.set(pagina); this.cargando.set(false); },
      error: error => { this.error.set(mensajeReporte(error)); this.cargando.set(false); },
    });
  }

  actualizar(): void { this.cargar(this.pagina()?.current_page ?? 1); }
  limpiar(): void {
    if (this.cargando() || this.exportando()) return;
    this.inicio = ''; this.fin = ''; this.estado = ''; this.estadoDocumento = ''; this.tipo = ''; this.tipoElegido = null; this.busqueda = ''; this.consultar();
  }

  filas(): readonly CertificadoReporte[] { return this.pagina()?.data ?? []; }

  tiposDisponibles(): readonly TipoCertificado[] {
    const tipos = this.catalogo()?.data ?? [];
    return this.tipoElegido && !tipos.some(tipo => tipo.id_tipo_certificado === this.tipoElegido?.id_tipo_certificado)
      ? [this.tipoElegido, ...tipos] : tipos;
  }
  seleccionarTipo(valor: string): void {
    this.tipoElegido = this.tiposDisponibles().find(tipo => String(tipo.id_tipo_certificado) === String(valor)) ?? null;
  }
  nombreTipo(id: number): string { return this.tiposDisponibles().find(tipo => tipo.id_tipo_certificado === id)?.nombre_tipo ?? 'Nombre no incluido en esta página de tipos'; }
  conFecha(): number { return this.pagina()?.resumen['con_fecha_emision'] ?? 0; }
  exportar(): void {
    if (!this.auth.tienePermiso('reportes.exportar') || this.cargando() || this.exportando() || !this.pagina()?.total) return;
    this.exportando.set(true); this.errorExportacion.set('');
    this.servicio.exportar('certificados', this.aplicado).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: archivo => { descargarArchivo('reporte-certificados.csv', archivo); this.exportando.set(false); },
      error: error => { this.errorExportacion.set(mensajeReporte(error)); this.exportando.set(false); },
    });
  }
}
