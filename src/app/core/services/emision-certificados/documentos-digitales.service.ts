import { HttpClient, HttpContext, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, from, map, Observable, of, switchMap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse, ErrorApi } from '../../interfaces/api/api-response.interface';
import { ArchivoPdf, DocumentoGenerado, VerificacionDocumento } from '../../interfaces/emision-certificados/documento-digital.interface';
import { AUTHENTICATED_REQUEST } from '../../security/auth-request.context';
import { aErrorApi } from '../../../shared/utils/error-api';
import { decodificarVistaPrevia } from './vista-previa-pdf';

export interface DocumentoFirmas {
  id_certificado_documento: number;
  id_certificado?: number;
  id_sesion?: number | null;
  id_tipo_certificado?: number;
  id_actividad?: number;
  hash_pdf?: string;
  hash_pdf_original?: string;
  codigo_verificacion?: string;
  fecha_emision?: string | null;
  modalidad_firma?: 'Paralela' | 'Secuencial';
  asignacion_firmantes_pendiente?: boolean;
  firmas?: { requeridas_configuradas?: number; requeridas?: number; pendientes?: number; registradas?: number; verificadas?: number | null };
  estado_certificado: string;
  estado_flujo?: string;
  beneficiario?: { nombre: string; id_persona?: number };
  contexto?: { nombres: string; apellido_paterno: string | null; apellido_materno: string | null; actividad: string; sesion: string; tipo_certificado: string };
  actividad: string | null;
  sesion: string | null;
  tipo_certificado: string;
  firmantes: readonly { id_firma: number | null; id_persona_trabajador?: number; area?: string | null; nombre?: string; nombre_aprobado?: string; cargo?: string; cargo_aprobado?: string; orden_firma?: number; estado?: string; estado_firma?: string }[];
  facultades: { remitir: boolean; descargar: boolean };
}
interface PdfRevision { contenido_base64: string; tipo_contenido: string; nombre_archivo: string; persistido: boolean; hash_pdf?: string }
export interface RevisionDocumental { token: string; archivo: ArchivoPdf; expiresAt: string; hash: string }
export interface ContextoPreparacion { sesion: number; tipo: number; persona: number; actividad: number }
interface RevisionEnvio { token_revision: string; expires_at: string; documento: DocumentoFirmas; vista_previa_pdf: PdfRevision }
export interface VistaPreviaSesion {
  accion: 'vista_previa'; formato: 'pdf'; emitida: false; creado: false; mensaje: string; mensaje_persistido: false;
  contexto: { id_sesion?: number; id_actividad_sesion?: number; id_participacion: number; id_tipo_certificado: number; id_actividad: number; id_persona: number };
  vista_previa_pdf: { contenido_base64: string; tipo_contenido: string; nombre_archivo: string; persistido: boolean; hash_pdf?: string };
  siguiente_accion_preparacion?: 'revisar_documento' | null;
  motivos_bloqueo_preparacion_persistente?: readonly string[];
  puede_emitir: boolean; puede_emitir_demostracion?: boolean; motivos_bloqueo_emision?: readonly string[];
}

