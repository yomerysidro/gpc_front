import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable, of, tap } from 'rxjs';
import { PaginaEmision, RegistroEmision } from '../../../core/interfaces/emision-certificados/emision-certificados.interface';
import { EmisionCertificadosService } from '../../../core/services/emision-certificados/emision-certificados.service';
import { PersonService } from '../../../core/services/person/person.service';
import { estadoListado } from './estados-sesiones-asistencia';

export interface FiltrosSesionesAsistencia {
  nombre: string;
  actividad: string;
  fecha: string;
  sesion: string;
  estado: string;
}
export const FILTROS_SESIONES_VACIOS: FiltrosSesionesAsistencia = { nombre: '', actividad: '', fecha: '', sesion: '', estado: '' };
export const normalizarBusqueda = (valor: string): string => valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().trim();

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

  invalidar(): void { this.cargado = false; }

  cargar(asistencias: boolean): Observable<void> {
    if (this.cargado) return of(undefined);
    return forkJoin({
      sesiones: this.api.listarTodos('activity-session'),
      actividades: this.api.listarTodos('activity'),
      asistencias: asistencias ? this.api.listarTodos('attendance') : of([]),
      participaciones: asistencias ? this.api.listarTodos('participation') : of([]),
      personas: asistencias ? this.personas.listar() : of([]),
    }).pipe(tap(datos => {
      this.actividades = datos.actividades;
      this.sesiones = datos.sesiones;
      const actividades = new Map(datos.actividades.map(fila => [Number(fila['id_actividad']), fila['nombre']]));
      const sesiones = new Map(datos.sesiones.map(fila => [Number(fila['id_actividad_sesion']), fila]));
      const participaciones = new Map(datos.participaciones.map(fila => [Number(fila['id_participacion']), fila]));
      const personas = new Map(datos.personas.map(persona => [persona.id_persona,
        [persona.nombres, persona.apellido_paterno, persona.apellido_materno].filter(Boolean).join(' ')]));
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
    return this.sesiones.filter(sesion => !actividad || String(sesion['id_actividad']) === actividad);
  }

  paginar(filtros: FiltrosSesionesAsistencia, asistencias: boolean, numero: number, cantidad: number): PaginaEmision<RegistroEmision> {
    const nombre = normalizarBusqueda(filtros.nombre);
    const filas = this.filas.filter(fila =>
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
