import { Component, inject, input } from '@angular/core';
import { PersonInternService } from '../../core/services/person-intern/person-intern.service';
import { GestionColumn, GestionTableComponent } from '../../shared/components/gestion-table/gestion-table.component';

@Component({
  selector: 'app-person-intern',
  standalone: true,
  imports: [GestionTableComponent],
  templateUrl: './person-intern.html',
  styleUrl: './person-intern.scss',
})
export class PersonInternComponent {
  readonly embedded = input(false);
  protected readonly servicio = inject(PersonInternService);
  protected readonly columnas: readonly GestionColumn[] = [
    { clave: 'id_persona_practicante', etiqueta: 'ID' },
    { clave: 'id_persona', etiqueta: 'Persona' },
    { clave: 'codigo', etiqueta: 'Código' },
    { clave: 'estado', etiqueta: 'Estado' },
  ];
}
