import { CambiosCertificadosService } from '../../../core/services/emision-certificados/cambios-certificados.service';
import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { VerDocumentoComponent } from './ver-documento.component';
import { VisorPdfComponent } from '../compartidos/visor-pdf.component';

@Component({selector:'app-visor-pdf',standalone:true,template:''})
class VisorPrueba {
  readonly integrado=input(false); readonly ajustarAncho=input(false); readonly persistido=input(false); readonly documentoId=input<number|null>(null);
  readonly hashEsperado=input<string>(); readonly mostrarDescripcion=input(true); readonly controlesZoom=input(false);
}
describe('Página completa del certificado autorizado', () => {
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({providers:[provideRouter([{path:'certificaciones/certificados/:id/documentos/:documentoId/visor',component:VerDocumentoComponent}]),provideHttpClient(),provideHttpClientTesting()]});
    TestBed.overrideComponent(VerDocumentoComponent,{remove:{imports:[VisorPdfComponent]},add:{imports:[VisorPrueba]}});
    http=TestBed.inject(HttpTestingController);
  });
  afterEach(()=>http.verify());
  it('recarga por URL y conserva ID, hash y participante sin crear ni editar documentos',async()=>{
    const h=await RouterTestingHarness.create('/certificaciones/certificados/1/documentos/101/visor');
    const req=http.expectOne(r=>r.url==='/api/certificados-documentos/list'); expect(req.request.params.get('id_certificado')).toBe('1');
    req.flush({success:true,data:{data:[{id_certificado:1,id_certificado_documento:101,nombre_completo:'Antón Talián',actividad:'Actividad',sesion:'Sesión',hash_pdf:'a'.repeat(64),codigo_verificacion:'original',pdf_confirmado:true,disponible_rrhh:true}],current_page:1,last_page:1,per_page:100,total:1}});
    h.detectChanges(); expect(h.routeNativeElement!.textContent).toContain('Antón Talián'); expect(h.routeNativeElement!.textContent).toContain('Listo para entrega');
    expect(h.routeNativeElement!.querySelector('app-dialogo')).toBeNull(); expect(h.routeNativeElement!.querySelector('app-visor-pdf')).not.toBeNull();
    expect(h.routeNativeElement!.querySelector('a')?.getAttribute('href')).toBe('/certificaciones/certificados/documentos');
    http.expectNone(r=>r.method!=='GET');
  });
  it('muestra el PDF pendiente y consulta el hash confirmado de la misma identidad tras una actualizacion', async () => {
    const h = await RouterTestingHarness.create('/certificaciones/certificados/1/documentos/101/visor');
    const fila = { id_certificado: 1, id_certificado_documento: 101, nombre_completo: 'Persona', estado_certificado: 'PENDIENTE_FIRMA', pdf_confirmado: false, disponible_rrhh: false, hash_pdf: 'a'.repeat(64), codigo_verificacion: 'original', id_sesion: 2 };
    const pagina = (d: unknown) => ({ success: true, data: { data: [d], current_page: 1, last_page: 1, per_page: 100, total: 1 } });
    http.expectOne(r => r.url === '/api/certificados-documentos/list').flush(pagina(fila)); h.detectChanges();
    expect(h.routeNativeElement!.textContent).toContain('Pendiente de firma'); expect(h.routeNativeElement!.textContent).not.toContain('Listo para entrega');
    expect(h.routeNativeElement!.querySelector('app-visor-pdf')).not.toBeNull();
    TestBed.inject(CambiosCertificadosService).confirmar();
    http.expectOne(r => r.url === '/api/certificados-documentos/list').flush(pagina({ ...fila, hash_pdf: 'b'.repeat(64), pdf_confirmado: true, disponible_rrhh: true })); h.detectChanges();
    expect(h.routeNativeElement!.textContent).toContain('Listo para entrega'); http.expectNone(r => r.method !== 'GET');
  });
  it('abre prácticas directamente en el visor con regreso al listado y sin preparar ni enviar', async () => {
    const h = await RouterTestingHarness.create('/certificaciones/certificados/1/documentos/101/visor?origen=practicas');
    http.expectOne(r => r.url === '/api/certificados-documentos/list').flush({ success: true, data: { data: [{
      id_certificado: 1, id_certificado_documento: 101, origen: 'practica', id_practica: 12, nombre_completo: 'Practicante',
      estado_certificado: 'PENDIENTE_FIRMA', pdf_confirmado: true, disponible_rrhh: true, hash_pdf: 'a'.repeat(64), codigo_verificacion: 'original',
    }], current_page: 1, last_page: 1, per_page: 100, total: 1 } });
    h.detectChanges();
    expect(h.routeNativeElement!.textContent).toContain('Certificado confirmado');
    expect(h.routeNativeElement!.querySelector('a')?.getAttribute('href')).toBe('/certificaciones/generar-emitir?origen_documental=practica');
    expect(h.routeNativeElement!.querySelector('app-visor-pdf')).not.toBeNull();
    expect(h.routeNativeElement!.querySelector('textarea')).toBeNull();
    http.expectNone(r => r.method !== 'GET' || r.url.includes('practices') || r.url.includes('/preparar'));
  });
  for(const status of [401,403,404,409]) it('respeta HTTP '+status+' sin intentar otro documento',async()=>{
    const h=await RouterTestingHarness.create('/certificaciones/certificados/1/documentos/101/visor');
    http.expectOne(r=>r.url==='/api/certificados-documentos/list').flush({message:'No disponible'},{status,statusText:'Error'});h.detectChanges();
    expect(h.routeNativeElement!.querySelector('[role="alert"]')).not.toBeNull(); expect(h.routeNativeElement!.querySelector('app-visor-pdf')).toBeNull();http.expectNone(()=>true);
  });
});
