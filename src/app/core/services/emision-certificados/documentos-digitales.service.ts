import { HttpClient, HttpContext, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, finalize, shareReplay, defer, from, map, Observable, of, switchMap, throwError, timeout, TimeoutError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse, ErrorApi } from '../../interfaces/api/api-response.interface';
import { ArchivoPdf, DocumentoGenerado, VerificacionDocumento } from '../../interfaces/emision-certificados/documento-digital.interface';
import { AUTHENTICATED_REQUEST } from '../../security/auth-request.context';
import { aErrorApi } from '../../../shared/utils/error-api';
import { decodificarVistaPrevia } from './vista-previa-pdf';
import {
  EvaluacionOrigen, EvaluacionDocumental, EvaluacionPonente, EvaluacionPonenteActividad, EvaluacionPonenteSesion, OrigenDocumental,
  OrigenPonente, PonentesActividadCertificacion, PonentesCertificacion,
} from '../../interfaces/emision-certificados/origenes-certificado.interface';

export interface DocumentoFirmas {
  persistido?: boolean;
  estado_documento?: string;
  puede_visualizar?: boolean;
  puede_descargar?: boolean;
  fecha_sesion?: string | null;
  url_documento?: string; enviado?: boolean; puede_enviar_gerencia?: boolean;
  remision?: { estado_persistido?: string } | null;
  mensaje?: string; mensaje_aprobado?: string; motivo?: string; texto_editable?: boolean;
  modalidad_reconocimiento?: 'individual' | 'actividad' | 'sesion';
  id_actividad_ponente?: number;
  origen?: string;
  id_reconocimiento?: number | null;
  id_practica?: number | null;
  pdf_confirmado?: boolean;
  pdf_revisado_disponible?: boolean;
  disponible_rrhh?: boolean;
  estado_preparacion?: string | null;
  etiqueta_estado?: string;
  responsables_administrativos?: readonly { nombre: string; cargo: string; orden_firma: number }[];
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
  facultades: { remitir: boolean; descargar: boolean; ver?: boolean; visualizar?: boolean };
}
interface PdfRevision { contenido_base64: string; tipo_contenido: string; nombre_archivo: string; persistido: boolean; hash_pdf?: string }
export interface RevisionDocumental { token: string; archivo: ArchivoPdf; expiresAt: string; hash: string; mensaje?: string; motivo?: string; documento?: DocumentoFirmas }
export interface ContextoPreparacion { participacion?: number; sesion: number; tipo: number; persona: number; actividad: number }
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
  if (error.status === 408) return 'No se pudo confirmar el resultado. Actualiza el estado antes de reintentar';
  return estados[error.status] ?? 'No se pudo completar la operación. Actualiza el estado antes de reintentar';
}

