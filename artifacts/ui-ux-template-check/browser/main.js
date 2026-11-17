import {
  PrivateLayoutComponent,
  SIDEBAR_CONFIG,
  pantallasPendientesGuard,
  resolverEntradaSidebar,
  rutaPantallaPendiente
} from "./chunk-GHLQTI6W.js";
import {
  CATALOGOS_CLASIFICACIONES,
  CATALOGOS_INSTITUCIONALES
} from "./chunk-4QPZ4ZWF.js";
import {
  DialogoConfirmacionComponent
} from "./chunk-BKELQIVX.js";
import {
  HasPermissionDirective
} from "./chunk-RAOZTZC3.js";
import {
  ReportesService
} from "./chunk-DWS7TRZN.js";
import {
  EmisionCertificadosService
} from "./chunk-4FUGVTHD.js";
import "./chunk-RJ22SAW5.js";
import {
  DialogoComponent
} from "./chunk-Y2YHKMWP.js";
import {
  PageTitleComponent
} from "./chunk-YHURBVQM.js";
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
  bootstrapApplication,
  provideClientHydration,
  provideRouter,
  withHttpTransferCacheOptions
} from "./chunk-A36LAIDM.js";
import {
  AuthService
} from "./chunk-W2463ZNS.js";
import "./chunk-C4J44J4Z.js";
import {
  aErrorApi
} from "./chunk-LSGUT5KG.js";
import {
  AUTHENTICATED_REQUEST,
  environment
} from "./chunk-7PBBQCKX.js";
import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
  HttpParams,
  provideHttpClient,
  takeUntilDestroyed,
  toSignal,
  withFetch,
  withInterceptors
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
  Validators,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-YLHEVWGL.js";
import {
  DatePipe,
  DecimalPipe,
  DestroyRef,
  EMPTY,
  ElementRef,
  NgTemplateOutlet,
  PLATFORM_ID,
  Subject,
  afterNextRender,
  catchError,
  computed,
  debounceTime,
  distinctUntilChanged,
  forkJoin,
  inject,
  isPlatformServer,
  map,
  merge,
  of,
  provideZoneChangeDetection,
  shareReplay,
  signal,
  switchMap,
  throwError,
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
  ɵɵelementContainer,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵgetInheritedFactory,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵpipeBind3,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵqueryAdvance,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵresolveWindow,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3,
  ɵɵviewQuerySignal
} from "./chunk-3ZDGBTDF.js";
import {
  __async,
  __objRest,
  __restKey,
  __spreadProps,
  __spreadValues
} from "./chunk-ZX6IUAQ5.js";

// src/app/core/guards/permission.guard.ts
var permissionGuard = (route) => {
  const auth = inject(AuthService);
  if (isPlatformServer(inject(PLATFORM_ID))) {
    return true;
  }
  const router = inject(Router);
  const permiso = route.data["permiso"];
  const capacidad = route.data["capacidadSolicitud"];
  const alternativas = route.data["permisos"];
  const edicion = route.queryParamMap?.has("editar") ? route.data["permisoEdicion"] : void 0;
  const requiere = route.data["requiere"] ?? [];
  return auth.cargarSesion().pipe(map(() => (capacidad ? auth.capacidadesSolicitudes?.()?.[capacidad] === true : edicion ? auth.tienePermiso(edicion) : !!permiso && auth.tienePermiso(permiso) || alternativas?.some((clave) => auth.tienePermiso(clave))) && requiere.every((clave) => auth.tienePermiso(clave)) || router.createUrlTree(["/acceso-denegado"])));
};

// src/app/pages/reportes/reportes.routes.ts
var REPORTES_ROUTES = [
  { path: "", pathMatch: "full", redirectTo: "indicadores" },
  { path: "indicadores", canActivate: [permissionGuard], data: { permiso: "reportes.ver" }, loadComponent: () => import("./chunk-SSY2QCWR.js").then((m) => m.IndicadoresGeneralesComponent) },
  { path: "actividades", canActivate: [permissionGuard], data: { permiso: "reportes.ver" }, loadComponent: () => import("./chunk-6HFRIFEQ.js").then((m) => m.ReportesActividadesComponent) },
  { path: "certificados", canActivate: [permissionGuard], data: { permiso: "reportes.ver" }, loadComponent: () => import("./chunk-UDO7FI5Q.js").then((m) => m.ReportesCertificadosComponent) },
  { path: "asistencia", canActivate: [permissionGuard], data: { permiso: "reportes.ver" }, loadComponent: () => import("./chunk-TF5D7QPM.js").then((m) => m.ReportesAsistenciaComponent) }
];

// src/app/core/guards/auth.guard.ts
var authGuard = (_route, state) => {
  const auth = inject(AuthService);
  if (isPlatformServer(inject(PLATFORM_ID))) {
    return true;
  }
  const router = inject(Router);
  return auth.cargarSesion().pipe(map((ok) => ok || router.createUrlTree(["/login"], { queryParams: { returnUrl: state.url } })));
};

// src/app/core/guards/cambios-pendientes.guard.ts
var cambiosPendientesGuard = (componente) => componente.confirmarSalida();

// src/app/core/guards/guest.guard.ts
var guestGuard = () => {
  const auth = inject(AuthService);
  if (isPlatformServer(inject(PLATFORM_ID))) {
    return true;
  }
  const router = inject(Router);
  return auth.cargarSesion().pipe(map((ok) => ok ? router.parseUrl(auth.rutaInicial()) : true));
};

// src/app/core/guards/inicio.guard.ts
var inicioGuard = () => {
  const auth = inject(AuthService);
  if (isPlatformServer(inject(PLATFORM_ID))) {
    return true;
  }
  const router = inject(Router);
  return auth.cargarSesion().pipe(map((ok) => router.parseUrl(ok ? auth.rutaInicial() : "/login")));
};

// src/app/components/layouts/auth-layout/auth-layout.component.ts
var _c0 = ["*"];
var AuthLayoutComponent = class _AuthLayoutComponent {
  static \u0275fac = function AuthLayoutComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AuthLayoutComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AuthLayoutComponent, selectors: [["app-auth-layout"]], standalone: true, features: [\u0275\u0275StandaloneFeature], ngContentSelectors: _c0, decls: 28, vars: 0, consts: [[1, "dividido"], ["aria-label", "Municipalidad Distrital de Morales", 1, "marca"], ["aria-hidden", "true", 1, "franja-tinturas"], [1, "presentacion"], ["media", "(max-width: 800px)", "srcset", "/marca/escudo-48.webp 1x, /marca/escudo-96.webp 2x"], ["src", "/marca/escudo-160.webp", "srcset", "/marca/escudo-160.webp 1x, /marca/escudo-320.webp 2x", "width", "150", "height", "160", "alt", "Escudo de la Municipalidad Distrital de Morales", 1, "escudo"], [1, "textos"], [1, "sistema"], [1, "municipalidad"], [1, "descripcion"], [1, "verificar"], [1, "badge"], [1, "contenido"], [1, "formulario"]], template: function AuthLayoutComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275projectionDef();
      \u0275\u0275elementStart(0, "div", 0)(1, "aside", 1)(2, "div", 2);
      \u0275\u0275element(3, "span")(4, "span")(5, "span")(6, "span")(7, "span");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "div", 3)(9, "picture");
      \u0275\u0275element(10, "source", 4)(11, "img", 5);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "div", 6)(13, "p", 7);
      \u0275\u0275text(14, "Sistema de Certificados Digitales");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "p", 8);
      \u0275\u0275text(16, "Municipalidad Distrital de Morales");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "p", 9);
      \u0275\u0275text(18, "Registro, emisi\xF3n y verificaci\xF3n de los certificados que emite la municipalidad.");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(19, "p", 10);
      \u0275\u0275text(20, " \xBFRecibiste un certificado? ");
      \u0275\u0275elementStart(21, "strong");
      \u0275\u0275text(22, "Verificar autenticidad");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "span", 11);
      \u0275\u0275text(24, "Pr\xF3ximamente");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(25, "main", 12)(26, "div", 13);
      \u0275\u0275projection(27);
      \u0275\u0275elementEnd()()();
    }
  }, styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.dividido[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(26rem, 46%) 1fr;\n  min-height: 100vh;\n  min-height: 100dvh;\n}\n.marca[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  gap: var(--espacio-6);\n  padding: var(--espacio-8) 3.5rem;\n  background:\n    linear-gradient(\n      145deg,\n      var(--azul-oscuro),\n      var(--azul-institucional));\n  color: #fff;\n}\n.franja-tinturas[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0 auto 0 0;\n  width: var(--ancho-franja);\n}\n.presentacion[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: var(--espacio-6);\n  margin-block: auto;\n}\n.escudo[_ngcontent-%COMP%] {\n  display: block;\n  width: auto;\n  height: 10rem;\n}\n.sistema[_ngcontent-%COMP%] {\n  max-width: 12ch;\n  margin: 0 0 var(--espacio-2);\n  font-size: 2.5rem;\n  font-weight: 600;\n  line-height: 1.1;\n  letter-spacing: -0.02em;\n  color: #fff;\n}\n.municipalidad[_ngcontent-%COMP%] {\n  margin: 0 0 var(--espacio-4);\n  color: #e2edf7;\n  font-size: 1rem;\n  font-weight: 500;\n}\n.descripcion[_ngcontent-%COMP%] {\n  max-width: 36ch;\n  margin: 0;\n  color: #e2edf7;\n  font-size: 1rem;\n  line-height: 1.55;\n}\n.verificar[_ngcontent-%COMP%] {\n  margin: 0;\n  padding-top: var(--espacio-5);\n  border-top: 1px solid rgba(255, 255, 255, 0.25);\n  color: #e2edf7;\n  font-size: 0.875rem;\n}\n.verificar[_ngcontent-%COMP%]   .badge[_ngcontent-%COMP%] {\n  margin-left: var(--espacio-1);\n  background: var(--neutro-0);\n}\n.contenido[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  padding: var(--espacio-8) var(--espacio-6);\n}\n.formulario[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 28rem;\n  padding: var(--espacio-6);\n  box-sizing: border-box;\n  border: 1px solid var(--neutro-200);\n  border-radius: var(--radio-lg);\n  background: var(--neutro-0);\n  box-shadow: var(--sombra-md);\n}\n@media (max-width: 800px) {\n  .dividido[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    grid-template-rows: auto 1fr;\n  }\n  .marca[_ngcontent-%COMP%] {\n    padding: var(--espacio-3) var(--espacio-4) var(--espacio-3) var(--espacio-5);\n    border-bottom: 1px solid var(--neutro-200);\n  }\n  .presentacion[_ngcontent-%COMP%] {\n    flex-direction: row;\n    align-items: center;\n    gap: var(--espacio-3);\n    margin: 0;\n  }\n  .escudo[_ngcontent-%COMP%] {\n    height: 3rem;\n  }\n  .sistema[_ngcontent-%COMP%] {\n    max-width: none;\n    margin: 0;\n    font-size: 1rem;\n  }\n  .municipalidad[_ngcontent-%COMP%] {\n    margin: 0;\n    font-size: 0.8125rem;\n  }\n  .descripcion[_ngcontent-%COMP%], \n   .verificar[_ngcontent-%COMP%] {\n    display: none;\n  }\n  .contenido[_ngcontent-%COMP%] {\n    place-items: start center;\n    padding: var(--espacio-6) var(--espacio-4);\n  }\n  .formulario[_ngcontent-%COMP%] {\n    box-sizing: border-box;\n    padding: var(--espacio-5);\n  }\n}\n/*# sourceMappingURL=auth-layout.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AuthLayoutComponent, { className: "AuthLayoutComponent", filePath: "src\\app\\components\\layouts\\auth-layout\\auth-layout.component.ts", lineNumber: 15 });
})();

// src/app/shared/utils/zona-horaria.ts
var ZONA_HORARIA_LIMA = "-0500";

