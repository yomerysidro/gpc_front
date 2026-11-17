import {
  FirmaDocumentalService
} from "./chunk-VIRURHM7.js";
import "./chunk-EBN2CSJT.js";
import {
  listoParaEntrega
} from "./chunk-AYHOUDOE.js";
import {
  CambiosCertificadosService
} from "./chunk-IQ6JWCBX.js";
import {
  DocumentosDigitalesService,
  mensajeEtapaA
} from "./chunk-U23GPSM7.js";
import {
  EmisionCertificadosService
} from "./chunk-4FUGVTHD.js";
import "./chunk-RJ22SAW5.js";
import {
  PageTitleComponent
} from "./chunk-YHURBVQM.js";
import {
  ActivatedRoute,
  Router,
  RouterLink
} from "./chunk-A36LAIDM.js";
import "./chunk-C4J44J4Z.js";
import "./chunk-LSGUT5KG.js";
import "./chunk-7PBBQCKX.js";
import {
  takeUntilDestroyed
} from "./chunk-IJ23LC2U.js";
import {
  DestroyRef,
  computed,
  forkJoin,
  inject,
  map,
  of,
  signal,
  switchMap,
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
  ɵɵpureFunction1,
  ɵɵpureFunction2,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate2
} from "./chunk-3ZDGBTDF.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-ZX6IUAQ5.js";