@Injectable({ providedIn: 'root' })
export class DocumentosDigitalesService {
  private readonly lecturasSesion = new Map<string, Observable<EvaluacionPonenteSesion | DocumentoFirmas>>();
  /** Lectura puntual sin PDF ni operaciones documentales. */
  consultarReconocimientoSesion(id: number, sesion: number): Observable<EvaluacionPonenteSesion | DocumentoFirmas> {
    const clave = `${id}:${sesion}`;
    const pendiente = this.lecturasSesion.get(clave);
    if (pendiente) return pendiente;
    const consulta = this.http.get<ApiResponse<EvaluacionPonenteSesion | DocumentoFirmas>>(
      `${this.api}/certificaciones/ponente_sesion/${id}/preparar`, {
        ...this.privado, headers: this.sinCache,
        params: { accion: 'consultar_preparacion', modalidad_reconocimiento: 'sesion', id_sesion: sesion },
      }).pipe(timeout(30000), map(r => {
        const d = this.datos(r) as (EvaluacionPonenteSesion | DocumentoFirmas) & { recuperado?: boolean; persistido?: boolean };
        const documento = 'id_certificado_documento' in d;
        if (documento ? d.recuperado !== true || d.persistido !== true || d.id_actividad_ponente !== id || d.id_sesion !== sesion
          : d.recuperado !== false || d.persistido !== false || d.origen !== 'ponente_sesion'
            || d.modalidad_reconocimiento !== 'sesion' || d.id_origen !== id || d.id_sesion !== sesion) {
          throw { status: 409, mensaje: 'Contexto incompatible con el reconocimiento de la sesión.', errores: {} };
        }
        return d;
      }), catchError(error => this.error(error)), finalize(() => this.lecturasSesion.delete(clave)),
      shareReplay({ bufferSize: 1, refCount: true }));
    this.lecturasSesion.set(clave, consulta);
    return consulta;
  }
  consultarPractica(id: number): Observable<DocumentoFirmas | EvaluacionDocumental> {
    return this.http.get<ApiResponse<DocumentoFirmas | EvaluacionDocumental>>(
      this.api + '/certificaciones/practica/' + id + '/preparar',
      { ...this.privado, headers: this.sinCache, params: { accion: 'consultar_preparacion' } }).pipe(timeout(30000), map(r => {
        const d = this.datos(r);
        if (d.origen !== 'practica' || ('id_origen' in d ? d.id_origen !== id : d.id_practica !== id)) throw new Error('La preparación no corresponde a la práctica.');
        return d;
      }), catchError(e => this.error(e)));
  }
  private readonly consultasSesion = new Map<string, Observable<DocumentoFirmas>>();
  consultarReconocimiento(id: number): Observable<DocumentoFirmas | EvaluacionOrigen> {
    return this.http.get<ApiResponse<DocumentoFirmas | EvaluacionOrigen>>(
      `${this.api}/certificaciones/reconocimiento/${id}/preparar`,
      { ...this.privado, headers: this.sinCache, params: { accion: 'consultar_preparacion' } }).pipe(
      timeout(30000), map(r => {
        const d = this.datos(r);
        if (d.origen !== 'reconocimiento' || ('id_origen' in d ? d.id_origen !== id : d.id_reconocimiento !== id)) {
          throw new Error('La preparación no corresponde al reconocimiento individual.');
        }
        return d;
      }), catchError(e => this.error(e)));
  }
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiBaseUrl.replace(/\/$/, '');
  private readonly privado = { context: new HttpContext().set(AUTHENTICATED_REQUEST, true), withCredentials: true };
  private readonly sinCache = { 'Cache-Control': 'no-cache, no-store, max-age=0', Pragma: 'no-cache' };

