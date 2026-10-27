import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AUTHENTICATED_REQUEST } from '../security/auth-request.context';
import { AuthService } from '../services/autenticacion/auth.service';

/** 401 propios del flujo de sesión: los resuelven login() y cargarSesion(). */
const RUTAS_SIN_REDIRECCION = [
  `${environment.apiBaseUrl}/auth/login`,
  `${environment.apiBaseUrl}/auth/me`,
];

/**
 * Solo actúa sobre solicitudes marcadas con AUTHENTICATED_REQUEST. AuthService
 * decide a qué destinos enviar credenciales. Un 401 en una solicitud marcada
 * termina la sesión y lleva a /login conservando la ruta actual.
 */
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.context.get(AUTHENTICATED_REQUEST)) {
    return next(request);
  }

  const auth = inject(AuthService);
  const router = inject(Router);

  return next(auth.authorizeRequest(request)).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401
        && !RUTAS_SIN_REDIRECCION.includes(request.url)) {
        const returnUrl = router.url;
        auth.limpiarSesion();

        if (!returnUrl.startsWith('/login')) {
          void router.navigate(['/login'], { queryParams: { returnUrl } });
        }
      }

      return throwError(() => error);
    }),
  );
};
