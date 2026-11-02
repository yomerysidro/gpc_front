import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { PageTitleComponent } from '../../../../shared/components/page-title/page-title.component';
import { FormularioEmisionComponent } from '../../compartidos/formulario-emision.component';
@Component({
  selector: 'app-formulario-reconocimiento', standalone: true,
  imports: [PageTitleComponent, FormularioEmisionComponent],
  templateUrl: './formulario-reconocimiento.component.html',
})
export class FormularioReconocimientoComponent {
  private readonly router = inject(Router);
  private readonly parametros = toSignal(inject(ActivatedRoute).paramMap, { requireSync: true });
  protected readonly id = computed(() => this.parametros().has('id') ? Number(this.parametros().get('id')) : null);
  protected volver(): void { void this.router.navigateByUrl('/certificaciones/reconocimientos'); }
}
