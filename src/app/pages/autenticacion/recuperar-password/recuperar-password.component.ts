import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
  protected readonly errorInesperado = signal(false);

  protected readonly form = inject(NonNullableFormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
  });

  protected enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    this.errorInesperado.set(false);

    // El backend responde 200 exista o no el correo; la página tampoco lo revela.
    this.auth.forgotPassword(this.form.getRawValue().email).subscribe({
      next: () => {
        this.enviando.set(false);
        this.enviado.set(true);
      },
      error: () => {
        this.enviando.set(false);
        this.errorInesperado.set(true);
      },
    });
  }
}
