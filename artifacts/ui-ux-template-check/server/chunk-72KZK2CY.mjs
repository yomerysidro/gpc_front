import './polyfills.server.mjs';
import {
  ListadoEmisionComponent
} from "./chunk-3GIIWH3N.mjs";
import "./chunk-TL467TQE.mjs";
import "./chunk-PM6SETE6.mjs";
import "./chunk-Y2AZ2EMT.mjs";
import {
  PageTitleComponent
} from "./chunk-XGG6XIOR.mjs";
import {
  RouterLink
} from "./chunk-OX7VSSQH.mjs";
import "./chunk-VNKXA6HD.mjs";
import "./chunk-NP7M7R34.mjs";
import "./chunk-UOKIJFGD.mjs";
import "./chunk-7VY3YOD2.mjs";
import "./chunk-2XE3PF63.mjs";
import "./chunk-JMI3IFFT.mjs";
import "./chunk-HFD7K63G.mjs";
import "./chunk-TSKSZVR2.mjs";
import "./chunk-TNXV45E5.mjs";
import "./chunk-SPQE7PSN.mjs";
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
} from "./chunk-OYAKRC2F.mjs";
import "./chunk-X7LY3JHO.mjs";

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
//# sourceMappingURL=chunk-72KZK2CY.mjs.map
