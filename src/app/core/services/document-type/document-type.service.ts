import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AUTHENTICATED_REQUEST } from '../../security/auth-request.context';

export type DocumentType = {
  id_tipo_documento: number;
  nombre: string;
  estado: boolean;
};
type ApiResponse<T> = { success: boolean; message: string; data: T };

@Injectable({ providedIn: 'root' })
export class DocumentTypeService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiBaseUrl}/document-types`;

  listar(): Observable<readonly DocumentType[]> {
    return this.http.get<ApiResponse<readonly DocumentType[]>>(`${this.url}/list`, this.opciones()).pipe(
      map(respuesta => {
        if (!respuesta.success || !Array.isArray(respuesta.data)) {
          throw new Error(respuesta.message || 'Respuesta de listado inválida.');
        }
        return respuesta.data;
      }),
    );
  }

  obtener(id: number): Observable<DocumentType> {
    return this.http.get<ApiResponse<DocumentType>>(`${this.url}/detail/${id}`, this.opciones()).pipe(
      map(respuesta => {
        if (!respuesta.success || !respuesta.data || typeof respuesta.data !== 'object' || Array.isArray(respuesta.data)) {
          throw new Error(respuesta.message || 'Respuesta de detalle inválida.');
        }
        return respuesta.data;
      }),
    );
  }

  crear(payload: Record<string, unknown>): Observable<{ success: boolean; message: string; data: unknown }> {
    return this.http.post<{ success: boolean; message: string; data: unknown }>(`${this.url}/create`, payload, this.opciones()).pipe(map(r => this.validarEscritura(r)));
  }

  actualizar(id: number, payload: Record<string, unknown>): Observable<{ success: boolean; message: string; data: unknown }> {
    return this.http.put<{ success: boolean; message: string; data: unknown }>(`${this.url}/update/${id}`, payload, this.opciones()).pipe(map(r => this.validarEscritura(r)));
  }

  eliminar(id: number): Observable<{ success: boolean; message: string; data: unknown }> {
    return this.http.delete<{ success: boolean; message: string; data: unknown }>(`${this.url}/delete/${id}`, this.opciones()).pipe(map(r => this.validarEscritura(r)));
  }

  private validarEscritura(r: { success: boolean; message: string; data: unknown }) {
    if (!r.success) throw new Error(r.message || 'No se pudo completar la operación.');
    return r;
  }

  private opciones(): { context: HttpContext } {
    return { context: new HttpContext().set(AUTHENTICATED_REQUEST, true) };
  }
}
