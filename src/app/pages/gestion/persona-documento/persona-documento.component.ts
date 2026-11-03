import { Component } from '@angular/core';
import { RegistroGestionComponent } from '../registro-gestion/registro-gestion.component';

@Component({
  selector: 'app-persona-documento-gestion',
  standalone: true,
  imports: [RegistroGestionComponent],
  templateUrl: './persona-documento.component.html',
  styleUrl: './persona-documento.component.scss',
})
export class PersonaDocumentoGestionComponent {}
