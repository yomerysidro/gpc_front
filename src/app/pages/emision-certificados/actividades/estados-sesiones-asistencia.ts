/** Laravel acepta texto (máximo 30 caracteres); no hay códigos numéricos ni enum. */
export const ESTADOS_SESIONES = [
  { valor: 'activo', etiqueta: 'Activo' },
  { valor: 'cerrado', etiqueta: 'Cerrado' },
  { valor: 'culminado', etiqueta: 'Culminado' },
] as const;

export const ESTADOS_ASISTENCIAS = [
  { valor: 'activo', etiqueta: 'Activo' },
  { valor: 'inactivo', etiqueta: 'Inactivo' },
] as const;

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
  return opciones.find(opcion => opcion.valor === estadoListado(valor, asistencia))?.etiqueta ?? String(valor ?? '');
}
