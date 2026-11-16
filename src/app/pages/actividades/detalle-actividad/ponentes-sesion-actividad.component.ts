import { Component, DestroyRef, OnInit, computed, inject, input, signal, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, forkJoin, Observable, of, Subscription } from 'rxjs';
import { ErrorApi } from '../../../core/interfaces/api/api-response.interface';
import { PonentesSesionGestion } from '../../../core/interfaces/emision-certificados/origenes-certificado.interface';
import { EmisionCertificadosService } from '../../../core/services/emision-certificados/emision-certificados.service';
import { PersonSpeaker, PersonSpeakerService } from '../../../core/services/person-speaker/person-speaker.service';
import { AuthService } from '../../../core/services/autenticacion/auth.service';

interface OpcionPonente {
  readonly id_persona_ponente: number;
  readonly id_persona: number;
  readonly nombre: string;
  readonly identificacion: string;
  readonly cargo: string | null;
  readonly id_actividad_ponente: number;
}

/**
 * Panel compacto de ponentes de una sesión concreta.
 * Solo gestiona vínculos reales de `certificado.actividad_ponente.id_actividad_sesion`;
 * nunca reutiliza los ponentes de la actividad ni registra personas o trabajadores nuevos.
 */
@Component({
  selector: 'app-ponentes-sesion-actividad', standalone: true,
  template: `<section class="ponentes-sesion" aria-label="Ponentes de la sesión">
    <dl class="contexto">
      <div><dt>Actividad</dt><dd>{{ actividad().nombre }}</dd></div>
      <div><dt>Sesión</dt><dd>Sesión {{ sesion().numero }}</dd></div>
      <div><dt>Fecha</dt><dd>{{ sesion().fecha }}</dd></div>
    </dl>
    @if (!autorizado()) { <p role="status">No tienes permiso para consultar los ponentes de esta sesión.</p> }
    @if (cargando()) { <p role="status">Consultando ponentes de la sesión…</p> }
    @if (error()) { <p role="alert">{{ error() }}</p><button class="btn" type="button" (click)="cargar()">Reintentar</button> }
    @if (aviso()) { <p role="status">{{ aviso() }}</p> }
    @if (gestion()) {
      <h3>Ponentes vinculados</h3>
      <ul class="vinculados">
        @for (p of vinculados(); track p.id_actividad_ponente) {
          <li>
            <div class="datos-ponente"><strong>{{ p.nombre }}</strong>
              <small>{{ p.identificacion }}@if (p.cargo) { · {{ p.cargo }} }</small></div>
            @if (auth?.tienePermiso('ponentes-firmantes.eliminar')) {
              @if (confirmando() === p.id_actividad_ponente) {
                <div class="confirmacion">
                  <button class="btn" type="button" [disabled]="operando()" (click)="desvincular(p.id_actividad_ponente)">Confirmar desvincular</button>
                  <button class="btn" type="button" [disabled]="operando()" (click)="confirmando.set(null)">Cancelar</button>
                </div>
              } @else {
                <button class="btn" type="button" [disabled]="operando()" (click)="confirmando.set(p.id_actividad_ponente)">Desvincular</button>
              }
            }
          </li>
        } @empty {
          <li class="vacio">No hay ponentes asignados</li>
        }
      </ul>
      <p class="ayuda">Un vínculo con reconocimiento preparado no se puede desvincular.</p>
      @if (auth?.tienePermiso('ponentes-firmantes.crear')) {
        <div class="agregar">
          <button class="btn btn-primary" type="button" [disabled]="operando() || !disponibles().length"
            (click)="mostrarSeleccion.set(!mostrarSeleccion())">Asignar ponente a esta sesión</button>
          @if (mostrarSeleccion()) {
            <label for="ponente-sesion-actividad">Ponente registrado en RR. HH.</label>
            <select id="ponente-sesion-actividad" class="input" [value]="seleccion()" [disabled]="operando()"
              (change)="seleccion.set($any($event.target).value)">
              <option value="">Selecciona un ponente</option>
              @for (p of disponibles(); track p.id_persona_ponente) {
                <option [value]="p.id_persona_ponente" [disabled]="p.yaVinculado">{{ p.nombre }} · {{ p.identificacion }}@if (p.cargo) { · {{ p.cargo }} }{{ p.yaVinculado ? ' · Ya vinculado' : '' }}</option>
              }
            </select>
            <button class="btn btn-primary" type="button" [disabled]="operando() || !seleccionado()" (click)="agregar()">Asignar ponente</button>
            <button class="btn" type="button" [disabled]="operando()" (click)="mostrarSeleccion.set(false); seleccion.set('')">Cancelar</button>
          }
          @if (!disponibles().length) { <p role="status">No hay ponentes registrados en el catálogo autorizado.</p> }
        </div>
      }
    }
  </section>`,
  styles: `
    :host { display: block; min-width: 0; }
    .contexto { display: grid; grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr)); gap: .75rem; margin: 0 0 1rem; }
    .contexto dt { font-size: .78rem; text-transform: uppercase; letter-spacing: .04em; color: #5b6c7f; }
    .contexto dd { margin: .15rem 0 0; font-weight: 600; color: #20374e; }
    h3 { margin: 0 0 .5rem; color: #075a9b; font-size: 1rem; }
    .vinculados { list-style: none; margin: 0; padding: 0; display: grid; gap: .5rem; }
    .vinculados li { display: flex; align-items: center; justify-content: space-between; gap: .75rem; padding: .55rem .7rem; border: 1px solid #dfe6ef; border-radius: .5rem; background: #f8fafc; }
    .vinculados li.vacio { justify-content: flex-start; color: #53657a; }
    .datos-ponente { display: grid; gap: .15rem; min-width: 0; }
    .datos-ponente small { color: #53657a; }
    .confirmacion { display: flex; gap: .4rem; flex-wrap: wrap; }
    .ayuda { color: #5b6c7f; font-size: .82rem; margin: .5rem 0 1rem; }
    .agregar { display: grid; gap: .5rem; justify-items: start; }
    .agregar label { font-weight: 600; color: #20374e; }
    .agregar select { min-width: min(100%, 26rem); }
    .btn { white-space: nowrap; }
  `,
})
export class PonentesSesionActividadComponent implements OnInit {
  readonly actividad = input.required<{ id_actividad: number; nombre: string }>();
  readonly sesion = input.required<{ id_actividad_sesion: number; numero: string; fecha: string }>();
  /** Se emite después de cada cambio persistido para que la actividad refresque su estado. */
  readonly actualizado = output<void>();
  protected readonly auth = inject(AuthService, { optional: true });
  private readonly api = inject(EmisionCertificadosService);
  private readonly speakers = inject(PersonSpeakerService);
  private readonly destroy = inject(DestroyRef);
  private consulta?: Subscription;
  protected readonly gestion = signal<PonentesSesionGestion | null>(null);
  protected readonly cargando = signal(false);
  protected readonly operando = signal(false);
  protected readonly error = signal('');
  protected readonly aviso = signal('');
  protected readonly mostrarSeleccion = signal(false);
  protected readonly seleccion = signal('');
  protected readonly confirmando = signal<number | null>(null);
  private readonly cargos = signal<ReadonlyMap<number, string | null>>(new Map());
  private readonly identidades = signal<Readonly<Partial<Record<number, string>>>>({});

