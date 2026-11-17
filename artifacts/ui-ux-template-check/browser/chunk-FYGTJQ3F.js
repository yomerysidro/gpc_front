import {
  GestionTableComponent
} from "./chunk-NWO7GZLY.js";
import "./chunk-WQAUTSZQ.js";
import "./chunk-RJ22SAW5.js";
import "./chunk-Y2YHKMWP.js";
import {
  PersonSpeakerService
} from "./chunk-4VYBOJPK.js";
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

// src/app/pages/person-speaker/person-speaker.ts
var PersonSpeakerComponent = class _PersonSpeakerComponent {
  embedded = input(false);
  servicio = inject(PersonSpeakerService);
  columnas = [
    { clave: "id_persona_ponente", etiqueta: "ID" },
    { clave: "id_persona", etiqueta: "Persona" },
    { clave: "id_institucion", etiqueta: "Instituci\xF3n" },
    { clave: "cargo", etiqueta: "Cargo" },
    { clave: "especialidad", etiqueta: "Especialidad" }
  ];
  static \u0275fac = function PersonSpeakerComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PersonSpeakerComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PersonSpeakerComponent, selectors: [["app-person-speaker"]], inputs: { embedded: [1, "embedded"] }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 1, vars: 3, consts: [["titulo", "Gesti\xF3n de Ponentes", "descripcion", "Consulta los ponentes, sus cargos, especialidades e instituciones.", "clavePrimaria", "id_persona_ponente", 3, "columnas", "servicio", "embedded"]], template: function PersonSpeakerComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "app-gestion-table", 0);
    }
    if (rf & 2) {
      \u0275\u0275property("columnas", ctx.columnas)("servicio", ctx.servicio)("embedded", ctx.embedded());
    }
  }, dependencies: [GestionTableComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\n/*# sourceMappingURL=person-speaker.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PersonSpeakerComponent, { className: "PersonSpeakerComponent", filePath: "src\\app\\pages\\person-speaker\\person-speaker.ts", lineNumber: 12 });
})();
export {
  PersonSpeakerComponent
};
//# sourceMappingURL=chunk-FYGTJQ3F.js.map
