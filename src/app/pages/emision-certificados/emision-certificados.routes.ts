import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, Routes } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../../core/services/autenticacion/auth.service';
import { permissionGuard } from '../../core/guards/permission.guard';

/** Mantiene las URLs públicas del menú; solo cambia la ubicación física de las páginas. */
export const EMISION_CERTIFICADOS_ROUTES: Routes = [
  {
    path: 'generar-emitir', canActivate: [permissionGuard, (route: ActivatedRouteSnapshot) => {
      const permiso = route.queryParamMap.has('editar') ? 'emision.editar' : route.queryParamMap.has('nuevo') ? 'emision.crear' : null;
      const auth = inject(AuthService); const router = inject(Router);
      return permiso ? auth.cargarSesion().pipe(map(() => auth.tienePermiso(permiso) || router.createUrlTree(['/acceso-denegado']))) : true;
    }], runGuardsAndResolvers: 'paramsOrQueryParamsChange', data: { permiso: 'emision.ver' },
    loadComponent: () => import('./generar-emitir/generar-emitir.component').then(m => m.GenerarEmitirComponent),
  },
  {
    path: 'actividades', canActivate: [permissionGuard], data: { permiso: 'actividades.ver', titulo: 'Actividades' },
    loadComponent: () => import('../actividades/listar-actividades/listar-actividades.component').then(m => m.ListarActividadesComponent),
  },
  {
    path: 'participantes', canActivate: [permissionGuard], data: { permiso: 'participantes.ver', titulo: 'Participantes' },
    loadComponent: () => import('../participantes/listar-participantes/listar-participantes.component').then(m => m.ListarParticipantesComponent),
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
      { path: '', pathMatch: 'full', redirectTo: '/certificaciones/generar-emitir' },
      {
        path: 'nuevo',
        redirectTo: '/certificaciones/generar-emitir?nuevo=1',
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
        path: ':id/editar',
        redirectTo: datos => `/certificaciones/generar-emitir?editar=${encodeURIComponent(datos.params['id'])}`,
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
