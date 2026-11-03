import { Component } from '@angular/core';
import { BandejaSolicitudesComponent } from '../compartidos/bandeja-solicitudes.component';
@Component({ selector: 'app-mis-solicitudes', standalone: true, imports: [BandejaSolicitudesComponent],
  template: '<app-bandeja-solicitudes bandeja="propias" titulo="Mis solicitudes" />' })
export class MisSolicitudesComponent {}
