import { Component, inject, input } from '@angular/core';
import { PersonDocumentService } from '../../core/services/person-document/person-document.service';
import { GestionColumn, GestionTableComponent } from '../../shared/components/gestion-table/gestion-table.component';

@Component({
  selector: 'app-person-document',
  standalone: true,
  imports: [GestionTableComponent],
  templateUrl: './person-document.html',
  styleUrl: './person-document.scss',
})
export class PersonDocumentComponent {
  readonly embedded = input(false);
  protected readonly servicio = inject(PersonDocumentService);
  protected readonly columnas: readonly GestionColumn[] = [
    { clave: 'id_persona_documento', etiqueta: 'ID' },
    { clave: 'id_persona', etiqueta: 'Persona' },
    { clave: 'id_tipo_documento', etiqueta: 'Tipo de documento' },
    { clave: 'numero_documento', etiqueta: 'Número de documento' },
    { clave: 'estado', etiqueta: 'Estado' },
  ];
}
