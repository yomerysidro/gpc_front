import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ponenteActividadPrueba } from '../../interfaces/emision-certificados/origenes-certificado.fixture';
import { DocumentosDigitalesService } from './documentos-digitales.service';
import { EmisionCertificadosService } from './emision-certificados.service';

describe('Reconocimiento de ponente por actividad: contrato y persistencia', () => {
  let http: HttpTestingController; let docs: DocumentosDigitalesService; let api: EmisionCertificadosService;
  const e = ponenteActividadPrueba().ponentes[0].reconocimiento;
  const revision = { token: 'a'.repeat(64), hash: 'b'.repeat(64), expiresAt: '2026-12-01T00:00:00Z', archivo: { blob: new Blob(), nombre: 'pdf.pdf' } };
  const c = { id_certificado: 151, id_certificado_documento: 201, id_persona: 31, id_tipo_certificado: 47,
    id_reconocimiento: 81, origen: 'ponente_actividad', modalidad_reconocimiento: 'actividad', id_actividad: 7,
    actividad: 'Capacitación Personal', id_actividad_ponente: 71, id_sesion: null, hash_pdf: revision.hash, codigo_verificacion: 'c'.repeat(30) };
  const administrativo = { ...c, origen: 'reconocimiento', id_actividad: null, actividad: null,
    beneficiario: { id_persona: 31, nombre: 'Maria Perez' }, estado_certificado: 'PREPARADO', facultades: { remitir: true, descargar: true }, firmantes: [] };
  beforeEach(() => { TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] }); http = TestBed.inject(HttpTestingController); docs = TestBed.inject(DocumentosDigitalesService); api = TestBed.inject(EmisionCertificadosService); });
  afterEach(() => http.verify());
  function recuperar() {
    http.expectOne('/api/certificados/detail/151').flush({ success: true, data: c });
    http.expectOne('/api/certificados-documentos/detail/201?flujo=firmas').flush({ success: true, data: administrativo });
  }
  it('consulta la vinculación real y elegibilidad de Maria por actividad con sesión NULL', () => {
    let d: any; api.ponentesActividad(7).subscribe(r => d = r);
    const req = http.expectOne('/api/activity/7/ponentes-certificacion'); expect(req.request.withCredentials).toBeTrue(); req.flush({ success: true, data: ponenteActividadPrueba() });
    expect(d.ponentes[0].reconocimiento.estado_elegibilidad).toBe('Elegible'); expect(d.id_sesion).toBeNull(); expect(d.ponentes[0].id_actividad_ponente).toBe(71);
  });
  it('revisa el PDF real con modalidad explícita y conserva los bytes de código y QR', async () => {
    const contenido = '%PDF-1.4\nReconocimiento - Maria Perez - QR CODIGO\n%%EOF'; const bytes = new TextEncoder().encode(contenido);
    const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), b => b.toString(16).padStart(2, '0')).join('');
    let r: any; const fin = new Promise<void>((resolve, reject) => docs.revisarOrigen('ponente_actividad', 71).subscribe({ next: d => { r = d; resolve(); }, error: reject }));
    const req = http.expectOne('/api/certificaciones/ponente_actividad/71/preparar');
    expect(req.request.body).toEqual({ accion: 'revisar_documento', modalidad_reconocimiento: 'actividad' }); expect(req.request.withCredentials).toBeTrue();
    req.flush({ success: true, data: { origen: 'ponente_actividad', id_origen: 71, id_actividad_ponente: 71, id_sesion: null,
      modalidad_reconocimiento: 'actividad', modo: 'administrativo', persistido: false, token_revision: revision.token,
      expires_at: revision.expiresAt, hash_pdf: hash, mensaje: 'Reconocimiento como ponente',
      vista_previa_pdf: { contenido_base64: btoa(contenido), tipo_contenido: 'application/pdf' } } });
    await fin; expect(await r.archivo.blob.text()).toBe(contenido); expect(r.hash).toBe(hash); http.expectNone(req => req.url.includes('enviar-gerencia'));
  });
  it('rechaza la modalidad por sesión en un vínculo de actividad sin enviarla al servidor', () => {
    let error: any; docs.revisarOrigen('ponente_actividad', 71, { modalidad_reconocimiento: 'sesion', id_sesion: 15 }).subscribe({ error: e => error = e });
    expect(error.status).toBe(422); http.expectNone(req => req.method === 'POST');
  });
  it('revisa el reconocimiento por sesión con su modalidad y sesión reales', async () => {
    const contenido = '%PDF-1.4\nReconocimiento por sesion - Maria Perez\n%%EOF';
    const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(contenido))),
      b => b.toString(16).padStart(2, '0')).join('');
    let r: any; const fin = new Promise<void>((resolve, reject) => docs.revisarOrigen('ponente_sesion', 71,
      { modalidad_reconocimiento: 'sesion', id_sesion: 15 }).subscribe({ next: d => { r = d; resolve(); }, error: reject }));
    const req = http.expectOne('/api/certificaciones/ponente_sesion/71/preparar');
    expect(req.request.body).toEqual({ accion: 'revisar_documento', modalidad_reconocimiento: 'sesion', id_sesion: 15 });
    req.flush({ success: true, data: { origen: 'ponente_sesion', id_origen: 71, id_actividad_ponente: 71, id_sesion: 15,
      modalidad_reconocimiento: 'sesion', modo: 'administrativo', persistido: false, token_revision: revision.token,
      expires_at: revision.expiresAt, hash_pdf: hash, mensaje: 'Reconocimiento por sesión',
      vista_previa_pdf: { contenido_base64: btoa(contenido), tipo_contenido: 'application/pdf' } } });
    await fin;
    expect(await r.archivo.blob.text()).toBe(contenido); expect(r.mensaje).toContain('sesión');
    http.expectNone(req => req.url.includes('preparar'));
  });
  it('guarda, recupera la misma identidad y no envía a Gerencia', () => {
    let d: any; docs.guardarOrigen(e, revision).subscribe(r => d = r);
    const req = http.expectOne('/api/certificaciones/ponente_actividad/71/preparar');
    expect(req.request.body).toEqual({ accion: 'confirmar_preparacion', modalidad_reconocimiento: 'actividad', token_revision: revision.token, confirmar: true });
    req.flush({ success: true, data: { ...c, preparacion_persistida: true } }); recuperar();
    expect(d.id_certificado_documento).toBe(201); expect(d.origen).toBe('ponente_actividad'); expect(d.actividad).toBe('Capacitación Personal'); expect(d.id_sesion).toBeNull();
    http.expectNone(req => req.url.includes('enviar-gerencia'));
  });
  for (const status of [0, 409]) {
    it('recupera un guardado persistido ante reintento HTTP ' + status + ' sin crear otro', () => {
      let d: any; docs.guardarOrigen(e, revision).subscribe(r => d = r);
      http.expectOne('/api/certificaciones/ponente_actividad/71/preparar').flush({ message: 'Resultado incierto' }, { status, statusText: 'Conflict' });
      const listado = ponenteActividadPrueba(); Object.assign(listado.ponentes[0].reconocimiento, { puede_preparar: false, puede_consultar_certificado_existente: true,
        certificados_existentes: [{ id_certificado: 151, id_persona: 31, id_tipo_certificado: 47, id_reconocimiento: 81, id_practica: null, estado: 'PREPARADO' }] });
      http.expectOne('/api/activity/7/ponentes-certificacion').flush({ success: true, data: listado }); recuperar();
      expect(d.id_certificado_documento).toBe(201); http.expectNone(req => req.method === 'POST');
    });
  }
  it('recupera un envío persistido tras error de conexión sin reenviarlo', () => {
    let d: any; docs.confirmarEnvio(201, revision.token, revision.hash).subscribe(r => d = r);
    http.expectOne('/api/certificados-documentos/201/enviar-gerencia').error(new ProgressEvent('error'));
    http.expectOne('/api/certificados-documentos/detail/201?flujo=firmas').flush({ success: true, data: { ...administrativo, estado_certificado: 'PENDIENTE_FIRMA' } });
    expect(d.estado_certificado).toBe('PENDIENTE_FIRMA'); http.expectNone(req => req.method === 'POST');
  });
  it('rechaza recuperar un documento de otra actividad', () => {
    let error: any; docs.recuperarReconocimientoActividad(e, 151).subscribe({ error: r => error = r });
    http.expectOne('/api/certificados/detail/151').flush({ success: true, data: { ...c, id_actividad: 8 } });
    expect(error).toBeDefined(); http.expectNone(req => req.url.includes('certificados-documentos'));
  });
  for (const status of [401, 403, 404, 422]) {
    it('mantiene HTTP ' + status + ' sin declarar preparación ni enviar', () => {
      let error: any; docs.guardarOrigen(e, revision).subscribe({ error: r => error = r });
      http.expectOne('/api/certificaciones/ponente_actividad/71/preparar').flush({ message: 'Acción rechazada' }, { status, statusText: 'Rejected' });
      expect(error.status).toBe(status); http.expectNone(req => true);
    });
  }
});
