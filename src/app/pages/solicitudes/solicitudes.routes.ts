import { Route } from '@angular/router';
/** Conserva las URL del menú y sus guards actuales; solo sustituye las seis vistas preliminares. */
export const VISTAS_SOLICITUDES: Partial<Record<string, NonNullable<Route['loadComponent']>>> = {
  'solicitud-nueva': () => import('./nueva-solicitud/nueva-solicitud.component').then(m => m.NuevaSolicitudComponent),
  'mis-solicitudes': () => import('./mis-solicitudes/mis-solicitudes.component').then(m => m.MisSolicitudesComponent),
  'revisar-solicitudes': () => import('./revision-solicitudes/revision-solicitudes.component').then(m => m.RevisionSolicitudesComponent),
  'pendientes-aprobacion': () => import('../gerencia/pendientes-aprobacion/pendientes-aprobacion.component').then(m => m.PendientesAprobacionComponent),
  'documentos-firmar': () => import('../gerencia/documentos-por-firmar/documentos-por-firmar.component').then(m => m.DocumentosPorFirmarComponent),
  'historial-decisiones': () => import('../gerencia/historial-decisiones/historial-decisiones.component').then(m => m.HistorialDecisionesComponent),
};
