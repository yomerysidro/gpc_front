/** Capacidades existentes de cada catálogo; agruparlos no concede nuevos permisos. */
export const CATALOGOS_INSTITUCIONALES = [
  { id: 'areas', etiqueta: 'Áreas municipales', permiso: 'areas.ver' },
  { id: 'tipos-documento', etiqueta: 'Tipos de documento', permiso: 'tipos-documento.ver' },
  { id: 'instituciones', etiqueta: 'Instituciones', permiso: 'instituciones.ver' },
] as const;

export const CATALOGOS_CLASIFICACIONES = [
  { id: 'tipos-actividad', etiqueta: 'Tipos de actividad', permiso: 'actividades.ver' },
  { id: 'tipos-participacion', etiqueta: 'Tipos de participación', permiso: 'participantes.ver' },
  { id: 'tipos-certificado', etiqueta: 'Tipos de certificado', permiso: 'emision.ver' },
] as const;
