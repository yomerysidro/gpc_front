import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ActivityRequestRow, TIPOS_DECISION_SOLICITUD } from '../../interfaces/solicitudes/activity-requests-api.interface';
import { DatosSolicitud, FiltroSolicitudes, PaginaSolicitudes, Solicitud } from '../../interfaces/solicitudes/solicitud.interface';
import { ACTIVITY_REQUESTS_API_ACTIVA } from './activity-requests-api.service';
import { AUTORIZACION_SOLICITUDES, AutorizacionSolicitudes, SolicitudesHttpGateway } from './solicitudes-http.gateway';
import { SolicitudesService } from './solicitudes.service';

describe('Adaptación del contrato a las cinco pantallas existentes', () => {
  const base = environment.apiBaseUrl + '/activity-requests';
  const fila: ActivityRequestRow = { id_solicitud_actividad: 4, id_area: 2, id_tipo_actividad: 3, id_usuario_solicitante: 8, nombre: 'Actividad de prueba', descripcion: null,
    justificacion: 'Justificación', fecha_inicio_propuesta: '2026-12-01', fecha_fin_propuesta: '2026-12-02', sede_propuesta: null, fecha_solicitud: '2026-11-02 10:00:00', estado: 'Borrador', id_actividad: null };
  const filtro: FiltroSolicitudes = { busqueda: '', estado: '', desde: '', hasta: '', pagina: 1 };
  let http: HttpTestingController; let gateway: SolicitudesHttpGateway;
  function iniciar(autorizado = true, activa = true, administrativo = true): void {
    const acceso: AutorizacionSolicitudes = { contexto: () => of({ areasDisponibles: [{ id: '2', nombre: 'Área autorizada de prueba' }], responsable: 'Usuario de prueba', puedeCrear: true }),
      consultaRevision: administrativo, consultaGerencia: administrativo, consultaHistorial: administrativo, consultaDetalle: administrativo, consultaPropias: true,
      capacidades: () => ({ propia: true, puedeEditar: true, acciones: ['Enviar', 'Iniciar revisión', 'Observar', 'Derivar', 'Aprobar', 'Rechazar'] }) };
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), { provide: ACTIVITY_REQUESTS_API_ACTIVA, useValue: activa }, { provide: AUTORIZACION_SOLICITUDES, useValue: autorizado ? acceso : null }] });
    http = TestBed.inject(HttpTestingController); gateway = TestBed.inject(SolicitudesHttpGateway);
  }
  afterEach(() => http?.verify());
  it('mantiene el servicio pendiente si falta autorizacion aunque las rutas se marquen activas', () => {
    iniciar(false); const fachada = TestBed.inject(SolicitudesService); expect(fachada.integrado).toBeFalse(); expect(fachada.modo).toBe('pendiente');
    gateway.listar('gerencia', filtro).subscribe({ error: error => expect(error.message).toContain('temporalmente no disponible') }); http.expectNone(() => true);
  });
  it('conecta el gateway solo con ambas dependencias explícitas y mapea sin inventar capacidades de estados', () => {
    iniciar(); expect(TestBed.inject(SolicitudesService).integrado).toBeTrue(); let vista: Solicitud | undefined;
    gateway.listar('propias', filtro).subscribe(pagina => vista = pagina.registros[0]);
    http.expectOne(r => r.url === base + '/mine').flush({ success: true, data: { data: [fila], total: 1, current_page: 1, last_page: 1, per_page: 20 } });
    expect(vista?.objetivo).toBe('Justificación'); expect(vista?.acciones).toEqual(['Enviar']); expect(vista?.version).toBe(''); expect(vista?.numero).toBe('Solicitud 4');
    expect(vista?.idSolicitudActividad).toBe(4); expect(typeof vista?.idSolicitudActividad).toBe('number');
    expect(vista?.responsable).toBe('No informado'); expect(vista?.area).toBe('No informado');
  });
  it('mapea el formulario al DTO sin observaciones adicionales, versión ni identidad', () => {
    iniciar(); const datos: DatosSolicitud = { areaId: '2', tipoId: '3', nombre: 'Actividad de prueba', descripcion: '', objetivo: 'Justificación', inicio: '2026-12-01', fin: '2026-12-02', lugar: '', observaciones: 'No existe en Laravel' };
    gateway.guardar(datos, null).subscribe(); const req = http.expectOne(base);
    expect(req.request.body).toEqual({ id_area: 2, id_tipo_actividad: 3, nombre: datos.nombre, descripcion: null, justificacion: datos.objetivo, fecha_inicio_propuesta: datos.inicio, fecha_fin_propuesta: datos.fin, sede_propuesta: null });
    req.flush({ success: true, data: fila }); gateway.decidir('4', 'no-enviar-version', 'Enviar', '').subscribe();
    const enviar = http.expectOne(base + '/4/submit'); expect(enviar.request.body).toBeNull(); enviar.flush({ success: true, data: { ...fila, estado: 'Enviada' } });
  });
  it('consulta el historial global paginado sin requerir una solicitud y conserva las cinco decisiones reales', () => {
    iniciar();
    let total = 0; let resultados: readonly string[] = [];
    gateway.historial(filtro).subscribe(pagina => { total = pagina.total; resultados = pagina.registros.map(item => item.resultado); });
    http.expectOne(req => req.url === base + '/decisions/history').flush({ success: true, data: { current_page: 1, last_page: 1, per_page: 20, total: 5, data: TIPOS_DECISION_SOLICITUD.map((tipo_decision, index) => ({ id_solicitud_decision: index + 1, id_solicitud_actividad: 4, id_usuario_responsable: 8, tipo_decision, estado_anterior: 'Enviada', estado_nuevo: 'Observada', fecha_decision: '2026-11-02 10:00:00', observacion: null, id_usuario_solicitante: 8, id_area: 2, solicitud_nombre: 'Nombre real de respuesta de prueba' })) } });
    expect(total).toBe(5); expect(resultados).toContain('Revisión conforme'); expect(resultados).toContain('Derivada a Gerencia');
  });
  it('utiliza los nombres del historial sin sustituirlos por IDs', () => {
    iniciar();
    gateway.historial(filtro).subscribe(pagina => {
      expect(pagina.registros[0].area).toBe('Área recibida de Laravel');
      expect(pagina.registros[0].responsable).toBe('Responsable recibido de Laravel');
    });
    http.expectOne(req => req.url === base + '/decisions/history').flush({ success: true, data: {
      current_page: 1, last_page: 1, per_page: 20, total: 1, data: [{ id_solicitud_decision: 1,
        id_solicitud_actividad: 4, id_usuario_responsable: 8, id_usuario_solicitante: 9, id_area: 5,
        solicitud_nombre: 'Solicitud de prueba', area_nombre: 'Área recibida de Laravel', responsable_nombre: 'Responsable recibido de Laravel',
        tipo_decision: 'REVISION_CONFORME', estado_anterior: 'Enviada', estado_nuevo: 'En revisión', fecha_decision: '2026-11-03', observacion: null }] } });
  });
  it('permite corregir una Observada propia y reenviar solo tras confirmar el PUT', () => {
    iniciar(); let editable = false;
    gateway.detalle('4').subscribe(registro => editable = registro.puedeEditar);
    http.expectOne(base + '/4').flush({ success: true, data: { ...fila, estado: 'Observada' } }); expect(editable).toBeTrue();
    const datos: DatosSolicitud = { areaId: '2', tipoId: '3', nombre: 'Corrección', descripcion: '', objetivo: 'Justificación corregida', inicio: '2026-12-01', fin: '2026-12-02', lugar: '', observaciones: '' };
    gateway.guardar(datos, { id: '4', version: '' }).subscribe(registro => gateway.decidir(registro.id, registro.version, 'Enviar', '').subscribe());
    http.expectNone(base + '/4/submit'); const editar = http.expectOne(base + '/4'); expect(editar.request.method).toBe('PUT');
    expect(editar.request.body.id_usuario_solicitante).toBeUndefined(); editar.flush({ success: true, data: { ...fila, nombre: 'Corrección', estado: 'Observada' } });
    http.expectOne(base + '/4/submit').flush({ success: true, data: { ...fila, estado: 'Enviada' } });
  });
  it('usa review-detail en la consulta administrativa sin cambiar el detalle del propietario', () => {
    iniciar(); gateway.detalle('4', true).subscribe(); const detalle = http.expectOne(base + '/4/review-detail');
    expect(detalle.request.method).toBe('GET'); detalle.flush({ success: true, data: fila });
    gateway.detalle('4').subscribe(); http.expectOne(base + '/4').flush({ success: true, data: fila });
  });
  it('transmite filtros globales exactos y conserva la paginación del servidor', () => {
    iniciar(); let total = 0;
    gateway.historial({ ...filtro, solicitudId: '4', responsableId: '8', estado: 'Observada', desde: '2026-11-01', hasta: '2026-11-02', pagina: 2 }).subscribe(pagina => total = pagina.total);
    const req = http.expectOne(req => req.url === base + '/decisions/history');
    expect(req.request.params.get('tipo_decision')).toBe('OBSERVAR'); expect(req.request.params.get('id_solicitud_actividad')).toBe('4');
    expect(req.request.params.get('id_usuario_responsable')).toBe('8'); expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.has('estado')).toBeFalse(); expect(req.request.params.has('busqueda')).toBeFalse();
    req.flush({ success: true, data: { current_page: 2, last_page: 3, per_page: 20, total: 41, data: [] } }); expect(total).toBe(41);
  });
  it('no consulta historial global ni detalle administrativo sin facultades verificadas', () => {
    iniciar(true, true, false); let rechazos = 0;
    gateway.historial(filtro).subscribe({ error: () => rechazos++ }); gateway.detalle('4', true).subscribe({ error: () => rechazos++ });
    expect(rechazos).toBe(2); http.expectNone(() => true);
  });
  it('mantiene ineditables los estados posteriores y no reenvía si falla la corrección', () => {
    iniciar(); const datos: DatosSolicitud = { areaId: '2', tipoId: '3', nombre: 'Corrección', descripcion: '', objetivo: 'Motivo', inicio: '2026-12-01', fin: '2026-12-02', lugar: '', observaciones: '' };
    gateway.detalle('4').subscribe(registro => expect(registro.puedeEditar).toBeFalse());
    http.expectOne(base + '/4').flush({ success: true, data: { ...fila, estado: 'Aprobada' } });
    gateway.guardar(datos, { id: '4', version: '' }).subscribe({ next: () => fail('No debe guardar'), error: () => {} }); http.expectNone(req => req.method === 'PUT');
    gateway.detalle('4').subscribe(); http.expectOne(base + '/4').flush({ success: true, data: { ...fila, estado: 'Observada' } });
    gateway.guardar(datos, { id: '4', version: '' }).subscribe({ next: registro => gateway.decidir(registro.id, '', 'Enviar', '').subscribe(), error: () => {} });
    http.expectOne(base + '/4').flush({ success: false, message: 'Cambio concurrente', data: null }, { status: 409, statusText: 'Conflict' });
    http.expectNone(base + '/4/submit');
  });
  it('busca en todas las páginas sin enviar parámetros de texto que Laravel no admite', () => {
    iniciar(); let pagina: PaginaSolicitudes<Solicitud> | undefined;
    gateway.listar('revision', { ...filtro, busqueda: 'Coincidente' }).subscribe(valor => pagina = valor);
    const primera = http.expectOne(r => r.url === base); expect(primera.request.params.has('busqueda')).toBeFalse();
    primera.flush({ success: true, data: { data: [fila], total: 2, current_page: 1, last_page: 2, per_page: 100 } });
    const segunda = http.expectOne(r => r.params.get('page') === '2'); segunda.flush({ success: true, data: { data: [{ ...fila, id_solicitud_actividad: 5, nombre: 'Coincidente' }], total: 2, current_page: 2, last_page: 2, per_page: 100 } });
    expect(pagina?.total).toBe(1); expect(pagina?.registros[0].id).toBe('5');
  });
  it('usa el listado real para pendientes de Gerencia y no integra documentos por firmar', () => {
    iniciar(); gateway.listar('gerencia', { ...filtro, estado: 'Pendiente de aprobación' }).subscribe(); const req = http.expectOne(r => r.url === base);
    expect(req.request.params.get('estado')).toBe('Pendiente de aprobación'); req.flush({ success: true, data: { data: [], total: 0, current_page: 1, last_page: 1, per_page: 20 } });
    gateway.documentos(1).subscribe({ error: error => expect(error.message).toContain('no forma parte') }); http.expectNone(() => true);
  });
});
