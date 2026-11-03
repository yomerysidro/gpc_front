import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CertificadoDocumento, CertificadoRow } from '../../../core/interfaces/emision-certificados/emision-certificados.interface';
import { VisorCertificadoComponent } from './visor-certificado.component';

describe('Visor institucional preliminar', () => {
  let fixture: ComponentFixture<VisorCertificadoComponent>;
  const certificado: CertificadoRow = { id_certificado: 9, id_persona: 3, id_tipo_certificado: 1, id_reconocimiento: null,
    id_participacion: null, id_practica: null, fecha_emision: null, estado: true, notificado: false, fecha_notificacion: null };
  const documento: CertificadoDocumento = { id_certificado_documento: 11, id_certificado: 9, codigo_verificacion: 'VERSION-1', hash_certificado: 'NO-MOSTRAR', motivo_reemision: null, estado: 'GENERADO', fecha_generacion: '2026-10-30' };

  beforeEach(() => {
    fixture = TestBed.createComponent(VisorCertificadoComponent);
    fixture.componentRef.setInput('certificado', certificado);
    fixture.detectChanges();
  });

  it('muestra un borrador pendiente sin generar codigo, PDF, QR ni firmas', () => {
    const texto = fixture.nativeElement.textContent;
    expect(texto).toContain('PREVISUALIZACIÓN');
    expect(texto).toContain('Pendiente: no hay código');
    expect(texto).toContain('QR pendiente');
    expect(texto).toContain('No hay firmas asociadas');
    expect(fixture.nativeElement.textContent).not.toContain('Descargar PDF');
    expect(fixture.nativeElement.querySelector('iframe, canvas, a[download]')).toBeNull();
  });

  it('conserva el codigo y estado de cada version sin exponer el hash interno', () => {
    fixture.componentRef.setInput('documento', documento); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('VERSION-1');
    expect(fixture.nativeElement.textContent).not.toContain('NO-MOSTRAR');
    fixture.componentRef.setInput('documento', { ...documento, id_certificado_documento: 12, codigo_verificacion: 'VERSION-2', estado: 'ANULADO' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('VERSION-2');
    expect(fixture.nativeElement.textContent).not.toContain('VERSION-1');
    expect(fixture.nativeElement.textContent).toContain('DOCUMENTO ANULADO');
    expect(fixture.nativeElement.querySelector('button').disabled).toBeTrue();
  });

  it('imprime solo como previsualizacion y bloquea la impresion durante la carga de firmas', () => {
    const imprimir = spyOn(window, 'print');
    fixture.nativeElement.querySelector('button').click();
    expect(imprimir).toHaveBeenCalledTimes(1);
    fixture.componentRef.setInput('cargandoFirmas', true); fixture.detectChanges();
    fixture.nativeElement.querySelector('button').click();
    expect(imprimir).toHaveBeenCalledTimes(1);
  });

  it('no interpreta contenido del backend como HTML ni declara validez criptografica', () => {
    fixture.componentRef.setInput('reconocimiento', { titulo: '<img src=x onerror=alert(1)>', descripcion: '<script>alert(1)</script>', motivo: 'Motivo', fecha_reconocimiento: '2026-10-30' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('script, img[onerror]')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('<script>alert(1)</script>');
    expect(fixture.nativeElement.textContent).toContain('no confirma la validez criptográfica');
  });
});
