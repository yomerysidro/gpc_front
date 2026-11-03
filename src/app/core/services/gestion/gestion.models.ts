import { ApiResponse } from '../../interfaces/api/api-response.interface';

/** Contratos de gestion verificados en los controladores y ApiResponse de gpc_back. */
export interface Persona {
  id_persona: number;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string | null;
  telefono: string | null;
  direccion: string | null;
  correo: string | null;
  fecha_registro: string;
}

export interface PersonaDocumento {
  id_persona_documento: number;
  id_persona: number;
  id_tipo_documento: number;
  numero_documento: string;
  estado: string;
}

export interface PersonaTrabajador {
  id_persona_trabajador: number;
  id_persona: number;
  id_area: number;
  cargo: string;
  fecha_ingreso: string;
  fecha_fin: string | null;
  estado: boolean;
}

export interface PersonaPracticante {
  id_persona_practicante: number;
  id_persona: number;
  codigo: string;
  estado: string;
}

export interface Practica {
  id_practica: number;
  id_persona_practicante: number;
  id_institucion: number;
  id_area: number;
  carrera: string;
  fecha_inicio: string;
  fecha_fin: string | null;
  estado: string;
}

export interface PracticaSupervisor {
  id_practica_supervisor: number;
  id_practica: number;
  id_persona_trabajador: number;
  tipo_supervision: string;
  fecha_inicio: string;
  fecha_fin: string | null;
  estado: string;
}

export interface PersonaPonente {
  id_persona_ponente: number;
  id_persona: number;
  id_institucion: number | null;
  cargo: string | null;
  especialidad: string | null;
}

export interface Area { id_area: number; nombre: string }
export interface TipoDocumento { id_tipo_documento: number; nombre: string; estado: boolean }
export interface Institucion { id_institucion: number; nombre_institucion: string; pais: string; tipo: string }

export interface GestionEntidades {
  persona: Persona;
  persona_documento: PersonaDocumento;
  persona_trabajador: PersonaTrabajador;
  persona_practicante: PersonaPracticante;
  practica: Practica;
  practica_supervisor: PracticaSupervisor;
  persona_ponente: PersonaPonente;
  area: Area;
  tipo_documento: TipoDocumento;
  institucion: Institucion;
}

export type GestionEntidad = keyof GestionEntidades;
export type GestionRegistro = Partial<Record<string, string | number | boolean | null>>;
export type GestionPayload = Record<string, string | number | boolean | null>;
export type GestionRespuesta<T> = ApiResponse<T>;
export interface GestionError { status: number; mensaje: string; campos: Record<string, string[]> }

/** Lectura de catálogos para módulos consumidores; no autoriza escrituras. */
export const GESTION_PERMISOS_LECTURA_CATALOGO = ['ponentes-firmantes.ver', 'practicantes.ver'] as const;

/** null refleja la denegación explícita de config/module_permissions.php, no un permiso nuevo. */
export const GESTION_RECURSOS: Record<GestionEntidad, {
  endpoint: string; id: string; permiso: 'ponentes-firmantes' | 'practicantes' | null;
}> = {
  persona: { endpoint: 'persons', id: 'id_persona', permiso: null },
  persona_documento: { endpoint: 'person-documents', id: 'id_persona_documento', permiso: null },
  persona_trabajador: { endpoint: 'person-workers', id: 'id_persona_trabajador', permiso: 'ponentes-firmantes' },
  persona_practicante: { endpoint: 'practicing-individuals', id: 'id_persona_practicante', permiso: 'practicantes' },
  practica: { endpoint: 'practices', id: 'id_practica', permiso: 'practicantes' },
  practica_supervisor: { endpoint: 'supervisory-internships', id: 'id_practica_supervisor', permiso: 'practicantes' },
  persona_ponente: { endpoint: 'person-speakers', id: 'id_persona_ponente', permiso: 'ponentes-firmantes' },
  area: { endpoint: 'areas', id: 'id_area', permiso: null },
  tipo_documento: { endpoint: 'document-types', id: 'id_tipo_documento', permiso: null },
  institucion: { endpoint: 'institutions', id: 'id_institucion', permiso: null },
};
