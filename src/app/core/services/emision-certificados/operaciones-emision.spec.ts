import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EmisionCertificadosService } from './emision-certificados.service';
import { ESCRITURA_EMISION_AUTORIZADA } from './operaciones-emision';

describe('Escrituras de Emisión sin autorización efectiva del servidor', () => {
  it('bloquea escrituras antes de HTTP aunque el consumidor intente invocar el servicio', () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    expect(TestBed.inject(ESCRITURA_EMISION_AUTORIZADA)).toBeFalse();
    const api = TestBed.inject(EmisionCertificadosService);
    let rechazos = 0;
    const error = (respuesta: { status: number }) => { expect(respuesta.status).toBe(403); rechazos++; };
    api.actualizar('certificados', 1, { estado: false }).subscribe({ error });
    api.actualizar('firmas', 1, { fecha_firma: '2026-11-02' }).subscribe({ error });
    api.eliminar('firmas', 1).subscribe({ error });
    api.crear('actividades-firmas', { id_actividad: 1, id_firma: 1, orden_firma: 1 }).subscribe({ error });
    api.crear('certificados-documentos', { id_certificado: 1, codigo_verificacion: '', ruta_archivo: '', motivo_reemision: null, estado: 'GENERADO', fecha_generacion: '2026-11-02' }).subscribe({ error });
    expect(rechazos).toBe(5);
    TestBed.inject(HttpTestingController).expectNone(() => true);
    TestBed.inject(HttpTestingController).verify();
  });
});
