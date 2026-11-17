import './polyfills.server.mjs';
import {
  CATALOGOS_CLASIFICACIONES,
  CATALOGOS_INSTITUCIONALES
} from "./chunk-QG4BEULN.mjs";
import {
  NavigationEnd,
  PRIMARY_OUTLET,
  Router,
  RouterLink,
  RouterOutlet
} from "./chunk-OX7VSSQH.mjs";
import {
  AuthService
} from "./chunk-NP7M7R34.mjs";
import {
  toSignal
} from "./chunk-TSKSZVR2.mjs";
import {
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  filter,
  finalize,
  inject,
  input,
  map,
  model,
  signal,
  startWith,
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
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵqueryAdvance,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵresolveDocument,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty,
  ɵɵviewQuerySignal
} from "./chunk-OYAKRC2F.mjs";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-X7LY3JHO.mjs";

// src/app/components/header/header.component.ts
var _c0 = ["*"];
var HeaderComponent = class _HeaderComponent {
  static \u0275fac = function HeaderComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HeaderComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _HeaderComponent, selectors: [["app-header"]], standalone: true, features: [\u0275\u0275StandaloneFeature], ngContentSelectors: _c0, decls: 2, vars: 0, template: function HeaderComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275projectionDef();
      \u0275\u0275elementStart(0, "header");
      \u0275\u0275projection(1);
      \u0275\u0275elementEnd();
    }
  }, styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  border-bottom: 3px solid var(--dorado-accion);\n  background: var(--azul-institucional);\n  color: #fff;\n}\nheader[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: var(--espacio-3);\n  min-height: var(--alto-header);\n  padding: var(--espacio-2) var(--espacio-5);\n}\n@media (max-width: 768px) {\n  header[_ngcontent-%COMP%] {\n    gap: var(--espacio-2);\n    padding: var(--espacio-2) var(--espacio-3);\n  }\n}\n/*# sourceMappingURL=header.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(HeaderComponent, { className: "HeaderComponent", filePath: "src\\app\\components\\header\\header.component.ts", lineNumber: 11 });
})();

