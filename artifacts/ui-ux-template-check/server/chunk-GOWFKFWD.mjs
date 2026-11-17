import './polyfills.server.mjs';
import {
  aErrorApi
} from "./chunk-JMI3IFFT.mjs";
import {
  AUTHENTICATED_REQUEST,
  environment
} from "./chunk-HFD7K63G.mjs";
import {
  HttpClient,
  HttpContext
} from "./chunk-TNXV45E5.mjs";
import {
  catchError,
  inject,
  map,
  throwError,
  timeout,
  ɵɵdefineInjectable
} from "./chunk-OYAKRC2F.mjs";

// src/app/core/services/emision-certificados/firmantes-municipales.service.ts
var FirmantesMunicipalesService = class _FirmantesMunicipalesService {
  http = inject(HttpClient);
  url = environment.apiBaseUrl.replace(/\/$/, "") + "/funcionarios-firmantes/trabajadores";
  base = environment.apiBaseUrl.replace(/\/$/, "") + "/funcionarios-firmantes";
  privado = { withCredentials: true, context: new HttpContext().set(AUTHENTICATED_REQUEST, true) };
  habilitar(id) {
    return this.confirmar(this.http.post(this.base + "/habilitar", { id_persona_trabajador: id }, this.privado), id, true);
  }
  deshabilitar(id) {
    return this.confirmar(this.http.delete(`${this.base}/${id}/habilitacion`, this.privado), id, false);
  }
  confirmar(operacion, id, habilitado) {
    return operacion.pipe(timeout(3e4), map((r) => {
      const d = r.data;
      if (!r.success || d?.completada !== true || d.persistido !== true || !this.valido(d.funcionario) || d.funcionario.id_persona_trabajador !== id || d.funcionario.habilitado_firma_certificados !== habilitado) {
        throw new Error("No se confirm\xF3 la habilitaci\xF3n solicitada.");
      }
      return d.funcionario;
    }), catchError((e) => throwError(() => aErrorApi(e))));
  }
  valido(t) {
    return !!t && Number.isSafeInteger(t.id_persona_trabajador) && t.id_persona_trabajador > 0 && typeof t.nombre === "string" && typeof t.vigente === "boolean" && typeof t.habilitado_firma_certificados === "boolean" && typeof t.elegible_laboralmente === "boolean";
  }
  cargar() {
    return this.http.get(this.url, {
      withCredentials: true,
      context: new HttpContext().set(AUTHENTICATED_REQUEST, true),
      headers: { "Cache-Control": "no-cache, no-store, max-age=0", Pragma: "no-cache" }
    }).pipe(timeout(3e4), map((r) => {
      if (!r.success || !Array.isArray(r.data?.funcionarios))
        throw new Error("Consulta incompleta.");
      const trabajadores = r.data.funcionarios;
      if (trabajadores.some((t) => !this.valido(t)))
        throw new Error("Datos laborales incompletos.");
      return trabajadores;
    }), catchError((e) => throwError(() => aErrorApi(e))));
  }
  static \u0275fac = function FirmantesMunicipalesService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FirmantesMunicipalesService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _FirmantesMunicipalesService, factory: _FirmantesMunicipalesService.\u0275fac, providedIn: "root" });
};

export {
  FirmantesMunicipalesService
};
//# sourceMappingURL=chunk-GOWFKFWD.mjs.map
