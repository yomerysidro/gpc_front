import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { AuthLayoutComponent } from '../../../components/layouts/auth-layout/auth-layout.component';
import { AuthService } from '../../../core/services/autenticacion/auth.service';

@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AuthLayoutComponent],
  templateUrl: './recuperar-password.component.html',
  styleUrl: './recuperar-password.component.scss'
})
export class RecuperarPasswordComponent {
  private readonly auth = inject(AuthService);

  protected readonly enviando = signal(false);
  protected readonly enviado = signal(false);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly errorInesperado = signal('');

  protected readonly form = inject(NonNullableFormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
  });

  protected enviar(): void {
    if (this.enviando()) return;
    this.form.controls.email.setValue(this.form.controls.email.value.trim());
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    this.errorInesperado.set('');

    // El backend responde 200 exista o no el correo; la página tampoco lo revela.
    this.auth.forgotPassword(this.form.getRawValue().email).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.enviando.set(false);
        this.enviado.set(true);
      },
      error: (error: unknown) => {
        this.enviando.set(false);
        this.errorInesperado.set(error instanceof HttpErrorResponse && error.status === 503
          ? 'El envío de correos no está disponible temporalmente.'
          : error instanceof HttpErrorResponse && error.status === 429
            ? 'Espera unos minutos antes de pedir otro enlace.'
            : 'No se pudo enviar la solicitud. Intenta nuevamente.');
      },
    });
  }
}