// src/app/pages/autenticacion/login/login.component.ts
function LoginComponent_Conditional_7_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
    \u0275\u0275pipe(1, "date");
  }
  if (rf & 2) {
    const error_r2 = \u0275\u0275nextContext();
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275textInterpolate1(" Cuenta bloqueada hasta ", \u0275\u0275pipeBind3(1, 1, error_r2.bloqueadoHasta, "HH:mm", ctx_r2.zonaLima), " ");
  }
}
function LoginComponent_Conditional_7_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const error_r2 = \u0275\u0275nextContext();
    \u0275\u0275textInterpolate1(" ", error_r2.mensaje, " ");
  }
}
function LoginComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5)(1, "span", 16);
    \u0275\u0275text(2, "error");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275template(4, LoginComponent_Conditional_7_Conditional_4_Template, 2, 5)(5, LoginComponent_Conditional_7_Conditional_5_Template, 1, 1);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const error_r2 = ctx;
    \u0275\u0275advance(4);
    \u0275\u0275conditional(error_r2.tipo === "bloqueado" && error_r2.bloqueadoHasta ? 4 : 5);
  }
}
function LoginComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5)(1, "span", 16);
    \u0275\u0275text(2, "error");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r2.errorInesperado());
  }
}
function LoginComponent_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 11);
    \u0275\u0275text(1, "Ingresa un correo v\xE1lido.");
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 11);
    \u0275\u0275text(1, "Ingresa tu contrase\xF1a.");
    \u0275\u0275elementEnd();
  }
}
var LoginComponent = class _LoginComponent {
  auth = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  zonaLima = ZONA_HORARIA_LIMA;
  enviando = signal(false);
  resultado = signal(null);
  errorInesperado = signal(null);
  form = inject(NonNullableFormBuilder).group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", Validators.required]
  });
  ingresar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { email, password } = this.form.getRawValue();
    this.enviando.set(true);
    this.resultado.set(null);
    this.errorInesperado.set(null);
    this.auth.login(email, password).subscribe({
      next: (resultado) => {
        this.enviando.set(false);
        if (resultado.tipo === "exito") {
          void this.router.navigateByUrl(this.destino());
        } else {
          this.resultado.set(resultado);
        }
      },
      error: (error) => {
        this.enviando.set(false);
        this.errorInesperado.set(this.mensajeError(error));
      }
    });
  }
  mensajeError(error) {
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 0:
        case 502:
        case 503:
        case 504:
          return "No se pudo conectar con el servidor. Verifica que el servicio est\xE9 disponible.";
        case 403:
          return "Acceso denegado. Contacta con el administrador.";
        case 404:
          return "El servicio de inicio de sesi\xF3n no est\xE1 disponible. Contacta con el administrador.";
        case 419:
          return "La sesi\xF3n expir\xF3. Recarga la p\xE1gina e intenta nuevamente.";
        case 422:
          return "Revisa el correo electr\xF3nico y la contrase\xF1a ingresados.";
        case 429:
          return "Demasiados intentos. Espera unos minutos antes de intentar nuevamente.";
      }
      if (error.status >= 500) {
        return "Ocurri\xF3 un problema en el servidor. Intenta nuevamente.";
      }
    }
    return "No se pudo validar la sesi\xF3n. Intenta nuevamente. Si el problema contin\xFAa, contacta con el administrador.";
  }
  /** Solo rutas internas: evita redirecciones abiertas con returnUrl. */
  destino() {
    const returnUrl = this.route.snapshot.queryParamMap.get("returnUrl");
    return returnUrl?.startsWith("/") && !returnUrl.startsWith("//") ? returnUrl : this.auth.rutaInicial();
  }
  static \u0275fac = function LoginComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LoginComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LoginComponent, selectors: [["app-login"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 32, vars: 12, consts: [["campoPassword", ""], ["aria-labelledby", "titulo-login"], ["id", "titulo-login", 1, "auth-titulo"], [1, "auth-texto"], ["role", "alert"], [1, "alert", "alert-error"], ["novalidate", "", 3, "ngSubmit", "formGroup"], [1, "form-field"], ["for", "email"], ["id", "email", "type", "email", "formControlName", "email", "autocomplete", "username", "inputmode", "email", "aria-required", "true", "aria-describedby", "email-error", 1, "input"], ["id", "email-error", "aria-live", "polite"], [1, "error-text"], ["for", "password"], [1, "input-con-accion"], ["id", "password", "type", "password", "formControlName", "password", "autocomplete", "current-password", "aria-required", "true", "aria-describedby", "password-error", 1, "input"], ["type", "button", "aria-label", "Mostrar contrase\xF1a", 1, "btn", "btn-icono", "btn-sin-borde", 3, "click"], ["aria-hidden", "true", 1, "material-symbols-outlined"], ["id", "password-error", "aria-live", "polite"], ["type", "submit", 1, "btn", "btn-primary", "btn-block", 3, "disabled"], [1, "auth-enlaces"], ["routerLink", "/recuperar-password"]], template: function LoginComponent_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "app-auth-layout")(1, "section", 1)(2, "h1", 2);
      \u0275\u0275text(3, "Iniciar sesi\xF3n");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "Ingresa con tu correo institucional.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "div", 4);
      \u0275\u0275template(7, LoginComponent_Conditional_7_Template, 6, 1, "div", 5)(8, LoginComponent_Conditional_8_Template, 5, 1, "div", 5);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "form", 6);
      \u0275\u0275listener("ngSubmit", function LoginComponent_Template_form_ngSubmit_9_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.ingresar());
      });
      \u0275\u0275elementStart(10, "div", 7)(11, "label", 8);
      \u0275\u0275text(12, "Correo electr\xF3nico");
      \u0275\u0275elementEnd();
      \u0275\u0275element(13, "input", 9);
      \u0275\u0275elementStart(14, "div", 10);
      \u0275\u0275template(15, LoginComponent_Conditional_15_Template, 2, 0, "p", 11);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(16, "div", 7)(17, "label", 12);
      \u0275\u0275text(18, "Contrase\xF1a");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "div", 13);
      \u0275\u0275element(20, "input", 14, 0);
      \u0275\u0275elementStart(22, "button", 15);
      \u0275\u0275listener("click", function LoginComponent_Template_button_click_22_listener() {
        \u0275\u0275restoreView(_r1);
        const campoPassword_r4 = \u0275\u0275reference(21);
        return \u0275\u0275resetView(campoPassword_r4.type = campoPassword_r4.type === "password" ? "text" : "password");
      });
      \u0275\u0275elementStart(23, "span", 16);
      \u0275\u0275text(24);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(25, "div", 17);
      \u0275\u0275template(26, LoginComponent_Conditional_26_Template, 2, 0, "p", 11);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(27, "button", 18);
      \u0275\u0275text(28);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(29, "p", 19)(30, "a", 20);
      \u0275\u0275text(31, "\xBFOlvidaste tu contrase\xF1a?");
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      let tmp_1_0;
      const campoPassword_r4 = \u0275\u0275reference(21);
      \u0275\u0275advance(7);
      \u0275\u0275conditional((tmp_1_0 = ctx.resultado()) ? 7 : -1, tmp_1_0);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.errorInesperado() ? 8 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("formGroup", ctx.form);
      \u0275\u0275advance(4);
      \u0275\u0275attribute("aria-invalid", ctx.form.controls.email.touched && ctx.form.controls.email.invalid);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.form.controls.email.touched && ctx.form.controls.email.invalid ? 15 : -1);
      \u0275\u0275advance(5);
      \u0275\u0275attribute("aria-invalid", ctx.form.controls.password.touched && ctx.form.controls.password.invalid);
      \u0275\u0275advance(2);
      \u0275\u0275attribute("aria-pressed", campoPassword_r4.type === "text");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1(" ", campoPassword_r4.type === "password" ? "visibility" : "visibility_off", " ");
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.form.controls.password.touched && ctx.form.controls.password.invalid ? 26 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("disabled", ctx.enviando());
      \u0275\u0275attribute("aria-busy", ctx.enviando());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.enviando() ? "Ingresando\u2026" : "Ingresar", " ");
    }
  }, dependencies: [ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, RouterLink, DatePipe, AuthLayoutComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n/*# sourceMappingURL=login.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LoginComponent, { className: "LoginComponent", filePath: "src\\app\\pages\\autenticacion\\login\\login.component.ts", lineNumber: 18 });
})();

// src/app/pages/autenticacion/recuperar-password/recuperar-password.component.ts
function RecuperarPasswordComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3)(1, "span", 6);
    \u0275\u0275text(2, "check_circle");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4, "Si el correo existe, te enviamos un enlace para restablecer tu contrase\xF1a.");
    \u0275\u0275elementEnd()();
  }
}
function RecuperarPasswordComponent_Conditional_6_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9)(1, "span", 6);
    \u0275\u0275text(2, "error");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4, "No se pudo enviar la solicitud. Intenta nuevamente.");
    \u0275\u0275elementEnd()();
  }
}
function RecuperarPasswordComponent_Conditional_6_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 15);
    \u0275\u0275text(1, "Ingresa un correo v\xE1lido.");
    \u0275\u0275elementEnd();
  }
}
function RecuperarPasswordComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 7);
    \u0275\u0275text(1, "Ingresa tu correo y te enviaremos un enlace para crear una nueva contrase\xF1a.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 8);
    \u0275\u0275template(3, RecuperarPasswordComponent_Conditional_6_Conditional_3_Template, 5, 0, "div", 9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "form", 10);
    \u0275\u0275listener("ngSubmit", function RecuperarPasswordComponent_Conditional_6_Template_form_ngSubmit_4_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.enviar());
    });
    \u0275\u0275elementStart(5, "div", 11)(6, "label", 12);
    \u0275\u0275text(7, "Correo electr\xF3nico");
    \u0275\u0275elementEnd();
    \u0275\u0275element(8, "input", 13);
    \u0275\u0275elementStart(9, "div", 14);
    \u0275\u0275template(10, RecuperarPasswordComponent_Conditional_6_Conditional_10_Template, 2, 0, "p", 15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "button", 16);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.errorInesperado() ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("formGroup", ctx_r1.form);
    \u0275\u0275advance(4);
    \u0275\u0275attribute("aria-invalid", ctx_r1.form.controls.email.touched && ctx_r1.form.controls.email.invalid);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.form.controls.email.touched && ctx_r1.form.controls.email.invalid ? 10 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.enviando());
    \u0275\u0275attribute("aria-busy", ctx_r1.enviando());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.enviando() ? "Enviando\u2026" : "Enviar enlace", " ");
  }
}
var RecuperarPasswordComponent = class _RecuperarPasswordComponent {
  auth = inject(AuthService);
  enviando = signal(false);
  enviado = signal(false);
  errorInesperado = signal(false);
  form = inject(NonNullableFormBuilder).group({
    email: ["", [Validators.required, Validators.email]]
  });
  enviar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.enviando.set(true);
    this.errorInesperado.set(false);
    this.auth.forgotPassword(this.form.getRawValue().email).subscribe({
      next: () => {
        this.enviando.set(false);
        this.enviado.set(true);
      },
      error: () => {
        this.enviando.set(false);
        this.errorInesperado.set(true);
      }
    });
  }
  static \u0275fac = function RecuperarPasswordComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RecuperarPasswordComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RecuperarPasswordComponent, selectors: [["app-recuperar-password"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 10, vars: 2, consts: [["aria-labelledby", "titulo-recuperar"], ["id", "titulo-recuperar", 1, "auth-titulo"], ["role", "status"], [1, "alert", "alert-exito"], [1, "auth-enlaces"], ["routerLink", "/login"], ["aria-hidden", "true", 1, "material-symbols-outlined"], [1, "auth-texto"], ["role", "alert"], [1, "alert", "alert-error"], ["novalidate", "", 3, "ngSubmit", "formGroup"], [1, "form-field"], ["for", "email"], ["id", "email", "type", "email", "formControlName", "email", "autocomplete", "email", "inputmode", "email", "aria-required", "true", "aria-describedby", "email-error", 1, "input"], ["id", "email-error", "aria-live", "polite"], [1, "error-text"], ["type", "submit", 1, "btn", "btn-primary", "btn-block", 3, "disabled"]], template: function RecuperarPasswordComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "app-auth-layout")(1, "section", 0)(2, "h1", 1);
      \u0275\u0275text(3, "Recuperar contrase\xF1a");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "div", 2);
      \u0275\u0275template(5, RecuperarPasswordComponent_Conditional_5_Template, 5, 0, "div", 3);
      \u0275\u0275elementEnd();
      \u0275\u0275template(6, RecuperarPasswordComponent_Conditional_6_Template, 13, 7);
      \u0275\u0275elementStart(7, "p", 4)(8, "a", 5);
      \u0275\u0275text(9, "Volver a iniciar sesi\xF3n");
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(5);
      \u0275\u0275conditional(ctx.enviado() ? 5 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.enviado() ? 6 : -1);
    }
  }, dependencies: [ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, RouterLink, AuthLayoutComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n/*# sourceMappingURL=recuperar-password.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RecuperarPasswordComponent, { className: "RecuperarPasswordComponent", filePath: "src\\app\\pages\\autenticacion\\recuperar-password\\recuperar-password.component.ts", lineNumber: 14 });
})();

// src/app/pages/autenticacion/restablecer-password/restablecer-password.component.ts
function RestablecerPasswordComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 2);
    \u0275\u0275text(1, "Cuenta: ");
    \u0275\u0275elementStart(2, "span", 6);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.email);
  }
}
function RestablecerPasswordComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4)(1, "span", 7);
    \u0275\u0275text(2, "check_circle");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4, "Tu contrase\xF1a fue restablecida. Ya puedes iniciar sesi\xF3n con la nueva contrase\xF1a.");
    \u0275\u0275elementEnd()();
  }
}
function RestablecerPasswordComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 5);
    \u0275\u0275text(1, "Iniciar sesi\xF3n");
    \u0275\u0275elementEnd();
  }
}
function RestablecerPasswordComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8)(1, "span", 7);
    \u0275\u0275text(2, "error");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4, "El enlace es inv\xE1lido o expir\xF3.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "a", 9);
    \u0275\u0275text(6, "Solicitar un nuevo enlace");
    \u0275\u0275elementEnd();
  }
}
function RestablecerPasswordComponent_Conditional_9_Conditional_1_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 23);
    \u0275\u0275text(1, "Solicitar un nuevo enlace");
    \u0275\u0275elementEnd();
  }
}
function RestablecerPasswordComponent_Conditional_9_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11)(1, "span", 7);
    \u0275\u0275text(2, "error");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275template(5, RestablecerPasswordComponent_Conditional_9_Conditional_1_Conditional_5_Template, 2, 0, "a", 23);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const mensaje_r3 = ctx;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", mensaje_r3, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(mensaje_r3.startsWith("El enlace") ? 5 : -1);
  }
}
function RestablecerPasswordComponent_Conditional_9_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("La contrase\xF1a debe tener al menos ", ctx_r0.longitudMinima, " caracteres.");
  }
}
function RestablecerPasswordComponent_Conditional_9_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 18);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("M\xEDnimo ", ctx_r0.longitudMinima, " caracteres.");
  }
}
function RestablecerPasswordComponent_Conditional_9_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 17);
    \u0275\u0275text(1, "Las contrase\xF1as no coinciden.");
    \u0275\u0275elementEnd();
  }
}
function RestablecerPasswordComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275template(1, RestablecerPasswordComponent_Conditional_9_Conditional_1_Template, 6, 2, "div", 11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "form", 12);
    \u0275\u0275listener("ngSubmit", function RestablecerPasswordComponent_Conditional_9_Template_form_ngSubmit_2_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.restablecer());
    });
    \u0275\u0275elementStart(3, "div", 13)(4, "label", 14);
    \u0275\u0275text(5, "Nueva contrase\xF1a");
    \u0275\u0275elementEnd();
    \u0275\u0275element(6, "input", 15);
    \u0275\u0275elementStart(7, "div", 16);
    \u0275\u0275template(8, RestablecerPasswordComponent_Conditional_9_Conditional_8_Template, 2, 1, "p", 17)(9, RestablecerPasswordComponent_Conditional_9_Conditional_9_Template, 2, 1, "p", 18);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 13)(11, "label", 19);
    \u0275\u0275text(12, "Confirmar contrase\xF1a");
    \u0275\u0275elementEnd();
    \u0275\u0275element(13, "input", 20);
    \u0275\u0275elementStart(14, "div", 21);
    \u0275\u0275template(15, RestablecerPasswordComponent_Conditional_9_Conditional_15_Template, 2, 0, "p", 17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "button", 22);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_1_0 = ctx_r0.error()) ? 1 : -1, tmp_1_0);
    \u0275\u0275advance();
    \u0275\u0275property("formGroup", ctx_r0.form);
    \u0275\u0275advance(4);
    \u0275\u0275attribute("aria-invalid", ctx_r0.form.controls.password.touched && ctx_r0.form.controls.password.invalid);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.form.controls.password.touched && ctx_r0.form.controls.password.invalid ? 8 : 9);
    \u0275\u0275advance(5);
    \u0275\u0275attribute("aria-invalid", ctx_r0.form.controls.confirmacion.touched && ctx_r0.form.hasError("noCoinciden"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.form.controls.confirmacion.touched && ctx_r0.form.hasError("noCoinciden") ? 15 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.enviando());
    \u0275\u0275attribute("aria-busy", ctx_r0.enviando());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.enviando() ? "Guardando\u2026" : "Guardar contrase\xF1a", " ");
  }
}
var LONGITUD_MINIMA = 8;
function coincidenPasswords(grupo) {
  const { password, confirmacion } = grupo.value;
  return confirmacion && password !== confirmacion ? { noCoinciden: true } : null;
}
var RestablecerPasswordComponent = class _RestablecerPasswordComponent {
  auth = inject(AuthService);
  query = inject(ActivatedRoute).snapshot.queryParamMap;
  token = this.query.get("token") ?? "";
  email = this.query.get("email") ?? "";
  longitudMinima = LONGITUD_MINIMA;
  enviando = signal(false);
  restablecido = signal(false);
  error = signal(null);
  form = inject(NonNullableFormBuilder).group({
    password: ["", [Validators.required, Validators.minLength(LONGITUD_MINIMA)]],
    confirmacion: ["", Validators.required]
  }, { validators: coincidenPasswords });
  restablecer() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { password, confirmacion } = this.form.getRawValue();
    this.enviando.set(true);
    this.error.set(null);
    this.auth.resetPassword(this.token, this.email, password, confirmacion).subscribe({
      next: () => {
        this.enviando.set(false);
        this.restablecido.set(true);
      },
      error: (error) => {
        this.enviando.set(false);
        this.error.set(error instanceof HttpErrorResponse && error.status === 400 ? "El enlace es inv\xE1lido o expir\xF3." : "No se pudo restablecer la contrase\xF1a. Intenta nuevamente.");
      }
    });
  }
  static \u0275fac = function RestablecerPasswordComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RestablecerPasswordComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RestablecerPasswordComponent, selectors: [["app-restablecer-password"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 10, vars: 3, consts: [["aria-labelledby", "titulo-restablecer"], ["id", "titulo-restablecer", 1, "auth-titulo"], [1, "auth-texto"], ["role", "status"], [1, "alert", "alert-exito"], ["routerLink", "/login", 1, "btn", "btn-primary", "btn-block"], [1, "dato"], ["aria-hidden", "true", 1, "material-symbols-outlined"], ["role", "alert", 1, "alert", "alert-error"], ["routerLink", "/recuperar-password", 1, "btn", "btn-primary", "btn-block"], ["role", "alert"], [1, "alert", "alert-error"], ["novalidate", "", 3, "ngSubmit", "formGroup"], [1, "form-field"], ["for", "password"], ["id", "password", "type", "password", "formControlName", "password", "autocomplete", "new-password", "aria-required", "true", "aria-describedby", "password-ayuda", 1, "input"], ["id", "password-ayuda", "aria-live", "polite"], [1, "error-text"], [1, "form-ayuda"], ["for", "confirmacion"], ["id", "confirmacion", "type", "password", "formControlName", "confirmacion", "autocomplete", "new-password", "aria-required", "true", "aria-describedby", "confirmacion-error", 1, "input"], ["id", "confirmacion-error", "aria-live", "polite"], ["type", "submit", 1, "btn", "btn-primary", "btn-block", 3, "disabled"], ["routerLink", "/recuperar-password"]], template: function RestablecerPasswordComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "app-auth-layout")(1, "section", 0)(2, "h1", 1);
      \u0275\u0275text(3, "Restablecer contrase\xF1a");
      \u0275\u0275elementEnd();
      \u0275\u0275template(4, RestablecerPasswordComponent_Conditional_4_Template, 4, 1, "p", 2);
      \u0275\u0275elementStart(5, "div", 3);
      \u0275\u0275template(6, RestablecerPasswordComponent_Conditional_6_Template, 5, 0, "div", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275template(7, RestablecerPasswordComponent_Conditional_7_Template, 2, 0, "a", 5)(8, RestablecerPasswordComponent_Conditional_8_Template, 7, 0)(9, RestablecerPasswordComponent_Conditional_9_Template, 18, 9);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.token && ctx.email && !ctx.restablecido() ? 4 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.restablecido() ? 6 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.restablecido() ? 7 : !ctx.token || !ctx.email ? 8 : 9);
    }
  }, dependencies: [ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, RouterLink, AuthLayoutComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n/*# sourceMappingURL=restablecer-password.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RestablecerPasswordComponent, { className: "RestablecerPasswordComponent", filePath: "src\\app\\pages\\autenticacion\\restablecer-password\\restablecer-password.component.ts", lineNumber: 30 });
})();

// src/app/pages/autenticacion/acceso-denegado/acceso-denegado.component.ts
var AccesoDenegadoComponent = class _AccesoDenegadoComponent {
  static \u0275fac = function AccesoDenegadoComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AccesoDenegadoComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AccesoDenegadoComponent, selectors: [["app-acceso-denegado"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 8, vars: 0, consts: [["aria-labelledby", "titulo-denegado"], ["id", "titulo-denegado", 1, "auth-titulo"], [1, "auth-texto"], ["routerLink", "/", 1, "btn", "btn-primary", "btn-block"]], template: function AccesoDenegadoComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "app-auth-layout")(1, "section", 0)(2, "h1", 1);
      \u0275\u0275text(3, "Acceso denegado");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 2);
      \u0275\u0275text(5, "No tienes permiso para ver esta p\xE1gina. Si crees que es un error, comun\xEDcate con el administrador del sistema.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "a", 3);
      \u0275\u0275text(7, "Ir al inicio");
      \u0275\u0275elementEnd()()();
    }
  }, dependencies: [RouterLink, AuthLayoutComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n/*# sourceMappingURL=acceso-denegado.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AccesoDenegadoComponent, { className: "AccesoDenegadoComponent", filePath: "src\\app\\pages\\autenticacion\\acceso-denegado\\acceso-denegado.component.ts", lineNumber: 12 });
})();

// src/app/pages/home/home.component.ts
var _forTrack0 = ($index, $item) => $item.clave;
var _forTrack1 = ($index, $item) => $item.id;
function HomeComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 4);
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const usuario_r1 = ctx;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Hola, ", usuario_r1.nombre, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(usuario_r1.rol);
  }
}
function HomeComponent_For_20_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 21);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "number");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, item_r2.valor));
  }
}
function HomeComponent_For_20_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 22);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r2.estado === "cargando" ? "Consultando\u2026" : "Informaci\xF3n no disponible");
  }
}
function HomeComponent_For_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 10)(1, "span", 20);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h3");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, HomeComponent_For_20_Conditional_5_Template, 3, 3, "p", 21)(6, HomeComponent_For_20_Conditional_6_Template, 2, 1, "p", 22);
    \u0275\u0275elementStart(7, "p");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r2 = ctx.$implicit;
    \u0275\u0275attribute("aria-busy", item_r2.estado === "cargando");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r2.icono);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r2.nombre);
    \u0275\u0275advance();
    \u0275\u0275conditional(item_r2.estado === "disponible" ? 5 : 6);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(item_r2.descripcion);
  }
}
function HomeComponent_ForEmpty_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 11);
    \u0275\u0275text(1, "Los indicadores requieren permiso de reportes y lectura del m\xF3dulo correspondiente. Contin\xFAa desde tus accesos autorizados.");
    \u0275\u0275elementEnd();
  }
}
function HomeComponent_For_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 15)(1, "span", 17);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 18);
    \u0275\u0275text(6, "arrow_forward");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const acceso_r3 = ctx.$implicit;
    \u0275\u0275property("routerLink", acceso_r3.path);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(acceso_r3.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(acceso_r3.label);
  }
}
var HomeComponent = class _HomeComponent {
  auth = inject(AuthService);
  reportes = inject(ReportesService);
  destroyRef = inject(DestroyRef);
  indicadores = signal([]);
  accesos = computed(() => SIDEBAR_CONFIG.flatMap((grupo) => grupo.hijos).filter((entrada) => ["actividades", "generar-emitir", "emitidos", "documentos-firmar", "pendientes-aprobacion"].includes(entrada.id)).flatMap((entrada) => {
    const visible = resolverEntradaSidebar(entrada, (clave) => this.auth.tienePermiso(clave), [], false, this.auth.capacidadesSolicitudes());
    return visible ? [visible] : [];
  }));
  constructor() {
    afterNextRender(() => this.cargar());
  }
  cargar() {
    if (!this.auth.tienePermiso("reportes.ver"))
      return;
    const definiciones = [
      { clave: "certificados", nombre: "Certificados registrados", icono: "workspace_premium", permiso: "emision.ver", descripcion: "Registros de todos los estados. No implica firma ni entrega." },
      { clave: "actividades", nombre: "Actividades registradas", icono: "calendar_month", permiso: "actividades.ver", descripcion: "Actividades de todos los estados dentro de tu alcance autorizado." },
      { clave: "participaciones", nombre: "Participaciones registradas", icono: "groups", permiso: "participantes.ver", descripcion: "Inscripciones en actividades; una persona puede tener varias participaciones." },
      { clave: "asistencias", nombre: "Asistencias registradas", icono: "how_to_reg", permiso: "participantes.ver", descripcion: "Registros de asistencia disponibles en el sistema." }
    ];
    const tarjetas = definiciones.filter((item) => this.auth.tienePermiso(item.permiso)).map((item) => __spreadProps(__spreadValues({}, item), { valor: null, estado: "cargando" }));
    this.indicadores.set(tarjetas);
    for (const item of tarjetas) {
      this.reportes.totalRegistrados(item.clave).pipe(map((valor) => __spreadProps(__spreadValues({}, item), { valor, estado: "disponible" })), catchError(() => of(__spreadProps(__spreadValues({}, item), { valor: null, estado: "error" }))), takeUntilDestroyed(this.destroyRef)).subscribe((resultado) => this.indicadores.update((actuales) => actuales.map((actual) => actual.clave === item.clave ? resultado : actual)));
    }
  }
  static \u0275fac = function HomeComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HomeComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _HomeComponent, selectors: [["app-home"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 46, vars: 2, consts: [["aria-labelledby", "bienvenida", 1, "dashboard"], [1, "bienvenida"], [1, "eyebrow"], ["id", "bienvenida"], [1, "saludo"], ["aria-hidden", "true", 1, "material-symbols-outlined", "emblema"], ["aria-labelledby", "titulo-indicadores"], [1, "seccion-titulo"], ["id", "titulo-indicadores"], ["aria-live", "polite", 1, "indicadores"], [1, "indicador"], [1, "informacion"], ["aria-labelledby", "titulo-accesos"], ["id", "titulo-accesos"], ["aria-label", "Accesos r\xE1pidos", 1, "accesos"], [3, "routerLink"], ["routerLink", "/portal-certificados"], ["aria-hidden", "true", 1, "material-symbols-outlined"], ["aria-hidden", "true", 1, "material-symbols-outlined", "flecha"], [1, "nota-documental"], ["aria-hidden", "true", 1, "material-symbols-outlined", "icono"], [1, "valor"], [1, "sin-dato"]], template: function HomeComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section", 0)(1, "header", 1)(2, "div")(3, "p", 2);
      \u0275\u0275text(4, "GESTI\xD3N MUNICIPAL \xB7 MORALES");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "h1", 3);
      \u0275\u0275text(6, "Bienvenido al Sistema de Certificados Digitales");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "p");
      \u0275\u0275text(8, "Municipalidad Distrital de Morales \u2014 Plataforma de gesti\xF3n, emisi\xF3n y verificaci\xF3n de certificados digitales");
      \u0275\u0275elementEnd();
      \u0275\u0275template(9, HomeComponent_Conditional_9_Template, 4, 2, "p", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "span", 5);
      \u0275\u0275text(11, "account_balance");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(12, "section", 6)(13, "div", 7)(14, "h2", 8);
      \u0275\u0275text(15, "Panorama institucional");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "span");
      \u0275\u0275text(17, "Informaci\xF3n del sistema");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(18, "div", 9);
      \u0275\u0275repeaterCreate(19, HomeComponent_For_20_Template, 9, 5, "article", 10, _forTrack0, false, HomeComponent_ForEmpty_21_Template, 2, 0, "p", 11);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(22, "section", 12)(23, "div", 7)(24, "h2", 13);
      \u0275\u0275text(25, "Accesos r\xE1pidos");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(26, "span");
      \u0275\u0275text(27, "Tu espacio de trabajo");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(28, "nav", 14);
      \u0275\u0275repeaterCreate(29, HomeComponent_For_30_Template, 7, 3, "a", 15, _forTrack1);
      \u0275\u0275elementStart(31, "a", 16)(32, "span", 17);
      \u0275\u0275text(33, "public");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(34, "span");
      \u0275\u0275text(35, "Portal p\xFAblico");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(36, "span", 18);
      \u0275\u0275text(37, "arrow_forward");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(38, "aside", 19)(39, "span", 17);
      \u0275\u0275text(40, "verified_user");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(41, "div")(42, "h2");
      \u0275\u0275text(43, "Gesti\xF3n documental confiable");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(44, "p");
      \u0275\u0275text(45, "Consulta el estado exacto de cada documento en su m\xF3dulo. La preparaci\xF3n, la confirmaci\xF3n administrativa, la firma y la disponibilidad para entrega son etapas diferentes.");
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      let tmp_0_0;
      \u0275\u0275advance(9);
      \u0275\u0275conditional((tmp_0_0 = ctx.auth.usuario()) ? 9 : -1, tmp_0_0);
      \u0275\u0275advance(10);
      \u0275\u0275repeater(ctx.indicadores());
      \u0275\u0275advance(10);
      \u0275\u0275repeater(ctx.accesos());
    }
  }, dependencies: [RouterLink, DecimalPipe], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.dashboard[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 2rem;\n  min-width: 0;\n}\n.bienvenida[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 2rem;\n  padding: clamp(1.5rem, 3vw, 2.5rem);\n  border-radius: var(--radio-lg);\n  background: var(--azul-institucional);\n  color: white;\n  border-bottom: 4px solid var(--dorado-accion);\n}\n.bienvenida[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  color: white;\n  font-size: clamp(1.5rem, 2.5vw, 2rem);\n  line-height: 1.25;\n  margin: 0.75rem 0;\n  max-width: 46rem;\n}\n.bienvenida[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  line-height: 1.7;\n  margin: 0;\n}\n.eyebrow[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  font-weight: 700;\n  letter-spacing: 0.12em;\n  color: #ffe2a0;\n}\n.emblema[_ngcontent-%COMP%] {\n  font-size: 5rem;\n  margin-left: auto;\n  opacity: 0.7;\n}\n.bienvenida[_ngcontent-%COMP%]   .saludo[_ngcontent-%COMP%] {\n  margin-top: 1.25rem;\n  font-weight: 600;\n}\n.saludo[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: inline-block;\n  margin-left: 0.5rem;\n  padding: 0.15rem 0.65rem;\n  border-radius: 2rem;\n  background: rgba(255, 255, 255, 0.1254901961);\n  font-size: 0.75rem;\n}\n.seccion-titulo[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: baseline;\n  justify-content: space-between;\n  gap: 1rem;\n  margin-bottom: 1rem;\n}\nh2[_ngcontent-%COMP%] {\n  font-size: 1.125rem;\n  color: var(--azul-oscuro);\n  margin: 0;\n}\n.seccion-titulo[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  font-size: 0.8125rem;\n  color: var(--neutro-600);\n}\n.indicadores[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 1rem;\n}\n.indicador[_ngcontent-%COMP%] {\n  padding: 1.5rem;\n  border: 1px solid var(--neutro-200);\n  border-radius: var(--radio-lg);\n  box-shadow: var(--sombra-sm);\n  background: white;\n}\n.icono[_ngcontent-%COMP%] {\n  display: inline-flex;\n  padding: 0.75rem;\n  border-radius: 0.75rem;\n  color: var(--azul-institucional);\n  background: var(--color-primario-claro);\n}\n.indicador[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: 0.9375rem;\n  margin: 1rem 0 0.5rem;\n  color: var(--azul-oscuro);\n}\n.indicador[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 0.8125rem;\n  line-height: 1.6;\n  color: var(--neutro-600);\n  margin: 0;\n}\n.indicador[_ngcontent-%COMP%]   .valor[_ngcontent-%COMP%] {\n  font-size: 2.5rem;\n  font-weight: 750;\n  line-height: 1.3;\n  color: var(--azul-oscuro);\n  margin-bottom: 0.5rem;\n  font-variant-numeric: tabular-nums;\n}\n.indicador[_ngcontent-%COMP%]   .sin-dato[_ngcontent-%COMP%] {\n  margin: 0.75rem 0;\n  font-weight: 600;\n}\n.accesos[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 0.75rem;\n}\n.accesos[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  padding: 1.25rem;\n  border: 1px solid var(--neutro-200);\n  border-radius: var(--radio-md);\n  background: white;\n  color: var(--azul-oscuro);\n  text-decoration: none;\n  transition: background 0.15s, border-color 0.15s;\n}\n.accesos[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  border-color: var(--azul-institucional);\n  background: var(--color-primario-claro);\n}\n.accesos[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:focus-visible {\n  outline: 3px solid var(--dorado-accion);\n  outline-offset: 3px;\n}\n.flecha[_ngcontent-%COMP%] {\n  margin-left: auto;\n  font-size: 20px;\n}\n.nota-documental[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 1rem;\n  padding: 1.5rem;\n  border: 1px solid var(--neutro-200);\n  border-left: 4px solid var(--dorado-accion);\n  border-radius: var(--radio-md);\n  background: white;\n}\n.nota-documental[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  color: var(--azul-institucional);\n}\n.nota-documental[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], \n.informacion[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  line-height: 1.7;\n  color: var(--neutro-600);\n}\n.informacion[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n  margin: 0;\n  padding: 1.25rem;\n  border: 1px dashed var(--neutro-400);\n  border-radius: var(--radio-md);\n}\n@media (max-width: 1100px) {\n  .indicadores[_ngcontent-%COMP%], \n   .accesos[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n  .emblema[_ngcontent-%COMP%] {\n    display: none;\n  }\n}\n@media (max-width: 600px) {\n  .indicadores[_ngcontent-%COMP%], \n   .accesos[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .seccion-titulo[_ngcontent-%COMP%] {\n    display: block;\n  }\n  .seccion-titulo[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n    display: block;\n    margin-top: 0.5rem;\n  }\n  .dashboard[_ngcontent-%COMP%] {\n    gap: 1.5rem;\n  }\n}\n/*# sourceMappingURL=home.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(HomeComponent, { className: "HomeComponent", filePath: "src\\app\\pages\\home\\home.component.ts", lineNumber: 19 });
})();

// src/app/pages/en-construccion/en-construccion.component.ts
var EnConstruccionComponent = class _EnConstruccionComponent {
  auth = inject(AuthService);
  route = inject(ActivatedRoute);
  tituloRuta = toSignal(this.route.data.pipe(map((data) => data["titulo"])));
  url = toSignal(this.route.url.pipe(map((segmentos) => "/" + segmentos.map((segmento) => segmento.path).join("/"))));
  titulo = computed(() => this.tituloRuta() ?? this.auth.modulos().find((modulo) => modulo.url === this.url())?.nombre ?? "P\xE1gina no disponible");
  static \u0275fac = function EnConstruccionComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EnConstruccionComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EnConstruccionComponent, selectors: [["app-en-construccion"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 5, vars: 1, consts: [[3, "title"], [1, "card", "aviso"]], template: function EnConstruccionComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section");
      \u0275\u0275element(1, "app-page-title", 0);
      \u0275\u0275elementStart(2, "div", 1)(3, "p");
      \u0275\u0275text(4, "Este m\xF3dulo est\xE1 en construcci\xF3n.");
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275property("title", ctx.titulo());
    }
  }, dependencies: [PageTitleComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.aviso[_ngcontent-%COMP%] {\n  max-width: 40rem;\n  background: var(--neutro-50);\n}\n.aviso[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: var(--neutro-700);\n}\n/*# sourceMappingURL=en-construccion.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EnConstruccionComponent, { className: "EnConstruccionComponent", filePath: "src\\app\\pages\\en-construccion\\en-construccion.component.ts", lineNumber: 20 });
})();

// src/app/core/services/roles/roles.service.ts
var RolesService = class _RolesService {
  http = inject(HttpClient);
  url = `${environment.apiBaseUrl}/roles`;
  listar() {
    return this.http.get(this.url, this.opciones()).pipe(map((respuesta) => respuesta.data), catchError((error) => throwError(() => aErrorApi(error))));
  }
  crear(payload) {
    return this.http.post(this.url, payload, this.opciones()).pipe(catchError((error) => throwError(() => aErrorApi(error))));
  }
  actualizar(id, payload) {
    return this.http.put(`${this.url}/${id}`, payload, this.opciones()).pipe(catchError((error) => throwError(() => aErrorApi(error))));
  }
  cambiarEstado(id, estado) {
    return this.http.patch(`${this.url}/${id}/estado`, { estado }, this.opciones()).pipe(catchError((error) => throwError(() => aErrorApi(error))));
  }
  /** Ids de los módulos asignados al rol. */
  obtenerModulos(id) {
    return this.http.get(`${this.url}/${id}/modulos`, this.opciones()).pipe(map((respuesta) => respuesta.data), catchError((error) => throwError(() => aErrorApi(error))));
  }
  /** Reemplaza los módulos del rol; los quitados pierden también sus permisos. */
  actualizarModulos(id, modulos) {
    return this.http.put(`${this.url}/${id}/modulos`, { modulos }, this.opciones()).pipe(map((respuesta) => respuesta.data), catchError((error) => throwError(() => aErrorApi(error))));
  }
  obtenerPermisos(id) {
    return this.http.get(`${this.url}/${id}/permisos`, this.opciones()).pipe(map((respuesta) => respuesta.data), catchError((error) => throwError(() => aErrorApi(error))));
  }
  /** Reemplaza los permisos del rol. Cada permiso debe ser de un módulo ya asignado (si no, 422). */
  actualizarPermisos(id, permisos) {
    return this.http.put(`${this.url}/${id}/permisos`, { permisos }, this.opciones()).pipe(map((respuesta) => respuesta.data), catchError((error) => throwError(() => aErrorApi(error))));
  }
  opciones() {
    return { context: new HttpContext().set(AUTHENTICATED_REQUEST, true) };
  }
  static \u0275fac = function RolesService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RolesService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _RolesService, factory: _RolesService.\u0275fac, providedIn: "root" });
};

// src/app/core/services/usuarios/usuarios.service.ts
var UsuariosService = class _UsuariosService {
  http = inject(HttpClient);
  url = `${environment.apiBaseUrl}/usuarios`;
  listar(filtros) {
    let params = new HttpParams();
    if (filtros.search)
      params = params.set("search", filtros.search);
    if (filtros.idRol !== void 0)
      params = params.set("idRol", filtros.idRol);
    if (filtros.estado !== void 0)
      params = params.set("estado", filtros.estado);
    if (filtros.page !== void 0)
      params = params.set("page", filtros.page);
    return this.http.get(this.url, __spreadProps(__spreadValues({}, this.opciones()), { params })).pipe(catchError((error) => throwError(() => aErrorApi(error))));
  }
  obtener(id) {
    return this.http.get(`${this.url}/${id}`, this.opciones()).pipe(map((respuesta) => respuesta.data), catchError((error) => throwError(() => aErrorApi(error))));
  }
  crear(payload) {
    return this.http.post(this.url, payload, this.opciones()).pipe(catchError((error) => throwError(() => aErrorApi(error))));
  }
  actualizar(id, payload) {
    return this.http.put(`${this.url}/${id}`, payload, this.opciones()).pipe(catchError((error) => throwError(() => aErrorApi(error))));
  }
  cambiarEstado(id, estado) {
    return this.http.patch(`${this.url}/${id}/estado`, { estado }, this.opciones()).pipe(catchError((error) => throwError(() => aErrorApi(error))));
  }
  desbloquear(id) {
    return this.http.patch(`${this.url}/${id}/desbloquear`, null, this.opciones()).pipe(catchError((error) => throwError(() => aErrorApi(error))));
  }
  /** Envía al correo del usuario un enlace para crear o restablecer su contraseña. */
  restablecerPassword(id) {
    return this.http.post(`${this.url}/${id}/restablecer-password`, null, this.opciones()).pipe(catchError((error) => throwError(() => aErrorApi(error))));
  }
  opciones() {
    return { context: new HttpContext().set(AUTHENTICATED_REQUEST, true) };
  }
  static \u0275fac = function UsuariosService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UsuariosService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _UsuariosService, factory: _UsuariosService.\u0275fac, providedIn: "root" });
};

