import { Component, signal } from '@angular/core';
import { PortalCertificadosComponent } from '../../../portal-certificados/portal-certificados.component';
import { ListadoEmisionComponent } from '../../compartidos/listado-emision.component';

/** La consulta institucional reutiliza exactamente la verificación pública de Laravel. */
@Component({
  selector: 'app-consultar-certificado', standalone: true,
  imports: [PortalCertificadosComponent, ListadoEmisionComponent],
  templateUrl: './consultar-certificado.component.html', styleUrl: '../../compartidos/emision.scss',
})
export class ConsultarCertificadoComponent {
  protected readonly historial = signal(false);
}
