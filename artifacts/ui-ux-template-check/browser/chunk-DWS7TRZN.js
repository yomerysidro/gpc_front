import {
  EmisionCertificadosService
} from "./chunk-4FUGVTHD.js";
import {
  AUTHENTICATED_REQUEST,
  environment
} from "./chunk-7PBBQCKX.js";
import {
  HttpClient,
  HttpContext,
  HttpParams
} from "./chunk-IJ23LC2U.js";
import {
  inject,
  map,
  ɵɵdefineInjectable
} from "./chunk-3ZDGBTDF.js";

// src/app/core/services/reportes/reportes.service.ts
var ReportesService = class _ReportesService {
  http = inject(HttpClient);
  // Reutiliza environment.apiBaseUrl y AUTHENTICATED_REQUEST del servicio existente.
  emision = inject(EmisionCertificadosService);
  actividades(page, filtros, perPage = 20) {
    let params = new HttpParams().set("page", page).set("per_page", perPage);
    for (const [clave, valor] of Object.entries(filtros)) {
      if (valor !== "")
        params = params.set(clave, valor);
    }
    return this.http.get(`${environment.apiBaseUrl}/reportes/actividades`, {
      params,
      context: new HttpContext().set(AUTHENTICATED_REQUEST, true)
    }).pipe(map((respuesta) => {
      const pagina = respuesta.data;
      if (!respuesta.success || !pagina || !Array.isArray(pagina.data) || !Number.isSafeInteger(pagina.total) || pagina.total < 0 || !Number.isInteger(pagina.current_page) || pagina.current_page < 1 || !Number.isInteger(pagina.last_page) || pagina.last_page < 1 || !Number.isInteger(pagina.per_page) || pagina.per_page < 1 || pagina.per_page > 100 || pagina.data.length > pagina.per_page || pagina.criterio_fecha !== "fecha_inicio" || !pagina.filtros) {
        throw new Error("El servidor devolvi\xF3 un formato de reporte de actividades no v\xE1lido.");
      }
      return pagina;
    }));
  }
  totalRegistrados(indicador) {
    return this.http.get(`${environment.apiBaseUrl}/reportes/indicadores/${indicador}`, { context: new HttpContext().set(AUTHENTICATED_REQUEST, true) }).pipe(map((respuesta) => {
      const data = respuesta.data;
      if (!respuesta.success || data?.indicador !== indicador || !Number.isSafeInteger(data.total) || data.total < 0 || !Array.isArray(data.filtros) || data.filtros.length !== 0) {
        throw new Error("El servidor devolvi\xF3 un conteo no v\xE1lido. Intenta actualizar.");
      }
      return data.total;
    }));
  }
  certificados(page, estado = "", tipo = "") {
    return this.pagina("certificados", { page, per_page: 20, estado, id_tipo_certificado: tipo });
  }
  tipos(page = 1) {
    return this.pagina("tipos-certificado", { page, per_page: 20 });
  }
  totalCertificados() {
    return this.pagina("certificados", { per_page: 1 }).pipe(map((pagina) => pagina.total));
  }
  totalDocumentos(estado) {
    return this.pagina("certificados-documentos", { per_page: 1, estado }).pipe(map((pagina) => pagina.total));
  }
  pagina(recurso, filtros) {
    return this.emision.listar(recurso, filtros).pipe(map((pagina) => {
      if (!pagina || !Array.isArray(pagina.data) || !Number.isInteger(pagina.total) || pagina.total < 0 || !Number.isInteger(pagina.current_page) || pagina.current_page < 1 || !Number.isInteger(pagina.last_page) || pagina.last_page < 1 || !Number.isInteger(pagina.per_page) || pagina.per_page < 1 || pagina.per_page > 100) {
        throw new Error("El servidor devolvi\xF3 un formato de reporte no v\xE1lido.");
      }
      return pagina;
    }));
  }
  static \u0275fac = function ReportesService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ReportesService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ReportesService, factory: _ReportesService.\u0275fac, providedIn: "root" });
};

export {
  ReportesService
};
//# sourceMappingURL=chunk-DWS7TRZN.js.map
