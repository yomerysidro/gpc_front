import './polyfills.server.mjs';
import {
  ActividadesService
} from "./chunk-ZYTODG6T.mjs";
import {
  HasPermissionDirective
} from "./chunk-JWEWPOXC.mjs";
import {
  DialogoComponent
} from "./chunk-Y2AZ2EMT.mjs";
import {
  PageTitleComponent
} from "./chunk-XGG6XIOR.mjs";
import {
  ActivatedRoute,
  RouterLink
} from "./chunk-OX7VSSQH.mjs";
import {
  AuthService
} from "./chunk-NP7M7R34.mjs";
import {
  EmisionCertificadosService
} from "./chunk-UOKIJFGD.mjs";
import {
  aErrorApi
} from "./chunk-JMI3IFFT.mjs";
import {
  AUTHENTICATED_REQUEST,
  environment
} from "./chunk-HFD7K63G.mjs";
import {
  takeUntilDestroyed,
  toSignal
} from "./chunk-TSKSZVR2.mjs";
import {
  HttpClient,
  HttpContext,
  HttpErrorResponse
} from "./chunk-TNXV45E5.mjs";
import {
  DefaultValueAccessor,
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
  DOCUMENT,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  catchError,
  computed,
  distinctUntilChanged,
  effect,
  inject,
  input,
  map,
  of,
  output,
  signal,
  startWith,
  switchMap,
  throwError,
  untracked,
  viewChild,
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
  ɵɵpureFunction1,
  ɵɵpureFunction2,
  ɵɵqueryAdvance,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
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

// src/app/core/services/participantes/participantes.service.ts
var ParticipantesService = class _ParticipantesService {
  actividadesApi = inject(ActividadesService);
  sesionesApi = inject(EmisionCertificadosService);
  actividad(id) {
    return this.actividadesApi.obtener(id);
  }
  sesion(id) {
    return this.sesionesApi.obtener("activity-session", id);
  }
  http = inject(HttpClient);
  api = environment.apiBaseUrl;
  listar() {
    return this.lista("/participation");
  }
  personas() {
    return this.lista("/persons/list");
  }
  documentos() {
    return this.lista("/person-documents/list");
  }
  actividades() {
    return this.lista("/activity");
  }
  tipos() {
    return this.lista("/participation-type");
  }
  obtener(id) {
    return this.http.get(`${this.api}/participation/${id}`, this.opciones()).pipe(map((respuesta) => {
      if (!respuesta.success || !respuesta.data || Array.isArray(respuesta.data))
        throw new Error("Respuesta de detalle no v\xE1lida.");
      return respuesta.data;
    }), catchError((error) => throwError(() => normalizar(error))));
  }
  crear(body) {
    return this.http.post(`${this.api}/participation`, body, this.opciones()).pipe(this.validarEscritura());
  }
  actualizar(id, body) {
    return this.http.put(`${this.api}/participation/${id}`, body, this.opciones()).pipe(this.validarEscritura());
  }
  cambiarEstado(id, estado) {
    return this.http.patch(`${this.api}/participation/${id}`, { estado }, this.opciones()).pipe(this.validarEscritura());
  }
  validarEscritura() {
    return (source) => source.pipe(map((respuesta) => {
      if (!respuesta.success || !respuesta.data)
        throw new Error(respuesta.message || "No se confirm\xF3 el guardado.");
      return respuesta;
    }), catchError((error) => throwError(() => normalizar(error))));
  }
  lista(ruta) {
    return this.http.get(`${this.api}${ruta}`, this.opciones()).pipe(map((respuesta) => {
      if (!respuesta.success || !Array.isArray(respuesta.data))
        throw new Error(respuesta.message || "Respuesta de listado no v\xE1lida.");
      return respuesta.data;
    }), catchError((error) => throwError(() => normalizar(error))));
  }
  opciones() {
    return { context: new HttpContext().set(AUTHENTICATED_REQUEST, true) };
  }
  static \u0275fac = function ParticipantesService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ParticipantesService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ParticipantesService, factory: _ParticipantesService.\u0275fac, providedIn: "root" });
};
function normalizar(error) {
  if (error instanceof HttpErrorResponse) {
    const normalizado = aErrorApi(error);
    const cuerpo = error.error;
    return error.status === 422 ? __spreadProps(__spreadValues({}, normalizado), { errores: cuerpo?.errors ?? cuerpo?.data ?? {} }) : normalizado;
  }
  return { status: 0, mensaje: error instanceof Error ? error.message : "Datos no disponibles.", errores: {} };
}

