import {
  CONFIGURACION_EMISION,
  ClasificacionesListado,
  ESTADOS_ASISTENCIAS,
  ESTADOS_CLASIFICACIONES,
  ESTADOS_SESIONES,
  FormularioEmisionComponent,
  esEditable,
  esEliminable,
  estadoClasificacion,
  estadoListado,
  etiquetaEstado,
  resultadoPresencia,
  resumenPresencia
} from "./chunk-QBYYVWAN.js";
import {
  DialogoConfirmacionComponent
} from "./chunk-BKELQIVX.js";
import {
  EmisionCertificadosService,
  PERMISOS_EMISION
} from "./chunk-4FUGVTHD.js";
import {
  DialogoComponent
} from "./chunk-Y2YHKMWP.js";
import {
  ActivatedRoute,
  Router,
  RouterLink
} from "./chunk-A36LAIDM.js";
import {
  AuthService
} from "./chunk-W2463ZNS.js";
import {
  PersonService
} from "./chunk-C4J44J4Z.js";
import {
  aErrorApi
} from "./chunk-LSGUT5KG.js";
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
  SelectControlValueAccessor,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-YLHEVWGL.js";
import {
  DOCUMENT,
  DestroyRef,
  ElementRef,
  Injector,
  PLATFORM_ID,
  Subscription,
  afterNextRender,
  catchError,
  computed,
  concatMap,
  defer,
  forkJoin,
  from,
  inject,
  input,
  isPlatformBrowser,
  map,
  of,
  output,
  signal,
  switchMap,
  tap,
  viewChild,
  ɵsetClassDebugInfo,
  ɵɵNgOnChangesFeature,
  ɵɵProvidersFeature,
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
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction2,
  ɵɵqueryAdvance,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate3,
  ɵɵtextInterpolate5,
  ɵɵviewQuerySignal
} from "./chunk-3ZDGBTDF.js";
import {
  __async,
  __spreadProps,
  __spreadValues
} from "./chunk-ZX6IUAQ5.js";

// src/app/pages/emision-certificados/actividades/sesiones-asistencia-listado.ts
var FILTROS_SESIONES_VACIOS = { nombre: "", actividad: "", fecha: "", sesion: "", estado: "" };
var normalizarBusqueda = (valor) => valor.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().trim();
var SesionesAsistenciaListado = class _SesionesAsistenciaListado {
  api = inject(EmisionCertificadosService);
  personas = inject(PersonService);
  cargado = false;
  filas = [];
  actividades = [];
  sesiones = [];
  estados = [];
  participaciones = [];
  asistencias = [];
  nombres = /* @__PURE__ */ new Map();
  errorPersonas = null;
  nombresParticipaciones = /* @__PURE__ */ new Map();
  /** Reutiliza consultas ya confirmadas por el detalle, sin volver a pedir sus catálogos. */
  usarContexto(datos) {
    this.actividades = [datos.actividad];
    this.sesiones = datos.sesiones.filter((s) => Number(s["id_actividad"]) === datos.actividad.id_actividad);
    this.participaciones = datos.participantes.map((p) => ({ id_participacion: p.id, id_actividad: datos.actividad.id_actividad }));
    this.nombresParticipaciones = new Map(datos.participantes.map((p) => [p.id, [p.nombres, p.apellidos].filter(Boolean).join(" ")]));
    this.asistencias = datos.asistencias;
    this.cargado = true;
  }
  invalidar() {
    this.cargado = false;
  }
  cargar(asistencias, actividadContexto = null) {
    if (this.cargado)
      return of(void 0);
    this.errorPersonas = null;
    return forkJoin({
      sesiones: this.api.listarTodos("activity-session"),
      actividades: actividadContexto ? of([actividadContexto]) : this.api.listarTodos("activity"),
      asistencias: asistencias ? this.api.listarTodos("attendance") : of([]),
      participaciones: asistencias ? this.api.listarTodos("participation") : of([]),
      personas: asistencias ? this.personas.listar().pipe(catchError((error) => {
        this.errorPersonas = `No se pudo consultar /persons/list${error?.status ? ` (HTTP ${error.status})` : ""}. ${error?.mensaje || aErrorApi(error).mensaje}`;
        return of([]);
      })) : of([])
    }).pipe(tap((datos) => {
      this.actividades = datos.actividades;
      this.sesiones = datos.sesiones;
      this.participaciones = datos.participaciones;
      this.asistencias = datos.asistencias;
      const actividades = new Map(datos.actividades.map((fila) => [Number(fila["id_actividad"]), fila["nombre"]]));
      const sesiones = new Map(datos.sesiones.map((fila) => [Number(fila["id_actividad_sesion"]), fila]));
      const participaciones = new Map(datos.participaciones.map((fila) => [Number(fila["id_participacion"]), fila]));
      const personas = new Map(datos.personas.map((persona) => [
        persona.id_persona,
        [persona.nombres, persona.apellido_paterno, persona.apellido_materno].filter(Boolean).join(" ")
      ]));
      this.nombres = personas;
      this.filas = (asistencias ? datos.asistencias : datos.sesiones).map((fila) => {
        const sesion = sesiones.get(Number(fila["id_actividad_sesion"]));
        const participacion = participaciones.get(Number(fila["id_participacion"]));
        const actividad = asistencias ? sesion?.["id_actividad"] ?? fila["id_actividad_sesion_actividad"] : fila["id_actividad"];
        return __spreadProps(__spreadValues({}, fila), {
          actividadFiltro: actividad ?? null,
          actividadNombre: actividades.get(Number(actividad)) ?? "Nombre no disponible",
          sesionNombre: sesion?.["nombre"] ?? "Nombre no disponible",
          participanteNombre: personas.get(Number(fila["id_persona"] ?? participacion?.["id_persona"])) ?? "Nombre no disponible"
        });
      });
      this.estados = [...new Set(this.filas.map((fila) => String(fila["estado"] ?? "")).filter(Boolean))].sort();
      this.cargado = true;
    }), map(() => void 0));
  }
  sesionesDisponibles(actividad) {
    return actividad ? this.sesiones.filter((sesion) => String(sesion["id_actividad"]) === actividad) : [];
  }
  matriz(actividad, sesion) {
    if (!actividad || !sesion || !this.sesionesDisponibles(actividad).some((fila) => String(fila["id_actividad_sesion"]) === sesion))
      return [];
    return this.participaciones.filter((fila) => String(fila["id_actividad"]) === actividad).map((participacion) => {
      const marcas = this.asistencias.filter((marca) => Number(marca["id_participacion"]) === Number(participacion["id_participacion"]) && String(marca["id_actividad_sesion"]) === sesion);
      return __spreadProps(__spreadValues({}, marcas[0]), {
        id_participacion: participacion["id_participacion"],
        id_actividad_sesion: Number(sesion),
        actividadFiltro: Number(actividad),
        sesionNombre: this.sesiones.find((fila) => String(fila["id_actividad_sesion"]) === sesion)?.["nombre"] ?? "Nombre no disponible",
        actividadNombre: this.actividades.find((fila) => String(fila["id_actividad"]) === actividad)?.["nombre"] ?? "Nombre no disponible",
        participanteNombre: this.nombresParticipaciones.get(Number(participacion["id_participacion"])) || this.nombres.get(Number(participacion["id_persona"])) || "Nombre no disponible",
        duplicada: marcas.length > 1
      });
    });
  }
  paginar(filtros, asistencias, numero, cantidad) {
    const nombre = normalizarBusqueda(filtros.nombre);
    const filas = (asistencias ? this.matriz(filtros.actividad, filtros.sesion) : this.filas).filter((fila) => (!nombre || normalizarBusqueda(String(fila[asistencias ? "participanteNombre" : "nombre"] ?? "")).includes(nombre)) && (!filtros.actividad || String(fila["actividadFiltro"]) === filtros.actividad) && (!filtros.fecha || String(fila["fecha"] ?? "").slice(0, 10) === filtros.fecha) && (!filtros.sesion || String(fila["id_actividad_sesion"]) === filtros.sesion) && (!filtros.estado || estadoListado(fila["estado"], asistencias) === estadoListado(filtros.estado, asistencias)));
    const ultima = Math.max(1, Math.ceil(filas.length / cantidad));
    const pagina = Math.max(1, Math.min(numero, ultima));
    return {
      data: filas.slice((pagina - 1) * cantidad, pagina * cantidad),
      total: filas.length,
      current_page: pagina,
      last_page: ultima,
      per_page: cantidad
    };
  }
  static \u0275fac = function SesionesAsistenciaListado_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SesionesAsistenciaListado)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SesionesAsistenciaListado, factory: _SesionesAsistenciaListado.\u0275fac });
};

