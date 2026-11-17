import {
  GestionTableComponent
} from "./chunk-NWO7GZLY.js";
import "./chunk-WQAUTSZQ.js";
import {
  PersonWorkerService
} from "./chunk-RJ22SAW5.js";
import "./chunk-Y2YHKMWP.js";
import "./chunk-4VYBOJPK.js";
import "./chunk-YHURBVQM.js";
import "./chunk-W2463ZNS.js";
import "./chunk-C4J44J4Z.js";
import "./chunk-7PBBQCKX.js";
import "./chunk-IJ23LC2U.js";
import "./chunk-YLHEVWGL.js";
import {
  inject,
  input,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵproperty
} from "./chunk-3ZDGBTDF.js";
import "./chunk-ZX6IUAQ5.js";

// src/app/pages/person-worker/person-worker.ts
var PersonWorkerComponent = class _PersonWorkerComponent {
  embedded = input(false);
  servicio = inject(PersonWorkerService);
  columnas = [
    { clave: "id_persona_trabajador", etiqueta: "ID" },
    { clave: "id_persona", etiqueta: "Persona" },
    { clave: "id_area", etiqueta: "\xC1rea" },
    { clave: "cargo", etiqueta: "Cargo" },
    { clave: "fecha_ingreso", etiqueta: "Fecha de ingreso", formato: "fecha" },
    { clave: "fecha_fin", etiqueta: "Fecha de fin", formato: "fecha" },
    { clave: "estado", etiqueta: "Estado", formato: "booleano" }
  ];
  static \u0275fac = function PersonWorkerComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PersonWorkerComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PersonWorkerComponent, selectors: [["app-person-worker"]], inputs: { embedded: [1, "embedded"] }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 1, vars: 3, consts: [["titulo", "Gesti\xF3n de Trabajadores", "descripcion", "Consulta los trabajadores y sus asignaciones a las \xE1reas de la municipalidad.", "clavePrimaria", "id_persona_trabajador", 3, "columnas", "servicio", "embedded"]], template: function PersonWorkerComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "app-gestion-table", 0);
    }
    if (rf & 2) {
      \u0275\u0275property("columnas", ctx.columnas)("servicio", ctx.servicio)("embedded", ctx.embedded());
    }
  }, dependencies: [GestionTableComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\n/*# sourceMappingURL=person-worker.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PersonWorkerComponent, { className: "PersonWorkerComponent", filePath: "src\\app\\pages\\person-worker\\person-worker.ts", lineNumber: 12 });
})();
export {
  PersonWorkerComponent
};
//# sourceMappingURL=chunk-SXC772NG.js.map
