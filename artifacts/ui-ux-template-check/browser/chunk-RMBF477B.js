import {
  ActividadesService
} from "./chunk-4NQ4ZY6Y.js";
import {
  RouterLink
} from "./chunk-A36LAIDM.js";
import {
  AuthService
} from "./chunk-W2463ZNS.js";
import {
  aErrorApi
} from "./chunk-LSGUT5KG.js";
import {
  AUTHENTICATED_REQUEST,
  environment
} from "./chunk-7PBBQCKX.js";
import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
  HttpParams,
  takeUntilDestroyed
} from "./chunk-IJ23LC2U.js";
import {
  DatePipe,
  DestroyRef,
  EMPTY,
  InjectionToken,
  Subject,
  catchError,
  defer,
  expand,
  inject,
  input,
  map,
  of,
  reduce,
  signal,
  switchMap,
  tap,
  throwError,
  ɵsetClassDebugInfo,
  ɵɵNgOnChangesFeature,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3
} from "./chunk-3ZDGBTDF.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-ZX6IUAQ5.js";

// src/app/core/services/solicitudes/activity-requests-api.service.ts
var ACTIVITY_REQUESTS_API_ACTIVA = new InjectionToken("ACTIVITY_REQUESTS_API_ACTIVA", { providedIn: "root", factory: () => true });
var CAMPOS_BORRADOR = ["id_area", "id_tipo_actividad", "nombre", "descripcion", "justificacion", "fecha_inicio_propuesta", "fecha_fin_propuesta", "sede_propuesta"];
var ActivityRequestsApiService = class _ActivityRequestsApiService {
  http = inject(HttpClient);
  disponible = inject(ACTIVITY_REQUESTS_API_ACTIVA);
  base = `${environment.apiBaseUrl}/activity-requests`;
  areasAutorizadas() {
    return this.peticion("GET", "/authorized-areas").pipe(map((areas) => {
      if (!Array.isArray(areas) || areas.some((area) => !area || !Number.isSafeInteger(area.id_area) || area.id_area < 1 || typeof area.nombre !== "string" || !area.nombre.trim())) {
        throw new Error("Laravel devolvi\xF3 una respuesta inv\xE1lida de \xE1reas autorizadas. Intenta consultar nuevamente.");
      }
      return areas;
    }));
  }
  crearBorrador(datos) {
    return this.peticion("POST", "", this.borrador(datos)).pipe(map((fila) => this.validarSolicitud(fila)));
  }
  editarBorrador(id, datos) {
    return this.conId(id, () => this.peticion("PUT", `/${id}`, this.borrador(datos)).pipe(map((fila) => this.validarSolicitud(fila, id))));
  }
  enviar(id) {
    return this.conId(id, () => this.peticion("POST", `/${id}/submit`, null).pipe(map((fila) => {
      this.validarSolicitud(fila, id);
      if (fila.estado !== "Enviada")
        throw new Error("Laravel no confirm\xF3 el estado Enviada. Actualiza la solicitud antes de reintentar.");
      return fila;
    })));
  }
  listar(filtros = {}, propias = false) {
    let params = new HttpParams();
    for (const campo of ["estado", "id_area", "fecha_desde", "fecha_hasta", "per_page", "page"]) {
      const valor = filtros[campo];
      if (valor !== void 0 && valor !== "")
        params = params.set(campo, valor);
    }
    return this.peticion("GET", propias ? "/mine" : "", void 0, params);
  }
  detalle(id) {
    return this.conId(id, () => this.peticion("GET", `/${id}`));
  }
  detalleRevision(id) {
    return this.conId(id, () => this.peticion("GET", `/${id}/review-detail`));
  }
  historial(id) {
    return this.conId(id, () => this.peticion("GET", `/${id}/history`));
  }
  revisar(id, datos = {}) {
    return this.decision(id, "review", datos);
  }
  observar(id, observacion) {
    return this.decision(id, "observe", { observacion });
  }
  derivar(id, datos = {}) {
    return this.decision(id, "derive", datos);
  }
  aprobar(id, datos = {}) {
    return this.decision(id, "approve", datos);
  }
  rechazar(id, observacion) {
    return this.decision(id, "reject", { observacion });
  }
  decision(id, accion, datos) {
    return this.conId(id, () => this.peticion("POST", `/${id}/${accion}`, datos.observacion === void 0 ? {} : { observacion: datos.observacion }));
  }
  borrador(datos) {
    return Object.fromEntries(CAMPOS_BORRADOR.filter((campo) => datos[campo] !== void 0).map((campo) => [campo, datos[campo]]));
  }
  validarSolicitud(fila, id) {
    if (!Number.isSafeInteger(fila.id_solicitud_actividad) || fila.id_solicitud_actividad < 1 || id !== void 0 && fila.id_solicitud_actividad !== id) {
      throw new Error("Laravel no devolvi\xF3 un identificador de solicitud v\xE1lido. Actualiza el listado antes de reintentar.");
    }
    return fila;
  }
  conId(id, operacion) {
    return defer(() => Number.isSafeInteger(id) && id > 0 ? operacion() : throwError(() => new Error("Selecciona una solicitud con identificador v\xE1lido.")));
  }
  peticion(metodo, ruta, body, params) {
    return defer(() => {
      if (!this.disponible)
        return throwError(() => new Error("Servicio de Solicitudes pendiente de habilitaci\xF3n: sus rutas y autorizaci\xF3n a\xFAn no est\xE1n activadas. No se ha enviado informaci\xF3n."));
      return this.http.request(metodo, this.base + ruta, {
        body,
        params,
        withCredentials: true,
        context: new HttpContext().set(AUTHENTICATED_REQUEST, true)
      }).pipe(map((respuesta) => {
        if (respuesta.success !== true || respuesta.data === null || respuesta.data === void 0) {
          throw new HttpErrorResponse({ status: 502, error: { message: respuesta.message || "Laravel no confirm\xF3 la operaci\xF3n." } });
        }
        return respuesta.data;
      }), catchError((error) => {
        const normalizado = aErrorApi(error);
        const codigo = error instanceof HttpErrorResponse ? error.error?.data?.codigo : void 0;
        if (codigo === "SOLICITUD_AREA_NO_AUTORIZADA" || codigo === "SOLICITUD_SIN_AREA_VIGENTE")
          return throwError(() => __spreadProps(__spreadValues({}, normalizado), { codigo }));
        if (error instanceof HttpErrorResponse && error.status === 422 && error.error?.data && typeof error.error.data === "object") {
          return throwError(() => __spreadProps(__spreadValues({}, normalizado), { errores: Object.fromEntries(Object.entries(error.error.data).filter(([, mensajes]) => Array.isArray(mensajes) && mensajes.every((mensaje) => typeof mensaje === "string"))) }));
        }
        return throwError(() => normalizado);
      }));
    });
  }
  static \u0275fac = function ActivityRequestsApiService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ActivityRequestsApiService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ActivityRequestsApiService, factory: _ActivityRequestsApiService.\u0275fac, providedIn: "root" });
};

