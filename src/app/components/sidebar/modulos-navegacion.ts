import { NavigationItem } from '../../core/interfaces/navigation/navigation-item.interface';

/** Organización visual. Las capacidades son las que ya exigen las rutas y CRUD. */
export interface EntradaSidebar {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  readonly habilitado: boolean;
  readonly path?: string;
  readonly queryParams?: Readonly<Record<string, string>>;
  readonly parametrosPredeterminados?: Readonly<Record<string, string>>;
  readonly permiso?: string;
  readonly requiere?: readonly string[];
  readonly aliases?: readonly string[];
  readonly rutasActivas?: readonly string[];
  readonly pendiente?: string;
  readonly rutaPreliminar?: string;
  readonly descripcionPreliminar?: string;
}
export interface GrupoSidebar {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  readonly hijos: readonly EntradaSidebar[];
}
export interface EntradaSidebarVisible extends EntradaSidebar {
  readonly path: string;
  readonly backend?: NavigationItem;
  readonly preliminar?: boolean;
}
export interface GrupoSidebarVisible extends Omit<GrupoSidebar, 'hijos'> {
  readonly hijos: readonly EntradaSidebarVisible[];
}

export const DASHBOARD_SIDEBAR: EntradaSidebar = {
  id: 'dashboard', label: 'DASHBOARD', icon: 'dashboard', habilitado: true,
  path: '/inicio', permiso: 'dashboard.ver', aliases: ['/dashboard'],
};

export const SIDEBAR_CONFIG: readonly GrupoSidebar[] = [
  { id: 'seguridad', label: 'SEGURIDAD Y ACCESO', icon: 'admin_panel_settings', hijos: [
    { id: 'usuarios', label: 'Gestión de usuarios', icon: 'people', path: '/usuarios', permiso: 'usuarios.ver', habilitado: true },
    { id: 'roles', label: 'Roles y permisos', icon: 'admin_panel_settings', path: '/roles', permiso: 'roles.ver', aliases: ['/permisos', '/modulos'], habilitado: true },
  ] },
  { id: 'recursos-humanos', label: 'RECURSOS HUMANOS', icon: 'people', hijos: [
    { id: 'personas', label: 'Personas y documentos', icon: 'people', path: '/gestion/personas', permiso: 'personas.verpersonas', aliases: ['/personas'], habilitado: true },
    { id: 'trabajadores', label: 'Trabajadores', icon: 'group', path: '/gestion/trabajadores', permiso: 'ponentes-firmantes.ver', aliases: ['/trabajadores'], habilitado: true },
    { id: 'practicas', label: 'Practicantes y prácticas', icon: 'school', path: '/gestion/practicas', permiso: 'practicantes.ver', aliases: ['/practicantes', '/gestion/practicantes'], habilitado: true },
    { id: 'ponentes', label: 'Ponentes', icon: 'campaign', path: '/gestion/ponentes', permiso: 'ponentes-firmantes.ver', aliases: ['/ponentes-firmantes'], habilitado: true },
    { id: 'reconocimientos', label: 'Reconocimientos', icon: 'military_tech', path: '/certificaciones/reconocimientos', permiso: 'reconocimientos.ver', aliases: ['/reconocimientos'], habilitado: true },
  ] },
  { id: 'solicitudes', label: 'SOLICITUDES', icon: 'forward_to_inbox', hijos: [
    { id: 'solicitud-nueva', label: 'Nueva solicitud de actividad', icon: 'add', habilitado: false, rutaPreliminar: '/solicitudes/nueva', descripcionPreliminar: 'Permitirá registrar una propuesta de actividad para su evaluación institucional.', pendiente: 'El registro de solicitudes está pendiente de integración.' },
    { id: 'mis-solicitudes', label: 'Mis solicitudes', icon: 'event', habilitado: false, rutaPreliminar: '/solicitudes/mis-solicitudes', descripcionPreliminar: 'Permitirá consultar el estado y seguimiento de las solicitudes presentadas.', pendiente: 'La consulta de solicitudes está pendiente de integración.' },
    { id: 'revisar-solicitudes', label: 'Revisión de solicitudes', icon: 'check_circle', habilitado: false, rutaPreliminar: '/solicitudes/revision', descripcionPreliminar: 'Permitirá revisar las solicitudes de actividad y conocer su evaluación institucional.', pendiente: 'El flujo de revisión y aprobación está pendiente de integración.' },
  ] },
  { id: 'actividades', label: 'GESTIÓN DE ACTIVIDADES', icon: 'event', hijos: [
    { id: 'actividades', label: 'Actividades', icon: 'event', path: '/certificaciones/actividades', permiso: 'actividades.ver', aliases: ['/actividades'], habilitado: true },
    { id: 'participantes', label: 'Participantes', icon: 'group', path: '/certificaciones/participantes', permiso: 'participantes.ver', aliases: ['/participantes'], habilitado: true },
    { id: 'sesiones-asistencia', label: 'Sesiones y asistencia', icon: 'how_to_reg', path: '/certificaciones/sesiones-asistencia', permiso: 'actividades.ver', habilitado: true },
  ] },
  { id: 'emision', label: 'EMISIÓN DE CERTIFICADOS', icon: 'workspace_premium', hijos: [
    { id: 'preparar', label: 'Preparar certificados', icon: 'workspace_premium', path: '/certificaciones/certificados', permiso: 'emision.ver', aliases: ['/emision', '/certificados'], habilitado: true },
    { id: 'generar-emitir', label: 'Generar y emitir', icon: 'forward_to_inbox', habilitado: false, pendiente: 'No hay generación y emisión oficial de documentos en Laravel.' },
    { id: 'emitidos', label: 'Certificados emitidos', icon: 'visibility', path: '/certificaciones/certificados/documentos', rutasActivas: ['/certificaciones/certificados/:id/documentos'], permiso: 'emision.ver', habilitado: true },
    { id: 'firmas', label: 'Firmas digitales', icon: 'edit', path: '/certificaciones/firmas', permiso: 'ponentes-firmantes.ver', aliases: ['/firmas', '/ponentes-firmantes'], habilitado: true },
  ] },
  { id: 'gerencia', label: 'GERENCIA', icon: 'check_circle', hijos: [
    { id: 'pendientes-aprobacion', label: 'Pendientes de aprobación', icon: 'event', habilitado: false, pendiente: 'No hay bandeja ni permiso de aprobación.' },
    { id: 'documentos-firmar', label: 'Documentos por firmar', icon: 'edit', habilitado: false, pendiente: 'No hay bandeja personal ni operación de firma criptográfica.' },
    { id: 'historial-decisiones', label: 'Historial de decisiones', icon: 'visibility', habilitado: false, pendiente: 'No hay historial de decisiones ni permiso definido.' },
  ] },
  { id: 'reportes', label: 'REPORTES', icon: 'bar_chart', hijos: [
    { id: 'indicadores', label: 'Indicadores generales', icon: 'bar_chart', habilitado: false, pendiente: 'El módulo de menú existe; no hay pantalla ni endpoint de indicadores.' },
    { id: 'reportes-actividades', label: 'Reportes de actividades', icon: 'event', habilitado: false, pendiente: 'Sin pantalla ni endpoint de reportes de actividades.' },
    { id: 'reportes-certificados', label: 'Reportes de certificados', icon: 'workspace_premium', habilitado: false, pendiente: 'Sin pantalla ni endpoint de reportes de certificados.' },
    { id: 'reportes-asistencia', label: 'Reportes de asistencia', icon: 'how_to_reg', habilitado: false, pendiente: 'Sin pantalla ni endpoint de reportes de asistencia.' },
  ] },
  { id: 'configuracion', label: 'CONFIGURACIÓN GENERAL', icon: 'tune', hijos: [
    { id: 'areas', label: 'Áreas municipales', icon: 'group', path: '/gestion/configuracion', queryParams: { pestana: 'areas' }, parametrosPredeterminados: { pestana: 'areas' }, permiso: 'areas.ver', aliases: ['/areas'], habilitado: true },
    { id: 'instituciones', label: 'Instituciones', icon: 'people', path: '/gestion/configuracion', queryParams: { pestana: 'instituciones' }, permiso: 'instituciones.ver', aliases: ['/instituciones'], habilitado: true },
    { id: 'tipos-documento', label: 'Tipos de documento', icon: 'tune', path: '/gestion/configuracion', queryParams: { pestana: 'tipos-documento' }, permiso: 'tipos-documento.ver', aliases: ['/documentos', '/tipos-documento'], habilitado: true },
    { id: 'tipos-actividad', label: 'Tipos de actividad', icon: 'event', path: '/certificaciones/configuracion/tipos-actividad', permiso: 'actividades.ver', habilitado: true },
    { id: 'tipos-participacion', label: 'Tipos de participación', icon: 'group', path: '/certificaciones/configuracion/tipos-participacion', permiso: 'participantes.ver', habilitado: true },
    { id: 'tipos-certificado', label: 'Tipos de certificado', icon: 'workspace_premium', path: '/certificaciones/configuracion', permiso: 'emision.ver', habilitado: true },
  ] },
];

