import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AUTHENTICATED_REQUEST } from '../../security/auth-request.context';
import {
  GESTION_RECURSOS, GestionEntidad, GestionError, GestionPayload, GestionRegistro, GestionRespuesta,
} from './gestion.models';

export function errorGestion(error: unknown): GestionError {
  if (!(error instanceof HttpErrorResponse)) {
    return { status: 0, mensaje: 'La respuesta del servidor no tiene el formato esperado.', campos: {} };
  }
  const body = error.error as { message?: unknown; errors?: unknown; data?: unknown } | null;
  const campos: Record<string, string[]> = {};
  const validaciones = body?.errors ?? body?.data;
  if (error.status === 422 && validaciones && typeof validaciones === 'object') {
    for (const [campo, mensajes] of Object.entries(validaciones)) {
      if (typeof mensajes === 'string') campos[campo] = [mensajes];
      else if (Array.isArray(mensajes)) campos[campo] = mensajes.filter((valor): valor is string => typeof valor === 'string');
    }
  }
  const mensaje = error.status === 0
    ? 'No hay conexión con el backend. Comprueba que esté iniciado y vuelve a intentar.'
    : error.status === 401
      ? 'Tu sesión terminó. Inicia sesión nuevamente.'
      : error.status === 403
        ? 'Tu sesión no tiene acceso a esta operación.'
        : error.status === 404
          ? 'No se encontró la ruta o el registro solicitado. Comprueba la versión del backend.'
        : error.status >= 500
          ? 'El backend no pudo completar la operación. Solicita revisar su registro de errores.'
          : typeof body?.message === 'string' ? body.message : 'No se pudo completar la operación.';
  return { status: error.status, mensaje, campos };
}

/** Las diez tablas tienen el mismo contrato /list, /detail/:id, /create, /update/:id y /delete/:id. */
@Injectable({ providedIn: 'root' })
export class GestionService {
  private readonly http = inject(HttpClient);

  listar(entidad: GestionEntidad): Observable<GestionRegistro[]> {
    return this.http.get<GestionRespuesta<GestionRegistro[]>>(`${this.url(entidad)}/list`, this.opciones()).pipe(
      map(respuesta => {
        if (!respuesta.success || !Array.isArray(respuesta.data)) throw new Error('Formato de listado inválido');
        return respuesta.data;
      }),
      catchError(error => throwError(() => errorGestion(error))),
    );
  }

  obtener(entidad: GestionEntidad, id: number): Observable<GestionRegistro> {
    return this.http.get<GestionRespuesta<GestionRegistro>>(`${this.url(entidad)}/detail/${id}`, this.opciones()).pipe(
      map(respuesta => {
        if (!respuesta.success || !respuesta.data || Array.isArray(respuesta.data)) throw new Error('Formato de detalle inválido');
        return respuesta.data;
      }),
      catchError(error => throwError(() => errorGestion(error))),
    );
  }

  crear(entidad: GestionEntidad, payload: GestionPayload): Observable<GestionRespuesta<GestionRegistro>> {
    return this.http.post<GestionRespuesta<GestionRegistro>>(`${this.url(entidad)}/create`, payload, this.opciones())
      .pipe(catchError(error => throwError(() => errorGestion(error))));
  }

  actualizar(entidad: GestionEntidad, id: number, payload: GestionPayload): Observable<GestionRespuesta<GestionRegistro>> {
    return this.http.put<GestionRespuesta<GestionRegistro>>(`${this.url(entidad)}/update/${id}`, payload, this.opciones())
      .pipe(catchError(error => throwError(() => errorGestion(error))));
  }

  eliminar(entidad: GestionEntidad, id: number): Observable<GestionRespuesta<null>> {
    return this.http.delete<GestionRespuesta<null>>(`${this.url(entidad)}/delete/${id}`, this.opciones())
      .pipe(catchError(error => throwError(() => errorGestion(error))));
  }

  private url(entidad: GestionEntidad): string {
    return `${environment.apiBaseUrl}/${GESTION_RECURSOS[entidad].endpoint}`;
  }

  private opciones(): { context: HttpContext } {
    return { context: new HttpContext().set(AUTHENTICATED_REQUEST, true) };
  }
}
