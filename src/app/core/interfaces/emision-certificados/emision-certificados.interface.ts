/** Contratos de app/Data de Laravel. Las respuestas no incluyen rutas privadas ni contraseñas. */
export interface RegistroEmision {
  readonly [campo: string]: string | number | boolean | null;
}

export interface CertificadoRow extends RegistroEmision {
  id_certificado: number;
  id_persona: number;
  id_tipo_certificado: number;
  id_reconocimiento: number | null;
  id_participacion: number | null;
  id_practica: number | null;
  fecha_emision: string | null;
  estado: boolean | string;
  notificado: boolean;
  fecha_notificacion: string | null;
}
export interface TipoCertificado extends RegistroEmision {
  id_tipo_certificado: number;
  nombre_tipo: string;
  estado: string | boolean;
}
export interface Reconocimiento extends RegistroEmision {
  id_reconocimiento: number;
  id_persona_trabajador: number;
  titulo: string;
  descripcion: string;
  motivo: string;
  fecha_reconocimiento: string;
  estado: string;
}
export interface CertificadoDocumento extends RegistroEmision {
  id_certificado_documento: number;
  id_certificado: number;
  codigo_verificacion: string;
  hash_certificado: string;
  motivo_reemision: string | null;
  estado: 'GENERADO' | 'ANULADO' | 'Vigente' | 'Anulado';
  fecha_generacion: string;
}
export interface Firma extends RegistroEmision {
  id_firma: number;
  id_persona_trabajador: number;
  fecha_firma: string;
}
export interface CertificadoFirma extends RegistroEmision {
  id_certificado_firma: number;
  id_certificado_documento: number;
  id_firma: number;
  fecha_firma: string;
  orden_firma: number;
}
export interface ConsultaCertificado extends RegistroEmision {
  id_consulta_certificado: number;
  id_certificado_documento: number | null;
  dni_consulta: string | null;
  codigo_consulta: string | null;
  fecha_consulta: string;
  resultado: string;
}
export interface ActividadFirma extends RegistroEmision {
  id_actividad_firma: number;
  id_actividad: number;
  id_firma: number;
  orden_firma: number;
}

export interface EntidadesEmision {
  activity: RegistroEmision;
  'activity-session': RegistroEmision;
  'activity-speaker': RegistroEmision;
  'ativicty-type': RegistroEmision;
  participation: RegistroEmision;
  'participation-type': RegistroEmision;
  attendance: RegistroEmision;
  certificados: CertificadoRow;
  'tipos-certificado': TipoCertificado;
  reconocimientos: Reconocimiento;
  'certificados-documentos': CertificadoDocumento;
  firmas: Firma;
  'certificados-firmas': CertificadoFirma;
  'consultas-certificado': ConsultaCertificado;
  'actividades-firmas': ActividadFirma;
}
export type RecursoEmision = keyof EntidadesEmision;
export type RecursoEditable = Exclude<RecursoEmision, 'certificados-firmas' | 'consultas-certificado'>;
export type RecursoEliminable = Exclude<RecursoEditable, 'certificados-documentos'>;
export interface PayloadEmision {
  activity: RegistroEmision;
  'activity-session': RegistroEmision;
  'activity-speaker': RegistroEmision;
  'ativicty-type': RegistroEmision;
  participation: RegistroEmision;
  'participation-type': RegistroEmision;
  attendance: RegistroEmision;
  certificados: {
    id_persona: number; id_tipo_certificado: number; id_reconocimiento: number | null;
    id_participacion: number | null; id_practica: number | null; fecha_emision: string | null;
    estado: boolean; notificado: boolean; fecha_notificacion: string | null;
  };
  'tipos-certificado': { nombre_tipo: string; estado: string };
  reconocimientos: {
    id_persona_trabajador: number; titulo: string; descripcion: string; motivo: string;
    fecha_reconocimiento: string; estado: string;
  };
  'certificados-documentos': {
    id_certificado: number; codigo_verificacion: string; ruta_archivo: string;
    motivo_reemision: string | null; estado: 'GENERADO' | 'ANULADO'; fecha_generacion: string;
  };
  firmas: { id_persona_trabajador: number; ruta_archivo_pfx: string; passphrase: string; fecha_firma: string };
  'actividades-firmas': { id_actividad: number; id_firma: number; orden_firma: number };
}

/** Laravel devuelve el paginator dentro de data, a diferencia del Módulo 1. */
export interface PaginaEmision<T> {
  readonly data: readonly T[];
  readonly current_page: number;
  readonly last_page: number;
  readonly per_page: number;
  readonly total: number;
}
export type FiltrosEmision = Readonly<Record<string, string | number | boolean | null | undefined>>;
export interface OpcionRelacion { readonly id: number; readonly texto: string }

/** Campos de person-workers/list; los nombres y el area se resuelven por sus APIs de lectura. */
export interface TrabajadorEmision {
  readonly id_persona_trabajador: number;
  readonly id_persona: number;
  readonly id_area: number;
  readonly cargo: string;
  readonly estado: boolean;
}

/** Proyecciones minimas de Gestion: excluyen contacto y documentos personales. */
export interface PersonaReconocimiento {
  readonly id_persona: number;
  readonly nombres: string;
  readonly apellido_paterno: string;
  readonly apellido_materno: string | null;
}
export interface AreaReconocimiento {
  readonly id_area: number;
  readonly nombre: string;
}
