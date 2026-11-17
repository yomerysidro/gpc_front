import './polyfills.server.mjs';
import {
  estadoCatalogo,
  origenCatalogo
} from "./chunk-BFRYA4IX.mjs";
import {
  CambiosCertificadosService
} from "./chunk-ZIVCKBVU.mjs";
import {
  mensajeEtapaA
} from "./chunk-R23RR7XQ.mjs";
import {
  PageTitleComponent
} from "./chunk-XGG6XIOR.mjs";
import {
  ActivatedRoute,
  RouterLink
} from "./chunk-OX7VSSQH.mjs";
import "./chunk-VNKXA6HD.mjs";
import {
  EmisionCertificadosService
} from "./chunk-UOKIJFGD.mjs";
import "./chunk-7VY3YOD2.mjs";
import "./chunk-2XE3PF63.mjs";
import "./chunk-JMI3IFFT.mjs";
import "./chunk-HFD7K63G.mjs";
import {
  takeUntilDestroyed,
  toSignal
} from "./chunk-TSKSZVR2.mjs";
import "./chunk-TNXV45E5.mjs";
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
} from "./chunk-SPQE7PSN.mjs";
import {
  DestroyRef,
  afterNextRender,
  computed,
  inject,
  signal,
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
  ɵɵpureFunction2,
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
} from "./chunk-OYAKRC2F.mjs";
import "./chunk-X7LY3JHO.mjs";

