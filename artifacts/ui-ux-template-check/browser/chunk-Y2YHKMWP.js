import {
  Injector,
  afterNextRender,
  inject,
  input,
  output,
  viewChild,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵqueryAdvance,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵviewQuerySignal
} from "./chunk-3ZDGBTDF.js";

// src/app/shared/components/dialogo/dialogo.component.ts
var _c0 = ["dialogo"];
var _c1 = ["*"];
function DialogoComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 4);
    \u0275\u0275listener("click", function DialogoComponent_Conditional_4_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.solicitarCierre());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 5);
    \u0275\u0275element(2, "path", 6);
    \u0275\u0275elementEnd()();
  }
}
var siguienteId = 0;
var DialogoComponent = class _DialogoComponent {
  titulo = input.required();
  /** id del texto que describe el diálogo (aria-describedby), si lo hay. */
  idDescripcion = input(null);
  /** Se emite al cerrarse por cualquier vía (botón, Esc). */
  cerrado = output();
  mostrarCerrar = input(false);
  cierreControlado = input(false);
  cierreSolicitado = output();
  solicitarCierre(evento) {
    if (this.cierreControlado()) {
      evento?.preventDefault();
      this.cierreSolicitado.emit();
    } else if (!evento)
      this.cerrar();
  }
  idTitulo = `dialogo-titulo-${++siguienteId}`;
  dialogo = viewChild.required("dialogo");
  injector = inject(Injector);
  abrir() {
    afterNextRender(() => {
      const dialogo = this.dialogo().nativeElement;
      if (!dialogo.open)
        dialogo.showModal();
    }, { injector: this.injector });
  }
  cerrar() {
    this.dialogo().nativeElement.close();
  }
  static \u0275fac = function DialogoComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DialogoComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DialogoComponent, selectors: [["app-dialogo"]], viewQuery: function DialogoComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuerySignal(ctx.dialogo, _c0, 5);
    }
    if (rf & 2) {
      \u0275\u0275queryAdvance();
    }
  }, inputs: { titulo: [1, "titulo"], idDescripcion: [1, "idDescripcion"], mostrarCerrar: [1, "mostrarCerrar"], cierreControlado: [1, "cierreControlado"] }, outputs: { cerrado: "cerrado", cierreSolicitado: "cierreSolicitado" }, standalone: true, features: [\u0275\u0275StandaloneFeature], ngContentSelectors: _c1, decls: 6, vars: 7, consts: [["dialogo", ""], [1, "dialogo", 3, "close", "cancel"], [3, "id"], ["type", "button", "title", "Cerrar ventana", "aria-label", "Cerrar ventana", 1, "dialogo-cerrar"], ["type", "button", "title", "Cerrar ventana", "aria-label", "Cerrar ventana", 1, "dialogo-cerrar", 3, "click"], ["viewBox", "0 0 24 24", "aria-hidden", "true"], ["d", "m6 6 12 12M18 6 6 18"]], template: function DialogoComponent_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275projectionDef();
      \u0275\u0275elementStart(0, "dialog", 1, 0);
      \u0275\u0275listener("close", function DialogoComponent_Template_dialog_close_0_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.cerrado.emit());
      })("cancel", function DialogoComponent_Template_dialog_cancel_0_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.solicitarCierre($event));
      });
      \u0275\u0275elementStart(2, "h2", 2);
      \u0275\u0275text(3);
      \u0275\u0275elementEnd();
      \u0275\u0275template(4, DialogoComponent_Conditional_4_Template, 3, 0, "button", 3);
      \u0275\u0275projection(5);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275attribute("aria-labelledby", ctx.idTitulo)("aria-describedby", ctx.idDescripcion());
      \u0275\u0275advance(2);
      \u0275\u0275classProp("con-cierre", ctx.mostrarCerrar());
      \u0275\u0275property("id", ctx.idTitulo);
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.titulo());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.mostrarCerrar() ? 4 : -1);
    }
  }, styles: ["\n\n[_nghost-%COMP%] {\n  display: contents;\n}\n.con-cierre[_ngcontent-%COMP%] {\n  padding-right: 2.5rem;\n}\n.dialogo-cerrar[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.75rem;\n  right: 0.75rem;\n  display: grid;\n  place-items: center;\n  width: 2.5rem;\n  height: 2.5rem;\n  border: 0;\n  border-radius: var(--radio-sm);\n  background: var(--neutro-50);\n  color: var(--color-primario);\n  cursor: pointer;\n}\n.dialogo-cerrar[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 1.25rem;\n  fill: none;\n  stroke: currentColor;\n  stroke-width: 2;\n}\n.dialogo-cerrar[_ngcontent-%COMP%]:hover {\n  background: var(--color-primario-claro);\n}\n.dialogo-cerrar[_ngcontent-%COMP%]:focus-visible {\n  outline: 3px solid var(--color-primario);\n}\n/*# sourceMappingURL=dialogo.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DialogoComponent, { className: "DialogoComponent", filePath: "src\\app\\shared\\components\\dialogo\\dialogo.component.ts", lineNumber: 17 });
})();

export {
  DialogoComponent
};
//# sourceMappingURL=chunk-Y2YHKMWP.js.map
