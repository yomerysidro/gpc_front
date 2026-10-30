import { HttpClient, HttpContext, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse, ErrorApi } from '../../interfaces/api/api-response.interface';
import {
  EntidadesEmision, FiltrosEmision, OpcionRelacion, PaginaEmision, PayloadEmision,
  RecursoEditable, RecursoEliminable, RecursoEmision,
} from '../../interfaces/emision-certificados/emision-certificados.interface';
import { AUTHENTICATED_REQUEST } from '../../security/auth-request.context';
import { aErrorApi } from '../../../shared/utils/error-api';

/** Ámbitos reales de config/module_permissions.php; no se deducen del nombre de la URL. */
export const PERMISOS_EMISION: Record<RecursoEmision, string> = {
  certificados: 'emision', 'tipos-certificado': 'emision', reconocimientos: 'reconocimientos',
  'certificados-documentos': 'emision', firmas: 'ponentes-firmantes',
  'certificados-firmas': 'emision', 'consultas-certificado': 'emision',
  'actividades-firmas': 'ponentes-firmantes',
};

@Injectable({ providedIn: 'root' })
export class EmisionCertificadosService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiBaseUrl;

  listar<K extends RecursoEmision>(recurso: K, filtros: FiltrosEmision = {}): Observable<PaginaEmision<EntidadesEmision[K]>> {
    let params = new HttpParams();
    for (const [campo, valor] of Object.entries(filtros)) {
      if (valor !== undefined && valor !== null && valor !== '') {
        params = params.set(campo, typeof valor === 'boolean' ? Number(valor) : valor);
      }
    }
    return this.http.get<ApiResponse<PaginaEmision<EntidadesEmision[K]>>>(`${this.api}/${recurso}/list`, {
      ...this.opciones(), params,
    }).pipe(map(respuesta => respuesta.data), catchError(error => this.error(error)));
  }

  obtener<K extends RecursoEmision>(recurso: K, id: number): Observable<EntidadesEmision[K]> {
    return this.http.get<ApiResponse<EntidadesEmision[K]>>(`${this.api}/${recurso}/detail/${id}`, this.opciones())
      .pipe(map(respuesta => respuesta.data), catchError(error => this.error(error)));
  }

  crear<K extends RecursoEditable>(recurso: K, payload: PayloadEmision[K]): Observable<EntidadesEmision[K]> {
    return this.http.post<ApiResponse<EntidadesEmision[K]>>(`${this.api}/${recurso}/create`, payload, this.opciones())
      .pipe(map(respuesta => respuesta.data), catchError(error => this.error(error)));
  }

  actualizar<K extends RecursoEditable>(recurso: K, id: number, payload: Partial<PayloadEmision[K]>): Observable<EntidadesEmision[K]> {
    return this.http.patch<ApiResponse<EntidadesEmision[K]>>(`${this.api}/${recurso}/update/${id}`, payload, this.opciones())
      .pipe(map(respuesta => respuesta.data), catchError(error => this.error(error)));
  }

  eliminar(recurso: RecursoEliminable, id: number): Observable<void> {
    return this.http.delete<ApiResponse<null>>(`${this.api}/${recurso}/delete/${id}`, this.opciones())
      .pipe(map(() => undefined), catchError(error => this.error(error)));
  }

  /** Solo lecturas de Gestión y Actividades para elegir relaciones existentes. */
  relaciones(campo: string): Observable<readonly OpcionRelacion[]> {
    const rutas: Record<string, { url: string; clave: string; texto: string }> = {
      id_persona: { url: 'persons/list', clave: 'id_persona', texto: 'nombres' },
      id_persona_trabajador: { url: 'person-workers/list', clave: 'id_persona_trabajador', texto: 'cargo' },
      id_practica: { url: 'practices/list', clave: 'id_practica', texto: 'carrera' },
      id_participacion: { url: 'participation', clave: 'id_participacion', texto: 'id_persona' },
      id_actividad: { url: 'activity', clave: 'id_actividad', texto: 'nombre' },
    };
    const ruta = rutas[campo];
    if (!ruta) return throwError(() => new Error('Relación no configurada.'));
    return this.http.get<ApiResponse<readonly Record<string, string | number | null>[]>>(`${this.api}/${ruta.url}`, this.opciones())
      .pipe(map(respuesta => respuesta.data.map(fila => ({
        id: Number(fila[ruta.clave]), texto: `#${fila[ruta.clave]} · ${fila[ruta.texto] ?? ''}`,
      }))), catchError(error => this.error(error)));
  }

  private opciones(): { context: HttpContext } {
    return { context: new HttpContext().set(AUTHENTICATED_REQUEST, true) };
  }

  private error(error: unknown): Observable<never> {
    const normalizado = aErrorApi(error);
    // Los Data de Emisión usan {data: {campo: [mensajes]}} para los 422.
    if (error instanceof HttpErrorResponse && error.status === 422) {
      const data: unknown = error.error?.data;
      const errores: Record<string, readonly string[]> = { ...normalizado.errores };
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        for (const [campo, mensajes] of Object.entries(data)) {
          if (Array.isArray(mensajes) && mensajes.every(mensaje => typeof mensaje === 'string')) errores[campo] = mensajes;
        }
      }
      const validacion: ErrorApi = { ...normalizado, mensaje: 'Revisa los campos indicados.', errores };
      return throwError(() => validacion);
    }
    return throwError(() => normalizado);
  }
}
