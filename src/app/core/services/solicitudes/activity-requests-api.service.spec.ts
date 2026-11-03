import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ActivityRequestDraft, ActivityRequestRow } from '../../interfaces/solicitudes/activity-requests-api.interface';
import { AUTHENTICATED_REQUEST } from '../../security/auth-request.context';
import { ActivityRequestsApiService, ACTIVITY_REQUESTS_API_ACTIVA } from './activity-requests-api.service';

export const BORRADOR_API_TEST: ActivityRequestDraft = { id_area: 2, id_tipo_actividad: 3, nombre: 'Actividad de prueba', descripcion: null,
  justificacion: 'Justificación de prueba', fecha_inicio_propuesta: '2026-12-10', fecha_fin_propuesta: '2026-12-10', sede_propuesta: null };
export const SOLICITUD_API_TEST: ActivityRequestRow = { ...BORRADOR_API_TEST, descripcion: null, sede_propuesta: null,
  id_solicitud_actividad: 4, id_usuario_solicitante: 8, estado: 'Borrador', fecha_solicitud: '2026-11-02 10:00:00', id_actividad: null };

describe('Contrato HTTP preparado de ActivityRequestWorkflow', () => {
  let api: ActivityRequestsApiService; let http: HttpTestingController;
  const base = `${environment.apiBaseUrl}/activity-requests`;
  function iniciar(activa = true): void {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), { provide: ACTIVITY_REQUESTS_API_ACTIVA, useValue: activa }] });
    api = TestBed.inject(ActivityRequestsApiService); http = TestBed.inject(HttpTestingController);
  }
  afterEach(() => http?.verify());
  it('no hace ninguna petición mientras faltan rutas y autenticación', () => {
    iniciar(false); let errores = 0;
    const operaciones: Observable<unknown>[] = [api.crearBorrador(BORRADOR_API_TEST), api.editarBorrador(4, { nombre: 'Cambio' }), api.enviar(4), api.listar(), api.detalle(4), api.historial(4), api.revisar(4), api.observar(4, 'Motivo'), api.derivar(4), api.aprobar(4), api.rechazar(4, 'Motivo'), api.historialGlobal(), api.detalleRevision(4)];
    for (const operacion of operaciones) {
      operacion.subscribe({ error: error => { expect(error.message).toContain('Modo demostración'); errores++; } });
    }
    expect(errores).toBe(13); http.expectNone(() => true);
  });
  it('crea con lista blanca y nunca transmite identidad, estado, actividad ni versión del cliente', () => {
    iniciar(); api.crearBorrador({ ...BORRADOR_API_TEST, id_usuario_solicitante: 999, id_usuario_responsable: 999, estado: 'Aprobada', id_actividad: 99, version: 'falsa' } as ActivityRequestDraft).subscribe();
    const req = http.expectOne(base); expect(req.request.method).toBe('POST'); expect(req.request.body).toEqual(BORRADOR_API_TEST);
    expect(req.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue(); req.flush({ success: true, message: 'Confirmado', data: SOLICITUD_API_TEST }, { status: 201, statusText: 'Created' });
  });
  it('edita por PUT solo con los campos presentes y envía sin cuerpo', () => {
    iniciar(); api.editarBorrador(4, { nombre: 'Cambio' }).subscribe(); const editar = http.expectOne(base + '/4');
    expect(editar.request.method).toBe('PUT'); expect(editar.request.body).toEqual({ nombre: 'Cambio' }); editar.flush({ success: true, data: SOLICITUD_API_TEST });
    api.enviar(4).subscribe(); const enviar = http.expectOne(base + '/4/submit'); expect(enviar.request.body).toBeNull(); enviar.flush({ success: true, data: { ...SOLICITUD_API_TEST, estado: 'Enviada' } });
  });
  for (const propias of [true, false]) {
    it('consulta ' + (propias ? 'mine' : 'cola general') + ' con filtros reales y paginación Laravel', () => {
      iniciar(); let total = -1;
      api.listar({ estado: 'En revisión', id_area: 2, fecha_desde: '2026-11-01', fecha_hasta: '2026-11-02', page: 2, per_page: 20 }, propias).subscribe(pagina => total = pagina.total);
      const req = http.expectOne(r => r.url === base + (propias ? '/mine' : ''));
      expect(req.request.params.keys().sort()).toEqual(['estado', 'fecha_desde', 'fecha_hasta', 'id_area', 'page', 'per_page']);
      expect(req.request.params.get('estado')).toBe('En revisión'); expect(req.request.params.get('page')).toBe('2');
      req.flush({ success: true, data: { data: [], current_page: 2, last_page: 2, per_page: 20, total: 21 } }); expect(total).toBe(21);
    });
  }
  for (const [metodo, ruta] of [['revisar', 'review'], ['observar', 'observe'], ['derivar', 'derive'], ['aprobar', 'approve'], ['rechazar', 'reject']] as const) {
    it('mapea ' + metodo + ' al endpoint documentado con observación y sin actor', () => {
      iniciar(); if (metodo === 'observar' || metodo === 'rechazar') api[metodo](4, 'Motivo').subscribe(); else api[metodo](4, { observacion: 'Motivo', id_usuario_responsable: 999 } as { observacion: string }).subscribe();
      const req = http.expectOne(`${base}/4/${ruta}`); expect(req.request.method).toBe('POST'); expect(req.request.body).toEqual({ observacion: 'Motivo' });
      req.flush({ success: true, data: SOLICITUD_API_TEST });
    });
  }
  it('consulta detalle e historial por solicitud y conserva vacío confirmado', () => {
    iniciar(); api.detalle(4).subscribe(); http.expectOne(base + '/4').flush({ success: true, data: SOLICITUD_API_TEST });
    let historial: readonly unknown[] | undefined; api.historial(4).subscribe(filas => historial = filas);
    http.expectOne(base + '/4/history').flush({ success: true, data: [] }); expect(historial).toEqual([]);
  });
  it('consulta review-detail y el historial global con los filtros documentados', () => {
    iniciar(); api.detalleRevision(4).subscribe(); const detalle = http.expectOne(base + '/4/review-detail');
    expect(detalle.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue(); detalle.flush({ success: true, data: SOLICITUD_API_TEST });
    api.historialGlobal({ id_solicitud_actividad: 4, id_usuario_responsable: 8, tipo_decision: 'DERIVAR_GERENCIA', fecha_desde: '2026-11-01', fecha_hasta: '2026-11-02', per_page: 50, page: 2 }).subscribe();
    const historial = http.expectOne(req => req.url === base + '/decisions/history');
    expect(historial.request.method).toBe('GET'); expect(historial.request.body).toBeNull();
    expect(historial.request.params.keys().sort()).toEqual(['fecha_desde', 'fecha_hasta', 'id_solicitud_actividad', 'id_usuario_responsable', 'page', 'per_page', 'tipo_decision']);
    expect(historial.request.params.get('tipo_decision')).toBe('DERIVAR_GERENCIA');
    historial.flush({ success: true, data: { data: [], current_page: 2, last_page: 2, per_page: 50, total: 51 } });
  });
  it('conserva 422 por campo y errores 401, 403, 404 y 409 sin fabricar confirmaciones', () => {
    iniciar(); let status = 0; let errores: unknown;
    api.crearBorrador(BORRADOR_API_TEST).subscribe({ error: error => { status = error.status; errores = error.errores; } });
    http.expectOne(base).flush({ success: false, message: 'Datos incorrectos', data: { justificacion: ['Requerida'] } }, { status: 422, statusText: 'Unprocessable Entity' });
    expect(status).toBe(422); expect(errores).toEqual({ justificacion: ['Requerida'] });
    for (const codigo of [401, 403, 404, 409]) {
      api.enviar(4).subscribe({ error: error => status = error.status });
      http.expectOne(base + '/4/submit').flush({ success: false, message: 'Sin confirmar', data: null }, { status: codigo, statusText: 'Error' }); expect(status).toBe(codigo);
    }
  });
  it('rechaza success falso en 200 e identificadores inválidos', () => {
    iniciar(); let errores = 0;
    api.aprobar(4).subscribe({ next: () => fail('No debe confirmar'), error: () => errores++ });
    http.expectOne(base + '/4/approve').flush({ success: false, message: 'No confirmado', data: null });
    api.detalle(NaN).subscribe({ error: () => errores++ }); expect(errores).toBe(2);
  });
});
