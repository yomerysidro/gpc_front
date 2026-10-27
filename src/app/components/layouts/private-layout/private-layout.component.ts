import { Component, computed, inject, signal } from '@angular/core';
import { MainLayoutComponent } from '../main-layout/main-layout.component';
import { NavigationItem } from '../../../core/interfaces/navigation/navigation-item.interface';
import { AuthService } from '../../../core/services/autenticacion/auth.service';

/** Contenedor de las rutas privadas: aporta sesión y menú a main-layout, que solo presenta. */
@Component({
  selector: 'app-private-layout',
  standalone: true,
  imports: [MainLayoutComponent],
  templateUrl: './private-layout.component.html',
  styleUrl: './private-layout.component.scss'
})
export class PrivateLayoutComponent {
  protected readonly auth = inject(AuthService);
  protected readonly saliendo = signal(false);

  protected readonly navegacion = computed<readonly NavigationItem[]>(() =>
    this.auth.modulos().map(modulo => ({
      label: modulo.nombre,
      path: modulo.url,
      icon: modulo.imagen,
    })),
  );

  protected cerrarSesion(): void {
    this.saliendo.set(true);
    this.auth.logout().subscribe({ complete: () => this.saliendo.set(false) });
  }
}
