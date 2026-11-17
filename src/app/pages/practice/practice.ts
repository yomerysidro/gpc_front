import { Component, inject, input } from '@angular/core';
import { PracticeService } from '../../core/services/practice/practice.service';
import { GestionColumn, GestionTableComponent } from '../../shared/components/gestion-table/gestion-table.component';

@Component({
  selector: 'app-practice',
  standalone: true,
  imports: [GestionTableComponent],
  templateUrl: './practice.html',
  styleUrl: './practice.scss',
})
export class PracticeComponent {
  readonly embedded = input(false);
  protected readonly servicio = inject(PracticeService);
  protected readonly columnas: readonly GestionColumn[] = [
    { clave: 'id_practica', etiqueta: 'ID' },
    { clave: 'id_persona_practicante', etiqueta: 'Practicante' },
    { clave: 'id_institucion', etiqueta: 'Institución' },
    { clave: 'id_area', etiqueta: 'Área' },
    { clave: 'carrera', etiqueta: 'Carrera' },
    { clave: 'fecha_inicio', etiqueta: 'Fecha de inicio', formato: 'fecha' },
    { clave: 'fecha_fin', etiqueta: 'Fecha de fin', formato: 'fecha' },
    { clave: 'estado', etiqueta: 'Estado' },
  ];
}
