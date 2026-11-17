import {
  input,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-3ZDGBTDF.js";

// src/app/shared/components/page-title/page-title.component.ts
var PageTitleComponent = class _PageTitleComponent {
  title = input.required();
  static \u0275fac = function PageTitleComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PageTitleComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PageTitleComponent, selectors: [["app-page-title"]], inputs: { title: [1, "title"] }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 2, vars: 1, template: function PageTitleComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "h1");
      \u0275\u0275text(1);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.title());
    }
  }, styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\nh1[_ngcontent-%COMP%] {\n  color: var(--azul-oscuro);\n  font-size: clamp(1.35rem, 1.7vw, 1.8rem);\n  overflow-wrap: anywhere;\n}\n/*# sourceMappingURL=page-title.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PageTitleComponent, { className: "PageTitleComponent", filePath: "src\\app\\shared\\components\\page-title\\page-title.component.ts", lineNumber: 11 });
})();

export {
  PageTitleComponent
};
//# sourceMappingURL=chunk-YHURBVQM.js.map
