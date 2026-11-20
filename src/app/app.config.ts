import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withHttpTransferCacheOptions } from '@angular/platform-browser';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { operacionAvisoInterceptor } from './core/interceptors/operacion-aviso.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { AuthService } from './core/services/autenticacion/auth.service';
import { SessionAuthService } from './core/services/autenticacion/session-auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // La sesión vive en una cookie del navegador: las respuestas de la API no se transfieren desde SSR.
    provideClientHydration(withHttpTransferCacheOptions({
      filter: request => !request.url.startsWith(environment.apiBaseUrl),
    })),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, operacionAvisoInterceptor])),
    { provide: AuthService, useClass: SessionAuthService },
  ],
};
