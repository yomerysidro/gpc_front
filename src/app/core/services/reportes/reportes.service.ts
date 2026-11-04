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
export type ActividadReporte = Pick<Actividad, 'id_actividad' | 'nombre' | 'fecha_inicio' | 'estado' | 'sede'> & { readonly fecha_fin: string | null; readonly tipo_actividad: string | null };
export type FiltrosReporteActividades = { readonly desde: string; readonly hasta: string; readonly estado: string; readonly q: string };
export type PaginaActividades = PaginaEmision<ActividadReporte> & { readonly filtros: Omit<FiltrosReporteActividades, 'desde' | 'hasta'> & { readonly desde: string | null; readonly hasta: string | null }; readonly criterio_fecha: 'fecha_inicio' };

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