// src/app/components/sidebar/modulos-navegacion.ts
var DASHBOARD_SIDEBAR = {
  id: "dashboard",
  label: "DASHBOARD",
  icon: "dashboard",
  habilitado: true,
  path: "/inicio",
  permiso: "dashboard.ver",
  aliases: ["/dashboard"]
};
var SIDEBAR_CONFIG = [
  { id: "seguridad", label: "SEGURIDAD Y ACCESO", icon: "admin_panel_settings", hijos: [
    { id: "usuarios", label: "Gesti\xF3n de usuarios", icon: "group", path: "/usuarios", permiso: "usuarios.ver", habilitado: true },
    { id: "roles", label: "Roles y permisos", icon: "admin_panel_settings", path: "/roles", permiso: "roles.ver", aliases: ["/permisos", "/modulos"], habilitado: true }
  ] },
  { id: "recursos-humanos", label: "RECURSOS HUMANOS", icon: "groups", hijos: [
    { id: "personas", label: "Personas y documentos", icon: "badge", path: "/gestion/personas", permiso: "personas.verpersonas", aliases: ["/personas"], habilitado: true },
    { id: "trabajadores", label: "Trabajadores", icon: "group", path: "/gestion/trabajadores", permiso: "trabajadores.ver", aliases: ["/trabajadores"], habilitado: true },
    { id: "practicas", label: "Practicantes y pr\xE1cticas", icon: "school", path: "/gestion/practicas", permiso: "practicantes.ver", aliases: ["/practicantes", "/gestion/practicantes"], habilitado: true },
    { id: "ponentes", label: "Ponentes", icon: "co_present", path: "/gestion/ponentes", permiso: "ponentes-firmantes.ver", aliases: ["/ponentes-firmantes"], habilitado: true },
    { id: "reconocimientos", label: "Reconocimientos", icon: "military_tech", path: "/certificaciones/reconocimientos", permiso: "reconocimientos.ver", aliases: ["/reconocimientos"], habilitado: true },
    { id: "revisar-solicitudes", label: "Revisi\xF3n de solicitudes", icon: "fact_check", habilitado: true, path: "/solicitudes/revision", permiso: "solicitudes.consultar", capacidadSolicitud: "consultar_revision" }
  ] },
  { id: "solicitudes", label: "SOLICITUDES", icon: "inbox", hijos: [
    { id: "mis-solicitudes", label: "Mis solicitudes", icon: "description", habilitado: true, path: "/solicitudes/mis-solicitudes", permiso: "solicitudes.propias", aliases: ["/solicitudes"], rutasActivas: ["/solicitudes/nueva"] }
  ] },
  { id: "actividades", label: "GESTI\xD3N DE ACTIVIDADES", icon: "calendar_month", hijos: [
    { id: "actividades", label: "Actividades", icon: "calendar_month", path: "/certificaciones/actividades", permiso: "actividades.ver", aliases: ["/actividades"], rutasActivas: ["/certificaciones/participantes", "/certificaciones/sesiones-asistencia"], habilitado: true }
  ] },
  { id: "emision", label: "EMISI\xD3N DE CERTIFICADOS", icon: "workspace_premium", hijos: [
    { id: "generar-emitir", label: "Generar y emitir", icon: "post_add", path: "/certificaciones/generar-emitir", permiso: "emision.ver", aliases: ["/emision", "/certificados", "/certificaciones/certificados"], habilitado: true },
    { id: "emitidos", label: "Certificados emitidos", icon: "verified", path: "/certificaciones/certificados/documentos", rutasActivas: ["/certificaciones/certificados/:id", "/certificaciones/certificados/:id/documentos"], permiso: "emision.ver", habilitado: true }
  ] },
  { id: "gerencia", label: "GERENCIA", icon: "account_balance", hijos: [
    { id: "pendientes-aprobacion", label: "Actividades por Aprobar", icon: "pending_actions", habilitado: true, path: "/pendientes/pendientes-aprobacion", permiso: "solicitudes.consultar", capacidadSolicitud: "consultar_gerencia" },
    { id: "documentos-firmar", label: "Certificados por firmar", icon: "draw", habilitado: true, path: "/pendientes/documentos-firmar", permiso: "emision.ver" }
  ] },
  { id: "reportes", label: "REPORTES", icon: "bar_chart", hijos: [
    { id: "indicadores", label: "Indicadores generales", icon: "monitoring", habilitado: true, path: "/reportes/indicadores", permiso: "reportes.ver", pendiente: "Agregados generales y series mensuales pendientes del backend." },
    { id: "reportes-actividades", label: "Reportes de actividades", icon: "event_note", habilitado: true, path: "/reportes/actividades", permiso: "reportes.ver" },
    { id: "reportes-certificados", label: "Reportes de certificados", icon: "analytics", habilitado: true, path: "/reportes/certificados", permiso: "reportes.ver", pendiente: "Consulta paginada disponible; relaciones y filtros globales pendientes del backend." },
    { id: "reportes-asistencia", label: "Reportes de asistencia", icon: "fact_check", habilitado: true, path: "/reportes/asistencia", permiso: "reportes.ver", pendiente: "Consulta por actividad y sesi\xF3n pendiente del backend." }
  ] },
  { id: "configuracion", label: "CONFIGURACI\xD3N GENERAL", icon: "settings", hijos: [
    { id: "firmantes-municipales", label: "Firmantes municipales", icon: "draw", path: "/gestion/firmantes-municipales", permiso: "emision.ver", permisos: ["ponentes-firmantes.editar"], aliases: ["/certificaciones/firmas", "/firmas"], rutasActivas: ["/certificaciones/firmas/aplicadas"], habilitado: true },
    { id: "gestion-institucional", label: "Gesti\xF3n institucional", icon: "account_balance", path: "/gestion/configuracion", permiso: "areas.ver", catalogos: CATALOGOS_INSTITUCIONALES, aliases: ["/areas", "/instituciones", "/documentos", "/tipos-documento"], habilitado: true },
    { id: "tipos-clasificaciones", label: "Tipos y clasificaciones", icon: "category", path: "/gestion/tipos-clasificaciones", permiso: "actividades.ver", catalogos: CATALOGOS_CLASIFICACIONES, aliases: ["/certificaciones/configuracion"], habilitado: true }
  ] }
];
function resolverEntradaSidebar(entrada, tienePermiso, items, consultarPendientes = false, capacidades = null) {
  if (!entrada.habilitado && entrada.pendiente && consultarPendientes) {
    return __spreadProps(__spreadValues({}, entrada), { path: rutaPantallaPendiente(entrada), preliminar: true });
  }
  const path = entrada.path;
  const catalogo = entrada.catalogos?.find((opcion) => tienePermiso(opcion.permiso));
  const autorizado = entrada.capacidadSolicitud ? capacidades?.[entrada.capacidadSolicitud] === true : entrada.catalogos ? !!catalogo : !!entrada.permiso && tienePermiso(entrada.permiso) || !!entrada.permisos?.some((clave) => tienePermiso(clave));
  if (!entrada.habilitado || !path || !autorizado || entrada.requiere?.some((permiso) => !tienePermiso(permiso)))
    return null;
  const rutas = [path, ...entrada.aliases ?? []];
  const backend = items.find((item) => rutas.includes(item.path.split("?")[0].replace(/\/$/, "") || "/"));
  return __spreadValues(__spreadProps(__spreadValues({}, entrada), {
    path,
    backend
  }), catalogo && entrada.catalogos?.[0].id !== catalogo.id ? { queryParams: { pestana: catalogo.id } } : {});
}
function rutaPantallaPendiente(entrada) {
  return entrada.rutaPreliminar ?? `/pendientes/${entrada.id}`;
}
function resolverGruposSidebar(tienePermiso, items, consultarPendientes = false, capacidades = null) {
  return SIDEBAR_CONFIG.map((grupo) => __spreadProps(__spreadValues({}, grupo), {
    hijos: grupo.hijos.flatMap((entrada) => {
      const resuelta = resolverEntradaSidebar(entrada, tienePermiso, items, consultarPendientes, capacidades);
      return resuelta ? [resuelta] : [];
    })
  })).filter((grupo) => grupo.hijos.length > 0);
}

// src/app/components/sidebar/pantallas-pendientes.guard.ts
function puedeConsultarPantallasPendientes(usuario, tienePermiso) {
  return usuario?.rol === "Administrador" && tienePermiso("roles.ver") && tienePermiso("roles.editar");
}
var pantallasPendientesGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.cargarSesion().pipe(map((autenticado) => autenticado && puedeConsultarPantallasPendientes(auth.usuario(), (clave) => auth.tienePermiso(clave)) || router.createUrlTree(["/acceso-denegado"])));
};

