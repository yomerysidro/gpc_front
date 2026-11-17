import {
  PersonSpeakerService
} from "./chunk-4VYBOJPK.js";
import {
  PersonService
} from "./chunk-C4J44J4Z.js";
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
  HttpErrorResponse
} from "./chunk-IJ23LC2U.js";
import {
  catchError,
  forkJoin,
  inject,
  map,
  of,
  switchMap,
  throwError,
  ɵɵdefineInjectable
} from "./chunk-3ZDGBTDF.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-ZX6IUAQ5.js";

// src/app/core/services/actividades/actividades.service.ts
var ActividadesService = class _ActividadesService {
  catalogoPonentes = inject(PersonSpeakerService);
  personas = inject(PersonService);
  http = inject(HttpClient);
  api = environment.apiBaseUrl;
  listar() {
    return this.obtenerDatos("/activity");
  }
  obtener(id) {
    return this.obtenerDatos(`/activity/${id}`);
  }
  listarAsignacionesPonentes() {
    return this.obtenerDatos("/activity-speaker");
  }
  listarAreas() {
    return this.obtenerDatos("/areas/list").pipe(map((areas) => {
      if (!Array.isArray(areas) || areas.some((area) => !Number.isSafeInteger(area.id_area) || area.id_area < 1 || typeof area.nombre !== "string")) {
        throw { status: 502, mensaje: "El servidor no devolvi\xF3 un cat\xE1logo de \xE1reas v\xE1lido.", errores: {} };
      }
      return areas;
    }));
  }
  listarTipos() {
    return this.obtenerDatos("/ativicty-type");
  }
  /** @deprecated Utilizar Solicitudes; nunca envia POST /activity. */
  crear(_payload) {
    return throwError(() => ({ status: 403, mensaje: "Registra una solicitud de actividad para su aprobacion.", errores: {} }));
  }
  actualizar(id, payload) {
    return this.http.put(`${this.api}/activity/${id}`, this.payload(payload), this.opciones()).pipe(catchError((error) => throwError(() => errorActividad(error))));
  }
  eliminar(id) {
    return this.http.delete(`${this.api}/activity/${id}`, this.opciones()).pipe(catchError((error) => throwError(() => errorActividad(error))));
  }
  cambiarEstado(id, estado) {
    return this.http.patch(`${this.api}/activity/${id}`, { estado }, this.opciones()).pipe(map((respuesta) => {
      if (!respuesta.success || respuesta.data?.id_actividad !== id || respuesta.data.estado !== estado) {
        throw new HttpErrorResponse({ status: 502, error: { message: "Laravel no confirm\xF3 el cambio de estado." } });
      }
      return respuesta;
    })).pipe(catchError((error) => throwError(() => errorActividad(error))));
  }
  consultarPonentes(idActividad) {
    return this.obtenerDatos("/activity-speaker").pipe(map((asignaciones) => asignaciones.filter((item) => item.id_actividad === idActividad)), switchMap((asignaciones) => asignaciones.length ? forkJoin(asignaciones.map((asignacion) => this.resolverPonente(asignacion))) : of([])));
  }
  listarCatalogoPonentes() {
    return this.catalogoPonentes.listar().pipe(switchMap((ponentes) => this.personas.listar().pipe(map((personas) => ponentes.map((ponente) => {
      const persona = personas.find((item) => item.id_persona === ponente.id_persona);
      return {
        id_persona_ponente: ponente.id_persona_ponente,
        nombre: persona ? [persona.nombres, persona.apellido_paterno, persona.apellido_materno].filter(Boolean).join(" ") : `Ponente #${ponente.id_persona_ponente}`
      };
    })))), catchError((error) => throwError(() => errorActividad(error))));
  }
  vincularPonente(idActividad, idPonente) {
    return this.http.post(`${this.api}/activity-speaker`, { id_actividad: idActividad, id_persona_ponente: idPonente }, this.opciones()).pipe(map((respuesta) => {
      if (!respuesta.success || !respuesta.data?.id_actividad_ponente)
        throw new HttpErrorResponse({ status: 502, error: { message: "Laravel no confirm\xF3 la asignaci\xF3n." } });
      return respuesta;
    }), catchError((error) => throwError(() => errorActividad(error))));
  }
  desvincularPonente(idAsignacion) {
    return this.http.delete(`${this.api}/activity-speaker/${idAsignacion}`, this.opciones()).pipe(map((respuesta) => {
      if (!respuesta.success)
        throw new HttpErrorResponse({ status: 502, error: { message: respuesta.message } });
      return respuesta;
    }), catchError((error) => throwError(() => errorActividad(error))));
  }
  resolverPonente(asignacion) {
    return this.obtenerDatos(`/person-speakers/detail/${asignacion.id_persona_ponente}`).pipe(
      switchMap((ponente) => this.obtenerDatos(`/persons/detail/${ponente.id_persona}`)),
      map((persona) => __spreadProps(__spreadValues({}, asignacion), {
        nombre: [persona.nombres, persona.apellido_paterno, persona.apellido_materno].filter(Boolean).join(" "),
        errorNombre: null
      })),
      // Un catálogo sin permiso no oculta las asignaciones que sí se pudieron consultar.
      catchError((error) => of(__spreadProps(__spreadValues({}, asignacion), { nombre: null, errorNombre: error.mensaje })))
    );
  }
  obtenerDatos(ruta) {
    return this.http.get(`${this.api}${ruta}`, this.opciones()).pipe(map((respuesta) => {
      if (!respuesta.success || respuesta.data === null || respuesta.data === void 0)
        throw new HttpErrorResponse({ status: 502, error: { message: "Laravel no confirm\xF3 la consulta." } });
      return respuesta.data;
    }), catchError((error) => throwError(() => errorActividad(error))));
  }
  payload(datos) {
    return {
      id_area: datos.id_area,
      id_tipo_actividad: datos.id_tipo_actividad,
      nombre: datos.nombre,
      descripcion: datos.descripcion,
      fecha_inicio: datos.fecha_inicio,
      fecha_fin: datos.fecha_fin,
      sede: datos.sede,
      estado: datos.estado
    };
  }
  opciones() {
    return { context: new HttpContext().set(AUTHENTICATED_REQUEST, true), withCredentials: true };
  }
  static \u0275fac = function ActividadesService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ActividadesService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ActividadesService, factory: _ActividadesService.\u0275fac, providedIn: "root" });
};
function errorActividad(error) {
  if (typeof error === "object" && error !== null && "status" in error && "mensaje" in error && "errores" in error)
    return error;
  const normalizado = aErrorApi(error);
  if (!(error instanceof HttpErrorResponse) || error.status !== 422)
    return normalizado;
  const cuerpo = error.error;
  const campos = cuerpo?.errors ?? cuerpo?.data;
  if (!campos || typeof campos !== "object" || Array.isArray(campos))
    return normalizado;
  const errores = Object.fromEntries(Object.entries(campos).map(([campo, valor]) => [
    campo,
    typeof valor === "string" ? [valor] : Array.isArray(valor) ? valor.filter((item) => typeof item === "string") : []
  ]));
  return __spreadProps(__spreadValues({}, normalizado), { errores });
}

export {
  ActividadesService
};
//# sourceMappingURL=chunk-4NQ4ZY6Y.js.map
