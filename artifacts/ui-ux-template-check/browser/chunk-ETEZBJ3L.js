import {
  VisorPdfComponent
} from "./chunk-SHX4IWTT.js";
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
  EmisionCertificadosService
} from "./chunk-4FUGVTHD.js";
import {
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
  FormControlDirective,
  NgControlStatus,
  NonNullableFormBuilder,
  ReactiveFormsModule
} from "./chunk-YLHEVWGL.js";
import {
  DestroyRef,
  catchError,
  effect,
  finalize,
  forkJoin,
  from,
  inject,
  input,
  map,
  mergeMap,
  of,
  output,
  signal,
  switchMap,
  throwError,
  timeout,
  timer,
  untracked,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵelement,
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
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3
} from "./chunk-3ZDGBTDF.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-ZX6IUAQ5.js";

// src/app/core/interfaces/emision-certificados/origenes-certificado.interface.ts
function puedeVerDocumentoAdministrativo(d) {
  return !!d && Number.isSafeInteger(d.id_certificado_documento) && d.id_certificado_documento > 0 && typeof d.url_documento === "string" && !!d.url_documento.trim() && d.facultades?.ver === true && d.facultades.visualizar !== false && d.puede_visualizar !== false;
}
function puedeDescargarDocumentoAdministrativo(d) {
  return puedeVerDocumentoAdministrativo(d) && d?.facultades?.descargar === true && d.puede_descargar !== false;
}

// src/app/pages/emision-certificados/generar-emitir/municipal-contexto.service.ts
var MunicipalContextoService = class _MunicipalContextoService {
  seleccionado = null;
  static \u0275fac = function MunicipalContextoService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MunicipalContextoService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _MunicipalContextoService, factory: _MunicipalContextoService.\u0275fac, providedIn: "root" });
};

// src/app/pages/emision-certificados/generar-emitir/municipales-individuales.component.ts
var _forTrack0 = ($index, $item) => $item.id;
var _c0 = () => [];
function MunicipalesIndividualesComponent_Conditional_2_Template(rf, ctx) {
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
function MunicipalesIndividualesComponent_For_15_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const d_r4 = ctx;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("Estado documental: ", d_r4.estado_certificado, " \xB7 ", d_r4.estado_documento, "");
  }
}
function MunicipalesIndividualesComponent_For_15_Conditional_9_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const motivo_r5 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(motivo_r5);
  }
}
function MunicipalesIndividualesComponent_For_15_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "details")(1, "summary");
    \u0275\u0275text(2, "Detalles");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(5, MunicipalesIndividualesComponent_For_15_Conditional_9_For_6_Template, 2, 1, "p", null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_12_0;
    const f_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(f_r3.error || (f_r3.evaluacion == null ? null : f_r3.evaluacion.motivo_documento));
    \u0275\u0275advance();
    \u0275\u0275repeater((tmp_12_0 = f_r3.evaluacion == null ? null : f_r3.evaluacion.motivos_bloqueo) !== null && tmp_12_0 !== void 0 ? tmp_12_0 : \u0275\u0275pureFunction0(1, _c0));
  }
}
function MunicipalesIndividualesComponent_For_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td")(6, "button", 0);
    \u0275\u0275listener("click", function MunicipalesIndividualesComponent_For_15_Template_button_click_6_listener() {
      const f_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.abrir(f_r3));
    });
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275template(8, MunicipalesIndividualesComponent_For_15_Conditional_8_Template, 2, 2, "small")(9, MunicipalesIndividualesComponent_For_15_Conditional_9_Template, 7, 2, "details");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_14_0;
    const f_r3 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(f_r3.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(f_r3.estado);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !ctx_r0.habilitada(f_r3));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.accion(f_r3));
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_14_0 = f_r3.evaluacion == null ? null : f_r3.evaluacion.documento_existente) ? 8 : -1, tmp_14_0);
    \u0275\u0275advance();
    \u0275\u0275conditional(f_r3.error || (f_r3.evaluacion == null ? null : f_r3.evaluacion.motivo_documento) || (f_r3.evaluacion == null ? null : f_r3.evaluacion.motivos_bloqueo == null ? null : f_r3.evaluacion.motivos_bloqueo.length) ? 9 : -1);
  }
}
function recuperarMunicipal(api, documentos, e) {
  if (!e.certificados_existentes.length && !e.documento_existente)
    return of(null);
  const c = e.certificados_existentes[0];
  if (e.certificados_existentes.length !== 1 || !e.puede_consultar_certificado_existente || c.id_persona !== e.id_persona || c.id_reconocimiento !== e.id_origen || c.id_tipo_certificado !== e.id_tipo_certificado)
    throw new Error("No se pudo acreditar un \xFAnico certificado municipal.");
  return documentos.consultarReconocimiento(e.id_origen).pipe(map((d) => {
    if (!("id_certificado_documento" in d) || d.id_certificado !== c.id_certificado || d.origen !== "reconocimiento" || d.beneficiario?.id_persona !== e.id_persona || d.id_tipo_certificado !== e.id_tipo_certificado || d.id_sesion != null)
      throw new Error("El documento no corresponde al beneficiario municipal.");
    return d;
  }));
}
var MunicipalesIndividualesComponent = class _MunicipalesIndividualesComponent {
  api = inject(EmisionCertificadosService);
  documentos = inject(DocumentosDigitalesService);
  contexto = inject(MunicipalContextoService);
  router = inject(Router);
  destroy = inject(DestroyRef);
  auth = inject(AuthService);
  filas = signal([]);
  cargando = signal(false);
  error = signal("");
  constructor() {
    this.cargar();
  }
  cargar() {
    if (this.cargando())
      return;
    if (!this.auth.tienePermiso("reconocimientos.ver")) {
      this.error.set("No tienes permiso para consultar reconocimientos.");
      return;
    }
    this.cargando.set(true);
    this.error.set("");
    this.filas.set([]);
    this.api.listarTodos("reconocimientos").pipe(timeout(3e4), switchMap((datos) => {
      const filas = datos.map((r) => ({ id: r.id_reconocimiento, nombre: r.titulo, estado: r.estado }));
      this.filas.set(filas);
      return from(filas).pipe(mergeMap((f) => this.api.evaluarOrigen("reconocimiento", f.id).pipe(map((e) => __spreadProps(__spreadValues({}, f), { evaluacion: e })), timeout(3e4), catchError(() => of(__spreadProps(__spreadValues({}, f), { error: "No se pudo verificar el reconocimiento. Actualiza el listado." })))), 4));
    }), takeUntilDestroyed(this.destroy)).subscribe({
      next: (fila) => this.filas.update((filas) => filas.map((f) => f.id === fila.id ? fila : f)),
      complete: () => this.cargando.set(false),
      error: (e) => {
        this.cargando.set(false);
        this.error.set(mensajeEtapaA(e));
      }
    });
  }
  accion(f) {
    if (f.error)
      return "No disponible";
    const e = f.evaluacion;
    if (!e)
      return "Verificando elegibilidad";
    if (!Number.isSafeInteger(e.id_persona) || e.id_persona < 1 || !e.reconocimiento?.nombres)
      return "Beneficiario no identificado";
    const original = e.documento_existente;
    if (original) {
      if (estadoDocumentalPractica(original) === "Anulado")
        return "Anulado";
      const visible = original.beneficiario.id_persona === e.id_persona && original.id_reconocimiento === e.id_origen && puedeVerDocumentoAdministrativo(original);
      if (!visible)
        return "Sin acceso al PDF";
      if (original.origen === "reconocimiento" && original.estado_certificado === "PREPARADO")
        return "Continuar preparaci\xF3n";
      return "Ver certificado";
    }
    if (e.documentos_existentes?.length || e.puede_consultar_documento_original || e.modalidad_reconocimiento && e.modalidad_reconocimiento !== "individual")
      return "Documento no disponible";
    if (f.documento) {
      const estado = estadoDocumentalPractica(f.documento);
      if (estado === "Pendiente de env\xEDo a Gerencia")
        return "Continuar preparaci\xF3n";
      if (estado === "Certificado confirmado")
        return "Ver certificado";
      if (estado === "Pendiente de firma")
        return "En revisi\xF3n por Gerencia";
      return estado;
    }
    return e.puede_preparar && e.puede_generar_pdf && e.estado_elegibilidad === "Elegible" && !e.certificados_existentes.length ? "Preparar certificado" : "No elegible";
  }
  habilitada(f) {
    return ["Preparar certificado", "Continuar preparaci\xF3n", "Ver certificado"].includes(this.accion(f));
  }
  abrir(f) {
    if (!f.evaluacion || !this.habilitada(f))
      return;
    if (this.accion(f) === "Ver certificado" && f.evaluacion.documento_existente) {
      this.contexto.seleccionado = { evaluacion: f.evaluacion, documento: null };
      void this.router.navigate(["/certificaciones/generar-emitir/reconocimientos/documento-original", f.id]);
      return;
    }
    if (this.accion(f) === "Ver certificado" && f.documento) {
      void this.router.navigate(["/certificaciones/certificados", f.documento.id_certificado, "documentos", f.documento.id_certificado_documento, "visor"]);
      return;
    }
    this.contexto.seleccionado = { evaluacion: f.evaluacion, documento: f.documento ?? null };
    void this.router.navigate(["/certificaciones/generar-emitir/reconocimientos/individual", f.id]);
  }
  static \u0275fac = function MunicipalesIndividualesComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MunicipalesIndividualesComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MunicipalesIndividualesComponent, selectors: [["app-municipales-individuales"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 16, vars: 2, consts: [[1, "btn", 3, "click", "disabled"], ["role", "alert"], [1, "tabla"], [1, "table"]], template: function MunicipalesIndividualesComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "button", 0);
      \u0275\u0275listener("click", function MunicipalesIndividualesComponent_Template_button_click_0_listener() {
        return ctx.cargar();
      });
      \u0275\u0275text(1, "Actualizar");
      \u0275\u0275elementEnd();
      \u0275\u0275template(2, MunicipalesIndividualesComponent_Conditional_2_Template, 2, 1, "p", 1);
      \u0275\u0275elementStart(3, "div", 2)(4, "table", 3)(5, "thead")(6, "tr")(7, "th");
      \u0275\u0275text(8, "Origen");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "th");
      \u0275\u0275text(10, "Estado del origen");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "th");
      \u0275\u0275text(12, "Acci\xF3n");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(13, "tbody");
      \u0275\u0275repeaterCreate(14, MunicipalesIndividualesComponent_For_15_Template, 10, 6, "tr", null, _forTrack0);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275property("disabled", ctx.cargando());
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.error() ? 2 : -1);
      \u0275\u0275advance(12);
      \u0275\u0275repeater(ctx.filas());
    }
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MunicipalesIndividualesComponent, { className: "MunicipalesIndividualesComponent", filePath: "src\\app\\pages\\emision-certificados\\generar-emitir\\municipales-individuales.component.ts", lineNumber: 36 });
})();

