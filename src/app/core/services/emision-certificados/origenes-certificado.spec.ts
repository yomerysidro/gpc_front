import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EmisionCertificadosService } from './emision-certificados.service';
import { DocumentosDigitalesService } from './documentos-digitales.service';
import { evaluacionOrigenPrueba, ponentesSesionPrueba } from '../../interfaces/emision-certificados/origenes-certificado.fixture';

describe('Contrato HTTP de certificados por origen', () => {
  let http: HttpTestingController; let api: EmisionCertificadosService; let documentos: DocumentosDigitalesService;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController); api = TestBed.inject(EmisionCertificadosService); documentos = TestBed.inject(DocumentosDigitalesService);
  });
  afterEach(() => http.verify());
  it('consulta catálogos activos independientes sin equivalencias de ID', () => {
    let datos: any; api.catalogosOrigenes().subscribe(d => datos = d);
    const req = http.expectOne('/api/certificaciones/catalogos-origenes');
    expect(req.request.headers.get('Cache-Control')).toContain('no-store');
    req.flush({ success: true, data: { tipos_actividad: [{ id_tipo_actividad: 8, nombre: 'Capacitación', estado: true }],
      tipos_certificado: [{ id_tipo_certificado: 91, nombre_tipo: 'Reconocimiento', estado: true }], relacion_tipo_actividad_certificado: null } });
    expect(datos.tipos_actividad[0].id_tipo_actividad).toBe(8); expect(datos.tipos_certificado[0].id_tipo_certificado).toBe(91);
    expect(datos.relacion_tipo_actividad_certificado).toBeNull();
  });
  for (const origen of ['reconocimiento', 'practica'] as const) {
    it('evalúa ' + origen + ' por la ruta real y no usa asistencia', () => {
      let datos: any; api.evaluarOrigen(origen, 71).subscribe(d => datos = d);
      http.expectOne(`/api/${origen === 'practica' ? 'practices' : 'reconocimientos'}/71/evaluacion-certificacion`)
        .flush({ success: true, data: evaluacionOrigenPrueba(origen, false) });
      expect(datos.puede_preparar).toBeFalse(); expect(datos.id_sesion).toBeNull();
      http.expectNone(r => /attendance|participation|activity-session/.test(r.url));
    });
    it('revisa PDF real de ' + origen + ' sin enviar mensaje ni identidad del cliente', async () => {
      const contenido = '%PDF-1.4\nOrigen real, QR y código\n%%EOF';
      const bytes = new TextEncoder().encode(contenido);
      const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), b => b.toString(16).padStart(2, '0')).join('');
      let revision: any; const completado = new Promise<void>((resolve, reject) => documentos.revisarOrigen(origen, 71).subscribe({ next: d => { revision = d; resolve(); }, error: reject }));
      const req = http.expectOne(`/api/certificaciones/${origen}/71/preparar`);
      expect(req.request.method).toBe('POST'); expect(req.request.withCredentials).toBeTrue();
      expect(req.request.body).toEqual({ accion: 'revisar_documento' });
      req.flush({ success: true, data: { origen, id_origen: 71, modo: 'administrativo', persistido: false,
        token_revision: 'a'.repeat(64), expires_at: '2026-12-01T00:00:00Z', hash_pdf: hash, mensaje: 'Texto acreditado',
        vista_previa_pdf: { contenido_base64: btoa(String.fromCharCode(...bytes)), tipo_contenido: 'application/pdf' } } });
      await completado; expect(await revision.archivo.blob.text()).toBe(contenido); expect(revision.hash).toBe(hash);
      http.expectNone(r => /enviar-gerencia|generar-documento/.test(r.url));
    });
  }
  it('confirma el token exacto, reconsulta documento y no lo envía a Gerencia', () => {
    const e = evaluacionOrigenPrueba('practica');
    const revision = { token: 'a'.repeat(64), hash: 'b'.repeat(64), expiresAt: '2026-12-01T00:00:00Z', archivo: { blob: new Blob(), nombre: 'pdf.pdf' } };
    let guardado: any; documentos.guardarOrigen(e, revision).subscribe(d => guardado = d);
    const req = http.expectOne('/api/certificaciones/practica/71/preparar');
    expect(req.request.body).toEqual({ accion: 'confirmar_preparacion', token_revision: revision.token, confirmar: true });
    req.flush({ success: true, data: { preparacion_persistida: true, id_certificado: 811, id_certificado_documento: 991 } });
    const detalle = http.expectOne('/api/certificados-documentos/detail/991?flujo=firmas');
    detalle.flush({ success: true, data: { id_certificado: 811, id_certificado_documento: 991, origen: 'practica', id_sesion: null,
      beneficiario: { id_persona: 31 }, id_tipo_certificado: e.id_tipo_certificado, hash_pdf: revision.hash,
      estado_certificado: 'PREPARADO', codigo_verificacion: 'c'.repeat(30), facultades: { remitir: true } } });
    expect(guardado.id_certificado_documento).toBe(991); expect(guardado.codigo_verificacion).toBe('c'.repeat(30));
    http.expectNone(r => r.url.includes('enviar-gerencia'));
  });
  it('rechaza otra identidad documental tras guardar', () => {
    const e = evaluacionOrigenPrueba('practica'); let error: any;
    documentos.guardarOrigen(e, { token: 'a'.repeat(64), hash: 'b'.repeat(64), expiresAt: '', archivo: { blob: new Blob(), nombre: '' } }).subscribe({ error: e => error = e });
    http.expectOne('/api/certificaciones/practica/71/preparar').flush({ success: true, data: { preparacion_persistida: true, id_certificado: 811, id_certificado_documento: 991 } });
    http.expectOne('/api/certificados-documentos/detail/991?flujo=firmas').flush({ success: true, data: { id_certificado_documento: 991, id_certificado: 812 } });
    expect(error).toBeDefined(); http.expectNone(r => r.url.includes('enviar-gerencia'));
  });
  it('consulta los ponentes realmente vinculados a la sesión con su evaluación', () => {
    let datos: any; api.ponentesCertificacion(19).subscribe(d => datos = d);
    http.expectOne('/api/activity-session/19/ponentes-certificacion').flush({ success: true, data: ponentesSesionPrueba(19, 7) });
    expect(datos.id_sesion).toBe(19);
    expect(datos.ponentes_actividad.length).toBe(0);
    expect(datos.ponentes_sesion.length).toBe(1);
    expect(datos.ponentes_sesion[0].id_persona).toBe(31);
    expect(datos.ponentes_sesion[0].reconocimiento.id_sesion).toBe(19);
    expect(datos.ponentes_sesion[0].reconocimiento.modalidad_reconocimiento).toBe('sesion');
  });
  it('no presenta como vínculo una respuesta que aún no acredita la relación por sesión', () => {
    let error: any; api.ponentesCertificacion(19).subscribe({ error: e => error = e });
    http.expectOne('/api/activity-session/19/ponentes-certificacion').flush({ success: true, data: {
      id_actividad: 7, id_sesion: 19, ponentes_actividad: [], ponentes_sesion: null,
      relacion_ponente_sesion_disponible: false, puede_preparar: false, motivos_bloqueo: ['Falta la relación por sesión.'] } });
    expect(error.status).toBe(409); expect(error.mensaje).toContain('no acredita');
  });
  for (const status of [401, 403, 404, 409, 422]) {
    it('conserva HTTP ' + status + ' y no reintenta ni fabrica una revisión', () => {
      let error: any; documentos.revisarOrigen('reconocimiento', 71).subscribe({ error: e => error = e });
      http.expectOne('/api/certificaciones/reconocimiento/71/preparar').flush({ message: 'Acción rechazada' }, { status, statusText: 'Rechazado' });
      expect(error.status).toBe(status); http.expectNone(r => r.method === 'POST');
    });
  }
});
