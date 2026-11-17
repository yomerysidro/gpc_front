import { SIN_CAPACIDADES_SOLICITUDES_TEST } from './core/interfaces/autenticacion/auth-fixtures.spec';
import { environment } from '../environments/environment';
import { PLATFORM_ID, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  HttpContext, HttpErrorResponse, HttpRequest, HttpResponse, provideHttpClient,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import {
  ActivatedRouteSnapshot, provideRouter, Router, RouterStateSnapshot, UrlTree,
} from '@angular/router';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MainLayoutComponent } from './components/layouts/main-layout/main-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { ReportesService } from './core/services/reportes/reportes.service';
import { ListarCertificadosComponent } from './pages/emision-certificados/certificados/listar-certificados/listar-certificados.component';
import { PageTitleComponent } from './shared/components/page-title/page-title.component';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { permissionGuard } from './core/guards/permission.guard';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { AuthService } from './core/services/autenticacion/auth.service';
import { SessionAuthService } from './core/services/autenticacion/session-auth.service';
import { SesionResponse } from './core/interfaces/autenticacion/auth.interface';
import { AUTHENTICATED_REQUEST } from './core/security/auth-request.context';
import { EmisionCertificadosService } from './core/services/emision-certificados/emision-certificados.service';

describe('Componentes de la estructura base', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([]),
    { provide: ReportesService, useValue: { totalRegistrados: () => of(0) } },
    { provide: AuthService, useValue: { usuario: signal(null), capacidadesSolicitudes: signal(null), tienePermiso: () => true } },
    { provide: EmisionCertificadosService, useValue: {
      listar: () => of({ data: [], total: 0, current_page: 1, last_page: 1, per_page: 20 }),
      listarTodos: () => of([]), documentosIdentidad: () => of({}),
    } },
  ] }));

  for (const component of [HeaderComponent, SidebarComponent, MainLayoutComponent,
    HomeComponent, ListarCertificadosComponent]) {
    it(`compila y renderiza ${component.name}`, async () => {
      await TestBed.configureTestingModule({ imports: [component] }).compileComponents();
      const fixture = TestBed.createComponent<unknown>(component);
      fixture.detectChanges();
      expect(fixture.componentInstance).toBeTruthy();
    });
  }

  it('muestra el título recibido sin contenido de negocio supuesto', () => {
    const fixture = TestBed.createComponent(PageTitleComponent);
    fixture.componentRef.setInput('title', 'Certificados');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1').textContent).toBe('Certificados');
  });

  it('el sidebar organiza capacidades conocidas sin activar enlaces desconocidos del backend', () => {
    const fixture = TestBed.createComponent(SidebarComponent);
    fixture.componentRef.setInput('items', [{ label: 'Consulta adicional', path: '/consulta-adicional' }]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('a[href="/consulta-adicional"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('a[href="/certificaciones/generar-emitir"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('a[href="/certificaciones/certificados"]')).toBeNull();
    fixture.componentRef.setInput('items', []); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('a[href="/consulta-adicional"]')).toBeNull();
  });

  it('conserva iconos institucionales y evita entradas sueltas fuera de un grupo', () => {
    const fixture = TestBed.createComponent(SidebarComponent);
    fixture.componentRef.setInput('items', [
      { label: 'Eventos adicionales', path: '/eventos-adicionales', icon: 'event' },
      { label: 'Consulta adicional', path: '/consulta-adicional' },
      { label: 'Nuevo m?dulo', path: '/nuevo', icon: 'icono_fuera_de_la_fuente' },
    ]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[aria-controls="submenu-actividades"] .material-symbols-outlined').textContent).toBe('calendar_month');
    expect(fixture.nativeElement.querySelector('a[href="/eventos-adicionales"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('a[href="/consulta-adicional"] .material-symbols-outlined')).toBeNull();
    expect(fixture.nativeElement.querySelector('a[href="/nuevo"] .material-symbols-outlined')).toBeNull();
  });

});

describe('Puntos de integración de autenticación', () => {
  it('el guard requiere un proveedor real; no permite acceso por defecto', () => {
    expect(() => TestBed.runInInjectionContext(() => authGuard(
      {} as ActivatedRouteSnapshot, {} as RouterStateSnapshot,
    ))).toThrow();
  });

  it('el guard espera la sesión del servicio y redirige a /login con returnUrl', async () => {
    let haySesion = false;
    const session = { cargarSesion: () => of(haySesion) };
    TestBed.configureTestingModule({ providers: [
      provideRouter([]), { provide: AuthService, useValue: session },
    ] });
    const check = () => firstValueFrom(TestBed.runInInjectionContext(() => authGuard(
      {} as ActivatedRouteSnapshot, { url: '/usuarios' } as RouterStateSnapshot,
    )) as Observable<boolean | UrlTree>);
    const router = TestBed.inject(Router);
    expect(router.serializeUrl(await check() as UrlTree)).toBe('/login?returnUrl=%2Fusuarios');
    haySesion = true;
    expect(await check()).toBeTrue();
  });

  it('el guard deja renderizar en el servidor; la sesión se decide en el navegador', () => {
    const cargarSesion = jasmine.createSpy('cargarSesion');
    TestBed.configureTestingModule({ providers: [
      { provide: PLATFORM_ID, useValue: 'server' },
      { provide: AuthService, useValue: { cargarSesion } },
    ] });
    expect(TestBed.runInInjectionContext(() => authGuard(
      {} as ActivatedRouteSnapshot, {} as RouterStateSnapshot,
    ))).toBeTrue();
    expect(cargarSesion).not.toHaveBeenCalled();
  });

  it('guestGuard deja pasar sin sesión y con sesión envía a la primera ruta del menú', async () => {
    let haySesion = false;
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: AuthService, useValue: {
      cargarSesion: () => of(haySesion), rutaInicial: () => '/actividades',
    } }] });
    const check = () => firstValueFrom(TestBed.runInInjectionContext(() => guestGuard(
      {} as ActivatedRouteSnapshot, {} as RouterStateSnapshot,
    )) as Observable<boolean | UrlTree>);
    expect(await check()).toBeTrue();
    haySesion = true;
    expect(TestBed.inject(Router).serializeUrl(await check() as UrlTree)).toBe('/actividades');
  });

  it('permissionGuard exige la clave de route.data y si falta envía a acceso denegado', async () => {
    const permisos = ['usuarios.ver'];
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: AuthService, useValue: {
      cargarSesion: () => of(true), tienePermiso: (clave: string) => permisos.includes(clave),
    } }] });
    const check = (data: object) => firstValueFrom(TestBed.runInInjectionContext(() => permissionGuard(
      { data } as ActivatedRouteSnapshot, {} as RouterStateSnapshot,
    )) as Observable<boolean | UrlTree>);
    const router = TestBed.inject(Router);
    expect(await check({ permiso: 'usuarios.ver' })).toBeTrue();
    expect(router.serializeUrl(await check({ permiso: 'roles.ver' }) as UrlTree)).toBe('/acceso-denegado');
    expect(router.serializeUrl(await check({}) as UrlTree)).toBe('/acceso-denegado');
  });

  it('no autoriza ni modifica solicitudes sin autorización explícita', () => {
    const request = new HttpRequest('GET', '/resource');
    const next = jasmine.createSpy('next').and.returnValue(of(new HttpResponse()));
    TestBed.runInInjectionContext(() => authInterceptor(request, next));
    expect(next).toHaveBeenCalledOnceWith(request);
  });

  it('no consulta recursos autenticados ni termina la sesion durante SSR', () => {
    TestBed.configureTestingModule({ providers: [
      { provide: PLATFORM_ID, useValue: 'server' },
    ] });
    const request = new HttpRequest('GET', environment.apiBaseUrl + '/attendance', {
      context: new HttpContext().set(AUTHENTICATED_REQUEST, true),
    });
    const next = jasmine.createSpy('next');
    const complete = jasmine.createSpy('complete');
    TestBed.runInInjectionContext(() => authInterceptor(request, next)).subscribe({ complete });
    expect(next).not.toHaveBeenCalled();
    expect(complete).toHaveBeenCalledTimes(1);
  });
  it('delega solicitudes autorizadas sin suponer tokens ni endpoints', () => {
    const request = new HttpRequest('GET', '/resource', {
      context: new HttpContext().set(AUTHENTICATED_REQUEST, true),
    });
    const authorizeRequest = jasmine.createSpy('authorizeRequest').and.returnValue(request);
    TestBed.configureTestingModule({ providers: [
      { provide: AuthService, useValue: { authorizeRequest } },
    ] });
    const next = jasmine.createSpy('next').and.returnValue(of(new HttpResponse()));
    TestBed.runInInjectionContext(() => authInterceptor(request, next));
    expect(authorizeRequest).toHaveBeenCalledOnceWith(request);
    expect(next).toHaveBeenCalledOnceWith(request);
  });

  it('un 401 en una solicitud marcada limpia la sesión y lleva a /login, salvo /auth/me y /auth/login', () => {
    const limpiarSesion = jasmine.createSpy('limpiarSesion');
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: AuthService, useValue: {
      authorizeRequest: (req: HttpRequest<unknown>) => req, limpiarSesion,
    } }] });
    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    const fallar = (url: string) => {
      const request = new HttpRequest('GET', url, {
        context: new HttpContext().set(AUTHENTICATED_REQUEST, true),
      });
      const next = () => throwError(() => new HttpErrorResponse({ status: 401, url }));
      TestBed.runInInjectionContext(() => authInterceptor(request, next)).subscribe({ error: () => undefined });
    };

    fallar(environment.apiBaseUrl + '/auth/me');
    fallar(environment.apiBaseUrl + '/auth/login');
    expect(limpiarSesion).not.toHaveBeenCalled();

    fallar(environment.apiBaseUrl + '/usuarios');
    expect(limpiarSesion).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledOnceWith(['/login'], { queryParams: { returnUrl: '/' } });
  });
});

