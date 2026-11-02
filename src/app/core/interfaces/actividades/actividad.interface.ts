/** Campos devueltos por ActivityData, sin transformar los identificadores de Laravel. */
export interface ActividadPayload {
  readonly id_area: number;
  readonly id_tipo_actividad: number;
  readonly nombre: string;
  readonly descripcion: string | null;
  readonly fecha_inicio: string;
  readonly fecha_fin: string;
  readonly sede: string | null;
  readonly estado: string;
}

export interface Actividad extends ActividadPayload {
  readonly id_actividad: number;
}

export interface AreaActividad {
  readonly id_area: number;
  readonly nombre: string;
}

export interface TipoActividad {
  readonly id_tipo_actividad: number;
  readonly nombre: string;
  readonly descripcion: string | null;
  readonly estado: boolean;
}

export interface ActividadPonente {
  readonly id_actividad_ponente: number;
  readonly id_actividad: number;
  readonly id_persona_ponente: number;
}

export interface PersonaPonenteActividad {
  readonly id_persona_ponente: number;
  readonly id_persona: number;
}

export interface PersonaActividad {
  readonly id_persona: number;
  readonly nombres: string;
  readonly apellido_paterno: string;
  readonly apellido_materno: string | null;
}

/** Un nombre no disponible no se sustituye por datos ficticios. */
export interface PonenteAsignado extends ActividadPonente {
  readonly nombre: string | null;
  readonly errorNombre: string | null;
}

export interface FiltrosActividad {
  readonly nombre: string;
  readonly area: string;
  readonly tipo: string;
  readonly estado: string;
}
