import { environment } from '../../../environments/environment';

/** El código y el destino del QR pertenecen a Laravel; Angular no los compone. */
export function enlaceVerificacionSeguro(valor: string | null | undefined): string | null {
  if (!valor) return null;
  try {
    const url = new URL(valor);
    if (url.username || url.password || !['http:', 'https:'].includes(url.protocol)) return null;
    if (environment.production && (url.protocol !== 'https:' || ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) || url.hostname.endsWith('.localhost'))) return null;
    return url.href;
  } catch { return null; }
}
