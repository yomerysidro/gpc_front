import { EstadoSolicitud } from './solicitud.interface';
export const LIMITES_SOLICITUD = { nombre: 100, sede: 100, descripcion: 255 } as const;

/** Área laboral habilitada por Laravel para el principal de la cookie. */
export interface ActivityRequestAuthorizedArea {
  readonly id_area: number;
  readonly nombre: string;
}

/** DTO verificados en docs/activity-requests-api-contracts.md y ActivityRequestWorkflow. */
export interface ActivityRequestDraft {
  readonly id_area: number;
  readonly id_tipo_actividad: number;
  readonly nombre: string;
  readonly descripcion?: string | null;
  readonly justificacion: string;
  readonly fecha_inicio_propuesta: string;
  readonly fecha_fin_propuesta: string;
  readonly sede_propuesta?: string | null;
}
export interface ActivityRequestRow extends ActivityRequestDraft {
  readonly area_nombre?: string | null;
  readonly solicitante_nombre?: string | null;
  readonly tipo_actividad_nombre?: string | null;
  readonly descripcion: string | null;
  readonly sede_propuesta: string | null;
  readonly id_solicitud_actividad: number;
  readonly id_usuario_solicitante: number;
  readonly estado: EstadoSolicitud;
  readonly fecha_solicitud: string;
  readonly id_actividad: number | null;
}
export const TIPOS_DECISION_SOLICITUD = ['REVISION_CONFORME', 'OBSERVAR', 'DERIVAR_GERENCIA', 'APROBAR', 'RECHAZAR'] as const;
export type TipoDecisionSolicitud = typeof TIPOS_DECISION_SOLICITUD[number];
export interface ActivityRequestDecisionRow {
  readonly responsable_nombre?: string | null;
  readonly id_solicitud_decision: number;
  readonly id_solicitud_actividad: number;
  readonly id_usuario_responsable: number;
  readonly tipo_decision: TipoDecisionSolicitud;
  readonly estado_anterior: EstadoSolicitud;
  readonly estado_nuevo: EstadoSolicitud;
  readonly observacion: string | null;
  readonly fecha_decision: string;
}
export interface ActivityRequestObservation { readonly observacion?: string | null }
export interface ActivityRequestGlobalDecisionRow extends ActivityRequestDecisionRow {
  readonly area_nombre?: string | null;
  readonly solicitante_nombre?: string | null;
  readonly id_usuario_solicitante: number;
  readonly id_area: number;
  readonly solicitud_nombre: string;
}
export interface ActivityRequestHistoryFilters {
  readonly id_area?: number;
  readonly id_solicitud_actividad?: number;
  /** Filtro de auditoría, nunca identidad autenticada para una escritura. */
  readonly id_usuario_responsable?: number;
  readonly tipo_decision?: TipoDecisionSolicitud;
  readonly fecha_desde?: string;
  readonly fecha_hasta?: string;
  readonly per_page?: number;
  readonly page?: number;
}
export interface ActivityRequestFilters {
  readonly estado?: EstadoSolicitud;
  readonly id_area?: number;
  readonly fecha_desde?: string;
  readonly fecha_hasta?: string;
  readonly per_page?: number;
  /** Parámetro estándar del paginador Laravel, no filtro de ActivityRequestWorkflow. */
  readonly page?: number;
}
export interface ActivityRequestPage<T> {
  readonly data: readonly T[];
  readonly current_page: number;
  readonly last_page: number;
  readonly per_page: number;
  readonly total: number;
}
export interface ActivityRequestResponse<T> { readonly success: boolean; readonly message: string | null; readonly data: T }
