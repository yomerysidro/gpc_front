/**
 * Contrato inicial basado en los campos y tipos proporcionados para CERTIFICADO.
 * Pendiente de contrastar con la serialización real del backend Laravel:
 * este checkout no contiene todavía su migración, modelo ni recurso de API.
 * Las fechas son cadenas sin asumir formato; estado no presupone valores.
 */
export interface CertificadoRow {
  id_certificado: number;
  id_persona: number;
  id_tipo_certificado: number;
  id_reconocimiento: number | null;
  id_participacion: number | null;
  id_practica: number | null;
  fecha_emision: string;
  estado: string;
  notificado: boolean;
  fecha_notificacion: string | null;
}
