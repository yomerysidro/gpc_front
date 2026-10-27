import { Component } from '@angular/core';
import { PageTitleComponent } from '../../../shared/components/page-title/page-title.component';

@Component({
  selector: 'app-listar-certificados',
  standalone: true,
  imports: [PageTitleComponent],
  templateUrl: './listar-certificados.component.html',
  styleUrl: './listar-certificados.component.scss',
})
export class ListarCertificadosComponent {}
