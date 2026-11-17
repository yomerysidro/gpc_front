import { NavigationItem } from '../../core/interfaces/navigation/navigation-item.interface';
import { CapacidadesSolicitudes } from '../../core/interfaces/autenticacion/auth.interface';
import { CATALOGOS_CLASIFICACIONES, CATALOGOS_INSTITUCIONALES } from './catalogos-configuracion';

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
  readonly capacidadSolicitud?: keyof CapacidadesSolicitudes;
  readonly permisos?: readonly string[];
  readonly requiere?: readonly string[];
  readonly catalogos?: readonly { readonly id: string; readonly permiso: string }[];
  readonly aliases?: readonly string[];
  readonly rutasActivas?: readonly string[];
  readonly pendiente?: string;
  readonly rutaPreliminar?: string;
  readonly descripcionPreliminar?: string;
  readonly interfazDisponible?: boolean;
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
    { id: 'usuarios', label: 'Gestión de usuarios', icon: 'group', path: '/usuarios', permiso: 'usuarios.ver', habilitado: true },
    { id: 'roles', label: 'Roles y permisos', icon: 'admin_panel_settings', path: '/roles', permiso: 'roles.ver', aliases: ['/permisos', '/modulos'], habilitado: true },
  ] },
  { id: 'recursos-humanos', label: 'RECURSOS HUMANOS', icon: 'groups', hijos: [
    { id: 'personas', label: 'Personas y documentos', icon: 'badge', path: '/gestion/personas', permiso: 'personas.verpersonas', aliases: ['/personas'], habilitado: true },
    { id: 'trabajadores', label: 'Trabajadores', icon: 'group', path: '/gestion/trabajadores', permiso: 'trabajadores.ver', aliases: ['/trabajadores'], habilitado: true },
    { id: 'practicas', label: 'Practicantes y prácticas', icon: 'school', path: '/gestion/practicas', permiso: 'practicantes.ver', aliases: ['/practicantes', '/gestion/practicantes'], habilitado: true },
    { id: 'ponentes', label: 'Ponentes', icon: 'co_present', path: '/gestion/ponentes', permiso: 'ponentes-firmantes.ver', aliases: ['/ponentes-firmantes'], habilitado: true },
    { id: 'reconocimientos', label: 'Reconocimientos', icon: 'military_tech', path: '/certificaciones/reconocimientos', permiso: 'reconocimientos.ver', aliases: ['/reconocimientos'], habilitado: true },
    { id: 'revisar-solicitudes', label: 'Revisión de solicitudes', icon: 'fact_check', habilitado: true, path: '/solicitudes/revision', permiso: 'solicitudes.consultar', capacidadSolicitud: 'consultar_revision' },
  ] },
  { id: 'solicitudes', label: 'SOLICITUDES', icon: 'inbox', hijos: [
    { id: 'mis-solicitudes', label: 'Mis solicitudes', icon: 'description', habilitado: true, path: '/solicitudes/mis-solicitudes', permiso: 'solicitudes.propias', aliases: ['/solicitudes'], rutasActivas: ['/solicitudes/nueva'] },
  ] },
  { id: 'actividades', label: 'GESTIÓN DE ACTIVIDADES', icon: 'calendar_month', hijos: [
    { id: 'actividades', label: 'Actividades', icon: 'calendar_month', path: '/certificaciones/actividades', permiso: 'actividades.ver', aliases: ['/actividades'], rutasActivas: ['/certificaciones/participantes', '/certificaciones/sesiones-asistencia'], habilitado: true },
  ] },
  { id: 'emision', label: 'EMISIÓN DE CERTIFICADOS', icon: 'workspace_premium', hijos: [
    { id: 'generar-emitir', label: 'Generar y emitir', icon: 'post_add', path: '/certificaciones/generar-emitir', permiso: 'emision.ver', aliases: ['/emision', '/certificados', '/certificaciones/certificados'], habilitado: true },
    { id: 'emitidos', label: 'Certificados emitidos', icon: 'verified', path: '/certificaciones/certificados/documentos', rutasActivas: ['/certificaciones/certificados/:id', '/certificaciones/certificados/:id/documentos'], permiso: 'emision.ver', habilitado: true },
  ] },
  { id: 'gerencia', label: 'GERENCIA', icon: 'account_balance', hijos: [
    { id: 'pendientes-aprobacion', label: 'Actividades por Aprobar', icon: 'pending_actions', habilitado: true, path: '/pendientes/pendientes-aprobacion', permiso: 'solicitudes.consultar', capacidadSolicitud: 'consultar_gerencia' },
    { id: 'documentos-firmar', label: 'Certificados por firmar', icon: 'draw', habilitado: true, path: '/pendientes/documentos-firmar', permiso: 'emision.ver' },
  ] },
  { id: 'reportes', label: 'REPORTES', icon: 'bar_chart', hijos: [
    { id: 'indicadores', label: 'Indicadores generales', icon: 'monitoring', habilitado: true, path: '/reportes/indicadores', permiso: 'reportes.ver' },
    { id: 'reportes-actividades', label: 'Reportes de actividades', icon: 'event_note', habilitado: true, path: '/reportes/actividades', permiso: 'reportes.ver' },
    { id: 'reportes-certificados', label: 'Reportes de certificados', icon: 'analytics', habilitado: true, path: '/reportes/certificados', permiso: 'reportes.ver' },
    { id: 'reportes-asistencia', label: 'Reportes de asistencia', icon: 'fact_check', habilitado: true, path: '/reportes/asistencia', permiso: 'reportes.ver' },
  ] },
  { id: 'configuracion', label: 'CONFIGURACIÓN GENERAL', icon: 'settings', hijos: [
    { id: 'firmantes-municipales', label: 'Firmantes municipales', icon: 'draw', path: '/gestion/firmantes-municipales', permiso: 'emision.ver', permisos: ['ponentes-firmantes.editar'], aliases: ['/certificaciones/firmas', '/firmas'], rutasActivas: ['/certificaciones/firmas/aplicadas'], habilitado: true },
    { id: 'gestion-institucional', label: 'Gestión institucional', icon: 'account_balance', path: '/gestion/configuracion', permiso: 'areas.ver', catalogos: CATALOGOS_INSTITUCIONALES, aliases: ['/areas', '/instituciones', '/documentos', '/tipos-documento'], habilitado: true },
    { id: 'tipos-clasificaciones', label: 'Tipos y clasificaciones', icon: 'category', path: '/gestion/tipos-clasificaciones', permiso: 'actividades.ver', catalogos: CATALOGOS_CLASIFICACIONES, aliases: ['/certificaciones/configuracion'], habilitado: true },
  ] },
];

