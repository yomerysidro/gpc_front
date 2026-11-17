import {
  PdfContinuoComponent
} from "./chunk-GSJP3MML.js";
import {
  DocumentosDigitalesService,
  mensajeDocumento,
  mensajeEtapaA
} from "./chunk-U23GPSM7.js";
import {
  DomSanitizer
} from "./chunk-A36LAIDM.js";
import {
  DestroyRef,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  input,
  isPlatformBrowser,
  of,
  output,
  signal,
  viewChild,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵqueryAdvance,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeResourceUrl,
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵviewQuerySignal
} from "./chunk-3ZDGBTDF.js";

// src/app/pages/emision-certificados/compartidos/visor-pdf.component.ts
var _c0 = ["marco"];
var _forTrack0 = ($index, $item) => $item.url;
function VisorPdfComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 1);
    \u0275\u0275text(1, "Cargando certificado...");
    \u0275\u0275elementEnd();
  }
}
function VisorPdfComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 3);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 4);
    \u0275\u0275listener("click", function VisorPdfComponent_Conditional_2_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.revision.update(ctx_r1.siguiente));
    });
    \u0275\u0275text(3, "Reintentar PDF");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.error());
  }
}
function VisorPdfComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-pdf-continuo", 5);
    \u0275\u0275listener("listo", function VisorPdfComponent_Conditional_3_Template_app_pdf_continuo_listo_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.archivoVisualizado.emit($event));
    })("fallo", function VisorPdfComponent_Conditional_3_Template_app_pdf_continuo_fallo_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.errorVisualizacion.emit($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("archivo", ctx_r1.archivoIntegrado())("ajustarAncho", ctx_r1.ajustarAncho())("textosEsperados", ctx_r1.textosEsperados())("zoom", ctx_r1.zoom());
  }
}
function VisorPdfComponent_Conditional_4_Conditional_0_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 4);
    \u0275\u0275listener("click", function VisorPdfComponent_Conditional_4_Conditional_0_Conditional_3_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.imprimir());
    });
    \u0275\u0275text(1, "Imprimir PDF");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "a", 8);
    \u0275\u0275text(3, "Abrir PDF");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275property("href", ctx_r1.url(), \u0275\u0275sanitizeUrl);
  }
}
function VisorPdfComponent_Conditional_4_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6)(1, "a", 7);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, VisorPdfComponent_Conditional_4_Conditional_0_Conditional_3_Template, 4, 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("href", ctx_r1.url(), \u0275\u0275sanitizeUrl)("download", ((tmp_4_0 = ctx_r1.archivoPrevio()) == null ? null : tmp_4_0.nombre) || "certificado.pdf");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.archivoPrevio() && !ctx_r1.persistido() ? "Descargar vista previa" : "Descargar PDF");
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r1.compacto() ? 3 : -1);
  }
}
function VisorPdfComponent_Conditional_4_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label");
    \u0275\u0275text(1, "Zoom del PDF ");
    \u0275\u0275elementStart(2, "select", 9);
    \u0275\u0275listener("change", function VisorPdfComponent_Conditional_4_Conditional_1_Template_select_change_2_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.cambiarZoom($event.target.value));
    });
    \u0275\u0275elementStart(3, "option", 10);
    \u0275\u0275text(4, "75 %");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "option", 11);
    \u0275\u0275text(6, "100 %");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "option", 12);
    \u0275\u0275text(8, "125 %");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "option", 13);
    \u0275\u0275text(10, "150 %");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "option", 14);
    \u0275\u0275text(12, "200 %");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", ctx_r1.zoom());
  }
}
function VisorPdfComponent_Conditional_4_Conditional_2_For_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "iframe", 16, 0);
    \u0275\u0275listener("load", function VisorPdfComponent_Conditional_4_Conditional_2_For_1_Template_iframe_load_0_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.marcoCargado($event));
    })("error", function VisorPdfComponent_Conditional_4_Conditional_2_For_1_Template_iframe_error_0_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.marcoFallido($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const recurso_r7 = ctx.$implicit;
    \u0275\u0275property("src", recurso_r7.src, \u0275\u0275sanitizeResourceUrl);
  }
}
function VisorPdfComponent_Conditional_4_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, VisorPdfComponent_Conditional_4_Conditional_2_For_1_Template, 2, 1, "iframe", 15, _forTrack0);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275repeater(ctx_r1.recursos());
  }
}
function VisorPdfComponent_Conditional_4_Conditional_3_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 1);
    \u0275\u0275text(1, "Borrador pendiente de emisi\xF3n.");
    \u0275\u0275elementEnd();
  }
}
function VisorPdfComponent_Conditional_4_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, VisorPdfComponent_Conditional_4_Conditional_3_Conditional_0_Template, 2, 0, "p", 1);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(ctx_r1.archivoPrevio() && !ctx_r1.persistido() ? 0 : -1);
  }
}
function VisorPdfComponent_Conditional_4_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 1);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.aviso());
  }
}
function VisorPdfComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, VisorPdfComponent_Conditional_4_Conditional_0_Template, 4, 4, "div", 6)(1, VisorPdfComponent_Conditional_4_Conditional_1_Template, 13, 1, "label")(2, VisorPdfComponent_Conditional_4_Conditional_2_Template, 2, 0)(3, VisorPdfComponent_Conditional_4_Conditional_3_Template, 1, 1)(4, VisorPdfComponent_Conditional_4_Conditional_4_Template, 2, 1, "p", 1);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r1.permitirDescarga() ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.controlesZoom() ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r1.integrado() ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.mostrarDescripcion() ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.aviso() ? 4 : -1);
  }
}
var VisorPdfComponent = class _VisorPdfComponent {
  permitirDescarga = input(true);
  integrado = input(false);
  ajustarAncho = input(false);
  archivoDescargado = signal(null);
  // La entrada temporal gobierna directamente PDF.js; nunca pasa por la caché del vigente.
  archivoIntegrado = computed(() => this.archivoPrevio() ?? this.archivoDescargado());
  textosEsperados = input([]);
  archivoCargado = output();
  archivoVisualizado = output();
  errorVisualizacion = output();
  flujoFirmas = input(false);
  consultaRrhh = input(false);
  hashEsperado = input();
  persistido = input(false);
  compacto = input(false);
  controlesZoom = input(false);
  mostrarDescripcion = input(true);
  zoom = signal(100);
  archivoPrevio = input(null);
  documentoId = input(null);
  urlAdministrativa = input(null);
  urlPublica = input(null);
  codigo = input("");
  cargando = signal(false);
  error = signal(null);
  aviso = signal(null);
  url = signal(null);
  urlSegura = signal(null);
  recursos = computed(() => {
    const url = this.url();
    const src = this.urlSegura();
    return url && src ? [{ url, src }] : [];
  });
  revision = signal(0);
  siguiente = (n) => n + 1;
  marco = viewChild("marco");
  api = inject(DocumentosDigitalesService);
  sanitizer = inject(DomSanitizer);
  browser = isPlatformBrowser(inject(PLATFORM_ID));
  archivoActual = null;
  objetoIntegrado = null;
  identidadIntegrada = "";
  impresion = null;
  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.impresion?.remove();
      if (this.objetoIntegrado)
        URL.revokeObjectURL(this.objetoIntegrado);
    });
    effect((onCleanup) => {
      const administrativa = this.urlAdministrativa();
      const id = this.documentoId();
      const publico = this.urlPublica();
      const codigo = this.codigo();
      this.revision();
      const previo = this.archivoPrevio();
      const flujoFirmas = this.flujoFirmas();
      const hash = this.hashEsperado();
      const rrhh = this.consultaRrhh();
      const integrado = this.integrado();
      const identidad = `${id}|${administrativa}|${publico}|${flujoFirmas}|${rrhh}`;
      if (integrado && identidad !== this.identidadIntegrada) {
        this.identidadIntegrada = identidad;
        this.archivoActual = null;
        this.archivoDescargado.set(null);
        this.url.set(null);
        this.urlSegura.set(null);
        if (this.objetoIntegrado)
          URL.revokeObjectURL(this.objetoIntegrado);
        this.objetoIntegrado = null;
      }
      if (integrado) {
        this.error.set(null);
        this.aviso.set(null);
      }
      if (!integrado) {
        this.archivoActual = null;
        this.url.set(null);
        this.urlSegura.set(null);
        this.zoom.set(100);
        this.error.set(null);
        this.aviso.set(null);
        this.cargando.set(false);
      }
      if (!this.browser || !id && !publico && !previo)
        return;
      if (id !== null && (!Number.isSafeInteger(id) || id < 1)) {
        this.error.set("Identificador de documento inv\xE1lido.");
        return;
      }
      this.cargando.set(true);
      let objeto = null;
      let consulta;
      if (previo)
        consulta = of(previo);
      else if (id !== null && administrativa)
        consulta = this.api.archivoAdministrativo(administrativa, id, hash);
      else if (id !== null && rrhh)
        consulta = this.api.archivoRrhh(id, hash);
      else if (id !== null && (flujoFirmas || hash))
        consulta = this.api.archivo(id, flujoFirmas, hash);
      else if (id !== null)
        consulta = this.api.archivo(id);
      else
        consulta = this.api.archivoPublico(publico, codigo);
      const solicitud = consulta.subscribe({
        next: (archivo) => {
          if (integrado && archivo === this.archivoActual) {
            this.cargando.set(false);
            return;
          }
          this.archivoActual = archivo;
          if (integrado && !previo)
            this.archivoDescargado.set(archivo);
          objeto = URL.createObjectURL(archivo.blob);
          this.url.set(objeto);
          if (integrado) {
            if (this.objetoIntegrado)
              URL.revokeObjectURL(this.objetoIntegrado);
            this.objetoIntegrado = objeto;
          }
          this.urlSegura.set(this.sanitizer.bypassSecurityTrustResourceUrl(objeto));
          this.cargando.set(false);
          if (!previo)
            this.archivoCargado.emit(archivo);
        },
        error: (e) => {
          if (integrado && !previo) {
            this.archivoDescargado.set(null);
            this.url.set(null);
            this.urlSegura.set(null);
          }
          const mensaje = flujoFirmas ? mensajeEtapaA(e) : mensajeDocumento(e);
          this.error.set(mensaje);
          this.errorVisualizacion.emit(mensaje);
          this.cargando.set(false);
        }
      });
      onCleanup(() => {
        solicitud.unsubscribe();
        if (objeto && !integrado)
          URL.revokeObjectURL(objeto);
      });
    }, { allowSignalWrites: true });
  }
  marcoCargado(evento) {
    const marco = this.marco()?.nativeElement;
    if (evento.target === marco && this.archivoActual && marco?.getAttribute("src")?.split("#")[0] === this.url()) {
      this.archivoVisualizado.emit(this.archivoActual);
    }
  }
  marcoFallido(evento) {
    if (evento.target !== this.marco()?.nativeElement)
      return;
    const mensaje = "No se pudo cargar el PDF en el visor. Vuelva a solicitar la vista previa.";
    this.error.set(mensaje);
    this.errorVisualizacion.emit(mensaje);
  }
  imprimir() {
    if (this.integrado()) {
      const url = this.url();
      if (!url)
        return;
      this.impresion?.remove();
      const marco = document.createElement("iframe");
      this.impresion = marco;
      marco.style.cssText = "position:fixed;width:0;height:0;border:0";
      marco.title = "Imprimir certificado";
      marco.src = url;
      marco.onload = () => {
        marco.contentWindow?.focus();
        marco.contentWindow?.print();
      };
      marco.addEventListener("load", () => marco.contentWindow?.addEventListener("afterprint", () => marco.remove(), { once: true }), { once: true });
      document.body.append(marco);
      return;
    }
    try {
      const marco = this.marco()?.nativeElement.contentWindow;
      if (!marco)
        return;
      marco.focus();
      marco.print();
    } catch {
      this.aviso.set("Usa la opci\xF3n Imprimir del visor de PDF o abre el archivo en otra pesta\xF1a.");
    }
  }
  cambiarZoom(valor) {
    const zoom = Number(valor);
    const url = this.url();
    if (!url || ![75, 100, 125, 150, 200].includes(zoom))
      return;
    this.zoom.set(zoom);
    if (this.integrado())
      return;
    this.urlSegura.set(this.sanitizer.bypassSecurityTrustResourceUrl(`${url}#zoom=${zoom}`));
  }
  static \u0275fac = function VisorPdfComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VisorPdfComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _VisorPdfComponent, selectors: [["app-visor-pdf"]], viewQuery: function VisorPdfComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuerySignal(ctx.marco, _c0, 5);
    }
    if (rf & 2) {
      \u0275\u0275queryAdvance();
    }
  }, inputs: { permitirDescarga: [1, "permitirDescarga"], integrado: [1, "integrado"], ajustarAncho: [1, "ajustarAncho"], textosEsperados: [1, "textosEsperados"], flujoFirmas: [1, "flujoFirmas"], consultaRrhh: [1, "consultaRrhh"], hashEsperado: [1, "hashEsperado"], persistido: [1, "persistido"], compacto: [1, "compacto"], controlesZoom: [1, "controlesZoom"], mostrarDescripcion: [1, "mostrarDescripcion"], archivoPrevio: [1, "archivoPrevio"], documentoId: [1, "documentoId"], urlAdministrativa: [1, "urlAdministrativa"], urlPublica: [1, "urlPublica"], codigo: [1, "codigo"] }, outputs: { archivoCargado: "archivoCargado", archivoVisualizado: "archivoVisualizado", errorVisualizacion: "errorVisualizacion" }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 5, vars: 6, consts: [["marco", ""], ["role", "status"], [3, "archivo", "ajustarAncho", "textosEsperados", "zoom"], ["role", "alert"], ["type", "button", 1, "btn", 3, "click"], [3, "listo", "fallo", "archivo", "ajustarAncho", "textosEsperados", "zoom"], [1, "acciones"], [1, "btn", 3, "href", "download"], ["target", "_blank", "rel", "noopener", 1, "btn", 3, "href"], ["aria-label", "Zoom del PDF", 3, "change", "value"], ["value", "75"], ["value", "100"], ["value", "125"], ["value", "150"], ["value", "200"], ["title", "PDF del certificado", 3, "src"], ["title", "PDF del certificado", 3, "load", "error", "src"]], template: function VisorPdfComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section");
      \u0275\u0275template(1, VisorPdfComponent_Conditional_1_Template, 2, 0, "p", 1)(2, VisorPdfComponent_Conditional_2_Template, 4, 1)(3, VisorPdfComponent_Conditional_3_Template, 1, 4, "app-pdf-continuo", 2)(4, VisorPdfComponent_Conditional_4_Template, 5, 5);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_5_0;
      \u0275\u0275attribute("aria-label", ctx.archivoPrevio() && !ctx.persistido() ? "Vista previa PDF no emitida" : "PDF del certificado")("aria-busy", ctx.cargando());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.cargando() ? 1 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.error() ? 2 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.integrado() ? 3 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_5_0 = ctx.urlSegura()) ? 4 : -1, tmp_5_0);
    }
  }, dependencies: [PdfContinuoComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\niframe[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 72vh;\n  min-height: 24rem;\n  border: 1px solid #d5dee8;\n  border-radius: 0.5rem;\n  background: #fff;\n}\n.acciones[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n  margin-block: 1rem;\n}\np[_ngcontent-%COMP%] {\n  overflow-wrap: anywhere;\n}\n@media (max-width: 600px) {\n  iframe[_ngcontent-%COMP%] {\n    height: 65vh;\n    min-height: 18rem;\n  }\n}\n/*# sourceMappingURL=visor-pdf.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VisorPdfComponent, { className: "VisorPdfComponent", filePath: "src\\app\\pages\\emision-certificados\\compartidos\\visor-pdf.component.ts", lineNumber: 35 });
})();

export {
  VisorPdfComponent
};
//# sourceMappingURL=chunk-SHX4IWTT.js.map
