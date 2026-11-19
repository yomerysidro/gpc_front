export interface TurnstileApi {
  render(container: HTMLElement, options: {
    sitekey: string;
    action: 'login';
    size: 'flexible';
    appearance: 'always';
    language: 'es';
    'response-field': false;
    'refresh-expired': 'auto';
    callback: (token: string) => void;
    'expired-callback': () => void;
    'error-callback': () => void;
  }): string;
  reset(widgetId: string): void;
  remove(widgetId: string): void;
}

let carga: Promise<TurnstileApi> | undefined;

export function cargarApiTurnstile(documento: Document): Promise<TurnstileApi> {
  const ventana = documento.defaultView as (Window & { turnstile?: TurnstileApi }) | null;
  if (ventana?.turnstile) return Promise.resolve(ventana.turnstile);

  carga ??= new Promise<TurnstileApi>((resolve, reject) => {
    const script = documento.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;

    const fallo = () => {
      clearTimeout(tiempoLimite);
      script.remove();
      reject(new Error('No se pudo cargar Cloudflare Turnstile'));
    };
    const tiempoLimite = setTimeout(fallo, 15000);
    script.onerror = fallo;
    script.onload = () => {
      clearTimeout(tiempoLimite);
      if (ventana?.turnstile) {
        resolve(ventana.turnstile);
      } else {
        fallo();
      }
    };
    documento.head.append(script);
  }).catch((error: unknown) => {
    carga = undefined;
    throw error;
  });

  return carga;
}
