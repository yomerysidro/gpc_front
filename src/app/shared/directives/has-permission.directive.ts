import { Directive, effect, inject, input, TemplateRef, untracked, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../core/services/autenticacion/auth.service';

/**
 * Muestra el elemento solo si el usuario tiene la clave de permiso:
 * `<button *appHasPermission="'usuarios.crear'">`. Reacciona a los cambios de sesión.
 * Es solo presentación: el backend vuelve a validar cada permiso.
 */
@Directive({
  selector: '[appHasPermission]',
  standalone: true
})
export class HasPermissionDirective {
  readonly appHasPermission = input.required<string>();

  private readonly auth = inject(AuthService);
  private readonly plantilla = inject(TemplateRef<unknown>);
  private readonly contenedor = inject(ViewContainerRef);
  private visible = false;

  constructor() {
    effect(() => {
      const permitido = this.auth.tienePermiso(this.appHasPermission());

      // La vista se crea fuera del contexto reactivo: su plantilla puede escribir signals (RouterLink, etc.).
      untracked(() => {
        if (permitido && !this.visible) {
          this.contenedor.createEmbeddedView(this.plantilla);
        } else if (!permitido && this.visible) {
          this.contenedor.clear();
        }
      });

      this.visible = permitido;
    });
  }
}
