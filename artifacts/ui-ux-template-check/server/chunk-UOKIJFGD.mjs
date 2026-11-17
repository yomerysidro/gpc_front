import './polyfills.server.mjs';
import {
  AreaService,
  DocumentTypeService,
  PersonDocumentService,
  PersonWorkerService
} from "./chunk-7VY3YOD2.mjs";
import {
  PersonService
} from "./chunk-2XE3PF63.mjs";
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
  HttpErrorResponse,
  HttpParams
} from "./chunk-TNXV45E5.mjs";
import {
  EMPTY,
  InjectionToken,
  catchError,
  expand,
  forkJoin,
  inject,
  map,
  of,
  reduce,
  switchMap,
  throwError,
  ɵɵdefineInjectable
} from "./chunk-OYAKRC2F.mjs";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-X7LY3JHO.mjs";

// src/app/core/services/emision-certificados/operaciones-emision.ts
var ESCRITURA_EMISION_AUTORIZADA = new InjectionToken("ESCRITURA_EMISION_AUTORIZADA", {
  providedIn: "root",
  factory: () => false
});
var BLOQUEO_ESCRITURA_EMISION = "Las operaciones de registro, edici\xF3n y eliminaci\xF3n est\xE1n bloqueadas hasta verificar la autenticaci\xF3n y autorizaci\xF3n efectivas del backend.";

