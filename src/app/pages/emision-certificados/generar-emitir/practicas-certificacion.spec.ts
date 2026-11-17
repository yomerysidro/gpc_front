import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of, Subject, throwError } from 'rxjs';
import { PracticeService } from '../../../core/services/practice/practice.service';
import { DocumentosDigitalesService } from '../../../core/services/emision-certificados/documentos-digitales.service';
import { PrepararPracticaComponent } from './preparar-practica.component';
import { PracticasCertificacionComponent } from './practicas-certificacion.component';
import { EmisionCertificadosService } from '../../../core/services/emision-certificados/emision-certificados.service';
import { estadoCatalogo, estadoDocumentalPractica } from '../../../core/interfaces/emision-certificados/catalogo-certificados.interface';

const practica = () => ({ origen: 'practica', id_origen: 12, id_persona: 4, id_tipo_certificado: 3,
  mensaje: 'Texto propio de prácticas', mensaje_predeterminado: 'Texto propio de prácticas', texto_editable: true,
  finalizacion_registrada: true, situacion_constancia: 'finalizada_elegible', estado_elegibilidad: 'Elegible',
  puede_preparar: true, puede_generar_pdf: true, motivos_bloqueo: [], certificados_existentes: [],
  practica: { nombres: 'Ana', estado: 'FINALIZADO', carrera: 'Sistemas', fecha_inicio: '2026-01-01', fecha_fin: '2026-03-01' } });

describe('Presentación de Datos y Mensaje de prácticas', () => {
  const mensaje = 'Por haber realizado sus prácticas en el área municipal.\nPeriodo acreditado.';
  let documentos: jasmine.SpyObj<DocumentosDigitalesService>;
  beforeEach(() => {
    documentos = jasmine.createSpyObj('Documentos', ['revisarOrigen', 'guardarOrigen', 'confirmarEnvio', 'obtenerRevisionEnvio']);
    documentos.revisarOrigen.and.returnValue(of({ token: 'revision', hash: 'hash', expiresAt: '2099-01-01T00:00:00Z',
      archivo: { blob: new Blob(), nombre: 'practica.pdf' }, mensaje }));
    const evaluacion = { ...practica(), mensaje, mensaje_predeterminado: mensaje, tipo_certificado: 'Prácticas',
      practica: { ...practica().practica, institucion: 'Universidad', area: 'Desarrollo Social' },
      supervisores: [{ nombres: 'Supervisor que no debe mostrarse', fecha_inicio: '2026-02-01' }] };
    TestBed.configureTestingModule({ providers: [
      provideRouter([{ path: 'practicas/:practicaId/preparar', component: PrepararPracticaComponent }]),
      { provide: PracticeService, useValue: { evaluar: () => of(evaluacion) } },
      { provide: DocumentosDigitalesService, useValue: documentos },
    ] });
  });
  it('muestra una sola tarjeta con el beneficiario y sin supervisión aunque la API la entregue', async () => {
    const h = await RouterTestingHarness.create('/practicas/12/preparar');
    const vista = h.routeNativeElement!;
    expect(vista.querySelectorAll('.ficha-reconocimiento').length).toBe(1);
    for (const dato of ['Ana', 'Prácticas', 'Universidad', 'Área municipal', 'Desarrollo Social', 'Sistemas', '2026-01-01', '2026-03-01', 'Finalizado', 'Elegible']) {
      expect(vista.textContent).toContain(dato);
    }
    expect(vista.textContent).not.toContain('Supervisor que no debe mostrarse');
    expect(vista.textContent).not.toContain('Supervisión registrada');
    expect(documentos.revisarOrigen).not.toHaveBeenCalled();
  });
  it('muestra el texto real editable inmediatamente y lo conserva al navegar sin generar PDF', async () => {
    const h = await RouterTestingHarness.create('/practicas/12/preparar');
    const vista = h.routeNativeElement!;
    (vista.querySelector('.acciones-paso .btn-primary') as HTMLButtonElement).click(); h.detectChanges();
    const textarea = vista.querySelector('textarea')!;
    expect(textarea.value).toBe(mensaje); expect(textarea.readOnly).toBeFalse();
    textarea.value = 'Mensaje personalizado'; textarea.dispatchEvent(new Event('input')); h.detectChanges();
    (vista.querySelector('.acciones-paso .btn') as HTMLButtonElement).click(); h.detectChanges();
    (vista.querySelector('.acciones-paso .btn-primary') as HTMLButtonElement).click(); h.detectChanges();
    expect(vista.querySelector('textarea')!.value).toBe('Mensaje personalizado');
    expect(documentos.revisarOrigen).not.toHaveBeenCalled();
    expect(documentos.guardarOrigen).not.toHaveBeenCalled(); expect(documentos.confirmarEnvio).not.toHaveBeenCalled();
  });
  it('el paso 4 tiene un único botón de envío sin otro visor ni confirmación visual', async () => {
    const h = await RouterTestingHarness.create('/practicas/12/preparar');
    const c = h.routeDebugElement!.componentInstance as any;
    c.documento.set({ id_certificado_documento: 22, estado_certificado: 'PREPARADO', hash_pdf: 'hash', facultades: { remitir: true } });
    c.paso.set(4); h.detectChanges();
    documentos.obtenerRevisionEnvio.and.returnValue(of({ token: 'envio', hash: 'hash', expiresAt: '2099-01-01T00:00:00Z', archivo: { blob: new Blob(), nombre: 'pdf.pdf' } }));
    documentos.confirmarEnvio.and.returnValue(new Subject());
    const botones = h.routeNativeElement!.querySelectorAll<HTMLButtonElement>('.contenido-paso button');
    expect(botones.length).toBe(1); expect(botones[0].textContent?.trim()).toBe('Enviar a Gerencia');
    botones[0].click(); h.detectChanges(); botones[0].click();
    expect(documentos.obtenerRevisionEnvio).toHaveBeenCalledTimes(1); expect(documentos.confirmarEnvio).toHaveBeenCalledTimes(1);
    expect(botones[0].disabled).toBeTrue(); expect(h.routeNativeElement!.querySelector('app-visor-pdf')).toBeNull();
    expect(h.routeNativeElement!.textContent).not.toContain('Confirmar envío');
  });
});

