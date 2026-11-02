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

  it('envía IDs y campos reales al crear y editar, y elimina por ID', () => {
    servicio.crear(payload).subscribe();
    servicio.actualizar(7, payload).subscribe();
    servicio.eliminar(7).subscribe();
    const crear = http.expectOne(req => req.url === api + '/activity' && req.method === 'POST');
    expect(crear.request.body).toEqual(payload);
    crear.flush({ success: true, message: '', data: { ...payload, id_actividad: 7 } });
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
      servicio.crear(payload).subscribe({ error: error => fallo = error });
      http.expectOne(api + '/activity').flush({
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
});
