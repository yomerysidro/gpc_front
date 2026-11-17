import './polyfills.server.mjs';
import {
  VisorCertificadoComponent
} from "./chunk-E7AC5UAT.mjs";
import {
  estadoActivo,
  etiquetaEstado
} from "./chunk-UBX3EAES.mjs";
import {
  MunicipalesIndividualesComponent
} from "./chunk-PKF3BBPE.mjs";
import {
  PracticeService
} from "./chunk-SBB4NALW.mjs";
import {
  estadoDocumentalPractica
} from "./chunk-BFRYA4IX.mjs";
import {
  VisorPdfComponent
} from "./chunk-FBTDJ3RZ.mjs";
import "./chunk-ZLU2ZG5B.mjs";
import {
  CambiosCertificadosService
} from "./chunk-ZIVCKBVU.mjs";
import {
  DocumentosDigitalesService,
  mensajeDocumento,
  mensajeEtapaA,
  validarMensajeCertificado
} from "./chunk-R23RR7XQ.mjs";
import {
  DialogoComponent
} from "./chunk-Y2AZ2EMT.mjs";
import {
  PageTitleComponent
} from "./chunk-XGG6XIOR.mjs";
import {
  ActivatedRoute,
  Router,
  RouterLink
} from "./chunk-OX7VSSQH.mjs";
import "./chunk-VNKXA6HD.mjs";
import {
  AuthService
} from "./chunk-NP7M7R34.mjs";
import {
  BLOQUEO_ESCRITURA_EMISION,
  ESCRITURA_EMISION_AUTORIZADA,
  EmisionCertificadosService
} from "./chunk-UOKIJFGD.mjs";
import "./chunk-7VY3YOD2.mjs";
import {
  PersonService
} from "./chunk-2XE3PF63.mjs";
import {
  aErrorApi
} from "./chunk-JMI3IFFT.mjs";
import {
  environment
} from "./chunk-HFD7K63G.mjs";
import {
  takeUntilDestroyed,
  toSignal
} from "./chunk-TSKSZVR2.mjs";
import "./chunk-TNXV45E5.mjs";
import {
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  FormBuilder,
  FormControl,
  FormControlDirective,
  FormControlName,
  FormGroupDirective,
  NgControlStatus,
  NgControlStatusGroup,
  NgSelectOption,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  SelectControlValueAccessor,
  Validators,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-SPQE7PSN.mjs";
import {
  DatePipe,
  DestroyRef,
  afterNextRender,
  catchError,
  computed,
  distinctUntilChanged,
  effect,
  finalize,
  forkJoin,
  formatDate,
  from,
  inject,
  input,
  map,
  mergeMap,
  of,
  output,
  signal,
  startWith,
  switchMap,
  timeout,
  toArray,
  untracked,
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
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵqueryAdvance,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3,
  ɵɵviewQuerySignal
} from "./chunk-OYAKRC2F.mjs";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-X7LY3JHO.mjs";

// src/app/pages/emision-certificados/generar-emitir/practicas-certificacion.component.ts
var _forTrack0 = ($index, $item) => $item.id_origen;
function PracticasCertificacionComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 1);
    \u0275\u0275text(1, "Cargando pr\xE1cticas\u2026");
    \u0275\u0275elementEnd();
  }
}
function PracticasCertificacionComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 4);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 5);
    \u0275\u0275listener("click", function PracticasCertificacionComponent_Conditional_5_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cargar());
    });
    \u0275\u0275text(3, "Reintentar");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.error());
  }
}
function PracticasCertificacionComponent_For_30_Conditional_19_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Anulado");
    \u0275\u0275elementEnd();
  }
}
function PracticasCertificacionComponent_For_30_Conditional_19_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 9);
    \u0275\u0275listener("click", function PracticasCertificacionComponent_For_30_Conditional_19_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const e_r4 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.abrir(e_r4));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const e_r4 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("disabled", !ctx_r1.puedeAbrirExistente(e_r4));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.accion(e_r4));
  }
}
function PracticasCertificacionComponent_For_30_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, PracticasCertificacionComponent_For_30_Conditional_19_Conditional_0_Template, 2, 0, "span")(1, PracticasCertificacionComponent_For_30_Conditional_19_Conditional_1_Template, 2, 2, "button", 8);
  }
  if (rf & 2) {
    const e_r4 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r1.estado(e_r4) === "Anulado" ? 0 : 1);
  }
}
function PracticasCertificacionComponent_For_30_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Primero debe finalizarse la pr\xE1ctica");
    \u0275\u0275elementEnd();
  }
}
function PracticasCertificacionComponent_For_30_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 10);
    \u0275\u0275listener("click", function PracticasCertificacionComponent_For_30_Conditional_21_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const e_r4 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.abrir(e_r4));
    });
    \u0275\u0275text(1, "Preparar certificado");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const e_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("disabled", !e_r4.puede_preparar || !e_r4.puede_generar_pdf);
  }
}
function PracticasCertificacionComponent_For_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td");
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
    \u0275\u0275elementStart(9, "td");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td");
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td");
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "td")(16, "span", 6);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "td");
    \u0275\u0275template(19, PracticasCertificacionComponent_For_30_Conditional_19_Template, 2, 1)(20, PracticasCertificacionComponent_For_30_Conditional_20_Template, 2, 0, "span")(21, PracticasCertificacionComponent_For_30_Conditional_21_Template, 2, 1, "button", 7);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const e_r4 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.nombre(e_r4));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(e_r4.practica.institucion || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(e_r4.practica.area || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(e_r4.practica.carrera || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(e_r4.practica.fecha_inicio || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(e_r4.practica.fecha_fin || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(e_r4.practica.estado);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("estado-disponible", ctx_r1.estado(e_r4) === "Certificado confirmado");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.estado(e_r4));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(e_r4.certificados_existentes.length ? 19 : !e_r4.finalizacion_registrada ? 20 : 21);
  }
}
function PracticasCertificacionComponent_ForEmpty_31_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 11);
    \u0275\u0275text(2, "No hay pr\xE1cticas disponibles.");
    \u0275\u0275elementEnd()();
  }
}
function PracticasCertificacionComponent_ForEmpty_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, PracticasCertificacionComponent_ForEmpty_31_Conditional_0_Template, 3, 0, "tr");
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(!ctx_r1.cargando() && !ctx_r1.error() ? 0 : -1);
  }
}
var PracticasCertificacionComponent = class _PracticasCertificacionComponent {
  api = inject(PracticeService);
  catalogo = inject(EmisionCertificadosService);
  router = inject(Router);
  destroy = inject(DestroyRef);
  filas = signal([]);
  cargando = signal(false);
  error = signal("");
  documentos = signal(/* @__PURE__ */ new Map());
  constructor() {
    this.cargar();
  }
  estado(e) {
    const existentes = e.certificados_existentes;
    if (!existentes.length)
      return "Pendiente de preparaci\xF3n";
    if (existentes.length !== 1)
      return "Estado documental por verificar";
    const c = existentes[0];
    const d = this.documentos().get(c.id_certificado);
    return estadoDocumentalPractica(d ?? { id_certificado_documento: c.id_certificado_documento, estado_certificado: c.estado });
  }
  accion(e) {
    const estado = this.estado(e);
    return estado === "Pendiente de env\xEDo a Gerencia" ? "Continuar preparaci\xF3n" : estado === "Pendiente de firma" ? "En revisi\xF3n por Gerencia" : estado === "Certificado confirmado" ? "Ver certificado" : "Estado por verificar";
  }
  puedeAbrirExistente(e) {
    const estado = this.estado(e);
    return estado === "Pendiente de env\xEDo a Gerencia" || ["Pendiente de firma", "Certificado confirmado"].includes(estado) && !!this.documentos().get(e.certificados_existentes[0]?.id_certificado)?.id_certificado_documento;
  }
  nombre(e) {
    return [e.practica.nombres, e.practica.apellido_paterno, e.practica.apellido_materno].filter(Boolean).join(" ");
  }
  cargar() {
    if (this.cargando())
      return;
    this.cargando.set(true);
    this.error.set("");
    this.documentos.set(/* @__PURE__ */ new Map());
    this.api.evaluaciones().pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: (filas) => {
        this.filas.set(filas);
        this.cargarEstados(filas);
      },
      error: (e) => {
        this.error.set(aErrorApi(e).mensaje);
        this.cargando.set(false);
      }
    });
  }
  cargarEstados(filas) {
    const filtros = /* @__PURE__ */ new Map();
    for (const e of filas) {
      if (!e.certificados_existentes.some((c) => !["PREPARADO", "ANULADO"].includes(c.estado.toUpperCase())))
        continue;
      const filtro = e.id_tipo_certificado ? { id_tipo_certificado: String(e.id_tipo_certificado) } : { id_practica: String(e.id_origen) };
      filtros.set(JSON.stringify(filtro), filtro);
    }
    if (!filtros.size) {
      this.cargando.set(false);
      return;
    }
    forkJoin([...filtros.values()].map((f) => this.catalogo.catalogoAutorizado(f, "certificados-documentos").pipe(catchError(() => {
      this.error.set("No se pudo actualizar el estado de los certificados. Intenta nuevamente.");
      return of([]);
    })))).pipe(takeUntilDestroyed(this.destroy)).subscribe((resultados) => {
      const documentos = resultados.flat();
      const mapa = /* @__PURE__ */ new Map();
      for (const e of filas)
        for (const c of e.certificados_existentes) {
          const encontrados = documentos.filter((d) => d.id_certificado === c.id_certificado && d.id_certificado_documento === c.id_certificado_documento && d.id_persona === e.id_persona && d.id_practica === e.id_origen);
          if (encontrados.length === 1)
            mapa.set(c.id_certificado, encontrados[0]);
        }
      this.documentos.set(mapa);
      this.cargando.set(false);
    });
  }
  abrir(e) {
    if (e.certificados_existentes.length) {
      if (!this.puedeAbrirExistente(e))
        return;
      if (this.estado(e) !== "Pendiente de env\xEDo a Gerencia") {
        const d = this.documentos().get(e.certificados_existentes[0].id_certificado);
        if (!d?.id_certificado_documento)
          return;
        void this.router.navigate(["/certificaciones/certificados", d.id_certificado, "documentos", d.id_certificado_documento, "visor"], { queryParams: { origen: "practicas" } });
        return;
      }
    }
    if (!e.certificados_existentes.length && (!e.finalizacion_registrada || !e.puede_preparar || !e.puede_generar_pdf))
      return;
    void this.router.navigate(["/certificaciones/generar-emitir/practicas", e.id_origen, "preparar"], { state: { practica: e } });
  }
  static \u0275fac = function PracticasCertificacionComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PracticasCertificacionComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PracticasCertificacionComponent, selectors: [["app-practicas-certificacion"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 32, vars: 4, consts: [["type", "button", 1, "btn", 3, "click", "disabled"], ["role", "status"], ["role", "region", "aria-label", "Certificaci\xF3n de pr\xE1cticas", "tabindex", "0", 1, "tabla-practicas"], ["scope", "col"], ["role", "alert"], [1, "btn", 3, "click"], [1, "estado-certificacion"], [1, "btn", "btn-primary", 3, "disabled"], [1, "btn", 3, "disabled"], [1, "btn", 3, "click", "disabled"], [1, "btn", "btn-primary", 3, "click", "disabled"], ["colspan", "9"]], template: function PracticasCertificacionComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "h2");
      \u0275\u0275text(1, "Certificaci\xF3n de pr\xE1cticas");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(2, "button", 0);
      \u0275\u0275listener("click", function PracticasCertificacionComponent_Template_button_click_2_listener() {
        return ctx.cargar();
      });
      \u0275\u0275text(3, "Actualizar pr\xE1cticas");
      \u0275\u0275elementEnd();
      \u0275\u0275template(4, PracticasCertificacionComponent_Conditional_4_Template, 2, 0, "p", 1)(5, PracticasCertificacionComponent_Conditional_5_Template, 4, 1);
      \u0275\u0275elementStart(6, "div", 2)(7, "table")(8, "thead")(9, "tr")(10, "th", 3);
      \u0275\u0275text(11, "Practicante");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "th", 3);
      \u0275\u0275text(13, "Instituci\xF3n");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "th", 3);
      \u0275\u0275text(15, "\xC1rea");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "th", 3);
      \u0275\u0275text(17, "Carrera");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "th", 3);
      \u0275\u0275text(19, "Fecha de inicio");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(20, "th", 3);
      \u0275\u0275text(21, "Fecha de fin");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "th", 3);
      \u0275\u0275text(23, "Estado");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "th", 3);
      \u0275\u0275text(25, "Situaci\xF3n de certificaci\xF3n");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(26, "th", 3);
      \u0275\u0275text(27, "Acci\xF3n");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(28, "tbody");
      \u0275\u0275repeaterCreate(29, PracticasCertificacionComponent_For_30_Template, 22, 11, "tr", null, _forTrack0, false, PracticasCertificacionComponent_ForEmpty_31_Template, 1, 1);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275property("disabled", ctx.cargando());
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.cargando() ? 4 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.error() ? 5 : -1);
      \u0275\u0275advance(24);
      \u0275\u0275repeater(ctx.filas());
    }
  }, styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.encabezado[_ngcontent-%COMP%], \n.acciones[_ngcontent-%COMP%], \n.paginacion[_ngcontent-%COMP%], \n.filtros[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: var(--espacio-3);\n}\n.encabezado[_ngcontent-%COMP%] {\n  justify-content: space-between;\n  margin-bottom: var(--espacio-4);\n}\n.acciones[_ngcontent-%COMP%], \n.filtros[_ngcontent-%COMP%], \n.paginacion[_ngcontent-%COMP%] {\n  margin-block: var(--espacio-4);\n}\n.tabla[_ngcontent-%COMP%] {\n  overflow-x: auto;\n}\n.grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));\n  gap: var(--espacio-4);\n}\n.form-field[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.detalle[_ngcontent-%COMP%] {\n  margin-block: var(--espacio-5);\n}\ndt[_ngcontent-%COMP%] {\n  color: var(--neutro-500);\n  font-size: 0.875rem;\n}\ndd[_ngcontent-%COMP%] {\n  margin: 0 0 var(--espacio-3);\n  overflow-wrap: anywhere;\n}\n.nota[_ngcontent-%COMP%] {\n  color: var(--neutro-700);\n  font-size: 0.875rem;\n}\n.table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  overflow-wrap: anywhere;\n}\n.errores[_ngcontent-%COMP%] {\n  color: var(--color-error);\n}\n.reconocimiento[_ngcontent-%COMP%] {\n  border-top: 3px solid var(--boton-dorado);\n  overflow-wrap: anywhere;\n}\n.reconocimiento[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin-top: var(--espacio-4);\n  font-size: 1.25rem;\n}\n/*# sourceMappingURL=emision.css.map */", "\n\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\nh2[_ngcontent-%COMP%] {\n  color: #075a9b;\n  font-size: 1.2rem;\n  margin: 0 0 1.25rem;\n}\n.tabla-practicas[_ngcontent-%COMP%] {\n  overflow-x: auto;\n  border: 1px solid #dfe6ef;\n  border-radius: 0.65rem;\n  background: #fff;\n}\n.tabla-practicas[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid #075a9b;\n  outline-offset: 3px;\n}\ntable[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  text-align: left;\n  color: #20374e;\n  font-size: 0.875rem;\n  line-height: 1.5;\n}\nth[_ngcontent-%COMP%], \ntd[_ngcontent-%COMP%] {\n  padding: 1rem;\n  vertical-align: top;\n  border-bottom: 1px solid #e6ecf2;\n}\nth[_ngcontent-%COMP%] {\n  background: #f4f7fb;\n  color: #075a9b;\n  font-weight: 600;\n}\nth[_ngcontent-%COMP%]:first-child, \ntd[_ngcontent-%COMP%]:first-child {\n  min-width: 10rem;\n}\ntd[_ngcontent-%COMP%]:first-child {\n  font-weight: 600;\n}\ntd[_ngcontent-%COMP%]:nth-child(2), \ntd[_ngcontent-%COMP%]:nth-child(3), \ntd[_ngcontent-%COMP%]:nth-child(4) {\n  min-width: 8rem;\n  overflow-wrap: anywhere;\n}\ntd[_ngcontent-%COMP%]:nth-child(5), \ntd[_ngcontent-%COMP%]:nth-child(6) {\n  white-space: nowrap;\n  font-variant-numeric: tabular-nums;\n}\nth[_ngcontent-%COMP%]:nth-child(7), \ntd[_ngcontent-%COMP%]:nth-child(7) {\n  min-width: 6rem;\n}\nth[_ngcontent-%COMP%]:nth-child(8), \ntd[_ngcontent-%COMP%]:nth-child(8) {\n  min-width: 10rem;\n}\ntd[_ngcontent-%COMP%]:last-child {\n  min-width: 12rem;\n}\ntd[_ngcontent-%COMP%]:last-child    > span[_ngcontent-%COMP%] {\n  color: #53657a;\n}\ntbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:last-child   td[_ngcontent-%COMP%] {\n  border-bottom: 0;\n}\ntbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover {\n  background: #fafbfd;\n}\n.estado-certificacion[_ngcontent-%COMP%] {\n  display: inline-block;\n  padding: 0.25rem 0.65rem;\n  border-radius: 0.4rem;\n  background: #f7efd9;\n  color: #735817;\n  font-size: 0.8rem;\n  font-weight: 600;\n}\n.estado-disponible[_ngcontent-%COMP%] {\n  background: #eaf2fa;\n  color: #075a9b;\n}\n.btn[_ngcontent-%COMP%] {\n  line-height: 1.4;\n  text-align: center;\n}\n/*# sourceMappingURL=practicas-certificacion.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PracticasCertificacionComponent, { className: "PracticasCertificacionComponent", filePath: "src\\app\\pages\\emision-certificados\\generar-emitir\\practicas-certificacion.component.ts", lineNumber: 34 });
})();

// src/app/pages/emision-certificados/generar-emitir/reconocimientos-actividad.component.ts
var _forTrack02 = ($index, $item) => $item["id_actividad"];
var _forTrack1 = ($index, $item) => $item.id_actividad_ponente;
function ReconocimientosActividadComponent_Conditional_3_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const a_r3 = ctx.$implicit;
    \u0275\u0275property("value", a_r3["id_actividad"]);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(a_r3["nombre"]);
  }
}
function ReconocimientosActividadComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label");
    \u0275\u0275text(1, "Actividad");
    \u0275\u0275elementStart(2, "select", 5);
    \u0275\u0275listener("change", function ReconocimientosActividadComponent_Conditional_3_Template_select_change_2_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cargarActividad(+$event.target.value));
    });
    \u0275\u0275elementStart(3, "option", 6);
    \u0275\u0275text(4, "Seleccionar actividad");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(5, ReconocimientosActividadComponent_Conditional_3_For_6_Template, 2, 2, "option", 7, _forTrack02);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("value", (tmp_1_0 = ctx_r1.actividadSeleccionada()) !== null && tmp_1_0 !== void 0 ? tmp_1_0 : "")("disabled", ctx_r1.cargando());
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.actividades());
  }
}
function ReconocimientosActividadComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 1);
    \u0275\u0275text(1, "Cargando reconocimientos\u2026");
    \u0275\u0275elementEnd();
  }
}
function ReconocimientosActividadComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 2);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.error());
  }
}
function ReconocimientosActividadComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 8);
    \u0275\u0275listener("click", function ReconocimientosActividadComponent_Conditional_6_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cargarActividad(ctx_r1.actividadSeleccionada()));
    });
    \u0275\u0275text(1, "Actualizar reconocimientos");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("disabled", ctx_r1.cargando());
  }
}
function ReconocimientosActividadComponent_Conditional_7_For_18_For_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const motivo_r6 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(motivo_r6);
  }
}
function ReconocimientosActividadComponent_Conditional_7_For_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "th", 10);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275elementStart(7, "small");
    \u0275\u0275text(8, "Reconocimiento por actividad");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "td");
    \u0275\u0275text(10);
    \u0275\u0275repeaterCreate(11, ReconocimientosActividadComponent_Conditional_7_For_18_For_12_Template, 2, 1, "p", null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td");
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "td")(16, "button", 11);
    \u0275\u0275listener("click", function ReconocimientosActividadComponent_Conditional_7_For_18_Template_button_click_16_listener() {
      const p_r7 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.continuar(p_r7));
    });
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const p_r7 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.nombre(p_r7));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r7.reconocimiento.actividad || ctx_r1.nombreActividad());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r7.reconocimiento.tipo_certificado || "No determinado");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(p_r7.reconocimiento.estado_elegibilidad);
    \u0275\u0275advance();
    \u0275\u0275repeater(p_r7.reconocimiento.motivos_bloqueo);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(p_r7.reconocimiento.puede_consultar_certificado_existente ? "Preparaci\xF3n existente" : p_r7.reconocimiento.puede_preparar ? "Pendiente de preparaci\xF3n" : "Pendiente de validaci\xF3n");
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.cargando() || !ctx_r1.puedeAbrir(p_r7));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(p_r7.reconocimiento.puede_consultar_certificado_existente ? "Ver reconocimiento" : "Preparar reconocimiento");
  }
}
function ReconocimientosActividadComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4)(1, "table", 9)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Beneficiario");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Actividad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Tipo de reconocimiento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Elegibilidad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Preparaci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th");
    \u0275\u0275text(15, "Acci\xF3n");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(16, "tbody");
    \u0275\u0275repeaterCreate(17, ReconocimientosActividadComponent_Conditional_7_For_18_Template, 18, 7, "tr", null, _forTrack1);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(17);
    \u0275\u0275repeater(ctx_r1.filas());
  }
}
function ReconocimientosActividadComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "No hay ponentes autorizados para esta actividad.");
    \u0275\u0275elementEnd();
  }
}
var ReconocimientosActividadComponent = class _ReconocimientosActividadComponent {
  actividadId = input(null);
  candidatos = input(null);
  sesionRetorno = input(null);
  router = inject(Router);
  route = inject(ActivatedRoute);
  api = inject(EmisionCertificadosService);
  auth = inject(AuthService);
  destroy = inject(DestroyRef);
  consulta;
  actividades = signal([]);
  filas = signal([]);
  actividadSeleccionada = signal(null);
  cargando = signal(false);
  error = signal("");
  constructor() {
    effect(() => {
      const actividad = this.actividadId();
      const filas = this.candidatos();
      untracked(() => {
        this.consulta?.unsubscribe();
        this.cargando.set(false);
        this.error.set("");
        this.filas.set([]);
        this.actividadSeleccionada.set(actividad);
        if (!["emision.ver", "actividades.ver", "ponentes-firmantes.ver"].every((p) => this.auth.tienePermiso(p))) {
          this.error.set("No tienes permiso para consultar reconocimientos por actividad.");
          return;
        }
        if (actividad && filas)
          this.filas.set(filas.filter((p) => p.id_actividad === actividad));
        else if (actividad)
          this.cargarActividad(actividad);
        else if (Number(this.route.snapshot.queryParamMap.get("actividad_reconocimiento")) > 0) {
          const id = Number(this.route.snapshot.queryParamMap.get("actividad_reconocimiento"));
          if (!Number.isSafeInteger(id))
            return;
          this.actividadSeleccionada.set(id);
          this.cargando.set(true);
          this.consulta = forkJoin({ actividades: this.api.listarTodos("activity"), ponentes: this.api.ponentesActividad(id) }).pipe(timeout(3e4), takeUntilDestroyed(this.destroy), finalize(() => this.cargando.set(false))).subscribe({
            next: (d) => {
              this.actividades.set(d.actividades);
              this.filas.set(d.ponentes.ponentes);
            },
            error: (e) => this.error.set(mensajeEtapaA(e))
          });
        } else {
          this.cargando.set(true);
          this.consulta = this.api.listarTodos("activity").pipe(timeout(3e4), takeUntilDestroyed(this.destroy), finalize(() => this.cargando.set(false))).subscribe({
            next: (datos) => this.actividades.set(datos),
            error: (e) => this.error.set(mensajeEtapaA(e))
          });
        }
      });
    }, { allowSignalWrites: true });
  }
  nombre(p) {
    return [p.nombres, p.apellido_paterno, p.apellido_materno].filter(Boolean).join(" ");
  }
  nombreActividad() {
    return String(this.actividades().find((a) => Number(a["id_actividad"]) === this.actividadSeleccionada())?.["nombre"] ?? "");
  }
  puedeAbrir(p) {
    const e = p.reconocimiento;
    return e?.origen === "ponente_actividad" && e.modalidad_reconocimiento === "actividad" && e.id_sesion === null && Number.isSafeInteger(e.id_tipo_certificado) && e.id_tipo_certificado > 0 && e.id_origen === p.id_actividad_ponente && e.id_actividad === p.id_actividad && e.id_persona === p.id_persona && (e.puede_preparar === true && e.puede_generar_pdf === true && e.estado_elegibilidad === "Elegible" || e.puede_consultar_certificado_existente === true && e.certificados_existentes?.length === 1);
  }
  cargarActividad(id) {
    this.consulta?.unsubscribe();
    this.error.set("");
    this.filas.set([]);
    this.actividadSeleccionada.set(Number.isSafeInteger(id) && id > 0 ? id : null);
    if (!this.actividadSeleccionada())
      return;
    this.cargando.set(true);
    this.consulta = this.api.ponentesActividad(id).pipe(timeout(3e4), takeUntilDestroyed(this.destroy), finalize(() => this.cargando.set(false))).subscribe({
      next: (d) => this.filas.set(d.ponentes),
      error: (e) => this.error.set(mensajeEtapaA(e))
    });
  }
  continuar(p) {
    if (this.cargando() || !this.puedeAbrir(p) || !this.filas().includes(p))
      return;
    this.cargando.set(true);
    this.error.set("");
    this.consulta = this.api.ponentesActividad(p.id_actividad).pipe(timeout(3e4), takeUntilDestroyed(this.destroy), finalize(() => this.cargando.set(false))).subscribe({
      next: (d) => {
        this.filas.set(d.ponentes);
        const vigente = d.ponentes.find((f) => f.id_actividad_ponente === p.id_actividad_ponente);
        if (vigente && this.puedeAbrir(vigente)) {
          const retorno = this.sesionRetorno() ? { id_actividad: p.id_actividad, id_sesion: this.sesionRetorno(), modalidad: "sesion", origen: "participacion" } : { origen_documental: "reconocimiento", actividad_reconocimiento: p.id_actividad };
          void this.router.navigate(["/certificaciones/generar-emitir/reconocimientos/actividad", p.id_actividad, "ponentes", p.id_actividad_ponente], { queryParams: retorno });
        }
      },
      error: (e) => this.error.set(mensajeEtapaA(e))
    });
  }
  static \u0275fac = function ReconocimientosActividadComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ReconocimientosActividadComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ReconocimientosActividadComponent, selectors: [["app-reconocimientos-actividad"]], inputs: { actividadId: [1, "actividadId"], candidatos: [1, "candidatos"], sesionRetorno: [1, "sesionRetorno"] }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 9, vars: 5, consts: [["aria-label", "Reconocimientos por actividad"], ["role", "status"], ["role", "alert"], ["type", "button", 1, "btn", 3, "disabled"], [1, "tabla"], [1, "input", 3, "change", "value", "disabled"], ["value", ""], [3, "value"], ["type", "button", 1, "btn", 3, "click", "disabled"], [1, "table"], ["scope", "row"], ["type", "button", 1, "btn", "btn-primary", 3, "click", "disabled"]], template: function ReconocimientosActividadComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section", 0)(1, "h3");
      \u0275\u0275text(2, "Reconocimiento por actividad");
      \u0275\u0275elementEnd();
      \u0275\u0275template(3, ReconocimientosActividadComponent_Conditional_3_Template, 7, 2, "label")(4, ReconocimientosActividadComponent_Conditional_4_Template, 2, 0, "p", 1)(5, ReconocimientosActividadComponent_Conditional_5_Template, 2, 1, "p", 2)(6, ReconocimientosActividadComponent_Conditional_6_Template, 2, 1, "button", 3)(7, ReconocimientosActividadComponent_Conditional_7_Template, 19, 0, "div", 4)(8, ReconocimientosActividadComponent_Conditional_8_Template, 2, 0, "p");
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275conditional(!ctx.actividadId() ? 3 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.cargando() ? 4 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.error() ? 5 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.actividadSeleccionada() ? 6 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.filas().length ? 7 : ctx.actividadSeleccionada() && !ctx.cargando() && !ctx.error() ? 8 : -1);
    }
  }, styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\nh3[_ngcontent-%COMP%] {\n  color: #075a9b;\n}\nlabel[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.3rem;\n  max-width: 28rem;\n  margin-bottom: 0.7rem;\n}\n.tabla[_ngcontent-%COMP%] {\n  overflow-x: auto;\n}\n.table[_ngcontent-%COMP%] {\n  min-width: 45rem;\n}\nth[_ngcontent-%COMP%], \ntd[_ngcontent-%COMP%] {\n  vertical-align: top;\n}\nsmall[_ngcontent-%COMP%] {\n  display: block;\n}\ntd[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  margin: 0.3rem 0;\n}\n/*# sourceMappingURL=reconocimientos-actividad.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ReconocimientosActividadComponent, { className: "ReconocimientosActividadComponent", filePath: "src\\app\\pages\\emision-certificados\\generar-emitir\\reconocimientos-actividad.component.ts", lineNumber: 37 });
})();

