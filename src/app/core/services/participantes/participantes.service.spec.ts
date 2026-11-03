import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ErrorApi } from '../../interfaces/api/api-response.interface';
import { AUTHENTICATED_REQUEST } from '../../security/auth-request.context';
import { authInterceptor } from '../../interceptors/auth.interceptor';
import { AuthService } from '../autenticacion/auth.service';
import { SessionAuthService } from '../autenticacion/session-auth.service';
import { ParticipantesService } from './participantes.service';

describe('ParticipantesService y contrato Laravel', () => {
  let servicio: ParticipantesService;
  let http: HttpTestingController;
  const api = environment.apiBaseUrl;
  const payload = { id_persona: 1, id_actividad: 2, id_tipo_participacion: 3, fecha_inscripcion: '2026-11-02', estado: 'ACTIVO' };
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient(withInterceptors([authInterceptor])),
      provideHttpClientTesting(), { provide: AuthService, useClass: SessionAuthService }] });
    servicio = TestBed.inject(ParticipantesService); http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('consulta los listados completos y transmite la cookie mediante el interceptor real', () => {
    servicio.listar().subscribe(); servicio.personas().subscribe(); servicio.documentos().subscribe(); servicio.actividades().subscribe(); servicio.tipos().subscribe();
    for (const ruta of ['/participation', '/persons/list', '/person-documents/list', '/activity', '/participation-type']) {
      const consulta = http.expectOne(api + ruta);
      expect(consulta.request.method).toBe('GET');
      expect(consulta.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue(); expect(consulta.request.withCredentials).toBeTrue();
      consulta.flush({ success: true, message: '', data: [] });
    }
  });
  it('respeta detalle, creación, actualización y PATCH de estado sin inventar rutas', () => {
    servicio.obtener(7).subscribe(); servicio.crear(payload).subscribe(); servicio.actualizar(7, payload).subscribe(); servicio.cambiarEstado(7, 'RETIRADO').subscribe();
    for (const metodo of ['GET', 'POST', 'PUT', 'PATCH']) {
      const consulta = http.expectOne(r => r.method === metodo && r.url === api + (metodo === 'POST' ? '/participation' : '/participation/7'));
      expect(consulta.request.withCredentials).toBeTrue();
      expect(consulta.request.body).toEqual(metodo === 'GET' ? null : metodo === 'PATCH' ? { estado: 'RETIRADO' } : payload);
      consulta.flush({ success: true, message: 'Confirmado.', data: { ...payload, id_participacion: 7 } });
    }
  });
  it('preserva los errores por campo 422 tanto en errors como en data', () => {
    for (const clave of ['errors', 'data']) {
      let error: ErrorApi | undefined;
      servicio.crear(payload).subscribe({ error: recibido => error = recibido });
      http.expectOne(api + '/participation').flush({ message: 'Datos inválidos.', [clave]: { estado: ['Estado incorrecto.'] } }, { status: 422, statusText: 'Unprocessable Entity' });
      expect(error?.errores['estado']).toEqual(['Estado incorrecto.']);
    }
  });
  for (const status of [403, 404, 409, 500]) {
    it(`propaga HTTP ${status} sin convertirlo en una lista vacía`, () => {
      let error: ErrorApi | undefined;
      servicio.listar().subscribe({ next: () => fail('No debe fabricar datos'), error: recibido => error = recibido });
      http.expectOne(api + '/participation').flush({ message: 'Rechazado.' }, { status, statusText: 'Error' });
      expect(error?.status).toBe(status);
    });
  }
  it('rechaza respuestas lógicas fallidas aunque tengan HTTP 200', () => {
    let error: ErrorApi | undefined;
    servicio.crear(payload).subscribe({ next: () => fail('No debe mostrar éxito'), error: recibido => error = recibido });
    http.expectOne(api + '/participation').flush({ success: false, message: 'No se guardó.', data: null });
    expect(error?.mensaje).toBe('No se guardó.');
  });
});