// src/app/core/interfaces/solicitudes/solicitud.interface.ts
var ESTADOS_SOLICITUD = ["Borrador", "Enviada", "En revisi\xF3n", "Observada", "Pendiente de aprobaci\xF3n", "Aprobada", "Rechazada"];
function textoRevisorSolicitud(fila) {
  return fila.revisor?.trim() || (["Borrador", "Enviada"].includes(fila.estado) ? "Pendiente de asignaci\xF3n de revisor" : "Identidad del revisor no disponible");
}

// src/app/core/services/solicitudes/solicitudes-http.gateway.ts
var AUTORIZACION_SOLICITUDES = new InjectionToken("AUTORIZACION_SOLICITUDES", { providedIn: "root", factory: () => {
  const auth = inject(AuthService);
  const permiso = (clave) => !!auth.usuario() && auth.tienePermiso(`solicitudes.${clave}`);
  const capacidades = () => auth.usuario() ? auth.capacidadesSolicitudes?.() : null;
  return {
    get estadoAutorizacion() {
      return capacidades();
    },
    contexto: () => of({ responsable: auth.usuario()?.nombre ?? "", areasDisponibles: [], puedeCrear: permiso("crear") }),
    get consultaRevision() {
      return capacidades()?.consultar_revision === true;
    },
    get consultaGerencia() {
      return capacidades()?.consultar_gerencia === true;
    },
    get consultaHistorial() {
      return capacidades()?.consultar_historial === true;
    },
    get consultaDetalle() {
      return permiso("consultar") || capacidades()?.consulta_administrativa_global === true || capacidades()?.consultar_revision === true || capacidades()?.consultar_gerencia === true;
    },
    get consultaPropias() {
      return permiso("propias");
    },
    capacidades: (fila) => {
      const propia = !!auth.usuario() && fila.id_usuario_solicitante === auth.usuario().id;
      const facultades = capacidades();
      const puedeDecidirPorPropiedad = !propia || facultades?.decidir_propias === true;
      const acciones = [];
      if (propia && permiso("enviar"))
        acciones.push("Enviar");
      if (capacidades()?.revisar === true)
        acciones.push("Iniciar revisi\xF3n");
      if (capacidades()?.derivar === true)
        acciones.push("Derivar");
      if (permiso("observar") && (fila.estado === "Pendiente de aprobaci\xF3n" ? capacidades()?.aprobar : capacidades()?.revisar) === true)
        acciones.push("Observar");
      if (puedeDecidirPorPropiedad && facultades?.aprobar === true)
        acciones.push("Aprobar");
      if (puedeDecidirPorPropiedad && facultades?.rechazar === true)
        acciones.push("Rechazar");
      return { propia, puedeEditar: propia && permiso("editar"), acciones };
    }
  };
} });
var pendientes = () => throwError(() => new Error("El servicio de Solicitudes est\xE1 temporalmente no disponible. No se ha enviado informaci\xF3n."));
var AccesoSolicitudLocal = class extends Error {
  operacion;
  origen = "frontend";
  constructor(operacion) {
    super(operacion === "consulta" ? "Tu sesi\xF3n no tiene habilitada esta consulta de Solicitudes." : "Tu sesi\xF3n no tiene habilitada esta acci\xF3n o el estado de la solicitud no la permite.");
    this.operacion = operacion;
  }
};
var restringido = (operacion = "consulta") => throwError(() => new AccesoSolicitudLocal(operacion));
var ESTADOS_ACCION = {
  Enviar: ["Borrador", "Observada"],
  "Iniciar revisi\xF3n": ["Enviada"],
  Observar: ["Enviada", "En revisi\xF3n", "Pendiente de aprobaci\xF3n"],
  Derivar: ["En revisi\xF3n"],
  Aprobar: ["Pendiente de aprobaci\xF3n"],
  Rechazar: ["Pendiente de aprobaci\xF3n"]
};
var SolicitudesHttpGateway = class _SolicitudesHttpGateway {
  api = inject(ActivityRequestsApiService);
  acceso = inject(AUTORIZACION_SOLICITUDES);
  disponible = this.api.disponible && this.acceso !== null;
  registros = /* @__PURE__ */ new Map();
  decisionesDenegadas = /* @__PURE__ */ new Map();
  contexto() {
    return this.disponible && this.acceso ? this.acceso.contexto() : pendientes();
  }
  listar(bandeja, filtro) {
    if (!this.disponible || !this.acceso)
      return pendientes();
    if (bandeja === "propias" && this.acceso.consultaPropias === false)
      return restringido();
    if (bandeja === "revision" && !this.acceso.consultaRevision || bandeja === "gerencia" && !this.acceso.consultaGerencia)
      return restringido();
    if (filtro.estado && !ESTADOS_SOLICITUD.includes(filtro.estado))
      return throwError(() => new Error("Estado de solicitud no admitido por Laravel."));
    const parametros = {
      estado: filtro.estado || (bandeja === "revision" ? "Enviada" : void 0),
      fecha_desde: filtro.desde || void 0,
      fecha_hasta: filtro.hasta || void 0,
      per_page: 20,
      page: filtro.pagina
    };
    if (!filtro.busqueda.trim())
      return this.api.listar(parametros, bandeja === "propias").pipe(map((pagina) => ({
        registros: pagina.data.map((fila) => this.vista(fila)),
        total: pagina.total,
        pagina: pagina.current_page,
        ultimaPagina: pagina.last_page
      })));
    return this.api.listar(__spreadProps(__spreadValues({}, parametros), { page: 1, per_page: 100 }), bandeja === "propias").pipe(expand((pagina) => pagina.current_page < pagina.last_page ? this.api.listar(__spreadProps(__spreadValues({}, parametros), { page: pagina.current_page + 1, per_page: 100 }), bandeja === "propias") : EMPTY), reduce((filas, pagina) => [...filas, ...pagina.data], []), map((filas) => this.paginar(filas.map((fila) => this.vista(fila)).filter((fila) => `${fila.nombre} ${fila.numero}`.toLocaleLowerCase().includes(filtro.busqueda.trim().toLocaleLowerCase())), filtro.pagina)));
  }
  detalle(id, administrativo = false) {
    if (!this.disponible)
      return pendientes();
    if (administrativo && !this.acceso?.consultaDetalle)
      return restringido();
    return (administrativo ? this.api.detalleRevision(Number(id)) : this.api.detalle(Number(id))).pipe(map((fila) => this.vista(fila)), catchError((error) => {
      if (typeof error === "object" && error !== null && "status" in error && error.status === 403)
        this.decisionesDenegadas.set(id, this.acceso?.estadoAutorizacion);
      return throwError(() => error);
    }));
  }
  guardar(datos, existente) {
    if (!this.disponible || !this.acceso)
      return pendientes();
    if (existente) {
      const fila = this.registros.get(existente.id);
      if (!fila || !["Borrador", "Observada"].includes(fila.estado) || !this.acceso.capacidades(fila).puedeEditar || !this.acceso.capacidades(fila).propia)
        return restringido("accion");
    }
    const dto = {
      id_area: Number(datos.areaId),
      id_tipo_actividad: Number(datos.tipoId),
      nombre: datos.nombre,
      descripcion: datos.descripcion || null,
      justificacion: datos.objetivo,
      fecha_inicio_propuesta: datos.inicio,
      fecha_fin_propuesta: datos.fin,
      sede_propuesta: datos.lugar || null
    };
    return this.contexto().pipe(switchMap((contexto) => {
      if (!existente && !contexto.puedeCrear)
        return restringido("accion");
      return (existente ? this.api.editarBorrador(Number(existente.id), dto) : this.api.crearBorrador(dto)).pipe(map((fila) => this.vista(fila)));
    }));
  }
  decidir(id, _version, accion, motivo) {
    const fila = this.registros.get(id);
    if (!this.disponible)
      return pendientes();
    if (!fila || !this.vista(fila).acciones.includes(accion))
      return restringido("accion");
    if (["Observar", "Rechazar"].includes(accion) && !motivo.trim())
      return throwError(() => new Error("La observaci\xF3n es obligatoria."));
    const observacion = motivo.trim() ? { observacion: motivo.trim() } : {};
    const operacion = accion === "Enviar" ? this.api.enviar(Number(id)) : accion === "Iniciar revisi\xF3n" ? this.api.revisar(Number(id), observacion) : accion === "Observar" ? this.api.observar(Number(id), motivo.trim()) : accion === "Derivar" ? this.api.derivar(Number(id), observacion) : accion === "Aprobar" ? this.api.aprobar(Number(id), observacion) : this.api.rechazar(Number(id), motivo.trim());
    return operacion.pipe(map((registro) => {
      if (registro.id_solicitud_actividad !== Number(id) || accion === "Aprobar" && (registro.estado !== "Aprobada" || !Number.isSafeInteger(registro.id_actividad) || registro.id_actividad < 1) || accion === "Rechazar" && (registro.estado !== "Rechazada" || registro.id_actividad !== null)) {
        throw new Error("El servidor no confirm\xF3 el resultado esperado. Actualiza la solicitud antes de reintentar.");
      }
      return this.vista(registro);
    }), catchError((error) => {
      if (typeof error === "object" && error !== null && "status" in error && error.status === 403)
        this.decisionesDenegadas.set(id, this.acceso?.estadoAutorizacion);
      return throwError(() => error);
    }));
  }
  puedeConsultarHistorial(id) {
    const fila = this.registros.get(id);
    return !!fila && (this.acceso?.consultaHistorial === true || this.acceso?.consultaPropias === true && this.acceso.capacidades(fila).propia);
  }
  historialSolicitud(id) {
    if (!this.disponible)
      return pendientes();
    if (!this.puedeConsultarHistorial(id))
      return restringido();
    return this.api.historial(Number(id));
  }
  documentos(_pagina) {
    return throwError(() => new Error("La bandeja de certificados por firmar no forma parte del contrato de solicitudes."));
  }
  documento(_id) {
    return throwError(() => new Error("El contrato de solicitudes no proporciona descarga de documentos."));
  }
  accionesPermitidas(fila) {
    const original = this.registros.get(fila.id);
    return original ? this.vista(original).acciones : [];
  }
  vista(fila) {
    this.registros.set(String(fila.id_solicitud_actividad), fila);
    const facultades = this.acceso?.capacidades(fila);
    const denegada = this.decisionesDenegadas.has(String(fila.id_solicitud_actividad)) && this.decisionesDenegadas.get(String(fila.id_solicitud_actividad)) === this.acceso?.estadoAutorizacion;
    return {
      id: String(fila.id_solicitud_actividad),
      idSolicitudActividad: fila.id_solicitud_actividad,
      numero: `Solicitud ${fila.id_solicitud_actividad}`,
      areaId: String(fila.id_area),
      area: fila.area_nombre?.trim() || "No informado",
      responsable: fila.solicitante_nombre?.trim() || "No informado",
      tipoId: String(fila.id_tipo_actividad),
      tipo: fila.tipo_actividad_nombre || `Tipo #${fila.id_tipo_actividad}`,
      nombre: fila.nombre,
      descripcion: fila.descripcion ?? "",
      objetivo: fila.justificacion,
      inicio: fila.fecha_inicio_propuesta,
      fin: fila.fecha_fin_propuesta,
      lugar: fila.sede_propuesta ?? "",
      observaciones: "",
      fecha: fila.fecha_solicitud,
      estado: fila.estado,
      actividadId: fila.id_actividad,
      revisor: null,
      ultimaObservacion: null,
      resultadoRevision: null,
      version: "",
      puedeVerDetalle: facultades?.propia === true && this.acceso?.consultaPropias === true || this.acceso?.consultaDetalle === true,
      puedeEditar: facultades?.propia === true && facultades.puedeEditar && ["Borrador", "Observada"].includes(fila.estado),
      acciones: (facultades?.acciones ?? []).filter((accion) => !denegada && ESTADOS_ACCION[accion].includes(fila.estado) && (accion !== "Enviar" || facultades?.propia))
    };
  }
  paginar(filas, pagina) {
    const ultimaPagina = Math.max(1, Math.ceil(filas.length / 20));
    const actual = Math.min(ultimaPagina, Math.max(1, pagina));
    return { registros: filas.slice((actual - 1) * 20, actual * 20), total: filas.length, pagina: actual, ultimaPagina };
  }
  static \u0275fac = function SolicitudesHttpGateway_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SolicitudesHttpGateway)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SolicitudesHttpGateway, factory: _SolicitudesHttpGateway.\u0275fac, providedIn: "root" });
};

