/**
 * Envoltorios de respuesta de gpc_back (trait ApiResponse) y su paginación.
 * Reutilizables por cualquier módulo.
 */

/** Respuesta simple: {success, message, data}. */
export interface ApiResponse<T> {
  readonly success: boolean;
  readonly message: string;
  readonly data: T;
}

/** meta de los listados paginados. */
export interface PaginacionMeta {
  readonly total: number;
  readonly page: number;
  readonly perPage: number;
}

/** Listado paginado: {success, message, data: T[], meta}. */
export interface PaginatedResponse<T> {
  readonly success: boolean;
  readonly message: string;
  readonly data: readonly T[];
  readonly meta: PaginacionMeta;
}

/** Cuerpo de un 422 de Laravel: errores por campo. */
export interface ValidationErrorResponse {
  readonly message: string;
  readonly errors: Readonly<Record<string, readonly string[]>>;
}

/**
 * Error normalizado que emiten los servicios (front-side): status HTTP,
 * el message del backend y, en un 422, los errores por campo.
 */
export interface ErrorApi {
  readonly status: number;
  readonly mensaje: string;
  readonly errores: Readonly<Record<string, readonly string[]>>;
}
