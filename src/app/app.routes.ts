import { REPORTES_ROUTES } from './pages/reportes/reportes.routes';
import { Router, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { authGuard } from './core/guards/auth.guard';
import { cambiosPendientesGuard } from './core/guards/cambios-pendientes.guard';
import { guestGuard } from './core/guards/guest.guard';
import { inicioGuard } from './core/guards/inicio.guard';
import { permissionGuard } from './core/guards/permission.guard';
import { PrivateLayoutComponent } from './components/layouts/private-layout/private-layout.component';
import { LoginComponent } from './pages/autenticacion/login/login.component';
import { RecuperarPasswordComponent } from './pages/autenticacion/recuperar-password/recuperar-password.component';
import { RestablecerPasswordComponent } from './pages/autenticacion/restablecer-password/restablecer-password.component';
import { AccesoDenegadoComponent } from './pages/autenticacion/acceso-denegado/acceso-denegado.component';
import { HomeComponent } from './pages/home/home.component';
import { EnConstruccionComponent } from './pages/en-construccion/en-construccion.component';
import { ListarUsuariosComponent } from './pages/seguridad/usuarios/listar-usuarios/listar-usuarios.component';
import { FormularioUsuarioComponent } from './pages/seguridad/usuarios/formulario-usuario/formulario-usuario.component';
import { RolesPermisosComponent } from './pages/seguridad/roles/roles-permisos/roles-permisos.component';
import { AccesosRolComponent } from './pages/seguridad/roles/accesos-rol/accesos-rol.component';
import { configuracionGestionGuard } from './components/sidebar/configuracion.guard';
import { SIDEBAR_CONFIG, rutaPantallaPendiente } from './components/sidebar/modulos-navegacion';
import { pantallasPendientesGuard } from './components/sidebar/pantallas-pendientes.guard';
import { VistaTemporalComponent } from './pages/vista-temporal/vista-temporal.component';
import { VISTAS_SOLICITUDES } from './pages/solicitudes/solicitudes.routes';
import { EMISION_CERTIFICADOS_ROUTES } from './pages/emision-certificados/emision-certificados.routes';

const gestionRoutes: Routes = [
  {
    path: 'firmantes-municipales', canActivate: [permissionGuard], data: { permiso: 'emision.ver', permisos: ['ponentes-firmantes.editar'], titulo: 'Gestión de firmantes municipales' },
    loadComponent: () => import('./pages/emision-certificados/firmas/listar-firmas/listar-firmas.component').then(pagina => pagina.ListarFirmasComponent),
  },
  { path: 'practicantes', pathMatch: 'full', redirectTo: '/gestion/practicas?pestana=practicantes' },
  {
    path: 'personas',
    loadComponent: () => import('./shared/components/gestion-tabs/gestion-tabs.component').then(pagina => pagina.GestionTabsComponent),
    canActivate: [permissionGuard],
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    data: { titulo: 'Gestión de Personas', seccion: 'personas', permiso: 'personas.verpersonas' },
  },
  {
    path: 'trabajadores',
    loadComponent: () => import('./pages/person-worker/person-worker').then(pagina => pagina.PersonWorkerComponent),
    canActivate: [permissionGuard],
    data: { titulo: 'Gestión de Trabajadores', permiso: 'trabajadores.ver' },
  },
  {
    path: 'practicas',
    loadComponent: () => import('./shared/components/gestion-tabs/gestion-tabs.component').then(pagina => pagina.GestionTabsComponent),
    canActivate: [permissionGuard],
    data: { titulo: 'Gestión de Prácticas', seccion: 'practicas', permiso: 'practicantes.ver' },
  },
  {
    path: 'ponentes',
    loadComponent: () => import('./pages/person-speaker/person-speaker').then(pagina => pagina.PersonSpeakerComponent),
    canActivate: [permissionGuard],
    data: { titulo: 'Gestión de Ponentes', permiso: 'ponentes-firmantes.ver' },
  },
  {
    path: 'configuracion',
    loadComponent: () => import('./shared/components/gestion-tabs/gestion-tabs.component').then(pagina => pagina.GestionTabsComponent),
    canActivate: [configuracionGestionGuard],
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    data: { titulo: 'Gestión institucional', seccion: 'configuracion' },
  },
  {
    path: 'tipos-clasificaciones',
    loadComponent: () => import('./shared/components/gestion-tabs/gestion-tabs.component').then(pagina => pagina.GestionTabsComponent),
    canActivate: [configuracionGestionGuard],
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    data: { titulo: 'Tipos y clasificaciones', seccion: 'clasificaciones' },
  },
];


export const routes: Routes = [
  // Sin componente: inicioGuard redirige al primer módulo o al portal público.
  { path: '', pathMatch: 'full', canActivate: [inicioGuard], children: [] },

  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'recuperar-password', component: RecuperarPasswordComponent, canActivate: [guestGuard] },
  // El enlace del correo apunta aquí (FRONTEND_URL/reset-password?token=…&email=…).
  { path: 'reset-password', component: RestablecerPasswordComponent },
  { path: 'acceso-denegado', component: AccesoDenegadoComponent },
  { path: 'portal-certificados',
    loadComponent: () => import('./pages/portal-certificados/portal-certificados-layout.component').then(m => m.PortalCertificadosLayoutComponent),
    children: [{ path: '', loadComponent: () => import('./pages/portal-certificados/portal-certificados.component').then(m => m.PortalCertificadosComponent) }],
  },
  { path: 'verificar', pathMatch: 'full', redirectTo: ({ queryParams }) => inject(Router).createUrlTree(['/portal-certificados'], { queryParams }) },
  { path: 'verificar/:codigo', redirectTo: ({ params }) => inject(Router).createUrlTree(['/portal-certificados'], { queryParams: { codigo: params['codigo'] } }) },

  {
    path: '',
    component: PrivateLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'inicio', component: HomeComponent },
      { path: 'pendientes/documentos-firmar/:id', canActivate: [permissionGuard], data: { titulo: 'Detalle del certificado', permiso: 'emision.ver' },
        loadComponent: () => import('./pages/gerencia/documentos-por-firmar/detalle-documento.component').then(m => m.DetalleDocumentoComponent) },
      { path: 'reportes', children: REPORTES_ROUTES },
      { path: 'pendientes/indicadores', redirectTo: '/reportes/indicadores', pathMatch: 'full' },
      { path: 'pendientes/reportes-actividades', redirectTo: '/reportes/actividades', pathMatch: 'full' },
      { path: 'pendientes/reportes-certificados', redirectTo: '/reportes/certificados', pathMatch: 'full' },
      { path: 'pendientes/reportes-asistencia', redirectTo: '/reportes/asistencia', pathMatch: 'full' },
      {
        path: 'solicitudes', loadComponent: VISTAS_SOLICITUDES['mis-solicitudes'],
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'mis-solicitudes' },
          { path: 'mis-solicitudes', children: [], canActivate: [permissionGuard], runGuardsAndResolvers: 'paramsOrQueryParamsChange',
            data: { titulo: 'Mis solicitudes', permiso: 'solicitudes.propias' } },
          { path: 'nueva', children: [], canActivate: [permissionGuard], runGuardsAndResolvers: 'paramsOrQueryParamsChange',
            data: { titulo: 'Nueva solicitud de actividad', permiso: 'solicitudes.crear', permisoEdicion: 'solicitudes.editar' } },
        ],
      },
      ...SIDEBAR_CONFIG.flatMap(grupo => grupo.hijos.filter(entrada => entrada.habilitado && entrada.id !== 'mis-solicitudes' && !!VISTAS_SOLICITUDES[entrada.id])
        .map(entrada => ({
          path: entrada.path!.slice(1), loadComponent: VISTAS_SOLICITUDES[entrada.id],
          canActivate: [permissionGuard], runGuardsAndResolvers: 'paramsOrQueryParamsChange' as const,
          data: { titulo: entrada.label, permiso: entrada.permiso, capacidadSolicitud: entrada.capacidadSolicitud, permisos: entrada.permisos, requiere: entrada.requiere,
            ...(entrada.id === 'solicitud-nueva' ? { permisoEdicion: 'solicitudes.editar' } : {}) },
        }))),
      { path: 'pendientes/generar-emitir', pathMatch: 'full', redirectTo: '/certificaciones/generar-emitir' },
      // Solo páginas informativas: authGuard del layout y guard de consulta administrativa.
      ...SIDEBAR_CONFIG.flatMap(grupo => grupo.hijos.filter(entrada => !entrada.habilitado && !!entrada.pendiente)
        .map(entrada => ({
          path: rutaPantallaPendiente(entrada).slice(1),
          ...(VISTAS_SOLICITUDES[entrada.id] ? { loadComponent: VISTAS_SOLICITUDES[entrada.id] } : { component: VistaTemporalComponent }),
          canActivate: [pantallasPendientesGuard],
          data: {
            titulo: entrada.label, descripcion: entrada.descripcionPreliminar ?? entrada.pendiente,
            seccion: grupo.label,
          },
        }))),
      {
        path: 'usuarios',
        canActivate: [permissionGuard],
        data: { permiso: 'usuarios.ver' },
        children: [
          { path: '', component: ListarUsuariosComponent },
          {
            path: 'nuevo',
            component: FormularioUsuarioComponent,
            canActivate: [permissionGuard],
            data: { permiso: 'usuarios.crear' },
          },
          {
            path: ':id/editar',
            component: FormularioUsuarioComponent,
            canActivate: [permissionGuard],
            data: { permiso: 'usuarios.editar' },
          },
        ],
      },
      {
        path: 'roles',
        canActivate: [permissionGuard],
        data: { permiso: 'roles.ver' },
        children: [
          { path: '', component: RolesPermisosComponent },
          {
            path: ':id/accesos',
            component: AccesosRolComponent,
            canActivate: [permissionGuard],
            canDeactivate: [cambiosPendientesGuard],
            data: { permiso: 'roles.editar' },
          },
        ],
      },
      { path: 'gestion', children: gestionRoutes },
      { path: 'certificaciones', children: EMISION_CERTIFICADOS_ROUTES },
      // Compatibilidad con las URL institucionales recibidas en /auth/me.
      { path: 'dashboard', pathMatch: 'full', redirectTo: '/inicio' },
      { path: 'actividades', pathMatch: 'full', redirectTo: '/certificaciones/actividades' },
      { path: 'participantes', pathMatch: 'full', redirectTo: '/certificaciones/participantes' },
      { path: 'practicantes', pathMatch: 'full', redirectTo: '/gestion/practicas?pestana=practicantes' },
      { path: 'reconocimientos', pathMatch: 'full', redirectTo: '/certificaciones/reconocimientos' },
      { path: 'ponentes-firmantes', pathMatch: 'full', redirectTo: '/gestion/ponentes' },
      { path: 'emision', pathMatch: 'full', redirectTo: '/certificaciones/certificados' },
      { path: 'certificados', pathMatch: 'full', redirectTo: '/certificaciones/certificados' },
      { path: 'firmas', pathMatch: 'full', redirectTo: '/gestion/firmantes-municipales' },
      { path: 'personas', pathMatch: 'full', redirectTo: '/gestion/personas' },
      { path: 'trabajadores', pathMatch: 'full', redirectTo: '/gestion/trabajadores' },
      { path: 'areas', pathMatch: 'full', redirectTo: '/gestion/configuracion?pestana=areas' },
      { path: 'instituciones', pathMatch: 'full', redirectTo: '/gestion/configuracion?pestana=instituciones' },
      { path: 'documentos', pathMatch: 'full', redirectTo: '/gestion/configuracion?pestana=tipos-documento' },
      { path: 'tipos-documento', pathMatch: 'full', redirectTo: '/gestion/configuracion?pestana=tipos-documento' },
      { path: 'modulos', pathMatch: 'full', redirectTo: '/roles?pestana=modulos' },
      { path: 'permisos', pathMatch: 'full', redirectTo: '/roles?pestana=modulos' },
      // Destino de las demás opciones del menú sin pantalla todavía.
      { path: '**', component: EnConstruccionComponent },
    ],
  },
];
