import { isPlatformServer } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../services/autenticacion/auth.service';

/**
 * Requiere la clave de route.data['permiso'] (p. ej. usuarios.ver).
 * Una ruta sin clave configurada se deniega. El backend vuelve a validar.
 */
export const permissionGuard: CanActivateFn = route => {
  const auth = inject(AuthService);

  if (isPlatformServer(inject(PLATFORM_ID))) {
    return true;
  }

  const router = inject(Router);
  const permiso = route.data['permiso'] as string | undefined;

  return auth.cargarSesion().pipe(
    map(() => (!!permiso && auth.tienePermiso(permiso)) || router.createUrlTree(['/acceso-denegado'])),
  );
};