// src/app/core/services/solicitudes/solicitudes.service.ts
var SOLICITUDES_GATEWAY = new InjectionToken("SOLICITUDES_GATEWAY", { providedIn: "root", factory: () => {
  const gateway = inject(SolicitudesHttpGateway);
  return gateway.disponible ? gateway : null;
} });
var IntegracionSolicitudesPendiente = class extends Error {
  constructor() {
    super("El servicio de Solicitudes no est\xE1 disponible: faltan habilitar las rutas protegidas del backend. No se ha guardado informaci\xF3n.");
  }
};
function mensajeSolicitudes(error) {
  if (error instanceof HttpErrorResponse)
    return mensajeSolicitudes(aErrorApi(error));
  if (typeof error === "object" && error !== null && "status" in error) {
    if ("codigo" in error && error.codigo === "SOLICITUD_AREA_NO_AUTORIZADA")
      return "El \xE1rea seleccionada ya no est\xE1 autorizada para tu usuario. Consulta tus \xE1reas habilitadas nuevamente.";
    if ("codigo" in error && error.codigo === "SOLICITUD_SIN_AREA_VIGENTE")
      return "No tienes un \xE1rea habilitada para registrar solicitudes";
    if (error.status === 401)
      return "Sesi\xF3n no autenticada o caducada. Inicia sesi\xF3n para continuar.";
    if (error.status === 403)
      return "Laravel rechaz\xF3 el acceso (403). " + ("mensaje" in error && typeof error.mensaje === "string" ? error.mensaje : "No tienes permiso para realizar esta operaci\xF3n en el \xE1mbito solicitado.");
    if (error.status === 0)
      return "No se pudo conectar con el servidor. Comprueba la conexi\xF3n.";
    if (error.status === 404)
      return "La solicitud no existe o ya no est\xE1 disponible para tu sesi\xF3n.";
    if (error.status === 409)
      return "La solicitud cambi\xF3 o la transici\xF3n ya no es compatible. Actualiza los datos antes de reintentar.";
    if (typeof error.status === "number" && error.status >= 500)
      return "No se pudo completar la operaci\xF3n en el servidor. El servicio est\xE1 temporalmente no disponible. Intenta nuevamente.";
  }
  if (error instanceof Error)
    return error.message;
  if (typeof error === "object" && error !== null && "mensaje" in error && typeof error.mensaje === "string")
    return error.mensaje;
  return "No fue posible completar la operaci\xF3n. Comprueba la conexi\xF3n y tus permisos.";
}
var SolicitudesService = class _SolicitudesService {
  cambios = new Subject();
  cambios$ = this.cambios.asObservable();
  gateway = inject(SOLICITUDES_GATEWAY);
  integrado = this.gateway !== null;
  modo = this.integrado ? "api" : "pendiente";
  accionesPermitidas(fila) {
    return this.gateway ? this.gateway.accionesPermitidas?.(fila) ?? fila.acciones : [];
  }
  ejecutar(operacion) {
    return defer(() => this.gateway ? operacion(this.gateway) : throwError(() => new IntegracionSolicitudesPendiente()));
  }
  contexto() {
    return this.ejecutar((api) => api.contexto());
  }
  listar(bandeja, filtro) {
    return this.ejecutar((api) => api.listar(bandeja, filtro));
  }
  detalle(id, administrativo = false) {
    return this.ejecutar((api) => api.detalle(id, administrativo));
  }
  guardar(datos, existente) {
    return this.ejecutar((api) => api.guardar(datos, existente));
  }
  decidir(id, version, accion, motivo) {
    return this.ejecutar((api) => api.decidir(id, version, accion, motivo)).pipe(tap((fila) => this.cambios.next(fila)));
  }
  puedeConsultarHistorial(id) {
    return this.gateway?.puedeConsultarHistorial?.(id) === true;
  }
  historialSolicitud(id) {
    return this.ejecutar((api) => api.historialSolicitud?.(id) ?? throwError(() => new IntegracionSolicitudesPendiente()));
  }
  documentos(pagina) {
    return this.ejecutar((api) => api.documentos(pagina));
  }
  documento(id) {
    return this.ejecutar((api) => api.documento(id));
  }
  static \u0275fac = function SolicitudesService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SolicitudesService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SolicitudesService, factory: _SolicitudesService.\u0275fac, providedIn: "root" });
};

