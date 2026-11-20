import { HttpClient, HttpContext, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { PonentesActividadCertificacion } from '../../interfaces/emision-certificados/origenes-certificado.interface';
import { CatalogosOrigenes, EstadoAsistenciaPonente, EvaluacionOrigen, OrigenDocumental, PonentesCertificacion, PonentesSesionGestion } from '../../interfaces/emision-certificados/origenes-certificado.interface';
import { inject, Injectable } from '@angular/core';
import { catchError, EMPTY, expand, forkJoin, map, Observable, of, reduce, switchMap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse, ErrorApi } from '../../interfaces/api/api-response.interface';
import {
  EntidadesEmision, FiltrosEmision, OpcionRelacion, PaginaEmision, PayloadEmision,
  RecursoEditable, RecursoEliminable, RecursoEmision, TrabajadorEmision, PersonaReconocimiento, AreaReconocimiento,
} from '../../interfaces/emision-certificados/emision-certificados.interface';
import { AUTHENTICATED_REQUEST } from '../../security/auth-request.context';
import { ActividadRrhh, CertificadoCatalogo, FiltrosCatalogo, SesionRrhh } from '../../interfaces/emision-certificados/catalogo-certificados.interface';
import { aErrorApi } from '../../../shared/utils/error-api';
import { PersonService } from '../person/person.service';
import { PersonWorkerService } from '../person-worker/person-worker.service';
import { AreaService } from '../area/area.service';
import { PersonDocumentService } from '../person-document/person-document.service';
import { DocumentTypeService } from '../document-type/document-type.service';
import { BLOQUEO_ESCRITURA_EMISION, ESCRITURA_EMISION_AUTORIZADA } from './operaciones-emision';
import { EvaluacionCertificacion, FinalizacionSesion, OrigenCertificacion, ParticipantesSesion, PendienteCertificacion, SesionCertificacion } from '../../interfaces/emision-certificados/certificacion-sesion.interface';

/** Ámbitos reales de config/module_permissions.php; no se deducen del nombre de la URL. */
export const PERMISOS_EMISION: Record<RecursoEmision, string> = {
  activity: 'actividades', 'activity-session': 'actividades', 'ativicty-type': 'actividades',
  'activity-speaker': 'ponentes-firmantes', participation: 'participantes',
  'participation-type': 'participantes', attendance: 'participantes',
  certificados: 'emision', 'tipos-certificado': 'emision', reconocimientos: 'reconocimientos',
  'certificados-documentos': 'emision', firmas: 'ponentes-firmantes',
  'certificados-firmas': 'emision', 'consultas-certificado': 'emision',
  'actividades-firmas': 'ponentes-firmantes',
};

@Injectable({ providedIn: 'root' })
export class EmisionCertificadosService {
  ponentesActividad(actividad: number): Observable<PonentesActividadCertificacion> {
    return this.consultaCertificacion<PonentesActividadCertificacion>(`activity/${actividad}/ponentes-certificacion`).pipe(map(d => {
      if (d.id_actividad !== actividad || d.id_sesion !== null || d.modalidad_reconocimiento !== 'actividad'
        || !Array.isArray(d.ponentes) || d.ponentes.some(p => p.id_actividad !== actividad || p.reconocimiento?.origen !== 'ponente_actividad'
          || p.reconocimiento.id_origen !== p.id_actividad_ponente || p.reconocimiento.id_sesion !== null
          || p.reconocimiento.modalidad_reconocimiento !== 'actividad')) throw new Error('No se pudo confirmar el reconocimiento por actividad.');
      return d;
    }));
  }
  catalogosOrigenes(): Observable<CatalogosOrigenes> {
    return this.consultaCertificacion('certificaciones/catalogos-origenes');
  }
  evaluarOrigen(origen: OrigenDocumental, id: number): Observable<EvaluacionOrigen> {
    return this.consultaCertificacion<EvaluacionOrigen>(`${origen === 'practica' ? 'practices' : 'reconocimientos'}/${id}/evaluacion-certificacion`).pipe(map(d => {
      if (d.origen !== origen || d.id_origen !== id || d.id_actividad !== null || d.id_sesion !== null
        || !d[origen] || !Array.isArray(d.motivos_bloqueo) || !Array.isArray(d.certificados_existentes)) {
        throw new Error('No se pudo confirmar el origen del certificado.');
      }
      return d;
    }));
  }
  registrosPracticas(): Observable<readonly { id_practica: number; carrera: string; fecha_inicio: string; fecha_fin: string | null; estado: string }[]> {
    return this.consultaCertificacion('practices/list');
  }
  ponentesCertificacion(sesion: number): Observable<PonentesCertificacion> {
    return this.consultaCertificacion<PonentesCertificacion>(`activity-session/${sesion}/ponentes-certificacion`).pipe(map(d => {
      // Solo se interpreta la vinculación persistida por sesión. Un candidato de actividad no se
      // atribuye a la sesión ni habilita una preparación que Laravel no acredita.
      const filas = d.ponentes_sesion;
      if (Number(d.id_sesion) !== sesion || !Number.isSafeInteger(Number(d.id_actividad)) || Number(d.id_actividad) < 1
        || !Array.isArray(d.ponentes_actividad)) {
        throw { status: 502, mensaje: 'Laravel no confirmó la sesión consultada para los ponentes.', errores: {} };
      }
      if (d.relacion_ponente_sesion_disponible !== true || !Array.isArray(filas)) {
        const motivos = (d.motivos_bloqueo ?? []).filter(m => !/sql|postgres|neon|esquema|schema/i.test(m)).join(' ');
        throw { status: 409, mensaje: ['El servidor no acredita la vinculación de ponentes por sesión.', motivos]
          .filter(Boolean).join(' '), errores: {} };
      }
      if (filas.some(p => Number(p.id_actividad) !== Number(d.id_actividad)
        || p.reconocimiento?.origen !== 'ponente_sesion' || p.reconocimiento.modalidad_reconocimiento !== 'sesion'
        || p.reconocimiento.id_origen !== p.id_actividad_ponente
        || (p.reconocimiento.id_sesion != null && Number(p.reconocimiento.id_sesion) !== sesion)
        || (p.reconocimiento.id_persona != null && Number(p.reconocimiento.id_persona) !== Number(p.id_persona))
        || (p.reconocimiento.id_actividad != null && Number(p.reconocimiento.id_actividad) !== Number(d.id_actividad))
        || ((p.reconocimiento.puede_preparar || p.reconocimiento.puede_consultar_certificado_existente)
          && (Number(p.reconocimiento.id_sesion) !== sesion
            || Number(p.reconocimiento.id_persona) !== Number(p.id_persona)
            || Number(p.reconocimiento.id_actividad) !== Number(d.id_actividad))))) {
        throw { status: 502, mensaje: 'No se pudo confirmar la acreditación de los ponentes de esta sesión.', errores: {} };
      }
      return { ...d, ponentes_sesion: filas };
    }));
  }
  /** Gestión real de vínculos ponente–sesión; no crea personas ni trabajadores. */
  ponentesSesion(actividad: number, sesion: number): Observable<PonentesSesionGestion> {
    return this.consultaCertificacion<PonentesSesionGestion>(`activity/${actividad}/sessions/${sesion}/ponentes`).pipe(map(d => {
      if (Number(d.id_actividad) !== actividad || Number(d.id_sesion) !== sesion
        || !Array.isArray(d.ponentes_disponibles) || !Array.isArray(d.vinculos)
        || d.vinculos.some(v => Number(v.id_actividad) !== actividad || Number(v.id_actividad_sesion) !== sesion)) {
        throw { status: 502, mensaje: 'Laravel no confirmó la sesión consultada para los ponentes.', errores: {} };
      }
      return d;
    }));
  }
  marcarAsistenciaPonente(actividad: number, sesion: number, vinculo: number, estado: EstadoAsistenciaPonente): Observable<EstadoAsistenciaPonente> {
    return this.http.put<ApiResponse<{ id_actividad_sesion: number; id_actividad_ponente: number; estado_asistencia: EstadoAsistenciaPonente }>>(
      `${this.api}/activity/${actividad}/sessions/${sesion}/ponentes/${vinculo}/asistencia`, { estado },
      { ...this.opciones(), withCredentials: true },
    ).pipe(map(respuesta => {
      const datos = this.datos(respuesta);
      if (datos?.id_actividad_sesion !== sesion || datos?.id_actividad_ponente !== vinculo || datos?.estado_asistencia !== estado) {
        throw new HttpErrorResponse({ status: 502, error: { message: 'Laravel no confirmó la asistencia del ponente.' } });
      }
      return datos.estado_asistencia;
    }), catchError(error => this.error(error)));
  }
  vincularPonenteSesion(actividad: number, sesion: number, idPersonaPonente: number): Observable<{ vinculo: { id_actividad_ponente: number } }> {
    if (!aciertoPositivo(actividad) || !aciertoPositivo(sesion) || !aciertoPositivo(idPersonaPonente)) {
      return throwError(() => ({ status: 422, mensaje: 'Selecciona un ponente del catálogo para esta sesión.', errores: {} }));
    }
    return this.http.post<ApiResponse<{ vinculo: { id_actividad_ponente: number } }>>(
      `${this.api}/activity/${actividad}/sessions/${sesion}/ponentes`, { id_persona_ponente: idPersonaPonente },
      { ...this.opciones(), withCredentials: true }).pipe(map(r => {
        const d = this.datos(r);
        if (!Number.isSafeInteger(d?.vinculo?.id_actividad_ponente) || d.vinculo.id_actividad_ponente < 1) {
          throw new HttpErrorResponse({ status: 502, error: { message: 'Laravel no confirmó el vínculo del ponente.' } });
        }
        return d;
      }), catchError(e => this.error(e)));
  }
  desvincularPonenteSesion(actividad: number, sesion: number, idActividadPonente: number): Observable<{ desvinculado: true }> {
    if (!aciertoPositivo(actividad) || !aciertoPositivo(sesion) || !aciertoPositivo(idActividadPonente)) {
      return throwError(() => ({ status: 422, mensaje: 'Selecciona un vínculo válido de esta sesión.', errores: {} }));
    }
    return this.http.delete<ApiResponse<{ desvinculado: true }>>(
      `${this.api}/activity/${actividad}/sessions/${sesion}/ponentes`,
      { ...this.opciones(), withCredentials: true, body: { id_actividad_ponente: idActividadPonente } }).pipe(map(r => {
        const d = this.datos(r);
        if (d?.desvinculado !== true) throw new HttpErrorResponse({ status: 502, error: { message: 'Laravel no confirmó la desvinculación.' } });
        return d;
      }), catchError(e => this.error(e)));
  }
  catalogoAutorizado(filtros: FiltrosCatalogo = {}, recurso: 'certificados' | 'certificados-documentos' = 'certificados'): Observable<readonly CertificadoCatalogo[]> {
    return this.paginaCatalogo<CertificadoCatalogo>(`${recurso}/list`, { ...filtros, page: 1, per_page: 100 }).pipe(
      expand(p => p.current_page < p.last_page
        ? this.paginaCatalogo<CertificadoCatalogo>(`${recurso}/list`, { ...filtros, page: p.current_page + 1, per_page: 100 }) : EMPTY),
      reduce((filas, p) => [...filas, ...p.data], [] as CertificadoCatalogo[]),
      // Una nueva respuesta reemplaza la misma identidad; nunca se agrupa por persona o actividad.
      map(filas => [...new Map(filas.map(f => [`${f.id_certificado}:${f.id_certificado_documento}`, f])).values()]),
    );
  }
  catalogoCertificados(page: number, filtros: FiltrosCatalogo = {}): Observable<PaginaEmision<CertificadoCatalogo>> {
    return this.paginaCatalogo<CertificadoCatalogo>('certificados/list', { ...filtros, page, per_page: 20 });
  }
  actividadesRrhh(page = 1): Observable<PaginaEmision<ActividadRrhh>> {
    return this.paginaCatalogo<ActividadRrhh>('rrhh/actividades', { page });
  }
  sesionesRrhh(actividad: number, page = 1): Observable<PaginaEmision<SesionRrhh>> {
    return this.paginaCatalogo<SesionRrhh>(`rrhh/actividades/${actividad}/sesiones`, { page });
  }
  certificadosRrhh(sesion: number, page = 1, persona = ''): Observable<PaginaEmision<CertificadoCatalogo>> {
    return this.paginaCatalogo<CertificadoCatalogo>(`rrhh/sesiones/${sesion}/certificados`, { page, id_persona: persona });
  }
  private paginaCatalogo<T>(ruta: string, filtros: FiltrosEmision): Observable<PaginaEmision<T>> {
    let params = new HttpParams();
    for (const [clave, valor] of Object.entries(filtros)) {
      if (valor !== undefined && valor !== null && valor !== '') params = params.set(clave, String(valor));
    }
    return this.http.get<ApiResponse<PaginaEmision<T>>>(`${this.api}/${ruta}`, {
      ...this.opciones(), withCredentials: true, params,
      headers: { 'Cache-Control': 'no-cache, no-store, max-age=0', Pragma: 'no-cache' },
    }).pipe(map(r => {
      const pagina = this.datos(r);
      if (!Array.isArray(pagina?.data) || !Number.isSafeInteger(pagina.total) || pagina.total < 0
        || !Number.isSafeInteger(pagina.current_page) || pagina.current_page < 1
        || !Number.isSafeInteger(pagina.last_page) || pagina.last_page < 1
        || !Number.isSafeInteger(pagina.per_page) || pagina.per_page < 1 || pagina.per_page > 100) {
        throw new Error('El catálogo de certificados devolvió una página inválida.');
      }
      return pagina;
    }), catchError(e => this.error(e)));
  }
  private readonly escrituraAutorizada = inject(ESCRITURA_EMISION_AUTORIZADA);
  private escrituraBloqueada(recurso: RecursoEmision): boolean {
    return !this.escrituraAutorizada && ['certificados', 'certificados-documentos', 'firmas', 'actividades-firmas'].includes(recurso);
  }
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiBaseUrl;
  private readonly personas = inject(PersonService);
  private readonly personal = inject(PersonWorkerService);
  private readonly areas = inject(AreaService);
  private readonly documentosPersona = inject(PersonDocumentService);
  private readonly tiposDocumento = inject(DocumentTypeService);

  estadoSesionCertificacion(id: number): Observable<SesionCertificacion> {
    return this.consultaCertificacion<SesionCertificacion>(`activity-session/${id}`);
  }
  participantesSesion(id: number, candidatos = false): Observable<ParticipantesSesion> {
    return this.consultaCertificacion<ParticipantesSesion>(`activity-session/${id}/participantes${candidatos ? '/candidatos' : ''}`);
  }
  seleccionarParticipantesSesion(id: number, ids: readonly number[]): Observable<ParticipantesSesion> {
    return this.http.post<ApiResponse<ParticipantesSesion>>(`${this.api}/activity-session/${id}/participantes`,
      { ids_participacion: ids }, { ...this.opciones(), withCredentials: true }).pipe(map(r => this.datos(r)), catchError(e => this.error(e)));
  }
  pendientesCertificacion(filtros: FiltrosEmision = {}): Observable<PaginaEmision<PendienteCertificacion>> {
    return this.consultaCertificacion<PaginaEmision<PendienteCertificacion>>('certificaciones/pendientes', filtros);
  }
  beneficiariosCertificacion(origen: OrigenCertificacion, id: number, filtros: FiltrosEmision = {}): Observable<EvaluacionCertificacion> {
    return this.consultaCertificacion<EvaluacionCertificacion>(origen === 'sesion' ? `activity-session/${id}/beneficiarios` : `activity/${id}/beneficiarios-certificacion`, filtros).pipe(
      switchMap(evaluacion => !evaluacion.beneficiarios.data.length || evaluacion.origen !== origen
        || origen === 'sesion' && Number(evaluacion.contexto.id_sesion) !== id
        ? of(evaluacion) : forkJoin(evaluacion.beneficiarios.data.map(b =>
        !b.id_tipo_certificado || Number(b.id_actividad) !== Number(evaluacion.contexto.id_actividad)
          || origen === 'sesion' && Number(b.id_sesion) !== id ? of(b) :
        this.listarTodos('certificados', { id_participacion: b.id_participacion, id_sesion: b.id_sesion, id_tipo_certificado: b.id_tipo_certificado }).pipe(
          map(filas => {
            const coincidentes = filas.filter(c => c.id_participacion === b.id_participacion && c.id_tipo_certificado === b.id_tipo_certificado
              && (c['id_sesion'] ?? c['id_actividad_sesion'] ?? null) === b.id_sesion
              && c.id_persona === b.id_persona && c.estado !== false && c.estado !== 'ANULADO');
            const documentos = new Set(coincidentes.map(c => `${c.id_certificado}:${c['id_certificado_documento'] ?? ''}`));
            if (documentos.size > 1) throw { status: 409, mensaje: 'Hay más de un documento para esta participación, sesión y tipo. No se pudo confirmar el certificado vigente.', errores: {} } satisfies ErrorApi;
            const certificado = coincidentes[0];
            return certificado ? { ...b, id_certificado: certificado.id_certificado,
              id_certificado_documento: Number(certificado['id_certificado_documento']) || b.id_certificado_documento,
              estado_documento: String(certificado['estado_certificado'] ?? b.estado_documento ?? ''),
              estado_preparacion: String(certificado['estado_preparacion'] ?? b.estado_preparacion ?? ''),
              disponible_rrhh: certificado['disponible_rrhh'] === true,
              pdf_confirmado: certificado['pdf_confirmado'] === true } : b;
          }),
        ),
      )).pipe(map(beneficiarios => ({ ...evaluacion, beneficiarios: { ...evaluacion.beneficiarios, data: beneficiarios } })))),
    );
  }
  finalizarSesion(id: number, actividad: number): Observable<FinalizacionSesion> {
    return this.http.post<ApiResponse<FinalizacionSesion>>(`${this.api}/activity-session/${id}/finalizar`,
      { id_actividad: actividad, id_sesion: id }, { ...this.opciones(), withCredentials: true }).pipe(map(r => this.datos(r)), catchError(e => this.error(e)));
  }
  private consultaCertificacion<T>(ruta: string, filtros: FiltrosEmision = {}): Observable<T> {
    let params = new HttpParams();
    for (const [campo, valor] of Object.entries(filtros)) if (valor !== undefined && valor !== null && valor !== '') params = params.set(campo, String(valor));
    return this.http.get<ApiResponse<T>>(`${this.api}/${ruta}`, { ...this.opciones(), withCredentials: true, params, headers: { 'Cache-Control': 'no-cache, no-store, max-age=0', Pragma: 'no-cache' } }).pipe(map(r => this.datos(r)), catchError(e => this.error(e)));
  }

  listar<K extends RecursoEmision>(recurso: K, filtros: FiltrosEmision = {}): Observable<PaginaEmision<EntidadesEmision[K]>> {
    if (this.esListaSimple(recurso)) {
      return this.http.get<ApiResponse<readonly EntidadesEmision[K][]>>(this.ruta(recurso, 'listar'), this.opciones()).pipe(
        map(respuesta => {
          const filas = this.datos(respuesta).map(fila => this.registro(recurso, fila)).filter(fila => Object.entries(filtros).every(([campo, valor]) =>
            ['page', 'per_page'].includes(campo) || valor === null || valor === undefined || valor === '' || String(fila[campo]) === String(valor)));
          const perPage = Math.min(100, Math.max(1, Number(filtros['per_page']) || 20));
          const ultima = Math.max(1, Math.ceil(filas.length / perPage));
          const pagina = Math.min(ultima, Math.max(1, Number(filtros['page']) || 1));
          return { data: filas.slice((pagina - 1) * perPage, pagina * perPage), total: filas.length, current_page: pagina, last_page: ultima, per_page: perPage };
        }), catchError(error => this.error(error)),
      );
    }
    let params = new HttpParams();
    for (const [campo, valor] of Object.entries(filtros)) {
      if (valor !== undefined && valor !== null && valor !== '') {
        params = params.set(campo, typeof valor === 'boolean' ? Number(valor) : valor);
      }
    }
    return this.http.get<ApiResponse<PaginaEmision<EntidadesEmision[K]>>>(`${this.api}/${recurso}/list`, {
      ...this.opciones(), params,
      ...(['certificados', 'certificados-documentos'].includes(recurso)
        ? { headers: { 'Cache-Control': 'no-cache, no-store, max-age=0', Pragma: 'no-cache' } } : {}),
    }).pipe(map(respuesta => this.datos(respuesta)), catchError(error => this.error(error)));
  }

  obtener<K extends RecursoEmision>(recurso: K, id: number): Observable<EntidadesEmision[K]> {
    return this.http.get<ApiResponse<EntidadesEmision[K]>>(this.ruta(recurso, 'obtener', id), this.opciones())
      .pipe(map(respuesta => this.registro(recurso, this.datos(respuesta))), catchError(error => this.error(error)));
  }

  /** Historial completo: no confundir los primeros 100 registros con todo el historial. */
  listarTodos<K extends RecursoEmision>(recurso: K, filtros: FiltrosEmision = {}): Observable<readonly EntidadesEmision[K][]> {
    if (this.esListaSimple(recurso)) {
      let params = new HttpParams();
      for (const [campo, valor] of Object.entries(filtros)) {
        if (valor !== undefined && valor !== null && valor !== '') params = params.set(campo, typeof valor === 'boolean' ? Number(valor) : valor);
      }
      return this.http.get<ApiResponse<readonly EntidadesEmision[K][]>>(this.ruta(recurso, 'listar'), { ...this.opciones(), params })
        .pipe(map(respuesta => {
          const filas = this.datos(respuesta);
          if (!Array.isArray(filas)) throw new Error('Respuesta de catálogo inválida.');
          return filas.map(fila => this.registro(recurso, fila));
        }), catchError(error => this.error(error)));
    }
    return this.listar(recurso, { ...filtros, page: 1, per_page: 100 }).pipe(
      expand(pagina => pagina.current_page < pagina.last_page
        ? this.listar(recurso, { ...filtros, page: pagina.current_page + 1, per_page: 100 }) : EMPTY),
      reduce((filas, pagina) => [...filas, ...pagina.data], [] as EntidadesEmision[K][]),
    );
  }

  trabajadores(): Observable<readonly TrabajadorEmision[]> {
    return this.personal.listar()
      .pipe(map(filas => filas.map(fila => ({
        id_persona_trabajador: fila.id_persona_trabajador, id_persona: fila.id_persona, id_area: fila.id_area,
        cargo: fila.cargo, estado: fila.estado,
      }))), catchError(error => this.error(error)));
  }

  /** Lecturas existentes de Gestion. Laravel decide el acceso; un 403 nunca se omite. */
  personaReconocimiento(id: number): Observable<PersonaReconocimiento> {
    return this.personas.obtener(id).pipe(
      map(data => ({ id_persona: data.id_persona, nombres: data.nombres,
        apellido_paterno: data.apellido_paterno, apellido_materno: data.apellido_materno })),
      catchError(error => this.error(error)),
    );
  }

  areaReconocimiento(id: number): Observable<AreaReconocimiento> {
    return this.areas.obtener(id).pipe(
      map(data => ({ id_area: data.id_area, nombre: data.nombre })), catchError(error => this.error(error)),
    );
  }

  /** DNI identificado por el catálogo real, nunca por un ID de tipo supuesto. */
  documentosIdentidad(): Observable<Readonly<Partial<Record<number, string>>>> {
    return forkJoin({
      documentos: this.documentosPersona.listar(),
      tipos: this.tiposDocumento.listar(),
    }).pipe(map(({ documentos, tipos }) => {
      const ids = new Set(tipos.filter(tipo => tipo.nombre.trim().toUpperCase() === 'DNI' || tipo.nombre.trim().toUpperCase() === 'DOCUMENTO NACIONAL DE IDENTIDAD').map(tipo => tipo.id_tipo_documento));
      const resultado: Partial<Record<number, string>> = {};
      for (const fila of documentos) {
        if (ids.has(fila.id_tipo_documento) && !resultado[fila.id_persona]) resultado[fila.id_persona] = fila.numero_documento;
      }
      return resultado;
    }), catchError(error => this.error(error)));
  }

  crear<K extends RecursoEditable>(recurso: K, payload: PayloadEmision[K]): Observable<EntidadesEmision[K]> {
    if (recurso === 'activity') return throwError(() => ({ status: 403, mensaje: 'Las actividades nuevas requieren una solicitud aprobada.', errores: {} }));
    if (this.escrituraBloqueada(recurso)) return throwError(() => ({ status: 403, mensaje: BLOQUEO_ESCRITURA_EMISION, errores: {} }));
    return this.http.post<ApiResponse<EntidadesEmision[K]>>(this.ruta(recurso, 'crear'), this.payload(recurso, payload), this.opciones())
      .pipe(map(respuesta => this.registro(recurso, this.datos(respuesta))), catchError(error => this.error(error)));
  }

  actualizar<K extends RecursoEditable>(recurso: K, id: number, payload: Partial<PayloadEmision[K]>): Observable<EntidadesEmision[K]> {
    if (this.escrituraBloqueada(recurso)) return throwError(() => ({ status: 403, mensaje: BLOQUEO_ESCRITURA_EMISION, errores: {} }));
    return this.http.patch<ApiResponse<EntidadesEmision[K]>>(this.ruta(recurso, 'actualizar', id), this.payload(recurso, payload), this.opciones())
      .pipe(map(respuesta => this.registro(recurso, this.datos(respuesta))), catchError(error => this.error(error)));
  }

  eliminar(recurso: RecursoEliminable, id: number): Observable<void> {
    if (this.escrituraBloqueada(recurso)) return throwError(() => ({ status: 403, mensaje: BLOQUEO_ESCRITURA_EMISION, errores: {} }));
    return this.http.delete<ApiResponse<null>>(this.ruta(recurso, 'eliminar', id), this.opciones())
      .pipe(map(respuesta => { this.datos(respuesta); }), catchError(error => this.error(error)));
  }

  relacionRegistros(ruta: 'practices/list' | 'participation' | 'person-workers/list' | 'practicing-individuals/list'):
    Observable<readonly Record<string, string | number | boolean | null>[]> {
    return this.http.get<ApiResponse<readonly Record<string, string | number | boolean | null>[]>>(`${this.api}/${ruta}`, this.opciones())
      .pipe(map(respuesta => this.datos(respuesta)), catchError(error => this.error(error)));
  }

  /** Solo lecturas de Gestión y Actividades para elegir relaciones existentes. */
  relaciones(campo: string): Observable<readonly OpcionRelacion[]> {
    const rutas: Record<string, { url: string; clave: string; texto: string }> = {
      id_persona_trabajador: { url: 'person-workers/list', clave: 'id_persona_trabajador', texto: 'cargo' },
      id_practica: { url: 'practices/list', clave: 'id_practica', texto: 'carrera' },
      id_participacion: { url: 'participation', clave: 'id_participacion', texto: 'id_persona' },
      id_actividad: { url: 'activity', clave: 'id_actividad', texto: 'nombre' },
      id_persona: { url: 'persons/list', clave: 'id_persona', texto: 'nombres' },
      id_area: { url: 'areas/list', clave: 'id_area', texto: 'nombre' },
      id_persona_ponente: { url: 'person-speakers/list', clave: 'id_persona_ponente', texto: 'cargo' },
      id_tipo_actividad: { url: 'ativicty-type', clave: 'id_tipo_actividad', texto: 'nombre' },
      id_tipo_participacion: { url: 'participation-type', clave: 'id_tipo_participacion', texto: 'nombre' },
      id_actividad_sesion: { url: 'activity-session', clave: 'id_actividad_sesion', texto: 'nombre' },
    };
    const ruta = rutas[campo];
    if (!ruta) return throwError(() => new Error('Relación no configurada.'));
    return this.http.get<ApiResponse<readonly Record<string, string | number | null>[]>>(`${this.api}/${ruta.url}`, this.opciones())
      .pipe(map(respuesta => this.datos(respuesta).map(fila => ({
        id: Number(fila[ruta.clave]), texto: `#${fila[ruta.clave]} · ${fila[ruta.texto] ?? ''}`,
        ...(campo === 'id_actividad' && typeof fila['fecha_inicio'] === 'string' ? { fechaInicio: fila['fecha_inicio'] } : {}),
      }))), catchError(error => this.error(error)));
  }

  private opciones(): { context: HttpContext } {
    return { context: new HttpContext().set(AUTHENTICATED_REQUEST, true) };
  }

  private datos<T>(respuesta: ApiResponse<T>): T {
    if (respuesta.success !== true) throw new HttpErrorResponse({ status: 502, error: { message: respuesta.message || 'Laravel no confirmó la operación.' } });
    return respuesta.data;
  }

  private esListaSimple(recurso: RecursoEmision): boolean {
    return ['activity', 'activity-session', 'activity-speaker', 'ativicty-type', 'participation', 'participation-type', 'attendance'].includes(recurso);
  }

  private ruta(recurso: RecursoEmision, accion: 'listar' | 'obtener' | 'crear' | 'actualizar' | 'eliminar', id?: number): string {
    const base = `${this.api}/${recurso}`;
    if (this.esListaSimple(recurso) && recurso !== 'attendance') return accion === 'listar' || accion === 'crear' ? base : `${base}/${id}`;
    const operacion = { listar: 'list', obtener: recurso === 'attendance' ? '' : 'detail/', crear: 'create', actualizar: 'update/', eliminar: 'delete/' }[accion];
    return `${base}/${operacion}${id ?? ''}`;
  }

  /** AttendanceController valida nombres en mayúsculas; sus lecturas usan minúsculas. */
  private payload(recurso: RecursoEditable, datos: object): object {
    return recurso === 'attendance' ? Object.fromEntries(Object.entries(datos).map(([campo, valor]) => [campo.toLowerCase(), valor])) : datos;
  }

  private registro<T extends object>(recurso: RecursoEmision, datos: T): T {
    return recurso === 'attendance' ? Object.fromEntries(Object.entries(datos).map(([campo, valor]) => [campo.toLowerCase(), valor])) as T : datos;
  }

  private error(error: unknown): Observable<never> {
    const normalizado = aErrorApi(error);
    if (error instanceof HttpErrorResponse && error.status === 409 &&
      [error.error?.code, error.error?.codigo, error.error?.data?.code, error.error?.data?.codigo].includes('ESQUEMA_PREPARACION_NO_DISPONIBLE')) {
      return throwError(() => ({ ...normalizado, mensaje: 'La preparación de certificados por sesión estará disponible cuando se complete su estructura de datos', errores: { detalle: [normalizado.mensaje] } }));
    }
    if (error instanceof HttpErrorResponse && Array.isArray(error.error?.data?.motivos_bloqueo)) {
      const motivos = error.error.data.motivos_bloqueo.filter((m: unknown) => typeof m === 'string');
      return throwError(() => ({ ...normalizado, mensaje: [...new Set([normalizado.mensaje, ...motivos])].join(' ') }));
    }
    // Los Data de Emisión usan {data: {campo: [mensajes]}} para los 422.
    if (error instanceof HttpErrorResponse && error.status === 422) {
      const data: unknown = error.error?.data;
      const errores: Record<string, readonly string[]> = { ...normalizado.errores };
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        for (const [campo, mensajes] of Object.entries(data)) {
          if (Array.isArray(mensajes) && mensajes.every(mensaje => typeof mensaje === 'string')) errores[campo] = mensajes;
        }
      }
      const validacion: ErrorApi = { ...normalizado, errores };
      return throwError(() => validacion);
    }
    return throwError(() => normalizado);
  }
}

/** Los identificadores reales de Laravel son enteros positivos. */
function aciertoPositivo(valor: number): boolean {
  return Number.isSafeInteger(valor) && valor > 0;
}
