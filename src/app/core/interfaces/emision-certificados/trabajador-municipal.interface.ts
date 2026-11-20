/** Estado laboral y autorización administrativa independientes. No acredita firma digital. */
export interface TrabajadorMunicipal {
  id_persona_trabajador: number;
  id_persona: number;
  nombre: string;
  cargo: string | null;
  id_area: number | null;
  area: string | null;
  vigente: boolean;
  estado_laboral: string;
  disponible_asignacion: boolean;
  elegible_laboralmente: boolean;
  habilitado_firma_certificados: boolean;
  tiene_imagen_firma?: boolean;
}
