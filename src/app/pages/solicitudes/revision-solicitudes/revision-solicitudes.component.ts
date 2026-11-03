import { Component } from '@angular/core';
import { BandejaSolicitudesComponent } from '../compartidos/bandeja-solicitudes.component';
@Component({ selector: 'app-revision-solicitudes', standalone: true, imports: [BandejaSolicitudesComponent],
  template: '<app-bandeja-solicitudes bandeja="revision" titulo="Revisión de solicitudes" />' })
export class RevisionSolicitudesComponent {}