// src/app/pages/gerencia/documentos-por-firmar/documentos-por-firmar.component.ts
var _forTrack0 = ($index, $item) => $item.id_certificado_documento;
var _forTrack1 = ($index, $item) => $item.id_certificado + ":" + $item.id_certificado_documento;
var _c0 = (a0) => ["/pendientes/documentos-firmar", a0];
var _c1 = (a0) => ({ page: a0 });
var _c2 = (a0, a1) => ["/certificaciones/certificados", a0, "documentos", a1, "visor"];
var _c3 = (a0) => ({ origen: "gerencia", page: a0 });
function DocumentosPorFirmarComponent_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.aviso());
  }
}
function DocumentosPorFirmarComponent_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 9);
    \u0275\u0275text(1, "Cargando certificados...");
    \u0275\u0275elementEnd();
  }
}
function DocumentosPorFirmarComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 11);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 12);
    \u0275\u0275listener("click", function DocumentosPorFirmarComponent_Conditional_16_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.cargar());
    });
    \u0275\u0275text(3, "Reintentar");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.error());
  }
}
function DocumentosPorFirmarComponent_Conditional_17_Conditional_0_For_20_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const doc_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(doc_r3.sesion || (doc_r3.contexto == null ? null : doc_r3.contexto.sesion));
  }
}
function DocumentosPorFirmarComponent_Conditional_17_Conditional_0_For_20_For_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const firmante_r4 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(firmante_r4.nombre || firmante_r4.nombre_aprobado);
  }
}
function DocumentosPorFirmarComponent_Conditional_17_Conditional_0_For_20_ForEmpty_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Asignaci\xF3n de firmantes pendiente. ");
  }
}
function DocumentosPorFirmarComponent_Conditional_17_Conditional_0_For_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 18);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275template(7, DocumentosPorFirmarComponent_Conditional_17_Conditional_0_For_20_Conditional_7_Template, 2, 1, "small");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "td", 17);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "td");
    \u0275\u0275repeaterCreate(13, DocumentosPorFirmarComponent_Conditional_17_Conditional_0_For_20_For_14_Template, 2, 1, "div", null, \u0275\u0275repeaterTrackByIndex, false, DocumentosPorFirmarComponent_Conditional_17_Conditional_0_For_20_ForEmpty_15_Template, 1, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "td")(17, "a", 19)(18, "span", 5);
    \u0275\u0275text(19, "visibility");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_14_0;
    const doc_r3 = ctx.$implicit;
    const \u0275$index_72_r5 = ctx.$index;
    const datos_r6 = \u0275\u0275nextContext(2);
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(((tmp_14_0 = datos_r6.from) !== null && tmp_14_0 !== void 0 ? tmp_14_0 : (datos_r6.current_page - 1) * ((tmp_14_0 = datos_r6.per_page) !== null && tmp_14_0 !== void 0 ? tmp_14_0 : datos_r6.data.length) + 1) + \u0275$index_72_r5);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.beneficiario(doc_r3));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(doc_r3.origen === "practica" ? "Registro de pr\xE1cticas" : doc_r3.origen === "reconocimiento" ? "Reconocimiento municipal" : doc_r3.actividad || (doc_r3.contexto == null ? null : doc_r3.contexto.actividad) || "Origen no informado");
    \u0275\u0275advance();
    \u0275\u0275conditional(doc_r3.sesion || (doc_r3.contexto == null ? null : doc_r3.contexto.sesion) ? 7 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(doc_r3.tipo_certificado || (doc_r3.contexto == null ? null : doc_r3.contexto.tipo_certificado));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.estado(doc_r3));
    \u0275\u0275advance(2);
    \u0275\u0275repeater(doc_r3.firmantes);
    \u0275\u0275advance(4);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(9, _c0, doc_r3.id_certificado_documento))("queryParams", \u0275\u0275pureFunction1(11, _c1, datos_r6.current_page));
  }
}
function DocumentosPorFirmarComponent_Conditional_17_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13)(1, "table", 15)(2, "thead")(3, "tr")(4, "th", 16);
    \u0275\u0275text(5, "N.?");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Beneficiario");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Origen / actividad o periodo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Tipo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 17);
    \u0275\u0275text(13, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th");
    \u0275\u0275text(15, "Firmantes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th");
    \u0275\u0275text(17, "Acci\xF3n");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "tbody");
    \u0275\u0275repeaterCreate(19, DocumentosPorFirmarComponent_Conditional_17_Conditional_0_For_20_Template, 20, 13, "tr", null, _forTrack0);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const datos_r6 = \u0275\u0275nextContext();
    \u0275\u0275advance(19);
    \u0275\u0275repeater(datos_r6.data);
  }
}
function DocumentosPorFirmarComponent_Conditional_17_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 9);
    \u0275\u0275text(1, "No hay certificados pendientes de firma.");
    \u0275\u0275elementEnd();
  }
}
function DocumentosPorFirmarComponent_Conditional_17_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "nav", 14)(1, "button", 20);
    \u0275\u0275listener("click", function DocumentosPorFirmarComponent_Conditional_17_Conditional_2_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r7);
      const datos_r6 = \u0275\u0275nextContext();
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.cambiarPagina(datos_r6.current_page - 1));
    });
    \u0275\u0275text(2, "Anterior");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 20);
    \u0275\u0275listener("click", function DocumentosPorFirmarComponent_Conditional_17_Conditional_2_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r7);
      const datos_r6 = \u0275\u0275nextContext();
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.cambiarPagina(datos_r6.current_page + 1));
    });
    \u0275\u0275text(6, "Siguiente");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const datos_r6 = \u0275\u0275nextContext();
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.cargando() || datos_r6.current_page <= 1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("P\xE1gina ", datos_r6.current_page, " de ", datos_r6.last_page, "");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.cargando() || datos_r6.current_page >= datos_r6.last_page);
  }
}
function DocumentosPorFirmarComponent_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, DocumentosPorFirmarComponent_Conditional_17_Conditional_0_Template, 21, 0, "div", 13)(1, DocumentosPorFirmarComponent_Conditional_17_Conditional_1_Template, 2, 0, "p", 9)(2, DocumentosPorFirmarComponent_Conditional_17_Conditional_2_Template, 7, 4, "nav", 14);
  }
  if (rf & 2) {
    const datos_r6 = ctx;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275conditional(datos_r6.data.length ? 0 : !ctx_r0.cargando() && !ctx_r0.error() ? 1 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(datos_r6.last_page > 1 ? 2 : -1);
  }
}
function DocumentosPorFirmarComponent_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 9);
    \u0275\u0275text(1, "Cargando certificados...");
    \u0275\u0275elementEnd();
  }
}
function DocumentosPorFirmarComponent_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 11);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 12);
    \u0275\u0275listener("click", function DocumentosPorFirmarComponent_Conditional_20_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.cargarPreparados());
    });
    \u0275\u0275text(3, "Reintentar");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.errorPreparados());
  }
}
function DocumentosPorFirmarComponent_Conditional_21_Conditional_0_For_20_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const doc_r9 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(doc_r9.sesion);
  }
}
function DocumentosPorFirmarComponent_Conditional_21_Conditional_0_For_20_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const doc_r9 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", doc_r9.fecha_inicio_practica, " \u2013 ", doc_r9.fecha_fin_practica, "");
  }
}
function DocumentosPorFirmarComponent_Conditional_21_Conditional_0_For_20_For_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "small");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const responsable_r10 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(responsable_r10.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(responsable_r10.cargo);
  }
}
function DocumentosPorFirmarComponent_Conditional_21_Conditional_0_For_20_ForEmpty_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " No informados ");
  }
}
function DocumentosPorFirmarComponent_Conditional_21_Conditional_0_For_20_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 19)(1, "span", 5);
    \u0275\u0275text(2, "visibility");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const doc_r9 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction2(2, _c2, doc_r9.id_certificado, doc_r9.id_certificado_documento))("queryParams", \u0275\u0275pureFunction1(5, _c3, ctx_r0.paginaPreparadosActual()));
  }
}
function DocumentosPorFirmarComponent_Conditional_21_Conditional_0_For_20_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Sin PDF disponible ");
  }
}
function DocumentosPorFirmarComponent_Conditional_21_Conditional_0_For_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 23);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275template(7, DocumentosPorFirmarComponent_Conditional_21_Conditional_0_For_20_Conditional_7_Template, 2, 1, "small")(8, DocumentosPorFirmarComponent_Conditional_21_Conditional_0_For_20_Conditional_8_Template, 2, 2, "small");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td");
    \u0275\u0275repeaterCreate(12, DocumentosPorFirmarComponent_Conditional_21_Conditional_0_For_20_For_13_Template, 4, 2, "div", null, \u0275\u0275repeaterTrackByIndex, false, DocumentosPorFirmarComponent_Conditional_21_Conditional_0_For_20_ForEmpty_14_Template, 1, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "td", 17)(16, "span", 24);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "td");
    \u0275\u0275template(19, DocumentosPorFirmarComponent_Conditional_21_Conditional_0_For_20_Conditional_19_Template, 3, 7, "a", 19)(20, DocumentosPorFirmarComponent_Conditional_21_Conditional_0_For_20_Conditional_20_Template, 1, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const doc_r9 = ctx.$implicit;
    const \u0275$index_171_r11 = ctx.$index;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((ctx_r0.paginaPreparadosActual() - 1) * 20 + \u0275$index_171_r11 + 1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(doc_r9.nombre_completo);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(doc_r9.origen === "reconocimiento" || doc_r9.id_reconocimiento ? doc_r9.titulo_reconocimiento || "Reconocimiento municipal" : doc_r9.origen === "practica" || doc_r9.id_practica ? "Pr\xE1cticas" : doc_r9.actividad);
    \u0275\u0275advance();
    \u0275\u0275conditional(doc_r9.sesion ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(doc_r9.fecha_inicio_practica ? 8 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(doc_r9.tipo_certificado);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(doc_r9.responsables_administrativos);
    \u0275\u0275advance(4);
    \u0275\u0275attribute("data-estado", ctx_r0.estadoPreparado(doc_r9));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.estadoPreparado(doc_r9));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(doc_r9.hash_pdf && doc_r9.codigo_verificacion ? 19 : 20);
  }
}
function DocumentosPorFirmarComponent_Conditional_21_Conditional_0_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "nav", 22)(1, "button", 20);
    \u0275\u0275listener("click", function DocumentosPorFirmarComponent_Conditional_21_Conditional_0_Conditional_21_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.cambiarPagina(ctx_r0.paginaPreparadosActual() - 1));
    });
    \u0275\u0275text(2, "Anterior");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 20);
    \u0275\u0275listener("click", function DocumentosPorFirmarComponent_Conditional_21_Conditional_0_Conditional_21_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.cambiarPagina(ctx_r0.paginaPreparadosActual() + 1));
    });
    \u0275\u0275text(6, "Siguiente");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.paginaPreparadosActual() <= 1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("P\xE1gina ", ctx_r0.paginaPreparadosActual(), " de ", ctx_r0.paginasPreparados(), "");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.paginaPreparadosActual() >= ctx_r0.paginasPreparados());
  }
}
function DocumentosPorFirmarComponent_Conditional_21_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21)(1, "table", 15)(2, "thead")(3, "tr")(4, "th", 16);
    \u0275\u0275text(5, "N.\xBA");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Beneficiario");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Origen / actividad o periodo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Tipo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Firmantes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th", 17);
    \u0275\u0275text(15, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th");
    \u0275\u0275text(17, "Acci\xF3n");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "tbody");
    \u0275\u0275repeaterCreate(19, DocumentosPorFirmarComponent_Conditional_21_Conditional_0_For_20_Template, 21, 10, "tr", null, _forTrack1);
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(21, DocumentosPorFirmarComponent_Conditional_21_Conditional_0_Conditional_21_Template, 7, 4, "nav", 22);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(19);
    \u0275\u0275repeater(ctx_r0.preparadosVisibles());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.paginasPreparados() > 1 ? 21 : -1);
  }
}
function DocumentosPorFirmarComponent_Conditional_21_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 9);
    \u0275\u0275text(1, "No hay certificados preparados.");
    \u0275\u0275elementEnd();
  }
}
function DocumentosPorFirmarComponent_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, DocumentosPorFirmarComponent_Conditional_21_Conditional_0_Template, 22, 1)(1, DocumentosPorFirmarComponent_Conditional_21_Conditional_1_Template, 2, 0, "p", 9);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx.length ? 0 : !ctx_r0.errorPreparados() ? 1 : -1);
  }
}
var DocumentosPorFirmarComponent = class _DocumentosPorFirmarComponent {
  api = inject(DocumentosDigitalesService);
  destroyRef = inject(DestroyRef);
  route = inject(ActivatedRoute);
  router = inject(Router);
  firmas = inject(FirmaDocumentalService);
  pagina = signal(null);
  cargando = signal(false);
  error = signal(null);
  seleccionados = signal([]);
  resultados = signal(null);
  consultandoLote = signal(false);
  errorLote = signal(null);
  pestana = signal("pendientes");
  preparados = signal(null);
  cargandoPreparados = signal(false);
  errorPreparados = signal(null);
  paginaPreparados = signal(1);
  paginasPreparados = computed(() => Math.max(1, Math.ceil((this.preparados()?.length ?? 0) / 20)));
  paginaPreparadosActual = computed(() => Math.min(this.paginaPreparados(), this.paginasPreparados()));
  preparadosVisibles = computed(() => (this.preparados() ?? []).slice((this.paginaPreparadosActual() - 1) * 20, this.paginaPreparadosActual() * 20));
  estadoPreparado(doc) {
    return listoParaEntrega(doc) ? "Listo para entrega" : "Pendiente de firma";
  }
  catalogo = inject(EmisionCertificadosService);
  cargaPreparados;
  aviso = signal(this.router.getCurrentNavigation()?.extras.state?.["certificadoListo"] === true ? "Certificado listo para entrega" : "");
  numero = 1;
  carga;
  cambiosCertificados = inject(CambiosCertificadosService);
  ngOnInit() {
    this.cambiosCertificados.cambios$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.cargar();
      if (this.preparados() !== null || this.pestana() === "preparados")
        this.cargarPreparados();
    });
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const valor = params.get("documento");
      const page = Number(params.get("page"));
      const pagina = Number.isSafeInteger(page) && page > 0 ? page : 1;
      if (valor && /^[1-9]\d*$/.test(valor) && Number.isSafeInteger(Number(valor))) {
        void this.router.navigate(["/pendientes/documentos-firmar", Number(valor)], { queryParams: { page: pagina }, replaceUrl: true });
        return;
      }
      const pestana = params.get("pestana") === "preparados" ? "preparados" : "pendientes";
      this.pestana.set(pestana);
      this.paginaPreparados.set(pestana === "preparados" ? pagina : 1);
      if (!this.pagina() || pestana === "pendientes" && pagina !== this.numero)
        this.cargar(pestana === "pendientes" ? pagina : 1);
      if (pestana === "preparados" && this.preparados() === null && !this.cargandoPreparados())
        this.cargarPreparados();
    });
  }
  cargar(numero = this.numero) {
    this.carga?.unsubscribe();
    this.numero = numero;
    this.error.set(null);
    this.cargando.set(true);
    this.pagina.set(null);
    this.carga = this.api.pendientesFirma(numero).pipe(switchMap((pagina) => !pagina.data.length ? of(pagina) : forkJoin(pagina.data.map((doc) => this.firmas.progreso(doc.id_certificado_documento).pipe(map((p) => __spreadProps(__spreadValues({}, doc), {
      pdf_confirmado: p.pdf_confirmado ?? p.pdf_revisado_disponible ?? p.documento.pdf_confirmado ?? p.documento.pdf_revisado_disponible ?? doc.pdf_confirmado,
      disponible_rrhh: p.disponible_rrhh ?? p.documento.disponible_rrhh ?? doc.disponible_rrhh,
      estado_preparacion: p.estado_preparacion ?? p.documento.estado_preparacion ?? doc.estado_preparacion
    }))))).pipe(map((data) => __spreadProps(__spreadValues({}, pagina), { data })))), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (pagina) => {
        const data = pagina.data.filter((doc) => !listoParaEntrega(doc));
        this.pagina.set(__spreadProps(__spreadValues({}, pagina), { data }));
        this.seleccionados.set([]);
        this.resultados.set(null);
        this.cargando.set(false);
      },
      error: (error) => {
        this.error.set(mensajeEtapaA(error));
        this.cargando.set(false);
      }
    });
  }
  cambiarPagina(numero) {
    void this.router.navigate([], { relativeTo: this.route, queryParams: { page: numero }, queryParamsHandling: "merge" });
  }
  seleccionarPestana(pestana) {
    if (this.pestana() === pestana)
      return;
    this.aviso.set("");
    void this.router.navigate([], { relativeTo: this.route, queryParams: { pestana: pestana === "preparados" ? pestana : null, page: 1 }, queryParamsHandling: "merge" });
  }
  alTeclear(evento) {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(evento.key))
      return;
    evento.preventDefault();
    const destino = evento.key === "Home" ? "pendientes" : evento.key === "End" ? "preparados" : this.pestana() === "pendientes" ? "preparados" : "pendientes";
    this.seleccionarPestana(destino);
    evento.currentTarget.querySelector("#certificados-" + destino)?.focus();
  }
  cargarPreparados() {
    this.cargaPreparados?.unsubscribe();
    this.errorPreparados.set(null);
    this.cargandoPreparados.set(true);
    this.cargaPreparados = this.catalogo.catalogoAutorizado({}, "certificados-documentos").pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (filas) => {
        this.preparados.set(filas.filter((f) => !!f.id_certificado_documento && listoParaEntrega(f)));
        this.cargandoPreparados.set(false);
      },
      error: (e) => {
        this.preparados.set(null);
        this.errorPreparados.set(mensajeEtapaA(e));
        this.cargandoPreparados.set(false);
      }
    });
  }
  seleccionarDocumento(id, marcado) {
    if (this.consultandoLote())
      return;
    this.resultados.set(null);
    this.seleccionados.update((ids) => marcado ? [...ids.filter((i) => i !== id), id].slice(0, 100) : ids.filter((i) => i !== id));
  }
  consultarLote() {
    if (!this.seleccionados().length || this.consultandoLote())
      return;
    this.consultandoLote.set(true);
    this.errorLote.set(null);
    this.firmas.lote(this.seleccionados()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (r) => {
        this.resultados.set(r.resultados);
        this.consultandoLote.set(false);
      },
      error: (e) => {
        this.errorLote.set(e instanceof Error ? "No se pudo validar el resultado del lote." : mensajeEtapaA(e));
        this.consultandoLote.set(false);
      }
    });
  }
  beneficiario(doc) {
    return doc.beneficiario?.nombre || [doc.contexto?.nombres, doc.contexto?.apellido_paterno, doc.contexto?.apellido_materno].filter(Boolean).join(" ") || "Beneficiario no informado";
  }
  estado(doc) {
    return listoParaEntrega(doc) ? "Listo para entrega" : "Pendiente de firma";
  }
  static \u0275fac = function DocumentosPorFirmarComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DocumentosPorFirmarComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DocumentosPorFirmarComponent, selectors: [["app-documentos-por-firmar"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 22, vars: 15, consts: [[1, "encabezado-pagina"], ["aria-hidden", "true", 1, "material-symbols-outlined", "icono-pagina"], ["title", "Certificados por firmar"], ["role", "tablist", "aria-label", "Certificados por firmar", 1, "pestanas-gerencia", 3, "keydown"], ["type", "button", "role", "tab", "id", "certificados-pendientes", "aria-controls", "bandeja-certificados", 3, "click"], ["aria-hidden", "true", 1, "material-symbols-outlined"], ["type", "button", "role", "tab", "id", "certificados-preparados", "aria-controls", "bandeja-preparados", 3, "click"], ["role", "status", 1, "aviso-exito"], ["role", "tabpanel", "id", "bandeja-certificados", "aria-labelledby", "certificados-pendientes", 1, "card", 3, "hidden"], ["role", "status"], ["role", "tabpanel", "id", "bandeja-preparados", "aria-labelledby", "certificados-preparados", 1, "card", 3, "hidden"], ["role", "alert", 1, "error"], ["type", "button", 1, "btn", 3, "click"], ["role", "region", "tabindex", "0", "aria-label", "Pendientes de firma", 1, "tabla-scroll"], ["aria-label", "Paginaci\xF3n de pendientes", 1, "paginacion"], [1, "table"], ["scope", "col", 1, "col-centro", "col-numero"], [1, "col-centro"], [1, "col-centro", "col-numero"], ["aria-label", "Ver documento", "title", "Ver documento", 1, "btn", "btn-icono", 3, "routerLink", "queryParams"], ["type", "button", 1, "btn", 3, "click", "disabled"], ["role", "region", "tabindex", "0", "aria-label", "Certificados preparados", 1, "tabla-scroll"], ["aria-label", "Paginaci\xF3n de preparados", 1, "paginacion"], ["data-label", "N.\xBA", 1, "col-centro", "col-numero"], [1, "estado-listo"]], template: function DocumentosPorFirmarComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "header", 0)(1, "span", 1);
      \u0275\u0275text(2, "draw");
      \u0275\u0275elementEnd();
      \u0275\u0275element(3, "app-page-title", 2);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "div", 3);
      \u0275\u0275listener("keydown", function DocumentosPorFirmarComponent_Template_div_keydown_4_listener($event) {
        return ctx.alTeclear($event);
      });
      \u0275\u0275elementStart(5, "button", 4);
      \u0275\u0275listener("click", function DocumentosPorFirmarComponent_Template_button_click_5_listener() {
        return ctx.seleccionarPestana("pendientes");
      });
      \u0275\u0275elementStart(6, "span", 5);
      \u0275\u0275text(7, "pending_actions");
      \u0275\u0275elementEnd();
      \u0275\u0275text(8, "Pendientes de firma");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "button", 6);
      \u0275\u0275listener("click", function DocumentosPorFirmarComponent_Template_button_click_9_listener() {
        return ctx.seleccionarPestana("preparados");
      });
      \u0275\u0275elementStart(10, "span", 5);
      \u0275\u0275text(11, "verified");
      \u0275\u0275elementEnd();
      \u0275\u0275text(12, "Certificados preparados");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(13, DocumentosPorFirmarComponent_Conditional_13_Template, 2, 1, "p", 7);
      \u0275\u0275elementStart(14, "section", 8);
      \u0275\u0275template(15, DocumentosPorFirmarComponent_Conditional_15_Template, 2, 0, "p", 9)(16, DocumentosPorFirmarComponent_Conditional_16_Template, 4, 1)(17, DocumentosPorFirmarComponent_Conditional_17_Template, 3, 2);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "section", 10);
      \u0275\u0275template(19, DocumentosPorFirmarComponent_Conditional_19_Template, 2, 0, "p", 9)(20, DocumentosPorFirmarComponent_Conditional_20_Template, 4, 1)(21, DocumentosPorFirmarComponent_Conditional_21_Template, 2, 1);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_9_0;
      let tmp_14_0;
      \u0275\u0275advance(5);
      \u0275\u0275attribute("aria-selected", ctx.pestana() === "pendientes")("tabindex", ctx.pestana() === "pendientes" ? 0 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275attribute("aria-selected", ctx.pestana() === "preparados")("tabindex", ctx.pestana() === "preparados" ? 0 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.aviso() ? 13 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("hidden", ctx.pestana() !== "pendientes");
      \u0275\u0275attribute("aria-busy", ctx.cargando());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.cargando() ? 15 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.error() ? 16 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_9_0 = ctx.pagina()) ? 17 : -1, tmp_9_0);
      \u0275\u0275advance();
      \u0275\u0275property("hidden", ctx.pestana() !== "preparados");
      \u0275\u0275attribute("aria-busy", ctx.cargandoPreparados());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.cargandoPreparados() ? 19 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.errorPreparados() ? 20 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_14_0 = !ctx.cargandoPreparados() && ctx.preparados()) ? 21 : -1, tmp_14_0);
    }
  }, dependencies: [PageTitleComponent, RouterLink], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\n.encabezado[_ngcontent-%COMP%], \n.acciones[_ngcontent-%COMP%], \n.paginacion[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  flex-wrap: wrap;\n  gap: 0.75rem;\n  margin: 1rem 0;\n}\n.acciones[_ngcontent-%COMP%] {\n  justify-content: flex-start;\n}\n.indicadores[_ngcontent-%COMP%], \n.documentos[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));\n  gap: 1rem;\n  margin: 1.5rem 0;\n}\n.indicador[_ngcontent-%COMP%] {\n  border-top: 3px solid #075a9b;\n}\n.indicador[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  display: block;\n  color: #075a9b;\n  font-size: 1.65rem;\n}\n.indicador[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.25rem 0;\n}\n.filtros[_ngcontent-%COMP%], \n.form-grid[_ngcontent-%COMP%], \n.detalle[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));\n  gap: 1rem;\n}\n.form-grid[_ngcontent-%COMP%] {\n  margin: 1rem 0;\n}\n.filtros-personales[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(0, 36rem);\n  margin-block: 1rem;\n}\n.filtros-personales[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%] {\n  margin-bottom: 0;\n}\n.titulo-y-descripcion[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n}\n.fila-titulo[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n  flex-wrap: wrap;\n}\n.acciones-cabecera[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  flex-wrap: nowrap;\n  gap: 0.5rem;\n  max-width: 100%;\n  min-width: 0;\n  margin-inline-start: auto;\n}\n.boton-busqueda[_ngcontent-%COMP%] {\n  color: #075a9b;\n  padding: 0.65rem;\n}\n.busqueda-desplegable[_ngcontent-%COMP%] {\n  position: absolute;\n  inset-inline-end: calc(100% + 0.5rem);\n  top: 50%;\n  transform: translateY(-50%);\n  z-index: 1;\n  display: flex;\n  align-items: center;\n  width: clamp(7rem, 24vw, 22rem);\n  min-width: 0;\n}\n@media (max-width: 600px) {\n  .busqueda-desplegable[_ngcontent-%COMP%] {\n    width: min(11rem, 100vw - 14rem);\n  }\n}\n.busqueda-desplegable[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  overflow: hidden;\n  clip-path: inset(50%);\n}\n.busqueda-desplegable[hidden][_ngcontent-%COMP%] {\n  display: none;\n}\n.busqueda-desplegable[_ngcontent-%COMP%]:not([hidden]) {\n  animation: _ngcontent-%COMP%_desplegar-busqueda 0.2s ease-out;\n}\n@keyframes _ngcontent-%COMP%_desplegar-busqueda {\n  from {\n    clip-path: inset(0 0 0 100%);\n  }\n  to {\n    clip-path: inset(0);\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .busqueda-desplegable[_ngcontent-%COMP%]:not([hidden]) {\n    animation: none;\n  }\n}\n.busqueda-desplegable[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%] {\n  flex: 1;\n  margin: 0;\n}\n.indicadores-compactos[_ngcontent-%COMP%] {\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 0.75rem;\n  margin: 1rem 0;\n}\n.indicadores-compactos[_ngcontent-%COMP%]   .indicador[_ngcontent-%COMP%] {\n  padding: 0.75rem 1rem;\n  margin: 0;\n}\n.indicadores-compactos[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 1.4rem;\n  line-height: 1.2;\n}\n.indicadores-compactos[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  margin: 0.25rem 0 0;\n}\n.busqueda-con-icono[_ngcontent-%COMP%] {\n  position: relative;\n}\n.busqueda-con-icono[_ngcontent-%COMP%]    > .material-symbols-outlined[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 0.85rem;\n  top: 50%;\n  transform: translateY(-50%);\n  color: #075a9b;\n  pointer-events: none;\n}\n.busqueda-con-icono[_ngcontent-%COMP%]    > .input[_ngcontent-%COMP%] {\n  padding-inline-start: 2.75rem;\n}\n.ancho[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\n.tabla-scroll[_ngcontent-%COMP%] {\n  overflow-x: auto;\n  max-width: 100%;\n}\n.table[_ngcontent-%COMP%] {\n  min-width: 55rem;\n}\n.table[_ngcontent-%COMP%]   caption[_ngcontent-%COMP%] {\n  text-align: left;\n  padding: 0.75rem 0;\n  color: #526170;\n}\n.table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  vertical-align: top;\n}\n.table[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  display: block;\n  margin-top: 0.3rem;\n}\n.table[_ngcontent-%COMP%]   .acciones[_ngcontent-%COMP%] {\n  margin: 0;\n  min-width: 12rem;\n}\n.detalle[_ngcontent-%COMP%] {\n  margin: 1rem 0;\n}\n.detalle[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.detalle[_ngcontent-%COMP%]   dt[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: #075a9b;\n}\n.detalle[_ngcontent-%COMP%]   dd[_ngcontent-%COMP%] {\n  margin: 0.3rem 0 1rem;\n  white-space: pre-wrap;\n  overflow-wrap: anywhere;\n}\n.error[_ngcontent-%COMP%] {\n  color: #a52d2d;\n  margin: 0.35rem 0;\n}\n.aviso[_ngcontent-%COMP%] {\n  padding: 0.8rem;\n  border: 1px solid #b5cad9;\n  background: #f0f7fb;\n  border-radius: 0.4rem;\n  margin-bottom: 1rem;\n}\n.vacio[_ngcontent-%COMP%] {\n  padding: 2rem 1rem;\n  text-align: center;\n  color: #526170;\n}\n.encabezado-pagina[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 1rem;\n  align-items: center;\n  margin-bottom: 1rem;\n}\n.encabezado-pagina[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], \n.ayuda[_ngcontent-%COMP%] {\n  color: #64748b;\n  margin: 0.25rem 0;\n  font-size: 0.9rem;\n}\n.icono-pagina[_ngcontent-%COMP%] {\n  box-sizing: content-box;\n  flex-shrink: 0;\n  color: #075a9b;\n  background: #eaf3fa;\n  border-radius: 0.75rem;\n  padding: 0.75rem;\n}\n.form-field[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.form-field[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: block;\n  font-weight: 600;\n  margin-bottom: 0.45rem;\n}\n.form-field[_ngcontent-%COMP%]   .input[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n}\n.form-field[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 0.8rem;\n  color: #64748b;\n  margin-top: 0.4rem;\n}\n.visor-documento[_ngcontent-%COMP%] {\n  width: 100%;\n  min-height: 60vh;\n  border: 1px solid #075a9b;\n  background: #fff;\n}\n@media (max-width: 600px) {\n  .indicadores-compactos[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .encabezado[_ngcontent-%COMP%] {\n    align-items: stretch;\n  }\n  .filtros[_ngcontent-%COMP%], \n   .form-grid[_ngcontent-%COMP%], \n   .detalle[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .acciones[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n    flex: 1 1 auto;\n  }\n  .card[_ngcontent-%COMP%] {\n    padding: 1rem;\n  }\n  .icono-pagina[_ngcontent-%COMP%] {\n    display: none;\n  }\n}\n/*# sourceMappingURL=solicitudes.css.map */", "\n\n.pestanas-gerencia[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.25rem;\n  border-bottom: 1px solid #d5dee8;\n  margin-bottom: 1rem;\n  flex-wrap: wrap;\n}\n.pestanas-gerencia[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.4rem;\n  padding: 0.6rem 0.8rem;\n  background: transparent;\n  border: 0;\n  border-bottom: 3px solid transparent;\n  color: #52677b;\n  cursor: pointer;\n  font: inherit;\n  font-size: 0.9rem;\n}\n.pestanas-gerencia[_ngcontent-%COMP%]   [aria-selected=true][_ngcontent-%COMP%] {\n  color: #075a9b;\n  border-bottom-color: #d6ad4a;\n  font-weight: 600;\n}\n.pestanas-gerencia[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%] {\n  font-size: 1.2rem;\n}\n.estado-listo[_ngcontent-%COMP%] {\n  display: inline-block;\n  color: #21643b;\n  background: #e8f5ec;\n  border-radius: 1rem;\n  padding: 0.2rem 0.6rem;\n  font-size: 0.85rem;\n}\n[hidden][_ngcontent-%COMP%] {\n  display: none !important;\n}\n.aviso-exito[_ngcontent-%COMP%] {\n  color: #21643b;\n  margin-bottom: 0.75rem;\n}\n@media (max-width: 600px) {\n  .pestanas-gerencia[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n    flex: 1;\n    font-size: 0.85rem;\n    justify-content: center;\n  }\n}\n/*# sourceMappingURL=documentos-por-firmar.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DocumentosPorFirmarComponent, { className: "DocumentosPorFirmarComponent", filePath: "src\\app\\pages\\gerencia\\documentos-por-firmar\\documentos-por-firmar.component.ts", lineNumber: 20 });
})();
export {
  DocumentosPorFirmarComponent
};
//# sourceMappingURL=chunk-Y7CTOK6X.js.map
