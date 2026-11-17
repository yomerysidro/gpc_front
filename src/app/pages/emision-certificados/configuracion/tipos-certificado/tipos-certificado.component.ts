import { Component, computed, input } from '@angular/core';
import { PageTitleComponent } from '../../../../shared/components/page-title/page-title.component';
import { ListadoEmisionComponent } from '../../compartidos/listado-emision.component';
import { CONFIGURACION_EMISION } from '../../compartidos/emision.config';

@Component({
  selector: 'app-tipos-certificado', standalone: true,
  imports: [PageTitleComponent, ListadoEmisionComponent],
  template: `
    @if (!embedded()) { <app-page-title [title]="titulo()" /> }
    <section class="card">
      <app-listado-emision [recurso]="recurso()" [tituloEncabezado]="titulo()" [formularioModal]="true" [clasificacion]="true" />
    </section>
  `,
})
export class TiposCertificadoComponent {
  readonly embedded = input(false);
  readonly recurso = input<'ativicty-type' | 'participation-type' | 'tipos-certificado'>('tipos-certificado');
  protected readonly titulo = computed(() => CONFIGURACION_EMISION[this.recurso()].titulo);
}
