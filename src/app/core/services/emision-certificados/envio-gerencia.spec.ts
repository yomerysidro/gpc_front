import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { AUTHENTICATED_REQUEST } from '../../security/auth-request.context';
import { DocumentosDigitalesService, mensajeEtapaA } from './documentos-digitales.service';

describe('Contrato documental de Etapa A', () => {
  let api: DocumentosDigitalesService;
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    api = TestBed.inject(DocumentosDigitalesService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('rechaza una preparación sin ID de certificado o con estado incompatible', async () => {
    for (const doc of [{ id_certificado_documento: 31, estado_certificado: 'PREPARADO' },
      { id_certificado_documento: 31, id_certificado: 12, estado_certificado: 'EMITIDO' }]) {
      const resultado = firstValueFrom(api.guardarPreparacion(7, 'token'));
      const rechazo = expectAsync(resultado).toBeRejected();
      http.expectOne('/api/activity-session/7/preparar-certificados').flush({ success: true, data: doc });
      await rechazo;
      http.expectNone(r => r.method === 'GET');
    }
  });

  it('valida SHA-256 y rechaza los bytes alterados de una revisión', async () => {
    const respuesta = firstValueFrom(api.revisarPreparacion(7, 4, 2, 'Mensaje', 'Secuencial'));
    const rechazo = expectAsync(respuesta).toBeRejectedWith(jasmine.objectContaining({ status: 502 }));
    const req = http.expectOne('/api/activity-session/7/preparar-certificados');
    expect(req.request.body.modalidad_firma).toBe('Secuencial');
    req.flush({ success: true, data: { accion: 'revisar_documento', mensaje: 'Mensaje', token_revision: 'token',
      expires_at: new Date(Date.now() + 100000).toISOString(), hash_pdf: '0'.repeat(64),
      vista_previa_pdf: { contenido_base64: btoa('%PDF-1.4\n%%EOF'), tipo_contenido: 'application/pdf', nombre_archivo: 'certificado.pdf', persistido: false } } });
    await rechazo;
  });

  it('conserva el token de preparación en el reintento y recupera el mismo ID', async () => {
    const doc = { id_certificado_documento: 31, id_certificado: 12, estado_certificado: 'PREPARADO' };
    for (const creado of [true, false]) {
      const resultado = firstValueFrom(api.guardarPreparacion(7, 'mismo-token'));
      const req = http.expectOne('/api/activity-session/7/preparar-certificados');
      expect(req.request.body.token_revision).toBe('mismo-token');
      req.flush({ success: true, data: { ...doc, creado } });
      http.expectOne('/api/certificados-documentos/detail/31?flujo=firmas').flush({ success: true, data: doc });
      expect((await resultado).id_certificado_documento).toBe(31);
    }
  });

  it('repite la remisión con el mismo token y consulta el estado confirmado', async () => {
    for (const reintento of [false, true]) {
      const respuesta = firstValueFrom(api.confirmarEnvio(31, 'mismo-token'));
      const req = http.expectOne('/api/certificados-documentos/31/enviar-gerencia');
      expect(req.request.body).toEqual({ token_revision: 'mismo-token', confirmar: true });
      req.flush({ success: true, data: { enviado: true, reintento, estado_flujo: 'PENDIENTE_FIRMA' } });
      http.expectOne('/api/certificados-documentos/detail/31?flujo=firmas').flush({ success: true, data: {
        id_certificado_documento: 31, estado_certificado: 'PENDIENTE_FIRMA', facultades: { remitir: false },
      } });
      expect((await respuesta).facultades.remitir).toBeFalse();
    }
  });

  it('rechaza un certificado de otra sesión aunque Laravel devuelva un ID documental', async () => {
    const respuesta = firstValueFrom(api.guardarPreparacion(7, 'token', { sesion: 7, tipo: 2, persona: 5, actividad: 3 }));
    const rechazo = expectAsync(respuesta).toBeRejected();
    http.expectOne('/api/activity-session/7/preparar-certificados').flush({ success: true, data: {
      id_certificado: 12, id_certificado_documento: 31, estado_certificado: 'PREPARADO', id_sesion: 8,
      id_tipo_certificado: 2, id_actividad: 3, beneficiario: { id_persona: 5 },
    } });
    await rechazo;
    http.expectNone(r => r.method === 'GET');
  });

  it('explica caducidad y permisos y oculta diagnósticos SQL', () => {
    expect(mensajeEtapaA({ status: 409, mensaje: 'La revisión caducó', errores: {} })).toBe('La revisión venció. Revise nuevamente el documento.');
    expect(mensajeEtapaA({ status: 403, mensaje: 'Ámbito rechazado', errores: {} })).toBe('No tiene permisos para realizar esta acción.');
    expect(mensajeEtapaA({ status: 500, mensaje: 'SQLSTATE error interno', errores: {} })).not.toContain('SQLSTATE');
  });

  it('encadena revisión, preparación, token de envío y detalle actualizado del mismo documento', async () => {
    const base = '/api/certificados-documentos';
    const sesion = '/api/activity-session/7/preparar-certificados';
    const hash = '4f1949e95440af0ece666ebd5f399c1d77d22de639950784d349fa5feb47dca5';
    const expires_at = new Date(Date.now() + 1800000).toISOString();
    const doc = { id_certificado_documento: 31, id_certificado: 12, hash_pdf: hash, estado_certificado: 'PREPARADO', facultades: { remitir: true } };
    const pdf = { contenido_base64: btoa('%PDF-1.4\n%%EOF'), tipo_contenido: 'application/pdf', nombre_archivo: 'certificado.pdf' };
    const revision = firstValueFrom(api.revisarPreparacion(7, 4, 2, 'Mensaje', 'Paralela'));
    const revisar = http.expectOne(sesion);
    expect(revisar.request.body).toEqual({ accion: 'revisar_documento', id_participacion: 4, id_tipo_certificado: 2, mensaje: 'Mensaje', modalidad_firma: 'Paralela' });
    revisar.flush({ success: true, data: { accion: 'revisar_documento', mensaje: 'Mensaje', token_revision: 'preparar', hash_pdf: hash, expires_at, vista_previa_pdf: { ...pdf, persistido: false } } });
    const guardar = firstValueFrom(api.guardarPreparacion(7, (await revision).token));
    const confirmar = http.expectOne(sesion);
    expect(confirmar.request.body).toEqual({ accion: 'confirmar_preparacion', token_revision: 'preparar', confirmar: true });
    confirmar.flush({ success: true, data: doc });
    http.expectOne(base + '/detail/31?flujo=firmas').flush({ success: true, data: doc });
    expect((await guardar).facultades.remitir).toBeTrue();
    const envio = firstValueFrom(api.obtenerRevisionEnvio(31));
    http.expectOne(base + '/31/revisar-envio').flush({ success: true, data: {
      token_revision: 'remitir', expires_at, documento: doc, vista_previa_pdf: { ...pdf, persistido: true },
    } });
    const enviado = firstValueFrom(api.confirmarEnvio(31, (await envio).token));
    const remitir = http.expectOne(base + '/31/enviar-gerencia');
    expect(remitir.request.body).toEqual({ token_revision: 'remitir', confirmar: true });
    remitir.flush({ success: true, data: { enviado: true, estado_flujo: 'PENDIENTE_FIRMA' } });
    http.expectOne(base + '/detail/31?flujo=firmas').flush({ success: true, data: { ...doc, estado_certificado: 'PENDIENTE_FIRMA' } });
    expect((await enviado).estado_certificado).toBe('PENDIENTE_FIRMA');
  });

  it('consulta la bandeja autenticada y recupera los bytes del PDF registrado', async () => {
    const base = '/api/certificados-documentos';
    const lista = firstValueFrom(api.pendientesFirma(1));
    const req = http.expectOne(r => r.url === base + '/list' && r.params.get('bandeja') === 'por_firmar');
    expect(req.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue();
    req.flush({ success: true, data: { data: [], current_page: 1, last_page: 1 } });
    expect((await lista).data).toEqual([]);
    const pdf = firstValueFrom(api.archivo(31, true));
    http.expectOne(base + '/31/firma/pdf-autorizado').flush(new Blob(['%PDF-1.4'], { type: 'application/pdf' }));
    expect(await (await pdf).blob.text()).toBe('%PDF-1.4');
  });

  it('revisa el documento con body vacío y autenticación existente', async () => {
    const resultado = firstValueFrom(api.revisarEnvio(31));
    const req = http.expectOne('/api/certificados-documentos/31/revisar-envio');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    expect(req.request.withCredentials).toBeTrue();
    expect(req.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue();
    req.flush({});
    expect(await resultado).toEqual({});
  });

  it('envía exactamente el token recibido y confirmar=true, esperando HTTP', async () => {
    let respondio = false;
    const resultado = firstValueFrom(api.enviarGerencia(31, 'token-de-prueba', true)).then(r => { respondio = true; return r; });
    const req = http.expectOne('/api/certificados-documentos/31/enviar-gerencia');
    expect(respondio).toBeFalse();
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ token_revision: 'token-de-prueba', confirmar: true });
    expect(req.request.withCredentials).toBeTrue();
    expect(req.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue();
    req.flush({});
    await resultado;
    expect(respondio).toBeTrue();
  });

  for (const id of [0, -1, NaN, 1.5]) {
    it('rechaza un identificador inválido: ' + id, async () => {
      await expectAsync(firstValueFrom(api.revisarEnvio(id))).toBeRejected();
      await expectAsync(firstValueFrom(api.enviarGerencia(id, 'token', true))).toBeRejected();
      http.expectNone(() => true);
    });
  }
  it('rechaza token vacío o confirmación ausente sin solicitar HTTP', async () => {
    await expectAsync(firstValueFrom(api.enviarGerencia(31, ' ', true))).toBeRejected();
    await expectAsync(firstValueFrom(api.enviarGerencia(31, 'token', false as true))).toBeRejected();
    http.expectNone(() => true);
  });

  for (const accion of ['revision', 'envio']) {
    for (const status of [401, 403, 409, 422]) {
      it(`${accion} conserva HTTP ${status} y motivo del servidor`, async () => {
        const respuesta = firstValueFrom(accion === 'revision' ? api.revisarEnvio(31) : api.enviarGerencia(31, 'token', true));
        const comprobacion = expectAsync(respuesta).toBeRejectedWith(jasmine.objectContaining({ status, mensaje: 'Motivo Laravel' }));
        http.expectOne(() => true).flush({ message: 'Motivo Laravel' }, { status, statusText: 'Error' });
        await comprobacion;
      });
    }
    it(`${accion} conserva el fallo de red`, async () => {
      const respuesta = firstValueFrom(accion === 'revision' ? api.revisarEnvio(31) : api.enviarGerencia(31, 'token', true));
      const comprobacion = expectAsync(respuesta).toBeRejectedWith(jasmine.objectContaining({ status: 0 }));
      http.expectOne(() => true).error(new ProgressEvent('error'));
      await comprobacion;
    });
  }
});
