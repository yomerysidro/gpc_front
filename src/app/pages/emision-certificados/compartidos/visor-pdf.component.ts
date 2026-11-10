import { isPlatformBrowser } from '@angular/common';
import { Component, effect, ElementRef, inject, input, PLATFORM_ID, signal, viewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DocumentosDigitalesService, mensajeDocumento } from '../../../core/services/emision-certificados/documentos-digitales.service';
import { ErrorApi } from '../../../core/interfaces/api/api-response.interface';
import { ArchivoPdf } from '../../../core/interfaces/emision-certificados/documento-digital.interface';
import { of } from 'rxjs';

/** Solo representa bytes PDF recuperados de Laravel; nunca convierte HTML a PDF. */
@Component({
  selector: 'app-visor-pdf', standalone: true,
  template: `
    <section [attr.aria-label]="archivoPrevio() ? 'Vista previa PDF no emitida' : 'PDF almacenado en Laravel'" [attr.aria-busy]="cargando()">
      @if (cargando()) { <p role="status">Recuperando PDF de Laravel…</p> }
      @if (error()) { <p role="alert">{{ error() }}</p><button class="btn" (click)="revision.update(siguiente)">Reintentar PDF</button> }
      @if (urlSegura(); as src) {
        <div class="acciones"><a class="btn" [href]="url()" [download]="archivoPrevio()?.nombre || 'certificado.pdf'">{{ archivoPrevio() ? 'Descargar vista previa' : 'Descargar PDF' }}</a><button class="btn" (click)="imprimir()">Imprimir PDF</button><a class="btn" [href]="url()" target="_blank" rel="noopener">Abrir PDF</a></div>
        <iframe #marco [src]="src" title="PDF auténtico recuperado del backend"></iframe>
        @if (archivoPrevio()) { <p>Vista previa no emitida. Puedes volver a editar el mensaje.</p> }
        @else { <p>El PDF almacenado contiene el QR y el código asignados por Laravel. Su disponibilidad no acredita una firma digital.</p> }
        @if (aviso()) { <p role="status">{{ aviso() }}</p> }
      }
    </section>`,
  styles: `:host { display:block; min-width:0 } iframe { width:100%; height:72vh; min-height:24rem; border:1px solid #d5dee8; border-radius:.5rem; background:#fff } .acciones { display:flex; flex-wrap:wrap; gap:.5rem; margin-block:1rem } p { overflow-wrap:anywhere } @media(max-width:600px) { iframe { height:65vh; min-height:18rem } }`,
})
export class VisorPdfComponent {
  readonly archivoPrevio = input<ArchivoPdf | null>(null);
  readonly documentoId = input<number | null>(null);
  readonly urlPublica = input<string | null>(null);
  readonly codigo = input('');
  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly aviso = signal<string | null>(null);
  protected readonly url = signal<string | null>(null);
  protected readonly urlSegura = signal<SafeResourceUrl | null>(null);
  protected readonly revision = signal(0);
  protected readonly siguiente = (n: number) => n + 1;
  private readonly marco = viewChild<ElementRef<HTMLIFrameElement>>('marco');
  private readonly api = inject(DocumentosDigitalesService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  constructor() {
    effect(onCleanup => {
      const id = this.documentoId(); const publico = this.urlPublica(); const codigo = this.codigo(); this.revision();
      const previo = this.archivoPrevio();
      this.url.set(null); this.urlSegura.set(null); this.error.set(null); this.aviso.set(null); this.cargando.set(false);
      if (!this.browser || (!id && !publico && !previo)) return;
      if (id !== null && (!Number.isSafeInteger(id) || id < 1)) { this.error.set('Identificador de documento inválido.'); return; }
      this.cargando.set(true);
      let objeto: string | null = null;
      const solicitud = (previo ? of(previo) : id !== null ? this.api.archivo(id) : this.api.archivoPublico(publico!, codigo)).subscribe({
        next: archivo => {
          objeto = URL.createObjectURL(archivo.blob); this.url.set(objeto);
          // El único recurso de confianza es el blob PDF validado, nunca una URL o HTML del servidor.
          this.urlSegura.set(this.sanitizer.bypassSecurityTrustResourceUrl(objeto)); this.cargando.set(false);
        }, error: (e: ErrorApi) => { this.error.set(mensajeDocumento(e)); this.cargando.set(false); },
      });
      onCleanup(() => { solicitud.unsubscribe(); if (objeto) URL.revokeObjectURL(objeto); });
    }, { allowSignalWrites: true });
  }
  protected imprimir(): void {
    try { const marco = this.marco()?.nativeElement.contentWindow; if (!marco) return; marco.focus(); marco.print(); }
    catch { this.aviso.set('Usa la opción Imprimir del visor de PDF o abre el archivo en otra pestaña.'); }
  }
}
