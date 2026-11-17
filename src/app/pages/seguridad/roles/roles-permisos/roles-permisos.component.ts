import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageTitleComponent } from '../../../../shared/components/page-title/page-title.component';
import { CatalogoModulosComponent } from '../catalogo-modulos/catalogo-modulos.component';
import { ListaRolesComponent } from '../lista-roles/lista-roles.component';

type Pestana = 'roles' | 'modulos';

const PESTANAS: readonly Pestana[] = ['roles', 'modulos'];

/** /roles: pestañas "Roles" y "Módulos y permisos" (patrón ARIA tabs). La pestaña va en ?pestana=. */
@Component({
  selector: 'app-roles-permisos',
  standalone: true,
  imports: [PageTitleComponent, ListaRolesComponent, CatalogoModulosComponent],
  templateUrl: './roles-permisos.component.html',
  styleUrl: './roles-permisos.component.scss'
})
export class RolesPermisosComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly pestana = signal<Pestana>(
    this.route.snapshot.queryParamMap.get('pestana') === 'modulos' ? 'modulos' : 'roles');

  protected seleccionar(pestana: Pestana): void {
    this.pestana.set(pestana);
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { pestana: pestana === 'roles' ? null : pestana },
      replaceUrl: true,
    });
  }

  /** Flechas, Inicio y Fin mueven la selección y el foco entre pestañas. */
  protected alTeclear(evento: KeyboardEvent): void {
    const actual = PESTANAS.indexOf(this.pestana());
    const destino = {
      ArrowRight: (actual + 1) % PESTANAS.length,
      ArrowLeft: (actual - 1 + PESTANAS.length) % PESTANAS.length,
      Home: 0,
      End: PESTANAS.length - 1,
    }[evento.key];

    if (destino === undefined) return;

    evento.preventDefault();
    this.seleccionar(PESTANAS[destino]);
    (evento.currentTarget as HTMLElement).querySelector<HTMLElement>(`#pestana-${PESTANAS[destino]}`)?.focus();
  }
}