// src/app/pages/emision-certificados/generar-emitir/preparacion-origen.component.ts
var _forTrack02 = ($index, $item) => $item.id;
var _forTrack1 = ($index, $item) => $item.id_certificado;
var _c02 = (a0) => ["/pendientes/documentos-firmar", a0];
var _c1 = () => [];
function PreparacionOrigenComponent_Conditional_0_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 1)(1, "span", 7);
    \u0275\u0275text(2, "arrow_back");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("queryParams", ctx_r0.retorno());
    \u0275\u0275attribute("aria-label", ctx_r0.esMunicipal ? "Volver al listado municipal" : "Volver a beneficiarios de la sesi\xF3n");
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", ctx_r0.nombre(), " \xB7 ", (tmp_2_0 = ctx_r0.datosPonente()) == null ? null : tmp_2_0.actividad, "");
  }
}
function PreparacionOrigenComponent_Conditional_0_For_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const titulo_r2 = ctx.$implicit;
    const \u0275$index_23_r3 = ctx.$index;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275attribute("aria-current", ctx_r0.pasoReconocimiento() === \u0275$index_23_r3 + 1 ? "step" : null);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", \u0275$index_23_r3 + 1, ". ", titulo_r2, "");
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 3);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.cuatroPasos ? ctx_r0.mensajeOperacion() : "Procesando documento\u2026");
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 4);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.error());
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 8);
    \u0275\u0275listener("click", function PreparacionOrigenComponent_Conditional_0_Conditional_12_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.reintentarConsultaExistente());
    });
    \u0275\u0275text(1, "Reintentar consulta");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r0.operando());
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 3);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.aviso());
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 3);
    \u0275\u0275text(1, "La vista previa venci\xF3. Vuelve a Texto del reconocimiento para obtener una nueva revisi\xF3n antes de confirmar.");
    \u0275\u0275elementEnd();
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_1_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dt");
    \u0275\u0275text(1, "Origen del reconocimiento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dd");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "dt");
    \u0275\u0275text(5, "Motivo o categor\xEDa");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "dd");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_5_0;
    let tmp_6_0;
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((tmp_5_0 = ctx_r0.datos()) == null ? null : tmp_5_0.titulo);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(((tmp_6_0 = ctx_r0.datos()) == null ? null : tmp_6_0.motivo) || ((tmp_6_0 = ctx_r0.datos()) == null ? null : tmp_6_0.descripcion));
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_1_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dt");
    \u0275\u0275text(1, "Modalidad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dd");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.modalidadPonente());
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_1_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dt");
    \u0275\u0275text(1, "Actividad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dd");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_5_0;
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((tmp_5_0 = ctx_r0.datosPonente()) == null ? null : tmp_5_0.actividad);
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_1_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dt");
    \u0275\u0275text(1, "Sesi\xF3n acreditada");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dd");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "dt");
    \u0275\u0275text(5, "Fecha de la sesi\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "dd");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.nombreSesion());
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.fechaSesion());
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_1_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dt");
    \u0275\u0275text(1, "Periodo de actividad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dd");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_5_0;
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", ctx_r0.fechaInterfaz((tmp_5_0 = ctx_r0.datosPonente()) == null ? null : tmp_5_0.datos_origen == null ? null : tmp_5_0.datos_origen.fecha_inicio_actividad), " \u2013 ", ctx_r0.fechaInterfaz((tmp_5_0 = ctx_r0.datosPonente()) == null ? null : tmp_5_0.datos_origen == null ? null : tmp_5_0.datos_origen.fecha_fin_actividad), "");
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_1_Conditional_20_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 3);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const motivo_r6 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(motivo_r6);
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_1_Conditional_20_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p")(1, "strong");
    \u0275\u0275text(2, "Motivo:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const d_r7 = ctx;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", d_r7.motivo, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(d_r7.mensaje_aprobado || d_r7.mensaje);
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_1_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_1_Conditional_20_For_1_Template, 2, 1, "p", 3, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275template(2, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_1_Conditional_20_Conditional_2_Template, 6, 2);
  }
  if (rf & 2) {
    let tmp_6_0;
    const e_r8 = \u0275\u0275nextContext(2);
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275repeater(e_r8.motivos_bloqueo);
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_6_0 = !ctx_r0.esMunicipal && ctx_r0.documento()) ? 2 : -1, tmp_6_0);
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_1_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 11);
    \u0275\u0275text(1, "Volver");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275property("queryParams", ctx_r0.retorno());
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "h2");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dl", 9)(3, "dt");
    \u0275\u0275text(4, "Beneficiario");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "dd");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "dt");
    \u0275\u0275text(8, "Tipo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "dd");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275template(11, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_1_Conditional_11_Template, 8, 2)(12, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_1_Conditional_12_Template, 4, 1)(13, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_1_Conditional_13_Template, 4, 1)(14, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_1_Conditional_14_Template, 8, 2)(15, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_1_Conditional_15_Template, 4, 2);
    \u0275\u0275elementStart(16, "dt");
    \u0275\u0275text(17, "Elegibilidad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "dd");
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(20, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_1_Conditional_20_Template, 3, 1);
    \u0275\u0275elementStart(21, "div", 10);
    \u0275\u0275template(22, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_1_Conditional_22_Template, 2, 1, "a", 11);
    \u0275\u0275elementStart(23, "button", 12);
    \u0275\u0275listener("click", function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_1_Template_button_click_23_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.siguienteReconocimiento());
    });
    \u0275\u0275text(24);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_10_0;
    const e_r8 = \u0275\u0275nextContext();
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.cuatroPasos ? "Informaci\xF3n" : "Datos");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.nombre());
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.tipoNombre());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.esMunicipal ? 11 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0.cuatroPasos ? 12 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0.esMunicipal ? 13 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_10_0 = ctx_r0.datosPonente()) == null ? null : tmp_10_0.origen) === "ponente_sesion" ? 14 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0.cuatroPasos ? 15 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.porSesion && ctx_r0.documento() ? "Documento existente" : e_r8.estado_elegibilidad);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0.porSesion ? 20 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx_r0.porSesion ? 22 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !ctx_r0.puedeAvanzar());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(!ctx_r0.porSesion && ctx_r0.documento() ? "Continuar" : "Siguiente");
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_2_Conditional_2_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "M\xE1ximo 500 caracteres.");
    \u0275\u0275elementEnd();
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_2_Conditional_2_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 4);
    \u0275\u0275text(1, "Escribe un motivo no vac\xEDo en texto plano, sin HTML ni controles peligrosos, de hasta 500 caracteres.");
    \u0275\u0275elementEnd();
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_2_Conditional_2_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "M\xE1ximo 1200 caracteres. Revisa ambos textos en el PDF antes de confirmar.");
    \u0275\u0275elementEnd();
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_2_Conditional_2_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 4);
    \u0275\u0275text(1, "Escribe un mensaje no vac\xEDo en texto plano, sin HTML ni controles peligrosos, de hasta 1200 caracteres.");
    \u0275\u0275elementEnd();
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13)(1, "section", 14)(2, "label", 15);
    \u0275\u0275text(3, "Motivo del reconocimiento");
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "input", 16);
    \u0275\u0275template(5, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_2_Conditional_2_Conditional_5_Template, 2, 0, "p")(6, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_2_Conditional_2_Conditional_6_Template, 2, 0, "p", 4);
    \u0275\u0275elementStart(7, "label", 17);
    \u0275\u0275text(8, "Mensaje del certificado");
    \u0275\u0275elementEnd();
    \u0275\u0275element(9, "textarea", 18);
    \u0275\u0275template(10, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_2_Conditional_2_Conditional_10_Template, 2, 0, "p")(11, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_2_Conditional_2_Conditional_11_Template, 2, 0, "p", 4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(4);
    \u0275\u0275property("formControl", ctx_r0.motivoCertificado)("readonly", ctx_r0.operando());
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0.documento() ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.motivoCertificado.touched && ctx_r0.motivoCertificado.invalid ? 6 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275property("formControl", ctx_r0.mensajeCertificado)("readonly", ctx_r0.operando());
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0.documento() ? 10 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.mensajeCertificado.touched && ctx_r0.mensajeCertificado.invalid ? 11 : -1);
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_2_Conditional_3_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 4);
    \u0275\u0275text(1, "Escribe un mensaje no vac\xEDo en texto plano de hasta 1.200 caracteres, sin HTML ni controles peligrosos.");
    \u0275\u0275elementEnd();
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "Puedes conservar el mensaje predeterminado o personalizarlo antes de preparar el certificado.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "label", 19);
    \u0275\u0275text(3, "Mensaje del reconocimiento");
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "textarea", 20);
    \u0275\u0275elementStart(5, "small", 21);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275template(7, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_2_Conditional_3_Conditional_7_Template, 2, 0, "p", 4);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(4);
    \u0275\u0275property("formControl", ctx_r0.mensajeCertificado)("readonly", !ctx_r0.mensajeMunicipalEditable());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", ctx_r0.caracteresMensaje(), " / 1.200 caracteres");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.mensajeCertificado.invalid && (ctx_r0.mensajeCertificado.dirty || ctx_r0.mensajeCertificado.touched) ? 7 : -1);
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_2_Conditional_4_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 22);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Texto institucional proporcionado por el sistema.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 8);
    \u0275\u0275listener("click", function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_2_Conditional_4_Conditional_0_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r0 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r0.revisar());
    });
    \u0275\u0275text(5, "Revisar nuevamente");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(5);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx.mensaje);
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", !ctx_r0.puedePreparar());
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_2_Conditional_4_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 8);
    \u0275\u0275listener("click", function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_2_Conditional_4_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r0 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r0.revisar());
    });
    \u0275\u0275text(1, "Reintentar revisi\xF3n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(5);
    \u0275\u0275property("disabled", !ctx_r0.puedePreparar());
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_2_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_2_Conditional_4_Conditional_0_Template, 6, 2)(1, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_2_Conditional_4_Conditional_1_Template, 2, 1, "button", 5);
  }
  if (rf & 2) {
    let tmp_5_0;
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275conditional((tmp_5_0 = ctx_r0.revision()) ? 0 : !ctx_r0.operando() ? 1 : -1, tmp_5_0);
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "h2");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275template(2, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_2_Conditional_2_Template, 12, 8, "div", 13)(3, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_2_Conditional_3_Template, 8, 4)(4, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_2_Conditional_4_Template, 2, 1);
    \u0275\u0275elementStart(5, "div", 10)(6, "button", 8);
    \u0275\u0275listener("click", function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_2_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.anteriorReconocimiento());
    });
    \u0275\u0275text(7, "Anterior");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "button", 12);
    \u0275\u0275listener("click", function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_2_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.siguienteReconocimiento());
    });
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.esMunicipal ? "Mensaje del reconocimiento" : ctx_r0.porSesion ? "Mensaje" : "Informaci\xF3n del reconocimiento");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.porSesion ? 2 : ctx_r0.esMunicipal ? 3 : 4);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", ctx_r0.operando());
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !ctx_r0.puedeAvanzar());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.porSesion ? ctx_r0.documento() ? "Ver PDF guardado" : "Previsualizar PDF" : "Siguiente");
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_3_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 10)(1, "button", 23);
    \u0275\u0275listener("click", function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_3_Conditional_2_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.anteriorReconocimiento());
    });
    \u0275\u0275text(2, "Anterior");
    \u0275\u0275elementEnd()();
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_3_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275element(0, "app-visor-pdf", 24);
    \u0275\u0275elementStart(1, "div", 10)(2, "button", 8);
    \u0275\u0275listener("click", function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_3_Conditional_3_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.anteriorReconocimiento());
    });
    \u0275\u0275text(3, "Anterior");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 12);
    \u0275\u0275listener("click", function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_3_Conditional_3_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.siguienteReconocimiento());
    });
    \u0275\u0275text(5, "Continuar");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const d_r14 = ctx;
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275property("documentoId", d_r14.id_certificado_documento)("urlAdministrativa", d_r14.url_documento || null)("hashEsperado", d_r14.hash_pdf)("permitirDescarga", !ctx_r0.esMunicipal || ctx_r0.descargaMunicipalPermitida(d_r14))("flujoFirmas", true)("persistido", true)("integrado", true)("ajustarAncho", true)("controlesZoom", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.operando());
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !ctx_r0.puedeAvanzar());
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_3_Conditional_4_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 27);
    \u0275\u0275listener("click", function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_3_Conditional_4_Conditional_4_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r16);
      const ctx_r0 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r0.guardar());
    });
    \u0275\u0275text(1, "Confirmar preparaci\xF3n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(5);
    \u0275\u0275property("disabled", !ctx_r0.puedeGuardarReconocimiento());
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_3_Conditional_4_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 27);
    \u0275\u0275listener("click", function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_3_Conditional_4_Conditional_5_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r17);
      const ctx_r0 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r0.guardar());
    });
    \u0275\u0275text(1, "Guardar y continuar");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(5);
    \u0275\u0275property("disabled", !ctx_r0.puedeGuardarReconocimiento());
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_3_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-visor-pdf", 25);
    \u0275\u0275listener("archivoVisualizado", function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_3_Conditional_4_Template_app_visor_pdf_archivoVisualizado_0_listener($event) {
      \u0275\u0275restoreView(_r15);
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.pdfReconocimientoRevisado.set($event));
    })("errorVisualizacion", function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_3_Conditional_4_Template_app_visor_pdf_errorVisualizacion_0_listener($event) {
      \u0275\u0275restoreView(_r15);
      const ctx_r0 = \u0275\u0275nextContext(4);
      ctx_r0.pdfReconocimientoRevisado.set(null);
      return \u0275\u0275resetView(ctx_r0.error.set($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "div", 10)(2, "button", 8);
    \u0275\u0275listener("click", function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_3_Conditional_4_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r15);
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.anteriorReconocimiento());
    });
    \u0275\u0275text(3, "Anterior");
    \u0275\u0275elementEnd();
    \u0275\u0275template(4, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_3_Conditional_4_Conditional_4_Template, 2, 1, "button", 26)(5, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_3_Conditional_4_Conditional_5_Template, 2, 1, "button", 26);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275property("archivoPrevio", ctx.archivo)("integrado", true)("ajustarAncho", true)("controlesZoom", true)("mostrarDescripcion", !ctx_r0.porSesion);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.operando());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.cuatroPasos ? 4 : 5);
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "h2");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275template(2, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_3_Conditional_2_Template, 3, 0, "div", 10)(3, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_3_Conditional_3_Template, 6, 11)(4, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_3_Conditional_4_Template, 6, 7);
  }
  if (rf & 2) {
    let tmp_6_0;
    let tmp_7_0;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.esMunicipal ? "Previsualizaci\xF3n y confirmaci\xF3n" : ctx_r0.porSesion ? "Previsualizaci\xF3n" : "Previsualizar");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.esMunicipal && !ctx_r0.revision() && !ctx_r0.documento() ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_6_0 = ctx_r0.cuatroPasos && ctx_r0.documento()) ? 3 : -1, tmp_6_0);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_7_0 = ctx_r0.revision()) ? 4 : -1, tmp_7_0);
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_4_Conditional_2_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 12);
    \u0275\u0275listener("click", function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_4_Conditional_2_Conditional_12_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r18);
      const ctx_r0 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r0.revisarEnvio());
    });
    \u0275\u0275text(1, "Enviar a Gerencia");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(5);
    \u0275\u0275property("disabled", !ctx_r0.puedeRemitir());
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_4_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275element(8, "app-visor-pdf", 28);
    \u0275\u0275elementStart(9, "div", 10)(10, "a", 11);
    \u0275\u0275text(11, "Volver a la lista");
    \u0275\u0275elementEnd();
    \u0275\u0275template(12, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_4_Conditional_2_Conditional_12_Template, 2, 1, "button", 29);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const d_r19 = ctx;
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Motivo: ", d_r19.motivo, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(d_r19.mensaje_aprobado || d_r19.mensaje);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Estado: ", d_r19.etiqueta_estado || d_r19.estado_certificado, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("C\xF3digo de verificaci\xF3n: ", d_r19.codigo_verificacion, "");
    \u0275\u0275advance();
    \u0275\u0275property("documentoId", d_r19.id_certificado_documento)("urlAdministrativa", d_r19.url_documento || null)("hashEsperado", d_r19.hash_pdf)("flujoFirmas", true)("persistido", true)("integrado", true)("ajustarAncho", true)("controlesZoom", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("queryParams", ctx_r0.retorno());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(d_r19.facultades.remitir ? 12 : -1);
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "h2");
    \u0275\u0275text(1, "Documento preparado");
    \u0275\u0275elementEnd();
    \u0275\u0275template(2, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_4_Conditional_2_Template, 13, 14);
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_4_0 = ctx_r0.documento()) ? 2 : -1, tmp_4_0);
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_5_Conditional_2_Conditional_0_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "El certificado est\xE1 listo para enviarse a Gerencia.");
    \u0275\u0275elementEnd();
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_5_Conditional_2_Conditional_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 3);
    \u0275\u0275text(1, "El certificado ya fue enviado a Gerencia.");
    \u0275\u0275elementEnd();
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_5_Conditional_2_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_8_0;
    const ctx_r0 = \u0275\u0275nextContext(6);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3("", ctx_r0.nombre(), " \xB7 ", (tmp_8_0 = ctx_r0.datosPonente()) == null ? null : tmp_8_0.actividad, " \xB7 ", ctx_r0.nombreSesion(), "");
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_5_Conditional_2_Conditional_0_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(6);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Estado: ", ctx_r0.estadoReconocimiento(), "");
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_5_Conditional_2_Conditional_0_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 10)(1, "button", 27);
    \u0275\u0275listener("click", function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_5_Conditional_2_Conditional_0_Conditional_4_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r20);
      const ctx_r0 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r0.enviarSesion());
    });
    \u0275\u0275text(2, "Enviar a Gerencia");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(6);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !ctx_r0.puedeRemitir());
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_5_Conditional_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_5_Conditional_2_Conditional_0_Conditional_0_Template, 2, 0, "p")(1, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_5_Conditional_2_Conditional_0_Conditional_1_Template, 2, 0, "p", 3)(2, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_5_Conditional_2_Conditional_0_Conditional_2_Template, 2, 3, "p")(3, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_5_Conditional_2_Conditional_0_Conditional_3_Template, 2, 1, "p")(4, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_5_Conditional_2_Conditional_0_Conditional_4_Template, 3, 1, "div", 10);
  }
  if (rf & 2) {
    const d_r21 = \u0275\u0275nextContext();
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275conditional(d_r21.estado_certificado === "PREPARADO" ? 0 : d_r21.estado_certificado === "PENDIENTE_FIRMA" ? 1 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx_r0.esMunicipal ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0.esMunicipal || d_r21.estado_certificado !== "PREPARADO" ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(d_r21.estado_certificado === "PREPARADO" ? 4 : -1);
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_5_Conditional_2_Conditional_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r22 = \u0275\u0275getCurrentView();
    \u0275\u0275element(0, "app-visor-pdf", 30);
    \u0275\u0275elementStart(1, "p");
    \u0275\u0275text(2, "El reconocimiento se enviar\xE1 \xFAnicamente al confirmar esta acci\xF3n.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 10)(4, "button", 8);
    \u0275\u0275listener("click", function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_5_Conditional_2_Conditional_1_Conditional_2_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r22);
      const ctx_r0 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r0.envio.set(null));
    });
    \u0275\u0275text(5, "Anterior");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 27);
    \u0275\u0275listener("click", function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_5_Conditional_2_Conditional_1_Conditional_2_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r22);
      const ctx_r0 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r0.enviar());
    });
    \u0275\u0275text(7, "Enviar a Gerencia");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(6);
    \u0275\u0275property("archivoPrevio", ctx.archivo)("persistido", true)("integrado", true)("ajustarAncho", true)("controlesZoom", true);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", ctx_r0.operando());
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !ctx_r0.puedeRemitir());
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_5_Conditional_2_Conditional_1_Conditional_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 31);
    \u0275\u0275text(1, "Ver documento en Gerencia");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const d_r21 = \u0275\u0275nextContext(3);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(1, _c02, d_r21.id_certificado_documento));
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_5_Conditional_2_Conditional_1_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-visor-pdf", 28);
    \u0275\u0275template(1, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_5_Conditional_2_Conditional_1_Conditional_3_Conditional_1_Template, 2, 3, "a", 31);
    \u0275\u0275elementStart(2, "a", 32);
    \u0275\u0275text(3, "Volver a Generar y emitir");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const d_r21 = \u0275\u0275nextContext(2);
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275property("documentoId", d_r21.id_certificado_documento)("urlAdministrativa", d_r21.url_documento || null)("hashEsperado", d_r21.hash_pdf)("flujoFirmas", true)("persistido", true)("integrado", true)("ajustarAncho", true)("controlesZoom", true);
    \u0275\u0275advance();
    \u0275\u0275conditional(d_r21.estado_certificado === "PENDIENTE_FIRMA" && ctx_r0.authGerencia() ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("queryParams", ctx_r0.retorno());
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_5_Conditional_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275template(2, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_5_Conditional_2_Conditional_1_Conditional_2_Template, 8, 7)(3, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_5_Conditional_2_Conditional_1_Conditional_3_Template, 4, 10);
  }
  if (rf & 2) {
    let tmp_8_0;
    const d_r21 = \u0275\u0275nextContext();
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Estado: ", d_r21.disponible_rrhh === true && d_r21.pdf_confirmado === true ? "Listo para entrega" : d_r21.etiqueta_estado || d_r21.estado_certificado, "");
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_8_0 = ctx_r0.envio()) ? 2 : 3, tmp_8_0);
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_5_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_5_Conditional_2_Conditional_0_Template, 5, 4)(1, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_5_Conditional_2_Conditional_1_Template, 4, 2);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275conditional(ctx_r0.cuatroPasos ? 0 : 1);
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "h2");
    \u0275\u0275text(1, "Env\xEDo a Gerencia");
    \u0275\u0275elementEnd();
    \u0275\u0275template(2, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_5_Conditional_2_Template, 2, 1);
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_4_0 = ctx_r0.documento()) ? 2 : -1, tmp_4_0);
  }
}
function PreparacionOrigenComponent_Conditional_0_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275template(1, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_1_Template, 25, 13)(2, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_2_Template, 10, 5)(3, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_3_Template, 5, 4)(4, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_4_Template, 3, 1)(5, PreparacionOrigenComponent_Conditional_0_Conditional_15_Case_5_Template, 3, 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275attribute("aria-busy", ctx_r0.operando());
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_4_0 = ctx_r0.pasoReconocimiento()) === 1 ? 1 : tmp_4_0 === ctx_r0.pasoMensaje ? 2 : tmp_4_0 === ctx_r0.pasoPdf ? 3 : tmp_4_0 === (ctx_r0.cuatroPasos ? -1 : ctx_r0.pasoConfirmacion) ? 4 : tmp_4_0 === ctx_r0.pasoEnvio ? 5 : -1);
  }
}
function PreparacionOrigenComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 0)(1, "header")(2, "div");
    \u0275\u0275template(3, PreparacionOrigenComponent_Conditional_0_Conditional_3_Template, 3, 2, "a", 1);
    \u0275\u0275elementStart(4, "h1");
    \u0275\u0275text(5, "Preparar reconocimiento");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(6, PreparacionOrigenComponent_Conditional_0_Conditional_6_Template, 2, 2, "p");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "ol", 2);
    \u0275\u0275repeaterCreate(8, PreparacionOrigenComponent_Conditional_0_For_9_Template, 2, 3, "li", null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275template(10, PreparacionOrigenComponent_Conditional_0_Conditional_10_Template, 2, 1, "p", 3)(11, PreparacionOrigenComponent_Conditional_0_Conditional_11_Template, 2, 1, "p", 4)(12, PreparacionOrigenComponent_Conditional_0_Conditional_12_Template, 2, 1, "button", 5)(13, PreparacionOrigenComponent_Conditional_0_Conditional_13_Template, 2, 1, "p", 3)(14, PreparacionOrigenComponent_Conditional_0_Conditional_14_Template, 2, 0, "p", 3)(15, PreparacionOrigenComponent_Conditional_0_Conditional_15_Template, 6, 2, "div", 6);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_10_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275classProp("titulo-asistente", ctx_r0.cuatroPasos);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.cuatroPasos ? 3 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(!ctx_r0.porSesion ? 6 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r0.pasosReconocimiento);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.operando() && (!ctx_r0.esMunicipal || ctx_r0.pasoReconocimiento() !== ctx_r0.pasoMensaje) && (!ctx_r0.porSesion || ctx_r0.mensajeOperacion()) ? 10 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.error() ? 11 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.falloConsultaExistente() && !(ctx_r0.esMunicipal && ctx_r0.pasoReconocimiento() === ctx_r0.pasoMensaje) ? 12 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.aviso() && !(ctx_r0.cuatroPasos && (ctx_r0.pasoReconocimiento() === 1 || ctx_r0.pasoReconocimiento() === ctx_r0.pasoEnvio)) ? 13 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.porSesion && ctx_r0.revision() && !ctx_r0.revisionVigente() && !ctx_r0.documento() ? 14 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_10_0 = ctx_r0.evaluacion()) ? 15 : -1, tmp_10_0);
  }
}
function PreparacionOrigenComponent_Conditional_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 3);
    \u0275\u0275text(1, "Cargando certificados\u2026");
    \u0275\u0275elementEnd();
  }
}
function PreparacionOrigenComponent_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 3);
    \u0275\u0275text(1, "Procesando documento\u2026");
    \u0275\u0275elementEnd();
  }
}
function PreparacionOrigenComponent_Conditional_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r23 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 4);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 8);
    \u0275\u0275listener("click", function PreparacionOrigenComponent_Conditional_1_Conditional_2_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r23);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.cargar());
    });
    \u0275\u0275text(3, "Actualizar registros");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.error());
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.operando());
  }
}
function PreparacionOrigenComponent_Conditional_1_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 3);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.aviso());
  }
}
function PreparacionOrigenComponent_Conditional_1_Conditional_4_For_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r25 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td", 37);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 36);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td")(8, "button", 8);
    \u0275\u0275listener("click", function PreparacionOrigenComponent_Conditional_1_Conditional_4_For_16_Template_button_click_8_listener() {
      const r_r26 = \u0275\u0275restoreView(_r25).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.consultar(r_r26.id));
    });
    \u0275\u0275text(9, "Consultar beneficiario");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const r_r26 = ctx.$implicit;
    const \u0275$index_386_r27 = ctx.$index;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275$index_386_r27 + 1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(r_r26.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(r_r26.estado);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.operando());
  }
}
function PreparacionOrigenComponent_Conditional_1_Conditional_4_ForEmpty_17_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 38);
    \u0275\u0275text(2, "No hay registros autorizados para consultar.");
    \u0275\u0275elementEnd()();
  }
}
function PreparacionOrigenComponent_Conditional_1_Conditional_4_ForEmpty_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, PreparacionOrigenComponent_Conditional_1_Conditional_4_ForEmpty_17_Conditional_0_Template, 3, 0, "tr");
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275conditional(!ctx_r0.cargando() ? 0 : -1);
  }
}
function PreparacionOrigenComponent_Conditional_1_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r24 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 8);
    \u0275\u0275listener("click", function PreparacionOrigenComponent_Conditional_1_Conditional_4_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r24);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.cargar());
    });
    \u0275\u0275text(1, "Actualizar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 33)(3, "table", 34)(4, "thead")(5, "tr")(6, "th", 35);
    \u0275\u0275text(7, "N.\xBA");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Origen");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 36);
    \u0275\u0275text(11, "Estado del origen");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Acci\xF3n");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(14, "tbody");
    \u0275\u0275repeaterCreate(15, PreparacionOrigenComponent_Conditional_1_Conditional_4_For_16_Template, 10, 4, "tr", null, _forTrack02, false, PreparacionOrigenComponent_Conditional_1_Conditional_4_ForEmpty_17_Template, 1, 1);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r0.operando() || ctx_r0.cargando());
    \u0275\u0275advance(15);
    \u0275\u0275repeater(ctx_r0.registros());
  }
}
function PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dt");
    \u0275\u0275text(1, "Estado de actividad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dd");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r29 = ctx;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(p_r29.datos_origen == null ? null : p_r29.datos_origen.estado_actividad);
  }
}
function PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dt");
    \u0275\u0275text(1, "Estado del origen");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dd");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((tmp_4_0 = ctx_r0.datos()) == null ? null : tmp_4_0.estado);
  }
}
function PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dt");
    \u0275\u0275text(1, "T\xEDtulo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dd");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((tmp_4_0 = ctx_r0.datos()) == null ? null : tmp_4_0.titulo);
  }
}
function PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dt");
    \u0275\u0275text(1, "Motivo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dd");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((tmp_4_0 = ctx_r0.datos()) == null ? null : tmp_4_0.motivo);
  }
}
function PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dt");
    \u0275\u0275text(1, "Descripci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dd");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((tmp_4_0 = ctx_r0.datos()) == null ? null : tmp_4_0.descripcion);
  }
}
function PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dt");
    \u0275\u0275text(1, "Fecha del reconocimiento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dd");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((tmp_4_0 = ctx_r0.datos()) == null ? null : tmp_4_0.fecha_reconocimiento);
  }
}
function PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dt");
    \u0275\u0275text(1, "Periodo registrado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dd");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", (tmp_4_0 = ctx_r0.datos()) == null ? null : tmp_4_0.fecha_inicio, " \u2013 ", ((tmp_4_0 = ctx_r0.datos()) == null ? null : tmp_4_0.fecha_fin) || "Fin no registrado", "");
  }
}
function PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dt");
    \u0275\u0275text(1, "\xC1rea");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dd");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((tmp_4_0 = ctx_r0.datos()) == null ? null : tmp_4_0.area);
  }
}
function PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dt");
    \u0275\u0275text(1, "Instituci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dd");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((tmp_4_0 = ctx_r0.datos()) == null ? null : tmp_4_0.institucion);
  }
}
function PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dt");
    \u0275\u0275text(1, "Carrera");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dd");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((tmp_4_0 = ctx_r0.datos()) == null ? null : tmp_4_0.carrera);
  }
}
function PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dl", 9)(1, "dt");
    \u0275\u0275text(2, "Actividad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "dd");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "dt");
    \u0275\u0275text(6, "Periodo de la actividad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "dd");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const p_r30 = ctx;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(p_r30.actividad);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", p_r30.datos_origen == null ? null : p_r30.datos_origen.fecha_inicio_actividad, " \u2013 ", p_r30.datos_origen == null ? null : p_r30.datos_origen.fecha_fin_actividad, "");
  }
}
function PreparacionOrigenComponent_Conditional_1_Conditional_5_For_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 3);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const motivo_r31 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(motivo_r31);
  }
}
function PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_32_For_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r32 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 8);
    \u0275\u0275listener("click", function PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_32_For_1_Conditional_2_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r32);
      const c_r33 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.abrirExistente(c_r33.id_certificado));
    });
    \u0275\u0275text(1, "Ver certificado existente");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(5);
    \u0275\u0275property("disabled", ctx_r0.operando());
  }
}
function PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_32_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275template(2, PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_32_For_1_Conditional_2_Template, 2, 1, "button", 5);
  }
  if (rf & 2) {
    const c_r33 = ctx.$implicit;
    const e_r34 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Estado del certificado: ", c_r33.estado, "");
    \u0275\u0275advance();
    \u0275\u0275conditional(e_r34.puede_consultar_certificado_existente && c_r33.id_tipo_certificado === e_r34.id_tipo_certificado ? 2 : -1);
  }
}
function PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_32_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r35 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 40);
    \u0275\u0275listener("click", function PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_32_Conditional_2_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r35);
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.revisar());
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const e_r34 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(e_r34.origen === "ponente_actividad" || e_r34.origen === "ponente_sesion" ? "Preparar reconocimiento" : "Preparar certificado");
  }
}
function PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_32_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const e_r34 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("No se puede preparar este certificado. ", e_r34.origen === "practica" ? "El periodo de pr\xE1cticas a\xFAn no est\xE1 acreditado o no cuenta con autorizaci\xF3n para preparar." : "El reconocimiento a\xFAn no est\xE1 autorizado o no cuenta con autorizaci\xF3n para preparar.", "");
  }
}
function PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_32_For_1_Template, 3, 2, null, null, _forTrack1);
    \u0275\u0275template(2, PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_32_Conditional_2_Template, 2, 1, "button", 39)(3, PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_32_Conditional_3_Template, 2, 1, "p");
  }
  if (rf & 2) {
    let tmp_4_0;
    let tmp_6_0;
    const e_r34 = \u0275\u0275nextContext();
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275repeater((tmp_4_0 = e_r34.certificados_existentes) !== null && tmp_4_0 !== void 0 ? tmp_4_0 : \u0275\u0275pureFunction0(2, _c1));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.puedePreparar() && !ctx_r0.revision() ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!e_r34.puede_preparar && !((tmp_6_0 = e_r34.certificados_existentes) !== null && tmp_6_0 !== void 0 ? tmp_6_0 : \u0275\u0275pureFunction0(3, _c1)).length ? 3 : -1);
  }
}
function PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_33_Template(rf, ctx) {
  if (rf & 1) {
    const _r36 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "h3");
    \u0275\u0275text(1, "Mensaje del certificado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "app-visor-pdf", 41);
    \u0275\u0275elementStart(5, "div", 42)(6, "button", 8);
    \u0275\u0275listener("click", function PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_33_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r36);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.revisar());
    });
    \u0275\u0275text(7, "Revisar nuevamente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "button", 12);
    \u0275\u0275listener("click", function PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_33_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r36);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.guardar());
    });
    \u0275\u0275text(9, "Guardar y continuar");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r37 = ctx;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(r_r37.mensaje);
    \u0275\u0275advance();
    \u0275\u0275property("archivoPrevio", r_r37.archivo)("integrado", true)("ajustarAncho", true)("controlesZoom", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.operando());
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !ctx_r0.puedePreparar());
  }
}
function PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_34_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r38 = \u0275\u0275getCurrentView();
    \u0275\u0275element(0, "app-visor-pdf", 30);
    \u0275\u0275elementStart(1, "p");
    \u0275\u0275text(2, "Confirma el env\xEDo del documento guardado a Gerencia.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 42)(4, "button", 8);
    \u0275\u0275listener("click", function PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_34_Conditional_4_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r38);
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.envio.set(null));
    });
    \u0275\u0275text(5, "Cancelar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 12);
    \u0275\u0275listener("click", function PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_34_Conditional_4_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r38);
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.enviar());
    });
    \u0275\u0275text(7, "Confirmar env\xEDo a Gerencia");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275property("archivoPrevio", ctx.archivo)("persistido", true)("integrado", true)("ajustarAncho", true)("controlesZoom", true);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", ctx_r0.operando());
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !ctx_r0.puedeRemitir());
  }
}
function PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_34_Conditional_5_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r39 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 12);
    \u0275\u0275listener("click", function PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_34_Conditional_5_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r39);
      const ctx_r0 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r0.revisarEnvio());
    });
    \u0275\u0275text(1, "Enviar a Gerencia");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(5);
    \u0275\u0275property("disabled", !ctx_r0.puedeRemitir());
  }
}
function PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_34_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-visor-pdf", 28);
    \u0275\u0275template(1, PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_34_Conditional_5_Conditional_1_Template, 2, 1, "button", 29);
  }
  if (rf & 2) {
    const d_r40 = \u0275\u0275nextContext();
    \u0275\u0275property("documentoId", d_r40.id_certificado_documento)("urlAdministrativa", d_r40.url_documento || null)("hashEsperado", d_r40.hash_pdf)("flujoFirmas", true)("persistido", true)("integrado", true)("ajustarAncho", true)("controlesZoom", true);
    \u0275\u0275advance();
    \u0275\u0275conditional(d_r40.estado_certificado === "PREPARADO" && d_r40.facultades.remitir ? 1 : -1);
  }
}
function PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_34_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 31);
    \u0275\u0275text(1, "Ver documento en Gerencia");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const d_r40 = \u0275\u0275nextContext();
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(1, _c02, d_r40.id_certificado_documento));
  }
}
function PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275template(4, PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_34_Conditional_4_Template, 8, 7)(5, PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_34_Conditional_5_Template, 2, 9)(6, PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_34_Conditional_6_Template, 2, 3, "a", 31);
  }
  if (rf & 2) {
    let tmp_7_0;
    const d_r40 = ctx;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Estado del certificado: ", d_r40.disponible_rrhh === true && d_r40.pdf_confirmado === true ? "Listo para entrega" : d_r40.estado_certificado === "PENDIENTE_FIRMA" ? "Pendiente de firma" : d_r40.estado_certificado === "PREPARADO" ? "Preparado" : d_r40.estado_certificado, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("C\xF3digo de verificaci\xF3n: ", d_r40.codigo_verificacion, "");
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_7_0 = ctx_r0.envio()) ? 4 : 5, tmp_7_0);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(d_r40.estado_certificado === "PENDIENTE_FIRMA" ? 6 : -1);
  }
}
function PreparacionOrigenComponent_Conditional_1_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r28 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 8);
    \u0275\u0275listener("click", function PreparacionOrigenComponent_Conditional_1_Conditional_5_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r28);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.volverRegistros());
    });
    \u0275\u0275elementStart(1, "span", 7);
    \u0275\u0275text(2, "arrow_back");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, "Volver a pendientes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "h2");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "dl", 9)(7, "dt");
    \u0275\u0275text(8, "Beneficiario");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "dd");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "dt");
    \u0275\u0275text(12, "Origen");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "dd");
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275template(15, PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_15_Template, 4, 1)(16, PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_16_Template, 4, 1);
    \u0275\u0275elementStart(17, "dt");
    \u0275\u0275text(18, "Elegibilidad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "dd");
    \u0275\u0275text(20);
    \u0275\u0275elementEnd();
    \u0275\u0275template(21, PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_21_Template, 4, 1)(22, PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_22_Template, 4, 1)(23, PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_23_Template, 4, 1)(24, PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_24_Template, 4, 1)(25, PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_25_Template, 4, 2)(26, PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_26_Template, 4, 1)(27, PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_27_Template, 4, 1)(28, PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_28_Template, 4, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275template(29, PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_29_Template, 9, 3, "dl", 9);
    \u0275\u0275repeaterCreate(30, PreparacionOrigenComponent_Conditional_1_Conditional_5_For_31_Template, 2, 1, "p", 3, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275template(32, PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_32_Template, 4, 4)(33, PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_33_Template, 10, 7)(34, PreparacionOrigenComponent_Conditional_1_Conditional_5_Conditional_34_Template, 7, 4);
  }
  if (rf & 2) {
    let tmp_7_0;
    let tmp_9_0;
    let tmp_10_0;
    let tmp_11_0;
    let tmp_12_0;
    let tmp_13_0;
    let tmp_14_0;
    let tmp_15_0;
    let tmp_16_0;
    let tmp_17_0;
    let tmp_20_0;
    let tmp_21_0;
    const e_r34 = ctx;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r0.operando());
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.tipoNombre());
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.nombre());
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(e_r34.origen === "ponente_actividad" ? "Reconocimiento por actividad" : e_r34.origen === "ponente_sesion" ? "Reconocimiento por sesi\xF3n" : e_r34.origen === "practica" ? "Registro de pr\xE1cticas" : "Reconocimiento municipal");
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_7_0 = ctx_r0.datosPonente()) ? 15 : 16, tmp_7_0);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(e_r34.estado_elegibilidad);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_9_0 = ctx_r0.datos()) == null ? null : tmp_9_0.titulo) ? 21 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_10_0 = ctx_r0.datos()) == null ? null : tmp_10_0.motivo) ? 22 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_11_0 = ctx_r0.datos()) == null ? null : tmp_11_0.descripcion) ? 23 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_12_0 = ctx_r0.datos()) == null ? null : tmp_12_0.fecha_reconocimiento) ? 24 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_13_0 = ctx_r0.datos()) == null ? null : tmp_13_0.fecha_inicio) ? 25 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_14_0 = ctx_r0.datos()) == null ? null : tmp_14_0.area) ? 26 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_15_0 = ctx_r0.datos()) == null ? null : tmp_15_0.institucion) ? 27 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_16_0 = ctx_r0.datos()) == null ? null : tmp_16_0.carrera) ? 28 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_17_0 = ctx_r0.datosPonente()) ? 29 : -1, tmp_17_0);
    \u0275\u0275advance();
    \u0275\u0275repeater(e_r34.motivos_bloqueo);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx_r0.documento() ? 32 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_20_0 = ctx_r0.revision()) ? 33 : -1, tmp_20_0);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_21_0 = ctx_r0.documento()) ? 34 : -1, tmp_21_0);
  }
}
function PreparacionOrigenComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, PreparacionOrigenComponent_Conditional_1_Conditional_0_Template, 2, 0, "p", 3)(1, PreparacionOrigenComponent_Conditional_1_Conditional_1_Template, 2, 0, "p", 3)(2, PreparacionOrigenComponent_Conditional_1_Conditional_2_Template, 4, 2)(3, PreparacionOrigenComponent_Conditional_1_Conditional_3_Template, 2, 1, "p", 3)(4, PreparacionOrigenComponent_Conditional_1_Conditional_4_Template, 18, 2)(5, PreparacionOrigenComponent_Conditional_1_Conditional_5_Template, 35, 18);
  }
  if (rf & 2) {
    let tmp_6_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r0.cargando() ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.operando() ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.error() ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.aviso() ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0.evaluacion() ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_6_0 = ctx_r0.evaluacion()) ? 5 : -1, tmp_6_0);
  }
}
var PreparacionOrigenComponent = class _PreparacionOrigenComponent {
  origen = input.required();
  municipal = input(null);
  get esMunicipal() {
    return !!this.municipal();
  }
  get cuatroPasos() {
    return this.porSesion || this.esMunicipal;
  }
  ponente = input(null);
  asistente = input(false);
  retorno = input({});
  consultaExterna = input(false);
  consultaPendiente = input(false);
  evaluacionVigente = input(null);
  documentoRecuperado = input(null);
  pasoReconocimiento = signal(1);
  pdfReconocimientoRevisado = signal(null);
  get porSesion() {
    return this.ponente()?.origen === "ponente_sesion";
  }
  get pasoMensaje() {
    return 2;
  }
  get pasoPdf() {
    return 3;
  }
  get pasoConfirmacion() {
    return 4;
  }
  get pasoEnvio() {
    return this.cuatroPasos ? 4 : 5;
  }
  get pasosReconocimiento() {
    if (this.esMunicipal)
      return ["Informaci\xF3n", "Mensaje", "Previsualizaci\xF3n", "Enviar a Gerencia"];
    return this.cuatroPasos ? ["Informaci\xF3n", "Mensaje", "Previsualizaci\xF3n", "Enviar a Gerencia"] : ["Datos", "Mensaje", "Previsualizar PDF", "Guardar y continuar", "Enviar a Gerencia"];
  }
  cerrado = output();
  mensajeCertificado = inject(NonNullableFormBuilder).control("", validarMensajeCertificado);
  motivoCertificado = inject(NonNullableFormBuilder).control("", (c) => validarMensajeCertificado(c) || (Array.from(c.value).length > 500 ? { longitudUnicode: true } : null));
  textosValidos() {
    return this.mensajeCertificado.valid && this.motivoCertificado.valid;
  }
  caracteresMensaje() {
    return Array.from(this.mensajeCertificado.value).length;
  }
  descargaMunicipalPermitida = puedeDescargarDocumentoAdministrativo;
  api = inject(EmisionCertificadosService);
  documentos = inject(DocumentosDigitalesService);
  cambios = inject(CambiosCertificadosService);
  auth = inject(AuthService);
  destroy = inject(DestroyRef);
  consulta;
  consultaMensajeMunicipal;
  contextoMunicipalId = null;
  mensajeMunicipalConsultado = null;
  documentoPersistido(d) {
    return !!d && d.persistido !== false && Number.isSafeInteger(d.id_certificado_documento) && d.id_certificado_documento > 0;
  }
  mensajeMunicipalEditable() {
    const e = this.evaluacion();
    return this.esMunicipal && e?.origen === "reconocimiento" && !this.documentoPersistido(this.documento()) && !e.certificados_existentes.length && !e.documento_existente && e.texto_editable !== false && e.puede_preparar === true && e.puede_generar_pdf === true && e.estado_elegibilidad === "Elegible";
  }
  iniciarMunicipal(e) {
    if (this.contextoMunicipalId !== e.id_origen) {
      this.consulta?.unsubscribe();
      this.consultaMensajeMunicipal?.unsubscribe();
      this.limpiar();
      this.pasoReconocimiento.set(1);
      this.contextoMunicipalId = e.id_origen;
      this.mensajeMunicipalConsultado = null;
      this.mensajeCertificado.reset("", { emitEvent: false });
    }
    this.evaluacion.set(e);
    const d = this.documentoRecuperado();
    if (this.documentoPersistido(d))
      this.documento.set(d);
    if (this.documentoPersistido(this.documento()))
      return;
    this.mensajeCertificado.enable({ emitEvent: false });
    const mensaje = e.mensaje ?? e.mensaje_predeterminado;
    if (typeof mensaje === "string" && !this.mensajeCertificado.dirty)
      this.mensajeCertificado.setValue(mensaje, { emitEvent: false });
    if (!e.certificados_existentes.length && !e.documento_existente && (typeof mensaje !== "string" || typeof e.texto_editable !== "boolean") && this.mensajeMunicipalConsultado !== e.id_origen) {
      this.mensajeMunicipalConsultado = e.id_origen;
      this.consultaMensajeMunicipal = this.documentos.consultarReconocimiento(e.id_origen).pipe(takeUntilDestroyed(this.destroy)).subscribe({
        next: (resultado) => {
          if (this.contextoMunicipalId !== e.id_origen)
            return;
          const guardado = resultado;
          if (this.documentoPersistido(guardado)) {
            if (guardado.origen !== "reconocimiento" || guardado.beneficiario?.id_persona !== e.id_persona || guardado.id_tipo_certificado !== e.id_tipo_certificado) {
              this.error.set("No se pudo confirmar el beneficiario del documento.");
              return;
            }
            this.consulta?.unsubscribe();
            this.documento.set(guardado);
            this.revision.set(null);
            return;
          }
          if (this.documentoPersistido(this.documento()))
            return;
          const vigente = resultado;
          if (vigente.origen !== "reconocimiento" || vigente.id_origen !== e.id_origen || vigente.id_persona !== e.id_persona) {
            this.error.set("No se pudo confirmar el reconocimiento consultado.");
            return;
          }
          this.evaluacion.set(vigente);
          const texto = vigente.mensaje ?? vigente.mensaje_predeterminado;
          if (typeof texto === "string" && !this.mensajeCertificado.dirty)
            this.mensajeCertificado.setValue(texto, { emitEvent: false });
        },
        error: (err) => this.error.set(mensajeEtapaA(err))
      });
    }
  }
  revisionCaducada = signal(false);
  registros = signal([]);
  evaluacion = signal(null);
  revision = signal(null);
  documento = signal(null);
  envio = signal(null);
  cargando = signal(false);
  operando = signal(false);
  operacionActual = signal(null);
  mensajeOperacion() {
    if (this.pasoReconocimiento() === 1)
      return "";
    switch (this.operacionActual()) {
      case "informacion":
        return "Consultando informaci\xF3n\u2026";
      case "recuperacion":
        return "Cargando preparaci\xF3n guardada\u2026";
      case "vista_previa":
        return "Generando vista previa\u2026";
      case "confirmacion":
        return "Confirmando PDF\u2026";
      case "envio":
        return "Enviando a Gerencia\u2026";
      default:
        return "";
    }
  }
  error = signal("");
  aviso = signal("");
  falloConsultaExistente = signal(false);
  tiposVigentes = signal([]);
  constructor() {
    effect(() => {
      const documento = this.documentoRecuperado();
      if (documento && (!this.esMunicipal || this.documentoPersistido(documento)))
        untracked(() => this.documento.set(documento));
    }, { allowSignalWrites: true });
    effect(() => {
      const vigente = this.evaluacionVigente();
      if (vigente)
        untracked(() => this.evaluacion.set(vigente));
    }, { allowSignalWrites: true });
    effect((onCleanup) => {
      const r = this.revision();
      this.revisionCaducada.set(false);
      if (!r)
        return;
      const restante = Date.parse(r.expiresAt) - Date.now();
      if (!Number.isFinite(restante) || restante <= 0) {
        this.revisionCaducada.set(true);
        return;
      }
      const vencimiento = timer(restante).subscribe(() => this.revisionCaducada.set(true));
      onCleanup(() => vencimiento.unsubscribe());
    }, { allowSignalWrites: true });
    effect(() => {
      const d = this.documento();
      if (!this.cuatroPasos || !d || this.esMunicipal && !this.documentoPersistido(d))
        return;
      untracked(() => {
        this.mensajeCertificado.setValue(d.mensaje_aprobado ?? d.mensaje ?? "", { emitEvent: false });
        this.motivoCertificado.setValue(d.motivo ?? "", { emitEvent: false });
        this.mensajeCertificado.disable({ emitEvent: false });
        this.motivoCertificado.disable({ emitEvent: false });
        this.revision.set(null);
        this.pdfReconocimientoRevisado.set(null);
      });
    }, { allowSignalWrites: true });
    for (const control of [this.mensajeCertificado, this.motivoCertificado]) {
      control.valueChanges.pipe(takeUntilDestroyed(this.destroy)).subscribe(() => {
        if (this.cuatroPasos && !this.documento()) {
          this.revision.set(null);
          this.pdfReconocimientoRevisado.set(null);
          this.envio.set(null);
        }
      });
    }
    effect(() => {
      const origen = this.origen();
      const ponente = this.municipal() ?? this.ponente();
      const asistente = this.asistente();
      untracked(() => {
        if (!ponente) {
          this.cargar(origen);
          return;
        }
        if (this.municipal()) {
          this.iniciarMunicipal(this.municipal());
          return;
        }
        this.consulta?.unsubscribe();
        this.limpiar();
        this.pasoReconocimiento.set(1);
        this.evaluacion.set(this.evaluacionVigente() ?? ponente);
        this.documento.set(this.documentoRecuperado());
        this.mensajeCertificado.enable({ emitEvent: false });
        this.motivoCertificado.enable({ emitEvent: false });
        if (ponente.origen === "ponente_sesion") {
          this.motivoCertificado.setValue(`Participaci\xF3n como ponente en ${ponente.sesion ?? ""}`.slice(0, 500));
          this.mensajeCertificado.setValue(`Por su valiosa participaci\xF3n como ponente en la sesi\xF3n ${ponente.sesion ?? ""} de la actividad ${ponente.actividad ?? ""}, compartiendo sus conocimientos y contribuyendo al desarrollo de sus participantes.`.slice(0, 1200));
        }
        const existentes = ponente.certificados_existentes ?? [];
        if (!this.consultaExterna() && ponente.puede_consultar_certificado_existente && existentes.length === 1)
          this.abrirExistente(existentes[0].id_certificado);
        else if (!asistente && this.puedePreparar())
          this.revisar();
      });
    }, { allowSignalWrites: true });
    effect(() => {
      if (!this.asistente() || this.cuatroPasos)
        return;
      const documento = this.documento();
      const envio = this.envio();
      if (documento)
        this.pasoReconocimiento.set(this.cuatroPasos || envio || documento.estado_certificado !== "PREPARADO" ? this.pasoEnvio : this.pasoConfirmacion);
    }, { allowSignalWrites: true });
  }
  siguienteReconocimiento() {
    if (this.esMunicipal) {
      if (!this.puedeAvanzar())
        return;
      if (this.pasoReconocimiento() === 1 || this.documento()) {
        this.pasoReconocimiento.update((p) => Math.min(4, p + 1));
        return;
      }
      if (this.pasoReconocimiento() === 2) {
        this.pasoReconocimiento.set(3);
        if (!this.revisionVigente())
          this.revisar();
      }
      return;
    }
    if (this.cuatroPasos && this.documento()) {
      if (!this.operando())
        this.pasoReconocimiento.update((p) => Math.min(p + 1, this.pasoEnvio));
      return;
    }
    if (this.porSesion && this.pasoReconocimiento() === this.pasoMensaje) {
      this.mensajeCertificado.markAsTouched();
      this.motivoCertificado.markAsTouched();
      if (this.puedeAvanzar())
        this.revisar();
      return;
    }
    if (!this.puedeAvanzar())
      return;
    if (this.porSesion && this.pasoReconocimiento() === 1) {
      this.pasoReconocimiento.set(2);
      return;
    }
    if (this.pasoReconocimiento() === this.pasoMensaje - 1) {
      this.pasoReconocimiento.set(this.pasoMensaje);
      if (!this.porSesion && !this.revision())
        this.revisar();
    } else if (this.pasoReconocimiento() === this.pasoMensaje && this.revision())
      this.pasoReconocimiento.set(this.pasoPdf);
  }
  anteriorReconocimiento() {
    if (this.esMunicipal && this.pasoReconocimiento() === 3 && !this.documento() && this.operacionActual() === "vista_previa") {
      this.consulta?.unsubscribe();
      this.operando.set(false);
      this.pasoReconocimiento.set(2);
      return;
    }
    if (!this.operando() && (!this.documento() || this.cuatroPasos) && this.pasoReconocimiento() > 1)
      this.pasoReconocimiento.update((p) => p - 1);
  }
  puedeGuardarReconocimiento() {
    return this.pasoReconocimiento() === this.pasoPdf && this.puedePreparar() && !!this.revision() && (!this.cuatroPasos || this.revisionVigente()) && (!this.porSesion || this.contextoSesionValido()) && this.pdfReconocimientoRevisado() === this.revision()?.archivo;
  }
  puedeAvanzar() {
    if (this.esMunicipal) {
      if (this.pasoReconocimiento() === 1)
        return !!this.evaluacion();
      if (this.operando() || this.consultaPendiente() || this.falloConsultaExistente())
        return false;
      if (this.documento())
        return this.pasoReconocimiento() < 4;
      return this.puedePreparar() && (this.pasoReconocimiento() === 1 || this.pasoReconocimiento() === 2 && this.mensajeMunicipalEditable() && this.mensajeCertificado.valid);
    }
    if (this.cuatroPasos && this.documento())
      return !this.operando();
    if (this.porSesion && this.pasoReconocimiento() === 1 && this.consultaPendiente())
      return this.contextoSesionValido();
    if (this.falloConsultaExistente() || !this.puedePreparar())
      return false;
    if (!this.porSesion)
      return this.pasoReconocimiento() === 1 || !!this.revision();
    switch (this.pasoReconocimiento()) {
      case 1:
        return this.contextoSesionValido();
      case 2:
        return this.contextoSesionValido() && this.textosValidos();
      default:
        return false;
    }
  }
  identidadSesionValida() {
    const e = this.datosPonente();
    return e?.origen === "ponente_sesion" && e.modalidad_reconocimiento === "sesion" && [e.id_origen, e.id_persona, e.id_persona_ponente].every((id) => Number.isSafeInteger(id) && Number(id) > 0) && e.id_actividad_ponente === e.id_origen && !!this.nombre().trim();
  }
  contextoSesionValido() {
    const e = this.datosPonente();
    return this.identidadSesionValida() && !!e && [e.id_actividad, e.id_sesion, e.id_tipo_certificado].every((id) => Number.isSafeInteger(id) && Number(id) > 0) && !!e.actividad?.trim() && !!e.sesion?.trim() && this.fechaSesion() !== "No disponible";
  }
  revisionVigente() {
    const r = this.revision();
    return !this.revisionCaducada() && !!r?.mensaje.trim() && Date.parse(r.expiresAt) > Date.now() && (!this.esMunicipal || r.mensaje === this.mensajeCertificado.value) && (!this.porSesion || r.mensaje === this.mensajeCertificado.value && r.motivo === this.motivoCertificado.value);
  }
  volverRegistros() {
    if (this.ponente())
      this.cerrado.emit();
    else
      this.cargar();
  }
  cargar(origen = this.origen()) {
    if (this.ponente() || this.municipal()) {
      this.cerrado.emit();
      return;
    }
    this.consulta?.unsubscribe();
    this.limpiar();
    this.registros.set([]);
    this.tiposVigentes.set([]);
    this.cargando.set(true);
    const permiso = origen === "practica" ? "practicantes.ver" : "reconocimientos.ver";
    if (!this.auth.tienePermiso(permiso)) {
      this.error.set("No tienes permiso para consultar estos registros.");
      this.cargando.set(false);
      return;
    }
    const fuente = origen === "reconocimiento" ? this.api.listarTodos("reconocimientos").pipe(map((filas) => filas.map((r) => ({ id: r.id_reconocimiento, nombre: r.titulo, estado: r.estado })))) : this.api.registrosPracticas().pipe(map((filas) => filas.map((r) => ({
      id: r.id_practica,
      nombre: [r.carrera, r.fecha_inicio, r.fecha_fin].filter(Boolean).join(" \xB7 "),
      estado: r.estado
    }))));
    const registros = this.auth.tienePermiso("actividades.ver") ? forkJoin({ registros: fuente, catalogos: this.api.catalogosOrigenes() }).pipe(map((d) => {
      this.tiposVigentes.set(d.catalogos.tipos_certificado.filter((t) => t.estado === true || String(t.estado) === "1"));
      return d.registros;
    })) : fuente;
    this.consulta = registros.pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: (filas) => {
        this.registros.set(filas);
        this.cargando.set(false);
      },
      error: (e) => {
        this.error.set(mensajeEtapaA(e));
        this.cargando.set(false);
      }
    });
  }
  limpiar() {
    this.evaluacion.set(null);
    this.revision.set(null);
    this.documento.set(null);
    this.envio.set(null);
    this.error.set("");
    this.aviso.set("");
    this.operando.set(false);
    this.operacionActual.set(null);
    this.falloConsultaExistente.set(false);
    this.pdfReconocimientoRevisado.set(null);
  }
  consultar(id) {
    if (this.operando() || !this.registros().some((r) => r.id === id))
      return;
    this.consulta?.unsubscribe();
    this.limpiar();
    this.ejecutar(this.api.evaluarOrigen(this.origen(), id), (e) => this.evaluacion.set(e));
  }
  datos() {
    const e = this.evaluacion();
    return e && (e.origen === "reconocimiento" || e.origen === "practica") ? e[e.origen] : void 0;
  }
  datosPonente() {
    const e = this.evaluacion();
    return e?.origen === "ponente_actividad" || e?.origen === "ponente_sesion" ? e : null;
  }
  nombre() {
    const d = this.datosPonente() ?? this.datos();
    return [d?.nombres, d?.apellido_paterno, d?.apellido_materno].filter(Boolean).join(" ");
  }
  modalidadPonente() {
    return this.datosPonente()?.origen === "ponente_sesion" ? "Reconocimiento por sesi\xF3n" : "Reconocimiento por actividad";
  }
  fechaSesion() {
    const valor = this.datosPonente()?.origen === "ponente_sesion" ? this.datosPonente().fecha_sesion : null;
    return this.fechaInterfaz(valor);
  }
  fechaInterfaz(valor) {
    const partes = /^(\d{4})-(\d{2})-(\d{2})(?:$|T| )/.exec(valor ?? "");
    if (!partes)
      return "No disponible";
    const [, anio, mes, dia] = partes;
    const fecha = /* @__PURE__ */ new Date(`${anio}-${mes}-${dia}T00:00:00Z`);
    return fecha.getUTCFullYear() === +anio && fecha.getUTCMonth() + 1 === +mes && fecha.getUTCDate() === +dia ? `${dia}/${mes}/${anio}` : "No disponible";
  }
  nombreSesion() {
    const nombre = this.datosPonente()?.sesion?.trim() ?? "";
    const numero = /^(?:sesi[oó]n\s*)+(?:n[.º°o\s]*|#)?\s*(\d+)$/iu.exec(nombre);
    return numero ? `Sesi\xF3n N.\xBA ${numero[1].padStart(3, "0")}` : nombre || "No disponible";
  }
  motivoReconocimiento() {
    return this.datosPonente()?.datos_origen?.titulo || "No disponible";
  }
  tipoNombre() {
    const e = this.evaluacion();
    return e?.tipo_certificado || this.tiposVigentes().find((t) => t.id_tipo_certificado === e?.id_tipo_certificado)?.nombre_tipo || "Tipo documental no disponible";
  }
  puedePreparar() {
    const e = this.evaluacion();
    return !this.consultaPendiente() && !!e && e.puede_preparar === true && e.puede_generar_pdf === true && e.estado_elegibilidad === "Elegible" && !(e.certificados_existentes ?? []).some((c) => c.id_tipo_certificado === e.id_tipo_certificado) && !this.documento() && !this.operando() && (!this.esMunicipal || !this.falloConsultaExistente());
  }
  revisar() {
    const e = this.evaluacion();
    if (!e || !this.puedePreparar())
      return;
    if (this.porSesion && (!this.contextoSesionValido() || this.pasoReconocimiento() !== this.pasoMensaje))
      return;
    if (this.porSesion && !this.textosValidos())
      return;
    if (this.esMunicipal && (this.mensajeCertificado.invalid || !this.mensajeMunicipalEditable() || this.pasoReconocimiento() !== 3))
      return;
    this.revision.set(null);
    this.pdfReconocimientoRevisado.set(null);
    this.envio.set(null);
    const mensajeSolicitado = this.mensajeCertificado.value;
    const motivoSolicitado = this.motivoCertificado.value;
    const solicitud = e.origen === "ponente_sesion" ? this.documentos.revisarOrigen(e.origen, e.id_origen, { modalidad_reconocimiento: "sesion", id_sesion: e.id_sesion, mensaje: this.mensajeCertificado.value, motivo: this.motivoCertificado.value }) : this.esMunicipal ? this.documentos.revisarOrigen("reconocimiento", e.id_origen, void 0, mensajeSolicitado) : this.documentos.revisarOrigen(e.origen, e.id_origen);
    this.ejecutar(solicitud.pipe(catchError((error) => {
      if (!this.esPonente(e) || ![0, 408, 409].includes(error?.status))
        return throwError(() => error);
      return this.recuperarVigente(e).pipe(switchMap((vigente) => {
        if (!vigente || vigente.id_persona !== e.id_persona)
          return throwError(() => error);
        this.evaluacion.set(vigente);
        const existentes = vigente.certificados_existentes ?? [];
        if (vigente.puede_consultar_certificado_existente !== true || existentes.length !== 1)
          return throwError(() => error);
        return this.recuperarExistente(vigente, existentes[0].id_certificado).pipe(map((d) => {
          this.documento.set(d);
          return null;
        }));
      }));
    })), (r) => {
      if (r?.documento) {
        this.documento.set(r.documento);
        if (this.porSesion)
          this.pasoReconocimiento.set(this.pasoPdf);
        return;
      }
      if ((this.porSesion || this.esMunicipal) && (this.mensajeCertificado.value !== mensajeSolicitado || this.porSesion && this.motivoCertificado.value !== motivoSolicitado)) {
        this.error.set("Los textos cambiaron durante la revisi\xF3n. Genera una nueva vista previa.");
        return;
      }
      this.revision.set(r);
      if (this.cuatroPasos && r)
        this.pasoReconocimiento.set(this.pasoPdf);
    }, void 0, "vista_previa");
  }
  guardar() {
    const e = this.evaluacion();
    const r = this.revision();
    if (!e || !r || !this.puedePreparar() || this.asistente() && !this.puedeGuardarReconocimiento())
      return;
    this.ejecutar(this.documentos.guardarOrigen(e, r).pipe(catchError((error) => {
      if (!this.esMunicipal)
        return throwError(() => error);
      this.falloConsultaExistente.set(true);
      this.revision.set(null);
      return this.api.evaluarOrigen("reconocimiento", e.id_origen).pipe(switchMap((actual) => {
        this.evaluacion.set(actual);
        return recuperarMunicipal(this.api, this.documentos, actual).pipe(switchMap((d) => d ? of(d) : throwError(() => error)));
      }));
    })), (d) => {
      this.falloConsultaExistente.set(false);
      this.documento.set(d);
      this.revision.set(null);
      if (this.cuatroPasos)
        this.pasoReconocimiento.set(this.pasoEnvio);
      this.aviso.set(this.porSesion ? d.estado_certificado === "PREPARADO" ? "Reconocimiento preparado correctamente" : "" : "Certificado preparado");
      this.cambios.confirmar();
    }, void 0, "confirmacion");
  }
  abrirExistente(id) {
    const e = this.evaluacion();
    if (!e || this.operando() || e.puede_consultar_certificado_existente !== true || !(e.certificados_existentes ?? []).some((c) => c.id_certificado === id && c.id_tipo_certificado === e.id_tipo_certificado))
      return;
    if (e.origen === "ponente_actividad" || e.origen === "ponente_sesion") {
      this.falloConsultaExistente.set(false);
      this.ejecutar(this.recuperarExistente(e, id), (d) => {
        this.documento.set(d);
        this.revision.set(null);
        this.envio.set(null);
      }, (error) => {
        if (this.porSesion && error.status === 404 && error.evaluacion) {
          this.evaluacion.set(error.evaluacion);
          this.pasoReconocimiento.set(1);
          return "";
        }
        this.falloConsultaExistente.set(true);
        this.pasoReconocimiento.set(1);
        if (error.status === 403)
          return "No tienes autorizaci\xF3n para consultar este reconocimiento.";
        if (error.status === 409)
          return "El reconocimiento presenta un conflicto. Actualiza su estado.";
        return "No se pudo consultar el reconocimiento. Reintentar";
      }, "recuperacion");
      return;
    }
    this.ejecutar(this.api.obtener("certificados", id).pipe(switchMap((c) => {
      if (c.id_certificado !== id || c.id_persona !== e.id_persona || c[`id_${e.origen}`] !== e.id_origen || !Number.isSafeInteger(c["id_certificado_documento"]) || Number(c["id_certificado_documento"]) < 1)
        throw new Error("No se pudo recuperar el documento existente.");
      return this.documentos.detalleFirmas(Number(c["id_certificado_documento"]));
    }), map((d) => {
      if (d.id_certificado !== id || d.origen !== e.origen || d.beneficiario?.id_persona !== e.id_persona)
        throw new Error("No se pudo confirmar el beneficiario del documento.");
      return d;
    })), (d) => {
      this.documento.set(d);
      this.revision.set(null);
      this.envio.set(null);
    });
  }
  reintentarConsultaExistente() {
    if (this.esMunicipal && !this.operando()) {
      this.ejecutar(this.api.evaluarOrigen("reconocimiento", this.municipal().id_origen).pipe(switchMap((e) => {
        this.evaluacion.set(e);
        return recuperarMunicipal(this.api, this.documentos, e);
      })), (d) => {
        this.documento.set(d);
        this.revision.set(null);
        this.falloConsultaExistente.set(false);
        this.pasoReconocimiento.set(d ? 4 : 1);
      });
      return;
    }
    const existentes = this.evaluacion()?.certificados_existentes ?? [];
    if (existentes.length === 1)
      this.abrirExistente(existentes[0].id_certificado);
  }
  authGerencia() {
    return this.auth.tienePermiso("emision.ver");
  }
  puedeRemitir() {
    const d = this.documento();
    return !!d && d.estado_certificado === "PREPARADO" && d.facultades?.remitir === true && d.puede_enviar_gerencia !== false && !this.operando() && (!this.esMunicipal || estadoDocumentalPractica(d) === "Pendiente de env\xEDo a Gerencia");
  }
  estadoReconocimiento() {
    const d = this.documento();
    if (d?.estado_certificado === "PREPARADO")
      return "Pendiente de env\xEDo a Gerencia";
    if (d?.disponible_rrhh === true || d?.estado_preparacion === "PREPARADO_ENTREGA")
      return "Listo para entrega";
    if (d?.estado_certificado === "PENDIENTE_FIRMA")
      return "Enviado a Gerencia";
    return d?.estado_certificado ?? "";
  }
  /** Solo el clic explícito del paso 4 revisa y remite el documento ya guardado. */
  enviarSesion() {
    const d = this.documento();
    if (!this.cuatroPasos || this.pasoReconocimiento() !== this.pasoEnvio || !d || !this.puedeRemitir())
      return;
    this.ejecutar(this.documentos.obtenerRevisionEnvio(d.id_certificado_documento, d.hash_pdf).pipe(switchMap((r) => {
      if (Date.parse(r.expiresAt) <= Date.now())
        return throwError(() => ({ status: 409, mensaje: "La revisi\xF3n venci\xF3. Reintenta el env\xEDo.", errores: {} }));
      return this.documentos.confirmarEnvio(d.id_certificado_documento, r.token, r.hash);
    }), catchError((error) => {
      if (![0, 408, 409].includes(error?.status))
        return throwError(() => error);
      return this.documentos.detalleFirmas(d.id_certificado_documento).pipe(switchMap((actual) => {
        if (actual.id_certificado_documento !== d.id_certificado_documento)
          return throwError(() => error);
        if (actual.estado_certificado === "PENDIENTE_FIRMA")
          return of(actual);
        if (actual.estado_certificado === "PREPARADO")
          this.documento.set(__spreadValues(__spreadValues({}, d), actual));
        return throwError(() => error);
      }));
    })), (doc) => this.registrarEnvio(doc, d.id_certificado_documento), () => "No se pudo enviar el certificado. Intenta nuevamente.", "envio");
  }
  revisarEnvio() {
    const d = this.documento();
    if (!d || !this.puedeRemitir())
      return;
    this.envio.set(null);
    this.ejecutar(this.documentos.obtenerRevisionEnvio(d.id_certificado_documento, d.hash_pdf).pipe(catchError((error) => {
      const e = this.datosPonente();
      if (!this.asistente() || !e || !d.id_certificado || ![0, 408, 409].includes(error?.status))
        return throwError(() => error);
      return this.recuperarExistente(e, d.id_certificado).pipe(switchMap((vigente) => {
        this.documento.set(vigente);
        return vigente.estado_certificado !== "PREPARADO" ? of(null) : throwError(() => error);
      }));
    })), (r) => this.envio.set(r), void 0, "envio");
  }
  /** Recupera el documento existente del mismo origen, beneficiario, actividad y sesión. */
  recuperarExistente(e, certificado) {
    return e.origen === "ponente_sesion" ? this.documentos.recuperarReconocimientoSesion(e, certificado) : this.documentos.recuperarReconocimientoActividad(e, certificado);
  }
  /** Reconfirma el vínculo vigente del ponente antes de reutilizar un guardado incierto. */
  recuperarVigente(e) {
    return e.origen === "ponente_sesion" ? this.api.ponentesCertificacion(e.id_sesion).pipe(timeout(3e4), map((d) => d.ponentes_sesion?.find((p) => p.id_actividad_ponente === e.id_origen)?.reconocimiento ?? null)) : this.api.ponentesActividad(e.id_actividad).pipe(timeout(3e4), map((d) => d.ponentes.find((p) => p.id_actividad_ponente === e.id_origen)?.reconocimiento ?? null));
  }
  esPonente(e) {
    return e.origen === "ponente_actividad" || e.origen === "ponente_sesion";
  }
  enviar() {
    const d = this.documento();
    const r = this.envio();
    if (!d || !r || !this.puedeRemitir())
      return;
    this.ejecutar(this.documentos.confirmarEnvio(d.id_certificado_documento, r.token, r.hash), (doc) => {
      this.registrarEnvio(doc, d.id_certificado_documento);
    }, void 0, "envio");
  }
  registrarEnvio(doc, idDocumento) {
    if (doc.id_certificado_documento !== idDocumento) {
      this.error.set("No se pudo confirmar el documento enviado.");
      return;
    }
    this.documento.set(this.porSesion ? __spreadValues(__spreadValues({}, this.documento()), doc) : doc);
    this.envio.set(null);
    if (doc.estado_certificado === "PENDIENTE_FIRMA") {
      this.aviso.set("Enviado a Gerencia");
      this.cambios.confirmar();
    } else {
      this.error.set("El env\xEDo no fue confirmado. Revisa el estado del documento y reintenta.");
    }
  }
  ejecutar(fuente, resultado, errorConsulta, tipo = "informacion") {
    this.operacionActual.set(tipo);
    this.operando.set(true);
    this.error.set("");
    this.aviso.set("");
    const operacion = this.asistente() ? fuente.pipe(timeout(24e4)) : fuente;
    this.consulta = operacion.pipe(takeUntilDestroyed(this.destroy), finalize(() => {
      this.operando.set(false);
      this.operacionActual.set(null);
    })).subscribe({
      next: (dato) => {
        this.operando.set(false);
        resultado(dato);
      },
      error: (e) => {
        this.operando.set(false);
        this.error.set(errorConsulta ? errorConsulta(e) : this.asistente() && e.status === 409 ? e.mensaje || "La operaci\xF3n est\xE1 bloqueada. Actualiza el estado antes de reintentar." : mensajeEtapaA(e));
      }
    });
  }
  static \u0275fac = function PreparacionOrigenComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PreparacionOrigenComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PreparacionOrigenComponent, selectors: [["app-preparacion-origen"]], inputs: { origen: [1, "origen"], municipal: [1, "municipal"], ponente: [1, "ponente"], asistente: [1, "asistente"], retorno: [1, "retorno"], consultaExterna: [1, "consultaExterna"], consultaPendiente: [1, "consultaPendiente"], evaluacionVigente: [1, "evaluacionVigente"], documentoRecuperado: [1, "documentoRecuperado"] }, outputs: { cerrado: "cerrado" }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 2, vars: 1, consts: [["aria-label", "Asistente de reconocimiento", 1, "reconocimiento-asistente"], ["routerLink", "/certificaciones/generar-emitir", 1, "btn", "regreso-asistente", 3, "queryParams"], ["aria-label", "Pasos del reconocimiento", 1, "pasos-reconocimiento"], ["role", "status"], ["role", "alert"], ["type", "button", 1, "btn", 3, "disabled"], [1, "contenido-paso"], ["aria-hidden", "true", 1, "material-symbols-outlined"], ["type", "button", 1, "btn", 3, "click", "disabled"], [1, "datos"], [1, "acciones-paso"], ["routerLink", "/certificaciones/generar-emitir", 1, "btn", 3, "queryParams"], ["type", "button", 1, "btn", "btn-primary", 3, "click", "disabled"], [1, "informacion-reconocimiento"], ["aria-label", "Texto del reconocimiento", 1, "texto-reconocimiento"], ["for", "motivo-reconocimiento"], ["id", "motivo-reconocimiento", 1, "input", 3, "formControl", "readonly"], ["for", "mensaje-certificado"], ["id", "mensaje-certificado", "rows", "8", 1, "input", "editor-mensaje", 3, "formControl", "readonly"], ["for", "mensaje-municipal"], ["id", "mensaje-municipal", "rows", "8", "aria-describedby", "contador-municipal", 1, "input", "editor-mensaje", 3, "formControl", "readonly"], ["id", "contador-municipal"], [1, "mensaje"], ["type", "button", 1, "btn", 3, "click"], [3, "documentoId", "urlAdministrativa", "hashEsperado", "permitirDescarga", "flujoFirmas", "persistido", "integrado", "ajustarAncho", "controlesZoom"], [3, "archivoVisualizado", "errorVisualizacion", "archivoPrevio", "integrado", "ajustarAncho", "controlesZoom", "mostrarDescripcion"], ["type", "button", 1, "btn", "confirmar", 3, "disabled"], ["type", "button", 1, "btn", "confirmar", 3, "click", "disabled"], [3, "documentoId", "urlAdministrativa", "hashEsperado", "flujoFirmas", "persistido", "integrado", "ajustarAncho", "controlesZoom"], ["type", "button", 1, "btn", "btn-primary", 3, "disabled"], [3, "archivoPrevio", "persistido", "integrado", "ajustarAncho", "controlesZoom"], [1, "btn", 3, "routerLink"], ["routerLink", "/certificaciones/generar-emitir", 1, "btn", "btn-primary", 3, "queryParams"], [1, "tabla"], [1, "table"], ["scope", "col", 1, "col-centro", "col-numero"], [1, "col-centro"], ["data-label", "N.\xBA", 1, "col-centro", "col-numero"], ["colspan", "4"], ["type", "button", 1, "btn", "btn-primary"], ["type", "button", 1, "btn", "btn-primary", 3, "click"], [3, "archivoPrevio", "integrado", "ajustarAncho", "controlesZoom"], [1, "acciones"]], template: function PreparacionOrigenComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275template(0, PreparacionOrigenComponent_Conditional_0_Template, 16, 10, "section", 0)(1, PreparacionOrigenComponent_Conditional_1_Template, 6, 6);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.asistente() ? 0 : 1);
    }
  }, dependencies: [RouterLink, VisorPdfComponent, ReactiveFormsModule, DefaultValueAccessor, NgControlStatus, FormControlDirective], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.encabezado[_ngcontent-%COMP%], \n.acciones[_ngcontent-%COMP%], \n.paginacion[_ngcontent-%COMP%], \n.filtros[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: var(--espacio-3);\n}\n.encabezado[_ngcontent-%COMP%] {\n  justify-content: space-between;\n  margin-bottom: var(--espacio-4);\n}\n.acciones[_ngcontent-%COMP%], \n.filtros[_ngcontent-%COMP%], \n.paginacion[_ngcontent-%COMP%] {\n  margin-block: var(--espacio-4);\n}\n.tabla[_ngcontent-%COMP%] {\n  overflow-x: auto;\n}\n.grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));\n  gap: var(--espacio-4);\n}\n.form-field[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.detalle[_ngcontent-%COMP%] {\n  margin-block: var(--espacio-5);\n}\ndt[_ngcontent-%COMP%] {\n  color: var(--neutro-500);\n  font-size: 0.875rem;\n}\ndd[_ngcontent-%COMP%] {\n  margin: 0 0 var(--espacio-3);\n  overflow-wrap: anywhere;\n}\n.nota[_ngcontent-%COMP%] {\n  color: var(--neutro-700);\n  font-size: 0.875rem;\n}\n.table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  overflow-wrap: anywhere;\n}\n.errores[_ngcontent-%COMP%] {\n  color: var(--color-error);\n}\n.reconocimiento[_ngcontent-%COMP%] {\n  border-top: 3px solid var(--boton-dorado);\n  overflow-wrap: anywhere;\n}\n.reconocimiento[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin-top: var(--espacio-4);\n  font-size: 1.25rem;\n}\n/*# sourceMappingURL=emision.css.map */", "\n\n.reconocimiento-asistente[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n  color: #20374e;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%], \n.reconocimiento-asistente[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  color: #075a9b;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .titulo-asistente[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .titulo-asistente[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .regreso-asistente[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin-top: 0.3rem;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .pasos-reconocimiento[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.75rem;\n  overflow-x: auto;\n  padding: 1rem 0;\n  list-style: none;\n  border-bottom: 1px solid #dfe6ef;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .pasos-reconocimiento[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  white-space: nowrap;\n  padding: 0.5rem 0.75rem;\n  border-bottom: 3px solid #dfe6ef;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .pasos-reconocimiento[_ngcontent-%COMP%]   [aria-current=step][_ngcontent-%COMP%] {\n  color: #075a9b;\n  border-color: #bf942d;\n  font-weight: 700;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .contenido-paso[_ngcontent-%COMP%] {\n  padding: 1rem 0;\n  min-width: 0;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .acciones-paso[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n  margin-top: 1.25rem;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .confirmar[_ngcontent-%COMP%] {\n  background: #bd932d;\n  color: #172e45;\n  border-color: #bd932d;\n  font-weight: 600;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .mensaje[_ngcontent-%COMP%] {\n  white-space: pre-wrap;\n  line-height: 1.7;\n  max-width: 70rem;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .informacion-reconocimiento[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr);\n  gap: 1rem;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .ficha-reconocimiento[_ngcontent-%COMP%], \n.reconocimiento-asistente[_ngcontent-%COMP%]   .texto-reconocimiento[_ngcontent-%COMP%] {\n  padding: 1rem;\n  border: 1px solid #dfe6ef;\n  border-radius: 0.65rem;\n  min-width: 0;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0 0 0.75rem;\n  color: #075a9b;\n  font-size: 1rem;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .resumen-reconocimiento[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.8rem;\n  margin: 0;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   dt[_ngcontent-%COMP%], \n.reconocimiento-asistente[_ngcontent-%COMP%]   .ayuda-texto[_ngcontent-%COMP%] {\n  color: #53657a;\n  font-size: 0.85rem;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   dd[_ngcontent-%COMP%] {\n  margin: 0.2rem 0 0;\n  overflow-wrap: anywhere;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .funcion-ponente[_ngcontent-%COMP%], \n.reconocimiento-asistente[_ngcontent-%COMP%]   .solo-lectura[_ngcontent-%COMP%] {\n  display: inline-block;\n  font-size: 0.72rem;\n  border-radius: 0.3rem;\n  padding: 0.2rem 0.4rem;\n  background: #f7efd9;\n  color: #6d5318;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .texto-reconocimiento[_ngcontent-%COMP%] {\n  background: #f8fafc;\n  border-top: 3px solid #bd932d;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   .texto-reconocimiento[_ngcontent-%COMP%]   .mensaje[_ngcontent-%COMP%] {\n  overflow-wrap: anywhere;\n  margin: 0.8rem 0;\n}\n.reconocimiento-asistente[_ngcontent-%COMP%]   app-visor-pdf[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  min-width: 0;\n}\n@media (max-width: 800px) {\n  .reconocimiento-asistente[_ngcontent-%COMP%]   .informacion-reconocimiento[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .reconocimiento-asistente[_ngcontent-%COMP%]   .acciones-paso[_ngcontent-%COMP%] {\n    flex-wrap: wrap;\n  }\n}\n/*# sourceMappingURL=reconocimiento-asistente.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PreparacionOrigenComponent, { className: "PreparacionOrigenComponent", filePath: "src\\app\\pages\\emision-certificados\\generar-emitir\\preparacion-origen.component.ts", lineNumber: 25 });
})();

export {
  puedeVerDocumentoAdministrativo,
  puedeDescargarDocumentoAdministrativo,
  MunicipalContextoService,
  recuperarMunicipal,
  MunicipalesIndividualesComponent,
  PreparacionOrigenComponent
};
//# sourceMappingURL=chunk-ETEZBJ3L.js.map
