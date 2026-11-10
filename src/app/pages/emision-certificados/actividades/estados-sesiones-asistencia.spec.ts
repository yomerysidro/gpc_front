import { resultadoPresencia, resumenPresencia } from './estados-sesiones-asistencia';

describe('Presencia independiente de inscripción y horas', () => {
  it('reconoce únicamente los estados explícitos y no convierte horas o Activo en presencia', () => {
    expect(resultadoPresencia({ id_asistencia: 1, estado: 'PRESENTE' })).toBe('presente');
    expect(resultadoPresencia({ id_asistencia: 2, estado: 'Ausente', hora_entrada: '08:00' })).toBe('ausente');
    expect(resultadoPresencia({ id_asistencia: 3, estado: 'activo', hora_entrada: '08:00', hora_salida: '09:00' })).toBe('sin_clasificar');
    expect(resultadoPresencia({ id_participacion: 10, estado: 'Activo' })).toBe('pendiente');
    expect(resultadoPresencia({ id_asistencia: 4, estado: 'nn' })).toBe('sin_clasificar');
  });

  it('cuenta pendientes separados de ausentes y deja los duplicados para revisión', () => {
    const resumen = resumenPresencia([
      { id_asistencia: 1, estado: 'presente' }, { id_asistencia: 2, estado: 'ausente' },
      { id_participacion: 10 }, { id_asistencia: 3, estado: 'activo' },
      { id_asistencia: 4, estado: 'PRESENTE', duplicada: true },
    ]);
    expect(resumen).toEqual({ inscritos: 5, presentes: 1, ausentes: 1, pendientes: 1, porRevisar: 2 });
    expect(resumen.presentes + resumen.ausentes + resumen.pendientes + resumen.porRevisar).toBe(resumen.inscritos);
  });
});
