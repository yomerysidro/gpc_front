/** Rutas y títulos de las pantallas preparadas para los módulos 2 y 3. */
export const MODULOS_NAVEGACION = [
  {
    path: 'gestion', label: 'GESTIÓN', icon: 'people',
    opciones: [
      { path: 'personas', label: 'Personas', icon: 'people' },
      { path: 'trabajadores', label: 'Trabajadores', icon: 'group' },
      { path: 'practicas', label: 'Prácticas', icon: 'school' },
      { path: 'ponentes', label: 'Ponentes', icon: 'campaign' },
      { path: 'configuracion', label: 'Configuración', icon: 'tune' },
    ],
  },
  {
    path: 'certificaciones', label: 'CERTIFICACIONES', icon: 'workspace_premium',
    opciones: [
      { path: 'actividades', label: 'Actividades', icon: 'event' },
      { path: 'participantes', label: 'Participantes', icon: 'group' },
      { path: 'sesiones-asistencia', label: 'Sesiones y asistencia', icon: 'how_to_reg' },
      { path: 'certificados', label: 'Certificados', icon: 'workspace_premium' },
      { path: 'firmas', label: 'Firmas', icon: 'edit' },
      { path: 'verificacion', label: 'Verificación', icon: 'check_circle' },
      { path: 'configuracion', label: 'Configuración', icon: 'tune' },
    ],
  },
] as const;
