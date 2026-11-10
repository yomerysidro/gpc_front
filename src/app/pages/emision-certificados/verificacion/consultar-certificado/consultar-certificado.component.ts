import { Component, signal } from '@angular/core';
import { VerificacionPublicaComponent } from '../verificacion-publica.component';
import { ListadoEmisionComponent } from '../../compartidos/listado-emision.component';

/** La consulta institucional reutiliza exactamente la verificación pública de Laravel. */
@Component({
  selector: 'app-consultar-certificado', standalone: true,
  imports: [VerificacionPublicaComponent, ListadoEmisionComponent],
  templateUrl: './consultar-certificado.component.html', styleUrl: '../../compartidos/emision.scss',
})
export class ConsultarCertificadoComponent {
  protected readonly historial = signal(false);
}
