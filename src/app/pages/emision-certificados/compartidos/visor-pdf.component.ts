import { PdfContinuoComponent } from './pdf-continuo.component';
import { isPlatformBrowser } from '@angular/common';
import { Component, computed, DestroyRef, effect, ElementRef, inject, input, output, PLATFORM_ID, signal, viewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DocumentosDigitalesService, mensajeDocumento, mensajeEtapaA } from '../../../core/services/emision-certificados/documentos-digitales.service';
import { ErrorApi } from '../../../core/interfaces/api/api-response.interface';
import { ArchivoPdf } from '../../../core/interfaces/emision-certificados/documento-digital.interface';
import { Observable, of } from 'rxjs';

/** Solo representa bytes PDF recuperados de Laravel; nunca convierte HTML a PDF. */
@Component({
  selector: 'app-visor-pdf', standalone: true, imports: [PdfContinuoComponent],
  template: `
    <section [attr.aria-label]="archivoPrevio() && !persistido() ? 'Vista previa PDF no emitida' : 'PDF almacenado en Laravel'" [attr.aria-busy]="cargando()">
      @if (cargando()) { <p role="status">Recuperando PDF de Laravel…</p> }
      @if (error()) { <p role="alert">{{ error() }}</p><button type="button" class="btn" (click)="revision.update(siguiente)">Reintentar PDF</button> }
      @if (integrado()) { <app-pdf-continuo [archivo]="archivoIntegrado()" [textosEsperados]="textosEsperados()" [zoom]="zoom()" (listo)="archivoVisualizado.emit($event)" (fallo)="errorVisualizacion.emit($event)" /> }
      @if (urlSegura(); as src) {
        <div class="acciones"><a class="btn" [href]="url()" [download]="archivoPrevio()?.nombre || 'certificado.pdf'">{{ archivoPrevio() && !persistido() ? 'Descargar vista previa' : 'Descargar PDF' }}</a>@if (!compacto()) { <button type="button" class="btn" (click)="imprimir()">Imprimir PDF</button><a class="btn" [href]="url()" target="_blank" rel="noopener">Abrir PDF</a> }</div>
        @if (controlesZoom()) { <label>Zoom del PDF <select aria-label="Zoom del PDF" [value]="zoom()" (change)="cambiarZoom($any($event.target).value)"><option value="75">75 %</option><option value="100">100 %</option><option value="125">125 %</option><option value="150">150 %</option><option value="200">200 %</option></select></label> }
        @if (!integrado()) { @for (recurso of recursos(); track recurso.url) {
          <iframe #marco [src]="recurso.src" (load)="marcoCargado($event)" (error)="marcoFallido($event)" title="PDF auténtico recuperado del backend"></iframe>
        }
        }
        @if (mostrarDescripcion()) {
          @if (archivoPrevio() && !persistido()) { <p role="status">Borrador pendiente de emisión.</p> }
          @else { <p>El PDF almacenado contiene el QR y el código asignados por Laravel. Su disponibilidad no acredita una firma digital.</p> }
        }
        @if (aviso()) { <p role="status">{{ aviso() }}</p> }
      }
    </section>`,
  styles: `:host { display:block; min-width:0 } iframe { width:100%; height:72vh; min-height:24rem; border:1px solid #d5dee8; border-radius:.5rem; background:#fff } .acciones { display:flex; flex-wrap:wrap; gap:.5rem; margin-block:1rem } p { overflow-wrap:anywhere } @media(max-width:600px) { iframe { height:65vh; min-height:18rem } }`,
})
export class VisorPdfComponent {
  readonly integrado = input(false);
  private readonly archivoDescargado = signal<ArchivoPdf | null>(null);
  // La entrada temporal gobierna directamente PDF.js; nunca pasa por la caché del vigente.
  protected readonly archivoIntegrado = computed(() => this.archivoPrevio() ?? this.archivoDescargado());
  readonly textosEsperados = input<readonly string[]>([]);
  readonly archivoCargado = output<ArchivoPdf>();
  readonly archivoVisualizado = output<ArchivoPdf>();
  readonly errorVisualizacion = output<string>();
  readonly flujoFirmas = input(false);
  readonly hashEsperado = input<string | undefined>();
  readonly persistido = input(false);
  readonly compacto = input(false);
  readonly controlesZoom = input(false);
  readonly mostrarDescripcion = input(true);
  protected readonly zoom = signal(100);
  readonly archivoPrevio = input<ArchivoPdf | null>(null);
  readonly documentoId = input<number | null>(null);
  readonly urlPublica = input<string | null>(null);
  readonly codigo = input('');
  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly aviso = signal<string | null>(null);
  protected readonly url = signal<string | null>(null);
  protected readonly urlSegura = signal<SafeResourceUrl | null>(null);
  protected readonly recursos = computed(() => {
    const url = this.url(); const src = this.urlSegura();
    // Conservar la clave de cada recurso permite retirar realmente el iframe anterior.
    return url && src ? [{ url, src }] : [];
  });
  protected readonly revision = signal(0);
  protected readonly siguiente = (n: number) => n + 1;
  private readonly marco = viewChild<ElementRef<HTMLIFrameElement>>('marco');
  private readonly api = inject(DocumentosDigitalesService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private archivoActual: ArchivoPdf | null = null;
  private objetoIntegrado: string | null = null;
  constructor() {
    inject(DestroyRef).onDestroy(() => { if (this.objetoIntegrado) URL.revokeObjectURL(this.objetoIntegrado); });
    effect(onCleanup => {
      const id = this.documentoId(); const publico = this.urlPublica(); const codigo = this.codigo(); this.revision();
      const previo = this.archivoPrevio(); const flujoFirmas = this.flujoFirmas(); const hash = this.hashEsperado();
      const integrado = this.integrado();
      if (integrado) { this.error.set(null); this.aviso.set(null); }
      if (!integrado) {
      this.archivoActual = null;
      this.url.set(null); this.urlSegura.set(null); this.zoom.set(100); this.error.set(null); this.aviso.set(null); this.cargando.set(false);
      }
      if (!this.browser || (!id && !publico && !previo)) return;
      if (id !== null && (!Number.isSafeInteger(id) || id < 1)) { this.error.set('Identificador de documento inválido.'); return; }
      this.cargando.set(true);
      let objeto: string | null = null;
      let consulta: Observable<ArchivoPdf>;
      if (previo) consulta = of(previo);
      else if (id !== null && (flujoFirmas || hash)) consulta = this.api.archivo(id, flujoFirmas, hash);
      else if (id !== null) consulta = this.api.archivo(id);
      else consulta = this.api.archivoPublico(publico!, codigo);
      const solicitud = consulta.subscribe({
        next: archivo => {
          if (integrado && archivo === this.archivoActual) { this.cargando.set(false); return; }
          this.archivoActual = archivo;
          if (integrado && !previo) this.archivoDescargado.set(archivo);
          objeto = URL.createObjectURL(archivo.blob); this.url.set(objeto);
          if (integrado) {
            if (this.objetoIntegrado) URL.revokeObjectURL(this.objetoIntegrado);
            this.objetoIntegrado = objeto;
          }
          // El único recurso de confianza es el blob PDF validado, nunca una URL o HTML del servidor.
          this.urlSegura.set(this.sanitizer.bypassSecurityTrustResourceUrl(objeto)); this.cargando.set(false);
          if (!previo) this.archivoCargado.emit(archivo);
        }, error: (e: ErrorApi) => {
          const mensaje = flujoFirmas ? mensajeEtapaA(e) : mensajeDocumento(e);
          this.error.set(mensaje); this.errorVisualizacion.emit(mensaje); this.cargando.set(false);
        },
      });
      onCleanup(() => { solicitud.unsubscribe(); if (objeto && !integrado) URL.revokeObjectURL(objeto); });
    }, { allowSignalWrites: true });
  }
  protected marcoCargado(evento: Event): void {
    // Un load tardío del iframe retirado no acredita la versión actual.
    const marco = this.marco()?.nativeElement;
    if (evento.target === marco && this.archivoActual && marco?.getAttribute('src')?.split('#')[0] === this.url()) {
      this.archivoVisualizado.emit(this.archivoActual);
    }
  }
  protected marcoFallido(evento: Event): void {
    if (evento.target !== this.marco()?.nativeElement) return;
    const mensaje = 'No se pudo cargar el PDF en el visor. Vuelva a solicitar la vista previa.';
    this.error.set(mensaje); this.errorVisualizacion.emit(mensaje);
  }
  protected imprimir(): void {
    if (this.integrado()) {
      this.aviso.set('Abre el PDF para imprimirlo con las opciones de tu navegador.');
      return;
    }
    try { const marco = this.marco()?.nativeElement.contentWindow; if (!marco) return; marco.focus(); marco.print(); }
    catch { this.aviso.set('Usa la opción Imprimir del visor de PDF o abre el archivo en otra pestaña.'); }
  }
  protected cambiarZoom(valor: string): void {
    const zoom = Number(valor); const url = this.url();
    if (!url || ![75, 100, 125, 150, 200].includes(zoom)) return;
    this.zoom.set(zoom);
    if (this.integrado()) return;
    this.urlSegura.set(this.sanitizer.bypassSecurityTrustResourceUrl(`${url}#zoom=${zoom}`));
  }
}
