import { Component } from '@angular/core';
import { RegistroGestionComponent } from '../registro-gestion/registro-gestion.component';

@Component({
  selector: 'app-persona-practicante-gestion',
  standalone: true,
  imports: [RegistroGestionComponent],
  templateUrl: './persona-practicante.component.html',
  styleUrl: './persona-practicante.component.scss',
})
export class PersonaPracticanteGestionComponent {}
