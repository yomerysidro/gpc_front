import { CambiosCertificadosService } from '../../../core/services/emision-certificados/cambios-certificados.service';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ErrorApi } from '../../../core/interfaces/api/api-response.interface';
import { DocumentoFirmas, DocumentosDigitalesService, mensajeEtapaA } from '../../../core/services/emision-certificados/documentos-digitales.service';
import { PageTitleComponent } from '../../../shared/components/page-title/page-title.component';
import { FirmaDocumentalService, ResultadoLote } from '../../../core/services/emision-certificados/firma-documental.service';
import { CertificadoCatalogo } from '../../../core/interfaces/emision-certificados/catalogo-certificados.interface';
import { listoParaEntrega } from '../../../core/interfaces/emision-certificados/estado-revision';
import { EmisionCertificadosService } from '../../../core/services/emision-certificados/emision-certificados.service';
import { forkJoin, map, of, Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-documentos-por-firmar', standalone: true,
  imports: [PageTitleComponent, RouterLink],
  templateUrl: './documentos-por-firmar.component.html', styleUrl: '../../solicitudes/compartidos/solicitudes.scss',
  styles: `.pestanas-gerencia{display:flex;gap:.25rem;border-bottom:1px solid #d5dee8;margin-bottom:1rem;flex-wrap:wrap}.pestanas-gerencia button{display:inline-flex;align-items:center;gap:.4rem;padding:.6rem .8rem;background:transparent;border:0;border-bottom:3px solid transparent;color:#52677b;cursor:pointer;font:inherit;font-size:.9rem}.pestanas-gerencia [aria-selected=true]{color:#075a9b;border-bottom-color:#d6ad4a;font-weight:600}.pestanas-gerencia .material-symbols-outlined{font-size:1.2rem}.estado-listo{display:inline-block;color:#21643b;background:#e8f5ec;border-radius:1rem;padding:.2rem .6rem;font-size:.85rem}[hidden]{display:none!important}.aviso-exito{color:#21643b;margin-bottom:.75rem}@media(max-width:600px){.pestanas-gerencia button{flex:1;font-size:.85rem;justify-content:center}}`,
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
  protected readonly pestana = signal<'pendientes' | 'preparados'>('pendientes');
  protected readonly preparados = signal<readonly CertificadoCatalogo[] | null>(null);
  protected readonly cargandoPreparados = signal(false);
  protected readonly errorPreparados = signal<string | null>(null);
  protected readonly paginaPreparados = signal(1);
  protected readonly paginasPreparados = computed(() => Math.max(1, Math.ceil((this.preparados()?.length ?? 0) / 20)));
  protected readonly paginaPreparadosActual = computed(() => Math.min(this.paginaPreparados(), this.paginasPreparados()));
  protected readonly preparadosVisibles = computed(() => (this.preparados() ?? []).slice((this.paginaPreparadosActual() - 1) * 20, this.paginaPreparadosActual() * 20));
  protected estadoPreparado(doc: CertificadoCatalogo): string {
    return listoParaEntrega(doc) ? 'Listo para entrega' : 'Pendiente de firma';
  }
  private readonly catalogo = inject(EmisionCertificadosService);
  private cargaPreparados?: Subscription;
  protected readonly aviso = signal(this.router.getCurrentNavigation()?.extras.state?.['certificadoListo'] === true ? 'Certificado listo para entrega' : '');
  private numero = 1;
  private carga?: Subscription;

  private readonly cambiosCertificados = inject(CambiosCertificadosService);
  ngOnInit(): void {
    this.cambiosCertificados.cambios$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.cargar();
      if (this.preparados() !== null || this.pestana() === 'preparados') this.cargarPreparados();
    });
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const valor = params.get('documento');
      const page = Number(params.get('page'));
      const pagina = Number.isSafeInteger(page) && page > 0 ? page : 1;
      if (valor && /^[1-9]\d*$/.test(valor) && Number.isSafeInteger(Number(valor))) {
        void this.router.navigate(['/pendientes/documentos-firmar', Number(valor)], { queryParams: { page: pagina }, replaceUrl: true });
        return;
      }
      const pestana = params.get('pestana') === 'preparados' ? 'preparados' : 'pendientes';
      this.pestana.set(pestana);
      this.paginaPreparados.set(pestana === 'preparados' ? pagina : 1);
      if (!this.pagina() || pestana === 'pendientes' && pagina !== this.numero) this.cargar(pestana === 'pendientes' ? pagina : 1);
      if (pestana === 'preparados' && this.preparados() === null && !this.cargandoPreparados()) this.cargarPreparados();
    });
  }

  protected cargar(numero = this.numero): void {
    this.carga?.unsubscribe();
    this.numero = numero;
    this.error.set(null);
    this.cargando.set(true);
    this.pagina.set(null);
    this.carga = this.api.pendientesFirma(numero).pipe(
      switchMap(pagina => !pagina.data.length ? of(pagina) : forkJoin(pagina.data.map(doc =>
        this.firmas.progreso(doc.id_certificado_documento).pipe(map(p => ({ ...doc,
          pdf_confirmado: p.pdf_confirmado ?? p.pdf_revisado_disponible ?? p.documento.pdf_confirmado ?? p.documento.pdf_revisado_disponible ?? doc.pdf_confirmado,
          disponible_rrhh: p.disponible_rrhh ?? p.documento.disponible_rrhh ?? doc.disponible_rrhh,
          estado_preparacion: p.estado_preparacion ?? p.documento.estado_preparacion ?? doc.estado_preparacion,
        }))),
      )).pipe(map(data => ({ ...pagina, data })))), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: pagina => {
        const data = pagina.data.filter(doc => !listoParaEntrega(doc));
        this.pagina.set({ ...pagina, data });
        this.seleccionados.set([]); this.resultados.set(null);
        this.cargando.set(false);
      },
      error: (error: ErrorApi) => { this.error.set(mensajeEtapaA(error)); this.cargando.set(false); },
    });
  }

  protected cambiarPagina(numero: number): void {
    void this.router.navigate([], { relativeTo: this.route, queryParams: { page: numero }, queryParamsHandling: 'merge' });
  }
  protected seleccionarPestana(pestana: 'pendientes' | 'preparados'): void {
    if (this.pestana() === pestana) return;
    this.aviso.set('');
    void this.router.navigate([], { relativeTo: this.route, queryParams: { pestana: pestana === 'preparados' ? pestana : null, page: 1 }, queryParamsHandling: 'merge' });
  }
  protected alTeclear(evento: KeyboardEvent): void {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(evento.key)) return;
    evento.preventDefault();
    const destino = evento.key === 'Home' ? 'pendientes' : evento.key === 'End' ? 'preparados' : this.pestana() === 'pendientes' ? 'preparados' : 'pendientes';
    this.seleccionarPestana(destino);
    (evento.currentTarget as HTMLElement).querySelector<HTMLButtonElement>('#certificados-' + destino)?.focus();
  }
  protected cargarPreparados(): void {
    this.cargaPreparados?.unsubscribe(); this.errorPreparados.set(null); this.cargandoPreparados.set(true);
    this.cargaPreparados = this.catalogo.catalogoAutorizado({}, 'certificados-documentos').pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: filas => {
        this.preparados.set(filas.filter(f => !!f.id_certificado_documento && listoParaEntrega(f)));
        this.cargandoPreparados.set(false);
      },
      error: e => { this.preparados.set(null); this.errorPreparados.set(mensajeEtapaA(e)); this.cargandoPreparados.set(false); },
    });
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
    return listoParaEntrega(doc) ? 'Listo para entrega' : 'Pendiente de firma';
  }

}