  revisarOrigen(origen: OrigenDocumental | OrigenPonente, id: number,
    sesion?: { modalidad_reconocimiento: 'sesion'; id_sesion: number; mensaje?: string; motivo?: string }, mensajePractica?: string): Observable<RevisionDocumental & { mensaje: string }> {
    if (mensajePractica !== undefined && origen !== 'practica' && origen !== 'reconocimiento') return throwError(() => ({ status: 422, mensaje: 'El mensaje no corresponde al origen solicitado.', errores: {} }));
    const porSesion = origen === 'ponente_sesion';
    if (porSesion !== !!sesion) {
      return throwError(() => ({ status: 422, mensaje: 'La modalidad solicitada no corresponde a este origen.', errores: {} }));
    }
    if (porSesion && (!Number.isSafeInteger(sesion!.id_sesion) || sesion!.id_sesion < 1)) {
      return throwError(() => ({ status: 422, mensaje: 'La sesión acreditada no es válida.', errores: {} }));
    }
    const modalidad = porSesion
      ? { modalidad_reconocimiento: 'sesion' as const, id_sesion: sesion!.id_sesion }
      : origen === 'ponente_actividad' ? { modalidad_reconocimiento: 'actividad' as const } : {};
    return this.operacionOrigen<{ origen: string; id_origen: number; modo: string; persistido: boolean;
      modalidad_reconocimiento?: string; id_sesion?: number | null; id_actividad_ponente?: number;
      token_revision: string; expires_at: string; hash_pdf: string; mensaje: string; motivo?: string;
      recuperado?: boolean; texto_editable?: boolean; id_certificado_documento?: number;
      vista_previa_pdf: Pick<PdfRevision, 'contenido_base64' | 'tipo_contenido'> }>(origen, id,
      { accion: 'revisar_documento', ...modalidad, ...(sesion?.mensaje !== undefined ? { mensaje: sesion.mensaje, motivo: sesion.motivo } : {}),
        ...((origen === 'practica' || origen === 'reconocimiento') && mensajePractica !== undefined ? { mensaje: mensajePractica } : {}) }).pipe(switchMap(d => {
        if ((origen === 'practica' || origen === 'reconocimiento') && mensajePractica !== undefined && d.mensaje !== mensajePractica) throw new Error('El servidor devolvió un mensaje distinto del solicitado.');
        if (porSesion && d.recuperado === true && d.persistido === true && d.texto_editable === false
          && d.origen === origen && d.id_origen === id && d.id_actividad_ponente === id
          && d.modalidad_reconocimiento === 'sesion' && d.id_sesion === sesion!.id_sesion && d.id_certificado_documento) {
          return this.detalleFirmas(d.id_certificado_documento).pipe(switchMap(documento => {
            if (documento.hash_pdf !== d.hash_pdf || documento.id_actividad_ponente !== id || documento.id_sesion !== sesion!.id_sesion) throw new Error('Documento recuperado incompatible.');
            const archivo = decodificarVistaPrevia({ ...d.vista_previa_pdf, nombre_archivo: 'reconocimiento.pdf', persistido: true }, true);
            return from(this.validarHash(archivo, d.hash_pdf)).pipe(map(() => ({ token: '', expiresAt: '', hash: d.hash_pdf, mensaje: d.mensaje, motivo: d.motivo,
              documento: { ...documento, mensaje: d.mensaje, mensaje_aprobado: d.mensaje, motivo: d.motivo, texto_editable: false }, archivo })));
          }));
        }
        if (porSesion && sesion?.mensaje !== undefined && (d.mensaje !== sesion.mensaje || d.motivo !== sesion.motivo)) throw new Error('El servidor devolvió textos distintos de los solicitados.');
        if (d.origen !== origen || d.id_origen !== id || d.modo !== 'administrativo' || d.persistido !== false
          || !/^[a-f0-9]{64}$/.test(d.token_revision) || typeof d.mensaje !== 'string') throw new Error('No se pudo confirmar la revisión del certificado.');
        if (origen === 'ponente_actividad' && (d.modalidad_reconocimiento !== 'actividad' || d.id_sesion !== null
          || d.id_actividad_ponente !== id)) throw new Error('No se pudo confirmar la modalidad del reconocimiento.');
        if (origen === 'ponente_sesion' && (d.modalidad_reconocimiento !== 'sesion' || Number(d.id_sesion) !== sesion!.id_sesion
          || d.id_actividad_ponente !== id)) throw new Error('No se pudo confirmar la sesión acreditada del reconocimiento.');
        // Este contrato omite persistido dentro del PDF temporal; no modifica sus bytes.
        return this.revisionValidada(d.token_revision, d.expires_at, d.hash_pdf,
          { ...d.vista_previa_pdf, nombre_archivo: 'vista-previa-certificado.pdf', persistido: false }, false)
          .pipe(map(revision => ({ ...revision, mensaje: d.mensaje, motivo: d.motivo })));
      }), catchError(e => this.error(e)));
  }