  ngOnInit(): void { this.cargar(); }

  protected autorizado(): boolean { return this.auth?.tienePermiso('ponentes-firmantes.ver') === true; }

  protected readonly vinculados = computed(() => (this.gestion()?.vinculos ?? [])
    .map(v => this.datosPonente(v.id_persona_ponente, Number(v.id_actividad_ponente))));

  protected readonly disponibles = computed(() => {
    const g = this.gestion();
    const vinculadas = new Set((g?.vinculos ?? [])
      .map(v => v.id_persona ?? this.personaDe(v.id_persona_ponente)).filter((id): id is number => id !== null));
    return (g?.ponentes_disponibles ?? []).map(p => ({
      ...this.datosPonente(p.id_persona_ponente, 0, p.id_persona), yaVinculado: vinculadas.has(p.id_persona) || !!g?.vinculos.some(v => v.id_persona_ponente === p.id_persona_ponente),
    }));
  });

  protected seleccionado(): number | null {
    const valor = Number(this.seleccion());
    const opcion = this.disponibles().find(p => p.id_persona_ponente === valor);
    return opcion && !opcion.yaVinculado && Number.isSafeInteger(valor) && valor > 0 ? valor : null;
  }

  protected cargar(): void {
    if (!this.autorizado() || this.cargando()) return;
    const actividad = Number(this.actividad().id_actividad); const sesion = Number(this.sesion().id_actividad_sesion);
    if (!Number.isSafeInteger(actividad) || actividad < 1 || !Number.isSafeInteger(sesion) || sesion < 1) {
      this.error.set('La sesión seleccionada no es válida.'); return;
    }
    this.consulta?.unsubscribe(); this.error.set(''); this.cargando.set(true);
    this.consulta = forkJoin({
      gestion: this.api.ponentesSesion(actividad, sesion),
      cargos: this.speakers.listar().pipe(catchError((): Observable<readonly PersonSpeaker[]> => of([]))),
      identidades: this.api.documentosIdentidad().pipe(catchError((): Observable<Readonly<Partial<Record<number, string>>>> => of({}))),
    }).pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: ({ gestion, cargos, identidades }) => {
        this.cargando.set(false);
        this.cargos.set(new Map(cargos.map(c => [c.id_persona_ponente, c.cargo ?? null])));
        this.identidades.set(identidades);
        this.gestion.set(gestion);
      },
      error: (e: ErrorApi) => {
        this.cargando.set(false); this.gestion.set(null);
        this.error.set(this.mensaje(e));
      },
    });
  }

  protected agregar(): void {
    const idPersonaPonente = this.seleccionado();
    const actividad = Number(this.actividad().id_actividad); const sesion = Number(this.sesion().id_actividad_sesion);
    if (!idPersonaPonente || this.operando() || this.auth?.tienePermiso('ponentes-firmantes.crear') !== true) return;
    this.operando.set(true); this.error.set(''); this.aviso.set('');
    this.consulta = this.api.vincularPonenteSesion(actividad, sesion, idPersonaPonente).pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: () => {
        this.aviso.set('Ponente vinculado a esta sesión.');
        this.seleccion.set(''); this.mostrarSeleccion.set(false);
        this.recargarPersistido();
      },
      error: (e: ErrorApi) => {
        this.operando.set(false); this.error.set(this.mensaje(e));
        this.recargarPersistido();
      },
    });
  }

  protected desvincular(idActividadPonente: number): void {
    const actividad = Number(this.actividad().id_actividad); const sesion = Number(this.sesion().id_actividad_sesion);
    if (this.operando() || this.auth?.tienePermiso('ponentes-firmantes.eliminar') !== true
      || !this.gestion()?.vinculos.some(v => Number(v.id_actividad_ponente) === idActividadPonente)) return;
    this.operando.set(true); this.error.set(''); this.aviso.set('');
    this.consulta = this.api.desvincularPonenteSesion(actividad, sesion, idActividadPonente).pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: () => {
        this.confirmando.set(null); this.aviso.set('Ponente desvinculado de esta sesión.');
        this.recargarPersistido();
      },
      error: (e: ErrorApi) => {
        this.operando.set(false); this.confirmando.set(null); this.error.set(this.mensaje(e));
        this.recargarPersistido();
      },
    });
  }

  /** La lista mostrada siempre se recupera del servidor después de escribir. */
  private recargarPersistido(): void {
    const actividad = Number(this.actividad().id_actividad); const sesion = Number(this.sesion().id_actividad_sesion);
    this.consulta?.unsubscribe();
    this.consulta = this.api.ponentesSesion(actividad, sesion).pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: gestion => { this.operando.set(false); this.gestion.set(gestion); this.actualizado.emit(); },
      error: (e: ErrorApi) => { this.operando.set(false); this.gestion.set(null); this.error.set(this.mensaje(e)); },
    });
  }

  private datosPonente(idPersonaPonente: number, idActividadPonente: number, idPersona?: number): OpcionPonente {
    const fila = this.gestion()?.vinculos.find(p => p.id_actividad_ponente === idActividadPonente && p.nombres)
      ?? this.gestion()?.ponentes_disponibles.find(p => p.id_persona_ponente === idPersonaPonente);
    const persona = idPersona ?? fila?.id_persona;
    const nombre = fila ? [fila.nombres, fila.apellido_paterno, fila.apellido_materno].filter(Boolean).join(' ').trim() : '';
    const dni = persona !== undefined ? this.identidades()[persona] : undefined;
    return {
      id_persona_ponente: idPersonaPonente, id_persona: Number(persona) || 0,
      nombre: nombre || `Ponente #${idPersonaPonente}`,
      identificacion: dni ? `DNI ${dni}` : `Registro #${idPersonaPonente}`,
      cargo: this.cargos().get(idPersonaPonente) ?? null,
      id_actividad_ponente: idActividadPonente,
    };
  }

  private personaDe(idPersonaPonente: number): number | null {
    return this.gestion()?.ponentes_disponibles.find(p => p.id_persona_ponente === idPersonaPonente)?.id_persona ?? null;
  }

  private mensaje(e: ErrorApi): string {
    if (e?.mensaje && !/sql|postgres|neon|esquema|schema|sqlstate/i.test(e.mensaje)) return e.mensaje;
    switch (e?.status) {
      case 0: return 'No se pudo conectar con el servidor. Comprueba tu conexión e intenta nuevamente.';
      case 401: return 'Tu sesión no está autenticada. Inicia sesión nuevamente.';
      case 403: return 'No tienes permisos para realizar esta operación.';
      case 404: return 'La sesión o el recurso solicitado ya no está disponible.';
      case 409: return 'No se pudo realizar la operación. El ponente puede estar ya asignado o tener un reconocimiento asociado.';
      case 422: return 'Los datos no son válidos. Revisa el ponente seleccionado.';
      default: return 'No se pudo completar la operación. Intenta nuevamente.';
    }
  }
}
