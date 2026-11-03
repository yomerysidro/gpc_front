import { Component } from '@angular/core';
import { RegistroGestionComponent } from '../registro-gestion/registro-gestion.component';

@Component({
  selector: 'app-persona-gestion',
  standalone: true,
  imports: [RegistroGestionComponent],
  templateUrl: './persona.component.html',
  styleUrl: './persona.component.scss',
})
export class PersonaGestionComponent {}
