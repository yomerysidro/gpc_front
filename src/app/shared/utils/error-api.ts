import { HttpErrorResponse } from '@angular/common/http';
import { ErrorApi } from '../../core/interfaces/api/api-response.interface';

const MENSAJE_GENERICO = 'No se pudo completar la operación. Intenta nuevamente.';

/**
 * Normaliza un error HTTP de gpc_back: conserva el message del backend (409, 429…)
 * y, en un 422, los errores por campo. Sin conexión o sin cuerpo usa un mensaje genérico.
 */
export function aErrorApi(error: unknown): ErrorApi {
  if (!(error instanceof HttpErrorResponse)) {
    return { status: 0, mensaje: MENSAJE_GENERICO, errores: {} };
  }

  const cuerpo = error.error as { message?: unknown; errors?: unknown } | null;
  const mensaje = typeof cuerpo?.message === 'string' && cuerpo.message ? cuerpo.message : MENSAJE_GENERICO;
  const errores = error.status === 422 && cuerpo?.errors && typeof cuerpo.errors === 'object'
    ? cuerpo.errors as Record<string, string[]>
    : {};

  return { status: error.status, mensaje, errores };
}
