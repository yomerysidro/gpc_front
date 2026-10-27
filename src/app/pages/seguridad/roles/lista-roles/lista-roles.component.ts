import { afterNextRender, Component, inject, signal, viewChild } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiResponse, ErrorApi } from '../../../../core/interfaces/api/api-response.interface';
import { Rol } from '../../../../core/interfaces/roles/rol.interface';
import { RolesService } from '../../../../core/services/roles/roles.service';
import { DialogoConfirmacionComponent } from '../../../../shared/components/dialogo-confirmacion/dialogo-confirmacion.component';
import { DialogoComponent } from '../../../../shared/components/dialogo/dialogo.component';
import { HasPermissionDirective } from '../../../../shared/directives/has-permission.directive';

interface Aviso {
  readonly tipo: 'exito' | 'error';
  readonly texto: string;
}

const ROL_ADMINISTRADOR = 'Administrador';

/** Pestaña "Roles" de /roles: listado, alta y edición del nombre, estado y acceso a la matriz. */
@Component({
  selector: 'app-lista-roles',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, HasPermissionDirective, DialogoComponent, DialogoConfirmacionComponent],
  templateUrl: './lista-roles.component.html',
  styleUrl: './lista-roles.component.scss'
})
export class ListaRolesComponent {
  private readonly rolesService = inject(RolesService);
  private readonly dialogoNombre = viewChild.required<DialogoComponent>('dialogoNombre');
  private readonly confirmacion = viewChild.required(DialogoConfirmacionComponent);

  protected readonly roles = signal<readonly Rol[]>([]);
  protected readonly cargando = signal(true);
  protected readonly errorCarga = signal<string | null>(null);
  protected readonly aviso = signal<Aviso | null>(null);
  protected readonly procesando = signal<number | null>(null);
  protected readonly porConfirmar = signal<Rol | null>(null);

  /** null: creando un rol nuevo. */
  protected readonly editando = signal<Rol | null>(null);
  protected readonly enviando = signal(false);
  protected readonly errorNombre = signal<string | null>(null);
  protected readonly errorDialogo = signal<string | null>(null);
  protected readonly form = inject(NonNullableFormBuilder).group({
    nombre: ['', [Validators.required, Validators.maxLength(50)]],
  });

  constructor() {
    afterNextRender(() => this.cargar());
    this.form.controls.nombre.valueChanges.subscribe(() => this.errorNombre.set(null));
  }

  /** Rol del sistema: no se renombra ni se desactiva (el backend responde 409). */
  protected esAdministrador(rol: Rol): boolean {
    return rol.nombre === ROL_ADMINISTRADOR;
  }

  protected abrirNombre(rol: Rol | null): void {
    this.editando.set(rol);
    this.form.reset({ nombre: rol?.nombre ?? '' });
    this.errorNombre.set(null);
    this.errorDialogo.set(null);
    this.dialogoNombre().abrir();
  }

  protected cerrarNombre(): void {
    this.dialogoNombre().cerrar();
  }

  protected mensajeNombre(): string | null {
    const control = this.form.controls.nombre;

    if (this.errorNombre()) return this.errorNombre();
    if (!control.touched || control.valid) return null;

    return control.hasError('required') ? 'Ingresa el nombre del rol.' : 'Máximo 50 caracteres.';
  }

  protected guardarNombre(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const rol = this.editando();
    const nombre = this.form.getRawValue().nombre.trim();
    this.enviando.set(true);
    this.errorDialogo.set(null);

    const peticion = rol ? this.rolesService.actualizar(rol.id, { nombre }) : this.rolesService.crear({ nombre });

    peticion.subscribe({
      next: () => {
        this.enviando.set(false);
        this.dialogoNombre().cerrar();
        this.aviso.set({ tipo: 'exito', texto: rol ? `El rol ahora se llama ${nombre}.` : `Se creó el rol ${nombre}. Configura sus accesos.` });
        this.cargar();
      },
      error: (error: ErrorApi) => {
        this.enviando.set(false);

        if (error.status === 422 && error.errores['nombre']?.length) {
          this.errorNombre.set(error.errores['nombre'][0]);
        } else {
          this.errorDialogo.set(error.mensaje);
        }
      },
    });
  }

  protected async cambiarEstado(rol: Rol): Promise<void> {
    this.porConfirmar.set(rol);

    if (!await this.confirmacion().abrir()) return;

    const activar = !rol.estado;
    this.ejecutar(rol, this.rolesService.cambiarEstado(rol.id, activar),
      `El rol ${rol.nombre} fue ${activar ? 'activado' : 'desactivado'}.`);
  }

  private ejecutar(rol: Rol, accion: Observable<ApiResponse<unknown>>, exito: string): void {
    this.procesando.set(rol.id);
    this.aviso.set(null);

    accion.subscribe({
      next: () => {
        this.procesando.set(null);
        this.aviso.set({ tipo: 'exito', texto: exito });
        this.cargar();
      },
      error: (error: ErrorApi) => {
        this.procesando.set(null);
        this.aviso.set({ tipo: 'error', texto: error.mensaje });
      },
    });
  }

  private cargar(): void {
    this.rolesService.listar().subscribe({
      next: roles => {
        this.roles.set(roles);
        this.cargando.set(false);
        this.errorCarga.set(null);
      },
      error: (error: ErrorApi) => {
        this.cargando.set(false);
        this.errorCarga.set(error.mensaje);
      },
    });
  }
}
