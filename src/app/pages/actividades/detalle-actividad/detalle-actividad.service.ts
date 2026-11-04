import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { ActividadesService } from '../../../core/services/actividades/actividades.service';
import { ParticipantesService } from '../../../core/services/participantes/participantes.service';
import { PersonSpeakerService } from '../../../core/services/person-speaker/person-speaker.service';
import { PersonaActividad } from '../../../core/interfaces/actividades/actividad.interface';
import { PersonDocumentService } from '../../../core/services/person-document/person-document.service';
import { DocumentTypeService } from '../../../core/services/document-type/document-type.service';

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
  dni: string | null;
}

/** Une los listados autorizados de Laravel por sus claves reales, sin consultas por persona. */
@Injectable({ providedIn: 'root' })
export class DetalleActividadService {
  private readonly actividades = inject(ActividadesService);
  private readonly participaciones = inject(ParticipantesService);
  private readonly ponentes = inject(PersonSpeakerService);
  private readonly documentos = inject(PersonDocumentService);
  private readonly tiposDocumento = inject(DocumentTypeService);

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

  consultarParticipantes(id: number, personas: Observable<readonly PersonaActividad[]>): Observable<readonly ParticipanteDetalle[]> {
    return this.participaciones.listar().pipe(
      map(filas => filas.filter(fila => fila.id_actividad === id)),
      switchMap(filas => filas.length ? forkJoin({ personas, documentos: this.documentos.listar(), tipos: this.tiposDocumento.listar() }).pipe(
        map(({ personas, documentos, tipos }) => {
          const porPersona = new Map(personas.map(persona => [persona.id_persona, persona]));
          const tiposDni = new Set(tipos.filter(tipo => ['DNI', 'DOCUMENTO NACIONAL DE IDENTIDAD'].includes(tipo.nombre.trim().toUpperCase()))
            .map(tipo => tipo.id_tipo_documento));
          const porDni = new Map<number, Set<string>>();
          for (const documento of documentos) {
            if (!tiposDni.has(documento.id_tipo_documento) || !documento.numero_documento?.trim()) continue;
            const numeros = porDni.get(documento.id_persona) ?? new Set<string>();
            numeros.add(documento.numero_documento.trim()); porDni.set(documento.id_persona, numeros);
          }
          return filas.map(fila => {
            const persona = porPersona.get(fila.id_persona);
            const numeros = porDni.get(fila.id_persona);
            return { id: fila.id_participacion, nombres: persona?.nombres || 'No disponible',
              apellidos: persona ? [persona.apellido_paterno, persona.apellido_materno].filter(Boolean).join(' ') || 'No disponible' : 'No disponible',
              dni: numeros?.size === 1 ? [...numeros][0] : null };
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
