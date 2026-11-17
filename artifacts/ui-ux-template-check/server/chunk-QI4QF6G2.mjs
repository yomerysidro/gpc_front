import './polyfills.server.mjs';
import {
  VisorCertificadoComponent
} from "./chunk-E7AC5UAT.mjs";
import {
  etiquetaEstado
} from "./chunk-UBX3EAES.mjs";
import "./chunk-FBTDJ3RZ.mjs";
import "./chunk-ZLU2ZG5B.mjs";
import {
  CambiosCertificadosService
} from "./chunk-ZIVCKBVU.mjs";
import "./chunk-R23RR7XQ.mjs";
import {
  HasPermissionDirective
} from "./chunk-JWEWPOXC.mjs";
import {
  PageTitleComponent
} from "./chunk-XGG6XIOR.mjs";
import {
  ActivatedRoute,
  RouterLink
} from "./chunk-OX7VSSQH.mjs";
import "./chunk-VNKXA6HD.mjs";
import {
  AuthService
} from "./chunk-NP7M7R34.mjs";
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
import {
  DestroyRef,
  Subject,
  afterNextRender,
  catchError,
  computed,
  forkJoin,
  inject,
  map,
  merge,
  of,
  signal,
  switchMap,
  takeUntil,
  tap,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵpureFunction2,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate3
} from "./chunk-OYAKRC2F.mjs";
import "./chunk-X7LY3JHO.mjs";

