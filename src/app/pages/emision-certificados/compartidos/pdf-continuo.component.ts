import { Component, DestroyRef, ElementRef, effect, inject, input, output, viewChild } from '@angular/core';
import { ArchivoPdf } from '../../../core/interfaces/emision-certificados/documento-digital.interface';

/** Prepara fuera del DOM y publica todas las páginas en una sola operación. */
@Component({
  selector: 'app-pdf-continuo', standalone: true,
  template: '<div #lectura class="lectura" tabindex="0" aria-label="Páginas del PDF"></div>',
  styles: ':host{display:block}.lectura{position:relative;height:72vh;min-height:24rem;overflow:auto;overflow-anchor:none;background:#e5e7eb;border:1px solid #d5dee8} .lectura:focus{outline:2px solid #2563eb}',
})
export class PdfContinuoComponent {
  readonly archivo = input<ArchivoPdf | null>(null);
  readonly zoom = input(100);
  readonly ajustarAncho = input(false);
  readonly textosEsperados = input<readonly string[]>([]);
  readonly listo = output<ArchivoPdf>();
  readonly fallo = output<string>();
  private readonly lectura = viewChild<ElementRef<HTMLDivElement>>('lectura');
  constructor() {
    const destroy = inject(DestroyRef);
    let secuencia = 0;
    const tareas = new Set<import('pdfjs-dist').PDFDocumentLoadingTask>();
    destroy.onDestroy(() => { ++secuencia; tareas.forEach(t => void t.destroy()); tareas.clear(); });
    effect(onCleanup => {
      const archivo = this.archivo(); const zoom = this.zoom(); const ajustar = this.ajustarAncho(); const contenedor = this.lectura()?.nativeElement;
      const textosEsperados = this.textosEsperados();
      const turno = ++secuencia;
      if (!archivo || !contenedor) return;
      let tarea: import('pdfjs-dist').PDFDocumentLoadingTask | undefined;
      onCleanup(() => { if (tarea) { tareas.delete(tarea); void tarea.destroy(); } });
      void (async () => {
        try {
          const pdfjs = await import('pdfjs-dist');
          if (turno !== secuencia) return;
          pdfjs.GlobalWorkerOptions.workerSrc = new URL('assets/pdfjs/pdf.worker.min.mjs', document.baseURI).href;
          const data = new Uint8Array(await archivo.blob.arrayBuffer());
          if (turno !== secuencia) return;
          tarea = pdfjs.getDocument({ data, isEvalSupported: false }); tareas.add(tarea);
          const pdf = await tarea.promise;
          const paginas = document.createDocumentFragment();
          const textos: string[] = [];
          for (let numero = 1; numero <= pdf.numPages; numero++) {
            if (turno !== secuencia) return;
            const pagina = await pdf.getPage(numero);
            if (textosEsperados.length) {
              const contenido = await pagina.getTextContent();
              textos.push(...contenido.items.map(item => 'str' in item ? item.str : ''));
            }
            const ancho = pagina.getViewport({ scale: 1 }).width;
            const escala = ajustar ? Math.min(1, Math.max(1, contenedor.clientWidth - 24) / ancho) : 1;
            const viewport = pagina.getViewport({ scale: escala * zoom / 100 });
            const canvas = document.createElement('canvas');
            const ratio = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.ceil(viewport.width * ratio); canvas.height = Math.ceil(viewport.height * ratio);
            canvas.style.cssText = `display:block;margin:12px auto;width:${viewport.width}px;height:${viewport.height}px;background:white`;
            if (ajustar && zoom === 100) { canvas.style.maxWidth = 'calc(100% - 24px)'; canvas.style.height = 'auto'; }
            canvas.setAttribute('aria-label', `Página ${numero}`); canvas.setAttribute('role', 'img');
            await pagina.render({ canvasContext: canvas.getContext('2d')!, viewport, transform: [ratio, 0, 0, ratio, 0, 0] }).promise;
            paginas.append(canvas); pagina.cleanup();
          }
          if (turno !== secuencia) return;
          const normalizar = (texto: string) => texto.normalize('NFC').replace(/\s+/gu, '').toLocaleLowerCase('es');
          const textoPdf = normalizar(textos.join(''));
          if (textosEsperados.some(texto => !textoPdf.includes(normalizar(texto)))) {
            this.fallo.emit('El PDF temporal devuelto por Laravel no contiene los nombres o cargos de los firmantes solicitados. Se conserva el PDF anterior; no se puede confirmar esta vista previa.');
            return;
          }
          // Capturar al terminar: el usuario puede seguir leyendo durante la carga.
          const anteriores = Array.from(contenedor.children) as HTMLElement[];
          const indice = Math.max(0, anteriores.findIndex(p => p.offsetTop + p.offsetHeight > contenedor.scrollTop));
          const anterior = anteriores[indice];
          const fraccion = anterior ? (contenedor.scrollTop - anterior.offsetTop) / anterior.offsetHeight : 0;
          const izquierda = contenedor.scrollLeft;
          contenedor.replaceChildren(paginas);
          const actual = contenedor.children[Math.min(indice, contenedor.children.length - 1)] as HTMLElement;
          if (actual) contenedor.scrollTop = actual.offsetTop + fraccion * actual.offsetHeight;
          contenedor.scrollLeft = izquierda;
          this.listo.emit(archivo);
        } catch {
          if (turno === secuencia) this.fallo.emit('No se pudo representar el PDF. La visualización anterior se conserva.');
        } finally {
          if (tarea) { tareas.delete(tarea); await tarea.destroy(); }
        }
      })();
    });
  }
}
