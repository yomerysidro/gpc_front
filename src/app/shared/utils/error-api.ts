import { HttpErrorResponse } from '@angular/common/http';
import { ErrorApi } from '../../core/interfaces/api/api-response.interface';

const MENSAJE_GENERICO = 'No se pudo completar la operación. Intenta nuevamente.';

/**
 * Normaliza un error HTTP de gpc_back: conserva el message del backend (409, 429…)
 * y, en un 422, los errores por campo. Sin conexión o sin cuerpo usa un mensaje genérico.
 * Todos los 422 de gpc_back usan el formato estándar de Laravel ({message, errors: {campo: [..]}}).
 * Se conserva por seguridad la lectura del formato antiguo de las asignaciones de un rol
 * ({success, message, data: {'permisos.0': '..'}}), que el backend ya no envía.
 */
export function aErrorApi(error: unknown): ErrorApi {
  if (!(error instanceof HttpErrorResponse)) {
    return { status: 0, mensaje: MENSAJE_GENERICO, errores: {} };
  }

  const cuerpo = error.error as { message?: unknown; errors?: unknown; data?: unknown } | null;
  const mensaje = typeof cuerpo?.message === 'string' && cuerpo.message ? cuerpo.message : MENSAJE_GENERICO;

  return { status: error.status, mensaje, errores: error.status === 422 ? erroresPorCampo(cuerpo) : {} };
}

function erroresPorCampo(cuerpo: { errors?: unknown; data?: unknown } | null): Record<string, readonly string[]> {
  if (cuerpo?.errors && typeof cuerpo.errors === 'object') {
    return cuerpo.errors as Record<string, string[]>;
  }

  if (cuerpo?.data && typeof cuerpo.data === 'object' && !Array.isArray(cuerpo.data)) {
    return Object.fromEntries(Object.entries(cuerpo.data)
      .filter((par): par is [string, string] => typeof par[1] === 'string')
      .map(([campo, texto]) => [campo, [texto]]));
  }

  return {};
}
