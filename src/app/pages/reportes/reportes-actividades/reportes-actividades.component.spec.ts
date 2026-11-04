import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { environment } from '../../../../environments/environment';
import { AUTHENTICATED_REQUEST } from '../../../core/security/auth-request.context';
import { ActividadReporte } from '../../../core/services/reportes/reportes.service';
import { ReportesActividadesComponent } from './reportes-actividades.component';

describe('Reporte general de actividades con paginación de Laravel', () => {
  let http: HttpTestingController;
  let permisos: Set<string>;
  const url = `${environment.apiBaseUrl}/reportes/actividades`;
  const fila: ActividadReporte = { id_actividad: 35, nombre: 'Actividad registrada', tipo_actividad: 'Curso', fecha_inicio: '2026-02-15', fecha_fin: null, estado: 'Activa', sede: 'Municipalidad' };
  const respuesta = (data: readonly ActividadReporte[] = [fila], page = 1, total = 35) => ({ success: true, data: {
    data, total, current_page: page, last_page: Math.max(1, Math.ceil(total / 20)), per_page: 20,
    filtros: { desde: null, hasta: null, estado: '', q: '' }, criterio_fecha: 'fecha_inicio',
  } });

  beforeEach(() => {
    permisos = new Set(['reportes.ver', 'actividades.ver']);
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(),
      { provide: AuthService, useValue: { tienePermiso: (clave: string) => permisos.has(clave) } },
    ] });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('lista sin código obligatorio y muestra el total del servidor, no el tamaño de la página', () => {
    const fixture = TestBed.createComponent(ReportesActividadesComponent);
    fixture.detectChanges(); fixture.componentInstance.consultar();
    const req = http.expectOne(request => request.url === url);
    expect(req.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue();
    expect(req.request.params.get('page')).toBe('1');
    expect(req.request.params.get('per_page')).toBe('20');
    expect(req.request.params.has('codigo')).toBeFalse();
    req.flush(respuesta()); fixture.detectChanges();
    expect(fixture.componentInstance.pagina()?.total).toBe(35);
    expect(fixture.nativeElement.textContent).toContain('Curso');
    expect(fixture.nativeElement.querySelector('input[name="codigo"]')).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('Integración parcial');
    expect(fixture.nativeElement.textContent).not.toContain('consulta individual');
  });

  it('envía todos los filtros a Laravel y los conserva al cambiar de página', async () => {
    const fixture = TestBed.createComponent(ReportesActividadesComponent);
    fixture.detectChanges();
    http.expectOne(request => request.url === url).flush(respuesta());
    fixture.detectChanges(); await fixture.whenStable();
    const componente = fixture.componentInstance;
    componente.inicio = '2026-02-01'; componente.fin = '2026-02-28'; componente.estado = 'Activa'; componente.busqueda = ' 35 ';
    fixture.detectChanges(); await fixture.whenStable();
    componente.consultar();
    const inicial = http.expectOne(request => request.url === url);
    expect(inicial.request.params.get('desde')).toBe('2026-02-01');
    expect(inicial.request.params.get('hasta')).toBe('2026-02-28');
    expect(inicial.request.params.get('estado')).toBe('Activa');
    expect(inicial.request.params.get('q')).toBe('35');
    inicial.flush(respuesta());
    fixture.detectChanges(); await fixture.whenStable();
    componente.busqueda = 'borrador sin aplicar'; componente.cargar(2);
    const segunda = http.expectOne(request => request.url === url);
    expect(segunda.request.params.get('page')).toBe('2');
    expect(segunda.request.params.get('q')).toBe('35');
    expect(segunda.request.params.get('desde')).toBe('2026-02-01');
    segunda.flush(respuesta([fila], 2));
  });

  it('limpia los filtros y vuelve a la primera página del listado general', () => {
    const componente = TestBed.createComponent(ReportesActividadesComponent).componentInstance;
    componente.inicio = '2026-02-01'; componente.estado = 'Activa'; componente.busqueda = '35';
    componente.limpiar();
    const req = http.expectOne(request => request.url === url);
    expect(req.request.params.keys()).toEqual(['page', 'per_page']);
    req.flush(respuesta());
    expect(componente.hayFiltros()).toBeFalse();
  });

  it('una respuesta vacía válida muestra lista vacía y total cero', () => {
    const fixture = TestBed.createComponent(ReportesActividadesComponent);
    fixture.detectChanges();
    http.expectOne(request => request.url === url).flush(respuesta([], 1, 0));
    fixture.detectChanges();
    expect(fixture.componentInstance.pagina()?.total).toBe(0);
    expect(fixture.nativeElement.textContent).toContain('No hay actividades');
    expect(fixture.nativeElement.querySelector('table')).toBeNull();
    expect(fixture.componentInstance.error()).toBe('');
  });

  for (const status of [401, 403, 500]) {
    it(`muestra el error ${status} sin conservar una tabla anterior ni inventar un total`, () => {
      const componente = TestBed.createComponent(ReportesActividadesComponent).componentInstance;
      componente.consultar(); http.expectOne(request => request.url === url).flush(respuesta());
      componente.actualizar();
      expect(componente.pagina()).toBeNull();
      http.expectOne(request => request.url === url).flush({}, { status, statusText: 'Error' });
      expect(componente.error()).not.toBe('');
      expect(componente.cargando()).toBeFalse();
      expect(componente.pagina()).toBeNull();
    });
  }

  it('no consulta si falta el permiso de origen', () => {
    permisos.delete('actividades.ver');
    const fixture = TestBed.createComponent(ReportesActividadesComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.error()).toContain('actividades.ver');
    http.expectNone(() => true);
  });
});