// src/app/pages/seguridad/usuarios/listar-usuarios/listar-usuarios.component.ts
var _forTrack02 = ($index, $item) => $item.id;
var _c02 = () => [1, 2, 3, 4];
var _c1 = (a0) => ({ $implicit: a0 });
var _c2 = (a0) => ({ $implicit: a0, conTexto: false });
var _c3 = (a0) => ({ $implicit: a0, conTexto: true });
var _c4 = (a0) => ["/usuarios", a0, "editar"];
function ListarUsuariosComponent_a_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 25)(1, "span", 26);
    \u0275\u0275text(2, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Nuevo usuario ");
    \u0275\u0275elementEnd();
  }
}
function ListarUsuariosComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 27)(1, "span", 26);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const aviso_r2 = ctx;
    \u0275\u0275classProp("alert-exito", aviso_r2.tipo === "exito")("alert-error", aviso_r2.tipo === "error")("alert-advertencia", aviso_r2.tipo === "advertencia");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(aviso_r2.tipo === "exito" ? "check_circle" : "error");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(aviso_r2.texto);
  }
}
function ListarUsuariosComponent_For_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 16);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const rol_r3 = ctx.$implicit;
    \u0275\u0275property("value", rol_r3.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(rol_r3.nombre);
  }
}
function ListarUsuariosComponent_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22)(1, "span", 26);
    \u0275\u0275text(2, "error");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("No se pudo cargar la lista de usuarios. ", ctx, "");
  }
}
function ListarUsuariosComponent_Conditional_31_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span");
  }
}
function ListarUsuariosComponent_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 28);
    \u0275\u0275text(1, "Cargando usuarios\u2026");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 29);
    \u0275\u0275repeaterCreate(3, ListarUsuariosComponent_Conditional_31_For_4_Template, 1, 0, "span", null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275repeater(\u0275\u0275pureFunction0(0, _c02));
  }
}
function ListarUsuariosComponent_Conditional_32_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 31);
    \u0275\u0275listener("click", function ListarUsuariosComponent_Conditional_32_Conditional_3_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r4 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r4.limpiarFiltros());
    });
    \u0275\u0275text(1, "Limpiar filtros");
    \u0275\u0275elementEnd();
  }
}
function ListarUsuariosComponent_Conditional_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 23)(1, "p");
    \u0275\u0275text(2, "No hay usuarios con esos filtros.");
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, ListarUsuariosComponent_Conditional_32_Conditional_3_Template, 2, 0, "button", 30);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r4.hayFiltros() ? 3 : -1);
  }
}
function ListarUsuariosComponent_Conditional_33_th_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 37)(1, "span", 34);
    \u0275\u0275text(2, "Acciones");
    \u0275\u0275elementEnd()();
  }
}
function ListarUsuariosComponent_Conditional_33_For_23_ng_container_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function ListarUsuariosComponent_Conditional_33_For_23_td_16_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function ListarUsuariosComponent_Conditional_33_For_23_td_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 47);
    \u0275\u0275template(1, ListarUsuariosComponent_Conditional_33_For_23_td_16_ng_container_1_Template, 1, 0, "ng-container", 48);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const usuario_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275nextContext(2);
    const acciones_r7 = \u0275\u0275reference(37);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", acciones_r7)("ngTemplateOutletContext", \u0275\u0275pureFunction1(2, _c2, usuario_r6));
  }
}
function ListarUsuariosComponent_Conditional_33_For_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 43);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 44);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 45);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 46);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td", 47);
    \u0275\u0275template(12, ListarUsuariosComponent_Conditional_33_For_23_ng_container_12_Template, 1, 0, "ng-container", 48);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td", 45);
    \u0275\u0275text(14);
    \u0275\u0275pipe(15, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275template(16, ListarUsuariosComponent_Conditional_33_For_23_td_16_Template, 2, 4, "td", 49);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_15_0;
    let tmp_19_0;
    const usuario_r6 = ctx.$implicit;
    const \u0275$index_137_r8 = ctx.$index;
    const ctx_r4 = \u0275\u0275nextContext(2);
    const estado_r9 = \u0275\u0275reference(35);
    \u0275\u0275classProp("registro-inactivo", !usuario_r6.estado);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((((tmp_15_0 = (tmp_15_0 = ctx_r4.meta()) == null ? null : tmp_15_0.page) !== null && tmp_15_0 !== void 0 ? tmp_15_0 : 1) - 1) * ((tmp_15_0 = (tmp_15_0 = ctx_r4.meta()) == null ? null : tmp_15_0.perPage) !== null && tmp_15_0 !== void 0 ? tmp_15_0 : 0) + \u0275$index_137_r8 + 1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(usuario_r6.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(usuario_r6.dni);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(usuario_r6.correo);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((tmp_19_0 = usuario_r6.rol == null ? null : usuario_r6.rol.nombre) !== null && tmp_19_0 !== void 0 ? tmp_19_0 : "Sin rol");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngTemplateOutlet", estado_r9)("ngTemplateOutletContext", \u0275\u0275pureFunction1(15, _c1, usuario_r6));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", usuario_r6.ultimoAcceso ? \u0275\u0275pipeBind3(15, 11, usuario_r6.ultimoAcceso, "dd/MM/yyyy HH:mm", ctx_r4.zonaLima) : "Nunca", " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("appHasPermission", "usuarios.editar");
  }
}
function ListarUsuariosComponent_Conditional_33_For_26_ng_container_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function ListarUsuariosComponent_Conditional_33_For_26_ng_container_24_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function ListarUsuariosComponent_Conditional_33_For_26_ng_container_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275template(1, ListarUsuariosComponent_Conditional_33_For_26_ng_container_24_ng_container_1_Template, 1, 0, "ng-container", 48);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const usuario_r10 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275nextContext(2);
    const acciones_r7 = \u0275\u0275reference(37);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", acciones_r7)("ngTemplateOutletContext", \u0275\u0275pureFunction1(2, _c3, usuario_r10));
  }
}
function ListarUsuariosComponent_Conditional_33_For_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 50)(1, "div", 51)(2, "span", 44);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275template(4, ListarUsuariosComponent_Conditional_33_For_26_ng_container_4_Template, 1, 0, "ng-container", 48);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 52);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "dl", 53)(8, "div")(9, "dt");
    \u0275\u0275text(10, "DNI");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "dd", 45);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div")(14, "dt");
    \u0275\u0275text(15, "Rol");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "dd");
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "div")(19, "dt");
    \u0275\u0275text(20, "\xDAltimo acceso");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "dd", 45);
    \u0275\u0275text(22);
    \u0275\u0275pipe(23, "date");
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(24, ListarUsuariosComponent_Conditional_33_For_26_ng_container_24_Template, 2, 4, "ng-container", 54);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_19_0;
    const usuario_r10 = ctx.$implicit;
    const ctx_r4 = \u0275\u0275nextContext(2);
    const estado_r9 = \u0275\u0275reference(35);
    \u0275\u0275classProp("registro-inactivo", !usuario_r10.estado);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(usuario_r10.nombre);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", estado_r9)("ngTemplateOutletContext", \u0275\u0275pureFunction1(14, _c1, usuario_r10));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(usuario_r10.correo);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(usuario_r10.dni);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate((tmp_19_0 = usuario_r10.rol == null ? null : usuario_r10.rol.nombre) !== null && tmp_19_0 !== void 0 ? tmp_19_0 : "Sin rol");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", usuario_r10.ultimoAcceso ? \u0275\u0275pipeBind3(23, 10, usuario_r10.ultimoAcceso, "dd/MM/yyyy HH:mm", ctx_r4.zonaLima) : "Nunca", " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("appHasPermission", "usuarios.editar");
  }
}
function ListarUsuariosComponent_Conditional_33_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "nav", 42)(1, "p", 45);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 55)(4, "button", 56);
    \u0275\u0275listener("click", function ListarUsuariosComponent_Conditional_33_Conditional_27_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r4 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r4.irAPagina(ctx_r4.meta().page - 1));
    });
    \u0275\u0275elementStart(5, "span", 26);
    \u0275\u0275text(6, "chevron_left");
    \u0275\u0275elementEnd();
    \u0275\u0275text(7, " Anterior ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "button", 56);
    \u0275\u0275listener("click", function ListarUsuariosComponent_Conditional_33_Conditional_27_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r4 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r4.irAPagina(ctx_r4.meta().page + 1));
    });
    \u0275\u0275text(9, " Siguiente ");
    \u0275\u0275elementStart(10, "span", 26);
    \u0275\u0275text(11, "chevron_right");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const rango_r12 = ctx;
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate3("", rango_r12.desde, "\u2013", rango_r12.hasta, " de ", rango_r12.total, "");
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !ctx_r4.hayAnterior() || ctx_r4.cargando());
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", !ctx_r4.haySiguiente() || ctx_r4.cargando());
  }
}
function ListarUsuariosComponent_Conditional_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 32)(1, "table", 33)(2, "caption", 34);
    \u0275\u0275text(3, "Usuarios del sistema");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "thead")(5, "tr")(6, "th", 35);
    \u0275\u0275text(7, "N.\xBA");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 36);
    \u0275\u0275text(9, "Nombre");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 36);
    \u0275\u0275text(11, "DNI");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 36);
    \u0275\u0275text(13, "Correo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th", 36);
    \u0275\u0275text(15, "Rol");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th", 37);
    \u0275\u0275text(17, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "th", 36);
    \u0275\u0275text(19, "\xDAltimo acceso");
    \u0275\u0275elementEnd();
    \u0275\u0275template(20, ListarUsuariosComponent_Conditional_33_th_20_Template, 3, 0, "th", 38);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "tbody");
    \u0275\u0275repeaterCreate(22, ListarUsuariosComponent_Conditional_33_For_23_Template, 17, 17, "tr", 39, _forTrack02);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(24, "ul", 40);
    \u0275\u0275repeaterCreate(25, ListarUsuariosComponent_Conditional_33_For_26_Template, 25, 16, "li", 41, _forTrack02);
    \u0275\u0275elementEnd();
    \u0275\u0275template(27, ListarUsuariosComponent_Conditional_33_Conditional_27_Template, 12, 5, "nav", 42);
  }
  if (rf & 2) {
    let tmp_6_0;
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance(20);
    \u0275\u0275property("appHasPermission", "usuarios.editar");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r4.usuarios());
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r4.usuarios());
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_6_0 = ctx_r4.rango()) ? 27 : -1, tmp_6_0);
  }
}
function ListarUsuariosComponent_ng_template_34_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 59);
    \u0275\u0275text(1, "Bloqueado");
    \u0275\u0275elementEnd();
  }
}
function ListarUsuariosComponent_ng_template_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 57)(1, "span", 58);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, ListarUsuariosComponent_ng_template_34_Conditional_3_Template, 2, 0, "span", 59);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const usuario_r13 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275classProp("badge-exito", usuario_r13.estado);
    \u0275\u0275attribute("data-estado", usuario_r13.estado ? "Activo" : "Inactivo");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(usuario_r13.estado ? "Activo" : "Inactivo");
    \u0275\u0275advance();
    \u0275\u0275conditional(usuario_r13.bloqueado ? 3 : -1);
  }
}
function ListarUsuariosComponent_ng_template_36_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Editar ");
  }
}
function ListarUsuariosComponent_ng_template_36_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const usuario_r15 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275textInterpolate1(" ", usuario_r15.estado ? "Desactivar" : "Activar", " ");
  }
}
function ListarUsuariosComponent_ng_template_36_Conditional_9_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Desbloquear ");
  }
}
function ListarUsuariosComponent_ng_template_36_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 56);
    \u0275\u0275listener("click", function ListarUsuariosComponent_ng_template_36_Conditional_9_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r16);
      const usuario_r15 = \u0275\u0275nextContext().$implicit;
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.desbloquear(usuario_r15));
    });
    \u0275\u0275elementStart(1, "span", 26);
    \u0275\u0275text(2, "lock_open");
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, ListarUsuariosComponent_ng_template_36_Conditional_9_Conditional_3_Template, 1, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r16 = \u0275\u0275nextContext();
    const usuario_r15 = ctx_r16.$implicit;
    const conTexto_r18 = ctx_r16.conTexto;
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275classProp("btn-icono", !conTexto_r18)("btn-sin-borde", !conTexto_r18);
    \u0275\u0275property("disabled", ctx_r4.procesando() === usuario_r15.id);
    \u0275\u0275attribute("aria-label", conTexto_r18 ? null : "Desbloquear a " + usuario_r15.nombre)("title", conTexto_r18 ? null : "Desbloquear");
    \u0275\u0275advance(3);
    \u0275\u0275conditional(conTexto_r18 ? 3 : -1);
  }
}
function ListarUsuariosComponent_ng_template_36_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Reenviar enlace ");
  }
}
function ListarUsuariosComponent_ng_template_36_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 60)(1, "a", 61)(2, "span", 26);
    \u0275\u0275text(3, "edit");
    \u0275\u0275elementEnd();
    \u0275\u0275template(4, ListarUsuariosComponent_ng_template_36_Conditional_4_Template, 1, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 56);
    \u0275\u0275listener("click", function ListarUsuariosComponent_ng_template_36_Template_button_click_5_listener() {
      const usuario_r15 = \u0275\u0275restoreView(_r14).$implicit;
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.pedirCambioEstado(usuario_r15));
    });
    \u0275\u0275elementStart(6, "span", 26);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275template(8, ListarUsuariosComponent_ng_template_36_Conditional_8_Template, 1, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275template(9, ListarUsuariosComponent_ng_template_36_Conditional_9_Template, 4, 8, "button", 62);
    \u0275\u0275elementStart(10, "button", 56);
    \u0275\u0275listener("click", function ListarUsuariosComponent_ng_template_36_Template_button_click_10_listener() {
      const usuario_r15 = \u0275\u0275restoreView(_r14).$implicit;
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.reenviarEnlace(usuario_r15));
    });
    \u0275\u0275elementStart(11, "span", 26);
    \u0275\u0275text(12, "forward_to_inbox");
    \u0275\u0275elementEnd();
    \u0275\u0275template(13, ListarUsuariosComponent_ng_template_36_Conditional_13_Template, 1, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const usuario_r15 = ctx.$implicit;
    const conTexto_r18 = ctx.conTexto;
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275classProp("acciones-con-texto", conTexto_r18);
    \u0275\u0275advance();
    \u0275\u0275classProp("btn-icono", !conTexto_r18)("btn-sin-borde", !conTexto_r18);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(28, _c4, usuario_r15.id));
    \u0275\u0275attribute("aria-label", conTexto_r18 ? null : "Editar a " + usuario_r15.nombre)("title", conTexto_r18 ? null : "Editar");
    \u0275\u0275advance(3);
    \u0275\u0275conditional(conTexto_r18 ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275classProp("btn-icono", !conTexto_r18)("btn-sin-borde", !conTexto_r18);
    \u0275\u0275property("disabled", ctx_r4.procesando() === usuario_r15.id);
    \u0275\u0275attribute("aria-label", conTexto_r18 ? null : (usuario_r15.estado ? "Desactivar a " : "Activar a ") + usuario_r15.nombre)("title", conTexto_r18 ? null : usuario_r15.estado ? "Desactivar" : "Activar");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(usuario_r15.estado ? "person_off" : "how_to_reg");
    \u0275\u0275advance();
    \u0275\u0275conditional(conTexto_r18 ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(usuario_r15.bloqueado ? 9 : -1);
    \u0275\u0275advance();
    \u0275\u0275classProp("btn-icono", !conTexto_r18)("btn-sin-borde", !conTexto_r18);
    \u0275\u0275property("disabled", ctx_r4.procesando() === usuario_r15.id);
    \u0275\u0275attribute("aria-label", conTexto_r18 ? null : "Reenviar enlace de contrase\xF1a a " + usuario_r15.nombre)("title", conTexto_r18 ? null : "Reenviar enlace de contrase\xF1a");
    \u0275\u0275advance(3);
    \u0275\u0275conditional(conTexto_r18 ? 13 : -1);
  }
}
var ESPERA_BUSQUEDA_MS = 350;
var MENSAJE_429 = "Ya se envi\xF3 un enlace hace menos de un minuto. Espera un momento antes de reenviarlo.";
var ListarUsuariosComponent = class _ListarUsuariosComponent {
  usuariosService = inject(UsuariosService);
  rolesService = inject(RolesService);
  destroyRef = inject(DestroyRef);
  consultas = new Subject();
  confirmacion = viewChild.required(DialogoConfirmacionComponent);
  zonaLima = ZONA_HORARIA_LIMA;
  filtros = inject(NonNullableFormBuilder).group({ search: "", idRol: "", estado: "" });
  roles = signal([]);
  usuarios = signal([]);
  meta = signal(null);
  cargando = signal(true);
  errorCarga = signal(null);
  aviso = signal(null);
  procesando = signal(null);
  porConfirmar = signal(null);
  activarConfirmacion = computed(() => this.porConfirmar()?.estado === false);
  pagina = signal(1);
  rango = computed(() => {
    const meta = this.meta();
    if (!meta || meta.total === 0)
      return null;
    const desde = (meta.page - 1) * meta.perPage + 1;
    return { desde, hasta: Math.min(meta.page * meta.perPage, meta.total), total: meta.total };
  });
  hayAnterior = computed(() => (this.meta()?.page ?? 1) > 1);
  haySiguiente = computed(() => {
    const meta = this.meta();
    return !!meta && meta.page * meta.perPage < meta.total;
  });
  hayFiltros = signal(false);
  constructor() {
    const aviso = inject(Router).getCurrentNavigation()?.extras.state?.["aviso"];
    this.aviso.set(aviso ?? null);
    afterNextRender(() => {
      this.rolesService.listar().subscribe({
        next: (roles) => this.roles.set(roles.filter((rol) => rol.estado))
      });
      this.consultas.pipe(switchMap((filtros) => this.consultar(filtros)), takeUntilDestroyed(this.destroyRef)).subscribe((resultado) => {
        this.cargando.set(false);
        if (resultado.ok) {
          this.usuarios.set(resultado.usuarios);
          this.meta.set(resultado.meta);
          this.errorCarga.set(null);
        } else {
          this.errorCarga.set(resultado.mensaje);
        }
      });
      const { search, idRol, estado } = this.filtros.controls;
      merge(search.valueChanges.pipe(debounceTime(ESPERA_BUSQUEDA_MS), map((valor) => valor.trim()), distinctUntilChanged()), idRol.valueChanges, estado.valueChanges).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.irAPagina(1));
      this.cargar();
    });
  }
  irAPagina(pagina) {
    this.pagina.set(pagina);
    this.cargar();
  }
  limpiarFiltros() {
    this.filtros.reset({ search: "", idRol: "", estado: "" }, { emitEvent: false });
    this.irAPagina(1);
  }
  pedirCambioEstado(usuario) {
    return __async(this, null, function* () {
      this.porConfirmar.set(usuario);
      if (!(yield this.confirmacion().abrir()))
        return;
      const activar = !usuario.estado;
      this.ejecutar(usuario, this.usuariosService.cambiarEstado(usuario.id, activar), `${usuario.nombre} fue ${activar ? "activado" : "desactivado"}.`);
    });
  }
  desbloquear(usuario) {
    this.ejecutar(usuario, this.usuariosService.desbloquear(usuario.id), `${usuario.nombre} fue desbloqueado.`);
  }
  reenviarEnlace(usuario) {
    this.ejecutar(usuario, this.usuariosService.restablecerPassword(usuario.id), `Se envi\xF3 a ${usuario.correo} un enlace para crear su contrase\xF1a.`);
  }
  ejecutar(usuario, accion, exito) {
    this.procesando.set(usuario.id);
    this.aviso.set(null);
    accion.subscribe({
      next: () => {
        this.procesando.set(null);
        this.aviso.set({ tipo: "exito", texto: exito });
        this.cargar();
      },
      error: (error) => {
        this.procesando.set(null);
        this.aviso.set(error.status === 429 ? { tipo: "advertencia", texto: MENSAJE_429 } : { tipo: "error", texto: error.mensaje });
      }
    });
  }
  cargar() {
    const { search, idRol, estado } = this.filtros.getRawValue();
    const filtros = {
      search: search.trim() || void 0,
      idRol: idRol ? Number(idRol) : void 0,
      estado: estado ? estado === "true" : void 0,
      page: this.pagina()
    };
    this.hayFiltros.set(!!(filtros.search || filtros.idRol || filtros.estado !== void 0));
    this.cargando.set(true);
    this.consultas.next(filtros);
  }
  consultar(filtros) {
    return this.usuariosService.listar(filtros).pipe(map((respuesta) => ({ ok: true, usuarios: respuesta.data, meta: respuesta.meta })), catchError((error) => of({ ok: false, mensaje: error.mensaje })));
  }
  static \u0275fac = function ListarUsuariosComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ListarUsuariosComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ListarUsuariosComponent, selectors: [["app-listar-usuarios"]], viewQuery: function ListarUsuariosComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuerySignal(ctx.confirmacion, DialogoConfirmacionComponent, 5);
    }
    if (rf & 2) {
      \u0275\u0275queryAdvance();
    }
  }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 39, vars: 8, consts: [["estado", ""], ["acciones", ""], [1, "usuarios"], [1, "encabezado"], ["title", "Gesti\xF3n de Usuarios"], ["routerLink", "/usuarios/nuevo", "class", "btn btn-primary", 4, "appHasPermission"], ["role", "status"], [1, "alert", 3, "alert-exito", "alert-error", "alert-advertencia"], ["role", "search", "aria-label", "Filtrar usuarios", 1, "filtros", 3, "submit", "formGroup"], [1, "form-field", "buscar"], ["for", "buscar-usuarios"], ["id", "buscar-usuarios", "type", "search", "formControlName", "search", "placeholder", "Nombre, DNI o correo", "autocomplete", "off", 1, "input"], [1, "form-field"], ["for", "filtro-rol"], ["id", "filtro-rol", "formControlName", "idRol", 1, "input"], ["value", ""], [3, "value"], ["for", "filtro-estado"], ["id", "filtro-estado", "formControlName", "estado", 1, "input"], ["value", "true"], ["value", "false"], [1, "resultados"], ["role", "alert", 1, "alert", "alert-error"], [1, "card", "estado-vacio"], [3, "titulo", "texto", "confirmar"], ["routerLink", "/usuarios/nuevo", 1, "btn", "btn-primary"], ["aria-hidden", "true", 1, "material-symbols-outlined"], [1, "alert"], ["role", "status", 1, "sr-only"], ["aria-hidden", "true", 1, "esqueleto"], ["type", "button", 1, "btn", "btn-neutro"], ["type", "button", 1, "btn", "btn-neutro", 3, "click"], [1, "tabla-caja"], [1, "table"], [1, "sr-only"], ["scope", "col", 1, "col-centro", "col-numero"], ["scope", "col"], ["scope", "col", 1, "col-centro"], ["scope", "col", "class", "col-centro", 4, "appHasPermission"], [3, "registro-inactivo"], ["aria-label", "Usuarios del sistema", 1, "tarjetas"], [1, "tarjeta", 3, "registro-inactivo"], ["aria-label", "Paginaci\xF3n de usuarios", 1, "paginacion"], ["data-label", "N.\xBA", 1, "col-centro", "col-numero"], [1, "nombre"], [1, "dato"], [1, "correo"], [1, "col-centro"], [4, "ngTemplateOutlet", "ngTemplateOutletContext"], ["class", "col-centro", 4, "appHasPermission"], [1, "tarjeta"], [1, "tarjeta-cabecera"], [1, "tarjeta-correo", "correo"], [1, "tarjeta-datos"], [4, "appHasPermission"], [1, "paginacion-botones"], ["type", "button", 1, "btn", 3, "click", "disabled"], [1, "badges"], [1, "badge"], [1, "badge", "badge-advertencia"], [1, "acciones"], [1, "btn", 3, "routerLink"], ["type", "button", 1, "btn", 3, "btn-icono", "btn-sin-borde", "disabled"]], template: function ListarUsuariosComponent_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "section", 2)(1, "div", 3);
      \u0275\u0275element(2, "app-page-title", 4);
      \u0275\u0275template(3, ListarUsuariosComponent_a_3_Template, 4, 0, "a", 5);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "div", 6);
      \u0275\u0275template(5, ListarUsuariosComponent_Conditional_5_Template, 5, 8, "div", 7);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "form", 8);
      \u0275\u0275listener("submit", function ListarUsuariosComponent_Template_form_submit_6_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView($event.preventDefault());
      });
      \u0275\u0275elementStart(7, "div", 9)(8, "label", 10);
      \u0275\u0275text(9, "Buscar");
      \u0275\u0275elementEnd();
      \u0275\u0275element(10, "input", 11);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "div", 12)(12, "label", 13);
      \u0275\u0275text(13, "Rol");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "select", 14)(15, "option", 15);
      \u0275\u0275text(16, "Todos los roles");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(17, ListarUsuariosComponent_For_18_Template, 2, 2, "option", 16, _forTrack02);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(19, "div", 12)(20, "label", 17);
      \u0275\u0275text(21, "Estado");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "select", 18)(23, "option", 15);
      \u0275\u0275text(24, "Todos");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "option", 19);
      \u0275\u0275text(26, "Activos");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(27, "option", 20);
      \u0275\u0275text(28, "Inactivos");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(29, "div", 21);
      \u0275\u0275template(30, ListarUsuariosComponent_Conditional_30_Template, 5, 1, "div", 22)(31, ListarUsuariosComponent_Conditional_31_Template, 5, 1)(32, ListarUsuariosComponent_Conditional_32_Template, 4, 1, "div", 23)(33, ListarUsuariosComponent_Conditional_33_Template, 28, 2);
      \u0275\u0275elementEnd()();
      \u0275\u0275template(34, ListarUsuariosComponent_ng_template_34_Template, 4, 5, "ng-template", null, 0, \u0275\u0275templateRefExtractor)(36, ListarUsuariosComponent_ng_template_36_Template, 14, 30, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
      \u0275\u0275element(38, "app-dialogo-confirmacion", 24);
    }
    if (rf & 2) {
      let tmp_3_0;
      let tmp_7_0;
      let tmp_8_0;
      \u0275\u0275advance(3);
      \u0275\u0275property("appHasPermission", "usuarios.crear");
      \u0275\u0275advance(2);
      \u0275\u0275conditional((tmp_3_0 = ctx.aviso()) ? 5 : -1, tmp_3_0);
      \u0275\u0275advance();
      \u0275\u0275property("formGroup", ctx.filtros);
      \u0275\u0275advance(11);
      \u0275\u0275repeater(ctx.roles());
      \u0275\u0275advance(12);
      \u0275\u0275attribute("aria-busy", ctx.cargando());
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_7_0 = ctx.errorCarga()) ? 30 : ctx.cargando() && !ctx.usuarios().length ? 31 : !ctx.usuarios().length ? 32 : 33, tmp_7_0);
      \u0275\u0275advance(8);
      \u0275\u0275property("titulo", (ctx.activarConfirmacion() ? "Activar" : "Desactivar") + " a " + ((tmp_8_0 = (tmp_8_0 = ctx.porConfirmar()) == null ? null : tmp_8_0.nombre) !== null && tmp_8_0 !== void 0 ? tmp_8_0 : ""))("texto", ctx.activarConfirmacion() ? "Podr\xE1 volver a iniciar sesi\xF3n con su correo y su contrase\xF1a." : "No podr\xE1 iniciar sesi\xF3n hasta que su cuenta se vuelva a activar.")("confirmar", ctx.activarConfirmacion() ? "Activar" : "Desactivar");
    }
  }, dependencies: [DatePipe, NgTemplateOutlet, ReactiveFormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, RouterLink, PageTitleComponent, HasPermissionDirective, DialogoConfirmacionComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.encabezado[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: baseline;\n  justify-content: space-between;\n  gap: 0 var(--espacio-4);\n  margin-bottom: var(--espacio-2);\n}\n.filtros[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(16rem, 24rem) repeat(2, minmax(10rem, 13rem));\n  gap: var(--espacio-4);\n  margin-bottom: var(--espacio-2);\n}\n.tabla-caja[_ngcontent-%COMP%] {\n  overflow-x: auto;\n  border: 1px solid var(--neutro-200);\n  border-radius: var(--radio-lg);\n}\n.tabla-caja[_ngcontent-%COMP%]   .table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]:first-child, \n.tabla-caja[_ngcontent-%COMP%]   .table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:first-child {\n  padding-left: var(--espacio-4);\n}\n.tabla-caja[_ngcontent-%COMP%]   .table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:last-child {\n  padding-right: var(--espacio-2);\n}\n.nombre[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\ntr.registro-inactivo[_ngcontent-%COMP%]   .nombre[_ngcontent-%COMP%], \n.tarjeta.registro-inactivo[_ngcontent-%COMP%]   .nombre[_ngcontent-%COMP%] {\n  font-weight: 500;\n}\n.correo[_ngcontent-%COMP%] {\n  overflow-wrap: anywhere;\n}\n.badges[_ngcontent-%COMP%] {\n  display: inline-flex;\n  flex-wrap: wrap;\n  gap: var(--espacio-1);\n}\n.acciones[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  gap: 2px;\n}\n.acciones-con-texto[_ngcontent-%COMP%] {\n  flex-wrap: wrap;\n  justify-content: flex-start;\n  gap: var(--espacio-2);\n  margin-top: var(--espacio-3);\n}\n.tarjetas[_ngcontent-%COMP%] {\n  display: none;\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n.tarjeta[_ngcontent-%COMP%] {\n  padding: var(--espacio-4) 0;\n  border-bottom: 1px solid var(--neutro-200);\n}\n.tarjeta-cabecera[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: space-between;\n  gap: var(--espacio-2);\n}\n.tarjeta-correo[_ngcontent-%COMP%] {\n  margin: var(--espacio-1) 0 0;\n  color: var(--neutro-500);\n}\n.tarjeta-datos[_ngcontent-%COMP%] {\n  display: grid;\n  gap: var(--espacio-1);\n  margin: var(--espacio-2) 0 0;\n}\n.tarjeta-datos[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 7.5rem 1fr;\n  gap: var(--espacio-2);\n}\n.tarjeta-datos[_ngcontent-%COMP%]   dt[_ngcontent-%COMP%] {\n  color: var(--neutro-500);\n}\n.tarjeta-datos[_ngcontent-%COMP%]   dd[_ngcontent-%COMP%] {\n  margin: 0;\n}\n@media (max-width: 768px) {\n  .encabezado[_ngcontent-%COMP%] {\n    margin-bottom: var(--espacio-5);\n  }\n  .filtros[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr 1fr;\n  }\n  .filtros[_ngcontent-%COMP%]   .buscar[_ngcontent-%COMP%] {\n    grid-column: 1/-1;\n  }\n  .tabla-caja[_ngcontent-%COMP%] {\n    display: none;\n  }\n  .tarjetas[_ngcontent-%COMP%] {\n    display: block;\n  }\n}\n/*# sourceMappingURL=listar-usuarios.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ListarUsuariosComponent, { className: "ListarUsuariosComponent", filePath: "src\\app\\pages\\seguridad\\usuarios\\listar-usuarios\\listar-usuarios.component.ts", lineNumber: 37 });
})();

// src/app/pages/seguridad/usuarios/formulario-usuario/formulario-usuario.component.ts
var _forTrack03 = ($index, $item) => $item.id;
function FormularioUsuarioComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 2);
    \u0275\u0275text(1, "Cargando usuario\u2026");
    \u0275\u0275elementEnd();
  }
}
function FormularioUsuarioComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3)(1, "span", 4);
    \u0275\u0275text(2, "error");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "a", 5);
    \u0275\u0275text(6, "Volver a usuarios");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.errorCarga());
  }
}
function FormularioUsuarioComponent_Conditional_4_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7)(1, "span", 4);
    \u0275\u0275text(2, "error");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx);
  }
}
function FormularioUsuarioComponent_Conditional_4_Conditional_3_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dl", 23)(1, "div")(2, "dt");
    \u0275\u0275text(3, "Nombre");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "dd");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div")(7, "dt");
    \u0275\u0275text(8, "DNI");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "dd", 24);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const usuario_r3 = ctx;
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(usuario_r3.nombre);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(usuario_r3.dni);
  }
}
function FormularioUsuarioComponent_Conditional_4_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, FormularioUsuarioComponent_Conditional_4_Conditional_3_Conditional_0_Template, 11, 2, "dl", 23);
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional((tmp_2_0 = ctx_r0.usuario()) ? 0 : -1, tmp_2_0);
  }
}
function FormularioUsuarioComponent_Conditional_4_Conditional_4_Conditional_8_Template(rf, ctx) {
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
function FormularioUsuarioComponent_Conditional_4_Conditional_4_Conditional_14_Template(rf, ctx) {
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
function FormularioUsuarioComponent_Conditional_4_Conditional_4_Conditional_21_Template(rf, ctx) {
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
function FormularioUsuarioComponent_Conditional_4_Conditional_4_Conditional_29_Template(rf, ctx) {
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
function FormularioUsuarioComponent_Conditional_4_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "fieldset")(1, "legend");
    \u0275\u0275text(2, "Persona");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 25)(4, "label", 26);
    \u0275\u0275text(5, "DNI");
    \u0275\u0275elementEnd();
    \u0275\u0275element(6, "input", 27);
    \u0275\u0275elementStart(7, "div", 28);
    \u0275\u0275template(8, FormularioUsuarioComponent_Conditional_4_Conditional_4_Conditional_8_Template, 2, 1, "p", 14);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 10)(10, "label", 29);
    \u0275\u0275text(11, "Nombres");
    \u0275\u0275elementEnd();
    \u0275\u0275element(12, "input", 30);
    \u0275\u0275elementStart(13, "div", 31);
    \u0275\u0275template(14, FormularioUsuarioComponent_Conditional_4_Conditional_4_Conditional_14_Template, 2, 1, "p", 14);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "div", 9)(16, "div", 10)(17, "label", 32);
    \u0275\u0275text(18, "Apellido paterno");
    \u0275\u0275elementEnd();
    \u0275\u0275element(19, "input", 33);
    \u0275\u0275elementStart(20, "div", 34);
    \u0275\u0275template(21, FormularioUsuarioComponent_Conditional_4_Conditional_4_Conditional_21_Template, 2, 1, "p", 14);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "div", 10)(23, "label", 35);
    \u0275\u0275text(24, "Apellido materno ");
    \u0275\u0275elementStart(25, "span", 36);
    \u0275\u0275text(26, "(opcional)");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(27, "input", 37);
    \u0275\u0275elementStart(28, "div", 38);
    \u0275\u0275template(29, FormularioUsuarioComponent_Conditional_4_Conditional_4_Conditional_29_Template, 2, 1, "p", 14);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(30, "p", 39);
    \u0275\u0275text(31, "Si la persona ya est\xE1 registrada, se usar\xE1n sus datos existentes.");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_5_0;
    let tmp_7_0;
    let tmp_9_0;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(6);
    \u0275\u0275attribute("aria-invalid", !!ctx_r0.error("dni"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_3_0 = ctx_r0.error("dni")) ? 8 : -1, tmp_3_0);
    \u0275\u0275advance(4);
    \u0275\u0275attribute("aria-invalid", !!ctx_r0.error("nombres"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_5_0 = ctx_r0.error("nombres")) ? 14 : -1, tmp_5_0);
    \u0275\u0275advance(5);
    \u0275\u0275attribute("aria-invalid", !!ctx_r0.error("apellidoPaterno"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_7_0 = ctx_r0.error("apellidoPaterno")) ? 21 : -1, tmp_7_0);
    \u0275\u0275advance(6);
    \u0275\u0275attribute("aria-invalid", !!ctx_r0.error("apellidoMaterno"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_9_0 = ctx_r0.error("apellidoMaterno")) ? 29 : -1, tmp_9_0);
  }
}
function FormularioUsuarioComponent_Conditional_4_Conditional_14_Template(rf, ctx) {
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
function FormularioUsuarioComponent_Conditional_4_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 15);
    \u0275\u0275text(1, "Recibir\xE1 aqu\xED un enlace para crear su contrase\xF1a.");
    \u0275\u0275elementEnd();
  }
}
function FormularioUsuarioComponent_Conditional_4_For_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 19);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const rol_r4 = ctx.$implicit;
    \u0275\u0275property("value", rol_r4.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(rol_r4.nombre);
  }
}
function FormularioUsuarioComponent_Conditional_4_Conditional_25_Template(rf, ctx) {
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
function FormularioUsuarioComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275template(1, FormularioUsuarioComponent_Conditional_4_Conditional_1_Template, 5, 1, "div", 7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "form", 8);
    \u0275\u0275listener("ngSubmit", function FormularioUsuarioComponent_Conditional_4_Template_form_ngSubmit_2_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.guardar());
    });
    \u0275\u0275template(3, FormularioUsuarioComponent_Conditional_4_Conditional_3_Template, 1, 1)(4, FormularioUsuarioComponent_Conditional_4_Conditional_4_Template, 32, 8, "fieldset");
    \u0275\u0275elementStart(5, "fieldset")(6, "legend");
    \u0275\u0275text(7, "Cuenta de acceso");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 9)(9, "div", 10)(10, "label", 11);
    \u0275\u0275text(11, "Correo electr\xF3nico");
    \u0275\u0275elementEnd();
    \u0275\u0275element(12, "input", 12);
    \u0275\u0275elementStart(13, "div", 13);
    \u0275\u0275template(14, FormularioUsuarioComponent_Conditional_4_Conditional_14_Template, 2, 1, "p", 14);
    \u0275\u0275elementEnd();
    \u0275\u0275template(15, FormularioUsuarioComponent_Conditional_4_Conditional_15_Template, 2, 0, "p", 15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "div", 10)(17, "label", 16);
    \u0275\u0275text(18, "Rol");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "select", 17)(20, "option", 18);
    \u0275\u0275text(21, "Elige un rol");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(22, FormularioUsuarioComponent_Conditional_4_For_23_Template, 2, 2, "option", 19, _forTrack03);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "div", 20);
    \u0275\u0275template(25, FormularioUsuarioComponent_Conditional_4_Conditional_25_Template, 2, 1, "p", 14);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(26, "div", 21)(27, "a", 5);
    \u0275\u0275text(28, "Cancelar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "button", 22);
    \u0275\u0275text(30);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_5_0;
    let tmp_9_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_1_0 = ctx_r0.errorGeneral()) ? 1 : -1, tmp_1_0);
    \u0275\u0275advance();
    \u0275\u0275property("formGroup", ctx_r0.form);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.modoEdicion ? 3 : 4);
    \u0275\u0275advance(9);
    \u0275\u0275attribute("aria-invalid", !!ctx_r0.error("correo"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_5_0 = ctx_r0.error("correo")) ? 14 : -1, tmp_5_0);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0.modoEdicion ? 15 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275attribute("aria-invalid", !!ctx_r0.error("idRol"));
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r0.roles());
    \u0275\u0275advance(3);
    \u0275\u0275conditional((tmp_9_0 = ctx_r0.error("idRol")) ? 25 : -1, tmp_9_0);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", ctx_r0.enviando());
    \u0275\u0275attribute("aria-busy", ctx_r0.enviando());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.enviando() ? "Guardando\u2026" : ctx_r0.modoEdicion ? "Guardar cambios" : "Crear usuario", " ");
  }
}
var MENSAJES = {
  dni: { required: "Ingresa el DNI.", pattern: "El DNI debe tener 8 d\xEDgitos." },
  nombres: { maxlength: "M\xE1ximo 150 caracteres." },
  apellidoPaterno: { maxlength: "M\xE1ximo 150 caracteres." },
  apellidoMaterno: { maxlength: "M\xE1ximo 150 caracteres." },
  correo: { required: "Ingresa el correo.", email: "Ingresa un correo v\xE1lido.", maxlength: "M\xE1ximo 150 caracteres." },
  idRol: { required: "Elige un rol." }
};
var FormularioUsuarioComponent = class _FormularioUsuarioComponent {
  usuariosService = inject(UsuariosService);
  rolesService = inject(RolesService);
  router = inject(Router);
  host = inject(ElementRef);
  parametroId = inject(ActivatedRoute).snapshot.paramMap.get("id");
  modoEdicion = this.parametroId !== null;
  id = Number(this.parametroId);
  roles = signal([]);
  usuario = signal(null);
  cargando = signal(this.modoEdicion);
  errorCarga = signal(null);
  enviando = signal(false);
  errorGeneral = signal(null);
  erroresServidor = signal({});
  form = inject(NonNullableFormBuilder).group({
    dni: ["", [Validators.required, Validators.pattern(/^\d{8}$/)]],
    nombres: ["", Validators.maxLength(150)],
    apellidoPaterno: ["", Validators.maxLength(150)],
    apellidoMaterno: ["", Validators.maxLength(150)],
    correo: ["", [Validators.required, Validators.email, Validators.maxLength(150)]],
    idRol: ["", Validators.required]
  });
  constructor() {
    if (this.modoEdicion) {
      for (const campo of ["dni", "nombres", "apellidoPaterno", "apellidoMaterno"]) {
        this.form.controls[campo].disable();
      }
    }
    const destroyRef = inject(DestroyRef);
    for (const [campo, control] of Object.entries(this.form.controls)) {
      control.valueChanges.pipe(takeUntilDestroyed(destroyRef)).subscribe(() => {
        if (this.erroresServidor()[campo]) {
          const _a = this.erroresServidor(), { [campo]: _ } = _a, resto = __objRest(_a, [__restKey(campo)]);
          this.erroresServidor.set(resto);
        }
      });
    }
    afterNextRender(() => {
      this.rolesService.listar().subscribe({
        next: (roles) => this.roles.set(roles.filter((rol) => rol.estado)),
        error: (error) => this.errorGeneral.set(`No se pudieron cargar los roles. ${error.mensaje}`)
      });
      if (this.modoEdicion) {
        this.cargarUsuario();
      }
    });
  }
  /** Mensaje de error visible de un campo: primero el del backend, luego el del navegador. */
  error(campo) {
    const servidor = this.erroresServidor()[campo];
    if (servidor?.length)
      return servidor[0];
    const control = this.form.controls[campo];
    if (!control.touched || control.valid || !control.errors)
      return null;
    const clave = Object.keys(control.errors)[0];
    return MENSAJES[campo][clave] ?? "Revisa este campo.";
  }
  guardar() {
    this.errorGeneral.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.enfocarPrimerError();
      return;
    }
    const valores = this.form.getRawValue();
    const idRol = Number(valores.idRol);
    this.enviando.set(true);
    const peticion = this.modoEdicion ? this.usuariosService.actualizar(this.id, { correo: valores.correo.trim(), idRol }) : this.usuariosService.crear(this.payloadCreacion(valores, idRol));
    peticion.subscribe({
      next: () => {
        const aviso = this.modoEdicion ? { tipo: "exito", texto: `Se guardaron los cambios de ${this.usuario()?.nombre ?? "el usuario"}.` } : { tipo: "exito", texto: "Usuario creado. Se envi\xF3 un enlace a su correo para crear su contrase\xF1a." };
        void this.router.navigate(["/usuarios"], { state: { aviso } });
      },
      error: (error) => {
        this.enviando.set(false);
        if (error.status === 422) {
          this.erroresServidor.set(error.errores);
          this.form.markAllAsTouched();
          this.errorGeneral.set(this.resumen422(error));
          this.enfocarPrimerError();
        } else {
          this.errorGeneral.set(error.mensaje);
        }
      }
    });
  }
  cargarUsuario() {
    if (!Number.isInteger(this.id) || this.id <= 0) {
      this.cargando.set(false);
      this.errorCarga.set("El usuario no existe.");
      return;
    }
    this.usuariosService.obtener(this.id).subscribe({
      next: (usuario) => {
        this.usuario.set(usuario);
        this.form.patchValue({ correo: usuario.correo, idRol: usuario.rol ? String(usuario.rol.id) : "" });
        this.cargando.set(false);
      },
      error: (error) => {
        this.cargando.set(false);
        this.errorCarga.set(error.status === 404 ? "El usuario no existe." : error.mensaje);
      }
    });
  }
  payloadCreacion(valores, idRol) {
    const opcional = (valor) => valor.trim() || void 0;
    return {
      dni: valores.dni,
      nombres: opcional(valores.nombres),
      apellidoPaterno: opcional(valores.apellidoPaterno),
      apellidoMaterno: opcional(valores.apellidoMaterno),
      correo: valores.correo.trim(),
      idRol
    };
  }
  /**
   * Resumen propio del 422: Laravel reemplaza el message por el primer error más
   * "(and N more errors)" en inglés. El detalle queda debajo de cada campo.
   */
  resumen422(error) {
    return error.errores["nombres"] || error.errores["apellidoPaterno"] ? "La persona no est\xE1 registrada: completa sus nombres y su apellido paterno." : "Revisa los campos marcados.";
  }
  enfocarPrimerError() {
    setTimeout(() => this.host.nativeElement.querySelector('[aria-invalid="true"]')?.focus());
  }
  static \u0275fac = function FormularioUsuarioComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FormularioUsuarioComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FormularioUsuarioComponent, selectors: [["app-formulario-usuario"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 5, vars: 2, consts: [[1, "formulario-usuario"], [3, "title"], ["role", "status", 1, "estado-carga"], ["role", "alert", 1, "alert", "alert-error"], ["aria-hidden", "true", 1, "material-symbols-outlined"], ["routerLink", "/usuarios", 1, "btn"], ["role", "alert"], [1, "alert", "alert-error"], ["novalidate", "", 1, "card", 3, "ngSubmit", "formGroup"], [1, "fila"], [1, "form-field"], ["for", "correo"], ["id", "correo", "type", "email", "inputmode", "email", "autocomplete", "off", "formControlName", "correo", "aria-required", "true", "aria-describedby", "correo-ayuda correo-error", 1, "input"], ["id", "correo-error", "aria-live", "polite"], [1, "error-text"], ["id", "correo-ayuda", 1, "form-ayuda"], ["for", "rol"], ["id", "rol", "formControlName", "idRol", "aria-required", "true", "aria-describedby", "rol-error", 1, "input"], ["value", "", "disabled", ""], [3, "value"], ["id", "rol-error", "aria-live", "polite"], [1, "acciones"], ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"], [1, "solo-lectura"], [1, "dato"], [1, "form-field", "campo-dni"], ["for", "dni"], ["id", "dni", "type", "text", "inputmode", "numeric", "maxlength", "8", "autocomplete", "off", "formControlName", "dni", "aria-required", "true", "aria-describedby", "dni-error", 1, "input", "dato"], ["id", "dni-error", "aria-live", "polite"], ["for", "nombres"], ["id", "nombres", "type", "text", "autocomplete", "off", "formControlName", "nombres", "aria-describedby", "ayuda-persona nombres-error", 1, "input"], ["id", "nombres-error", "aria-live", "polite"], ["for", "apellido-paterno"], ["id", "apellido-paterno", "type", "text", "autocomplete", "off", "formControlName", "apellidoPaterno", "aria-describedby", "ayuda-persona apellido-paterno-error", 1, "input"], ["id", "apellido-paterno-error", "aria-live", "polite"], ["for", "apellido-materno"], [1, "opcional"], ["id", "apellido-materno", "type", "text", "autocomplete", "off", "formControlName", "apellidoMaterno", "aria-describedby", "apellido-materno-error", 1, "input"], ["id", "apellido-materno-error", "aria-live", "polite"], ["id", "ayuda-persona", 1, "form-ayuda", "ayuda-persona"]], template: function FormularioUsuarioComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section", 0);
      \u0275\u0275element(1, "app-page-title", 1);
      \u0275\u0275template(2, FormularioUsuarioComponent_Conditional_2_Template, 2, 0, "p", 2)(3, FormularioUsuarioComponent_Conditional_3_Template, 7, 1)(4, FormularioUsuarioComponent_Conditional_4_Template, 31, 11);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275property("title", ctx.modoEdicion ? "Editar usuario" : "Nuevo usuario");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.cargando() ? 2 : ctx.errorCarga() ? 3 : 4);
    }
  }, dependencies: [ReactiveFormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, MaxLengthValidator, FormGroupDirective, FormControlName, RouterLink, PageTitleComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.formulario-usuario[_ngcontent-%COMP%] {\n  max-width: 44rem;\n}\nfieldset[_ngcontent-%COMP%] {\n  min-width: 0;\n  margin: 0 0 var(--espacio-5);\n  padding: 0;\n  border: 0;\n}\nlegend[_ngcontent-%COMP%] {\n  margin-bottom: var(--espacio-4);\n  padding: 0;\n  font-size: 1rem;\n  font-weight: 600;\n}\n.fila[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 0 var(--espacio-4);\n}\n.campo-dni[_ngcontent-%COMP%] {\n  max-width: 12rem;\n}\n.opcional[_ngcontent-%COMP%] {\n  color: var(--neutro-500);\n  font-weight: 400;\n}\n.ayuda-persona[_ngcontent-%COMP%] {\n  margin-top: calc(var(--espacio-3) * -1);\n}\n.solo-lectura[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr auto;\n  gap: var(--espacio-4);\n  margin: 0 0 var(--espacio-5);\n  padding-bottom: var(--espacio-5);\n  border-bottom: 1px solid var(--neutro-200);\n}\n.solo-lectura[_ngcontent-%COMP%]   dt[_ngcontent-%COMP%] {\n  color: var(--neutro-500);\n  font-size: 0.8125rem;\n}\n.solo-lectura[_ngcontent-%COMP%]   dd[_ngcontent-%COMP%] {\n  margin: 0;\n  font-weight: 600;\n}\n.acciones[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: flex-end;\n  gap: var(--espacio-3);\n  padding-top: var(--espacio-5);\n  border-top: 1px solid var(--neutro-200);\n}\n.estado-carga[_ngcontent-%COMP%] {\n  color: var(--neutro-500);\n}\n@media (max-width: 600px) {\n  .fila[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .campo-dni[_ngcontent-%COMP%] {\n    max-width: none;\n  }\n  .acciones[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n    flex: 1;\n  }\n}\n/*# sourceMappingURL=formulario-usuario.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FormularioUsuarioComponent, { className: "FormularioUsuarioComponent", filePath: "src\\app\\pages\\seguridad\\usuarios\\formulario-usuario\\formulario-usuario.component.ts", lineNumber: 32 });
})();

// src/app/core/services/modulos/modulos.service.ts
var ModulosService = class _ModulosService {
  http = inject(HttpClient);
  urlModulos = `${environment.apiBaseUrl}/modulos`;
  urlPermisos = `${environment.apiBaseUrl}/permisos`;
  /** Módulos con sus permisos anidados. */
  listar() {
    return this.http.get(this.urlModulos, this.opciones()).pipe(map((respuesta) => respuesta.data), catchError((error) => throwError(() => aErrorApi(error))));
  }
  crear(payload) {
    return this.http.post(this.urlModulos, payload, this.opciones()).pipe(catchError((error) => throwError(() => aErrorApi(error))));
  }
  actualizar(id, payload) {
    return this.http.put(`${this.urlModulos}/${id}`, payload, this.opciones()).pipe(catchError((error) => throwError(() => aErrorApi(error))));
  }
  cambiarEstado(id, estado) {
    return this.http.patch(`${this.urlModulos}/${id}/estado`, { estado }, this.opciones()).pipe(catchError((error) => throwError(() => aErrorApi(error))));
  }
  crearPermiso(idModulo, payload) {
    return this.http.post(`${this.urlModulos}/${idModulo}/permisos`, payload, this.opciones()).pipe(catchError((error) => throwError(() => aErrorApi(error))));
  }
  actualizarPermiso(id, payload) {
    return this.http.put(`${this.urlPermisos}/${id}`, payload, this.opciones()).pipe(catchError((error) => throwError(() => aErrorApi(error))));
  }
  cambiarEstadoPermiso(id, estado) {
    return this.http.patch(`${this.urlPermisos}/${id}/estado`, { estado }, this.opciones()).pipe(catchError((error) => throwError(() => aErrorApi(error))));
  }
  opciones() {
    return { context: new HttpContext().set(AUTHENTICATED_REQUEST, true) };
  }
  static \u0275fac = function ModulosService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ModulosService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ModulosService, factory: _ModulosService.\u0275fac, providedIn: "root" });
};

