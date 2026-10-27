import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/autenticacion/auth.service';
import { HasPermissionDirective } from './has-permission.directive';

@Component({
  standalone: true,
  imports: [HasPermissionDirective, RouterLink],
  template: `
    <button id="crear" *appHasPermission="'usuarios.crear'">Nuevo usuario</button>
    <button id="editar" *appHasPermission="clave()">Editar</button>
    <a id="enlace" *appHasPermission="'usuarios.editar'" routerLink="/usuarios/1/editar">Editar</a>
  `,
})
class AnfitrionComponent {
  readonly clave = signal('usuarios.editar');
}

describe('HasPermissionDirective', () => {
  const permisos = signal<readonly string[]>([]);

  beforeEach(() => {
    permisos.set([]);
    TestBed.configureTestingModule({
      imports: [AnfitrionComponent],
      providers: [provideRouter([]), {
        provide: AuthService,
        useValue: { tienePermiso: (clave: string) => permisos().includes(clave) },
      }],
    });
  });

  const render = () => {
    const fixture = TestBed.createComponent(AnfitrionComponent);
    fixture.detectChanges();
    return fixture;
  };

  it('oculta el elemento si el usuario no tiene la clave', () => {
    const fixture = render();
    expect(fixture.nativeElement.querySelector('#crear')).toBeNull();
    expect(fixture.nativeElement.querySelector('#editar')).toBeNull();
  });

  it('muestra solo los elementos cuya clave tiene el usuario', () => {
    permisos.set(['usuarios.crear']);
    const fixture = render();
    expect(fixture.nativeElement.querySelector('#crear')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#editar')).toBeNull();
  });

  it('reacciona cuando cambian los permisos de la sesión', () => {
    const fixture = render();
    permisos.set(['usuarios.crear', 'usuarios.editar']);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('button').length).toBe(2);
    expect(fixture.nativeElement.querySelector('#enlace')?.getAttribute('href')).toBe('/usuarios/1/editar');
    permisos.set([]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('button').length).toBe(0);
  });

  it('reacciona cuando cambia la clave pedida', () => {
    permisos.set(['usuarios.ver']);
    const fixture = render();
    expect(fixture.nativeElement.querySelector('#editar')).toBeNull();
    fixture.componentInstance.clave.set('usuarios.ver');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#editar')).not.toBeNull();
  });

  it('crea vistas con RouterLink sin escribir signals dentro del efecto (NG0600)', () => {
    permisos.set(['usuarios.editar']);
    expect(() => render()).not.toThrow();
  });

  it('no crea la vista dos veces si el permiso se mantiene', () => {
    permisos.set(['usuarios.crear']);
    const fixture = render();
    permisos.set(['usuarios.crear', 'otro.permiso']);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('#crear').length).toBe(1);
  });
});
