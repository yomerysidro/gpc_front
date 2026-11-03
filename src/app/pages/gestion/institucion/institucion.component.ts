import { Component } from '@angular/core';
import { RegistroGestionComponent } from '../registro-gestion/registro-gestion.component';

@Component({
  selector: 'app-institucion-gestion',
  standalone: true,
  imports: [RegistroGestionComponent],
  templateUrl: './institucion.component.html',
  styleUrl: './institucion.component.scss',
})
export class InstitucionGestionComponent {}
