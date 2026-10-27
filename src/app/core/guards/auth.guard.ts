import { isPlatformServer } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../services/autenticacion/auth.service';

/**
 * En el servidor no hay cookie de sesión: se renderiza y el navegador decide.
 * Sin proveedor de AuthService falla por inyección; nunca permite por defecto.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);

  if (isPlatformServer(inject(PLATFORM_ID))) {
    return true;
  }

  const router = inject(Router);

  return auth.cargarSesion().pipe(
    map(ok => ok || router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } })),
  );
};
