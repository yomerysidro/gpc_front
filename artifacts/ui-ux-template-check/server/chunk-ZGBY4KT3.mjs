import './polyfills.server.mjs';
import {
  ListarParticipantesComponent,
  ParticipantesService
} from "./chunk-H53FL7LB.mjs";
import {
  FormularioEmisionComponent
} from "./chunk-TL467TQE.mjs";
import {
  ActividadesService
} from "./chunk-ZYTODG6T.mjs";
import {
  PersonSpeakerService
} from "./chunk-FBNEJSMB.mjs";
import {
  DialogoConfirmacionComponent
} from "./chunk-PM6SETE6.mjs";
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
  Router,
  RouterLink
} from "./chunk-OX7VSSQH.mjs";
import "./chunk-VNKXA6HD.mjs";
import {
  AuthService
} from "./chunk-NP7M7R34.mjs";
import {
  EmisionCertificadosService
} from "./chunk-UOKIJFGD.mjs";
import "./chunk-7VY3YOD2.mjs";
import {
  PersonService
} from "./chunk-2XE3PF63.mjs";
import "./chunk-JMI3IFFT.mjs";
import "./chunk-HFD7K63G.mjs";
import {
  takeUntilDestroyed
} from "./chunk-TSKSZVR2.mjs";
import "./chunk-TNXV45E5.mjs";
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
  SelectControlValueAccessor,
  Validators,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-SPQE7PSN.mjs";
import {
  DOCUMENT,
  DestroyRef,
  EMPTY,
  ElementRef,
  Injector,
  Subject,
  Subscription,
  afterNextRender,
  catchError,
  combineLatest,
  computed,
  effect,
  filter,
  forkJoin,
  inject,
  input,
  map,
  of,
  output,
  shareReplay,
  signal,
  startWith,
  switchMap,
  tap,
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
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵpureFunction3,
  ɵɵqueryAdvance,
  ɵɵreference,
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
  ɵɵtextInterpolate3,
  ɵɵtextInterpolate5,
  ɵɵviewQuerySignal
} from "./chunk-OYAKRC2F.mjs";
import {
  __async,
  __spreadProps,
  __spreadValues
} from "./chunk-X7LY3JHO.mjs";

// src/app/models/actividades/actividad-form.model.ts
var ESTADOS_ACTIVIDAD = ["Activa", "Cerrada"];
function textoObligatorio(control) {
  return typeof control.value === "string" && control.value.trim() ? null : { required: true };
}
function periodoActividad(control) {
  const inicio = control.get("fecha_inicio")?.value;
  const fin = control.get("fecha_fin")?.value;
  return inicio && fin && fin < inicio ? { periodo: true } : null;
}
function filtrarActividades(actividades, filtros) {
  const texto = (valor) => valor.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es");
  const nombre = texto(filtros.nombre.trim());
  return actividades.filter((actividad) => texto(actividad.nombre).includes(nombre) && (!filtros.area || String(actividad.id_area) === filtros.area) && (!filtros.tipo || String(actividad.id_tipo_actividad) === filtros.tipo) && (!filtros.estado || actividad.estado === filtros.estado));
}

// src/app/pages/actividades/detalle-actividad/detalle-actividad.service.ts
var DetalleActividadService = class _DetalleActividadService {
  actividades = inject(ActividadesService);
  participaciones = inject(ParticipantesService);
  ponentes = inject(PersonSpeakerService);
  consultarPonentes(id, personas) {
    return this.actividades.listarAsignacionesPonentes().pipe(map((filas) => filas.filter((fila) => fila.id_actividad === id)), switchMap((filas) => filas.length ? forkJoin({ personas, catalogo: this.ponentes.listar() }).pipe(map(({ personas: personas2, catalogo }) => {
      const porPersona = new Map(personas2.map((persona) => [persona.id_persona, persona]));
      const porPonente = new Map(catalogo.map((ponente) => [ponente.id_persona_ponente, ponente]));
      return filas.map((fila) => {
        const ponente = porPonente.get(fila.id_persona_ponente);
        return {
          id: fila.id_actividad_ponente,
          nombre: nombreCompleto(ponente ? porPersona.get(ponente.id_persona) : void 0),
          procedencia: null,
          especialidad: ponente?.especialidad ?? null
        };
      });
    })) : of([])));
  }
  consultarParticipantes(id, personas, informar = () => {
  }, reintentos = EMPTY) {
    const auxiliar = (recurso, consulta) => reintentos.pipe(filter((valor) => valor === recurso), startWith(recurso), switchMap(() => consulta.pipe(tap(() => informar(recurso, null)), catchError((error) => {
      informar(recurso, error);
      return of([]);
    }))));
    return this.participaciones.listar().pipe(map((filas) => filas.filter((fila) => fila.id_actividad === id)), switchMap((filas) => filas.length ? combineLatest({
      personas: auxiliar("personas", personas),
      tipos: auxiliar("tiposParticipacion", this.participaciones.tipos())
    }).pipe(map(({ personas: personas2, tipos }) => {
      const porPersona = new Map(personas2.map((persona) => [persona.id_persona, persona]));
      const porTipo = new Map(tipos.map((tipo) => [tipo.id_tipo_participacion, tipo.nombre]));
      return filas.map((fila) => {
        const persona = porPersona.get(fila.id_persona);
        return {
          id: fila.id_participacion,
          nombres: persona?.nombres || "No disponible",
          apellidos: persona ? [persona.apellido_paterno, persona.apellido_materno].filter(Boolean).join(" ") : "",
          tipo: porTipo.get(fila.id_tipo_participacion) || "No disponible",
          fecha: fila.fecha_inscripcion,
          estado: fila.estado
        };
      });
    })) : of([])));
  }
  static \u0275fac = function DetalleActividadService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DetalleActividadService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _DetalleActividadService, factory: _DetalleActividadService.\u0275fac, providedIn: "root" });
};
function nombreCompleto(persona) {
  return persona ? [persona.nombres, persona.apellido_paterno, persona.apellido_materno].filter(Boolean).join(" ").trim() || "Nombre no disponible" : "Nombre no disponible";
}

// src/app/pages/actividades/detalle-actividad/ponentes-sesion-actividad.component.ts
var _forTrack0 = ($index, $item) => $item.id_actividad_ponente;
var _forTrack1 = ($index, $item) => $item.id_persona_ponente;
function PonentesSesionActividadComponent_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 2);
    \u0275\u0275text(1, "No tienes permiso para consultar los ponentes de esta sesi\xF3n.");
    \u0275\u0275elementEnd();
  }
}
function PonentesSesionActividadComponent_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 2);
    \u0275\u0275text(1, "Consultando ponentes de la sesi\xF3n\u2026");
    \u0275\u0275elementEnd();
  }
}
function PonentesSesionActividadComponent_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 3);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 4);
    \u0275\u0275listener("click", function PonentesSesionActividadComponent_Conditional_19_Template_button_click_2_listener() {
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
function PonentesSesionActividadComponent_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 2);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.aviso());
  }
}
function PonentesSesionActividadComponent_Conditional_21_For_4_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const p_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275textInterpolate1(" \xB7 ", p_r3.cargo, " ");
  }
}
function PonentesSesionActividadComponent_Conditional_21_For_4_Conditional_7_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 10)(1, "button", 12);
    \u0275\u0275listener("click", function PonentesSesionActividadComponent_Conditional_21_For_4_Conditional_7_Conditional_0_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r4);
      const p_r3 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.desvincular(p_r3.id_actividad_ponente));
    });
    \u0275\u0275text(2, "Confirmar desvincular");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 12);
    \u0275\u0275listener("click", function PonentesSesionActividadComponent_Conditional_21_For_4_Conditional_7_Conditional_0_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.confirmando.set(null));
    });
    \u0275\u0275text(4, "Cancelar");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.operando());
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.operando());
  }
}
function PonentesSesionActividadComponent_Conditional_21_For_4_Conditional_7_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 12);
    \u0275\u0275listener("click", function PonentesSesionActividadComponent_Conditional_21_For_4_Conditional_7_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const p_r3 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.confirmando.set(p_r3.id_actividad_ponente));
    });
    \u0275\u0275text(1, "Desvincular");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275property("disabled", ctx_r1.operando());
  }
}
function PonentesSesionActividadComponent_Conditional_21_For_4_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, PonentesSesionActividadComponent_Conditional_21_For_4_Conditional_7_Conditional_0_Template, 5, 2, "div", 10)(1, PonentesSesionActividadComponent_Conditional_21_For_4_Conditional_7_Conditional_1_Template, 2, 1, "button", 11);
  }
  if (rf & 2) {
    const p_r3 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(ctx_r1.confirmando() === p_r3.id_actividad_ponente ? 0 : 1);
  }
}
function PonentesSesionActividadComponent_Conditional_21_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li")(1, "div", 9)(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "small");
    \u0275\u0275text(5);
    \u0275\u0275template(6, PonentesSesionActividadComponent_Conditional_21_For_4_Conditional_6_Template, 1, 1);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(7, PonentesSesionActividadComponent_Conditional_21_For_4_Conditional_7_Template, 2, 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r3 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(p_r3.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r3.identificacion);
    \u0275\u0275advance();
    \u0275\u0275conditional(p_r3.cargo ? 6 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((ctx_r1.auth == null ? null : ctx_r1.auth.tienePermiso("ponentes-firmantes.eliminar")) ? 7 : -1);
  }
}
function PonentesSesionActividadComponent_Conditional_21_ForEmpty_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 6);
    \u0275\u0275text(1, "No hay ponentes asignados");
    \u0275\u0275elementEnd();
  }
}
function PonentesSesionActividadComponent_Conditional_21_Conditional_8_Conditional_3_For_6_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const p_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275textInterpolate1(" \xB7 ", p_r8.cargo, " ");
  }
}
function PonentesSesionActividadComponent_Conditional_21_Conditional_8_Conditional_3_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 17);
    \u0275\u0275text(1);
    \u0275\u0275template(2, PonentesSesionActividadComponent_Conditional_21_Conditional_8_Conditional_3_For_6_Conditional_2_Template, 1, 1);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r8 = ctx.$implicit;
    \u0275\u0275property("value", p_r8.id_persona_ponente)("disabled", p_r8.yaVinculado);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", p_r8.nombre, " \xB7 ", p_r8.identificacion, "");
    \u0275\u0275advance();
    \u0275\u0275conditional(p_r8.cargo ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(p_r8.yaVinculado ? " \xB7 Ya vinculado" : "");
  }
}
function PonentesSesionActividadComponent_Conditional_21_Conditional_8_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 14);
    \u0275\u0275text(1, "Ponente registrado en RR. HH.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "select", 15);
    \u0275\u0275listener("change", function PonentesSesionActividadComponent_Conditional_21_Conditional_8_Conditional_3_Template_select_change_2_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.seleccion.set($event.target.value));
    });
    \u0275\u0275elementStart(3, "option", 16);
    \u0275\u0275text(4, "Selecciona un ponente");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(5, PonentesSesionActividadComponent_Conditional_21_Conditional_8_Conditional_3_For_6_Template, 4, 6, "option", 17, _forTrack1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 13);
    \u0275\u0275listener("click", function PonentesSesionActividadComponent_Conditional_21_Conditional_8_Conditional_3_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.agregar());
    });
    \u0275\u0275text(8, "Asignar ponente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "button", 12);
    \u0275\u0275listener("click", function PonentesSesionActividadComponent_Conditional_21_Conditional_8_Conditional_3_Template_button_click_9_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(3);
      ctx_r1.mostrarSeleccion.set(false);
      return \u0275\u0275resetView(ctx_r1.seleccion.set(""));
    });
    \u0275\u0275text(10, "Cancelar");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", ctx_r1.seleccion())("disabled", ctx_r1.operando());
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.disponibles());
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.operando() || !ctx_r1.seleccionado());
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.operando());
  }
}
function PonentesSesionActividadComponent_Conditional_21_Conditional_8_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 2);
    \u0275\u0275text(1, "No hay ponentes registrados en el cat\xE1logo autorizado.");
    \u0275\u0275elementEnd();
  }
}
function PonentesSesionActividadComponent_Conditional_21_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 8)(1, "button", 13);
    \u0275\u0275listener("click", function PonentesSesionActividadComponent_Conditional_21_Conditional_8_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.mostrarSeleccion.set(!ctx_r1.mostrarSeleccion()));
    });
    \u0275\u0275text(2, "Asignar ponente a esta sesi\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, PonentesSesionActividadComponent_Conditional_21_Conditional_8_Conditional_3_Template, 11, 4)(4, PonentesSesionActividadComponent_Conditional_21_Conditional_8_Conditional_4_Template, 2, 0, "p", 2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.operando() || !ctx_r1.disponibles().length);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.mostrarSeleccion() ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r1.disponibles().length ? 4 : -1);
  }
}
function PonentesSesionActividadComponent_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "h3");
    \u0275\u0275text(1, "Ponentes vinculados");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "ul", 5);
    \u0275\u0275repeaterCreate(3, PonentesSesionActividadComponent_Conditional_21_For_4_Template, 8, 4, "li", null, _forTrack0, false, PonentesSesionActividadComponent_Conditional_21_ForEmpty_5_Template, 2, 0, "li", 6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 7);
    \u0275\u0275text(7, "Un v\xEDnculo con reconocimiento preparado no se puede desvincular.");
    \u0275\u0275elementEnd();
    \u0275\u0275template(8, PonentesSesionActividadComponent_Conditional_21_Conditional_8_Template, 5, 3, "div", 8);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.vinculados());
    \u0275\u0275advance(5);
    \u0275\u0275conditional((ctx_r1.auth == null ? null : ctx_r1.auth.tienePermiso("ponentes-firmantes.crear")) ? 8 : -1);
  }
}
var PonentesSesionActividadComponent = class _PonentesSesionActividadComponent {
  actividad = input.required();
  sesion = input.required();
  /** Se emite después de cada cambio persistido para que la actividad refresque su estado. */
  actualizado = output();
  auth = inject(AuthService, { optional: true });
  api = inject(EmisionCertificadosService);
  speakers = inject(PersonSpeakerService);
  destroy = inject(DestroyRef);
  consulta;
  gestion = signal(null);
  cargando = signal(false);
  operando = signal(false);
  error = signal("");
  aviso = signal("");
  mostrarSeleccion = signal(false);
  seleccion = signal("");
  confirmando = signal(null);
  cargos = signal(/* @__PURE__ */ new Map());
  identidades = signal({});
  ngOnInit() {
    this.cargar();
  }
  autorizado() {
    return this.auth?.tienePermiso("ponentes-firmantes.ver") === true;
  }
  vinculados = computed(() => (this.gestion()?.vinculos ?? []).map((v) => this.datosPonente(v.id_persona_ponente, Number(v.id_actividad_ponente))));
  disponibles = computed(() => {
    const g = this.gestion();
    const vinculadas = new Set((g?.vinculos ?? []).map((v) => v.id_persona ?? this.personaDe(v.id_persona_ponente)).filter((id) => id !== null));
    return (g?.ponentes_disponibles ?? []).map((p) => __spreadProps(__spreadValues({}, this.datosPonente(p.id_persona_ponente, 0, p.id_persona)), {
      yaVinculado: vinculadas.has(p.id_persona) || !!g?.vinculos.some((v) => v.id_persona_ponente === p.id_persona_ponente)
    }));
  });
  seleccionado() {
    const valor = Number(this.seleccion());
    const opcion = this.disponibles().find((p) => p.id_persona_ponente === valor);
    return opcion && !opcion.yaVinculado && Number.isSafeInteger(valor) && valor > 0 ? valor : null;
  }
  cargar() {
    if (!this.autorizado() || this.cargando())
      return;
    const actividad = Number(this.actividad().id_actividad);
    const sesion = Number(this.sesion().id_actividad_sesion);
    if (!Number.isSafeInteger(actividad) || actividad < 1 || !Number.isSafeInteger(sesion) || sesion < 1) {
      this.error.set("La sesi\xF3n seleccionada no es v\xE1lida.");
      return;
    }
    this.consulta?.unsubscribe();
    this.error.set("");
    this.cargando.set(true);
    this.consulta = forkJoin({
      gestion: this.api.ponentesSesion(actividad, sesion),
      cargos: this.speakers.listar().pipe(catchError(() => of([]))),
      identidades: this.api.documentosIdentidad().pipe(catchError(() => of({})))
    }).pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: ({ gestion, cargos, identidades }) => {
        this.cargando.set(false);
        this.cargos.set(new Map(cargos.map((c) => [c.id_persona_ponente, c.cargo ?? null])));
        this.identidades.set(identidades);
        this.gestion.set(gestion);
      },
      error: (e) => {
        this.cargando.set(false);
        this.gestion.set(null);
        this.error.set(this.mensaje(e));
      }
    });
  }
  agregar() {
    const idPersonaPonente = this.seleccionado();
    const actividad = Number(this.actividad().id_actividad);
    const sesion = Number(this.sesion().id_actividad_sesion);
    if (!idPersonaPonente || this.operando() || this.auth?.tienePermiso("ponentes-firmantes.crear") !== true)
      return;
    this.operando.set(true);
    this.error.set("");
    this.aviso.set("");
    this.consulta = this.api.vincularPonenteSesion(actividad, sesion, idPersonaPonente).pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: () => {
        this.aviso.set("Ponente vinculado a esta sesi\xF3n.");
        this.seleccion.set("");
        this.mostrarSeleccion.set(false);
        this.recargarPersistido();
      },
      error: (e) => {
        this.operando.set(false);
        this.error.set(this.mensaje(e));
        this.recargarPersistido();
      }
    });
  }
  desvincular(idActividadPonente) {
    const actividad = Number(this.actividad().id_actividad);
    const sesion = Number(this.sesion().id_actividad_sesion);
    if (this.operando() || this.auth?.tienePermiso("ponentes-firmantes.eliminar") !== true || !this.gestion()?.vinculos.some((v) => Number(v.id_actividad_ponente) === idActividadPonente))
      return;
    this.operando.set(true);
    this.error.set("");
    this.aviso.set("");
    this.consulta = this.api.desvincularPonenteSesion(actividad, sesion, idActividadPonente).pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: () => {
        this.confirmando.set(null);
        this.aviso.set("Ponente desvinculado de esta sesi\xF3n.");
        this.recargarPersistido();
      },
      error: (e) => {
        this.operando.set(false);
        this.confirmando.set(null);
        this.error.set(this.mensaje(e));
        this.recargarPersistido();
      }
    });
  }
  /** La lista mostrada siempre se recupera del servidor después de escribir. */
  recargarPersistido() {
    const actividad = Number(this.actividad().id_actividad);
    const sesion = Number(this.sesion().id_actividad_sesion);
    this.consulta?.unsubscribe();
    this.consulta = this.api.ponentesSesion(actividad, sesion).pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: (gestion) => {
        this.operando.set(false);
        this.gestion.set(gestion);
        this.actualizado.emit();
      },
      error: (e) => {
        this.operando.set(false);
        this.gestion.set(null);
        this.error.set(this.mensaje(e));
      }
    });
  }
  datosPonente(idPersonaPonente, idActividadPonente, idPersona) {
    const fila = this.gestion()?.vinculos.find((p) => p.id_actividad_ponente === idActividadPonente && p.nombres) ?? this.gestion()?.ponentes_disponibles.find((p) => p.id_persona_ponente === idPersonaPonente);
    const persona = idPersona ?? fila?.id_persona;
    const nombre = fila ? [fila.nombres, fila.apellido_paterno, fila.apellido_materno].filter(Boolean).join(" ").trim() : "";
    const dni = persona !== void 0 ? this.identidades()[persona] : void 0;
    return {
      id_persona_ponente: idPersonaPonente,
      id_persona: Number(persona) || 0,
      nombre: nombre || `Ponente #${idPersonaPonente}`,
      identificacion: dni ? `DNI ${dni}` : `Registro #${idPersonaPonente}`,
      cargo: this.cargos().get(idPersonaPonente) ?? null,
      id_actividad_ponente: idActividadPonente
    };
  }
  personaDe(idPersonaPonente) {
    return this.gestion()?.ponentes_disponibles.find((p) => p.id_persona_ponente === idPersonaPonente)?.id_persona ?? null;
  }
  mensaje(e) {
    if (e?.mensaje && !/sql|postgres|neon|esquema|schema|sqlstate/i.test(e.mensaje))
      return e.mensaje;
    switch (e?.status) {
      case 0:
        return "No se pudo conectar con el servidor. Comprueba tu conexi\xF3n e intenta nuevamente.";
      case 401:
        return "Tu sesi\xF3n no est\xE1 autenticada. Inicia sesi\xF3n nuevamente.";
      case 403:
        return "No tienes permisos para realizar esta operaci\xF3n.";
      case 404:
        return "La sesi\xF3n o el recurso solicitado ya no est\xE1 disponible.";
      case 409:
        return "No se pudo realizar la operaci\xF3n. El ponente puede estar ya asignado o tener un reconocimiento asociado.";
      case 422:
        return "Los datos no son v\xE1lidos. Revisa el ponente seleccionado.";
      default:
        return "No se pudo completar la operaci\xF3n. Intenta nuevamente.";
    }
  }
  static \u0275fac = function PonentesSesionActividadComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PonentesSesionActividadComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PonentesSesionActividadComponent, selectors: [["app-ponentes-sesion-actividad"]], inputs: { actividad: [1, "actividad"], sesion: [1, "sesion"] }, outputs: { actualizado: "actualizado" }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 22, vars: 8, consts: [["aria-label", "Ponentes de la sesi\xF3n", 1, "ponentes-sesion"], [1, "contexto"], ["role", "status"], ["role", "alert"], ["type", "button", 1, "btn", 3, "click"], [1, "vinculados"], [1, "vacio"], [1, "ayuda"], [1, "agregar"], [1, "datos-ponente"], [1, "confirmacion"], ["type", "button", 1, "btn", 3, "disabled"], ["type", "button", 1, "btn", 3, "click", "disabled"], ["type", "button", 1, "btn", "btn-primary", 3, "click", "disabled"], ["for", "ponente-sesion-actividad"], ["id", "ponente-sesion-actividad", 1, "input", 3, "change", "value", "disabled"], ["value", ""], [3, "value", "disabled"]], template: function PonentesSesionActividadComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section", 0)(1, "dl", 1)(2, "div")(3, "dt");
      \u0275\u0275text(4, "Actividad");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "dd");
      \u0275\u0275text(6);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(7, "div")(8, "dt");
      \u0275\u0275text(9, "Sesi\xF3n");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "dd");
      \u0275\u0275text(11);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(12, "div")(13, "dt");
      \u0275\u0275text(14, "Fecha");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "dd");
      \u0275\u0275text(16);
      \u0275\u0275elementEnd()()();
      \u0275\u0275template(17, PonentesSesionActividadComponent_Conditional_17_Template, 2, 0, "p", 2)(18, PonentesSesionActividadComponent_Conditional_18_Template, 2, 0, "p", 2)(19, PonentesSesionActividadComponent_Conditional_19_Template, 4, 1)(20, PonentesSesionActividadComponent_Conditional_20_Template, 2, 1, "p", 2)(21, PonentesSesionActividadComponent_Conditional_21_Template, 9, 2);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate(ctx.actividad().nombre);
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate1("Sesi\xF3n ", ctx.sesion().numero, "");
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(ctx.sesion().fecha);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.autorizado() ? 17 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.cargando() ? 18 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.error() ? 19 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.aviso() ? 20 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.gestion() ? 21 : -1);
    }
  }, styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\n.contexto[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));\n  gap: 0.75rem;\n  margin: 0 0 1rem;\n}\n.contexto[_ngcontent-%COMP%]   dt[_ngcontent-%COMP%] {\n  font-size: 0.78rem;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n  color: #5b6c7f;\n}\n.contexto[_ngcontent-%COMP%]   dd[_ngcontent-%COMP%] {\n  margin: 0.15rem 0 0;\n  font-weight: 600;\n  color: #20374e;\n}\nh3[_ngcontent-%COMP%] {\n  margin: 0 0 0.5rem;\n  color: #075a9b;\n  font-size: 1rem;\n}\n.vinculados[_ngcontent-%COMP%] {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  display: grid;\n  gap: 0.5rem;\n}\n.vinculados[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.75rem;\n  padding: 0.55rem 0.7rem;\n  border: 1px solid #dfe6ef;\n  border-radius: 0.5rem;\n  background: #f8fafc;\n}\n.vinculados[_ngcontent-%COMP%]   li.vacio[_ngcontent-%COMP%] {\n  justify-content: flex-start;\n  color: #53657a;\n}\n.datos-ponente[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.15rem;\n  min-width: 0;\n}\n.datos-ponente[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: #53657a;\n}\n.confirmacion[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.4rem;\n  flex-wrap: wrap;\n}\n.ayuda[_ngcontent-%COMP%] {\n  color: #5b6c7f;\n  font-size: 0.82rem;\n  margin: 0.5rem 0 1rem;\n}\n.agregar[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.5rem;\n  justify-items: start;\n}\n.agregar[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: #20374e;\n}\n.agregar[_ngcontent-%COMP%]   select[_ngcontent-%COMP%] {\n  min-width: min(100%, 26rem);\n}\n.btn[_ngcontent-%COMP%] {\n  white-space: nowrap;\n}\n/*# sourceMappingURL=ponentes-sesion-actividad.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PonentesSesionActividadComponent, { className: "PonentesSesionActividadComponent", filePath: "src\\app\\pages\\actividades\\detalle-actividad\\ponentes-sesion-actividad.component.ts", lineNumber: 99 });
})();

