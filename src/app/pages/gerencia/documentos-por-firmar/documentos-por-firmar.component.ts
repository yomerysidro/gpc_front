import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ErrorApi } from '../../../core/interfaces/api/api-response.interface';
import { DocumentoFirmas, DocumentosDigitalesService, mensajeEtapaA } from '../../../core/services/emision-certificados/documentos-digitales.service';
import { PageTitleComponent } from '../../../shared/components/page-title/page-title.component';
import { FirmaDocumentalService, ResultadoLote } from '../../../core/services/emision-certificados/firma-documental.service';

@Component({
  selector: 'app-documentos-por-firmar', standalone: true,
  imports: [PageTitleComponent, RouterLink],
  templateUrl: './documentos-por-firmar.component.html', styleUrl: '../../solicitudes/compartidos/solicitudes.scss',
  styles: `[role=tablist] { margin-bottom: .75rem; }`,
})
export class DocumentosPorFirmarComponent implements OnInit {
  private readonly api = inject(DocumentosDigitalesService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly firmas = inject(FirmaDocumentalService);
  protected readonly pagina = signal<{ data: DocumentoFirmas[]; current_page: number; last_page: number } | null>(null);
  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly seleccionados = signal<number[]>([]);
  protected readonly resultados = signal<ResultadoLote[] | null>(null);
  protected readonly consultandoLote = signal(false);
  protected readonly errorLote = signal<string | null>(null);
  private numero = 1;

  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const valor = params.get('documento');
      const page = Number(params.get('page'));
      const pagina = Number.isSafeInteger(page) && page > 0 ? page : 1;
      if (valor && /^[1-9]\d*$/.test(valor) && Number.isSafeInteger(Number(valor))) {
        void this.router.navigate(['/pendientes/documentos-firmar', Number(valor)], { queryParams: { page: pagina }, replaceUrl: true });
        return;
      }
      if (!this.pagina() || pagina !== this.numero) this.cargar(pagina);
    });
  }

  protected cargar(numero = this.numero): void {
    if (this.cargando()) return;
    this.numero = numero;
    this.error.set(null);
    this.cargando.set(true);
    this.api.pendientesFirma(numero).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: pagina => { this.pagina.set(pagina); this.cargando.set(false); },
      error: (error: ErrorApi) => { this.error.set(mensajeEtapaA(error)); this.cargando.set(false); },
    });
  }

  protected cambiarPagina(numero: number): void {
    void this.router.navigate([], { relativeTo: this.route, queryParams: { page: numero }, queryParamsHandling: 'merge' });
  }
  protected seleccionarDocumento(id: number, marcado: boolean): void {
    if (this.consultandoLote()) return;
    this.resultados.set(null);
    this.seleccionados.update(ids => marcado ? [...ids.filter(i => i !== id), id].slice(0, 100) : ids.filter(i => i !== id));
  }
  protected consultarLote(): void {
    if (!this.seleccionados().length || this.consultandoLote()) return;
    this.consultandoLote.set(true); this.errorLote.set(null);
    this.firmas.lote(this.seleccionados()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: r => { this.resultados.set(r.resultados); this.consultandoLote.set(false); },
      error: (e: ErrorApi | Error) => { this.errorLote.set(e instanceof Error ? 'No se pudo validar el resultado del lote.' : mensajeEtapaA(e)); this.consultandoLote.set(false); },
    });
  }

  protected beneficiario(doc: DocumentoFirmas): string {
    return doc.beneficiario?.nombre || [doc.contexto?.nombres, doc.contexto?.apellido_paterno, doc.contexto?.apellido_materno].filter(Boolean).join(' ') || 'Beneficiario no informado';
  }

  protected estado(doc: DocumentoFirmas): string {
    return ({ PREPARADO: 'Preparado', PENDIENTE_FIRMA: 'Pendiente de firma' } as Record<string, string>)[doc.estado_certificado] || doc.estado_certificado;
  }

}
