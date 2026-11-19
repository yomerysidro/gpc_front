import { inject, Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, tap } from 'rxjs';
import { PaginaEmision, RegistroEmision } from '../../../core/interfaces/emision-certificados/emision-certificados.interface';
import { EmisionCertificadosService } from '../../../core/services/emision-certificados/emision-certificados.service';
import { PersonService } from '../../../core/services/person/person.service';
import { estadoListado } from './estados-sesiones-asistencia';
import { aErrorApi } from '../../../shared/utils/error-api';

export interface FiltrosSesionesAsistencia {
  nombre: string;
  actividad: string;
  fecha: string;
  sesion: string;
  estado: string;
}
export const FILTROS_SESIONES_VACIOS: FiltrosSesionesAsistencia = { nombre: '', actividad: '', fecha: '', sesion: '', estado: '' };
export const normalizarBusqueda = (valor: string): string => valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().trim();

export interface DatosAsistenciaContextual {
  actividad: { id_actividad: number; nombre: string };
  sesiones: readonly RegistroEmision[];
  participantes: readonly { id: number; nombres: string; apellidos: string; fechaInscripcion?: string | null }[];
  asistencias: readonly RegistroEmision[];
  soloSeleccionados?: boolean;
  incluirCandidatos?: boolean;
}

/** Modelo de presentación exclusivo de estas pestañas. Las claves CRUD no cambian. */
@Injectable()
export class SesionesAsistenciaListado {
  private readonly api = inject(EmisionCertificadosService);
  private readonly personas = inject(PersonService);
  private cargado = false;
  filas: readonly RegistroEmision[] = [];
  actividades: readonly RegistroEmision[] = [];
  sesiones: readonly RegistroEmision[] = [];
  estados: readonly string[] = [];
  participaciones: readonly RegistroEmision[] = [];
  asistencias: readonly RegistroEmision[] = [];
  nombres = new Map<number, string>();
  errorPersonas: string | null = null;
  private nombresParticipaciones = new Map<number, string>();
  private soloSeleccionados = false;

  /** Reutiliza consultas ya confirmadas por el detalle, sin volver a pedir sus catálogos. */
  usarContexto(datos: DatosAsistenciaContextual): void {
    this.actividades = [datos.actividad];
    this.sesiones = datos.sesiones.filter(s => Number(s['id_actividad']) === datos.actividad.id_actividad);
    this.participaciones = datos.participantes.map(p => ({ id_participacion: p.id, id_actividad: datos.actividad.id_actividad, fecha_inscripcion: p.fechaInscripcion ?? null }));
    this.nombresParticipaciones = new Map(datos.participantes.map(p => [p.id, [p.nombres, p.apellidos].filter(Boolean).join(' ')]));
    this.asistencias = datos.asistencias;
    this.soloSeleccionados = datos.soloSeleccionados === true;
    this.cargado = true;
  }

  invalidar(): void { this.cargado = false; }

