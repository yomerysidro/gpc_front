import './polyfills.server.mjs';
import {
  documentoAnulado,
  etiquetaEstado
} from "./chunk-UBX3EAES.mjs";
import {
  VisorPdfComponent
} from "./chunk-FBTDJ3RZ.mjs";
import {
  DatePipe,
  PLATFORM_ID,
  inject,
  input,
  isPlatformBrowser,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
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
  ɵɵtextInterpolate3
} from "./chunk-OYAKRC2F.mjs";

// src/app/pages/emision-certificados/compartidos/visor-certificado.component.ts
var _forTrack0 = ($index, $item) => $item.id_certificado_firma;
function VisorCertificadoComponent_Conditional_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "h2");
    \u0275\u0275text(1, "Documento almacenado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "app-visor-pdf", 12);
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Estado registrado: ", (tmp_2_0 = ctx_r0.documento()) == null ? null : tmp_2_0.estado, ". Las firmas y la emisi\xF3n oficial requieren confirmaci\xF3n independiente.");
    \u0275\u0275advance();
    \u0275\u0275property("documentoId", ctx_r0.documento().id_certificado_documento);
  }
}
function VisorCertificadoComponent_Conditional_0_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 2)(1, "button", 13);
    \u0275\u0275listener("click", function VisorCertificadoComponent_Conditional_0_Conditional_6_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.imprimir());
    });
    \u0275\u0275text(2, "Imprimir previsualizaci\xF3n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.anulado((tmp_2_0 = ctx_r0.documento()) == null ? null : tmp_2_0.estado) || ctx_r0.cargandoFirmas());
  }
}
function VisorCertificadoComponent_Conditional_0_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 3);
    \u0275\u0275text(1, "Sin documento almacenado confirmado. La vista siguiente representa \xFAnicamente los datos disponibles.");
    \u0275\u0275elementEnd();
  }
}
function VisorCertificadoComponent_Conditional_0_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 8);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function VisorCertificadoComponent_Conditional_0_Conditional_20_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 14)(1, "strong");
    \u0275\u0275text(2, "No emitida \xB7 Revisi\xF3n de datos sin guardado");
    \u0275\u0275elementEnd()();
  }
}
function VisorCertificadoComponent_Conditional_0_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 14);
    \u0275\u0275text(1, "PREVISUALIZACI\xD3N \xB7 NO ES UN DOCUMENTO OFICIAL FIRMADO");
    \u0275\u0275elementEnd();
    \u0275\u0275template(2, VisorCertificadoComponent_Conditional_0_Conditional_20_Conditional_2_Template, 3, 0, "p", 14);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.soloRevision() ? 2 : -1);
  }
}
function VisorCertificadoComponent_Conditional_0_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 9);
    \u0275\u0275text(1, "Se otorga el presente certificado a:");
    \u0275\u0275elementEnd();
  }
}
function VisorCertificadoComponent_Conditional_0_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 11);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Documento: ", ctx_r0.dni(), "");
  }
}
function VisorCertificadoComponent_Conditional_0_Conditional_27_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 16);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "date");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Fecha de realizaci\xF3n: ", \u0275\u0275pipeBind2(2, 1, ctx_r0.fechaActividad(), "dd/MM/yyyy"), "");
  }
}
function VisorCertificadoComponent_Conditional_0_Conditional_27_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 16);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.lugar());
  }
}
function VisorCertificadoComponent_Conditional_0_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 15);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275template(2, VisorCertificadoComponent_Conditional_0_Conditional_27_Conditional_2_Template, 3, 4, "p", 16)(3, VisorCertificadoComponent_Conditional_0_Conditional_27_Conditional_3_Template, 2, 1, "p", 16);
    \u0275\u0275elementStart(4, "div", 17);
    \u0275\u0275element(5, "div")(6, "div");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "footer", 18)(8, "span");
    \u0275\u0275text(9, "Espacio reservado para c\xF3digo de verificaci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "span");
    \u0275\u0275text(11, "Espacio reservado para QR");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.mensajeRedactado());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.fechaActividad() ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.lugar() ? 3 : -1);
  }
}
function VisorCertificadoComponent_Conditional_0_Conditional_28_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "h3");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "dl")(5, "dt");
    \u0275\u0275text(6, "Motivo del reconocimiento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "dd");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "dt");
    \u0275\u0275text(10, "Fecha del reconocimiento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "dd");
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const registro_r3 = ctx;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(registro_r3.titulo);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(registro_r3.descripcion);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(registro_r3.motivo);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(registro_r3.fecha_reconocimiento);
  }
}
function VisorCertificadoComponent_Conditional_0_Conditional_28_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.origen() || "Contenido del origen no disponible mediante el API autorizado.");
  }
}
function VisorCertificadoComponent_Conditional_0_Conditional_28_Conditional_3_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dt");
    \u0275\u0275text(1, "Sesi\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dd");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.sesion());
  }
}
function VisorCertificadoComponent_Conditional_0_Conditional_28_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dt");
    \u0275\u0275text(1, "Actividad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dd");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275template(4, VisorCertificadoComponent_Conditional_0_Conditional_28_Conditional_3_Conditional_4_Template, 4, 1);
    \u0275\u0275elementStart(5, "dt");
    \u0275\u0275text(6, "Fecha de la sesi\xF3n / actividad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "dd");
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "dt");
    \u0275\u0275text(11, "Lugar registrado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "dd");
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "dt");
    \u0275\u0275text(15, "Elegibilidad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "dd");
    \u0275\u0275text(17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "dt");
    \u0275\u0275text(19, "Estado del documento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "dd");
    \u0275\u0275text(21, "No emitida");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.origen() || "No informada");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.sesion() ? 4 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.fechaActividad() ? \u0275\u0275pipeBind2(9, 5, ctx_r0.fechaActividad(), "dd/MM/yyyy") : "No informada");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.lugar() || "No informado");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.elegibilidad() || "No informada");
  }
}
function VisorCertificadoComponent_Conditional_0_Conditional_28_Conditional_4_Conditional_0_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dt");
    \u0275\u0275text(1, "Fecha de actividad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dd");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "date");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(5);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(4, 1, ctx_r0.fechaActividad(), "dd/MM/yyyy"));
  }
}
function VisorCertificadoComponent_Conditional_0_Conditional_28_Conditional_4_Conditional_0_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dt");
    \u0275\u0275text(1, "Lugar registrado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dd");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(5);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.lugar());
  }
}
function VisorCertificadoComponent_Conditional_0_Conditional_28_Conditional_4_Conditional_0_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dt");
    \u0275\u0275text(1, "Fecha de generaci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dd");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "dt");
    \u0275\u0275text(5, "Reemisi\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "dd");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const documentoActual_r4 = ctx;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(documentoActual_r4.fecha_generacion);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(documentoActual_r4.motivo_reemision || "Documento inicial");
  }
}
function VisorCertificadoComponent_Conditional_0_Conditional_28_Conditional_4_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dt");
    \u0275\u0275text(1, "Beneficiario");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dd");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "dt");
    \u0275\u0275text(5, "Fecha de emisi\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "dd");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275template(8, VisorCertificadoComponent_Conditional_0_Conditional_28_Conditional_4_Conditional_0_Conditional_8_Template, 5, 4)(9, VisorCertificadoComponent_Conditional_0_Conditional_28_Conditional_4_Conditional_0_Conditional_9_Template, 4, 1);
    \u0275\u0275elementStart(10, "dt");
    \u0275\u0275text(11, "Estado del certificado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "dd");
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "dt");
    \u0275\u0275text(15, "C\xF3digo \xFAnico de este documento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "dd", 8);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "dt");
    \u0275\u0275text(19, "Estado del documento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "dd");
    \u0275\u0275text(21);
    \u0275\u0275elementEnd();
    \u0275\u0275template(22, VisorCertificadoComponent_Conditional_0_Conditional_28_Conditional_4_Conditional_0_Conditional_22_Template, 8, 2);
  }
  if (rf & 2) {
    let tmp_10_0;
    let tmp_11_0;
    let tmp_12_0;
    const certificadoActual_r5 = ctx;
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.beneficiario() || "Persona #" + certificadoActual_r5.id_persona + " \xB7 Nombre no disponible");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(certificadoActual_r5.fecha_emision || "Pendiente");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.fechaActividad() ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.lugar() ? 9 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.estadoRegistro(certificadoActual_r5.estado));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(((tmp_10_0 = ctx_r0.documento()) == null ? null : tmp_10_0.codigo_verificacion) || "Pendiente: no hay c\xF3digo de documento disponible");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(((tmp_11_0 = ctx_r0.documento()) == null ? null : tmp_11_0.estado) || "Pendiente: no hay documento generado");
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_12_0 = ctx_r0.documento()) ? 22 : -1, tmp_12_0);
  }
}
function VisorCertificadoComponent_Conditional_0_Conditional_28_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, VisorCertificadoComponent_Conditional_0_Conditional_28_Conditional_4_Conditional_0_Template, 23, 8);
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275conditional((tmp_3_0 = ctx_r0.certificado()) ? 0 : -1, tmp_3_0);
  }
}
function VisorCertificadoComponent_Conditional_0_Conditional_28_Conditional_5_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 19);
    \u0275\u0275text(1, "DOCUMENTO ANULADO");
    \u0275\u0275elementEnd();
  }
}
function VisorCertificadoComponent_Conditional_0_Conditional_28_Conditional_5_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 20);
    \u0275\u0275text(1, "Consultando firmas\u2026");
    \u0275\u0275elementEnd();
  }
}
function VisorCertificadoComponent_Conditional_0_Conditional_28_Conditional_5_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 21);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("No se pudieron determinar las firmas asociadas: ", ctx_r0.errorFirmas(), "");
  }
}
function VisorCertificadoComponent_Conditional_0_Conditional_28_Conditional_5_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "No hay firmas asociadas registradas.");
    \u0275\u0275elementEnd();
  }
}
function VisorCertificadoComponent_Conditional_0_Conditional_28_Conditional_5_For_7_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const firmante_r6 = ctx;
    \u0275\u0275textInterpolate2(" \xB7 Trabajador #", firmante_r6.trabajador, " \xB7 ", firmante_r6.cargo, " ");
  }
}
function VisorCertificadoComponent_Conditional_0_Conditional_28_Conditional_5_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275template(2, VisorCertificadoComponent_Conditional_0_Conditional_28_Conditional_5_For_7_Conditional_2_Template, 1, 2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_14_0;
    const firma_r7 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3("Firma #", firma_r7.id_firma, " \xB7 Orden ", firma_r7.orden_firma, " \xB7 Fecha registrada ", firma_r7.fecha_firma, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_14_0 = ctx_r0.firmantes()[firma_r7.id_firma]) ? 2 : -1, tmp_14_0);
  }
}
function VisorCertificadoComponent_Conditional_0_Conditional_28_Conditional_5_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Consulta el QR aut\xE9ntico en el PDF almacenado. ");
  }
}
function VisorCertificadoComponent_Conditional_0_Conditional_28_Conditional_5_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " QR pendiente: no hay un documento PDF disponible para esta previsualizaci\xF3n. ");
  }
}
function VisorCertificadoComponent_Conditional_0_Conditional_28_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, VisorCertificadoComponent_Conditional_0_Conditional_28_Conditional_5_Conditional_0_Template, 2, 0, "p", 19);
    \u0275\u0275elementStart(1, "h3");
    \u0275\u0275text(2, "Firmas asociadas al documento");
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, VisorCertificadoComponent_Conditional_0_Conditional_28_Conditional_5_Conditional_3_Template, 2, 0, "p", 20)(4, VisorCertificadoComponent_Conditional_0_Conditional_28_Conditional_5_Conditional_4_Template, 2, 1, "p", 21)(5, VisorCertificadoComponent_Conditional_0_Conditional_28_Conditional_5_Conditional_5_Template, 2, 0, "p");
    \u0275\u0275repeaterCreate(6, VisorCertificadoComponent_Conditional_0_Conditional_28_Conditional_5_For_7_Template, 3, 4, "p", null, _forTrack0);
    \u0275\u0275elementStart(8, "p");
    \u0275\u0275text(9, "El registro de firmas asociadas no confirma la validez criptogr\xE1fica del documento.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "footer");
    \u0275\u0275template(11, VisorCertificadoComponent_Conditional_0_Conditional_28_Conditional_5_Conditional_11_Template, 1, 0)(12, VisorCertificadoComponent_Conditional_0_Conditional_28_Conditional_5_Conditional_12_Template, 1, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_6_0;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275conditional(ctx_r0.anulado((tmp_3_0 = ctx_r0.documento()) == null ? null : tmp_3_0.estado) ? 0 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r0.cargandoFirmas() ? 3 : ctx_r0.errorFirmas() ? 4 : !ctx_r0.firmas().length ? 5 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r0.firmas());
    \u0275\u0275advance(5);
    \u0275\u0275conditional(((tmp_6_0 = ctx_r0.documento()) == null ? null : tmp_6_0.estado) === "Vigente" ? 11 : 12);
  }
}
function VisorCertificadoComponent_Conditional_0_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, VisorCertificadoComponent_Conditional_0_Conditional_28_Conditional_0_Template, 13, 4)(1, VisorCertificadoComponent_Conditional_0_Conditional_28_Conditional_1_Template, 2, 1, "p");
    \u0275\u0275elementStart(2, "dl");
    \u0275\u0275template(3, VisorCertificadoComponent_Conditional_0_Conditional_28_Conditional_3_Template, 22, 8)(4, VisorCertificadoComponent_Conditional_0_Conditional_28_Conditional_4_Template, 1, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, VisorCertificadoComponent_Conditional_0_Conditional_28_Conditional_5_Template, 13, 3);
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional((tmp_2_0 = ctx_r0.reconocimiento()) ? 0 : 1, tmp_2_0);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r0.soloRevision() ? 3 : 4);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx_r0.soloRevision() ? 5 : -1);
  }
}
function VisorCertificadoComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 0);
    \u0275\u0275template(1, VisorCertificadoComponent_Conditional_0_Conditional_1_Template, 5, 2);
    \u0275\u0275elementStart(2, "h2");
    \u0275\u0275text(3, "Previsualizaci\xF3n institucional");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 1);
    \u0275\u0275text(5, "Borrador de metadatos. Esta vista no es el PDF oficial ni acredita una firma digital.");
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, VisorCertificadoComponent_Conditional_0_Conditional_6_Template, 3, 1, "div", 2)(7, VisorCertificadoComponent_Conditional_0_Conditional_7_Template, 2, 0, "p", 3);
    \u0275\u0275elementStart(8, "article", 4)(9, "header");
    \u0275\u0275element(10, "img", 5);
    \u0275\u0275elementStart(11, "div", 6)(12, "p");
    \u0275\u0275text(13, "Municipalidad Distrital de Morales");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "small");
    \u0275\u0275text(15, "Certificados digitales");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div", 7)(17, "span");
    \u0275\u0275text(18);
    \u0275\u0275elementEnd();
    \u0275\u0275template(19, VisorCertificadoComponent_Conditional_0_Conditional_19_Template, 2, 1, "span", 8);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(20, VisorCertificadoComponent_Conditional_0_Conditional_20_Template, 3, 1);
    \u0275\u0275elementStart(21, "h2");
    \u0275\u0275text(22);
    \u0275\u0275elementEnd();
    \u0275\u0275template(23, VisorCertificadoComponent_Conditional_0_Conditional_23_Template, 2, 0, "p", 9);
    \u0275\u0275elementStart(24, "p", 10);
    \u0275\u0275text(25);
    \u0275\u0275elementEnd();
    \u0275\u0275template(26, VisorCertificadoComponent_Conditional_0_Conditional_26_Template, 2, 1, "p", 11)(27, VisorCertificadoComponent_Conditional_0_Conditional_27_Template, 12, 3)(28, VisorCertificadoComponent_Conditional_0_Conditional_28_Template, 6, 3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_6_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_1_0 = ctx_r0.documento()) == null ? null : tmp_1_0.estado) === "Vigente" ? 1 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275conditional(!ctx_r0.soloRevision() ? 6 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0.documento() ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275classProp("documento-horizontal", ctx_r0.disenoDocumento());
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate(ctx_r0.tipo() || "Tipo pendiente de consulta");
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_6_0 = (tmp_6_0 = ctx_r0.documento()) == null ? null : tmp_6_0.codigo_verificacion) ? 19 : -1, tmp_6_0);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0.disenoDocumento() ? 20 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.tipo() || "Tipo de certificado pendiente de consulta");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.disenoDocumento() ? 23 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.beneficiario() || "Nombre no disponible");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.dni() ? 26 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.disenoDocumento() ? 27 : 28);
  }
}
var VisorCertificadoComponent = class _VisorCertificadoComponent {
  certificado = input(null);
  beneficiario = input(null);
  dni = input(null);
  lugar = input(null);
  fechaActividad = input(null);
  soloRevision = input(false);
  disenoDocumento = input(false);
  mensajeRedactado = input("");
  sesion = input(null);
  elegibilidad = input(null);
  anulado = documentoAnulado;
  estadoRegistro = etiquetaEstado;
  documento = input(null);
  tipo = input(null);
  origen = input(null);
  reconocimiento = input(null);
  firmas = input([]);
  firmantes = input({});
  errorFirmas = input(null);
  cargandoFirmas = input(false);
  plataforma = inject(PLATFORM_ID);
  imprimir() {
    if (isPlatformBrowser(this.plataforma) && this.certificado() && !documentoAnulado(this.documento()?.estado) && !this.cargandoFirmas())
      window.print();
  }
  static \u0275fac = function VisorCertificadoComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VisorCertificadoComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _VisorCertificadoComponent, selectors: [["app-visor-certificado"]], inputs: { certificado: [1, "certificado"], beneficiario: [1, "beneficiario"], dni: [1, "dni"], lugar: [1, "lugar"], fechaActividad: [1, "fechaActividad"], soloRevision: [1, "soloRevision"], disenoDocumento: [1, "disenoDocumento"], mensajeRedactado: [1, "mensajeRedactado"], sesion: [1, "sesion"], elegibilidad: [1, "elegibilidad"], documento: [1, "documento"], tipo: [1, "tipo"], origen: [1, "origen"], reconocimiento: [1, "reconocimiento"], firmas: [1, "firmas"], firmantes: [1, "firmantes"], errorFirmas: [1, "errorFirmas"], cargandoFirmas: [1, "cargandoFirmas"] }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 1, vars: 1, consts: [["aria-label", "Visor institucional"], [1, "alert", "alert-advertencia"], [1, "acciones"], [1, "nota"], [1, "certificado-borrador"], ["src", "/marca/escudo-160.webp", "srcset", "/marca/escudo-160.webp 1x, /marca/escudo-320.webp 2x", "width", "80", "height", "80", "alt", "Escudo original de la Municipalidad Distrital de Morales"], [1, "identidad"], [1, "tipo-codigo"], [1, "codigo"], [1, "otorgamiento"], [1, "beneficiario"], [1, "documento-identidad"], [3, "documentoId"], ["type", "button", 1, "btn", 3, "click", "disabled"], [1, "marca-borrador"], [1, "cuerpo-certificado"], [1, "lugar-certificado"], ["aria-label", "Espacios para firmas", 1, "espacios-firmas"], ["aria-label", "Espacio reservado para c\xF3digo y QR", 1, "reserva-verificacion"], [1, "alert", "alert-error"], ["role", "status"], ["role", "alert"]], template: function VisorCertificadoComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275template(0, VisorCertificadoComponent_Conditional_0_Template, 29, 13, "section", 0);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.certificado() || ctx.soloRevision() ? 0 : -1);
    }
  }, dependencies: [DatePipe, VisorPdfComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  margin-block: var(--espacio-5);\n}\n.acciones[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: var(--espacio-3);\n}\n.nota[_ngcontent-%COMP%], \nfooter[_ngcontent-%COMP%] {\n  color: var(--neutro-700);\n  font-size: 0.875rem;\n}\n.certificado-borrador[_ngcontent-%COMP%] {\n  max-width: 62rem;\n  margin: var(--espacio-5) auto;\n  padding: clamp(1rem, 4vw, 3rem);\n  border: 2px solid #075a9b;\n  background: #fff;\n  color: #172b41;\n  overflow-wrap: anywhere;\n}\nheader[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: auto 1fr minmax(9rem, 0.7fr);\n  gap: 1rem;\n  align-items: center;\n  border-bottom: 2px solid #c5a04b;\n  padding-bottom: var(--espacio-4);\n  margin-bottom: var(--espacio-5);\n}\nheader[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  object-fit: contain;\n}\nheader[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  display: block;\n}\nh2[_ngcontent-%COMP%] {\n  text-align: center;\n}\ndt[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\ndd[_ngcontent-%COMP%] {\n  margin: 0 0 var(--espacio-3);\n  white-space: pre-line;\n}\n.codigo[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\nfooter[_ngcontent-%COMP%] {\n  border-top: 1px solid var(--neutro-200);\n  padding-top: var(--espacio-4);\n}\n.identidad[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.15rem;\n  font-weight: 700;\n}\n.tipo-codigo[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.5rem;\n  text-align: right;\n  font-size: 0.85rem;\n}\n.beneficiario[_ngcontent-%COMP%] {\n  font-size: clamp(1.35rem, 4vw, 2.2rem);\n  text-align: center;\n  color: #075a9b;\n  font-weight: 600;\n  margin: 1.5rem 0 0.5rem;\n}\n.documento-identidad[_ngcontent-%COMP%], \n.marca-borrador[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.marca-borrador[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  letter-spacing: 0.08em;\n  color: #66788b;\n}\n@media (max-width: 600px) {\n  header[_ngcontent-%COMP%] {\n    grid-template-columns: auto 1fr;\n  }\n  .tipo-codigo[_ngcontent-%COMP%] {\n    grid-column: 1/-1;\n    text-align: left;\n  }\n}\n.documento-horizontal[_ngcontent-%COMP%] {\n  aspect-ratio: 1.414;\n  display: flex;\n  flex-direction: column;\n}\n.otorgamiento[_ngcontent-%COMP%], \n.cuerpo-certificado[_ngcontent-%COMP%], \n.lugar-certificado[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.cuerpo-certificado[_ngcontent-%COMP%] {\n  white-space: pre-wrap;\n  line-height: 1.9;\n  margin: 1.5rem auto;\n  max-width: 52rem;\n  overflow-wrap: anywhere;\n}\n.espacios-firmas[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-around;\n  gap: 2rem;\n  margin-top: auto;\n  padding-top: 4rem;\n}\n.espacios-firmas[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  border-top: 1px solid #66788b;\n  width: 35%;\n  height: 2rem;\n}\n.reserva-verificacion[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  gap: 1rem;\n  font-size: 0.7rem;\n}\n@media (max-width: 600px) {\n  .documento-horizontal[_ngcontent-%COMP%] {\n    aspect-ratio: auto;\n  }\n  .reserva-verificacion[_ngcontent-%COMP%] {\n    flex-wrap: wrap;\n  }\n}\n/*# sourceMappingURL=visor-certificado.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VisorCertificadoComponent, { className: "VisorCertificadoComponent", filePath: "src\\app\\pages\\emision-certificados\\compartidos\\visor-certificado.component.ts", lineNumber: 15 });
})();

export {
  VisorCertificadoComponent
};
//# sourceMappingURL=chunk-E7AC5UAT.mjs.map
