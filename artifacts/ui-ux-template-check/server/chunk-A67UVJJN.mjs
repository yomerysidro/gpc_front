import './polyfills.server.mjs';
import {
  PersonSpeakerService
} from "./chunk-FBNEJSMB.mjs";
import {
  PracticeService
} from "./chunk-SBB4NALW.mjs";
import {
  DialogoComponent
} from "./chunk-Y2AZ2EMT.mjs";
import {
  PageTitleComponent
} from "./chunk-XGG6XIOR.mjs";
import {
  AuthService
} from "./chunk-NP7M7R34.mjs";
import {
  AreaService,
  DocumentTypeService,
  PersonDocumentService,
  PersonWorkerService
} from "./chunk-7VY3YOD2.mjs";
import {
  PersonService
} from "./chunk-2XE3PF63.mjs";
import {
  AUTHENTICATED_REQUEST,
  environment
} from "./chunk-HFD7K63G.mjs";
import {
  takeUntilDestroyed
} from "./chunk-TSKSZVR2.mjs";
import {
  HttpClient,
  HttpContext,
  HttpErrorResponse
} from "./chunk-TNXV45E5.mjs";
import {
  DefaultValueAccessor,
  FormControl,
  FormControlName,
  FormGroup,
  FormGroupDirective,
  NgControlStatus,
  NgControlStatusGroup,
  NgSelectOption,
  ReactiveFormsModule,
  RequiredValidator,
  SelectControlValueAccessor,
  Validators,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-SPQE7PSN.mjs";
import {
  DatePipe,
  DestroyRef,
  PLATFORM_ID,
  computed,
  finalize,
  inject,
  input,
  isPlatformBrowser,
  map,
  signal,
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
  ɵɵviewQuerySignal
} from "./chunk-OYAKRC2F.mjs";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-X7LY3JHO.mjs";

// src/app/core/services/institution/institution.service.ts
var InstitutionService = class _InstitutionService {
  http = inject(HttpClient);
  url = `${environment.apiBaseUrl}/institutions`;
  listar() {
    return this.http.get(`${this.url}/list`, this.opciones()).pipe(map((respuesta) => {
      if (!respuesta.success || !Array.isArray(respuesta.data)) {
        throw new Error(respuesta.message || "Respuesta de listado inv\xE1lida.");
      }
      return respuesta.data;
    }));
  }
  obtener(id) {
    return this.http.get(`${this.url}/detail/${id}`, this.opciones()).pipe(map((respuesta) => {
      if (!respuesta.success || !respuesta.data || typeof respuesta.data !== "object" || Array.isArray(respuesta.data)) {
        throw new Error(respuesta.message || "Respuesta de detalle inv\xE1lida.");
      }
      return respuesta.data;
    }));
  }
  crear(payload) {
    return this.http.post(`${this.url}/create`, payload, this.opciones()).pipe(map((r) => this.validarEscritura(r)));
  }
  actualizar(id, payload) {
    return this.http.put(`${this.url}/update/${id}`, payload, this.opciones()).pipe(map((r) => this.validarEscritura(r)));
  }
  eliminar(id) {
    return this.http.delete(`${this.url}/delete/${id}`, this.opciones()).pipe(map((r) => this.validarEscritura(r)));
  }
  validarEscritura(r) {
    if (!r.success)
      throw new Error(r.message || "No se pudo completar la operaci\xF3n.");
    return r;
  }
  opciones() {
    return { context: new HttpContext().set(AUTHENTICATED_REQUEST, true) };
  }
  static \u0275fac = function InstitutionService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _InstitutionService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _InstitutionService, factory: _InstitutionService.\u0275fac, providedIn: "root" });
};

// src/app/core/services/practice-supervisor/practice-supervisor.service.ts
var PracticeSupervisorService = class _PracticeSupervisorService {
  http = inject(HttpClient);
  url = `${environment.apiBaseUrl}/supervisory-internships`;
  listar() {
    return this.http.get(`${this.url}/list`, this.opciones()).pipe(map((respuesta) => {
      if (!respuesta.success || !Array.isArray(respuesta.data)) {
        throw new Error(respuesta.message || "Respuesta de listado inv\xE1lida.");
      }
      return respuesta.data;
    }));
  }
  obtener(id) {
    return this.http.get(`${this.url}/detail/${id}`, this.opciones()).pipe(map((respuesta) => {
      if (!respuesta.success || !respuesta.data || typeof respuesta.data !== "object" || Array.isArray(respuesta.data)) {
        throw new Error(respuesta.message || "Respuesta de detalle inv\xE1lida.");
      }
      return respuesta.data;
    }));
  }
  crear(payload) {
    return this.http.post(`${this.url}/create`, payload, this.opciones()).pipe(map((r) => this.validarEscritura(r)));
  }
  actualizar(id, payload) {
    return this.http.put(`${this.url}/update/${id}`, payload, this.opciones()).pipe(map((r) => this.validarEscritura(r)));
  }
  eliminar(id) {
    return this.http.delete(`${this.url}/delete/${id}`, this.opciones()).pipe(map((r) => this.validarEscritura(r)));
  }
  validarEscritura(r) {
    if (!r.success)
      throw new Error(r.message || "No se pudo completar la operaci\xF3n.");
    return r;
  }
  opciones() {
    return { context: new HttpContext().set(AUTHENTICATED_REQUEST, true) };
  }
  static \u0275fac = function PracticeSupervisorService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PracticeSupervisorService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _PracticeSupervisorService, factory: _PracticeSupervisorService.\u0275fac, providedIn: "root" });
};

// src/app/core/services/person-intern/person-intern.service.ts
var PersonInternService = class _PersonInternService {
  http = inject(HttpClient);
  url = `${environment.apiBaseUrl}/practicing-individuals`;
  listar() {
    return this.http.get(`${this.url}/list`, this.opciones()).pipe(map((respuesta) => {
      if (!respuesta.success || !Array.isArray(respuesta.data)) {
        throw new Error(respuesta.message || "Respuesta de listado inv\xE1lida.");
      }
      return respuesta.data;
    }));
  }
  obtener(id) {
    return this.http.get(`${this.url}/detail/${id}`, this.opciones()).pipe(map((respuesta) => {
      if (!respuesta.success || !respuesta.data || typeof respuesta.data !== "object" || Array.isArray(respuesta.data)) {
        throw new Error(respuesta.message || "Respuesta de detalle inv\xE1lida.");
      }
      return respuesta.data;
    }));
  }
  crear(payload) {
    return this.http.post(`${this.url}/create`, payload, this.opciones()).pipe(map((r) => this.validarEscritura(r)));
  }
  actualizar(id, payload) {
    return this.http.put(`${this.url}/update/${id}`, payload, this.opciones()).pipe(map((r) => this.validarEscritura(r)));
  }
  eliminar(id) {
    return this.http.delete(`${this.url}/delete/${id}`, this.opciones()).pipe(map((r) => this.validarEscritura(r)));
  }
  validarEscritura(r) {
    if (!r.success)
      throw new Error(r.message || "No se pudo completar la operaci\xF3n.");
    return r;
  }
  opciones() {
    return { context: new HttpContext().set(AUTHENTICATED_REQUEST, true) };
  }
  static \u0275fac = function PersonInternService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PersonInternService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _PersonInternService, factory: _PersonInternService.\u0275fac, providedIn: "root" });
};

