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
  HttpContext,
  HttpErrorResponse
} from "./chunk-TNXV45E5.mjs";
import {
  TimeoutError,
  catchError,
  defer,
  finalize,
  from,
  inject,
  map,
  of,
  shareReplay,
  switchMap,
  throwError,
  timeout,
  ɵɵdefineInjectable
} from "./chunk-OYAKRC2F.mjs";
import {
  __async,
  __objRest,
  __spreadProps,
  __spreadValues
} from "./chunk-X7LY3JHO.mjs";

// src/app/core/services/emision-certificados/vista-previa-pdf.ts
var MAX_PDF_PREVIA = 10 * 1024 * 1024;
function validarMensajeCertificado(control) {
  const texto = control.value ?? "";
  if (!texto.replace(/^[ \n\r\t\v\0]+|[ \n\r\t\v\0]+$/g, ""))
    return { mensaje: true };
  if (Array.from(texto).length > 1200)
    return { longitudUnicode: true };
  return /<[^>]*>|[\x00-\x08\x0B\x0C\x0E-\x1F\x7F\u202A-\u202E\u2066-\u2069]/u.test(texto) ? { textoPlano: true } : null;
}
function decodificarVistaPrevia(pdf, persistido = false) {
  const base64 = pdf?.contenido_base64;
  if (pdf?.tipo_contenido !== "application/pdf" || pdf.persistido !== persistido || typeof base64 !== "string" || !base64.length || base64.length > 4 * Math.ceil(MAX_PDF_PREVIA / 3) || base64.length % 4 !== 0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(base64))
    throw new Error("La respuesta no contiene una vista previa PDF v\xE1lida.");
  const binario = atob(base64);
  if (btoa(binario) !== base64 || binario.length > MAX_PDF_PREVIA || !binario.startsWith("%PDF-") || !binario.trimEnd().endsWith("%%EOF"))
    throw new Error("El PDF de vista previa est\xE1 vac\xEDo, corrupto o excede el tama\xF1o permitido.");
  const bytes = Uint8Array.from(binario, (c) => c.charCodeAt(0));
  const nombre = typeof pdf.nombre_archivo === "string" && /^[\w. -]+\.pdf$/i.test(pdf.nombre_archivo) ? pdf.nombre_archivo : "vista-previa-certificado.pdf";
  return { blob: new Blob([bytes], { type: "application/pdf" }), nombre };
}

