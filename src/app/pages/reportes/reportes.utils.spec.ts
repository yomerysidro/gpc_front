import { HttpErrorResponse } from '@angular/common/http';
import { crearCsv, estadoCertificado, fechasValidas, mensajeReporte } from './reportes.utils';

describe('Reportes: CSV, fechas y estados reales', () => {
  it('conserva tildes, comillas y saltos de línea con BOM y celdas escapadas', () => {
    expect(crearCsv(['Descripción'], [['Capacitación, "Morales"\nSesión']]))
      .toBe('\uFEFF"Descripción"\r\n"Capacitación, ""Morales""\nSesión"');
  });
  for (const valor of ['=SUM(A1)', '+1+1', '-2+3', '@SUM(A1)', '  =1', '\t=1', '\r+1', '\u0000=1']) {
    it('neutraliza la fórmula ' + JSON.stringify(valor), () => {
      expect(crearCsv(['Dato'], [[valor]])).toContain('"\'' + valor + '"');
    });
  }
  it('acepta extremos iguales y fechas abiertas; rechaza rango invertido', () => {
    expect(fechasValidas('2026-11-03', '2026-11-03')).toBeTrue();
    expect(fechasValidas('', '2026-11-03')).toBeTrue();
    expect(fechasValidas('2026-11-04', '2026-11-03')).toBeFalse();
  });
  it('no transforma el booleano de certificados en emitido, pendiente o anulado', () => {
    expect(estadoCertificado(true)).toBe('Activo');
    expect(estadoCertificado('0')).toBe('Inactivo');
    expect(estadoCertificado('ANULADO')).toBe('Estado no reconocido');
  });
  it('diferencia sesión vencida, autorización y errores del servidor', () => {
    expect(mensajeReporte(new HttpErrorResponse({ status: 401 }))).toContain('sesión venció');
    expect(mensajeReporte({ status: 403 })).toContain('No tienes permiso');
    expect(mensajeReporte({ status: 500 })).toContain('servidor no pudo');
  });
});