  guardarOrigen(evaluacion: EvaluacionDocumental, revision: RevisionDocumental): Observable<DocumentoFirmas> {
    const ponente = evaluacion.origen === 'ponente_actividad' || evaluacion.origen === 'ponente_sesion';
    const modalidad = evaluacion.origen === 'ponente_sesion'
      ? { modalidad_reconocimiento: 'sesion' as const, id_sesion: evaluacion.id_sesion }
      : evaluacion.origen === 'ponente_actividad' ? { modalidad_reconocimiento: 'actividad' as const } : {};
    return this.operacionOrigen<DocumentoFirmas & { preparacion_persistida: boolean }>(evaluacion.origen, evaluacion.id_origen,
      { accion: 'confirmar_preparacion', token_revision: revision.token, confirmar: true, ...modalidad,
        ...((evaluacion.origen === 'practica' || evaluacion.origen === 'reconocimiento') && revision.mensaje !== undefined ? { mensaje: revision.mensaje } : {}),
        ...(evaluacion.origen === 'ponente_sesion' && revision.motivo !== undefined ? { mensaje: revision.mensaje, motivo: revision.motivo } : {}) }).pipe(
      switchMap(d => {
        if (d.preparacion_persistida !== true || !Number.isSafeInteger(d.id_certificado_documento) || d.id_certificado_documento < 1) {
          throw new Error('No se pudo confirmar el certificado guardado.');
        }
        if (evaluacion.origen === 'ponente_actividad') {
          if (d.origen !== 'ponente_actividad' || d.modalidad_reconocimiento !== 'actividad' || d.id_sesion !== null
            || d.id_actividad !== evaluacion.id_actividad || d.id_actividad_ponente !== evaluacion.id_origen) throw new Error('No se pudo confirmar el reconocimiento guardado.');
          return this.recuperarReconocimientoActividad(evaluacion, d.id_certificado!, revision.hash);
        }
        if (evaluacion.origen === 'ponente_sesion') {
          if (d.origen !== 'ponente_sesion' || d.modalidad_reconocimiento !== 'sesion'
            || Number(d.id_sesion) !== evaluacion.id_sesion || d.id_actividad !== evaluacion.id_actividad
            || d.id_actividad_ponente !== evaluacion.id_origen) throw new Error('No se pudo confirmar el reconocimiento de esta sesión.');
          return this.recuperarReconocimientoSesion(evaluacion, d.id_certificado!, revision.hash).pipe(map(recuperado => {
            if (recuperado.id_certificado_documento !== d.id_certificado_documento) throw new Error('El documento recuperado no corresponde a la preparación confirmada.');
            return recuperado;
          }));
        }
        return this.detalleFirmas(d.id_certificado_documento).pipe(map(detalle => {
          if (detalle.id_certificado !== d.id_certificado || detalle.hash_pdf !== revision.hash
            || detalle.beneficiario?.id_persona !== evaluacion.id_persona || detalle.id_tipo_certificado !== evaluacion.id_tipo_certificado
            || detalle.origen !== evaluacion.origen || detalle.id_sesion != null
            || !['PREPARADO', 'PENDIENTE_FIRMA'].includes(detalle.estado_certificado)) {
            throw new Error('No se pudo confirmar el origen y el PDF guardado.');
          }
          if ((evaluacion.origen === 'practica' || evaluacion.origen === 'reconocimiento') && revision.mensaje !== undefined
            && (detalle.mensaje_aprobado ?? detalle.mensaje) !== revision.mensaje) throw new Error('El documento guardado no conserva el mensaje aprobado.');
          return detalle;
        }));
      }), catchError(error => {
        if (!ponente || ![0, 408, 409].includes(error?.status)) return this.error(error);
        return this.recuperarPonenteVigente(evaluacion as EvaluacionPonente).pipe(switchMap(vigente => {
          const existentes = vigente.certificados_existentes ?? [];
          if (vigente.id_persona !== evaluacion.id_persona || existentes.length !== 1
            || vigente.puede_consultar_certificado_existente !== true) return throwError(() => error);
          return vigente.origen === 'ponente_sesion' ? this.recuperarReconocimientoSesion(vigente, existentes[0].id_certificado) : this.abrirReconocimientoPonente(vigente, existentes[0].id_certificado);
        }), catchError(e => this.error(e)));
      }));
  }

  recuperarReconocimientoActividad(e: EvaluacionPonenteActividad, certificado: number, hash?: string): Observable<DocumentoFirmas> {
    return this.abrirReconocimientoPonente(e, certificado, hash);
  }