describe('Prácticas: contrato HTTP', () => {
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  it('lee data.practicas sin calcular elegibilidad por fecha', () => {
    const activa = { ...practica(), finalizacion_registrada: false, puede_preparar: false };
    TestBed.inject(PracticeService).evaluaciones().subscribe(filas => expect(filas).toEqual([activa] as any));
    http.expectOne('/api/practices/evaluacion-certificacion').flush({ success: true, data: { practicas: [activa] } });
  });
  it('finaliza con cuerpo vacío y conserva el conflicto del servidor', () => {
    TestBed.inject(PracticeService).finalizar(12).subscribe({ next: () => fail('No debe finalizar'), error: e => {
      expect(e.status).toBe(409); expect(e.error.data.motivos_bloqueo).toEqual(['Falta supervisión']);
    } });
    const r = http.expectOne('/api/practices/12/finalizar');
    expect(r.request.method).toBe('POST'); expect(r.request.body).toEqual({});
    r.flush({ message: 'No se puede finalizar', data: { motivos_bloqueo: ['Falta supervisión'] } }, { status: 409, statusText: 'Conflict' });
  });
  it('recupera con GET y no prepara ni descarga un PDF', () => {
    TestBed.inject(DocumentosDigitalesService).consultarPractica(12).subscribe();
    const r = http.expectOne('/api/certificaciones/practica/12/preparar?accion=consultar_preparacion');
    expect(r.request.method).toBe('GET'); r.flush({ success: true, data: practica() });
  });
  it('revisa enviando solo accion y mensaje, sin motivo ni datos del beneficiario', () => {
    TestBed.inject(DocumentosDigitalesService).revisarOrigen('practica', 12, undefined, 'Mensaje personalizado').subscribe({ error: () => {} });
    const r = http.expectOne('/api/certificaciones/practica/12/preparar');
    expect(r.request.body).toEqual({ accion: 'revisar_documento', mensaje: 'Mensaje personalizado' });
    r.flush({ message: 'Revisión de prueba detenida' }, { status: 409, statusText: 'Conflict' });
  });
  it('confirma con el mismo mensaje aprobado y el token correspondiente', () => {
    const revision = { mensaje: 'Texto aprobado', token: 'a'.repeat(64), hash: 'b'.repeat(64), expiresAt: '', archivo: { blob: new Blob(), nombre: '' } };
    TestBed.inject(DocumentosDigitalesService).guardarOrigen(practica() as any, revision).subscribe({ error: () => {} });
    const r = http.expectOne('/api/certificaciones/practica/12/preparar');
    expect(r.request.body).toEqual({ accion: 'confirmar_preparacion', mensaje: 'Texto aprobado', token_revision: revision.token, confirmar: true });
    r.flush({ message: 'Token vencido' }, { status: 409, statusText: 'Conflict' });
  });
});

