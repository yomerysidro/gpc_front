import './polyfills.server.mjs';
import {
  PreparacionOrigenComponent
} from "./chunk-PKF3BBPE.mjs";
import "./chunk-BFRYA4IX.mjs";
import "./chunk-FBTDJ3RZ.mjs";
import "./chunk-ZLU2ZG5B.mjs";
import "./chunk-ZIVCKBVU.mjs";
import {
  mensajeEtapaA
} from "./chunk-R23RR7XQ.mjs";
import {
  ActivatedRoute,
  RouterLink
} from "./chunk-OX7VSSQH.mjs";
import "./chunk-VNKXA6HD.mjs";
import "./chunk-NP7M7R34.mjs";
import {
  EmisionCertificadosService
} from "./chunk-UOKIJFGD.mjs";
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
  DestroyRef,
  finalize,
  inject,
  signal,
  timeout,
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
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-OYAKRC2F.mjs";
import "./chunk-X7LY3JHO.mjs";

// src/app/pages/emision-certificados/generar-emitir/preparar-reconocimiento.component.ts
function PrepararReconocimientoComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 0);
    \u0275\u0275text(1, "Cargando reconocimiento\u2026");
    \u0275\u0275elementEnd();
  }
}
function PrepararReconocimientoComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 1)(1, "h1");
    \u0275\u0275text(2, "Preparar reconocimiento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 3);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "a", 4);
    \u0275\u0275text(6, "Volver a la lista");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 5);
    \u0275\u0275listener("click", function PrepararReconocimientoComponent_Conditional_1_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cargar());
    });
    \u0275\u0275text(8, "Actualizar estado");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.error());
    \u0275\u0275advance();
    \u0275\u0275property("queryParams", ctx_r1.retorno);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.cargando());
  }
}
function PrepararReconocimientoComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-preparacion-origen", 2);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("ponente", ctx)("asistente", true)("retorno", ctx_r1.retorno);
  }
}
var PrepararReconocimientoComponent = class _PrepararReconocimientoComponent {
  route = inject(ActivatedRoute);
  api = inject(EmisionCertificadosService);
  destroy = inject(DestroyRef);
  consulta;
  evaluacion = signal(null);
  cargando = signal(false);
  error = signal("");
  // El contexto de sesión se utiliza exclusivamente para regresar, nunca para preparar.
  get retorno() {
    return this.contextoRetorno();
  }
  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroy)).subscribe(() => this.cargar());
  }
  contextoRetorno() {
    const q = this.route.snapshot.queryParamMap;
    const actividad = Number(this.route.snapshot.paramMap.get("actividadId"));
    const sesion = q.get("id_sesion");
    return q.get("modalidad") === "sesion" && q.get("id_actividad") === String(actividad) && /^[1-9]\d*$/.test(sesion ?? "") && Number.isSafeInteger(Number(sesion)) ? { origen: "participacion", modalidad: "sesion", id_actividad: actividad, id_sesion: sesion } : { origen_documental: "reconocimiento", actividad_reconocimiento: actividad };
  }
  cargar() {
    this.consulta?.unsubscribe();
    this.cargando.set(false);
    this.error.set("");
    this.evaluacion.set(null);
    const actividad = this.route.snapshot.paramMap.get("actividadId");
    const ponente = this.route.snapshot.paramMap.get("ponenteId");
    if (![actividad, ponente].every((id) => /^[1-9]\d*$/.test(id ?? "") && Number.isSafeInteger(Number(id)))) {
      this.error.set("El reconocimiento solicitado no es v\xE1lido.");
      return;
    }
    this.cargando.set(true);
    this.consulta = this.api.ponentesActividad(Number(actividad)).pipe(timeout(3e4), takeUntilDestroyed(this.destroy), finalize(() => this.cargando.set(false))).subscribe({
      next: (d) => {
        const p = d.ponentes.find((f) => f.id_actividad_ponente === Number(ponente));
        const e = p?.reconocimiento;
        if (!p || !e || e.id_origen !== Number(ponente) || e.id_actividad !== Number(actividad) || e.id_persona !== p.id_persona || e.origen !== "ponente_actividad" || e.modalidad_reconocimiento !== "actividad" || e.id_sesion !== null) {
          this.error.set("No se encontr\xF3 el reconocimiento en esta actividad.");
          return;
        }
        this.evaluacion.set(e);
      },
      error: (e) => this.error.set(e.status === 409 ? e.mensaje : mensajeEtapaA(e))
    });
  }
  static \u0275fac = function PrepararReconocimientoComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PrepararReconocimientoComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PrepararReconocimientoComponent, selectors: [["app-preparar-reconocimiento"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 3, vars: 3, consts: [["role", "status"], [1, "card"], ["origen", "reconocimiento", 3, "ponente", "asistente", "retorno"], ["role", "alert"], ["routerLink", "/certificaciones/generar-emitir", 1, "btn", 3, "queryParams"], ["type", "button", 1, "btn", 3, "click", "disabled"]], template: function PrepararReconocimientoComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275template(0, PrepararReconocimientoComponent_Conditional_0_Template, 2, 0, "p", 0)(1, PrepararReconocimientoComponent_Conditional_1_Template, 9, 3, "section", 1)(2, PrepararReconocimientoComponent_Conditional_2_Template, 1, 3, "app-preparacion-origen", 2);
    }
    if (rf & 2) {
      let tmp_2_0;
      \u0275\u0275conditional(ctx.cargando() ? 0 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.error() ? 1 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_2_0 = ctx.evaluacion()) ? 2 : -1, tmp_2_0);
    }
  }, dependencies: [PreparacionOrigenComponent, RouterLink], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PrepararReconocimientoComponent, { className: "PrepararReconocimientoComponent", filePath: "src\\app\\pages\\emision-certificados\\generar-emitir\\preparar-reconocimiento.component.ts", lineNumber: 18 });
})();
export {
  PrepararReconocimientoComponent
};
//# sourceMappingURL=chunk-O2BHEBYZ.mjs.map
