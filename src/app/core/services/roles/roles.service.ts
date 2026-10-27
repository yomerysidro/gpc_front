import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../interfaces/api/api-response.interface';
import { Rol } from '../../interfaces/roles/rol.interface';
import { AUTHENTICATED_REQUEST } from '../../security/auth-request.context';
import { aErrorApi } from '../../../shared/utils/error-api';

/** Roles (/api/roles). Por ahora solo el listado; la Fase 3 agrega la gestión. */
@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiBaseUrl}/roles`;

  listar(): Observable<readonly Rol[]> {
    return this.http.get<ApiResponse<readonly Rol[]>>(this.url, {
      context: new HttpContext().set(AUTHENTICATED_REQUEST, true),
    }).pipe(
      map(respuesta => respuesta.data),
      catchError(error => throwError(() => aErrorApi(error))),
    );
  }
}
