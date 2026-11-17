import './polyfills.server.mjs';
import {
  NuevaSolicitudComponent
} from "./chunk-RN2HX65Y.mjs";
import {
  BandejaSolicitudesComponent
} from "./chunk-PAQBK7OZ.mjs";
import "./chunk-SQAJJQGX.mjs";
import "./chunk-ZYTODG6T.mjs";
import "./chunk-FBNEJSMB.mjs";
import "./chunk-Y2AZ2EMT.mjs";
import "./chunk-XGG6XIOR.mjs";
import {
  ActivatedRoute,
  NavigationEnd,
  Router
} from "./chunk-OX7VSSQH.mjs";
import "./chunk-VNKXA6HD.mjs";
import {
  AuthService
} from "./chunk-NP7M7R34.mjs";
import "./chunk-UOKIJFGD.mjs";
import "./chunk-7VY3YOD2.mjs";
import "./chunk-2XE3PF63.mjs";
import "./chunk-JMI3IFFT.mjs";
import "./chunk-HFD7K63G.mjs";
import {
  takeUntilDestroyed
} from "./chunk-TSKSZVR2.mjs";
import "./chunk-TNXV45E5.mjs";
import "./chunk-SPQE7PSN.mjs";
import {
  filter,
  inject,
  signal,
  startWith,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵattribute,
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
} from "./chunk-OYAKRC2F.mjs";
import "./chunk-X7LY3JHO.mjs";

// src/app/pages/solicitudes/mis-solicitudes/mis-solicitudes.component.ts
function MisSolicitudesComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 6);
    \u0275\u0275listener("click", function MisSolicitudesComponent_Conditional_3_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.seleccionar("nueva"));
    });
    \u0275\u0275text(1, "Nueva solicitud");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275attribute("aria-selected", ctx_r1.pestana() === "nueva")("tabindex", ctx_r1.pestana() === "nueva" ? 0 : -1);
  }
}
function MisSolicitudesComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-bandeja-solicitudes", 4);
  }
}
function MisSolicitudesComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-nueva-solicitud");
  }
}
var MisSolicitudesComponent = class _MisSolicitudesComponent {
  auth = inject(AuthService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  pestana = signal("mis-solicitudes");
  formularioVisitado = signal(false);
  constructor() {
    this.router.events.pipe(filter((evento) => evento instanceof NavigationEnd), startWith(null), takeUntilDestroyed()).subscribe(() => {
      const nueva = this.route.snapshot.firstChild?.routeConfig?.path === "nueva";
      this.pestana.set(nueva ? "nueva" : "mis-solicitudes");
      if (this.router.getCurrentNavigation()?.extras.state?.["solicitudEnviada"])
        this.formularioVisitado.set(false);
      else if (nueva)
        this.formularioVisitado.set(true);
    });
  }
  seleccionar(pestana) {
    if (pestana === this.pestana() || pestana === "nueva" && !this.auth.tienePermiso("solicitudes.crear"))
      return;
    void this.router.navigate(["/solicitudes", pestana], { queryParamsHandling: "preserve" });
  }
  alTeclear(evento) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(evento.key))
      return;
    evento.preventDefault();
    const opciones = this.auth.tienePermiso("solicitudes.crear") ? ["mis-solicitudes", "nueva"] : ["mis-solicitudes"];
    const actual = opciones.findIndex((opcion) => opcion === this.pestana());
    const indice = evento.key === "Home" ? 0 : evento.key === "End" ? opciones.length - 1 : (actual + (evento.key === "ArrowLeft" ? -1 : 1) + opciones.length) % opciones.length;
    const destino = opciones[indice];
    this.seleccionar(destino);
    evento.currentTarget.querySelector("#solicitudes-tab-" + destino)?.focus();
  }
  static \u0275fac = function MisSolicitudesComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MisSolicitudesComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MisSolicitudesComponent, selectors: [["app-mis-solicitudes"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 8, vars: 8, consts: [["role", "tablist", "aria-label", "Solicitudes", 1, "pestanas", 3, "keydown"], ["type", "button", "role", "tab", "id", "solicitudes-tab-mis-solicitudes", "aria-controls", "solicitudes-panel-mis-solicitudes", 3, "click"], ["type", "button", "role", "tab", "id", "solicitudes-tab-nueva", "aria-controls", "solicitudes-panel-nueva"], ["role", "tabpanel", "id", "solicitudes-panel-mis-solicitudes", "aria-labelledby", "solicitudes-tab-mis-solicitudes", "tabindex", "0", 3, "hidden"], ["bandeja", "propias", "titulo", "Mis solicitudes"], ["role", "tabpanel", "id", "solicitudes-panel-nueva", "tabindex", "0", 3, "hidden"], ["type", "button", "role", "tab", "id", "solicitudes-tab-nueva", "aria-controls", "solicitudes-panel-nueva", 3, "click"]], template: function MisSolicitudesComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275listener("keydown", function MisSolicitudesComponent_Template_div_keydown_0_listener($event) {
        return ctx.alTeclear($event);
      });
      \u0275\u0275elementStart(1, "button", 1);
      \u0275\u0275listener("click", function MisSolicitudesComponent_Template_button_click_1_listener() {
        return ctx.seleccionar("mis-solicitudes");
      });
      \u0275\u0275text(2, "Mis solicitudes");
      \u0275\u0275elementEnd();
      \u0275\u0275template(3, MisSolicitudesComponent_Conditional_3_Template, 2, 2, "button", 2);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "section", 3);
      \u0275\u0275template(5, MisSolicitudesComponent_Conditional_5_Template, 1, 0, "app-bandeja-solicitudes", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "section", 5);
      \u0275\u0275template(7, MisSolicitudesComponent_Conditional_7_Template, 1, 0, "app-nueva-solicitud");
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275attribute("aria-selected", ctx.pestana() === "mis-solicitudes")("tabindex", ctx.pestana() === "mis-solicitudes" ? 0 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.auth.tienePermiso("solicitudes.crear") ? 3 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("hidden", ctx.pestana() !== "mis-solicitudes");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.pestana() === "mis-solicitudes" ? 5 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("hidden", ctx.pestana() !== "nueva");
      \u0275\u0275attribute("aria-labelledby", ctx.auth.tienePermiso("solicitudes.crear") ? "solicitudes-tab-nueva" : null);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.formularioVisitado() ? 7 : -1);
    }
  }, dependencies: [BandejaSolicitudesComponent, NuevaSolicitudComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\n.pestanas[_ngcontent-%COMP%] {\n  max-width: 100%;\n  overflow-x: auto;\n}\n[role=tab][_ngcontent-%COMP%] {\n  flex-shrink: 0;\n}\n/*# sourceMappingURL=gestion-tabs.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MisSolicitudesComponent, { className: "MisSolicitudesComponent", filePath: "src\\app\\pages\\solicitudes\\mis-solicitudes\\mis-solicitudes.component.ts", lineNumber: 16 });
})();
export {
  MisSolicitudesComponent
};
//# sourceMappingURL=chunk-VA4EDYNN.mjs.map
