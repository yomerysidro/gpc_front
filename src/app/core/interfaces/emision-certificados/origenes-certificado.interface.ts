import { TipoCertificado } from './emision-certificados.interface';

export type OrigenDocumental = 'reconocimiento' | 'practica';
/** Orígenes documentales cuyo beneficiario es un ponente registrado en el catálogo real. */
export type OrigenPonente = 'ponente_actividad' | 'ponente_sesion';
export type ModalidadReconocimiento = 'actividad' | 'sesion';

interface EvaluacionPonenteBase {
  id_origen: number;
  id_actividad_ponente?: number;
  id_actividad?: number;
  actividad?: string;
  id_persona?: number;
  id_area?: number;
  id_persona_ponente?: number;
  id_tipo_certificado?: number;
  tipo_certificado?: string;
  nombres?: string;
  apellido_paterno?: string | null;
  apellido_materno?: string | null;
  datos_origen?: { titulo: string; fecha_inicio_actividad: string; fecha_fin_actividad: string; estado_actividad: string };
  /** Nombre y fecha de la sesión acreditada; solo la modalidad por sesión los devuelve. */
  sesion?: string;
  fecha_sesion?: string | null;
  estado_elegibilidad: 'Elegible' | 'Pendiente de validación';
  puede_preparar: boolean;
  puede_generar_pdf: boolean;
  puede_emitir: boolean;
  puede_consultar_certificado_existente?: boolean;
  certificados_existentes?: EvaluacionOrigen['certificados_existentes'];
  motivos_bloqueo: readonly string[];
}
export interface EvaluacionPonenteActividad extends EvaluacionPonenteBase {
  origen: 'ponente_actividad'; modalidad_reconocimiento: 'actividad'; id_sesion: null;
}
export interface EvaluacionPonenteSesion extends EvaluacionPonenteBase {
  origen: 'ponente_sesion'; modalidad_reconocimiento: 'sesion'; id_sesion: number;
}
export type EvaluacionPonente = EvaluacionPonenteActividad | EvaluacionPonenteSesion;
export type EvaluacionDocumental = EvaluacionOrigen | EvaluacionPonente;
export interface PonenteReconocimiento {
  id_actividad_ponente: number; id_actividad: number; id_persona: number; id_persona_ponente: number;
  nombres: string; apellido_paterno: string | null; apellido_materno: string | null;
  reconocimiento: EvaluacionPonenteActividad;
}
export interface PonentesActividadCertificacion {
  modalidad_reconocimiento: 'actividad'; id_actividad: number; id_sesion: null; ponentes: readonly PonenteReconocimiento[];
}
/** Fila de ponente vinculada a una sesión real mediante certificado.actividad_ponente.id_actividad_sesion. */
export interface PonenteSesion {
  id_actividad_ponente: number; id_actividad: number; id_persona: number; id_persona_ponente: number;
  nombres: string; apellido_paterno: string | null; apellido_materno: string | null;
  cargo: string | null; institucion: string | null;
  reconocimiento: EvaluacionPonenteSesion;
}
export interface PonenteActividadCertificacion {
  id_actividad_ponente: number; id_actividad: number; nombres: string;
  apellido_paterno: string | null; apellido_materno: string | null; cargo: string | null; institucion: string | null;
  id_persona?: number; id_persona_ponente?: number; reconocimiento_por_actividad?: EvaluacionPonenteActividad;
}
export interface PonentesCertificacion {
  origen?: 'ponente' | 'ponente_sesion';
  id_actividad: number; id_sesion: number;
  ponentes_actividad: readonly PonenteActividadCertificacion[];
  /** Null si el servidor no puede acreditar las asignaciones de la sesión. */
  ponentes_sesion: readonly PonenteSesion[] | null;
  relacion_ponente_sesion_disponible: boolean; puede_preparar: boolean;
  puede_generar_pdf?: boolean; puede_emitir?: boolean;
  motivos_bloqueo: readonly string[];
}
/** Vínculo persistido de una persona ponente con una sesión concreta. */
export interface VinculoPonenteSesion {
  id_actividad_ponente: number; id_actividad: number; id_actividad_sesion: number | null; id_persona_ponente: number;
  id_persona?: number; nombres?: string; apellido_paterno?: string | null; apellido_materno?: string | null;
  estado_asistencia?: EstadoAsistenciaPonente | null;
}
export type EstadoAsistenciaPonente = 'PRESENTE' | 'AUSENTE';
/** Contrato de GET /activity/{actividad}/sessions/{sesion}/ponentes. */
export interface PonentesSesionGestion {
  id_actividad: number; id_sesion: number;
  ponentes_disponibles: readonly {
    id_persona_ponente: number; id_persona: number; nombres: string;
    apellido_paterno: string | null; apellido_materno: string | null;
  }[];
  vinculos: readonly VinculoPonenteSesion[];
}
export interface DatosOrigen {
  nombres: string; apellido_paterno: string | null; apellido_materno: string | null;
  estado: string; titulo?: string; motivo?: string; descripcion?: string | null;
  fecha_reconocimiento?: string; fecha_inicio?: string; fecha_fin?: string | null;
  area?: string; institucion?: string; carrera?: string;
}
export interface EvaluacionOrigen {
  mensaje_predeterminado?: string;
  mensaje?: string | null;
  texto_editable?: boolean;
  modalidad_reconocimiento?: 'individual' | 'actividad' | 'sesion';
  contexto_origen_real?: { origen: 'reconocimiento' | OrigenPonente; id_origen: number; id_actividad: number | null; id_sesion: number | null; id_actividad_ponente: number | null };
  documento_existente?: DocumentoOrigenAdministrativo | null;
  documentos_existentes?: readonly DocumentoOrigenAdministrativo[];
  puede_consultar_documento_original?: boolean;
  motivo_documento?: string | null;
  origen: OrigenDocumental; id_origen: number; id_persona: number; id_area: number;
  id_actividad: null; id_sesion: null; id_tipo_certificado: number | null; tipo_certificado: string | null;
  reconocimiento?: DatosOrigen; practica?: DatosOrigen;
  estado_elegibilidad: 'Elegible' | 'Pendiente de validación';
  puede_preparar: boolean; puede_generar_pdf: boolean; puede_emitir: boolean;
  puede_consultar_certificado_existente: boolean; motivos_bloqueo: readonly string[];
  certificados_existentes: readonly {
    id_certificado: number; id_tipo_certificado: number; id_persona: number;
    id_reconocimiento: number | null; id_practica: number | null; estado: string;
    id_certificado_documento?: number | null;
  }[];
  periodo_transcurrido_valido?: boolean; cumplimiento_requisitos_acreditado?: boolean | null;
  aprobacion_acreditada?: boolean | null; requiere_asistencia_capacitacion?: false;
}
export interface DocumentoOrigenAdministrativo {
  origen: 'reconocimiento' | OrigenPonente;
  id_origen: number;
  id_reconocimiento: number;
  modalidad_reconocimiento: 'individual' | 'actividad' | 'sesion';
  id_certificado: number;
  id_certificado_documento: number;
  id_actividad: number | null;
  id_sesion: number | null;
  id_actividad_ponente: number | null;
  beneficiario: { id_persona: number; nombre: string };
  estado_certificado: string;
  estado_documento: string;
  url_documento: string | null;
  puede_visualizar?: boolean;
  puede_descargar?: boolean;
  motivo_documento?: string | null;
  facultades: { ver: boolean; visualizar?: boolean; descargar: boolean };
}

