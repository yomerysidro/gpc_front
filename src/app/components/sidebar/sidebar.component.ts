import { Component, computed, effect, inject, input, model, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, PRIMARY_OUTLET, Router, RouterLink, UrlTree } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { NavigationItem } from '../../core/interfaces/navigation/navigation-item.interface';
import { AuthService } from '../../core/services/autenticacion/auth.service';
import {
  DASHBOARD_SIDEBAR, EntradaSidebarVisible, resolverEntradaSidebar, resolverGruposSidebar,
} from './modulos-navegacion';
import { puedeConsultarPantallasPendientes } from './pantallas-pendientes.guard';

@Component({
  selector: 'app-sidebar', standalone: true, imports: [RouterLink],
  templateUrl: './sidebar.component.html', styleUrl: './sidebar.component.scss',
  host: { '[class.contraido]': 'contraido()' },
})
export class SidebarComponent {
  readonly items = input<readonly NavigationItem[]>([]);
  readonly contraido = model(false);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly url = toSignal(this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    map(event => event.urlAfterRedirects), startWith(this.router.url),
  ), { requireSync: true });
  protected readonly expandidos = signal<ReadonlySet<string>>(new Set());
  private readonly consultarPendientes = computed(() => puedeConsultarPantallasPendientes(this.auth.usuario(), clave => this.auth.tienePermiso(clave)));
  protected readonly grupos = computed(() => resolverGruposSidebar(clave => this.auth.tienePermiso(clave), this.items(), this.consultarPendientes()));
  protected readonly dashboard = computed(() => resolverEntradaSidebar(DASHBOARD_SIDEBAR, clave => this.auth.tienePermiso(clave), this.items()));
  protected readonly entradaActiva = computed(() => {
    const arbol = this.router.parseUrl(this.url());
    const dashboard = this.dashboard();
    const entradas = [...(dashboard ? [dashboard] : []), ...this.grupos().flatMap(grupo => grupo.hijos)];
    const coincidencias = entradas.map(entrada => ({ entrada, puntuacion: this.puntuacion(entrada, arbol) }))
      .filter(fila => fila.puntuacion >= 0).sort((a, b) => b.puntuacion - a.puntuacion);
    return coincidencias[0]?.entrada.id ?? null;
  });
  protected readonly grupoActivo = computed(() => this.grupos().find(grupo => grupo.hijos.some(entrada => entrada.id === this.entradaActiva()))?.id ?? null);

  constructor() {
    effect(() => {
      const grupo = this.grupoActivo();
      if (grupo) this.expandidos.update(actual => new Set([...actual, grupo]));
    }, { allowSignalWrites: true });
  }

  protected alternarGrupo(evento: MouseEvent, id: string): void {
    // Conserva abierto el cajón móvil: el layout solo debe cerrarlo al navegar.
    evento.stopPropagation();
    const estabaContraido = this.contraido();
    this.contraido.set(false);
    this.expandidos.update(actual => {
      const siguientes = new Set(actual);
      if (estabaContraido || !siguientes.delete(id)) siguientes.add(id);
      return siguientes;
    });
  }

  protected alTeclear(evento: KeyboardEvent): void {
    if (!(evento.currentTarget instanceof HTMLElement)) return;
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(evento.key)) return;
    const controles = Array.from(evento.currentTarget.querySelectorAll<HTMLElement>('a, button.modulo'))
      .filter(elemento => elemento.getClientRects().length > 0);
    const indice = controles.findIndex(elemento => elemento === document.activeElement);
    if (indice < 0 || !controles.length) return;
    evento.preventDefault();
    const siguiente = evento.key === 'Home' ? 0 : evento.key === 'End' ? controles.length - 1
      : (indice + (evento.key === 'ArrowDown' ? 1 : -1) + controles.length) % controles.length;
    controles[siguiente]?.focus();
  }

  private puntuacion(entrada: EntradaSidebarVisible, actual: UrlTree): number {
    const segmentos = (arbol: UrlTree) => arbol.root.children[PRIMARY_OUTLET]?.segments.map(segmento => segmento.path) ?? [];
    const destino = segmentos(actual);
    for (const [clave, valor] of Object.entries(entrada.catalogos ? {} : entrada.queryParams ?? {})) {
      if ((actual.queryParamMap.get(clave) ?? entrada.parametrosPredeterminados?.[clave]) !== valor) return -1;
    }
    const puntuaciones = [entrada.path, ...(entrada.rutasActivas ?? [])].map(path => {
      const ruta = segmentos(this.router.parseUrl(path));
      return ruta.every((segmento, indice) => destino[indice] !== undefined && (segmento.startsWith(':') || destino[indice] === segmento))
        ? ruta.length * 10 + Object.keys(entrada.queryParams ?? {}).length : -1;
    });
    return Math.max(...puntuaciones);
  }
}
