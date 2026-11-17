import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/autenticacion/auth.service';

describe('Aviso al iniciar sesión', () => {
  let login: jasmine.Spy;
  beforeEach(() => {
    login = jasmine.createSpy('login').and.returnValue(of({ tipo: 'exito' }));
    TestBed.configureTestingModule({ imports: [LoginComponent], providers: [provideRouter([]),
      { provide: AuthService, useValue: { login, rutaInicial: () => '/inicio' } },
    ] });
  });
  function enviar() {
    const f = TestBed.createComponent(LoginComponent); f.detectChanges();
    const c = f.componentInstance as any;
    c.form.setValue({ email: 'prueba@example.test', password: 'clave-de-prueba' });
    f.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    f.detectChanges(); return f;
  }
  it('envía el aviso transitorio únicamente al confirmar una sesión exitosa', () => {
    const navegar = spyOn(TestBed.inject(Router), 'navigateByUrl').and.resolveTo(true);
    enviar();
    expect(navegar).toHaveBeenCalledOnceWith('/inicio', { info: { inicioSesionExitoso: true } });
  });
  it('un rechazo conserva el error y no envía un aviso de éxito', () => {
    login.and.returnValue(of({ tipo: 'rechazado', mensaje: 'Credenciales incorrectas.' }));
    const navegar = spyOn(TestBed.inject(Router), 'navigateByUrl').and.resolveTo(true);
    const f = enviar();
    expect(navegar).not.toHaveBeenCalled();
    expect(f.nativeElement.querySelector('[role="alert"]').textContent).toContain('Credenciales incorrectas.');
  });
});