// src/app/components/sidebar/sidebar.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function SidebarComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 7)(1, "span", 1);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 5);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const entrada_r1 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("active", ctx_r1.entradaActiva() === entrada_r1.id);
    \u0275\u0275property("routerLink", entrada_r1.path);
    \u0275\u0275attribute("aria-current", ctx_r1.entradaActiva() === entrada_r1.id ? "page" : null)("aria-label", entrada_r1.label)("title", ctx_r1.contraido() ? entrada_r1.label : null);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(entrada_r1.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(entrada_r1.label);
  }
}
function SidebarComponent_For_7_For_9_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 14);
    \u0275\u0275text(1, "En desarrollo");
    \u0275\u0275elementEnd();
  }
}
function SidebarComponent_For_7_For_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 13)(1, "span", 1);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 5);
    \u0275\u0275text(4);
    \u0275\u0275template(5, SidebarComponent_For_7_For_9_Conditional_5_Template, 2, 0, "small", 14);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_22_0;
    const entrada_r5 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("active", ctx_r1.entradaActiva() === entrada_r5.id);
    \u0275\u0275property("routerLink", entrada_r5.path)("queryParams", (tmp_22_0 = entrada_r5.queryParams) !== null && tmp_22_0 !== void 0 ? tmp_22_0 : null);
    \u0275\u0275attribute("aria-current", ctx_r1.entradaActiva() === entrada_r5.id ? "page" : null);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(entrada_r5.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(entrada_r5.label);
    \u0275\u0275advance();
    \u0275\u0275conditional(entrada_r5.pendiente && !entrada_r5.interfazDisponible ? 5 : -1);
  }
}
function SidebarComponent_For_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 8);
    \u0275\u0275listener("click", function SidebarComponent_For_7_Template_button_click_0_listener($event) {
      const grupo_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.alternarGrupo($event, grupo_r4.id));
    });
    \u0275\u0275elementStart(1, "span", 1);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 9);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 10);
    \u0275\u0275text(6, "expand_more");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 11);
    \u0275\u0275repeaterCreate(8, SidebarComponent_For_7_For_9_Template, 6, 8, "a", 12, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const grupo_r4 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("active", ctx_r1.grupoActivo() === grupo_r4.id);
    \u0275\u0275attribute("aria-label", grupo_r4.label)("title", ctx_r1.contraido() ? grupo_r4.label : null)("aria-expanded", !ctx_r1.contraido() && ctx_r1.expandidos().has(grupo_r4.id))("aria-controls", "submenu-" + grupo_r4.id);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(grupo_r4.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(grupo_r4.label);
    \u0275\u0275advance();
    \u0275\u0275classProp("expandida", ctx_r1.expandidos().has(grupo_r4.id));
    \u0275\u0275advance(2);
    \u0275\u0275property("id", "submenu-" + grupo_r4.id)("hidden", ctx_r1.contraido() || !ctx_r1.expandidos().has(grupo_r4.id));
    \u0275\u0275advance();
    \u0275\u0275repeater(grupo_r4.hijos);
  }
}
function SidebarComponent_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 6);
    \u0275\u0275text(1, "No hay opciones habilitadas para tus permisos actuales.");
    \u0275\u0275elementEnd();
  }
}
var SidebarComponent = class _SidebarComponent {
  items = input([]);
  contraido = model(false);
  auth = inject(AuthService);
  router = inject(Router);
  url = toSignal(this.router.events.pipe(filter((event) => event instanceof NavigationEnd), map((event) => event.urlAfterRedirects), startWith(this.router.url)), { requireSync: true });
  expandidos = signal(/* @__PURE__ */ new Set());
  consultarPendientes = computed(() => puedeConsultarPantallasPendientes(this.auth.usuario(), (clave) => this.auth.tienePermiso(clave)));
  grupos = computed(() => resolverGruposSidebar((clave) => this.auth.tienePermiso(clave), this.items(), this.consultarPendientes(), this.auth.capacidadesSolicitudes?.()));
  dashboard = computed(() => resolverEntradaSidebar(DASHBOARD_SIDEBAR, (clave) => this.auth.tienePermiso(clave), this.items()));
  entradaActiva = computed(() => {
    const arbol = this.router.parseUrl(this.url());
    const dashboard = this.dashboard();
    const entradas = [...dashboard ? [dashboard] : [], ...this.grupos().flatMap((grupo) => grupo.hijos)];
    const coincidencias = entradas.map((entrada) => ({ entrada, puntuacion: this.puntuacion(entrada, arbol) })).filter((fila) => fila.puntuacion >= 0).sort((a, b) => b.puntuacion - a.puntuacion);
    return coincidencias[0]?.entrada.id ?? null;
  });
  grupoActivo = computed(() => this.grupos().find((grupo) => grupo.hijos.some((entrada) => entrada.id === this.entradaActiva()))?.id ?? null);
  constructor() {
    effect(() => {
      const grupo = this.grupoActivo();
      if (grupo)
        this.expandidos.update((actual) => /* @__PURE__ */ new Set([...actual, grupo]));
    }, { allowSignalWrites: true });
  }
  alternarGrupo(evento, id) {
    evento.stopPropagation();
    const estabaContraido = this.contraido();
    this.contraido.set(false);
    this.expandidos.update((actual) => {
      const siguientes = new Set(actual);
      if (estabaContraido || !siguientes.delete(id))
        siguientes.add(id);
      return siguientes;
    });
  }
  alTeclear(evento) {
    if (!(evento.currentTarget instanceof HTMLElement))
      return;
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(evento.key))
      return;
    const controles = Array.from(evento.currentTarget.querySelectorAll("a, button.modulo")).filter((elemento) => elemento.getClientRects().length > 0);
    const indice = controles.findIndex((elemento) => elemento === document.activeElement);
    if (indice < 0 || !controles.length)
      return;
    evento.preventDefault();
    const siguiente = evento.key === "Home" ? 0 : evento.key === "End" ? controles.length - 1 : (indice + (evento.key === "ArrowDown" ? 1 : -1) + controles.length) % controles.length;
    controles[siguiente]?.focus();
  }
  puntuacion(entrada, actual) {
    const segmentos = (arbol) => arbol.root.children[PRIMARY_OUTLET]?.segments.map((segmento) => segmento.path) ?? [];
    const destino = segmentos(actual);
    for (const [clave, valor] of Object.entries(entrada.catalogos ? {} : entrada.queryParams ?? {})) {
      if ((actual.queryParamMap.get(clave) ?? entrada.parametrosPredeterminados?.[clave]) !== valor)
        return -1;
    }
    const puntuaciones = [entrada.path, ...entrada.rutasActivas ?? []].map((path) => {
      const ruta = segmentos(this.router.parseUrl(path));
      return ruta.every((segmento, indice) => destino[indice] !== void 0 && (segmento.startsWith(":") || destino[indice] === segmento)) ? ruta.length * 10 + Object.keys(entrada.queryParams ?? {}).length : -1;
    });
    return Math.max(...puntuaciones);
  }
  static \u0275fac = function SidebarComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SidebarComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SidebarComponent, selectors: [["app-sidebar"]], hostVars: 2, hostBindings: function SidebarComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275classProp("contraido", ctx.contraido());
    }
  }, inputs: { items: [1, "items"], contraido: [1, "contraido"] }, outputs: { contraido: "contraidoChange" }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 14, vars: 3, consts: [["type", "button", "popovertarget", "menu-principal", "popovertargetaction", "hide", "aria-label", "Cerrar men\xFA de navegaci\xF3n", 1, "btn", "btn-icono", "btn-sin-borde", "cerrar-menu"], ["aria-hidden", "true", 1, "material-symbols-outlined"], ["aria-label", "Navegaci\xF3n principal", 3, "keydown"], [3, "routerLink", "active"], ["routerLink", "/portal-certificados", "aria-label", "Portal p\xFAblico", 1, "portal-publico"], [1, "texto-enlace"], ["role", "status", 1, "sin-opciones"], [3, "routerLink"], ["type", "button", 1, "modulo", 3, "click"], [1, "titulo-modulo"], ["aria-hidden", "true", 1, "material-symbols-outlined", "flecha"], [1, "submenu", 3, "id", "hidden"], [3, "routerLink", "queryParams", "active"], [3, "routerLink", "queryParams"], [1, "etiqueta-desarrollo"]], template: function SidebarComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "aside")(1, "button", 0)(2, "span", 1);
      \u0275\u0275text(3, "chevron_left");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(4, "nav", 2);
      \u0275\u0275listener("keydown", function SidebarComponent_Template_nav_keydown_4_listener($event) {
        return ctx.alTeclear($event);
      });
      \u0275\u0275template(5, SidebarComponent_Conditional_5_Template, 5, 8, "a", 3);
      \u0275\u0275repeaterCreate(6, SidebarComponent_For_7_Template, 10, 12, null, null, _forTrack0);
      \u0275\u0275elementStart(8, "a", 4)(9, "span", 1);
      \u0275\u0275text(10, "verified");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "span", 5);
      \u0275\u0275text(12, "Portal p\xFAblico");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(13, SidebarComponent_Conditional_13_Template, 2, 0, "p", 6);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      let tmp_0_0;
      \u0275\u0275advance(5);
      \u0275\u0275conditional((tmp_0_0 = ctx.dashboard()) ? 5 : -1, tmp_0_0);
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.grupos());
      \u0275\u0275advance(2);
      \u0275\u0275attribute("title", ctx.contraido() ? "Portal p\xFAblico" : null);
      \u0275\u0275advance(5);
      \u0275\u0275conditional(!ctx.dashboard() && !ctx.grupos().length ? 13 : -1);
    }
  }, dependencies: [RouterLink], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  height: 100%;\n  border-right: 1px solid rgba(255, 255, 255, 0.1);\n  background: var(--azul-institucional);\n  scrollbar-width: thin;\n  scrollbar-color: rgba(255, 255, 255, 0.4) var(--azul-institucional);\n  color: #fff;\n}\nnav[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  padding: var(--espacio-4) var(--espacio-3);\n}\na[_ngcontent-%COMP%], \n.modulo[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: var(--espacio-3);\n  min-height: var(--alto-control);\n  padding: var(--espacio-2) var(--espacio-3);\n  border: 0;\n  border-left: 4px solid transparent;\n  border-radius: var(--radio-sm);\n  color: #fff;\n  font-weight: 500;\n  line-height: 1.3;\n  text-decoration: none;\n  min-width: 0;\n  max-width: 100%;\n}\na[_ngcontent-%COMP%]:hover, \n.modulo[_ngcontent-%COMP%]:hover {\n  background: rgba(255, 255, 255, 0.1);\n  color: #fff;\n}\na[_ngcontent-%COMP%]:focus-visible, \n.modulo[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid #fff;\n  outline-offset: -2px;\n}\na.active[_ngcontent-%COMP%], \n.modulo.active[_ngcontent-%COMP%] {\n  border-left-color: var(--dorado-accion);\n  background: rgba(255, 255, 255, 0.14);\n  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);\n}\na[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%], \n.modulo[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%] {\n  flex: 0 0 24px;\n  width: 24px;\n  height: 24px;\n  font-size: 24px;\n  line-height: 24px;\n  color: inherit;\n  text-align: center;\n}\n.modulo[_ngcontent-%COMP%] {\n  width: 100%;\n  background: transparent;\n  font: inherit;\n  text-align: left;\n  cursor: pointer;\n}\n.titulo-modulo[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n  font-size: 0.8125rem;\n  font-weight: 600;\n}\n.texto-enlace[_ngcontent-%COMP%], \n.titulo-modulo[_ngcontent-%COMP%] {\n  min-width: 0;\n  overflow-wrap: anywhere;\n  white-space: normal;\n}\n.sin-opciones[_ngcontent-%COMP%] {\n  margin: var(--espacio-3);\n  color: #fff;\n  font-size: 0.875rem;\n}\n.etiqueta-desarrollo[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 0.6875rem;\n  font-weight: 400;\n}\n.submenu[hidden][_ngcontent-%COMP%] {\n  display: none;\n}\n.flecha.expandida[_ngcontent-%COMP%] {\n  transform: rotate(180deg);\n}\n.submenu[_ngcontent-%COMP%] {\n  padding-left: var(--espacio-4);\n  margin-block: var(--espacio-1) var(--espacio-3);\n  font-size: 0.875rem;\n}\n.cerrar-menu[_ngcontent-%COMP%] {\n  display: none;\n  background: transparent;\n  color: #fff;\n}\n.cerrar-menu[_ngcontent-%COMP%]:hover {\n  background: var(--azul-oscuro);\n  color: #fff;\n}\n.cerrar-menu[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid #fff;\n}\n.contraido[_nghost-%COMP%]   nav[_ngcontent-%COMP%] {\n  padding-inline: var(--espacio-2);\n}\n.contraido[_nghost-%COMP%]   .titulo-modulo[_ngcontent-%COMP%], \n.contraido[_nghost-%COMP%]   .flecha[_ngcontent-%COMP%], \n.contraido[_nghost-%COMP%]   .submenu[_ngcontent-%COMP%], \n.contraido[_nghost-%COMP%]   nav[_ngcontent-%COMP%]    > a[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:not(.material-symbols-outlined) {\n  display: none;\n}\n.contraido[_nghost-%COMP%]   .modulo[_ngcontent-%COMP%], \n.contraido[_nghost-%COMP%]   nav[_ngcontent-%COMP%]    > a[_ngcontent-%COMP%] {\n  justify-content: center;\n  padding-inline: 0;\n}\n@media (max-width: 768px) {\n  .cerrar-menu[_ngcontent-%COMP%] {\n    display: flex;\n    margin: var(--espacio-3) var(--espacio-3) 0 auto;\n  }\n}\n[_nghost-%COMP%]   .portal-publico[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n  border-top: 1px solid rgba(255, 255, 255, 0.2);\n  padding-top: 1rem;\n}\n/*# sourceMappingURL=sidebar.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SidebarComponent, { className: "SidebarComponent", filePath: "src\\app\\components\\sidebar\\sidebar.component.ts", lineNumber: 17 });
})();

