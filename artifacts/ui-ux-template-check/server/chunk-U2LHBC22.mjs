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
  DefaultValueAccessor,
  FormsModule,
  MaxLengthValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  ɵNgNoValidate
} from "./chunk-SPQE7PSN.mjs";
import {
  descargarCsv,
  fechasValidas,
  mensajeReporte
} from "./chunk-3FIWDPNU.mjs";
import {
  DestroyRef,
  afterNextRender,
  inject,
  signal,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵdefineComponent,
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
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3,
  ɵɵtextInterpolate4,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-OYAKRC2F.mjs";
import "./chunk-X7LY3JHO.mjs";

// src/app/pages/reportes/reportes-actividades/reportes-actividades.component.ts
var _forTrack0 = ($index, $item) => $item.id_actividad;
function ReportesActividadesComponent_Conditional_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 13)(1, "span", 4);
    \u0275\u0275text(2, "error");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.error());
  }
}
function ReportesActividadesComponent_Conditional_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 14)(1, "span", 4);
    \u0275\u0275text(2, "visibility");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, "Consultando actividades\u2026");
    \u0275\u0275elementEnd();
  }
}
function ReportesActividadesComponent_Conditional_40_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 2);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate4("Filtros aplicados: inicio desde ", ctx_r0.aplicado.desde || "sin l\xEDmite", " \xB7 inicio hasta ", ctx_r0.aplicado.hasta || "sin l\xEDmite", " \xB7 estado ", ctx_r0.aplicado.estado || "todos", " \xB7 b\xFAsqueda ", ctx_r0.aplicado.q || "ninguna", ".");
  }
}
function ReportesActividadesComponent_Conditional_40_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 20);
    \u0275\u0275listener("click", function ReportesActividadesComponent_Conditional_40_Conditional_11_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.exportar());
    });
    \u0275\u0275elementStart(1, "span", 4);
    \u0275\u0275text(2, "forward_to_inbox");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, "Exportar CSV");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const resultado_r4 = \u0275\u0275nextContext();
    \u0275\u0275property("disabled", !resultado_r4.data.length);
  }
}
function ReportesActividadesComponent_Conditional_40_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 14);
    \u0275\u0275text(1, "No hay actividades en esta p\xE1gina para la consulta aplicada.");
    \u0275\u0275elementEnd();
  }
}
function ReportesActividadesComponent_Conditional_40_Conditional_15_For_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 24);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td", 25);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td", 25);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td", 25)(14, "span", 26);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "td");
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const fila_r5 = ctx.$implicit;
    const \u0275$index_149_r6 = ctx.$index;
    const resultado_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((resultado_r4.current_page - 1) * resultado_r4.per_page + \u0275$index_149_r6 + 1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(fila_r5.id_actividad);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(fila_r5.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(fila_r5.tipo_actividad || "Sin tipo disponible");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(fila_r5.fecha_inicio);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(fila_r5.fecha_fin || "Sin fecha");
    \u0275\u0275advance(2);
    \u0275\u0275classProp("badge-exito", fila_r5.estado === "Activa");
    \u0275\u0275attribute("data-estado", fila_r5.estado);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(fila_r5.estado);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(fila_r5.sede || "Sin sede");
  }
}
function ReportesActividadesComponent_Conditional_40_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17)(1, "table")(2, "caption");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "thead")(5, "tr")(6, "th", 21);
    \u0275\u0275text(7, "N.\xBA");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 22);
    \u0275\u0275text(9, "C\xF3digo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 22);
    \u0275\u0275text(11, "Nombre");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 22);
    \u0275\u0275text(13, "Tipo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th", 23);
    \u0275\u0275text(15, "Inicio");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th", 23);
    \u0275\u0275text(17, "Fin");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "th", 23);
    \u0275\u0275text(19, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "th", 22);
    \u0275\u0275text(21, "Sede");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(22, "tbody");
    \u0275\u0275repeaterCreate(23, ReportesActividadesComponent_Conditional_40_Conditional_15_For_24_Template, 18, 11, "tr", null, _forTrack0);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const resultado_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("Actividades \xB7 p\xE1gina ", resultado_r4.current_page, " de ", resultado_r4.last_page, "");
    \u0275\u0275advance(20);
    \u0275\u0275repeater(resultado_r4.data);
  }
}
function ReportesActividadesComponent_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 15)(1, "h2");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p")(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275template(7, ReportesActividadesComponent_Conditional_40_Conditional_7_Template, 2, 4, "p", 2);
    \u0275\u0275elementStart(8, "p", 2);
    \u0275\u0275text(9, "El rango incluye ambos extremos de la fecha de inicio. Todos los filtros, el total y la paginaci\xF3n se calculan en el servidor.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 9);
    \u0275\u0275template(11, ReportesActividadesComponent_Conditional_40_Conditional_11_Template, 4, 1, "button", 16);
    \u0275\u0275elementStart(12, "small");
    \u0275\u0275text(13, "El CSV exporta \xFAnicamente las filas de la p\xE1gina actual, con los filtros aplicados.");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(14, ReportesActividadesComponent_Conditional_40_Conditional_14_Template, 2, 0, "p", 14)(15, ReportesActividadesComponent_Conditional_40_Conditional_15_Template, 25, 2, "div", 17);
    \u0275\u0275elementStart(16, "div", 18)(17, "span");
    \u0275\u0275text(18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "div", 9)(20, "button", 19);
    \u0275\u0275listener("click", function ReportesActividadesComponent_Conditional_40_Template_button_click_20_listener() {
      const resultado_r4 = \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.cargar(resultado_r4.current_page - 1));
    });
    \u0275\u0275text(21, "Anterior");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "button", 19);
    \u0275\u0275listener("click", function ReportesActividadesComponent_Conditional_40_Template_button_click_22_listener() {
      const resultado_r4 = \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.cargar(resultado_r4.current_page + 1));
    });
    \u0275\u0275text(23, "Siguiente");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const resultado_r4 = ctx;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.hayFiltros() ? "Resultado filtrado" : "Listado general");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(resultado_r4.total);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" actividades ", ctx_r0.hayFiltros() ? "coinciden con los filtros aplicados" : "registradas en el alcance autorizado", ". ", resultado_r4.data.length, " en esta p\xE1gina.");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.hayFiltros() ? 7 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r0.auth.tienePermiso("reportes.exportar") ? 11 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(!resultado_r4.data.length ? 14 : 15);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate3("P\xE1gina ", resultado_r4.current_page, " de ", resultado_r4.last_page, " \xB7 ", resultado_r4.total, " actividades");
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", resultado_r4.current_page <= 1);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", resultado_r4.current_page >= resultado_r4.last_page);
  }
}
var ReportesActividadesComponent = class _ReportesActividadesComponent {
  auth = inject(AuthService);
  reportes = inject(ReportesService);
  destroyRef = inject(DestroyRef);
  pagina = signal(null);
  error = signal("");
  cargando = signal(false);
  inicio = "";
  fin = "";
  busqueda = "";
  estado = "";
  aplicado = { desde: "", hasta: "", estado: "", q: "" };
  constructor() {
    afterNextRender(() => this.consultar());
  }
  consultar() {
    if (this.cargando())
      return;
    this.error.set("");
    if (!fechasValidas(this.inicio, this.fin)) {
      this.pagina.set(null);
      this.error.set("La fecha de inicio no puede ser posterior a la fecha de fin.");
      return;
    }
    this.aplicado = { desde: this.inicio, hasta: this.fin, estado: this.estado.trim(), q: this.busqueda.trim() };
    this.cargar(1);
  }
  cargar(page) {
    if (this.cargando())
      return;
    this.error.set("");
    this.pagina.set(null);
    if (!this.auth.tienePermiso("reportes.ver") || !this.auth.tienePermiso("actividades.ver")) {
      this.error.set("Necesitas los permisos reportes.ver y actividades.ver para consultar este reporte.");
      return;
    }
    this.cargando.set(true);
    this.reportes.actividades(page, this.aplicado).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (pagina) => {
        this.pagina.set(pagina);
        this.cargando.set(false);
      },
      error: (error) => {
        this.error.set(error?.status === 422 ? "Revisa los filtros: fechas v\xE1lidas, estado de hasta 20 caracteres y b\xFAsqueda de hasta 100 caracteres." : mensajeReporte(error));
        this.cargando.set(false);
      }
    });
  }
  actualizar() {
    this.cargar(this.pagina()?.current_page ?? 1);
  }
  limpiar() {
    if (this.cargando())
      return;
    this.inicio = "";
    this.fin = "";
    this.busqueda = "";
    this.estado = "";
    this.consultar();
  }
  hayFiltros() {
    return Object.values(this.aplicado).some((valor) => valor !== "");
  }
  exportar() {
    const pagina = this.pagina();
    if (!this.auth.tienePermiso("reportes.exportar") || !pagina?.data.length || this.cargando())
      return;
    descargarCsv("actividades-pagina-filtrada.csv", ["C\xF3digo", "Actividad", "Tipo", "Fecha de inicio", "Fecha de fin", "Estado", "Sede", "Alcance", "Filtros"], pagina.data.map((fila) => [
      fila.id_actividad,
      fila.nombre,
      fila.tipo_actividad ?? "Sin tipo disponible",
      fila.fecha_inicio,
      fila.fecha_fin,
      fila.estado,
      fila.sede,
      `P\xE1gina ${pagina.current_page} de ${pagina.last_page}; ${pagina.data.length} filas de ${pagina.total} actividades filtradas`,
      `Inicio desde: ${this.aplicado.desde || "sin l\xEDmite"}; inicio hasta: ${this.aplicado.hasta || "sin l\xEDmite"}; estado: ${this.aplicado.estado || "todos"}; b\xFAsqueda: ${this.aplicado.q || "ninguna"}`
    ]));
  }
  static \u0275fac = function ReportesActividadesComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ReportesActividadesComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ReportesActividadesComponent, selectors: [["app-reportes-actividades"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 41, vars: 14, consts: [[1, "reporte"], [1, "eyebrow"], [1, "subtitulo"], [1, "panel", "filtros", 3, "ngSubmit"], ["aria-hidden", "true", 1, "material-symbols-outlined"], ["type", "date", "name", "inicio", 3, "ngModelChange", "ngModel", "disabled"], ["type", "date", "name", "fin", 3, "ngModelChange", "ngModel", "disabled"], ["name", "estado", "maxlength", "20", "placeholder", "Todos los estados", 3, "ngModelChange", "ngModel", "disabled"], ["type", "search", "name", "busqueda", "maxlength", "100", "placeholder", "Buscar actividad", 3, "ngModelChange", "ngModel", "disabled"], [1, "acciones"], ["type", "submit", 1, "btn", "btn-primario", 3, "disabled"], ["type", "button", 1, "btn", "btn-neutro", 3, "click", "disabled"], ["type", "button", 1, "btn", "btn-secundario", 3, "click", "disabled"], ["role", "alert", 1, "error"], ["role", "status", 1, "estado"], ["aria-label", "Resultado del reporte", 1, "panel"], [1, "btn", "btn-exportar", 3, "disabled"], ["tabindex", "0", "role", "region", "aria-label", "Tabla de actividades", 1, "tabla"], [1, "paginacion"], [1, "btn", "btn-secundario", 3, "click", "disabled"], [1, "btn", "btn-exportar", 3, "click", "disabled"], ["scope", "col", 1, "col-centro", "col-numero"], ["scope", "col"], ["scope", "col", 1, "col-centro"], ["data-label", "N.\xBA", 1, "col-centro", "col-numero"], [1, "col-centro"], [1, "badge"]], template: function ReportesActividadesComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section", 0)(1, "header")(2, "p", 1);
      \u0275\u0275text(3, "GESTI\xD3N MUNICIPAL \xB7 REPORTES");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "h1");
      \u0275\u0275text(5, "Reportes de actividades");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "p", 2);
      \u0275\u0275text(7, "Consulta general de actividades registradas dentro del alcance autorizado de tu usuario.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "form", 3);
      \u0275\u0275listener("ngSubmit", function ReportesActividadesComponent_Template_form_ngSubmit_8_listener() {
        return ctx.consultar();
      });
      \u0275\u0275elementStart(9, "h2")(10, "span", 4);
      \u0275\u0275text(11, "tune");
      \u0275\u0275elementEnd();
      \u0275\u0275text(12, "Filtros de consulta");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "label");
      \u0275\u0275text(14, "Fecha de inicio desde");
      \u0275\u0275elementStart(15, "input", 5);
      \u0275\u0275twoWayListener("ngModelChange", function ReportesActividadesComponent_Template_input_ngModelChange_15_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.inicio, $event) || (ctx.inicio = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(16, "label");
      \u0275\u0275text(17, "Fecha de inicio hasta");
      \u0275\u0275elementStart(18, "input", 6);
      \u0275\u0275twoWayListener("ngModelChange", function ReportesActividadesComponent_Template_input_ngModelChange_18_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.fin, $event) || (ctx.fin = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(19, "label");
      \u0275\u0275text(20, "Estado exacto");
      \u0275\u0275elementStart(21, "input", 7);
      \u0275\u0275twoWayListener("ngModelChange", function ReportesActividadesComponent_Template_input_ngModelChange_21_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.estado, $event) || (ctx.estado = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(22, "label");
      \u0275\u0275text(23, "Nombre o c\xF3digo");
      \u0275\u0275elementStart(24, "input", 8);
      \u0275\u0275twoWayListener("ngModelChange", function ReportesActividadesComponent_Template_input_ngModelChange_24_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.busqueda, $event) || (ctx.busqueda = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(25, "div", 9)(26, "button", 10)(27, "span", 4);
      \u0275\u0275text(28, "bar_chart");
      \u0275\u0275elementEnd();
      \u0275\u0275text(29, "Consultar");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(30, "button", 11);
      \u0275\u0275listener("click", function ReportesActividadesComponent_Template_button_click_30_listener() {
        return ctx.limpiar();
      });
      \u0275\u0275elementStart(31, "span", 4);
      \u0275\u0275text(32, "toggle_off");
      \u0275\u0275elementEnd();
      \u0275\u0275text(33, "Limpiar filtros");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(34, "button", 12);
      \u0275\u0275listener("click", function ReportesActividadesComponent_Template_button_click_34_listener() {
        return ctx.actualizar();
      });
      \u0275\u0275elementStart(35, "span", 4);
      \u0275\u0275text(36, "tune");
      \u0275\u0275elementEnd();
      \u0275\u0275text(37, "Actualizar");
      \u0275\u0275elementEnd()()();
      \u0275\u0275template(38, ReportesActividadesComponent_Conditional_38_Template, 4, 1, "p", 13)(39, ReportesActividadesComponent_Conditional_39_Template, 4, 0, "p", 14)(40, ReportesActividadesComponent_Conditional_40_Template, 24, 12, "section", 15);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_13_0;
      \u0275\u0275advance(15);
      \u0275\u0275twoWayProperty("ngModel", ctx.inicio);
      \u0275\u0275property("disabled", ctx.cargando());
      \u0275\u0275advance(3);
      \u0275\u0275twoWayProperty("ngModel", ctx.fin);
      \u0275\u0275property("disabled", ctx.cargando());
      \u0275\u0275advance(3);
      \u0275\u0275twoWayProperty("ngModel", ctx.estado);
      \u0275\u0275property("disabled", ctx.cargando());
      \u0275\u0275advance(3);
      \u0275\u0275twoWayProperty("ngModel", ctx.busqueda);
      \u0275\u0275property("disabled", ctx.cargando());
      \u0275\u0275advance(2);
      \u0275\u0275property("disabled", ctx.cargando());
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.cargando());
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.cargando());
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.error() ? 38 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.cargando() ? 39 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_13_0 = ctx.pagina()) ? 40 : -1, tmp_13_0);
    }
  }, dependencies: [FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, MaxLengthValidator, NgModel, NgForm], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n  padding: clamp(16px, 2vw, 28px);\n  background: #f4f7fb;\n  border-radius: 14px;\n  color: #24344b;\n  container-type: inline-size;\n}\n.reporte[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 24px;\n  width: 100%;\n  margin: 0;\n  min-width: 0;\n}\n.eyebrow[_ngcontent-%COMP%] {\n  color: #075a9b;\n  font-size: 0.7rem;\n  font-weight: 700;\n  letter-spacing: 0.12em;\n}\nh1[_ngcontent-%COMP%] {\n  margin: 8px 0 12px;\n  color: #173854;\n  font-size: clamp(1.5rem, 3vw, 2rem);\n  letter-spacing: -0.03em;\n}\nh2[_ngcontent-%COMP%] {\n  margin: 0 0 10px;\n  font-size: 1.05rem;\n}\np[_ngcontent-%COMP%] {\n  margin: 6px 0;\n  line-height: 1.65;\n}\n.subtitulo[_ngcontent-%COMP%], \nsmall[_ngcontent-%COMP%], \ncaption[_ngcontent-%COMP%] {\n  color: #54657b;\n  font-size: 0.875rem;\n}\n.panel[_ngcontent-%COMP%], \n.tarjeta[_ngcontent-%COMP%] {\n  min-width: 0;\n  padding: 22px;\n  background: white;\n  border: 1px solid #e1e8f0;\n  border-radius: 14px;\n  box-shadow: 0 3px 14px rgba(23, 56, 84, 0.0235294118);\n}\n.aviso[_ngcontent-%COMP%], \n.error[_ngcontent-%COMP%] {\n  padding: 16px 18px;\n  border: 1px solid #f1ddb2;\n  border-radius: 12px;\n  background: #fff9ed;\n  color: #795215;\n  font-size: 0.875rem;\n}\n.error[_ngcontent-%COMP%] {\n  border-color: #f1c9cb;\n  background: #fff1f2;\n  color: #9f2330;\n}\n.informacion[_ngcontent-%COMP%] {\n  border-color: #ccdef5;\n  background: #edf5ff;\n  color: #275584;\n}\n.aviso[_ngcontent-%COMP%]    > .material-symbols-outlined[_ngcontent-%COMP%], \n.error[_ngcontent-%COMP%]    > .material-symbols-outlined[_ngcontent-%COMP%] {\n  float: left;\n  margin-right: 10px;\n  font-size: 20px;\n}\ndetails[_ngcontent-%COMP%] {\n  margin-top: 12px;\n  font-size: 0.8rem;\n  line-height: 1.6;\n}\nsummary[_ngcontent-%COMP%] {\n  width: fit-content;\n  cursor: pointer;\n  font-weight: 600;\n  color: #075a9b;\n}\n.acciones[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 10px;\n}\n.btn[_ngcontent-%COMP%] {\n  min-width: 0;\n  max-width: 100%;\n  min-height: 44px;\n  border-radius: 9px;\n  font-size: 0.8125rem;\n  white-space: nowrap;\n  word-break: normal;\n  overflow-wrap: normal;\n}\n.btn[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%] {\n  flex: none;\n  font-size: 19px;\n}\n.btn-primario[_ngcontent-%COMP%] {\n  background: #075a9b;\n  border-color: #075a9b;\n  color: white;\n}\n.btn-primario[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #064a80;\n  color: white;\n}\n.btn-neutro[_ngcontent-%COMP%] {\n  color: #42536a;\n  border-color: #d3dce7;\n}\n.btn-exportar[_ngcontent-%COMP%] {\n  background: #147148;\n  border-color: #147148;\n  color: white;\n}\n.btn-exportar[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #105a39;\n  color: white;\n}\n[_ngcontent-%COMP%]:is(button, input[_ngcontent-%COMP%], select[_ngcontent-%COMP%], summary)[_ngcontent-%COMP%]:focus-visible {\n  outline: 3px solid #2563eb;\n  outline-offset: 3px;\n}\n.etiqueta[_ngcontent-%COMP%], \n.badge[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  padding: 5px 10px;\n  border-radius: 30px;\n  background: #fff2d9;\n  color: #795215;\n  font-size: 0.75rem;\n  font-weight: 600;\n}\n@container (max-width: 560px) {\n  .panel[_ngcontent-%COMP%], \n   .tarjeta[_ngcontent-%COMP%] {\n    padding: 16px;\n  }\n  .acciones[_ngcontent-%COMP%]    > .btn[_ngcontent-%COMP%] {\n    flex: 1 1 auto;\n  }\n}\n.filtros[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 180px), 1fr));\n  align-items: end;\n  gap: 20px 16px;\n}\n.filtros[_ngcontent-%COMP%]    > h2[_ngcontent-%COMP%], \n.filtros[_ngcontent-%COMP%]    > .acciones[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\n.filtros[_ngcontent-%COMP%]    > h2[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin: 0;\n  color: #173854;\n}\nlabel[_ngcontent-%COMP%] {\n  display: grid;\n  min-width: 0;\n  gap: 8px;\n  color: #42536a;\n  font-size: 0.8rem;\n  font-weight: 600;\n}\ninput[_ngcontent-%COMP%], \nselect[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n  min-height: 44px;\n  padding: 10px 12px;\n  border: 1px solid #c6d2e1;\n  border-radius: 8px;\n  background: #fff;\n  color: #24344b;\n  font: inherit;\n  font-size: 1rem;\n}\n[_ngcontent-%COMP%]:is(input, select)[_ngcontent-%COMP%]:disabled {\n  background: #f1f5f9;\n  color: #52647b;\n  cursor: not-allowed;\n}\n.filtros[_ngcontent-%COMP%]    > .acciones[_ngcontent-%COMP%] {\n  padding-top: 16px;\n  border-top: 1px solid #e8eef5;\n}\n.badge[_ngcontent-%COMP%] {\n  background: #edf2f8;\n  color: #475569;\n  white-space: nowrap;\n}\n.badge-exito[_ngcontent-%COMP%] {\n  background: #e8f6ef;\n  color: #17623f;\n}\n.estado[_ngcontent-%COMP%] {\n  padding: 20px;\n  color: #54657b;\n  text-align: center;\n  background: #f8fafc;\n  border: 1px dashed #cfdae7;\n  border-radius: 12px;\n}\n.estado[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%] {\n  vertical-align: middle;\n  margin-right: 8px;\n}\n.tabla[_ngcontent-%COMP%] {\n  min-width: 0;\n  max-width: 100%;\n  overflow-x: auto;\n  margin-top: 18px;\n  border: 1px solid #e1e8f0;\n  border-radius: 10px;\n}\ntable[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  text-align: left;\n  font-size: 0.8125rem;\n}\ncaption[_ngcontent-%COMP%] {\n  padding: 12px;\n  text-align: left;\n}\nth[_ngcontent-%COMP%], \ntd[_ngcontent-%COMP%] {\n  padding: 14px 16px;\n  border-bottom: 1px solid #e8eef5;\n  vertical-align: middle;\n}\nth[_ngcontent-%COMP%] {\n  background: #edf4fc;\n  color: #284e77;\n  font-weight: 600;\n  white-space: nowrap;\n}\ntd[_ngcontent-%COMP%] {\n  min-width: 110px;\n  max-width: 360px;\n  overflow-wrap: anywhere;\n  line-height: 1.6;\n}\ntbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover {\n  background: #f5f9ff;\n}\ntbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:last-child   td[_ngcontent-%COMP%] {\n  border-bottom: 0;\n}\n.paginacion[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: space-between;\n  align-items: center;\n  gap: 16px;\n  margin-top: 20px;\n  padding-top: 18px;\n  border-top: 1px solid #e8eef5;\n  font-size: 0.8125rem;\n}\n/*# sourceMappingURL=reportes-actividades.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ReportesActividadesComponent, { className: "ReportesActividadesComponent", filePath: "src\\app\\pages\\reportes\\reportes-actividades\\reportes-actividades.component.ts", lineNumber: 12 });
})();
export {
  ReportesActividadesComponent
};
//# sourceMappingURL=chunk-U2LHBC22.mjs.map
