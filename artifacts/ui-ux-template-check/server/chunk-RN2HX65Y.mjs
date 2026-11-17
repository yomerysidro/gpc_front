import './polyfills.server.mjs';
import {
  ActivityRequestsApiService,
  IntegracionAvisoComponent,
  SolicitudDetalleComponent,
  SolicitudesService,
  mensajeSolicitudes
} from "./chunk-SQAJJQGX.mjs";
import {
  PageTitleComponent
} from "./chunk-XGG6XIOR.mjs";
import {
  ActivatedRoute,
  Router,
  RouterLink
} from "./chunk-OX7VSSQH.mjs";
import {
  AuthService
} from "./chunk-NP7M7R34.mjs";
import {
  EmisionCertificadosService
} from "./chunk-UOKIJFGD.mjs";
import {
  takeUntilDestroyed
} from "./chunk-TSKSZVR2.mjs";
import {
  DefaultValueAccessor,
  FormControlName,
  FormGroupDirective,
  MaxLengthValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NgSelectOption,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  RequiredValidator,
  SelectControlValueAccessor,
  Validators,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-SPQE7PSN.mjs";
import {
  DestroyRef,
  EMPTY,
  computed,
  distinctUntilChanged,
  effect,
  inject,
  map,
  of,
  signal,
  startWith,
  switchMap,
  throwError,
  untracked,
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
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3
} from "./chunk-OYAKRC2F.mjs";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-X7LY3JHO.mjs";

// src/app/core/interfaces/solicitudes/activity-requests-api.interface.ts
var LIMITES_SOLICITUD = { nombre: 100, sede: 100, descripcion: 255 };

// src/app/pages/solicitudes/nueva-solicitud/nueva-solicitud.component.ts
var _forTrack0 = ($index, $item) => $item.id;
var _forTrack1 = ($index, $item) => $item.clave;
function NuevaSolicitudComponent_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 8);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.error());
  }
}
function NuevaSolicitudComponent_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 9);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.aviso());
  }
}
function NuevaSolicitudComponent_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 9);
    \u0275\u0275text(1, "Consultando datos autorizados\u2026");
    \u0275\u0275elementEnd();
  }
}
function NuevaSolicitudComponent_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 10)(1, "h2");
    \u0275\u0275text(2, "Revisa los datos de tu solicitud");
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "app-solicitud-detalle", 12);
    \u0275\u0275elementStart(4, "p", 13);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 14)(7, "button", 15);
    \u0275\u0275listener("click", function NuevaSolicitudComponent_Conditional_31_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.editar());
    });
    \u0275\u0275text(8, "Volver al formulario");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "button", 15);
    \u0275\u0275listener("click", function NuevaSolicitudComponent_Conditional_31_Template_button_click_9_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.guardar());
    });
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "button", 16);
    \u0275\u0275listener("click", function NuevaSolicitudComponent_Conditional_31_Template_button_click_11_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.guardar(true));
    });
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_10_0;
    const datos_r3 = ctx;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275property("mostrarSede", !!datos_r3.lugar)("datos", datos_r3)("area", ctx_r0.nombreArea(datos_r3.areaId))("responsable", ctx_r0.responsableSolicitante() || "Nombre no disponible en la sesi\xF3n")("tipo", ctx_r0.nombreTipo(datos_r3.tipoId));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.api.integrado ? "Enviar la solicitud inicia su evaluaci\xF3n. No genera certificados ni acredita una aprobaci\xF3n." : "El servicio de Solicitudes est\xE1 pendiente de habilitaci\xF3n. No es posible guardar ni enviar.");
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.ocupado());
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !ctx_r0.puedeGuardar());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(((tmp_10_0 = ctx_r0.registro()) == null ? null : tmp_10_0.estado) === "Observada" ? "Guardar correcci\xF3n" : "Guardar borrador");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !ctx_r0.puedeEnviar());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.ocupado() ? "Procesando\u2026" : "Enviar solicitud");
  }
}
function NuevaSolicitudComponent_Conditional_32_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 25);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.cargandoAreas() ? "Cargando \xE1reas\u2026" : "Selecciona un \xE1rea");
  }
}
function NuevaSolicitudComponent_Conditional_32_For_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 26);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const area_r5 = ctx.$implicit;
    \u0275\u0275property("value", area_r5.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(area_r5.nombre);
  }
}
function NuevaSolicitudComponent_Conditional_32_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 28);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.errorAreas());
  }
}
function NuevaSolicitudComponent_Conditional_32_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small");
    \u0275\u0275text(1, "No tienes un \xE1rea habilitada para registrar solicitudes");
    \u0275\u0275elementEnd();
  }
}
function NuevaSolicitudComponent_Conditional_32_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 29);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.erroresCampos()["areaId"] || "Selecciona un \xE1rea solicitante.");
  }
}
function NuevaSolicitudComponent_Conditional_32_For_36_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 46);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const campo_r6 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("id", "error-" + campo_r6.clave);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3("", ctx_r0.erroresCampos()[campo_r6.clave], " ", campo_r6.obligatorio ? "Ingresa un nombre; no solo espacios." : "Revisa la sede propuesta.", " M\xE1ximo ", campo_r6.maximo, " caracteres.");
  }
}
function NuevaSolicitudComponent_Conditional_32_For_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22)(1, "label", 44);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "input", 45);
    \u0275\u0275template(4, NuevaSolicitudComponent_Conditional_32_For_36_Conditional_4_Template, 2, 4, "p", 46);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const campo_r6 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("for", "solicitud-" + campo_r6.clave);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", campo_r6.label, " ", campo_r6.obligatorio ? "*" : "(opcional)", "");
    \u0275\u0275advance();
    \u0275\u0275property("id", "solicitud-" + campo_r6.clave)("formControlName", campo_r6.clave)("maxlength", campo_r6.maximo)("required", campo_r6.obligatorio);
    \u0275\u0275attribute("aria-invalid", ctx_r0.form.controls[campo_r6.clave].touched && (ctx_r0.form.controls[campo_r6.clave].invalid || !!ctx_r0.erroresCampos()[campo_r6.clave]))("aria-describedby", "error-" + campo_r6.clave);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.form.controls[campo_r6.clave].touched && (ctx_r0.form.controls[campo_r6.clave].invalid || !!ctx_r0.erroresCampos()[campo_r6.clave]) ? 4 : -1);
  }
}
function NuevaSolicitudComponent_Conditional_32_For_44_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 26);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tipo_r7 = ctx.$implicit;
    \u0275\u0275property("value", tipo_r7.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(tipo_r7.nombre);
  }
}
function NuevaSolicitudComponent_Conditional_32_Conditional_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 28);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.errorTipos());
  }
}
function NuevaSolicitudComponent_Conditional_32_Conditional_46_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small");
    \u0275\u0275text(1, "No hay tipos activos disponibles.");
    \u0275\u0275elementEnd();
  }
}
function NuevaSolicitudComponent_Conditional_32_Conditional_47_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 34);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.erroresCampos()["tipoId"] || "Selecciona un tipo de actividad.");
  }
}
function NuevaSolicitudComponent_Conditional_32_Conditional_56_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 38);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.erroresCampos()["inicio"] || "Indica una fecha de inicio v\xE1lida.");
  }
}
function NuevaSolicitudComponent_Conditional_32_Conditional_61_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 41);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.erroresCampos()["fin"] || "La fecha de fin debe ser v\xE1lida y no puede preceder al inicio.");
  }
}
function NuevaSolicitudComponent_Conditional_32_For_67_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 46);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const campo_r8 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("id", "error-" + campo_r8.clave);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", ctx_r0.erroresCampos()[campo_r8.clave], " ", campo_r8.clave === "descripcion" ? "La descripci\xF3n admite hasta 255 caracteres." : "Explica la justificaci\xF3n de la actividad; no solo espacios.", "");
  }
}
function NuevaSolicitudComponent_Conditional_32_For_67_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22)(1, "label", 44);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "textarea", 47);
    \u0275\u0275template(4, NuevaSolicitudComponent_Conditional_32_For_67_Conditional_4_Template, 2, 3, "p", 46);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const campo_r8 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("for", "solicitud-" + campo_r8.clave);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", campo_r8.label, " ", campo_r8.obligatorio ? "*" : "(opcional)", "");
    \u0275\u0275advance();
    \u0275\u0275property("id", "solicitud-" + campo_r8.clave)("formControlName", campo_r8.clave)("required", campo_r8.obligatorio);
    \u0275\u0275attribute("maxlength", campo_r8.maximo)("aria-invalid", ctx_r0.form.controls[campo_r8.clave].touched && (ctx_r0.form.controls[campo_r8.clave].invalid || !!ctx_r0.erroresCampos()[campo_r8.clave]))("aria-describedby", "error-" + campo_r8.clave);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.form.controls[campo_r8.clave].touched && (ctx_r0.form.controls[campo_r8.clave].invalid || !!ctx_r0.erroresCampos()[campo_r8.clave]) ? 4 : -1);
  }
}
function NuevaSolicitudComponent_Conditional_32_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 11)(1, "div", 17)(2, "div")(3, "h2");
    \u0275\u0275text(4, "Datos de la actividad propuesta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 13);
    \u0275\u0275text(6, "Los campos con * son obligatorios.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(7, "form", 18);
    \u0275\u0275listener("ngSubmit", function NuevaSolicitudComponent_Conditional_32_Template_form_ngSubmit_7_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.revisar());
    });
    \u0275\u0275elementStart(8, "div", 19)(9, "fieldset", 20)(10, "legend");
    \u0275\u0275text(11, "Unidad solicitante");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 21)(13, "div", 22)(14, "label", 23);
    \u0275\u0275text(15, "\xC1rea solicitante *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "select", 24);
    \u0275\u0275template(17, NuevaSolicitudComponent_Conditional_32_Conditional_17_Template, 2, 1, "option", 25);
    \u0275\u0275repeaterCreate(18, NuevaSolicitudComponent_Conditional_32_For_19_Template, 2, 2, "option", 26, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "small", 27);
    \u0275\u0275text(21, "Solo se muestran las \xE1reas autorizadas por Laravel para tu usuario.");
    \u0275\u0275elementEnd();
    \u0275\u0275template(22, NuevaSolicitudComponent_Conditional_32_Conditional_22_Template, 2, 1, "p", 28)(23, NuevaSolicitudComponent_Conditional_32_Conditional_23_Template, 2, 0, "small")(24, NuevaSolicitudComponent_Conditional_32_Conditional_24_Template, 2, 1, "p", 29);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "div", 22)(26, "label", 30);
    \u0275\u0275text(27, "Responsable solicitante");
    \u0275\u0275elementEnd();
    \u0275\u0275element(28, "input", 31);
    \u0275\u0275elementStart(29, "small");
    \u0275\u0275text(30, "La identidad la determina Laravel mediante la sesi\xF3n autenticada.");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(31, "fieldset", 20)(32, "legend");
    \u0275\u0275text(33, "Actividad propuesta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "div", 21);
    \u0275\u0275repeaterCreate(35, NuevaSolicitudComponent_Conditional_32_For_36_Template, 5, 10, "div", 22, _forTrack1);
    \u0275\u0275elementStart(37, "div", 22)(38, "label", 32);
    \u0275\u0275text(39, "Tipo de actividad *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "select", 33)(41, "option", 25);
    \u0275\u0275text(42);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(43, NuevaSolicitudComponent_Conditional_32_For_44_Template, 2, 2, "option", 26, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275template(45, NuevaSolicitudComponent_Conditional_32_Conditional_45_Template, 2, 1, "p", 28)(46, NuevaSolicitudComponent_Conditional_32_Conditional_46_Template, 2, 0, "small")(47, NuevaSolicitudComponent_Conditional_32_Conditional_47_Template, 2, 1, "p", 34);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(48, "fieldset", 20)(49, "legend");
    \u0275\u0275text(50, "Programaci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(51, "div", 35)(52, "div", 22)(53, "label", 36);
    \u0275\u0275text(54, "Fecha de inicio propuesta *");
    \u0275\u0275elementEnd();
    \u0275\u0275element(55, "input", 37);
    \u0275\u0275template(56, NuevaSolicitudComponent_Conditional_32_Conditional_56_Template, 2, 1, "p", 38);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(57, "div", 22)(58, "label", 39);
    \u0275\u0275text(59, "Fecha de fin propuesta *");
    \u0275\u0275elementEnd();
    \u0275\u0275element(60, "input", 40);
    \u0275\u0275template(61, NuevaSolicitudComponent_Conditional_32_Conditional_61_Template, 2, 1, "p", 41);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(62, "fieldset", 20)(63, "legend");
    \u0275\u0275text(64, "Descripci\xF3n y justificaci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(65, "div", 21);
    \u0275\u0275repeaterCreate(66, NuevaSolicitudComponent_Conditional_32_For_67_Template, 5, 10, "div", 22, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(68, "div", 14)(69, "a", 42);
    \u0275\u0275text(70, "Cancelar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(71, "button", 15);
    \u0275\u0275listener("click", function NuevaSolicitudComponent_Conditional_32_Template_button_click_71_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.guardar());
    });
    \u0275\u0275text(72);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(73, "button", 43);
    \u0275\u0275text(74, "Revisar datos");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_29_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275property("formGroup", ctx_r0.form);
    \u0275\u0275attribute("aria-busy", ctx_r0.ocupado() || ctx_r0.cargando());
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.ocupado() || ctx_r0.cargando());
    \u0275\u0275advance(7);
    \u0275\u0275attribute("aria-invalid", ctx_r0.form.controls.areaId.touched && (ctx_r0.form.controls.areaId.invalid || !!ctx_r0.erroresCampos()["areaId"]));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.areasDisponibles().length !== 1 ? 17 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.areasDisponibles());
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r0.errorAreas() ? 22 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0.cargandoAreas() && !ctx_r0.errorAreas() && !ctx_r0.areasDisponibles().length ? 23 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.form.controls.areaId.touched && (ctx_r0.form.controls.areaId.invalid || !!ctx_r0.erroresCampos()["areaId"]) ? 24 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275property("value", ctx_r0.responsableSolicitante());
    \u0275\u0275attribute("value", ctx_r0.responsableSolicitante());
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r0.ocupado() || ctx_r0.cargando());
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r0.camposTexto);
    \u0275\u0275advance(5);
    \u0275\u0275attribute("aria-invalid", ctx_r0.form.controls.tipoId.touched && (ctx_r0.form.controls.tipoId.invalid || !!ctx_r0.erroresCampos()["tipoId"]));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.cargandoTipos() ? "Cargando tipos\u2026" : "Selecciona un tipo activo");
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.tipos());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.errorTipos() ? 45 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0.cargandoTipos() && !ctx_r0.errorTipos() && !ctx_r0.tipos().length ? 46 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.form.controls.tipoId.touched && (ctx_r0.form.controls.tipoId.invalid || !!ctx_r0.erroresCampos()["tipoId"]) ? 47 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.ocupado() || ctx_r0.cargando());
    \u0275\u0275advance(7);
    \u0275\u0275attribute("aria-invalid", ctx_r0.form.controls.inicio.touched && (ctx_r0.form.controls.inicio.invalid || !!ctx_r0.erroresCampos()["inicio"] || ctx_r0.form.hasError("fechaInvalida")));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.form.controls.inicio.touched && (ctx_r0.form.controls.inicio.invalid || !!ctx_r0.erroresCampos()["inicio"] || ctx_r0.form.hasError("fechaInvalida")) ? 56 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275property("min", ctx_r0.form.controls.inicio.value);
    \u0275\u0275attribute("aria-invalid", ctx_r0.form.controls.fin.touched && (ctx_r0.form.controls.fin.invalid || !!ctx_r0.erroresCampos()["fin"] || ctx_r0.form.invalid && !!ctx_r0.form.errors));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.form.controls.fin.touched && (ctx_r0.form.controls.fin.invalid || !!ctx_r0.erroresCampos()["fin"] || ctx_r0.form.errors) ? 61 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.ocupado() || ctx_r0.cargando());
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r0.camposLargos);
    \u0275\u0275advance(5);
    \u0275\u0275property("disabled", !ctx_r0.puedeGuardar());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(((tmp_29_0 = ctx_r0.registro()) == null ? null : tmp_29_0.estado) === "Observada" ? "Guardar correcci\xF3n" : "Guardar borrador");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.ocupado() || ctx_r0.cargando());
  }
}
function fechasSolicitud(control) {
  const inicio = control.get("inicio")?.value;
  const fin = control.get("fin")?.value;
  const valida = (valor) => /^\d{4}-\d{2}-\d{2}$/.test(valor) && !Number.isNaN(Date.parse(valor)) && new Date(valor).toISOString().slice(0, 10) === valor;
  if (typeof inicio === "string" && inicio && !valida(inicio) || typeof fin === "string" && fin && !valida(fin))
    return { fechaInvalida: true };
  return typeof inicio === "string" && typeof fin === "string" && inicio && fin && fin < inicio ? { ordenFechas: true } : null;
}
var textoObligatorio = (maximo) => [Validators.required, Validators.pattern(/\S/), Validators.maxLength(maximo)];
var NuevaSolicitudComponent = class _NuevaSolicitudComponent {
  api = inject(SolicitudesService);
  catalogos = inject(EmisionCertificadosService);
  solicitudesHttp = inject(ActivityRequestsApiService);
  auth = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef);
  cargaRegistro;
  cargaAreas;
  operacion;
  usuarioAreas = this.auth.usuario();
  permisoAreas = this.auth.tienePermiso("solicitudes.crear");
  areasUsuario = signal(null);
  contexto = signal(null);
  responsableSolicitante = computed(() => this.auth.usuario()?.nombre?.trim() || this.contexto()?.responsable?.trim() || "");
  registro = signal(null);
  tipos = signal([]);
  areasCatalogo = signal([]);
  areasDisponibles = computed(() => this.areasCatalogo());
  cargandoTipos = signal(false);
  cargandoAreas = signal(false);
  errorTipos = signal(null);
  errorAreas = signal(null);
  cargando = signal(false);
  ocupado = signal(false);
  error = signal(null);
  aviso = signal(null);
  confirmar = signal(null);
  erroresCampos = signal({});
  puedeGuardar() {
    if (this.form.invalid || this.form.pending || Object.keys(this.erroresCampos()).length || this.cargando() || this.ocupado() || this.cargandoTipos() || this.cargandoAreas() || !!this.errorAreas() || !this.areaAutorizada())
      return false;
    return this.api.integrado ? !!this.contexto() && (this.registro()?.puedeEditar ?? this.contexto()?.puedeCrear ?? false) : false;
  }
  form = inject(NonNullableFormBuilder).group({
    areaId: ["", Validators.required],
    nombre: ["", textoObligatorio(LIMITES_SOLICITUD.nombre)],
    tipoId: ["", Validators.required],
    descripcion: ["", Validators.maxLength(LIMITES_SOLICITUD.descripcion)],
    objetivo: ["", [Validators.required, Validators.pattern(/\S/)]],
    inicio: ["", Validators.required],
    fin: ["", Validators.required],
    lugar: ["", Validators.maxLength(LIMITES_SOLICITUD.sede)]
  }, { validators: fechasSolicitud });
  camposTexto = [
    { clave: "nombre", label: "Nombre de la actividad", maximo: LIMITES_SOLICITUD.nombre, obligatorio: true }
  ];
  camposLargos = [
    { clave: "descripcion", label: "Descripci\xF3n", obligatorio: false, maximo: LIMITES_SOLICITUD.descripcion },
    { clave: "objetivo", label: "Objetivo o justificaci\xF3n", obligatorio: true, maximo: null }
  ];
  constructor() {
    effect(() => {
      const usuario = this.auth.usuario();
      const permiso = this.auth.tienePermiso("solicitudes.crear");
      if (usuario === this.usuarioAreas && permiso === this.permisoAreas)
        return;
      const cambioPrincipal = usuario?.id !== this.usuarioAreas?.id;
      this.usuarioAreas = usuario;
      this.permisoAreas = permiso;
      untracked(() => {
        if (cambioPrincipal) {
          this.cargaRegistro?.unsubscribe();
          this.registro.set(null);
          this.cargando.set(false);
        }
        if (cambioPrincipal || !permiso) {
          this.operacion?.unsubscribe();
          this.ocupado.set(false);
        }
        this.confirmar.set(null);
        this.contexto.set(null);
        this.erroresCampos.set({});
        this.aviso.set(null);
        this.cargarAreasAutorizadas();
        if (usuario && this.api.integrado)
          this.api.contexto().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (contexto) => this.contexto.set(contexto),
            error: (error) => this.error.set(mensajeSolicitudes(error))
          });
      });
    }, { allowSignalWrites: true });
  }
  areaAutorizada() {
    return !!this.auth.usuario() && this.areasUsuario() === this.auth.usuario() && this.auth.tienePermiso("solicitudes.crear") && this.areasDisponibles().some((area) => area.id === this.form.controls.areaId.value);
  }
  ngOnInit() {
    for (const [clave, control] of Object.entries(this.form.controls)) {
      control.valueChanges.pipe(startWith(control.value), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        if (!this.erroresCampos()[clave])
          return;
        this.erroresCampos.update((errores) => {
          const nuevos = __spreadValues({}, errores);
          delete nuevos[clave];
          return nuevos;
        });
      });
    }
    this.cargarCatalogos();
    if (!this.api.integrado) {
      this.route.queryParamMap.pipe(map((parametros) => parametros.get("editar")), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef)).subscribe((id) => {
        this.cargaRegistro?.unsubscribe();
        this.registro.set(null);
        this.confirmar.set(null);
        this.form.reset();
        this.aviso.set(null);
        this.error.set(null);
        this.cargando.set(false);
        if (id)
          this.error.set("La consulta y edici\xF3n de solicitudes est\xE1n pendientes de habilitaci\xF3n.");
      });
      return;
    }
    this.cargando.set(true);
    this.api.contexto().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (contexto) => {
        this.contexto.set(contexto);
        this.route.queryParamMap.pipe(map((parametros) => parametros.get("editar")), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef)).subscribe((id) => {
          this.cargaRegistro?.unsubscribe();
          this.registro.set(null);
          this.confirmar.set(null);
          this.form.reset();
          this.aviso.set(null);
          this.error.set(null);
          this.seleccionarArea();
          if (id) {
            this.cargando.set(true);
            this.cargarRegistro(id);
          } else
            this.cargando.set(false);
        });
      },
      error: (error) => {
        this.error.set(mensajeSolicitudes(error));
        this.cargando.set(false);
      }
    });
  }
  cargarCatalogos() {
    const permisoCatalogos = this.api.integrado && ["crear", "consultar", "propias"].some((clave) => this.auth.tienePermiso(`solicitudes.${clave}`));
    if (!this.cargandoAreas())
      this.cargarAreasAutorizadas();
    if (this.cargandoTipos())
      return;
    this.errorTipos.set(null);
    if (this.auth.tienePermiso("actividades.ver") || permisoCatalogos) {
      this.cargandoTipos.set(true);
      this.catalogos.listarTodos("ativicty-type", { estado: 1 }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (filas) => {
          this.tipos.set(filas.flatMap((fila) => {
            const nombre = fila["nombre"];
            const id = fila["id_tipo_actividad"];
            return [true, 1, "1"].includes(fila["estado"]) && typeof nombre === "string" && !!nombre.trim() && Number.isSafeInteger(Number(id)) && Number(id) > 0 ? [{ id: String(id), nombre }] : [];
          }));
          this.cargandoTipos.set(false);
        },
        error: (error) => {
          this.tipos.set([]);
          this.errorTipos.set(mensajeSolicitudes(error));
          this.cargandoTipos.set(false);
        }
      });
    } else
      this.errorTipos.set("La consulta de tipos requiere el permiso de Actividades.");
  }
  seleccionarArea(anterior = this.form.controls.areaId.value) {
    const areas = this.areasDisponibles();
    this.form.controls.areaId.setValue(areas.length === 1 ? areas[0].id : areas.some((area) => area.id === anterior) ? anterior : "");
  }
  cargarAreasAutorizadas() {
    this.cargaAreas?.unsubscribe();
    const anterior = this.form.controls.areaId.value;
    this.areasUsuario.set(null);
    this.areasCatalogo.set([]);
    this.form.controls.areaId.setValue("");
    this.errorAreas.set(null);
    this.cargandoAreas.set(false);
    const usuario = this.auth.usuario();
    if (!usuario) {
      this.errorAreas.set("Sesi\xF3n no autenticada o caducada. Inicia sesi\xF3n para continuar.");
      return;
    }
    if (!this.auth.tienePermiso("solicitudes.crear")) {
      this.errorAreas.set("Tu usuario no tiene permiso para crear solicitudes");
      return;
    }
    this.cargandoAreas.set(true);
    this.cargaAreas = this.solicitudesHttp.areasAutorizadas().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (filas) => {
        if (this.auth.usuario() !== usuario || !this.auth.tienePermiso("solicitudes.crear"))
          return;
        this.areasCatalogo.set(filas.map((fila) => ({ id: String(fila.id_area), nombre: fila.nombre })));
        this.areasUsuario.set(usuario);
        this.cargandoAreas.set(false);
        this.seleccionarArea(anterior || this.registro()?.areaId || "");
      },
      error: (error) => {
        this.cargandoAreas.set(false);
        this.errorAreas.set(error?.status === 403 ? "Tu usuario no tiene permiso para crear solicitudes" : mensajeSolicitudes(error));
      }
    });
  }
  cargarRegistro(id) {
    this.cargaRegistro = this.api.detalle(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (fila) => {
        this.registro.set(fila);
        this.cargando.set(false);
        if (fila.puedeEditar) {
          this.form.patchValue(fila);
          this.seleccionarArea();
        } else
          this.error.set("El servidor no autoriza la edici\xF3n de esta solicitud.");
      },
      error: (error) => {
        this.error.set(mensajeSolicitudes(error));
        this.cargando.set(false);
      }
    });
  }
  revisar() {
    this.form.markAllAsTouched();
    this.error.set(null);
    if (this.form.invalid || this.form.pending || Object.keys(this.erroresCampos()).length || this.cargandoAreas() || this.cargandoTipos()) {
      this.error.set("Completa los campos obligatorios y revisa las fechas y cat\xE1logos.");
      return;
    }
    if (!this.areaAutorizada() || !this.tipos().some((tipo) => tipo.id === this.form.controls.tipoId.value)) {
      this.error.set("Selecciona un \xE1rea y un tipo de actividad de los cat\xE1logos disponibles.");
      return;
    }
    this.confirmar.set(this.datos());
  }
  editar() {
    this.confirmar.set(null);
  }
  puedeEnviar() {
    return this.puedeGuardar() && this.auth.tienePermiso("solicitudes.enviar");
  }
  erroresServidor(error) {
    this.error.set(mensajeSolicitudes(error));
    if (typeof error === "object" && error && "codigo" in error && ["SOLICITUD_AREA_NO_AUTORIZADA", "SOLICITUD_SIN_AREA_VIGENTE"].includes(String(error.codigo))) {
      this.confirmar.set(null);
      this.cargarAreasAutorizadas();
    }
    if (typeof error !== "object" || !error || !("errores" in error) || typeof error.errores !== "object" || !error.errores)
      return;
    const campos = { id_area: "areaId", id_tipo_actividad: "tipoId", nombre: "nombre", descripcion: "descripcion", justificacion: "objetivo", fecha_inicio_propuesta: "inicio", fecha_fin_propuesta: "fin", sede_propuesta: "lugar" };
    for (const [campo, control] of Object.entries(campos)) {
      const mensajes = error.errores[campo];
      if (Array.isArray(mensajes) && mensajes.every((mensaje) => typeof mensaje === "string")) {
        this.erroresCampos.update((errores) => __spreadProps(__spreadValues({}, errores), { [control]: mensajes.join(" ") }));
        this.form.controls[control].setErrors({ servidor: mensajes.join(" ") });
        this.form.controls[control].markAsTouched();
        this.confirmar.set(null);
      }
    }
  }
  nombreArea(id) {
    return this.areasDisponibles().find((area) => area.id === id)?.nombre ?? "\xC1rea pendiente de consulta";
  }
  nombreTipo(id) {
    return this.tipos().find((tipo) => tipo.id === id)?.nombre ?? "Tipo pendiente de consulta";
  }
  datos() {
    const datos = this.form.getRawValue();
    return __spreadProps(__spreadValues({}, datos), { nombre: datos.nombre.trim(), lugar: datos.lugar.trim(), descripcion: datos.descripcion.trim(), objetivo: datos.objetivo.trim(), observaciones: "" });
  }
  guardar(enviar = false) {
    if (this.ocupado())
      return;
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.error.set("Completa los campos obligatorios del borrador y revisa las longitudes y fechas. Laravel exige los mismos datos al crear un borrador.");
      return;
    }
    if (!this.puedeGuardar() || enviar && !this.puedeEnviar())
      return;
    const datos = this.datos();
    if (!this.areasDisponibles().some((area) => area.id === datos.areaId) || !this.tipos().some((tipo) => tipo.id === datos.tipoId)) {
      this.error.set("Selecciona un \xE1rea autorizada y un tipo activo.");
      return;
    }
    if (enviar && !this.confirmar())
      return;
    this.ocupado.set(true);
    this.error.set(null);
    this.aviso.set(null);
    const existente = this.registro();
    const usuarioOperacion = this.auth.usuario();
    let guardado = null;
    this.operacion = this.api.guardar(datos, existente ? { id: existente.id, version: existente.version } : null).pipe(switchMap((fila) => {
      if (this.auth.usuario()?.id !== usuarioOperacion?.id)
        return EMPTY;
      guardado = fila;
      this.registro.set(fila);
      if (enviar && !this.areaAutorizada())
        return throwError(() => new Error("Las \xE1reas de tu sesi\xF3n cambiaron. Revisa el \xE1rea autorizada antes de enviar."));
      return enviar && fila.acciones.includes("Enviar") ? this.api.decidir(fila.id, fila.version, "Enviar", "").pipe(map((enviada) => ({ fila: enviada, enviada: true }))) : of({ fila, enviada: false });
    }), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: ({ fila, enviada }) => {
        if (this.auth.usuario()?.id !== usuarioOperacion?.id)
          return;
        this.registro.set(fila);
        this.ocupado.set(false);
        if (enviada)
          void this.router.navigate(["/solicitudes/mis-solicitudes"], { state: { solicitudEnviada: fila.id } });
        else
          this.aviso.set(enviar ? "Cambios confirmados por el servidor. No se autoriz\xF3 su env\xEDo." : fila.estado === "Observada" ? "Correcci\xF3n guardada y confirmada por el servidor." : "Borrador guardado y confirmado por el servidor.");
      },
      error: (error) => {
        if (this.auth.usuario()?.id !== usuarioOperacion?.id)
          return;
        this.ocupado.set(false);
        this.erroresServidor(error);
        if (enviar && guardado)
          this.error.set((guardado.estado === "Observada" ? "La correcci\xF3n" : "El borrador") + " se guard\xF3, pero no se confirm\xF3 el env\xEDo. " + mensajeSolicitudes(error));
      }
    });
  }
  static \u0275fac = function NuevaSolicitudComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NuevaSolicitudComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NuevaSolicitudComponent, selectors: [["app-nueva-solicitud"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 33, vars: 10, consts: [[1, "encabezado-pagina"], ["aria-hidden", "true", 1, "material-symbols-outlined", "icono-pagina"], [1, "titulo-y-descripcion"], [1, "fila-titulo"], [3, "title"], ["type", "button", "aria-label", "Actualizar cat\xE1logos", 1, "btn", "actualizar-catalogos", 3, "click", "disabled"], ["aria-hidden", "true", 1, "material-symbols-outlined"], ["aria-label", "Pasos de registro", 1, "pasos"], ["role", "alert", 1, "error", "aviso"], ["role", "status", 1, "aviso"], ["aria-label", "Confirmaci\xF3n de datos", 1, "card"], [1, "card", "formulario-solicitud"], [3, "mostrarSede", "datos", "area", "responsable", "tipo"], [1, "ayuda"], [1, "acciones", "pie-formulario"], ["type", "button", 1, "btn", 3, "click", "disabled"], ["type", "button", 1, "btn", "btn-primary", 3, "click", "disabled"], [1, "encabezado"], ["novalidate", "", 3, "ngSubmit", "formGroup"], [1, "secciones-principales"], [3, "disabled"], [1, "form-grid"], [1, "form-field"], ["for", "solicitud-area"], ["id", "solicitud-area", "formControlName", "areaId", "required", "", "aria-describedby", "ayuda-area error-area", 1, "input"], ["value", ""], [3, "value"], ["id", "ayuda-area"], ["role", "status", 1, "error"], ["id", "error-area", 1, "error"], ["for", "solicitud-responsable"], ["id", "solicitud-responsable", "readonly", "", "placeholder", "Pendiente de sesi\xF3n autenticada", 1, "input", 3, "value"], ["for", "solicitud-tipo"], ["id", "solicitud-tipo", "formControlName", "tipoId", "required", "", "aria-describedby", "error-tipo", 1, "input"], ["id", "error-tipo", 1, "error"], [1, "form-grid", "programacion"], ["for", "solicitud-inicio"], ["id", "solicitud-inicio", "type", "date", "formControlName", "inicio", "required", "", "aria-describedby", "error-inicio", 1, "input"], ["id", "error-inicio", 1, "error"], ["for", "solicitud-fin"], ["id", "solicitud-fin", "type", "date", "formControlName", "fin", "required", "", "aria-describedby", "error-fin", 1, "input", 3, "min"], ["id", "error-fin", 1, "error"], ["routerLink", "/solicitudes/mis-solicitudes", 1, "btn"], ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"], [3, "for"], [1, "input", 3, "id", "formControlName", "maxlength", "required"], [1, "error", 3, "id"], ["rows", "4", 1, "input", 3, "id", "formControlName", "required"]], template: function NuevaSolicitudComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "header", 0)(1, "span", 1);
      \u0275\u0275text(2, "edit_calendar");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "div", 2)(4, "div", 3);
      \u0275\u0275element(5, "app-page-title", 4);
      \u0275\u0275elementStart(6, "button", 5);
      \u0275\u0275listener("click", function NuevaSolicitudComponent_Template_button_click_6_listener() {
        return ctx.cargarCatalogos();
      });
      \u0275\u0275elementStart(7, "span", 6);
      \u0275\u0275text(8, "refresh");
      \u0275\u0275elementEnd();
      \u0275\u0275text(9);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(10, "p");
      \u0275\u0275text(11, "Planifique su actividad y revise la informaci\xF3n antes de enviarla a evaluaci\xF3n.");
      \u0275\u0275elementEnd()()();
      \u0275\u0275element(12, "app-integracion-solicitudes");
      \u0275\u0275elementStart(13, "ol", 7)(14, "li")(15, "span");
      \u0275\u0275text(16, "1");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "div");
      \u0275\u0275text(18, "Completar solicitud");
      \u0275\u0275elementStart(19, "small");
      \u0275\u0275text(20, "Datos y programaci\xF3n");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(21, "li")(22, "span");
      \u0275\u0275text(23, "2");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "div");
      \u0275\u0275text(25, "Revisar y enviar");
      \u0275\u0275elementStart(26, "small");
      \u0275\u0275text(27, "Confirmaci\xF3n de la informaci\xF3n");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275template(28, NuevaSolicitudComponent_Conditional_28_Template, 2, 1, "p", 8)(29, NuevaSolicitudComponent_Conditional_29_Template, 2, 1, "p", 9)(30, NuevaSolicitudComponent_Conditional_30_Template, 2, 0, "p", 9)(31, NuevaSolicitudComponent_Conditional_31_Template, 13, 11, "section", 10)(32, NuevaSolicitudComponent_Conditional_32_Template, 75, 26, "section", 11);
    }
    if (rf & 2) {
      let tmp_9_0;
      \u0275\u0275advance(5);
      \u0275\u0275property("title", ctx.registro() ? "Editar solicitud de actividad" : "Nueva solicitud de actividad");
      \u0275\u0275advance();
      \u0275\u0275property("disabled", ctx.cargandoAreas() || ctx.cargandoTipos() || ctx.ocupado());
      \u0275\u0275attribute("aria-busy", ctx.cargandoAreas() || ctx.cargandoTipos());
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.cargandoAreas() || ctx.cargandoTipos() ? "Actualizando..." : "Actualizar cat\xE1logos");
      \u0275\u0275advance(5);
      \u0275\u0275attribute("aria-current", !ctx.confirmar() ? "step" : null);
      \u0275\u0275advance(7);
      \u0275\u0275attribute("aria-current", ctx.confirmar() ? "step" : null);
      \u0275\u0275advance(7);
      \u0275\u0275conditional(ctx.error() ? 28 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.aviso() ? 29 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.cargando() ? 30 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_9_0 = ctx.confirmar()) ? 31 : 32, tmp_9_0);
    }
  }, dependencies: [ReactiveFormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, MaxLengthValidator, FormGroupDirective, FormControlName, RouterLink, PageTitleComponent, IntegracionAvisoComponent, SolicitudDetalleComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\n.encabezado[_ngcontent-%COMP%], \n.acciones[_ngcontent-%COMP%], \n.paginacion[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  flex-wrap: wrap;\n  gap: 0.75rem;\n  margin: 1rem 0;\n}\n.acciones[_ngcontent-%COMP%] {\n  justify-content: flex-start;\n}\n.indicadores[_ngcontent-%COMP%], \n.documentos[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));\n  gap: 1rem;\n  margin: 1.5rem 0;\n}\n.indicador[_ngcontent-%COMP%] {\n  border-top: 3px solid #075a9b;\n}\n.indicador[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  display: block;\n  color: #075a9b;\n  font-size: 1.65rem;\n}\n.indicador[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.25rem 0;\n}\n.filtros[_ngcontent-%COMP%], \n.form-grid[_ngcontent-%COMP%], \n.detalle[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));\n  gap: 1rem;\n}\n.form-grid[_ngcontent-%COMP%] {\n  margin: 1rem 0;\n}\n.filtros-personales[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(0, 36rem);\n  margin-block: 1rem;\n}\n.filtros-personales[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%] {\n  margin-bottom: 0;\n}\n.titulo-y-descripcion[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n}\n.fila-titulo[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n  flex-wrap: wrap;\n}\n.acciones-cabecera[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  flex-wrap: nowrap;\n  gap: 0.5rem;\n  max-width: 100%;\n  min-width: 0;\n  margin-inline-start: auto;\n}\n.boton-busqueda[_ngcontent-%COMP%] {\n  color: #075a9b;\n  padding: 0.65rem;\n}\n.busqueda-desplegable[_ngcontent-%COMP%] {\n  position: absolute;\n  inset-inline-end: calc(100% + 0.5rem);\n  top: 50%;\n  transform: translateY(-50%);\n  z-index: 1;\n  display: flex;\n  align-items: center;\n  width: clamp(7rem, 24vw, 22rem);\n  min-width: 0;\n}\n@media (max-width: 600px) {\n  .busqueda-desplegable[_ngcontent-%COMP%] {\n    width: min(11rem, 100vw - 14rem);\n  }\n}\n.busqueda-desplegable[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  overflow: hidden;\n  clip-path: inset(50%);\n}\n.busqueda-desplegable[hidden][_ngcontent-%COMP%] {\n  display: none;\n}\n.busqueda-desplegable[_ngcontent-%COMP%]:not([hidden]) {\n  animation: _ngcontent-%COMP%_desplegar-busqueda 0.2s ease-out;\n}\n@keyframes _ngcontent-%COMP%_desplegar-busqueda {\n  from {\n    clip-path: inset(0 0 0 100%);\n  }\n  to {\n    clip-path: inset(0);\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .busqueda-desplegable[_ngcontent-%COMP%]:not([hidden]) {\n    animation: none;\n  }\n}\n.busqueda-desplegable[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%] {\n  flex: 1;\n  margin: 0;\n}\n.indicadores-compactos[_ngcontent-%COMP%] {\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 0.75rem;\n  margin: 1rem 0;\n}\n.indicadores-compactos[_ngcontent-%COMP%]   .indicador[_ngcontent-%COMP%] {\n  padding: 0.75rem 1rem;\n  margin: 0;\n}\n.indicadores-compactos[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 1.4rem;\n  line-height: 1.2;\n}\n.indicadores-compactos[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  margin: 0.25rem 0 0;\n}\n.busqueda-con-icono[_ngcontent-%COMP%] {\n  position: relative;\n}\n.busqueda-con-icono[_ngcontent-%COMP%]    > .material-symbols-outlined[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 0.85rem;\n  top: 50%;\n  transform: translateY(-50%);\n  color: #075a9b;\n  pointer-events: none;\n}\n.busqueda-con-icono[_ngcontent-%COMP%]    > .input[_ngcontent-%COMP%] {\n  padding-inline-start: 2.75rem;\n}\n.ancho[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\n.tabla-scroll[_ngcontent-%COMP%] {\n  overflow-x: auto;\n  max-width: 100%;\n}\n.table[_ngcontent-%COMP%] {\n  min-width: 55rem;\n}\n.table[_ngcontent-%COMP%]   caption[_ngcontent-%COMP%] {\n  text-align: left;\n  padding: 0.75rem 0;\n  color: #526170;\n}\n.table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  vertical-align: top;\n}\n.table[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  display: block;\n  margin-top: 0.3rem;\n}\n.table[_ngcontent-%COMP%]   .acciones[_ngcontent-%COMP%] {\n  margin: 0;\n  min-width: 12rem;\n}\n.detalle[_ngcontent-%COMP%] {\n  margin: 1rem 0;\n}\n.detalle[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.detalle[_ngcontent-%COMP%]   dt[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: #075a9b;\n}\n.detalle[_ngcontent-%COMP%]   dd[_ngcontent-%COMP%] {\n  margin: 0.3rem 0 1rem;\n  white-space: pre-wrap;\n  overflow-wrap: anywhere;\n}\n.error[_ngcontent-%COMP%] {\n  color: #a52d2d;\n  margin: 0.35rem 0;\n}\n.aviso[_ngcontent-%COMP%] {\n  padding: 0.8rem;\n  border: 1px solid #b5cad9;\n  background: #f0f7fb;\n  border-radius: 0.4rem;\n  margin-bottom: 1rem;\n}\n.vacio[_ngcontent-%COMP%] {\n  padding: 2rem 1rem;\n  text-align: center;\n  color: #526170;\n}\n.encabezado-pagina[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 1rem;\n  align-items: center;\n  margin-bottom: 1rem;\n}\n.encabezado-pagina[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], \n.ayuda[_ngcontent-%COMP%] {\n  color: #64748b;\n  margin: 0.25rem 0;\n  font-size: 0.9rem;\n}\n.icono-pagina[_ngcontent-%COMP%] {\n  box-sizing: content-box;\n  flex-shrink: 0;\n  color: #075a9b;\n  background: #eaf3fa;\n  border-radius: 0.75rem;\n  padding: 0.75rem;\n}\n.form-field[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.form-field[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: block;\n  font-weight: 600;\n  margin-bottom: 0.45rem;\n}\n.form-field[_ngcontent-%COMP%]   .input[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n}\n.form-field[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 0.8rem;\n  color: #64748b;\n  margin-top: 0.4rem;\n}\n.visor-documento[_ngcontent-%COMP%] {\n  width: 100%;\n  min-height: 60vh;\n  border: 1px solid #075a9b;\n  background: #fff;\n}\n@media (max-width: 600px) {\n  .indicadores-compactos[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .encabezado[_ngcontent-%COMP%] {\n    align-items: stretch;\n  }\n  .filtros[_ngcontent-%COMP%], \n   .form-grid[_ngcontent-%COMP%], \n   .detalle[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .acciones[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n    flex: 1 1 auto;\n  }\n  .card[_ngcontent-%COMP%] {\n    padding: 1rem;\n  }\n  .icono-pagina[_ngcontent-%COMP%] {\n    display: none;\n  }\n}\n/*# sourceMappingURL=solicitudes.css.map */", "\n\n.pasos[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  list-style: none;\n  padding: 0;\n  gap: 0.75rem;\n  margin-block: 1.25rem;\n}\n.pasos[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  padding: 1rem;\n  border: 1px solid #dde5ec;\n  background: white;\n  border-radius: 0.6rem;\n}\n.pasos[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  border-radius: 50%;\n  background: #edf2f6;\n  padding: 0.3rem 0.7rem;\n}\n.pasos[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  display: block;\n  color: #64748b;\n  font-weight: 400;\n}\n.pasos[_ngcontent-%COMP%]   [aria-current=step][_ngcontent-%COMP%] {\n  border-color: #075a9b;\n  color: #075a9b;\n  font-weight: 700;\n}\n.pasos[_ngcontent-%COMP%]   [aria-current=step][_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  background: #075a9b;\n  color: white;\n}\nfieldset[_ngcontent-%COMP%] {\n  min-width: 0;\n  padding: 0;\n  margin: 0.9rem 0;\n  border: 0;\n  border-top: 1px solid #e2e8f0;\n}\nlegend[_ngcontent-%COMP%] {\n  padding-right: 0.75rem;\n  color: #075a9b;\n  font-weight: 600;\n  font-size: 1rem;\n}\n.pie-formulario[_ngcontent-%COMP%] {\n  border-top: 1px solid #e2e8f0;\n  padding-top: 1rem;\n  justify-content: flex-end;\n}\n.pie-formulario[_ngcontent-%COMP%]    > [_ngcontent-%COMP%]:first-child {\n  margin-right: auto;\n}\n.input[aria-invalid=true][_ngcontent-%COMP%] {\n  border-color: #a52d2d;\n}\n.formulario-solicitud[_ngcontent-%COMP%] {\n  max-width: 64rem;\n}\n.formulario-solicitud[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%] {\n  margin-bottom: 0;\n}\n.formulario-solicitud[_ngcontent-%COMP%]   .encabezado[_ngcontent-%COMP%] {\n  margin: 0.25rem 0 0.75rem;\n}\n.formulario-solicitud[_ngcontent-%COMP%]   .form-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.75rem 1.5rem;\n  margin: 0.75rem 0;\n  align-items: start;\n}\n.formulario-solicitud[_ngcontent-%COMP%]   .programacion[_ngcontent-%COMP%] {\n  grid-template-columns: repeat(2, minmax(0, 15rem));\n}\n.formulario-solicitud[_ngcontent-%COMP%] {\n  container-type: inline-size;\n}\n.secciones-principales[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 1rem;\n}\n.secciones-principales[_ngcontent-%COMP%]   fieldset[_ngcontent-%COMP%] {\n  border: 1px solid #dde5ec;\n  border-radius: 0.6rem;\n  padding: 0.75rem;\n  margin: 0.5rem 0;\n  box-sizing: border-box;\n}\n.secciones-principales[_ngcontent-%COMP%]   legend[_ngcontent-%COMP%] {\n  padding-inline: 0.35rem;\n}\n.formulario-solicitud[_ngcontent-%COMP%]   .secciones-principales[_ngcontent-%COMP%]   .form-grid[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(0, 1fr);\n  gap: 1rem;\n  margin-block: 0.5rem;\n}\n.formulario-solicitud[_ngcontent-%COMP%]   .secciones-principales[_ngcontent-%COMP%]   .programacion[_ngcontent-%COMP%] {\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.5rem;\n}\n.programacion[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  min-height: 2.6em;\n}\n.programacion[_ngcontent-%COMP%]   input[type=date][_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  padding-inline: 0.35rem;\n  width: 100%;\n  min-width: 0;\n}\n.secciones-principales[_ngcontent-%COMP%]   .input[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  max-width: 100%;\n}\n.secciones-principales[_ngcontent-%COMP%]   input[type=date][_ngcontent-%COMP%] {\n  max-width: 15rem;\n}\n@container (max-width: 800px) {\n  .secciones-principales[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n@container (max-width: 520px) {\n  .secciones-principales[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n  }\n}\n.actualizar-catalogos[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  gap: 0.5rem;\n}\n.pasos[_ngcontent-%COMP%] {\n  max-width: 64rem;\n  margin-block: 1rem;\n}\n.pasos[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  padding: 0.75rem;\n}\n@media (max-width: 600px) {\n  .pasos[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .formulario-solicitud[_ngcontent-%COMP%]   .form-grid[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .actualizar-catalogos[_ngcontent-%COMP%] {\n    align-self: flex-start;\n  }\n  .pie-formulario[_ngcontent-%COMP%]    > [_ngcontent-%COMP%]:first-child {\n    margin-right: 0;\n  }\n}\n/*# sourceMappingURL=nueva-solicitud.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NuevaSolicitudComponent, { className: "NuevaSolicitudComponent", filePath: "src\\app\\pages\\solicitudes\\nueva-solicitud\\nueva-solicitud.component.ts", lineNumber: 31 });
})();

export {
  fechasSolicitud,
  NuevaSolicitudComponent
};
//# sourceMappingURL=chunk-RN2HX65Y.mjs.map
