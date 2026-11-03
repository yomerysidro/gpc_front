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
import { SIDEBAR_CONFIG, rutaPantallaPendiente } from './components/sidebar/modulos-navegacion';
import { pantallasPendientesGuard } from './components/sidebar/pantallas-pendientes.guard';
import { VISTAS_SOLICITUDES } from './pages/solicitudes/solicitudes.routes';
import { VistaTemporalComponent } from './pages/vista-temporal/vista-temporal.component';
import { EMISION_CERTIFICADOS_ROUTES } from './pages/emision-certificados/emision-certificados.routes';

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
      ...SIDEBAR_CONFIG.flatMap(grupo => grupo.hijos.filter(entrada => !entrada.habilitado && !!entrada.pendiente)
        .map(entrada => ({
          path: rutaPantallaPendiente(entrada).slice(1),
          ...(VISTAS_SOLICITUDES[entrada.id] ? { loadComponent: VISTAS_SOLICITUDES[entrada.id] } : { component: VistaTemporalComponent }),
          canActivate: [pantallasPendientesGuard],
          data: { titulo: entrada.label, descripcion: entrada.descripcionPreliminar ?? entrada.pendiente, seccion: grupo.label },
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
      { path: 'gestion', loadChildren: () => import('./pages/gestion/gestion.routes').then(m => m.GESTION_ROUTES) },
      { path: 'reportes', loadChildren: () => import('./pages/reportes/reportes.routes').then(m => m.REPORTES_ROUTES) },
      { path: 'pendientes/indicadores', redirectTo: 'reportes/indicadores', pathMatch: 'full' },
      { path: 'pendientes/reportes-actividades', redirectTo: 'reportes/actividades', pathMatch: 'full' },
      { path: 'pendientes/reportes-certificados', redirectTo: 'reportes/certificados', pathMatch: 'full' },
      { path: 'pendientes/reportes-asistencia', redirectTo: 'reportes/asistencia', pathMatch: 'full' },
      { path: 'certificaciones', children: EMISION_CERTIFICADOS_ROUTES },
      // Destino de las demás opciones del menú sin pantalla todavía.
      { path: '**', component: EnConstruccionComponent },
    ],
  },
];
