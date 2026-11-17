import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AUTHENTICATED_REQUEST } from '../../security/auth-request.context';
import { DocumentosDigitalesService } from './documentos-digitales.service';
import { ErrorApi } from '../../interfaces/api/api-response.interface';

describe('API real de documentos digitales', () => {
  let http: HttpTestingController; let api: DocumentosDigitalesService;
  const codigo = 'a'.repeat(30); const base = environment.apiBaseUrl;
  beforeEach(() => { TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] }); http = TestBed.inject(HttpTestingController); });
  afterEach(() => { http.verify(); environment.apiBaseUrl = base; });
  it('genera con ID real, body vacío y autenticación; conserva que el PDF no es oficial', async () => {
    api = TestBed.inject(DocumentosDigitalesService);
    const respuesta = firstValueFrom(api.generar(19));
    const req = http.expectOne('/api/certificados/19/generar-documento');
    expect(req.request.method).toBe('POST'); expect(req.request.body).toEqual({});
    expect(req.request.withCredentials).toBeTrue(); expect(req.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue();
    req.flush({ success: true, data: { id_certificado: 19, id_certificado_documento: 31, codigo_verificacion: codigo,
      url_verificacion: 'https://municipalidad.test/verificar/' + codigo, modo: 'desarrollo', oficial: false, puede_emitir: false, puede_firmar: false } });
    expect((await respuesta).oficial).toBeFalse();
  });
  it('consulta pública sin credenciales ni marca administrativa', async () => {
    api = TestBed.inject(DocumentosDigitalesService);
    const respuesta = firstValueFrom(api.verificar(codigo));
    const req = http.expectOne('/api/certificados/verificar/' + codigo);
    expect(req.request.withCredentials).toBeFalse(); expect(req.request.context.get(AUTHENTICATED_REQUEST)).toBeFalse();
    req.flush({ success: true, data: { codigo_verificacion: codigo, registro_encontrado: true, integridad_verificada: true,
      vigente: false, estado_documento: 'Vigente', estado_certificado: 'Vigente', puede_ver_documento: false,
      url_documento: null, firma_verificada: false, emision_oficial_verificada: false, motivos: ['Documento de desarrollo.'] } });
    expect((await respuesta).vigente).toBeFalse();
  });
  it('resuelve la URL relativa recibida desde Laravel contra el origen API configurado', async () => {
    environment.apiBaseUrl = 'https://api.municipalidad.test/api'; api = TestBed.inject(DocumentosDigitalesService);
    const respuesta = firstValueFrom(api.archivoPublico('/api/certificados/verificar/' + codigo + '?archivo=1', codigo));
    const req = http.expectOne('https://api.municipalidad.test/api/certificados/verificar/' + codigo + '?archivo=1');
    expect(req.request.withCredentials).toBeFalse();
    req.flush(new Blob(['%PDF-1.4\n'], { type: 'application/pdf' }), { headers: { 'Content-Type': 'application/pdf' } });
    expect((await respuesta).blob.type).toBe('application/pdf');
  });
  it('rechaza URLs ajenas antes de solicitar el archivo', async () => {
    api = TestBed.inject(DocumentosDigitalesService);
    await expectAsync(firstValueFrom(api.archivoPublico('https://ajeno.test/archivo', codigo))).toBeRejected();
    http.expectNone(() => true);
  });
  it('recupera el archivo privado autenticado sin utilizar rutas del disco', async () => {
    api = TestBed.inject(DocumentosDigitalesService); const respuesta = firstValueFrom(api.archivo(31));
    const req = http.expectOne('/api/certificados-documentos/31/archivo');
    expect(req.request.withCredentials).toBeTrue(); expect(req.request.responseType).toBe('blob');
    req.flush(new Blob(['%PDF-1.4\n'], { type: 'application/pdf' })); expect((await respuesta).blob.size).toBeGreaterThan(5);
  });
  it('no presenta HTML ni respuestas vacías como un PDF', async () => {
    api = TestBed.inject(DocumentosDigitalesService); const respuesta = firstValueFrom(api.archivo(31));
    http.expectOne('/api/certificados-documentos/31/archivo').flush(new Blob(['<html>login</html>'], { type: 'text/html' }));
    await expectAsync(respuesta).toBeRejectedWith(jasmine.objectContaining({ mensaje: jasmine.stringMatching('PDF no disponible') }));
  });
  for (const status of [401, 403, 409, 422, 500, 503]) {
    it('conserva el HTTP ' + status + ' y el mensaje real de un error binario', async () => {
      api = TestBed.inject(DocumentosDigitalesService);
      const respuesta = firstValueFrom(api.archivo(31)).catch((e: ErrorApi) => e);
      http.expectOne('/api/certificados-documentos/31/archivo').flush(new Blob([JSON.stringify({ message: 'Motivo real del servidor', errors: { tipo: ['Tipo incompatible'] } })], { type: 'application/json' }), { status, statusText: 'Error' });
      expect(await respuesta).toEqual(jasmine.objectContaining({ status, mensaje: 'Motivo real del servidor' }));
    });
  }
  it('consulta metadatos y PDF autorizado sin caché en cada apertura del mismo ID', async () => {
    api = TestBed.inject(DocumentosDigitalesService);
    for (const contenido of ['%PDF-1.4\nAnterior', '%PDF-1.4\nConfirmado con responsables']) {
      const detalle = firstValueFrom(api.detalleFirmas(31));
      const meta=http.expectOne('/api/certificados-documentos/detail/31?flujo=firmas');
      expect(meta.request.headers.get('Cache-Control')).toContain('no-store'); expect(meta.request.headers.get('Pragma')).toBe('no-cache');
      meta.flush({success:true,data:{id_certificado_documento:31}}); await detalle;
      const respuesta=firstValueFrom(api.archivo(31,true));
      const pdf=http.expectOne('/api/certificados-documentos/31/firma/pdf-autorizado');
      expect(pdf.request.withCredentials).toBeTrue(); expect(pdf.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue(); expect(pdf.request.headers.get('Cache-Control')).toContain('no-cache'); expect(pdf.request.headers.get('Cache-Control')).toContain('no-store');
      pdf.flush(new Blob([contenido],{type:'application/pdf'})); expect(await (await respuesta).blob.text()).toBe(contenido);
    }
    http.expectNone(r=>r.method!=='GET');
  });

});