// src/app/pages/solicitudes/compartidos/integracion-aviso.component.ts
function IntegracionAvisoComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 0);
    \u0275\u0275text(1, "Servicio de Solicitudes pendiente de habilitaci\xF3n. Las consultas, el guardado, el env\xEDo y las decisiones no est\xE1n disponibles. No se ha registrado informaci\xF3n.");
    \u0275\u0275elementEnd();
  }
}
var IntegracionAvisoComponent = class _IntegracionAvisoComponent {
  api = inject(SolicitudesService);
  static \u0275fac = function IntegracionAvisoComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _IntegracionAvisoComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _IntegracionAvisoComponent, selectors: [["app-integracion-solicitudes"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 1, vars: 1, consts: [["role", "status", 1, "aviso"]], template: function IntegracionAvisoComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275template(0, IntegracionAvisoComponent_Conditional_0_Template, 2, 0, "p", 0);
    }
    if (rf & 2) {
      \u0275\u0275conditional(!ctx.api.integrado ? 0 : -1);
    }
  }, styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\n.encabezado[_ngcontent-%COMP%], \n.acciones[_ngcontent-%COMP%], \n.paginacion[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  flex-wrap: wrap;\n  gap: 0.75rem;\n  margin: 1rem 0;\n}\n.acciones[_ngcontent-%COMP%] {\n  justify-content: flex-start;\n}\n.indicadores[_ngcontent-%COMP%], \n.documentos[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));\n  gap: 1rem;\n  margin: 1.5rem 0;\n}\n.indicador[_ngcontent-%COMP%] {\n  border-top: 3px solid #075a9b;\n}\n.indicador[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  display: block;\n  color: #075a9b;\n  font-size: 1.65rem;\n}\n.indicador[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.25rem 0;\n}\n.filtros[_ngcontent-%COMP%], \n.form-grid[_ngcontent-%COMP%], \n.detalle[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));\n  gap: 1rem;\n}\n.form-grid[_ngcontent-%COMP%] {\n  margin: 1rem 0;\n}\n.filtros-personales[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(0, 36rem);\n  margin-block: 1rem;\n}\n.filtros-personales[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%] {\n  margin-bottom: 0;\n}\n.titulo-y-descripcion[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n}\n.fila-titulo[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n  flex-wrap: wrap;\n}\n.acciones-cabecera[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  flex-wrap: nowrap;\n  gap: 0.5rem;\n  max-width: 100%;\n  min-width: 0;\n  margin-inline-start: auto;\n}\n.boton-busqueda[_ngcontent-%COMP%] {\n  color: #075a9b;\n  padding: 0.65rem;\n}\n.busqueda-desplegable[_ngcontent-%COMP%] {\n  position: absolute;\n  inset-inline-end: calc(100% + 0.5rem);\n  top: 50%;\n  transform: translateY(-50%);\n  z-index: 1;\n  display: flex;\n  align-items: center;\n  width: clamp(7rem, 24vw, 22rem);\n  min-width: 0;\n}\n@media (max-width: 600px) {\n  .busqueda-desplegable[_ngcontent-%COMP%] {\n    width: min(11rem, 100vw - 14rem);\n  }\n}\n.busqueda-desplegable[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  overflow: hidden;\n  clip-path: inset(50%);\n}\n.busqueda-desplegable[hidden][_ngcontent-%COMP%] {\n  display: none;\n}\n.busqueda-desplegable[_ngcontent-%COMP%]:not([hidden]) {\n  animation: _ngcontent-%COMP%_desplegar-busqueda 0.2s ease-out;\n}\n@keyframes _ngcontent-%COMP%_desplegar-busqueda {\n  from {\n    clip-path: inset(0 0 0 100%);\n  }\n  to {\n    clip-path: inset(0);\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .busqueda-desplegable[_ngcontent-%COMP%]:not([hidden]) {\n    animation: none;\n  }\n}\n.busqueda-desplegable[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%] {\n  flex: 1;\n  margin: 0;\n}\n.indicadores-compactos[_ngcontent-%COMP%] {\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 0.75rem;\n  margin: 1rem 0;\n}\n.indicadores-compactos[_ngcontent-%COMP%]   .indicador[_ngcontent-%COMP%] {\n  padding: 0.75rem 1rem;\n  margin: 0;\n}\n.indicadores-compactos[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 1.4rem;\n  line-height: 1.2;\n}\n.indicadores-compactos[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  margin: 0.25rem 0 0;\n}\n.busqueda-con-icono[_ngcontent-%COMP%] {\n  position: relative;\n}\n.busqueda-con-icono[_ngcontent-%COMP%]    > .material-symbols-outlined[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 0.85rem;\n  top: 50%;\n  transform: translateY(-50%);\n  color: #075a9b;\n  pointer-events: none;\n}\n.busqueda-con-icono[_ngcontent-%COMP%]    > .input[_ngcontent-%COMP%] {\n  padding-inline-start: 2.75rem;\n}\n.ancho[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\n.tabla-scroll[_ngcontent-%COMP%] {\n  overflow-x: auto;\n  max-width: 100%;\n}\n.table[_ngcontent-%COMP%] {\n  min-width: 55rem;\n}\n.table[_ngcontent-%COMP%]   caption[_ngcontent-%COMP%] {\n  text-align: left;\n  padding: 0.75rem 0;\n  color: #526170;\n}\n.table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  vertical-align: top;\n}\n.table[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  display: block;\n  margin-top: 0.3rem;\n}\n.table[_ngcontent-%COMP%]   .acciones[_ngcontent-%COMP%] {\n  margin: 0;\n  min-width: 12rem;\n}\n.detalle[_ngcontent-%COMP%] {\n  margin: 1rem 0;\n}\n.detalle[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.detalle[_ngcontent-%COMP%]   dt[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: #075a9b;\n}\n.detalle[_ngcontent-%COMP%]   dd[_ngcontent-%COMP%] {\n  margin: 0.3rem 0 1rem;\n  white-space: pre-wrap;\n  overflow-wrap: anywhere;\n}\n.error[_ngcontent-%COMP%] {\n  color: #a52d2d;\n  margin: 0.35rem 0;\n}\n.aviso[_ngcontent-%COMP%] {\n  padding: 0.8rem;\n  border: 1px solid #b5cad9;\n  background: #f0f7fb;\n  border-radius: 0.4rem;\n  margin-bottom: 1rem;\n}\n.vacio[_ngcontent-%COMP%] {\n  padding: 2rem 1rem;\n  text-align: center;\n  color: #526170;\n}\n.encabezado-pagina[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 1rem;\n  align-items: center;\n  margin-bottom: 1rem;\n}\n.encabezado-pagina[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], \n.ayuda[_ngcontent-%COMP%] {\n  color: #64748b;\n  margin: 0.25rem 0;\n  font-size: 0.9rem;\n}\n.icono-pagina[_ngcontent-%COMP%] {\n  box-sizing: content-box;\n  flex-shrink: 0;\n  color: #075a9b;\n  background: #eaf3fa;\n  border-radius: 0.75rem;\n  padding: 0.75rem;\n}\n.form-field[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.form-field[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: block;\n  font-weight: 600;\n  margin-bottom: 0.45rem;\n}\n.form-field[_ngcontent-%COMP%]   .input[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n}\n.form-field[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 0.8rem;\n  color: #64748b;\n  margin-top: 0.4rem;\n}\n.visor-documento[_ngcontent-%COMP%] {\n  width: 100%;\n  min-height: 60vh;\n  border: 1px solid #075a9b;\n  background: #fff;\n}\n@media (max-width: 600px) {\n  .indicadores-compactos[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .encabezado[_ngcontent-%COMP%] {\n    align-items: stretch;\n  }\n  .filtros[_ngcontent-%COMP%], \n   .form-grid[_ngcontent-%COMP%], \n   .detalle[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .acciones[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n    flex: 1 1 auto;\n  }\n  .card[_ngcontent-%COMP%] {\n    padding: 1rem;\n  }\n  .icono-pagina[_ngcontent-%COMP%] {\n    display: none;\n  }\n}\n/*# sourceMappingURL=solicitudes.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(IntegracionAvisoComponent, { className: "IntegracionAvisoComponent", filePath: "src\\app\\pages\\solicitudes\\compartidos\\integracion-aviso.component.ts", lineNumber: 8 });
})();

