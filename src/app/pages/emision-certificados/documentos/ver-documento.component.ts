import { CambiosCertificadosService } from '../../../core/services/emision-certificados/cambios-certificados.service';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CertificadoCatalogo, estadoCatalogo, origenCatalogo } from '../../../core/interfaces/emision-certificados/catalogo-certificados.interface';
import { EmisionCertificadosService } from '../../../core/services/emision-certificados/emision-certificados.service';
import { mensajeEtapaA } from '../../../core/services/emision-certificados/documentos-digitales.service';
import { VisorPdfComponent } from '../compartidos/visor-pdf.component';
import { listoParaEntrega } from '../../../core/interfaces/emision-certificados/estado-revision';

@Component({
  selector: 'app-ver-documento', standalone: true, imports: [RouterLink, VisorPdfComponent],
  template: `
    <header><a class="btn" [routerLink]="regresoGerencia ? '/pendientes/documentos-firmar' : regresoPracticas ? '/certificaciones/generar-emitir' : '/certificaciones/certificados/documentos'" [queryParams]="regresoGerencia ? { pestana: 'preparados', page: paginaRegreso } : regresoPracticas ? { origen_documental: 'practica' } : null" aria-label="Volver al listado"><span class="material-symbols-outlined" aria-hidden="true">arrow_back</span>Volver</a><h1>Certificado</h1></header>
    @if (cargando()) { <p role="status">Cargando certificado...</p> }
    @if (error()) { <p role="alert">{{ error() }}</p><button class="btn" type="button" (click)="cargar()">Reintentar</button> }
    @if (documento(); as d) {
      <section aria-label="Datos del certificado"><h2>{{ d.nombre_completo }}</h2><p>{{ origenTexto(d) }} · {{ estadoTexto(d) }}</p></section>
      @if (d.hash_pdf && d.codigo_verificacion) {
        <app-visor-pdf [integrado]="true" [ajustarAncho]="true" [persistido]="true" [documentoId]="d.id_certificado_documento" [hashEsperado]="d.hash_pdf" [mostrarDescripcion]="false" [controlesZoom]="true" />
      } @else { <p>Sin PDF disponible.</p> }
    }
  `,
  styles: `:host{display:block;min-width:0}header{display:flex;align-items:center;gap:1rem}h1,h2{margin:.5rem 0}h2{font-size:1.1rem}p{margin:.5rem 0 1rem}`,
})
export class VerDocumentoComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(EmisionCertificadosService);
  private readonly destroy = inject(DestroyRef);
  private carga?: Subscription;
  protected get regresoGerencia(): boolean { return this.route.snapshot.queryParamMap.get('origen') === 'gerencia'; }
  protected get regresoPracticas(): boolean { return this.route.snapshot.queryParamMap.get('origen') === 'practicas'; }
  protected get paginaRegreso(): number { const pagina = Number(this.route.snapshot.queryParamMap.get('page')); return Number.isSafeInteger(pagina) && pagina > 0 ? pagina : 1; }
  private readonly cambios = inject(CambiosCertificadosService);
  protected readonly origenTexto = origenCatalogo;
  protected readonly documento = signal<CertificadoCatalogo | null>(null);
  protected readonly error = signal('');
  protected readonly cargando = signal(false);
  protected estadoTexto(doc: CertificadoCatalogo): string { return this.regresoGerencia && listoParaEntrega(doc) ? 'Listo para entrega' : estadoCatalogo(doc); }
  ngOnInit(): void { this.cambios.cambios$.pipe(takeUntilDestroyed(this.destroy)).subscribe(() => this.cargar()); this.route.paramMap.pipe(takeUntilDestroyed(this.destroy)).subscribe(() => this.cargar()); }
  protected cargar(): void {
    this.carga?.unsubscribe();
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    const documento = Number(this.route.snapshot.paramMap.get('documentoId'));
    this.documento.set(null); this.error.set(''); this.cargando.set(false);
    if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id)) || !Number.isSafeInteger(documento) || documento < 1) { this.error.set('Documento no encontrado.'); return; }
    this.cargando.set(true);
    this.carga = this.api.catalogoAutorizado({ id_certificado: id }, 'certificados-documentos').pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: filas => {
        const fila = filas.find(f => f.id_certificado === Number(id) && f.id_certificado_documento === documento);
        if (!fila) this.error.set('Documento no encontrado en tu ámbito autorizado.');
        else this.documento.set(fila);
        this.cargando.set(false);
      },
      error: e => { this.error.set(mensajeEtapaA(e)); this.cargando.set(false); },
    });
  }
}
