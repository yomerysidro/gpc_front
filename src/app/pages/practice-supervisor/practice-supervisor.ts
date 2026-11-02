import { Component, inject, input } from '@angular/core';
import { PracticeSupervisorService } from '../../core/services/practice-supervisor/practice-supervisor.service';
import { GestionColumn, GestionTableComponent } from '../../shared/components/gestion-table/gestion-table.component';

@Component({
  selector: 'app-practice-supervisor',
  standalone: true,
  imports: [GestionTableComponent],
  templateUrl: './practice-supervisor.html',
  styleUrl: './practice-supervisor.scss',
})
export class PracticeSupervisorComponent {
  readonly embedded = input(false);
  protected readonly servicio = inject(PracticeSupervisorService);
  protected readonly columnas: readonly GestionColumn[] = [
    { clave: 'id_practica_supervisor', etiqueta: 'ID' },
    { clave: 'id_practica', etiqueta: 'Práctica' },
    { clave: 'id_persona_trabajador', etiqueta: 'Trabajador' },
    { clave: 'tipo_supervision', etiqueta: 'Tipo de supervisión' },
    { clave: 'fecha_inicio', etiqueta: 'Fecha de inicio', formato: 'fecha' },
    { clave: 'fecha_fin', etiqueta: 'Fecha de fin', formato: 'fecha' },
    { clave: 'estado', etiqueta: 'Estado' },
  ];
}
