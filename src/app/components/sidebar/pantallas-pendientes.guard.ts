import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { UsuarioSesion } from '../../core/interfaces/autenticacion/auth.interface';
import { AuthService } from '../../core/services/autenticacion/auth.service';

/** Solo permite consultar páginas informativas, nunca concede una operación administrativa. */
export function puedeConsultarPantallasPendientes(
  usuario: UsuarioSesion | null, tienePermiso: (clave: string) => boolean,
): boolean {
  return usuario?.rol === 'Administrador' && tienePermiso('roles.ver') && tienePermiso('roles.editar');
}

export const pantallasPendientesGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.cargarSesion().pipe(map(autenticado =>
    (autenticado && puedeConsultarPantallasPendientes(auth.usuario(), clave => auth.tienePermiso(clave)))
      || router.createUrlTree(['/acceso-denegado']),
  ));
};
