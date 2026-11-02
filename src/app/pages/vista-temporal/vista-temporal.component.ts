import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { PageTitleComponent } from '../../shared/components/page-title/page-title.component';

/** Pantalla preliminar de solo lectura: sin HTTP, formularios ni acciones administrativas. */
@Component({
  selector: 'app-vista-temporal',
  standalone: true,
  imports: [PageTitleComponent, RouterLink],
  template: `<p>{{ seccion() }}</p><app-page-title [title]="titulo()" />
    <section class="card" aria-label="Estado de la funcionalidad">
      <h2>En desarrollo</h2>
      <p>{{ descripcion() }}</p>
      <p role="status"><strong>Funcionalidad pendiente de integración</strong></p>
      <p>Esta pantalla es informativa. No consulta registros ni permite registrar solicitudes, aprobar documentos o aplicar firmas.</p>
      <a class="btn" routerLink="/inicio">Volver al inicio</a>
    </section>`,
  styles: ':host { display: block; min-height: 100%; background: var(--neutro-0); }',
})
export class VistaTemporalComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly titulo = toSignal(this.route.data.pipe(
    map(data => typeof data['titulo'] === 'string' ? data['titulo'] : ''),
  ), { initialValue: '' });
  protected readonly descripcion = toSignal(this.route.data.pipe(
    map(data => typeof data['descripcion'] === 'string' ? data['descripcion'] : ''),
  ), { initialValue: '' });
  protected readonly seccion = toSignal(this.route.data.pipe(
    map(data => typeof data['seccion'] === 'string' ? data['seccion'] : ''),
  ), { initialValue: '' });
}
