import { HttpContextToken } from '@angular/common/http';

/** Autorización explícita por solicitud; no enviar credenciales a todos los destinos. */
export const AUTHENTICATED_REQUEST = new HttpContextToken<boolean>(() => false);
