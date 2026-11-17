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

// src/app/core/services/practice/practice.service.ts
var PracticeService = class _PracticeService {
  http = inject(HttpClient);
  url = `${environment.apiBaseUrl}/practices`;
  evaluaciones() {
    return this.http.get(`${this.url}/evaluacion-certificacion`, this.opciones()).pipe(map((r) => {
      if (!r.success || !Array.isArray(r.data?.practicas))
        throw new Error("No se pudo consultar las pr\xE1cticas.");
      return r.data.practicas;
    }));
  }
  evaluar(id) {
    return this.http.get(`${this.url}/${id}/evaluacion-certificacion`, this.opciones()).pipe(map((r) => {
      if (!r.success || r.data?.id_origen !== id)
        throw new Error("No se pudo confirmar la pr\xE1ctica.");
      return r.data;
    }));
  }
  finalizar(id) {
    return this.http.post(`${this.url}/${id}/finalizar`, {}, this.opciones()).pipe(map((r) => {
      if (!r.success || r.data?.practica_finalizada !== true || !r.data.finalizacion_registrada || r.data.id_origen !== id)
        throw new Error("El servidor no confirm\xF3 la finalizaci\xF3n.");
      return r.data;
    }));
  }
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
  static \u0275fac = function PracticeService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PracticeService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _PracticeService, factory: _PracticeService.\u0275fac, providedIn: "root" });
};

export {
  PracticeService
};
//# sourceMappingURL=chunk-SBB4NALW.mjs.map
