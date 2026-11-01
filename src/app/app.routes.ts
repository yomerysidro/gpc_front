import { Routes } from '@angular/router';
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
import { MODULOS_NAVEGACION } from './components/sidebar/modulos-navegacion';
import { VistaTemporalComponent } from './pages/vista-temporal/vista-temporal.component';
import { EMISION_CERTIFICADOS_ROUTES } from './pages/emision-certificados/emision-certificados.routes';

const gestionRoutes: Routes = [
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
    data: { titulo: 'Gestión de Trabajadores', permiso: 'ponentes-firmantes.ver' },
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
    // Sin ámbito confirmado para los catálogos: authGuard protege el layout y cada GET exige autorización Laravel.
    data: { titulo: 'Configuración de Gestión', seccion: 'configuracion' },
  },
];


export const routes: Routes = [
  // Sin componente: en el navegador inicioGuard redirige al primer módulo o a /login.
  { path: '', pathMatch: 'full', canActivate: [inicioGuard], children: [] },

  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'recuperar-password', component: RecuperarPasswordComponent, canActivate: [guestGuard] },
  // El enlace del correo apunta aquí (FRONTEND_URL/reset-password?token=…&email=…).
  { path: 'reset-password', component: RestablecerPasswordComponent },
  { path: 'acceso-denegado', component: AccesoDenegadoComponent },

  {
    path: '',
    component: PrivateLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'inicio', component: HomeComponent },
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
      ...MODULOS_NAVEGACION.map(modulo => ({
        path: modulo.path,
        children: modulo.path === 'gestion' ? gestionRoutes : [...modulo.opciones.filter(opcion => modulo.path !== 'certificaciones'
          || !['certificados', 'firmas', 'verificacion', 'configuracion'].includes(opcion.path)).map(opcion => ({
          path: opcion.path,
          component: VistaTemporalComponent,
          data: { titulo: opcion.label },
        })), ...(modulo.path === 'certificaciones' ? EMISION_CERTIFICADOS_ROUTES : [])],

      })),
      // Destino de las demás opciones del menú sin pantalla todavía.
      { path: '**', component: EnConstruccionComponent },
    ],
  },
];
