import { Component, input, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../header/header.component';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { NavigationItem } from '../../../core/interfaces/navigation/navigation-item.interface';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  host: { '[class.sidebar-contraido]': 'sidebarContraido()' },
})
export class MainLayoutComponent {
  readonly navigation = input<readonly NavigationItem[]>([]);
  protected readonly sidebarContraido = signal(false);
  protected readonly menuMovilAbierto = signal(false);

  protected actualizarMenuMovil(event: Event): void {
    this.menuMovilAbierto.set((event as Event & { newState: string }).newState === 'open');
    if (this.menuMovilAbierto()) this.sidebarContraido.set(false);
  }
}
