import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthService } from '../../core/services/autenticacion/auth.service';
import { PersonService } from '../../core/services/person/person.service';
import { PersonComponent } from './person';
describe('Personas y su permiso exacto de Laravel', () => {
  it('conserva listado y deniega escrituras sin permisos efectivos', async () => {
    const listar = jasmine.createSpy().and.returnValue(of([]));
    await TestBed.configureTestingModule({ imports: [PersonComponent], providers: [
      provideHttpClient(), provideHttpClientTesting(),
      { provide: AuthService, useValue: { tienePermiso: (clave: string) => clave === 'personas.verpersonas' } },
      { provide: PersonService, useValue: { listar } },
    ] }).compileComponents();
    const fixture = TestBed.createComponent(PersonComponent); fixture.detectChanges();
    const vista = fixture.nativeElement as HTMLElement;
    expect(listar).toHaveBeenCalled();
    expect(vista.querySelector<HTMLButtonElement>('.encabezado button')!.disabled).toBeTrue();
    expect(vista.textContent).toContain('personas.crear');
    expect(vista.querySelectorAll('app-gestion-table').length).toBe(1);
  });
});
