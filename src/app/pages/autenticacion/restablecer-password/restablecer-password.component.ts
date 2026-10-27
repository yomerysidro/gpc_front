import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/autenticacion/auth.service';

/** Mismo mínimo que ResetPasswordRequest del backend (min:8, confirmed). */
const LONGITUD_MINIMA = 8;

function coincidenPasswords(grupo: AbstractControl): ValidationErrors | null {
  const { password, confirmacion } = grupo.value as { password: string; confirmacion: string };

  return confirmacion && password !== confirmacion ? { noCoinciden: true } : null;
}

@Component({
  selector: 'app-restablecer-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './restablecer-password.component.html',
  styleUrl: './restablecer-password.component.scss'
})
export class RestablecerPasswordComponent {
  private readonly auth = inject(AuthService);
  private readonly query = inject(ActivatedRoute).snapshot.queryParamMap;

  protected readonly token = this.query.get('token') ?? '';
  protected readonly email = this.query.get('email') ?? '';
  protected readonly longitudMinima = LONGITUD_MINIMA;
  protected readonly enviando = signal(false);
  protected readonly restablecido = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = inject(NonNullableFormBuilder).group({
    password: ['', [Validators.required, Validators.minLength(LONGITUD_MINIMA)]],
    confirmacion: ['', Validators.required],
  }, { validators: coincidenPasswords });

  protected restablecer(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { password, confirmacion } = this.form.getRawValue();
    this.enviando.set(true);
    this.error.set(null);

    this.auth.resetPassword(this.token, this.email, password, confirmacion).subscribe({
      next: () => {
        this.enviando.set(false);
        this.restablecido.set(true);
      },
      error: (error: unknown) => {
        this.enviando.set(false);
        this.error.set(error instanceof HttpErrorResponse && error.status === 400
          ? 'El enlace es inválido o expiró.'
          : 'No se pudo restablecer la contraseña. Intenta nuevamente.');
      },
    });
  }
}
