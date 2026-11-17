import './polyfills.server.mjs';
import {
  FirmaDocumentalService
} from "./chunk-3UCYPJKG.mjs";
import {
  listoParaEntrega,
  pdfConfirmado
} from "./chunk-7CXPU5UM.mjs";
import "./chunk-GOWFKFWD.mjs";
import {
  VisorPdfComponent
} from "./chunk-FBTDJ3RZ.mjs";
import "./chunk-ZLU2ZG5B.mjs";
import {
  CambiosCertificadosService
} from "./chunk-ZIVCKBVU.mjs";
import {
  DocumentosDigitalesService,
  decodificarVistaPrevia,
  mensajeEtapaA
} from "./chunk-R23RR7XQ.mjs";
import {
  ActivatedRoute,
  Router,
  RouterLink
} from "./chunk-OX7VSSQH.mjs";
import "./chunk-VNKXA6HD.mjs";
import {
  AuthService
} from "./chunk-NP7M7R34.mjs";
import "./chunk-JMI3IFFT.mjs";
import "./chunk-HFD7K63G.mjs";
import {
  takeUntilDestroyed
} from "./chunk-TSKSZVR2.mjs";
import "./chunk-TNXV45E5.mjs";
import {
  FormsModule,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  SelectControlValueAccessor,
  ɵNgSelectMultipleOption
} from "./chunk-SPQE7PSN.mjs";
import {
  DestroyRef,
  EMPTY,
  Subject,
  Subscription,
  TimeoutError,
  catchError,
  defer,
  finalize,
  inject,
  map,
  of,
  signal,
  switchMap,
  tap,
  throwError,
  timeout,
  timer,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate3
} from "./chunk-OYAKRC2F.mjs";
import {
  __async,
  __spreadProps,
  __spreadValues
} from "./chunk-X7LY3JHO.mjs";