// src/app/components/layouts/main-layout/main-layout.component.ts
var _c02 = ["headerLayout"];
var _c1 = [[["", "layout-header", ""]]];
var _c2 = ["[layout-header]"];
var MainLayoutComponent = class _MainLayoutComponent {
  elemento = inject(ElementRef);
  header = viewChild.required("headerLayout", { read: ElementRef });
  destroyRef = inject(DestroyRef);
  constructor() {
    afterNextRender(() => {
      const cabecera = this.header().nativeElement;
      const medir = () => this.elemento.nativeElement.style.setProperty("--alto-header-real", `${cabecera.getBoundingClientRect().height}px`);
      medir();
      const observador = new ResizeObserver(medir);
      observador.observe(cabecera);
      this.destroyRef.onDestroy(() => observador.disconnect());
    });
  }
  navigation = input([]);
  sidebarContraido = signal(false);
  menuMovilAbierto = signal(false);
  actualizarMenuMovil(event) {
    this.menuMovilAbierto.set(event.newState === "open");
    if (this.menuMovilAbierto())
      this.sidebarContraido.set(false);
  }
  static \u0275fac = function MainLayoutComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MainLayoutComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MainLayoutComponent, selectors: [["app-main-layout"]], viewQuery: function MainLayoutComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuerySignal(ctx.header, _c02, 5, ElementRef);
    }
    if (rf & 2) {
      \u0275\u0275queryAdvance();
    }
  }, hostVars: 2, hostBindings: function MainLayoutComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275classProp("sidebar-contraido", ctx.sidebarContraido());
    }
  }, inputs: { navigation: [1, "navigation"] }, standalone: true, features: [\u0275\u0275StandaloneFeature], ngContentSelectors: _c2, decls: 12, vars: 6, consts: [["headerLayout", ""], ["type", "button", "popovertarget", "menu-principal", "aria-label", "Men\xFA de navegaci\xF3n", "aria-controls", "menu-principal", 1, "btn", "btn-icono", "btn-sin-borde", "menu-toggle", "menu-movil"], ["aria-hidden", "true", 1, "material-symbols-outlined"], ["type", "button", "aria-controls", "menu-principal", 1, "btn", "btn-icono", "btn-sin-borde", "menu-toggle", "menu-escritorio", 3, "click"], ["id", "menu-principal", "popover", "", 3, "contraidoChange", "toggle", "click", "items", "contraido"]], template: function MainLayoutComponent_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275projectionDef(_c1);
      \u0275\u0275elementStart(0, "app-header", null, 0)(2, "button", 1)(3, "span", 2);
      \u0275\u0275text(4, "menu");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(5, "button", 3);
      \u0275\u0275listener("click", function MainLayoutComponent_Template_button_click_5_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.sidebarContraido.set(!ctx.sidebarContraido()));
      });
      \u0275\u0275elementStart(6, "span", 2);
      \u0275\u0275text(7, "menu");
      \u0275\u0275elementEnd()();
      \u0275\u0275projection(8);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "app-sidebar", 4);
      \u0275\u0275twoWayListener("contraidoChange", function MainLayoutComponent_Template_app_sidebar_contraidoChange_9_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.sidebarContraido, $event) || (ctx.sidebarContraido = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275listener("toggle", function MainLayoutComponent_Template_app_sidebar_toggle_9_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.actualizarMenuMovil($event));
      })("click", function MainLayoutComponent_Template_app_sidebar_click_9_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView($event.currentTarget.hidePopover());
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "main");
      \u0275\u0275element(11, "router-outlet");
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275attribute("aria-expanded", ctx.menuMovilAbierto());
      \u0275\u0275advance(3);
      \u0275\u0275attribute("aria-label", ctx.sidebarContraido() ? "Expandir men\xFA lateral" : "Contraer men\xFA lateral")("title", ctx.sidebarContraido() ? "Expandir men\xFA lateral" : "Contraer men\xFA lateral")("aria-expanded", !ctx.sidebarContraido());
      \u0275\u0275advance(4);
      \u0275\u0275property("items", ctx.navigation());
      \u0275\u0275twoWayProperty("contraido", ctx.sidebarContraido);
    }
  }, dependencies: [RouterOutlet, HeaderComponent, SidebarComponent], styles: ["\n\n[_nghost-%COMP%] {\n  position: fixed;\n  inset: 0;\n  display: grid;\n  grid-template-columns: var(--ancho-sidebar) minmax(0, 1fr);\n  grid-template-rows: auto minmax(0, 1fr);\n  height: 100vh;\n  height: 100dvh;\n  overflow: hidden;\n}\napp-header[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n  position: relative;\n  z-index: 100;\n  align-self: start;\n}\n.menu-toggle[_ngcontent-%COMP%] {\n  background: transparent;\n  color: #fff;\n}\n.menu-toggle[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #1b7189;\n  color: #fff;\n}\n.menu-toggle[_ngcontent-%COMP%]:focus-visible {\n  outline-color: #fff;\n}\nmain[_ngcontent-%COMP%] {\n  min-width: 0;\n  min-height: 0;\n  overflow-y: auto;\n  overscroll-behavior-y: contain;\n  padding: var(--espacio-6);\n  background: var(--neutro-50);\n  scrollbar-gutter: stable;\n}\n@media (min-width: 769px) {\n  .sidebar-contraido[_nghost-%COMP%] {\n    grid-template-columns: 4.5rem minmax(0, 1fr);\n  }\n  app-sidebar[popover][_ngcontent-%COMP%] {\n    position: static;\n    display: block;\n    inset: auto;\n    width: auto;\n    height: 100%;\n    min-height: 0;\n    max-height: 100%;\n    margin: 0;\n    padding: 0;\n    border: 0;\n    overflow-x: hidden;\n    overflow-y: auto;\n    overscroll-behavior-y: contain;\n    color: inherit;\n  }\n  .menu-movil[_ngcontent-%COMP%] {\n    display: none;\n  }\n}\n@media (max-width: 768px) {\n  .menu-escritorio[_ngcontent-%COMP%] {\n    display: none;\n  }\n  [_nghost-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  main[_ngcontent-%COMP%] {\n    padding: var(--espacio-5) var(--espacio-4);\n  }\n  app-sidebar[popover][_ngcontent-%COMP%] {\n    inset: var(--alto-header-real, 0px) auto 0 0;\n    width: min(var(--ancho-sidebar) + var(--espacio-6), 85vw);\n    height: calc(100dvh - var(--alto-header-real, 0px));\n    max-height: none;\n    margin: 0;\n    padding: 0;\n    border: 0;\n    box-shadow: var(--sombra-lg);\n    overflow-x: hidden;\n    overflow-y: auto;\n    overscroll-behavior-y: contain;\n  }\n  app-sidebar[popover][_ngcontent-%COMP%]:not(:popover-open) {\n    display: none;\n  }\n  app-sidebar[_ngcontent-%COMP%]::backdrop {\n    background: var(--color-velo);\n  }\n}\n/*# sourceMappingURL=main-layout.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MainLayoutComponent, { className: "MainLayoutComponent", filePath: "src\\app\\components\\layouts\\main-layout\\main-layout.component.ts", lineNumber: 15 });
})();

