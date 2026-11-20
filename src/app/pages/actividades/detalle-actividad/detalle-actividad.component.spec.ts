import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AUTHENTICATED_REQUEST } from '../../../core/security/auth-request.context';
import { DetalleActividadComponent } from './detalle-actividad.component';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { By } from '@angular/platform-browser';

describe('Detalle de actividad con las APIs existentes', () => {
  let fixture: ComponentFixture<DetalleActividadComponent>;
  let http: HttpTestingController;
  let permisos: Set<string>;
  const seleccionar = (id: number | null) => {
    fixture.componentRef.setInput('actividadId', id); fixture.detectChanges();
  };
  const actividad = { id_actividad: 7, id_area: 2, id_tipo_actividad: 3, nombre: 'Jornada municipal',
    descripcion: 'Capacitación institucional', fecha_inicio: '2026-11-04', fecha_fin: '2026-11-05',
    sede: 'Auditorio', estado: 'Activa', origen: 'sin_solicitud', id_solicitud_actividad: null };
  const responder = (ruta: string, data: unknown) => {
    const peticion = http.expectOne('/api' + ruta);
    expect(peticion.request.method).toBe('GET');
    expect(peticion.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue();
    peticion.flush({ success: true, message: 'OK', data });
  };
  const texto = () => fixture.nativeElement.textContent as string;
  const catalogos = () => {
    responder('/areas/list', [{ id_area: 2, nombre: 'Desarrollo social' }]);
    responder('/ativicty-type', [{ id_tipo_actividad: 3, nombre: 'Taller' }]);
  };

  beforeEach(async () => {
    permisos = new Set();
    TestBed.configureTestingModule({ imports: [DetalleActividadComponent], providers: [
      provideRouter([]), provideHttpClient(), provideHttpClientTesting(),
      { provide: AuthService, useValue: { tienePermiso: (permiso: string) => permisos.has(permiso) } },
    ] });
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(DetalleActividadComponent);
    fixture.componentRef.setInput('actividadId', 7);
    fixture.autoDetectChanges();
    await fixture.whenStable();
  });
  afterEach(() => { fixture.destroy(); http.verify(); });

  it('muestra solo las relaciones de la actividad y resuelve nombres con una consulta por catálogo', async () => {
    responder('/activity/7', actividad); catalogos();
    responder('/participation', [
      { id_participacion: 30, id_actividad: 7, id_persona: 41, id_tipo_participacion: 5, fecha_inscripcion: '2026-11-03', estado: 'Inscrito' },
      { id_participacion: 31, id_actividad: 8, id_persona: 42, id_tipo_participacion: 5, estado: 'Inscrito' },
    ]);
    responder('/persons/list', [
      { id_persona: 40, nombres: 'Ana', apellido_paterno: 'Pérez', apellido_materno: 'Ríos' },
      { id_persona: 41, nombres: 'Luis', apellido_paterno: 'García', apellido_materno: null },
      { id_persona: 42, nombres: 'Otra actividad', apellido_paterno: 'No mostrar' },
      { id_persona: 43, nombres: 'María', apellido_paterno: 'Rojas', apellido_materno: null },
    ]);
    responder('/participation-type', [{ id_tipo_participacion: 5, nombre: 'Asistente', estado: true }]);
    await fixture.whenStable();
    expect(texto()).toContain('Jornada municipal');
    expect(texto()).toContain('Desarrollo social'); expect(texto()).toContain('Taller');
    expect(fixture.nativeElement.querySelector('.tarjeta-ponente')).toBeNull();
    http.expectNone('/api/activity-speaker');
    expect(fixture.nativeElement.querySelector('.indicadores dd').textContent.trim()).toBe('No informado');
    expect(fixture.nativeElement.querySelector('table')).toBeNull();
    expect(texto()).not.toContain('PASAPORTE-NO-DNI'); expect(texto()).not.toContain('87654321');
    expect(texto()).not.toContain('Otra actividad');
    expect(fixture.nativeElement.querySelector('app-listar-actividades')).toBeNull();
    expect(fixture.nativeElement.querySelector('dialog[open]')).toBeNull();
    const volver = jasmine.createSpy('volver'); fixture.componentInstance.volver.subscribe(volver);
    fixture.nativeElement.querySelector('.encabezado button').click();
    expect(volver).toHaveBeenCalledTimes(1);
    expect(fixture.nativeElement.querySelector('a')).toBeNull();
    http.expectNone(peticion => peticion.url.includes('/detail/'));
  });

  it('distingue listas vacías de errores sin solicitar catálogos de personas innecesarios', async () => {
    responder('/activity/7', actividad); catalogos();
    responder('/participation', []);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('[aria-labelledby=\"titulo-ponentes\" ]')).toBeNull();
    expect(fixture.nativeElement.querySelector('.indicadores dd').textContent.trim()).toBe('No informado');
    http.expectNone('/api/persons/list'); http.expectNone('/api/person-speakers/list');
  });

  it('no presenta una consulta denegada como ausencia de participantes', async () => {
    responder('/activity/7', actividad); catalogos();
    http.expectOne('/api/participation').flush({ message: 'Denegado' }, { status: 403, statusText: 'Forbidden' });
    await fixture.whenStable();
    expect(texto()).toContain('Laravel denegó la consulta de los participantes (/participation) (HTTP 403)');
    expect(texto()).not.toContain('No hay participantes inscritos');
  });

  it('conserva participantes con catálogo 403 y reintenta solamente el recurso fallido, sin consultar documentos', async () => {
    responder('/activity/7', actividad); catalogos();
    responder('/participation', [{ id_participacion: 30, id_actividad: 7, id_persona: 41, id_tipo_participacion: 5, fecha_inscripcion: '2026-11-03', estado: 'Inscrito' },
      { id_participacion: 31, id_actividad: 8, id_persona: 99 }]);
    responder('/persons/list', [{ id_persona: 41, nombres: 'Luis', apellido_paterno: 'García', apellido_materno: null }]);
    http.expectOne('/api/participation-type').flush({ message: 'Tipos denegados' }, { status: 403, statusText: 'Forbidden' });
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.indicadores dd').textContent.trim()).toBe('No informado'); expect(texto()).toContain('/participation-type (HTTP 403)');
    expect(fixture.nativeElement.querySelector('table')).toBeNull();
    expect(texto()).not.toContain('No hay participantes inscritos');
    http.expectNone('/api/person-documents/list'); http.expectNone('/api/document-types/list');
    const reintentar = Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>).find(b => b.textContent?.includes('Reintentar tipos'))!;
    reintentar.click(); await fixture.whenStable();
    responder('/participation-type', [{ id_tipo_participacion: 5, nombre: 'Asistente', estado: true }]); await fixture.whenStable();
    expect(texto()).not.toContain('/participation-type (HTTP 403)');
    http.expectNone('/api/participation'); http.expectNone('/api/persons/list'); http.expectNone('/api/activity/7');
  });

  it('si personas es denegado muestra las inscripciones autorizadas sin inventar nombres', async () => {
    responder('/activity/7', actividad); catalogos();
    responder('/participation', [{ id_participacion: 30, id_actividad: 7, id_persona: 41, id_tipo_participacion: 5, fecha_inscripcion: '2026-11-03', estado: 'Inscrito' }]);
    http.expectOne('/api/persons/list').flush({ message: 'Personas denegadas' }, { status: 403, statusText: 'Forbidden' });
    responder('/participation-type', [{ id_tipo_participacion: 5, nombre: 'Asistente', estado: true }]); await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('table')).toBeNull(); expect(fixture.nativeElement.querySelector('.indicadores dd').textContent.trim()).toBe('No informado');
    expect(texto()).toContain('/persons/list (HTTP 403)'); expect(texto()).not.toContain('Persona #41');
    expect(texto()).not.toContain('No hay participantes inscritos');
  });

  it('limpia la actividad anterior y cancela sus solicitudes al cambiar de ID', async () => {
    responder('/activity/7', actividad); catalogos();
    http.expectNone('/api/activity-speaker');
    const participaciones = http.expectOne('/api/participation');
    seleccionar(8);
    expect(participaciones.cancelled).toBeTrue();
    await fixture.whenStable(); expect(texto()).not.toContain('Jornada municipal');
    responder('/activity/8', { ...actividad, id_actividad: 8, nombre: 'Segunda actividad' });
    catalogos(); responder('/participation', []);
    await fixture.whenStable(); expect(texto()).toContain('Segunda actividad');
  });

  it('rechaza un detalle cuyo ID no coincide y no consulta sus relaciones', async () => {
    responder('/activity/7', { ...actividad, id_actividad: 8 });
    await fixture.whenStable();
    expect(texto()).toContain('No se pudo verificar la actividad solicitada.');
    expect(texto()).not.toContain('Jornada municipal'); http.expectNone('/api/activity-speaker');
  });

  it('muestra la indicación sin seleccionar el primer registro al acceder sin actividad', async () => {
    const peticion = http.expectOne('/api/activity/7');
    seleccionar(null);
    expect(peticion.cancelled).toBeTrue();
    await fixture.whenStable();
    expect(texto()).toContain('Selecciona una actividad para ver su detalle');
    expect(fixture.nativeElement.querySelector('.tarjetas-detalle')).toBeNull();
    expect(fixture.nativeElement.querySelector('.encabezado button').getAttribute('aria-label')).toBe('Volver a actividades');
    http.expectNone('/api/activity'); http.expectNone('/api/activity/1');
  });

  it('limpia las tarjetas y las peticiones cuando se elimina la selección', async () => {
    responder('/activity/7', actividad); catalogos();
    const anterior = http.expectOne('/api/participation');
    seleccionar(null);
    expect(anterior.cancelled).toBeTrue();
    await fixture.whenStable();
    expect(texto()).toContain('Selecciona una actividad para ver su detalle');
    expect(texto()).not.toContain('Jornada municipal');
    expect(fixture.nativeElement.querySelector('.panel')).toBeNull();
  });

  it('muestra los totales reales sin tabla de inscritos duplicada ni paginación en el detalle', async () => {
    responder('/activity/7', actividad); catalogos();
    responder('/participation', Array.from({ length: 12 }, (_, i) => ({ id_participacion: 100 + i, id_actividad: 7, id_persona: 40 + i })));
    responder('/persons/list', []); responder('/participation-type', []); await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.indicadores dd').textContent.trim()).toBe('No informado');
    expect(fixture.nativeElement.querySelector('table')).toBeNull();
    expect(fixture.nativeElement.querySelector('.consulta-inscritos')).toBeNull();
    expect(fixture.nativeElement.querySelector('#panel-sesion')).toBeNull();
  });

  it('usa una flecha real compacta con tooltip y no anticipa nombres no disponibles durante la carga', async () => {
    responder('/activity/7', actividad);
    fixture.detectChanges();
    expect(texto()).toContain('Cargando área'); expect(texto()).toContain('Cargando tipo');
    expect(fixture.nativeElement.querySelector('[aria-busy="true"] dd')?.textContent).not.toContain('No disponible');
    catalogos(); responder('/participation', []); await fixture.whenStable();
    const volver = fixture.nativeElement.querySelector('.volver-actividad') as HTMLButtonElement;
    expect(volver.title).toBe('Volver a actividades');
    expect(volver.getAttribute('aria-label')).toBe('Volver a actividades');
    expect(volver.textContent?.trim()).toBe('arrow_back');
    expect((await document.fonts.load('300 20px "Material Symbols Outlined"', 'arrow_back')).length).toBeGreaterThan(0);
    expect(volver.getBoundingClientRect().width).toBeLessThanOrEqual(40);
    http.expectNone('/api/activity-speaker');
  });

  it('filtra las sesiones por actividad y presenta vacío válido con acceso al formulario protegido', async () => {
    permisos.add('actividades.ver'); permisos.add('actividades.crear');
    responder('/activity/7', actividad); catalogos(); responder('/participation', []);
    responder('/activity-session', [{ id_actividad_sesion: 9, id_actividad: 8, nombre: 'Sesión ajena' }]);
    await fixture.whenStable();
    expect(texto()).toContain('Esta actividad todavía no tiene sesiones programadas');
    expect(texto()).not.toContain('Sesión ajena');
    const registrar = Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>).find(boton => boton.textContent?.includes('Registrar sesión'))!;
    registrar.click(); await fixture.whenStable();
    const selector = fixture.nativeElement.querySelector('#activity-session-id_actividad') as HTMLSelectElement;
    expect(selector.value).toBe('7'); expect(selector.disabled).toBeTrue();
    expect(fixture.nativeElement.querySelector('.modal-sesion-detalle dialog[open]')).not.toBeNull();
    const valores = { nombre: 'Jornada real', fecha: '2026-11-04', hora_inicio: '08:00', hora_fin: '09:00', lugar: 'Auditorio', estado: 'activo' };
    for (const [nombre, valor] of Object.entries(valores)) {
      const campo = fixture.nativeElement.querySelector('#activity-session-' + nombre) as HTMLInputElement;
      campo.value = valor; campo.dispatchEvent(new Event('input'));
    }
    fixture.nativeElement.querySelector('.modal-sesion-detalle form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); await fixture.whenStable();
    const guardar = http.expectOne(req => req.url === '/api/activity-session' && req.method === 'POST');
    expect(guardar.request.body.id_actividad).toBe(7);
    guardar.flush({ success: true, data: { id_actividad_sesion: 15, id_actividad: 7, ...valores } }); await fixture.whenStable();
    responder('/activity-session', [{ id_actividad_sesion: 15, id_actividad: 7, ...valores }]); await fixture.whenStable();
    expect(texto()).toContain('Jornada real');
    expect(fixture.nativeElement.querySelector('.tarjeta-sesion .badge').textContent.trim()).toBe('activo');
    expect(fixture.nativeElement.querySelectorAll('.lista-sesiones li').length).toBe(1);
    http.expectNone('/api/activity/7'); http.expectNone('/api/participation'); http.expectNone('/api/activity');
  });

  it('conserva iconos accesibles y abre asistencia con Router mientras el detalle conserva su consulta', async () => {
    ['actividades.ver', 'participantes.ver', 'participantes.crear', 'ponentes-firmantes.ver'].forEach(p => permisos.add(p));
    const sesiones = [{ id_actividad_sesion: 15, id_actividad: 7, nombre: 'Jornada real', fecha: '2026-11-04', hora_inicio: '08:00', hora_fin: '09:00', estado: 'activo' }, { id_actividad_sesion: 17, id_actividad: 7, nombre: 'Segunda' }, { id_actividad_sesion: 16, id_actividad: 8, nombre: 'Sesión ajena' }];
    responder('/activity/7', actividad); catalogos(); responder('/activity-session', sesiones);
    responder('/attendance/list', [{ ID_ASISTENCIA: 80, ID_PARTICIPACION: 30, ID_ACTIVIDAD_SESION: 15, ESTADO: 'PRESENTE', HORA_ENTRADA: '08:00', HORA_SALIDA: null }]);
    responder('/participation', [{ id_participacion: 30, id_actividad: 7, id_persona: 41 }, { id_participacion: 31, id_actividad: 7, id_persona: 42 }, { id_participacion: 32, id_actividad: 8, id_persona: 43 }]);
    responder('/persons/list', [{ id_persona: 41, nombres: 'Luis' }, { id_persona: 42, nombres: 'Ana' }]); responder('/participation-type', []); await fixture.whenStable();
    const tarjetas = Array.from(fixture.nativeElement.querySelectorAll('.tarjeta-sesion')) as HTMLElement[];
    expect(tarjetas.map(t => t.dataset['sesionId'])).toEqual(['15', '17']);
    expect(tarjetas[0].textContent).not.toContain('1 presentes'); expect(tarjetas[0].textContent).not.toContain('2 inscritos');
    expect(texto()).not.toContain('Sesión ajena');
    expect(tarjetas.map(tarjeta => tarjeta.querySelector('.numero-sesion')?.textContent?.trim())).toEqual(['Sesión #1', 'Sesión #2']);
    for (const tarjeta of tarjetas) {
      expect(tarjeta.querySelectorAll('.acciones-sesion > button').length).toBe(4);
      expect(Array.from(tarjeta.querySelectorAll('.acciones-sesion > button')).every(b => !!b.getAttribute('title') && !!b.getAttribute('aria-label'))).toBeTrue();
    }
    expect(fixture.nativeElement.querySelector('#panel-sesion')).toBeNull();
    expect(fixture.nativeElement.querySelector('.tarjetas-detalle table')).toBeNull();
    const url = TestBed.inject(Router).url;
    tarjetas[0].querySelectorAll('button')[1].click(); await fixture.whenStable();
    const panel = fixture.nativeElement.querySelector('.modal-ponentes-sesion dialog[open]') as HTMLElement;
    expect(panel).not.toBeNull(); expect(panel.textContent).toContain('Ponentes de la sesión');
    expect(panel.textContent).toContain('Jornada municipal'); expect(panel.textContent).toContain('Sesión 1');
    const vinculos = http.expectOne('/api/activity/7/sessions/15/ponentes');
    expect(vinculos.request.method).toBe('GET'); expect(vinculos.request.withCredentials).toBeTrue();
    vinculos.flush({ success: true, data: { id_actividad: 7, id_sesion: 15,
      ponentes_disponibles: [{ id_persona_ponente: 61, id_persona: 31, nombres: 'Maria', apellido_paterno: 'Perez', apellido_materno: null }],
      vinculos: [{ id_actividad_ponente: 71, id_actividad: 7, id_actividad_sesion: 15, id_persona_ponente: 61 }] } });
    http.expectOne('/api/person-speakers/list').flush({ success: true, data: [{ id_persona_ponente: 61, id_persona: 31,
      id_institucion: null, cargo: 'Especialista', especialidad: null }] });
    http.expectOne('/api/person-documents/list').flush({ success: true, data: [] });
    http.expectOne('/api/document-types/list').flush({ success: true, data: [] });
    await fixture.whenStable();
    expect(panel.textContent).toContain('Maria Perez'); expect(panel.textContent).toContain('Especialista');
    expect(panel.textContent).toContain('Registro #61');
    http.expectNone(r => r.method !== 'GET');
    const navegar = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    tarjetas[0].querySelector<HTMLButtonElement>('button[aria-label="Asistencia de sesión"]')!.click(); await fixture.whenStable();
    expect(navegar).toHaveBeenCalledWith(['/certificaciones/actividades', 7, 'sesiones', 15, 'asistencia']);
    expect(fixture.nativeElement.querySelector('.modal-asistencia')).toBeNull();
    tarjetas[0].querySelector('button')!.click(); await fixture.whenStable(); responder('/activity-session/15', sesiones[0]); await fixture.whenStable();
    const detalle = fixture.nativeElement.querySelector('.modal-detalle-sesion dialog') as HTMLDialogElement;
    expect(detalle.open).toBeTrue(); expect(detalle.textContent).toContain('08:00');
    expect(TestBed.inject(Router).url).toBe(url);
    http.expectNone(req => req.method !== 'GET'); http.expectNone('/api/activity-session'); http.expectNone('/api/participation');
  });

  it('conserva el orden de sesiones 001, 002 y 003 con resumen compacto y sin acciones de certificación', async () => {
    ['actividades.ver', 'participantes.ver', 'emision.ver'].forEach(p => permisos.add(p));
    responder('/activity/7', actividad); catalogos(); responder('/participation', []); responder('/attendance/list', []);
    responder('/activity-session', [1, 2, 3].map((numero, indice) => ({ id_actividad_sesion: 15 + indice, id_actividad: 7, nombre: 'Sesión N.º 00' + numero, estado: 'Finalizada', finalizada: true, puede_finalizarse: false,
      contadores: { inscritos_actividad_vigentes: 99, participantes_sesion: 3, presentes: 1, ausentes: 2, pendientes: 0, por_regularizar: null } })));
    await fixture.whenStable();
    const tarjetas = Array.from(fixture.nativeElement.querySelectorAll('.tarjeta-sesion')) as HTMLElement[];
    expect(tarjetas.map(t => t.querySelector('h3')!.textContent)).toEqual(['Sesión N.º 001', 'Sesión N.º 002', 'Sesión N.º 003']);
    for (const tarjeta of tarjetas) {
      expect(tarjeta.querySelector('.badge-exito')!.textContent).toBe('Finalizada');
      expect(tarjeta.querySelector('.resumen-sesion')!.textContent).toBe('3 participantes · 1 presente · 2 ausentes');
      expect(tarjeta.textContent).not.toContain('99'); expect(tarjeta.textContent).not.toContain('No determinable');
      expect(tarjeta.querySelector('.cierre-sesion')).toBeNull(); expect(tarjeta.querySelector('.certificacion-sesion')).toBeNull();
      expect(tarjeta.textContent).not.toContain('Certificar participantes'); expect(tarjeta.textContent).not.toContain('Consultar elegibilidad');
    }
    http.expectNone(r => r.method !== 'GET');
  });
  it('rechaza el detalle de una sesion que Laravel devuelve para otra actividad', async () => {
    permisos.add('actividades.ver');
    responder('/activity/7', actividad); catalogos(); responder('/participation', []);
    responder('/activity-session', [{ id_actividad_sesion: 15, id_actividad: 7, nombre: 'Sesion real' }]); await fixture.whenStable();
    fixture.nativeElement.querySelector('.tarjeta-sesion button').click(); await fixture.whenStable();
    responder('/activity-session/15', { id_actividad_sesion: 15, id_actividad: 8, nombre: 'Detalle ajeno' }); await fixture.whenStable();
    expect(texto()).toContain('No se pudo verificar la sesi\u00f3n de esta actividad.');
    expect(texto()).not.toContain('Detalle ajeno'); http.expectNone(req => req.method !== 'GET');
  });
  it('ofrece una sola acción de cierre aunque el listado todavía no declare capacidades', async () => {
    permisos.add('actividades.ver'); permisos.add('emision.ver'); permisos.add('participantes.ver');
    responder('/activity/7', actividad); catalogos(); responder('/participation', []);
    responder('/attendance/list', []);
    responder('/activity-session', [{ id_actividad_sesion: 15, id_actividad: 7, nombre: 'Jornada real', estado: 'culminado' }]); await fixture.whenStable();
    const tarjeta = fixture.nativeElement.querySelector('.tarjeta-sesion') as HTMLElement;
    expect(tarjeta.dataset['actividadId']).toBe('7'); expect(tarjeta.dataset['sesionId']).toBe('15');
    const acciones = tarjeta.querySelectorAll<HTMLButtonElement>('.cierre-sesion button[aria-label]');
    expect(acciones.length).toBe(1); expect(acciones[0].disabled).toBeFalse();
    expect(tarjeta.textContent).not.toContain('Consultar cierre');
    acciones[0].click();
    responder('/activity-session/15', { id_actividad_sesion: 15, id_actividad: 7, estado: 'culminado', puede_finalizarse: false });
    await fixture.whenStable();
    expect(tarjeta.querySelector('.consulta-certificacion')).toBeNull();
    expect(tarjeta.textContent).not.toContain('Certificar participantes');
    expect(fixture.nativeElement.querySelector('app-dialogo-confirmacion dialog[open]')).toBeNull();
    http.expectNone(req => req.method !== 'GET');
  });

  async function prepararCierre(puedeFinalizarse?: boolean, incluirOtraSesion = false) {
    ['actividades.ver', 'actividades.editar', 'emision.ver', 'emision.crear', 'participantes.ver'].forEach(p => permisos.add(p));
    responder('/activity/7', actividad); catalogos(); responder('/participation', []); responder('/attendance/list', []);
    const sesion = { id_actividad_sesion: 15, id_actividad: 7, nombre: 'Jornada real', estado: 'Activo' };
    responder('/activity-session', [{ ...sesion, puede_finalizarse: puedeFinalizarse,
      motivos_bloqueo_finalizacion: puedeFinalizarse === false ? ['Motivo de una respuesta anterior.'] : [] },
      ...(incluirOtraSesion ? [{ ...sesion, id_actividad_sesion: 16, nombre: 'Segunda jornada' }] : [])]);
    await fixture.whenStable();
    return sesion;
  }
  async function consultarCierre(estado: object) {
    const boton = fixture.nativeElement.querySelector('.cierre-sesion button') as HTMLButtonElement;
    boton.click();
    boton.click();
    responder('/activity-session/15', { id_actividad_sesion: 15, id_actividad: 7, nombre: 'Jornada real', estado: 'Activo', ...estado });
    await fixture.whenStable();
  }
  async function confirmarCierre() {
    await consultarCierre({ puede_finalizarse: true });
    const dialogo = fixture.nativeElement.querySelector('app-dialogo-confirmacion dialog[open]');
    (Array.from(dialogo.querySelectorAll('button')) as HTMLButtonElement[]).find(b => b.textContent?.trim() === 'Finalizar sesión')!.click();
    await fixture.whenStable();
    const peticion = http.expectOne('/api/activity-session/15/finalizar');
    expect(peticion.request.method).toBe('POST');
    expect(peticion.request.body).toEqual({ id_actividad: 7, id_sesion: 15 });
    return peticion;
  }
  it('respeta la capacidad efectiva sin exigir la regla antigua y conserva contadores de Laravel', async () => {
    await prepararCierre();
    permisos.delete('actividades.editar');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.cierre-sesion button[aria-label]').disabled).toBeFalse();
    const post = await confirmarCierre();
    expect(fixture.nativeElement.querySelector('.tarjeta-sesion').textContent).not.toContain('Finalizada');
    post.flush({ success: true, data: { finalizada: true, sesion: { id_actividad_sesion: 15, id_actividad: 7, nombre: 'Jornada real', estado: 'Finalizada' }, motivos_bloqueo: [] } });
    responder('/activity-session/15', { id_actividad_sesion: 15, id_actividad: 7, nombre: 'Jornada real', estado: 'Finalizada', finalizada: true,
      puede_finalizarse: false, motivos_bloqueo_finalizacion: [], motivos_bloqueo_certificacion: [],
      contadores: { inscritos_actividad_total: 2, inscritos_actividad_vigentes: 2, participantes_sesion: 2, presentes: 2, ausentes: 0, pendientes: 0, por_regularizar: null } });
    await fixture.whenStable(); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.tarjeta-sesion').textContent).toContain('2 presentes');
    expect(fixture.nativeElement.querySelector('.tarjeta-sesion').textContent).not.toContain('No determinable');
    expect(texto()).toContain('Activa');
    http.expectNone(req => req.method !== 'GET');
  });
  it('muestra el motivo vigente de Laravel sin confirmar ni escribir y permite reintentar', async () => {
    await prepararCierre(false);
    expect(texto()).not.toContain('Motivo de una respuesta anterior.');
    await consultarCierre({ puede_finalizarse: false,
      motivos_bloqueo_finalizacion: ['Falta una política aprobada de cierre, estados de asistencia y regularizaciones.'] });
    expect(texto()).toContain('Falta una política aprobada de cierre, estados de asistencia y regularizaciones.');
    expect(fixture.nativeElement.querySelector('.cierre-sesion button').disabled).toBeFalse();
    expect(fixture.nativeElement.querySelector('app-dialogo-confirmacion dialog[open]')).toBeNull();
    http.expectNone(req => req.method !== 'GET');
  });
  it('evita un cierre duplicado si Laravel devuelve una sesión ya finalizada', async () => {
    await prepararCierre(true);
    await consultarCierre({ estado: 'Finalizada', finalizada: true, puede_finalizarse: false });
    expect(fixture.nativeElement.querySelector('.badge-exito').textContent).toBe('Finalizada');
    expect(fixture.nativeElement.querySelector('.cierre-sesion button')).toBeNull();
    expect(fixture.nativeElement.querySelector('app-dialogo-confirmacion dialog[open]')).toBeNull();
    http.expectNone(req => req.method !== 'GET');
  });
  it('finaliza solo la sesión, consulta capacidades y conserva la actividad Activa', async () => {
    const sesion = await prepararCierre(false, true);
    const peticion = await confirmarCierre();
    fixture.detectChanges();
    const botones = fixture.nativeElement.querySelectorAll('.cierre-sesion button') as NodeListOf<HTMLButtonElement>;
    expect(botones[0].getAttribute('aria-busy')).toBe('true');
    expect(botones[1].getAttribute('aria-busy')).toBe('false');
    expect(botones[1].disabled).toBeFalse();
    botones[1].click();
    http.expectNone('/api/activity-session/16');
    http.expectNone('/api/activity-session/16/finalizar');
    peticion.flush({ success: true, data: { finalizada: true, sesion: { ...sesion, estado: 'Finalizada' }, estado_actividad: 'Activa', motivos_bloqueo: [] } });
    fixture.detectChanges();
    const segundoBoton = fixture.nativeElement.querySelector('.cierre-sesion button') as HTMLButtonElement;
    expect(segundoBoton.getAttribute('aria-disabled')).toBeNull();
    responder('/activity-session/15', { ...sesion, estado: 'Finalizada', puede_finalizarse: false, puede_certificarse: false, motivos_bloqueo_finalizacion: [], motivos_bloqueo_certificacion: ['Falta relación persistente con la sesión.'] });
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.tarjeta-sesion').textContent).toContain('Finalizada');
    expect(texto()).toContain('Activa');
    const tarjetas = fixture.nativeElement.querySelectorAll('.tarjeta-sesion') as NodeListOf<HTMLElement>;
    expect(tarjetas[1].textContent).toContain('Segunda jornada');
    expect(tarjetas[1].textContent).not.toContain('Finalizada');
    expect(tarjetas[1].querySelector<HTMLButtonElement>('.cierre-sesion button')?.disabled).toBeFalse();
    http.expectNone('/api/activity-session/16/finalizar');
    http.expectNone(req => req.method !== 'GET');
  });
  it('conserva Finalizada si falla la recarga de capacidades después de un cierre confirmado', async () => {
    const sesion = await prepararCierre(); const peticion = await confirmarCierre();
    peticion.flush({ success: true, data: { finalizada: true, sesion: { ...sesion, estado: 'Finalizada' }, motivos_bloqueo: [] } });
    http.expectOne('/api/activity-session/15').flush({ message: 'No se pudo consultar capacidades.' }, { status: 500, statusText: 'Error' });
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.tarjeta-sesion').textContent).toContain('Finalizada');
    expect(texto()).toContain('No se pudo consultar capacidades.');
    http.expectNone(req => req.method !== 'GET');
  });
  it('muestra los motivos exactos de un conflicto al finalizar sin cambiar el estado local', async () => {
    const sesion = await prepararCierre(); const peticion = await confirmarCierre();
    peticion.flush({ success: false, message: 'No se puede finalizar la sesión.', data: { finalizada: false, sesion,
      motivos_bloqueo: ['Falta una política aprobada de cierre, estados de asistencia y regularizaciones.'] } }, { status: 409, statusText: 'Conflict' });
    await fixture.whenStable();
    expect(texto()).toContain('Falta una política aprobada de cierre, estados de asistencia y regularizaciones.');
    expect(fixture.nativeElement.querySelector('.tarjeta-sesion').textContent).not.toContain('Finalizada');
    http.expectNone(req => req.method !== 'GET');
  });

  it('abre la asistencia de cada sesión con sus identificadores independientes', async () => {
    ['actividades.ver', 'participantes.ver'].forEach(p => permisos.add(p));
    responder('/activity/7', actividad); catalogos(); responder('/participation', []); responder('/attendance/list', []);
    responder('/activity-session', [{ id_actividad_sesion: 15, id_actividad: 7, nombre: 'Primera' }, { id_actividad_sesion: 16, id_actividad: 7, nombre: 'Segunda' }]); await fixture.whenStable();
    const navegar = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    const botones = fixture.nativeElement.querySelectorAll('button[aria-label="Asistencia de sesión"]');
    botones[0].click(); botones[1].click();
    expect(navegar.calls.allArgs()).toEqual([[['/certificaciones/actividades', 7, 'sesiones', 15, 'asistencia']], [['/certificaciones/actividades', 7, 'sesiones', 16, 'asistencia']]]);
    http.expectNone(req => req.method !== 'GET');
  });
  it('retira el modal de asistencia y conserva el acceso a participantes sin duplicar tablas', async () => {
    ['actividades.ver', 'participantes.ver'].forEach(p => permisos.add(p));
    responder('/activity/7', actividad); catalogos(); responder('/participation', []); responder('/attendance/list', []);
    responder('/activity-session', [{ id_actividad_sesion: 15, id_actividad: 7, nombre: 'Primera' }]); await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.modal-asistencia')).toBeNull();
    expect(fixture.nativeElement.querySelector('a[aria-label="Consultar participantes"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('.asistencia-principal')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.tarjetas-detalle table')).toBeNull();
    http.expectNone(req => req.method !== 'GET');
  });

  it('inscribe desde la tarjeta con el formulario existente, actividad protegida y sesión explícita', async () => {
    ['actividades.ver', 'participantes.ver', 'participantes.crear'].forEach(p => permisos.add(p));
    responder('/activity/7', actividad); catalogos(); responder('/participation', []); responder('/attendance/list', []);
    responder('/activity-session', [{ id_actividad_sesion: 15, id_actividad: 7, nombre: 'Primera jornada' }]); await fixture.whenStable();
    fixture.nativeElement.querySelector('button[aria-label="Inscribir participante"]').click(); await fixture.whenStable();
    responder('/participation', []); responder('/persons/list', [{ id_persona: 41, nombres: 'Ana', apellido_paterno: 'Pérez' }]); responder('/participation-type', [{ id_tipo_participacion: 5, nombre: 'Asistente', estado: true }]); await fixture.whenStable();
    const modal = fixture.nativeElement.querySelector('.modal-participante dialog') as HTMLDialogElement;
    expect(modal.open).toBeTrue(); expect(modal.textContent).toContain('Primera jornada'); expect(modal.textContent).toContain('Jornada municipal');
    const selector = modal.querySelector('#inscripcion-actividad') as HTMLSelectElement;
    expect(selector.value).toBe('7'); expect(selector.disabled).toBeTrue();
    for (const [id, valor] of [['inscripcion-persona', '41'], ['inscripcion-tipo', '5'], ['inscripcion-estado', 'Activo']]) {
      const campo = modal.querySelector('#' + id) as HTMLSelectElement; campo.value = valor; campo.dispatchEvent(new Event('change'));
    }
    modal.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    const post = http.expectOne('/api/participation');
    expect(post.request.method).toBe('POST'); expect(post.request.body.id_actividad).toBe(7);
    expect(post.request.body.id_persona).toBe(41); expect(post.request.body.id_sesion).toBeUndefined(); expect(post.request.body.id_actividad_sesion).toBe(15);
    const inscrito = { id_participacion: 30, id_actividad: 7, id_persona: 41, id_tipo_participacion: 5, fecha_inscripcion: '2026-11-05', estado: 'Activo' };
    post.flush({ success: true, message: 'Inscrito', data: inscrito }); await fixture.whenStable();
    responder('/activity-session', [{ id_actividad_sesion: 15, id_actividad: 7, nombre: 'Primera jornada' }]);
    responder('/participation', [inscrito]); responder('/persons/list', [{ id_persona: 41, nombres: 'Ana', apellido_paterno: 'Pérez' }]); responder('/participation-type', [{ id_tipo_participacion: 5, nombre: 'Asistente', estado: true }]); await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.indicadores dd').textContent.trim()).toBe('No informado');
    expect(fixture.nativeElement.querySelector('.tarjeta-sesion').textContent).not.toContain('1 inscritos');
    expect(fixture.nativeElement.querySelector('.tarjetas-detalle table')).toBeNull();
    http.expectNone(req => req.url.includes('/attendance') && req.method !== 'GET'); http.expectNone('/api/activity/7');
  });
});
