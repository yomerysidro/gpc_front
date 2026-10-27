/** Elemento de GET /api/roles, solo con los campos que usa la Fase 2 (la respuesta trae además usuarios). */
export interface Rol {
  readonly id: number;
  readonly nombre: string;
  readonly estado: boolean;
}
