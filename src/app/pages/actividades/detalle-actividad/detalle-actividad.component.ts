import { afterNextRender, Component, computed, DestroyRef, effect, inject, input, output, signal, untracked } from '@angular/core';
import { Subscription, shareReplay } from 'rxjs';
import { Actividad } from '../../../core/interfaces/actividades/actividad.interface';
import { ActividadesService } from '../../../core/services/actividades/actividades.service';
import { PersonService } from '../../../core/services/person/person.service';
import { DetalleActividadService, ParticipanteDetalle, PonenteDetalle } from './detalle-actividad.service';

@Component({
  selector: 'app-detalle-actividad', standalone: true,
  imports: [],
  templateUrl: './detalle-actividad.component.html', styleUrl: './detalle-actividad.component.scss',
})
export class DetalleActividadComponent {
  readonly actividadId = input<number | null>(null);
  readonly volver = output<void>();
  private readonly listo = signal(false);
  private readonly actividades = inject(ActividadesService);
  private readonly relaciones = inject(DetalleActividadService);
  private readonly personas = inject(PersonService);
  private readonly destroyRef = inject(DestroyRef);
  private solicitudes = new Subscription();
  protected readonly actividad = signal<Actividad | null>(null);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly sinSeleccion = signal(false);
  protected readonly area = signal('No disponible');
  protected readonly tipo = signal('No disponible');
  protected readonly avisoCatalogos = signal(false);
  protected readonly ponentes = signal<readonly PonenteDetalle[]>([]);
  protected readonly participantes = signal<readonly ParticipanteDetalle[]>([]);
  protected readonly pagina = signal(1);
  protected readonly porPagina = signal(10);
  protected readonly totalPaginas = computed(() => Math.max(1, Math.ceil(this.participantes().length / this.porPagina())));
  protected readonly visibles = computed(() => this.participantes().slice((this.pagina() - 1) * this.porPagina(), this.pagina() * this.porPagina()));
  protected readonly desde = computed(() => this.participantes().length ? (this.pagina() - 1) * this.porPagina() + 1 : 0);
  protected readonly hasta = computed(() => Math.min(this.pagina() * this.porPagina(), this.participantes().length));
  protected readonly cargandoPonentes = signal(true);
  protected readonly cargandoParticipantes = signal(true);
  protected readonly errorPonentes = signal<string | null>(null);
  protected readonly errorParticipantes = signal<string | null>(null);
  constructor() {
    this.destroyRef.onDestroy(() => this.solicitudes.unsubscribe());
    afterNextRender(() => this.listo.set(true));
    effect(() => {
      this.actividadId();
      if (this.listo()) untracked(() => this.cargar());
    }, { allowSignalWrites: true });
  }

  protected cargar(): void {
    this.solicitudes.unsubscribe();
    this.solicitudes = new Subscription();
    this.actividad.set(null); this.error.set(null); this.cargando.set(true); this.sinSeleccion.set(false); this.pagina.set(1);
    this.ponentes.set([]); this.participantes.set([]);
    this.errorPonentes.set(null); this.errorParticipantes.set(null);
    this.cargandoPonentes.set(true); this.cargandoParticipantes.set(true);
    this.area.set('No disponible'); this.tipo.set('No disponible'); this.avisoCatalogos.set(false);
    const seleccion = this.actividadId();
    if (seleccion === null) {
      this.sinSeleccion.set(true); this.cargando.set(false);
      this.cargandoPonentes.set(false); this.cargandoParticipantes.set(false); return;
    }
    const id = Number(seleccion);
    if (!Number.isSafeInteger(id) || id < 1) {
      this.error.set('La actividad solicitada no es válida.'); this.cargando.set(false); return;
    }
    this.solicitudes.add(this.actividades.obtener(id).subscribe({
      next: actividad => {
        if (actividad.id_actividad !== id) {
          this.error.set('No se pudo verificar la actividad solicitada.'); this.cargando.set(false); return;
        }
        this.actividad.set(actividad); this.cargando.set(false);
        this.cargarCatalogos(actividad);
        const personas = this.personas.listar().pipe(shareReplay({ bufferSize: 1, refCount: true }));
        this.solicitudes.add(this.relaciones.consultarPonentes(id, personas).subscribe({
          next: filas => { this.ponentes.set(filas); this.cargandoPonentes.set(false); },
          error: error => { this.errorPonentes.set(this.mensaje(error, 'los ponentes')); this.cargandoPonentes.set(false); },
        }));
        this.solicitudes.add(this.relaciones.consultarParticipantes(id, personas).subscribe({
          next: filas => { this.participantes.set(filas); this.cargandoParticipantes.set(false); },
          error: error => { this.errorParticipantes.set(this.mensaje(error, 'los participantes')); this.cargandoParticipantes.set(false); },
        }));
      },
      error: error => { this.error.set(this.mensaje(error, 'la actividad')); this.cargando.set(false); },
    }));
  }

  protected cambiarTamanoPagina(valor: string): void {
    const cantidad = Number(valor);
    if (![10, 20, 50].includes(cantidad)) return;
    this.porPagina.set(cantidad); this.pagina.set(1);
  }

  private cargarCatalogos(actividad: Actividad): void {
    if (actividad.area_nombre) this.area.set(actividad.area_nombre);
    else this.solicitudes.add(this.actividades.listarAreas().subscribe({
      next: filas => this.area.set(filas.find(fila => fila.id_area === actividad.id_area)?.nombre || 'No disponible'),
      error: () => this.avisoCatalogos.set(true),
    }));
    if (actividad.tipo_actividad_nombre) this.tipo.set(actividad.tipo_actividad_nombre);
    else this.solicitudes.add(this.actividades.listarTipos().subscribe({
      next: filas => this.tipo.set(filas.find(fila => fila.id_tipo_actividad === actividad.id_tipo_actividad)?.nombre || 'No disponible'),
      error: () => this.avisoCatalogos.set(true),
    }));
  }

  protected fecha(valor: string | null): string {
    if (!valor) return 'No disponible';
    const partes = valor.slice(0, 10).split('-');
    return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : 'No disponible';
  }

  private mensaje(error: unknown, recurso: string): string {
    const status = (error as { status?: number } | null)?.status;
    if (status === 403) return `No tienes autorización para consultar ${recurso} o sus catálogos relacionados.`;
    if (status === 404) return 'La actividad solicitada no está disponible.';
    return `No se pudo cargar ${recurso}. Intenta nuevamente.`;
  }
}
