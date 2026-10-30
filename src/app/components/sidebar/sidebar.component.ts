import { Component, computed, effect, inject, input, model, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, PRIMARY_OUTLET, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { NavigationItem } from '../../core/interfaces/navigation/navigation-item.interface';
import { ICONOS_DISPONIBLES } from '../../shared/utils/iconos-disponibles';
import { MODULOS_NAVEGACION } from './modulos-navegacion';

interface OpcionModulo {
  readonly path: string;
  readonly label: string;
  readonly icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  host: { '[class.contraido]': 'contraido()' },
})
export class SidebarComponent {
  readonly items = input<readonly NavigationItem[]>([]);
  readonly contraido = model(false);
  protected readonly iconos = ICONOS_DISPONIBLES;
  private readonly router = inject(Router);
  private readonly url = toSignal(this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    map(event => event.urlAfterRedirects),
    startWith(this.router.url),
  ), { requireSync: true });

  protected readonly expandido = signal(false);
  protected readonly modulos = MODULOS_NAVEGACION;
  protected readonly expandidos = signal<ReadonlySet<string>>(new Set());
  protected readonly moduloActual = computed(() => this.raiz(this.url()));
  protected readonly reportes = computed(() => this.items().filter(item => this.raiz(item.path) === 'reportes'));
  protected readonly dashboard = computed(() => this.items().filter(item => this.raiz(item.path) === 'dashboard'));
  protected readonly seguridadActiva = computed(() => this.esSeguridad(this.url()));
  protected readonly navegacion = computed(() => {
    const orden = ['usuarios', 'roles', 'permisos', 'modulos'];
    const seguridad = this.items().filter(item => this.esSeguridad(item.path))
      .sort((a, b) => orden.indexOf(this.raiz(a.path)!) - orden.indexOf(this.raiz(b.path)!));
    let agrupado = false;
    return this.items().filter(item => !['dashboard', 'emision', 'practicantes', 'reconocimientos'].includes(this.raiz(item.path) ?? '')
      && !this.esModuloPreparado(item.path)
      && this.raiz(item.path) !== 'reportes'
      && this.raiz(item.path) !== 'ponentes-firmantes').flatMap<{
      tipo: 'enlace' | 'seguridad'; item: NavigationItem; hijos: readonly NavigationItem[];
    }>(item => {
      if (!this.esSeguridad(item.path)) {
        return [{ tipo: 'enlace' as const, item, hijos: [] as readonly NavigationItem[] }];
      }
      if (agrupado) return [];
      agrupado = true;
      return [{ tipo: 'seguridad' as const, item, hijos: seguridad }];
    });
  });

  protected opcionesModulo(modulo: typeof MODULOS_NAVEGACION[number]): readonly OpcionModulo[] {
    const rutaDinamica = modulo.path === 'gestion' ? 'practicantes' : 'reconocimientos';
    const opciones: OpcionModulo[] = modulo.opciones.map(opcion => ({ ...opcion }));
    const yaConfigurada = opciones.some(opcion => opcion.path === rutaDinamica);
    const moduloBackend = this.items().find(item => this.raiz(item.path) === rutaDinamica);

    if (!yaConfigurada && moduloBackend) {
      opciones.push({
        path: rutaDinamica,
        label: moduloBackend.label,
        icon: moduloBackend.icon ?? (modulo.path === 'gestion' ? 'school' : 'military_tech'),
      });
    }

    return opciones;
  }

  constructor() {
    effect(() => {
      if (this.esSeguridad(this.url())) this.expandido.set(true);
      const actual = this.raiz(this.url());
      if (actual === 'reportes' || this.modulos.some(modulo => modulo.path === actual)) {
        this.expandidos.update(valores => new Set([...valores, actual!]));
      }
    }, { allowSignalWrites: true });
  }

  protected alternar(event: MouseEvent): void {
    // El layout cierra el cajón móvil al recibir un clic de navegación.
    event.stopPropagation();
    if (this.contraido()) {
      this.contraido.set(false);
      this.expandido.set(true);
    } else {
      this.expandido.update(valor => !valor);
    }
  }

  protected alternarModulo(event: MouseEvent, path: string): void {
    event.stopPropagation();
    const abrir = this.contraido();
    this.contraido.set(false);
    this.expandidos.update(valores => {
      const siguientes = new Set(valores);
      if (abrir || !siguientes.delete(path)) siguientes.add(path);
      return siguientes;
    });
  }

  private esModuloPreparado(url: string): boolean {
    const path = this.router.parseUrl(url).root.children[PRIMARY_OUTLET]?.segments
      .map(segmento => segmento.path).join('/');
    return this.modulos.some(modulo => path === modulo.path || modulo.opciones.some(opcion =>
      path === `${modulo.path}/${opcion.path}` || path === opcion.path));
  }

  private esSeguridad(url: string): boolean {
    const raiz = this.raiz(url);
    return raiz !== undefined && ['usuarios', 'roles', 'permisos', 'modulos'].includes(raiz);
  }

  private raiz(url: string): string | undefined {
    return this.router.parseUrl(url).root.children[PRIMARY_OUTLET]?.segments[0]?.path;
  }
}
