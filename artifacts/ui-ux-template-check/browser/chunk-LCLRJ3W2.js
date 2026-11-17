import {
  PracticeService
} from "./chunk-WQAUTSZQ.js";
import {
  VisorPdfComponent
} from "./chunk-SHX4IWTT.js";
import "./chunk-GSJP3MML.js";
import {
  estadoDocumentalPractica
} from "./chunk-G7UWZ5KI.js";
import {
  CambiosCertificadosService
} from "./chunk-IQ6JWCBX.js";
import {
  DocumentosDigitalesService,
  mensajeEtapaA,
  validarMensajeCertificado
} from "./chunk-U23GPSM7.js";
import {
  ActivatedRoute,
  Router,
  RouterLink
} from "./chunk-A36LAIDM.js";
import {
  aErrorApi
} from "./chunk-LSGUT5KG.js";
import "./chunk-7PBBQCKX.js";
import {
  takeUntilDestroyed
} from "./chunk-IJ23LC2U.js";
import {
  DefaultValueAccessor,
  FormControlDirective,
  NgControlStatus,
  NonNullableFormBuilder,
  ReactiveFormsModule
} from "./chunk-YLHEVWGL.js";
import {
  DestroyRef,
  inject,
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
  ɵɵpureFunction0,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-3ZDGBTDF.js";
import "./chunk-ZX6IUAQ5.js";

// src/app/pages/emision-certificados/generar-emitir/preparar-practica.component.ts
var _c0 = () => ({ origen_documental: "practica" });
function PrepararPracticaComponent_For_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const titulo_r1 = ctx.$implicit;
    const $index_r2 = ctx.$index;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275attribute("aria-current", ctx_r2.paso() === $index_r2 + 1 ? "step" : null);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", $index_r2 + 1, ". ", titulo_r1, "");
  }
}
function PrepararPracticaComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 5);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.operacion());
  }
}
function PrepararPracticaComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 6);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 7);
    \u0275\u0275listener("click", function PrepararPracticaComponent_Conditional_11_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.reintentar());
    });
    \u0275\u0275text(3, "Reintentar");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.error());
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r2.ocupado());
  }
}
function PrepararPracticaComponent_Conditional_12_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "h2");
    \u0275\u0275text(1, "Datos del certificado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dl", 11)(3, "div")(4, "dt");
    \u0275\u0275text(5, "Practicante");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "dd");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div")(9, "dt");
    \u0275\u0275text(10, "Tipo de certificado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "dd");
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div")(14, "dt");
    \u0275\u0275text(15, "Instituci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "dd");
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "div")(19, "dt");
    \u0275\u0275text(20, "\xC1rea municipal");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "dd");
    \u0275\u0275text(22);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "div")(24, "dt");
    \u0275\u0275text(25, "Carrera");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "dd");
    \u0275\u0275text(27);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(28, "div")(29, "dt");
    \u0275\u0275text(30, "Fecha de inicio");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "dd");
    \u0275\u0275text(32);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(33, "div")(34, "dt");
    \u0275\u0275text(35, "Fecha de finalizaci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "dd");
    \u0275\u0275text(37);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(38, "div")(39, "dt");
    \u0275\u0275text(40, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "dd");
    \u0275\u0275text(42);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(43, "div")(44, "dt");
    \u0275\u0275text(45, "Elegibilidad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(46, "dd");
    \u0275\u0275text(47);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const e_r6 = \u0275\u0275nextContext();
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r2.nombre());
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(e_r6.tipo_certificado || "Pr\xE1cticas");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(e_r6.practica.institucion || "\u2014");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(e_r6.practica.area || "\u2014");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(e_r6.practica.carrera || "\u2014");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(e_r6.practica.fecha_inicio || "\u2014");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(e_r6.practica.fecha_fin || "\u2014");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(e_r6.finalizacion_registrada ? "Finalizado" : e_r6.practica.estado);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(e_r6.estado_elegibilidad);
  }
}
function PrepararPracticaComponent_Conditional_12_Conditional_2_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 5);
    \u0275\u0275text(1, "Cargando mensaje\u2026");
    \u0275\u0275elementEnd();
  }
}
function PrepararPracticaComponent_Conditional_12_Conditional_2_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 16);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 17);
    \u0275\u0275listener("click", function PrepararPracticaComponent_Conditional_12_Conditional_2_Conditional_5_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.consultarMensaje());
    });
    \u0275\u0275text(3, "Reintentar consulta");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.errorMensaje());
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r2.cargandoMensaje());
  }
}
function PrepararPracticaComponent_Conditional_12_Conditional_2_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 16);
    \u0275\u0275text(1, "Escribe un mensaje de texto plano, no vac\xEDo y de hasta 1.200 caracteres, sin HTML ni caracteres de control.");
    \u0275\u0275elementEnd();
  }
}
function PrepararPracticaComponent_Conditional_12_Conditional_2_Conditional_12_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-visor-pdf", 18);
  }
  if (rf & 2) {
    \u0275\u0275property("archivoPrevio", ctx)("persistido", true)("integrado", true)("ajustarAncho", true);
  }
}
function PrepararPracticaComponent_Conditional_12_Conditional_2_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, PrepararPracticaComponent_Conditional_12_Conditional_2_Conditional_12_Conditional_0_Template, 1, 4, "app-visor-pdf", 18);
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275conditional((tmp_4_0 = ctx_r2.archivo()) ? 0 : -1, tmp_4_0);
  }
}
function PrepararPracticaComponent_Conditional_12_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "h2");
    \u0275\u0275text(1, "Mensaje del certificado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p", 12);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275template(4, PrepararPracticaComponent_Conditional_12_Conditional_2_Conditional_4_Template, 2, 0, "small", 5)(5, PrepararPracticaComponent_Conditional_12_Conditional_2_Conditional_5_Template, 4, 2);
    \u0275\u0275elementStart(6, "label", 13);
    \u0275\u0275text(7, "Mensaje ");
    \u0275\u0275element(8, "textarea", 14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "small", 15);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275template(11, PrepararPracticaComponent_Conditional_12_Conditional_2_Conditional_11_Template, 2, 0, "p", 16)(12, PrepararPracticaComponent_Conditional_12_Conditional_2_Conditional_12_Template, 1, 1);
  }
  if (rf & 2) {
    let tmp_7_0;
    let tmp_11_0;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r2.documento() ? "Este es el mensaje aprobado del documento preparado. Su contenido se conserva sin cambios." : "Puedes conservar el texto predeterminado o personalizarlo antes de preparar el certificado.");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.cargandoMensaje() ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.errorMensaje() ? 5 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275property("formControl", ctx_r2.mensajeCertificado)("readonly", !!ctx_r2.documento() || ((tmp_7_0 = ctx_r2.evaluacion()) == null ? null : tmp_7_0.texto_editable) === false || ctx_r2.ocupado());
    \u0275\u0275attribute("aria-invalid", ctx_r2.mensajeCertificado.invalid && ctx_r2.mensajeCertificado.dirty);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", ctx_r2.caracteresMensaje(), " / 1.200 caracteres");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.mensajeCertificado.invalid && (ctx_r2.mensajeCertificado.dirty || ctx_r2.mensajeCertificado.touched) && !ctx_r2.documento() ? 11 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.documento() && !((tmp_11_0 = ctx_r2.documento()) == null ? null : tmp_11_0.mensaje_aprobado) && !((tmp_11_0 = ctx_r2.documento()) == null ? null : tmp_11_0.mensaje) && !((tmp_11_0 = ctx_r2.revision()) == null ? null : tmp_11_0.mensaje) ? 12 : -1);
  }
}
function PrepararPracticaComponent_Conditional_12_Conditional_3_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-visor-pdf", 19);
    \u0275\u0275listener("archivoVisualizado", function PrepararPracticaComponent_Conditional_12_Conditional_3_Conditional_2_Template_app_visor_pdf_archivoVisualizado_0_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.visualizado.set($event));
    })("errorVisualizacion", function PrepararPracticaComponent_Conditional_12_Conditional_3_Conditional_2_Template_app_visor_pdf_errorVisualizacion_0_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.visualizado.set(null));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275property("archivoPrevio", ctx)("persistido", !!ctx_r2.documento())("integrado", true)("ajustarAncho", true);
  }
}
function PrepararPracticaComponent_Conditional_12_Conditional_3_Conditional_3_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "La revisi\xF3n venci\xF3. Solicite una nueva revisi\xF3n para confirmar.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 7);
    \u0275\u0275listener("click", function PrepararPracticaComponent_Conditional_12_Conditional_3_Conditional_3_Conditional_2_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.renovarRevision());
    });
    \u0275\u0275text(3, "Revisar nuevamente");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r2.ocupado());
  }
}
function PrepararPracticaComponent_Conditional_12_Conditional_3_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 20);
    \u0275\u0275listener("click", function PrepararPracticaComponent_Conditional_12_Conditional_3_Conditional_3_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.confirmar());
    });
    \u0275\u0275text(1, "Confirmar preparaci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275template(2, PrepararPracticaComponent_Conditional_12_Conditional_3_Conditional_3_Conditional_2_Template, 4, 1);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275property("disabled", !ctx_r2.puedeConfirmar());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.revisionVencida() ? 2 : -1);
  }
}
function PrepararPracticaComponent_Conditional_12_Conditional_3_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 5);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Documento preparado: ", (tmp_4_0 = ctx_r2.documento()) == null ? null : tmp_4_0.estado_certificado, "");
  }
}
function PrepararPracticaComponent_Conditional_12_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "h2");
    \u0275\u0275text(1, "Previsualizaci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275template(2, PrepararPracticaComponent_Conditional_12_Conditional_3_Conditional_2_Template, 1, 4, "app-visor-pdf", 18)(3, PrepararPracticaComponent_Conditional_12_Conditional_3_Conditional_3_Template, 3, 2)(4, PrepararPracticaComponent_Conditional_12_Conditional_3_Conditional_4_Template, 2, 1, "p", 5);
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_3_0 = ctx_r2.archivo()) ? 2 : -1, tmp_3_0);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r2.documento() ? 3 : 4);
  }
}
function PrepararPracticaComponent_Conditional_12_Conditional_4_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "El certificado est\xE1 listo para enviarse a Gerencia.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 21);
    \u0275\u0275listener("click", function PrepararPracticaComponent_Conditional_12_Conditional_4_Conditional_2_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.enviar());
    });
    \u0275\u0275text(3, "Enviar a Gerencia");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r2.ocupado() || ctx_r2.cargandoMensaje());
  }
}
function PrepararPracticaComponent_Conditional_12_Conditional_4_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 5);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.estadoDocumento());
  }
}
function PrepararPracticaComponent_Conditional_12_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "h2");
    \u0275\u0275text(1, "Enviar a Gerencia");
    \u0275\u0275elementEnd();
    \u0275\u0275template(2, PrepararPracticaComponent_Conditional_12_Conditional_4_Conditional_2_Template, 4, 1)(3, PrepararPracticaComponent_Conditional_12_Conditional_4_Conditional_3_Template, 2, 1, "p", 5);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.puedeEnviar() ? 2 : 3);
  }
}
function PrepararPracticaComponent_Conditional_12_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 21);
    \u0275\u0275listener("click", function PrepararPracticaComponent_Conditional_12_Conditional_8_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.siguiente());
    });
    \u0275\u0275text(1, "Siguiente");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", !ctx_r2.puedeAvanzar());
  }
}
function PrepararPracticaComponent_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 8);
    \u0275\u0275template(1, PrepararPracticaComponent_Conditional_12_Conditional_1_Template, 48, 9)(2, PrepararPracticaComponent_Conditional_12_Conditional_2_Template, 13, 9)(3, PrepararPracticaComponent_Conditional_12_Conditional_3_Template, 5, 2)(4, PrepararPracticaComponent_Conditional_12_Conditional_4_Template, 4, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "nav", 9)(6, "button", 7);
    \u0275\u0275listener("click", function PrepararPracticaComponent_Conditional_12_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.anterior());
    });
    \u0275\u0275text(7, "Anterior");
    \u0275\u0275elementEnd();
    \u0275\u0275template(8, PrepararPracticaComponent_Conditional_12_Conditional_8_Template, 2, 1, "button", 10);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.paso() === 1 ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.paso() === 2 ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.paso() === 3 ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.paso() === 4 ? 4 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r2.ocupado() || ctx_r2.paso() === 1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.paso() < 4 ? 8 : -1);
  }
}
var PrepararPracticaComponent = class _PrepararPracticaComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);
  api = inject(PracticeService);
  documentos = inject(DocumentosDigitalesService);
  cambios = inject(CambiosCertificadosService);
  destroy = inject(DestroyRef);
  id = Number(this.route.snapshot.paramMap.get("practicaId"));
  pasos = ["Datos del certificado", "Mensaje", "Previsualizaci\xF3n", "Enviar a Gerencia"];
  paso = signal(1);
  evaluacion = signal(null);
  documento = signal(null);
  revision = signal(null);
  archivo = signal(null);
  visualizado = signal(null);
  ocupado = signal(false);
  operacion = signal("");
  error = signal("");
  mensajeCertificado = inject(NonNullableFormBuilder).control("", [
    validarMensajeCertificado,
    (c) => /[^\p{Z}\s\p{Cf}]/u.test(c.value) ? null : { mensaje: true }
  ]);
  cargandoMensaje = signal(false);
  errorMensaje = signal("");
  pendienteRecuperacion = false;
  mensajeEditado = false;
  repetir = () => this.cargar();
  constructor() {
    this.mensajeCertificado.valueChanges.pipe(takeUntilDestroyed(this.destroy)).subscribe(() => {
      if (!this.documento()) {
        this.mensajeEditado = true;
        this.revision.set(null);
        this.archivo.set(null);
        this.visualizado.set(null);
      }
    });
    const navigation = this.router.getCurrentNavigation();
    const e = navigation?.trigger === "imperative" ? navigation.extras.state?.["practica"] : void 0;
    if (e?.origen === "practica" && e.id_origen === this.id) {
      this.evaluacion.set(e);
      this.iniciarMensaje(e);
    } else
      this.cargar();
  }
  caracteresMensaje() {
    return Array.from(this.mensajeCertificado.value).length;
  }
  iniciarMensaje(e) {
    const certificado = e.certificados_existentes.length === 1 ? e.certificados_existentes[0] : null;
    if (certificado && String(certificado.estado).toUpperCase() !== "PREPARADO" && certificado.id_certificado_documento) {
      this.verDocumento(certificado.id_certificado, certificado.id_certificado_documento);
      return;
    }
    if (e.certificados_existentes.length) {
      this.consultarMensaje();
      return;
    }
    const mensaje = e.mensaje ?? e.mensaje_predeterminado;
    if (typeof mensaje === "string")
      this.aplicarMensaje(mensaje);
    else
      this.consultarMensaje();
  }
  aplicarMensaje(mensaje) {
    if (!this.mensajeEditado && !this.mensajeCertificado.dirty)
      this.mensajeCertificado.setValue(mensaje, { emitEvent: false });
  }
  nombre() {
    const d = this.evaluacion()?.practica;
    return [d?.nombres, d?.apellido_paterno, d?.apellido_materno].filter(Boolean).join(" ");
  }
  ejecutar(fuente, texto, exito, repetir, fallo) {
    if (this.ocupado())
      return;
    this.ocupado.set(true);
    this.operacion.set(texto);
    this.error.set("");
    this.repetir = repetir;
    fuente.pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: (v) => {
        this.ocupado.set(false);
        exito(v);
      },
      error: (err) => {
        this.ocupado.set(false);
        fallo?.();
        const e = err?.mensaje ? err : aErrorApi(err);
        this.error.set(e.status === 409 ? e.mensaje : mensajeEtapaA(e));
      }
    });
  }
  reintentar() {
    if (!this.ocupado()) {
      this.error.set("");
      this.repetir();
    }
  }
  cargar() {
    if (!Number.isSafeInteger(this.id) || this.id < 1) {
      this.error.set("La pr\xE1ctica no es v\xE1lida. Vuelva al listado.");
      return;
    }
    this.ejecutar(this.api.evaluar(this.id), "Recuperando pr\xE1ctica\u2026", (e) => {
      this.evaluacion.set(e);
      this.iniciarMensaje(e);
    }, () => this.cargar());
  }
  recuperar() {
    this.consultarMensaje();
  }
  consultarMensaje() {
    if (this.cargandoMensaje())
      return;
    this.cargandoMensaje.set(true);
    this.errorMensaje.set("");
    this.documentos.consultarPractica(this.id).pipe(takeUntilDestroyed(this.destroy)).subscribe({ next: (resultado) => {
      this.cargandoMensaje.set(false);
      if ("id_certificado_documento" in resultado) {
        const e = this.evaluacion();
        if (!e || resultado.beneficiario?.id_persona !== e.id_persona || resultado.id_tipo_certificado !== e.id_tipo_certificado) {
          this.errorMensaje.set("El documento no corresponde al practicante seleccionado.");
          return;
        }
        if (resultado.estado_certificado !== "PREPARADO" || estadoDocumentalPractica(resultado) !== "Pendiente de env\xEDo a Gerencia") {
          if (resultado.id_certificado)
            this.verDocumento(resultado.id_certificado, resultado.id_certificado_documento);
          return;
        }
        this.documento.set(resultado);
        this.pendienteRecuperacion = false;
        this.mensajeCertificado.setValue(resultado.mensaje_aprobado ?? resultado.mensaje ?? "", { emitEvent: false });
        this.mensajeCertificado.markAsPristine();
        this.revision.set(null);
        this.archivo.set(null);
        this.visualizado.set(null);
        this.error.set("");
        if (this.paso() === 3)
          this.cargarArchivo();
      } else {
        const e = resultado;
        this.evaluacion.set(e);
        this.pendienteRecuperacion = false;
        this.aplicarMensaje(e.mensaje ?? e.mensaje_predeterminado ?? "");
        this.error.set("");
      }
    }, error: (err) => {
      this.cargandoMensaje.set(false);
      const e = err?.mensaje ? err : aErrorApi(err);
      this.errorMensaje.set(e.status === 409 ? e.mensaje : mensajeEtapaA(e));
    } });
  }
  puedeAvanzar() {
    if (this.ocupado() || this.paso() >= 4)
      return false;
    if (this.paso() === 1)
      return !!this.evaluacion();
    if (this.error() || this.cargandoMensaje() || this.errorMensaje())
      return false;
    if (this.documento())
      return this.paso() !== 3 || !!this.archivo() && this.visualizado() === this.archivo();
    const e = this.evaluacion();
    return this.paso() === 2 && this.mensajeCertificado.valid && e?.texto_editable !== false && !!e?.finalizacion_registrada && e.puede_preparar && e.puede_generar_pdf && !e.certificados_existentes.length && !this.pendienteRecuperacion;
  }
  siguiente() {
    if (!this.puedeAvanzar())
      return;
    if (this.paso() === 1) {
      this.paso.set(2);
      return;
    }
    this.paso.update((p) => p + 1);
    if (this.paso() === 3) {
      if (this.documento())
        this.cargarArchivo();
      else if (!this.revision() || this.revisionVencida())
        this.renovarRevision();
    }
  }
  cargarArchivo() {
    const d = this.documento();
    if (!d || this.archivo())
      return;
    this.ejecutar(this.documentos.archivo(d.id_certificado_documento, false, d.hash_pdf), "Cargando certificado\u2026", (pdf) => this.archivo.set(pdf), () => this.cargarArchivo());
  }
  anterior() {
    if (!this.ocupado() && this.paso() > 1) {
      if (!this.pendienteRecuperacion)
        this.error.set("");
      this.paso.update((p) => p - 1);
    }
  }
  puedeConfirmar() {
    const r = this.revision();
    return !this.ocupado() && !this.documento() && !!r && r.mensaje === this.mensajeCertificado.value && this.visualizado() === r.archivo && Date.parse(r.expiresAt) > Date.now() && !this.pendienteRecuperacion;
  }
  revisionVencida() {
    const r = this.revision();
    return !!r && Date.parse(r.expiresAt) <= Date.now();
  }
  renovarRevision() {
    if (this.ocupado() || this.documento() || this.pendienteRecuperacion || this.mensajeCertificado.invalid || this.paso() !== 3)
      return;
    const mensaje = this.mensajeCertificado.value;
    this.revision.set(null);
    this.archivo.set(null);
    this.visualizado.set(null);
    this.ejecutar(this.documentos.revisarOrigen("practica", this.id, void 0, mensaje), "Generando vista previa\u2026", (r) => {
      if (this.mensajeCertificado.value !== mensaje)
        return;
      if (r.mensaje !== mensaje) {
        this.error.set("La revisi\xF3n no corresponde al mensaje escrito.");
        return;
      }
      this.revision.set(r);
      this.archivo.set(r.archivo);
    }, () => this.renovarRevision());
  }
  confirmar() {
    const r = this.revision();
    const e = this.evaluacion();
    if (!this.puedeConfirmar() || !r || !e)
      return;
    this.ejecutar(this.documentos.guardarOrigen(e, r), "Confirmando preparaci\xF3n\u2026", (d) => {
      this.documento.set(d);
      this.pendienteRecuperacion = false;
      this.mensajeCertificado.setValue(d.mensaje_aprobado ?? d.mensaje ?? r.mensaje ?? "", { emitEvent: false });
      this.paso.set(4);
      this.cambios.confirmar();
    }, () => this.recuperar(), () => {
      this.pendienteRecuperacion = true;
      this.revision.set(null);
      this.archivo.set(null);
      this.visualizado.set(null);
      this.repetir = () => {
        this.paso.set(2);
        this.recuperar();
      };
    });
  }
  puedeEnviar() {
    const d = this.documento();
    return !!d && estadoDocumentalPractica(d) === "Pendiente de env\xEDo a Gerencia" && d.facultades?.remitir === true;
  }
  estadoDocumento() {
    const d = this.documento();
    return d ? estadoDocumentalPractica(d) : "Sin documento";
  }
  enviar() {
    const d = this.documento();
    if (!d || this.paso() !== 4 || this.ocupado() || this.cargandoMensaje() || !this.puedeEnviar())
      return;
    this.ejecutar(this.documentos.obtenerRevisionEnvio(d.id_certificado_documento, d.hash_pdf).pipe(switchMap((r) => this.documentos.confirmarEnvio(d.id_certificado_documento, r.token, r.hash))), "Enviando a Gerencia\u2026", (doc) => {
      this.documento.set(doc);
      this.cambios.confirmar();
    }, () => this.recuperar());
  }
  verDocumento(certificado, documento) {
    void this.router.navigate(["/certificaciones/certificados", certificado, "documentos", documento, "visor"], { replaceUrl: true, queryParams: { origen: "practicas" } });
  }
  static \u0275fac = function PrepararPracticaComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PrepararPracticaComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PrepararPracticaComponent, selectors: [["app-preparar-practica"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 13, vars: 5, consts: [[1, "reconocimiento-asistente"], [1, "titulo-asistente"], ["routerLink", "/certificaciones/generar-emitir", "aria-label", "Volver a pr\xE1cticas", 1, "btn", "regreso-asistente", 3, "queryParams"], [1, "material-symbols-outlined"], [1, "pasos-reconocimiento"], ["role", "status"], ["role", "alert", 1, "alert", "alert-error"], [1, "btn", 3, "click", "disabled"], [1, "contenido-paso"], [1, "acciones-paso"], [1, "btn", "btn-primary", 3, "disabled"], [1, "resumen-reconocimiento", "ficha-reconocimiento"], ["id", "mensaje-practicas-ayuda"], [1, "form-field"], ["rows", "8", "aria-describedby", "mensaje-practicas-ayuda mensaje-practicas-contador", 1, "input", "mensaje", 3, "formControl", "readonly"], ["id", "mensaje-practicas-contador"], ["role", "alert"], ["type", "button", 1, "btn", 3, "click", "disabled"], [3, "archivoPrevio", "persistido", "integrado", "ajustarAncho"], [3, "archivoVisualizado", "errorVisualizacion", "archivoPrevio", "persistido", "integrado", "ajustarAncho"], [1, "btn", "confirmar", 3, "click", "disabled"], [1, "btn", "btn-primary", 3, "click", "disabled"]], template: function PrepararPracticaComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section", 0)(1, "header", 1)(2, "a", 2)(3, "span", 3);
      \u0275\u0275text(4, "arrow_back");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(5, "h1");
      \u0275\u0275text(6, "Preparar certificado de pr\xE1cticas");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(7, "ol", 4);
      \u0275\u0275repeaterCreate(8, PrepararPracticaComponent_For_9_Template, 2, 3, "li", null, \u0275\u0275repeaterTrackByIndex);
      \u0275\u0275elementEnd();
      \u0275\u0275template(10, PrepararPracticaComponent_Conditional_10_Template, 2, 1, "p", 5)(11, PrepararPracticaComponent_Conditional_11_Template, 4, 2)(12, PrepararPracticaComponent_Conditional_12_Template, 9, 6);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_4_0;
      \u0275\u0275advance(2);
      \u0275\u0275property("queryParams", \u0275\u0275pureFunction0(4, _c0));
      \u0275\u0275advance(6);
      \u0275\u0275repeater(ctx.pasos);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.ocupado() ? 10 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.error() ? 11 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_4_0 = ctx.evaluacion()) ? 12 : -1, tmp_4_0);
    }
  }, dependencies: [RouterLink, VisorPdfComponent, ReactiveFormsModule, DefaultValueAccessor, NgControlStatus, FormControlDirective], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.encabezado[_ngcontent-%COMP%], \n.acciones[_ngcontent-%COMP%], \n.paginacion[_ngcontent-%COMP%], \n.filtros[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: var(--espacio-3);\n}\n.encabezado[_ngcontent-%COMP%] {\n  justify-content: space-between;\n  margin-bottom: var(--espacio-4);\n}\n.acciones[_ngcontent-%COMP%], \n.filtros[_ngcontent-%COMP%], \n.paginacion[_ngcontent-%COMP%] {\n  margin-block: var(--espacio-4);\n}\n.tabla[_ngcontent-%COMP%] {\n  overflow-x: auto;\n}\n.grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));\n  gap: var(--espacio-4);\n}\n.form-field[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.detalle[_ngcontent-%COMP%] {\n  margin-block: var(--espacio-5);\n}\ndt[_ngcontent-%COMP%] {\n  color: var(--neutro-500);\n  font-size: 0.875rem;\n}\ndd[_ngcontent-%COMP%] {\n  margin: 0 0 var(--espacio-3);\n  overflow-wrap: anywhere;\n}\n.nota[_ngcontent-%COMP%] {\n  color: var(--neutro-700);\n  font-size: 0.875rem;\n}\n.table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  overflow-wrap: anywhere;\n}\n.errores[_ngcontent-%COMP%] {\n  color: var(--color-error);\n}\n.reconocimiento[_ngcontent-%COMP%] {\n  border-top: 3px solid var(--boton-dorado);\n  overflow-wrap: anywhere;\n}\n.reconocimiento[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin-top: var(--espacio-4);\n  font-size: 1.25rem;\n}\n/*# sourceMappingURL=emision.css.map */", "\n\n.reconocimiento-asistente[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n  color: #20374e;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%], \n.reconocimiento-asistente[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  color: #075a9b;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .titulo-asistente[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .titulo-asistente[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .regreso-asistente[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin-top: 0.3rem;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .pasos-reconocimiento[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.75rem;\n  overflow-x: auto;\n  padding: 1rem 0;\n  list-style: none;\n  border-bottom: 1px solid #dfe6ef;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .pasos-reconocimiento[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  white-space: nowrap;\n  padding: 0.5rem 0.75rem;\n  border-bottom: 3px solid #dfe6ef;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .pasos-reconocimiento[_ngcontent-%COMP%]   [aria-current=step][_ngcontent-%COMP%] {\n  color: #075a9b;\n  border-color: #bf942d;\n  font-weight: 700;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .contenido-paso[_ngcontent-%COMP%] {\n  padding: 1rem 0;\n  min-width: 0;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .acciones-paso[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n  margin-top: 1.25rem;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .confirmar[_ngcontent-%COMP%] {\n  background: #bd932d;\n  color: #172e45;\n  border-color: #bd932d;\n  font-weight: 600;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .mensaje[_ngcontent-%COMP%] {\n  white-space: pre-wrap;\n  line-height: 1.7;\n  max-width: 70rem;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .informacion-reconocimiento[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr);\n  gap: 1rem;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .ficha-reconocimiento[_ngcontent-%COMP%], \n.reconocimiento-asistente[_ngcontent-%COMP%]   .texto-reconocimiento[_ngcontent-%COMP%] {\n  padding: 1rem;\n  border: 1px solid #dfe6ef;\n  border-radius: 0.65rem;\n  min-width: 0;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0 0 0.75rem;\n  color: #075a9b;\n  font-size: 1rem;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .resumen-reconocimiento[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.8rem;\n  margin: 0;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   dt[_ngcontent-%COMP%], \n.reconocimiento-asistente[_ngcontent-%COMP%]   .ayuda-texto[_ngcontent-%COMP%] {\n  color: #53657a;\n  font-size: 0.85rem;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   dd[_ngcontent-%COMP%] {\n  margin: 0.2rem 0 0;\n  overflow-wrap: anywhere;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .funcion-ponente[_ngcontent-%COMP%], \n.reconocimiento-asistente[_ngcontent-%COMP%]   .solo-lectura[_ngcontent-%COMP%] {\n  display: inline-block;\n  font-size: 0.72rem;\n  border-radius: 0.3rem;\n  padding: 0.2rem 0.4rem;\n  background: #f7efd9;\n  color: #6d5318;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .texto-reconocimiento[_ngcontent-%COMP%] {\n  background: #f8fafc;\n  border-top: 3px solid #bd932d;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .texto-reconocimiento[_ngcontent-%COMP%]   .mensaje[_ngcontent-%COMP%] {\n  overflow-wrap: anywhere;\n  margin: 0.8rem 0;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   app-visor-pdf[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  min-width: 0;\n}\n@media (max-width: 800px) {\n  .reconocimiento-asistente[_ngcontent-%COMP%]   .informacion-reconocimiento[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .reconocimiento-asistente[_ngcontent-%COMP%]   .acciones-paso[_ngcontent-%COMP%] {\n    flex-wrap: wrap;\n  }\n}\n/*# sourceMappingURL=reconocimiento-asistente.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PrepararPracticaComponent, { className: "PrepararPracticaComponent", filePath: "src\\app\\pages\\emision-certificados\\generar-emitir\\preparar-practica.component.ts", lineNumber: 84 });
})();
export {
  PrepararPracticaComponent
};
//# sourceMappingURL=chunk-LCLRJ3W2.js.map
