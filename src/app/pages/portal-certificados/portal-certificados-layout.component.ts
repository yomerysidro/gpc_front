import { afterNextRender, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../core/services/autenticacion/auth.service';
import { PrivateLayoutComponent } from '../../components/layouts/private-layout/private-layout.component';

/** Recupera una sesión existente al abrir directamente; las consultas públicas no deciden el layout. */
@Component({
  selector: 'app-portal-certificados-layout', standalone: true,
  imports: [PrivateLayoutComponent],
  template: '<app-private-layout [publico]="!auth.isAuthenticated()" />',
})
export class PortalCertificadosLayoutComponent {
  protected readonly auth = inject(AuthService);
  private readonly destroy = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      if (this.auth.isAuthenticated()) return;
      // El portal ya está visible. Esta comprobación solo restaura el menú de una sesión existente.
      this.auth.cargarSesion().pipe(takeUntilDestroyed(this.destroy)).subscribe();
    });
  }
}
