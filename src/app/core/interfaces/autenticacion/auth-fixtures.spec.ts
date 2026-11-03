import { CapacidadesSolicitudes } from './auth.interface';

/** Respuestas de prueba de /auth/me; no se importan desde producción. */
export const SIN_CAPACIDADES_SOLICITUDES_TEST: CapacidadesSolicitudes = {
  consultar_revision: false, consultar_gerencia: false, consultar_historial: false,
  consulta_administrativa_global: false, revisar: false, derivar: false, aprobar: false, rechazar: false,
};
export const CAPACIDADES_ADMIN_SOLICITUDES_TEST: CapacidadesSolicitudes = {
  consultar_revision: true, consultar_gerencia: true, consultar_historial: true,
  consulta_administrativa_global: true, revisar: true, derivar: true, aprobar: false, rechazar: false,
};
export const TODAS_CAPACIDADES_SOLICITUDES_TEST: CapacidadesSolicitudes = {
  ...CAPACIDADES_ADMIN_SOLICITUDES_TEST, aprobar: true, rechazar: true,
};
