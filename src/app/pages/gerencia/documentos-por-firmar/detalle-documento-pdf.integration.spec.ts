import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterTestingHarness } from '@angular/router/testing';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { ArchivoPdf } from '../../../core/interfaces/emision-certificados/documento-digital.interface';
import { DocumentoFirmas } from '../../../core/services/emision-certificados/documentos-digitales.service';
import { PdfContinuoComponent } from '../../emision-certificados/compartidos/pdf-continuo.component';
import { PLANTILLA_VISOR_PDF, VisorPdfComponent } from '../../emision-certificados/compartidos/visor-pdf.component';
import { FIRMANTES_PDF_PRUEBA, pdfPrueba } from '../../emision-certificados/compartidos/pdf-prueba.fixture';
import { DetalleDocumentoComponent } from './detalle-documento.component';

describe('Detalle → HTTP → bytes temporales → PDF.js real', () => {
  const base = '/api/certificados-documentos';
  const funcionarios = FIRMANTES_PDF_PRUEBA.map((f, i) => ({ ...f, id_persona_trabajador: 45 + i, id_persona: 101 + i,
    vigente: true, disponible_asignacion: true, habilitado_firma_certificados: true, habilitado: true, id_firma: null, credencial_registrada: false }));
  let http: HttpTestingController;
  let harness: RouterTestingHarness;
  let c: any;
  let doc: DocumentoFirmas;
  let original: ArchivoPdf;
  let token = 0;
  const hash = async (archivo: ArchivoPdf) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', await archivo.blob.arrayBuffer())), b => b.toString(16).padStart(2, '0')).join('');
  const progreso = () => ({ documento: doc, facultades: { asignar: true }, modalidad: 'PARALELA', firmantes_asignados: [], asignacion_documental_persistida: false });
  const vista = () => harness.routeNativeElement!;
  const canvas = () => vista().querySelector('canvas')!;
  const boton = (texto: string) => Array.from(vista().querySelectorAll<HTMLButtonElement>('button')).find(b => b.textContent?.trim() === texto)!;
  async function esperar(condicion: () => boolean) {
    for (let i = 0; i < 300 && !condicion(); i++) { harness.detectChanges(); await new Promise(r => setTimeout(r, 20)); }
    harness.detectChanges(); expect(condicion()).withContext(c.errorPrevia() || vista().querySelector('app-pdf-continuo')?.outerHTML || 'Visor ausente').toBeTrue();
  }
  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(),
      provideRouter([{ path: 'pendientes/documentos-firmar/:id', component: DetalleDocumentoComponent }]),
      { provide: AuthService, useValue: { tienePermiso: () => true } },
    ] });
    // Forzar el renderizador real aunque otras suites sustituyan las importaciones del visor.
    TestBed.overrideComponent(VisorPdfComponent, { set: { imports: [PdfContinuoComponent], template: PLANTILLA_VISOR_PDF } });
    TestBed.overrideComponent(DetalleDocumentoComponent, { set: { imports: [RouterLink, VisorPdfComponent, FormsModule] } });
    http = TestBed.inject(HttpTestingController);
    spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    original = pdfPrueba(); token = 0;
    doc = { id_certificado_documento: 31, id_certificado: 12, hash_pdf: await hash(original), codigo_verificacion: 'ABC123',
      actividad: 'Actividad', sesion: 'Sesión', tipo_certificado: 'Participación',
      estado_certificado: 'PENDIENTE_FIRMA', firmantes: [], facultades: { descargar: true, remitir: false } };
    harness = await RouterTestingHarness.create('/pendientes/documentos-firmar/31');
    c = harness.routeDebugElement!.componentInstance;
    http.expectOne(base + '/detail/31?flujo=firmas').flush({ success: true, data: doc });
    http.expectOne(base + '/31/firma/progreso').flush({ success: true, data: progreso() });
    verificar(); harness.detectChanges();
    http.expectOne(base + '/31/firma/pdf-autorizado').flush(original.blob);
    await esperar(() => !!canvas());
  }, 15000);
  afterEach(() => http.verify());
  function verificar() {
    http.expectOne(base + '/31/firma/verificacion').flush({ success: true, data: { id_certificado_documento: 31, hash_pdf: doc.hash_pdf, integridad_verificada: true } });
  }
  function abrir() {
    boton('Seleccionar firmantes').click(); harness.detectChanges();
    http.expectOne(base + '/31/firma/firmantes-disponibles').flush({ success: true, data: funcionarios }); harness.detectChanges();
  }
  function marcar(i: number) { vista().querySelectorAll<HTMLInputElement>('.funcionarios input')[i].click(); harness.detectChanges(); }
  async function revisar(indices: number[], modalidad = 'PARALELA', archivo = pdfPrueba(indices.map(i => funcionarios[i])), esperarVisible = true) {
    const seleccion = indices.map(i => funcionarios[i]);
    const hashPdf = await hash(archivo);
    await new Promise(r => setTimeout(r, 180));
    const req = http.expectOne(r => r.url === base + '/31/firma/revision-pdf' && r.method === 'POST');
    expect(req.request.body).toEqual({ modalidad, firmantes: seleccion.map((f, i) => ({ id_persona_trabajador: f.id_persona_trabajador, orden_firma: i + 1 })) });
    const bytes = new Uint8Array(await archivo.blob.arrayBuffer());
    req.flush({ success: true, data: { id_certificado_documento: 31, id_certificado: 12, codigo_verificacion: 'ABC123',
      modalidad, firmantes: seleccion.map((f, i) => ({ ...f, orden_firma: i + 1 })), persistido: false,
      token_revision: String(++token).padStart(64, '0'), hash_pdf: hashPdf, expires_at: new Date(Date.now() + 60000).toISOString(),
      vista_previa_pdf: { contenido_base64: btoa(String.fromCharCode(...bytes)), tipo_contenido: 'application/pdf' },
    } });
    if (!esperarVisible) {
      await esperar(() => !!c.errorPrevia());
      return { archivo, hashPdf };
    }
    await esperar(() => c.previaVisible());
    expect(c.listaParaGuardar()).toBeTrue();
    const lector = harness.routeDebugElement!.query(By.directive(PdfContinuoComponent)).componentInstance as PdfContinuoComponent;
    expect(lector.archivo()).toBe(c.previa());
    // Leer el mismo binario que se acaba de renderizar, sin sustituir PDF.js.
    const pdfjs = await import('pdfjs-dist');
    const tarea = pdfjs.getDocument({ data: new Uint8Array(await lector.archivo()!.blob.arrayBuffer()), isEvalSupported: false });
    try {
      const pdf = await tarea.promise; const pagina = await pdf.getPage(1);
      const texto = (await pagina.getTextContent()).items.map(t => 'str' in t ? t.str : '').join(' ');
      for (const f of seleccion) { expect(texto).toContain(f.nombre); expect(texto).toContain(f.cargo); }
      expect(texto).toContain('Beneficiario - QR ABC123');
    } finally { await tarea.destroy(); }
    return { archivo, hashPdf };
  }
  function descartar() {
    http.expectOne(r => r.url === base + '/31/firma/revision-pdf' && r.method === 'DELETE').flush({ success: true, data: { descartado: true } });
  }
  it('cambia los píxeles al seleccionar uno y dos firmantes, orden y modalidad; cancela sin navegar', async () => {
    const navegar = spyOn(TestBed.inject(Router), 'navigateByUrl').and.callThrough();
    const crear = spyOn(URL, 'createObjectURL').and.callThrough();
    const revocar = spyOn(URL, 'revokeObjectURL').and.callThrough();
    const zoom = vista().querySelector<HTMLSelectElement>('[aria-label="Zoom del PDF"]')!;
    zoom.value = '150'; zoom.dispatchEvent(new Event('change')); harness.detectChanges();
    await esperar(() => canvas().style.width === '1263px');
    const contenedor = vista().querySelector<HTMLDivElement>('.lectura')!;
    contenedor.scrollTop = 120; const posicion = contenedor.scrollTop;
    const imagenOriginal = canvas().toDataURL();
    abrir(); marcar(0); expect(boton('Guardar y poner a disposición').disabled).toBeTrue();
    await revisar([0]); const imagenUno = canvas().toDataURL(); expect(imagenUno).not.toBe(imagenOriginal);
    marcar(1); descartar(); await revisar([0, 1]); expect(canvas().toDataURL()).not.toBe(imagenUno);
    expect(contenedor.scrollTop).toBeCloseTo(posicion, 0); expect(zoom.value).toBe('150');
    const imagenDos = canvas().toDataURL();
    c.mover(1, -1); harness.detectChanges(); descartar(); await revisar([1, 0]); expect(canvas().toDataURL()).not.toBe(imagenDos);
    c.cambiarModalidad('SECUENCIAL'); harness.detectChanges(); descartar(); await revisar([1, 0], 'SECUENCIAL');
    marcar(0); descartar(); await revisar([1], 'SECUENCIAL');
    boton('Cancelar selección').click(); descartar();
    await esperar(() => !c.seleccionando() && canvas().toDataURL() === imagenOriginal);
    expect(vista().querySelector('.lectura')).toBe(contenedor); expect(vista().querySelector('iframe')).toBeNull();
    expect(crear.calls.count()).toBeGreaterThan(1);
    expect(revocar).toHaveBeenCalledWith(crear.calls.first().returnValue);
    expect(navegar).not.toHaveBeenCalled(); http.expectNone(base + '/31/firma/pdf-autorizado');
  }, 20000);
  it('bloquea guardar si Laravel devuelve el original sin los nombres y conserva la imagen anterior', async () => {
    const imagenOriginal = canvas().toDataURL();
    abrir(); marcar(0); marcar(1);
    await revisar([0, 1], 'PARALELA', original, false);
    expect(c.errorPrevia()).toContain('PDF temporal devuelto por Laravel no contiene los nombres o cargos');
    expect(c.listaParaGuardar()).toBeFalse(); expect(boton('Guardar y poner a disposición').disabled).toBeTrue();
    expect(canvas().toDataURL()).toBe(imagenOriginal);
    http.expectNone(base + '/31/firma/asignar');
  }, 15000);
  it('confirma el token visible y muestra los bytes descargados del vigente autorizado', async () => {
    abrir(); marcar(0); marcar(1); const temporal = await revisar([0, 1]);
    const revisada = c.previa(); const revision = c.revision(); const contenedor = vista().querySelector('.lectura');
    boton('Guardar y poner a disposición').click();
    const asignados = funcionarios.map((f, i) => ({ ...f, orden_firma: i + 1 }));
    const planGuardado = { ...progreso(), firmantes_asignados: asignados, asignacion_documental_persistida: true };
    http.expectOne(base + '/31/firma/asignar').flush({ success: true, data: { ...planGuardado, completada: true, persistido: true } });
    const confirmar = http.expectOne(base + '/31/firma/confirmar-pdf');
    expect(confirmar.request.body.token_revision).toBe(revision.token_revision);
    doc = { ...doc, hash_pdf_original: doc.hash_pdf, hash_pdf: temporal.hashPdf };
    const confirmado = { ...planGuardado, documento: doc, pdf_revisado_disponible: true, disponible_rrhh: true };
    confirmar.flush({ success: true, data: { ...confirmado, completada: true, persistido: true, persistencia: 'archivo_privado_versionado',
      id_certificado_documento: 31, id_certificado: 12, codigo_verificacion: 'ABC123', revision_pdf: 'r'.repeat(64), hash_pdf: temporal.hashPdf } });
    http.expectOne(base + '/31/firma/firmantes-asignados').flush({ success: true, data: confirmado });
    http.expectOne(base + '/31/firma/pdf-autorizado').flush(temporal.archivo.blob);
    await esperar(() => !c.seleccionando()); verificar();
    expect(c.vigente()).not.toBe(revisada);
    expect(await c.vigente().blob.text()).toBe(await temporal.archivo.blob.text());
    await esperar(() => harness.routeDebugElement!.query(By.directive(PdfContinuoComponent)).componentInstance.archivo() === c.vigente());
    expect(vista().querySelector('.lectura')).toBe(contenedor);
    c.cargarDocumento(); http.expectOne(base + '/detail/31?flujo=firmas').flush({ success: true, data: doc });
    http.expectOne(base + '/31/firma/progreso').flush({ success: true, data: progreso() }); verificar();
    http.expectNone(base + '/31/firma/pdf-autorizado');
  }, 20000);
});
