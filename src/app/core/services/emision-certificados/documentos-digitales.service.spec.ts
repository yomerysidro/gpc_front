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
});