// src/app/shared/components/gestion-table/gestion-config.ts
var GESTION_CONFIG = {
  "id_persona": {
    "endpoint": "persons",
    "permisos": {
      "ver": "personas.verpersonas",
      "crear": "personas.crear",
      "editar": "personas.editar",
      "eliminar": "personas.eliminar"
    },
    "campos": [
      {
        "clave": "nombres",
        "obligatorio": true,
        "tipo": "text",
        "maximo": 150
      },
      {
        "clave": "apellido_paterno",
        "obligatorio": true,
        "tipo": "text",
        "maximo": 150
      },
      {
        "clave": "apellido_materno",
        "obligatorio": false,
        "tipo": "text",
        "maximo": 150
      },
      {
        "clave": "telefono",
        "obligatorio": false,
        "tipo": "text",
        "maximo": 20
      },
      {
        "clave": "direccion",
        "obligatorio": false,
        "tipo": "text",
        "maximo": 200
      },
      {
        "clave": "correo",
        "obligatorio": false,
        "tipo": "text",
        "maximo": 255
      },
      {
        "clave": "fecha_registro",
        "obligatorio": true,
        "tipo": "date"
      }
    ]
  },
  "id_persona_documento": {
    "endpoint": "person-documents",
    "permisos": {
      "ver": "personas.verpersonas",
      "crear": "personas.crear",
      "editar": "personas.editar",
      "eliminar": "personas.eliminar"
    },
    "campos": [
      {
        "clave": "id_persona",
        "obligatorio": true,
        "tipo": "number",
        "relacion": "id_persona"
      },
      {
        "clave": "id_tipo_documento",
        "obligatorio": true,
        "tipo": "number",
        "relacion": "id_tipo_documento"
      },
      {
        "clave": "numero_documento",
        "obligatorio": true,
        "tipo": "text",
        "maximo": 100
      },
      {
        "clave": "estado",
        "obligatorio": true,
        "tipo": "text",
        "maximo": 100
      }
    ]
  },
  "id_persona_trabajador": {
    "endpoint": "person-workers",
    "permisos": {
      "ver": "trabajadores.ver",
      "crear": "trabajadores.crear",
      "editar": "trabajadores.editar",
      "eliminar": "trabajadores.eliminar"
    },
    "campos": [
      {
        "clave": "id_persona",
        "obligatorio": true,
        "tipo": "number",
        "relacion": "id_persona"
      },
      {
        "clave": "id_area",
        "obligatorio": true,
        "tipo": "number",
        "relacion": "id_area"
      },
      {
        "clave": "cargo",
        "obligatorio": true,
        "tipo": "text",
        "maximo": 150
      },
      {
        "clave": "fecha_ingreso",
        "obligatorio": true,
        "tipo": "date"
      },
      {
        "clave": "fecha_fin",
        "obligatorio": false,
        "tipo": "date"
      },
      {
        "clave": "estado",
        "obligatorio": true,
        "tipo": "boolean"
      }
    ]
  },
  "id_persona_practicante": {
    "endpoint": "practicing-individuals",
    "permisos": {
      "ver": "practicantes.ver",
      "crear": "practicantes.crear",
      "editar": "practicantes.editar",
      "eliminar": "practicantes.eliminar"
    },
    "campos": [
      {
        "clave": "id_persona",
        "obligatorio": true,
        "tipo": "number",
        "relacion": "id_persona"
      },
      {
        "clave": "codigo",
        "obligatorio": true,
        "tipo": "text",
        "maximo": 50
      },
      {
        "clave": "estado",
        "obligatorio": true,
        "tipo": "text",
        "maximo": 30
      }
    ]
  },
  "id_practica": {
    "endpoint": "practices",
    "permisos": {
      "ver": "practicantes.ver",
      "crear": "practicantes.crear",
      "editar": "practicantes.editar",
      "eliminar": "practicantes.eliminar"
    },
    "campos": [
      {
        "clave": "id_persona_practicante",
        "obligatorio": true,
        "tipo": "number",
        "relacion": "id_persona_practicante"
      },
      {
        "clave": "id_institucion",
        "obligatorio": true,
        "tipo": "number",
        "relacion": "id_institucion"
      },
      {
        "clave": "id_area",
        "obligatorio": true,
        "tipo": "number",
        "relacion": "id_area"
      },
      {
        "clave": "carrera",
        "obligatorio": true,
        "tipo": "text",
        "maximo": 55
      },
      {
        "clave": "fecha_inicio",
        "obligatorio": true,
        "tipo": "date"
      },
      {
        "clave": "fecha_fin",
        "obligatorio": false,
        "tipo": "date"
      },
      {
        "clave": "estado",
        "obligatorio": true,
        "tipo": "text",
        "maximo": 100
      }
    ]
  },
  "id_practica_supervisor": {
    "endpoint": "supervisory-internships",
    "permisos": {
      "ver": "practicantes.ver",
      "crear": "practicantes.crear",
      "editar": "practicantes.editar",
      "eliminar": "practicantes.eliminar"
    },
    "campos": [
      {
        "clave": "id_practica",
        "obligatorio": true,
        "tipo": "number",
        "relacion": "id_practica"
      },
      {
        "clave": "id_persona_trabajador",
        "obligatorio": true,
        "tipo": "number",
        "relacion": "id_persona_trabajador"
      },
      {
        "clave": "tipo_supervision",
        "obligatorio": true,
        "tipo": "text",
        "maximo": 150
      },
      {
        "clave": "fecha_inicio",
        "obligatorio": true,
        "tipo": "date"
      },
      {
        "clave": "fecha_fin",
        "obligatorio": false,
        "tipo": "date"
      },
      {
        "clave": "estado",
        "obligatorio": true,
        "tipo": "text",
        "maximo": 100
      }
    ]
  },
  "id_persona_ponente": {
    "endpoint": "person-speakers",
    "permisos": {
      "ver": "ponentes-firmantes.ver",
      "crear": "ponentes-firmantes.crear",
      "editar": "ponentes-firmantes.editar",
      "eliminar": "ponentes-firmantes.eliminar"
    },
    "campos": [
      {
        "clave": "id_persona",
        "obligatorio": true,
        "tipo": "number",
        "relacion": "id_persona"
      },
      {
        "clave": "id_institucion",
        "obligatorio": false,
        "tipo": "number",
        "relacion": "id_institucion"
      },
      {
        "clave": "cargo",
        "obligatorio": false,
        "tipo": "text",
        "maximo": 150
      },
      {
        "clave": "especialidad",
        "obligatorio": false,
        "tipo": "text",
        "maximo": 100
      }
    ]
  },
  "id_area": {
    "endpoint": "areas",
    "permisos": {
      "ver": "areas.ver",
      "crear": "areas.crear",
      "editar": "areas.editar",
      "eliminar": "areas.eliminar"
    },
    "campos": [
      {
        "clave": "nombre",
        "obligatorio": true,
        "tipo": "text",
        "maximo": 100
      }
    ]
  },
  "id_tipo_documento": {
    "endpoint": "document-types",
    "permisos": {
      "ver": "tipos-documento.ver",
      "crear": "tipos-documento.crear",
      "editar": "tipos-documento.editar",
      "eliminar": "tipos-documento.eliminar"
    },
    "campos": [
      {
        "clave": "nombre",
        "obligatorio": true,
        "tipo": "text",
        "maximo": 150
      },
      {
        "clave": "estado",
        "obligatorio": true,
        "tipo": "boolean"
      }
    ]
  },
  "id_institucion": {
    "endpoint": "institutions",
    "permisos": {
      "ver": "instituciones.ver",
      "crear": "instituciones.crear",
      "editar": "instituciones.editar",
      "eliminar": "instituciones.eliminar"
    },
    "campos": [
      {
        "clave": "nombre_institucion",
        "obligatorio": true,
        "tipo": "text",
        "maximo": 150
      },
      {
        "clave": "pais",
        "obligatorio": true,
        "tipo": "text",
        "maximo": 50
      },
      {
        "clave": "tipo",
        "obligatorio": true,
        "tipo": "text",
        "maximo": 30
      }
    ]
  }
};

