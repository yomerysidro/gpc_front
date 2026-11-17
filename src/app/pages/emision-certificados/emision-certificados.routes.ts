import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, Routes } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { EmisionCertificadosService } from '../../core/services/emision-certificados/emision-certificados.service';
import { AuthService } from '../../core/services/autenticacion/auth.service';
import { permissionGuard } from '../../core/guards/permission.guard';
import { salirDeAsistencia } from '../actividades/asistencia-sesion/asistencia-sesion.guard';

/** Resuelve enlaces antiguos sin mostrar una segunda lista de sesiones. */
export const redirigirSesionesAnteriores = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const params = route.queryParams;
  const actividad = params['id_actividad'] ?? params['actividad'] ?? params['actividad_filtro'];
  const sesion = params['id_sesion'] ?? params['id_actividad_sesion'] ?? params['sesion_filtro'];
  const valido = (id: unknown) => /^[1-9]\d*$/.test(String(id)) && Number.isSafeInteger(Number(id));
  const destino = (id?: unknown) => router.createUrlTree(valido(id) && valido(sesion)
    ? ['/certificaciones/actividades', id, 'sesiones', sesion, 'asistencia'] : ['/certificaciones/actividades'],
    { queryParams: { ...params, ...(id !== undefined ? { id_actividad: id } : {}) } });
  if (valido(actividad) || !valido(sesion)) return destino(actividad);
  return inject(EmisionCertificadosService).obtener('activity-session', Number(sesion)).pipe(
    map(fila => Number(fila['id_actividad_sesion']) === Number(sesion) && valido(fila['id_actividad']) ? destino(fila['id_actividad']) : destino()),
    catchError(() => of(destino())),
  );
};

/** Mantiene las URLs públicas del menú; solo cambia la ubicación física de las páginas. */
export const EMISION_CERTIFICADOS_ROUTES: Routes = [
  {
    path: 'generar-emitir/reconocimientos/documento-original/:reconocimientoId', canActivate: [permissionGuard],
    data: { permiso: 'emision.ver', requiere: ['reconocimientos.ver'], visorMunicipal: true, titulo: 'Certificado' },
    loadComponent: () => import('./generar-emitir/preparar-municipal.component').then(m => m.PrepararMunicipalComponent),
  },
  {
    path: 'generar-emitir/reconocimientos/individual/:reconocimientoId', canActivate: [permissionGuard],
    data: { permiso: 'emision.ver', requiere: ['reconocimientos.ver'], titulo: 'Preparar reconocimiento municipal' },
    loadComponent: () => import('./generar-emitir/preparar-municipal.component').then(m => m.PrepararMunicipalComponent),
  },
  {
    path: 'generar-emitir/practicas/:practicaId/preparar', canActivate: [permissionGuard],
    data: { permiso: 'emision.ver', requiere: ['practicantes.ver'], titulo: 'Preparar certificado de prácticas' },
    loadComponent: () => import('./generar-emitir/preparar-practica.component').then(m => m.PrepararPracticaComponent),
  },
  {
    path: 'generar-emitir/reconocimientos/preparar',
    canActivate: [permissionGuard],
    data: { permiso: 'emision.ver', requiere: ['actividades.ver', 'ponentes-firmantes.ver'], titulo: 'Preparar reconocimiento' },
    loadComponent: () => import('./generar-emitir/preparar-reconocimiento-sesion.component').then(m => m.PrepararReconocimientoSesionComponent),
  },
  {
    path: 'generar-emitir/reconocimientos/actividad/:actividadId/ponentes/:ponenteId',
    canActivate: [permissionGuard],
    data: { permiso: 'emision.ver', requiere: ['actividades.ver', 'ponentes-firmantes.ver'], titulo: 'Preparar reconocimiento' },
    loadComponent: () => import('./generar-emitir/preparar-reconocimiento.component').then(m => m.PrepararReconocimientoComponent),
  },
  {
    path: 'generar-emitir', canActivate: [permissionGuard, (route: ActivatedRouteSnapshot) => {
      const permiso = route.queryParamMap.has('editar') ? 'emision.editar' : route.queryParamMap.has('nuevo') ? 'emision.crear' : null;
      const auth = inject(AuthService); const router = inject(Router);
      return permiso ? auth.cargarSesion().pipe(map(() => auth.tienePermiso(permiso) || router.createUrlTree(['/acceso-denegado']))) : true;
    }], runGuardsAndResolvers: 'paramsOrQueryParamsChange', data: { permiso: 'emision.ver' },
    loadComponent: () => import('./generar-emitir/generar-emitir.component').then(m => m.GenerarEmitirComponent),
  },
  {
    path: 'actividades/:idActividad/sesiones/:idSesion/asistencia', canActivate: [permissionGuard], canDeactivate: [salirDeAsistencia],
    data: { permiso: 'actividades.ver', requiere: ['participantes.ver'], titulo: 'Control de asistencia' },
    loadComponent: () => import('../actividades/asistencia-sesion/asistencia-sesion.component').then(m => m.AsistenciaSesionComponent),
  },
  {
    path: 'actividades/:id', pathMatch: 'full', redirectTo: datos => inject(Router).createUrlTree(['/certificaciones/actividades'], { queryParams: { ...datos.queryParams, id_actividad: datos.params['id'] } }),
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
    path: 'sesiones-asistencia', canActivate: [permissionGuard, redirigirSesionesAnteriores],
    data: { permiso: 'actividades.ver' },
    loadComponent: () => import('../actividades/listar-actividades/listar-actividades.component').then(m => m.ListarActividadesComponent),
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
      { path: ':id/documentos/:documentoId/visor', loadComponent: () => import('./documentos/ver-documento.component').then(m => m.VerDocumentoComponent) },
      { path: ':id', loadComponent: () => import('./certificados/detalle-certificado/detalle-certificado.component').then(m => m.DetalleCertificadoComponent) },
    ],
  },
  {
    path: 'firmas', canActivate: [permissionGuard], data: { permiso: 'emision.ver' },
    children: [
      { path: '', pathMatch: 'full', redirectTo: '/gestion/firmantes-municipales' },
      { path: 'asignar-firmantes', redirectTo: '/pendientes/documentos-firmar', pathMatch: 'full' },
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
        path: '', pathMatch: 'full', redirectTo: '/gestion/tipos-clasificaciones?pestana=tipos-certificado',
      },
      {
        path: 'tipos-actividad', pathMatch: 'full', redirectTo: '/gestion/tipos-clasificaciones?pestana=tipos-actividad',
      },
      {
        path: 'tipos-participacion', pathMatch: 'full', redirectTo: '/gestion/tipos-clasificaciones?pestana=tipos-participacion',
      },
    ],
  },
];
