import { Component, input } from '@angular/core';
import { EstadoSolicitud } from '../../../core/interfaces/solicitudes/solicitud.interface';
@Component({
  selector: 'app-solicitud-estado-badge', standalone: true,
  template: `<span class="estado" [attr.data-estado]="estado()">{{ estado() }}</span>`, styleUrl: './solicitud-estado-badge.component.scss',
})
export class SolicitudEstadoBadgeComponent { readonly estado = input.required<EstadoSolicitud>(); }