// src/app/models/roles/clave-permiso.model.ts
var PATRON_ACCION_PERMISO = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
var PATRON_URL_MODULO = /^\/[a-z0-9]+(?:-[a-z0-9]+)*$/;
var LARGO_MAXIMO_CLAVE = 50;
function slugModulo(urlModulo) {
  return urlModulo.replace(/^\/+/, "");
}
function componerClave(urlModulo, accion) {
  return `${slugModulo(urlModulo)}.${accion}`;
}
function accionDeClave(urlModulo, clave) {
  const prefijo = `${slugModulo(urlModulo)}.`;
  return clave.startsWith(prefijo) ? clave.slice(prefijo.length) : clave.slice(clave.lastIndexOf(".") + 1);
}
function accionDesdeNombre(nombre) {
  return (nombre.trim().split(/\s+/)[0] ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9-]/g, "");
}

// src/app/shared/utils/iconos-disponibles.ts
var ICONOS_DISPONIBLES = /* @__PURE__ */ new Set([
  "account_balance",
  "analytics",
  "badge",
  "category",
  "description",
  "draw",
  "event_note",
  "fact_check",
  "https",
  "monitoring",
  "navigate_before",
  "navigate_next",
  "pending_actions",
  "post_add",
  "verified",
  "add",
  "admin_panel_settings",
  "arrow_back",
  "bar_chart",
  "calendar_month",
  "campaign",
  "check_circle",
  "chevron_left",
  "chevron_right",
  "co_present",
  "dashboard",
  "edit",
  "edit_calendar",
  "error",
  "event",
  "expand_more",
  "forward_to_inbox",
  "group",
  "groups",
  "how_to_reg",
  "inbox",
  "lock",
  "lock_open",
  "logout",
  "menu",
  "military_tech",
  "people",
  "person_off",
  "refresh",
  "school",
  "search",
  "settings",
  "toggle_off",
  "toggle_on",
  "tune",
  "visibility",
  "visibility_off",
  "warning",
  "workspace_premium"
]);

