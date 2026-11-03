import { isPlatformServer } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../../core/services/autenticacion/auth.service';
import { SIDEBAR_CONFIG } from './modulos-navegacion';

/** La pestaña cambia la capacidad requerida, sin conceder permisos de escritura. */
export const configuracionGestionGuard: CanActivateFn = route => {
  if (isPlatformServer(inject(PLATFORM_ID))) return true;
  const auth = inject(AuthService);
  const router = inject(Router);
  const catalogos = SIDEBAR_CONFIG.flatMap(grupo => grupo.hijos).filter(entrada => entrada.path === '/gestion/configuracion');
  const pestana = route.queryParamMap.get('pestana');
  const seleccion = catalogos.find(entrada => entrada.queryParams?.['pestana'] === pestana)
    ?? catalogos.find(entrada => entrada.parametrosPredeterminados?.['pestana']);
  return auth.cargarSesion().pipe(map(() =>
    (!!seleccion?.permiso && auth.tienePermiso(seleccion.permiso)) || router.createUrlTree(['/acceso-denegado']),
  ));
};
