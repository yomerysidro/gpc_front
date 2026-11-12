import { HttpClient, HttpContext, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { catchError, defer, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ActivityRequestAuthorizedArea, ActivityRequestDecisionRow, ActivityRequestDraft, ActivityRequestFilters, ActivityRequestObservation, ActivityRequestPage, ActivityRequestResponse, ActivityRequestRow } from '../../interfaces/solicitudes/activity-requests-api.interface';
import { AUTHENTICATED_REQUEST } from '../../security/auth-request.context';
import { aErrorApi } from '../../../shared/utils/error-api';

/** Solo habilitar tras publicar rutas Y verificar autenticación/autorización del servidor.
 * No se activa por URL, rol, localStorage ni por recibir un HTTP 200 de otra API. */
export const ACTIVITY_REQUESTS_API_ACTIVA = new InjectionToken<boolean>('ACTIVITY_REQUESTS_API_ACTIVA', { providedIn: 'root', factory: () => true });
const CAMPOS_BORRADOR = ['id_area', 'id_tipo_actividad', 'nombre', 'descripcion', 'justificacion', 'fecha_inicio_propuesta', 'fecha_fin_propuesta', 'sede_propuesta'] as const;

@Injectable({ providedIn: 'root' })
export class ActivityRequestsApiService {
  private readonly http = inject(HttpClient);
  readonly disponible = inject(ACTIVITY_REQUESTS_API_ACTIVA);
  private readonly base = `${environment.apiBaseUrl}/activity-requests`;

  areasAutorizadas(): Observable<readonly ActivityRequestAuthorizedArea[]> {
    return this.peticion<readonly ActivityRequestAuthorizedArea[]>('GET', '/authorized-areas').pipe(map(areas => {
      if (!Array.isArray(areas) || areas.some(area => !area || !Number.isSafeInteger(area.id_area) || area.id_area < 1 || typeof area.nombre !== 'string' || !area.nombre.trim())) {
        throw new Error('Laravel devolvió una respuesta inválida de áreas autorizadas. Intenta consultar nuevamente.');
      }
      return areas;
    }));
  }

  crearBorrador(datos: ActivityRequestDraft): Observable<ActivityRequestRow> { return this.peticion<ActivityRequestRow>('POST', '', this.borrador(datos)).pipe(map(fila => this.validarSolicitud(fila))); }
  editarBorrador(id: number, datos: Partial<ActivityRequestDraft>): Observable<ActivityRequestRow> { return this.conId(id, () => this.peticion<ActivityRequestRow>('PUT', `/${id}`, this.borrador(datos)).pipe(map(fila => this.validarSolicitud(fila, id)))); }
  enviar(id: number): Observable<ActivityRequestRow> { return this.conId(id, () => this.peticion<ActivityRequestRow>('POST', `/${id}/submit`, null).pipe(map(fila => {
    this.validarSolicitud(fila, id);
    if (fila.estado !== 'Enviada') throw new Error('Laravel no confirmó el estado Enviada. Actualiza la solicitud antes de reintentar.');
    return fila;
  }))); }
  listar(filtros: ActivityRequestFilters = {}, propias = false): Observable<ActivityRequestPage<ActivityRequestRow>> {
    let params = new HttpParams();
    for (const campo of ['estado', 'id_area', 'fecha_desde', 'fecha_hasta', 'per_page', 'page'] as const) {
      const valor = filtros[campo]; if (valor !== undefined && valor !== '') params = params.set(campo, valor);
    }
    return this.peticion('GET', propias ? '/mine' : '', undefined, params);
  }
  detalle(id: number): Observable<ActivityRequestRow> { return this.conId(id, () => this.peticion('GET', `/${id}`)); }
  detalleRevision(id: number): Observable<ActivityRequestRow> { return this.conId(id, () => this.peticion('GET', `/${id}/review-detail`)); }
  historial(id: number): Observable<readonly ActivityRequestDecisionRow[]> { return this.conId(id, () => this.peticion('GET', `/${id}/history`)); }
  revisar(id: number, datos: ActivityRequestObservation = {}): Observable<ActivityRequestRow> { return this.decision(id, 'review', datos); }
  observar(id: number, observacion: string): Observable<ActivityRequestRow> { return this.decision(id, 'observe', { observacion }); }
  derivar(id: number, datos: ActivityRequestObservation = {}): Observable<ActivityRequestRow> { return this.decision(id, 'derive', datos); }
  aprobar(id: number, datos: ActivityRequestObservation = {}): Observable<ActivityRequestRow> { return this.decision(id, 'approve', datos); }
  rechazar(id: number, observacion: string): Observable<ActivityRequestRow> { return this.decision(id, 'reject', { observacion }); }

  private decision(id: number, accion: string, datos: ActivityRequestObservation): Observable<ActivityRequestRow> {
    return this.conId(id, () => this.peticion('POST', `/${id}/${accion}`, datos.observacion === undefined ? {} : { observacion: datos.observacion }));
  }
  private borrador(datos: Partial<ActivityRequestDraft>): Partial<ActivityRequestDraft> {
    return Object.fromEntries(CAMPOS_BORRADOR.filter(campo => datos[campo] !== undefined).map(campo => [campo, datos[campo]]));
  }
  private validarSolicitud(fila: ActivityRequestRow, id?: number): ActivityRequestRow {
    if (!Number.isSafeInteger(fila.id_solicitud_actividad) || fila.id_solicitud_actividad < 1 || id !== undefined && fila.id_solicitud_actividad !== id) {
      throw new Error('Laravel no devolvió un identificador de solicitud válido. Actualiza el listado antes de reintentar.');
    }
    return fila;
  }
  private conId<T>(id: number, operacion: () => Observable<T>): Observable<T> {
    return defer(() => Number.isSafeInteger(id) && id > 0 ? operacion() : throwError(() => new Error('Selecciona una solicitud con identificador válido.')));
  }
  private peticion<T>(metodo: string, ruta: string, body?: unknown, params?: HttpParams): Observable<T> {
    return defer(() => {
      if (!this.disponible) return throwError(() => new Error('Servicio de Solicitudes pendiente de habilitación: sus rutas y autorización aún no están activadas. No se ha enviado información.'));
      return this.http.request<ActivityRequestResponse<T>>(metodo, this.base + ruta, {
        body, params, withCredentials: true, context: new HttpContext().set(AUTHENTICATED_REQUEST, true),
      }).pipe(map(respuesta => {
        if (respuesta.success !== true || respuesta.data === null || respuesta.data === undefined) {
          throw new HttpErrorResponse({ status: 502, error: { message: respuesta.message || 'Laravel no confirmó la operación.' } });
        }
        return respuesta.data;
      }), catchError((error: unknown) => {
        const normalizado = aErrorApi(error);
        const codigo: unknown = error instanceof HttpErrorResponse ? error.error?.data?.codigo : undefined;
        if (codigo === 'SOLICITUD_AREA_NO_AUTORIZADA' || codigo === 'SOLICITUD_SIN_AREA_VIGENTE') return throwError(() => ({ ...normalizado, codigo }));
        if (error instanceof HttpErrorResponse && error.status === 422 && error.error?.data && typeof error.error.data === 'object') {
          return throwError(() => ({ ...normalizado, errores: Object.fromEntries(Object.entries(error.error.data).filter(([, mensajes]) => Array.isArray(mensajes) && mensajes.every(mensaje => typeof mensaje === 'string'))) }));
        }
        return throwError(() => normalizado);
      }));
    });
  }
}
