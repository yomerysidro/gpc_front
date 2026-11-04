/**
 * Contratos de gpc_back (AuthController). Las claves son exactamente las del JSON.
 */

/** user en POST /auth/login y GET /auth/me. */
export interface UsuarioSesion {
  readonly id: number;
  readonly nombre: string;
  readonly email: string;
  readonly rol: string;
}

/** Elemento de modulos en GET /auth/me; imagen es el nombre de un Material Icon. */
export interface ModuloMenu {
  readonly id: number;
  readonly nombre: string;
  readonly url: string;
  readonly imagen: string;
}

/** Respuesta de GET /auth/me. */
export interface CapacidadesSolicitudes {
  readonly consultar_revision: boolean;
  readonly consultar_gerencia: boolean;
  readonly consultar_historial: boolean;
  readonly consulta_administrativa_global: boolean;
  readonly revisar: boolean;
  readonly derivar: boolean;
  readonly aprobar: boolean;
  readonly rechazar: boolean;
  readonly decidir_ambito_institucional: boolean;
  readonly decidir_propias: boolean;
}

export interface SesionResponse {
  readonly user: UsuarioSesion;
  readonly modulos: readonly ModuloMenu[];
  readonly permisos: readonly string[];
  readonly capacidades_solicitudes: CapacidadesSolicitudes;
}

/** Respuesta 200 de POST /auth/login; el menú y los permisos llegan por /auth/me. */
export interface LoginResponse {
  readonly user: UsuarioSesion;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

/**
 * Cuerpo de error de los endpoints de auth (401, 400, 423).
 * bloqueadoHasta (ISO 8601) solo llega en el 423 de una cuenta ya bloqueada;
 * el 423 del quinto intento fallido no lo incluye.
 */
export interface AuthErrorResponse {
  readonly message: string;
  readonly bloqueadoHasta?: string;
}

/** Resultado de login() para la página: 401 → rechazado, 423 → bloqueado. */
export type ResultadoLogin =
  | { readonly tipo: 'exito' }
  | { readonly tipo: 'rechazado'; readonly mensaje: string }
  | { readonly tipo: 'bloqueado'; readonly mensaje: string; readonly bloqueadoHasta: string | null };
