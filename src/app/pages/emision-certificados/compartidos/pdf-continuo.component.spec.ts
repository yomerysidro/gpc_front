import { TestBed } from '@angular/core/testing';
import { PdfContinuoComponent } from './pdf-continuo.component';
import { FIRMANTES_PDF_PRUEBA, pdfPrueba } from './pdf-prueba.fixture';

describe('PDF continuo con PDF.js', () => {
  it('renderiza los nombres del PDF temporal en el canvas inferior, conservando el contenedor', async () => {
    const f = TestBed.createComponent(PdfContinuoComponent);
    const documentos: unknown[] = []; const errores: string[] = [];
    f.componentInstance.listo.subscribe(a => documentos.push(a));
    f.componentInstance.fallo.subscribe(e => errores.push(e));
    const original = pdfPrueba(); const temporal = pdfPrueba(FIRMANTES_PDF_PRUEBA);
    const esperar = async (cantidad: number) => {
      for (let i = 0; i < 300 && documentos.length < cantidad && !errores.length; i++) await new Promise(r => setTimeout(r, 20));
      expect(errores).toEqual([]); expect(documentos.length).toBe(cantidad);
    };
    f.componentRef.setInput('archivo', original); f.detectChanges(); await esperar(1);
    const contenedor = f.nativeElement.querySelector('.lectura');
    const canvasOriginal = contenedor.querySelector('canvas') as HTMLCanvasElement;
    const imagenOriginal = canvasOriginal.toDataURL();
    f.componentRef.setInput('archivo', temporal); f.detectChanges();
    expect(contenedor.querySelector('canvas')).toBe(canvasOriginal);
    await esperar(2);
    expect(f.nativeElement.querySelector('.lectura')).toBe(contenedor);
    const canvas = contenedor.querySelector('canvas') as HTMLCanvasElement;
    expect(canvas.toDataURL()).not.toBe(imagenOriginal);
    // Inspeccionar píxeles de las dos líneas de texto, debajo del espacio de firma.
    const ratio = canvas.width / 842;
    for (const x of [40, 400]) {
      const pixeles = canvas.getContext('2d')!.getImageData(Math.round(x * ratio), Math.round(490 * ratio), Math.round(270 * ratio), Math.round(45 * ratio)).data;
      expect(Array.from(pixeles).some((v, i) => i % 4 !== 3 && v < 100)).toBeTrue();
    }
    expect(documentos[1]).toBe(temporal);
    f.destroy();
  });
  it('ignora los bytes de una lectura antigua aunque termine después de la nueva', async () => {
    const f = TestBed.createComponent(PdfContinuoComponent);
    const original = pdfPrueba(); const temporal = pdfPrueba(FIRMANTES_PDF_PRUEBA);
    let resolver!: (bytes: ArrayBuffer) => void;
    const pendiente = new Promise<ArrayBuffer>(r => resolver = r);
    const lectura = spyOn(original.blob, 'arrayBuffer').and.returnValue(pendiente);
    const vistos: unknown[] = []; const errores: string[] = [];
    f.componentInstance.listo.subscribe(a => vistos.push(a)); f.componentInstance.fallo.subscribe(e => errores.push(e));
    f.componentRef.setInput('archivo', original); f.detectChanges();
    for (let i = 0; i < 200 && !lectura.calls.count(); i++) await new Promise(r => setTimeout(r, 20));
    expect(lectura).toHaveBeenCalled();
    f.componentRef.setInput('archivo', temporal); f.detectChanges();
    for (let i = 0; i < 200 && !vistos.length && !errores.length; i++) await new Promise(r => setTimeout(r, 20));
    expect(vistos).toEqual([temporal]); expect(errores).toEqual([]);
    const canvas = f.nativeElement.querySelector('canvas');
    resolver(await pdfPrueba().blob.arrayBuffer()); await new Promise(r => setTimeout(r, 50));
    expect(vistos).toEqual([temporal]); expect(f.nativeElement.querySelector('canvas')).toBe(canvas);
    f.destroy();
  });
  function archivo(nombre: string) {
    const objetos = [
      '<< /Type /Catalog /Pages 2 0 R >>',
      '<< /Type /Pages /Kids [3 0 R 4 0 R] /Count 2 >>',
      '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 400 800] >>',
      '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 400 800] >>',
    ];
    let pdf = '%PDF-1.4\n'; const offsets = [0];
    objetos.forEach((objeto, i) => { offsets.push(pdf.length); pdf += `${i + 1} 0 obj\n${objeto}\nendobj\n`; });
    const xref = pdf.length;
    pdf += 'xref\n0 5\n0000000000 65535 f \n' + offsets.slice(1).map(n => `${String(n).padStart(10, '0')} 00000 n \n`).join('');
    pdf += `trailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
    return { blob: new Blob([pdf], { type: 'application/pdf' }), nombre };
  }
  it('mantiene contenedor, página, posición y zoom; publica solo documentos renderizados', async () => {
    const f = TestBed.createComponent(PdfContinuoComponent);
    const listo = jasmine.createSpy('listo'); const fallo = jasmine.createSpy('fallo');
    f.componentInstance.listo.subscribe(listo); f.componentInstance.fallo.subscribe(fallo);
    f.componentRef.setInput('archivo', archivo('uno.pdf')); f.detectChanges();
    const esperar = async (cantidad: number) => {
      for (let i = 0; i < 200 && listo.calls.count() < cantidad && !fallo.calls.count(); i++) await new Promise(r => setTimeout(r, 20));
      expect(fallo).not.toHaveBeenCalled(); expect(listo.calls.count()).toBe(cantidad);
    };
    await esperar(1);
    const contenedor: HTMLDivElement = f.nativeElement.querySelector('.lectura');
    expect(contenedor.querySelectorAll('canvas').length).toBe(2);
    contenedor.scrollTop = 900;
    const posicion = contenedor.scrollTop;
    const anterior = contenedor.firstElementChild;
    f.componentRef.setInput('archivo', archivo('dos.pdf')); f.detectChanges();
    expect(contenedor.firstElementChild).toBe(anterior);
    await esperar(2);
    expect(f.nativeElement.querySelector('.lectura')).toBe(contenedor);
    expect(contenedor.scrollTop).toBeCloseTo(posicion, 0);
    const paginaAnterior = contenedor.children[1] as HTMLElement;
    const fraccion = (contenedor.scrollTop - paginaAnterior.offsetTop) / paginaAnterior.offsetHeight;
    f.componentRef.setInput('zoom', 150); f.detectChanges(); await esperar(3);
    expect(contenedor.querySelector('canvas')!.style.width).toBe('600px');
    const paginaActual = contenedor.children[1] as HTMLElement;
    expect(contenedor.scrollTop).toBeCloseTo(paginaActual.offsetTop + fraccion * paginaActual.offsetHeight, 0);
    f.destroy();
  });
});
