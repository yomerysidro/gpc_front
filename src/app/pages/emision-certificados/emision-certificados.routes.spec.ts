import { SIN_CAPACIDADES_SOLICITUDES_TEST } from '../../core/interfaces/autenticacion/auth-fixtures.spec';
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
import { FirmaDocumentalService } from '../../core/services/emision-certificados/firma-documental.service';
import { EmisionCertificadosService } from '../../core/services/emision-certificados/emision-certificados.service';
import { environment } from '../../../environments/environment';

describe('Autorización institucional y navegación de Emisión', () => {
  let http: HttpTestingController;
  let api: jasmine.SpyObj<EmisionCertificadosService>;

  beforeEach(() => {
    api = jasmine.createSpyObj('EmisionCertificadosService', ['pendientesCertificacion', 'listar', 'relacionRegistros', 'trabajadores', 'listarTodos', 'obtener', 'documentosIdentidad']);
    api.pendientesCertificacion.and.returnValue(of({ data: [], total: 0, current_page: 1, last_page: 1, per_page: 20 }));
    api.listar.and.returnValue(of({ data: [], total: 0, current_page: 1, last_page: 1, per_page: 20 }));
    api.relacionRegistros.and.returnValue(of([]));
    api.trabajadores.and.returnValue(of([]));
    api.listarTodos.and.returnValue(of([]));
    api.documentosIdentidad.and.returnValue(of({}));
    TestBed.configureTestingModule({ providers: [
      provideRouter(routes), provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting(),
      { provide: AuthService, useClass: SessionAuthService },
      { provide: EmisionCertificadosService, useValue: api },
      { provide: FirmaDocumentalService, useValue: { trabajadores: () => of([]) } },
    ] });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('abre Reconocimientos con su permiso propio sin exigir emision.ver', async () => {
    await sesion(['reconocimientos.ver']);
    const harness = await RouterTestingHarness.create('/certificaciones/reconocimientos');
    expect(TestBed.inject(Router).url).toBe('/certificaciones/reconocimientos');
    expect(harness.routeNativeElement!.textContent).toContain('Reconocimientos institucionales');
    expect(api.listar).toHaveBeenCalledWith('reconocimientos', jasmine.objectContaining({ page: 1, per_page: 12 }));
    expect(api.trabajadores).not.toHaveBeenCalled();
    expect(harness.routeNativeElement!.querySelector('a[href="/certificaciones/reconocimientos/nuevo"]')).toBeNull();
  });

  it('conserva el enlace anterior a Reconocimientos y deniega la creacion sin permiso', async () => {
    await sesion(['emision.ver', 'reconocimientos.ver']);
    const harness = await RouterTestingHarness.create('/certificaciones/certificados/reconocimientos');
    expect(TestBed.inject(Router).url).toBe('/certificaciones/reconocimientos');
    await harness.navigateByUrl('/certificaciones/reconocimientos/nuevo');
    expect(TestBed.inject(Router).url).toBe('/acceso-denegado');
  });

  it('deniega Reconocimientos sin su permiso sin consultar registros', async () => {
    await sesion(['emision.ver']);
    await RouterTestingHarness.create('/certificaciones/reconocimientos');
    expect(TestBed.inject(Router).url).toBe('/acceso-denegado');
    expect(api.listar).not.toHaveBeenCalled();
  });

  it('abre la pagina publica sin sesion ni peticiones administrativas y no simula resultados', async () => {
    const harness = await RouterTestingHarness.create('/verificar/CODIGO-PRUEBA');
    expect(TestBed.inject(Router).url).toBe('/verificar/CODIGO-PRUEBA');
    expect(harness.routeNativeElement!.querySelector('app-header, app-sidebar')).toBeNull();
    expect(harness.routeNativeElement!.textContent).toContain('código de 30 caracteres');
    expect(harness.routeNativeElement!.querySelector<HTMLInputElement>('input')!.value).toBe('CODIGO-PRUEBA');
    expect(harness.routeNativeElement!.querySelector<HTMLButtonElement>('button')!.disabled).toBeTrue();
    expect(api.listar).not.toHaveBeenCalled();
    http.expectNone(() => true);
  });

  async function sesion(permisos: readonly string[], rol = 'Administrador'): Promise<void> {
    const respuesta: SesionResponse = {
    capacidades_solicitudes: SIN_CAPACIDADES_SOLICITUDES_TEST,
      user: { id: 1, nombre: 'Usuario de prueba', email: 'prueba@example.test', rol },
      modulos: [], permisos,
    };
    const carga = firstValueFrom(TestBed.inject(AuthService).cargarSesion());
    const request = http.expectOne(`${environment.apiBaseUrl}/auth/me`);
    expect(request.request.withCredentials).toBeTrue();
    request.flush(respuesta);
    expect(await carga).toBeTrue();
  }

  it('conecta certificados y firmas y conserva la consulta anterior fuera del Sidebar', async () => {
    await sesion(['emision.ver', 'ponentes-firmantes.ver']);
    const harness = await RouterTestingHarness.create('/inicio');
    for (const [opcion, titulo] of [['certificados/documentos', 'Certificados emitidos'], ['firmas', 'Gestión de firmantes municipales']]) {
      const url = `/certificaciones/${opcion}`;
      const enlace = harness.routeNativeElement!.querySelector<HTMLAnchorElement>(`app-sidebar a[href="${url}"]`)!;
      expect(enlace).withContext(url).not.toBeNull();
      enlace.click();
      await harness.fixture.whenStable();
      harness.detectChanges();
      expect(TestBed.inject(Router).url).toBe(url);
      expect(harness.routeNativeElement!.querySelector('main h1')?.textContent?.trim()).toBe(titulo);
    }
    expect(harness.routeNativeElement!.querySelector('app-sidebar a[href="/certificaciones/verificacion"]')).toBeNull();
    await harness.navigateByUrl('/certificaciones/verificacion');
    expect(harness.routeNativeElement!.querySelector('main h1')?.textContent?.trim()).toBe('Consulta de certificados');
    expect(api.listar).not.toHaveBeenCalledWith('certificados', jasmine.anything());
  });

  it('la opcion real Firmas del Sidebar abre la gestion municipal sin montar el CRUD generico', async () => {
    await sesion(['emision.ver'], 'Gerencial');
    const harness = await RouterTestingHarness.create('/inicio');
    harness.routeNativeElement!.querySelector<HTMLAnchorElement>('app-sidebar a[href="/certificaciones/firmas"]')!.click();
    await harness.fixture.whenStable(); harness.detectChanges();
    expect(TestBed.inject(Router).url).toBe('/certificaciones/firmas');
    const pagina = harness.routeNativeElement!.querySelector('app-listar-firmas')!;
    expect(pagina.querySelector('h1')!.textContent).toBe('Gestión de firmantes municipales');
    expect(pagina.textContent).toContain('Seleccionar firmantes para un certificado');
    expect(pagina.querySelector('app-listado-emision')).toBeNull();
    expect(pagina.textContent).not.toContain('Nuevo registro');
    expect(pagina.textContent).not.toContain('Filtrar por');
    expect(pagina.textContent).not.toContain('Valor exacto');
    expect(api.listarTodos).not.toHaveBeenCalledWith('firmas');
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
    expect(TestBed.inject(Router).url).toBe('/certificaciones/generar-emitir');
    expect(harness.routeNativeElement!.querySelector('app-listar-certificados')).toBeNull();
    expect(api.listar).not.toHaveBeenCalled();
  });

  it('abre el formulario real y consulta los tipos del backend', async () => {
    await sesion(['emision.ver', 'emision.crear']);
    const harness = await RouterTestingHarness.create('/certificaciones/certificados/nuevo');
    expect(harness.routeNativeElement!.querySelector('app-formulario-certificado')).toBeNull();
    expect(api.listarTodos).toHaveBeenCalledWith('tipos-certificado');
    expect(harness.routeNativeElement!.textContent).not.toContain('DEMO');
    http.expectNone(() => true);
  });

  it('conserva emision.crear como requisito del nuevo formulario', async () => {
    await sesion(['emision.ver']);
    await RouterTestingHarness.create('/certificaciones/certificados/nuevo');
    expect(TestBed.inject(Router).url).toBe('/acceso-denegado');
    expect(api.listar).not.toHaveBeenCalled();
    expect(api.obtener).not.toHaveBeenCalled();
  });

  it('redirige preparación y sus alias a una sola pantalla sin montar dos listados', async () => {
    await sesion(['emision.ver']);
    const harness = await RouterTestingHarness.create('/emision');
    for (const url of ['/emision', '/certificados', '/certificaciones/certificados']) {
      await harness.navigateByUrl(url); harness.detectChanges();
      expect(TestBed.inject(Router).url).toBe('/certificaciones/generar-emitir');
      expect(harness.routeNativeElement!.querySelectorAll('app-generar-emitir').length).toBe(1);
      expect(harness.routeNativeElement!.querySelectorAll('app-listar-certificados').length).toBe(0);
      expect(harness.routeNativeElement!.querySelector('app-formulario-certificado')).toBeNull();
    }
  });

  it('redirige el enlace antiguo de creación y carga solo el formulario reutilizado', async () => {
    await sesion(['emision.ver', 'emision.crear']);
    const harness = await RouterTestingHarness.create('/certificaciones/certificados/nuevo');
    expect(TestBed.inject(Router).url).toBe('/certificaciones/generar-emitir?nuevo=1');
    expect(harness.routeNativeElement!.querySelectorAll('app-formulario-certificado').length).toBe(0);
    expect(harness.routeNativeElement!.querySelector('app-listar-certificados')).toBeNull();
    expect(api.listarTodos).toHaveBeenCalledWith('tipos-certificado');
  });

  it('conserva edición mediante la ruta antigua y vuelve a comprobar permisos al cambiar parámetros', async () => {
    await sesion(['emision.ver', 'emision.editar']);
    api.obtener.and.returnValue(of({ id_certificado: 9, id_persona: 6, id_tipo_certificado: 2, id_participacion: 1,
      id_reconocimiento: null, id_practica: null, fecha_emision: null, estado: true, notificado: false, fecha_notificacion: null }));
    const harness = await RouterTestingHarness.create('/certificaciones/generar-emitir');
    await harness.navigateByUrl('/certificaciones/certificados/9/editar'); harness.detectChanges();
    expect(TestBed.inject(Router).url).toBe('/certificaciones/generar-emitir?editar=9');
    expect(api.obtener).not.toHaveBeenCalled();
    expect(harness.routeNativeElement!.querySelectorAll('app-formulario-certificado').length).toBe(0);
    await harness.navigateByUrl('/certificaciones/generar-emitir?nuevo=1');
    expect(TestBed.inject(Router).url).toBe('/acceso-denegado');
  });

  it('redirige al login cuando auth/me responde 401', async () => {
    const carga = firstValueFrom(TestBed.inject(AuthService).cargarSesion());
    http.expectOne(`${environment.apiBaseUrl}/auth/me`).flush({ message: 'No autenticado' }, { status: 401, statusText: 'Unauthorized' });
    expect(await carga).toBeFalse();
    await RouterTestingHarness.create('/certificaciones/certificados');
    expect(TestBed.inject(Router).url).toBe('/login?returnUrl=%2Fcertificaciones%2Fgenerar-emitir');
    expect(api.listar).not.toHaveBeenCalled();
  });
});
