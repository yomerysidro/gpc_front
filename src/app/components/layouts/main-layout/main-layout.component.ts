import { afterNextRender, Component, DestroyRef, ElementRef, inject, input, signal, viewChild } from '@angular/core';
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
  private readonly elemento = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly header = viewChild.required('headerLayout', { read: ElementRef<HTMLElement> });
  private readonly destroyRef = inject(DestroyRef);
  constructor() {
    afterNextRender(() => {
      const cabecera = this.header().nativeElement;
      const medir = () => this.elemento.nativeElement.style.setProperty('--alto-header-real', `${cabecera.getBoundingClientRect().height}px`);
      medir();
      const observador = new ResizeObserver(medir);
      observador.observe(cabecera);
      this.destroyRef.onDestroy(() => observador.disconnect());
    });
  }
  readonly navigation = input<readonly NavigationItem[]>([]);
  protected readonly sidebarContraido = signal(false);
  protected readonly menuMovilAbierto = signal(false);

  protected actualizarMenuMovil(event: Event): void {
    this.menuMovilAbierto.set((event as Event & { newState: string }).newState === 'open');
    if (this.menuMovilAbierto()) this.sidebarContraido.set(false);
  }
}
