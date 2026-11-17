import {
  DialogoComponent
} from "./chunk-Y2YHKMWP.js";
import {
  ESTADOS_SOLICITUD,
  IntegracionAvisoComponent,
  SolicitudDetalleComponent,
  SolicitudEstadoBadgeComponent,
  SolicitudesService,
  mensajeSolicitudes,
  textoRevisorSolicitud
} from "./chunk-RMBF477B.js";
import {
  PageTitleComponent
} from "./chunk-YHURBVQM.js";
import {
  ActivatedRoute,
  Router,
  RouterLink
} from "./chunk-A36LAIDM.js";
import {
  AuthService
} from "./chunk-W2463ZNS.js";
import {
  takeUntilDestroyed
} from "./chunk-IJ23LC2U.js";
import {
  DefaultValueAccessor,
  FormControlName,
  FormGroupDirective,
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
} from "./chunk-YLHEVWGL.js";
import {
  DatePipe,
  DestroyRef,
  Location,
  afterNextRender,
  computed,
  distinctUntilChanged,
  inject,
  input,
  map,
  merge,
  of,
  output,
  signal,
  switchMap,
  timer,
  viewChild,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵattribute,
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
  ɵɵpureFunction1,
  ɵɵqueryAdvance,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵresolveDocument,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3,
  ɵɵviewQuerySignal
} from "./chunk-3ZDGBTDF.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-ZX6IUAQ5.js";

// src/app/pages/solicitudes/compartidos/decision-modal.component.ts
function DecisionModalComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p")(1, "strong");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const fila_r1 = ctx;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(fila_r1.numero);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" \xB7 ", fila_r1.nombre, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("\xC1rea: ", fila_r1.area, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Solicitante: ", fila_r1.responsable, "");
  }
}
function DecisionModalComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "\xC1mbito institucional autorizado.");
    \u0275\u0275elementEnd();
  }
}
function DecisionModalComponent_Conditional_6_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 8);
    \u0275\u0275text(1, "Escribe un motivo v\xE1lido, no solo espacios.");
    \u0275\u0275elementEnd();
  }
}
function DecisionModalComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2)(1, "label", 6);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "textarea", 7);
    \u0275\u0275template(4, DecisionModalComponent_Conditional_6_Conditional_4_Template, 2, 0, "p", 8);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.requiereMotivo() ? "Motivo obligatorio" : "Observaci\xF3n opcional");
    \u0275\u0275advance();
    \u0275\u0275property("required", ctx_r1.requiereMotivo())("readOnly", ctx_r1.ocupado());
    \u0275\u0275attribute("aria-invalid", ctx_r1.form.controls.motivo.touched && ctx_r1.form.controls.motivo.invalid);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.form.controls.motivo.touched && ctx_r1.form.controls.motivo.invalid ? 4 : -1);
  }
}
function DecisionModalComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "Enviar cambia el estado de la solicitud; no registra una decisi\xF3n ni una observaci\xF3n en el historial.");
    \u0275\u0275elementEnd();
  }
}
var DecisionModalComponent = class _DecisionModalComponent {
  auth = inject(AuthService, { optional: true });
  ambitoInstitucional = computed(() => this.auth?.capacidadesSolicitudes?.()?.decidir_ambito_institucional === true);
  decisionFormal = computed(() => ["Aprobar", "Rechazar"].includes(this.accion()));
  api = inject(SolicitudesService);
  confirmado = output();
  ocupado = input(false);
  integrado = input(false);
  registro = signal(null);
  accion = signal("Aprobar");
  requiereMotivo = computed(() => ["Observar", "Rechazar"].includes(this.accion()));
  dialogo = viewChild.required(DialogoComponent);
  form = inject(NonNullableFormBuilder).group({ motivo: [""] });
  autorizado() {
    const registro = this.registro();
    return !!registro && this.api.accionesPermitidas(registro).includes(this.accion());
  }
  abrir(accion, registro) {
    if (!this.api.accionesPermitidas(registro).includes(accion) || !this.integrado())
      return;
    this.accion.set(accion);
    this.registro.set(registro);
    this.form.reset();
    this.form.controls.motivo.setValidators(this.requiereMotivo() ? [Validators.required, Validators.pattern(/\S/)] : []);
    this.form.controls.motivo.updateValueAndValidity();
    this.dialogo().abrir();
  }
  cerrar() {
    this.dialogo().cerrar();
  }
  confirmar() {
    this.form.markAllAsTouched();
    const registro = this.registro();
    if (!registro || !this.autorizado() || this.form.invalid || this.ocupado() || !this.integrado())
      return;
    this.confirmado.emit({ registro, accion: this.accion(), motivo: this.form.controls.motivo.value.trim() });
  }
  static \u0275fac = function DecisionModalComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DecisionModalComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DecisionModalComponent, selectors: [["app-decision-modal"]], viewQuery: function DecisionModalComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuerySignal(ctx.dialogo, DialogoComponent, 5);
    }
    if (rf & 2) {
      \u0275\u0275queryAdvance();
    }
  }, inputs: { ocupado: [1, "ocupado"], integrado: [1, "integrado"] }, outputs: { confirmado: "confirmado" }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 15, vars: 9, consts: [[3, "cerrado", "titulo"], [3, "ngSubmit", "formGroup"], [1, "form-field"], [1, "acciones"], ["type", "button", "autofocus", "", 1, "btn", 3, "click", "disabled"], ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"], ["for", "motivo-decision"], ["id", "motivo-decision", "formControlName", "motivo", "rows", "4", "aria-describedby", "error-motivo", 1, "input", 3, "required", "readOnly"], ["id", "error-motivo", "role", "alert", 1, "error"]], template: function DecisionModalComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "app-dialogo", 0);
      \u0275\u0275listener("cerrado", function DecisionModalComponent_Template_app_dialogo_cerrado_0_listener() {
        return ctx.registro.set(null);
      });
      \u0275\u0275template(1, DecisionModalComponent_Conditional_1_Template, 8, 4)(2, DecisionModalComponent_Conditional_2_Template, 2, 0, "p");
      \u0275\u0275elementStart(3, "p");
      \u0275\u0275text(4, "La operaci\xF3n solo se confirmar\xE1 cuando el servidor autorice y registre el resultado.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "form", 1);
      \u0275\u0275listener("ngSubmit", function DecisionModalComponent_Template_form_ngSubmit_5_listener() {
        return ctx.confirmar();
      });
      \u0275\u0275template(6, DecisionModalComponent_Conditional_6_Template, 5, 5, "div", 2)(7, DecisionModalComponent_Conditional_7_Template, 2, 0, "p");
      \u0275\u0275elementStart(8, "p");
      \u0275\u0275text(9);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "div", 3)(11, "button", 4);
      \u0275\u0275listener("click", function DecisionModalComponent_Template_button_click_11_listener() {
        return ctx.dialogo().cerrar();
      });
      \u0275\u0275text(12, "Cancelar");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "button", 5);
      \u0275\u0275text(14);
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      let tmp_1_0;
      \u0275\u0275property("titulo", ctx.accion());
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_1_0 = ctx.registro()) ? 1 : -1, tmp_1_0);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.decisionFormal() && ctx.ambitoInstitucional() ? 2 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275property("formGroup", ctx.form);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.accion() !== "Enviar" ? 6 : 7);
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate1("\xBFDeseas confirmar \xAB", ctx.accion(), "\xBB para esta solicitud?");
      \u0275\u0275advance(2);
      \u0275\u0275property("disabled", ctx.ocupado());
      \u0275\u0275advance(2);
      \u0275\u0275property("disabled", ctx.ocupado() || !ctx.autorizado() || !ctx.integrado());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1("Confirmar ", ctx.accion(), "");
    }
  }, dependencies: [DialogoComponent, ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, FormGroupDirective, FormControlName], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\n.encabezado[_ngcontent-%COMP%], \n.acciones[_ngcontent-%COMP%], \n.paginacion[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  flex-wrap: wrap;\n  gap: 0.75rem;\n  margin: 1rem 0;\n}\n.acciones[_ngcontent-%COMP%] {\n  justify-content: flex-start;\n}\n.indicadores[_ngcontent-%COMP%], \n.documentos[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));\n  gap: 1rem;\n  margin: 1.5rem 0;\n}\n.indicador[_ngcontent-%COMP%] {\n  border-top: 3px solid #075a9b;\n}\n.indicador[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  display: block;\n  color: #075a9b;\n  font-size: 1.65rem;\n}\n.indicador[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.25rem 0;\n}\n.filtros[_ngcontent-%COMP%], \n.form-grid[_ngcontent-%COMP%], \n.detalle[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));\n  gap: 1rem;\n}\n.form-grid[_ngcontent-%COMP%] {\n  margin: 1rem 0;\n}\n.filtros-personales[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(0, 36rem);\n  margin-block: 1rem;\n}\n.filtros-personales[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%] {\n  margin-bottom: 0;\n}\n.titulo-y-descripcion[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n}\n.fila-titulo[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n  flex-wrap: wrap;\n}\n.acciones-cabecera[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  flex-wrap: nowrap;\n  gap: 0.5rem;\n  max-width: 100%;\n  min-width: 0;\n  margin-inline-start: auto;\n}\n.boton-busqueda[_ngcontent-%COMP%] {\n  color: #075a9b;\n  padding: 0.65rem;\n}\n.busqueda-desplegable[_ngcontent-%COMP%] {\n  position: absolute;\n  inset-inline-end: calc(100% + 0.5rem);\n  top: 50%;\n  transform: translateY(-50%);\n  z-index: 1;\n  display: flex;\n  align-items: center;\n  width: clamp(7rem, 24vw, 22rem);\n  min-width: 0;\n}\n@media (max-width: 600px) {\n  .busqueda-desplegable[_ngcontent-%COMP%] {\n    width: min(11rem, 100vw - 14rem);\n  }\n}\n.busqueda-desplegable[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  overflow: hidden;\n  clip-path: inset(50%);\n}\n.busqueda-desplegable[hidden][_ngcontent-%COMP%] {\n  display: none;\n}\n.busqueda-desplegable[_ngcontent-%COMP%]:not([hidden]) {\n  animation: _ngcontent-%COMP%_desplegar-busqueda 0.2s ease-out;\n}\n@keyframes _ngcontent-%COMP%_desplegar-busqueda {\n  from {\n    clip-path: inset(0 0 0 100%);\n  }\n  to {\n    clip-path: inset(0);\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .busqueda-desplegable[_ngcontent-%COMP%]:not([hidden]) {\n    animation: none;\n  }\n}\n.busqueda-desplegable[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%] {\n  flex: 1;\n  margin: 0;\n}\n.indicadores-compactos[_ngcontent-%COMP%] {\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 0.75rem;\n  margin: 1rem 0;\n}\n.indicadores-compactos[_ngcontent-%COMP%]   .indicador[_ngcontent-%COMP%] {\n  padding: 0.75rem 1rem;\n  margin: 0;\n}\n.indicadores-compactos[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 1.4rem;\n  line-height: 1.2;\n}\n.indicadores-compactos[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  margin: 0.25rem 0 0;\n}\n.busqueda-con-icono[_ngcontent-%COMP%] {\n  position: relative;\n}\n.busqueda-con-icono[_ngcontent-%COMP%]    > .material-symbols-outlined[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 0.85rem;\n  top: 50%;\n  transform: translateY(-50%);\n  color: #075a9b;\n  pointer-events: none;\n}\n.busqueda-con-icono[_ngcontent-%COMP%]    > .input[_ngcontent-%COMP%] {\n  padding-inline-start: 2.75rem;\n}\n.ancho[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\n.tabla-scroll[_ngcontent-%COMP%] {\n  overflow-x: auto;\n  max-width: 100%;\n}\n.table[_ngcontent-%COMP%] {\n  min-width: 55rem;\n}\n.table[_ngcontent-%COMP%]   caption[_ngcontent-%COMP%] {\n  text-align: left;\n  padding: 0.75rem 0;\n  color: #526170;\n}\n.table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  vertical-align: top;\n}\n.table[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  display: block;\n  margin-top: 0.3rem;\n}\n.table[_ngcontent-%COMP%]   .acciones[_ngcontent-%COMP%] {\n  margin: 0;\n  min-width: 12rem;\n}\n.detalle[_ngcontent-%COMP%] {\n  margin: 1rem 0;\n}\n.detalle[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.detalle[_ngcontent-%COMP%]   dt[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: #075a9b;\n}\n.detalle[_ngcontent-%COMP%]   dd[_ngcontent-%COMP%] {\n  margin: 0.3rem 0 1rem;\n  white-space: pre-wrap;\n  overflow-wrap: anywhere;\n}\n.error[_ngcontent-%COMP%] {\n  color: #a52d2d;\n  margin: 0.35rem 0;\n}\n.aviso[_ngcontent-%COMP%] {\n  padding: 0.8rem;\n  border: 1px solid #b5cad9;\n  background: #f0f7fb;\n  border-radius: 0.4rem;\n  margin-bottom: 1rem;\n}\n.vacio[_ngcontent-%COMP%] {\n  padding: 2rem 1rem;\n  text-align: center;\n  color: #526170;\n}\n.encabezado-pagina[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 1rem;\n  align-items: center;\n  margin-bottom: 1rem;\n}\n.encabezado-pagina[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], \n.ayuda[_ngcontent-%COMP%] {\n  color: #64748b;\n  margin: 0.25rem 0;\n  font-size: 0.9rem;\n}\n.icono-pagina[_ngcontent-%COMP%] {\n  box-sizing: content-box;\n  flex-shrink: 0;\n  color: #075a9b;\n  background: #eaf3fa;\n  border-radius: 0.75rem;\n  padding: 0.75rem;\n}\n.form-field[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.form-field[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: block;\n  font-weight: 600;\n  margin-bottom: 0.45rem;\n}\n.form-field[_ngcontent-%COMP%]   .input[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n}\n.form-field[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 0.8rem;\n  color: #64748b;\n  margin-top: 0.4rem;\n}\n.visor-documento[_ngcontent-%COMP%] {\n  width: 100%;\n  min-height: 60vh;\n  border: 1px solid #075a9b;\n  background: #fff;\n}\n@media (max-width: 600px) {\n  .indicadores-compactos[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .encabezado[_ngcontent-%COMP%] {\n    align-items: stretch;\n  }\n  .filtros[_ngcontent-%COMP%], \n   .form-grid[_ngcontent-%COMP%], \n   .detalle[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .acciones[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n    flex: 1 1 auto;\n  }\n  .card[_ngcontent-%COMP%] {\n    padding: 1rem;\n  }\n  .icono-pagina[_ngcontent-%COMP%] {\n    display: none;\n  }\n}\n/*# sourceMappingURL=solicitudes.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DecisionModalComponent, { className: "DecisionModalComponent", filePath: "src\\app\\pages\\solicitudes\\compartidos\\decision-modal.component.ts", lineNumber: 31 });
})();

