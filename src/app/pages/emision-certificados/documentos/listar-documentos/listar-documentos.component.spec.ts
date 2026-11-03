import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ListarDocumentosComponent } from './listar-documentos.component';
import { environment } from '../../../../../environments/environment';
describe('Documentos realmente registrados', () => {
  let fixture: ComponentFixture<ListarDocumentosComponent>; let http: HttpTestingController;
  const base = environment.apiBaseUrl;
  const documento = { id_certificado_documento: 10, id_certificado: 9, codigo_verificacion: 'CODIGO-DEL-SERVIDOR', estado: 'GENERADO', fecha_generacion: '2026-10-30', motivo_reemision: null, hash_certificado: 'HASH-NO-VISIBLE', ruta_archivo: 'RUTA-PRIVADA-NO-VISIBLE' };
  const pagina = (data: readonly unknown[]) => ({ success: true, data: { data, total: data.length, current_page: 1, last_page: 1, per_page: 100 } });
  beforeEach(() => { TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()] }); http = TestBed.inject(HttpTestingController); fixture = TestBed.createComponent(ListarDocumentosComponent); fixture.detectChanges(); });
  afterEach(() => http.verify());
  function tipos(): void { http.expectOne(req => req.url.endsWith('/tipos-certificado/list')).flush(pagina([{ id_tipo_certificado: 2, nombre_tipo: 'Tipo real de prueba', estado: true }])); }
  function cargar(): void {
    http.expectOne(req => req.url.endsWith('/certificados-documentos/list')).flush(pagina([documento])); tipos();
    http.expectOne(base + '/certificados/detail/9').flush({ success: true, data: { id_certificado: 9, id_persona: 6, id_tipo_certificado: 2, id_practica: 8, id_participacion: null, id_reconocimiento: null } });
    http.expectOne(base + '/persons/detail/6').flush({ success: true, data: { id_persona: 6, nombres: 'Nombre del servidor', apellido_paterno: 'Apellido', apellido_materno: null } }); fixture.detectChanges();
  }
  it('muestra relaciones reales, código persistido y estado sin publicar PDF, rutas ni hash', () => {
    cargar(); const vista: HTMLElement = fixture.nativeElement;
    expect(vista.querySelector('tbody')?.textContent).toContain('Nombre del servidor Apellido'); expect(vista.textContent).toContain('CODIGO-DEL-SERVIDOR'); expect(vista.textContent).toContain('Prácticas');
    expect(vista.textContent).not.toContain('RUTA-PRIVADA'); expect(vista.textContent).not.toContain('HASH-NO-VISIBLE');
    expect(vista.querySelector('iframe, a[download]')).toBeNull(); expect(vista.textContent).not.toContain('Ver PDF');
    vista.querySelector<HTMLButtonElement>('tbody button')!.click(); fixture.detectChanges(); expect(vista.querySelector('app-dialogo')?.textContent).toContain('CODIGO-DEL-SERVIDOR');
    http.expectNone(req => req.method !== 'GET');
  });
  it('filtra únicamente registros recibidos y muestra vacío profesional', () => {
    cargar(); const buscar: HTMLInputElement = fixture.nativeElement.querySelector('#documento-busqueda'); buscar.value = 'sin coincidencias'; buscar.dispatchEvent(new Event('input')); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('tbody')).toBeNull(); expect(fixture.nativeElement.textContent).toContain('No hay documentos con estos criterios');
  });
  it('la respuesta sin documentos no crea tarjetas ni consulta beneficiarios', () => {
    http.expectOne(req => req.url.endsWith('/certificados-documentos/list')).flush(pagina([])); tipos(); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No hay documentos'); expect(fixture.nativeElement.querySelector('tbody')).toBeNull(); http.expectNone(req => req.url.includes('/persons/'));
  });
  it('distingue errores 403 de ausencia de registros y no conserva datos anteriores', () => {
    http.expectOne(req => req.url.endsWith('/certificados-documentos/list')).flush({ message: 'No autorizado.' }, { status: 403, statusText: 'Forbidden' });
    // forkJoin cancela la consulta paralela cuando falla el listado principal.
    http.match(req => req.url.endsWith('/tipos-certificado/list')); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No autorizado'); expect(fixture.nativeElement.textContent).not.toContain('No hay documentos con estos criterios');
  });
});