// src/app/core/services/emision-certificados/emision-certificados.service.ts
var PERMISOS_EMISION = {
  activity: "actividades",
  "activity-session": "actividades",
  "ativicty-type": "actividades",
  "activity-speaker": "ponentes-firmantes",
  participation: "participantes",
  "participation-type": "participantes",
  attendance: "participantes",
  certificados: "emision",
  "tipos-certificado": "emision",
  reconocimientos: "reconocimientos",
  "certificados-documentos": "emision",
  firmas: "ponentes-firmantes",
  "certificados-firmas": "emision",
  "consultas-certificado": "emision",
  "actividades-firmas": "ponentes-firmantes"
};
var EmisionCertificadosService = class _EmisionCertificadosService {
  ponentesActividad(actividad) {
    return this.consultaCertificacion(`activity/${actividad}/ponentes-certificacion`).pipe(map((d) => {
      if (d.id_actividad !== actividad || d.id_sesion !== null || d.modalidad_reconocimiento !== "actividad" || !Array.isArray(d.ponentes) || d.ponentes.some((p) => p.id_actividad !== actividad || p.reconocimiento?.origen !== "ponente_actividad" || p.reconocimiento.id_origen !== p.id_actividad_ponente || p.reconocimiento.id_sesion !== null || p.reconocimiento.modalidad_reconocimiento !== "actividad"))
        throw new Error("No se pudo confirmar el reconocimiento por actividad.");
      return d;
    }));
  }
  catalogosOrigenes() {
    return this.consultaCertificacion("certificaciones/catalogos-origenes");
  }
  evaluarOrigen(origen, id) {
    return this.consultaCertificacion(`${origen === "practica" ? "practices" : "reconocimientos"}/${id}/evaluacion-certificacion`).pipe(map((d) => {
      if (d.origen !== origen || d.id_origen !== id || d.id_actividad !== null || d.id_sesion !== null || !d[origen] || !Array.isArray(d.motivos_bloqueo) || !Array.isArray(d.certificados_existentes)) {
        throw new Error("No se pudo confirmar el origen del certificado.");
      }
      return d;
    }));
  }
  registrosPracticas() {
    return this.consultaCertificacion("practices/list");
  }
  ponentesCertificacion(sesion) {
    return this.consultaCertificacion(`activity-session/${sesion}/ponentes-certificacion`).pipe(map((d) => {
      const filas = d.ponentes_sesion;
      if (Number(d.id_sesion) !== sesion || !Number.isSafeInteger(Number(d.id_actividad)) || Number(d.id_actividad) < 1 || !Array.isArray(d.ponentes_actividad)) {
        throw { status: 502, mensaje: "Laravel no confirm\xF3 la sesi\xF3n consultada para los ponentes.", errores: {} };
      }
      if (d.relacion_ponente_sesion_disponible !== true || !Array.isArray(filas)) {
        const motivos = (d.motivos_bloqueo ?? []).filter((m) => !/sql|postgres|neon|esquema|schema/i.test(m)).join(" ");
        throw { status: 409, mensaje: ["El servidor no acredita la vinculaci\xF3n de ponentes por sesi\xF3n.", motivos].filter(Boolean).join(" "), errores: {} };
      }
      if (filas.some((p) => Number(p.id_actividad) !== Number(d.id_actividad) || p.reconocimiento?.origen !== "ponente_sesion" || p.reconocimiento.modalidad_reconocimiento !== "sesion" || p.reconocimiento.id_origen !== p.id_actividad_ponente || p.reconocimiento.id_sesion != null && Number(p.reconocimiento.id_sesion) !== sesion || p.reconocimiento.id_persona != null && Number(p.reconocimiento.id_persona) !== Number(p.id_persona) || p.reconocimiento.id_actividad != null && Number(p.reconocimiento.id_actividad) !== Number(d.id_actividad) || (p.reconocimiento.puede_preparar || p.reconocimiento.puede_consultar_certificado_existente) && (Number(p.reconocimiento.id_sesion) !== sesion || Number(p.reconocimiento.id_persona) !== Number(p.id_persona) || Number(p.reconocimiento.id_actividad) !== Number(d.id_actividad)))) {
        throw { status: 502, mensaje: "No se pudo confirmar la acreditaci\xF3n de los ponentes de esta sesi\xF3n.", errores: {} };
      }
      return __spreadProps(__spreadValues({}, d), { ponentes_sesion: filas });
    }));
  }
  /** Gestión real de vínculos ponente–sesión; no crea personas ni trabajadores. */
  ponentesSesion(actividad, sesion) {
    return this.consultaCertificacion(`activity/${actividad}/sessions/${sesion}/ponentes`).pipe(map((d) => {
      if (Number(d.id_actividad) !== actividad || Number(d.id_sesion) !== sesion || !Array.isArray(d.ponentes_disponibles) || !Array.isArray(d.vinculos) || d.vinculos.some((v) => Number(v.id_actividad) !== actividad || Number(v.id_actividad_sesion) !== sesion)) {
        throw { status: 502, mensaje: "Laravel no confirm\xF3 la sesi\xF3n consultada para los ponentes.", errores: {} };
      }
      return d;
    }));
  }
  vincularPonenteSesion(actividad, sesion, idPersonaPonente) {
    if (!aciertoPositivo(actividad) || !aciertoPositivo(sesion) || !aciertoPositivo(idPersonaPonente)) {
      return throwError(() => ({ status: 422, mensaje: "Selecciona un ponente del cat\xE1logo para esta sesi\xF3n.", errores: {} }));
    }
    return this.http.post(`${this.api}/activity/${actividad}/sessions/${sesion}/ponentes`, { id_persona_ponente: idPersonaPonente }, __spreadProps(__spreadValues({}, this.opciones()), { withCredentials: true })).pipe(map((r) => {
      const d = this.datos(r);
      if (!Number.isSafeInteger(d?.vinculo?.id_actividad_ponente) || d.vinculo.id_actividad_ponente < 1) {
        throw new HttpErrorResponse({ status: 502, error: { message: "Laravel no confirm\xF3 el v\xEDnculo del ponente." } });
      }
      return d;
    }), catchError((e) => this.error(e)));
  }
  desvincularPonenteSesion(actividad, sesion, idActividadPonente) {
    if (!aciertoPositivo(actividad) || !aciertoPositivo(sesion) || !aciertoPositivo(idActividadPonente)) {
      return throwError(() => ({ status: 422, mensaje: "Selecciona un v\xEDnculo v\xE1lido de esta sesi\xF3n.", errores: {} }));
    }
    return this.http.delete(`${this.api}/activity/${actividad}/sessions/${sesion}/ponentes`, __spreadProps(__spreadValues({}, this.opciones()), { withCredentials: true, body: { id_actividad_ponente: idActividadPonente } })).pipe(map((r) => {
      const d = this.datos(r);
      if (d?.desvinculado !== true)
        throw new HttpErrorResponse({ status: 502, error: { message: "Laravel no confirm\xF3 la desvinculaci\xF3n." } });
      return d;
    }), catchError((e) => this.error(e)));
  }
  catalogoAutorizado(filtros = {}, recurso = "certificados") {
    return this.paginaCatalogo(`${recurso}/list`, __spreadProps(__spreadValues({}, filtros), { page: 1, per_page: 100 })).pipe(
      expand((p) => p.current_page < p.last_page ? this.paginaCatalogo(`${recurso}/list`, __spreadProps(__spreadValues({}, filtros), { page: p.current_page + 1, per_page: 100 })) : EMPTY),
      reduce((filas, p) => [...filas, ...p.data], []),
      // Una nueva respuesta reemplaza la misma identidad; nunca se agrupa por persona o actividad.
      map((filas) => [...new Map(filas.map((f) => [`${f.id_certificado}:${f.id_certificado_documento}`, f])).values()])
    );
  }
  catalogoCertificados(page, filtros = {}) {
    return this.paginaCatalogo("certificados/list", __spreadProps(__spreadValues({}, filtros), { page, per_page: 20 }));
  }
  actividadesRrhh(page = 1) {
    return this.paginaCatalogo("rrhh/actividades", { page });
  }
  sesionesRrhh(actividad, page = 1) {
    return this.paginaCatalogo(`rrhh/actividades/${actividad}/sesiones`, { page });
  }
  certificadosRrhh(sesion, page = 1, persona = "") {
    return this.paginaCatalogo(`rrhh/sesiones/${sesion}/certificados`, { page, id_persona: persona });
  }
  paginaCatalogo(ruta, filtros) {
    let params = new HttpParams();
    for (const [clave, valor] of Object.entries(filtros)) {
      if (valor !== void 0 && valor !== null && valor !== "")
        params = params.set(clave, String(valor));
    }
    return this.http.get(`${this.api}/${ruta}`, __spreadProps(__spreadValues({}, this.opciones()), {
      withCredentials: true,
      params,
      headers: { "Cache-Control": "no-cache, no-store, max-age=0", Pragma: "no-cache" }
    })).pipe(map((r) => {
      const pagina = this.datos(r);
      if (!Array.isArray(pagina?.data) || !Number.isSafeInteger(pagina.total) || pagina.total < 0 || !Number.isSafeInteger(pagina.current_page) || pagina.current_page < 1 || !Number.isSafeInteger(pagina.last_page) || pagina.last_page < 1 || !Number.isSafeInteger(pagina.per_page) || pagina.per_page < 1 || pagina.per_page > 100) {
        throw new Error("El cat\xE1logo de certificados devolvi\xF3 una p\xE1gina inv\xE1lida.");
      }
      return pagina;
    }), catchError((e) => this.error(e)));
  }
  escrituraAutorizada = inject(ESCRITURA_EMISION_AUTORIZADA);
  escrituraBloqueada(recurso) {
    return !this.escrituraAutorizada && ["certificados", "certificados-documentos", "firmas", "actividades-firmas"].includes(recurso);
  }
  http = inject(HttpClient);
  api = environment.apiBaseUrl;
  personas = inject(PersonService);
  personal = inject(PersonWorkerService);
  areas = inject(AreaService);
  documentosPersona = inject(PersonDocumentService);
  tiposDocumento = inject(DocumentTypeService);
  estadoSesionCertificacion(id) {
    return this.consultaCertificacion(`activity-session/${id}`);
  }
  pendientesCertificacion(filtros = {}) {
    return this.consultaCertificacion("certificaciones/pendientes", filtros);
  }
  beneficiariosCertificacion(origen, id, filtros = {}) {
    return this.consultaCertificacion(origen === "sesion" ? `activity-session/${id}/beneficiarios` : `activity/${id}/beneficiarios-certificacion`, filtros).pipe(switchMap((evaluacion) => !evaluacion.beneficiarios.data.length || evaluacion.origen !== origen || origen === "sesion" && Number(evaluacion.contexto.id_sesion) !== id ? of(evaluacion) : forkJoin(evaluacion.beneficiarios.data.map((b) => !b.id_tipo_certificado || Number(b.id_actividad) !== Number(evaluacion.contexto.id_actividad) || origen === "sesion" && Number(b.id_sesion) !== id ? of(b) : this.listarTodos("certificados", { id_participacion: b.id_participacion, id_sesion: b.id_sesion, id_tipo_certificado: b.id_tipo_certificado }).pipe(map((filas) => {
      const coincidentes = filas.filter((c) => c.id_participacion === b.id_participacion && c.id_tipo_certificado === b.id_tipo_certificado && (c["id_sesion"] ?? c["id_actividad_sesion"] ?? null) === b.id_sesion && c.id_persona === b.id_persona && c.estado !== false && c.estado !== "ANULADO");
      const documentos = new Set(coincidentes.map((c) => `${c.id_certificado}:${c["id_certificado_documento"] ?? ""}`));
      if (documentos.size > 1)
        throw { status: 409, mensaje: "Hay m\xE1s de un documento para esta participaci\xF3n, sesi\xF3n y tipo. No se pudo confirmar el certificado vigente.", errores: {} };
      const certificado = coincidentes[0];
      return certificado ? __spreadProps(__spreadValues({}, b), {
        id_certificado: certificado.id_certificado,
        id_certificado_documento: Number(certificado["id_certificado_documento"]) || b.id_certificado_documento,
        estado_documento: String(certificado["estado_certificado"] ?? b.estado_documento ?? ""),
        estado_preparacion: String(certificado["estado_preparacion"] ?? b.estado_preparacion ?? ""),
        disponible_rrhh: certificado["disponible_rrhh"] === true,
        pdf_confirmado: certificado["pdf_confirmado"] === true
      }) : b;
    })))).pipe(map((beneficiarios) => __spreadProps(__spreadValues({}, evaluacion), { beneficiarios: __spreadProps(__spreadValues({}, evaluacion.beneficiarios), { data: beneficiarios }) })))));
  }
  finalizarSesion(id, actividad) {
    return this.http.post(`${this.api}/activity-session/${id}/finalizar`, {}, this.opciones()).pipe(map((r) => this.datos(r)), catchError((e) => this.error(e)));
  }
  consultaCertificacion(ruta, filtros = {}) {
    let params = new HttpParams();
    for (const [campo, valor] of Object.entries(filtros))
      if (valor !== void 0 && valor !== null && valor !== "")
        params = params.set(campo, String(valor));
    return this.http.get(`${this.api}/${ruta}`, __spreadProps(__spreadValues({}, this.opciones()), { withCredentials: true, params, headers: { "Cache-Control": "no-cache, no-store, max-age=0", Pragma: "no-cache" } })).pipe(map((r) => this.datos(r)), catchError((e) => this.error(e)));
  }
  listar(recurso, filtros = {}) {
    if (this.esListaSimple(recurso)) {
      return this.http.get(this.ruta(recurso, "listar"), this.opciones()).pipe(map((respuesta) => {
        const filas = this.datos(respuesta).map((fila) => this.registro(recurso, fila)).filter((fila) => Object.entries(filtros).every(([campo, valor]) => ["page", "per_page"].includes(campo) || valor === null || valor === void 0 || valor === "" || String(fila[campo]) === String(valor)));
        const perPage = Math.min(100, Math.max(1, Number(filtros["per_page"]) || 20));
        const ultima = Math.max(1, Math.ceil(filas.length / perPage));
        const pagina = Math.min(ultima, Math.max(1, Number(filtros["page"]) || 1));
        return { data: filas.slice((pagina - 1) * perPage, pagina * perPage), total: filas.length, current_page: pagina, last_page: ultima, per_page: perPage };
      }), catchError((error) => this.error(error)));
    }
    let params = new HttpParams();
    for (const [campo, valor] of Object.entries(filtros)) {
      if (valor !== void 0 && valor !== null && valor !== "") {
        params = params.set(campo, typeof valor === "boolean" ? Number(valor) : valor);
      }
    }
    return this.http.get(`${this.api}/${recurso}/list`, __spreadValues(__spreadProps(__spreadValues({}, this.opciones()), {
      params
    }), ["certificados", "certificados-documentos"].includes(recurso) ? { headers: { "Cache-Control": "no-cache, no-store, max-age=0", Pragma: "no-cache" } } : {})).pipe(map((respuesta) => this.datos(respuesta)), catchError((error) => this.error(error)));
  }
  obtener(recurso, id) {
    return this.http.get(this.ruta(recurso, "obtener", id), this.opciones()).pipe(map((respuesta) => this.registro(recurso, this.datos(respuesta))), catchError((error) => this.error(error)));
  }
  /** Historial completo: no confundir los primeros 100 registros con todo el historial. */
  listarTodos(recurso, filtros = {}) {
    if (this.esListaSimple(recurso)) {
      let params = new HttpParams();
      for (const [campo, valor] of Object.entries(filtros)) {
        if (valor !== void 0 && valor !== null && valor !== "")
          params = params.set(campo, typeof valor === "boolean" ? Number(valor) : valor);
      }
      return this.http.get(this.ruta(recurso, "listar"), __spreadProps(__spreadValues({}, this.opciones()), { params })).pipe(map((respuesta) => {
        const filas = this.datos(respuesta);
        if (!Array.isArray(filas))
          throw new Error("Respuesta de cat\xE1logo inv\xE1lida.");
        return filas.map((fila) => this.registro(recurso, fila));
      }), catchError((error) => this.error(error)));
    }
    return this.listar(recurso, __spreadProps(__spreadValues({}, filtros), { page: 1, per_page: 100 })).pipe(expand((pagina) => pagina.current_page < pagina.last_page ? this.listar(recurso, __spreadProps(__spreadValues({}, filtros), { page: pagina.current_page + 1, per_page: 100 })) : EMPTY), reduce((filas, pagina) => [...filas, ...pagina.data], []));
  }
  trabajadores() {
    return this.personal.listar().pipe(map((filas) => filas.map((fila) => ({
      id_persona_trabajador: fila.id_persona_trabajador,
      id_persona: fila.id_persona,
      id_area: fila.id_area,
      cargo: fila.cargo,
      estado: fila.estado
    }))), catchError((error) => this.error(error)));
  }
  /** Lecturas existentes de Gestion. Laravel decide el acceso; un 403 nunca se omite. */
  personaReconocimiento(id) {
    return this.personas.obtener(id).pipe(map((data) => ({
      id_persona: data.id_persona,
      nombres: data.nombres,
      apellido_paterno: data.apellido_paterno,
      apellido_materno: data.apellido_materno
    })), catchError((error) => this.error(error)));
  }
  areaReconocimiento(id) {
    return this.areas.obtener(id).pipe(map((data) => ({ id_area: data.id_area, nombre: data.nombre })), catchError((error) => this.error(error)));
  }
  /** DNI identificado por el catálogo real, nunca por un ID de tipo supuesto. */
  documentosIdentidad() {
    return forkJoin({
      documentos: this.documentosPersona.listar(),
      tipos: this.tiposDocumento.listar()
    }).pipe(map(({ documentos, tipos }) => {
      const ids = new Set(tipos.filter((tipo) => tipo.nombre.trim().toUpperCase() === "DNI" || tipo.nombre.trim().toUpperCase() === "DOCUMENTO NACIONAL DE IDENTIDAD").map((tipo) => tipo.id_tipo_documento));
      const resultado = {};
      for (const fila of documentos) {
        if (ids.has(fila.id_tipo_documento) && !resultado[fila.id_persona])
          resultado[fila.id_persona] = fila.numero_documento;
      }
      return resultado;
    }), catchError((error) => this.error(error)));
  }
  crear(recurso, payload) {
    if (recurso === "activity")
      return throwError(() => ({ status: 403, mensaje: "Las actividades nuevas requieren una solicitud aprobada.", errores: {} }));
    if (this.escrituraBloqueada(recurso))
      return throwError(() => ({ status: 403, mensaje: BLOQUEO_ESCRITURA_EMISION, errores: {} }));
    return this.http.post(this.ruta(recurso, "crear"), this.payload(recurso, payload), this.opciones()).pipe(map((respuesta) => this.registro(recurso, this.datos(respuesta))), catchError((error) => this.error(error)));
  }
  actualizar(recurso, id, payload) {
    if (this.escrituraBloqueada(recurso))
      return throwError(() => ({ status: 403, mensaje: BLOQUEO_ESCRITURA_EMISION, errores: {} }));
    return this.http.patch(this.ruta(recurso, "actualizar", id), this.payload(recurso, payload), this.opciones()).pipe(map((respuesta) => this.registro(recurso, this.datos(respuesta))), catchError((error) => this.error(error)));
  }
  eliminar(recurso, id) {
    if (this.escrituraBloqueada(recurso))
      return throwError(() => ({ status: 403, mensaje: BLOQUEO_ESCRITURA_EMISION, errores: {} }));
    return this.http.delete(this.ruta(recurso, "eliminar", id), this.opciones()).pipe(map((respuesta) => {
      this.datos(respuesta);
    }), catchError((error) => this.error(error)));
  }
  relacionRegistros(ruta) {
    return this.http.get(`${this.api}/${ruta}`, this.opciones()).pipe(map((respuesta) => this.datos(respuesta)), catchError((error) => this.error(error)));
  }
  /** Solo lecturas de Gestión y Actividades para elegir relaciones existentes. */
  relaciones(campo) {
    const rutas = {
      id_persona_trabajador: { url: "person-workers/list", clave: "id_persona_trabajador", texto: "cargo" },
      id_practica: { url: "practices/list", clave: "id_practica", texto: "carrera" },
      id_participacion: { url: "participation", clave: "id_participacion", texto: "id_persona" },
      id_actividad: { url: "activity", clave: "id_actividad", texto: "nombre" },
      id_persona: { url: "persons/list", clave: "id_persona", texto: "nombres" },
      id_area: { url: "areas/list", clave: "id_area", texto: "nombre" },
      id_persona_ponente: { url: "person-speakers/list", clave: "id_persona_ponente", texto: "cargo" },
      id_tipo_actividad: { url: "ativicty-type", clave: "id_tipo_actividad", texto: "nombre" },
      id_tipo_participacion: { url: "participation-type", clave: "id_tipo_participacion", texto: "nombre" },
      id_actividad_sesion: { url: "activity-session", clave: "id_actividad_sesion", texto: "nombre" }
    };
    const ruta = rutas[campo];
    if (!ruta)
      return throwError(() => new Error("Relaci\xF3n no configurada."));
    return this.http.get(`${this.api}/${ruta.url}`, this.opciones()).pipe(map((respuesta) => this.datos(respuesta).map((fila) => ({
      id: Number(fila[ruta.clave]),
      texto: `#${fila[ruta.clave]} \xB7 ${fila[ruta.texto] ?? ""}`
    }))), catchError((error) => this.error(error)));
  }
  opciones() {
    return { context: new HttpContext().set(AUTHENTICATED_REQUEST, true) };
  }
  datos(respuesta) {
    if (respuesta.success !== true)
      throw new HttpErrorResponse({ status: 502, error: { message: respuesta.message || "Laravel no confirm\xF3 la operaci\xF3n." } });
    return respuesta.data;
  }
  esListaSimple(recurso) {
    return ["activity", "activity-session", "activity-speaker", "ativicty-type", "participation", "participation-type", "attendance"].includes(recurso);
  }
  ruta(recurso, accion, id) {
    const base = `${this.api}/${recurso}`;
    if (this.esListaSimple(recurso) && recurso !== "attendance")
      return accion === "listar" || accion === "crear" ? base : `${base}/${id}`;
    const operacion = { listar: "list", obtener: recurso === "attendance" ? "" : "detail/", crear: "create", actualizar: "update/", eliminar: "delete/" }[accion];
    return `${base}/${operacion}${id ?? ""}`;
  }
  /** AttendanceController valida nombres en mayúsculas; sus lecturas usan minúsculas. */
  payload(recurso, datos) {
    return recurso === "attendance" ? Object.fromEntries(Object.entries(datos).map(([campo, valor]) => [campo.toLowerCase(), valor])) : datos;
  }
  registro(recurso, datos) {
    return recurso === "attendance" ? Object.fromEntries(Object.entries(datos).map(([campo, valor]) => [campo.toLowerCase(), valor])) : datos;
  }
  error(error) {
    const normalizado = aErrorApi(error);
    if (error instanceof HttpErrorResponse && error.status === 409 && [error.error?.code, error.error?.codigo, error.error?.data?.code, error.error?.data?.codigo].includes("ESQUEMA_PREPARACION_NO_DISPONIBLE")) {
      return throwError(() => __spreadProps(__spreadValues({}, normalizado), { mensaje: "La preparaci\xF3n de certificados por sesi\xF3n estar\xE1 disponible cuando se complete su estructura de datos", errores: { detalle: [normalizado.mensaje] } }));
    }
    if (error instanceof HttpErrorResponse && Array.isArray(error.error?.data?.motivos_bloqueo)) {
      const motivos = error.error.data.motivos_bloqueo.filter((m) => typeof m === "string");
      return throwError(() => __spreadProps(__spreadValues({}, normalizado), { mensaje: [normalizado.mensaje, ...motivos].join(" ") }));
    }
    if (error instanceof HttpErrorResponse && error.status === 422) {
      const data = error.error?.data;
      const errores = __spreadValues({}, normalizado.errores);
      if (data && typeof data === "object" && !Array.isArray(data)) {
        for (const [campo, mensajes] of Object.entries(data)) {
          if (Array.isArray(mensajes) && mensajes.every((mensaje) => typeof mensaje === "string"))
            errores[campo] = mensajes;
        }
      }
      const validacion = __spreadProps(__spreadValues({}, normalizado), { errores });
      return throwError(() => validacion);
    }
    return throwError(() => normalizado);
  }
  static \u0275fac = function EmisionCertificadosService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EmisionCertificadosService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _EmisionCertificadosService, factory: _EmisionCertificadosService.\u0275fac, providedIn: "root" });
};
function aciertoPositivo(valor) {
  return Number.isSafeInteger(valor) && valor > 0;
}

export {
  ESCRITURA_EMISION_AUTORIZADA,
  BLOQUEO_ESCRITURA_EMISION,
  PERMISOS_EMISION,
  EmisionCertificadosService
};
//# sourceMappingURL=chunk-UOKIJFGD.mjs.map