// src/app/pages/gerencia/documentos-por-firmar/detalle-documento.component.ts
var _forTrack0 = ($index, $item) => $item.id_persona_trabajador;
var _c0 = (a0) => ({ page: a0 });
var _c1 = () => ["disponibles", "guardar", "cancelar", "recuperacion"];
var _c2 = () => [];
function DetalleDocumentoComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 3);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.disponibleRrhh() ? "Listo para entrega" : "Pendiente de firma");
  }
}
function DetalleDocumentoComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 4);
    \u0275\u0275text(1, "Consultando documento\u2026");
    \u0275\u0275elementEnd();
  }
}
function DetalleDocumentoComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 6);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 7);
    \u0275\u0275listener("click", function DetalleDocumentoComponent_Conditional_8_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.cargarDocumento());
    });
    \u0275\u0275text(3, "Reintentar documento");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.errores()["documento"]);
  }
}
function DetalleDocumentoComponent_Conditional_9_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const doc_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3("", doc_r3.beneficiario == null ? null : doc_r3.beneficiario.nombre, " \xB7 ", doc_r3.tipo_certificado, " \xB7 ", doc_r3.origen === "practica" ? "Registro de pr\xE1cticas" : "Reconocimiento municipal", "");
  }
}
function DetalleDocumentoComponent_Conditional_9_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Actualizando vista previa...");
    \u0275\u0275elementEnd();
  }
}
function DetalleDocumentoComponent_Conditional_9_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 6);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.errorPrevia());
  }
}
function DetalleDocumentoComponent_Conditional_9_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Preparando la nueva vista previa. El PDF anterior permanece visible.");
    \u0275\u0275elementEnd();
  }
}
function DetalleDocumentoComponent_Conditional_9_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Vista previa \u2014 cambios sin guardar");
    \u0275\u0275elementEnd();
  }
}
function DetalleDocumentoComponent_Conditional_9_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-visor-pdf", 16);
    \u0275\u0275listener("archivoCargado", function DetalleDocumentoComponent_Conditional_9_Conditional_8_Template_app_visor_pdf_archivoCargado_0_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.vigente.set($event));
    })("archivoVisualizado", function DetalleDocumentoComponent_Conditional_9_Conditional_8_Template_app_visor_pdf_archivoVisualizado_0_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.pdfVisualizado($event));
    })("errorVisualizacion", function DetalleDocumentoComponent_Conditional_9_Conditional_8_Template_app_visor_pdf_errorVisualizacion_0_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.falloVisor($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const doc_r3 = \u0275\u0275nextContext();
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("integrado", true)("archivoPrevio", ctx_r0.seleccionando() && ctx_r0.seleccion().length && ctx_r0.previa() ? ctx_r0.previa() : ctx_r0.vigente())("textosEsperados", ctx_r0.seleccionando() && ctx_r0.seleccion().length && ctx_r0.previa() ? ctx_r0.textosPrevia() : \u0275\u0275pureFunction0(9, _c2))("persistido", !ctx_r0.seleccionando() || !ctx_r0.previa())("documentoId", doc_r3.id_certificado_documento)("hashEsperado", doc_r3.hash_pdf)("flujoFirmas", true)("controlesZoom", true)("mostrarDescripcion", false);
  }
}
function DetalleDocumentoComponent_Conditional_9_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "No tiene permisos para descargar el PDF.");
    \u0275\u0275elementEnd();
  }
}
function DetalleDocumentoComponent_Conditional_9_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 4);
    \u0275\u0275text(1, "Documento confirmado");
    \u0275\u0275elementEnd();
  }
}
function DetalleDocumentoComponent_Conditional_9_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 17);
    \u0275\u0275listener("click", function DetalleDocumentoComponent_Conditional_9_Conditional_18_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.abrirSeleccion());
    });
    \u0275\u0275text(1, "Seleccionar firmantes");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", !ctx_r0.puedeAsignar() || ctx_r0.ocupada());
  }
}
function DetalleDocumentoComponent_Conditional_9_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 4);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.aviso());
  }
}
function DetalleDocumentoComponent_Conditional_9_Conditional_20_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 4);
    \u0275\u0275text(1, "Consultando funcionarios\u2026");
    \u0275\u0275elementEnd();
  }
}
function DetalleDocumentoComponent_Conditional_9_Conditional_20_For_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 33)(1, "input", 34);
    \u0275\u0275listener("change", function DetalleDocumentoComponent_Conditional_9_Conditional_20_For_6_Template_input_change_1_listener() {
      const t_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.alternar(t_r8));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span", 35)(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "small");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const t_r8 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("seleccionado", ctx_r0.marcado(t_r8));
    \u0275\u0275advance();
    \u0275\u0275property("checked", ctx_r0.marcado(t_r8))("disabled", ctx_r0.ocupada() || ctx_r0.requiereActualizar());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(t_r8.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(t_r8.cargo);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(t_r8.area || "\xC1rea no informada");
  }
}
function DetalleDocumentoComponent_Conditional_9_Conditional_20_ForEmpty_7_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "No hay funcionarios habilitados para este certificado");
    \u0275\u0275elementEnd();
  }
}
function DetalleDocumentoComponent_Conditional_9_Conditional_20_ForEmpty_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, DetalleDocumentoComponent_Conditional_9_Conditional_20_ForEmpty_7_Conditional_0_Template, 2, 0, "p");
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275conditional(!ctx_r0.cargas().has("disponibles") && !ctx_r0.errores()["disponibles"] ? 0 : -1);
  }
}
function DetalleDocumentoComponent_Conditional_9_Conditional_20_Conditional_17_For_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li")(1, "span", 38);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 39);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 40)(6, "button", 41);
    \u0275\u0275listener("click", function DetalleDocumentoComponent_Conditional_9_Conditional_20_Conditional_17_For_5_Template_button_click_6_listener() {
      const \u0275$index_140_r10 = \u0275\u0275restoreView(_r9).$index;
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.mover(\u0275$index_140_r10, -1));
    });
    \u0275\u0275elementStart(7, "span", 42);
    \u0275\u0275text(8, "chevron_right");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "button", 43);
    \u0275\u0275listener("click", function DetalleDocumentoComponent_Conditional_9_Conditional_20_Conditional_17_For_5_Template_button_click_9_listener() {
      const \u0275$index_140_r10 = \u0275\u0275restoreView(_r9).$index;
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.mover(\u0275$index_140_r10, 1));
    });
    \u0275\u0275elementStart(10, "span", 44);
    \u0275\u0275text(11, "chevron_right");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const t_r11 = ctx.$implicit;
    const \u0275$index_140_r10 = ctx.$index;
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275$index_140_r10 + 1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(t_r11.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", \u0275$index_140_r10 === 0 || ctx_r0.ocupada() || ctx_r0.requiereActualizar());
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", \u0275$index_140_r10 === ctx_r0.seleccion().length - 1 || ctx_r0.ocupada() || ctx_r0.requiereActualizar());
  }
}
function DetalleDocumentoComponent_Conditional_9_Conditional_20_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 28)(1, "h3", 36);
    \u0275\u0275text(2, "Orden de responsables");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "ol", 37);
    \u0275\u0275repeaterCreate(4, DetalleDocumentoComponent_Conditional_9_Conditional_20_Conditional_17_For_5_Template, 12, 4, "li", null, _forTrack0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r0.seleccion());
  }
}
function DetalleDocumentoComponent_Conditional_9_Conditional_20_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 45);
    \u0275\u0275listener("click", function DetalleDocumentoComponent_Conditional_9_Conditional_20_Conditional_19_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.actualizarPrevia());
    });
    \u0275\u0275text(1, "Actualizar vista previa");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275property("disabled", ctx_r0.ocupada() || ctx_r0.requiereActualizar());
  }
}
function DetalleDocumentoComponent_Conditional_9_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 18)(1, "h3", 19);
    \u0275\u0275text(2, "Responsables");
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, DetalleDocumentoComponent_Conditional_9_Conditional_20_Conditional_3_Template, 2, 0, "p", 4);
    \u0275\u0275elementStart(4, "div", 20);
    \u0275\u0275repeaterCreate(5, DetalleDocumentoComponent_Conditional_9_Conditional_20_For_6_Template, 9, 7, "label", 21, _forTrack0, false, DetalleDocumentoComponent_Conditional_9_Conditional_20_ForEmpty_7_Template, 1, 1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "section", 22)(9, "h3", 23)(10, "label", 24);
    \u0275\u0275text(11, "Modalidad de firma");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "select", 25);
    \u0275\u0275listener("ngModelChange", function DetalleDocumentoComponent_Conditional_9_Conditional_20_Template_select_ngModelChange_12_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.cambiarModalidad($event));
    });
    \u0275\u0275elementStart(13, "option", 26);
    \u0275\u0275text(14, "Paralela");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "option", 27);
    \u0275\u0275text(16, "Secuencial");
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(17, DetalleDocumentoComponent_Conditional_9_Conditional_20_Conditional_17_Template, 6, 0, "section", 28);
    \u0275\u0275elementStart(18, "div", 29);
    \u0275\u0275template(19, DetalleDocumentoComponent_Conditional_9_Conditional_20_Conditional_19_Template, 2, 1, "button", 30);
    \u0275\u0275elementStart(20, "button", 31);
    \u0275\u0275listener("click", function DetalleDocumentoComponent_Conditional_9_Conditional_20_Template_button_click_20_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.guardar());
    });
    \u0275\u0275text(21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "button", 32);
    \u0275\u0275listener("click", function DetalleDocumentoComponent_Conditional_9_Conditional_20_Template_button_click_22_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.cancelar());
    });
    \u0275\u0275text(23, "Cancelar selecci\xF3n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r0.cargas().has("disponibles") ? 3 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r0.disponibles());
    \u0275\u0275advance(7);
    \u0275\u0275property("ngModel", ctx_r0.modalidad())("disabled", ctx_r0.ocupada() || ctx_r0.requiereActualizar());
    \u0275\u0275advance(5);
    \u0275\u0275conditional(ctx_r0.seleccion().length ? 17 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx_r0.listaParaGuardar() && !ctx_r0.previaCargando() && ctx_r0.seleccion().length ? 19 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !ctx_r0.requiereActualizar() && !ctx_r0.listaParaGuardar() || ctx_r0.ocupada());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.requiereActualizar() ? "Actualizar estado" : "Guardar y poner a disposici\xF3n");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.ocupada() || ctx_r0.requiereActualizar());
  }
}
function DetalleDocumentoComponent_Conditional_9_Conditional_21_For_4_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r13 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(f_r13.area);
  }
}
function DetalleDocumentoComponent_Conditional_9_Conditional_21_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 48)(1, "strong");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, DetalleDocumentoComponent_Conditional_9_Conditional_21_For_4_Conditional_5_Template, 2, 1, "small");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r13 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(f_r13.nombre || f_r13.nombre_aprobado);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(f_r13.cargo || f_r13.cargo_aprobado);
    \u0275\u0275advance();
    \u0275\u0275conditional(f_r13.area ? 5 : -1);
  }
}
function DetalleDocumentoComponent_Conditional_9_Conditional_21_ForEmpty_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "Firmantes pendientes de asignaci\xF3n");
    \u0275\u0275elementEnd();
  }
}
function DetalleDocumentoComponent_Conditional_9_Conditional_21_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 49)(1, "h3", 51);
    \u0275\u0275text(2, "Modalidad de firma");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 52);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx === "SECUENCIAL" ? "Secuencial" : "Paralela");
  }
}
function DetalleDocumentoComponent_Conditional_9_Conditional_21_Conditional_7_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li")(1, "span", 38);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 39);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const f_r14 = ctx.$implicit;
    const \u0275$index_213_r15 = ctx.$index;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(f_r14.orden_firma || \u0275$index_213_r15 + 1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(f_r14.nombre || f_r14.nombre_aprobado);
  }
}
function DetalleDocumentoComponent_Conditional_9_Conditional_21_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 50)(1, "h3", 53);
    \u0275\u0275text(2, "Orden de responsables");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "ol", 37);
    \u0275\u0275repeaterCreate(4, DetalleDocumentoComponent_Conditional_9_Conditional_21_Conditional_7_For_5_Template, 5, 2, "li", null, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r0.firmantesOrdenados());
  }
}
function DetalleDocumentoComponent_Conditional_9_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 46)(1, "h3", 47);
    \u0275\u0275text(2, "Responsables");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(3, DetalleDocumentoComponent_Conditional_9_Conditional_21_For_4_Template, 6, 3, "div", 48, \u0275\u0275repeaterTrackByIndex, false, DetalleDocumentoComponent_Conditional_9_Conditional_21_ForEmpty_5_Template, 2, 0, "p");
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, DetalleDocumentoComponent_Conditional_9_Conditional_21_Conditional_6_Template, 5, 1, "section", 49)(7, DetalleDocumentoComponent_Conditional_9_Conditional_21_Conditional_7_Template, 6, 0, "section", 50);
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r0.firmantesOrdenados());
    \u0275\u0275advance(3);
    \u0275\u0275conditional((tmp_4_0 = ctx_r0.modalidadAplicada()) ? 6 : -1, tmp_4_0);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.firmantesOrdenados().length ? 7 : -1);
  }
}
function DetalleDocumentoComponent_Conditional_9_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 4);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.cargas().has("guardar") ? "Guardando certificado..." : "Cargando certificado...");
  }
}
function DetalleDocumentoComponent_Conditional_9_For_24_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 6);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const clave_r16 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.errores()[clave_r16]);
  }
}
function DetalleDocumentoComponent_Conditional_9_For_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, DetalleDocumentoComponent_Conditional_9_For_24_Conditional_0_Template, 2, 1, "p", 6);
  }
  if (rf & 2) {
    const clave_r16 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(ctx_r0.errores()[clave_r16] ? 0 : -1);
  }
}
function DetalleDocumentoComponent_Conditional_9_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 4);
    \u0275\u0275text(1, "Consultando firmas\u2026");
    \u0275\u0275elementEnd();
  }
}
function DetalleDocumentoComponent_Conditional_9_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 6);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 45);
    \u0275\u0275listener("click", function DetalleDocumentoComponent_Conditional_9_Conditional_26_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r17);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.actualizarProgreso());
    });
    \u0275\u0275text(3, "Reintentar consulta del documento");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.errores()["progreso"] || "No se pudo verificar el documento.");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.cargas().has("progreso") || ctx_r0.ocupada());
  }
}
function DetalleDocumentoComponent_Conditional_9_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 6);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 45);
    \u0275\u0275listener("click", function DetalleDocumentoComponent_Conditional_9_Conditional_27_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r18);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.verificarIntegridad());
    });
    \u0275\u0275text(3, "Reintentar verificaci\xF3n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.errores()["integridad"]);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.cargas().has("integridad") || ctx_r0.ocupada());
  }
}
function DetalleDocumentoComponent_Conditional_9_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 6);
    \u0275\u0275text(1, "No se pudo verificar el documento.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 45);
    \u0275\u0275listener("click", function DetalleDocumentoComponent_Conditional_9_Conditional_28_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r19);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.verificarIntegridad());
    });
    \u0275\u0275text(3, "Reintentar verificaci\xF3n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.cargas().has("integridad") || ctx_r0.ocupada());
  }
}
function DetalleDocumentoComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, DetalleDocumentoComponent_Conditional_9_Conditional_0_Template, 2, 3, "p");
    \u0275\u0275elementStart(1, "div", 5)(2, "section", 8)(3, "div", 9);
    \u0275\u0275template(4, DetalleDocumentoComponent_Conditional_9_Conditional_4_Template, 2, 0, "span")(5, DetalleDocumentoComponent_Conditional_9_Conditional_5_Template, 2, 1, "span", 6)(6, DetalleDocumentoComponent_Conditional_9_Conditional_6_Template, 2, 0, "span")(7, DetalleDocumentoComponent_Conditional_9_Conditional_7_Template, 2, 0, "span");
    \u0275\u0275elementEnd();
    \u0275\u0275template(8, DetalleDocumentoComponent_Conditional_9_Conditional_8_Template, 1, 10, "app-visor-pdf", 10)(9, DetalleDocumentoComponent_Conditional_9_Conditional_9_Template, 2, 0, "p");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "aside", 11)(11, "section", 12)(12, "header", 13)(13, "h2", 14);
    \u0275\u0275text(14, "Firmas del certificado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "span", 3);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(17, DetalleDocumentoComponent_Conditional_9_Conditional_17_Template, 2, 0, "p", 4)(18, DetalleDocumentoComponent_Conditional_9_Conditional_18_Template, 2, 1, "button", 15)(19, DetalleDocumentoComponent_Conditional_9_Conditional_19_Template, 2, 1, "p", 4)(20, DetalleDocumentoComponent_Conditional_9_Conditional_20_Template, 24, 9)(21, DetalleDocumentoComponent_Conditional_9_Conditional_21_Template, 8, 3)(22, DetalleDocumentoComponent_Conditional_9_Conditional_22_Template, 2, 1, "p", 4);
    \u0275\u0275repeaterCreate(23, DetalleDocumentoComponent_Conditional_9_For_24_Template, 1, 1, null, null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275template(25, DetalleDocumentoComponent_Conditional_9_Conditional_25_Template, 2, 0, "p", 4)(26, DetalleDocumentoComponent_Conditional_9_Conditional_26_Template, 4, 2)(27, DetalleDocumentoComponent_Conditional_9_Conditional_27_Template, 4, 2)(28, DetalleDocumentoComponent_Conditional_9_Conditional_28_Template, 4, 1);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_14_0;
    let tmp_15_0;
    const doc_r3 = ctx;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275conditional(doc_r3.origen === "practica" || doc_r3.origen === "reconocimiento" ? 0 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r0.previaCargando() ? 4 : ctx_r0.errorPrevia() ? 5 : ctx_r0.seleccionando() && ctx_r0.previa() && ctx_r0.seleccion().length && !ctx_r0.previaVisible() ? 6 : ctx_r0.seleccionando() && ctx_r0.previa() && ctx_r0.seleccion().length ? 7 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(doc_r3.facultades.descargar ? 8 : 9);
    \u0275\u0275advance(7);
    \u0275\u0275classProp("estado-listo", ctx_r0.disponibleRrhh());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.disponibleRrhh() ? "Listo para entrega" : "Pendiente de firma");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.preparado() && !ctx_r0.disponibleRrhh() ? 17 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0.preparado() && !ctx_r0.seleccionando() ? 18 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.aviso() ? 19 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.seleccionando() && !ctx_r0.preparado() ? 20 : 21);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.ocupada() ? 22 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(\u0275\u0275pureFunction0(14, _c1));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.cargas().has("progreso") ? 25 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.errores()["progreso"] || ((tmp_14_0 = ctx_r0.progreso()) == null ? null : tmp_14_0.integridad_verificada) === false ? 26 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.errores()["integridad"] ? 27 : ((tmp_15_0 = ctx_r0.integridad()) == null ? null : tmp_15_0.integridad_verificada) === false ? 28 : -1);
  }
}
var DetalleDocumentoComponent = class _DetalleDocumentoComponent {
  cambiosCertificados = inject(CambiosCertificadosService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  api = inject(DocumentosDigitalesService);
  firmas = inject(FirmaDocumentalService);
  destroy = inject(DestroyRef);
  documento = signal(null);
  progreso = signal(null);
  integridad = signal(null);
  bloqueoIntegridad = signal(false);
  cargas = signal(/* @__PURE__ */ new Set());
  errores = signal({});
  paginaRegreso = signal(1);
  consultas = new Subscription();
  id = 0;
  auth = inject(AuthService);
  seleccionando = signal(false);
  disponibles = signal([]);
  seleccion = signal([]);
  modalidad = signal("PARALELA");
  aviso = signal("");
  previa = signal(null);
  textosPrevia = signal([]);
  vigente = signal(null);
  restaurarVigente = signal(false);
  revision = signal(null);
  previaCargando = signal(false);
  previaVisible = signal(false);
  errorPrevia = signal("");
  cambios = new Subject();
  claveRevision = "";
  claveAsignada = null;
  tokenConfirmado = null;
  asignacionPendienteVerificacion = false;
  confirmacionPendienteVerificacion = false;
  plan() {
    return { modalidad: this.modalidad(), firmantes: this.seleccion().map((t, i) => ({ id_persona_trabajador: t.id_persona_trabajador, orden_firma: i + 1 })) };
  }
  cambiarModalidad(m) {
    if (this.ocupada() || this.requiereActualizar())
      return;
    this.modalidad.set(m);
    this.actualizarPrevia();
  }
  previaValida() {
    return !!this.previa() && !!this.revision() && this.seleccion().length > 0 && this.claveRevision === JSON.stringify(this.plan()) && Date.parse(this.revision().expires_at) > Date.now() && !this.previaCargando() && !this.errorPrevia();
  }
  listaParaGuardar() {
    return this.documento()?.facultades.descargar === true && this.previaValida() && this.previaVisible();
  }
  esperandoPrevia() {
    return this.seleccionando() && this.seleccion().length > 0;
  }
  pdfVisualizado(archivo) {
    if (archivo === this.previa() && this.previaValida())
      this.previaVisible.set(true);
  }
  falloVisor(mensaje) {
    if (!this.esperandoPrevia())
      return;
    this.previaVisible.set(false);
    this.errorPrevia.set(mensaje);
  }
  actualizarPrevia() {
    if (this.requiereActualizar())
      return;
    if (this.seleccion().length)
      this.restaurarVigente.set(true);
    const r = this.revision();
    if (r)
      this.consultas.add(this.firmas.descartarPdf(this.id, r.token_revision).subscribe({ error: () => {
      } }));
    this.revision.set(null);
    this.previaVisible.set(false);
    this.errorPrevia.set("");
    this.cambios.next();
  }
  cancelar() {
    if (this.ocupada() || this.requiereActualizar())
      return;
    const r = this.revision();
    const restaurar = () => {
      this.restaurarVigente.set(true);
      this.seleccionando.set(false);
      this.cambios.next();
      this.revision.set(null);
      this.previa.set(null);
      this.previaVisible.set(false);
      this.errorPrevia.set("");
      this.seleccion.set([...this.progreso()?.firmantes_asignados ?? []].sort((a, b) => a.orden_firma - b.orden_firma));
      this.modalidad.set(this.progreso()?.modalidad ?? "PARALELA");
    };
    if (!r) {
      restaurar();
      return;
    }
    this.consultar("cancelar", this.firmas.descartarPdf(this.id, r.token_revision), (d) => {
      if (!d.descartado)
        throw new Error();
      restaurar();
    });
  }
  preparado() {
    return this.disponibleRrhh() || this.documento()?.estado_preparacion === "PREPARADO_ENTREGA" || pdfConfirmado(this.progreso()) && this.progreso()?.asignacion_documental_persistida === true;
  }
  disponibleRrhh() {
    return listoParaEntrega(this.progreso() ?? this.documento());
  }
  modalidadAplicada() {
    return this.progreso()?.modalidad ?? this.documento()?.modalidad_firma?.toUpperCase() ?? null;
  }
  puedeAsignar() {
    const p = this.progreso();
    return !!this.documento() && this.documento()?.estado_certificado === "PENDIENTE_FIRMA" && !this.preparado() && !this.cargas().has("documento") && !this.cargas().has("progreso") && !this.errores()["documento"] && !this.errores()["progreso"] && this.auth.tienePermiso("emision.editar") && p?.facultades?.asignar === true && !this.bloqueoIntegridad() && p.integridad_verificada !== false && this.integridad()?.integridad_verificada !== false && (p.integridad_verificada === true || this.integridad()?.integridad_verificada === true);
  }
  ocupada() {
    return ["guardar", "recuperacion", "disponibles", "cancelar"].some((k) => this.cargas().has(k));
  }
  abrirSeleccion() {
    if (!this.puedeAsignar() || this.ocupada() || this.seleccionando())
      return;
    this.seleccionando.set(true);
    this.seleccion.set([]);
    this.disponibles.set([]);
    this.aviso.set("");
    this.consultar("disponibles", this.firmas.disponibles(this.id), (d) => {
      this.disponibles.set(d);
      const ids = [...this.progreso()?.firmantes_asignados ?? []].sort((a, b) => a.orden_firma - b.orden_firma);
      this.seleccion.set(ids.map((t) => d.find((f) => f.id_persona_trabajador === t.id_persona_trabajador)).filter((t) => !!t));
      this.modalidad.set(this.progreso()?.modalidad ?? "PARALELA");
      this.actualizarPrevia();
    });
  }
  marcado(t) {
    return this.seleccion().some((f) => f.id_persona_trabajador === t.id_persona_trabajador);
  }
  alternar(t) {
    if (this.ocupada() || this.requiereActualizar())
      return;
    this.seleccion.update((a) => this.marcado(t) ? a.filter((f) => f.id_persona_trabajador !== t.id_persona_trabajador) : a.length < 8 ? [...a, t] : a);
    this.actualizarPrevia();
  }
  mover(i, delta) {
    const a = [...this.seleccion()];
    const j = i + delta;
    if (j < 0 || j >= a.length || this.ocupada() || this.requiereActualizar())
      return;
    [a[i], a[j]] = [a[j], a[i]];
    this.seleccion.set(a);
    this.actualizarPrevia();
  }
  guardar() {
    if (this.ocupada() || !this.auth.tienePermiso("emision.editar"))
      return;
    if (this.requiereActualizar()) {
      this.actualizarEstadoGuardado();
      return;
    }
    if (!this.puedeAsignar() || !this.listaParaGuardar())
      return;
    const r = this.revision();
    const plan = this.plan();
    const clave = JSON.stringify(plan);
    if (this.progreso()?.asignacion_documental_persistida && !this.planPersistidoCoincide(this.progreso(), plan)) {
      this.errores.update((e) => __spreadProps(__spreadValues({}, e), { guardar: "El documento ya tiene otro plan guardado. No se reemplaz\xF3 la asignaci\xF3n." }));
      return;
    }
    const yaAsignada = this.claveAsignada === clave || this.planPersistidoCoincide(this.progreso(), plan);
    const descargar = (p) => this.descargarConfirmado(p, r.hash_pdf, plan);
    const asignarNueva = () => defer(() => {
      this.asignacionPendienteVerificacion = true;
      return this.firmas.asignar(this.id, plan.modalidad, plan.firmantes).pipe(tap(() => {
        this.claveAsignada = clave;
        this.asignacionPendienteVerificacion = false;
      }));
    });
    const asignar = yaAsignada ? of(null) : this.asignacionPendienteVerificacion ? this.firmas.progreso(this.id).pipe(switchMap((p) => {
      if (!this.esDocumentoRecibido(p.documento))
        throw new Error("La recuperaci\xF3n de la asignaci\xF3n corresponde a otro documento.");
      this.progreso.set(p);
      this.asignacionPendienteVerificacion = false;
      if (this.planPersistidoCoincide(p, plan)) {
        this.claveAsignada = clave;
        return of(null);
      }
      if (p.asignacion_documental_persistida)
        throw new Error("El documento ya tiene otro plan guardado. No se reemplaz\xF3 la asignaci\xF3n.");
      return asignarNueva();
    })) : asignarNueva();
    if (yaAsignada)
      this.claveAsignada = clave;
    this.consultar("guardar", asignar.pipe(switchMap(() => this.tokenConfirmado === r.token_revision ? of(null) : defer(() => {
      this.confirmacionPendienteVerificacion = true;
      return this.firmas.confirmarPdf(this.id, r.token_revision);
    }).pipe(tap((c) => {
      this.validarPdfConfirmado(c, r.hash_pdf, plan);
      this.tokenConfirmado = r.token_revision;
      this.confirmacionPendienteVerificacion = false;
    }))), switchMap(() => this.firmas.asignados(this.id)), switchMap(descargar), timeout(9e4), catchError((error) => this.firmas.progreso(this.id).pipe(timeout(3e4), switchMap((p) => {
      if (!this.esDocumentoRecibido(p.documento))
        throw new Error("La recuperaci\xF3n corresponde a otro documento, certificado o c\xF3digo.");
      this.asignacionPendienteVerificacion = false;
      if (pdfConfirmado(p))
        this.confirmacionPendienteVerificacion = true;
      else
        this.progreso.set(p);
      const coincide = this.planPersistidoCoincide(p, plan);
      if (coincide)
        this.claveAsignada = clave;
      if (p.asignacion_documental_persistida && !coincide) {
        throw new Error("El documento tiene otro plan de firmas guardado. No se reemplaz\xF3 ni se repiti\xF3 la asignaci\xF3n.");
      }
      if (coincide && pdfConfirmado(p) && p.documento.hash_pdf === r.hash_pdf) {
        this.tokenConfirmado = r.token_revision;
        this.aviso.set("Actualizando certificado...");
        return descargar(p);
      }
      if (this.claveAsignada === clave) {
        this.aviso.set("La asignaci\xF3n qued\xF3 guardada; el PDF a\xFAn no est\xE1 confirmado. Revise y reintente la confirmaci\xF3n.");
        if (Date.parse(r.expires_at) <= Date.now() || error?.status === 409) {
          this.confirmacionPendienteVerificacion = false;
          this.actualizarPrevia();
        }
      } else {
        this.aviso.set("No se confirm\xF3 el guardado. Se consult\xF3 el progreso antes de permitir un reintento.");
      }
      return throwError(() => error);
    }), catchError((recuperacion) => {
      if (this.claveAsignada === clave && !this.aviso())
        this.aviso.set("La asignaci\xF3n qued\xF3 guardada; falta verificar el PDF autorizado. Revise y reintente.");
      return throwError(() => recuperacion === error || [401, 403, 404].includes(recuperacion?.status) ? recuperacion : { status: 408, mensaje: "", errores: {} });
    })))), ({ p, archivo }) => this.finalizarGuardado(p, archivo));
  }
  finalizarGuardado(p, archivo) {
    this.asignacionPendienteVerificacion = false;
    this.confirmacionPendienteVerificacion = false;
    this.errores.update((e) => __spreadProps(__spreadValues({}, e), { guardar: "", recuperacion: "" }));
    this.vigente.set(archivo);
    this.restaurarVigente.set(true);
    this.progreso.set(p);
    this.documento.set(p.documento);
    this.revision.set(null);
    this.previa.set(null);
    this.previaVisible.set(false);
    this.seleccionando.set(false);
    this.cambiosCertificados.confirmar();
    this.aviso.set("Certificado listo para entrega");
    this.verificarIntegridad();
    void this.router.navigate(["/pendientes/documentos-firmar"], { queryParams: { pestana: "preparados" }, state: { certificadoListo: true } });
  }
  requiereActualizar() {
    return this.asignacionPendienteVerificacion || this.confirmacionPendienteVerificacion;
  }
  descargarConfirmado(p, hash, plan) {
    this.validarPdfConfirmado(p, hash, plan);
    if (!listoParaEntrega(p)) {
      throw new Error("No se pudo confirmar la disponibilidad del certificado. Actualice el estado antes de reintentar.");
    }
    return this.api.archivo(this.id, true, hash).pipe(timeout(3e4), map((archivo) => ({ p, archivo })));
  }
  actualizarEstadoGuardado() {
    const r = this.revision();
    const plan = this.plan();
    if (!r) {
      this.errores.update((e) => __spreadProps(__spreadValues({}, e), { guardar: "No se pudo confirmar la operaci\xF3n. Actualice el estado antes de reintentar." }));
      return;
    }
    this.aviso.set("Actualizando certificado...");
    this.consultar("recuperacion", this.firmas.progreso(this.id).pipe(switchMap((p) => {
      if (!this.esDocumentoRecibido(p.documento))
        throw new Error("Documento diferente.");
      if (pdfConfirmado(p))
        return this.descargarConfirmado(p, r.hash_pdf, plan);
      if (p.asignacion_documental_persistida && !this.planPersistidoCoincide(p, plan))
        throw new Error("Plan diferente.");
      this.progreso.set(p);
      this.documento.set(p.documento);
      this.asignacionPendienteVerificacion = false;
      this.confirmacionPendienteVerificacion = false;
      if (this.planPersistidoCoincide(p, plan))
        this.claveAsignada = JSON.stringify(plan);
      this.aviso.set("La revisi\xF3n no est\xE1 confirmada. Revise la selecci\xF3n antes de reintentar.");
      return of(null);
    })), (resultado) => {
      if (resultado)
        this.finalizarGuardado(resultado.p, resultado.archivo);
    });
  }
  planPersistidoCoincide(p, plan) {
    if (!p?.asignacion_documental_persistida || p.modalidad !== plan.modalidad || !Array.isArray(p.firmantes_asignados))
      return false;
    const firmantes = [...p.firmantes_asignados].sort((a, b) => a.orden_firma - b.orden_firma).map((f) => ({ id_persona_trabajador: f.id_persona_trabajador, orden_firma: f.orden_firma }));
    return JSON.stringify(firmantes) === JSON.stringify(plan.firmantes);
  }
  validarPdfConfirmado(p, hash, plan) {
    if (!this.esDocumentoRecibido(p.documento))
      throw new Error("El PDF confirmado corresponde a otro documento, certificado o c\xF3digo.");
    if (p.documento.estado_certificado !== "PENDIENTE_FIRMA")
      throw new Error("El estado del certificado cambi\xF3; vuelva a abrir el documento.");
    if (!this.planPersistidoCoincide(p, plan))
      throw new Error("El plan persistido no coincide con los firmantes, orden o modalidad revisados.");
    if (!pdfConfirmado(p))
      throw new Error("La asignaci\xF3n est\xE1 guardada, pero Laravel no acredita un PDF revisado vigente.");
    if (p.documento.hash_pdf !== hash)
      throw new Error("La huella del PDF vigente no coincide con la vista previa revisada.");
  }
  ngOnInit() {
    this.cambios.pipe(switchMap(() => {
      this.previaCargando.set(false);
      if (!this.seleccionando() || !this.seleccion().length)
        return EMPTY;
      const plan = this.plan();
      const clave = JSON.stringify(plan);
      this.previaCargando.set(true);
      this.cargas.update((c) => /* @__PURE__ */ new Set([...c, "previa"]));
      this.errores.update((e) => __spreadProps(__spreadValues({}, e), { previa: "" }));
      return timer(150).pipe(switchMap(() => this.firmas.revisarPdf(this.id, plan)), timeout(3e4), switchMap((r) => __async(this, null, function* () {
        if (r.id_certificado_documento !== this.id || r.id_certificado !== this.documento()?.id_certificado || r.codigo_verificacion !== this.documento()?.codigo_verificacion) {
          throw new Error("La vista previa recibida no corresponde al certificado abierto.");
        }
        const planRecibido = { modalidad: r.modalidad, firmantes: r.firmantes?.map((f) => ({ id_persona_trabajador: f.id_persona_trabajador, orden_firma: f.orden_firma })) };
        if (JSON.stringify(planRecibido) !== clave)
          throw new Error("Laravel devolvi\xF3 una vista previa con otros firmantes, orden o modalidad.");
        if (r.persistido !== false || !r.token_revision || !Number.isFinite(Date.parse(r.expires_at)) || Date.parse(r.expires_at) <= Date.now()) {
          throw new Error("La revisi\xF3n del PDF est\xE1 incompleta o vencida. Vuelva a solicitar la vista previa.");
        }
        const archivo = decodificarVistaPrevia(__spreadProps(__spreadValues({}, r.vista_previa_pdf), { nombre_archivo: "vista-previa.pdf", persistido: false }));
        const digest = yield crypto.subtle.digest("SHA-256", yield archivo.blob.arrayBuffer());
        if (Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("") !== r.hash_pdf)
          throw new Error("PDF inv\xE1lido.");
        return { r, archivo };
      })), tap(({ r, archivo }) => {
        this.claveRevision = clave;
        this.revision.set(r);
        this.textosPrevia.set(r.firmantes.flatMap((f) => [f.nombre, f.cargo]).filter((texto) => typeof texto === "string" && !!texto.trim()));
        this.previa.set(archivo);
      }), catchError((e) => {
        const mensaje = e instanceof Error ? "No se pudo cargar el certificado. Intenta nuevamente." : mensajeEtapaA(e);
        this.errorPrevia.set(mensaje);
        this.errores.update((a) => __spreadProps(__spreadValues({}, a), { previa: mensaje }));
        return EMPTY;
      }), finalize(() => {
        this.previaCargando.set(false);
        this.cargas.update((c) => {
          const n = new Set(c);
          n.delete("previa");
          return n;
        });
      }));
    }), takeUntilDestroyed(this.destroy)).subscribe();
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroy)).subscribe((params) => {
      this.claveAsignada = null;
      this.tokenConfirmado = null;
      this.asignacionPendienteVerificacion = false;
      this.confirmacionPendienteVerificacion = false;
      this.seleccionando.set(false);
      this.cambios.next();
      this.revision.set(null);
      this.previa.set(null);
      this.vigente.set(null);
      this.restaurarVigente.set(false);
      this.previaVisible.set(false);
      this.errorPrevia.set("");
      this.consultas.unsubscribe();
      this.consultas = new Subscription();
      this.documento.set(null);
      this.progreso.set(null);
      this.integridad.set(null);
      this.bloqueoIntegridad.set(false);
      this.seleccionando.set(false);
      this.seleccion.set([]);
      this.disponibles.set([]);
      this.aviso.set("");
      this.errores.set({});
      this.cargas.set(/* @__PURE__ */ new Set());
      const valor = params.get("id") ?? "";
      this.id = /^[1-9]\d*$/.test(valor) && Number.isSafeInteger(Number(valor)) ? Number(valor) : 0;
      const pagina = Number(this.route.snapshot.queryParamMap.get("page"));
      this.paginaRegreso.set(Number.isSafeInteger(pagina) && pagina > 0 ? pagina : 1);
      if (!this.id) {
        this.errores.set({ documento: "Identificador de documento inv\xE1lido." });
        return;
      }
      this.cargarDocumento();
    });
    this.destroy.onDestroy(() => this.consultas.unsubscribe());
  }
  cargarDocumento() {
    if (!this.id)
      return;
    this.consultar("documento", this.api.detalleFirmas(this.id), (doc) => {
      this.documento.set(doc);
      this.actualizarProgreso();
      this.verificarIntegridad();
    });
  }
  actualizarProgreso() {
    this.consultar("progreso", this.firmas.progreso(this.id), (p) => {
      if (!this.esDocumentoRecibido(p.documento)) {
        this.errores.update((e) => __spreadProps(__spreadValues({}, e), { progreso: "El documento cambi\xF3. Vuelva a abrirlo antes de continuar." }));
        return;
      }
      const cambioVersion = p.documento.hash_pdf !== this.documento()?.hash_pdf;
      this.progreso.set(p);
      this.documento.set(p.documento);
      if (this.preparado()) {
        this.seleccionando.set(false);
        this.cambios.next();
        this.previa.set(null);
        this.revision.set(null);
      }
      if (cambioVersion) {
        this.vigente.set(null);
        this.restaurarVigente.set(false);
        this.verificarIntegridad();
      }
    });
  }
  verificarIntegridad() {
    if (this.cargas().has("integridad"))
      return;
    const hashConsultado = this.documento()?.hash_pdf;
    this.integridad.set(null);
    this.consultar("integridad", this.firmas.verificacion(this.id).pipe(catchError((e) => {
      if ([401, 403, 404, 409].includes(e?.status))
        this.bloqueoIntegridad.set(true);
      return throwError(() => e);
    })), (v) => {
      if (hashConsultado !== this.documento()?.hash_pdf) {
        this.verificarIntegridad();
        return;
      }
      if (v.integridad_verificada === false) {
        this.bloqueoIntegridad.set(true);
        this.integridad.set(v);
        return;
      }
      if (typeof v.hash_pdf !== "string" || !hashConsultado || typeof v.integridad_verificada !== "boolean") {
        this.errores.update((e) => __spreadProps(__spreadValues({}, e), { integridad: "No se pudo completar la consulta de integridad. Intente nuevamente." }));
        return;
      }
      if (v.hash_pdf !== hashConsultado) {
        this.bloqueoIntegridad.set(true);
        this.errores.update((e) => __spreadProps(__spreadValues({}, e), { integridad: "El archivo cambi\xF3. Vuelva a abrir el documento." }));
        return;
      }
      this.bloqueoIntegridad.set(false);
      this.integridad.set(v);
    });
  }
  nombreEstado(estado) {
    return { PENDIENTE_FIRMA: "Pendiente de firma", PREPARADO: "Preparado", FIRMADO: "Firmado", EMITIDO: "Emitido", ANULADO: "Anulado" }[estado] ?? estado;
  }
  firmantesOrdenados() {
    const asignados = this.progreso()?.firmantes_asignados;
    const firmantes = asignados?.length ? asignados : this.documento()?.firmantes;
    return [...firmantes?.length ? firmantes : this.documento()?.responsables_administrativos?.map((f) => __spreadProps(__spreadValues({}, f), { id_firma: null })) ?? []].sort((a, b) => (a.orden_firma ?? 0) - (b.orden_firma ?? 0));
  }
  esDocumentoRecibido(documento) {
    const recibido = this.documento();
    return !!documento && documento.id_certificado_documento === this.id && documento.id_certificado === recibido?.id_certificado && documento.codigo_verificacion === recibido?.codigo_verificacion && (recibido?.origen === void 0 || documento.origen === recibido.origen) && (recibido?.id_sesion === void 0 || documento.id_sesion === recibido.id_sesion) && (recibido?.id_tipo_certificado === void 0 || documento.id_tipo_certificado === recibido.id_tipo_certificado) && (recibido?.id_actividad === void 0 || documento.id_actividad === recibido.id_actividad) && (recibido?.beneficiario?.id_persona === void 0 || documento.beneficiario?.id_persona === recibido.beneficiario.id_persona) && (!documento.hash_pdf_original || !recibido?.hash_pdf_original || documento.hash_pdf_original === recibido.hash_pdf_original);
  }
  consultar(clave, solicitud, recibir) {
    if (this.cargas().has(clave))
      return;
    this.cargas.update((c) => /* @__PURE__ */ new Set([...c, clave]));
    this.errores.update((e) => __spreadProps(__spreadValues({}, e), { [clave]: "" }));
    const terminar = () => this.cargas.update((c) => {
      const n = new Set(c);
      n.delete(clave);
      return n;
    });
    this.consultas.add(solicitud.pipe(timeout(clave === "guardar" ? 21e4 : 3e4)).subscribe({ next: (d) => {
      terminar();
      try {
        recibir(d);
      } catch {
        this.errores.update((e) => __spreadProps(__spreadValues({}, e), { [clave]: "No se pudo validar la respuesta del documento." }));
      }
    }, error: (e) => {
      terminar();
      this.errores.update((actual) => __spreadProps(__spreadValues({}, actual), { [clave]: e instanceof TimeoutError ? "No se pudo confirmar la operaci\xF3n. Actualice el estado antes de reintentar." : e instanceof Error ? "No se pudo completar la operaci\xF3n. Actualiza el estado antes de reintentar" : mensajeEtapaA(e) }));
    } }));
  }
  static \u0275fac = function DetalleDocumentoComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DetalleDocumentoComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DetalleDocumentoComponent, selectors: [["app-detalle-documento"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 10, vars: 7, consts: [[1, "titulo-detalle"], ["routerLink", "/pendientes/documentos-firmar", "title", "Volver a certificados por firmar", "aria-label", "Volver a certificados por firmar", 1, "btn", "regreso", 3, "queryParams"], ["aria-hidden", "true", 1, "material-symbols-outlined"], [1, "estado"], ["role", "status"], [1, "detalle-documental"], ["role", "alert"], ["type", "button", 1, "btn", 3, "click"], ["aria-label", "PDF del certificado", 1, "pdf"], ["aria-live", "polite", 1, "estado-previa"], [3, "integrado", "archivoPrevio", "textosEsperados", "persistido", "documentoId", "hashEsperado", "flujoFirmas", "controlesZoom", "mostrarDescripcion"], ["aria-label", "Informaci\xF3n y acciones del certificado"], ["aria-labelledby", "titulo-firmas", 1, "panel-firmas"], [1, "cabecera-firmas"], ["id", "titulo-firmas"], ["type", "button", 1, "btn", "abrir-seleccion", 3, "disabled"], [3, "archivoCargado", "archivoVisualizado", "errorVisualizacion", "integrado", "archivoPrevio", "textosEsperados", "persistido", "documentoId", "hashEsperado", "flujoFirmas", "controlesZoom", "mostrarDescripcion"], ["type", "button", 1, "btn", "abrir-seleccion", 3, "click", "disabled"], ["aria-labelledby", "titulo-responsables", 1, "bloque-panel"], ["id", "titulo-responsables"], [1, "funcionarios"], [1, "firmante", "opcion-firmante", 3, "seleccionado"], ["aria-labelledby", "titulo-modalidad", 1, "bloque-panel"], ["id", "titulo-modalidad"], ["for", "modalidad-firma"], ["id", "modalidad-firma", 1, "input", 3, "ngModelChange", "ngModel", "disabled"], ["value", "PARALELA"], ["value", "SECUENCIAL"], ["aria-labelledby", "titulo-orden", 1, "bloque-panel"], [1, "acciones-panel"], ["type", "button", 1, "btn", 3, "disabled"], ["type", "button", 1, "btn", "btn-primario", 3, "click", "disabled"], ["type", "button", 1, "btn", "cancelar-seleccion", 3, "click", "disabled"], [1, "firmante", "opcion-firmante"], ["type", "checkbox", 3, "change", "checked", "disabled"], [1, "datos-firmante"], ["id", "titulo-orden"], [1, "orden-responsables"], ["aria-hidden", "true", 1, "numero-orden"], [1, "nombre-orden"], [1, "controles-orden"], ["type", "button", "aria-label", "Subir firmante", 3, "click", "disabled"], ["aria-hidden", "true", 1, "material-symbols-outlined", "subir"], ["type", "button", "aria-label", "Bajar firmante", 3, "click", "disabled"], ["aria-hidden", "true", 1, "material-symbols-outlined", "bajar"], ["type", "button", 1, "btn", 3, "click", "disabled"], ["aria-labelledby", "titulo-asignados", 1, "bloque-panel"], ["id", "titulo-asignados"], [1, "firmante", "asignado"], ["aria-labelledby", "titulo-modalidad-aplicada", 1, "bloque-panel"], ["aria-labelledby", "titulo-orden-final", 1, "bloque-panel"], ["id", "titulo-modalidad-aplicada"], [1, "modalidad-aplicada"], ["id", "titulo-orden-final"]], template: function DetalleDocumentoComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "header", 0)(1, "a", 1)(2, "span", 2);
      \u0275\u0275text(3, "arrow_back");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(4, "h1");
      \u0275\u0275text(5, "Revisar certificado");
      \u0275\u0275elementEnd();
      \u0275\u0275template(6, DetalleDocumentoComponent_Conditional_6_Template, 2, 1, "span", 3);
      \u0275\u0275elementEnd();
      \u0275\u0275template(7, DetalleDocumentoComponent_Conditional_7_Template, 2, 0, "p", 4)(8, DetalleDocumentoComponent_Conditional_8_Template, 4, 1)(9, DetalleDocumentoComponent_Conditional_9_Template, 29, 15, "div", 5);
    }
    if (rf & 2) {
      let tmp_1_0;
      let tmp_4_0;
      \u0275\u0275advance();
      \u0275\u0275property("queryParams", \u0275\u0275pureFunction1(5, _c0, ctx.paginaRegreso()));
      \u0275\u0275advance(5);
      \u0275\u0275conditional((tmp_1_0 = ctx.documento()) ? 6 : -1, tmp_1_0);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.cargas().has("documento") ? 7 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.errores()["documento"] ? 8 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_4_0 = ctx.documento()) ? 9 : -1, tmp_4_0);
    }
  }, dependencies: [RouterLink, VisorPdfComponent, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, SelectControlValueAccessor, NgControlStatus, NgModel], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.encabezado[_ngcontent-%COMP%], \n.acciones[_ngcontent-%COMP%], \n.paginacion[_ngcontent-%COMP%], \n.filtros[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: var(--espacio-3);\n}\n.encabezado[_ngcontent-%COMP%] {\n  justify-content: space-between;\n  margin-bottom: var(--espacio-4);\n}\n.acciones[_ngcontent-%COMP%], \n.filtros[_ngcontent-%COMP%], \n.paginacion[_ngcontent-%COMP%] {\n  margin-block: var(--espacio-4);\n}\n.tabla[_ngcontent-%COMP%] {\n  overflow-x: auto;\n}\n.grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));\n  gap: var(--espacio-4);\n}\n.form-field[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.detalle[_ngcontent-%COMP%] {\n  margin-block: var(--espacio-5);\n}\ndt[_ngcontent-%COMP%] {\n  color: var(--neutro-500);\n  font-size: 0.875rem;\n}\ndd[_ngcontent-%COMP%] {\n  margin: 0 0 var(--espacio-3);\n  overflow-wrap: anywhere;\n}\n.nota[_ngcontent-%COMP%] {\n  color: var(--neutro-700);\n  font-size: 0.875rem;\n}\n.table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  overflow-wrap: anywhere;\n}\n.errores[_ngcontent-%COMP%] {\n  color: var(--color-error);\n}\n.reconocimiento[_ngcontent-%COMP%] {\n  border-top: 3px solid var(--boton-dorado);\n  overflow-wrap: anywhere;\n}\n.reconocimiento[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin-top: var(--espacio-4);\n  font-size: 1.25rem;\n}\n/*# sourceMappingURL=emision.css.map */", "\n\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\n.titulo-detalle[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 0.65rem;\n  margin-bottom: 0.75rem;\n}\nh1[_ngcontent-%COMP%], \nh2[_ngcontent-%COMP%] {\n  color: #075a9b;\n  overflow-wrap: anywhere;\n}\nh1[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  margin: 0;\n}\nh2[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  margin: 0 0 0.65rem;\n}\n.regreso[_ngcontent-%COMP%] {\n  padding: 0.4rem;\n}\n.detalle-documental[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 3fr) minmax(19rem, 1.15fr);\n  gap: 1.25rem;\n  align-items: start;\n}\n.pdf[_ngcontent-%COMP%], \naside[_ngcontent-%COMP%] {\n  min-width: 0;\n}\naside[_ngcontent-%COMP%] {\n  position: sticky;\n  top: 1rem;\n}\n.panel-firmas[_ngcontent-%COMP%] {\n  padding: 1.25rem;\n  border: 1px solid #e1e8ef;\n  border-top: 3px solid var(--dorado-500, #c5a04a);\n  background: #fff;\n  border-radius: 0.8rem;\n  max-height: calc(100dvh - 2rem);\n  overflow-y: auto;\n  scrollbar-gutter: stable;\n}\n.cabecera-firmas[_ngcontent-%COMP%] {\n  padding-bottom: 1rem;\n}\n.estado[_ngcontent-%COMP%] {\n  display: inline-flex;\n  color: #075a9b;\n  background: #eef4fa;\n  padding: 0.35rem 0.7rem;\n  border-radius: 2rem;\n  font-weight: 600;\n  font-size: 0.8rem;\n  line-height: 1.3;\n}\n.estado-listo[_ngcontent-%COMP%] {\n  color: #21643b;\n  background: #e8f5ec;\n}\n.titulo-detalle[_ngcontent-%COMP%]   .estado[_ngcontent-%COMP%] {\n  margin-left: auto;\n}\n.bloque-panel[_ngcontent-%COMP%] {\n  padding-block: 1rem;\n  border-top: 1px solid #edf1f5;\n}\nh3[_ngcontent-%COMP%] {\n  margin: 0 0 0.75rem;\n  color: #33475b;\n  font-size: 0.9rem;\n  font-weight: 600;\n}\np[_ngcontent-%COMP%] {\n  overflow-wrap: anywhere;\n  font-size: 0.9rem;\n}\nsmall[_ngcontent-%COMP%] {\n  display: block;\n  color: #657587;\n  font-size: 0.78rem;\n}\n.firmante[_ngcontent-%COMP%] {\n  padding: 0.7rem;\n  border: 1px solid #e1e8ef;\n  border-radius: 0.55rem;\n  background: #f8fafc;\n  overflow-wrap: anywhere;\n}\n.funcionarios[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.5rem;\n  max-height: 18rem;\n  overflow-y: auto;\n  padding: 0.15rem;\n}\n.opcion-firmante[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  gap: 0.65rem;\n  margin: 0;\n  cursor: pointer;\n}\n.opcion-firmante[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  margin: 0.2rem 0 0;\n  width: 1rem;\n  height: 1rem;\n  flex-shrink: 0;\n  accent-color: #075a9b;\n}\n.datos-firmante[_ngcontent-%COMP%], \n.asignado[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.2rem;\n  min-width: 0;\n  font-size: 0.85rem;\n}\n.datos-firmante[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.asignado[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #253e55;\n  font-weight: 600;\n}\n.asignado[_ngcontent-%COMP%]    + .asignado[_ngcontent-%COMP%] {\n  margin-top: 0.5rem;\n}\n.seleccionado[_ngcontent-%COMP%] {\n  border-color: #78a8ce;\n  background: #eef5fc;\n}\n.opcion-firmante[_ngcontent-%COMP%]:focus-within {\n  outline: 2px solid #075a9b;\n  outline-offset: 1px;\n}\nselect.input[_ngcontent-%COMP%] {\n  width: 100%;\n  box-sizing: border-box;\n  font-size: 0.9rem;\n}\n.orden-responsables[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.4rem;\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n.orden-responsables[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0.45rem 0.55rem;\n  background: #f8fafc;\n  border-radius: 0.45rem;\n  font-size: 0.85rem;\n}\n.numero-orden[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 1.5rem;\n  height: 1.5rem;\n  flex-shrink: 0;\n  border-radius: 50%;\n  color: #075a9b;\n  background: #e8eff7;\n  font-size: 0.75rem;\n}\n.nombre-orden[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n  overflow-wrap: anywhere;\n}\n.controles-orden[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.2rem;\n}\n.controles-orden[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 1.8rem;\n  height: 1.8rem;\n  padding: 0;\n  border: 1px solid #d5dee8;\n  border-radius: 0.35rem;\n  background: #fff;\n  color: #075a9b;\n  cursor: pointer;\n}\n.subir[_ngcontent-%COMP%] {\n  transform: rotate(-90deg);\n}\n.bajar[_ngcontent-%COMP%] {\n  transform: rotate(90deg);\n}\n.acciones-panel[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.6rem;\n  padding-top: 1rem;\n  border-top: 1px solid #edf1f5;\n}\n.acciones-panel[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%], \n.abrir-seleccion[_ngcontent-%COMP%] {\n  width: 100%;\n  white-space: normal;\n}\n.acciones-panel[_ngcontent-%COMP%]   .btn-primario[_ngcontent-%COMP%] {\n  background: var(--boton-dorado, #e8ad24);\n  color: #253447;\n  border-color: var(--boton-dorado, #e8ad24);\n  font-weight: 600;\n}\n.cancelar-seleccion[_ngcontent-%COMP%] {\n  color: #52677b;\n  background: transparent;\n  border-color: #d5dee8;\n}\nbutton[_ngcontent-%COMP%]:disabled {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\nbutton[_ngcontent-%COMP%]:focus-visible, \nselect[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid #075a9b;\n  outline-offset: 2px;\n}\n.modalidad-aplicada[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #52677b;\n}\n.estado-previa[_ngcontent-%COMP%] {\n  min-height: 3rem;\n}\n@media (max-width: 900px) {\n  .detalle-documental[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  aside[_ngcontent-%COMP%] {\n    position: static;\n  }\n  .panel-firmas[_ngcontent-%COMP%] {\n    max-height: none;\n  }\n}\n/*# sourceMappingURL=detalle-documento.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DetalleDocumentoComponent, { className: "DetalleDocumentoComponent", filePath: "src\\app\\pages\\gerencia\\documentos-por-firmar\\detalle-documento.component.ts", lineNumber: 21 });
})();
export {
  DetalleDocumentoComponent
};
//# sourceMappingURL=chunk-DHVF6MAK.mjs.map
