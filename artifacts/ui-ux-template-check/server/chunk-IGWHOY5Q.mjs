import './polyfills.server.mjs';
import {
  etiquetaEstado
} from "./chunk-UBX3EAES.mjs";
import {
  PageTitleComponent
} from "./chunk-XGG6XIOR.mjs";
import {
  ActivatedRoute,
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
import "./chunk-2XE3PF63.mjs";
import "./chunk-JMI3IFFT.mjs";
import "./chunk-HFD7K63G.mjs";
import {
  takeUntilDestroyed
} from "./chunk-TSKSZVR2.mjs";
import "./chunk-TNXV45E5.mjs";
import {
  DestroyRef,
  afterNextRender,
  catchError,
  forkJoin,
  inject,
  map,
  of,
  signal,
  switchMap,
  tap,
  throwError,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵpureFunction2,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3
} from "./chunk-OYAKRC2F.mjs";
import "./chunk-X7LY3JHO.mjs";

// src/app/pages/emision-certificados/reconocimientos/detalle-reconocimiento/detalle-reconocimiento.component.ts
var _forTrack0 = ($index, $item) => $item.id_certificado;
var _forTrack1 = ($index, $item) => $item.id_certificado_documento;
var _c0 = (a0) => ["/certificaciones/reconocimientos", a0, "editar"];
var _c1 = (a0) => ["/certificaciones/certificados", a0];
var _c2 = () => [];
var _c3 = (a0, a1) => ["/certificaciones/certificados", a0, "documentos", a1, "visor"];
function DetalleReconocimientoComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 2);
    \u0275\u0275text(1, "Cargando reconocimiento y documentos asociados\u2026");
    \u0275\u0275elementEnd();
  }
}
function DetalleReconocimientoComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 3);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function DetalleReconocimientoComponent_Conditional_5_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const fila_r1 = ctx;
    \u0275\u0275textInterpolate2(" \xB7 ", fila_r1.cargo, " \xB7 Persona #", fila_r1.id_persona, " ");
  }
}
function DetalleReconocimientoComponent_Conditional_5_Conditional_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 7);
    \u0275\u0275text(1, "Falta el permiso ponentes-firmantes.ver para consultar los datos del trabajador.");
    \u0275\u0275elementEnd();
  }
}
function DetalleReconocimientoComponent_Conditional_5_Conditional_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 3);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("No se pudo consultar el trabajador: ", ctx, "");
  }
}
function DetalleReconocimientoComponent_Conditional_5_Conditional_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 8);
    \u0275\u0275text(1, "Editar reconocimiento");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const registro_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(1, _c0, registro_r2.id_reconocimiento));
  }
}
function DetalleReconocimientoComponent_Conditional_5_Conditional_43_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "No tienes permiso para consultar los certificados asociados.");
    \u0275\u0275elementEnd();
  }
}
function DetalleReconocimientoComponent_Conditional_5_Conditional_44_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 3);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function DetalleReconocimientoComponent_Conditional_5_Conditional_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 3);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("No se pudo completar la consulta de documentos: ", ctx, "");
  }
}
function DetalleReconocimientoComponent_Conditional_5_Conditional_46_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 2);
    \u0275\u0275text(1, "Sin certificado asociado.");
    \u0275\u0275elementEnd();
  }
}
function DetalleReconocimientoComponent_Conditional_5_For_48_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "Pendiente: no hay documento generado.");
    \u0275\u0275elementEnd();
  }
}
function DetalleReconocimientoComponent_Conditional_5_For_48_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "a", 10);
    \u0275\u0275text(4, "Previsualizar documento");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const documento_r3 = ctx.$implicit;
    const certificado_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate3("", documento_r3.codigo_verificacion || "C\xF3digo pendiente", " \xB7 ", documento_r3.estado, " \xB7 ", documento_r3.fecha_generacion, "");
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction2(4, _c3, certificado_r4.id_certificado, documento_r3.id_certificado_documento));
  }
}
function DetalleReconocimientoComponent_Conditional_5_For_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "h3");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "a", 8);
    \u0275\u0275text(3, "Detalle e historial completo");
    \u0275\u0275elementEnd();
    \u0275\u0275template(4, DetalleReconocimientoComponent_Conditional_5_For_48_Conditional_4_Template, 2, 0, "p");
    \u0275\u0275repeaterCreate(5, DetalleReconocimientoComponent_Conditional_5_For_48_For_6_Template, 5, 7, "div", 9, _forTrack1);
  }
  if (rf & 2) {
    let tmp_14_0;
    let tmp_15_0;
    const certificado_r4 = ctx.$implicit;
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("Certificado #", certificado_r4.id_certificado, " \xB7 ", ctx_r4.estadoRegistro(certificado_r4.estado), "");
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(4, _c1, certificado_r4.id_certificado));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx_r4.cargando() && !ctx_r4.errorDocumentos() && !((tmp_14_0 = ctx_r4.documentos()[certificado_r4.id_certificado]) == null ? null : tmp_14_0.length) ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater((tmp_15_0 = ctx_r4.documentos()[certificado_r4.id_certificado]) !== null && tmp_15_0 !== void 0 ? tmp_15_0 : \u0275\u0275pureFunction0(6, _c2));
  }
}
function DetalleReconocimientoComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 4)(1, "span", 5);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h2");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "dl")(6, "dt");
    \u0275\u0275text(7, "Trabajador registrado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "dd");
    \u0275\u0275text(9);
    \u0275\u0275template(10, DetalleReconocimientoComponent_Conditional_5_Conditional_10_Template, 1, 2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "dt");
    \u0275\u0275text(12, "Nombre completo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "dd");
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "dt");
    \u0275\u0275text(16, "DNI");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "dd");
    \u0275\u0275text(18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "dt");
    \u0275\u0275text(20, "\xC1rea");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "dd");
    \u0275\u0275text(22);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "dt");
    \u0275\u0275text(24, "Descripci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "dd");
    \u0275\u0275text(26);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "dt");
    \u0275\u0275text(28, "Motivo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "dd");
    \u0275\u0275text(30);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "dt");
    \u0275\u0275text(32, "Fecha de reconocimiento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "dd");
    \u0275\u0275text(34);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(35, "p", 6);
    \u0275\u0275text(36, "El beneficiario se obtiene de la persona vinculada al trabajador de Gesti\xF3n.");
    \u0275\u0275elementEnd();
    \u0275\u0275template(37, DetalleReconocimientoComponent_Conditional_5_Conditional_37_Template, 2, 0, "p", 7)(38, DetalleReconocimientoComponent_Conditional_5_Conditional_38_Template, 2, 1, "p", 3)(39, DetalleReconocimientoComponent_Conditional_5_Conditional_39_Template, 2, 3, "a", 8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "section", 4)(41, "h2");
    \u0275\u0275text(42, "Certificados y documentos asociados");
    \u0275\u0275elementEnd();
    \u0275\u0275template(43, DetalleReconocimientoComponent_Conditional_5_Conditional_43_Template, 2, 0, "p")(44, DetalleReconocimientoComponent_Conditional_5_Conditional_44_Template, 2, 1, "p", 3)(45, DetalleReconocimientoComponent_Conditional_5_Conditional_45_Template, 2, 1, "p", 3)(46, DetalleReconocimientoComponent_Conditional_5_Conditional_46_Template, 2, 0, "p", 2);
    \u0275\u0275repeaterCreate(47, DetalleReconocimientoComponent_Conditional_5_For_48_Template, 7, 7, null, null, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_6_0;
    let tmp_14_0;
    let tmp_17_0;
    let tmp_18_0;
    const registro_r2 = ctx;
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275attribute("data-estado", registro_r2.estado);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(registro_r2.estado);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(registro_r2.titulo);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("#", registro_r2.id_persona_trabajador, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_6_0 = ctx_r4.trabajador()) ? 10 : -1, tmp_6_0);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r4.nombre() || "No disponible");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r4.dni() || "No disponible");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r4.area() || "No disponible");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(registro_r2.descripcion);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(registro_r2.motivo);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(registro_r2.fecha_reconocimiento);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(!ctx_r4.auth.tienePermiso("ponentes-firmantes.ver") ? 37 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_14_0 = ctx_r4.errorRelacion()) ? 38 : -1, tmp_14_0);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r4.auth.tienePermiso("reconocimientos.editar") ? 39 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(!ctx_r4.auth.tienePermiso("emision.ver") ? 43 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_17_0 = ctx_r4.errorCertificados()) ? 44 : -1, tmp_17_0);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_18_0 = ctx_r4.errorDocumentos()) ? 45 : -1, tmp_18_0);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r4.cargando() && ctx_r4.auth.tienePermiso("emision.ver") && !ctx_r4.errorCertificados() && !ctx_r4.certificados().length ? 46 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r4.certificados());
  }
}
var DetalleReconocimientoComponent = class _DetalleReconocimientoComponent {
  api = inject(EmisionCertificadosService);
  route = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef);
  auth = inject(AuthService);
  reconocimiento = signal(null);
  trabajador = signal(null);
  certificados = signal([]);
  documentos = signal({});
  error = signal(null);
  errorRelacion = signal(null);
  errorCertificados = signal(null);
  errorDocumentos = signal(null);
  cargando = signal(true);
  nombre = signal(null);
  dni = signal(null);
  area = signal(null);
  estadoRegistro = etiquetaEstado;
  constructor() {
    afterNextRender(() => this.route.paramMap.pipe(tap(() => {
      this.reconocimiento.set(null);
      this.trabajador.set(null);
      this.certificados.set([]);
      this.documentos.set({});
      this.error.set(null);
      this.errorRelacion.set(null);
      this.errorCertificados.set(null);
      this.errorDocumentos.set(null);
      this.cargando.set(true);
      this.nombre.set(null);
      this.dni.set(null);
      this.area.set(null);
    }), switchMap((params) => {
      const id = Number(params.get("id"));
      if (!Number.isSafeInteger(id) || id <= 0) {
        this.error.set("El identificador no es v\xE1lido.");
        return of(null);
      }
      if (!this.auth.tienePermiso("reconocimientos.ver")) {
        this.error.set("No tienes permiso para consultar reconocimientos.");
        return of(null);
      }
      return this.api.obtener("reconocimientos", id).pipe(catchError((error) => {
        this.error.set(error.mensaje);
        return of(null);
      }));
    }), switchMap((registro) => {
      this.reconocimiento.set(registro);
      if (!registro)
        return of(null);
      return forkJoin({
        trabajadores: this.auth.tienePermiso("ponentes-firmantes.ver") ? this.api.trabajadores().pipe(catchError((error) => {
          this.errorRelacion.set(error.mensaje);
          return of([]);
        })) : of([]),
        certificados: this.auth.tienePermiso("emision.ver") ? this.api.listarTodos("certificados", { id_reconocimiento: registro.id_reconocimiento }).pipe(catchError((error) => {
          this.errorCertificados.set(error.mensaje);
          return of([]);
        })) : of([])
      });
    }), switchMap((relaciones) => {
      if (!relaciones)
        return of({});
      this.trabajador.set(relaciones.trabajadores.find((fila) => fila.id_persona_trabajador === this.reconocimiento()?.id_persona_trabajador) ?? null);
      this.certificados.set(relaciones.certificados);
      const trabajador = this.trabajador();
      const identidad = trabajador ? forkJoin({
        persona: this.autorizada("personas.verpersonas", () => this.api.personaReconocimiento(trabajador.id_persona)).pipe(tap((persona) => this.nombre.set([persona.nombres, persona.apellido_paterno, persona.apellido_materno].filter(Boolean).join(" "))), catchError((error) => {
          this.errorRelacion.set(error.mensaje);
          return of(null);
        })),
        area: this.autorizada("areas.ver", () => this.api.areaReconocimiento(trabajador.id_area)).pipe(tap((area) => this.area.set(area.nombre)), catchError((error) => {
          this.errorRelacion.set(error.mensaje);
          return of(null);
        })),
        dni: this.autorizada("personas.verpersonas", () => this.autorizada("tipos-documento.ver", () => this.api.documentosIdentidad())).pipe(tap((dni) => this.dni.set(dni[trabajador.id_persona] ?? null)), catchError((error) => {
          this.errorRelacion.set(error.mensaje);
          return of(null);
        }))
      }) : of(null);
      const documentos = relaciones.certificados.length ? forkJoin(relaciones.certificados.map((certificado) => this.api.listarTodos("certificados-documentos", { id_certificado: certificado.id_certificado }).pipe(map((documentos2) => [certificado.id_certificado, documentos2]), catchError((error) => {
        this.errorDocumentos.set(error.mensaje);
        return of([certificado.id_certificado, []]);
      })))).pipe(map((filas) => Object.fromEntries(filas))) : of({});
      return forkJoin({ identidad, documentos }).pipe(map((resultado) => resultado.documentos));
    }), takeUntilDestroyed(this.destroyRef)).subscribe((documentos) => {
      this.documentos.set(documentos);
      this.cargando.set(false);
    }));
  }
  autorizada(permiso, consulta) {
    return this.auth.tienePermiso(permiso) ? consulta() : throwError(() => ({ status: 403, mensaje: `Falta el permiso ${permiso}.`, errores: {} }));
  }
  static \u0275fac = function DetalleReconocimientoComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DetalleReconocimientoComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DetalleReconocimientoComponent, selectors: [["app-detalle-reconocimiento"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 6, vars: 3, consts: [["title", "Detalle del reconocimiento"], ["routerLink", "/certificaciones/reconocimientos", 1, "btn"], ["role", "status"], ["role", "alert", 1, "alert", "alert-error"], [1, "card", "detalle"], [1, "badge", "badge-reconocimiento"], [1, "nota"], ["role", "status", 1, "nota"], [1, "btn", 3, "routerLink"], [1, "acciones"], [1, "btn", "btn-consulta", 3, "routerLink"]], template: function DetalleReconocimientoComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "app-page-title", 0);
      \u0275\u0275elementStart(1, "a", 1);
      \u0275\u0275text(2, "Volver a Reconocimientos");
      \u0275\u0275elementEnd();
      \u0275\u0275template(3, DetalleReconocimientoComponent_Conditional_3_Template, 2, 0, "p", 2)(4, DetalleReconocimientoComponent_Conditional_4_Template, 2, 1, "p", 3)(5, DetalleReconocimientoComponent_Conditional_5_Template, 49, 18);
    }
    if (rf & 2) {
      let tmp_1_0;
      let tmp_2_0;
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.cargando() ? 3 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_1_0 = ctx.error()) ? 4 : -1, tmp_1_0);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_2_0 = ctx.reconocimiento()) ? 5 : -1, tmp_2_0);
    }
  }, dependencies: [RouterLink, PageTitleComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.encabezado[_ngcontent-%COMP%], \n.acciones[_ngcontent-%COMP%], \n.paginacion[_ngcontent-%COMP%], \n.filtros[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: var(--espacio-3);\n}\n.encabezado[_ngcontent-%COMP%] {\n  justify-content: space-between;\n  margin-bottom: var(--espacio-4);\n}\n.acciones[_ngcontent-%COMP%], \n.filtros[_ngcontent-%COMP%], \n.paginacion[_ngcontent-%COMP%] {\n  margin-block: var(--espacio-4);\n}\n.tabla[_ngcontent-%COMP%] {\n  overflow-x: auto;\n}\n.grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));\n  gap: var(--espacio-4);\n}\n.form-field[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.detalle[_ngcontent-%COMP%] {\n  margin-block: var(--espacio-5);\n}\ndt[_ngcontent-%COMP%] {\n  color: var(--neutro-500);\n  font-size: 0.875rem;\n}\ndd[_ngcontent-%COMP%] {\n  margin: 0 0 var(--espacio-3);\n  overflow-wrap: anywhere;\n}\n.nota[_ngcontent-%COMP%] {\n  color: var(--neutro-700);\n  font-size: 0.875rem;\n}\n.table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  overflow-wrap: anywhere;\n}\n.errores[_ngcontent-%COMP%] {\n  color: var(--color-error);\n}\n.reconocimiento[_ngcontent-%COMP%] {\n  border-top: 3px solid var(--boton-dorado);\n  overflow-wrap: anywhere;\n}\n.reconocimiento[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin-top: var(--espacio-4);\n  font-size: 1.25rem;\n}\n/*# sourceMappingURL=emision.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DetalleReconocimientoComponent, { className: "DetalleReconocimientoComponent", filePath: "src\\app\\pages\\emision-certificados\\reconocimientos\\detalle-reconocimiento\\detalle-reconocimiento.component.ts", lineNumber: 16 });
})();
export {
  DetalleReconocimientoComponent
};
//# sourceMappingURL=chunk-IGWHOY5Q.mjs.map
