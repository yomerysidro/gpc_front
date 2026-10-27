/** Contratos de /api/modulos y /api/permisos, verificados contra las respuestas reales. */

/** Permiso anidado en un módulo (GET /api/modulos) y respuesta de sus endpoints. */
export interface Permiso {
  readonly id: number;
  readonly idModulo: number;
  readonly nombre: string;
  readonly clave: string;
  readonly valor: string | null;
  readonly comentario: string | null;
  readonly estado: boolean;
}

/** Elemento de GET /api/modulos. imagen es el nombre de un Material Symbol, o null. */
export interface Modulo {
  readonly id: number;
  readonly nombre: string;
  readonly url: string;
  readonly imagen: string | null;
  readonly estado: boolean;
  readonly permisos: readonly Permiso[];
}

/** POST /api/modulos y PUT /api/modulos/{id}. */
export interface ModuloPayload {
  nombre: string;
  url: string;
  imagen?: string | null;
}

/** POST /api/modulos/{id}/permisos y PUT /api/permisos/{id}. La clave es única (si no, 422). */
export interface PermisoPayload {
  nombre: string;
  clave: string;
  valor?: string | null;
  comentario?: string | null;
}
