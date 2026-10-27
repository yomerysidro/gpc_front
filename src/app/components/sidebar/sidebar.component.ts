import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavigationItem } from '../../core/interfaces/navigation/navigation-item.interface';
import { ICONOS_DISPONIBLES } from '../../shared/utils/iconos-disponibles';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  readonly items = input<readonly NavigationItem[]>([]);
  protected readonly iconos = ICONOS_DISPONIBLES;
}
