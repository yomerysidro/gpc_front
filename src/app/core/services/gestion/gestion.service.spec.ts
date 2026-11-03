import { HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { authInterceptor } from '../../interceptors/auth.interceptor';
import { AUTHENTICATED_REQUEST } from '../../security/auth-request.context';
import { AuthService } from '../autenticacion/auth.service';
import { SessionAuthService } from '../autenticacion/session-auth.service';
import { GestionError } from './gestion.models';
import { errorGestion, GestionService } from './gestion.service';

describe('GestionService: contrato Laravel y sesión por cookie', () => {
  let api: GestionService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      provideRouter([]), provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting(),
      { provide: AuthService, useClass: SessionAuthService },
    ] });
    api = TestBed.inject(GestionService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('consulta personas reales mediante /list y envía las cookies con el interceptor existente', () => {
    let resultado: unknown;
    api.listar('persona').subscribe(registros => resultado = registros);
    const req = http.expectOne(`${environment.apiBaseUrl}/persons/list`);
    expect(req.request.method).toBe('GET');
    expect(req.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue();
    expect(req.request.withCredentials).toBeTrue();
    const registros = [{ id_persona: 17, nombres: 'Persona de prueba' }];
    req.flush({ success: true, message: '', data: registros });
    expect(resultado).toEqual(registros);
  });

  it('conserva los errores por campo del ApiResponse de Gestión (data con arrays)', () => {
    let resultado: GestionError | undefined;
    api.crear('persona_documento', { id_persona: 17, id_tipo_documento: 2, numero_documento: '', estado: 'vigente' })
      .subscribe({ error: error => resultado = error });
    const req = http.expectOne(`${environment.apiBaseUrl}/person-documents/create`);
    expect(req.request.method).toBe('POST');
    req.flush({ success: false, message: 'Datos inválidos.', data: { numero_documento: ['El número es obligatorio.'] } },
      { status: 422, statusText: 'Unprocessable Content' });
    expect(resultado?.campos['numero_documento']).toEqual(['El número es obligatorio.']);
  });

  it('envía IDs numéricos, null y false sin cambiarlos al actualizar', () => {
    const payload = { id_persona: 17, id_area: 4, cargo: 'Analista', fecha_ingreso: '2026-01-01', fecha_fin: null, estado: false };
    api.actualizar('persona_trabajador', 9, payload).subscribe();
    const req = http.expectOne(`${environment.apiBaseUrl}/person-workers/update/9`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    expect(req.request.withCredentials).toBeTrue();
    req.flush({ success: true, message: '', data: { ...payload, id_persona_trabajador: 9 } });
  });

  it('consulta el detalle y conserva el conflicto al eliminar un registro con dependencias', () => {
    api.obtener('practica_supervisor', 6).subscribe();
    const detalle = http.expectOne(`${environment.apiBaseUrl}/supervisory-internships/detail/6`);
    expect(detalle.request.method).toBe('GET');
    detalle.flush({ success: true, message: '', data: { id_practica_supervisor: 6 } });
    let resultado: GestionError | undefined;
    api.eliminar('practica_supervisor', 6).subscribe({ error: error => resultado = error });
    const borrar = http.expectOne(`${environment.apiBaseUrl}/supervisory-internships/delete/6`);
    expect(borrar.request.method).toBe('DELETE');
    borrar.flush({ success: false, message: 'La supervisión sustenta certificados y debe conservarse.', data: null },
      { status: 409, statusText: 'Conflict' });
    expect(resultado?.status).toBe(409);
    expect(resultado?.mensaje).toContain('debe conservarse');
  });

  it('rechaza una respuesta de listado que no cumple el contrato', () => {
    let error: GestionError | undefined;
    api.listar('institucion').subscribe({ error: e => error = e });
    http.expectOne(`${environment.apiBaseUrl}/institutions/list`).flush({ success: true, data: { inesperado: [] } });
    expect(error?.mensaje).toContain('formato esperado');
  });

  it('distingue conexión y autorización sin mostrar detalles internos del servidor', () => {
    expect(errorGestion(new HttpErrorResponse({ status: 0 })).mensaje).toContain('conexión');
    expect(errorGestion(new HttpErrorResponse({ status: 403 })).status).toBe(403);
    expect(errorGestion(new HttpErrorResponse({ status: 500, error: { message: 'SQL con datos internos' } })).mensaje)
      .not.toContain('SQL');
  });
});
