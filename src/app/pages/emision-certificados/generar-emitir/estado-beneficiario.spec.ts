import { BeneficiarioCertificacion, EvaluacionCertificacion } from '../../../core/interfaces/emision-certificados/certificacion-sesion.interface';
import { estadoBeneficiario, motivoEmision } from './estado-beneficiario';

describe('Estados de beneficiarios según evidencia de Laravel', () => {
  const b = { id_actividad: 7, id_sesion: 15, id_actividad_sesion: 15, id_participacion: 30, estado_elegibilidad: 'Elegible',
    estado_generacion: 'No generado', id_preparacion: null, id_certificado: null } as BeneficiarioCertificacion;
  const r = { origen: 'sesion', contexto: { id_actividad: 7, id_sesion: 15 }, tipo_certificado_compatible: true,
    puede_preparar: true, puede_generar_pdf: false, puede_emitir: false, motivos_bloqueo: [], identidad_sesion_disponible: true } as unknown as EvaluacionCertificacion;
  it('distingue una ausencia determinable de un bloqueo estructural', () => {
    expect(estadoBeneficiario(b, r)).toBe('Pendiente de generación');
    expect(estadoBeneficiario(b, { ...r, identidad_sesion_disponible: false })).toBe('Preparación no disponible');
    expect(estadoBeneficiario({ ...b, estado_generacion: 'No determinable por esquema' }, r)).toBe('Preparación no disponible');
  });
  it('exige persistencia confirmada y no convierte elegibilidad ni certificados de participación en emisión', () => {
    expect(estadoBeneficiario({ ...b, id_preparacion: 31 }, r)).not.toBe('Preparado');
    expect(estadoBeneficiario({ ...b, id_preparacion: 31 }, { ...r, preparacion_persistida: true })).toBe('Preparado');
    expect(estadoBeneficiario({ ...b, id_certificado: 9 }, r)).not.toBe('Emitido');
    expect(estadoBeneficiario({ ...b, id_certificado: 9, id_certificado_documento: 11, estado_generacion: 'Emitido' }, r)).toBe('Emitido');
    expect(estadoBeneficiario({ ...b, id_sesion: 99, id_preparacion: 31 }, { ...r, preparacion_persistida: true })).toBe('Estado no confirmado');
  });
  it('el permiso preliminar de preparación no habilita emisión por sesión', () => {
    expect(motivoEmision(b, r)).toBe('Emisión oficial pendiente.');
    expect(motivoEmision(b, { ...r, identidad_sesion_disponible: false })).toContain('estructura de datos');
    expect(motivoEmision(b, { ...r, puede_generar_pdf: true, puede_emitir: true })).toContain('API actual');
  });
  it('no anuncia entrega cuando la disponibilidad persistida está denegada', () => {
    expect(estadoBeneficiario({ ...b, id_certificado: 9, estado_preparacion: 'PREPARADO_ENTREGA', disponible_rrhh: false }, r)).not.toBe('Listo para entrega');
  });
});
