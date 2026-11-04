import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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

    const { email, password } = this.form.getRawValue();
    this.enviando.set(true);
    this.resultado.set(null);
    this.errorInesperado.set(null);

    this.auth.login(email, password).subscribe({
      next: resultado => {
        this.enviando.set(false);

        if (resultado.tipo === 'exito') {
          void this.router.navigateByUrl(this.destino());
        } else {
          this.resultado.set(resultado);
        }
      },
      error: (error: unknown) => {
        this.enviando.set(false);
        this.errorInesperado.set(this.mensajeError(error));
      },
    });
  }

  private mensajeError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 0:
        case 502:
        case 503:
        case 504:
          return 'No se pudo conectar con el servidor. Verifica que el servicio esté disponible.';
        case 403:
          return 'Acceso denegado. Contacta con el administrador.';
        case 404:
          return 'El servicio de inicio de sesión no está disponible. Contacta con el administrador.';
        case 419:
          return 'La sesión expiró. Recarga la página e intenta nuevamente.';
        case 422:
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
