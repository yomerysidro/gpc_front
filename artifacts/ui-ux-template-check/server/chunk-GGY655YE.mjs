import './polyfills.server.mjs';
import {
  GestionTableComponent,
  InstitutionService,
  PersonInternService,
  PracticeSupervisorService
} from "./chunk-A67UVJJN.mjs";
import {
  ListadoEmisionComponent
} from "./chunk-3GIIWH3N.mjs";
import {
  CONFIGURACION_EMISION
} from "./chunk-TL467TQE.mjs";
import "./chunk-FBNEJSMB.mjs";
import {
  PracticeService
} from "./chunk-SBB4NALW.mjs";
import {
  CATALOGOS_CLASIFICACIONES,
  CATALOGOS_INSTITUCIONALES
} from "./chunk-QG4BEULN.mjs";
import "./chunk-PM6SETE6.mjs";
import "./chunk-Y2AZ2EMT.mjs";
import {
  PageTitleComponent
} from "./chunk-XGG6XIOR.mjs";
import {
  ActivatedRoute,
  Router
} from "./chunk-OX7VSSQH.mjs";
import "./chunk-VNKXA6HD.mjs";
import "./chunk-NP7M7R34.mjs";
import "./chunk-UOKIJFGD.mjs";
import {
  AreaService,
  DocumentTypeService,
  PersonDocumentService
} from "./chunk-7VY3YOD2.mjs";
import {
  PersonService
} from "./chunk-2XE3PF63.mjs";
import "./chunk-JMI3IFFT.mjs";
import "./chunk-HFD7K63G.mjs";
import {
  toSignal
} from "./chunk-TSKSZVR2.mjs";
import "./chunk-TNXV45E5.mjs";
import "./chunk-SPQE7PSN.mjs";
import {
  NgComponentOutlet,
  computed,
  inject,
  input,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementContainer,
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
  ɵɵtextInterpolate
} from "./chunk-OYAKRC2F.mjs";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-X7LY3JHO.mjs";

