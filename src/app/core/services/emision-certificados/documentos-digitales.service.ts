import { HttpClient, HttpContext, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse, ErrorApi } from '../../interfaces/api/api-response.interface';
import { ArchivoPdf, DocumentoGenerado, VerificacionDocumento } from '../../interfaces/emision-certificados/documento-digital.interface';
import { AUTHENTICATED_REQUEST } from '../../security/auth-request.context';
import { aErrorApi } from '../../../shared/utils/error-api';
import { decodificarVistaPrevia } from './vista-previa-pdf';

export interface VistaPreviaSesion {
  accion: 'vista_previa'; formato: 'pdf'; emitida: false; creado: false; mensaje: string; mensaje_persistido: false;
  contexto: { id_sesion?: number; id_actividad_sesion?: number; id_participacion: number; id_tipo_certificado: number; id_actividad: number; id_persona: number };
  vista_previa_pdf: { contenido_base64: string; tipo_contenido: string; nombre_archivo: string; persistido: boolean };
  puede_emitir: boolean; puede_emitir_demostracion?: boolean; motivos_bloqueo_emision?: readonly string[];
}

export function mensajeDocumento(error: ErrorApi): string {
  const estados: Record<number, string> = { 0: 'Backend temporalmente inaccesible.', 401: 'Sesión de usuario no autenticada.', 403: 'Acción no autorizada.',
    404: 'Documento o código no encontrado.', 409: 'Operación en conflicto o bloqueada.', 422: 'Validación incorrecta.', 429: 'Demasiadas consultas. Intenta nuevamente.' };
  const motivo = estados[error.status];
  return [motivo, error.mensaje, ...Object.values(error.errores).flat()].filter(Boolean).join(' ');
}

@Injectable({ providedIn: 'root' })
export class DocumentosDigitalesService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiBaseUrl.replace(/\/$/, '');
  private readonly privado = { context: new HttpContext().set(AUTHENTICATED_REQUEST, true), withCredentials: true };

  vistaPrevia(sesion: number, participacion: number, tipo: number, mensaje: string): Observable<{ archivo: ArchivoPdf; datos: Omit<VistaPreviaSesion, 'vista_previa_pdf'> }> {
    return this.http.post<ApiResponse<VistaPreviaSesion>>(`${this.api}/activity-session/${sesion}/preparar-certificados`,
      { accion: 'vista_previa', formato: 'pdf', id_participacion: participacion, id_tipo_certificado: tipo, mensaje }, this.privado).pipe(
      map(r => {
        const d = r.data;
        if (!r.success || d?.accion !== 'vista_previa' || d.formato !== 'pdf' || d.emitida !== false || d.creado !== false
          || d.mensaje_persistido !== false || d.mensaje !== mensaje || Number(d.contexto?.id_sesion ?? d.contexto?.id_actividad_sesion) !== sesion
          || Number(d.contexto?.id_participacion) !== participacion || Number(d.contexto?.id_tipo_certificado) !== tipo) throw new Error('Laravel no confirmó el contexto y el mensaje exactos de la vista previa.');
        const archivo = decodificarVistaPrevia(d.vista_previa_pdf);
        const { vista_previa_pdf, ...datos } = d;
        return { archivo, datos };
      }), catchError(e => this.error(e)),
    );
  }

  generar(id: number): Observable<DocumentoGenerado> {
    return this.http.post<ApiResponse<DocumentoGenerado>>(`${this.api}/certificados/${id}/generar-documento`, {}, this.privado).pipe(
      map(r => {
        if (!r.success || r.data?.id_certificado !== id || !Number.isSafeInteger(r.data?.id_certificado_documento) || r.data.id_certificado_documento < 1
          || !/^[a-f0-9]{30}$/.test(r.data.codigo_verificacion) || r.data.modo !== 'desarrollo' || r.data.oficial !== false
          || r.data.puede_emitir !== false || r.data.puede_firmar !== false || typeof r.data.url_verificacion !== 'string') {
          throw new Error('Laravel no confirmó la identidad del documento generado.');
        }
        return r.data;
      }), catchError(e => this.error(e)),
    );
  }

  verificar(codigo: string): Observable<VerificacionDocumento> {
    return this.http.get<ApiResponse<VerificacionDocumento>>(`${this.api}/certificados/verificar/${encodeURIComponent(codigo)}`, { withCredentials: false }).pipe(
      map(r => {
        if (!r.success || r.data?.codigo_verificacion !== codigo || typeof r.data.registro_encontrado !== 'boolean'
          || typeof r.data.integridad_verificada !== 'boolean' || typeof r.data.vigente !== 'boolean'
          || typeof r.data.puede_ver_documento !== 'boolean' || typeof r.data.estado_documento !== 'string' || typeof r.data.estado_certificado !== 'string'
          || typeof r.data.firma_verificada !== 'boolean' || typeof r.data.emision_oficial_verificada !== 'boolean'
          || !(r.data.url_documento === null || typeof r.data.url_documento === 'string')
          || !Array.isArray(r.data.motivos) || !r.data.motivos.every(m => typeof m === 'string')) throw new Error('Respuesta de verificación incompleta; no se pudo confirmar el documento.');
        return r.data;
      }), catchError(e => this.error(e)),
    );
  }

  archivo(id: number): Observable<ArchivoPdf> {
    return this.pdf(`${this.api}/certificados-documentos/${id}/archivo`, true);
  }

  archivoPublico(url: string, codigo: string): Observable<ArchivoPdf> {
    // Se acepta únicamente la URL que el contrato público devuelve para ese código.
    const ruta = `/api/certificados/verificar/${encodeURIComponent(codigo)}?archivo=1`;
    if (url !== ruta && url !== `${this.api}/certificados/verificar/${encodeURIComponent(codigo)}?archivo=1`) {
      return throwError(() => ({ status: 0, mensaje: 'La URL pública del PDF no corresponde al documento consultado.', errores: {} }));
    }
    return this.pdf(`${this.api}/certificados/verificar/${encodeURIComponent(codigo)}?archivo=1`, false);
  }

  private pdf(url: string, privado: boolean): Observable<ArchivoPdf> {
    return this.http.get(url, { ...(privado ? this.privado : { withCredentials: false }), observe: 'response', responseType: 'blob' }).pipe(
      switchMap(r => from(this.validarPdf(r))), catchError(e => this.error(e)),
    );
  }

  private async validarPdf(respuesta: HttpResponse<Blob>): Promise<ArchivoPdf> {
    const blob = respuesta.body;
    if (!blob || !/^(application\/pdf|application\/octet-stream)(;|$)/i.test(respuesta.headers.get('Content-Type') ?? blob.type)
      || await blob.slice(0, 5).text() !== '%PDF-') throw new Error('Archivo PDF no disponible: Laravel no devolvió un PDF válido.');
    return { blob: new Blob([blob], { type: 'application/pdf' }), nombre: 'certificado.pdf' };
  }

  private error(error: unknown): Observable<never> {
    if (error instanceof HttpErrorResponse && error.error instanceof Blob) {
      return from(error.error.text()).pipe(switchMap(texto => {
        let cuerpo: unknown; try { cuerpo = JSON.parse(texto); } catch { cuerpo = null; }
        return throwError(() => aErrorApi(new HttpErrorResponse({ status: error.status, error: cuerpo })));
      }));
    }
    return throwError(() => error instanceof Error && !(error instanceof HttpErrorResponse)
      ? { status: 502, mensaje: error.message, errores: {} } : aErrorApi(error));
  }
}
