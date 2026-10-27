/**
 * Clave de un permiso: "<slug-del-modulo>.<accion>" en minúsculas (p. ej. "reportes.ver",
 * "ponentes-firmantes.editar"). El slug es la URL del módulo sin la barra y es fijo: el backend
 * exige que la clave empiece con él (422) y no deja cambiar la URL de un módulo con permisos (409).
 * En el formulario solo se escribe la acción.
 */

/** Acción: minúsculas y dígitos, con guiones internos. */
export const PATRON_ACCION_PERMISO = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** URL de módulo: "/" y minúsculas con guiones internos (p. ej. "/ponentes-firmantes"). */
export const PATRON_URL_MODULO = /^\/[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Longitud máxima de la clave completa (backend: max:50). */
export const LARGO_MAXIMO_CLAVE = 50;

/** Slug del módulo: "/ponentes-firmantes" → "ponentes-firmantes". */
export function slugModulo(urlModulo: string): string {
  return urlModulo.replace(/^\/+/, '');
}

export function componerClave(urlModulo: string, accion: string): string {
  return `${slugModulo(urlModulo)}.${accion}`;
}

/** Acción de una clave existente: "reportes.exportar" → "exportar". */
export function accionDeClave(urlModulo: string, clave: string): string {
  const prefijo = `${slugModulo(urlModulo)}.`;
  return clave.startsWith(prefijo) ? clave.slice(prefijo.length) : clave.slice(clave.lastIndexOf('.') + 1);
}

/** Acción sugerida: primera palabra del nombre, sin tildes y en minúsculas ("Exportar reportes" → "exportar"). */
export function accionDesdeNombre(nombre: string): string {
  return (nombre.trim().split(/\s+/)[0] ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '');
}
