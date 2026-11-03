import { Component } from '@angular/core';
import { RegistroGestionComponent } from '../registro-gestion/registro-gestion.component';

@Component({
  selector: 'app-persona-trabajador-gestion',
  standalone: true,
  imports: [RegistroGestionComponent],
  templateUrl: './persona-trabajador.component.html',
  styleUrl: './persona-trabajador.component.scss',
})
export class PersonaTrabajadorGestionComponent {}
