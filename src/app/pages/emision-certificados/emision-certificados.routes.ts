import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/guards/permission.guard';

/** Mantiene las URLs públicas del menú; solo cambia la ubicación física de las páginas. */
export const EMISION_CERTIFICADOS_ROUTES: Routes = [
  {
    path: 'actividades', canActivate: [permissionGuard], data: { permiso: 'actividades.ver', titulo: 'Actividades', secciones: [
      { titulo: 'Actividades registradas', recurso: 'activity' },
      { titulo: 'Ponentes asignados', recurso: 'activity-speaker' },
    ] },
    loadComponent: () => import('./actividades/actividades.component').then(m => m.ActividadesComponent),
  },
  {
    path: 'participantes', canActivate: [permissionGuard], data: { permiso: 'participantes.ver', titulo: 'Participantes', secciones: [
      { titulo: 'Participaciones registradas', recurso: 'participation' },
    ] },
    loadComponent: () => import('./actividades/actividades.component').then(m => m.ActividadesComponent),
  },
  {
    path: 'sesiones-asistencia', canActivate: [permissionGuard], data: { permiso: 'actividades.ver', titulo: 'Sesiones y asistencia', pestanas: [
      { id: 'sesiones', etiqueta: 'Sesiones', recurso: 'activity-session' },
      { id: 'asistencias', etiqueta: 'Asistencias', recurso: 'attendance' },
    ], secciones: [
      { titulo: 'Sesiones registradas', recurso: 'activity-session' }, { titulo: 'Asistencias registradas', recurso: 'attendance' },
    ] },
    loadComponent: () => import('./actividades/actividades.component').then(m => m.ActividadesComponent),
  },
  {
    path: 'reconocimientos', canActivate: [permissionGuard], data: { permiso: 'reconocimientos.ver' },
    children: [
      { path: '', loadComponent: () => import('./reconocimientos/listar-reconocimientos/listar-reconocimientos.component').then(m => m.ListarReconocimientosComponent) },
      {
        path: 'nuevo', canActivate: [permissionGuard], data: { permiso: 'reconocimientos.crear' },
        loadComponent: () => import('./reconocimientos/formulario-reconocimiento/formulario-reconocimiento.component').then(m => m.FormularioReconocimientoComponent),
      },
      {
        path: ':id/editar', canActivate: [permissionGuard], data: { permiso: 'reconocimientos.editar' },
        loadComponent: () => import('./reconocimientos/formulario-reconocimiento/formulario-reconocimiento.component').then(m => m.FormularioReconocimientoComponent),
      },
      { path: ':id', loadComponent: () => import('./reconocimientos/detalle-reconocimiento/detalle-reconocimiento.component').then(m => m.DetalleReconocimientoComponent) },
    ],
  },
  {
    path: 'certificados', canActivate: [permissionGuard], data: { permiso: 'emision.ver' },
    children: [
      { path: '', loadComponent: () => import('./certificados/listar-certificados/listar-certificados.component').then(m => m.ListarCertificadosComponent) },
      {
        path: 'nuevo', canActivate: [permissionGuard], data: { permiso: 'emision.crear' },
        loadComponent: () => import('./certificados/formulario-certificado/formulario-certificado.component').then(m => m.FormularioCertificadoComponent),
      },
      {
        path: 'reconocimientos', canActivate: [permissionGuard], data: { permiso: 'reconocimientos.ver' },
        children: [
          { path: '', pathMatch: 'full', redirectTo: '/certificaciones/reconocimientos' },
          { path: 'nuevo', redirectTo: '/certificaciones/reconocimientos/nuevo' },
          { path: ':id/editar', redirectTo: '/certificaciones/reconocimientos/:id/editar' },
        ],
      },
      { path: 'documentos', loadComponent: () => import('./documentos/listar-documentos/listar-documentos.component').then(m => m.ListarDocumentosComponent) },
      {
        path: ':id/editar', canActivate: [permissionGuard], data: { permiso: 'emision.editar' },
        loadComponent: () => import('./certificados/formulario-certificado/formulario-certificado.component').then(m => m.FormularioCertificadoComponent),
      },
      { path: ':id/documentos/:documentoId/visor', loadComponent: () => import('./certificados/detalle-certificado/detalle-certificado.component').then(m => m.DetalleCertificadoComponent) },
      { path: ':id', loadComponent: () => import('./certificados/detalle-certificado/detalle-certificado.component').then(m => m.DetalleCertificadoComponent) },
    ],
  },
  {
    path: 'firmas', canActivate: [permissionGuard], data: { permiso: 'ponentes-firmantes.ver' },
    children: [
      { path: '', loadComponent: () => import('./firmas/listar-firmas/listar-firmas.component').then(m => m.ListarFirmasComponent) },
      { path: 'asignar-firmantes', loadComponent: () => import('./firmas/asignar-firmantes/asignar-firmantes.component').then(m => m.AsignarFirmantesComponent) },
      {
        path: 'aplicadas', canActivate: [permissionGuard], data: { permiso: 'emision.ver', recurso: 'certificados-firmas' },
        loadComponent: () => import('./firmas/firmas-aplicadas.component').then(m => m.FirmasAplicadasComponent),
      },
    ],
  },
  {
    path: 'verificacion', canActivate: [permissionGuard], data: { permiso: 'emision.ver' },
    loadComponent: () => import('./verificacion/consultar-certificado/consultar-certificado.component').then(m => m.ConsultarCertificadoComponent),
  },
  {
    path: 'configuracion', children: [
      {
        path: '', pathMatch: 'full', canActivate: [permissionGuard], data: { permiso: 'emision.ver' },
        loadComponent: () => import('./configuracion/tipos-certificado/tipos-certificado.component').then(m => m.TiposCertificadoComponent),
      },
      {
        path: 'tipos-actividad', canActivate: [permissionGuard], data: { permiso: 'actividades.ver', titulo: 'Tipos de actividad', secciones: [
          { titulo: 'Tipos de actividad', recurso: 'ativicty-type' },
        ] },
        loadComponent: () => import('./actividades/actividades.component').then(m => m.ActividadesComponent),
      },
      {
        path: 'tipos-participacion', canActivate: [permissionGuard], data: { permiso: 'participantes.ver', titulo: 'Tipos de participación', secciones: [
          { titulo: 'Tipos de participación', recurso: 'participation-type' },
        ] },
        loadComponent: () => import('./actividades/actividades.component').then(m => m.ActividadesComponent),
      },
    ],
  },
];
