import { TestBed } from '@angular/core/testing';
import { HttpContext, HttpRequest, HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, provideRouter, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MainLayoutComponent } from './components/layouts/main-layout/main-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { ListarCertificadosComponent } from './pages/certificados/listar-certificados/listar-certificados.component';
import { PageTitleComponent } from './shared/components/page-title/page-title.component';
import { authGuard } from './core/guards/auth.guard';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { AuthService } from './core/services/autenticacion/auth.service';
import { AUTHENTICATED_REQUEST } from './core/security/auth-request.context';

describe('Componentes de la estructura base', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

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

  it('el sidebar conserva las etiquetas y rutas del contrato de navegación', () => {
    const fixture = TestBed.createComponent(SidebarComponent);
    fixture.componentRef.setInput('items', [
      { label: 'Inicio', path: '/' },
      { label: 'Certificados', path: '/certificados' },
    ]);
    fixture.detectChanges();
    const links: NodeListOf<HTMLAnchorElement> = fixture.nativeElement.querySelectorAll('a');
    expect(Array.from(links, link => link.textContent?.trim())).toEqual(['Inicio', 'Certificados']);
    expect(Array.from(links, link => link.getAttribute('href'))).toEqual(['/', '/certificados']);
    fixture.componentRef.setInput('items', []);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('a').length).toBe(0);
  });

});

describe('Puntos de integración de autenticación', () => {
  it('el guard requiere un proveedor real; no permite acceso por defecto', () => {
    expect(() => TestBed.runInInjectionContext(() => authGuard(
      {} as ActivatedRouteSnapshot, {} as RouterStateSnapshot,
    ))).toThrow();
  });

  it('el guard respeta el estado proporcionado por el servicio', () => {
    const session = { isAuthenticated: () => false };
    TestBed.configureTestingModule({ providers: [{ provide: AuthService, useValue: session }] });
    const check = () => TestBed.runInInjectionContext(() => authGuard(
      {} as ActivatedRouteSnapshot, {} as RouterStateSnapshot,
    ));
    expect(check()).toBeFalse();
    spyOn(session, 'isAuthenticated').and.returnValue(true);
    expect(check()).toBeTrue();
  });

  it('no autoriza ni modifica solicitudes sin autorización explícita', () => {
    const request = new HttpRequest('GET', '/resource');
    const next = jasmine.createSpy('next').and.returnValue(of(new HttpResponse()));
    TestBed.runInInjectionContext(() => authInterceptor(request, next));
    expect(next).toHaveBeenCalledOnceWith(request);
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
});
