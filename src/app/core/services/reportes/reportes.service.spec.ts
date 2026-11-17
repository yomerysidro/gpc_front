import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { AUTHENTICATED_REQUEST } from '../../security/auth-request.context';
import { ReportesService } from './reportes.service';

describe('ReportesService contra el contrato Laravel paginado', () => {
  let servicio: ReportesService;
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    servicio = TestBed.inject(ReportesService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('consulta el COUNT autenticado y conserva un cero válido', () => {
    servicio.totalRegistrados('asistencias').subscribe(total => expect(total).toBe(0));
    const req = http.expectOne(`${environment.apiBaseUrl}/reportes/indicadores/asistencias`);
    expect(req.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue();
    expect(req.request.params.keys()).toEqual([]);
    req.flush({ success: true, data: { indicador: 'asistencias', total: 0, filtros: [] } });
  });

  for (const total of [null, -1, '20', 1.5]) {
    it('rechaza un total inválido: ' + String(total), () => {
      servicio.totalRegistrados('actividades').subscribe({ next: () => fail('No debe inventar un conteo'), error: error => expect(error.message).toContain('conteo no válido') });
      http.expectOne(`${environment.apiBaseUrl}/reportes/indicadores/actividades`).flush({ success: true, data: { indicador: 'actividades', total, filtros: [] } });
    });
  }

  it('envía solo filtros soportados, marca autenticación y no descarga páginas siguientes', () => {
    servicio.certificados(2, '0', '3').subscribe(pagina => expect(pagina.total).toBe(70));
    const req = http.expectOne(request => request.url === `${environment.apiBaseUrl}/certificados/list`);
    expect(req.request.method).toBe('GET');
    expect(req.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue();
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('per_page')).toBe('20');
    expect(req.request.params.get('estado')).toBe('0');
    expect(req.request.params.get('id_tipo_certificado')).toBe('3');
    expect(req.request.params.has('fecha_desde')).toBeFalse();
    req.flush({ success: true, data: { data: [], total: 70, current_page: 2, last_page: 4, per_page: 20 } });
    http.expectNone(() => true);
  });

  it('usa total del paginador y no el tamaño de la página como indicador', () => {
    servicio.totalDocumentos('GENERADO').subscribe(total => expect(total).toBe(1205));
    const req = http.expectOne(request => request.url.endsWith('/certificados-documentos/list'));
    expect(req.request.params.get('per_page')).toBe('1');
    expect(req.request.params.get('estado')).toBe('GENERADO');
    req.flush({ success: true, data: { data: [{}], total: 1205, current_page: 1, last_page: 1205, per_page: 1 } });
  });

  it('rechaza una lista no paginada en vez de inventar un total', () => {
    servicio.totalCertificados().subscribe({ next: () => fail('La respuesta debe rechazarse'), error: error => expect(error.message).toContain('formato') });
    http.expectOne(request => request.url.endsWith('/certificados/list')).flush({ success: true, data: [] });
  });

  it('propaga el 403 sin convertirlo en cero ni en datos ficticios', () => {
    servicio.totalCertificados().subscribe({ next: () => fail('No debe emitir datos'), error: error => expect(error.status).toBe(403) });
    http.expectOne(request => request.url.endsWith('/certificados/list')).flush({ message: 'No autorizado.' }, { status: 403, statusText: 'Forbidden' });
  });
});
