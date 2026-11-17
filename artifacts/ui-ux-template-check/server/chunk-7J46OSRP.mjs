import './polyfills.server.mjs';
import {
  PreparacionOrigenComponent
} from "./chunk-PKF3BBPE.mjs";
import "./chunk-BFRYA4IX.mjs";
import "./chunk-FBTDJ3RZ.mjs";
import "./chunk-ZLU2ZG5B.mjs";
import "./chunk-ZIVCKBVU.mjs";
import {
  DocumentosDigitalesService,
  mensajeEtapaA
} from "./chunk-R23RR7XQ.mjs";
import {
  Router,
  RouterLink
} from "./chunk-OX7VSSQH.mjs";
import "./chunk-VNKXA6HD.mjs";
import "./chunk-NP7M7R34.mjs";
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
  DestroyRef,
  finalize,
  inject,
  signal,
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

// src/app/pages/emision-certificados/generar-emitir/preparar-reconocimiento-sesion.component.ts
function PrepararReconocimientoSesionComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-preparacion-origen", 0);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("ponente", ctx)("asistente", true)("retorno", ctx_r0.retorno)("evaluacionVigente", ctx_r0.vigente())("consultaExterna", true)("consultaPendiente", ctx_r0.cargando() || !!ctx_r0.error())("documentoRecuperado", ctx_r0.documento());
  }
}
function PrepararReconocimientoSesionComponent_Conditional_1_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 2);
    \u0275\u0275text(1, "Recuperando informaci\xF3n del ponente\u2026");
    \u0275\u0275elementEnd();
  }
}
function PrepararReconocimientoSesionComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 1)(1, "h1");
    \u0275\u0275text(2, "Preparar reconocimiento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "a", 3);
    \u0275\u0275text(4, "Volver a la lista");
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, PrepararReconocimientoSesionComponent_Conditional_1_Conditional_5_Template, 2, 0, "p", 2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275property("queryParams", ctx_r0.retorno);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.cargando() ? 5 : -1);
  }
}
function PrepararReconocimientoSesionComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 2);
    \u0275\u0275text(1, "Consultando preparaci\xF3n guardada\u2026");
    \u0275\u0275elementEnd();
  }
}
function PrepararReconocimientoSesionComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 4);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 5);
    \u0275\u0275listener("click", function PrepararReconocimientoSesionComponent_Conditional_3_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.cargar());
    });
    \u0275\u0275text(3, "Reintentar consulta");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.error());
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.cargando());
  }
}
var PrepararReconocimientoSesionComponent = class _PrepararReconocimientoSesionComponent {
  router = inject(Router);
  documentos = inject(DocumentosDigitalesService);
  destroy = inject(DestroyRef);
  consulta;
  // No reutilizar history.state en recargas ni navegaciones del historial.
  contexto = (() => {
    const navegacion = this.router.getCurrentNavigation();
    return navegacion?.trigger === "imperative" && navegacion.previousNavigation ? navegacion.extras.state?.["reconocimientoSesion"] : void 0;
  })();
  evaluacion = signal(null);
  vigente = signal(null);
  documento = signal(null);
  cargando = signal(false);
  error = signal("");
  get retorno() {
    const e = this.contexto;
    return e ? {
      origen: "ponente_sesion",
      modalidad: "sesion",
      id_actividad: e.id_actividad,
      id_sesion: e.id_sesion,
      id_tipo_certificado: e.id_tipo_certificado
    } : { origen_documental: "reconocimiento" };
  }
  constructor() {
    this.cargar();
  }
  contextoValido(e) {
    return !!e && e.origen === "ponente_sesion" && e.modalidad_reconocimiento === "sesion" && e.id_actividad_ponente === e.id_origen && [e.id_origen, e.id_sesion, e.id_actividad, e.id_persona, e.id_persona_ponente, e.id_tipo_certificado].every((id) => Number.isSafeInteger(id) && Number(id) > 0);
  }
  coincide(e) {
    const contexto = this.contexto;
    return !!contexto && e.origen === "ponente_sesion" && e.modalidad_reconocimiento === "sesion" && e.id_origen === contexto.id_origen && e.id_actividad_ponente === contexto.id_actividad_ponente && e.id_sesion === contexto.id_sesion && e.id_actividad === contexto.id_actividad && e.id_persona === contexto.id_persona && e.id_tipo_certificado === contexto.id_tipo_certificado;
  }
  cargar() {
    this.consulta?.unsubscribe();
    this.cargando.set(false);
    this.error.set("");
    const contexto = this.contexto;
    if (!this.contextoValido(contexto)) {
      this.evaluacion.set(null);
      this.vigente.set(null);
      this.documento.set(null);
      void this.router.navigate(["/certificaciones/generar-emitir"], {
        replaceUrl: true,
        queryParams: { origen_documental: "reconocimiento" },
        state: { seleccionarPonente: true }
      });
      return;
    }
    if (!this.evaluacion())
      this.evaluacion.set(contexto);
    this.cargando.set(true);
    this.consulta = this.documentos.consultarReconocimientoSesion(contexto.id_origen, contexto.id_sesion).pipe(takeUntilDestroyed(this.destroy), finalize(() => this.cargando.set(false))).subscribe({
      next: (resultado) => {
        const guardado = "id_certificado_documento" in resultado ? resultado : null;
        const e = guardado ? {
          origen: "ponente_sesion",
          modalidad_reconocimiento: "sesion",
          id_origen: guardado.id_actividad_ponente,
          id_actividad_ponente: guardado.id_actividad_ponente,
          id_sesion: guardado.id_sesion,
          id_actividad: guardado.id_actividad,
          id_persona: guardado.beneficiario?.id_persona,
          id_tipo_certificado: guardado.id_tipo_certificado,
          tipo_certificado: guardado.tipo_certificado,
          nombres: guardado.beneficiario?.nombre,
          actividad: guardado.actividad ?? void 0,
          sesion: guardado.sesion ?? void 0,
          fecha_sesion: guardado.fecha_sesion,
          estado_elegibilidad: "Pendiente de validaci\xF3n",
          puede_preparar: false,
          puede_generar_pdf: false,
          puede_emitir: false,
          puede_consultar_certificado_existente: true,
          motivos_bloqueo: [],
          certificados_existentes: []
        } : resultado;
        const anterior = this.evaluacion();
        if (!this.coincide(e) || !guardado && (!Number.isSafeInteger(e.id_persona_ponente) || e.id_persona_ponente !== contexto.id_persona_ponente) || anterior && (anterior.id_persona !== e.id_persona || anterior.id_actividad !== e.id_actividad || anterior.id_tipo_certificado !== e.id_tipo_certificado) || guardado && (!Number.isSafeInteger(guardado.id_certificado_documento) || guardado.id_certificado_documento < 1 || !guardado.id_certificado)) {
          this.error.set("No se encontr\xF3 el reconocimiento en esta sesi\xF3n.");
          return;
        }
        if (!this.evaluacion())
          this.evaluacion.set(e);
        this.vigente.set(guardado ? null : e);
        this.documento.set(guardado);
      },
      error: (e) => this.error.set(e?.status === 409 ? e.mensaje || "El servidor no acredita este reconocimiento por sesi\xF3n." : mensajeEtapaA(e))
    });
  }
  static \u0275fac = function PrepararReconocimientoSesionComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PrepararReconocimientoSesionComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PrepararReconocimientoSesionComponent, selectors: [["app-preparar-reconocimiento-sesion"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 4, vars: 3, consts: [["origen", "reconocimiento", 3, "ponente", "asistente", "retorno", "evaluacionVigente", "consultaExterna", "consultaPendiente", "documentoRecuperado"], [1, "card"], ["role", "status"], ["routerLink", "/certificaciones/generar-emitir", 1, "btn", 3, "queryParams"], ["role", "alert"], ["type", "button", 1, "btn", 3, "click", "disabled"]], template: function PrepararReconocimientoSesionComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275template(0, PrepararReconocimientoSesionComponent_Conditional_0_Template, 1, 7, "app-preparacion-origen", 0)(1, PrepararReconocimientoSesionComponent_Conditional_1_Template, 6, 2, "section", 1)(2, PrepararReconocimientoSesionComponent_Conditional_2_Template, 2, 0, "small", 2)(3, PrepararReconocimientoSesionComponent_Conditional_3_Template, 4, 2);
    }
    if (rf & 2) {
      let tmp_0_0;
      \u0275\u0275conditional((tmp_0_0 = ctx.evaluacion()) ? 0 : 1, tmp_0_0);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.evaluacion() && ctx.cargando() ? 2 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.error() ? 3 : -1);
    }
  }, dependencies: [PreparacionOrigenComponent, RouterLink], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PrepararReconocimientoSesionComponent, { className: "PrepararReconocimientoSesionComponent", filePath: "src\\app\\pages\\emision-certificados\\generar-emitir\\preparar-reconocimiento-sesion.component.ts", lineNumber: 27 });
})();
export {
  PrepararReconocimientoSesionComponent
};
//# sourceMappingURL=chunk-7J46OSRP.mjs.map
