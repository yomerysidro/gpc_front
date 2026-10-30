import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageTitleComponent } from '../../../../shared/components/page-title/page-title.component';
import { ListadoEmisionComponent } from '../../compartidos/listado-emision.component';
@Component({
  selector: 'app-listar-firmas', standalone: true,
  imports: [RouterLink, PageTitleComponent, ListadoEmisionComponent],
  templateUrl: './listar-firmas.component.html', styleUrl: '../../compartidos/emision.scss',
})
export class ListarFirmasComponent {}
