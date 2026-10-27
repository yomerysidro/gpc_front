import {
  accionDeClave,
  accionDesdeNombre,
  componerClave,
  PATRON_ACCION_PERMISO,
  PATRON_URL_MODULO,
  slugModulo,
} from './clave-permiso.model';

describe('Clave de permiso', () => {
  it('compone la clave con el slug fijo del módulo y la acción', () => {
    expect(slugModulo('/ponentes-firmantes')).toBe('ponentes-firmantes');
    expect(componerClave('/reportes', 'exportar')).toBe('reportes.exportar');
    expect(componerClave('/ponentes-firmantes', 'ver')).toBe('ponentes-firmantes.ver');
  });

  it('separa la acción de una clave existente', () => {
    expect(accionDeClave('/reportes', 'reportes.exportar')).toBe('exportar');
    expect(accionDeClave('/ponentes-firmantes', 'ponentes-firmantes.editar')).toBe('editar');
    expect(accionDeClave('/reportes', 'otro.ver')).toBe('ver');
  });

  it('sugiere la acción desde el nombre', () => {
    expect(accionDesdeNombre('Exportar reportes')).toBe('exportar');
    expect(accionDesdeNombre('  Aprobación  final')).toBe('aprobacion');
    expect(accionDesdeNombre('')).toBe('');
  });

  it('acepta acciones en minúsculas con guiones internos y rechaza lo demás', () => {
    for (const valida of ['ver', 'exportar-pdf', 'paso2']) {
      expect(PATRON_ACCION_PERMISO.test(valida)).withContext(valida).toBeTrue();
    }
    for (const invalida of ['Ver', 'mal accion', 'reportes.ver', '-ver', 'ver-', '']) {
      expect(PATRON_ACCION_PERMISO.test(invalida)).withContext(invalida).toBeFalse();
    }
  });

  it('valida la URL del módulo', () => {
    expect(PATRON_URL_MODULO.test('/ponentes-firmantes')).toBeTrue();
    expect(PATRON_URL_MODULO.test('zz')).toBeFalse();
    expect(PATRON_URL_MODULO.test('/Reportes')).toBeFalse();
    expect(PATRON_URL_MODULO.test('/a/b')).toBeFalse();
  });
});
