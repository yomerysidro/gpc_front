import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { PaginaEmision, CertificadoRow, TipoCertificado, EntidadesEmision } from '../../interfaces/emision-certificados/emision-certificados.interface';
import { EmisionCertificadosService } from '../emision-certificados/emision-certificados.service';
import { environment } from '../../../../environments/environment';
import { AUTHENTICATED_REQUEST } from '../../security/auth-request.context';
import { ApiResponse } from '../../interfaces/api/api-response.interface';
import { Actividad } from '../../interfaces/actividades/actividad.interface';

export type IndicadorRegistrado = 'actividades' | 'certificados' | 'participaciones' | 'asistencias';
export type ActividadReporte = Pick<Actividad, 'id_actividad' | 'nombre' | 'fecha_inicio' | 'estado' | 'sede'> & { readonly fecha_fin: string | null; readonly tipo_actividad: string | null; readonly area?: string | null; readonly sesiones?: number; readonly participaciones?: number };
export type FiltrosReporteActividades = { readonly desde: string; readonly hasta: string; readonly estado: string; readonly q: string };
export type PaginaActividades = PaginaEmision<ActividadReporte> & { readonly resumen?: Readonly<Record<string, number>>; readonly filtros: Omit<FiltrosReporteActividades, 'desde' | 'hasta'> & { readonly desde: string | null; readonly hasta: string | null }; readonly criterio_fecha: 'fecha_inicio' };

export type FiltrosCertificados = FiltrosReporteActividades & { readonly id_tipo_certificado: string; readonly estado_documento: string };
export type FiltrosAsistencia = FiltrosReporteActividades & { readonly id_actividad: string; readonly id_actividad_sesion: string };
export interface CertificadoReporte {
  readonly id_certificado: number; readonly id_persona: number; readonly id_tipo_certificado: number;
  readonly beneficiario: string; readonly tipo_certificado: string | null; readonly actividad: string | null;
  readonly fecha_emision: string | null; readonly estado: string;
  readonly id_certificado_documento: number | null; readonly codigo_verificacion: string | null;
  readonly estado_documento: string | null; readonly fecha_generacion: string | null;
}
export interface AsistenciaReporte {
  readonly id_asistencia: number; readonly id_participacion: number; readonly id_persona: number;
  readonly participante: string; readonly id_actividad: number; readonly actividad: string;
  readonly id_actividad_sesion: number; readonly sesion: string; readonly fecha_sesion: string;
  readonly hora_entrada: string | null; readonly hora_salida: string | null; readonly estado: string;
}
export interface SesionReporte { readonly id_actividad_sesion: number; readonly id_actividad: number; readonly nombre: string; readonly fecha: string; readonly estado: string; }
export type PaginaReporte<T> = PaginaEmision<T> & { readonly resumen: Readonly<Record<string, number>>; readonly criterio_fecha: string; readonly filtros: Readonly<Record<string, unknown>> };
export interface SerieMensual { readonly indicador: 'actividades' | 'certificados'; readonly anio: number; readonly criterio_fecha: string; readonly meses: readonly { readonly mes: string; readonly total: number }[]; }

/** Solo endpoints paginados comprobados en gpc_back. No recorre todas las páginas. */
@Injectable({ providedIn: 'root' })
export class ReportesService {
  private readonly http = inject(HttpClient);
  // Reutiliza environment.apiBaseUrl y AUTHENTICATED_REQUEST del servicio existente.
  private readonly emision = inject(EmisionCertificadosService);

  actividades(page: number, filtros: FiltrosReporteActividades, perPage = 20): Observable<PaginaActividades> {
    let params = new HttpParams().set('page', page).set('per_page', perPage);
    for (const [clave, valor] of Object.entries(filtros)) {
      if (valor !== '') params = params.set(clave, valor);
    }
    return this.http.get<ApiResponse<PaginaActividades>>(`${environment.apiBaseUrl}/reportes/actividades`, {
      params, context: new HttpContext().set(AUTHENTICATED_REQUEST, true),
    }).pipe(map(respuesta => {
      const pagina = respuesta.data;
      if (!respuesta.success || !pagina || !Array.isArray(pagina.data) || !Number.isSafeInteger(pagina.total) || pagina.total < 0
        || !Number.isInteger(pagina.current_page) || pagina.current_page < 1 || !Number.isInteger(pagina.last_page) || pagina.last_page < 1
        || !Number.isInteger(pagina.per_page) || pagina.per_page < 1 || pagina.per_page > 100 || pagina.data.length > pagina.per_page
        || pagina.criterio_fecha !== 'fecha_inicio' || !pagina.filtros) {
        throw new Error('El servidor devolvió un formato de reporte de actividades no válido.');
      }
      return pagina;
    }));
  }

  totalRegistrados(indicador: IndicadorRegistrado): Observable<number> {
    return this.http.get<ApiResponse<{ indicador: IndicadorRegistrado; total: number; filtros: readonly unknown[] }>>(
      `${environment.apiBaseUrl}/reportes/indicadores/${indicador}`,
      { context: new HttpContext().set(AUTHENTICATED_REQUEST, true) },
    ).pipe(map(respuesta => {
      const data = respuesta.data;
      if (!respuesta.success || data?.indicador !== indicador || !Number.isSafeInteger(data.total)
        || data.total < 0 || !Array.isArray(data.filtros) || data.filtros.length !== 0) {
        throw new Error('El servidor devolvió un conteo no válido. Intenta actualizar.');
      }
      return data.total;
    }));
  }

