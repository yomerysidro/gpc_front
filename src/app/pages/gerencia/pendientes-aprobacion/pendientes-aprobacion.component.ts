import { Component } from '@angular/core';
import { BandejaSolicitudesComponent } from '../../solicitudes/compartidos/bandeja-solicitudes.component';
@Component({ selector: 'app-pendientes-aprobacion', standalone: true, imports: [BandejaSolicitudesComponent],
  template: '<app-bandeja-solicitudes bandeja="gerencia" titulo="Solicitudes de actividades" />' })
export class PendientesAprobacionComponent {}
