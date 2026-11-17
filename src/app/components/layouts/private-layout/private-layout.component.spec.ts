import { TestBed } from '@angular/core/testing';
import { Navigation, provideRouter, Router } from '@angular/router';
import { signal } from '@angular/core';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { PrivateLayoutComponent } from './private-layout.component';

describe('Confirmación visual de sesión', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [PrivateLayoutComponent], providers: [provideRouter([]),
    { provide: AuthService, useValue: { usuario: signal(null), modulos: signal([]), capacidadesSolicitudes: signal(null), tienePermiso: () => false } },
  ] }));
  it('muestra el éxito después del login y permite cerrar el aviso', () => {
    spyOn(TestBed.inject(Router), 'getCurrentNavigation').and.returnValue({ extras: { info: { inicioSesionExitoso: true } } } as Navigation);
    const f = TestBed.createComponent(PrivateLayoutComponent); f.detectChanges();
    const aviso = f.nativeElement.querySelector('main .aviso-sesion[role="status"]');
    expect(aviso.textContent).toContain('Inicio de sesión exitoso.');
    aviso.querySelector('button').click(); f.detectChanges();
    expect(f.nativeElement.querySelector('.aviso-sesion')).toBeNull();
  });
  it('no repite el éxito al abrir una página sin una navegación de login', () => {
    spyOn(TestBed.inject(Router), 'getCurrentNavigation').and.returnValue(null);
    const f = TestBed.createComponent(PrivateLayoutComponent); f.detectChanges();
    expect(f.nativeElement.querySelector('.aviso-sesion')).toBeNull();
  });
});
