import './polyfills.server.mjs';
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  NgSelectOption,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-SPQE7PSN.mjs";
import {
  fechasValidas
} from "./chunk-3FIWDPNU.mjs";
import {
  signal,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-OYAKRC2F.mjs";
import "./chunk-X7LY3JHO.mjs";

// src/app/pages/reportes/reportes-asistencia/reportes-asistencia.component.ts
function ReportesAsistenciaComponent_Conditional_53_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 15);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.mensaje());
  }
}
var ReportesAsistenciaComponent = class _ReportesAsistenciaComponent {
  inicio = "";
  fin = "";
  mensaje = signal("");
  consultar() {
    this.mensaje.set(!fechasValidas(this.inicio, this.fin) ? "La fecha de inicio no puede ser posterior a la fecha de fin." : "Consulta no disponible: Laravel no permite filtrar ni paginar asistencias por actividad y sesi\xF3n. No se realiz\xF3 ninguna descarga de registros.");
  }
  limpiar() {
    this.inicio = "";
    this.fin = "";
    this.mensaje.set("");
  }
  static \u0275fac = function ReportesAsistenciaComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ReportesAsistenciaComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ReportesAsistenciaComponent, selectors: [["app-reportes-asistencia"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 63, vars: 3, consts: [[1, "reporte"], [1, "eyebrow"], [1, "etiqueta"], [1, "subtitulo"], [1, "aviso"], ["aria-hidden", "true", 1, "material-symbols-outlined"], [1, "panel", "filtros", 3, "ngSubmit"], ["disabled", "", "aria-describedby", "dependencia-asistencia"], ["type", "date", "name", "inicio", 3, "ngModelChange", "ngModel"], ["type", "date", "name", "fin", 3, "ngModelChange", "ngModel"], [1, "acciones"], ["type", "submit", 1, "btn", "btn-primario"], ["type", "button", 1, "btn", "btn-neutro", 3, "click"], ["type", "button", 1, "btn", "btn-secundario", 3, "click"], ["type", "button", "disabled", "", 1, "btn", "btn-secundario"], ["role", "status", 1, "aviso"], ["id", "dependencia-asistencia", 1, "panel"]], template: function ReportesAsistenciaComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section", 0)(1, "header")(2, "p", 1);
      \u0275\u0275text(3, "GESTI\xD3N MUNICIPAL \xB7 REPORTES");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "h1");
      \u0275\u0275text(5, "Reportes de asistencia");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "span", 2);
      \u0275\u0275text(7, "En desarrollo \xB7 requiere backend");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "p", 3);
      \u0275\u0275text(9, "El reporte por actividad y sesi\xF3n todav\xEDa no cuenta con una consulta acotada.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(10, "aside", 4)(11, "span", 5);
      \u0275\u0275text(12, "warning");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "h2");
      \u0275\u0275text(14, "Datos no disponibles para este reporte");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "p");
      \u0275\u0275text(16, "Los endpoints actuales de actividades, sesiones y asistencias devuelven listas completas sin filtros ni paginaci\xF3n. Para proteger el rendimiento y el alcance de datos, esta pantalla no descarga esas listas ni muestra una tabla vac\xEDa como resultado de una consulta real.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(17, "form", 6);
      \u0275\u0275listener("ngSubmit", function ReportesAsistenciaComponent_Template_form_ngSubmit_17_listener() {
        return ctx.consultar();
      });
      \u0275\u0275elementStart(18, "h2")(19, "span", 5);
      \u0275\u0275text(20, "tune");
      \u0275\u0275elementEnd();
      \u0275\u0275text(21, "Filtros de consulta");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "label");
      \u0275\u0275text(23, "Actividad");
      \u0275\u0275elementStart(24, "select", 7)(25, "option");
      \u0275\u0275text(26, "Requiere selector paginado del backend");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(27, "label");
      \u0275\u0275text(28, "Sesi\xF3n");
      \u0275\u0275elementStart(29, "select", 7)(30, "option");
      \u0275\u0275text(31, "Requiere sesiones filtradas por actividad");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(32, "label");
      \u0275\u0275text(33, "Fecha de sesi\xF3n desde");
      \u0275\u0275elementStart(34, "input", 8);
      \u0275\u0275twoWayListener("ngModelChange", function ReportesAsistenciaComponent_Template_input_ngModelChange_34_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.inicio, $event) || (ctx.inicio = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(35, "label");
      \u0275\u0275text(36, "Fecha de sesi\xF3n hasta");
      \u0275\u0275elementStart(37, "input", 9);
      \u0275\u0275twoWayListener("ngModelChange", function ReportesAsistenciaComponent_Template_input_ngModelChange_37_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.fin, $event) || (ctx.fin = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(38, "div", 10)(39, "button", 11)(40, "span", 5);
      \u0275\u0275text(41, "bar_chart");
      \u0275\u0275elementEnd();
      \u0275\u0275text(42, "Consultar");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(43, "button", 12);
      \u0275\u0275listener("click", function ReportesAsistenciaComponent_Template_button_click_43_listener() {
        return ctx.limpiar();
      });
      \u0275\u0275elementStart(44, "span", 5);
      \u0275\u0275text(45, "toggle_off");
      \u0275\u0275elementEnd();
      \u0275\u0275text(46, "Limpiar filtros");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(47, "button", 13);
      \u0275\u0275listener("click", function ReportesAsistenciaComponent_Template_button_click_47_listener() {
        return ctx.consultar();
      });
      \u0275\u0275elementStart(48, "span", 5);
      \u0275\u0275text(49, "tune");
      \u0275\u0275elementEnd();
      \u0275\u0275text(50, "Actualizar");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(51, "button", 14);
      \u0275\u0275text(52, "CSV no disponible");
      \u0275\u0275elementEnd()()();
      \u0275\u0275template(53, ReportesAsistenciaComponent_Conditional_53_Template, 2, 1, "p", 15);
      \u0275\u0275elementStart(54, "section", 16)(55, "h2");
      \u0275\u0275text(56, "Qu\xE9 necesita la consulta");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(57, "p");
      \u0275\u0275text(58, "Una lista paginada de actividades por nombre, sesiones de la actividad seleccionada y registros de asistencia con nombre del participante, fecha de sesi\xF3n, entrada, salida y estado real.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(59, "p");
      \u0275\u0275text(60, "No se calculan ausencias ni porcentajes. Se requiere confirmar qu\xE9 participaciones se esperan por sesi\xF3n y c\xF3mo se trata su vigencia, las cancelaciones y los estados. La falta de una marca no equivale por s\xED sola a ausencia.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(61, "p");
      \u0275\u0275text(62, "Una vez confirmada esa regla: porcentaje de asistencia = personas esperadas con asistencia v\xE1lida \xF7 personas esperadas \xD7 100. Con denominador cero debe mostrarse \xABNo aplicable\xBB.");
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(34);
      \u0275\u0275twoWayProperty("ngModel", ctx.inicio);
      \u0275\u0275advance(3);
      \u0275\u0275twoWayProperty("ngModel", ctx.fin);
      \u0275\u0275advance(16);
      \u0275\u0275conditional(ctx.mensaje() ? 53 : -1);
    }
  }, dependencies: [FormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, NgModel, NgForm], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n  padding: clamp(16px, 2vw, 28px);\n  background: #f4f7fb;\n  border-radius: 14px;\n  color: #24344b;\n  container-type: inline-size;\n}\n.reporte[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 24px;\n  width: 100%;\n  margin: 0;\n  min-width: 0;\n}\n.eyebrow[_ngcontent-%COMP%] {\n  color: #075a9b;\n  font-size: 0.7rem;\n  font-weight: 700;\n  letter-spacing: 0.12em;\n}\nh1[_ngcontent-%COMP%] {\n  margin: 8px 0 12px;\n  color: #173854;\n  font-size: clamp(1.5rem, 3vw, 2rem);\n  letter-spacing: -0.03em;\n}\nh2[_ngcontent-%COMP%] {\n  margin: 0 0 10px;\n  font-size: 1.05rem;\n}\np[_ngcontent-%COMP%] {\n  margin: 6px 0;\n  line-height: 1.65;\n}\n.subtitulo[_ngcontent-%COMP%], \nsmall[_ngcontent-%COMP%], \ncaption[_ngcontent-%COMP%] {\n  color: #54657b;\n  font-size: 0.875rem;\n}\n.panel[_ngcontent-%COMP%], \n.tarjeta[_ngcontent-%COMP%] {\n  min-width: 0;\n  padding: 22px;\n  background: white;\n  border: 1px solid #e1e8f0;\n  border-radius: 14px;\n  box-shadow: 0 3px 14px rgba(23, 56, 84, 0.0235294118);\n}\n.aviso[_ngcontent-%COMP%], \n.error[_ngcontent-%COMP%] {\n  padding: 16px 18px;\n  border: 1px solid #f1ddb2;\n  border-radius: 12px;\n  background: #fff9ed;\n  color: #795215;\n  font-size: 0.875rem;\n}\n.error[_ngcontent-%COMP%] {\n  border-color: #f1c9cb;\n  background: #fff1f2;\n  color: #9f2330;\n}\n.informacion[_ngcontent-%COMP%] {\n  border-color: #ccdef5;\n  background: #edf5ff;\n  color: #275584;\n}\n.aviso[_ngcontent-%COMP%]    > .material-symbols-outlined[_ngcontent-%COMP%], \n.error[_ngcontent-%COMP%]    > .material-symbols-outlined[_ngcontent-%COMP%] {\n  float: left;\n  margin-right: 10px;\n  font-size: 20px;\n}\ndetails[_ngcontent-%COMP%] {\n  margin-top: 12px;\n  font-size: 0.8rem;\n  line-height: 1.6;\n}\nsummary[_ngcontent-%COMP%] {\n  width: fit-content;\n  cursor: pointer;\n  font-weight: 600;\n  color: #075a9b;\n}\n.acciones[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 10px;\n}\n.btn[_ngcontent-%COMP%] {\n  min-width: 0;\n  max-width: 100%;\n  min-height: 44px;\n  border-radius: 9px;\n  font-size: 0.8125rem;\n  white-space: nowrap;\n  word-break: normal;\n  overflow-wrap: normal;\n}\n.btn[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%] {\n  flex: none;\n  font-size: 19px;\n}\n.btn-primario[_ngcontent-%COMP%] {\n  background: #075a9b;\n  border-color: #075a9b;\n  color: white;\n}\n.btn-primario[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #064a80;\n  color: white;\n}\n.btn-neutro[_ngcontent-%COMP%] {\n  color: #42536a;\n  border-color: #d3dce7;\n}\n.btn-exportar[_ngcontent-%COMP%] {\n  background: #147148;\n  border-color: #147148;\n  color: white;\n}\n.btn-exportar[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #105a39;\n  color: white;\n}\n[_ngcontent-%COMP%]:is(button, input[_ngcontent-%COMP%], select[_ngcontent-%COMP%], summary)[_ngcontent-%COMP%]:focus-visible {\n  outline: 3px solid #2563eb;\n  outline-offset: 3px;\n}\n.etiqueta[_ngcontent-%COMP%], \n.badge[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  padding: 5px 10px;\n  border-radius: 30px;\n  background: #fff2d9;\n  color: #795215;\n  font-size: 0.75rem;\n  font-weight: 600;\n}\n@container (max-width: 560px) {\n  .panel[_ngcontent-%COMP%], \n   .tarjeta[_ngcontent-%COMP%] {\n    padding: 16px;\n  }\n  .acciones[_ngcontent-%COMP%]    > .btn[_ngcontent-%COMP%] {\n    flex: 1 1 auto;\n  }\n}\n.filtros[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 180px), 1fr));\n  align-items: end;\n  gap: 20px 16px;\n}\n.filtros[_ngcontent-%COMP%]    > h2[_ngcontent-%COMP%], \n.filtros[_ngcontent-%COMP%]    > .acciones[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\n.filtros[_ngcontent-%COMP%]    > h2[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin: 0;\n  color: #173854;\n}\nlabel[_ngcontent-%COMP%] {\n  display: grid;\n  min-width: 0;\n  gap: 8px;\n  color: #42536a;\n  font-size: 0.8rem;\n  font-weight: 600;\n}\ninput[_ngcontent-%COMP%], \nselect[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n  min-height: 44px;\n  padding: 10px 12px;\n  border: 1px solid #c6d2e1;\n  border-radius: 8px;\n  background: #fff;\n  color: #24344b;\n  font: inherit;\n  font-size: 1rem;\n}\n[_ngcontent-%COMP%]:is(input, select)[_ngcontent-%COMP%]:disabled {\n  background: #f1f5f9;\n  color: #52647b;\n  cursor: not-allowed;\n}\n.filtros[_ngcontent-%COMP%]    > .acciones[_ngcontent-%COMP%] {\n  padding-top: 16px;\n  border-top: 1px solid #e8eef5;\n}\n/*# sourceMappingURL=reportes-asistencia.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ReportesAsistenciaComponent, { className: "ReportesAsistenciaComponent", filePath: "src\\app\\pages\\reportes\\reportes-asistencia\\reportes-asistencia.component.ts", lineNumber: 9 });
})();
export {
  ReportesAsistenciaComponent
};
//# sourceMappingURL=chunk-S56N6MGL.mjs.map
