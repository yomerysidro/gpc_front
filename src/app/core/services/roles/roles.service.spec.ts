import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { ErrorApi } from '../../interfaces/api/api-response.interface';
import { AUTHENTICATED_REQUEST } from '../../security/auth-request.context';
import { aErrorApi } from '../../../shared/utils/error-api';
import { ModulosService } from '../modulos/modulos.service';
import { RolesService } from './roles.service';

describe('RolesService y ModulosService', () => {
  let roles: RolesService;
  let modulos: ModulosService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    roles = TestBed.inject(RolesService);
    modulos = TestBed.inject(ModulosService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('reemplaza módulos y permisos del rol con el cuerpo del contrato', async () => {
    const mods = firstValueFrom(roles.actualizarModulos(4, [10, 11]));
    const req = http.expectOne('/api/roles/4/modulos');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ modulos: [10, 11] });
    expect(req.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue();
    req.flush({ success: true, message: '', data: [10, 11] });
    expect(await mods).toEqual([10, 11]);

    roles.actualizarPermisos(4, [{ idModulo: 10, idPermiso: 37 }]).subscribe();
    const reqPermisos = http.expectOne('/api/roles/4/permisos');
    expect(reqPermisos.request.body).toEqual({ permisos: [{ idModulo: 10, idPermiso: 37 }] });
    reqPermisos.flush({ success: true, message: '', data: [] });
  });

  it('crea permisos bajo su módulo y los edita en /api/permisos', () => {
    modulos.crearPermiso(11, { nombre: 'Ver', clave: 'zz.ver' }).subscribe();
    expect(http.expectOne('/api/modulos/11/permisos').request.method).toBe('POST');
    modulos.cambiarEstadoPermiso(41, false).subscribe();
    const req = http.expectOne('/api/permisos/41/estado');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ estado: false });
  });

  it('devuelve el 409 del rol Administrador con su message', async () => {
    let error: ErrorApi | null = null;
    roles.actualizarModulos(1, [1]).subscribe({ error: e => error = e });
    http.expectOne('/api/roles/1/modulos').flush(
      { success: false, message: 'No se puede quitar este módulo al rol Administrador', data: [] },
      { status: 409, statusText: '' },
    );
    expect(error!).toEqual({ status: 409, mensaje: 'No se puede quitar este módulo al rol Administrador', errores: {} });
  });
});

describe('aErrorApi', () => {
  it('lee el 422 de Laravel (errors) y el de las asignaciones de un rol (data)', () => {
    const laravel = aErrorApi(new HttpErrorResponse({
      status: 422, error: { message: 'La clave ya ha sido registrada.', errors: { clave: ['La clave ya ha sido registrada.'] } },
    }));
    expect(laravel.errores['clave']).toEqual(['La clave ya ha sido registrada.']);

    const asignacion = aErrorApi(new HttpErrorResponse({
      status: 422,
      error: { success: false, message: 'Hay permisos que no se pueden asignar al rol.', data: { 'permisos.0': 'El módulo 3 no está asignado al rol.' } },
    }));
    expect(asignacion.mensaje).toBe('Hay permisos que no se pueden asignar al rol.');
    expect(asignacion.errores).toEqual({ 'permisos.0': ['El módulo 3 no está asignado al rol.'] });
  });

  it('no inventa errores por campo fuera del 422', () => {
    expect(aErrorApi(new HttpErrorResponse({ status: 409, error: { message: 'x', data: [] } })).errores).toEqual({});
    expect(aErrorApi(new Error('red')).status).toBe(0);
  });
});
