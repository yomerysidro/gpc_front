import './polyfills.server.mjs';
import {
  Subject,
  ɵɵdefineInjectable
} from "./chunk-OYAKRC2F.mjs";

// src/app/core/services/emision-certificados/cambios-certificados.service.ts
var CambiosCertificadosService = class _CambiosCertificadosService {
  cambios = new Subject();
  cambios$ = this.cambios.asObservable();
  confirmar() {
    this.cambios.next();
  }
  static \u0275fac = function CambiosCertificadosService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CambiosCertificadosService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _CambiosCertificadosService, factory: _CambiosCertificadosService.\u0275fac, providedIn: "root" });
};

export {
  CambiosCertificadosService
};
//# sourceMappingURL=chunk-ZIVCKBVU.mjs.map