describe('Asistente de prácticas: continuidad y envío explícito', () => {
  let c: any; let docs: any; let api: any; let router: any;
  const archivo = { blob: new Blob(['%PDF-test']), nombre: 'practica.pdf' };
  const revision = { token: 'token', archivo, hash: 'hash', mensaje: 'Texto propio de prácticas', expiresAt: new Date(Date.now() + 60000).toISOString() };
  const documento = { origen: 'practica', id_practica: 12, id_certificado_documento: 22, id_tipo_certificado: 3, mensaje_aprobado: revision.mensaje,
    beneficiario: { id_persona: 4 }, estado_certificado: 'PREPARADO', facultades: { remitir: true } };
  beforeEach(() => {
    docs = jasmine.createSpyObj('Documentos', ['revisarOrigen', 'guardarOrigen', 'consultarPractica', 'archivo', 'obtenerRevisionEnvio', 'confirmarEnvio']);
    docs.revisarOrigen.and.returnValue(of(revision)); docs.guardarOrigen.and.returnValue(of(documento));
    docs.consultarPractica.and.returnValue(of(documento)); docs.archivo.and.returnValue(of(archivo));
    docs.obtenerRevisionEnvio.and.returnValue(of(revision));
    docs.confirmarEnvio.and.returnValue(of({ ...documento, estado_certificado: 'PENDIENTE_FIRMA' }));
    api = jasmine.createSpyObj('Practicas', ['evaluar', 'evaluaciones']);
    api.evaluar.and.returnValue(of(practica()));
    router = { getCurrentNavigation: () => ({ trigger: 'imperative', extras: { state: { practica: practica() } } }), navigate: jasmine.createSpy() };
    TestBed.configureTestingModule({ providers: [
      { provide: DocumentosDigitalesService, useValue: docs }, { provide: PracticeService, useValue: api },
      { provide: EmisionCertificadosService, useValue: { catalogoAutorizado: () => of([]) } },
      { provide: Router, useValue: router }, { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '12' } } } },
    ] });
  });
  function iniciar() { c = TestBed.runInInjectionContext(() => new PrepararPracticaComponent()); }
  it('abre Datos sin consultar listas, ponentes ni preparar documentos', () => {
    iniciar(); expect(c.paso()).toBe(1); expect(c.nombre()).toBe('Ana');
    expect(api.evaluar).not.toHaveBeenCalled(); expect(api.evaluaciones).not.toHaveBeenCalled();
    expect(docs.revisarOrigen).not.toHaveBeenCalled(); expect(docs.consultarPractica).not.toHaveBeenCalled();
  });
  it('reutiliza la revisión al retroceder y solo envía al confirmar explícitamente', () => {
    iniciar(); c.siguiente(); expect(c.paso()).toBe(2); expect(c.revision()).toBeNull();
    c.siguiente(); expect(c.revision().mensaje).toBe('Texto propio de prácticas');
    c.anterior(); c.siguiente();
    expect(docs.revisarOrigen).toHaveBeenCalledTimes(1);
    c.visualizado.set(archivo); c.confirmar(); c.siguiente();
    expect(c.paso()).toBe(4); expect(docs.guardarOrigen).toHaveBeenCalledTimes(1);
    expect(docs.confirmarEnvio).not.toHaveBeenCalled();
    c.enviar(); expect(docs.obtenerRevisionEnvio).toHaveBeenCalledTimes(1); expect(docs.confirmarEnvio).toHaveBeenCalledTimes(1);
    expect(c.documento().estado_certificado).toBe('PENDIENTE_FIRMA');
  });
  it('impide solicitudes duplicadas mientras está revisando', () => {
    docs.revisarOrigen.and.returnValue(new Subject()); iniciar(); c.siguiente(); c.siguiente(); c.renovarRevision();
    expect(docs.revisarOrigen).toHaveBeenCalledTimes(1);
  });
  it('recupera preparación existente sin generar otra revisión ni PDF', () => {
    router.getCurrentNavigation = () => ({ trigger: 'imperative', extras: { state: { practica: { ...practica(), certificados_existentes: [{ id_certificado: 5 }] } } } });
    iniciar(); expect(c.paso()).toBe(1); expect(docs.consultarPractica).toHaveBeenCalledTimes(1);
    c.siguiente(); c.siguiente(); c.anterior(); c.siguiente();
    expect(docs.archivo).toHaveBeenCalledTimes(1); expect(docs.revisarOrigen).not.toHaveBeenCalled(); expect(docs.guardarOrigen).not.toHaveBeenCalled();
  });
  it('recarga con evaluación individual, sin consultar toda la lista', () => {
    router.getCurrentNavigation = () => null; iniciar();
    expect(api.evaluar).toHaveBeenCalledOnceWith(12); expect(api.evaluaciones).not.toHaveBeenCalled();
  });
  it('muestra el motivo real de bloqueo y permite reintentar la consulta', () => {
    docs.revisarOrigen.and.returnValue(throwError(() => ({ status: 409, mensaje: 'Supervisión no acreditada', errores: {} })));
    iniciar(); c.siguiente(); c.siguiente(); expect(c.error()).toBe('Supervisión no acreditada');
    docs.revisarOrigen.and.returnValue(of(revision)); c.reintentar(); expect(c.paso()).toBe(3);
  });
  it('no permite preparar prácticas activas ni bloqueadas', () => {
    iniciar(); c.evaluacion.set({ ...practica(), finalizacion_registrada: false }); c.siguiente();
    expect(c.paso()).toBe(2);
    c.evaluacion.set({ ...practica(), puede_preparar: false, puede_generar_pdf: false, motivos_bloqueo: ['Falta supervisión'] }); c.siguiente();
    expect(docs.revisarOrigen).not.toHaveBeenCalled();
  });
  it('la tabla bloquea la navegación de una práctica activa', () => {
    api.evaluaciones.and.returnValue(of([]));
    const tabla: any = TestBed.runInInjectionContext(() => new PracticasCertificacionComponent());
    tabla.abrir({ ...practica(), finalizacion_registrada: false }); expect(router.navigate).not.toHaveBeenCalled();
  });
  it('no impone supervisión ni cobertura cuando Laravel autoriza la certificación', () => {
    iniciar();
    c.evaluacion.set({ ...practica(), supervisores: [], supervision_acreditada: false, periodo_supervision_cubierto: false });
    expect(c.puedeAvanzar()).toBeTrue(); c.siguiente(); c.siguiente(); expect(c.paso()).toBe(3);
    expect(docs.revisarOrigen).toHaveBeenCalledOnceWith('practica', 12, undefined, revision.mensaje);
  });
  it('conserva una asignación parcial como información sin completar fechas', () => {
    iniciar();
    const supervisor = { nombres: 'Lucía', apellido_paterno: 'Pérez', apellido_materno: null,
      tipo_supervision: 'Académica', fecha_inicio: '2026-02-15', fecha_fin: null, estado: 'Activo' };
    c.evaluacion.set({ ...practica(), supervisores: [supervisor], periodo_supervision_cubierto: false });
    c.siguiente(); expect(c.paso()).toBe(2);
    expect(c.evaluacion().supervisores).toEqual([supervisor]);
    expect(c.evaluacion().supervisores[0].fecha_fin).toBeNull();
  });
  it('confía en los permisos del servidor sin añadir un veto por el texto de un motivo', () => {
    api.evaluaciones.and.returnValue(of([]));
    const tabla: any = TestBed.runInInjectionContext(() => new PracticasCertificacionComponent());
    tabla.abrir({ ...practica(), motivos_bloqueo: ['Observación de supervisión'] });
    expect(router.navigate).toHaveBeenCalled();
  });
  it('consulta el mensaje sin PDF solo si no está en la evaluación y permite pasar a Mensaje inmediatamente', () => {
    const respuesta = new Subject<any>(); docs.consultarPractica.and.returnValue(respuesta);
    router.getCurrentNavigation = () => ({ trigger: 'imperative', extras: { state: { practica: { ...practica(), mensaje: undefined, mensaje_predeterminado: undefined } } } });
    iniciar(); expect(c.paso()).toBe(1); expect(c.ocupado()).toBeFalse(); c.siguiente();
    expect(c.paso()).toBe(2); expect(c.cargandoMensaje()).toBeTrue();
    c.consultarMensaje(); expect(docs.consultarPractica).toHaveBeenCalledTimes(1);
    respuesta.next(practica()); respuesta.complete();
    expect(c.mensajeCertificado.value).toBe(revision.mensaje);
    expect(docs.revisarOrigen).not.toHaveBeenCalled();
  });
  it('no sobrescribe escritura con una respuesta ligera tardía', () => {
    const respuesta = new Subject<any>(); docs.consultarPractica.and.returnValue(respuesta);
    router.getCurrentNavigation = () => ({ trigger: 'imperative', extras: { state: { practica: { ...practica(), mensaje: undefined, mensaje_predeterminado: undefined } } } });
    iniciar(); c.siguiente(); c.mensajeCertificado.setValue('Mi mensaje');
    respuesta.next(practica()); respuesta.complete();
    expect(c.mensajeCertificado.value).toBe('Mi mensaje'); expect(c.paso()).toBe(2);
  });
  it('no revisa PDF por escribir y valida Unicode, texto vacío, HTML y caracteres de control', () => {
    iniciar(); c.siguiente();
    for (const valor of ['', '  ', '\u200b', '<b>Texto</b>', 'Texto\u202e', 'a'.repeat(1201)]) {
      c.mensajeCertificado.setValue(valor); c.siguiente(); expect(c.paso()).toBe(2); expect(c.mensajeCertificado.invalid).toBeTrue();
    }
    c.mensajeCertificado.setValue('😀'.repeat(1200)); expect(c.caracteresMensaje()).toBe(1200); expect(c.mensajeCertificado.valid).toBeTrue();
    expect(docs.revisarOrigen).not.toHaveBeenCalled(); expect(docs.guardarOrigen).not.toHaveBeenCalled();
  });
  it('revisa el texto editado, invalida token y PDF al cambiarlo y solo confirma la revisión actual', () => {
    docs.revisarOrigen.and.callFake((_origen: string, _id: number, _sesion: unknown, mensaje: string) => of({ ...revision, mensaje, token: mensaje }));
    iniciar(); c.siguiente(); c.mensajeCertificado.setValue('Primero'); c.siguiente();
    expect(c.revision().mensaje).toBe('Primero'); c.visualizado.set(archivo);
    c.anterior(); c.mensajeCertificado.setValue('Segundo');
    expect(c.revision()).toBeNull(); expect(c.archivo()).toBeNull(); expect(c.visualizado()).toBeNull();
    c.confirmar(); expect(docs.guardarOrigen).not.toHaveBeenCalled();
    c.siguiente(); expect(c.revision().mensaje).toBe('Segundo');
    c.visualizado.set(archivo); c.confirmar();
    expect(docs.guardarOrigen.calls.mostRecent().args[1].mensaje).toBe('Segundo');
    expect(docs.guardarOrigen.calls.mostRecent().args[1].token).toBe('Segundo');
  });
  it('espera confirmación HTTP y conserva el texto cuando falla la revisión', () => {
    docs.revisarOrigen.and.returnValue(throwError(() => ({ status: 422, mensaje: 'El mensaje no cabe en una página.', errores: {} })));
    iniciar(); c.siguiente(); c.mensajeCertificado.setValue('Mi mensaje'); c.siguiente();
    expect(c.mensajeCertificado.value).toBe('Mi mensaje'); expect(c.documento()).toBeNull();
    docs.revisarOrigen.and.returnValue(of({ ...revision, mensaje: 'Mi mensaje' })); c.reintentar();
    const respuesta = new Subject<any>(); docs.guardarOrigen.and.returnValue(respuesta);
    c.visualizado.set(archivo); c.confirmar(); expect(c.ocupado()).toBeTrue();
    c.siguiente(); expect(c.paso()).toBe(3); expect(docs.confirmarEnvio).not.toHaveBeenCalled();
    respuesta.next({ ...documento, mensaje_aprobado: 'Mi mensaje' }); respuesta.complete();
    expect(c.documento().mensaje_aprobado).toBe('Mi mensaje'); expect(c.ocupado()).toBeFalse();
  });
  it('un token rechazado obliga a consultar antes de revisar otra vez y conserva el borrador', () => {
    iniciar(); c.siguiente(); c.siguiente(); c.visualizado.set(archivo);
    docs.guardarOrigen.and.returnValue(throwError(() => ({ status: 409, mensaje: 'La revisión fue reemplazada.', errores: {} })));
    c.confirmar(); expect(c.revision()).toBeNull(); expect(c.documento()).toBeNull();
    docs.consultarPractica.and.returnValue(of(practica())); c.reintentar();
    expect(c.paso()).toBe(2); expect(c.mensajeCertificado.value).toBe(revision.mensaje);
    c.siguiente(); expect(docs.revisarOrigen).toHaveBeenCalledTimes(2);
  });
  it('recupera mensaje persistido y mantiene el documento sin revisar ni duplicar', () => {
    docs.consultarPractica.and.returnValue(of({ ...documento, mensaje_aprobado: 'Texto histórico aprobado', hash_pdf: 'hash-original', url_documento: '/api/certificados-documentos/22/archivo?flujo=firmas' }));
    router.getCurrentNavigation = () => ({ trigger: 'imperative', extras: { state: { practica: { ...practica(), certificados_existentes: [{ id_certificado: 5 }] } } } });
    iniciar(); expect(c.paso()).toBe(1); expect(c.mensajeCertificado.value).toBe('Texto histórico aprobado');
    c.siguiente(); c.siguiente(); c.anterior(); c.siguiente();
    expect(docs.archivo).toHaveBeenCalledOnceWith(22, false, 'hash-original');
    expect(docs.revisarOrigen).not.toHaveBeenCalled(); expect(docs.guardarOrigen).not.toHaveBeenCalled();
  });
  it('confirma una sola vez y avanza al paso 4 automáticamente sin crear un quinto paso', () => {
    iniciar(); c.siguiente(); c.siguiente(); c.visualizado.set(archivo); c.confirmar(); c.confirmar();
    expect(docs.guardarOrigen).toHaveBeenCalledTimes(1); expect(c.paso()).toBe(4);
    c.siguiente(); expect(c.paso()).toBe(4); expect(docs.confirmarEnvio).not.toHaveBeenCalled();
  });
  it('resuelve revisión y token dentro de un único envío, sin solicitudes duplicadas', () => {
    const respuesta = new Subject<any>(); docs.confirmarEnvio.and.returnValue(respuesta);
    iniciar(); c.siguiente(); c.siguiente(); c.visualizado.set(archivo); c.confirmar();
    c.enviar(); c.enviar();
    expect(c.ocupado()).toBeTrue(); expect(c.documento().estado_certificado).toBe('PREPARADO');
    expect(docs.obtenerRevisionEnvio).toHaveBeenCalledTimes(1); expect(docs.confirmarEnvio).toHaveBeenCalledTimes(1);
    respuesta.next({ ...documento, estado_certificado: 'PENDIENTE_FIRMA' }); respuesta.complete();
    c.enviar(); expect(docs.confirmarEnvio).toHaveBeenCalledTimes(1); expect(c.estadoDocumento()).toBe('Pendiente de firma');
  });
  it('no reabre el asistente ni consulta la práctica si el contexto ya indica envío', () => {
    router.getCurrentNavigation = () => ({ trigger: 'imperative', extras: { state: { practica: { ...practica(), certificados_existentes: [{ id_certificado: 5, id_certificado_documento: 22, estado: 'PENDIENTE_FIRMA' }] } } } });
    iniciar();
    expect(router.navigate).toHaveBeenCalledWith(['/certificaciones/certificados', 5, 'documentos', 22, 'visor'], { replaceUrl: true, queryParams: { origen: 'practicas' } });
    expect(api.evaluar).not.toHaveBeenCalled(); expect(docs.consultarPractica).not.toHaveBeenCalled(); expect(docs.revisarOrigen).not.toHaveBeenCalled();
  });
});

