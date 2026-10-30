import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FiltrosEmision } from '../../../../core/interfaces/emision-certificados/emision-certificados.interface';
import { PageTitleComponent } from '../../../../shared/components/page-title/page-title.component';
import { ListadoEmisionComponent } from '../../compartidos/listado-emision.component';
@Component({
  selector: 'app-listar-documentos', standalone: true,
  imports: [RouterLink, PageTitleComponent, ListadoEmisionComponent],
  templateUrl: './listar-documentos.component.html', styleUrl: '../../compartidos/emision.scss',
})
export class ListarDocumentosComponent {
  private readonly parametros = toSignal(inject(ActivatedRoute).queryParamMap, { requireSync: true });
  protected readonly filtros = computed<FiltrosEmision>(() => {
    const id = this.parametros().get('id_certificado');
    return id && /^\d+$/.test(id) && Number(id) > 0 ? { id_certificado: Number(id) } : {};
  });
}
