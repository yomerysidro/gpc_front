import { BeneficiarioCertificacion, EvaluacionCertificacion } from '../../../core/interfaces/emision-certificados/certificacion-sesion.interface';

export function mismoContexto(b: BeneficiarioCertificacion, r: EvaluacionCertificacion): boolean {
  return Number(b.id_actividad) === Number(r.contexto.id_actividad)
    && (r.origen === 'sesion' ? Number(b.id_sesion) === Number(r.contexto.id_sesion)
      && (b.id_actividad_sesion == null || Number(b.id_actividad_sesion) === Number(r.contexto.id_sesion)) : b.id_sesion === null);
}
export function bloqueoEstructural(b: BeneficiarioCertificacion, r: EvaluacionCertificacion): boolean {
  return r.codigo_bloqueo_preparacion === 'ESQUEMA_PREPARACION_NO_DISPONIBLE'
    || r.origen === 'sesion' && (r.identidad_sesion_disponible === false || b.estado_generacion === 'No determinable por esquema');
}
export function estadoBeneficiario(b: BeneficiarioCertificacion, r: EvaluacionCertificacion): string {
  if (!mismoContexto(b, r)) return 'Estado no confirmado';
  if (b.id_certificado) {
    if (b.disponible_rrhh === true) return 'Listo para entrega';
    if (b.pdf_confirmado === true) return 'Revisión confirmada';
    if (b.estado_documento === 'PENDIENTE_FIRMA') return 'Enviado a Gerencia';
    if (b.estado_documento === 'PREPARADO') return 'Pendiente de envío';
    if (b.estado_generacion !== 'Emitido') return 'Certificado preparado';
  }
  if (bloqueoEstructural(b, r)) return 'Preparación no disponible';
  const identidad = r.origen !== 'sesion' || r.identidad_sesion_disponible === true;
  if (identidad && b.estado_generacion === 'Emitido' && Number(b.id_certificado) > 0 && Number(b.id_certificado_documento) > 0) return 'Emitido';
  if (identidad && r.preparacion_persistida === true && Number(b.id_preparacion) > 0) return 'Preparado';
  if (!b.id_preparacion && !b.id_certificado && b.estado_generacion === 'No generado') return 'Pendiente de generación';
  return 'Estado no informado';
}
export function motivosPreparacion(r: EvaluacionCertificacion): readonly string[] {
  return r.motivos_bloqueo_preparacion ?? r.motivos_bloqueo ?? [];
}
export function motivoEmision(b: BeneficiarioCertificacion, r: EvaluacionCertificacion): string {
  if (!mismoContexto(b, r)) return 'El contexto del beneficiario no está confirmado.';
  if (bloqueoEstructural(b, r)) return 'La preparación de certificados por sesión estará disponible cuando se complete su estructura de datos';
  if (r.origen === 'sesion' && r.finalizada === false) return 'Sesión pendiente de finalizar.';
  if (b.estado_elegibilidad !== 'Elegible') return 'Beneficiario pendiente de validación.';
  if (r.tipo_certificado_compatible !== true) return 'Tipo de certificado incompatible o pendiente de confirmación.';
  if (r.puede_preparar !== true) return motivosPreparacion(r).join(' ') || 'Laravel no permite preparar este certificado.';
  if (r.puede_emitir !== true || r.puede_generar_pdf !== true) return r.motivos_bloqueo_emision?.join(' ') || 'Emisión oficial pendiente.';
  // El contrato vigente no expone una operación de emisión independiente por sesión.
  // Las capacidades no autorizan a sustituirla por el generador global de participación.
  return 'La API actual no ofrece una operación de emisión independiente para este origen.';
}
