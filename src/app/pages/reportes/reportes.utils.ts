export function mensajeReporte(error: unknown): string {
  const status = (error as { status?: number } | null)?.status;
  if (status === 401) return 'Tu sesión venció. Inicia sesión nuevamente para consultar el reporte.';
  if (status === 403) return 'No tienes permiso para consultar estos datos. El permiso de Reportes no concede acceso a los otros módulos.';
  if (status === 500) return 'El servidor no pudo consultar los datos. Intenta actualizar más tarde.';
  if (status === 404) return 'No se encontró el registro solicitado.';
  if (status === 422) return 'Revisa los filtros y comprueba que la sesión pertenezca a la actividad seleccionada.';
  if (status === 0) return 'No se pudo conectar con el servidor. Comprueba la conexión e intenta nuevamente.';
  return error instanceof Error ? error.message : 'No se pudo consultar el reporte. Intenta nuevamente.';
}

export function fechasValidas(inicio: string, fin: string): boolean {
  return !inicio || !fin || inicio <= fin;
}

/** CSV UTF-8 con BOM, RFC 4180 y neutralización de fórmulas incluso tras espacios/controles. */
export function crearCsv(encabezados: readonly string[], filas: readonly (readonly unknown[])[]): string {
  const celda = (valor: unknown) => {
    let texto = String(valor ?? '');
    if (/^[\s\u0000-\u0020]*[=+@-]/u.test(texto) || /^[\t\r\n]/u.test(texto)) texto = "'" + texto;
    return '"' + texto.replace(/"/g, '""') + '"';
  };
  return '\uFEFF' + [encabezados, ...filas].map(fila => fila.map(celda).join(',')).join('\r\n');
}

export function descargarCsv(nombre: string, encabezados: readonly string[], filas: readonly (readonly unknown[])[]): void {
  descargarArchivo(nombre, new Blob([crearCsv(encabezados, filas)], { type: 'text/csv;charset=utf-8;' }));
}

export function descargarArchivo(nombre: string, archivo: Blob): void {
  const url = URL.createObjectURL(archivo);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombre;
  enlace.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function estadoCertificado(valor: unknown): string {
  if (valor === true || valor === 1 || valor === '1') return 'Activo';
  if (valor === false || valor === 0 || valor === '0') return 'Inactivo';
  const estados: Record<string, string> = { PREPARADO: 'Preparado', PENDIENTE_FIRMA: 'Pendiente de firma', FIRMADO: 'Firmado', EMITIDO: 'Emitido', ANULADO: 'Anulado' };
  return typeof valor === 'string' && valor.trim() ? (estados[valor] ?? valor) : 'Estado no reconocido';
}

export function puedeConsultarReporte(auth: { tienePermiso(clave: string): boolean }, permiso: string): boolean {
  return auth.tienePermiso(permiso) || auth.tienePermiso('gerencia.ver') && auth.tienePermiso('reportes.ver');
}
