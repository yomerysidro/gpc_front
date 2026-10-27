import { Modulo, Permiso } from '../../core/interfaces/roles/modulo.interface';
import {
  accionDe,
  aPayload,
  cambiarAccesoModulo,
  cambiarPermiso,
  crearEstado,
  filasDeMatriz,
  mismoEstado,
} from './matriz-accesos.model';

const permiso = (id: number, idModulo: number, clave: string, nombre = clave): Permiso =>
  ({ id, idModulo, nombre, clave, valor: null, comentario: null, estado: true });

const reportes: Modulo = {
  id: 10, nombre: 'Reportes', url: '/reportes', imagen: 'bar_chart', estado: true,
  permisos: [
    permiso(37, 10, 'reportes.ver'), permiso(38, 10, 'reportes.crear'),
    permiso(39, 10, 'reportes.editar'), permiso(40, 10, 'reportes.eliminar'),
    permiso(50, 10, 'reportes.exportar', 'Exportar reportes'),
  ],
};
const usuarios: Modulo = {
  id: 1, nombre: 'Gestión de Usuarios', url: '/usuarios', imagen: 'people', estado: true,
  permisos: [permiso(1, 1, 'usuarios.ver'), permiso(3, 1, 'usuarios.editar')],
};
const [ver, crear, editar, eliminar, exportar] = reportes.permisos;

describe('Matriz de accesos', () => {
  it('reconoce la acción por la clave y separa los permisos básicos de los demás', () => {
    expect(accionDe({ clave: 'ponentes-firmantes.ver' })).toBe('ver');
    const [fila] = filasDeMatriz([reportes]);
    expect(fila.basicos.ver).toBe(ver);
    expect(fila.basicos.eliminar).toBe(eliminar);
    expect(fila.otros).toEqual([exportar]);
    expect(filasDeMatriz([usuarios])[0].basicos.crear).toBeNull();
  });

  it('marcar un permiso de un módulo sin acceso concede el acceso (auto-acceso)', () => {
    const estado = cambiarPermiso(crearEstado([], []), reportes, exportar, true);
    expect(estado.modulos.has(10)).toBeTrue();
    expect(estado.permisos.has(50)).toBeTrue();
    expect(estado.permisos.has(37)).toBeFalse();
  });

  it('marcar crear, editar o eliminar marca también ver (ver implícito)', () => {
    for (const p of [crear, editar, eliminar]) {
      const estado = cambiarPermiso(crearEstado([], []), reportes, p, true);
      expect([...estado.permisos].sort()).toEqual([37, p.id].sort());
      expect(estado.modulos.has(10)).toBeTrue();
    }
  });

  it('desmarcar ver desmarca crear, editar y eliminar, pero no los demás', () => {
    const lleno = crearEstado([10], reportes.permisos.map(p => ({ idModulo: 10, idPermiso: p.id })));
    const estado = cambiarPermiso(lleno, reportes, ver, false);
    expect([...estado.permisos]).toEqual([50]);
    expect(estado.modulos.has(10)).toBeTrue();
  });

  it('desmarcar crear no quita ver', () => {
    const estado = cambiarPermiso(crearEstado([10], [{ idModulo: 10, idPermiso: 37 }, { idModulo: 10, idPermiso: 38 }]), reportes, crear, false);
    expect([...estado.permisos]).toEqual([37]);
  });

  it('apagar el acceso a un módulo desmarca sus permisos y no toca los de otros módulos', () => {
    const inicial = crearEstado([1, 10], [{ idModulo: 1, idPermiso: 1 }, { idModulo: 10, idPermiso: 37 }, { idModulo: 10, idPermiso: 38 }]);
    const estado = cambiarAccesoModulo(inicial, reportes, false);
    expect([...estado.modulos]).toEqual([1]);
    expect([...estado.permisos]).toEqual([1]);
    expect(cambiarAccesoModulo(estado, reportes, true).permisos.size).toBe(1);
  });

  it('no muta el estado anterior', () => {
    const inicial = crearEstado([], []);
    cambiarPermiso(inicial, reportes, crear, true);
    expect(inicial.modulos.size).toBe(0);
    expect(inicial.permisos.size).toBe(0);
  });

  it('detecta cambios pendientes comparando estados', () => {
    const inicial = crearEstado([10], [{ idModulo: 10, idPermiso: 37 }]);
    const marcado = cambiarPermiso(inicial, reportes, crear, true);
    expect(mismoEstado(inicial, crearEstado([10], [{ idModulo: 10, idPermiso: 37 }]))).toBeTrue();
    expect(mismoEstado(inicial, marcado)).toBeFalse();
    expect(mismoEstado(inicial, cambiarPermiso(marcado, reportes, crear, false))).toBeTrue();
  });

  it('arma los dos PUT con módulos ordenados y solo permisos de módulos asignados', () => {
    const estado = { modulos: new Set([10, 1]), permisos: new Set([3, 37, 999]) };
    expect(aPayload(estado, [usuarios, reportes])).toEqual({
      modulos: [1, 10],
      permisos: [{ idModulo: 1, idPermiso: 3 }, { idModulo: 10, idPermiso: 37 }],
    });
    expect(aPayload({ modulos: new Set(), permisos: new Set([37]) }, [reportes]).permisos).toEqual([]);
  });
});
