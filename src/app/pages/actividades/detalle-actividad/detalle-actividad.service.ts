import { inject, Injectable } from '@angular/core';
import { catchError, combineLatest, EMPTY, filter, forkJoin, map, Observable, of, startWith, switchMap, tap } from 'rxjs';
import { ActividadesService } from '../../../core/services/actividades/actividades.service';
import { ParticipantesService } from '../../../core/services/participantes/participantes.service';
import { PersonSpeakerService } from '../../../core/services/person-speaker/person-speaker.service';
import { PersonaActividad } from '../../../core/interfaces/actividades/actividad.interface';

export interface PonenteDetalle {
  id: number;
  nombre: string;
  procedencia: string | null;
  especialidad: string | null;
}

export interface ParticipanteDetalle {
  id: number;
  nombres: string;
  apellidos: string;
  tipo: string;
  fecha: string;
  estado: string;
}
export type CatalogoParticipantes = 'personas' | 'tiposParticipacion';

/** Une los listados autorizados de Laravel por sus claves reales, sin consultas por persona. */
@Injectable({ providedIn: 'root' })
export class DetalleActividadService {
  private readonly actividades = inject(ActividadesService);
  private readonly participaciones = inject(ParticipantesService);
  private readonly ponentes = inject(PersonSpeakerService);

  consultarPonentes(id: number, personas: Observable<readonly PersonaActividad[]>): Observable<readonly PonenteDetalle[]> {
    return this.actividades.listarAsignacionesPonentes().pipe(
      map(filas => filas.filter(fila => fila.id_actividad === id)),
      switchMap(filas => filas.length ? forkJoin({ personas, catalogo: this.ponentes.listar() }).pipe(
        map(({ personas, catalogo }) => {
          const porPersona = new Map(personas.map(persona => [persona.id_persona, persona]));
          const porPonente = new Map(catalogo.map(ponente => [ponente.id_persona_ponente, ponente]));
          return filas.map(fila => {
            const ponente = porPonente.get(fila.id_persona_ponente);
            return { id: fila.id_actividad_ponente, nombre: nombreCompleto(ponente ? porPersona.get(ponente.id_persona) : undefined),
              procedencia: null, especialidad: ponente?.especialidad ?? null };
          });
        }),
      ) : of([])),
    );
  }

  consultarParticipantes(id: number, personas: Observable<readonly PersonaActividad[]>,
    informar: (recurso: CatalogoParticipantes, error: unknown | null) => void = () => {},
    reintentos: Observable<CatalogoParticipantes> = EMPTY): Observable<readonly ParticipanteDetalle[]> {
    // Cada catálogo falla y se reintenta de forma independiente. El listado principal no se simula.
    const auxiliar = <T>(recurso: CatalogoParticipantes, consulta: Observable<readonly T[]>) =>
      reintentos.pipe(filter(valor => valor === recurso), startWith(recurso), switchMap(() => consulta.pipe(
        tap(() => informar(recurso, null)),
        catchError(error => { informar(recurso, error); return of<readonly T[]>([]); }),
      )));
    return this.participaciones.listar().pipe(
      map(filas => filas.filter(fila => fila.id_actividad === id)),
      switchMap(filas => filas.length ? combineLatest({ personas: auxiliar('personas', personas),
        tipos: auxiliar('tiposParticipacion', this.participaciones.tipos()) }).pipe(
        map(({ personas, tipos }) => {
          const porPersona = new Map(personas.map(persona => [persona.id_persona, persona]));
          const porTipo = new Map(tipos.map(tipo => [tipo.id_tipo_participacion, tipo.nombre]));
          return filas.map(fila => {
            const persona = porPersona.get(fila.id_persona);
            return { id: fila.id_participacion, nombres: persona?.nombres || 'No disponible',
              apellidos: persona ? [persona.apellido_paterno, persona.apellido_materno].filter(Boolean).join(' ') : '',
              tipo: porTipo.get(fila.id_tipo_participacion) || 'No disponible', fecha: fila.fecha_inscripcion, estado: fila.estado };
          });
        }),
      ) : of([])),
    );
  }
}

function nombreCompleto(persona: PersonaActividad | undefined): string {
  return persona ? [persona.nombres, persona.apellido_paterno, persona.apellido_materno].filter(Boolean).join(' ').trim() || 'Nombre no disponible'
    : 'Nombre no disponible';
}
