import {
  FormularioEmisionComponent
} from "./chunk-QBYYVWAN.js";
import "./chunk-4FUGVTHD.js";
import "./chunk-RJ22SAW5.js";
import {
  PageTitleComponent
} from "./chunk-YHURBVQM.js";
import {
  ActivatedRoute,
  Router
} from "./chunk-A36LAIDM.js";
import "./chunk-W2463ZNS.js";
import "./chunk-C4J44J4Z.js";
import "./chunk-LSGUT5KG.js";
import "./chunk-7PBBQCKX.js";
import {
  toSignal
} from "./chunk-IJ23LC2U.js";
import "./chunk-YLHEVWGL.js";
import {
  computed,
  inject,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext
} from "./chunk-3ZDGBTDF.js";
import "./chunk-ZX6IUAQ5.js";

// src/app/pages/emision-certificados/reconocimientos/formulario-reconocimiento/formulario-reconocimiento.component.ts
function FormularioReconocimientoComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-formulario-emision", 4);
    \u0275\u0275listener("guardado", function FormularioReconocimientoComponent_Conditional_3_Template_app_formulario_emision_guardado_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.guardado());
    })("cancelar", function FormularioReconocimientoComponent_Conditional_3_Template_app_formulario_emision_cancelar_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.volver());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("id", ctx_r1.id());
  }
}
function FormularioReconocimientoComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 3);
    \u0275\u0275text(1, "El identificador no es v\xE1lido.");
    \u0275\u0275elementEnd();
  }
}
var FormularioReconocimientoComponent = class _FormularioReconocimientoComponent {
  router = inject(Router);
  parametros = toSignal(inject(ActivatedRoute).paramMap, { requireSync: true });
  id = computed(() => this.parametros().has("id") ? Number(this.parametros().get("id")) : null);
  guardado() {
    void this.router.navigateByUrl("/certificaciones/reconocimientos", { state: { mensaje: this.id() === null ? "Reconocimiento registrado correctamente." : "Reconocimiento actualizado correctamente." } });
  }
  volver() {
    void this.router.navigateByUrl("/certificaciones/reconocimientos");
  }
  static \u0275fac = function FormularioReconocimientoComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FormularioReconocimientoComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FormularioReconocimientoComponent, selectors: [["app-formulario-reconocimiento"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 5, vars: 2, consts: [[3, "title"], [1, "nota"], ["recurso", "reconocimientos", 3, "id"], ["role", "alert", 1, "alert", "alert-error"], ["recurso", "reconocimientos", 3, "guardado", "cancelar", "id"]], template: function FormularioReconocimientoComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "app-page-title", 0);
      \u0275\u0275elementStart(1, "p", 1);
      \u0275\u0275text(2, "Selecciona un trabajador ya registrado en Gesti\xF3n. Este formulario registra \xFAnicamente el reconocimiento.");
      \u0275\u0275elementEnd();
      \u0275\u0275template(3, FormularioReconocimientoComponent_Conditional_3_Template, 1, 1, "app-formulario-emision", 2)(4, FormularioReconocimientoComponent_Conditional_4_Template, 2, 0, "p", 3);
    }
    if (rf & 2) {
      \u0275\u0275property("title", ctx.id() === null ? "Registrar reconocimiento" : "Editar reconocimiento");
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.id() === null || ctx.id() > 0 && ctx.id() % 1 === 0 ? 3 : 4);
    }
  }, dependencies: [PageTitleComponent, FormularioEmisionComponent], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FormularioReconocimientoComponent, { className: "FormularioReconocimientoComponent", filePath: "src\\app\\pages\\emision-certificados\\reconocimientos\\formulario-reconocimiento\\formulario-reconocimiento.component.ts", lineNumber: 11 });
})();
export {
  FormularioReconocimientoComponent
};
//# sourceMappingURL=chunk-JW6ZPWFK.js.map
