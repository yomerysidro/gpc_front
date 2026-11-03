import { FiltrosInscripcion, Inscripcion } from '../../core/interfaces/participantes/participante.interface';

// PARTICIPACION admite texto libre; estos son los estados ofrecidos por la interfaz.
export const ESTADOS_INSCRIPCION = [
  { valor: 'Activo', etiqueta: 'Activo' },
  { valor: 'Cerrado', etiqueta: 'Cerrado' },
] as const;

export function estadoInscripcion(valor: string): string {
  const estado = valor.trim().toLocaleLowerCase('es');
  return ESTADOS_INSCRIPCION.find(opcion => opcion.valor.toLocaleLowerCase('es') === estado)?.valor ?? valor;
}

export function filtrarInscripciones(
  datos: readonly Inscripcion[], filtros: FiltrosInscripcion, textoPersona: (id: number) => string,
): readonly Inscripcion[] {
  const normalizar = (valor: string) => valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es');
  const busqueda = normalizar(filtros.busqueda.trim());
  return datos.filter(item => (!busqueda || normalizar(textoPersona(item.id_persona)).includes(busqueda))
    && (!filtros.actividad || String(item.id_actividad) === filtros.actividad)
    && (!filtros.tipo || String(item.id_tipo_participacion) === filtros.tipo)
    && (!filtros.estado || estadoInscripcion(item.estado) === estadoInscripcion(filtros.estado)));
}

export function hayDuplicado(datos: readonly Inscripcion[], persona: number, actividad: number, excluir: number | null): boolean {
  return datos.some(item => item.id_persona === persona && item.id_actividad === actividad && item.id_participacion !== excluir);
}

export function fechaHoyLima(): string {
  const partes = new Intl.DateTimeFormat('en', { timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const valor = (tipo: string) => partes.find(parte => parte.type === tipo)!.value;
  return `${valor('year')}-${valor('month')}-${valor('day')}`;
}
