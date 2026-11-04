import { afterNextRender, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { CertificadoRow, PaginaEmision, TipoCertificado } from '../../../core/interfaces/emision-certificados/emision-certificados.interface';
import { ReportesService } from '../../../core/services/reportes/reportes.service';
import { descargarCsv, estadoCertificado, fechasValidas, mensajeReporte } from '../reportes.utils';

@Component({
  selector: 'app-reportes-certificados', standalone: true, imports: [FormsModule],
  templateUrl: './reportes-certificados.component.html', styleUrl: './reportes-certificados.component.scss',
})
export class ReportesCertificadosComponent {
  readonly auth = inject(AuthService);
  private readonly servicio = inject(ReportesService);
  private readonly destroyRef = inject(DestroyRef);
  readonly pagina = signal<PaginaEmision<CertificadoRow> | null>(null);
  readonly catalogo = signal<PaginaEmision<TipoCertificado> | null>(null);
  readonly cargando = signal(false);
  readonly cargandoTipos = signal(false);
  readonly error = signal('');
  readonly errorTipos = signal('');
  readonly consultado = signal(false);
  inicio = ''; fin = ''; estado = ''; tipo = ''; busqueda = '';
  private tipoElegido: TipoCertificado | null = null;
  aplicado = { inicio: '', fin: '', estado: '', tipo: '', busqueda: '' };
  readonly estadoTexto = estadoCertificado;

  constructor() { afterNextRender(() => { this.cargarTipos(); this.consultar(); }); }

  cargarTipos(page = 1): void {
    if (!this.auth.tienePermiso('emision.ver') || this.cargandoTipos()) return;
    this.cargandoTipos.set(true); this.errorTipos.set('');
    this.servicio.tipos(page).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: pagina => { this.catalogo.set(pagina); this.cargandoTipos.set(false); },
      error: error => { this.errorTipos.set(mensajeReporte(error)); this.cargandoTipos.set(false); },
    });
  }

  consultar(): void {
    if (this.cargando()) return;
    this.error.set('');
    if (!fechasValidas(this.inicio, this.fin)) { this.pagina.set(null); this.error.set('La fecha de inicio no puede ser posterior a la fecha de fin.'); return; }
    this.aplicado = { inicio: this.inicio, fin: this.fin, estado: this.estado, tipo: this.tipo, busqueda: this.busqueda.trim() };
    this.cargar(1);
  }

  cargar(page: number): void {
    if (this.cargando()) return;
    this.error.set(''); this.pagina.set(null); this.consultado.set(true);
    if (!this.auth.tienePermiso('emision.ver')) { this.error.set('Necesitas el permiso emision.ver para consultar los certificados.'); return; }
    this.cargando.set(true);
    this.servicio.certificados(page, this.aplicado.estado, this.aplicado.tipo).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: pagina => { this.pagina.set(pagina); this.cargando.set(false); },
      error: error => { this.error.set(mensajeReporte(error)); this.cargando.set(false); },
    });
  }

  actualizar(): void { this.cargar(this.pagina()?.current_page ?? 1); }
  limpiar(): void {
    if (this.cargando()) return;
    this.inicio = ''; this.fin = ''; this.estado = ''; this.tipo = ''; this.tipoElegido = null; this.busqueda = ''; this.consultar();
  }

  filas(): readonly CertificadoRow[] {
    const { inicio, fin, busqueda } = this.aplicado;
    return (this.pagina()?.data ?? []).filter(fila => {
      const fecha = fila.fecha_emision?.slice(0, 10);
      return (!(inicio || fin) || (!!fecha && (!inicio || fecha >= inicio) && (!fin || fecha <= fin)))
        && (!busqueda || [fila.id_certificado, this.nombreTipo(fila.id_tipo_certificado), fecha, estadoCertificado(fila.estado)]
          .join(' ').toLocaleLowerCase('es').includes(busqueda.toLocaleLowerCase('es')));
    });
  }

  tiposDisponibles(): readonly TipoCertificado[] {
    const tipos = this.catalogo()?.data ?? [];
    return this.tipoElegido && !tipos.some(tipo => tipo.id_tipo_certificado === this.tipoElegido?.id_tipo_certificado)
      ? [this.tipoElegido, ...tipos] : tipos;
  }
  seleccionarTipo(valor: string): void {
    this.tipoElegido = this.tiposDisponibles().find(tipo => String(tipo.id_tipo_certificado) === String(valor)) ?? null;
  }
  nombreTipo(id: number): string { return this.tiposDisponibles().find(tipo => tipo.id_tipo_certificado === id)?.nombre_tipo ?? 'Nombre no incluido en esta página de tipos'; }
  conFecha(): number { return this.filas().filter(fila => !!fila.fecha_emision).length; }
  exportar(): void {
    if (!this.auth.tienePermiso('reportes.exportar') || this.cargando() || !this.filas().length) return;
    descargarCsv('certificados-pagina-filtrada.csv', ['Registro de certificado', 'Beneficiario', 'Actividad', 'Tipo', 'Fecha de emisión declarada', 'Estado del registro', 'Alcance'],
      this.filas().map(fila => [fila.id_certificado, 'Nombre no proporcionado por el endpoint', 'Relación no proporcionada por el endpoint', this.nombreTipo(fila.id_tipo_certificado), fila.fecha_emision, estadoCertificado(fila.estado), `Página ${this.pagina()?.current_page}; filtros de fecha y búsqueda aplicados solo a esta página`]));
  }
}
