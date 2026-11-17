import {
  ListadoEmisionComponent
} from "./chunk-DVPHOQBJ.js";
import "./chunk-QBYYVWAN.js";
import "./chunk-BKELQIVX.js";
import "./chunk-4FUGVTHD.js";
import "./chunk-RJ22SAW5.js";
import "./chunk-Y2YHKMWP.js";
import {
  PageTitleComponent
} from "./chunk-YHURBVQM.js";
import {
  RouterLink
} from "./chunk-A36LAIDM.js";
import "./chunk-W2463ZNS.js";
import "./chunk-C4J44J4Z.js";
import "./chunk-LSGUT5KG.js";
import "./chunk-7PBBQCKX.js";
import "./chunk-IJ23LC2U.js";
import "./chunk-YLHEVWGL.js";
import {
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵproperty,
  ɵɵtext
} from "./chunk-3ZDGBTDF.js";
import "./chunk-ZX6IUAQ5.js";

// src/app/pages/emision-certificados/firmas/firmas-aplicadas.component.ts
var FirmasAplicadasComponent = class _FirmasAplicadasComponent {
  static \u0275fac = function FirmasAplicadasComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FirmasAplicadasComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FirmasAplicadasComponent, selectors: [["app-firmas-aplicadas"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 4, vars: 1, consts: [["title", "Firmas aplicadas"], ["routerLink", "/certificaciones/firmas", 1, "btn"], ["recurso", "certificados-firmas", 3, "soloLectura"]], template: function FirmasAplicadasComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "app-page-title", 0);
      \u0275\u0275elementStart(1, "a", 1);
      \u0275\u0275text(2, "Volver a Firmas");
      \u0275\u0275elementEnd();
      \u0275\u0275element(3, "app-listado-emision", 2);
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275property("soloLectura", true);
    }
  }, dependencies: [RouterLink, PageTitleComponent, ListadoEmisionComponent], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FirmasAplicadasComponent, { className: "FirmasAplicadasComponent", filePath: "src\\app\\pages\\emision-certificados\\firmas\\firmas-aplicadas.component.ts", lineNumber: 11 });
})();
export {
  FirmasAplicadasComponent
};
//# sourceMappingURL=chunk-WRGVKK3Z.js.map
