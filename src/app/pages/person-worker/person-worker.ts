import { Component, inject, input } from '@angular/core';
import { PersonWorkerService } from '../../core/services/person-worker/person-worker.service';
import { GestionColumn, GestionTableComponent } from '../../shared/components/gestion-table/gestion-table.component';

@Component({
  selector: 'app-person-worker',
  standalone: true,
  imports: [GestionTableComponent],
  templateUrl: './person-worker.html',
  styleUrl: './person-worker.scss',
})
export class PersonWorkerComponent {
  readonly embedded = input(false);
  protected readonly servicio = inject(PersonWorkerService);
  protected readonly columnas: readonly GestionColumn[] = [
    { clave: 'id_persona_trabajador', etiqueta: 'ID' },
    { clave: 'id_persona', etiqueta: 'Persona' },
    { clave: 'id_area', etiqueta: 'Área' },
    { clave: 'cargo', etiqueta: 'Cargo' },
    { clave: 'fecha_ingreso', etiqueta: 'Fecha de ingreso', formato: 'fecha' },
    { clave: 'fecha_fin', etiqueta: 'Fecha de fin', formato: 'fecha' },
    { clave: 'estado', etiqueta: 'Estado', formato: 'booleano' },
  ];
}
