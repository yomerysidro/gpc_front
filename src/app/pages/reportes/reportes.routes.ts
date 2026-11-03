import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/guards/permission.guard';

export const REPORTES_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'indicadores' },
  { path: 'indicadores', canActivate: [permissionGuard], data: { permiso: 'reportes.ver' }, loadComponent: () => import('./indicadores-generales/indicadores-generales.component').then(m => m.IndicadoresGeneralesComponent) },
  { path: 'actividades', canActivate: [permissionGuard], data: { permiso: 'reportes.ver' }, loadComponent: () => import('./reportes-actividades/reportes-actividades.component').then(m => m.ReportesActividadesComponent) },
  { path: 'certificados', canActivate: [permissionGuard], data: { permiso: 'reportes.ver' }, loadComponent: () => import('./reportes-certificados/reportes-certificados.component').then(m => m.ReportesCertificadosComponent) },
  { path: 'asistencia', canActivate: [permissionGuard], data: { permiso: 'reportes.ver' }, loadComponent: () => import('./reportes-asistencia/reportes-asistencia.component').then(m => m.ReportesAsistenciaComponent) },
];
