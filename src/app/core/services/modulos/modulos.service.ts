import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../interfaces/api/api-response.interface';
import { Modulo, ModuloPayload, Permiso, PermisoPayload } from '../../interfaces/roles/modulo.interface';
import { AUTHENTICATED_REQUEST } from '../../security/auth-request.context';
import { aErrorApi } from '../../../shared/utils/error-api';

/** Catálogo de módulos (/api/modulos) y sus permisos (/api/permisos). Errores como ErrorApi. */
@Injectable({
  providedIn: 'root'
})
export class ModulosService {
  private readonly http = inject(HttpClient);
  private readonly urlModulos = `${environment.apiBaseUrl}/modulos`;
  private readonly urlPermisos = `${environment.apiBaseUrl}/permisos`;

  /** Módulos con sus permisos anidados. */
  listar(): Observable<readonly Modulo[]> {
    return this.http.get<ApiResponse<readonly Modulo[]>>(this.urlModulos, this.opciones())
      .pipe(map(respuesta => respuesta.data), catchError(error => throwError(() => aErrorApi(error))));
  }

  crear(payload: ModuloPayload): Observable<ApiResponse<Modulo>> {
    return this.http.post<ApiResponse<Modulo>>(this.urlModulos, payload, this.opciones())
      .pipe(catchError(error => throwError(() => aErrorApi(error))));
  }

  actualizar(id: number, payload: ModuloPayload): Observable<ApiResponse<Modulo>> {
    return this.http.put<ApiResponse<Modulo>>(`${this.urlModulos}/${id}`, payload, this.opciones())
      .pipe(catchError(error => throwError(() => aErrorApi(error))));
  }

  cambiarEstado(id: number, estado: boolean): Observable<ApiResponse<Modulo>> {
    return this.http.patch<ApiResponse<Modulo>>(`${this.urlModulos}/${id}/estado`, { estado }, this.opciones())
      .pipe(catchError(error => throwError(() => aErrorApi(error))));
  }

  crearPermiso(idModulo: number, payload: PermisoPayload): Observable<ApiResponse<Permiso>> {
    return this.http.post<ApiResponse<Permiso>>(`${this.urlModulos}/${idModulo}/permisos`, payload, this.opciones())
      .pipe(catchError(error => throwError(() => aErrorApi(error))));
  }

  actualizarPermiso(id: number, payload: PermisoPayload): Observable<ApiResponse<Permiso>> {
    return this.http.put<ApiResponse<Permiso>>(`${this.urlPermisos}/${id}`, payload, this.opciones())
      .pipe(catchError(error => throwError(() => aErrorApi(error))));
  }

  cambiarEstadoPermiso(id: number, estado: boolean): Observable<ApiResponse<Permiso>> {
    return this.http.patch<ApiResponse<Permiso>>(`${this.urlPermisos}/${id}/estado`, { estado }, this.opciones())
      .pipe(catchError(error => throwError(() => aErrorApi(error))));
  }

  private opciones(): { context: HttpContext } {
    return { context: new HttpContext().set(AUTHENTICATED_REQUEST, true) };
  }
}
