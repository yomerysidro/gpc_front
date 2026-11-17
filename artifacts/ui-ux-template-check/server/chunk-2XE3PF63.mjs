import './polyfills.server.mjs';
import {
  AUTHENTICATED_REQUEST,
  environment
} from "./chunk-HFD7K63G.mjs";
import {
  HttpClient,
  HttpContext
} from "./chunk-TNXV45E5.mjs";
import {
  inject,
  map,
  ɵɵdefineInjectable
} from "./chunk-OYAKRC2F.mjs";

// src/app/core/services/person/person.service.ts
var PersonService = class _PersonService {
  http = inject(HttpClient);
  url = `${environment.apiBaseUrl}/persons`;
  listar() {
    return this.http.get(`${this.url}/list`, this.opciones()).pipe(map((respuesta) => {
      const registros = this.datos(respuesta);
      if (!Array.isArray(registros))
        throw new Error("Respuesta de listado invalida.");
      return registros;
    }));
  }
  obtener(id) {
    return this.http.get(`${this.url}/detail/${id}`, this.opciones()).pipe(map((respuesta) => {
      const registro = this.datos(respuesta);
      if (!registro || typeof registro !== "object" || Array.isArray(registro))
        throw new Error("Respuesta de detalle inv\xE1lida.");
      return registro;
    }));
  }
  datos(respuesta) {
    if (!respuesta.success)
      throw new Error(respuesta.message || "No se pudo consultar Personas.");
    return respuesta.data;
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
  static \u0275fac = function PersonService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PersonService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _PersonService, factory: _PersonService.\u0275fac, providedIn: "root" });
};

export {
  PersonService
};
//# sourceMappingURL=chunk-2XE3PF63.mjs.map
