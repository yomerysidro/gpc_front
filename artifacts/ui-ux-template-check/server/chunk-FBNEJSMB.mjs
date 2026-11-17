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

// src/app/core/services/person-speaker/person-speaker.service.ts
var PersonSpeakerService = class _PersonSpeakerService {
  http = inject(HttpClient);
  url = `${environment.apiBaseUrl}/person-speakers`;
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
  static \u0275fac = function PersonSpeakerService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PersonSpeakerService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _PersonSpeakerService, factory: _PersonSpeakerService.\u0275fac, providedIn: "root" });
};

export {
  PersonSpeakerService
};
//# sourceMappingURL=chunk-FBNEJSMB.mjs.map
