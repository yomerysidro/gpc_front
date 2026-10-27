import { isPlatformServer } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../services/autenticacion/auth.service';

/** Páginas solo para visitantes: con sesión activa redirige al primer módulo del menú. */
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);

  if (isPlatformServer(inject(PLATFORM_ID))) {
    return true;
  }

  const router = inject(Router);

  return auth.cargarSesion().pipe(
    map(ok => ok ? router.parseUrl(auth.rutaInicial()) : true),
  );
};