// src/app/pages/emision-certificados/compartidos/listado-emision.component.ts
var _c0 = ["modalRegistro"];
var _forTrack0 = ($index, $item) => $item.valor;
var _forTrack1 = ($index, $item) => $item["id_actividad"];
var _forTrack2 = ($index, $item) => $item["id_actividad_sesion"];
var _forTrack3 = ($index, $item) => $item.nombre;
var _forTrack4 = ($index, $item) => $item["id_participacion"];
function _forTrack5($index, $item) {
  return this.identificar($item);
}
var _c1 = (a0, a1) => [a0, a1];
var _c2 = (a0, a1) => [a0, a1, "editar"];
function ListadoEmisionComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 1);
    \u0275\u0275text(1, "Asistencia de solo lectura.");
    \u0275\u0275elementEnd();
  }
}
function ListadoEmisionComponent_Conditional_1_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 14);
    \u0275\u0275listener("click", function ListadoEmisionComponent_Conditional_1_Conditional_3_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.abrirFormulario(null, $event));
    });
    \u0275\u0275elementStart(1, "span", 15);
    \u0275\u0275text(2, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, "Nuevo registro ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r2.eliminando());
  }
}
function ListadoEmisionComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2)(1, "h2");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, ListadoEmisionComponent_Conditional_1_Conditional_3_Template, 4, 1, "button", 13);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.tituloEncabezado() || ctx_r2.config().titulo);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.recurso() !== "attendance" && !ctx_r2.soloLecturaSesion() && ctx_r2.permitido("crear") ? 3 : -1);
  }
}
function ListadoEmisionComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 3);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.config().aviso);
  }
}
function ListadoEmisionComponent_Conditional_3_Template(rf, ctx) {
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
function ListadoEmisionComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 5);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function ListadoEmisionComponent_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 6);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const mensaje_r4 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(mensaje_r4);
  }
}
function ListadoEmisionComponent_Conditional_7_Conditional_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 18);
    \u0275\u0275text(1, "Nuevo registro");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275property("routerLink", ctx);
  }
}
function ListadoEmisionComponent_Conditional_7_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 20);
    \u0275\u0275listener("click", function ListadoEmisionComponent_Conditional_7_Conditional_0_Conditional_2_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.abrirFormulario(null, $event));
    });
    \u0275\u0275text(1, "Nuevo registro");
    \u0275\u0275elementEnd();
  }
}
function ListadoEmisionComponent_Conditional_7_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 16);
    \u0275\u0275template(1, ListadoEmisionComponent_Conditional_7_Conditional_0_Conditional_1_Template, 2, 1, "a", 18)(2, ListadoEmisionComponent_Conditional_7_Conditional_0_Conditional_2_Template, 2, 0, "button", 19);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_4_0 = ctx_r2.nuevoUrl()) ? 1 : 2, tmp_4_0);
  }
}
function ListadoEmisionComponent_Conditional_7_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-formulario-emision", 21);
    \u0275\u0275listener("guardado", function ListadoEmisionComponent_Conditional_7_Conditional_1_Template_app_formulario_emision_guardado_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.alGuardar());
    })("cancelar", function ListadoEmisionComponent_Conditional_7_Conditional_1_Template_app_formulario_emision_cancelar_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.cerrarFormulario());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_5_0;
    const recursoEditable_r7 = \u0275\u0275nextContext();
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("recurso", recursoEditable_r7)("id", (tmp_5_0 = ctx_r2.editar()) !== null && tmp_5_0 !== void 0 ? tmp_5_0 : null);
  }
}
function ListadoEmisionComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, ListadoEmisionComponent_Conditional_7_Conditional_0_Template, 3, 1, "div", 16)(1, ListadoEmisionComponent_Conditional_7_Conditional_1_Template, 1, 2, "app-formulario-emision", 17);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275conditional(!ctx_r2.mostrarModal() && !ctx_r2.soloLecturaSesion() && ctx_r2.permitido("crear") ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r2.mostrarModal() && ctx_r2.editar() !== void 0 ? 1 : -1);
  }
}
function ListadoEmisionComponent_Conditional_8_For_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 28);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const opcion_r9 = ctx.$implicit;
    \u0275\u0275property("value", opcion_r9.valor);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(opcion_r9.etiqueta);
  }
}
function ListadoEmisionComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 22);
    \u0275\u0275listener("ngSubmit", function ListadoEmisionComponent_Conditional_8_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.cargar(1));
    });
    \u0275\u0275elementStart(1, "div", 23)(2, "label", 24);
    \u0275\u0275text(3, "Buscar por nombre");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "input", 25);
    \u0275\u0275listener("input", function ListadoEmisionComponent_Conditional_8_Template_input_input_4_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.cargar(1));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 23)(6, "label", 24);
    \u0275\u0275text(7, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "select", 26);
    \u0275\u0275listener("change", function ListadoEmisionComponent_Conditional_8_Template_select_change_8_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.cargar(1));
    });
    \u0275\u0275elementStart(9, "option", 27);
    \u0275\u0275text(10, "Todos los estados");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(11, ListadoEmisionComponent_Conditional_8_For_12_Template, 2, 2, "option", 28, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "button", 29);
    \u0275\u0275listener("click", function ListadoEmisionComponent_Conditional_8_Template_button_click_13_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.limpiarClasificacion());
    });
    \u0275\u0275text(14, "Limpiar filtros");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("formGroup", ctx_r2.filtrosClasificacion);
    \u0275\u0275attribute("aria-label", "Filtrar " + ctx_r2.config().titulo);
    \u0275\u0275advance(2);
    \u0275\u0275property("for", ctx_r2.recurso() + "-buscar-nombre");
    \u0275\u0275advance(2);
    \u0275\u0275property("id", ctx_r2.recurso() + "-buscar-nombre");
    \u0275\u0275advance(2);
    \u0275\u0275property("for", ctx_r2.recurso() + "-buscar-estado");
    \u0275\u0275advance(2);
    \u0275\u0275property("id", ctx_r2.recurso() + "-buscar-estado");
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r2.estadosClasificaciones);
  }
}
function ListadoEmisionComponent_Conditional_9_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p")(1, "strong");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx.nombre);
  }
}
function ListadoEmisionComponent_Conditional_9_For_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 28);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const actividad_r11 = ctx.$implicit;
    \u0275\u0275property("value", actividad_r11["id_actividad"]);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(actividad_r11["nombre"]);
  }
}
function ListadoEmisionComponent_Conditional_9_Conditional_14_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 28);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const sesion_r13 = ctx.$implicit;
    \u0275\u0275property("value", sesion_r13["id_actividad_sesion"]);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(sesion_r13["nombre"]);
  }
}
function ListadoEmisionComponent_Conditional_9_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 34)(1, "label", 35);
    \u0275\u0275text(2, "Sesi\xF3n de la actividad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "select", 36);
    \u0275\u0275listener("change", function ListadoEmisionComponent_Conditional_9_Conditional_14_Template_select_change_3_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.aplicarFiltros());
    });
    \u0275\u0275elementStart(4, "option", 27);
    \u0275\u0275text(5, "Selecciona una sesi\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(6, ListadoEmisionComponent_Conditional_9_Conditional_14_For_7_Template, 2, 2, "option", 28, _forTrack2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("hidden", ctx_r2.enDetalle());
    \u0275\u0275advance(6);
    \u0275\u0275repeater(ctx_r2.catalogosSesiones.sesionesDisponibles(ctx_r2.filtrosSesiones.controls.actividad.value));
  }
}
function ListadoEmisionComponent_Conditional_9_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 23)(1, "label", 37);
    \u0275\u0275text(2, "Fecha");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "input", 38);
    \u0275\u0275listener("input", function ListadoEmisionComponent_Conditional_9_Conditional_15_Template_input_input_3_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.aplicarFiltros());
    });
    \u0275\u0275elementEnd()();
  }
}
function ListadoEmisionComponent_Conditional_9_For_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 28);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const estado_r15 = ctx.$implicit;
    \u0275\u0275property("value", estado_r15.valor);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(estado_r15.etiqueta);
  }
}
function ListadoEmisionComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 30);
    \u0275\u0275listener("ngSubmit", function ListadoEmisionComponent_Conditional_9_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.aplicarFiltros());
    });
    \u0275\u0275elementStart(1, "div", 23)(2, "label", 24);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "input", 31);
    \u0275\u0275listener("input", function ListadoEmisionComponent_Conditional_9_Template_input_input_4_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.aplicarFiltros());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 23)(6, "label", 32);
    \u0275\u0275text(7, "Actividad");
    \u0275\u0275elementEnd();
    \u0275\u0275template(8, ListadoEmisionComponent_Conditional_9_Conditional_8_Template, 3, 1, "p");
    \u0275\u0275elementStart(9, "select", 33);
    \u0275\u0275listener("change", function ListadoEmisionComponent_Conditional_9_Template_select_change_9_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.cambiarActividad());
    });
    \u0275\u0275elementStart(10, "option", 27);
    \u0275\u0275text(11, "Todas las actividades");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(12, ListadoEmisionComponent_Conditional_9_For_13_Template, 2, 2, "option", 28, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(14, ListadoEmisionComponent_Conditional_9_Conditional_14_Template, 8, 1, "div", 34)(15, ListadoEmisionComponent_Conditional_9_Conditional_15_Template, 4, 0, "div", 23);
    \u0275\u0275elementStart(16, "div", 23)(17, "label", 24);
    \u0275\u0275text(18, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "select", 26);
    \u0275\u0275listener("change", function ListadoEmisionComponent_Conditional_9_Template_select_change_19_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.aplicarFiltros());
    });
    \u0275\u0275elementStart(20, "option", 27);
    \u0275\u0275text(21, "Todos los estados");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(22, ListadoEmisionComponent_Conditional_9_For_23_Template, 2, 2, "option", 28, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "button", 29);
    \u0275\u0275listener("click", function ListadoEmisionComponent_Conditional_9_Template_button_click_24_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.limpiarFiltros());
    });
    \u0275\u0275text(25, "Limpiar filtros");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_10_0;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("formGroup", ctx_r2.filtrosSesiones);
    \u0275\u0275attribute("aria-label", "Filtrar " + ctx_r2.config().titulo);
    \u0275\u0275advance(2);
    \u0275\u0275property("for", ctx_r2.recurso() + "-buscar-nombre");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.recurso() === "attendance" ? "Participante" : "Buscar por nombre");
    \u0275\u0275advance();
    \u0275\u0275property("id", ctx_r2.recurso() + "-buscar-nombre")("placeholder", ctx_r2.recurso() === "attendance" ? "Nombre del participante" : "Nombre de la sesi\xF3n");
    \u0275\u0275advance(2);
    \u0275\u0275property("hidden", ctx_r2.enDetalle())("for", ctx_r2.recurso() + "-buscar-actividad");
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_10_0 = !ctx_r2.enDetalle() && ctx_r2.actividadContexto()) ? 8 : -1, tmp_10_0);
    \u0275\u0275advance();
    \u0275\u0275property("hidden", !!ctx_r2.actividadContexto())("id", ctx_r2.recurso() + "-buscar-actividad");
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r2.catalogosSesiones.actividades);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.recurso() === "attendance" ? 14 : 15);
    \u0275\u0275advance(3);
    \u0275\u0275property("for", ctx_r2.recurso() + "-buscar-estado");
    \u0275\u0275advance(2);
    \u0275\u0275property("id", ctx_r2.recurso() + "-buscar-estado");
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r2.opcionesEstado());
  }
}
function ListadoEmisionComponent_Conditional_10_For_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 28);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const campo_r17 = ctx.$implicit;
    \u0275\u0275property("value", campo_r17.nombre);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(campo_r17.titulo);
  }
}
function ListadoEmisionComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 39);
    \u0275\u0275listener("ngSubmit", function ListadoEmisionComponent_Conditional_10_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r16);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.cargar(1));
    });
    \u0275\u0275elementStart(1, "div", 23)(2, "label", 24);
    \u0275\u0275text(3, "Filtrar por");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "select", 40)(5, "option", 27);
    \u0275\u0275text(6, "Sin filtro");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(7, ListadoEmisionComponent_Conditional_10_For_8_Template, 2, 2, "option", 28, _forTrack3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 23)(10, "label", 24);
    \u0275\u0275text(11, "Valor exacto (booleanos: 1 o 0)");
    \u0275\u0275elementEnd();
    \u0275\u0275element(12, "input", 41);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "button", 42);
    \u0275\u0275text(14, "Buscar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "button", 43);
    \u0275\u0275listener("click", function ListadoEmisionComponent_Conditional_10_Template_button_click_15_listener() {
      \u0275\u0275restoreView(_r16);
      const ctx_r2 = \u0275\u0275nextContext();
      ctx_r2.filtro.reset();
      return \u0275\u0275resetView(ctx_r2.cargar(1));
    });
    \u0275\u0275text(16, "Limpiar");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("formGroup", ctx_r2.filtro);
    \u0275\u0275attribute("aria-label", "Filtrar " + ctx_r2.config().titulo);
    \u0275\u0275advance(2);
    \u0275\u0275property("for", ctx_r2.recurso() + "-filtro-campo");
    \u0275\u0275advance(2);
    \u0275\u0275property("id", ctx_r2.recurso() + "-filtro-campo");
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r2.config().filtros);
    \u0275\u0275advance(3);
    \u0275\u0275property("for", ctx_r2.recurso() + "-filtro-valor");
    \u0275\u0275advance(2);
    \u0275\u0275property("id", ctx_r2.recurso() + "-filtro-valor");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r2.cargando());
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r2.cargando());
  }
}
function ListadoEmisionComponent_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 1);
    \u0275\u0275text(1, "Cargando registros\u2026");
    \u0275\u0275elementEnd();
  }
}
function ListadoEmisionComponent_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 5);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 44);
    \u0275\u0275listener("click", function ListadoEmisionComponent_Conditional_13_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r18);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.enDetalle() && ctx_r2.requiereActualizar() ? ctx_r2.actualizarAsistencia() : ctx_r2.cargar(1));
    });
    \u0275\u0275text(3, "Reintentar");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.errorCarga());
  }
}
function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 20);
    \u0275\u0275listener("click", function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_0_Conditional_2_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r20);
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.registrarSesion($event));
    });
    \u0275\u0275text(1, "Registrar sesi\xF3n");
    \u0275\u0275elementEnd();
  }
}
function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 1);
    \u0275\u0275text(1, "Esta actividad todav\xEDa no tiene sesiones registradas. Registra una sesi\xF3n para comenzar a controlar la asistencia");
    \u0275\u0275elementEnd();
    \u0275\u0275template(2, ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_0_Conditional_2_Template, 2, 0, "button", 19);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.puedeCrearSesion() ? 2 : -1);
  }
}
function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_1_Conditional_0_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "dt");
    \u0275\u0275text(2, "Por regularizar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "dd");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const resumen_r21 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(resumen_r21.porRevisar);
  }
}
function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dl", 49)(1, "div")(2, "dt");
    \u0275\u0275text(3, "Inscritos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "dd");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div")(7, "dt");
    \u0275\u0275text(8, "Presentes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "dd");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div")(12, "dt");
    \u0275\u0275text(13, "Ausentes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "dd");
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div")(17, "dt");
    \u0275\u0275text(18, "Pendientes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "dd");
    \u0275\u0275text(20);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(21, ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_1_Conditional_0_Conditional_21_Template, 5, 1, "div");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const resumen_r21 = ctx;
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(resumen_r21.inscritos);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(resumen_r21.presentes);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(resumen_r21.ausentes);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(resumen_r21.pendientes);
    \u0275\u0275advance();
    \u0275\u0275conditional(resumen_r21.porRevisar ? 21 : -1);
  }
}
function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_1_Conditional_0_Template, 22, 5, "dl", 49);
  }
  if (rf & 2) {
    let tmp_5_0;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275conditional((tmp_5_0 = ctx_r2.resumenAsistencia()) ? 0 : -1, tmp_5_0);
  }
}
function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 46);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.recurso() === "attendance" && (!ctx_r2.filtrosSesiones.controls.actividad.value || !ctx_r2.filtrosSesiones.controls.sesion.value) ? "Selecciona una actividad y una sesi\xF3n para controlar su asistencia." : "No hay registros para esta consulta.");
  }
}
function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_3_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 50);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.catalogosSesiones.errorPersonas);
  }
}
function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r22 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 48);
    \u0275\u0275listener("click", function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_3_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r22);
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.actualizarAsistencia());
    });
    \u0275\u0275text(1, "Actualizar asistencia");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275property("disabled", ctx_r2.guardandoMarca() !== null);
  }
}
function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_3_Conditional_2_Conditional_3_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r24 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 48);
    \u0275\u0275listener("click", function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_3_Conditional_2_Conditional_3_Conditional_2_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r24);
      const ctx_r2 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r2.descartarSeleccion());
    });
    \u0275\u0275text(1, "Descartar cambios");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(6);
    \u0275\u0275property("disabled", ctx_r2.estaGuardando());
  }
}
function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_3_Conditional_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r23 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 14);
    \u0275\u0275listener("click", function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_3_Conditional_2_Conditional_3_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r23);
      const ctx_r2 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r2.guardarSeleccion());
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275template(2, ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_3_Conditional_2_Conditional_3_Conditional_2_Template, 2, 1, "button", 51);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(5);
    \u0275\u0275property("disabled", !ctx_r2.puedeGuardarAsistencia());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.guardandoSeleccion() ? "Guardando asistencia\u2026" : "Guardar asistencia");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.pendientesSesion().length ? 2 : -1);
  }
}
function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_3_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 52)(1, "span", 1);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_3_Conditional_2_Conditional_3_Template, 3, 3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", ctx_r2.pendientesSesion().length, " cambios pendientes de esta sesi\xF3n");
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r2.accionesExternas() ? 3 : -1);
  }
}
function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_3_For_23_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 64);
    \u0275\u0275text(1, " \xB7 Salida pendiente");
    \u0275\u0275elementEnd();
  }
}
function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_3_For_23_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 65);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_3_For_23_Conditional_39_Template(rf, ctx) {
  if (rf & 1) {
    const _r27 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 48);
    \u0275\u0275listener("click", function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_3_For_23_Conditional_39_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r27);
      const fila_r26 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.marcarAsistencia(fila_r26, $event));
    });
    \u0275\u0275text(1, "Regularizar");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(5);
    \u0275\u0275property("disabled", ctx_r2.guardandoMarca() !== null || ctx_r2.requiereActualizar());
  }
}
function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_3_For_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r25 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td", 57);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th", 58);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 57)(6, "button", 59);
    \u0275\u0275listener("click", function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_3_For_23_Template_button_click_6_listener() {
      const fila_r26 = \u0275\u0275restoreView(_r25).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.marcarPresencia(fila_r26, "PRESENTE"));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(7, "svg", 60);
    \u0275\u0275element(8, "path", 61);
    \u0275\u0275elementEnd()()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(9, "td", 57)(10, "button", 62);
    \u0275\u0275listener("click", function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_3_For_23_Template_button_click_10_listener() {
      const fila_r26 = \u0275\u0275restoreView(_r25).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.marcarPresencia(fila_r26, "AUSENTE"));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(11, "svg", 60);
    \u0275\u0275element(12, "path", 63);
    \u0275\u0275elementEnd()()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(13, "td", 57)(14, "span", 1);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd();
    \u0275\u0275template(16, ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_3_For_23_Conditional_16_Template, 2, 0, "small", 64)(17, ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_3_For_23_Conditional_17_Template, 2, 1, "p", 65);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "td")(19, "details", 66)(20, "summary");
    \u0275\u0275text(21, "Ver horas y regularizar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "dl")(23, "dt");
    \u0275\u0275text(24, "Hora de entrada");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "dd");
    \u0275\u0275text(26);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "dt");
    \u0275\u0275text(28, "Hora de salida");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "dd");
    \u0275\u0275text(30);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(31, "p");
    \u0275\u0275text(32, "Las horas se conservan al guardar presencia o ausencia. Registrar horas requiere el formulario; no se generan autom\xE1ticamente.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "label")(34, "input", 67);
    \u0275\u0275listener("change", function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_3_For_23_Template_input_change_34_listener($event) {
      const fila_r26 = \u0275\u0275restoreView(_r25).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.marcarAsistencia(fila_r26, $event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275text(35, "Entrada");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "label")(37, "input", 67);
    \u0275\u0275listener("change", function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_3_For_23_Template_input_change_37_listener($event) {
      const fila_r26 = \u0275\u0275restoreView(_r25).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.marcarAsistencia(fila_r26, $event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275text(38, "Salida");
    \u0275\u0275elementEnd();
    \u0275\u0275template(39, ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_3_For_23_Conditional_39_Template, 2, 1, "button", 51);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_29_0;
    const fila_r26 = ctx.$implicit;
    const \u0275$index_302_r28 = ctx.$index;
    const paginaActual_r29 = \u0275\u0275nextContext(2);
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275attribute("aria-busy", ctx_r2.guardandoMarca() === fila_r26["id_participacion"]);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.inicioRango(paginaActual_r29) + \u0275$index_302_r28);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(fila_r26["participanteNombre"]);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("seleccionado", ctx_r2.presenciaMostrada(fila_r26) === "presente");
    \u0275\u0275property("disabled", !ctx_r2.enDetalle() && !!fila_r26["id_asistencia"] || !!fila_r26["duplicada"] || ctx_r2.guardandoMarca() !== null || ctx_r2.requiereActualizar() || ctx_r2.soloLecturaSesion() || !ctx_r2.permitido(fila_r26["id_asistencia"] ? "editar" : "crear"));
    \u0275\u0275attribute("aria-label", "Marcar presente a " + fila_r26["participanteNombre"])("aria-pressed", ctx_r2.presenciaMostrada(fila_r26) === "presente");
    \u0275\u0275advance(4);
    \u0275\u0275classProp("seleccionado", ctx_r2.presenciaMostrada(fila_r26) === "ausente");
    \u0275\u0275property("disabled", !ctx_r2.enDetalle() && !!fila_r26["id_asistencia"] || !!fila_r26["duplicada"] || ctx_r2.guardandoMarca() !== null || ctx_r2.requiereActualizar() || ctx_r2.soloLecturaSesion() || !ctx_r2.permitido(fila_r26["id_asistencia"] ? "editar" : "crear"));
    \u0275\u0275attribute("aria-label", "Marcar ausente a " + fila_r26["participanteNombre"])("aria-pressed", ctx_r2.presenciaMostrada(fila_r26) === "ausente");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r2.guardandoMarca() === fila_r26["id_participacion"] ? "Guardando\u2026" : ctx_r2.resultadoAsistencia(fila_r26));
    \u0275\u0275advance();
    \u0275\u0275conditional(fila_r26["hora_entrada"] && !fila_r26["hora_salida"] ? 16 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_29_0 = ctx_r2.errorMarca(fila_r26)) ? 17 : -1, tmp_29_0);
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(fila_r26["hora_entrada"] || "Sin registrar");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(fila_r26["hora_salida"] || "Sin registrar");
    \u0275\u0275advance(4);
    \u0275\u0275property("checked", !!fila_r26["hora_entrada"])("disabled", !!ctx_r2.borrador(fila_r26) || !!fila_r26["hora_entrada"] || !!fila_r26["duplicada"] || ctx_r2.guardandoMarca() !== null || ctx_r2.requiereActualizar() || ctx_r2.soloLecturaSesion() || !ctx_r2.permitido(fila_r26["id_asistencia"] ? "editar" : "crear"));
    \u0275\u0275attribute("aria-label", "Registrar entrada de " + fila_r26["participanteNombre"]);
    \u0275\u0275advance(3);
    \u0275\u0275property("checked", !!fila_r26["hora_salida"])("disabled", !!ctx_r2.borrador(fila_r26) || !fila_r26["hora_entrada"] || !!fila_r26["hora_salida"] || !!fila_r26["duplicada"] || ctx_r2.guardandoMarca() !== null || ctx_r2.requiereActualizar() || ctx_r2.soloLecturaSesion() || !ctx_r2.permitido("editar"));
    \u0275\u0275attribute("aria-label", "Registrar salida de " + fila_r26["participanteNombre"]);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(fila_r26["id_asistencia"] && !fila_r26["duplicada"] && ctx_r2.permitido("editar") && !ctx_r2.soloLecturaSesion() ? 39 : -1);
  }
}
function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_3_Conditional_0_Template, 2, 1, "p", 50)(1, ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_3_Conditional_1_Template, 2, 1, "button", 51)(2, ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_3_Conditional_2_Template, 4, 2, "div", 52);
    \u0275\u0275elementStart(3, "div", 47)(4, "table", 53)(5, "caption", 54);
    \u0275\u0275text(6, "Asistencia de los inscritos por sesi\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "thead")(8, "tr")(9, "th", 55);
    \u0275\u0275text(10, "N.\xBA");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th", 56);
    \u0275\u0275text(12, "Participante");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th", 55);
    \u0275\u0275text(14, "Presente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "th", 55);
    \u0275\u0275text(16, "Ausente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "th", 55);
    \u0275\u0275text(18, "Resultado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "th", 56);
    \u0275\u0275text(20, "Horas / Regularizaci\xF3n");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(21, "tbody");
    \u0275\u0275repeaterCreate(22, ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_3_For_23_Template, 40, 25, "tr", null, _forTrack4);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const paginaActual_r29 = \u0275\u0275nextContext();
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(ctx_r2.catalogosSesiones.errorPersonas ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r2.paginaCompleta() ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.enDetalle() && !ctx_r2.soloLecturaSesion() && (ctx_r2.permitido("crear") || ctx_r2.permitido("editar")) ? 2 : -1);
    \u0275\u0275advance(20);
    \u0275\u0275repeater(paginaActual_r29.data);
  }
}
function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_4_For_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 56);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const campo_r30 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.tituloColumna(campo_r30.nombre, campo_r30.titulo));
  }
}
function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_4_For_14_For_4_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 74);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const campo_r31 = \u0275\u0275nextContext().$implicit;
    const registro_r32 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275classProp("badge-exito", ctx_r2.mostrarCampo(registro_r32, campo_r31.nombre) === "Activo");
    \u0275\u0275attribute("data-estado", ctx_r2.mostrarCampo(registro_r32, campo_r31.nombre));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.mostrarCampo(registro_r32, campo_r31.nombre));
  }
}
function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_4_For_14_For_4_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const campo_r31 = \u0275\u0275nextContext().$implicit;
    const registro_r32 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275textInterpolate1(" ", ctx_r2.mostrarCampo(registro_r32, campo_r31.nombre), " ");
  }
}
function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_4_For_14_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td");
    \u0275\u0275template(1, ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_4_For_14_For_4_Conditional_1_Template, 2, 4, "span", 73)(2, ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_4_For_14_For_4_Conditional_2_Template, 1, 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const campo_r31 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(5);
    \u0275\u0275advance();
    \u0275\u0275conditional((ctx_r2.usaModal() || ctx_r2.esClasificacion()) && campo_r31.nombre === "estado" ? 1 : 2);
  }
}
function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_4_For_14_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r33 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 44);
    \u0275\u0275listener("click", function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_4_For_14_Conditional_7_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r33);
      const registro_r32 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.controlarAsistencia(registro_r32));
    });
    \u0275\u0275text(1, "Controlar asistencia");
    \u0275\u0275elementEnd();
  }
}
function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_4_For_14_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 70)(1, "span", 15);
    \u0275\u0275text(2, "visibility");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const registro_r32 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction2(1, _c1, ctx, ctx_r2.identificar(registro_r32)));
  }
}
function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_4_For_14_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r34 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 75);
    \u0275\u0275listener("click", function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_4_For_14_Conditional_9_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r34);
      const registro_r32 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.verDetalle(registro_r32));
    });
    \u0275\u0275elementStart(1, "span", 15);
    \u0275\u0275text(2, "visibility");
    \u0275\u0275elementEnd()();
  }
}
function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_4_For_14_Conditional_10_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 76)(1, "span", 15);
    \u0275\u0275text(2, "edit");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const registro_r32 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction2(1, _c2, ctx, ctx_r2.identificar(registro_r32)));
  }
}
function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_4_For_14_Conditional_10_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r35 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 78);
    \u0275\u0275listener("click", function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_4_For_14_Conditional_10_Conditional_1_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r35);
      const registro_r32 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.abrirFormulario(ctx_r2.identificar(registro_r32), $event));
    });
    \u0275\u0275elementStart(1, "span", 15);
    \u0275\u0275text(2, "edit");
    \u0275\u0275elementEnd()();
  }
}
function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_4_For_14_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_4_For_14_Conditional_10_Conditional_0_Template, 3, 4, "a", 76)(1, ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_4_For_14_Conditional_10_Conditional_1_Template, 3, 0, "button", 77);
  }
  if (rf & 2) {
    let tmp_17_0;
    const ctx_r2 = \u0275\u0275nextContext(5);
    \u0275\u0275conditional((tmp_17_0 = ctx_r2.editarBase()) ? 0 : 1, tmp_17_0);
  }
}
function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_4_For_14_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r36 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 79);
    \u0275\u0275listener("click", function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_4_For_14_Conditional_11_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r36);
      const registro_r32 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.eliminar(registro_r32));
    });
    \u0275\u0275elementStart(1, "span", 15);
    \u0275\u0275text(2, "delete");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(5);
    \u0275\u0275property("disabled", ctx_r2.eliminando());
  }
}
function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_4_For_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 58);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(3, ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_4_For_14_For_4_Template, 3, 1, "td", null, _forTrack3);
    \u0275\u0275elementStart(5, "td")(6, "div", 16);
    \u0275\u0275template(7, ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_4_For_14_Conditional_7_Template, 2, 0, "button", 69)(8, ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_4_For_14_Conditional_8_Template, 3, 4, "a", 70)(9, ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_4_For_14_Conditional_9_Template, 3, 0, "button", 71)(10, ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_4_For_14_Conditional_10_Template, 2, 1)(11, ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_4_For_14_Conditional_11_Template, 3, 1, "button", 72);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_19_0;
    const \u0275$index_402_r37 = ctx.$index;
    const paginaActual_r29 = \u0275\u0275nextContext(2);
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.inicioRango(paginaActual_r29) + \u0275$index_402_r37);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.config().columnas);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r2.recurso() === "activity-session" ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_19_0 = ctx_r2.detalleBase()) ? 8 : 9, tmp_19_0);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx_r2.soloLecturaSesion() && ctx_r2.editable() && ctx_r2.permitido("editar") ? 10 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.puedeEliminar() ? 11 : -1);
  }
}
function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 47)(1, "table", 68)(2, "caption", 54);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "thead")(5, "tr")(6, "th", 56);
    \u0275\u0275text(7, "N.\xBA");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(8, ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_4_For_9_Template, 2, 1, "th", 56, _forTrack3);
    \u0275\u0275elementStart(10, "th", 56);
    \u0275\u0275text(11, "Acciones");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "tbody");
    \u0275\u0275repeaterCreate(13, ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_4_For_14_Template, 12, 5, "tr", null, _forTrack5, true);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const paginaActual_r29 = \u0275\u0275nextContext();
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r2.config().titulo);
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r2.config().columnas);
    \u0275\u0275advance(5);
    \u0275\u0275repeater(paginaActual_r29.data);
  }
}
function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r38 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 80)(1, "label", 24);
    \u0275\u0275text(2, "Registros por p\xE1gina");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "select", 81);
    \u0275\u0275listener("change", function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_6_Template_select_change_3_listener($event) {
      \u0275\u0275restoreView(_r38);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.cambiarCantidad($event.target.value));
    });
    \u0275\u0275elementStart(4, "option", 82);
    \u0275\u0275text(5, "5");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "option", 83);
    \u0275\u0275text(7, "10");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "option", 84);
    \u0275\u0275text(9, "50");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "span", 85);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const paginaActual_r29 = \u0275\u0275nextContext();
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("for", ctx_r2.recurso() + "-cantidad");
    \u0275\u0275advance(2);
    \u0275\u0275property("id", ctx_r2.recurso() + "-cantidad")("value", ctx_r2.cantidad());
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate5("", ctx_r2.inicioRango(paginaActual_r29), "\u2013", ctx_r2.finRango(paginaActual_r29), " de ", paginaActual_r29.total, " \xB7 P\xE1gina ", paginaActual_r29.current_page, " de ", paginaActual_r29.last_page, "");
  }
}
function ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const paginaActual_r29 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3("", paginaActual_r29.total, " registros \xB7 P\xE1gina ", paginaActual_r29.current_page, " de ", paginaActual_r29.last_page, "");
  }
}
function ListadoEmisionComponent_Conditional_14_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = \u0275\u0275getCurrentView();
    \u0275\u0275template(0, ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_0_Template, 3, 1)(1, ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_1_Template, 1, 1)(2, ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_2_Template, 2, 1, "p", 46)(3, ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_3_Template, 24, 3, "div", 47)(4, ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_4_Template, 15, 1, "div", 47);
    \u0275\u0275elementStart(5, "div", 45);
    \u0275\u0275template(6, ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_6_Template, 12, 8)(7, ListadoEmisionComponent_Conditional_14_Conditional_0_Conditional_7_Template, 2, 3, "span");
    \u0275\u0275elementStart(8, "button", 48);
    \u0275\u0275listener("click", function ListadoEmisionComponent_Conditional_14_Conditional_0_Template_button_click_8_listener() {
      const paginaActual_r29 = \u0275\u0275restoreView(_r19);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.cargar(paginaActual_r29.current_page - 1));
    });
    \u0275\u0275text(9, "Anterior");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "button", 48);
    \u0275\u0275listener("click", function ListadoEmisionComponent_Conditional_14_Conditional_0_Template_button_click_10_listener() {
      const paginaActual_r29 = \u0275\u0275restoreView(_r19);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.cargar(paginaActual_r29.current_page + 1));
    });
    \u0275\u0275text(11, "Siguiente");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const paginaActual_r29 = ctx;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(ctx_r2.recurso() === "attendance" && ctx_r2.filtrosSesiones.controls.actividad.value && !ctx_r2.catalogosSesiones.sesionesDisponibles(ctx_r2.filtrosSesiones.controls.actividad.value).length ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.recurso() === "attendance" && !ctx_r2.paginaCompleta() && ctx_r2.filtrosSesiones.controls.actividad.value && ctx_r2.filtrosSesiones.controls.sesion.value ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!paginaActual_r29.data.length ? 2 : ctx_r2.recurso() === "attendance" ? 3 : 4);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r2.usaModal() || ctx_r2.esClasificacion() ? 6 : 7);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", paginaActual_r29.current_page <= 1);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", paginaActual_r29.current_page >= paginaActual_r29.last_page);
  }
}
function ListadoEmisionComponent_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, ListadoEmisionComponent_Conditional_14_Conditional_0_Template, 12, 6, "div", 45);
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275conditional((tmp_2_0 = ctx_r2.pagina()) ? 0 : -1, tmp_2_0);
  }
}
function ListadoEmisionComponent_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 1);
    \u0275\u0275text(1, "Cargando detalle\u2026");
    \u0275\u0275elementEnd();
  }
}
function ListadoEmisionComponent_Conditional_16_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dt");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dd");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const campo_r40 = ctx.$implicit;
    const registro_r41 = \u0275\u0275nextContext();
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(campo_r40.titulo);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.mostrar(registro_r41[campo_r40.nombre]));
  }
}
function ListadoEmisionComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r39 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 10)(1, "h2");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "dl");
    \u0275\u0275repeaterCreate(4, ListadoEmisionComponent_Conditional_16_For_5_Template, 4, 2, null, null, _forTrack3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 44);
    \u0275\u0275listener("click", function ListadoEmisionComponent_Conditional_16_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r39);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.detalle.set(null));
    });
    \u0275\u0275text(7, "Cerrar detalle");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Detalle #", ctx_r2.identificar(ctx), "");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r2.camposDetalle());
  }
}
function ListadoEmisionComponent_Conditional_20_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r42 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-formulario-emision", 87);
    \u0275\u0275listener("guardado", function ListadoEmisionComponent_Conditional_20_Conditional_0_Template_app_formulario_emision_guardado_0_listener($event) {
      \u0275\u0275restoreView(_r42);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.alGuardar($event));
    })("cancelar", function ListadoEmisionComponent_Conditional_20_Conditional_0_Template_app_formulario_emision_cancelar_0_listener() {
      \u0275\u0275restoreView(_r42);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.cerrarFormulario());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_5_0;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("recurso", ctx_r2.registrandoSesion() ? "activity-session" : ctx)("id", (tmp_5_0 = ctx_r2.editar()) !== null && tmp_5_0 !== void 0 ? tmp_5_0 : null)("enDialogo", true)("clasificacion", ctx_r2.esClasificacion())("actividadContexto", ctx_r2.actividadFormulario())("asistenciaContexto", ctx_r2.asistenciaContexto());
  }
}
function ListadoEmisionComponent_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, ListadoEmisionComponent_Conditional_20_Conditional_0_Template, 1, 6, "app-formulario-emision", 86);
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275conditional((tmp_2_0 = ctx_r2.editable()) ? 0 : -1, tmp_2_0);
  }
}
var ListadoEmisionComponent = class _ListadoEmisionComponent {
  inicializado = false;
  router = inject(Router);
  route = inject(ActivatedRoute);
  asistenciaContexto = signal(null);
  presencia = resultadoPresencia;
  guardandoMarca = signal(null);
  guardandoSeleccion = signal(false);
  marcasPendientes = signal([]);
  erroresMarcas = signal({});
  datosContexto = input(null);
  accionesExternas = input(false);
  paginaCompleta = input(false);
  recargarTrasGuardar = input(false);
  asistenciasActualizadas = output();
  estaGuardando() {
    return this.guardandoSeleccion() || this.guardandoMarca() !== null || !!this.formulario()?.enviando();
  }
  cambiosPendientes() {
    return this.pendientesSesion().length;
  }
  puedeGuardarAsistencia() {
    return this.enDetalle() && !!this.cambiosPendientes() && !this.estaGuardando() && !this.cargando() && !this.requiereActualizar() && !this.soloLecturaSesion() && this.pendientesSesion().every((m) => this.permitido(m.asistencia ? "editar" : "crear"));
  }
  guardarAsistencia() {
    if (this.puedeGuardarAsistencia())
      this.guardarSeleccion();
  }
  descartarCambios() {
    this.descartarSeleccion();
  }
  hayCambiosSinGuardar() {
    return !!this.cambiosPendientes() || !!this.formulario()?.hayCambiosSinGuardar();
  }
  refrescarAsistencia() {
    this.actualizarAsistencia();
  }
  claveMarca(participacion, sesion) {
    return `${sesion}:${participacion}`;
  }
  pendientesSesion() {
    return this.marcasPendientes().filter((m) => String(m.sesion) === this.filtrosSesiones.controls.sesion.value);
  }
  borrador(fila) {
    return this.marcasPendientes().find((m) => m.participacion === Number(fila["id_participacion"]) && m.sesion === Number(fila["id_actividad_sesion"]));
  }
  presenciaMostrada(fila) {
    const marca = this.enDetalle() ? this.borrador(fila) : void 0;
    return marca ? marca.estado === "PRESENTE" ? "presente" : "ausente" : resultadoPresencia(fila);
  }
  errorMarca(fila) {
    return this.erroresMarcas()[this.claveMarca(Number(fila["id_participacion"]), Number(fila["id_actividad_sesion"]))];
  }
  descartarSeleccion() {
    if (this.estaGuardando())
      return;
    this.marcasPendientes.update((marcas) => marcas.filter((m) => String(m.sesion) !== this.filtrosSesiones.controls.sesion.value));
  }
  requiereActualizar = signal(false);
  actualizandoMarcas = false;
  marcacion;
  registrandoSesion = signal(false);
  resumenAsistencia() {
    return resumenPresencia(this.catalogosSesiones.matriz(this.filtrosSesiones.controls.actividad.value, this.filtrosSesiones.controls.sesion.value));
  }
  registrarSesion(evento) {
    if (!this.filtrosSesiones.controls.actividad.value || !this.auth.tienePermiso("actividades.crear"))
      return;
    this.registrandoSesion.set(true);
    this.abrirFormulario(null, evento);
  }
  puedeCrearSesion() {
    return this.auth.tienePermiso("actividades.crear");
  }
  marcarPresencia(fila, estado) {
    if (this.estaGuardando() || this.requiereActualizar() || fila["duplicada"] || !this.permitido(fila["id_asistencia"] ? "editar" : "crear") || this.soloLecturaSesion())
      return;
    const participacion = Number(fila["id_participacion"]);
    const sesion = Number(fila["id_actividad_sesion"]);
    if (![participacion, sesion].every((id) => Number.isSafeInteger(id) && id > 0))
      return;
    if (fila["id_asistencia"] && (!Number.isSafeInteger(Number(fila["id_asistencia"])) || Number(fila["id_asistencia"]) < 1))
      return;
    const actividad = this.filtrosSesiones.controls.actividad.value;
    if (!this.catalogosSesiones.matriz(actividad, String(sesion)).some((registro) => Number(registro["id_participacion"]) === participacion))
      return;
    if (this.enDetalle()) {
      const anterior = this.borrador(fila);
      this.marcasPendientes.update((marcas) => [
        ...marcas.filter((m) => m.participacion !== participacion || m.sesion !== sesion),
        ...anterior?.estado === estado || fila["estado"] === estado ? [] : [{ participacion, sesion, estado, asistencia: fila["id_asistencia"] ? Number(fila["id_asistencia"]) : void 0 }]
      ]);
      this.aviso.set(null);
      return;
    }
    this.guardandoMarca.set(participacion);
    this.errorOperacion.set(null);
    this.aviso.set(null);
    let recibido = false;
    this.marcacion = this.confirmarMarca({ participacion, sesion, estado }, () => recibido = true).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (registro) => {
        if (Number(registro["id_participacion"]) !== participacion || Number(registro["id_actividad_sesion"]) !== sesion || String(registro["estado"]).toUpperCase() !== estado) {
          this.guardandoMarca.set(null);
          this.requiereActualizar.set(true);
          this.errorOperacion.set("No se pudo verificar la marca guardada. Actualiza la consulta antes de intentar otra operaci\xF3n.");
          return;
        }
        this.incorporarMarca(registro);
        this.guardandoMarca.set(null);
        this.aviso.set("Asistencia confirmada por Laravel.");
        this.registroGuardado.emit();
      },
      error: (error) => {
        this.guardandoMarca.set(null);
        this.requiereActualizar.set(true);
        const campos = Object.values(error.errores ?? {}).flat().join(" ");
        this.errorOperacion.set(`${recibido ? "Laravel recibi\xF3 la marca, pero no se pudo confirmar su consulta. " : ""}${error.status ? `HTTP ${error.status}. ` : ""}${error.mensaje || aErrorApi(error).mensaje} ${campos}`.trim());
      }
    });
  }
  confirmarMarca(marca, alRecibir) {
    const escritura = marca.asistencia ? this.api.actualizar("attendance", marca.asistencia, { estado: marca.estado }) : this.api.crear("attendance", { id_participacion: marca.participacion, id_actividad_sesion: marca.sesion, estado: marca.estado });
    return escritura.pipe(switchMap((registro) => {
      alRecibir?.();
      const id = Number(registro["id_asistencia"] ?? registro["ID_ASISTENCIA"]);
      if (!Number.isSafeInteger(id) || id < 1)
        throw new Error("Laravel no devolvi\xF3 el identificador de la asistencia.");
      return this.api.obtener("attendance", id);
    }), map((registro) => {
      if (Number(registro["id_participacion"]) !== marca.participacion || Number(registro["id_actividad_sesion"]) !== marca.sesion || String(registro["estado"]).toUpperCase() !== marca.estado) {
        throw new Error("No se pudo verificar la marca guardada. Actualiza la consulta antes de reintentar.");
      }
      return registro;
    }));
  }
  incorporarMarca(registro) {
    this.catalogosSesiones.asistencias = [...this.catalogosSesiones.asistencias.filter((m) => Number(m["id_asistencia"]) !== Number(registro["id_asistencia"])), registro];
    this.actualizarPaginaContextual();
  }
  actualizarPaginaContextual() {
    this.pagina.set(this.catalogosSesiones.paginar(this.filtrosSesiones.getRawValue(), true, this.numeroPagina, this.cantidad()));
  }
  guardarSeleccion() {
    const marcas = this.pendientesSesion();
    if (!this.puedeGuardarAsistencia())
      return;
    const filas = this.catalogosSesiones.matriz(this.filtrosSesiones.controls.actividad.value, this.filtrosSesiones.controls.sesion.value);
    if (marcas.some((m) => !filas.some((f) => Number(f["id_participacion"]) === m.participacion && Number(f["id_asistencia"] || 0) === (m.asistencia || 0) && !f["duplicada"]))) {
      this.requiereActualizar.set(true);
      this.errorOperacion.set("Actualiza la asistencia antes de guardar: hay registros que requieren regularizaci\xF3n.");
      return;
    }
    this.guardandoSeleccion.set(true);
    this.errorOperacion.set(null);
    this.aviso.set(null);
    this.erroresMarcas.set({});
    let confirmadas = 0;
    let fallidas = 0;
    this.marcacion = from(marcas).pipe(concatMap((marca) => defer(() => {
      this.guardandoMarca.set(marca.participacion);
      return this.confirmarMarca(marca).pipe(tap((registro) => {
        this.incorporarMarca(registro);
        confirmadas++;
        this.marcasPendientes.update((actuales) => actuales.filter((m) => m.participacion !== marca.participacion || m.sesion !== marca.sesion));
      }), catchError((error) => {
        fallidas++;
        this.requiereActualizar.set(true);
        const mensaje = `${error.status ? `HTTP ${error.status}. ` : ""}${error.mensaje || aErrorApi(error).mensaje} ${Object.values(error.errores ?? {}).flat().join(" ")}`.trim();
        this.erroresMarcas.update((errores) => __spreadProps(__spreadValues({}, errores), { [this.claveMarca(marca.participacion, marca.sesion)]: mensaje }));
        return of(null);
      }));
    })), takeUntilDestroyed(this.destroyRef)).subscribe({ complete: () => {
      this.guardandoMarca.set(null);
      this.guardandoSeleccion.set(false);
      if (confirmadas + fallidas !== marcas.length)
        return;
      if (fallidas)
        this.errorOperacion.set(`${confirmadas} marcas confirmadas; ${fallidas} sin confirmar. Actualiza la asistencia antes de reintentar.`);
      else
        this.aviso.set(`${confirmadas} marcas confirmadas por Laravel.`);
      this.asistenciasActualizadas.emit(this.catalogosSesiones.asistencias);
      if (confirmadas)
        this.registroGuardado.emit();
      if (confirmadas && this.recargarTrasGuardar())
        this.actualizarAsistencia(true);
    } });
  }
  actualizarAsistencia(conservarResultado = false) {
    if (this.estaGuardando())
      return;
    if (this.enDetalle() && this.datosContexto()) {
      this.requiereActualizar.set(true);
      this.cargando.set(true);
      this.errorCarga.set(null);
      this.carga?.unsubscribe();
      this.carga = this.api.listarTodos("attendance").pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (registros) => {
          this.catalogosSesiones.asistencias = registros;
          this.marcasPendientes.update((marcas) => marcas.flatMap((m) => {
            const existente = registros.find((r) => Number(r["id_participacion"]) === m.participacion && Number(r["id_actividad_sesion"]) === m.sesion);
            if (!existente)
              return [m];
            return existente["estado"] === m.estado ? [] : [__spreadProps(__spreadValues({}, m), { asistencia: Number(existente["id_asistencia"]) })];
          }));
          this.requiereActualizar.set(false);
          if (!conservarResultado) {
            this.erroresMarcas.set({});
            this.errorOperacion.set(null);
          }
          this.cargando.set(false);
          this.actualizarPaginaContextual();
          this.asistenciasActualizadas.emit(registros);
        },
        error: (error) => {
          this.cargando.set(false);
          this.errorCarga.set(error.mensaje || aErrorApi(error).mensaje);
        }
      });
      return;
    }
    this.actualizandoMarcas = true;
    this.catalogosSesiones.invalidar();
    this.cargar(this.numeroPagina);
  }
  controlarAsistencia(registro) {
    void this.router.navigate(["/certificaciones/sesiones-asistencia"], { queryParams: { id_actividad: registro["id_actividad"], id_sesion: registro["id_actividad_sesion"], pestana: "asistencias" } });
  }
  marcarAsistencia(registro, evento) {
    if (this.estaGuardando() || this.requiereActualizar() || this.soloLecturaSesion() || this.borrador(registro))
      return;
    const check = evento.target;
    if (check instanceof HTMLInputElement)
      check.checked = false;
    if (registro["duplicada"] || !this.permitido(registro["id_asistencia"] ? "editar" : "crear"))
      return;
    this.asistenciaContexto.set({ id_participacion: Number(registro["id_participacion"]), id_actividad_sesion: Number(registro["id_actividad_sesion"]), nombre: String(registro["participanteNombre"]) });
    this.abrirFormulario(registro["id_asistencia"] ? Number(registro["id_asistencia"]) : null, evento);
  }
  resultadoAsistencia(registro) {
    if (this.enDetalle() && this.borrador(registro))
      return `${this.presenciaMostrada(registro) === "presente" ? "Presente" : "Ausente"} \xB7 Sin guardar`;
    return { presente: "Presente", ausente: "Ausente", pendiente: "Pendiente", sin_clasificar: "Sin clasificar: requiere regularizaci\xF3n", duplicada: "Revisar registros duplicados" }[resultadoPresencia(registro)];
  }
  soloLecturaSesion() {
    return this.soloLectura() || this.recurso() === "attendance" && this.catalogosSesiones.sesiones.some((s) => String(s["id_actividad_sesion"]) === this.filtrosSesiones.controls.sesion.value && s["estado"] === "Finalizada");
  }
  recurso = input.required();
  enDetalle = input(false);
  registroGuardado = output();
  tituloEncabezado = input("");
  nuevoUrl = input(null);
  editarBase = input(null);
  detalleBase = input(null);
  filtrosFijos = input({});
  soloLectura = input(false);
  formularioModal = input(false);
  clasificacion = input(false);
  estadoInicial = input(null);
  reinicioNavegacion = input(0);
  actividadContexto = input(null);
  actividadFormulario = signal(null);
  numeroPagina = 1;
  api = inject(EmisionCertificadosService);
  auth = inject(AuthService);
  destroyRef = inject(DestroyRef);
  plataforma = inject(PLATFORM_ID);
  documento = inject(DOCUMENT);
  injector = inject(Injector);
  modal = viewChild.required("modalRegistro");
  elementoModal = viewChild.required("modalRegistro", { read: ElementRef });
  formulario = viewChild(FormularioEmisionComponent);
  overflowAnterior = null;
  disparador = null;
  usaModal = computed(() => this.recurso() === "activity-session" || this.recurso() === "attendance");
  mostrarModal = computed(() => this.usaModal() || this.formularioModal());
  tituloModal = computed(() => this.registrandoSesion() ? "Registrar sesi\xF3n" : (this.editar() === null ? "Nuevo registro - " : "Editar - ") + this.config().titulo);
  confirmacion = viewChild.required(DialogoConfirmacionComponent);
  carga;
  detalleCarga;
  config = computed(() => CONFIGURACION_EMISION[this.recurso()]);
  editable = computed(() => {
    const recurso = this.recurso();
    return esEditable(recurso) ? recurso : null;
  });
  pagina = signal(null);
  cargando = signal(false);
  errorCarga = signal(null);
  aviso = signal(null);
  errorOperacion = signal(null);
  eliminando = signal(false);
  editar = signal(void 0);
  detalle = signal(null);
  cargandoDetalle = signal(false);
  relaciones = signal({});
  errorRelaciones = signal({});
  relacionesCarga = new Subscription();
  filtro = inject(NonNullableFormBuilder).group({ campo: [""], valor: [""] });
  catalogosSesiones = inject(SesionesAsistenciaListado);
  filtrosSesiones = inject(NonNullableFormBuilder).group(__spreadValues({}, FILTROS_SESIONES_VACIOS));
  cantidad = signal(10);
  esClasificacion = computed(() => this.clasificacion() && ["ativicty-type", "participation-type", "tipos-certificado"].includes(this.recurso()));
  catalogoClasificacion = inject(ClasificacionesListado);
  filtrosClasificacion = inject(NonNullableFormBuilder).group({ nombre: "", estado: "" });
  estadosClasificaciones = ESTADOS_CLASIFICACIONES;
  limpiarClasificacion() {
    this.filtrosClasificacion.reset();
    this.cargar(1);
  }
  opcionesEstado = computed(() => this.recurso() === "attendance" ? ESTADOS_ASISTENCIAS : ESTADOS_SESIONES.filter((estado) => estado.valor !== "cerrado"));
  aplicarFiltros() {
    const { actividad, sesion } = this.filtrosSesiones.getRawValue();
    const parametros = this.route.snapshot.queryParamMap;
    const cambios = this.actividadContexto() ? { id_sesion: sesion || null } : { actividad_filtro: actividad || null, sesion_filtro: sesion || null };
    if (!this.enDetalle() && Object.entries(cambios).some(([clave, valor]) => parametros.get(clave) !== valor)) {
      void this.router.navigate([], { relativeTo: this.route, queryParamsHandling: "merge", replaceUrl: true, queryParams: cambios });
    }
    this.cargar(1);
  }
  cambiarActividad() {
    this.filtrosSesiones.controls.sesion.setValue("");
    this.aplicarFiltros();
  }
  limpiarFiltros() {
    const sesion = this.enDetalle() ? this.filtrosSesiones.controls.sesion.value : "";
    this.filtrosSesiones.reset(__spreadProps(__spreadValues({}, FILTROS_SESIONES_VACIOS), { actividad: this.actividadContexto() ? String(this.actividadContexto().id_actividad) : "", sesion }));
    this.aplicarFiltros();
  }
  cambiarCantidad(valor) {
    const cantidad = Number(valor);
    if (![5, 10, 50].includes(cantidad))
      return;
    this.cantidad.set(cantidad);
    this.cargar(1);
  }
  tituloColumna(nombre, titulo) {
    if (!this.usaModal())
      return titulo;
    return nombre === "nombre" ? "Nombre de sesi\xF3n" : nombre === "id_participacion" ? "Participante" : titulo;
  }
  inicioRango(pagina) {
    return pagina.total ? (pagina.current_page - 1) * pagina.per_page + 1 : 0;
  }
  finRango(pagina) {
    return pagina.total ? this.inicioRango(pagina) + pagina.data.length - 1 : 0;
  }
  constructor() {
    this.destroyRef.onDestroy(() => this.restaurarDesplazamiento());
    afterNextRender(() => {
      const dialogo = this.elementoModal().nativeElement.querySelector("dialog");
      const cancelar = (evento) => {
        evento.preventDefault();
        this.cerrarFormulario();
      };
      dialogo.addEventListener("cancel", cancelar);
      this.destroyRef.onDestroy(() => dialogo.removeEventListener("cancel", cancelar));
    });
  }
  ngOnChanges(cambios) {
    const cambioActividad = cambios["actividadContexto"];
    const mismoId = !cambioActividad || cambioActividad.previousValue?.id_actividad === cambioActividad.currentValue?.id_actividad;
    if (this.inicializado && this.enDetalle() && this.datosContexto() && mismoId && Object.keys(cambios).every((clave) => ["datosContexto", "soloLectura", "actividadContexto", "accionesExternas", "recargarTrasGuardar"].includes(clave))) {
      this.catalogosSesiones.usarContexto(this.datosContexto());
      this.actualizarPaginaContextual();
      return;
    }
    const mismaActividad = this.inicializado && this.enDetalle() && mismoId && !cambios["recurso"];
    if (!mismaActividad) {
      this.marcasPendientes.set([]);
      this.erroresMarcas.set({});
    }
    this.marcacion?.unsubscribe();
    this.guardandoMarca.set(null);
    this.guardandoSeleccion.set(false);
    this.registrandoSesion.set(false);
    if (!mismaActividad)
      this.requiereActualizar.set(false);
    this.actualizandoMarcas = false;
    this.inicializado = true;
    this.asistenciaContexto.set(null);
    if (this.overflowAnterior !== null) {
      this.modal().cerrar();
      this.restaurarDesplazamiento();
    }
    this.editar.set(void 0);
    this.detalle.set(null);
    const reinicio = cambios["reinicioNavegacion"];
    const estado = reinicio && !reinicio.firstChange ? null : this.estadoInicial();
    if (this.enDetalle() && this.datosContexto())
      this.catalogosSesiones.usarContexto(this.datosContexto());
    else
      this.catalogosSesiones.invalidar();
    this.catalogoClasificacion.invalidar();
    this.filtrosClasificacion.reset();
    this.filtrosSesiones.reset(estado?.filtrosSesiones ?? FILTROS_SESIONES_VACIOS, { emitEvent: false });
    if (this.actividadContexto()) {
      this.filtrosSesiones.controls.actividad.setValue(String(this.actividadContexto().id_actividad), { emitEvent: false });
      this.filtrosSesiones.controls.actividad.disable({ emitEvent: false });
    } else
      this.filtrosSesiones.controls.actividad.enable({ emitEvent: false });
    this.cantidad.set(estado?.cantidad ?? 10);
    if (estado)
      this.filtro.patchValue({ campo: estado.campo, valor: estado.valor }, { emitEvent: false });
    if (isPlatformBrowser(this.plataforma))
      this.cargar(estado?.pagina ?? 1);
  }
  /** Solo estado de navegación; los registros siempre se vuelven a consultar con sus permisos. */
  obtenerEstadoNavegacion() {
    return __spreadProps(__spreadValues({}, this.filtro.getRawValue()), {
      pagina: this.pagina()?.current_page ?? this.numeroPagina,
      filtrosSesiones: this.filtrosSesiones.getRawValue(),
      cantidad: this.cantidad()
    });
  }
  permitido(accion) {
    return this.auth.tienePermiso(`${PERMISOS_EMISION[this.recurso()]}.${accion}`);
  }
  puedeEliminar() {
    return !this.soloLecturaSesion() && esEliminable(this.recurso()) && this.permitido("eliminar");
  }
  cargar(numero = 1) {
    this.numeroPagina = numero;
    this.relacionesCarga.unsubscribe();
    this.relacionesCarga = new Subscription();
    this.relaciones.set({});
    this.errorRelaciones.set({});
    this.carga?.unsubscribe();
    this.errorCarga.set(null);
    this.pagina.set(null);
    if (!this.permitido("ver")) {
      this.errorCarga.set("No tienes permiso para consultar estos registros.");
      return;
    }
    if (this.esClasificacion()) {
      this.cargando.set(true);
      this.carga = this.catalogoClasificacion.cargar(this.recurso()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          const filtros2 = this.filtrosClasificacion.getRawValue();
          this.pagina.set(this.catalogoClasificacion.paginar(filtros2.nombre, filtros2.estado, numero, this.cantidad()));
          this.cargando.set(false);
        },
        error: (error) => {
          this.cargando.set(false);
          this.errorCarga.set(error.mensaje ?? aErrorApi(error).mensaje);
        }
      });
      return;
    }
    if (this.usaModal()) {
      this.cargando.set(true);
      this.carga = this.catalogosSesiones.cargar(this.recurso() === "attendance", this.actividadContexto()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          if (this.actualizandoMarcas) {
            this.requiereActualizar.set(false);
            this.actualizandoMarcas = false;
            this.errorOperacion.set(null);
          }
          this.pagina.set(this.catalogosSesiones.paginar(this.filtrosSesiones.getRawValue(), this.recurso() === "attendance", numero, this.cantidad()));
          this.cargando.set(false);
        },
        error: (error) => {
          this.cargando.set(false);
          this.errorCarga.set(error.mensaje ?? aErrorApi(error).mensaje);
        }
      });
      return;
    }
    const { campo, valor } = this.filtro.getRawValue();
    const filtros = { page: numero, per_page: 20 };
    if (this.config().filtros.some((filtro) => filtro.nombre === campo) && valor.trim())
      filtros[campo] = valor.trim();
    Object.assign(filtros, this.filtrosFijos());
    this.cargando.set(true);
    this.carga = this.api.listar(this.recurso(), filtros).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (pagina) => {
        this.pagina.set(pagina);
        this.cargando.set(false);
        if (pagina.data.length)
          this.cargarRelaciones();
      },
      error: (error) => {
        this.cargando.set(false);
        this.errorCarga.set(error.mensaje);
      }
    });
  }
  identificar(registro) {
    return Number(registro[this.config().clave]);
  }
  mostrar(valor) {
    return valor === null || valor === void 0 || valor === "" ? "\u2014" : typeof valor === "boolean" ? valor ? "S\xED" : "No" : String(valor);
  }
  mostrarCampo(registro, nombre) {
    if (this.esClasificacion() && nombre === "estado") {
      return ESTADOS_CLASIFICACIONES.find((opcion) => opcion.valor === estadoClasificacion(registro[nombre]))?.etiqueta ?? this.mostrar(registro[nombre]);
    }
    if (this.usaModal()) {
      if (nombre === "estado")
        return etiquetaEstado(registro[nombre], this.recurso() === "attendance");
      if (nombre === "id_actividad")
        return this.mostrar(registro["actividadNombre"]);
      if (nombre === "id_participacion")
        return this.mostrar(registro["participanteNombre"]);
      if (nombre === "id_actividad_sesion")
        return this.mostrar(registro["sesionNombre"]);
      if (nombre === "fecha") {
        const fecha = String(registro[nombre] ?? "").match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (fecha)
          return `${fecha[3]}/${fecha[2]}/${fecha[1]}`;
      }
    }
    const id = Number(registro[nombre]);
    return this.relaciones()[nombre]?.[id] ?? this.mostrar(registro[nombre]);
  }
  erroresRelaciones() {
    return Object.values(this.errorRelaciones());
  }
  cargarRelaciones() {
    for (const campo of this.config().columnas.filter((campo2) => campo2.relacion)) {
      const peticion = campo.relacion === "gestion" ? this.api.relaciones(campo.nombre) : this.api.listarTodos(campo.relacion).pipe(map((registros) => registros.map((registro) => {
        const cfg = CONFIGURACION_EMISION[campo.relacion];
        const id = Number(registro[cfg.clave]);
        return { id, texto: String(registro["nombre_tipo"] ?? registro["titulo"] ?? registro["codigo_verificacion"] ?? `Registro #${id}`) };
      })));
      this.relacionesCarga.add(peticion.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (opciones) => this.relaciones.update((actual) => __spreadProps(__spreadValues({}, actual), { [campo.nombre]: Object.fromEntries(opciones.map((opcion) => [opcion.id, opcion.texto])) })),
        error: (error) => this.errorRelaciones.update((actual) => __spreadProps(__spreadValues({}, actual), { [campo.nombre]: `${campo.titulo}: ${error.mensaje}` }))
      }));
    }
  }
  verDetalle(registro) {
    this.detalleCarga?.unsubscribe();
    this.detalle.set(null);
    this.errorOperacion.set(null);
    this.cargandoDetalle.set(true);
    this.detalleCarga = this.api.obtener(this.recurso(), this.identificar(registro)).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (detalle) => {
        this.detalle.set(detalle);
        this.cargandoDetalle.set(false);
      },
      error: (error) => {
        this.errorOperacion.set(error.mensaje);
        this.cargandoDetalle.set(false);
      }
    });
  }
  camposDetalle() {
    return [...new Map([...this.config().columnas, ...this.config().campos].filter((campo) => !["passphrase", "ruta_archivo", "ruta_archivo_pfx"].includes(campo.nombre)).map((campo) => [campo.nombre, campo])).values()];
  }
  alGuardar(registro) {
    if (this.enDetalle() && this.recurso() === "attendance" && registro) {
      this.cerrarFormulario();
      this.incorporarMarca(registro);
      this.aviso.set("Cambios guardados.");
      this.asistenciasActualizadas.emit(this.catalogosSesiones.asistencias);
      this.registroGuardado.emit();
      if (this.recargarTrasGuardar())
        this.actualizarAsistencia(true);
      return;
    }
    this.catalogoClasificacion.invalidar();
    this.catalogosSesiones.invalidar();
    this.cerrarFormulario();
    this.detalle.set(null);
    this.aviso.set("Cambios guardados.");
    this.cargar(1);
    this.registroGuardado.emit();
  }
  abrirFormulario(id, evento) {
    const seleccion = this.catalogosSesiones.actividades.find((a) => String(a["id_actividad"]) === this.filtrosSesiones.controls.actividad.value);
    this.actividadFormulario.set(this.actividadContexto() ?? (seleccion ? { id_actividad: Number(seleccion["id_actividad"]), nombre: String(seleccion["nombre"]) } : null));
    if (this.mostrarModal()) {
      if (this.editar() !== void 0 || this.eliminando())
        return;
      this.aviso.set(null);
      this.errorOperacion.set(null);
      this.detalleCarga?.unsubscribe();
      this.detalle.set(null);
      this.cargandoDetalle.set(false);
    }
    this.editar.set(id);
    if (this.mostrarModal()) {
      this.disparador = evento?.currentTarget ?? this.documento.activeElement;
      this.overflowAnterior = this.documento.body.style.overflow;
      this.documento.body.style.overflow = "hidden";
      this.modal().abrir();
    }
  }
  cerrarFormulario() {
    if (this.formulario()?.enviando())
      return;
    if (!this.mostrarModal()) {
      this.editar.set(void 0);
      return;
    }
    this.modal().cerrar();
    this.alCerrarModal();
    afterNextRender(() => {
      if (this.editar() === void 0)
        this.modal().cerrar();
    }, { injector: this.injector });
  }
  alCerrarModal() {
    if (this.editar() === void 0 || this.elementoModal().nativeElement.querySelector("dialog")?.open)
      return;
    this.editar.set(void 0);
    this.asistenciaContexto.set(null);
    this.registrandoSesion.set(false);
    this.restaurarDesplazamiento();
    const disparador = this.disparador;
    this.disparador = null;
    afterNextRender(() => {
      if (disparador?.isConnected)
        disparador.focus();
    }, { injector: this.injector });
  }
  restaurarDesplazamiento() {
    if (this.overflowAnterior === null)
      return;
    this.documento.body.style.overflow = this.overflowAnterior;
    this.overflowAnterior = null;
  }
  eliminar(registro) {
    return __async(this, null, function* () {
      const recurso = this.recurso();
      if (this.eliminando() || !this.puedeEliminar() || !esEliminable(recurso))
        return;
      if (!(yield this.confirmacion().abrir()))
        return;
      this.eliminando.set(true);
      this.errorOperacion.set(null);
      this.api.eliminar(recurso, this.identificar(registro)).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          this.catalogoClasificacion.invalidar();
          this.catalogosSesiones.invalidar();
          this.eliminando.set(false);
          this.detalle.set(null);
          this.aviso.set("Registro eliminado.");
          this.cargar(1);
        },
        error: (error) => {
          this.eliminando.set(false);
          this.errorOperacion.set(error.mensaje);
        }
      });
    });
  }
  static \u0275fac = function ListadoEmisionComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ListadoEmisionComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ListadoEmisionComponent, selectors: [["app-listado-emision"]], viewQuery: function ListadoEmisionComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuerySignal(ctx.modal, _c0, 5);
      \u0275\u0275viewQuerySignal(ctx.elementoModal, _c0, 5, ElementRef);
      \u0275\u0275viewQuerySignal(ctx.formulario, FormularioEmisionComponent, 5);
      \u0275\u0275viewQuerySignal(ctx.confirmacion, DialogoConfirmacionComponent, 5);
    }
    if (rf & 2) {
      \u0275\u0275queryAdvance(4);
    }
  }, hostVars: 2, hostBindings: function ListadoEmisionComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275classProp("clasificacion", ctx.esClasificacion());
    }
  }, inputs: { datosContexto: [1, "datosContexto"], accionesExternas: [1, "accionesExternas"], paginaCompleta: [1, "paginaCompleta"], recargarTrasGuardar: [1, "recargarTrasGuardar"], recurso: [1, "recurso"], enDetalle: [1, "enDetalle"], tituloEncabezado: [1, "tituloEncabezado"], nuevoUrl: [1, "nuevoUrl"], editarBase: [1, "editarBase"], detalleBase: [1, "detalleBase"], filtrosFijos: [1, "filtrosFijos"], soloLectura: [1, "soloLectura"], formularioModal: [1, "formularioModal"], clasificacion: [1, "clasificacion"], estadoInicial: [1, "estadoInicial"], reinicioNavegacion: [1, "reinicioNavegacion"], actividadContexto: [1, "actividadContexto"] }, outputs: { asistenciasActualizadas: "asistenciasActualizadas", registroGuardado: "registroGuardado" }, standalone: true, features: [\u0275\u0275ProvidersFeature([SesionesAsistenciaListado, ClasificacionesListado]), \u0275\u0275NgOnChangesFeature, \u0275\u0275StandaloneFeature], decls: 21, vars: 13, consts: [["modalRegistro", ""], ["role", "status"], [1, "encabezado", "encabezado-registro"], [1, "nota"], ["role", "status", 1, "alert", "alert-exito"], ["role", "alert", 1, "alert", "alert-error"], ["role", "alert", 1, "alert", "alert-advertencia"], ["role", "search", 1, "filtros", "filtros-clasificacion", 3, "formGroup"], ["role", "search", 1, "filtros", "filtros-sesiones", 3, "formGroup"], ["role", "search", 1, "filtros", 3, "formGroup"], ["aria-label", "Detalle del registro", 1, "card", "detalle"], ["titulo", "Eliminar registro", "texto", "\xBFDeseas eliminar este registro? Si tiene dependencias hist\xF3ricas, la operaci\xF3n ser\xE1 rechazada.", "confirmar", "Eliminar"], [1, "modal-registro", 3, "cerrado", "titulo"], ["type", "button", 1, "btn", "btn-primary", 3, "disabled"], ["type", "button", 1, "btn", "btn-primary", 3, "click", "disabled"], ["aria-hidden", "true", 1, "material-symbols-outlined"], [1, "acciones"], [3, "recurso", "id"], [1, "btn", "btn-primary", 3, "routerLink"], ["type", "button", 1, "btn", "btn-primary"], ["type", "button", 1, "btn", "btn-primary", 3, "click"], [3, "guardado", "cancelar", "recurso", "id"], ["role", "search", 1, "filtros", "filtros-clasificacion", 3, "ngSubmit", "formGroup"], [1, "form-field"], [3, "for"], ["type", "search", "formControlName", "nombre", "placeholder", "Nombre del tipo", 1, "input", 3, "input", "id"], ["formControlName", "estado", 1, "input", 3, "change", "id"], ["value", ""], [3, "value"], ["type", "button", 1, "btn", "btn-neutro", 3, "click"], ["role", "search", 1, "filtros", "filtros-sesiones", 3, "ngSubmit", "formGroup"], ["formControlName", "nombre", 1, "input", 3, "input", "id", "placeholder"], [3, "hidden", "for"], ["formControlName", "actividad", 1, "input", 3, "change", "hidden", "id"], [1, "form-field", 3, "hidden"], ["for", "attendance-buscar-sesion"], ["id", "attendance-buscar-sesion", "formControlName", "sesion", 1, "input", 3, "change"], ["for", "activity-session-buscar-fecha"], ["id", "activity-session-buscar-fecha", "type", "date", "formControlName", "fecha", 1, "input", 3, "input"], ["role", "search", 1, "filtros", 3, "ngSubmit", "formGroup"], ["formControlName", "campo", 1, "input", 3, "id"], ["formControlName", "valor", 1, "input", 3, "id"], ["type", "submit", 1, "btn", "btn-consulta", 3, "disabled"], ["type", "button", 1, "btn", "btn-neutro", 3, "click", "disabled"], ["type", "button", 1, "btn", 3, "click"], ["aria-label", "Paginaci\xF3n", 1, "paginacion"], [1, "card"], [1, "tabla"], ["type", "button", 1, "btn", 3, "click", "disabled"], ["aria-label", "Resumen de la sesi\xF3n", "aria-live", "polite", 1, "resumen-asistencia"], ["role", "alert"], ["type", "button", 1, "btn", 3, "disabled"], ["role", "group", "aria-label", "Guardar selecci\xF3n de asistencia", 1, "acciones", "guardado-asistencia"], [1, "table", "tabla-presencia"], [1, "sr-only"], ["scope", "col", 1, "col-centro"], ["scope", "col"], [1, "col-centro"], ["scope", "row"], ["type", "button", "title", "Marcar presente", 1, "circulo-asistencia", "circulo-presente", 3, "click", "disabled"], ["viewBox", "0 0 24 24", "aria-hidden", "true"], ["d", "m5 12 4 4L19 6"], ["type", "button", "title", "Marcar ausente", 1, "circulo-asistencia", "circulo-ausente", 3, "click", "disabled"], ["d", "m6 6 12 12M18 6 6 18"], [1, "salida-pendiente"], ["role", "alert", 1, "error-text"], [1, "detalle-asistencia"], ["type", "checkbox", 3, "change", "checked", "disabled"], [1, "table"], ["type", "button", 1, "btn"], ["aria-label", "Ver detalle", "title", "Ver detalle", 1, "btn", "btn-icono", 3, "routerLink"], ["type", "button", "aria-label", "Ver detalle", "title", "Ver detalle", 1, "btn", "btn-icono"], ["type", "button", "aria-label", "Eliminar", "title", "Eliminar", 1, "btn", "btn-danger", "btn-icono", 3, "disabled"], [1, "badge", 3, "badge-exito"], [1, "badge"], ["type", "button", "aria-label", "Ver detalle", "title", "Ver detalle", 1, "btn", "btn-icono", 3, "click"], ["aria-label", "Editar", "title", "Editar", 1, "btn", "btn-icono", 3, "routerLink"], ["type", "button", "aria-label", "Editar", "title", "Editar", 1, "btn", "btn-icono"], ["type", "button", "aria-label", "Editar", "title", "Editar", 1, "btn", "btn-icono", 3, "click"], ["type", "button", "aria-label", "Eliminar", "title", "Eliminar", 1, "btn", "btn-danger", "btn-icono", 3, "click", "disabled"], [1, "form-field", "cantidad-sesiones"], [1, "input", 3, "change", "id", "value"], ["value", "5"], ["value", "10"], ["value", "50"], ["aria-live", "polite"], [3, "recurso", "id", "enDialogo", "clasificacion", "actividadContexto", "asistenciaContexto"], [3, "guardado", "cancelar", "recurso", "id", "enDialogo", "clasificacion", "actividadContexto", "asistenciaContexto"]], template: function ListadoEmisionComponent_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275template(0, ListadoEmisionComponent_Conditional_0_Template, 2, 0, "p", 1)(1, ListadoEmisionComponent_Conditional_1_Template, 4, 2, "div", 2)(2, ListadoEmisionComponent_Conditional_2_Template, 2, 1, "p", 3)(3, ListadoEmisionComponent_Conditional_3_Template, 2, 1, "p", 4)(4, ListadoEmisionComponent_Conditional_4_Template, 2, 1, "p", 5);
      \u0275\u0275repeaterCreate(5, ListadoEmisionComponent_For_6_Template, 2, 1, "p", 6, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275template(7, ListadoEmisionComponent_Conditional_7_Template, 2, 2)(8, ListadoEmisionComponent_Conditional_8_Template, 15, 6, "form", 7)(9, ListadoEmisionComponent_Conditional_9_Template, 26, 14, "form", 8)(10, ListadoEmisionComponent_Conditional_10_Template, 17, 8, "form", 9);
      \u0275\u0275elementStart(11, "div");
      \u0275\u0275template(12, ListadoEmisionComponent_Conditional_12_Template, 2, 0, "p", 1)(13, ListadoEmisionComponent_Conditional_13_Template, 4, 1)(14, ListadoEmisionComponent_Conditional_14_Template, 1, 1);
      \u0275\u0275elementEnd();
      \u0275\u0275template(15, ListadoEmisionComponent_Conditional_15_Template, 2, 0, "p", 1)(16, ListadoEmisionComponent_Conditional_16_Template, 8, 1, "section", 10);
      \u0275\u0275element(17, "app-dialogo-confirmacion", 11);
      \u0275\u0275elementStart(18, "app-dialogo", 12, 0);
      \u0275\u0275listener("cerrado", function ListadoEmisionComponent_Template_app_dialogo_cerrado_18_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.alCerrarModal());
      });
      \u0275\u0275template(20, ListadoEmisionComponent_Conditional_20_Template, 1, 1);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_4_0;
      let tmp_5_0;
      let tmp_7_0;
      let tmp_12_0;
      \u0275\u0275conditional(ctx.recurso() === "attendance" && ctx.soloLecturaSesion() && !ctx.paginaCompleta() ? 0 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.mostrarModal() && !ctx.enDetalle() ? 1 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.config().aviso ? 2 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_4_0 = ctx.aviso()) ? 3 : -1, tmp_4_0);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_5_0 = ctx.errorOperacion()) ? 4 : -1, tmp_5_0);
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.erroresRelaciones());
      \u0275\u0275advance(2);
      \u0275\u0275conditional((tmp_7_0 = ctx.editable()) ? 7 : -1, tmp_7_0);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.esClasificacion() ? 8 : ctx.usaModal() && !ctx.enDetalle() ? 9 : !ctx.enDetalle() ? 10 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275attribute("aria-busy", ctx.cargando());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.cargando() ? 12 : ctx.errorCarga() ? 13 : 14);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.cargandoDetalle() ? 15 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_12_0 = ctx.detalle()) ? 16 : -1, tmp_12_0);
      \u0275\u0275advance(2);
      \u0275\u0275property("titulo", ctx.tituloModal());
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.mostrarModal() && ctx.editar() !== void 0 ? 20 : -1);
    }
  }, dependencies: [RouterLink, ReactiveFormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, FormularioEmisionComponent, DialogoConfirmacionComponent, DialogoComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.encabezado[_ngcontent-%COMP%], \n.acciones[_ngcontent-%COMP%], \n.paginacion[_ngcontent-%COMP%], \n.filtros[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: var(--espacio-3);\n}\n.encabezado[_ngcontent-%COMP%] {\n  justify-content: space-between;\n  margin-bottom: var(--espacio-4);\n}\n.acciones[_ngcontent-%COMP%], \n.filtros[_ngcontent-%COMP%], \n.paginacion[_ngcontent-%COMP%] {\n  margin-block: var(--espacio-4);\n}\n.tabla[_ngcontent-%COMP%] {\n  overflow-x: auto;\n}\n.grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));\n  gap: var(--espacio-4);\n}\n.form-field[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.detalle[_ngcontent-%COMP%] {\n  margin-block: var(--espacio-5);\n}\ndt[_ngcontent-%COMP%] {\n  color: var(--neutro-500);\n  font-size: 0.875rem;\n}\ndd[_ngcontent-%COMP%] {\n  margin: 0 0 var(--espacio-3);\n  overflow-wrap: anywhere;\n}\n.nota[_ngcontent-%COMP%] {\n  color: var(--neutro-700);\n  font-size: 0.875rem;\n}\n.table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  overflow-wrap: anywhere;\n}\n.errores[_ngcontent-%COMP%] {\n  color: var(--color-error);\n}\n.reconocimiento[_ngcontent-%COMP%] {\n  border-top: 3px solid var(--boton-dorado);\n  overflow-wrap: anywhere;\n}\n.reconocimiento[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin-top: var(--espacio-4);\n  font-size: 1.25rem;\n}\n/*# sourceMappingURL=emision.css.map */", "\n\n.encabezado-registro[_ngcontent-%COMP%] {\n  align-items: baseline;\n  margin-bottom: var(--espacio-5);\n}\n.encabezado-registro[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.encabezado-registro[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n  margin-left: auto;\n}\n[_nghost-%COMP%]     app-dialogo.modal-registro > dialog.dialogo {\n  width: min(48rem, 100vw - 2 * var(--espacio-4));\n  max-height: calc(100dvh - 2 * var(--espacio-4));\n  overflow-y: auto;\n  overscroll-behavior: contain;\n}\n[_nghost-%COMP%]     app-dialogo.modal-registro > dialog.dialogo app-formulario-emision fieldset.card {\n  min-width: 0;\n  margin: 0;\n  padding: 0;\n  border: 0;\n  box-shadow: none;\n}\n[_nghost-%COMP%]     app-dialogo.modal-registro > dialog.dialogo app-formulario-emision .acciones {\n  justify-content: flex-end;\n  margin-bottom: 0;\n}\n[_nghost-%COMP%]     app-dialogo.modal-registro > dialog.dialogo app-formulario-emision .acciones button[type=submit] {\n  order: 1;\n}\n/*# sourceMappingURL=sesiones-asistencia-modal.css.map */", "\n\n.filtros-sesiones[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr)) auto;\n  align-items: end;\n  gap: var(--espacio-3);\n}\n.filtros-sesiones[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.filtros-sesiones[_ngcontent-%COMP%]   .input[_ngcontent-%COMP%], \n.filtros-sesiones[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n  height: var(--alto-control);\n  box-sizing: border-box;\n}\n.filtros-sesiones[_ngcontent-%COMP%]   .input[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n}\n.filtros-sesiones[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n  margin: 0;\n  white-space: nowrap;\n}\n@media (max-width: 64rem) {\n  .filtros-sesiones[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n@media (max-width: 36rem) {\n  .filtros-sesiones[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n  }\n}\n.cantidad-sesiones[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: var(--espacio-3);\n}\n.cantidad-sesiones[_ngcontent-%COMP%]   select[_ngcontent-%COMP%] {\n  width: auto;\n}\n[_nghost-%COMP%]   .circulo-asistencia[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 2rem;\n  height: 2rem;\n  border: 2px solid currentColor;\n  border-radius: 50%;\n  background: white;\n  cursor: pointer;\n}\n[_nghost-%COMP%]   .circulo-asistencia[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 1.1rem;\n  height: 1.1rem;\n  fill: none;\n  stroke: currentColor;\n  stroke-width: 2.5;\n  stroke-linecap: round;\n  stroke-linejoin: round;\n}\n[_nghost-%COMP%]   .circulo-asistencia[_ngcontent-%COMP%]:focus-visible {\n  outline: 3px solid #075a9b;\n  outline-offset: 3px;\n}\n[_nghost-%COMP%]   .circulo-asistencia[_ngcontent-%COMP%]:disabled {\n  cursor: default;\n}\n[_nghost-%COMP%]   .circulo-presente[_ngcontent-%COMP%] {\n  color: #24713b;\n}\n[_nghost-%COMP%]   .circulo-presente.seleccionado[_ngcontent-%COMP%] {\n  color: white;\n  background: #24713b;\n  border-color: #24713b;\n}\n[_nghost-%COMP%]   .circulo-ausente[_ngcontent-%COMP%] {\n  color: #b3261e;\n}\n[_nghost-%COMP%]   .circulo-ausente.seleccionado[_ngcontent-%COMP%] {\n  color: white;\n  background: #b3261e;\n  border-color: #b3261e;\n}\n[_nghost-%COMP%]   .circulo-asistencia[_ngcontent-%COMP%]:disabled:not(.seleccionado) {\n  opacity: 0.5;\n}\n.resumen-asistencia[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 1rem;\n  padding: 0.75rem;\n  border: 1px solid var(--neutro-200);\n  border-radius: var(--radio-lg);\n}\n.resumen-asistencia[_ngcontent-%COMP%]   dt[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n}\n.resumen-asistencia[_ngcontent-%COMP%]   dd[_ngcontent-%COMP%] {\n  margin: 0;\n  font-weight: 700;\n}\n.detalle-asistencia[_ngcontent-%COMP%] {\n  margin-top: 0.5rem;\n  max-width: 28rem;\n}\n.detalle-asistencia[_ngcontent-%COMP%]   summary[_ngcontent-%COMP%] {\n  cursor: pointer;\n  color: #075a9b;\n}\n.detalle-asistencia[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: inline-flex;\n  gap: 0.35rem;\n  margin-right: 0.75rem;\n}\n.detalle-asistencia[_ngcontent-%COMP%]   dd[_ngcontent-%COMP%] {\n  margin: 0 0 0.4rem;\n}\n.guardado-asistencia[_ngcontent-%COMP%] {\n  margin: 0.75rem 0;\n}\n.guardado-asistencia[_ngcontent-%COMP%]   .btn-primary[_ngcontent-%COMP%] {\n  background: #d6ad4a;\n  color: #192b3c;\n  border-color: #b38a2c;\n}\n[_nghost-%COMP%] {\n  min-width: 0;\n}\n.tabla-presencia[_ngcontent-%COMP%] {\n  width: 100%;\n  table-layout: fixed;\n}\n.tabla-presencia[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], \n.tabla-presencia[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 0.65rem 0.5rem;\n  vertical-align: middle;\n  overflow-wrap: anywhere;\n}\n.tabla-presencia[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]:first-child {\n  width: 3rem;\n}\n.tabla-presencia[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]:nth-child(3), \n.tabla-presencia[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]:nth-child(4) {\n  width: 5.5rem;\n}\n.tabla-presencia[_ngcontent-%COMP%]   .detalle-asistencia[_ngcontent-%COMP%] {\n  margin-top: 0;\n}\n@media (max-width: 700px) {\n  .tabla-presencia[_ngcontent-%COMP%] {\n    table-layout: auto;\n  }\n  .tabla-presencia[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%] {\n    position: absolute;\n    width: 1px;\n    height: 1px;\n    overflow: hidden;\n    clip-path: inset(50%);\n  }\n  .tabla-presencia[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%] {\n    display: grid;\n    gap: 0.65rem;\n  }\n  .tabla-presencia[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%] {\n    display: grid;\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n    padding: 0.5rem;\n    border: 1px solid var(--neutro-200);\n    border-radius: 0.5rem;\n  }\n  .tabla-presencia[_ngcontent-%COMP%]   td[_ngcontent-%COMP%], \n   .tabla-presencia[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n    width: auto;\n    border: 0;\n  }\n  .tabla-presencia[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:first-child {\n    grid-column: 1;\n    font-size: 0.8rem;\n  }\n  .tabla-presencia[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n    grid-column: 1/-1;\n  }\n  .tabla-presencia[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:nth-child(5), \n   .tabla-presencia[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:nth-child(6) {\n    grid-column: 1/-1;\n  }\n  .tabla-presencia[_ngcontent-%COMP%]   .detalle-asistencia[_ngcontent-%COMP%] {\n    max-width: 100%;\n  }\n}\n/*# sourceMappingURL=sesiones-asistencia-listado.css.map */", "\n\n.clasificacion[_nghost-%COMP%]   .encabezado-registro[_ngcontent-%COMP%] {\n  align-items: baseline;\n  justify-content: space-between;\n  gap: var(--espacio-3);\n}\n.clasificacion[_nghost-%COMP%]   .encabezado-registro[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n  margin-left: auto;\n}\n.clasificacion[_nghost-%COMP%]   .filtros-clasificacion[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) auto;\n  align-items: end;\n  gap: var(--espacio-3);\n}\n.clasificacion[_nghost-%COMP%]   .filtros-clasificacion[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.clasificacion[_nghost-%COMP%]   .filtros-clasificacion[_ngcontent-%COMP%]   .input[_ngcontent-%COMP%], \n.clasificacion[_nghost-%COMP%]   .filtros-clasificacion[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n  height: var(--alto-control);\n  box-sizing: border-box;\n}\n.clasificacion[_nghost-%COMP%]   .tabla[_ngcontent-%COMP%] {\n  border: 1px solid var(--neutro-200);\n  border-radius: var(--radio-lg);\n}\n.clasificacion[_nghost-%COMP%]   .table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%], \n.clasificacion[_nghost-%COMP%]   .table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  padding-block: var(--espacio-3);\n}\n.clasificacion[_nghost-%COMP%]   .table[_ngcontent-%COMP%] {\n  min-width: 40rem;\n}\n.clasificacion[_nghost-%COMP%]   .acciones[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n  white-space: nowrap;\n}\n.clasificacion[_nghost-%COMP%]   .paginacion[_ngcontent-%COMP%] {\n  justify-content: flex-end;\n}\n.clasificacion[_nghost-%COMP%]   .cantidad-sesiones[_ngcontent-%COMP%] {\n  margin-right: auto;\n}\n@media (max-width: 48rem) {\n  .clasificacion[_nghost-%COMP%]   .filtros-clasificacion[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n  }\n}\n/*# sourceMappingURL=clasificaciones.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ListadoEmisionComponent, { className: "ListadoEmisionComponent", filePath: "src\\app\\pages\\emision-certificados\\compartidos\\listado-emision.component.ts", lineNumber: 42 });
})();

export {
  FILTROS_SESIONES_VACIOS,
  ListadoEmisionComponent
};
//# sourceMappingURL=chunk-DVPHOQBJ.js.map
