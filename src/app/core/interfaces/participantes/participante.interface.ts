export interface InscripcionPayload {
  id_persona: number;
  id_actividad: number;
  id_tipo_participacion: number;
  id_actividad_sesion?: number;
  fecha_inscripcion: string;
  estado: string;
}

export interface Inscripcion extends InscripcionPayload { id_participacion: number; }
export interface PersonaInscripcion {
  id_persona: number;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string | null;
}
export interface DocumentoInscripcion { id_persona: number; numero_documento: string; }
export interface ActividadInscripcion { id_actividad: number; nombre: string; }
export interface TipoInscripcion { id_tipo_participacion: number; nombre: string; estado: boolean; }
export interface FiltrosInscripcion { busqueda: string; actividad: string; tipo: string; estado: string; }
