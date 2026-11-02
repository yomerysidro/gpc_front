import { Component, inject, input } from '@angular/core';
import { PersonSpeakerService } from '../../core/services/person-speaker/person-speaker.service';
import { GestionColumn, GestionTableComponent } from '../../shared/components/gestion-table/gestion-table.component';

@Component({
  selector: 'app-person-speaker',
  standalone: true,
  imports: [GestionTableComponent],
  templateUrl: './person-speaker.html',
  styleUrl: './person-speaker.scss',
})
export class PersonSpeakerComponent {
  readonly embedded = input(false);
  protected readonly servicio = inject(PersonSpeakerService);
  protected readonly columnas: readonly GestionColumn[] = [
    { clave: 'id_persona_ponente', etiqueta: 'ID' },
    { clave: 'id_persona', etiqueta: 'Persona' },
    { clave: 'id_institucion', etiqueta: 'Institución' },
    { clave: 'cargo', etiqueta: 'Cargo' },
    { clave: 'especialidad', etiqueta: 'Especialidad' },
  ];
}
