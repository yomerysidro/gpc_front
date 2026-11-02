/** Compatibilidad de lectura: las migraciones y los Data de Laravel difieren. */
export function estadoActivo(valor: unknown): boolean {
  return valor === true || valor === 1 || ['1', 'true', 'activo', 'activa'].includes(String(valor).trim().toLowerCase());
}

export function documentoAnulado(estado: string | undefined): boolean {
  return estado?.trim().toUpperCase() === 'ANULADO';
}

export function etiquetaEstado(valor: unknown): string {
  if (typeof valor === 'boolean' || valor === 0 || valor === 1) return estadoActivo(valor) ? 'Activo' : 'Inactivo';
  return valor === null || valor === undefined || valor === '' ? 'No informado' : String(valor);
}
