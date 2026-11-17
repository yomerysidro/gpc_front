export interface EstadoRevision {
  pdf_confirmado?: boolean;
  pdf_revisado_disponible?: boolean;
  disponible_rrhh?: boolean;
  documento?: EstadoRevision;
}

/** El campo actual prevalece sobre su alias; un false explícito nunca se reemplaza. */
export function pdfConfirmado(estado: EstadoRevision | null | undefined): boolean {
  return (estado?.pdf_confirmado ?? estado?.pdf_revisado_disponible
    ?? estado?.documento?.pdf_confirmado ?? estado?.documento?.pdf_revisado_disponible) === true;
}

export function listoParaEntrega(estado: EstadoRevision | null | undefined): boolean {
  return pdfConfirmado(estado) && (estado?.disponible_rrhh ?? estado?.documento?.disponible_rrhh) === true;
}
