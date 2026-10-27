import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Modulo } from '../../../../core/interfaces/roles/modulo.interface';
import { AuthService } from '../../../../core/services/autenticacion/auth.service';
import { ModulosService } from '../../../../core/services/modulos/modulos.service';
import { CatalogoModulosComponent } from './catalogo-modulos.component';

const REPORTES: Modulo = {
  id: 10, nombre: 'Reportes', url: '/reportes', imagen: 'bar_chart', estado: true,
  permisos: [{ id: 37, idModulo: 10, nombre: 'Ver Reportes', clave: 'reportes.ver', valor: null, comentario: null, estado: true }],
};
const VACIO: Modulo = { id: 11, nombre: 'Sin permisos', url: '/sin-permisos', imagen: null, estado: true, permisos: [] };

describe('CatalogoModulosComponent', () => {
  let servicio: jasmine.SpyObj<ModulosService>;
  let fixture: ComponentFixture<CatalogoModulosComponent>;

  type Interno = {
    abrirModulo(m: Modulo | null): void;
    abrirPermiso(m: Modulo, p: Modulo['permisos'][number] | null): void;
    guardarModulo(): void;
    guardarPermiso(): void;
  };
  const componente = () => fixture.componentInstance as unknown as Interno;
  const $ = <T extends Element>(selector: string) => fixture.nativeElement.querySelector(selector) as T;
  const escribir = async (selector: string, valor: string) => {
    const input = $<HTMLInputElement>(selector);
    input.value = valor;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  };

  beforeEach(async () => {
    servicio = jasmine.createSpyObj<ModulosService>('ModulosService',
      ['listar', 'crear', 'actualizar', 'cambiarEstado', 'crearPermiso', 'actualizarPermiso', 'cambiarEstadoPermiso']);
    servicio.listar.and.returnValue(of([REPORTES, VACIO]));
    TestBed.configureTestingModule({
      imports: [CatalogoModulosComponent],
      providers: [
        { provide: ModulosService, useValue: servicio },
        { provide: AuthService, useValue: { tienePermiso: () => true } },
      ],
    });
    fixture = TestBed.createComponent(CatalogoModulosComponent);
    fixture.autoDetectChanges();
    await fixture.whenStable();
  });

  it('con permisos, la URL del módulo es de solo lectura y explica por qué', async () => {
    componente().abrirModulo(REPORTES);
    await fixture.whenStable();
    expect($<HTMLInputElement>('#modulo-url').readOnly).toBeTrue();
    expect($('#modulo-url-ayuda').textContent).toContain('No se puede cambiar porque las claves de sus permisos dependen de ella');

    componente().abrirModulo(VACIO);
    await fixture.whenStable();
    expect($<HTMLInputElement>('#modulo-url').readOnly).toBeFalse();
  });

  it('si el backend responde 409 al editar el módulo, muestra su mensaje', async () => {
    servicio.actualizar.and.returnValue(throwError(() => ({
      status: 409, mensaje: 'No se puede cambiar la URL de un módulo que tiene permisos', errores: {},
    })));
    componente().abrirModulo(REPORTES);
    await fixture.whenStable();
    componente().guardarModulo();
    await fixture.whenStable();
    expect($('dialog[open] [role=alert]').textContent).toContain('No se puede cambiar la URL de un módulo que tiene permisos');
  });

  it('el prefijo "<slug>." es fijo y la clave se envía compuesta con la acción', async () => {
    servicio.crearPermiso.and.returnValue(of({ success: true, message: '', data: REPORTES.permisos[0] }));
    componente().abrirPermiso(REPORTES, null);
    await fixture.whenStable();
    expect($('#permiso-prefijo').textContent).toContain('reportes.');
    await escribir('#permiso-nombre', 'Exportar reportes');
    expect($<HTMLInputElement>('#permiso-accion').value).toBe('exportar');
    componente().guardarPermiso();
    expect(servicio.crearPermiso).toHaveBeenCalledOnceWith(10, jasmine.objectContaining({ clave: 'reportes.exportar' }));
  });

  it('al editar un permiso muestra solo su acción', async () => {
    componente().abrirPermiso(REPORTES, REPORTES.permisos[0]);
    await fixture.whenStable();
    expect($<HTMLInputElement>('#permiso-accion').value).toBe('ver');
  });

  it('rechaza en el navegador una acción con mayúsculas o espacios', async () => {
    componente().abrirPermiso(REPORTES, null);
    await fixture.whenStable();
    await escribir('#permiso-nombre', 'Algo');
    await escribir('#permiso-accion', 'Mal Accion');
    componente().guardarPermiso();
    await fixture.whenStable();
    expect(servicio.crearPermiso).not.toHaveBeenCalled();
    expect($('#permiso-clave-error').textContent).toContain('minúsculas');
  });

  it('muestra el 422 del backend (errors.clave) bajo el campo y lo limpia al corregir', async () => {
    servicio.crearPermiso.and.returnValue(throwError(() => ({
      status: 422, mensaje: 'La clave ya ha sido registrada.', errores: { clave: ['La clave ya ha sido registrada.'] },
    })));
    componente().abrirPermiso(REPORTES, null);
    await fixture.whenStable();
    await escribir('#permiso-nombre', 'Ver');
    componente().guardarPermiso();
    await fixture.whenStable();
    expect($('#permiso-clave-error').textContent).toContain('La clave ya ha sido registrada.');
    expect($('#permiso-accion').getAttribute('aria-invalid')).toBe('true');

    await escribir('#permiso-accion', 'consultar');
    expect($('#permiso-clave-error').textContent?.trim()).toBe('');
  });
});
