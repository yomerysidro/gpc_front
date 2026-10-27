import { isPlatformServer } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../services/autenticacion/auth.service';

/** Ruta raíz: primer módulo del menú con sesión, /login sin ella. */
export const inicioGuard: CanActivateFn = () => {
  const auth = inject(AuthService);

  if (isPlatformServer(inject(PLATFORM_ID))) {
    return true;
  }

  const router = inject(Router);

  return auth.cargarSesion().pipe(
    map(ok => router.parseUrl(ok ? auth.rutaInicial() : '/login')),
  );
};
