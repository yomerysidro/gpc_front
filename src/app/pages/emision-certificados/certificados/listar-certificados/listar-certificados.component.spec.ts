import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../core/services/autenticacion/auth.service';
import { ListarCertificadosComponent } from './listar-certificados.component';

describe('Certificados conectados a Laravel', () => {
  let fixture: ComponentFixture<ListarCertificadosComponent>;
  let http: HttpTestingController;
  const base = environment.apiBaseUrl;
  const certificado = { id_certificado: 9, id_persona: 6, id_tipo_certificado: 2, id_participacion: 4,
    id_practica: null, id_reconocimiento: null, fecha_emision: '2026-10-30', estado: 'Inactivo', notificado: false, fecha_notificacion: null };
  const pagina = (data: readonly unknown[], current = 1, last = 1) => ({ success: true, data: { data, current_page: current, last_page: last, total: data.length, per_page: 100 } });
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([]),
      { provide: AuthService, useValue: { tienePermiso: () => true } },
    ] });
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ListarCertificadosComponent);
    fixture.detectChanges();
  });
  afterEach(() => http.verify());

  function catalogos(): void {
    http.expectOne(req => req.url.endsWith('/tipos-certificado/list')).flush(pagina([{ id_tipo_certificado: 2, nombre_tipo: 'Tipo del servidor', estado: true }]));
    http.expectOne(base + '/document-types/list').flush({ success: true, data: [{ id_tipo_documento: 17, nombre: 'DNI' }] });
    http.expectOne(base + '/person-documents/list').flush({ success: true, data: [{ id_persona: 6, id_tipo_documento: 17, numero_documento: '12345678' }] });
  }
  function cargar(): void {
    http.expectOne(req => req.url.endsWith('/certificados/list')).flush(pagina([certificado]));
    catalogos();
    http.expectOne(base + '/persons/detail/6').flush({ success: true, data: { id_persona: 6, nombres: 'Persona', apellido_paterno: 'Del servidor', apellido_materno: null } });
    http.expectOne(req => req.url.endsWith('/certificados-documentos/list')).flush(pagina([{ id_certificado_documento: 10, id_certificado: 9, codigo_verificacion: 'CODIGO-PERSISTIDO', estado: 'Anulado' }]));
    http.expectOne(req => req.url.endsWith('/certificados-firmas/list')).flush(pagina([]));
    fixture.detectChanges();
  }
  it('muestra exclusivamente los registros del servidor y respeta el estado textual', () => {
    cargar();
    const tarjeta = fixture.nativeElement.querySelector('.certificado-card');
    expect(tarjeta.textContent).toContain('Persona Del servidor');
    expect(tarjeta.textContent).toContain('12345678');
    expect(tarjeta.textContent).toContain('CODIGO-PERSISTIDO');
    expect(tarjeta.textContent).toContain('Inactivo');
    expect(tarjeta.querySelector('a').getAttribute('href')).toBe('/certificaciones/certificados/9');
    expect(fixture.nativeElement.textContent).not.toContain('DEMO');
    http.expectNone(req => req.method !== 'GET');
  });
  it('busca por DNI y código obtenido del servidor', () => {
    cargar();
    const input = fixture.nativeElement.querySelector('#beneficiario') as HTMLInputElement;
    for (const valor of ['12345678', 'codigo-persistido']) {
      input.value = valor; input.dispatchEvent(new Event('input')); fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('.certificado-card').length).toBe(1);
    }
    input.value = 'inexistente'; input.dispatchEvent(new Event('input')); fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.certificado-card').length).toBe(0);
    expect(fixture.nativeElement.textContent).toContain('No hay certificados');
  });
  it('recorre todas las páginas sin completar los vacíos con tarjetas inventadas', () => {
    http.expectOne(req => req.url.endsWith('/certificados/list') && req.params.get('page') === '1').flush(pagina([], 1, 2));
    http.expectOne(req => req.url.endsWith('/certificados/list') && req.params.get('page') === '2').flush(pagina([], 2, 2));
    catalogos(); fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.certificado-card').length).toBe(0);
    expect(fixture.nativeElement.textContent).toContain('No hay certificados');
  });
  it('informa un 403 sin mostrar registros ni éxito', () => {
    http.expectOne(req => req.url.endsWith('/certificados/list')).flush({ message: 'No autorizado.' }, { status: 403, statusText: 'Forbidden' });
    http.match(() => true); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No autorizado.');
    expect(fixture.nativeElement.querySelector('.certificado-card')).toBeNull();
  });
});
