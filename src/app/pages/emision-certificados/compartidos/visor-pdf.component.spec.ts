import { TestBed } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';
import { DocumentosDigitalesService } from '../../../core/services/emision-certificados/documentos-digitales.service';
import { ArchivoPdf } from '../../../core/interfaces/emision-certificados/documento-digital.interface';
import { VisorPdfComponent } from './visor-pdf.component';

describe('Visor de bytes PDF almacenados', () => {
  let api: jasmine.SpyObj<DocumentosDigitalesService>;
  beforeEach(() => {
    api = jasmine.createSpyObj('DocumentosDigitalesService', ['archivo', 'archivoPublico']);
    api.archivo.and.returnValue(of({ blob: new Blob(['%PDF-1.4'], { type: 'application/pdf' }), nombre: 'certificado.pdf' }));
    TestBed.configureTestingModule({ providers: [{ provide: DocumentosDigitalesService, useValue: api }] });
  });
  it('no muestra iframe ni descarga antes de recibir el archivo real', () => {
    const archivo = new Subject<ArchivoPdf>(); api.archivo.and.returnValue(archivo);
    const f = TestBed.createComponent(VisorPdfComponent); f.componentRef.setInput('documentoId', 31); f.detectChanges();
    expect(f.nativeElement.querySelector('iframe, a[download]')).toBeNull();
    archivo.next({ blob: new Blob(['%PDF-1.4'], { type: 'application/pdf' }), nombre: 'certificado.pdf' }); f.detectChanges();
    expect(f.nativeElement.querySelector('iframe')).not.toBeNull(); expect(f.nativeElement.querySelector('a[download]')).not.toBeNull();
    expect(api.archivo).toHaveBeenCalledOnceWith(31); f.destroy();
  });
  it('revoca los recursos y cambia de documento sin retener el PDF anterior', () => {
    spyOn(URL, 'createObjectURL').and.returnValues('blob:documento-31', 'blob:documento-32'); const revocar = spyOn(URL, 'revokeObjectURL');
    const f = TestBed.createComponent(VisorPdfComponent); f.componentRef.setInput('documentoId', 31); f.detectChanges();
    f.componentRef.setInput('documentoId', 32); f.detectChanges(); expect(revocar).toHaveBeenCalledWith('blob:documento-31');
    expect(f.nativeElement.querySelector('a[download]').getAttribute('href')).toBe('blob:documento-32'); f.destroy();
    expect(revocar).toHaveBeenCalledWith('blob:documento-32');
  });
  it('muestra el rechazo real y no crea un archivo sustituto', () => {
    api.archivo.and.returnValue(throwError(() => ({ status: 409, mensaje: 'El documento no está vigente.', errores: {} })));
    const f = TestBed.createComponent(VisorPdfComponent); f.componentRef.setInput('documentoId', 31); f.detectChanges();
    f.detectChanges();
    expect(f.nativeElement.textContent).toContain('El documento no está vigente.'); expect(f.nativeElement.querySelector('iframe, a[download]')).toBeNull(); f.destroy();
  });
});
