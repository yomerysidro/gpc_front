import {
  AUTHENTICATED_REQUEST,
  environment
} from "./chunk-7PBBQCKX.js";
import {
  HttpClient,
  HttpContext
} from "./chunk-IJ23LC2U.js";
import {
  inject,
  map,
  ɵɵdefineInjectable
} from "./chunk-3ZDGBTDF.js";

// src/app/core/services/person-worker/person-worker.service.ts
var PersonWorkerService = class _PersonWorkerService {
  http = inject(HttpClient);
  url = `${environment.apiBaseUrl}/person-workers`;
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
  static \u0275fac = function PersonWorkerService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PersonWorkerService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _PersonWorkerService, factory: _PersonWorkerService.\u0275fac, providedIn: "root" });
};

// src/app/core/services/area/area.service.ts
var AreaService = class _AreaService {
  http = inject(HttpClient);
  url = `${environment.apiBaseUrl}/areas`;
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
  static \u0275fac = function AreaService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AreaService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AreaService, factory: _AreaService.\u0275fac, providedIn: "root" });
};

// src/app/core/services/person-document/person-document.service.ts
var PersonDocumentService = class _PersonDocumentService {
  http = inject(HttpClient);
  url = `${environment.apiBaseUrl}/person-documents`;
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
  static \u0275fac = function PersonDocumentService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PersonDocumentService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _PersonDocumentService, factory: _PersonDocumentService.\u0275fac, providedIn: "root" });
};

// src/app/core/services/document-type/document-type.service.ts
var DocumentTypeService = class _DocumentTypeService {
  http = inject(HttpClient);
  url = `${environment.apiBaseUrl}/document-types`;
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
  static \u0275fac = function DocumentTypeService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DocumentTypeService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _DocumentTypeService, factory: _DocumentTypeService.\u0275fac, providedIn: "root" });
};

export {
  PersonWorkerService,
  AreaService,
  PersonDocumentService,
  DocumentTypeService
};
//# sourceMappingURL=chunk-RJ22SAW5.js.map
