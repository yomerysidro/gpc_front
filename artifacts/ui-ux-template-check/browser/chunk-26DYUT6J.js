import {
  documentoAnulado,
  etiquetaEstado
} from "./chunk-HFMUGKOY.js";
import {
  EmisionCertificadosService
} from "./chunk-4FUGVTHD.js";
import "./chunk-RJ22SAW5.js";
import {
  PageTitleComponent
} from "./chunk-YHURBVQM.js";
import {
  Router,
  RouterLink
} from "./chunk-A36LAIDM.js";
import {
  AuthService
} from "./chunk-W2463ZNS.js";
import "./chunk-C4J44J4Z.js";
import "./chunk-LSGUT5KG.js";
import "./chunk-7PBBQCKX.js";
import {
  takeUntilDestroyed
} from "./chunk-IJ23LC2U.js";
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
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-YLHEVWGL.js";
import {
  DestroyRef,
  afterNextRender,
  catchError,
  computed,
  concatMap,
  defer,
  forkJoin,
  from,
  inject,
  input,
  map,
  mergeMap,
  of,
  output,
  shareReplay,
  signal,
  switchMap,
  tap,
  throwError,
  toArray,
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
  ɵɵproperty,
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
  ɵɵtextInterpolate2
} from "./chunk-3ZDGBTDF.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-ZX6IUAQ5.js";

