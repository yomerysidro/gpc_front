import './polyfills.server.mjs';
import {
  ReportesService
} from "./chunk-G3FA2AXM.mjs";
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
import {
  descargarCsv,
  mensajeReporte
} from "./chunk-3FIWDPNU.mjs";
import {
  DestroyRef,
  afterNextRender,
  catchError,
  forkJoin,
  inject,
  map,
  of,
  signal,
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
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-OYAKRC2F.mjs";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-X7LY3JHO.mjs";

// src/app/pages/reportes/indicadores-generales/indicadores-generales.component.ts
var _forTrack0 = ($index, $item) => $item.clave;
function IndicadoresGeneralesComponent_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 12);
    \u0275\u0275listener("click", function IndicadoresGeneralesComponent_Conditional_21_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.exportar());
    });
    \u0275\u0275elementStart(1, "span", 5);
    \u0275\u0275text(2, "forward_to_inbox");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, "Exportar CSV");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("disabled", !ctx_r1.puedeExportar());
  }
}
function IndicadoresGeneralesComponent_For_24_Case_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14);
    \u0275\u0275element(1, "div", 16);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275attribute("aria-label", "Consultando " + item_r3.nombre);
  }
}
function IndicadoresGeneralesComponent_For_24_Case_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "strong", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Registros existentes");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r3.valor);
  }
}
function IndicadoresGeneralesComponent_For_24_Case_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 15)(1, "span", 5);
    \u0275\u0275text(2, "error");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(item_r3.error);
  }
}
function IndicadoresGeneralesComponent_For_24_Case_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 18);
    \u0275\u0275text(1, "Sin permiso de lectura");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Requiere ", item_r3.permiso, " y reportes.ver.");
  }
}
function IndicadoresGeneralesComponent_For_24_Case_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 18);
    \u0275\u0275text(1, "Sin consultar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Usa Consultar para obtener el total.");
    \u0275\u0275elementEnd();
  }
}
function IndicadoresGeneralesComponent_For_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 10)(1, "span", 13);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h2");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, IndicadoresGeneralesComponent_For_24_Case_5_Template, 2, 1, "div", 14)(6, IndicadoresGeneralesComponent_For_24_Case_6_Template, 4, 1)(7, IndicadoresGeneralesComponent_For_24_Case_7_Template, 4, 1, "p", 15)(8, IndicadoresGeneralesComponent_For_24_Case_8_Template, 4, 1)(9, IndicadoresGeneralesComponent_For_24_Case_9_Template, 4, 0);
    \u0275\u0275elementStart(10, "details")(11, "summary");
    \u0275\u0275text(12, "Qu\xE9 cuenta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "p");
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_12_0;
    const item_r3 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r3.icono);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r3.nombre);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_12_0 = item_r3.estado) === "cargando" ? 5 : tmp_12_0 === "exito" ? 6 : tmp_12_0 === "error" ? 7 : tmp_12_0 === "sin-permiso" ? 8 : 9);
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(item_r3.regla);
  }
}
var IndicadoresGeneralesComponent = class _IndicadoresGeneralesComponent {
  servicio = inject(ReportesService);
  destroyRef = inject(DestroyRef);
  auth = inject(AuthService);
  cargando = signal(false);
  consultado = signal(false);
  definiciones = [
    { clave: "actividades", nombre: "Actividades registradas", permiso: "actividades.ver", icono: "event", regla: "Total de registros de certificado.actividad, todos los estados y fechas; cada actividad cuenta una vez." },
    { clave: "certificados", nombre: "Certificados registrados", permiso: "emision.ver", icono: "workspace_premium", regla: "Total de registros de certificado.certificado, todos los estados y fechas. No exige documento generado, firma ni entrega y no cuenta documentos de reemisi\xF3n." },
    { clave: "participaciones", nombre: "Participaciones registradas", permiso: "participantes.ver", icono: "group", regla: "Total de registros de certificado.participacion, todos los estados y fechas. Una persona en dos actividades cuenta como dos participaciones; no son personas \xFAnicas." },
    { clave: "asistencias", nombre: "Asistencias registradas", permiso: "participantes.ver", icono: "how_to_reg", regla: "Total de registros de certificado.asistencia, todos los estados y fechas; cada registro cuenta una vez, sin inferir ausencias ni calcular porcentajes." }
  ];
  indicadores = signal(this.tarjetasIniciales());
  constructor() {
    afterNextRender(() => this.consultar());
  }
  tarjetasIniciales() {
    return this.definiciones.map((item) => __spreadProps(__spreadValues({}, item), { valor: null, error: "", estado: "pendiente" }));
  }
  consultar() {
    if (this.cargando())
      return;
    this.consultado.set(true);
    const tarjetas = this.tarjetasIniciales().map((item) => __spreadProps(__spreadValues({}, item), {
      estado: this.auth.tienePermiso("reportes.ver") && this.auth.tienePermiso(item.permiso) ? "cargando" : "sin-permiso"
    }));
    this.indicadores.set(tarjetas);
    this.cargando.set(tarjetas.some((item) => item.estado === "cargando"));
    forkJoin(tarjetas.map((item) => item.estado !== "cargando" ? of(item) : this.servicio.totalRegistrados(item.clave).pipe(map((valor) => __spreadProps(__spreadValues({}, item), { valor, estado: "exito" })), catchError((error) => of(__spreadProps(__spreadValues({}, item), { valor: null, estado: "error", error: mensajeReporte(error) })))))).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((resultado) => {
      this.indicadores.set(resultado);
      this.cargando.set(false);
    });
  }
  limpiar() {
    if (!this.cargando()) {
      this.indicadores.set(this.tarjetasIniciales());
      this.consultado.set(false);
    }
  }
  puedeExportar() {
    return !this.cargando() && this.indicadores().some((item) => item.estado === "exito");
  }
  exportar() {
    if (!this.auth.tienePermiso("reportes.exportar") || !this.puedeExportar())
      return;
    const filas = this.indicadores().filter((item) => item.estado === "exito");
    descargarCsv("indicadores-registros.csv", ["Indicador", "Total", "Criterio y alcance", "Filtros"], filas.map((item) => [item.nombre, item.valor, item.regla, "Sin filtros; alcance autorizado del usuario"]));
  }
  static \u0275fac = function IndicadoresGeneralesComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _IndicadoresGeneralesComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _IndicadoresGeneralesComponent, selectors: [["app-indicadores-generales"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 34, vars: 5, consts: [[1, "reporte"], [1, "eyebrow"], [1, "subtitulo"], ["aria-label", "Acciones de indicadores", 1, "acciones"], [1, "btn", "btn-primario", 3, "click", "disabled"], ["aria-hidden", "true", 1, "material-symbols-outlined"], [1, "btn", "btn-secundario", 3, "click", "disabled"], [1, "btn", "btn-neutro", 3, "click", "disabled"], [1, "btn", "btn-exportar", 3, "disabled"], ["aria-label", "Indicadores de registros", 1, "tarjetas"], [1, "tarjeta"], [1, "aviso", "informacion"], [1, "btn", "btn-exportar", 3, "click", "disabled"], ["aria-hidden", "true", 1, "icono-indicador", "material-symbols-outlined"], ["role", "status"], ["role", "alert", 1, "error"], ["aria-hidden", "true", 1, "skeleton"], ["aria-live", "polite", 1, "valor"], [1, "sin-dato"]], template: function IndicadoresGeneralesComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section", 0)(1, "header")(2, "p", 1);
      \u0275\u0275text(3, "GESTI\xD3N MUNICIPAL \xB7 REPORTES");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "h1");
      \u0275\u0275text(5, "Indicadores generales");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "p", 2);
      \u0275\u0275text(7, "Totales de registros existentes dentro del alcance que tu usuario tiene permiso para consultar.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "div", 3)(9, "button", 4);
      \u0275\u0275listener("click", function IndicadoresGeneralesComponent_Template_button_click_9_listener() {
        return ctx.consultar();
      });
      \u0275\u0275elementStart(10, "span", 5);
      \u0275\u0275text(11, "bar_chart");
      \u0275\u0275elementEnd();
      \u0275\u0275text(12, "Consultar");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "button", 6);
      \u0275\u0275listener("click", function IndicadoresGeneralesComponent_Template_button_click_13_listener() {
        return ctx.consultar();
      });
      \u0275\u0275elementStart(14, "span", 5);
      \u0275\u0275text(15, "tune");
      \u0275\u0275elementEnd();
      \u0275\u0275text(16, "Actualizar");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "button", 7);
      \u0275\u0275listener("click", function IndicadoresGeneralesComponent_Template_button_click_17_listener() {
        return ctx.limpiar();
      });
      \u0275\u0275elementStart(18, "span", 5);
      \u0275\u0275text(19, "toggle_off");
      \u0275\u0275elementEnd();
      \u0275\u0275text(20, "Limpiar filtros");
      \u0275\u0275elementEnd();
      \u0275\u0275template(21, IndicadoresGeneralesComponent_Conditional_21_Template, 4, 1, "button", 8);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "div", 9);
      \u0275\u0275repeaterCreate(23, IndicadoresGeneralesComponent_For_24_Template, 15, 4, "article", 10, _forTrack0);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "aside", 11)(26, "span", 5);
      \u0275\u0275text(27, "bar_chart");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "h2");
      \u0275\u0275text(29, "Total general \xB7 sin filtros");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(30, "p");
      \u0275\u0275text(31, "Incluye todas las fechas y estados de los registros autorizados. Cada registro principal cuenta una sola vez; los totales no dependen de la paginaci\xF3n.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(32, "p");
      \u0275\u0275text(33, "Los filtros de Actividades, Certificados y Asistencia no afectan estas tarjetas. El CSV incluye solo los conteos consultados correctamente, tambi\xE9n cuando su valor es 0.");
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(9);
      \u0275\u0275property("disabled", ctx.cargando());
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.cargando());
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.cargando());
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.auth.tienePermiso("reportes.exportar") ? 21 : -1);
      \u0275\u0275advance();
      \u0275\u0275attribute("aria-busy", ctx.cargando());
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.indicadores());
    }
  }, styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n  padding: clamp(16px, 2vw, 28px);\n  background: #f4f7fb;\n  border-radius: 14px;\n  color: #24344b;\n  container-type: inline-size;\n}\n.reporte[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 24px;\n  width: 100%;\n  margin: 0;\n  min-width: 0;\n}\n.eyebrow[_ngcontent-%COMP%] {\n  color: #075a9b;\n  font-size: 0.7rem;\n  font-weight: 700;\n  letter-spacing: 0.12em;\n}\nh1[_ngcontent-%COMP%] {\n  margin: 8px 0 12px;\n  color: #173854;\n  font-size: clamp(1.5rem, 3vw, 2rem);\n  letter-spacing: -0.03em;\n}\nh2[_ngcontent-%COMP%] {\n  margin: 0 0 10px;\n  font-size: 1.05rem;\n}\np[_ngcontent-%COMP%] {\n  margin: 6px 0;\n  line-height: 1.65;\n}\n.subtitulo[_ngcontent-%COMP%], \nsmall[_ngcontent-%COMP%], \ncaption[_ngcontent-%COMP%] {\n  color: #54657b;\n  font-size: 0.875rem;\n}\n.panel[_ngcontent-%COMP%], \n.tarjeta[_ngcontent-%COMP%] {\n  min-width: 0;\n  padding: 22px;\n  background: white;\n  border: 1px solid #e1e8f0;\n  border-radius: 14px;\n  box-shadow: 0 3px 14px rgba(23, 56, 84, 0.0235294118);\n}\n.aviso[_ngcontent-%COMP%], \n.error[_ngcontent-%COMP%] {\n  padding: 16px 18px;\n  border: 1px solid #f1ddb2;\n  border-radius: 12px;\n  background: #fff9ed;\n  color: #795215;\n  font-size: 0.875rem;\n}\n.error[_ngcontent-%COMP%] {\n  border-color: #f1c9cb;\n  background: #fff1f2;\n  color: #9f2330;\n}\n.informacion[_ngcontent-%COMP%] {\n  border-color: #ccdef5;\n  background: #edf5ff;\n  color: #275584;\n}\n.aviso[_ngcontent-%COMP%]    > .material-symbols-outlined[_ngcontent-%COMP%], \n.error[_ngcontent-%COMP%]    > .material-symbols-outlined[_ngcontent-%COMP%] {\n  float: left;\n  margin-right: 10px;\n  font-size: 20px;\n}\ndetails[_ngcontent-%COMP%] {\n  margin-top: 12px;\n  font-size: 0.8rem;\n  line-height: 1.6;\n}\nsummary[_ngcontent-%COMP%] {\n  width: fit-content;\n  cursor: pointer;\n  font-weight: 600;\n  color: #075a9b;\n}\n.acciones[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 10px;\n}\n.btn[_ngcontent-%COMP%] {\n  min-width: 0;\n  max-width: 100%;\n  min-height: 44px;\n  border-radius: 9px;\n  font-size: 0.8125rem;\n  white-space: nowrap;\n  word-break: normal;\n  overflow-wrap: normal;\n}\n.btn[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%] {\n  flex: none;\n  font-size: 19px;\n}\n.btn-primario[_ngcontent-%COMP%] {\n  background: #075a9b;\n  border-color: #075a9b;\n  color: white;\n}\n.btn-primario[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #064a80;\n  color: white;\n}\n.btn-neutro[_ngcontent-%COMP%] {\n  color: #42536a;\n  border-color: #d3dce7;\n}\n.btn-exportar[_ngcontent-%COMP%] {\n  background: #147148;\n  border-color: #147148;\n  color: white;\n}\n.btn-exportar[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #105a39;\n  color: white;\n}\n[_ngcontent-%COMP%]:is(button, input[_ngcontent-%COMP%], select[_ngcontent-%COMP%], summary)[_ngcontent-%COMP%]:focus-visible {\n  outline: 3px solid #2563eb;\n  outline-offset: 3px;\n}\n.etiqueta[_ngcontent-%COMP%], \n.badge[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  padding: 5px 10px;\n  border-radius: 30px;\n  background: #fff2d9;\n  color: #795215;\n  font-size: 0.75rem;\n  font-weight: 600;\n}\n@container (max-width: 560px) {\n  .panel[_ngcontent-%COMP%], \n   .tarjeta[_ngcontent-%COMP%] {\n    padding: 16px;\n  }\n  .acciones[_ngcontent-%COMP%]    > .btn[_ngcontent-%COMP%] {\n    flex: 1 1 auto;\n  }\n}\n.tarjetas[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 16px;\n}\n.tarjeta[_ngcontent-%COMP%] {\n  --acento: #2563eb;\n  --suave: #eff6ff;\n  border-top: 3px solid var(--acento);\n}\n.tarjeta[_ngcontent-%COMP%]:nth-child(2) {\n  --acento: #7c3aed;\n  --suave: #f5f0ff;\n}\n.tarjeta[_ngcontent-%COMP%]:nth-child(3) {\n  --acento: #0f766e;\n  --suave: #eaf8f5;\n}\n.tarjeta[_ngcontent-%COMP%]:nth-child(4) {\n  --acento: #c2410c;\n  --suave: #fff3eb;\n}\n.icono-indicador[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 46px;\n  height: 46px;\n  margin-bottom: 20px;\n  background: var(--suave);\n  color: var(--acento);\n  border-radius: 12px;\n}\n.tarjeta[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  font-weight: 600;\n}\n.valor[_ngcontent-%COMP%] {\n  display: block;\n  margin: 12px 0;\n  color: #173854;\n  font-size: 2.25rem;\n  font-weight: 700;\n  font-variant-numeric: tabular-nums;\n}\n.tarjeta[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #54657b;\n  font-size: 0.8rem;\n}\n.sin-dato[_ngcontent-%COMP%] {\n  display: inline-block;\n  margin: 8px 0;\n  padding: 6px 10px;\n  background: #f1f5f9;\n  color: #52647b;\n  border-radius: 7px;\n  font-size: 0.8rem;\n  font-weight: 600;\n}\n.skeleton[_ngcontent-%COMP%] {\n  height: 28px;\n  margin: 12px 0;\n  border-radius: 6px;\n  background:\n    linear-gradient(\n      90deg,\n      #eef2f7 25%,\n      #dfe7f0 50%,\n      #eef2f7 75%);\n  background-size: 200% 100%;\n  animation: _ngcontent-%COMP%_brillo 1.6s linear infinite;\n}\n@keyframes _ngcontent-%COMP%_brillo {\n  to {\n    background-position: -200% 0;\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .skeleton[_ngcontent-%COMP%] {\n    animation: none;\n  }\n}\n@container (max-width: 1050px) {\n  .tarjetas[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n@container (max-width: 560px) {\n  .tarjetas[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=indicadores-generales.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(IndicadoresGeneralesComponent, { className: "IndicadoresGeneralesComponent", filePath: "src\\app\\pages\\reportes\\indicadores-generales\\indicadores-generales.component.ts", lineNumber: 18 });
})();
export {
  IndicadoresGeneralesComponent
};
//# sourceMappingURL=chunk-E3MR7TUG.mjs.map
