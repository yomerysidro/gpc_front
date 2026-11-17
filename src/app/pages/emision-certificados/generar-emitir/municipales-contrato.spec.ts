import { Component, input, output } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { authInterceptor } from '../../../core/interceptors/auth.interceptor';
import { evaluacionOrigenPrueba } from '../../../core/interfaces/emision-certificados/origenes-certificado.fixture';
import { DocumentoOrigenAdministrativo, EvaluacionOrigen } from '../../../core/interfaces/emision-certificados/origenes-certificado.interface';
import { ArchivoPdf } from '../../../core/interfaces/emision-certificados/documento-digital.interface';
import { DocumentosDigitalesService } from '../../../core/services/emision-certificados/documentos-digitales.service';
import { PreparacionOrigenComponent } from './preparacion-origen.component';
import { PrepararMunicipalComponent } from './preparar-municipal.component';
import { MunicipalesIndividualesComponent } from './municipales-individuales.component';
import { MunicipalContextoService } from './municipal-contexto.service';
import { VisorPdfComponent } from '../compartidos/visor-pdf.component';
import { By } from '@angular/platform-browser';

// Los IDs de referencia son escenarios, nunca condiciones del código de producción.
function individual(id = 1): EvaluacionOrigen {
  return { ...evaluacionOrigenPrueba('reconocimiento'), id_origen: id, modalidad_reconocimiento: 'individual',
    mensaje_predeterminado: 'Servicio municipal. Motivo acreditado.', texto_editable: true,
    documento_existente: null, documentos_existentes: [] };
}
function original(id: number, documento: number, origen: 'ponente_actividad' | 'ponente_sesion' | 'reconocimiento' = 'ponente_sesion'): DocumentoOrigenAdministrativo {
  return { id_reconocimiento: id, id_origen: origen === 'reconocimiento' ? id : 80 + id, origen,
    modalidad_reconocimiento: origen === 'reconocimiento' ? 'individual' : origen === 'ponente_sesion' ? 'sesion' : 'actividad',
    id_certificado: 100 + documento, id_certificado_documento: documento, id_actividad: origen === 'reconocimiento' ? null : 4,
    id_sesion: origen === 'ponente_sesion' ? 8 : null, id_actividad_ponente: origen === 'reconocimiento' ? null : 80 + id,
    beneficiario: { id_persona: 31, nombre: 'Ana Municipal' }, estado_certificado: origen === 'ponente_actividad' ? 'PREPARADO' : 'PENDIENTE_FIRMA',
    estado_documento: 'Vigente', url_documento: `/api/certificados-documentos/${documento}/archivo?flujo=firmas`,
    puede_visualizar: true, puede_descargar: true, facultades: { ver: true, visualizar: true, descargar: true } };
}
function otraModalidad(id: number, documento: number, origen: 'ponente_sesion' | 'ponente_actividad'): EvaluacionOrigen {
  const o = original(id, documento, origen);
  return { ...individual(id), modalidad_reconocimiento: o.modalidad_reconocimiento, puede_preparar: false, puede_generar_pdf: false,
    texto_editable: false, documento_existente: o, documentos_existentes: [o], puede_consultar_documento_original: true,
    motivos_bloqueo: ['El origen original es ' + origen] };
}

@Component({ selector: 'app-visor-pdf', standalone: true, template: '' })
class VisorContrato {
  readonly documentoId = input<number | null>(); readonly urlAdministrativa = input<string | null>();
  readonly archivoPrevio = input<ArchivoPdf | null>(); readonly hashEsperado = input<string>();
  readonly permitirDescarga = input(true); readonly persistido = input(false); readonly integrado = input(false);
  readonly ajustarAncho = input(false); readonly controlesZoom = input(false); readonly mostrarDescripcion = input(true);
  readonly flujoFirmas = input(false); readonly archivoVisualizado = output<ArchivoPdf>(); readonly errorVisualizacion = output<string>();
}