// src/app/pages/emision-certificados/generar-emitir/origenes-tabs.component.ts
var _forTrack03 = ($index, $item) => $item.id;
function OrigenesTabsComponent_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 2);
    \u0275\u0275listener("click", function OrigenesTabsComponent_For_2_Template_button_click_0_listener() {
      const opcion_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.seleccion.emit(opcion_r2.id));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const opcion_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("id", "origen-tab-" + opcion_r2.id)("disabled", ctx_r2.bloqueado());
    \u0275\u0275attribute("aria-selected", ctx_r2.actual() === opcion_r2.id)("tabindex", ctx_r2.actual() === opcion_r2.id ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(opcion_r2.nombre);
  }
}
var OrigenesTabsComponent = class _OrigenesTabsComponent {
  actual = input("capacitacion");
  bloqueado = input(false);
  seleccion = output();
  opciones = [
    { id: "capacitacion", nombre: "Capacitaci\xF3n" },
    { id: "reconocimiento", nombre: "Reconocimientos" },
    { id: "practica", nombre: "Pr\xE1cticas" }
  ];
  teclear(evento) {
    if (this.bloqueado())
      return;
    const actual = this.opciones.findIndex((o) => o.id === this.actual());
    const destinos = { ArrowRight: (actual + 1) % 3, ArrowLeft: (actual + 2) % 3, Home: 0, End: 2 };
    if (destinos[evento.key] === void 0)
      return;
    evento.preventDefault();
    const id = this.opciones[destinos[evento.key]].id;
    this.seleccion.emit(id);
    evento.currentTarget.querySelector("#origen-tab-" + id)?.focus();
  }
  static \u0275fac = function OrigenesTabsComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _OrigenesTabsComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _OrigenesTabsComponent, selectors: [["app-origenes-tabs"]], inputs: { actual: [1, "actual"], bloqueado: [1, "bloqueado"] }, outputs: { seleccion: "seleccion" }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 3, vars: 0, consts: [["role", "tablist", "aria-label", "Origen del certificado", 3, "keydown"], ["type", "button", "role", "tab", "aria-controls", "emision-pendientes", 3, "id", "disabled"], ["type", "button", "role", "tab", "aria-controls", "emision-pendientes", 3, "click", "id", "disabled"]], template: function OrigenesTabsComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "nav", 0);
      \u0275\u0275listener("keydown", function OrigenesTabsComponent_Template_nav_keydown_0_listener($event) {
        return ctx.teclear($event);
      });
      \u0275\u0275repeaterCreate(1, OrigenesTabsComponent_For_2_Template, 2, 5, "button", 1, _forTrack03);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.opciones);
    }
  }, styles: ["\n\nnav[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.3rem;\n  border-bottom: 1px solid #dfe6ef;\n  margin-bottom: 1rem;\n  overflow-x: auto;\n}\nbutton[_ngcontent-%COMP%] {\n  border: 0;\n  border-bottom: 3px solid transparent;\n  background: transparent;\n  padding: 0.65rem 0.85rem;\n  color: #526477;\n  cursor: pointer;\n  white-space: nowrap;\n  font: inherit;\n}\nbutton[aria-selected=true][_ngcontent-%COMP%] {\n  border-color: #075a9b;\n  color: #075a9b;\n  font-weight: 600;\n}\nbutton[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid #075a9b;\n  outline-offset: -2px;\n}\nbutton[_ngcontent-%COMP%]:disabled {\n  opacity: 0.5;\n  cursor: default;\n}\n/*# sourceMappingURL=origenes-tabs.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(OrigenesTabsComponent, { className: "OrigenesTabsComponent", filePath: "src\\app\\pages\\emision-certificados\\generar-emitir\\origenes-tabs.component.ts", lineNumber: 15 });
})();

// src/app/pages/emision-certificados/generar-emitir/ponentes-sesion.component.ts
var _forTrack04 = ($index, $item) => $item.id_actividad_ponente;
function PonentesSesionComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 2);
    \u0275\u0275text(1, "No tienes permiso para consultar los ponentes de esta sesi\xF3n.");
    \u0275\u0275elementEnd();
  }
}
function PonentesSesionComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 2);
    \u0275\u0275text(1, "Cargando ponentes de la sesi\xF3n\u2026");
    \u0275\u0275elementEnd();
  }
}
function PonentesSesionComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 3);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 4);
    \u0275\u0275listener("click", function PonentesSesionComponent_Conditional_6_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cargar());
    });
    \u0275\u0275text(3, "Reintentar ponentes");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.error());
  }
}
function PonentesSesionComponent_Conditional_7_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 5);
    \u0275\u0275text(1, "No hay ponentes asignados");
    \u0275\u0275elementEnd();
  }
}
function PonentesSesionComponent_Conditional_7_Conditional_1_For_20_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3("", p_r4.cargo || "", "", p_r4.cargo && p_r4.institucion ? " \xB7 " : "", "", p_r4.institucion || "", "");
  }
}
function PonentesSesionComponent_Conditional_7_Conditional_1_For_20_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(p_r4.reconocimiento.fecha_sesion);
  }
}
function PonentesSesionComponent_Conditional_7_Conditional_1_For_20_For_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const motivo_r5 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(motivo_r5);
  }
}
function PonentesSesionComponent_Conditional_7_Conditional_1_For_20_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "small", 3);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 11);
    \u0275\u0275listener("click", function PonentesSesionComponent_Conditional_7_Conditional_1_For_20_Conditional_15_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.cargar());
    });
    \u0275\u0275text(3, "Reintentar consulta");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.cargando());
  }
}
function PonentesSesionComponent_Conditional_7_Conditional_1_For_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "th", 10);
    \u0275\u0275text(2);
    \u0275\u0275template(3, PonentesSesionComponent_Conditional_7_Conditional_1_For_20_Conditional_3_Template, 2, 3, "small");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "td");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td");
    \u0275\u0275text(7);
    \u0275\u0275template(8, PonentesSesionComponent_Conditional_7_Conditional_1_For_20_Conditional_8_Template, 2, 1, "small");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td");
    \u0275\u0275text(10);
    \u0275\u0275repeaterCreate(11, PonentesSesionComponent_Conditional_7_Conditional_1_For_20_For_12_Template, 2, 1, "small", null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td");
    \u0275\u0275text(14);
    \u0275\u0275template(15, PonentesSesionComponent_Conditional_7_Conditional_1_For_20_Conditional_15_Template, 4, 2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "td")(17, "button", 11);
    \u0275\u0275listener("click", function PonentesSesionComponent_Conditional_7_Conditional_1_For_20_Template_button_click_17_listener() {
      const p_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.abrir(p_r4));
    });
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_21_0;
    const p_r4 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", ctx_r1.nombre(p_r4), " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(p_r4.cargo || p_r4.institucion ? 3 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r4.reconocimiento.actividad || ctx_r1.actividadNombre());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", p_r4.reconocimiento.sesion || ctx_r1.sesionNombre() || "Sesi\xF3n " + ctx_r1.sesionId(), " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(p_r4.reconocimiento.fecha_sesion ? 8 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", p_r4.reconocimiento.estado_elegibilidad, " ");
    \u0275\u0275advance();
    \u0275\u0275repeater(p_r4.reconocimiento.motivos_bloqueo);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", ctx_r1.estadoPreparacion(p_r4), " ");
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_21_0 = ctx_r1.erroresConsulta().get(p_r4.id_actividad_ponente)) ? 15 : -1, tmp_21_0);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !ctx_r1.puedeAbrir(p_r4) || ctx_r1.cargando());
    \u0275\u0275attribute("title", ctx_r1.puedeAbrir(p_r4) ? null : ctx_r1.motivoBloqueo(p_r4));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.accion(p_r4));
  }
}
function PonentesSesionComponent_Conditional_7_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6)(1, "table", 8)(2, "caption", 9);
    \u0275\u0275text(3, "Ponentes vinculados a esta sesi\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "thead")(5, "tr")(6, "th");
    \u0275\u0275text(7, "Ponente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Actividad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Sesi\xF3n acreditada");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Elegibilidad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th");
    \u0275\u0275text(15, "Preparaci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th");
    \u0275\u0275text(17, "Acci\xF3n");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "tbody");
    \u0275\u0275repeaterCreate(19, PonentesSesionComponent_Conditional_7_Conditional_1_For_20_Template, 19, 11, "tr", null, _forTrack04);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const d_r7 = \u0275\u0275nextContext();
    \u0275\u0275advance(19);
    \u0275\u0275repeater(d_r7.ponentes_sesion);
  }
}
function PonentesSesionComponent_Conditional_7_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const d_r7 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(d_r7.motivos_bloqueo[0]);
  }
}
function PonentesSesionComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, PonentesSesionComponent_Conditional_7_Conditional_0_Template, 2, 0, "p", 5)(1, PonentesSesionComponent_Conditional_7_Conditional_1_Template, 21, 0, "div", 6)(2, PonentesSesionComponent_Conditional_7_Conditional_2_Template, 2, 1, "p", 7);
  }
  if (rf & 2) {
    const d_r7 = ctx;
    \u0275\u0275conditional(!(d_r7.ponentes_sesion == null ? null : d_r7.ponentes_sesion.length) ? 0 : 1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(d_r7.motivos_bloqueo.length ? 2 : -1);
  }
}
var PonentesSesionComponent = class _PonentesSesionComponent {
  actividadNombre = input("");
  sesionNombre = input("");
  actividadId = input.required();
  sesionId = input.required();
  api = inject(EmisionCertificadosService);
  documentos = inject(DocumentosDigitalesService);
  estados = signal(/* @__PURE__ */ new Map());
  erroresConsulta = signal(/* @__PURE__ */ new Map());
  auth = inject(AuthService);
  router = inject(Router);
  destroy = inject(DestroyRef);
  consulta;
  datos = signal(null);
  cargando = signal(false);
  error = signal("");
  constructor() {
    effect(() => {
      this.actividadId();
      this.sesionId();
      untracked(() => {
        this.consulta?.unsubscribe();
        this.datos.set(null);
        this.error.set("");
        this.cargando.set(false);
        this.cargar();
      });
    }, { allowSignalWrites: true });
  }
  autorizado() {
    return ["emision.ver", "actividades.ver", "ponentes-firmantes.ver"].every((p) => this.auth.tienePermiso(p));
  }
  cargar() {
    if (!this.autorizado() || this.cargando())
      return;
    const actividad = Number(this.actividadId());
    const sesion = Number(this.sesionId());
    if (!Number.isSafeInteger(actividad) || actividad < 1 || !Number.isSafeInteger(sesion) || sesion < 1)
      return;
    this.consulta?.unsubscribe();
    this.error.set("");
    this.cargando.set(true);
    this.estados.set(/* @__PURE__ */ new Map());
    this.erroresConsulta.set(/* @__PURE__ */ new Map());
    this.consulta = this.api.ponentesCertificacion(sesion).pipe(switchMap((d) => {
      if (Number(d.id_actividad) !== actividad || Number(d.id_sesion) !== sesion)
        return of(d);
      this.datos.set(d);
      this.cargando.set(false);
      const consultas = (d.ponentes_sesion ?? []).filter((p) => p.reconocimiento.puede_consultar_certificado_existente && p.reconocimiento.certificados_existentes?.length === 1).map((p) => this.documentos.recuperarReconocimientoSesion(p.reconocimiento, p.reconocimiento.certificados_existentes[0].id_certificado).pipe(map((doc) => ({ id: p.id_actividad_ponente, doc, error: null })), catchError((error) => of({ id: p.id_actividad_ponente, doc: null, error }))));
      return consultas.length ? forkJoin(consultas).pipe(map((resultados) => {
        this.estados.set(new Map(resultados.flatMap((r) => r.doc ? [[r.id, r.doc]] : [])));
        this.erroresConsulta.set(new Map(resultados.flatMap((r) => r.error ? [[
          r.id,
          `No se pudo consultar la preparaci\xF3n (${r.error.errores?.["endpoint"]?.[0] ?? "recuperaci\xF3n documental autenticada"}, HTTP ${r.error.status}).`
        ]] : [])));
        return d;
      })) : of(d);
    }), takeUntilDestroyed(this.destroy), finalize(() => this.cargando.set(false))).subscribe({
      next: (d) => {
        this.cargando.set(false);
        if (Number(d.id_actividad) !== actividad || Number(d.id_sesion) !== sesion) {
          this.error.set("No se pudo confirmar la sesi\xF3n de los ponentes consultados.");
          return;
        }
        this.datos.set(d);
      },
      error: (e) => {
        this.cargando.set(false);
        this.error.set(e?.status === 409 ? e?.mensaje || "El servidor no acredita los ponentes de esta sesi\xF3n." : mensajeEtapaA(e));
      }
    });
  }
  nombre(p) {
    return [p.nombres, p.apellido_paterno, p.apellido_materno].filter(Boolean).join(" ") || "Nombre no disponible";
  }
  estadoPreparacion(p) {
    const d = this.estados().get(p.id_actividad_ponente);
    if (d?.estado_certificado === "PREPARADO")
      return "Pendiente de env\xEDo a Gerencia";
    if (d?.disponible_rrhh === true || d?.estado_preparacion === "PREPARADO_ENTREGA")
      return "Listo para entrega";
    if (d?.estado_certificado === "PENDIENTE_FIRMA" && (d.enviado === true || d.remision?.estado_persistido === "PENDIENTE_FIRMA"))
      return "Enviado a Gerencia";
    if (p.reconocimiento.puede_consultar_certificado_existente)
      return "Estado documental pendiente de consulta";
    if (p.reconocimiento.puede_preparar && p.reconocimiento.estado_elegibilidad === "Elegible")
      return "Pendiente de preparaci\xF3n";
    return "Pendiente de validaci\xF3n";
  }
  accion(p) {
    const estado = this.estadoPreparacion(p);
    if (estado === "Listo para entrega")
      return "Ver certificado";
    if (estado === "Pendiente de env\xEDo a Gerencia" || this.erroresConsulta().has(p.id_actividad_ponente))
      return "Continuar preparaci\xF3n";
    return p.reconocimiento.puede_consultar_certificado_existente ? "Ver reconocimiento" : "Preparar certificado";
  }
  motivoBloqueo(p) {
    return p.reconocimiento.motivos_bloqueo[0] || "El reconocimiento de esta sesi\xF3n a\xFAn no est\xE1 habilitado.";
  }
  /** Solo habilita la preparación que el servidor acredita para este vínculo y esta sesión. */
  puedeAbrir(p) {
    const e = p.reconocimiento;
    return e?.origen === "ponente_sesion" && e.modalidad_reconocimiento === "sesion" && Number(e.id_sesion) === Number(this.sesionId()) && e.id_origen === p.id_actividad_ponente && Number(e.id_actividad) === Number(this.actividadId()) && Number(e.id_persona) === Number(p.id_persona) && Number.isSafeInteger(e.id_tipo_certificado) && e.id_tipo_certificado > 0 && (e.puede_preparar === true && e.puede_generar_pdf === true && e.estado_elegibilidad === "Elegible" || e.puede_consultar_certificado_existente === true && (e.certificados_existentes?.length ?? 0) === 1);
  }
  abrir(p) {
    if (this.cargando() || !this.puedeAbrir(p) || !this.datos()?.ponentes_sesion?.includes(p))
      return;
    void this.router.navigate(["/certificaciones/generar-emitir/reconocimientos/preparar"], { state: { reconocimientoSesion: p.reconocimiento } });
  }
  static \u0275fac = function PonentesSesionComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PonentesSesionComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PonentesSesionComponent, selectors: [["app-ponentes-sesion"]], inputs: { actividadNombre: [1, "actividadNombre"], sesionNombre: [1, "sesionNombre"], actividadId: [1, "actividadId"], sesionId: [1, "sesionId"] }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 8, vars: 4, consts: [["aria-label", "Ponentes de la sesi\xF3n", 1, "grupo-ponentes"], [1, "cabecera-grupo"], ["role", "status"], ["role", "alert"], ["type", "button", 1, "btn", 3, "click"], ["role", "status", 1, "sin-ponentes"], [1, "tabla"], ["role", "status", 1, "motivos"], [1, "table"], [1, "sr-only"], ["scope", "row"], ["type", "button", 1, "btn", 3, "click", "disabled"]], template: function PonentesSesionComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section", 0)(1, "header", 1)(2, "h2");
      \u0275\u0275text(3, "Ponentes");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(4, PonentesSesionComponent_Conditional_4_Template, 2, 0, "p", 2)(5, PonentesSesionComponent_Conditional_5_Template, 2, 0, "p", 2)(6, PonentesSesionComponent_Conditional_6_Template, 4, 1)(7, PonentesSesionComponent_Conditional_7_Template, 3, 2);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_3_0;
      \u0275\u0275advance(4);
      \u0275\u0275conditional(!ctx.autorizado() ? 4 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.cargando() && !ctx.datos() ? 5 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.error() ? 6 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_3_0 = ctx.datos()) ? 7 : -1, tmp_3_0);
    }
  }, styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n  margin-top: 1.25rem;\n}\n.cabecera-grupo[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: baseline;\n  gap: 0.5rem;\n}\nh2[_ngcontent-%COMP%] {\n  margin: 0 0 0.5rem;\n  color: #075a9b;\n  font-size: 1.05rem;\n}\n.cabecera-grupo[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: #53657a;\n}\n.tabla[_ngcontent-%COMP%] {\n  overflow-x: auto;\n}\n.table[_ngcontent-%COMP%] {\n  min-width: 44rem;\n}\nth[_ngcontent-%COMP%], \ntd[_ngcontent-%COMP%] {\n  vertical-align: top;\n}\ntd[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], \nth[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  display: block;\n  color: #53657a;\n  font-size: 0.82rem;\n  margin-top: 0.15rem;\n}\n.sin-ponentes[_ngcontent-%COMP%] {\n  margin: 0.25rem 0;\n  color: #53657a;\n}\n.motivos[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  color: #53657a;\n}\n/*# sourceMappingURL=ponentes-sesion.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PonentesSesionComponent, { className: "PonentesSesionComponent", filePath: "src\\app\\pages\\emision-certificados\\generar-emitir\\ponentes-sesion.component.ts", lineNumber: 69 });
})();