  cargar(asistencias: boolean, actividadContexto: { id_actividad: number; nombre: string } | null = null): Observable<void> {
    if (this.cargado) return of(undefined);
    this.errorPersonas = null;
    return forkJoin({
      sesiones: this.api.listarTodos('activity-session'),
      actividades: actividadContexto ? of([actividadContexto]) : this.api.listarTodos('activity'),
      asistencias: asistencias ? this.api.listarTodos('attendance') : of([]),
      participaciones: asistencias ? this.api.listarTodos('participation') : of([]),
      personas: asistencias ? this.personas.listar().pipe(catchError(error => {
        this.errorPersonas = `No se pudo consultar /persons/list${error?.status ? ` (HTTP ${error.status})` : ''}. ${error?.mensaje || aErrorApi(error).mensaje}`; return of([]);
      })) : of([]),
    }).pipe(tap(datos => {
      this.actividades = datos.actividades;
      this.sesiones = datos.sesiones;
      this.participaciones = datos.participaciones; this.asistencias = datos.asistencias;
      this.soloSeleccionados = false;
      const actividades = new Map(datos.actividades.map(fila => [Number(fila['id_actividad']), fila['nombre']]));
      const sesiones = new Map(datos.sesiones.map(fila => [Number(fila['id_actividad_sesion']), fila]));
      const participaciones = new Map(datos.participaciones.map(fila => [Number(fila['id_participacion']), fila]));
      const personas = new Map(datos.personas.map(persona => [persona.id_persona,
        [persona.nombres, persona.apellido_paterno, persona.apellido_materno].filter(Boolean).join(' ')]));
      this.nombres = personas;
      this.filas = (asistencias ? datos.asistencias : datos.sesiones).map(fila => {
        const sesion = sesiones.get(Number(fila['id_actividad_sesion']));
        const participacion = participaciones.get(Number(fila['id_participacion']));
        const actividad = asistencias ? sesion?.['id_actividad'] ?? fila['id_actividad_sesion_actividad'] : fila['id_actividad'];
        return { ...fila, actividadFiltro: actividad ?? null,
          actividadNombre: actividades.get(Number(actividad)) ?? 'Nombre no disponible',
          sesionNombre: sesion?.['nombre'] ?? 'Nombre no disponible',
          participanteNombre: personas.get(Number(fila['id_persona'] ?? participacion?.['id_persona'])) ?? 'Nombre no disponible' };
      });
      this.estados = [...new Set(this.filas.map(fila => String(fila['estado'] ?? '')).filter(Boolean))].sort();
      this.cargado = true;
    }), map(() => undefined));
  }

  sesionesDisponibles(actividad: string): readonly RegistroEmision[] {
    return actividad ? this.sesiones.filter(sesion => String(sesion['id_actividad']) === actividad) : [];
  }

  matriz(actividad: string, sesion: string): readonly RegistroEmision[] {
    if (!actividad || !sesion || !this.sesionesDisponibles(actividad).some(fila => String(fila['id_actividad_sesion']) === sesion)) return [];
    return this.participaciones.filter(fila => String(fila['id_actividad']) === actividad).flatMap(participacion => {
      const marcas = this.asistencias.filter(marca => Number(marca['id_participacion']) === Number(participacion['id_participacion']) && String(marca['id_actividad_sesion']) === sesion);
      if (this.soloSeleccionados && !marcas.some(marca => marca['id_asistencia'] != null)) return [];
      return [{ ...marcas[0], fecha_inscripcion: participacion['fecha_inscripcion'], id_participacion: participacion['id_participacion'], id_actividad_sesion: Number(sesion), actividadFiltro: Number(actividad),
        sesionNombre: this.sesiones.find(fila => String(fila['id_actividad_sesion']) === sesion)?.['nombre'] ?? 'Nombre no disponible',
        actividadNombre: this.actividades.find(fila => String(fila['id_actividad']) === actividad)?.['nombre'] ?? 'Nombre no disponible',
        participanteNombre: this.nombresParticipaciones.get(Number(participacion['id_participacion'])) || this.nombres.get(Number(participacion['id_persona'])) || 'Nombre no disponible', duplicada: marcas.length > 1 }];
    });
  }

  paginar(filtros: FiltrosSesionesAsistencia, asistencias: boolean, numero: number, cantidad: number): PaginaEmision<RegistroEmision> {
    const nombre = normalizarBusqueda(filtros.nombre);
    const filas = (asistencias ? this.matriz(filtros.actividad, filtros.sesion) : this.filas).filter(fila =>
      (!nombre || normalizarBusqueda(String(fila[asistencias ? 'participanteNombre' : 'nombre'] ?? '')).includes(nombre)) &&
      (!filtros.actividad || String(fila['actividadFiltro']) === filtros.actividad) &&
      (!filtros.fecha || String(fila['fecha'] ?? '').slice(0, 10) === filtros.fecha) &&
      (!filtros.sesion || String(fila['id_actividad_sesion']) === filtros.sesion) &&
      (!filtros.estado || estadoListado(fila['estado'], asistencias) === estadoListado(filtros.estado, asistencias)));
    const ultima = Math.max(1, Math.ceil(filas.length / cantidad));
    const pagina = Math.max(1, Math.min(numero, ultima));
    return { data: filas.slice((pagina - 1) * cantidad, pagina * cantidad), total: filas.length,
      current_page: pagina, last_page: ultima, per_page: cantidad };
  }
}
