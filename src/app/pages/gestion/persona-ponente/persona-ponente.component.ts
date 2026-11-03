import { Component } from '@angular/core';
import { RegistroGestionComponent } from '../registro-gestion/registro-gestion.component';

@Component({
  selector: 'app-persona-ponente-gestion',
  standalone: true,
  imports: [RegistroGestionComponent],
  templateUrl: './persona-ponente.component.html',
  styleUrl: './persona-ponente.component.scss',
})
export class PersonaPonenteGestionComponent {}
