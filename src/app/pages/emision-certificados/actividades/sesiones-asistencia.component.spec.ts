import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';
import { routes } from '../../../app.routes';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { environment } from '../../../../environments/environment';

describe('Sesiones y asistencia con pestañas y CRUD existentes', () => {
  const base = environment.apiBaseUrl;
  const ruta = '/certificaciones/sesiones-asistencia';
  const sesiones = Array.from({ length: 41 }, (_, indice) => ({ id_actividad_sesion: indice + 1, id_actividad: 7,
    nombre: 'Sesión registrada ' + (indice + 1), fecha: '2026-11-02', hora_inicio: '08:00', hora_fin: '09:00', lugar: null, estado: 'Activa' }));
  const asistencias = Array.from({ length: 41 }, (_, indice) => ({ ID_ASISTENCIA: indice + 80, ID_PARTICIPACION: 50 + indice,
    ID_ACTIVIDAD_SESION: 3, HORA_ENTRADA: '08:00', HORA_SALIDA: '09:00', ESTADO: 'activo' }));
  let http: HttpTestingController;
  let harness: RouterTestingHarness;
  let permisos: Set<string>;

  beforeEach(() => {
    permisos = new Set(['actividades.ver', 'actividades.crear', 'actividades.editar', 'actividades.eliminar',
      'participantes.ver', 'participantes.crear', 'participantes.editar', 'participantes.eliminar']);
    TestBed.configureTestingModule({ providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting(),
      { provide: AuthService, useValue: { cargarSesion: () => of(true), tienePermiso: (clave: string) => permisos.has(clave), usuario: signal(null), modulos: signal([]) } },
    ] });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  const vista = () => harness.routeNativeElement!;
  function disparadorRegistro(): HTMLButtonElement | HTMLInputElement {
    if (vista().querySelector('#attendance-buscar-sesion')) {
      const check = vista().querySelector<HTMLInputElement>('tbody input[type="checkbox"]:not(:disabled)');
      if (!check) throw new Error('No hay inscripción pendiente para marcar');
      const detalle = check.closest('details'); if (detalle) detalle.open = true;
      return check;
    }
    return boton('Nuevo registro');
  }

  function catalogos(): void {
    for (const peticion of http.match(req => [base + '/activity', base + '/participation', base + '/activity-session'].includes(req.url))) {
      if (peticion.cancelled) continue;
      peticion.flush({ success: true, data: peticion.request.url.endsWith('/activity') ? [{ id_actividad: 7, nombre: 'Actividad existente' }]
        : peticion.request.url.endsWith('/participation') ? Array.from({ length: 41 }, (_, indice) => ({ id_participacion: 50 + indice, id_persona: 9, id_actividad: 7 })) : sesiones });
    }
    for (const peticion of http.match(base + '/persons/detail/9')) {
      peticion.flush({ success: true, data: { id_persona: 9, nombres: 'Ana', apellido_paterno: 'Perez', apellido_materno: null } });
    }
    for (const peticion of http.match(base + '/persons/list')) {
      if (peticion.cancelled) continue;
      peticion.flush({ success: true, data: [{ id_persona: 9, nombres: 'Ana', apellido_paterno: 'Perez', apellido_materno: null }] });
    }
  }
  function cargarSesiones(filas = sesiones): void {
    http.expectOne(base + '/activity-session').flush({ success: true, data: filas }); catalogos(); harness.detectChanges();
  }
  async function cargarAsistencias(filas = asistencias): Promise<void> {
    http.expectOne(base + '/attendance/list').flush({ success: true, data: filas }); catalogos(); harness.detectChanges(); if (!vista().querySelector<HTMLSelectElement>('[formControlName="actividad"]')?.value) await filtrar('actividad', '7'); if (!vista().querySelector<HTMLSelectElement>('[formControlName="sesion"]')?.value) await filtrar('sesion', '3');
  }
  async function iniciar(query = ''): Promise<void> {
    harness = await RouterTestingHarness.create(ruta + query); harness.detectChanges();
    const params = new URLSearchParams(query); const id = params.get('id_actividad') ?? params.get('actividad');
    if (id && /^[1-9]\d*$/.test(id)) {
      http.expectOne(base + '/activity/' + id).flush({ success: true, data: { id_actividad: Number(id), nombre: 'Actividad existente' } }); harness.detectChanges();
    }
  }
  async function seleccionar(id: string): Promise<void> {
    vista().querySelector<HTMLButtonElement>('#actividad-tab-' + id)!.click();
    await harness.fixture.whenStable(); harness.detectChanges();
  }
  function boton(texto: string, selector = 'app-listado-emision'): HTMLButtonElement {
    const encontrado = Array.from(vista().querySelectorAll<HTMLButtonElement>(selector + ' button')).find(elemento => elemento.textContent?.replace(/^add/, '').trim() === texto);
    if (!encontrado) throw new Error('Botón no encontrado: ' + texto);
    return encontrado;
  }
  async function filtrar(campo: string, valor: string): Promise<void> {
    const input = vista().querySelector<HTMLInputElement | HTMLSelectElement>('app-listado-emision [formControlName="' + campo + '"]')!;
    input.value = valor; input.dispatchEvent(new Event(input.tagName === 'SELECT' ? 'change' : 'input'));
    await harness.fixture.whenStable();
    harness.detectChanges();
  }

  it('recibe el ID de actividad en Sesiones y lo conserva al pasar a Asistencias', async () => {
    await iniciar('?actividad=7'); cargarSesiones();
    expect(vista().querySelector<HTMLSelectElement>('#activity-session-buscar-actividad')?.value).toBe('7');
    await seleccionar('asistencias'); await cargarAsistencias();
    expect(vista().querySelector<HTMLSelectElement>('#attendance-buscar-actividad')?.value).toBe('7');
    expect(TestBed.inject(Router).url).toContain('actividad=7');
    http.expectNone(req => req.method === 'POST');
  });
  it('abre Sesiones por defecto, con una sola instancia y sin consultar asistencias', async () => {
    await iniciar();
    http.expectNone(base + '/attendance/list');
    cargarSesiones([sesiones[0]]);
    expect(vista().querySelector('h1')?.textContent).toBe('Sesiones y asistencia');
    expect(vista().querySelectorAll('[role="tab"]').length).toBe(2);
    expect(vista().querySelector('#actividad-tab-sesiones')?.getAttribute('aria-selected')).toBe('true');
    expect(vista().querySelectorAll('app-listado-emision').length).toBe(1);
    expect(vista().querySelectorAll('table').length).toBe(1);
    expect(vista().querySelector('[role="tabpanel"]:not([hidden]) h2')?.textContent).toBe('Sesiones registradas');
    expect(vista().querySelectorAll('app-sidebar a[href="' + ruta + '"]').length).toBe(1);
    expect(vista().querySelector('app-sidebar a[aria-current="page"]')?.getAttribute('href')).toBe(ruta);
    http.expectNone(() => true);
  });

  it('al alternar monta solo Asistencias y conserva otros parámetros de la URL', async () => {
    await iniciar('?referencia=conservar'); cargarSesiones([sesiones[0]]);
    await seleccionar('asistencias'); await cargarAsistencias([asistencias[0]]);
    expect(TestBed.inject(Router).url).toContain('pestana=asistencias');
    expect(TestBed.inject(Router).url).toContain('referencia=conservar');
    expect(vista().querySelectorAll('app-listado-emision').length).toBe(1);
    expect(vista().querySelectorAll('table').length).toBe(1);
    expect(vista().querySelector('[role="tabpanel"]:not([hidden]) h2')?.textContent).toBe('Asistencias registradas');
    expect(vista().querySelector('#actividad-panel-activity-session')?.querySelector('app-listado-emision')).toBeNull();
    http.expectNone(() => true);
  });

  it('abre Asistencias por URL sin cargar el listado de Sesiones inactivo', async () => {
    await iniciar('?pestana=asistencias');
    // Sesiones se consulta una vez como catálogo para nombres y filtros dependientes.
    await cargarAsistencias([asistencias[0]]);
    expect(vista().querySelector('#actividad-tab-asistencias')?.getAttribute('aria-selected')).toBe('true');
    expect(vista().querySelectorAll('app-listado-emision').length).toBe(1);
  });

  it('admite sesiones explícito y usa Sesiones si la pestaña es desconocida', async () => {
    await iniciar('?pestana=desconocida'); cargarSesiones([sesiones[0]]);
    await harness.navigateByUrl(ruta + '?pestana=sesiones'); harness.detectChanges();
    expect(vista().querySelector('#actividad-tab-sesiones')?.getAttribute('aria-selected')).toBe('true');
    http.expectNone(() => true);
  });

  it('conserva filtros y paginación independientes sin mantener dos CRUD montados', async () => {
    await iniciar(); cargarSesiones();
    await filtrar('actividad', '7');
    boton('Siguiente').click(); harness.detectChanges();
    expect(vista().querySelector('.paginacion')?.textContent).toContain('Página 2');
    await seleccionar('asistencias'); await cargarAsistencias();
    expect(vista().querySelector<HTMLInputElement>('app-listado-emision .filtros input')?.value).toBe('');
    await filtrar('nombre', 'Ana');
    boton('Siguiente').click(); harness.detectChanges();
    await seleccionar('sesiones'); cargarSesiones();
    expect(vista().querySelector('.paginacion')?.textContent).toContain('Página 2');
    expect(vista().querySelector<HTMLSelectElement>('app-listado-emision [formControlName="actividad"]')?.value).toBe('7');
    await seleccionar('asistencias'); await cargarAsistencias();
    expect(vista().querySelector('.paginacion')?.textContent).toContain('Página 2');
    expect(vista().querySelector<HTMLInputElement>('app-listado-emision .filtros input')?.value).toBe('Ana');
    expect(vista().querySelectorAll('app-listado-emision').length).toBe(1);
    http.expectNone(() => true);
  });

  for (const caso of [
    { pestana: 'sesiones', recurso: 'activity-session', id: 1, detalle: sesiones[0], detalleUrl: '/activity-session/1', eliminarUrl: '/activity-session/1' },
  ]) {
    it('Nuevo registro usa el formulario de ' + caso.pestana, async () => {
      await iniciar('?pestana=' + caso.pestana);
      if (caso.pestana === 'sesiones') cargarSesiones([sesiones[0]]); else await cargarAsistencias([]);
      disparadorRegistro().click(); harness.detectChanges(); catalogos(); harness.detectChanges();
      expect(vista().querySelectorAll('app-formulario-emision').length).toBe(1);
      const campo = caso.pestana === 'sesiones' ? 'nombre' : 'hora_entrada';
      expect(vista().querySelector('#' + caso.recurso + '-' + campo)).not.toBeNull();
      http.expectNone(req => req.method !== 'GET');
    });

    it('Ver, Editar y Eliminar respetan la entidad y los históricos de ' + caso.pestana, async () => {
      await iniciar('?pestana=' + caso.pestana);
      if (caso.pestana === 'sesiones') cargarSesiones([sesiones[0]]); else await cargarAsistencias([]);
      boton('Ver detalle', 'tbody').click();
      http.expectOne(base + caso.detalleUrl).flush({ success: true, data: caso.detalle }); harness.detectChanges();
      expect(vista().querySelector('section.detalle h2')?.textContent).toBe('Detalle #' + caso.id);
      boton('Editar', 'tbody').click(); harness.detectChanges();
      http.expectOne(base + caso.detalleUrl).flush({ success: true, data: caso.detalle }); catalogos(); harness.detectChanges();
      expect(vista().querySelectorAll('app-formulario-emision').length).toBe(1);
      boton('Cancelar', 'app-formulario-emision .acciones').click(); harness.detectChanges();
      boton('Eliminar', 'tbody').click(); harness.detectChanges();
      vista().querySelector<HTMLButtonElement>('app-dialogo-confirmacion .dialogo-acciones button.btn-primary')!.click();
      await Promise.resolve();
      const eliminar = http.expectOne(base + caso.eliminarUrl);
      expect(eliminar.request.method).toBe('DELETE');
      eliminar.flush({ message: 'El registro tiene históricos y no puede eliminarse.' }, { status: 409, statusText: 'Conflict' }); harness.detectChanges();
      expect(vista().textContent).toContain('históricos');
      expect(vista().querySelectorAll('tbody tr').length).toBe(1);
    });
  }

  it('conserva permisos de cada entidad y muestra el 403 sin usar datos de la otra pestaña', async () => {
    permisos.delete('participantes.crear'); permisos.delete('participantes.editar'); permisos.delete('participantes.eliminar');
    await iniciar('?pestana=asistencias'); await cargarAsistencias([asistencias[0]]);
    expect(Array.from(vista().querySelectorAll('app-listado-emision button')).some(elemento => elemento.textContent?.replace(/^add/, '').trim() === 'Nuevo registro')).toBeFalse();
    expect(Array.from(vista().querySelectorAll('tbody button')).some(elemento => ['Editar', 'Eliminar'].includes(elemento.textContent?.trim() ?? ''))).toBeFalse();
    await seleccionar('sesiones'); cargarSesiones([sesiones[0]]);
    await seleccionar('asistencias');
    http.expectOne(base + '/attendance/list').flush({ message: 'No autorizado para consultar asistencias.' }, { status: 403, statusText: 'Forbidden' }); harness.detectChanges();
    catalogos(); harness.detectChanges();
    expect(vista().textContent).toContain('No autorizado para consultar asistencias');
    expect(vista().querySelector('table')).toBeNull();
  });

  it('soporta Flechas, Inicio y Fin con el patrón ARIA de Gestión de Personas', async () => {
    await iniciar(); cargarSesiones([sesiones[0]]);
    const sesionesTab = vista().querySelector<HTMLButtonElement>('#actividad-tab-sesiones')!;
    sesionesTab.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    await harness.fixture.whenStable(); harness.detectChanges(); await cargarAsistencias([asistencias[0]]);
    expect(vista().querySelector('#actividad-tab-asistencias')?.getAttribute('tabindex')).toBe('0');
    expect(vista().querySelector('#actividad-tab-sesiones')?.getAttribute('tabindex')).toBe('-1');
    vista().querySelector('#actividad-tab-asistencias')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    await harness.fixture.whenStable(); harness.detectChanges(); cargarSesiones([sesiones[0]]);
    expect(TestBed.inject(Router).url).toBe(ruta + '?actividad_filtro=7&sesion_filtro=3');
    expect(vista().querySelector('#actividad-tab-sesiones')?.getAttribute('aria-selected')).toBe('true');
  });

  it('no recarga el CRUD si solo cambia otro parámetro o se pulsa la pestaña ya activa', async () => {
    await iniciar(); cargarSesiones([sesiones[0]]);
    await seleccionar('sesiones');
    await harness.navigateByUrl(ruta + '?referencia=otra'); harness.detectChanges();
    expect(vista().querySelectorAll('app-listado-emision').length).toBe(1);
    http.expectNone(() => true);
  });

  it('conserva la pantalla local de Actividades al integrar Sesiones y asistencia', async () => {
    harness = await RouterTestingHarness.create('/certificaciones/actividades');
    http.expectOne(base + '/activity').flush({ success: true, data: [] });
    http.expectOne(base + '/areas/list').flush({ success: true, data: [] });
    http.expectOne(base + '/ativicty-type').flush({ success: true, data: [] }); harness.detectChanges();
    expect(vista().querySelector('app-listar-actividades')).not.toBeNull();
    expect(vista().querySelectorAll('app-listado-emision').length).toBe(0);
    expect(vista().querySelector('[role="tablist"]')?.getAttribute('aria-label')).toBe('Actividades');
  });

  function completarNuevaSesion(): void {
    const valores: Record<string, string> = { id_actividad: '7', nombre: 'Nueva sesión', fecha: '2026-11-02',
      hora_inicio: '08:00', hora_fin: '09:00', lugar: '', estado: 'Activa' };
    for (const [nombre, valor] of Object.entries(valores)) {
      const campo = vista().querySelector<HTMLInputElement | HTMLSelectElement>('#activity-session-' + nombre)!;
      campo.value = valor;
      campo.dispatchEvent(new Event(campo.tagName === 'SELECT' ? 'change' : 'input'));
    }
    vista().querySelector('app-formulario-emision form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    harness.detectChanges();
  }

  it('muestra el formulario modal de sesión y Cancelar restaura el listado sin guardar', async () => {
    await iniciar(); cargarSesiones([sesiones[0]]);
    expect(vista().querySelector('table')).not.toBeNull();
    disparadorRegistro().click(); harness.detectChanges(); catalogos(); harness.detectChanges();
    expect(vista().querySelectorAll('app-formulario-emision').length).toBe(1);
    expect(vista().querySelectorAll('app-formulario-emision form').length).toBe(1);
    expect(vista().querySelector('legend')?.textContent?.trim()).toBe('Nuevo registro');
    expect(vista().querySelector('app-listado-emision .filtros')).not.toBeNull();
    expect(vista().querySelector('table')).not.toBeNull();
    expect(vista().querySelector('.paginacion')).not.toBeNull();
    expect(vista().querySelector('main app-page-title')).not.toBeNull();
    expect(vista().querySelector('[role="tablist"]')).not.toBeNull();
    expect(Array.from(vista().querySelectorAll('button')).filter(elemento => elemento.textContent?.replace(/^add/, '').trim() === 'Nuevo registro').length).toBe(1);
    expect(vista().textContent).not.toContain('Cambios guardados');
    expect(vista().querySelectorAll('app-sidebar').length).toBe(1);
    expect(vista().querySelectorAll('app-header').length).toBe(1);
    boton('Cancelar', 'app-formulario-emision .acciones').click(); harness.detectChanges();
    expect(vista().querySelector('app-formulario-emision')).toBeNull();
    expect(vista().querySelector('table')).not.toBeNull();
    expect(vista().querySelector('.filtros')).not.toBeNull();
    expect(vista().querySelector('.paginacion')).not.toBeNull();
    expect(vista().querySelector('main h2')?.textContent).toBe('Sesiones registradas');
    http.expectNone(req => req.method !== 'GET');
  });

  it('tras guardar vuelve al listado actualizado y limpia el éxito al abrir otro formulario', async () => {
    await iniciar(); cargarSesiones([sesiones[0]]);
    disparadorRegistro().click(); harness.detectChanges(); catalogos(); harness.detectChanges();
    completarNuevaSesion();
    const registro = { ...sesiones[0], id_actividad_sesion: 99, nombre: 'Nueva sesión' };
    const guardar = http.expectOne(req => req.url === base + '/activity-session' && req.method === 'POST');
    guardar.flush({ success: true, data: registro }); harness.detectChanges(); cargarSesiones([registro]);
    expect(vista().querySelector('app-formulario-emision')).toBeNull();
    expect(vista().querySelector('tbody')?.textContent).toContain('Nueva sesión');
    expect(vista().textContent).toContain('Cambios guardados.');
    disparadorRegistro().click(); harness.detectChanges(); catalogos(); harness.detectChanges();
    expect(vista().querySelectorAll('app-formulario-emision').length).toBe(1);
    expect(vista().textContent).not.toContain('Cambios guardados');
    expect(vista().querySelector('table')).not.toBeNull();
  });

  it('si guardar falla conserva el formulario y sus datos manteniendo el listado', async () => {
    await iniciar(); cargarSesiones([sesiones[0]]);
    disparadorRegistro().click(); harness.detectChanges(); catalogos(); harness.detectChanges();
    completarNuevaSesion();
    http.expectOne(req => req.url === base + '/activity-session' && req.method === 'POST')
      .flush({ message: 'No se pudo guardar la sesión.', errors: { nombre: ['Revisa el nombre.'] } }, { status: 422, statusText: 'Unprocessable Entity' });
    harness.detectChanges();
    expect(vista().querySelectorAll('app-formulario-emision').length).toBe(1);
    expect(vista().querySelector<HTMLInputElement>('#activity-session-nombre')?.value).toBe('Nueva sesión');
    expect(vista().querySelector('#activity-session-nombre-error')?.textContent).toContain('Revisa el nombre.');
    expect(vista().querySelector('table')).not.toBeNull();
    expect(vista().querySelector('.filtros')).not.toBeNull();
    expect(vista().querySelector('.paginacion')).not.toBeNull();
    http.expectNone(req => req.url === base + '/activity-session' && req.method === 'GET');
  });

  function completarNuevaAsistencia(): void {
    const valores: Record<string, string> = { id_participacion: '50', id_actividad_sesion: '3',
      hora_entrada: '09:15', hora_salida: '10:30', estado: 'activo' };
    for (const [nombre, valor] of Object.entries(valores)) {
      const campo = vista().querySelector<HTMLInputElement | HTMLSelectElement>('#attendance-' + nombre)!;
      campo.value = valor;
      campo.dispatchEvent(new Event(campo.tagName === 'SELECT' ? 'change' : 'input'));
    }
    vista().querySelector('app-formulario-emision form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    harness.detectChanges();
  }

  it('Asistencias abre el formulario modal y Cancelar restaura el listado sin guardar', async () => {
    await iniciar('?pestana=asistencias'); await cargarAsistencias([]);
    expect(vista().querySelector('app-formulario-emision')).toBeNull();
    expect(vista().querySelector('table')).not.toBeNull();
    disparadorRegistro().click(); harness.detectChanges(); catalogos(); harness.detectChanges();
    expect(vista().querySelectorAll('app-formulario-emision').length).toBe(1);
    expect(vista().querySelectorAll('app-formulario-emision form').length).toBe(1);
    expect(vista().querySelectorAll('app-formulario-emision .grid > .form-field').length).toBe(5);
    expect(vista().querySelector('#attendance-id_asistencia')).toBeNull();
    expect(vista().querySelector('legend')?.textContent?.trim()).toBe('Nuevo registro');
    expect(vista().querySelector('table')).not.toBeNull();
    expect(vista().querySelector('.filtros')).not.toBeNull();
    expect(vista().querySelector('.paginacion')).not.toBeNull();
    expect(vista().querySelector('[role="tablist"]')).not.toBeNull();
    expect(vista().querySelector('main app-page-title')).not.toBeNull();
    expect(Array.from(vista().querySelectorAll('button')).filter(elemento => elemento.textContent?.replace(/^add/, '').trim() === 'Nuevo registro').length).toBe(0);
    expect(vista().textContent).not.toContain('Cambios guardados');
    boton('Cancelar', 'app-formulario-emision .acciones').click(); harness.detectChanges();
    expect(vista().querySelector('app-formulario-emision')).toBeNull();
    expect(vista().querySelector('table')).not.toBeNull();
    expect(vista().querySelector('.filtros')).not.toBeNull();
    expect(vista().querySelector('.paginacion')).not.toBeNull();
    expect(vista().querySelector('main h2')?.textContent).toBe('Asistencias registradas');
    expect(vista().querySelector('#actividad-tab-asistencias')?.getAttribute('aria-selected')).toBe('true');
    expect(vista().querySelectorAll('app-sidebar').length).toBe(1);
    expect(vista().querySelectorAll('app-header').length).toBe(1);
    http.expectNone(req => req.method !== 'GET');
  });

  it('Asistencias regresa al listado actualizado tras guardar y limpia el aviso al volver a crear', async () => {
    await iniciar('?pestana=asistencias'); await cargarAsistencias([]);
    disparadorRegistro().click(); harness.detectChanges(); catalogos(); harness.detectChanges();
    expect(vista().querySelector<HTMLInputElement>('tbody input[type="checkbox"]')?.checked).toBeFalse();
    completarNuevaAsistencia();
    const guardar = http.expectOne(req => req.url === base + '/attendance/create' && req.method === 'POST');
    expect(guardar.request.body).toEqual({ id_participacion: 50, id_actividad_sesion: 3, hora_entrada: '09:15', hora_salida: '10:30', estado: 'activo' });
    expect(vista().querySelector<HTMLInputElement>('tbody input[type="checkbox"]')?.checked).toBeFalse();
    const registro = { ...asistencias[0], ID_ASISTENCIA: 99, HORA_ENTRADA: '09:15', HORA_SALIDA: '10:30' };
    guardar.flush({ success: true, data: registro }); harness.detectChanges(); await cargarAsistencias([registro]);
    expect(vista().querySelector('app-formulario-emision')).toBeNull();
    expect(vista().querySelector('tbody')?.textContent).toContain('09:15');
    expect(vista().querySelector<HTMLInputElement>('tbody input[type="checkbox"]')?.checked).toBeTrue();
    expect(vista().textContent).toContain('Cambios guardados.');
    disparadorRegistro().click(); harness.detectChanges(); catalogos(); harness.detectChanges();
    expect(vista().querySelectorAll('app-formulario-emision').length).toBe(1);
    expect(vista().querySelector('table')).not.toBeNull();
    expect(vista().textContent).not.toContain('Cambios guardados');
  });

  it('Asistencias conserva formulario y datos cuando el servidor rechaza el guardado', async () => {
    await iniciar('?pestana=asistencias'); await cargarAsistencias([]);
    disparadorRegistro().click(); harness.detectChanges(); catalogos(); harness.detectChanges();
    completarNuevaAsistencia();
    http.expectOne(req => req.url === base + '/attendance/create' && req.method === 'POST')
      .flush({ message: 'No se puede registrar esta asistencia.' }, { status: 409, statusText: 'Conflict' });
    harness.detectChanges();
    expect(vista().querySelectorAll('app-formulario-emision').length).toBe(1);
    expect(vista().querySelector<HTMLInputElement>('#attendance-hora_entrada')?.value).toBe('09:15');
    expect(vista().querySelector<HTMLSelectElement>('#attendance-id_participacion')?.value).toBe('50');
    expect(vista().querySelector('app-formulario-emision')?.textContent).toContain('No se puede registrar esta asistencia.');
    expect(vista().querySelector('table')).not.toBeNull();
    expect(vista().querySelector('.filtros')).not.toBeNull();
    expect(vista().querySelector('.paginacion')).not.toBeNull();
    expect(vista().textContent).not.toContain('Cambios guardados');
    http.expectNone(req => req.url === base + '/attendance/list');
  });
  for (const caso of [
    { pestana: 'sesiones', recurso: 'activity-session', destino: 'asistencias', campos: 7, post: '/activity-session' },
    { pestana: 'asistencias', recurso: 'attendance', destino: 'sesiones', campos: 5, post: '/attendance/create' },
  ]) {
    it(caso.pestana + ': boton unico en encabezado, modal accesible, URL estable y foco al cancelar', async () => {
      await iniciar('?pestana=' + caso.pestana);
      if (caso.pestana === 'sesiones') cargarSesiones([sesiones[0]]); else await cargarAsistencias([]);
      const abrir = disparadorRegistro();
      const encabezado = vista().querySelector<HTMLElement>('.encabezado-registro')!;
      expect(encabezado.contains(abrir)).toBe(caso.pestana === 'sesiones');
      expect(encabezado.querySelector('h2')).not.toBeNull();
      expect(getComputedStyle(encabezado).justifyContent).toBe('space-between');
      expect(encabezado.querySelectorAll('button').length).toBe(caso.pestana === 'sesiones' ? 1 : 0);
      const url = TestBed.inject(Router).url;
      const overflow = document.body.style.overflow;
      abrir.focus(); abrir.click(); harness.detectChanges(); catalogos(); harness.detectChanges();
      await harness.fixture.whenStable();
      const dialogo = vista().querySelector<HTMLDialogElement>('app-dialogo.modal-registro dialog')!;
      expect(dialogo.open).toBeTrue(); expect(dialogo.matches(':modal')).toBeTrue();
      expect(dialogo.getAttribute('aria-labelledby')).toBeTruthy();
      expect(dialogo.contains(document.activeElement)).toBeTrue();
      abrir.focus(); expect(dialogo.contains(document.activeElement)).toBeTrue();
      expect(TestBed.inject(Router).url).toBe(url);
      expect(vista().querySelectorAll('table').length).toBe(1);
      expect(dialogo.querySelectorAll('app-formulario-emision').length).toBe(1);
      expect(vista().querySelectorAll('app-formulario-emision').length).toBe(1);
      expect(dialogo.querySelectorAll('.grid > .form-field').length).toBe(caso.campos);
      expect(document.body.style.overflow).toBe('hidden');
      const opciones = Array.from(dialogo.querySelectorAll('select option'));
      expect(opciones.every(opcion => !/#\d+/.test(opcion.textContent ?? ''))).toBeTrue();
      if (caso.pestana === 'asistencias') expect(dialogo.textContent).toContain('Ana Perez');
      boton('Cancelar', 'app-formulario-emision .acciones').click(); harness.detectChanges();
      await harness.fixture.whenStable();
      expect(dialogo.open).toBeFalse();
      expect(vista().querySelector('app-formulario-emision')).toBeNull();
      expect(document.body.style.overflow).toBe(overflow);
      expect(document.activeElement).toBe(abrir);
      expect(TestBed.inject(Router).url).toBe(url);
      http.expectNone(req => req.method !== 'GET');
    });

    it(caso.pestana + ': Escape cierra salvo durante guardado y los errores conservan el modal', async () => {
      await iniciar('?pestana=' + caso.pestana);
      if (caso.pestana === 'sesiones') cargarSesiones([sesiones[0]]); else await cargarAsistencias([]);
      disparadorRegistro().click(); harness.detectChanges(); catalogos(); harness.detectChanges();
      const dialogo = vista().querySelector<HTMLDialogElement>('app-dialogo.modal-registro dialog')!;
      dialogo.dispatchEvent(new Event('cancel', { cancelable: true })); harness.detectChanges();
      expect(dialogo.open).toBeFalse();
      expect(vista().querySelector('app-formulario-emision')).toBeNull();
      disparadorRegistro().click(); harness.detectChanges(); catalogos(); harness.detectChanges();
      if (caso.pestana === 'sesiones') completarNuevaSesion(); else completarNuevaAsistencia();
      const guardar = http.expectOne(req => req.url === base + caso.post && req.method === 'POST');
      vista().querySelector('app-formulario-emision form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      http.expectNone(req => req.method === 'POST');
      dialogo.dispatchEvent(new Event('cancel', { cancelable: true })); harness.detectChanges();
      expect(dialogo.open).toBeTrue();
      expect(boton('Cancelar', 'app-formulario-emision .acciones').disabled).toBeTrue();
      guardar.flush({ message: 'Registro rechazado.' }, { status: 409, statusText: 'Conflict' }); harness.detectChanges();
      expect(dialogo.open).toBeTrue(); expect(dialogo.textContent).toContain('Registro rechazado.');
      expect(vista().querySelectorAll('table').length).toBe(1);
      dialogo.dispatchEvent(new Event('cancel', { cancelable: true })); harness.detectChanges();
      expect(dialogo.open).toBeFalse();
    });

    it(caso.pestana + ': cambiar de pestana elimina el modal y libera el fondo', async () => {
      await iniciar('?pestana=' + caso.pestana);
      if (caso.pestana === 'sesiones') cargarSesiones([sesiones[0]]); else await cargarAsistencias([]);
      const overflow = document.body.style.overflow;
      disparadorRegistro().click(); harness.detectChanges(); catalogos(); harness.detectChanges();
      expect(vista().querySelector('dialog[open]')).not.toBeNull();
      await seleccionar(caso.destino);
      if (caso.destino === 'sesiones') cargarSesiones([sesiones[0]]); else await cargarAsistencias([]);
      expect(vista().querySelector('dialog[open]')).toBeNull();
      expect(vista().querySelector('app-formulario-emision')).toBeNull();
      expect(document.body.style.overflow).toBe(overflow);
      expect(vista().querySelectorAll('table').length).toBe(1);
      await seleccionar(caso.pestana);
      if (caso.pestana === 'sesiones') cargarSesiones([sesiones[0]]); else await cargarAsistencias([]);
      expect(vista().querySelector('app-formulario-emision')).toBeNull();
      expect(vista().querySelector('dialog[open]')).toBeNull();
    });
  }

  it('combina nombre, actividad, fecha y estado sin nuevas peticiones y limpia la consulta', async () => {
    await iniciar(); cargarSesiones();
    await filtrar('nombre', 'registrada 2'); await filtrar('actividad', '7');
    await filtrar('fecha', '2026-11-02'); await filtrar('estado', 'activo');
    expect(vista().querySelectorAll('tbody tr').length).toBe(10);
    expect(vista().querySelector('.paginacion')?.textContent).toContain('1–10 de 11');
    await filtrar('fecha', '2026-11-03');
    expect(vista().textContent).toContain('No hay registros');
    expect(vista().querySelector('.paginacion')?.textContent).toContain('0–0 de 0');
    boton('Limpiar filtros').click(); harness.detectChanges();
    expect(vista().querySelector('.paginacion')?.textContent).toContain('1–10 de 41');
    expect(vista().querySelector<HTMLInputElement>('[formControlName="nombre"]')?.value).toBe('');
    http.expectNone(() => true);
  });

  it('presenta nombres, fechas y estados sin IDs técnicos en las celdas', async () => {
    await iniciar(); cargarSesiones([sesiones[0]]);
    const encabezados = Array.from(vista().querySelectorAll('thead th')).map(celda => celda.textContent?.trim());
    expect(encabezados).toContain('N.º'); expect(encabezados).toContain('Nombre de sesión');
    const celdas = vista().querySelectorAll('tbody tr:first-child td');
    expect(celdas[0].textContent?.trim()).toBe('Actividad existente');
    expect(celdas[2].textContent?.trim()).toBe('02/11/2026');
    expect(vista().querySelector('tbody .badge')?.textContent).toBe('Activo');
    expect(vista().textContent).not.toContain('Valor exacto');
    expect(vista().querySelector('tbody')?.textContent).not.toContain('#7');
    await seleccionar('asistencias'); await cargarAsistencias([asistencias[0]]);
    expect(vista().querySelector('thead')?.textContent).toContain('Participante');
    expect(vista().querySelector('tbody th')?.textContent?.trim()).toBe('Ana Perez');
    expect(vista().querySelector('tbody')?.textContent).toContain('Sin clasificar');
    expect(vista().querySelector('tbody tr > :first-child')?.textContent).toBe('1');
  });

  it('filtra asistencias por nombre real, actividad, sesión y estado, y restablece sesiones dependientes', async () => {
    await iniciar('?pestana=asistencias'); await cargarAsistencias();
    await filtrar('nombre', 'ANA pérez'); await filtrar('actividad', '7'); await filtrar('sesion', '3'); await filtrar('estado', 'activo');
    expect(vista().querySelector('.paginacion')?.textContent).toContain('1–10 de 41');
    await filtrar('sesion', '4'); expect(vista().textContent).toContain('No hay registros');
    await filtrar('actividad', '7');
    expect(vista().querySelector<HTMLSelectElement>('[formControlName="sesion"]')?.value).toBe('');
    expect(vista().querySelector('.paginacion')?.textContent).toContain('0–0 de 0');
    await filtrar('nombre', 'Sin coincidencias');
    boton('Limpiar filtros').click(); harness.detectChanges();
    expect(vista().textContent).toContain('Selecciona una actividad y una sesión');
    http.expectNone(() => true);
  });

  for (const pestana of ['sesiones', 'asistencias']) {
    it('pagina ' + pestana + ' con 5, 10 y 50, conserva filtros y numera correlativamente', async () => {
      await iniciar('?pestana=' + pestana);
      if (pestana === 'sesiones') cargarSesiones(); else await cargarAsistencias();
      await filtrar('actividad', '7');
      if (pestana === 'asistencias') await filtrar('sesion', '3');
      expect(vista().querySelectorAll('tbody tr').length).toBe(10);
      boton('Siguiente').click(); harness.detectChanges();
      expect(vista().querySelector('tbody tr > :first-child')?.textContent).toBe('11');
      expect(vista().querySelector('.paginacion')?.textContent).toContain('11–20 de 41');
      for (const cantidad of [5, 50, 10]) {
        const selector = vista().querySelector<HTMLSelectElement>('.cantidad-sesiones select')!;
        selector.value = String(cantidad); selector.dispatchEvent(new Event('change')); harness.detectChanges();
        expect(vista().querySelectorAll('tbody tr').length).toBe(Math.min(cantidad, 41));
        expect(vista().querySelector('tbody tr > :first-child')?.textContent).toBe('1');
        expect(vista().querySelector<HTMLSelectElement>('[formControlName="actividad"]')?.value).toBe('7');
        expect(boton('Anterior').disabled).toBeTrue();
        expect(boton('Siguiente').disabled).toBe(cantidad === 50);
      }
      http.expectNone(() => true);
    });
  }

  it('recarga URL contextual, preselecciona sesión y conserva actividad al limpiar y cambiar de pestaña', async () => {
    await iniciar('?id_actividad=7'); cargarSesiones([sesiones[0], { ...sesiones[1], id_actividad: 9, nombre: 'Sesión de otra actividad' }]);
    expect(vista().textContent).toContain('Actividad existente');
    const volver = Array.from(vista().querySelectorAll('a')).find(enlace => enlace.textContent?.includes('Volver a actividad'));
    expect(volver?.getAttribute('href')).toBe('/certificaciones/actividades?id_actividad=7');
    expect(vista().querySelector('tbody')?.textContent).not.toContain('Sesión de otra actividad');
    expect(vista().querySelector<HTMLSelectElement>('#activity-session-buscar-actividad')?.disabled).toBeTrue();
    disparadorRegistro().click(); harness.detectChanges(); await harness.fixture.whenStable(); harness.detectChanges();
    expect(vista().querySelector<HTMLSelectElement>('#activity-session-id_actividad')?.value).toBe('7');
    expect(vista().querySelector<HTMLSelectElement>('#activity-session-id_actividad')?.disabled).toBeTrue();
    http.expectNone(base + '/activity');
    completarNuevaSesion();
    const guardar = http.expectOne(req => req.url === base + '/activity-session' && req.method === 'POST');
    expect(guardar.request.body.id_actividad).toBe(7);
    guardar.flush({ success: true, data: { ...sesiones[0], nombre: 'Nueva sesión' } }); harness.detectChanges(); cargarSesiones();
    boton('Limpiar filtros').click(); harness.detectChanges();
    expect(vista().querySelector<HTMLSelectElement>('#activity-session-buscar-actividad')?.value).toBe('7');
    await seleccionar('asistencias'); await cargarAsistencias([]);
    expect(vista().querySelector<HTMLSelectElement>('#attendance-buscar-actividad')?.value).toBe('7');
    expect(vista().querySelector<HTMLSelectElement>('#attendance-buscar-actividad')?.disabled).toBeTrue();
    expect(TestBed.inject(Router).url).toContain('id_actividad=7');
    http.expectNone(base + '/activity/7'); // No repite la validación al cambiar de pestaña.
    disparadorRegistro().click(); harness.detectChanges(); catalogos(); harness.detectChanges();
    expect(vista().querySelector<HTMLSelectElement>('#attendance-id_participacion')?.value).toBe('50');
    expect(vista().querySelector<HTMLSelectElement>('#attendance-id_participacion')?.disabled).toBeTrue();
    http.expectNone(req => req.url.includes('/persons/detail/'));
  });

  it('URL inválida no consulta sesiones ni muestra un formulario de otra actividad', async () => {
    await iniciar('?id_actividad=abc');
    expect(vista().querySelector('app-listado-emision')).toBeNull();
    expect(vista().querySelector('[role=alert]')?.textContent).toContain('identificador');
    http.expectNone(() => true);
  });

  it('recupera actividad y sesión del ingreso general al recargar sin bloquear el selector', async () => {
    await iniciar('?pestana=asistencias&actividad_filtro=7&sesion_filtro=3');
    await cargarAsistencias([]);
    expect(vista().querySelector<HTMLSelectElement>('#attendance-buscar-actividad')?.value).toBe('7');
    expect(vista().querySelector<HTMLSelectElement>('#attendance-buscar-actividad')?.disabled).toBeFalse();
    expect(vista().querySelector<HTMLSelectElement>('#attendance-buscar-sesion')?.value).toBe('3');
    expect(vista().querySelectorAll('tbody tr').length).toBe(10);
    expect(vista().querySelectorAll('tbody input:checked').length).toBe(0);
    http.expectNone(req => req.method !== 'GET');
  });

  it('el Sidebar abre el modo general y limpia la actividad y sesión del ingreso contextual', async () => {
    await iniciar('?id_actividad=7&id_sesion=3&pestana=asistencias'); await cargarAsistencias([]);
    vista().querySelector<HTMLAnchorElement>('app-sidebar a[href="' + ruta + '"]')!.click();
    await harness.fixture.whenStable(); harness.detectChanges(); cargarSesiones();
    expect(TestBed.inject(Router).url).toBe(ruta);
    expect(vista().querySelector<HTMLSelectElement>('#activity-session-buscar-actividad')?.value).toBe('');
    expect(vista().querySelector<HTMLSelectElement>('#activity-session-buscar-actividad')?.disabled).toBeFalse();
    expect(vista().querySelectorAll('[role="tab"]').length).toBe(2);
    await seleccionar('asistencias');
    http.expectOne(base + '/attendance/list').flush({ success: true, data: [] }); catalogos(); harness.detectChanges();
    expect(vista().querySelector<HTMLSelectElement>('#attendance-buscar-actividad')?.value).toBe('');
    expect(vista().querySelector<HTMLSelectElement>('#attendance-buscar-sesion')?.value).toBe('');
    expect(vista().querySelector('tbody')).toBeNull();
    http.expectNone(req => req.method !== 'GET');
  });

  for (const query of ['?id_actividad=7', '?actividad_filtro=7']) {
    it('el Sidebar limpia selección previa aun permaneciendo en Sesiones desde ' + query, async () => {
      await iniciar(query); cargarSesiones();
      expect(vista().querySelector<HTMLSelectElement>('#activity-session-buscar-actividad')?.value).toBe('7');
      vista().querySelector<HTMLAnchorElement>('app-sidebar a[href="' + ruta + '"]')!.click();
      await harness.fixture.whenStable(); harness.detectChanges(); cargarSesiones();
      expect(TestBed.inject(Router).url).toBe(ruta);
      expect(vista().querySelector<HTMLSelectElement>('#activity-session-buscar-actividad')?.value).toBe('');
      expect(vista().querySelector<HTMLSelectElement>('#activity-session-buscar-actividad')?.disabled).toBeFalse();
      http.expectNone(req => req.method !== 'GET');
    });
  }

  it('el acceso de una sesión abre la misma pestaña de asistencia con ambos IDs', async () => {
    await iniciar('?id_actividad=7'); cargarSesiones([sesiones[2]]);
    boton('Controlar asistencia', 'tbody').click();
    await harness.fixture.whenStable(); harness.detectChanges();
    await cargarAsistencias([]);
    expect(TestBed.inject(Router).url).toContain('id_actividad=7');
    expect(TestBed.inject(Router).url).toContain('id_sesion=3');
    expect(vista().querySelector<HTMLSelectElement>('#attendance-buscar-sesion')?.value).toBe('3');
    expect(vista().querySelectorAll('app-listado-emision').length).toBe(1);
    http.expectNone(req => req.method !== 'GET');
  });

  for (const caso of [{ estado: 'PRESENTE', clase: 'presente' }, { estado: 'AUSENTE', clase: 'ausente' }]) {
    it('confirma ' + caso.estado + ' mediante POST y GET sin horas ficticias ni inscripciones nuevas', async () => {
      await iniciar('?id_actividad=7&id_sesion=3&pestana=asistencias'); await cargarAsistencias([]);
      const marca = vista().querySelector<HTMLButtonElement>('.circulo-' + caso.clase)!;
      expect(marca.tagName).toBe('BUTTON'); expect(marca.tabIndex).toBe(0);
      expect(marca.title).toBe(caso.estado === 'PRESENTE' ? 'Marcar presente' : 'Marcar ausente');
      expect(vista().querySelectorAll('.circulo-asistencia[aria-pressed="true"]').length).toBe(0);
      marca.click(); marca.click(); harness.detectChanges();
      const guardar = http.expectOne(base + '/attendance/create');
      expect(guardar.request.method).toBe('POST');
      expect(guardar.request.body).toEqual({ id_participacion: 50, id_actividad_sesion: 3, estado: caso.estado });
      expect(vista().textContent).toContain('Guardando');
      expect(vista().textContent).not.toContain('Asistencia confirmada');
      const registro = { ID_ASISTENCIA: 80, ID_PARTICIPACION: 50, ID_ACTIVIDAD_SESION: 3, ESTADO: caso.estado, HORA_ENTRADA: null, HORA_SALIDA: null };
      guardar.flush({ success: true, data: registro }); harness.detectChanges();
      expect(vista().querySelectorAll('.circulo-asistencia[aria-pressed="true"]').length).toBe(0);
      http.expectOne(base + '/attendance/80').flush({ success: true, data: registro }); harness.detectChanges();
      expect(vista().querySelector('.circulo-' + caso.clase)?.getAttribute('aria-pressed')).toBe('true');
      expect(vista().querySelectorAll('tbody tr:first-child .circulo-asistencia[aria-pressed="true"]').length).toBe(1);
      expect(vista().textContent).toContain('Asistencia confirmada por Laravel');
      const resumen = Array.from(vista().querySelectorAll('.resumen-asistencia dd')).map(celda => celda.textContent?.trim());
      expect(resumen).toEqual(caso.estado === 'PRESENTE' ? ['41', '1', '0', '40'] : ['41', '0', '1', '40']);
      vista().querySelector<HTMLButtonElement>('tbody tr:first-child .circulo-presente')!.click();
      vista().querySelector<HTMLButtonElement>('tbody tr:first-child .circulo-ausente')!.click();
      http.expectNone(req => req.method !== 'GET');
    });
  }

  for (const status of [401, 403, 409, 422]) {
    it('muestra HTTP ' + status + ' sin marcar ausente ni reintentar la escritura automáticamente', async () => {
      await iniciar('?id_actividad=7&id_sesion=3&pestana=asistencias'); await cargarAsistencias([]);
      vista().querySelector<HTMLButtonElement>('.circulo-ausente')!.click();
      http.expectOne(base + '/attendance/create').flush({ message: 'Marca rechazada', errors: { ID_ACTIVIDAD_SESION: ['Revisa la sesión'] } }, { status, statusText: 'Error' }); harness.detectChanges();
      expect(vista().textContent).toContain('HTTP ' + status); expect(vista().textContent).toContain(status === 422 ? 'Revisa la sesión' : 'Marca rechazada');
      expect(vista().textContent).not.toContain('Asistencia confirmada');
      expect(vista().querySelectorAll('.circulo-asistencia[aria-pressed="true"]').length).toBe(0);
      vista().querySelector<HTMLButtonElement>('.circulo-ausente')!.click();
      http.expectNone(req => req.method !== 'GET');
    });
  }

  it('un GET de confirmación fallido bloquea nuevos POST y permite recuperar la marca consultando', async () => {
    await iniciar('?id_actividad=7&id_sesion=3&pestana=asistencias'); await cargarAsistencias([]);
    vista().querySelector<HTMLButtonElement>('.circulo-presente')!.click();
    http.expectOne(base + '/attendance/create').flush({ success: true, data: { ID_ASISTENCIA: 80 } });
    http.expectOne(base + '/attendance/80').flush({ message: 'Consulta no disponible' }, { status: 500, statusText: 'Server Error' }); harness.detectChanges();
    expect(vista().textContent).toContain('Laravel recibió la marca');
    expect(vista().querySelectorAll('.circulo-asistencia[aria-pressed="true"]').length).toBe(0);
    boton('Actualizar asistencia').click(); harness.detectChanges();
    await cargarAsistencias([{ ...asistencias[0], HORA_ENTRADA: '', HORA_SALIDA: '', ESTADO: 'PRESENTE' }]);
    expect(vista().querySelector('.circulo-presente')?.getAttribute('aria-pressed')).toBe('true');
    http.expectNone(req => req.method !== 'GET');
  });

  it('regulariza ausencia a presencia con PATCH de estado y conserva las horas históricas', async () => {
    const registro = { ...asistencias[0], ESTADO: 'AUSENTE' };
    await iniciar('?id_actividad=7&id_sesion=3&pestana=asistencias'); await cargarAsistencias([registro]);
    expect(vista().querySelector('.circulo-ausente')?.getAttribute('aria-pressed')).toBe('true');
    expect(vista().querySelector('.circulo-presente')?.getAttribute('aria-pressed')).toBe('false');
    vista().querySelector<HTMLDetailsElement>('details')!.open = true;
    boton('Regularizar', 'tbody').click(); harness.detectChanges();
    http.expectOne(base + '/attendance/80').flush({ success: true, data: registro }); catalogos(); harness.detectChanges();
    const estado = vista().querySelector<HTMLSelectElement>('#attendance-estado')!;
    estado.value = 'presente'; estado.dispatchEvent(new Event('change'));
    vista().querySelector('app-formulario-emision form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    const guardar = http.expectOne(base + '/attendance/update/80');
    expect(guardar.request.method).toBe('PATCH'); expect(guardar.request.body).toEqual({ estado: 'presente' });
    guardar.flush({ success: true, data: { ...registro, ESTADO: 'presente' } }); harness.detectChanges();
    await cargarAsistencias([{ ...registro, ESTADO: 'presente' }]);
    expect(vista().querySelector('.circulo-presente')?.getAttribute('aria-pressed')).toBe('true');
    expect(vista().querySelector('tbody')?.textContent).toContain('08:00'); expect(vista().querySelector('tbody')?.textContent).toContain('09:00');
    http.expectNone(req => req.url.endsWith('/participation') && req.method !== 'GET');
  });

  it('sin sesiones informa un vacío válido y abre el formulario existente con la actividad protegida', async () => {
    await iniciar('?id_actividad=7&pestana=asistencias');
    http.expectOne(base + '/attendance/list').flush({ success: true, data: [] });
    http.expectOne(base + '/activity-session').flush({ success: true, data: [] }); catalogos(); harness.detectChanges();
    expect(vista().textContent).toContain('Esta actividad todavía no tiene sesiones registradas');
    boton('Registrar sesión').click(); harness.detectChanges(); await harness.fixture.whenStable(); harness.detectChanges();
    expect(vista().querySelector<HTMLSelectElement>('#activity-session-id_actividad')?.value).toBe('7');
    expect(vista().querySelector<HTMLSelectElement>('#activity-session-id_actividad')?.disabled).toBeTrue();
    expect(vista().querySelector('dialog[open]')?.textContent).toContain('Registrar sesión');
    http.expectNone(req => req.method !== 'GET');
  });

  it('actividad denegada conserva el error real y no consulta los CRUD dependientes', async () => {
    harness = await RouterTestingHarness.create(ruta + '?id_actividad=8'); harness.detectChanges();
    http.expectOne(base + '/activity/8').flush({ message: 'Actividad fuera de ámbito' }, { status: 403, statusText: 'Forbidden' }); harness.detectChanges();
    expect(vista().querySelector('app-listado-emision')).toBeNull();
    expect(vista().querySelector('[role=alert]')?.textContent).toContain('Actividad fuera de ámbito');
    http.expectNone(() => true);
  });

  it('un fallo del catálogo de Personas en asistencia contextual se muestra como error, sin consultas por fila', async () => {
    await iniciar('?id_actividad=7&pestana=asistencias&id_sesion=3');
    http.expectOne(base + '/persons/list').flush({ message: 'Consulta de personas denegada' }, { status: 403, statusText: 'Forbidden' });
    await cargarAsistencias([]);
    expect(vista().querySelectorAll('tbody tr').length).toBe(10);
    expect(vista().textContent).toContain('Consulta de personas denegada');
    expect(vista().textContent).toContain('403');
    http.expectNone(req => req.url.includes('/persons/detail/'));
    http.expectNone(req => req.method === 'POST');
  });
  it('Sesiones ofrece solo Activo y Culminado y conserva las sesiones cerradas en Todos los estados', async () => {
    await iniciar();
    cargarSesiones(sesiones.map((sesion, indice) => ({ ...sesion, estado: indice < 12 ? 'Culminado' : indice < 20 ? 'cerrado' : 'activo' })));
    const selector = vista().querySelector<HTMLSelectElement>('[formControlName="estado"]')!;
    expect(Array.from(selector.options).map(opcion => opcion.textContent)).toEqual(['Todos los estados', 'Activo', 'Culminado']);
    expect(selector.value).toBe('');
    boton('Siguiente').click(); harness.detectChanges();
    await filtrar('estado', 'culminado');
    expect(vista().querySelector('.paginacion')?.textContent).toContain('1–10 de 12');
    expect(vista().querySelector('tbody .badge')?.textContent).toBe('Culminado');
    await filtrar('estado', 'activo'); expect(vista().querySelector('.paginacion')?.textContent).toContain('de 21');
    await filtrar('estado', ''); expect(vista().querySelector('.paginacion')?.textContent).toContain('de 41');
    await filtrar('estado', 'culminado'); boton('Limpiar filtros').click(); harness.detectChanges();
    expect(selector.value).toBe('');
    http.expectNone(() => true);
  });

  it('Asistencias distingue presencia explícita de estados históricos sin reinterpretarlos', async () => {
    await iniciar('?pestana=asistencias');
    await cargarAsistencias(asistencias.map((fila, indice) => ({ ...fila, ESTADO: indice < 12 ? 'Activo' : indice < 30 ? 'inactivo' : 'nn' })));
    const selector = vista().querySelector<HTMLSelectElement>('[formControlName="estado"]')!;
    expect(Array.from(selector.options).map(opcion => opcion.textContent)).toEqual(['Todos los estados', 'Presente', 'Ausente', 'Activo (histórico)', 'Inactivo (histórico)']);
    boton('Siguiente').click(); harness.detectChanges(); await filtrar('estado', 'inactivo');
    expect(vista().querySelector('.paginacion')?.textContent).toContain('1–10 de 18');
    await filtrar('estado', 'activo'); expect(vista().querySelector('.paginacion')?.textContent).toContain('de 12');
    boton('Limpiar filtros').click(); harness.detectChanges();
    await harness.fixture.whenStable();
    await filtrar('actividad', '7'); await filtrar('sesion', '3');
    expect(vista().querySelector('.paginacion')?.textContent).toContain('1–10 de 41');
    http.expectNone(() => true);
  });

  it('El formulario de asistencia ofrece Presente y Ausente y conserva estados históricos sin admitir valores arbitrarios', async () => {
    await iniciar('?pestana=asistencias'); await cargarAsistencias([]);
    disparadorRegistro().click(); harness.detectChanges(); catalogos(); harness.detectChanges();
    const selector = vista().querySelector<HTMLSelectElement>('select#attendance-estado')!;
    expect(selector).not.toBeNull(); expect(selector.value).toBe('presente');
    expect(Array.from(selector.options).map(opcion => opcion.textContent)).toEqual(['Presente', 'Ausente', 'Activo (histórico)', 'Inactivo (histórico)']);
    completarNuevaAsistencia();
    http.expectOne(base + '/attendance/create').flush({ message: 'No se pudo guardar.' }, { status: 422, statusText: 'Unprocessable Entity' });
    harness.detectChanges();
    expect(vista().querySelector('dialog[open]')).not.toBeNull();
    selector.value = 'arbitrario'; selector.dispatchEvent(new Event('change')); harness.detectChanges();
    vista().querySelector('app-formulario-emision form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    harness.detectChanges();
    http.expectNone(req => req.method === 'POST');
    expect(vista().querySelector('#attendance-estado-error')?.textContent).toContain('valor válido');
  });

  it('Editar Asistencias muestra el estado actual y envía inactivo sin cambiar otros campos', async () => {
    await iniciar('?pestana=asistencias'); await cargarAsistencias([asistencias[0]]);
    boton('Regularizar', 'tbody').click(); harness.detectChanges();
    http.expectOne(base + '/attendance/80').flush({ success: true, data: { ...asistencias[0], ESTADO: 'Activo' } });
    catalogos(); harness.detectChanges();
    const selector = vista().querySelector<HTMLSelectElement>('select#attendance-estado')!;
    expect(selector.value).toBe('activo');
    selector.value = 'inactivo'; selector.dispatchEvent(new Event('change')); harness.detectChanges();
    vista().querySelector('app-formulario-emision form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    const guardar = http.expectOne(base + '/attendance/update/80');
    expect(guardar.request.method).toBe('PATCH'); expect(guardar.request.body).toEqual({ estado: 'inactivo' });
    guardar.flush({ success: true, data: { ...asistencias[0], ESTADO: 'inactivo' } });
    harness.detectChanges(); await cargarAsistencias([{ ...asistencias[0], ESTADO: 'inactivo' }]);
    expect(vista().querySelector('dialog[open]')).toBeNull();
    expect(vista().querySelector('tbody')?.textContent).not.toContain('nn');
  });

  it('Editar un estado histórico desconocido exige una elección explícita sin convertirlo automáticamente', async () => {
    await iniciar('?pestana=asistencias'); await cargarAsistencias([{ ...asistencias[0], ESTADO: 'nn' }]);
    boton('Regularizar', 'tbody').click(); harness.detectChanges();
    http.expectOne(base + '/attendance/80').flush({ success: true, data: { ...asistencias[0], ESTADO: 'nn' } });
    catalogos(); harness.detectChanges();
    expect(vista().querySelector<HTMLSelectElement>('select#attendance-estado')?.value).toBe('');
    expect(vista().querySelector('app-formulario-emision')?.textContent).toContain('Estado actual sin clasificación');
    vista().querySelector('app-formulario-emision form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    harness.detectChanges(); http.expectNone(req => req.method === 'PATCH');
    boton('Cancelar', 'app-formulario-emision .acciones').click(); harness.detectChanges();
    expect(vista().querySelector('app-formulario-emision')).toBeNull();
    expect(vista().querySelector('tbody')?.textContent).not.toContain('nn');
  });

  for (const pestana of ['sesiones', 'asistencias']) {
    it('alinea los filtros de ' + pestana + ' sin márgenes inferiores adicionales y con altura uniforme', async () => {
      await iniciar('?pestana=' + pestana);
      if (pestana === 'sesiones') cargarSesiones([sesiones[0]]); else await cargarAsistencias([]);
      const filtros = vista().querySelector<HTMLElement>('.filtros-sesiones')!;
      expect(getComputedStyle(filtros).display).toBe('grid');
      expect(getComputedStyle(filtros).alignItems).toBe('end');
      const controles = Array.from(filtros.querySelectorAll<HTMLElement>('input, select, button'));
      expect(new Set(controles.map(control => control.getBoundingClientRect().height)).size).toBe(1);
      for (const campo of Array.from(filtros.querySelectorAll('.form-field'))) expect(getComputedStyle(campo).marginBottom).toBe('0px');
    });
  }
});