  recuperarReconocimientoSesion(e: EvaluacionPonenteSesion, certificado: number, hash?: string): Observable<DocumentoFirmas> {
    const clave = [e.id_origen, e.id_sesion, certificado, hash ?? ''].join(':');
    const pendiente = this.consultasSesion.get(clave);
    if (pendiente) return pendiente;
    const consulta = this.consultarReconocimientoSesion(e.id_origen, e.id_sesion).pipe(map(resultado => {
        const d = resultado as DocumentoFirmas & { recuperado: boolean; persistido: boolean };
        if (d.recuperado === false && d.persistido === false) {
          throw { status: 404, mensaje: 'Preparación inexistente.', errores: {}, evaluacion: d };
        }
        if (d.recuperado !== true || d.persistido !== true || d.id_certificado !== certificado
          || d.id_actividad_ponente !== e.id_origen || d.id_sesion !== e.id_sesion || d.id_actividad !== e.id_actividad
          || d.beneficiario?.id_persona !== e.id_persona || d.id_tipo_certificado !== e.id_tipo_certificado
          || !Number.isSafeInteger(d.id_certificado_documento) || d.id_certificado_documento < 1
          || hash && d.hash_pdf !== hash) {
          throw { status: 409, mensaje: 'Documento incompatible con la sesión.', errores: {} };
        }
        return d;
      }), catchError(error => this.error(error)), finalize(() => this.consultasSesion.delete(clave)),
      shareReplay({ bufferSize: 1, refCount: true }));
    this.consultasSesion.set(clave, consulta);
    return consulta;
  }

  archivoAdministrativo(url: string, id: number, hash?: string): Observable<ArchivoPdf> {
    const ruta = `/certificados-documentos/${id}/archivo?flujo=firmas`;
    if (url !== `${this.api}${ruta}` && url !== `/api${ruta}`) {
      return throwError(() => ({ status: 409, mensaje: 'Archivo no autorizado.', errores: {} }));
    }
    return this.pdf(`${this.api}${ruta}`, true).pipe(
      switchMap(archivo => hash ? from(this.validarHash(archivo, hash)).pipe(map(() => archivo)) : of(archivo)),
      catchError(error => this.error(error)));
  }

  /** Reutiliza un reconocimiento existente solo si coinciden origen, beneficiario, actividad y sesión. */
  abrirReconocimientoPonente(e: EvaluacionPonente, certificado: number, hash?: string): Observable<DocumentoFirmas> {
    const modalidad: 'actividad' | 'sesion' = e.origen === 'ponente_actividad' ? 'actividad' : 'sesion';
    return this.http.get<ApiResponse<DocumentoFirmas & { id_persona: number }>>(`${this.api}/certificados/detail/${certificado}`,
      { ...this.privado, headers: this.sinCache }).pipe(timeout(30000), map(r => this.datos(r)), switchMap(c => {
        const mismaSesion = modalidad === 'sesion' ? Number(c.id_sesion) === e.id_sesion : c.id_sesion === null;
        if (c.id_certificado !== certificado || c.origen !== e.origen || c.modalidad_reconocimiento !== modalidad || !mismaSesion
          || Number(c.id_actividad) !== Number(e.id_actividad) || c.id_persona !== e.id_persona
          || c.id_tipo_certificado !== e.id_tipo_certificado || c.id_actividad_ponente !== e.id_origen
          || !Number.isSafeInteger(c.id_certificado_documento) || c.id_certificado_documento < 1
          || hash && c.hash_pdf !== hash) throw new Error('No se pudo confirmar la identidad del reconocimiento existente.');
        return this.detalleFirmas(c.id_certificado_documento).pipe(map(d => {
          const detalleSesion = modalidad === 'sesion' ? Number(d.id_sesion) === e.id_sesion : d.id_sesion == null;
          if (d.id_certificado !== certificado || d.beneficiario?.id_persona !== e.id_persona || d.id_tipo_certificado !== e.id_tipo_certificado
            || !detalleSesion || d.hash_pdf !== c.hash_pdf) {
            throw new Error('No se pudo confirmar el PDF del reconocimiento.');
          }
          // El detalle administrativo conserva el origen municipal; el catálogo aporta el contexto aprobado.
          return { ...d, origen: c.origen, modalidad_reconocimiento: c.modalidad_reconocimiento,
            id_actividad: c.id_actividad, actividad: c.actividad, id_sesion: c.id_sesion,
            id_actividad_ponente: c.id_actividad_ponente, id_reconocimiento: c.id_reconocimiento };
        }));
      }), catchError(err => this.error(err)));
  }