// src/app/pages/person/person.ts
var PersonComponent = class _PersonComponent {
  embedded = input(false);
  servicio = inject(PersonService);
  columnas = [
    { clave: "id_persona", etiqueta: "ID" },
    { clave: "nombres", etiqueta: "Nombres" },
    { clave: "apellido_paterno", etiqueta: "Apellido paterno" },
    { clave: "apellido_materno", etiqueta: "Apellido materno" },
    { clave: "telefono", etiqueta: "Tel\xE9fono" },
    { clave: "direccion", etiqueta: "Direcci\xF3n" },
    { clave: "correo", etiqueta: "Correo" },
    { clave: "fecha_registro", etiqueta: "Fecha de registro", formato: "fecha" }
  ];
  static \u0275fac = function PersonComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PersonComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PersonComponent, selectors: [["app-person"]], inputs: { embedded: [1, "embedded"] }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 1, vars: 3, consts: [["titulo", "Gesti\xF3n de Personas", "descripcion", "Administraci\xF3n de las personas registradas en el sistema.", "clavePrimaria", "id_persona", 3, "columnas", "servicio", "embedded"]], template: function PersonComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "app-gestion-table", 0);
    }
    if (rf & 2) {
      \u0275\u0275property("columnas", ctx.columnas)("servicio", ctx.servicio)("embedded", ctx.embedded());
    }
  }, dependencies: [GestionTableComponent], styles: ['\n\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\nh2[_ngcontent-%COMP%] {\n  margin: 0 0 var(--espacio-4);\n  font-size: 1.25rem;\n}\n.encabezado[_ngcontent-%COMP%], \n.filtros[_ngcontent-%COMP%], \n.acciones[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: var(--espacio-3);\n}\n.encabezado[_ngcontent-%COMP%] {\n  flex-wrap: wrap;\n  justify-content: space-between;\n  margin-bottom: var(--espacio-5);\n}\n.descripcion[_ngcontent-%COMP%] {\n  margin: 0;\n  color: var(--neutro-500);\n}\n.filtros[_ngcontent-%COMP%] {\n  flex-wrap: wrap;\n  align-items: flex-end;\n  margin-bottom: var(--espacio-5);\n}\n.filtros[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%] {\n  flex: 1 1 18rem;\n  max-width: 32rem;\n  margin: 0;\n}\n.tabla-caja[_ngcontent-%COMP%] {\n  margin-top: var(--espacio-3);\n  max-width: 100%;\n  overflow-x: auto;\n  border: 1px solid var(--neutro-200);\n  border-radius: var(--radio-lg);\n}\n.table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], \n.table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: var(--espacio-3);\n  overflow-wrap: anywhere;\n  min-width: 7rem;\n}\n.persona-nombre[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n.resultados[_ngcontent-%COMP%] {\n  margin-top: var(--espacio-3);\n}\n.acciones[_ngcontent-%COMP%] {\n  gap: var(--espacio-2);\n}\n.estado[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: var(--espacio-5);\n}\n.estado[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n  margin: var(--espacio-2);\n}\n.formulario[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0 var(--espacio-4);\n  margin-top: var(--espacio-4);\n}\n.formulario[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.formulario[_ngcontent-%COMP%]   .error-text[_ngcontent-%COMP%] {\n  margin: 0;\n  color: var(--color-error);\n}\n.pie[_ngcontent-%COMP%] {\n  flex-wrap: wrap;\n  justify-content: flex-end;\n  margin-top: var(--espacio-3);\n}\n@media (max-width: 768px) {\n  .formulario[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .encabezado[_ngcontent-%COMP%]    > .btn[_ngcontent-%COMP%], \n   .filtros[_ngcontent-%COMP%]    > .btn[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n  .filtros[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%] {\n    max-width: none;\n  }\n  .table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], \n   .table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n    min-width: 0;\n    padding: 0;\n  }\n  .table[_ngcontent-%COMP%]   td[data-label][_ngcontent-%COMP%] {\n    display: flex;\n    flex-basis: 100%;\n    gap: var(--espacio-2);\n  }\n  .table[_ngcontent-%COMP%]   td[data-label][_ngcontent-%COMP%]::before {\n    content: attr(data-label) ":";\n    flex: none;\n    color: var(--neutro-500);\n  }\n  .acciones[_ngcontent-%COMP%] {\n    flex-wrap: wrap;\n  }\n}\n/*# sourceMappingURL=person.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PersonComponent, { className: "PersonComponent", filePath: "src\\app\\pages\\person\\person.ts", lineNumber: 5 });
})();

