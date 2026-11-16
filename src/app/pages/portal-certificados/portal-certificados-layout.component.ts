import { afterNextRender, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize, of, timeout } from 'rxjs';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/autenticacion/auth.service';
import { PrivateLayoutComponent } from '../../components/layouts/private-layout/private-layout.component';

/** Recupera una sesión existente al abrir directamente; las consultas públicas no deciden el layout. */
@Component({
  selector: 'app-portal-certificados-layout', standalone: true,
  imports: [RouterOutlet, PrivateLayoutComponent],
  template: `@if (!sesionConsultada()) {
    <header><img src="/marca/escudo-160.webp" alt="Escudo municipal" width="64" height="72" /> Municipalidad Distrital de Morales</header>
    <p role="status">Cargando Portal Público de Certificados…</p>
  } @else if (auth?.isAuthenticated()) { <app-private-layout /> } @else { <router-outlet /> }`,
})
export class PortalCertificadosLayoutComponent {
  protected readonly auth = inject(AuthService, { optional: true });
  protected readonly sesionConsultada = signal(!this.auth || this.auth.isAuthenticated());
  private readonly destroy = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      if (!this.auth || this.auth.isAuthenticated()) { this.sesionConsultada.set(true); return; }
      // /auth/me es la comprobación habitual de sesión: su 401 no redirige a login.
      // No se ejecuta al buscar DNI, cambiar código, abrir un PDF ni regresar.
      this.auth.cargarSesion().pipe(timeout(10000), catchError(() => of(false)),
        takeUntilDestroyed(this.destroy), finalize(() => this.sesionConsultada.set(true))).subscribe();
    });
  }
}