describe('SessionAuthService', () => {
  let service: SessionAuthService;
  let http: HttpTestingController;
  const sesion: SesionResponse = {
    capacidades_solicitudes: SIN_CAPACIDADES_SOLICITUDES_TEST,
    user: { id: 2, nombre: 'Maria Perez', email: 'maria.rrhh@moralesmuni.pe', rol: 'Digitador' },
    modulos: [{ id: 4, nombre: 'Actividades', url: '/actividades', imagen: 'event' }],
    permisos: ['actividades.ver'],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      provideRouter([]), provideHttpClient(), provideHttpClientTesting(), SessionAuthService,
    ] });
    service = TestBed.inject(SessionAuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('envía credenciales solo a apiBaseUrl', () => {
    expect(service.authorizeRequest(new HttpRequest('GET', environment.apiBaseUrl + '/auth/me')).withCredentials).toBeTrue();
    expect(service.authorizeRequest(new HttpRequest('GET', 'https://otro.pe/api')).withCredentials).toBeFalse();
    expect(service.authorizeRequest(new HttpRequest('GET', '/apix')).withCredentials).toBeFalse();
  });

  it('carga /auth/me una sola vez y expone usuario, módulos y permisos', () => {
    service.cargarSesion().subscribe();
    service.cargarSesion().subscribe();
    const request = http.expectOne(environment.apiBaseUrl + '/auth/me');
    expect(request.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue();
    request.flush(sesion);
    service.cargarSesion().subscribe();
    http.expectNone(environment.apiBaseUrl + '/auth/me');
    expect(service.isAuthenticated()).toBeTrue();
    expect(service.rutaInicial()).toBe('/actividades');
    expect(service.tienePermiso('actividades.ver')).toBeTrue();
    expect(service.tienePermiso('usuarios.ver')).toBeFalse();
  });

  it('un 401 en /auth/me deja la sesión vacía', async () => {
    const resultado = firstValueFrom(service.cargarSesion());
    http.expectOne(environment.apiBaseUrl + '/auth/me').flush({ message: 'No autenticado' }, { status: 401, statusText: '' });
    expect(await resultado).toBeFalse();
    expect(service.usuario()).toBeNull();
  });

  it('login devuelve el mensaje del 401 y bloqueadoHasta del 423', async () => {
    let resultado = firstValueFrom(service.login('maria.rrhh@moralesmuni.pe', 'mala'));
    http.expectOne(environment.apiBaseUrl + '/auth/login').flush({ message: 'Usuario desactivado' }, { status: 401, statusText: '' });
    expect(await resultado).toEqual({ tipo: 'rechazado', mensaje: 'Usuario desactivado. Contacta con el administrador.' });

    resultado = firstValueFrom(service.login('maria.rrhh@moralesmuni.pe', 'mala'));
    http.expectOne(environment.apiBaseUrl + '/auth/login').flush(
      { message: 'Cuenta bloqueada', bloqueadoHasta: '2026-10-26T22:30:00-05:00' },
      { status: 423, statusText: '' },
    );
    expect(await resultado).toEqual({
      tipo: 'bloqueado', mensaje: 'Cuenta bloqueada', bloqueadoHasta: '2026-10-26T22:30:00-05:00',
    });
  });

  it('login exitoso recarga /auth/me', async () => {
    const resultado = firstValueFrom(service.login('maria.rrhh@moralesmuni.pe', 'Test1234'));
    http.expectOne(environment.apiBaseUrl + '/auth/login').flush({ user: sesion.user });
    http.expectOne(environment.apiBaseUrl + '/auth/me').flush(sesion);
    expect(await resultado).toEqual({ tipo: 'exito' });
    expect(service.usuario()).toEqual(sesion.user);
  });

  it('conserva el error del servidor si falla /auth/me después del login y permite reintentar', async () => {
    const resultado = firstValueFrom(service.login('maria.rrhh@moralesmuni.pe', 'Test1234'));
    const error = expectAsync(resultado).toBeRejectedWith(jasmine.objectContaining({ status: 500 }));
    http.expectOne(environment.apiBaseUrl + '/auth/login').flush({ user: sesion.user });
    http.expectOne(environment.apiBaseUrl + '/auth/me').flush(
      { message: 'Error interno' }, { status: 500, statusText: 'Internal Server Error' });
    await error;
    expect(service.isAuthenticated()).toBeFalse();
    service.cargarSesion().subscribe();
    http.expectOne(environment.apiBaseUrl + '/auth/me').flush(sesion);
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('presenta un mensaje seguro para credenciales incorrectas', async () => {
    const resultado = firstValueFrom(service.login('maria.rrhh@moralesmuni.pe', 'mala'));
    http.expectOne(environment.apiBaseUrl + '/auth/login').flush(
      { message: 'Credenciales inválidas' }, { status: 401, statusText: 'Unauthorized' });
    expect(await resultado).toEqual({ tipo: 'rechazado', mensaje: 'Correo electrónico o contraseña incorrectos.' });
  });

  it('recargarSesion vuelve a pedir /auth/me aunque ya esté cargada', () => {
    service.cargarSesion().subscribe();
    http.expectOne(environment.apiBaseUrl + '/auth/me').flush(sesion);
    service.recargarSesion().subscribe();
    http.expectOne(environment.apiBaseUrl + '/auth/me').flush({ ...sesion, modulos: [] });
    expect(service.modulos()).toEqual([]);
  });

  it('logout no simula cierre si el backend falla', () => {
    const navigateByUrl = spyOn(TestBed.inject(Router), 'navigateByUrl').and.resolveTo(true);
    service.cargarSesion().subscribe();
    http.expectOne(environment.apiBaseUrl + '/auth/me').flush(sesion);
    let errorRecibido = false;
    service.logout().subscribe({ error: () => errorRecibido = true });
    http.expectOne(environment.apiBaseUrl + '/auth/logout').flush(null, { status: 500, statusText: '' });
    expect(errorRecibido).toBeTrue();
    expect(service.isAuthenticated()).toBeTrue();
    expect(navigateByUrl).not.toHaveBeenCalled();
    service.cargarSesion().subscribe();
    http.expectNone(environment.apiBaseUrl + '/auth/me');
  });
});