  /** Consulta el estado vigente del vínculo antes de reutilizar un guardado incierto. */
  private recuperarPonenteVigente(e: EvaluacionPonente): Observable<EvaluacionPonente> {
    if (e.origen === 'ponente_sesion') {
      return this.http.get<ApiResponse<PonentesCertificacion>>(`${this.api}/activity-session/${e.id_sesion}/ponentes-certificacion`,
        { ...this.privado, headers: this.sinCache }).pipe(timeout(30000), map(r => this.datos(r)), switchMap(d => {
        if (Number(d.id_sesion) !== e.id_sesion || d.relacion_ponente_sesion_disponible !== true || !Array.isArray(d.ponentes_sesion)
          || Number(d.id_actividad) !== Number(e.id_actividad)) return throwError(() => new Error('No se pudo confirmar la sesión del reconocimiento.'));
        const vigente = d.ponentes_sesion.find(p => p.id_actividad_ponente === e.id_origen)?.reconocimiento;
        if (!vigente || vigente.origen !== 'ponente_sesion' || Number(vigente.id_sesion) !== e.id_sesion
          || vigente.id_persona !== e.id_persona || Number(vigente.id_actividad) !== Number(e.id_actividad)) {
          return throwError(() => new Error('No se pudo confirmar el vínculo vigente del ponente con esta sesión.'));
        }
        return of(vigente);
      }));
    }
    return this.http.get<ApiResponse<PonentesActividadCertificacion>>(`${this.api}/activity/${e.id_actividad}/ponentes-certificacion`,
      { ...this.privado, headers: this.sinCache }).pipe(timeout(30000), map(r => this.datos(r)), switchMap(d => {
      const vigente = d.ponentes?.find(p => p.id_actividad_ponente === e.id_origen)?.reconocimiento;
      if (d.id_actividad !== e.id_actividad || d.id_sesion !== null || d.modalidad_reconocimiento !== 'actividad'
        || !vigente || vigente.id_persona !== e.id_persona) {
        return throwError(() => new Error('No se pudo confirmar el vínculo vigente del ponente.'));
      }
      return of(vigente);
    }));
  }

  private operacionOrigen<T>(origen: OrigenDocumental | OrigenPonente, id: number, body: object): Observable<T> {
    return this.http.post<ApiResponse<T>>(`${this.api}/certificaciones/${origen}/${id}/preparar`, body, this.privado)
      .pipe(timeout(90000), map(r => this.datos(r)), catchError(e => this.error(e)));
  }

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

  archivoRrhh(id: number, hash?: string): Observable<ArchivoPdf> {
    return this.pdf(`${this.api}/rrhh/certificados/${id}/pdf`, true).pipe(
      switchMap(archivo => hash ? from(this.validarHash(archivo, hash)).pipe(map(() => archivo)) : of(archivo)),
      catchError(e => this.error(e)),
    );
  }

  pendientesFirma(page: number) {
    return this.http.get<ApiResponse<{ data: DocumentoFirmas[]; current_page: number; last_page: number }>>(
      `${this.api}/certificados-documentos/list`, { ...this.privado, headers: this.sinCache, params: { bandeja: 'por_firmar', page } },
    ).pipe(map(r => this.datos(r)), catchError(e => this.error(e)));
  }

  detalleFirmas(id: number): Observable<DocumentoFirmas> {
    return this.http.get<ApiResponse<DocumentoFirmas>>(`${this.api}/certificados-documentos/detail/${id}`,
      { ...this.privado, headers: this.sinCache, params: { flujo: 'firmas' } }).pipe(timeout(30000), map(r => {
        const d = this.datos(r);
        if (d.id_certificado_documento !== id) throw new Error('Laravel devolvió otro documento.');
        return d;
      }), catchError(e => this.error(e).pipe(catchError(error => throwError(() => ({ ...error,
        errores: { ...error.errores, endpoint: [`/api/certificados-documentos/detail/${id}?flujo=firmas`] } }))))));
  }

