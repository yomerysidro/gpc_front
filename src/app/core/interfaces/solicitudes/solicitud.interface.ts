/** Modelos de presentación internos. El adaptador debe mapear el contrato real de Laravel. */
export const ESTADOS_SOLICITUD = ['Borrador', 'Enviada', 'En revisión', 'Observada', 'Pendiente de aprobación', 'Aprobada', 'Rechazada'] as const;
export type EstadoSolicitud = typeof ESTADOS_SOLICITUD[number];
export type AccionSolicitud = 'Enviar' | 'Iniciar revisión' | 'Derivar' | 'Aprobar' | 'Observar' | 'Rechazar';
export type BandejaSolicitud = 'propias' | 'revision' | 'gerencia';
export interface DatosSolicitud {
  readonly areaId: string;
  readonly nombre: string;
  readonly tipoId: string;
  readonly descripcion: string;
  readonly objetivo: string;
  readonly inicio: string;
  readonly fin: string;
  readonly lugar: string;
  /** Compatibilidad de vista; no existe en el DTO de borrador y no se envía a Laravel. */
  readonly observaciones: string;
}
export interface ContextoSolicitud {
  /** Opciones de catálogo; no equivalen a competencia laboral ni autorización de escritura. */
  readonly areasDisponibles: readonly { readonly id: string; readonly nombre: string }[];
  readonly responsable: string;
  readonly puedeCrear: boolean;
}
export interface Solicitud extends DatosSolicitud {
  readonly actividadId?: number | null;
  readonly puedeVerDetalle?: boolean;
  readonly id: string;
  readonly numero: string;
  readonly area: string;
  readonly responsable: string;
  readonly tipo: string;
  readonly fecha: string;
  readonly estado: EstadoSolicitud;
  readonly revisor: string | null;
  readonly ultimaObservacion: string | null;
  readonly resultadoRevision: string | null;
  /** Compatibilidad del puerto; el contrato actual no devuelve ni acepta una versión. */
  readonly version: string;
  /** Permisos de sesión y estado; Laravel verifica además competencia y área. */
  readonly puedeEditar: boolean;
  readonly acciones: readonly AccionSolicitud[];
}
/** La identidad del solicitante o de otra decisión no identifica al revisor. */
export function textoRevisorSolicitud(fila: Solicitud): string {
  return fila.revisor?.trim() || (['Borrador', 'Enviada'].includes(fila.estado)
    ? 'Pendiente de asignación de revisor' : 'Identidad del revisor no disponible');
}
export interface FiltroSolicitudes {
  readonly responsableId?: string;
  readonly solicitudId?: string;
  readonly busqueda: string;
  readonly estado: string;
  readonly desde: string;
  readonly hasta: string;
  readonly pagina: number;
}
export interface PaginaSolicitudes<T> {
  readonly registros: readonly T[];
  readonly total: number;
  readonly pagina: number;
  readonly ultimaPagina: number;
}
export interface DecisionSolicitud {
  readonly nombreSolicitud?: string;
  readonly estadoAnterior?: EstadoSolicitud;
  readonly solicitanteId?: number;
  readonly id: string;
  readonly solicitudId: string;
  readonly numero: string;
  readonly area: string;
  readonly fecha: string;
  readonly resultado: 'Aprobada' | 'Observada' | 'Rechazada' | 'Revisión conforme' | 'Derivada a Gerencia';
  readonly responsable: string;
  readonly motivo: string;
  readonly estadoPosterior: EstadoSolicitud;
}
export interface DocumentoPendiente {
  readonly id: string;
  readonly beneficiario: string;
  readonly tipo: string;
  readonly fecha: string;
  readonly codigo: string | null;
  readonly estado: string;
  readonly puedeVer: boolean;
}