// src/app/pages/solicitudes/compartidos/solicitud-estado-badge.component.ts
var SolicitudEstadoBadgeComponent = class _SolicitudEstadoBadgeComponent {
  estado = input.required();
  revision = input(false);
  static \u0275fac = function SolicitudEstadoBadgeComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SolicitudEstadoBadgeComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SolicitudEstadoBadgeComponent, selectors: [["app-solicitud-estado-badge"]], inputs: { estado: [1, "estado"], revision: [1, "revision"] }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 2, vars: 2, consts: [[1, "estado"]], template: function SolicitudEstadoBadgeComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "span", 0);
      \u0275\u0275text(1);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275attribute("data-estado", ctx.estado());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.revision() && ctx.estado() === "Enviada" ? "Pendiente de revisi\xF3n" : ctx.estado());
    }
  }, styles: ['@charset "UTF-8";\n\n\n\n.estado[_ngcontent-%COMP%] {\n  display: inline-block;\n  padding: 0.25rem 0.65rem;\n  border-radius: 1rem;\n  font-size: 0.85rem;\n  font-weight: 600;\n  background: #eef1f5;\n  color: #344454;\n}\n.estado[data-estado=Enviada][_ngcontent-%COMP%], \n.estado[data-estado="En revisi\\f3n"][_ngcontent-%COMP%] {\n  background: #e5f1ff;\n  color: #075a9b;\n}\n.estado[data-estado="Pendiente de aprobaci\\f3n"][_ngcontent-%COMP%] {\n  background: #eee8fa;\n  color: #65408a;\n}\n.estado[data-estado=Observada][_ngcontent-%COMP%] {\n  background: #fff3d3;\n  color: #79551a;\n}\n.estado[data-estado=Aprobada][_ngcontent-%COMP%] {\n  background: #e4f4eb;\n  color: #236641;\n}\n.estado[data-estado=Rechazada][_ngcontent-%COMP%] {\n  background: #fce9e9;\n  color: #9b3030;\n}\n/*# sourceMappingURL=solicitud-estado-badge.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SolicitudEstadoBadgeComponent, { className: "SolicitudEstadoBadgeComponent", filePath: "src\\app\\pages\\solicitudes\\compartidos\\solicitud-estado-badge.component.ts", lineNumber: 7 });
})();