// La consulta administrativa reutiliza el mismo documento y verifica sus bytes.
describe('PDF privado de RR. HH.', () => {
  let http: HttpTestingController; let api: DocumentosDigitalesService;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController); api = TestBed.inject(DocumentosDigitalesService);
  });
  afterEach(() => http.verify());
  it('solicita el ID de documento y comprueba el hash del catálogo y de la cabecera', async () => {
    const blob = new Blob(['%PDF-1.4\nPDF privado confirmado'], { type: 'application/pdf' });
    const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', await blob.arrayBuffer())), b => b.toString(16).padStart(2, '0')).join('');
    const promesa = firstValueFrom(api.archivoRrhh(31, hash));
    const req = http.expectOne('/api/rrhh/certificados/31/pdf');
    expect(req.request.withCredentials).toBeTrue(); expect(req.request.responseType).toBe('blob');
    req.flush(blob, { headers: { 'Content-Type': 'application/pdf', 'X-Document-SHA256': hash } });
    expect(await (await promesa).blob.text()).toBe(await blob.text());
  });
  it('rechaza una revisión diferente aunque la cabecera corresponda a los bytes recibidos', async () => {
    const blob = new Blob(['%PDF-1.4\nOtra revisión'], { type: 'application/pdf' });
    const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', await blob.arrayBuffer())), b => b.toString(16).padStart(2, '0')).join('');
    const promesa = firstValueFrom(api.archivoRrhh(31, '0'.repeat(64)));
    http.expectOne('/api/rrhh/certificados/31/pdf').flush(blob, { headers: { 'X-Document-SHA256': hash } });
    await expectAsync(promesa).toBeRejectedWith(jasmine.objectContaining({ mensaje: jasmine.stringMatching('huella') }));
  });
  for (const status of [401, 403, 404, 409]) {
    it('conserva el error JSON HTTP ' + status + ' sin intentar un PDF alternativo', async () => {
      const promesa = firstValueFrom(api.archivoRrhh(31)).catch(e => e);
      http.expectOne('/api/rrhh/certificados/31/pdf').flush(new Blob([JSON.stringify({ message: 'Documento no autorizado' })], { type: 'application/json' }), { status, statusText: 'Error' });
      expect(await promesa).toEqual(jasmine.objectContaining({ status })); http.expectNone(() => true);
    });
  }
});
