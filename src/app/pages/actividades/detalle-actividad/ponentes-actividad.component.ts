import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin, map } from 'rxjs';
import { EmisionCertificadosService } from '../../../core/services/emision-certificados/emision-certificados.service';
import { PersonSpeakerService } from '../../../core/services/person-speaker/person-speaker.service';
import { PersonService } from '../../../core/services/person/person.service';
import { mensajeEtapaA } from '../../../core/services/emision-certificados/documentos-digitales.service';

@Component({
  selector: 'app-ponentes-actividad', standalone: true,
  template: `<details (toggle)="abrir($event)"><summary>Ponentes de la actividad</summary>
    @if (cargando()) { <p role="status">Cargando ponentes…</p> }
    @if (error()) { <p role="alert">{{ error() }}</p><button class="btn" type="button" (click)="cargar()">Reintentar</button> }
    @for (p of ponentes(); track p.id) { <p><strong>{{ p.nombre }}</strong>@if (p.cargo) { · {{ p.cargo }} }</p> }
    @if (consultado() && !ponentes().length && !error()) { <p>No hay ponentes asociados a esta actividad.</p> }
    <p>La asociación a esta actividad no acredita una intervención en cada sesión. Los reconocimientos por sesión y de ponentes externos requieren acreditación adicional.</p>
  </details>`,
})
export class PonentesActividadComponent {
  readonly actividad = input.required<number>();
  private readonly api = inject(EmisionCertificadosService);
  private readonly personas = inject(PersonService);
  private readonly speakers = inject(PersonSpeakerService);
  private readonly destroy = inject(DestroyRef);
  protected readonly cargando = signal(false);
  protected readonly consultado = signal(false);
  protected readonly error = signal('');
  protected readonly ponentes = signal<readonly { id: number; nombre: string; cargo: string | null }[]>([]);
  protected abrir(evento: Event): void { if ((evento.target as HTMLDetailsElement).open && !this.consultado()) this.cargar(); }
  protected cargar(): void {
    if (this.cargando()) return;
    const actividad = this.actividad(); this.cargando.set(true); this.error.set('');
    forkJoin({ asignaciones: this.api.listarTodos('activity-speaker'), ponentes: this.speakers.listar(), personas: this.personas.listar() }).pipe(
      map(({ asignaciones, ponentes, personas }) => asignaciones.filter(a => Number(a['id_actividad']) === actividad).map(a => {
        const ponente = ponentes.find(p => p.id_persona_ponente === Number(a['id_persona_ponente']));
        const persona = personas.find(p => p.id_persona === ponente?.id_persona);
        return { id: Number(a['id_actividad_ponente']), nombre: persona ? [persona.nombres, persona.apellido_paterno, persona.apellido_materno].filter(Boolean).join(' ') : 'Nombre no disponible', cargo: ponente?.cargo ?? null };
      })), takeUntilDestroyed(this.destroy)).subscribe({
      next: filas => { if (this.actividad() === actividad) this.ponentes.set(filas); this.cargando.set(false); this.consultado.set(true); },
      error: e => { this.cargando.set(false); this.error.set(mensajeEtapaA(e)); },
    });
  }
}
