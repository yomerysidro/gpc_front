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
      puede_generar_pdf: false, puede_emitir: false, motivos_bloqueo: [], motivos_bloqueo_emision: ['No existe identidad persistente de sesión.'],
      beneficiarios: pagina([30, 31].map((id, i) => ({ id_participacion: id, id_persona: id + 10, id_actividad: 7, id_sesion: 15, id_actividad_sesion: 15,
        nombre_completo: 'Beneficiario ' + (i + 1), estado_asistencia: 'PRESENTE', estado_elegibilidad: 'Elegible', id_tipo_certificado: 4,
        estado_generacion: 'No determinable por esquema', id_certificado: null, id_preparacion: null, motivos: [] }))) } });
    f.detectChanges(); return f;
  }
  function pulsar(f: ReturnType<typeof iniciar>, texto: string) {
    Array.from(f.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>).find(b => b.textContent?.trim() === texto)!.click(); f.detectChanges();
    if (texto === 'Previsualizar certificado' || texto === 'Actualizar vista previa') {
      for (const req of http.match(r => r.url === '/api/activity-session/15/preparar-certificados')) {
        const body = req.request.body;
        req.flush({ success: true, data: { accion: 'vista_previa', formato: 'pdf', emitida: false, creado: false, mensaje: body.mensaje, mensaje_persistido: false,
          contexto: { id_sesion: 15, id_participacion: body.id_participacion, id_tipo_certificado: 4, id_persona: body.id_participacion + 10, id_actividad: 7 },
          vista_previa_pdf: { contenido_base64: btoa('%PDF-1.4\n%%EOF'), tipo_contenido: 'application/pdf', nombre_archivo: 'vista-previa-certificado.pdf', persistido: false }, puede_emitir: false, motivos_bloqueo_emision: ['Identidad no disponible'] } });
      }
      f.detectChanges();
    }
  }
  it('permite revisar dos elegibles finalizados aunque Laravel impida persistir y emitir', () => {
    const f = iniciar(); const botones: HTMLButtonElement[] = Array.from(f.nativeElement.querySelectorAll('button'));
    const revisar = botones.filter(b => b.textContent === 'Preparar certificado');
    expect(revisar.length).toBe(2); expect(revisar.every(b => !b.disabled)).toBeTrue();
    expect(botones.filter(b => b.textContent === 'Generar y emitir').every(b => b.disabled)).toBeTrue();
    expect(f.nativeElement.textContent).toContain('Finalizada'); expect(f.nativeElement.textContent).toContain('Preparación no disponible');
    revisar[0].click(); f.detectChanges();
    expect(f.nativeElement.querySelector('app-visor-certificado')).toBeNull();
    pulsar(f, 'Continuar al mensaje');
    expect(f.nativeElement.querySelector('textarea').value).toContain('09/11/2026');
    pulsar(f, 'Previsualizar certificado');
    expect(f.nativeElement.querySelector('app-visor-pdf')).not.toBeNull();
    expect(f.nativeElement.querySelector('app-visor-certificado')).toBeNull();
    expect(f.nativeElement.textContent).toContain('Vista previa lista');
    expect(f.nativeElement.querySelector('.pasos-beneficiario')).not.toBeNull();
    http.expectNone(() => true); // Solo se solicitó la vista previa; no hay solicitudes adicionales ni emisión.
    Array.from(f.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>).find(b => b.textContent === 'Volver a beneficiarios')!.click(); f.detectChanges();
    expect(f.nativeElement.querySelectorAll('.beneficiarios-certificacion tbody tr').length).toBe(2); f.destroy();
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
    pulsar(f, 'Continuar a confirmación');
    const emitir = Array.from(f.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>).find(b => b.textContent === 'Confirmar y emitir')!;
    expect(emitir.disabled).toBeTrue(); emitir.click(); emitir.click();
    expect(f.nativeElement.textContent).toContain('no se guarda persistentemente');
    pulsar(f, 'Volver a editar'); expect(f.nativeElement.querySelector('textarea').value).toBe(texto);
    pulsar(f, 'Volver a beneficiarios'); pulsar(f, 'Preparar certificado'); pulsar(f, 'Continuar al mensaje');
    expect(f.nativeElement.querySelector('textarea').value).toBe(texto);
    pulsar(f, 'Volver a beneficiarios');
    const otro = Array.from(f.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>).filter(b => b.textContent === 'Preparar certificado')[1];
    otro.click(); f.detectChanges(); pulsar(f, 'Continuar al mensaje');
    expect(f.nativeElement.querySelector('textarea').value).not.toBe(texto);
    http.expectNone(() => true); f.destroy();
  });
  it('rechaza HTML y texto vacío, permite borrar y restablecer una sugerencia con contexto real', () => {
    const f = iniciar(); pulsar(f, 'Preparar certificado'); pulsar(f, 'Continuar al mensaje');
    const editor: HTMLTextAreaElement = f.nativeElement.querySelector('textarea');
    editor.value = '<script>alert(1)</script>'; editor.dispatchEvent(new Event('input')); f.detectChanges(); pulsar(f, 'Previsualizar certificado');
    expect(f.nativeElement.querySelector('app-visor-certificado')).toBeNull(); expect(f.nativeElement.querySelector('#mensaje-error')).not.toBeNull();
    pulsar(f, 'Borrar texto'); pulsar(f, 'Previsualizar certificado'); expect(f.nativeElement.querySelector('app-visor-certificado')).toBeNull();
    pulsar(f, 'Restaurar texto sugerido');
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
    expect(f.nativeElement.textContent).toContain('Vista previa bloqueada por Laravel.');
    http.expectNone(() => true); f.destroy();
  });
  for (const status of [401, 403, 409, 422]) {
    it('conserva HTTP ' + status + ' al consultar datos de revisión, sin crear registros', () => {
      const f = iniciar(false);
      Array.from(f.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>).find(b => b.textContent === 'Preparar certificado')!.click(); f.detectChanges();
      http.expectOne('/api/activity-session/15').flush({ success: true, data: sesion });
      http.expectOne('/api/activity/7').flush({ message: 'Motivo real de Laravel' }, { status, statusText: 'Error' }); f.detectChanges();
      expect(f.nativeElement.textContent).toContain('HTTP ' + status); expect(f.nativeElement.textContent).toContain('Motivo real de Laravel');
      expect(f.nativeElement.querySelector('app-visor-certificado')).toBeNull(); http.expectNone(req => req.method !== 'GET'); f.destroy();
    });
  }
});
