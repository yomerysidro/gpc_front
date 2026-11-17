import { Component, inject, input } from '@angular/core';
import { BLOQUEO_ESCRITURA_EMISION, ESCRITURA_EMISION_AUTORIZADA } from '../../../../core/services/emision-certificados/operaciones-emision';
import { RouterLink } from '@angular/router';
import { PageTitleComponent } from '../../../../shared/components/page-title/page-title.component';
import { ListadoEmisionComponent } from '../../compartidos/listado-emision.component';
@Component({
  selector: 'app-asignar-firmantes', standalone: true,
  imports: [RouterLink, PageTitleComponent, ListadoEmisionComponent],
  templateUrl: './asignar-firmantes.component.html', styleUrl: '../../compartidos/emision.scss',
})
export class AsignarFirmantesComponent {
  readonly integradoEnFirmas = input(false);
  protected readonly escrituraAutorizada = inject(ESCRITURA_EMISION_AUTORIZADA);
  protected readonly bloqueoEscritura = BLOQUEO_ESCRITURA_EMISION;
}