  revisarPreparacion(sesion: number, participacion: number, tipo: number, mensaje: string, modalidad: 'Paralela' | 'Secuencial') {
    return this.preparacion<{ accion: string; mensaje: string; token_revision: string; expires_at: string; hash_pdf: string; vista_previa_pdf: PdfRevision }>(sesion,
      { accion: 'revisar_documento', id_participacion: participacion, id_tipo_certificado: tipo, mensaje, modalidad_firma: modalidad }).pipe(
      switchMap(d => {
        if (d.accion !== 'revisar_documento' || d.mensaje !== mensaje || !d.token_revision) throw new Error('Laravel no confirmó la revisión del PDF.');
        return this.revisionValidada(d.token_revision, d.expires_at, d.hash_pdf, d.vista_previa_pdf, false);
      }), catchError(e => this.error(e)));
  }

  private readonly preparacionesInciertas = new Set<string>();

  private buscarPreparacion(contexto: ContextoPreparacion): Observable<DocumentoFirmas | null> {
    if (!contexto.participacion) return of(null);
    return this.http.get<ApiResponse<{ data: { id_participacion: number; id_tipo_certificado: number; id_sesion: number; id_certificado_documento?: number }[] }>>(
      `${this.api}/certificados/list`, { ...this.privado, headers: this.sinCache,
        params: { id_participacion: contexto.participacion, id_sesion: contexto.sesion, id_tipo_certificado: contexto.tipo, per_page: 100 } }).pipe(timeout(30000),
      switchMap(r => {
        const filas = this.datos(r).data.filter(b => b.id_participacion === contexto.participacion
          && b.id_sesion === contexto.sesion && b.id_tipo_certificado === contexto.tipo);
        if (filas.length > 1) throw new Error('No se pudo determinar el documento vigente.');
        return filas[0]?.id_certificado_documento ? this.detalleFirmas(filas[0].id_certificado_documento) : of(null);
      }), catchError(() => throwError(() => ({ status: 408, mensaje: '', errores: {} }))));
  }