// src/app/pages/actividades/detalle-actividad/detalle-actividad.component.ts
var _c0 = ["confirmarFinalizacion"];
var _c1 = ["modalPonentesSesion"];
var _c2 = ["modalDetalle"];
var _c3 = ["modalSesion"];
var _c4 = ["editorSesion"];
var _forTrack02 = ($index, $item) => $item.recurso;
var _forTrack12 = ($index, $item) => $item["id_actividad_sesion"];
var _c5 = (a0, a1, a2) => ({ id_actividad_sesion: a0, numero: a1, fecha: a2 });
function DetalleActividadComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9)(1, "h1");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 18);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const actual_r2 = ctx;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(actual_r2.nombre);
    \u0275\u0275advance();
    \u0275\u0275attribute("data-estado", actual_r2.estado);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(actual_r2.estado);
  }
}
function DetalleActividadComponent_Conditional_6_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 19)(1, "button", 20);
    \u0275\u0275listener("click", function DetalleActividadComponent_Conditional_6_Conditional_0_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r3);
      const actual_r4 = \u0275\u0275nextContext();
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.editarActividad.emit(actual_r4));
    });
    \u0275\u0275elementStart(2, "span", 8);
    \u0275\u0275text(3, "edit");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r4.operando() || ctx_r4.panelOcupado());
  }
}
function DetalleActividadComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, DetalleActividadComponent_Conditional_6_Conditional_0_Template, 4, 1, "div", 19);
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275conditional((ctx_r4.auth == null ? null : ctx_r4.auth.tienePermiso("actividades.editar")) ? 0 : -1);
  }
}
function DetalleActividadComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 10);
    \u0275\u0275text(1, "Cargando actividad\u2026");
    \u0275\u0275elementEnd();
  }
}
function DetalleActividadComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 10);
    \u0275\u0275text(1, "Selecciona una actividad para ver su detalle");
    \u0275\u0275elementEnd();
  }
}
function DetalleActividadComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 21);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 22);
    \u0275\u0275listener("click", function DetalleActividadComponent_Conditional_9_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.cargar());
    });
    \u0275\u0275text(3, "Reintentar");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r4.error());
  }
}
function DetalleActividadComponent_Conditional_10_Conditional_36_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "dt");
    \u0275\u0275text(2, "Descripci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "dd");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const actual_r7 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(actual_r7.descripcion);
  }
}
function DetalleActividadComponent_Conditional_10_Conditional_36_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "dt");
    \u0275\u0275text(2, "Sede");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "dd");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const actual_r7 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(actual_r7.sede);
  }
}
function DetalleActividadComponent_Conditional_10_Conditional_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dl", 27);
    \u0275\u0275template(1, DetalleActividadComponent_Conditional_10_Conditional_36_Conditional_1_Template, 5, 1, "div")(2, DetalleActividadComponent_Conditional_10_Conditional_36_Conditional_2_Template, 5, 1, "div");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const actual_r7 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(actual_r7.descripcion ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(actual_r7.sede ? 2 : -1);
  }
}
function DetalleActividadComponent_Conditional_10_Conditional_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 10);
    \u0275\u0275text(1, "No se pudieron consultar algunos cat\xE1logos de \xE1reas o tipos de actividad.");
    \u0275\u0275elementEnd();
  }
}
function DetalleActividadComponent_Conditional_10_Conditional_38_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 14);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 22);
    \u0275\u0275listener("click", function DetalleActividadComponent_Conditional_10_Conditional_38_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r4 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r4.cargarParticipantes());
    });
    \u0275\u0275text(3, "Reintentar participantes");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r4.errorParticipantes());
  }
}
function DetalleActividadComponent_Conditional_10_For_40_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 10);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 35);
    \u0275\u0275listener("click", function DetalleActividadComponent_Conditional_10_For_40_Template_button_click_2_listener() {
      const aviso_r10 = \u0275\u0275restoreView(_r9).$implicit;
      const ctx_r4 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r4.reintentarCatalogo(aviso_r10.recurso));
    });
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const aviso_r10 = ctx.$implicit;
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(aviso_r10.mensaje);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r4.reintentando().includes(aviso_r10.recurso));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Reintentar ", aviso_r10.recurso === "personas" ? "personas" : "tipos de participaci\xF3n", "");
  }
}
function DetalleActividadComponent_Conditional_10_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 28);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r4.avisoInscripcion());
  }
}
function DetalleActividadComponent_Conditional_10_Conditional_46_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 36);
    \u0275\u0275listener("click", function DetalleActividadComponent_Conditional_10_Conditional_46_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r4 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r4.abrirSesion());
    });
    \u0275\u0275elementStart(1, "span", 8);
    \u0275\u0275text(2, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, "Registrar sesi\xF3n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r4.panelOcupado());
  }
}
function DetalleActividadComponent_Conditional_10_Conditional_47_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 10);
    \u0275\u0275text(1, "Cargando sesiones\u2026");
    \u0275\u0275elementEnd();
  }
}
function DetalleActividadComponent_Conditional_10_Conditional_48_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 14);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 22);
    \u0275\u0275listener("click", function DetalleActividadComponent_Conditional_10_Conditional_48_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r4 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r4.cargarSesiones());
    });
    \u0275\u0275text(3, "Reintentar sesiones");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r4.errorSesiones());
  }
}
function DetalleActividadComponent_Conditional_10_Conditional_49_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "No tienes permiso para consultar las sesiones.");
    \u0275\u0275elementEnd();
  }
}
function DetalleActividadComponent_Conditional_10_Conditional_50_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "Esta actividad todav\xEDa no tiene sesiones programadas");
    \u0275\u0275elementEnd();
  }
}
function DetalleActividadComponent_Conditional_10_Conditional_51_For_2_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 40);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r14 = ctx;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate5("", c_r14.participantes_sesion, " participantes \xB7 ", c_r14.presentes, " ", c_r14.presentes === 1 ? "presente" : "presentes", " \xB7 ", c_r14.ausentes, " ", c_r14.ausentes === 1 ? "ausente" : "ausentes", "");
  }
}
function DetalleActividadComponent_Conditional_10_Conditional_51_For_2_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 47);
    \u0275\u0275listener("click", function DetalleActividadComponent_Conditional_10_Conditional_51_For_2_Conditional_16_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r16);
      const sesion_r15 = \u0275\u0275nextContext().$implicit;
      const ctx_r4 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r4.abrirPanel("ponentes", sesion_r15));
    });
    \u0275\u0275elementStart(1, "span", 8);
    \u0275\u0275text(2, "co_present");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext(4);
    \u0275\u0275property("disabled", ctx_r4.panelOcupado());
  }
}
function DetalleActividadComponent_Conditional_10_Conditional_51_For_2_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 48);
    \u0275\u0275listener("click", function DetalleActividadComponent_Conditional_10_Conditional_51_For_2_Conditional_17_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r17);
      const sesion_r15 = \u0275\u0275nextContext().$implicit;
      const ctx_r4 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r4.abrirInscripcion(sesion_r15));
    });
    \u0275\u0275elementStart(1, "span", 8);
    \u0275\u0275text(2, "how_to_reg");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext(4);
    \u0275\u0275property("disabled", ctx_r4.panelOcupado());
  }
}
function DetalleActividadComponent_Conditional_10_Conditional_51_For_2_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 49);
    \u0275\u0275listener("click", function DetalleActividadComponent_Conditional_10_Conditional_51_For_2_Conditional_18_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r18);
      const sesion_r15 = \u0275\u0275nextContext().$implicit;
      const ctx_r4 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r4.abrirPanel("asistencia", sesion_r15));
    });
    \u0275\u0275elementStart(1, "span", 8);
    \u0275\u0275text(2, "check_circle");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext(4);
    \u0275\u0275property("disabled", ctx_r4.panelOcupado());
  }
}
function DetalleActividadComponent_Conditional_10_Conditional_51_For_2_Conditional_19_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 35);
    \u0275\u0275listener("click", function DetalleActividadComponent_Conditional_10_Conditional_51_For_2_Conditional_19_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r20);
      const sesion_r15 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r4 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r4.cargarCapacidades(sesion_r15));
    });
    \u0275\u0275text(1, "Consultar cierre");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const sesion_r15 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r4 = \u0275\u0275nextContext(3);
    \u0275\u0275property("disabled", ctx_r4.cargandoCapacidades().includes(+sesion_r15["id_actividad_sesion"]));
  }
}
function DetalleActividadComponent_Conditional_10_Conditional_51_For_2_Conditional_19_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small");
    \u0275\u0275text(1, "Finalizaci\xF3n no disponible para esta sesi\xF3n.");
    \u0275\u0275elementEnd();
  }
}
function DetalleActividadComponent_Conditional_10_Conditional_51_For_2_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 46);
    \u0275\u0275template(1, DetalleActividadComponent_Conditional_10_Conditional_51_For_2_Conditional_19_Conditional_1_Template, 2, 1, "button", 50);
    \u0275\u0275elementStart(2, "button", 51);
    \u0275\u0275listener("click", function DetalleActividadComponent_Conditional_10_Conditional_51_For_2_Conditional_19_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r19);
      const sesion_r15 = \u0275\u0275nextContext().$implicit;
      const ctx_r4 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r4.finalizarSesion(sesion_r15));
    });
    \u0275\u0275elementStart(3, "span", 8);
    \u0275\u0275text(4, "check_circle");
    \u0275\u0275elementEnd();
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, DetalleActividadComponent_Conditional_10_Conditional_51_For_2_Conditional_19_Conditional_6_Template, 2, 0, "small");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_21_0;
    const sesion_r15 = \u0275\u0275nextContext().$implicit;
    const ctx_r4 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r4.capacidadSesion(sesion_r15["id_actividad_sesion"]) ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !ctx_r4.puedeFinalizar(sesion_r15));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r4.finalizandoSesion() === +sesion_r15["id_actividad_sesion"] ? "Finalizando\u2026" : "Finalizar sesi\xF3n");
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_21_0 = ctx_r4.capacidadSesion(sesion_r15["id_actividad_sesion"])) == null ? null : tmp_21_0.puede_finalizarse) === false ? 6 : -1);
  }
}
function DetalleActividadComponent_Conditional_10_Conditional_51_For_2_Conditional_20_Template(rf, ctx) {
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
function DetalleActividadComponent_Conditional_10_Conditional_51_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li", 37)(1, "div", 30)(2, "div", 38)(3, "small", 39);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "h3");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "span", 18);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "p");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275template(11, DetalleActividadComponent_Conditional_10_Conditional_51_For_2_Conditional_11_Template, 2, 5, "small", 40);
    \u0275\u0275elementStart(12, "nav", 41)(13, "button", 42);
    \u0275\u0275listener("click", function DetalleActividadComponent_Conditional_10_Conditional_51_For_2_Template_button_click_13_listener() {
      const sesion_r15 = \u0275\u0275restoreView(_r13).$implicit;
      const ctx_r4 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r4.abrirPanel("detalle", sesion_r15));
    });
    \u0275\u0275elementStart(14, "span", 8);
    \u0275\u0275text(15, "visibility");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(16, DetalleActividadComponent_Conditional_10_Conditional_51_For_2_Conditional_16_Template, 3, 1, "button", 43)(17, DetalleActividadComponent_Conditional_10_Conditional_51_For_2_Conditional_17_Template, 3, 1, "button", 44)(18, DetalleActividadComponent_Conditional_10_Conditional_51_For_2_Conditional_18_Template, 3, 1, "button", 45);
    \u0275\u0275elementEnd();
    \u0275\u0275template(19, DetalleActividadComponent_Conditional_10_Conditional_51_For_2_Conditional_19_Template, 7, 4, "div", 46)(20, DetalleActividadComponent_Conditional_10_Conditional_51_For_2_Conditional_20_Template, 2, 1, "p", 14);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_19_0;
    let tmp_25_0;
    let tmp_31_0;
    let tmp_32_0;
    const sesion_r15 = ctx.$implicit;
    const actual_r7 = \u0275\u0275nextContext(2);
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275attribute("data-sesion-id", sesion_r15["id_actividad_sesion"])("data-actividad-id", actual_r7.id_actividad);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("Sesi\xF3n #", (tmp_19_0 = sesion_r15["numero_sesion"]) !== null && tmp_19_0 !== void 0 ? tmp_19_0 : sesion_r15["id_actividad_sesion"], "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(sesion_r15["nombre"] || "Nombre no disponible");
    \u0275\u0275advance();
    \u0275\u0275classProp("badge-exito", sesion_r15["estado"] === "Finalizada");
    \u0275\u0275attribute("data-estado", sesion_r15["estado"] || "No disponible");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(sesion_r15["estado"] || "No disponible");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate3("", ctx_r4.fecha(sesion_r15["fecha"]), " \xB7 ", sesion_r15["hora_inicio"] || "Hora no disponible", " \u2013 ", sesion_r15["hora_fin"] || "Hora no disponible", "");
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_25_0 = (tmp_25_0 = ctx_r4.capacidadSesion(sesion_r15["id_actividad_sesion"])) == null ? null : tmp_25_0.contadores) ? 11 : -1, tmp_25_0);
    \u0275\u0275advance();
    \u0275\u0275attribute("aria-label", "Opciones de " + (sesion_r15["nombre"] || "sesi\xF3n sin nombre"));
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r4.panelOcupado());
    \u0275\u0275advance(3);
    \u0275\u0275conditional((ctx_r4.auth == null ? null : ctx_r4.auth.tienePermiso("ponentes-firmantes.ver")) ? 16 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((ctx_r4.auth == null ? null : ctx_r4.auth.tienePermiso("participantes.crear")) ? 17 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((ctx_r4.auth == null ? null : ctx_r4.auth.tienePermiso("participantes.ver")) ? 18 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(sesion_r15["estado"] !== "Finalizada" && ((tmp_31_0 = ctx_r4.capacidadSesion(sesion_r15["id_actividad_sesion"])) == null ? null : tmp_31_0.finalizada) !== true ? 19 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_32_0 = ctx_r4.erroresCertificacion()[+sesion_r15["id_actividad_sesion"]]) ? 20 : -1, tmp_32_0);
  }
}
function DetalleActividadComponent_Conditional_10_Conditional_51_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ul", 33);
    \u0275\u0275repeaterCreate(1, DetalleActividadComponent_Conditional_10_Conditional_51_For_2_Template, 21, 19, "li", 37, _forTrack12);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r4.sesiones());
  }
}
function DetalleActividadComponent_Conditional_10_Conditional_52_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 10);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 22);
    \u0275\u0275listener("click", function DetalleActividadComponent_Conditional_10_Conditional_52_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r21);
      const ctx_r4 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r4.cargarResumen());
    });
    \u0275\u0275text(3, "Reintentar resumen de asistencia");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r4.errorResumen());
  }
}
function DetalleActividadComponent_Conditional_10_Conditional_53_Template(rf, ctx) {
  if (rf & 1) {
    const _r22 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "footer", 34)(1, "button", 35);
    \u0275\u0275listener("click", function DetalleActividadComponent_Conditional_10_Conditional_53_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r22);
      const actual_r7 = \u0275\u0275nextContext();
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.cerrarActividad.emit(actual_r7));
    });
    \u0275\u0275elementStart(2, "span", 8);
    \u0275\u0275text(3, "lock");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, "Cerrar actividad");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const actual_r7 = \u0275\u0275nextContext();
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("disabled", actual_r7.estado !== "Activa" || ctx_r4.operando() || ctx_r4.panelOcupado());
  }
}
function DetalleActividadComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11)(1, "section", 23)(2, "h2", 24);
    \u0275\u0275text(3, "Resumen de la actividad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "dl", 25)(5, "div")(6, "dt");
    \u0275\u0275text(7, "\xC1rea municipal");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "dd");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div")(11, "dt");
    \u0275\u0275text(12, "Tipo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "dd");
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "div")(16, "dt");
    \u0275\u0275text(17, "Fechas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "dd");
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "div")(21, "dt");
    \u0275\u0275text(22, "Origen");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "dd");
    \u0275\u0275text(24);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(25, "dl", 26)(26, "div")(27, "dt");
    \u0275\u0275text(28, "Participantes inscritos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "dd");
    \u0275\u0275text(30);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(31, "div")(32, "dt");
    \u0275\u0275text(33, "Sesiones programadas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "dd");
    \u0275\u0275text(35);
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(36, DetalleActividadComponent_Conditional_10_Conditional_36_Template, 3, 2, "dl", 27)(37, DetalleActividadComponent_Conditional_10_Conditional_37_Template, 2, 0, "p", 10)(38, DetalleActividadComponent_Conditional_10_Conditional_38_Template, 4, 1);
    \u0275\u0275repeaterCreate(39, DetalleActividadComponent_Conditional_10_For_40_Template, 4, 3, null, null, _forTrack02);
    \u0275\u0275elementEnd();
    \u0275\u0275template(41, DetalleActividadComponent_Conditional_10_Conditional_41_Template, 2, 1, "p", 28);
    \u0275\u0275elementStart(42, "section", 29)(43, "div", 30)(44, "h2", 31);
    \u0275\u0275text(45, "Sesiones de la actividad");
    \u0275\u0275elementEnd();
    \u0275\u0275template(46, DetalleActividadComponent_Conditional_10_Conditional_46_Template, 4, 1, "button", 32);
    \u0275\u0275elementEnd();
    \u0275\u0275template(47, DetalleActividadComponent_Conditional_10_Conditional_47_Template, 2, 0, "p", 10)(48, DetalleActividadComponent_Conditional_10_Conditional_48_Template, 4, 1)(49, DetalleActividadComponent_Conditional_10_Conditional_49_Template, 2, 0, "p")(50, DetalleActividadComponent_Conditional_10_Conditional_50_Template, 2, 0, "p")(51, DetalleActividadComponent_Conditional_10_Conditional_51_Template, 3, 0, "ul", 33);
    \u0275\u0275elementEnd();
    \u0275\u0275template(52, DetalleActividadComponent_Conditional_10_Conditional_52_Template, 4, 1)(53, DetalleActividadComponent_Conditional_10_Conditional_53_Template, 5, 1, "footer", 34);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_12_0;
    const actual_r7 = ctx;
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance(8);
    \u0275\u0275attribute("aria-busy", ctx_r4.cargandoArea());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r4.cargandoArea() ? "Cargando \xE1rea\u2026" : ctx_r4.area());
    \u0275\u0275advance(4);
    \u0275\u0275attribute("aria-busy", ctx_r4.cargandoTipo());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r4.cargandoTipo() ? "Cargando tipo\u2026" : ctx_r4.tipo());
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate2("", ctx_r4.fecha(actual_r7.fecha_inicio), " \u2013 ", ctx_r4.fecha(actual_r7.fecha_fin), "");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(actual_r7.origen === "solicitud" ? "Solicitud aprobada" : actual_r7.origen === "sin_solicitud" ? "Registro administrativo directo" : "Origen no informado");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate((tmp_12_0 = (tmp_12_0 = ctx_r4.contadoresActividad()) == null ? null : tmp_12_0.inscritos_actividad_vigentes) !== null && tmp_12_0 !== void 0 ? tmp_12_0 : "No informado");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r4.cargandoSesiones() ? "Consultando\u2026" : ctx_r4.errorSesiones() || !(ctx_r4.auth == null ? null : ctx_r4.auth.tienePermiso("actividades.ver")) ? "No disponible" : ctx_r4.sesiones().length);
    \u0275\u0275advance();
    \u0275\u0275conditional(actual_r7.descripcion || actual_r7.sede ? 36 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r4.avisoCatalogos() ? 37 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r4.errorParticipantes() ? 38 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r4.avisosParticipantes());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r4.avisoInscripcion() ? 41 : -1);
    \u0275\u0275advance();
    \u0275\u0275attribute("aria-busy", ctx_r4.cargandoSesiones());
    \u0275\u0275advance(4);
    \u0275\u0275conditional((ctx_r4.auth == null ? null : ctx_r4.auth.tienePermiso("actividades.crear")) ? 46 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r4.cargandoSesiones() ? 47 : ctx_r4.errorSesiones() ? 48 : !(ctx_r4.auth == null ? null : ctx_r4.auth.tienePermiso("actividades.ver")) ? 49 : !ctx_r4.sesiones().length ? 50 : 51);
    \u0275\u0275advance(5);
    \u0275\u0275conditional(ctx_r4.errorResumen() ? 52 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((ctx_r4.auth == null ? null : ctx_r4.auth.tienePermiso("actividades.editar")) ? 53 : -1);
  }
}
function DetalleActividadComponent_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r23 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "Actividad: ");
    \u0275\u0275elementStart(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "app-formulario-emision", 52, 4);
    \u0275\u0275listener("guardado", function DetalleActividadComponent_Conditional_13_Template_app_formulario_emision_guardado_4_listener() {
      \u0275\u0275restoreView(_r23);
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.sesionGuardada());
    })("cancelar", function DetalleActividadComponent_Conditional_13_Template_app_formulario_emision_cancelar_4_listener() {
      \u0275\u0275restoreView(_r23);
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.cerrarSesion());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_6_0;
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((tmp_6_0 = ctx_r4.actividad()) == null ? null : tmp_6_0.nombre);
    \u0275\u0275advance();
    \u0275\u0275property("id", ctx_r4.sesionEditando())("enDialogo", true)("actividadContexto", ctx_r4.actividadContexto());
  }
}
function DetalleActividadComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 10);
    \u0275\u0275text(1, "Consultando sesi\xF3n\u2026");
    \u0275\u0275elementEnd();
  }
}
function DetalleActividadComponent_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 14);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r4.errorDetalleSesion());
  }
}
function DetalleActividadComponent_Conditional_18_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "dt");
    \u0275\u0275text(2, "Lugar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "dd");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const detalle_r24 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(detalle_r24["lugar"]);
  }
}
function DetalleActividadComponent_Conditional_18_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r25 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 22);
    \u0275\u0275listener("click", function DetalleActividadComponent_Conditional_18_Conditional_24_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r25);
      const ctx_r4 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r4.editarSesion());
    });
    \u0275\u0275text(1, "Editar sesi\xF3n");
    \u0275\u0275elementEnd();
  }
}
function DetalleActividadComponent_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "h3");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dl", 25)(3, "div")(4, "dt");
    \u0275\u0275text(5, "Fecha");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "dd");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div")(9, "dt");
    \u0275\u0275text(10, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "dd");
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div")(14, "dt");
    \u0275\u0275text(15, "Inicio");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "dd");
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "div")(19, "dt");
    \u0275\u0275text(20, "Fin");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "dd");
    \u0275\u0275text(22);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(23, DetalleActividadComponent_Conditional_18_Conditional_23_Template, 5, 1, "div");
    \u0275\u0275elementEnd();
    \u0275\u0275template(24, DetalleActividadComponent_Conditional_18_Conditional_24_Template, 2, 0, "button", 53);
  }
  if (rf & 2) {
    const detalle_r24 = ctx;
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(detalle_r24["nombre"]);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r4.fecha(detalle_r24["fecha"]));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(detalle_r24["estado"] || "No disponible");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(detalle_r24["hora_inicio"]);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(detalle_r24["hora_fin"]);
    \u0275\u0275advance();
    \u0275\u0275conditional(detalle_r24["lugar"] ? 23 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((ctx_r4.auth == null ? null : ctx_r4.auth.tienePermiso("actividades.editar")) ? 24 : -1);
  }
}
function DetalleActividadComponent_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r26 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-listar-participantes", 54);
    \u0275\u0275listener("inscripcionGuardada", function DetalleActividadComponent_Conditional_19_Template_app_listar_participantes_inscripcionGuardada_0_listener() {
      \u0275\u0275restoreView(_r26);
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.inscripcionGuardada());
    })("formularioCerrado", function DetalleActividadComponent_Conditional_19_Template_app_listar_participantes_formularioCerrado_0_listener() {
      \u0275\u0275restoreView(_r26);
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.contextoInscripcion.set(null));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275property("contextoIntegrado", ctx);
  }
}
function DetalleActividadComponent_Conditional_22_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-ponentes-sesion-actividad", 55);
  }
  if (rf & 2) {
    let tmp_9_0;
    const sesion_r27 = \u0275\u0275nextContext();
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275property("actividad", ctx)("sesion", \u0275\u0275pureFunction3(2, _c5, +sesion_r27["id_actividad_sesion"], "" + ((tmp_9_0 = sesion_r27["numero_sesion"]) !== null && tmp_9_0 !== void 0 ? tmp_9_0 : sesion_r27["id_actividad_sesion"]), ctx_r4.fecha(sesion_r27["fecha"])));
  }
}
function DetalleActividadComponent_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, DetalleActividadComponent_Conditional_22_Conditional_0_Template, 1, 6, "app-ponentes-sesion-actividad", 55);
  }
  if (rf & 2) {
    let tmp_6_0;
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275conditional((tmp_6_0 = ctx_r4.actividadContexto()) ? 0 : -1, tmp_6_0);
  }
}
var DetalleActividadComponent = class _DetalleActividadComponent {
  auth = inject(AuthService, { optional: true });
  actividadId = input(null);
  revision = input(0);
  solicitudRuta = input(null);
  operando = input(false);
  volver = output();
  editarActividad = output();
  cerrarActividad = output();
  capacidadesSesiones = signal(/* @__PURE__ */ new Map());
  erroresCertificacion = signal({});
  cargandoCapacidades = signal([]);
  finalizandoSesion = signal(null);
  confirmarFinalizacion = viewChild.required("confirmarFinalizacion");
  capacidadSesion(id) {
    return this.capacidadesSesiones().get(Number(id));
  }
  cargarCapacidades(sesion, evento) {
    if (evento && !evento.target.open)
      return;
    const id = Number(sesion["id_actividad_sesion"]);
    if (!this.sesiones().includes(sesion) || this.cargandoCapacidades().includes(id))
      return;
    this.capacidadesSesiones.update((m) => {
      const nuevo = new Map(m);
      nuevo.delete(id);
      return nuevo;
    });
    this.cargandoCapacidades.update((ids) => [...ids, id]);
    this.erroresCertificacion.update((e) => __spreadProps(__spreadValues({}, e), { [id]: "" }));
    const actividad = this.actividadId();
    this.solicitudes.add(this.sesionesApi.estadoSesionCertificacion(id).subscribe({
      next: (estado) => {
        this.cargandoCapacidades.update((ids) => ids.filter((i) => i !== id));
        if (Number(estado.id_actividad) !== actividad || Number(estado.id_actividad_sesion) !== id) {
          this.erroresCertificacion.update((e) => __spreadProps(__spreadValues({}, e), { [id]: "Laravel no confirm\xF3 la sesi\xF3n de esta actividad." }));
          return;
        }
        this.capacidadesSesiones.update((actual) => new Map(actual).set(id, estado));
        this.sesiones.update((filas) => filas.map((f) => Number(f["id_actividad_sesion"]) === id ? __spreadProps(__spreadValues({}, f), { estado: estado.estado }) : f));
      },
      error: (error) => {
        this.cargandoCapacidades.update((ids) => ids.filter((i) => i !== id));
        this.erroresCertificacion.update((e) => __spreadProps(__spreadValues({}, e), { [id]: `HTTP ${error.status || 0}. ${error.mensaje}` }));
      }
    }));
  }
  puedeFinalizar(sesion) {
    return this.sesiones().includes(sesion) && Number(sesion["id_actividad"]) === this.actividadId() && this.capacidadSesion(sesion["id_actividad_sesion"])?.finalizada !== true && this.capacidadSesion(sesion["id_actividad_sesion"])?.puede_finalizarse === true && this.finalizandoSesion() === null && !this.panelOcupado();
  }
  contadoresActividad = computed(() => [...this.capacidadesSesiones().values()].find((s) => s.id_actividad === this.actividadId() && s.contadores)?.contadores);
  puedeCertificar(sesion) {
    const estado = this.capacidadSesion(sesion["id_actividad_sesion"]);
    return this.auth?.tienePermiso("emision.ver") === true && this.auth?.tienePermiso("emision.crear") === true && this.auth?.tienePermiso("participantes.ver") === true && estado?.estado === "Finalizada" && estado.puede_certificarse === true;
  }
  finalizarSesion(sesion) {
    return __async(this, null, function* () {
      if (!this.puedeFinalizar(sesion) || !(yield this.confirmarFinalizacion().abrir()) || !this.puedeFinalizar(sesion))
        return;
      const id = Number(sesion["id_actividad_sesion"]);
      const actividad = this.actividadId();
      this.finalizandoSesion.set(id);
      this.solicitudes.add(this.sesionesApi.finalizarSesion(id, actividad).pipe(switchMap((resultado) => {
        if (!resultado.finalizada || resultado.sesion.estado !== "Finalizada" || Number(resultado.sesion.id_actividad_sesion) !== id || Number(resultado.sesion.id_actividad) !== actividad)
          throw new Error("No se pudo confirmar la finalizaci\xF3n de la sesi\xF3n.");
        this.sesiones.update((filas) => filas.map((f) => Number(f["id_actividad_sesion"]) === id ? __spreadProps(__spreadValues({}, f), { estado: resultado.sesion.estado }) : f));
        this.detallesSesiones.delete(id);
        this.capacidadesSesiones.update((m) => {
          const nuevo = new Map(m);
          nuevo.delete(id);
          return nuevo;
        });
        return this.sesionesApi.estadoSesionCertificacion(id);
      })).subscribe({ next: (estado) => {
        this.finalizandoSesion.set(null);
        if (estado.estado !== "Finalizada" || Number(estado.id_actividad_sesion) !== id || Number(estado.id_actividad) !== actividad) {
          this.erroresCertificacion.update((e) => __spreadProps(__spreadValues({}, e), { [id]: "No se pudo confirmar el estado final de la sesi\xF3n." }));
          return;
        }
        this.capacidadesSesiones.update((m) => new Map(m).set(id, estado));
        this.sesiones.update((filas) => filas.map((f) => Number(f["id_actividad_sesion"]) === id ? __spreadProps(__spreadValues({}, f), { estado: estado.estado }) : f));
        if (Number(this.sesionActiva()?.["id_actividad_sesion"]) === id)
          this.sesionActiva.update((s) => s ? __spreadProps(__spreadValues({}, s), { estado: estado.estado }) : s);
        this.detallesSesiones.delete(id);
      }, error: (error) => {
        this.finalizandoSesion.set(null);
        this.erroresCertificacion.update((e) => __spreadProps(__spreadValues({}, e), { [id]: [error.status ? `HTTP ${error.status}.` : "", error.mensaje || error.message, ...Object.values(error.errores ?? {}).flat()].join(" ") }));
        this.capacidadesSesiones.update((m) => {
          const nuevo = new Map(m);
          nuevo.delete(id);
          return nuevo;
        });
      } }));
    });
  }
  router = inject(Router);
  sesionActiva = signal(null);
  sesionPonentes = signal(null);
  modalPonentesSesion = viewChild.required("modalPonentesSesion");
  contextoInscripcion = signal(null);
  avisoInscripcion = signal(null);
  modalDetalle = viewChild.required("modalDetalle");
  panelOcupado() {
    return false;
  }
  abrirPanel(panel, sesion) {
    if (this.panelOcupado() || !this.sesiones().includes(sesion))
      return;
    if (panel === "ponentes" && !this.auth?.tienePermiso("ponentes-firmantes.ver") || panel === "asistencia" && !this.auth?.tienePermiso("participantes.ver"))
      return;
    this.sesionActiva.set(sesion);
    if (panel === "detalle") {
      this.verSesion(sesion);
      this.modalDetalle().abrir();
    }
    if (panel === "ponentes") {
      this.sesionPonentes.set(sesion);
      this.modalPonentesSesion().abrir();
    }
    if (panel === "asistencia")
      void this.router.navigate(["/certificaciones/actividades", this.actividadId(), "sesiones", sesion["id_actividad_sesion"], "asistencia"]);
  }
  cerrarPonentesSesion() {
    this.sesionPonentes.set(null);
  }
  abrirInscripcion(sesion) {
    const actividad = this.actividadContexto();
    if (!actividad || !this.auth?.tienePermiso("participantes.crear") || !this.sesiones().includes(sesion) || Number(sesion["id_actividad"]) !== actividad.id_actividad)
      return;
    this.avisoInscripcion.set(null);
    this.contextoInscripcion.set({ actividad, sesion: { id: Number(sesion["id_actividad_sesion"]), nombre: String(sesion["nombre"] || "Nombre no disponible") } });
  }
  inscripcionGuardada() {
    this.avisoInscripcion.set("Inscripci\xF3n confirmada en la actividad. No se ha registrado asistencia.");
    this.cargarParticipantes();
  }
  actividadContexto = computed(() => {
    const actividad = this.actividad();
    return actividad ? { id_actividad: actividad.id_actividad, nombre: actividad.nombre } : null;
  });
  detalleSesion = signal(null);
  cargandoDetalleSesion = signal(false);
  errorDetalleSesion = signal(null);
  detallesSesiones = /* @__PURE__ */ new Map();
  consultandoSesion = null;
  consultaSesion;
  formularioSesion = signal(false);
  sesionEditando = signal(null);
  modalSesion = viewChild.required("modalSesion");
  elementoSesion = viewChild.required("modalSesion", { read: ElementRef });
  editorSesion = viewChild("editorSesion");
  verSesion(sesion) {
    const actividadId = this.actividad()?.id_actividad;
    const id = Number(sesion["id_actividad_sesion"]);
    if (!this.auth?.tienePermiso("actividades.ver") || !actividadId || !Number.isSafeInteger(id) || id < 1 || !this.sesiones().includes(sesion))
      return;
    this.errorDetalleSesion.set(null);
    const previo = this.detallesSesiones.get(id);
    if (previo) {
      this.detalleSesion.set(previo);
      this.cargandoDetalleSesion.set(false);
      return;
    }
    if (this.consultandoSesion === id) {
      this.detalleSesion.set(null);
      this.cargandoDetalleSesion.set(true);
      return;
    }
    this.consultaSesion?.unsubscribe();
    this.consultandoSesion = id;
    this.detalleSesion.set(null);
    this.errorDetalleSesion.set(null);
    this.cargandoDetalleSesion.set(true);
    this.consultaSesion = this.sesionesApi.obtener("activity-session", id).subscribe({
      next: (fila) => {
        this.consultandoSesion = null;
        this.cargandoDetalleSesion.set(false);
        if (Number(fila["id_actividad"]) !== actividadId || Number(fila["id_actividad_sesion"]) !== id) {
          this.errorDetalleSesion.set("No se pudo verificar la sesi\xF3n de esta actividad.");
          return;
        }
        this.detalleSesion.set(fila);
        this.detallesSesiones.set(id, fila);
      },
      error: (error) => {
        this.consultandoSesion = null;
        this.cargandoDetalleSesion.set(false);
        this.errorDetalleSesion.set(this.mensaje(error, "la sesi\xF3n"));
      }
    });
    this.solicitudes.add(this.consultaSesion);
  }
  abrirSesion() {
    if (!this.actividad() || !this.auth?.tienePermiso("actividades.crear"))
      return;
    this.sesionEditando.set(null);
    this.formularioSesion.set(true);
    this.modalSesion().abrir();
  }
  editarSesion() {
    const sesion = this.detalleSesion();
    if (!sesion || !this.auth?.tienePermiso("actividades.editar") || this.panelOcupado())
      return;
    this.sesionEditando.set(Number(sesion["id_actividad_sesion"]));
    this.formularioSesion.set(true);
    this.modalSesion().abrir();
  }
  cerrarSesion(evento) {
    evento?.preventDefault();
    if (this.editorSesion()?.enviando())
      return;
    this.modalSesion().cerrar();
    this.formularioSesion.set(false);
  }
  sesionGuardada() {
    const id = this.sesionEditando();
    if (id)
      this.detallesSesiones.delete(id);
    this.cerrarSesion();
    this.cargarSesiones();
    if (id && this.sesionActiva())
      this.verSesion(this.sesionActiva());
  }
  sesionesApi = inject(EmisionCertificadosService);
  sesiones = signal([]);
  errorSesiones = signal(null);
  cargandoSesiones = signal(false);
  asistencias = signal([]);
  errorResumen = signal(null);
  cargandoResumen = signal(false);
  listo = signal(false);
  actividades = inject(ActividadesService);
  relaciones = inject(DetalleActividadService);
  personas = inject(PersonService);
  destroyRef = inject(DestroyRef);
  solicitudes = new Subscription();
  actividad = signal(null);
  cargando = signal(true);
  error = signal(null);
  sinSeleccion = signal(false);
  area = signal("No disponible");
  tipo = signal("No disponible");
  cargandoArea = signal(false);
  cargandoTipo = signal(false);
  avisoCatalogos = signal(false);
  participantes = signal([]);
  cargandoParticipantes = signal(true);
  errorParticipantes = signal(null);
  avisosParticipantes = signal([]);
  reintentando = signal([]);
  reintentosParticipantes = new Subject();
  fuentePersonas;
  consultaParticipantes;
  constructor() {
    this.destroyRef.onDestroy(() => this.solicitudes.unsubscribe());
    afterNextRender(() => {
      this.listo.set(true);
      const dialogo = this.elementoSesion().nativeElement.querySelector("dialog");
      const cancelar = (evento) => this.cerrarSesion(evento);
      dialogo.addEventListener("cancel", cancelar);
      this.destroyRef.onDestroy(() => dialogo.removeEventListener("cancel", cancelar));
    });
    effect(() => {
      this.actividadId();
      if (this.listo())
        untracked(() => this.cargar());
    }, { allowSignalWrites: true });
    effect(() => {
      const revision = this.revision();
      if (this.listo() && revision > 0)
        untracked(() => {
          const id = this.actividad()?.id_actividad;
          if (!id)
            return;
          this.solicitudes.add(this.actividades.obtener(id).subscribe({
            next: (actividad) => {
              if (actividad.id_actividad === id) {
                this.actividad.set(actividad);
                this.cargarCatalogos(actividad);
              }
            },
            error: (error) => this.error.set(this.mensaje(error, "la informaci\xF3n actualizada de la actividad"))
          }));
        });
    }, { allowSignalWrites: true });
  }
  cargar() {
    if (this.formularioSesion())
      this.modalSesion().cerrar();
    this.solicitudes.unsubscribe();
    this.solicitudes = new Subscription();
    this.actividad.set(null);
    this.error.set(null);
    this.cargando.set(true);
    this.sinSeleccion.set(false);
    this.participantes.set([]);
    this.formularioSesion.set(false);
    this.detalleSesion.set(null);
    this.errorDetalleSesion.set(null);
    this.cargandoDetalleSesion.set(false);
    this.detallesSesiones.clear();
    this.consultandoSesion = null;
    this.modalDetalle().cerrar();
    this.modalPonentesSesion().cerrar();
    this.sesionPonentes.set(null);
    this.contextoInscripcion.set(null);
    this.avisoInscripcion.set(null);
    this.sesionActiva.set(null);
    this.capacidadesSesiones.set(/* @__PURE__ */ new Map());
    this.erroresCertificacion.set({});
    this.cargandoCapacidades.set([]);
    this.finalizandoSesion.set(null);
    this.sesiones.set([]);
    this.errorSesiones.set(null);
    this.cargandoSesiones.set(false);
    this.asistencias.set([]);
    this.errorResumen.set(null);
    this.cargandoResumen.set(false);
    this.errorParticipantes.set(null);
    this.avisosParticipantes.set([]);
    this.reintentando.set([]);
    this.cargandoParticipantes.set(true);
    this.area.set("No disponible");
    this.tipo.set("No disponible");
    this.avisoCatalogos.set(false);
    const seleccion = this.actividadId();
    if (seleccion === null) {
      this.sinSeleccion.set(true);
      this.cargando.set(false);
      this.cargandoParticipantes.set(false);
      return;
    }
    const id = Number(seleccion);
    if (!Number.isSafeInteger(id) || id < 1) {
      this.error.set("La actividad solicitada no es v\xE1lida.");
      this.cargando.set(false);
      return;
    }
    this.solicitudes.add(this.actividades.obtener(id).subscribe({
      next: (actividad) => {
        if (actividad.id_actividad !== id) {
          this.error.set("No se pudo verificar la actividad solicitada.");
          this.cargando.set(false);
          return;
        }
        this.actividad.set(actividad);
        this.cargando.set(false);
        if (this.auth?.tienePermiso("actividades.ver"))
          this.cargarSesiones();
        if (this.auth?.tienePermiso("participantes.ver"))
          this.cargarResumen();
        this.cargarCatalogos(actividad);
        const personas = this.personas.listar().pipe(shareReplay({ bufferSize: 1, refCount: true }));
        this.fuentePersonas = personas;
        this.cargarParticipantes();
      },
      error: (error) => {
        this.error.set(this.mensaje(error, "la actividad"));
        this.cargando.set(false);
      }
    }));
  }
  cargarResumen() {
    this.cargandoResumen.set(true);
    this.errorResumen.set(null);
    this.solicitudes.add(this.sesionesApi.listarTodos("attendance").subscribe({
      next: (filas) => {
        this.asistencias.set(filas);
        this.cargandoResumen.set(false);
      },
      error: (error) => {
        this.errorResumen.set(this.mensaje(error, "el resumen de asistencia"));
        this.cargandoResumen.set(false);
      }
    }));
  }
  cargarSesiones() {
    const id = this.actividad()?.id_actividad;
    if (!id || this.cargandoSesiones())
      return;
    this.cargandoSesiones.set(true);
    this.errorSesiones.set(null);
    this.solicitudes.add(this.sesionesApi.listarTodos("activity-session").subscribe({
      next: (filas) => {
        const sesiones = filas.filter((fila) => Number(fila["id_actividad"]) === id);
        this.sesiones.set(sesiones);
        this.capacidadesSesiones.update((actual) => {
          const mapa = new Map(actual);
          for (const sesion of sesiones)
            if (typeof sesion["puede_finalizarse"] === "boolean" || sesion["contadores"])
              mapa.set(Number(sesion["id_actividad_sesion"]), sesion);
          return mapa;
        });
        const seleccionada = this.sesionActiva();
        if (seleccionada) {
          const actual = sesiones.find((s) => Number(s["id_actividad_sesion"]) === Number(seleccionada["id_actividad_sesion"]));
          this.sesionActiva.set(actual ?? null);
          if (!actual) {
            this.modalDetalle().cerrar();
          }
        }
        this.cargandoSesiones.set(false);
      },
      error: (error) => {
        this.errorSesiones.set(this.mensaje(error, "las sesiones"));
        this.cargandoSesiones.set(false);
      }
    }));
  }
  reintentarCatalogo(recurso) {
    if (this.reintentando().includes(recurso))
      return;
    this.reintentando.update((valores) => [...valores, recurso]);
    this.reintentosParticipantes.next(recurso);
  }
  cargarParticipantes() {
    const id = this.actividad()?.id_actividad;
    if (!id || !this.fuentePersonas)
      return;
    this.consultaParticipantes?.unsubscribe();
    this.errorParticipantes.set(null);
    this.cargandoParticipantes.set(true);
    this.consultaParticipantes = this.relaciones.consultarParticipantes(id, this.fuentePersonas, (recurso, error) => {
      this.reintentando.update((valores) => valores.filter((valor) => valor !== recurso));
      this.avisosParticipantes.update((avisos) => {
        const anteriores = avisos.filter((aviso) => aviso.recurso !== recurso);
        if (!error)
          return anteriores;
        const ruta = { personas: "/persons/list", tiposParticipacion: "/participation-type" }[recurso];
        const respuesta = error;
        return [...anteriores, { recurso, mensaje: `No se pudo consultar ${ruta}${respuesta.status ? ` (HTTP ${respuesta.status})` : ""}. ${respuesta.mensaje || respuesta.error?.message || "Informaci\xF3n auxiliar no disponible."}` }];
      });
    }, this.reintentosParticipantes).subscribe({
      next: (filas) => {
        this.participantes.set(filas);
        this.cargandoParticipantes.set(false);
      },
      error: (error) => {
        this.errorParticipantes.set(this.mensaje(error, "los participantes (/participation)"));
        this.cargandoParticipantes.set(false);
      }
    });
    this.solicitudes.add(this.consultaParticipantes);
  }
  cargarCatalogos(actividad) {
    this.cargandoArea.set(!actividad.area_nombre);
    this.cargandoTipo.set(!actividad.tipo_actividad_nombre);
    if (actividad.area_nombre)
      this.area.set(actividad.area_nombre);
    else
      this.solicitudes.add(this.actividades.listarAreas().subscribe({
        next: (filas) => {
          this.area.set(filas.find((fila) => fila.id_area === actividad.id_area)?.nombre || "No disponible");
          this.cargandoArea.set(false);
        },
        error: () => {
          this.avisoCatalogos.set(true);
          this.cargandoArea.set(false);
        }
      }));
    if (actividad.tipo_actividad_nombre)
      this.tipo.set(actividad.tipo_actividad_nombre);
    else
      this.solicitudes.add(this.actividades.listarTipos().subscribe({
        next: (filas) => {
          this.tipo.set(filas.find((fila) => fila.id_tipo_actividad === actividad.id_tipo_actividad)?.nombre || "No disponible");
          this.cargandoTipo.set(false);
        },
        error: () => {
          this.avisoCatalogos.set(true);
          this.cargandoTipo.set(false);
        }
      }));
  }
  fecha(valor) {
    if (!valor)
      return "No disponible";
    const partes = valor.slice(0, 10).split("-");
    return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : "No disponible";
  }
  mensaje(error, recurso) {
    const status = error?.status;
    if (status === 403)
      return `Laravel deneg\xF3 la consulta de ${recurso} (HTTP 403).`;
    if (status === 0)
      return `No se pudo conectar para consultar ${recurso}. Comprueba la conexi\xF3n e intenta nuevamente.`;
    if (status === 404)
      return "La actividad solicitada no est\xE1 disponible.";
    return `No se pudo cargar ${recurso}. Intenta nuevamente.`;
  }
  static \u0275fac = function DetalleActividadComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DetalleActividadComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DetalleActividadComponent, selectors: [["app-detalle-actividad"]], viewQuery: function DetalleActividadComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuerySignal(ctx.confirmarFinalizacion, _c0, 5);
      \u0275\u0275viewQuerySignal(ctx.modalPonentesSesion, _c1, 5);
      \u0275\u0275viewQuerySignal(ctx.modalDetalle, _c2, 5);
      \u0275\u0275viewQuerySignal(ctx.modalSesion, _c3, 5);
      \u0275\u0275viewQuerySignal(ctx.elementoSesion, _c3, 5, ElementRef);
      \u0275\u0275viewQuerySignal(ctx.editorSesion, _c4, 5);
    }
    if (rf & 2) {
      \u0275\u0275queryAdvance(6);
    }
  }, inputs: { actividadId: [1, "actividadId"], revision: [1, "revision"], solicitudRuta: [1, "solicitudRuta"], operando: [1, "operando"] }, outputs: { volver: "volver", editarActividad: "editarActividad", cerrarActividad: "cerrarActividad" }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 25, vars: 15, consts: [["modalSesion", ""], ["modalDetalle", ""], ["modalPonentesSesion", ""], ["confirmarFinalizacion", ""], ["editorSesion", ""], ["aria-label", "Detalle de la actividad seleccionada"], [1, "encabezado"], ["type", "button", "title", "Volver a actividades", "aria-label", "Volver a actividades", 1, "btn", "btn-icono", "btn-sin-borde", "volver-actividad", 3, "click", "disabled"], ["aria-hidden", "true", 1, "material-symbols-outlined"], [1, "identidad"], ["role", "status"], [1, "tarjetas-detalle"], [1, "modal-sesion-detalle", 3, "cierreSolicitado", "cerrado", "titulo", "mostrarCerrar", "cierreControlado"], ["titulo", "Detalle de sesi\xF3n", 1, "modal-detalle-sesion", 3, "mostrarCerrar"], ["role", "alert"], [3, "contextoIntegrado"], ["titulo", "Ponentes de la sesi\xF3n", 1, "modal-ponentes-sesion", 3, "cerrado", "mostrarCerrar"], ["titulo", "Finalizar sesi\xF3n", "texto", "Se consolidar\xE1 la asistencia de esta sesi\xF3n seg\xFAn la pol\xEDtica institucional. La actividad conservar\xE1 su estado. La asistencia finalizada requiere regularizaci\xF3n autorizada.", "confirmar", "Finalizar sesi\xF3n"], [1, "badge"], ["aria-label", "Acciones de la actividad"], ["type", "button", "aria-label", "Editar", "title", "Editar", 1, "btn", "btn-icono", 3, "click", "disabled"], ["role", "alert", 1, "alert", "alert-error"], ["type", "button", 1, "btn", 3, "click"], ["aria-labelledby", "titulo-informacion", 1, "panel", "resumen-actividad"], ["id", "titulo-informacion", 1, "sr-only"], [1, "informacion"], ["aria-label", "Totales de la actividad", 1, "indicadores"], [1, "informacion", "informacion-adicional"], ["role", "status", 1, "alert", "alert-exito"], ["aria-labelledby", "titulo-sesiones", 1, "panel", "sesiones"], [1, "titulo-panel"], ["id", "titulo-sesiones"], ["type", "button", 1, "btn", "accion-principal", 3, "disabled"], [1, "lista-sesiones"], ["aria-label", "Cierre de la actividad"], ["type", "button", 1, "btn", 3, "click", "disabled"], ["type", "button", 1, "btn", "accion-principal", 3, "click", "disabled"], [1, "tarjeta-sesion"], [1, "identidad-sesion"], [1, "numero-sesion"], [1, "resumen-sesion"], [1, "acciones-sesion"], ["type", "button", "title", "Detalle de sesi\xF3n", "aria-label", "Detalle de sesi\xF3n", 1, "btn", 3, "click", "disabled"], ["type", "button", "title", "Asignar ponentes", "aria-label", "Asignar ponentes", 1, "btn", 3, "disabled"], ["type", "button", "title", "Inscribir participante en la actividad", "aria-label", "Inscribir participante", 1, "btn", 3, "disabled"], ["type", "button", "title", "Control de asistencia", "aria-label", "Asistencia de sesi\xF3n", 1, "btn", "asistencia-principal", 3, "disabled"], [1, "cierre-sesion"], ["type", "button", "title", "Asignar ponentes", "aria-label", "Asignar ponentes", 1, "btn", 3, "click", "disabled"], ["type", "button", "title", "Inscribir participante en la actividad", "aria-label", "Inscribir participante", 1, "btn", 3, "click", "disabled"], ["type", "button", "title", "Control de asistencia", "aria-label", "Asistencia de sesi\xF3n", 1, "btn", "asistencia-principal", 3, "click", "disabled"], ["type", "button", 1, "btn", 3, "disabled"], ["type", "button", "title", "Finalizar sesi\xF3n", "aria-label", "Finalizar sesi\xF3n", 1, "btn", 3, "click", "disabled"], ["recurso", "activity-session", 3, "guardado", "cancelar", "id", "enDialogo", "actividadContexto"], ["type", "button", 1, "btn"], [3, "inscripcionGuardada", "formularioCerrado", "contextoIntegrado"], [3, "actividad", "sesion"]], template: function DetalleActividadComponent_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "section", 5)(1, "div", 6)(2, "button", 7);
      \u0275\u0275listener("click", function DetalleActividadComponent_Template_button_click_2_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.volver.emit());
      });
      \u0275\u0275elementStart(3, "span", 8);
      \u0275\u0275text(4, "arrow_back");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(5, DetalleActividadComponent_Conditional_5_Template, 5, 3, "div", 9)(6, DetalleActividadComponent_Conditional_6_Template, 1, 1);
      \u0275\u0275elementEnd();
      \u0275\u0275template(7, DetalleActividadComponent_Conditional_7_Template, 2, 0, "p", 10)(8, DetalleActividadComponent_Conditional_8_Template, 2, 0, "p", 10)(9, DetalleActividadComponent_Conditional_9_Template, 4, 1)(10, DetalleActividadComponent_Conditional_10_Template, 54, 18, "div", 11);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "app-dialogo", 12, 0);
      \u0275\u0275listener("cierreSolicitado", function DetalleActividadComponent_Template_app_dialogo_cierreSolicitado_11_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.cerrarSesion());
      })("cerrado", function DetalleActividadComponent_Template_app_dialogo_cerrado_11_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.formularioSesion.set(false));
      });
      \u0275\u0275template(13, DetalleActividadComponent_Conditional_13_Template, 6, 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "app-dialogo", 13, 1);
      \u0275\u0275template(16, DetalleActividadComponent_Conditional_16_Template, 2, 0, "p", 10)(17, DetalleActividadComponent_Conditional_17_Template, 2, 1, "p", 14)(18, DetalleActividadComponent_Conditional_18_Template, 25, 7);
      \u0275\u0275elementEnd();
      \u0275\u0275template(19, DetalleActividadComponent_Conditional_19_Template, 1, 1, "app-listar-participantes", 15);
      \u0275\u0275elementStart(20, "app-dialogo", 16, 2);
      \u0275\u0275listener("cerrado", function DetalleActividadComponent_Template_app_dialogo_cerrado_20_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.cerrarPonentesSesion());
      });
      \u0275\u0275template(22, DetalleActividadComponent_Conditional_22_Template, 1, 1);
      \u0275\u0275elementEnd();
      \u0275\u0275element(23, "app-dialogo-confirmacion", 17, 3);
    }
    if (rf & 2) {
      let tmp_5_0;
      let tmp_6_0;
      let tmp_8_0;
      let tmp_15_0;
      let tmp_16_0;
      let tmp_18_0;
      \u0275\u0275advance(2);
      \u0275\u0275property("disabled", ctx.panelOcupado());
      \u0275\u0275advance(3);
      \u0275\u0275conditional((tmp_5_0 = ctx.actividad()) ? 5 : -1, tmp_5_0);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_6_0 = ctx.actividad()) ? 6 : -1, tmp_6_0);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.cargando() ? 7 : ctx.sinSeleccion() ? 8 : ctx.error() ? 9 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275conditional((tmp_8_0 = ctx.actividad()) ? 10 : -1, tmp_8_0);
      \u0275\u0275advance();
      \u0275\u0275property("titulo", ctx.sesionEditando() ? "Editar sesi\xF3n" : "Registrar sesi\xF3n")("mostrarCerrar", true)("cierreControlado", true);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.formularioSesion() ? 13 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("mostrarCerrar", true);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.cargandoDetalleSesion() ? 16 : ctx.errorDetalleSesion() ? 17 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275conditional((tmp_15_0 = ctx.detalleSesion()) ? 18 : -1, tmp_15_0);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_16_0 = ctx.contextoInscripcion()) ? 19 : -1, tmp_16_0);
      \u0275\u0275advance();
      \u0275\u0275property("mostrarCerrar", true);
      \u0275\u0275advance(2);
      \u0275\u0275conditional((tmp_18_0 = ctx.sesionPonentes()) ? 22 : -1, tmp_18_0);
    }
  }, dependencies: [PonentesSesionActividadComponent, DialogoComponent, FormularioEmisionComponent, DialogoConfirmacionComponent, ListarParticipantesComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\n.encabezado[_ngcontent-%COMP%], \n.titulo-panel[_ngcontent-%COMP%], \n.acciones-sesion[_ngcontent-%COMP%], \n.indicadores[_ngcontent-%COMP%], \n.pie-asistencia[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 0.75rem;\n}\n.encabezado[_ngcontent-%COMP%] {\n  margin-bottom: 1rem;\n}\n.identidad[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.identidad[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 1.35rem;\n  margin: 0 0 0.3rem;\n  overflow-wrap: anywhere;\n}\n.volver-actividad[_ngcontent-%COMP%] {\n  width: 2.25rem;\n  height: 2.25rem;\n  padding: 0.25rem;\n  color: #075a9b;\n}\n.tarjetas-detalle[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 1rem;\n}\n.panel[_ngcontent-%COMP%], \n.tarjeta-sesion[_ngcontent-%COMP%] {\n  min-width: 0;\n  border: 1px solid var(--neutro-200);\n  border-radius: var(--radio-lg);\n  background: var(--neutro-0);\n  padding: 1rem;\n}\n.titulo-panel[_ngcontent-%COMP%] {\n  justify-content: space-between;\n  margin-bottom: 0.6rem;\n}\n.titulo-panel[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], \n.titulo-panel[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.05rem;\n  overflow-wrap: anywhere;\n}\n.lista-sesiones[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 0.8rem;\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n.tarjeta-sesion[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.4rem;\n}\n.tarjeta-sesion[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.9rem;\n}\n.acciones-sesion[_ngcontent-%COMP%] {\n  gap: 0.45rem;\n  margin-top: 0.5rem;\n}\n.acciones-sesion[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n  width: 2.75rem;\n  height: 2.75rem;\n  padding: 0.5rem;\n  color: #075a9b;\n}\n.acciones-sesion[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 1.4rem;\n  height: 1.4rem;\n  fill: none;\n  stroke: currentColor;\n  stroke-width: 1.8;\n}\n.acciones-sesion[_ngcontent-%COMP%]   .asistencia-principal[_ngcontent-%COMP%] {\n  color: white;\n  background: #075a9b;\n}\n.informacion[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.75rem;\n  margin: 0;\n}\n.resumen-actividad[_ngcontent-%COMP%]   .informacion[_ngcontent-%COMP%] {\n  grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));\n  font-size: 0.9rem;\n}\ndt[_ngcontent-%COMP%] {\n  color: var(--neutro-500);\n  font-weight: 600;\n}\ndd[_ngcontent-%COMP%] {\n  margin: 0.2rem 0 0;\n  overflow-wrap: anywhere;\n}\n.indicadores[_ngcontent-%COMP%] {\n  margin: 0.8rem 0 0;\n}\n.indicadores[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: baseline;\n  gap: 0.5rem;\n  background: #eef5fb;\n  border-radius: 0.5rem;\n  padding: 0.4rem 0.7rem;\n}\n.indicadores[_ngcontent-%COMP%]   dt[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n}\n.indicadores[_ngcontent-%COMP%]   dd[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  font-weight: 700;\n  color: #075a9b;\n}\n.accion-principal[_ngcontent-%COMP%] {\n  background: #d6ad4a;\n  color: #192b3c;\n  border-color: #b38a2c;\n}\n.cierre-sesion[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 0.4rem;\n  margin-top: auto;\n  padding-top: 0.6rem;\n}\n.cierre-sesion[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  padding: 0.35rem 0.5rem;\n}\n.cierre-sesion[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: #52677b;\n}\n.resumen-sesion[_ngcontent-%COMP%] {\n  color: #52677b;\n  line-height: 1.5;\n}\n.tarjeta-sesion[_ngcontent-%COMP%]   .badge[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  border-radius: 1rem;\n  padding: 0.2rem 0.6rem;\n}\n.tarjeta-sesion[_ngcontent-%COMP%]   .badge-exito[_ngcontent-%COMP%] {\n  background: #e8f5ec;\n  color: #21643b;\n}\n.acciones-sesion[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 2.4rem;\n  height: 2.4rem;\n}\n[_nghost-%COMP%]     app-dialogo.modal-detalle-sesion > dialog.dialogo {\n  width: min(38rem, 100vw - 2rem);\n  max-height: calc(100dvh - 2rem);\n  overflow: auto;\n}\n[_nghost-%COMP%]     app-dialogo.modal-detalle-sesion > dialog.dialogo > h2 {\n  padding-right: 2.5rem;\n}\n@media (max-width: 1200px) {\n  .lista-sesiones[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n@media (max-width: 600px) {\n  .lista-sesiones[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .resumen-actividad[_ngcontent-%COMP%]   .informacion[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n.encabezado[_ngcontent-%COMP%] {\n  padding-bottom: 0.8rem;\n  border-bottom: 2px solid #d6ad4a;\n}\n.identidad[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 0.5rem 0.8rem;\n}\n.identidad[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #174567;\n}\n.resumen-actividad[_ngcontent-%COMP%] {\n  border-top: 3px solid #075a9b;\n}\n.informacion-adicional[_ngcontent-%COMP%] {\n  margin-top: 0.8rem;\n  padding-top: 0.8rem;\n  border-top: 1px solid var(--neutro-200);\n}\n.sesiones[_ngcontent-%COMP%] {\n  background: #f7fafd;\n}\n.sesiones[_ngcontent-%COMP%]    > .titulo-panel[_ngcontent-%COMP%] {\n  margin-bottom: 0.9rem;\n}\n.tarjeta-sesion[_ngcontent-%COMP%] {\n  border-radius: 0.65rem;\n  padding: 0.8rem;\n  gap: 0.45rem;\n}\n.tarjeta-sesion[_ngcontent-%COMP%]   .titulo-panel[_ngcontent-%COMP%] {\n  align-items: flex-start;\n  flex-wrap: nowrap;\n  gap: 0.5rem;\n  margin-bottom: 0.15rem;\n}\n.tarjeta-sesion[_ngcontent-%COMP%]   .titulo-panel[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  min-width: 0;\n  font-size: 0.95rem;\n}\n.tarjeta-sesion[_ngcontent-%COMP%]   .titulo-panel[_ngcontent-%COMP%]   .badge[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  max-width: 45%;\n  overflow-wrap: anywhere;\n}\n.acciones-sesion[_ngcontent-%COMP%] {\n  margin-top: 0.25rem;\n}\n.acciones-sesion[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n  flex: 0 0 2.4rem;\n}\nfooter[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n}\n@media (max-width: 420px) {\n  .resumen-actividad[_ngcontent-%COMP%]   .informacion[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .panel[_ngcontent-%COMP%] {\n    padding: 0.8rem;\n  }\n  .indicadores[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n    flex-wrap: wrap;\n  }\n}\n.identidad-sesion[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n[_nghost-%COMP%]     app-dialogo.modal-ponentes-sesion > dialog.dialogo {\n  width: min(44rem, 100vw - 2rem);\n  max-height: calc(100dvh - 2rem);\n  overflow-y: auto;\n  overflow-x: hidden;\n  box-sizing: border-box;\n}\n.numero-sesion[_ngcontent-%COMP%] {\n  display: block;\n  margin-bottom: 0.2rem;\n  color: #52677b;\n  font-size: 0.75rem;\n}\n/*# sourceMappingURL=detalle-actividad.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DetalleActividadComponent, { className: "DetalleActividadComponent", filePath: "src\\app\\pages\\actividades\\detalle-actividad\\detalle-actividad.component.ts", lineNumber: 23 });
})();

// src/app/pages/actividades/listar-actividades/listar-actividades.component.ts
var _c02 = ["dialogoFormulario"];
var _c12 = ["encabezado"];
var _c22 = ["dialogoDetalle"];
var _c32 = ["dialogoAcciones"];
var _c42 = ["dialogoPonentes"];
var _c52 = ["confirmarPonente"];
var _c6 = ["confirmacionEstado"];
var _forTrack03 = ($index, $item) => $item.id_area;
var _forTrack13 = ($index, $item) => $item.id_actividad;
var _forTrack2 = ($index, $item) => $item.id_actividad_ponente;
var _forTrack3 = ($index, $item) => $item.id_tipo_actividad;
var _c7 = () => [];
var _c8 = (a0) => ({ id_actividad: a0 });
var _c9 = (a0) => ({ solicitud: a0 });
function ListarActividadesComponent_a_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 64);
    \u0275\u0275text(1, "Solicitar actividad");
    \u0275\u0275elementEnd();
  }
}
function ListarActividadesComponent_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 65)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const mensaje_r2 = ctx;
    \u0275\u0275classProp("alert-exito", mensaje_r2.tipo === "exito")("alert-error", mensaje_r2.tipo === "error");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(mensaje_r2.texto);
  }
}
function ListarActividadesComponent_Conditional_19_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("\xC1reas no disponibles. ", ctx_r3.errorAreas(), "");
  }
}
function ListarActividadesComponent_Conditional_19_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Tipos de actividad no disponibles. ", ctx_r3.errorTipos(), "");
  }
}
function ListarActividadesComponent_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 23)(1, "div");
    \u0275\u0275template(2, ListarActividadesComponent_Conditional_19_Conditional_2_Template, 2, 1, "p")(3, ListarActividadesComponent_Conditional_19_Conditional_3_Template, 2, 1, "p");
    \u0275\u0275elementStart(4, "button", 49);
    \u0275\u0275listener("click", function ListarActividadesComponent_Conditional_19_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.cargarCatalogos());
    });
    \u0275\u0275text(5, "Reintentar cat\xE1logos");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r3.errorAreas() ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r3.errorTipos() ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r3.cargandoAreas() || ctx_r3.cargandoTipos());
  }
}
function ListarActividadesComponent_For_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 32);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const area_r7 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275property("value", area_r7.id_area)("selected", ctx_r3.filtros().area === "" + area_r7.id_area);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(area_r7.nombre);
  }
}
function ListarActividadesComponent_Conditional_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 21);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r3.listadoListo() ? "Actualizando actividades\u2026" : "Cargando actividades\u2026");
  }
}
function ListarActividadesComponent_Conditional_39_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 23);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 62);
    \u0275\u0275listener("click", function ListarActividadesComponent_Conditional_39_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.cargar());
    });
    \u0275\u0275text(3, "Reintentar");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("No se pudo cargar el listado de actividades. ", ctx_r3.errorCarga(), "");
  }
}
function ListarActividadesComponent_For_64_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td", 66);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th", 67);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td", 68);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td", 68);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td", 66)(14, "span", 69);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "td", 66)(17, "div", 70)(18, "button", 71);
    \u0275\u0275listener("click", function ListarActividadesComponent_For_64_Template_button_click_18_listener() {
      const actividad_r10 = \u0275\u0275restoreView(_r9).$implicit;
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.seleccionarActividad(actividad_r10));
    });
    \u0275\u0275elementStart(19, "span", 50);
    \u0275\u0275text(20, "visibility");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "button", 72);
    \u0275\u0275listener("click", function ListarActividadesComponent_For_64_Template_button_click_21_listener() {
      const actividad_r10 = \u0275\u0275restoreView(_r9).$implicit;
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.gestionar(actividad_r10));
    });
    \u0275\u0275elementStart(22, "span", 50);
    \u0275\u0275text(23, "settings");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const actividad_r10 = ctx.$implicit;
    const \u0275$index_132_r11 = ctx.$index;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275classProp("registro-inactivo", actividad_r10.estado === "Cerrada");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((ctx_r3.paginaActual() - 1) * ctx_r3.porPagina() + \u0275$index_132_r11 + 1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(actividad_r10.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r3.nombreArea(actividad_r10.id_area, actividad_r10.area_nombre));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r3.nombreTipo(actividad_r10.id_tipo_actividad, actividad_r10.tipo_actividad_nombre));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r3.fecha(actividad_r10.fecha_inicio));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r3.fecha(actividad_r10.fecha_fin));
    \u0275\u0275advance(2);
    \u0275\u0275classProp("badge-exito", actividad_r10.estado === "Activa");
    \u0275\u0275attribute("data-estado", actividad_r10.estado);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(actividad_r10.estado);
    \u0275\u0275advance(6);
    \u0275\u0275property("disabled", ctx_r3.cambiandoEstado() || ctx_r3.enviando());
  }
}
function ListarActividadesComponent_ForEmpty_65_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Cargando actividades\u2026 ");
  }
}
function ListarActividadesComponent_ForEmpty_65_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Datos del listado no disponibles. ");
  }
}
function ListarActividadesComponent_ForEmpty_65_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "A\xFAn no hay actividades registradas.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Las actividades nuevas se originan en solicitudes aprobadas por Gerencia.");
    \u0275\u0275elementEnd();
  }
}
function ListarActividadesComponent_ForEmpty_65_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " No se encontraron actividades con esos filtros. ");
  }
}
function ListarActividadesComponent_ForEmpty_65_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 73);
    \u0275\u0275template(2, ListarActividadesComponent_ForEmpty_65_Conditional_2_Template, 1, 0)(3, ListarActividadesComponent_ForEmpty_65_Conditional_3_Template, 1, 0)(4, ListarActividadesComponent_ForEmpty_65_Conditional_4_Template, 4, 0)(5, ListarActividadesComponent_ForEmpty_65_Conditional_5_Template, 1, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r3.cargando() ? 2 : ctx_r3.errorCarga() ? 3 : !ctx_r3.actividades().length ? 4 : 5);
  }
}
function ListarActividadesComponent_Conditional_68_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Cargando total\u2026 ");
  }
}
function ListarActividadesComponent_Conditional_69_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275textInterpolate3(" ", ctx_r3.rango().desde, "\u2013", ctx_r3.rango().hasta, " de ", ctx_r3.rango().total, " ");
  }
}
function ListarActividadesComponent_Conditional_92_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 21);
    \u0275\u0275text(1, "Actualizando estado\u2026");
    \u0275\u0275elementEnd();
  }
}
function ListarActividadesComponent_Conditional_94_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 74);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const mensaje_r13 = ctx;
    \u0275\u0275classProp("alert-exito", mensaje_r13.tipo === "exito")("alert-error", mensaje_r13.tipo === "error");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(mensaje_r13.texto);
  }
}
function ListarActividadesComponent_Conditional_95_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-detalle-actividad", 75);
    \u0275\u0275listener("volver", function ListarActividadesComponent_Conditional_95_Template_app_detalle_actividad_volver_0_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.volverAlListado());
    })("editarActividad", function ListarActividadesComponent_Conditional_95_Template_app_detalle_actividad_editarActividad_0_listener($event) {
      \u0275\u0275restoreView(_r14);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.ejecutar("editar", $event));
    })("cerrarActividad", function ListarActividadesComponent_Conditional_95_Template_app_detalle_actividad_cerrarActividad_0_listener($event) {
      \u0275\u0275restoreView(_r14);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.ejecutar("cerrar", $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275property("actividadId", ctx)("revision", ctx_r3.revisionDetalle())("solicitudRuta", ctx_r3.rutaSolicitud())("operando", ctx_r3.cambiandoEstado() || ctx_r3.enviando());
  }
}
function ListarActividadesComponent_Conditional_96_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "Selecciona una actividad para ver sus detalles.");
    \u0275\u0275elementEnd();
  }
}
function ListarActividadesComponent_Conditional_99_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "a", 87);
    \u0275\u0275listener("click", function ListarActividadesComponent_Conditional_99_Conditional_15_Template_a_click_0_listener() {
      \u0275\u0275restoreView(_r17);
      \u0275\u0275nextContext(2);
      const dialogoAcciones_r18 = \u0275\u0275reference(98);
      return \u0275\u0275resetView(dialogoAcciones_r18.cerrar());
    });
    \u0275\u0275elementStart(1, "span", 50);
    \u0275\u0275text(2, "groups");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4, "Participantes");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const actividad_r16 = \u0275\u0275nextContext();
    \u0275\u0275property("queryParams", \u0275\u0275pureFunction1(1, _c8, actividad_r16.id_actividad));
  }
}
function ListarActividadesComponent_Conditional_99_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "button", 81)(1, "span", 50);
    \u0275\u0275text(2, "groups");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4, "Participantes");
    \u0275\u0275elementEnd()();
  }
}
function ListarActividadesComponent_Conditional_99_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "a", 88);
    \u0275\u0275listener("click", function ListarActividadesComponent_Conditional_99_Conditional_22_Template_a_click_0_listener() {
      \u0275\u0275restoreView(_r19);
      \u0275\u0275nextContext(2);
      const dialogoAcciones_r18 = \u0275\u0275reference(98);
      return \u0275\u0275resetView(dialogoAcciones_r18.cerrar());
    });
    \u0275\u0275elementStart(1, "span", 50);
    \u0275\u0275text(2, "calendar_month");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4, "Sesiones de la actividad");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const actividad_r16 = \u0275\u0275nextContext();
    \u0275\u0275property("queryParams", \u0275\u0275pureFunction1(1, _c8, actividad_r16.id_actividad));
  }
}
function ListarActividadesComponent_Conditional_99_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "button", 84)(1, "span", 50);
    \u0275\u0275text(2, "calendar_month");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4, "Sesiones de la actividad");
    \u0275\u0275elementEnd()();
  }
}
function ListarActividadesComponent_Conditional_99_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 76);
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "span", 69);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 77)(5, "button", 78);
    \u0275\u0275listener("click", function ListarActividadesComponent_Conditional_99_Template_button_click_5_listener() {
      const actividad_r16 = \u0275\u0275restoreView(_r15);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.ejecutar("detalle", actividad_r16));
    });
    \u0275\u0275elementStart(6, "span", 50);
    \u0275\u0275text(7, "visibility");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span");
    \u0275\u0275text(9, "Ver detalle");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "button", 79);
    \u0275\u0275listener("click", function ListarActividadesComponent_Conditional_99_Template_button_click_10_listener() {
      const actividad_r16 = \u0275\u0275restoreView(_r15);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.ejecutar("editar", actividad_r16));
    });
    \u0275\u0275elementStart(11, "span", 50);
    \u0275\u0275text(12, "edit");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "span");
    \u0275\u0275text(14, "Editar");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(15, ListarActividadesComponent_Conditional_99_Conditional_15_Template, 5, 3, "a", 80)(16, ListarActividadesComponent_Conditional_99_Conditional_16_Template, 5, 0, "button", 81);
    \u0275\u0275elementStart(17, "button", 82);
    \u0275\u0275listener("click", function ListarActividadesComponent_Conditional_99_Template_button_click_17_listener() {
      const actividad_r16 = \u0275\u0275restoreView(_r15);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.ejecutar("ponentes", actividad_r16));
    });
    \u0275\u0275elementStart(18, "span", 50);
    \u0275\u0275text(19, "co_present");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "span");
    \u0275\u0275text(21, "Ponentes");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(22, ListarActividadesComponent_Conditional_99_Conditional_22_Template, 5, 3, "a", 83)(23, ListarActividadesComponent_Conditional_99_Conditional_23_Template, 5, 0, "button", 84);
    \u0275\u0275elementStart(24, "button", 85);
    \u0275\u0275listener("click", function ListarActividadesComponent_Conditional_99_Template_button_click_24_listener() {
      const actividad_r16 = \u0275\u0275restoreView(_r15);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.ejecutar("cerrar", actividad_r16));
    });
    \u0275\u0275elementStart(25, "span", 50);
    \u0275\u0275text(26, "lock");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "span");
    \u0275\u0275text(28, "Cerrar actividad");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(29, "p", 86);
    \u0275\u0275text(30, "Las acciones disponibles dependen de los permisos de tu sesi\xF3n. Laravel valida cada operaci\xF3n.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "div", 61)(32, "button", 62);
    \u0275\u0275listener("click", function ListarActividadesComponent_Conditional_99_Template_button_click_32_listener() {
      \u0275\u0275restoreView(_r15);
      \u0275\u0275nextContext();
      const dialogoAcciones_r18 = \u0275\u0275reference(98);
      return \u0275\u0275resetView(dialogoAcciones_r18.cerrar());
    });
    \u0275\u0275text(33, "Volver al listado");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const actividad_r16 = ctx;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", actividad_r16.nombre, " ");
    \u0275\u0275advance();
    \u0275\u0275attribute("data-estado", actividad_r16.estado);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(actividad_r16.estado);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !ctx_r3.permitido("actividades.ver"));
    \u0275\u0275advance(5);
    \u0275\u0275property("disabled", !ctx_r3.permitido("actividades.editar"));
    \u0275\u0275advance(5);
    \u0275\u0275conditional(ctx_r3.permitido("participantes.ver") ? 15 : 16);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !ctx_r3.permitido("ponentes-firmantes.ver"));
    \u0275\u0275advance(5);
    \u0275\u0275conditional(ctx_r3.permitido("actividades.ver") ? 22 : 23);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", actividad_r16.estado !== "Activa" || !ctx_r3.permitido("actividades.editar") || ctx_r3.cambiandoEstado());
  }
}
function ListarActividadesComponent_Conditional_102_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 21);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r3.avisoPonentes());
  }
}
function ListarActividadesComponent_Conditional_102_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 21);
    \u0275\u0275text(1, "Consultando asignaciones\u2026");
    \u0275\u0275elementEnd();
  }
}
function ListarActividadesComponent_Conditional_102_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r22 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 90);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 62);
    \u0275\u0275listener("click", function ListarActividadesComponent_Conditional_102_Conditional_9_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r22);
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.cargarPonentes());
    });
    \u0275\u0275text(3, "Reintentar asignaciones");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r3.errorPonentes());
  }
}
function ListarActividadesComponent_Conditional_102_Conditional_10_For_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 91);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ponente_r23 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ponente_r23.errorNombre);
  }
}
function ListarActividadesComponent_Conditional_102_Conditional_10_For_2_button_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r24 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 49);
    \u0275\u0275listener("click", function ListarActividadesComponent_Conditional_102_Conditional_10_For_2_button_4_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r24);
      const ponente_r23 = \u0275\u0275nextContext().$implicit;
      const ctx_r3 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r3.desvincularPonente(ponente_r23));
    });
    \u0275\u0275text(1, "Desvincular");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(4);
    \u0275\u0275property("disabled", ctx_r3.guardandoPonente());
  }
}
function ListarActividadesComponent_Conditional_102_Conditional_10_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li")(1, "strong");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, ListarActividadesComponent_Conditional_102_Conditional_10_For_2_Conditional_3_Template, 2, 1, "p", 91)(4, ListarActividadesComponent_Conditional_102_Conditional_10_For_2_button_4_Template, 2, 1, "button", 92);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ponente_r23 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ponente_r23.nombre || "Ponente #" + ponente_r23.id_persona_ponente);
    \u0275\u0275advance();
    \u0275\u0275conditional(ponente_r23.errorNombre ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("appHasPermission", "ponentes-firmantes.eliminar");
  }
}
function ListarActividadesComponent_Conditional_102_Conditional_10_ForEmpty_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275text(1, "No hay ponentes asignados a esta actividad.");
    \u0275\u0275elementEnd();
  }
}
function ListarActividadesComponent_Conditional_102_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ul", 89);
    \u0275\u0275repeaterCreate(1, ListarActividadesComponent_Conditional_102_Conditional_10_For_2_Template, 5, 3, "li", null, _forTrack2, false, ListarActividadesComponent_Conditional_102_Conditional_10_ForEmpty_3_Template, 2, 0, "li");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r3.ponentes());
  }
}
function ListarActividadesComponent_Conditional_102_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 76);
    \u0275\u0275text(1, "Actividad: ");
    \u0275\u0275elementStart(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 86);
    \u0275\u0275text(6, "Aqu\xED se conservan los v\xEDnculos hist\xF3ricos de la actividad. La asignaci\xF3n de ponentes se realiza desde cada sesi\xF3n, en \xABSesiones de la actividad\xBB.");
    \u0275\u0275elementEnd();
    \u0275\u0275template(7, ListarActividadesComponent_Conditional_102_Conditional_7_Template, 2, 1, "p", 21)(8, ListarActividadesComponent_Conditional_102_Conditional_8_Template, 2, 0, "p", 21)(9, ListarActividadesComponent_Conditional_102_Conditional_9_Template, 4, 1)(10, ListarActividadesComponent_Conditional_102_Conditional_10_Template, 4, 1, "ul", 89);
    \u0275\u0275elementStart(11, "div", 61)(12, "button", 49);
    \u0275\u0275listener("click", function ListarActividadesComponent_Conditional_102_Template_button_click_12_listener() {
      \u0275\u0275restoreView(_r21);
      \u0275\u0275nextContext();
      const dialogoPonentes_r20 = \u0275\u0275reference(101);
      return \u0275\u0275resetView(dialogoPonentes_r20.cerrar());
    });
    \u0275\u0275text(13, "Cerrar");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const actividad_r25 = ctx;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(actividad_r25.nombre);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" \xB7 #", actividad_r25.id_actividad, "");
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r3.avisoPonentes() ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r3.cargandoPonentes() ? 8 : ctx_r3.errorPonentes() ? 9 : 10);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", ctx_r3.guardandoPonente());
  }
}
function ListarActividadesComponent_Conditional_107_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r26 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 21);
    \u0275\u0275text(1, "Cargando los datos de la actividad\u2026");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 62);
    \u0275\u0275listener("click", function ListarActividadesComponent_Conditional_107_Conditional_1_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r26);
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.cerrarFormulario());
    });
    \u0275\u0275text(3, "Volver al listado");
    \u0275\u0275elementEnd();
  }
}
function ListarActividadesComponent_Conditional_107_Conditional_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 60);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function ListarActividadesComponent_Conditional_107_Conditional_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 21);
    \u0275\u0275text(1, "Cargando \xE1reas y tipos de actividad\u2026");
    \u0275\u0275elementEnd();
  }
}
function ListarActividadesComponent_Conditional_107_Conditional_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 93);
    \u0275\u0275text(1, "No hay \xE1reas autorizadas o tipos disponibles para cambiar esos campos.");
    \u0275\u0275elementEnd();
  }
}
function ListarActividadesComponent_Conditional_107_Conditional_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r28 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 125);
    \u0275\u0275text(1, "Se conservan los identificadores del detalle. Puedes editar otros campos; los cambios de \xE1rea o tipo requieren opciones disponibles y autorizaci\xF3n de Laravel.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 49);
    \u0275\u0275listener("click", function ListarActividadesComponent_Conditional_107_Conditional_2_Conditional_3_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r28);
      const ctx_r3 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r3.cargarCatalogos());
    });
    \u0275\u0275text(3, "Reintentar cat\xE1logos");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r3.cargandoAreas() || ctx_r3.cargandoTipos());
  }
}
function ListarActividadesComponent_Conditional_107_Conditional_2_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 99);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function ListarActividadesComponent_Conditional_107_Conditional_2_For_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 103);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const area_r29 = ctx.$implicit;
    \u0275\u0275property("value", area_r29.id_area);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(area_r29.nombre);
  }
}
function ListarActividadesComponent_Conditional_107_Conditional_2_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 104);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function ListarActividadesComponent_Conditional_107_Conditional_2_For_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 103);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tipo_r30 = ctx.$implicit;
    \u0275\u0275property("value", tipo_r30.id_tipo_actividad);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(tipo_r30.nombre);
  }
}
function ListarActividadesComponent_Conditional_107_Conditional_2_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 107);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function ListarActividadesComponent_Conditional_107_Conditional_2_Conditional_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 110);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function ListarActividadesComponent_Conditional_107_Conditional_2_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 113);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function ListarActividadesComponent_Conditional_107_Conditional_2_Conditional_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 116);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function ListarActividadesComponent_Conditional_107_Conditional_2_Conditional_50_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 119);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function ListarActividadesComponent_Conditional_107_Conditional_2_For_56_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 103);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const estado_r31 = ctx.$implicit;
    \u0275\u0275property("value", estado_r31);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(estado_r31);
  }
}
function ListarActividadesComponent_Conditional_107_Conditional_2_Conditional_57_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 122);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function ListarActividadesComponent_Conditional_107_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r27 = \u0275\u0275getCurrentView();
    \u0275\u0275template(0, ListarActividadesComponent_Conditional_107_Conditional_2_Conditional_0_Template, 2, 1, "div", 60)(1, ListarActividadesComponent_Conditional_107_Conditional_2_Conditional_1_Template, 2, 0, "p", 21)(2, ListarActividadesComponent_Conditional_107_Conditional_2_Conditional_2_Template, 2, 0, "div", 93)(3, ListarActividadesComponent_Conditional_107_Conditional_2_Conditional_3_Template, 4, 1);
    \u0275\u0275elementStart(4, "p", 86);
    \u0275\u0275text(5, "Los campos con * son obligatorios.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "form", 94);
    \u0275\u0275listener("ngSubmit", function ListarActividadesComponent_Conditional_107_Conditional_2_Template_form_ngSubmit_6_listener() {
      \u0275\u0275restoreView(_r27);
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.guardar());
    });
    \u0275\u0275elementStart(7, "div", 95)(8, "div", 96)(9, "label", 97);
    \u0275\u0275text(10, "Nombre de la actividad *");
    \u0275\u0275elementEnd();
    \u0275\u0275element(11, "input", 98);
    \u0275\u0275template(12, ListarActividadesComponent_Conditional_107_Conditional_2_Conditional_12_Template, 2, 1, "p", 99);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 28)(14, "label", 100);
    \u0275\u0275text(15, "\xC1rea *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "select", 101)(17, "option", 102);
    \u0275\u0275text(18, "Selecciona un \xE1rea");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(19, ListarActividadesComponent_Conditional_107_Conditional_2_For_20_Template, 2, 2, "option", 103, _forTrack03);
    \u0275\u0275elementEnd();
    \u0275\u0275template(21, ListarActividadesComponent_Conditional_107_Conditional_2_Conditional_21_Template, 2, 1, "p", 104);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "div", 28)(23, "label", 105);
    \u0275\u0275text(24, "Tipo de actividad *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "select", 106)(26, "option", 102);
    \u0275\u0275text(27, "Selecciona un tipo");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(28, ListarActividadesComponent_Conditional_107_Conditional_2_For_29_Template, 2, 2, "option", 103, _forTrack3);
    \u0275\u0275elementEnd();
    \u0275\u0275template(30, ListarActividadesComponent_Conditional_107_Conditional_2_Conditional_30_Template, 2, 1, "p", 107);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "div", 96)(32, "label", 108);
    \u0275\u0275text(33, "Descripci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275element(34, "textarea", 109);
    \u0275\u0275template(35, ListarActividadesComponent_Conditional_107_Conditional_2_Conditional_35_Template, 2, 1, "p", 110);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "div", 28)(37, "label", 111);
    \u0275\u0275text(38, "Fecha de inicio *");
    \u0275\u0275elementEnd();
    \u0275\u0275element(39, "input", 112);
    \u0275\u0275template(40, ListarActividadesComponent_Conditional_107_Conditional_2_Conditional_40_Template, 2, 1, "p", 113);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "div", 28)(42, "label", 114);
    \u0275\u0275text(43, "Fecha de fin *");
    \u0275\u0275elementEnd();
    \u0275\u0275element(44, "input", 115);
    \u0275\u0275template(45, ListarActividadesComponent_Conditional_107_Conditional_2_Conditional_45_Template, 2, 1, "p", 116);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(46, "div", 28)(47, "label", 117);
    \u0275\u0275text(48, "Sede");
    \u0275\u0275elementEnd();
    \u0275\u0275element(49, "input", 118);
    \u0275\u0275template(50, ListarActividadesComponent_Conditional_107_Conditional_2_Conditional_50_Template, 2, 1, "p", 119);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(51, "div", 28)(52, "label", 120);
    \u0275\u0275text(53, "Estado *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(54, "select", 121);
    \u0275\u0275repeaterCreate(55, ListarActividadesComponent_Conditional_107_Conditional_2_For_56_Template, 2, 2, "option", 103, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275template(57, ListarActividadesComponent_Conditional_107_Conditional_2_Conditional_57_Template, 2, 1, "p", 122);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(58, "div", 123)(59, "button", 49);
    \u0275\u0275listener("click", function ListarActividadesComponent_Conditional_107_Conditional_2_Template_button_click_59_listener() {
      \u0275\u0275restoreView(_r27);
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.cerrarFormulario());
    });
    \u0275\u0275text(60, "Cancelar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(61, "button", 124);
    \u0275\u0275text(62);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_12_0;
    let tmp_17_0;
    let tmp_20_0;
    let tmp_23_0;
    let tmp_25_0;
    let tmp_27_0;
    let tmp_30_0;
    let tmp_32_0;
    let tmp_35_0;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional((tmp_12_0 = ctx_r3.errorFormulario()) ? 0 : -1, tmp_12_0);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r3.cargandoAreas() || ctx_r3.cargandoTipos() ? 1 : !ctx_r3.errorAreas() && !ctx_r3.errorTipos() && (!ctx_r3.areas().length || !ctx_r3.tipos().length) ? 2 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r3.errorAreas() || ctx_r3.errorTipos() ? 3 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275property("formGroup", ctx_r3.form);
    \u0275\u0275advance(5);
    \u0275\u0275attribute("aria-invalid", !!ctx_r3.errorCampo("nombre"));
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_17_0 = ctx_r3.errorCampo("nombre")) ? 12 : -1, tmp_17_0);
    \u0275\u0275advance(4);
    \u0275\u0275attribute("aria-invalid", !!ctx_r3.errorCampo("id_area"));
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r3.areasFiltro());
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_20_0 = ctx_r3.errorCampo("id_area")) ? 21 : -1, tmp_20_0);
    \u0275\u0275advance(4);
    \u0275\u0275attribute("aria-invalid", !!ctx_r3.errorCampo("id_tipo_actividad"));
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r3.tiposEdicion());
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_23_0 = ctx_r3.errorCampo("id_tipo_actividad")) ? 30 : -1, tmp_23_0);
    \u0275\u0275advance(4);
    \u0275\u0275attribute("aria-invalid", !!ctx_r3.errorCampo("descripcion"));
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_25_0 = ctx_r3.errorCampo("descripcion")) ? 35 : -1, tmp_25_0);
    \u0275\u0275advance(4);
    \u0275\u0275attribute("aria-invalid", !!ctx_r3.errorCampo("fecha_inicio"));
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_27_0 = ctx_r3.errorCampo("fecha_inicio")) ? 40 : -1, tmp_27_0);
    \u0275\u0275advance(4);
    \u0275\u0275property("min", ctx_r3.form.controls.fecha_inicio.value);
    \u0275\u0275attribute("aria-invalid", !!ctx_r3.errorCampo("fecha_fin"));
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_30_0 = ctx_r3.errorCampo("fecha_fin")) ? 45 : -1, tmp_30_0);
    \u0275\u0275advance(4);
    \u0275\u0275attribute("aria-invalid", !!ctx_r3.errorCampo("sede"));
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_32_0 = ctx_r3.errorCampo("sede")) ? 50 : -1, tmp_32_0);
    \u0275\u0275advance(4);
    \u0275\u0275attribute("aria-invalid", !!ctx_r3.errorCampo("estado"));
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r3.estados);
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_35_0 = ctx_r3.errorCampo("estado")) ? 57 : -1, tmp_35_0);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r3.enviando());
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r3.enviando() || !ctx_r3.catalogosDisponibles());
    \u0275\u0275attribute("aria-busy", ctx_r3.enviando());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r3.enviando() ? "Guardando\u2026" : "Guardar cambios", " ");
  }
}
function ListarActividadesComponent_Conditional_107_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 58);
    \u0275\u0275template(1, ListarActividadesComponent_Conditional_107_Conditional_1_Template, 4, 0)(2, ListarActividadesComponent_Conditional_107_Conditional_2_Template, 63, 25);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275attribute("aria-busy", ctx_r3.cargandoEdicion() || ctx_r3.enviando());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r3.cargandoEdicion() ? 1 : 2);
  }
}
function ListarActividadesComponent_Conditional_110_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 21);
    \u0275\u0275text(1, "Cargando detalle\u2026");
    \u0275\u0275elementEnd();
  }
}
function ListarActividadesComponent_Conditional_111_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 60);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function ListarActividadesComponent_Conditional_112_Conditional_52_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 128);
    \u0275\u0275text(1, "Consultar solicitud");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const solicitudId_r33 = \u0275\u0275nextContext();
    \u0275\u0275property("routerLink", ctx)("queryParams", \u0275\u0275pureFunction1(2, _c9, solicitudId_r33));
  }
}
function ListarActividadesComponent_Conditional_112_Conditional_52_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "dt");
    \u0275\u0275text(2, "Solicitud relacionada");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "dd");
    \u0275\u0275text(4);
    \u0275\u0275template(5, ListarActividadesComponent_Conditional_112_Conditional_52_Conditional_5_Template, 2, 4, "a", 128);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_15_0;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("Solicitud #", ctx, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_15_0 = ctx_r3.rutaSolicitud()) ? 5 : -1, tmp_15_0);
  }
}
function ListarActividadesComponent_Conditional_112_Template(rf, ctx) {
  if (rf & 1) {
    const _r32 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "dl", 126)(1, "div")(2, "dt");
    \u0275\u0275text(3, "ID de actividad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "dd");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div")(7, "dt");
    \u0275\u0275text(8, "Nombre");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "dd");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div")(12, "dt");
    \u0275\u0275text(13, "\xC1rea");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "dd");
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div")(17, "dt");
    \u0275\u0275text(18, "Tipo de actividad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "dd");
    \u0275\u0275text(20);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "div")(22, "dt");
    \u0275\u0275text(23, "Descripci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "dd", 127);
    \u0275\u0275text(25);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "div")(27, "dt");
    \u0275\u0275text(28, "Inicio");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "dd");
    \u0275\u0275text(30);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(31, "div")(32, "dt");
    \u0275\u0275text(33, "Fin");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "dd");
    \u0275\u0275text(35);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(36, "div")(37, "dt");
    \u0275\u0275text(38, "Sede");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "dd");
    \u0275\u0275text(40);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(41, "div")(42, "dt");
    \u0275\u0275text(43, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(44, "dd")(45, "span", 69);
    \u0275\u0275text(46);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(47, "div")(48, "dt");
    \u0275\u0275text(49, "Origen");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(50, "dd");
    \u0275\u0275text(51);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(52, ListarActividadesComponent_Conditional_112_Conditional_52_Template, 6, 2, "div");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(53, "div", 61)(54, "button", 62);
    \u0275\u0275listener("click", function ListarActividadesComponent_Conditional_112_Template_button_click_54_listener() {
      const actividad_r34 = \u0275\u0275restoreView(_r32);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.gestionar(actividad_r34));
    });
    \u0275\u0275text(55, "Gestionar actividad");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_24_0;
    const actividad_r34 = ctx;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(actividad_r34.id_actividad);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(actividad_r34.nombre);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r3.nombreArea(actividad_r34.id_area, actividad_r34.area_nombre));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r3.nombreTipo(actividad_r34.id_tipo_actividad, actividad_r34.tipo_actividad_nombre));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(actividad_r34.descripcion || "Sin descripci\xF3n");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r3.fecha(actividad_r34.fecha_inicio));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r3.fecha(actividad_r34.fecha_fin));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(actividad_r34.sede || "Sin sede registrada");
    \u0275\u0275advance(5);
    \u0275\u0275classProp("badge-exito", actividad_r34.estado === "Activa");
    \u0275\u0275attribute("data-estado", actividad_r34.estado);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(actividad_r34.estado);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r3.origenActividad(actividad_r34));
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_24_0 = actividad_r34.id_solicitud_actividad) ? 52 : -1, tmp_24_0);
  }
}
var ListarActividadesComponent = class _ListarActividadesComponent {
  pestana = signal("listado");
  actividadDetalle = signal(null);
  revisionDetalle = signal(0);
  seleccionarActividad(actividad) {
    if (!this.auth.tienePermiso("actividades.ver"))
      return;
    this.actividadDetalle.set(actividad.id_actividad);
    this.pestana.set("detalle");
  }
  volverAlListado() {
    this.pestana.set("listado");
  }
  limpiarSeleccion() {
    this.actividadDetalle.set(null);
    this.volverAlListado();
  }
  alTeclearPestanas(evento) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(evento.key))
      return;
    evento.preventDefault();
    const siguiente = !this.actividadDetalle() || evento.key === "Home" ? "listado" : evento.key === "End" ? "detalle" : this.pestana() === "listado" ? "detalle" : "listado";
    this.pestana.set(siguiente);
    this.documento.getElementById("actividades-tab-" + siguiente)?.focus();
  }
  route = inject(ActivatedRoute, { optional: true });
  servicio = inject(ActividadesService);
  auth = inject(AuthService);
  destroyRef = inject(DestroyRef);
  documento = inject(DOCUMENT);
  injector = inject(Injector);
  dialogoFormulario = viewChild.required("dialogoFormulario");
  elementoFormulario = viewChild.required("dialogoFormulario", { read: ElementRef });
  encabezado = viewChild.required("encabezado");
  overflowAnterior = null;
  dialogoDetalle = viewChild.required("dialogoDetalle");
  dialogoAcciones = viewChild.required("dialogoAcciones");
  dialogoPonentes = viewChild.required("dialogoPonentes");
  confirmarPonente = viewChild.required("confirmarPonente");
  seleccionada = signal(null);
  actividadEdicion = signal(null);
  actividadPonentes = signal(null);
  guardandoPonente = signal(false);
  avisoPonentes = signal(null);
  confirmacionEstado = viewChild.required("confirmacionEstado");
  solicitudDetalle;
  solicitudPonentes;
  solicitudEdicion;
  destruido = false;
  listadoListo = signal(false);
  cargaListado;
  catalogosEnCurso = false;
  actividades = signal([]);
  areas = signal([]);
  tipos = signal([]);
  cargando = signal(true);
  errorCarga = signal(null);
  aviso = signal(null);
  cargandoAreas = signal(true);
  cargandoTipos = signal(true);
  errorAreas = signal(null);
  errorTipos = signal(null);
  // Un catálogo denegado no impide conservar los IDs reales del detalle y editar otros campos.
  catalogosDisponibles = computed(() => !this.cargandoAreas() && !this.cargandoTipos());
  areasFiltro = computed(() => {
    const areas = new Map(this.areas().map((area) => [area.id_area, area]));
    for (const actividad of [...this.actividades(), ...[this.actividadEdicion()].filter((a) => a !== null)]) {
      if (!areas.has(actividad.id_area))
        areas.set(actividad.id_area, { id_area: actividad.id_area, nombre: actividad.area_nombre || "Nombre no disponible" });
    }
    return [...areas.values()];
  });
  tiposEdicion = computed(() => {
    const tipos = new Map(this.tipos().map((tipo) => [tipo.id_tipo_actividad, tipo]));
    const actual = this.actividadEdicion();
    if (actual && !tipos.has(actual.id_tipo_actividad))
      tipos.set(actual.id_tipo_actividad, {
        id_tipo_actividad: actual.id_tipo_actividad,
        nombre: actual.tipo_actividad_nombre || "Nombre no disponible"
      });
    return [...tipos.values()];
  });
  filtros = signal({ nombre: "", area: "", tipo: "", estado: "" });
  filtradas = computed(() => filtrarActividades(this.actividades(), this.filtros()));
  estados = ESTADOS_ACTIVIDAD;
  porPagina = signal(10);
  pagina = signal(1);
  totalPaginas = computed(() => Math.max(1, Math.ceil(this.filtradas().length / this.porPagina())));
  paginaActual = computed(() => Math.min(this.pagina(), this.totalPaginas()));
  visibles = computed(() => this.filtradas().slice((this.paginaActual() - 1) * this.porPagina(), this.paginaActual() * this.porPagina()));
  rango = computed(() => ({
    desde: this.filtradas().length ? (this.paginaActual() - 1) * this.porPagina() + 1 : 0,
    hasta: Math.min(this.paginaActual() * this.porPagina(), this.filtradas().length),
    total: this.filtradas().length
  }));
  porCambiarEstado = signal(null);
  cambiandoEstado = signal(false);
  nombresAreas = computed(() => new Map(this.areas().map((area) => [area.id_area, area.nombre])));
  nombresTipos = computed(() => new Map(this.tipos().map((tipo) => [tipo.id_tipo_actividad, tipo.nombre])));
  formularioAbierto = signal(false);
  editando = signal(null);
  cargandoEdicion = signal(false);
  enviando = signal(false);
  errorFormulario = signal(null);
  erroresServidor = signal({});
  detalle = signal(null);
  cargandoDetalle = signal(false);
  errorDetalle = signal(null);
  ponentes = signal([]);
  cargandoPonentes = signal(false);
  errorPonentes = signal(null);
  form = inject(NonNullableFormBuilder).group({
    id_area: ["", [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
    id_tipo_actividad: ["", [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
    nombre: ["", [textoObligatorio, Validators.maxLength(100)]],
    descripcion: ["", Validators.maxLength(255)],
    fecha_inicio: ["", Validators.required],
    fecha_fin: ["", Validators.required],
    sede: ["", Validators.maxLength(100)],
    estado: ["Activa", [Validators.required, Validators.pattern(/^(Activa|Cerrada)$/)]]
  }, { validators: periodoActividad });
  constructor() {
    effect(() => {
      if (!this.cargando() && !this.cargandoAreas() && !this.cargandoTipos())
        this.listadoListo.set(true);
    }, { allowSignalWrites: true });
    const parametros = this.route?.snapshot.queryParamMap;
    if (parametros) {
      this.filtros.set({
        nombre: parametros.get("nombre") ?? "",
        area: parametros.get("area") ?? "",
        tipo: parametros.get("tipo") ?? "",
        estado: parametros.get("estado") ?? ""
      });
      const pagina = Number(parametros.get("pagina"));
      const tamano = Number(parametros.get("tamano"));
      if (Number.isSafeInteger(pagina) && pagina > 0)
        this.pagina.set(pagina);
      if ([10, 20, 50].includes(tamano))
        this.porPagina.set(tamano);
    }
    this.destroyRef.onDestroy(() => {
      this.destruido = true;
      this.restaurarDesplazamiento();
    });
    afterNextRender(() => {
      const dialogo = this.elementoFormulario().nativeElement.querySelector("dialog");
      const cancelar = (evento) => {
        evento.preventDefault();
        this.cerrarFormulario();
      };
      dialogo.addEventListener("cancel", cancelar);
      this.destroyRef.onDestroy(() => dialogo.removeEventListener("cancel", cancelar));
      this.cargar();
      this.cargarCatalogos();
      this.route?.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
        const contexto = params.get("id_actividad");
        if (contexto !== null) {
          if (/^[1-9]\d*$/.test(contexto) && Number.isSafeInteger(Number(contexto))) {
            this.actividadDetalle.set(Number(contexto));
            this.pestana.set("detalle");
          } else {
            this.limpiarSeleccion();
            this.aviso.set({ tipo: "error", texto: "El identificador de actividad no es v\xE1lido." });
          }
          return;
        }
        const id = Number(params.get("actividad"));
        if (Number.isSafeInteger(id) && id > 0)
          this.verDetalle({ id_actividad: id });
      });
    });
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.erroresServidor.set({}));
  }
  cargar() {
    if (this.cambiandoEstado() || this.cargando() && this.cargaListado && !this.cargaListado.closed)
      return;
    this.cargando.set(true);
    this.errorCarga.set(null);
    this.cargaListado = this.servicio.listar().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (actividades) => {
        this.actividades.set(actividades);
        this.cargando.set(false);
      },
      error: (error) => {
        this.errorCarga.set(error.status === 403 ? "El servidor deneg\xF3 el listado. Verifica que tu sesi\xF3n tenga el permiso de lectura de Actividades." : this.mensajeError(error));
        this.cargando.set(false);
      }
    });
  }
  cargarCatalogos() {
    if (this.catalogosEnCurso)
      return;
    this.catalogosEnCurso = true;
    this.cargandoAreas.set(true);
    this.cargandoTipos.set(true);
    this.errorAreas.set(null);
    this.errorTipos.set(null);
    this.servicio.listarAreas().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (areas) => {
        this.areas.set(areas);
        this.cargandoAreas.set(false);
        this.catalogosEnCurso = this.cargandoTipos();
        if (this.editando() === null && !this.form.controls.id_area.value && areas.length === 1)
          this.form.controls.id_area.setValue(String(areas[0].id_area));
      },
      error: (error) => {
        this.errorAreas.set(error.status === 403 ? `El servidor deneg\xF3 la lectura del cat\xE1logo de \xE1reas para tu sesi\xF3n. ${this.mensajeError(error)}` : this.mensajeError(error));
        this.cargandoAreas.set(false);
        this.catalogosEnCurso = this.cargandoTipos();
      }
    });
    this.servicio.listarTipos().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (tipos) => {
        this.tipos.set(tipos);
        this.cargandoTipos.set(false);
        this.catalogosEnCurso = this.cargandoAreas();
      },
      error: (error) => {
        this.errorTipos.set(error.status === 403 ? "El servidor deneg\xF3 la lectura de los tipos de actividad. Esta consulta requiere el permiso de lectura de Actividades." : this.mensajeError(error));
        this.cargandoTipos.set(false);
        this.catalogosEnCurso = this.cargandoAreas();
      }
    });
  }
  filtrar(campo, valor) {
    this.filtros.update((filtros) => __spreadProps(__spreadValues({}, filtros), { [campo]: valor }));
    this.pagina.set(1);
  }
  limpiarFiltros() {
    this.filtros.set({ nombre: "", area: "", tipo: "", estado: "" });
    this.pagina.set(1);
  }
  cambiarTamanoPagina(valor) {
    const cantidad = Number(valor);
    if (![10, 20, 50].includes(cantidad))
      return;
    this.porPagina.set(cantidad);
    this.pagina.set(1);
  }
  pedirCambioEstado(actividad) {
    return __async(this, null, function* () {
      if (actividad.estado !== "Activa" || !this.auth.tienePermiso("actividades.editar") || this.cambiandoEstado())
        return;
      this.porCambiarEstado.set(actividad);
      if (!(yield this.confirmacionEstado().abrir()) || this.destruido || !this.auth.tienePermiso("actividades.editar") || this.cambiandoEstado())
        return;
      const estado = "Cerrada";
      this.cambiandoEstado.set(true);
      this.aviso.set(null);
      this.servicio.cambiarEstado(actividad.id_actividad, estado).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (respuesta) => {
          this.actividades.update((lista) => lista.map((item) => item.id_actividad === actividad.id_actividad ? respuesta.data : item));
          this.cambiandoEstado.set(false);
          this.revisionDetalle.update((revision) => revision + 1);
          this.aviso.set({ tipo: "exito", texto: respuesta.message });
          this.cargar();
        },
        error: (error) => {
          this.cambiandoEstado.set(false);
          this.aviso.set({ tipo: "error", texto: this.mensajeError(error) });
        }
      });
    });
  }
  nombreArea(id, nombre) {
    return nombre?.trim() || this.nombresAreas().get(id) || this.areasFiltro().find((area) => area.id_area === id)?.nombre || "Nombre no disponible";
  }
  nombreTipo(id, nombre) {
    return nombre?.trim() || this.nombresTipos().get(id) || "Nombre no disponible";
  }
  permitido(permiso) {
    return this.auth.tienePermiso(permiso);
  }
  gestionar(actividad) {
    this.seleccionada.set(actividad);
    this.dialogoDetalle().cerrar();
    this.dialogoAcciones().abrir();
  }
  ejecutar(accion, actividad) {
    const permiso = accion === "detalle" ? "actividades.ver" : accion === "ponentes" ? "ponentes-firmantes.ver" : "actividades.editar";
    if (!this.permitido(permiso) || accion === "cerrar" && actividad.estado !== "Activa")
      return;
    this.dialogoAcciones().cerrar();
    if (accion === "detalle")
      this.verDetalle(actividad);
    else if (accion === "editar")
      this.abrirFormulario(actividad);
    else if (accion === "cerrar")
      void this.pedirCambioEstado(actividad);
    else {
      this.actividadPonentes.set(actividad);
      this.detalle.set(null);
      this.ponentes.set([]);
      this.avisoPonentes.set(null);
      this.dialogoPonentes().abrir();
      this.cargarPonentes();
    }
  }
  bloquearEscapePonentes(evento) {
    if (this.guardandoPonente())
      evento.preventDefault();
  }
  desvincularPonente(ponente) {
    return __async(this, null, function* () {
      if (!this.permitido("ponentes-firmantes.eliminar") || this.guardandoPonente())
        return;
      if (!(yield this.confirmarPonente().abrir()) || this.destruido || !this.permitido("ponentes-firmantes.eliminar") || this.guardandoPonente())
        return;
      this.guardandoPonente.set(true);
      this.servicio.desvincularPonente(ponente.id_actividad_ponente).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (respuesta) => {
          this.guardandoPonente.set(false);
          this.avisoPonentes.set(respuesta.message);
          this.cargarPonentes();
        },
        error: (error) => {
          this.guardandoPonente.set(false);
          this.avisoPonentes.set(this.mensajeError(error));
        }
      });
    });
  }
  origenActividad(actividad) {
    return actividad.origen === "solicitud" ? "Procedente de solicitud aprobada" : actividad.origen === "sin_solicitud" ? "Registro administrativo directo" : "Origen no informado";
  }
  rutaSolicitud() {
    const capacidades = this.auth.capacidadesSolicitudes?.();
    if (capacidades?.consultar_revision)
      return "/solicitudes/revision";
    if (capacidades?.consultar_gerencia)
      return "/pendientes/pendientes-aprobacion";
    return this.auth.tienePermiso("solicitudes.propias") ? "/solicitudes/mis-solicitudes" : null;
  }
  fecha(valor) {
    if (!valor)
      return "\u2014";
    const fecha = valor.slice(0, 10).split("-");
    return fecha.length === 3 ? `${fecha[2]}/${fecha[1]}/${fecha[0]}` : valor;
  }
  abrirFormulario(actividad) {
    if (!actividad || !this.auth.tienePermiso("actividades.editar"))
      return;
    if (this.formularioAbierto() || this.enviando() || this.cambiandoEstado())
      return;
    this.solicitudEdicion?.unsubscribe();
    this.formularioAbierto.set(true);
    this.overflowAnterior = this.documento.body.style.overflow;
    this.documento.body.style.overflow = "hidden";
    this.dialogoFormulario().abrir();
    this.editando.set(actividad?.id_actividad ?? null);
    this.actividadEdicion.set(actividad);
    this.errorFormulario.set(null);
    this.erroresServidor.set({});
    this.form.reset();
    this.cargandoEdicion.set(!!actividad);
    this.solicitudEdicion = this.servicio.obtener(actividad.id_actividad).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (actual) => {
        this.actividadEdicion.set(actual);
        this.form.reset({
          id_area: String(actual.id_area),
          id_tipo_actividad: String(actual.id_tipo_actividad),
          nombre: actual.nombre,
          descripcion: actual.descripcion ?? "",
          sede: actual.sede ?? "",
          fecha_inicio: actual.fecha_inicio.slice(0, 10),
          fecha_fin: actual.fecha_fin?.slice(0, 10) ?? "",
          estado: actual.estado
        });
        this.cargandoEdicion.set(false);
      },
      error: (error) => {
        this.cargandoEdicion.set(false);
        this.cerrarFormulario();
        this.aviso.set({ tipo: "error", texto: this.mensajeError(error) });
      }
    });
  }
  cerrarFormulario() {
    if (this.enviando())
      return;
    this.solicitudEdicion?.unsubscribe();
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
    this.solicitudEdicion?.unsubscribe();
    this.formularioAbierto.set(false);
    this.form.reset();
    this.editando.set(null);
    this.cargandoEdicion.set(false);
    this.errorFormulario.set(null);
    this.erroresServidor.set({});
    this.restaurarDesplazamiento();
    afterNextRender(() => this.encabezado().nativeElement.focus(), { injector: this.injector });
  }
  restaurarDesplazamiento() {
    if (this.overflowAnterior === null)
      return;
    this.documento.body.style.overflow = this.overflowAnterior;
    this.overflowAnterior = null;
  }
  errorCampo(campo) {
    const control = this.form.controls[campo];
    const servidor = this.erroresServidor()[campo]?.[0];
    if (servidor)
      return servidor;
    if (!control.touched)
      return null;
    if (control.hasError("required"))
      return "Completa este campo.";
    if (control.hasError("maxlength"))
      return `M\xE1ximo ${control.getError("maxlength").requiredLength} caracteres.`;
    if (control.hasError("pattern"))
      return "Selecciona una opci\xF3n v\xE1lida.";
    if (campo === "fecha_fin" && this.form.hasError("periodo"))
      return "La fecha de fin no puede ser anterior al inicio.";
    return null;
  }
  guardar() {
    if (this.editando() === null || !this.formularioAbierto() || this.enviando() || this.cargandoEdicion())
      return;
    this.errorFormulario.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (!this.auth.tienePermiso("actividades.editar")) {
      this.errorFormulario.set("Guardado pendiente de autorizaci\xF3n. Tu sesi\xF3n no dispone del permiso para esta operaci\xF3n.");
      return;
    }
    if (!this.catalogosDisponibles()) {
      this.errorFormulario.set("Guardado pendiente de conexi\xF3n: carga las \xE1reas y los tipos de actividad antes de continuar.");
      return;
    }
    const valores = this.form.getRawValue();
    if (!this.areasFiltro().some((area) => area.id_area === Number(valores.id_area)) || !this.tiposEdicion().some((tipo) => tipo.id_tipo_actividad === Number(valores.id_tipo_actividad))) {
      this.errorFormulario.set("Selecciona un \xE1rea y un tipo de actividad autorizados.");
      return;
    }
    const payload = __spreadProps(__spreadValues({}, valores), {
      id_area: Number(valores.id_area),
      id_tipo_actividad: Number(valores.id_tipo_actividad),
      nombre: valores.nombre.trim(),
      estado: valores.estado.trim(),
      descripcion: valores.descripcion.trim() || null,
      sede: valores.sede.trim() || null
    });
    this.enviando.set(true);
    this.errorFormulario.set(null);
    this.erroresServidor.set({});
    this.form.disable({ emitEvent: false });
    const id = this.editando();
    if (id === null)
      return;
    const peticion = this.servicio.actualizar(id, payload);
    peticion.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (respuesta) => {
        this.form.enable({ emitEvent: false });
        this.enviando.set(false);
        this.cerrarFormulario();
        this.aviso.set({ tipo: "exito", texto: respuesta.message });
        this.revisionDetalle.update((revision) => revision + 1);
        this.cargar();
      },
      error: (error) => {
        this.form.enable({ emitEvent: false });
        this.enviando.set(false);
        this.errorFormulario.set(this.mensajeError(error));
        this.erroresServidor.set(error.errores);
        this.form.markAllAsTouched();
      }
    });
  }
  verDetalle(actividad) {
    if (!this.auth.tienePermiso("actividades.ver"))
      return;
    this.cerrarDetalle();
    this.detalle.set(null);
    this.actividadPonentes.set(null);
    this.errorDetalle.set(null);
    this.ponentes.set([]);
    this.errorPonentes.set(null);
    this.cargandoDetalle.set(true);
    this.dialogoDetalle().abrir();
    this.solicitudDetalle = this.servicio.obtener(actividad.id_actividad).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
  cargarPonentes() {
    const actividad = this.actividadPonentes() ?? this.detalle();
    if (!actividad)
      return;
    this.solicitudPonentes?.unsubscribe();
    this.cargandoPonentes.set(true);
    this.errorPonentes.set(null);
    this.solicitudPonentes = this.servicio.consultarPonentes(actividad.id_actividad).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (ponentes) => {
        this.ponentes.set(ponentes);
        this.cargandoPonentes.set(false);
      },
      error: (error) => {
        this.errorPonentes.set(this.mensajeError(error));
        this.cargandoPonentes.set(false);
      }
    });
  }
  cerrarDetalle() {
    this.solicitudDetalle?.unsubscribe();
    this.solicitudPonentes?.unsubscribe();
  }
  mensajeError(error) {
    return error.status === 0 ? "No se pudo conectar con el servidor. Comprueba tu conexi\xF3n e intenta nuevamente." : error.mensaje;
  }
  static \u0275fac = function ListarActividadesComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ListarActividadesComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ListarActividadesComponent, selectors: [["app-listar-actividades"]], viewQuery: function ListarActividadesComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuerySignal(ctx.dialogoFormulario, _c02, 5);
      \u0275\u0275viewQuerySignal(ctx.elementoFormulario, _c02, 5, ElementRef);
      \u0275\u0275viewQuerySignal(ctx.encabezado, _c12, 5);
      \u0275\u0275viewQuerySignal(ctx.dialogoDetalle, _c22, 5);
      \u0275\u0275viewQuerySignal(ctx.dialogoAcciones, _c32, 5);
      \u0275\u0275viewQuerySignal(ctx.dialogoPonentes, _c42, 5);
      \u0275\u0275viewQuerySignal(ctx.confirmarPonente, _c52, 5);
      \u0275\u0275viewQuerySignal(ctx.confirmacionEstado, _c6, 5);
    }
    if (rf & 2) {
      \u0275\u0275queryAdvance(8);
    }
  }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 118, vars: 37, consts: [["encabezado", ""], ["busqueda", ""], ["areaFiltro", ""], ["tamano", ""], ["dialogoAcciones", ""], ["dialogoPonentes", ""], ["confirmarPonente", ""], ["dialogoFormulario", ""], ["dialogoDetalle", ""], ["confirmacionEstado", ""], ["aria-label", "Gesti\xF3n de actividades"], ["tabindex", "-1", 1, "encabezado"], ["title", "Actividades"], [1, "descripcion"], ["class", "btn btn-primary", "routerLink", "/solicitudes/nueva", 4, "appHasPermission"], ["role", "tablist", "aria-label", "Actividades", 1, "pestanas", 3, "keydown"], ["id", "actividades-tab-listado", "type", "button", "role", "tab", "aria-controls", "actividades-panel-listado", 3, "click"], ["aria-describedby", "ayuda-detalles-actividad", 1, "ayuda-pestana"], ["id", "actividades-tab-detalle", "type", "button", "role", "tab", "aria-controls", "actividades-panel-detalle", "aria-describedby", "ayuda-detalles-actividad", 3, "click", "disabled"], ["id", "ayuda-detalles-actividad", "role", "tooltip", 1, "tooltip-detalles"], ["id", "actividades-panel-listado", "role", "tabpanel", "aria-labelledby", "actividades-tab-listado", "tabindex", "0", 3, "hidden"], ["role", "status"], [1, "alert", 3, "alert-exito", "alert-error"], ["role", "status", 1, "form-ayuda", "aviso-datos"], ["role", "search", "aria-label", "Filtrar actividades", 1, "filtros"], [1, "form-field", "buscador"], ["for", "buscar-actividad"], ["id", "buscar-actividad", "type", "search", "placeholder", "Nombre de la actividad", 1, "input", 3, "input", "value"], [1, "form-field"], ["for", "filtrar-area"], ["id", "filtrar-area", 1, "input", 3, "change", "value"], ["value", ""], [3, "value", "selected"], ["type", "button", 1, "btn", "limpiar", 3, "click"], ["tabindex", "0", "role", "region", "aria-label", "Listado de actividades con desplazamiento horizontal", 1, "tabla-caja", 3, "hidden"], [1, "table"], [1, "sr-only"], ["scope", "col", 1, "col-centro"], ["scope", "col"], [3, "registro-inactivo"], ["aria-label", "Paginaci\xF3n de actividades", 1, "paginacion"], ["role", "status", 1, "dato"], [1, "tamano-pagina"], ["for", "tamano-pagina"], ["id", "tamano-pagina", 1, "input", 3, "change", "value"], ["value", "10"], ["value", "20"], ["value", "50"], [1, "paginacion-botones"], ["type", "button", 1, "btn", 3, "click", "disabled"], ["aria-hidden", "true", 1, "material-symbols-outlined"], ["id", "actividades-panel-detalle", "role", "tabpanel", "aria-labelledby", "actividades-tab-detalle", "tabindex", "0", 3, "hidden"], ["role", "status", 1, "alert", 3, "alert-exito", "alert-error"], [3, "actividadId", "revision", "solicitudRuta", "operando"], ["titulo", "Acciones de la actividad", 1, "modal-acciones"], ["titulo", "Ponentes de la actividad", 1, "modal-ponentes", 3, "cierreSolicitado", "cerrado", "keydown.escape", "mostrarCerrar", "cierreControlado"], ["titulo", "Desvincular ponente", "texto", "Se retirar\xE1 la asociaci\xF3n con esta actividad. El cat\xE1logo de RR. HH. se conservar\xE1.", "confirmar", "Desvincular"], ["titulo", "Editar actividad", 1, "modal-actividad", 3, "cerrado"], [1, "formulario"], ["titulo", "Detalle de actividad", 3, "cerrado"], ["role", "alert", 1, "alert", "alert-error"], [1, "dialogo-acciones"], ["type", "button", 1, "btn", 3, "click"], ["texto", "Se cerrar\xE1 la actividad seleccionada. Confirma para enviar la operaci\xF3n al servidor.", "confirmar", "Cerrar actividad", 3, "titulo"], ["routerLink", "/solicitudes/nueva", 1, "btn", "btn-primary"], [1, "alert"], [1, "col-centro"], ["scope", "row", 1, "nombre-actividad"], [1, "col-centro", "fecha"], [1, "badge"], [1, "acciones-fila"], ["type", "button", "title", "Ver actividad", "aria-label", "Ver actividad", 1, "btn", "btn-icono", "btn-sin-borde", "gestionar-actividad", 3, "click"], ["type", "button", "title", "Gestionar actividad", "aria-label", "Gestionar actividad", 1, "btn", "btn-icono", "btn-sin-borde", "gestionar-actividad", 3, "click", "disabled"], ["colspan", "8", 1, "estado-vacio"], ["role", "status", 1, "alert"], [3, "volver", "editarActividad", "cerrarActividad", "actividadId", "revision", "solicitudRuta", "operando"], [1, "contexto-actividad"], [1, "panel-acciones"], ["type", "button", "title", "Ver detalle", 1, "tarjeta-accion", 3, "click", "disabled"], ["type", "button", "title", "Editar", 1, "tarjeta-accion", 3, "click", "disabled"], ["routerLink", "/certificaciones/participantes", "title", "Registrar y consultar participantes", 1, "tarjeta-accion", 3, "queryParams"], ["type", "button", "disabled", "", "title", "Requiere participantes.ver", 1, "tarjeta-accion"], ["type", "button", "title", "Consultar ponentes de la actividad", 1, "tarjeta-accion", 3, "click", "disabled"], ["routerLink", "/certificaciones/actividades", 1, "tarjeta-accion", 3, "queryParams"], ["type", "button", "disabled", "", "title", "Requiere actividades.ver", 1, "tarjeta-accion"], ["type", "button", "title", "Cerrar actividad", 1, "tarjeta-accion", "tarjeta-cerrar", 3, "click", "disabled"], [1, "form-ayuda"], ["routerLink", "/certificaciones/participantes", "title", "Registrar y consultar participantes", 1, "tarjeta-accion", 3, "click", "queryParams"], ["routerLink", "/certificaciones/actividades", 1, "tarjeta-accion", 3, "click", "queryParams"], [1, "ponentes"], ["role", "alert", 1, "error-text"], [1, "error-text"], ["class", "btn", "type", "button", 3, "disabled", "click", 4, "appHasPermission"], ["role", "alert", 1, "alert", "alert-advertencia"], ["novalidate", "", 3, "ngSubmit", "formGroup"], [1, "rejilla-formulario"], [1, "form-field", "ancho-completo"], ["for", "actividad-nombre"], ["id", "actividad-nombre", "autofocus", "", "formControlName", "nombre", "maxlength", "100", "aria-required", "true", "aria-describedby", "actividad-nombre-error", 1, "input"], ["id", "actividad-nombre-error", 1, "error-text"], ["for", "actividad-area"], ["id", "actividad-area", "formControlName", "id_area", "aria-required", "true", "aria-describedby", "actividad-area-error", 1, "input"], ["value", "", "disabled", ""], [3, "value"], ["id", "actividad-area-error", 1, "error-text"], ["for", "actividad-tipo"], ["id", "actividad-tipo", "formControlName", "id_tipo_actividad", "aria-required", "true", "aria-describedby", "actividad-tipo-error", 1, "input"], ["id", "actividad-tipo-error", 1, "error-text"], ["for", "actividad-descripcion"], ["id", "actividad-descripcion", "formControlName", "descripcion", "maxlength", "255", "rows", "3", "aria-describedby", "actividad-descripcion-error", 1, "input"], ["id", "actividad-descripcion-error", 1, "error-text"], ["for", "actividad-inicio"], ["id", "actividad-inicio", "type", "date", "formControlName", "fecha_inicio", "aria-required", "true", "aria-describedby", "actividad-inicio-error", 1, "input"], ["id", "actividad-inicio-error", 1, "error-text"], ["for", "actividad-fin"], ["id", "actividad-fin", "type", "date", "formControlName", "fecha_fin", "aria-required", "true", "aria-describedby", "actividad-fin-error", 1, "input", 3, "min"], ["id", "actividad-fin-error", 1, "error-text"], ["for", "actividad-sede"], ["id", "actividad-sede", "formControlName", "sede", "maxlength", "100", "aria-describedby", "actividad-sede-error", 1, "input"], ["id", "actividad-sede-error", 1, "error-text"], ["for", "actividad-estado"], ["id", "actividad-estado", "formControlName", "estado", "aria-required", "true", "aria-describedby", "actividad-estado-error", 1, "input"], ["id", "actividad-estado-error", 1, "error-text"], [1, "acciones-formulario"], ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"], ["role", "status", 1, "form-ayuda"], [1, "detalle"], [1, "texto-largo"], [3, "routerLink", "queryParams"]], template: function ListarActividadesComponent_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "section", 10)(1, "div", 11, 0)(3, "div");
      \u0275\u0275element(4, "app-page-title", 12);
      \u0275\u0275elementStart(5, "p", 13);
      \u0275\u0275text(6, "Administra las actividades institucionales.");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(7, ListarActividadesComponent_a_7_Template, 2, 0, "a", 14);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "div", 15);
      \u0275\u0275listener("keydown", function ListarActividadesComponent_Template_div_keydown_8_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.alTeclearPestanas($event));
      });
      \u0275\u0275elementStart(9, "button", 16);
      \u0275\u0275listener("click", function ListarActividadesComponent_Template_button_click_9_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.volverAlListado());
      });
      \u0275\u0275text(10, "Mis actividades");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "span", 17)(12, "button", 18);
      \u0275\u0275listener("click", function ListarActividadesComponent_Template_button_click_12_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.actividadDetalle() !== null && ctx.pestana.set("detalle"));
      });
      \u0275\u0275text(13, "Detalles de la actividad");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "span", 19);
      \u0275\u0275text(15, "Selecciona una actividad para ver sus detalles");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(16, "div", 20)(17, "div", 21);
      \u0275\u0275template(18, ListarActividadesComponent_Conditional_18_Template, 3, 5, "div", 22);
      \u0275\u0275elementEnd();
      \u0275\u0275template(19, ListarActividadesComponent_Conditional_19_Template, 6, 3, "div", 23);
      \u0275\u0275elementStart(20, "div", 24)(21, "div", 25)(22, "label", 26);
      \u0275\u0275text(23, "Buscar por nombre");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "input", 27, 1);
      \u0275\u0275listener("input", function ListarActividadesComponent_Template_input_input_24_listener() {
        \u0275\u0275restoreView(_r1);
        const busqueda_r5 = \u0275\u0275reference(25);
        return \u0275\u0275resetView(ctx.filtrar("nombre", busqueda_r5.value));
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(26, "div", 28)(27, "label", 29);
      \u0275\u0275text(28, "\xC1rea");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(29, "select", 30, 2);
      \u0275\u0275listener("change", function ListarActividadesComponent_Template_select_change_29_listener() {
        \u0275\u0275restoreView(_r1);
        const areaFiltro_r6 = \u0275\u0275reference(30);
        return \u0275\u0275resetView(ctx.filtrar("area", areaFiltro_r6.value));
      });
      \u0275\u0275elementStart(31, "option", 31);
      \u0275\u0275text(32, "Todas las \xE1reas");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(33, ListarActividadesComponent_For_34_Template, 2, 3, "option", 32, _forTrack03);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(35, "button", 33);
      \u0275\u0275listener("click", function ListarActividadesComponent_Template_button_click_35_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.limpiarFiltros());
      });
      \u0275\u0275text(36, "Limpiar filtros");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(37, "div");
      \u0275\u0275template(38, ListarActividadesComponent_Conditional_38_Template, 2, 1, "p", 21)(39, ListarActividadesComponent_Conditional_39_Template, 4, 1);
      \u0275\u0275elementStart(40, "div", 34)(41, "table", 35)(42, "caption", 36);
      \u0275\u0275text(43, "Actividades registradas");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(44, "thead")(45, "tr")(46, "th", 37);
      \u0275\u0275text(47, "N.\xBA");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(48, "th", 38);
      \u0275\u0275text(49, "Nombre");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(50, "th", 38);
      \u0275\u0275text(51, "\xC1rea");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(52, "th", 38);
      \u0275\u0275text(53, "Tipo de actividad");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(54, "th", 37);
      \u0275\u0275text(55, "Fecha de inicio");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(56, "th", 37);
      \u0275\u0275text(57, "Fecha de fin");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(58, "th", 37);
      \u0275\u0275text(59, "Estado");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(60, "th", 37);
      \u0275\u0275text(61, "Acciones");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(62, "tbody");
      \u0275\u0275repeaterCreate(63, ListarActividadesComponent_For_64_Template, 24, 13, "tr", 39, _forTrack13, false, ListarActividadesComponent_ForEmpty_65_Template, 6, 1, "tr");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(66, "nav", 40)(67, "p", 41);
      \u0275\u0275template(68, ListarActividadesComponent_Conditional_68_Template, 1, 0)(69, ListarActividadesComponent_Conditional_69_Template, 1, 3);
      \u0275\u0275elementStart(70, "span", 36);
      \u0275\u0275text(71);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(72, "div", 42)(73, "label", 43);
      \u0275\u0275text(74, "Registros por p\xE1gina");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(75, "select", 44, 3);
      \u0275\u0275listener("change", function ListarActividadesComponent_Template_select_change_75_listener() {
        \u0275\u0275restoreView(_r1);
        const tamano_r12 = \u0275\u0275reference(76);
        return \u0275\u0275resetView(ctx.cambiarTamanoPagina(tamano_r12.value));
      });
      \u0275\u0275elementStart(77, "option", 45);
      \u0275\u0275text(78, "10");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(79, "option", 46);
      \u0275\u0275text(80, "20");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(81, "option", 47);
      \u0275\u0275text(82, "50");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(83, "div", 48)(84, "button", 49);
      \u0275\u0275listener("click", function ListarActividadesComponent_Template_button_click_84_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.pagina.set(ctx.paginaActual() - 1));
      });
      \u0275\u0275elementStart(85, "span", 50);
      \u0275\u0275text(86, "chevron_left");
      \u0275\u0275elementEnd();
      \u0275\u0275text(87, "Anterior");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(88, "button", 49);
      \u0275\u0275listener("click", function ListarActividadesComponent_Template_button_click_88_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.pagina.set(ctx.paginaActual() + 1));
      });
      \u0275\u0275text(89, "Siguiente");
      \u0275\u0275elementStart(90, "span", 50);
      \u0275\u0275text(91, "chevron_right");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275template(92, ListarActividadesComponent_Conditional_92_Template, 2, 0, "p", 21);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(93, "div", 51);
      \u0275\u0275template(94, ListarActividadesComponent_Conditional_94_Template, 2, 5, "p", 52)(95, ListarActividadesComponent_Conditional_95_Template, 1, 4, "app-detalle-actividad", 53)(96, ListarActividadesComponent_Conditional_96_Template, 2, 0, "p");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(97, "app-dialogo", 54, 4);
      \u0275\u0275template(99, ListarActividadesComponent_Conditional_99_Template, 34, 9);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(100, "app-dialogo", 55, 5);
      \u0275\u0275listener("cierreSolicitado", function ListarActividadesComponent_Template_app_dialogo_cierreSolicitado_100_listener() {
        \u0275\u0275restoreView(_r1);
        const dialogoPonentes_r20 = \u0275\u0275reference(101);
        return \u0275\u0275resetView(!ctx.guardandoPonente() && dialogoPonentes_r20.cerrar());
      })("cerrado", function ListarActividadesComponent_Template_app_dialogo_cerrado_100_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.cerrarDetalle());
      })("keydown.escape", function ListarActividadesComponent_Template_app_dialogo_keydown_escape_100_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.bloquearEscapePonentes($event));
      });
      \u0275\u0275template(102, ListarActividadesComponent_Conditional_102_Template, 14, 5);
      \u0275\u0275elementEnd();
      \u0275\u0275element(103, "app-dialogo-confirmacion", 56, 6);
      \u0275\u0275elementStart(105, "app-dialogo", 57, 7);
      \u0275\u0275listener("cerrado", function ListarActividadesComponent_Template_app_dialogo_cerrado_105_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.alCerrarFormulario());
      });
      \u0275\u0275template(107, ListarActividadesComponent_Conditional_107_Template, 3, 2, "section", 58);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(108, "app-dialogo", 59, 8);
      \u0275\u0275listener("cerrado", function ListarActividadesComponent_Template_app_dialogo_cerrado_108_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.cerrarDetalle());
      });
      \u0275\u0275template(110, ListarActividadesComponent_Conditional_110_Template, 2, 0, "p", 21)(111, ListarActividadesComponent_Conditional_111_Template, 2, 1, "div", 60)(112, ListarActividadesComponent_Conditional_112_Template, 56, 14);
      \u0275\u0275elementStart(113, "div", 61)(114, "button", 62);
      \u0275\u0275listener("click", function ListarActividadesComponent_Template_button_click_114_listener() {
        \u0275\u0275restoreView(_r1);
        const dialogoDetalle_r35 = \u0275\u0275reference(109);
        return \u0275\u0275resetView(dialogoDetalle_r35.cerrar());
      });
      \u0275\u0275text(115, "Cerrar");
      \u0275\u0275elementEnd()()();
      \u0275\u0275element(116, "app-dialogo-confirmacion", 63, 9);
    }
    if (rf & 2) {
      let tmp_18_0;
      let tmp_35_0;
      let tmp_36_0;
      let tmp_37_0;
      let tmp_40_0;
      let tmp_43_0;
      let tmp_44_0;
      let tmp_45_0;
      \u0275\u0275advance(7);
      \u0275\u0275property("appHasPermission", "solicitudes.crear");
      \u0275\u0275advance(2);
      \u0275\u0275attribute("aria-selected", ctx.pestana() === "listado")("tabindex", ctx.pestana() === "listado" ? 0 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275attribute("tabindex", ctx.actividadDetalle() === null ? 0 : null);
      \u0275\u0275advance();
      \u0275\u0275property("disabled", ctx.actividadDetalle() === null);
      \u0275\u0275attribute("aria-selected", ctx.pestana() === "detalle")("tabindex", ctx.pestana() === "detalle" ? 0 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("hidden", ctx.pestana() !== "listado");
      \u0275\u0275advance(2);
      \u0275\u0275conditional((tmp_18_0 = ctx.aviso()) ? 18 : -1, tmp_18_0);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.errorAreas() || ctx.errorTipos() ? 19 : -1);
      \u0275\u0275advance(5);
      \u0275\u0275property("value", ctx.filtros().nombre);
      \u0275\u0275advance(5);
      \u0275\u0275property("value", ctx.filtros().area);
      \u0275\u0275advance(4);
      \u0275\u0275repeater(ctx.areasFiltro());
      \u0275\u0275advance(4);
      \u0275\u0275attribute("aria-busy", ctx.cargando());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.cargando() || !ctx.listadoListo() ? 38 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.errorCarga() ? 39 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("hidden", !ctx.listadoListo());
      \u0275\u0275advance(23);
      \u0275\u0275repeater(ctx.listadoListo() ? ctx.visibles() : \u0275\u0275pureFunction0(36, _c7));
      \u0275\u0275advance(5);
      \u0275\u0275conditional(!ctx.listadoListo() ? 68 : 69);
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate2(" \xB7 P\xE1gina ", ctx.paginaActual(), " de ", ctx.totalPaginas(), "");
      \u0275\u0275advance(4);
      \u0275\u0275property("value", ctx.porPagina());
      \u0275\u0275advance(9);
      \u0275\u0275property("disabled", ctx.paginaActual() <= 1);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.paginaActual() >= ctx.totalPaginas());
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.cambiandoEstado() ? 92 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("hidden", ctx.pestana() !== "detalle");
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_35_0 = ctx.aviso()) ? 94 : -1, tmp_35_0);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_36_0 = ctx.actividadDetalle()) ? 95 : 96, tmp_36_0);
      \u0275\u0275advance(4);
      \u0275\u0275conditional((tmp_37_0 = ctx.seleccionada()) ? 99 : -1, tmp_37_0);
      \u0275\u0275advance();
      \u0275\u0275property("mostrarCerrar", true)("cierreControlado", true);
      \u0275\u0275advance(2);
      \u0275\u0275conditional((tmp_40_0 = ctx.actividadPonentes()) ? 102 : -1, tmp_40_0);
      \u0275\u0275advance(5);
      \u0275\u0275conditional(ctx.formularioAbierto() ? 107 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.cargandoDetalle() ? 110 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_43_0 = ctx.errorDetalle()) ? 111 : -1, tmp_43_0);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_44_0 = ctx.detalle()) ? 112 : -1, tmp_44_0);
      \u0275\u0275advance(4);
      \u0275\u0275property("titulo", "Cerrar actividad: " + ((tmp_45_0 = (tmp_45_0 = ctx.porCambiarEstado()) == null ? null : tmp_45_0.nombre) !== null && tmp_45_0 !== void 0 ? tmp_45_0 : ""));
    }
  }, dependencies: [RouterLink, ReactiveFormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, MaxLengthValidator, FormGroupDirective, FormControlName, PageTitleComponent, DialogoComponent, DialogoConfirmacionComponent, HasPermissionDirective, DetalleActividadComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n  background: var(--neutro-0);\n}\n.pestanas[_ngcontent-%COMP%] {\n  max-width: 100%;\n  overflow: visible;\n  flex-wrap: wrap;\n}\n[role=tab][_ngcontent-%COMP%] {\n  flex-shrink: 0;\n}\n.pestanas[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:disabled {\n  cursor: not-allowed;\n}\n[role=tabpanel][hidden][_ngcontent-%COMP%] {\n  display: none;\n}\n.encabezado[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: baseline;\n  justify-content: space-between;\n  gap: var(--espacio-3);\n  margin-bottom: var(--espacio-5);\n}\n.descripcion[_ngcontent-%COMP%] {\n  margin: 0;\n  color: var(--neutro-500);\n}\n.filtros[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: end;\n  gap: var(--espacio-3);\n  margin-bottom: var(--espacio-5);\n}\n.filtros[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%] {\n  flex: 1 1 10rem;\n  min-width: 0;\n  margin-bottom: 0;\n}\n.filtros[_ngcontent-%COMP%]   .buscador[_ngcontent-%COMP%] {\n  flex-grow: 2;\n}\n.tabla-caja[_ngcontent-%COMP%] {\n  overflow-x: auto;\n  border: 1px solid var(--neutro-200);\n  border-radius: var(--radio-lg);\n}\n.tabla-caja[_ngcontent-%COMP%]   .table[_ngcontent-%COMP%] {\n  min-width: 58rem;\n}\n.tabla-caja[_ngcontent-%COMP%]   td[_ngcontent-%COMP%], \n.tabla-caja[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  padding-block: var(--espacio-3);\n}\n.tabla-caja[_ngcontent-%COMP%]   .table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]:first-child, \n.tabla-caja[_ngcontent-%COMP%]   .table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:first-child {\n  padding-left: var(--espacio-4);\n}\n.tabla-caja[_ngcontent-%COMP%]   .table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:last-child {\n  padding-right: var(--espacio-2);\n}\n.tabla-caja[_ngcontent-%COMP%]   .table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]:last-child {\n  text-align: center;\n}\n.nombre-actividad[_ngcontent-%COMP%] {\n  min-width: 13rem;\n  overflow-wrap: anywhere;\n}\ntr.registro-inactivo[_ngcontent-%COMP%]   .nombre-actividad[_ngcontent-%COMP%] {\n  font-weight: 500;\n}\n.acciones-fila[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  gap: 2px;\n}\n.gestionar-actividad[_ngcontent-%COMP%] {\n  color: #075a9b;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n}\n.gestionar-actividad[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n  flex: none;\n}\n.gestionar-actividad[_ngcontent-%COMP%]:hover {\n  background: #eef5fc;\n}\n.gestionar-actividad[_ngcontent-%COMP%]:focus-visible {\n  outline: 3px solid #075a9b;\n  outline-offset: 2px;\n}\n.contexto-actividad[_ngcontent-%COMP%] {\n  overflow-wrap: anywhere;\n}\n.panel-acciones[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 1rem;\n  margin-block: 1.5rem;\n}\n.tarjeta-accion[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 0.75rem;\n  min-height: 7.5rem;\n  padding: 1rem 0.5rem;\n  border: 1px solid var(--neutro-200);\n  border-radius: var(--radio-lg);\n  background: var(--neutro-0);\n  color: var(--neutro-900);\n  font: inherit;\n  text-decoration: none;\n  text-align: center;\n  cursor: pointer;\n}\n.tarjeta-accion[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%] {\n  font-size: 2rem;\n  color: #1763b2;\n}\n.tarjeta-accion[_ngcontent-%COMP%]:hover:not(:disabled) {\n  border-color: #1763b2;\n  background: #eef5fc;\n}\n.tarjeta-accion[_ngcontent-%COMP%]:focus-visible {\n  outline: 3px solid #1763b2;\n  outline-offset: 3px;\n}\n.tarjeta-accion[_ngcontent-%COMP%]:disabled {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\n.tarjeta-cerrar[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%] {\n  color: #ba5509;\n}\n[_nghost-%COMP%]     app-dialogo.modal-acciones > dialog.dialogo {\n  width: min(38rem, 100vw - 2rem);\n  max-height: calc(100dvh - 2rem);\n  overflow-y: auto;\n}\n@media (max-width: 480px) {\n  .panel-acciones[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n    gap: 0.75rem;\n  }\n}\n@media (max-width: 300px) {\n  .panel-acciones[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n  }\n}\n.tamano-pagina[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: var(--espacio-2);\n}\n.tamano-pagina[_ngcontent-%COMP%]   .input[_ngcontent-%COMP%] {\n  width: auto;\n}\n.formulario[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n[_nghost-%COMP%]     app-dialogo.modal-actividad > dialog.dialogo, \n[_nghost-%COMP%]     app-dialogo.modal-ponentes > dialog.dialogo {\n  width: min(48rem, 100vw - 2 * var(--espacio-4));\n  max-height: calc(100dvh - 2 * var(--espacio-4));\n  overflow-y: auto;\n  overscroll-behavior: contain;\n}\n.rejilla-formulario[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  column-gap: var(--espacio-5);\n}\n.ancho-completo[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\ntextarea[_ngcontent-%COMP%] {\n  resize: vertical;\n}\n.acciones-formulario[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: flex-end;\n  gap: var(--espacio-3);\n}\n.detalle[_ngcontent-%COMP%] {\n  margin-block: var(--espacio-4) var(--espacio-5);\n}\n.detalle[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  padding-block: var(--espacio-2);\n  border-bottom: 1px solid var(--neutro-100);\n}\n.detalle[_ngcontent-%COMP%]   dt[_ngcontent-%COMP%] {\n  color: var(--neutro-500);\n  font-size: 0.8125rem;\n}\n.detalle[_ngcontent-%COMP%]   dd[_ngcontent-%COMP%] {\n  margin: 0;\n  overflow-wrap: anywhere;\n}\n.texto-largo[_ngcontent-%COMP%] {\n  white-space: pre-wrap;\n}\n.ponentes[_ngcontent-%COMP%] {\n  padding-left: var(--espacio-5);\n}\n.ponentes[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  margin-bottom: var(--espacio-4);\n}\n.ponentes[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: block;\n}\n@media (max-width: 600px) {\n  .rejilla-formulario[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n  }\n  .filtros[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%] {\n    flex-basis: 100%;\n  }\n  .limpiar[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n  .formulario[_ngcontent-%COMP%] {\n    padding: var(--espacio-4);\n  }\n}\n[_nghost-%COMP%]   .tabla-caja[hidden][_ngcontent-%COMP%] {\n  display: none;\n}\n/*# sourceMappingURL=listar-actividades.component.css.map */", "\n\n.ayuda-pestana[_ngcontent-%COMP%] {\n  position: relative;\n  display: inline-flex;\n}\n.tooltip-detalles[_ngcontent-%COMP%] {\n  position: absolute;\n  top: calc(100% + 0.35rem);\n  right: 0;\n  z-index: 5;\n  width: max-content;\n  max-width: min(18rem, 80vw);\n  padding: 0.5rem 0.75rem;\n  border-radius: 0.4rem;\n  color: #fff;\n  background: #075a9b;\n  font-size: 0.85rem;\n  pointer-events: none;\n  visibility: hidden;\n}\n.ayuda-pestana[_ngcontent-%COMP%]:hover   .tooltip-detalles[_ngcontent-%COMP%], \n.ayuda-pestana[_ngcontent-%COMP%]:focus-within   .tooltip-detalles[_ngcontent-%COMP%] {\n  visibility: visible;\n}\n.ayuda-pestana[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid #075a9b;\n  outline-offset: 2px;\n}\n/*# sourceMappingURL=actividades-pestanas.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ListarActividadesComponent, { className: "ListarActividadesComponent", filePath: "src\\app\\pages\\actividades\\listar-actividades\\listar-actividades.component.ts", lineNumber: 27 });
})();
export {
  ListarActividadesComponent
};
//# sourceMappingURL=chunk-ZGBY4KT3.mjs.map