// src/app/models/participantes/inscripcion.model.ts
var ESTADOS_INSCRIPCION = [
  { valor: "Activo", etiqueta: "Activo" },
  { valor: "Cerrado", etiqueta: "Cerrado" }
];
function estadoInscripcion(valor) {
  const estado = valor.trim().toLocaleLowerCase("es");
  return ESTADOS_INSCRIPCION.find((opcion) => opcion.valor.toLocaleLowerCase("es") === estado)?.valor ?? valor;
}
function filtrarInscripciones(datos, filtros, textoPersona) {
  const normalizar2 = (valor) => valor.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es");
  const busqueda = normalizar2(filtros.busqueda.trim());
  return datos.filter((item) => (!busqueda || normalizar2(textoPersona(item.id_persona)).includes(busqueda)) && (!filtros.actividad || String(item.id_actividad) === filtros.actividad) && (!filtros.tipo || String(item.id_tipo_participacion) === filtros.tipo) && (!filtros.estado || estadoInscripcion(item.estado) === estadoInscripcion(filtros.estado)));
}
function hayDuplicado(datos, persona, actividad, excluir) {
  return datos.some((item) => item.id_persona === persona && item.id_actividad === actividad && item.id_participacion !== excluir);
}
function fechaHoyLima() {
  const partes = new Intl.DateTimeFormat("en", { timeZone: "America/Lima", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(/* @__PURE__ */ new Date());
  const valor = (tipo) => partes.find((parte) => parte.type === tipo).value;
  return `${valor("year")}-${valor("month")}-${valor("day")}`;
}

// src/app/pages/participantes/listar-participantes/listar-participantes.component.ts
var _c0 = ["dialogoFormulario"];
var _c1 = ["botonInscribir"];
var _c2 = ["dialogoDetalle"];
var _c3 = ["dialogoEstado"];
var _forTrack0 = ($index, $item) => $item.valor;
var _forTrack1 = ($index, $item) => $item.id_actividad;
var _forTrack2 = ($index, $item) => $item.id_tipo_participacion;
var _forTrack3 = ($index, $item) => $item.id_participacion;
var _forTrack4 = ($index, $item) => $item[0];
var _forTrack5 = ($index, $item) => $item.id_persona;
var _c4 = (a0) => ({ id_actividad: a0 });
var _c5 = (a0, a1) => ({ id_actividad: a0, id_sesion: a1, pestana: "asistencias" });
function ListarParticipantesComponent_Conditional_0_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 13);
    \u0275\u0275text(1, "Consultando actividad seleccionada...");
    \u0275\u0275elementEnd();
  }
}
function ListarParticipantesComponent_Conditional_0_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 14);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.errorContexto());
  }
}
function ListarParticipantesComponent_Conditional_0_Conditional_13_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 13);
    \u0275\u0275text(1, "Consultando sesi\xF3n\u2026");
    \u0275\u0275elementEnd();
  }
}
function ListarParticipantesComponent_Conditional_0_Conditional_13_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 62);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.sesionContexto().error);
  }
}
function ListarParticipantesComponent_Conditional_0_Conditional_13_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "Sesi\xF3n: ");
    \u0275\u0275elementStart(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, ". Se muestran las inscripciones de la actividad; estar inscrito no confirma asistencia.");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx.nombre);
  }
}
function ListarParticipantesComponent_Conditional_0_Conditional_13_Conditional_11_a_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 64)(1, "span", 30);
    \u0275\u0275text(2, "how_to_reg");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, "Controlar asistencia");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_14_0;
    const actividad_r4 = \u0275\u0275nextContext(2);
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("queryParams", \u0275\u0275pureFunction2(1, _c5, actividad_r4.id_actividad, (tmp_14_0 = ctx_r2.sesionContexto().sesion) == null ? null : tmp_14_0.id));
  }
}
function ListarParticipantesComponent_Conditional_0_Conditional_13_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, ListarParticipantesComponent_Conditional_0_Conditional_13_Conditional_11_a_0_Template, 4, 4, "a", 65);
  }
  if (rf & 2) {
    \u0275\u0275property("appHasPermission", "participantes.ver");
  }
}
function ListarParticipantesComponent_Conditional_0_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 61);
    \u0275\u0275text(1, "Actividad: ");
    \u0275\u0275elementStart(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(4, ListarParticipantesComponent_Conditional_0_Conditional_13_Conditional_4_Template, 2, 0, "p", 13)(5, ListarParticipantesComponent_Conditional_0_Conditional_13_Conditional_5_Template, 2, 1, "p", 62)(6, ListarParticipantesComponent_Conditional_0_Conditional_13_Conditional_6_Template, 5, 1, "p");
    \u0275\u0275elementStart(7, "a", 63)(8, "span", 30);
    \u0275\u0275text(9, "chevron_left");
    \u0275\u0275elementEnd();
    \u0275\u0275text(10, "Volver a actividad");
    \u0275\u0275elementEnd();
    \u0275\u0275template(11, ListarParticipantesComponent_Conditional_0_Conditional_13_Conditional_11_Template, 1, 1, "a", 64);
  }
  if (rf & 2) {
    let tmp_15_0;
    const actividad_r4 = ctx;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(actividad_r4.nombre);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.sesionContexto().cargando ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.sesionContexto().error ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_15_0 = ctx_r2.sesionContexto().sesion) ? 6 : -1, tmp_15_0);
    \u0275\u0275advance();
    \u0275\u0275property("queryParams", \u0275\u0275pureFunction1(6, _c4, actividad_r4.id_actividad));
    \u0275\u0275advance(4);
    \u0275\u0275conditional(!ctx_r2.sesionContexto().cargando && !ctx_r2.sesionContexto().error ? 11 : -1);
  }
}
function ListarParticipantesComponent_Conditional_0_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 66);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const mensaje_r5 = ctx;
    \u0275\u0275classProp("alert-exito", mensaje_r5.tipo === "exito")("alert-error", mensaje_r5.tipo === "error");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(mensaje_r5.texto);
  }
}
function ListarParticipantesComponent_Conditional_0_Conditional_16_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const aviso_r7 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", ctx_r2.etiquetas[aviso_r7[0]], " no disponibles. ", aviso_r7[1], "");
  }
}
function ListarParticipantesComponent_Conditional_0_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 32);
    \u0275\u0275repeaterCreate(1, ListarParticipantesComponent_Conditional_0_Conditional_16_For_2_Template, 2, 2, "p", null, _forTrack4);
    \u0275\u0275elementStart(3, "button", 25);
    \u0275\u0275listener("click", function ListarParticipantesComponent_Conditional_0_Conditional_16_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.cargarCatalogos());
    });
    \u0275\u0275text(4, "Reintentar cat\xE1logos");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.avisosCatalogos());
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r2.cargandoAlgunCatalogo());
  }
}
function ListarParticipantesComponent_Conditional_0_For_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 40);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const actividad_r10 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("value", actividad_r10.id_actividad)("selected", ctx_r2.filtros().actividad === actividad_r10.id_actividad.toString());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(actividad_r10.nombre);
  }
}
function ListarParticipantesComponent_Conditional_0_For_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 22);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tipo_r12 = ctx.$implicit;
    \u0275\u0275property("value", tipo_r12.id_tipo_participacion);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(tipo_r12.nombre);
  }
}
function ListarParticipantesComponent_Conditional_0_For_49_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 22);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const estado_r14 = ctx.$implicit;
    \u0275\u0275property("value", estado_r14.valor);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(estado_r14.etiqueta);
  }
}
function ListarParticipantesComponent_Conditional_0_Conditional_53_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 67);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 17);
    \u0275\u0275listener("click", function ListarParticipantesComponent_Conditional_0_Conditional_53_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r15);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.cargar());
    });
    \u0275\u0275text(3, "Reintentar listado");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("No se pudo cargar el listado de participantes. ", ctx, "");
  }
}
function ListarParticipantesComponent_Conditional_0_For_78_button_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 77);
    \u0275\u0275listener("click", function ListarParticipantesComponent_Conditional_0_For_78_button_18_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r16);
      const item_r17 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.verDetalle(item_r17));
    });
    \u0275\u0275elementStart(1, "span", 30);
    \u0275\u0275text(2, "visibility");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r17 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275attribute("aria-label", "Ver inscripci\xF3n de " + ctx_r2.nombrePersona(item_r17.id_persona));
  }
}
function ListarParticipantesComponent_Conditional_0_For_78_button_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 78);
    \u0275\u0275listener("click", function ListarParticipantesComponent_Conditional_0_For_78_button_19_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r18);
      const item_r17 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.abrirFormulario(item_r17));
    });
    \u0275\u0275elementStart(1, "span", 30);
    \u0275\u0275text(2, "edit");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r17 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r2.guardandoEstado());
    \u0275\u0275attribute("aria-label", "Editar inscripci\xF3n de " + ctx_r2.nombrePersona(item_r17.id_persona));
  }
}
function ListarParticipantesComponent_Conditional_0_For_78_button_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 79);
    \u0275\u0275listener("click", function ListarParticipantesComponent_Conditional_0_For_78_button_20_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r19);
      const item_r17 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.abrirEstado(item_r17));
    });
    \u0275\u0275elementStart(1, "span", 30);
    \u0275\u0275text(2, "toggle_on");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r17 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r2.guardandoEstado());
    \u0275\u0275attribute("aria-label", "Cambiar estado de " + ctx_r2.nombrePersona(item_r17.id_persona));
  }
}
function ListarParticipantesComponent_Conditional_0_For_78_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 68);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th", 69);
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
    \u0275\u0275elementStart(11, "td", 70);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td", 71)(14, "span", 72);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "td", 71)(17, "div", 73);
    \u0275\u0275template(18, ListarParticipantesComponent_Conditional_0_For_78_button_18_Template, 3, 1, "button", 74)(19, ListarParticipantesComponent_Conditional_0_For_78_button_19_Template, 3, 2, "button", 75)(20, ListarParticipantesComponent_Conditional_0_For_78_button_20_Template, 3, 2, "button", 76);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const item_r17 = ctx.$implicit;
    const \u0275$index_181_r20 = ctx.$index;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((ctx_r2.paginaActual() - 1) * ctx_r2.porPagina() + \u0275$index_181_r20 + 1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.nombrePersona(item_r17.id_persona));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.documentoPersona(item_r17.id_persona) || "No disponible");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.nombreActividad(item_r17.id_actividad));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.nombreTipo(item_r17.id_tipo_participacion));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.fecha(item_r17.fecha_inscripcion));
    \u0275\u0275advance(2);
    \u0275\u0275attribute("data-estado", ctx_r2.etiquetaEstado(item_r17.estado));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.etiquetaEstado(item_r17.estado));
    \u0275\u0275advance(3);
    \u0275\u0275property("appHasPermission", "participantes.ver");
    \u0275\u0275advance();
    \u0275\u0275property("appHasPermission", "participantes.editar");
    \u0275\u0275advance();
    \u0275\u0275property("appHasPermission", "participantes.editar");
  }
}
function ListarParticipantesComponent_Conditional_0_ForEmpty_79_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Cargando participantes\u2026 ");
  }
}
function ListarParticipantesComponent_Conditional_0_ForEmpty_79_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Datos del listado no disponibles. ");
  }
}
function ListarParticipantesComponent_Conditional_0_ForEmpty_79_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " A\xFAn no hay participantes inscritos. ");
  }
}
function ListarParticipantesComponent_Conditional_0_ForEmpty_79_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " No se encontraron participantes con esos filtros. ");
  }
}
function ListarParticipantesComponent_Conditional_0_ForEmpty_79_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 80);
    \u0275\u0275template(2, ListarParticipantesComponent_Conditional_0_ForEmpty_79_Conditional_2_Template, 1, 0)(3, ListarParticipantesComponent_Conditional_0_ForEmpty_79_Conditional_3_Template, 1, 0)(4, ListarParticipantesComponent_Conditional_0_ForEmpty_79_Conditional_4_Template, 1, 0)(5, ListarParticipantesComponent_Conditional_0_ForEmpty_79_Conditional_5_Template, 1, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.cargando() ? 2 : ctx_r2.errorCarga() ? 3 : !ctx_r2.inscripciones().length ? 4 : 5);
  }
}
function ListarParticipantesComponent_Conditional_0_Conditional_82_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Total no disponible ");
  }
}
function ListarParticipantesComponent_Conditional_0_Conditional_83_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Cargando total\u2026 ");
  }
}
function ListarParticipantesComponent_Conditional_0_Conditional_84_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275textInterpolate3(" ", ctx_r2.rango().desde, "\u2013", ctx_r2.rango().hasta, " de ", ctx_r2.rango().total, " ");
  }
}
function ListarParticipantesComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 9)(1, "div", 27)(2, "div");
    \u0275\u0275element(3, "app-page-title", 28);
    \u0275\u0275elementStart(4, "p", 29);
    \u0275\u0275text(5, "Administra las inscripciones de participantes a las actividades institucionales.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "button", 26, 3);
    \u0275\u0275listener("click", function ListarParticipantesComponent_Conditional_0_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.abrirFormulario(null));
    });
    \u0275\u0275elementStart(8, "span", 30);
    \u0275\u0275text(9, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275text(10, "Inscribir participante ");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(11, ListarParticipantesComponent_Conditional_0_Conditional_11_Template, 2, 0, "p", 13)(12, ListarParticipantesComponent_Conditional_0_Conditional_12_Template, 2, 1, "p", 14)(13, ListarParticipantesComponent_Conditional_0_Conditional_13_Template, 12, 8);
    \u0275\u0275elementStart(14, "div", 13);
    \u0275\u0275template(15, ListarParticipantesComponent_Conditional_0_Conditional_15_Template, 2, 5, "div", 31);
    \u0275\u0275elementEnd();
    \u0275\u0275template(16, ListarParticipantesComponent_Conditional_0_Conditional_16_Template, 5, 1, "div", 32);
    \u0275\u0275elementStart(17, "div", 33)(18, "div", 34)(19, "label", 35);
    \u0275\u0275text(20, "Buscar participante");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "input", 36, 4);
    \u0275\u0275listener("input", function ListarParticipantesComponent_Conditional_0_Template_input_input_21_listener() {
      \u0275\u0275restoreView(_r2);
      const busqueda_r8 = \u0275\u0275reference(22);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.filtrar("busqueda", busqueda_r8.value));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "div", 19)(24, "label", 37);
    \u0275\u0275text(25, "Actividad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "select", 38, 5);
    \u0275\u0275listener("change", function ListarParticipantesComponent_Conditional_0_Template_select_change_26_listener() {
      \u0275\u0275restoreView(_r2);
      const actividadFiltro_r9 = \u0275\u0275reference(27);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.filtrar("actividad", actividadFiltro_r9.value));
    });
    \u0275\u0275elementStart(28, "option", 39);
    \u0275\u0275text(29, "Todas las actividades");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(30, ListarParticipantesComponent_Conditional_0_For_31_Template, 2, 3, "option", 40, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(32, "div", 19)(33, "label", 41);
    \u0275\u0275text(34, "Tipo de participaci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "select", 42, 6);
    \u0275\u0275listener("change", function ListarParticipantesComponent_Conditional_0_Template_select_change_35_listener() {
      \u0275\u0275restoreView(_r2);
      const tipoFiltro_r11 = \u0275\u0275reference(36);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.filtrar("tipo", tipoFiltro_r11.value));
    });
    \u0275\u0275elementStart(37, "option", 39);
    \u0275\u0275text(38, "Todos los tipos");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(39, ListarParticipantesComponent_Conditional_0_For_40_Template, 2, 2, "option", 22, _forTrack2);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(41, "div", 19)(42, "label", 43);
    \u0275\u0275text(43, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(44, "select", 44, 7);
    \u0275\u0275listener("change", function ListarParticipantesComponent_Conditional_0_Template_select_change_44_listener() {
      \u0275\u0275restoreView(_r2);
      const estadoFiltro_r13 = \u0275\u0275reference(45);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.filtrar("estado", estadoFiltro_r13.value));
    });
    \u0275\u0275elementStart(46, "option", 39);
    \u0275\u0275text(47, "Todos los estados");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(48, ListarParticipantesComponent_Conditional_0_For_49_Template, 2, 2, "option", 22, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(50, "button", 45);
    \u0275\u0275listener("click", function ListarParticipantesComponent_Conditional_0_Template_button_click_50_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.limpiarFiltros());
    });
    \u0275\u0275text(51, "Limpiar filtros");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(52, "div");
    \u0275\u0275template(53, ListarParticipantesComponent_Conditional_0_Conditional_53_Template, 4, 1);
    \u0275\u0275elementStart(54, "div", 46)(55, "table", 47)(56, "caption", 48);
    \u0275\u0275text(57, "Inscripciones de participantes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(58, "thead")(59, "tr")(60, "th", 49);
    \u0275\u0275text(61, "N.\xBA");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(62, "th", 50);
    \u0275\u0275text(63, "Participante");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(64, "th", 50);
    \u0275\u0275text(65, "Documento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(66, "th", 50);
    \u0275\u0275text(67, "Actividad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(68, "th", 50);
    \u0275\u0275text(69, "Tipo de participaci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(70, "th", 51);
    \u0275\u0275text(71, "Fecha de inscripci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(72, "th", 51);
    \u0275\u0275text(73, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(74, "th", 51);
    \u0275\u0275text(75, "Acciones");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(76, "tbody");
    \u0275\u0275repeaterCreate(77, ListarParticipantesComponent_Conditional_0_For_78_Template, 21, 11, "tr", null, _forTrack3, false, ListarParticipantesComponent_Conditional_0_ForEmpty_79_Template, 6, 1, "tr");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(80, "nav", 52)(81, "p", 53);
    \u0275\u0275template(82, ListarParticipantesComponent_Conditional_0_Conditional_82_Template, 1, 0)(83, ListarParticipantesComponent_Conditional_0_Conditional_83_Template, 1, 0)(84, ListarParticipantesComponent_Conditional_0_Conditional_84_Template, 1, 3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(85, "div", 54)(86, "label", 55);
    \u0275\u0275text(87, "Registros por p\xE1gina");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(88, "select", 56, 8);
    \u0275\u0275listener("change", function ListarParticipantesComponent_Conditional_0_Template_select_change_88_listener() {
      \u0275\u0275restoreView(_r2);
      const tamano_r21 = \u0275\u0275reference(89);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.cambiarTamano(tamano_r21.value));
    });
    \u0275\u0275elementStart(90, "option", 57);
    \u0275\u0275text(91, "10");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(92, "option", 58);
    \u0275\u0275text(93, "20");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(94, "option", 59);
    \u0275\u0275text(95, "50");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(96, "div", 60)(97, "button", 25);
    \u0275\u0275listener("click", function ListarParticipantesComponent_Conditional_0_Template_button_click_97_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.pagina.set(ctx_r2.paginaActual() - 1));
    });
    \u0275\u0275elementStart(98, "span", 30);
    \u0275\u0275text(99, "chevron_left");
    \u0275\u0275elementEnd();
    \u0275\u0275text(100, "Anterior");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(101, "button", 25);
    \u0275\u0275listener("click", function ListarParticipantesComponent_Conditional_0_Template_button_click_101_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.pagina.set(ctx_r2.paginaActual() + 1));
    });
    \u0275\u0275text(102, "Siguiente");
    \u0275\u0275elementStart(103, "span", 30);
    \u0275\u0275text(104, "chevron_right");
    \u0275\u0275elementEnd()()()()()();
  }
  if (rf & 2) {
    let tmp_13_0;
    let tmp_14_0;
    let tmp_25_0;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275property("disabled", ctx_r2.guardandoEstado() || ctx_r2.formularioAbierto() || !ctx_r2.puedeInscribir());
    \u0275\u0275advance(5);
    \u0275\u0275conditional(ctx_r2.cargandoContexto() ? 11 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.errorContexto() ? 12 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_13_0 = ctx_r2.actividadContexto()) ? 13 : -1, tmp_13_0);
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_14_0 = ctx_r2.aviso()) ? 15 : -1, tmp_14_0);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.avisosCatalogos().length ? 16 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275property("value", ctx_r2.filtros().busqueda);
    \u0275\u0275advance(5);
    \u0275\u0275property("disabled", ctx_r2.parametroContexto() !== null)("value", ctx_r2.filtros().actividad);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r2.actividadesDisponibles());
    \u0275\u0275advance(5);
    \u0275\u0275property("value", ctx_r2.filtros().tipo);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r2.tipos());
    \u0275\u0275advance(5);
    \u0275\u0275property("value", ctx_r2.filtros().estado);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r2.estados);
    \u0275\u0275advance(4);
    \u0275\u0275attribute("aria-busy", ctx_r2.cargando());
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_25_0 = ctx_r2.errorCarga()) ? 53 : -1, tmp_25_0);
    \u0275\u0275advance(24);
    \u0275\u0275repeater(ctx_r2.visibles());
    \u0275\u0275advance(5);
    \u0275\u0275conditional(ctx_r2.errorCarga() ? 82 : ctx_r2.cargando() ? 83 : 84);
    \u0275\u0275advance(6);
    \u0275\u0275property("value", ctx_r2.porPagina());
    \u0275\u0275advance(9);
    \u0275\u0275property("disabled", ctx_r2.paginaActual() <= 1);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", ctx_r2.paginaActual() >= ctx_r2.totalPaginas());
  }
}
function ListarParticipantesComponent_Conditional_3_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "Desde la sesi\xF3n: ");
    \u0275\u0275elementStart(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, ". La inscripci\xF3n corresponde a la actividad y no confirma asistencia.");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx.sesion.nombre);
  }
}
function ListarParticipantesComponent_Conditional_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 61);
    \u0275\u0275text(1, "Inscribir participante en: ");
    \u0275\u0275elementStart(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx.nombre);
  }
}
function ListarParticipantesComponent_Conditional_3_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 14);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function ListarParticipantesComponent_Conditional_3_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r22 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 13);
    \u0275\u0275text(1, "Cargando inscripci\xF3n\u2026");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 17);
    \u0275\u0275listener("click", function ListarParticipantesComponent_Conditional_3_Conditional_4_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r22);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.cerrarFormulario());
    });
    \u0275\u0275text(3, "Cancelar");
    \u0275\u0275elementEnd();
  }
}
function ListarParticipantesComponent_Conditional_3_Conditional_5_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 67);
    \u0275\u0275text(1, "Cargando cat\xE1logos\u2026");
    \u0275\u0275elementEnd();
  }
}
function ListarParticipantesComponent_Conditional_3_Conditional_5_Conditional_3_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const aviso_r25 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("No se pudo consultar ", ctx_r2.etiquetas[aviso_r25[0]], ". ", aviso_r25[1], "");
  }
}
function ListarParticipantesComponent_Conditional_3_Conditional_5_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r24 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 14);
    \u0275\u0275repeaterCreate(1, ListarParticipantesComponent_Conditional_3_Conditional_5_Conditional_3_For_2_Template, 2, 2, "p", null, _forTrack4);
    \u0275\u0275elementStart(3, "button", 25);
    \u0275\u0275listener("click", function ListarParticipantesComponent_Conditional_3_Conditional_5_Conditional_3_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r24);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.cargarCatalogos());
    });
    \u0275\u0275text(4, "Reintentar cat\xE1logos");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.avisosFormulario());
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r2.cargandoAlgunCatalogo());
  }
}
function ListarParticipantesComponent_Conditional_3_Conditional_5_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 81);
    \u0275\u0275text(1, "El guardado requiere personas, actividades y tipos disponibles. Puedes completar los dem\xE1s campos.");
    \u0275\u0275elementEnd();
  }
}
function ListarParticipantesComponent_Conditional_3_Conditional_5_For_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 22);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const persona_r26 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275property("value", persona_r26.id_persona);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", ctx_r2.nombrePersona(persona_r26.id_persona), "", ctx_r2.documentoPersona(persona_r26.id_persona) ? " \xB7 " + ctx_r2.documentoPersona(persona_r26.id_persona) : "", "");
  }
}
function ListarParticipantesComponent_Conditional_3_Conditional_5_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 88);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function ListarParticipantesComponent_Conditional_3_Conditional_5_For_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 22);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const actividad_r27 = ctx.$implicit;
    \u0275\u0275property("value", actividad_r27.id_actividad);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(actividad_r27.nombre);
  }
}
function ListarParticipantesComponent_Conditional_3_Conditional_5_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 91);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function ListarParticipantesComponent_Conditional_3_Conditional_5_For_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 22);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tipo_r28 = ctx.$implicit;
    \u0275\u0275property("value", tipo_r28.id_tipo_participacion);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(tipo_r28.nombre);
  }
}
function ListarParticipantesComponent_Conditional_3_Conditional_5_Conditional_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 94);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function ListarParticipantesComponent_Conditional_3_Conditional_5_Conditional_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 97);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function ListarParticipantesComponent_Conditional_3_Conditional_5_For_44_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 22);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const estado_r29 = ctx.$implicit;
    \u0275\u0275property("value", estado_r29.valor);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(estado_r29.etiqueta);
  }
}
function ListarParticipantesComponent_Conditional_3_Conditional_5_Conditional_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 22);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275property("value", ctx_r2.form.controls.estado.value);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", ctx_r2.etiquetaEstado(ctx_r2.form.controls.estado.value), " (valor actual)");
  }
}
function ListarParticipantesComponent_Conditional_3_Conditional_5_Conditional_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " El valor actual no tiene un significado definido; se conserva hasta que selecciones otro estado. ");
  }
}
function ListarParticipantesComponent_Conditional_3_Conditional_5_Conditional_49_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 101);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function ListarParticipantesComponent_Conditional_3_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r23 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 81);
    \u0275\u0275text(1, "Los campos con * son obligatorios.");
    \u0275\u0275elementEnd();
    \u0275\u0275template(2, ListarParticipantesComponent_Conditional_3_Conditional_5_Conditional_2_Template, 2, 0, "p", 67)(3, ListarParticipantesComponent_Conditional_3_Conditional_5_Conditional_3_Template, 5, 1, "div", 14)(4, ListarParticipantesComponent_Conditional_3_Conditional_5_Conditional_4_Template, 2, 0, "p", 81);
    \u0275\u0275elementStart(5, "form", 82);
    \u0275\u0275listener("ngSubmit", function ListarParticipantesComponent_Conditional_3_Conditional_5_Template_form_ngSubmit_5_listener() {
      \u0275\u0275restoreView(_r23);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.guardar());
    });
    \u0275\u0275elementStart(6, "div", 83)(7, "div", 84)(8, "label", 85);
    \u0275\u0275text(9, "Participante *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "select", 86)(11, "option", 87);
    \u0275\u0275text(12, "Selecciona una persona");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(13, ListarParticipantesComponent_Conditional_3_Conditional_5_For_14_Template, 2, 3, "option", 22, _forTrack5);
    \u0275\u0275elementEnd();
    \u0275\u0275template(15, ListarParticipantesComponent_Conditional_3_Conditional_5_Conditional_15_Template, 2, 1, "p", 88);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "div", 19)(17, "label", 89);
    \u0275\u0275text(18, "Actividad *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "select", 90)(20, "option", 87);
    \u0275\u0275text(21, "Selecciona una actividad");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(22, ListarParticipantesComponent_Conditional_3_Conditional_5_For_23_Template, 2, 2, "option", 22, _forTrack1);
    \u0275\u0275elementEnd();
    \u0275\u0275template(24, ListarParticipantesComponent_Conditional_3_Conditional_5_Conditional_24_Template, 2, 1, "p", 91);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "div", 19)(26, "label", 92);
    \u0275\u0275text(27, "Tipo de participaci\xF3n *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "select", 93)(29, "option", 87);
    \u0275\u0275text(30, "Selecciona un tipo");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(31, ListarParticipantesComponent_Conditional_3_Conditional_5_For_32_Template, 2, 2, "option", 22, _forTrack2);
    \u0275\u0275elementEnd();
    \u0275\u0275template(33, ListarParticipantesComponent_Conditional_3_Conditional_5_Conditional_33_Template, 2, 1, "p", 94);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "div", 19)(35, "label", 95);
    \u0275\u0275text(36, "Fecha de inscripci\xF3n *");
    \u0275\u0275elementEnd();
    \u0275\u0275element(37, "input", 96);
    \u0275\u0275template(38, ListarParticipantesComponent_Conditional_3_Conditional_5_Conditional_38_Template, 2, 1, "p", 97);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "div", 19)(40, "label", 98);
    \u0275\u0275text(41, "Estado *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "select", 99);
    \u0275\u0275repeaterCreate(43, ListarParticipantesComponent_Conditional_3_Conditional_5_For_44_Template, 2, 2, "option", 22, _forTrack0);
    \u0275\u0275template(45, ListarParticipantesComponent_Conditional_3_Conditional_5_Conditional_45_Template, 2, 2, "option", 22);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(46, "p", 100);
    \u0275\u0275text(47, "Selecciona el estado de la inscripci\xF3n. ");
    \u0275\u0275template(48, ListarParticipantesComponent_Conditional_3_Conditional_5_Conditional_48_Template, 1, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275template(49, ListarParticipantesComponent_Conditional_3_Conditional_5_Conditional_49_Template, 2, 1, "p", 101);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(50, "div", 102)(51, "button", 25);
    \u0275\u0275listener("click", function ListarParticipantesComponent_Conditional_3_Conditional_5_Template_button_click_51_listener() {
      \u0275\u0275restoreView(_r23);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.cerrarFormulario());
    });
    \u0275\u0275text(52, "Cancelar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(53, "button", 103);
    \u0275\u0275text(54);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_10_0;
    let tmp_13_0;
    let tmp_16_0;
    let tmp_18_0;
    let tmp_23_0;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.cargandoAlgunCatalogo() ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.avisosFormulario().length ? 3 : !ctx_r2.catalogosDisponibles() ? 4 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("formGroup", ctx_r2.form);
    \u0275\u0275advance(5);
    \u0275\u0275attribute("aria-invalid", !!ctx_r2.errorCampo("id_persona"));
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r2.personas());
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_10_0 = ctx_r2.errorCampo("id_persona")) ? 15 : -1, tmp_10_0);
    \u0275\u0275advance(4);
    \u0275\u0275attribute("aria-invalid", !!ctx_r2.errorCampo("id_actividad"));
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r2.actividadesDisponibles());
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_13_0 = ctx_r2.errorCampo("id_actividad")) ? 24 : -1, tmp_13_0);
    \u0275\u0275advance(4);
    \u0275\u0275attribute("aria-invalid", !!ctx_r2.errorCampo("id_tipo_participacion"));
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r2.tipos());
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_16_0 = ctx_r2.errorCampo("id_tipo_participacion")) ? 33 : -1, tmp_16_0);
    \u0275\u0275advance(4);
    \u0275\u0275attribute("aria-invalid", !!ctx_r2.errorCampo("fecha_inscripcion"));
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_18_0 = ctx_r2.errorCampo("fecha_inscripcion")) ? 38 : -1, tmp_18_0);
    \u0275\u0275advance(4);
    \u0275\u0275attribute("aria-invalid", !!ctx_r2.errorCampo("estado"));
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.estados);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.form.controls.estado.value && !ctx_r2.esEstadoOfrecido(ctx_r2.form.controls.estado.value) ? 45 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r2.form.controls.estado.value === "sd" ? 48 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_23_0 = ctx_r2.errorCampo("estado")) ? 49 : -1, tmp_23_0);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r2.enviando());
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r2.enviando());
    \u0275\u0275attribute("aria-busy", ctx_r2.enviando());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.enviando() ? "Guardando\u2026" : ctx_r2.editando() === null ? "Inscribir participante" : "Guardar cambios");
  }
}
function ListarParticipantesComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, ListarParticipantesComponent_Conditional_3_Conditional_0_Template, 5, 1, "p")(1, ListarParticipantesComponent_Conditional_3_Conditional_1_Template, 4, 1, "p", 61);
    \u0275\u0275elementStart(2, "section", 11);
    \u0275\u0275template(3, ListarParticipantesComponent_Conditional_3_Conditional_3_Template, 2, 1, "p", 14)(4, ListarParticipantesComponent_Conditional_3_Conditional_4_Template, 4, 0)(5, ListarParticipantesComponent_Conditional_3_Conditional_5_Template, 55, 19);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_4_0;
    let tmp_5_0;
    let tmp_7_0;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275conditional((tmp_4_0 = ctx_r2.contextoIntegrado()) ? 0 : -1, tmp_4_0);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_5_0 = ctx_r2.actividadContexto()) ? 1 : -1, tmp_5_0);
    \u0275\u0275advance();
    \u0275\u0275attribute("aria-busy", ctx_r2.cargandoEdicion() || ctx_r2.enviando());
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_7_0 = ctx_r2.errorFormulario()) ? 3 : -1, tmp_7_0);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.cargandoEdicion() ? 4 : 5);
  }
}
function ListarParticipantesComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 13);
    \u0275\u0275text(1, "Cargando inscripci\xF3n\u2026");
    \u0275\u0275elementEnd();
  }
}
function ListarParticipantesComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 14);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function ListarParticipantesComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dl", 15)(1, "div")(2, "dt");
    \u0275\u0275text(3, "Participante");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "dd");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div")(7, "dt");
    \u0275\u0275text(8, "Documento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "dd");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div")(12, "dt");
    \u0275\u0275text(13, "Actividad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "dd");
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div")(17, "dt");
    \u0275\u0275text(18, "Tipo de participaci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "dd");
    \u0275\u0275text(20);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "div")(22, "dt");
    \u0275\u0275text(23, "Fecha de inscripci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "dd");
    \u0275\u0275text(25);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "div")(27, "dt");
    \u0275\u0275text(28, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "dd");
    \u0275\u0275text(30);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const item_r30 = ctx;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r2.nombrePersona(item_r30.id_persona));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r2.documentoPersona(item_r30.id_persona) || "No disponible");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r2.nombreActividad(item_r30.id_actividad));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r2.nombreTipo(item_r30.id_tipo_participacion));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r2.fecha(item_r30.fecha_inscripcion));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r2.etiquetaEstado(item_r30.estado));
  }
}
function ListarParticipantesComponent_For_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 22);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const estado_r32 = ctx.$implicit;
    \u0275\u0275property("value", estado_r32.valor);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(estado_r32.etiqueta);
  }
}
function ListarParticipantesComponent_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 22);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("value", ctx_r2.nuevoEstado.value);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", ctx_r2.etiquetaEstado(ctx_r2.nuevoEstado.value), " (valor actual)");
  }
}
function ListarParticipantesComponent_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Estado sin descripci\xF3n (sd): su significado no est\xE1 definido. ");
  }
}
function ListarParticipantesComponent_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 24);
    \u0275\u0275text(1, "Escribe un estado de hasta 30 caracteres.");
    \u0275\u0275elementEnd();
  }
}
function ListarParticipantesComponent_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 14);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
var ListarParticipantesComponent = class _ListarParticipantesComponent {
  contextoIntegrado = input(null);
  inscripcionGuardada = output();
  formularioCerrado = output();
  route = inject(ActivatedRoute, { optional: true });
  servicio = inject(ParticipantesService);
  sesionContexto = toSignal(this.route ? this.route.queryParamMap.pipe(map((params) => ({ actividad: params.get("id_actividad") ?? params.get("actividad"), sesion: params.get("id_sesion") })), distinctUntilChanged((a, b) => a.actividad === b.actividad && a.sesion === b.sesion), switchMap(({ actividad, sesion }) => {
    if (sesion === null)
      return of({ cargando: false, error: null, sesion: null });
    if (!actividad || !/^[1-9]\d*$/.test(sesion) || !Number.isSafeInteger(Number(sesion)) || !/^[1-9]\d*$/.test(actividad)) {
      return of({ cargando: false, error: "El contexto de sesi\xF3n no es v\xE1lido.", sesion: null });
    }
    return this.servicio.sesion(Number(sesion)).pipe(map((fila) => {
      if (Number(fila["id_actividad"]) !== Number(actividad) || Number(fila["id_actividad_sesion"]) !== Number(sesion)) {
        throw new Error("La sesi\xF3n no pertenece a la actividad seleccionada.");
      }
      return { cargando: false, error: null, sesion: { id: Number(sesion), nombre: String(fila["nombre"] || "Nombre no disponible") } };
    }), catchError(() => of({ cargando: false, error: "No se pudo verificar la sesi\xF3n de esta actividad.", sesion: null })), startWith({ cargando: true, error: null, sesion: null }));
  })) : of({ cargando: false, error: null, sesion: null }), { initialValue: { cargando: false, error: null, sesion: null } });
  auth = inject(AuthService);
  destroyRef = inject(DestroyRef);
  documento = inject(DOCUMENT);
  injector = inject(Injector);
  dialogoFormulario = viewChild.required("dialogoFormulario");
  elementoFormulario = viewChild.required("dialogoFormulario", { read: ElementRef });
  botonInscribir = viewChild("botonInscribir");
  overflowAnterior = null;
  dialogoDetalle = viewChild.required("dialogoDetalle");
  dialogoEstado = viewChild.required("dialogoEstado");
  solicitudDetalle;
  consultaContexto;
  consultaListado;
  guardado;
  cargasCatalogos = /* @__PURE__ */ new Map();
  inscripcionPendiente = false;
  listo = signal(false);
  parametroContexto = signal(null);
  actividadContexto = signal(null);
  cargandoContexto = signal(false);
  errorContexto = signal(null);
  actividadesDisponibles = computed(() => this.parametroContexto() !== null ? this.actividadContexto() ? [this.actividadContexto()] : [] : this.actividades());
  inscripciones = signal([]);
  personas = signal([]);
  actividades = signal([]);
  tipos = signal([]);
  documentos = signal([]);
  cargando = signal(true);
  errorCarga = signal(null);
  cargandoCatalogos = signal({ personas: true, actividades: true, tipos: true, documentos: true });
  erroresCatalogos = signal({});
  avisosCatalogos = computed(() => Object.entries(this.erroresCatalogos()).filter(([, mensaje]) => !!mensaje));
  avisosFormulario = computed(() => this.avisosCatalogos().filter(([clave]) => clave !== "documentos"));
  etiquetas = { personas: "Personas", actividades: "Actividades", tipos: "Tipos de participaci\xF3n", documentos: "Documentos" };
  cargandoAlgunCatalogo = computed(() => Object.values(this.cargandoCatalogos()).some(Boolean));
  catalogosDisponibles = computed(() => ["personas", "actividades", "tipos"].every((clave) => !this.cargandoCatalogos()[clave] && !this.erroresCatalogos()[clave]) && this.personas().length > 0 && this.actividadesDisponibles().length > 0 && this.tipos().length > 0);
  personasPorId = computed(() => new Map(this.personas().map((item) => [item.id_persona, item])));
  actividadesPorId = computed(() => new Map(this.actividadesDisponibles().map((item) => [item.id_actividad, item.nombre])));
  tiposPorId = computed(() => new Map(this.tipos().map((item) => [item.id_tipo_participacion, item.nombre])));
  documentosPorPersona = computed(() => {
    const mapa = /* @__PURE__ */ new Map();
    for (const documento of this.documentos())
      mapa.set(documento.id_persona, [...mapa.get(documento.id_persona) ?? [], documento.numero_documento]);
    return mapa;
  });
  estados = ESTADOS_INSCRIPCION;
  filtros = signal({ busqueda: "", actividad: "", tipo: "", estado: "" });
  filtradas = computed(() => this.parametroContexto() !== null && !this.actividadContexto() ? [] : filtrarInscripciones(this.inscripciones(), this.filtros(), (id) => `${this.nombrePersona(id)} ${this.documentoPersona(id)}`));
  pagina = signal(1);
  porPagina = signal(10);
  totalPaginas = computed(() => Math.max(1, Math.ceil(this.filtradas().length / this.porPagina())));
  paginaActual = computed(() => Math.min(this.pagina(), this.totalPaginas()));
  visibles = computed(() => this.filtradas().slice((this.paginaActual() - 1) * this.porPagina(), this.paginaActual() * this.porPagina()));
  rango = computed(() => ({
    desde: this.filtradas().length ? (this.paginaActual() - 1) * this.porPagina() + 1 : 0,
    hasta: Math.min(this.paginaActual() * this.porPagina(), this.filtradas().length),
    total: this.filtradas().length
  }));
  formularioAbierto = signal(false);
  editando = signal(null);
  cargandoEdicion = signal(false);
  enviando = signal(false);
  errorFormulario = signal(null);
  erroresServidor = signal({});
  aviso = signal(null);
  detalle = signal(null);
  cargandoDetalle = signal(false);
  errorDetalle = signal(null);
  porCambiarEstado = signal(null);
  guardandoEstado = signal(false);
  errorEstado = signal(null);
  nuevoEstado = new FormControl("", { nonNullable: true, validators: [Validators.required, Validators.pattern(/.*\S.*/), Validators.maxLength(30)] });
  form = inject(NonNullableFormBuilder).group({
    id_persona: ["", [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
    id_actividad: ["", [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
    id_tipo_participacion: ["", [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
    fecha_inscripcion: [fechaHoyLima(), Validators.required],
    estado: ["Activo", [Validators.required, Validators.pattern(/.*\S.*/), Validators.maxLength(30)]]
  });
  constructor() {
    effect(() => {
      const contexto = this.contextoIntegrado();
      if (this.listo() && contexto)
        untracked(() => this.establecerContexto(String(contexto.actividad.id_actividad), contexto.actividad));
    }, { allowSignalWrites: true });
    this.destroyRef.onDestroy(() => this.restaurarDesplazamiento());
    afterNextRender(() => {
      const dialogo = this.elementoFormulario().nativeElement.querySelector("dialog");
      const cancelar = (evento) => {
        evento.preventDefault();
        this.cerrarFormulario();
      };
      dialogo.addEventListener("cancel", cancelar);
      this.destroyRef.onDestroy(() => dialogo.removeEventListener("cancel", cancelar));
      this.listo.set(true);
      if (this.contextoIntegrado())
        return;
      if (this.route)
        this.route.queryParamMap.pipe(map((params) => params.get("id_actividad") ?? params.get("actividad")), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef)).subscribe((valor) => {
          if (!this.contextoIntegrado())
            this.establecerContexto(valor);
        });
      else
        this.establecerContexto(null);
    });
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.erroresServidor.set({}));
  }
  cargar() {
    this.consultaListado?.unsubscribe();
    this.cargando.set(true);
    this.errorCarga.set(null);
    this.consultaListado = this.servicio.listar().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (datos) => {
        this.inscripciones.set(datos);
        this.cargando.set(false);
      },
      error: (error) => {
        this.errorCarga.set(this.mensajeError(error));
        this.cargando.set(false);
      }
    });
  }
  cargarCatalogos() {
    this.cargandoCatalogos.set({ personas: true, actividades: true, tipos: true, documentos: false });
    this.cargarCatalogo("personas", this.servicio.personas(), this.personas);
    if (this.parametroContexto() === null)
      this.cargarCatalogo("actividades", this.servicio.actividades(), this.actividades);
    else
      this.cargandoCatalogos.update((estado) => __spreadProps(__spreadValues({}, estado), { actividades: false }));
    this.cargarCatalogo("tipos", this.servicio.tipos(), this.tipos);
    if (this.parametroContexto() === null && this.auth.tienePermiso("personas.ver")) {
      this.cargarCatalogo("documentos", this.servicio.documentos(), this.documentos);
    } else {
      this.documentos.set([]);
      this.erroresCatalogos.update((errores) => __spreadProps(__spreadValues({}, errores), { documentos: void 0 }));
    }
  }
  cargarCatalogo(clave, consulta, destino) {
    this.cargasCatalogos.get(clave)?.unsubscribe();
    destino.set([]);
    this.cargandoCatalogos.update((estado) => __spreadProps(__spreadValues({}, estado), { [clave]: true }));
    this.erroresCatalogos.update((errores) => __spreadProps(__spreadValues({}, errores), { [clave]: void 0 }));
    this.cargasCatalogos.set(clave, consulta.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (datos) => {
        destino.set(datos);
        this.cargandoCatalogos.update((estado) => __spreadProps(__spreadValues({}, estado), { [clave]: false }));
        this.intentarInscripcionContextual();
      },
      error: (error) => {
        this.erroresCatalogos.update((errores) => __spreadProps(__spreadValues({}, errores), { [clave]: this.mensajeError(error) }));
        this.cargandoCatalogos.update((estado) => __spreadProps(__spreadValues({}, estado), { [clave]: false }));
      }
    }));
  }
  establecerContexto(valor, validada) {
    this.guardado?.unsubscribe();
    this.enviando.set(false);
    for (const carga of this.cargasCatalogos.values())
      carga.unsubscribe();
    this.cargasCatalogos.clear();
    this.consultaContexto?.unsubscribe();
    this.solicitudDetalle?.unsubscribe();
    this.dialogoFormulario().cerrar();
    this.formularioAbierto.set(false);
    this.restaurarDesplazamiento();
    this.form.enable({ emitEvent: false });
    this.form.reset();
    this.editando.set(null);
    this.actividadContexto.set(null);
    this.parametroContexto.set(valor);
    this.errorContexto.set(null);
    this.inscripcionPendiente = valor !== null && this.route?.snapshot.queryParamMap.get("inscribir") !== "no";
    this.filtros.set({ busqueda: "", actividad: "", tipo: "", estado: "" });
    this.pagina.set(1);
    this.cargandoContexto.set(valor !== null);
    this.erroresCatalogos.set({});
    this.actividades.set([]);
    this.personas.set([]);
    this.tipos.set([]);
    this.documentos.set([]);
    this.cargandoCatalogos.set({ personas: false, actividades: false, tipos: false, documentos: false });
    this.cargar();
    if (validada && this.contextoIntegrado()) {
      this.actividadContexto.set(validada);
      this.cargandoContexto.set(false);
      this.filtros.update((f) => __spreadProps(__spreadValues({}, f), { actividad: String(validada.id_actividad) }));
      this.inscripcionPendiente = false;
      this.cargarCatalogos();
      this.abrirFormulario(null);
      return;
    }
    if (valor !== null) {
      if (!/^[1-9]\d*$/.test(valor) || !Number.isSafeInteger(Number(valor))) {
        this.errorContexto.set("El identificador de actividad no es v\xE1lido.");
        this.cargandoContexto.set(false);
        return;
      }
      if (!this.auth.tienePermiso("participantes.ver")) {
        this.errorContexto.set("Tu sesi\xF3n no tiene permiso para consultar participantes.");
        this.cargandoContexto.set(false);
        return;
      }
      this.consultaContexto = this.servicio.actividad(Number(valor)).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (actividad) => {
          if (actividad.id_actividad !== Number(valor) || !actividad.nombre?.trim()) {
            this.errorContexto.set("Laravel no confirm\xF3 la actividad solicitada.");
            this.cargandoContexto.set(false);
            return;
          }
          this.actividadContexto.set(actividad);
          this.filtros.update((f) => __spreadProps(__spreadValues({}, f), { actividad: String(actividad.id_actividad) }));
          this.cargandoContexto.set(false);
          this.cargarCatalogos();
        },
        error: (error) => {
          this.cargandoContexto.set(false);
          this.errorContexto.set(this.mensajeError(error));
        }
      });
      return;
    }
    this.cargarCatalogos();
  }
  intentarInscripcionContextual() {
    if (!this.inscripcionPendiente || !this.actividadContexto() || !this.catalogosDisponibles() || !this.auth.tienePermiso("participantes.crear"))
      return;
    this.inscripcionPendiente = false;
    this.abrirFormulario(null);
  }
  puedeInscribir() {
    return this.auth.tienePermiso("participantes.crear") && (this.parametroContexto() === null || !!this.actividadContexto() && !this.errorContexto());
  }
  filtrar(clave, valor) {
    if (clave === "actividad" && this.parametroContexto() !== null)
      return;
    this.filtros.update((filtros) => __spreadProps(__spreadValues({}, filtros), { [clave]: valor }));
    this.pagina.set(1);
  }
  limpiarFiltros() {
    this.filtros.set({ busqueda: "", actividad: this.actividadContexto() ? String(this.actividadContexto().id_actividad) : "", tipo: "", estado: "" });
    this.pagina.set(1);
  }
  cambiarTamano(valor) {
    if ([10, 20, 50].includes(Number(valor))) {
      this.porPagina.set(Number(valor));
      this.pagina.set(1);
    }
  }
  etiquetaEstado(valor) {
    return valor === "sd" ? "Estado sin descripci\xF3n (sd)" : estadoInscripcion(valor);
  }
  esEstadoOfrecido(valor) {
    return this.estados.some((estado) => estado.valor === valor);
  }
  nombrePersona(id) {
    const persona = this.personasPorId().get(id);
    return persona ? [persona.nombres, persona.apellido_paterno, persona.apellido_materno].filter(Boolean).join(" ") : "Nombre no disponible";
  }
  documentoPersona(id) {
    return this.documentosPorPersona().get(id)?.join(" / ") ?? "";
  }
  nombreActividad(id) {
    return this.actividadesPorId().get(id) ?? "Nombre no disponible";
  }
  nombreTipo(id) {
    return this.tiposPorId().get(id) ?? "Nombre no disponible";
  }
  fecha(valor) {
    const [anio, mes, dia] = valor.slice(0, 10).split("-");
    return `${dia}/${mes}/${anio}`;
  }
  abrirFormulario(item) {
    if (!item && !this.auth.tienePermiso("participantes.crear"))
      return;
    if (this.parametroContexto() !== null && (!this.actividadContexto() || this.cargandoContexto() || this.errorContexto()))
      return;
    if (this.formularioAbierto() || this.enviando() || this.guardandoEstado() || item && !this.auth.tienePermiso("participantes.editar"))
      return;
    if (!item)
      this.inscripcionPendiente = false;
    this.solicitudDetalle?.unsubscribe();
    this.editando.set(item?.id_participacion ?? null);
    this.overflowAnterior = this.documento.body.style.overflow;
    this.documento.body.style.overflow = "hidden";
    this.dialogoFormulario().abrir();
    this.formularioAbierto.set(true);
    this.errorFormulario.set(null);
    this.erroresServidor.set({});
    this.form.enable({ emitEvent: false });
    this.form.reset({ fecha_inscripcion: fechaHoyLima() });
    this.cargandoEdicion.set(!!item);
    if (!item) {
      const id = Number(this.filtros().actividad);
      if (this.actividadesPorId().has(id))
        this.form.controls.id_actividad.setValue(String(id));
      this.protegerActividad();
      return;
    }
    this.solicitudDetalle = this.servicio.obtener(item.id_participacion).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (actual) => {
        this.form.reset({
          id_persona: String(actual.id_persona),
          id_actividad: String(actual.id_actividad),
          id_tipo_participacion: String(actual.id_tipo_participacion),
          fecha_inscripcion: actual.fecha_inscripcion.slice(0, 10),
          estado: actual.estado
        });
        if (this.actividadContexto() && actual.id_actividad !== this.actividadContexto().id_actividad) {
          this.errorFormulario.set("La inscripci\xF3n no pertenece a esta actividad.");
          return;
        }
        this.protegerActividad();
        this.cargandoEdicion.set(false);
      },
      error: (error) => {
        this.cargandoEdicion.set(false);
        this.errorFormulario.set(this.mensajeError(error));
      }
    });
  }
  cerrarFormulario() {
    if (this.enviando())
      return;
    this.dialogoFormulario().cerrar();
    this.alCerrarFormulario();
    afterNextRender(() => {
      if (!this.formularioAbierto())
        this.dialogoFormulario().cerrar();
    }, { injector: this.injector });
  }
  alCerrarFormulario() {
    if (!this.formularioAbierto() || this.elementoFormulario().nativeElement.querySelector("dialog")?.open)
      return;
    this.solicitudDetalle?.unsubscribe();
    this.formularioAbierto.set(false);
    this.form.reset();
    this.editando.set(null);
    this.cargandoEdicion.set(false);
    this.errorFormulario.set(null);
    this.erroresServidor.set({});
    this.restaurarDesplazamiento();
    afterNextRender(() => this.botonInscribir()?.nativeElement.focus(), { injector: this.injector });
    if (this.contextoIntegrado())
      this.formularioCerrado.emit();
  }
  restaurarDesplazamiento() {
    if (this.overflowAnterior === null)
      return;
    this.documento.body.style.overflow = this.overflowAnterior;
    this.overflowAnterior = null;
  }
  errorCampo(clave) {
    if (this.erroresServidor()[clave]?.[0])
      return this.erroresServidor()[clave][0];
    const control = this.form.controls[clave];
    if (!control.touched || control.valid)
      return null;
    return control.hasError("maxlength") ? "M\xE1ximo 30 caracteres." : "Completa este campo con un valor v\xE1lido.";
  }
  guardar() {
    if (!this.formularioAbierto() || this.enviando() || this.cargandoEdicion())
      return;
    this.errorFormulario.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const id = this.editando();
    if (!this.auth.tienePermiso(id === null ? "participantes.crear" : "participantes.editar")) {
      this.errorFormulario.set("Tu sesi\xF3n no tiene permiso para guardar esta inscripci\xF3n.");
      return;
    }
    const valores = this.form.getRawValue();
    const payload = {
      id_persona: Number(valores.id_persona),
      id_actividad: Number(valores.id_actividad),
      id_tipo_participacion: Number(valores.id_tipo_participacion),
      fecha_inscripcion: valores.fecha_inscripcion,
      estado: valores.estado.trim()
    };
    if (this.parametroContexto() !== null && payload.id_actividad !== this.actividadContexto()?.id_actividad) {
      this.errorFormulario.set("La actividad debe coincidir con el contexto validado.");
      return;
    }
    if (!this.catalogosDisponibles() || !this.personasPorId().has(payload.id_persona) || !this.actividadesPorId().has(payload.id_actividad) || !this.tiposPorId().has(payload.id_tipo_participacion)) {
      this.errorFormulario.set("Selecciona personas, actividades y tipos de los cat\xE1logos disponibles. Puedes reintentar su carga.");
      return;
    }
    if (hayDuplicado(this.inscripciones(), payload.id_persona, payload.id_actividad, id)) {
      this.errorFormulario.set("La persona ya est\xE1 inscrita en esta actividad.");
      return;
    }
    this.enviando.set(true);
    this.form.disable({ emitEvent: false });
    const consulta = id === null ? this.servicio.crear(payload) : this.servicio.actualizar(id, payload);
    this.guardado = consulta.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (respuesta) => {
        this.form.enable({ emitEvent: false });
        this.enviando.set(false);
        this.cerrarFormulario();
        if (this.contextoIntegrado()) {
          this.inscripcionGuardada.emit(respuesta.data);
          return;
        }
        this.aviso.set({ tipo: "exito", texto: respuesta.message });
        this.limpiarFiltros();
        this.cargar();
      },
      error: (error) => {
        this.form.enable({ emitEvent: false });
        this.protegerActividad();
        this.enviando.set(false);
        this.errorFormulario.set(this.mensajeError(error));
        this.erroresServidor.set(error.errores);
        this.form.markAllAsTouched();
      }
    });
  }
  protegerActividad() {
    const actividad = this.actividadContexto();
    if (actividad) {
      this.form.controls.id_actividad.setValue(String(actividad.id_actividad), { emitEvent: false });
      this.form.controls.id_actividad.disable({ emitEvent: false });
    }
  }
  verDetalle(item) {
    if (!this.auth.tienePermiso("participantes.ver"))
      return;
    this.solicitudDetalle?.unsubscribe();
    this.detalle.set(null);
    this.errorDetalle.set(null);
    this.cargandoDetalle.set(true);
    this.dialogoDetalle().abrir();
    this.solicitudDetalle = this.servicio.obtener(item.id_participacion).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (detalle) => {
        this.detalle.set(detalle);
        this.cargandoDetalle.set(false);
      },
      error: (error) => {
        this.errorDetalle.set(this.mensajeError(error));
        this.cargandoDetalle.set(false);
      }
    });
  }
  cerrarDetalle() {
    this.solicitudDetalle?.unsubscribe();
  }
  abrirEstado(item) {
    if (!this.auth.tienePermiso("participantes.editar") || this.guardandoEstado())
      return;
    this.porCambiarEstado.set(item);
    this.nuevoEstado.reset(item.estado);
    this.errorEstado.set(null);
    this.dialogoEstado().abrir();
  }
  confirmarEstado() {
    if (this.guardandoEstado())
      return;
    this.nuevoEstado.markAsTouched();
    const item = this.porCambiarEstado();
    if (!item || this.nuevoEstado.invalid)
      return;
    if (!this.auth.tienePermiso("participantes.editar")) {
      this.errorEstado.set("Tu sesi\xF3n no tiene permiso para actualizar.");
      return;
    }
    this.guardandoEstado.set(true);
    this.errorEstado.set(null);
    this.servicio.cambiarEstado(item.id_participacion, this.nuevoEstado.value.trim()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (respuesta) => {
        this.inscripciones.update((lista) => lista.map((fila) => fila.id_participacion === item.id_participacion ? respuesta.data : fila));
        this.guardandoEstado.set(false);
        this.dialogoEstado().cerrar();
        this.aviso.set({ tipo: "exito", texto: respuesta.message });
      },
      error: (error) => {
        this.guardandoEstado.set(false);
        this.errorEstado.set(this.mensajeError(error));
      }
    });
  }
  mensajeError(error) {
    return error.status === 403 ? `${error.mensaje || "Lectura u operaci\xF3n no autorizada"} (HTTP 403).` : error.status === 401 ? `${error.mensaje || "La sesi\xF3n no est\xE1 autenticada"} (HTTP 401).` : error.status === 0 ? error.mensaje || "No se pudo conectar con el servidor." : `${error.mensaje} (HTTP ${error.status})`;
  }
  static \u0275fac = function ListarParticipantesComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ListarParticipantesComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ListarParticipantesComponent, selectors: [["app-listar-participantes"]], viewQuery: function ListarParticipantesComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuerySignal(ctx.dialogoFormulario, _c0, 5);
      \u0275\u0275viewQuerySignal(ctx.elementoFormulario, _c0, 5, ElementRef);
      \u0275\u0275viewQuerySignal(ctx.botonInscribir, _c1, 5);
      \u0275\u0275viewQuerySignal(ctx.dialogoDetalle, _c2, 5);
      \u0275\u0275viewQuerySignal(ctx.dialogoEstado, _c3, 5);
    }
    if (rf & 2) {
      \u0275\u0275queryAdvance(5);
    }
  }, inputs: { contextoIntegrado: [1, "contextoIntegrado"] }, outputs: { inscripcionGuardada: "inscripcionGuardada", formularioCerrado: "formularioCerrado" }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 33, vars: 19, consts: [["dialogoFormulario", ""], ["dialogoDetalle", ""], ["dialogoEstado", ""], ["botonInscribir", ""], ["busqueda", ""], ["actividadFiltro", ""], ["tipoFiltro", ""], ["estadoFiltro", ""], ["tamano", ""], ["aria-label", "Gesti\xF3n de participantes"], [1, "modal-participante", 3, "cierreSolicitado", "cerrado", "titulo", "mostrarCerrar", "cierreControlado"], [1, "formulario"], ["titulo", "Detalle de inscripci\xF3n", 3, "cerrado"], ["role", "status"], ["role", "alert", 1, "alert", "alert-error"], [1, "detalle"], [1, "dialogo-acciones"], ["type", "button", 1, "btn", 3, "click"], ["titulo", "Cambiar estado de inscripci\xF3n"], [1, "form-field"], ["for", "nuevo-estado"], ["id", "nuevo-estado", "aria-describedby", "nuevo-estado-ayuda nuevo-estado-error", 1, "input", 3, "formControl"], [3, "value"], ["id", "nuevo-estado-ayuda", 1, "form-ayuda"], ["id", "nuevo-estado-error", 1, "error-text"], ["type", "button", 1, "btn", 3, "click", "disabled"], ["type", "button", 1, "btn", "btn-primary", 3, "click", "disabled"], [1, "encabezado"], ["title", "Participantes"], [1, "descripcion"], ["aria-hidden", "true", 1, "material-symbols-outlined"], [1, "alert", 3, "alert-exito", "alert-error"], ["role", "status", 1, "form-ayuda", "aviso-catalogos"], ["role", "search", "aria-label", "Filtrar participantes", 1, "filtros"], [1, "form-field", "buscador"], ["for", "buscar-participante"], ["id", "buscar-participante", "type", "search", "placeholder", "Nombre o documento disponible", 1, "input", 3, "input", "value"], ["for", "filtro-actividad"], ["id", "filtro-actividad", 1, "input", 3, "change", "disabled", "value"], ["value", ""], [3, "value", "selected"], ["for", "filtro-tipo"], ["id", "filtro-tipo", 1, "input", 3, "change", "value"], ["for", "filtro-estado"], ["id", "filtro-estado", 1, "input", 3, "change", "value"], ["type", "button", 1, "btn", "limpiar", 3, "click"], ["tabindex", "0", "role", "region", "aria-label", "Listado de participantes con desplazamiento horizontal", 1, "tabla-caja"], [1, "table"], [1, "sr-only"], ["scope", "col", 1, "col-centro", "col-numero"], ["scope", "col"], ["scope", "col", 1, "col-centro"], ["aria-label", "Paginaci\xF3n de participantes", 1, "paginacion"], ["role", "status", 1, "dato"], [1, "tamano-pagina"], ["for", "tamano-participantes"], ["id", "tamano-participantes", 1, "input", 3, "change", "value"], ["value", "10"], ["value", "20"], ["value", "50"], [1, "paginacion-botones"], [1, "contexto-actividad"], ["role", "alert"], ["routerLink", "/certificaciones/actividades", 1, "btn", 3, "queryParams"], ["routerLink", "/certificaciones/sesiones-asistencia", 1, "btn", "btn-primary", 3, "queryParams"], ["class", "btn btn-primary", "routerLink", "/certificaciones/sesiones-asistencia", 3, "queryParams", 4, "appHasPermission"], [1, "alert"], ["role", "status", 1, "form-ayuda"], ["data-label", "N.\xBA", 1, "col-centro", "col-numero"], ["scope", "row", 1, "nombre"], [1, "col-centro", "dato"], [1, "col-centro"], [1, "badge"], [1, "acciones-fila"], ["type", "button", "class", "btn btn-icono btn-sin-borde", "title", "Ver detalle", 3, "click", 4, "appHasPermission"], ["type", "button", "class", "btn btn-icono btn-sin-borde", "title", "Editar inscripci\xF3n", 3, "disabled", "click", 4, "appHasPermission"], ["type", "button", "class", "btn btn-icono btn-sin-borde", "title", "Cambiar estado", 3, "disabled", "click", 4, "appHasPermission"], ["type", "button", "title", "Ver detalle", 1, "btn", "btn-icono", "btn-sin-borde", 3, "click"], ["type", "button", "title", "Editar inscripci\xF3n", 1, "btn", "btn-icono", "btn-sin-borde", 3, "click", "disabled"], ["type", "button", "title", "Cambiar estado", 1, "btn", "btn-icono", "btn-sin-borde", 3, "click", "disabled"], ["colspan", "8", 1, "estado-vacio"], [1, "form-ayuda"], ["novalidate", "", 3, "ngSubmit", "formGroup"], [1, "rejilla-formulario"], [1, "form-field", "ancho-completo"], ["for", "inscripcion-persona"], ["id", "inscripcion-persona", "autofocus", "", "formControlName", "id_persona", "aria-required", "true", "aria-describedby", "inscripcion-persona-error", 1, "input"], ["value", "", "disabled", ""], ["id", "inscripcion-persona-error", 1, "error-text"], ["for", "inscripcion-actividad"], ["id", "inscripcion-actividad", "formControlName", "id_actividad", "aria-required", "true", "aria-describedby", "inscripcion-actividad-error", 1, "input"], ["id", "inscripcion-actividad-error", 1, "error-text"], ["for", "inscripcion-tipo"], ["id", "inscripcion-tipo", "formControlName", "id_tipo_participacion", "aria-required", "true", "aria-describedby", "inscripcion-tipo-error", 1, "input"], ["id", "inscripcion-tipo-error", 1, "error-text"], ["for", "inscripcion-fecha"], ["id", "inscripcion-fecha", "type", "date", "formControlName", "fecha_inscripcion", "aria-required", "true", "aria-describedby", "inscripcion-fecha-error", 1, "input"], ["id", "inscripcion-fecha-error", 1, "error-text"], ["for", "inscripcion-estado"], ["id", "inscripcion-estado", "formControlName", "estado", "aria-required", "true", "aria-describedby", "estado-ayuda inscripcion-estado-error", 1, "input"], ["id", "estado-ayuda", 1, "form-ayuda"], ["id", "inscripcion-estado-error", 1, "error-text"], [1, "acciones-formulario"], ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"]], template: function ListarParticipantesComponent_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275template(0, ListarParticipantesComponent_Conditional_0_Template, 105, 18, "section", 9);
      \u0275\u0275elementStart(1, "app-dialogo", 10, 0);
      \u0275\u0275listener("cierreSolicitado", function ListarParticipantesComponent_Template_app_dialogo_cierreSolicitado_1_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.cerrarFormulario());
      })("cerrado", function ListarParticipantesComponent_Template_app_dialogo_cerrado_1_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.alCerrarFormulario());
      });
      \u0275\u0275template(3, ListarParticipantesComponent_Conditional_3_Template, 6, 5, "section", 11);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "app-dialogo", 12, 1);
      \u0275\u0275listener("cerrado", function ListarParticipantesComponent_Template_app_dialogo_cerrado_4_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.cerrarDetalle());
      });
      \u0275\u0275template(6, ListarParticipantesComponent_Conditional_6_Template, 2, 0, "p", 13)(7, ListarParticipantesComponent_Conditional_7_Template, 2, 1, "p", 14)(8, ListarParticipantesComponent_Conditional_8_Template, 31, 6, "dl", 15);
      \u0275\u0275elementStart(9, "div", 16)(10, "button", 17);
      \u0275\u0275listener("click", function ListarParticipantesComponent_Template_button_click_10_listener() {
        \u0275\u0275restoreView(_r1);
        const dialogoDetalle_r31 = \u0275\u0275reference(5);
        return \u0275\u0275resetView(dialogoDetalle_r31.cerrar());
      });
      \u0275\u0275text(11, "Cerrar");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(12, "app-dialogo", 18, 2)(14, "p");
      \u0275\u0275text(15);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "div", 19)(17, "label", 20);
      \u0275\u0275text(18, "Estado *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "select", 21);
      \u0275\u0275repeaterCreate(20, ListarParticipantesComponent_For_21_Template, 2, 2, "option", 22, _forTrack0);
      \u0275\u0275template(22, ListarParticipantesComponent_Conditional_22_Template, 2, 2, "option", 22);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "p", 23);
      \u0275\u0275text(24, "Selecciona el nuevo estado. ");
      \u0275\u0275template(25, ListarParticipantesComponent_Conditional_25_Template, 1, 0);
      \u0275\u0275elementEnd();
      \u0275\u0275template(26, ListarParticipantesComponent_Conditional_26_Template, 2, 0, "p", 24);
      \u0275\u0275elementEnd();
      \u0275\u0275template(27, ListarParticipantesComponent_Conditional_27_Template, 2, 1, "p", 14);
      \u0275\u0275elementStart(28, "div", 16)(29, "button", 25);
      \u0275\u0275listener("click", function ListarParticipantesComponent_Template_button_click_29_listener() {
        \u0275\u0275restoreView(_r1);
        const dialogoEstado_r33 = \u0275\u0275reference(13);
        return \u0275\u0275resetView(dialogoEstado_r33.cerrar());
      });
      \u0275\u0275text(30, "Cancelar");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(31, "button", 26);
      \u0275\u0275listener("click", function ListarParticipantesComponent_Template_button_click_31_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.confirmarEstado());
      });
      \u0275\u0275text(32);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      let tmp_9_0;
      let tmp_10_0;
      let tmp_19_0;
      \u0275\u0275conditional(!ctx.contextoIntegrado() ? 0 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("titulo", ctx.editando() === null ? "Inscribir participante" : "Editar inscripci\xF3n")("mostrarCerrar", !!ctx.contextoIntegrado())("cierreControlado", !!ctx.contextoIntegrado());
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.formularioAbierto() ? 3 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.cargandoDetalle() ? 6 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_9_0 = ctx.errorDetalle()) ? 7 : -1, tmp_9_0);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_10_0 = ctx.detalle()) ? 8 : -1, tmp_10_0);
      \u0275\u0275advance(7);
      \u0275\u0275textInterpolate1("Confirma el nuevo estado de la inscripci\xF3n de ", ctx.porCambiarEstado() ? ctx.nombrePersona(ctx.porCambiarEstado().id_persona) : "", ".");
      \u0275\u0275advance(4);
      \u0275\u0275property("formControl", ctx.nuevoEstado);
      \u0275\u0275attribute("disabled", ctx.guardandoEstado() ? true : null)("aria-invalid", ctx.nuevoEstado.touched && ctx.nuevoEstado.invalid);
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.estados);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.nuevoEstado.value && !ctx.esEstadoOfrecido(ctx.nuevoEstado.value) ? 22 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.nuevoEstado.value === "sd" ? 25 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.nuevoEstado.touched && ctx.nuevoEstado.invalid ? 26 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_19_0 = ctx.errorEstado()) ? 27 : -1, tmp_19_0);
      \u0275\u0275advance(2);
      \u0275\u0275property("disabled", ctx.guardandoEstado());
      \u0275\u0275advance(2);
      \u0275\u0275property("disabled", ctx.guardandoEstado());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.guardandoEstado() ? "Guardando\u2026" : "Confirmar cambio");
    }
  }, dependencies: [RouterLink, ReactiveFormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, FormControlDirective, FormGroupDirective, FormControlName, PageTitleComponent, DialogoComponent, HasPermissionDirective], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n  background: var(--neutro-0);\n}\n.encabezado[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: baseline;\n  justify-content: space-between;\n  gap: var(--espacio-3);\n  margin-bottom: var(--espacio-5);\n}\n.descripcion[_ngcontent-%COMP%] {\n  margin: 0;\n  color: var(--neutro-500);\n}\n.filtros[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: end;\n  gap: var(--espacio-3);\n  margin-bottom: var(--espacio-5);\n}\n.filtros[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%] {\n  flex: 1 1 10rem;\n  min-width: 0;\n  margin-bottom: 0;\n}\n.filtros[_ngcontent-%COMP%]   .buscador[_ngcontent-%COMP%] {\n  flex-grow: 2;\n}\n.tabla-caja[_ngcontent-%COMP%] {\n  overflow-x: auto;\n  border: 1px solid var(--neutro-200);\n  border-radius: var(--radio-lg);\n}\n.tabla-caja[_ngcontent-%COMP%]   .table[_ngcontent-%COMP%] {\n  min-width: 58rem;\n}\n.tabla-caja[_ngcontent-%COMP%]   td[_ngcontent-%COMP%], \n.tabla-caja[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  padding-block: var(--espacio-3);\n}\n.tabla-caja[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]:first-child, \n.tabla-caja[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:first-child {\n  padding-left: var(--espacio-4);\n}\n.tabla-caja[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:last-child {\n  padding-right: var(--espacio-2);\n}\n.nombre[_ngcontent-%COMP%] {\n  min-width: 13rem;\n  overflow-wrap: anywhere;\n}\n.acciones-fila[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  gap: 2px;\n}\n.tamano-pagina[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: var(--espacio-2);\n}\n.tamano-pagina[_ngcontent-%COMP%]   .input[_ngcontent-%COMP%] {\n  width: auto;\n}\n.formulario[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n[_nghost-%COMP%]     app-dialogo.modal-participante > dialog.dialogo {\n  width: min(48rem, 100vw - 2 * var(--espacio-4));\n  max-height: calc(100dvh - 2 * var(--espacio-4));\n  overflow-y: auto;\n  overscroll-behavior: contain;\n}\n.rejilla-formulario[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  column-gap: var(--espacio-5);\n}\n.ancho-completo[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\n.acciones-formulario[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: flex-end;\n  gap: var(--espacio-3);\n}\n.detalle[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  padding-block: var(--espacio-2);\n  border-bottom: 1px solid var(--neutro-200);\n}\n.detalle[_ngcontent-%COMP%]   dt[_ngcontent-%COMP%] {\n  color: var(--neutro-500);\n}\n.detalle[_ngcontent-%COMP%]   dd[_ngcontent-%COMP%] {\n  margin: 0;\n  overflow-wrap: anywhere;\n}\n@media (max-width: 600px) {\n  .rejilla-formulario[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .filtros[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%] {\n    flex-basis: 100%;\n  }\n  .limpiar[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n  .formulario[_ngcontent-%COMP%] {\n    padding: var(--espacio-4);\n  }\n}\n/*# sourceMappingURL=listar-participantes.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ListarParticipantesComponent, { className: "ListarParticipantesComponent", filePath: "src\\app\\pages\\participantes\\listar-participantes\\listar-participantes.component.ts", lineNumber: 23 });
})();

export {
  ParticipantesService,
  ListarParticipantesComponent
};
//# sourceMappingURL=chunk-H53FL7LB.mjs.map
