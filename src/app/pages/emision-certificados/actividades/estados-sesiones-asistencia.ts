/** Laravel acepta texto (máximo 30 caracteres); no hay códigos numéricos ni enum. */
export const ESTADOS_SESIONES = [
  { valor: 'activo', etiqueta: 'Activo' },
  { valor: 'cerrado', etiqueta: 'Cerrado' },
  { valor: 'culminado', etiqueta: 'Culminado' },
] as const;

export const ESTADOS_ASISTENCIAS = [
  { valor: 'presente', etiqueta: 'Presente' },
  { valor: 'ausente', etiqueta: 'Ausente' },
  { valor: 'activo', etiqueta: 'Activo (histórico)' },
  { valor: 'inactivo', etiqueta: 'Inactivo (histórico)' },
] as const;

export type ResultadoPresencia = 'presente' | 'ausente' | 'pendiente' | 'sin_clasificar' | 'duplicada';

/** Solo el estado explícito de asistencia acredita presencia/ausencia; nunca las horas o la inscripción. */
export function resultadoPresencia(fila: Readonly<Record<string, unknown>>): ResultadoPresencia {
  if (fila['duplicada']) return 'duplicada';
  if (!fila['id_asistencia']) return 'pendiente';
  const estado = String(fila['estado'] ?? '').trim().toLocaleLowerCase();
  return estado === 'presente' || estado === 'ausente' ? estado : 'sin_clasificar';
}

export function resumenPresencia(filas: readonly Readonly<Record<string, unknown>>[]) {
  const cantidad = (estado: ResultadoPresencia) => filas.filter(fila => resultadoPresencia(fila) === estado).length;
  return { inscritos: filas.length, presentes: cantidad('presente'), ausentes: cantidad('ausente'), pendientes: cantidad('pendiente'),
    porRevisar: cantidad('sin_clasificar') + cantidad('duplicada') };
}

/** Se conserva el texto histórico desconocido; no se le asigna un significado. */
export function estadoListado(valor: unknown, asistencia: boolean): string {
  const texto = String(valor ?? '').trim().toLocaleLowerCase();
  // Variantes textuales ya utilizadas por los formularios y contratos del proyecto.
  if (!asistencia && texto === 'activa') return 'activo';
  if (!asistencia && texto === 'cerrada') return 'cerrado';
  return texto;
}

export function etiquetaEstado(valor: unknown, asistencia: boolean): string {
  const opciones = asistencia ? ESTADOS_ASISTENCIAS : ESTADOS_SESIONES;
  return opciones.find(opcion => opcion.valor === estadoListado(valor, asistencia))?.etiqueta ?? (asistencia ? 'Estado sin clasificación' : String(valor ?? ''));
}
