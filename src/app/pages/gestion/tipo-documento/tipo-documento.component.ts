import { Component } from '@angular/core';
import { RegistroGestionComponent } from '../registro-gestion/registro-gestion.component';

@Component({
  selector: 'app-tipo-documento-gestion',
  standalone: true,
  imports: [RegistroGestionComponent],
  templateUrl: './tipo-documento.component.html',
  styleUrl: './tipo-documento.component.scss',
})
export class TipoDocumentoGestionComponent {}
