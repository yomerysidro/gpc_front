import {
  PrivateLayoutComponent
} from "./chunk-GHLQTI6W.js";
import "./chunk-4QPZ4ZWF.js";
import {
  RouterOutlet
} from "./chunk-A36LAIDM.js";
import {
  AuthService
} from "./chunk-W2463ZNS.js";
import {
  takeUntilDestroyed
} from "./chunk-IJ23LC2U.js";
import {
  DestroyRef,
  afterNextRender,
  catchError,
  finalize,
  inject,
  of,
  signal,
  timeout,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵtemplate,
  ɵɵtext
} from "./chunk-3ZDGBTDF.js";
import "./chunk-ZX6IUAQ5.js";

// src/app/pages/portal-certificados/portal-certificados-layout.component.ts
function PortalCertificadosLayoutComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "header");
    \u0275\u0275element(1, "img", 0);
    \u0275\u0275text(2, " Municipalidad Distrital de Morales");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 1);
    \u0275\u0275text(4, "Cargando Portal P\xFAblico de Certificados\u2026");
    \u0275\u0275elementEnd();
  }
}
function PortalCertificadosLayoutComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-private-layout");
  }
}
function PortalCertificadosLayoutComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "router-outlet");
  }
}
var PortalCertificadosLayoutComponent = class _PortalCertificadosLayoutComponent {
  auth = inject(AuthService, { optional: true });
  sesionConsultada = signal(!this.auth || this.auth.isAuthenticated());
  destroy = inject(DestroyRef);
  constructor() {
    afterNextRender(() => {
      if (!this.auth || this.auth.isAuthenticated()) {
        this.sesionConsultada.set(true);
        return;
      }
      this.auth.cargarSesion().pipe(timeout(1e4), catchError(() => of(false)), takeUntilDestroyed(this.destroy), finalize(() => this.sesionConsultada.set(true))).subscribe();
    });
  }
  static \u0275fac = function PortalCertificadosLayoutComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PortalCertificadosLayoutComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PortalCertificadosLayoutComponent, selectors: [["app-portal-certificados-layout"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 3, vars: 1, consts: [["src", "/marca/escudo-160.webp", "alt", "Escudo municipal", "width", "64", "height", "72"], ["role", "status"]], template: function PortalCertificadosLayoutComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275template(0, PortalCertificadosLayoutComponent_Conditional_0_Template, 5, 0)(1, PortalCertificadosLayoutComponent_Conditional_1_Template, 1, 0, "app-private-layout")(2, PortalCertificadosLayoutComponent_Conditional_2_Template, 1, 0, "router-outlet");
    }
    if (rf & 2) {
      \u0275\u0275conditional(!ctx.sesionConsultada() ? 0 : (ctx.auth == null ? null : ctx.auth.isAuthenticated()) ? 1 : 2);
    }
  }, dependencies: [RouterOutlet, PrivateLayoutComponent], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PortalCertificadosLayoutComponent, { className: "PortalCertificadosLayoutComponent", filePath: "src\\app\\pages\\portal-certificados\\portal-certificados-layout.component.ts", lineNumber: 17 });
})();
export {
  PortalCertificadosLayoutComponent
};
//# sourceMappingURL=chunk-D5J5TZ5S.js.map
