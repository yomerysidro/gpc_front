import { CertificadoRow } from './emision-certificados.interface';
export type DatosPreparacion = Pick<CertificadoRow, 'id_persona' | 'id_tipo_certificado' | 'id_reconocimiento' | 'id_participacion' | 'id_practica' | 'fecha_emision' | 'estado' | 'notificado' | 'fecha_notificacion'>;
/** Selección administrativa recuperada de Laravel; no representa un documento emitido. */
export interface SeleccionCertificado {
  readonly registro: CertificadoRow | (DatosPreparacion & { readonly id_certificado: null });
  readonly beneficiario: string;
  readonly tipo: string;
  readonly dni: string | null;
}