  certificadosReporte(page: number, filtros: FiltrosCertificados): Observable<PaginaReporte<CertificadoReporte>> {
    return this.reporte('certificados', page, filtros);
  }

  asistencias(page: number, filtros: FiltrosAsistencia): Observable<PaginaReporte<AsistenciaReporte>> {
    return this.reporte('asistencia', page, filtros);
  }

  sesiones(idActividad: string, page = 1): Observable<PaginaEmision<SesionReporte>> {
    return this.http.get<ApiResponse<PaginaEmision<SesionReporte>>>(`${environment.apiBaseUrl}/reportes/sesiones`, {
      params: new HttpParams().set('id_actividad', idActividad).set('page', page).set('per_page', 20),
      context: new HttpContext().set(AUTHENTICATED_REQUEST, true),
    }).pipe(map(respuesta => this.validarPagina(respuesta)));
  }

  serie(indicador: 'actividades' | 'certificados', anio: number): Observable<SerieMensual> {
    return this.http.get<ApiResponse<SerieMensual>>(`${environment.apiBaseUrl}/reportes/series/${indicador}`, {
      params: new HttpParams().set('anio', anio), context: new HttpContext().set(AUTHENTICATED_REQUEST, true),
    }).pipe(map(respuesta => {
      const serie = respuesta.data;
      if (!respuesta.success || !serie || serie.indicador !== indicador || serie.anio !== anio || !Array.isArray(serie.meses)
        || serie.meses.length !== 12 || serie.meses.some((mes, index) => mes.mes !== `${anio}-${String(index + 1).padStart(2, '0')}` || !Number.isSafeInteger(mes.total) || mes.total < 0)) {
        throw new Error('El servidor devolvió una serie mensual no válida.');
      }
      return serie;
    }));
  }

  exportar(recurso: 'actividades' | 'certificados' | 'asistencia', filtros: FiltrosReporteActividades | FiltrosCertificados | FiltrosAsistencia): Observable<Blob> {
    return this.http.get(`${environment.apiBaseUrl}/reportes/${recurso}`, {
      params: this.parametros(filtros).set('exportar', 'csv'), responseType: 'blob',
      context: new HttpContext().set(AUTHENTICATED_REQUEST, true),
    });
  }

  private reporte<T>(recurso: string, page: number, filtros: FiltrosCertificados | FiltrosAsistencia): Observable<PaginaReporte<T>> {
    return this.http.get<ApiResponse<PaginaReporte<T>>>(`${environment.apiBaseUrl}/reportes/${recurso}`, {
      params: this.parametros(filtros).set('page', page).set('per_page', 20), context: new HttpContext().set(AUTHENTICATED_REQUEST, true),
    }).pipe(map(respuesta => {
      const pagina = this.validarPagina(respuesta);
      if (!pagina.resumen || pagina.resumen['total'] !== pagina.total || Object.values(pagina.resumen).some(total => !Number.isSafeInteger(total) || total < 0)) {
        throw new Error('El servidor devolvió un resumen de reporte no válido.');
      }
      return pagina;
    }));
  }

  private parametros(filtros: object): HttpParams {
    let params = new HttpParams();
    for (const [clave, valor] of Object.entries(filtros)) if (valor !== '') params = params.set(clave, valor);
    return params;
  }

  private validarPagina<T extends PaginaEmision<unknown>>(respuesta: ApiResponse<T>): T {
    const pagina = respuesta.data;
    if (!respuesta.success || !pagina || !Array.isArray(pagina.data) || !Number.isSafeInteger(pagina.total) || pagina.total < 0
      || !Number.isInteger(pagina.current_page) || pagina.current_page < 1 || !Number.isInteger(pagina.last_page) || pagina.last_page < 1
      || !Number.isInteger(pagina.per_page) || pagina.per_page < 1 || pagina.per_page > 100 || pagina.data.length > pagina.per_page) {
      throw new Error('El servidor devolvió una página de reporte no válida.');
    }
    return pagina;
  }

  certificados(page: number, estado = '', tipo = ''): Observable<PaginaEmision<CertificadoRow>> {
    return this.pagina('certificados', { page, per_page: 20, estado, id_tipo_certificado: tipo });
  }

  tipos(page = 1): Observable<PaginaEmision<TipoCertificado>> {
    return this.pagina('tipos-certificado', { page, per_page: 20 });
  }

  totalCertificados(): Observable<number> {
    return this.pagina('certificados', { per_page: 1 }).pipe(map(pagina => pagina.total));
  }

  totalDocumentos(estado: 'GENERADO' | 'ANULADO'): Observable<number> {
    return this.pagina('certificados-documentos', { per_page: 1, estado })
      .pipe(map(pagina => pagina.total));
  }

  private pagina<K extends 'certificados' | 'tipos-certificado' | 'certificados-documentos'>(recurso: K, filtros: Record<string, string | number>): Observable<PaginaEmision<EntidadesEmision[K]>> {
    return this.emision.listar(recurso, filtros).pipe(map(pagina => {
      if (!pagina || !Array.isArray(pagina.data)
        || !Number.isInteger(pagina.total) || pagina.total < 0
        || !Number.isInteger(pagina.current_page) || pagina.current_page < 1
        || !Number.isInteger(pagina.last_page) || pagina.last_page < 1
        || !Number.isInteger(pagina.per_page) || pagina.per_page < 1 || pagina.per_page > 100) {
        throw new Error('El servidor devolvió un formato de reporte no válido.');
      }
      return pagina;
    }));
  }
}