// src/app/pages/emision-certificados/certificados/detalle-certificado/detalle-certificado.component.ts
var _forTrack0 = ($index, $item) => $item.id_certificado_documento;
var _forTrack1 = ($index, $item) => $item.id_certificado_firma;
var _forTrack2 = ($index, $item) => $item.id_consulta_certificado;
var _c0 = (a0) => ["/certificaciones/certificados", a0];
var _c1 = (a0) => ["/certificaciones/certificados", a0, "editar"];
var _c2 = (a0) => ({ id_certificado: a0 });
var _c3 = (a0, a1) => ["/certificaciones/certificados", a0, "documentos", a1, "visor"];
var _c4 = (a0) => ({ codigo: a0 });
function DetalleCertificadoComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 2);
    \u0275\u0275text(1, "Cargando certificado\u2026");
    \u0275\u0275elementEnd();
  }
}
function DetalleCertificadoComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 3);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function DetalleCertificadoComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 4);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function DetalleCertificadoComponent_Conditional_6_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p")(1, "a", 10);
    \u0275\u0275text(2, "Volver al detalle del certificado");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const registro_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(1, _c0, registro_r1.id_certificado));
  }
}
function DetalleCertificadoComponent_Conditional_6_Conditional_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-visor-certificado", 11);
  }
  if (rf & 2) {
    let tmp_8_0;
    let tmp_9_0;
    const documentoActual_r2 = ctx;
    const registro_r1 = \u0275\u0275nextContext(2);
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("certificado", registro_r1)("beneficiario", ctx_r2.beneficiario())("dni", ctx_r2.dni())("lugar", (tmp_8_0 = ctx_r2.actividadVisual()) == null ? null : tmp_8_0["sede"])("fechaActividad", (tmp_9_0 = ctx_r2.actividadVisual()) == null ? null : tmp_9_0["fecha_inicio"])("documento", documentoActual_r2)("tipo", ctx_r2.tipoNombre())("origen", ctx_r2.origenNombre())("reconocimiento", ctx_r2.reconocimiento())("firmas", ctx_r2.firmasDocumento(documentoActual_r2.id_certificado_documento))("firmantes", ctx_r2.firmantes())("errorFirmas", ctx_r2.errorFirmas())("cargandoFirmas", ctx_r2.cargandoFirmas());
  }
}
function DetalleCertificadoComponent_Conditional_6_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 3);
    \u0275\u0275text(1, "El documento solicitado no existe entre los documentos autorizados de este certificado.");
    \u0275\u0275elementEnd();
  }
}
function DetalleCertificadoComponent_Conditional_6_Conditional_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-visor-certificado", 12);
  }
  if (rf & 2) {
    let tmp_7_0;
    let tmp_8_0;
    const registro_r1 = \u0275\u0275nextContext(2);
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("certificado", registro_r1)("beneficiario", ctx_r2.beneficiario())("dni", ctx_r2.dni())("lugar", (tmp_7_0 = ctx_r2.actividadVisual()) == null ? null : tmp_7_0["sede"])("fechaActividad", (tmp_8_0 = ctx_r2.actividadVisual()) == null ? null : tmp_8_0["fecha_inicio"])("tipo", ctx_r2.tipoNombre())("origen", ctx_r2.origenNombre())("reconocimiento", ctx_r2.reconocimiento());
  }
}
function DetalleCertificadoComponent_Conditional_6_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, DetalleCertificadoComponent_Conditional_6_Conditional_1_Conditional_0_Template, 1, 13, "app-visor-certificado", 11)(1, DetalleCertificadoComponent_Conditional_6_Conditional_1_Conditional_1_Template, 2, 0, "p", 3)(2, DetalleCertificadoComponent_Conditional_6_Conditional_1_Conditional_2_Template, 1, 8, "app-visor-certificado", 12);
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional((tmp_3_0 = ctx_r2.documentoSeleccionado()) ? 0 : ctx_r2.documentoId() !== null ? 1 : !ctx_r2.documentos().length ? 2 : -1, tmp_3_0);
  }
}
function DetalleCertificadoComponent_Conditional_6_a_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 10);
    \u0275\u0275text(1, "Editar certificado");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const registro_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(1, _c1, registro_r1.id_certificado));
  }
}
function DetalleCertificadoComponent_Conditional_6_a_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 13);
    \u0275\u0275text(1, "Ver documentos");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const registro_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("queryParams", \u0275\u0275pureFunction1(1, _c2, registro_r1.id_certificado));
  }
}
function DetalleCertificadoComponent_Conditional_6_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 2);
    \u0275\u0275text(1, "Cargando documentos y firmas\u2026");
    \u0275\u0275elementEnd();
  }
}
function DetalleCertificadoComponent_Conditional_6_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 3);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function DetalleCertificadoComponent_Conditional_6_Conditional_42_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 3);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("No se pudieron consultar las firmas: ", ctx, "");
  }
}
function DetalleCertificadoComponent_Conditional_6_Conditional_43_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 3);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("No se pudieron consultar los cargos de firmantes: ", ctx, "");
  }
}
function DetalleCertificadoComponent_Conditional_6_Conditional_44_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 3);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("No se pudo consultar el historial: ", ctx, "");
  }
}
function DetalleCertificadoComponent_Conditional_6_Conditional_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "No hay documentos registrados para este certificado.");
    \u0275\u0275elementEnd();
  }
}
function DetalleCertificadoComponent_Conditional_6_Conditional_46_For_20_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Consultando firmas\u2026 ");
  }
}
function DetalleCertificadoComponent_Conditional_6_Conditional_46_For_20_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " No se pudieron determinar las firmas ");
  }
}
function DetalleCertificadoComponent_Conditional_6_Conditional_46_For_20_Conditional_14_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275element(2, "br");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const firma_r4 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3("Firma #", firma_r4.id_firma, " \xB7 orden ", firma_r4.orden_firma, " \xB7 ", firma_r4.fecha_firma, "");
  }
}
function DetalleCertificadoComponent_Conditional_6_Conditional_46_For_20_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, DetalleCertificadoComponent_Conditional_6_Conditional_46_For_20_Conditional_14_For_1_Template, 3, 3, "span", null, _forTrack1);
  }
  if (rf & 2) {
    const documento_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275repeater(ctx_r2.firmasDocumento(documento_r5.id_certificado_documento));
  }
}
function DetalleCertificadoComponent_Conditional_6_Conditional_46_For_20_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Sin firmas registradas ");
  }
}
function DetalleCertificadoComponent_Conditional_6_Conditional_46_For_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 19);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 17);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 17);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td");
    \u0275\u0275template(12, DetalleCertificadoComponent_Conditional_6_Conditional_46_For_20_Conditional_12_Template, 1, 0)(13, DetalleCertificadoComponent_Conditional_6_Conditional_46_For_20_Conditional_13_Template, 1, 0)(14, DetalleCertificadoComponent_Conditional_6_Conditional_46_For_20_Conditional_14_Template, 2, 0)(15, DetalleCertificadoComponent_Conditional_6_Conditional_46_For_20_Conditional_15_Template, 1, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "td")(17, "a", 20);
    \u0275\u0275text(18, "Consultar documento y PDF");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "a", 21);
    \u0275\u0275text(20, "Consultar c\xF3digo");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const documento_r5 = ctx.$implicit;
    const \u0275$index_158_r6 = ctx.$index;
    const registro_r1 = \u0275\u0275nextContext(2);
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275$index_158_r6 + 1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(documento_r5.codigo_verificacion);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(documento_r5.estado);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(documento_r5.fecha_generacion);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(documento_r5.motivo_reemision || "Documento inicial");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.cargandoFirmas() ? 12 : ctx_r2.errorFirmas() ? 13 : ctx_r2.firmasDocumento(documento_r5.id_certificado_documento).length ? 14 : 15);
    \u0275\u0275advance(5);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction2(8, _c3, registro_r1.id_certificado, documento_r5.id_certificado_documento));
    \u0275\u0275advance(2);
    \u0275\u0275property("queryParams", \u0275\u0275pureFunction1(11, _c4, documento_r5.codigo_verificacion));
  }
}
function DetalleCertificadoComponent_Conditional_6_Conditional_46_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "No hay consultas registradas para los documentos disponibles.");
    \u0275\u0275elementEnd();
  }
}
function DetalleCertificadoComponent_Conditional_6_Conditional_46_For_25_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const consulta_r7 = ctx.$implicit;
    const documento_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3("", consulta_r7.fecha_consulta, " \xB7 Documento ", documento_r8.codigo_verificacion, " \xB7 ", consulta_r7.resultado, "");
  }
}
function DetalleCertificadoComponent_Conditional_6_Conditional_46_For_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, DetalleCertificadoComponent_Conditional_6_Conditional_46_For_25_For_1_Template, 2, 3, "p", null, _forTrack2);
  }
  if (rf & 2) {
    const documento_r8 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275repeater(ctx_r2.consultasDocumento(documento_r8.id_certificado_documento));
  }
}
function DetalleCertificadoComponent_Conditional_6_Conditional_46_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14)(1, "table", 15)(2, "thead")(3, "tr")(4, "th", 16);
    \u0275\u0275text(5, "N.\xBA");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "C\xF3digo de verificaci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 17);
    \u0275\u0275text(9, "Estado del documento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 17);
    \u0275\u0275text(11, "Fecha registrada");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Reemisi\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th");
    \u0275\u0275text(15, "Firmas asociadas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th");
    \u0275\u0275text(17, "Archivo y previsualizaci\xF3n");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "tbody");
    \u0275\u0275repeaterCreate(19, DetalleCertificadoComponent_Conditional_6_Conditional_46_For_20_Template, 21, 13, "tr", null, _forTrack0);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(21, "h3");
    \u0275\u0275text(22, "Historial de consultas");
    \u0275\u0275elementEnd();
    \u0275\u0275template(23, DetalleCertificadoComponent_Conditional_6_Conditional_46_Conditional_23_Template, 2, 0, "p");
    \u0275\u0275repeaterCreate(24, DetalleCertificadoComponent_Conditional_6_Conditional_46_For_25_Template, 2, 0, null, null, _forTrack0);
    \u0275\u0275elementStart(26, "p", 18);
    \u0275\u0275text(27, "El archivo se recupera mediante la API autenticada. Su disponibilidad e integridad las comprueba Laravel. Las firmas registradas no acreditan una firma criptogr\xE1fica.");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(19);
    \u0275\u0275repeater(ctx_r2.documentos());
    \u0275\u0275advance(4);
    \u0275\u0275conditional(!ctx_r2.errorConsultas() && !ctx_r2.tieneConsultasHistorial() ? 23 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.documentos());
  }
}
function DetalleCertificadoComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, DetalleCertificadoComponent_Conditional_6_Conditional_0_Template, 3, 3, "p")(1, DetalleCertificadoComponent_Conditional_6_Conditional_1_Template, 3, 1);
    \u0275\u0275elementStart(2, "section", 5)(3, "h2");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "dl")(6, "dt");
    \u0275\u0275text(7, "Persona beneficiaria");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "dd");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "dt");
    \u0275\u0275text(11, "DNI");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "dd");
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "dt");
    \u0275\u0275text(15, "Tipo de certificado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "dd");
    \u0275\u0275text(17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "dt");
    \u0275\u0275text(19, "Origen");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "dd");
    \u0275\u0275text(21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "dt");
    \u0275\u0275text(23, "Fecha de emisi\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "dd");
    \u0275\u0275text(25);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "dt");
    \u0275\u0275text(27, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "dd");
    \u0275\u0275text(29);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "dt");
    \u0275\u0275text(31, "Notificado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "dd");
    \u0275\u0275text(33);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(34, "div", 6);
    \u0275\u0275template(35, DetalleCertificadoComponent_Conditional_6_a_35_Template, 2, 3, "a", 7)(36, DetalleCertificadoComponent_Conditional_6_a_36_Template, 2, 3, "a", 8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(37, "section", 9)(38, "h2");
    \u0275\u0275text(39, "Documentos asociados e historial");
    \u0275\u0275elementEnd();
    \u0275\u0275template(40, DetalleCertificadoComponent_Conditional_6_Conditional_40_Template, 2, 0, "p", 2)(41, DetalleCertificadoComponent_Conditional_6_Conditional_41_Template, 2, 1, "p", 3)(42, DetalleCertificadoComponent_Conditional_6_Conditional_42_Template, 2, 1, "p", 3)(43, DetalleCertificadoComponent_Conditional_6_Conditional_43_Template, 2, 1, "p", 3)(44, DetalleCertificadoComponent_Conditional_6_Conditional_44_Template, 2, 1, "p", 3)(45, DetalleCertificadoComponent_Conditional_6_Conditional_45_Template, 2, 0, "p")(46, DetalleCertificadoComponent_Conditional_6_Conditional_46_Template, 28, 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_9_0;
    let tmp_15_0;
    let tmp_16_0;
    let tmp_17_0;
    let tmp_18_0;
    const registro_r1 = ctx;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r2.documentoId() !== null ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r2.cargandoDocumentos() && !ctx_r2.errorDocumentos() ? 1 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Certificado #", registro_r1.id_certificado, "");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r2.nombreBeneficiario(registro_r1.id_persona));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r2.dni() || "No disponible");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r2.nombreTipoCertificado(registro_r1.id_tipo_certificado));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r2.nombreOrigenCertificado(registro_r1));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate((tmp_9_0 = registro_r1.fecha_emision) !== null && tmp_9_0 !== void 0 ? tmp_9_0 : "\u2014");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r2.estadoRegistro(registro_r1.estado));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(registro_r1.notificado ? "S\xED" : "No");
    \u0275\u0275advance(2);
    \u0275\u0275property("appHasPermission", "emision.editar");
    \u0275\u0275advance();
    \u0275\u0275property("appHasPermission", "emision.ver");
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r2.cargandoDocumentos() ? 40 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_15_0 = ctx_r2.errorDocumentos()) ? 41 : -1, tmp_15_0);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_16_0 = ctx_r2.errorFirmas()) ? 42 : -1, tmp_16_0);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_17_0 = ctx_r2.errorFirmantes()) ? 43 : -1, tmp_17_0);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_18_0 = ctx_r2.errorConsultas()) ? 44 : -1, tmp_18_0);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.tienePermisoDocumentos && !ctx_r2.cargandoDocumentos() && !ctx_r2.errorDocumentos() && !ctx_r2.documentos().length ? 45 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.documentos().length ? 46 : -1);
  }
}
var DetalleCertificadoComponent = class _DetalleCertificadoComponent {
  api = inject(EmisionCertificadosService);
  auth = inject(AuthService);
  route = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef);
  cambiosCertificados = inject(CambiosCertificadosService);
  certificado = signal(null);
  documentos = signal([]);
  firmas = signal(/* @__PURE__ */ new Map());
  consultas = signal(/* @__PURE__ */ new Map());
  cargando = signal(true);
  cargandoDocumentos = signal(false);
  error = signal(null);
  errorDocumentos = signal(null);
  errorFirmas = signal(null);
  errorConsultas = signal(null);
  tienePermisoDocumentos = this.auth.tienePermiso("emision.ver");
  tipoNombre = signal(null);
  origenNombre = signal(null);
  cambio = new Subject();
  reconocimiento = signal(null);
  firmantes = signal({});
  documentoId = signal(null);
  documentoSeleccionado = computed(() => this.documentoId() === null ? this.documentos().find((d) => d.estado === "Vigente") ?? null : this.documentos().find((documento) => documento.id_certificado_documento === this.documentoId()) ?? null);
  actividadVisual = signal(null);
  cargandoFirmas = signal(false);
  errorFirmantes = signal(null);
  beneficiario = signal(null);
  dni = signal(null);
  errorRelaciones = signal(null);
  estadoRegistro = etiquetaEstado;
  constructor() {
    afterNextRender(() => {
      merge(this.route.paramMap, this.cambiosCertificados.cambios$.pipe(map(() => this.route.snapshot.paramMap))).pipe(tap((parametros) => {
        this.cambio.next();
        this.certificado.set(null);
        this.documentos.set([]);
        this.cargando.set(true);
        this.error.set(null);
        this.firmas.set(/* @__PURE__ */ new Map());
        this.consultas.set(/* @__PURE__ */ new Map());
        this.firmantes.set({});
        this.errorDocumentos.set(null);
        this.errorFirmas.set(null);
        this.errorConsultas.set(null);
        this.errorFirmantes.set(null);
        this.cargandoDocumentos.set(false);
        this.cargandoFirmas.set(false);
        this.tipoNombre.set(null);
        this.origenNombre.set(null);
        this.reconocimiento.set(null);
        this.beneficiario.set(null);
        this.dni.set(null);
        this.errorRelaciones.set(null);
        this.actividadVisual.set(null);
        this.documentoId.set(parametros.has("documentoId") ? Number(parametros.get("documentoId")) : null);
      }), switchMap((parametros) => {
        const id = Number(parametros.get("id"));
        if (!Number.isSafeInteger(id) || id <= 0) {
          this.error.set("El identificador no es v\xE1lido.");
          return of(null);
        }
        return this.api.obtener("certificados", id).pipe(catchError((error) => {
          this.error.set(error.mensaje);
          return of(null);
        }));
      }), takeUntilDestroyed(this.destroyRef)).subscribe((certificado) => {
        this.certificado.set(certificado);
        this.cargando.set(false);
        if (certificado) {
          this.cargarRelaciones(certificado);
          this.cargarDocumentos(certificado.id_certificado);
        }
      });
    });
  }
  cargarRelaciones(certificado) {
    this.api.personaReconocimiento(certificado.id_persona).pipe(takeUntil(this.cambio), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (persona) => this.beneficiario.set([persona.nombres, persona.apellido_paterno, persona.apellido_materno].filter(Boolean).join(" ")),
      error: (error) => this.errorRelaciones.set("Beneficiario: " + error.mensaje)
    });
    this.api.documentosIdentidad().pipe(takeUntil(this.cambio), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (documentos) => this.dni.set(documentos[certificado.id_persona] ?? null),
      error: (error) => this.errorRelaciones.update((actual) => [actual, "DNI: " + error.mensaje].filter(Boolean).join(" \xB7 "))
    });
    let origenes$ = of([]);
    if (certificado.id_participacion && this.auth.tienePermiso("participantes.ver")) {
      origenes$ = this.api.relacionRegistros("participation").pipe(catchError((error) => {
        this.errorRelaciones.set(error.mensaje);
        return of([]);
      }));
    } else if (certificado.id_practica && this.auth.tienePermiso("practicantes.ver")) {
      origenes$ = this.api.relacionRegistros("practices/list").pipe(catchError((error) => {
        this.errorRelaciones.set(error.mensaje);
        return of([]);
      }));
    } else if (certificado.id_reconocimiento && this.auth.tienePermiso("reconocimientos.ver")) {
      origenes$ = this.api.obtener("reconocimientos", certificado.id_reconocimiento).pipe(tap((registro) => this.reconocimiento.set(registro)), map((registro) => [registro]), catchError((error) => {
        this.errorRelaciones.set(error.mensaje);
        return of([]);
      }));
    }
    forkJoin({
      tipo: this.api.obtener("tipos-certificado", certificado.id_tipo_certificado).pipe(catchError((error) => {
        this.errorRelaciones.set(error.mensaje);
        return of(null);
      })),
      origenes: origenes$
    }).pipe(takeUntil(this.cambio), takeUntilDestroyed(this.destroyRef)).subscribe(({ tipo, origenes }) => {
      this.tipoNombre.set(tipo?.nombre_tipo ?? null);
      if (certificado.id_participacion) {
        const participacion = origenes.find((fila) => Number(fila["id_participacion"]) === certificado.id_participacion);
        this.origenNombre.set(participacion ? `Participaci\xF3n #${certificado.id_participacion}` : null);
        if (participacion && this.auth.tienePermiso("actividades.ver"))
          this.api.obtener("activity", Number(participacion["id_actividad"])).pipe(takeUntil(this.cambio), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (actividad) => {
              this.actividadVisual.set(actividad);
              this.origenNombre.set(String(actividad["nombre"]));
            },
            error: (error) => this.errorRelaciones.set(error.mensaje)
          });
      } else if (certificado.id_practica) {
        const practica = origenes.find((fila) => Number(fila["id_practica"]) === certificado.id_practica);
        this.origenNombre.set(practica ? `Pr\xE1ctica: ${String(practica["carrera"] ?? "")}` : null);
      } else if (certificado.id_reconocimiento) {
        const reconocimiento = origenes.find((fila) => Number(fila["id_reconocimiento"]) === certificado.id_reconocimiento);
        this.origenNombre.set(reconocimiento ? `Reconocimiento: ${String(reconocimiento["titulo"] ?? "")}` : null);
      }
    });
  }
  cargarDocumentos(idCertificado) {
    if (!this.tienePermisoDocumentos) {
      this.errorDocumentos.set("No tienes permiso para consultar los documentos asociados.");
      return;
    }
    this.cargandoDocumentos.set(true);
    this.errorDocumentos.set(null);
    this.api.listarTodos("certificados-documentos", { id_certificado: idCertificado }).pipe(takeUntil(this.cambio), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (documentos) => {
        this.documentos.set(documentos);
        this.cargandoDocumentos.set(false);
        if (!documentos.length)
          return;
        this.cargandoFirmas.set(true);
        forkJoin({
          firmas: forkJoin(documentos.map((documento) => this.api.listarTodos("certificados-firmas", { id_certificado_documento: documento.id_certificado_documento }).pipe(catchError((error) => {
            this.errorFirmas.set(error.mensaje);
            return of([]);
          })))),
          consultas: forkJoin(documentos.map((documento) => this.api.listarTodos("consultas-certificado", { id_certificado_documento: documento.id_certificado_documento }).pipe(catchError((error) => {
            this.errorConsultas.set(error.mensaje);
            return of([]);
          }))))
        }).pipe(takeUntil(this.cambio), takeUntilDestroyed(this.destroyRef)).subscribe(({ firmas: firmasPorDocumento, consultas: consultasPorDocumento }) => {
          const agrupadas = /* @__PURE__ */ new Map();
          const historial = /* @__PURE__ */ new Map();
          documentos.forEach((documento, indice) => {
            agrupadas.set(documento.id_certificado_documento, firmasPorDocumento[indice] ?? []);
            historial.set(documento.id_certificado_documento, consultasPorDocumento[indice] ?? []);
          });
          this.firmas.set(agrupadas);
          this.consultas.set(historial);
          this.cargandoFirmas.set(false);
          this.cargarFirmantes(firmasPorDocumento.flat());
        });
      },
      error: (error) => {
        this.cargandoDocumentos.set(false);
        this.errorDocumentos.set(error.mensaje);
      }
    });
  }
  cargarFirmantes(firmas) {
    if (!firmas.length || !this.auth.tienePermiso("ponentes-firmantes.ver"))
      return;
    forkJoin({
      trabajadores: this.api.trabajadores(),
      firmas: forkJoin([...new Set(firmas.map((fila) => fila.id_firma))].map((id) => this.api.obtener("firmas", id)))
    }).pipe(takeUntil(this.cambio), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: ({ trabajadores, firmas: registros }) => {
        const firmantes = {};
        for (const firma of registros) {
          const trabajador = trabajadores.find((fila) => fila.id_persona_trabajador === firma.id_persona_trabajador);
          if (trabajador)
            firmantes[firma.id_firma] = { cargo: trabajador.cargo, trabajador: trabajador.id_persona_trabajador };
        }
        this.firmantes.set(firmantes);
      },
      error: (error) => this.errorFirmantes.set(error.mensaje)
    });
  }
  mostrar(valor) {
    return valor === null ? "\u2014" : typeof valor === "boolean" ? valor ? "S\xED" : "No" : String(valor);
  }
  firmasDocumento(id) {
    return this.firmas().get(id) ?? [];
  }
  consultasDocumento(id) {
    return this.consultas().get(id) ?? [];
  }
  tieneConsultasHistorial() {
    return [...this.consultas().values()].some((consultas) => consultas.length > 0);
  }
  nombreBeneficiario(id) {
    return this.beneficiario() ?? `Persona #${id} \xB7 Nombre no disponible`;
  }
  nombreTipoCertificado(id) {
    return this.tipoNombre() ?? `Tipo #${id}`;
  }
  nombreOrigenCertificado(registro) {
    return this.origenNombre() ?? (registro.id_participacion ? `Participaci\xF3n #${registro.id_participacion}` : registro.id_practica ? `Pr\xE1ctica #${registro.id_practica}` : registro.id_reconocimiento ? `Reconocimiento #${registro.id_reconocimiento}` : "Sin origen asociado");
  }
  static \u0275fac = function DetalleCertificadoComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DetalleCertificadoComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DetalleCertificadoComponent, selectors: [["app-detalle-certificado"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 7, vars: 4, consts: [["title", "Detalle de certificado"], ["routerLink", "/certificaciones/certificados", 1, "btn"], ["role", "status"], ["role", "alert", 1, "alert", "alert-error"], ["role", "alert", 1, "alert", "alert-advertencia"], [1, "card", "detalle"], [1, "acciones"], ["class", "btn", 3, "routerLink", 4, "appHasPermission"], ["class", "btn", "routerLink", "/certificaciones/certificados/documentos", 3, "queryParams", 4, "appHasPermission"], [1, "card"], [1, "btn", 3, "routerLink"], [3, "certificado", "beneficiario", "dni", "lugar", "fechaActividad", "documento", "tipo", "origen", "reconocimiento", "firmas", "firmantes", "errorFirmas", "cargandoFirmas"], [3, "certificado", "beneficiario", "dni", "lugar", "fechaActividad", "tipo", "origen", "reconocimiento"], ["routerLink", "/certificaciones/certificados/documentos", 1, "btn", 3, "queryParams"], [1, "tabla"], [1, "table"], ["scope", "col", 1, "col-centro", "col-numero"], [1, "col-centro"], [1, "nota"], ["data-label", "N.\xBA", 1, "col-centro", "col-numero"], [1, "btn", "btn-consulta", 3, "routerLink"], ["routerLink", "/certificaciones/verificacion", 1, "btn", 3, "queryParams"]], template: function DetalleCertificadoComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "app-page-title", 0);
      \u0275\u0275elementStart(1, "a", 1);
      \u0275\u0275text(2, "Volver a Certificados");
      \u0275\u0275elementEnd();
      \u0275\u0275template(3, DetalleCertificadoComponent_Conditional_3_Template, 2, 0, "p", 2)(4, DetalleCertificadoComponent_Conditional_4_Template, 2, 1, "p", 3)(5, DetalleCertificadoComponent_Conditional_5_Template, 2, 1, "p", 4)(6, DetalleCertificadoComponent_Conditional_6_Template, 47, 19);
    }
    if (rf & 2) {
      let tmp_1_0;
      let tmp_2_0;
      let tmp_3_0;
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.cargando() ? 3 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_1_0 = ctx.error()) ? 4 : -1, tmp_1_0);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_2_0 = ctx.errorRelaciones()) ? 5 : -1, tmp_2_0);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_3_0 = ctx.certificado()) ? 6 : -1, tmp_3_0);
    }
  }, dependencies: [RouterLink, PageTitleComponent, HasPermissionDirective, VisorCertificadoComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.encabezado[_ngcontent-%COMP%], \n.acciones[_ngcontent-%COMP%], \n.paginacion[_ngcontent-%COMP%], \n.filtros[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: var(--espacio-3);\n}\n.encabezado[_ngcontent-%COMP%] {\n  justify-content: space-between;\n  margin-bottom: var(--espacio-4);\n}\n.acciones[_ngcontent-%COMP%], \n.filtros[_ngcontent-%COMP%], \n.paginacion[_ngcontent-%COMP%] {\n  margin-block: var(--espacio-4);\n}\n.tabla[_ngcontent-%COMP%] {\n  overflow-x: auto;\n}\n.grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));\n  gap: var(--espacio-4);\n}\n.form-field[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.detalle[_ngcontent-%COMP%] {\n  margin-block: var(--espacio-5);\n}\ndt[_ngcontent-%COMP%] {\n  color: var(--neutro-500);\n  font-size: 0.875rem;\n}\ndd[_ngcontent-%COMP%] {\n  margin: 0 0 var(--espacio-3);\n  overflow-wrap: anywhere;\n}\n.nota[_ngcontent-%COMP%] {\n  color: var(--neutro-700);\n  font-size: 0.875rem;\n}\n.table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  overflow-wrap: anywhere;\n}\n.errores[_ngcontent-%COMP%] {\n  color: var(--color-error);\n}\n.reconocimiento[_ngcontent-%COMP%] {\n  border-top: 3px solid var(--boton-dorado);\n  overflow-wrap: anywhere;\n}\n.reconocimiento[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin-top: var(--espacio-4);\n  font-size: 1.25rem;\n}\n/*# sourceMappingURL=emision.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DetalleCertificadoComponent, { className: "DetalleCertificadoComponent", filePath: "src\\app\\pages\\emision-certificados\\certificados\\detalle-certificado\\detalle-certificado.component.ts", lineNumber: 19 });
})();
export {
  DetalleCertificadoComponent
};
//# sourceMappingURL=chunk-QI4QF6G2.mjs.map
