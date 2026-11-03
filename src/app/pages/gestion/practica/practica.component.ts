import { Component } from '@angular/core';
import { RegistroGestionComponent } from '../registro-gestion/registro-gestion.component';

@Component({
  selector: 'app-practica-gestion',
  standalone: true,
  imports: [RegistroGestionComponent],
  templateUrl: './practica.component.html',
  styleUrl: './practica.component.scss',
})
export class PracticaGestionComponent {}
