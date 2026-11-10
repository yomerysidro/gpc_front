import { PaginaEmision } from './emision-certificados.interface';

export type OrigenCertificacion = 'sesion' | 'actividad';
export interface ContadoresSesion {
 inscritos_actividad_total: number; inscritos_actividad_vigentes: number; participantes_sesion: number;
 presentes: number; ausentes: number; pendientes: number; por_regularizar: number | null;
}
export interface SesionCertificacion {
 finalizada?: boolean; contadores?: ContadoresSesion; puede_editar_asistencia?: boolean;
  id_actividad_sesion: number; id_actividad: number; nombre: string; estado: string;
  puede_finalizarse: boolean; motivos_bloqueo_finalizacion: readonly string[];
  puede_certificarse: boolean; motivos_bloqueo_certificacion: readonly string[];
}
export interface PendienteCertificacion {
  id_actividad: number; nombre_actividad: string; estado_actividad: string;
  id_area: number; area_municipal: string; id_sesion: number | null;
  nombre_sesion?: string; estado_sesion?: string; origen: OrigenCertificacion;
  tipos_certificado_permitidos: readonly number[];
  tipo_certificado_compatible?: boolean | null;
  total_participantes_inscritos: number; total_elegibles: number; total_no_elegibles: number; total_pendientes: number;
  estado_preparacion: string; puede_certificarse: boolean;
  certificados_registrados_participaciones: number;
  certificados_atribuidos_sesion: number | null; certificados_emitidos_verificados: number | null;
  motivos_bloqueo: readonly string[];
}
export interface CertificadoParticipacion {
  id_certificado: number; id_participacion: number; id_tipo_certificado: number; estado: string; fecha_emision: string | null;
}
export interface BeneficiarioCertificacion {
  id_participacion: number; id_persona: number; nombre_completo: string; id_actividad: number; id_sesion: number | null;
  id_actividad_sesion?: number | null;
  estado_asistencia?: string | null; documento_identidad?: string; id_preparacion?: number | null;
  estado_preparacion?: string | null; estado_generacion?: string;
  id_certificado?: number | null; id_certificado_documento?: number | null; estado_documento?: string | null;
  estado_inscripcion: string; id_tipo_certificado: number | null;
  estado_elegibilidad: 'Elegible' | 'No elegible' | 'Pendiente de validación'; motivos: readonly string[];
  certificados_registrados_participacion: readonly CertificadoParticipacion[]; certificado_sesion: null;
}
export interface EvaluacionCertificacion {
  origen: OrigenCertificacion;
  contadores?: ContadoresSesion;
  finalizada?: boolean | null;
  tipo_certificado_compatible?: boolean | null;
  contexto: { id_actividad: number; nombre_actividad: string; estado_actividad: string; id_sesion?: number; nombre_sesion?: string; estado_sesion?: string };
  beneficiarios: PaginaEmision<BeneficiarioCertificacion>;
  puede_preparar: boolean; puede_emitir: boolean; puede_firmar: boolean;
  puede_generar_pdf?: boolean; identidad_sesion_disponible?: boolean; preparacion_persistida?: boolean;
  codigo_bloqueo_preparacion?: string | null;
  motivos_bloqueo_preparacion?: readonly string[]; motivos_bloqueo_emision?: readonly string[];
  puede_finalizarse?: boolean; motivos_bloqueo_finalizacion?: readonly string[]; motivos_bloqueo: readonly string[];
}
export interface FinalizacionSesion {
  finalizada: boolean; sesion: Pick<SesionCertificacion, 'id_actividad_sesion' | 'id_actividad' | 'nombre' | 'estado'>; estado_actividad?: string; motivos_bloqueo: readonly string[];
}
