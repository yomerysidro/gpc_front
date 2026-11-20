import { afterNextRender, Component, computed, DestroyRef, ElementRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ErrorApi } from '../../../../core/interfaces/api/api-response.interface';
import { Rol } from '../../../../core/interfaces/roles/rol.interface';
import { Usuario, UsuarioPayload } from '../../../../core/interfaces/usuarios/usuario.interface';
import { AuthService } from '../../../../core/services/autenticacion/auth.service';
import { RolesService } from '../../../../core/services/roles/roles.service';
import { UsuariosService } from '../../../../core/services/usuarios/usuarios.service';
import { PageTitleComponent } from '../../../../shared/components/page-title/page-title.component';
import { AvisoUsuarios } from '../listar-usuarios/listar-usuarios.component';

type Campo = 'dni' | 'nombres' | 'apellidoPaterno' | 'apellidoMaterno' | 'correo' | 'idRol' | 'password' | 'password_confirmation';

/** Mensajes de validación del navegador; los del backend (422) tienen prioridad. */
const MENSAJES: Record<Campo, Partial<Record<string, string>>> = {
  dni: { required: 'Ingresa el DNI.', pattern: 'El DNI debe tener 8 dígitos.' },
  nombres: { maxlength: 'Máximo 150 caracteres.' },
  apellidoPaterno: { maxlength: 'Máximo 150 caracteres.' },
  apellidoMaterno: { maxlength: 'Máximo 150 caracteres.' },
  correo: { required: 'Ingresa el correo.', email: 'Ingresa un correo válido.', maxlength: 'Máximo 150 caracteres.' },
  idRol: { required: 'Elige un rol.' },
  password: { minlength: 'Usa al menos 8 caracteres.' },
  password_confirmation: {},
};

import { input, output } from '@angular/core';

@Component({
  selector: 'app-formulario-usuario',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, PageTitleComponent],
  templateUrl: './formulario-usuario.component.html',
  styleUrl: './formulario-usuario.component.scss'
})
export class FormularioUsuarioComponent {
  readonly enDialogo = input(false);
  readonly cancelado = output<void>();
  readonly guardado = output<AvisoUsuarios>();
  ocupado(): boolean { return this.enviando(); }
  private readonly auth = inject(AuthService);
  private readonly usuariosService = inject(UsuariosService);
  private readonly rolesService = inject(RolesService);
  private readonly router = inject(Router);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly parametroId = inject(ActivatedRoute).snapshot.paramMap.get('id');

  protected readonly modoEdicion = this.parametroId !== null;
  private readonly id = Number(this.parametroId);
  protected readonly puedeCambiarPassword = computed(() => {
    const rol = this.auth.usuario()?.rol;
    return this.modoEdicion && (rol === 'Administrador' || rol === 'Administrador de Sistemas');
  });

  protected readonly roles = signal<readonly Rol[]>([]);
  protected readonly usuario = signal<Usuario | null>(null);
  protected readonly rolActualFueraDeLista = computed(() => {
    const rol = this.usuario()?.rol;
    return rol && !this.roles().some(disponible => disponible.id === rol.id) ? rol : null;
  });
  protected readonly cargando = signal(this.modoEdicion);
  protected readonly errorCarga = signal<string | null>(null);
  protected readonly enviando = signal(false);
  protected readonly errorGeneral = signal<string | null>(null);
  protected readonly erroresServidor = signal<Readonly<Record<string, readonly string[]>>>({});

  protected readonly form = inject(NonNullableFormBuilder).group({
    dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    nombres: ['', Validators.maxLength(150)],
    apellidoPaterno: ['', Validators.maxLength(150)],
    apellidoMaterno: ['', Validators.maxLength(150)],
    correo: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    idRol: ['', this.modoEdicion ? [] : Validators.required],
    password: ['', Validators.minLength(8)],
    password_confirmation: [''],
  });

  constructor() {
    if (this.modoEdicion) {
      // Los datos de la persona son de solo lectura en la edición de la cuenta.
      for (const campo of ['dni', 'nombres', 'apellidoPaterno', 'apellidoMaterno'] as const) {
        this.form.controls[campo].disable();
      }
    }

    // Al corregir un campo, su error del backend deja de aplicar.
    const destroyRef = inject(DestroyRef);
    for (const [campo, control] of Object.entries(this.form.controls)) {
      control.valueChanges.pipe(takeUntilDestroyed(destroyRef)).subscribe(() => {
        if (this.erroresServidor()[campo]) {
          const { [campo]: _, ...resto } = this.erroresServidor();
          this.erroresServidor.set(resto);
        }
      });
    }

    afterNextRender(() => {
      this.rolesService.listar().subscribe({
        next: roles => this.roles.set(roles.filter(rol => rol.estado)),
        error: (error: ErrorApi) => this.errorGeneral.set(`No se pudieron cargar los roles. ${error.mensaje}`),
      });

      if (this.modoEdicion) {
        this.cargarUsuario();
      }
    });
  }

