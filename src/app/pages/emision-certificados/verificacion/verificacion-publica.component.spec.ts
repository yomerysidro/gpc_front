import { signal } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';
import { routes } from '../../../app.routes';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { PdfContinuoComponent } from '../compartidos/pdf-continuo.component';

describe('QR histórico en el único Portal Público', () => {
  let http: HttpTestingController;
  let h: RouterTestingHarness;
  const codigo = 'a'.repeat(30);
  const datos = { codigo_verificacion: codigo, estado_documento: 'Vigente', estado_certificado: 'PENDIENTE_FIRMA',
    fecha_generacion: '2026-01-01', fecha_emision: null, registro_encontrado: true, integridad_verificada: true,
    vigente: false, puede_ver_documento: false, url_documento: null, emision_oficial_verificada: false,
    firma_verificada: false, motivos: ['SQLSTATE Laravel privado'] };
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting(),
      { provide: AuthService, useValue: { isAuthenticated: () => false, usuario: signal(null),
        cargarSesion: () => of(false), modulos: signal([]), tienePermiso: () => false } }] });
    TestBed.overrideComponent(PdfContinuoComponent, { set: { template: '<div>PDF autorizado</div>' } });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => { h?.fixture.destroy(); http.verify(); });
  async function abrir(url = '/verificar/' + codigo) { h = await RouterTestingHarness.create(url); h.detectChanges(); h.detectChanges(); }
  const vista = () => h.routeNativeElement!;
  for (const url of ['/verificar/' + codigo, '/verificar?codigo=' + codigo, '/portal-certificados?codigo=' + codigo]) {
    it('conserva el enlace ' + url + ', selecciona código y consulta sin DNI', async () => {
      await abrir(url);
      expect(TestBed.inject(Router).url).toBe('/portal-certificados?codigo=' + codigo);
      expect(vista().querySelector<HTMLInputElement>('#codigo-portal')!.value).toBe(codigo);
      expect(vista().querySelector('#dni-publico')).toBeNull();
      expect(vista().querySelector('app-sidebar')).toBeNull();
      const req = http.expectOne('/api/certificados/verificar/' + codigo);
      expect(req.request.method).toBe('GET'); expect(req.request.withCredentials).toBeFalse();
      req.flush({ success: true, data: datos }); h.detectChanges();
      expect(vista().textContent).toContain('Certificado registrado y verificado');
      expect(vista().textContent).toContain('01/01/2026');
      for (const texto of ['PENDIENTE_FIRMA', 'SQLSTATE', 'Laravel', 'Emisión oficial', 'Firma criptográfica']) {
        expect(vista().textContent).not.toContain(texto);
      }
      http.expectNone(r => r.url.includes('consultar-dni') || r.method !== 'GET');
    });
  }
  for (const status of [404, 403, 500, 0]) {
    it('conserva código y pestaña tras HTTP ' + status, async () => {
      await abrir();
      http.expectOne('/api/certificados/verificar/' + codigo).flush({}, { status, statusText: 'Error' }); h.detectChanges();
      expect(vista().querySelector<HTMLInputElement>('#codigo-portal')!.value).toBe(codigo);
      expect(vista().querySelector('#dni-publico')).toBeNull();
      expect(vista().textContent).toContain(status === 404 ? 'No se encontró un certificado con ese código' : status === 403 ? 'no está autorizada' : 'No se pudo conectar');
      if (status !== 404) expect(vista().textContent).not.toContain('No se encontró un certificado');
    });
  }
  it('abre el PDF autorizado automáticamente debajo del resultado, en el mismo portal', async () => {
    await abrir(); const url = '/api/certificados/verificar/' + codigo + '?archivo=1';
    http.expectOne('/api/certificados/verificar/' + codigo).flush({ success: true, data: { ...datos, puede_ver_documento: true, url_documento: url } });
    h.detectChanges();
    expect(vista().querySelector('.resultados')).not.toBeNull(); expect(vista().querySelector('.documento')).not.toBeNull();
    expect(vista().querySelector('#codigo-portal')).not.toBeNull();
    expect(vista().querySelector<HTMLAnchorElement>('.resultados a')!.getAttribute('href')).toBe(url + '&descargar=1');
    const pdf = http.expectOne(url); expect(pdf.request.withCredentials).toBeFalse(); expect(pdf.request.responseType).toBe('blob');
    pdf.flush(null, { status: 403, statusText: 'Forbidden' }); h.detectChanges();
    expect(vista().textContent).toContain('Certificado registrado y verificado');
    expect(vista().querySelector('#codigo-portal')).not.toBeNull();
    expect(vista().querySelector('app-pdf-continuo')).toBeNull();
    expect(TestBed.inject(Router).url).toBe('/portal-certificados?codigo=' + codigo);
  });
  for (const cambios of [{ integridad_verificada: false }, { estado_documento: 'Anulado' }, { estado_certificado: 'Revocado' }, { registro_encontrado: false }]) {
    it('no publica un resultado positivo ante ' + JSON.stringify(cambios), async () => {
      await abrir(); http.expectOne('/api/certificados/verificar/' + codigo).flush({ success: true, data: { ...datos, ...cambios } }); h.detectChanges();
      expect(vista().textContent).not.toContain('Certificado registrado y verificado');
      expect(vista().querySelector('app-pdf-continuo, a')).toBeNull();
    });
  }
  it('admite QR mal formado sin solicitar el backend ni cambiar a DNI', async () => {
    await abrir('/verificar/CODIGO-INVALIDO');
    expect(vista().querySelector<HTMLInputElement>('#codigo-portal')!.value).toBe('CODIGO-INVALIDO');
    expect(vista().querySelector('#dni-publico')).toBeNull(); http.expectNone(() => true);
  });
});
