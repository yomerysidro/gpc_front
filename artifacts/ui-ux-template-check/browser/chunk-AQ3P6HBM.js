import {
  FILTROS_SESIONES_VACIOS,
  ListadoEmisionComponent
} from "./chunk-DVPHOQBJ.js";
import "./chunk-QBYYVWAN.js";
import {
  DialogoConfirmacionComponent
} from "./chunk-BKELQIVX.js";
import {
  EmisionCertificadosService
} from "./chunk-4FUGVTHD.js";
import "./chunk-RJ22SAW5.js";
import "./chunk-Y2YHKMWP.js";
import {
  ActividadesService
} from "./chunk-4NQ4ZY6Y.js";
import "./chunk-4VYBOJPK.js";
import {
  ActivatedRoute,
  Router
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
import "./chunk-7PBBQCKX.js";
import {
  takeUntilDestroyed
} from "./chunk-IJ23LC2U.js";
import "./chunk-YLHEVWGL.js";
import {
  DestroyRef,
  Subject,
  catchError,
  forkJoin,
  inject,
  map,
  of,
  signal,
  startWith,
  switchMap,
  viewChild,
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
  ɵɵproperty,
  ɵɵqueryAdvance,
  ɵɵresetView,
  ɵɵresolveWindow,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate3,
  ɵɵviewQuerySignal
} from "./chunk-3ZDGBTDF.js";
import {
  __async,
  __spreadProps,
  __spreadValues
} from "./chunk-ZX6IUAQ5.js";

// src/app/pages/actividades/asistencia-sesion/asistencia-sesion.component.ts
function AsistenciaSesionComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    \u0275\u0275textInterpolate1(" \u2014 ", ctx.nombre, " ");
  }
}
function AsistenciaSesionComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx.actividad.nombre);
  }
}
function AsistenciaSesionComponent_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const actual_r1 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3("", ctx_r1.fecha(actual_r1["fecha"]), " \xB7 ", actual_r1["hora_inicio"] || "Hora no disponible", " \u2013 ", actual_r1["hora_fin"] || "Hora no disponible", "");
  }
}
function AsistenciaSesionComponent_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const actual_r3 = ctx;
    \u0275\u0275classProp("finalizada", actual_r3.estado === "Finalizada");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(actual_r3.estado);
  }
}
function AsistenciaSesionComponent_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 14);
    \u0275\u0275listener("click", function AsistenciaSesionComponent_Conditional_19_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.guardar());
    });
    \u0275\u0275text(1, "Guardar asistencia");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("disabled", !((tmp_1_0 = ctx_r1.listado()) == null ? null : tmp_1_0.puedeGuardarAsistencia()));
  }
}
function AsistenciaSesionComponent_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 9);
    \u0275\u0275text(1, "Consultando asistencia\u2026");
    \u0275\u0275elementEnd();
  }
}
function AsistenciaSesionComponent_Conditional_21_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 7);
    \u0275\u0275listener("click", function AsistenciaSesionComponent_Conditional_21_Conditional_2_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.reintentar());
    });
    \u0275\u0275text(1, "Reintentar");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r1.ocupado());
  }
}
function AsistenciaSesionComponent_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 15);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275template(2, AsistenciaSesionComponent_Conditional_21_Conditional_2_Template, 2, 1, "button", 16);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.error());
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r1.datos() ? 2 : -1);
  }
}
function AsistenciaSesionComponent_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 9);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.aviso());
  }
}
function AsistenciaSesionComponent_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10)(1, "div")(2, "span", 2);
    \u0275\u0275text(3, "groups");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span");
    \u0275\u0275text(7, "Participantes");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div")(9, "span", 2);
    \u0275\u0275text(10, "co_present");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "strong");
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "span");
    \u0275\u0275text(14, "Presentes");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "div")(16, "span", 2);
    \u0275\u0275text(17, "person_off");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "strong");
    \u0275\u0275text(19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "span");
    \u0275\u0275text(21, "Ausentes");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "div")(23, "span", 2);
    \u0275\u0275text(24, "pending_actions");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "strong");
    \u0275\u0275text(26);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "span");
    \u0275\u0275text(28, "Pendientes");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const c_r6 = ctx;
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(c_r6.participantes_sesion);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(c_r6.presentes);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(c_r6.ausentes);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(c_r6.pendientes);
  }
}
function AsistenciaSesionComponent_Conditional_24_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 17);
    \u0275\u0275text(1, "Asistencia de solo lectura.");
    \u0275\u0275elementEnd();
  }
}
function AsistenciaSesionComponent_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275template(0, AsistenciaSesionComponent_Conditional_24_Conditional_0_Template, 2, 0, "p", 17);
    \u0275\u0275elementStart(1, "app-listado-emision", 18);
    \u0275\u0275listener("registroGuardado", function AsistenciaSesionComponent_Conditional_24_Template_app_listado_emision_registroGuardado_1_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.actualizarSesion());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const contexto_r8 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r1.soloLectura() ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("paginaCompleta", true)("enDetalle", true)("accionesExternas", true)("recargarTrasGuardar", true)("soloLectura", ctx_r1.soloLectura())("estadoInicial", ctx_r1.estadoInicial())("actividadContexto", contexto_r8.actividad)("datosContexto", contexto_r8);
  }
}
var AsistenciaSesionComponent = class _AsistenciaSesionComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  api = inject(EmisionCertificadosService);
  actividades = inject(ActividadesService);
  personas = inject(PersonService);
  auth = inject(AuthService);
  listado = viewChild(ListadoEmisionComponent);
  confirmar = viewChild.required(DialogoConfirmacionComponent);
  datos = signal(null);
  sesion = signal(null);
  estadoInicial = signal(null);
  error = signal(null);
  aviso = signal(null);
  cargando = signal(true);
  actividadId = 0;
  sesionId = 0;
  confirmando;
  reintentos = new Subject();
  constructor() {
    this.route.paramMap.pipe(switchMap((parametros) => {
      this.actividadId = Number(parametros.get("idActividad"));
      this.sesionId = Number(parametros.get("idSesion"));
      return this.reintentos.pipe(startWith(void 0), switchMap(() => this.consulta()));
    }), takeUntilDestroyed()).subscribe();
  }
  consulta() {
    this.datos.set(null);
    this.sesion.set(null);
    this.error.set(null);
    this.aviso.set(null);
    this.cargando.set(true);
    if (![this.actividadId, this.sesionId].every((id) => Number.isSafeInteger(id) && id > 0)) {
      this.error.set("La actividad o la sesi\xF3n solicitada no es v\xE1lida.");
      this.cargando.set(false);
      return of(null);
    }
    if (!this.auth.tienePermiso("actividades.ver") || !this.auth.tienePermiso("participantes.ver")) {
      this.error.set("No tienes permiso para consultar esta asistencia.");
      this.cargando.set(false);
      return of(null);
    }
    return forkJoin({ actividad: this.actividades.obtener(this.actividadId), sesion: this.api.estadoSesionCertificacion(this.sesionId) }).pipe(switchMap(({ actividad, sesion }) => {
      if (actividad.id_actividad !== this.actividadId || Number(sesion.id_actividad) !== this.actividadId || Number(sesion.id_actividad_sesion) !== this.sesionId)
        throw new Error("No se pudo verificar la sesi\xF3n de esta actividad.");
      this.sesion.set(sesion);
      this.estadoInicial.set({ campo: "", valor: "", pagina: 1, filtrosSesiones: __spreadProps(__spreadValues({}, FILTROS_SESIONES_VACIOS), { actividad: String(this.actividadId), sesion: String(this.sesionId) }) });
      return forkJoin({ participaciones: this.api.listarTodos("participation"), asistencias: this.api.listarTodos("attendance"), personas: this.personas.listar().pipe(catchError(() => {
        this.aviso.set("No se pudieron consultar los nombres de los participantes.");
        return of([]);
      })) }).pipe(map(({ participaciones, asistencias, personas }) => {
        const nombres = new Map(personas.map((p) => [p.id_persona, p]));
        this.datos.set({
          actividad: { id_actividad: actividad.id_actividad, nombre: actividad.nombre },
          sesiones: [sesion],
          asistencias,
          participantes: participaciones.filter((p) => Number(p["id_actividad"]) === this.actividadId).map((p) => {
            const persona = nombres.get(Number(p["id_persona"]));
            return { id: Number(p["id_participacion"]), nombres: persona?.nombres || "Nombre no disponible", apellidos: [persona?.apellido_paterno, persona?.apellido_materno].filter(Boolean).join(" ") };
          })
        });
        this.cargando.set(false);
      }));
    }), catchError((error) => {
      this.cargando.set(false);
      this.error.set(this.mensaje(error));
      return of(null);
    }));
  }
  soloLectura() {
    return !this.sesion() || this.sesion().estado === "Finalizada" || this.sesion().finalizada === true || this.sesion().puede_editar_asistencia === false;
  }
  reintentar() {
    if (!this.ocupado())
      this.reintentos.next();
  }
  ocupado() {
    return this.cargando() || (this.listado()?.estaGuardando() ?? false);
  }
  guardar() {
    if (!this.soloLectura())
      this.listado()?.guardarAsistencia();
  }
  actualizar() {
    if (this.ocupado())
      return;
    this.listado()?.refrescarAsistencia();
    this.actualizarSesion();
  }
  actualizarSesion() {
    const actividad = this.actividadId;
    const sesion = this.sesionId;
    this.api.estadoSesionCertificacion(sesion).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (actual) => {
        if (this.sesionId !== sesion || this.actividadId !== actividad)
          return;
        if (Number(actual.id_actividad) !== actividad || Number(actual.id_actividad_sesion) !== sesion) {
          this.sesion.set(null);
          this.error.set("No se pudo verificar la sesi\xF3n de esta actividad.");
          return;
        }
        this.sesion.update((anterior) => __spreadValues(__spreadValues({}, anterior), actual));
      },
      error: (error) => {
        if (this.sesionId === sesion) {
          this.sesion.set(null);
          this.error.set(this.mensaje(error));
        }
      }
    });
  }
  volver() {
    if (!this.ocupado())
      void this.router.navigate(["/certificaciones/actividades"], { queryParams: { id_actividad: this.actividadId } });
  }
  puedeSalir() {
    return __async(this, null, function* () {
      if (this.listado()?.estaGuardando())
        return false;
      if (!this.listado()?.hayCambiosSinGuardar())
        return true;
      this.confirmando ??= this.confirmar().abrir().then((descartar) => {
        if (descartar)
          this.listado()?.descartarCambios();
        return descartar;
      }).finally(() => this.confirmando = void 0);
      return this.confirmando;
    });
  }
  antesDeSalir(evento) {
    if (this.listado()?.hayCambiosSinGuardar() || this.listado()?.estaGuardando()) {
      evento.preventDefault();
      evento.returnValue = "";
    }
  }
  fecha(valor) {
    const partes = String(valor || "").slice(0, 10).split("-");
    return partes.length === 3 ? partes.reverse().join("/") : "Fecha no disponible";
  }
  mensaje(error) {
    const api = error && typeof error === "object" && "mensaje" in error ? error : aErrorApi(error);
    return `${api.status ? "HTTP " + api.status + ". " : ""}${error instanceof Error ? error.message : api.mensaje}`;
  }
  destroyRef = inject(DestroyRef);
  static \u0275fac = function AsistenciaSesionComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AsistenciaSesionComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AsistenciaSesionComponent, selectors: [["app-asistencia-sesion"]], viewQuery: function AsistenciaSesionComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuerySignal(ctx.listado, ListadoEmisionComponent, 5);
      \u0275\u0275viewQuerySignal(ctx.confirmar, DialogoConfirmacionComponent, 5);
    }
    if (rf & 2) {
      \u0275\u0275queryAdvance(2);
    }
  }, hostBindings: function AsistenciaSesionComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("beforeunload", function AsistenciaSesionComponent_beforeunload_HostBindingHandler($event) {
        return ctx.antesDeSalir($event);
      }, false, \u0275\u0275resolveWindow);
    }
  }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 26, vars: 12, consts: [["aria-label", "Navegaci\xF3n de asistencia", 1, "regreso"], ["type", "button", "title", "Volver al detalle de actividad", "aria-label", "Volver al detalle de actividad", 1, "boton-volver", 3, "click", "disabled"], ["aria-hidden", "true", 1, "material-symbols-outlined"], [1, "cabecera"], [1, "identidad"], [1, "estado", 3, "finalizada"], [1, "acciones"], ["type", "button", 1, "btn", 3, "click", "disabled"], ["type", "button", 1, "btn", "btn-primary", 3, "disabled"], ["role", "status"], ["aria-label", "Resumen de asistencia", "aria-live", "polite", 1, "indicadores"], ["recurso", "attendance", 3, "paginaCompleta", "enDetalle", "accionesExternas", "recargarTrasGuardar", "soloLectura", "estadoInicial", "actividadContexto", "datosContexto"], ["titulo", "Cambios de asistencia pendientes", "texto", "Hay cambios sin guardar. \xBFDeseas descartarlos y salir?", "confirmar", "Descartar cambios", "cancelar", "Seguir editando"], [1, "estado"], ["type", "button", 1, "btn", "btn-primary", 3, "click", "disabled"], ["role", "alert", 1, "alert", "alert-error"], ["type", "button", 1, "btn", 3, "disabled"], ["role", "status", 1, "consulta"], ["recurso", "attendance", 3, "registroGuardado", "paginaCompleta", "enDetalle", "accionesExternas", "recargarTrasGuardar", "soloLectura", "estadoInicial", "actividadContexto", "datosContexto"]], template: function AsistenciaSesionComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "nav", 0)(1, "button", 1);
      \u0275\u0275listener("click", function AsistenciaSesionComponent_Template_button_click_1_listener() {
        return ctx.volver();
      });
      \u0275\u0275elementStart(2, "span", 2);
      \u0275\u0275text(3, "arrow_back");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(4, "span");
      \u0275\u0275text(5, "Actividades / Detalle / Asistencia");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "header", 3)(7, "div", 4)(8, "h1");
      \u0275\u0275text(9, "Control de asistencia");
      \u0275\u0275template(10, AsistenciaSesionComponent_Conditional_10_Template, 1, 1);
      \u0275\u0275elementEnd();
      \u0275\u0275template(11, AsistenciaSesionComponent_Conditional_11_Template, 2, 1, "p")(12, AsistenciaSesionComponent_Conditional_12_Template, 2, 3, "p");
      \u0275\u0275elementEnd();
      \u0275\u0275template(13, AsistenciaSesionComponent_Conditional_13_Template, 2, 3, "span", 5);
      \u0275\u0275elementStart(14, "div", 6)(15, "button", 7);
      \u0275\u0275listener("click", function AsistenciaSesionComponent_Template_button_click_15_listener() {
        return ctx.actualizar();
      });
      \u0275\u0275elementStart(16, "span", 2);
      \u0275\u0275text(17, "refresh");
      \u0275\u0275elementEnd();
      \u0275\u0275text(18, "Actualizar asistencia");
      \u0275\u0275elementEnd();
      \u0275\u0275template(19, AsistenciaSesionComponent_Conditional_19_Template, 2, 1, "button", 8);
      \u0275\u0275elementEnd()();
      \u0275\u0275template(20, AsistenciaSesionComponent_Conditional_20_Template, 2, 0, "p", 9)(21, AsistenciaSesionComponent_Conditional_21_Template, 3, 2)(22, AsistenciaSesionComponent_Conditional_22_Template, 2, 1, "p", 9)(23, AsistenciaSesionComponent_Conditional_23_Template, 29, 4, "div", 10)(24, AsistenciaSesionComponent_Conditional_24_Template, 2, 9, "app-listado-emision", 11);
      \u0275\u0275element(25, "app-dialogo-confirmacion", 12);
    }
    if (rf & 2) {
      let tmp_1_0;
      let tmp_2_0;
      let tmp_3_0;
      let tmp_4_0;
      let tmp_6_0;
      let tmp_10_0;
      let tmp_11_0;
      \u0275\u0275advance();
      \u0275\u0275property("disabled", ctx.ocupado());
      \u0275\u0275advance(9);
      \u0275\u0275conditional((tmp_1_0 = ctx.sesion()) ? 10 : -1, tmp_1_0);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_2_0 = ctx.datos()) ? 11 : -1, tmp_2_0);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_3_0 = ctx.sesion()) ? 12 : -1, tmp_3_0);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_4_0 = ctx.sesion()) ? 13 : -1, tmp_4_0);
      \u0275\u0275advance(2);
      \u0275\u0275property("disabled", ctx.ocupado() || !ctx.datos());
      \u0275\u0275advance(4);
      \u0275\u0275conditional(!ctx.soloLectura() && ((tmp_6_0 = ctx.listado()) == null ? null : tmp_6_0.cambiosPendientes()) ? 19 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.cargando() ? 20 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.error() ? 21 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.aviso() ? 22 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_10_0 = (tmp_10_0 = ctx.sesion()) == null ? null : tmp_10_0.contadores) ? 23 : -1, tmp_10_0);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_11_0 = ctx.datos()) ? 24 : -1, tmp_11_0);
    }
  }, dependencies: [ListadoEmisionComponent, DialogoConfirmacionComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\n.regreso[_ngcontent-%COMP%], \n.cabecera[_ngcontent-%COMP%], \n.acciones[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 0.65rem;\n}\n.regreso[_ngcontent-%COMP%] {\n  color: #52677b;\n  font-size: 0.85rem;\n  margin-bottom: 0.75rem;\n}\n.boton-volver[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 2.25rem;\n  height: 2.25rem;\n  border: 0;\n  border-radius: 0.5rem;\n  color: #075a9b;\n  background: #eef5fb;\n  cursor: pointer;\n}\n.boton-volver[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid #075a9b;\n  outline-offset: 2px;\n}\n.cabecera[_ngcontent-%COMP%] {\n  align-items: flex-start;\n  margin-bottom: 1rem;\n}\n.identidad[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: min(100%, 16rem);\n  overflow-wrap: anywhere;\n}\n.identidad[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  color: #075a9b;\n  font-size: 1.35rem;\n  margin: 0 0 0.4rem;\n}\n.identidad[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.2rem 0;\n  font-size: 0.9rem;\n}\n.estado[_ngcontent-%COMP%] {\n  border-radius: 1rem;\n  padding: 0.25rem 0.65rem;\n  font-size: 0.8rem;\n  background: #fff5db;\n  color: #795b16;\n}\n.estado.finalizada[_ngcontent-%COMP%] {\n  color: #21643b;\n  background: #e8f5ec;\n}\n.acciones[_ngcontent-%COMP%] {\n  justify-content: flex-end;\n  width: 100%;\n}\n.acciones[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.4rem;\n}\n.btn-primary[_ngcontent-%COMP%] {\n  background: #d6ad4a;\n  color: #192b3c;\n  border-color: #b38a2c;\n}\n.indicadores[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 0.65rem;\n  margin-bottom: 1rem;\n}\n.indicadores[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr);\n  align-items: center;\n  gap: 0.1rem 0.5rem;\n  padding: 0.65rem;\n  background: #f7f9fc;\n  border: 1px solid #dfe6ef;\n  border-radius: 0.5rem;\n}\n.indicadores[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%] {\n  grid-row: span 2;\n  color: #075a9b;\n}\n.indicadores[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #075a9b;\n  font-size: 1.3rem;\n}\n.indicadores[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:last-child {\n  font-size: 0.8rem;\n  overflow-wrap: anywhere;\n}\n.consulta[_ngcontent-%COMP%] {\n  color: #52677b;\n  font-size: 0.85rem;\n}\n@media (max-width: 600px) {\n  .indicadores[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n/*# sourceMappingURL=asistencia-sesion.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AsistenciaSesionComponent, { className: "AsistenciaSesionComponent", filePath: "src\\app\\pages\\actividades\\asistencia-sesion\\asistencia-sesion.component.ts", lineNumber: 22 });
})();
export {
  AsistenciaSesionComponent
};
//# sourceMappingURL=chunk-AQ3P6HBM.js.map