// src/app/pages/seguridad/roles/catalogo-modulos/catalogo-modulos.component.ts
var _c03 = ["dialogoModulo"];
var _c12 = ["dialogoPermiso"];
var _forTrack04 = ($index, $item) => $item.id;
function CatalogoModulosComponent_button_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 53);
    \u0275\u0275listener("click", function CatalogoModulosComponent_button_3_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.abrirModulo(null));
    });
    \u0275\u0275elementStart(1, "span", 54);
    \u0275\u0275text(2, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Nuevo m\xF3dulo ");
    \u0275\u0275elementEnd();
  }
}
function CatalogoModulosComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 55)(1, "span", 54);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const aviso_r4 = ctx;
    \u0275\u0275classProp("alert-exito", aviso_r4.tipo === "exito")("alert-error", aviso_r4.tipo === "error");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(aviso_r4.tipo === "exito" ? "check_circle" : "error");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(aviso_r4.texto);
  }
}
function CatalogoModulosComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7)(1, "span", 54);
    \u0275\u0275text(2, "error");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("No se pudieron cargar los m\xF3dulos. ", ctx, "");
  }
}
function CatalogoModulosComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 56);
    \u0275\u0275text(1, "Cargando m\xF3dulos\u2026");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 57);
    \u0275\u0275element(3, "span")(4, "span")(5, "span")(6, "span");
    \u0275\u0275elementEnd();
  }
}
function CatalogoModulosComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8)(1, "p");
    \u0275\u0275text(2, "Todav\xEDa no hay m\xF3dulos.");
    \u0275\u0275elementEnd()();
  }
}
function CatalogoModulosComponent_Conditional_10_For_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 29);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const modulo_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(modulo_r5.imagen);
  }
}
function CatalogoModulosComponent_Conditional_10_For_2_ng_container_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "button", 32);
    \u0275\u0275listener("click", function CatalogoModulosComponent_Conditional_10_For_2_ng_container_17_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r6);
      const modulo_r5 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.abrirModulo(modulo_r5));
    });
    \u0275\u0275elementStart(2, "span", 54);
    \u0275\u0275text(3, "edit");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, " Editar m\xF3dulo");
    \u0275\u0275elementStart(5, "span", 40);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "button", 73);
    \u0275\u0275listener("click", function CatalogoModulosComponent_Conditional_10_For_2_ng_container_17_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r6);
      const modulo_r5 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.cambiarEstadoModulo(modulo_r5));
    });
    \u0275\u0275elementStart(8, "span", 54);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275text(10);
    \u0275\u0275elementStart(11, "span", 40);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const modulo_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1(" ", modulo_r5.nombre, "");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r2.procesando() === "m" + modulo_r5.id);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(modulo_r5.estado ? "toggle_off" : "toggle_on");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", modulo_r5.estado ? "Desactivar" : "Activar", "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" el m\xF3dulo ", modulo_r5.nombre, "");
  }
}
function CatalogoModulosComponent_Conditional_10_For_2_button_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 32);
    \u0275\u0275listener("click", function CatalogoModulosComponent_Conditional_10_For_2_button_18_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      const modulo_r5 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.abrirPermiso(modulo_r5, null));
    });
    \u0275\u0275elementStart(1, "span", 54);
    \u0275\u0275text(2, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Nuevo permiso");
    \u0275\u0275elementStart(4, "span", 40);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const modulo_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" en ", modulo_r5.nombre, "");
  }
}
function CatalogoModulosComponent_Conditional_10_For_2_Conditional_19_th_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 76)(1, "span", 40);
    \u0275\u0275text(2, "Acciones");
    \u0275\u0275elementEnd()();
  }
}
function CatalogoModulosComponent_Conditional_10_For_2_Conditional_19_For_16_td_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "td", 81)(1, "div", 83)(2, "button", 84);
    \u0275\u0275listener("click", function CatalogoModulosComponent_Conditional_10_For_2_Conditional_19_For_16_td_10_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r8);
      const permiso_r9 = \u0275\u0275nextContext().$implicit;
      const modulo_r5 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.abrirPermiso(modulo_r5, permiso_r9));
    });
    \u0275\u0275elementStart(3, "span", 54);
    \u0275\u0275text(4, "edit");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "button", 85);
    \u0275\u0275listener("click", function CatalogoModulosComponent_Conditional_10_For_2_Conditional_19_For_16_td_10_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r8);
      const permiso_r9 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.cambiarEstadoPermiso(permiso_r9));
    });
    \u0275\u0275elementStart(6, "span", 54);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const permiso_r9 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(2);
    \u0275\u0275attribute("aria-label", "Editar permiso " + permiso_r9.clave);
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r2.procesando() === "p" + permiso_r9.id);
    \u0275\u0275attribute("aria-label", (permiso_r9.estado ? "Desactivar permiso " : "Activar permiso ") + permiso_r9.clave)("title", permiso_r9.estado ? "Desactivar" : "Activar");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(permiso_r9.estado ? "toggle_off" : "toggle_on");
  }
}
function CatalogoModulosComponent_Conditional_10_For_2_Conditional_19_For_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 79);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 80);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 81)(8, "span", 64);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(10, CatalogoModulosComponent_Conditional_10_For_2_Conditional_19_For_16_td_10_Template, 8, 5, "td", 82);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const permiso_r9 = ctx.$implicit;
    const \u0275$index_155_r10 = ctx.$index;
    \u0275\u0275classProp("registro-inactivo", !permiso_r9.estado);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275$index_155_r10 + 1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(permiso_r9.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(permiso_r9.clave);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("badge-exito", permiso_r9.estado);
    \u0275\u0275attribute("data-estado", permiso_r9.estado ? "Activo" : "Inactivo");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(permiso_r9.estado ? "Activo" : "Inactivo");
    \u0275\u0275advance();
    \u0275\u0275property("appHasPermission", "roles.editar");
  }
}
function CatalogoModulosComponent_Conditional_10_For_2_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "table", 71)(1, "caption", 40);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "thead")(4, "tr")(5, "th", 74);
    \u0275\u0275text(6, "N.\xBA");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th", 75);
    \u0275\u0275text(8, "Permiso");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th", 75);
    \u0275\u0275text(10, "Clave");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th", 76);
    \u0275\u0275text(12, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275template(13, CatalogoModulosComponent_Conditional_10_For_2_Conditional_19_th_13_Template, 3, 0, "th", 77);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "tbody");
    \u0275\u0275repeaterCreate(15, CatalogoModulosComponent_Conditional_10_For_2_Conditional_19_For_16_Template, 11, 10, "tr", 78, _forTrack04);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const modulo_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Permisos de ", modulo_r5.nombre, "");
    \u0275\u0275advance(11);
    \u0275\u0275property("appHasPermission", "roles.editar");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(modulo_r5.permisos);
  }
}
function CatalogoModulosComponent_Conditional_10_For_2_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 72);
    \u0275\u0275text(1, "Este m\xF3dulo todav\xEDa no tiene permisos.");
    \u0275\u0275elementEnd();
  }
}
function CatalogoModulosComponent_Conditional_10_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "details", 59)(1, "summary")(2, "span", 60);
    \u0275\u0275template(3, CatalogoModulosComponent_Conditional_10_For_2_Conditional_3_Template, 2, 1, "span", 29);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 61)(5, "span", 62);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span", 63);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "span", 64);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "span", 65);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "span", 66);
    \u0275\u0275text(14, "expand_more");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "div", 67)(16, "div", 68);
    \u0275\u0275template(17, CatalogoModulosComponent_Conditional_10_For_2_ng_container_17_Template, 13, 5, "ng-container", 69)(18, CatalogoModulosComponent_Conditional_10_For_2_button_18_Template, 6, 1, "button", 70);
    \u0275\u0275elementEnd();
    \u0275\u0275template(19, CatalogoModulosComponent_Conditional_10_For_2_Conditional_19_Template, 17, 2, "table", 71)(20, CatalogoModulosComponent_Conditional_10_For_2_Conditional_20_Template, 2, 0, "p", 72);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const modulo_r5 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("registro-inactivo", !modulo_r5.estado);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r2.iconoValido(modulo_r5.imagen) ? 3 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(modulo_r5.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(modulo_r5.url);
    \u0275\u0275advance();
    \u0275\u0275classProp("badge-exito", modulo_r5.estado);
    \u0275\u0275attribute("data-estado", modulo_r5.estado ? "Activo" : "Inactivo");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(modulo_r5.estado ? "Activo" : "Inactivo");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", modulo_r5.permisos.length, " ", modulo_r5.permisos.length === 1 ? "permiso" : "permisos", "");
    \u0275\u0275advance(5);
    \u0275\u0275property("appHasPermission", "roles.editar");
    \u0275\u0275advance();
    \u0275\u0275property("appHasPermission", "roles.crear");
    \u0275\u0275advance();
    \u0275\u0275conditional(modulo_r5.permisos.length ? 19 : 20);
  }
}
function CatalogoModulosComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275repeaterCreate(1, CatalogoModulosComponent_Conditional_10_For_2_Template, 21, 14, "details", 58, _forTrack04);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.modulos());
  }
}
function CatalogoModulosComponent_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13)(1, "span", 54);
    \u0275\u0275text(2, "error");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx);
  }
}
function CatalogoModulosComponent_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 18);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function CatalogoModulosComponent_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 18);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function CatalogoModulosComponent_For_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 27);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const icono_r11 = ctx.$implicit;
    \u0275\u0275property("value", icono_r11);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(icono_r11);
  }
}
function CatalogoModulosComponent_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 29);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.formModulo.controls.imagen.value);
  }
}
function CatalogoModulosComponent_Conditional_56_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13)(1, "span", 54);
    \u0275\u0275text(2, "error");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx);
  }
}
function CatalogoModulosComponent_Conditional_62_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 18);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function CatalogoModulosComponent_Conditional_73_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 18);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function CatalogoModulosComponent_Conditional_84_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 18);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function CatalogoModulosComponent_Conditional_92_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 18);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
var MENSAJES2 = {
  nombre: { required: "Ingresa el nombre.", maxlength: "Es demasiado largo." },
  url: { required: "Ingresa la URL.", pattern: 'Usa "/" y min\xFAsculas, p. ej. /reportes.', maxlength: "Es demasiado larga." },
  accion: { required: "Ingresa la acci\xF3n.", pattern: "Usa min\xFAsculas, d\xEDgitos y guiones, p. ej. exportar.", maxlength: "La clave completa no puede pasar de 50 caracteres." },
  valor: { maxlength: "M\xE1ximo 50 caracteres." },
  comentario: { maxlength: "M\xE1ximo 50 caracteres." }
};
var CatalogoModulosComponent = class _CatalogoModulosComponent {
  modulosService = inject(ModulosService);
  dialogoModulo = viewChild.required("dialogoModulo");
  dialogoPermiso = viewChild.required("dialogoPermiso");
  confirmacion = viewChild.required(DialogoConfirmacionComponent);
  fb = inject(NonNullableFormBuilder);
  iconos = [...ICONOS_DISPONIBLES];
  modulos = signal([]);
  cargando = signal(true);
  errorCarga = signal(null);
  aviso = signal(null);
  procesando = signal(null);
  porConfirmar = signal(null);
  enviando = signal(false);
  errorDialogo = signal(null);
  erroresServidor = signal({});
  /** null: módulo nuevo. */
  moduloEditando = signal(null);
  /** Con permisos, la URL no cambia: las claves de sus permisos empiezan con ella (el backend responde 409). */
  urlBloqueada = computed(() => (this.moduloEditando()?.permisos.length ?? 0) > 0);
  formModulo = this.fb.group({
    nombre: ["", [Validators.required, Validators.maxLength(255)]],
    url: ["", [Validators.required, Validators.maxLength(255), Validators.pattern(PATRON_URL_MODULO)]],
    imagen: [""]
  });
  moduloDelPermiso = signal(null);
  /** null: permiso nuevo. */
  permisoEditando = signal(null);
  /** Prefijo fijo de la clave ("reportes."): solo se escribe la acción. */
  prefijoClave = computed(() => {
    const modulo = this.moduloDelPermiso();
    return modulo ? `${slugModulo(modulo.url)}.` : "";
  });
  formPermiso = this.fb.group({
    nombre: ["", [Validators.required, Validators.maxLength(50)]],
    accion: ["", [Validators.required, Validators.pattern(PATRON_ACCION_PERMISO)]],
    valor: ["", Validators.maxLength(50)],
    comentario: ["", Validators.maxLength(50)]
  });
  /** La acción se sugiere desde el nombre hasta que la persona la edita a mano. */
  accionManual = false;
  constructor() {
    afterNextRender(() => this.cargar());
    const destroyRef = inject(DestroyRef);
    this.formPermiso.controls.nombre.valueChanges.pipe(takeUntilDestroyed(destroyRef)).subscribe((nombre) => {
      const modulo = this.moduloDelPermiso();
      if (modulo && !this.permisoEditando() && !this.accionManual) {
        this.formPermiso.controls.accion.setValue(accionDesdeNombre(nombre), { emitEvent: false });
      }
    });
    for (const form of [this.formModulo, this.formPermiso]) {
      for (const [campo, control] of Object.entries(form.controls)) {
        const claveServidor = campo === "accion" ? "clave" : campo;
        control.valueChanges.pipe(takeUntilDestroyed(destroyRef)).subscribe(() => {
          if (this.erroresServidor()[claveServidor]) {
            const _a = this.erroresServidor(), { [claveServidor]: _ } = _a, resto = __objRest(_a, [__restKey(claveServidor)]);
            this.erroresServidor.set(resto);
          }
        });
      }
    }
  }
  iconoValido(nombre) {
    return !!nombre && ICONOS_DISPONIBLES.has(nombre);
  }
  /** Error visible de un campo: el del backend (bajo `claveServidor`) o el del navegador. */
  error(control, campo, claveServidor = campo) {
    const servidor = this.erroresServidor()[claveServidor];
    if (servidor?.length)
      return servidor[0];
    if (!control.touched || control.valid || !control.errors)
      return null;
    return MENSAJES2[campo]?.[Object.keys(control.errors)[0]] ?? "Revisa este campo.";
  }
  abrirModulo(modulo) {
    this.moduloEditando.set(modulo);
    this.formModulo.reset({ nombre: modulo?.nombre ?? "", url: modulo?.url ?? "", imagen: modulo?.imagen ?? "" });
    this.limpiarErroresDialogo();
    this.dialogoModulo().abrir();
  }
  abrirPermiso(modulo, permiso) {
    this.moduloDelPermiso.set(modulo);
    this.permisoEditando.set(permiso);
    this.accionManual = !!permiso;
    this.formPermiso.controls.accion.setValidators([
      Validators.required,
      Validators.pattern(PATRON_ACCION_PERMISO),
      Validators.maxLength(LARGO_MAXIMO_CLAVE - slugModulo(modulo.url).length - 1)
    ]);
    this.formPermiso.reset({
      nombre: permiso?.nombre ?? "",
      accion: permiso ? accionDeClave(modulo.url, permiso.clave) : "",
      valor: permiso?.valor ?? "",
      comentario: permiso?.comentario ?? ""
    });
    this.limpiarErroresDialogo();
    this.dialogoPermiso().abrir();
  }
  alEditarAccion() {
    this.accionManual = true;
  }
  cerrarModulo() {
    this.dialogoModulo().cerrar();
  }
  cerrarPermiso() {
    this.dialogoPermiso().cerrar();
  }
  guardarModulo() {
    if (this.formModulo.invalid) {
      this.formModulo.markAllAsTouched();
      return;
    }
    const valores = this.formModulo.getRawValue();
    const payload = { nombre: valores.nombre.trim(), url: valores.url.trim(), imagen: valores.imagen || null };
    const modulo = this.moduloEditando();
    const peticion = modulo ? this.modulosService.actualizar(modulo.id, payload) : this.modulosService.crear(payload);
    this.enviarDialogo(peticion, this.dialogoModulo(), modulo ? `Se guard\xF3 el m\xF3dulo ${payload.nombre}.` : `Se cre\xF3 el m\xF3dulo ${payload.nombre}.`);
  }
  guardarPermiso() {
    const modulo = this.moduloDelPermiso();
    if (this.formPermiso.invalid || !modulo) {
      this.formPermiso.markAllAsTouched();
      return;
    }
    const valores = this.formPermiso.getRawValue();
    const payload = {
      nombre: valores.nombre.trim(),
      clave: componerClave(modulo.url, valores.accion.trim()),
      valor: valores.valor.trim() || null,
      comentario: valores.comentario.trim() || null
    };
    const permiso = this.permisoEditando();
    const peticion = permiso ? this.modulosService.actualizarPermiso(permiso.id, payload) : this.modulosService.crearPermiso(modulo.id, payload);
    this.enviarDialogo(peticion, this.dialogoPermiso(), permiso ? `Se guard\xF3 el permiso ${payload.clave}.` : `Se cre\xF3 el permiso ${payload.clave} en ${modulo.nombre}.`);
  }
  cambiarEstadoModulo(modulo) {
    return __async(this, null, function* () {
      this.porConfirmar.set({ tipo: "m\xF3dulo", nombre: modulo.nombre, estado: modulo.estado });
      if (!(yield this.confirmacion().abrir()))
        return;
      this.ejecutar(`m${modulo.id}`, this.modulosService.cambiarEstado(modulo.id, !modulo.estado), `El m\xF3dulo ${modulo.nombre} fue ${modulo.estado ? "desactivado" : "activado"}.`);
    });
  }
  cambiarEstadoPermiso(permiso) {
    return __async(this, null, function* () {
      this.porConfirmar.set({ tipo: "permiso", nombre: permiso.clave, estado: permiso.estado });
      if (!(yield this.confirmacion().abrir()))
        return;
      this.ejecutar(`p${permiso.id}`, this.modulosService.cambiarEstadoPermiso(permiso.id, !permiso.estado), `El permiso ${permiso.clave} fue ${permiso.estado ? "desactivado" : "activado"}.`);
    });
  }
  enviarDialogo(peticion, dialogo, exito) {
    this.enviando.set(true);
    this.errorDialogo.set(null);
    peticion.subscribe({
      next: () => {
        this.enviando.set(false);
        dialogo.cerrar();
        this.aviso.set({ tipo: "exito", texto: exito });
        this.cargar();
      },
      error: (error) => {
        this.enviando.set(false);
        if (error.status === 422 && Object.keys(error.errores).length) {
          this.erroresServidor.set(error.errores);
        } else {
          this.errorDialogo.set(error.mensaje);
        }
      }
    });
  }
  ejecutar(clave, accion, exito) {
    this.procesando.set(clave);
    this.aviso.set(null);
    accion.subscribe({
      next: () => {
        this.procesando.set(null);
        this.aviso.set({ tipo: "exito", texto: exito });
        this.cargar();
      },
      error: (error) => {
        this.procesando.set(null);
        this.aviso.set({ tipo: "error", texto: error.mensaje });
      }
    });
  }
  limpiarErroresDialogo() {
    this.erroresServidor.set({});
    this.errorDialogo.set(null);
  }
  cargar() {
    this.modulosService.listar().subscribe({
      next: (modulos) => {
        this.modulos.set(modulos);
        this.cargando.set(false);
        this.errorCarga.set(null);
      },
      error: (error) => {
        this.cargando.set(false);
        this.errorCarga.set(error.mensaje);
      }
    });
  }
  static \u0275fac = function CatalogoModulosComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CatalogoModulosComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CatalogoModulosComponent, selectors: [["app-catalogo-modulos"]], viewQuery: function CatalogoModulosComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuerySignal(ctx.dialogoModulo, _c03, 5);
      \u0275\u0275viewQuerySignal(ctx.dialogoPermiso, _c12, 5);
      \u0275\u0275viewQuerySignal(ctx.confirmacion, DialogoConfirmacionComponent, 5);
    }
    if (rf & 2) {
      \u0275\u0275queryAdvance(3);
    }
  }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 99, vars: 36, consts: [["dialogoModulo", ""], ["dialogoPermiso", ""], [1, "encabezado"], [1, "descripcion"], ["type", "button", "class", "btn btn-primary", 3, "click", 4, "appHasPermission"], ["role", "status"], [1, "alert", 3, "alert-exito", "alert-error"], ["role", "alert", 1, "alert", "alert-error"], [1, "card", "estado-vacio"], [1, "modulos"], [3, "titulo"], ["novalidate", "", 3, "ngSubmit", "formGroup"], ["role", "alert"], [1, "alert", "alert-error"], [1, "form-field"], ["for", "modulo-nombre"], ["id", "modulo-nombre", "type", "text", "formControlName", "nombre", "autocomplete", "off", "autofocus", "", "aria-required", "true", "aria-describedby", "modulo-nombre-error", 1, "input"], ["id", "modulo-nombre-error", "aria-live", "polite"], [1, "error-text"], ["for", "modulo-url"], ["id", "modulo-url", "type", "text", "formControlName", "url", "autocomplete", "off", "placeholder", "/reportes", "aria-required", "true", "aria-describedby", "modulo-url-ayuda modulo-url-error", 1, "input", "dato", 3, "readOnly"], ["id", "modulo-url-error", "aria-live", "polite"], ["id", "modulo-url-ayuda", 1, "form-ayuda"], ["for", "modulo-imagen"], [1, "selector-icono"], ["id", "modulo-imagen", "formControlName", "imagen", "aria-describedby", "modulo-imagen-ayuda", 1, "input"], ["value", ""], [3, "value"], ["aria-hidden", "true", 1, "icono-modulo", "vista-previa"], [1, "material-symbols-outlined"], ["id", "modulo-imagen-ayuda", 1, "form-ayuda"], [1, "dialogo-acciones"], ["type", "button", 1, "btn", 3, "click"], ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"], ["for", "permiso-nombre"], ["id", "permiso-nombre", "type", "text", "formControlName", "nombre", "autocomplete", "off", "autofocus", "", "maxlength", "50", "aria-required", "true", "aria-describedby", "permiso-nombre-error", 1, "input"], ["id", "permiso-nombre-error", "aria-live", "polite"], ["for", "permiso-accion"], [1, "input-con-prefijo"], ["id", "permiso-prefijo", 1, "prefijo", "dato"], [1, "sr-only"], ["id", "permiso-accion", "type", "text", "formControlName", "accion", "autocomplete", "off", "aria-required", "true", "aria-describedby", "permiso-prefijo permiso-clave-ayuda permiso-clave-error", 1, "input", "dato", 3, "input"], ["id", "permiso-clave-error", "aria-live", "polite"], ["id", "permiso-clave-ayuda", 1, "form-ayuda"], [1, "fila"], ["for", "permiso-valor"], [1, "opcional"], ["id", "permiso-valor", "type", "text", "formControlName", "valor", "autocomplete", "off", "maxlength", "50", "aria-describedby", "permiso-valor-error", 1, "input"], ["id", "permiso-valor-error", "aria-live", "polite"], ["for", "permiso-comentario"], ["id", "permiso-comentario", "type", "text", "formControlName", "comentario", "autocomplete", "off", "maxlength", "50", "aria-describedby", "permiso-comentario-error", 1, "input"], ["id", "permiso-comentario-error", "aria-live", "polite"], [3, "titulo", "texto", "confirmar"], ["type", "button", 1, "btn", "btn-primary", 3, "click"], ["aria-hidden", "true", 1, "material-symbols-outlined"], [1, "alert"], ["role", "status", 1, "sr-only"], ["aria-hidden", "true", 1, "esqueleto"], [1, "modulo", 3, "registro-inactivo"], [1, "modulo"], ["aria-hidden", "true", 1, "icono-modulo"], [1, "modulo-titulo"], [1, "modulo-nombre"], [1, "dato", "modulo-url"], [1, "badge"], [1, "modulo-conteo"], ["aria-hidden", "true", 1, "material-symbols-outlined", "desplegar"], [1, "modulo-cuerpo"], [1, "modulo-acciones"], [4, "appHasPermission"], ["type", "button", "class", "btn", 3, "click", 4, "appHasPermission"], [1, "table", "table-apilable"], [1, "sin-permisos"], ["type", "button", 1, "btn", 3, "click", "disabled"], ["scope", "col", 1, "col-centro", "col-numero"], ["scope", "col"], ["scope", "col", 1, "col-centro"], ["scope", "col", "class", "col-centro", 4, "appHasPermission"], [3, "registro-inactivo"], ["data-label", "N.\xBA", 1, "col-centro", "col-numero"], [1, "dato"], [1, "col-centro"], ["class", "col-centro", 4, "appHasPermission"], [1, "acciones"], ["type", "button", "title", "Editar", 1, "btn", "btn-icono", "btn-sin-borde", 3, "click"], ["type", "button", 1, "btn", "btn-icono", "btn-sin-borde", 3, "click", "disabled"]], template: function CatalogoModulosComponent_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "div", 2)(1, "p", 3);
      \u0275\u0275text(2, "Los m\xF3dulos forman el men\xFA lateral; sus permisos se asignan a cada rol en sus accesos.");
      \u0275\u0275elementEnd();
      \u0275\u0275template(3, CatalogoModulosComponent_button_3_Template, 4, 0, "button", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "div", 5);
      \u0275\u0275template(5, CatalogoModulosComponent_Conditional_5_Template, 5, 6, "div", 6);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "div");
      \u0275\u0275template(7, CatalogoModulosComponent_Conditional_7_Template, 5, 1, "div", 7)(8, CatalogoModulosComponent_Conditional_8_Template, 7, 0)(9, CatalogoModulosComponent_Conditional_9_Template, 3, 0, "div", 8)(10, CatalogoModulosComponent_Conditional_10_Template, 3, 0, "div", 9);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "app-dialogo", 10, 0)(13, "form", 11);
      \u0275\u0275listener("ngSubmit", function CatalogoModulosComponent_Template_form_ngSubmit_13_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.guardarModulo());
      });
      \u0275\u0275elementStart(14, "div", 12);
      \u0275\u0275template(15, CatalogoModulosComponent_Conditional_15_Template, 5, 1, "div", 13);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "div", 14)(17, "label", 15);
      \u0275\u0275text(18, "Nombre");
      \u0275\u0275elementEnd();
      \u0275\u0275element(19, "input", 16);
      \u0275\u0275elementStart(20, "div", 17);
      \u0275\u0275template(21, CatalogoModulosComponent_Conditional_21_Template, 2, 1, "p", 18);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(22, "div", 14)(23, "label", 19);
      \u0275\u0275text(24, "URL");
      \u0275\u0275elementEnd();
      \u0275\u0275element(25, "input", 20);
      \u0275\u0275elementStart(26, "div", 21);
      \u0275\u0275template(27, CatalogoModulosComponent_Conditional_27_Template, 2, 1, "p", 18);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "p", 22);
      \u0275\u0275text(29);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(30, "div", 14)(31, "label", 23);
      \u0275\u0275text(32, "\xCDcono");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(33, "div", 24)(34, "select", 25)(35, "option", 26);
      \u0275\u0275text(36, "Sin \xEDcono");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(37, CatalogoModulosComponent_For_38_Template, 2, 2, "option", 27, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(39, "span", 28);
      \u0275\u0275template(40, CatalogoModulosComponent_Conditional_40_Template, 2, 1, "span", 29);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(41, "p", 30);
      \u0275\u0275text(42, "Se muestra junto al nombre en el men\xFA lateral.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(43, "div", 31)(44, "button", 32);
      \u0275\u0275listener("click", function CatalogoModulosComponent_Template_button_click_44_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.cerrarModulo());
      });
      \u0275\u0275text(45, "Cancelar");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(46, "button", 33);
      \u0275\u0275text(47);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(48, "app-dialogo", 10, 1)(50, "form", 11);
      \u0275\u0275listener("ngSubmit", function CatalogoModulosComponent_Template_form_ngSubmit_50_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.guardarPermiso());
      });
      \u0275\u0275elementStart(51, "p");
      \u0275\u0275text(52, "M\xF3dulo: ");
      \u0275\u0275elementStart(53, "strong");
      \u0275\u0275text(54);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(55, "div", 12);
      \u0275\u0275template(56, CatalogoModulosComponent_Conditional_56_Template, 5, 1, "div", 13);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(57, "div", 14)(58, "label", 34);
      \u0275\u0275text(59, "Nombre");
      \u0275\u0275elementEnd();
      \u0275\u0275element(60, "input", 35);
      \u0275\u0275elementStart(61, "div", 36);
      \u0275\u0275template(62, CatalogoModulosComponent_Conditional_62_Template, 2, 1, "p", 18);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(63, "div", 14)(64, "label", 37);
      \u0275\u0275text(65, "Clave");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(66, "div", 38)(67, "span", 39)(68, "span", 40);
      \u0275\u0275text(69, "Prefijo fijo: ");
      \u0275\u0275elementEnd();
      \u0275\u0275text(70);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(71, "input", 41);
      \u0275\u0275listener("input", function CatalogoModulosComponent_Template_input_input_71_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.alEditarAccion());
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(72, "div", 42);
      \u0275\u0275template(73, CatalogoModulosComponent_Conditional_73_Template, 2, 1, "p", 18);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(74, "p", 43);
      \u0275\u0275text(75, "Escribe solo la acci\xF3n (p. ej. exportar). Se sugiere a partir del nombre.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(76, "div", 44)(77, "div", 14)(78, "label", 45);
      \u0275\u0275text(79, "Valor ");
      \u0275\u0275elementStart(80, "span", 46);
      \u0275\u0275text(81, "(opcional)");
      \u0275\u0275elementEnd()();
      \u0275\u0275element(82, "input", 47);
      \u0275\u0275elementStart(83, "div", 48);
      \u0275\u0275template(84, CatalogoModulosComponent_Conditional_84_Template, 2, 1, "p", 18);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(85, "div", 14)(86, "label", 49);
      \u0275\u0275text(87, "Comentario ");
      \u0275\u0275elementStart(88, "span", 46);
      \u0275\u0275text(89, "(opcional)");
      \u0275\u0275elementEnd()();
      \u0275\u0275element(90, "input", 50);
      \u0275\u0275elementStart(91, "div", 51);
      \u0275\u0275template(92, CatalogoModulosComponent_Conditional_92_Template, 2, 1, "p", 18);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(93, "div", 31)(94, "button", 32);
      \u0275\u0275listener("click", function CatalogoModulosComponent_Template_button_click_94_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.cerrarPermiso());
      });
      \u0275\u0275text(95, "Cancelar");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(96, "button", 33);
      \u0275\u0275text(97);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275element(98, "app-dialogo-confirmacion", 52);
    }
    if (rf & 2) {
      let tmp_3_0;
      let tmp_5_0;
      let tmp_8_0;
      let tmp_10_0;
      let tmp_13_0;
      let tmp_22_0;
      let tmp_23_0;
      let tmp_25_0;
      let tmp_28_0;
      let tmp_30_0;
      let tmp_32_0;
      let tmp_36_0;
      let tmp_37_0;
      let tmp_38_0;
      \u0275\u0275advance(3);
      \u0275\u0275property("appHasPermission", "roles.crear");
      \u0275\u0275advance(2);
      \u0275\u0275conditional((tmp_3_0 = ctx.aviso()) ? 5 : -1, tmp_3_0);
      \u0275\u0275advance();
      \u0275\u0275attribute("aria-busy", ctx.cargando());
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_5_0 = ctx.errorCarga()) ? 7 : ctx.cargando() ? 8 : !ctx.modulos().length ? 9 : 10, tmp_5_0);
      \u0275\u0275advance(4);
      \u0275\u0275property("titulo", ctx.moduloEditando() ? "Editar m\xF3dulo" : "Nuevo m\xF3dulo");
      \u0275\u0275advance(2);
      \u0275\u0275property("formGroup", ctx.formModulo);
      \u0275\u0275advance(2);
      \u0275\u0275conditional((tmp_8_0 = ctx.errorDialogo()) ? 15 : -1, tmp_8_0);
      \u0275\u0275advance(4);
      \u0275\u0275attribute("aria-invalid", !!ctx.error(ctx.formModulo.controls.nombre, "nombre"));
      \u0275\u0275advance(2);
      \u0275\u0275conditional((tmp_10_0 = ctx.error(ctx.formModulo.controls.nombre, "nombre")) ? 21 : -1, tmp_10_0);
      \u0275\u0275advance(4);
      \u0275\u0275property("readOnly", ctx.urlBloqueada());
      \u0275\u0275attribute("aria-invalid", !!ctx.error(ctx.formModulo.controls.url, "url"));
      \u0275\u0275advance(2);
      \u0275\u0275conditional((tmp_13_0 = ctx.error(ctx.formModulo.controls.url, "url")) ? 27 : -1, tmp_13_0);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1(" ", ctx.urlBloqueada() ? "No se puede cambiar porque las claves de sus permisos dependen de ella." : "Ruta del men\xFA lateral. Define tambi\xE9n el prefijo de las claves de sus permisos.", " ");
      \u0275\u0275advance(8);
      \u0275\u0275repeater(ctx.iconos);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.formModulo.controls.imagen.value ? 40 : -1);
      \u0275\u0275advance(6);
      \u0275\u0275property("disabled", ctx.enviando());
      \u0275\u0275attribute("aria-busy", ctx.enviando());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.enviando() ? "Guardando\u2026" : ctx.moduloEditando() ? "Guardar" : "Crear m\xF3dulo", " ");
      \u0275\u0275advance();
      \u0275\u0275property("titulo", ctx.permisoEditando() ? "Editar permiso" : "Nuevo permiso");
      \u0275\u0275advance(2);
      \u0275\u0275property("formGroup", ctx.formPermiso);
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate((tmp_22_0 = ctx.moduloDelPermiso()) == null ? null : tmp_22_0.nombre);
      \u0275\u0275advance(2);
      \u0275\u0275conditional((tmp_23_0 = ctx.errorDialogo()) ? 56 : -1, tmp_23_0);
      \u0275\u0275advance(4);
      \u0275\u0275attribute("aria-invalid", !!ctx.error(ctx.formPermiso.controls.nombre, "nombre"));
      \u0275\u0275advance(2);
      \u0275\u0275conditional((tmp_25_0 = ctx.error(ctx.formPermiso.controls.nombre, "nombre")) ? 62 : -1, tmp_25_0);
      \u0275\u0275advance(8);
      \u0275\u0275textInterpolate(ctx.prefijoClave());
      \u0275\u0275advance();
      \u0275\u0275attribute("aria-invalid", !!ctx.error(ctx.formPermiso.controls.accion, "accion", "clave"));
      \u0275\u0275advance(2);
      \u0275\u0275conditional((tmp_28_0 = ctx.error(ctx.formPermiso.controls.accion, "accion", "clave")) ? 73 : -1, tmp_28_0);
      \u0275\u0275advance(9);
      \u0275\u0275attribute("aria-invalid", !!ctx.error(ctx.formPermiso.controls.valor, "valor"));
      \u0275\u0275advance(2);
      \u0275\u0275conditional((tmp_30_0 = ctx.error(ctx.formPermiso.controls.valor, "valor")) ? 84 : -1, tmp_30_0);
      \u0275\u0275advance(6);
      \u0275\u0275attribute("aria-invalid", !!ctx.error(ctx.formPermiso.controls.comentario, "comentario"));
      \u0275\u0275advance(2);
      \u0275\u0275conditional((tmp_32_0 = ctx.error(ctx.formPermiso.controls.comentario, "comentario")) ? 92 : -1, tmp_32_0);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.enviando());
      \u0275\u0275attribute("aria-busy", ctx.enviando());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.enviando() ? "Guardando\u2026" : ctx.permisoEditando() ? "Guardar" : "Crear permiso", " ");
      \u0275\u0275advance();
      \u0275\u0275property("titulo", (((tmp_36_0 = ctx.porConfirmar()) == null ? null : tmp_36_0.estado) ? "Desactivar" : "Activar") + " el " + ((tmp_36_0 = (tmp_36_0 = ctx.porConfirmar()) == null ? null : tmp_36_0.tipo) !== null && tmp_36_0 !== void 0 ? tmp_36_0 : "") + " " + ((tmp_36_0 = (tmp_36_0 = ctx.porConfirmar()) == null ? null : tmp_36_0.nombre) !== null && tmp_36_0 !== void 0 ? tmp_36_0 : ""))("texto", ((tmp_37_0 = ctx.porConfirmar()) == null ? null : tmp_37_0.estado) ? ((tmp_37_0 = ctx.porConfirmar()) == null ? null : tmp_37_0.tipo) === "m\xF3dulo" ? "Dejar\xE1 de aparecer en el men\xFA de los roles que lo tienen asignado." : "Los roles que lo tienen dejar\xE1n de poder usarlo." : "Volver\xE1 a estar disponible para los roles que lo tienen asignado.")("confirmar", ((tmp_38_0 = ctx.porConfirmar()) == null ? null : tmp_38_0.estado) ? "Desactivar" : "Activar");
    }
  }, dependencies: [ReactiveFormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, MaxLengthValidator, FormGroupDirective, FormControlName, HasPermissionDirective, DialogoComponent, DialogoConfirmacionComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.encabezado[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: space-between;\n  gap: var(--espacio-3);\n  margin-bottom: var(--espacio-4);\n}\n.descripcion[_ngcontent-%COMP%], \n.sin-permisos[_ngcontent-%COMP%] {\n  margin: 0;\n  color: var(--neutro-500);\n}\n.modulos[_ngcontent-%COMP%] {\n  border: 1px solid var(--neutro-200);\n  border-radius: var(--radio-lg);\n}\n.modulo[_ngcontent-%COMP%]    + .modulo[_ngcontent-%COMP%] {\n  border-top: 1px solid var(--neutro-200);\n}\nsummary[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: var(--espacio-2) var(--espacio-3);\n  min-height: 3.5rem;\n  padding: var(--espacio-2) var(--espacio-4);\n  list-style: none;\n  cursor: pointer;\n}\nsummary[_ngcontent-%COMP%]::-webkit-details-marker {\n  display: none;\n}\nsummary[_ngcontent-%COMP%]:hover {\n  background: var(--neutro-50);\n}\nsummary[_ngcontent-%COMP%]:focus-visible {\n  outline-offset: -2px;\n}\n.icono-modulo[_ngcontent-%COMP%] {\n  display: grid;\n  flex: none;\n  place-items: center;\n  width: 2rem;\n  height: 2rem;\n  border-radius: var(--radio-sm);\n  background: var(--neutro-100);\n  color: var(--neutro-700);\n}\n.modulo-titulo[_ngcontent-%COMP%] {\n  display: flex;\n  flex: 1 1 12rem;\n  flex-direction: column;\n  min-width: 0;\n}\n.modulo-nombre[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n.registro-inactivo[_ngcontent-%COMP%]   .modulo-nombre[_ngcontent-%COMP%] {\n  font-weight: 500;\n}\n.modulo-url[_ngcontent-%COMP%], \n.modulo-conteo[_ngcontent-%COMP%] {\n  color: var(--neutro-500);\n  font-size: 0.8125rem;\n}\n.desplegar[_ngcontent-%COMP%] {\n  transition: transform 0.15s;\n}\n[open][_ngcontent-%COMP%]    > summary[_ngcontent-%COMP%]   .desplegar[_ngcontent-%COMP%] {\n  transform: rotate(180deg);\n}\n.modulo-cuerpo[_ngcontent-%COMP%] {\n  padding: 0 var(--espacio-4) var(--espacio-4);\n}\n.modulo-acciones[_ngcontent-%COMP%], \n.acciones[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: var(--espacio-2);\n}\n.modulo-acciones[_ngcontent-%COMP%] {\n  margin-bottom: var(--espacio-3);\n}\n.acciones[_ngcontent-%COMP%] {\n  justify-content: flex-end;\n  gap: 2px;\n}\n@media (max-width: 768px) {\n  .acciones[_ngcontent-%COMP%] {\n    justify-content: flex-start;\n  }\n}\n.selector-icono[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: var(--espacio-3);\n}\n.vista-previa[_ngcontent-%COMP%] {\n  width: var(--alto-control);\n  height: var(--alto-control);\n}\n.fila[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 0 var(--espacio-3);\n}\n.opcional[_ngcontent-%COMP%] {\n  color: var(--neutro-500);\n  font-weight: 400;\n}\n@media (max-width: 600px) {\n  .fila[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .desplegar[_ngcontent-%COMP%] {\n    transition: none;\n  }\n}\n/*# sourceMappingURL=catalogo-modulos.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CatalogoModulosComponent, { className: "CatalogoModulosComponent", filePath: "src\\app\\pages\\seguridad\\roles\\catalogo-modulos\\catalogo-modulos.component.ts", lineNumber: 50 });
})();

// src/app/pages/seguridad/roles/lista-roles/lista-roles.component.ts
var _c04 = ["dialogoNombre"];
var _forTrack05 = ($index, $item) => $item.id;
var _c13 = (a0) => ["/roles", a0, "accesos"];
function ListaRolesComponent_button_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 22);
    \u0275\u0275listener("click", function ListaRolesComponent_button_3_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.abrirNombre(null));
    });
    \u0275\u0275elementStart(1, "span", 23);
    \u0275\u0275text(2, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Nuevo rol ");
    \u0275\u0275elementEnd();
  }
}
function ListaRolesComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 24)(1, "span", 23);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const aviso_r4 = ctx;
    \u0275\u0275classProp("alert-exito", aviso_r4.tipo === "exito")("alert-error", aviso_r4.tipo === "error");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(aviso_r4.tipo === "exito" ? "check_circle" : "error");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(aviso_r4.texto);
  }
}
function ListaRolesComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6)(1, "span", 23);
    \u0275\u0275text(2, "error");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("No se pudieron cargar los roles. ", ctx, "");
  }
}
function ListaRolesComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 25);
    \u0275\u0275text(1, "Cargando roles\u2026");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 26);
    \u0275\u0275element(3, "span")(4, "span")(5, "span");
    \u0275\u0275elementEnd();
  }
}
function ListaRolesComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7)(1, "p");
    \u0275\u0275text(2, "Todav\xEDa no hay roles.");
    \u0275\u0275elementEnd()();
  }
}
function ListaRolesComponent_Conditional_10_th_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 31)(1, "span", 28);
    \u0275\u0275text(2, "Acciones");
    \u0275\u0275elementEnd()();
  }
}
function ListaRolesComponent_Conditional_10_For_17_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 36);
    \u0275\u0275text(1, "Rol del sistema");
    \u0275\u0275elementEnd();
  }
}
function ListaRolesComponent_Conditional_10_For_17_td_13_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 44);
    \u0275\u0275listener("click", function ListaRolesComponent_Conditional_10_For_17_td_13_Conditional_8_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const rol_r6 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.abrirNombre(rol_r6));
    });
    \u0275\u0275elementStart(1, "span", 23);
    \u0275\u0275text(2, "edit");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(3, "button", 45);
    \u0275\u0275listener("click", function ListaRolesComponent_Conditional_10_For_17_td_13_Conditional_8_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r5);
      const rol_r6 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.cambiarEstado(rol_r6));
    });
    \u0275\u0275elementStart(4, "span", 23);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const rol_r6 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275attribute("aria-label", "Editar nombre de " + rol_r6.nombre);
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r2.procesando() === rol_r6.id);
    \u0275\u0275attribute("aria-label", (rol_r6.estado ? "Desactivar " : "Activar ") + rol_r6.nombre)("title", rol_r6.estado ? "Desactivar" : "Activar");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(rol_r6.estado ? "toggle_off" : "toggle_on");
  }
}
function ListaRolesComponent_Conditional_10_For_17_td_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 37)(1, "div", 42)(2, "a", 43)(3, "span", 23);
    \u0275\u0275text(4, "tune");
    \u0275\u0275elementEnd();
    \u0275\u0275text(5, " Configurar accesos");
    \u0275\u0275elementStart(6, "span", 28);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(8, ListaRolesComponent_Conditional_10_For_17_td_13_Conditional_8_Template, 6, 5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const rol_r6 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(3, _c13, rol_r6.id));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" de ", rol_r6.nombre, "");
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r2.esAdministrador(rol_r6) ? 8 : -1);
  }
}
function ListaRolesComponent_Conditional_10_For_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 34);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th", 35);
    \u0275\u0275text(4);
    \u0275\u0275template(5, ListaRolesComponent_Conditional_10_For_17_Conditional_5_Template, 2, 0, "span", 36);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td", 37)(7, "span", 38);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "td", 39);
    \u0275\u0275text(10);
    \u0275\u0275elementStart(11, "span", 40);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(13, ListaRolesComponent_Conditional_10_For_17_td_13_Template, 9, 5, "td", 41);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const rol_r6 = ctx.$implicit;
    const \u0275$index_87_r7 = ctx.$index;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("registro-inactivo", !rol_r6.estado);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275$index_87_r7 + 1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", rol_r6.nombre, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.esAdministrador(rol_r6) ? 5 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("badge-exito", rol_r6.estado);
    \u0275\u0275attribute("data-estado", rol_r6.estado ? "Activo" : "Inactivo");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(rol_r6.estado ? "Activo" : "Inactivo");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(rol_r6.usuarios);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", rol_r6.usuarios === 1 ? "usuario" : "usuarios", "");
    \u0275\u0275advance();
    \u0275\u0275property("appHasPermission", "roles.editar");
  }
}
function ListaRolesComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8)(1, "table", 27)(2, "caption", 28);
    \u0275\u0275text(3, "Roles del sistema");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "thead")(5, "tr")(6, "th", 29);
    \u0275\u0275text(7, "N.\xBA");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 30);
    \u0275\u0275text(9, "Nombre");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 31);
    \u0275\u0275text(11, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 31);
    \u0275\u0275text(13, "Usuarios");
    \u0275\u0275elementEnd();
    \u0275\u0275template(14, ListaRolesComponent_Conditional_10_th_14_Template, 3, 0, "th", 32);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "tbody");
    \u0275\u0275repeaterCreate(16, ListaRolesComponent_Conditional_10_For_17_Template, 14, 12, "tr", 33, _forTrack05);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(14);
    \u0275\u0275property("appHasPermission", "roles.editar");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r2.roles());
  }
}
function ListaRolesComponent_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12)(1, "span", 23);
    \u0275\u0275text(2, "error");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx);
  }
}
function ListaRolesComponent_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
var ROL_ADMINISTRADOR = "Administrador";
var ListaRolesComponent = class _ListaRolesComponent {
  rolesService = inject(RolesService);
  dialogoNombre = viewChild.required("dialogoNombre");
  confirmacion = viewChild.required(DialogoConfirmacionComponent);
  roles = signal([]);
  cargando = signal(true);
  errorCarga = signal(null);
  aviso = signal(null);
  procesando = signal(null);
  porConfirmar = signal(null);
  /** null: creando un rol nuevo. */
  editando = signal(null);
  enviando = signal(false);
  errorNombre = signal(null);
  errorDialogo = signal(null);
  form = inject(NonNullableFormBuilder).group({
    nombre: ["", [Validators.required, Validators.maxLength(50)]]
  });
  constructor() {
    afterNextRender(() => this.cargar());
    this.form.controls.nombre.valueChanges.subscribe(() => this.errorNombre.set(null));
  }
  /** Rol del sistema: no se renombra ni se desactiva (el backend responde 409). */
  esAdministrador(rol) {
    return rol.nombre === ROL_ADMINISTRADOR;
  }
  abrirNombre(rol) {
    this.editando.set(rol);
    this.form.reset({ nombre: rol?.nombre ?? "" });
    this.errorNombre.set(null);
    this.errorDialogo.set(null);
    this.dialogoNombre().abrir();
  }
  cerrarNombre() {
    this.dialogoNombre().cerrar();
  }
  mensajeNombre() {
    const control = this.form.controls.nombre;
    if (this.errorNombre())
      return this.errorNombre();
    if (!control.touched || control.valid)
      return null;
    return control.hasError("required") ? "Ingresa el nombre del rol." : "M\xE1ximo 50 caracteres.";
  }
  guardarNombre() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const rol = this.editando();
    const nombre = this.form.getRawValue().nombre.trim();
    this.enviando.set(true);
    this.errorDialogo.set(null);
    const peticion = rol ? this.rolesService.actualizar(rol.id, { nombre }) : this.rolesService.crear({ nombre });
    peticion.subscribe({
      next: () => {
        this.enviando.set(false);
        this.dialogoNombre().cerrar();
        this.aviso.set({ tipo: "exito", texto: rol ? `El rol ahora se llama ${nombre}.` : `Se cre\xF3 el rol ${nombre}. Configura sus accesos.` });
        this.cargar();
      },
      error: (error) => {
        this.enviando.set(false);
        if (error.status === 422 && error.errores["nombre"]?.length) {
          this.errorNombre.set(error.errores["nombre"][0]);
        } else {
          this.errorDialogo.set(error.mensaje);
        }
      }
    });
  }
  cambiarEstado(rol) {
    return __async(this, null, function* () {
      this.porConfirmar.set(rol);
      if (!(yield this.confirmacion().abrir()))
        return;
      const activar = !rol.estado;
      this.ejecutar(rol, this.rolesService.cambiarEstado(rol.id, activar), `El rol ${rol.nombre} fue ${activar ? "activado" : "desactivado"}.`);
    });
  }
  ejecutar(rol, accion, exito) {
    this.procesando.set(rol.id);
    this.aviso.set(null);
    accion.subscribe({
      next: () => {
        this.procesando.set(null);
        this.aviso.set({ tipo: "exito", texto: exito });
        this.cargar();
      },
      error: (error) => {
        this.procesando.set(null);
        this.aviso.set({ tipo: "error", texto: error.mensaje });
      }
    });
  }
  cargar() {
    this.rolesService.listar().subscribe({
      next: (roles) => {
        this.roles.set(roles);
        this.cargando.set(false);
        this.errorCarga.set(null);
      },
      error: (error) => {
        this.cargando.set(false);
        this.errorCarga.set(error.mensaje);
      }
    });
  }
  static \u0275fac = function ListaRolesComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ListaRolesComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ListaRolesComponent, selectors: [["app-lista-roles"]], viewQuery: function ListaRolesComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuerySignal(ctx.dialogoNombre, _c04, 5);
      \u0275\u0275viewQuerySignal(ctx.confirmacion, DialogoConfirmacionComponent, 5);
    }
    if (rf & 2) {
      \u0275\u0275queryAdvance(2);
    }
  }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 28, vars: 15, consts: [["dialogoNombre", ""], [1, "encabezado"], [1, "descripcion"], ["type", "button", "class", "btn btn-primary", 3, "click", 4, "appHasPermission"], ["role", "status"], [1, "alert", 3, "alert-exito", "alert-error"], ["role", "alert", 1, "alert", "alert-error"], [1, "card", "estado-vacio"], [1, "tabla-caja"], [3, "titulo"], ["novalidate", "", 3, "ngSubmit", "formGroup"], ["role", "alert"], [1, "alert", "alert-error"], [1, "form-field"], ["for", "nombre-rol"], ["id", "nombre-rol", "type", "text", "formControlName", "nombre", "autocomplete", "off", "autofocus", "", "maxlength", "50", "aria-required", "true", "aria-describedby", "nombre-rol-error", 1, "input"], ["id", "nombre-rol-error", "aria-live", "polite"], [1, "error-text"], [1, "dialogo-acciones"], ["type", "button", 1, "btn", 3, "click"], ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"], [3, "titulo", "texto", "confirmar"], ["type", "button", 1, "btn", "btn-primary", 3, "click"], ["aria-hidden", "true", 1, "material-symbols-outlined"], [1, "alert"], ["role", "status", 1, "sr-only"], ["aria-hidden", "true", 1, "esqueleto"], [1, "table", "table-apilable"], [1, "sr-only"], ["scope", "col", 1, "col-centro", "col-numero"], ["scope", "col"], ["scope", "col", 1, "col-centro"], ["scope", "col", "class", "col-centro", 4, "appHasPermission"], [3, "registro-inactivo"], ["data-label", "N.\xBA", 1, "col-centro", "col-numero"], ["scope", "row", 1, "rol-nombre"], [1, "rol-sistema"], [1, "col-centro"], [1, "badge"], [1, "col-centro", "dato"], [1, "etiqueta-movil"], ["class", "col-centro", 4, "appHasPermission"], [1, "rol-acciones"], [1, "btn", 3, "routerLink"], ["type", "button", "title", "Editar nombre", 1, "btn", "btn-icono", "btn-sin-borde", 3, "click"], ["type", "button", 1, "btn", "btn-icono", "btn-sin-borde", 3, "click", "disabled"]], template: function ListaRolesComponent_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "div", 1)(1, "p", 2);
      \u0275\u0275text(2, "Cada rol re\xFAne los m\xF3dulos y permisos de un grupo de usuarios.");
      \u0275\u0275elementEnd();
      \u0275\u0275template(3, ListaRolesComponent_button_3_Template, 4, 0, "button", 3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "div", 4);
      \u0275\u0275template(5, ListaRolesComponent_Conditional_5_Template, 5, 6, "div", 5);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "div");
      \u0275\u0275template(7, ListaRolesComponent_Conditional_7_Template, 5, 1, "div", 6)(8, ListaRolesComponent_Conditional_8_Template, 6, 0)(9, ListaRolesComponent_Conditional_9_Template, 3, 0, "div", 7)(10, ListaRolesComponent_Conditional_10_Template, 18, 1, "div", 8);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "app-dialogo", 9, 0)(13, "form", 10);
      \u0275\u0275listener("ngSubmit", function ListaRolesComponent_Template_form_ngSubmit_13_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.guardarNombre());
      });
      \u0275\u0275elementStart(14, "div", 11);
      \u0275\u0275template(15, ListaRolesComponent_Conditional_15_Template, 5, 1, "div", 12);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "div", 13)(17, "label", 14);
      \u0275\u0275text(18, "Nombre");
      \u0275\u0275elementEnd();
      \u0275\u0275element(19, "input", 15);
      \u0275\u0275elementStart(20, "div", 16);
      \u0275\u0275template(21, ListaRolesComponent_Conditional_21_Template, 2, 1, "p", 17);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(22, "div", 18)(23, "button", 19);
      \u0275\u0275listener("click", function ListaRolesComponent_Template_button_click_23_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.cerrarNombre());
      });
      \u0275\u0275text(24, "Cancelar");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "button", 20);
      \u0275\u0275text(26);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275element(27, "app-dialogo-confirmacion", 21);
    }
    if (rf & 2) {
      let tmp_2_0;
      let tmp_4_0;
      let tmp_7_0;
      let tmp_9_0;
      let tmp_13_0;
      let tmp_14_0;
      let tmp_15_0;
      \u0275\u0275advance(3);
      \u0275\u0275property("appHasPermission", "roles.crear");
      \u0275\u0275advance(2);
      \u0275\u0275conditional((tmp_2_0 = ctx.aviso()) ? 5 : -1, tmp_2_0);
      \u0275\u0275advance();
      \u0275\u0275attribute("aria-busy", ctx.cargando());
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_4_0 = ctx.errorCarga()) ? 7 : ctx.cargando() ? 8 : !ctx.roles().length ? 9 : 10, tmp_4_0);
      \u0275\u0275advance(4);
      \u0275\u0275property("titulo", ctx.editando() ? "Editar nombre del rol" : "Nuevo rol");
      \u0275\u0275advance(2);
      \u0275\u0275property("formGroup", ctx.form);
      \u0275\u0275advance(2);
      \u0275\u0275conditional((tmp_7_0 = ctx.errorDialogo()) ? 15 : -1, tmp_7_0);
      \u0275\u0275advance(4);
      \u0275\u0275attribute("aria-invalid", !!ctx.mensajeNombre());
      \u0275\u0275advance(2);
      \u0275\u0275conditional((tmp_9_0 = ctx.mensajeNombre()) ? 21 : -1, tmp_9_0);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.enviando());
      \u0275\u0275attribute("aria-busy", ctx.enviando());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.enviando() ? "Guardando\u2026" : ctx.editando() ? "Guardar" : "Crear rol", " ");
      \u0275\u0275advance();
      \u0275\u0275property("titulo", (((tmp_13_0 = ctx.porConfirmar()) == null ? null : tmp_13_0.estado) ? "Desactivar" : "Activar") + " el rol " + ((tmp_13_0 = (tmp_13_0 = ctx.porConfirmar()) == null ? null : tmp_13_0.nombre) !== null && tmp_13_0 !== void 0 ? tmp_13_0 : ""))("texto", ((tmp_14_0 = ctx.porConfirmar()) == null ? null : tmp_14_0.estado) ? "Sus " + ((tmp_14_0 = (tmp_14_0 = ctx.porConfirmar()) == null ? null : tmp_14_0.usuarios) !== null && tmp_14_0 !== void 0 ? tmp_14_0 : 0) + " usuarios dejar\xE1n de tener los accesos de este rol." : "Sus usuarios recuperar\xE1n los accesos de este rol.")("confirmar", ((tmp_15_0 = ctx.porConfirmar()) == null ? null : tmp_15_0.estado) ? "Desactivar" : "Activar");
    }
  }, dependencies: [ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, MaxLengthValidator, FormGroupDirective, FormControlName, RouterLink, HasPermissionDirective, DialogoComponent, DialogoConfirmacionComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.encabezado[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: space-between;\n  gap: var(--espacio-3);\n  margin-bottom: var(--espacio-4);\n}\n.descripcion[_ngcontent-%COMP%] {\n  margin: 0;\n  color: var(--neutro-500);\n}\n.tabla-caja[_ngcontent-%COMP%] {\n  border: 1px solid var(--neutro-200);\n  border-radius: var(--radio-lg);\n}\n.tabla-caja[_ngcontent-%COMP%]   .table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]:first-child {\n  padding-left: var(--espacio-4);\n}\n.rol-nombre[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n.rol-sistema[_ngcontent-%COMP%] {\n  display: block;\n  color: var(--neutro-500);\n  font-size: 0.8125rem;\n  font-weight: 400;\n}\n.registro-inactivo[_ngcontent-%COMP%]   .rol-nombre[_ngcontent-%COMP%] {\n  font-weight: 500;\n}\n.rol-acciones[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  gap: var(--espacio-1);\n}\n.etiqueta-movil[_ngcontent-%COMP%] {\n  display: none;\n}\n@media (max-width: 768px) {\n  .table[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]    > [_ngcontent-%COMP%]:first-child {\n    flex-basis: auto;\n  }\n  .etiqueta-movil[_ngcontent-%COMP%] {\n    display: inline;\n  }\n  .rol-acciones[_ngcontent-%COMP%] {\n    justify-content: flex-start;\n  }\n}\n/*# sourceMappingURL=lista-roles.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ListaRolesComponent, { className: "ListaRolesComponent", filePath: "src\\app\\pages\\seguridad\\roles\\lista-roles\\lista-roles.component.ts", lineNumber: 27 });
})();

// src/app/pages/seguridad/roles/roles-permisos/roles-permisos.component.ts
function RolesPermisosComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-lista-roles");
  }
}
function RolesPermisosComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-catalogo-modulos");
  }
}
var PESTANAS = ["roles", "modulos"];
var RolesPermisosComponent = class _RolesPermisosComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);
  pestana = signal(this.route.snapshot.queryParamMap.get("pestana") === "modulos" ? "modulos" : "roles");
  seleccionar(pestana) {
    this.pestana.set(pestana);
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { pestana: pestana === "roles" ? null : pestana },
      replaceUrl: true
    });
  }
  /** Flechas, Inicio y Fin mueven la selección y el foco entre pestañas. */
  alTeclear(evento) {
    const actual = PESTANAS.indexOf(this.pestana());
    const destino = {
      ArrowRight: (actual + 1) % PESTANAS.length,
      ArrowLeft: (actual - 1 + PESTANAS.length) % PESTANAS.length,
      Home: 0,
      End: PESTANAS.length - 1
    }[evento.key];
    if (destino === void 0)
      return;
    evento.preventDefault();
    this.seleccionar(PESTANAS[destino]);
    evento.currentTarget.querySelector(`#pestana-${PESTANAS[destino]}`)?.focus();
  }
  static \u0275fac = function RolesPermisosComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RolesPermisosComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RolesPermisosComponent, selectors: [["app-roles-permisos"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 11, vars: 8, consts: [["title", "Roles y Permisos"], ["role", "tablist", "aria-label", "Roles y permisos", 1, "pestanas", 3, "keydown"], ["type", "button", "role", "tab", "id", "pestana-roles", "aria-controls", "panel-roles", 3, "click"], ["type", "button", "role", "tab", "id", "pestana-modulos", "aria-controls", "panel-modulos", 3, "click"], ["role", "tabpanel", "id", "panel-roles", "aria-labelledby", "pestana-roles", 3, "hidden"], ["role", "tabpanel", "id", "panel-modulos", "aria-labelledby", "pestana-modulos", 3, "hidden"]], template: function RolesPermisosComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section");
      \u0275\u0275element(1, "app-page-title", 0);
      \u0275\u0275elementStart(2, "div", 1);
      \u0275\u0275listener("keydown", function RolesPermisosComponent_Template_div_keydown_2_listener($event) {
        return ctx.alTeclear($event);
      });
      \u0275\u0275elementStart(3, "button", 2);
      \u0275\u0275listener("click", function RolesPermisosComponent_Template_button_click_3_listener() {
        return ctx.seleccionar("roles");
      });
      \u0275\u0275text(4, "Roles");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "button", 3);
      \u0275\u0275listener("click", function RolesPermisosComponent_Template_button_click_5_listener() {
        return ctx.seleccionar("modulos");
      });
      \u0275\u0275text(6, "M\xF3dulos y permisos");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(7, "div", 4);
      \u0275\u0275template(8, RolesPermisosComponent_Conditional_8_Template, 1, 0, "app-lista-roles");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "div", 5);
      \u0275\u0275template(10, RolesPermisosComponent_Conditional_10_Template, 1, 0, "app-catalogo-modulos");
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275attribute("aria-selected", ctx.pestana() === "roles")("tabindex", ctx.pestana() === "roles" ? 0 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275attribute("aria-selected", ctx.pestana() === "modulos")("tabindex", ctx.pestana() === "modulos" ? 0 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275property("hidden", ctx.pestana() !== "roles");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.pestana() === "roles" ? 8 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("hidden", ctx.pestana() !== "modulos");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.pestana() === "modulos" ? 10 : -1);
    }
  }, dependencies: [PageTitleComponent, ListaRolesComponent, CatalogoModulosComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n/*# sourceMappingURL=roles-permisos.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RolesPermisosComponent, { className: "RolesPermisosComponent", filePath: "src\\app\\pages\\seguridad\\roles\\roles-permisos\\roles-permisos.component.ts", lineNumber: 19 });
})();

// src/app/models/roles/matriz-accesos.model.ts
var ACCIONES_BASICAS = ["ver", "crear", "editar", "eliminar"];
var DEPENDEN_DE_VER = ["crear", "editar", "eliminar"];
function accionDe(permiso) {
  return permiso.clave.slice(permiso.clave.lastIndexOf(".") + 1);
}
function filasDeMatriz(modulos) {
  return modulos.map((modulo) => {
    const basicos = { ver: null, crear: null, editar: null, eliminar: null };
    const otros = [];
    for (const permiso of modulo.permisos) {
      const accion = accionDe(permiso);
      if (ACCIONES_BASICAS.includes(accion) && !basicos[accion]) {
        basicos[accion] = permiso;
      } else {
        otros.push(permiso);
      }
    }
    return { modulo, basicos, otros: otros.sort((a, b) => a.nombre.localeCompare(b.nombre, "es")) };
  });
}
function crearEstado(modulos, permisos) {
  return { modulos: new Set(modulos), permisos: new Set(permisos.map((permiso) => permiso.idPermiso)) };
}
function cambiarAccesoModulo(estado, modulo, activo) {
  const modulos = new Set(estado.modulos);
  const permisos = new Set(estado.permisos);
  if (activo) {
    modulos.add(modulo.id);
  } else {
    modulos.delete(modulo.id);
    modulo.permisos.forEach((permiso) => permisos.delete(permiso.id));
  }
  return { modulos, permisos };
}
function cambiarPermiso(estado, modulo, permiso, marcado) {
  const modulos = new Set(estado.modulos);
  const permisos = new Set(estado.permisos);
  const accion = accionDe(permiso);
  const deAccion = (nombre) => modulo.permisos.filter((p) => accionDe(p) === nombre);
  if (marcado) {
    permisos.add(permiso.id);
    modulos.add(modulo.id);
    if (DEPENDEN_DE_VER.includes(accion)) {
      deAccion("ver").forEach((ver) => permisos.add(ver.id));
    }
  } else {
    permisos.delete(permiso.id);
    if (accion === "ver") {
      DEPENDEN_DE_VER.flatMap(deAccion).forEach((dependiente) => permisos.delete(dependiente.id));
    }
  }
  return { modulos, permisos };
}
function mismoEstado(a, b) {
  const igual = (x, y) => x.size === y.size && [...x].every((id) => y.has(id));
  return igual(a.modulos, b.modulos) && igual(a.permisos, b.permisos);
}
function aPayload(estado, catalogo) {
  const modulos = [...estado.modulos].sort((a, b) => a - b);
  const permisos = catalogo.filter((modulo) => estado.modulos.has(modulo.id)).flatMap((modulo) => modulo.permisos.filter((permiso) => estado.permisos.has(permiso.id)).map((permiso) => ({ idModulo: modulo.id, idPermiso: permiso.id })));
  return { modulos, permisos };
}

// src/app/pages/seguridad/roles/accesos-rol/accesos-rol.component.ts
var _forTrack06 = ($index, $item) => $item.modulo.id;
var _forTrack12 = ($index, $item) => $item.id;
function AccesosRolComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 6);
    \u0275\u0275text(1, "Cargando accesos\u2026");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 7);
    \u0275\u0275element(3, "span")(4, "span")(5, "span")(6, "span")(7, "span");
    \u0275\u0275elementEnd();
  }
}
function AccesosRolComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4)(1, "span", 2);
    \u0275\u0275text(2, "error");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.errorCarga());
  }
}
function AccesosRolComponent_Conditional_8_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8)(1, "span", 2);
    \u0275\u0275text(2, "warning");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4, "Algunos accesos de este rol est\xE1n protegidos para no dejar el sistema sin administraci\xF3n.");
    \u0275\u0275elementEnd()();
  }
}
function AccesosRolComponent_Conditional_8_Conditional_2_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "br");
    \u0275\u0275text(1);
  }
  if (rf & 2) {
    const detalle_r3 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", detalle_r3, " ");
  }
}
function AccesosRolComponent_Conditional_8_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20)(1, "span", 2);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275repeaterCreate(5, AccesosRolComponent_Conditional_8_Conditional_2_For_6_Template, 2, 1, null, null, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const aviso_r4 = ctx;
    \u0275\u0275classProp("alert-exito", aviso_r4.tipo === "exito")("alert-error", aviso_r4.tipo === "error");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(aviso_r4.tipo === "exito" ? "check_circle" : "error");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", aviso_r4.texto, " ");
    \u0275\u0275advance();
    \u0275\u0275repeater(aviso_r4.detalle);
  }
}
function AccesosRolComponent_Conditional_8_For_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 14);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const accion_r5 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.titulos[accion_r5]);
  }
}
function AccesosRolComponent_Conditional_8_For_20_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 24);
    \u0275\u0275text(1, "Inactivo");
    \u0275\u0275elementEnd();
  }
}
function AccesosRolComponent_Conditional_8_For_20_For_15_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 26)(1, "input", 33);
    \u0275\u0275listener("change", function AccesosRolComponent_Conditional_8_For_20_For_15_Conditional_1_Template_input_change_1_listener($event) {
      const permiso_r9 = \u0275\u0275restoreView(_r8);
      const fila_r7 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.alternarPermiso(fila_r7.modulo, permiso_r9, $event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span", 28);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 13);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const permiso_r9 = ctx;
    const accion_r10 = \u0275\u0275nextContext().$implicit;
    const fila_r7 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("registro-inactivo", !permiso_r9.estado);
    \u0275\u0275advance();
    \u0275\u0275property("checked", ctx_r0.tienePermiso(permiso_r9));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.titulos[accion_r10]);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2(" en ", fila_r7.modulo.nombre, "", permiso_r9.estado ? "" : " (inactivo)", "");
  }
}
function AccesosRolComponent_Conditional_8_For_20_For_15_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 32);
    \u0275\u0275text(1, "\u2014");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span", 13);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const accion_r10 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", ctx_r0.titulos[accion_r10], ": no aplica");
  }
}
function AccesosRolComponent_Conditional_8_For_20_For_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 29);
    \u0275\u0275template(1, AccesosRolComponent_Conditional_8_For_20_For_15_Conditional_1_Template, 6, 6, "label", 31)(2, AccesosRolComponent_Conditional_8_For_20_For_15_Conditional_2_Template, 4, 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_21_0;
    const accion_r10 = ctx.$implicit;
    const fila_r7 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_21_0 = fila_r7.basicos[accion_r10]) ? 1 : 2, tmp_21_0);
  }
}
function AccesosRolComponent_Conditional_8_For_20_For_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 26)(1, "input", 33);
    \u0275\u0275listener("change", function AccesosRolComponent_Conditional_8_For_20_For_19_Template_input_change_1_listener($event) {
      const permiso_r12 = \u0275\u0275restoreView(_r11).$implicit;
      const fila_r7 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.alternarPermiso(fila_r7.modulo, permiso_r12, $event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 13);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const permiso_r12 = ctx.$implicit;
    const fila_r7 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("registro-inactivo", !permiso_r12.estado);
    \u0275\u0275advance();
    \u0275\u0275property("checked", ctx_r0.tienePermiso(permiso_r12));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(permiso_r12.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2(" en ", fila_r7.modulo.nombre, "", permiso_r12.estado ? "" : " (inactivo)", "");
  }
}
function AccesosRolComponent_Conditional_8_For_20_ForEmpty_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 32);
    \u0275\u0275text(1, "\u2014");
    \u0275\u0275elementEnd();
  }
}
function AccesosRolComponent_Conditional_8_For_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "th", 21)(2, "span", 22);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 23);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, AccesosRolComponent_Conditional_8_For_20_Conditional_6_Template, 2, 0, "span", 24);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 25)(8, "label", 26)(9, "input", 27);
    \u0275\u0275listener("change", function AccesosRolComponent_Conditional_8_For_20_Template_input_change_9_listener($event) {
      const fila_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.alternarModulo(fila_r7.modulo, $event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "span", 28);
    \u0275\u0275text(11, "Acceso al m\xF3dulo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "span", 13);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()()();
    \u0275\u0275repeaterCreate(14, AccesosRolComponent_Conditional_8_For_20_For_15_Template, 3, 1, "td", 29, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementStart(16, "td")(17, "div", 30);
    \u0275\u0275repeaterCreate(18, AccesosRolComponent_Conditional_8_For_20_For_19_Template, 6, 6, "label", 31, _forTrack12, false, AccesosRolComponent_Conditional_8_For_20_ForEmpty_20_Template, 2, 0, "span", 32);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const fila_r7 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("sin-acceso", !ctx_r0.tieneModulo(fila_r7.modulo))("registro-inactivo", !fila_r7.modulo.estado);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(fila_r7.modulo.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(fila_r7.modulo.url);
    \u0275\u0275advance();
    \u0275\u0275conditional(!fila_r7.modulo.estado ? 6 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275property("checked", ctx_r0.tieneModulo(fila_r7.modulo));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", fila_r7.modulo.nombre, "");
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.acciones);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(fila_r7.otros);
  }
}
function AccesosRolComponent_Conditional_8_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 2);
    \u0275\u0275text(1, "warning");
    \u0275\u0275elementEnd();
    \u0275\u0275text(2, " Hay cambios sin guardar ");
  }
}
function AccesosRolComponent_Conditional_8_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Sin cambios pendientes ");
  }
}
function AccesosRolComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275template(0, AccesosRolComponent_Conditional_8_Conditional_0_Template, 5, 0, "div", 8);
    \u0275\u0275elementStart(1, "div", 9);
    \u0275\u0275template(2, AccesosRolComponent_Conditional_8_Conditional_2_Template, 7, 6, "div", 10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 11);
    \u0275\u0275text(4, " El acceso hace que el m\xF3dulo aparezca en el men\xFA del rol. Crear, editar y eliminar incluyen ver; marcar un permiso concede tambi\xE9n el acceso al m\xF3dulo. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "table", 12)(6, "caption", 13);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "thead")(9, "tr")(10, "th", 14);
    \u0275\u0275text(11, "M\xF3dulo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 14);
    \u0275\u0275text(13, "Acceso");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(14, AccesosRolComponent_Conditional_8_For_15_Template, 2, 1, "th", 14, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementStart(16, "th", 14);
    \u0275\u0275text(17, "Otros permisos");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "tbody");
    \u0275\u0275repeaterCreate(19, AccesosRolComponent_Conditional_8_For_20_Template, 21, 10, "tr", 15, _forTrack06);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "div", 16)(22, "p", 17);
    \u0275\u0275template(23, AccesosRolComponent_Conditional_8_Conditional_23_Template, 3, 0)(24, AccesosRolComponent_Conditional_8_Conditional_24_Template, 1, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "button", 18);
    \u0275\u0275listener("click", function AccesosRolComponent_Conditional_8_Template_button_click_25_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.descartar());
    });
    \u0275\u0275text(26, "Descartar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "button", 19);
    \u0275\u0275listener("click", function AccesosRolComponent_Conditional_8_Template_button_click_27_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.guardar());
    });
    \u0275\u0275text(28);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r0.esAdministrador() ? 0 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_2_0 = ctx_r0.aviso()) ? 2 : -1, tmp_2_0);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("Accesos del rol ", (tmp_3_0 = ctx_r0.rol()) == null ? null : tmp_3_0.nombre, " por m\xF3dulo");
    \u0275\u0275advance(7);
    \u0275\u0275repeater(ctx_r0.acciones);
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r0.filas());
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r0.hayCambios() ? 23 : 24);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !ctx_r0.hayCambios() || ctx_r0.guardando());
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !ctx_r0.hayCambios() || ctx_r0.guardando());
    \u0275\u0275attribute("aria-busy", ctx_r0.guardando());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.guardando() ? "Guardando\u2026" : "Guardar cambios", " ");
  }
}
var ROL_ADMINISTRADOR2 = "Administrador";
var TITULOS = { ver: "Ver", crear: "Crear", editar: "Editar", eliminar: "Eliminar" };
var AccesosRolComponent = class _AccesosRolComponent {
  rolesService = inject(RolesService);
  modulosService = inject(ModulosService);
  auth = inject(AuthService);
  idRol = Number(inject(ActivatedRoute).snapshot.paramMap.get("id"));
  confirmacion = viewChild.required(DialogoConfirmacionComponent);
  acciones = ACCIONES_BASICAS;
  titulos = TITULOS;
  rol = signal(null);
  catalogo = signal([]);
  filas = computed(() => filasDeMatriz(this.catalogo()));
  inicial = signal(crearEstado([], []));
  estado = signal(crearEstado([], []));
  hayCambios = computed(() => !mismoEstado(this.inicial(), this.estado()));
  esAdministrador = computed(() => this.rol()?.nombre === ROL_ADMINISTRADOR2);
  cargando = signal(true);
  errorCarga = signal(null);
  guardando = signal(false);
  aviso = signal(null);
  constructor() {
    afterNextRender(() => this.cargar());
  }
  tieneModulo(modulo) {
    return this.estado().modulos.has(modulo.id);
  }
  tienePermiso(permiso) {
    return this.estado().permisos.has(permiso.id);
  }
  alternarModulo(modulo, evento) {
    this.estado.update((estado) => cambiarAccesoModulo(estado, modulo, evento.target.checked));
  }
  alternarPermiso(modulo, permiso, evento) {
    this.estado.update((estado) => cambiarPermiso(estado, modulo, permiso, evento.target.checked));
  }
  descartar() {
    this.estado.set(this.inicial());
    this.aviso.set(null);
  }
  /** PUT de módulos y, después, PUT de permisos (el backend exige que los módulos ya estén asignados). */
  guardar() {
    const rol = this.rol();
    if (!rol || !this.hayCambios())
      return;
    const guardado = this.estado();
    const payload = aPayload(guardado, this.catalogo());
    this.guardando.set(true);
    this.aviso.set(null);
    this.rolesService.actualizarModulos(rol.id, payload.modulos).pipe(switchMap(() => this.rolesService.actualizarPermisos(rol.id, payload.permisos))).subscribe({
      next: () => {
        this.guardando.set(false);
        this.inicial.set(guardado);
        this.aviso.set({ tipo: "exito", texto: `Se guardaron los accesos del rol ${rol.nombre}.`, detalle: [] });
        if (this.auth.usuario()?.rol === rol.nombre) {
          this.auth.recargarSesion().subscribe();
        }
      },
      error: (error) => {
        this.guardando.set(false);
        this.aviso.set({ tipo: "error", texto: error.mensaje, detalle: Object.values(error.errores).flat() });
      }
    });
  }
  confirmarSalida() {
    return !this.hayCambios() || this.confirmacion().abrir();
  }
  /** Cerrar o recargar la pestaña con cambios: el navegador muestra su propia confirmación. */
  alDescargar(evento) {
    if (this.hayCambios())
      evento.preventDefault();
  }
  cargar() {
    if (!Number.isInteger(this.idRol) || this.idRol <= 0) {
      this.cargando.set(false);
      this.errorCarga.set("El rol no existe.");
      return;
    }
    forkJoin({
      roles: this.rolesService.listar(),
      modulos: this.modulosService.listar(),
      asignados: this.rolesService.obtenerModulos(this.idRol),
      permisos: this.rolesService.obtenerPermisos(this.idRol)
    }).subscribe({
      next: ({ roles, modulos, asignados, permisos }) => {
        const rol = roles.find((candidato) => candidato.id === this.idRol) ?? null;
        const estado = crearEstado(asignados, permisos);
        this.rol.set(rol);
        this.catalogo.set(modulos);
        this.inicial.set(estado);
        this.estado.set(estado);
        this.cargando.set(false);
        this.errorCarga.set(rol ? null : "El rol no existe.");
      },
      error: (error) => {
        this.cargando.set(false);
        this.errorCarga.set(error.status === 404 ? "El rol no existe." : error.mensaje);
      }
    });
  }
  static \u0275fac = function AccesosRolComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AccesosRolComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AccesosRolComponent, selectors: [["app-accesos-rol"]], viewQuery: function AccesosRolComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuerySignal(ctx.confirmacion, DialogoConfirmacionComponent, 5);
    }
    if (rf & 2) {
      \u0275\u0275queryAdvance();
    }
  }, hostBindings: function AccesosRolComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("beforeunload", function AccesosRolComponent_beforeunload_HostBindingHandler($event) {
        return ctx.alDescargar($event);
      }, false, \u0275\u0275resolveWindow);
    }
  }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 10, vars: 3, consts: [[1, "accesos"], ["routerLink", "/roles", 1, "volver"], ["aria-hidden", "true", 1, "material-symbols-outlined"], [3, "title"], ["role", "alert", 1, "alert", "alert-error"], ["titulo", "Salir sin guardar", "confirmar", "Salir sin guardar", "cancelar", "Seguir editando", 3, "texto"], ["role", "status", 1, "sr-only"], ["aria-hidden", "true", 1, "esqueleto"], [1, "alert", "alert-advertencia"], ["role", "status"], [1, "alert", 3, "alert-exito", "alert-error"], [1, "ayuda"], [1, "table", "matriz"], [1, "sr-only"], ["scope", "col"], [3, "sin-acceso", "registro-inactivo"], [1, "barra-acciones"], ["role", "status", 1, "barra-acciones-estado"], ["type", "button", 1, "btn", 3, "click", "disabled"], ["type", "button", 1, "btn", "btn-primary", 3, "click", "disabled"], [1, "alert"], ["scope", "row", 1, "modulo"], [1, "modulo-nombre"], [1, "dato", "modulo-url"], [1, "badge"], [1, "celda-acceso"], [1, "casilla"], ["type", "checkbox", "role", "switch", 1, "interruptor", 3, "change", "checked"], [1, "etiqueta"], [1, "celda-permiso"], [1, "otros"], [1, "casilla", 3, "registro-inactivo"], ["aria-hidden", "true", 1, "no-aplica"], ["type", "checkbox", 3, "change", "checked"]], template: function AccesosRolComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section", 0)(1, "a", 1)(2, "span", 2);
      \u0275\u0275text(3, "chevron_left");
      \u0275\u0275elementEnd();
      \u0275\u0275text(4, " Volver a roles ");
      \u0275\u0275elementEnd();
      \u0275\u0275element(5, "app-page-title", 3);
      \u0275\u0275template(6, AccesosRolComponent_Conditional_6_Template, 8, 0)(7, AccesosRolComponent_Conditional_7_Template, 5, 1, "div", 4)(8, AccesosRolComponent_Conditional_8_Template, 29, 8);
      \u0275\u0275elementEnd();
      \u0275\u0275element(9, "app-dialogo-confirmacion", 5);
    }
    if (rf & 2) {
      let tmp_2_0;
      \u0275\u0275advance(5);
      \u0275\u0275property("title", ctx.rol() ? "Accesos del rol " + ctx.rol().nombre : "Accesos del rol");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.cargando() ? 6 : ctx.errorCarga() ? 7 : 8);
      \u0275\u0275advance(3);
      \u0275\u0275property("texto", "Los cambios en los accesos del rol " + ((tmp_2_0 = (tmp_2_0 = ctx.rol()) == null ? null : tmp_2_0.nombre) !== null && tmp_2_0 !== void 0 ? tmp_2_0 : "") + " se perder\xE1n.");
    }
  }, dependencies: [RouterLink, PageTitleComponent, DialogoConfirmacionComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.volver[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  min-height: var(--alto-control);\n  margin-bottom: var(--espacio-1);\n  text-decoration: none;\n}\n.ayuda[_ngcontent-%COMP%] {\n  max-width: 70ch;\n  margin: 0 0 var(--espacio-4);\n  color: var(--neutro-500);\n}\n.matriz[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], \n.matriz[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  height: auto;\n  padding: var(--espacio-1) var(--espacio-3);\n  vertical-align: middle;\n}\n.matriz[_ngcontent-%COMP%]   .modulo[_ngcontent-%COMP%] {\n  min-width: 12rem;\n  padding-left: 0;\n  font-weight: 400;\n}\n.modulo-nombre[_ngcontent-%COMP%] {\n  display: block;\n  font-weight: 600;\n}\n.modulo-url[_ngcontent-%COMP%] {\n  margin-right: var(--espacio-2);\n  color: var(--neutro-500);\n  font-size: 0.8125rem;\n}\n.sin-acceso[_ngcontent-%COMP%]   .modulo-nombre[_ngcontent-%COMP%] {\n  font-weight: 500;\n}\n.no-aplica[_ngcontent-%COMP%] {\n  color: var(--neutro-400);\n}\n.otros[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  column-gap: var(--espacio-4);\n}\n@media (min-width: 769px) {\n  .celda-acceso[_ngcontent-%COMP%]   .etiqueta[_ngcontent-%COMP%], \n   .celda-permiso[_ngcontent-%COMP%]   .etiqueta[_ngcontent-%COMP%] {\n    position: absolute;\n    width: 1px;\n    height: 1px;\n    overflow: hidden;\n    clip-path: inset(50%);\n  }\n}\n@media (max-width: 768px) {\n  .matriz[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%] {\n    display: none;\n  }\n  .matriz[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%] {\n    display: flex;\n    flex-direction: column;\n    padding: var(--espacio-3) 0;\n    border-bottom: 1px solid var(--neutro-200);\n  }\n  .matriz[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], \n   .matriz[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n    padding: 0;\n    border: 0;\n  }\n  .matriz[_ngcontent-%COMP%]   .celda-permiso[_ngcontent-%COMP%]:has(.no-aplica) {\n    display: none;\n  }\n  .otros[_ngcontent-%COMP%] {\n    flex-direction: column;\n  }\n  .otros[_ngcontent-%COMP%]   .no-aplica[_ngcontent-%COMP%] {\n    display: none;\n  }\n}\n/*# sourceMappingURL=accesos-rol.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AccesosRolComponent, { className: "AccesosRolComponent", filePath: "src\\app\\pages\\seguridad\\roles\\accesos-rol\\accesos-rol.component.ts", lineNumber: 41 });
})();

// src/app/components/sidebar/configuracion.guard.ts
var configuracionGestionGuard = (route) => {
  if (isPlatformServer(inject(PLATFORM_ID)))
    return true;
  const auth = inject(AuthService);
  const router = inject(Router);
  const catalogos = route.data["seccion"] === "clasificaciones" ? CATALOGOS_CLASIFICACIONES : CATALOGOS_INSTITUCIONALES;
  const pestana = route.queryParamMap.get("pestana");
  const seleccion = catalogos.find((entrada) => entrada.id === pestana) ?? catalogos[0];
  return auth.cargarSesion().pipe(map(() => !!seleccion?.permiso && auth.tienePermiso(seleccion.permiso) || router.createUrlTree(["/acceso-denegado"])));
};

// src/app/pages/vista-temporal/vista-temporal.component.ts
var VistaTemporalComponent = class _VistaTemporalComponent {
  route = inject(ActivatedRoute);
  titulo = toSignal(this.route.data.pipe(map((data) => typeof data["titulo"] === "string" ? data["titulo"] : "")), { initialValue: "" });
  descripcion = toSignal(this.route.data.pipe(map((data) => typeof data["descripcion"] === "string" ? data["descripcion"] : "")), { initialValue: "" });
  seccion = toSignal(this.route.data.pipe(map((data) => typeof data["seccion"] === "string" ? data["seccion"] : "")), { initialValue: "" });
  static \u0275fac = function VistaTemporalComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VistaTemporalComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _VistaTemporalComponent, selectors: [["app-vista-temporal"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 15, vars: 3, consts: [[3, "title"], ["aria-label", "Estado de la funcionalidad", 1, "card"], ["role", "status"], ["routerLink", "/inicio", 1, "btn"]], template: function VistaTemporalComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "p");
      \u0275\u0275text(1);
      \u0275\u0275elementEnd();
      \u0275\u0275element(2, "app-page-title", 0);
      \u0275\u0275elementStart(3, "section", 1)(4, "h2");
      \u0275\u0275text(5, "En desarrollo");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "p");
      \u0275\u0275text(7);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "p", 2)(9, "strong");
      \u0275\u0275text(10, "Funcionalidad pendiente de integraci\xF3n");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(11, "p");
      \u0275\u0275text(12, "Esta pantalla es informativa. No consulta registros ni permite registrar solicitudes, aprobar documentos o aplicar firmas.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "a", 3);
      \u0275\u0275text(14, "Volver al inicio");
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.seccion());
      \u0275\u0275advance();
      \u0275\u0275property("title", ctx.titulo());
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(ctx.descripcion());
    }
  }, dependencies: [PageTitleComponent, RouterLink], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-height: 100%;\n  background: var(--neutro-0);\n}\n/*# sourceMappingURL=vista-temporal.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VistaTemporalComponent, { className: "VistaTemporalComponent", filePath: "src\\app\\pages\\vista-temporal\\vista-temporal.component.ts", lineNumber: 22 });
})();

// src/app/pages/solicitudes/solicitudes.routes.ts
var VISTAS_SOLICITUDES = {
  "solicitud-nueva": () => import("./chunk-IDWSXQEE.js").then((m) => m.NuevaSolicitudComponent),
  "mis-solicitudes": () => import("./chunk-AYJ2ENDD.js").then((m) => m.MisSolicitudesComponent),
  "revisar-solicitudes": () => import("./chunk-S4FNZYTK.js").then((m) => m.RevisionSolicitudesComponent),
  "pendientes-aprobacion": () => import("./chunk-PWLIQEBA.js").then((m) => m.PendientesAprobacionComponent),
  "documentos-firmar": () => import("./chunk-Y7CTOK6X.js").then((m) => m.DocumentosPorFirmarComponent)
};

// src/app/pages/actividades/asistencia-sesion/asistencia-sesion.guard.ts
var salirDeAsistencia = (componente) => componente.puedeSalir();

// src/app/pages/emision-certificados/emision-certificados.routes.ts
var redirigirSesionesAnteriores = (route) => {
  const router = inject(Router);
  const params = route.queryParams;
  const actividad = params["id_actividad"] ?? params["actividad"] ?? params["actividad_filtro"];
  const sesion = params["id_sesion"] ?? params["id_actividad_sesion"] ?? params["sesion_filtro"];
  const valido = (id) => /^[1-9]\d*$/.test(String(id)) && Number.isSafeInteger(Number(id));
  const destino = (id) => router.createUrlTree(valido(id) && valido(sesion) ? ["/certificaciones/actividades", id, "sesiones", sesion, "asistencia"] : ["/certificaciones/actividades"], { queryParams: __spreadValues(__spreadValues({}, params), id !== void 0 ? { id_actividad: id } : {}) });
  if (valido(actividad) || !valido(sesion))
    return destino(actividad);
  return inject(EmisionCertificadosService).obtener("activity-session", Number(sesion)).pipe(map((fila) => Number(fila["id_actividad_sesion"]) === Number(sesion) && valido(fila["id_actividad"]) ? destino(fila["id_actividad"]) : destino()), catchError(() => of(destino())));
};
var EMISION_CERTIFICADOS_ROUTES = [
  {
    path: "generar-emitir/reconocimientos/documento-original/:reconocimientoId",
    canActivate: [permissionGuard],
    data: { permiso: "emision.ver", requiere: ["reconocimientos.ver"], visorMunicipal: true, titulo: "Certificado" },
    loadComponent: () => import("./chunk-XIA5NPCX.js").then((m) => m.PrepararMunicipalComponent)
  },
  {
    path: "generar-emitir/reconocimientos/individual/:reconocimientoId",
    canActivate: [permissionGuard],
    data: { permiso: "emision.ver", requiere: ["reconocimientos.ver"], titulo: "Preparar reconocimiento municipal" },
    loadComponent: () => import("./chunk-XIA5NPCX.js").then((m) => m.PrepararMunicipalComponent)
  },
  {
    path: "generar-emitir/practicas/:practicaId/preparar",
    canActivate: [permissionGuard],
    data: { permiso: "emision.ver", requiere: ["practicantes.ver"], titulo: "Preparar certificado de pr\xE1cticas" },
    loadComponent: () => import("./chunk-LCLRJ3W2.js").then((m) => m.PrepararPracticaComponent)
  },
  {
    path: "generar-emitir/reconocimientos/preparar",
    canActivate: [permissionGuard],
    data: { permiso: "emision.ver", requiere: ["actividades.ver", "ponentes-firmantes.ver"], titulo: "Preparar reconocimiento" },
    loadComponent: () => import("./chunk-X27ZL7JE.js").then((m) => m.PrepararReconocimientoSesionComponent)
  },
  {
    path: "generar-emitir/reconocimientos/actividad/:actividadId/ponentes/:ponenteId",
    canActivate: [permissionGuard],
    data: { permiso: "emision.ver", requiere: ["actividades.ver", "ponentes-firmantes.ver"], titulo: "Preparar reconocimiento" },
    loadComponent: () => import("./chunk-QZRG5QEX.js").then((m) => m.PrepararReconocimientoComponent)
  },
  {
    path: "generar-emitir",
    canActivate: [permissionGuard, (route) => {
      const permiso = route.queryParamMap.has("editar") ? "emision.editar" : route.queryParamMap.has("nuevo") ? "emision.crear" : null;
      const auth = inject(AuthService);
      const router = inject(Router);
      return permiso ? auth.cargarSesion().pipe(map(() => auth.tienePermiso(permiso) || router.createUrlTree(["/acceso-denegado"]))) : true;
    }],
    runGuardsAndResolvers: "paramsOrQueryParamsChange",
    data: { permiso: "emision.ver" },
    loadComponent: () => import("./chunk-IOJBF7KH.js").then((m) => m.GenerarEmitirComponent)
  },
  {
    path: "actividades/:idActividad/sesiones/:idSesion/asistencia",
    canActivate: [permissionGuard],
    canDeactivate: [salirDeAsistencia],
    data: { permiso: "actividades.ver", requiere: ["participantes.ver"], titulo: "Control de asistencia" },
    loadComponent: () => import("./chunk-AQ3P6HBM.js").then((m) => m.AsistenciaSesionComponent)
  },
  {
    path: "actividades/:id",
    pathMatch: "full",
    redirectTo: (datos) => inject(Router).createUrlTree(["/certificaciones/actividades"], { queryParams: __spreadProps(__spreadValues({}, datos.queryParams), { id_actividad: datos.params["id"] }) })
  },
  {
    path: "actividades",
    canActivate: [permissionGuard],
    data: { permiso: "actividades.ver", titulo: "Actividades" },
    loadComponent: () => import("./chunk-V32XZJYD.js").then((m) => m.ListarActividadesComponent)
  },
  {
    path: "participantes",
    canActivate: [permissionGuard],
    data: { permiso: "participantes.ver", titulo: "Participantes" },
    loadComponent: () => import("./chunk-YXFWSVJD.js").then((m) => m.ListarParticipantesComponent)
  },
  {
    path: "sesiones-asistencia",
    canActivate: [permissionGuard, redirigirSesionesAnteriores],
    data: { permiso: "actividades.ver" },
    loadComponent: () => import("./chunk-V32XZJYD.js").then((m) => m.ListarActividadesComponent)
  },
  {
    path: "reconocimientos",
    canActivate: [permissionGuard],
    data: { permiso: "reconocimientos.ver" },
    children: [
      { path: "", loadComponent: () => import("./chunk-26DYUT6J.js").then((m) => m.ListarReconocimientosComponent) },
      {
        path: "nuevo",
        canActivate: [permissionGuard],
        data: { permiso: "reconocimientos.crear" },
        loadComponent: () => import("./chunk-JW6ZPWFK.js").then((m) => m.FormularioReconocimientoComponent)
      },
      {
        path: ":id/editar",
        canActivate: [permissionGuard],
        data: { permiso: "reconocimientos.editar" },
        loadComponent: () => import("./chunk-JW6ZPWFK.js").then((m) => m.FormularioReconocimientoComponent)
      },
      { path: ":id", loadComponent: () => import("./chunk-6I7Q64S3.js").then((m) => m.DetalleReconocimientoComponent) }
    ]
  },
  {
    path: "certificados",
    canActivate: [permissionGuard],
    data: { permiso: "emision.ver" },
    children: [
      { path: "", pathMatch: "full", redirectTo: "/certificaciones/generar-emitir" },
      {
        path: "nuevo",
        redirectTo: "/certificaciones/generar-emitir?nuevo=1"
      },
      {
        path: "reconocimientos",
        canActivate: [permissionGuard],
        data: { permiso: "reconocimientos.ver" },
        children: [
          { path: "", pathMatch: "full", redirectTo: "/certificaciones/reconocimientos" },
          { path: "nuevo", redirectTo: "/certificaciones/reconocimientos/nuevo" },
          { path: ":id/editar", redirectTo: "/certificaciones/reconocimientos/:id/editar" }
        ]
      },
      { path: "documentos", loadComponent: () => import("./chunk-FIQJJNYG.js").then((m) => m.ListarDocumentosComponent) },
      {
        path: ":id/editar",
        redirectTo: (datos) => `/certificaciones/generar-emitir?editar=${encodeURIComponent(datos.params["id"])}`
      },
      { path: ":id/documentos/:documentoId/visor", loadComponent: () => import("./chunk-TEDUNEYD.js").then((m) => m.VerDocumentoComponent) },
      { path: ":id", loadComponent: () => import("./chunk-GPIX344Y.js").then((m) => m.DetalleCertificadoComponent) }
    ]
  },
  {
    path: "firmas",
    canActivate: [permissionGuard],
    data: { permiso: "emision.ver" },
    children: [
      { path: "", pathMatch: "full", redirectTo: "/gestion/firmantes-municipales" },
      { path: "asignar-firmantes", redirectTo: "/pendientes/documentos-firmar", pathMatch: "full" },
      {
        path: "aplicadas",
        canActivate: [permissionGuard],
        data: { permiso: "emision.ver", recurso: "certificados-firmas" },
        loadComponent: () => import("./chunk-WRGVKK3Z.js").then((m) => m.FirmasAplicadasComponent)
      }
    ]
  },
  {
    path: "verificacion",
    canActivate: [permissionGuard],
    data: { permiso: "emision.ver" },
    loadComponent: () => import("./chunk-FXTST5XV.js").then((m) => m.ConsultarCertificadoComponent)
  },
  {
    path: "configuracion",
    children: [
      {
        path: "",
        pathMatch: "full",
        redirectTo: "/gestion/tipos-clasificaciones?pestana=tipos-certificado"
      },
      {
        path: "tipos-actividad",
        pathMatch: "full",
        redirectTo: "/gestion/tipos-clasificaciones?pestana=tipos-actividad"
      },
      {
        path: "tipos-participacion",
        pathMatch: "full",
        redirectTo: "/gestion/tipos-clasificaciones?pestana=tipos-participacion"
      }
    ]
  }
];

// src/app/app.routes.ts
var gestionRoutes = [
  {
    path: "firmantes-municipales",
    canActivate: [permissionGuard],
    data: { permiso: "emision.ver", permisos: ["ponentes-firmantes.editar"], titulo: "Gesti\xF3n de firmantes municipales" },
    loadComponent: () => import("./chunk-MEGNICNC.js").then((pagina) => pagina.ListarFirmasComponent)
  },
  { path: "practicantes", pathMatch: "full", redirectTo: "/gestion/practicas?pestana=practicantes" },
  {
    path: "personas",
    loadComponent: () => import("./chunk-2QDBIEES.js").then((pagina) => pagina.GestionTabsComponent),
    canActivate: [permissionGuard],
    runGuardsAndResolvers: "paramsOrQueryParamsChange",
    data: { titulo: "Gesti\xF3n de Personas", seccion: "personas", permiso: "personas.verpersonas" }
  },
  {
    path: "trabajadores",
    loadComponent: () => import("./chunk-SXC772NG.js").then((pagina) => pagina.PersonWorkerComponent),
    canActivate: [permissionGuard],
    data: { titulo: "Gesti\xF3n de Trabajadores", permiso: "trabajadores.ver" }
  },
  {
    path: "practicas",
    loadComponent: () => import("./chunk-2QDBIEES.js").then((pagina) => pagina.GestionTabsComponent),
    canActivate: [permissionGuard],
    data: { titulo: "Gesti\xF3n de Pr\xE1cticas", seccion: "practicas", permiso: "practicantes.ver" }
  },
  {
    path: "ponentes",
    loadComponent: () => import("./chunk-FYGTJQ3F.js").then((pagina) => pagina.PersonSpeakerComponent),
    canActivate: [permissionGuard],
    data: { titulo: "Gesti\xF3n de Ponentes", permiso: "ponentes-firmantes.ver" }
  },
  {
    path: "configuracion",
    loadComponent: () => import("./chunk-2QDBIEES.js").then((pagina) => pagina.GestionTabsComponent),
    canActivate: [configuracionGestionGuard],
    runGuardsAndResolvers: "paramsOrQueryParamsChange",
    data: { titulo: "Gesti\xF3n institucional", seccion: "configuracion" }
  },
  {
    path: "tipos-clasificaciones",
    loadComponent: () => import("./chunk-2QDBIEES.js").then((pagina) => pagina.GestionTabsComponent),
    canActivate: [configuracionGestionGuard],
    runGuardsAndResolvers: "paramsOrQueryParamsChange",
    data: { titulo: "Tipos y clasificaciones", seccion: "clasificaciones" }
  }
];
var routes = [
  // Sin componente: en el navegador inicioGuard redirige al primer módulo o a /login.
  { path: "", pathMatch: "full", canActivate: [inicioGuard], children: [] },
  { path: "login", component: LoginComponent, canActivate: [guestGuard] },
  { path: "recuperar-password", component: RecuperarPasswordComponent, canActivate: [guestGuard] },
  // El enlace del correo apunta aquí (FRONTEND_URL/reset-password?token=…&email=…).
  { path: "reset-password", component: RestablecerPasswordComponent },
  { path: "acceso-denegado", component: AccesoDenegadoComponent },
  {
    path: "portal-certificados",
    loadComponent: () => import("./chunk-D5J5TZ5S.js").then((m) => m.PortalCertificadosLayoutComponent),
    children: [{ path: "", loadComponent: () => import("./chunk-L4YCSNK3.js").then((m) => m.PortalCertificadosComponent) }]
  },
  { path: "verificar", pathMatch: "full", redirectTo: ({ queryParams }) => inject(Router).createUrlTree(["/portal-certificados"], { queryParams }) },
  { path: "verificar/:codigo", redirectTo: ({ params }) => inject(Router).createUrlTree(["/portal-certificados"], { queryParams: { codigo: params["codigo"] } }) },
  {
    path: "",
    component: PrivateLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: "inicio", component: HomeComponent },
      {
        path: "pendientes/documentos-firmar/:id",
        canActivate: [permissionGuard],
        data: { titulo: "Detalle del certificado", permiso: "emision.ver" },
        loadComponent: () => import("./chunk-XVQ5FJF6.js").then((m) => m.DetalleDocumentoComponent)
      },
      { path: "reportes", children: REPORTES_ROUTES },
      { path: "pendientes/indicadores", redirectTo: "/reportes/indicadores", pathMatch: "full" },
      { path: "pendientes/reportes-actividades", redirectTo: "/reportes/actividades", pathMatch: "full" },
      { path: "pendientes/reportes-certificados", redirectTo: "/reportes/certificados", pathMatch: "full" },
      { path: "pendientes/reportes-asistencia", redirectTo: "/reportes/asistencia", pathMatch: "full" },
      {
        path: "solicitudes",
        loadComponent: VISTAS_SOLICITUDES["mis-solicitudes"],
        children: [
          { path: "", pathMatch: "full", redirectTo: "mis-solicitudes" },
          {
            path: "mis-solicitudes",
            children: [],
            canActivate: [permissionGuard],
            runGuardsAndResolvers: "paramsOrQueryParamsChange",
            data: { titulo: "Mis solicitudes", permiso: "solicitudes.propias" }
          },
          {
            path: "nueva",
            children: [],
            canActivate: [permissionGuard],
            runGuardsAndResolvers: "paramsOrQueryParamsChange",
            data: { titulo: "Nueva solicitud de actividad", permiso: "solicitudes.crear", permisoEdicion: "solicitudes.editar" }
          }
        ]
      },
      ...SIDEBAR_CONFIG.flatMap((grupo) => grupo.hijos.filter((entrada) => entrada.habilitado && entrada.id !== "mis-solicitudes" && !!VISTAS_SOLICITUDES[entrada.id]).map((entrada) => ({
        path: entrada.path.slice(1),
        loadComponent: VISTAS_SOLICITUDES[entrada.id],
        canActivate: [permissionGuard],
        runGuardsAndResolvers: "paramsOrQueryParamsChange",
        data: __spreadValues({
          titulo: entrada.label,
          permiso: entrada.permiso,
          capacidadSolicitud: entrada.capacidadSolicitud,
          permisos: entrada.permisos,
          requiere: entrada.requiere
        }, entrada.id === "solicitud-nueva" ? { permisoEdicion: "solicitudes.editar" } : {})
      }))),
      { path: "pendientes/generar-emitir", pathMatch: "full", redirectTo: "/certificaciones/generar-emitir" },
      // Solo páginas informativas: authGuard del layout y guard de consulta administrativa.
      ...SIDEBAR_CONFIG.flatMap((grupo) => grupo.hijos.filter((entrada) => !entrada.habilitado && !!entrada.pendiente).map((entrada) => __spreadProps(__spreadValues({
        path: rutaPantallaPendiente(entrada).slice(1)
      }, VISTAS_SOLICITUDES[entrada.id] ? { loadComponent: VISTAS_SOLICITUDES[entrada.id] } : { component: VistaTemporalComponent }), {
        canActivate: [pantallasPendientesGuard],
        data: {
          titulo: entrada.label,
          descripcion: entrada.descripcionPreliminar ?? entrada.pendiente,
          seccion: grupo.label
        }
      }))),
      {
        path: "usuarios",
        canActivate: [permissionGuard],
        data: { permiso: "usuarios.ver" },
        children: [
          { path: "", component: ListarUsuariosComponent },
          {
            path: "nuevo",
            component: FormularioUsuarioComponent,
            canActivate: [permissionGuard],
            data: { permiso: "usuarios.crear" }
          },
          {
            path: ":id/editar",
            component: FormularioUsuarioComponent,
            canActivate: [permissionGuard],
            data: { permiso: "usuarios.editar" }
          }
        ]
      },
      {
        path: "roles",
        canActivate: [permissionGuard],
        data: { permiso: "roles.ver" },
        children: [
          { path: "", component: RolesPermisosComponent },
          {
            path: ":id/accesos",
            component: AccesosRolComponent,
            canActivate: [permissionGuard],
            canDeactivate: [cambiosPendientesGuard],
            data: { permiso: "roles.editar" }
          }
        ]
      },
      { path: "gestion", children: gestionRoutes },
      { path: "certificaciones", children: EMISION_CERTIFICADOS_ROUTES },
      // Compatibilidad con las URL institucionales recibidas en /auth/me.
      { path: "dashboard", pathMatch: "full", redirectTo: "/inicio" },
      { path: "actividades", pathMatch: "full", redirectTo: "/certificaciones/actividades" },
      { path: "participantes", pathMatch: "full", redirectTo: "/certificaciones/participantes" },
      { path: "practicantes", pathMatch: "full", redirectTo: "/gestion/practicas?pestana=practicantes" },
      { path: "reconocimientos", pathMatch: "full", redirectTo: "/certificaciones/reconocimientos" },
      { path: "ponentes-firmantes", pathMatch: "full", redirectTo: "/gestion/ponentes" },
      { path: "emision", pathMatch: "full", redirectTo: "/certificaciones/certificados" },
      { path: "certificados", pathMatch: "full", redirectTo: "/certificaciones/certificados" },
      { path: "firmas", pathMatch: "full", redirectTo: "/gestion/firmantes-municipales" },
      { path: "personas", pathMatch: "full", redirectTo: "/gestion/personas" },
      { path: "trabajadores", pathMatch: "full", redirectTo: "/gestion/trabajadores" },
      { path: "areas", pathMatch: "full", redirectTo: "/gestion/configuracion?pestana=areas" },
      { path: "instituciones", pathMatch: "full", redirectTo: "/gestion/configuracion?pestana=instituciones" },
      { path: "documentos", pathMatch: "full", redirectTo: "/gestion/configuracion?pestana=tipos-documento" },
      { path: "tipos-documento", pathMatch: "full", redirectTo: "/gestion/configuracion?pestana=tipos-documento" },
      { path: "modulos", pathMatch: "full", redirectTo: "/roles?pestana=modulos" },
      { path: "permisos", pathMatch: "full", redirectTo: "/roles?pestana=modulos" },
      // Destino de las demás opciones del menú sin pantalla todavía.
      { path: "**", component: EnConstruccionComponent }
    ]
  }
];

// src/app/core/interceptors/auth.interceptor.ts
var RUTAS_SIN_REDIRECCION = [
  `${environment.apiBaseUrl}/auth/login`,
  `${environment.apiBaseUrl}/auth/me`
];
var authInterceptor = (request, next) => {
  if (!request.context.get(AUTHENTICATED_REQUEST)) {
    return next(request);
  }
  if (isPlatformServer(inject(PLATFORM_ID))) {
    return EMPTY;
  }
  const auth = inject(AuthService);
  const router = inject(Router);
  return next(auth.authorizeRequest(request)).pipe(catchError((error) => {
    if (error instanceof HttpErrorResponse && error.status === 401 && !RUTAS_SIN_REDIRECCION.includes(request.url)) {
      const returnUrl = router.url;
      auth.limpiarSesion();
      if (!returnUrl.startsWith("/login")) {
        void router.navigate(["/login"], { queryParams: { returnUrl } });
      }
    }
    return throwError(() => error);
  }));
};

// src/app/core/services/autenticacion/session-auth.service.ts
var RUTA_SIN_MODULOS = "/inicio";
var SessionAuthService = class _SessionAuthService extends AuthService {
  http = inject(HttpClient);
  router = inject(Router);
  api = environment.apiBaseUrl;
  usuarioActual = signal(null);
  modulosActuales = signal([]);
  permisosActuales = signal([]);
  capacidadesActuales = signal(null);
  sesion$ = null;
  usuario = this.usuarioActual.asReadonly();
  modulos = this.modulosActuales.asReadonly();
  permisos = this.permisosActuales.asReadonly();
  capacidadesSolicitudes = this.capacidadesActuales.asReadonly();
  isAuthenticated = computed(() => this.usuarioActual() !== null);
  login(email, password) {
    const body = { email, password };
    return this.http.post(`${this.api}/auth/login`, body, this.opciones()).pipe(switchMap(() => {
      this.limpiarEstado();
      this.sesion$ = null;
      return this.cargarSesion(true);
    }), switchMap((ok) => ok ? of({ tipo: "exito" }) : throwError(() => new Error("No se pudo cargar la sesi\xF3n despu\xE9s del login"))), catchError((error) => {
      if (error instanceof HttpErrorResponse) {
        const cuerpo = error.error;
        if (error.status === 401) {
          return of({
            tipo: "rechazado",
            mensaje: cuerpo?.message === "Usuario desactivado" ? "Usuario desactivado. Contacta con el administrador." : "Correo electr\xF3nico o contrase\xF1a incorrectos."
          });
        }
        if (error.status === 423) {
          return of({
            tipo: "bloqueado",
            mensaje: cuerpo?.message ?? "Cuenta bloqueada",
            bloqueadoHasta: cuerpo?.bloqueadoHasta ?? null
          });
        }
      }
      return throwError(() => error);
    }));
  }
  cargarSesion(propagarError = false) {
    this.sesion$ ??= this.http.get(`${this.api}/auth/me`, this.opciones()).pipe(map((sesion) => {
      this.usuarioActual.set(sesion.user);
      this.modulosActuales.set(sesion.modulos);
      this.permisosActuales.set(sesion.permisos);
      const capacidades = sesion.capacidades_solicitudes;
      this.capacidadesActuales.set(capacidades && typeof capacidades === "object" ? {
        consultar_revision: capacidades.consultar_revision === true,
        consultar_gerencia: capacidades.consultar_gerencia === true,
        consultar_historial: capacidades.consultar_historial === true,
        consulta_administrativa_global: capacidades.consulta_administrativa_global === true,
        revisar: capacidades.revisar === true,
        derivar: capacidades.derivar === true,
        aprobar: capacidades.aprobar === true,
        rechazar: capacidades.rechazar === true,
        decidir_ambito_institucional: capacidades.decidir_ambito_institucional === true,
        decidir_propias: capacidades.decidir_propias === true
      } : null);
      return true;
    }), catchError((error) => {
      this.limpiarEstado();
      if (!(error instanceof HttpErrorResponse && error.status === 401)) {
        this.sesion$ = null;
      }
      if (propagarError) {
        return throwError(() => error instanceof HttpErrorResponse && error.status === 401 ? new Error("No se pudo validar la sesi\xF3n despu\xE9s del login") : error);
      }
      return of(false);
    }), shareReplay(1));
    return this.sesion$;
  }
  recargarSesion() {
    this.sesion$ = null;
    this.permisosActuales.set([]);
    this.modulosActuales.set([]);
    this.capacidadesActuales.set(null);
    return this.cargarSesion();
  }
  logout() {
    return this.http.post(`${this.api}/auth/logout`, null, this.opciones()).pipe(catchError((error) => error instanceof HttpErrorResponse && error.status === 401 ? of(null) : throwError(() => error)), map(() => {
      this.limpiarSesion();
      void this.router.navigateByUrl("/login");
    }));
  }
  forgotPassword(email) {
    const body = { email };
    return this.http.post(`${this.api}/auth/forgot-password`, body, this.opciones()).pipe(map(() => void 0));
  }
  resetPassword(token, email, password, passwordConfirmation) {
    const body = {
      token,
      email,
      password,
      password_confirmation: passwordConfirmation
    };
    return this.http.post(`${this.api}/auth/reset-password`, body, this.opciones()).pipe(map(() => void 0));
  }
  tienePermiso(clave) {
    return this.permisosActuales().includes(clave);
  }
  rutaInicial() {
    return this.modulosActuales()[0]?.url ?? RUTA_SIN_MODULOS;
  }
  /** Sesión terminada (logout o 401): no se vuelve a consultar /auth/me hasta el próximo login. */
  limpiarSesion() {
    this.limpiarEstado();
    this.sesion$ = of(false);
  }
  authorizeRequest(request) {
    const esApi = request.url === this.api || request.url.startsWith(`${this.api}/`);
    return esApi ? request.clone({ withCredentials: true }) : request;
  }
  limpiarEstado() {
    this.usuarioActual.set(null);
    this.modulosActuales.set([]);
    this.permisosActuales.set([]);
    this.capacidadesActuales.set(null);
  }
  opciones() {
    return { context: new HttpContext().set(AUTHENTICATED_REQUEST, true), withCredentials: true };
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275SessionAuthService_BaseFactory;
    return function SessionAuthService_Factory(__ngFactoryType__) {
      return (\u0275SessionAuthService_BaseFactory || (\u0275SessionAuthService_BaseFactory = \u0275\u0275getInheritedFactory(_SessionAuthService)))(__ngFactoryType__ || _SessionAuthService);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SessionAuthService, factory: _SessionAuthService.\u0275fac });
};

// src/app/app.config.ts
var appConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // La sesión vive en una cookie del navegador: las respuestas de la API no se transfieren desde SSR.
    provideClientHydration(withHttpTransferCacheOptions({
      filter: (request) => !request.url.startsWith(environment.apiBaseUrl)
    })),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    { provide: AuthService, useClass: SessionAuthService }
  ]
};

// src/app/app.component.ts
var AppComponent = class _AppComponent {
  static \u0275fac = function AppComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AppComponent, selectors: [["app-root"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 1, vars: 0, template: function AppComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "router-outlet");
    }
  }, dependencies: [RouterOutlet], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n/*# sourceMappingURL=app.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AppComponent, { className: "AppComponent", filePath: "src\\app\\app.component.ts", lineNumber: 11 });
})();

// src/main.ts
bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
//# sourceMappingURL=main.js.map