  /** Mensaje de error visible de un campo: primero el del backend, luego el del navegador. */
  protected error(campo: Campo): string | null {
    const servidor = this.erroresServidor()[campo];

    if (servidor?.length) return servidor[0];

    const control = this.form.controls[campo];

    if (!control.touched) return null;

    if (campo === 'password_confirmation' && this.passwordsNoCoinciden()) {
      return 'Las contraseñas no coinciden.';
    }
    if (control.valid || !control.errors) return null;

    const clave = Object.keys(control.errors)[0];
    return MENSAJES[campo][clave] ?? 'Revisa este campo.';
  }

  protected guardar(): void {
    this.errorGeneral.set(null);

    if (this.enviando()) return;

    if (this.form.invalid || this.passwordsNoCoinciden()) {
      this.form.markAllAsTouched();
      this.enfocarPrimerError();
      return;
    }

    const valores = this.form.getRawValue();
    const idRol = Number(valores.idRol);
    this.enviando.set(true);

    const peticion = this.modoEdicion
      ? this.usuariosService.actualizar(this.id, {
          correo: valores.correo.trim(),
          ...(idRol && idRol !== this.usuario()?.rol?.id ? { idRol } : {}),
          ...(this.puedeCambiarPassword() && valores.password ? {
            password: valores.password,
            password_confirmation: valores.password_confirmation,
          } : {}),
        })
      : this.usuariosService.crear(this.payloadCreacion(valores, idRol));

    peticion.subscribe({
      next: () => {
        const aviso: AvisoUsuarios = this.modoEdicion
          ? { tipo: 'exito', texto: `Se guardaron los cambios de ${this.usuario()?.nombre ?? 'el usuario'}.` }
          : { tipo: 'exito', texto: 'Usuario creado. Se envió un enlace a su correo para crear su contraseña.' };
        if (this.enDialogo()) this.guardado.emit(aviso);
        else void this.router.navigate(['/usuarios'], { state: { aviso } });
      },
      error: (error: ErrorApi) => {
        this.enviando.set(false);

        if (error.status === 422) {
          this.erroresServidor.set(error.errores);
          this.form.markAllAsTouched();
          this.errorGeneral.set(this.resumen422(error));
          this.enfocarPrimerError();
        } else {
          this.errorGeneral.set(error.mensaje);
        }
      },
    });
  }

  private passwordsNoCoinciden(): boolean {
    const { password, password_confirmation } = this.form.controls;
    return this.puedeCambiarPassword() && password.value !== password_confirmation.value;
  }

  private cargarUsuario(): void {
    if (!Number.isInteger(this.id) || this.id <= 0) {
      this.cargando.set(false);
      this.errorCarga.set('El usuario no existe.');
      return;
    }

    this.usuariosService.obtener(this.id).subscribe({
      next: usuario => {
        this.usuario.set(usuario);
        this.form.patchValue({ correo: usuario.correo, idRol: usuario.rol ? String(usuario.rol.id) : '' });
        this.cargando.set(false);
      },
      error: (error: ErrorApi) => {
        this.cargando.set(false);
        this.errorCarga.set(error.status === 404 ? 'El usuario no existe.' : error.mensaje);
      },
    });
  }

  private payloadCreacion(valores: Record<Campo, string>, idRol: number): UsuarioPayload {
    const opcional = (valor: string) => valor.trim() || undefined;

    return {
      dni: valores.dni,
      nombres: opcional(valores.nombres),
      apellidoPaterno: opcional(valores.apellidoPaterno),
      apellidoMaterno: opcional(valores.apellidoMaterno),
      correo: valores.correo.trim(),
      idRol,
    };
  }

  /**
   * Resumen propio del 422: Laravel reemplaza el message por el primer error más
   * "(and N more errors)" en inglés. El detalle queda debajo de cada campo.
   */
  private resumen422(error: ErrorApi): string {
    return error.errores['nombres'] || error.errores['apellidoPaterno']
      ? 'La persona no está registrada: completa sus nombres y su apellido paterno.'
      : 'Revisa los campos marcados.';
  }

  private enfocarPrimerError(): void {
    setTimeout(() => this.host.nativeElement.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
  }
}
