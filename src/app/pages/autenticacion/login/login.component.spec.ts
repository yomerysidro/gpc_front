import { TestBed } from '@angular/core/testing';
import { TurnstileApi } from './turnstile';
import { environment } from '../../../../environments/environment';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/autenticacion/auth.service';

describe('Aviso al iniciar sesión', () => {
  let login: jasmine.Spy;
  let completarVerificacion: (token: string) => void;
  const navegador = window as Window & { turnstile?: TurnstileApi };

  const claveOriginal = environment.turnstileSiteKey;

  beforeEach(() => {
    environment.turnstileSiteKey = 'clave-de-widget-simulada';
    navegador.turnstile = {
      render: (_container, options) => {
        completarVerificacion = options.callback;
        return 'widget-login';
      },
      reset: () => {},
      remove: () => {},
    };
    login = jasmine.createSpy('login').and.returnValue(of({ tipo: 'exito' }));
    TestBed.configureTestingModule({ imports: [LoginComponent], providers: [provideRouter([]),
      { provide: AuthService, useValue: { login, rutaInicial: () => '/inicio' } },
    ] });
  });
  afterEach(() => {
    delete navegador.turnstile;
    environment.turnstileSiteKey = claveOriginal;
  });

  async function crearFormulario() {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    await fixture.componentInstance['cargarTurnstile']();
    return fixture;
  }

  async function enviar() {
    const f = await crearFormulario();
    completarVerificacion('token-prueba');
    const c = f.componentInstance as any;
    c.form.setValue({ email: 'prueba@example.test', password: 'clave-de-prueba' });
    f.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    f.detectChanges(); return f;
  }
  it('muestra la verificación entre la contraseña y el botón e impide enviar sin token', async () => {
    const f = await crearFormulario();

    const form: HTMLFormElement = f.nativeElement.querySelector('form');
    const widget = form.querySelector('#verificacion-seguridad');
    const boton = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    expect(form.querySelector('#password')?.closest('.form-field')?.nextElementSibling).toBe(widget);
    expect(widget?.nextElementSibling).toBe(boton);
    expect(boton?.disabled).toBeTrue();

    completarVerificacion('token-prueba');
    f.detectChanges();
    expect(boton?.disabled).toBeFalse();
  });

  it('envía el aviso transitorio únicamente al confirmar una sesión exitosa', async () => {
    const navegar = spyOn(TestBed.inject(Router), 'navigateByUrl').and.resolveTo(true);
    await enviar();
    expect(navegar).toHaveBeenCalledOnceWith('/inicio', { info: { inicioSesionExitoso: true } });
    expect(login).toHaveBeenCalledOnceWith('prueba@example.test', 'clave-de-prueba', 'token-prueba');
  });
  it('un rechazo conserva el error y no envía un aviso de éxito', async () => {
    login.and.returnValue(of({ tipo: 'rechazado', mensaje: 'Credenciales incorrectas.' }));
    const navegar = spyOn(TestBed.inject(Router), 'navigateByUrl').and.resolveTo(true);
    const f = await enviar();
    expect(navegar).not.toHaveBeenCalled();
    expect(f.nativeElement.querySelector('[role="alert"]').textContent).toContain('Credenciales incorrectas.');
  });
});
