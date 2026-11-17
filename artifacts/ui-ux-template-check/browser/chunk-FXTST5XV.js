import {
  PortalCertificadosComponent
} from "./chunk-UIWCC7U3.js";
import {
  ListadoEmisionComponent
} from "./chunk-DVPHOQBJ.js";
import "./chunk-QBYYVWAN.js";
import "./chunk-GSJP3MML.js";
import "./chunk-U23GPSM7.js";
import "./chunk-BKELQIVX.js";
import "./chunk-4FUGVTHD.js";
import "./chunk-RJ22SAW5.js";
import "./chunk-Y2YHKMWP.js";
import "./chunk-A36LAIDM.js";
import "./chunk-W2463ZNS.js";
import "./chunk-C4J44J4Z.js";
import "./chunk-LSGUT5KG.js";
import "./chunk-7PBBQCKX.js";
import "./chunk-IJ23LC2U.js";
import "./chunk-YLHEVWGL.js";
import {
  signal,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵproperty,
  ɵɵtemplate,
  ɵɵtext
} from "./chunk-3ZDGBTDF.js";
import "./chunk-ZX6IUAQ5.js";

// src/app/pages/emision-certificados/verificacion/consultar-certificado/consultar-certificado.component.ts
function ConsultarCertificadoComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 1)(1, "h2");
    \u0275\u0275text(2, "Historial de consultas");
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "app-listado-emision", 2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275property("soloLectura", true);
  }
}
var ConsultarCertificadoComponent = class _ConsultarCertificadoComponent {
  historial = signal(false);
  static \u0275fac = function ConsultarCertificadoComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ConsultarCertificadoComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ConsultarCertificadoComponent, selectors: [["app-consultar-certificado"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 4, vars: 2, consts: [["type", "button", "aria-controls", "historial-consultas", 1, "btn", 3, "click"], ["id", "historial-consultas", 1, "detalle"], ["recurso", "consultas-certificado", 3, "soloLectura"]], template: function ConsultarCertificadoComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "app-portal-certificados");
      \u0275\u0275elementStart(1, "button", 0);
      \u0275\u0275listener("click", function ConsultarCertificadoComponent_Template_button_click_1_listener() {
        return ctx.historial.set(!ctx.historial());
      });
      \u0275\u0275text(2, "Historial administrativo de consultas");
      \u0275\u0275elementEnd();
      \u0275\u0275template(3, ConsultarCertificadoComponent_Conditional_3_Template, 4, 1, "section", 1);
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275attribute("aria-expanded", ctx.historial());
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.historial() ? 3 : -1);
    }
  }, dependencies: [PortalCertificadosComponent, ListadoEmisionComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.encabezado[_ngcontent-%COMP%], \n.acciones[_ngcontent-%COMP%], \n.paginacion[_ngcontent-%COMP%], \n.filtros[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: var(--espacio-3);\n}\n.encabezado[_ngcontent-%COMP%] {\n  justify-content: space-between;\n  margin-bottom: var(--espacio-4);\n}\n.acciones[_ngcontent-%COMP%], \n.filtros[_ngcontent-%COMP%], \n.paginacion[_ngcontent-%COMP%] {\n  margin-block: var(--espacio-4);\n}\n.tabla[_ngcontent-%COMP%] {\n  overflow-x: auto;\n}\n.grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));\n  gap: var(--espacio-4);\n}\n.form-field[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.detalle[_ngcontent-%COMP%] {\n  margin-block: var(--espacio-5);\n}\ndt[_ngcontent-%COMP%] {\n  color: var(--neutro-500);\n  font-size: 0.875rem;\n}\ndd[_ngcontent-%COMP%] {\n  margin: 0 0 var(--espacio-3);\n  overflow-wrap: anywhere;\n}\n.nota[_ngcontent-%COMP%] {\n  color: var(--neutro-700);\n  font-size: 0.875rem;\n}\n.table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  overflow-wrap: anywhere;\n}\n.errores[_ngcontent-%COMP%] {\n  color: var(--color-error);\n}\n.reconocimiento[_ngcontent-%COMP%] {\n  border-top: 3px solid var(--boton-dorado);\n  overflow-wrap: anywhere;\n}\n.reconocimiento[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin-top: var(--espacio-4);\n  font-size: 1.25rem;\n}\n/*# sourceMappingURL=emision.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ConsultarCertificadoComponent, { className: "ConsultarCertificadoComponent", filePath: "src\\app\\pages\\emision-certificados\\verificacion\\consultar-certificado\\consultar-certificado.component.ts", lineNumber: 11 });
})();
export {
  ConsultarCertificadoComponent
};
//# sourceMappingURL=chunk-FXTST5XV.js.map
