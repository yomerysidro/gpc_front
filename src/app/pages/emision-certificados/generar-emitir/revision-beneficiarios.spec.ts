import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { GenerarEmitirComponent } from './generar-emitir.component';
import { AuthService } from '../../../core/services/autenticacion/auth.service';

describe('Revisión de beneficiarios sin preparación persistente', () => {
  let http: HttpTestingController;
  const pagina = (data: unknown[]) => ({ data, current_page: 1, last_page: 1, per_page: 20, total: data.length });
  const actividad = { id_actividad: 7, nombre: 'Actividad registrada', estado: 'Activa', sede: 'Lugar del servidor' };
  const sesion = { id_actividad_sesion: 15, id_actividad: 7, nombre: 'Sesión N.° 001', estado: 'Finalizada', fecha: '2026-11-09' };
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(),
      { provide: AuthService, useValue: { tienePermiso: () => true } }] });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  it('documento 6: abre el certificado 5 preparado de sesión 002 y envía una vez con el token de la API', async () => {
    // IDs documental/certificado del caso indicado; el resto son fixtures, sin escrituras reales.
    const f = iniciar(); const c = f.componentInstance as any;
    const anterior = c.evaluacion();
    const b = { ...anterior.beneficiarios.data[0], id_sesion: 16, id_actividad_sesion: 16,
      id_certificado: 5, id_certificado_documento: 6, nombre_completo: 'Antón Talián' };
    const r = { ...anterior, contexto: { ...anterior.contexto, id_sesion: 16, nombre_sesion: 'Sesión N.º 002' }, beneficiarios: { ...anterior.beneficiarios, data: [b] } };
    c.destinoBeneficiarios = { origen: 'sesion', actividad: 7, sesion: 16 };
    c.evaluacion.set(r); f.detectChanges(); flushPonentes(16);
    expect(f.nativeElement.querySelector('.beneficiarios-certificacion')!.textContent).not.toContain('Preparar certificado');
    pulsar(f, 'Ver certificado');
    const hash = '4f1949e95440af0ece666ebd5f399c1d77d22de639950784d349fa5feb47dca5';
    const doc = { id_certificado: 5, id_certificado_documento: 6, id_sesion: 16, id_tipo_certificado: 4, id_actividad: 7,
      estado_certificado: 'PREPARADO', disponible_rrhh: false, hash_pdf: hash, beneficiario: { id_persona: 40 }, facultades: { remitir: true, descargar: true } };
    http.expectOne('/api/certificados-documentos/detail/6?flujo=firmas').flush({ success: true, data: doc }); f.detectChanges();
    http.expectOne('/api/certificados-documentos/6/firma/pdf-autorizado').flush(new Blob(['%PDF-1.4\n%%EOF'], { type: 'application/pdf' }));
    expect(f.nativeElement.textContent).not.toContain('Listo para entrega');
    pulsar(f, 'Enviar a Gerencia'); pulsar(f, 'Enviar a Gerencia');
    http.expectOne('/api/certificados-documentos/6/revisar-envio').flush({ success: true, data: {
      documento: doc, token_revision: 'revision-autorizada', expires_at: new Date(Date.now() + 60000).toISOString(),
      vista_previa_pdf: { contenido_base64: btoa('%PDF-1.4\n%%EOF'), tipo_contenido: 'application/pdf', nombre_archivo: 'certificado.pdf', persistido: true },
    } });
    let enviado = false;
    for (let i = 0; i < 100 && !enviado; i++) {
      await new Promise(resolve => setTimeout(resolve, 5));
      const envios = http.match(req => req.url === '/api/certificados-documentos/6/enviar-gerencia');
      if (!envios.length) continue;
      expect(envios.length).toBe(1); expect(envios[0].request.body).toEqual({ token_revision: 'revision-autorizada', confirmar: true });
      envios[0].flush({ success: true, data: { enviado: true, estado_flujo: 'PENDIENTE_FIRMA' } }); enviado = true;
    }
    expect(enviado).toBeTrue();
    http.expectOne('/api/certificados-documentos/detail/6?flujo=firmas').flush({ success: true, data: { ...doc, estado_certificado: 'PENDIENTE_FIRMA', facultades: { remitir: false, descargar: true } } });
    http.expectOne(req => req.url === '/api/activity-session/16/beneficiarios').flush({ success: true, data: { ...r, beneficiarios: pagina([]) } });
    http.expectOne(req => req.url === '/api/certificaciones/pendientes').flush({ success: true, data: pagina([]) }); f.detectChanges();
    http.expectOne('/api/certificados-documentos/6/firma/pdf-autorizado').flush(new Blob(['%PDF-1.4\n%%EOF'], { type: 'application/pdf' }));
    expect(f.nativeElement.textContent).toContain('Enviado a Gerencia');
    expect(c.puedeRemitir()).toBeFalse();
    http.expectNone(req => req.url.includes('preparar-certificados') || req.url.includes('generar-documento'));
    http.expectNone(req => req.method !== 'GET'); f.destroy();
  });
  for (const [estado, documentoId] of [['PREPARADO', 81], ['PENDIENTE_FIRMA', 81], ['PENDIENTE_FIRMA', 2], ['PENDIENTE_FIRMA', 4], ['PENDIENTE_FIRMA', 5]] as const) {
    it('abre el documento disponible de la sesión seleccionada sin ofrecer otro envío: ' + estado + ' documento ' + documentoId, () => {
      const f = iniciar();
      const c = f.componentInstance as any;
      const anterior = c.evaluacion();
      const b = { ...anterior.beneficiarios.data[0], id_certificado: 51, id_certificado_documento: documentoId };
      const r = { ...anterior, beneficiarios: { ...anterior.beneficiarios, data: [b] } };
      c.evaluacion.set(r); f.detectChanges(); pulsar(f, 'Ver certificado');
      http.expectOne('/api/certificados-documentos/detail/' + documentoId + '?flujo=firmas').flush({ success: true, data: {
        id_certificado: 51, id_certificado_documento: documentoId, id_sesion: 15, id_tipo_certificado: 4, id_actividad: 7,
        estado_certificado: estado, disponible_rrhh: true, beneficiario: { id_persona: 40 },
        facultades: { remitir: true, descargar: true },
      } });
      f.detectChanges();
      http.expectOne('/api/certificados-documentos/' + documentoId + '/firma/pdf-autorizado').flush(new Blob(['%PDF-1.4\n%%EOF'], { type: 'application/pdf' }));
      expect(f.nativeElement.textContent).toContain('Listo para entrega');
      expect(Array.from(f.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>).some(b => b.textContent?.trim() === 'Enviar a Gerencia')).toBeFalse();
      expect(c.puedeRemitir()).toBeFalse();
      http.expectNone(req => req.method !== 'GET'); f.destroy();
    });
  }
  it('documento 9: recupera el envío persistido al reabrir sin reenviar ni retroceder su estado', () => {
    for (let apertura = 0; apertura < 2; apertura++) {
      const f = iniciar(); const c = f.componentInstance as any;
      const anterior = c.evaluacion();
      const b = { ...anterior.beneficiarios.data[0], id_sesion: 5, id_actividad_sesion: 5,
        id_certificado: 8, id_certificado_documento: 9, nombre_completo: 'Maria Perez' };
      const r = { ...anterior, contexto: { ...anterior.contexto, id_sesion: 5, nombre_actividad: 'Capacitación Personal', nombre_sesion: 'Sesión N.º 004' }, beneficiarios: { ...anterior.beneficiarios, data: [b] } };
      c.evaluacion.set(r); f.detectChanges(); pulsar(f, 'Ver certificado');
      const doc = { id_certificado: 8, id_certificado_documento: 9, id_sesion: 5, id_tipo_certificado: 4, id_actividad: 7,
        estado_certificado: 'PENDIENTE_FIRMA', beneficiario: { id_persona: 40, nombre: 'Maria Perez' },
        facultades: { remitir: false, descargar: true } };
      http.expectOne('/api/certificados-documentos/detail/9?flujo=firmas').flush({ success: true, data: doc }); f.detectChanges();
      http.expectOne('/api/certificados-documentos/9/firma/pdf-autorizado').flush(new Blob(['%PDF-1.4\n%%EOF'], { type: 'application/pdf' }));
      expect(f.nativeElement.textContent).toContain('Enviado a Gerencia');
      expect(f.nativeElement.textContent).not.toContain('Certificado preparado');
      expect(Array.from(f.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>).some(b => b.textContent?.trim() === 'Enviar a Gerencia')).toBeFalse();
      expect(c.documentoPreparado().id_certificado_documento).toBe(9); expect(c.enviado()).toBeTrue();
      c.guardarParaFirma(); c.revisarParaEnviar(new MouseEvent('click')); http.expectNone(req => req.method !== 'GET');
      f.destroy();
    }
  });

  function iniciar(cache = true) {
    const f = TestBed.createComponent(GenerarEmitirComponent);
    http.expectOne(req => req.url === '/api/certificaciones/pendientes').flush({ success: true, data: pagina([
      { origen: 'sesion', id_actividad: 7, id_sesion: 15, nombre_actividad: actividad.nombre, nombre_sesion: sesion.nombre,
        estado_sesion: 'Finalizada', total_participantes_inscritos: 2, total_elegibles: 2, total_pendientes: 0, tipos_certificado_permitidos: [4], motivos_bloqueo: [] },
    ]) });
    http.expectOne(req => req.url === '/api/tipos-certificado/list').flush({ success: true, data: pagina([{ id_tipo_certificado: 4, nombre_tipo: 'Tipo del catálogo', estado: true }]) });
    http.expectOne('/api/activity').flush({ success: true, data: cache ? [actividad] : [] });
    http.expectOne('/api/activity-session').flush({ success: true, data: cache ? [sesion] : [] }); f.detectChanges();
    f.nativeElement.querySelector('[aria-label="Consultar beneficiarios"]').click(); f.detectChanges();
    const req = http.expectOne(req => req.url === '/api/activity-session/15/beneficiarios');
    expect(req.request.params.get('id_tipo_certificado')).toBe('4');
    req.flush({ success: true, data: { origen: 'sesion', contexto: { id_actividad: 7, id_sesion: 15, nombre_actividad: actividad.nombre, nombre_sesion: sesion.nombre, estado_sesion: 'Finalizada' },
      finalizada: true, tipo_certificado_compatible: true, puede_preparar: true, identidad_sesion_disponible: false, preparacion_persistida: false,
      contadores: { inscritos_actividad_vigentes: 2, participantes_sesion: 2, presentes: 2, ausentes: 0, pendientes: 0, por_regularizar: null },
      puede_generar_pdf: false, puede_emitir: false, motivos_bloqueo: [], motivos_bloqueo_emision: ['No existe identidad persistente de sesión.'],
      beneficiarios: pagina([30, 31].map((id, i) => ({ id_participacion: id, id_persona: id + 10, id_actividad: 7, id_sesion: 15, id_actividad_sesion: 15,
        nombre_completo: 'Beneficiario ' + (i + 1), estado_asistencia: 'PRESENTE', estado_elegibilidad: 'Elegible', id_tipo_certificado: 4,
        estado_generacion: 'No determinable por esquema', id_certificado: null, id_preparacion: null, motivos: [] }))) } });
    for (const consulta of http.match(r => r.url === '/api/certificados/list')) {
      expect(consulta.request.params.get('id_sesion')).toBe('15');
      expect(consulta.request.params.get('id_tipo_certificado')).toBe('4');
      consulta.flush({ success: true, data: pagina([]) });
    }
    f.detectChanges(); flushPonentes(); return f;
  }
  /** El grupo Ponentes se consulta en paralelo; aquí se confirma su respuesta vacía. */
  function flushPonentes(sesion = 15, actividad = 7): void {
    for (const req of http.match(r => r.url === `/api/activity-session/${sesion}/ponentes-certificacion`)) {
      req.flush({ success: true, data: { origen: 'ponente_sesion', id_actividad: actividad, id_sesion: sesion,
        ponentes_actividad: [], ponentes_sesion: [], relacion_ponente_sesion_disponible: true,
        puede_preparar: false, motivos_bloqueo: [] } });
    }
  }
  function pulsar(f: ReturnType<typeof iniciar>, texto: string, puedePersistir = false) {
    Array.from(f.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>).find(b => (b.getAttribute('aria-label') || b.textContent?.trim()) === texto)!.click(); f.detectChanges();
    if (texto === 'Previsualizar certificado' || texto === 'Actualizar vista previa') {
      for (const req of http.match(r => r.url === '/api/activity-session/15/preparar-certificados')) {
        const body = req.request.body;
        req.flush({ success: true, data: { accion: 'vista_previa', formato: 'pdf', emitida: false, creado: false, mensaje: body.mensaje, mensaje_persistido: false,
          contexto: { id_sesion: 15, id_participacion: body.id_participacion, id_tipo_certificado: 4, id_persona: body.id_participacion + 10, id_actividad: 7 },
          vista_previa_pdf: { contenido_base64: btoa('%PDF-1.4\n%%EOF'), tipo_contenido: 'application/pdf', nombre_archivo: 'vista-previa-certificado.pdf', persistido: false }, puede_emitir: false, siguiente_accion_preparacion: puedePersistir ? 'revisar_documento' : null, motivos_bloqueo_emision: ['Identidad no disponible'] } });
      }
      if (puedePersistir) {
        const revision = http.expectOne('/api/activity-session/15/preparar-certificados');
        expect(revision.request.body.accion).toBe('revisar_documento');
        expect(['Paralela', 'Secuencial']).toContain(revision.request.body.modalidad_firma);
        revision.flush({ success: true, data: { accion: 'revisar_documento', mensaje: revision.request.body.mensaje,
          token_revision: 'preparar', hash_pdf: '4f1949e95440af0ece666ebd5f399c1d77d22de639950784d349fa5feb47dca5',
          expires_at: new Date(Date.now() + 1800000).toISOString(), vista_previa_pdf: {
            contenido_base64: btoa('%PDF-1.4\n%%EOF'), tipo_contenido: 'application/pdf', nombre_archivo: 'certificado.pdf', persistido: false,
          } } });
      }
      f.detectChanges();
    }
  }
  async function esperarOperacion(f: ReturnType<typeof iniciar>) {
    const estado = f.componentInstance as unknown as { operando: () => boolean };
    for (let intento = 0; intento < 100 && (estado.operando() || (f.componentInstance as unknown as { generandoPrevia: () => boolean }).generandoPrevia()); intento++) await new Promise(resolve => setTimeout(resolve, 10));
    expect(estado.operando()).toBeFalse();
    f.detectChanges();
  }
  it('invalida la revision al cambiar el mensaje y conserva la modalidad', async () => {
    const f = iniciar(); pulsar(f, 'Preparar certificado'); pulsar(f, 'Continuar al mensaje');
    expect(f.nativeElement.querySelector('#modalidad-firma-certificado')).toBeNull();
    expect(f.nativeElement.textContent).not.toContain('Ver detalles');
    expect(f.nativeElement.textContent).not.toContain('El mensaje se utilizar');
    pulsar(f, 'Previsualizar certificado', true); await esperarOperacion(f);
    expect(f.nativeElement.textContent).not.toContain('Confirmar preparaci\u00f3n del certificado');
    pulsar(f, 'Volver a editar');
    expect(f.nativeElement.querySelector('#modalidad-firma-certificado')).toBeNull();
    const mensaje: HTMLTextAreaElement = f.nativeElement.querySelector('textarea');
    mensaje.value = 'Mensaje nuevo'; mensaje.dispatchEvent(new Event('input')); f.detectChanges();
    http.expectNone(r => r.method === 'POST'); f.destroy();
  });
  for (const [remitir, modalidadElegida] of [[false, 'Paralela'], [true, 'Paralela'], [true, 'Secuencial']] as const) {
    it('guarda una vez y remite con token interno: ' + remitir + modalidadElegida, async () => {
      const f = iniciar(); const base = '/api/certificados-documentos';
      const hash = '4f1949e95440af0ece666ebd5f399c1d77d22de639950784d349fa5feb47dca5';
      const pdf = { contenido_base64: btoa('%PDF-1.4\n%%EOF'), tipo_contenido: 'application/pdf', nombre_archivo: 'certificado.pdf' };
      pulsar(f, 'Preparar certificado'); pulsar(f, 'Continuar al mensaje');
      expect(f.nativeElement.querySelector('#modalidad-firma-certificado')).toBeNull();
      // Conserva cobertura del contrato para modalidades internas, sin selector inicial.
      (f.componentInstance as any).cambiarModalidad(modalidadElegida); f.detectChanges();
      pulsar(f, 'Previsualizar certificado', true); await esperarOperacion(f);
      pulsar(f, 'Guardar y continuar'); pulsar(f, 'Guardar y continuar');
      const doc = { id_certificado_documento: 81, id_certificado: 51, hash_pdf: hash, id_sesion: 15, id_tipo_certificado: 4, id_actividad: 7, beneficiario: { id_persona: 40, nombre: 'Beneficiario 1' }, estado_certificado: 'PREPARADO', facultades: { remitir } };
      const guardar = http.expectOne('/api/activity-session/15/preparar-certificados');
      expect(guardar.request.body.token_revision).toBe('preparar');
      guardar.flush({ success: true, data: doc });
      http.expectOne(base + '/detail/81?flujo=firmas').flush({ success: true, data: doc });
      // Las consultas relacionadas se actualizan sin cerrar el PDF.
      for (const req of http.match(r => r.url === '/api/certificaciones/pendientes')) req.flush({ success: true, data: pagina([]) });
      for (const req of http.match(r => r.url === '/api/activity-session/15/beneficiarios')) req.flush({ success: true, data: { origen: 'sesion', contexto: { id_actividad: 7, id_sesion: 15 }, beneficiarios: pagina([]) } });
      f.detectChanges();
      http.expectOne(base + '/81/firma/pdf-autorizado').flush(new Blob(['%PDF-1.4\n%%EOF'], { type: 'application/pdf' }));
      expect(f.nativeElement.textContent).toContain('Certificado preparado');
      http.expectNone(r => r.url.endsWith('/revisar-envio') || r.url.endsWith('/enviar-gerencia'));
      const boton = Array.from(f.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>).find(b => b.textContent === 'Enviar a Gerencia')!;
      // Un segundo clic del doble clic que guardó no representa una decisión de envío.
      boton.dispatchEvent(new MouseEvent('click', { detail: 2, bubbles: true })); f.detectChanges();
      http.expectNone(r => r.url.endsWith('/revisar-envio') || r.url.endsWith('/enviar-gerencia'));
      expect(boton.disabled).toBe(!remitir); boton.click(); boton.click(); f.detectChanges();
      if (!remitir) { http.expectNone(r => r.url.includes('revisar-envio')); f.destroy(); return; }
      http.expectOne(base + '/81/revisar-envio').flush({ success: true, data: { documento: doc, token_revision: 'remitir', expires_at: new Date(Date.now() + 1800000).toISOString(), vista_previa_pdf: { ...pdf, persistido: true } } });
      for (let i = 0; i < 100; i++) {
        await new Promise(resolve => setTimeout(resolve, 5));
        const envios = http.match(r => r.url === base + '/81/enviar-gerencia');
        if (!envios.length) continue;
        expect(envios.length).toBe(1); expect(envios[0].request.body.token_revision).toBe('remitir');
        envios[0].flush({ success: true, data: { enviado: true, estado_flujo: 'PENDIENTE_FIRMA' } }); break;
      }
      http.expectOne(base + '/detail/81?flujo=firmas').flush({ success: true, data: { ...doc, estado_certificado: 'PENDIENTE_FIRMA' } });
      for (const req of http.match(r => r.url === '/api/certificaciones/pendientes')) req.flush({ success: true, data: pagina([]) });
      for (const req of http.match(r => r.url === '/api/activity-session/15/beneficiarios')) req.flush({ success: true, data: { origen: 'sesion', contexto: { id_actividad: 7, id_sesion: 15 }, beneficiarios: pagina([]) } });
      f.detectChanges();
      for (const req of http.match(r => r.url === base + '/81/firma/pdf-autorizado')) req.flush(new Blob(['%PDF-1.4\n%%EOF'], { type: 'application/pdf' }));
      expect(f.nativeElement.textContent).toContain('Enviado a Gerencia');
      expect(Array.from(f.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>).some(b => b.textContent === 'Enviar a Gerencia')).toBeFalse();
      f.destroy();
    });
  }
  it('permite revisar dos elegibles finalizados aunque Laravel impida persistir y emitir', () => {
    const f = iniciar(); const botones: HTMLButtonElement[] = Array.from(f.nativeElement.querySelectorAll('button'));
    const revisar = botones.filter(b => b.textContent === 'Preparar certificado');
    expect(revisar.length).toBe(2); expect(revisar.every(b => !b.disabled)).toBeTrue();
    expect(botones.filter(b => b.textContent === 'Generar y emitir').every(b => b.disabled)).toBeTrue();
    expect(f.nativeElement.textContent).toContain('Finalizada'); expect(f.nativeElement.querySelector('.estado-sesion.finalizada').textContent).toBe('Finalizada');
    revisar[0].click(); f.detectChanges();
    expect(f.nativeElement.querySelector('app-visor-certificado')).toBeNull();
    pulsar(f, 'Continuar al mensaje');
    expect(f.nativeElement.querySelector('textarea').value).toContain('09/11/2026');
    pulsar(f, 'Previsualizar certificado'); f.detectChanges();
    expect(f.nativeElement.querySelector('app-visor-pdf')).not.toBeNull();
    expect(f.nativeElement.querySelector('app-visor-certificado')).toBeNull();
    expect(f.nativeElement.textContent).toContain('Borrador pendiente de emisión.');
    expect(f.nativeElement.querySelector('.pasos-beneficiario')).not.toBeNull();
    http.expectNone(() => true); // Solo se solicitó la vista previa; no hay solicitudes adicionales ni emisión.
    Array.from(f.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>).find(b => b.getAttribute('aria-label') === 'Volver a beneficiarios')!.click(); f.detectChanges();
    expect(f.nativeElement.querySelectorAll('.beneficiarios-certificacion tbody tr').length).toBe(2); f.destroy();
  });
  it('refleja estados reales y adapta los indicadores sin desbordar', () => {
    const f = iniciar(); const c = f.componentInstance as any; const r = c.evaluacion();
    c.evaluacion.set({ ...r, contexto: { ...r.contexto, estado_sesion: 'Programada' } }); f.detectChanges();
    expect(f.nativeElement.querySelector('.estado-sesion.finalizada')).toBeNull();
    expect(f.nativeElement.querySelector('.estado-sesion').textContent).toBe('Programada');
    expect(Array.from(f.nativeElement.querySelectorAll('.asistencia-tarjeta strong') as NodeListOf<HTMLElement>).map(e => e.textContent)).toEqual(['2', '2', '2', '0', '0']);
    document.body.appendChild(f.nativeElement);
    for (const ancho of [360, 768, 1200]) {
      f.nativeElement.style.width = ancho + 'px';
      expect(f.nativeElement.querySelector('.asistencia-indicadores').scrollWidth).toBeLessThanOrEqual(ancho);
      expect(f.nativeElement.querySelector('.cabecera-sesion').scrollWidth).toBeLessThanOrEqual(ancho);
    }
    c.evaluacion.set({ ...r, contadores: { ...r.contadores, por_regularizar: 0 } }); f.detectChanges();
    expect(f.nativeElement.querySelector('.aviso-asistencia')).toBeNull(); f.destroy();
  });
  it('retira los bloques administrativos durante la revisión y conserva el PDF original', async () => {
    const crear = spyOn(URL, 'createObjectURL').and.returnValue('blob:original');
    const f = iniciar();
    expect(f.nativeElement.querySelector('.asistencia-tarjeta strong').textContent).toBe('2');
    expect(f.nativeElement.textContent).not.toContain('Disponibilidad de preparación y emisión');
    pulsar(f, 'Preparar certificado');
    const cabecera = f.nativeElement.querySelector('.encabezado-revision');
    expect(cabecera.querySelector('h1').textContent).toBe('Revisar certificado');
    expect(cabecera.textContent).toContain('Beneficiario 1');
    expect(cabecera.textContent).toContain('Actividad registrada');
    expect(cabecera.textContent).toContain('Finalizada');
    expect(f.nativeElement.textContent).not.toContain('inscritos vigentes');
    expect(f.nativeElement.textContent).not.toContain('Disponibilidad de preparación y emisión');
    pulsar(f, 'Continuar al mensaje'); pulsar(f, 'Previsualizar certificado');
    await f.whenStable(); f.detectChanges();
    const blob = crear.calls.mostRecent().args[0] as Blob;
    expect(await blob.text()).toBe('%PDF-1.4\n%%EOF');
    expect(f.nativeElement.querySelector('iframe')).not.toBeNull();
    f.nativeElement.style.width = '360px'; document.body.appendChild(f.nativeElement);
    expect(f.nativeElement.querySelector('iframe').getBoundingClientRect().width).toBeLessThanOrEqual(360);
    expect(f.nativeElement.querySelector('.encabezado-revision').scrollWidth).toBeLessThanOrEqual(360);
    expect(f.nativeElement.querySelector('a[download]').textContent).toBe('Descargar vista previa');
    const botones = Array.from(f.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>).map(b => b.textContent);
    expect(botones).not.toContain('Actualizar vista previa');
    expect(botones).not.toContain('Imprimir PDF');
    expect(botones).toContain('Guardar y continuar');
    pulsar(f, 'Volver a beneficiarios');
    expect(f.nativeElement.querySelector('.asistencia-tarjeta strong').textContent).toBe('2');
    expect(f.nativeElement.textContent).not.toContain('Disponibilidad de preparación y emisión');
    http.expectNone(() => true); f.destroy();
  });
  it('conserva exactamente el mensaje entre pasos y al volver al mismo beneficiario', () => {
    const f = iniciar(); pulsar(f, 'Preparar certificado');
    expect(f.nativeElement.querySelector('textarea, app-visor-certificado')).toBeNull();
    expect(f.nativeElement.querySelector('select')).toBeNull();
    pulsar(f, 'Continuar al mensaje');
    const texto = '  Mensaje corregido\ncon una segunda línea.  ';
    const editor: HTMLTextAreaElement = f.nativeElement.querySelector('textarea'); editor.value = texto; editor.dispatchEvent(new Event('input')); f.detectChanges();
    pulsar(f, 'Previsualizar certificado');
    expect(f.nativeElement.querySelector('app-visor-pdf')).not.toBeNull();
    expect(f.nativeElement.querySelector('.certificado-borrador')).toBeNull();
    pulsar(f, 'Guardar y continuar');
    expect(f.nativeElement.querySelector('app-dialogo dialog').hasAttribute('open')).toBeFalse();
    expect(f.nativeElement.textContent).toContain('Envío a Gerencia no disponible para este documento.');
    pulsar(f, 'Volver a editar'); expect(f.nativeElement.querySelector('textarea').value).toBe(texto);
    pulsar(f, 'Volver a beneficiarios'); pulsar(f, 'Preparar certificado'); pulsar(f, 'Continuar al mensaje');
    expect(f.nativeElement.querySelector('textarea').value).toBe(texto);
    pulsar(f, 'Volver a beneficiarios');
    const otro = Array.from(f.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>).filter(b => b.textContent === 'Preparar certificado')[1];
    otro.click(); f.detectChanges(); pulsar(f, 'Continuar al mensaje');
    expect(f.nativeElement.querySelector('textarea').value).not.toBe(texto);
    http.expectNone(() => true); f.destroy();
  });
  it('mantiene la edición y validación sin controles para borrar o restaurar el mensaje', () => {
    const f = iniciar(); pulsar(f, 'Preparar certificado'); pulsar(f, 'Continuar al mensaje');
    const editor: HTMLTextAreaElement = f.nativeElement.querySelector('textarea');
    const sugerido = editor.value;
    const regreso: HTMLButtonElement = f.nativeElement.querySelector('[aria-label="Volver a beneficiarios"]');
    expect(regreso.title).toBe('Volver a beneficiarios');
    expect(regreso.querySelector('.material-symbols-outlined')?.textContent).toBe('arrow_back');
    expect(f.nativeElement.textContent).not.toContain('Borrar texto');
    expect(f.nativeElement.textContent).not.toContain('Restaurar texto sugerido');
    expect(f.nativeElement.querySelector('#mensaje-ayuda')).toBeNull();
    editor.value = '<script>alert(1)</script>'; editor.dispatchEvent(new Event('input')); f.detectChanges(); pulsar(f, 'Previsualizar certificado');
    expect(f.nativeElement.querySelector('app-visor-certificado')).toBeNull(); expect(f.nativeElement.querySelector('#mensaje-error')).not.toBeNull();
    editor.value = ''; editor.dispatchEvent(new Event('input')); f.detectChanges();
    pulsar(f, 'Previsualizar certificado'); expect(f.nativeElement.querySelector('#mensaje-error')).not.toBeNull();
    editor.value = sugerido; editor.dispatchEvent(new Event('input')); f.detectChanges();
    expect(editor.value).toContain('Actividad registrada'); expect(editor.value).not.toContain('[ACTIVIDAD]'); expect(editor.value).not.toContain('Beneficiario 1');
    http.expectNone(req => req.method !== 'GET'); f.destroy();
  });
  it('impide doble solicitud, cancela al cambiar texto y revoca el PDF anterior al regenerar', () => {
    spyOn(URL, 'createObjectURL').and.returnValues('blob:previa-1', 'blob:previa-2'); const revocar = spyOn(URL, 'revokeObjectURL');
    const f = iniciar(); pulsar(f, 'Preparar certificado'); pulsar(f, 'Continuar al mensaje');
    const boton = Array.from(f.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>).find(b => b.textContent === 'Previsualizar certificado')!;
    boton.click(); f.detectChanges(); boton.click();
    const req = http.expectOne('/api/activity-session/15/preparar-certificados'); expect(boton.disabled).toBeTrue();
    const editor: HTMLTextAreaElement = f.nativeElement.querySelector('textarea'); editor.value = 'Mensaje nuevo'; editor.dispatchEvent(new Event('input')); f.detectChanges();
    expect(req.cancelled).toBeTrue();
    pulsar(f, 'Previsualizar certificado'); f.detectChanges();
    expect(f.nativeElement.querySelector('a[download]')).not.toBeNull();
    pulsar(f, 'Volver a editar'); expect(revocar).toHaveBeenCalledWith('blob:previa-1');
    const nuevo: HTMLTextAreaElement = f.nativeElement.querySelector('textarea'); nuevo.value = 'Mensaje corregido'; nuevo.dispatchEvent(new Event('input')); f.detectChanges();
    expect(f.nativeElement.querySelector('app-visor-pdf')).toBeNull();
    pulsar(f, 'Previsualizar certificado'); f.detectChanges(); f.destroy(); expect(revocar).toHaveBeenCalledWith('blob:previa-2');
    http.expectNone(() => true);
  });
  it('muestra el motivo real de un error de vista previa sin HTML de respaldo ni pérdida del mensaje', () => {
    const f = iniciar(); pulsar(f, 'Preparar certificado'); pulsar(f, 'Continuar al mensaje');
    const mensaje = f.nativeElement.querySelector('textarea').value;
    Array.from(f.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>).find(b => b.textContent === 'Previsualizar certificado')!.click(); f.detectChanges();
    http.expectOne('/api/activity-session/15/preparar-certificados').flush({ message: 'Vista previa bloqueada por Laravel.' }, { status: 409, statusText: 'Conflict' }); f.detectChanges();
    expect(f.nativeElement.querySelector('textarea').value).toBe(mensaje);
    expect(f.nativeElement.querySelector('app-visor-pdf, app-visor-certificado')).toBeNull();
    expect(f.nativeElement.textContent).toContain('Operaci\u00f3n en conflicto o bloqueada.');
    http.expectNone(() => true); f.destroy();
  });
  for (const status of [401, 403, 409, 422]) {
    it('conserva HTTP ' + status + ' al consultar datos de revisión, sin crear registros', () => {
      const f = iniciar(false);
      Array.from(f.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>).find(b => b.textContent === 'Preparar certificado')!.click(); f.detectChanges();
      http.expectOne('/api/activity-session/15').flush({ success: true, data: sesion });
      http.expectOne('/api/activity/7').flush({ message: 'Motivo real de Laravel' }, { status, statusText: 'Error' }); f.detectChanges();
      expect(f.nativeElement.querySelector('[role=alert]')).not.toBeNull();
      expect(f.nativeElement.textContent).not.toContain('HTTP ' + status); expect(f.nativeElement.textContent).not.toContain('Motivo real de Laravel');
      expect(f.nativeElement.querySelector('app-visor-certificado')).toBeNull(); http.expectNone(req => req.method !== 'GET'); f.destroy();
    });
  }
});
