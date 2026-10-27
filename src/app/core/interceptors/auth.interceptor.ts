import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AUTHENTICATED_REQUEST } from '../security/auth-request.context';
import { AuthService } from '../services/autenticacion/auth.service';

/** No registrado. La implementación real debe validar destinos antes de autorizar. */
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.context.get(AUTHENTICATED_REQUEST)) {
    return next(request);
  }

  return next(inject(AuthService).authorizeRequest(request));
};
