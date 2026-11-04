import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, switchMap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse, ErrorApi } from '../../interfaces/api/api-response.interface';
import {
  Actividad, ActividadPayload, ActividadPonente, AreaActividad,
  PersonaActividad, PersonaPonenteActividad, PonenteAsignado, TipoActividad,
} from '../../interfaces/actividades/actividad.interface';
import { AUTHENTICATED_REQUEST } from '../../security/auth-request.context';
import { aErrorApi } from '../../../shared/utils/error-api';
import { PersonSpeakerService } from '../person-speaker/person-speaker.service';
import { PersonService } from '../person/person.service';

/** Contratos leídos de routes/api.php y de los Data/Controllers de Laravel. */
@Injectable({ providedIn: 'root' })
export class ActividadesService {
  private readonly catalogoPonentes = inject(PersonSpeakerService);
  private readonly personas = inject(PersonService);
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiBaseUrl;

  listar(): Observable<readonly Actividad[]> {
    return this.obtenerDatos<readonly Actividad[]>('/activity');
  }

  obtener(id: number): Observable<Actividad> {
    return this.obtenerDatos<Actividad>(`/activity/${id}`);
  }

  listarAsignacionesPonentes(): Observable<readonly ActividadPonente[]> {
    return this.obtenerDatos<readonly ActividadPonente[]>('/activity-speaker');
  }

  listarAreas(): Observable<readonly AreaActividad[]> {
    // Catálogo de consulta/edición. La variante uso=actividades pertenece al alta deshabilitada.
    // La autorización de solicitudes sigue usando exclusivamente authorized-areas.
    return this.obtenerDatos<readonly AreaActividad[]>('/areas/list').pipe(map(areas => {
      if (!Array.isArray(areas) || areas.some(area => !Number.isSafeInteger(area.id_area) || area.id_area < 1 || typeof area.nombre !== 'string')) {
        throw { status: 502, mensaje: 'El servidor no devolvió un catálogo de áreas válido.', errores: {} };
      }
      return areas;
    }));
  }

  listarTipos(): Observable<readonly TipoActividad[]> {
    // El prefijo del backend es "ativicty-type", no "activity-type".
    return this.obtenerDatos<readonly TipoActividad[]>('/ativicty-type');
  }

  /** @deprecated Utilizar Solicitudes; nunca envia POST /activity. */
  crear(_payload: ActividadPayload): Observable<ApiResponse<Actividad>> {
    return throwError(() => ({ status: 403, mensaje: 'Registra una solicitud de actividad para su aprobacion.', errores: {} }));
  }

  actualizar(id: number, payload: ActividadPayload): Observable<ApiResponse<Actividad>> {
    return this.http.put<ApiResponse<Actividad>>(`${this.api}/activity/${id}`, this.payload(payload), this.opciones())
      .pipe(catchError(error => throwError(() => errorActividad(error))));
  }

