import { Component, inject } from '@angular/core';
import { SolicitudesService } from '../../../core/services/solicitudes/solicitudes.service';
@Component({
  selector: 'app-integracion-solicitudes', standalone: true,
  template: `@if (!api.integrado) { <p class="aviso" role="status">Servicio de Solicitudes pendiente de habilitación. Las consultas, el guardado, el envío y las decisiones no están disponibles. No se ha registrado información.</p> }`,
  styleUrl: './solicitudes.scss',
})
export class IntegracionAvisoComponent { protected readonly api = inject(SolicitudesService); }