// src/app/pages/emision-certificados/certificados/formulario-certificado/formulario-certificado.component.ts
var _forTrack05 = ($index, $item) => $item.id_tipo_certificado;
var _forTrack12 = ($index, $item) => $item.id;
function FormularioCertificadoComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-page-title", 3);
    \u0275\u0275elementStart(1, "a", 4);
    \u0275\u0275text(2, "Volver al listado");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("title", ctx_r0.editarId ? "Editar certificado" : "Preparar certificado");
  }
}
function FormularioCertificadoComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 0);
    \u0275\u0275text(1, "Cargando tipos de certificado\u2026");
    \u0275\u0275elementEnd();
  }
}
function FormularioCertificadoComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 1);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.error());
  }
}
function FormularioCertificadoComponent_Conditional_3_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const mensaje_r2 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(mensaje_r2);
  }
}
function FormularioCertificadoComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1)(1, "p");
    \u0275\u0275text(2, "Laravel rechaz\xF3 algunos datos:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "ul");
    \u0275\u0275repeaterCreate(4, FormularioCertificadoComponent_Conditional_3_For_5_Template, 2, 1, "li", null, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r0.mensajesValidacion());
  }
}
function FormularioCertificadoComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 2);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.bloqueoEscritura);
  }
}
function FormularioCertificadoComponent_Conditional_5_Conditional_0_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 12);
    \u0275\u0275text(1, "Participaci\xF3n");
    \u0275\u0275elementEnd();
  }
}
function FormularioCertificadoComponent_Conditional_5_Conditional_0_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 13);
    \u0275\u0275text(1, "Pr\xE1ctica");
    \u0275\u0275elementEnd();
  }
}
function FormularioCertificadoComponent_Conditional_5_Conditional_0_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 14);
    \u0275\u0275text(1, "Reconocimiento");
    \u0275\u0275elementEnd();
  }
}
function FormularioCertificadoComponent_Conditional_5_Conditional_0_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small");
    \u0275\u0275text(1, "Selecciona un origen.");
    \u0275\u0275elementEnd();
  }
}
function FormularioCertificadoComponent_Conditional_5_Conditional_0_Conditional_13_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 23);
    \u0275\u0275text(1, "La b\xFAsqueda por nombre requiere permiso de consulta de Personas. Puedes seleccionar un registro de origen autorizado.");
    \u0275\u0275elementEnd();
  }
}
function FormularioCertificadoComponent_Conditional_5_Conditional_0_Conditional_13_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 0);
    \u0275\u0275text(1, "Consultando registros autorizados\u2026");
    \u0275\u0275elementEnd();
  }
}
function FormularioCertificadoComponent_Conditional_5_Conditional_0_Conditional_13_For_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const opcion_r5 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275property("ngValue", opcion_r5.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3("", opcion_r5.titulo, " \xB7 ", opcion_r5.idPersona ? ctx_r0.nombresOrigen().get(opcion_r5.idPersona) : "", " \xB7 #", opcion_r5.id, "");
  }
}
function FormularioCertificadoComponent_Conditional_5_Conditional_0_Conditional_13_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 0);
    \u0275\u0275text(1, "No hay registros autorizados que coincidan con los criterios.");
    \u0275\u0275elementEnd();
  }
}
function FormularioCertificadoComponent_Conditional_5_Conditional_0_Conditional_13_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 6)(1, "strong");
    \u0275\u0275text(2, "Beneficiario:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r0.beneficiario(), "");
  }
}
function FormularioCertificadoComponent_Conditional_5_Conditional_0_Conditional_13_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 0);
    \u0275\u0275text(1, "Validando el beneficiario asociado\u2026");
    \u0275\u0275elementEnd();
  }
}
function FormularioCertificadoComponent_Conditional_5_Conditional_0_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 28);
    \u0275\u0275text(1, "Buscar beneficiario entre los registros de origen");
    \u0275\u0275elementEnd();
    \u0275\u0275element(2, "input", 29);
    \u0275\u0275elementStart(3, "button", 30);
    \u0275\u0275listener("click", function FormularioCertificadoComponent_Conditional_5_Conditional_0_Conditional_13_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.buscarBeneficiario());
    });
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, FormularioCertificadoComponent_Conditional_5_Conditional_0_Conditional_13_Conditional_5_Template, 2, 0, "p", 23);
    \u0275\u0275elementStart(6, "label", 31);
    \u0275\u0275text(7, "Registro existente");
    \u0275\u0275elementEnd();
    \u0275\u0275template(8, FormularioCertificadoComponent_Conditional_5_Conditional_0_Conditional_13_Conditional_8_Template, 2, 0, "p", 0);
    \u0275\u0275elementStart(9, "select", 32)(10, "option", 17);
    \u0275\u0275text(11, "Selecciona un registro");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(12, FormularioCertificadoComponent_Conditional_5_Conditional_0_Conditional_13_For_13_Template, 2, 4, "option", 17, _forTrack12);
    \u0275\u0275elementEnd();
    \u0275\u0275template(14, FormularioCertificadoComponent_Conditional_5_Conditional_0_Conditional_13_Conditional_14_Template, 2, 0, "p", 0)(15, FormularioCertificadoComponent_Conditional_5_Conditional_0_Conditional_13_Conditional_15_Template, 4, 1, "p", 6)(16, FormularioCertificadoComponent_Conditional_5_Conditional_0_Conditional_13_Conditional_16_Template, 2, 0, "p", 0);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r0.busquedaBeneficiario);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.buscandoPersonas() || !ctx_r0.auth.tienePermiso("personas.verpersonas"));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.buscandoPersonas() ? "Buscando\u2026" : "Buscar beneficiario");
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0.auth.tienePermiso("personas.verpersonas") ? 5 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r0.cargandoOrigen() ? 8 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngValue", null);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r0.opcionesVisibles());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx_r0.cargandoOrigen() && !ctx_r0.opcionesVisibles().length ? 14 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.beneficiario() ? 15 : ctx_r0.formulario.controls.registro.value ? 16 : -1);
  }
}
function FormularioCertificadoComponent_Conditional_5_Conditional_0_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p")(1, "strong");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.beneficiario());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" \xB7 ", ctx_r0.nombreOrigen(ctx_r0.formulario.controls.origen.value), " \xB7 ", ctx_r0.tituloSeleccionado(), "");
  }
}
function FormularioCertificadoComponent_Conditional_5_Conditional_0_For_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tipo_r6 = ctx.$implicit;
    \u0275\u0275property("ngValue", tipo_r6.id_tipo_certificado);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(tipo_r6.nombre_tipo);
  }
}
function FormularioCertificadoComponent_Conditional_5_Conditional_0_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "No hay tipos activos disponibles.");
    \u0275\u0275elementEnd();
  }
}
function FormularioCertificadoComponent_Conditional_5_Conditional_0_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 20);
    \u0275\u0275text(1, "Indica una fecha de calendario v\xE1lida.");
    \u0275\u0275elementEnd();
  }
}
function FormularioCertificadoComponent_Conditional_5_Conditional_0_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 20);
    \u0275\u0275text(1, "Selecciona un tipo de certificado.");
    \u0275\u0275elementEnd();
  }
}
function FormularioCertificadoComponent_Conditional_5_Conditional_0_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 20);
    \u0275\u0275text(1, "Selecciona un registro de origen.");
    \u0275\u0275elementEnd();
  }
}
function FormularioCertificadoComponent_Conditional_5_Conditional_0_Conditional_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx.join(" "));
  }
}
function FormularioCertificadoComponent_Conditional_5_Conditional_0_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 27);
    \u0275\u0275listener("click", function FormularioCertificadoComponent_Conditional_5_Conditional_0_Conditional_41_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.cambioPaso.emit(1));
    });
    \u0275\u0275text(1, "Anterior");
    \u0275\u0275elementEnd();
  }
}
function FormularioCertificadoComponent_Conditional_5_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 7);
    \u0275\u0275listener("ngSubmit", function FormularioCertificadoComponent_Conditional_5_Conditional_0_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.integrado() && ctx_r0.paso() === 1 ? ctx_r0.siguienteOrigen() : ctx_r0.prepararRevision());
    });
    \u0275\u0275elementStart(1, "h2");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 8)(4, "label", 9);
    \u0275\u0275text(5, "Origen del certificado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "select", 10)(7, "option", 11);
    \u0275\u0275text(8, "Selecciona un origen");
    \u0275\u0275elementEnd();
    \u0275\u0275template(9, FormularioCertificadoComponent_Conditional_5_Conditional_0_Conditional_9_Template, 2, 0, "option", 12)(10, FormularioCertificadoComponent_Conditional_5_Conditional_0_Conditional_10_Template, 2, 0, "option", 13)(11, FormularioCertificadoComponent_Conditional_5_Conditional_0_Conditional_11_Template, 2, 0, "option", 14);
    \u0275\u0275elementEnd();
    \u0275\u0275template(12, FormularioCertificadoComponent_Conditional_5_Conditional_0_Conditional_12_Template, 2, 0, "small")(13, FormularioCertificadoComponent_Conditional_5_Conditional_0_Conditional_13_Template, 17, 8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "div", 8);
    \u0275\u0275template(15, FormularioCertificadoComponent_Conditional_5_Conditional_0_Conditional_15_Template, 4, 3, "p");
    \u0275\u0275elementStart(16, "label", 15);
    \u0275\u0275text(17, "Tipo de certificado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "select", 16)(19, "option", 17);
    \u0275\u0275text(20, "Selecciona un tipo");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(21, FormularioCertificadoComponent_Conditional_5_Conditional_0_For_22_Template, 2, 2, "option", 17, _forTrack05);
    \u0275\u0275elementEnd();
    \u0275\u0275template(23, FormularioCertificadoComponent_Conditional_5_Conditional_0_Conditional_23_Template, 2, 0, "p");
    \u0275\u0275elementStart(24, "label", 18);
    \u0275\u0275text(25, "Fecha de emisi\xF3n (opcional)");
    \u0275\u0275elementEnd();
    \u0275\u0275element(26, "input", 19);
    \u0275\u0275template(27, FormularioCertificadoComponent_Conditional_5_Conditional_0_Conditional_27_Template, 2, 0, "small", 20)(28, FormularioCertificadoComponent_Conditional_5_Conditional_0_Conditional_28_Template, 2, 0, "small", 20)(29, FormularioCertificadoComponent_Conditional_5_Conditional_0_Conditional_29_Template, 2, 0, "small", 20);
    \u0275\u0275elementStart(30, "label", 21);
    \u0275\u0275text(31, "Estado administrativo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "select", 22)(33, "option", 17);
    \u0275\u0275text(34, "Activo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "option", 17);
    \u0275\u0275text(36, "Inactivo");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(37, FormularioCertificadoComponent_Conditional_5_Conditional_0_Conditional_37_Template, 2, 1, "small");
    \u0275\u0275elementStart(38, "p", 23);
    \u0275\u0275text(39, "Se registra el certificado sin generar un documento oficial. Laravel a\xFAn no expone la elegibilidad para emisi\xF3n: la asistencia, aprobaci\xF3n o culminaci\xF3n del origen no quedan acreditadas por este registro.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(40, "div", 24);
    \u0275\u0275template(41, FormularioCertificadoComponent_Conditional_5_Conditional_0_Conditional_41_Template, 2, 0, "button", 25);
    \u0275\u0275elementStart(42, "button", 26);
    \u0275\u0275text(43);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(44, "button", 27);
    \u0275\u0275listener("click", function FormularioCertificadoComponent_Conditional_5_Conditional_0_Template_button_click_44_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.cancelar());
    });
    \u0275\u0275text(45, "Cancelar");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_20_0;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("formGroup", ctx_r0.formulario);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.integrado() && ctx_r0.paso() === 1 ? "Seleccionar origen y registro" : "Preparar certificado");
    \u0275\u0275advance();
    \u0275\u0275property("hidden", ctx_r0.integrado() && ctx_r0.paso() !== 1);
    \u0275\u0275advance(6);
    \u0275\u0275conditional(ctx_r0.auth.tienePermiso("participantes.ver") ? 9 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.auth.tienePermiso("practicantes.ver") ? 10 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.auth.tienePermiso("reconocimientos.ver") ? 11 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.formulario.controls.origen.touched && ctx_r0.formulario.controls.origen.invalid ? 12 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.formulario.controls.origen.value ? 13 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("hidden", ctx_r0.integrado() && ctx_r0.paso() !== 2);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.integrado() ? 15 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275property("ngValue", null);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r0.tipos());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx_r0.cargando() && ctx_r0.tipos().length === 0 ? 23 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r0.formulario.controls.fechaEmision.touched && ctx_r0.formulario.controls.fechaEmision.invalid ? 27 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.formulario.controls.tipo.touched && ctx_r0.formulario.controls.tipo.invalid ? 28 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.formulario.controls.registro.touched && ctx_r0.formulario.controls.registro.invalid ? 29 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275property("ngValue", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngValue", false);
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_20_0 = ctx_r0.erroresValidacion()["fecha_emision"]) ? 37 : -1, tmp_20_0);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r0.integrado() && ctx_r0.paso() === 2 ? 41 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.cargando() || ctx_r0.cargandoOrigen() || ctx_r0.comprobando());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.comprobando() ? "Comprobando duplicados\u2026" : ctx_r0.integrado() ? "Siguiente" : "Revisar datos");
  }
}
function FormularioCertificadoComponent_Conditional_5_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 6)(1, "h2");
    \u0275\u0275text(2, "Revisa antes de registrar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "dl")(4, "dt");
    \u0275\u0275text(5, "Origen");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "dd");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "dt");
    \u0275\u0275text(9, "Registro");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "dd");
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "dt");
    \u0275\u0275text(13, "Beneficiario");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "dd");
    \u0275\u0275text(15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "dt");
    \u0275\u0275text(17, "Tipo de certificado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "dd");
    \u0275\u0275text(19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "dt");
    \u0275\u0275text(21, "Fecha de emisi\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "dd");
    \u0275\u0275text(23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "dt");
    \u0275\u0275text(25, "Estado administrativo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "dd");
    \u0275\u0275text(27);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(28, "div", 24)(29, "button", 33);
    \u0275\u0275listener("click", function FormularioCertificadoComponent_Conditional_5_Conditional_1_Template_button_click_29_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.guardar());
    });
    \u0275\u0275text(30);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "button", 27);
    \u0275\u0275listener("click", function FormularioCertificadoComponent_Conditional_5_Conditional_1_Template_button_click_31_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.volverEditar());
    });
    \u0275\u0275text(32, "Volver a editar");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r0.nombreOrigen(ctx_r0.formulario.controls.origen.value));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", ctx_r0.tituloSeleccionado(), " \xB7 #", ctx_r0.formulario.controls.registro.value, "");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.beneficiario());
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.nombreTipo(ctx_r0.formulario.controls.tipo.value));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.formulario.controls.fechaEmision.value);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.formulario.controls.estado.value ? "Activo" : "Inactivo");
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.guardando() || !ctx_r0.escrituraAutorizada);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.guardando() ? "Guardando\u2026" : ctx_r0.editarId ? "Guardar cambios" : "Registrar certificado");
  }
}
function FormularioCertificadoComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, FormularioCertificadoComponent_Conditional_5_Conditional_0_Template, 46, 21, "form", 5)(1, FormularioCertificadoComponent_Conditional_5_Conditional_1_Template, 33, 9, "section", 6);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r0.integrado() || !ctx_r0.revision() ? 0 : 1);
  }
}
function fechaCalendario(control) {
  const valor = String(control.value ?? "");
  if (!valor)
    return null;
  const fecha = new Date(valor);
  return /^\d{4}-\d{2}-\d{2}$/.test(valor) && !Number.isNaN(fecha.getTime()) && fecha.toISOString().slice(0, 10) === valor ? null : { fechaInvalida: true };
}
var FormularioCertificadoComponent = class _FormularioCertificadoComponent {
  integrado = input(false);
  paso = input(1);
  cambioPaso = output();
  preparado = output();
  cancelado = output();
  falloGuardado = output();
  puedeGuardarPreparacion() {
    return this.escrituraAutorizada && this.revision() && !this.guardando() && this.formulario.valid;
  }
  escrituraAutorizada = inject(ESCRITURA_EMISION_AUTORIZADA);
  bloqueoEscritura = BLOQUEO_ESCRITURA_EMISION;
  api = inject(EmisionCertificadosService);
  personas = inject(PersonService);
  auth = inject(AuthService);
  fb = inject(FormBuilder);
  router = inject(Router);
  destroyRef = inject(DestroyRef);
  route = inject(ActivatedRoute);
  editarId = Number(this.route.snapshot.queryParamMap.get("editar") ?? this.route.snapshot.paramMap.get("id")) || null;
  certificadoOriginal = null;
  registroEditarPendiente = null;
  cargaOrigen;
  cargaPersona;
  comprobando = signal(false);
  busquedaBeneficiario = new FormControl("", { nonNullable: true });
  buscandoPersonas = signal(false);
  nombresOrigen = signal(/* @__PURE__ */ new Map());
  idsEncontrados = signal(null);
  opcionesVisibles = computed(() => this.opciones().filter((opcion) => !this.idsEncontrados() || this.idsEncontrados()?.has(opcion.idPersona ?? 0)));
  formulario = this.fb.nonNullable.group({
    origen: this.fb.nonNullable.control("", Validators.required),
    registro: this.fb.control(null, Validators.required),
    tipo: this.fb.control(null, Validators.required),
    fechaEmision: this.fb.nonNullable.control("", fechaCalendario),
    estado: this.fb.nonNullable.control(true)
  });
  tipos = signal([]);
  opciones = signal([]);
  beneficiario = signal(null);
  error = signal(null);
  erroresValidacion = signal({});
  cargando = signal(false);
  cargandoOrigen = signal(false);
  guardando = signal(false);
  revision = signal(false);
  accesible = computed(() => this.auth.tienePermiso(this.editarId ? "emision.editar" : "emision.crear"));
  constructor() {
    this.formulario.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.revision.set(false));
    afterNextRender(() => this.inicializar());
  }
  inicializar() {
    this.cargando.set(true);
    this.auth.cargarSesion().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (autenticado) => {
        if (!autenticado) {
          this.error.set("No se pudo confirmar tu sesi\xF3n. Vuelve a iniciar sesi\xF3n e int\xE9ntalo otra vez.");
          this.cargando.set(false);
          return;
        }
        const permiso = this.editarId ? "emision.editar" : "emision.crear";
        if (!this.auth.tienePermiso(permiso)) {
          this.error.set(`Tu sesi\xF3n no incluye el permiso institucional ${permiso}. Solicita que asignen este permiso al rol correspondiente en Roles y Permisos.`);
          this.cargando.set(false);
          return;
        }
        this.cargarCatalogos();
      },
      error: () => {
        this.error.set("No se pudo cargar la sesi\xF3n institucional.");
        this.cargando.set(false);
      }
    });
  }
  cargarCatalogos() {
    this.cargando.set(true);
    this.api.listarTodos("tipos-certificado").pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (tipos) => {
        this.tipos.set(tipos.filter((tipo) => estadoActivo(tipo.estado)));
        this.cargando.set(false);
      },
      error: (error) => {
        this.error.set(error.mensaje);
        this.cargando.set(false);
      }
    });
    this.formulario.controls.origen.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((origen) => this.cargarOrigen(origen));
    this.formulario.controls.registro.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((id) => this.resolverBeneficiario(id));
    if (this.editarId)
      this.cargarCertificadoParaEditar(this.editarId);
  }
  cargarCertificadoParaEditar(id) {
    this.cargando.set(true);
    this.api.obtener("certificados", id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (certificado) => {
        this.certificadoOriginal = certificado;
        const origen = certificado.id_participacion ? "participacion" : certificado.id_practica ? "practica" : certificado.id_reconocimiento ? "reconocimiento" : "";
        this.registroEditarPendiente = certificado.id_participacion ?? certificado.id_practica ?? certificado.id_reconocimiento;
        this.formulario.patchValue({ tipo: certificado.id_tipo_certificado, fechaEmision: certificado.fecha_emision ?? "", estado: estadoActivo(certificado.estado), origen });
        this.cargando.set(false);
      },
      error: (error) => {
        this.error.set(error.mensaje);
        this.cargando.set(false);
      }
    });
  }
  cargarOrigen(origen) {
    this.idsEncontrados.set(null);
    this.busquedaBeneficiario.reset();
    this.nombresOrigen.set(/* @__PURE__ */ new Map());
    this.cargaOrigen?.unsubscribe();
    this.cargaPersona?.unsubscribe();
    this.cargandoOrigen.set(false);
    this.registroEditarPendiente = this.certificadoOriginal && !this.opciones().length ? this.registroEditarPendiente : null;
    this.formulario.controls.registro.reset(null);
    this.opciones.set([]);
    this.beneficiario.set(null);
    this.error.set(null);
    if (!origen)
      return;
    const permiso = origen === "participacion" ? "participantes.ver" : origen === "practica" ? "practicantes.ver" : "reconocimientos.ver";
    if (!this.auth.tienePermiso(permiso)) {
      this.error.set(`No tienes el permiso ${permiso} para consultar registros de este origen.`);
      return;
    }
    this.cargandoOrigen.set(true);
    const llamada = origen === "participacion" ? this.api.relacionRegistros("participation") : origen === "practica" ? this.api.relacionRegistros("practices/list") : this.api.listarTodos("reconocimientos");
    this.cargaOrigen = forkJoin({
      registros: llamada.pipe(catchError((error) => {
        this.error.set(error.mensaje);
        return of(null);
      })),
      practicantes: origen === "practica" && this.auth.tienePermiso("practicantes.ver") ? this.api.relacionRegistros("practicing-individuals/list").pipe(catchError((error) => {
        this.error.set(error.mensaje);
        return of(null);
      })) : of([]),
      trabajadores: origen === "reconocimiento" && this.auth.tienePermiso("ponentes-firmantes.ver") ? this.api.relacionRegistros("person-workers/list").pipe(catchError((error) => {
        this.error.set(error.mensaje);
        return of(null);
      })) : of([])
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(({ registros, practicantes, trabajadores }) => {
      if (!registros) {
        this.cargandoOrigen.set(false);
        return;
      }
      if (origen === "practica" && !practicantes || origen === "reconocimiento" && !trabajadores) {
        this.cargandoOrigen.set(false);
        return;
      }
      const filas = registros;
      const personaPracticante = /* @__PURE__ */ new Map();
      for (const fila of practicantes ?? [])
        personaPracticante.set(Number(fila["id_persona_practicante"]), Number(fila["id_persona"]));
      const personaTrabajador = /* @__PURE__ */ new Map();
      for (const fila of trabajadores ?? [])
        personaTrabajador.set(Number(fila["id_persona_trabajador"]), Number(fila["id_persona"]));
      const opciones = [];
      for (const fila of filas) {
        const id = Number(fila[`id_${origen}`]);
        const idPersona = origen === "participacion" ? Number(fila["id_persona"]) : origen === "practica" ? personaPracticante.get(Number(fila["id_persona_practicante"])) ?? null : personaTrabajador.get(Number(fila["id_persona_trabajador"])) ?? null;
        if (!Number.isSafeInteger(id) || id <= 0 || !Number.isSafeInteger(idPersona) || (idPersona ?? 0) <= 0)
          continue;
        const titulo = origen === "practica" ? String(fila["carrera"] ?? `Pr\xE1ctica #${id}`) : origen === "reconocimiento" ? String(fila["titulo"] ?? `Reconocimiento #${id}`) : `Participaci\xF3n #${id} \xB7 Actividad #${fila["id_actividad"] ?? "no disponible"}`;
        opciones.push({ id, titulo, idPersona });
      }
      this.opciones.set(opciones);
      this.cargandoOrigen.set(false);
      if (this.registroEditarPendiente !== null && opciones.some((opcion) => opcion.id === this.registroEditarPendiente)) {
        this.formulario.controls.registro.setValue(this.registroEditarPendiente);
        this.registroEditarPendiente = null;
      }
      if (!opciones.length && !this.error())
        this.error.set("No hay registros disponibles cuyo beneficiario pueda verificarse con tus permisos.");
    });
  }
  resolverBeneficiario(id) {
    this.cargaPersona?.unsubscribe();
    this.beneficiario.set(null);
    const fila = this.opciones().find((opcion) => opcion.id === Number(id));
    if (!fila?.idPersona)
      return;
    this.cargaPersona = this.api.personaReconocimiento(fila.idPersona).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (persona) => this.beneficiario.set([persona.nombres, persona.apellido_paterno, persona.apellido_materno].filter(Boolean).join(" ")),
      error: (error) => this.error.set("No se pudo verificar la persona beneficiaria: " + error.mensaje)
    });
  }
  buscarBeneficiario() {
    const texto = this.busquedaBeneficiario.value.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (!texto) {
      this.idsEncontrados.set(null);
      return;
    }
    if (!this.auth.tienePermiso("personas.verpersonas") || this.buscandoPersonas())
      return;
    this.buscandoPersonas.set(true);
    this.personas.listar().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (personas) => {
        const nombres = new Map(personas.map((persona) => [persona.id_persona, [persona.nombres, persona.apellido_paterno, persona.apellido_materno].filter(Boolean).join(" ")]));
        this.nombresOrigen.set(nombres);
        this.idsEncontrados.set(new Set([...nombres].filter(([, nombre]) => nombre.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(texto)).map(([id]) => id)));
        this.buscandoPersonas.set(false);
      },
      error: () => {
        this.error.set("No se pudo consultar el cat\xE1logo autorizado de personas. Revisa tu conexi\xF3n y permisos.");
        this.buscandoPersonas.set(false);
      }
    });
  }
  prepararRevision() {
    if (this.comprobando() || this.cargando() || this.cargandoOrigen())
      return;
    this.error.set(null);
    this.formulario.markAllAsTouched();
    const registro = this.opciones().find((opcion) => opcion.id === this.formulario.controls.registro.value);
    if (this.formulario.invalid || !registro || !registro.idPersona || !this.tipos().some((tipo) => tipo.id_tipo_certificado === this.formulario.controls.tipo.value)) {
      this.error.set("Completa los campos requeridos y selecciona un registro y tipo existentes.");
      return;
    }
    if (!this.beneficiario()) {
      this.error.set("No se puede verificar el beneficiario con los permisos disponibles.");
      return;
    }
    const valores = this.formulario.getRawValue();
    this.comprobando.set(true);
    this.api.listarTodos("certificados", {
      id_persona: registro.idPersona,
      id_tipo_certificado: valores.tipo,
      [`id_${valores.origen}`]: registro.id
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (certificados) => {
        this.comprobando.set(false);
        if (JSON.stringify(valores) !== JSON.stringify(this.formulario.getRawValue()))
          return;
        const existente = certificados.find((certificado) => certificado.id_certificado !== this.editarId);
        if (this.integrado() && existente) {
          this.preparado.emit({ registro: existente, beneficiario: this.beneficiario(), tipo: this.nombreTipo(existente.id_tipo_certificado), dni: null });
          return;
        }
        if (certificados.some((certificado) => certificado.id_certificado !== this.editarId)) {
          this.error.set("Ya existe un certificado para este beneficiario, tipo y origen. Consulta su detalle para gestionar el documento.");
          return;
        }
        if (JSON.stringify(valores) === JSON.stringify(this.formulario.getRawValue())) {
          this.revision.set(true);
          if (this.integrado())
            this.preparado.emit({
              registro: __spreadValues({ id_certificado: this.editarId }, this.payloadPreparacion()),
              beneficiario: this.beneficiario(),
              tipo: this.nombreTipo(valores.tipo),
              dni: null
            });
        }
      },
      error: (error) => {
        this.comprobando.set(false);
        this.error.set(error.mensaje);
      }
    });
  }
  guardar() {
    if (!this.escrituraAutorizada || !this.revision() || this.guardando() || !this.accesible() || this.formulario.invalid || !this.beneficiario())
      return;
    const payload = this.payloadPreparacion();
    if (!payload || !this.tipos().some((item) => item.id_tipo_certificado === payload.id_tipo_certificado))
      return;
    this.guardando.set(true);
    this.error.set(null);
    this.erroresValidacion.set({});
    const guardado = this.editarId ? this.api.actualizar("certificados", this.editarId, payload) : this.api.crear("certificados", payload);
    guardado.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (creado) => {
        this.guardando.set(false);
        this.revision.set(false);
        if (this.integrado()) {
          this.certificadoOriginal = creado;
          this.preparado.emit({ registro: creado, beneficiario: this.beneficiario(), tipo: this.nombreTipo(creado.id_tipo_certificado), dni: null });
        } else
          void this.router.navigate(["/certificaciones/certificados", creado.id_certificado]);
      },
      error: (error) => {
        this.guardando.set(false);
        this.error.set(error.mensaje);
        this.erroresValidacion.set(error.errores);
        this.revision.set(false);
        this.falloGuardado.emit(error.mensaje);
      }
    });
  }
  cancelar() {
    if (this.integrado())
      this.cancelado.emit();
    else
      void this.router.navigateByUrl("/certificaciones/generar-emitir");
  }
  siguienteOrigen() {
    this.formulario.controls.origen.markAsTouched();
    this.formulario.controls.registro.markAsTouched();
    if (this.cargando() || this.cargandoOrigen() || !this.beneficiario() || !this.opciones().some((item) => item.id === this.formulario.controls.registro.value)) {
      this.error.set("Selecciona un origen y un registro con beneficiario verificado.");
      return;
    }
    this.cambioPaso.emit(2);
  }
  payloadPreparacion() {
    const { origen, registro, tipo, fechaEmision, estado } = this.formulario.getRawValue();
    const persona = this.opciones().find((item) => item.id === registro)?.idPersona;
    if (!persona || !tipo || !origen)
      return null;
    return {
      id_persona: persona,
      id_tipo_certificado: tipo,
      id_participacion: origen === "participacion" ? registro : null,
      id_practica: origen === "practica" ? registro : null,
      id_reconocimiento: origen === "reconocimiento" ? registro : null,
      fecha_emision: fechaEmision || null,
      estado,
      notificado: this.certificadoOriginal?.notificado ?? false,
      fecha_notificacion: this.certificadoOriginal?.fecha_notificacion ?? null
    };
  }
  nombreTipo(id) {
    return this.tipos().find((tipo) => tipo.id_tipo_certificado === id)?.nombre_tipo ?? "\u2014";
  }
  nombreOrigen(origen) {
    return origen ? { participacion: "Participaci\xF3n", practica: "Pr\xE1ctica", reconocimiento: "Reconocimiento" }[origen] : "\u2014";
  }
  tituloSeleccionado() {
    return this.opciones().find((opcion) => opcion.id === this.formulario.controls.registro.value)?.titulo ?? "\u2014";
  }
  volverEditar() {
    this.revision.set(false);
  }
  mensajesValidacion() {
    return Object.values(this.erroresValidacion()).flat();
  }
  static \u0275fac = function FormularioCertificadoComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FormularioCertificadoComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FormularioCertificadoComponent, selectors: [["app-formulario-certificado"]], inputs: { integrado: [1, "integrado"], paso: [1, "paso"] }, outputs: { cambioPaso: "cambioPaso", preparado: "preparado", cancelado: "cancelado", falloGuardado: "falloGuardado" }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 6, vars: 6, consts: [["role", "status"], ["role", "alert", 1, "alert", "alert-error"], ["role", "status", 1, "alert", "alert-advertencia"], [3, "title"], ["routerLink", "/certificaciones/certificados", 1, "btn"], ["novalidate", "", 1, "card", "formulario", 3, "formGroup"], [1, "card"], ["novalidate", "", 1, "card", "formulario", 3, "ngSubmit", "formGroup"], [3, "hidden"], ["for", "origen"], ["id", "origen", "formControlName", "origen", 1, "input"], ["value", ""], ["value", "participacion"], ["value", "practica"], ["value", "reconocimiento"], ["for", "tipo"], ["id", "tipo", "formControlName", "tipo", 1, "input"], [3, "ngValue"], ["for", "fecha"], ["id", "fecha", "type", "date", "formControlName", "fechaEmision", 1, "input"], ["role", "alert", 1, "error-text"], ["for", "estado-preparacion"], ["id", "estado-preparacion", "formControlName", "estado", 1, "input"], [1, "nota"], [1, "acciones"], ["type", "button", 1, "btn"], ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"], ["type", "button", 1, "btn", 3, "click"], ["for", "buscar-beneficiario"], ["id", "buscar-beneficiario", "type", "search", 1, "input", 3, "formControl"], ["type", "button", 1, "btn", 3, "click", "disabled"], ["for", "registro"], ["id", "registro", "formControlName", "registro", 1, "input"], ["type", "button", 1, "btn", "btn-primary", 3, "click", "disabled"]], template: function FormularioCertificadoComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275template(0, FormularioCertificadoComponent_Conditional_0_Template, 3, 1)(1, FormularioCertificadoComponent_Conditional_1_Template, 2, 0, "p", 0)(2, FormularioCertificadoComponent_Conditional_2_Template, 2, 1, "p", 1)(3, FormularioCertificadoComponent_Conditional_3_Template, 6, 0, "div", 1)(4, FormularioCertificadoComponent_Conditional_4_Template, 2, 1, "p", 2)(5, FormularioCertificadoComponent_Conditional_5_Template, 2, 1);
    }
    if (rf & 2) {
      \u0275\u0275conditional(!ctx.integrado() ? 0 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.cargando() ? 1 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.error() ? 2 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.mensajesValidacion().length ? 3 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.escrituraAutorizada ? 4 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.accesible() ? 5 : -1);
    }
  }, dependencies: [ReactiveFormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, FormControlDirective, FormGroupDirective, FormControlName, RouterLink, PageTitleComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.encabezado[_ngcontent-%COMP%], \n.acciones[_ngcontent-%COMP%], \n.paginacion[_ngcontent-%COMP%], \n.filtros[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: var(--espacio-3);\n}\n.encabezado[_ngcontent-%COMP%] {\n  justify-content: space-between;\n  margin-bottom: var(--espacio-4);\n}\n.acciones[_ngcontent-%COMP%], \n.filtros[_ngcontent-%COMP%], \n.paginacion[_ngcontent-%COMP%] {\n  margin-block: var(--espacio-4);\n}\n.tabla[_ngcontent-%COMP%] {\n  overflow-x: auto;\n}\n.grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));\n  gap: var(--espacio-4);\n}\n.form-field[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.detalle[_ngcontent-%COMP%] {\n  margin-block: var(--espacio-5);\n}\ndt[_ngcontent-%COMP%] {\n  color: var(--neutro-500);\n  font-size: 0.875rem;\n}\ndd[_ngcontent-%COMP%] {\n  margin: 0 0 var(--espacio-3);\n  overflow-wrap: anywhere;\n}\n.nota[_ngcontent-%COMP%] {\n  color: var(--neutro-700);\n  font-size: 0.875rem;\n}\n.table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  overflow-wrap: anywhere;\n}\n.errores[_ngcontent-%COMP%] {\n  color: var(--color-error);\n}\n.reconocimiento[_ngcontent-%COMP%] {\n  border-top: 3px solid var(--boton-dorado);\n  overflow-wrap: anywhere;\n}\n.reconocimiento[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin-top: var(--espacio-4);\n  font-size: 1.25rem;\n}\n/*# sourceMappingURL=emision.css.map */", "\n\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\n.formulario[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: block;\n  margin: 1rem 0 0.4rem;\n  font-weight: 600;\n}\n.formulario[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  display: block;\n  margin-top: 0.35rem;\n  color: var(--color-error);\n}\n.formulario[_ngcontent-%COMP%]   .input[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.formulario[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  color: #075a9b;\n}\n/*# sourceMappingURL=formulario-certificado.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FormularioCertificadoComponent, { className: "FormularioCertificadoComponent", filePath: "src\\app\\pages\\emision-certificados\\certificados\\formulario-certificado\\formulario-certificado.component.ts", lineNumber: 33 });
})();

