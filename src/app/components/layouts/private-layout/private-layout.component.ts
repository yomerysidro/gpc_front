import { Component, computed, ElementRef, HostListener, inject, input, signal, viewChild } from '@angular/core';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
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
  readonly publico = input(false);
  private readonly entrada = inject(Router).getCurrentNavigation()?.extras.info as { inicioSesionExitoso?: boolean } | undefined;
  protected readonly inicioSesionExitoso = signal(this.entrada?.inicioSesionExitoso === true);
  protected readonly auth = inject(AuthService);
  protected readonly saliendo = signal(false);
  protected readonly menuAbierto = signal(false);
  protected readonly errorSalida = signal(false);
  private readonly menuUsuario = viewChild<ElementRef<HTMLElement>>('menuUsuario');
  private readonly botonUsuario = viewChild<ElementRef<HTMLButtonElement>>('botonUsuario');

  @HostListener('document:click', ['$event'])
  protected cerrarAlPulsarFuera(event: MouseEvent): void {
    if (!this.menuUsuario()?.nativeElement.contains(event.target as Node)) this.menuAbierto.set(false);
  }

  @HostListener('document:keydown.escape')
  protected cerrarConEscape(): void {
    if (!this.menuAbierto()) return;
    this.menuAbierto.set(false);
    this.botonUsuario()?.nativeElement.focus();
  }

  protected cerrarAlSalir(event: FocusEvent): void {
    if (!this.menuUsuario()?.nativeElement.contains(event.relatedTarget as Node | null)) this.menuAbierto.set(false);
  }

  protected readonly navegacion = computed<readonly NavigationItem[]>(() =>
    this.auth.modulos().map(modulo => ({
      label: modulo.nombre,
      path: modulo.url,
      icon: modulo.imagen,
    })),
  );

  protected cerrarSesion(): void {
    if (this.saliendo()) return;
    this.saliendo.set(true);
    this.errorSalida.set(false);
    this.auth.logout().pipe(finalize(() => this.saliendo.set(false))).subscribe({
      error: () => this.errorSalida.set(true),
    });
  }
}
