import { isPlatformServer } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../../core/services/autenticacion/auth.service';
import { CATALOGOS_CLASIFICACIONES, CATALOGOS_INSTITUCIONALES } from './catalogos-configuracion';

/** La pestaña cambia la capacidad requerida, sin conceder permisos de escritura. */
export const configuracionGestionGuard: CanActivateFn = route => {
  if (isPlatformServer(inject(PLATFORM_ID))) return true;
  const auth = inject(AuthService);
  const router = inject(Router);
  const catalogos = route.data['seccion'] === 'clasificaciones' ? CATALOGOS_CLASIFICACIONES : CATALOGOS_INSTITUCIONALES;
  const pestana = route.queryParamMap.get('pestana');
  const seleccion = catalogos.find(entrada => entrada.id === pestana) ?? catalogos[0];
  return auth.cargarSesion().pipe(map(() =>
    (!!seleccion?.permiso && auth.tienePermiso(seleccion.permiso)) || router.createUrlTree(['/acceso-denegado']),
  ));
};
