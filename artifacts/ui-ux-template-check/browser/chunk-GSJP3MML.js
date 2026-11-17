import {
  DestroyRef,
  effect,
  inject,
  input,
  output,
  viewChild,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵqueryAdvance,
  ɵɵviewQuerySignal
} from "./chunk-3ZDGBTDF.js";
import {
  __async
} from "./chunk-ZX6IUAQ5.js";

// src/app/pages/emision-certificados/compartidos/pdf-continuo.component.ts
var _c0 = ["lectura"];
var PdfContinuoComponent = class _PdfContinuoComponent {
  archivo = input(null);
  zoom = input(100);
  ajustarAncho = input(false);
  textosEsperados = input([]);
  listo = output();
  fallo = output();
  lectura = viewChild("lectura");
  constructor() {
    const destroy = inject(DestroyRef);
    let secuencia = 0;
    const tareas = /* @__PURE__ */ new Set();
    destroy.onDestroy(() => {
      ++secuencia;
      tareas.forEach((t) => void t.destroy());
      tareas.clear();
    });
    effect((onCleanup) => {
      const archivo = this.archivo();
      const zoom = this.zoom();
      const ajustar = this.ajustarAncho();
      const contenedor = this.lectura()?.nativeElement;
      const textosEsperados = this.textosEsperados();
      const turno = ++secuencia;
      if (!archivo || !contenedor)
        return;
      let tarea;
      onCleanup(() => {
        if (tarea) {
          tareas.delete(tarea);
          void tarea.destroy();
        }
      });
      void (() => __async(this, null, function* () {
        try {
          const pdfjs = yield import("./chunk-UVR7U3EZ.js");
          if (turno !== secuencia)
            return;
          pdfjs.GlobalWorkerOptions.workerSrc = new URL("assets/pdfjs/pdf.worker.min.mjs", document.baseURI).href;
          const data = new Uint8Array(yield archivo.blob.arrayBuffer());
          if (turno !== secuencia)
            return;
          tarea = pdfjs.getDocument({ data, isEvalSupported: false });
          tareas.add(tarea);
          const pdf = yield tarea.promise;
          const paginas = document.createDocumentFragment();
          const textos = [];
          for (let numero = 1; numero <= pdf.numPages; numero++) {
            if (turno !== secuencia)
              return;
            const pagina = yield pdf.getPage(numero);
            if (textosEsperados.length) {
              const contenido = yield pagina.getTextContent();
              textos.push(...contenido.items.map((item) => "str" in item ? item.str : ""));
            }
            const ancho = pagina.getViewport({ scale: 1 }).width;
            const escala = ajustar ? Math.min(1, Math.max(1, contenedor.clientWidth - 24) / ancho) : 1;
            const viewport = pagina.getViewport({ scale: escala * zoom / 100 });
            const canvas = document.createElement("canvas");
            const ratio = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.ceil(viewport.width * ratio);
            canvas.height = Math.ceil(viewport.height * ratio);
            canvas.style.cssText = `display:block;margin:12px auto;width:${viewport.width}px;height:${viewport.height}px;background:white`;
            if (ajustar && zoom === 100) {
              canvas.style.maxWidth = "calc(100% - 24px)";
              canvas.style.height = "auto";
            }
            canvas.setAttribute("aria-label", `P\xE1gina ${numero}`);
            canvas.setAttribute("role", "img");
            yield pagina.render({ canvasContext: canvas.getContext("2d"), viewport, transform: [ratio, 0, 0, ratio, 0, 0] }).promise;
            paginas.append(canvas);
            pagina.cleanup();
          }
          if (turno !== secuencia)
            return;
          const normalizar = (texto) => texto.normalize("NFC").replace(/\s+/gu, "").toLocaleLowerCase("es");
          const textoPdf = normalizar(textos.join(""));
          if (textosEsperados.some((texto) => !textoPdf.includes(normalizar(texto)))) {
            this.fallo.emit("El PDF temporal devuelto por Laravel no contiene los nombres o cargos de los firmantes solicitados. Se conserva el PDF anterior; no se puede confirmar esta vista previa.");
            return;
          }
          const anteriores = Array.from(contenedor.children);
          const indice = Math.max(0, anteriores.findIndex((p) => p.offsetTop + p.offsetHeight > contenedor.scrollTop));
          const anterior = anteriores[indice];
          const fraccion = anterior ? (contenedor.scrollTop - anterior.offsetTop) / anterior.offsetHeight : 0;
          const izquierda = contenedor.scrollLeft;
          contenedor.replaceChildren(paginas);
          const actual = contenedor.children[Math.min(indice, contenedor.children.length - 1)];
          if (actual)
            contenedor.scrollTop = actual.offsetTop + fraccion * actual.offsetHeight;
          contenedor.scrollLeft = izquierda;
          this.listo.emit(archivo);
        } catch {
          if (turno === secuencia)
            this.fallo.emit("No se pudo representar el PDF. La visualizaci\xF3n anterior se conserva.");
        } finally {
          if (tarea) {
            tareas.delete(tarea);
            yield tarea.destroy();
          }
        }
      }))();
    });
  }
  static \u0275fac = function PdfContinuoComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PdfContinuoComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PdfContinuoComponent, selectors: [["app-pdf-continuo"]], viewQuery: function PdfContinuoComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuerySignal(ctx.lectura, _c0, 5);
    }
    if (rf & 2) {
      \u0275\u0275queryAdvance();
    }
  }, inputs: { archivo: [1, "archivo"], zoom: [1, "zoom"], ajustarAncho: [1, "ajustarAncho"], textosEsperados: [1, "textosEsperados"] }, outputs: { listo: "listo", fallo: "fallo" }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 2, vars: 0, consts: [["lectura", ""], ["tabindex", "0", "aria-label", "P\xE1ginas del PDF", 1, "lectura"]], template: function PdfContinuoComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "div", 1, 0);
    }
  }, styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.lectura[_ngcontent-%COMP%] {\n  position: relative;\n  height: 72vh;\n  min-height: 24rem;\n  overflow: auto;\n  overflow-anchor: none;\n  background: #e5e7eb;\n  border: 1px solid #d5dee8;\n}\n.lectura[_ngcontent-%COMP%]:focus {\n  outline: 2px solid #2563eb;\n}\n/*# sourceMappingURL=pdf-continuo.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PdfContinuoComponent, { className: "PdfContinuoComponent", filePath: "src\\app\\pages\\emision-certificados\\compartidos\\pdf-continuo.component.ts", lineNumber: 10 });
})();

export {
  PdfContinuoComponent
};
//# sourceMappingURL=chunk-GSJP3MML.js.map
