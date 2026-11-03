import { inject, Injectable, InjectionToken } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { defer, Observable, throwError } from 'rxjs';
import { aErrorApi } from '../../../shared/utils/error-api';
import { SolicitudesHttpGateway } from './solicitudes-http.gateway';
import { AccionSolicitud, BandejaSolicitud, ContextoSolicitud, DatosSolicitud, DecisionSolicitud, DocumentoPendiente, FiltroSolicitudes, PaginaSolicitudes, Solicitud } from '../../interfaces/solicitudes/solicitud.interface';

/** Puerto de integración: modelos de vista, no rutas ni DTO HTTP inventados. */
export interface SolicitudesGateway {
  accionesPermitidas?(fila: Solicitud): readonly AccionSolicitud[];
  contexto(): Observable<ContextoSolicitud>;
  listar(bandeja: BandejaSolicitud, filtro: FiltroSolicitudes): Observable<PaginaSolicitudes<Solicitud>>;
  detalle(id: string, administrativo?: boolean): Observable<Solicitud>;
  guardar(datos: DatosSolicitud, existente: { id: string; version: string } | null): Observable<Solicitud>;
  decidir(id: string, version: string, accion: AccionSolicitud, motivo: string): Observable<Solicitud>;
  historial(filtro: FiltroSolicitudes): Observable<PaginaSolicitudes<DecisionSolicitud>>;
  documentos(pagina: number): Observable<PaginaSolicitudes<DocumentoPendiente>>;
  /** PDF autorizado devuelto por el servidor, sin URL de archivo privado en la vista. */
  documento(id: string): Observable<Blob>;
}
export const SOLICITUDES_GATEWAY = new InjectionToken<SolicitudesGateway | null>('SOLICITUDES_GATEWAY', { providedIn: 'root', factory: () => {
  const gateway = inject(SolicitudesHttpGateway); return gateway.disponible ? gateway : null;
} });
export class IntegracionSolicitudesPendiente extends Error {
  constructor() { super('El servicio de Solicitudes no está disponible: faltan habilitar las rutas protegidas del backend. No se ha guardado información.'); }
}
export function mensajeSolicitudes(error: unknown): string {
  if (error instanceof HttpErrorResponse) return mensajeSolicitudes(aErrorApi(error));
  if (typeof error === 'object' && error !== null && 'status' in error) {
    if ('codigo' in error && error.codigo === 'SOLICITUD_AREA_NO_AUTORIZADA') return 'El área seleccionada ya no está autorizada para tu usuario. Consulta tus áreas habilitadas nuevamente.';
    if ('codigo' in error && error.codigo === 'SOLICITUD_SIN_AREA_VIGENTE') return 'No tienes un área habilitada para registrar solicitudes';
    if (error.status === 401) return 'Sesión no autenticada o caducada. Inicia sesión para continuar.';
    if (error.status === 403) return 'Laravel rechazó el acceso (403). ' + ('mensaje' in error && typeof error.mensaje === 'string' ? error.mensaje : 'No tienes permiso para realizar esta operación en el ámbito solicitado.');
    if (error.status === 0) return 'No se pudo conectar con el servidor. Comprueba la conexión.';
    if (error.status === 404) return 'La solicitud no existe o ya no está disponible para tu sesión.';
    if (error.status === 409) return 'La solicitud cambió o la transición ya no es compatible. Actualiza los datos antes de reintentar.';
    if (typeof error.status === 'number' && error.status >= 500) return 'No se pudo completar la operación en el servidor. El servicio está temporalmente no disponible. Intenta nuevamente.';
  }
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null && 'mensaje' in error && typeof error.mensaje === 'string') return error.mensaje;
  return 'No fue posible completar la operación. Comprueba la conexión y tus permisos.';
}
@Injectable({ providedIn: 'root' })
export class SolicitudesService {
  private readonly gateway = inject(SOLICITUDES_GATEWAY);
  readonly integrado = this.gateway !== null;
  readonly modo = this.integrado ? 'api' : 'pendiente';
  accionesPermitidas(fila: Solicitud): readonly AccionSolicitud[] { return this.gateway ? this.gateway.accionesPermitidas?.(fila) ?? fila.acciones : []; }
  private ejecutar<T>(operacion: (gateway: SolicitudesGateway) => Observable<T>): Observable<T> {
    return defer(() => this.gateway ? operacion(this.gateway) : throwError(() => new IntegracionSolicitudesPendiente()));
  }
  contexto(): Observable<ContextoSolicitud> { return this.ejecutar(api => api.contexto()); }
  listar(bandeja: BandejaSolicitud, filtro: FiltroSolicitudes): Observable<PaginaSolicitudes<Solicitud>> { return this.ejecutar(api => api.listar(bandeja, filtro)); }
  detalle(id: string, administrativo = false): Observable<Solicitud> { return this.ejecutar(api => api.detalle(id, administrativo)); }
  guardar(datos: DatosSolicitud, existente: { id: string; version: string } | null): Observable<Solicitud> { return this.ejecutar(api => api.guardar(datos, existente)); }
  decidir(id: string, version: string, accion: AccionSolicitud, motivo: string): Observable<Solicitud> { return this.ejecutar(api => api.decidir(id, version, accion, motivo)); }
  historial(filtro: FiltroSolicitudes): Observable<PaginaSolicitudes<DecisionSolicitud>> { return this.ejecutar(api => api.historial(filtro)); }
  documentos(pagina: number): Observable<PaginaSolicitudes<DocumentoPendiente>> { return this.ejecutar(api => api.documentos(pagina)); }
  documento(id: string): Observable<Blob> { return this.ejecutar(api => api.documento(id)); }
}
