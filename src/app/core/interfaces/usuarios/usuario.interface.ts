/**
 * Contratos de /api/usuarios (UserController de gpc_back).
 * PaginatedResponse<T> y ApiResponse<T> viven en core/interfaces/api para reutilizarse.
 */

/** rol de un usuario; null si la cuenta no tiene rol asignado. */
export interface UsuarioRol {
  readonly id: number;
  readonly nombre: string;
}

export interface Usuario {
  readonly id: number;
  readonly nombre: string;
  readonly dni: string;
  readonly correo: string;
  readonly rol: UsuarioRol | null;
  readonly estado: boolean;
  readonly bloqueado: boolean;
  readonly intentosFallidos?: number;
  readonly limiteIntentos?: number;
  /** ISO 8601; null si nunca inició sesión. */
  readonly ultimoAcceso: string | null;
}

/**
 * POST /api/usuarios. Si la persona del DNI ya existe, el backend usa sus datos
 * e ignora los nombres; si no existe, nombres y apellidoPaterno son obligatorios.
 * La contraseña nunca se envía: el usuario la crea desde el enlace del correo.
 */
export interface UsuarioPayload {
  dni: string;
  nombres?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  correo: string;
  idRol: number;
}

/** PUT /api/usuarios/{id}. */
export interface UsuarioActualizarPayload {
  correo: string;
  idRol?: number;
  password?: string;
  password_confirmation?: string;
}

/** Query de GET /api/usuarios; los filtros sin valor no se envían. */
export interface UsuarioFiltros {
  search?: string;
  idRol?: number;
  estado?: boolean;
  page?: number;
}
