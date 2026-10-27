import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { firstValueFrom, of } from 'rxjs';
import { routes } from '../../app.routes';
import { SesionResponse } from '../../core/interfaces/autenticacion/auth.interface';
import { authInterceptor } from '../../core/interceptors/auth.interceptor';
import { AuthService } from '../../core/services/autenticacion/auth.service';
import { SessionAuthService } from '../../core/services/autenticacion/session-auth.service';
import { EmisionCertificadosService } from '../../core/services/emision-certificados/emision-certificados.service';
import { environment } from '../../../environments/environment';

describe('Autorización institucional y navegación de Emisión', () => {
  let http: HttpTestingController;
  let api: jasmine.SpyObj<EmisionCertificadosService>;

  beforeEach(() => {
    api = jasmine.createSpyObj('EmisionCertificadosService', ['listar']);
    api.listar.and.returnValue(of({ data: [], total: 0, current_page: 1, last_page: 1, per_page: 20 }));
    TestBed.configureTestingModule({ providers: [
      provideRouter(routes), provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting(),
      { provide: AuthService, useClass: SessionAuthService },
      { provide: EmisionCertificadosService, useValue: api },
    ] });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  async function sesion(permisos: readonly string[], rol = 'Administrador'): Promise<void> {
    const respuesta: SesionResponse = {
      user: { id: 1, nombre: 'Usuario de prueba', email: 'prueba@example.test', rol },
      modulos: [], permisos,
    };
    const carga = firstValueFrom(TestBed.inject(AuthService).cargarSesion());
    const request = http.expectOne(`${environment.apiBaseUrl}/auth/me`);
    expect(request.request.withCredentials).toBeTrue();
    request.flush(respuesta);
    expect(await carga).toBeTrue();
  }

  it('permite al Administrador con emision.ver y conecta los tres enlaces existentes del Sidebar', async () => {
    await sesion(['emision.ver', 'ponentes-firmantes.ver']);
    const harness = await RouterTestingHarness.create('/inicio');
    for (const [opcion, titulo] of [['certificados', 'Certificados'], ['firmas', 'Firmas'], ['verificacion', 'Verificación']]) {
      const url = `/certificaciones/${opcion}`;
      const enlace = harness.routeNativeElement!.querySelector<HTMLAnchorElement>(`app-sidebar a[href="${url}"]`)!;
      expect(enlace).withContext(url).not.toBeNull();
      enlace.click();
      await harness.fixture.whenStable();
      harness.detectChanges();
      expect(TestBed.inject(Router).url).toBe(url);
      expect(harness.routeNativeElement!.querySelector('main h1')?.textContent?.trim()).toBe(titulo);
    }
    expect(api.listar).toHaveBeenCalledWith('certificados', { page: 1, per_page: 20 });
  });

  for (const rol of ['Administrador', 'Digitador']) {
    it(`deniega a ${rol} sin emision.ver antes de consultar certificados`, async () => {
      await sesion(['usuarios.ver'], rol);
      await RouterTestingHarness.create('/certificaciones/certificados');
      expect(TestBed.inject(Router).url).toBe('/acceso-denegado');
      expect(api.listar).not.toHaveBeenCalled();
    });
  }

  it('no confunde certificados.ver con el permiso institucional emision.ver', async () => {
    await sesion(['certificados.ver']);
    await RouterTestingHarness.create('/certificaciones/certificados');
    expect(TestBed.inject(Router).url).toBe('/acceso-denegado');
    expect(api.listar).not.toHaveBeenCalled();
  });

  it('espera auth/me antes de decidir el acceso y cargar el componente de certificados', async () => {
    const harness = await RouterTestingHarness.create('/acceso-denegado');
    const navegacion = harness.navigateByUrl('/certificaciones/certificados');
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(api.listar).not.toHaveBeenCalled();
    const request = http.expectOne(`${environment.apiBaseUrl}/auth/me`);
    expect(request.request.withCredentials).toBeTrue();
    request.flush({
      user: { id: 1, nombre: 'Prueba', email: 'prueba@example.test', rol: 'Administrador' },
      modulos: [], permisos: ['emision.ver'],
    });
    await navegacion;
    harness.detectChanges();
    expect(TestBed.inject(Router).url).toBe('/certificaciones/certificados');
    expect(harness.routeNativeElement!.querySelector('app-listar-certificados')).not.toBeNull();
    expect(api.listar).toHaveBeenCalledWith('certificados', { page: 1, per_page: 20 });
  });

  it('redirige al login cuando auth/me responde 401', async () => {
    const carga = firstValueFrom(TestBed.inject(AuthService).cargarSesion());
    http.expectOne(`${environment.apiBaseUrl}/auth/me`).flush({ message: 'No autenticado' }, { status: 401, statusText: 'Unauthorized' });
    expect(await carga).toBeFalse();
    await RouterTestingHarness.create('/certificaciones/certificados');
    expect(TestBed.inject(Router).url).toBe('/login?returnUrl=%2Fcertificaciones%2Fcertificados');
    expect(api.listar).not.toHaveBeenCalled();
  });
});
