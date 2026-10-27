/** Contratos de /api/roles (RoleController de gpc_back), verificados contra las respuestas reales. */

/** Elemento de GET /api/roles; usuarios es el número de cuentas con el rol. */
export interface Rol {
  readonly id: number;
  readonly nombre: string;
  readonly estado: boolean;
  readonly usuarios: number;
}

/** POST /api/roles y PUT /api/roles/{id}. El rol Administrador no se renombra (409). */
export interface RolPayload {
  nombre: string;
}

/** Elemento de GET/PUT /api/roles/{id}/permisos: un permiso concedido dentro de un módulo. */
export interface RolPermisoAsignado {
  readonly idModulo: number;
  readonly idPermiso: number;
}

/** PUT /api/roles/{id}/modulos. Quitar un módulo borra también los permisos del rol sobre él. */
export interface RolModulosPayload {
  modulos: number[];
}

/** PUT /api/roles/{id}/permisos. Cada permiso debe pertenecer a un módulo ya asignado al rol (si no, 422). */
export interface RolPermisosPayload {
  permisos: RolPermisoAsignado[];
}
