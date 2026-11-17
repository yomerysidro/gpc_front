/** Catálogo y consulta RR. HH.: certificate-human-resources-api-contract.md. */
export interface CertificadoCatalogo {
  origen?: 'sesion' | 'actividad' | 'reconocimiento' | 'practica' | 'ponente_actividad';
  modalidad_reconocimiento?: 'actividad';
  id_actividad_ponente?: number;
  id_reconocimiento?: number | null;
  id_practica?: number | null;
  titulo_reconocimiento?: string | null;
  motivo?: string | null;
  fecha_inicio_practica?: string | null;
  fecha_fin_practica?: string | null;
  id_certificado: number;
  id_certificado_documento: number | null;
  id_persona: number;
  id_participacion: number | null;
  nombre_completo: string;
  id_actividad: number | null;
  actividad: string | null;
  id_sesion: number | null;
  sesion: string | null;
  fecha_sesion: string | null;
  tipo_certificado: string;
  id_tipo_certificado?: number;
  hash_pdf_original?: string | null;
  preparado_para_entrega?: boolean;
  registro_entrega_disponible?: boolean;
  codigo_verificacion: string | null;
  hash_pdf: string | null;
  revision_pdf: string | null;
  estado: string | boolean | null;
  estado_certificado: string;
  estado_documental: string | null;
  estado_preparacion?: string | null;
  etiqueta_estado?: string | null;
  pdf_confirmado: boolean;
  disponible_rrhh?: boolean;
  emision_oficial_verificada: boolean;
  firma_verificada?: boolean;
  fecha_emision: string | null;
  responsables_administrativos?: readonly { nombre: string; cargo: string; orden_firma: number }[];
}
export interface ActividadRrhh { id_actividad: number; actividad: string; total_sesiones: number; total_certificados: number }
export interface SesionRrhh { id_sesion: number; id_actividad: number; sesion: string; fecha_sesion: string; total_certificados: number }
export interface FiltrosCatalogo {
  id_tipo_certificado?: string;
  id_reconocimiento?: string;
  id_practica?: string;
  id_actividad?: string;
  id_sesion?: string;
  id_persona?: string;
  id_certificado?: string;
  estado_certificado?: string;
  estado_preparacion?: string;
}

export function origenCatalogo(fila: Pick<CertificadoCatalogo, 'actividad' | 'sesion' | 'origen' | 'id_reconocimiento' | 'id_practica' | 'titulo_reconocimiento' | 'fecha_inicio_practica' | 'fecha_fin_practica'>): string {
  if (fila.origen === 'ponente_actividad') return [fila.actividad, 'Reconocimiento por actividad'].filter(Boolean).join(' · ');
  if (fila.origen === 'reconocimiento' || fila.id_reconocimiento) return fila.titulo_reconocimiento || 'Reconocimiento municipal';
  if (fila.origen === 'practica' || fila.id_practica) return ['Prácticas', fila.fecha_inicio_practica, fila.fecha_fin_practica].filter(Boolean).join(' · ');
  return [fila.actividad, fila.sesion].filter(Boolean).join(' · ') || 'Origen no informado';
}

export function estadoCatalogo(fila: CertificadoCatalogo): string {
  if (fila.origen === 'practica' || fila.id_practica) return estadoDocumentalPractica(fila);
  if (!fila.id_certificado_documento) return 'Sin documento';
  if (fila.emision_oficial_verificada === true && fila.firma_verificada === true) return 'Emitido';
  if (fila.firma_verificada === true) return 'Firmado';
  if (fila.pdf_confirmado === true && fila.disponible_rrhh === true) return 'Listo para entrega';
  if (fila.estado_certificado === 'PENDIENTE_FIRMA') return 'Pendiente de firma';
  if (fila.estado_certificado === 'PREPARADO') return 'Preparado';
  if (['FIRMADO', 'EMITIDO'].includes(fila.estado_certificado)) return 'Documento histórico';
  if (/listo para entrega|preparado para entrega|firmado|emitido|entregado/i.test(fila.etiqueta_estado ?? '')) return 'Documento histórico';
  return fila.etiqueta_estado || fila.estado_documental || 'Documento histórico';
}

/** Presentación compartida: existencia de PDF y confirmación administrativa son evidencias distintas. */
export interface EstadoDocumentalPractica {
  id_certificado_documento?: number | null;
  estado_certificado?: string;
  estado_flujo?: string;
  estado_documental?: string | null;
  estado_documento?: string;
  estado?: string | boolean | null;
  pdf_confirmado?: boolean;
  disponible_rrhh?: boolean;
}
export function estadoDocumentalPractica(d: EstadoDocumentalPractica): string {
  const normalizar = (valor: unknown) => String(valor ?? '').trim().toUpperCase();
  const estado = normalizar(d.estado_certificado ?? d.estado_flujo);
  if ([estado, d.estado_flujo, d.estado_documental, d.estado_documento, d.estado].some(v => normalizar(v) === 'ANULADO')) return 'Anulado';
  if (d.estado_certificado && d.estado_flujo && normalizar(d.estado_certificado) !== normalizar(d.estado_flujo)) return 'Estado documental por verificar';
  if (!Number.isSafeInteger(d.id_certificado_documento) || Number(d.id_certificado_documento) < 1) return 'Sin documento';
  if (estado === 'PREPARADO') return d.pdf_confirmado === true || d.disponible_rrhh === true
    ? 'Estado documental por verificar' : 'Pendiente de envío a Gerencia';
  if (d.pdf_confirmado === true && d.disponible_rrhh === true) return 'Certificado confirmado';
  if (estado === 'PENDIENTE_FIRMA') return 'Pendiente de firma';
  return 'Estado documental por verificar';
}