/** La evaluación anida este acceso en documento_existente; el detalle lo devuelve en su raíz. */
interface AccesoDocumentoAdministrativo {
  id_certificado_documento: number;
  url_documento?: string | null;
  puede_visualizar?: boolean;
  puede_descargar?: boolean;
  facultades?: { ver?: boolean; visualizar?: boolean; descargar?: boolean };
}
export function puedeVerDocumentoAdministrativo(d: AccesoDocumentoAdministrativo | null | undefined): boolean {
  return !!d && Number.isSafeInteger(d.id_certificado_documento) && d.id_certificado_documento > 0
    && typeof d.url_documento === 'string' && !!d.url_documento.trim() && d.facultades?.ver === true
    && d.facultades.visualizar !== false && d.puede_visualizar !== false;
}
export function puedeDescargarDocumentoAdministrativo(d: AccesoDocumentoAdministrativo | null | undefined): boolean {
  return puedeVerDocumentoAdministrativo(d) && d?.facultades?.descargar === true && d.puede_descargar !== false;
}
export interface EvaluacionPractica extends EvaluacionOrigen {
  origen: 'practica'; finalizacion_registrada: boolean; situacion_constancia: string; practica: DatosOrigen;
  mensaje_predeterminado?: string;
  mensaje?: string | null;
  texto_editable?: boolean;
  mensaje_estructurado_disponible?: boolean;
  /** Registro informativo del backend; no constituye una validación local de elegibilidad. */
  supervisores?: readonly {
    id_practica_supervisor: number;
    nombres: string;
    apellido_paterno: string | null;
    apellido_materno: string | null;
    tipo_supervision: string | null;
    fecha_inicio: string | null;
    fecha_fin: string | null;
    estado: string;
  }[];
}
export interface CatalogosOrigenes {
  tipos_actividad: readonly { id_tipo_actividad: number; nombre: string; estado: boolean }[];
  tipos_certificado: readonly TipoCertificado[];
  relacion_tipo_actividad_certificado: null; motivo_relacion: string;
}
