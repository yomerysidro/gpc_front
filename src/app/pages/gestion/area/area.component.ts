import { Component } from '@angular/core';
import { RegistroGestionComponent } from '../registro-gestion/registro-gestion.component';

@Component({
  selector: 'app-area-gestion',
  standalone: true,
  imports: [RegistroGestionComponent],
  templateUrl: './area.component.html',
  styleUrl: './area.component.scss',
})
export class AreaGestionComponent {}
