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
  const asistencias = Array.from({ length: 41 }, (_, indice) => ({ ID_ASISTENCIA: indice + 80, ID_PARTICIPACION: 50,
    ID_ACTIVIDAD_SESION: 3, HORA_ENTRADA: '08:00', HORA_SALIDA: '09:00', ESTADO: 'Registrada' }));
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

  function catalogos(): void {
    for (const peticion of http.match(req => [base + '/activity', base + '/participation', base + '/activity-session'].includes(req.url))) {
      peticion.flush({ success: true, data: peticion.request.url.endsWith('/activity') ? [{ id_actividad: 7, nombre: 'Actividad existente' }]
        : peticion.request.url.endsWith('/participation') ? [{ id_participacion: 50, id_persona: 9 }] : sesiones });
    }
  }
  function cargarSesiones(filas = sesiones): void {
    http.expectOne(base + '/activity-session').flush({ success: true, data: filas }); catalogos(); harness.detectChanges();
  }
  function cargarAsistencias(filas = asistencias): void {
    http.expectOne(base + '/attendance/list').flush({ success: true, data: filas }); catalogos(); harness.detectChanges();
  }
  async function iniciar(query = ''): Promise<void> { harness = await RouterTestingHarness.create(ruta + query); harness.detectChanges(); }
  async function seleccionar(id: string): Promise<void> {
    vista().querySelector<HTMLButtonElement>('#actividad-tab-' + id)!.click();
    await harness.fixture.whenStable(); harness.detectChanges();
  }
  function boton(texto: string, selector = 'app-listado-emision'): HTMLButtonElement {
    const encontrado = Array.from(vista().querySelectorAll<HTMLButtonElement>(selector + ' button')).find(elemento => elemento.textContent?.trim() === texto);
    if (!encontrado) throw new Error('Botón no encontrado: ' + texto);
    return encontrado;
  }
  function filtrar(campo: string, valor: string): void {
    const selector = vista().querySelector<HTMLSelectElement>('app-listado-emision .filtros select')!;
    const input = vista().querySelector<HTMLInputElement>('app-listado-emision .filtros input')!;
    selector.value = campo; selector.dispatchEvent(new Event('change'));
    input.value = valor; input.dispatchEvent(new Event('input'));
    vista().querySelector('app-listado-emision .filtros')!.dispatchEvent(new Event('submit'));
    harness.detectChanges();
  }

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
    http.expectNone(() => true);
  });

  it('al alternar monta solo Asistencias y conserva otros parámetros de la URL', async () => {
    await iniciar('?referencia=conservar'); cargarSesiones([sesiones[0]]);
    await seleccionar('asistencias'); cargarAsistencias([asistencias[0]]);
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
    // La lectura de sesiones posterior corresponde al catálogo de la relación, no a un segundo CRUD.
    http.expectNone(base + '/activity-session');
    cargarAsistencias([asistencias[0]]);
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
    filtrar('id_actividad', '7'); cargarSesiones();
    boton('Siguiente').click(); cargarSesiones();
    expect(vista().querySelector('.paginacion')?.textContent).toContain('Página 2');
    await seleccionar('asistencias'); cargarAsistencias();
    expect(vista().querySelector<HTMLInputElement>('app-listado-emision .filtros input')?.value).toBe('');
    filtrar('id_participacion', '50'); cargarAsistencias();
    boton('Siguiente').click(); cargarAsistencias();
    await seleccionar('sesiones'); cargarSesiones();
    expect(vista().querySelector('.paginacion')?.textContent).toContain('Página 2');
    expect(vista().querySelector<HTMLInputElement>('app-listado-emision .filtros input')?.value).toBe('7');
    expect(vista().querySelector<HTMLSelectElement>('app-listado-emision .filtros select')?.value).toBe('id_actividad');
    await seleccionar('asistencias'); cargarAsistencias();
    expect(vista().querySelector('.paginacion')?.textContent).toContain('Página 2');
    expect(vista().querySelector<HTMLInputElement>('app-listado-emision .filtros input')?.value).toBe('50');
    expect(vista().querySelectorAll('app-listado-emision').length).toBe(1);
    http.expectNone(() => true);
  });

  for (const caso of [
    { pestana: 'sesiones', recurso: 'activity-session', id: 1, detalle: sesiones[0], detalleUrl: '/activity-session/1', eliminarUrl: '/activity-session/1' },
    { pestana: 'asistencias', recurso: 'attendance', id: 80, detalle: asistencias[0], detalleUrl: '/attendance/80', eliminarUrl: '/attendance/delete/80' },
  ]) {
    it('Nuevo registro usa el formulario de ' + caso.pestana, async () => {
      await iniciar('?pestana=' + caso.pestana);
      if (caso.pestana === 'sesiones') cargarSesiones([sesiones[0]]); else cargarAsistencias([asistencias[0]]);
      boton('Nuevo registro').click(); harness.detectChanges(); catalogos(); harness.detectChanges();
      expect(vista().querySelectorAll('app-formulario-emision').length).toBe(1);
      const campo = caso.pestana === 'sesiones' ? 'nombre' : 'hora_entrada';
      expect(vista().querySelector('#' + caso.recurso + '-' + campo)).not.toBeNull();
      http.expectNone(req => req.method !== 'GET');
    });

    it('Ver, Editar y Eliminar respetan la entidad y los históricos de ' + caso.pestana, async () => {
      await iniciar('?pestana=' + caso.pestana);
      if (caso.pestana === 'sesiones') cargarSesiones([sesiones[0]]); else cargarAsistencias([asistencias[0]]);
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
    await iniciar('?pestana=asistencias'); cargarAsistencias([asistencias[0]]);
    expect(Array.from(vista().querySelectorAll('app-listado-emision button')).some(elemento => elemento.textContent?.trim() === 'Nuevo registro')).toBeFalse();
    expect(Array.from(vista().querySelectorAll('tbody button')).some(elemento => ['Editar', 'Eliminar'].includes(elemento.textContent?.trim() ?? ''))).toBeFalse();
    await seleccionar('sesiones'); cargarSesiones([sesiones[0]]);
    await seleccionar('asistencias');
    http.expectOne(base + '/attendance/list').flush({ message: 'No autorizado para consultar asistencias.' }, { status: 403, statusText: 'Forbidden' }); harness.detectChanges();
    expect(vista().textContent).toContain('No autorizado para consultar asistencias');
    expect(vista().querySelector('table')).toBeNull();
  });

  it('soporta Flechas, Inicio y Fin con el patrón ARIA de Gestión de Personas', async () => {
    await iniciar(); cargarSesiones([sesiones[0]]);
    const sesionesTab = vista().querySelector<HTMLButtonElement>('#actividad-tab-sesiones')!;
    sesionesTab.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    await harness.fixture.whenStable(); harness.detectChanges(); cargarAsistencias([asistencias[0]]);
    expect(vista().querySelector('#actividad-tab-asistencias')?.getAttribute('tabindex')).toBe('0');
    expect(vista().querySelector('#actividad-tab-sesiones')?.getAttribute('tabindex')).toBe('-1');
    vista().querySelector('#actividad-tab-asistencias')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    await harness.fixture.whenStable(); harness.detectChanges(); cargarSesiones([sesiones[0]]);
    expect(TestBed.inject(Router).url).toBe(ruta);
    expect(vista().querySelector('#actividad-tab-sesiones')?.getAttribute('aria-selected')).toBe('true');
  });

  it('no recarga el CRUD si solo cambia otro parámetro o se pulsa la pestaña ya activa', async () => {
    await iniciar(); cargarSesiones([sesiones[0]]);
    await seleccionar('sesiones');
    await harness.navigateByUrl(ruta + '?referencia=otra'); harness.detectChanges();
    http.expectNone(() => true);
  });

  it('conserva la pantalla local de Actividades al integrar Sesiones y asistencia', async () => {
    harness = await RouterTestingHarness.create('/certificaciones/actividades');
    http.expectOne(base + '/activity').flush({ success: true, data: [] });
    http.expectOne(base + '/areas/list').flush({ success: true, data: [] });
    http.expectOne(base + '/ativicty-type').flush({ success: true, data: [] }); harness.detectChanges();
    expect(vista().querySelector('app-listar-actividades')).not.toBeNull();
    expect(vista().querySelectorAll('app-listado-emision').length).toBe(0);
    expect(vista().querySelector('[role="tablist"]')).toBeNull();
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

  it('muestra solo el formulario de sesión y Cancelar restaura el listado sin guardar', async () => {
    await iniciar(); cargarSesiones([sesiones[0]]);
    expect(vista().querySelector('table')).not.toBeNull();
    boton('Nuevo registro').click(); harness.detectChanges(); catalogos(); harness.detectChanges();
    expect(vista().querySelectorAll('app-formulario-emision').length).toBe(1);
    expect(vista().querySelectorAll('app-formulario-emision form').length).toBe(1);
    expect(vista().querySelector('legend')?.textContent?.trim()).toBe('Nuevo registro');
    expect(vista().querySelector('app-listado-emision .filtros')).toBeNull();
    expect(vista().querySelector('table')).toBeNull();
    expect(vista().querySelector('.paginacion')).toBeNull();
    expect(vista().querySelector('main app-page-title')).toBeNull();
    expect(vista().querySelector('[role="tablist"]')).toBeNull();
    expect(Array.from(vista().querySelectorAll('button')).some(elemento => elemento.textContent?.trim() === 'Nuevo registro')).toBeFalse();
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
    boton('Nuevo registro').click(); harness.detectChanges(); catalogos(); harness.detectChanges();
    completarNuevaSesion();
    const registro = { ...sesiones[0], id_actividad_sesion: 99, nombre: 'Nueva sesión' };
    const guardar = http.expectOne(req => req.url === base + '/activity-session' && req.method === 'POST');
    guardar.flush({ success: true, data: registro }); harness.detectChanges(); cargarSesiones([registro]);
    expect(vista().querySelector('app-formulario-emision')).toBeNull();
    expect(vista().querySelector('tbody')?.textContent).toContain('Nueva sesión');
    expect(vista().textContent).toContain('Cambios guardados.');
    boton('Nuevo registro').click(); harness.detectChanges(); catalogos(); harness.detectChanges();
    expect(vista().querySelectorAll('app-formulario-emision').length).toBe(1);
    expect(vista().textContent).not.toContain('Cambios guardados');
    expect(vista().querySelector('table')).toBeNull();
  });

  it('si guardar falla conserva el formulario y sus datos sin mostrar el listado', async () => {
    await iniciar(); cargarSesiones([sesiones[0]]);
    boton('Nuevo registro').click(); harness.detectChanges(); catalogos(); harness.detectChanges();
    completarNuevaSesion();
    http.expectOne(req => req.url === base + '/activity-session' && req.method === 'POST')
      .flush({ message: 'No se pudo guardar la sesión.', errors: { nombre: ['Revisa el nombre.'] } }, { status: 422, statusText: 'Unprocessable Entity' });
    harness.detectChanges();
    expect(vista().querySelectorAll('app-formulario-emision').length).toBe(1);
    expect(vista().querySelector<HTMLInputElement>('#activity-session-nombre')?.value).toBe('Nueva sesión');
    expect(vista().querySelector('#activity-session-nombre-error')?.textContent).toContain('Revisa el nombre.');
    expect(vista().querySelector('table')).toBeNull();
    expect(vista().querySelector('.filtros')).toBeNull();
    expect(vista().querySelector('.paginacion')).toBeNull();
    http.expectNone(req => req.url === base + '/activity-session' && req.method === 'GET');
  });

  function completarNuevaAsistencia(): void {
    const valores: Record<string, string> = { id_participacion: '50', id_actividad_sesion: '3',
      hora_entrada: '09:15', hora_salida: '10:30', estado: 'Registrada' };
    for (const [nombre, valor] of Object.entries(valores)) {
      const campo = vista().querySelector<HTMLInputElement | HTMLSelectElement>('#attendance-' + nombre)!;
      campo.value = valor;
      campo.dispatchEvent(new Event(campo.tagName === 'SELECT' ? 'change' : 'input'));
    }
    vista().querySelector('app-formulario-emision form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    harness.detectChanges();
  }

  it('Asistencias alterna vistas excluyentes y Cancelar restaura el listado sin guardar', async () => {
    await iniciar('?pestana=asistencias'); cargarAsistencias([asistencias[0]]);
    expect(vista().querySelector('app-formulario-emision')).toBeNull();
    expect(vista().querySelector('table')).not.toBeNull();
    boton('Nuevo registro').click(); harness.detectChanges(); catalogos(); harness.detectChanges();
    expect(vista().querySelectorAll('app-formulario-emision').length).toBe(1);
    expect(vista().querySelectorAll('app-formulario-emision form').length).toBe(1);
    expect(vista().querySelectorAll('app-formulario-emision .grid > .form-field').length).toBe(5);
    expect(vista().querySelector('#attendance-id_asistencia')).toBeNull();
    expect(vista().querySelector('legend')?.textContent?.trim()).toBe('Nuevo registro');
    expect(vista().querySelector('table')).toBeNull();
    expect(vista().querySelector('.filtros')).toBeNull();
    expect(vista().querySelector('.paginacion')).toBeNull();
    expect(vista().querySelector('[role="tablist"]')).toBeNull();
    expect(vista().querySelector('main app-page-title')).toBeNull();
    expect(Array.from(vista().querySelectorAll('button')).some(elemento => elemento.textContent?.trim() === 'Nuevo registro')).toBeFalse();
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
    await iniciar('?pestana=asistencias'); cargarAsistencias([asistencias[0]]);
    boton('Nuevo registro').click(); harness.detectChanges(); catalogos(); harness.detectChanges();
    completarNuevaAsistencia();
    const guardar = http.expectOne(req => req.url === base + '/attendance/create' && req.method === 'POST');
    expect(guardar.request.body).toEqual({ ID_PARTICIPACION: 50, ID_ACTIVIDAD_SESION: 3, HORA_ENTRADA: '09:15', HORA_SALIDA: '10:30', ESTADO: 'Registrada' });
    const registro = { ...asistencias[0], ID_ASISTENCIA: 99, HORA_ENTRADA: '09:15', HORA_SALIDA: '10:30' };
    guardar.flush({ success: true, data: registro }); harness.detectChanges(); cargarAsistencias([registro]);
    expect(vista().querySelector('app-formulario-emision')).toBeNull();
    expect(vista().querySelector('tbody')?.textContent).toContain('09:15');
    expect(vista().textContent).toContain('Cambios guardados.');
    boton('Nuevo registro').click(); harness.detectChanges(); catalogos(); harness.detectChanges();
    expect(vista().querySelectorAll('app-formulario-emision').length).toBe(1);
    expect(vista().querySelector('table')).toBeNull();
    expect(vista().textContent).not.toContain('Cambios guardados');
  });

  it('Asistencias conserva formulario y datos cuando el servidor rechaza el guardado', async () => {
    await iniciar('?pestana=asistencias'); cargarAsistencias([asistencias[0]]);
    boton('Nuevo registro').click(); harness.detectChanges(); catalogos(); harness.detectChanges();
    completarNuevaAsistencia();
    http.expectOne(req => req.url === base + '/attendance/create' && req.method === 'POST')
      .flush({ message: 'No se puede registrar esta asistencia.' }, { status: 409, statusText: 'Conflict' });
    harness.detectChanges();
    expect(vista().querySelectorAll('app-formulario-emision').length).toBe(1);
    expect(vista().querySelector<HTMLInputElement>('#attendance-hora_entrada')?.value).toBe('09:15');
    expect(vista().querySelector<HTMLSelectElement>('#attendance-id_participacion')?.value).toBe('50');
    expect(vista().querySelector('app-formulario-emision')?.textContent).toContain('No se puede registrar esta asistencia.');
    expect(vista().querySelector('table')).toBeNull();
    expect(vista().querySelector('.filtros')).toBeNull();
    expect(vista().querySelector('.paginacion')).toBeNull();
    expect(vista().textContent).not.toContain('Cambios guardados');
    http.expectNone(req => req.url === base + '/attendance/list');
  });
});
