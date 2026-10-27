import { HttpRequest } from '@angular/common/http';

/**
 * Contrato de autenticación, sin implementación ni proveedor por defecto.
 * Proveer una implementación real antes de registrar el guard/interceptor.
 * No presupone JWT, cookies, endpoints ni almacenamiento de credenciales.
 */
export abstract class AuthService {
  abstract isAuthenticated(): boolean;
  abstract authorizeRequest(request: HttpRequest<unknown>): HttpRequest<unknown>;
}
