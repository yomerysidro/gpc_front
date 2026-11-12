import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../interfaces/api/api-response.interface';
import { AUTHENTICATED_REQUEST } from '../../security/auth-request.context';
import { aErrorApi } from '../../../shared/utils/error-api';
import { DocumentoFirmas } from './documentos-digitales.service';

export type ModalidadFirma = 'PARALELA' | 'SECUENCIAL';
export interface PlanFirmantes { modalidad: ModalidadFirma; firmantes: { id_persona_trabajador: number; orden_firma: number }[] }
export interface ConfirmacionPdf extends ProgresoFirma {
  persistido: boolean; completada: boolean;
  id_certificado_documento: number; id_certificado: number; codigo_verificacion: string;
  persistencia: 'archivo_privado_versionado'; revision_pdf: string;
}
export interface ProgresoFirma {
  firmantes_asignados?: ResponsableAsignado[];
  requiere_nueva_revision_pdf?: boolean;
  pdf_revisado_disponible?: boolean;
  documento: DocumentoFirmas;
  integridad_verificada: boolean | null;
  modalidad: ModalidadFirma | null;
  modalidad_persistida: boolean;
  asignacion_documental_persistida: boolean;
  firma_verificada: boolean;
  emision_habilitada: boolean;
  entrega_habilitada: boolean;
  demo_disponible: boolean;
  facultades: { asignar: boolean; firmar: boolean; emitir: boolean; descargar_final: boolean };
  requisitos: { motor_pdf_disponible: boolean; firmantes_pendientes_individuales: boolean; modalidad_documental: boolean; vinculo_versiones: boolean };
}
export interface FuncionarioMunicipal { id_persona_trabajador: number; id_persona: number; nombre: string; cargo: string; id_area: number | null; area: string | null; vigente: boolean; disponible_asignacion: boolean; habilitado: boolean }
export interface ResponsableAsignado extends FuncionarioMunicipal { id_firma: number | null; orden_firma: number; estado: string }
export interface RevisionFirmantes { token_revision: string; hash_pdf: string; expires_at: string; id_certificado_documento: number; id_certificado: number; codigo_verificacion: string; modalidad: ModalidadFirma; firmantes: ResponsableAsignado[]; persistido: false; vista_previa_pdf: { contenido_base64: string; tipo_contenido: string } }
export interface ResponsableDisponible { id_firma: number; id_persona: number; nombre: string; cargo: string; credencial_registrada: boolean; credencial_verificada: boolean }
export interface VerificacionFirma { id_certificado_documento: number; id_certificado: number; hash_pdf: string; integridad_verificada: boolean; firma_verificada: boolean; emision_oficial_verificada: boolean; estado_certificado: string }
export interface ResponsableDemo { id_demo: string; nombre: string; cargo: string }
export interface ProgresoDemo {
  modo: 'DEMO'; advertencia: string; id_certificado_documento: number; estado_real: string; hash_pdf_original: string;
  modalidad: ModalidadFirma | null; firmantes_disponibles: ResponsableDemo[];
  firmantes_demo: (ResponsableDemo & { orden_firma: number; simulada: boolean; fecha_simulacion: string | null })[];
  simulacion_completa: boolean; reintento: boolean; asignacion_real_persistida: false;
  firma_verificada: false; emitido: false; entregado: false; fecha_emision: null;
}
export interface AsignacionDemo { modalidad: ModalidadFirma; firmantes: { id_demo: string; orden_firma: number }[]; clave_operacion: string; confirmar: true }
export interface SimulacionDemo { id_demo: string; clave_operacion: string; confirmar: true }
export interface ResultadoLote { id_certificado_documento: number; status: number; success: boolean; data?: ProgresoFirma; message?: string }

