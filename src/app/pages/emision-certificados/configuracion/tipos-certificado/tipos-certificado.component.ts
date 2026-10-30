import { Component } from '@angular/core';
import { PageTitleComponent } from '../../../../shared/components/page-title/page-title.component';
import { ListadoEmisionComponent } from '../../compartidos/listado-emision.component';

@Component({
  selector: 'app-tipos-certificado', standalone: true,
  imports: [PageTitleComponent, ListadoEmisionComponent],
  template: '<app-page-title title="Configuración" /><h2>Tipos de certificado</h2><app-listado-emision recurso="tipos-certificado" />',
})
export class TiposCertificadoComponent {}
