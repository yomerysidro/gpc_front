import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { environment } from '../../../../environments/environment';
import { IndicadoresGeneralesComponent } from './indicadores-generales.component';

describe('Indicadores generales de registros', () => {
  let permisos: Set<string>;
  let http: HttpTestingController;
  beforeEach(() => {
    permisos = new Set(['reportes.ver', 'actividades.ver', 'emision.ver', 'participantes.ver']);
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(),
      { provide: AuthService, useValue: { tienePermiso: (clave: string) => permisos.has(clave) } },
    ] });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('muestra totales completos, incluido cero, sin descargar páginas ni documentos', () => {
    const fixture = TestBed.createComponent(IndicadoresGeneralesComponent);
    fixture.detectChanges();
    const totales = { actividades: 140, certificados: 0, participaciones: 320, asistencias: 415 };
    for (const [indicador, total] of Object.entries(totales)) {
      const req = http.expectOne(`${environment.apiBaseUrl}/reportes/indicadores/${indicador}`);
      expect(req.request.method).toBe('GET'); expect(req.request.params.keys()).toEqual([]);
      req.flush({ success: true, data: { indicador, total, filtros: [] } });
    }
    fixture.detectChanges();
    expect(fixture.componentInstance.indicadores().map(item => item.valor)).toEqual([140, 0, 320, 415]);
    expect(fixture.componentInstance.indicadores().every(item => item.estado === 'exito')).toBeTrue();
    expect(fixture.nativeElement.querySelectorAll('.valor')[1].textContent.trim()).toBe('0');
    expect(fixture.nativeElement.textContent).toContain('Certificados registrados');
    expect(fixture.nativeElement.textContent).toContain('Participaciones registradas');
    expect(fixture.nativeElement.textContent).not.toContain('Certificados emitidos');
    expect(fixture.componentInstance.cargando()).toBeFalse();
    http.expectNone(() => true);
  });

  it('un error de conteo conserva las otras tarjetas y nunca se convierte en cero', () => {
    const fixture = TestBed.createComponent(IndicadoresGeneralesComponent);
    fixture.detectChanges();
    for (const indicador of ['actividades', 'certificados', 'participaciones', 'asistencias']) {
      const req = http.expectOne(`${environment.apiBaseUrl}/reportes/indicadores/${indicador}`);
      if (indicador === 'certificados') req.flush({}, { status: 500, statusText: 'Error' });
      else req.flush({ success: true, data: { indicador, total: 12, filtros: [] } });
    }
    fixture.detectChanges();
    const tarjetas = fixture.componentInstance.indicadores();
    expect(tarjetas[1].estado).toBe('error'); expect(tarjetas[1].valor).toBeNull();
    expect(tarjetas[1].error).toContain('servidor');
    expect(tarjetas.filter(item => item.estado === 'exito').length).toBe(3);
    expect(fixture.nativeElement.querySelectorAll('[role="alert"]').length).toBe(1);
  });

  it('consulta solo las tarjetas autorizadas y evita solicitudes repetidas en curso', () => {
    permisos.delete('emision.ver'); permisos.delete('participantes.ver');
    const fixture = TestBed.createComponent(IndicadoresGeneralesComponent);
    fixture.detectChanges(); fixture.componentInstance.consultar();
    const req = http.expectOne(`${environment.apiBaseUrl}/reportes/indicadores/actividades`);
    req.flush({ success: true, data: { indicador: 'actividades', total: 3, filtros: [] } });
    expect(fixture.componentInstance.indicadores()[0].valor).toBe(3);
    expect(fixture.componentInstance.indicadores().filter(item => item.estado === 'sin-permiso').length).toBe(3);
    http.expectNone(() => true);
  });
});
