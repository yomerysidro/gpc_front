import { HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ErrorApi } from '../../interfaces/api/api-response.interface';
import { PayloadEmision, RecursoEditable, RecursoEliminable, RecursoEmision } from '../../interfaces/emision-certificados/emision-certificados.interface';
import { AUTHENTICATED_REQUEST } from '../../security/auth-request.context';
import { authInterceptor } from '../../interceptors/auth.interceptor';
import { AuthService } from '../autenticacion/auth.service';
import { SessionAuthService } from '../autenticacion/session-auth.service';
import { EmisionCertificadosService } from './emision-certificados.service';

describe('Contrato HTTP de Emisión con Laravel', () => {
  let service: EmisionCertificadosService;
  let http: HttpTestingController;
  const recursos: readonly RecursoEmision[] = ['certificados', 'tipos-certificado', 'reconocimientos',
    'certificados-documentos', 'firmas', 'certificados-firmas', 'consultas-certificado', 'actividades-firmas'];
  const payloads: PayloadEmision = {
    certificados: { id_persona: 1, id_tipo_certificado: 1, id_reconocimiento: null, id_participacion: 2,
      id_practica: null, fecha_emision: '2026-10-27', estado: true, notificado: false, fecha_notificacion: null },
    'tipos-certificado': { nombre_tipo: 'Asistencia', estado: 'ACTIVO' },
    reconocimientos: { id_persona_trabajador: 1, titulo: 'Mérito', descripcion: 'Servicio', motivo: 'Trabajo', fecha_reconocimiento: '2026-10-27', estado: 'ACTIVO' },
    'certificados-documentos': { id_certificado: 1, codigo_verificacion: 'TEST', ruta_archivo: 'certificados/prueba.pdf', motivo_reemision: null, estado: 'GENERADO', fecha_generacion: '2026-10-27' },
    firmas: { id_persona_trabajador: 1, ruta_archivo_pfx: 'firmas/prueba.pfx', passphrase: 'solo-fixture-de-prueba', fecha_firma: '2026-10-27' },
    'actividades-firmas': { id_actividad: 1, id_firma: 1, orden_firma: 1 },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      provideRouter([]), provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting(),
      { provide: AuthService, useClass: SessionAuthService },
    ] });
    service = TestBed.inject(EmisionCertificadosService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('usa /list y /detail en las ocho entidades, conserva la paginación anidada y envía cookies', () => {
    for (const recurso of recursos) {
      service.listar(recurso, { page: 2, per_page: 20 }).subscribe(pagina => {
        expect(pagina.current_page).toBe(2); expect(pagina.total).toBe(21); expect(pagina.data.length).toBe(1);
      });
      const request = http.expectOne(req => req.url === `${environment.apiBaseUrl}/${recurso}/list`);
      expect(request.request.method).toBe('GET');
      expect(request.request.params.get('page')).toBe('2');
      expect(request.request.params.get('per_page')).toBe('20');
      expect(request.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue();
      expect(request.request.withCredentials).toBeTrue();
      request.flush({ success: true, message: '', data: { data: [{}], current_page: 2, last_page: 2, total: 21, per_page: 20 } });
      service.obtener(recurso, 7).subscribe();
      http.expectOne(`${environment.apiBaseUrl}/${recurso}/detail/7`).flush({ success: true, message: '', data: {} });
    }
  });

  it('usa POST create, PATCH update y DELETE delete únicamente para las operaciones habilitadas', () => {
    for (const recurso of Object.keys(payloads) as RecursoEditable[]) {
      service.crear(recurso, payloads[recurso]).subscribe();
      const crear = http.expectOne(`${environment.apiBaseUrl}/${recurso}/create`);
      expect(crear.request.method).toBe('POST');
      expect(crear.request.body).toEqual(payloads[recurso]);
      crear.flush({ success: true, data: {} });
      service.actualizar(recurso, 7, payloads[recurso]).subscribe();
      const actualizar = http.expectOne(`${environment.apiBaseUrl}/${recurso}/update/7`);
      expect(actualizar.request.method).toBe('PATCH');
      actualizar.flush({ success: true, data: {} });
      if (recurso !== 'certificados-documentos') {
        service.eliminar(recurso as RecursoEliminable, 7).subscribe();
        const eliminar = http.expectOne(`${environment.apiBaseUrl}/${recurso}/delete/7`);
        expect(eliminar.request.method).toBe('DELETE'); eliminar.flush({ success: true, data: null });
      }
    }
  });

  it('codifica booleanos como 1/0 y conserva los errores 422 por campo del Data de Laravel', () => {
    service.listar('certificados', { estado: false, notificado: true, id_practica: null }).subscribe();
    const lista = http.expectOne(req => req.url.endsWith('/certificados/list'));
    expect(lista.request.params.get('estado')).toBe('0');
    expect(lista.request.params.get('notificado')).toBe('1');
    expect(lista.request.params.has('id_practica')).toBeFalse();
    lista.flush({ data: { data: [], total: 0, current_page: 1, per_page: 20, last_page: 1 } });
    service.crear('tipos-certificado', payloads['tipos-certificado']).subscribe({
      next: () => fail('Debe rechazar el 422'),
      error: (error: ErrorApi) => expect(error.errores['nombre_tipo']).toEqual(['Ya existe.']),
    });
    http.expectOne(`${environment.apiBaseUrl}/tipos-certificado/create`).flush(
      { success: false, message: 'Invalid validation data.', data: { nombre_tipo: ['Ya existe.'] } },
      { status: 422, statusText: 'Unprocessable Entity' },
    );
  });

  it('preserva el mensaje de autorización y conflictos históricos', () => {
    for (const status of [403, 409, 503]) {
      service.listar('certificados').subscribe({
        next: () => fail('Debe emitir el error'),
        error: (error: ErrorApi) => { expect(error.status).toBe(status); expect(error.mensaje).toBe('Operación restringida.'); },
      });
      http.expectOne(`${environment.apiBaseUrl}/certificados/list`).flush({ message: 'Operación restringida.' }, { status, statusText: 'Error' });
    }
  });

  it('solo consulta las rutas reales de las relaciones de Gestión y Actividades', () => {
    const relaciones = [
      ['id_persona', 'persons/list', 'nombres'], ['id_persona_trabajador', 'person-workers/list', 'cargo'],
      ['id_practica', 'practices/list', 'carrera'], ['id_participacion', 'participation', 'id_persona'],
      ['id_actividad', 'activity', 'nombre'],
    ];
    for (const [campo, ruta, texto] of relaciones) {
      service.relaciones(campo).subscribe(opciones => expect(opciones[0].id).toBe(1));
      const request = http.expectOne(`${environment.apiBaseUrl}/${ruta}`);
      expect(request.request.method).toBe('GET');
      request.flush({ data: [{ [campo]: 1, [texto]: 'Relacionado' }] });
    }
  });

  it('conserva la sesión ante un 403 de Laravel sin conceder acceso ni redirigir al login', () => {
    const auth = TestBed.inject(AuthService);
    const router = TestBed.inject(Router);
    const navegar = spyOn(router, 'navigate');
    auth.cargarSesion().subscribe();
    http.expectOne(`${environment.apiBaseUrl}/auth/me`).flush({
      user: { id: 1, nombre: 'Prueba', email: 'prueba@example.test', rol: 'Administrador' },
      modulos: [], permisos: [],
    });
    service.listar('certificados').subscribe({
      next: () => fail('Laravel debe denegar la consulta'),
      error: (error: ErrorApi) => expect(error.status).toBe(403),
    });
    http.expectOne(`${environment.apiBaseUrl}/certificados/list`).flush(
      { success: false, message: 'No autorizado.', data: [] }, { status: 403, statusText: 'Forbidden' },
    );
    expect(auth.isAuthenticated()).toBeTrue();
    expect(auth.tienePermiso('emision.ver')).toBeFalse();
    expect(navegar).not.toHaveBeenCalled();
  });
});
