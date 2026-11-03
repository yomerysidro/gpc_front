import { Component, inject, input } from '@angular/core';
import { PersonService } from '../../core/services/person/person.service';
import { GestionColumn, GestionTableComponent } from '../../shared/components/gestion-table/gestion-table.component';
@Component({ selector: 'app-person', standalone: true, imports: [GestionTableComponent], templateUrl: './person.html', styleUrl: './person.scss' })
export class PersonComponent {
  readonly embedded = input(false);
  protected readonly servicio = inject(PersonService);
  protected readonly columnas: readonly GestionColumn[] = [
    { clave: 'id_persona', etiqueta: 'ID' },
    { clave: 'nombres', etiqueta: 'Nombres' },
    { clave: 'apellido_paterno', etiqueta: 'Apellido paterno' },
    { clave: 'apellido_materno', etiqueta: 'Apellido materno' },
    { clave: 'telefono', etiqueta: 'Teléfono' },
    { clave: 'direccion', etiqueta: 'Dirección' },
    { clave: 'correo', etiqueta: 'Correo' },
    { clave: 'fecha_registro', etiqueta: 'Fecha de registro', formato: 'fecha' },
  ];
}
