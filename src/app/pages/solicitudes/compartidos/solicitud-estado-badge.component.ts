import { Component, input } from '@angular/core';
import { EstadoSolicitud } from '../../../core/interfaces/solicitudes/solicitud.interface';
@Component({
  selector: 'app-solicitud-estado-badge', standalone: true,
  template: `<span class="estado" [attr.data-estado]="estado()">{{ revision() && estado() === 'Enviada' ? 'Pendiente de revisión' : estado() }}</span>`, styleUrl: './solicitud-estado-badge.component.scss',
})
export class SolicitudEstadoBadgeComponent {
  readonly estado = input.required<EstadoSolicitud>();
  readonly revision = input(false);
}
