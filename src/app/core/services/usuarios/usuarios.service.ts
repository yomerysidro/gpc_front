import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../../interfaces/api/api-response.interface';
import {
  Usuario,
  UsuarioActualizarPayload,
  UsuarioFiltros,
  UsuarioPayload,
} from '../../interfaces/usuarios/usuario.interface';
import { AUTHENTICATED_REQUEST } from '../../security/auth-request.context';
import { aErrorApi } from '../../../shared/utils/error-api';

/**
 * Cuentas de acceso (/api/usuarios). Los errores se emiten como ErrorApi:
 * 422 con errores por campo; 404, 409 y 429 con el message del backend.
 */
@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiBaseUrl}/usuarios`;

  listar(filtros: UsuarioFiltros): Observable<PaginatedResponse<Usuario>> {
    let params = new HttpParams();

    if (filtros.search) params = params.set('search', filtros.search);
    if (filtros.idRol !== undefined) params = params.set('idRol', filtros.idRol);
    if (filtros.estado !== undefined) params = params.set('estado', filtros.estado);
    if (filtros.page !== undefined) params = params.set('page', filtros.page);

    return this.http.get<PaginatedResponse<Usuario>>(this.url, { ...this.opciones(), params })
      .pipe(catchError(error => throwError(() => aErrorApi(error))));
  }

  obtener(id: number): Observable<Usuario> {
    return this.http.get<ApiResponse<Usuario>>(`${this.url}/${id}`, this.opciones()).pipe(
      map(respuesta => respuesta.data),
      catchError(error => throwError(() => aErrorApi(error))),
    );
  }

  crear(payload: UsuarioPayload): Observable<ApiResponse<Usuario>> {
    return this.http.post<ApiResponse<Usuario>>(this.url, payload, this.opciones())
      .pipe(catchError(error => throwError(() => aErrorApi(error))));
  }

  actualizar(id: number, payload: UsuarioActualizarPayload): Observable<ApiResponse<Usuario>> {
    return this.http.put<ApiResponse<Usuario>>(`${this.url}/${id}`, payload, this.opciones())
      .pipe(catchError(error => throwError(() => aErrorApi(error))));
  }

  cambiarEstado(id: number, estado: boolean): Observable<ApiResponse<Usuario>> {
    return this.http.patch<ApiResponse<Usuario>>(`${this.url}/${id}/estado`, { estado }, this.opciones())
      .pipe(catchError(error => throwError(() => aErrorApi(error))));
  }

  desbloquear(id: number): Observable<ApiResponse<Usuario>> {
    return this.http.patch<ApiResponse<Usuario>>(`${this.url}/${id}/desbloquear`, null, this.opciones())
      .pipe(catchError(error => throwError(() => aErrorApi(error))));
  }

  /** Envía al correo del usuario un enlace para crear o restablecer su contraseña. */
  restablecerPassword(id: number): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.url}/${id}/restablecer-password`, null, this.opciones())
      .pipe(catchError(error => throwError(() => aErrorApi(error))));
  }

  private opciones(): { context: HttpContext } {
    return { context: new HttpContext().set(AUTHENTICATED_REQUEST, true) };
  }
}