// src/app/pages/solicitudes/compartidos/solicitud-detalle.component.ts
var _forTrack0 = ($index, $item) => $item.id_solicitud_decision;
var _c0 = (a0) => ({ actividad: a0 });
function SolicitudDetalleComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p")(1, "strong");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "app-solicitud-estado-badge", 5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p");
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "date");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const fila_r1 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(fila_r1.numero);
    \u0275\u0275advance();
    \u0275\u0275property("estado", fila_r1.estado)("revision", ctx_r1.revision());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Fecha de solicitud: ", \u0275\u0275pipeBind2(6, 4, fila_r1.fecha, "dd/MM/yyyy HH:mm"), "");
  }
}
function SolicitudDetalleComponent_Conditional_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "dt");
    \u0275\u0275text(2, "Lugar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "dd");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.datos().lugar);
  }
}
function SolicitudDetalleComponent_Conditional_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "dt");
    \u0275\u0275text(2, "Responsable de revisi\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "dd");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div")(6, "dt");
    \u0275\u0275text(7, "Resultado de RR. HH.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "dd");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 1)(11, "dt");
    \u0275\u0275text(12, "\xDAltima observaci\xF3n autorizada");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "dd");
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const fila_r3 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.textoRevisor(fila_r3));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(fila_r3.resultadoRevision || "Consultar historial autorizado");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(fila_r3.ultimaObservacion || "Consultar historial autorizado");
  }
}
function SolicitudDetalleComponent_Conditional_46_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 6);
    \u0275\u0275text(1, "Consultar actividad");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const actividadId_r4 = \u0275\u0275nextContext();
    \u0275\u0275property("queryParams", \u0275\u0275pureFunction1(1, _c0, actividadId_r4));
  }
}
function SolicitudDetalleComponent_Conditional_46_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "dt");
    \u0275\u0275text(2, "Actividad vinculada");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "dd");
    \u0275\u0275text(4);
    \u0275\u0275template(5, SolicitudDetalleComponent_Conditional_46_Conditional_5_Template, 2, 3, "a", 6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("Actividad #", ctx, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.puedeVerActividad() ? 5 : -1);
  }
}
function SolicitudDetalleComponent_Conditional_47_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 2)(1, "h3");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p");
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "date");
    \u0275\u0275pipe(8, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const actividad_r5 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(actividad_r5.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("\xC1rea: ", actividad_r5.id_area.toString() === ctx_r1.datos().areaId ? ctx_r1.area() : "\xC1rea #" + actividad_r5.id_area, " \xB7 Tipo: ", actividad_r5.id_tipo_actividad.toString() === ctx_r1.datos().tipoId ? ctx_r1.tipo() : "Tipo #" + actividad_r5.id_tipo_actividad, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate3("", \u0275\u0275pipeBind2(7, 7, actividad_r5.fecha_inicio, "dd/MM/yyyy"), " \u2013 ", \u0275\u0275pipeBind2(8, 10, actividad_r5.fecha_fin, "dd/MM/yyyy"), " \xB7 Estado: ", actividad_r5.estado, "");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("Origen: ", actividad_r5.origen || "No informado por el servidor", "");
  }
}
function SolicitudDetalleComponent_Conditional_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 3);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.errorActividad());
  }
}
function SolicitudDetalleComponent_Conditional_49_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 10);
    \u0275\u0275listener("click", function SolicitudDetalleComponent_Conditional_49_Conditional_3_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.consultarHistorial());
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r1.cargandoHistorial());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.historial() === null ? "Consultar historial" : "Actualizar historial");
  }
}
function SolicitudDetalleComponent_Conditional_49_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "La consulta del historial requiere autorizaci\xF3n.");
    \u0275\u0275elementEnd();
  }
}
function SolicitudDetalleComponent_Conditional_49_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 8);
    \u0275\u0275text(1, "Consultando historial\u2026");
    \u0275\u0275elementEnd();
  }
}
function SolicitudDetalleComponent_Conditional_49_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 9);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.errorHistorial());
  }
}
function SolicitudDetalleComponent_Conditional_49_Conditional_7_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article")(1, "h4");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p");
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p");
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const decision_r7 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.etiquetaDecision(decision_r7));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", decision_r7.estado_anterior, " \u2192 ", decision_r7.estado_nuevo, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Responsable de la decisi\xF3n: ", decision_r7.responsable_nombre || "Usuario #" + decision_r7.id_usuario_responsable, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Fecha: ", \u0275\u0275pipeBind2(9, 6, decision_r7.fecha_decision, "dd/MM/yyyy HH:mm"), "");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Observaci\xF3n: ", decision_r7.observacion || "Sin observaci\xF3n registrada", "");
  }
}
function SolicitudDetalleComponent_Conditional_49_Conditional_7_ForEmpty_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "No hay decisiones registradas.");
    \u0275\u0275elementEnd();
  }
}
function SolicitudDetalleComponent_Conditional_49_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, SolicitudDetalleComponent_Conditional_49_Conditional_7_For_1_Template, 12, 9, "article", null, _forTrack0, false, SolicitudDetalleComponent_Conditional_49_Conditional_7_ForEmpty_2_Template, 2, 0, "p");
  }
  if (rf & 2) {
    \u0275\u0275repeater(ctx);
  }
}
function SolicitudDetalleComponent_Conditional_49_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 4)(1, "h3");
    \u0275\u0275text(2, "Historial de revisi\xF3n y decisiones");
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, SolicitudDetalleComponent_Conditional_49_Conditional_3_Template, 2, 2, "button", 7)(4, SolicitudDetalleComponent_Conditional_49_Conditional_4_Template, 2, 0, "p")(5, SolicitudDetalleComponent_Conditional_49_Conditional_5_Template, 2, 0, "p", 8)(6, SolicitudDetalleComponent_Conditional_49_Conditional_6_Template, 2, 1, "p", 9)(7, SolicitudDetalleComponent_Conditional_49_Conditional_7_Template, 3, 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_5_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.api.puedeConsultarHistorial(ctx.id) ? 3 : 4);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.cargandoHistorial() ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.errorHistorial() ? 6 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_5_0 = ctx_r1.historial()) ? 7 : -1, tmp_5_0);
  }
}
var SolicitudDetalleComponent = class _SolicitudDetalleComponent {
  api = inject(SolicitudesService);
  auth = inject(AuthService, { optional: true });
  destroyRef = inject(DestroyRef);
  historial = signal(null);
  cargandoHistorial = signal(false);
  errorHistorial = signal(null);
  consulta;
  consultaActividad;
  actividades = inject(ActividadesService);
  actividadVinculada = signal(null);
  errorActividad = signal(null);
  ngOnChanges() {
    this.consultaActividad?.unsubscribe();
    this.actividadVinculada.set(null);
    this.errorActividad.set(null);
    const id = this.registro()?.actividadId;
    if (id && this.puedeVerActividad()) {
      this.consultaActividad = this.actividades.obtener(Number(id)).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (actividad) => this.actividadVinculada.set(actividad),
        error: () => this.errorActividad.set("No se pudo consultar la actividad vinculada. Puedes reintentar desde Consultar actividad.")
      });
    }
    this.consulta?.unsubscribe();
    this.historial.set(null);
    this.errorHistorial.set(null);
    this.cargandoHistorial.set(false);
  }
  puedeVerActividad() {
    return this.auth?.tienePermiso("actividades.ver") === true;
  }
  etiquetaDecision(fila) {
    return { REVISION_CONFORME: "Revisi\xF3n conforme", OBSERVAR: "Observaci\xF3n", DERIVAR_GERENCIA: "Derivaci\xF3n a Gerencia", APROBAR: "Aprobaci\xF3n de Gerencia", RECHAZAR: "Rechazo de Gerencia" }[fila.tipo_decision];
  }
  consultarHistorial() {
    const fila = this.registro();
    if (!fila || this.cargandoHistorial() || !this.api.puedeConsultarHistorial(fila.id))
      return;
    this.errorHistorial.set(null);
    this.historial.set(null);
    this.cargandoHistorial.set(true);
    this.consulta = this.api.historialSolicitud(fila.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (decisiones) => {
        this.historial.set(decisiones);
        this.cargandoHistorial.set(false);
      },
      error: (error) => {
        this.errorHistorial.set(mensajeSolicitudes(error));
        this.cargandoHistorial.set(false);
      }
    });
  }
  textoRevisor = textoRevisorSolicitud;
  revision = input(false);
  mostrarSede = input(true);
  datos = input.required();
  area = input.required();
  responsable = input.required();
  tipo = input.required();
  registro = input(null);
  static \u0275fac = function SolicitudDetalleComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SolicitudDetalleComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SolicitudDetalleComponent, selectors: [["app-solicitud-detalle"]], inputs: { revision: [1, "revision"], mostrarSede: [1, "mostrarSede"], datos: [1, "datos"], area: [1, "area"], responsable: [1, "responsable"], tipo: [1, "tipo"], registro: [1, "registro"] }, standalone: true, features: [\u0275\u0275NgOnChangesFeature, \u0275\u0275StandaloneFeature], decls: 50, vars: 21, consts: [[1, "detalle"], [1, "ancho"], ["aria-label", "Actividad vinculada"], ["role", "alert"], ["aria-label", "Historial de revisi\xF3n y decisiones"], [3, "estado", "revision"], ["routerLink", "/certificaciones/actividades", 3, "queryParams"], ["type", "button", 1, "btn", 3, "disabled"], ["role", "status"], ["role", "alert", 1, "error"], ["type", "button", 1, "btn", 3, "click", "disabled"]], template: function SolicitudDetalleComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275template(0, SolicitudDetalleComponent_Conditional_0_Template, 7, 7);
      \u0275\u0275elementStart(1, "dl", 0)(2, "div")(3, "dt");
      \u0275\u0275text(4, "\xC1rea solicitante");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "dd");
      \u0275\u0275text(6);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(7, "div")(8, "dt");
      \u0275\u0275text(9, "Responsable solicitante");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "dd");
      \u0275\u0275text(11);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(12, "div")(13, "dt");
      \u0275\u0275text(14, "Actividad");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "dd");
      \u0275\u0275text(16);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(17, "div")(18, "dt");
      \u0275\u0275text(19, "Tipo de actividad");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(20, "dd");
      \u0275\u0275text(21);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(22, "div")(23, "dt");
      \u0275\u0275text(24, "Fecha de inicio");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "dd");
      \u0275\u0275text(26);
      \u0275\u0275pipe(27, "date");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(28, "div")(29, "dt");
      \u0275\u0275text(30, "Fecha de fin");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(31, "dd");
      \u0275\u0275text(32);
      \u0275\u0275pipe(33, "date");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(34, SolicitudDetalleComponent_Conditional_34_Template, 5, 1, "div");
      \u0275\u0275elementStart(35, "div", 1)(36, "dt");
      \u0275\u0275text(37, "Descripci\xF3n");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(38, "dd");
      \u0275\u0275text(39);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(40, "div", 1)(41, "dt");
      \u0275\u0275text(42, "Objetivo o justificaci\xF3n");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(43, "dd");
      \u0275\u0275text(44);
      \u0275\u0275elementEnd()();
      \u0275\u0275template(45, SolicitudDetalleComponent_Conditional_45_Template, 15, 3)(46, SolicitudDetalleComponent_Conditional_46_Template, 6, 2, "div");
      \u0275\u0275elementEnd();
      \u0275\u0275template(47, SolicitudDetalleComponent_Conditional_47_Template, 11, 13, "section", 2)(48, SolicitudDetalleComponent_Conditional_48_Template, 2, 1, "p", 3)(49, SolicitudDetalleComponent_Conditional_49_Template, 8, 4, "section", 4);
    }
    if (rf & 2) {
      let tmp_0_0;
      let tmp_10_0;
      let tmp_11_0;
      let tmp_12_0;
      let tmp_14_0;
      \u0275\u0275conditional((tmp_0_0 = ctx.registro()) ? 0 : -1, tmp_0_0);
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate(ctx.area());
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(ctx.responsable());
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(ctx.datos().nombre);
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(ctx.tipo());
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(27, 15, ctx.datos().inicio, "dd/MM/yyyy"));
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(33, 18, ctx.datos().fin, "dd/MM/yyyy"));
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.mostrarSede() ? 34 : -1);
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(ctx.datos().descripcion);
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(ctx.datos().objetivo);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_10_0 = ctx.registro()) ? 45 : -1, tmp_10_0);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_11_0 = (tmp_11_0 = ctx.registro()) == null ? null : tmp_11_0.actividadId) ? 46 : -1, tmp_11_0);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_12_0 = ctx.actividadVinculada()) ? 47 : -1, tmp_12_0);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.errorActividad() ? 48 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_14_0 = ctx.registro()) ? 49 : -1, tmp_14_0);
    }
  }, dependencies: [DatePipe, RouterLink, SolicitudEstadoBadgeComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\n.encabezado[_ngcontent-%COMP%], \n.acciones[_ngcontent-%COMP%], \n.paginacion[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  flex-wrap: wrap;\n  gap: 0.75rem;\n  margin: 1rem 0;\n}\n.acciones[_ngcontent-%COMP%] {\n  justify-content: flex-start;\n}\n.indicadores[_ngcontent-%COMP%], \n.documentos[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));\n  gap: 1rem;\n  margin: 1.5rem 0;\n}\n.indicador[_ngcontent-%COMP%] {\n  border-top: 3px solid #075a9b;\n}\n.indicador[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  display: block;\n  color: #075a9b;\n  font-size: 1.65rem;\n}\n.indicador[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.25rem 0;\n}\n.filtros[_ngcontent-%COMP%], \n.form-grid[_ngcontent-%COMP%], \n.detalle[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));\n  gap: 1rem;\n}\n.form-grid[_ngcontent-%COMP%] {\n  margin: 1rem 0;\n}\n.filtros-personales[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(0, 36rem);\n  margin-block: 1rem;\n}\n.filtros-personales[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%] {\n  margin-bottom: 0;\n}\n.titulo-y-descripcion[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n}\n.fila-titulo[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n  flex-wrap: wrap;\n}\n.acciones-cabecera[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  flex-wrap: nowrap;\n  gap: 0.5rem;\n  max-width: 100%;\n  min-width: 0;\n  margin-inline-start: auto;\n}\n.boton-busqueda[_ngcontent-%COMP%] {\n  color: #075a9b;\n  padding: 0.65rem;\n}\n.busqueda-desplegable[_ngcontent-%COMP%] {\n  position: absolute;\n  inset-inline-end: calc(100% + 0.5rem);\n  top: 50%;\n  transform: translateY(-50%);\n  z-index: 1;\n  display: flex;\n  align-items: center;\n  width: clamp(7rem, 24vw, 22rem);\n  min-width: 0;\n}\n@media (max-width: 600px) {\n  .busqueda-desplegable[_ngcontent-%COMP%] {\n    width: min(11rem, 100vw - 14rem);\n  }\n}\n.busqueda-desplegable[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  overflow: hidden;\n  clip-path: inset(50%);\n}\n.busqueda-desplegable[hidden][_ngcontent-%COMP%] {\n  display: none;\n}\n.busqueda-desplegable[_ngcontent-%COMP%]:not([hidden]) {\n  animation: _ngcontent-%COMP%_desplegar-busqueda 0.2s ease-out;\n}\n@keyframes _ngcontent-%COMP%_desplegar-busqueda {\n  from {\n    clip-path: inset(0 0 0 100%);\n  }\n  to {\n    clip-path: inset(0);\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .busqueda-desplegable[_ngcontent-%COMP%]:not([hidden]) {\n    animation: none;\n  }\n}\n.busqueda-desplegable[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%] {\n  flex: 1;\n  margin: 0;\n}\n.indicadores-compactos[_ngcontent-%COMP%] {\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 0.75rem;\n  margin: 1rem 0;\n}\n.indicadores-compactos[_ngcontent-%COMP%]   .indicador[_ngcontent-%COMP%] {\n  padding: 0.75rem 1rem;\n  margin: 0;\n}\n.indicadores-compactos[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 1.4rem;\n  line-height: 1.2;\n}\n.indicadores-compactos[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  margin: 0.25rem 0 0;\n}\n.busqueda-con-icono[_ngcontent-%COMP%] {\n  position: relative;\n}\n.busqueda-con-icono[_ngcontent-%COMP%]    > .material-symbols-outlined[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 0.85rem;\n  top: 50%;\n  transform: translateY(-50%);\n  color: #075a9b;\n  pointer-events: none;\n}\n.busqueda-con-icono[_ngcontent-%COMP%]    > .input[_ngcontent-%COMP%] {\n  padding-inline-start: 2.75rem;\n}\n.ancho[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\n.tabla-scroll[_ngcontent-%COMP%] {\n  overflow-x: auto;\n  max-width: 100%;\n}\n.table[_ngcontent-%COMP%] {\n  min-width: 55rem;\n}\n.table[_ngcontent-%COMP%]   caption[_ngcontent-%COMP%] {\n  text-align: left;\n  padding: 0.75rem 0;\n  color: #526170;\n}\n.table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  vertical-align: top;\n}\n.table[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  display: block;\n  margin-top: 0.3rem;\n}\n.table[_ngcontent-%COMP%]   .acciones[_ngcontent-%COMP%] {\n  margin: 0;\n  min-width: 12rem;\n}\n.detalle[_ngcontent-%COMP%] {\n  margin: 1rem 0;\n}\n.detalle[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.detalle[_ngcontent-%COMP%]   dt[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: #075a9b;\n}\n.detalle[_ngcontent-%COMP%]   dd[_ngcontent-%COMP%] {\n  margin: 0.3rem 0 1rem;\n  white-space: pre-wrap;\n  overflow-wrap: anywhere;\n}\n.error[_ngcontent-%COMP%] {\n  color: #a52d2d;\n  margin: 0.35rem 0;\n}\n.aviso[_ngcontent-%COMP%] {\n  padding: 0.8rem;\n  border: 1px solid #b5cad9;\n  background: #f0f7fb;\n  border-radius: 0.4rem;\n  margin-bottom: 1rem;\n}\n.vacio[_ngcontent-%COMP%] {\n  padding: 2rem 1rem;\n  text-align: center;\n  color: #526170;\n}\n.encabezado-pagina[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 1rem;\n  align-items: center;\n  margin-bottom: 1rem;\n}\n.encabezado-pagina[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], \n.ayuda[_ngcontent-%COMP%] {\n  color: #64748b;\n  margin: 0.25rem 0;\n  font-size: 0.9rem;\n}\n.icono-pagina[_ngcontent-%COMP%] {\n  box-sizing: content-box;\n  flex-shrink: 0;\n  color: #075a9b;\n  background: #eaf3fa;\n  border-radius: 0.75rem;\n  padding: 0.75rem;\n}\n.form-field[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.form-field[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: block;\n  font-weight: 600;\n  margin-bottom: 0.45rem;\n}\n.form-field[_ngcontent-%COMP%]   .input[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n}\n.form-field[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 0.8rem;\n  color: #64748b;\n  margin-top: 0.4rem;\n}\n.visor-documento[_ngcontent-%COMP%] {\n  width: 100%;\n  min-height: 60vh;\n  border: 1px solid #075a9b;\n  background: #fff;\n}\n@media (max-width: 600px) {\n  .indicadores-compactos[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .encabezado[_ngcontent-%COMP%] {\n    align-items: stretch;\n  }\n  .filtros[_ngcontent-%COMP%], \n   .form-grid[_ngcontent-%COMP%], \n   .detalle[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .acciones[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n    flex: 1 1 auto;\n  }\n  .card[_ngcontent-%COMP%] {\n    padding: 1rem;\n  }\n  .icono-pagina[_ngcontent-%COMP%] {\n    display: none;\n  }\n}\n/*# sourceMappingURL=solicitudes.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SolicitudDetalleComponent, { className: "SolicitudDetalleComponent", filePath: "src\\app\\pages\\solicitudes\\compartidos\\solicitud-detalle.component.ts", lineNumber: 70 });
})();

export {
  ESTADOS_SOLICITUD,
  textoRevisorSolicitud,
  ActivityRequestsApiService,
  mensajeSolicitudes,
  SolicitudesService,
  IntegracionAvisoComponent,
  SolicitudEstadoBadgeComponent,
  SolicitudDetalleComponent
};
//# sourceMappingURL=chunk-RMBF477B.js.map
