import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../../environments/environment';
import { ClasificacionesListado, estadoClasificacion } from './clasificaciones-listado';

describe('Listas completas de clasificaciones', () => {
  let http: HttpTestingController;
  let modelo: ClasificacionesListado;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), ClasificacionesListado] });
    http = TestBed.inject(HttpTestingController); modelo = TestBed.inject(ClasificacionesListado);
  });
  afterEach(() => http.verify());

  it('recorre todas las páginas de certificado antes de filtrar o numerar, sin truncar el total', () => {
    let completo = false;
    modelo.cargar('tipos-certificado').subscribe(() => completo = true);
    const primera = http.expectOne(req => req.url === environment.apiBaseUrl + '/tipos-certificado/list' && req.params.get('page') === '1');
    expect(primera.request.params.get('per_page')).toBe('100');
    primera.flush({ success: true, data: { data: Array.from({ length: 100 }, (_, indice) => ({ id_tipo_certificado: indice + 1, nombre_tipo: 'Tipo ' + indice, estado: true })), total: 125, current_page: 1, last_page: 2, per_page: 100 } });
    expect(completo).toBeFalse();
    const segunda = http.expectOne(req => req.url === environment.apiBaseUrl + '/tipos-certificado/list' && req.params.get('page') === '2');
    segunda.flush({ success: true, data: { data: Array.from({ length: 25 }, (_, indice) => ({ id_tipo_certificado: indice + 101, nombre_tipo: 'Último ' + indice, estado: false })), total: 125, current_page: 2, last_page: 2, per_page: 100 } });
    expect(completo).toBeTrue();
    const pagina = modelo.paginar('', '', 3, 50);
    expect(pagina.total).toBe(125); expect(pagina.data.length).toBe(25); expect(pagina.last_page).toBe(3);
    expect(modelo.paginar('ultimo', '0', 1, 10).total).toBe(25);
    modelo.cargar('tipos-certificado').subscribe();
    http.expectNone(() => true);
  });

  it('interpreta únicamente los valores booleanos del contrato', () => {
    for (const valor of [true, 1, '1', 'true']) expect(estadoClasificacion(valor)).toBe('1');
    for (const valor of [false, 0, '0', 'false']) expect(estadoClasificacion(valor)).toBe('0');
    expect(estadoClasificacion('sin definir')).toBe(''); expect(estadoClasificacion(null)).toBe('');
  });
});
