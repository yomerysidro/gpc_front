import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Navigation, provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { PrepararReconocimientoSesionComponent } from './preparar-reconocimiento-sesion.component';
import { ponenteSesionPrueba } from '../../../core/interfaces/emision-certificados/origenes-certificado.fixture';

@Component({ standalone: true, template: '<p>Seleccionar ponente</p>' })
class SeleccionPrueba {}

describe('Página completa del reconocimiento por sesión', () => {
  let http: HttpTestingController;
  const ruta = '/reconocimientos/preparar';
  const ligera = '/api/certificaciones/ponente_sesion/71/preparar?accion=consultar_preparacion&modalidad_reconocimiento=sesion&id_sesion=15';
  const evaluacion = () => ({ ...ponenteSesionPrueba(), recuperado: false, persistido: false });
  const documento = () => ({ id_certificado: 151, id_certificado_documento: 201,
    id_actividad_ponente: 71, id_sesion: 15, id_actividad: 7, id_tipo_certificado: 47,
    beneficiario: { id_persona: 31, nombre: 'Maria Perez' }, actividad: 'Capacitación Personal',
    sesion: 'Sesión N.º 001', fecha_sesion: '2026-02-10', tipo_certificado: 'Reconocimiento',
    estado_certificado: 'PREPARADO', recuperado: true, persistido: true,
    mensaje: 'Mensaje guardado', motivo: 'Motivo guardado', facultades: { remitir: true, descargar: true }, firmantes: [] });
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      provideRouter([{ path: 'reconocimientos/preparar', component: PrepararReconocimientoSesionComponent },
        { path: 'certificaciones/generar-emitir', component: SeleccionPrueba }]),
      provideHttpClient(), provideHttpClientTesting(),
      { provide: AuthService, useValue: { tienePermiso: () => true } },
    ] });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  function render(h: RouterTestingHarness) {
    TestBed.flushEffects(); h.detectChanges(); TestBed.flushEffects(); h.detectChanges();
  }
  async function iniciar(contexto = true, url = ruta) {
    const harness = await RouterTestingHarness.create('/certificaciones/generar-emitir');
    await TestBed.inject(Router).navigateByUrl(url, contexto ? { state: { reconocimientoSesion: ponenteSesionPrueba() } } : {});
    if (!contexto) await harness.fixture.whenStable();
    render(harness); return harness;
  }
  function siguiente(harness: RouterTestingHarness) {
    (harness.routeNativeElement!.querySelector('.acciones-paso .btn-primary') as HTMLButtonElement).click();
    harness.detectChanges();
  }
  it('presenta el paso 1 desde navegación antes de responder el GET ligero', async () => {
    const h = await iniciar(true); const vista = h.routeNativeElement!;
    expect(TestBed.inject(Router).url).toBe(ruta);
    expect(vista.textContent).toContain('Maria Perez');
    expect(vista.textContent).toContain('Capacitación Personal');
    expect(vista.textContent).toContain('10/02/2026');
    expect(vista.querySelector('[aria-current="step"]')!.textContent).toContain('1. Información');
    expect(vista.textContent).not.toContain('Cargando reconocimiento');
    expect(vista.textContent).not.toContain('Consultando beneficiarios');
    expect(vista.querySelector('textarea')).toBeNull();
    http.expectNone(r => r.url.includes('ponentes-certificacion'));
    http.expectOne(ligera).flush({ success: true, data: evaluacion() }); render(h);
    siguiente(h); expect(vista.querySelector('textarea')).not.toBeNull();
    expect(vista.querySelector('h2')!.textContent).toBe('Mensaje');
    http.expectNone(r => r.method === 'POST');
  });
  it('regresa a seleccionar al abrir sin contexto, sin consultas ni datos personales', async () => {
    const h = await iniciar(false);
    expect(TestBed.inject(Router).url).toBe('/certificaciones/generar-emitir?origen_documental=reconocimiento');
    expect(h.routeNativeElement!.querySelector('app-preparacion-origen')).toBeNull();
    expect(h.routeNativeElement!.textContent).not.toContain('Maria');
    expect(TestBed.inject(Router).lastSuccessfulNavigation!.extras.state?.['seleccionarPonente']).toBeTrue();
    http.expectNone(() => true);
  });
  for (const trigger of ['imperative', 'popstate'] as const) {
    it('descarta estado del historial en recarga o retroceso: ' + trigger, () => {
      const router = TestBed.inject(Router);
      spyOn(router, 'getCurrentNavigation').and.returnValue({ id: 1, initialUrl: router.parseUrl(ruta), extractedUrl: router.parseUrl(ruta),
        trigger, previousNavigation: null,
        extras: { state: { reconocimientoSesion: ponenteSesionPrueba() } } } as Navigation);
      const navegar = spyOn(router, 'navigate').and.resolveTo(true);
      const fixture = TestBed.createComponent(PrepararReconocimientoSesionComponent); fixture.detectChanges();
      expect(fixture.nativeElement.textContent).not.toContain('Maria');
      expect(navegar).toHaveBeenCalledWith(['/certificaciones/generar-emitir'], {
        replaceUrl: true, queryParams: { origen_documental: 'reconocimiento' }, state: { seleccionarPonente: true },
      });
      http.expectNone(() => true);
    });
  }
  it('conserva paso y texto editado al terminar la consulta secundaria', async () => {
    const h = await iniciar(true); siguiente(h);
    const editor = h.routeNativeElement!.querySelector('textarea') as HTMLTextAreaElement;
    editor.value = 'Texto local conservado'; editor.dispatchEvent(new Event('input')); render(h);
    http.expectOne(ligera).flush({ success: true, data: evaluacion() }); render(h);
    expect(h.routeNativeElement!.querySelector('textarea')).toBe(editor);
    expect(editor.value).toBe('Texto local conservado');
  });
  for (const conContexto of [true]) {
    it('recupera preparación existente sin duplicar consultas ni descargar PDF: contexto=' + conContexto, async () => {
      const h = await iniciar(conContexto);
      http.expectOne(ligera).flush({ success: true, data: documento() }); render(h);
      expect(h.routeNativeElement!.querySelector('[aria-current="step"]')!.textContent).toContain('1. Información');
      siguiente(h);
      const editor = h.routeNativeElement!.querySelector('textarea') as HTMLTextAreaElement;
      expect(editor.value).toBe('Mensaje guardado'); expect(editor.disabled).toBeTrue();
      http.expectNone(r => r.method === 'POST' || r.url.includes('/archivo') || r.url.includes('ponentes-certificacion'));
    });
  }
  it('conserva contexto ante errores y permite un reintento puntual', async () => {
    const h = await iniciar(true);
    http.expectOne(ligera).flush({}, { status: 500, statusText: 'Error' }); render(h);
    expect(h.routeNativeElement!.textContent).toContain('Maria Perez');
    const botones = Array.from(h.routeNativeElement!.querySelectorAll('button'));
    (botones.find(b => b.textContent!.includes('Reintentar consulta')) as HTMLButtonElement).click();
    http.expectOne(ligera).flush({ success: true, data: evaluacion() }); render(h);
    expect(h.routeNativeElement!.querySelector('[role="alert"]')).toBeNull();
  });
  for (const campo of ['id_persona', 'id_sesion', 'id_actividad', 'id_origen']) {
    it('rechaza una respuesta de otra identidad: ' + campo, async () => {
      const h = await iniciar(true);
      http.expectOne(ligera).flush({ success: true, data: { ...evaluacion(), [campo]: 99 } }); render(h);
      expect(h.routeNativeElement!.textContent).toContain('Maria Perez');
      expect(h.routeNativeElement!.querySelector('[role="alert"]')).not.toBeNull();
    });
  }
  for (const campo of ['id_origen', 'id_sesion', 'id_actividad', 'id_persona']) {
    it('regresa a seleccionar si el contexto no tiene una identidad valida: ' + campo, async () => {
      const h = await RouterTestingHarness.create('/certificaciones/generar-emitir');
      await TestBed.inject(Router).navigateByUrl(ruta, { state: { reconocimientoSesion: { ...ponenteSesionPrueba(), [campo]: 0 } } });
      await h.fixture.whenStable(); render(h); expect(TestBed.inject(Router).url).toContain('/certificaciones/generar-emitir');
      http.expectNone(() => true);
    });
  }
  it('conserva actividad y sesión en la flecha de regreso', async () => {
    const h = await iniciar(true);
    http.expectOne(ligera).flush({ success: true, data: evaluacion() }); render(h);
    const href = h.routeNativeElement!.querySelector('.titulo-asistente a')!.getAttribute('href')!;
    expect(href).toContain('id_actividad=7'); expect(href).toContain('id_sesion=15');
    expect(href).toContain('origen=ponente_sesion'); expect(href).toContain('id_tipo_certificado=47');
  });

});
