import { Component, computed, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map, tap } from 'rxjs';
import { RecursoEmision } from '../../../core/interfaces/emision-certificados/emision-certificados.interface';
import { PageTitleComponent } from '../../../shared/components/page-title/page-title.component';
import { EstadoNavegacionListado, ListadoEmisionComponent } from '../compartidos/listado-emision.component';

interface PestanaActividad {
  readonly id: string;
  readonly etiqueta: string;
  readonly recurso: RecursoEmision;
}
interface ConfiguracionActividades {
  readonly titulo: string;
  readonly secciones: readonly { titulo: string; recurso: RecursoEmision }[];
  readonly pestanas?: readonly PestanaActividad[];
}

/** Conserva los CRUD existentes; solo Sesiones/asistencia configura navegación por pestañas. */
@Component({
  selector: 'app-actividades', standalone: true, imports: [PageTitleComponent, ListadoEmisionComponent],
  templateUrl: './actividades.component.html',
  styleUrls: ['../compartidos/emision.scss', '../../../shared/components/gestion-tabs/gestion-tabs.component.scss'],
})
export class ActividadesComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly listado = viewChild(ListadoEmisionComponent);
  protected readonly formularioExclusivoAbierto = computed(() => this.listado()?.formularioExclusivoAbierto() ?? false);
  protected readonly estados = new Map<RecursoEmision, EstadoNavegacionListado>();
  protected readonly configuracion = toSignal(this.route.data.pipe(map(data => data as ConfiguracionActividades)), { requireSync: true });
  private readonly parametros = toSignal(this.route.queryParamMap.pipe(
    tap(parametros => {
      const opciones = this.configuracion().pestanas;
      const destino = opciones?.find(opcion => opcion.id === parametros.get('pestana')) ?? opciones?.[0];
      const actual = this.listado();
      if (destino && actual && destino.recurso !== actual.recurso()) {
        this.estados.set(actual.recurso(), actual.obtenerEstadoNavegacion());
      }
    }),
  ), { initialValue: this.route.snapshot.queryParamMap });
  protected readonly pestana = computed(() => this.configuracion().pestanas?.find(opcion => opcion.id === this.parametros().get('pestana'))
    ?? this.configuracion().pestanas?.[0]);

  protected seleccionar(id: string): void {
    const opciones = this.configuracion().pestanas;
    if (!opciones?.some(opcion => opcion.id === id) || this.pestana()?.id === id) return;
    void this.router.navigate([], {
      relativeTo: this.route, queryParams: { pestana: id === opciones[0].id ? null : id },
      queryParamsHandling: 'merge', replaceUrl: true,
    });
  }

  protected alTeclear(evento: KeyboardEvent): void {
    const opciones = this.configuracion().pestanas;
    if (!opciones?.length || !(evento.currentTarget instanceof HTMLElement)) return;
    const actual = opciones.findIndex(opcion => opcion.id === this.pestana()?.id);
    const destino = {
      ArrowRight: (actual + 1) % opciones.length, ArrowLeft: (actual - 1 + opciones.length) % opciones.length,
      Home: 0, End: opciones.length - 1,
    }[evento.key];
    if (destino === undefined) return;
    evento.preventDefault();
    this.seleccionar(opciones[destino].id);
    evento.currentTarget.querySelector<HTMLElement>('#actividad-tab-' + opciones[destino].id)?.focus();
  }

  protected etiquetaPanel(recurso: RecursoEmision): string | null {
    const opcion = this.configuracion().pestanas?.find(opcion => opcion.recurso === recurso);
    return opcion ? 'actividad-tab-' + opcion.id : null;
  }
}
