/** Proyecciones de CertificateDocumentGenerator y CertificateDocumentController. */
export interface DocumentoGenerado {
  id_certificado_documento: number;
  id_certificado: number;
  codigo_verificacion: string;
  hash_certificado: string;
  url_verificacion: string;
  url_descarga: string;
  creado: boolean;
  modo: 'desarrollo';
  oficial: boolean;
  puede_emitir: boolean;
  puede_firmar: boolean;
}
export interface VerificacionDocumento {
  tipo_certificado?: string | null;
  actividad?: string | null;
  sesion?: string | null;
  fecha_sesion?: string | null;
  codigo_verificacion: string;
  estado_documento: string;
  estado_certificado: string;
  fecha_generacion: string;
  fecha_emision: string | null;
  registro_encontrado: boolean;
  integridad_verificada: boolean;
  vigente: boolean;
  puede_ver_documento: boolean;
  url_documento: string | null;
  vista_firmas_disponible?: boolean;
  emision_oficial_verificada: boolean;
  firma_verificada: boolean;
  motivos: readonly string[];
}
export interface ArchivoPdf { blob: Blob; nombre: string; vistaFirmas?: boolean }
