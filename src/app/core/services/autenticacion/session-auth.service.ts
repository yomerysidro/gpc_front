import { HttpClient, HttpContext, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, shareReplay, switchMap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  AuthErrorResponse,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  ModuloMenu,
  ResetPasswordRequest,
  ResultadoLogin,
  SesionResponse,
  UsuarioSesion,
} from '../../interfaces/autenticacion/auth.interface';
import { AUTHENTICATED_REQUEST } from '../../security/auth-request.context';
import { AuthService } from './auth.service';

const RUTA_SIN_MODULOS = '/inicio';

/**
 * Sesión basada en la cookie httpOnly access_token que emite gpc_back.
 * El token nunca se lee: solo se envían credenciales a apiBaseUrl.
 */
@Injectable()
export class SessionAuthService extends AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly api = environment.apiBaseUrl;

  private readonly usuarioActual = signal<UsuarioSesion | null>(null);
  private readonly modulosActuales = signal<readonly ModuloMenu[]>([]);
  private readonly permisosActuales = signal<readonly string[]>([]);
  private sesion$: Observable<boolean> | null = null;

  readonly usuario = this.usuarioActual.asReadonly();
  readonly modulos = this.modulosActuales.asReadonly();
  readonly permisos = this.permisosActuales.asReadonly();
  readonly isAuthenticated = computed(() => this.usuarioActual() !== null);

  login(email: string, password: string): Observable<ResultadoLogin> {
    const body: LoginRequest = { email, password };

    return this.http.post<LoginResponse>(`${this.api}/auth/login`, body, this.opciones()).pipe(
      switchMap(() => {
        this.sesion$ = null;
        return this.cargarSesion();
      }),
      switchMap(ok => ok
        ? of<ResultadoLogin>({ tipo: 'exito' })
        : throwError(() => new Error('No se pudo cargar la sesión después del login'))),
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse) {
          const cuerpo = error.error as Partial<AuthErrorResponse> | null;

          if (error.status === 401) {
            return of<ResultadoLogin>({
              tipo: 'rechazado',
              mensaje: cuerpo?.message ?? 'Credenciales inválidas',
            });
          }

          if (error.status === 423) {
            return of<ResultadoLogin>({
              tipo: 'bloqueado',
              mensaje: cuerpo?.message ?? 'Cuenta bloqueada',
              bloqueadoHasta: cuerpo?.bloqueadoHasta ?? null,
            });
          }
        }

        return throwError(() => error);
      }),
    );
  }

  cargarSesion(): Observable<boolean> {
    this.sesion$ ??= this.http.get<SesionResponse>(`${this.api}/auth/me`, this.opciones()).pipe(
      map(sesion => {
        this.usuarioActual.set(sesion.user);
        this.modulosActuales.set(sesion.modulos);
        this.permisosActuales.set(sesion.permisos);
        return true;
      }),
      catchError((error: unknown) => {
        this.limpiarEstado();

        // Sin 401 (backend caído, 500) no se cachea: el siguiente intento vuelve a consultar.
        if (!(error instanceof HttpErrorResponse && error.status === 401)) {
          this.sesion$ = null;
        }

        return of(false);
      }),
      shareReplay(1),
    );

    return this.sesion$;
  }

  recargarSesion(): Observable<boolean> {
    this.sesion$ = null;
    return this.cargarSesion();
  }

  logout(): Observable<void> {
    return this.http.post(`${this.api}/auth/logout`, null, this.opciones()).pipe(
      catchError(() => of(null)),
      map(() => {
        this.limpiarSesion();
        void this.router.navigateByUrl('/login');
      }),
    );
  }

  forgotPassword(email: string): Observable<void> {
    const body: ForgotPasswordRequest = { email };

    return this.http.post(`${this.api}/auth/forgot-password`, body, this.opciones())
      .pipe(map(() => undefined));
  }

  resetPassword(token: string, email: string, password: string,
    passwordConfirmation: string): Observable<void> {
    const body: ResetPasswordRequest = {
      token,
      email,
      password,
      password_confirmation: passwordConfirmation,
    };

    return this.http.post(`${this.api}/auth/reset-password`, body, this.opciones())
      .pipe(map(() => undefined));
  }

  tienePermiso(clave: string): boolean {
    return this.permisosActuales().includes(clave);
  }

  rutaInicial(): string {
    return this.modulosActuales()[0]?.url ?? RUTA_SIN_MODULOS;
  }

  /** Sesión terminada (logout o 401): no se vuelve a consultar /auth/me hasta el próximo login. */
  limpiarSesion(): void {
    this.limpiarEstado();
    this.sesion$ = of(false);
  }

  authorizeRequest(request: HttpRequest<unknown>): HttpRequest<unknown> {
    const esApi = request.url === this.api || request.url.startsWith(`${this.api}/`);

    return esApi ? request.clone({ withCredentials: true }) : request;
  }

  private limpiarEstado(): void {
    this.usuarioActual.set(null);
    this.modulosActuales.set([]);
    this.permisosActuales.set([]);
  }

  private opciones(): { context: HttpContext } {
    return { context: new HttpContext().set(AUTHENTICATED_REQUEST, true) };
  }
}
