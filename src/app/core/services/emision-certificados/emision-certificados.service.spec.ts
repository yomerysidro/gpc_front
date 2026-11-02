import { HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Observable } from 'rxjs';
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
  const payloads: Pick<PayloadEmision, 'certificados' | 'tipos-certificado' | 'reconocimientos' | 'certificados-documentos' | 'firmas' | 'actividades-firmas'> = {
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

  it('recorre todas las paginas del historial con el filtro del certificado intacto', () => {
    let codigos: readonly string[] = [];
    service.listarTodos('certificados-documentos', { id_certificado: 8 }).subscribe(filas => { codigos = filas.map(fila => fila.codigo_verificacion); });
    const primera = http.expectOne(req => req.url.endsWith('/certificados-documentos/list') && req.params.get('page') === '1');
    expect(primera.request.params.get('id_certificado')).toBe('8');
    expect(primera.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue();
    primera.flush({ success: true, data: { data: [{ codigo_verificacion: 'VERSION-2' }], current_page: 1, last_page: 2 } });
    const segunda = http.expectOne(req => req.params.get('page') === '2');
    expect(segunda.request.params.get('id_certificado')).toBe('8');
    expect(segunda.request.params.get('per_page')).toBe('100');
    segunda.flush({ success: true, data: { data: [{ codigo_verificacion: 'VERSION-1' }], current_page: 2, last_page: 2 } });
    expect(codigos).toEqual(['VERSION-2', 'VERSION-1']);
  });

  it('no entrega un historial parcial si falla una pagina posterior', () => {
    service.listarTodos('certificados-documentos', { id_certificado: 8 }).subscribe({
      next: () => fail('No debe presentar un historial incompleto como completo'),
      error: (error: ErrorApi) => expect(error.status).toBe(503),
    });
    http.expectOne(req => req.params.get('page') === '1').flush({ success: true, data: { data: [], current_page: 1, last_page: 2 } });
    http.expectOne(req => req.params.get('page') === '2').flush({ message: 'Servicio no disponible.' }, { status: 503, statusText: 'Unavailable' });
  });

  it('usa trabajadores reales y conserva solo los campos necesarios para la relacion', () => {
    service.trabajadores().subscribe(filas => expect(filas).toEqual([{ id_persona_trabajador: 4, id_persona: 6, id_area: 2, cargo: 'Cargo de prueba', estado: true }]));
    const request = http.expectOne(`${environment.apiBaseUrl}/person-workers/list`);
    expect(request.request.withCredentials).toBeTrue();
    request.flush({ success: true, data: [{ id_persona_trabajador: 4, id_persona: 6, id_area: 2, cargo: 'Cargo de prueba', estado: true, dato_no_necesario: 'omitido' }] });
    http.expectNone(req => req.url.includes('/persons/'));
  });

  it('resuelve persona y area por las rutas de detalle existentes sin conservar datos personales innecesarios', () => {
    service.personaReconocimiento(6).subscribe(persona => expect(persona).toEqual({ id_persona: 6, nombres: 'Nombre de prueba', apellido_paterno: 'Apellido de prueba', apellido_materno: null }));
    const persona = http.expectOne(`${environment.apiBaseUrl}/persons/detail/6`);
    expect(persona.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue();
    expect(persona.request.withCredentials).toBeTrue();
    persona.flush({ success: true, data: { id_persona: 6, nombres: 'Nombre de prueba', apellido_paterno: 'Apellido de prueba', apellido_materno: null, telefono: 'no conservar', correo: 'no conservar' } });
    service.areaReconocimiento(2).subscribe(area => expect(area).toEqual({ id_area: 2, nombre: 'Área de prueba' }));
    const area = http.expectOne(`${environment.apiBaseUrl}/areas/detail/2`);
    expect(area.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue();
    area.flush({ success: true, data: { id_area: 2, nombre: 'Área de prueba', dato_interno: 'no conservar' } });
  });

  it('respeta la denegacion de Gestion al consultar los nombres y areas', () => {
    const consultas: readonly (readonly [Observable<unknown>, string])[] = [[service.personaReconocimiento(6), 'persons/detail/6'], [service.areaReconocimiento(2), 'areas/detail/2']];
    for (const [peticion, ruta] of consultas) {
      peticion.subscribe({ next: () => fail('No debe conceder acceso'), error: (error: ErrorApi) => expect(error.status).toBe(403) });
      http.expectOne(`${environment.apiBaseUrl}/${ruta}`).flush({ message: 'No autorizado.' }, { status: 403, statusText: 'Forbidden' });
    }
  });

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
    for (const recurso of Object.keys(payloads) as (keyof typeof payloads)[]) {
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
    lista.flush({ success: true, data: { data: [], total: 0, current_page: 1, per_page: 20, last_page: 1 } });
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
      ['id_persona_trabajador', 'person-workers/list', 'cargo'],
      ['id_practica', 'practices/list', 'carrera'], ['id_participacion', 'participation', 'id_persona'],
      ['id_actividad', 'activity', 'nombre'],
    ];
    for (const [campo, ruta, texto] of relaciones) {
      service.relaciones(campo).subscribe(opciones => expect(opciones[0].id).toBe(1));
      const request = http.expectOne(`${environment.apiBaseUrl}/${ruta}`);
      expect(request.request.method).toBe('GET');
      request.flush({ success: true, data: [{ [campo]: 1, [texto]: 'Relacionado' }] });
    }
  });

  it('consulta personas existentes y respeta una denegación de Gestión sin sustituirla por datos locales', () => {
    service.relaciones('id_persona').subscribe({ next: () => fail('No debe ocultar el 403'), error: (error: ErrorApi) => expect(error.status).toBe(403) });
    http.expectOne(`${environment.apiBaseUrl}/persons/list`).flush({ message: 'No autorizado' }, { status: 403, statusText: 'Forbidden' });
  });

  it('consulta la lista real de personas practicantes para resolver beneficiarios de práctica', () => {
    service.relacionRegistros('practicing-individuals/list').subscribe(filas => expect(filas[0]['id_persona']).toBe(8));
    const request = http.expectOne(`${environment.apiBaseUrl}/practicing-individuals/list`);
    expect(request.request.method).toBe('GET');
    expect(request.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue();
    request.flush({ success: true, message: '', data: [{ id_persona_practicante: 3, id_persona: 8, codigo: 'P-3', estado: 'ACTIVO' }] });
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
