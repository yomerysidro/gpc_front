import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Rol } from '../../../../core/interfaces/roles/rol.interface';
import { AuthService } from '../../../../core/services/autenticacion/auth.service';
import { RolesService } from '../../../../core/services/roles/roles.service';
import { ListaRolesComponent } from './lista-roles.component';

const ROLES: Rol[] = [
  { id: 1, nombre: 'Administrador', estado: true, usuarios: 1 },
  { id: 2, nombre: 'Digitador', estado: true, usuarios: 1 },
];

describe('ListaRolesComponent', () => {
  let rolesService: jasmine.SpyObj<RolesService>;

  const crear = async () => {
    const fixture = TestBed.createComponent(ListaRolesComponent);
    fixture.autoDetectChanges();
    await fixture.whenStable();
    return fixture;
  };
  const fila = (el: HTMLElement, nombre: string) =>
    Array.from(el.querySelectorAll<HTMLTableRowElement>('tbody tr')).find(tr => tr.querySelector('th')?.textContent?.includes(nombre))!;
  /** Nombre de cada acción: su aria-label o su texto sin la ligadura del ícono. */
  const etiquetas = (tr: HTMLElement) => Array.from(tr.querySelectorAll('.rol-acciones a, .rol-acciones button'))
    .map(b => b.getAttribute('aria-label') ?? Array.from(b.childNodes)
      .filter(n => !(n instanceof HTMLElement && n.classList.contains('material-symbols-outlined')))
      .map(n => n.textContent).join('').replace(/\s+/g, ' ').trim());

  beforeEach(() => {
    rolesService = jasmine.createSpyObj<RolesService>('RolesService', ['listar', 'cambiarEstado', 'actualizar', 'crear']);
    rolesService.listar.and.returnValue(of(ROLES));
    TestBed.configureTestingModule({
      imports: [ListaRolesComponent],
      providers: [
        provideRouter([]),
        { provide: RolesService, useValue: rolesService },
        { provide: AuthService, useValue: { tienePermiso: () => true } },
      ],
    });
  });

  it('Administrador: rol del sistema, sin renombrar ni desactivar, pero con sus accesos', async () => {
    const fixture = await crear();
    const admin = fila(fixture.nativeElement, 'Administrador');
    expect(admin.querySelector('.rol-sistema')?.textContent).toBe('Rol del sistema');
    expect(etiquetas(admin)).toEqual(['Configurar accesos de Administrador']);
  });

  it('los demás roles mantienen Editar nombre y Activar/Desactivar', async () => {
    const fixture = await crear();
    const digitador = fila(fixture.nativeElement, 'Digitador');
    expect(digitador.querySelector('.rol-sistema')).toBeNull();
    expect(etiquetas(digitador)).toEqual(['Configurar accesos de Digitador', 'Editar nombre de Digitador', 'Desactivar Digitador']);
  });

  it('si el backend responde 409 igualmente, muestra su mensaje', async () => {
    rolesService.cambiarEstado.and.returnValue(throwError(() => ({ status: 409, mensaje: 'El rol Administrador no se puede desactivar', errores: {} })));
    const fixture = await crear();
    const componente = fixture.componentInstance as unknown as { ejecutar: (r: Rol, a: unknown, t: string) => void };
    componente.ejecutar(ROLES[0], rolesService.cambiarEstado(1, false), '');
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('[role=status] .alert-error')?.textContent).toContain('El rol Administrador no se puede desactivar');
  });
});
