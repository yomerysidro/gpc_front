import { FormControl } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { DocumentosDigitalesService } from './documentos-digitales.service';
import { decodificarVistaPrevia, validarMensajeCertificado, MAX_PDF_PREVIA } from './vista-previa-pdf';

describe('Vista previa PDF de sesión y mensaje exacto', () => {
  let http: HttpTestingController; let api: DocumentosDigitalesService;
  const pdf = { contenido_base64: btoa('%PDF-1.4\n%%EOF'), tipo_contenido: 'application/pdf', nombre_archivo: 'vista-previa-certificado.pdf', persistido: false };
  beforeEach(() => { TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] }); api = TestBed.inject(DocumentosDigitalesService); http = TestBed.inject(HttpTestingController); });
  afterEach(() => http.verify());
  it('envía el payload exacto sin recortar Unicode, espacios ni saltos de línea', async () => {
    const mensaje = '  Capacitación: año y ñ\n' + '😀'.repeat(10) + '  ';
    const respuesta = firstValueFrom(api.vistaPrevia(15, 30, 4, mensaje));
    const req = http.expectOne('/api/activity-session/15/preparar-certificados');
    expect(req.request.withCredentials).toBeTrue(); expect(req.request.body).toEqual({ accion: 'vista_previa', formato: 'pdf', id_participacion: 30, id_tipo_certificado: 4, mensaje });
    req.flush({ success: true, data: { accion: 'vista_previa', formato: 'pdf', emitida: false, creado: false, mensaje, mensaje_persistido: false,
      contexto: { id_sesion: 15, id_participacion: 30, id_tipo_certificado: 4 }, vista_previa_pdf: pdf } });
    const resultado = await respuesta; expect(resultado.archivo.blob.type).toBe('application/pdf'); expect(resultado.datos.mensaje).toBe(mensaje);
    expect('vista_previa_pdf' in resultado.datos).toBeFalse();
  });
  it('cuenta 1200 caracteres Unicode como Laravel y rechaza 1201, HTML, vacío y controles peligrosos', () => {
    const c = new FormControl('😀'.repeat(1200), validarMensajeCertificado); expect(c.valid).toBeTrue();
    c.setValue('ñ'.repeat(1201)); expect(c.invalid).toBeTrue();
    for (const texto of ['', ' \t\n', '<script>alert(1)</script>', 'abc\u202e', 'abc\u0000']) { c.setValue(texto); expect(c.invalid).toBeTrue(); }
    c.setValue(' áéíóú ñ\t\n'); expect(c.valid).toBeTrue();
  });
  for (const contenido of ['', '!!!!', btoa('<html>error</html>'), btoa('%PDF-1.4 truncado')]) {
    it('rechaza Base64 vacío, inválido o contenido PDF corrupto: ' + contenido.slice(0, 10), () => {
      expect(() => decodificarVistaPrevia({ ...pdf, contenido_base64: contenido })).toThrow();
    });
  }
  it('rechaza respuesta sin PDF y mensajes cambiados por el servidor', async () => {
    const respuesta = firstValueFrom(api.vistaPrevia(15, 30, 4, 'Mensaje'));
    http.expectOne('/api/activity-session/15/preparar-certificados').flush({ success: true, data: { accion: 'vista_previa', formato: 'pdf', emitida: false, creado: false, mensaje: 'Otro texto' } });
    await expectAsync(respuesta).toBeRejected();
  });
  it('rechaza un sobre válido sin el campo PDF y un archivo que exceda el límite', async () => {
    const respuesta = firstValueFrom(api.vistaPrevia(15, 30, 4, 'Mensaje'));
    http.expectOne('/api/activity-session/15/preparar-certificados').flush({ success: true, data: {
      accion: 'vista_previa', formato: 'pdf', emitida: false, creado: false, mensaje: 'Mensaje', mensaje_persistido: false,
      contexto: { id_sesion: 15, id_participacion: 30, id_tipo_certificado: 4 },
    } });
    await expectAsync(respuesta).toBeRejected();
    expect(() => decodificarVistaPrevia({ ...pdf, contenido_base64: 'A'.repeat(4 * Math.ceil(MAX_PDF_PREVIA / 3) + 4) })).toThrow();
  });
  for (const status of [401, 403, 409, 422]) {
    it('conserva el motivo real del HTTP ' + status, async () => {
      const respuesta = firstValueFrom(api.vistaPrevia(15, 30, 4, 'Mensaje')).catch(e => e);
      http.expectOne('/api/activity-session/15/preparar-certificados').flush({ message: 'Motivo real', errors: { mensaje: ['Error del mensaje'] } }, { status, statusText: 'Error' });
      expect(await respuesta).toEqual(jasmine.objectContaining({ status, mensaje: 'Motivo real' }));
    });
  }
});
