import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/autenticacion/auth.service';

/** No registrado: requiere un proveedor real de AuthService. */
export const authGuard: CanActivateFn = () => inject(AuthService).isAuthenticated();
