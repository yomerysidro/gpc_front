import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { ErrorApi } from '../../interfaces/api/api-response.interface';
import { AUTHENTICATED_REQUEST } from '../../security/auth-request.context';
import { RolesService } from '../roles/roles.service';
import { UsuariosService } from './usuarios.service';

describe('UsuariosService', () => {
  let service: UsuariosService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(UsuariosService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  const error = async (promesa: Promise<unknown>): Promise<ErrorApi> => {
    try {
      await promesa;
    } catch (e) {
      return e as ErrorApi;
    }
    throw new Error('Se esperaba un error');
  };

  it('envía solo los filtros con valor y marca la solicitud como autenticada', () => {
    service.listar({ search: 'perez', estado: false, page: 2 }).subscribe();
    const req = http.expectOne(r => r.url === '/api/usuarios');
    expect(req.request.params.keys().sort()).toEqual(['estado', 'page', 'search']);
    expect(req.request.params.get('estado')).toBe('false');
    expect(req.request.params.get('idRol')).toBeNull();
    expect(req.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue();
    req.flush({ success: true, message: '', data: [], meta: { total: 0, page: 2, perPage: 10 } });
  });

  it('devuelve los errores 422 por campo', async () => {
    const resultado = error(firstValueFrom(service.crear({ dni: '1', correo: 'x', idRol: 1 })));
    http.expectOne('/api/usuarios').flush(
      { message: 'La persona no está registrada: faltan sus datos.', errors: { nombres: ['El campo nombres es obligatorio.'] } },
      { status: 422, statusText: '' },
    );
    const e = await resultado;
    expect(e.status).toBe(422);
    expect(e.errores['nombres']).toEqual(['El campo nombres es obligatorio.']);
  });

  it('devuelve el message del backend en los 409 y 429', async () => {
    const conflicto = error(firstValueFrom(service.cambiarEstado(1, false)));
    const req = http.expectOne('/api/usuarios/1/estado');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ estado: false });
    req.flush({ success: false, message: 'No puede desactivar su propia cuenta.', data: [] }, { status: 409, statusText: '' });
    expect(await conflicto).toEqual({ status: 409, mensaje: 'No puede desactivar su propia cuenta.', errores: {} });

    const limite = error(firstValueFrom(service.restablecerPassword(2)));
    http.expectOne('/api/usuarios/2/restablecer-password')
      .flush({ success: false, message: 'Ya se envió un enlace hace poco.', data: [] }, { status: 429, statusText: '' });
    expect((await limite).status).toBe(429);
  });

  it('obtener desenvuelve data', async () => {
    const usuario = firstValueFrom(service.obtener(2));
    http.expectOne('/api/usuarios/2').flush({ success: true, message: '', data: { id: 2, nombre: 'Maria Perez' } });
    expect((await usuario).nombre).toBe('Maria Perez');
  });

  it('RolesService lista los roles con la solicitud autenticada', async () => {
    const roles = firstValueFrom(TestBed.inject(RolesService).listar());
    const req = http.expectOne('/api/roles');
    expect(req.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue();
    req.flush({ success: true, message: '', data: [{ id: 1, nombre: 'Administrador', estado: true }] });
    expect((await roles).length).toBe(1);
  });
});
