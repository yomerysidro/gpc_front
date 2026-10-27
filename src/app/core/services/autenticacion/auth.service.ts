import { HttpRequest } from '@angular/common/http';
import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ModuloMenu,
  ResultadoLogin,
  UsuarioSesion,
} from '../../interfaces/autenticacion/auth.interface';

/**
 * Contrato de autenticación. La implementación registrada en app.config.ts es
 * SessionAuthService (JWT en cookie httpOnly del backend; el front nunca lo lee).
 */
export abstract class AuthService {
  abstract readonly usuario: Signal<UsuarioSesion | null>;
  abstract readonly modulos: Signal<readonly ModuloMenu[]>;
  abstract readonly permisos: Signal<readonly string[]>;
  abstract readonly isAuthenticated: Signal<boolean>;

  abstract login(email: string, password: string): Observable<ResultadoLogin>;
  /** Carga /auth/me una sola vez; emite true si hay sesión. */
  abstract cargarSesion(): Observable<boolean>;
  abstract logout(): Observable<void>;
  abstract forgotPassword(email: string): Observable<void>;
  abstract resetPassword(token: string, email: string, password: string,
    passwordConfirmation: string): Observable<void>;
  abstract tienePermiso(clave: string): boolean;
  /** Ruta inicial tras entrar: el primer módulo del menú o /inicio. */
  abstract rutaInicial(): string;
  abstract limpiarSesion(): void;
  abstract authorizeRequest(request: HttpRequest<unknown>): HttpRequest<unknown>;
}