// src/app/shared/components/gestion-table/gestion-table.component.ts
var _forTrack0 = ($index, $item) => $item.clave;
function _forTrack1($index, $item) {
  return $item[this.clavePrimaria()];
}
var _forTrack2 = ($index, $item) => $item.valor;
var _forTrack3 = ($index, $item) => $item.etiqueta;
var _c0 = () => [];
function GestionTableComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "h2");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.titulo());
  }
}
function GestionTableComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-page-title", 2);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("title", ctx_r1.titulo());
  }
}
function GestionTableComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.estadoPermisos());
  }
}
function GestionTableComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 8);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.mensaje());
  }
}
function GestionTableComponent_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13)(1, "span", 6);
    \u0275\u0275text(2, "error");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", ctx_r1.titulo(), ": ", ctx_r1.errorCarga(), "");
  }
}
function GestionTableComponent_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 18);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 19);
    \u0275\u0275element(3, "span")(4, "span")(5, "span");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Cargando ", ctx_r1.titulo(), "\u2026");
  }
}
function GestionTableComponent_Conditional_22_For_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 24);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const columna_r4 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(columna_r4.etiqueta);
  }
}
function GestionTableComponent_Conditional_22_For_14_For_4_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 32);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const columna_r7 = \u0275\u0275nextContext().$implicit;
    const registro_r8 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("badge-exito", registro_r8[columna_r7.clave] === true);
    \u0275\u0275attribute("data-estado", ctx_r1.mostrar(registro_r8, columna_r7));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.mostrar(registro_r8, columna_r7));
  }
}
function GestionTableComponent_Conditional_22_For_14_For_4_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const columna_r7 = \u0275\u0275nextContext().$implicit;
    const registro_r8 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.mostrar(registro_r8, columna_r7), " ");
  }
}
function GestionTableComponent_Conditional_22_For_14_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td");
    \u0275\u0275template(1, GestionTableComponent_Conditional_22_For_14_For_4_Conditional_1_Template, 2, 4, "span", 31)(2, GestionTableComponent_Conditional_22_For_14_For_4_Conditional_2_Template, 1, 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const columna_r7 = ctx.$implicit;
    \u0275\u0275attribute("data-label", columna_r7.etiqueta);
    \u0275\u0275advance();
    \u0275\u0275conditional(columna_r7.formato === "booleano" ? 1 : 2);
  }
}
function GestionTableComponent_Conditional_22_For_14_Conditional_7_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Finalizado");
    \u0275\u0275elementEnd();
  }
}
function GestionTableComponent_Conditional_22_For_14_Conditional_7_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 12);
    \u0275\u0275listener("click", function GestionTableComponent_Conditional_22_For_14_Conditional_7_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r9);
      const registro_r8 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.finalizarPractica(registro_r8));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const registro_r8 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", !ctx_r1.puede("editar") || ctx_r1.finalizandoPractica() !== null);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.finalizandoPractica() === registro_r8["id_practica"] ? "Finalizando\u2026" : "Finalizar pr\xE1ctica");
  }
}
function GestionTableComponent_Conditional_22_For_14_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, GestionTableComponent_Conditional_22_For_14_Conditional_7_Conditional_0_Template, 2, 0, "span")(1, GestionTableComponent_Conditional_22_For_14_Conditional_7_Conditional_1_Template, 2, 2, "button", 33);
  }
  if (rf & 2) {
    const registro_r8 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(ctx_r1.practicaFinalizada(registro_r8) ? 0 : 1);
  }
}
function GestionTableComponent_Conditional_22_For_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td", 26);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(3, GestionTableComponent_Conditional_22_For_14_For_4_Template, 3, 2, "td", null, _forTrack0);
    \u0275\u0275elementStart(5, "td")(6, "div", 27);
    \u0275\u0275template(7, GestionTableComponent_Conditional_22_For_14_Conditional_7_Template, 2, 1);
    \u0275\u0275elementStart(8, "button", 28);
    \u0275\u0275listener("click", function GestionTableComponent_Conditional_22_For_14_Template_button_click_8_listener() {
      const registro_r8 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.ver(registro_r8));
    });
    \u0275\u0275elementStart(9, "span", 6);
    \u0275\u0275text(10, "visibility");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "button", 29);
    \u0275\u0275listener("click", function GestionTableComponent_Conditional_22_For_14_Template_button_click_11_listener() {
      const registro_r8 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.abrirFormulario("editar", registro_r8));
    });
    \u0275\u0275elementStart(12, "span", 6);
    \u0275\u0275text(13, "edit");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "button", 30);
    \u0275\u0275listener("click", function GestionTableComponent_Conditional_22_For_14_Template_button_click_14_listener() {
      const registro_r8 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.solicitarEliminar(registro_r8));
    });
    \u0275\u0275elementStart(15, "span", 6);
    \u0275\u0275text(16, "delete");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const registro_r8 = ctx.$implicit;
    const \u0275$index_86_r10 = ctx.$index;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275$index_86_r10 + 1);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.columnas());
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r1.clavePrimaria() === "id_practica" ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !ctx_r1.puede("ver") || ctx_r1.guardando());
    \u0275\u0275attribute("aria-label", "Ver registro " + registro_r8[ctx_r1.clavePrimaria()]);
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", !ctx_r1.puede("editar") || ctx_r1.guardando());
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", !ctx_r1.puede("eliminar") || ctx_r1.guardando());
  }
}
function GestionTableComponent_Conditional_22_ForEmpty_15_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " No tienes acceso autorizado a este listado. ");
  }
}
function GestionTableComponent_Conditional_22_ForEmpty_15_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " No hay datos disponibles para mostrar. ");
  }
}
function GestionTableComponent_Conditional_22_ForEmpty_15_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " No hay registros disponibles. ");
  }
}
function GestionTableComponent_Conditional_22_ForEmpty_15_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275text(0, " No se encontraron registros con esa b\xFAsqueda. ");
    \u0275\u0275elementStart(1, "button", 36);
    \u0275\u0275listener("click", function GestionTableComponent_Conditional_22_ForEmpty_15_Conditional_5_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.busqueda.set(""));
    });
    \u0275\u0275text(2, "Limpiar b\xFAsqueda");
    \u0275\u0275elementEnd();
  }
}
function GestionTableComponent_Conditional_22_ForEmpty_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 34);
    \u0275\u0275template(2, GestionTableComponent_Conditional_22_ForEmpty_15_Conditional_2_Template, 1, 0)(3, GestionTableComponent_Conditional_22_ForEmpty_15_Conditional_3_Template, 1, 0)(4, GestionTableComponent_Conditional_22_ForEmpty_15_Conditional_4_Template, 1, 0)(5, GestionTableComponent_Conditional_22_ForEmpty_15_Conditional_5_Template, 3, 0, "button", 35);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275attribute("colspan", ctx_r1.columnas().length + 2);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r1.puede("ver") ? 2 : ctx_r1.errorCarga() ? 3 : !ctx_r1.registros().length ? 4 : 5);
  }
}
function GestionTableComponent_Conditional_22_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 25);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", ctx_r1.filtrados().length, " de ", ctx_r1.registros().length, " registros");
  }
}
function GestionTableComponent_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20)(1, "table", 21)(2, "caption", 22);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "thead")(5, "tr")(6, "th", 23);
    \u0275\u0275text(7, "N.\xBA");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(8, GestionTableComponent_Conditional_22_For_9_Template, 2, 1, "th", 24, _forTrack0);
    \u0275\u0275elementStart(10, "th", 24);
    \u0275\u0275text(11, "Acciones");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "tbody");
    \u0275\u0275repeaterCreate(13, GestionTableComponent_Conditional_22_For_14_Template, 17, 6, "tr", null, _forTrack1, true, GestionTableComponent_Conditional_22_ForEmpty_15_Template, 6, 2, "tr");
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(16, GestionTableComponent_Conditional_22_Conditional_16_Template, 2, 2, "p", 25);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275attribute("aria-label", "Tabla de " + ctx_r1.titulo());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.titulo());
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r1.columnas());
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r1.filtrados());
    \u0275\u0275advance(3);
    \u0275\u0275conditional(!ctx_r1.errorCarga() ? 16 : -1);
  }
}
function GestionTableComponent_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.errorOperacion());
  }
}
function GestionTableComponent_Conditional_26_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p", 37);
    \u0275\u0275text(3, "La eliminaci\xF3n afectar\xE1 datos reales. Confirma antes de continuar.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 17)(5, "button", 12);
    \u0275\u0275listener("click", function GestionTableComponent_Conditional_26_Conditional_0_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r11);
      \u0275\u0275nextContext(2);
      const modal_r12 = \u0275\u0275reference(24);
      return \u0275\u0275resetView(modal_r12.cerrar());
    });
    \u0275\u0275text(6, "Cancelar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 5);
    \u0275\u0275listener("click", function GestionTableComponent_Conditional_26_Conditional_0_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext(2);
      ctx_r1.confirmando.set(true);
      return \u0275\u0275resetView(ctx_r1.ejecutar());
    });
    \u0275\u0275text(8, "Confirmar eliminaci\xF3n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.identificar(ctx));
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", ctx_r1.guardando());
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.guardando() || !ctx_r1.puede("eliminar"));
  }
}
function GestionTableComponent_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, GestionTableComponent_Conditional_26_Conditional_0_Template, 9, 3);
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional((tmp_3_0 = ctx_r1.detalle()) ? 0 : -1, tmp_3_0);
  }
}
function GestionTableComponent_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 15);
    \u0275\u0275text(1, "Cargando detalle\u2026");
    \u0275\u0275elementEnd();
  }
}
function GestionTableComponent_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.errorDetalle());
  }
}
function GestionTableComponent_Conditional_29_For_6_Conditional_3_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 46);
    \u0275\u0275text(1, "Relaci\xF3n actual");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const campo_r14 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngValue", ctx_r1.relacionActual(campo_r14));
  }
}
function GestionTableComponent_Conditional_29_For_6_Conditional_3_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 46);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const opcion_r15 = ctx.$implicit;
    const campo_r14 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngValue", opcion_r15[campo_r14.clave]);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.nombreRelacion(opcion_r15, campo_r14.clave));
  }
}
function GestionTableComponent_Conditional_29_For_6_Conditional_3_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 42);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const campo_r14 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", ctx_r1.erroresRelacion()[campo_r14.clave], " En edici\xF3n se conserva la relaci\xF3n actual si no la cambias.");
  }
}
function GestionTableComponent_Conditional_29_For_6_Conditional_3_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 39);
    \u0275\u0275text(1, "No hay registros disponibles en este cat\xE1logo.");
    \u0275\u0275elementEnd();
  }
}
function GestionTableComponent_Conditional_29_For_6_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "select", 44)(1, "option", 46);
    \u0275\u0275text(2, "Sin seleccionar");
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, GestionTableComponent_Conditional_29_For_6_Conditional_3_Conditional_3_Template, 2, 1, "option", 46);
    \u0275\u0275repeaterCreate(4, GestionTableComponent_Conditional_29_For_6_Conditional_3_For_5_Template, 2, 2, "option", 46, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, GestionTableComponent_Conditional_29_For_6_Conditional_3_Conditional_6_Template, 2, 1, "p", 42)(7, GestionTableComponent_Conditional_29_For_6_Conditional_3_Conditional_7_Template, 2, 0, "p", 39);
  }
  if (rf & 2) {
    const campo_r14 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("id", ctx_r1.clavePrimaria() + "-" + campo_r14.clave)("formControlName", campo_r14.clave);
    \u0275\u0275advance();
    \u0275\u0275property("ngValue", null);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.relacionSinOpcion(campo_r14) ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.opcionesRelacion()[campo_r14.clave] || \u0275\u0275pureFunction0(6, _c0));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.erroresRelacion()[campo_r14.clave] ? 6 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r1.cargandoRelaciones() && !ctx_r1.erroresRelacion()[campo_r14.clave] && !(ctx_r1.opcionesRelacion()[campo_r14.clave] || \u0275\u0275pureFunction0(7, _c0)).length ? 7 : -1);
  }
}
function GestionTableComponent_Conditional_29_For_6_Conditional_4_For_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 49);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const opcion_r16 = ctx.$implicit;
    \u0275\u0275property("value", opcion_r16.valor);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(opcion_r16.etiqueta);
  }
}
function GestionTableComponent_Conditional_29_For_6_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "input", 47);
    \u0275\u0275elementStart(1, "datalist", 48);
    \u0275\u0275repeaterCreate(2, GestionTableComponent_Conditional_29_For_6_Conditional_4_For_3_Template, 2, 2, "option", 49, _forTrack2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "small", 39);
    \u0275\u0275text(5, "Laravel valida el estado. Las sugerencias corresponden a registros existentes.");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_16_0;
    const campo_r14 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("id", ctx_r1.clavePrimaria() + "-" + campo_r14.clave)("formControlName", campo_r14.clave);
    \u0275\u0275attribute("maxlength", (tmp_16_0 = campo_r14.maximo) !== null && tmp_16_0 !== void 0 ? tmp_16_0 : null)("list", ctx_r1.clavePrimaria() + "-estados");
    \u0275\u0275advance();
    \u0275\u0275property("id", ctx_r1.clavePrimaria() + "-estados");
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.estados(campo_r14));
  }
}
function GestionTableComponent_Conditional_29_For_6_Conditional_5_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 46);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const opcion_r17 = ctx.$implicit;
    \u0275\u0275property("ngValue", opcion_r17.valor);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(opcion_r17.etiqueta);
  }
}
function GestionTableComponent_Conditional_29_For_6_Conditional_5_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 42);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_15_0;
    const campo_r14 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Selecciona Activo o Inactivo. Valor actual: ", (tmp_15_0 = ctx_r1.formulario.controls[campo_r14.clave].value) !== null && tmp_15_0 !== void 0 ? tmp_15_0 : "Sin estado", ".");
  }
}
function GestionTableComponent_Conditional_29_For_6_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "select", 47)(1, "option", 50);
    \u0275\u0275text(2, "Selecciona un estado");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(3, GestionTableComponent_Conditional_29_For_6_Conditional_5_For_4_Template, 2, 2, "option", 46, _forTrack3);
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, GestionTableComponent_Conditional_29_For_6_Conditional_5_Conditional_5_Template, 2, 1, "p", 42);
  }
  if (rf & 2) {
    const campo_r14 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("id", ctx_r1.clavePrimaria() + "-" + campo_r14.clave)("formControlName", campo_r14.clave);
    \u0275\u0275advance();
    \u0275\u0275property("ngValue", null);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.estados(campo_r14));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.formulario.controls[campo_r14.clave].hasError("estado") ? 5 : -1);
  }
}
function GestionTableComponent_Conditional_29_For_6_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "select", 44)(1, "option", 46);
    \u0275\u0275text(2, "Activo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "option", 46);
    \u0275\u0275text(4, "Inactivo");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const campo_r14 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("id", ctx_r1.clavePrimaria() + "-" + campo_r14.clave)("formControlName", campo_r14.clave);
    \u0275\u0275advance();
    \u0275\u0275property("ngValue", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngValue", false);
  }
}
function GestionTableComponent_Conditional_29_For_6_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "input", 45);
  }
  if (rf & 2) {
    let tmp_17_0;
    const campo_r14 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("id", ctx_r1.clavePrimaria() + "-" + campo_r14.clave)("type", campo_r14.tipo)("formControlName", campo_r14.clave);
    \u0275\u0275attribute("maxlength", (tmp_17_0 = campo_r14.maximo) !== null && tmp_17_0 !== void 0 ? tmp_17_0 : null)("required", campo_r14.obligatorio ? "" : null);
  }
}
function GestionTableComponent_Conditional_29_For_6_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 42);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const campo_r14 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.formulario.controls[campo_r14.clave].getError("servidor") || "Revisa el campo. " + (campo_r14.obligatorio ? "Es obligatorio. " : "") + (campo_r14.maximo ? "M\xE1ximo " + campo_r14.maximo + " caracteres." : "Ingresa un valor v\xE1lido."));
  }
}
function GestionTableComponent_Conditional_29_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10)(1, "label", 43);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, GestionTableComponent_Conditional_29_For_6_Conditional_3_Template, 8, 8)(4, GestionTableComponent_Conditional_29_For_6_Conditional_4_Template, 6, 5)(5, GestionTableComponent_Conditional_29_For_6_Conditional_5_Template, 6, 4)(6, GestionTableComponent_Conditional_29_For_6_Conditional_6_Template, 5, 4, "select", 44)(7, GestionTableComponent_Conditional_29_For_6_Conditional_7_Template, 1, 5, "input", 45)(8, GestionTableComponent_Conditional_29_For_6_Conditional_8_Template, 2, 1, "p", 42);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const campo_r14 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("for", ctx_r1.clavePrimaria() + "-" + campo_r14.clave);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", ctx_r1.etiqueta(campo_r14), "", campo_r14.obligatorio ? " *" : "", "");
    \u0275\u0275advance();
    \u0275\u0275conditional(campo_r14.relacion ? 3 : campo_r14.clave === "estado" && campo_r14.tipo !== "boolean" ? 4 : campo_r14.clave === "estado" ? 5 : campo_r14.tipo === "boolean" ? 6 : 7);
    \u0275\u0275advance(5);
    \u0275\u0275conditional(ctx_r1.formulario.controls[campo_r14.clave].touched && ctx_r1.formulario.controls[campo_r14.clave].invalid ? 8 : -1);
  }
}
function GestionTableComponent_Conditional_29_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 42);
    \u0275\u0275text(1, "La fecha final debe ser igual o posterior a la fecha inicial.");
    \u0275\u0275elementEnd();
  }
}
function GestionTableComponent_Conditional_29_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 15);
    \u0275\u0275text(1, "Cargando opciones autorizadas...");
    \u0275\u0275elementEnd();
  }
}
function GestionTableComponent_Conditional_29_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 37);
    \u0275\u0275text(1, "Confirma el env\xEDo de estos datos al servidor.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 17)(3, "button", 12);
    \u0275\u0275listener("click", function GestionTableComponent_Conditional_29_Conditional_9_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r18);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.confirmando.set(false));
    });
    \u0275\u0275text(4, "Volver al formulario");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 5);
    \u0275\u0275listener("click", function GestionTableComponent_Conditional_29_Conditional_9_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r18);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.ejecutar());
    });
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r1.guardando());
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.guardando());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.guardando() ? "Guardando..." : "Confirmar y guardar");
  }
}
function GestionTableComponent_Conditional_29_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 17)(1, "button", 36);
    \u0275\u0275listener("click", function GestionTableComponent_Conditional_29_Conditional_10_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r19);
      \u0275\u0275nextContext(2);
      const modal_r12 = \u0275\u0275reference(24);
      return \u0275\u0275resetView(modal_r12.cerrar());
    });
    \u0275\u0275text(2, "Cancelar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 51);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r1.formulario.invalid || ctx_r1.relacionesInvalidas() || ctx_r1.cargandoRelaciones() || !ctx_r1.puede(ctx_r1.modo() === "nuevo" ? "crear" : "editar"));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.modo() === "nuevo" ? "Guardar" : "Guardar cambios");
  }
}
function GestionTableComponent_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 38);
    \u0275\u0275listener("ngSubmit", function GestionTableComponent_Conditional_29_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.validar());
    });
    \u0275\u0275elementStart(1, "p", 39);
    \u0275\u0275text(2, "Los campos con * son obligatorios.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "fieldset", 40)(4, "div", 41);
    \u0275\u0275repeaterCreate(5, GestionTableComponent_Conditional_29_For_6_Template, 9, 5, "div", 10, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(7, GestionTableComponent_Conditional_29_Conditional_7_Template, 2, 0, "p", 42)(8, GestionTableComponent_Conditional_29_Conditional_8_Template, 2, 0, "p", 15)(9, GestionTableComponent_Conditional_29_Conditional_9_Template, 7, 3)(10, GestionTableComponent_Conditional_29_Conditional_10_Template, 5, 2, "div", 17);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("formGroup", ctx_r1.formulario);
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r1.guardando() || ctx_r1.confirmando() || ctx_r1.cargandoRelaciones());
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.config().campos);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.formulario.hasError("ordenFechas") ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.cargandoRelaciones() ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.confirmando() ? 9 : 10);
  }
}
function GestionTableComponent_Conditional_30_Conditional_0_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "dt");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "dd");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const columna_r20 = ctx.$implicit;
    const registro_r21 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(columna_r20.etiqueta);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.mostrar(registro_r21, columna_r20));
  }
}
function GestionTableComponent_Conditional_30_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dl", 52);
    \u0275\u0275repeaterCreate(1, GestionTableComponent_Conditional_30_Conditional_0_For_2_Template, 5, 2, "div", null, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.columnasDetalle());
  }
}
function GestionTableComponent_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, GestionTableComponent_Conditional_30_Conditional_0_Template, 3, 0, "dl", 52);
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional((tmp_3_0 = ctx_r1.detalle()) ? 0 : -1, tmp_3_0);
  }
}
function GestionTableComponent_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    const _r22 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 17)(1, "button", 36);
    \u0275\u0275listener("click", function GestionTableComponent_Conditional_31_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r22);
      \u0275\u0275nextContext();
      const modal_r12 = \u0275\u0275reference(24);
      return \u0275\u0275resetView(modal_r12.cerrar());
    });
    \u0275\u0275text(2, "Cerrar");
    \u0275\u0275elementEnd()();
  }
}
var GestionTableComponent = class _GestionTableComponent {
  titulo = input.required();
  descripcion = input.required();
  columnas = input.required();
  clavePrimaria = input.required();
  servicio = input.required();
  embedded = input(false);
  encabezadoNumerado = computed(() => [
    "id_persona",
    "id_persona_documento",
    "id_persona_trabajador",
    "id_persona_practicante",
    "id_practica",
    "id_practica_supervisor",
    "id_persona_ponente"
  ].includes(this.clavePrimaria()));
  destroyRef = inject(DestroyRef);
  platformId = inject(PLATFORM_ID);
  fechas = new DatePipe("en-US");
  dialogo = viewChild.required(DialogoComponent);
  consultaDetalle;
  registros = signal([]);
  busqueda = signal("");
  cargando = signal(false);
  errorCarga = signal("");
  detalle = signal(null);
  cargandoDetalle = signal(false);
  errorDetalle = signal("");
  filtrados = computed(() => {
    const terminos = this.normalizar(this.busqueda()).trim().split(/\s+/);
    return this.registros().filter((registro) => {
      const texto = this.normalizar(this.columnas().map((columna) => this.mostrar(registro, columna)).join(" "));
      return terminos.every((termino) => texto.includes(termino));
    });
  });
  auth = inject(AuthService);
  config = computed(() => GESTION_CONFIG[this.clavePrimaria()]);
  modo = signal("detalle");
  guardando = signal(false);
  confirmando = signal(false);
  mensaje = signal("");
  errorOperacion = signal("");
  opcionesRelacion = signal({});
  erroresRelacion = signal({});
  cargandoRelaciones = signal(false);
  formulario = new FormGroup({});
  seleccion = null;
  generacion = 0;
  catalogos = signal({});
  consultasCatalogo = /* @__PURE__ */ new Set();
  relaciones = {
    "id_persona": inject(PersonService),
    "id_persona_documento": inject(PersonDocumentService),
    "id_persona_trabajador": inject(PersonWorkerService),
    "id_persona_practicante": inject(PersonInternService),
    "id_practica": inject(PracticeService),
    "id_practica_supervisor": inject(PracticeSupervisorService),
    "id_persona_ponente": inject(PersonSpeakerService),
    "id_area": inject(AreaService),
    "id_tipo_documento": inject(DocumentTypeService),
    "id_institucion": inject(InstitutionService)
  };
  finalizandoPractica = signal(null);
  practicaFinalizada(registro) {
    return String(registro["estado"]).trim().toLocaleLowerCase() === "finalizado";
  }
  finalizarPractica(registro) {
    if (this.finalizandoPractica() !== null || !this.puede("editar") || this.practicaFinalizada(registro))
      return;
    const practicante = this.catalogos()["id_persona_practicante"]?.find((r) => Number(r["id_persona_practicante"]) === Number(registro["id_persona_practicante"]));
    const referencia = practicante ? `de ${this.nombreRelacion(practicante, "id_persona_practicante")}, ` : "";
    if (!window.confirm(`\xBFFinalizar la pr\xE1ctica ${referencia}${registro["carrera"] ?? ""}, del ${registro["fecha_inicio"] ?? "inicio no registrado"} al ${registro["fecha_fin"] ?? "fin no registrado"}?`))
      return;
    const id = Number(registro["id_practica"]);
    this.finalizandoPractica.set(id);
    this.errorCarga.set("");
    this.relaciones["id_practica"].finalizar(id).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.finalizandoPractica.set(null))).subscribe({
      next: (e) => {
        this.registros.update((rs) => rs.map((r) => Number(r["id_practica"]) === id ? __spreadValues(__spreadValues({}, r), e.practica) : r));
        this.servicio().obtener(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: (fila) => this.registros.update((rs) => rs.map((r) => Number(r["id_practica"]) === id ? fila : r)),
          error: () => this.errorCarga.set("Pr\xE1ctica finalizada. No se pudo actualizar su detalle.")
        });
      },
      error: (e) => this.errorCarga.set(e?.status === 409 ? (e?.error?.data?.motivos_bloqueo ?? []).join(" ") || e?.error?.message || "El servidor no permite finalizar esta pr\xE1ctica." : e?.status === 403 ? "No tienes permiso para finalizar esta pr\xE1ctica." : "No se pudo finalizar la pr\xE1ctica. Intenta nuevamente.")
    });
  }
  puede(accion) {
    const clave = this.config()?.permisos[accion];
    const ver = this.config()?.permisos["ver"];
    return !!clave && this.auth.tienePermiso(clave) && (accion === "crear" || !!ver && this.auth.tienePermiso(ver));
  }
  estadoPermisos() {
    return ["ver", "crear", "editar", "eliminar"].filter((a) => !this.puede(a)).map((a) => {
      const clave = this.config()?.permisos[a];
      if (!clave)
        return `${a}: sin asignaci\xF3n habilitada en Laravel`;
      const lectura = this.config()?.permisos["ver"];
      const faltante = !this.auth.tienePermiso(clave) ? clave : lectura;
      return `${a}: falta el permiso efectivo ${faltante}`;
    }).join(". ");
  }
  etiqueta(campo) {
    const relaciones = { id_persona: "Persona", id_area: "\xC1rea", id_institucion: "Instituci\xF3n", id_tipo_documento: "Tipo de documento", id_persona_practicante: "Practicante", id_persona_trabajador: "Trabajador", id_practica: "Pr\xE1ctica" };
    return relaciones[campo.clave] ?? this.columnas().find((c) => c.clave === campo.clave)?.etiqueta ?? campo.clave;
  }
  estados(campo) {
    return campo.tipo === "boolean" ? [{ etiqueta: "Activo", valor: true }, { etiqueta: "Inactivo", valor: false }] : [...new Set([...this.registros().map((registro) => registro[campo.clave]), this.seleccion?.[campo.clave]].filter((valor) => typeof valor === "string" && valor.trim().length > 0))].map((valor) => ({ etiqueta: valor, valor }));
  }
  relacionActual(campo) {
    return this.modo() === "editar" ? this.seleccion?.[campo.clave] : null;
  }
  relacionSinOpcion(campo) {
    const id = this.relacionActual(campo);
    return id !== null && id !== void 0 && !this.opcionesRelacion()[campo.clave]?.some((r) => Number(r[campo.clave]) === Number(id));
  }
  relacionesInvalidas() {
    return this.config().campos.some((c) => c.relacion && c.obligatorio && !this.opcionesRelacion()[c.clave]?.length && !this.relacionActual(c));
  }
  columnasDetalle() {
    const columnas = [...this.columnas()];
    for (const clave of Object.keys(this.detalle() ?? {})) {
      if (!columnas.some((c) => c.clave === clave))
        columnas.push({ clave, etiqueta: clave.replace(/_/g, " ") });
    }
    return columnas;
  }
  nombreRelacion(registro, clave) {
    const persona = this.catalogos()["id_persona"]?.find((p) => Number(p["id_persona"]) === Number(registro["id_persona"]));
    const datosPersona = persona ?? registro;
    const nombre = [datosPersona["nombres"], datosPersona["apellido_paterno"], datosPersona["apellido_materno"]].filter(Boolean).join(" ") || String(registro["nombre"] ?? registro["nombre_institucion"] ?? registro["codigo"] ?? registro["carrera"] ?? registro["cargo"] ?? "Registro");
    return nombre;
  }
  cargarDescripciones(claves) {
    for (const clave of claves) {
      const config = GESTION_CONFIG[clave];
      if (!config || this.consultasCatalogo.has(clave) || !this.auth.tienePermiso(config.permisos["ver"] ?? ""))
        continue;
      this.consultasCatalogo.add(clave);
      this.relaciones[clave].listar().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (registros) => {
          this.catalogos.update((c) => __spreadProps(__spreadValues({}, c), { [clave]: registros }));
          if (registros.length)
            this.cargarDescripciones(config.campos.filter((c) => c.relacion).map((c) => c.relacion));
        },
        error: () => {
          this.consultasCatalogo.delete(clave);
        }
      });
    }
  }
  identificar(registro) {
    return this.columnas().filter((c) => c.formato !== "booleano").slice(0, 4).map((c) => `${c.etiqueta}: ${this.mostrar(registro, c)}`).join(" - ");
  }
  abrirFormulario(modo, registro) {
    if (this.guardando() || !this.puede(modo === "nuevo" ? "crear" : "editar") || modo === "editar" && !registro)
      return;
    this.cancelarDetalle();
    this.modo.set(modo);
    this.seleccion = registro ?? null;
    this.mensaje.set("");
    this.errorOperacion.set("");
    this.errorDetalle.set("");
    this.confirmando.set(false);
    const controles = {};
    for (const campo of this.config().campos) {
      const validadores = [];
      if (campo.clave === "estado" && campo.tipo === "boolean")
        validadores.push((control) => this.estados(campo).some((opcion) => opcion.valor === control.value) ? null : { estado: true });
      if (campo.obligatorio && campo.tipo !== "boolean")
        validadores.push(Validators.required);
      if (campo.tipo === "text" && campo.obligatorio)
        validadores.push(Validators.pattern(/\S/));
      if (campo.maximo)
        validadores.push(Validators.maxLength(campo.maximo));
      if (campo.tipo === "number")
        validadores.push(Validators.min(1), Validators.pattern(/^\d+$/));
      if (campo.tipo === "date")
        validadores.push((c) => {
          if (!c.value)
            return null;
          const fecha = /* @__PURE__ */ new Date(`${c.value}T00:00:00Z`);
          return !Number.isNaN(fecha.getTime()) && fecha.toISOString().slice(0, 10) === c.value ? null : { fecha: true };
        });
      controles[campo.clave] = new FormControl(campo.relacion ? null : campo.tipo === "boolean" ? true : "", validadores);
    }
    this.formulario = new FormGroup(controles, { validators: (grupo) => {
      const inicio = grupo.get("fecha_inicio")?.value || grupo.get("fecha_ingreso")?.value;
      const fin = grupo.get("fecha_fin")?.value;
      return inicio && fin && fin < inicio ? { ordenFechas: true } : null;
    } });
    this.dialogo().abrir();
    this.cargarRelaciones();
    if (registro) {
      this.cargandoDetalle.set(true);
      this.consultaDetalle = this.servicio().obtener(Number(registro[this.clavePrimaria()])).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.cargandoDetalle.set(false))).subscribe({ next: (r) => {
        this.seleccion = __spreadProps(__spreadValues({}, r), { [this.clavePrimaria()]: registro[this.clavePrimaria()] });
        for (const campo of this.config().campos) {
          let valor = r[campo.clave] ?? "";
          if (campo.tipo === "date" && typeof valor === "string")
            valor = valor.slice(0, 10);
          this.formulario.controls[campo.clave].setValue(valor);
        }
      }, error: (e) => this.errorDetalle.set(this.mensajeError(e)) });
    }
  }
  cargarRelaciones() {
    const generacion = ++this.generacion;
    this.opcionesRelacion.set({});
    this.erroresRelacion.set({});
    const campos = this.config().campos.filter((c) => c.relacion);
    let pendientes = campos.length;
    this.cargandoRelaciones.set(pendientes > 0);
    for (const campo of campos) {
      const clave = campo.relacion;
      const permiso = GESTION_CONFIG[clave]?.permisos["ver"];
      const terminar = () => {
        if (generacion === this.generacion && --pendientes === 0)
          this.cargandoRelaciones.set(false);
      };
      if (!permiso || !this.auth.tienePermiso(permiso)) {
        this.erroresRelacion.update((e) => __spreadProps(__spreadValues({}, e), { [clave]: `No autorizado para consultar este cat\xE1logo. Se necesita el permiso efectivo ${permiso ?? "no configurado"}.` }));
        terminar();
        continue;
      }
      this.relaciones[clave].listar().pipe(takeUntilDestroyed(this.destroyRef), finalize(terminar)).subscribe({
        next: (r) => {
          if (generacion === this.generacion)
            this.opcionesRelacion.update((o) => __spreadProps(__spreadValues({}, o), { [clave]: r }));
        },
        error: (e) => {
          if (generacion === this.generacion)
            this.erroresRelacion.update((o) => __spreadProps(__spreadValues({}, o), { [clave]: `${this.mensajeError(e)} Permiso de lectura requerido: ${permiso}.` }));
        }
      });
    }
  }
  solicitarEliminar(registro) {
    if (!this.puede("eliminar") || this.guardando())
      return;
    this.cancelarDetalle();
    this.seleccion = registro;
    this.detalle.set(registro);
    this.mensaje.set("");
    this.modo.set("eliminar");
    this.confirmando.set(true);
    this.errorOperacion.set("");
    this.errorDetalle.set("");
    this.dialogo().abrir();
  }
  validar() {
    this.confirmando.set(false);
    this.formulario.markAllAsTouched();
    this.errorOperacion.set("");
    if (this.formulario.invalid || this.relacionesInvalidas() || this.cargandoDetalle() || this.cargandoRelaciones() || this.errorDetalle())
      return;
    const valores = this.formulario.value;
    const inicio = valores["fecha_inicio"] || valores["fecha_ingreso"];
    if (inicio && valores["fecha_fin"] && valores["fecha_fin"] < inicio) {
      this.errorOperacion.set("La fecha final debe ser igual o posterior a la fecha inicial.");
      return;
    }
    for (const campo of this.config().campos.filter((c) => c.relacion)) {
      const valor = valores[campo.clave];
      const original = this.seleccion?.[campo.clave];
      if (valor !== null && valor !== "" && valor !== void 0 && !this.opcionesRelacion()[campo.clave]?.some((r) => Number(r[campo.clave]) === Number(valor))) {
        if (this.modo() === "editar" && Number(original) === Number(valor))
          continue;
        this.errorOperacion.set("Selecciona un registro relacionado autorizado.");
        return;
      }
    }
    this.confirmando.set(true);
  }
  ejecutar() {
    if (this.modo() === "detalle")
      return;
    const accion = this.modo() === "nuevo" ? "crear" : this.modo() === "editar" ? "editar" : "eliminar";
    if (!this.confirmando() || !this.puede(accion) || this.guardando())
      return;
    if (accion !== "eliminar") {
      this.confirmando.set(false);
      this.validar();
      if (!this.confirmando())
        return;
    }
    const servicio = this.servicio();
    const payload = {};
    for (const campo of this.config().campos) {
      const valor = this.formulario.controls[campo.clave]?.value;
      payload[campo.clave] = valor === "" || valor === void 0 ? null : campo.tipo === "number" ? Number(valor) : typeof valor === "string" ? valor.trim() : valor;
    }
    const id = Number(this.seleccion?.[this.clavePrimaria()]);
    if (accion !== "crear" && (!Number.isSafeInteger(id) || id <= 0))
      return;
    const solicitud = accion === "crear" ? servicio.crear?.(payload) : accion === "editar" ? servicio.actualizar?.(id, payload) : servicio.eliminar?.(id);
    if (!solicitud) {
      this.errorOperacion.set("Servicio no disponible.");
      return;
    }
    this.guardando.set(true);
    this.errorOperacion.set("");
    solicitud.pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.guardando.set(false))).subscribe({
      next: (r) => {
        this.mensaje.set(r.message);
        this.dialogo().cerrar();
        this.cargar();
      },
      error: (e) => {
        this.errorOperacion.set(this.mensajeError(e));
        this.confirmando.set(false);
        if (e instanceof HttpErrorResponse && e.status === 422) {
          const errores = e.error?.data ?? e.error?.errors;
          if (errores && typeof errores === "object") {
            for (const [clave, mensajes] of Object.entries(errores)) {
              this.formulario.controls[clave]?.setErrors({ servidor: Array.isArray(mensajes) ? mensajes.join(" ") : String(mensajes) });
            }
          }
        }
      }
    });
  }
  ngOnInit() {
    if (isPlatformBrowser(this.platformId))
      this.cargar();
  }
  cargar() {
    if (this.cargando() || !this.puede("ver"))
      return;
    this.cargando.set(true);
    this.errorCarga.set("");
    this.registros.set([]);
    this.servicio().listar().pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.cargando.set(false))).subscribe({
      next: (registros) => {
        this.registros.set(registros);
        if (registros.length)
          this.cargarDescripciones(this.config().campos.filter((c) => c.relacion).map((c) => c.relacion));
      },
      error: (error) => this.errorCarga.set(this.mensajeError(error))
    });
  }
  ver(registro) {
    if (!this.puede("ver") || this.guardando())
      return;
    this.cancelarDetalle();
    this.modo.set("detalle");
    this.errorOperacion.set("");
    this.detalle.set(null);
    this.errorDetalle.set("");
    this.dialogo().abrir();
    const id = Number(registro[this.clavePrimaria()]);
    if (!Number.isSafeInteger(id) || id <= 0) {
      this.errorDetalle.set("El registro no tiene un identificador v\xE1lido para consultar su detalle.");
      return;
    }
    this.cargandoDetalle.set(true);
    this.consultaDetalle = this.servicio().obtener(id).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.cargandoDetalle.set(false))).subscribe({
      next: (detalle) => this.detalle.set(detalle),
      error: (error) => this.errorDetalle.set(this.mensajeError(error))
    });
  }
  cancelarDetalle() {
    this.consultaDetalle?.unsubscribe();
  }
  mostrar(registro, columna) {
    const valor = registro[columna.clave];
    if (valor === null || valor === void 0 || valor === "")
      return "\u2014";
    if (columna.clave !== this.clavePrimaria() && this.config().campos.some((c) => c.clave === columna.clave && c.relacion)) {
      const relacionado = this.catalogos()[columna.clave]?.find((r) => Number(r[columna.clave]) === Number(valor));
      if (relacionado)
        return this.nombreRelacion(relacionado, columna.clave);
    }
    if (columna.formato === "booleano")
      return valor === true ? "Activo" : valor === false ? "Inactivo" : String(valor);
    if (columna.formato === "fecha" && typeof valor === "string" && !Number.isNaN(Date.parse(valor))) {
      return this.fechas.transform(valor, "dd/MM/yyyy", "UTC") ?? "\u2014";
    }
    return String(valor);
  }
  normalizar(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es");
  }
  mensajeError(error) {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 403)
        return "No tienes permiso para realizar esta operaci\xF3n. El registro no fue modificado.";
      if (error.status === 401)
        return "Tu sesi\xF3n ha vencido. Inicia sesi\xF3n nuevamente.";
      if (error.status === 404)
        return "No se encontr\xF3 el recurso solicitado.";
      if (error.status === 409)
        return error.error?.message || "No se puede completar la operaci\xF3n: existen registros relacionados.";
      if (error.error?.message && error.status !== 0)
        return String(error.error.message);
      if (error.status === 0)
        return "No se pudo conectar con el servidor. Comprueba la conexi\xF3n e intenta nuevamente.";
    }
    if (error instanceof Error)
      return error.message;
    return "No se pudo consultar la informaci\xF3n. Intenta nuevamente con Recargar listado.";
  }
  static \u0275fac = function GestionTableComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _GestionTableComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _GestionTableComponent, selectors: [["app-gestion-table"]], viewQuery: function GestionTableComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuerySignal(ctx.dialogo, DialogoComponent, 5);
    }
    if (rf & 2) {
      \u0275\u0275queryAdvance();
    }
  }, inputs: { titulo: [1, "titulo"], descripcion: [1, "descripcion"], columnas: [1, "columnas"], clavePrimaria: [1, "clavePrimaria"], servicio: [1, "servicio"], embedded: [1, "embedded"] }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 32, vars: 17, consts: [["buscar", ""], ["modal", ""], [3, "title"], [1, "encabezado"], [1, "descripcion"], ["type", "button", 1, "btn", "btn-primary", 3, "click", "disabled"], ["aria-hidden", "true", 1, "material-symbols-outlined"], ["role", "note", 1, "alert", "alert-advertencia"], ["role", "status", 1, "alert"], ["role", "search", 1, "filtros", 3, "submit"], [1, "form-field"], ["type", "search", "placeholder", "Buscar en los campos de la tabla", "autocomplete", "off", 1, "input", 3, "input", "value"], ["type", "button", 1, "btn", 3, "click", "disabled"], ["role", "alert", 1, "alert", "alert-error"], [3, "cerrado", "titulo"], ["role", "status"], ["novalidate", "", 3, "formGroup"], [1, "acciones", "pie"], ["role", "status", 1, "sr-only"], ["aria-hidden", "true", 1, "esqueleto"], ["role", "region", "tabindex", "0", 1, "tabla-caja"], [1, "table"], [1, "sr-only"], ["scope", "col", 1, "col-numero"], ["scope", "col"], ["role", "status", 1, "form-ayuda", "resultados"], ["data-label", "N.\xBA", 1, "col-numero"], [1, "acciones"], ["type", "button", "title", "Ver", 1, "btn", "btn-icono", 3, "click", "disabled"], ["type", "button", "aria-label", "Editar", "title", "Editar", 1, "btn", "btn-icono", 3, "click", "disabled"], ["type", "button", "aria-label", "Eliminar", "title", "Eliminar", 1, "btn", "btn-icono", 3, "click", "disabled"], [1, "badge", 3, "badge-exito"], [1, "badge"], ["type", "button", 1, "btn", 3, "disabled"], ["role", "status", 1, "estado"], ["type", "button", 1, "btn"], ["type", "button", 1, "btn", 3, "click"], [1, "alert", "alert-advertencia"], ["novalidate", "", 3, "ngSubmit", "formGroup"], [1, "form-ayuda"], [3, "disabled"], [1, "formulario"], ["role", "alert", 1, "error-text"], [3, "for"], [1, "input", 3, "id", "formControlName"], [1, "input", 3, "id", "type", "formControlName"], [3, "ngValue"], ["required", "", 1, "input", 3, "id", "formControlName"], [3, "id"], [3, "value"], ["disabled", "", 3, "ngValue"], ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"], [1, "detalle"]], template: function GestionTableComponent_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "section");
      \u0275\u0275template(1, GestionTableComponent_Conditional_1_Template, 2, 1, "h2")(2, GestionTableComponent_Conditional_2_Template, 1, 1, "app-page-title", 2);
      \u0275\u0275elementStart(3, "div", 3)(4, "p", 4);
      \u0275\u0275text(5);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "button", 5);
      \u0275\u0275listener("click", function GestionTableComponent_Template_button_click_6_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.abrirFormulario("nuevo"));
      });
      \u0275\u0275elementStart(7, "span", 6);
      \u0275\u0275text(8, "add");
      \u0275\u0275elementEnd();
      \u0275\u0275text(9, "Nuevo registro ");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(10, GestionTableComponent_Conditional_10_Template, 2, 1, "p", 7)(11, GestionTableComponent_Conditional_11_Template, 2, 1, "p", 8);
      \u0275\u0275elementStart(12, "form", 9);
      \u0275\u0275listener("submit", function GestionTableComponent_Template_form_submit_12_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView($event.preventDefault());
      });
      \u0275\u0275elementStart(13, "label", 10);
      \u0275\u0275text(14, "Buscar registros ");
      \u0275\u0275elementStart(15, "input", 11, 0);
      \u0275\u0275listener("input", function GestionTableComponent_Template_input_input_15_listener() {
        \u0275\u0275restoreView(_r1);
        const buscar_r3 = \u0275\u0275reference(16);
        return \u0275\u0275resetView(ctx.busqueda.set(buscar_r3.value));
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(17, "button", 12);
      \u0275\u0275listener("click", function GestionTableComponent_Template_button_click_17_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.cargar());
      });
      \u0275\u0275text(18);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(19, "div");
      \u0275\u0275template(20, GestionTableComponent_Conditional_20_Template, 5, 2, "div", 13)(21, GestionTableComponent_Conditional_21_Template, 6, 1)(22, GestionTableComponent_Conditional_22_Template, 17, 4);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(23, "app-dialogo", 14, 1);
      \u0275\u0275listener("cerrado", function GestionTableComponent_Template_app_dialogo_cerrado_23_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.cancelarDetalle());
      });
      \u0275\u0275template(25, GestionTableComponent_Conditional_25_Template, 2, 1, "p", 13)(26, GestionTableComponent_Conditional_26_Template, 1, 1)(27, GestionTableComponent_Conditional_27_Template, 2, 0, "p", 15)(28, GestionTableComponent_Conditional_28_Template, 2, 1, "p", 13)(29, GestionTableComponent_Conditional_29_Template, 11, 5, "form", 16)(30, GestionTableComponent_Conditional_30_Template, 1, 1)(31, GestionTableComponent_Conditional_31_Template, 3, 0, "div", 17);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275attribute("aria-label", ctx.titulo());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.embedded() ? 1 : 2);
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(ctx.descripcion());
      \u0275\u0275advance();
      \u0275\u0275property("disabled", !ctx.puede("crear") || ctx.guardando());
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.estadoPermisos() ? 10 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.mensaje() ? 11 : -1);
      \u0275\u0275advance();
      \u0275\u0275attribute("aria-label", "Buscar en " + ctx.titulo());
      \u0275\u0275advance(3);
      \u0275\u0275property("value", ctx.busqueda());
      \u0275\u0275advance(2);
      \u0275\u0275property("disabled", ctx.cargando() || !ctx.puede("ver"));
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.cargando() ? "Cargando\u2026" : "Recargar listado");
      \u0275\u0275advance();
      \u0275\u0275attribute("aria-busy", ctx.cargando());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.errorCarga() ? 20 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.cargando() ? 21 : 22);
      \u0275\u0275advance(2);
      \u0275\u0275property("titulo", (ctx.modo() === "nuevo" ? "Nuevo registro" : ctx.modo() === "editar" ? "Editar" : ctx.modo() === "eliminar" ? "Confirmar eliminaci\xF3n" : "Detalle") + " - " + ctx.titulo());
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.errorOperacion() ? 25 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.modo() === "eliminar" ? 26 : ctx.cargandoDetalle() ? 27 : ctx.errorDetalle() ? 28 : ctx.modo() !== "detalle" ? 29 : 30);
      \u0275\u0275advance(5);
      \u0275\u0275conditional(ctx.modo() === "detalle" || ctx.errorDetalle() ? 31 : -1);
    }
  }, dependencies: [DialogoComponent, PageTitleComponent, ReactiveFormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, FormGroupDirective, FormControlName], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\nh2[_ngcontent-%COMP%] {\n  margin: 0 0 var(--espacio-4);\n  font-size: 1.25rem;\n}\n.encabezado[_ngcontent-%COMP%], \n.filtros[_ngcontent-%COMP%], \n.acciones[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: var(--espacio-3);\n  flex-wrap: wrap;\n}\n.encabezado[_ngcontent-%COMP%] {\n  justify-content: space-between;\n  margin-bottom: var(--espacio-4);\n}\n.descripcion[_ngcontent-%COMP%] {\n  margin: 0;\n  color: var(--neutro-500);\n}\n.filtros[_ngcontent-%COMP%] {\n  align-items: flex-end;\n  margin-bottom: var(--espacio-5);\n}\n.form-field[_ngcontent-%COMP%] {\n  flex: 1 1 18rem;\n  max-width: 32rem;\n  margin: 0;\n}\n.tabla-caja[_ngcontent-%COMP%] {\n  max-width: 100%;\n  overflow-x: auto;\n  border: 1px solid var(--neutro-200);\n  border-radius: var(--radio-lg);\n}\n.table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%], \n.table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  padding: var(--espacio-3);\n  min-width: 6rem;\n  overflow-wrap: anywhere;\n}\n.acciones[_ngcontent-%COMP%] {\n  gap: var(--espacio-2);\n}\n.estado[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: var(--espacio-5);\n}\n.resultados[_ngcontent-%COMP%] {\n  margin-top: var(--espacio-3);\n}\n.detalle[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: var(--espacio-4);\n}\n.detalle[_ngcontent-%COMP%]   dt[_ngcontent-%COMP%] {\n  color: var(--neutro-500);\n}\n.detalle[_ngcontent-%COMP%]   dd[_ngcontent-%COMP%] {\n  margin: var(--espacio-1) 0 0;\n  overflow-wrap: anywhere;\n}\n.pie[_ngcontent-%COMP%] {\n  justify-content: flex-end;\n  margin-top: var(--espacio-4);\n}\n@media (max-width: 768px) {\n  .encabezado[_ngcontent-%COMP%]    > .btn[_ngcontent-%COMP%], \n   .filtros[_ngcontent-%COMP%]    > .btn[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n  .form-field[_ngcontent-%COMP%] {\n    max-width: none;\n  }\n  .detalle[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\nfieldset[_ngcontent-%COMP%] {\n  border: 0;\n  padding: 0;\n  margin: 0;\n  min-width: 0;\n}\n.formulario[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: var(--espacio-4);\n}\n.error-text[_ngcontent-%COMP%] {\n  color: var(--color-error);\n}\n.acciones[_ngcontent-%COMP%] {\n  flex-wrap: wrap;\n}\n@media (max-width: 768px) {\n  .formulario[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.acciones[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n  white-space: nowrap;\n  flex-shrink: 0;\n  word-break: normal;\n  overflow-wrap: normal;\n}\n.table[_ngcontent-%COMP%] {\n  min-width: 48rem;\n}\n/*# sourceMappingURL=gestion-table.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(GestionTableComponent, { className: "GestionTableComponent", filePath: "src\\app\\shared\\components\\gestion-table\\gestion-table.component.ts", lineNumber: 40 });
})();

export {
  InstitutionService,
  PracticeSupervisorService,
  PersonInternService,
  GestionTableComponent
};
//# sourceMappingURL=chunk-A67UVJJN.mjs.map
