import { InjectionToken } from '@angular/core';

/** Mantener cerrado hasta verificar auth.cookie y Gate activos en la API desplegada.
 * El permiso de la sesión no sustituye la autorización del servidor.
 * No se controla desde localStorage, parámetros de URL ni formularios.
 */
export const ESCRITURA_EMISION_AUTORIZADA = new InjectionToken<boolean>('ESCRITURA_EMISION_AUTORIZADA', {
  providedIn: 'root', factory: () => false,
});
export const BLOQUEO_ESCRITURA_EMISION = 'Las operaciones de registro, edición y eliminación están bloqueadas hasta verificar la autenticación y autorización efectivas del backend.';
