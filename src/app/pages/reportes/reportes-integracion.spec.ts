import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from '../../core/services/autenticacion/auth.service';
import { ReportesService } from '../../core/services/reportes/reportes.service';
import { AUTHENTICATED_REQUEST } from '../../core/security/auth-request.context';
import { environment } from '../../../environments/environment';
import { ReportesCertificadosComponent } from './reportes-certificados/reportes-certificados.component';
import { ReportesAsistenciaComponent } from './reportes-asistencia/reportes-asistencia.component';
import { IndicadoresGeneralesComponent } from './indicadores-generales/indicadores-generales.component';

describe('Reportes completos contra el contrato HTTP del backend', () => {
  let http: HttpTestingController;
  let permisos: Set<string>;
  const base = `${environment.apiBaseUrl}/reportes`;
  const pagina = (data: unknown[], total = data.length, resumen = { total }) => ({ success: true, data: {
    data, total, current_page: 1, last_page: Math.max(1, Math.ceil(total / 20)), per_page: 20, resumen, filtros: {}, criterio_fecha: 'fecha_emision',
  } });
  beforeEach(() => {
    permisos = new Set(['reportes.ver', 'emision.ver', 'participantes.ver', 'actividades.ver', 'reportes.exportar']);
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(),
      { provide: AuthService, useValue: { tienePermiso: (clave: string) => permisos.has(clave) } },
    ] });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('envía fechas, búsqueda y estados al servidor y conserva el filtro aplicado al paginar certificados', async () => {
    const fixture = TestBed.createComponent(ReportesCertificadosComponent);
    fixture.detectChanges();
    http.expectOne(r => r.url.endsWith('/tipos-certificado/list')).flush(pagina([]));
    http.expectOne(r => r.url === `${base}/certificados`).flush(pagina([]));
    fixture.detectChanges(); await fixture.whenStable();
    const c = fixture.componentInstance;
    c.inicio = '2026-02-01'; c.fin = '2026-02-28'; c.busqueda = 'Ana Pérez'; c.tipo = '3'; c.estado = 'FIRMADO'; c.estadoDocumento = 'Vigente';
    c.consultar();
    const req = http.expectOne(r => r.url === `${base}/certificados`);
    expect(req.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue();
    expect(req.request.params.get('desde')).toBe('2026-02-01');
    expect(req.request.params.get('hasta')).toBe('2026-02-28');
    expect(req.request.params.get('q')).toBe('Ana Pérez');
    expect(req.request.params.get('id_tipo_certificado')).toBe('3');
    expect(req.request.params.get('estado')).toBe('FIRMADO');
    req.flush(pagina([{ id_certificado: 7, beneficiario: 'Ana Pérez', estado: 'FIRMADO' }], 45, { total: 45, con_fecha_emision: 30, personas_unicas: 20 } as never));
    expect(c.conFecha()).toBe(30);
    c.busqueda = 'otro filtro sin aplicar'; c.cargar(2);
    const siguiente = http.expectOne(r => r.url === `${base}/certificados`);
    expect(siguiente.request.params.get('page')).toBe('2'); expect(siguiente.request.params.get('q')).toBe('Ana Pérez');
    siguiente.flush(pagina([]));
  });

  it('consulta asistencias paginadas por sesión y fecha y muestra cero sin inventar ausencias', async () => {
    const f = TestBed.createComponent(ReportesAsistenciaComponent);
    f.detectChanges();
    http.expectOne(r => r.url === `${base}/actividades`).flush({ success: true, data: { data: [], total: 0, current_page: 1, last_page: 1, per_page: 20, filtros: {}, criterio_fecha: 'fecha_inicio' } });
    http.expectOne(r => r.url === `${base}/asistencia`).flush(pagina([], 0, { total: 0, presentes: 0, personas_unicas: 0 } as never));
    f.detectChanges(); await f.whenStable();
    const c = f.componentInstance;
    c.actividad = '5'; c.sesion = '9'; c.inicio = '2026-02-01'; c.estado = 'PRESENTE'; c.consultar();
    const req = http.expectOne(r => r.url === `${base}/asistencia`);
    expect(req.request.params.get('id_actividad')).toBe('5'); expect(req.request.params.get('id_actividad_sesion')).toBe('9');
    expect(req.request.params.get('desde')).toBe('2026-02-01');
    req.flush(pagina([], 0, { total: 0, presentes: 0, personas_unicas: 0 } as never));
    expect(c.pagina()?.total).toBe(0); expect(c.error()).toBe('');
  });

  it('cambiar actividad borra la sesión anterior y carga solo las sesiones de la nueva actividad', async () => {
    const fixture = TestBed.createComponent(ReportesAsistenciaComponent);
    fixture.detectChanges();
    http.expectOne(r => r.url === `${base}/actividades`).flush({ success: true, data: { data: [], total: 0, current_page: 1, last_page: 1, per_page: 20, filtros: {}, criterio_fecha: 'fecha_inicio' } });
    http.expectOne(r => r.url === `${base}/asistencia`).flush(pagina([]));
    fixture.detectChanges(); await fixture.whenStable();
    const c = fixture.componentInstance;
    c.actividad = '3'; c.sesion = '8'; c.seleccionarActividad();
    expect(c.sesion).toBe('');
    const req = http.expectOne(r => r.url === `${base}/sesiones`);
    expect(req.request.params.get('id_actividad')).toBe('3'); expect(req.request.params.get('per_page')).toBe('20');
    req.flush(pagina([{ id_actividad_sesion: 4, id_actividad: 3, nombre: 'Sesión 3', fecha: '2026-02-01' }]));
    expect(c.sesiones()?.data.length).toBe(1);
  });

  it('exporta desde el servidor con los filtros y sin limitarse a una página', () => {
    const api = TestBed.inject(ReportesService);
    const archivo = new Blob(['reporte'], { type: 'text/csv' });
    api.exportar('asistencia', { desde: '2026-01-01', hasta: '', estado: '', q: 'Ana', id_actividad: '1', id_actividad_sesion: '' }).subscribe(resultado => expect(resultado).toBe(archivo));
    const req = http.expectOne(r => r.url === `${base}/asistencia`);
    expect(req.request.params.get('exportar')).toBe('csv'); expect(req.request.params.has('page')).toBeFalse();
    expect(req.request.responseType).toBe('blob'); expect(req.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue();
    req.flush(archivo);
  });

  it('preserva una serie válida si la otra falla y valida el año antes de consultar', () => {
    const fixture = TestBed.createComponent(IndicadoresGeneralesComponent);
    fixture.detectChanges();
    for (const indicador of ['actividades', 'certificados', 'participaciones', 'asistencias']) {
      http.expectOne(`${base}/indicadores/${indicador}`).flush({ success: true, data: { indicador, total: 0, filtros: [] } });
    }
    const c = fixture.componentInstance;
    c.anio = 2026; c.cargarSeries();
    http.expectOne(r => r.url === `${base}/series/actividades`).flush({ success: true, data: { indicador: 'actividades', anio: 2026, criterio_fecha: 'fecha_inicio', meses: Array.from({ length: 12 }, (_, i) => ({ mes: `2026-${String(i + 1).padStart(2, '0')}`, total: i === 0 ? 10 : 0 })) } });
    http.expectOne(r => r.url === `${base}/series/certificados`).flush({}, { status: 500, statusText: 'Error' });
    expect(c.series()[0].datos?.meses[0].total).toBe(10); expect(c.series()[1].error).toContain('servidor');
    c.anio = 2200; c.cargarSeries(); expect(c.errorAnio()).toContain('año'); http.expectNone(() => true);
  });

  it('rechaza un resumen inconsistente en lugar de mostrar un total incorrecto', () => {
    const api = TestBed.inject(ReportesService);
    api.asistencias(1, { desde: '', hasta: '', estado: '', q: '', id_actividad: '', id_actividad_sesion: '' }).subscribe({ next: () => fail('Debe rechazarlo'), error: error => expect(error.message).toContain('resumen') });
    http.expectOne(r => r.url === `${base}/asistencia`).flush(pagina([], 3, { total: 5 }));
  });
});
