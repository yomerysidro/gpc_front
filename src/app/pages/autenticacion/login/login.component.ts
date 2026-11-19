import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { afterNextRender, Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { cargarApiTurnstile, TurnstileApi } from './turnstile';
import { ResultadoLogin } from '../../../core/interfaces/autenticacion/auth.interface';
import { AuthLayoutComponent } from '../../../components/layouts/auth-layout/auth-layout.component';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { ZONA_HORARIA_LIMA } from '../../../shared/utils/zona-horaria';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, DatePipe, AuthLayoutComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly destroyRef = inject(DestroyRef);
  private readonly turnstileContainer = viewChild<ElementRef<HTMLElement>>('turnstileContainer');
  private turnstile?: TurnstileApi;
  private widgetId?: string;
  protected readonly turnstileSiteKey = environment.turnstileSiteKey;
  protected readonly turnstileToken = signal<string | null>(null);
  protected readonly errorTurnstile = signal<string | null>(null);

  constructor() {
    if (this.turnstileSiteKey) {
      afterNextRender(() => void this.cargarTurnstile());
      this.destroyRef.onDestroy(() => {
        if (this.widgetId !== undefined) this.turnstile?.remove(this.widgetId);
      });
    }
  }

  protected async cargarTurnstile(): Promise<void> {
    const container = this.turnstileContainer()?.nativeElement;
    if (!container) return;

    this.errorTurnstile.set(null);
    if (this.widgetId !== undefined) {
      this.turnstile?.reset(this.widgetId);
      return;
    }

    try {
      this.turnstile = await cargarApiTurnstile(container.ownerDocument);
      if (!container.isConnected) return;

      this.widgetId = this.turnstile.render(container, {
        sitekey: this.turnstileSiteKey,
        action: 'login',
        size: 'flexible',
        appearance: 'always',
        language: 'es',
        'response-field': false,
        'refresh-expired': 'auto',
        callback: token => {
          this.errorTurnstile.set(null);
          this.turnstileToken.set(token);
        },
        'expired-callback': () => this.turnstileToken.set(null),
        'error-callback': () => {
          this.turnstileToken.set(null);
          this.errorTurnstile.set('No se pudo cargar la verificación de seguridad.');
        },
      });
    } catch {
      this.errorTurnstile.set('No se pudo cargar la verificación de seguridad.');
    }
  }

  protected readonly zonaLima = ZONA_HORARIA_LIMA;
  protected readonly enviando = signal(false);
  protected readonly resultado = signal<Exclude<ResultadoLogin, { tipo: 'exito' }> | null>(null);
  protected readonly errorInesperado = signal<string | null>(null);

  protected readonly form = inject(NonNullableFormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  protected ingresar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const token = this.turnstileToken();
    if (this.enviando() || (this.turnstileSiteKey && !token)) return;

    const { email, password } = this.form.getRawValue();
    this.enviando.set(true);
    this.resultado.set(null);
    this.errorInesperado.set(null);

    const solicitud = token ? this.auth.login(email, password, token) : this.auth.login(email, password);

    solicitud.pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.enviando.set(false)),
    ).subscribe({
      next: resultado => {

        if (resultado.tipo === 'exito') {
          void this.router.navigateByUrl(this.destino(), { info: { inicioSesionExitoso: true } });
        } else {
          this.resultado.set(resultado);
          this.renovarTurnstile();
        }
      },
      error: (error: unknown) => {
        this.errorInesperado.set(this.mensajeError(error));
        this.renovarTurnstile();
      },
    });
  }

  private renovarTurnstile(): void {
    this.turnstileToken.set(null);
    if (this.widgetId !== undefined) this.turnstile?.reset(this.widgetId);
  }

  private mensajeError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 0:
        case 502:
        case 504:
          return 'No se pudo conectar con el servidor. Verifica que el servicio esté disponible.';
        case 503:
          return 'El inicio de sesión no está disponible temporalmente. Intenta nuevamente.';
        case 403:
          return 'Acceso denegado. Contacta con el administrador.';
        case 404:
          return 'El servicio de inicio de sesión no está disponible. Contacta con el administrador.';
        case 419:
          return 'La sesión expiró. Recarga la página e intenta nuevamente.';
        case 422:
          if (error.error?.errors?.turnstileToken) {
            return 'Completa una nueva verificación de seguridad e intenta nuevamente.';
          }
          return 'Revisa el correo electrónico y la contraseña ingresados.';
        case 429:
          return 'Demasiados intentos. Espera unos minutos antes de intentar nuevamente.';
      }

      if (error.status >= 500) {
        return 'Ocurrió un problema en el servidor. Intenta nuevamente.';
      }
    }

    return 'No se pudo validar la sesión. Intenta nuevamente. Si el problema continúa, contacta con el administrador.';
  }

  /** Solo rutas internas: evita redirecciones abiertas con returnUrl. */
  private destino(): string {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

    return returnUrl?.startsWith('/') && !returnUrl.startsWith('//')
      ? returnUrl
      : this.auth.rutaInicial();
  }
}
