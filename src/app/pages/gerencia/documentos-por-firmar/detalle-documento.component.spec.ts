import { Component, input, output } from '@angular/core';
import { ArchivoPdf } from '../../../core/interfaces/emision-certificados/documento-digital.interface';
import { VisorPdfComponent } from '../../emision-certificados/compartidos/visor-pdf.component';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { AUTHENTICATED_REQUEST } from '../../../core/security/auth-request.context';
import { DocumentoFirmas } from '../../../core/services/emision-certificados/documentos-digitales.service';
import { DetalleDocumentoComponent } from './detalle-documento.component';
import { DocumentosPorFirmarComponent } from './documentos-por-firmar.component';
import { FIRMANTES_PDF_PRUEBA, pdfPrueba } from '../../emision-certificados/compartidos/pdf-prueba.fixture';

// Estas pruebas verifican HTTP y selección; PDF.js se prueba con PDFs válidos en su propia suite.
@Component({ selector: 'app-pdf-continuo', standalone: true, template: '<div class="lectura"></div>' })
class PdfContinuoSimuladoComponent {
  readonly textosEsperados = input<readonly string[]>([]);
  readonly archivo = input<ArchivoPdf | null>(null);
  readonly zoom = input(100);
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
      set: { imports: [PdfContinuoSimuladoComponent] },
    });
    http = TestBed.inject(HttpTestingController);
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
  async function prepararGuardado() {
    const codigo = 'abc123';
    await iniciar({ ...documento, codigo_verificacion: codigo, hash_pdf: 'b'.repeat(64), facultades: { ...documento.facultades, descargar: true } });
    const c = harness.routeDebugElement!.componentInstance as any;
    const funcionario = { ...FIRMANTES_PDF_PRUEBA[0], id_persona_trabajador: 45, orden_firma: 1 };
    const archivo = pdfPrueba([funcionario]);
    const digest = await crypto.subtle.digest('SHA-256', await archivo.blob.arrayBuffer());
    const hashPdf = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
    const guardado = { ...progreso, documento: c.documento(), modalidad: 'PARALELA', facultades: { ...progreso.facultades, asignar: true },
      asignacion_documental_persistida: true, firmantes_asignados: [funcionario], pdf_revisado_disponible: false };
    const confirmado = { ...guardado, documento: { ...c.documento(), hash_pdf_original: 'a'.repeat(64), hash_pdf: hashPdf },
      completada: true, persistido: true, persistencia: 'archivo_privado_versionado', revision_pdf: 'c'.repeat(64),
      id_certificado_documento: 31, id_certificado: 12, codigo_verificacion: codigo, pdf_revisado_disponible: true };
    c.progreso.set({ ...guardado, asignacion_documental_persistida: false, firmantes_asignados: [] });
    c.seleccionando.set(true); c.seleccion.set([funcionario]); c.claveRevision = JSON.stringify(c.plan());
    c.revision.set({ token_revision: 'd'.repeat(64), hash_pdf: hashPdf, expires_at: new Date(Date.now() + 60000).toISOString() });
    c.previa.set(archivo); c.pdfVisualizado(archivo); harness.detectChanges();
    return { c, guardado, confirmado, archivo };
  }
  async function finalizarGuardado(c: any, hashPdf: string) {
    for (let i = 0; i < 150 && c.cargas().has('guardar'); i++) await new Promise(r => setTimeout(r, 20));
    expect(c.errores()['guardar']).toBeFalsy();
    http.expectOne(base + '/31/firma/verificacion').flush({ success: true, data: { id_certificado_documento: 31, hash_pdf: hashPdf, integridad_verificada: true } });
    harness.detectChanges();
    expect(c.seleccionando()).toBeFalse(); expect(c.aviso()).toBe('Certificado preparado correctamente');
    expect(c.documento().estado_certificado).toBe('PENDIENTE_FIRMA');
    expect(vista().textContent).toContain('Documento preparado. Firmas digitales pendientes');
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
    expect(boton('Firmar digitalmente').disabled).toBeTrue(); expect(boton('Emitir certificado').disabled).toBeTrue();
    for (const texto of ['Firmar digitalmente', 'Emitir certificado']) {
      const accion = boton(texto);
      expect(accion.closest('.panel-firmas')).not.toBeNull();
      expect(accion.closest('details')).toBeNull();
      expect(accion.getAttribute('aria-describedby')).toBeTruthy();
      expect(accion.title).toBeTruthy();
      accion.click();
    }
    expect(boton('Firmar digitalmente').classList.contains('accion-firmar')).toBeTrue();
    expect(boton('Emitir certificado').classList.contains('accion-emitir')).toBeTrue();
    expect(vista().querySelector('.panel-firmas')?.textContent).toContain('Firmas del certificado');
    expect(vista().querySelector('.panel-firmas')?.textContent).not.toContain('Consultar');
    expect(vista().querySelector('.titulo-detalle .estado')?.textContent).toBe('Pendiente de firma');
    expect(vista().querySelector<HTMLAnchorElement>('[aria-label="Volver a documentos por firmar"]')!.getAttribute('href')).toContain('page=3');
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
    expect(vista().querySelectorAll('.panel-firmas button').length).toBe(3);
    http.expectNone(r => r.url.includes('/demo/') || r.method === 'POST');
  });
  it('mantiene los bloqueos ante integridad inválida y no ejecuta acciones oficiales ni DEMO', async () => {
    await iniciar();
    (harness.routeDebugElement!.componentInstance as unknown as { verificarIntegridad: () => void }).verificarIntegridad();
    http.expectOne(base + '/31/firma/verificacion').flush({ success: true, data: { id_certificado_documento: 31, hash_pdf: hash, integridad_verificada: false } }); harness.detectChanges();
    expect(vista().textContent).toContain('No se pudo verificar el documento.');
    pulsar('Firmar digitalmente'); pulsar('Emitir certificado');
    expect(boton('Firmar digitalmente').disabled).toBeTrue(); expect(boton('Emitir certificado').disabled).toBeTrue();
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
    const iframe = vista().querySelector<HTMLElement>('app-pdf-continuo')!;
    expect(iframe).not.toBeNull(); expect(vista().querySelector('a[download]')).not.toBeNull();
    expect(vista().textContent).not.toContain('El PDF almacenado contiene el QR');
    const zoom = vista().querySelector<HTMLSelectElement>('[aria-label="Zoom del PDF"]')!;
    zoom.value = '150'; zoom.dispatchEvent(new Event('change')); harness.detectChanges();
    expect(iframe).toBe(vista().querySelector<HTMLElement>('app-pdf-continuo')!);
    expect(zoom.value).toBe('150');
    pulsar('Imprimir PDF');
    (harness.routeDebugElement!.componentInstance as unknown as { actualizarProgreso: () => void }).actualizarProgreso();
    http.expectOne(base + '/31/firma/progreso').flush({ success: true, data: { ...progreso, documento: { ...documento, facultades: { ...documento.facultades, descargar: true } } } }); harness.detectChanges();
    expect(vista().querySelector('app-pdf-continuo')).toBe(iframe); http.expectNone(r => r.url.includes('/archivo'));
    const revocar = spyOn(URL, 'revokeObjectURL').and.callThrough();
    harness.fixture.destroy(); expect(revocar).toHaveBeenCalled();
  });
  it('presenta resultados individuales de lote y errores sin firmar ni emitir', async () => {
    harness = await RouterTestingHarness.create('/pendientes/documentos-firmar');
    http.expectOne(r => r.url === base + '/list').flush({ success: true, data: { data: [documento, { ...documento, id_certificado_documento: 32 }], current_page: 1, last_page: 1 } }); harness.detectChanges();
    vista().querySelectorAll<HTMLInputElement>('tbody input').forEach(c => { c.checked = true; c.dispatchEvent(new Event('change')); }); harness.detectChanges();
    pulsar('Consultar progreso seleccionado');
    const req = http.expectOne(base + '/firmas/lote/progreso'); expect(req.request.body).toEqual({ ids_documentos: [31, 32] });
    req.flush({ success: true, data: { lote_persistido: false, resultados: [{ id_certificado_documento: 31, status: 200, success: true, data: progreso }, { id_certificado_documento: 32, status: 404, success: false, message: 'Fuera de ámbito' }] } }); harness.detectChanges();
    expect(vista().querySelectorAll('article').length).toBe(2); expect(vista().textContent).toContain('HTTP 404');
    http.expectNone(r => r.method === 'POST');
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
    const a={id_persona_trabajador:4,id_persona:6}, b={id_persona_trabajador:5,id_persona:7};
    c.alternar(a); c.alternar(b); c.mover(1,-1); c.cambiarModalidad('SECUENCIAL');
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
    const confirmado={...planGuardado,pdf_revisado_disponible:true,persistido:true,completada:true,id_certificado_documento:31,id_certificado:12,codigo_verificacion:c.documento().codigo_verificacion,persistencia:'archivo_privado_versionado',revision_pdf:'a'.repeat(64)};
    confirmar.flush({success:true,data:confirmado});
    http.expectOne(base+'/31/firma/firmantes-asignados').flush({success:true,data:confirmado});
    http.expectOne(base+'/31/firma/pdf-autorizado').flush(new Blob(['%PDF-1.4\n%%EOF'],{type:'application/pdf'}));
    for (let i=0;i<100 && c.cargas().has('guardar');i++) await new Promise(r=>setTimeout(r,20));
    expect(c.errores()['guardar']).toBeFalsy();
    http.expectOne(base+'/31/firma/verificacion').flush({success:true,data:{id_certificado_documento:31,hash_pdf:hash,integridad_verificada:true}});
    expect(c.aviso()).toBe('Certificado preparado correctamente'); expect(c.seleccionando()).toBeFalse(); expect(c.vigente()).not.toBeNull();
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
    if (status === 409 || status === 422) expect(vista().textContent).toContain('Motivo devuelto por Laravel');
    http.expectNone(base + '/31/firma/pdf-autorizado');
  });

});
