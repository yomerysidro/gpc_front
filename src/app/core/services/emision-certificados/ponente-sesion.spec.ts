import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ponenteSesionPrueba, ponentesSesionPrueba } from '../../interfaces/emision-certificados/origenes-certificado.fixture';
import { DocumentosDigitalesService } from './documentos-digitales.service';

describe('Reconocimiento de ponente por sesión: contrato y persistencia', () => {
  let http: HttpTestingController; let docs: DocumentosDigitalesService;
  const e = ponenteSesionPrueba();
  const revision = { token: 'a'.repeat(64), hash: 'b'.repeat(64), expiresAt: '2026-12-01T00:00:00Z', archivo: { blob: new Blob(), nombre: 'pdf.pdf' } };
  const c = { id_certificado: 151, id_certificado_documento: 201, id_persona: 31, id_tipo_certificado: 47,
    id_reconocimiento: 81, origen: 'ponente_sesion', modalidad_reconocimiento: 'sesion', id_actividad: 7,
    actividad: 'Capacitación Personal', id_actividad_ponente: 71, id_sesion: 15, sesion: 'Sesión N.º 001',
    hash_pdf: revision.hash, codigo_verificacion: 'c'.repeat(30) };
  const administrativo = { ...c, beneficiario: { id_persona: 31, nombre: 'Maria Perez' },
    estado_certificado: 'PREPARADO', facultades: { remitir: true, descargar: true }, firmantes: [] };
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController); docs = TestBed.inject(DocumentosDigitalesService);
  });
  afterEach(() => http.verify());

  const ligera = '/api/certificaciones/ponente_sesion/71/preparar?accion=consultar_preparacion&modalidad_reconocimiento=sesion&id_sesion=15';
  for (const estado of ['PREPARADO', 'PENDIENTE_FIRMA']) {
    it('recupera con GET ligero sin PDF ni POST: ' + estado, () => {
      let d: any; docs.recuperarReconocimientoSesion(e, 151).subscribe(r => d = r);
      const req = http.expectOne(ligera);
      expect(req.request.method).toBe('GET'); expect(req.request.withCredentials).toBeTrue();
      req.flush({ success: true, data: { ...administrativo, estado_certificado: estado, recuperado: true, persistido: true,
        texto_editable: false, mensaje: 'Original', motivo: 'Motivo', url_documento: '/api/certificados-documentos/201/archivo?flujo=firmas' } });
      expect(d.id_certificado_documento).toBe(201); expect(d.mensaje).toBe('Original');
      http.expectNone(r => r.method === 'POST' || r.url.includes('/archivo'));
    });
  }
  for (const status of [403, 404, 409, 500, 502, 503]) {
    it('conserva el error HTTP sin reintentos: ' + status, () => {
      let error: any; docs.recuperarReconocimientoSesion(e, 151).subscribe({ error: r => error = r });
      http.expectOne(ligera).flush({}, { status, statusText: 'Error' });
      expect(error.status).toBe(status); http.expectNone(r => r.method === 'POST');
    });
  }
  it('comparte solicitudes concurrentes del mismo reconocimiento', () => {
    docs.recuperarReconocimientoSesion(e, 151).subscribe();
    docs.recuperarReconocimientoSesion(e, 151).subscribe();
    const req = http.expectOne(ligera);
    req.flush({ success: true, data: { ...administrativo, recuperado: true, persistido: true } });
  });
  it('rechaza URLs ajenas al documento administrativo', () => {
    let error: any;
    docs.archivoAdministrativo('/api/certificados/verificar/publico', 201).subscribe({ error: r => error = r });
    expect(error.status).toBe(409); http.expectNone(r => r.url.includes('verificar'));
  });
  it('interpreta la evaluaci?n sin documento', () => {
    let error: any; docs.recuperarReconocimientoSesion(e, 151).subscribe({ error: r => error = r });
    http.expectOne(ligera).flush({ success: true, data: { ...e, recuperado: false, persistido: false } });
    expect(error.status).toBe(404); expect(error.evaluacion.id_origen).toBe(e.id_origen);
  });
  it('confirma con ambos textos exactos de la revisión sin enviar a Gerencia', () => {
    const revisada = { ...revision, mensaje: 'Mensaje escrito', motivo: 'Motivo escrito' };
    docs.guardarOrigen(e, revisada).subscribe();
    const req = http.expectOne('/api/certificaciones/ponente_sesion/71/preparar');
    expect(req.request.body).toEqual({ accion: 'confirmar_preparacion', modalidad_reconocimiento: 'sesion',
      id_sesion: 15, mensaje: revisada.mensaje, motivo: revisada.motivo, token_revision: revision.token, confirmar: true });
    req.flush({ success: true, data: { ...c, preparacion_persistida: true } }); recuperar();
    http.expectNone(req => req.url.includes('enviar-gerencia'));
  });
  it('envía ambos textos y rechaza una revisión con contenido diferente', () => {
    let error: unknown;
    docs.revisarOrigen('ponente_sesion', 71, { modalidad_reconocimiento: 'sesion', id_sesion: 15,
      mensaje: 'Mensaje escrito', motivo: 'Motivo escrito' }).subscribe({ error: e => error = e });
    const req = http.expectOne('/api/certificaciones/ponente_sesion/71/preparar');
    expect(req.request.body.mensaje).toBe('Mensaje escrito'); expect(req.request.body.motivo).toBe('Motivo escrito');
    req.flush({ success: true, data: { mensaje: 'Otro mensaje', motivo: 'Motivo escrito' } });
    expect(error).toBeDefined();
  });
  function recuperar(datos = c, detalle = administrativo): void {
    http.expectOne(ligera).flush({ success: true, data: { ...detalle, ...datos, recuperado: true, persistido: true } });
  }
  it('guarda el reconocimiento con la modalidad y la sesión reales y recupera el mismo documento', () => {
    let d: any; docs.guardarOrigen(e, revision).subscribe(r => d = r);
    const req = http.expectOne('/api/certificaciones/ponente_sesion/71/preparar');
    expect(req.request.body).toEqual({ accion: 'confirmar_preparacion', modalidad_reconocimiento: 'sesion', id_sesion: 15,
      token_revision: revision.token, confirmar: true });
    req.flush({ success: true, data: { ...c, preparacion_persistida: true } });
    recuperar();
    expect(d.id_certificado_documento).toBe(201); expect(d.origen).toBe('ponente_sesion');
    expect(d.id_sesion).toBe(15); expect(d.modalidad_reconocimiento).toBe('sesion');
    http.expectNone(req => req.url.includes('enviar-gerencia'));
  });
  it('rechaza un documento recuperado de otra sesión', () => {
    let error: any; docs.recuperarReconocimientoSesion(e, 151).subscribe({ error: r => error = r });
    http.expectOne(ligera).flush({ success: true, data: { ...administrativo, recuperado: true, persistido: true, id_sesion: 16 } });
    expect(error).toBeDefined(); http.expectNone('/api/certificados-documentos/detail/201?flujo=firmas');
  });
  it('conserva el ID documental confirmado y rechaza otro ID aunque coincidan certificado y hash', () => {
    let error: unknown;
    docs.guardarOrigen(e, revision).subscribe({ error: r => error = r });
    http.expectOne('/api/certificaciones/ponente_sesion/71/preparar')
      .flush({ success: true, data: { ...c, preparacion_persistida: true } });
    http.expectOne(ligera).flush({ success: true, data: { ...administrativo, recuperado: true, persistido: true, id_certificado_documento: 202 } });
    expect(error).toBeDefined();
    http.expectNone(r => r.url.includes('enviar-gerencia'));
  });
  it('no reutiliza un documento de la modalidad por actividad', () => {
    let error: any; docs.abrirReconocimientoPonente(e, 151).subscribe({ error: r => error = r });
    http.expectOne('/api/certificados/detail/151').flush({ success: true, data: { ...c, modalidad_reconocimiento: 'actividad', id_sesion: null } });
    expect(error).toBeDefined();
  });
  for (const status of [0, 409]) {
    it('recupera el guardado incierto HTTP ' + status + ' consultando solo esa sesión', () => {
      let d: any; docs.guardarOrigen(e, revision).subscribe(r => d = r);
      http.expectOne('/api/certificaciones/ponente_sesion/71/preparar').flush({ message: 'Resultado incierto' }, { status, statusText: 'Conflict' });
      const listado = ponentesSesionPrueba(15, 7);
      Object.assign(listado.ponentes_sesion![0].reconocimiento, { puede_preparar: false, puede_generar_pdf: false,
        puede_consultar_certificado_existente: true,
        certificados_existentes: [{ id_certificado: 151, id_persona: 31, id_tipo_certificado: 47, id_reconocimiento: 81, id_practica: null, estado: 'PREPARADO' }] });
      http.expectOne('/api/activity-session/15/ponentes-certificacion').flush({ success: true, data: listado });
      recuperar();
      expect(d.id_certificado_documento).toBe(201); expect(d.id_sesion).toBe(15);
      http.expectNone(req => req.method === 'POST');
    });
  }
  it('exige la sesión acreditada antes de revisar y no envía una modalidad ambigua', () => {
    let error: any; docs.revisarOrigen('ponente_sesion', 71).subscribe({ error: r => error = r });
    expect(error.status).toBe(422); http.expectNone(req => req.method === 'POST');
    let otro: any; docs.revisarOrigen('ponente_actividad', 71, { modalidad_reconocimiento: 'sesion', id_sesion: 15 }).subscribe({ error: r => otro = r });
    expect(otro.status).toBe(422); http.expectNone(req => req.method === 'POST');
  });
  it('revisa la sesión con su modalidad y devuelve el mensaje institucional', async () => {
    const contenido = '%PDF-1.4\nSesion 001 - Maria Perez\nMensaje escrito\nMotivo escrito\n%%EOF';
    const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(contenido))),
      b => b.toString(16).padStart(2, '0')).join('');
    let r: any; const fin = new Promise<void>((resolve, reject) => docs.revisarOrigen('ponente_sesion', 71,
      { modalidad_reconocimiento: 'sesion', id_sesion: 15, mensaje: 'Mensaje escrito', motivo: 'Motivo escrito' }).subscribe({ next: d => { r = d; resolve(); }, error: reject }));
    const req = http.expectOne('/api/certificaciones/ponente_sesion/71/preparar');
    expect(req.request.body).toEqual({ accion: 'revisar_documento', modalidad_reconocimiento: 'sesion', id_sesion: 15,
      mensaje: 'Mensaje escrito', motivo: 'Motivo escrito' });
    req.flush({ success: true, data: { origen: 'ponente_sesion', id_origen: 71, id_actividad_ponente: 71, id_sesion: 15,
      modalidad_reconocimiento: 'sesion', modo: 'administrativo', persistido: false, token_revision: revision.token,
      expires_at: revision.expiresAt, hash_pdf: hash, mensaje: 'Mensaje escrito', motivo: 'Motivo escrito',
      vista_previa_pdf: { contenido_base64: btoa(contenido), tipo_contenido: 'application/pdf' } } });
    await fin;
    expect(await r.archivo.blob.text()).toBe(contenido); expect(r.mensaje).toBe('Mensaje escrito'); expect(r.motivo).toBe('Motivo escrito');
  });
});
