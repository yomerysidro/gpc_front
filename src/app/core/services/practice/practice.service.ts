import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AUTHENTICATED_REQUEST } from '../../security/auth-request.context';
import { EvaluacionPractica } from '../../interfaces/emision-certificados/origenes-certificado.interface';

export type Practice = {
  id_practica: number;
  id_persona_practicante: number;
  id_institucion: number;
  id_area: number;
  carrera: string;
  fecha_inicio: string;
  fecha_fin: string | null;
  estado: string;
};
type ApiResponse<T> = { success: boolean; message: string; data: T };

@Injectable({ providedIn: 'root' })
export class PracticeService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiBaseUrl}/practices`;

  evaluaciones(): Observable<readonly EvaluacionPractica[]> {
    return this.http.get<ApiResponse<{ practicas: EvaluacionPractica[] }>>(
      `${this.url}/evaluacion-certificacion`, this.opciones()).pipe(map(r => {
      if (!r.success || !Array.isArray(r.data?.practicas)) throw new Error('No se pudo consultar las prácticas.');
      return r.data.practicas;
    }));
  }
  evaluar(id: number) {
    return this.http.get<ApiResponse<EvaluacionPractica>>(`${this.url}/${id}/evaluacion-certificacion`, this.opciones()).pipe(map(r => {
      if (!r.success || r.data?.id_origen !== id) throw new Error('No se pudo confirmar la práctica.'); return r.data;
    }));
  }
  finalizar(id: number) {
    return this.http.post<ApiResponse<EvaluacionPractica & { practica_finalizada: boolean }>>(`${this.url}/${id}/finalizar`, {}, this.opciones()).pipe(map(r => {
      if (!r.success || r.data?.practica_finalizada !== true || !r.data.finalizacion_registrada || r.data.id_origen !== id) throw new Error('El servidor no confirmó la finalización.'); return r.data;
    }));
  }
  listar(): Observable<readonly Practice[]> {
    return this.http.get<ApiResponse<readonly Practice[]>>(`${this.url}/list`, this.opciones()).pipe(
      map(respuesta => {
        if (!respuesta.success || !Array.isArray(respuesta.data)) {
          throw new Error(respuesta.message || 'Respuesta de listado inválida.');
        }
        return respuesta.data;
      }),
    );
  }

  obtener(id: number): Observable<Practice> {
    return this.http.get<ApiResponse<Practice>>(`${this.url}/detail/${id}`, this.opciones()).pipe(
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