  guardarPreparacion(sesion: number, token: string, contexto?: ContextoPreparacion, hash?: string): Observable<DocumentoFirmas> {
    const escribir = () => this.preparacion<DocumentoFirmas>(sesion, { accion: 'confirmar_preparacion', token_revision: token, confirmar: true });
    return defer(() => this.preparacionesInciertas.has(token) && contexto
      ? this.buscarPreparacion(contexto).pipe(switchMap(doc => doc ? of(doc) : escribir())) : escribir()).pipe(
      catchError(error => {
        if (![408, 0, 409].includes(error.status) || !contexto?.participacion) return throwError(() => error);
        this.preparacionesInciertas.add(token);
        return this.buscarPreparacion(contexto).pipe(switchMap(doc => doc ? of(doc) : throwError(() => error)));
      }),
      switchMap(d => {
        const id = d.id_certificado_documento;
        if (!Number.isSafeInteger(id) || id < 1) throw new Error('Laravel no devolvió un documento guardado.');
        this.validarPreparado(d, contexto, hash);
        return this.detalleFirmas(id).pipe(map(detalle => {
          this.validarPreparado(detalle, contexto, hash);
          if (detalle.id_certificado !== d.id_certificado) throw new Error('Laravel devolvió otro certificado.');
          this.preparacionesInciertas.delete(token);
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

  private readonly enviosInciertos = new Map<number, string>();

  confirmarEnvio(id: number, token: string, hash?: string): Observable<DocumentoFirmas> {
    if (this.enviosInciertos.has(id)) {
      return this.detalleFirmas(id).pipe(switchMap(doc => {
        if (doc.estado_certificado === 'PENDIENTE_FIRMA' && (!hash || doc.hash_pdf === hash)) {
          this.enviosInciertos.delete(id); return of(doc);
        }
        if (doc.estado_certificado !== 'PREPARADO' || hash && doc.hash_pdf !== hash) return throwError(() => ({ status: 408, mensaje: '', errores: {} }));
        // Recuperar un resultado incierto solo consulta. Otro envío exige otra acción explícita.
        this.enviosInciertos.delete(id);
        return of(doc);
      }));
    }
    return this.enviarGerencia(id, token, true).pipe(switchMap(r => {
      const d = this.datos(r as ApiResponse<{ enviado: boolean; estado_flujo: string }>);
      if (d.enviado !== true || d.estado_flujo !== 'PENDIENTE_FIRMA') throw new Error('Laravel no confirmó el envío.');
      return this.detalleFirmas(id).pipe(map(doc => {
        if (doc.estado_certificado !== 'PENDIENTE_FIRMA' || hash && doc.hash_pdf !== hash) throw new Error('Laravel no confirmó el estado actualizado y el PDF aprobado.');
        return doc;
      }));
    }), catchError(error => {
      if (![408, 0, 409].includes(error.status)) return this.error(error);
      this.enviosInciertos.set(id, token);
      return this.detalleFirmas(id).pipe(switchMap(doc => {
        if (doc.estado_certificado === 'PENDIENTE_FIRMA' && (!hash || doc.hash_pdf === hash)) {
          this.enviosInciertos.delete(id); return of(doc);
        }
        if (error.status === 409 && doc.estado_certificado === 'PREPARADO') this.enviosInciertos.delete(id);
        return throwError(() => error);
      }), catchError(e => this.error(e === error || [401, 403, 404].includes(e?.status)
        ? e : { status: 408, mensaje: '', errores: {} })));
    }));
  }

  private preparacion<T>(sesion: number, body: object): Observable<T> {
    return this.http.post<ApiResponse<T>>(`${this.api}/activity-session/${sesion}/preparar-certificados`, body, this.privado)
      .pipe(timeout(90000), map(r => this.datos(r)), catchError(e => this.error(e)));
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
    const estadoPersistido = doc.estado_certificado === 'PREPARADO'
      || !!contexto && ['PENDIENTE_FIRMA', 'FIRMADO', 'EMITIDO'].includes(doc.estado_certificado);
    if (!Number.isSafeInteger(doc.id_certificado) || doc.id_certificado! < 1 || !estadoPersistido
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
      .pipe(timeout(90000), catchError(e => this.error(e)));
  }

  archivoPublico(url: string, codigo: string, vistaFirmas = false): Observable<ArchivoPdf> {
    // Se acepta únicamente la URL que el contrato público devuelve para ese código.
    const ruta = `/api/certificados/verificar/${encodeURIComponent(codigo)}?archivo=1`;
    if (url !== ruta && url !== `${this.api}/certificados/verificar/${encodeURIComponent(codigo)}?archivo=1`) {
      return throwError(() => ({ status: 0, mensaje: 'La URL pública del PDF no corresponde al documento consultado.', errores: {} }));
    }
    return this.pdf(`${this.api}/certificados/verificar/${encodeURIComponent(codigo)}?archivo=1${vistaFirmas ? '&vista_firmas=1' : ''}`, false);
  }

  private pdf(url: string, privado: boolean): Observable<ArchivoPdf> {
    return this.http.get(url, { ...(privado ? { ...this.privado, headers: this.sinCache } : { withCredentials: false }), observe: 'response', responseType: 'blob' }).pipe(
      timeout(60000), switchMap(r => from(this.validarPdf(r))), catchError(e => this.error(e)),
    );
  }

  private async validarPdf(respuesta: HttpResponse<Blob>): Promise<ArchivoPdf> {
    const blob = respuesta.body;
    if (!blob || !/^(application\/pdf|application\/octet-stream)(;|$)/i.test(respuesta.headers.get('Content-Type') ?? blob.type)
      || await blob.slice(0, 5).text() !== '%PDF-') throw new Error('Archivo PDF no disponible: Laravel no devolvió un PDF válido.');
    const archivo = { blob: new Blob([blob], { type: 'application/pdf' }), nombre: 'certificado.pdf' };
    const hash = respuesta.headers.get('X-Document-SHA256');
    if (hash) await this.validarHash(archivo, hash);
    return archivo;
  }

  private error(error: unknown): Observable<never> {
    if (error instanceof TimeoutError) return throwError(() => ({ status: 408, mensaje: 'No se pudo confirmar el resultado. Actualiza el estado antes de reintentar', errores: {} }));
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
