import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../../core/services/autenticacion/auth.service';
import { PageTitleComponent } from '../../shared/components/page-title/page-title.component';

/**
 * Destino provisional de los módulos del menú sin pantalla todavía.
 * El título sale de route.data['titulo'] o del módulo del menú con esa URL.
 * Es reactivo porque el router reutiliza el componente entre URLs del comodín.
 */
@Component({
  selector: 'app-en-construccion',
  standalone: true,
  imports: [PageTitleComponent],
  templateUrl: './en-construccion.component.html',
  styleUrl: './en-construccion.component.scss'
})
export class EnConstruccionComponent {
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly tituloRuta = toSignal(this.route.data.pipe(
    map(data => data['titulo'] as string | undefined)));
  private readonly url = toSignal(this.route.url.pipe(
    map(segmentos => '/' + segmentos.map(segmento => segmento.path).join('/'))));

  protected readonly titulo = computed(() => this.tituloRuta()
    ?? this.auth.modulos().find(modulo => modulo.url === this.url())?.nombre
    ?? 'Página no disponible');
}
