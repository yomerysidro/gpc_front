import { inject, Injectable } from '@angular/core';
import { Observable, throwError, timeout, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../interfaces/api/api-response.interface';
import { DocumentosDigitalesService } from './documentos-digitales.service';
import { ArchivoPdf, VerificacionDocumento } from '../../interfaces/emision-certificados/documento-digital.interface';
import { environment } from '../../../../environments/environment';

export const FORMATO_CODIGO_PUBLICO = /^(?:[a-f0-9]{30}|(?=[A-Za-z0-9]*[A-Za-z])(?=[A-Za-z0-9]*[0-9])[A-Za-z0-9]{2,30})(?![\s\S])/;

export interface CertificadoPublico {
  readonly referencia?: string;
  readonly disponibleRrhh?: boolean;
  readonly codigo: string;
  readonly estado: 'disponible' | 'anulado' | 'no-disponible' | 'no-encontrado' | 'integridad-no-verificada';
  readonly verificado?: boolean;
  readonly fecha: string | null;
  readonly fechaEtiqueta?: 'Fecha del documento' | 'Fecha de sesión';
  readonly urlPdf: string | null;
  readonly tipo: string | null;
  readonly actividad: string | null;
  readonly sesion: string | null;
  readonly estadoPublico: 'Listo para entrega' | 'Disponible para consulta' | 'Certificado registrado y verificado';
}
/** Respuesta pública documentada por PublicCertificateLookup. No contiene identidad privada. */
export interface CertificadoConsultaDni {
  readonly referencia_publica: string;
  readonly codigo_verificacion: string;
  readonly origen: string;
  readonly tipo_certificado: string | null;
  readonly actividad: string | null;
  readonly sesion: string | null;
  readonly fecha_sesion: string | null;
  readonly fecha_generacion?: string | null;
  readonly estado_disponibilidad: string;
  readonly disponible_rrhh: boolean;
  readonly pdf_publicado: boolean;
  readonly url_documento: string | null;
}

@Injectable({ providedIn: 'root' })
export class PortalCertificadosService {
  private readonly documentos = inject(DocumentosDigitalesService);
  private readonly http = inject(HttpClient);

  consultarDni(dni: string): Observable<readonly CertificadoPublico[]> {
    if (!/^[0-9]{8}$/.test(dni)) return throwError(() => ({ status: 422 }));
    return this.http.post<ApiResponse<{ certificados: readonly CertificadoConsultaDni[] }>>(
      `${environment.apiBaseUrl}/portal-certificados/consultar-dni`, { dni },
      { withCredentials: false, transferCache: false }).pipe(timeout(30000), map(respuesta => {
        const filas = respuesta?.data?.certificados;
        const texto = (v: unknown) => v === null || typeof v === 'string';
        if (respuesta?.success !== true || !Array.isArray(filas) || filas.some(r => !r
          || typeof r.referencia_publica !== 'string' || !/^[a-f0-9]{64}$/.test(r.referencia_publica)
          || typeof r.codigo_verificacion !== 'string' || !FORMATO_CODIGO_PUBLICO.test(r.codigo_verificacion)
          || typeof r.origen !== 'string' || typeof r.estado_disponibilidad !== 'string'
          || typeof r.disponible_rrhh !== 'boolean' || typeof r.pdf_publicado !== 'boolean'
          || ![r.tipo_certificado, r.actividad, r.sesion, r.fecha_sesion, r.url_documento].every(texto))) {
          throw { status: 502 };
        }
        return filas.map(r => ({
          referencia: r.referencia_publica, disponibleRrhh: r.disponible_rrhh,
          codigo: r.codigo_verificacion, estado: r.disponible_rrhh ? 'disponible' as const : 'no-disponible' as const,
          tipo: r.tipo_certificado, actividad: r.actividad, sesion: r.sesion,
          fecha: [r.fecha_generacion, r.fecha_sesion].find(v => typeof v === 'string' && !Number.isNaN(Date.parse(v))) ?? null,
          fechaEtiqueta: r.fecha_generacion && !Number.isNaN(Date.parse(r.fecha_generacion)) ? 'Fecha del documento' as const : 'Fecha de sesión' as const,
          estadoPublico: r.estado_disponibilidad === 'Listo para entrega' ? 'Listo para entrega' as const : 'Disponible para consulta' as const,
          urlPdf: r.pdf_publicado === true && r.disponible_rrhh === true ? this.urlPublica(r.url_documento, r.codigo_verificacion) : null,
        }));
      }));
  }

  verificar(codigo: string): Observable<CertificadoPublico> {
    if (!FORMATO_CODIGO_PUBLICO.test(codigo)) return throwError(() => ({ status: 422 }));
    return this.documentos.verificar(codigo).pipe(timeout(30000), map(r => this.proyectar(r)));
  }

  confirmarVigenciaEIntegridad(codigo: string): Observable<boolean> {
    if (!FORMATO_CODIGO_PUBLICO.test(codigo)) return throwError(() => ({ status: 422 }));
    return this.documentos.verificar(codigo).pipe(
      timeout(30000),
      map(r => r.vigente === true && this.proyectar(r).verificado === true),
    );
  }

  archivo(certificado: CertificadoPublico): Observable<ArchivoPdf> {
    if (certificado.estado !== 'disponible' || !certificado.urlPdf) return throwError(() => ({ status: 403 }));
    // El servicio existente valida URL, código, contenido PDF y hash cuando está disponible.
    return this.documentos.archivoPublico(certificado.urlPdf, certificado.codigo).pipe(timeout(60000));
  }

  private proyectar(r: VerificacionDocumento): CertificadoPublico {
    const estados = [r.estado_documento, r.estado_certificado].map(v => v.trim().toLowerCase());
    const anulado = estados.some(v => ['anulado', 'revocado'].includes(v));
    const verificado = !anulado && r.registro_encontrado === true && estados[0] === 'vigente' && r.vigente === true && r.integridad_verificada === true;
    // La autorización pública no exige firma ni emisión criptográfica. El servidor decide su disponibilidad.
    const fecha = [r.fecha_generacion]
      .find(v => typeof v === 'string' && !Number.isNaN(Date.parse(v)));
    const textoPublico = (valor: unknown) => typeof valor === 'string' && valor.trim() ? valor.trim() : null;
    // Proyección cerrada: no se trasladan motivos, beneficiario ni metadatos internos al portal.
    return {
      codigo: r.codigo_verificacion,
      estado: !r.registro_encontrado ? 'no-encontrado' : anulado ? 'anulado' : !r.integridad_verificada ? 'integridad-no-verificada' : verificado ? 'disponible' : 'no-disponible',
      verificado,
      fecha: r.registro_encontrado ? fecha ?? null : null,
      urlPdf: verificado && r.puede_ver_documento === true ? this.urlPublica(r.url_documento, r.codigo_verificacion) : null,
      tipo: r.registro_encontrado ? textoPublico(r.tipo_certificado) : null,
      actividad: r.registro_encontrado ? textoPublico(r.actividad) : null,
      sesion: r.registro_encontrado ? textoPublico(r.sesion) : null,
      estadoPublico: verificado ? 'Certificado registrado y verificado' : 'Disponible para consulta',
    };
  }

  private urlPublica(url: string | null, codigo: string): string | null {
    const ruta = `/certificados/verificar/${codigo}?archivo=1`;
    const destino = `${environment.apiBaseUrl}${ruta}`;
    return url === `/api${ruta}` || url === destino ? destino : null;
  }
}