describe('Estados documentales de prácticas: presentación única', () => {
  const d = { id_certificado_documento: 22, estado_certificado: 'PENDIENTE_FIRMA', pdf_confirmado: false, disponible_rrhh: false };
  for (const [datos, esperado] of [
    [{ ...d, estado_certificado: 'PREPARADO' }, 'Pendiente de envío a Gerencia'],
    [d, 'Pendiente de firma'],
    [{ ...d, pdf_confirmado: true }, 'Pendiente de firma'],
    [{ ...d, disponible_rrhh: true }, 'Pendiente de firma'],
    [{ ...d, pdf_confirmado: true, disponible_rrhh: true }, 'Certificado confirmado'],
    [{ ...d, estado_certificado: 'ANULADO', pdf_confirmado: true, disponible_rrhh: true }, 'Anulado'],
    [{ ...d, estado_documental: 'Anulado' }, 'Anulado'],
    [{ ...d, estado_certificado: 'PREPARADO', disponible_rrhh: true }, 'Estado documental por verificar'],
    [{ ...d, estado_flujo: 'PREPARADO' }, 'Estado documental por verificar'],
  ] as const) {
    it('muestra el mismo estado en Generar y emitir y Certificados emitidos: ' + esperado + ' ' + JSON.stringify(datos), () => {
      expect(estadoDocumentalPractica(datos)).toBe(esperado);
      expect(estadoCatalogo({ ...datos, origen: 'practica' } as any)).toBe(esperado);
    });
  }
});

