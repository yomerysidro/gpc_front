import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { PageTitleComponent } from '../../shared/components/page-title/page-title.component';

/** Base temporal compartida: reemplazar por la pantalla correspondiente al desarrollarla. */
@Component({
  selector: 'app-vista-temporal',
  standalone: true,
  imports: [PageTitleComponent],
  template: '<app-page-title [title]="titulo()" />',
  styles: ':host { display: block; min-height: 100%; background: var(--neutro-0); }',
})
export class VistaTemporalComponent {
  protected readonly titulo = toSignal(inject(ActivatedRoute).data.pipe(
    map(data => data['titulo'] as string),
  ), { initialValue: '' });
}
