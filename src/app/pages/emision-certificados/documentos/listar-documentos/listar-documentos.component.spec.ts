import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ListarDocumentosComponent } from './listar-documentos.component';
import { estadoCatalogo, CertificadoCatalogo } from '../../../../core/interfaces/emision-certificados/catalogo-certificados.interface';
import { CambiosCertificadosService } from '../../../../core/services/emision-certificados/cambios-certificados.service';

export const certificadoPrueba = (id: number, nombre: string, actividad = 1, sesion = 2): CertificadoCatalogo => ({
  id_certificado: id, id_certificado_documento: id + 100, id_persona: id, id_participacion: id,
  nombre_completo: nombre, id_actividad: actividad, actividad: 'Actividad ' + actividad, id_sesion: sesion, sesion: 'Sesión ' + sesion,
  fecha_sesion: '2026-11-10', tipo_certificado: 'Constancia', codigo_verificacion: 'codigo-' + id,
  hash_pdf: 'a'.repeat(64), revision_pdf: 'revision-' + id, estado: 'PENDIENTE_FIRMA', estado_certificado: 'PENDIENTE_FIRMA', estado_documental: 'Vigente',
  estado_preparacion: 'PREPARADO_ENTREGA', pdf_confirmado: true, disponible_rrhh: true, emision_oficial_verificada: false, firma_verificada: false, fecha_emision: null,
});
export const paginaPrueba = (data: readonly unknown[], page = 1, last = 1) => ({ success: true, data: { data, total: data.length, current_page: page, last_page: last, per_page: 100 } });

