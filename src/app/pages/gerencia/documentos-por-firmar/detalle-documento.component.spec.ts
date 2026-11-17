import { throwError, TimeoutError } from 'rxjs';
import { FirmaDocumentalService } from '../../../core/services/emision-certificados/firma-documental.service';
import { CambiosCertificadosService } from '../../../core/services/emision-certificados/cambios-certificados.service';
import { Component, input, output } from '@angular/core';
import { ArchivoPdf } from '../../../core/interfaces/emision-certificados/documento-digital.interface';
import { PLANTILLA_VISOR_PDF, VisorPdfComponent } from '../../emision-certificados/compartidos/visor-pdf.component';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterTestingHarness } from '@angular/router/testing';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { AUTHENTICATED_REQUEST } from '../../../core/security/auth-request.context';
import { DocumentoFirmas } from '../../../core/services/emision-certificados/documentos-digitales.service';
import { DetalleDocumentoComponent } from './detalle-documento.component';
import { DocumentosPorFirmarComponent } from './documentos-por-firmar.component';
import { FIRMANTES_PDF_PRUEBA, pdfPrueba } from '../../emision-certificados/compartidos/pdf-prueba.fixture';

// Estas pruebas verifican HTTP y selección; PDF.js se prueba con PDFs válidos en su propia suite.
@Component({ selector: 'app-pdf-continuo-simulado', standalone: true, template: '<div class="lectura"></div>' })
class PdfContinuoSimuladoComponent {
  readonly textosEsperados = input<readonly string[]>([]);
  readonly archivo = input<ArchivoPdf | null>(null);
  readonly zoom = input(100); readonly ajustarAncho = input(false);
  readonly listo = output<ArchivoPdf>();
  readonly fallo = output<string>();
}

