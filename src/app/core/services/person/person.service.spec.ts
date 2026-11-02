import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { AUTHENTICATED_REQUEST } from '../../security/auth-request.context';
import { PersonService } from './person.service';

describe('PersonService: contrato HTTP de Gestión', () => {
  let servicio: PersonService;
  let http: HttpTestingController;
  const url = `${environment.apiBaseUrl}/persons`;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    servicio = TestBed.inject(PersonService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('consulta el listado autenticado y acepta una lista vacía', () => {
    let resultado: unknown;
    servicio.listar().subscribe(datos => resultado = datos);
    const consulta = http.expectOne(`${url}/list`);
    expect(consulta.request.method).toBe('GET');
    expect(consulta.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue();
    consulta.flush({ success: true, message: '', data: [] });
    expect(resultado).toEqual([]);
  });

  it('consulta el endpoint real de detalle', () => {
    servicio.obtener(1).subscribe();
    const consulta = http.expectOne(`${url}/detail/1`);
    expect(consulta.request.method).toBe('GET');
    expect(consulta.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue();
    consulta.flush({ success: true, message: '', data: { id_persona: 1, nombres: 'Persona', apellido_paterno: 'Registrada', apellido_materno: null } });
  });

  for (const estado of [401, 403, 404, 500]) {
    it(`conserva el error HTTP ${estado} para su manejo en la página`, () => {
      let recibido: HttpErrorResponse | undefined;
      servicio.listar().subscribe({ error: error => recibido = error });
      http.expectOne(`${url}/list`).flush(
        { success: false, message: 'No autorizado.', data: [] },
        { status: estado, statusText: 'Error' },
      );
      expect(recibido?.status).toBe(estado);
    });
  }

  it('rechaza errores logicos del backend al guardar', () => {
    let mensaje = '';
    servicio.crear({}).subscribe({ error: e => mensaje = e.message });
    http.expectOne(url + '/create').flush({ success: false, message: 'No guardado', data: null });
    expect(mensaje).toBe('No guardado');
  });
});