/** Un menú recibido es metadato; nunca sustituye las capacidades efectivas. */
export function resolverEntradaSidebar(
  entrada: EntradaSidebar, tienePermiso: (clave: string) => boolean, items: readonly NavigationItem[],
  consultarPendientes = false, capacidades: CapacidadesSolicitudes | null = null,
): EntradaSidebarVisible | null {
  if (!entrada.habilitado && entrada.pendiente && consultarPendientes) {
    return { ...entrada, path: rutaPantallaPendiente(entrada), preliminar: true };
  }
  const path = entrada.path;
  const catalogo = entrada.catalogos?.find(opcion => tienePermiso(opcion.permiso));
  const autorizado = entrada.capacidadSolicitud ? capacidades?.[entrada.capacidadSolicitud] === true
    : entrada.catalogos ? !!catalogo : (!!entrada.permiso && tienePermiso(entrada.permiso)) || !!entrada.permisos?.some(clave => tienePermiso(clave));
  if (!entrada.habilitado || !path || !autorizado
    || entrada.requiere?.some(permiso => !tienePermiso(permiso))) return null;
  const rutas = [path, ...(entrada.aliases ?? [])];
  const backend = items.find(item => rutas.includes(item.path.split('?')[0].replace(/\/$/, '') || '/'));
  return { ...entrada, path, backend,
    ...(catalogo && entrada.catalogos?.[0].id !== catalogo.id ? { queryParams: { pestana: catalogo.id } } : {}) };
}

export function rutaPantallaPendiente(entrada: EntradaSidebar): string {
  return entrada.rutaPreliminar ?? `/pendientes/${entrada.id}`;
}

export function resolverGruposSidebar(tienePermiso: (clave: string) => boolean, items: readonly NavigationItem[], consultarPendientes = false, capacidades: CapacidadesSolicitudes | null = null): readonly GrupoSidebarVisible[] {
  return SIDEBAR_CONFIG.map(grupo => ({
    ...grupo,
    hijos: grupo.hijos.flatMap(entrada => {
      const resuelta = resolverEntradaSidebar(entrada, tienePermiso, items, consultarPendientes, capacidades);
      return resuelta ? [resuelta] : [];
    }),
  })).filter(grupo => grupo.hijos.length > 0);
}