// src/app/pages/person-document/person-document.ts
var PersonDocumentComponent = class _PersonDocumentComponent {
  embedded = input(false);
  servicio = inject(PersonDocumentService);
  columnas = [
    { clave: "id_persona_documento", etiqueta: "ID" },
    { clave: "id_persona", etiqueta: "Persona" },
    { clave: "id_tipo_documento", etiqueta: "Tipo de documento" },
    { clave: "numero_documento", etiqueta: "N\xFAmero de documento" },
    { clave: "estado", etiqueta: "Estado" }
  ];
  static \u0275fac = function PersonDocumentComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PersonDocumentComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PersonDocumentComponent, selectors: [["app-person-document"]], inputs: { embedded: [1, "embedded"] }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 1, vars: 3, consts: [["titulo", "Documentos de personas", "descripcion", "Consulta los documentos asociados a las personas registradas.", "clavePrimaria", "id_persona_documento", 3, "columnas", "servicio", "embedded"]], template: function PersonDocumentComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "app-gestion-table", 0);
    }
    if (rf & 2) {
      \u0275\u0275property("columnas", ctx.columnas)("servicio", ctx.servicio)("embedded", ctx.embedded());
    }
  }, dependencies: [GestionTableComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\n/*# sourceMappingURL=person-document.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PersonDocumentComponent, { className: "PersonDocumentComponent", filePath: "src\\app\\pages\\person-document\\person-document.ts", lineNumber: 12 });
})();

// src/app/pages/person-intern/person-intern.ts
var PersonInternComponent = class _PersonInternComponent {
  embedded = input(false);
  servicio = inject(PersonInternService);
  columnas = [
    { clave: "id_persona_practicante", etiqueta: "ID" },
    { clave: "id_persona", etiqueta: "Persona" },
    { clave: "codigo", etiqueta: "C\xF3digo" },
    { clave: "estado", etiqueta: "Estado" }
  ];
  static \u0275fac = function PersonInternComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PersonInternComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PersonInternComponent, selectors: [["app-person-intern"]], inputs: { embedded: [1, "embedded"] }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 1, vars: 3, consts: [["titulo", "Practicantes", "descripcion", "Consulta las personas registradas como practicantes.", "clavePrimaria", "id_persona_practicante", 3, "columnas", "servicio", "embedded"]], template: function PersonInternComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "app-gestion-table", 0);
    }
    if (rf & 2) {
      \u0275\u0275property("columnas", ctx.columnas)("servicio", ctx.servicio)("embedded", ctx.embedded());
    }
  }, dependencies: [GestionTableComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\n/*# sourceMappingURL=person-intern.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PersonInternComponent, { className: "PersonInternComponent", filePath: "src\\app\\pages\\person-intern\\person-intern.ts", lineNumber: 12 });
})();

// src/app/pages/practice/practice.ts
var PracticeComponent = class _PracticeComponent {
  embedded = input(false);
  servicio = inject(PracticeService);
  columnas = [
    { clave: "id_practica", etiqueta: "ID" },
    { clave: "id_persona_practicante", etiqueta: "Practicante" },
    { clave: "id_institucion", etiqueta: "Instituci\xF3n" },
    { clave: "id_area", etiqueta: "\xC1rea" },
    { clave: "carrera", etiqueta: "Carrera" },
    { clave: "fecha_inicio", etiqueta: "Fecha de inicio", formato: "fecha" },
    { clave: "fecha_fin", etiqueta: "Fecha de fin", formato: "fecha" },
    { clave: "estado", etiqueta: "Estado" }
  ];
  static \u0275fac = function PracticeComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PracticeComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PracticeComponent, selectors: [["app-practice"]], inputs: { embedded: [1, "embedded"] }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 1, vars: 3, consts: [["titulo", "Pr\xE1cticas", "descripcion", "Consulta las pr\xE1cticas, sus periodos, instituciones y \xE1reas asignadas.", "clavePrimaria", "id_practica", 3, "columnas", "servicio", "embedded"]], template: function PracticeComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "app-gestion-table", 0);
    }
    if (rf & 2) {
      \u0275\u0275property("columnas", ctx.columnas)("servicio", ctx.servicio)("embedded", ctx.embedded());
    }
  }, dependencies: [GestionTableComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\n/*# sourceMappingURL=practice.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PracticeComponent, { className: "PracticeComponent", filePath: "src\\app\\pages\\practice\\practice.ts", lineNumber: 12 });
})();

// src/app/pages/practice-supervisor/practice-supervisor.ts
var PracticeSupervisorComponent = class _PracticeSupervisorComponent {
  embedded = input(false);
  servicio = inject(PracticeSupervisorService);
  columnas = [
    { clave: "id_practica_supervisor", etiqueta: "ID" },
    { clave: "id_practica", etiqueta: "Pr\xE1ctica" },
    { clave: "id_persona_trabajador", etiqueta: "Trabajador" },
    { clave: "tipo_supervision", etiqueta: "Tipo de supervisi\xF3n" },
    { clave: "fecha_inicio", etiqueta: "Fecha de inicio", formato: "fecha" },
    { clave: "fecha_fin", etiqueta: "Fecha de fin", formato: "fecha" },
    { clave: "estado", etiqueta: "Estado" }
  ];
  static \u0275fac = function PracticeSupervisorComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PracticeSupervisorComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PracticeSupervisorComponent, selectors: [["app-practice-supervisor"]], inputs: { embedded: [1, "embedded"] }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 1, vars: 3, consts: [["titulo", "Supervisores", "descripcion", "Consulta las asignaciones de supervisi\xF3n de las pr\xE1cticas.", "clavePrimaria", "id_practica_supervisor", 3, "columnas", "servicio", "embedded"]], template: function PracticeSupervisorComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "app-gestion-table", 0);
    }
    if (rf & 2) {
      \u0275\u0275property("columnas", ctx.columnas)("servicio", ctx.servicio)("embedded", ctx.embedded());
    }
  }, dependencies: [GestionTableComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\n/*# sourceMappingURL=practice-supervisor.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PracticeSupervisorComponent, { className: "PracticeSupervisorComponent", filePath: "src\\app\\pages\\practice-supervisor\\practice-supervisor.ts", lineNumber: 12 });
})();

// src/app/pages/area/area.ts
var AreaComponent = class _AreaComponent {
  embedded = input(false);
  servicio = inject(AreaService);
  columnas = [
    { clave: "id_area", etiqueta: "ID" },
    { clave: "nombre", etiqueta: "Nombre" }
  ];
  static \u0275fac = function AreaComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AreaComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AreaComponent, selectors: [["app-area"]], inputs: { embedded: [1, "embedded"] }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 1, vars: 3, consts: [["titulo", "\xC1reas", "descripcion", "Consulta las \xE1reas registradas de la municipalidad.", "clavePrimaria", "id_area", 3, "columnas", "servicio", "embedded"]], template: function AreaComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "app-gestion-table", 0);
    }
    if (rf & 2) {
      \u0275\u0275property("columnas", ctx.columnas)("servicio", ctx.servicio)("embedded", ctx.embedded());
    }
  }, dependencies: [GestionTableComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\n/*# sourceMappingURL=area.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AreaComponent, { className: "AreaComponent", filePath: "src\\app\\pages\\area\\area.ts", lineNumber: 12 });
})();

// src/app/pages/document-type/document-type.ts
var DocumentTypeComponent = class _DocumentTypeComponent {
  embedded = input(false);
  servicio = inject(DocumentTypeService);
  columnas = [
    { clave: "id_tipo_documento", etiqueta: "ID" },
    { clave: "nombre", etiqueta: "Nombre" },
    { clave: "estado", etiqueta: "Estado", formato: "booleano" }
  ];
  static \u0275fac = function DocumentTypeComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DocumentTypeComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DocumentTypeComponent, selectors: [["app-document-type"]], inputs: { embedded: [1, "embedded"] }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 1, vars: 3, consts: [["titulo", "Tipos de documento", "descripcion", "Consulta los tipos de documento y su estado.", "clavePrimaria", "id_tipo_documento", 3, "columnas", "servicio", "embedded"]], template: function DocumentTypeComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "app-gestion-table", 0);
    }
    if (rf & 2) {
      \u0275\u0275property("columnas", ctx.columnas)("servicio", ctx.servicio)("embedded", ctx.embedded());
    }
  }, dependencies: [GestionTableComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\n/*# sourceMappingURL=document-type.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DocumentTypeComponent, { className: "DocumentTypeComponent", filePath: "src\\app\\pages\\document-type\\document-type.ts", lineNumber: 12 });
})();

// src/app/pages/institution/institution.ts
var InstitutionComponent = class _InstitutionComponent {
  embedded = input(false);
  servicio = inject(InstitutionService);
  columnas = [
    { clave: "id_institucion", etiqueta: "ID" },
    { clave: "nombre_institucion", etiqueta: "Nombre de instituci\xF3n" },
    { clave: "pais", etiqueta: "Pa\xEDs" },
    { clave: "tipo", etiqueta: "Tipo" }
  ];
  static \u0275fac = function InstitutionComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _InstitutionComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _InstitutionComponent, selectors: [["app-institution"]], inputs: { embedded: [1, "embedded"] }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 1, vars: 3, consts: [["titulo", "Instituciones", "descripcion", "Consulta las instituciones registradas, su pa\xEDs y tipo.", "clavePrimaria", "id_institucion", 3, "columnas", "servicio", "embedded"]], template: function InstitutionComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "app-gestion-table", 0);
    }
    if (rf & 2) {
      \u0275\u0275property("columnas", ctx.columnas)("servicio", ctx.servicio)("embedded", ctx.embedded());
    }
  }, dependencies: [GestionTableComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\n/*# sourceMappingURL=institution.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(InstitutionComponent, { className: "InstitutionComponent", filePath: "src\\app\\pages\\institution\\institution.ts", lineNumber: 12 });
})();

// src/app/pages/emision-certificados/configuracion/tipos-certificado/tipos-certificado.component.ts
function TiposCertificadoComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-page-title", 0);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("title", ctx_r0.titulo());
  }
}
var TiposCertificadoComponent = class _TiposCertificadoComponent {
  embedded = input(false);
  recurso = input("tipos-certificado");
  titulo = computed(() => CONFIGURACION_EMISION[this.recurso()].titulo);
  static \u0275fac = function TiposCertificadoComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TiposCertificadoComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TiposCertificadoComponent, selectors: [["app-tipos-certificado"]], inputs: { embedded: [1, "embedded"], recurso: [1, "recurso"] }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 3, vars: 5, consts: [[3, "title"], [1, "card"], [3, "recurso", "tituloEncabezado", "formularioModal", "clasificacion"]], template: function TiposCertificadoComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275template(0, TiposCertificadoComponent_Conditional_0_Template, 1, 1, "app-page-title", 0);
      \u0275\u0275elementStart(1, "section", 1);
      \u0275\u0275element(2, "app-listado-emision", 2);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275conditional(!ctx.embedded() ? 0 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275property("recurso", ctx.recurso())("tituloEncabezado", ctx.titulo())("formularioModal", true)("clasificacion", true);
    }
  }, dependencies: [PageTitleComponent, ListadoEmisionComponent], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TiposCertificadoComponent, { className: "TiposCertificadoComponent", filePath: "src\\app\\pages\\emision-certificados\\configuracion\\tipos-certificado\\tipos-certificado.component.ts", lineNumber: 16 });
})();

// src/app/shared/components/gestion-tabs/gestion-tabs.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function GestionTabsComponent_For_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 4);
    \u0275\u0275listener("click", function GestionTabsComponent_For_4_Template_button_click_0_listener() {
      const opcion_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.seleccionar(opcion_r2.id));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const opcion_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("id", "gestion-tab-" + opcion_r2.id);
    \u0275\u0275attribute("aria-controls", "gestion-panel-" + opcion_r2.id)("aria-selected", ctx_r2.pestana() === opcion_r2.id)("tabindex", ctx_r2.pestana() === opcion_r2.id ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(opcion_r2.etiqueta);
  }
}
function GestionTabsComponent_For_6_Conditional_1_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function GestionTabsComponent_For_6_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, GestionTabsComponent_For_6_Conditional_1_ng_container_0_Template, 1, 0, "ng-container", 5);
  }
  if (rf & 2) {
    let tmp_12_0;
    const opcion_r4 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("ngComponentOutlet", opcion_r4.componente)("ngComponentOutletInputs", (tmp_12_0 = opcion_r4.entradas) !== null && tmp_12_0 !== void 0 ? tmp_12_0 : ctx_r2.entradas);
  }
}
function GestionTabsComponent_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3);
    \u0275\u0275template(1, GestionTabsComponent_For_6_Conditional_1_Template, 1, 2, "ng-container");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const opcion_r4 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("id", "gestion-panel-" + opcion_r4.id)("hidden", ctx_r2.pestana() !== opcion_r4.id);
    \u0275\u0275attribute("aria-labelledby", "gestion-tab-" + opcion_r4.id);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.pestana() === opcion_r4.id ? 1 : -1);
  }
}
var SECCIONES = {
  personas: { titulo: "Gesti\xF3n de Personas", pestanas: [
    { id: "personas", etiqueta: "Personas", componente: PersonComponent },
    { id: "documentos", etiqueta: "Documentos de personas", componente: PersonDocumentComponent }
  ] },
  practicas: { titulo: "Gesti\xF3n de Pr\xE1cticas", pestanas: [
    { id: "practicantes", etiqueta: "Practicantes", componente: PersonInternComponent },
    { id: "practicas", etiqueta: "Pr\xE1cticas", componente: PracticeComponent },
    { id: "supervisores", etiqueta: "Supervisores", componente: PracticeSupervisorComponent }
  ] },
  configuracion: { titulo: "Gesti\xF3n institucional", pestanas: [
    __spreadProps(__spreadValues({}, CATALOGOS_INSTITUCIONALES[0]), { componente: AreaComponent }),
    __spreadProps(__spreadValues({}, CATALOGOS_INSTITUCIONALES[1]), { componente: DocumentTypeComponent }),
    __spreadProps(__spreadValues({}, CATALOGOS_INSTITUCIONALES[2]), { componente: InstitutionComponent })
  ] },
  clasificaciones: { titulo: "Tipos y clasificaciones", pestanas: CATALOGOS_CLASIFICACIONES.map((catalogo, indice) => __spreadProps(__spreadValues({}, catalogo), {
    componente: TiposCertificadoComponent,
    entradas: { embedded: true, recurso: ["ativicty-type", "participation-type", "tipos-certificado"][indice] }
  })) }
};
var GestionTabsComponent = class _GestionTabsComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  parametros = toSignal(this.route.queryParamMap, { initialValue: this.route.snapshot.queryParamMap });
  seccion = SECCIONES[this.route.snapshot.data["seccion"]];
  entradas = { embedded: true };
  pestana = computed(() => this.seccion.pestanas.find((opcion) => opcion.id === this.parametros().get("pestana"))?.id ?? this.seccion.pestanas[0].id);
  seleccionar(id) {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { pestana: id === this.seccion.pestanas[0].id ? null : id },
      queryParamsHandling: "merge",
      replaceUrl: true
    });
  }
  alTeclear(evento) {
    const opciones = this.seccion.pestanas;
    const actual = opciones.findIndex((opcion) => opcion.id === this.pestana());
    const destino = {
      ArrowRight: (actual + 1) % opciones.length,
      ArrowLeft: (actual - 1 + opciones.length) % opciones.length,
      Home: 0,
      End: opciones.length - 1
    }[evento.key];
    if (destino === void 0)
      return;
    evento.preventDefault();
    const id = opciones[destino].id;
    this.seleccionar(id);
    evento.currentTarget.querySelector(`#gestion-tab-${id}`)?.focus();
  }
  static \u0275fac = function GestionTabsComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _GestionTabsComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _GestionTabsComponent, selectors: [["app-gestion-tabs"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 7, vars: 3, consts: [[3, "title"], ["role", "tablist", 1, "pestanas", 3, "keydown"], ["type", "button", "role", "tab", 3, "id"], ["role", "tabpanel", "tabindex", "0", 3, "id", "hidden"], ["type", "button", "role", "tab", 3, "click", "id"], [4, "ngComponentOutlet", "ngComponentOutletInputs"]], template: function GestionTabsComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section");
      \u0275\u0275element(1, "app-page-title", 0);
      \u0275\u0275elementStart(2, "div", 1);
      \u0275\u0275listener("keydown", function GestionTabsComponent_Template_div_keydown_2_listener($event) {
        return ctx.alTeclear($event);
      });
      \u0275\u0275repeaterCreate(3, GestionTabsComponent_For_4_Template, 2, 5, "button", 2, _forTrack0);
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(5, GestionTabsComponent_For_6_Template, 2, 4, "div", 3, _forTrack0);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275attribute("aria-label", ctx.seccion.titulo);
      \u0275\u0275advance();
      \u0275\u0275property("title", ctx.seccion.titulo);
      \u0275\u0275advance();
      \u0275\u0275attribute("aria-label", ctx.seccion.titulo);
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.seccion.pestanas);
      \u0275\u0275advance(2);
      \u0275\u0275repeater(ctx.seccion.pestanas);
    }
  }, dependencies: [NgComponentOutlet, PageTitleComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\n.pestanas[_ngcontent-%COMP%] {\n  max-width: 100%;\n  overflow-x: auto;\n}\n[role=tab][_ngcontent-%COMP%] {\n  flex-shrink: 0;\n}\n/*# sourceMappingURL=gestion-tabs.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(GestionTabsComponent, { className: "GestionTabsComponent", filePath: "src\\app\\shared\\components\\gestion-tabs\\gestion-tabs.component.ts", lineNumber: 48 });
})();
export {
  GestionTabsComponent
};
//# sourceMappingURL=chunk-GGY655YE.mjs.map
