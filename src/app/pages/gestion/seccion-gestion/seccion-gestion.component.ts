import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PageTitleComponent } from '../../../shared/components/page-title/page-title.component';

@Component({
  selector: 'app-seccion-gestion',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, PageTitleComponent],
  templateUrl: './seccion-gestion.component.html',
  styleUrl: './seccion-gestion.component.scss',
})
export class SeccionGestionComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly titulo: string = this.route.snapshot.data['titulo'];
  protected readonly enlaces: { titulo: string; ruta: string; exacto: boolean }[] = this.route.snapshot.data['enlaces'];
}
