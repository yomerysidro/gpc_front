import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { HomeComponent } from './home.component';
import { AuthService } from '../../core/services/autenticacion/auth.service';
import { ReportesService } from '../../core/services/reportes/reportes.service';

describe('Dashboard institucional', () => {
  let permisos: Set<string>;
  let conteo: jasmine.Spy;
  beforeEach(() => {
    permisos = new Set(['reportes.ver', 'emision.ver', 'actividades.ver']);
    conteo = jasmine.createSpy('totalRegistrados').and.callFake(clave => of(clave === 'certificados' ? 37 : 12));
    TestBed.configureTestingModule({ imports: [HomeComponent], providers: [provideRouter([]),
      { provide: AuthService, useValue: {
        usuario: signal({ nombre: 'Usuario de prueba', rol: 'Rol de prueba' }),
        capacidadesSolicitudes: signal(null), tienePermiso: (clave: string) => permisos.has(clave),
      } },
      { provide: ReportesService, useValue: { totalRegistrados: conteo } },
    ] });
  });
  function iniciar() { const f = TestBed.createComponent(HomeComponent); f.detectChanges(); f.detectChanges(); return f; }
  it('muestra los conteos del servicio y consulta una vez cada indicador autorizado', () => {
    const f = iniciar();
    expect(f.componentInstance.indicadores().map(i => i.valor)).toEqual([37, 12]);
    expect(conteo.calls.allArgs()).toEqual([['certificados'], ['actividades']]);
    expect(f.nativeElement.querySelector('h1').textContent).toContain('Bienvenido al Sistema');
    expect(f.nativeElement.textContent).toContain('Usuario de prueba');
  });
  it('no consulta indicadores ni muestra accesos privados sin permisos', () => {
    permisos.clear(); const f = iniciar();
    expect(conteo).not.toHaveBeenCalled();
    expect(f.componentInstance.indicadores()).toEqual([]);
    expect(f.nativeElement.querySelectorAll('.accesos a').length).toBe(0);

  });
  it('un error no se representa como cero ni bloquea los demás indicadores', () => {
    conteo.and.callFake(clave => clave === 'certificados' ? throwError(() => new Error('No disponible')) : of(12));
    const f = iniciar();
    expect(f.componentInstance.indicadores().map(i => [i.valor, i.estado])).toEqual([[null, 'error'], [12, 'disponible']]);
    expect(f.nativeElement.textContent).toContain('Información no disponible');
  });
});