describe('Tabla de prácticas: continuar preparación o abrir el visor existente', () => {
  let router: { navigate: jasmine.Spy }; let api: any; let catalogo: any;
  const fila = (estado: string, id = 12) => ({ ...practica(), id_origen: id,
    certificados_existentes: [{ id_certificado: id + 100, id_certificado_documento: id + 200, estado }] });
  const documento = (id = 12, confirmado = false) => ({ id_certificado: id + 100, id_certificado_documento: id + 200,
    id_persona: 4, id_practica: id, estado_certificado: 'PENDIENTE_FIRMA', pdf_confirmado: confirmado, disponible_rrhh: confirmado });
  beforeEach(() => {
    router = { navigate: jasmine.createSpy() };
    api = { evaluaciones: jasmine.createSpy().and.returnValue(of([])) };
    catalogo = { catalogoAutorizado: jasmine.createSpy().and.returnValue(of([])) };
    TestBed.configureTestingModule({ providers: [
      { provide: Router, useValue: router }, { provide: PracticeService, useValue: api }, { provide: EmisionCertificadosService, useValue: catalogo },
    ] });
  });
  function tabla(filas: any[]) {
    api.evaluaciones.and.returnValue(of(filas));
    return TestBed.runInInjectionContext(() => new PracticasCertificacionComponent()) as any;
  }
  it('una práctica elegible sin certificado abre la preparación', () => {
    const e = practica(); const t = tabla([e]); t.abrir(e);
    expect(t.estado(e)).toBe('Pendiente de preparación');
    expect(router.navigate).toHaveBeenCalledWith(['/certificaciones/generar-emitir/practicas', 12, 'preparar'], { state: { practica: e } });
    expect(catalogo.catalogoAutorizado).not.toHaveBeenCalled();
  });
  it('PREPARADO ofrece continuar y no equivale a disponible para entrega', () => {
    const e = fila('PREPARADO'); const t = tabla([e]);
    expect(t.estado(e)).toBe('Pendiente de envío a Gerencia'); expect(t.accion(e)).toBe('Continuar preparación'); t.abrir(e);
    expect(router.navigate).toHaveBeenCalledWith(['/certificaciones/generar-emitir/practicas', 12, 'preparar'], { state: { practica: e } });
    expect(catalogo.catalogoAutorizado).not.toHaveBeenCalled();
  });
  it('consulta el catálogo una sola vez por tipo y abre solo el visor para enviados y confirmados', () => {
    const pendiente = fila('PENDIENTE_FIRMA'); const confirmado = fila('PENDIENTE_FIRMA', 13);
    catalogo.catalogoAutorizado.and.returnValue(of([documento(), documento(13, true)]));
    const t = tabla([pendiente, confirmado]);
    expect(catalogo.catalogoAutorizado).toHaveBeenCalledOnceWith({ id_tipo_certificado: '3' }, 'certificados-documentos');
    expect(t.estado(pendiente)).toBe('Pendiente de firma'); expect(t.accion(pendiente)).toBe('En revisión por Gerencia');
    expect(t.estado(confirmado)).toBe('Certificado confirmado'); expect(t.accion(confirmado)).toBe('Ver certificado');
    t.abrir(confirmado);
    expect(router.navigate).toHaveBeenCalledWith(['/certificaciones/certificados', 113, 'documentos', 213, 'visor'], { queryParams: { origen: 'practicas' } });
    expect(api.evaluaciones).toHaveBeenCalledTimes(1); expect(catalogo.catalogoAutorizado).toHaveBeenCalledTimes(1);
  });
  it('Anulado no permite volver a preparar ni enviar', () => {
    const e = fila('ANULADO'); const t = tabla([e]);
    expect(t.estado(e)).toBe('Anulado'); expect(t.puedeAbrirExistente(e)).toBeFalse(); t.abrir(e);
    expect(router.navigate).not.toHaveBeenCalled();
  });
  it('no interpreta indicadores contradictorios como una confirmación', () => {
    const e = fila('PENDIENTE_FIRMA');
    catalogo.catalogoAutorizado.and.returnValue(of([{ ...documento(), estado_flujo: 'PREPARADO', pdf_confirmado: true, disponible_rrhh: true }]));
    const t = tabla([e]); expect(t.estado(e)).toBe('Estado documental por verificar'); t.abrir(e);
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
