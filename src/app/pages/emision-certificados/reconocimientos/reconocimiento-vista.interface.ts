import { CertificadoDocumento, CertificadoRow } from '../../../core/interfaces/emision-certificados/emision-certificados.interface';

/** Estado de presentacion, separado de los estados de negocio devueltos por Laravel. */
export type RelacionReconocimiento<T> =
  | { readonly estado: 'cargando' }
  | { readonly estado: 'disponible'; readonly datos: T }
  | { readonly estado: 'sin-permiso' | 'no-encontrado' | 'error'; readonly mensaje: string };

export interface CertificadoReconocimientoVista {
  readonly certificado: CertificadoRow;
  readonly documentos: RelacionReconocimiento<readonly CertificadoDocumento[]>;
}
