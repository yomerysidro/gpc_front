import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { ErrorApi } from '../../interfaces/api/api-response.interface';
import { ActividadPayload } from '../../interfaces/actividades/actividad.interface';
import { AUTHENTICATED_REQUEST } from '../../security/auth-request.context';
import { ActividadesService } from './actividades.service';

describe('ActividadesService: contrato de Laravel', () => {
  let servicio: ActividadesService;
  let http: HttpTestingController;
  const api = environment.apiBaseUrl;
  const payload: ActividadPayload = {
    id_area: 2, id_tipo_actividad: 3, nombre: 'Capacitación', descripcion: null,
    fecha_inicio: '2026-10-01', fecha_fin: '2026-10-02', sede: null, estado: 'Activa',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    servicio = TestBed.inject(ActividadesService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  it('bloquea el POST de alta incluso si un consumidor antiguo invoca crear', () => {
    servicio.crear(payload).subscribe({ next: () => fail('Alta directa'), error: error => expect(error.status).toBe(403) });
    http.expectNone(req => req.method === 'POST');
  });
  it('usa solo áreas administrativas autorizadas y conserva los IDs y credenciales', () => {
    const areas = [{ id_area: 5, nombre: 'Área autorizada A' }, { id_area: 42, nombre: 'Área autorizada B' }];
    servicio.listarAreas().subscribe(datos => expect(datos).toEqual(areas));
    const req = http.expectOne(api + '/areas/list');
    expect(req.request.withCredentials).toBeTrue(); req.flush({ success: true, data: areas });
    http.expectNone(api + '/activity-requests/authorized-areas');
  });
  for (const status of [401, 403, 0]) it(`no transforma un error ${status} de áreas en opciones ficticias`, () => {
    servicio.listarAreas().subscribe({ next: () => fail('No debe inventar áreas'), error: error => expect(error.status).toBe(status) });
    const req = http.expectOne(api + '/areas/list');
    if (status === 0) req.error(new ProgressEvent('error'));
    else req.flush({ message: 'Acceso denegado' }, { status, statusText: 'Error' });
  });
  it('no envía origen, solicitud ni identidad aunque el objeto de lectura los contenga', () => {
    servicio.actualizar(7, { ...payload, origen: 'solicitud', id_solicitud_actividad: 7, id_usuario_responsable: 99 } as ActividadPayload).subscribe();
    const req = http.expectOne(api + '/activity/7'); expect(req.request.body).toEqual(payload);
    req.flush({ success: true, data: { ...payload, id_actividad: 9, origen: 'sin_solicitud', id_solicitud_actividad: null } });
  });

  it('usa los prefijos reales y marca todas las consultas para el interceptor existente', () => {
    servicio.listar().subscribe(datos => expect(datos).toEqual([]));
    servicio.listarAreas().subscribe();
    servicio.listarTipos().subscribe();
    servicio.obtener(7).subscribe();
    for (const ruta of ['/activity', '/areas/list', '/ativicty-type', '/activity/7']) {
      const req = http.expectOne(api + ruta);
      expect(req.request.method).toBe('GET');
      expect(req.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue();
      req.flush({ success: true, message: '', data: [] });
    }
  });

  it('envía IDs y campos reales al editar y elimina por ID', () => {
    servicio.actualizar(7, payload).subscribe();
    servicio.eliminar(7).subscribe();
    const editar = http.expectOne(req => req.url === api + '/activity/7' && req.method === 'PUT');
    expect(editar.request.body).toEqual(payload);
    expect(editar.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue();
    editar.flush({ success: true, message: '', data: { ...payload, id_actividad: 7 } });
    const eliminar = http.expectOne(api + '/activity/7');
    expect(eliminar.request.method).toBe('DELETE');
    eliminar.flush({ success: true, message: '', data: null });
  });

  it('conserva los errores por campo tanto en data como en errors de un 422', () => {
    for (const clave of ['data', 'errors']) {
      let fallo: ErrorApi | undefined;
      servicio.actualizar(7, payload).subscribe({ error: error => fallo = error });
      http.expectOne(api + '/activity/7').flush({
        success: false, message: 'Datos incorrectos.', [clave]: { fecha_fin: ['El periodo debe incluir las sesiones.'] },
      }, { status: 422, statusText: 'Unprocessable Entity' });
      expect(fallo?.errores['fecha_fin']).toEqual(['El periodo debe incluir las sesiones.']);
    }
  });

  it('conserva la restricción 409 al eliminar una actividad con relaciones', () => {
    let fallo: ErrorApi | undefined;
    servicio.eliminar(7).subscribe({ error: error => fallo = error });
    http.expectOne(api + '/activity/7').flush({ message: 'La actividad tiene sesiones.' }, { status: 409, statusText: 'Conflict' });
    expect(fallo).toEqual({ status: 409, mensaje: 'La actividad tiene sesiones.', errores: {} });
  });

  it('cambia el estado con PATCH sin sobrescribir otros campos y envía credenciales mediante el interceptor', () => {
    servicio.cambiarEstado(7, 'Cerrada').subscribe();
    const req = http.expectOne(api + '/activity/7');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ estado: 'Cerrada' });
    expect(req.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue();
    req.flush({ success: true, message: 'Actividad actualizada.', data: { ...payload, id_actividad: 7, estado: 'Cerrada' } });
  });

  it('consulta únicamente las personas de los ponentes asignados a la actividad seleccionada', () => {
    servicio.consultarPonentes(7).subscribe(ponentes => {
      expect(ponentes.length).toBe(1);
      expect(ponentes[0].nombre).toBe('Ana Pérez');
    });
    http.expectOne(api + '/activity-speaker').flush({ success: true, data: [
      { id_actividad_ponente: 1, id_actividad: 7, id_persona_ponente: 8 },
      { id_actividad_ponente: 2, id_actividad: 9, id_persona_ponente: 10 },
    ] });
    http.expectOne(api + '/person-speakers/detail/8').flush({ success: true, data: { id_persona_ponente: 8, id_persona: 22 } });
    http.expectOne(api + '/persons/detail/22').flush({ success: true, data: { id_persona: 22, nombres: 'Ana', apellido_paterno: 'Pérez', apellido_materno: null } });
    http.expectNone(api + '/person-speakers/detail/10');
  });

  it('no oculta la asignación ni inventa un nombre si un catálogo devuelve 403', () => {
    servicio.consultarPonentes(7).subscribe(ponentes => {
      expect(ponentes[0].id_persona_ponente).toBe(8);
      expect(ponentes[0].nombre).toBeNull();
      expect(ponentes[0].errorNombre).toBe('No autorizado.');
    });
    http.expectOne(api + '/activity-speaker').flush({ success: true, data: [{ id_actividad_ponente: 1, id_actividad: 7, id_persona_ponente: 8 }] });
    http.expectOne(api + '/person-speakers/detail/8').flush({ message: 'No autorizado.' }, { status: 403, statusText: 'Forbidden' });
  });

  it('reutiliza catálogos reales de Ponentes y Personas de RR. HH.', () => {
    servicio.listarCatalogoPonentes().subscribe(opciones => expect(opciones).toEqual([{ id_persona_ponente: 8, nombre: 'Ana Pérez' }]));
    const ponentes = http.expectOne(api + '/person-speakers/list');
    expect(ponentes.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue();
    ponentes.flush({ success: true, data: [{ id_persona_ponente: 8, id_persona: 22 }] });
    http.expectOne(api + '/persons/list').flush({ success: true, data: [{ id_persona: 22, nombres: 'Ana', apellido_paterno: 'Pérez', apellido_materno: null }] });
  });

  it('vincula y desvincula con IDs de la relación, credenciales y rutas confirmadas en Laravel', () => {
    servicio.vincularPonente(7, 8).subscribe();
    const crear = http.expectOne(api + '/activity-speaker');
    expect(crear.request.method).toBe('POST'); expect(crear.request.withCredentials).toBeTrue();
    expect(crear.request.body).toEqual({ id_actividad: 7, id_persona_ponente: 8 });
    crear.flush({ success: true, data: { id_actividad_ponente: 21, id_actividad: 7, id_persona_ponente: 8 } });
    servicio.desvincularPonente(21).subscribe();
    const quitar = http.expectOne(api + '/activity-speaker/21'); expect(quitar.request.method).toBe('DELETE');
    quitar.flush({ success: true, data: null });
    http.expectNone(api + '/activity');
  });

  it('rechaza un cierre que Laravel no confirmó', () => {
    servicio.cambiarEstado(7, 'Cerrada').subscribe({ next: () => fail('No confirmado'), error: error => expect(error.status).toBe(502) });
    http.expectOne(api + '/activity/7').flush({ success: false, data: { ...payload, id_actividad: 7, estado: 'Activa' } });
  });
});