describe('Certificados emitidos: consulta sencilla autorizada', () => {
  let fixture: ComponentFixture<ListarDocumentosComponent>; let http: HttpTestingController;
  const vista = (): HTMLElement => fixture.nativeElement;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController); fixture = TestBed.createComponent(ListarDocumentosComponent); fixture.detectChanges();
  });
  afterEach(() => http.verify());
  const catalogo = () => http.expectOne(r => r.url === '/api/certificados/list');
  function cargar(): void {
    catalogo().flush(paginaPrueba([certificadoPrueba(1, 'Antón Talián'), certificadoPrueba(2, 'Maria Perez', 3, 4)])); fixture.detectChanges();
  }
  function cambiar(id: string, valor: string, evento = 'change') {
    const c = vista().querySelector<HTMLInputElement>('#' + id)!; c.value = valor; c.dispatchEvent(new Event(evento)); fixture.detectChanges();
  }
  it('recarga las dos sesiones desde la API y acredita el cuarto listo solo tras su disponibilidad', () => {
    // Datos de prueba; no acreditan el estado de los certificados institucionales.
    const filas = [certificadoPrueba(1, 'Antón Talián', 7, 15), certificadoPrueba(2, 'Maria Perez', 7, 15), certificadoPrueba(3, 'Juan Alcalde', 7, 16)];
    const cuarto = { ...certificadoPrueba(4, 'Antón Talián', 7, 16), id_persona: 1, id_participacion: 1 };
    catalogo().flush(paginaPrueba(filas)); fixture.detectChanges();
    expect(vista().querySelectorAll('tbody tr').length).toBe(3);
    vista().querySelector<HTMLButtonElement>('.encabezado button')!.click(); fixture.detectChanges();
    expect(vista().querySelector('tbody')).toBeNull();
    const req = catalogo(); expect(req.request.headers.get('Cache-Control')).toContain('no-store'); expect(req.request.withCredentials).toBeTrue();
    expect(req.request.params.has('id_area')).toBeFalse();
    expect(req.request.params.has('id_persona')).toBeFalse();
    expect(req.request.params.has('id_usuario')).toBeFalse();
    req.flush(paginaPrueba([...filas, { ...cuarto, disponible_rrhh: false }])); fixture.detectChanges();
    expect(vista().querySelectorAll('tbody tr').length).toBe(4);
    expect(Array.from(vista().querySelectorAll('tbody tr')).filter(f => f.textContent?.includes('Listo para entrega')).length).toBe(3);
    TestBed.inject(CambiosCertificadosService).confirmar(); fixture.detectChanges();
    catalogo().flush(paginaPrueba([...filas, cuarto])); fixture.detectChanges();
    expect(Array.from(vista().querySelectorAll('tbody tr')).filter(f => f.textContent?.includes('Listo para entrega')).length).toBe(4);
    cambiar('actividad', '7'); cambiar('sesion', '16');
    const rows = vista().querySelectorAll('tbody tr'); expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain('Juan Alcalde'); expect(rows[1].textContent).toContain('Antón Talián');
    expect(rows[0].querySelector('a')!.getAttribute('href')).toContain('/3/documentos/103/');
    expect(rows[1].querySelector('a')!.getAttribute('href')).toContain('/4/documentos/104/');
    http.expectNone(r => r.method !== 'GET');
  });
  it('conserva los certificados recibidos y enlaza a sus PDFs sin modal ni controles por ID', () => {
    cargar(); expect(vista().textContent).toContain('Antón Talián'); expect(vista().textContent).toContain('Maria Perez');
    expect(vista().textContent).toContain('Listo para entrega'); expect(vista().textContent).not.toContain('Consulta RR. HH.');
    expect(vista().querySelector('app-dialogo')).toBeNull(); expect(vista().querySelector('a')?.getAttribute('href')).toBe('/certificaciones/certificados/1/documentos/101/visor');
    http.expectNone(r => r.method !== 'GET');
  });
  it('deriva nombres autorizados de todas las páginas y permite buscar sin distinguir tildes', () => {
    catalogo().flush(paginaPrueba([certificadoPrueba(1, 'Antón Talián')], 1, 2));
    const segunda = catalogo(); expect(segunda.request.params.get('page')).toBe('2'); expect(segunda.request.withCredentials).toBeTrue();
    segunda.flush(paginaPrueba([certificadoPrueba(2, 'Maria Perez', 3, 4)], 2, 2)); fixture.detectChanges();
    expect(vista().querySelectorAll('#actividad option').length).toBe(3);
    cambiar('participante', 'anton talian', 'input'); expect(vista().querySelectorAll('tbody tr').length).toBe(1);
    expect(vista().querySelector('tbody')?.textContent).toContain('Antón Talián');
  });
  it('filtra por actividad y sesión y reinicia la sesión al cambiar de actividad', () => {
    cargar(); cambiar('actividad', '1'); expect(vista().querySelectorAll('#sesion option').length).toBe(2);
    cambiar('sesion', '2'); expect(vista().querySelector('tbody')?.textContent).toContain('Antón Talián');
    cambiar('actividad', '3'); expect((vista().querySelector('#sesion') as HTMLSelectElement).value).toBe('');
    expect(vista().querySelector('tbody')?.textContent).toContain('Maria Perez'); http.expectNone(() => true);
  });
  it('un registro sin documento no ofrece descarga ni crea un PDF', () => {
    catalogo().flush(paginaPrueba([{ ...certificadoPrueba(1, 'Histórico'), id_certificado_documento: null, hash_pdf: null }])); fixture.detectChanges();
    expect(vista().textContent).toContain('Sin documento'); expect(vista().textContent).toContain('Sin PDF disponible'); expect(vista().querySelector('tbody a')).toBeNull(); http.expectNone(() => true);
  });
  for (const status of [401, 403, 404, 409]) {
    it('mantiene HTTP ' + status + ' separado de un resultado vacío', () => {
      catalogo().flush({ message: 'Consulta rechazada' }, { status, statusText: 'Error' }); fixture.detectChanges();
      expect(vista().querySelector('[role="alert"]')).not.toBeNull(); expect(vista().querySelector('tbody')).toBeNull();
    });
  }
  it('no muestra Limpiar ni envía filtros que excluyan los pendientes de Gerencia', () => {
    const req = catalogo(); expect(req.request.params.has('estado_preparacion')).toBeFalse(); expect(req.request.params.has('bandeja')).toBeFalse();
    req.flush(paginaPrueba([])); fixture.detectChanges();
    expect(vista().textContent).not.toContain('Limpiar'); http.expectNone(r => r.method !== 'GET');
  });
  it('consulta el mismo documento al remitir y confirmar; no agrega un PREPARADO desde memoria', () => {
    const preparado = { ...certificadoPrueba(66, 'Persona de prueba', 7, 16), id_certificado_documento: 6, estado_certificado: 'PREPARADO', pdf_confirmado: false, disponible_rrhh: false };
    catalogo().flush(paginaPrueba([])); fixture.detectChanges();
    expect(estadoCatalogo(preparado)).toBe('Preparado'); expect(vista().querySelector('tbody')).toBeNull();
    TestBed.inject(CambiosCertificadosService).confirmar();
    const pendiente = { ...preparado, estado_certificado: 'PENDIENTE_FIRMA', etiqueta_estado: 'Pendiente de firma', estado_preparacion: null };
    catalogo().flush(paginaPrueba([pendiente])); fixture.detectChanges();
    expect(vista().querySelectorAll('tbody tr').length).toBe(1); expect(vista().textContent).toContain('Pendiente de firma');
    expect(vista().textContent).not.toContain('Listo para entrega');
    const enlace = vista().querySelector('tbody a')!.getAttribute('href');
    TestBed.inject(CambiosCertificadosService).confirmar();
    catalogo().flush(paginaPrueba([{ ...pendiente, pdf_confirmado: true, disponible_rrhh: true, etiqueta_estado: 'Listo para entrega' }])); fixture.detectChanges();
    expect(vista().querySelectorAll('tbody tr').length).toBe(1); expect(vista().textContent).toContain('Listo para entrega');
    expect(vista().querySelector('tbody a')!.getAttribute('href')).toBe(enlace); http.expectNone(r => r.method !== 'GET');
  });
  it('evita duplicados de la misma identidad entre páginas y conserva otras sesiones de la misma persona', () => {
    const pendiente = { ...certificadoPrueba(1, 'Persona'), pdf_confirmado: false, disponible_rrhh: false };
    catalogo().flush(paginaPrueba([pendiente], 1, 2));
    const listo = { ...pendiente, pdf_confirmado: true, disponible_rrhh: true };
    catalogo().flush(paginaPrueba([listo, { ...certificadoPrueba(2, 'Persona', 1, 3), id_persona: 1 }], 2, 2)); fixture.detectChanges();
    expect(vista().querySelectorAll('tbody tr').length).toBe(2);
    expect(Array.from(vista().querySelectorAll('tbody a')).map(a => a.getAttribute('href'))).toEqual(['/certificaciones/certificados/1/documentos/101/visor', '/certificaciones/certificados/2/documentos/102/visor']);
    http.expectNone(r => r.method !== 'GET');
  });
  it('vuelve a consultar los estados persistidos al reabrir la pantalla', () => {
    catalogo().flush(paginaPrueba([{ ...certificadoPrueba(1, 'Persona'), disponible_rrhh: false, pdf_confirmado: false }])); fixture.detectChanges();
    expect(vista().textContent).toContain('Pendiente de firma'); fixture.destroy();
    fixture = TestBed.createComponent(ListarDocumentosComponent); fixture.detectChanges();
    catalogo().flush(paginaPrueba([certificadoPrueba(1, 'Persona')])); fixture.detectChanges();
    expect(vista().querySelectorAll('tbody tr').length).toBe(1); expect(vista().textContent).toContain('Listo para entrega');
    http.expectNone(r => r.method !== 'GET');
  });
  it('solo acredita firma y emisión mediante las verificaciones del backend', () => {
    catalogo().flush(paginaPrueba([])); const f = certificadoPrueba(1, 'Persona');
    expect(estadoCatalogo(f)).toBe('Listo para entrega'); expect(f.estado).toBe('PENDIENTE_FIRMA');
    expect(estadoCatalogo({ ...f, firma_verificada: true })).toBe('Firmado');
    expect(estadoCatalogo({ ...f, firma_verificada: true, emision_oficial_verificada: true })).toBe('Emitido');
    expect(estadoCatalogo({ ...f, disponible_rrhh: false })).toBe('Pendiente de firma');
  });
  it('comparte catálogo y visor para tres orígenes sin exigir sesión ni mezclar identidades', () => {
    const reconocimiento = { ...certificadoPrueba(21, 'Beneficiaria municipal'), id_participacion: null, id_actividad: null, actividad: null,
      id_sesion: null, sesion: null, origen: 'reconocimiento', id_reconocimiento: 77, tipo_certificado: 'Reconocimiento', titulo_reconocimiento: 'Servicio destacado' };
    const practica = { ...reconocimiento, id_certificado: 22, id_certificado_documento: 122, origen: 'practica', id_reconocimiento: null,
      id_practica: 79, tipo_certificado: 'Prácticas', fecha_inicio_practica: '2026-01-01', fecha_fin_practica: '2026-06-30' };
    catalogo().flush(paginaPrueba([certificadoPrueba(20, 'Participante'), reconocimiento, practica])); fixture.detectChanges();
    expect(vista().querySelectorAll('tbody tr').length).toBe(3); expect(vista().textContent).toContain('Servicio destacado');
    expect(vista().textContent).toContain('2026-01-01'); expect(vista().querySelector('app-dialogo')).toBeNull();
    cambiar('tipo-certificado', 'Prácticas'); const filas = vista().querySelectorAll('tbody tr'); expect(filas.length).toBe(1);
    expect(filas[0].querySelector('a')!.getAttribute('href')).toBe('/certificaciones/certificados/22/documentos/122/visor');
    expect(filas[0].textContent).toContain('Certificado confirmado'); expect(filas[0].textContent).not.toContain('Entregado');
    http.expectNone(r => r.method !== 'GET');
  });
  it('muestra la actividad real de un reconocimiento confirmado con sesión NULL y conserva el visor único', () => {
    catalogo().flush(paginaPrueba([{ ...certificadoPrueba(151, 'Maria Perez'), origen: 'ponente_actividad', modalidad_reconocimiento: 'actividad',
      id_actividad: 7, actividad: 'Capacitación Personal', id_sesion: null, sesion: null, id_participacion: null, id_reconocimiento: 81,
      tipo_certificado: 'Reconocimiento' }])); fixture.detectChanges();
    expect(vista().textContent).toContain('Capacitación Personal'); expect(vista().textContent).toContain('Reconocimiento por actividad');
    expect(vista().textContent).toContain('Listo para entrega'); expect(vista().textContent).not.toContain('Sesión null');
    expect(vista().querySelector('tbody a')!.getAttribute('href')).toBe('/certificaciones/certificados/151/documentos/251/visor');
    cambiar('actividad', '7'); expect(vista().querySelectorAll('tbody tr').length).toBe(1); http.expectNone(r => r.method !== 'GET');
  });
});