export function mensajeEtapaA(error: ErrorApi): string {
  const detalles = [error.mensaje, ...Object.values(error.errores ?? {}).flat()].join(' ');
  if (error.status >= 500 || /SQLSTATE|postgres|PDOException|select .* from|insert into/i.test(detalles)) return 'No se pudo completar la operación. Intente nuevamente.';
  if (error.status === 403) return 'No tiene permisos para realizar esta acción.';
  if (error.status === 409 && /caduc|venc|expir/i.test(error.mensaje)) return 'La revisión venció. Revise nuevamente el documento.';
  return mensajeDocumento(error);
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
  private readonly sinCache = { 'Cache-Control': 'no-cache, no-store, max-age=0', Pragma: 'no-cache' };

  vistaPrevia(sesion: number, participacion: number, tipo: number, mensaje: string): Observable<{ archivo: ArchivoPdf; datos: Omit<VistaPreviaSesion, 'vista_previa_pdf'> }> {
    return this.http.post<ApiResponse<VistaPreviaSesion>>(`${this.api}/activity-session/${sesion}/preparar-certificados`,
      { accion: 'vista_previa', formato: 'pdf', id_participacion: participacion, id_tipo_certificado: tipo, mensaje }, this.privado).pipe(
      switchMap(r => {
        const d = r.data;
        if (!r.success || d?.accion !== 'vista_previa' || d.formato !== 'pdf' || d.emitida !== false || d.creado !== false
          || d.mensaje_persistido !== false || d.mensaje !== mensaje || Number(d.contexto?.id_sesion ?? d.contexto?.id_actividad_sesion) !== sesion
          || Number(d.contexto?.id_participacion) !== participacion || Number(d.contexto?.id_tipo_certificado) !== tipo) throw new Error('Laravel no confirmó el contexto y el mensaje exactos de la vista previa.');
        const { vista_previa_pdf, ...datos } = d;
        const archivo = decodificarVistaPrevia(vista_previa_pdf);
        const hash = vista_previa_pdf.hash_pdf;
        return hash === undefined ? of({ archivo, datos }) : from(this.validarHash(archivo, hash)).pipe(map(() => ({ archivo, datos })));
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

  archivo(id: number, flujoFirmas = false, hash?: string): Observable<ArchivoPdf> {
    return this.pdf(`${this.api}/certificados-documentos/${id}/${flujoFirmas ? 'firma/pdf-autorizado' : 'archivo'}`, true).pipe(
      switchMap(archivo => hash ? from(this.validarHash(archivo, hash)).pipe(map(() => archivo)) : of(archivo)),
      catchError(e => this.error(e)),
    );
  }

  pendientesFirma(page: number) {
    return this.http.get<ApiResponse<{ data: DocumentoFirmas[]; current_page: number; last_page: number }>>(
      `${this.api}/certificados-documentos/list`, { ...this.privado, params: { bandeja: 'por_firmar', page } },
    ).pipe(map(r => this.datos(r)), catchError(e => this.error(e)));
  }

  detalleFirmas(id: number): Observable<DocumentoFirmas> {
    return this.http.get<ApiResponse<DocumentoFirmas>>(`${this.api}/certificados-documentos/detail/${id}`,
      { ...this.privado, headers: this.sinCache, params: { flujo: 'firmas' } }).pipe(map(r => {
        const d = this.datos(r);
        if (d.id_certificado_documento !== id) throw new Error('Laravel devolvió otro documento.');
        return d;
      }), catchError(e => this.error(e)));
  }

  revisarPreparacion(sesion: number, participacion: number, tipo: number, mensaje: string, modalidad: 'Paralela' | 'Secuencial') {
    return this.preparacion<{ accion: string; mensaje: string; token_revision: string; expires_at: string; hash_pdf: string; vista_previa_pdf: PdfRevision }>(sesion,
      { accion: 'revisar_documento', id_participacion: participacion, id_tipo_certificado: tipo, mensaje, modalidad_firma: modalidad }).pipe(
      switchMap(d => {
        if (d.accion !== 'revisar_documento' || d.mensaje !== mensaje || !d.token_revision) throw new Error('Laravel no confirmó la revisión del PDF.');
        return this.revisionValidada(d.token_revision, d.expires_at, d.hash_pdf, d.vista_previa_pdf, false);
      }), catchError(e => this.error(e)));
  }

  guardarPreparacion(sesion: number, token: string, contexto?: ContextoPreparacion, hash?: string) {
    return this.preparacion<DocumentoFirmas>(sesion, { accion: 'confirmar_preparacion', token_revision: token, confirmar: true }).pipe(
      switchMap(d => {
        const id = d.id_certificado_documento;
        if (!Number.isSafeInteger(id) || id < 1) throw new Error('Laravel no devolvió un documento guardado.');
        this.validarPreparado(d, contexto, hash);
        return this.detalleFirmas(id).pipe(map(detalle => {
          this.validarPreparado(detalle, contexto, hash);
          if (detalle.id_certificado !== d.id_certificado) throw new Error('Laravel devolvió otro certificado.');
          return detalle;
        }));
      }), catchError(e => this.error(e)));
  }

  obtenerRevisionEnvio(id: number, hash?: string) {
    return this.revisarEnvio(id).pipe(switchMap(r => {
      const d = this.datos(r as ApiResponse<RevisionEnvio>);
      if (!d.token_revision || d.documento?.id_certificado_documento !== id || d.vista_previa_pdf?.persistido !== true) {
        throw new Error('Laravel no confirmó la revisión del documento almacenado.');
      }
      if (d.documento.facultades?.remitir !== true || d.documento.estado_certificado !== 'PREPARADO'
        || hash && d.documento.hash_pdf !== hash) throw new Error('El documento cambió o Laravel no autoriza remitirlo.');
      return this.revisionValidada(d.token_revision, d.expires_at, d.documento.hash_pdf!, d.vista_previa_pdf, true);
    }), catchError(e => this.error(e)));
  }

  confirmarEnvio(id: number, token: string, hash?: string) {
    return this.enviarGerencia(id, token, true).pipe(switchMap(r => {
      const d = this.datos(r as ApiResponse<{ enviado: boolean; estado_flujo: string }>);
      if (d.enviado !== true || d.estado_flujo !== 'PENDIENTE_FIRMA') throw new Error('Laravel no confirmó el envío.');
      return this.detalleFirmas(id).pipe(map(doc => {
        if (doc.estado_certificado !== 'PENDIENTE_FIRMA' || hash && doc.hash_pdf !== hash) throw new Error('Laravel no confirmó el estado actualizado y el PDF aprobado.');
        return doc;
      }));
    }), catchError(e => this.error(e)));
  }

  private preparacion<T>(sesion: number, body: object): Observable<T> {
    return this.http.post<ApiResponse<T>>(`${this.api}/activity-session/${sesion}/preparar-certificados`, body, this.privado)
      .pipe(map(r => this.datos(r)), catchError(e => this.error(e)));
  }

  private async validarHash(archivo: ArchivoPdf, hash: string): Promise<void> {
    const bytes = await crypto.subtle.digest('SHA-256', await archivo.blob.arrayBuffer());
    const calculado = Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, '0')).join('');
    if (hash !== calculado) throw new Error('El PDF no coincide con la huella devuelta por Laravel.');
  }

  private revisionValidada(token: string, expiresAt: string, hash: string, pdf: PdfRevision, persistido: boolean): Observable<RevisionDocumental> {
    if (!token || !Number.isFinite(Date.parse(expiresAt)) || !/^[a-f0-9]{64}$/.test(hash)) throw new Error('La revisión de Laravel está incompleta.');
    const archivo = decodificarVistaPrevia(pdf, persistido);
    return from(this.validarHash(archivo, hash)).pipe(map(() => ({ token, archivo, expiresAt, hash })));
  }

  private validarPreparado(doc: DocumentoFirmas, contexto?: ContextoPreparacion, hash?: string): void {
    if (!Number.isSafeInteger(doc.id_certificado) || doc.id_certificado! < 1 || doc.estado_certificado !== 'PREPARADO'
      || hash && doc.hash_pdf !== hash) throw new Error('Laravel no confirmó el certificado preparado y su PDF aprobado.');
    if (contexto && (doc.id_sesion !== contexto.sesion || doc.id_tipo_certificado !== contexto.tipo
      || doc.id_actividad !== contexto.actividad || doc.beneficiario?.id_persona !== contexto.persona)) {
      throw new Error('Laravel devolvió un certificado de otro beneficiario, sesión o tipo.');
    }
  }

  private datos<T>(respuesta: ApiResponse<T>): T {
    if (!respuesta?.success || !respuesta.data) throw new Error('Laravel no confirmó la operación.');
    return respuesta.data;
  }

  revisarEnvio(idDocumento: number): Observable<unknown> {
    return this.operacionEnvio(idDocumento, 'revisar-envio', {});
  }

  enviarGerencia(idDocumento: number, tokenRevision: string, confirmar: true): Observable<unknown> {
    if (confirmar !== true || typeof tokenRevision !== 'string' || !tokenRevision.trim()) {
      return throwError(() => ({ status: 422, mensaje: 'Se requiere revisión y confirmación del documento.', errores: {} }));
    }
    return this.operacionEnvio(idDocumento, 'enviar-gerencia', { token_revision: tokenRevision, confirmar: true });
  }

  private operacionEnvio(id: number, accion: 'revisar-envio' | 'enviar-gerencia', body: object): Observable<unknown> {
    if (!Number.isSafeInteger(id) || id < 1) {
      return throwError(() => ({ status: 422, mensaje: 'Se requiere el identificador del documento registrado.', errores: {} }));
    }
    return this.http.post<unknown>(`${this.api}/certificados-documentos/${id}/${accion}`, body, this.privado)
      .pipe(catchError(e => this.error(e)));
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
    return this.http.get(url, { ...(privado ? { ...this.privado, headers: this.sinCache } : { withCredentials: false }), observe: 'response', responseType: 'blob' }).pipe(
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
    if (error && typeof error === 'object' && 'mensaje' in error && 'status' in error && 'errores' in error) return throwError(() => error);
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