  eliminar(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.api}/activity/${id}`, this.opciones())
      .pipe(catchError(error => throwError(() => errorActividad(error))));
  }

  cambiarEstado(id: number, estado: 'Activa' | 'Cerrada'): Observable<ApiResponse<Actividad>> {
    return this.http.patch<ApiResponse<Actividad>>(`${this.api}/activity/${id}`, { estado }, this.opciones())
      .pipe(map(respuesta => {
        if (!respuesta.success || respuesta.data?.id_actividad !== id || respuesta.data.estado !== estado) {
          throw new HttpErrorResponse({ status: 502, error: { message: 'Laravel no confirmó el cambio de estado.' } });
        }
        return respuesta;
      }))
      .pipe(catchError(error => throwError(() => errorActividad(error))));
  }

  consultarPonentes(idActividad: number): Observable<readonly PonenteAsignado[]> {
    // Este listado no acepta un filtro por actividad: se filtra la respuesta real.
    return this.obtenerDatos<readonly ActividadPonente[]>('/activity-speaker').pipe(
      map(asignaciones => asignaciones.filter(item => item.id_actividad === idActividad)),
      switchMap(asignaciones => asignaciones.length
        ? forkJoin(asignaciones.map(asignacion => this.resolverPonente(asignacion)))
        : of<readonly PonenteAsignado[]>([])),
    );
  }

  listarCatalogoPonentes(): Observable<readonly { id_persona_ponente: number; nombre: string }[]> {
    return this.catalogoPonentes.listar().pipe(
      switchMap(ponentes => this.personas.listar().pipe(
        map(personas => ponentes.map(ponente => {
          const persona = personas.find(item => item.id_persona === ponente.id_persona);
          return { id_persona_ponente: ponente.id_persona_ponente,
            nombre: persona ? [persona.nombres, persona.apellido_paterno, persona.apellido_materno].filter(Boolean).join(' ')
              : `Ponente #${ponente.id_persona_ponente}` };
        })),
      )), catchError(error => throwError(() => errorActividad(error))),
    );
  }

  vincularPonente(idActividad: number, idPonente: number): Observable<ApiResponse<ActividadPonente>> {
    return this.http.post<ApiResponse<ActividadPonente>>(`${this.api}/activity-speaker`,
      { id_actividad: idActividad, id_persona_ponente: idPonente }, this.opciones()).pipe(
      map(respuesta => {
        if (!respuesta.success || !respuesta.data?.id_actividad_ponente) throw new HttpErrorResponse({ status: 502, error: { message: 'Laravel no confirmó la asignación.' } });
        return respuesta;
      }), catchError(error => throwError(() => errorActividad(error))),
    );
  }

  desvincularPonente(idAsignacion: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.api}/activity-speaker/${idAsignacion}`, this.opciones()).pipe(
      map(respuesta => {
        if (!respuesta.success) throw new HttpErrorResponse({ status: 502, error: { message: respuesta.message } });
        return respuesta;
      }), catchError(error => throwError(() => errorActividad(error))),
    );
  }

  private resolverPonente(asignacion: ActividadPonente): Observable<PonenteAsignado> {
    return this.obtenerDatos<PersonaPonenteActividad>(`/person-speakers/detail/${asignacion.id_persona_ponente}`).pipe(
      switchMap(ponente => this.obtenerDatos<PersonaActividad>(`/persons/detail/${ponente.id_persona}`)),
      map(persona => ({
        ...asignacion,
        nombre: [persona.nombres, persona.apellido_paterno, persona.apellido_materno].filter(Boolean).join(' '),
        errorNombre: null,
      })),
      // Un catálogo sin permiso no oculta las asignaciones que sí se pudieron consultar.
      catchError((error: ErrorApi) => of({ ...asignacion, nombre: null, errorNombre: error.mensaje })),
    );
  }

  private obtenerDatos<T>(ruta: string): Observable<T> {
    return this.http.get<ApiResponse<T>>(`${this.api}${ruta}`, this.opciones()).pipe(
      map(respuesta => {
        if (!respuesta.success || respuesta.data === null || respuesta.data === undefined) throw new HttpErrorResponse({ status: 502, error: { message: 'Laravel no confirmó la consulta.' } });
        return respuesta.data;
      }),
      catchError(error => throwError(() => errorActividad(error))),
    );
  }

  private payload(datos: ActividadPayload): ActividadPayload {
    return { id_area: datos.id_area, id_tipo_actividad: datos.id_tipo_actividad, nombre: datos.nombre,
      descripcion: datos.descripcion, fecha_inicio: datos.fecha_inicio, fecha_fin: datos.fecha_fin, sede: datos.sede, estado: datos.estado };
  }
  private opciones(): { context: HttpContext; withCredentials: boolean } {
    return { context: new HttpContext().set(AUTHENTICATED_REQUEST, true), withCredentials: true };
  }
}

/** ActivityController usa tanto errors como data: { campo: string[] } en sus 422. */
function errorActividad(error: unknown): ErrorApi {
  if (typeof error === 'object' && error !== null && 'status' in error && 'mensaje' in error && 'errores' in error) return error as ErrorApi;
  const normalizado = aErrorApi(error);
  if (!(error instanceof HttpErrorResponse) || error.status !== 422) return normalizado;

  const cuerpo = error.error as { errors?: unknown; data?: unknown } | null;
  const campos = cuerpo?.errors ?? cuerpo?.data;
  if (!campos || typeof campos !== 'object' || Array.isArray(campos)) return normalizado;

  const errores = Object.fromEntries(Object.entries(campos).map(([campo, valor]) => [campo,
    typeof valor === 'string' ? [valor] : Array.isArray(valor) ? valor.filter((item): item is string => typeof item === 'string') : [],
  ]));
  return { ...normalizado, errores };
}
