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

  it('presenta cuatro iconos y abre asistencia y detalle en modales sin cambiar de ruta ni repetir consultas', async () => {
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
    for (const tarjeta of tarjetas) {
      expect(tarjeta.querySelectorAll('.acciones-sesion > button').length).toBe(4);
      expect(Array.from(tarjeta.querySelectorAll('.acciones-sesion > button')).every(b => !!b.getAttribute('title') && !!b.getAttribute('aria-label'))).toBeTrue();
    }
    expect(fixture.nativeElement.querySelector('#panel-sesion')).toBeNull();
    expect(fixture.nativeElement.querySelector('.tarjetas-detalle table')).toBeNull();
    const url = TestBed.inject(Router).url;
    const ponentes = jasmine.createSpy('ponentes'); fixture.componentInstance.gestionarPonentes.subscribe(ponentes);
    tarjetas[0].querySelectorAll('button')[1].click(); expect(ponentes).toHaveBeenCalledWith(jasmine.objectContaining({ id_actividad: 7 }));
    const asistencia = tarjetas[0].querySelectorAll('button')[3]; asistencia.focus(); asistencia.click(); await fixture.whenStable();
    const dialogo = fixture.nativeElement.querySelector('.modal-asistencia dialog') as HTMLDialogElement;
    expect(dialogo.open).toBeTrue(); expect(dialogo.textContent).toContain('Control de asistencia — Jornada real');
    expect(dialogo.textContent).toContain('Jornada municipal'); expect(dialogo.textContent).toContain('Salida pendiente');
    expect(dialogo.querySelectorAll('tbody tr').length).toBe(2);
    expect(dialogo.querySelector('form.filtros')).toBeNull();
    expect(dialogo.querySelector('.circulo-presente')!.getAttribute('aria-pressed')).toBe('true');
    expect(getComputedStyle(dialogo).overflow).toBe('hidden');
    (dialogo.querySelector('.pie-asistencia button') as HTMLButtonElement).click(); await fixture.whenStable();
    expect(dialogo.open).toBeFalse(); expect(document.activeElement).toBe(asistencia);
    tarjetas[1].querySelectorAll('button')[3].click(); await fixture.whenStable();
    expect(dialogo.querySelectorAll('.circulo-asistencia[aria-pressed="true"]').length).toBe(0);
    (dialogo.querySelector('.pie-asistencia button') as HTMLButtonElement).click(); await fixture.whenStable();
    tarjetas[0].querySelector('button')!.click(); await fixture.whenStable(); responder('/activity-session/15', sesiones[0]); await fixture.whenStable();
    const detalle = fixture.nativeElement.querySelector('.modal-detalle-sesion dialog') as HTMLDialogElement;
    expect(detalle.open).toBeTrue(); expect(detalle.textContent).toContain('08:00');
    expect(TestBed.inject(Router).url).toBe(url);
    http.expectNone(req => req.method !== 'GET'); http.expectNone('/api/activity-session'); http.expectNone('/api/participation');
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
  it('reserva finalización y certificación sin escribir estados y ofrece consulta contextual aunque la actividad siga Activa', async () => {
    permisos.add('actividades.ver'); permisos.add('emision.ver'); permisos.add('participantes.ver');
    responder('/activity/7', actividad); catalogos(); responder('/participation', []);
    responder('/attendance/list', []);
    responder('/activity-session', [{ id_actividad_sesion: 15, id_actividad: 7, nombre: 'Jornada real', estado: 'culminado' }]); await fixture.whenStable();
    const tarjeta = fixture.nativeElement.querySelector('.tarjeta-sesion') as HTMLElement;
    expect(tarjeta.dataset['actividadId']).toBe('7'); expect(tarjeta.dataset['sesionId']).toBe('15');
    const acciones = tarjeta.querySelectorAll<HTMLButtonElement>('.certificacion-sesion button');
    expect(acciones.length).toBe(2); expect(Array.from(acciones).every(b => b.disabled && !!b.title)).toBeTrue();
    acciones[0].click(); acciones[1].click();
    expect(tarjeta.querySelector('.consulta-certificacion')?.getAttribute('href')).toBe('/certificaciones/generar-emitir?id_actividad=7&id_sesion=15&origen=sesion&modalidad=sesion');
    expect(fixture.nativeElement.querySelector('app-dialogo-confirmacion dialog[open]')).toBeNull();
    http.expectNone(req => req.method !== 'GET');
  });

  async function prepararCierre(puedeFinalizar = true) {
    ['actividades.ver', 'actividades.editar', 'emision.ver', 'emision.crear', 'participantes.ver'].forEach(p => permisos.add(p));
    responder('/activity/7', actividad); catalogos(); responder('/participation', []); responder('/attendance/list', []);
    const sesion = { id_actividad_sesion: 15, id_actividad: 7, nombre: 'Jornada real', estado: 'Activo' };
    responder('/activity-session', [sesion]); await fixture.whenStable();
    fixture.debugElement.query(By.css('.certificacion-sesion')).triggerEventHandler('toggle', { target: { open: true } });
    await fixture.whenStable();
    responder('/activity-session/15', { ...sesion, puede_finalizarse: puedeFinalizar,
      motivos_bloqueo_finalizacion: puedeFinalizar ? [] : ['Falta una política aprobada de cierre, estados de asistencia y regularizaciones.'],
      puede_certificarse: false, motivos_bloqueo_certificacion: ['Falta relación persistente con la sesión.'] });
    await fixture.whenStable();
    return sesion;
  }
  async function confirmarCierre() {
    fixture.nativeElement.querySelector('.certificacion-sesion button').click(); await fixture.whenStable();
    const dialogo = fixture.nativeElement.querySelector('app-dialogo-confirmacion dialog[open]');
    (Array.from(dialogo.querySelectorAll('button')) as HTMLButtonElement[]).find(b => b.textContent?.trim() === 'Finalizar sesión')!.click();
    await fixture.whenStable();
    const peticion = http.expectOne('/api/activity-session/15/finalizar');
    expect(peticion.request.method).toBe('POST');
    expect(peticion.request.body).toEqual({});
    return peticion;
  }
  it('respeta la capacidad efectiva sin exigir la regla antigua y conserva contadores de Laravel', async () => {
    await prepararCierre();
    permisos.delete('actividades.editar');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.certificacion-sesion button').disabled).toBeFalse();
    const post = await confirmarCierre();
    expect(fixture.nativeElement.querySelector('.tarjeta-sesion').textContent).not.toContain('Finalizada');
    post.flush({ success: true, data: { finalizada: true, sesion: { id_actividad_sesion: 15, id_actividad: 7, nombre: 'Jornada real', estado: 'Finalizada' }, motivos_bloqueo: [] } });
    responder('/activity-session/15', { id_actividad_sesion: 15, id_actividad: 7, nombre: 'Jornada real', estado: 'Finalizada', finalizada: true,
      puede_finalizarse: false, motivos_bloqueo_finalizacion: [], motivos_bloqueo_certificacion: [],
      contadores: { inscritos_actividad_total: 2, inscritos_actividad_vigentes: 2, participantes_sesion: 2, presentes: 2, ausentes: 0, pendientes: 0, por_regularizar: null } });
    await fixture.whenStable(); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.tarjeta-sesion').textContent).toContain('2 presentes');
    expect(fixture.nativeElement.querySelector('.tarjeta-sesion').textContent).toContain('No determinable');
    expect(texto()).toContain('Activa');
    http.expectNone(req => req.method !== 'GET');
  });
  it('muestra el bloqueo institucional sin habilitar cierre ni certificación por los permisos del usuario', async () => {
    await prepararCierre(false);
    expect(texto()).toContain('Falta una política aprobada de cierre, estados de asistencia y regularizaciones.');
    expect(Array.from(fixture.nativeElement.querySelectorAll('.certificacion-sesion button') as NodeListOf<HTMLButtonElement>).every(b => b.disabled)).toBeTrue();
    http.expectNone(req => req.method !== 'GET');
  });
  it('finaliza solo la sesión, consulta capacidades y conserva la actividad Activa', async () => {
    const sesion = await prepararCierre();
    const peticion = await confirmarCierre();
    peticion.flush({ success: true, data: { finalizada: true, sesion: { ...sesion, estado: 'Finalizada' }, estado_actividad: 'Activa', motivos_bloqueo: [] } });
    responder('/activity-session/15', { ...sesion, estado: 'Finalizada', puede_finalizarse: false, puede_certificarse: false, motivos_bloqueo_finalizacion: [], motivos_bloqueo_certificacion: ['Falta relación persistente con la sesión.'] });
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.tarjeta-sesion').textContent).toContain('Finalizada');
    expect(texto()).toContain('Activa');
    expect(Array.from(fixture.nativeElement.querySelectorAll('.certificacion-sesion button') as NodeListOf<HTMLButtonElement>).every(b => b.disabled)).toBeTrue();
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

  async function prepararModalAsistencia(): Promise<HTMLDialogElement> {
    ['actividades.ver', 'participantes.ver', 'participantes.crear'].forEach(p => permisos.add(p));
    responder('/activity/7', actividad); catalogos();
    responder('/activity-session', [{ id_actividad_sesion: 15, id_actividad: 7, nombre: 'Jornada real', fecha: '2026-11-04', hora_inicio: '08:00', hora_fin: '09:00' }]);
    responder('/attendance/list', []);
    responder('/participation', [{ id_participacion: 30, id_actividad: 7, id_persona: 41 }]);
    responder('/persons/list', [{ id_persona: 41, nombres: 'Ana', apellido_paterno: 'Pérez' }]); responder('/participation-type', []);
    await fixture.whenStable();
    fixture.nativeElement.querySelector('button[aria-label="Asistencia de sesión"]').click(); await fixture.whenStable();
    return fixture.nativeElement.querySelector('.modal-asistencia dialog');
  }

  it('selecciona localmente, guarda con Laravel y recarga asistencia actualizando la tarjeta sin recargar actividad', async () => {
    const modal = await prepararModalAsistencia();
    (modal.querySelector('.circulo-presente') as HTMLButtonElement).click(); await fixture.whenStable();
    expect(modal.textContent).toContain('Sin guardar'); http.expectNone(req => req.method !== 'GET');
    const guardar = modal.querySelector('.pie-asistencia .accion-principal') as HTMLButtonElement;
    expect(guardar.disabled).toBeFalse(); guardar.click(); guardar.click();
    const post = http.expectOne('/api/attendance/create');
    expect(post.request.body).toEqual({ id_participacion: 30, id_actividad_sesion: 15, estado: 'PRESENTE' });
    modal.dispatchEvent(new Event('cancel', { cancelable: true }));
    (modal.querySelector('.dialogo-cerrar') as HTMLButtonElement).click(); await fixture.whenStable();
    expect(modal.open).toBeTrue();
    expect(fixture.nativeElement.querySelector('app-dialogo-confirmacion dialog[open]')).toBeNull();
    post.flush({ success: true, data: { ID_ASISTENCIA: 80 } });
    const marca = { ID_ASISTENCIA: 80, ID_PARTICIPACION: 30, ID_ACTIVIDAD_SESION: 15, ESTADO: 'PRESENTE' };
    responder('/attendance/80', marca);
    responder('/attendance/list', [marca]); await fixture.whenStable();
    expect(modal.open).toBeTrue(); expect(modal.textContent).toContain('1 marcas confirmadas por Laravel');
    expect(modal.textContent).not.toContain('Sin guardar');
    expect(fixture.nativeElement.querySelector('.tarjeta-sesion').textContent).not.toContain('1 presentes');
    expect(guardar.disabled).toBeTrue();
    http.expectNone('/api/activity/7'); http.expectNone('/api/participation'); http.expectNone('/api/activity-session');
  });

  it('avisa al cerrar con Escape o X y conserva los cambios si se elige seguir editando', async () => {
    const modal = await prepararModalAsistencia();
    (modal.querySelector('.circulo-ausente') as HTMLButtonElement).click(); await fixture.whenStable();
    const evento = new Event('cancel', { cancelable: true }); modal.dispatchEvent(evento); await fixture.whenStable();
    expect(evento.defaultPrevented).toBeTrue(); expect(modal.open).toBeTrue();
    let confirmacion = fixture.nativeElement.querySelector('app-dialogo-confirmacion dialog[open]') as HTMLDialogElement;
    expect(confirmacion).not.toBeNull();
    (Array.from(confirmacion.querySelectorAll('button')).find(b => b.textContent?.trim() === 'Seguir editando')!).click(); await fixture.whenStable();
    expect(modal.open).toBeTrue(); expect(modal.textContent).toContain('Ausente · Sin guardar');
    (modal.querySelector('.dialogo-cerrar') as HTMLButtonElement).click(); await fixture.whenStable();
    confirmacion = fixture.nativeElement.querySelector('app-dialogo-confirmacion dialog[open]');
    (Array.from(confirmacion.querySelectorAll('button')).find(b => b.textContent?.trim() === 'Descartar cambios')!).click(); await fixture.whenStable();
    expect(modal.open).toBeFalse(); http.expectNone(req => req.method !== 'GET');
  });

  it('inscribe desde la tarjeta con el formulario existente, actividad protegida y sesión solo contextual', async () => {
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
    expect(post.request.body.id_persona).toBe(41); expect(post.request.body.id_sesion).toBeUndefined(); expect(post.request.body.id_actividad_sesion).toBeUndefined();
    const inscrito = { id_participacion: 30, id_actividad: 7, id_persona: 41, id_tipo_participacion: 5, fecha_inscripcion: '2026-11-05', estado: 'Activo' };
    post.flush({ success: true, message: 'Inscrito', data: inscrito }); await fixture.whenStable();
    responder('/participation', [inscrito]); responder('/persons/list', [{ id_persona: 41, nombres: 'Ana', apellido_paterno: 'Pérez' }]); responder('/participation-type', [{ id_tipo_participacion: 5, nombre: 'Asistente', estado: true }]); await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.indicadores dd').textContent.trim()).toBe('No informado');
    expect(fixture.nativeElement.querySelector('.tarjeta-sesion').textContent).not.toContain('1 inscritos');
    expect(fixture.nativeElement.querySelector('.tarjetas-detalle table')).toBeNull();
    http.expectNone(req => req.url.includes('/attendance') && req.method !== 'GET'); http.expectNone('/api/activity/7');
  });
});