// src/app/pages/emision-certificados/certificados/listar-certificados/listar-certificados.component.ts
var _forTrack06 = ($index, $item) => $item.id_tipo_certificado;
var _forTrack13 = ($index, $item) => $item.registro.id_certificado;
var _forTrack2 = ($index, $item) => $item.id_certificado_documento;
var _c0 = (a0) => ["/certificaciones/certificados", a0];
var _c1 = (a0) => ["/certificaciones/certificados", a0, "editar"];
function ListarCertificadosComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-page-title", 1);
  }
}
function ListarCertificadosComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 2);
    \u0275\u0275text(1, "Preparar certificado");
    \u0275\u0275elementEnd();
  }
}
function ListarCertificadosComponent_For_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 11);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tipo_r1 = ctx.$implicit;
    \u0275\u0275property("value", tipo_r1.id_tipo_certificado);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(tipo_r1.nombre_tipo);
  }
}
function ListarCertificadosComponent_For_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const estado_r2 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(estado_r2);
  }
}
function ListarCertificadosComponent_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 17);
    \u0275\u0275text(1, "Cargando certificados y sus relaciones\u2026");
    \u0275\u0275elementEnd();
  }
}
function ListarCertificadosComponent_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 18);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function ListarCertificadosComponent_Conditional_42_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 19);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("No se pudieron consultar los DNI: ", ctx, "");
  }
}
function ListarCertificadosComponent_Conditional_43_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 22);
    \u0275\u0275text(1, "No hay certificados con estos filtros.");
    \u0275\u0275elementEnd();
  }
}
function ListarCertificadosComponent_Conditional_43_For_8_For_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 32);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const documento_r4 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", documento_r4.codigo_verificacion, " \xB7 ", documento_r4.estado, "");
  }
}
function ListarCertificadosComponent_Conditional_43_For_8_ForEmpty_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Sin documento generado ");
  }
}
function ListarCertificadosComponent_Conditional_43_For_8_Conditional_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 33);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function ListarCertificadosComponent_Conditional_43_For_8_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 37);
    \u0275\u0275listener("click", function ListarCertificadosComponent_Conditional_43_For_8_Conditional_41_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const item_r6 = \u0275\u0275nextContext().$implicit;
      const ctx_r6 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r6.seleccionar(item_r6));
    });
    \u0275\u0275text(1, "Seleccionar certificado");
    \u0275\u0275elementEnd();
  }
}
function ListarCertificadosComponent_Conditional_43_For_8_Conditional_44_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 36)(1, "span", 38);
    \u0275\u0275text(2, "edit");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(1, _c1, item_r6.registro.id_certificado));
  }
}
function ListarCertificadosComponent_Conditional_43_For_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 24)(1, "header", 27)(2, "span", 28);
    \u0275\u0275text(3, "workspace_premium");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 29);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 30)(7, "p", 31);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "h3");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "dl")(12, "dt");
    \u0275\u0275text(13, "DNI");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "dd");
    \u0275\u0275text(15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "dt");
    \u0275\u0275text(17, "Origen");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "dd");
    \u0275\u0275text(19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "dt");
    \u0275\u0275text(21, "Fecha de emisi\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "dd");
    \u0275\u0275text(23);
    \u0275\u0275pipe(24, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "dt");
    \u0275\u0275text(26, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "dd");
    \u0275\u0275text(28);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "dt");
    \u0275\u0275text(30, "Firmas registradas en documentos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "dd");
    \u0275\u0275text(32);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "dt");
    \u0275\u0275text(34, "Documentos y c\xF3digos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "dd");
    \u0275\u0275repeaterCreate(36, ListarCertificadosComponent_Conditional_43_For_8_For_37_Template, 2, 2, "p", 32, _forTrack2, false, ListarCertificadosComponent_Conditional_43_For_8_ForEmpty_38_Template, 1, 0);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(39, ListarCertificadosComponent_Conditional_43_For_8_Conditional_39_Template, 2, 1, "p", 33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "footer");
    \u0275\u0275template(41, ListarCertificadosComponent_Conditional_43_For_8_Conditional_41_Template, 2, 0, "button", 34);
    \u0275\u0275elementStart(42, "a", 35);
    \u0275\u0275text(43, "Ver detalle e historial");
    \u0275\u0275elementEnd();
    \u0275\u0275template(44, ListarCertificadosComponent_Conditional_43_For_8_Conditional_44_Template, 3, 3, "a", 36);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_20_0;
    const item_r6 = ctx.$implicit;
    const ctx_r6 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(item_r6.tipo);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Certificado #", item_r6.registro.id_certificado, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r6.beneficiario);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r6.dni()[item_r6.registro.id_persona] || "No disponible");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r6.nombreOrigen(item_r6.registro));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(item_r6.registro.fecha_emision ? \u0275\u0275pipeBind2(24, 13, item_r6.registro.fecha_emision, "dd/MM/yyyy") : "No informada");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r6.estadoRegistro(item_r6.registro.estado));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(item_r6.firmas === null ? "No se pudieron consultar" : item_r6.firmas ? item_r6.firmas + " registros; validez criptogr\xE1fica no informada" : "Sin firmas registradas");
    \u0275\u0275advance(4);
    \u0275\u0275repeater(item_r6.documentos);
    \u0275\u0275advance(3);
    \u0275\u0275conditional((tmp_20_0 = item_r6.errorDocumentos) ? 39 : -1, tmp_20_0);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r6.seleccionable() ? 41 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(16, _c0, item_r6.registro.id_certificado));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r6.auth.tienePermiso("emision.editar") && !item_r6.documentos.length && !item_r6.errorDocumentos ? 44 : -1);
  }
}
function ListarCertificadosComponent_Conditional_43_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 21)(1, "h2");
    \u0275\u0275text(2, "Certificados registrados");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 17);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(5, ListarCertificadosComponent_Conditional_43_Conditional_5_Template, 2, 0, "p", 22);
    \u0275\u0275elementStart(6, "div", 23);
    \u0275\u0275repeaterCreate(7, ListarCertificadosComponent_Conditional_43_For_8_Template, 45, 18, "article", 24, _forTrack13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "nav", 25)(10, "button", 26);
    \u0275\u0275listener("click", function ListarCertificadosComponent_Conditional_43_Template_button_click_10_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r6 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r6.pagina.set(ctx_r6.pagina() - 1));
    });
    \u0275\u0275text(11, "Anterior");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "span");
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "button", 26);
    \u0275\u0275listener("click", function ListarCertificadosComponent_Conditional_43_Template_button_click_14_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r6 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r6.pagina.set(ctx_r6.pagina() + 1));
    });
    \u0275\u0275text(15, "Siguiente");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r6 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("", ctx_r6.certificados().length, " registros");
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r6.certificados().length ? 5 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r6.visibles());
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r6.pagina() <= 1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("P\xE1gina ", ctx_r6.pagina(), " de ", ctx_r6.totalPaginas(), "");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r6.pagina() >= ctx_r6.totalPaginas());
  }
}
var ListarCertificadosComponent = class _ListarCertificadosComponent {
  seleccionable = input(false);
  seleccionado = output();
  api = inject(EmisionCertificadosService);
  destroyRef = inject(DestroyRef);
  auth = inject(AuthService);
  carga;
  filas = signal([]);
  dni = signal({});
  errorDni = signal(null);
  error = signal(null);
  cargando = signal(false);
  pagina = signal(1);
  filtroBeneficiario = new FormControl("", { nonNullable: true });
  filtroTipo = new FormControl("", { nonNullable: true });
  filtroOrigen = new FormControl("", { nonNullable: true });
  filtroEstado = new FormControl("", { nonNullable: true });
  busqueda = toSignal(this.filtroBeneficiario.valueChanges, { initialValue: "" });
  tipo = toSignal(this.filtroTipo.valueChanges, { initialValue: "" });
  origen = toSignal(this.filtroOrigen.valueChanges, { initialValue: "" });
  estado = toSignal(this.filtroEstado.valueChanges, { initialValue: "" });
  tipos = signal([]);
  estados = computed(() => [...new Set(this.filas().map((fila) => etiquetaEstado(fila.registro.estado)))]);
  certificados = computed(() => {
    const texto = this.normalizar(this.busqueda());
    return this.filas().filter((fila) => (!this.tipo() || String(fila.registro.id_tipo_certificado) === this.tipo()) && (!this.origen() || this.nombreOrigen(fila.registro) === this.origen()) && (!this.estado() || etiquetaEstado(fila.registro.estado) === this.estado()) && (!texto || this.normalizar([fila.beneficiario, this.dni()[fila.registro.id_persona] ?? "", ...fila.documentos.map((d) => d.codigo_verificacion)].join(" ")).includes(texto)));
  });
  totalPaginas = computed(() => Math.max(1, Math.ceil(this.certificados().length / 12)));
  visibles = computed(() => this.certificados().slice((this.pagina() - 1) * 12, this.pagina() * 12));
  estadoRegistro = etiquetaEstado;
  constructor() {
    inject(CambiosCertificadosService).cambios$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.cargar());
    afterNextRender(() => this.cargar());
    for (const control of [this.filtroBeneficiario, this.filtroTipo, this.filtroOrigen, this.filtroEstado]) {
      control.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.pagina.set(1));
    }
  }
  cargar() {
    this.carga?.unsubscribe();
    this.filas.set([]);
    this.dni.set({});
    this.error.set(null);
    this.errorDni.set(null);
    this.pagina.set(1);
    if (!this.auth.tienePermiso("emision.ver")) {
      this.error.set("No tienes permiso para consultar certificados.");
      return;
    }
    this.cargando.set(true);
    this.carga = forkJoin({
      certificados: this.api.listarTodos("certificados"),
      tipos: this.api.listarTodos("tipos-certificado"),
      dni: this.api.documentosIdentidad().pipe(catchError((error) => {
        this.errorDni.set(error.mensaje);
        return of({});
      }))
    }).pipe(switchMap(({ certificados, tipos, dni }) => {
      this.tipos.set(tipos);
      this.dni.set(dni);
      return from([...new Set(certificados.map((fila) => fila.id_persona))]).pipe(mergeMap((id) => this.api.personaReconocimiento(id).pipe(map((persona) => ({ id, nombre: [persona.nombres, persona.apellido_paterno, persona.apellido_materno].filter(Boolean).join(" ") })), catchError((error) => of({ id, nombre: "Persona #" + id + " \xB7 " + error.mensaje }))), 4), toArray(), switchMap((personas) => from(certificados).pipe(mergeMap((registro) => this.api.listarTodos("certificados-documentos", { id_certificado: registro.id_certificado }).pipe(switchMap((documentos) => (documentos.length ? forkJoin(documentos.map((documento) => this.api.listarTodos("certificados-firmas", { id_certificado_documento: documento.id_certificado_documento }))) : of([])).pipe(map((firmas) => ({ documentos, firmas: firmas.reduce((total, filas) => total + filas.length, 0), errorDocumentos: null })), catchError((error) => of({ documentos, firmas: null, errorDocumentos: "Firmas: " + error.mensaje })))), catchError((error) => of({ documentos: [], firmas: null, errorDocumentos: error.mensaje })), map((relaciones) => __spreadValues({
        registro,
        beneficiario: personas.find((persona) => persona.id === registro.id_persona)?.nombre ?? "Nombre no disponible",
        tipo: tipos.find((tipo) => tipo.id_tipo_certificado === registro.id_tipo_certificado)?.nombre_tipo ?? "Tipo #" + registro.id_tipo_certificado
      }, relaciones))), 4), toArray())));
    }), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (filas) => {
        this.filas.set(filas.sort((a, b) => b.registro.id_certificado - a.registro.id_certificado));
        this.cargando.set(false);
      },
      error: (error) => {
        this.error.set(error.mensaje);
        this.cargando.set(false);
      }
    });
  }
  nombreOrigen(registro) {
    return registro.id_participacion ? "Participaci\xF3n" : registro.id_reconocimiento ? "Reconocimiento" : registro.id_practica ? "Pr\xE1cticas" : "Sin origen";
  }
  seleccionar(item) {
    this.seleccionado.emit({ registro: item.registro, beneficiario: item.beneficiario, tipo: item.tipo, dni: this.dni()[item.registro.id_persona] ?? null });
  }
  limpiar() {
    for (const control of [this.filtroBeneficiario, this.filtroTipo, this.filtroOrigen, this.filtroEstado])
      control.reset();
  }
  normalizar(texto) {
    return texto.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
  }
  static \u0275fac = function ListarCertificadosComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ListarCertificadosComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ListarCertificadosComponent, selectors: [["app-listar-certificados"]], inputs: { seleccionable: [1, "seleccionable"] }, outputs: { seleccionado: "seleccionado" }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 46, vars: 11, consts: [[1, "encabezado"], ["title", "Preparar certificados"], ["routerLink", "/certificaciones/certificados/nuevo", 1, "btn", "btn-primary"], ["type", "button", 1, "btn", 3, "click", "disabled"], ["role", "search", 1, "card", "filtros-certificados", 3, "submit"], [1, "form-field"], ["for", "beneficiario"], ["id", "beneficiario", "type", "search", 1, "input", 3, "formControl"], ["for", "tipo"], ["id", "tipo", 1, "input", 3, "formControl"], ["value", ""], [3, "value"], ["for", "origen"], ["id", "origen", 1, "input", 3, "formControl"], ["for", "estado"], ["id", "estado", 1, "input", 3, "formControl"], ["type", "button", 1, "btn", 3, "click"], ["role", "status"], ["role", "alert", 1, "alert", "alert-error"], ["role", "alert", 1, "alert", "alert-advertencia"], [1, "nota"], [1, "encabezado", "resultados"], [1, "card", "vacio"], [1, "tarjetas-certificados"], [1, "certificado-card"], ["aria-label", "Paginaci\xF3n", 1, "acciones"], [1, "btn", 3, "click", "disabled"], [1, "cabecera-card"], ["aria-hidden", "true", 1, "material-symbols-outlined", "icono-tipo"], [1, "tipo"], [1, "contenido-card"], [1, "etiqueta"], [1, "codigo"], ["role", "alert"], ["type", "button", 1, "btn", "btn-primary"], [1, "btn", "btn-consulta", 3, "routerLink"], ["aria-label", "Editar", "title", "Editar", 1, "btn", "btn-icono", 3, "routerLink"], ["type", "button", 1, "btn", "btn-primary", 3, "click"], ["aria-hidden", "true", 1, "material-symbols-outlined"]], template: function ListarCertificadosComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275template(1, ListarCertificadosComponent_Conditional_1_Template, 1, 0, "app-page-title", 1)(2, ListarCertificadosComponent_Conditional_2_Template, 2, 0, "a", 2);
      \u0275\u0275elementStart(3, "button", 3);
      \u0275\u0275listener("click", function ListarCertificadosComponent_Template_button_click_3_listener() {
        return ctx.cargar();
      });
      \u0275\u0275text(4, "Actualizar");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(5, "form", 4);
      \u0275\u0275listener("submit", function ListarCertificadosComponent_Template_form_submit_5_listener($event) {
        return $event.preventDefault();
      });
      \u0275\u0275elementStart(6, "div", 5)(7, "label", 6);
      \u0275\u0275text(8, "Beneficiario, DNI o c\xF3digo");
      \u0275\u0275elementEnd();
      \u0275\u0275element(9, "input", 7);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "div", 5)(11, "label", 8);
      \u0275\u0275text(12, "Tipo de certificado");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "select", 9)(14, "option", 10);
      \u0275\u0275text(15, "Todos");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(16, ListarCertificadosComponent_For_17_Template, 2, 2, "option", 11, _forTrack06);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(18, "div", 5)(19, "label", 12);
      \u0275\u0275text(20, "Origen");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "select", 13)(22, "option", 10);
      \u0275\u0275text(23, "Todos");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "option");
      \u0275\u0275text(25, "Participaci\xF3n");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(26, "option");
      \u0275\u0275text(27, "Reconocimiento");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "option");
      \u0275\u0275text(29, "Pr\xE1cticas");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(30, "div", 5)(31, "label", 14);
      \u0275\u0275text(32, "Estado");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(33, "select", 15)(34, "option", 10);
      \u0275\u0275text(35, "Todos");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(36, ListarCertificadosComponent_For_37_Template, 2, 1, "option", null, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(38, "button", 16);
      \u0275\u0275listener("click", function ListarCertificadosComponent_Template_button_click_38_listener() {
        return ctx.limpiar();
      });
      \u0275\u0275text(39, "Limpiar");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(40, ListarCertificadosComponent_Conditional_40_Template, 2, 0, "p", 17)(41, ListarCertificadosComponent_Conditional_41_Template, 2, 1, "p", 18)(42, ListarCertificadosComponent_Conditional_42_Template, 2, 1, "p", 19)(43, ListarCertificadosComponent_Conditional_43_Template, 16, 6);
      \u0275\u0275elementStart(44, "p", 20);
      \u0275\u0275text(45, "Consulta los PDF almacenados desde el detalle. La generaci\xF3n provisional no acredita una emisi\xF3n oficial ni una firma criptogr\xE1fica.");
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_10_0;
      let tmp_11_0;
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.seleccionable() ? 1 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.seleccionable() && ctx.auth.tienePermiso("emision.crear") ? 2 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("disabled", ctx.cargando());
      \u0275\u0275advance(6);
      \u0275\u0275property("formControl", ctx.filtroBeneficiario);
      \u0275\u0275advance(4);
      \u0275\u0275property("formControl", ctx.filtroTipo);
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.tipos());
      \u0275\u0275advance(5);
      \u0275\u0275property("formControl", ctx.filtroOrigen);
      \u0275\u0275advance(12);
      \u0275\u0275property("formControl", ctx.filtroEstado);
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.estados());
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.cargando() ? 40 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_10_0 = ctx.error()) ? 41 : -1, tmp_10_0);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_11_0 = ctx.errorDni()) ? 42 : -1, tmp_11_0);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.cargando() && !ctx.error() ? 43 : -1);
    }
  }, dependencies: [RouterLink, PageTitleComponent, ReactiveFormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, FormControlDirective, DatePipe], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.encabezado[_ngcontent-%COMP%], \n.acciones[_ngcontent-%COMP%], \n.paginacion[_ngcontent-%COMP%], \n.filtros[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: var(--espacio-3);\n}\n.encabezado[_ngcontent-%COMP%] {\n  justify-content: space-between;\n  margin-bottom: var(--espacio-4);\n}\n.acciones[_ngcontent-%COMP%], \n.filtros[_ngcontent-%COMP%], \n.paginacion[_ngcontent-%COMP%] {\n  margin-block: var(--espacio-4);\n}\n.tabla[_ngcontent-%COMP%] {\n  overflow-x: auto;\n}\n.grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));\n  gap: var(--espacio-4);\n}\n.form-field[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.detalle[_ngcontent-%COMP%] {\n  margin-block: var(--espacio-5);\n}\ndt[_ngcontent-%COMP%] {\n  color: var(--neutro-500);\n  font-size: 0.875rem;\n}\ndd[_ngcontent-%COMP%] {\n  margin: 0 0 var(--espacio-3);\n  overflow-wrap: anywhere;\n}\n.nota[_ngcontent-%COMP%] {\n  color: var(--neutro-700);\n  font-size: 0.875rem;\n}\n.table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  overflow-wrap: anywhere;\n}\n.errores[_ngcontent-%COMP%] {\n  color: var(--color-error);\n}\n.reconocimiento[_ngcontent-%COMP%] {\n  border-top: 3px solid var(--boton-dorado);\n  overflow-wrap: anywhere;\n}\n.reconocimiento[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin-top: var(--espacio-4);\n  font-size: 1.25rem;\n}\n/*# sourceMappingURL=emision.css.map */", "\n\n.aviso-certificados[_ngcontent-%COMP%] {\n  display: grid;\n  gap: var(--espacio-1);\n  padding: var(--espacio-4);\n  border-left: 4px solid var(--boton-dorado);\n  background: var(--tintura-sol-claro);\n  color: var(--tintura-sol-texto);\n  border-radius: var(--radio-sm);\n}\n.filtros-certificados[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: end;\n  flex-wrap: wrap;\n  gap: var(--espacio-4);\n  margin-block: var(--espacio-5);\n}\n.filtros-certificados[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%] {\n  flex: 1 1 15rem;\n  margin: 0;\n}\n.filtros-certificados[_ngcontent-%COMP%]   .nota[_ngcontent-%COMP%] {\n  flex-basis: 100%;\n  margin: 0;\n}\n.resultados[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 1.125rem;\n  margin: 0;\n}\n.resultados[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], \n.etiqueta[_ngcontent-%COMP%] {\n  color: var(--neutro-500);\n  font-size: 0.8125rem;\n}\n.tarjetas-certificados[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));\n  gap: var(--espacio-5);\n}\n.certificado-card[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n  background: var(--neutro-0);\n  border: 1px solid var(--neutro-200);\n  border-top: 4px solid var(--boton-dorado);\n  border-radius: var(--radio-lg);\n  overflow: hidden;\n  overflow-wrap: anywhere;\n}\n.cabecera-card[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: var(--espacio-3);\n  padding: var(--espacio-4);\n  background: var(--boton-hover-suave);\n  color: var(--boton-azul);\n}\n.icono-tipo[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n}\n.tipo[_ngcontent-%COMP%] {\n  flex: 1;\n  font-weight: 600;\n}\n.contenido-card[_ngcontent-%COMP%] {\n  flex: 1;\n  padding: var(--espacio-5);\n}\nh3[_ngcontent-%COMP%] {\n  font-size: 1.125rem;\n  color: var(--boton-texto);\n}\n.etiqueta[_ngcontent-%COMP%] {\n  margin: 0 0 var(--espacio-2);\n}\n.titulo-documento[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: var(--boton-azul);\n}\n.descripcion[_ngcontent-%COMP%] {\n  color: var(--neutro-700);\n}\n.codigo[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n.estado-certificados[_ngcontent-%COMP%] {\n  color: var(--tintura-sol-texto);\n  font-size: 0.8125rem;\n  font-weight: 600;\n}\nfooter[_ngcontent-%COMP%] {\n  padding: var(--espacio-4) var(--espacio-5);\n  border-top: 1px solid var(--neutro-100);\n}\nfooter[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.pie-certificados[_ngcontent-%COMP%] {\n  margin-top: var(--espacio-5);\n}\n.vacio[_ngcontent-%COMP%] {\n  text-align: center;\n}\n@media (max-width: 480px) {\n  .encabezado[_ngcontent-%COMP%]    > .btn[_ngcontent-%COMP%], \n   .filtros-certificados[_ngcontent-%COMP%]    > .btn[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n}\n/*# sourceMappingURL=listar-certificados.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ListarCertificadosComponent, { className: "ListarCertificadosComponent", filePath: "src\\app\\pages\\emision-certificados\\certificados\\listar-certificados\\listar-certificados.component.ts", lineNumber: 30 });
})();

// src/app/core/security/url-documental.ts
function enlaceVerificacionSeguro(valor) {
  if (!valor)
    return null;
  try {
    const url = new URL(valor);
    if (url.username || url.password || !["http:", "https:"].includes(url.protocol))
      return null;
    if (environment.production && (url.protocol !== "https:" || ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) || url.hostname.endsWith(".localhost")))
      return null;
    return url.href;
  } catch {
    return null;
  }
}

// src/app/pages/emision-certificados/generar-emitir/estado-beneficiario.ts
function mismoContexto(b, r) {
  return Number(b.id_actividad) === Number(r.contexto.id_actividad) && (r.origen === "sesion" ? Number(b.id_sesion) === Number(r.contexto.id_sesion) && (b.id_actividad_sesion == null || Number(b.id_actividad_sesion) === Number(r.contexto.id_sesion)) : b.id_sesion === null);
}
function bloqueoEstructural(b, r) {
  return r.codigo_bloqueo_preparacion === "ESQUEMA_PREPARACION_NO_DISPONIBLE" || r.origen === "sesion" && (r.identidad_sesion_disponible === false || b.estado_generacion === "No determinable por esquema");
}
function estadoBeneficiario(b, r) {
  if (!mismoContexto(b, r))
    return "Estado no confirmado";
  if (b.id_certificado) {
    if (b.disponible_rrhh === true)
      return "Listo para entrega";
    if (b.pdf_confirmado === true)
      return "Revisi\xF3n confirmada";
    if (b.estado_documento === "PENDIENTE_FIRMA")
      return "Enviado a Gerencia";
    if (b.estado_documento === "PREPARADO")
      return "Pendiente de env\xEDo";
    if (b.estado_generacion !== "Emitido")
      return "Certificado preparado";
  }
  if (bloqueoEstructural(b, r))
    return "Preparaci\xF3n no disponible";
  const identidad = r.origen !== "sesion" || r.identidad_sesion_disponible === true;
  if (identidad && b.estado_generacion === "Emitido" && Number(b.id_certificado) > 0 && Number(b.id_certificado_documento) > 0)
    return "Emitido";
  if (identidad && r.preparacion_persistida === true && Number(b.id_preparacion) > 0)
    return "Preparado";
  if (!b.id_preparacion && !b.id_certificado && b.estado_generacion === "No generado")
    return "Pendiente de generaci\xF3n";
  return "Estado no informado";
}
function motivosPreparacion(r) {
  return r.motivos_bloqueo_preparacion ?? r.motivos_bloqueo ?? [];
}
function motivoEmision(b, r) {
  if (!mismoContexto(b, r))
    return "El contexto del beneficiario no est\xE1 confirmado.";
  if (bloqueoEstructural(b, r))
    return "La preparaci\xF3n de certificados por sesi\xF3n estar\xE1 disponible cuando se complete su estructura de datos";
  if (r.origen === "sesion" && r.finalizada === false)
    return "Sesi\xF3n pendiente de finalizar.";
  if (b.estado_elegibilidad !== "Elegible")
    return "Beneficiario pendiente de validaci\xF3n.";
  if (r.tipo_certificado_compatible !== true)
    return "Tipo de certificado incompatible o pendiente de confirmaci\xF3n.";
  if (r.puede_preparar !== true)
    return motivosPreparacion(r).join(" ") || "Laravel no permite preparar este certificado.";
  if (r.puede_emitir !== true || r.puede_generar_pdf !== true)
    return r.motivos_bloqueo_emision?.join(" ") || "Emisi\xF3n oficial pendiente.";
  return "La API actual no ofrece una operaci\xF3n de emisi\xF3n independiente para este origen.";
}

// src/app/pages/emision-certificados/generar-emitir/generar-emitir.component.ts
var _c02 = ["confirmacionEnvio"];
var _forTrack07 = ($index, $item) => $item["id_actividad"];
var _forTrack14 = ($index, $item) => $item["id_actividad_sesion"];
var _forTrack22 = ($index, $item) => $item.id_tipo_certificado;
var _forTrack3 = ($index, $item) => $item.origen + ":" + $item.id_actividad + ":" + $item.id_sesion;
var _forTrack4 = ($index, $item) => $item.id_participacion;
var _forTrack5 = ($index, $item) => $item.firma;
var _c12 = (a0) => ({ id_actividad: a0 });
var _c2 = () => ["sesion", "actividad"];
var _c3 = (a0) => ({ documento: a0 });
var _c4 = (a0) => ({ id_certificado: a0 });
function GenerarEmitirComponent_Conditional_0_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 14);
    \u0275\u0275listener("click", function GenerarEmitirComponent_Conditional_0_Conditional_4_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.cancelar());
    });
    \u0275\u0275elementStart(1, "span", 11);
    \u0275\u0275text(2, "arrow_back");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r2.generando());
  }
}
function GenerarEmitirComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "header", 1)(1, "span", 11);
    \u0275\u0275text(2, "workspace_premium");
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "app-page-title", 12);
    \u0275\u0275template(4, GenerarEmitirComponent_Conditional_0_Conditional_4_Template, 3, 1, "button", 13);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r2.seleccion() ? 4 : -1);
  }
}
function GenerarEmitirComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 2);
    \u0275\u0275text(1, "Selecciona nuevamente el ponente para continuar.");
    \u0275\u0275elementEnd();
  }
}
function GenerarEmitirComponent_Conditional_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 2);
    \u0275\u0275text(1, "Cargando certificado...");
    \u0275\u0275elementEnd();
  }
}
function GenerarEmitirComponent_Conditional_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 4);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.contexto().error);
  }
}
function GenerarEmitirComponent_Conditional_2_Conditional_3_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "Sesi\xF3n: ");
    \u0275\u0275elementStart(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p");
    \u0275\u0275text(7, "Estado registrado de la sesi\xF3n: ");
    \u0275\u0275elementStart(8, "strong");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const sesion_r4 = ctx;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(sesion_r4["nombre"]);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3(" \xB7 ", sesion_r4["fecha"] ? \u0275\u0275pipeBind2(5, 5, sesion_r4["fecha"], "dd/MM/yyyy") : "Fecha no disponible", " \xB7 ", sesion_r4["hora_inicio"], " \u2013 ", sesion_r4["hora_fin"], "");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(sesion_r4["estado"] || "No informado");
  }
}
function GenerarEmitirComponent_Conditional_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "h2");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Estado de la actividad: ");
    \u0275\u0275elementStart(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(6, GenerarEmitirComponent_Conditional_2_Conditional_3_Conditional_6_Template, 10, 8);
    \u0275\u0275elementStart(7, "p");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "a", 15)(10, "span", 11);
    \u0275\u0275text(11, "arrow_back");
    \u0275\u0275elementEnd();
    \u0275\u0275text(12, "Volver a actividad");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_6_0;
    const actividad_r5 = ctx;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(actividad_r5["nombre"]);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(actividad_r5["estado"] || "No informado");
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_6_0 = ctx_r2.contexto().sesion) ? 6 : -1, tmp_6_0);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.contexto().modalidad === "sesion" ? "Certificaci\xF3n por sesi\xF3n. La actividad puede continuar activa si la pol\xEDtica institucional lo permite." : "Certificaci\xF3n global de actividad. Requiere evaluar el cumplimiento global seg\xFAn las reglas institucionales.");
    \u0275\u0275advance();
    \u0275\u0275property("queryParams", \u0275\u0275pureFunction1(5, _c12, actividad_r5["id_actividad"]));
  }
}
function GenerarEmitirComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 3);
    \u0275\u0275template(1, GenerarEmitirComponent_Conditional_2_Conditional_1_Template, 2, 0, "p", 2)(2, GenerarEmitirComponent_Conditional_2_Conditional_2_Template, 2, 1, "p", 4)(3, GenerarEmitirComponent_Conditional_2_Conditional_3_Template, 13, 7);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.contexto().cargando ? 1 : ctx_r2.contexto().error ? 2 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_3_0 = ctx_r2.contexto().actividad) ? 3 : -1, tmp_3_0);
  }
}
function GenerarEmitirComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 4);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.contexto().error);
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-origenes-tabs", 18);
    \u0275\u0275listener("seleccion", function GenerarEmitirComponent_Conditional_4_Conditional_0_Template_app_origenes_tabs_seleccion_0_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.seleccionarOrigen($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("actual", ctx_r2.pestanaOrigen())("bloqueado", ctx_r2.operando() || ctx_r2.generando());
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "h2", 17);
    \u0275\u0275text(1, "Pendientes de certificaci\xF3n");
    \u0275\u0275elementEnd();
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_0_Conditional_1_Conditional_7_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 26);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const a_r9 = ctx.$implicit;
    \u0275\u0275property("value", a_r9["id_actividad"]);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(a_r9["nombre"]);
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_0_Conditional_1_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label");
    \u0275\u0275text(1, "Actividad");
    \u0275\u0275elementStart(2, "select", 24);
    \u0275\u0275listener("change", function GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_0_Conditional_1_Conditional_7_Template_select_change_2_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r2 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r2.cambiarActividadFiltro());
    });
    \u0275\u0275elementStart(3, "option", 25);
    \u0275\u0275text(4, "Todas las autorizadas");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(5, GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_0_Conditional_1_Conditional_7_For_6_Template, 2, 2, "option", 26, _forTrack07);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(5);
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r2.actividadesFiltro());
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "label");
    \u0275\u0275text(1, "\xC1mbito de Capacitaci\xF3n");
    \u0275\u0275elementStart(2, "select", 21)(3, "option", 22);
    \u0275\u0275text(4, "Por sesi\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "option", 23);
    \u0275\u0275text(6, "Global por actividad");
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(7, GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_0_Conditional_1_Conditional_7_Template, 7, 0, "label");
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(7);
    \u0275\u0275conditional(\u0275\u0275pureFunction0(1, _c2).includes(ctx_r2.filtrosPendientes.controls.origen.value) ? 7 : -1);
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_0_Conditional_2_For_6_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 26);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r10 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("value", s_r10["id_actividad_sesion"]);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(s_r10["nombre"]);
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_0_Conditional_2_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_0_Conditional_2_For_6_Conditional_0_Template, 2, 2, "option", 26);
  }
  if (rf & 2) {
    const s_r10 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(5);
    \u0275\u0275conditional(!ctx_r2.filtrosPendientes.controls.actividad.value || +s_r10["id_actividad"] === +ctx_r2.filtrosPendientes.controls.actividad.value ? 0 : -1);
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "label");
    \u0275\u0275text(1, "Sesi\xF3n");
    \u0275\u0275elementStart(2, "select", 27)(3, "option", 25);
    \u0275\u0275text(4, "Todas");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(5, GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_0_Conditional_2_For_6_Template, 1, 1, null, null, _forTrack14);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r2.sesionesFiltro());
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_0_Conditional_3_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 26);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tipo_r11 = ctx.$implicit;
    \u0275\u0275property("value", tipo_r11.id_tipo_certificado);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(tipo_r11.nombre_tipo);
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_0_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "label");
    \u0275\u0275text(1, "Tipo para evaluar");
    \u0275\u0275elementStart(2, "select", 28)(3, "option", 25);
    \u0275\u0275text(4, "Sin determinar");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(5, GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_0_Conditional_3_For_6_Template, 2, 2, "option", 26, _forTrack22);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "label");
    \u0275\u0275text(8, "Por p\xE1gina");
    \u0275\u0275elementStart(9, "select", 29)(10, "option", 30);
    \u0275\u0275text(11, "10");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "option", 31);
    \u0275\u0275text(13, "20");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "option", 32);
    \u0275\u0275text(15, "50");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "option", 33);
    \u0275\u0275text(17, "100");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "button", 34);
    \u0275\u0275text(19, "Consultar");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r2.tiposEvaluacion());
    \u0275\u0275advance(13);
    \u0275\u0275property("disabled", ctx_r2.cargandoPendientes() || ctx_r2.contexto().cargando || !!ctx_r2.contexto().error);
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 20);
    \u0275\u0275listener("ngSubmit", function GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_0_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.aplicarFiltrosPendientes());
    });
    \u0275\u0275template(1, GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_0_Conditional_1_Template, 8, 2)(2, GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_0_Conditional_2_Template, 7, 0, "label")(3, GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_0_Conditional_3_Template, 20, 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275property("formGroup", ctx_r2.filtrosPendientes);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.contexto().general ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.contexto().general && ctx_r2.filtrosPendientes.controls.origen.value === "sesion" ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(\u0275\u0275pureFunction0(4, _c2).includes(ctx_r2.filtrosPendientes.controls.origen.value) ? 3 : -1);
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 35);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 36);
    \u0275\u0275listener("click", function GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_1_Conditional_0_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.cargarCatalogosEvaluacion());
    });
    \u0275\u0275text(3, "Reintentar cat\xE1logos");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.errorCatalogos());
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 2);
    \u0275\u0275text(1, "Consultando pendientes autorizados\u2026");
    \u0275\u0275elementEnd();
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 35);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 36);
    \u0275\u0275listener("click", function GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_1_Conditional_2_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.cargarPendientes());
    });
    \u0275\u0275text(3, "Reintentar pendientes");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.errorPendientes());
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_1_Conditional_0_Template, 4, 1)(1, GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_1_Conditional_1_Template, 2, 0, "p", 2)(2, GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_1_Conditional_2_Template, 4, 1);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275conditional(ctx_r2.errorCatalogos() ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.cargandoPendientes() ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.errorPendientes() ? 2 : -1);
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-practicas-certificacion");
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-reconocimientos-actividad");
    \u0275\u0275elementStart(1, "details")(2, "summary");
    \u0275\u0275text(3, "Reconocimientos municipales individuales");
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "app-municipales-individuales");
    \u0275\u0275elementEnd();
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_4_Conditional_0_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th");
    \u0275\u0275text(1, "Sesi\xF3n");
    \u0275\u0275elementEnd();
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_4_Conditional_0_For_23_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const fila_r16 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(fila_r16.nombre_sesion);
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_4_Conditional_0_For_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td", 40);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275element(5, "br");
    \u0275\u0275elementStart(6, "small");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(8, GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_4_Conditional_0_For_23_Conditional_8_Template, 2, 1, "td");
    \u0275\u0275elementStart(9, "td", 40);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td", 40);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td", 40);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "td", 40);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "td", 40)(18, "button", 41);
    \u0275\u0275listener("click", function GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_4_Conditional_0_For_23_Template_button_click_18_listener() {
      const fila_r16 = \u0275\u0275restoreView(_r15).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r2.consultarBeneficiarios(fila_r16));
    });
    \u0275\u0275elementStart(19, "span", 11);
    \u0275\u0275text(20, "group");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const fila_r16 = ctx.$implicit;
    const \u0275$index_226_r17 = ctx.$index;
    const pagina_r18 = \u0275\u0275nextContext();
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((pagina_r18.current_page - 1) * pagina_r18.per_page + \u0275$index_226_r17 + 1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(fila_r16.nombre_actividad);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(fila_r16.area_municipal);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.filtrosPendientes.controls.origen.value === "sesion" ? 8 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(fila_r16.total_participantes_inscritos);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(fila_r16.total_elegibles);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(fila_r16.total_pendientes);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(fila_r16.estado_sesion || fila_r16.estado_actividad);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !ctx_r2.auth.tienePermiso("participantes.ver") || ctx_r2.cargandoBeneficiarios());
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_4_Conditional_0_ForEmpty_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 42);
    \u0275\u0275text(2, "No hay pendientes autorizados para estos filtros.");
    \u0275\u0275elementEnd()();
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_4_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 37)(1, "table", 38)(2, "caption", 39);
    \u0275\u0275text(3, "Pendientes de certificaci\xF3n autorizados");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "thead")(5, "tr")(6, "th", 40);
    \u0275\u0275text(7, "N.\xB0");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Actividad / origen");
    \u0275\u0275elementEnd();
    \u0275\u0275template(10, GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_4_Conditional_0_Conditional_10_Template, 2, 0, "th");
    \u0275\u0275elementStart(11, "th", 40);
    \u0275\u0275text(12, "Inscritos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th", 40);
    \u0275\u0275text(14, "Elegibles");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "th", 40);
    \u0275\u0275text(16, "Pendientes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "th", 40);
    \u0275\u0275text(18, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "th", 40);
    \u0275\u0275text(20, "Acciones");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(21, "tbody");
    \u0275\u0275repeaterCreate(22, GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_4_Conditional_0_For_23_Template, 21, 9, "tr", null, _forTrack3, false, GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_4_Conditional_0_ForEmpty_24_Template, 3, 0, "tr");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(25, "nav", 7)(26, "button", 9);
    \u0275\u0275listener("click", function GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_4_Conditional_0_Template_button_click_26_listener() {
      const pagina_r18 = \u0275\u0275restoreView(_r14);
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.cargarPendientes(pagina_r18.current_page - 1));
    });
    \u0275\u0275text(27, "Anterior");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "span");
    \u0275\u0275text(29);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "button", 9);
    \u0275\u0275listener("click", function GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_4_Conditional_0_Template_button_click_30_listener() {
      const pagina_r18 = \u0275\u0275restoreView(_r14);
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.cargarPendientes(pagina_r18.current_page + 1));
    });
    \u0275\u0275text(31, "Siguiente");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const pagina_r18 = ctx;
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(10);
    \u0275\u0275conditional(ctx_r2.filtrosPendientes.controls.origen.value === "sesion" ? 10 : -1);
    \u0275\u0275advance(12);
    \u0275\u0275repeater(pagina_r18.data);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", pagina_r18.current_page <= 1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", pagina_r18.current_page, " / ", pagina_r18.last_page, "");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", pagina_r18.current_page >= pagina_r18.last_page);
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_4_Conditional_0_Template, 32, 6);
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275conditional((tmp_4_0 = ctx_r2.pendientes()) ? 0 : -1, tmp_4_0);
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_0_Template, 4, 5, "form", 19)(1, GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_1_Template, 3, 3)(2, GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_2_Template, 1, 0, "app-practicas-certificacion")(3, GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_3_Template, 5, 0)(4, GenerarEmitirComponent_Conditional_4_Conditional_3_Conditional_4_Template, 1, 1);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(ctx_r2.pestanaOrigen() === "capacitacion" ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(\u0275\u0275pureFunction0(3, _c2).includes(ctx_r2.filtrosPendientes.controls.origen.value) ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.filtrosPendientes.controls.origen.value === "practica" ? 2 : ctx_r2.filtrosPendientes.controls.origen.value === "reconocimiento" ? 3 : 4);
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "header", 43)(1, "button", 46);
    \u0275\u0275listener("click", function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_0_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r19);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.volverPendientes());
    });
    \u0275\u0275elementStart(2, "span", 11);
    \u0275\u0275text(3, "arrow_back");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "h2");
    \u0275\u0275text(5, "Beneficiarios");
    \u0275\u0275elementEnd()();
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_1_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 26);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const t_r21 = ctx.$implicit;
    \u0275\u0275property("value", t_r21.id_tipo_certificado);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(t_r21.nombre_tipo);
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 44)(1, "label");
    \u0275\u0275text(2, "Tipo de certificado");
    \u0275\u0275elementStart(3, "select", 47);
    \u0275\u0275listener("change", function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_1_Template_select_change_3_listener() {
      \u0275\u0275restoreView(_r20);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.cargarBeneficiarios());
    });
    \u0275\u0275elementStart(4, "option", 25);
    \u0275\u0275text(5, "Seleccionar tipo");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(6, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_1_For_7_Template, 2, 2, "option", 26, _forTrack22);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "label");
    \u0275\u0275text(9, "Elegibilidad en esta p\xE1gina");
    \u0275\u0275elementStart(10, "select", 48);
    \u0275\u0275listener("change", function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_1_Template_select_change_10_listener($event) {
      \u0275\u0275restoreView(_r20);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.elegibilidad.set($event.target.value));
    });
    \u0275\u0275elementStart(11, "option", 25);
    \u0275\u0275text(12, "Todas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "option");
    \u0275\u0275text(14, "Elegible");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "option");
    \u0275\u0275text(16, "No elegible");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "option");
    \u0275\u0275text(18, "Pendiente de validaci\xF3n");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275property("formControl", ctx_r2.filtrosPendientes.controls.tipo);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r2.tiposEvaluacion());
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r22 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 35);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 36);
    \u0275\u0275listener("click", function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_2_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r22);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.cargarBeneficiarios());
    });
    \u0275\u0275text(3, "Reintentar beneficiarios");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.errorBeneficiarios());
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 2);
    \u0275\u0275text(1, "Consultando beneficiarios...");
    \u0275\u0275elementEnd();
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_0_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 53);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const estado_r24 = ctx;
    \u0275\u0275classProp("finalizada", estado_r24.toLowerCase() === "finalizada" || estado_r24.toLowerCase() === "finalizado");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(estado_r24);
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_0_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    \u0275\u0275textInterpolate1(" \xB7 Sesi\xF3n ", ctx, " ");
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_0_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
    \u0275\u0275pipe(1, "date");
  }
  if (rf & 2) {
    \u0275\u0275textInterpolate1(" \xB7 ", \u0275\u0275pipeBind2(1, 1, ctx, "dd/MM/yyyy"), " ");
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_0_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 51)(1, "div", 54)(2, "span", 11);
    \u0275\u0275text(3, "how_to_reg");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span");
    \u0275\u0275text(7, "Inscritos");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 54)(9, "span", 11);
    \u0275\u0275text(10, "groups");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "strong");
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "span");
    \u0275\u0275text(14, "Participantes");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "div", 54)(16, "span", 11);
    \u0275\u0275text(17, "co_present");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "strong");
    \u0275\u0275text(19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "span");
    \u0275\u0275text(21, "Presentes");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "div", 54)(23, "span", 11);
    \u0275\u0275text(24, "person_off");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "strong");
    \u0275\u0275text(26);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "span");
    \u0275\u0275text(28, "Ausentes");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(29, "div", 54)(30, "span", 11);
    \u0275\u0275text(31, "pending_actions");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "strong");
    \u0275\u0275text(33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "span");
    \u0275\u0275text(35, "Pendientes");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const c_r25 = ctx;
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(c_r25.inscritos_actividad_vigentes);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(c_r25.participantes_sesion);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(c_r25.presentes);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(c_r25.ausentes);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(c_r25.pendientes);
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_0_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 52);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r26 = \u0275\u0275nextContext(2);
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.motivosPreparacion(r_r26)[0] || "Preparaci\xF3n no disponible para esta selecci\xF3n.");
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r23 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "header", 43)(1, "button", 46);
    \u0275\u0275listener("click", function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_0_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r23);
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.volverPendientes());
    });
    \u0275\u0275elementStart(2, "span", 11);
    \u0275\u0275text(3, "arrow_back");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "span", 11);
    \u0275\u0275text(5, "groups");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "h2");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275template(8, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_0_Conditional_8_Template, 2, 3, "span", 50);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p");
    \u0275\u0275text(10);
    \u0275\u0275template(11, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_0_Conditional_11_Template, 1, 1)(12, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_0_Conditional_12_Template, 2, 4);
    \u0275\u0275elementEnd();
    \u0275\u0275template(13, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_0_Conditional_13_Template, 36, 5, "div", 51)(14, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_0_Conditional_14_Template, 2, 1, "p", 52);
  }
  if (rf & 2) {
    let tmp_7_0;
    let tmp_9_0;
    let tmp_10_0;
    let tmp_11_0;
    const r_r26 = \u0275\u0275nextContext();
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1("Beneficiarios \xB7 ", r_r26.contexto.nombre_sesion || r_r26.contexto.nombre_actividad, "");
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_7_0 = r_r26.contexto.estado_sesion || r_r26.contexto.estado_actividad) ? 8 : -1, tmp_7_0);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(r_r26.contexto.nombre_actividad);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_9_0 = (tmp_9_0 = ctx_r2.sesionBeneficiarios()) == null ? null : tmp_9_0["numero_sesion"]) ? 11 : -1, tmp_9_0);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_10_0 = (tmp_10_0 = ctx_r2.sesionBeneficiarios()) == null ? null : tmp_10_0["fecha"]) ? 12 : -1, tmp_10_0);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_11_0 = r_r26.contadores) ? 13 : -1, tmp_11_0);
    \u0275\u0275advance();
    \u0275\u0275conditional(!r_r26.puede_preparar ? 14 : -1);
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 2);
    \u0275\u0275text(1, "Consultando datos para la revisi\xF3n\u2026");
    \u0275\u0275elementEnd();
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 4);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.errorRevision());
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const v_r28 = \u0275\u0275nextContext();
    \u0275\u0275textInterpolate1(" \xB7 ", v_r28.evaluacion.contexto.nombre_sesion, " ");
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_25_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dt");
    \u0275\u0275text(1, "Sesi\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dd");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const v_r28 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(v_r28.evaluacion.contexto.nombre_sesion);
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_25_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dt");
    \u0275\u0275text(1, "Fecha de realizaci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dd");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "date");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(4, 1, ctx, "dd/MM/yyyy"));
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_25_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dt");
    \u0275\u0275text(1, "Lugar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dd");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx);
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r29 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "h2");
    \u0275\u0275text(1, "Datos del certificado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dl", 58)(3, "dt");
    \u0275\u0275text(4, "Tipo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "dd");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "dt");
    \u0275\u0275text(8, "Beneficiario");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "dd");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "dt");
    \u0275\u0275text(12, "Actividad u origen");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "dd");
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275template(15, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_25_Conditional_15_Template, 4, 1)(16, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_25_Conditional_16_Template, 5, 4)(17, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_25_Conditional_17_Template, 4, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "button", 59);
    \u0275\u0275listener("click", function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_25_Template_button_click_18_listener() {
      \u0275\u0275restoreView(_r29);
      const ctx_r2 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r2.avanzarBeneficiario());
    });
    \u0275\u0275text(19, "Continuar al mensaje");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_12_0;
    let tmp_13_0;
    const v_r28 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(v_r28.tipo.nombre_tipo);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(v_r28.beneficiario.nombre_completo);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(v_r28.evaluacion.contexto.nombre_actividad);
    \u0275\u0275advance();
    \u0275\u0275conditional(v_r28.evaluacion.contexto.nombre_sesion ? 15 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_12_0 = (tmp_12_0 = v_r28.sesion == null ? null : v_r28.sesion["fecha"]) !== null && tmp_12_0 !== void 0 ? tmp_12_0 : v_r28.evaluacion.origen === "actividad" ? v_r28.actividad == null ? null : v_r28.actividad["fecha_inicio"] : null) ? 16 : -1, tmp_12_0);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_13_0 = (v_r28.sesion == null ? null : v_r28.sesion["lugar"]) || (v_r28.actividad == null ? null : v_r28.actividad["sede"])) ? 17 : -1, tmp_13_0);
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_26_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 62);
    \u0275\u0275text(1, "Escribe un mensaje no vac\xEDo en texto plano, sin etiquetas HTML ni controles peligrosos (m\xE1ximo 1200 caracteres Unicode).");
    \u0275\u0275elementEnd();
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r30 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "h2");
    \u0275\u0275text(1, "Redactar mensaje");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "El nombre del beneficiario se incorpora autom\xE1ticamente a la plantilla. Escribe solamente el cuerpo del certificado.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "label", 60);
    \u0275\u0275text(5, "Mensaje del certificado");
    \u0275\u0275elementEnd();
    \u0275\u0275element(6, "textarea", 61);
    \u0275\u0275template(7, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_26_Conditional_7_Template, 2, 0, "p", 62);
    \u0275\u0275elementStart(8, "div", 7)(9, "button", 36);
    \u0275\u0275listener("click", function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_26_Template_button_click_9_listener() {
      \u0275\u0275restoreView(_r30);
      const ctx_r2 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r2.pasoBeneficiario.set(1));
    });
    \u0275\u0275text(10, "Volver a datos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "button", 10);
    \u0275\u0275listener("click", function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_26_Template_button_click_11_listener() {
      \u0275\u0275restoreView(_r30);
      const ctx_r2 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r2.avanzarBeneficiario());
    });
    \u0275\u0275text(12, "Previsualizar certificado");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(5);
    \u0275\u0275advance(6);
    \u0275\u0275property("formControl", ctx_r2.mensajeCertificado);
    \u0275\u0275attribute("aria-invalid", ctx_r2.mensajeCertificado.touched && ctx_r2.mensajeCertificado.invalid)("aria-describedby", ctx_r2.mensajeCertificado.touched && ctx_r2.mensajeCertificado.invalid ? "mensaje-error" : null);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.mensajeCertificado.touched && ctx_r2.mensajeCertificado.invalid ? 7 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", ctx_r2.generandoPrevia());
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 2);
    \u0275\u0275text(1, "Generando vista previa PDF...");
    \u0275\u0275elementEnd();
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 35);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(5);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.errorPrevia());
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_29_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-visor-pdf", 63);
  }
  if (rf & 2) {
    \u0275\u0275property("archivoPrevio", ctx.archivo)("compacto", true);
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_29_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 2);
    \u0275\u0275text(1, "Preparando certificado...");
    \u0275\u0275elementEnd();
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_29_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 35);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(6);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.errorOperacion());
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_29_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "Env\xEDo a Gerencia no disponible para este documento.");
    \u0275\u0275elementEnd();
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r31 = \u0275\u0275getCurrentView();
    \u0275\u0275template(0, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_29_Conditional_0_Template, 1, 2, "app-visor-pdf", 63);
    \u0275\u0275elementStart(1, "div", 7)(2, "button", 9);
    \u0275\u0275listener("click", function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_29_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r31);
      const ctx_r2 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r2.editarMensaje());
    });
    \u0275\u0275text(3, "Volver a editar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 10);
    \u0275\u0275listener("click", function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_29_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r31);
      const ctx_r2 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r2.continuarConfirmacion());
    });
    \u0275\u0275text(5, "Guardar y continuar");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(6, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_29_Conditional_6_Template, 2, 0, "p", 2)(7, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_29_Conditional_7_Template, 2, 1, "p", 35)(8, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_29_Conditional_8_Template, 2, 0, "p");
  }
  if (rf & 2) {
    let tmp_8_0;
    const ctx_r2 = \u0275\u0275nextContext(5);
    \u0275\u0275conditional((tmp_8_0 = ctx_r2.pdfPrevio()) ? 0 : -1, tmp_8_0);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r2.operando());
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !ctx_r2.revisionPdf() || ctx_r2.generandoPrevia() || ctx_r2.operando());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.operando() ? 6 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.errorOperacion() ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r2.revisionPdf() && !ctx_r2.operando() ? 8 : -1);
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_30_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(6);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Modalidad aprobada: ", ctx_r2.modalidadFirma(), "");
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_30_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 2);
    \u0275\u0275text(1, "Enviando a Gerencia...");
    \u0275\u0275elementEnd();
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_30_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 35);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(6);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.errorOperacion());
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_30_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 2);
    \u0275\u0275text(1, "Listo para entrega");
    \u0275\u0275elementEnd();
    \u0275\u0275element(2, "app-visor-pdf", 64);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(6);
    \u0275\u0275advance(2);
    \u0275\u0275property("documentoId", ctx_r2.documentoPreparado().id_certificado_documento)("hashEsperado", ctx_r2.documentoPreparado().hash_pdf)("flujoFirmas", true)("compacto", true);
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_30_Conditional_6_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 65);
    \u0275\u0275text(1, "Ver documento en Gerencia");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(7);
    \u0275\u0275property("queryParams", \u0275\u0275pureFunction1(1, _c3, ctx_r2.documentoPreparado().id_certificado_documento));
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_30_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 2);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275element(2, "app-visor-pdf", 64);
    \u0275\u0275template(3, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_30_Conditional_6_Conditional_3_Template, 2, 3, "a", 65);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(6);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.documentoPreparado().disponible_rrhh ? "Listo para entrega" : "Enviado a Gerencia");
    \u0275\u0275advance();
    \u0275\u0275property("documentoId", ctx_r2.documentoPreparado().id_certificado_documento)("hashEsperado", ctx_r2.documentoPreparado().hash_pdf)("flujoFirmas", true)("compacto", true);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.puedeVerGerencia() ? 3 : -1);
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_30_Conditional_7_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "El documento no est\xE1 habilitado para su env\xEDo.");
    \u0275\u0275elementEnd();
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_30_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r32 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 2);
    \u0275\u0275text(1, "Certificado preparado");
    \u0275\u0275elementEnd();
    \u0275\u0275element(2, "app-visor-pdf", 64);
    \u0275\u0275template(3, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_30_Conditional_7_Conditional_3_Template, 2, 0, "p");
    \u0275\u0275elementStart(4, "button", 10);
    \u0275\u0275listener("click", function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_30_Conditional_7_Template_button_click_4_listener($event) {
      \u0275\u0275restoreView(_r32);
      const ctx_r2 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r2.revisarParaEnviar($event));
    });
    \u0275\u0275text(5, "Enviar a Gerencia");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(6);
    \u0275\u0275advance(2);
    \u0275\u0275property("documentoId", ctx_r2.documentoPreparado().id_certificado_documento)("hashEsperado", ctx_r2.documentoPreparado().hash_pdf)("flujoFirmas", true)("compacto", true);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r2.puedeRemitir() ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r2.operando() || !ctx_r2.puedeRemitir());
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_30_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r33 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 7)(1, "button", 9);
    \u0275\u0275listener("click", function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_30_Conditional_8_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r33);
      const ctx_r2 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r2.editarMensaje());
    });
    \u0275\u0275text(2, "Volver a editar");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(6);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r2.operando());
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "h2");
    \u0275\u0275text(1, "Enviar a Gerencia");
    \u0275\u0275elementEnd();
    \u0275\u0275template(2, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_30_Conditional_2_Template, 2, 1, "p")(3, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_30_Conditional_3_Template, 2, 0, "p", 2)(4, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_30_Conditional_4_Template, 2, 1, "p", 35)(5, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_30_Conditional_5_Template, 3, 4)(6, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_30_Conditional_6_Template, 4, 6)(7, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_30_Conditional_7_Template, 6, 6)(8, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_30_Conditional_8_Template, 3, 1, "div", 7);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(5);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.modalidadFirma() ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.operando() ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.errorOperacion() ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.documentoPreparado().disponible_rrhh === true ? 5 : ctx_r2.enviado() ? 6 : ctx_r2.documentoPreparado() ? 7 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(!ctx_r2.documentoPreparado() ? 8 : -1);
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r27 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 49)(1, "header", 55)(2, "button", 56);
    \u0275\u0275listener("click", function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r27);
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.cerrarRevision());
    });
    \u0275\u0275elementStart(3, "span", 11);
    \u0275\u0275text(4, "arrow_back");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "h1");
    \u0275\u0275text(6, "Revisar certificado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p")(8, "strong");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "p");
    \u0275\u0275text(12);
    \u0275\u0275template(13, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_13_Template, 1, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "p");
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "ol", 57)(17, "li");
    \u0275\u0275text(18, "1. Datos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "li");
    \u0275\u0275text(20, "2. Mensaje");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "li");
    \u0275\u0275text(22, "3. Previsualizar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "li");
    \u0275\u0275text(24, "4. Enviar a Gerencia");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(25, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_25_Template, 20, 6)(26, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_26_Template, 13, 5)(27, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_27_Template, 2, 0, "p", 2)(28, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_28_Template, 2, 1, "p", 35)(29, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_29_Template, 9, 6)(30, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Conditional_30_Template, 9, 5);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const v_r28 = ctx;
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r2.operando());
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(v_r28.beneficiario.nombre_completo);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" \xB7 ", v_r28.tipo.nombre_tipo, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(v_r28.evaluacion.contexto.nombre_actividad);
    \u0275\u0275advance();
    \u0275\u0275conditional(v_r28.evaluacion.contexto.nombre_sesion ? 13 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Estado administrativo: ", v_r28.evaluacion.contexto.estado_sesion || v_r28.evaluacion.contexto.estado_actividad || "No informado", "");
    \u0275\u0275advance(2);
    \u0275\u0275classProp("actual", ctx_r2.pasoBeneficiario() === 1);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("actual", ctx_r2.pasoBeneficiario() === 2);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("actual", ctx_r2.pasoBeneficiario() === 3);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("actual", ctx_r2.pasoBeneficiario() === 4);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.pasoBeneficiario() === 1 ? 25 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.pasoBeneficiario() === 2 ? 26 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.generandoPrevia() ? 27 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.errorPrevia() ? 28 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.pasoBeneficiario() === 3 ? 29 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.pasoBeneficiario() === 4 && ctx_r2.documentoPreparado() ? 30 : -1);
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_4_For_24_For_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const motivo_r35 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(motivo_r35);
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_4_For_24_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r36 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 72);
    \u0275\u0275listener("click", function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_4_For_24_Conditional_18_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r36);
      const b_r37 = \u0275\u0275nextContext().$implicit;
      const r_r26 = \u0275\u0275nextContext(2);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.abrirCertificadoExistente(b_r37, r_r26));
    });
    \u0275\u0275text(1, "Ver certificado");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const b_r37 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(5);
    \u0275\u0275property("disabled", !b_r37.id_certificado_documento || ctx_r2.cargandoRevision());
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_4_For_24_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r38 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 72);
    \u0275\u0275listener("click", function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_4_For_24_Conditional_19_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r38);
      const b_r37 = \u0275\u0275nextContext().$implicit;
      const r_r26 = \u0275\u0275nextContext(2);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.revisarBeneficiario(b_r37, r_r26));
    });
    \u0275\u0275text(1, "Preparar certificado");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const b_r37 = \u0275\u0275nextContext().$implicit;
    const r_r26 = \u0275\u0275nextContext(2);
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275property("disabled", !ctx_r2.puedeRevisar(b_r37, r_r26) || ctx_r2.cargandoRevision());
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_4_For_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 45)(1, "td", 69);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th", 70);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 40);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td");
    \u0275\u0275text(10);
    \u0275\u0275repeaterCreate(11, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_4_For_24_For_12_Template, 2, 1, "p", null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td");
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "td");
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "td", 40);
    \u0275\u0275template(18, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_4_For_24_Conditional_18_Template, 2, 1, "button", 71)(19, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_4_For_24_Conditional_19_Template, 2, 1, "button", 71);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const b_r37 = ctx.$implicit;
    const r_r26 = \u0275\u0275nextContext(2);
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275property("hidden", !!ctx_r2.elegibilidad() && b_r37.estado_elegibilidad !== ctx_r2.elegibilidad());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.numeroBeneficiario(b_r37, r_r26));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(b_r37.nombre_completo);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(b_r37.documento_identidad || "No disponible");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(b_r37.estado_asistencia || "No informada");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(b_r37.estado_elegibilidad);
    \u0275\u0275advance();
    \u0275\u0275repeater(b_r37.motivos);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r2.nombreTipoEvaluacion(b_r37.id_tipo_certificado));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.estadoBeneficiario(b_r37, r_r26));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(b_r37.id_certificado || b_r37.id_preparacion || b_r37.id_certificado_documento ? 18 : 19);
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_4_ForEmpty_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 42);
    \u0275\u0275text(2, "No hay beneficiarios autorizados.");
    \u0275\u0275elementEnd()();
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r34 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "h2", 66);
    \u0275\u0275text(1, "Participantes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 37)(3, "table", 67)(4, "thead")(5, "tr")(6, "th", 68);
    \u0275\u0275text(7, "N.?");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Participante");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Documento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 40);
    \u0275\u0275text(13, "Asistencia");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th");
    \u0275\u0275text(15, "Elegibilidad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th");
    \u0275\u0275text(17, "Tipo aplicable");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "th");
    \u0275\u0275text(19, "Preparaci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "th", 40);
    \u0275\u0275text(21, "Acciones");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(22, "tbody");
    \u0275\u0275repeaterCreate(23, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_4_For_24_Template, 20, 9, "tr", 45, _forTrack4, false, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_4_ForEmpty_25_Template, 3, 0, "tr");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(26, "nav", 7)(27, "button", 9);
    \u0275\u0275listener("click", function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_4_Template_button_click_27_listener() {
      \u0275\u0275restoreView(_r34);
      const r_r26 = \u0275\u0275nextContext();
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.cargarBeneficiarios(r_r26.beneficiarios.current_page - 1));
    });
    \u0275\u0275text(28, "Anterior");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "span");
    \u0275\u0275text(30);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "button", 9);
    \u0275\u0275listener("click", function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_4_Template_button_click_31_listener() {
      \u0275\u0275restoreView(_r34);
      const r_r26 = \u0275\u0275nextContext();
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.cargarBeneficiarios(r_r26.beneficiarios.current_page + 1));
    });
    \u0275\u0275text(32, "Siguiente");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r26 = \u0275\u0275nextContext();
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(23);
    \u0275\u0275repeater(r_r26.beneficiarios.data);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", r_r26.beneficiarios.current_page <= 1 || ctx_r2.cargandoBeneficiarios());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate3("", r_r26.beneficiarios.current_page, " / ", r_r26.beneficiarios.last_page, " / ", r_r26.beneficiarios.total, " beneficiarios");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", r_r26.beneficiarios.current_page >= r_r26.beneficiarios.last_page || ctx_r2.cargandoBeneficiarios());
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_0_Template, 15, 7)(1, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_1_Template, 2, 0, "p", 2)(2, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_2_Template, 2, 1, "p", 4)(3, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_3_Template, 31, 20, "section", 49)(4, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Conditional_4_Template, 33, 6);
  }
  if (rf & 2) {
    let tmp_8_0;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275conditional(!ctx_r2.revisionBeneficiario() ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.cargandoRevision() ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.errorRevision() ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_8_0 = ctx_r2.revisionBeneficiario()) ? 3 : 4, tmp_8_0);
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 45);
    \u0275\u0275element(1, "app-ponentes-sesion", 73);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_6_0;
    let tmp_7_0;
    const p_r39 = ctx;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275property("hidden", !!ctx_r2.revisionBeneficiario());
    \u0275\u0275advance();
    \u0275\u0275property("actividadNombre", ((tmp_6_0 = ctx_r2.evaluacion()) == null ? null : tmp_6_0.contexto == null ? null : tmp_6_0.contexto.nombre_actividad) || "")("sesionNombre", ((tmp_7_0 = ctx_r2.evaluacion()) == null ? null : tmp_7_0.contexto == null ? null : tmp_7_0.contexto.nombre_sesion) || "")("actividadId", p_r39.actividad)("sesionId", p_r39.sesion);
  }
}
function GenerarEmitirComponent_Conditional_4_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_0_Template, 6, 0, "header", 43)(1, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_1_Template, 19, 1, "div", 44)(2, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_2_Template, 4, 1)(3, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_3_Template, 2, 0, "p", 2)(4, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_4_Template, 5, 4)(5, GenerarEmitirComponent_Conditional_4_Conditional_4_Conditional_5_Template, 2, 5, "div", 45);
  }
  if (rf & 2) {
    let tmp_7_0;
    let tmp_8_0;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(!ctx_r2.revisionBeneficiario() && !ctx_r2.evaluacion() ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r2.revisionBeneficiario() ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.errorBeneficiarios() ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.cargandoBeneficiarios() ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_7_0 = ctx_r2.evaluacion()) ? 4 : -1, tmp_7_0);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_8_0 = ctx_r2.contextoPonentes()) ? 5 : -1, tmp_8_0);
  }
}
function GenerarEmitirComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, GenerarEmitirComponent_Conditional_4_Conditional_0_Template, 1, 2, "app-origenes-tabs", 16);
    \u0275\u0275elementStart(1, "section", 5);
    \u0275\u0275template(2, GenerarEmitirComponent_Conditional_4_Conditional_2_Template, 2, 0, "h2", 17)(3, GenerarEmitirComponent_Conditional_4_Conditional_3_Template, 5, 4)(4, GenerarEmitirComponent_Conditional_4_Conditional_4_Template, 6, 6);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275conditional(!ctx_r2.revisionBeneficiario() ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275attribute("aria-labelledby", "origen-tab-" + ctx_r2.pestanaOrigen());
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r2.viendoBeneficiarios() ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r2.viendoBeneficiarios() ? 3 : 4);
  }
}
function GenerarEmitirComponent_Conditional_5_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li")(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const titulo_r40 = ctx.$implicit;
    const \u0275$index_730_r41 = ctx.$index;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("actual", ctx_r2.paso() === \u0275$index_730_r41 + 1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275$index_730_r41 + 1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(titulo_r40);
  }
}
function GenerarEmitirComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ol", 6);
    \u0275\u0275repeaterCreate(1, GenerarEmitirComponent_Conditional_5_For_2_Template, 4, 4, "li", 74, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.pasos);
  }
}
function GenerarEmitirComponent_Conditional_6_For_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r42 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 45)(1, "app-formulario-certificado", 75);
    \u0275\u0275listener("cambioPaso", function GenerarEmitirComponent_Conditional_6_For_1_Template_app_formulario_certificado_cambioPaso_1_listener($event) {
      \u0275\u0275restoreView(_r42);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.paso.set($event));
    })("preparado", function GenerarEmitirComponent_Conditional_6_For_1_Template_app_formulario_certificado_preparado_1_listener($event) {
      \u0275\u0275restoreView(_r42);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.seleccionar($event, true));
    })("cancelado", function GenerarEmitirComponent_Conditional_6_For_1_Template_app_formulario_certificado_cancelado_1_listener() {
      \u0275\u0275restoreView(_r42);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.cancelar());
    })("falloGuardado", function GenerarEmitirComponent_Conditional_6_For_1_Template_app_formulario_certificado_falloGuardado_1_listener($event) {
      \u0275\u0275restoreView(_r42);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.error.set($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("hidden", ctx_r2.paso() > 2);
    \u0275\u0275advance();
    \u0275\u0275property("integrado", true)("paso", ctx_r2.paso());
  }
}
function GenerarEmitirComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, GenerarEmitirComponent_Conditional_6_For_1_Template, 2, 3, "div", 45, \u0275\u0275repeaterTrackByIdentity);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275repeater(ctx_r2.contextosFormulario());
  }
}
function GenerarEmitirComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 2);
    \u0275\u0275text(1, "Consultando origen autorizado...");
    \u0275\u0275elementEnd();
  }
}
function GenerarEmitirComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 4);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.error());
  }
}
function GenerarEmitirComponent_Conditional_9_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 76)(1, "h2");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "form", 78)(8, "label");
    \u0275\u0275element(9, "input", 79);
    \u0275\u0275text(10, " He revisado los datos.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "label");
    \u0275\u0275element(12, "input", 80);
    \u0275\u0275text(13, " He revisado el origen. Esta revisi\xF3n no acredita elegibilidad oficial.");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ficha_r44 = \u0275\u0275nextContext();
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Registro administrativo #", ficha_r44.registro.id_certificado, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", ficha_r44.beneficiario, " / ", ficha_r44.tipo, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.origen());
    \u0275\u0275advance();
    \u0275\u0275property("formGroup", ctx_r2.revision);
  }
}
function GenerarEmitirComponent_Conditional_9_Conditional_1_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const a_r45 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("Firmante #", a_r45.firma, " / Orden ", a_r45.orden, " / Sin firma aplicada.");
  }
}
function GenerarEmitirComponent_Conditional_9_Conditional_1_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r46 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 9);
    \u0275\u0275listener("click", function GenerarEmitirComponent_Conditional_9_Conditional_1_Conditional_8_Template_button_click_0_listener() {
      let tmp_6_0;
      \u0275\u0275restoreView(_r46);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView((tmp_6_0 = ctx_r2.formulario()) == null ? null : tmp_6_0.guardar());
    });
    \u0275\u0275text(1, "Guardar preparaci\xF3n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_5_0;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275property("disabled", !((tmp_5_0 = ctx_r2.formulario()) == null ? null : tmp_5_0.puedeGuardarPreparacion()) || ctx_r2.cargando() || !!ctx_r2.error());
  }
}
function GenerarEmitirComponent_Conditional_9_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 76)(1, "h2");
    \u0275\u0275text(2, "Revisar documento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4, "Previsualizaci\xF3n de metadatos. Emisi\xF3n oficial pendiente.");
    \u0275\u0275elementEnd();
    \u0275\u0275element(5, "app-visor-certificado", 81);
    \u0275\u0275repeaterCreate(6, GenerarEmitirComponent_Conditional_9_Conditional_1_For_7_Template, 2, 2, "p", null, _forTrack5);
    \u0275\u0275template(8, GenerarEmitirComponent_Conditional_9_Conditional_1_Conditional_8_Template, 2, 1, "button", 77);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ficha_r44 = \u0275\u0275nextContext();
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275property("certificado", ficha_r44.registro)("beneficiario", ficha_r44.beneficiario)("dni", ficha_r44.dni)("tipo", ficha_r44.tipo)("origen", ctx_r2.origen())("reconocimiento", ctx_r2.reconocimiento());
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.asignaciones());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.modo() === "nuevo" ? 8 : -1);
  }
}
function GenerarEmitirComponent_Conditional_9_Conditional_2_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r47 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "Laravel permite solicitar un PDF de desarrollo para participaciones compatibles. El servidor comprueba permisos, tipo, \xE1mbito y configuraci\xF3n antes de guardarlo.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 10);
    \u0275\u0275listener("click", function GenerarEmitirComponent_Conditional_9_Conditional_2_Conditional_9_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r47);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.generarPdf());
    });
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !ctx_r2.puedeGenerarPdf());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.generando() ? "Generando PDF\u2026" : "Generar PDF de desarrollo");
  }
}
function GenerarEmitirComponent_Conditional_9_Conditional_2_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 4);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.errorGeneracion());
  }
}
function GenerarEmitirComponent_Conditional_9_Conditional_2_Conditional_11_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 84);
    \u0275\u0275text(1, "Consultar c\xF3digo en la p\xE1gina p\xFAblica");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275property("href", ctx, \u0275\u0275sanitizeUrl);
  }
}
function GenerarEmitirComponent_Conditional_9_Conditional_2_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "h3");
    \u0275\u0275text(1, "Documento disponible para consulta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, GenerarEmitirComponent_Conditional_9_Conditional_2_Conditional_11_Conditional_6_Template, 2, 1, "a", 84);
    \u0275\u0275element(7, "app-visor-pdf", 85);
  }
  if (rf & 2) {
    let tmp_8_0;
    const doc_r48 = ctx;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("Documento #", doc_r48.id_certificado_documento, " \xB7 ", doc_r48.codigo_verificacion, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Modo: ", doc_r48.modo, " \xB7 Emisi\xF3n oficial pendiente \xB7 Firma criptogr\xE1fica no acreditada.");
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_8_0 = ctx_r2.enlaceVerificacion(doc_r48.url_verificacion)) ? 6 : -1, tmp_8_0);
    \u0275\u0275advance();
    \u0275\u0275property("documentoId", doc_r48.id_certificado_documento);
  }
}
function GenerarEmitirComponent_Conditional_9_Conditional_2_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 83);
    \u0275\u0275text(1, "Consultar documentos existentes");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ficha_r44 = \u0275\u0275nextContext(2);
    \u0275\u0275property("queryParams", \u0275\u0275pureFunction1(1, _c4, ficha_r44.registro.id_certificado));
  }
}
function GenerarEmitirComponent_Conditional_9_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 76)(1, "h2");
    \u0275\u0275text(2, "Generar y emitir");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p");
    \u0275\u0275text(8, "Emisi\xF3n oficial pendiente: no se ha emitido ning\xFAn documento oficial ni se ha aplicado una firma criptogr\xE1fica.");
    \u0275\u0275elementEnd();
    \u0275\u0275template(9, GenerarEmitirComponent_Conditional_9_Conditional_2_Conditional_9_Template, 4, 2)(10, GenerarEmitirComponent_Conditional_9_Conditional_2_Conditional_10_Template, 2, 1, "p", 4)(11, GenerarEmitirComponent_Conditional_9_Conditional_2_Conditional_11_Template, 8, 5);
    \u0275\u0275elementStart(12, "button", 82);
    \u0275\u0275text(13, "Generar documento oficial");
    \u0275\u0275elementEnd();
    \u0275\u0275template(14, GenerarEmitirComponent_Conditional_9_Conditional_2_Conditional_14_Template, 2, 3, "a", 83);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_8_0;
    const ficha_r44 = \u0275\u0275nextContext();
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", ficha_r44.beneficiario, " \xB7 ", ficha_r44.tipo, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.origen());
    \u0275\u0275advance(3);
    \u0275\u0275conditional(!ctx_r2.generado() && ficha_r44.registro.id_participacion && !ficha_r44.registro.id_practica && !ficha_r44.registro.id_reconocimiento ? 9 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.errorGeneracion() ? 10 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_8_0 = ctx_r2.generado()) ? 11 : -1, tmp_8_0);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ficha_r44.registro.id_certificado !== null ? 14 : -1);
  }
}
function GenerarEmitirComponent_Conditional_9_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r49 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 9);
    \u0275\u0275listener("click", function GenerarEmitirComponent_Conditional_9_Conditional_6_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r49);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.avanzar());
    });
    \u0275\u0275text(1, "Siguiente");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r2.cargando() || !!ctx_r2.error());
  }
}
function GenerarEmitirComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r43 = \u0275\u0275getCurrentView();
    \u0275\u0275template(0, GenerarEmitirComponent_Conditional_9_Conditional_0_Template, 14, 5, "section", 76)(1, GenerarEmitirComponent_Conditional_9_Conditional_1_Template, 9, 7, "section", 76)(2, GenerarEmitirComponent_Conditional_9_Conditional_2_Template, 15, 7, "section", 76);
    \u0275\u0275elementStart(3, "nav", 7)(4, "button", 9);
    \u0275\u0275listener("click", function GenerarEmitirComponent_Conditional_9_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r43);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.volver());
    });
    \u0275\u0275text(5, "Anterior");
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, GenerarEmitirComponent_Conditional_9_Conditional_6_Template, 2, 1, "button", 77);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r2.paso() === 2 ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.paso() === 3 ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.paso() === 4 ? 2 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r2.generando());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.paso() < 4 ? 6 : -1);
  }
}
function contextoParametros(parametros) {
  return JSON.stringify([...parametros.keys].sort().map((clave) => [clave, parametros.getAll(clave)]));
}
function solicitarContexto(parametros) {
  if (!["id_actividad", "id_sesion", "modalidad"].some((clave) => parametros.has(clave)))
    return { modalidad: "general" };
  const error = { modalidad: "invalido", error: "El contexto de certificaci\xF3n no es v\xE1lido. Revisa la actividad, la sesi\xF3n y el origen." };
  if (["id_actividad", "id_sesion", "modalidad", "origen"].some((clave) => parametros.getAll(clave).length > 1))
    return error;
  const actividad = parametros.get("id_actividad");
  const sesion = parametros.get("id_sesion");
  const modalidad = parametros.get("modalidad") ?? (sesion === null ? "actividad" : "sesion");
  const idValido = (valor) => valor !== null && /^[1-9]\d*$/.test(valor) && Number.isSafeInteger(Number(valor));
  if (!idValido(actividad) || !["participacion", modalidad, ...modalidad === "sesion" ? ["ponente_sesion"] : []].includes(parametros.get("origen") ?? "") || !["actividad", "sesion"].includes(modalidad) || (modalidad === "sesion" ? !idValido(sesion) : sesion !== null))
    return error;
  return { modalidad, actividad: Number(actividad), sesion: sesion === null ? null : Number(sesion) };
}
var GenerarEmitirComponent = class _GenerarEmitirComponent {
  numeroBeneficiario(b, r) {
    const visibles = r.beneficiarios.data.filter((item) => !this.elegibilidad() || item.estado_elegibilidad === this.elegibilidad());
    return (r.beneficiarios.current_page - 1) * r.beneficiarios.per_page + visibles.indexOf(b) + 1;
  }
  pasoBeneficiario = signal(1);
  mensajeCertificado = inject(NonNullableFormBuilder).control("", [validarMensajeCertificado]);
  pdfPrevio = signal(null);
  generandoPrevia = signal(false);
  errorPrevia = signal(null);
  revisoPrevia = signal(false);
  documentoPreparado = signal(null);
  revisionPdf = signal(null);
  revisionEnvio = signal(null);
  confirmacionEnvio = viewChild.required("confirmacionEnvio");
  modalidadFirma = signal("Paralela");
  operando = signal(false);
  errorOperacion = signal(null);
  enviado = signal(false);
  solicitudPrevia;
  operacion;
  puedeRemitir() {
    const doc = this.documentoPreparado();
    return !!doc && doc.disponible_rrhh !== true && doc.estado_certificado === "PREPARADO" && doc.facultades?.remitir === true && !this.enviado();
  }
  puedeVerGerencia() {
    return this.auth.tienePermiso("emision.ver");
  }
  abrirCertificadoExistente(b, r) {
    if (!b.id_certificado_documento || !mismoContexto(b, r) || this.cargandoRevision() || !this.auth.tienePermiso("emision.ver"))
      return;
    const tipo = this.tiposEvaluacion().find((t) => Number(t.id_tipo_certificado) === Number(b.id_tipo_certificado));
    if (!tipo)
      return;
    this.cerrarRevision();
    this.cargandoRevision.set(true);
    this.consultaRevision = this.documentosApi.detalleFirmas(b.id_certificado_documento).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (doc) => {
        this.cargandoRevision.set(false);
        if (doc.id_certificado !== b.id_certificado || doc.id_sesion !== b.id_sesion || doc.id_tipo_certificado !== b.id_tipo_certificado || doc.beneficiario?.id_persona !== b.id_persona || doc.id_actividad !== b.id_actividad) {
          this.errorRevision.set("No se pudo confirmar el certificado de esta sesi\xF3n.");
          return;
        }
        this.revisionBeneficiario.set({ beneficiario: b, tipo, evaluacion: r, actividad: this.contexto().actividad, sesion: this.contexto().sesion });
        this.modalidadFirma.set(doc.modalidad_firma ?? "");
        this.mostrarDocumentoPersistido(doc);
      },
      error: (e) => {
        this.cargandoRevision.set(false);
        this.errorRevision.set(mensajeEtapaA(e));
      }
    });
  }
  cambiarModalidad(valor) {
    if (this.operando() || this.documentoPreparado() || !["", "Paralela", "Secuencial"].includes(valor))
      return;
    this.modalidadFirma.set(valor);
    this.revisionPdf.set(null);
    this.revisoPrevia.set(false);
    this.errorOperacion.set(null);
  }
  revisarParaGuardar() {
    if (this.operando() || this.documentoPreparado())
      return;
    const previa = this.pdfPrevio();
    const contexto = this.revisionBeneficiario();
    const modalidad = this.modalidadFirma();
    if (!modalidad || !previa || !contexto || previa.datos.siguiente_accion_preparacion !== "revisar_documento")
      return;
    if (previa.mensaje !== this.mensajeCertificado.value || previa.clave !== this.claveBorrador() || !this.puedeRevisar(contexto.beneficiario, contexto.evaluacion))
      return;
    this.revisoPrevia.set(false);
    this.operar(this.documentosApi.revisarPreparacion(Number(contexto.beneficiario.id_sesion), contexto.beneficiario.id_participacion, Number(contexto.tipo.id_tipo_certificado), previa.mensaje, modalidad), (revision) => this.revisionPdf.set(revision));
  }
  guardarParaFirma() {
    const revision = this.revisionPdf();
    const contexto = this.revisionBeneficiario();
    if (!revision || !contexto || !this.revisoPrevia() || this.documentoPreparado())
      return;
    this.operar(this.documentosApi.guardarPreparacion(Number(contexto.beneficiario.id_sesion), revision.token, {
      participacion: contexto.beneficiario.id_participacion,
      sesion: Number(contexto.beneficiario.id_sesion),
      tipo: Number(contexto.tipo.id_tipo_certificado),
      persona: contexto.beneficiario.id_persona,
      actividad: contexto.beneficiario.id_actividad
    }, revision.hash), (documento) => {
      this.mostrarDocumentoPersistido(documento);
      this.actualizarBeneficiariosPersistidos();
    });
  }
  mostrarDocumentoPersistido(documento) {
    this.documentoPreparado.set(documento);
    this.enviado.set(["PENDIENTE_FIRMA", "FIRMADO", "EMITIDO"].includes(documento.estado_certificado));
    this.revisionEnvio.set(null);
    this.pasoBeneficiario.set(4);
  }
  revisarParaEnviar(evento) {
    if (!evento || evento.detail > 1 || this.pasoBeneficiario() !== 4 || !this.puedeRemitir() || this.operando())
      return;
    const doc = this.documentoPreparado();
    const revision = this.revisionEnvio();
    this.operar((revision ? of(revision) : this.documentosApi.obtenerRevisionEnvio(doc.id_certificado_documento, doc.hash_pdf)).pipe(switchMap((revision2) => {
      this.revisionEnvio.set(revision2);
      return this.documentosApi.confirmarEnvio(doc.id_certificado_documento, revision2.token, revision2.hash);
    })), (documento) => {
      this.mostrarDocumentoPersistido(documento);
      this.actualizarBeneficiariosPersistidos();
    });
  }
  cambiosCertificados = inject(CambiosCertificadosService);
  actualizarBeneficiariosPersistidos() {
    this.cambiosCertificados.confirmar();
    const d = this.destinoBeneficiarios;
    if (!d)
      return;
    const tipo = this.filtrosPendientes.controls.tipo.value;
    this.consultaBeneficiarios?.unsubscribe();
    this.consultaBeneficiarios = this.api.beneficiariosCertificacion(d.origen, d.sesion ?? d.actividad, {
      id_actividad: d.actividad,
      id_sesion: d.sesion,
      id_tipo_certificado: tipo,
      page: this.evaluacion()?.beneficiarios.current_page ?? 1
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (r) => {
        if (this.destinoBeneficiarios === d && this.filtrosPendientes.controls.tipo.value === tipo && r.origen === d.origen && Number(r.contexto.id_actividad) === d.actividad && (d.origen !== "sesion" || Number(r.contexto.id_sesion) === d.sesion))
          this.evaluacion.set(r);
      },
      error: () => this.errorBeneficiarios.set("Actualiza el estado de los beneficiarios.")
    });
    this.cargarPendientes();
  }
  confirmarRemision() {
    if (!this.revisionEnvio() || !this.puedeRemitir() || this.operando())
      return;
    if (!this.revisionEnvioVigente())
      return;
    this.confirmacionEnvio().abrir();
  }
  remitirAGerencia(evento) {
    const revision = this.revisionEnvio();
    if (!evento || evento.detail > 1 || !revision || !this.puedeRemitir() || this.operando())
      return;
    if (!this.revisionEnvioVigente())
      return;
    this.operar(this.documentosApi.confirmarEnvio(this.documentoPreparado().id_certificado_documento, revision.token, revision.hash), (doc) => {
      this.mostrarDocumentoPersistido(doc);
      this.confirmacionEnvio().cerrar();
    });
  }
  revisionEnvioVigente() {
    const revision = this.revisionEnvio();
    if (revision && Date.parse(revision.expiresAt) > Date.now())
      return true;
    this.revisionEnvio.set(null);
    this.confirmacionEnvio().cerrar();
    this.errorOperacion.set("La revisi\xF3n venci\xF3. Revise nuevamente el documento.");
    return false;
  }
  operar(solicitud, recibir) {
    if (this.operando())
      return;
    this.errorOperacion.set(null);
    this.operando.set(true);
    this.operacion = solicitud.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (resultado) => {
        this.operando.set(false);
        recibir(resultado);
      },
      error: (error) => {
        this.operando.set(false);
        this.errorOperacion.set(mensajeEtapaA(error));
        this.confirmacionEnvio().cerrar();
        if (error.status === 409) {
          if (this.documentoPreparado())
            this.revisionEnvio.set(null);
          else {
            this.revisionPdf.set(null);
            this.revisoPrevia.set(false);
          }
        }
      }
    });
  }
  invalidarPrevia() {
    this.operacion?.unsubscribe();
    this.operando.set(false);
    this.errorOperacion.set(null);
    this.revisionPdf.set(null);
    this.revisionEnvio.set(null);
    this.documentoPreparado.set(null);
    this.enviado.set(false);
    this.solicitudPrevia?.unsubscribe();
    this.pdfPrevio.set(null);
    this.generandoPrevia.set(false);
    this.revisoPrevia.set(false);
    this.errorPrevia.set(null);
  }
  editarMensaje() {
    this.invalidarPrevia();
    this.pasoBeneficiario.set(2);
  }
  continuarConfirmacion() {
    if (this.pdfPrevio()?.mensaje !== this.mensajeCertificado.value || this.pdfPrevio()?.clave !== this.claveBorrador() || this.generandoPrevia() || this.operando() || !this.revisionPdf())
      return;
    this.revisoPrevia.set(true);
    this.guardarParaFirma();
  }
  previsualizarPdf() {
    if (this.generandoPrevia())
      return;
    this.mensajeCertificado.markAsTouched();
    const v = this.revisionBeneficiario();
    if (!v || this.mensajeCertificado.invalid)
      return;
    const sesion = Number(v.beneficiario.id_sesion);
    const participacion = v.beneficiario.id_participacion;
    const tipo = Number(v.tipo.id_tipo_certificado);
    if (!this.puedeRevisar(v.beneficiario, v.evaluacion) || v.evaluacion.origen !== "sesion" || ![sesion, participacion, tipo].every((id) => Number.isSafeInteger(id) && id > 0)) {
      this.errorPrevia.set("No se pudo confirmar la sesi\xF3n, participaci\xF3n y tipo de certificado.");
      return;
    }
    const mensaje = this.mensajeCertificado.value;
    const clave = this.claveBorrador();
    this.invalidarPrevia();
    this.generandoPrevia.set(true);
    this.solicitudPrevia = this.documentosApi.vistaPrevia(sesion, participacion, tipo, mensaje).pipe(switchMap((resultado) => resultado.datos.siguiente_accion_preparacion === "revisar_documento" && this.modalidadFirma() ? this.documentosApi.revisarPreparacion(sesion, participacion, tipo, mensaje, this.modalidadFirma()).pipe(map((revision) => {
      this.revisionPdf.set(revision);
      return __spreadProps(__spreadValues({}, resultado), { archivo: revision.archivo });
    })) : of(resultado)), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (resultado) => {
        if (clave !== this.claveBorrador() || mensaje !== this.mensajeCertificado.value)
          return;
        this.generandoPrevia.set(false);
        if (Number(resultado.datos.contexto.id_persona) !== v.beneficiario.id_persona || Number(resultado.datos.contexto.id_actividad) !== v.beneficiario.id_actividad) {
          this.errorPrevia.set("Laravel devolvi\xF3 un PDF de otro contexto.");
          return;
        }
        this.pdfPrevio.set(__spreadProps(__spreadValues({}, resultado), { mensaje, clave }));
        this.pasoBeneficiario.set(3);
      },
      error: (e) => {
        this.generandoPrevia.set(false);
        this.errorPrevia.set(mensajeEtapaA(e));
      }
    });
  }
  borradoresMensaje = /* @__PURE__ */ new Map();
  claveBorrador() {
    const v = this.revisionBeneficiario();
    return v ? [v.beneficiario.id_persona, v.beneficiario.id_participacion, v.evaluacion.contexto.id_actividad, v.beneficiario.id_sesion, v.tipo.id_tipo_certificado].join(":") : null;
  }
  textoSugerido() {
    const v = this.revisionBeneficiario();
    if (!v)
      return "";
    const fecha = v.sesion?.["fecha"] ?? (v.evaluacion.origen === "actividad" ? v.actividad?.["fecha_inicio"] : null);
    let fechaTexto = "";
    if (typeof fecha === "string" && !Number.isNaN(Date.parse(fecha)))
      fechaTexto = formatDate(fecha, "dd/MM/yyyy", "en-US");
    return `Por su participaci\xF3n en la actividad ${v.evaluacion.contexto.nombre_actividad}${v.evaluacion.contexto.nombre_sesion ? ", correspondiente a la sesi\xF3n " + v.evaluacion.contexto.nombre_sesion : ""}${fechaTexto ? ", realizada el " + fechaTexto : ""}, organizada por la Municipalidad Distrital de Morales.`;
  }
  avanzarBeneficiario() {
    if (!this.revisionBeneficiario())
      return;
    if (this.pasoBeneficiario() === 1)
      this.pasoBeneficiario.set(2);
    else if (this.pasoBeneficiario() === 2) {
      this.mensajeCertificado.markAsTouched();
      if (this.mensajeCertificado.valid)
        this.previsualizarPdf();
    }
  }
  estadoBeneficiario = estadoBeneficiario;
  motivosPreparacion = motivosPreparacion;
  motivoEmision = motivoEmision;
  revisionBeneficiario = signal(null);
  cargandoRevision = signal(false);
  errorRevision = signal(null);
  consultaRevision;
  cerrarRevision() {
    this.invalidarPrevia();
    const clave = this.claveBorrador();
    if (clave)
      this.borradoresMensaje.set(clave, this.mensajeCertificado.value);
    this.consultaRevision?.unsubscribe();
    this.revisionBeneficiario.set(null);
    this.errorRevision.set(null);
    this.cargandoRevision.set(false);
    this.pasoBeneficiario.set(1);
  }
  puedeRevisar(b, r) {
    return this.auth.tienePermiso("participantes.ver") && this.evaluacion() === r && r.beneficiarios.data.includes(b) && !b.id_certificado && !b.id_certificado_documento && !b.id_preparacion && mismoContexto(b, r) && this.tiposEvaluacion().some((t) => Number(t.id_tipo_certificado) === Number(b.id_tipo_certificado));
  }
  revisarBeneficiario(b, r) {
    if (!this.puedeRevisar(b, r))
      return;
    this.cerrarRevision();
    this.cargandoRevision.set(true);
    this.modalidadFirma.set("Paralela");
    const tipo = this.tiposEvaluacion().find((t) => Number(t.id_tipo_certificado) === Number(b.id_tipo_certificado));
    const actividadId = Number(r.contexto.id_actividad);
    const sesionId = r.origen === "sesion" ? Number(r.contexto.id_sesion) : null;
    const actividad = [this.contexto().actividad, ...this.actividadesFiltro()].find((a) => a && Number(a["id_actividad"]) === actividadId) ?? null;
    const sesion = [this.contexto().sesion, ...this.sesionesFiltro()].find((s) => s && Number(s["id_actividad_sesion"]) === sesionId && Number(s["id_actividad"]) === actividadId) ?? null;
    const consultar = this.auth.tienePermiso("actividades.ver");
    this.consultaRevision = forkJoin({
      actividad: actividad ? of(actividad) : consultar ? this.api.obtener("activity", actividadId) : of(null),
      sesion: sesion || sesionId === null ? of(sesion) : consultar ? this.api.obtener("activity-session", sesionId) : of(null)
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (datos) => {
        this.cargandoRevision.set(false);
        if (this.evaluacion() !== r || datos.actividad && Number(datos.actividad["id_actividad"]) !== actividadId || datos.sesion && (Number(datos.sesion["id_actividad_sesion"]) !== sesionId || Number(datos.sesion["id_actividad"]) !== actividadId)) {
          this.errorRevision.set("Laravel no confirm\xF3 el contexto de la revisi\xF3n.");
          return;
        }
        if (datos.actividad && !this.actividadesFiltro().some((a) => Number(a["id_actividad"]) === actividadId))
          this.actividadesFiltro.update((a) => [...a, datos.actividad]);
        if (datos.sesion && !this.sesionesFiltro().some((s) => Number(s["id_actividad_sesion"]) === sesionId))
          this.sesionesFiltro.update((s) => [...s, datos.sesion]);
        this.revisionBeneficiario.set(__spreadValues({ beneficiario: b, tipo, evaluacion: r }, datos));
        this.mensajeCertificado.setValue(this.borradoresMensaje.get(this.claveBorrador()) ?? this.textoSugerido());
        this.mensajeCertificado.markAsUntouched();
        this.pasoBeneficiario.set(1);
      },
      error: (e) => {
        this.cargandoRevision.set(false);
        this.errorRevision.set(this.mensajeConsulta(e));
      }
    });
  }
  route = inject(ActivatedRoute);
  router = inject(Router);
  seleccionarPonente = this.router.getCurrentNavigation()?.extras.state?.["seleccionarPonente"] === true;
  escrituraAutorizada = inject(ESCRITURA_EMISION_AUTORIZADA);
  formulario = viewChild(FormularioCertificadoComponent);
  contextosFormulario = signal([contextoParametros(this.route.snapshot.queryParamMap)]);
  modo = signal("existente");
  api = inject(EmisionCertificadosService);
  documentosApi = inject(DocumentosDigitalesService);
  generado = signal(null);
  generando = signal(false);
  errorGeneracion = signal(null);
  enlaceVerificacion = enlaceVerificacionSeguro;
  generacion;
  puedeGenerarPdf() {
    const registro = this.seleccion()?.registro;
    return this.contexto().general && !!registro?.id_certificado && !!registro.id_participacion && !registro.id_practica && !registro.id_reconocimiento && this.auth.tienePermiso("emision.crear") && !this.cargando() && !this.error() && !this.generando();
  }
  generarPdf() {
    if (!this.puedeGenerarPdf() || this.generado())
      return;
    this.generando.set(true);
    this.errorGeneracion.set(null);
    this.generacion = this.documentosApi.generar(this.seleccion().registro.id_certificado).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (documento) => {
        this.generado.set(documento);
        this.generando.set(false);
      },
      error: (e) => {
        this.errorGeneracion.set(mensajeDocumento(e));
        this.generando.set(false);
      }
    });
  }
  practicas = inject(PracticeService);
  auth = inject(AuthService);
  seccion = signal("pendientes");
  preparacionesVisitadas = signal(false);
  viendoBeneficiarios = signal(false);
  elegibilidad = signal("");
  volverPendientes() {
    this.cerrarRevision();
    this.viendoBeneficiarios.set(false);
  }
  contexto = toSignal(this.route.queryParamMap.pipe(map(solicitarContexto), distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)), switchMap((solicitud) => {
    const base = { general: solicitud.modalidad === "general", modalidad: null, cargando: false, error: null, actividad: null, sesion: null };
    if (solicitud.modalidad === "general")
      return of(base);
    if (solicitud.modalidad === "invalido")
      return of(__spreadProps(__spreadValues({}, base), { error: solicitud.error }));
    base.modalidad = solicitud.modalidad;
    if (!this.auth.tienePermiso("actividades.ver"))
      return of(__spreadProps(__spreadValues({}, base), { error: "No tienes permiso para verificar la actividad y su sesi\xF3n." }));
    return forkJoin({
      actividad: this.api.obtener("activity", solicitud.actividad),
      sesion: solicitud.sesion === null ? of(null) : this.api.obtener("activity-session", solicitud.sesion)
    }).pipe(map(({ actividad, sesion }) => {
      if (Number(actividad["id_actividad"]) !== solicitud.actividad || typeof actividad["nombre"] !== "string" || !actividad["nombre"].trim() || solicitud.sesion !== null && (!sesion || Number(sesion["id_actividad_sesion"]) !== solicitud.sesion || Number(sesion["id_actividad"]) !== solicitud.actividad || typeof sesion["nombre"] !== "string" || !sesion["nombre"].trim())) {
        throw new Error("Laravel no confirm\xF3 la correspondencia entre la actividad y la sesi\xF3n.");
      }
      return __spreadProps(__spreadValues({}, base), { actividad, sesion });
    }), catchError((error) => of(__spreadProps(__spreadValues({}, base), { error: error instanceof Error ? "No se pudo confirmar la actividad y sesi\xF3n seleccionadas." : mensajeEtapaA(error) }))), startWith(__spreadProps(__spreadValues({}, base), { cargando: true })));
  })), { initialValue: { general: solicitarContexto(this.route.snapshot.queryParamMap).modalidad === "general", modalidad: null, cargando: false, error: null, actividad: null, sesion: null } });
  destroyRef = inject(DestroyRef);
  carga;
  paso = signal(1);
  seleccion = signal(null);
  origen = signal(null);
  reconocimiento = signal(null);
  asignaciones = signal([]);
  error = signal(null);
  cargando = signal(false);
  estado = etiquetaEstado;
  pasos = ["Seleccionar origen y registro", "Preparar certificado", "Revisar documento", "Generar y emitir"];
  revision = inject(NonNullableFormBuilder).group({ datos: [false, Validators.requiredTrue], origen: [false, Validators.requiredTrue] });
  filtrosPendientes = inject(NonNullableFormBuilder).group({ origen: this.origenInicial(this.route.snapshot.queryParamMap), actividad: "", sesion: "", tipo: "", cantidad: "20" });
  origenInicial(parametros) {
    const origen = parametros.get("origen_documental");
    return origen === "reconocimiento" || origen === "practica" ? origen : "sesion";
  }
  pestanaOrigen() {
    const origen = this.filtrosPendientes.controls.origen.value;
    return origen === "reconocimiento" || origen === "practica" ? origen : "capacitacion";
  }
  ambitoCapacitacion = "sesion";
  seleccionarOrigen(origen) {
    if (this.operando() || this.generando() || this.pestanaOrigen() === origen)
      return;
    if (!this.contexto().general) {
      void this.router.navigate(["/certificaciones/generar-emitir"], { queryParams: origen === "capacitacion" ? {} : { origen_documental: origen } });
      return;
    }
    if (this.pestanaOrigen() === "capacitacion")
      this.ambitoCapacitacion = this.filtrosPendientes.controls.origen.value === "actividad" ? "actividad" : "sesion";
    this.cerrarRevision();
    this.consultaBeneficiarios?.unsubscribe();
    this.consultaPendientes?.unsubscribe();
    this.evaluacion.set(null);
    this.viendoBeneficiarios.set(false);
    this.destinoBeneficiarios = null;
    this.cargandoPendientes.set(false);
    this.cargandoBeneficiarios.set(false);
    this.filtrosPendientes.controls.origen.setValue(origen === "capacitacion" ? this.ambitoCapacitacion : origen);
    if (origen === "capacitacion") {
      this.cargarPendientes();
      this.cargarCatalogosEvaluacion();
    }
  }
  cambiarActividadFiltro() {
    this.filtrosPendientes.controls.sesion.setValue("");
  }
  sesionBeneficiarios() {
    const id = this.destinoBeneficiarios?.sesion;
    return this.contexto().sesion ?? this.sesionesFiltro().find((s) => Number(s["id_actividad_sesion"]) === id) ?? null;
  }
  contextoPonentes() {
    const d = this.destinoBeneficiarios;
    return d?.origen === "sesion" && d.sesion !== null && Number.isSafeInteger(d.sesion) && d.sesion > 0 && !this.contexto().error && !this.contexto().cargando ? { actividad: d.actividad, sesion: d.sesion } : null;
  }
  sesionesFiltro = signal([]);
  pendientes = signal(null);
  evaluacion = signal(null);
  cargandoPendientes = signal(false);
  cargandoBeneficiarios = signal(false);
  errorPendientes = signal(null);
  errorBeneficiarios = signal(null);
  errorCatalogos = signal(null);
  tiposEvaluacion = signal([]);
  actividadesFiltro = signal([]);
  destinoBeneficiarios = null;
  consultaPendientes;
  consultaBeneficiarios;
  consultaCatalogos;
  catalogosCargados = false;
  constructor() {
    this.mensajeCertificado.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.invalidarPrevia());
    if (solicitarContexto(this.route.snapshot.queryParamMap).modalidad === "general") {
      this.cargarPendientes();
      this.cargarCatalogosEvaluacion();
    }
    effect(() => {
      const ctx = this.contexto();
      if (!ctx.general && ctx.actividad && !ctx.error && !ctx.cargando)
        untracked(() => {
          const parametros = this.route.snapshot.queryParamMap;
          const tipoRetorno = parametros.get("origen") === "ponente_sesion" ? parametros.get("id_tipo_certificado") : null;
          this.filtrosPendientes.patchValue({
            origen: ctx.modalidad,
            actividad: String(ctx.actividad["id_actividad"]),
            tipo: /^[1-9]\d*$/.test(tipoRetorno ?? "") ? tipoRetorno : ""
          });
          this.destinoBeneficiarios = { origen: ctx.modalidad, actividad: Number(ctx.actividad["id_actividad"]), sesion: ctx.sesion ? Number(ctx.sesion["id_actividad_sesion"]) : null };
          this.viendoBeneficiarios.set(true);
          this.cargarPendientes();
          this.cargarCatalogosEvaluacion();
        });
    }, { allowSignalWrites: true });
    let contexto = contextoParametros(this.route.snapshot.queryParamMap);
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((parametros) => {
      const siguiente = contextoParametros(parametros);
      if (siguiente === contexto)
        return;
      contexto = siguiente;
      this.cerrarRevision();
      this.generacion?.unsubscribe();
      this.generado.set(null);
      this.generando.set(false);
      this.carga?.unsubscribe();
      this.seleccion.set(null);
      this.error.set(null);
      this.cargando.set(false);
      this.consultaPendientes?.unsubscribe();
      this.consultaBeneficiarios?.unsubscribe();
      this.consultaCatalogos?.unsubscribe();
      this.pendientes.set(null);
      this.evaluacion.set(null);
      this.destinoBeneficiarios = null;
      this.cargandoPendientes.set(false);
      this.cargandoBeneficiarios.set(false);
      this.errorPendientes.set(null);
      this.errorBeneficiarios.set(null);
      this.filtrosPendientes.reset({ origen: this.origenInicial(parametros), actividad: "", tipo: "", cantidad: "20" });
      this.catalogosCargados = false;
      this.tiposEvaluacion.set([]);
      this.actividadesFiltro.set([]);
      this.contextosFormulario.set([siguiente]);
      const general = solicitarContexto(parametros).modalidad === "general";
      this.seccion.set("pendientes");
      this.preparacionesVisitadas.set(false);
      this.viendoBeneficiarios.set(false);
      this.modo.set("existente");
      this.paso.set(1);
      if (general) {
        this.cargarPendientes();
        this.cargarCatalogosEvaluacion();
      }
    });
  }
  seleccionar(seleccion, preparado = false) {
    if (!this.contexto().general || seleccion.registro.id_certificado === null)
      return;
    this.generacion?.unsubscribe();
    this.generado.set(null);
    this.generando.set(false);
    this.errorGeneracion.set(null);
    this.carga?.unsubscribe();
    this.seleccion.set(seleccion);
    this.origen.set(null);
    this.reconocimiento.set(null);
    this.asignaciones.set([]);
    this.error.set(null);
    this.revision.reset();
    this.paso.set(preparado ? 3 : 2);
    this.cargando.set(true);
    const fila = seleccion.registro;
    if ([fila.id_participacion, fila.id_practica, fila.id_reconocimiento].filter((id) => id !== null).length !== 1) {
      this.error.set("El certificado debe tener exactamente un origen v\xE1lido.");
      this.cargando.set(false);
      return;
    }
    const permisos = fila.id_participacion ? "participantes.ver" : fila.id_practica ? "practicantes.ver" : "reconocimientos.ver";
    if (!this.auth.tienePermiso(permisos)) {
      this.error.set(`No tienes el permiso ${permisos} para revisar este origen.`);
      this.cargando.set(false);
      return;
    }
    const origen = fila.id_participacion ? this.api.obtener("participation", fila.id_participacion).pipe(switchMap((participacion) => this.api.obtener("activity", Number(participacion["id_actividad"])).pipe(map((actividad) => ({ texto: `Participaci\xF3n #${fila.id_participacion} \xB7 ${actividad["nombre"]}`, actividad: Number(actividad["id_actividad"]), reconocimiento: null }))))) : fila.id_reconocimiento ? this.api.obtener("reconocimientos", fila.id_reconocimiento).pipe(map((registro) => ({ texto: `Reconocimiento #${registro.id_reconocimiento} \xB7 ${registro.titulo}`, actividad: null, reconocimiento: registro }))) : fila.id_practica ? this.practicas.obtener(fila.id_practica).pipe(map((practica) => ({ texto: `Pr\xE1ctica #${practica.id_practica} \xB7 ${practica.carrera} \xB7 ${practica.fecha_inicio} \u2013 ${practica.fecha_fin ?? "Sin fin registrado"}`, actividad: null, reconocimiento: null }))) : of({ texto: "No hay origen asociado", actividad: null, reconocimiento: null });
    this.carga = origen.pipe(switchMap((datos) => forkJoin({
      documentos: preparado ? this.api.documentosIdentidad().pipe(catchError(() => of({}))) : of(null),
      datos: of(datos),
      asignaciones: datos.actividad && this.auth.tienePermiso("ponentes-firmantes.ver") ? this.api.listarTodos("actividades-firmas", { id_actividad: datos.actividad }).pipe(catchError((error) => {
        this.error.set(mensajeEtapaA(error));
        return of(null);
      })) : of(null)
    })), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: ({ datos, asignaciones, documentos }) => {
        if (documentos)
          this.seleccion.set(__spreadProps(__spreadValues({}, seleccion), { dni: documentos[fila.id_persona] ?? null }));
        this.origen.set(datos.texto);
        this.reconocimiento.set(datos.reconocimiento);
        this.asignaciones.set((asignaciones ?? []).map((firma) => ({ firma: firma.id_firma, orden: firma.orden_firma })).sort((a, b) => a.orden - b.orden));
        this.cargando.set(false);
      },
      error: (error) => {
        this.error.set(error instanceof Error ? "No se pudo completar la operaci\xF3n. Intente nuevamente." : mensajeEtapaA(error));
        this.cargando.set(false);
      }
    });
  }
  avanzar() {
    if (!this.contexto().general)
      return;
    if (!this.seleccion() || this.cargando() || this.error())
      return;
    if (this.paso() === 2) {
      this.revision.markAllAsTouched();
      if (this.revision.invalid || !this.origen() || this.error())
        return;
    }
    this.paso.update((paso) => Math.min(4, paso + 1));
  }
  volver() {
    this.paso.update((paso) => Math.max(1, paso - 1));
  }
  cancelar() {
    if (this.generando())
      return;
    this.generacion?.unsubscribe();
    this.generado.set(null);
    this.carga?.unsubscribe();
    this.seleccion.set(null);
    this.error.set(null);
    this.cargando.set(false);
    this.revision.reset();
    this.modo.set("existente");
    this.paso.set(1);
    void this.router.navigate([], { relativeTo: this.route, queryParams: {}, replaceUrl: true });
  }
  nuevo() {
    if (!this.contexto().general || !this.auth.tienePermiso("emision.crear"))
      return;
    this.seleccion.set(null);
    this.modo.set("nuevo");
    this.paso.set(1);
  }
  cambiarSeccion(seccion) {
    this.seccion.set(seccion);
    if (seccion === "preparaciones" && this.contexto().general)
      this.preparacionesVisitadas.set(true);
    if (seccion === "pendientes" && !this.pendientes() && !this.cargandoPendientes() && !this.contexto().error && !this.contexto().cargando) {
      this.cargarPendientes();
      this.cargarCatalogosEvaluacion();
    }
  }
  nombreTipoEvaluacion(id) {
    return id === null ? "Sin tipo determinado" : this.tiposEvaluacion().find((t) => Number(t.id_tipo_certificado) === Number(id))?.nombre_tipo ?? "Nombre no disponible";
  }
  mensajeConsulta(error) {
    return mensajeEtapaA(error);
  }
  cargarCatalogosEvaluacion() {
    if (this.pestanaOrigen() !== "capacitacion")
      return;
    if (this.catalogosCargados)
      return;
    this.catalogosCargados = true;
    this.errorCatalogos.set(null);
    this.consultaCatalogos = forkJoin({
      tipos: this.api.listarTodos("tipos-certificado"),
      actividades: this.contexto().general ? this.api.listarTodos("activity") : of([]),
      sesiones: this.contexto().general ? this.api.listarTodos("activity-session") : of([])
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (datos) => {
        this.tiposEvaluacion.set(datos.tipos.filter((t) => t.estado === true || String(t.estado) === "1"));
        this.actividadesFiltro.set(datos.actividades);
        this.sesionesFiltro.set(datos.sesiones);
        if (this.route.snapshot.queryParamMap.get("origen") === "ponente_sesion" && this.route.snapshot.queryParamMap.has("id_tipo_certificado") && this.destinoBeneficiarios && this.tiposEvaluacion().some((t) => String(t.id_tipo_certificado) === this.filtrosPendientes.controls.tipo.value))
          this.cargarBeneficiarios();
      },
      error: (error) => {
        this.catalogosCargados = false;
        this.errorCatalogos.set(this.mensajeConsulta(error));
      }
    });
  }
  aplicarFiltrosPendientes() {
    this.cerrarRevision();
    this.consultaBeneficiarios?.unsubscribe();
    this.evaluacion.set(null);
    if (this.contexto().general)
      this.destinoBeneficiarios = null;
    if (["practica", "reconocimiento"].includes(this.filtrosPendientes.controls.origen.value))
      return;
    this.cargarPendientes();
    if (this.destinoBeneficiarios)
      this.cargarBeneficiarios();
  }
  cargarPendientes(pagina = 1) {
    const ctx = this.contexto();
    if (ctx.error || ctx.cargando || ["practica", "reconocimiento"].includes(this.filtrosPendientes.controls.origen.value))
      return;
    this.consultaPendientes?.unsubscribe();
    this.errorPendientes.set(null);
    this.cargandoPendientes.set(true);
    const f = this.filtrosPendientes.getRawValue();
    const origen = ctx.general ? f.origen === "actividad" ? "actividad" : "sesion" : ctx.modalidad;
    const actividad = ctx.general ? f.actividad : String(ctx.actividad["id_actividad"]);
    this.consultaPendientes = this.api.pendientesCertificacion({
      origen,
      id_actividad: actividad || null,
      id_sesion: !ctx.general && ctx.sesion ? Number(ctx.sesion["id_actividad_sesion"]) : f.sesion || null,
      id_tipo_certificado: f.tipo || null,
      page: pagina,
      per_page: Number(f.cantidad)
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (datos) => {
        this.cargandoPendientes.set(false);
        if (!Array.isArray(datos.data) || datos.data.some((r) => r.origen !== origen || actividad && Number(r.id_actividad) !== Number(actividad) || !ctx.general && ctx.sesion && Number(r.id_sesion) !== Number(ctx.sesion["id_actividad_sesion"]))) {
          this.pendientes.set(null);
          this.errorPendientes.set("Laravel devolvi\xF3 registros de otro contexto.");
          return;
        }
        this.pendientes.set(datos);
      },
      error: (error) => {
        this.cargandoPendientes.set(false);
        this.pendientes.set(null);
        this.errorPendientes.set(this.mensajeConsulta(error));
      }
    });
  }
  consultarBeneficiarios(fila) {
    this.elegibilidad.set("");
    if (!this.filtrosPendientes.controls.tipo.value) {
      const compatibles = this.tiposEvaluacion().filter((t) => fila.tipos_certificado_permitidos?.includes(Number(t.id_tipo_certificado)));
      if (compatibles.length === 1)
        this.filtrosPendientes.controls.tipo.setValue(String(compatibles[0].id_tipo_certificado));
    }
    this.viendoBeneficiarios.set(true);
    this.destinoBeneficiarios = { origen: fila.origen, actividad: Number(fila.id_actividad), sesion: fila.id_sesion === null ? null : Number(fila.id_sesion) };
    this.cargarBeneficiarios();
  }
  cargarBeneficiarios(pagina = 1) {
    this.cerrarRevision();
    const d = this.destinoBeneficiarios;
    if (!d)
      return;
    this.consultaBeneficiarios?.unsubscribe();
    this.evaluacion.set(null);
    this.errorBeneficiarios.set(null);
    if (!this.auth.tienePermiso("participantes.ver")) {
      this.errorBeneficiarios.set("No tienes el permiso participantes.ver para consultar beneficiarios.");
      return;
    }
    const tipo = this.filtrosPendientes.controls.tipo.value;
    if (!this.tiposEvaluacion().some((t) => String(t.id_tipo_certificado) === tipo)) {
      this.errorBeneficiarios.set("Selecciona un tipo de certificado v\xE1lido para consultar beneficiarios.");
      return;
    }
    this.cargandoBeneficiarios.set(true);
    this.consultaBeneficiarios = this.api.beneficiariosCertificacion(d.origen, d.sesion ?? d.actividad, {
      origen: d.origen,
      id_actividad: d.actividad,
      id_sesion: d.sesion,
      id_tipo_certificado: this.filtrosPendientes.controls.tipo.value || null,
      page: pagina,
      per_page: Number(this.filtrosPendientes.controls.cantidad.value)
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (datos) => {
        this.cargandoBeneficiarios.set(false);
        if (datos.origen !== d.origen || Number(datos.contexto.id_actividad) !== d.actividad || d.origen === "sesion" && Number(datos.contexto.id_sesion) !== d.sesion || datos.beneficiarios.data.some((b) => Number(b.id_actividad) !== d.actividad || (d.origen === "sesion" ? Number(b.id_sesion) !== d.sesion : b.id_sesion !== null))) {
          this.errorBeneficiarios.set("Laravel devolvi\xF3 beneficiarios de otro contexto.");
          return;
        }
        this.evaluacion.set(datos);
      },
      error: (error) => {
        this.cargandoBeneficiarios.set(false);
        this.errorBeneficiarios.set(this.mensajeConsulta(error));
      }
    });
  }
  teclearSecciones(evento) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(evento.key))
      return;
    evento.preventDefault();
    const destino = evento.key === "Home" ? "pendientes" : evento.key === "End" ? "preparaciones" : this.seccion() === "pendientes" ? "preparaciones" : "pendientes";
    this.cambiarSeccion(destino);
    evento.currentTarget.querySelector("#emision-tab-" + destino)?.focus();
  }
  static \u0275fac = function GenerarEmitirComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _GenerarEmitirComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _GenerarEmitirComponent, selectors: [["app-generar-emitir"]], viewQuery: function GenerarEmitirComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuerySignal(ctx.confirmacionEnvio, _c02, 5);
      \u0275\u0275viewQuerySignal(ctx.formulario, FormularioCertificadoComponent, 5);
    }
    if (rf & 2) {
      \u0275\u0275queryAdvance(2);
    }
  }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 19, vars: 13, consts: [["confirmacionEnvio", ""], [1, "titulo-emision"], ["role", "status"], ["aria-label", "Contexto de certificaci\xF3n", 1, "card", "contexto-certificacion"], ["role", "alert", 1, "alert", "alert-error"], ["id", "emision-pendientes", "role", "tabpanel", "aria-label", "Pendientes de certificaci\xF3n", 1, "card"], ["aria-label", "Proceso documental", 1, "pasos"], [1, "acciones"], ["titulo", "Enviar documento a Gerencia", 3, "cierreSolicitado", "cierreControlado"], ["type", "button", 1, "btn", 3, "click", "disabled"], ["type", "button", 1, "btn", "btn-primary", 3, "click", "disabled"], ["aria-hidden", "true", 1, "material-symbols-outlined"], ["title", "Generar y emitir"], ["type", "button", "title", "Volver a pendientes", "aria-label", "Volver a pendientes", 1, "regresar-beneficiarios", 3, "disabled"], ["type", "button", "title", "Volver a pendientes", "aria-label", "Volver a pendientes", 1, "regresar-beneficiarios", 3, "click", "disabled"], ["routerLink", "/certificaciones/actividades", 1, "btn", 3, "queryParams"], [3, "actual", "bloqueado"], [1, "titulo-pendientes"], [3, "seleccion", "actual", "bloqueado"], [1, "filtros", 3, "formGroup"], [1, "filtros", 3, "ngSubmit", "formGroup"], ["formControlName", "origen", 1, "input"], ["value", "sesion"], ["value", "actividad"], ["formControlName", "actividad", 1, "input", 3, "change"], ["value", ""], [3, "value"], ["formControlName", "sesion", 1, "input"], ["formControlName", "tipo", 1, "input"], ["formControlName", "cantidad", 1, "input"], ["value", "10"], ["value", "20"], ["value", "50"], ["value", "100"], ["type", "submit", 1, "btn", 3, "disabled"], ["role", "alert"], ["type", "button", 1, "btn", 3, "click"], [1, "tabla"], [1, "table", "pendientes-certificacion"], [1, "sr-only"], [1, "col-centro"], ["type", "button", "aria-label", "Consultar beneficiarios", "title", "Consultar beneficiarios", 1, "btn", 3, "click", "disabled"], ["colspan", "8"], [1, "cabecera-sesion"], [1, "filtros"], [3, "hidden"], ["type", "button", "title", "Volver a pendientes", "aria-label", "Volver a pendientes", 1, "regresar-beneficiarios", 3, "click"], [1, "input", 3, "change", "formControl"], [1, "input", 3, "change"], ["aria-label", "Asistente del beneficiario seleccionado"], [1, "estado-sesion", 3, "finalizada"], ["aria-label", "Resumen de asistencia", 1, "asistencia-indicadores"], ["role", "status", 1, "motivo-certificacion"], [1, "estado-sesion"], [1, "asistencia-tarjeta"], [1, "encabezado-revision"], ["type", "button", "title", "Volver a beneficiarios", "aria-label", "Volver a beneficiarios", 1, "regresar-beneficiarios", 3, "click", "disabled"], ["aria-label", "Pasos del certificado", 1, "pasos", "pasos-beneficiario"], [1, "datos"], ["type", "button", 1, "btn", "btn-primary", 3, "click"], ["for", "mensaje-certificado"], ["id", "mensaje-certificado", "rows", "8", 1, "input", "editor-mensaje", 3, "formControl"], ["id", "mensaje-error", "role", "alert"], [3, "archivoPrevio", "compacto"], [3, "documentoId", "hashEsperado", "flujoFirmas", "compacto"], ["routerLink", "/pendientes/documentos-firmar", 1, "btn", 3, "queryParams"], [1, "titulo-grupo"], [1, "table", "beneficiarios-certificacion"], ["scope", "col", 1, "col-centro", "col-numero"], [1, "col-centro", "col-numero"], ["scope", "row"], ["type", "button", 1, "btn", "btn-consulta", 3, "disabled"], ["type", "button", 1, "btn", "btn-consulta", 3, "click", "disabled"], [3, "actividadNombre", "sesionNombre", "actividadId", "sesionId"], [3, "actual"], [3, "cambioPaso", "preparado", "cancelado", "falloGuardado", "integrado", "paso"], [1, "card"], ["type", "button", 1, "btn", 3, "disabled"], [3, "formGroup"], ["type", "checkbox", "formControlName", "datos"], ["type", "checkbox", "formControlName", "origen"], [3, "certificado", "beneficiario", "dni", "tipo", "origen", "reconocimiento"], ["type", "button", "disabled", "", 1, "btn"], ["routerLink", "/certificaciones/certificados/documentos", 1, "btn", 3, "queryParams"], ["target", "_blank", "rel", "noopener noreferrer", 1, "btn", 3, "href"], [3, "documentoId"]], template: function GenerarEmitirComponent_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275template(0, GenerarEmitirComponent_Conditional_0_Template, 5, 1, "header", 1)(1, GenerarEmitirComponent_Conditional_1_Template, 2, 0, "p", 2)(2, GenerarEmitirComponent_Conditional_2_Template, 4, 2, "section", 3)(3, GenerarEmitirComponent_Conditional_3_Template, 2, 1, "p", 4)(4, GenerarEmitirComponent_Conditional_4_Template, 5, 4, "section", 5)(5, GenerarEmitirComponent_Conditional_5_Template, 3, 0, "ol", 6)(6, GenerarEmitirComponent_Conditional_6_Template, 2, 0)(7, GenerarEmitirComponent_Conditional_7_Template, 2, 0, "p", 2)(8, GenerarEmitirComponent_Conditional_8_Template, 2, 1, "p", 4)(9, GenerarEmitirComponent_Conditional_9_Template, 7, 5, "nav", 7);
      \u0275\u0275elementStart(10, "app-dialogo", 8, 0);
      \u0275\u0275listener("cierreSolicitado", function GenerarEmitirComponent_Template_app_dialogo_cierreSolicitado_10_listener() {
        \u0275\u0275restoreView(_r1);
        const confirmacionEnvio_r50 = \u0275\u0275reference(11);
        return \u0275\u0275resetView(!ctx.operando() && confirmacionEnvio_r50.cerrar());
      });
      \u0275\u0275elementStart(12, "p");
      \u0275\u0275text(13, "Se enviar\xE1 el PDF almacenado a Gerencia y quedar\xE1 pendiente de firma.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "div", 7)(15, "button", 9);
      \u0275\u0275listener("click", function GenerarEmitirComponent_Template_button_click_15_listener() {
        \u0275\u0275restoreView(_r1);
        const confirmacionEnvio_r50 = \u0275\u0275reference(11);
        return \u0275\u0275resetView(confirmacionEnvio_r50.cerrar());
      });
      \u0275\u0275text(16, "Cancelar");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "button", 10);
      \u0275\u0275listener("click", function GenerarEmitirComponent_Template_button_click_17_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.remitirAGerencia($event));
      });
      \u0275\u0275text(18, "Confirmar env\xEDo a Gerencia");
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      let tmp_10_0;
      \u0275\u0275conditional(!ctx.revisionBeneficiario() ? 0 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.seleccionarPonente ? 1 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.contexto().general && !ctx.revisionBeneficiario() ? 2 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.revisionBeneficiario() && ctx.contexto().error ? 3 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.modo() === "existente" && ctx.paso() === 1 ? 4 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.seleccion() ? 5 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.modo() === "nuevo" && ctx.contexto().general && ctx.escrituraAutorizada ? 6 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.cargando() ? 7 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.error() ? 8 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_10_0 = ctx.seleccion()) ? 9 : -1, tmp_10_0);
      \u0275\u0275advance();
      \u0275\u0275property("cierreControlado", true);
      \u0275\u0275advance(5);
      \u0275\u0275property("disabled", ctx.operando());
      \u0275\u0275advance(2);
      \u0275\u0275property("disabled", ctx.operando() || !ctx.puedeRemitir());
    }
  }, dependencies: [MunicipalesIndividualesComponent, PracticasCertificacionComponent, ReconocimientosActividadComponent, OrigenesTabsComponent, PonentesSesionComponent, DatePipe, ReactiveFormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, FormControlDirective, FormGroupDirective, FormControlName, RouterLink, PageTitleComponent, VisorCertificadoComponent, FormularioCertificadoComponent, VisorPdfComponent, DialogoComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.encabezado[_ngcontent-%COMP%], \n.acciones[_ngcontent-%COMP%], \n.paginacion[_ngcontent-%COMP%], \n.filtros[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: var(--espacio-3);\n}\n.encabezado[_ngcontent-%COMP%] {\n  justify-content: space-between;\n  margin-bottom: var(--espacio-4);\n}\n.acciones[_ngcontent-%COMP%], \n.filtros[_ngcontent-%COMP%], \n.paginacion[_ngcontent-%COMP%] {\n  margin-block: var(--espacio-4);\n}\n.tabla[_ngcontent-%COMP%] {\n  overflow-x: auto;\n}\n.grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));\n  gap: var(--espacio-4);\n}\n.form-field[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.detalle[_ngcontent-%COMP%] {\n  margin-block: var(--espacio-5);\n}\ndt[_ngcontent-%COMP%] {\n  color: var(--neutro-500);\n  font-size: 0.875rem;\n}\ndd[_ngcontent-%COMP%] {\n  margin: 0 0 var(--espacio-3);\n  overflow-wrap: anywhere;\n}\n.nota[_ngcontent-%COMP%] {\n  color: var(--neutro-700);\n  font-size: 0.875rem;\n}\n.table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  overflow-wrap: anywhere;\n}\n.errores[_ngcontent-%COMP%] {\n  color: var(--color-error);\n}\n.reconocimiento[_ngcontent-%COMP%] {\n  border-top: 3px solid var(--boton-dorado);\n  overflow-wrap: anywhere;\n}\n.reconocimiento[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin-top: var(--espacio-4);\n  font-size: 1.25rem;\n}\n/*# sourceMappingURL=emision.css.map */", "\n\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\n.encabezado-revision[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 2.25rem minmax(0, 1fr);\n  column-gap: 0.6rem;\n  align-items: center;\n  border-left: 3px solid var(--dorado-500, #c5a04a);\n  padding-left: 0.6rem;\n  overflow-wrap: anywhere;\n}\n.encabezado-revision[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  color: #075a9b;\n  font-size: 1.4rem;\n  margin: 0;\n}\n.encabezado-revision[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  grid-column: 2;\n  margin-block: 0.2rem;\n}\n.regresar-beneficiarios[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 2.25rem;\n  height: 2.25rem;\n  padding: 0;\n  border: 0;\n  border-radius: 0.5rem;\n  background: transparent;\n  color: #075a9b;\n  cursor: pointer;\n}\n.regresar-beneficiarios[_ngcontent-%COMP%]:hover {\n  background: rgba(7, 90, 155, 0.0509803922);\n}\n.regresar-beneficiarios[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid #075a9b;\n  outline-offset: 2px;\n}\n.regresar-beneficiarios[_ngcontent-%COMP%]:disabled {\n  opacity: 0.5;\n  cursor: default;\n}\n.pasos.pasos-beneficiario[_ngcontent-%COMP%] {\n  margin-block: 0.85rem;\n  gap: 0.5rem;\n}\n.acciones[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n}\n.editor-mensaje[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  resize: vertical;\n  line-height: 1.7;\n  min-height: 12rem;\n}\n.titulo-emision[_ngcontent-%COMP%], \n.cabecera-sesion[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  color: #075a9b;\n  min-width: 0;\n}\n.titulo-emision[_ngcontent-%COMP%]   app-page-title[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n}\n.titulo-pendientes[_ngcontent-%COMP%] {\n  text-align: right;\n  font-size: 1rem;\n  color: #075a9b;\n  margin: 0 0 0.85rem;\n}\n.cabecera-sesion[_ngcontent-%COMP%] {\n  flex-wrap: wrap;\n  margin-block: 0.75rem;\n}\n.cabecera-sesion[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 8rem;\n  font-size: 1.1rem;\n  margin: 0;\n  overflow-wrap: anywhere;\n}\n.estado-sesion[_ngcontent-%COMP%] {\n  margin-left: auto;\n  border-radius: 1rem;\n  padding: 0.2rem 0.65rem;\n  background: #fff5db;\n  color: #795b16;\n  font-size: 0.8rem;\n  font-weight: 600;\n}\n.estado-sesion.finalizada[_ngcontent-%COMP%] {\n  background: #e8f5ec;\n  color: #21643b;\n}\n.asistencia-indicadores[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(5, minmax(0, 1fr));\n  gap: 0.6rem;\n  margin-block: 0.75rem;\n}\n.asistencia-tarjeta[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr);\n  align-items: center;\n  gap: 0.1rem 0.5rem;\n  padding: 0.65rem;\n  background: #f7f9fc;\n  border: 1px solid #dfe6ef;\n  border-radius: 0.5rem;\n  min-width: 0;\n}\n.asistencia-tarjeta[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%] {\n  grid-row: span 2;\n  color: #075a9b;\n}\n.asistencia-tarjeta[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 1.3rem;\n  color: #075a9b;\n}\n.asistencia-tarjeta[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:last-child {\n  font-size: 0.8rem;\n  overflow-wrap: anywhere;\n}\n.aviso-asistencia[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.35rem;\n  align-items: center;\n  color: #795b16;\n  font-size: 0.8rem;\n}\n.aviso-asistencia[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%] {\n  font-size: 1rem;\n}\n@media (max-width: 760px) {\n  .asistencia-indicadores[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n.modalidades[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));\n  gap: 1rem;\n}\n.modalidades[_ngcontent-%COMP%]   dd[_ngcontent-%COMP%] {\n  margin: 0.35rem 0 0;\n}\n.modalidades[_ngcontent-%COMP%]   dt[_ngcontent-%COMP%] {\n  color: #075a9b;\n  font-weight: 600;\n}\n.contexto-certificacion[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 1.15rem;\n}\n.motivo-certificacion[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  margin: 0.35rem 0;\n}\n.pendientes-certificacion[_ngcontent-%COMP%], \n.beneficiarios-certificacion[_ngcontent-%COMP%] {\n  min-width: 48rem;\n}\n.pendientes-certificacion[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], \n.pendientes-certificacion[_ngcontent-%COMP%]   td[_ngcontent-%COMP%], \n.beneficiarios-certificacion[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], \n.beneficiarios-certificacion[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  vertical-align: top;\n}\n.pasos[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr));\n  list-style: none;\n  padding: 0;\n  gap: 0.75rem;\n  margin-block: 1.5rem;\n}\n.pasos[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  border-bottom: 3px solid var(--neutro-200);\n  padding: 0.75rem;\n}\n.pasos[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  border-radius: 50%;\n  padding: 0.25rem 0.6rem;\n  background: var(--neutro-100);\n}\n.pasos[_ngcontent-%COMP%]   .actual[_ngcontent-%COMP%] {\n  color: #075a9b;\n  border-color: #075a9b;\n  font-weight: 600;\n}\n.datos[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(8rem, 1fr) 3fr;\n  gap: 0.75rem;\n}\ndd[_ngcontent-%COMP%] {\n  margin: 0;\n  overflow-wrap: anywhere;\n}\nlabel[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: start;\n  gap: 0.75rem;\n  margin-block: 1rem;\n}\n@media (max-width: 480px) {\n  .datos[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.tabla[_ngcontent-%COMP%] {\n  overflow-x: auto;\n  max-width: 100%;\n}\n.filtros[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.75rem;\n  align-items: end;\n}\n.filtros[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  flex: 1 1 10rem;\n  display: grid;\n  gap: 0.3rem;\n  margin: 0;\n}\n/*# sourceMappingURL=generar-emitir.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(GenerarEmitirComponent, { className: "GenerarEmitirComponent", filePath: "src\\app\\pages\\emision-certificados\\generar-emitir\\generar-emitir.component.ts", lineNumber: 64 });
})();
export {
  GenerarEmitirComponent
};
//# sourceMappingURL=chunk-BGOHDXFT.mjs.map