// src/app/core/services/emision-certificados/documentos-digitales.service.ts
function mensajeEtapaA(error) {
  const detalles = [error.mensaje, ...Object.values(error.errores ?? {}).flat()].join(" ");
  if (error.status >= 500 || /SQLSTATE|postgres|PDOException|select .* from|insert into/i.test(detalles))
    return "No se pudo completar la operaci\xF3n. Intente nuevamente.";
  if (error.status === 403)
    return "No tiene permisos para realizar esta acci\xF3n.";
  if (error.status === 409 && /caduc|venc|expir/i.test(error.mensaje))
    return "La revisi\xF3n venci\xF3. Revise nuevamente el documento.";
  return mensajeDocumento(error);
}
function mensajeDocumento(error) {
  const estados = {
    0: "Backend temporalmente inaccesible.",
    401: "Sesi\xF3n de usuario no autenticada.",
    403: "Acci\xF3n no autorizada.",
    404: "Documento o c\xF3digo no encontrado.",
    409: "Operaci\xF3n en conflicto o bloqueada.",
    422: "Validaci\xF3n incorrecta.",
    429: "Demasiadas consultas. Intenta nuevamente."
  };
  if (error.status === 408)
    return "No se pudo confirmar el resultado. Actualiza el estado antes de reintentar";
  return estados[error.status] ?? "No se pudo completar la operaci\xF3n. Actualiza el estado antes de reintentar";
}
var DocumentosDigitalesService = class _DocumentosDigitalesService {
  lecturasSesion = /* @__PURE__ */ new Map();
  /** Lectura puntual sin PDF ni operaciones documentales. */
  consultarReconocimientoSesion(id, sesion) {
    const clave = `${id}:${sesion}`;
    const pendiente = this.lecturasSesion.get(clave);
    if (pendiente)
      return pendiente;
    const consulta = this.http.get(`${this.api}/certificaciones/ponente_sesion/${id}/preparar`, __spreadProps(__spreadValues({}, this.privado), {
      headers: this.sinCache,
      params: { accion: "consultar_preparacion", modalidad_reconocimiento: "sesion", id_sesion: sesion }
    })).pipe(timeout(3e4), map((r) => {
      const d = this.datos(r);
      const documento = "id_certificado_documento" in d;
      if (documento ? d.recuperado !== true || d.persistido !== true || d.id_actividad_ponente !== id || d.id_sesion !== sesion : d.recuperado !== false || d.persistido !== false || d.origen !== "ponente_sesion" || d.modalidad_reconocimiento !== "sesion" || d.id_origen !== id || d.id_sesion !== sesion) {
        throw { status: 409, mensaje: "Contexto incompatible con el reconocimiento de la sesi\xF3n.", errores: {} };
      }
      return d;
    }), catchError((error) => this.error(error)), finalize(() => this.lecturasSesion.delete(clave)), shareReplay({ bufferSize: 1, refCount: true }));
    this.lecturasSesion.set(clave, consulta);
    return consulta;
  }
  consultarPractica(id) {
    return this.http.get(this.api + "/certificaciones/practica/" + id + "/preparar", __spreadProps(__spreadValues({}, this.privado), { headers: this.sinCache, params: { accion: "consultar_preparacion" } })).pipe(timeout(3e4), map((r) => {
      const d = this.datos(r);
      if (d.origen !== "practica" || ("id_origen" in d ? d.id_origen !== id : d.id_practica !== id))
        throw new Error("La preparaci\xF3n no corresponde a la pr\xE1ctica.");
      return d;
    }), catchError((e) => this.error(e)));
  }
  consultasSesion = /* @__PURE__ */ new Map();
  consultarReconocimiento(id) {
    return this.http.get(`${this.api}/certificaciones/reconocimiento/${id}/preparar`, __spreadProps(__spreadValues({}, this.privado), { headers: this.sinCache, params: { accion: "consultar_preparacion" } })).pipe(timeout(3e4), map((r) => {
      const d = this.datos(r);
      if (d.origen !== "reconocimiento" || ("id_origen" in d ? d.id_origen !== id : d.id_reconocimiento !== id)) {
        throw new Error("La preparaci\xF3n no corresponde al reconocimiento individual.");
      }
      return d;
    }), catchError((e) => this.error(e)));
  }
  http = inject(HttpClient);
  api = environment.apiBaseUrl.replace(/\/$/, "");
  privado = { context: new HttpContext().set(AUTHENTICATED_REQUEST, true), withCredentials: true };
  sinCache = { "Cache-Control": "no-cache, no-store, max-age=0", Pragma: "no-cache" };
  revisarOrigen(origen, id, sesion, mensajePractica) {
    if (mensajePractica !== void 0 && origen !== "practica" && origen !== "reconocimiento")
      return throwError(() => ({ status: 422, mensaje: "El mensaje no corresponde al origen solicitado.", errores: {} }));
    const porSesion = origen === "ponente_sesion";
    if (porSesion !== !!sesion) {
      return throwError(() => ({ status: 422, mensaje: "La modalidad solicitada no corresponde a este origen.", errores: {} }));
    }
    if (porSesion && (!Number.isSafeInteger(sesion.id_sesion) || sesion.id_sesion < 1)) {
      return throwError(() => ({ status: 422, mensaje: "La sesi\xF3n acreditada no es v\xE1lida.", errores: {} }));
    }
    const modalidad = porSesion ? { modalidad_reconocimiento: "sesion", id_sesion: sesion.id_sesion } : origen === "ponente_actividad" ? { modalidad_reconocimiento: "actividad" } : {};
    return this.operacionOrigen(origen, id, __spreadValues(__spreadValues(__spreadValues({
      accion: "revisar_documento"
    }, modalidad), sesion?.mensaje !== void 0 ? { mensaje: sesion.mensaje, motivo: sesion.motivo } : {}), (origen === "practica" || origen === "reconocimiento") && mensajePractica !== void 0 ? { mensaje: mensajePractica } : {})).pipe(switchMap((d) => {
      if ((origen === "practica" || origen === "reconocimiento") && mensajePractica !== void 0 && d.mensaje !== mensajePractica)
        throw new Error("El servidor devolvi\xF3 un mensaje distinto del solicitado.");
      if (porSesion && d.recuperado === true && d.persistido === true && d.texto_editable === false && d.origen === origen && d.id_origen === id && d.id_actividad_ponente === id && d.modalidad_reconocimiento === "sesion" && d.id_sesion === sesion.id_sesion && d.id_certificado_documento) {
        return this.detalleFirmas(d.id_certificado_documento).pipe(switchMap((documento) => {
          if (documento.hash_pdf !== d.hash_pdf || documento.id_actividad_ponente !== id || documento.id_sesion !== sesion.id_sesion)
            throw new Error("Documento recuperado incompatible.");
          const archivo = decodificarVistaPrevia(__spreadProps(__spreadValues({}, d.vista_previa_pdf), { nombre_archivo: "reconocimiento.pdf", persistido: true }), true);
          return from(this.validarHash(archivo, d.hash_pdf)).pipe(map(() => ({
            token: "",
            expiresAt: "",
            hash: d.hash_pdf,
            mensaje: d.mensaje,
            motivo: d.motivo,
            documento: __spreadProps(__spreadValues({}, documento), { mensaje: d.mensaje, mensaje_aprobado: d.mensaje, motivo: d.motivo, texto_editable: false }),
            archivo
          })));
        }));
      }
      if (porSesion && sesion?.mensaje !== void 0 && (d.mensaje !== sesion.mensaje || d.motivo !== sesion.motivo))
        throw new Error("El servidor devolvi\xF3 textos distintos de los solicitados.");
      if (d.origen !== origen || d.id_origen !== id || d.modo !== "administrativo" || d.persistido !== false || !/^[a-f0-9]{64}$/.test(d.token_revision) || typeof d.mensaje !== "string")
        throw new Error("No se pudo confirmar la revisi\xF3n del certificado.");
      if (origen === "ponente_actividad" && (d.modalidad_reconocimiento !== "actividad" || d.id_sesion !== null || d.id_actividad_ponente !== id))
        throw new Error("No se pudo confirmar la modalidad del reconocimiento.");
      if (origen === "ponente_sesion" && (d.modalidad_reconocimiento !== "sesion" || Number(d.id_sesion) !== sesion.id_sesion || d.id_actividad_ponente !== id))
        throw new Error("No se pudo confirmar la sesi\xF3n acreditada del reconocimiento.");
      return this.revisionValidada(d.token_revision, d.expires_at, d.hash_pdf, __spreadProps(__spreadValues({}, d.vista_previa_pdf), { nombre_archivo: "vista-previa-certificado.pdf", persistido: false }), false).pipe(map((revision) => __spreadProps(__spreadValues({}, revision), { mensaje: d.mensaje, motivo: d.motivo })));
    }), catchError((e) => this.error(e)));
  }
  guardarOrigen(evaluacion, revision) {
    const ponente = evaluacion.origen === "ponente_actividad" || evaluacion.origen === "ponente_sesion";
    const modalidad = evaluacion.origen === "ponente_sesion" ? { modalidad_reconocimiento: "sesion", id_sesion: evaluacion.id_sesion } : evaluacion.origen === "ponente_actividad" ? { modalidad_reconocimiento: "actividad" } : {};
    return this.operacionOrigen(evaluacion.origen, evaluacion.id_origen, __spreadValues(__spreadValues(__spreadValues({
      accion: "confirmar_preparacion",
      token_revision: revision.token,
      confirmar: true
    }, modalidad), (evaluacion.origen === "practica" || evaluacion.origen === "reconocimiento") && revision.mensaje !== void 0 ? { mensaje: revision.mensaje } : {}), evaluacion.origen === "ponente_sesion" && revision.motivo !== void 0 ? { mensaje: revision.mensaje, motivo: revision.motivo } : {})).pipe(switchMap((d) => {
      if (d.preparacion_persistida !== true || !Number.isSafeInteger(d.id_certificado_documento) || d.id_certificado_documento < 1) {
        throw new Error("No se pudo confirmar el certificado guardado.");
      }
      if (evaluacion.origen === "ponente_actividad") {
        if (d.origen !== "ponente_actividad" || d.modalidad_reconocimiento !== "actividad" || d.id_sesion !== null || d.id_actividad !== evaluacion.id_actividad || d.id_actividad_ponente !== evaluacion.id_origen)
          throw new Error("No se pudo confirmar el reconocimiento guardado.");
        return this.recuperarReconocimientoActividad(evaluacion, d.id_certificado, revision.hash);
      }
      if (evaluacion.origen === "ponente_sesion") {
        if (d.origen !== "ponente_sesion" || d.modalidad_reconocimiento !== "sesion" || Number(d.id_sesion) !== evaluacion.id_sesion || d.id_actividad !== evaluacion.id_actividad || d.id_actividad_ponente !== evaluacion.id_origen)
          throw new Error("No se pudo confirmar el reconocimiento de esta sesi\xF3n.");
        return this.recuperarReconocimientoSesion(evaluacion, d.id_certificado, revision.hash).pipe(map((recuperado) => {
          if (recuperado.id_certificado_documento !== d.id_certificado_documento)
            throw new Error("El documento recuperado no corresponde a la preparaci\xF3n confirmada.");
          return recuperado;
        }));
      }
      return this.detalleFirmas(d.id_certificado_documento).pipe(map((detalle) => {
        if (detalle.id_certificado !== d.id_certificado || detalle.hash_pdf !== revision.hash || detalle.beneficiario?.id_persona !== evaluacion.id_persona || detalle.id_tipo_certificado !== evaluacion.id_tipo_certificado || detalle.origen !== evaluacion.origen || detalle.id_sesion != null || !["PREPARADO", "PENDIENTE_FIRMA"].includes(detalle.estado_certificado)) {
          throw new Error("No se pudo confirmar el origen y el PDF guardado.");
        }
        if ((evaluacion.origen === "practica" || evaluacion.origen === "reconocimiento") && revision.mensaje !== void 0 && (detalle.mensaje_aprobado ?? detalle.mensaje) !== revision.mensaje)
          throw new Error("El documento guardado no conserva el mensaje aprobado.");
        return detalle;
      }));
    }), catchError((error) => {
      if (!ponente || ![0, 408, 409].includes(error?.status))
        return this.error(error);
      return this.recuperarPonenteVigente(evaluacion).pipe(switchMap((vigente) => {
        const existentes = vigente.certificados_existentes ?? [];
        if (vigente.id_persona !== evaluacion.id_persona || existentes.length !== 1 || vigente.puede_consultar_certificado_existente !== true)
          return throwError(() => error);
        return vigente.origen === "ponente_sesion" ? this.recuperarReconocimientoSesion(vigente, existentes[0].id_certificado) : this.abrirReconocimientoPonente(vigente, existentes[0].id_certificado);
      }), catchError((e) => this.error(e)));
    }));
  }
  recuperarReconocimientoActividad(e, certificado, hash) {
    return this.abrirReconocimientoPonente(e, certificado, hash);
  }
  recuperarReconocimientoSesion(e, certificado, hash) {
    const clave = [e.id_origen, e.id_sesion, certificado, hash ?? ""].join(":");
    const pendiente = this.consultasSesion.get(clave);
    if (pendiente)
      return pendiente;
    const consulta = this.consultarReconocimientoSesion(e.id_origen, e.id_sesion).pipe(map((resultado) => {
      const d = resultado;
      if (d.recuperado === false && d.persistido === false) {
        throw { status: 404, mensaje: "Preparaci\xF3n inexistente.", errores: {}, evaluacion: d };
      }
      if (d.recuperado !== true || d.persistido !== true || d.id_certificado !== certificado || d.id_actividad_ponente !== e.id_origen || d.id_sesion !== e.id_sesion || d.id_actividad !== e.id_actividad || d.beneficiario?.id_persona !== e.id_persona || d.id_tipo_certificado !== e.id_tipo_certificado || !Number.isSafeInteger(d.id_certificado_documento) || d.id_certificado_documento < 1 || hash && d.hash_pdf !== hash) {
        throw { status: 409, mensaje: "Documento incompatible con la sesi\xF3n.", errores: {} };
      }
      return d;
    }), catchError((error) => this.error(error)), finalize(() => this.consultasSesion.delete(clave)), shareReplay({ bufferSize: 1, refCount: true }));
    this.consultasSesion.set(clave, consulta);
    return consulta;
  }
  archivoAdministrativo(url, id, hash) {
    const ruta = `/certificados-documentos/${id}/archivo?flujo=firmas`;
    if (url !== `${this.api}${ruta}` && url !== `/api${ruta}`) {
      return throwError(() => ({ status: 409, mensaje: "Archivo no autorizado.", errores: {} }));
    }
    return this.pdf(`${this.api}${ruta}`, true).pipe(switchMap((archivo) => hash ? from(this.validarHash(archivo, hash)).pipe(map(() => archivo)) : of(archivo)), catchError((error) => this.error(error)));
  }
  /** Reutiliza un reconocimiento existente solo si coinciden origen, beneficiario, actividad y sesión. */
  abrirReconocimientoPonente(e, certificado, hash) {
    const modalidad = e.origen === "ponente_actividad" ? "actividad" : "sesion";
    return this.http.get(`${this.api}/certificados/detail/${certificado}`, __spreadProps(__spreadValues({}, this.privado), { headers: this.sinCache })).pipe(timeout(3e4), map((r) => this.datos(r)), switchMap((c) => {
      const mismaSesion = modalidad === "sesion" ? Number(c.id_sesion) === e.id_sesion : c.id_sesion === null;
      if (c.id_certificado !== certificado || c.origen !== e.origen || c.modalidad_reconocimiento !== modalidad || !mismaSesion || Number(c.id_actividad) !== Number(e.id_actividad) || c.id_persona !== e.id_persona || c.id_tipo_certificado !== e.id_tipo_certificado || c.id_actividad_ponente !== e.id_origen || !Number.isSafeInteger(c.id_certificado_documento) || c.id_certificado_documento < 1 || hash && c.hash_pdf !== hash)
        throw new Error("No se pudo confirmar la identidad del reconocimiento existente.");
      return this.detalleFirmas(c.id_certificado_documento).pipe(map((d) => {
        const detalleSesion = modalidad === "sesion" ? Number(d.id_sesion) === e.id_sesion : d.id_sesion == null;
        if (d.id_certificado !== certificado || d.beneficiario?.id_persona !== e.id_persona || d.id_tipo_certificado !== e.id_tipo_certificado || !detalleSesion || d.hash_pdf !== c.hash_pdf) {
          throw new Error("No se pudo confirmar el PDF del reconocimiento.");
        }
        return __spreadProps(__spreadValues({}, d), {
          origen: c.origen,
          modalidad_reconocimiento: c.modalidad_reconocimiento,
          id_actividad: c.id_actividad,
          actividad: c.actividad,
          id_sesion: c.id_sesion,
          id_actividad_ponente: c.id_actividad_ponente,
          id_reconocimiento: c.id_reconocimiento
        });
      }));
    }), catchError((err) => this.error(err)));
  }
  /** Consulta el estado vigente del vínculo antes de reutilizar un guardado incierto. */
  recuperarPonenteVigente(e) {
    if (e.origen === "ponente_sesion") {
      return this.http.get(`${this.api}/activity-session/${e.id_sesion}/ponentes-certificacion`, __spreadProps(__spreadValues({}, this.privado), { headers: this.sinCache })).pipe(timeout(3e4), map((r) => this.datos(r)), switchMap((d) => {
        if (Number(d.id_sesion) !== e.id_sesion || d.relacion_ponente_sesion_disponible !== true || !Array.isArray(d.ponentes_sesion) || Number(d.id_actividad) !== Number(e.id_actividad))
          return throwError(() => new Error("No se pudo confirmar la sesi\xF3n del reconocimiento."));
        const vigente = d.ponentes_sesion.find((p) => p.id_actividad_ponente === e.id_origen)?.reconocimiento;
        if (!vigente || vigente.origen !== "ponente_sesion" || Number(vigente.id_sesion) !== e.id_sesion || vigente.id_persona !== e.id_persona || Number(vigente.id_actividad) !== Number(e.id_actividad)) {
          return throwError(() => new Error("No se pudo confirmar el v\xEDnculo vigente del ponente con esta sesi\xF3n."));
        }
        return of(vigente);
      }));
    }
    return this.http.get(`${this.api}/activity/${e.id_actividad}/ponentes-certificacion`, __spreadProps(__spreadValues({}, this.privado), { headers: this.sinCache })).pipe(timeout(3e4), map((r) => this.datos(r)), switchMap((d) => {
      const vigente = d.ponentes?.find((p) => p.id_actividad_ponente === e.id_origen)?.reconocimiento;
      if (d.id_actividad !== e.id_actividad || d.id_sesion !== null || d.modalidad_reconocimiento !== "actividad" || !vigente || vigente.id_persona !== e.id_persona) {
        return throwError(() => new Error("No se pudo confirmar el v\xEDnculo vigente del ponente."));
      }
      return of(vigente);
    }));
  }
  operacionOrigen(origen, id, body) {
    return this.http.post(`${this.api}/certificaciones/${origen}/${id}/preparar`, body, this.privado).pipe(timeout(9e4), map((r) => this.datos(r)), catchError((e) => this.error(e)));
  }
  vistaPrevia(sesion, participacion, tipo, mensaje) {
    return this.http.post(`${this.api}/activity-session/${sesion}/preparar-certificados`, { accion: "vista_previa", formato: "pdf", id_participacion: participacion, id_tipo_certificado: tipo, mensaje }, this.privado).pipe(switchMap((r) => {
      const d = r.data;
      if (!r.success || d?.accion !== "vista_previa" || d.formato !== "pdf" || d.emitida !== false || d.creado !== false || d.mensaje_persistido !== false || d.mensaje !== mensaje || Number(d.contexto?.id_sesion ?? d.contexto?.id_actividad_sesion) !== sesion || Number(d.contexto?.id_participacion) !== participacion || Number(d.contexto?.id_tipo_certificado) !== tipo)
        throw new Error("Laravel no confirm\xF3 el contexto y el mensaje exactos de la vista previa.");
      const _a = d, { vista_previa_pdf } = _a, datos = __objRest(_a, ["vista_previa_pdf"]);
      const archivo = decodificarVistaPrevia(vista_previa_pdf);
      const hash = vista_previa_pdf.hash_pdf;
      return hash === void 0 ? of({ archivo, datos }) : from(this.validarHash(archivo, hash)).pipe(map(() => ({ archivo, datos })));
    }), catchError((e) => this.error(e)));
  }
  generar(id) {
    return this.http.post(`${this.api}/certificados/${id}/generar-documento`, {}, this.privado).pipe(map((r) => {
      if (!r.success || r.data?.id_certificado !== id || !Number.isSafeInteger(r.data?.id_certificado_documento) || r.data.id_certificado_documento < 1 || !/^[a-f0-9]{30}$/.test(r.data.codigo_verificacion) || r.data.modo !== "desarrollo" || r.data.oficial !== false || r.data.puede_emitir !== false || r.data.puede_firmar !== false || typeof r.data.url_verificacion !== "string") {
        throw new Error("Laravel no confirm\xF3 la identidad del documento generado.");
      }
      return r.data;
    }), catchError((e) => this.error(e)));
  }
  verificar(codigo) {
    return this.http.get(`${this.api}/certificados/verificar/${encodeURIComponent(codigo)}`, { withCredentials: false }).pipe(map((r) => {
      if (!r.success || r.data?.codigo_verificacion !== codigo || typeof r.data.registro_encontrado !== "boolean" || typeof r.data.integridad_verificada !== "boolean" || typeof r.data.vigente !== "boolean" || typeof r.data.puede_ver_documento !== "boolean" || typeof r.data.estado_documento !== "string" || typeof r.data.estado_certificado !== "string" || typeof r.data.firma_verificada !== "boolean" || typeof r.data.emision_oficial_verificada !== "boolean" || !(r.data.url_documento === null || typeof r.data.url_documento === "string") || !Array.isArray(r.data.motivos) || !r.data.motivos.every((m) => typeof m === "string"))
        throw new Error("Respuesta de verificaci\xF3n incompleta; no se pudo confirmar el documento.");
      return r.data;
    }), catchError((e) => this.error(e)));
  }
  archivo(id, flujoFirmas = false, hash) {
    return this.pdf(`${this.api}/certificados-documentos/${id}/${flujoFirmas ? "firma/pdf-autorizado" : "archivo"}`, true).pipe(switchMap((archivo) => hash ? from(this.validarHash(archivo, hash)).pipe(map(() => archivo)) : of(archivo)), catchError((e) => this.error(e)));
  }
  archivoRrhh(id, hash) {
    return this.pdf(`${this.api}/rrhh/certificados/${id}/pdf`, true).pipe(switchMap((archivo) => hash ? from(this.validarHash(archivo, hash)).pipe(map(() => archivo)) : of(archivo)), catchError((e) => this.error(e)));
  }
  pendientesFirma(page) {
    return this.http.get(`${this.api}/certificados-documentos/list`, __spreadProps(__spreadValues({}, this.privado), { headers: this.sinCache, params: { bandeja: "por_firmar", page } })).pipe(map((r) => this.datos(r)), catchError((e) => this.error(e)));
  }
  detalleFirmas(id) {
    return this.http.get(`${this.api}/certificados-documentos/detail/${id}`, __spreadProps(__spreadValues({}, this.privado), { headers: this.sinCache, params: { flujo: "firmas" } })).pipe(timeout(3e4), map((r) => {
      const d = this.datos(r);
      if (d.id_certificado_documento !== id)
        throw new Error("Laravel devolvi\xF3 otro documento.");
      return d;
    }), catchError((e) => this.error(e).pipe(catchError((error) => throwError(() => __spreadProps(__spreadValues({}, error), {
      errores: __spreadProps(__spreadValues({}, error.errores), { endpoint: [`/api/certificados-documentos/detail/${id}?flujo=firmas`] })
    }))))));
  }
  revisarPreparacion(sesion, participacion, tipo, mensaje, modalidad) {
    return this.preparacion(sesion, { accion: "revisar_documento", id_participacion: participacion, id_tipo_certificado: tipo, mensaje, modalidad_firma: modalidad }).pipe(switchMap((d) => {
      if (d.accion !== "revisar_documento" || d.mensaje !== mensaje || !d.token_revision)
        throw new Error("Laravel no confirm\xF3 la revisi\xF3n del PDF.");
      return this.revisionValidada(d.token_revision, d.expires_at, d.hash_pdf, d.vista_previa_pdf, false);
    }), catchError((e) => this.error(e)));
  }
  preparacionesInciertas = /* @__PURE__ */ new Set();
  buscarPreparacion(contexto) {
    if (!contexto.participacion)
      return of(null);
    return this.http.get(`${this.api}/certificados/list`, __spreadProps(__spreadValues({}, this.privado), {
      headers: this.sinCache,
      params: { id_participacion: contexto.participacion, id_sesion: contexto.sesion, id_tipo_certificado: contexto.tipo, per_page: 100 }
    })).pipe(timeout(3e4), switchMap((r) => {
      const filas = this.datos(r).data.filter((b) => b.id_participacion === contexto.participacion && b.id_sesion === contexto.sesion && b.id_tipo_certificado === contexto.tipo);
      if (filas.length > 1)
        throw new Error("No se pudo determinar el documento vigente.");
      return filas[0]?.id_certificado_documento ? this.detalleFirmas(filas[0].id_certificado_documento) : of(null);
    }), catchError(() => throwError(() => ({ status: 408, mensaje: "", errores: {} }))));
  }
  guardarPreparacion(sesion, token, contexto, hash) {
    const escribir = () => this.preparacion(sesion, { accion: "confirmar_preparacion", token_revision: token, confirmar: true });
    return defer(() => this.preparacionesInciertas.has(token) && contexto ? this.buscarPreparacion(contexto).pipe(switchMap((doc) => doc ? of(doc) : escribir())) : escribir()).pipe(catchError((error) => {
      if (![408, 0, 409].includes(error.status) || !contexto?.participacion)
        return throwError(() => error);
      this.preparacionesInciertas.add(token);
      return this.buscarPreparacion(contexto).pipe(switchMap((doc) => doc ? of(doc) : throwError(() => error)));
    }), switchMap((d) => {
      const id = d.id_certificado_documento;
      if (!Number.isSafeInteger(id) || id < 1)
        throw new Error("Laravel no devolvi\xF3 un documento guardado.");
      this.validarPreparado(d, contexto, hash);
      return this.detalleFirmas(id).pipe(map((detalle) => {
        this.validarPreparado(detalle, contexto, hash);
        if (detalle.id_certificado !== d.id_certificado)
          throw new Error("Laravel devolvi\xF3 otro certificado.");
        this.preparacionesInciertas.delete(token);
        return detalle;
      }));
    }), catchError((e) => this.error(e)));
  }
  obtenerRevisionEnvio(id, hash) {
    return this.revisarEnvio(id).pipe(switchMap((r) => {
      const d = this.datos(r);
      if (!d.token_revision || d.documento?.id_certificado_documento !== id || d.vista_previa_pdf?.persistido !== true) {
        throw new Error("Laravel no confirm\xF3 la revisi\xF3n del documento almacenado.");
      }
      if (d.documento.facultades?.remitir !== true || d.documento.estado_certificado !== "PREPARADO" || hash && d.documento.hash_pdf !== hash)
        throw new Error("El documento cambi\xF3 o Laravel no autoriza remitirlo.");
      return this.revisionValidada(d.token_revision, d.expires_at, d.documento.hash_pdf, d.vista_previa_pdf, true);
    }), catchError((e) => this.error(e)));
  }
  enviosInciertos = /* @__PURE__ */ new Map();
  confirmarEnvio(id, token, hash) {
    if (this.enviosInciertos.has(id)) {
      return this.detalleFirmas(id).pipe(switchMap((doc) => {
        if (doc.estado_certificado === "PENDIENTE_FIRMA" && (!hash || doc.hash_pdf === hash)) {
          this.enviosInciertos.delete(id);
          return of(doc);
        }
        if (doc.estado_certificado !== "PREPARADO" || hash && doc.hash_pdf !== hash)
          return throwError(() => ({ status: 408, mensaje: "", errores: {} }));
        this.enviosInciertos.delete(id);
        return of(doc);
      }));
    }
    return this.enviarGerencia(id, token, true).pipe(switchMap((r) => {
      const d = this.datos(r);
      if (d.enviado !== true || d.estado_flujo !== "PENDIENTE_FIRMA")
        throw new Error("Laravel no confirm\xF3 el env\xEDo.");
      return this.detalleFirmas(id).pipe(map((doc) => {
        if (doc.estado_certificado !== "PENDIENTE_FIRMA" || hash && doc.hash_pdf !== hash)
          throw new Error("Laravel no confirm\xF3 el estado actualizado y el PDF aprobado.");
        return doc;
      }));
    }), catchError((error) => {
      if (![408, 0, 409].includes(error.status))
        return this.error(error);
      this.enviosInciertos.set(id, token);
      return this.detalleFirmas(id).pipe(switchMap((doc) => {
        if (doc.estado_certificado === "PENDIENTE_FIRMA" && (!hash || doc.hash_pdf === hash)) {
          this.enviosInciertos.delete(id);
          return of(doc);
        }
        if (error.status === 409 && doc.estado_certificado === "PREPARADO")
          this.enviosInciertos.delete(id);
        return throwError(() => error);
      }), catchError((e) => this.error(e === error || [401, 403, 404].includes(e?.status) ? e : { status: 408, mensaje: "", errores: {} })));
    }));
  }
  preparacion(sesion, body) {
    return this.http.post(`${this.api}/activity-session/${sesion}/preparar-certificados`, body, this.privado).pipe(timeout(9e4), map((r) => this.datos(r)), catchError((e) => this.error(e)));
  }
  validarHash(archivo, hash) {
    return __async(this, null, function* () {
      const bytes = yield crypto.subtle.digest("SHA-256", yield archivo.blob.arrayBuffer());
      const calculado = Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
      if (hash !== calculado)
        throw new Error("El PDF no coincide con la huella devuelta por Laravel.");
    });
  }
  revisionValidada(token, expiresAt, hash, pdf, persistido) {
    if (!token || !Number.isFinite(Date.parse(expiresAt)) || !/^[a-f0-9]{64}$/.test(hash))
      throw new Error("La revisi\xF3n de Laravel est\xE1 incompleta.");
    const archivo = decodificarVistaPrevia(pdf, persistido);
    return from(this.validarHash(archivo, hash)).pipe(map(() => ({ token, archivo, expiresAt, hash })));
  }
  validarPreparado(doc, contexto, hash) {
    const estadoPersistido = doc.estado_certificado === "PREPARADO" || !!contexto && ["PENDIENTE_FIRMA", "FIRMADO", "EMITIDO"].includes(doc.estado_certificado);
    if (!Number.isSafeInteger(doc.id_certificado) || doc.id_certificado < 1 || !estadoPersistido || hash && doc.hash_pdf !== hash)
      throw new Error("Laravel no confirm\xF3 el certificado preparado y su PDF aprobado.");
    if (contexto && (doc.id_sesion !== contexto.sesion || doc.id_tipo_certificado !== contexto.tipo || doc.id_actividad !== contexto.actividad || doc.beneficiario?.id_persona !== contexto.persona)) {
      throw new Error("Laravel devolvi\xF3 un certificado de otro beneficiario, sesi\xF3n o tipo.");
    }
  }
  datos(respuesta) {
    if (!respuesta?.success || !respuesta.data)
      throw new Error("Laravel no confirm\xF3 la operaci\xF3n.");
    return respuesta.data;
  }
  revisarEnvio(idDocumento) {
    return this.operacionEnvio(idDocumento, "revisar-envio", {});
  }
  enviarGerencia(idDocumento, tokenRevision, confirmar) {
    if (confirmar !== true || typeof tokenRevision !== "string" || !tokenRevision.trim()) {
      return throwError(() => ({ status: 422, mensaje: "Se requiere revisi\xF3n y confirmaci\xF3n del documento.", errores: {} }));
    }
    return this.operacionEnvio(idDocumento, "enviar-gerencia", { token_revision: tokenRevision, confirmar: true });
  }
  operacionEnvio(id, accion, body) {
    if (!Number.isSafeInteger(id) || id < 1) {
      return throwError(() => ({ status: 422, mensaje: "Se requiere el identificador del documento registrado.", errores: {} }));
    }
    return this.http.post(`${this.api}/certificados-documentos/${id}/${accion}`, body, this.privado).pipe(timeout(9e4), catchError((e) => this.error(e)));
  }
  archivoPublico(url, codigo) {
    const ruta = `/api/certificados/verificar/${encodeURIComponent(codigo)}?archivo=1`;
    if (url !== ruta && url !== `${this.api}/certificados/verificar/${encodeURIComponent(codigo)}?archivo=1`) {
      return throwError(() => ({ status: 0, mensaje: "La URL p\xFAblica del PDF no corresponde al documento consultado.", errores: {} }));
    }
    return this.pdf(`${this.api}/certificados/verificar/${encodeURIComponent(codigo)}?archivo=1`, false);
  }
  pdf(url, privado) {
    return this.http.get(url, __spreadProps(__spreadValues({}, privado ? __spreadProps(__spreadValues({}, this.privado), { headers: this.sinCache }) : { withCredentials: false }), { observe: "response", responseType: "blob" })).pipe(timeout(6e4), switchMap((r) => from(this.validarPdf(r))), catchError((e) => this.error(e)));
  }
  validarPdf(respuesta) {
    return __async(this, null, function* () {
      const blob = respuesta.body;
      if (!blob || !/^(application\/pdf|application\/octet-stream)(;|$)/i.test(respuesta.headers.get("Content-Type") ?? blob.type) || (yield blob.slice(0, 5).text()) !== "%PDF-")
        throw new Error("Archivo PDF no disponible: Laravel no devolvi\xF3 un PDF v\xE1lido.");
      const archivo = { blob: new Blob([blob], { type: "application/pdf" }), nombre: "certificado.pdf" };
      const hash = respuesta.headers.get("X-Document-SHA256");
      if (hash)
        yield this.validarHash(archivo, hash);
      return archivo;
    });
  }
  error(error) {
    if (error instanceof TimeoutError)
      return throwError(() => ({ status: 408, mensaje: "No se pudo confirmar el resultado. Actualiza el estado antes de reintentar", errores: {} }));
    if (error && typeof error === "object" && "mensaje" in error && "status" in error && "errores" in error)
      return throwError(() => error);
    if (error instanceof HttpErrorResponse && error.error instanceof Blob) {
      return from(error.error.text()).pipe(switchMap((texto) => {
        let cuerpo;
        try {
          cuerpo = JSON.parse(texto);
        } catch {
          cuerpo = null;
        }
        return throwError(() => aErrorApi(new HttpErrorResponse({ status: error.status, error: cuerpo })));
      }));
    }
    return throwError(() => error instanceof Error && !(error instanceof HttpErrorResponse) ? { status: 502, mensaje: error.message, errores: {} } : aErrorApi(error));
  }
  static \u0275fac = function DocumentosDigitalesService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DocumentosDigitalesService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _DocumentosDigitalesService, factory: _DocumentosDigitalesService.\u0275fac, providedIn: "root" });
};

export {
  validarMensajeCertificado,
  decodificarVistaPrevia,
  mensajeEtapaA,
  mensajeDocumento,
  DocumentosDigitalesService
};
//# sourceMappingURL=chunk-R23RR7XQ.mjs.map