@Injectable({ providedIn: 'root' })
export class FirmaDocumentalService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiBaseUrl.replace(/\/$/, '') + '/certificados-documentos';
  private readonly privado = { withCredentials: true, context: new HttpContext().set(AUTHENTICATED_REQUEST, true) };

  progreso(id: number) { return this.consultar<ProgresoFirma>(`${id}/firma/progreso`).pipe(map(d => {
    if (d.documento?.id_certificado_documento !== id) throw new Error('La respuesta corresponde a otro documento.');
    return d;
  })); }
  trabajadores() { return this.respuesta(this.http.get<ApiResponse<{ funcionarios: FuncionarioMunicipal[] }>>(environment.apiBaseUrl.replace(/\/$/, '') + '/funcionarios-firmantes/trabajadores', this.privado)).pipe(map(d => { if (!Array.isArray(d.funcionarios)) throw new Error('Respuesta de funcionarios incompleta.'); return d.funcionarios; })); }
  disponibles(id: number) { return this.consultar<FuncionarioMunicipal[]>(id + '/firma/firmantes-disponibles'); }
  asignados(id: number) { return this.consultar<ProgresoFirma>(id + '/firma/firmantes-asignados'); }
  asignar(id: number, modalidad: ModalidadFirma, firmantes: { id_persona_trabajador: number; orden_firma: number }[]) {
    return this.enviar<ProgresoFirma & { persistido: boolean; completada: boolean }>(id + '/firma/asignar', { modalidad, firmantes, confirmar: true }).pipe(map(d => {
      if (d.persistido !== true || d.completada !== true) throw new Error('Laravel no confirmó el guardado de responsables.');
      const asignados = Array.isArray(d.firmantes_asignados) ? [...d.firmantes_asignados].sort((a, b) => a.orden_firma - b.orden_firma)
        .map(f => ({ id_persona_trabajador: f.id_persona_trabajador, orden_firma: f.orden_firma })) : null;
      if (d.documento?.id_certificado_documento !== id || d.asignacion_documental_persistida !== true
        || d.modalidad !== modalidad || JSON.stringify(asignados) !== JSON.stringify(firmantes)) {
        throw new Error('La asignación devuelta por Laravel no acredita el documento y el plan solicitados. Se consultará su progreso antes de reintentar.');
      }
      return d;
    }));
  }
  revisarPdf(id: number, plan?: PlanFirmantes) {
    // Solo enviar identificadores institucionales y orden; nunca datos del beneficiario.
    const body = plan ? { modalidad: plan.modalidad, firmantes: plan.firmantes.map(f => ({
      id_persona_trabajador: f.id_persona_trabajador, orden_firma: f.orden_firma,
    })) } : {};
    return this.enviar<RevisionFirmantes>(id + '/firma/revision-pdf', body).pipe(map(r => {
      if (r.id_certificado_documento !== id) throw new Error('La vista previa corresponde a otro documento.');
      if (plan && (r.modalidad !== body.modalidad || JSON.stringify(r.firmantes?.map(f => ({ id_persona_trabajador: f.id_persona_trabajador, orden_firma: f.orden_firma }))) !== JSON.stringify(body.firmantes))) {
        throw new Error('La vista previa no corresponde al plan solicitado.');
      }
      return r;
    }));
  }
  descartarPdf(id: number, token_revision: string) { return this.respuesta(this.http.delete<ApiResponse<{ descartado: boolean }>>(this.base + '/' + id + '/firma/revision-pdf', { ...this.privado, body: { token_revision } })); }
  confirmarPdf(id: number, token_revision: string) {
    return this.enviar<ConfirmacionPdf>(id + '/firma/confirmar-pdf', { token_revision, confirmar: true }).pipe(map(d => {
      if (d.completada !== true || d.persistido !== true || d.pdf_revisado_disponible !== true) {
        throw new Error('Laravel no confirmó que el PDF revisado esté vigente. La asignación puede haber quedado guardada.');
      }
      if (d.id_certificado_documento !== id || d.documento?.id_certificado_documento !== id
        || d.id_certificado !== d.documento.id_certificado || d.codigo_verificacion !== d.documento.codigo_verificacion) {
        throw new Error('La confirmación PDF corresponde a otro documento, certificado o código.');
      }
      return d;
    }));
  }
  responsables(id: number) { return this.consultar<ResponsableDisponible[]>(`${id}/firma/firmantes-disponibles`); }
  verificacion(id: number) { return this.consultar<VerificacionFirma>(`${id}/firma/verificacion`).pipe(map(d => {
    if (d.id_certificado_documento !== id) throw new Error('La verificación corresponde a otro documento.');
    return d;
  })); }
  demo(id: number) { return this.consultar<ProgresoDemo>(`${id}/firma/demo/progreso`).pipe(map(d => this.validarDemo(id, d))); }
  asignarDemo(id: number, body: AsignacionDemo) { return this.enviar<ProgresoDemo>(`${id}/firma/demo/asignar`, body).pipe(map(d => this.validarDemo(id, d))); }
  simularDemo(id: number, body: SimulacionDemo) { return this.enviar<ProgresoDemo>(`${id}/firma/demo/simular`, body).pipe(map(d => this.validarDemo(id, d))); }
  lote(ids: number[]) { return this.enviar<{ lote_persistido: false; resultados: ResultadoLote[] }>('firmas/lote/progreso', { ids_documentos: ids }).pipe(map(d => {
    if (!Array.isArray(d.resultados) || d.resultados.length !== ids.length || d.resultados.some((r, i) => r.id_certificado_documento !== ids[i])) throw new Error('El lote recibido no corresponde a los documentos seleccionados.');
    return d;
  })); }
  private validarDemo(id: number, d: ProgresoDemo): ProgresoDemo {
    if (d.modo !== 'DEMO' || d.id_certificado_documento !== id || d.estado_real !== 'PENDIENTE_FIRMA'
      || d.firma_verificada !== false || d.emitido !== false || d.entregado !== false || d.fecha_emision !== null
      || d.asignacion_real_persistida !== false) throw new Error('Laravel no confirmó una demostración sin efectos oficiales.');
    return d;
  }
  private consultar<T>(ruta: string): Observable<T> {
    return this.respuesta(this.http.get<ApiResponse<T>>(`${this.base}/${ruta}`, {
      ...this.privado, headers: { 'Cache-Control': 'no-cache, no-store, max-age=0', Pragma: 'no-cache' },
    }));
  }
  private enviar<T>(ruta: string, body: object): Observable<T> { return this.respuesta(this.http.post<ApiResponse<T>>(`${this.base}/${ruta}`, body, this.privado)); }
  private respuesta<T>(consulta: Observable<ApiResponse<T>>): Observable<T> {
    return consulta.pipe(map(r => {
      if (!r.success || r.data == null) throw new Error('Laravel no confirmó la operación.');
      return r.data;
    }), catchError(e => throwError(() => e instanceof Error && !('status' in e)
      ? { status: 502, mensaje: e.message, errores: {} } : aErrorApi(e))));
  }
}
