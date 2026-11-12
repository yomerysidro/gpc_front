import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { AUTHENTICATED_REQUEST } from '../../security/auth-request.context';
import { FirmaDocumentalService } from './firma-documental.service';

describe('Contrato HTTP Etapa B', () => {
  let api: FirmaDocumentalService;
  let http: HttpTestingController;
  const base = '/api/certificados-documentos';
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    api = TestBed.inject(FirmaDocumentalService); http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  it('envía ambos trabajadores, modalidad y orden al documento actual sin datos del beneficiario', async () => {
    const plan = { modalidad: 'SECUENCIAL' as const, firmantes: [
      { id_persona_trabajador: 45, orden_firma: 1 }, { id_persona_trabajador: 61, orden_firma: 2 },
    ] };
    const resultado = firstValueFrom(api.revisarPdf(31, plan));
    const req = http.expectOne(base + '/31/firma/revision-pdf');
    expect(req.request.method).toBe('POST'); expect(req.request.body).toEqual(plan);
    expect(req.request.withCredentials).toBeTrue(); expect(req.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue();
    req.flush({ success: true, data: { id_certificado_documento: 31, token_revision: 'revisado', ...plan } });
    expect((await resultado).token_revision).toBe('revisado');
  });
  it('rechaza la vista previa de otro documento antes de entregarla al visor', async () => {
    const resultado = firstValueFrom(api.revisarPdf(31)); const rechazo = expectAsync(resultado).toBeRejectedWithError('La vista previa corresponde a otro documento.');
    http.expectOne(base + '/31/firma/revision-pdf').flush({ success: true, data: { id_certificado_documento: 32 } });
    await rechazo;
  });
  for (const status of [0, 401, 403, 404, 409, 422, 503]) {
    it('conserva HTTP ' + status + ' y las cookies privadas de consulta', async () => {
      const respuesta = firstValueFrom(api.progreso(31));
      const rechazo = expectAsync(respuesta).toBeRejectedWith(jasmine.objectContaining({ status }));
      const req = http.expectOne(base + '/31/firma/progreso');
      expect(req.request.method).toBe('GET'); expect(req.request.withCredentials).toBeTrue();
      expect(req.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue();
      if (status === 0) req.error(new ProgressEvent('error'));
      else req.flush({ message: 'Motivo de prueba' }, { status, statusText: 'Error' });
      await rechazo;
    });
  }
  it('rechaza el progreso de otro documento', async () => {
    const resultado = firstValueFrom(api.progreso(31)); const rechazo = expectAsync(resultado).toBeRejected();
    http.expectOne(base + '/31/firma/progreso').flush({ success: true, data: { documento: { id_certificado_documento: 32 } } }); await rechazo;
  });
  it('rechaza una verificación de otro documento', async () => {
    const resultado = firstValueFrom(api.verificacion(31)); const rechazo = expectAsync(resultado).toBeRejected();
    http.expectOne(base + '/31/firma/verificacion').flush({ success: true, data: { id_certificado_documento: 32 } }); await rechazo;
  });
  it('rechaza resultados de lote cruzados entre beneficiarios', async () => {
    const resultado = firstValueFrom(api.lote([31, 32])); const rechazo = expectAsync(resultado).toBeRejected();
    const req = http.expectOne(base + '/firmas/lote/progreso');
    expect(req.request.body).toEqual({ ids_documentos: [31, 32] });
    expect(req.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue(); expect(req.request.withCredentials).toBeTrue();
    req.flush({ success: true, data: { resultados: [{ id_certificado_documento: 32 }, { id_certificado_documento: 31 }] } }); await rechazo;
  });
  it('rechaza un DEMO que afirme efectos oficiales', async () => {
    const resultado = firstValueFrom(api.demo(31)); const rechazo = expectAsync(resultado).toBeRejected();
    http.expectOne(base + '/31/firma/demo/progreso').flush({ success: true, data: { modo: 'DEMO', id_certificado_documento: 31, estado_real: 'EMITIDO', emitido: true } }); await rechazo;
  });
});
