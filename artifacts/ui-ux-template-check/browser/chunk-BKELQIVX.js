import {
  DialogoComponent
} from "./chunk-Y2YHKMWP.js";
import {
  input,
  viewChild,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵproperty,
  ɵɵqueryAdvance,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵviewQuerySignal
} from "./chunk-3ZDGBTDF.js";

// src/app/shared/components/dialogo-confirmacion/dialogo-confirmacion.component.ts
var siguienteId = 0;
var DialogoConfirmacionComponent = class _DialogoConfirmacionComponent {
  titulo = input.required();
  texto = input.required();
  confirmar = input("Confirmar");
  cancelar = input("Cancelar");
  idTexto = `confirmacion-texto-${++siguienteId}`;
  dialogo = viewChild.required(DialogoComponent);
  resolver = null;
  abrir() {
    this.resolver?.(false);
    this.dialogo().abrir();
    return new Promise((resolve) => this.resolver = resolve);
  }
  responder(respuesta) {
    const resolver = this.resolver;
    this.resolver = null;
    this.dialogo().cerrar();
    resolver?.(respuesta);
  }
  /** Esc o cierre externo cuentan como cancelar. */
  alCerrar() {
    const resolver = this.resolver;
    this.resolver = null;
    resolver?.(false);
  }
  static \u0275fac = function DialogoConfirmacionComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DialogoConfirmacionComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DialogoConfirmacionComponent, selectors: [["app-dialogo-confirmacion"]], viewQuery: function DialogoConfirmacionComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuerySignal(ctx.dialogo, DialogoComponent, 5);
    }
    if (rf & 2) {
      \u0275\u0275queryAdvance();
    }
  }, inputs: { titulo: [1, "titulo"], texto: [1, "texto"], confirmar: [1, "confirmar"], cancelar: [1, "cancelar"] }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 8, vars: 6, consts: [[3, "cerrado", "titulo", "idDescripcion"], [3, "id"], [1, "dialogo-acciones"], ["type", "button", "autofocus", "", 1, "btn", 3, "click"], ["type", "button", 1, "btn", "btn-primary", 3, "click"]], template: function DialogoConfirmacionComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "app-dialogo", 0);
      \u0275\u0275listener("cerrado", function DialogoConfirmacionComponent_Template_app_dialogo_cerrado_0_listener() {
        return ctx.alCerrar();
      });
      \u0275\u0275elementStart(1, "p", 1);
      \u0275\u0275text(2);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "div", 2)(4, "button", 3);
      \u0275\u0275listener("click", function DialogoConfirmacionComponent_Template_button_click_4_listener() {
        return ctx.responder(false);
      });
      \u0275\u0275text(5);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "button", 4);
      \u0275\u0275listener("click", function DialogoConfirmacionComponent_Template_button_click_6_listener() {
        return ctx.responder(true);
      });
      \u0275\u0275text(7);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275property("titulo", ctx.titulo())("idDescripcion", ctx.idTexto);
      \u0275\u0275advance();
      \u0275\u0275property("id", ctx.idTexto);
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.texto());
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.cancelar());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.confirmar());
    }
  }, dependencies: [DialogoComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: contents;\n}\n/*# sourceMappingURL=dialogo-confirmacion.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DialogoConfirmacionComponent, { className: "DialogoConfirmacionComponent", filePath: "src\\app\\shared\\components\\dialogo-confirmacion\\dialogo-confirmacion.component.ts", lineNumber: 17 });
})();

export {
  DialogoConfirmacionComponent
};
//# sourceMappingURL=chunk-BKELQIVX.js.map
