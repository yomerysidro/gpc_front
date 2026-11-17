import { TestBed } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';
import { DocumentosDigitalesService } from '../../../core/services/emision-certificados/documentos-digitales.service';
import { ArchivoPdf } from '../../../core/interfaces/emision-certificados/documento-digital.interface';
import { VisorPdfComponent } from './visor-pdf.component';

describe('Visor de bytes PDF almacenados', () => {
  let api: jasmine.SpyObj<DocumentosDigitalesService>;
  beforeEach(() => {
    api = jasmine.createSpyObj('DocumentosDigitalesService', ['archivo', 'archivoPublico', 'archivoRrhh']);
    api.archivo.and.returnValue(of({ blob: new Blob(['%PDF-1.4'], { type: 'application/pdf' }), nombre: 'certificado.pdf' }));
    TestBed.configureTestingModule({ providers: [{ provide: DocumentosDigitalesService, useValue: api }] });
  });
  it('no muestra iframe ni descarga antes de recibir el archivo real', () => {
    const archivo = new Subject<ArchivoPdf>(); api.archivo.and.returnValue(archivo);
    const f = TestBed.createComponent(VisorPdfComponent); f.componentRef.setInput('documentoId', 31); f.detectChanges();
    f.detectChanges();
    expect(f.nativeElement.querySelector('[role="status"]').textContent).toBe('Cargando certificado...');
    expect(f.nativeElement.textContent).not.toContain('Laravel');
    expect(f.nativeElement.querySelector('iframe, a[download]')).toBeNull();
    archivo.next({ blob: new Blob(['%PDF-1.4'], { type: 'application/pdf' }), nombre: 'certificado.pdf' }); f.detectChanges();
    expect(f.nativeElement.querySelector('iframe')).not.toBeNull(); expect(f.nativeElement.querySelector('a[download]')).not.toBeNull();
    expect(f.nativeElement.textContent).not.toContain('El PDF almacenado contiene el QR');
    expect(f.nativeElement.querySelector('iframe').getAttribute('title')).toBe('PDF del certificado');
    expect(api.archivo).toHaveBeenCalledOnceWith(31); f.destroy();
  });
  it('conserva la visualización y oculta descarga, impresión y apertura cuando no están autorizadas', () => {
    const f = TestBed.createComponent(VisorPdfComponent);
    f.componentRef.setInput('documentoId', 31); f.componentRef.setInput('permitirDescarga', false);
    f.detectChanges(); f.detectChanges();
    expect(f.nativeElement.querySelector('iframe')).not.toBeNull();
    expect(f.nativeElement.querySelector('a[download]')).toBeNull();
    expect(f.nativeElement.querySelector('.acciones')).toBeNull(); f.destroy();
  });
  it('RR. HH. visualiza y descarga el mismo blob autorizado sin usar rutas de Gerencia', () => {
    const archivo = { blob: new Blob(['%PDF-1.4\nRevisión confirmada'], { type: 'application/pdf' }), nombre: 'certificado.pdf' };
    api.archivoRrhh.and.returnValue(of(archivo));
    spyOn(URL, 'createObjectURL').and.returnValue('blob:revision-confirmada');
    const f = TestBed.createComponent(VisorPdfComponent);
    f.componentRef.setInput('documentoId', 31); f.componentRef.setInput('consultaRrhh', true); f.componentRef.setInput('hashEsperado', 'hash-confirmado');
    f.detectChanges(); f.detectChanges();
    expect(api.archivoRrhh).toHaveBeenCalledOnceWith(31, 'hash-confirmado'); expect(api.archivo).not.toHaveBeenCalled();
    expect(f.nativeElement.querySelector('iframe').getAttribute('src')).toBe('blob:revision-confirmada');
    expect(f.nativeElement.querySelector('a[download]').getAttribute('href')).toBe('blob:revision-confirmada');
    f.destroy();
  });
  it('da prioridad a bytes temporales, renueva el iframe y solo acredita su carga actual', () => {
    const f = TestBed.createComponent(VisorPdfComponent);
    const primero = { blob: new Blob(['%PDF-1.4\nprimer temporal'], { type: 'application/pdf' }), nombre: 'previa.pdf' };
    const segundo = { blob: new Blob(['%PDF-1.4\nsegundo temporal'], { type: 'application/pdf' }), nombre: 'previa.pdf' };
    spyOn(URL, 'createObjectURL').and.returnValues('blob:primera-previa', 'blob:segunda-previa');
    const revocar = spyOn(URL, 'revokeObjectURL');
    const visualizado = jasmine.createSpy('visualizado'); f.componentInstance.archivoVisualizado.subscribe(visualizado);
    f.componentRef.setInput('documentoId', 31); f.componentRef.setInput('archivoPrevio', primero); f.detectChanges(); f.detectChanges();
    const anterior: HTMLIFrameElement = f.nativeElement.querySelector('iframe');
    expect(visualizado).not.toHaveBeenCalled(); anterior.dispatchEvent(new Event('load'));
    expect(visualizado).toHaveBeenCalledWith(primero); visualizado.calls.reset();
    f.componentRef.setInput('archivoPrevio', segundo); f.detectChanges(); f.detectChanges();
    const vigente: HTMLIFrameElement = f.nativeElement.querySelector('iframe'); expect(vigente).not.toBe(anterior);
    expect(vigente.getAttribute('src')).toBe('blob:segunda-previa');
    expect(revocar).toHaveBeenCalledWith('blob:primera-previa'); expect(api.archivo).not.toHaveBeenCalled();
    anterior.dispatchEvent(new Event('load')); expect(visualizado).not.toHaveBeenCalled();
    vigente.dispatchEvent(new Event('load')); expect(visualizado).toHaveBeenCalledOnceWith(segundo);
    expect(f.nativeElement.querySelector('a[download]').getAttribute('href')).toBe('blob:segunda-previa');
    f.destroy(); expect(revocar).toHaveBeenCalledWith('blob:segunda-previa');
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
    expect(f.nativeElement.textContent).toContain('Operaci\u00f3n en conflicto o bloqueada.'); expect(f.nativeElement.querySelector('iframe, a[download]')).toBeNull(); f.destroy();
  });
  it('cambia de versión autorizada manteniendo el ID y comparte el mismo blob entre visor y acciones', () => {
    spyOn(URL, 'createObjectURL').and.returnValues('blob:anterior', 'blob:confirmado');
    const revocar = spyOn(URL, 'revokeObjectURL');
    const f = TestBed.createComponent(VisorPdfComponent);
    f.componentRef.setInput('documentoId', 31); f.componentRef.setInput('flujoFirmas', true); f.componentRef.setInput('hashEsperado', 'hash-anterior'); f.detectChanges();
    const confirmado = {blob:new Blob(['%PDF-1.4\nPDF confirmado'],{type:'application/pdf'}),nombre:'certificado.pdf'};
    api.archivo.and.returnValue(of(confirmado));
    f.componentRef.setInput('hashEsperado','hash-confirmado'); f.detectChanges(); f.detectChanges();
    expect(api.archivo).toHaveBeenCalledWith(31,true,'hash-confirmado'); expect(revocar).toHaveBeenCalledWith('blob:anterior');
    const el:HTMLElement=f.nativeElement; const iframe=el.querySelector<HTMLIFrameElement>('iframe')!;
    expect(iframe.getAttribute('src')).toBe('blob:confirmado');
    expect(el.querySelector('a[download]')?.getAttribute('href')).toBe('blob:confirmado'); expect(el.querySelector('a[target=_blank]')?.getAttribute('href')).toBe('blob:confirmado');
    const imprimir=spyOn(iframe.contentWindow!,'print').and.stub(); Array.from(el.querySelectorAll('button')).find(b=>b.textContent==='Imprimir PDF')!.click(); expect(imprimir).toHaveBeenCalled();
    f.destroy(); expect(revocar).toHaveBeenCalledWith('blob:confirmado');
  });

});