// src/app/pages/emision-certificados/documentos/listar-documentos/listar-documentos.component.ts
var _forTrack0 = ($index, $item) => $item[0];
var _forTrack1 = ($index, $item) => $item.id_certificado + ":" + $item.id_certificado_documento;
var _c0 = (a0, a1) => ["/certificaciones/certificados", a0, "documentos", a1, "visor"];
function ListarDocumentosComponent_For_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 8);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const a_r1 = ctx.$implicit;
    \u0275\u0275property("value", a_r1[0]);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(a_r1[1]);
  }
}
function ListarDocumentosComponent_For_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 8);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r2 = ctx.$implicit;
    \u0275\u0275property("value", s_r2[0]);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(s_r2[1]);
  }
}
function ListarDocumentosComponent_For_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 8);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tipo_r3 = ctx.$implicit;
    \u0275\u0275property("value", tipo_r3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(tipo_r3);
  }
}
function ListarDocumentosComponent_Conditional_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 15);
    \u0275\u0275text(1, "Consultando certificados\u2026");
    \u0275\u0275elementEnd();
  }
}
function ListarDocumentosComponent_Conditional_34_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 16);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 17);
    \u0275\u0275listener("click", function ListarDocumentosComponent_Conditional_34_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r4);
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
function ListarDocumentosComponent_Conditional_35_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 18)(1, "h2");
    \u0275\u0275text(2, "No hay certificados con estos criterios");
    \u0275\u0275elementEnd()();
  }
}
function ListarDocumentosComponent_Conditional_35_Conditional_1_For_20_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 28);
    \u0275\u0275text(1, "Ver certificado");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const fila_r7 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction2(1, _c0, fila_r7.id_certificado, fila_r7.id_certificado_documento));
  }
}
function ListarDocumentosComponent_Conditional_35_Conditional_1_For_20_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Sin PDF disponible");
    \u0275\u0275elementEnd();
  }
}
function ListarDocumentosComponent_Conditional_35_Conditional_1_For_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 25);
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
    \u0275\u0275elementStart(9, "td", 26)(10, "span", 27);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "td");
    \u0275\u0275template(13, ListarDocumentosComponent_Conditional_35_Conditional_1_For_20_Conditional_13_Template, 2, 4, "a", 28)(14, ListarDocumentosComponent_Conditional_35_Conditional_1_For_20_Conditional_14_Template, 2, 0, "span");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const fila_r7 = ctx.$implicit;
    const \u0275$index_109_r8 = ctx.$index;
    const ctx_r4 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((ctx_r4.paginaActual() - 1) * 20 + \u0275$index_109_r8 + 1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(fila_r7.nombre_completo || "Beneficiario no informado");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r4.origenTexto(fila_r7));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(fila_r7.tipo_certificado);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("listo", ctx_r4.estadoTexto(fila_r7) === "Certificado confirmado" || !fila_r7.id_practica && fila_r7.origen !== "practica" && fila_r7.pdf_confirmado === true && fila_r7.disponible_rrhh === true);
    \u0275\u0275attribute("data-estado", ctx_r4.estadoTexto(fila_r7));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r4.estadoTexto(fila_r7));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r4.tienePdf(fila_r7) ? 13 : 14);
  }
}
function ListarDocumentosComponent_Conditional_35_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 19)(1, "table", 20)(2, "caption");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "thead")(5, "tr")(6, "th", 21);
    \u0275\u0275text(7, "N.\xBA");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 22);
    \u0275\u0275text(9, "Beneficiario");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 22);
    \u0275\u0275text(11, "Origen / actividad o periodo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 22);
    \u0275\u0275text(13, "Tipo de certificado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th", 23);
    \u0275\u0275text(15, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th", 22);
    \u0275\u0275text(17, "Acci\xF3n");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "tbody");
    \u0275\u0275repeaterCreate(19, ListarDocumentosComponent_Conditional_35_Conditional_1_For_20_Template, 15, 9, "tr", null, _forTrack1);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(21, "nav", 24)(22, "button", 2);
    \u0275\u0275listener("click", function ListarDocumentosComponent_Conditional_35_Conditional_1_Template_button_click_22_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r4 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r4.pagina.set(ctx_r4.paginaActual() - 1));
    });
    \u0275\u0275text(23, "Anterior");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "span");
    \u0275\u0275text(25);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "button", 2);
    \u0275\u0275listener("click", function ListarDocumentosComponent_Conditional_35_Conditional_1_Template_button_click_26_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r4 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r4.pagina.set(ctx_r4.paginaActual() + 1));
    });
    \u0275\u0275text(27, "Siguiente");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", ctx_r4.filtrados().length, " certificados");
    \u0275\u0275advance(16);
    \u0275\u0275repeater(ctx_r4.visibles());
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r4.paginaActual() <= 1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("P\xE1gina ", ctx_r4.paginaActual(), " de ", ctx_r4.totalPaginas(), "");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r4.paginaActual() >= ctx_r4.totalPaginas());
  }
}
function ListarDocumentosComponent_Conditional_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, ListarDocumentosComponent_Conditional_35_Conditional_0_Template, 3, 0, "section", 18)(1, ListarDocumentosComponent_Conditional_35_Conditional_1_Template, 28, 5);
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275conditional(!ctx_r4.filtrados().length ? 0 : 1);
  }
}
var ListarDocumentosComponent = class _ListarDocumentosComponent {
  api = inject(EmisionCertificadosService);
  route = inject(ActivatedRoute);
  destroy = inject(DestroyRef);
  carga;
  filas = signal([]);
  cargando = signal(false);
  error = signal(null);
  pagina = signal(1);
  estadoTexto = estadoCatalogo;
  origenTexto = origenCatalogo;
  tipos = computed(() => [...new Set(this.filas().map((f) => f.tipo_certificado).filter(Boolean))].sort());
  filtros = inject(NonNullableFormBuilder).group({ actividad: [""], sesion: [""], nombre: [""], tipo: [""] });
  valores = toSignal(this.filtros.valueChanges, { initialValue: this.filtros.getRawValue() });
  actividades = computed(() => [...new Map(this.filas().filter((f) => f.id_actividad && f.actividad).map((f) => [f.id_actividad, f.actividad])).entries()].sort((a, b) => a[1].localeCompare(b[1], "es")));
  sesiones = computed(() => [...new Map(this.filas().filter((f) => String(f.id_actividad) === this.valores().actividad && f.id_sesion && f.sesion).map((f) => [f.id_sesion, f.sesion])).entries()].sort((a, b) => a[1].localeCompare(b[1], "es")));
  filtrados = computed(() => {
    const f = this.valores();
    const nombre = this.normalizar(f.nombre ?? "");
    return this.filas().filter((r) => (!f.actividad || String(r.id_actividad) === f.actividad) && (!f.sesion || String(r.id_sesion) === f.sesion) && (!f.tipo || r.tipo_certificado === f.tipo) && (!nombre || this.normalizar(r.nombre_completo ?? "").includes(nombre)));
  });
  totalPaginas = computed(() => Math.max(1, Math.ceil(this.filtrados().length / 20)));
  paginaActual = computed(() => Math.min(this.pagina(), this.totalPaginas()));
  visibles = computed(() => this.filtrados().slice((this.paginaActual() - 1) * 20, this.paginaActual() * 20));
  constructor() {
    inject(CambiosCertificadosService).cambios$.pipe(takeUntilDestroyed(this.destroy)).subscribe(() => this.cargar());
    afterNextRender(() => this.cargar());
    this.filtros.controls.actividad.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.filtros.controls.sesion.setValue(""));
    this.filtros.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.pagina.set(1));
  }
  cargar() {
    this.carga?.unsubscribe();
    this.filas.set([]);
    this.error.set(null);
    this.cargando.set(true);
    const id = this.route.snapshot.queryParamMap.get("id_certificado");
    this.carga = this.api.catalogoAutorizado(id ? { id_certificado: id } : {}).pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: (filas) => {
        this.filas.set(filas);
        this.cargando.set(false);
      },
      error: (e) => {
        this.error.set(mensajeEtapaA(e));
        this.cargando.set(false);
      }
    });
  }
  tienePdf(fila) {
    return !!fila.id_certificado_documento && !!fila.hash_pdf && !!fila.codigo_verificacion;
  }
  normalizar(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLocaleLowerCase("es");
  }
  static \u0275fac = function ListarDocumentosComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ListarDocumentosComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ListarDocumentosComponent, selectors: [["app-listar-documentos"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 36, vars: 5, consts: [[1, "encabezado"], ["title", "Certificados emitidos"], ["type", "button", 1, "btn", 3, "click", "disabled"], ["role", "search", "aria-label", "Filtrar certificados", 1, "card", "filtros-documentos", 3, "submit", "formGroup"], [1, "form-field"], ["for", "actividad"], ["id", "actividad", "formControlName", "actividad", 1, "input"], ["value", ""], [3, "value"], ["for", "sesion"], ["id", "sesion", "formControlName", "sesion", 1, "input"], ["for", "participante"], ["id", "participante", "type", "search", "formControlName", "nombre", "placeholder", "Nombre o apellidos", 1, "input"], ["for", "tipo-certificado"], ["id", "tipo-certificado", "formControlName", "tipo", 1, "input"], ["role", "status"], ["role", "alert", 1, "alert", "alert-error"], ["type", "button", 1, "btn", 3, "click"], ["role", "status", 1, "card", "vacio"], ["tabindex", "0", "role", "region", "aria-label", "Certificados emitidos", 1, "tabla-documentos"], [1, "table"], ["scope", "col", 1, "col-centro", "col-numero"], ["scope", "col"], ["scope", "col", 1, "col-centro"], ["aria-label", "Paginaci\xF3n de certificados", 1, "acciones"], ["data-label", "N.\xBA", 1, "col-centro", "col-numero"], [1, "col-centro"], [1, "estado-catalogo"], [1, "btn", 3, "routerLink"]], template: function ListarDocumentosComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275element(1, "app-page-title", 1);
      \u0275\u0275elementStart(2, "button", 2);
      \u0275\u0275listener("click", function ListarDocumentosComponent_Template_button_click_2_listener() {
        return ctx.cargar();
      });
      \u0275\u0275text(3, "Actualizar");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(4, "form", 3);
      \u0275\u0275listener("submit", function ListarDocumentosComponent_Template_form_submit_4_listener($event) {
        return $event.preventDefault();
      });
      \u0275\u0275elementStart(5, "div", 4)(6, "label", 5);
      \u0275\u0275text(7, "Actividad");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "select", 6)(9, "option", 7);
      \u0275\u0275text(10, "Todas las actividades");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(11, ListarDocumentosComponent_For_12_Template, 2, 2, "option", 8, _forTrack0);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(13, "div", 4)(14, "label", 9);
      \u0275\u0275text(15, "Sesi\xF3n");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "select", 10)(17, "option", 7);
      \u0275\u0275text(18, "Todas las sesiones");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(19, ListarDocumentosComponent_For_20_Template, 2, 2, "option", 8, _forTrack0);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(21, "div", 4)(22, "label", 11);
      \u0275\u0275text(23, "Buscar beneficiario");
      \u0275\u0275elementEnd();
      \u0275\u0275element(24, "input", 12);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "div", 4)(26, "label", 13);
      \u0275\u0275text(27, "Tipo de certificado");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "select", 14)(29, "option", 7);
      \u0275\u0275text(30, "Todos");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(31, ListarDocumentosComponent_For_32_Template, 2, 2, "option", 8, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275elementEnd()()();
      \u0275\u0275template(33, ListarDocumentosComponent_Conditional_33_Template, 2, 0, "p", 15)(34, ListarDocumentosComponent_Conditional_34_Template, 4, 1)(35, ListarDocumentosComponent_Conditional_35_Template, 2, 1);
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275property("disabled", ctx.cargando());
      \u0275\u0275advance(2);
      \u0275\u0275property("formGroup", ctx.filtros);
      \u0275\u0275advance(7);
      \u0275\u0275repeater(ctx.actividades());
      \u0275\u0275advance(8);
      \u0275\u0275repeater(ctx.sesiones());
      \u0275\u0275advance(12);
      \u0275\u0275repeater(ctx.tipos());
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.cargando() ? 33 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.error() ? 34 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.cargando() && !ctx.error() ? 35 : -1);
    }
  }, dependencies: [PageTitleComponent, ReactiveFormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, RouterLink], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.encabezado[_ngcontent-%COMP%], \n.acciones[_ngcontent-%COMP%], \n.paginacion[_ngcontent-%COMP%], \n.filtros[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: var(--espacio-3);\n}\n.encabezado[_ngcontent-%COMP%] {\n  justify-content: space-between;\n  margin-bottom: var(--espacio-4);\n}\n.acciones[_ngcontent-%COMP%], \n.filtros[_ngcontent-%COMP%], \n.paginacion[_ngcontent-%COMP%] {\n  margin-block: var(--espacio-4);\n}\n.tabla[_ngcontent-%COMP%] {\n  overflow-x: auto;\n}\n.grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));\n  gap: var(--espacio-4);\n}\n.form-field[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.detalle[_ngcontent-%COMP%] {\n  margin-block: var(--espacio-5);\n}\ndt[_ngcontent-%COMP%] {\n  color: var(--neutro-500);\n  font-size: 0.875rem;\n}\ndd[_ngcontent-%COMP%] {\n  margin: 0 0 var(--espacio-3);\n  overflow-wrap: anywhere;\n}\n.nota[_ngcontent-%COMP%] {\n  color: var(--neutro-700);\n  font-size: 0.875rem;\n}\n.table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  overflow-wrap: anywhere;\n}\n.errores[_ngcontent-%COMP%] {\n  color: var(--color-error);\n}\n.reconocimiento[_ngcontent-%COMP%] {\n  border-top: 3px solid var(--boton-dorado);\n  overflow-wrap: anywhere;\n}\n.reconocimiento[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin-top: var(--espacio-4);\n  font-size: 1.25rem;\n}\n/*# sourceMappingURL=emision.css.map */", "\n\n.filtros-documentos[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 1rem;\n  align-items: end;\n  flex-wrap: wrap;\n  margin-bottom: 1rem;\n}\n.form-field[_ngcontent-%COMP%] {\n  flex: 1 1 10rem;\n}\n.tabla-documentos[_ngcontent-%COMP%] {\n  max-width: 100%;\n  overflow-x: auto;\n}\n.table[_ngcontent-%COMP%] {\n  min-width: 50rem;\n}\n.opcion-rrhh[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  margin-block: 0.5rem;\n  text-align: left;\n}\n.disponible[_ngcontent-%COMP%] {\n  color: #075a39;\n  font-weight: 600;\n}\ncode[_ngcontent-%COMP%], \ndd[_ngcontent-%COMP%] {\n  overflow-wrap: anywhere;\n}\ndd[_ngcontent-%COMP%] {\n  margin: 0.3rem 0 0.8rem;\n}\n.vacio[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.estado-catalogo[_ngcontent-%COMP%] {\n  display: inline-block;\n  border-radius: 1rem;\n  padding: 0.2rem 0.6rem;\n  background: #eef3f8;\n  color: #234765;\n  font-size: 0.85rem;\n}\n.estado-catalogo.listo[_ngcontent-%COMP%] {\n  background: #e8f5ec;\n  color: #21643b;\n}\n/*# sourceMappingURL=listar-documentos.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ListarDocumentosComponent, { className: "ListarDocumentosComponent", filePath: "src\\app\\pages\\emision-certificados\\documentos\\listar-documentos\\listar-documentos.component.ts", lineNumber: 17 });
})();
export {
  ListarDocumentosComponent
};
//# sourceMappingURL=chunk-H6XP4RTH.mjs.map
