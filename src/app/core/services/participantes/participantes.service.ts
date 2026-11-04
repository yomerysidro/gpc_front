import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse, ErrorApi } from '../../interfaces/api/api-response.interface';
import { ActividadInscripcion, DocumentoInscripcion, Inscripcion, InscripcionPayload, PersonaInscripcion, TipoInscripcion } from '../../interfaces/participantes/participante.interface';
import { AUTHENTICATED_REQUEST } from '../../security/auth-request.context';
import { aErrorApi } from '../../../shared/utils/error-api';
import { ActividadesService } from '../actividades/actividades.service';

@Injectable({ providedIn: 'root' })
export class ParticipantesService {
  private readonly actividadesApi = inject(ActividadesService);
  actividad(id: number): Observable<ActividadInscripcion> { return this.actividadesApi.obtener(id); }
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiBaseUrl;

  listar(): Observable<readonly Inscripcion[]> { return this.lista('/participation'); }
  personas(): Observable<readonly PersonaInscripcion[]> { return this.lista('/persons/list'); }
  documentos(): Observable<readonly DocumentoInscripcion[]> { return this.lista('/person-documents/list'); }
  actividades(): Observable<readonly ActividadInscripcion[]> { return this.lista('/activity'); }
  tipos(): Observable<readonly TipoInscripcion[]> { return this.lista('/participation-type'); }
  obtener(id: number): Observable<Inscripcion> {
    return this.http.get<ApiResponse<Inscripcion>>(`${this.api}/participation/${id}`, this.opciones()).pipe(
      map(respuesta => {
        if (!respuesta.success || !respuesta.data || Array.isArray(respuesta.data)) throw new Error('Respuesta de detalle no válida.');
        return respuesta.data;
      }), catchError(error => throwError(() => normalizar(error))),
    );
  }
  crear(body: InscripcionPayload): Observable<ApiResponse<Inscripcion>> {
    return this.http.post<ApiResponse<Inscripcion>>(`${this.api}/participation`, body, this.opciones()).pipe(this.validarEscritura());
  }
  actualizar(id: number, body: InscripcionPayload): Observable<ApiResponse<Inscripcion>> {
    return this.http.put<ApiResponse<Inscripcion>>(`${this.api}/participation/${id}`, body, this.opciones()).pipe(this.validarEscritura());
  }
  cambiarEstado(id: number, estado: string): Observable<ApiResponse<Inscripcion>> {
    return this.http.patch<ApiResponse<Inscripcion>>(`${this.api}/participation/${id}`, { estado }, this.opciones()).pipe(this.validarEscritura());
  }
  private validarEscritura() {
    return (source: Observable<ApiResponse<Inscripcion>>) => source.pipe(
      map(respuesta => {
        if (!respuesta.success || !respuesta.data) throw new Error(respuesta.message || 'No se confirmó el guardado.');
        return respuesta;
      }), catchError(error => throwError(() => normalizar(error))),
    );
  }
  private lista<T>(ruta: string): Observable<readonly T[]> {
    return this.http.get<ApiResponse<readonly T[]>>(`${this.api}${ruta}`, this.opciones()).pipe(
      map(respuesta => {
        if (!respuesta.success || !Array.isArray(respuesta.data)) throw new Error(respuesta.message || 'Respuesta de listado no válida.');
        return respuesta.data;
      }), catchError(error => throwError(() => normalizar(error))),
    );
  }
  private opciones() { return { context: new HttpContext().set(AUTHENTICATED_REQUEST, true) }; }
}

function normalizar(error: unknown): ErrorApi {
  if (error instanceof HttpErrorResponse) {
    const normalizado = aErrorApi(error);
    const cuerpo = error.error as { errors?: Record<string, string[]>; data?: Record<string, string[]> } | null;
    return error.status === 422 ? { ...normalizado, errores: cuerpo?.errors ?? cuerpo?.data ?? {} } : normalizado;
  }
  return { status: 0, mensaje: error instanceof Error ? error.message : 'Datos no disponibles.', errores: {} };
}