// src/app/pages/solicitudes/compartidos/bandeja-solicitudes.component.ts
var _c0 = ["campoBusqueda"];
var _c1 = ["botonBusqueda"];
var _forTrack0 = ($index, $item) => $item.id;
var _c2 = (a0) => ({ editar: a0 });
function BandejaSolicitudesComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 8)(1, "div", 24)(2, "label", 25);
    \u0275\u0275text(3, "Buscar solicitud");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 26)(5, "span", 27);
    \u0275\u0275text(6, "search");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "input", 28, 0);
    \u0275\u0275listener("keydown.escape", function BandejaSolicitudesComponent_Conditional_7_Template_input_keydown_escape_7_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cerrarBusqueda());
    });
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("hidden", !ctx_r1.busquedaAbierta())("formGroup", ctx_r1.filtros);
  }
}
function BandejaSolicitudesComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 29, 1);
    \u0275\u0275listener("click", function BandejaSolicitudesComponent_Conditional_8_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.busquedaAbierta() ? ctx_r1.cerrarBusqueda() : ctx_r1.abrirBusqueda());
    });
    \u0275\u0275elementStart(2, "span", 27);
    \u0275\u0275text(3, "search");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275attribute("aria-label", ctx_r1.busquedaAbierta() ? "Ocultar b\xFAsqueda" : "Abrir b\xFAsqueda")("aria-expanded", ctx_r1.busquedaAbierta());
  }
}
function BandejaSolicitudesComponent_Conditional_9_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 30);
    \u0275\u0275text(1, "Nueva solicitud");
    \u0275\u0275elementEnd();
  }
}
function BandejaSolicitudesComponent_Conditional_9_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "button", 31);
    \u0275\u0275text(1, "Nueva solicitud");
    \u0275\u0275elementEnd();
  }
}
function BandejaSolicitudesComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, BandejaSolicitudesComponent_Conditional_9_Conditional_0_Template, 2, 0, "a", 30)(1, BandejaSolicitudesComponent_Conditional_9_Conditional_1_Template, 2, 0, "button", 31);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r1.puedeCrear() ? 0 : 1);
  }
}
function BandejaSolicitudesComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 32);
    \u0275\u0275listener("keydown", function BandejaSolicitudesComponent_Conditional_11_Template_div_keydown_0_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.teclearPestanasGerencia($event));
    });
    \u0275\u0275elementStart(1, "button", 33);
    \u0275\u0275listener("click", function BandejaSolicitudesComponent_Conditional_11_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cambiarPestanaGerencia("pendientes"));
    });
    \u0275\u0275elementStart(2, "span", 27);
    \u0275\u0275text(3, "pending_actions");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, "Actividades por Aprobar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 34);
    \u0275\u0275listener("click", function BandejaSolicitudesComponent_Conditional_11_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cambiarPestanaGerencia("aprobadas"));
    });
    \u0275\u0275elementStart(6, "span", 27);
    \u0275\u0275text(7, "check_circle");
    \u0275\u0275elementEnd();
    \u0275\u0275text(8, "Solicitudes aprobadas");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.ocupado());
    \u0275\u0275attribute("aria-selected", ctx_r1.pestanaGerencia() === "pendientes")("tabindex", ctx_r1.pestanaGerencia() === "pendientes" ? 0 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", ctx_r1.ocupado());
    \u0275\u0275attribute("aria-selected", ctx_r1.pestanaGerencia() === "aprobadas")("tabindex", ctx_r1.pestanaGerencia() === "aprobadas" ? 0 : -1);
  }
}
function BandejaSolicitudesComponent_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 35)(1, "p");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(3, "div", 36)(4, "section", 37)(5, "strong");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p");
    \u0275\u0275text(8, "Resultados");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "section", 37)(10, "strong");
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "p");
    \u0275\u0275text(13, "Pendientes");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "section", 37)(15, "strong");
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "p");
    \u0275\u0275text(18, "Observadas");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_4_0;
    let tmp_5_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.bandeja() === "propias" ? "Seguimiento de las solicitudes autorizadas de tu \xE1rea." : "Eval\xFAa la informaci\xF3n y deriva las solicitudes conformes a Gerencia.");
    \u0275\u0275advance();
    \u0275\u0275classProp("indicadores-compactos", ctx_r1.bandeja() === "propias");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((tmp_3_0 = (tmp_3_0 = ctx_r1.pagina()) == null ? null : tmp_3_0.total) !== null && tmp_3_0 !== void 0 ? tmp_3_0 : "\u2014");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate((tmp_4_0 = ctx_r1.pendientes()) !== null && tmp_4_0 !== void 0 ? tmp_4_0 : "\u2014");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate((tmp_5_0 = ctx_r1.observadas()) !== null && tmp_5_0 !== void 0 ? tmp_5_0 : "\u2014");
  }
}
function BandejaSolicitudesComponent_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "h2");
    \u0275\u0275text(1, "Consulta de solicitudes");
    \u0275\u0275elementEnd();
  }
}
function BandejaSolicitudesComponent_Conditional_15_Conditional_5_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 46);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const estado_r6 = ctx.$implicit;
    \u0275\u0275property("value", estado_r6);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(estado_r6);
  }
}
function BandejaSolicitudesComponent_Conditional_15_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 24)(1, "label", 43);
    \u0275\u0275text(2, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "select", 44)(4, "option", 45);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(6, BandejaSolicitudesComponent_Conditional_15_Conditional_5_For_7_Template, 2, 2, "option", 46, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 24)(9, "label", 47);
    \u0275\u0275text(10, "Desde");
    \u0275\u0275elementEnd();
    \u0275\u0275element(11, "input", 48);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 24)(13, "label", 49);
    \u0275\u0275text(14, "Hasta");
    \u0275\u0275elementEnd();
    \u0275\u0275element(15, "input", 50);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.bandeja() === "revision" ? "Enviadas" : "Todos los estados");
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.estados);
    \u0275\u0275advance(9);
    \u0275\u0275property("min", ctx_r1.filtros.controls.desde.value);
  }
}
function BandejaSolicitudesComponent_Conditional_15_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 51);
    \u0275\u0275listener("click", function BandejaSolicitudesComponent_Conditional_15_Conditional_9_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.limpiar());
    });
    \u0275\u0275text(1, "Limpiar filtros");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", !ctx_r1.operativo() || ctx_r1.ocupado());
  }
}
function BandejaSolicitudesComponent_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 38);
    \u0275\u0275listener("ngSubmit", function BandejaSolicitudesComponent_Conditional_15_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cargar());
    });
    \u0275\u0275elementStart(1, "div", 24)(2, "label", 25);
    \u0275\u0275text(3, "Actividad o n\xFAmero de solicitud");
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "input", 39);
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, BandejaSolicitudesComponent_Conditional_15_Conditional_5_Template, 16, 2);
    \u0275\u0275elementStart(6, "div", 40)(7, "button", 41);
    \u0275\u0275text(8, "Buscar");
    \u0275\u0275elementEnd();
    \u0275\u0275template(9, BandejaSolicitudesComponent_Conditional_15_Conditional_9_Template, 2, 1, "button", 42);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("filtros-gerencia", ctx_r1.bandeja() === "gerencia");
    \u0275\u0275property("formGroup", ctx_r1.filtros);
    \u0275\u0275advance(5);
    \u0275\u0275conditional(ctx_r1.bandeja() !== "gerencia" ? 5 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !ctx_r1.operativo() || ctx_r1.cargando() || ctx_r1.ocupado());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.bandeja() !== "gerencia" ? 9 : -1);
  }
}
function BandejaSolicitudesComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.aviso());
  }
}
function BandejaSolicitudesComponent_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 14);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.pagina() ? "Actualizando solicitudes\u2026" : "Cargando solicitudes\u2026");
  }
}
function BandejaSolicitudesComponent_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 15);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.error());
  }
}
function BandejaSolicitudesComponent_Conditional_19_Conditional_0_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 55);
    \u0275\u0275text(1, "N\xB0");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "th", 55);
    \u0275\u0275text(3, "Actividad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "th", 55);
    \u0275\u0275text(5, "\xC1rea solicitante");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th", 55);
    \u0275\u0275text(7, "Responsable");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 56);
    \u0275\u0275text(9, "Fecha");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 56);
    \u0275\u0275text(11, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 56);
    \u0275\u0275text(13, "Acciones");
    \u0275\u0275elementEnd();
  }
}
function BandejaSolicitudesComponent_Conditional_19_Conditional_0_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 56);
    \u0275\u0275text(1, "N.\xBA de solicitud");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "th", 55);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "th", 55);
    \u0275\u0275text(5, "Solicitante o \xE1rea");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th", 55);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 56);
    \u0275\u0275text(9, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 55);
    \u0275\u0275text(11, "Acci\xF3n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.pestanaGerencia() === "aprobadas" ? "Actividad" : "Actividad solicitada");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.pestanaGerencia() === "aprobadas" ? "Fecha de aprobaci\xF3n" : "Fecha");
  }
}
function BandejaSolicitudesComponent_Conditional_19_Conditional_0_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 55);
    \u0275\u0275text(1, "Solicitud y actividad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "th", 55);
    \u0275\u0275text(3, "\xC1rea / responsable");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "th", 56);
    \u0275\u0275text(5, "Fechas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th", 56);
    \u0275\u0275text(7, "Estado y revisi\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 56);
    \u0275\u0275text(9, "Acciones");
    \u0275\u0275elementEnd();
  }
}
function BandejaSolicitudesComponent_Conditional_19_Conditional_0_For_13_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td")(1, "strong");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(3, "td", 58);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td");
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "td");
    \u0275\u0275element(13, "app-solicitud-estado-badge", 59);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_15_0;
    const fila_r9 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((tmp_15_0 = fila_r9.idSolicitudActividad) !== null && tmp_15_0 !== void 0 ? tmp_15_0 : fila_r9.id);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(fila_r9.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(fila_r9.area);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(fila_r9.responsable);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(11, 6, fila_r9.fecha, "dd/MM/yyyy"));
    \u0275\u0275advance(3);
    \u0275\u0275property("estado", fila_r9.estado);
  }
}
function BandejaSolicitudesComponent_Conditional_19_Conditional_0_For_13_Conditional_4_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
    \u0275\u0275pipe(1, "date");
  }
  if (rf & 2) {
    const fila_r9 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275textInterpolate1(" ", fila_r9.fechaAprobacion ? \u0275\u0275pipeBind2(1, 1, fila_r9.fechaAprobacion, "dd/MM/yyyy") : "No disponible", " ");
  }
}
function BandejaSolicitudesComponent_Conditional_19_Conditional_0_For_13_Conditional_4_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
    \u0275\u0275pipe(1, "date");
  }
  if (rf & 2) {
    const fila_r9 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind2(1, 1, fila_r9.fecha, "dd/MM/yyyy"), " ");
  }
}
function BandejaSolicitudesComponent_Conditional_19_Conditional_0_For_13_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "td");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "td");
    \u0275\u0275text(5);
    \u0275\u0275elementStart(6, "small");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "td");
    \u0275\u0275template(9, BandejaSolicitudesComponent_Conditional_19_Conditional_0_For_13_Conditional_4_Conditional_9_Template, 2, 4)(10, BandejaSolicitudesComponent_Conditional_19_Conditional_0_For_13_Conditional_4_Conditional_10_Template, 2, 4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td");
    \u0275\u0275element(12, "app-solicitud-estado-badge", 59);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const fila_r9 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(fila_r9.numero);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(fila_r9.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(fila_r9.area);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(fila_r9.responsable);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.pestanaGerencia() === "aprobadas" ? 9 : 10);
    \u0275\u0275advance(3);
    \u0275\u0275property("estado", fila_r9.estado);
  }
}
function BandejaSolicitudesComponent_Conditional_19_Conditional_0_For_13_Conditional_5_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const fila_r9 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.textoRevisor(fila_r9));
  }
}
function BandejaSolicitudesComponent_Conditional_19_Conditional_0_For_13_Conditional_5_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const fila_r9 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(fila_r9.revisor);
  }
}
function BandejaSolicitudesComponent_Conditional_19_Conditional_0_For_13_Conditional_5_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const fila_r9 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(fila_r9.resultadoRevision);
  }
}
function BandejaSolicitudesComponent_Conditional_19_Conditional_0_For_13_Conditional_5_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const fila_r9 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(fila_r9.ultimaObservacion);
  }
}
function BandejaSolicitudesComponent_Conditional_19_Conditional_0_For_13_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td")(1, "strong");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275elementStart(7, "small");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "td");
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "date");
    \u0275\u0275elementStart(12, "small");
    \u0275\u0275text(13);
    \u0275\u0275pipe(14, "date");
    \u0275\u0275pipe(15, "date");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "td");
    \u0275\u0275element(17, "app-solicitud-estado-badge", 60);
    \u0275\u0275template(18, BandejaSolicitudesComponent_Conditional_19_Conditional_0_For_13_Conditional_5_Conditional_18_Template, 2, 1, "small")(19, BandejaSolicitudesComponent_Conditional_19_Conditional_0_For_13_Conditional_5_Conditional_19_Template, 2, 1, "small")(20, BandejaSolicitudesComponent_Conditional_19_Conditional_0_For_13_Conditional_5_Conditional_20_Template, 2, 1, "small")(21, BandejaSolicitudesComponent_Conditional_19_Conditional_0_For_13_Conditional_5_Conditional_21_Template, 2, 1, "small");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const fila_r9 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(fila_r9.numero);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(fila_r9.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(fila_r9.area);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(fila_r9.responsable);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(11, 12, fila_r9.fecha, "dd/MM/yyyy"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("Propuesta: ", \u0275\u0275pipeBind2(14, 15, fila_r9.inicio, "dd/MM/yyyy"), " \u2013 ", \u0275\u0275pipeBind2(15, 18, fila_r9.fin, "dd/MM/yyyy"), "");
    \u0275\u0275advance(4);
    \u0275\u0275property("estado", fila_r9.estado)("revision", ctx_r1.bandeja() === "revision");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.bandeja() !== "gerencia" ? 18 : fila_r9.revisor ? 19 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(fila_r9.resultadoRevision ? 20 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(fila_r9.ultimaObservacion ? 21 : -1);
  }
}
function BandejaSolicitudesComponent_Conditional_19_Conditional_0_For_13_Conditional_8_For_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 63);
    \u0275\u0275listener("click", function BandejaSolicitudesComponent_Conditional_19_Conditional_0_For_13_Conditional_8_For_3_Template_button_click_0_listener() {
      const accion_r12 = \u0275\u0275restoreView(_r11).$implicit;
      const fila_r9 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.modal().abrir(accion_r12, fila_r9));
    });
    \u0275\u0275elementStart(1, "span", 27);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const accion_r12 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275classProp("accion-aprobar", accion_r12 === "Aprobar")("accion-rechazar", accion_r12 === "Rechazar");
    \u0275\u0275property("disabled", ctx_r1.ocupado() || !ctx_r1.operativo());
    \u0275\u0275attribute("title", accion_r12 === "Aprobar" ? "Aprobar solicitud" : "Rechazar solicitud")("aria-label", accion_r12 === "Aprobar" ? "Aprobar solicitud" : "Rechazar solicitud");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(accion_r12 === "Aprobar" ? "check_circle" : "cancel");
  }
}
function BandejaSolicitudesComponent_Conditional_19_Conditional_0_For_13_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 61);
    \u0275\u0275listener("click", function BandejaSolicitudesComponent_Conditional_19_Conditional_0_For_13_Conditional_8_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r10);
      const fila_r9 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.ver(fila_r9));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(2, BandejaSolicitudesComponent_Conditional_19_Conditional_0_For_13_Conditional_8_For_3_Template, 3, 8, "button", 62, \u0275\u0275repeaterTrackByIdentity);
  }
  if (rf & 2) {
    const fila_r9 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("disabled", ctx_r1.ocupado() || fila_r9.puedeVerDetalle === false);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.pestanaGerencia() === "aprobadas" ? "Ver solicitud" : "Revisar solicitud");
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.acciones(fila_r9));
  }
}
function BandejaSolicitudesComponent_Conditional_19_Conditional_0_For_13_Conditional_9_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 68);
    \u0275\u0275listener("click", function BandejaSolicitudesComponent_Conditional_19_Conditional_0_For_13_Conditional_9_Conditional_0_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r13);
      const fila_r9 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.ver(fila_r9));
    });
    \u0275\u0275elementStart(1, "span", 27);
    \u0275\u0275text(2, "visibility");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const fila_r9 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("disabled", ctx_r1.ocupado() || fila_r9.puedeVerDetalle === false);
  }
}
function BandejaSolicitudesComponent_Conditional_19_Conditional_0_For_13_Conditional_9_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 69);
    \u0275\u0275listener("click", function BandejaSolicitudesComponent_Conditional_19_Conditional_0_For_13_Conditional_9_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r14);
      const fila_r9 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.ver(fila_r9));
    });
    \u0275\u0275elementStart(1, "span", 27);
    \u0275\u0275text(2, "visibility");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const fila_r9 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("disabled", ctx_r1.ocupado() || fila_r9.puedeVerDetalle === false);
    \u0275\u0275attribute("title", fila_r9.puedeVerDetalle === false ? "La consulta del detalle requiere autorizaci\xF3n del servidor para esta solicitud." : null);
  }
}
function BandejaSolicitudesComponent_Conditional_19_Conditional_0_For_13_Conditional_9_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 66);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const fila_r9 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275property("queryParams", \u0275\u0275pureFunction1(2, _c2, fila_r9.id));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(fila_r9.estado === "Observada" ? "Corregir solicitud" : "Editar borrador");
  }
}
function BandejaSolicitudesComponent_Conditional_19_Conditional_0_For_13_Conditional_9_For_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 51);
    \u0275\u0275listener("click", function BandejaSolicitudesComponent_Conditional_19_Conditional_0_For_13_Conditional_9_For_4_Template_button_click_0_listener() {
      const accion_r16 = \u0275\u0275restoreView(_r15).$implicit;
      const fila_r9 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.modal().abrir(accion_r16, fila_r9));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const accion_r16 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275classProp("btn-primary", accion_r16 === "Aprobar" || accion_r16 === "Derivar");
    \u0275\u0275property("disabled", ctx_r1.ocupado() || !ctx_r1.operativo());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(accion_r16 === "Derivar" ? "Derivar a Gerencia" : accion_r16);
  }
}
function BandejaSolicitudesComponent_Conditional_19_Conditional_0_For_13_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, BandejaSolicitudesComponent_Conditional_19_Conditional_0_For_13_Conditional_9_Conditional_0_Template, 3, 1, "button", 64)(1, BandejaSolicitudesComponent_Conditional_19_Conditional_0_For_13_Conditional_9_Conditional_1_Template, 3, 2, "button", 65)(2, BandejaSolicitudesComponent_Conditional_19_Conditional_0_For_13_Conditional_9_Conditional_2_Template, 2, 4, "a", 66);
    \u0275\u0275repeaterCreate(3, BandejaSolicitudesComponent_Conditional_19_Conditional_0_For_13_Conditional_9_For_4_Template, 2, 4, "button", 67, \u0275\u0275repeaterTrackByIdentity);
  }
  if (rf & 2) {
    const fila_r9 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275conditional(ctx_r1.bandeja() === "propias" ? 0 : 1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.bandeja() === "propias" && fila_r9.puedeEditar ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.acciones(fila_r9));
  }
}
function BandejaSolicitudesComponent_Conditional_19_Conditional_0_For_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 57);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, BandejaSolicitudesComponent_Conditional_19_Conditional_0_For_13_Conditional_3_Template, 14, 9)(4, BandejaSolicitudesComponent_Conditional_19_Conditional_0_For_13_Conditional_4_Template, 13, 6)(5, BandejaSolicitudesComponent_Conditional_19_Conditional_0_For_13_Conditional_5_Template, 22, 21);
    \u0275\u0275elementStart(6, "td")(7, "div", 21);
    \u0275\u0275template(8, BandejaSolicitudesComponent_Conditional_19_Conditional_0_For_13_Conditional_8_Template, 4, 2)(9, BandejaSolicitudesComponent_Conditional_19_Conditional_0_For_13_Conditional_9_Template, 5, 2);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const \u0275$index_234_r17 = ctx.$index;
    const datos_r18 = \u0275\u0275nextContext(2);
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((datos_r18.pagina - 1) * 20 + \u0275$index_234_r17 + 1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.bandeja() === "propias" ? 3 : ctx_r1.bandeja() === "gerencia" ? 4 : 5);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("acciones-gerencia", ctx_r1.bandeja() === "gerencia");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.bandeja() === "gerencia" ? 8 : 9);
  }
}
function BandejaSolicitudesComponent_Conditional_19_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 52)(1, "table", 53)(2, "caption");
    \u0275\u0275text(3, "Lista deSolicitudes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "thead")(5, "tr")(6, "th", 54);
    \u0275\u0275text(7, "N.?");
    \u0275\u0275elementEnd();
    \u0275\u0275template(8, BandejaSolicitudesComponent_Conditional_19_Conditional_0_Conditional_8_Template, 14, 0)(9, BandejaSolicitudesComponent_Conditional_19_Conditional_0_Conditional_9_Template, 12, 2)(10, BandejaSolicitudesComponent_Conditional_19_Conditional_0_Conditional_10_Template, 10, 0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "tbody");
    \u0275\u0275repeaterCreate(12, BandejaSolicitudesComponent_Conditional_19_Conditional_0_For_13_Template, 10, 5, "tr", null, _forTrack0);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const datos_r18 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275classProp("tabla-propias", ctx_r1.bandeja() === "propias");
    \u0275\u0275attribute("aria-busy", ctx_r1.cargando());
    \u0275\u0275advance(7);
    \u0275\u0275conditional(ctx_r1.bandeja() === "propias" ? 8 : ctx_r1.bandeja() === "gerencia" ? 9 : 10);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(datos_r18.registros);
  }
}
function BandejaSolicitudesComponent_Conditional_19_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.bandeja() === "gerencia" ? ctx_r1.pestanaGerencia() === "aprobadas" ? "No se encontraron solicitudes aprobadas." : "No hay solicitudes pendientes de aprobaci\xF3n." : "No se encontraron solicitudes para estos filtros.");
  }
}
function BandejaSolicitudesComponent_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275template(0, BandejaSolicitudesComponent_Conditional_19_Conditional_0_Template, 14, 4, "div", 52)(1, BandejaSolicitudesComponent_Conditional_19_Conditional_1_Template, 2, 1, "div", 17);
    \u0275\u0275elementStart(2, "nav", 16)(3, "button", 51);
    \u0275\u0275listener("click", function BandejaSolicitudesComponent_Conditional_19_Template_button_click_3_listener() {
      const datos_r18 = \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cargar(datos_r18.pagina - 1));
    });
    \u0275\u0275text(4, "Anterior");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 51);
    \u0275\u0275listener("click", function BandejaSolicitudesComponent_Conditional_19_Template_button_click_7_listener() {
      const datos_r18 = \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cargar(datos_r18.pagina + 1));
    });
    \u0275\u0275text(8, "Siguiente");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const datos_r18 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(datos_r18.registros.length ? 0 : 1);
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", datos_r18.pagina <= 1 || ctx_r1.ocupado());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate3("P\xE1gina ", datos_r18.pagina, " de ", datos_r18.ultimaPagina, " \xB7 ", datos_r18.total, " registros");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", datos_r18.pagina >= datos_r18.ultimaPagina || ctx_r1.ocupado());
  }
}
function BandejaSolicitudesComponent_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17)(1, "span", 27);
    \u0275\u0275text(2, "inbox");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h3");
    \u0275\u0275text(4, "Bandeja preparada para sus solicitudes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p");
    \u0275\u0275text(6, "Los registros aparecer\xE1n cuando se habilite la consulta autenticada.");
    \u0275\u0275elementEnd()();
  }
}
function BandejaSolicitudesComponent_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 19);
    \u0275\u0275text(1, "Consultando detalle autorizado\u2026");
    \u0275\u0275elementEnd();
  }
}
function BandejaSolicitudesComponent_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 15);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.errorDetalle());
  }
}
function BandejaSolicitudesComponent_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-solicitud-detalle", 20);
  }
  if (rf & 2) {
    const fila_r19 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("revision", ctx_r1.bandeja() === "revision")("datos", fila_r19)("registro", fila_r19)("area", fila_r19.area)("responsable", fila_r19.responsable)("tipo", fila_r19.tipo);
  }
}
function BandejaSolicitudesComponent_Conditional_25_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 51);
    \u0275\u0275listener("click", function BandejaSolicitudesComponent_Conditional_25_For_2_Template_button_click_0_listener() {
      const accion_r21 = \u0275\u0275restoreView(_r20).$implicit;
      const fila_r22 = \u0275\u0275nextContext();
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.modal().abrir(accion_r21, fila_r22));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const accion_r21 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("btn-primary", accion_r21 === "Aprobar");
    \u0275\u0275property("disabled", ctx_r1.ocupado() || !ctx_r1.operativo());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(accion_r21);
  }
}
function BandejaSolicitudesComponent_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21);
    \u0275\u0275repeaterCreate(1, BandejaSolicitudesComponent_Conditional_25_For_2_Template, 2, 4, "button", 67, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.acciones(ctx));
  }
}
var BandejaSolicitudesComponent = class _BandejaSolicitudesComponent {
  busquedaAbierta = signal(false);
  campoBusqueda = viewChild("campoBusqueda");
  botonBusqueda = viewChild("botonBusqueda");
  abrirBusqueda() {
    this.busquedaAbierta.set(true);
    const campo = this.campoBusqueda()?.nativeElement;
    if (campo) {
      campo.closest('[role="search"]').hidden = false;
      campo.focus();
    }
  }
  cerrarBusqueda(devolverFoco = true) {
    this.busquedaAbierta.set(false);
    if (this.filtros.controls.busqueda.value !== "")
      this.filtros.controls.busqueda.setValue("");
    if (devolverFoco)
      this.botonBusqueda()?.nativeElement.focus();
  }
  ocultarBusquedaAlSalir(evento) {
    if (!this.busquedaAbierta())
      return;
    const destino = evento.composedPath();
    const campo = this.campoBusqueda()?.nativeElement.closest('[role="search"]');
    const boton = this.botonBusqueda()?.nativeElement;
    if ((!campo || !destino.includes(campo)) && (!boton || !destino.includes(boton)))
      this.cerrarBusqueda(false);
  }
  auth = inject(AuthService);
  route = inject(ActivatedRoute, { optional: true });
  constructor() {
    afterNextRender(() => this.route?.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const id = Number(params.get("solicitud"));
      if (Number.isSafeInteger(id) && id > 0)
        this.abrirDetalle(String(id));
    }));
  }
  textoRevisor = textoRevisorSolicitud;
  bandeja = input.required();
  titulo = input.required();
  api = inject(SolicitudesService);
  destroyRef = inject(DestroyRef);
  router = inject(Router);
  location = inject(Location);
  filtros = inject(NonNullableFormBuilder).group({ busqueda: [""], estado: [""], desde: [""], hasta: [""] });
  estados = ESTADOS_SOLICITUD;
  pagina = signal(null);
  cargando = signal(false);
  ocupado = signal(false);
  pestanaGerencia = signal("pendientes");
  error = signal(null);
  aviso = signal(null);
  detalle = signal(null);
  errorDetalle = signal(null);
  cargandoDetalle = signal(false);
  puedeCrear = signal(false);
  modal = viewChild.required(DecisionModalComponent);
  dialogo = viewChild.required(DialogoComponent);
  observadas = computed(() => this.pagina()?.registros.filter((fila) => fila.estado === "Observada").length ?? null);
  pendientes = computed(() => this.pagina()?.registros.filter((fila) => ["Enviada", "En revisi\xF3n", "Pendiente de aprobaci\xF3n"].includes(fila.estado)).length ?? null);
  carga;
  cargaDetalle;
  operativo() {
    return this.api.integrado;
  }
  ngOnInit() {
    this.api.cambios$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (!this.ocupado()) {
        if (this.detalle())
          this.dialogo().cerrar();
        this.cerrarDetalle();
        this.cargar(this.pagina()?.pagina ?? 1);
      }
    });
    if (this.bandeja() === "revision")
      this.filtros.controls.estado.setValue("Enviada");
    if (this.bandeja() === "gerencia") {
      this.route?.queryParamMap.pipe(map((params) => params.get("pestana") === "aprobadas" ? "aprobadas" : "pendientes"), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef)).subscribe((pestana) => {
        this.pestanaGerencia.set(pestana);
        this.filtros.controls.estado.setValue(pestana === "aprobadas" ? "Aprobada" : "Pendiente de aprobaci\xF3n");
        this.cargar();
      });
    }
    if (this.bandeja() === "propias") {
      merge(this.filtros.controls.busqueda.valueChanges.pipe(map((valor) => valor.trim()), distinctUntilChanged(), map(() => 300)), this.filtros.controls.estado.valueChanges.pipe(distinctUntilChanged(), map(() => 0))).pipe(switchMap((espera) => espera ? timer(espera) : of(0)), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        if (!this.ocupado())
          this.cargar();
      });
    }
    const estado = this.router.getCurrentNavigation()?.extras.state ?? this.location.getState();
    if (this.bandeja() === "propias" && estado?.["solicitudEnviada"]) {
      this.aviso.set("Solicitud enviada y confirmada por Laravel.");
    }
    if (this.bandeja() !== "gerencia" || !this.route)
      this.cargar();
    if (this.bandeja() === "propias" && this.api.integrado)
      this.api.contexto().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (contexto) => this.puedeCrear.set(contexto.puedeCrear),
        error: (error) => this.error.set(mensajeSolicitudes(error))
      });
  }
  cargar(numero = 1) {
    if (!this.api.integrado) {
      this.pagina.set(null);
      this.cargando.set(false);
      this.error.set(null);
      return;
    }
    const filtros = this.filtros.getRawValue();
    if (this.bandeja() === "gerencia")
      filtros.estado = this.pestanaGerencia() === "aprobadas" ? "Aprobada" : "Pendiente de aprobaci\xF3n";
    if (filtros.desde && filtros.hasta && filtros.hasta < filtros.desde) {
      this.error.set("La fecha final del filtro no puede preceder a la inicial.");
      return;
    }
    this.carga?.unsubscribe();
    this.cargando.set(true);
    this.error.set(null);
    if (this.bandeja() !== "propias")
      this.pagina.set(null);
    this.carga = this.api.listar(this.bandeja(), __spreadProps(__spreadValues({}, filtros), { busqueda: filtros.busqueda.trim(), pagina: numero })).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (pagina) => {
        this.pagina.set(pagina);
        this.cargando.set(false);
      },
      error: (error) => {
        this.error.set(mensajeSolicitudes(error));
        this.cargando.set(false);
      }
    });
  }
  limpiar() {
    this.filtros.reset();
    if (this.bandeja() === "revision")
      this.filtros.controls.estado.setValue("Enviada");
    if (this.bandeja() === "gerencia")
      this.filtros.controls.estado.setValue(this.pestanaGerencia() === "aprobadas" ? "Aprobada" : "Pendiente de aprobaci\xF3n");
    this.cargar();
  }
  acciones(fila) {
    if (this.bandeja() === "gerencia" && (this.pestanaGerencia() === "aprobadas" || fila.estado !== "Pendiente de aprobaci\xF3n"))
      return [];
    const permitidas = this.bandeja() === "propias" ? ["Enviar"] : this.bandeja() === "revision" ? ["Iniciar revisi\xF3n", "Observar", "Derivar"] : ["Aprobar", "Rechazar"];
    return this.api.accionesPermitidas(fila).filter((accion) => permitidas.includes(accion));
  }
  ver(fila) {
    if (fila.puedeVerDetalle === false)
      return;
    this.abrirDetalle(fila.id);
  }
  cambiarPestanaGerencia(pestana) {
    if (this.ocupado() || this.pestanaGerencia() === pestana)
      return;
    if (this.detalle() || this.cargandoDetalle())
      this.dialogo().cerrar();
    this.aviso.set(null);
    void this.router.navigate([], { relativeTo: this.route, queryParams: { pestana: pestana === "aprobadas" ? pestana : null }, queryParamsHandling: "merge" });
  }
  teclearPestanasGerencia(evento) {
    if (this.ocupado() || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(evento.key))
      return;
    evento.preventDefault();
    const destino = evento.key === "Home" ? "pendientes" : evento.key === "End" ? "aprobadas" : this.pestanaGerencia() === "pendientes" ? "aprobadas" : "pendientes";
    this.cambiarPestanaGerencia(destino);
    evento.currentTarget.querySelector("#gerencia-" + destino)?.focus();
  }
  abrirDetalle(id) {
    this.cargaDetalle?.unsubscribe();
    this.detalle.set(null);
    this.errorDetalle.set(null);
    this.cargandoDetalle.set(true);
    this.dialogo().abrir();
    this.cargaDetalle = this.api.detalle(id, this.bandeja() !== "propias").pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (detalle) => {
        this.detalle.set(detalle);
        this.cargandoDetalle.set(false);
      },
      error: (error) => {
        this.errorDetalle.set(mensajeSolicitudes(error));
        this.cargandoDetalle.set(false);
      }
    });
  }
  cerrarDetalle() {
    this.cargaDetalle?.unsubscribe();
    this.detalle.set(null);
  }
  decidir(confirmacion) {
    if (this.ocupado() || !this.api.integrado || !this.acciones(confirmacion.registro).includes(confirmacion.accion))
      return;
    this.ocupado.set(true);
    this.error.set(null);
    this.aviso.set(null);
    const pagina = this.pagina()?.pagina ?? 1;
    this.api.decidir(confirmacion.registro.id, confirmacion.registro.version, confirmacion.accion, confirmacion.motivo).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (fila) => {
        this.ocupado.set(false);
        this.modal().cerrar();
        this.aviso.set(`Operaci\xF3n confirmada por el servidor. Estado: ${fila.estado}.`);
        if (this.bandeja() === "gerencia" && this.detalle()) {
          this.dialogo().cerrar();
          this.cerrarDetalle();
        }
        if (this.bandeja() === "revision" && confirmacion.accion === "Iniciar revisi\xF3n")
          this.filtros.controls.estado.setValue("En revisi\xF3n");
        this.cargar(pagina);
      },
      error: (error) => {
        this.ocupado.set(false);
        this.modal().cerrar();
        this.error.set(mensajeSolicitudes(error));
      }
    });
  }
  static \u0275fac = function BandejaSolicitudesComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BandejaSolicitudesComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BandejaSolicitudesComponent, selectors: [["app-bandeja-solicitudes"]], viewQuery: function BandejaSolicitudesComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuerySignal(ctx.campoBusqueda, _c0, 5);
      \u0275\u0275viewQuerySignal(ctx.botonBusqueda, _c1, 5);
      \u0275\u0275viewQuerySignal(ctx.modal, DecisionModalComponent, 5);
      \u0275\u0275viewQuerySignal(ctx.dialogo, DialogoComponent, 5);
    }
    if (rf & 2) {
      \u0275\u0275queryAdvance(4);
    }
  }, hostBindings: function BandejaSolicitudesComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("click", function BandejaSolicitudesComponent_click_HostBindingHandler($event) {
        return ctx.ocultarBusquedaAlSalir($event);
      }, false, \u0275\u0275resolveDocument);
    }
  }, inputs: { bandeja: [1, "bandeja"], titulo: [1, "titulo"] }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 30, vars: 22, consts: [["campoBusqueda", ""], ["botonBusqueda", ""], [1, "encabezado-pagina"], ["aria-hidden", "true", 1, "material-symbols-outlined", "icono-pagina"], [1, "titulo-y-descripcion"], [1, "fila-titulo"], [3, "title"], [1, "acciones-cabecera"], ["id", "busqueda-solicitudes", "role", "search", "aria-label", "Filtrar mis solicitudes", 1, "busqueda-desplegable", 3, "hidden", "formGroup"], ["type", "button", "title", "Buscar solicitud", "aria-controls", "busqueda-solicitudes", 1, "btn", "boton-busqueda"], ["role", "tablist", "aria-label", "Solicitudes de actividades", 1, "pestanas-gerencia"], ["aria-label", "Bandeja de solicitudes", 1, "card"], [1, "filtros", 3, "filtros-gerencia", "formGroup"], ["role", "status", 1, "aviso"], ["role", "status", "aria-live", "polite", 1, "estado-carga"], ["role", "alert", 1, "error"], ["aria-label", "Paginaci\xF3n de solicitudes", 1, "paginacion"], ["role", "status", 1, "vacio"], ["titulo", "Detalle de solicitud", 3, "cerrado"], ["role", "status"], [3, "revision", "datos", "registro", "area", "responsable", "tipo"], [1, "acciones"], ["type", "button", "autofocus", "", 1, "btn", 3, "click"], [3, "confirmado", "ocupado", "integrado"], [1, "form-field"], ["for", "filtro-busqueda"], [1, "busqueda-con-icono"], ["aria-hidden", "true", 1, "material-symbols-outlined"], ["id", "filtro-busqueda", "formControlName", "busqueda", "type", "search", "placeholder", "Actividad o n\xFAmero de solicitud", 1, "input", 3, "keydown.escape"], ["type", "button", "title", "Buscar solicitud", "aria-controls", "busqueda-solicitudes", 1, "btn", "boton-busqueda", 3, "click"], ["routerLink", "/solicitudes/nueva", "queryParamsHandling", "preserve", 1, "btn", "btn-primary"], ["type", "button", "disabled", "", "title", "Requiere habilitaci\xF3n del backend y permiso de creaci\xF3n", 1, "btn", "btn-primary"], ["role", "tablist", "aria-label", "Solicitudes de actividades", 1, "pestanas-gerencia", 3, "keydown"], ["type", "button", "role", "tab", "id", "gerencia-pendientes", "aria-label", "Actividades por Aprobar", "aria-controls", "gerencia-solicitudes", 3, "click", "disabled"], ["type", "button", "role", "tab", "id", "gerencia-aprobadas", "aria-label", "Solicitudes aprobadas", "aria-controls", "gerencia-solicitudes", 3, "click", "disabled"], [1, "encabezado"], ["aria-label", "Resumen de resultados", 1, "indicadores"], [1, "card", "indicador"], [1, "filtros", 3, "ngSubmit", "formGroup"], ["id", "filtro-busqueda", "formControlName", "busqueda", "type", "search", 1, "input"], [1, "acciones", "ancho"], ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"], ["type", "button", 1, "btn", 3, "disabled"], ["for", "filtro-estado"], ["id", "filtro-estado", "formControlName", "estado", 1, "input"], ["value", ""], [3, "value"], ["for", "filtro-desde"], ["id", "filtro-desde", "formControlName", "desde", "type", "date", 1, "input"], ["for", "filtro-hasta"], ["id", "filtro-hasta", "formControlName", "hasta", "type", "date", 1, "input", 3, "min"], ["type", "button", 1, "btn", 3, "click", "disabled"], ["tabindex", "0", "role", "region", "aria-label", "Resultados de solicitudes", 1, "tabla-scroll"], [1, "table"], ["scope", "col", 1, "col-centro", "col-numero"], ["scope", "col"], ["scope", "col", 1, "col-centro"], [1, "col-numero"], [1, "nombre-actividad"], [3, "estado"], [3, "estado", "revision"], ["type", "button", 1, "btn", "accion-detalle", 3, "click", "disabled"], ["type", "button", 1, "btn", "accion-icono", 3, "accion-aprobar", "accion-rechazar", "disabled"], ["type", "button", 1, "btn", "accion-icono", 3, "click", "disabled"], ["type", "button", "title", "Ver detalle", "aria-label", "Ver detalle", 1, "btn", "accion-icono", "accion-detalle", 3, "disabled"], ["type", "button", "aria-label", "Ver detalle", 1, "btn", "btn-icono", 3, "disabled"], ["routerLink", "/solicitudes/nueva", 1, "btn", 3, "queryParams"], ["type", "button", 1, "btn", 3, "btn-primary", "disabled"], ["type", "button", "title", "Ver detalle", "aria-label", "Ver detalle", 1, "btn", "accion-icono", "accion-detalle", 3, "click", "disabled"], ["type", "button", "aria-label", "Ver detalle", 1, "btn", "btn-icono", 3, "click", "disabled"]], template: function BandejaSolicitudesComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "header", 2)(1, "span", 3);
      \u0275\u0275text(2);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "div", 4)(4, "div", 5);
      \u0275\u0275element(5, "app-page-title", 6);
      \u0275\u0275elementStart(6, "div", 7);
      \u0275\u0275template(7, BandejaSolicitudesComponent_Conditional_7_Template, 9, 2, "div", 8)(8, BandejaSolicitudesComponent_Conditional_8_Template, 4, 2, "button", 9)(9, BandejaSolicitudesComponent_Conditional_9_Template, 2, 1);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275element(10, "app-integracion-solicitudes");
      \u0275\u0275template(11, BandejaSolicitudesComponent_Conditional_11_Template, 9, 6, "div", 10)(12, BandejaSolicitudesComponent_Conditional_12_Template, 19, 6);
      \u0275\u0275elementStart(13, "section", 11);
      \u0275\u0275template(14, BandejaSolicitudesComponent_Conditional_14_Template, 2, 0, "h2")(15, BandejaSolicitudesComponent_Conditional_15_Template, 10, 6, "form", 12)(16, BandejaSolicitudesComponent_Conditional_16_Template, 2, 1, "p", 13)(17, BandejaSolicitudesComponent_Conditional_17_Template, 2, 1, "p", 14)(18, BandejaSolicitudesComponent_Conditional_18_Template, 2, 1, "p", 15)(19, BandejaSolicitudesComponent_Conditional_19_Template, 9, 6, "nav", 16)(20, BandejaSolicitudesComponent_Conditional_20_Template, 7, 0, "div", 17);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "app-dialogo", 18);
      \u0275\u0275listener("cerrado", function BandejaSolicitudesComponent_Template_app_dialogo_cerrado_21_listener() {
        return ctx.cerrarDetalle();
      });
      \u0275\u0275template(22, BandejaSolicitudesComponent_Conditional_22_Template, 2, 0, "p", 19)(23, BandejaSolicitudesComponent_Conditional_23_Template, 2, 1, "p", 15)(24, BandejaSolicitudesComponent_Conditional_24_Template, 1, 6, "app-solicitud-detalle", 20)(25, BandejaSolicitudesComponent_Conditional_25_Template, 3, 0, "div", 21);
      \u0275\u0275elementStart(26, "div", 21)(27, "button", 22);
      \u0275\u0275listener("click", function BandejaSolicitudesComponent_Template_button_click_27_listener() {
        return ctx.dialogo().cerrar();
      });
      \u0275\u0275text(28, "Cerrar");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(29, "app-decision-modal", 23);
      \u0275\u0275listener("confirmado", function BandejaSolicitudesComponent_Template_app_decision_modal_confirmado_29_listener($event) {
        return ctx.decidir($event);
      });
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_14_0;
      let tmp_18_0;
      let tmp_19_0;
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.bandeja() === "propias" ? "description" : ctx.bandeja() === "revision" ? "fact_check" : "pending_actions");
      \u0275\u0275advance(3);
      \u0275\u0275property("title", ctx.titulo());
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.bandeja() === "propias" ? 7 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.bandeja() === "propias" ? 8 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.bandeja() === "propias" && ctx.auth.tienePermiso("solicitudes.crear") ? 9 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.bandeja() === "gerencia" ? 11 : 12);
      \u0275\u0275advance(2);
      \u0275\u0275attribute("id", ctx.bandeja() === "gerencia" ? "gerencia-solicitudes" : null)("role", ctx.bandeja() === "gerencia" ? "tabpanel" : null)("aria-labelledby", ctx.bandeja() === "gerencia" ? "gerencia-" + ctx.pestanaGerencia() : null);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.bandeja() === "revision" ? 14 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.bandeja() !== "propias" ? 15 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.aviso() ? 16 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.cargando() ? 17 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.error() ? 18 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_14_0 = ctx.pagina()) ? 19 : -1, tmp_14_0);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.api.integrado ? 20 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.cargandoDetalle() ? 22 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.errorDetalle() ? 23 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_18_0 = ctx.detalle()) ? 24 : -1, tmp_18_0);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_19_0 = ctx.bandeja() === "gerencia" && ctx.detalle()) ? 25 : -1, tmp_19_0);
      \u0275\u0275advance(4);
      \u0275\u0275property("ocupado", ctx.ocupado())("integrado", ctx.operativo());
    }
  }, dependencies: [DatePipe, RouterLink, ReactiveFormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, PageTitleComponent, DialogoComponent, DecisionModalComponent, IntegracionAvisoComponent, SolicitudDetalleComponent, SolicitudEstadoBadgeComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\n.encabezado[_ngcontent-%COMP%], \n.acciones[_ngcontent-%COMP%], \n.paginacion[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  flex-wrap: wrap;\n  gap: 0.75rem;\n  margin: 1rem 0;\n}\n.acciones[_ngcontent-%COMP%] {\n  justify-content: flex-start;\n}\n.indicadores[_ngcontent-%COMP%], \n.documentos[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));\n  gap: 1rem;\n  margin: 1.5rem 0;\n}\n.indicador[_ngcontent-%COMP%] {\n  border-top: 3px solid #075a9b;\n}\n.indicador[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  display: block;\n  color: #075a9b;\n  font-size: 1.65rem;\n}\n.indicador[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.25rem 0;\n}\n.filtros[_ngcontent-%COMP%], \n.form-grid[_ngcontent-%COMP%], \n.detalle[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));\n  gap: 1rem;\n}\n.form-grid[_ngcontent-%COMP%] {\n  margin: 1rem 0;\n}\n.filtros-personales[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(0, 36rem);\n  margin-block: 1rem;\n}\n.filtros-personales[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%] {\n  margin-bottom: 0;\n}\n.titulo-y-descripcion[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n}\n.fila-titulo[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n  flex-wrap: wrap;\n}\n.acciones-cabecera[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  flex-wrap: nowrap;\n  gap: 0.5rem;\n  max-width: 100%;\n  min-width: 0;\n  margin-inline-start: auto;\n}\n.boton-busqueda[_ngcontent-%COMP%] {\n  color: #075a9b;\n  padding: 0.65rem;\n}\n.busqueda-desplegable[_ngcontent-%COMP%] {\n  position: absolute;\n  inset-inline-end: calc(100% + 0.5rem);\n  top: 50%;\n  transform: translateY(-50%);\n  z-index: 1;\n  display: flex;\n  align-items: center;\n  width: clamp(7rem, 24vw, 22rem);\n  min-width: 0;\n}\n@media (max-width: 600px) {\n  .busqueda-desplegable[_ngcontent-%COMP%] {\n    width: min(11rem, 100vw - 14rem);\n  }\n}\n.busqueda-desplegable[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  overflow: hidden;\n  clip-path: inset(50%);\n}\n.busqueda-desplegable[hidden][_ngcontent-%COMP%] {\n  display: none;\n}\n.busqueda-desplegable[_ngcontent-%COMP%]:not([hidden]) {\n  animation: _ngcontent-%COMP%_desplegar-busqueda 0.2s ease-out;\n}\n@keyframes _ngcontent-%COMP%_desplegar-busqueda {\n  from {\n    clip-path: inset(0 0 0 100%);\n  }\n  to {\n    clip-path: inset(0);\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .busqueda-desplegable[_ngcontent-%COMP%]:not([hidden]) {\n    animation: none;\n  }\n}\n.busqueda-desplegable[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%] {\n  flex: 1;\n  margin: 0;\n}\n.indicadores-compactos[_ngcontent-%COMP%] {\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 0.75rem;\n  margin: 1rem 0;\n}\n.indicadores-compactos[_ngcontent-%COMP%]   .indicador[_ngcontent-%COMP%] {\n  padding: 0.75rem 1rem;\n  margin: 0;\n}\n.indicadores-compactos[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 1.4rem;\n  line-height: 1.2;\n}\n.indicadores-compactos[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  margin: 0.25rem 0 0;\n}\n.busqueda-con-icono[_ngcontent-%COMP%] {\n  position: relative;\n}\n.busqueda-con-icono[_ngcontent-%COMP%]    > .material-symbols-outlined[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 0.85rem;\n  top: 50%;\n  transform: translateY(-50%);\n  color: #075a9b;\n  pointer-events: none;\n}\n.busqueda-con-icono[_ngcontent-%COMP%]    > .input[_ngcontent-%COMP%] {\n  padding-inline-start: 2.75rem;\n}\n.ancho[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\n.tabla-scroll[_ngcontent-%COMP%] {\n  overflow-x: auto;\n  max-width: 100%;\n}\n.table[_ngcontent-%COMP%] {\n  min-width: 55rem;\n}\n.table[_ngcontent-%COMP%]   caption[_ngcontent-%COMP%] {\n  text-align: left;\n  padding: 0.75rem 0;\n  color: #526170;\n}\n.table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  vertical-align: top;\n}\n.table[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  display: block;\n  margin-top: 0.3rem;\n}\n.table[_ngcontent-%COMP%]   .acciones[_ngcontent-%COMP%] {\n  margin: 0;\n  min-width: 12rem;\n}\n.detalle[_ngcontent-%COMP%] {\n  margin: 1rem 0;\n}\n.detalle[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.detalle[_ngcontent-%COMP%]   dt[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: #075a9b;\n}\n.detalle[_ngcontent-%COMP%]   dd[_ngcontent-%COMP%] {\n  margin: 0.3rem 0 1rem;\n  white-space: pre-wrap;\n  overflow-wrap: anywhere;\n}\n.error[_ngcontent-%COMP%] {\n  color: #a52d2d;\n  margin: 0.35rem 0;\n}\n.aviso[_ngcontent-%COMP%] {\n  padding: 0.8rem;\n  border: 1px solid #b5cad9;\n  background: #f0f7fb;\n  border-radius: 0.4rem;\n  margin-bottom: 1rem;\n}\n.vacio[_ngcontent-%COMP%] {\n  padding: 2rem 1rem;\n  text-align: center;\n  color: #526170;\n}\n.encabezado-pagina[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 1rem;\n  align-items: center;\n  margin-bottom: 1rem;\n}\n.encabezado-pagina[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], \n.ayuda[_ngcontent-%COMP%] {\n  color: #64748b;\n  margin: 0.25rem 0;\n  font-size: 0.9rem;\n}\n.icono-pagina[_ngcontent-%COMP%] {\n  box-sizing: content-box;\n  flex-shrink: 0;\n  color: #075a9b;\n  background: #eaf3fa;\n  border-radius: 0.75rem;\n  padding: 0.75rem;\n}\n.form-field[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.form-field[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: block;\n  font-weight: 600;\n  margin-bottom: 0.45rem;\n}\n.form-field[_ngcontent-%COMP%]   .input[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n}\n.form-field[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 0.8rem;\n  color: #64748b;\n  margin-top: 0.4rem;\n}\n.visor-documento[_ngcontent-%COMP%] {\n  width: 100%;\n  min-height: 60vh;\n  border: 1px solid #075a9b;\n  background: #fff;\n}\n@media (max-width: 600px) {\n  .indicadores-compactos[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .encabezado[_ngcontent-%COMP%] {\n    align-items: stretch;\n  }\n  .filtros[_ngcontent-%COMP%], \n   .form-grid[_ngcontent-%COMP%], \n   .detalle[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .acciones[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n    flex: 1 1 auto;\n  }\n  .card[_ngcontent-%COMP%] {\n    padding: 1rem;\n  }\n  .icono-pagina[_ngcontent-%COMP%] {\n    display: none;\n  }\n}\n/*# sourceMappingURL=solicitudes.css.map */", "\n\n.table[_ngcontent-%COMP%]   .acciones-gerencia[_ngcontent-%COMP%] {\n  flex-wrap: nowrap;\n  gap: 0.5rem;\n  min-width: max-content;\n}\n.acciones-gerencia[_ngcontent-%COMP%]   .btn.accion-icono[_ngcontent-%COMP%], \n.tabla-propias[_ngcontent-%COMP%]   .btn.accion-icono[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 2.75rem;\n  height: 2.75rem;\n  min-width: 2.75rem;\n  padding: 0;\n  flex: 0 0 2.75rem;\n  border: 1px solid currentColor;\n  border-radius: 0.5rem;\n  background: #fff;\n}\n.accion-detalle[_ngcontent-%COMP%] {\n  color: #075a9b;\n}\n.accion-aprobar[_ngcontent-%COMP%] {\n  color: #236641;\n}\n.accion-rechazar[_ngcontent-%COMP%] {\n  color: #a52d2d;\n}\n.accion-icono[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: color-mix(in srgb, currentColor 10%, white);\n}\n.accion-icono[_ngcontent-%COMP%]:focus-visible {\n  outline: 3px solid #075a9b;\n  outline-offset: 3px;\n}\n.accion-icono[_ngcontent-%COMP%]:disabled {\n  opacity: 0.45;\n  cursor: not-allowed;\n}\n.tabla-propias[_ngcontent-%COMP%]   .nombre-actividad[_ngcontent-%COMP%] {\n  min-width: 12rem;\n  max-width: 24rem;\n  white-space: normal;\n  overflow-wrap: anywhere;\n}\n.tabla-propias[_ngcontent-%COMP%]   .acciones[_ngcontent-%COMP%] {\n  min-width: 2.75rem;\n}\n.estado-carga[_ngcontent-%COMP%] {\n  color: #526170;\n  font-size: 0.85rem;\n  margin-block: 0.5rem;\n}\n.pestanas-gerencia[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.25rem;\n  border-bottom: 1px solid #d5dee8;\n  margin-bottom: 1rem;\n}\n.pestanas-gerencia[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.4rem;\n  padding: 0.6rem 0.8rem;\n  background: transparent;\n  border: 0;\n  border-bottom: 3px solid transparent;\n  color: #52677b;\n  cursor: pointer;\n  font: inherit;\n  font-size: 0.9rem;\n}\n.pestanas-gerencia[_ngcontent-%COMP%]   [aria-selected=true][_ngcontent-%COMP%] {\n  color: #075a9b;\n  border-bottom-color: #d6ad4a;\n  font-weight: 600;\n}\n.pestanas-gerencia[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%] {\n  font-size: 1.2rem;\n}\n.pestanas-gerencia[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid #075a9b;\n  outline-offset: 2px;\n}\n.filtros.filtros-gerencia[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(0, 32rem) auto;\n  justify-content: start;\n  align-items: end;\n  gap: 0.75rem;\n}\n.filtros-gerencia[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%] {\n  margin-bottom: 0;\n  min-width: 0;\n}\n.filtros-gerencia[_ngcontent-%COMP%]   .acciones.ancho[_ngcontent-%COMP%] {\n  grid-column: auto;\n  margin: 0;\n}\n@media (max-width: 600px) {\n  .pestanas-gerencia[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n    flex: 1;\n    justify-content: center;\n    font-size: 0.85rem;\n  }\n}\n/*# sourceMappingURL=bandeja-acciones.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BandejaSolicitudesComponent, { className: "BandejaSolicitudesComponent", filePath: "src\\app\\pages\\solicitudes\\compartidos\\bandeja-solicitudes.component.ts", lineNumber: 21 });
})();

export {
  BandejaSolicitudesComponent
};
//# sourceMappingURL=chunk-TS57EPAR.js.map
