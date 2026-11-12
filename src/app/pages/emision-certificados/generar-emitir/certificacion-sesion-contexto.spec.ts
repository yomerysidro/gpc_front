import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { AUTHENTICATED_REQUEST } from '../../../core/security/auth-request.context';
import { ESCRITURA_EMISION_AUTORIZADA } from '../../../core/services/emision-certificados/operaciones-emision';
import { GenerarEmitirComponent } from './generar-emitir.component';

describe('Generar y emitir: contexto real de sesión sin contratos inventados', () => {
  let http: HttpTestingController;
  let harness: RouterTestingHarness;
  let consultarActividad: boolean;
  const ruta = '/certificaciones/generar-emitir';
  const parametros = '?id_actividad=7&id_sesion=15&origen=participacion&modalidad=sesion';
  const actividad = { id_actividad: 7, nombre: 'Actividad autorizada', estado: 'Activa' };
  const sesion = { id_actividad_sesion: 15, id_actividad: 7, nombre: 'Jornada registrada', fecha: '2026-11-05', hora_inicio: '08:00', hora_fin: '09:00', estado: 'culminado' };
  const vista = () => harness.routeNativeElement!;
  const responder = (url: string, data: unknown) => {
    const peticion = http.expectOne(req => req.url === '/api' + url);
    expect(peticion.request.method).toBe('GET'); expect(peticion.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue();
    peticion.flush({ success: true, data });
  };
  async function iniciar(query = parametros) {
    harness = await RouterTestingHarness.create(ruta + query); harness.detectChanges(); await harness.fixture.whenStable(); harness.detectChanges();
  }
  async function cargarContexto() {
    responder('/activity/7', actividad); responder('/activity-session/15', sesion);
    await harness.fixture.whenStable(); harness.detectChanges(); await cargarCertificacion();
  }
  async function cargarCertificacion(origen: 'sesion' | 'actividad' = 'sesion', actividadId = 7, sesionId: number | null = 15) {
    const pagina = { data: [], total: 0, current_page: 1, last_page: 1, per_page: 20 };
    responder('/certificaciones/pendientes', pagina);
    responder('/tipos-certificado/list', { data: [{ id_tipo_certificado: 4, nombre_tipo: 'Asistencia' }], current_page: 1, last_page: 1, total: 1, per_page: 100 });
    harness.detectChanges();
    const tipo = vista().querySelector('select')!; tipo.value = '4'; tipo.dispatchEvent(new Event('change')); harness.detectChanges();
    responder(origen === 'sesion' ? '/activity-session/' + sesionId + '/beneficiarios' : '/activity/' + actividadId + '/beneficiarios-certificacion', {
      origen, contexto: { id_actividad: actividadId, nombre_actividad: 'Actividad autorizada', estado_actividad: 'Activa', ...(origen === 'sesion' ? { id_sesion: sesionId, nombre_sesion: sesionId === 15 ? 'Jornada registrada' : 'Otra jornada', estado_sesion: 'Finalizada' } : {}) },
      beneficiarios: pagina, puede_preparar: false, puede_emitir: false, puede_firmar: false, motivos_bloqueo: ['Falta relación persistente con la sesión.'],
    });
    await harness.fixture.whenStable(); harness.detectChanges();
  }
  async function cargarGenerales() {
    for (const recurso of ['certificados', 'tipos-certificado']) responder('/' + recurso + '/list', { data: [], total: 0, current_page: 1, last_page: 1, per_page: 100 });
    responder('/person-documents/list', []); responder('/document-types/list', []);
    await harness.fixture.whenStable(); harness.detectChanges();
  }
  beforeEach(() => {
    consultarActividad = true;
    TestBed.configureTestingModule({ providers: [provideRouter([{ path: 'certificaciones/generar-emitir', component: GenerarEmitirComponent }]),
      provideHttpClient(), provideHttpClientTesting(), { provide: ESCRITURA_EMISION_AUTORIZADA, useValue: true },
      { provide: AuthService, useValue: { tienePermiso: (permiso: string) => permiso !== 'actividades.ver' || consultarActividad } },
    ] });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => { harness?.fixture.destroy(); http.verify(); });

  it('verifica ambos IDs y permite consultar una sesión con la actividad Activa sin calcular elegibilidad', async () => {
    await iniciar(); expect(vista().textContent).toContain('Verificando actividad y sesión');
    await cargarContexto();
    expect(vista().textContent).toContain('Actividad autorizada'); expect(vista().textContent).toContain('Jornada registrada');
    expect(vista().textContent).toContain('La actividad puede continuar activa si la política institucional lo permite');
    expect(vista().querySelector('#emision-tab-pendientes')?.getAttribute('aria-selected')).toBe('true');
    expect(vista().textContent).toContain('Falta relación persistente con la sesión.');
    expect(vista().querySelector('app-formulario-certificado, app-listar-certificados')).toBeNull();
    expect(vista().querySelector('a[href="/certificaciones/actividades?id_actividad=7"]')).not.toBeNull();
    expect(vista().querySelectorAll('.pasos li').length).toBe(0);
    http.expectNone(() => true);
  });

  it('rechaza una sesión ajena aunque sus identificadores sean números válidos', async () => {
    await iniciar(); responder('/activity/7', actividad); responder('/activity-session/15', { ...sesion, id_actividad: 8, nombre: 'Nombre ajeno' });
    await harness.fixture.whenStable(); harness.detectChanges();
    expect(vista().textContent).toContain('no confirmó la correspondencia'); expect(vista().textContent).not.toContain('Nombre ajeno');
    expect(vista().querySelector('app-formulario-certificado, app-listar-certificados')).toBeNull(); http.expectNone(() => true);
  });

  for (const sesionBeneficiario of [15, 99]) {
    it('valida el contexto de beneficiarios recibido de Laravel: sesión ' + sesionBeneficiario, async () => {
      await iniciar(); responder('/activity/7', actividad); responder('/activity-session/15', sesion);
      await harness.fixture.whenStable(); harness.detectChanges();
      responder('/certificaciones/pendientes', { data: [], current_page: 1, last_page: 1, total: 0, per_page: 20 });
      responder('/tipos-certificado/list', { data: [{ id_tipo_certificado: 4, nombre_tipo: 'Asistencia' }], current_page: 1, last_page: 1, total: 1, per_page: 100 });
    harness.detectChanges();
    const tipo = vista().querySelector('select')!; tipo.value = '4'; tipo.dispatchEvent(new Event('change')); harness.detectChanges();
      const consulta = http.expectOne(r => r.url === '/api/activity-session/15/beneficiarios');
      expect(consulta.request.method).toBe('GET');
      expect(consulta.request.params.get('id_actividad')).toBe('7');
      expect(consulta.request.params.get('id_sesion')).toBe('15');
      expect(consulta.request.params.get('origen')).toBe('sesion');
      consulta.flush({ success: true, data: { origen: 'sesion', contexto: { id_actividad: 7, id_sesion: 15, nombre_sesion: 'Jornada registrada' },
        beneficiarios: { data: [{ id_participacion: 30, id_persona: 41, id_actividad: 7, id_sesion: sesionBeneficiario,
          nombre_completo: 'Beneficiario confirmado', id_tipo_certificado: null, estado_elegibilidad: 'Pendiente de validación',
          motivos: ['Falta política de elegibilidad.'], certificados_registrados_participacion: [], certificado_sesion: null }],
          current_page: 1, last_page: 1, total: 1, per_page: 20 },
        puede_preparar: false, puede_emitir: false, puede_firmar: false, motivos_bloqueo: ['Falta relación persistente con la sesión.'] } });
      await harness.fixture.whenStable(); harness.detectChanges();
      if (sesionBeneficiario === 15) {
        expect(vista().textContent).toContain('Beneficiario confirmado');
        expect(vista().textContent).toContain('Falta política de elegibilidad.');
        const preparar = Array.from(vista().querySelectorAll('button')).find(b => b.textContent?.trim() === 'Preparar certificado');
        expect(preparar?.disabled).toBeTrue();
      } else {
        expect(vista().textContent).toContain('Laravel devolvió beneficiarios de otro contexto.');
        expect(vista().textContent).not.toContain('Beneficiario confirmado');
      }
      http.expectNone(r => r.method !== 'GET');
    });
  }

  for (const query of ['?id_actividad=7&id_sesion=0&origen=participacion', '?id_sesion=15&origen=participacion', '?id_actividad=7&id_sesion=15&origen=practica', '?id_actividad=7&id_sesion=15&origen=participacion&id_sesion=16']) {
    it('un contexto inválido no consulta beneficiarios ni abre preparación: ' + query, async () => {
      await iniciar(query); expect(vista().textContent).toContain('El contexto de certificación no es válido');
      expect(vista().querySelector('app-listar-certificados, app-formulario-certificado')).toBeNull(); http.expectNone(() => true);
    });
  }

  for (const status of [401, 403, 409, 422]) {
    it('conserva HTTP ' + status + ' al verificar sin convertirlo en una bandeja vacía exitosa', async () => {
      await iniciar(); responder('/activity-session/15', sesion);
      http.expectOne('/api/activity/7').flush({ message: 'Consulta rechazada por Laravel' }, { status, statusText: 'Error' });
      await harness.fixture.whenStable(); harness.detectChanges();
      expect(vista().querySelector('[role="alert"]')?.textContent).toContain('HTTP ' + status);
      expect(vista().querySelector('[role="alert"]')?.textContent).toContain('Consulta rechazada');
      expect(vista().querySelector('app-listar-certificados')).toBeNull(); http.expectNone(() => true);
    });
  }

  it('no permite preparar mediante nuevo/editar en la URL contextual, incluso con escritura general autorizada', async () => {
    await iniciar(parametros + '&nuevo=1&editar=9'); await cargarContexto();
    expect(vista().querySelector('app-formulario-certificado')).toBeNull();
    expect(vista().querySelector('li.actual')).toBeNull();
    (vista().querySelector('#emision-tab-preparaciones') as HTMLButtonElement).click(); harness.detectChanges();
    expect(vista().textContent).toContain('La vista previa temporal por sesión no es un documento registrado');
    expect(vista().querySelector('app-listar-certificados')).toBeNull(); http.expectNone(() => true);
  });

  it('cancela lecturas anteriores al cambiar la sesión y no reutiliza una identidad anterior', async () => {
    await iniciar(); const anteriorActividad = http.expectOne('/api/activity/7'); const anteriorSesion = http.expectOne('/api/activity-session/15');
    await harness.navigateByUrl(ruta + '?id_actividad=8&id_sesion=17&origen=participacion'); harness.detectChanges();
    expect(anteriorActividad.cancelled).toBeTrue(); expect(anteriorSesion.cancelled).toBeTrue();
    responder('/activity/8', { ...actividad, id_actividad: 8, nombre: 'Otra actividad' }); responder('/activity-session/17', { ...sesion, id_actividad: 8, id_actividad_sesion: 17, nombre: 'Otra jornada' });
    await harness.fixture.whenStable(); harness.detectChanges();
    await cargarCertificacion('sesion', 8, 17);
    expect(vista().textContent).toContain('Otra jornada'); expect(vista().textContent).not.toContain('Jornada registrada'); http.expectNone(() => true);
  });

  it('el ingreso general limpia el contexto y las pestañas conservan la única lista de preparaciones sin repetir consultas', async () => {
    await iniciar(); await cargarContexto();
    await harness.navigateByUrl(ruta); harness.detectChanges(); await harness.fixture.whenStable(); harness.detectChanges();
    responder('/certificaciones/pendientes', { data: [], total: 0, current_page: 1, last_page: 1, per_page: 20 });
    responder('/activity-session', []); responder('/activity', []); responder('/tipos-certificado/list', { data: [], total: 0, current_page: 1, last_page: 1, per_page: 100 });
    (vista().querySelector('#emision-tab-preparaciones') as HTMLButtonElement).click(); harness.detectChanges(); await harness.fixture.whenStable(); await cargarGenerales();
    expect(vista().querySelector('.contexto-certificacion')).toBeNull();
    const lista = vista().querySelector('app-listar-certificados'); expect(lista).not.toBeNull();
    (vista().querySelector('#emision-tab-pendientes') as HTMLButtonElement).click(); harness.detectChanges();
    await harness.fixture.whenStable(); harness.detectChanges();
    expect(vista().querySelector('#emision-tab-pendientes')?.getAttribute('aria-selected')).toBe('true');
    expect(vista().querySelector('app-listar-certificados')).toBe(lista);
    (vista().querySelector('#emision-tab-preparaciones') as HTMLButtonElement).click(); harness.detectChanges();
    expect(vista().querySelector('app-listar-certificados')).toBe(lista); http.expectNone(() => true);
  });

  it('distingue la modalidad global de actividad sin reutilizar la sesión anterior', async () => {
    await iniciar('?id_actividad=7&origen=participacion&modalidad=actividad'); responder('/activity/7', actividad);
    await harness.fixture.whenStable(); harness.detectChanges();
    await cargarCertificacion('actividad', 7, null);
    expect(vista().textContent).toContain('Certificación global de actividad');
    expect(vista().textContent).not.toContain('Jornada registrada'); http.expectNone('/api/activity-session/15');
    http.expectNone(req => req.method !== 'GET');
  });
  it('tener acceso a emisión no sustituye el permiso efectivo para consultar actividades', async () => {
    consultarActividad = false; await iniciar();
    expect(vista().textContent).toContain('No tienes permiso para verificar la actividad y su sesión');
    expect(vista().querySelector('app-listar-certificados, app-formulario-certificado')).toBeNull(); http.expectNone(() => true);
  });
});
