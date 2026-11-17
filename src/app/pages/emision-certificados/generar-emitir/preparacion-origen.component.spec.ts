import { evaluacionOrigenPrueba, ponenteActividadPrueba, ponenteSesionPrueba } from '../../../core/interfaces/emision-certificados/origenes-certificado.fixture';
import { Component, input, output } from '@angular/core';
import { ArchivoPdf } from '../../../core/interfaces/emision-certificados/documento-digital.interface';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { EMPTY, Subject, of, throwError } from 'rxjs';
import { PreparacionOrigenComponent } from './preparacion-origen.component';
import { VisorPdfComponent } from '../compartidos/visor-pdf.component';
import { EmisionCertificadosService } from '../../../core/services/emision-certificados/emision-certificados.service';
import { DocumentosDigitalesService } from '../../../core/services/emision-certificados/documentos-digitales.service';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { OrigenDocumental } from '../../../core/interfaces/emision-certificados/origenes-certificado.interface';

@Component({ selector: 'app-visor-pdf', standalone: true, template: '' })
class VisorPrueba {
  readonly permitirDescarga = input(true);
  readonly urlAdministrativa = input<string | null>(null);
  readonly archivoVisualizado = output<ArchivoPdf>(); readonly errorVisualizacion = output<string>();
  readonly archivoPrevio = input<unknown>(); readonly compacto = input(false); readonly documentoId = input<number>();
  readonly hashEsperado = input<string>(); readonly flujoFirmas = input(false);
  readonly integrado = input(false); readonly ajustarAncho = input(false); readonly controlesZoom = input(false); readonly persistido = input(false);
  readonly mostrarDescripcion = input(true);
}
describe('Preparación integrada por origen real', () => {
  let fixture: ComponentFixture<PreparacionOrigenComponent>; let c: any;
  let api: jasmine.SpyObj<EmisionCertificadosService>; let docs: jasmine.SpyObj<DocumentosDigitalesService>;
  const revision = { token: 'a'.repeat(64), hash: 'b'.repeat(64), expiresAt: '2026-12-01T00:00:00Z', mensaje: 'Texto del origen',
    archivo: { blob: new Blob(['%PDF-1.4\n%%EOF'], { type: 'application/pdf' }), nombre: 'certificado.pdf' } };
  const doc = { id_certificado: 151, id_certificado_documento: 201, hash_pdf: revision.hash, codigo_verificacion: 'c'.repeat(30),
    origen: 'reconocimiento', beneficiario: { id_persona: 31, nombre: 'Ana Municipal' }, id_tipo_certificado: 47,
    id_sesion: null, actividad: null, sesion: null, tipo_certificado: 'Reconocimiento', estado_certificado: 'PREPARADO',
    firmantes: [], facultades: { remitir: true, descargar: true } };
  beforeEach(() => {
    api = jasmine.createSpyObj('api', ['listarTodos', 'registrosPracticas', 'catalogosOrigenes', 'evaluarOrigen', 'ponentesActividad', 'obtener']);
    api.listarTodos.and.returnValue(of([{ id_reconocimiento: 71, titulo: 'Servicio municipal', estado: 'ca' }]) as never);
    api.registrosPracticas.and.returnValue(of([{ id_practica: 71, carrera: 'Administración', fecha_inicio: '2026-01-01', fecha_fin: '2026-06-30', estado: 'activo' }]));
    api.catalogosOrigenes.and.returnValue(of({ tipos_actividad: [{ id_tipo_actividad: 9, nombre: 'Capacitación', estado: true }],
      tipos_certificado: [{ id_tipo_certificado: 47, nombre_tipo: 'Reconocimiento', estado: true }, { id_tipo_certificado: 93, nombre_tipo: 'Prácticas', estado: true }], relacion_tipo_actividad_certificado: null, motivo_relacion: 'Independientes' }));
    docs = jasmine.createSpyObj('docs', ['revisarOrigen', 'guardarOrigen', 'recuperarReconocimientoActividad', 'recuperarReconocimientoSesion', 'detalleFirmas', 'obtenerRevisionEnvio', 'confirmarEnvio']);
    docs.revisarOrigen.and.returnValue(of(revision)); docs.guardarOrigen.and.returnValue(of(doc)); docs.detalleFirmas.and.returnValue(of(doc));
    docs.obtenerRevisionEnvio.and.returnValue(of(revision)); docs.confirmarEnvio.and.returnValue(of({ ...doc, estado_certificado: 'PENDIENTE_FIRMA', facultades: { remitir: false, descargar: true } }));
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: EmisionCertificadosService, useValue: api },
      { provide: DocumentosDigitalesService, useValue: docs }, { provide: AuthService, useValue: { tienePermiso: () => true } }] })
      .overrideComponent(PreparacionOrigenComponent, { remove: { imports: [VisorPdfComponent] }, add: { imports: [VisorPrueba] } });
  });
  function iniciarMunicipal(documento?: typeof doc): void {
    fixture = TestBed.createComponent(PreparacionOrigenComponent);
    fixture.componentRef.setInput('origen', 'reconocimiento');
    fixture.componentRef.setInput('municipal', { ...evaluacionOrigenPrueba('reconocimiento'), mensaje_predeterminado: revision.mensaje, texto_editable: true });
    fixture.componentRef.setInput('asistente', true);
    fixture.componentRef.setInput('consultaExterna', true);
    if (documento) fixture.componentRef.setInput('documentoRecuperado', documento);
    fixture.detectChanges(); fixture.detectChanges(); c = fixture.componentInstance;
  }
  it('municipal: conserva identidad, cuatro pasos y confirma una sola vez antes del envío explícito', () => {
    iniciarMunicipal();
    expect(api.listarTodos).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelectorAll('.pasos-reconocimiento li').length).toBe(4);
    expect(fixture.nativeElement.textContent).toContain('Ana Municipal');
    expect(fixture.nativeElement.textContent).not.toContain(revision.mensaje);
    c.siguienteReconocimiento(); fixture.detectChanges();
    expect(docs.revisarOrigen).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('textarea').readOnly).toBeFalse();
    c.siguienteReconocimiento(); fixture.detectChanges();
    expect(docs.revisarOrigen).toHaveBeenCalledOnceWith('reconocimiento', 71, undefined, revision.mensaje);
    c.pdfReconocimientoRevisado.set(revision.archivo); c.guardar(); c.guardar(); fixture.detectChanges();
    expect(docs.guardarOrigen).toHaveBeenCalledTimes(1);
    expect(c.pasoReconocimiento()).toBe(4);
    expect(docs.confirmarEnvio).not.toHaveBeenCalled();
    c.enviarSesion(); c.enviarSesion();
    expect(docs.confirmarEnvio).toHaveBeenCalledTimes(1);
  });
  it('municipal: recupera PREPARADO conservando documento y evita revisión y regeneración', () => {
    iniciarMunicipal(doc);
    expect(c.documento()).toEqual(doc);
    expect(c.pasoReconocimiento()).toBe(1);
    expect(docs.revisarOrigen).not.toHaveBeenCalled();
    expect(docs.guardarOrigen).not.toHaveBeenCalled();
    expect(docs.confirmarEnvio).not.toHaveBeenCalled();
  });
  it('municipal: bloquea otra confirmación tras respuesta incierta hasta recuperar el origen', () => {
    iniciarMunicipal(); c.siguienteReconocimiento(); c.siguienteReconocimiento();
    c.pdfReconocimientoRevisado.set(revision.archivo);
    docs.guardarOrigen.and.returnValue(throwError(() => ({ status: 408, mensaje: 'Incierto', errores: {} })));
    api.evaluarOrigen.and.returnValue(throwError(() => ({ status: 503, mensaje: 'No disponible', errores: {} })));
    c.guardar(); c.guardar();
    expect(docs.guardarOrigen).toHaveBeenCalledTimes(1);
    expect(c.puedePreparar()).toBeFalse();
  });
  it('municipal: editar después de la vista previa invalida token y no genera PDF al escribir', () => {
    iniciarMunicipal(); c.siguienteReconocimiento(); c.siguienteReconocimiento();
    c.anteriorReconocimiento(); c.mensajeCertificado.setValue('Nuevo mensaje');
    expect(c.revision()).toBeNull(); expect(c.pdfReconocimientoRevisado()).toBeNull();
    expect(docs.revisarOrigen).toHaveBeenCalledTimes(1); c.guardar(); expect(docs.guardarOrigen).not.toHaveBeenCalled();
    docs.revisarOrigen.and.returnValue(of({ ...revision, mensaje: 'Nuevo mensaje', token: 'd'.repeat(64) }));
    c.siguienteReconocimiento(); expect(c.revision().token).toBe('d'.repeat(64));
    expect(docs.revisarOrigen).toHaveBeenCalledTimes(2);
  });
  it('municipal: persistido false nunca bloquea el editor como si fuera una preparación confirmada', () => {
    iniciarMunicipal();
    fixture.componentRef.setInput('documentoRecuperado', { ...doc, persistido: false });
    fixture.detectChanges(); c.siguienteReconocimiento(); fixture.detectChanges();
    const campo = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    expect(c.documento()).toBeNull(); expect(campo.disabled).toBeFalse(); expect(campo.readOnly).toBeFalse();
    campo.value = 'Edición real con vista previa temporal'; campo.dispatchEvent(new Event('input')); fixture.detectChanges();
    expect(c.mensajeCertificado.value).toBe(campo.value); expect(docs.revisarOrigen).not.toHaveBeenCalled();
  });
  it('municipal: volver al mensaje durante la revisión cancela la espera y permite editar', () => {
    iniciarMunicipal(); const pendiente = new Subject<any>(); docs.revisarOrigen.and.returnValue(pendiente);
    c.siguienteReconocimiento(); c.siguienteReconocimiento(); fixture.detectChanges();
    expect(c.pasoReconocimiento()).toBe(3); expect(c.operando()).toBeTrue();
    const anterior = fixture.nativeElement.querySelector('.acciones-paso button') as HTMLButtonElement;
    expect(anterior.disabled).toBeFalse(); anterior.click(); fixture.detectChanges();
    expect(c.pasoReconocimiento()).toBe(2); expect(c.operando()).toBeFalse();
    const campo = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    expect(campo.readOnly).toBeFalse(); campo.value = 'Texto actualizado'; campo.dispatchEvent(new Event('input'));
    pendiente.next(revision); fixture.detectChanges();
    expect(c.mensajeCertificado.value).toBe('Texto actualizado'); expect(c.pasoReconocimiento()).toBe(2); expect(c.revision()).toBeNull();
  });
  function iniciar(origen: OrigenDocumental, elegible = true): void {
    api.evaluarOrigen.and.returnValue(of(evaluacionOrigenPrueba(origen, elegible)));
    fixture = TestBed.createComponent(PreparacionOrigenComponent); fixture.componentRef.setInput('origen', origen); fixture.detectChanges();
    c = fixture.componentInstance; c.consultar(71); fixture.detectChanges();
  }
  function iniciarAsistente(existente = false, estado = 'PREPARADO'): void {
    const e = ponenteActividadPrueba().ponentes[0].reconocimiento;
    if (existente) Object.assign(e, { puede_preparar: false, puede_consultar_certificado_existente: true,
      certificados_existentes: [{ id_certificado: 151, id_persona: 31, id_tipo_certificado: 47, id_reconocimiento: 81, id_practica: null, estado }] });
    docs.recuperarReconocimientoActividad.and.returnValue(of({ ...doc, estado_certificado: estado,
      facultades: { remitir: estado === 'PREPARADO', descargar: true } }));
    fixture = TestBed.createComponent(PreparacionOrigenComponent);
    fixture.componentRef.setInput('origen', 'reconocimiento'); fixture.componentRef.setInput('ponente', e);
    fixture.componentRef.setInput('asistente', true); fixture.detectChanges(); fixture.detectChanges(); c = fixture.componentInstance;
  }
  it('recorre cuatro pasos y confirma junto al PDF antes del envío explícito', () => {
    const e = ponenteSesionPrueba();
    fixture = TestBed.createComponent(PreparacionOrigenComponent);
    fixture.componentRef.setInput('origen', 'reconocimiento'); fixture.componentRef.setInput('ponente', e);
    fixture.componentRef.setInput('asistente', true); fixture.detectChanges();
    c = fixture.componentInstance;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.pasos-reconocimiento li').length).toBe(4);
    expect(fixture.nativeElement.querySelectorAll('.datos dt').length).toBe(6);
    expect(fixture.nativeElement.querySelector('input')).toBeNull();
    c.siguienteReconocimiento(); fixture.detectChanges();
    expect(c.pasoReconocimiento()).toBe(2);
    expect(docs.revisarOrigen).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Previsualizar PDF');
    c.mensajeCertificado.setValue(revision.mensaje); c.motivoCertificado.setValue('Aporte t?cnico');
    const revisada = { ...revision, motivo: 'Aporte t?cnico' }; docs.revisarOrigen.and.returnValue(of(revisada));
    c.siguienteReconocimiento(); fixture.detectChanges();
    expect(docs.revisarOrigen).toHaveBeenCalledWith('ponente_sesion', 71, { modalidad_reconocimiento: 'sesion', id_sesion: 15, mensaje: revision.mensaje, motivo: 'Aporte t?cnico' });
    expect(c.pasoReconocimiento()).toBe(3);
    expect(fixture.nativeElement.querySelector('app-visor-pdf')).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Confirmar preparación');
    c.guardar(); expect(docs.guardarOrigen).not.toHaveBeenCalled();
    c.siguienteReconocimiento(); expect(c.pasoReconocimiento()).toBe(3);
    c.pdfReconocimientoRevisado.set({ ...revision.archivo }); c.guardar();
    expect(docs.guardarOrigen).not.toHaveBeenCalled();
    c.pdfReconocimientoRevisado.set(revision.archivo);
    c.guardar(); fixture.detectChanges();
    expect(c.pasoReconocimiento()).toBe(4);
    expect(docs.guardarOrigen).toHaveBeenCalledWith(e, revisada);
    expect(docs.obtenerRevisionEnvio).not.toHaveBeenCalled();
    expect(docs.confirmarEnvio).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('El certificado está listo para enviarse a Gerencia.');
    expect(fixture.nativeElement.textContent).toContain('Pendiente de envío a Gerencia');
    expect(fixture.nativeElement.textContent).not.toContain('Enviado a Gerencia');
    const botones = Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];
    expect(botones.map(b => b.textContent?.trim())).toEqual(['Enviar a Gerencia']);
    expect(fixture.nativeElement.querySelector('app-visor-pdf')).toBeNull();
    expect(fixture.nativeElement.querySelector('.contenido-paso a')).toBeNull();
    expect(docs.obtenerRevisionEnvio).not.toHaveBeenCalled(); expect(docs.confirmarEnvio).not.toHaveBeenCalled();
    botones.find(b => b.textContent?.trim() === 'Enviar a Gerencia')!.click(); fixture.detectChanges();
    expect(docs.obtenerRevisionEnvio).toHaveBeenCalledWith(201, revision.hash);
    expect(docs.confirmarEnvio).toHaveBeenCalledWith(201, revision.token, revision.hash);
    expect(c.pasoReconocimiento()).toBe(4);
    expect(c.documento().estado_certificado).toBe('PENDIENTE_FIRMA');
    expect(docs.confirmarEnvio).toHaveBeenCalledTimes(1);
  });

  function iniciarSesion(e = ponenteSesionPrueba()): void {
    fixture = TestBed.createComponent(PreparacionOrigenComponent);
    fixture.componentRef.setInput('origen', 'reconocimiento'); fixture.componentRef.setInput('ponente', e);
    fixture.componentRef.setInput('asistente', true); fixture.detectChanges(); c = fixture.componentInstance;
  }
  function prepararSesion(): void {
    iniciarSesion(); c.siguienteReconocimiento();
    docs.revisarOrigen.and.returnValue(of({ ...revision, mensaje: c.mensajeCertificado.value, motivo: c.motivoCertificado.value }));
    c.siguienteReconocimiento(); c.pdfReconocimientoRevisado.set(revision.archivo); c.guardar(); fixture.detectChanges();
  }
  it('limita Información a los seis datos de sesión y Siguiente, sin duplicar el texto del paso 2', () => {
    iniciarSesion(); fixture.detectChanges();
    const contenido = () => fixture.nativeElement.querySelector('.contenido-paso') as HTMLElement;
    expect(Array.from(contenido().querySelectorAll('dt')).map(dt => dt.textContent)).toEqual([
      'Beneficiario', 'Tipo', 'Actividad', 'Sesión acreditada', 'Fecha de la sesión', 'Elegibilidad',
    ]);
    expect(contenido().querySelectorAll('button').length).toBe(1);
    expect(contenido().querySelector('button')!.textContent!.trim()).toBe('Siguiente');
    expect(contenido().querySelector('input, textarea, app-visor-pdf')).toBeNull();
    expect(contenido().textContent).not.toContain(c.mensajeCertificado.value);
    expect(contenido().textContent).not.toContain(c.motivoCertificado.value);
    c.siguienteReconocimiento(); fixture.detectChanges();
    expect(contenido().querySelector('textarea')!.value).toBe(c.mensajeCertificado.value);
    expect(contenido().querySelector('input')!.value).toBe(c.motivoCertificado.value);
    c.anteriorReconocimiento(); fixture.detectChanges();
    expect(contenido().textContent).not.toContain(c.mensajeCertificado.value);
    expect(contenido().textContent).not.toContain(c.motivoCertificado.value);
    expect(docs.revisarOrigen).not.toHaveBeenCalled(); expect(docs.guardarOrigen).not.toHaveBeenCalled();
  });
  it('distingue vista previa, confirmación y envío sin mostrar procesamiento en lecturas iniciales', () => {
    iniciarSesion(); c.siguienteReconocimiento();
    const previa = new Subject<any>(); docs.revisarOrigen.and.returnValue(previa);
    c.siguienteReconocimiento(); fixture.detectChanges();
    expect(c.operacionActual()).toBe('vista_previa');
    expect(fixture.nativeElement.textContent).toContain('Generando vista previa');
    previa.next({ ...revision, mensaje: c.mensajeCertificado.value, motivo: c.motivoCertificado.value }); previa.complete();
    fixture.detectChanges(); c.pdfReconocimientoRevisado.set(revision.archivo);
    const confirmacion = new Subject<any>(); docs.guardarOrigen.and.returnValue(confirmacion);
    c.guardar(); fixture.detectChanges();
    expect(c.operacionActual()).toBe('confirmacion');
    expect(fixture.nativeElement.textContent).toContain('Confirmando PDF');
    confirmacion.next(doc); confirmacion.complete(); fixture.detectChanges();
    const envio = new Subject<any>(); docs.confirmarEnvio.and.returnValue(envio);
    c.enviarSesion(); fixture.detectChanges();
    expect(c.operacionActual()).toBe('envio');
    expect(fixture.nativeElement.textContent).toContain('Enviando a Gerencia');
    envio.next({ ...doc, estado_certificado: 'PENDIENTE_FIRMA' }); envio.complete(); fixture.detectChanges();
    expect(c.operacionActual()).toBeNull(); expect(c.operando()).toBeFalse();
    expect(fixture.nativeElement.textContent).not.toContain('Procesando documento');
  });
  it('permanece en Información durante la recuperación y al volver a ingresar', () => {
    const e = ponenteSesionPrueba();
    Object.assign(e, { puede_preparar: false, puede_generar_pdf: false, puede_consultar_certificado_existente: true,
      certificados_existentes: [{ id_certificado: 151, id_tipo_certificado: 47, estado: 'PREPARADO' }] });
    const pendiente = new Subject<any>(); docs.recuperarReconocimientoSesion.and.returnValue(pendiente);
    iniciarSesion(e); fixture.detectChanges(); expect(c.pasoReconocimiento()).toBe(1); expect(c.puedeAvanzar()).toBeFalse();
    expect(c.operacionActual()).toBe('recuperacion');
    expect(fixture.nativeElement.textContent).not.toContain('Procesando documento');
    expect(fixture.nativeElement.textContent).toContain('Maria Perez');
    expect(fixture.nativeElement.querySelectorAll('.datos dt').length).toBe(6);
    pendiente.next({ ...doc, mensaje: 'Texto guardado', motivo: 'Motivo guardado', texto_editable: false }); pendiente.complete();
    fixture.detectChanges(); expect(c.pasoReconocimiento()).toBe(1);
    c.siguienteReconocimiento(); c.siguienteReconocimiento(); c.siguienteReconocimiento();
    expect(c.pasoReconocimiento()).toBe(4); fixture.destroy();
    docs.recuperarReconocimientoSesion.and.returnValue(of({ ...doc, mensaje: 'Texto guardado', motivo: 'Motivo guardado', texto_editable: false }));
    iniciarSesion(e); fixture.detectChanges();
    expect(c.pasoReconocimiento()).toBe(1); expect(c.mensajeCertificado.value).toBe('Texto guardado');
    expect(docs.revisarOrigen).not.toHaveBeenCalled(); expect(docs.guardarOrigen).not.toHaveBeenCalled();
    expect(docs.confirmarEnvio).not.toHaveBeenCalled();
  });
  it('un fallo de envío conserva PREPARADO y permite reintentar con el ID del documento', () => {
    prepararSesion();
    docs.confirmarEnvio.and.returnValue(throwError(() => ({ status: 500, mensaje: 'Error del servidor', errores: {} })));
    c.enviarSesion(); fixture.detectChanges();
    expect(c.documento().estado_certificado).toBe('PREPARADO'); expect(c.documento().id_certificado_documento).toBe(201);
    expect(fixture.nativeElement.textContent).toContain('Pendiente de envío a Gerencia');
    expect(fixture.nativeElement.textContent).toContain('No se pudo enviar el certificado. Intenta nuevamente.');
    expect(fixture.nativeElement.textContent).not.toContain('Enviado a Gerencia');
    docs.confirmarEnvio.and.returnValue(of({ ...doc, estado_certificado: 'PENDIENTE_FIRMA', facultades: { remitir: false, descargar: true } }));
    (Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[]).find(b => b.textContent?.trim() === 'Enviar a Gerencia')!.click(); fixture.detectChanges();
    expect(c.documento().estado_certificado).toBe('PENDIENTE_FIRMA');
    expect(docs.confirmarEnvio).toHaveBeenCalledWith(201, revision.token, revision.hash);
    expect(fixture.nativeElement.textContent).toContain('Enviado a Gerencia');
  });
  it('recupera una remisión existente por ID documental sin repetir el POST', () => {
    prepararSesion();
    docs.obtenerRevisionEnvio.and.returnValue(throwError(() => ({ status: 409, mensaje: 'Documento ya remitido', errores: {} })));
    docs.detalleFirmas.and.returnValue(of({ ...doc, hash_pdf: 'd'.repeat(64), estado_certificado: 'PENDIENTE_FIRMA', facultades: { remitir: false, descargar: true } }));
    c.enviarSesion(); fixture.detectChanges(); c.enviarSesion();
    expect(docs.detalleFirmas).toHaveBeenCalledWith(201); expect(docs.confirmarEnvio).not.toHaveBeenCalled();
    expect(c.documento().estado_certificado).toBe('PENDIENTE_FIRMA');
    expect(fixture.nativeElement.textContent).toContain('Enviado a Gerencia');
  });
  it('conserva los textos y la URL guardados si la consulta tras un conflicto devuelve un detalle parcial', () => {
    prepararSesion();
    c.documento.set({ ...doc, mensaje: 'Mensaje aprobado', motivo: 'Motivo aprobado',
      url_documento: '/api/certificados-documentos/201/archivo?flujo=firmas' });
    docs.obtenerRevisionEnvio.and.returnValue(throwError(() => ({ status: 409, mensaje: 'SQLSTATE interno', errores: {} })));
    docs.detalleFirmas.and.returnValue(of(doc));
    c.enviarSesion(); fixture.detectChanges();
    expect(c.documento().estado_certificado).toBe('PREPARADO');
    expect(c.documento().mensaje).toBe('Mensaje aprobado'); expect(c.documento().motivo).toBe('Motivo aprobado');
    expect(c.documento().url_documento).toBe('/api/certificados-documentos/201/archivo?flujo=firmas');
    expect(fixture.nativeElement.textContent).not.toContain('SQLSTATE');
    expect(fixture.nativeElement.querySelector('.contenido-paso button').textContent.trim()).toBe('Enviar a Gerencia');
    expect(docs.confirmarEnvio).not.toHaveBeenCalled();
  });
  it('no presenta envío positivo ante una respuesta que sigue PREPARADO', () => {
    prepararSesion(); docs.confirmarEnvio.and.returnValue(of(doc)); c.enviarSesion(); fixture.detectChanges();
    expect(c.documento().estado_certificado).toBe('PREPARADO');
    expect(fixture.nativeElement.textContent).not.toContain('Enviado a Gerencia');
    expect(fixture.nativeElement.textContent).toContain('El envío no fue confirmado');
  });
  for (const disponibilidad of [{ disponible_rrhh: true }, { estado_preparacion: 'PREPARADO_ENTREGA' }]) {
    it('reconoce disponibilidad administrativa sin exigir FIRMADO, EMITIDO ni pdf_confirmado: ' + JSON.stringify(disponibilidad), () => {
      prepararSesion();
      c.documento.set({ ...doc, estado_certificado: 'PENDIENTE_FIRMA', pdf_confirmado: false, ...disponibilidad,
        facultades: { remitir: false, descargar: true } });
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('Estado: Listo para entrega');
      expect(docs.confirmarEnvio).not.toHaveBeenCalled();
    });
  }

  it('ignora una etiqueta de envío contradictoria mientras el estado real es PREPARADO', () => {
    prepararSesion(); c.documento.set({ ...doc, etiqueta_estado: 'Enviado a Gerencia', disponible_rrhh: true, pdf_confirmado: true }); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Pendiente de envío a Gerencia');
    expect(fixture.nativeElement.textContent).not.toContain('Enviado a Gerencia');
  });
  it('bloquea doble clic durante la revisión y remisión explícitas de sesión', () => {
    prepararSesion();
    const revisionEnvio = new Subject<any>(); docs.obtenerRevisionEnvio.and.returnValue(revisionEnvio);
    const envio = new Subject<any>(); docs.confirmarEnvio.and.returnValue(envio);
    c.enviarSesion(); c.enviarSesion(); expect(docs.obtenerRevisionEnvio).toHaveBeenCalledTimes(1);
    expect(docs.confirmarEnvio).not.toHaveBeenCalled(); revisionEnvio.next(revision); revisionEnvio.complete();
    c.enviarSesion(); expect(docs.confirmarEnvio).toHaveBeenCalledTimes(1);
    envio.next({ ...doc, estado_certificado: 'PENDIENTE_FIRMA' }); envio.complete(); fixture.detectChanges();
    c.enviarSesion(); expect(docs.confirmarEnvio).toHaveBeenCalledTimes(1);
  });
  it('espera éxito al confirmar y bloquea dobles clics en preparación y envío', () => {
    iniciarSesion(); c.siguienteReconocimiento();
    const r = { ...revision, mensaje: c.mensajeCertificado.value, motivo: c.motivoCertificado.value };
    docs.revisarOrigen.and.returnValue(of(r)); c.siguienteReconocimiento(); fixture.detectChanges();
    c.pdfReconocimientoRevisado.set(r.archivo);
    const preparacion = new Subject<any>(); docs.guardarOrigen.and.returnValue(preparacion);
    c.guardar(); c.guardar(); fixture.detectChanges();
    expect(c.pasoReconocimiento()).toBe(3); expect(docs.guardarOrigen).toHaveBeenCalledTimes(1);
    expect(docs.obtenerRevisionEnvio).not.toHaveBeenCalled();
    preparacion.next(doc); preparacion.complete(); fixture.detectChanges();
    expect(c.pasoReconocimiento()).toBe(4); expect(docs.confirmarEnvio).not.toHaveBeenCalled();
    c.revisarEnvio();
    const envio = new Subject<any>(); docs.confirmarEnvio.and.returnValue(envio);
    c.enviar(); c.enviar(); expect(docs.confirmarEnvio).toHaveBeenCalledTimes(1);
    envio.next({ ...doc, estado_certificado: 'PENDIENTE_FIRMA', facultades: { remitir: false, descargar: true } });
    envio.complete(); fixture.detectChanges(); c.enviar();
    expect(docs.confirmarEnvio).toHaveBeenCalledTimes(1);
    expect(fixture.nativeElement.textContent).toContain('Enviado a Gerencia');
  });
  it('mantiene el PDF y los textos si Laravel rechaza la confirmación', () => {
    iniciarSesion(); c.siguienteReconocimiento();
    const r = { ...revision, mensaje: c.mensajeCertificado.value, motivo: c.motivoCertificado.value };
    docs.revisarOrigen.and.returnValue(of(r)); c.siguienteReconocimiento(); c.pdfReconocimientoRevisado.set(r.archivo);
    docs.guardarOrigen.and.returnValue(throwError(() => ({ status: 409, mensaje: 'La revisión venció.', errores: {} })));
    c.guardar(); fixture.detectChanges();
    expect(c.pasoReconocimiento()).toBe(3); expect(c.documento()).toBeNull();
    expect(c.revision()).toBe(r); expect(c.mensajeCertificado.value).toBe(r.mensaje);
    expect(docs.obtenerRevisionEnvio).not.toHaveBeenCalled();
    c.anteriorReconocimiento(); expect(c.pasoReconocimiento()).toBe(2);
    c.anteriorReconocimiento(); expect(c.pasoReconocimiento()).toBe(1);
    c.siguienteReconocimiento(); expect(c.mensajeCertificado.value).toBe(r.mensaje);
  });
  it('descarta una respuesta pendiente si cambió el contenido y evita solicitudes simultáneas', () => {
    iniciarSesion(); c.siguienteReconocimiento();
    const pendiente = new Subject<any>();
    const r = { ...revision, mensaje: c.mensajeCertificado.value, motivo: c.motivoCertificado.value };
    docs.revisarOrigen.and.returnValue(pendiente);
    c.siguienteReconocimiento(); c.siguienteReconocimiento();
    expect(docs.revisarOrigen).toHaveBeenCalledTimes(1);
    c.mensajeCertificado.setValue('Nuevo contenido'); pendiente.next(r); pendiente.complete();
    expect(c.revision()).toBeNull(); expect(c.pasoReconocimiento()).toBe(2);
    expect(c.error()).toContain('cambiaron');
  });
  it('actualiza la caducidad mientras permanece abierto el resumen', fakeAsync(() => {
    iniciarSesion(); c.siguienteReconocimiento();
    const r = { ...revision, mensaje: c.mensajeCertificado.value, motivo: c.motivoCertificado.value,
      expiresAt: new Date(Date.now() + 1000).toISOString() };
    docs.revisarOrigen.and.returnValue(of(r)); c.siguienteReconocimiento(); fixture.detectChanges();
    c.pdfReconocimientoRevisado.set(r.archivo); c.siguienteReconocimiento(); fixture.detectChanges();
    expect(c.puedeGuardarReconocimiento()).toBeTrue();
    tick(1001); fixture.detectChanges();
    expect(c.puedeGuardarReconocimiento()).toBeFalse();
    expect(fixture.nativeElement.textContent).toContain('La vista previa venció');
    fixture.destroy();
  }));
  it('conserva los textos originales y bloquea los controles de una preparación recuperada', () => {
    iniciarSesion(); c.siguienteReconocimiento();
    docs.revisarOrigen.and.returnValue(of({ ...revision, documento: { ...doc, texto_editable: false,
      mensaje_aprobado: 'Mensaje original', motivo: 'Motivo original' } }));
    c.siguienteReconocimiento(); fixture.detectChanges();
    expect(c.mensajeCertificado.value).toBe('Mensaje original');
    expect(c.motivoCertificado.value).toBe('Motivo original');
    expect(c.mensajeCertificado.disabled).toBeTrue(); expect(c.motivoCertificado.disabled).toBeTrue();
    expect(c.revision()).toBeNull(); c.guardar(); expect(docs.guardarOrigen).not.toHaveBeenCalled();
  });
  it('edita ambos textos, conserva el borrador e invalida el token al cambiar contenido', () => {
    iniciarSesion(); c.siguienteReconocimiento(); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('textarea')).not.toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('Solo lectura');
    c.mensajeCertificado.setValue('Mensaje revisado'); c.motivoCertificado.setValue('Motivo revisado');
    const r = { ...revision, mensaje: 'Mensaje revisado', motivo: 'Motivo revisado' };
    docs.revisarOrigen.and.returnValue(of(r)); c.siguienteReconocimiento();
    expect(c.pasoReconocimiento()).toBe(3); expect(c.revisionVigente()).toBeTrue();
    c.anteriorReconocimiento(); expect(c.mensajeCertificado.value).toBe('Mensaje revisado');
    c.motivoCertificado.setValue('Otro motivo'); expect(c.revision()).toBeNull();
    expect(c.pdfReconocimientoRevisado()).toBeNull(); c.guardar(); expect(docs.guardarOrigen).not.toHaveBeenCalled();
  });
  it('valida l?mites Unicode, HTML y controles en ambos campos', () => {
    iniciarSesion();
    for (const [control, limite] of [[c.mensajeCertificado, 1200], [c.motivoCertificado, 500]]) {
      control.setValue('a'.repeat(limite)); expect(control.valid).toBeTrue();
      for (const texto of ['a'.repeat(limite + 1), '', '<b>texto</b>', 'texto\u0000']) { control.setValue(texto); expect(control.invalid).toBeTrue(); }
    }
  });
  for (const titulo of ['Sesion N°004', 'sesión Sesion N°004', 'Sesión N.º 004']) {
    it('normaliza el rótulo numérico sin duplicar Sesión: ' + titulo, () => {
      const e = ponenteSesionPrueba(); e.sesion = titulo; iniciarSesion(e);
      expect(c.nombreSesion()).toBe('Sesión N.º 004'); expect(e.sesion).toBe(titulo);
    });
  }
  it('conserva los títulos reales de sesión y valida las fechas antes de avanzar', () => {
    const e = ponenteSesionPrueba(); e.sesion = 'Gestión municipal: herramientas y prácticas'; iniciarSesion(e);
    expect(c.nombreSesion()).toBe(e.sesion);
    c.siguienteReconocimiento();
    e.fecha_sesion = '2026-02-30'; expect(c.puedeAvanzar()).toBeFalse(); c.siguienteReconocimiento();
    expect(c.pasoReconocimiento()).toBe(2); expect(docs.revisarOrigen).not.toHaveBeenCalled();
    e.fecha_sesion = '2026-02-10T00:00:00Z'; expect(c.fechaSesion()).toBe('10/02/2026');
    expect(c.puedeAvanzar()).toBeTrue();
  });
  it('bloquea el primer paso cuando falta la identidad real de asignación', () => {
    const e = ponenteSesionPrueba(); e.id_actividad_ponente = 99; iniciarSesion(e);
    expect(c.puedeAvanzar()).toBeFalse(); c.siguienteReconocimiento();
    expect(c.pasoReconocimiento()).toBe(1); expect(docs.revisarOrigen).not.toHaveBeenCalled();
  });
  it('renueva un token vencido conservando ambos textos', () => {
    iniciarSesion(); c.siguienteReconocimiento();
    const r = { ...revision, mensaje: c.mensajeCertificado.value, motivo: c.motivoCertificado.value, expiresAt: '2000-01-01T00:00:00Z' };
    docs.revisarOrigen.and.returnValue(of(r)); c.siguienteReconocimiento();
    expect(c.revisionVigente()).toBeFalse(); c.guardar(); expect(docs.guardarOrigen).not.toHaveBeenCalled();
    c.anteriorReconocimiento(); docs.revisarOrigen.and.returnValue(of({ ...r, expiresAt: revision.expiresAt }));
    c.siguienteReconocimiento(); expect(c.revisionVigente()).toBeTrue(); expect(c.mensajeCertificado.value).toBe(r.mensaje);
  });
  for (const estado of ['PREPARADO', 'PENDIENTE_FIRMA', 'FIRMADO', 'EMITIDO']) {
    it('recupera el reconocimiento de sesión existente sin regenerar su PDF: ' + estado, () => {
      const e = ponenteSesionPrueba();
      Object.assign(e, { puede_preparar: false, puede_generar_pdf: false, puede_consultar_certificado_existente: true,
        certificados_existentes: [{ id_certificado: 151, id_persona: 31, id_tipo_certificado: 47, id_reconocimiento: 81, id_practica: null, estado }] });
      docs.recuperarReconocimientoSesion.and.returnValue(of({ ...doc, estado_certificado: estado, id_sesion: 15,
        origen: 'ponente_sesion', id_actividad_ponente: 71, modalidad_reconocimiento: 'sesion',
        mensaje: 'Mensaje original', motivo: 'Motivo original', texto_editable: false }));
      iniciarSesion(e); fixture.detectChanges();
      expect(docs.recuperarReconocimientoSesion).toHaveBeenCalledWith(e, 151);
      expect(c.pasoReconocimiento()).toBe(1);
      expect(c.documento().id_certificado_documento).toBe(201);
      expect(c.mensajeCertificado.value).toBe('Mensaje original'); expect(c.motivoCertificado.value).toBe('Motivo original');
      expect(c.mensajeCertificado.disabled).toBeTrue(); expect(c.motivoCertificado.disabled).toBeTrue();
      expect(fixture.nativeElement.textContent).not.toContain('Recuperar reconocimiento existente');
      expect(fixture.nativeElement.textContent).not.toContain('Documento o código no encontrado');
      expect(c.documento().id_certificado_documento).toBe(201);
      expect(fixture.nativeElement.textContent).not.toContain('Mensaje original');
      expect(fixture.nativeElement.textContent).not.toContain('Motivo original');
      expect(fixture.nativeElement.textContent).not.toContain('Estado:');
      expect(fixture.nativeElement.querySelector('.contenido-paso button').textContent.trim()).toBe('Siguiente');
      c.siguienteReconocimiento(); fixture.detectChanges(); expect(c.pasoReconocimiento()).toBe(2);
      expect(fixture.nativeElement.querySelector('textarea').disabled).toBeTrue();
      expect(fixture.nativeElement.querySelector('input').disabled).toBeTrue();
      expect(fixture.nativeElement.querySelector('textarea').value).toBe('Mensaje original');
      expect(fixture.nativeElement.querySelector('input').value).toBe('Motivo original');
      c.siguienteReconocimiento(); fixture.detectChanges(); expect(c.pasoReconocimiento()).toBe(3);
      const visor = fixture.debugElement.query(By.directive(VisorPrueba)).componentInstance as VisorPrueba;
      expect(visor.documentoId()).toBe(201); expect(visor.persistido()).toBeTrue();
      expect(fixture.nativeElement.textContent).not.toContain('Confirmar preparación');
      c.anteriorReconocimiento(); expect(c.pasoReconocimiento()).toBe(2);
      c.siguienteReconocimiento(); c.siguienteReconocimiento(); fixture.detectChanges();
      c.revisar(); c.guardar();
      expect(c.pasoReconocimiento()).toBe(4);
      expect(docs.recuperarReconocimientoSesion).toHaveBeenCalledTimes(1);
      if (estado !== 'PREPARADO') {
        c.enviarSesion();
        expect(fixture.nativeElement.querySelector('.contenido-paso button')).toBeNull();
      }
      if (estado === 'PENDIENTE_FIRMA') expect(fixture.nativeElement.textContent).toContain('El certificado ya fue enviado a Gerencia.');
      expect(docs.revisarOrigen).not.toHaveBeenCalled(); expect(docs.guardarOrigen).not.toHaveBeenCalled();
      expect(docs.confirmarEnvio).not.toHaveBeenCalled();
    });
  }

  it('mantiene el paso pendiente y reintenta la consulta fallida sin volver a preparar', () => {
    const e = ponenteSesionPrueba();
    Object.assign(e, { puede_preparar: false, puede_generar_pdf: false, puede_consultar_certificado_existente: true,
      certificados_existentes: [{ id_certificado: 151, id_persona: 31, id_tipo_certificado: 47, estado: 'PREPARADO' }] });
    docs.recuperarReconocimientoSesion.and.returnValue(throwError(() => ({ status: 502, mensaje: 'No encontrado',
      errores: { endpoint: ['/api/certificados-documentos/detail/201?flujo=firmas'] } })));
    iniciarSesion(e); fixture.detectChanges();
    expect(c.pasoReconocimiento()).toBe(1); expect(c.evaluacion()).toBe(e);
    expect(fixture.nativeElement.textContent).toContain('No se pudo consultar el reconocimiento. Reintentar');
    expect(fixture.nativeElement.textContent).not.toContain('HTTP 502');
    expect(fixture.nativeElement.textContent).not.toContain('Documento o código no encontrado');
    expect(fixture.nativeElement.textContent).not.toContain('Recuperar reconocimiento existente');
    docs.recuperarReconocimientoSesion.and.returnValue(of({ ...doc, mensaje: 'Original', motivo: 'Motivo original' }));
    (Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[])
      .find(b => b.textContent?.trim() === 'Reintentar consulta')!.click(); fixture.detectChanges();
    expect(c.documento().id_certificado_documento).toBe(201); expect(c.pasoReconocimiento()).toBe(1);
    expect(c.error()).toBe(''); expect(c.mensajeCertificado.value).toBe('Original');
    expect(docs.guardarOrigen).not.toHaveBeenCalled(); expect(docs.revisarOrigen).not.toHaveBeenCalled();
    expect(docs.confirmarEnvio).not.toHaveBeenCalled();
  });

  it('inicia la página en Datos, con beneficiario y actividad reales, sin preparar ni exigir sesión', () => {
    iniciarAsistente(); expect(c.pasoReconocimiento()).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('Maria Perez');
    expect(fixture.nativeElement.textContent).toContain('Capacitación Personal');
    expect(fixture.nativeElement.textContent).toContain('Reconocimiento por actividad');
    expect(fixture.nativeElement.textContent).not.toContain('vinculado a esta sesión');
    expect(c.evaluacion().id_sesion).toBeNull();
    expect(docs.revisarOrigen).not.toHaveBeenCalled(); expect(docs.guardarOrigen).not.toHaveBeenCalled();
  });
  it('recorre Mensaje y Previsualizar usando el mismo PDF y conserva la revisión al retroceder', () => {
    iniciarAsistente(); c.siguienteReconocimiento(); fixture.detectChanges();
    expect(c.pasoReconocimiento()).toBe(2); expect(fixture.nativeElement.textContent).toContain(revision.mensaje);
    expect(fixture.nativeElement.querySelector('textarea')).toBeNull();
    expect(docs.revisarOrigen).toHaveBeenCalledWith('ponente_actividad', 71);
    c.siguienteReconocimiento(); fixture.detectChanges();
    expect(c.pasoReconocimiento()).toBe(3); expect(fixture.nativeElement.querySelector('app-visor-pdf')).not.toBeNull();
    c.anteriorReconocimiento(); expect(c.pasoReconocimiento()).toBe(2); c.anteriorReconocimiento();
    expect(c.pasoReconocimiento()).toBe(1); c.siguienteReconocimiento(); c.siguienteReconocimiento();
    expect(docs.revisarOrigen).toHaveBeenCalledTimes(1); expect(c.revision()).toBe(revision);
  });
  it('guardar avanza a Preparado y exige revisión y clic explícito antes de enviar a Gerencia', () => {
    iniciarAsistente(); c.siguienteReconocimiento(); c.siguienteReconocimiento(); c.pdfReconocimientoRevisado.set(revision.archivo); c.guardar(); fixture.detectChanges();
    expect(c.pasoReconocimiento()).toBe(4); expect(c.documento().id_certificado_documento).toBe(201);
    expect(Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .some(b => b.textContent?.trim() === 'Guardar y continuar')).toBeFalse();
    expect(fixture.nativeElement.textContent).toContain('Documento preparado');
    expect(docs.confirmarEnvio).not.toHaveBeenCalled(); expect(docs.obtenerRevisionEnvio).not.toHaveBeenCalled();
    c.revisarEnvio(); fixture.detectChanges(); expect(c.pasoReconocimiento()).toBe(5);
    expect(docs.confirmarEnvio).not.toHaveBeenCalled(); c.envio.set(null); fixture.detectChanges();
    expect(c.pasoReconocimiento()).toBe(4); c.revisarEnvio(); c.enviar(); fixture.detectChanges();
    expect(c.pasoReconocimiento()).toBe(5); expect(c.documento().estado_certificado).toBe('PENDIENTE_FIRMA');
    c.enviar(); c.guardar(); expect(docs.confirmarEnvio).toHaveBeenCalledTimes(1); expect(docs.guardarOrigen).toHaveBeenCalledTimes(1);
  });
  it('no guarda antes de que PDF.js confirme que visualizó el archivo revisado', () => {
    iniciarAsistente(); c.siguienteReconocimiento(); c.siguienteReconocimiento(); fixture.detectChanges();
    c.guardar(); expect(docs.guardarOrigen).not.toHaveBeenCalled();
    expect(c.puedeGuardarReconocimiento()).toBeFalse();
    c.pdfReconocimientoRevisado.set({ ...revision.archivo }); expect(c.puedeGuardarReconocimiento()).toBeFalse();
    c.pdfReconocimientoRevisado.set(revision.archivo); expect(c.puedeGuardarReconocimiento()).toBeTrue();
  });
  it('consulta un 409 de revisión de envío y muestra el documento ya remitido sin repetir la escritura', () => {
    iniciarAsistente(true);
    docs.obtenerRevisionEnvio.and.returnValue(throwError(() => ({ status: 409, mensaje: 'Ya remitido', errores: {} })));
    docs.recuperarReconocimientoActividad.and.returnValue(of({ ...doc, estado_certificado: 'PENDIENTE_FIRMA', facultades: { remitir: false, descargar: true } }));
    c.revisarEnvio(); fixture.detectChanges();
    expect(c.pasoReconocimiento()).toBe(5); expect(c.documento().id_certificado_documento).toBe(201);
    expect(c.error()).toBe(''); expect(docs.confirmarEnvio).not.toHaveBeenCalled(); c.enviar();
    expect(docs.confirmarEnvio).not.toHaveBeenCalled();
  });
  for (const estado of ['PREPARADO', 'PENDIENTE_FIRMA']) {
    it('recupera el mismo documento al recargar, sin revisar o guardar: ' + estado, () => {
      iniciarAsistente(true, estado);
      expect(c.pasoReconocimiento()).toBe(estado === 'PREPARADO' ? 4 : 5);
      expect(docs.recuperarReconocimientoActividad).toHaveBeenCalledWith(c.evaluacion(), 151);
      expect(c.documento().id_certificado).toBe(151);
      expect(docs.revisarOrigen).not.toHaveBeenCalled(); expect(docs.guardarOrigen).not.toHaveBeenCalled();
      expect(docs.confirmarEnvio).not.toHaveBeenCalled();
    });
  }
  it('conserva los datos revisados y el motivo real ante un 409 sin anunciar persistencia', () => {
    iniciarAsistente(); c.siguienteReconocimiento(); c.siguienteReconocimiento();
    c.pdfReconocimientoRevisado.set(revision.archivo);
    docs.guardarOrigen.and.returnValue(throwError(() => ({ status: 409, mensaje: 'La aprobación de la actividad cambió.', errores: {} })));
    c.guardar(); fixture.detectChanges(); expect(c.pasoReconocimiento()).toBe(3);
    expect(c.revision()).toBe(revision); expect(c.documento()).toBeNull(); expect(c.aviso()).toBe('');
    expect(fixture.nativeElement.textContent).toContain('La aprobación de la actividad cambió.');
    expect(c.operando()).toBeFalse();
  });
  it('reutiliza el formulario y PDF de reconocimiento por actividad, guarda y envía solo por acción explícita', () => {
    fixture = TestBed.createComponent(PreparacionOrigenComponent); fixture.componentRef.setInput('origen', 'reconocimiento');
    const e = ponenteActividadPrueba().ponentes[0].reconocimiento; fixture.componentRef.setInput('ponente', e); fixture.detectChanges(); fixture.detectChanges(); c = fixture.componentInstance;
    expect(docs.revisarOrigen).toHaveBeenCalledWith('ponente_actividad', 71);
    expect(fixture.nativeElement.textContent).toContain('Maria Perez'); expect(fixture.nativeElement.textContent).toContain('Reconocimiento por actividad');
    expect(fixture.nativeElement.textContent).toContain('Capacitación Personal'); expect(fixture.nativeElement.querySelector('textarea')).toBeNull();
    expect(fixture.nativeElement.querySelector('app-visor-pdf')).not.toBeNull();
    c.guardar(); expect(docs.guardarOrigen).toHaveBeenCalledWith(e, revision); expect(docs.confirmarEnvio).not.toHaveBeenCalled();
    c.revisarEnvio(); expect(docs.confirmarEnvio).not.toHaveBeenCalled(); c.enviar(); expect(docs.confirmarEnvio).toHaveBeenCalledTimes(1);
    c.enviar(); expect(docs.confirmarEnvio).toHaveBeenCalledTimes(1);
  });
  it('recupera una preparación previa por actividad sin solicitar otra revisión ni duplicar certificado', () => {
    const e = ponenteActividadPrueba().ponentes[0].reconocimiento; Object.assign(e, { puede_preparar: false, puede_consultar_certificado_existente: true,
      certificados_existentes: [{ id_certificado: 151, id_persona: 31, id_tipo_certificado: 47, id_reconocimiento: 81, id_practica: null, estado: 'PREPARADO' }] });
    docs.recuperarReconocimientoActividad.and.returnValue(of(doc));
    fixture = TestBed.createComponent(PreparacionOrigenComponent); fixture.componentRef.setInput('origen', 'reconocimiento'); fixture.componentRef.setInput('ponente', e); fixture.detectChanges();
    expect(docs.recuperarReconocimientoActividad).toHaveBeenCalledWith(e, 151); expect(docs.revisarOrigen).not.toHaveBeenCalled(); expect(docs.guardarOrigen).not.toHaveBeenCalled();
  });
  it('termina el estado de procesamiento si una consulta finaliza sin emitir datos', () => {
    docs.revisarOrigen.and.returnValue(EMPTY); fixture = TestBed.createComponent(PreparacionOrigenComponent);
    fixture.componentRef.setInput('origen', 'reconocimiento'); fixture.componentRef.setInput('ponente', ponenteActividadPrueba().ponentes[0].reconocimiento); fixture.detectChanges();
    expect((fixture.componentInstance as any).operando()).toBeFalse(); expect(fixture.nativeElement.textContent).not.toContain('Procesando documento');
  });
  it('recupera el reconocimiento si otro reintento lo guardó antes de revisar, sin mostrar un conflicto falso', () => {
    const listado = ponenteActividadPrueba(); const inicial = { ...listado.ponentes[0].reconocimiento };
    Object.assign(listado.ponentes[0].reconocimiento, { puede_preparar: false, puede_consultar_certificado_existente: true,
      certificados_existentes: [{ id_certificado: 151, id_persona: 31, id_tipo_certificado: 47, id_reconocimiento: 81, id_practica: null, estado: 'PREPARADO' }] });
    docs.revisarOrigen.and.returnValue(throwError(() => ({ status: 409, mensaje: 'Ya existe', errores: {} })));
    api.ponentesActividad.and.returnValue(of(listado)); docs.recuperarReconocimientoActividad.and.returnValue(of(doc));
    fixture = TestBed.createComponent(PreparacionOrigenComponent); fixture.componentRef.setInput('origen', 'reconocimiento'); fixture.componentRef.setInput('ponente', inicial); fixture.detectChanges(); fixture.detectChanges();
    expect((fixture.componentInstance as any).documento().id_certificado_documento).toBe(201);
    expect((fixture.componentInstance as any).error()).toBe(''); expect(docs.guardarOrigen).not.toHaveBeenCalled();
  });
  for (const origen of ['reconocimiento', 'practica'] as const) {
    it('consulta ' + origen + ' con identidad real, sin participantes ni sesiones', () => {
      iniciar(origen); expect(api.evaluarOrigen).toHaveBeenCalledWith(origen, 71);
      expect(fixture.nativeElement.textContent).toContain('Ana Municipal'); expect(c.evaluacion().id_sesion).toBeNull();
      expect(api.catalogosOrigenes).toHaveBeenCalled(); expect(docs.revisarOrigen).not.toHaveBeenCalled();
    });
    it('prepara ' + origen + ' solo con facultades del servidor', () => {
      iniciar(origen); c.revisar(); fixture.detectChanges(); expect(docs.revisarOrigen).toHaveBeenCalledWith(origen, 71);
      expect(fixture.nativeElement.textContent).toContain('Texto del origen'); expect(fixture.nativeElement.querySelector('textarea')).toBeNull();
      expect(fixture.nativeElement.querySelector('app-visor-pdf')).not.toBeNull();
    });
    it('bloquea ' + origen + ' aunque su estado visual sea ca/activo', () => {
      iniciar(origen, false); c.revisar(); expect(c.puedePreparar()).toBeFalse(); expect(docs.revisarOrigen).not.toHaveBeenCalled();
      expect(fixture.nativeElement.textContent).toContain('Falta la aprobación institucional.');
      expect(Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>).some(b => b.textContent === 'Preparar certificado')).toBeFalse();
    });
  }
  it('guardar conserva código e identidad y nunca envía automáticamente', () => {
    iniciar('reconocimiento'); c.revisar(); c.guardar(); fixture.detectChanges();
    expect(docs.guardarOrigen).toHaveBeenCalledWith(c.evaluacion(), revision); expect(c.documento().codigo_verificacion).toBe(doc.codigo_verificacion);
    expect(docs.confirmarEnvio).not.toHaveBeenCalled(); expect(docs.obtenerRevisionEnvio).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Enviar a Gerencia'); c.guardar(); expect(docs.guardarOrigen).toHaveBeenCalledTimes(1);
  });
  it('revisa envío separado y solo remite tras confirmación explícita', () => {
    iniciar('reconocimiento'); c.revisar(); c.guardar(); c.revisarEnvio();
    expect(docs.confirmarEnvio).not.toHaveBeenCalled(); c.enviar();
    expect(docs.confirmarEnvio).toHaveBeenCalledWith(201, revision.token, revision.hash); expect(c.documento().estado_certificado).toBe('PENDIENTE_FIRMA');
    c.enviar(); expect(docs.confirmarEnvio).toHaveBeenCalledTimes(1);
  });
  it('recupera un preparado tras recarga mediante detalle, aunque esté oculto del catálogo', () => {
    iniciar('reconocimiento'); const e = evaluacionOrigenPrueba('reconocimiento');
    c.evaluacion.set({ ...e, puede_preparar: false, puede_consultar_certificado_existente: true, certificados_existentes: [{ id_certificado: 151, id_persona: 31, id_tipo_certificado: 47, id_reconocimiento: 71, id_practica: null, estado: 'PREPARADO' }] });
    api.obtener.and.returnValue(of({ id_certificado: 151, id_persona: 31, id_reconocimiento: 71, id_certificado_documento: 201 }) as never);
    c.abrirExistente(151); expect(docs.detalleFirmas).toHaveBeenCalledWith(201); expect(c.documento().id_certificado).toBe(151);
    c.revisar(); expect(docs.revisarOrigen).not.toHaveBeenCalled();
  });
  it('un documento ya remitido se consulta sin volver a enviar', () => {
    iniciar('reconocimiento'); c.documento.set({ ...doc, estado_certificado: 'PENDIENTE_FIRMA' }); c.revisarEnvio();
    expect(docs.obtenerRevisionEnvio).not.toHaveBeenCalled(); expect(docs.confirmarEnvio).not.toHaveBeenCalled();
  });
  it('no anuncia éxito si la persistencia falla; conserva revisión para reintentar el mismo token', () => {
    iniciar('reconocimiento'); c.revisar(); docs.guardarOrigen.and.returnValue(throwError(() => ({ status: 409, mensaje: 'Conflicto', errores: {} })));
    c.guardar(); expect(c.documento()).toBeNull(); expect(c.aviso()).toBe(''); expect(c.revision()).toBe(revision);
  });
  for (const status of [401, 403, 404, 409, 422]) {
    it('mantiene el rechazo HTTP ' + status + ' sin sustituirlo por datos o facultades', () => {
      iniciar('practica'); api.evaluarOrigen.and.returnValue(throwError(() => ({ status, mensaje: 'No autorizado', errores: {} })));
      c.consultar(71); fixture.detectChanges(); expect(c.evaluacion()).toBeNull(); expect(fixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
      c.revisar(); expect(docs.revisarOrigen).not.toHaveBeenCalled();
    });
  }
});