describe('Contrato municipal actualizado: HTTP y asistente compartido', () => {
  let http: HttpTestingController;
  let auth: any;
  beforeEach(() => {
    auth = { tienePermiso: () => true, authorizeRequest: (r: unknown) => r, limpiarSesion: jasmine.createSpy('limpiarSesion'), logout: jasmine.createSpy('logout') };
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting(),
      { provide: AuthService, useValue: auth },
      { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ reconocimientoId: '1' }), data: {} } } },
    ] }).overrideComponent(PreparacionOrigenComponent, { remove: { imports: [VisorPdfComponent] }, add: { imports: [VisorContrato] } })
      .overrideComponent(PrepararMunicipalComponent, { remove: { imports: [VisorPdfComponent] }, add: { imports: [VisorContrato] } });
    spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  function asistente(e = individual()) {
    const f = TestBed.createComponent(PreparacionOrigenComponent);
    f.componentRef.setInput('origen', 'reconocimiento'); f.componentRef.setInput('municipal', e);
    f.componentRef.setInput('asistente', true); f.componentRef.setInput('consultaExterna', true);
    f.detectChanges(); f.detectChanges(); return { f, c: f.componentInstance as any };
  }
  function pulsar(f: ReturnType<typeof asistente>['f'], texto: string): void {
    const boton = Array.from(f.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .find(b => b.textContent?.trim() === texto)!;
    expect(boton).withContext(texto).toBeTruthy(); expect(boton.disabled).withContext(texto).toBeFalse();
    boton.click(); f.detectChanges();
  }
  function escribir(f: ReturnType<typeof asistente>['f'], texto: string): HTMLTextAreaElement {
    const campo = f.nativeElement.querySelector('#mensaje-municipal') as HTMLTextAreaElement;
    expect(campo.disabled).toBeFalse(); expect(campo.readOnly).toBeFalse();
    campo.value = texto; campo.dispatchEvent(new Event('input', { bubbles: true })); f.detectChanges();
    return campo;
  }
  it('edita mediante eventos Angular mientras llega la consulta ligera, sin bloquear ni sobrescribir el borrador', () => {
    const e = individual(); delete e.mensaje_predeterminado; delete e.texto_editable;
    const { f, c } = asistente(e);
    const lectura = http.expectOne('/api/certificaciones/reconocimiento/1/preparar?accion=consultar_preparacion');
    expect(lectura.request.method).toBe('GET');
    pulsar(f, 'Siguiente'); expect(c.pasoReconocimiento()).toBe(2);
    expect(Array.from(f.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>).map(b => b.textContent?.trim())).toEqual(['Anterior', 'Siguiente']);
    expect(f.nativeElement.textContent).not.toMatch(/Procesando documento|Revisar nuevamente|no admite su edición|edición.*no.*disponible/i);
    escribir(f, 'Borrador escrito antes de la respuesta');
    expect(c.mensajeCertificado.dirty).toBeTrue();
    lectura.flush({ success: true, data: { ...individual(), persistido: false, recuperado: false, id_certificado_documento: null } });
    f.detectChanges(); expect(c.mensajeCertificado.value).toBe('Borrador escrito antes de la respuesta');
    expect(c.mensajeCertificado.disabled).toBeFalse(); expect(c.documento()).toBeNull();
    pulsar(f, 'Anterior'); pulsar(f, 'Siguiente');
    expect((f.nativeElement.querySelector('textarea') as HTMLTextAreaElement).value).toBe('Borrador escrito antes de la respuesta');
    http.expectNone(r => r.method === 'POST' || r.url.includes('preparar'));
    pulsar(f, 'Siguiente'); expect(c.pasoReconocimiento()).toBe(3);
    const revision = http.expectOne('/api/certificaciones/reconocimiento/1/preparar');
    expect(revision.request.body).toEqual({ accion: 'revisar_documento', mensaje: 'Borrador escrito antes de la respuesta' });
    revision.flush({ message: 'Prueba de payload' }, { status: 409, statusText: 'Conflict' });
  });
  it('obtiene el predeterminado con GET sin generar PDF y habilita edición al completar la lectura', () => {
    const e = individual(); delete e.mensaje_predeterminado; delete e.texto_editable;
    const { f, c } = asistente(e); pulsar(f, 'Siguiente');
    http.expectOne('/api/certificaciones/reconocimiento/1/preparar?accion=consultar_preparacion')
      .flush({ success: true, data: { ...individual(), persistido: false, recuperado: false } });
    f.detectChanges();
    expect((f.nativeElement.querySelector('textarea') as HTMLTextAreaElement).value).toBe(individual().mensaje_predeterminado!);
    escribir(f, 'Personalizado mediante input'); expect(c.mensajeCertificado.value).toBe('Personalizado mediante input');
    http.expectNone(() => true);
  });
  it('respeta una denegación explícita de edición sin sustituirla por el estado de carga', () => {
    const e = individual(); e.texto_editable = false; e.puede_preparar = false;
    const { f } = asistente(e); pulsar(f, 'Siguiente');
    const campo = f.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    expect(campo.readOnly).toBeTrue();
    const siguiente = Array.from(f.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>).find(b => b.textContent?.trim() === 'Siguiente')!;
    expect(siguiente.disabled).toBeTrue(); http.expectNone(() => true);
  });
  function listado(e: EvaluacionOrigen) {
    const f = TestBed.createComponent(MunicipalesIndividualesComponent);
    http.expectOne(r => r.url === '/api/reconocimientos/list').flush({ success: true, data: {
      data: [{ id_reconocimiento: e.id_origen, titulo: 'Origen real', estado: e.id_origen === 28 ? 'PREPARADO' : 'ca' }],
      current_page: 1, last_page: 1, per_page: 100, total: 1,
    } });
    http.expectOne(`/api/reconocimientos/${e.id_origen}/evaluacion-certificacion`).flush({ success: true, data: e });
    f.detectChanges(); return f;
  }
  for (const id of [1, 28]) it('ofrece preparar el individual elegible ' + id + ' sin descargar PDF', () => {
    const f = listado(individual(id));
    expect(f.nativeElement.querySelector('td button').textContent).toBe('Preparar certificado');
    f.nativeElement.querySelector('td button').click();
    expect(TestBed.inject(Router).navigate).toHaveBeenCalledWith(['/certificaciones/generar-emitir/reconocimientos/individual', id]);
    http.expectNone(r => /preparar|archivo|certificados-documentos/.test(r.url));
  });
  it('mapea el 28 desde data, conserva DESTACADO. E y permite borrar y reemplazar por interacción Angular', () => {
    const e = { ...individual(28), texto_editable: true, mensaje_predeterminado: 'DESTACADO. E' };
    const tabla = listado(e); tabla.nativeElement.querySelector('td button').click();
    (TestBed.inject(ActivatedRoute).snapshot as any).paramMap = convertToParamMap({ reconocimientoId: '28' });
    const pagina = TestBed.createComponent(PrepararMunicipalComponent); pagina.detectChanges(); pagina.detectChanges();
    const siguiente = () => Array.from(pagina.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .find(b => b.textContent?.trim() === 'Siguiente')!;
    siguiente().click(); pagina.detectChanges();
    const campo = pagina.nativeElement.querySelector('#mensaje-municipal') as HTMLTextAreaElement;
    expect(campo.value).toBe('DESTACADO. E'); expect(campo.disabled).toBeFalse(); expect(campo.readOnly).toBeFalse();
    expect(pagina.nativeElement.textContent).not.toMatch(/Procesando documento|Revisar nuevamente|Texto institucional proporcionado|no admite su edición/);
    const escribir = (texto: string) => { campo.value = texto; campo.dispatchEvent(new Event('input', { bubbles: true })); pagina.detectChanges(); };
    escribir(''); expect(siguiente().disabled).toBeTrue(); expect(campo.readOnly).toBeFalse();
    escribir('a'.repeat(1200)); expect(siguiente().disabled).toBeFalse();
    escribir('a'.repeat(1201)); expect(siguiente().disabled).toBeTrue();
    escribir('Texto personalizado del reconocimiento');
    http.expectNone(r => r.url.includes('preparar'));
    siguiente().click(); pagina.detectChanges();
    const revisar = http.expectOne('/api/certificaciones/reconocimiento/28/preparar');
    expect(revisar.request.body).toEqual({ accion: 'revisar_documento', mensaje: 'Texto personalizado del reconocimiento' });
    revisar.flush({ message: 'Comprobación del payload concluida' }, { status: 409, statusText: 'Conflict' });
  });
  for (const [id, documento, origen] of [[2, 10, 'ponente_actividad'], [24, 22, 'ponente_sesion'], [27, 26, 'ponente_sesion']] as const) {
    it('abre certificado original ' + documento + ' del reconocimiento ' + id + ' sin preparar', () => {
      const e = otraModalidad(id, documento, origen); const f = listado(e);
      expect(f.nativeElement.querySelector('td button').textContent).toBe('Ver certificado');
      f.nativeElement.querySelector('td button').click();
      expect(TestBed.inject(Router).navigate).toHaveBeenCalledWith(['/certificaciones/generar-emitir/reconocimientos/documento-original', id]);
      // Consumir el mismo contexto sin nueva lista ni evaluación.
      (TestBed.inject(ActivatedRoute).snapshot as any).paramMap = convertToParamMap({ reconocimientoId: String(id) });
      const pagina = TestBed.createComponent(PrepararMunicipalComponent); const o = e.documento_existente!;
      http.expectOne(`/api/certificados-documentos/detail/${documento}?flujo=firmas`).flush({ success: true, data: { ...o, hash_pdf: 'b'.repeat(64) } });
      pagina.detectChanges();
      expect(pagina.nativeElement.querySelector('.pasos-reconocimiento')).toBeNull();
      expect(pagina.nativeElement.textContent).toContain('Ana Municipal');
      expect(pagina.debugElement.query(By.directive(VisorContrato)).componentInstance.urlAdministrativa()).toBe(o.url_documento);
      http.expectNone(r => r.method === 'POST');
    });
    it('usa facultades anidadas para ' + id + ' y facultades de raíz al abrir el documento ' + documento, () => {
      const e = otraModalidad(id, documento, origen); const o = e.documento_existente!;
      delete o.puede_visualizar; delete o.puede_descargar; delete o.facultades.visualizar;
      // El origen superior es reconocimiento y puede_preparar es false: ninguno identifica el PDF original.
      const tabla = listado(e);
      expect(e.origen).toBe('reconocimiento'); expect(e.puede_preparar).toBeFalse();
      expect(tabla.nativeElement.querySelector('td button').textContent).toBe('Ver certificado');
      tabla.nativeElement.querySelector('td button').click();
      (TestBed.inject(ActivatedRoute).snapshot as any).paramMap = convertToParamMap({ reconocimientoId: String(id) });
      const pagina = TestBed.createComponent(PrepararMunicipalComponent);
      http.expectOne(`/api/certificados-documentos/detail/${documento}?flujo=firmas`).flush({ success: true,
        data: { ...o, facultades: { ver: true, descargar: false, remitir: false }, hash_pdf: 'b'.repeat(64) } });
      pagina.detectChanges();
      const visor = pagina.debugElement.query(By.directive(VisorContrato)).componentInstance;
      expect(visor.documentoId()).toBe(documento); expect(visor.urlAdministrativa()).toBe(o.url_documento);
      expect(visor.permitirDescarga()).toBeFalse();
      expect(pagina.nativeElement.querySelector('app-preparacion-origen')).toBeNull();
      expect(pagina.nativeElement.textContent).toContain(o.beneficiario.nombre);
      http.expectNone(r => r.method === 'POST');
    });
  }
  it('carga predeterminado, mantiene borrador y aplica límite Unicode de 1200 sin HTTP al escribir', () => {
    const { f, c } = asistente(); expect(f.nativeElement.textContent).not.toContain(individual().mensaje_predeterminado);
    c.siguienteReconocimiento(); f.detectChanges();
    expect(c.mensajeCertificado.value).toBe(individual().mensaje_predeterminado);
    c.mensajeCertificado.setValue('😀'.repeat(1200)); expect(c.mensajeCertificado.valid).toBeTrue();
    c.anteriorReconocimiento(); c.siguienteReconocimiento(); expect(c.mensajeCertificado.value).toBe('😀'.repeat(1200));
    c.mensajeCertificado.setValue('a'.repeat(1201)); expect(c.puedeAvanzar()).toBeFalse();
    http.expectNone(() => true);
  });
  it('envía el predeterminado de Laravel cuando el usuario no modifica el texto', () => {
    const { c } = asistente(); c.siguienteReconocimiento(); c.siguienteReconocimiento();
    const r = http.expectOne('/api/certificaciones/reconocimiento/1/preparar');
    expect(r.request.body).toEqual({ accion: 'revisar_documento', mensaje: individual().mensaje_predeterminado });
    r.flush({ message: 'Prueba de payload' }, { status: 409, statusText: 'Conflict' });
  });
  it('recupera PREPARADO por consulta ligera, inicia en Datos y no prepara otra vez', () => {
    const e = individual(); const o = original(1, 211, 'reconocimiento'); o.estado_certificado = 'PREPARADO';
    e.documento_existente = o; e.documentos_existentes = [o]; e.texto_editable = false; e.puede_preparar = false;
    e.puede_consultar_certificado_existente = true;
    e.certificados_existentes = [{ id_certificado: o.id_certificado, id_certificado_documento: 211, id_persona: 31,
      id_tipo_certificado: 47, id_reconocimiento: 1, id_practica: null, estado: 'PREPARADO' }];
    TestBed.inject(MunicipalContextoService).seleccionado = { evaluacion: e, documento: null };
    const f = TestBed.createComponent(PrepararMunicipalComponent); f.detectChanges();
    const guardado = 'Mensaje aprobado inmutable';
    const r = http.expectOne('/api/certificaciones/reconocimiento/1/preparar?accion=consultar_preparacion');
    expect(r.request.method).toBe('GET');
    r.flush({ success: true, data: { ...o, id_tipo_certificado: 47, mensaje_aprobado: guardado,
      hash_pdf: 'e'.repeat(64), texto_editable: false, recuperado: true, persistido: true } });
    f.detectChanges(); f.detectChanges();
    const c = f.debugElement.query(By.directive(PreparacionOrigenComponent)).componentInstance as any;
    expect(c.pasoReconocimiento()).toBe(1); c.siguienteReconocimiento(); f.detectChanges();
    expect(c.mensajeCertificado.value).toBe(guardado); expect(c.mensajeCertificado.disabled).toBeTrue();
    c.siguienteReconocimiento(); f.detectChanges();
    const visor = f.debugElement.query(By.directive(VisorContrato)).componentInstance;
    expect(visor.documentoId()).toBe(211); expect(visor.urlAdministrativa()).toBe(o.url_documento);
    c.siguienteReconocimiento(); expect(c.pasoReconocimiento()).toBe(4);
    expect(c.documento().hash_pdf).toBe('e'.repeat(64)); http.expectNone(r => r.method === 'POST');
  });
  it('descarga los bytes originales por la URL administrativa autorizada, sin generación', async () => {
    const docs = TestBed.inject(DocumentosDigitalesService);
    const pdf = '%PDF-1.4\nOriginal institucional\n%%EOF';
    const recibido = new Promise<ArchivoPdf>((resolve, reject) => docs.archivoAdministrativo('/api/certificados-documentos/22/archivo?flujo=firmas', 22).subscribe({ next: resolve, error: reject }));
    const r = http.expectOne('/api/certificados-documentos/22/archivo?flujo=firmas');
    expect(r.request.withCredentials).toBeTrue();
    r.flush(new Blob([pdf], { type: 'application/pdf' }), { headers: { 'Content-Type': 'application/pdf' } });
    expect(await (await recibido).blob.text()).toBe(pdf); http.expectNone(r => r.method === 'POST');
  });
  it('valida PDF, confirma el mensaje una vez y envía solo al pulsar el paso cuatro', async () => {
    const { f, c } = asistente(); const docs = TestBed.inject(DocumentosDigitalesService);
    const revisar = docs.revisarOrigen.bind(docs);
    let terminada!: () => void; const revisionLista = new Promise<void>(r => terminada = r);
    spyOn(docs, 'revisarOrigen').and.callFake((...args) => revisar(...args).pipe(tap(() => terminada())));
    pulsar(f, 'Siguiente'); escribir(f, 'Mensaje municipal personalizado.'); pulsar(f, 'Siguiente');
    expect(c.pasoReconocimiento()).toBe(3); expect(c.operando()).toBeTrue();
    const bytes = new TextEncoder().encode('%PDF-1.4\nBeneficiario seleccionado, QR y codigo\n%%EOF');
    const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), b => b.toString(16).padStart(2, '0')).join('');
    const req = http.expectOne('/api/certificaciones/reconocimiento/1/preparar');
    expect(req.request.body).toEqual({ accion: 'revisar_documento', mensaje: 'Mensaje municipal personalizado.' });
    req.flush({ success: true, data: { origen: 'reconocimiento', id_origen: 1, modo: 'administrativo', persistido: false,
      mensaje: c.mensajeCertificado.value, hash_pdf: hash, token_revision: 'a'.repeat(64), expires_at: new Date(Date.now() + 1800000).toISOString(),
      vista_previa_pdf: { contenido_base64: btoa(String.fromCharCode(...bytes)), tipo_contenido: 'application/pdf' } } });
    await revisionLista; f.detectChanges();
    expect(c.pasoReconocimiento()).toBe(3); expect(await c.revision().archivo.blob.text()).toContain('Beneficiario seleccionado');
    const anterior = c.revision();
    pulsar(f, 'Anterior');
    const editor = f.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    expect(editor.disabled).toBeFalse(); expect(editor.readOnly).toBeFalse();
    expect(editor.value).toBe('Mensaje municipal personalizado.');
    expect(f.nativeElement.textContent).not.toContain('Procesando documento');
    pulsar(f, 'Siguiente');
    expect(c.revision()).toBe(anterior); expect(docs.revisarOrigen).toHaveBeenCalledTimes(1);
    http.expectNone(r => r.method === 'POST');
    f.debugElement.query(By.directive(VisorContrato)).componentInstance.archivoVisualizado.emit(c.revision().archivo);
    f.detectChanges(); pulsar(f, 'Confirmar preparación'); c.guardar();
    const guardar = http.expectOne('/api/certificaciones/reconocimiento/1/preparar');
    expect(guardar.request.body).toEqual({ accion: 'confirmar_preparacion', mensaje: c.mensajeCertificado.value, token_revision: 'a'.repeat(64), confirmar: true });
    guardar.flush({ success: true, data: { preparacion_persistida: true, id_certificado: 111, id_certificado_documento: 211 } });
    const documento = { origen: 'reconocimiento', id_reconocimiento: 1, id_certificado: 111, id_certificado_documento: 211,
      beneficiario: { id_persona: 31, nombre: 'Ana Municipal' }, id_tipo_certificado: 47, id_sesion: null, mensaje_aprobado: c.mensajeCertificado.value,
      hash_pdf: hash, estado_certificado: 'PREPARADO', facultades: { remitir: true, descargar: true } };
    http.expectOne('/api/certificados-documentos/detail/211?flujo=firmas').flush({ success: true, data: documento });
    f.detectChanges(); expect(c.pasoReconocimiento()).toBe(4);
    http.expectNone(r => /enviar-gerencia|revisar-envio/.test(r.url));
    c.enviarSesion(); c.enviarSesion();
    http.expectOne('/api/certificados-documentos/211/revisar-envio').flush({ success: true, data: {
      documento, token_revision: 'c'.repeat(64), expires_at: new Date(Date.now() + 1800000).toISOString(),
      vista_previa_pdf: { contenido_base64: btoa(String.fromCharCode(...bytes)), tipo_contenido: 'application/pdf', persistido: true },
    } });
    // La revisión de remisión también valida SHA-256 asíncronamente.
    const enviada = new Promise<void>(resolve => {
      const confirmar = docs.confirmarEnvio.bind(docs);
      spyOn(docs, 'confirmarEnvio').and.callFake((...args) => { const o = confirmar(...args); resolve(); return o; });
    });
    await enviada;
    const envio = http.expectOne('/api/certificados-documentos/211/enviar-gerencia');
    expect(envio.request.body).toEqual({ token_revision: 'c'.repeat(64), confirmar: true });
    expect(c.documento().estado_certificado).toBe('PREPARADO');
    envio.flush({ success: true, data: { enviado: true, estado_flujo: 'PENDIENTE_FIRMA' } });
    http.expectOne('/api/certificados-documentos/detail/211?flujo=firmas').flush({ success: true, data: { ...documento, estado_certificado: 'PENDIENTE_FIRMA' } });
    c.enviarSesion(); expect(c.documento().estado_certificado).toBe('PENDIENTE_FIRMA'); http.expectNone(r => r.method === 'POST');
  });
  for (const status of [401, 403, 404, 409, 422, 500, 502]) it('conserva borrador y no reintenta ni cierra sesiones remotas ante HTTP ' + status, () => {
    const { f, c } = asistente(); c.siguienteReconocimiento(); c.mensajeCertificado.setValue('Borrador conservado'); c.siguienteReconocimiento();
    http.expectOne('/api/certificaciones/reconocimiento/1/preparar').flush({ message: 'Error de prueba' }, { status, statusText: 'Error' });
    f.detectChanges(); expect(c.mensajeCertificado.value).toBe('Borrador conservado'); expect(c.documento()).toBeNull();
    expect(c.operando()).toBeFalse(); expect(c.error()).toBeTruthy(); expect(auth.logout).not.toHaveBeenCalled();
    http.expectNone(r => /logout|revoke|sesiones/.test(r.url) || r.method === 'POST');
  });
  it('bloquea enlace a PDF sin facultad y conserva la causa en detalles', () => {
    const e = otraModalidad(24, 22, 'ponente_sesion'); e.documento_existente!.puede_visualizar = false;
    e.motivo_documento = 'Sin permiso administrativo'; const f = listado(e);
    expect(f.nativeElement.querySelector('td button').disabled).toBeTrue(); expect(f.nativeElement.textContent).toContain('Sin acceso al PDF');
    http.expectNone(r => /archivo|detail/.test(r.url));
  });
  it('no permite preparar ni visualizar un documento anulado', () => {
    const e = otraModalidad(27, 26, 'ponente_sesion'); e.documento_existente!.estado_documento = 'Anulado'; const f = listado(e);
    expect(f.nativeElement.querySelector('td button').textContent).toBe('Anulado'); expect(f.nativeElement.querySelector('td button').disabled).toBeTrue();
  });
});
