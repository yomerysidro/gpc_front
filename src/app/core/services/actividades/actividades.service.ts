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

/** Contratos leídos de routes/api.php y de los Data/Controllers de Laravel. */
@Injectable({ providedIn: 'root' })
export class ActividadesService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiBaseUrl;

  listar(): Observable<readonly Actividad[]> {
    return this.obtenerDatos<readonly Actividad[]>('/activity');
  }

  obtener(id: number): Observable<Actividad> {
    return this.obtenerDatos<Actividad>(`/activity/${id}`);
  }

  listarAreas(): Observable<readonly AreaActividad[]> {
    return this.obtenerDatos<readonly AreaActividad[]>('/areas/list');
  }

  listarTipos(): Observable<readonly TipoActividad[]> {
    // El prefijo del backend es "ativicty-type", no "activity-type".
    return this.obtenerDatos<readonly TipoActividad[]>('/ativicty-type');
  }

  crear(payload: ActividadPayload): Observable<ApiResponse<Actividad>> {
    return this.http.post<ApiResponse<Actividad>>(`${this.api}/activity`, payload, this.opciones())
      .pipe(catchError(error => throwError(() => errorActividad(error))));
  }

  actualizar(id: number, payload: ActividadPayload): Observable<ApiResponse<Actividad>> {
    return this.http.put<ApiResponse<Actividad>>(`${this.api}/activity/${id}`, payload, this.opciones())
      .pipe(catchError(error => throwError(() => errorActividad(error))));
  }

  eliminar(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.api}/activity/${id}`, this.opciones())
      .pipe(catchError(error => throwError(() => errorActividad(error))));
  }

  cambiarEstado(id: number, estado: 'Activa' | 'Cerrada'): Observable<ApiResponse<Actividad>> {
    return this.http.patch<ApiResponse<Actividad>>(`${this.api}/activity/${id}`, { estado }, this.opciones())
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
      map(respuesta => respuesta.data),
      catchError(error => throwError(() => errorActividad(error))),
    );
  }

  private opciones(): { context: HttpContext } {
    return { context: new HttpContext().set(AUTHENTICATED_REQUEST, true) };
  }
}

/** ActivityController usa tanto errors como data: { campo: string[] } en sus 422. */
function errorActividad(error: unknown): ErrorApi {
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
