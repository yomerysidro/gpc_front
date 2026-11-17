import { Modulo, Permiso } from '../../core/interfaces/roles/modulo.interface';
import { RolPermisoAsignado } from '../../core/interfaces/roles/rol.interface';

/**
 * Matriz de accesos de un rol: qué módulos tiene y qué permisos dentro de ellos.
 * Funciones puras sobre un estado inmutable; la pantalla solo las compone.
 *
 * Reglas:
 * - Marcar un permiso de un módulo sin acceso concede el acceso al módulo.
 * - Marcar crear, editar o eliminar marca también ver: sin ver no tienen sentido.
 * - Desmarcar ver desmarca crear, editar y eliminar del mismo módulo.
 * - Quitar el acceso a un módulo desmarca todos sus permisos (el backend hace lo mismo).
 */

export const ACCIONES_BASICAS = ['ver', 'crear', 'editar', 'eliminar'] as const;
export type AccionBasica = typeof ACCIONES_BASICAS[number];

const DEPENDEN_DE_VER: readonly string[] = ['crear', 'editar', 'eliminar'];

export interface EstadoAccesos {
  readonly modulos: ReadonlySet<number>;
  /** Ids de permiso: son únicos en todo el catálogo. */
  readonly permisos: ReadonlySet<number>;
}

/** Fila de la matriz: un módulo con sus permisos básicos en columnas fijas y el resto aparte. */
export interface FilaMatriz {
  readonly modulo: Modulo;
  readonly basicos: Readonly<Record<AccionBasica, Permiso | null>>;
  readonly otros: readonly Permiso[];
}

/** Acción de un permiso según su clave: "reportes.ver" → "ver". */
export function accionDe(permiso: Pick<Permiso, 'clave'>): string {
  return permiso.clave.slice(permiso.clave.lastIndexOf('.') + 1);
}

export function filasDeMatriz(modulos: readonly Modulo[]): FilaMatriz[] {
  return modulos.map(modulo => {
    const basicos = { ver: null, crear: null, editar: null, eliminar: null } as Record<AccionBasica, Permiso | null>;
    const otros: Permiso[] = [];

    for (const permiso of modulo.permisos) {
      const accion = accionDe(permiso);

      if ((ACCIONES_BASICAS as readonly string[]).includes(accion) && !basicos[accion as AccionBasica]) {
        basicos[accion as AccionBasica] = permiso;
      } else {
        otros.push(permiso);
      }
    }

    return { modulo, basicos, otros: otros.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')) };
  });
}

export function crearEstado(modulos: readonly number[], permisos: readonly RolPermisoAsignado[]): EstadoAccesos {
  return { modulos: new Set(modulos), permisos: new Set(permisos.map(permiso => permiso.idPermiso)) };
}

export function cambiarAccesoModulo(estado: EstadoAccesos, modulo: Modulo, activo: boolean): EstadoAccesos {
  const modulos = new Set(estado.modulos);
  const permisos = new Set(estado.permisos);

  if (activo) {
    modulos.add(modulo.id);
  } else {
    modulos.delete(modulo.id);
    modulo.permisos.forEach(permiso => permisos.delete(permiso.id));
  }

  return { modulos, permisos };
}

export function cambiarPermiso(estado: EstadoAccesos, modulo: Modulo, permiso: Permiso, marcado: boolean): EstadoAccesos {
  const modulos = new Set(estado.modulos);
  const permisos = new Set(estado.permisos);
  const accion = accionDe(permiso);
  const deAccion = (nombre: string) => modulo.permisos.filter(p => accionDe(p) === nombre);

  if (marcado) {
    permisos.add(permiso.id);
    modulos.add(modulo.id);

    if (DEPENDEN_DE_VER.includes(accion)) {
      deAccion('ver').forEach(ver => permisos.add(ver.id));
    }
  } else {
    permisos.delete(permiso.id);

    if (accion === 'ver') {
      DEPENDEN_DE_VER.flatMap(deAccion).forEach(dependiente => permisos.delete(dependiente.id));
    }
  }

  return { modulos, permisos };
}

export function mismoEstado(a: EstadoAccesos, b: EstadoAccesos): boolean {
  const igual = (x: ReadonlySet<number>, y: ReadonlySet<number>) => x.size === y.size && [...x].every(id => y.has(id));
  return igual(a.modulos, b.modulos) && igual(a.permisos, b.permisos);
}

/**
 * Cuerpos de los dos PUT. Solo envía permisos del catálogo cuyo módulo queda asignado:
 * el backend rechaza (422) un permiso de un módulo sin acceso.
 */
export function aPayload(estado: EstadoAccesos, catalogo: readonly Modulo[]): { modulos: number[]; permisos: RolPermisoAsignado[] } {
  const modulos = [...estado.modulos].sort((a, b) => a - b);
  const permisos = catalogo
    .filter(modulo => estado.modulos.has(modulo.id))
    .flatMap(modulo => modulo.permisos
      .filter(permiso => estado.permisos.has(permiso.id))
      .map(permiso => ({ idModulo: modulo.id, idPermiso: permiso.id })));

  return { modulos, permisos };
}
