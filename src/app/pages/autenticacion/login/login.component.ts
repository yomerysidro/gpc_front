import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ResultadoLogin } from '../../../core/interfaces/autenticacion/auth.interface';
import { AuthLayoutComponent } from '../../../components/layouts/auth-layout/auth-layout.component';
import { AuthService } from '../../../core/services/autenticacion/auth.service';

/** Perú no tiene horario de verano: Lima es siempre UTC-5. */
export const ZONA_HORARIA_LIMA = '-0500';

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
  protected readonly errorInesperado = signal(false);

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
    this.errorInesperado.set(false);

    this.auth.login(email, password).subscribe({
      next: resultado => {
        this.enviando.set(false);

        if (resultado.tipo === 'exito') {
          void this.router.navigateByUrl(this.destino());
        } else {
          this.resultado.set(resultado);
        }
      },
      error: () => {
        this.enviando.set(false);
        this.errorInesperado.set(true);
      },
    });
  }

  /** Solo rutas internas: evita redirecciones abiertas con returnUrl. */
  private destino(): string {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

    return returnUrl?.startsWith('/') && !returnUrl.startsWith('//')
      ? returnUrl
      : this.auth.rutaInicial();
  }
}
