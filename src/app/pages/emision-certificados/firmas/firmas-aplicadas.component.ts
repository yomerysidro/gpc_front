import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageTitleComponent } from '../../../shared/components/page-title/page-title.component';
import { ListadoEmisionComponent } from '../compartidos/listado-emision.component';

@Component({
  selector: 'app-firmas-aplicadas', standalone: true,
  imports: [RouterLink, PageTitleComponent, ListadoEmisionComponent],
  template: '<app-page-title title="Firmas aplicadas" /><a class="btn" routerLink="/certificaciones/firmas">Volver a Firmas</a><app-listado-emision recurso="certificados-firmas" [soloLectura]="true" />',
})
export class FirmasAplicadasComponent {}
