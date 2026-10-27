import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
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
        component: EnConstruccionComponent,
        canActivate: [permissionGuard],
        data: { permiso: 'usuarios.ver', titulo: 'Gestión de Usuarios' },
      },
      {
        path: 'roles',
        component: EnConstruccionComponent,
        canActivate: [permissionGuard],
        data: { permiso: 'roles.ver', titulo: 'Roles y Permisos' },
      },
      // Módulos del menú cuyas pantallas aún no existen (actividades, reportes, …).
      { path: '**', component: EnConstruccionComponent },
    ],
  },
];
