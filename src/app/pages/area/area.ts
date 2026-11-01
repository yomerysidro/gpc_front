import { Component, inject, input } from '@angular/core';
import { AreaService } from '../../core/services/area/area.service';
import { GestionColumn, GestionTableComponent } from '../../shared/components/gestion-table/gestion-table.component';

@Component({
  selector: 'app-area',
  standalone: true,
  imports: [GestionTableComponent],
  templateUrl: './area.html',
  styleUrl: './area.scss',
})
export class AreaComponent {
  readonly embedded = input(false);
  protected readonly servicio = inject(AreaService);
  protected readonly columnas: readonly GestionColumn[] = [
    { clave: 'id_area', etiqueta: 'ID' },
    { clave: 'nombre', etiqueta: 'Nombre' },
  ];
}