// src/app/components/layouts/private-layout/private-layout.component.ts
var _c03 = ["menuUsuario"];
var _c12 = ["botonUsuario"];
function PrivateLayoutComponent_Conditional_6_Conditional_13_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 20);
    \u0275\u0275text(1, "No se pudo cerrar la sesi\xF3n. Intenta nuevamente.");
    \u0275\u0275elementEnd();
  }
}
function PrivateLayoutComponent_Conditional_6_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 16)(1, "div", 17)(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "button", 18);
    \u0275\u0275listener("click", function PrivateLayoutComponent_Conditional_6_Conditional_13_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.cerrarSesion());
    });
    \u0275\u0275elementStart(7, "span", 19);
    \u0275\u0275text(8, "logout");
    \u0275\u0275elementEnd();
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275template(10, PrivateLayoutComponent_Conditional_6_Conditional_13_Conditional_10_Template, 2, 0, "p", 20);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const usuario_r4 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(usuario_r4.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(usuario_r4.email);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.saliendo());
    \u0275\u0275attribute("aria-busy", ctx_r1.saliendo());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r1.saliendo() ? "Cerrando sesi\xF3n\u2026" : "Cerrar sesi\xF3n", " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.errorSalida() ? 10 : -1);
  }
}
function PrivateLayoutComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 8, 0);
    \u0275\u0275listener("focusout", function PrivateLayoutComponent_Conditional_6_Template_div_focusout_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cerrarAlSalir($event));
    });
    \u0275\u0275elementStart(2, "button", 9, 1);
    \u0275\u0275listener("click", function PrivateLayoutComponent_Conditional_6_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.menuAbierto.set(!ctx_r1.menuAbierto()));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(4, "svg", 10);
    \u0275\u0275element(5, "path", 11);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(6, "span", 12)(7, "span", 13);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span", 14);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "span", 15);
    \u0275\u0275text(12, "expand_more");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(13, PrivateLayoutComponent_Conditional_6_Conditional_13_Template, 11, 6, "div", 16);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const usuario_r4 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275attribute("aria-expanded", ctx_r1.menuAbierto());
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(usuario_r4.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(usuario_r4.rol);
    \u0275\u0275advance();
    \u0275\u0275classProp("abierta", ctx_r1.menuAbierto());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.menuAbierto() ? 13 : -1);
  }
}
var PrivateLayoutComponent = class _PrivateLayoutComponent {
  auth = inject(AuthService);
  saliendo = signal(false);
  menuAbierto = signal(false);
  errorSalida = signal(false);
  menuUsuario = viewChild("menuUsuario");
  botonUsuario = viewChild("botonUsuario");
  cerrarAlPulsarFuera(event) {
    if (!this.menuUsuario()?.nativeElement.contains(event.target))
      this.menuAbierto.set(false);
  }
  cerrarConEscape() {
    if (!this.menuAbierto())
      return;
    this.menuAbierto.set(false);
    this.botonUsuario()?.nativeElement.focus();
  }
  cerrarAlSalir(event) {
    if (!this.menuUsuario()?.nativeElement.contains(event.relatedTarget))
      this.menuAbierto.set(false);
  }
  navegacion = computed(() => this.auth.modulos().map((modulo) => ({
    label: modulo.nombre,
    path: modulo.url,
    icon: modulo.imagen
  })));
  cerrarSesion() {
    if (this.saliendo())
      return;
    this.saliendo.set(true);
    this.errorSalida.set(false);
    this.auth.logout().pipe(finalize(() => this.saliendo.set(false))).subscribe({
      error: () => this.errorSalida.set(true)
    });
  }
  static \u0275fac = function PrivateLayoutComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PrivateLayoutComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PrivateLayoutComponent, selectors: [["app-private-layout"]], viewQuery: function PrivateLayoutComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuerySignal(ctx.menuUsuario, _c03, 5);
      \u0275\u0275viewQuerySignal(ctx.botonUsuario, _c12, 5);
    }
    if (rf & 2) {
      \u0275\u0275queryAdvance(2);
    }
  }, hostBindings: function PrivateLayoutComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("click", function PrivateLayoutComponent_click_HostBindingHandler($event) {
        return ctx.cerrarAlPulsarFuera($event);
      }, false, \u0275\u0275resolveDocument)("keydown.escape", function PrivateLayoutComponent_keydown_escape_HostBindingHandler() {
        return ctx.cerrarConEscape();
      }, false, \u0275\u0275resolveDocument);
    }
  }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 7, vars: 2, consts: [["menuUsuario", ""], ["botonUsuario", ""], [3, "navigation"], ["layout-header", "", 1, "barra"], [1, "marca"], ["src", "/marca/escudo-36.webp", "srcset", "/marca/escudo-36.webp 1x, /marca/escudo-72.webp 2x", "width", "34", "height", "36", "alt", "", 1, "escudo"], [1, "sistema"], [1, "usuario"], [1, "usuario", 3, "focusout"], ["type", "button", "aria-controls", "opciones-usuario", "aria-label", "Opciones de usuario", 1, "cuenta", 3, "click"], ["xmlns", "http://www.w3.org/2000/svg", "width", "32", "height", "32", "viewBox", "0 0 24 24", "fill", "currentColor", "aria-hidden", "true", "focusable", "false", 1, "avatar"], ["d", "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z"], [1, "datos"], [1, "nombre"], [1, "rol"], ["aria-hidden", "true", 1, "material-symbols-outlined", "flecha"], ["id", "opciones-usuario", 1, "opciones-usuario"], [1, "perfil-usuario"], ["type", "button", 1, "cerrar-sesion", 3, "click", "disabled"], ["aria-hidden", "true", 1, "material-symbols-outlined"], ["role", "alert", 1, "error-salida"]], template: function PrivateLayoutComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "app-main-layout", 2)(1, "div", 3)(2, "span", 4);
      \u0275\u0275element(3, "img", 5);
      \u0275\u0275elementStart(4, "span", 6);
      \u0275\u0275text(5, "Sistema de Certificados Digitales");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(6, PrivateLayoutComponent_Conditional_6_Template, 14, 6, "div", 7);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      let tmp_1_0;
      \u0275\u0275property("navigation", ctx.navegacion());
      \u0275\u0275advance(6);
      \u0275\u0275conditional((tmp_1_0 = ctx.auth.usuario()) ? 6 : -1, tmp_1_0);
    }
  }, dependencies: [MainLayoutComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.barra[_ngcontent-%COMP%] {\n  display: flex;\n  flex: 1;\n  align-items: center;\n  justify-content: space-between;\n  gap: var(--espacio-4);\n  min-width: 0;\n}\n.marca[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: var(--espacio-3);\n  min-width: 0;\n}\n.escudo[_ngcontent-%COMP%] {\n  display: block;\n  flex: none;\n  width: auto;\n  height: 2.25rem;\n}\n.sistema[_ngcontent-%COMP%] {\n  overflow: hidden;\n  font-weight: 600;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.usuario[_ngcontent-%COMP%] {\n  position: relative;\n  flex-shrink: 0;\n  min-width: 0;\n  margin-left: auto;\n  margin-right: 1rem;\n}\n.cuenta[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.625rem;\n  min-height: 2.75rem;\n  padding: 0.375rem 0.5rem;\n  border: 1px solid transparent;\n  border-radius: 0.625rem;\n  background: transparent;\n  color: inherit;\n  font: inherit;\n  cursor: pointer;\n}\n.cuenta[_ngcontent-%COMP%]:hover, \n.cuenta[aria-expanded=true][_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.12);\n}\n.cuenta[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid #fff;\n  outline-offset: 2px;\n}\n.avatar[_ngcontent-%COMP%] {\n  flex: none;\n  font-size: 2rem;\n}\n.flecha[_ngcontent-%COMP%] {\n  transition: transform 160ms ease;\n}\n.flecha.abierta[_ngcontent-%COMP%] {\n  transform: rotate(180deg);\n}\n.datos[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n  line-height: 1.25;\n  max-width: 16rem;\n  text-align: left;\n}\n.nombre[_ngcontent-%COMP%] {\n  overflow: hidden;\n  font-weight: 600;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.rol[_ngcontent-%COMP%] {\n  color: #fff;\n  font-size: 0.8125rem;\n}\n.opciones-usuario[_ngcontent-%COMP%] {\n  position: absolute;\n  top: calc(100% + 0.375rem);\n  right: 0;\n  width: 17rem;\n  max-width: calc(100vw - 2rem);\n  max-height: calc(100dvh - var(--alto-header-real, var(--alto-header)) - 0.75rem);\n  overflow-y: auto;\n  padding: 0.375rem;\n  border: 1px solid #dce5ef;\n  border-radius: 0.75rem;\n  background: #fff;\n  color: #19354e;\n  box-shadow: 0 10px 28px rgba(15, 42, 68, 0.18);\n  animation: _ngcontent-%COMP%_desplegar 160ms ease-out;\n}\n.perfil-usuario[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.25rem;\n  padding: 0.625rem;\n  margin-bottom: 0.375rem;\n  border-bottom: 1px solid #dce5ef;\n  overflow-wrap: anywhere;\n}\n.perfil-usuario[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: #526479;\n  font-size: 0.8125rem;\n}\n.cerrar-sesion[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.625rem;\n  width: 100%;\n  min-height: 2.75rem;\n  padding: 0.625rem;\n  border: 0;\n  border-radius: 0.5rem;\n  background: #facc15;\n  color: #422f05;\n  font: inherit;\n  text-align: left;\n  cursor: pointer;\n}\n.cerrar-sesion[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #eab308;\n}\n.cerrar-sesion[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid #075a9b;\n  outline-offset: -2px;\n}\n.cerrar-sesion[_ngcontent-%COMP%]:disabled {\n  opacity: 0.65;\n  cursor: wait;\n}\n.error-salida[_ngcontent-%COMP%] {\n  margin: 0.5rem;\n  color: #a12525;\n  font-size: 0.8125rem;\n}\n@keyframes _ngcontent-%COMP%_desplegar {\n  from {\n    opacity: 0;\n    transform: translateY(-0.5rem);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@media (max-width: 768px) {\n  .usuario[_ngcontent-%COMP%] {\n    margin-right: 0.5rem;\n  }\n  .barra[_ngcontent-%COMP%] {\n    gap: 0.5rem;\n  }\n  .marca[_ngcontent-%COMP%] {\n    gap: 0.5rem;\n  }\n  .datos[_ngcontent-%COMP%] {\n    max-width: 9rem;\n    font-size: 0.8125rem;\n  }\n  .rol[_ngcontent-%COMP%] {\n    font-size: 0.75rem;\n  }\n  .cuenta[_ngcontent-%COMP%] {\n    gap: 0.375rem;\n    padding-inline: 0.25rem;\n  }\n  .flecha[_ngcontent-%COMP%] {\n    display: none;\n  }\n}\n@media (max-width: 480px) {\n  .sistema[_ngcontent-%COMP%] {\n    display: none;\n  }\n  .datos[_ngcontent-%COMP%] {\n    max-width: 10rem;\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .opciones-usuario[_ngcontent-%COMP%] {\n    animation: none;\n  }\n  .flecha[_ngcontent-%COMP%] {\n    transition: none;\n  }\n}\n/*# sourceMappingURL=private-layout.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PrivateLayoutComponent, { className: "PrivateLayoutComponent", filePath: "src\\app\\components\\layouts\\private-layout\\private-layout.component.ts", lineNumber: 15 });
})();

export {
  SIDEBAR_CONFIG,
  resolverEntradaSidebar,
  rutaPantallaPendiente,
  pantallasPendientesGuard,
  PrivateLayoutComponent
};
//# sourceMappingURL=chunk-M4ACRH5T.mjs.map
