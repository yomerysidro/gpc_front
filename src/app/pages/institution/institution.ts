import { Component, inject, input } from '@angular/core';
import { InstitutionService } from '../../core/services/institution/institution.service';
import { GestionColumn, GestionTableComponent } from '../../shared/components/gestion-table/gestion-table.component';

@Component({
  selector: 'app-institution',
  standalone: true,
  imports: [GestionTableComponent],
  templateUrl: './institution.html',
  styleUrl: './institution.scss',
})
export class InstitutionComponent {
  readonly embedded = input(false);
  protected readonly servicio = inject(InstitutionService);
  protected readonly columnas: readonly GestionColumn[] = [
    { clave: 'id_institucion', etiqueta: 'ID' },
    { clave: 'nombre_institucion', etiqueta: 'Nombre de institución' },
    { clave: 'pais', etiqueta: 'País' },
    { clave: 'tipo', etiqueta: 'Tipo' },
  ];
}
