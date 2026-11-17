import {
  ReportesService
} from "./chunk-DWS7TRZN.js";
import {
  descargarCsv,
  estadoCertificado,
  fechasValidas,
  mensajeReporte
} from "./chunk-D54ZA26N.js";
import "./chunk-4FUGVTHD.js";
import "./chunk-RJ22SAW5.js";
import {
  AuthService
} from "./chunk-W2463ZNS.js";
import "./chunk-C4J44J4Z.js";
import "./chunk-LSGUT5KG.js";
import "./chunk-7PBBQCKX.js";
import {
  takeUntilDestroyed
} from "./chunk-IJ23LC2U.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  NgSelectOption,
  SelectControlValueAccessor,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-YLHEVWGL.js";
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
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-3ZDGBTDF.js";
import "./chunk-ZX6IUAQ5.js";

// src/app/pages/reportes/reportes-certificados/reportes-certificados.component.ts
var _forTrack0 = ($index, $item) => $item.id_tipo_certificado;
var _forTrack1 = ($index, $item) => $item.id_certificado;
function ReportesCertificadosComponent_For_44_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 14);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r1 = ctx.$implicit;
    \u0275\u0275property("value", item_r1.id_tipo_certificado);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r1.nombre_tipo);
  }
}
function ReportesCertificadosComponent_Conditional_61_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 20);
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "button", 23);
    \u0275\u0275listener("click", function ReportesCertificadosComponent_Conditional_61_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.cargarTipos());
    });
    \u0275\u0275text(3, "Reintentar tipos");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Cat\xE1logo de tipos: ", ctx_r2.errorTipos(), " ");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r2.cargandoTipos());
  }
}
function ReportesCertificadosComponent_Conditional_62_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 16)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 23);
    \u0275\u0275listener("click", function ReportesCertificadosComponent_Conditional_62_Template_button_click_3_listener() {
      const tipos_r5 = \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.cargarTipos(tipos_r5.current_page - 1));
    });
    \u0275\u0275text(4, "Tipos anteriores");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 23);
    \u0275\u0275listener("click", function ReportesCertificadosComponent_Conditional_62_Template_button_click_5_listener() {
      const tipos_r5 = \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.cargarTipos(tipos_r5.current_page + 1));
    });
    \u0275\u0275text(6, "Tipos siguientes");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const tipos_r5 = ctx;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("Cat\xE1logo de tipos: p\xE1gina ", tipos_r5.current_page, " de ", tipos_r5.last_page, ". No se descargan todas las p\xE1ginas.");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r2.cargandoTipos() || tipos_r5.current_page <= 1);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r2.cargandoTipos() || tipos_r5.current_page >= tipos_r5.last_page);
  }
}
function ReportesCertificadosComponent_Conditional_63_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 20)(1, "span", 5);
    \u0275\u0275text(2, "error");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r2.error());
  }
}
function ReportesCertificadosComponent_Conditional_64_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 21)(1, "span", 5);
    \u0275\u0275text(2, "visibility");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, "Consultando certificados\u2026");
    \u0275\u0275elementEnd();
  }
}
function ReportesCertificadosComponent_Conditional_65_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 27);
    \u0275\u0275listener("click", function ReportesCertificadosComponent_Conditional_65_Conditional_8_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.exportar());
    });
    \u0275\u0275elementStart(1, "span", 5);
    \u0275\u0275text(2, "forward_to_inbox");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, "Exportar CSV");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", !ctx_r2.filas().length);
  }
}
function ReportesCertificadosComponent_Conditional_65_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 21)(1, "span", 5);
    \u0275\u0275text(2, "visibility");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, "Sin resultados en esta p\xE1gina para los filtros aplicados. Otras p\xE1ginas podr\xEDan contener coincidencias.");
    \u0275\u0275elementEnd();
  }
}
function ReportesCertificadosComponent_Conditional_65_Conditional_12_For_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 31);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275text(6, "Nombre no disponible");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td");
    \u0275\u0275text(8, "Relaci\xF3n no disponible");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td");
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td", 32)(14, "span", 33);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const fila_r8 = ctx.$implicit;
    const \u0275$index_197_r9 = ctx.$index;
    const resultado_r10 = \u0275\u0275nextContext(2);
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((resultado_r10.current_page - 1) * resultado_r10.per_page + \u0275$index_197_r9 + 1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(fila_r8.id_certificado);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r2.nombreTipo(fila_r8.id_tipo_certificado));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(fila_r8.fecha_emision || "Sin fecha");
    \u0275\u0275advance(2);
    \u0275\u0275classProp("badge-exito", ctx_r2.estadoTexto(fila_r8.estado) === "Activo");
    \u0275\u0275attribute("data-estado", ctx_r2.estadoTexto(fila_r8.estado));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.estadoTexto(fila_r8.estado));
  }
}
function ReportesCertificadosComponent_Conditional_65_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 25)(1, "table")(2, "caption");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "thead")(5, "tr")(6, "th", 28);
    \u0275\u0275text(7, "N.\xBA");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 29);
    \u0275\u0275text(9, "Registro");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 29);
    \u0275\u0275text(11, "Beneficiario");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 29);
    \u0275\u0275text(13, "Actividad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th", 29);
    \u0275\u0275text(15, "Tipo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th", 29);
    \u0275\u0275text(17, "Emisi\xF3n declarada");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "th", 30);
    \u0275\u0275text(19, "Estado del registro");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(20, "tbody");
    \u0275\u0275repeaterCreate(21, ReportesCertificadosComponent_Conditional_65_Conditional_12_For_22_Template, 16, 8, "tr", null, _forTrack1);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const resultado_r10 = \u0275\u0275nextContext();
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Registros de la p\xE1gina ", resultado_r10.current_page, "; nombres relacionados no suministrados por Laravel.");
    \u0275\u0275advance(18);
    \u0275\u0275repeater(ctx_r2.filas());
  }
}
function ReportesCertificadosComponent_Conditional_65_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 22)(1, "h2");
    \u0275\u0275text(2, "Resultado de la consulta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p");
    \u0275\u0275text(6, "El estado booleano de certificados solo distingue activo e inactivo. GENERADO y ANULADO pertenecen a documentos; no se deducen del estado del certificado.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 16);
    \u0275\u0275template(8, ReportesCertificadosComponent_Conditional_65_Conditional_8_Template, 4, 1, "button", 24);
    \u0275\u0275elementStart(9, "small");
    \u0275\u0275text(10, "Exporta solo las filas filtradas de la p\xE1gina actual, en UTF-8.");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(11, ReportesCertificadosComponent_Conditional_65_Conditional_11_Template, 4, 0, "p", 21)(12, ReportesCertificadosComponent_Conditional_65_Conditional_12_Template, 23, 1, "div", 25);
    \u0275\u0275elementStart(13, "div", 26)(14, "span");
    \u0275\u0275text(15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "div", 16)(17, "button", 23);
    \u0275\u0275listener("click", function ReportesCertificadosComponent_Conditional_65_Template_button_click_17_listener() {
      const resultado_r10 = \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.cargar(resultado_r10.current_page - 1));
    });
    \u0275\u0275text(18, "Anterior");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "button", 23);
    \u0275\u0275listener("click", function ReportesCertificadosComponent_Conditional_65_Template_button_click_19_listener() {
      const resultado_r10 = \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.cargar(resultado_r10.current_page + 1));
    });
    \u0275\u0275text(20, "Siguiente");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const resultado_r10 = ctx;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275attribute("aria-busy", ctx_r2.cargando());
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate3("", resultado_r10.total, " registros coinciden con estado y tipo en el servidor. ", ctx_r2.filas().length, " coinciden con todos los filtros en esta p\xE1gina; ", ctx_r2.conFecha(), " tienen fecha de emisi\xF3n declarada.");
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r2.auth.tienePermiso("reportes.exportar") ? 8 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(!ctx_r2.filas().length ? 11 : 12);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("P\xE1gina ", resultado_r10.current_page, " de ", resultado_r10.last_page, "");
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", resultado_r10.current_page <= 1);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", resultado_r10.current_page >= resultado_r10.last_page);
  }
}
var ReportesCertificadosComponent = class _ReportesCertificadosComponent {
  auth = inject(AuthService);
  servicio = inject(ReportesService);
  destroyRef = inject(DestroyRef);
  pagina = signal(null);
  catalogo = signal(null);
  cargando = signal(false);
  cargandoTipos = signal(false);
  error = signal("");
  errorTipos = signal("");
  consultado = signal(false);
  inicio = "";
  fin = "";
  estado = "";
  tipo = "";
  busqueda = "";
  tipoElegido = null;
  aplicado = { inicio: "", fin: "", estado: "", tipo: "", busqueda: "" };
  estadoTexto = estadoCertificado;
  constructor() {
    afterNextRender(() => {
      this.cargarTipos();
      this.consultar();
    });
  }
  cargarTipos(page = 1) {
    if (!this.auth.tienePermiso("emision.ver") || this.cargandoTipos())
      return;
    this.cargandoTipos.set(true);
    this.errorTipos.set("");
    this.servicio.tipos(page).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (pagina) => {
        this.catalogo.set(pagina);
        this.cargandoTipos.set(false);
      },
      error: (error) => {
        this.errorTipos.set(mensajeReporte(error));
        this.cargandoTipos.set(false);
      }
    });
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
    this.aplicado = { inicio: this.inicio, fin: this.fin, estado: this.estado, tipo: this.tipo, busqueda: this.busqueda.trim() };
    this.cargar(1);
  }
  cargar(page) {
    if (this.cargando())
      return;
    this.error.set("");
    this.pagina.set(null);
    this.consultado.set(true);
    if (!this.auth.tienePermiso("emision.ver")) {
      this.error.set("Necesitas el permiso emision.ver para consultar los certificados.");
      return;
    }
    this.cargando.set(true);
    this.servicio.certificados(page, this.aplicado.estado, this.aplicado.tipo).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (pagina) => {
        this.pagina.set(pagina);
        this.cargando.set(false);
      },
      error: (error) => {
        this.error.set(mensajeReporte(error));
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
    this.estado = "";
    this.tipo = "";
    this.tipoElegido = null;
    this.busqueda = "";
    this.consultar();
  }
  filas() {
    const { inicio, fin, busqueda } = this.aplicado;
    return (this.pagina()?.data ?? []).filter((fila) => {
      const fecha = fila.fecha_emision?.slice(0, 10);
      return (!(inicio || fin) || !!fecha && (!inicio || fecha >= inicio) && (!fin || fecha <= fin)) && (!busqueda || [fila.id_certificado, this.nombreTipo(fila.id_tipo_certificado), fecha, estadoCertificado(fila.estado)].join(" ").toLocaleLowerCase("es").includes(busqueda.toLocaleLowerCase("es")));
    });
  }
  tiposDisponibles() {
    const tipos = this.catalogo()?.data ?? [];
    return this.tipoElegido && !tipos.some((tipo) => tipo.id_tipo_certificado === this.tipoElegido?.id_tipo_certificado) ? [this.tipoElegido, ...tipos] : tipos;
  }
  seleccionarTipo(valor) {
    this.tipoElegido = this.tiposDisponibles().find((tipo) => String(tipo.id_tipo_certificado) === String(valor)) ?? null;
  }
  nombreTipo(id) {
    return this.tiposDisponibles().find((tipo) => tipo.id_tipo_certificado === id)?.nombre_tipo ?? "Nombre no incluido en esta p\xE1gina de tipos";
  }
  conFecha() {
    return this.filas().filter((fila) => !!fila.fecha_emision).length;
  }
  exportar() {
    if (!this.auth.tienePermiso("reportes.exportar") || this.cargando() || !this.filas().length)
      return;
    descargarCsv("certificados-pagina-filtrada.csv", ["Registro de certificado", "Beneficiario", "Actividad", "Tipo", "Fecha de emisi\xF3n declarada", "Estado del registro", "Alcance"], this.filas().map((fila) => [fila.id_certificado, "Nombre no proporcionado por el endpoint", "Relaci\xF3n no proporcionada por el endpoint", this.nombreTipo(fila.id_tipo_certificado), fila.fecha_emision, estadoCertificado(fila.estado), `P\xE1gina ${this.pagina()?.current_page}; filtros de fecha y b\xFAsqueda aplicados solo a esta p\xE1gina`]));
  }
  static \u0275fac = function ReportesCertificadosComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ReportesCertificadosComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ReportesCertificadosComponent, selectors: [["app-reportes-certificados"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 66, vars: 18, consts: [[1, "reporte"], [1, "eyebrow"], [1, "etiqueta"], [1, "subtitulo"], [1, "aviso"], ["aria-hidden", "true", 1, "material-symbols-outlined"], [1, "panel", "filtros", 3, "ngSubmit"], ["type", "date", "name", "inicio", 3, "ngModelChange", "ngModel", "disabled"], ["type", "date", "name", "fin", 3, "ngModelChange", "ngModel", "disabled"], ["name", "estado", 3, "ngModelChange", "ngModel", "disabled"], ["value", ""], ["value", "1"], ["value", "0"], ["name", "tipo", 3, "ngModelChange", "ngModel", "disabled"], [3, "value"], ["type", "search", "name", "busqueda", "placeholder", "Registro, tipo, fecha o estado", 3, "ngModelChange", "ngModel", "disabled"], [1, "acciones"], ["type", "submit", 1, "btn", "btn-primario", 3, "disabled"], ["type", "button", 1, "btn", "btn-neutro", 3, "click", "disabled"], ["type", "button", 1, "btn", "btn-secundario", 3, "click", "disabled"], ["role", "alert", 1, "error"], ["role", "status", 1, "estado"], [1, "panel"], [1, "btn", "btn-secundario", 3, "click", "disabled"], [1, "btn", "btn-exportar", 3, "disabled"], ["tabindex", "0", "role", "region", "aria-label", "Tabla de certificados", 1, "tabla"], [1, "paginacion"], [1, "btn", "btn-exportar", 3, "click", "disabled"], ["scope", "col", 1, "col-centro", "col-numero"], ["scope", "col"], ["scope", "col", 1, "col-centro"], ["data-label", "N.\xBA", 1, "col-centro", "col-numero"], [1, "col-centro"], [1, "badge"]], template: function ReportesCertificadosComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section", 0)(1, "header")(2, "p", 1);
      \u0275\u0275text(3, "GESTI\xD3N MUNICIPAL \xB7 REPORTES");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "h1");
      \u0275\u0275text(5, "Reportes de certificados");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "span", 2);
      \u0275\u0275text(7, "Integraci\xF3n parcial");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "p", 3);
      \u0275\u0275text(9, "Consulta paginada de registros de certificados. Un registro activo o con fecha declarada no acredita un documento emitido.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(10, "aside", 4)(11, "span", 5);
      \u0275\u0275text(12, "warning");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "p");
      \u0275\u0275text(14, "Estado y tipo se filtran en el servidor. Las fechas y la b\xFAsqueda se aplican ");
      \u0275\u0275elementStart(15, "strong");
      \u0275\u0275text(16, "solo a la p\xE1gina recibida (hasta 20 registros)");
      \u0275\u0275elementEnd();
      \u0275\u0275text(17, ". El backend a\xFAn no admite rangos ni b\xFAsqueda global, y no incluye nombres de beneficiarios, actividades o c\xF3digos de documentos.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(18, "form", 6);
      \u0275\u0275listener("ngSubmit", function ReportesCertificadosComponent_Template_form_ngSubmit_18_listener() {
        return ctx.consultar();
      });
      \u0275\u0275elementStart(19, "h2")(20, "span", 5);
      \u0275\u0275text(21, "tune");
      \u0275\u0275elementEnd();
      \u0275\u0275text(22, "Filtros de consulta");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "label");
      \u0275\u0275text(24, "Emisi\xF3n desde (p\xE1gina actual)");
      \u0275\u0275elementStart(25, "input", 7);
      \u0275\u0275twoWayListener("ngModelChange", function ReportesCertificadosComponent_Template_input_ngModelChange_25_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.inicio, $event) || (ctx.inicio = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(26, "label");
      \u0275\u0275text(27, "Emisi\xF3n hasta (p\xE1gina actual)");
      \u0275\u0275elementStart(28, "input", 8);
      \u0275\u0275twoWayListener("ngModelChange", function ReportesCertificadosComponent_Template_input_ngModelChange_28_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.fin, $event) || (ctx.fin = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(29, "label");
      \u0275\u0275text(30, "Estado del registro");
      \u0275\u0275elementStart(31, "select", 9);
      \u0275\u0275twoWayListener("ngModelChange", function ReportesCertificadosComponent_Template_select_ngModelChange_31_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.estado, $event) || (ctx.estado = $event);
        return $event;
      });
      \u0275\u0275elementStart(32, "option", 10);
      \u0275\u0275text(33, "Todos");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(34, "option", 11);
      \u0275\u0275text(35, "Activo");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(36, "option", 12);
      \u0275\u0275text(37, "Inactivo");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(38, "label");
      \u0275\u0275text(39, "Tipo");
      \u0275\u0275elementStart(40, "select", 13);
      \u0275\u0275twoWayListener("ngModelChange", function ReportesCertificadosComponent_Template_select_ngModelChange_40_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.tipo, $event) || (ctx.tipo = $event);
        return $event;
      });
      \u0275\u0275listener("ngModelChange", function ReportesCertificadosComponent_Template_select_ngModelChange_40_listener($event) {
        return ctx.seleccionarTipo($event);
      });
      \u0275\u0275elementStart(41, "option", 10);
      \u0275\u0275text(42, "Todos los tipos");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(43, ReportesCertificadosComponent_For_44_Template, 2, 2, "option", 14, _forTrack0);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(45, "label");
      \u0275\u0275text(46, "Buscar en la p\xE1gina");
      \u0275\u0275elementStart(47, "input", 15);
      \u0275\u0275twoWayListener("ngModelChange", function ReportesCertificadosComponent_Template_input_ngModelChange_47_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.busqueda, $event) || (ctx.busqueda = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(48, "div", 16)(49, "button", 17)(50, "span", 5);
      \u0275\u0275text(51, "bar_chart");
      \u0275\u0275elementEnd();
      \u0275\u0275text(52, "Consultar");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(53, "button", 18);
      \u0275\u0275listener("click", function ReportesCertificadosComponent_Template_button_click_53_listener() {
        return ctx.limpiar();
      });
      \u0275\u0275elementStart(54, "span", 5);
      \u0275\u0275text(55, "toggle_off");
      \u0275\u0275elementEnd();
      \u0275\u0275text(56, "Limpiar filtros");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(57, "button", 19);
      \u0275\u0275listener("click", function ReportesCertificadosComponent_Template_button_click_57_listener() {
        return ctx.actualizar();
      });
      \u0275\u0275elementStart(58, "span", 5);
      \u0275\u0275text(59, "tune");
      \u0275\u0275elementEnd();
      \u0275\u0275text(60, "Actualizar");
      \u0275\u0275elementEnd()()();
      \u0275\u0275template(61, ReportesCertificadosComponent_Conditional_61_Template, 4, 2, "div", 20)(62, ReportesCertificadosComponent_Conditional_62_Template, 7, 4, "div", 16)(63, ReportesCertificadosComponent_Conditional_63_Template, 4, 1, "p", 20)(64, ReportesCertificadosComponent_Conditional_64_Template, 4, 0, "p", 21)(65, ReportesCertificadosComponent_Conditional_65_Template, 21, 10, "section", 22);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_15_0;
      let tmp_18_0;
      \u0275\u0275advance(25);
      \u0275\u0275twoWayProperty("ngModel", ctx.inicio);
      \u0275\u0275property("disabled", ctx.cargando());
      \u0275\u0275advance(3);
      \u0275\u0275twoWayProperty("ngModel", ctx.fin);
      \u0275\u0275property("disabled", ctx.cargando());
      \u0275\u0275advance(3);
      \u0275\u0275twoWayProperty("ngModel", ctx.estado);
      \u0275\u0275property("disabled", ctx.cargando());
      \u0275\u0275advance(9);
      \u0275\u0275twoWayProperty("ngModel", ctx.tipo);
      \u0275\u0275property("disabled", ctx.cargando() || ctx.cargandoTipos());
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.tiposDisponibles());
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.busqueda);
      \u0275\u0275property("disabled", ctx.cargando());
      \u0275\u0275advance(2);
      \u0275\u0275property("disabled", ctx.cargando());
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.cargando());
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.cargando());
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.errorTipos() ? 61 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_15_0 = ctx.catalogo()) ? 62 : -1, tmp_15_0);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.error() ? 63 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.cargando() ? 64 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_18_0 = ctx.pagina()) ? 65 : -1, tmp_18_0);
    }
  }, dependencies: [FormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, NgModel, NgForm], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n  padding: clamp(16px, 2vw, 28px);\n  background: #f4f7fb;\n  border-radius: 14px;\n  color: #24344b;\n  container-type: inline-size;\n}\n.reporte[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 24px;\n  width: 100%;\n  margin: 0;\n  min-width: 0;\n}\n.eyebrow[_ngcontent-%COMP%] {\n  color: #075a9b;\n  font-size: 0.7rem;\n  font-weight: 700;\n  letter-spacing: 0.12em;\n}\nh1[_ngcontent-%COMP%] {\n  margin: 8px 0 12px;\n  color: #173854;\n  font-size: clamp(1.5rem, 3vw, 2rem);\n  letter-spacing: -0.03em;\n}\nh2[_ngcontent-%COMP%] {\n  margin: 0 0 10px;\n  font-size: 1.05rem;\n}\np[_ngcontent-%COMP%] {\n  margin: 6px 0;\n  line-height: 1.65;\n}\n.subtitulo[_ngcontent-%COMP%], \nsmall[_ngcontent-%COMP%], \ncaption[_ngcontent-%COMP%] {\n  color: #54657b;\n  font-size: 0.875rem;\n}\n.panel[_ngcontent-%COMP%], \n.tarjeta[_ngcontent-%COMP%] {\n  min-width: 0;\n  padding: 22px;\n  background: white;\n  border: 1px solid #e1e8f0;\n  border-radius: 14px;\n  box-shadow: 0 3px 14px rgba(23, 56, 84, 0.0235294118);\n}\n.aviso[_ngcontent-%COMP%], \n.error[_ngcontent-%COMP%] {\n  padding: 16px 18px;\n  border: 1px solid #f1ddb2;\n  border-radius: 12px;\n  background: #fff9ed;\n  color: #795215;\n  font-size: 0.875rem;\n}\n.error[_ngcontent-%COMP%] {\n  border-color: #f1c9cb;\n  background: #fff1f2;\n  color: #9f2330;\n}\n.informacion[_ngcontent-%COMP%] {\n  border-color: #ccdef5;\n  background: #edf5ff;\n  color: #275584;\n}\n.aviso[_ngcontent-%COMP%]    > .material-symbols-outlined[_ngcontent-%COMP%], \n.error[_ngcontent-%COMP%]    > .material-symbols-outlined[_ngcontent-%COMP%] {\n  float: left;\n  margin-right: 10px;\n  font-size: 20px;\n}\ndetails[_ngcontent-%COMP%] {\n  margin-top: 12px;\n  font-size: 0.8rem;\n  line-height: 1.6;\n}\nsummary[_ngcontent-%COMP%] {\n  width: fit-content;\n  cursor: pointer;\n  font-weight: 600;\n  color: #075a9b;\n}\n.acciones[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 10px;\n}\n.btn[_ngcontent-%COMP%] {\n  min-width: 0;\n  max-width: 100%;\n  min-height: 44px;\n  border-radius: 9px;\n  font-size: 0.8125rem;\n  white-space: nowrap;\n  word-break: normal;\n  overflow-wrap: normal;\n}\n.btn[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%] {\n  flex: none;\n  font-size: 19px;\n}\n.btn-primario[_ngcontent-%COMP%] {\n  background: #075a9b;\n  border-color: #075a9b;\n  color: white;\n}\n.btn-primario[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #064a80;\n  color: white;\n}\n.btn-neutro[_ngcontent-%COMP%] {\n  color: #42536a;\n  border-color: #d3dce7;\n}\n.btn-exportar[_ngcontent-%COMP%] {\n  background: #147148;\n  border-color: #147148;\n  color: white;\n}\n.btn-exportar[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #105a39;\n  color: white;\n}\n[_ngcontent-%COMP%]:is(button, input[_ngcontent-%COMP%], select[_ngcontent-%COMP%], summary)[_ngcontent-%COMP%]:focus-visible {\n  outline: 3px solid #2563eb;\n  outline-offset: 3px;\n}\n.etiqueta[_ngcontent-%COMP%], \n.badge[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  padding: 5px 10px;\n  border-radius: 30px;\n  background: #fff2d9;\n  color: #795215;\n  font-size: 0.75rem;\n  font-weight: 600;\n}\n@container (max-width: 560px) {\n  .panel[_ngcontent-%COMP%], \n   .tarjeta[_ngcontent-%COMP%] {\n    padding: 16px;\n  }\n  .acciones[_ngcontent-%COMP%]    > .btn[_ngcontent-%COMP%] {\n    flex: 1 1 auto;\n  }\n}\n.filtros[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 180px), 1fr));\n  align-items: end;\n  gap: 20px 16px;\n}\n.filtros[_ngcontent-%COMP%]    > h2[_ngcontent-%COMP%], \n.filtros[_ngcontent-%COMP%]    > .acciones[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\n.filtros[_ngcontent-%COMP%]    > h2[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin: 0;\n  color: #173854;\n}\nlabel[_ngcontent-%COMP%] {\n  display: grid;\n  min-width: 0;\n  gap: 8px;\n  color: #42536a;\n  font-size: 0.8rem;\n  font-weight: 600;\n}\ninput[_ngcontent-%COMP%], \nselect[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n  min-height: 44px;\n  padding: 10px 12px;\n  border: 1px solid #c6d2e1;\n  border-radius: 8px;\n  background: #fff;\n  color: #24344b;\n  font: inherit;\n  font-size: 1rem;\n}\n[_ngcontent-%COMP%]:is(input, select)[_ngcontent-%COMP%]:disabled {\n  background: #f1f5f9;\n  color: #52647b;\n  cursor: not-allowed;\n}\n.filtros[_ngcontent-%COMP%]    > .acciones[_ngcontent-%COMP%] {\n  padding-top: 16px;\n  border-top: 1px solid #e8eef5;\n}\n.badge[_ngcontent-%COMP%] {\n  background: #edf2f8;\n  color: #475569;\n  white-space: nowrap;\n}\n.badge-exito[_ngcontent-%COMP%] {\n  background: #e8f6ef;\n  color: #17623f;\n}\n.estado[_ngcontent-%COMP%] {\n  padding: 20px;\n  color: #54657b;\n  text-align: center;\n  background: #f8fafc;\n  border: 1px dashed #cfdae7;\n  border-radius: 12px;\n}\n.estado[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%] {\n  vertical-align: middle;\n  margin-right: 8px;\n}\n.tabla[_ngcontent-%COMP%] {\n  min-width: 0;\n  max-width: 100%;\n  overflow-x: auto;\n  margin-top: 18px;\n  border: 1px solid #e1e8f0;\n  border-radius: 10px;\n}\ntable[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  text-align: left;\n  font-size: 0.8125rem;\n}\ncaption[_ngcontent-%COMP%] {\n  padding: 12px;\n  text-align: left;\n}\nth[_ngcontent-%COMP%], \ntd[_ngcontent-%COMP%] {\n  padding: 14px 16px;\n  border-bottom: 1px solid #e8eef5;\n  vertical-align: middle;\n}\nth[_ngcontent-%COMP%] {\n  background: #edf4fc;\n  color: #284e77;\n  font-weight: 600;\n  white-space: nowrap;\n}\ntd[_ngcontent-%COMP%] {\n  min-width: 110px;\n  max-width: 360px;\n  overflow-wrap: anywhere;\n  line-height: 1.6;\n}\ntbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover {\n  background: #f5f9ff;\n}\ntbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:last-child   td[_ngcontent-%COMP%] {\n  border-bottom: 0;\n}\n.paginacion[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: space-between;\n  align-items: center;\n  gap: 16px;\n  margin-top: 20px;\n  padding-top: 18px;\n  border-top: 1px solid #e8eef5;\n  font-size: 0.8125rem;\n}\n/*# sourceMappingURL=reportes-certificados.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ReportesCertificadosComponent, { className: "ReportesCertificadosComponent", filePath: "src\\app\\pages\\reportes\\reportes-certificados\\reportes-certificados.component.ts", lineNumber: 13 });
})();
export {
  ReportesCertificadosComponent
};
//# sourceMappingURL=chunk-UDO7FI5Q.js.map