describe('Gerencia: detalle completo y consultas Etapa B', () => {
  const base = '/api/certificados-documentos';
  const hash = '4f1949e95440af0ece666ebd5f399c1d77d22de639950784d349fa5feb47dca5';
  const documento: DocumentoFirmas = { id_certificado_documento: 31, id_certificado: 12, hash_pdf: hash,
    beneficiario: { nombre: 'Beneficiario exclusivo de pruebas' }, actividad: 'Actividad de prueba', sesion: 'Sesión de prueba',
    tipo_certificado: 'Participación', estado_certificado: 'PENDIENTE_FIRMA', firmantes: [], facultades: { descargar: false, remitir: false } };
  const progreso = { documento, integridad_verificada: true, modalidad: null, modalidad_persistida: false,
    asignacion_documental_persistida: false, firma_verificada: false, emision_habilitada: false, entrega_habilitada: false,
    demo_disponible: true, facultades: { asignar: false, firmar: false, emitir: false, descargar_final: false },
    requisitos: { motor_pdf_disponible: false, firmantes_pendientes_individuales: false } };
  let http: HttpTestingController;
  let harness: RouterTestingHarness;
  let gestionar = true;
  beforeEach(() => {
    gestionar = true;
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(),
      provideRouter([{ path: 'pendientes/documentos-firmar/:id', component: DetalleDocumentoComponent }, { path: 'pendientes/documentos-firmar', component: DocumentosPorFirmarComponent }]),
      { provide: AuthService, useValue: { tienePermiso: (p: string) => p !== 'emision.editar' || gestionar } },
    ] });
    TestBed.overrideComponent(VisorPdfComponent, {
      set: { imports: [PdfContinuoSimuladoComponent], template: PLANTILLA_VISOR_PDF.replaceAll('app-pdf-continuo', 'app-pdf-continuo-simulado') },
    });
    // Aislar también el componente padre: su ámbito compilado no debe conservar el visor simulado.
    TestBed.overrideComponent(DetalleDocumentoComponent, { set: { imports: [RouterLink, VisorPdfComponent, FormsModule] } });
    http = TestBed.inject(HttpTestingController);
    spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
  });
  afterEach(() => http.verify());
  const vista = () => harness.routeNativeElement!;
  function boton(texto: string): HTMLButtonElement { return Array.from(vista().querySelectorAll<HTMLButtonElement>('button')).find(b => b.textContent?.trim() === texto)!; }
  function pulsar(texto: string): void {
    const control = boton(texto);
    const plegable = control.closest('details'); if (plegable) plegable.open = true;
    control.click(); harness.detectChanges();
  }
  function simularRevisionVisible(c: any): void {
    c.documento.set({ ...c.documento(), facultades: { ...c.documento().facultades, descargar: true } });
    c.previa.set({ blob: new Blob(['%PDF-1.4\n%%EOF'], { type: 'application/pdf' }), nombre: 'temporal.pdf' });
    c.pdfVisualizado(c.previa());
  }
  async function iniciar(d = documento, demoDisponible = true): Promise<void> {
    harness = await RouterTestingHarness.create('/pendientes/documentos-firmar/31?page=3');
    const req = http.expectOne(base + '/detail/31?flujo=firmas');
    expect(req.request.withCredentials).toBeTrue(); expect(req.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue();
    req.flush({ success: true, data: d });
    http.expectOne(base + '/31/firma/progreso').flush({ success: true, data: { ...progreso, documento: d, firmantes_asignados: d.firmantes, demo_disponible: demoDisponible } });
    http.expectOne(base + '/31/firma/verificacion').flush({ success: true, data: { id_certificado_documento: 31, hash_pdf: d.hash_pdf, integridad_verificada: true, firma_verificada: false } });
    harness.detectChanges();
  }
  it('renueva candidatos autorizados por documento sin traer trabajadores generales ni alterar asignaciones', async () => {
    await iniciar();
    const componente = harness.routeDebugElement!.componentInstance as any;
    componente.progreso.set({ ...progreso, facultades: { ...progreso.facultades, asignar: true } });
    harness.detectChanges();
    const trabajador = { id_persona_trabajador: 2, id_persona: 8, nombre: 'Maria Perez', cargo: 'Especialista', area: 'RR. HH.', habilitado: false, vigente: true, disponible_asignacion: true, habilitado_firma_certificados: true, id_firma: null, credencial_registrada: false };
    const nuevo = { ...trabajador, id_persona_trabajador: 4, cargo: 'Supervisora', area: 'Administración' };
    pulsar('Seleccionar firmantes');
    http.expectOne(base + '/31/firma/firmantes-disponibles').flush({ success: true, data: [trabajador] }); harness.detectChanges();
    expect(vista().querySelectorAll('.opcion-firmante').length).toBe(1);
    expect(vista().textContent).not.toContain('Supervisora');
    pulsar('Cancelar selección'); pulsar('Seleccionar firmantes');
    const consulta = http.expectOne(base + '/31/firma/firmantes-disponibles');
    expect(consulta.request.headers.get('Cache-Control')).toContain('no-cache');
    consulta.flush({ success: true, data: [trabajador, nuevo,
      { ...trabajador, id_persona_trabajador: 1, id_persona: 7, nombre: 'Antón Talián', cargo: 'Jefe de Informática' },
      { ...trabajador, id_persona_trabajador: 3, id_persona: 9, nombre: 'Juan Alcalde', cargo: 'Alcalde' },
    ] }); harness.detectChanges();
    expect(vista().querySelectorAll('.opcion-firmante').length).toBe(4);
    expect(vista().textContent).toContain('Supervisora');
    expect(vista().querySelector('.panel-firmas input[type=search]')).toBeNull();
    expect(vista().textContent).not.toContain('El plan guardado no se reemplaza automáticamente');
    const opciones = vista().querySelectorAll<HTMLInputElement>('.opcion-firmante input');
    opciones[0].click(); opciones[1].click(); opciones[2].click(); opciones[3].click(); harness.detectChanges();
    expect(componente.seleccion().map((f: { id_persona_trabajador: number }) => f.id_persona_trabajador)).toEqual([2, 4, 1, 3]);
    pulsar('Cancelar selección');
    expect(componente.progreso().firmantes_asignados).toBeUndefined();
    http.expectNone(r => r.url.includes('/funcionarios-firmantes') || r.method !== 'GET');
  });

  it('consulta candidatos distintos al cambiar de documento sin reutilizar trabajadores de otro ámbito', async () => {
    await iniciar();
    const componente = harness.routeDebugElement!.componentInstance as any;
    componente.progreso.set({ ...progreso, facultades: { ...progreso.facultades, asignar: true } }); harness.detectChanges();
    pulsar('Seleccionar firmantes');
    http.expectOne(base + '/31/firma/firmantes-disponibles').flush({ success: true, data: [{ id_persona_trabajador: 2, nombre: 'Maria Perez', cargo: 'Especialista', area: 'RR. HH.', habilitado: false, habilitado_firma_certificados: true, vigente: true, disponible_asignacion: true }] });
    harness.detectChanges();
    await harness.navigateByUrl('/pendientes/documentos-firmar/32');
    const otro = { ...documento, id_certificado_documento: 32, id_certificado: 13 };
    http.expectOne(base + '/detail/32?flujo=firmas').flush({ success: true, data: otro });
    http.expectOne(base + '/32/firma/progreso').flush({ success: true, data: { ...progreso, documento: otro, facultades: { ...progreso.facultades, asignar: true } } });
    http.expectOne(base + '/32/firma/verificacion').flush({ success: true, data: { id_certificado_documento: 32, hash_pdf: otro.hash_pdf, integridad_verificada: true } }); harness.detectChanges();
    pulsar('Seleccionar firmantes');
    http.expectOne(base + '/32/firma/firmantes-disponibles').flush({ success: true, data: [{ id_persona_trabajador: 4, nombre: 'Maria Perez', cargo: 'Supervisora', area: 'Administración', habilitado: false, habilitado_firma_certificados: true, vigente: true, disponible_asignacion: true }] }); harness.detectChanges();
    expect(vista().querySelector('.funcionarios')?.textContent).toContain('Supervisora');
    expect(vista().querySelector('.funcionarios')?.textContent).not.toContain('Especialista');
    expect(vista().querySelectorAll('.opcion-firmante').length).toBe(1);
    http.expectNone(r => r.method !== 'GET');
  });

  it('muestra un estado vacío cuando no hay habilitados y descarta estados de compatibilidad', async () => {
    await iniciar();
    const c = harness.routeDebugElement!.componentInstance as any;
    c.progreso.set({ ...progreso, facultades: { ...progreso.facultades, asignar: true } }); harness.detectChanges();
    pulsar('Seleccionar firmantes');
    http.expectOne(base + '/31/firma/firmantes-disponibles').flush({ success: true, data: [
      { id_persona_trabajador: 1, vigente: true, disponible_asignacion: true, habilitado: true, habilitado_firma_certificados: false },
      { id_persona_trabajador: 2, vigente: false, disponible_asignacion: true, habilitado_firma_certificados: true },
    ] }); harness.detectChanges();
    expect(vista().querySelectorAll('.opcion-firmante').length).toBe(0);
    expect(vista().textContent).toContain('No hay funcionarios habilitados para este certificado');
    expect(boton('Guardar y poner a disposición').disabled).toBeTrue();
    http.expectNone(r => r.method !== 'GET');
  });

  it('respeta el rechazo 422 si se deshabilita un trabajador después de revisar el PDF', async () => {
    const { c } = await prepararGuardado();
    c.guardar();
    http.expectOne(base + '/31/firma/asignar').flush({ message: 'Responsable no habilitado' }, { status: 422, statusText: 'Unprocessable Entity' });
    http.expectOne(base + '/31/firma/progreso').flush({ success: true, data: { ...progreso, documento: c.documento(), asignacion_documental_persistida: false } });
    harness.detectChanges();
    expect(c.seleccionando()).toBeTrue(); expect(c.errores()['guardar']).toBeTruthy();
    expect(c.documento().estado_certificado).toBe('PENDIENTE_FIRMA');
    http.expectNone(r => r.url.endsWith('/confirmar-pdf') || r.url.endsWith('/create'));
  });

  async function prepararGuardado(origen?: 'reconocimiento' | 'practica') {
    const codigo = 'abc123';
    await iniciar({ ...documento, codigo_verificacion: codigo, hash_pdf: 'b'.repeat(64),
      ...(origen ? { origen, actividad: null, sesion: null, id_sesion: null, beneficiario: { nombre: 'Beneficiaria del origen', id_persona: 999 } } : {}) });
    const c = harness.routeDebugElement!.componentInstance as any;
    c.documento.set({ ...c.documento(), facultades: { ...c.documento().facultades, descargar: true } });
    const funcionario = { ...FIRMANTES_PDF_PRUEBA[0], id_persona_trabajador: 45, orden_firma: 1 };
    const archivo = pdfPrueba([funcionario]);
    const digest = await crypto.subtle.digest('SHA-256', await archivo.blob.arrayBuffer());
    const hashPdf = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
    const guardado = { ...progreso, documento: c.documento(), modalidad: 'PARALELA', facultades: { ...progreso.facultades, asignar: true },
      asignacion_documental_persistida: true, firmantes_asignados: [funcionario], pdf_revisado_disponible: false };
    const confirmado = { ...guardado, documento: { ...c.documento(), hash_pdf_original: 'a'.repeat(64), hash_pdf: hashPdf },
      completada: true, persistido: true, persistencia: 'archivo_privado_versionado', revision_pdf: 'c'.repeat(64), hash_pdf: hashPdf,
      id_certificado_documento: 31, id_certificado: 12, codigo_verificacion: codigo, pdf_revisado_disponible: true, disponible_rrhh: true };
    c.progreso.set({ ...guardado, asignacion_documental_persistida: false, firmantes_asignados: [] });
    c.seleccionando.set(true); c.seleccion.set([funcionario]); c.claveRevision = JSON.stringify(c.plan());
    c.revision.set({ token_revision: 'd'.repeat(64), hash_pdf: hashPdf, expires_at: new Date(Date.now() + 60000).toISOString() });
    c.previa.set(archivo); c.pdfVisualizado(archivo); harness.detectChanges();
    return { c, guardado, confirmado, archivo };
  }
  for (const origen of ['reconocimiento', 'practica'] as const) {
    it('confirma ' + origen + ' sin sesión mediante el mismo plan y habilita RR. HH. sin cambiar identidad', async () => {
      const { c, guardado, confirmado, archivo } = await prepararGuardado(origen);
      c.guardar();
      const asignacion = http.expectOne(base + '/31/firma/asignar');
      expect(asignacion.request.body.firmantes).toEqual([{ id_persona_trabajador: 45, orden_firma: 1 }]);
      expect(asignacion.request.body.firmantes[0].id_persona_trabajador).not.toBe(999);
      asignacion.flush({ success: true, data: { ...guardado, completada: true, persistido: true } });
      const revision = http.expectOne(base + '/31/firma/confirmar-pdf');
      expect(revision.request.body.token_revision).toBe('d'.repeat(64)); revision.flush({ success: true, data: confirmado });
      http.expectOne(base + '/31/firma/firmantes-asignados').flush({ success: true, data: confirmado });
      http.expectOne(base + '/31/firma/pdf-autorizado').flush(archivo.blob);
      await finalizarGuardado(c, confirmado.documento.hash_pdf);
      expect(c.documento().id_certificado_documento).toBe(31); expect(c.documento().codigo_verificacion).toBe('abc123');
      expect(c.documento().id_sesion).toBeNull(); expect(c.documento().origen).toBe(origen);
      expect(c.documento().estado_certificado).toBe('PENDIENTE_FIRMA');
      expect(vista().textContent).toContain('Listo para entrega');
      expect(TestBed.inject(Router).navigate).toHaveBeenCalledWith(['/pendientes/documentos-firmar'], { queryParams: { pestana: 'preparados' }, state: { certificadoListo: true } });
      http.expectNone(r => /emitir|entregar|activity-session/.test(r.url));
    });
  }
  it('actualiza la bandeja de Gerencia aunque exista una consulta anterior en curso', async () => {
    harness = await RouterTestingHarness.create('/pendientes/documentos-firmar');
    const anterior = http.expectOne(r => r.url === base + '/list');
    TestBed.inject(CambiosCertificadosService).confirmar();
    expect(anterior.cancelled).toBeTrue();
    const pendiente = { ...documento, disponible_rrhh: false };
    const listo = { ...documento, id_certificado_documento: 32, pdf_confirmado: true, disponible_rrhh: true };
    http.expectOne(r => r.url === base + '/list').flush({ success: true, data: { data: [pendiente, listo], current_page: 1, last_page: 1 } });
    http.expectOne(base + '/31/firma/progreso').flush({ success: true, data: { ...progreso, documento: pendiente, disponible_rrhh: false } });
    http.expectOne(base + '/32/firma/progreso').flush({ success: true, data: { ...progreso, documento: listo, disponible_rrhh: true } }); harness.detectChanges();
    expect(vista().querySelectorAll('tbody tr').length).toBe(1); expect(vista().textContent).toContain('Pendiente de firma');
    TestBed.inject(CambiosCertificadosService).confirmar();
    http.expectOne(r => r.url === base + '/list').flush({ success: true, data: { data: [], current_page: 1, last_page: 1 } }); harness.detectChanges();
    expect(vista().querySelector('tbody tr')).toBeNull(); http.expectNone(r => r.method !== 'GET');
  });
  it('un PDF confirmado muestra responsables y disponibilidad RR. HH. sin repetir asignación', async () => {
    await iniciar({ ...documento, disponible_rrhh: true, responsables_administrativos: [{ nombre: 'Responsable confirmado', cargo: 'Gerente', orden_firma: 1 }] });
    const c = harness.routeDebugElement!.componentInstance as any;
    c.progreso.set({ ...c.progreso(), pdf_revisado_disponible: true, modalidad: 'SECUENCIAL', firmantes_asignados: [], facultades: { ...progreso.facultades, asignar: true } });
    harness.detectChanges();
    expect(vista().textContent).toContain('Listo para entrega');
    expect(vista().textContent).toContain('Responsable confirmado'); expect(vista().textContent).toContain('Gerente');
    expect(boton('Seleccionar firmantes')).toBeUndefined(); expect(c.seleccionando()).toBeFalse();
    const panel = vista().querySelector('.panel-firmas')!;
    expect(panel.querySelector('.estado-listo')?.textContent).toBe('Listo para entrega');
    expect(panel.querySelector('input, select, .acciones-panel')).toBeNull();
    expect(panel.querySelector('.modalidad-aplicada')?.textContent).toBe('Secuencial');
    expect(panel.querySelector('.orden-responsables')?.textContent).toContain('Responsable confirmado');
    expect(c.documento().estado_certificado).toBe('PENDIENTE_FIRMA');
    http.expectNone(r => r.method !== 'GET');
  });
  it('abre el documento 7 confirmado en lectura sin estados contradictorios ni nuevas escrituras', async () => {
    const archivo = pdfPrueba();
    const digest = await crypto.subtle.digest('SHA-256', await archivo.blob.arrayBuffer());
    const hashPdf = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
    const doc = { ...documento, id_certificado_documento: 7, id_certificado: 17, id_sesion: 3,
      beneficiario: { nombre: 'Juan Alcalde' }, actividad: 'Capacitación Personal', sesion: 'N°003',
      pdf_confirmado: true, disponible_rrhh: true, hash_pdf: hashPdf, modalidad_firma: 'Paralela' as const,
      firmantes: [{ id_firma: null, id_persona_trabajador: 2, nombre: 'Maria Perez', cargo: 'Especialista de RR. HH.', orden_firma: 1, estado: 'Pendiente' }], facultades: { descargar: true, remitir: false } };
    harness = await RouterTestingHarness.create('/pendientes/documentos-firmar/7');
    function responder() {
      http.expectOne(base + '/detail/7?flujo=firmas').flush({ success: true, data: doc });
      http.expectOne(base + '/7/firma/progreso').flush({ success: true, data: { ...progreso, documento: doc, pdf_confirmado: true, disponible_rrhh: true, firmantes_asignados: doc.firmantes, modalidad: 'PARALELA' } });
      http.expectOne(base + '/7/firma/verificacion').flush({ success: true, data: { id_certificado_documento: 7, hash_pdf: hashPdf, integridad_verificada: true } }); harness.detectChanges();
    }
    responder(); http.expectOne(base + '/7/firma/pdf-autorizado').flush(archivo.blob);
    const c = harness.routeDebugElement!.componentInstance as any;
    for (let i = 0; i < 100 && !c.vigente(); i++) await new Promise(r => setTimeout(r, 10));
    harness.detectChanges();
    expect(vista().querySelector('.titulo-detalle .estado')?.textContent).toBe('Listo para entrega');
    expect(vista().querySelector('.panel-firmas .estado')?.textContent).toBe('Listo para entrega');
    expect(vista().querySelector('.asignado')?.textContent).toContain('Maria Perez');
    expect(vista().querySelector('.asignado')?.textContent).not.toContain('Pendiente');
    expect(vista().querySelector('.modalidad-aplicada')?.textContent).toBe('Paralela');
    expect(vista().querySelector('.acciones-panel, .abrir-seleccion')).toBeNull();
    expect(vista().textContent).not.toContain('Pendiente de firma');
    c.cargarDocumento(); responder(); http.expectNone(r => r.method !== 'GET');
  });

  it('conserva la recuperación si falla la descarga de un PDF ya confirmado', async () => {
    const { c, guardado, confirmado, archivo } = await prepararGuardado();
    c.guardar(); http.expectOne(base + '/31/firma/asignar').flush({ success: true, data: { ...guardado, completada: true, persistido: true } });
    http.expectOne(base + '/31/firma/confirmar-pdf').flush({ success: true, data: { ...confirmado, pdf_confirmado: true, reintento: true } });
    http.expectOne(base + '/31/firma/firmantes-asignados').flush({ success: true, data: { ...confirmado, pdf_confirmado: true } });
    http.expectOne(base + '/31/firma/pdf-autorizado').flush(new Blob([]), { status: 503, statusText: 'Unavailable' });
    // El servicio lee asíncronamente los errores de descarga binaria antes de normalizarlos.
    let progreso = http.match(base + '/31/firma/progreso')[0];
    for (let i = 0; i < 100 && !progreso; i++) {
      await new Promise(r => setTimeout(r, 10));
      progreso = http.match(base + '/31/firma/progreso')[0];
    }
    expect(progreso).toBeDefined();
    progreso.flush({ success: true, data: { ...confirmado, pdf_confirmado: true } });
    http.expectOne(base + '/31/firma/pdf-autorizado').flush(new Blob([]), { status: 503, statusText: 'Unavailable' });
    for (let i = 0; i < 100 && c.cargas().has('guardar'); i++) await new Promise(r => setTimeout(r, 10));
    expect(TestBed.inject(Router).navigate).not.toHaveBeenCalled(); expect(c.requiereActualizar()).toBeTrue(); expect(c.revision()).not.toBeNull();
    c.guardar(); http.expectNone(r => r.method === 'POST');
    http.expectOne(base + '/31/firma/progreso').flush({ success: true, data: { ...confirmado, pdf_confirmado: true } });
    http.expectOne(base + '/31/firma/pdf-autorizado').flush(archivo.blob);
    await finalizarGuardado(c, confirmado.documento.hash_pdf);
  });

  it('no interpreta un alias antiguo como confirmación si pdf_confirmado es false', async () => {
    const { c, guardado, confirmado } = await prepararGuardado();
    c.guardar(); http.expectOne(base + '/31/firma/asignar').flush({ success: true, data: { ...guardado, completada: true, persistido: true } });
    const noConfirmado = { ...confirmado, pdf_confirmado: false, pdf_revisado_disponible: true };
    http.expectOne(base + '/31/firma/confirmar-pdf').flush({ success: true, data: noConfirmado });
    http.expectOne(base + '/31/firma/progreso').flush({ success: true, data: noConfirmado }); harness.detectChanges();
    expect(c.disponibleRrhh()).toBeFalse(); expect(c.seleccionando()).toBeTrue();
    expect(TestBed.inject(Router).navigate).not.toHaveBeenCalled();
    http.expectNone(base + '/31/firma/pdf-autorizado');
  });

  async function finalizarGuardado(c: any, hashPdf: string) {
    for (let i = 0; i < 150 && (c.cargas().has('guardar') || c.cargas().has('recuperacion')); i++) await new Promise(r => setTimeout(r, 20));
    expect(c.errores()['guardar']).toBeFalsy();
    http.expectOne(base + '/31/firma/verificacion').flush({ success: true, data: { id_certificado_documento: 31, hash_pdf: hashPdf, integridad_verificada: true } });
    harness.detectChanges();
    expect(c.seleccionando()).toBeFalse(); expect(c.aviso()).toBe('Certificado listo para entrega');
    expect(c.documento().estado_certificado).toBe('PENDIENTE_FIRMA');
    expect(TestBed.inject(Router).navigate).toHaveBeenCalledWith(['/pendientes/documentos-firmar'], { queryParams: { pestana: 'preparados' }, state: { certificadoListo: true } });
    expect(vista().textContent).toContain('Listo para entrega');
  }
  it('acepta el JSON real sin id_documento_anterior y distingue hash original del vigente; verifica el PDF binario', async () => {
    const { c, guardado, confirmado, archivo } = await prepararGuardado();
    expect(c.documento().hash_pdf_original).toBeUndefined();
    expect(confirmado.documento.hash_pdf_original).not.toBe(c.documento().hash_pdf);
    expect(c.esDocumentoRecibido(confirmado.documento)).toBeTrue();
    c.guardar();
    http.expectOne(base + '/31/firma/asignar').flush({ success: true, data: { ...guardado, completada: true, persistido: true } });
    const confirmar = http.expectOne(base + '/31/firma/confirmar-pdf');
    expect(confirmar.request.body.token_revision).toBe('d'.repeat(64));
    confirmar.flush({ success: true, data: confirmado });
    http.expectOne(base + '/31/firma/firmantes-asignados').flush({ success: true, data: confirmado });
    const pdf = http.expectOne(base + '/31/firma/pdf-autorizado');
    expect(pdf.request.responseType).toBe('blob');
    pdf.flush(archivo.blob, { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename=certificado-abc123.pdf' } });
    await finalizarGuardado(c, confirmado.documento.hash_pdf);
    expect(await c.vigente().blob.text()).toBe(await archivo.blob.text());
    http.expectNone(r => r.method === 'POST');
  });
  it('reanuda una asignación persistida sin repetir asignar', async () => {
    const { c, guardado, confirmado, archivo } = await prepararGuardado(); c.progreso.set(guardado);
    c.guardar(); http.expectNone(base + '/31/firma/asignar');
    http.expectOne(base + '/31/firma/confirmar-pdf').flush({ success: true, data: confirmado });
    http.expectOne(base + '/31/firma/firmantes-asignados').flush({ success: true, data: confirmado });
    http.expectOne(base + '/31/firma/pdf-autorizado').flush(archivo.blob);
    await finalizarGuardado(c, confirmado.documento.hash_pdf);
  });
  it('reintenta únicamente la confirmación después de un guardado parcial', async () => {
    const { c, guardado, confirmado, archivo } = await prepararGuardado();
    c.guardar(); http.expectOne(base + '/31/firma/asignar').flush({ success: true, data: { ...guardado, completada: true, persistido: true } });
    http.expectOne(base + '/31/firma/confirmar-pdf').flush({ message: 'Acción no autorizada' }, { status: 403, statusText: 'Forbidden' });
    http.expectOne(base + '/31/firma/progreso').flush({ success: true, data: guardado });
    expect(c.aviso()).toContain('asignación quedó guardada'); expect(c.seleccionando()).toBeTrue();
    c.guardar(); http.expectNone(r => r.method === 'POST');
    http.expectOne(base + '/31/firma/progreso').flush({ success: true, data: guardado });
    c.guardar(); http.expectNone(base + '/31/firma/asignar');
    const confirmar = http.expectOne(base + '/31/firma/confirmar-pdf'); expect(confirmar.request.body.token_revision).toBe('d'.repeat(64));
    confirmar.flush({ success: true, data: confirmado });
    http.expectOne(base + '/31/firma/firmantes-asignados').flush({ success: true, data: confirmado });
    http.expectOne(base + '/31/firma/pdf-autorizado').flush(archivo.blob);
    await finalizarGuardado(c, confirmado.documento.hash_pdf);
  });
  it('recupera un 409 si el progreso ya acredita el PDF exacto, sin repetir confirmación ni asignación', async () => {
    const { c, guardado, confirmado, archivo } = await prepararGuardado();
    c.guardar(); http.expectOne(base + '/31/firma/asignar').flush({ success: true, data: { ...guardado, completada: true, persistido: true } });
    http.expectOne(base + '/31/firma/confirmar-pdf').flush({ message: 'La revisión ya se aplicó' }, { status: 409, statusText: 'Conflict' });
    http.expectOne(base + '/31/firma/progreso').flush({ success: true, data: confirmado });
    http.expectOne(base + '/31/firma/pdf-autorizado').flush(archivo.blob);
    await finalizarGuardado(c, confirmado.documento.hash_pdf);
    http.expectNone(r => r.method === 'POST');
  });
  it('recupera un timeout ya confirmado sin repetir asignacion ni confirmacion', async () => {
    const { c, guardado, confirmado, archivo } = await prepararGuardado();
    const confirmar = spyOn(TestBed.inject(FirmaDocumentalService), 'confirmarPdf').and.returnValue(throwError(() => new TimeoutError()));
    const cambios = spyOn(TestBed.inject(CambiosCertificadosService), 'confirmar').and.callThrough();
    c.guardar();
    http.expectOne(base + '/31/firma/asignar').flush({ success: true, data: { ...guardado, persistido: true, completada: true } });
    expect(confirmar).toHaveBeenCalledOnceWith(31, 'd'.repeat(64));
    expect(c.seleccionando()).toBeTrue(); expect(c.disponibleRrhh()).toBeFalse(); expect(cambios).not.toHaveBeenCalled();
    http.expectOne(base + '/31/firma/progreso').flush({ success: true, data: confirmado });
    http.expectOne(base + '/31/firma/pdf-autorizado').flush(archivo.blob);
    await finalizarGuardado(c, confirmado.documento.hash_pdf);
    expect(cambios).toHaveBeenCalledTimes(1); expect(c.disponibleRrhh()).toBeTrue();
    expect(vista().textContent).not.toContain('Timeout has occurred'); http.expectNone(r => r.method === 'POST');
  });
  it('no anuncia disponibilidad si la revision esta confirmada pero RR. HH. aun no esta autorizado', async () => {
    const { c, guardado, confirmado, archivo } = await prepararGuardado();
    const cambios = spyOn(TestBed.inject(CambiosCertificadosService), 'confirmar').and.callThrough();
    const noDisponible = { ...confirmado, disponible_rrhh: false };
    c.guardar(); http.expectOne(base + '/31/firma/asignar').flush({ success: true, data: { ...guardado, persistido: true, completada: true } });
    http.expectOne(base + '/31/firma/confirmar-pdf').flush({ success: true, data: noDisponible });
    http.expectOne(base + '/31/firma/firmantes-asignados').flush({ success: true, data: noDisponible });
    http.expectOne(base + '/31/firma/progreso').flush({ success: true, data: noDisponible }); harness.detectChanges();
    expect(c.seleccionando()).toBeTrue(); expect(c.disponibleRrhh()).toBeFalse(); expect(c.requiereActualizar()).toBeTrue();
    expect(c.seleccion().length).toBe(1); expect(cambios).not.toHaveBeenCalled();
    expect(vista().textContent).not.toContain('Listo para entrega');
    c.guardar(); http.expectNone(r => r.method === 'POST');
    http.expectOne(base + '/31/firma/progreso').flush({ success: true, data: confirmado });
    http.expectOne(base + '/31/firma/pdf-autorizado').flush(archivo.blob);
    for (let n = 0; n < 150 && c.cargas().has('recuperacion'); n++) await new Promise(r => setTimeout(r, 20));
    http.expectOne(base + '/31/firma/verificacion').flush({ success: true, data: { id_certificado_documento: 31, hash_pdf: confirmado.documento.hash_pdf, integridad_verificada: true } }); harness.detectChanges();
    expect(c.seleccionando()).toBeFalse(); expect(c.disponibleRrhh()).toBeTrue(); expect(cambios).toHaveBeenCalledTimes(1);
    http.expectNone(r => r.method === 'POST');
  });
  it('ante resultado incierto exige una consulta explicita y conserva la seleccion sin repetir escrituras', async () => {
    const { c, guardado } = await prepararGuardado();
    const confirmar = spyOn(TestBed.inject(FirmaDocumentalService), 'confirmarPdf').and.returnValue(throwError(() => new TimeoutError()));
    c.guardar(); http.expectOne(base + '/31/firma/asignar').flush({ success: true, data: { ...guardado, persistido: true, completada: true } });
    http.expectOne(base + '/31/firma/progreso').flush({ message: 'Sin conexion' }, { status: 503, statusText: 'Error' }); harness.detectChanges();
    expect(c.requiereActualizar()).toBeTrue(); expect(c.seleccion().length).toBe(1); expect(c.seleccionando()).toBeTrue();
    expect(boton('Actualizar estado')).toBeDefined(); expect(vista().textContent).not.toContain('Timeout has occurred');
    c.guardar(); http.expectNone(r => r.method === 'POST');
    http.expectOne(base + '/31/firma/progreso').flush({ success: true, data: guardado }); harness.detectChanges();
    expect(confirmar).toHaveBeenCalledTimes(1); expect(c.requiereActualizar()).toBeFalse(); expect(c.seleccionando()).toBeTrue();
    expect(c.seleccion().length).toBe(1); http.expectNone(r => r.method === 'POST');
  });
  it('rechaza cambios de identidad, hash original conocido y otros planes sin asignar de nuevo', async () => {
    const { c, guardado, confirmado } = await prepararGuardado();
    expect(c.esDocumentoRecibido({ ...confirmado.documento, codigo_verificacion: 'otro' })).toBeFalse();
    expect(c.esDocumentoRecibido({ ...confirmado.documento, id_certificado: 99 })).toBeFalse();
    c.documento.set({ ...c.documento(), hash_pdf_original: 'e'.repeat(64) });
    expect(c.esDocumentoRecibido(confirmado.documento)).toBeFalse();
    c.progreso.set({ ...guardado, modalidad: 'SECUENCIAL' }); c.guardar();
    expect(c.errores()['guardar']).toContain('otro plan guardado'); http.expectNone(r => r.method === 'POST');
  });
  it('muestra datos reales en página completa, sin modal y con acciones auténticas bloqueadas', async () => {
    await iniciar();
    expect(vista().querySelector('app-dialogo')).toBeNull();
    expect(vista().textContent).toContain('Pendiente de firma');
    expect(vista().textContent).toContain('Firmantes pendientes de asignación');
    expect(boton('Firmar digitalmente')).toBeUndefined(); expect(boton('Emitir certificado')).toBeUndefined();
    expect(vista().querySelector('.panel-firmas')?.textContent).toContain('Firmas del certificado');
    expect(vista().querySelector('.panel-firmas')?.textContent).not.toContain('Consultar');
    expect(vista().querySelector('.titulo-detalle .estado')?.textContent).toBe('Pendiente de firma');
    expect(vista().querySelector<HTMLAnchorElement>('[aria-label="Volver a certificados por firmar"]')!.getAttribute('href')).toContain('page=3');
    http.expectNone(r => r.method !== 'GET');
  });
  it('muestra solo los firmantes asignados y omite contadores sin responsables definidos', async () => {
    await iniciar({ ...documento, firmantes: [{ id_firma: 7, nombre: 'Nombre autorizado', cargo: 'Cargo autorizado', estado: 'Pendiente' }] });
    const panel = vista().querySelector('.panel-firmas')!;
    expect(panel.textContent).toContain('Nombre autorizado'); expect(panel.textContent).toContain('Cargo autorizado');
    expect(panel.textContent).toContain('Pendiente'); expect(panel.textContent).not.toContain('Firmantes pendientes de asignación');
    expect(panel.textContent).not.toContain('Firmas registradas');
    http.expectNone(r => r.method !== 'GET');
  });
  it('excluye datos administrativos y DEMO incluso si Laravel habilita la demostración local', async () => {
    await iniciar();
    expect(vista().querySelector('details')).toBeNull();
    for (const texto of ['Información del documento', 'Pruebas de firma', 'Consultar integridad', 'Documento íntegro', 'Consultar progreso', 'Consultar responsables', 'Modalidad pendiente', 'Simular firma', 'Firmas registradas', documento.actividad!, documento.sesion!]) {
      expect(vista().textContent).not.toContain(texto);
    }
    expect(vista().querySelectorAll('.panel-firmas button').length).toBe(1);
    http.expectNone(r => r.url.includes('/demo/') || r.method === 'POST');
  });
  async function cargarPendienteAutorizado(integridadProgreso: boolean | null = true, verificar = true) {
    harness = await RouterTestingHarness.create('/pendientes/documentos-firmar/9');
    const doc = { ...documento, id_certificado_documento: 9, id_certificado: 8, id_sesion: 5,
      beneficiario: { nombre: 'Maria Perez' }, actividad: 'Capacitación Personal', sesion: 'N.º 004',
      pdf_confirmado: false, disponible_rrhh: false };
    http.expectOne(base + '/detail/9?flujo=firmas').flush({ success: true, data: doc });
    harness.detectChanges(); expect(boton('Seleccionar firmantes').disabled).toBeTrue();
    http.expectOne(base + '/9/firma/progreso').flush({ success: true, data: { ...progreso, documento: doc,
      integridad_verificada: integridadProgreso, pdf_confirmado: false, disponible_rrhh: false,
      firma_verificada: false, facultades: { ...progreso.facultades, asignar: true } } });
    harness.detectChanges();
    return verificar ? http.expectOne(base + '/9/firma/verificacion') : null;
  }

  it('permite seleccionar para Maria Perez pendiente sin firma criptográfica ni PDF confirmado', async () => {
    const verificacion = await cargarPendienteAutorizado();
    verificacion!.flush({ success: true, data: { id_certificado_documento: 9, hash_pdf: hash, integridad_verificada: true,
      firma_verificada: false, codigo_bloqueo: 'MOTOR_FIRMA_NO_DISPONIBLE' } }); harness.detectChanges();
    expect(boton('Seleccionar firmantes').disabled).toBeFalse(); pulsar('Seleccionar firmantes');
    http.expectOne(base + '/9/firma/firmantes-disponibles').flush({ success: true, data: [
      { id_persona_trabajador: 2, nombre: 'Maria Perez', cargo: 'Especialista', area: 'RR. HH.', vigente: true, habilitado_firma_certificados: true, disponible_asignacion: true },
      { id_persona_trabajador: 4, nombre: 'Maria Perez', cargo: 'Supervisora', area: 'Otra área', vigente: true, habilitado_firma_certificados: false, disponible_asignacion: false },
    ] }); harness.detectChanges();
    expect(vista().querySelectorAll('.opcion-firmante').length).toBe(1);
    expect(vista().querySelector('.opcion-firmante')?.textContent).toContain('Especialista'); http.expectNone(r => r.method !== 'GET');
  });

  it('no confunde el PDF inicial sin responsables con una preparación administrativa confirmada', async () => {
    const verificacion = await cargarPendienteAutorizado();
    verificacion!.flush({ success: true, data: { id_certificado_documento: 9, hash_pdf: hash, integridad_verificada: true } });
    const c = harness.routeDebugElement!.componentInstance as any;
    c.progreso.set({ ...c.progreso(), pdf_confirmado: true, disponible_rrhh: false, asignacion_documental_persistida: false }); harness.detectChanges();
    expect(boton('Seleccionar firmantes').disabled).toBeFalse();
    c.progreso.set({ ...c.progreso(), asignacion_documental_persistida: true }); harness.detectChanges();
    expect(boton('Seleccionar firmantes')).toBeUndefined(); http.expectNone(r => r.method !== 'GET');
  });

  for (const status of [0, 500, 504]) it('no bloquea la autorización e integridad de progreso por fallo auxiliar ' + status, async () => {
    const verificacion = await cargarPendienteAutorizado();
    if (status === 0) verificacion!.error(new ProgressEvent('error'));
    else verificacion!.flush({}, { status, statusText: 'Error' });
    harness.detectChanges(); expect(boton('Seleccionar firmantes').disabled).toBeFalse();
    expect(vista().textContent).not.toContain('No se pudo verificar el documento.');
    expect(vista().querySelector('[role=alert]')).not.toBeNull();
    pulsar('Reintentar verificación');
    http.expectOne(base + '/9/firma/verificacion').flush({ success: true, data: { id_certificado_documento: 9, hash_pdf: hash, integridad_verificada: true } }); harness.detectChanges();
    expect(boton('Seleccionar firmantes').disabled).toBeFalse();
    expect((harness.routeDebugElement!.componentInstance as any).cargas().has('integridad')).toBeFalse();
  });

  it('permite seleccionar ante timeout auxiliar si progreso ya acredita integridad y autorización', async () => {
    spyOn(TestBed.inject(FirmaDocumentalService), 'verificacion').and.returnValue(throwError(() => new TimeoutError()));
    await cargarPendienteAutorizado(true, false); harness.detectChanges();
    expect(boton('Seleccionar firmantes').disabled).toBeFalse();
    expect((harness.routeDebugElement!.componentInstance as any).cargas().has('integridad')).toBeFalse();
    expect(vista().querySelector('[role=alert]')).not.toBeNull();
  });

  for (const status of [401, 403, 404, 409]) it('respeta bloqueo de verificación HTTP ' + status + ' aunque progreso autorice', async () => {
    const verificacion = await cargarPendienteAutorizado(); verificacion!.flush({}, { status, statusText: 'Error' }); harness.detectChanges();
    expect(boton('Seleccionar firmantes').disabled).toBeTrue();
    (harness.routeDebugElement!.componentInstance as any).abrirSeleccion(); http.expectNone(base + '/9/firma/firmantes-disponibles');
    pulsar('Reintentar verificación');
    http.expectOne(base + '/9/firma/verificacion').flush({ success: true, data: { id_certificado_documento: 9, hash_pdf: hash, integridad_verificada: true } }); harness.detectChanges();
    expect(boton('Seleccionar firmantes').disabled).toBeFalse();
  });

  for (const evidencia of ['negativa', 'hash-distinto']) it('mantiene protección ante integridad real ' + evidencia, async () => {
    const verificacion = await cargarPendienteAutorizado();
    verificacion!.flush({ success: true, data: { id_certificado_documento: 9, hash_pdf: evidencia === 'hash-distinto' ? 'f'.repeat(64) : hash, integridad_verificada: evidencia !== 'negativa' } }); harness.detectChanges();
    expect(boton('Seleccionar firmantes').disabled).toBeTrue();
    pulsar('Reintentar verificación'); http.expectOne(base + '/9/firma/verificacion').flush({}, { status: 500, statusText: 'Error' }); harness.detectChanges();
    expect(boton('Seleccionar firmantes').disabled).toBeTrue(); http.expectNone(r => r.method !== 'GET');
  });

  it('no habilita por información opcional ausente si tampoco hay evidencia de integridad', async () => {
    const verificacion = await cargarPendienteAutorizado(null);
    verificacion!.flush({ success: true, data: { id_certificado_documento: 9 } }); harness.detectChanges();
    expect(boton('Seleccionar firmantes').disabled).toBeTrue(); expect(boton('Reintentar verificación')).toBeDefined();
  });

  it('acepta información auxiliar incompleta si progreso sí verificó el archivo', async () => {
    const verificacion = await cargarPendienteAutorizado();
    verificacion!.flush({ success: true, data: { id_certificado_documento: 9 } }); harness.detectChanges();
    expect(boton('Seleccionar firmantes').disabled).toBeFalse(); expect(boton('Reintentar verificación')).toBeDefined();
  });

  it('no ignora una integridad negativa comunicada por progreso', async () => {
    const verificacion = await cargarPendienteAutorizado(false);
    verificacion!.flush({ success: true, data: { id_certificado_documento: 9, hash_pdf: hash, integridad_verificada: true } }); harness.detectChanges();
    expect(boton('Seleccionar firmantes').disabled).toBeTrue();
  });

  it('mantiene el bloqueo si falta la consulta esencial de progreso y ofrece reintentar', async () => {
    const verificacion = await cargarPendienteAutorizado();
    verificacion!.flush({ success: true, data: { id_certificado_documento: 9, hash_pdf: hash, integridad_verificada: true } }); harness.detectChanges();
    const c = harness.routeDebugElement!.componentInstance as any; c.actualizarProgreso();
    http.expectOne(base + '/9/firma/progreso').flush({}, { status: 403, statusText: 'Forbidden' }); harness.detectChanges();
    expect(boton('Seleccionar firmantes').disabled).toBeTrue(); expect(boton('Reintentar consulta del documento')).toBeDefined();
  });

  it('mantiene los bloqueos ante integridad inválida y no ejecuta acciones oficiales ni DEMO', async () => {
    await iniciar();
    (harness.routeDebugElement!.componentInstance as unknown as { verificarIntegridad: () => void }).verificarIntegridad();
    http.expectOne(base + '/31/firma/verificacion').flush({ success: true, data: { id_certificado_documento: 31, hash_pdf: hash, integridad_verificada: false } }); harness.detectChanges();
    expect(vista().textContent).toContain('No se pudo verificar el documento.');

    expect(boton('Firmar digitalmente')).toBeUndefined(); expect(boton('Emitir certificado')).toBeUndefined();
    http.expectNone(r => r.method === 'POST');
  });
  for (const status of [401, 403, 404]) {
    it('respeta la denegación de consulta HTTP ' + status, async () => {
      harness = await RouterTestingHarness.create('/pendientes/documentos-firmar/31');
      http.expectOne(base + '/detail/31?flujo=firmas').flush({ message: 'No autorizado' }, { status, statusText: 'Error' }); harness.detectChanges();
      expect(vista().querySelector('app-visor-pdf')).toBeNull();
      expect(vista().querySelector('[role="alert"]')).not.toBeNull();
      http.expectNone(() => true);
    });
  }
  it('vuelve a la página de bandeja conservando paginación y navega con RouterLink al ID real', async () => {
    await iniciar();
    vista().querySelector<HTMLAnchorElement>('.regreso')!.click();
    await harness.fixture.whenStable(); harness.detectChanges();
    http.expectOne(r => r.url === base + '/list' && r.params.get('page') === '3').flush({ success: true, data: { data: [documento], current_page: 3, last_page: 3 } });
    http.expectOne(base + '/31/firma/progreso').flush({ success: true, data: progreso });
    harness.detectChanges();
    expect(TestBed.inject(Router).url).toBe('/pendientes/documentos-firmar?page=3');
    const enlace = vista().querySelector<HTMLAnchorElement>('tbody a')!;
    expect(enlace.getAttribute('href')).toContain('/pendientes/documentos-firmar/31?page=3');
  });
  it('recupera el PDF almacenado, permite zoom y descarga, e imprime sin volver a generarlo', async () => {
    await iniciar({ ...documento, facultades: { ...documento.facultades, descargar: true } });
    const crear = URL.createObjectURL.bind(URL);
    const listo = new Promise<void>(resolve => spyOn(URL, 'createObjectURL').and.callFake(blob => { resolve(); return crear(blob); }));
    http.expectOne(base + '/31/firma/pdf-autorizado').flush(new Blob(['%PDF-1.4\n%%EOF'], { type: 'application/pdf' }));
    await listo; harness.detectChanges();
    const iframe = vista().querySelector<HTMLElement>('app-pdf-continuo-simulado')!;
    expect(iframe).not.toBeNull(); expect(vista().querySelector('a[download]')).not.toBeNull();
    expect(vista().textContent).not.toContain('El PDF almacenado contiene el QR');
    const zoom = vista().querySelector<HTMLSelectElement>('[aria-label="Zoom del PDF"]')!;
    zoom.value = '150'; zoom.dispatchEvent(new Event('change')); harness.detectChanges();
    expect(iframe).toBe(vista().querySelector<HTMLElement>('app-pdf-continuo-simulado')!);
    expect(zoom.value).toBe('150');
    pulsar('Imprimir PDF');
    (harness.routeDebugElement!.componentInstance as unknown as { actualizarProgreso: () => void }).actualizarProgreso();
    http.expectOne(base + '/31/firma/progreso').flush({ success: true, data: { ...progreso, documento: { ...documento, facultades: { ...documento.facultades, descargar: true } } } }); harness.detectChanges();
    expect(vista().querySelector('app-pdf-continuo-simulado')).toBe(iframe); http.expectNone(r => r.url.includes('/archivo'));
    const revocar = spyOn(URL, 'revokeObjectURL').and.callThrough();
    harness.fixture.destroy(); expect(revocar).toHaveBeenCalled();
  });
  it('presenta resultados individuales de lote y errores sin firmar ni emitir', async () => {
    harness = await RouterTestingHarness.create('/pendientes/documentos-firmar');
    http.expectOne(r => r.url === base + '/list').flush({ success: true, data: { data: [documento, { ...documento, id_certificado_documento: 32 }], current_page: 1, last_page: 1 } });
    http.expectOne(base + '/31/firma/progreso').flush({ success: true, data: progreso });
    http.expectOne(base + '/32/firma/progreso').flush({ success: true, data: { ...progreso, documento: { ...documento, id_certificado_documento: 32 } } }); harness.detectChanges();
    expect(vista().querySelectorAll('tbody input').length).toBe(0);
    expect(vista().textContent).not.toContain('Consulta por lote');
    const c = harness.routeDebugElement!.componentInstance as any;
    c.seleccionarDocumento(31, true); c.seleccionarDocumento(32, true); c.consultarLote();
    const req = http.expectOne(base + '/firmas/lote/progreso'); expect(req.request.body).toEqual({ ids_documentos: [31, 32] });
    req.flush({ success: true, data: { lote_persistido: false, resultados: [{ id_certificado_documento: 31, status: 200, success: true, data: progreso }, { id_certificado_documento: 32, status: 404, success: false, message: 'Fuera de ámbito' }] } }); harness.detectChanges();
    expect(c.resultados().length).toBe(2); expect(c.resultados()[1].status).toBe(404);
    expect(vista().querySelectorAll('article').length).toBe(0);
    http.expectNone(r => r.method === 'POST');
  });
  it('excluye de tareas el PDF que Laravel confirma disponible para RR. HH.', async () => {
    harness = await RouterTestingHarness.create('/pendientes/documentos-firmar');
    http.expectOne(r => r.url === base + '/list').flush({ success: true, data: { data: [documento], current_page: 1, last_page: 1 } });
    http.expectOne(base + '/31/firma/progreso').flush({ success: true, data: { ...progreso, disponible_rrhh: true, pdf_revisado_disponible: true } });
    harness.detectChanges(); expect(vista().querySelector('tbody a')).toBeNull();
    expect(vista().textContent).toContain('No hay certificados pendientes de firma.');
    http.expectNone(r => r.method !== 'GET');
  });
  it('organiza PDF y panel en dos columnas y pasa a una en móvil', async () => {
    await iniciar();
    const regla = Array.from(document.styleSheets).flatMap(s => { try { return Array.from(s.cssRules, r => r.cssText); } catch { return []; } }).join(' ');
    expect(regla).toContain('900px'); expect(vista().querySelector('.detalle-documental > .pdf')).not.toBeNull();
    expect(vista().querySelector('.detalle-documental > aside')).not.toBeNull();
  });
  it('bloquea selección sin emision.editar aunque el documento sea consultable', async () => {
    await iniciar(); gestionar=false; const c=harness.routeDebugElement!.componentInstance as any;
    c.progreso.set({...progreso,facultades:{...progreso.facultades,asignar:true}}); harness.detectChanges(); expect(boton('Seleccionar firmantes').disabled).toBeTrue();
    pulsar('Seleccionar firmantes'); http.expectNone(base+'/31/firma/firmantes-disponibles');
  });


  it('actualiza PDF sin guardar, cancela solicitudes antiguas y limita cambios r?pidos', async () => {
    await iniciar(); const c=harness.routeDebugElement!.componentInstance as any;
    c.seleccionando.set(true);
    const a={id_persona_trabajador:4,id_persona:6,nombre:'María Perez',cargo:'Gerente',area:'Gerencia'}, b={id_persona_trabajador:5,id_persona:7,nombre:'Antón Talián',cargo:'Director',area:'Administración'};
    c.disponibles.set([a,b]); harness.detectChanges();
    const panel = vista().querySelector('.panel-firmas')!;
    expect(panel.querySelector('input:not([type=checkbox])')).toBeNull();
    expect(panel.textContent).not.toContain('El plan guardado no se reemplaza');
    expect(panel.querySelector('.estado')?.textContent).toBe('Pendiente de firma');
    expect(panel.querySelector('.orden-responsables')).toBeNull();
    const opciones = panel.querySelectorAll<HTMLInputElement>('input[type=checkbox]');
    opciones[0].click(); opciones[1].click(); harness.detectChanges();
    expect(panel.querySelectorAll('.opcion-firmante.seleccionado').length).toBe(2);
    expect(panel.querySelector('.opcion-firmante')?.textContent).toContain('Gerencia');
    panel.querySelectorAll<HTMLButtonElement>('[aria-label="Subir firmante"]')[1].click();
    const modalidad = panel.querySelector<HTMLSelectElement>('#modalidad-firma')!;
    modalidad.value = 'SECUENCIAL'; modalidad.dispatchEvent(new Event('change')); harness.detectChanges();
    expect(panel.querySelector('.orden-responsables li')?.textContent).toContain('Antón Talián');
    await new Promise(r=>setTimeout(r,400));
    const vieja=http.expectOne(base+'/31/firma/revision-pdf');
    expect(vieja.request.body).toEqual({modalidad:'SECUENCIAL',firmantes:[{id_persona_trabajador:5,orden_firma:1},{id_persona_trabajador:4,orden_firma:2}]});
    c.alternar(b); expect(vieja.cancelled).toBeTrue();
    await new Promise(r=>setTimeout(r,400));
    const req=http.expectOne(base+'/31/firma/revision-pdf');
    const contenido='%PDF-1.4\n(Nombre de Laravel) (Cargo de Laravel)\n%%EOF';
    const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(contenido));
    const hashPdf=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
    req.flush({success:true,data:{id_certificado_documento:31,id_certificado:12,modalidad:'SECUENCIAL',firmantes:[{...a,orden_firma:1}],persistido:false,token_revision:'temporal',hash_pdf:hashPdf,expires_at:new Date(Date.now()+60000).toISOString(),vista_previa_pdf:{contenido_base64:btoa(contenido),tipo_contenido:'application/pdf'}}});
    await new Promise(r=>setTimeout(r,30)); harness.detectChanges();
    expect(c.previa()).not.toBeNull(); expect(await c.previa().blob.text()).toContain('Nombre de Laravel');
    expect(c.listaParaGuardar()).toBeFalse(); simularRevisionVisible(c); harness.detectChanges(); expect(c.listaParaGuardar()).toBeTrue();
    expect(vista().textContent).toContain('Vista previa'); http.expectNone(base+'/31/firma/asignar');
    c.alternar(a); http.expectOne(base+'/31/firma/revision-pdf').flush({success:true,data:{descartado:true}});
    expect(c.previa()).not.toBeNull(); expect(c.listaParaGuardar()).toBeFalse();
  });


  for (const status of [401,403,404,409]) it('recupera confirmacion fallida '+status, async () => {
    await iniciar(); const c=harness.routeDebugElement!.componentInstance as any;
    c.progreso.set({...progreso,facultades:{...progreso.facultades,asignar:true}});
    c.seleccionando.set(true); c.seleccion.set([{id_persona_trabajador:4,id_persona:6}]);
    c.claveRevision=JSON.stringify(c.plan()); c.revision.set({token_revision:'elegido',hash_pdf:hash,expires_at:new Date(Date.now()+60000).toISOString()});
    simularRevisionVisible(c);
    c.guardar(); http.expectOne(base+'/31/firma/asignar').flush({success:true,data:{...progreso,documento:c.documento(),modalidad:'PARALELA',firmantes_asignados:[{id_persona_trabajador:4,orden_firma:1}],asignacion_documental_persistida:true,persistido:true,completada:true}});
    const confirmar=http.expectOne(base+'/31/firma/confirmar-pdf'); expect(confirmar.request.body).toEqual({token_revision:'elegido',confirmar:true});
    confirmar.flush({message:'Error'},{status,statusText:'Error'});
    http.expectOne(base+'/31/firma/progreso').flush({success:true,data:{...progreso,modalidad:'PARALELA',firmantes_asignados:[{id_persona_trabajador:4,orden_firma:1}],asignacion_documental_persistida:true}});
    expect(c.aviso()).toContain('Revise y reintente'); expect(c.seleccionando()).toBeTrue();
    if (status === 409) {
      expect(c.revision()).toBeNull();
      http.expectOne(r=>r.url===base+'/31/firma/revision-pdf' && r.method==='DELETE').flush({success:true,data:{descartado:true}});
    } else expect(c.revision().token_revision).toBe('elegido');
    expect(c.documento().estado_certificado).toBe('PENDIENTE_FIRMA');
  });
  it('confirma el token elegido y recupera bytes privados exactos antes del exito', async () => {
    await iniciar(); const c=harness.routeDebugElement!.componentInstance as any;
    c.progreso.set({...progreso,facultades:{...progreso.facultades,asignar:true}});
    c.seleccionando.set(true); c.seleccion.set([{id_persona_trabajador:4,id_persona:6}]); c.claveRevision=JSON.stringify(c.plan());
    c.revision.set({token_revision:'elegido',hash_pdf:hash,expires_at:new Date(Date.now()+60000).toISOString()});
    simularRevisionVisible(c);
    const planGuardado={...progreso,documento:c.documento(),modalidad:'PARALELA',firmantes_asignados:[{id_persona_trabajador:4,orden_firma:1}],asignacion_documental_persistida:true};
    c.guardar(); http.expectOne(base+'/31/firma/asignar').flush({success:true,data:{...planGuardado,persistido:true,completada:true,revision_pdf:{token_revision:'ignorar'}}});
    const confirmar=http.expectOne(base+'/31/firma/confirmar-pdf'); expect(confirmar.request.body.token_revision).toBe('elegido');
    const confirmado={...planGuardado,pdf_revisado_disponible:true,disponible_rrhh:true,persistido:true,completada:true,id_certificado_documento:31,id_certificado:12,codigo_verificacion:c.documento().codigo_verificacion,persistencia:'archivo_privado_versionado',revision_pdf:'a'.repeat(64),hash_pdf:hash};
    confirmar.flush({success:true,data:confirmado});
    http.expectOne(base+'/31/firma/firmantes-asignados').flush({success:true,data:confirmado});
    http.expectOne(base+'/31/firma/pdf-autorizado').flush(new Blob(['%PDF-1.4\n%%EOF'],{type:'application/pdf'}));
    for (let i=0;i<100 && c.cargas().has('guardar');i++) await new Promise(r=>setTimeout(r,20));
    expect(c.errores()['guardar']).toBeFalsy();
    http.expectOne(base+'/31/firma/verificacion').flush({success:true,data:{id_certificado_documento:31,hash_pdf:hash,integridad_verificada:true}});
    expect(c.aviso()).toBe('Certificado listo para entrega'); expect(c.seleccionando()).toBeFalse(); expect(c.vigente()).not.toBeNull();
  });

  it('cancela borrador con DELETE y restaura plan persistido', async () => {
    await iniciar(); const c=harness.routeDebugElement!.componentInstance as any;
    c.seleccionando.set(true); c.revision.set({token_revision:'borrador'}); c.cancelar();
    const req=http.expectOne(base+'/31/firma/revision-pdf'); expect(req.request.method).toBe('DELETE'); expect(req.request.body).toEqual({token_revision:'borrador'});
    req.flush({success:true,data:{descartado:true,persistido:false}}); expect(c.revision()).toBeNull(); expect(c.seleccionando()).toBeFalse(); expect(c.seleccion()).toEqual([]);
  });
  it('no guarda una seleccion distinta del PDF revisado ni inventa token al cancelar', async () => {
    await iniciar(); const c=harness.routeDebugElement!.componentInstance as any;
    c.progreso.set({...progreso,facultades:{...progreso.facultades,asignar:true}});
    c.seleccionando.set(true); c.seleccion.set([{id_persona_trabajador:4,id_persona:6}]); c.guardar();
    http.expectNone(r=>r.method==='POST'); c.cancelar(); http.expectNone(r=>r.method==='DELETE'); expect(c.seleccionando()).toBeFalse();
  });
  for (const status of [401, 403, 404, 409, 422]) it('retira el PDF anterior y muestra el error de vista previa HTTP ' + status, async () => {
    await iniciar(); const c = harness.routeDebugElement!.componentInstance as any;
    c.documento.set({ ...documento, facultades: { ...documento.facultades, descargar: true } });
    c.vigente.set({ blob: new Blob(['%PDF-1.4\noriginal\n%%EOF'], { type: 'application/pdf' }), nombre: 'original.pdf' });
    c.seleccionando.set(true); c.seleccion.set([{ id_persona_trabajador: 45, id_persona: 101 }]); c.actualizarPrevia(); harness.detectChanges();
    expect(vista().querySelector('iframe')).toBeNull(); expect(c.previaCargando()).toBeTrue();
    await new Promise(r => setTimeout(r, 200));
    http.expectOne(base + '/31/firma/revision-pdf').flush({ message: 'Motivo devuelto por Laravel' }, { status, statusText: 'Error' }); harness.detectChanges();
    expect(c.errorPrevia()).toBeTruthy(); expect(c.previaCargando()).toBeFalse(); expect(c.listaParaGuardar()).toBeFalse();
    expect(vista().querySelector('iframe')).toBeNull(); expect(vista().querySelector('[role=alert]')).not.toBeNull();
    expect(vista().textContent).not.toContain('Motivo devuelto por Laravel');
    http.expectNone(base + '/31/firma/pdf-autorizado');
  });

});
