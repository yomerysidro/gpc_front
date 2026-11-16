import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/autenticacion/auth.service';
import { PortalCertificadosService } from '../services/emision-certificados/portal-certificados.service';

describe('Interceptor con búsqueda pública por DNI', () => {
  for (const status of [200, 401, 403, 422, 429, 503]) {
    it(`no autoriza ni cierra sesión administrativa ante HTTP ${status} del endpoint público`, () => {
      const auth = jasmine.createSpyObj('AuthService', ['authorizeRequest', 'limpiarSesion']);
      TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(), { provide: AuthService, useValue: auth }] });
      const navegar = spyOn(TestBed.inject(Router), 'navigate');
      const http = TestBed.inject(HttpTestingController);
      let recibida = false;
      TestBed.inject(PortalCertificadosService).consultarDni('01234567').subscribe({ next: () => { recibida = true; }, error: () => { recibida = true; } });
      const req = http.expectOne('/api/portal-certificados/consultar-dni');
      expect(req.request.withCredentials).toBeFalse(); expect(req.request.headers.has('Authorization')).toBeFalse();
      if (status === 200) req.flush({ success: true, data: { certificados: [] } });
      else req.flush({}, { status, statusText: 'Error' });
      expect(recibida).toBeTrue(); expect(auth.authorizeRequest).not.toHaveBeenCalled();
      expect(auth.limpiarSesion).not.toHaveBeenCalled(); expect(navegar).not.toHaveBeenCalled(); http.verify();
    });
  }
});