/** Un menú recibido es metadato; nunca sustituye las capacidades efectivas. */
export function resolverEntradaSidebar(
  entrada: EntradaSidebar, tienePermiso: (clave: string) => boolean, items: readonly NavigationItem[],
  consultarPendientes = false,
): EntradaSidebarVisible | null {
  if (!entrada.habilitado && entrada.pendiente && consultarPendientes) {
    return { ...entrada, path: rutaPantallaPendiente(entrada), preliminar: true };
  }
  const path = entrada.path;
  if (!entrada.habilitado || !path || !entrada.permiso || !tienePermiso(entrada.permiso)
    || entrada.requiere?.some(permiso => !tienePermiso(permiso))) return null;
  const rutas = [path, ...(entrada.aliases ?? [])];
  const backend = items.find(item => rutas.includes(item.path.split('?')[0].replace(/\/$/, '') || '/'));
  return { ...entrada, path, backend };
}

export function rutaPantallaPendiente(entrada: EntradaSidebar): string {
  return entrada.rutaPreliminar ?? `/pendientes/${entrada.id}`;
}

export function resolverGruposSidebar(tienePermiso: (clave: string) => boolean, items: readonly NavigationItem[], consultarPendientes = false): readonly GrupoSidebarVisible[] {
  return SIDEBAR_CONFIG.map(grupo => ({
    ...grupo,
    hijos: grupo.hijos.flatMap(entrada => {
      const resuelta = resolverEntradaSidebar(entrada, tienePermiso, items, consultarPendientes);
      return resuelta ? [resuelta] : [];
    }),
  })).filter(grupo => grupo.hijos.length > 0);
}
