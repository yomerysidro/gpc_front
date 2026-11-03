import { Component } from '@angular/core';
import { RegistroGestionComponent } from '../registro-gestion/registro-gestion.component';

@Component({
  selector: 'app-practica-supervisor-gestion',
  standalone: true,
  imports: [RegistroGestionComponent],
  templateUrl: './practica-supervisor.component.html',
  styleUrl: './practica-supervisor.component.scss',
})
export class PracticaSupervisorGestionComponent {}
