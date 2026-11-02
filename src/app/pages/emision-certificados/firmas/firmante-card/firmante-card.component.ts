import { Component, input, output } from '@angular/core';
import { FirmanteVistaMunicipal } from '../firmante-vista.interface';

@Component({
  selector: 'app-firmante-card', standalone: true,
  templateUrl: './firmante-card.component.html', styleUrl: './firmante-card.component.scss',
})
export class FirmanteCardComponent {
  readonly firmante = input.required<FirmanteVistaMunicipal>();
  readonly puedeEditar = input(false);
  readonly puedeEliminar = input(false);
  readonly ocupado = input(false);
  readonly dni = input<string | null>(null);
  readonly administrar = output<void>();
  readonly eliminar = output<void>();
}
