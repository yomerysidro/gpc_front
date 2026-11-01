import { Component, inject, input } from '@angular/core';
import { DocumentTypeService } from '../../core/services/document-type/document-type.service';
import { GestionColumn, GestionTableComponent } from '../../shared/components/gestion-table/gestion-table.component';

@Component({
  selector: 'app-document-type',
  standalone: true,
  imports: [GestionTableComponent],
  templateUrl: './document-type.html',
  styleUrl: './document-type.scss',
})
export class DocumentTypeComponent {
  readonly embedded = input(false);
  protected readonly servicio = inject(DocumentTypeService);
  protected readonly columnas: readonly GestionColumn[] = [
    { clave: 'id_tipo_documento', etiqueta: 'ID' },
    { clave: 'nombre', etiqueta: 'Nombre' },
    { clave: 'estado', etiqueta: 'Estado', formato: 'booleano' },
  ];
}
