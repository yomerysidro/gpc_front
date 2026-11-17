import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../interfaces/api/api-response.interface';
import { Rol, RolPayload, RolPermisoAsignado } from '../../interfaces/roles/rol.interface';
import { AUTHENTICATED_REQUEST } from '../../security/auth-request.context';
import { aErrorApi } from '../../../shared/utils/error-api';

/**
 * Roles y sus asignaciones (/api/roles). Los errores se emiten como ErrorApi:
 * 422 por campo, 404 y 409 con el message del backend.
 */
@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiBaseUrl}/roles`;

  listar(): Observable<readonly Rol[]> {
    return this.http.get<ApiResponse<readonly Rol[]>>(this.url, this.opciones())
      .pipe(map(respuesta => respuesta.data), catchError(error => throwError(() => aErrorApi(error))));
  }

  crear(payload: RolPayload): Observable<ApiResponse<Rol>> {
    return this.http.post<ApiResponse<Rol>>(this.url, payload, this.opciones())
      .pipe(catchError(error => throwError(() => aErrorApi(error))));
  }

  actualizar(id: number, payload: RolPayload): Observable<ApiResponse<Rol>> {
    return this.http.put<ApiResponse<Rol>>(`${this.url}/${id}`, payload, this.opciones())
      .pipe(catchError(error => throwError(() => aErrorApi(error))));
  }

  cambiarEstado(id: number, estado: boolean): Observable<ApiResponse<Rol>> {
    return this.http.patch<ApiResponse<Rol>>(`${this.url}/${id}/estado`, { estado }, this.opciones())
      .pipe(catchError(error => throwError(() => aErrorApi(error))));
  }

  /** Ids de los módulos asignados al rol. */
  obtenerModulos(id: number): Observable<readonly number[]> {
    return this.http.get<ApiResponse<readonly number[]>>(`${this.url}/${id}/modulos`, this.opciones())
      .pipe(map(respuesta => respuesta.data), catchError(error => throwError(() => aErrorApi(error))));
  }

  /** Reemplaza los módulos del rol; los quitados pierden también sus permisos. */
  actualizarModulos(id: number, modulos: number[]): Observable<readonly number[]> {
    return this.http.put<ApiResponse<readonly number[]>>(`${this.url}/${id}/modulos`, { modulos }, this.opciones())
      .pipe(map(respuesta => respuesta.data), catchError(error => throwError(() => aErrorApi(error))));
  }

  obtenerPermisos(id: number): Observable<readonly RolPermisoAsignado[]> {
    return this.http.get<ApiResponse<readonly RolPermisoAsignado[]>>(`${this.url}/${id}/permisos`, this.opciones())
      .pipe(map(respuesta => respuesta.data), catchError(error => throwError(() => aErrorApi(error))));
  }

  /** Reemplaza los permisos del rol. Cada permiso debe ser de un módulo ya asignado (si no, 422). */
  actualizarPermisos(id: number, permisos: RolPermisoAsignado[]): Observable<readonly RolPermisoAsignado[]> {
    return this.http.put<ApiResponse<readonly RolPermisoAsignado[]>>(`${this.url}/${id}/permisos`, { permisos }, this.opciones())
      .pipe(map(respuesta => respuesta.data), catchError(error => throwError(() => aErrorApi(error))));
  }

  private opciones(): { context: HttpContext } {
    return { context: new HttpContext().set(AUTHENTICATED_REQUEST, true) };
  }
}
