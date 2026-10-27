import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageTitleComponent } from '../../../../shared/components/page-title/page-title.component';
import { ListadoEmisionComponent } from '../../compartidos/listado-emision.component';
@Component({
  selector: 'app-asignar-firmantes', standalone: true,
  imports: [RouterLink, PageTitleComponent, ListadoEmisionComponent],
  templateUrl: './asignar-firmantes.component.html', styleUrl: '../../compartidos/emision.scss',
})
export class AsignarFirmantesComponent {}
