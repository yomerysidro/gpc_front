import { isPlatformServer } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, PRIMARY_OUTLET, Router } from '@angular/router';
import { grupoDeRuta, puedeAbrirGrupo } from '../../components/sidebar/modulos-navegacion';
import { map } from 'rxjs';
import { AuthService } from '../services/autenticacion/auth.service';
import { CapacidadesSolicitudes } from '../interfaces/autenticacion/auth.interface';

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
  const capacidad = route.data['capacidadSolicitud'] as keyof CapacidadesSolicitudes | undefined;
  const alternativas = route.data['permisos'] as readonly string[] | undefined;
  const edicion = route.queryParamMap?.has('editar') ? route.data['permisoEdicion'] as string | undefined : undefined;
  const requiere = (route.data['requiere'] as readonly string[] | undefined) ?? [];

  return auth.cargarSesion().pipe(
    map(() => ((capacidad ? auth.capacidadesSolicitudes?.()?.[capacidad] === true : edicion ? auth.tienePermiso(edicion) : (!!permiso && auth.tienePermiso(permiso)) || alternativas?.some(clave => auth.tienePermiso(clave)))
      && requiere.every(clave => auth.tienePermiso(clave))) || router.createUrlTree(['/acceso-denegado'])),
  );
};


export const accesoGrupoGuard: CanActivateChildFn = (_route, state) => {
  if (isPlatformServer(inject(PLATFORM_ID))) return true;
  const auth = inject(AuthService);
  const router = inject(Router);
  const segmentos = router.parseUrl(state.url).root.children[PRIMARY_OUTLET]?.segments.map(segmento => segmento.path) ?? [];
  const grupo = grupoDeRuta(segmentos);
  return grupo ? auth.cargarSesion().pipe(map(() =>
    puedeAbrirGrupo(grupo, clave => auth.tienePermiso(clave)) || router.createUrlTree(['/acceso-denegado']))) : true;
};
