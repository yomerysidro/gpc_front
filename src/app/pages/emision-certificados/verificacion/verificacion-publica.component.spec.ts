import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { VerificacionPublicaComponent } from './verificacion-publica.component';

describe('Verificación pública real', () => {
  let http: HttpTestingController; let harness: RouterTestingHarness;
  const codigo = 'a'.repeat(30);
  const datos = { codigo_verificacion: codigo, estado_documento: 'Vigente', estado_certificado: 'Vigente', fecha_generacion: '2026-01-01T09:00:00',
    fecha_emision: '2026-01-01', registro_encontrado: true, integridad_verificada: true, vigente: false, puede_ver_documento: false,
    url_documento: null, emision_oficial_verificada: false, firma_verificada: false, motivos: ['Documento de desarrollo; no constituye emisión oficial.'] };
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([{ path: 'verificar/:codigo', component: VerificacionPublicaComponent }]), provideHttpClient(), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => { harness?.fixture.destroy(); http.verify(); });
  async function iniciar() { harness = await RouterTestingHarness.create('/verificar/' + codigo); harness.detectChanges(); }
  it('consulta al abrir el QR sin auth/me y no confunde integridad con firma o emisión oficial', async () => {
    await iniciar(); const req = http.expectOne('/api/certificados/verificar/' + codigo);
    expect(req.request.withCredentials).toBeFalse(); req.flush({ success: true, data: datos }); harness.detectChanges();
    const texto = harness.routeNativeElement!.textContent;
    expect(texto).toContain('Registro encontrado'); expect(texto).toContain('vigencia no acreditada');
    expect(texto).toContain('No acreditada'); expect(texto).not.toContain('Verificado');
    expect(harness.routeNativeElement!.querySelector('app-visor-pdf')).toBeNull(); http.expectNone(r => r.url.includes('auth/me'));
  });
  for (const estado of ['Anulado', 'Revocado']) {
    it('conserva el estado ' + estado + ' y no ofrece el PDF público', async () => {
      await iniciar(); http.expectOne('/api/certificados/verificar/' + codigo).flush({ success: true, data: { ...datos, estado_certificado: estado } }); harness.detectChanges();
      expect(harness.routeNativeElement!.querySelector('.resultado h2')!.textContent!.toLowerCase()).toContain(estado.toLowerCase());
      expect(harness.routeNativeElement!.querySelector('app-visor-pdf')).toBeNull();
    });
  }
  for (const status of [404, 403, 409, 422, 503]) {
    it('distingue el HTTP ' + status + ' sin mostrar resultados anteriores como válidos', async () => {
      await iniciar(); http.expectOne('/api/certificados/verificar/' + codigo).flush({ message: 'Motivo del backend' }, { status, statusText: 'Error' }); harness.detectChanges();
      expect(harness.routeNativeElement!.querySelector('[role="alert"]')!.textContent).toContain(status === 404 ? 'Código inexistente' : 'Motivo del backend');
      expect(harness.routeNativeElement!.querySelector('.resultado')).toBeNull();
    });
  }
  it('cancela la consulta anterior al cambiar de código y conserva la identidad del nuevo resultado', async () => {
    await iniciar(); const anterior = http.expectOne('/api/certificados/verificar/' + codigo); const otro = 'b'.repeat(30);
    await harness.navigateByUrl('/verificar/' + otro); harness.detectChanges(); expect(anterior.cancelled).toBeTrue();
    http.expectOne('/api/certificados/verificar/' + otro).flush({ success: true, data: { ...datos, codigo_verificacion: otro } }); harness.detectChanges();
    expect(harness.routeNativeElement!.querySelector('.resultado')!.textContent).toContain(otro);
    expect(harness.routeNativeElement!.querySelector('.resultado')!.textContent).not.toContain(codigo);
  });
  it('ofrece el PDF solo con autorización pública explícita y conserva la URL de Laravel', async () => {
    await iniciar(); const url = '/api/certificados/verificar/' + codigo + '?archivo=1';
    http.expectOne('/api/certificados/verificar/' + codigo).flush({ success: true, data: { ...datos, vigente: true, puede_ver_documento: true, url_documento: url } }); harness.detectChanges();
    const boton = Array.from(harness.routeNativeElement!.querySelectorAll('button')).find(b => b.textContent === 'Ver PDF auténtico')!;
    boton.click(); harness.detectChanges(); const req = http.expectOne(url); expect(req.request.responseType).toBe('blob'); expect(req.request.withCredentials).toBeFalse();
    req.flush(new Blob(['%PDF-1.4'], { type: 'application/pdf' }));
  });
});
