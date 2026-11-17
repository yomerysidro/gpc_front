import './polyfills.server.mjs';
import {
  pdfConfirmado
} from "./chunk-7CXPU5UM.mjs";
import {
  FirmantesMunicipalesService
} from "./chunk-GOWFKFWD.mjs";
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
  ɵɵdefineInjectable
} from "./chunk-OYAKRC2F.mjs";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-X7LY3JHO.mjs";

// src/app/core/services/emision-certificados/firma-documental.service.ts
var FirmaDocumentalService = class _FirmaDocumentalService {
  http = inject(HttpClient);
  municipales = inject(FirmantesMunicipalesService);
  base = environment.apiBaseUrl.replace(/\/$/, "") + "/certificados-documentos";
  privado = { withCredentials: true, context: new HttpContext().set(AUTHENTICATED_REQUEST, true) };
  progreso(id) {
    return this.consultar(`${id}/firma/progreso`).pipe(map((d) => {
      if (d.documento?.id_certificado_documento !== id)
        throw new Error("La respuesta corresponde a otro documento.");
      return d;
    }));
  }
  trabajadores() {
    return this.municipales.cargar();
  }
  disponibles(id) {
    return this.consultar(id + "/firma/firmantes-disponibles").pipe(map((trabajadores) => trabajadores.filter((t) => t.vigente === true && t.habilitado_firma_certificados === true && t.disponible_asignacion === true)));
  }
  asignados(id) {
    return this.consultar(id + "/firma/firmantes-asignados");
  }
  asignar(id, modalidad, firmantes) {
    return this.enviar(id + "/firma/asignar", { modalidad, firmantes, confirmar: true }).pipe(map((d) => {
      if (d.persistido !== true || d.completada !== true)
        throw new Error("Laravel no confirm\xF3 el guardado de responsables.");
      const asignados = Array.isArray(d.firmantes_asignados) ? [...d.firmantes_asignados].sort((a, b) => a.orden_firma - b.orden_firma).map((f) => ({ id_persona_trabajador: f.id_persona_trabajador, orden_firma: f.orden_firma })) : null;
      if (d.documento?.id_certificado_documento !== id || d.asignacion_documental_persistida !== true || d.modalidad !== modalidad || JSON.stringify(asignados) !== JSON.stringify(firmantes)) {
        throw new Error("La asignaci\xF3n devuelta por Laravel no acredita el documento y el plan solicitados. Se consultar\xE1 su progreso antes de reintentar.");
      }
      return d;
    }));
  }
  revisarPdf(id, plan) {
    const body = plan ? { modalidad: plan.modalidad, firmantes: plan.firmantes.map((f) => ({
      id_persona_trabajador: f.id_persona_trabajador,
      orden_firma: f.orden_firma
    })) } : {};
    return this.enviar(id + "/firma/revision-pdf", body).pipe(map((r) => {
      if (r.id_certificado_documento !== id)
        throw new Error("La vista previa corresponde a otro documento.");
      if (plan && (r.modalidad !== body.modalidad || JSON.stringify(r.firmantes?.map((f) => ({ id_persona_trabajador: f.id_persona_trabajador, orden_firma: f.orden_firma }))) !== JSON.stringify(body.firmantes))) {
        throw new Error("La vista previa no corresponde al plan solicitado.");
      }
      return r;
    }));
  }
  descartarPdf(id, token_revision) {
    return this.respuesta(this.http.delete(this.base + "/" + id + "/firma/revision-pdf", __spreadProps(__spreadValues({}, this.privado), { body: { token_revision } })));
  }
  confirmarPdf(id, token_revision) {
    return this.enviar(id + "/firma/confirmar-pdf", { token_revision, confirmar: true }).pipe(map((d) => {
      if (d.completada !== true || d.persistido !== true || !pdfConfirmado(d) || !d.revision_pdf || !/^[a-f0-9]{64}$/.test(d.hash_pdf) || d.documento?.hash_pdf !== d.hash_pdf) {
        throw new Error("Laravel no confirm\xF3 que el PDF revisado est\xE9 vigente. La asignaci\xF3n puede haber quedado guardada.");
      }
      if (d.id_certificado_documento !== id || d.documento?.id_certificado_documento !== id || d.id_certificado !== d.documento.id_certificado || d.codigo_verificacion !== d.documento.codigo_verificacion) {
        throw new Error("La confirmaci\xF3n PDF corresponde a otro documento, certificado o c\xF3digo.");
      }
      return d;
    }));
  }
  responsables(id) {
    return this.consultar(`${id}/firma/firmantes-disponibles`);
  }
  verificacion(id) {
    return this.consultar(`${id}/firma/verificacion`).pipe(map((d) => {
      if (d.id_certificado_documento !== id)
        throw new Error("La verificaci\xF3n corresponde a otro documento.");
      return d;
    }));
  }
  demo(id) {
    return this.consultar(`${id}/firma/demo/progreso`).pipe(map((d) => this.validarDemo(id, d)));
  }
  asignarDemo(id, body) {
    return this.enviar(`${id}/firma/demo/asignar`, body).pipe(map((d) => this.validarDemo(id, d)));
  }
  simularDemo(id, body) {
    return this.enviar(`${id}/firma/demo/simular`, body).pipe(map((d) => this.validarDemo(id, d)));
  }
  lote(ids) {
    return this.enviar("firmas/lote/progreso", { ids_documentos: ids }).pipe(map((d) => {
      if (!Array.isArray(d.resultados) || d.resultados.length !== ids.length || d.resultados.some((r, i) => r.id_certificado_documento !== ids[i]))
        throw new Error("El lote recibido no corresponde a los documentos seleccionados.");
      return d;
    }));
  }
  validarDemo(id, d) {
    if (d.modo !== "DEMO" || d.id_certificado_documento !== id || d.estado_real !== "PENDIENTE_FIRMA" || d.firma_verificada !== false || d.emitido !== false || d.entregado !== false || d.fecha_emision !== null || d.asignacion_real_persistida !== false)
      throw new Error("Laravel no confirm\xF3 una demostraci\xF3n sin efectos oficiales.");
    return d;
  }
  consultar(ruta) {
    return this.respuesta(this.http.get(`${this.base}/${ruta}`, __spreadProps(__spreadValues({}, this.privado), {
      headers: { "Cache-Control": "no-cache, no-store, max-age=0", Pragma: "no-cache" }
    })));
  }
  enviar(ruta, body) {
    return this.respuesta(this.http.post(`${this.base}/${ruta}`, body, this.privado));
  }
  respuesta(consulta) {
    return consulta.pipe(map((r) => {
      if (!r.success || r.data == null)
        throw new Error("Laravel no confirm\xF3 la operaci\xF3n.");
      return r.data;
    }), catchError((e) => throwError(() => e instanceof Error && !("status" in e) ? { status: 502, mensaje: e.message, errores: {} } : aErrorApi(e))));
  }
  static \u0275fac = function FirmaDocumentalService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FirmaDocumentalService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _FirmaDocumentalService, factory: _FirmaDocumentalService.\u0275fac, providedIn: "root" });
};

export {
  FirmaDocumentalService
};
//# sourceMappingURL=chunk-3UCYPJKG.mjs.map