// src/app/pages/emision-certificados/reconocimientos/components/reconocimiento-card/reconocimiento-card.component.ts
var _forTrack0 = ($index, $item) => $item.certificado.id_certificado;
var _forTrack1 = ($index, $item) => $item.id_certificado_documento;
var _c0 = (a0) => ["/certificaciones/certificados", a0];
var _c1 = (a0) => ["/certificaciones/reconocimientos", a0];
var _c2 = (a0) => ["/certificaciones/reconocimientos", a0, "editar"];
function ReconocimientoCardComponent_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.estadoRelacion(ctx_r0.persona(), "Nombre") || "Nombre no disponible.");
  }
}
function ReconocimientoCardComponent_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 8);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx.cargo || "No registrado");
  }
}
function ReconocimientoCardComponent_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.estadoRelacion(ctx_r0.trabajador(), "Trabajador"));
  }
}
function ReconocimientoCardComponent_Conditional_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 12);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.estadoRelacion(ctx_r0.certificacion(), "Certificados"));
  }
}
function ReconocimientoCardComponent_Conditional_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "Sin certificado asociado.");
    \u0275\u0275elementEnd();
  }
}
function ReconocimientoCardComponent_For_37_Conditional_5_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "Documento pendiente de generaci\xF3n.");
    \u0275\u0275elementEnd();
  }
}
function ReconocimientoCardComponent_For_37_Conditional_5_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 18);
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "br");
    \u0275\u0275elementStart(5, "span", 19);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const documento_r2 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Documento #", documento_r2.id_certificado_documento, " \xB7 ");
    \u0275\u0275advance();
    \u0275\u0275classProp("anulado", ctx_r0.anulado(documento_r2.estado));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(documento_r2.estado);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(documento_r2.codigo_verificacion || "C\xF3digo pendiente");
  }
}
function ReconocimientoCardComponent_For_37_Conditional_5_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const fila_r3 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", fila_r3.documentos.datos.length, " versiones. Consulta el historial completo en el detalle.");
  }
}
function ReconocimientoCardComponent_For_37_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, ReconocimientoCardComponent_For_37_Conditional_5_Conditional_0_Template, 2, 0, "p");
    \u0275\u0275repeaterCreate(1, ReconocimientoCardComponent_For_37_Conditional_5_For_2_Template, 7, 5, "p", 18, _forTrack1);
    \u0275\u0275template(3, ReconocimientoCardComponent_For_37_Conditional_5_Conditional_3_Template, 2, 1, "p", 7);
  }
  if (rf & 2) {
    const fila_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275conditional(!fila_r3.documentos.datos.length ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(fila_r3.documentos.datos.slice(0, 3));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(fila_r3.documentos.datos.length > 3 ? 3 : -1);
  }
}
function ReconocimientoCardComponent_For_37_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 12);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const fila_r3 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.estadoRelacion(fila_r3.documentos, "Documentos"));
  }
}
function ReconocimientoCardComponent_For_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 16);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "details")(3, "summary");
    \u0275\u0275text(4, "Documentos asociados");
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, ReconocimientoCardComponent_For_37_Conditional_5_Template, 4, 2)(6, ReconocimientoCardComponent_For_37_Conditional_6_Template, 2, 1, "p", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "a", 17);
    \u0275\u0275text(8, "Detalle del certificado");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const fila_r3 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("Certificado #", fila_r3.certificado.id_certificado, " \xB7 ", ctx_r0.estadoRegistro(fila_r3.certificado.estado), "");
    \u0275\u0275advance(4);
    \u0275\u0275conditional(fila_r3.documentos.estado === "disponible" ? 5 : 6);
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(4, _c0, fila_r3.certificado.id_certificado));
  }
}
function ReconocimientoCardComponent_Conditional_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 13)(1, "span", 20);
    \u0275\u0275text(2, "visibility");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(1, _c1, ctx_r0.reconocimiento().id_reconocimiento));
  }
}
function ReconocimientoCardComponent_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 21);
    \u0275\u0275listener("click", function ReconocimientoCardComponent_Conditional_40_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.eliminar.emit());
    });
    \u0275\u0275elementStart(1, "span", 20);
    \u0275\u0275text(2, "delete");
    \u0275\u0275elementEnd()();
  }
}
function ReconocimientoCardComponent_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 15)(1, "span", 20);
    \u0275\u0275text(2, "edit");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(1, _c2, ctx_r0.reconocimiento().id_reconocimiento));
  }
}
var ReconocimientoCardComponent = class _ReconocimientoCardComponent {
  reconocimiento = input.required();
  trabajador = input({ estado: "cargando" });
  persona = input({ estado: "cargando" });
  area = input({ estado: "cargando" });
  certificacion = input({ estado: "cargando" });
  puedeEliminar = input(false);
  eliminar = output();
  puedeEditar = input(false);
  puedeVerDetalle = input(false);
  dni = input(null);
  anulado = documentoAnulado;
  estadoRegistro = etiquetaEstado;
  nombre = computed(() => {
    const persona = this.persona();
    return persona.estado === "disponible" ? [persona.datos.nombres, persona.datos.apellido_paterno, persona.datos.apellido_materno].filter(Boolean).join(" ").trim() : "";
  });
  trabajadorActual = computed(() => {
    const fila = this.trabajador();
    return fila.estado === "disponible" ? fila.datos : null;
  });
  areaActual = computed(() => {
    const fila = this.area();
    return fila.estado === "disponible" ? fila.datos : null;
  });
  certificados = computed(() => {
    const filas = this.certificacion();
    return filas.estado === "disponible" ? filas.datos : [];
  });
  estadoRelacion(relacion, campo) {
    switch (relacion.estado) {
      case "cargando":
        return `Consultando ${campo}\u2026`;
      case "sin-permiso":
        return `${campo}: acceso restringido.`;
      case "no-encontrado":
        return `${campo}: registro no encontrado.`;
      case "error":
        return `${campo}: no se pudo consultar.`;
      default:
        return "";
    }
  }
  static \u0275fac = function ReconocimientoCardComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ReconocimientoCardComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ReconocimientoCardComponent, selectors: [["app-reconocimiento-card"]], inputs: { reconocimiento: [1, "reconocimiento"], trabajador: [1, "trabajador"], persona: [1, "persona"], area: [1, "area"], certificacion: [1, "certificacion"], puedeEliminar: [1, "puedeEliminar"], puedeEditar: [1, "puedeEditar"], puedeVerDetalle: [1, "puedeVerDetalle"], dni: [1, "dni"] }, outputs: { eliminar: "eliminar" }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 42, vars: 17, consts: [[1, "tarjeta"], [1, "identidad"], ["aria-hidden", "true", 1, "material-symbols-outlined", "medalla"], [1, "etiqueta"], [1, "badge"], [1, "contenido"], [1, "trabajador"], [1, "dato-relacion"], [1, "cargo"], [3, "id"], [1, "descripcion"], ["aria-label", "Estado de certificaci\xF3n", 1, "certificacion"], ["role", "status"], ["aria-label", "Ver detalle", "title", "Ver detalle", 1, "btn", "btn-consulta", "btn-icono", 3, "routerLink"], ["type", "button", "aria-label", "Eliminar", "title", "Eliminar", 1, "btn", "btn-icono"], ["aria-label", "Editar", "title", "Editar", 1, "btn", "btn-icono", 3, "routerLink"], [1, "estado-certificado"], [1, "btn", 3, "routerLink"], [1, "documento"], [1, "codigo"], ["aria-hidden", "true", 1, "material-symbols-outlined"], ["type", "button", "aria-label", "Eliminar", "title", "Eliminar", 1, "btn", "btn-icono", 3, "click"]], template: function ReconocimientoCardComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "article", 0)(1, "div", 1)(2, "span", 2);
      \u0275\u0275text(3, "military_tech");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "span", 3);
      \u0275\u0275text(5, "Reconocimiento institucional");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "span", 4);
      \u0275\u0275text(7);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "div", 5)(9, "p", 6);
      \u0275\u0275text(10);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "p");
      \u0275\u0275text(12);
      \u0275\u0275elementEnd();
      \u0275\u0275template(13, ReconocimientoCardComponent_Conditional_13_Template, 2, 1, "p", 7)(14, ReconocimientoCardComponent_Conditional_14_Template, 2, 1, "p", 8)(15, ReconocimientoCardComponent_Conditional_15_Template, 2, 1, "p", 7);
      \u0275\u0275elementStart(16, "p", 7);
      \u0275\u0275text(17);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "h2", 9);
      \u0275\u0275text(19);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(20, "p", 10);
      \u0275\u0275text(21);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "dl")(23, "dt");
      \u0275\u0275text(24, "Motivo");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "dd");
      \u0275\u0275text(26);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(27, "dt");
      \u0275\u0275text(28, "Fecha del reconocimiento");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(29, "dd");
      \u0275\u0275text(30);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(31, "section", 11)(32, "h3");
      \u0275\u0275text(33, "Certificaci\xF3n");
      \u0275\u0275elementEnd();
      \u0275\u0275template(34, ReconocimientoCardComponent_Conditional_34_Template, 2, 1, "p", 12)(35, ReconocimientoCardComponent_Conditional_35_Template, 2, 0, "p");
      \u0275\u0275repeaterCreate(36, ReconocimientoCardComponent_For_37_Template, 9, 6, null, null, _forTrack0);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(38, "footer");
      \u0275\u0275template(39, ReconocimientoCardComponent_Conditional_39_Template, 3, 3, "a", 13)(40, ReconocimientoCardComponent_Conditional_40_Template, 3, 0, "button", 14)(41, ReconocimientoCardComponent_Conditional_41_Template, 3, 3, "a", 15);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      let tmp_6_0;
      let tmp_7_0;
      \u0275\u0275attribute("aria-labelledby", "reconocimiento-" + ctx.reconocimiento().id_reconocimiento);
      \u0275\u0275advance(6);
      \u0275\u0275attribute("data-estado", ctx.reconocimiento().estado);
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.reconocimiento().estado);
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.nombre() || "Trabajador #" + ctx.reconocimiento().id_persona_trabajador);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1("DNI: ", ctx.dni() || "No disponible", "");
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.nombre() ? 13 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_6_0 = ctx.trabajadorActual()) ? 14 : 15, tmp_6_0);
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(((tmp_7_0 = ctx.areaActual()) == null ? null : tmp_7_0.nombre) || ctx.estadoRelacion(ctx.area(), "\xC1rea") || "\xC1rea no disponible.");
      \u0275\u0275advance();
      \u0275\u0275property("id", "reconocimiento-" + ctx.reconocimiento().id_reconocimiento);
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.reconocimiento().titulo);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.reconocimiento().descripcion || "No registrado");
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(ctx.reconocimiento().motivo || "No registrado");
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(ctx.reconocimiento().fecha_reconocimiento);
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.certificacion().estado !== "disponible" ? 34 : !ctx.certificados().length ? 35 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275repeater(ctx.certificados());
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.puedeVerDetalle() ? 39 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.puedeEliminar() ? 40 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.puedeEditar() ? 41 : -1);
    }
  }, dependencies: [RouterLink], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n  height: 100%;\n}\n.tarjeta[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  border: 1px solid var(--neutro-200);\n  border-top: 4px solid var(--boton-dorado);\n  border-radius: var(--radio-lg);\n  background: var(--neutro-0);\n  overflow-wrap: anywhere;\n  overflow: hidden;\n}\n.identidad[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: var(--espacio-2);\n  padding: var(--espacio-4);\n  background: var(--boton-hover-suave);\n  color: var(--boton-azul);\n}\n.medalla[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n}\n.etiqueta[_ngcontent-%COMP%] {\n  flex: 1;\n  font-size: 0.75rem;\n  font-weight: 600;\n}\n.contenido[_ngcontent-%COMP%] {\n  flex: 1;\n  padding: var(--espacio-3) var(--espacio-4);\n}\n.trabajador[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.125rem;\n  font-weight: 600;\n  color: var(--boton-texto);\n}\n.cargo[_ngcontent-%COMP%] {\n  margin: var(--espacio-1) 0;\n}\n.dato-relacion[_ngcontent-%COMP%] {\n  margin-block: var(--espacio-2);\n  color: var(--neutro-700);\n  font-size: 0.8125rem;\n}\nh2[_ngcontent-%COMP%] {\n  margin-top: var(--espacio-3);\n  font-size: 1.125rem;\n  color: var(--boton-azul);\n}\nh3[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n}\n.descripcion[_ngcontent-%COMP%] {\n  color: var(--neutro-700);\n  white-space: pre-line;\n}\ndt[_ngcontent-%COMP%] {\n  font-size: 0.8125rem;\n  color: var(--neutro-500);\n}\ndd[_ngcontent-%COMP%] {\n  margin: 0 0 var(--espacio-3);\n  white-space: pre-line;\n}\n.certificacion[_ngcontent-%COMP%] {\n  border-top: 1px solid var(--neutro-200);\n  padding-top: var(--espacio-2);\n}\n.estado-certificado[_ngcontent-%COMP%], \n.codigo[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n.documento[_ngcontent-%COMP%] {\n  padding-left: var(--espacio-3);\n  border-left: 3px solid var(--boton-azul);\n  font-size: 0.875rem;\n}\n.anulado[_ngcontent-%COMP%] {\n  color: var(--color-error);\n  font-weight: 600;\n}\n.certificacion[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n  margin-bottom: var(--espacio-2);\n}\nfooter[_ngcontent-%COMP%] {\n  display: flex;\n  gap: var(--espacio-2);\n  flex-wrap: wrap;\n  padding: var(--espacio-4) var(--espacio-5);\n  border-top: 1px solid var(--neutro-100);\n}\n.contenido[_ngcontent-%COMP%]    > p[_ngcontent-%COMP%] {\n  margin-block: var(--espacio-2);\n}\n/*# sourceMappingURL=reconocimiento-card.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ReconocimientoCardComponent, { className: "ReconocimientoCardComponent", filePath: "src\\app\\pages\\emision-certificados\\reconocimientos\\components\\reconocimiento-card\\reconocimiento-card.component.ts", lineNumber: 12 });
})();

// src/app/pages/emision-certificados/reconocimientos/listar-reconocimientos/listar-reconocimientos.component.ts
var _forTrack02 = ($index, $item) => $item.id_persona_trabajador;
var _forTrack12 = ($index, $item) => $item.id_reconocimiento;
function ListarReconocimientosComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 1);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function ListarReconocimientosComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 2)(1, "h2", 4);
    \u0275\u0275text(2, "Eliminar reconocimiento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 5)(6, "button", 6);
    \u0275\u0275listener("click", function ListarReconocimientosComponent_Conditional_2_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.eliminar());
    });
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "button", 6);
    \u0275\u0275listener("click", function ListarReconocimientosComponent_Conditional_2_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.pendienteEliminar.set(null));
    });
    \u0275\u0275text(9, "Cancelar");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("\xBFDeseas eliminar \xAB", ctx.titulo, "\xBB? Esta acci\xF3n no se puede deshacer. No se puede eliminar si tiene certificados asociados.");
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.eliminando());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.eliminando() ? "Eliminando\u2026" : "Confirmar eliminaci\xF3n");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.eliminando());
  }
}
function ListarReconocimientosComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 3)(1, "h2");
    \u0275\u0275text(2, "Sin permiso de consulta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.error() || "No tienes permiso para consultar reconocimientos.");
  }
}
function ListarReconocimientosComponent_Conditional_4_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 9)(1, "span", 23);
    \u0275\u0275text(2, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, "Registrar reconocimiento");
    \u0275\u0275elementEnd();
  }
}
function ListarReconocimientosComponent_Conditional_4_For_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 19);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const estado_r4 = ctx.$implicit;
    \u0275\u0275property("value", estado_r4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(estado_r4);
  }
}
function ListarReconocimientosComponent_Conditional_4_Conditional_24_For_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 19);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const fila_r5 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("value", fila_r5.id_persona_trabajador);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.trabajador(fila_r5.id_persona_trabajador));
  }
}
function ListarReconocimientosComponent_Conditional_4_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13)(1, "label", 29);
    \u0275\u0275text(2, "Buscar trabajador por nombre, apellido, cargo o ID");
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "input", 30);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 13)(5, "label", 31);
    \u0275\u0275text(6, "Trabajador registrado en Gesti\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "select", 32)(8, "option", 18);
    \u0275\u0275text(9, "Todos los trabajadores");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(10, ListarReconocimientosComponent_Conditional_4_Conditional_24_For_11_Template, 2, 2, "option", 19, _forTrack02);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(10);
    \u0275\u0275repeater(ctx_r1.opcionesTrabajador());
  }
}
function ListarReconocimientosComponent_Conditional_4_Conditional_34_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 33);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const estadoGestion_r6 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Gesti\xF3n restringida: ", estadoGestion_r6.mensaje, " Los reconocimientos siguen disponibles.");
  }
}
function ListarReconocimientosComponent_Conditional_4_Conditional_34_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 34);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const estadoGestion_r6 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("No se pudo cargar el cat\xE1logo de trabajadores: ", estadoGestion_r6.mensaje, "");
  }
}
function ListarReconocimientosComponent_Conditional_4_Conditional_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, ListarReconocimientosComponent_Conditional_4_Conditional_34_Conditional_0_Template, 2, 1, "p", 33)(1, ListarReconocimientosComponent_Conditional_4_Conditional_34_Conditional_1_Template, 2, 1, "p", 34);
  }
  if (rf & 2) {
    const estadoGestion_r6 = ctx;
    \u0275\u0275conditional(estadoGestion_r6.estado === "sin-permiso" ? 0 : estadoGestion_r6.estado === "error" || estadoGestion_r6.estado === "no-encontrado" ? 1 : -1);
  }
}
function ListarReconocimientosComponent_Conditional_4_Conditional_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 26);
    \u0275\u0275text(1, "Cargando reconocimientos y sus relaciones\u2026");
    \u0275\u0275elementEnd();
  }
}
function ListarReconocimientosComponent_Conditional_4_Conditional_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 27);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("No se pudieron consultar los DNI: ", ctx, "");
  }
}
function ListarReconocimientosComponent_Conditional_4_Conditional_37_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 34);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 35);
    \u0275\u0275listener("click", function ListarReconocimientosComponent_Conditional_4_Conditional_37_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.reintentar());
    });
    \u0275\u0275text(3, "Reintentar");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function ListarReconocimientosComponent_Conditional_4_Conditional_38_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 37)(1, "span", 23);
    \u0275\u0275text(2, "military_tech");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h3");
    \u0275\u0275text(4, "No hay reconocimientos con estos filtros");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p");
    \u0275\u0275text(6, "Revisa los criterios de b\xFAsqueda o registra un reconocimiento para un trabajador existente.");
    \u0275\u0275elementEnd()();
  }
}
function ListarReconocimientosComponent_Conditional_4_Conditional_38_For_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-reconocimiento-card", 42);
    \u0275\u0275listener("eliminar", function ListarReconocimientosComponent_Conditional_4_Conditional_38_For_9_Template_app_reconocimiento_card_eliminar_0_listener() {
      const registro_r10 = \u0275\u0275restoreView(_r9).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.solicitarEliminar(registro_r10));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_14_0;
    const registro_r10 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("reconocimiento", registro_r10)("dni", (tmp_14_0 = ctx_r1.dni()[(tmp_14_0 = (tmp_14_0 = ctx_r1.trabajadoresPorId().get(registro_r10.id_persona_trabajador)) == null ? null : tmp_14_0.id_persona) !== null && tmp_14_0 !== void 0 ? tmp_14_0 : 0]) !== null && tmp_14_0 !== void 0 ? tmp_14_0 : null)("trabajador", ctx_r1.trabajadorRelacion(registro_r10))("persona", ctx_r1.personaRelacion(registro_r10))("area", ctx_r1.areaRelacion(registro_r10))("certificacion", ctx_r1.certificacionRelacion(registro_r10.id_reconocimiento))("puedeEliminar", ctx_r1.auth.tienePermiso("reconocimientos.eliminar"))("puedeEditar", ctx_r1.auth.tienePermiso("reconocimientos.editar"))("puedeVerDetalle", ctx_r1.auth.tienePermiso("reconocimientos.ver"));
  }
}
function ListarReconocimientosComponent_Conditional_4_Conditional_38_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 40)(1, "p");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 5)(4, "button", 6);
    \u0275\u0275listener("click", function ListarReconocimientosComponent_Conditional_4_Conditional_38_Conditional_10_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r11);
      const paginaActual_r12 = \u0275\u0275nextContext();
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.cargar(paginaActual_r12.current_page - 1));
    });
    \u0275\u0275text(5, "Anterior");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 6);
    \u0275\u0275listener("click", function ListarReconocimientosComponent_Conditional_4_Conditional_38_Conditional_10_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r11);
      const paginaActual_r12 = \u0275\u0275nextContext();
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.cargar(paginaActual_r12.current_page + 1));
    });
    \u0275\u0275text(7, "Siguiente");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const paginaActual_r12 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("P\xE1gina ", paginaActual_r12.current_page, " de ", paginaActual_r12.last_page, "");
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", paginaActual_r12.current_page <= 1 || ctx_r1.cargando());
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", paginaActual_r12.current_page >= paginaActual_r12.last_page || ctx_r1.cargando());
  }
}
function ListarReconocimientosComponent_Conditional_4_Conditional_38_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 28)(1, "div", 7)(2, "h2", 36);
    \u0275\u0275text(3, "Registros de reconocimientos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 25);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(6, ListarReconocimientosComponent_Conditional_4_Conditional_38_Conditional_6_Template, 7, 0, "div", 37);
    \u0275\u0275elementStart(7, "div", 38);
    \u0275\u0275repeaterCreate(8, ListarReconocimientosComponent_Conditional_4_Conditional_38_For_9_Template, 1, 9, "app-reconocimiento-card", 39, _forTrack12);
    \u0275\u0275elementEnd();
    \u0275\u0275template(10, ListarReconocimientosComponent_Conditional_4_Conditional_38_Conditional_10_Template, 8, 4, "div", 40);
    \u0275\u0275elementStart(11, "p", 25);
    \u0275\u0275text(12, "Los nombres y \xE1reas dependen de los permisos de lectura de Gesti\xF3n. ");
    \u0275\u0275elementStart(13, "button", 41);
    \u0275\u0275listener("click", function ListarReconocimientosComponent_Conditional_4_Conditional_38_Template_button_click_13_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.reintentar());
    });
    \u0275\u0275text(14, "Actualizar relaciones");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const paginaActual_r12 = ctx;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275attribute("aria-busy", ctx_r1.cargando());
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", paginaActual_r12.total, " registros encontrados");
    \u0275\u0275advance();
    \u0275\u0275conditional(!paginaActual_r12.data.length ? 6 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(paginaActual_r12.data);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(paginaActual_r12.data.length ? 10 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r1.cargando());
  }
}
function ListarReconocimientosComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 7)(1, "p", 8);
    \u0275\u0275text(2, "Reconocimientos del personal municipal y estado de sus documentos asociados.");
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, ListarReconocimientosComponent_Conditional_4_Conditional_3_Template, 4, 0, "a", 9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "form", 10);
    \u0275\u0275listener("ngSubmit", function ListarReconocimientosComponent_Conditional_4_Template_form_ngSubmit_4_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cargar());
    });
    \u0275\u0275elementStart(5, "h2", 11);
    \u0275\u0275text(6, "Buscar reconocimientos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 12)(8, "div", 13)(9, "label", 14);
    \u0275\u0275text(10, "T\xEDtulo exacto");
    \u0275\u0275elementEnd();
    \u0275\u0275element(11, "input", 15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 13)(13, "label", 16);
    \u0275\u0275text(14, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "select", 17)(16, "option", 18);
    \u0275\u0275text(17, "Todos los estados");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(18, ListarReconocimientosComponent_Conditional_4_For_19_Template, 2, 2, "option", 19, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "div", 13)(21, "label", 20);
    \u0275\u0275text(22, "Fecha del reconocimiento");
    \u0275\u0275elementEnd();
    \u0275\u0275element(23, "input", 21);
    \u0275\u0275elementEnd();
    \u0275\u0275template(24, ListarReconocimientosComponent_Conditional_4_Conditional_24_Template, 12, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "div", 5)(26, "button", 22)(27, "span", 23);
    \u0275\u0275text(28, "search");
    \u0275\u0275elementEnd();
    \u0275\u0275text(29, "Buscar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "button", 24);
    \u0275\u0275listener("click", function ListarReconocimientosComponent_Conditional_4_Template_button_click_30_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.limpiar());
    });
    \u0275\u0275text(31, "Limpiar");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(32, "p", 25);
    \u0275\u0275text(33, "T\xEDtulo, fecha y estado utilizan coincidencias exactas. Busca por nombre, apellido, cargo o ID y selecciona un trabajador para filtrar los reconocimientos. Los estados se obtienen de los registros existentes.");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(34, ListarReconocimientosComponent_Conditional_4_Conditional_34_Template, 2, 1)(35, ListarReconocimientosComponent_Conditional_4_Conditional_35_Template, 2, 0, "p", 26)(36, ListarReconocimientosComponent_Conditional_4_Conditional_36_Template, 2, 1, "p", 27)(37, ListarReconocimientosComponent_Conditional_4_Conditional_37_Template, 4, 1)(38, ListarReconocimientosComponent_Conditional_4_Conditional_38_Template, 15, 5, "section", 28);
  }
  if (rf & 2) {
    let tmp_7_0;
    let tmp_9_0;
    let tmp_10_0;
    let tmp_11_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.auth.tienePermiso("reconocimientos.crear") ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("formGroup", ctx_r1.filtro);
    \u0275\u0275advance(14);
    \u0275\u0275repeater(ctx_r1.estados());
    \u0275\u0275advance(6);
    \u0275\u0275conditional(ctx_r1.auth.tienePermiso("ponentes-firmantes.ver") ? 24 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.cargando());
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", ctx_r1.cargando());
    \u0275\u0275advance(4);
    \u0275\u0275conditional((tmp_7_0 = ctx_r1.estadoTrabajadores()) ? 34 : -1, tmp_7_0);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.cargando() ? 35 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_9_0 = ctx_r1.errorDni()) ? 36 : -1, tmp_9_0);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_10_0 = ctx_r1.error()) ? 37 : -1, tmp_10_0);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_11_0 = ctx_r1.pagina()) ? 38 : -1, tmp_11_0);
  }
}
var ListarReconocimientosComponent = class _ListarReconocimientosComponent {
  api = inject(EmisionCertificadosService);
  destroyRef = inject(DestroyRef);
  auth = inject(AuthService);
  carga;
  trabajadoresCache;
  personasCache = /* @__PURE__ */ new Map();
  areasCache = /* @__PURE__ */ new Map();
  documentosCache = /* @__PURE__ */ new Map();
  personaDenegada = null;
  areaDenegada = null;
  pagina = signal(null);
  trabajadores = signal([]);
  estadoTrabajadores = signal({ estado: "cargando" });
  personas = signal({});
  areas = signal({});
  certificaciones = signal({});
  cargando = signal(false);
  error = signal(null);
  dni = signal({});
  errorDni = signal(null);
  sinPermiso = signal(false);
  trabajadoresPorId = computed(() => new Map(this.trabajadores().map((fila) => [fila.id_persona_trabajador, fila])));
  filtro = inject(NonNullableFormBuilder).group({ titulo: "", trabajador: "", estado: "", fecha: "", buscarTrabajador: "" });
  estados = signal([]);
  mensaje = signal(inject(Router).getCurrentNavigation()?.extras.state?.["mensaje"] ?? null);
  eliminando = signal(false);
  pendienteEliminar = signal(null);
  constructor() {
    afterNextRender(() => {
      this.cargarEstados();
      this.cargar();
    });
  }
  cargarEstados() {
    if (!this.auth.tienePermiso("reconocimientos.ver"))
      return;
    this.api.listarTodos("reconocimientos").pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (filas) => this.estados.set([...new Set(filas.map((fila) => fila.estado).filter(Boolean))].sort()),
      error: (error) => this.mensaje.set("No se pudieron consultar los estados: " + error.mensaje)
    });
  }
  solicitarEliminar(registro) {
    if (this.auth.tienePermiso("reconocimientos.eliminar") && !this.eliminando())
      this.pendienteEliminar.set(registro);
  }
  eliminar() {
    const registro = this.pendienteEliminar();
    if (!registro || this.eliminando() || !this.auth.tienePermiso("reconocimientos.eliminar"))
      return;
    this.eliminando.set(true);
    this.mensaje.set(null);
    this.api.eliminar("reconocimientos", registro.id_reconocimiento).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.eliminando.set(false);
        this.pendienteEliminar.set(null);
        this.mensaje.set("Reconocimiento eliminado correctamente.");
        const pagina = this.pagina();
        this.cargar(pagina?.data.length === 1 ? Math.max(1, pagina.current_page - 1) : pagina?.current_page ?? 1);
        this.cargarEstados();
      },
      error: (error) => {
        this.eliminando.set(false);
        this.mensaje.set(error.mensaje);
      }
    });
  }
  opcionesTrabajador() {
    const texto = this.filtro.controls.buscarTrabajador.value.trim().toLocaleLowerCase();
    const seleccionado = this.filtro.controls.trabajador.value;
    return this.trabajadores().filter((fila) => String(fila.id_persona_trabajador) === seleccionado || this.trabajador(fila.id_persona_trabajador).toLocaleLowerCase().includes(texto));
  }
  trabajador(id) {
    const fila = this.trabajadoresPorId().get(id);
    if (!fila)
      return `Trabajador #${id}`;
    const persona = this.personas()[fila.id_persona];
    const area = this.areas()[fila.id_area];
    const nombre = persona?.estado === "disponible" ? [persona.datos.nombres, persona.datos.apellido_paterno, persona.datos.apellido_materno].filter(Boolean).join(" ") : "Nombre no disponible";
    return `${nombre} \u2014 ${fila.cargo || "Cargo no registrado"} \u2014 ${area?.estado === "disponible" ? area.datos.nombre : "\xC1rea no disponible"} \u2014 #${id}`;
  }
  trabajadorRelacion(registro) {
    const estado = this.estadoTrabajadores();
    if (estado.estado !== "disponible")
      return estado;
    const fila = this.trabajadoresPorId().get(registro.id_persona_trabajador);
    return fila ? { estado: "disponible", datos: fila } : { estado: "no-encontrado", mensaje: "El trabajador no figura en el cat\xE1logo autorizado." };
  }
  personaRelacion(registro) {
    const trabajador = this.trabajadorRelacion(registro);
    if (trabajador.estado !== "disponible")
      return trabajador;
    return this.personas()[trabajador.datos.id_persona] ?? { estado: "cargando" };
  }
  areaRelacion(registro) {
    const trabajador = this.trabajadorRelacion(registro);
    if (trabajador.estado !== "disponible")
      return trabajador;
    return this.areas()[trabajador.datos.id_area] ?? { estado: "cargando" };
  }
  certificacionRelacion(id) {
    return this.certificaciones()[id] ?? (this.auth.tienePermiso("emision.ver") ? { estado: "cargando" } : { estado: "sin-permiso", mensaje: "Se requiere emision.ver." });
  }
  cargar(page = 1) {
    this.carga?.unsubscribe();
    this.pagina.set(null);
    this.error.set(null);
    this.certificaciones.set({});
    this.personas.set({});
    this.areas.set({});
    this.documentosCache.clear();
    this.sinPermiso.set(!this.auth.tienePermiso("reconocimientos.ver"));
    if (this.sinPermiso()) {
      this.cargando.set(false);
      return;
    }
    this.cargando.set(true);
    this.errorDni.set(null);
    this.dni.set({});
    const filtros = this.filtro.getRawValue();
    this.carga = this.api.listar("reconocimientos", {
      page,
      per_page: 12,
      titulo: filtros.titulo.trim(),
      estado: filtros.estado.trim(),
      fecha_reconocimiento: filtros.fecha,
      id_persona_trabajador: filtros.trabajador || null
    }).pipe(tap((pagina) => this.pagina.set(pagina)), switchMap((pagina) => forkJoin({
      dni: pagina.data.length && this.auth.tienePermiso("ponentes-firmantes.ver") && this.auth.tienePermiso("personas.verpersonas") && this.auth.tienePermiso("tipos-documento.ver") ? this.api.documentosIdentidad().pipe(tap((dni) => this.dni.set(dni)), catchError((error) => {
        this.errorDni.set(error.mensaje);
        return of(null);
      })) : of(null),
      gestion: this.cargarGestion(pagina.data),
      certificados: this.auth.tienePermiso("emision.ver") ? from(pagina.data).pipe(mergeMap((registro) => this.cargarCertificacion(registro.id_reconocimiento).pipe(tap((resultado) => this.certificaciones.update((actual) => __spreadProps(__spreadValues({}, actual), { [registro.id_reconocimiento]: resultado })))), 3), toArray()) : of([])
    })), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.cargando.set(false),
      error: (error) => {
        this.sinPermiso.set(error.status === 403);
        this.error.set(error.mensaje);
        this.cargando.set(false);
      }
    });
  }
  cargarGestion(registros) {
    if (!this.trabajadoresCache) {
      this.trabajadoresCache = this.auth.tienePermiso("ponentes-firmantes.ver") ? this.resultado(this.api.trabajadores()).pipe(shareReplay({ bufferSize: 1, refCount: true })) : of({ estado: "sin-permiso", mensaje: "Se requiere el permiso ponentes-firmantes.ver para consultar trabajadores." });
    }
    return this.trabajadoresCache.pipe(tap((resultado) => {
      this.estadoTrabajadores.set(resultado);
      this.trabajadores.set(resultado.estado === "disponible" ? resultado.datos : []);
    }), switchMap((resultado) => {
      if (resultado.estado !== "disponible")
        return of(null);
      const trabajadores = resultado.datos;
      const personas = [...new Set(trabajadores.map((fila) => fila.id_persona))];
      const areas = [...new Set(trabajadores.map((fila) => fila.id_area))];
      return forkJoin({
        personas: from(personas).pipe(concatMap((id) => this.referencia(id, this.personasCache, () => this.auth.tienePermiso("personas.verpersonas") ? this.api.personaReconocimiento(id) : this.denegado("personas.verpersonas"), () => this.personaDenegada, (rechazo) => {
          this.personaDenegada = rechazo;
        }).pipe(tap((fila) => this.personas.update((actual) => __spreadProps(__spreadValues({}, actual), { [id]: fila }))))), toArray()),
        areas: from(areas).pipe(concatMap((id) => this.referencia(id, this.areasCache, () => this.auth.tienePermiso("areas.ver") ? this.api.areaReconocimiento(id) : this.denegado("areas.ver"), () => this.areaDenegada, (rechazo) => {
          this.areaDenegada = rechazo;
        }).pipe(tap((fila) => this.areas.update((actual) => __spreadProps(__spreadValues({}, actual), { [id]: fila }))))), toArray())
      });
    }));
  }
  /** Cache limitada a esta pagina. Tras un 403 no insiste con otros IDs del mismo recurso. */
  referencia(id, cache, consulta, denegado, denegar) {
    const existente = cache.get(id);
    if (existente)
      return existente;
    const peticion = defer(() => {
      if (!Number.isSafeInteger(id) || id < 1)
        return of({ estado: "no-encontrado", mensaje: "No hay una relaci\xF3n v\xE1lida disponible." });
      const rechazo = denegado();
      return rechazo ? of(rechazo) : this.resultado(consulta()).pipe(tap((resultado) => {
        if (resultado.estado === "sin-permiso")
          denegar(resultado);
      }));
    }).pipe(shareReplay({ bufferSize: 1, refCount: true }));
    cache.set(id, peticion);
    return peticion;
  }
  cargarCertificacion(id) {
    return this.resultado(this.api.listarTodos("certificados", { id_reconocimiento: id }).pipe(switchMap((certificados) => from(certificados).pipe(mergeMap((certificado) => {
      let documentos = this.documentosCache.get(certificado.id_certificado);
      if (!documentos) {
        documentos = this.resultado(this.api.listarTodos("certificados-documentos", { id_certificado: certificado.id_certificado })).pipe(shareReplay({ bufferSize: 1, refCount: true }));
        this.documentosCache.set(certificado.id_certificado, documentos);
      }
      return documentos.pipe(map((filas) => ({ certificado, documentos: filas })));
    }, 3), toArray(), map((filas) => filas.sort((a, b) => b.certificado.id_certificado - a.certificado.id_certificado))))));
  }
  denegado(permiso) {
    return throwError(() => ({ status: 403, mensaje: `Se requiere ${permiso}.`, errores: {} }));
  }
  resultado(peticion) {
    return peticion.pipe(map((datos) => ({ estado: "disponible", datos })), catchError((error) => of({
      estado: error.status === 403 || error.status === 401 ? "sin-permiso" : error.status === 404 ? "no-encontrado" : "error",
      mensaje: error.mensaje
    })));
  }
  reintentar() {
    this.carga?.unsubscribe();
    this.trabajadoresCache = void 0;
    this.personasCache.clear();
    this.areasCache.clear();
    this.personaDenegada = null;
    this.areaDenegada = null;
    this.estadoTrabajadores.set({ estado: "cargando" });
    this.trabajadores.set([]);
    this.cargarEstados();
    this.cargar(this.pagina()?.current_page ?? 1);
  }
  limpiar() {
    this.filtro.reset();
    this.cargar();
  }
  static \u0275fac = function ListarReconocimientosComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ListarReconocimientosComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ListarReconocimientosComponent, selectors: [["app-listar-reconocimientos"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 5, vars: 3, consts: [["title", "Reconocimientos institucionales"], ["role", "status", 1, "alert"], ["role", "alertdialog", "aria-modal", "false", "aria-labelledby", "confirmar-eliminar", 1, "card"], ["role", "alert", 1, "card"], ["id", "confirmar-eliminar"], [1, "acciones"], [1, "btn", 3, "click", "disabled"], [1, "encabezado"], [1, "introduccion"], ["routerLink", "/certificaciones/reconocimientos/nuevo", 1, "btn", "btn-primary"], ["aria-labelledby", "buscar-reconocimientos-titulo", 1, "card", "busqueda", 3, "ngSubmit", "formGroup"], ["id", "buscar-reconocimientos-titulo"], [1, "campos-busqueda"], [1, "form-field"], ["for", "reconocimiento-titulo"], ["id", "reconocimiento-titulo", "formControlName", "titulo", "maxlength", "150", 1, "input"], ["for", "reconocimiento-estado"], ["id", "reconocimiento-estado", "formControlName", "estado", 1, "input"], ["value", ""], [3, "value"], ["for", "reconocimiento-fecha"], ["id", "reconocimiento-fecha", "type", "date", "formControlName", "fecha", 1, "input"], ["type", "submit", 1, "btn", "btn-consulta", 3, "disabled"], ["aria-hidden", "true", 1, "material-symbols-outlined"], ["type", "button", 1, "btn", "btn-neutro", 3, "click", "disabled"], [1, "nota"], ["role", "status"], ["role", "alert", 1, "alert", "alert-advertencia"], ["aria-labelledby", "listado-reconocimientos-titulo"], ["for", "buscar-trabajador"], ["id", "buscar-trabajador", "type", "search", "formControlName", "buscarTrabajador", 1, "input"], ["for", "reconocimiento-trabajador"], ["id", "reconocimiento-trabajador", "formControlName", "trabajador", 1, "input"], ["role", "status", 1, "alert", "alert-advertencia"], ["role", "alert", 1, "alert", "alert-error"], [1, "btn", "btn-consulta", 3, "click"], ["id", "listado-reconocimientos-titulo"], ["role", "status", 1, "card", "vacio"], [1, "tarjetas"], [3, "reconocimiento", "dni", "trabajador", "persona", "area", "certificacion", "puedeEliminar", "puedeEditar", "puedeVerDetalle"], [1, "paginacion"], ["type", "button", 1, "btn", 3, "click", "disabled"], [3, "eliminar", "reconocimiento", "dni", "trabajador", "persona", "area", "certificacion", "puedeEliminar", "puedeEditar", "puedeVerDetalle"]], template: function ListarReconocimientosComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "app-page-title", 0);
      \u0275\u0275template(1, ListarReconocimientosComponent_Conditional_1_Template, 2, 1, "p", 1)(2, ListarReconocimientosComponent_Conditional_2_Template, 10, 4, "section", 2)(3, ListarReconocimientosComponent_Conditional_3_Template, 5, 1, "section", 3)(4, ListarReconocimientosComponent_Conditional_4_Template, 39, 10);
    }
    if (rf & 2) {
      let tmp_0_0;
      let tmp_1_0;
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_0_0 = ctx.mensaje()) ? 1 : -1, tmp_0_0);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_1_0 = ctx.pendienteEliminar()) ? 2 : -1, tmp_1_0);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.sinPermiso() ? 3 : 4);
    }
  }, dependencies: [RouterLink, ReactiveFormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, MaxLengthValidator, FormGroupDirective, FormControlName, PageTitleComponent, ReconocimientoCardComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.encabezado[_ngcontent-%COMP%], \n.acciones[_ngcontent-%COMP%], \n.paginacion[_ngcontent-%COMP%], \n.filtros[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: var(--espacio-3);\n}\n.encabezado[_ngcontent-%COMP%] {\n  justify-content: space-between;\n  margin-bottom: var(--espacio-4);\n}\n.acciones[_ngcontent-%COMP%], \n.filtros[_ngcontent-%COMP%], \n.paginacion[_ngcontent-%COMP%] {\n  margin-block: var(--espacio-4);\n}\n.tabla[_ngcontent-%COMP%] {\n  overflow-x: auto;\n}\n.grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));\n  gap: var(--espacio-4);\n}\n.form-field[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.detalle[_ngcontent-%COMP%] {\n  margin-block: var(--espacio-5);\n}\ndt[_ngcontent-%COMP%] {\n  color: var(--neutro-500);\n  font-size: 0.875rem;\n}\ndd[_ngcontent-%COMP%] {\n  margin: 0 0 var(--espacio-3);\n  overflow-wrap: anywhere;\n}\n.nota[_ngcontent-%COMP%] {\n  color: var(--neutro-700);\n  font-size: 0.875rem;\n}\n.table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  overflow-wrap: anywhere;\n}\n.errores[_ngcontent-%COMP%] {\n  color: var(--color-error);\n}\n.reconocimiento[_ngcontent-%COMP%] {\n  border-top: 3px solid var(--boton-dorado);\n  overflow-wrap: anywhere;\n}\n.reconocimiento[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin-top: var(--espacio-4);\n  font-size: 1.25rem;\n}\n/*# sourceMappingURL=emision.css.map */", "\n\n.introduccion[_ngcontent-%COMP%] {\n  max-width: 44rem;\n  margin: 0;\n  color: var(--neutro-700);\n}\n.busqueda[_ngcontent-%COMP%] {\n  margin-bottom: var(--espacio-5);\n}\n.busqueda[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  color: var(--boton-azul);\n}\n.campos-busqueda[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));\n  gap: var(--espacio-4);\n}\n.campos-busqueda[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%] {\n  margin-bottom: 0;\n}\n.tarjetas[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr));\n  gap: var(--espacio-5);\n  align-items: stretch;\n}\n.vacio[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: var(--espacio-6);\n}\n.vacio[_ngcontent-%COMP%]    > .material-symbols-outlined[_ngcontent-%COMP%] {\n  width: 2em;\n  height: 2em;\n  font-size: 2rem;\n  color: var(--boton-azul);\n}\n#listado-reconocimientos-titulo[_ngcontent-%COMP%] {\n  font-size: 1.125rem;\n  margin: 0;\n}\n@media (max-width: 480px) {\n  .encabezado[_ngcontent-%COMP%]    > .btn[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n  .paginacion[_ngcontent-%COMP%]   .acciones[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n  .paginacion[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n    flex: 1;\n  }\n}\n/*# sourceMappingURL=listar-reconocimientos.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ListarReconocimientosComponent, { className: "ListarReconocimientosComponent", filePath: "src\\app\\pages\\emision-certificados\\reconocimientos\\listar-reconocimientos\\listar-reconocimientos.component.ts", lineNumber: 20 });
})();
export {
  ListarReconocimientosComponent
};
//# sourceMappingURL=chunk-26DYUT6J.js.map
