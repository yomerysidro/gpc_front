import {
  FirmantesMunicipalesService
} from "./chunk-EBN2CSJT.js";
import {
  AuthService
} from "./chunk-W2463ZNS.js";
import "./chunk-LSGUT5KG.js";
import "./chunk-7PBBQCKX.js";
import {
  takeUntilDestroyed
} from "./chunk-IJ23LC2U.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-YLHEVWGL.js";
import {
  DestroyRef,
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
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate3
} from "./chunk-3ZDGBTDF.js";
import "./chunk-ZX6IUAQ5.js";

// src/app/pages/emision-certificados/firmas/listar-firmas/listar-firmas.component.ts
var _forTrack0 = ($index, $item) => $item.id_persona_trabajador;
function ListarFirmasComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 5)(1, "h2", 17);
    \u0275\u0275text(2, "Deshabilitar funcionario");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 18);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 19)(6, "button", 20);
    \u0275\u0275listener("click", function ListarFirmasComponent_Conditional_8_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.deshabilitar());
    });
    \u0275\u0275text(7, "Confirmar deshabilitaci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "button", 21);
    \u0275\u0275listener("click", function ListarFirmasComponent_Conditional_8_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cancelarBaja());
    });
    \u0275\u0275text(9, "Cancelar");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const t_r3 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate3("\xBFDeshabilitar a ", t_r3.nombre, " \u2014 ", t_r3.cargo, " \u2014 ", t_r3.area || "\xC1rea no informada", " para nuevas asignaciones?");
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.ocupada());
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.ocupada());
  }
}
function ListarFirmasComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 6);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.aviso());
  }
}
function ListarFirmasComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.error());
  }
}
function ListarFirmasComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 12);
    \u0275\u0275text(1, "Consultando trabajadores...");
    \u0275\u0275elementEnd();
  }
}
function ListarFirmasComponent_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 12);
    \u0275\u0275text(1, "Guardando habilitaci\xF3n...");
    \u0275\u0275elementEnd();
  }
}
function ListarFirmasComponent_For_37_Conditional_16_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 33);
    \u0275\u0275listener("click", function ListarFirmasComponent_For_37_Conditional_16_Conditional_0_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const t_r5 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.solicitarBaja(t_r5));
    });
    \u0275\u0275elementStart(1, "span", 4);
    \u0275\u0275text(2, "toggle_on");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("disabled", ctx_r1.ocupada() || !!ctx_r1.confirmarBaja());
  }
}
function ListarFirmasComponent_For_37_Conditional_16_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 34);
    \u0275\u0275listener("click", function ListarFirmasComponent_For_37_Conditional_16_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const t_r5 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.habilitar(t_r5));
    });
    \u0275\u0275elementStart(1, "span", 4);
    \u0275\u0275text(2, "toggle_off");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const t_r5 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("disabled", ctx_r1.ocupada() || !!ctx_r1.confirmarBaja() || !ctx_r1.puedeHabilitar(t_r5));
  }
}
function ListarFirmasComponent_For_37_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, ListarFirmasComponent_For_37_Conditional_16_Conditional_0_Template, 3, 1, "button", 31)(1, ListarFirmasComponent_For_37_Conditional_16_Conditional_1_Template, 3, 1, "button", 32);
  }
  if (rf & 2) {
    const t_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275conditional(t_r5.habilitado_firma_certificados ? 0 : 1);
  }
}
function ListarFirmasComponent_For_37_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 30);
    \u0275\u0275text(1, "Solo lectura");
    \u0275\u0275elementEnd();
  }
}
function ListarFirmasComponent_For_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 22);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 23);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 24);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 25);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td", 26)(10, "span", 27);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "td", 28)(13, "span", 27);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "td", 29);
    \u0275\u0275template(16, ListarFirmasComponent_For_37_Conditional_16_Template, 2, 1)(17, ListarFirmasComponent_For_37_Conditional_17_Template, 2, 0, "span", 30);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const t_r5 = ctx.$implicit;
    const \u0275$index_85_r7 = ctx.$index;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275$index_85_r7 + 1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(t_r5.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(t_r5.cargo || "Cargo no informado");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(t_r5.area || "\xC1rea no informada");
    \u0275\u0275advance(2);
    \u0275\u0275classProp("activo", t_r5.vigente);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(t_r5.vigente ? "Activo" : "Inactivo");
    \u0275\u0275advance(2);
    \u0275\u0275classProp("habilitado", t_r5.habilitado_firma_certificados);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(t_r5.habilitado_firma_certificados ? "Habilitado" : "No habilitado");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.puedeAdministrar() ? 16 : 17);
  }
}
function ListarFirmasComponent_ForEmpty_38_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 35);
    \u0275\u0275text(2, "No hay trabajadores con estos criterios.");
    \u0275\u0275elementEnd()();
  }
}
function ListarFirmasComponent_ForEmpty_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, ListarFirmasComponent_ForEmpty_38_Conditional_0_Template, 3, 0, "tr");
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(!ctx_r1.cargando() && !ctx_r1.error() ? 0 : -1);
  }
}
var ListarFirmasComponent = class _ListarFirmasComponent {
  api = inject(FirmantesMunicipalesService);
  auth = inject(AuthService);
  destroy = inject(DestroyRef);
  trabajadores = signal([]);
  cargando = signal(false);
  guardando = signal(null);
  confirmarBaja = signal(null);
  error = signal("");
  aviso = signal("");
  busqueda = signal("");
  filtrados = computed(() => {
    const normalizar = (texto) => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
    const consulta = normalizar(this.busqueda().trim());
    return this.trabajadores().filter((t) => normalizar(`${t.nombre} ${t.cargo ?? ""} ${t.area ?? ""}`).includes(consulta));
  });
  ngOnInit() {
    this.cargar();
  }
  puedeAdministrar() {
    return this.auth.tienePermiso("ponentes-firmantes.editar");
  }
  ocupada() {
    return this.cargando() || this.guardando() !== null;
  }
  puedeHabilitar(t) {
    return t.vigente && t.elegible_laboralmente;
  }
  habilitar(t) {
    if (!this.puedeAdministrar() || this.ocupada() || this.confirmarBaja())
      return;
    const actual = this.trabajadores().find((f) => f.id_persona_trabajador === t.id_persona_trabajador);
    if (!actual || actual.habilitado_firma_certificados || !this.puedeHabilitar(actual))
      return;
    this.persistir(actual, true);
  }
  solicitarBaja(t) {
    if (!this.puedeAdministrar() || this.ocupada())
      return;
    const actual = this.trabajadores().find((f) => f.id_persona_trabajador === t.id_persona_trabajador);
    if (!actual?.habilitado_firma_certificados)
      return;
    this.aviso.set("");
    this.error.set("");
    this.confirmarBaja.set(actual);
  }
  cancelarBaja() {
    if (!this.ocupada())
      this.confirmarBaja.set(null);
  }
  deshabilitar() {
    const t = this.confirmarBaja();
    if (!t || !this.puedeAdministrar() || this.ocupada())
      return;
    this.persistir(t, false);
  }
  persistir(t, habilitado) {
    this.guardando.set(t.id_persona_trabajador);
    this.error.set("");
    this.aviso.set("");
    const operacion = habilitado ? this.api.habilitar(t.id_persona_trabajador) : this.api.deshabilitar(t.id_persona_trabajador);
    operacion.pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: (actualizado) => {
        this.trabajadores.update((filas) => filas.map((f) => f.id_persona_trabajador === actualizado.id_persona_trabajador ? actualizado : f));
        this.guardando.set(null);
        this.confirmarBaja.set(null);
        this.aviso.set(habilitado ? "Funcionario habilitado." : "Funcionario deshabilitado.");
        this.cargar();
      },
      error: (e) => {
        this.guardando.set(null);
        this.error.set(this.mensaje(e));
      }
    });
  }
  cargar() {
    if (this.ocupada())
      return;
    this.cargando.set(true);
    this.error.set("");
    this.api.cargar().pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: (trabajadores) => {
        this.trabajadores.set(trabajadores);
        this.cargando.set(false);
        this.confirmarBaja.set(null);
      },
      error: (e) => {
        this.cargando.set(false);
        this.error.set(this.mensaje(e));
      }
    });
  }
  mensaje(e) {
    switch (e.status) {
      case 401:
        return "Su sesi\xF3n ha vencido. Inicie sesi\xF3n nuevamente.";
      case 403:
        return "No tiene permiso para administrar firmantes municipales.";
      case 404:
        return "El trabajador no est\xE1 disponible o est\xE1 fuera de su \xE1mbito.";
      case 409:
        return "No se pudo completar el cambio. Actualice el listado y revise el estado laboral.";
      case 422:
        return "No se pudo procesar el trabajador seleccionado. Actualice el listado.";
      default:
        return "No se pudo confirmar la operaci\xF3n. Actualice el listado antes de reintentar.";
    }
  }
  static \u0275fac = function ListarFirmasComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ListarFirmasComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ListarFirmasComponent, selectors: [["app-listar-firmas"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 39, vars: 9, consts: [["aria-labelledby", "titulo-firmantes"], [1, "encabezado"], ["id", "titulo-firmantes"], ["type", "button", 1, "btn", "actualizar", 3, "click", "disabled"], ["aria-hidden", "true", 1, "material-symbols-outlined"], ["role", "alertdialog", "aria-labelledby", "titulo-baja", "aria-describedby", "descripcion-baja", 1, "confirmacion", "card"], ["role", "status", 1, "aviso"], ["role", "alert"], ["aria-label", "Trabajadores municipales", 1, "card"], [1, "busqueda-firmantes"], ["for", "buscar-funcionario"], ["id", "buscar-funcionario", "type", "search", "placeholder", "Nombre, cargo o \xE1rea", 1, "input", 3, "ngModelChange", "ngModel"], ["role", "status"], [1, "table", "tabla-firmantes"], ["scope", "col", 1, "col-centro", "col-numero"], ["scope", "col"], ["scope", "col", 1, "col-centro"], ["id", "titulo-baja"], ["id", "descripcion-baja"], [1, "acciones"], ["type", "button", 1, "btn", "confirmar", 3, "click", "disabled"], ["type", "button", 1, "btn", 3, "click", "disabled"], ["data-label", "N.\xBA", 1, "col-centro", "col-numero"], ["data-label", "Nombre completo"], ["data-label", "Cargo"], ["data-label", "\xC1rea municipal"], ["data-label", "Estado laboral", 1, "col-centro"], [1, "estado"], ["data-label", "Habilitaci\xF3n de firma"], ["data-label", "Acciones", 1, "col-centro"], [1, "solo-lectura"], ["type", "button", "aria-label", "Deshabilitar firmante", "title", "Deshabilitar firmante", 1, "btn", "interruptor", "apagar", 3, "disabled"], ["type", "button", "aria-label", "Habilitar firmante", "title", "Habilitar firmante", 1, "btn", "interruptor", "encender", 3, "disabled"], ["type", "button", "aria-label", "Deshabilitar firmante", "title", "Deshabilitar firmante", 1, "btn", "interruptor", "apagar", 3, "click", "disabled"], ["type", "button", "aria-label", "Habilitar firmante", "title", "Habilitar firmante", 1, "btn", "interruptor", "encender", 3, "click", "disabled"], ["colspan", "7"]], template: function ListarFirmasComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section", 0)(1, "header", 1)(2, "h1", 2);
      \u0275\u0275text(3, "Gesti\xF3n de firmantes municipales");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "button", 3);
      \u0275\u0275listener("click", function ListarFirmasComponent_Template_button_click_4_listener() {
        return ctx.cargar();
      });
      \u0275\u0275elementStart(5, "span", 4);
      \u0275\u0275text(6, "refresh");
      \u0275\u0275elementEnd();
      \u0275\u0275text(7, "Actualizar");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(8, ListarFirmasComponent_Conditional_8_Template, 10, 5, "section", 5)(9, ListarFirmasComponent_Conditional_9_Template, 2, 1, "p", 6)(10, ListarFirmasComponent_Conditional_10_Template, 2, 1, "p", 7);
      \u0275\u0275elementStart(11, "section", 8)(12, "div", 9)(13, "label", 10);
      \u0275\u0275text(14, "Buscar por nombre, cargo o \xE1rea");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "input", 11);
      \u0275\u0275listener("ngModelChange", function ListarFirmasComponent_Template_input_ngModelChange_15_listener($event) {
        return ctx.busqueda.set($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275template(16, ListarFirmasComponent_Conditional_16_Template, 2, 0, "p", 12)(17, ListarFirmasComponent_Conditional_17_Template, 2, 0, "p", 12);
      \u0275\u0275elementStart(18, "table", 13)(19, "thead")(20, "tr")(21, "th", 14);
      \u0275\u0275text(22, "N.\xBA");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "th", 15);
      \u0275\u0275text(24, "Nombre completo");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "th", 15);
      \u0275\u0275text(26, "Cargo");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(27, "th", 15);
      \u0275\u0275text(28, "\xC1rea municipal");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(29, "th", 16);
      \u0275\u0275text(30, "Estado laboral");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(31, "th", 15);
      \u0275\u0275text(32, "Habilitaci\xF3n de firma");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(33, "th", 16);
      \u0275\u0275text(34, "Acciones");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(35, "tbody");
      \u0275\u0275repeaterCreate(36, ListarFirmasComponent_For_37_Template, 18, 11, "tr", null, _forTrack0, false, ListarFirmasComponent_ForEmpty_38_Template, 1, 1);
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      let tmp_1_0;
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.ocupada());
      \u0275\u0275advance(4);
      \u0275\u0275conditional((tmp_1_0 = ctx.confirmarBaja()) ? 8 : -1, tmp_1_0);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.aviso() ? 9 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.error() ? 10 : -1);
      \u0275\u0275advance();
      \u0275\u0275attribute("aria-busy", ctx.ocupada());
      \u0275\u0275advance(4);
      \u0275\u0275property("ngModel", ctx.busqueda());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.cargando() ? 16 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.guardando() !== null ? 17 : -1);
      \u0275\u0275advance(19);
      \u0275\u0275repeater(ctx.filtrados());
    }
  }, dependencies: [FormsModule, DefaultValueAccessor, NgControlStatus, NgModel], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.encabezado[_ngcontent-%COMP%], \n.acciones[_ngcontent-%COMP%], \n.paginacion[_ngcontent-%COMP%], \n.filtros[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: var(--espacio-3);\n}\n.encabezado[_ngcontent-%COMP%] {\n  justify-content: space-between;\n  margin-bottom: var(--espacio-4);\n}\n.acciones[_ngcontent-%COMP%], \n.filtros[_ngcontent-%COMP%], \n.paginacion[_ngcontent-%COMP%] {\n  margin-block: var(--espacio-4);\n}\n.tabla[_ngcontent-%COMP%] {\n  overflow-x: auto;\n}\n.grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));\n  gap: var(--espacio-4);\n}\n.form-field[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.detalle[_ngcontent-%COMP%] {\n  margin-block: var(--espacio-5);\n}\ndt[_ngcontent-%COMP%] {\n  color: var(--neutro-500);\n  font-size: 0.875rem;\n}\ndd[_ngcontent-%COMP%] {\n  margin: 0 0 var(--espacio-3);\n  overflow-wrap: anywhere;\n}\n.nota[_ngcontent-%COMP%] {\n  color: var(--neutro-700);\n  font-size: 0.875rem;\n}\n.table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  overflow-wrap: anywhere;\n}\n.errores[_ngcontent-%COMP%] {\n  color: var(--color-error);\n}\n.reconocimiento[_ngcontent-%COMP%] {\n  border-top: 3px solid var(--boton-dorado);\n  overflow-wrap: anywhere;\n}\n.reconocimiento[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin-top: var(--espacio-4);\n  font-size: 1.25rem;\n}\n/*# sourceMappingURL=emision.css.map */", "\n\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\nh1[_ngcontent-%COMP%] {\n  color: #075a9b;\n  margin: 0;\n  font-size: 1.5rem;\n}\nh2[_ngcontent-%COMP%] {\n  color: #075a9b;\n  margin: 0;\n  font-size: 1.05rem;\n}\n.encabezado[_ngcontent-%COMP%] {\n  justify-content: space-between;\n  gap: 1rem;\n}\n.card[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n  padding: 1.25rem;\n  border: 1px solid #e1e8ef;\n  border-top: 2px solid var(--dorado-500, #c5a04a);\n  border-radius: 0.65rem;\n  background: white;\n  min-width: 0;\n}\n.busqueda-firmantes[_ngcontent-%COMP%] {\n  max-width: 36rem;\n  margin-bottom: 1rem;\n}\nlabel[_ngcontent-%COMP%] {\n  display: block;\n  margin-bottom: 0.4rem;\n  color: #33475b;\n}\n.input[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n  box-sizing: border-box;\n}\n.actualizar[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.4rem;\n  color: #075a9b;\n}\n.tabla-firmantes[_ngcontent-%COMP%] {\n  width: 100%;\n  table-layout: fixed;\n  border-collapse: collapse;\n}\nth[_ngcontent-%COMP%] {\n  text-align: left;\n  color: #075a9b;\n  background: #f0f6fb;\n}\nth[_ngcontent-%COMP%], \ntd[_ngcontent-%COMP%] {\n  padding: 0.8rem 0.6rem;\n  border-bottom: 1px solid #e1e8ef;\n}\ntd[_ngcontent-%COMP%], \nth[_ngcontent-%COMP%], \np[_ngcontent-%COMP%] {\n  overflow-wrap: anywhere;\n}\n.estado[_ngcontent-%COMP%] {\n  display: inline-flex;\n  padding: 0.3rem 0.5rem;\n  border-radius: 1rem;\n  color: #526171;\n  background: #edf0f3;\n  font-size: 0.8rem;\n}\n.activo[_ngcontent-%COMP%], \n.habilitado[_ngcontent-%COMP%] {\n  color: #21643b;\n  background: #e8f5ec;\n}\n.tabla-firmantes[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]:last-child, \ntd[data-label=Acciones][_ngcontent-%COMP%] {\n  text-align: center;\n}\n.interruptor[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: var(--alto-control, 2.75rem);\n  height: var(--alto-control, 2.75rem);\n  box-sizing: border-box;\n  padding: 0;\n  border-radius: 0.5rem;\n}\n.interruptor[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%] {\n  font-size: 1.8rem;\n}\n.confirmar[_ngcontent-%COMP%] {\n  background: var(--boton-dorado, #e8ad24);\n  color: #253447;\n  border-color: var(--boton-dorado, #e8ad24);\n}\n.encender[_ngcontent-%COMP%] {\n  color: #b42318;\n  background: #fff1f0;\n  border: 1px solid #f0bbb5;\n}\n.apagar[_ngcontent-%COMP%] {\n  color: #21643b;\n  background: #f0f8f2;\n  border: 1px solid #bdddc5;\n}\n.encender[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%] {\n  color: #b42318;\n}\n.apagar[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%] {\n  color: #21643b;\n}\n.solo-lectura[_ngcontent-%COMP%] {\n  color: #657587;\n  font-size: 0.8rem;\n}\n.aviso[_ngcontent-%COMP%] {\n  color: #21643b;\n}\nbutton[_ngcontent-%COMP%]:disabled {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\nbutton[_ngcontent-%COMP%]:focus-visible, \ninput[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid #075a9b;\n  outline-offset: 2px;\n}\n[role=alert][_ngcontent-%COMP%] {\n  color: var(--color-error, #a52525);\n}\n@media (max-width: 1000px) {\n  .tabla-firmantes[_ngcontent-%COMP%], \n   tbody[_ngcontent-%COMP%], \n   tr[_ngcontent-%COMP%], \n   td[_ngcontent-%COMP%] {\n    display: block;\n    width: auto;\n  }\n  thead[_ngcontent-%COMP%] {\n    position: absolute;\n    width: 1px;\n    height: 1px;\n    overflow: hidden;\n    clip-path: inset(50%);\n  }\n  tr[_ngcontent-%COMP%] {\n    margin-top: 0.8rem;\n    border: 1px solid #e1e8ef;\n    border-radius: 0.5rem;\n  }\n  td[_ngcontent-%COMP%]::before {\n    content: attr(data-label);\n    display: block;\n    font-size: 0.8rem;\n    color: #526171;\n    margin-bottom: 0.3rem;\n  }\n  td[colspan][_ngcontent-%COMP%]::before {\n    content: none;\n  }\n}\n/*# sourceMappingURL=listar-firmas.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ListarFirmasComponent, { className: "ListarFirmasComponent", filePath: "src\\app\\pages\\emision-certificados\\firmas\\listar-firmas\\listar-firmas.component.ts", lineNumber: 10 });
})();
export {
  ListarFirmasComponent
};
//# sourceMappingURL=chunk-MEGNICNC.js.map
