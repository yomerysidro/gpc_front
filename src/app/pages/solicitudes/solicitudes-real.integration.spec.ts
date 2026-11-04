import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../app.routes';
import { environment } from '../../../environments/environment';
import { authInterceptor } from '../../core/interceptors/auth.interceptor';
import { AuthService } from '../../core/services/autenticacion/auth.service';
import { SessionAuthService } from '../../core/services/autenticacion/session-auth.service';
import { ActivityRequestsApiService } from '../../core/services/solicitudes/activity-requests-api.service';
import { SolicitudesService } from '../../core/services/solicitudes/solicitudes.service';
import { SOLICITUD_API_TEST } from '../../core/services/solicitudes/activity-requests-api.service.spec';
import { NuevaSolicitudComponent } from './nueva-solicitud/nueva-solicitud.component';
import { CapacidadesSolicitudes } from '../../core/interfaces/autenticacion/auth.interface';
import { SIN_CAPACIDADES_SOLICITUDES_TEST } from '../../core/interfaces/autenticacion/auth-fixtures.spec';
import { AccesoSolicitudLocal } from '../../core/services/solicitudes/solicitudes-http.gateway';

/** HTTP simulado exclusivamente en pruebas. No escribe en Laravel ni PostgreSQL. */
describe('Integración real de sesión, rutas y Solicitudes', () => {
  const base = environment.apiBaseUrl;
  const solicitudes = base + '/activity-requests';
  const usuario = { id: 8, nombre: 'Solicitante de prueba', email: 'solicitante@example.test', rol: 'Digitador' };
  const claves = ['crear', 'editar', 'enviar', 'propias', 'consultar', 'revisar', 'observar', 'derivar', 'historial'];
  let http: HttpTestingController;
  let auth: SessionAuthService;
  let harness: RouterTestingHarness;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes),
      provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting(), SessionAuthService,
      { provide: AuthService, useExisting: SessionAuthService },
    ] });
    http = TestBed.inject(HttpTestingController); auth = TestBed.inject(SessionAuthService);
  });
  afterEach(() => http.verify());
  function sesion(permisos = claves, id = 8, rol = 'Digitador', capacidades: Partial<CapacidadesSolicitudes> = {}): void {
    auth.recargarSesion().subscribe(ok => expect(ok).toBeTrue());
    const me = http.expectOne(base + '/auth/me');
    expect(me.request.withCredentials).toBeTrue(); expect(me.request.headers.has('Authorization')).toBeFalse();
    // Contrato de prueba que representa la respuesta Laravel; nunca es código de autorización productivo.
    me.flush({ user: { ...usuario, id, rol }, modulos: [{ id: 16, nombre: 'Solicitudes', url: '/solicitudes', imagen: 'inbox' }], permisos: permisos.map(p => p.includes('.') ? p : 'solicitudes.' + p),
      capacidades_solicitudes: { ...SIN_CAPACIDADES_SOLICITUDES_TEST,
        consultar_revision: permisos.includes('consultar') && permisos.includes('revisar'),
        consultar_gerencia: permisos.includes('consultar') && (rol === 'Administrador' || permisos.includes('aprobar') || permisos.includes('rechazar')),
        consultar_historial: permisos.includes('historial'), consulta_administrativa_global: rol === 'Administrador' && permisos.includes('consultar'),
        revisar: permisos.includes('revisar'), derivar: permisos.includes('revisar') && permisos.includes('derivar'),
        aprobar: permisos.includes('aprobar'), rechazar: permisos.includes('rechazar'), ...capacidades },
    });
  }
  const vista = () => harness.routeNativeElement!;
  const nombreBoton = (elemento: Element) => elemento.getAttribute('aria-label')?.replace(/ solicitud$/, '') ?? elemento.textContent?.trim();
  function boton(texto: string): HTMLButtonElement {
    const encontrado = Array.from(vista().querySelectorAll<HTMLButtonElement>('button')).find(b => nombreBoton(b) === texto);
    if (!encontrado) throw new Error('Botón no encontrado: ' + texto);
    return encontrado;
  }
  function cambiar(id: string, valor: string): void {
    const campo = vista().querySelector<HTMLInputElement | HTMLSelectElement>('#solicitud-' + id)!;
    campo.value = valor; campo.dispatchEvent(new Event(campo instanceof HTMLSelectElement ? 'change' : 'input')); harness.detectChanges();
  }
  const modelo = () => harness.fixture.debugElement.query(By.directive(NuevaSolicitudComponent)).componentInstance as {
    form: FormGroup; guardar(enviar?: boolean): void;
  };
  async function abrirFormulario(data: readonly { id_area: number; nombre: string }[]): Promise<void> {
    harness = await RouterTestingHarness.create('/solicitudes/nueva');
    const areas = http.expectOne(base + '/activity-requests/authorized-areas'); expect(areas.request.withCredentials).toBeTrue();
    expect(areas.request.method).toBe('GET'); areas.flush({ success: true, data });
    const tipos = http.expectOne(base + '/ativicty-type?estado=1'); expect(tipos.request.withCredentials).toBeTrue();
    tipos.flush({ success: true, data: [{ id_tipo_actividad: 3, nombre: 'Tipo de prueba HTTP', estado: true }] });
    harness.detectChanges();
    http.expectNone(req => req.url.startsWith(base + '/areas/list'));
  }
  async function formulario(): Promise<void> {
    await abrirFormulario([{ id_area: 2, nombre: 'Área de prueba HTTP' }]);
    cambiar('area', '2'); cambiar('tipo', '3'); cambiar('nombre', 'Actividad de prueba HTTP');
    cambiar('inicio', '2026-12-10'); cambiar('fin', '2026-12-10'); cambiar('objetivo', 'Justificación de prueba HTTP');
    boton('Revisar datos').click(); harness.detectChanges();
  }
  const pagina = (data: readonly unknown[]) => ({ success: true, data: { data, current_page: 1, last_page: 1, total: data.length, per_page: 20 } });

  it('ofrece solicitar actividad y no permite alta directa aun con permiso de crear', async () => {
    sesion([...claves, 'actividades.ver', 'actividades.crear']);
    harness = await RouterTestingHarness.create('/certificaciones/actividades'); harness.detectChanges();
    http.expectOne(base + '/activity').flush({ success: true, data: [] });
    http.expectOne(base + '/areas/list').flush({ success: true, data: [] });
    http.expectOne(base + '/ativicty-type').flush({ success: true, data: [] }); harness.detectChanges();
    expect(vista().textContent).not.toContain('Nueva actividad');
    expect(vista().querySelector('a[href="/solicitudes/nueva"]')).not.toBeNull();
    expect(vista().querySelector('form')).toBeNull();
    http.expectNone(req => req.method === 'POST');
  });
  it('abre Solicitud #1 → Actividad #3 y vuelve al expediente autorizado sin crear otra actividad', async () => {
    sesion([...claves, 'actividades.ver', 'actividades.crear', 'participantes.ver']);
    harness = await RouterTestingHarness.create('/solicitudes/mis-solicitudes');
    const actividad = { id_actividad: 3, origen: 'solicitud', id_solicitud_actividad: 1, id_area: 5, id_tipo_actividad: 3,
      nombre: 'Actividad existente del servidor', fecha_inicio: '2026-11-04', fecha_fin: '2026-11-05', estado: 'Activa', sede: null, descripcion: null };
    const aprobada = { ...SOLICITUD_API_TEST, id_solicitud_actividad: 1, id_actividad: 3, estado: 'Aprobada' };
    http.expectOne(req => req.url === solicitudes + '/mine').flush(pagina([aprobada])); harness.detectChanges();
    boton('Ver detalle').click(); harness.detectChanges();
    http.expectOne(solicitudes + '/1').flush({ success: true, data: aprobada }); harness.detectChanges();
    http.expectOne(base + '/activity/3').flush({ success: true, data: actividad }); harness.detectChanges();
    expect(vista().querySelector('section[aria-label="Actividad vinculada"]')?.textContent).toContain(actividad.nombre);
    const enlace = vista().querySelector<HTMLAnchorElement>('app-solicitud-detalle a')!;
    expect(enlace.getAttribute('href')).toBe('/certificaciones/actividades?actividad=3');
    await harness.navigateByUrl(enlace.getAttribute('href')!); harness.detectChanges();

    http.expectOne(base + '/activity').flush({ success: true, data: [actividad] });
    http.expectOne(base + '/areas/list').flush({ success: true, data: [{ id_area: 5, nombre: 'Área de prueba' }] });
    http.expectOne(base + '/ativicty-type').flush({ success: true, data: [] });
    for (const req of http.match(base + '/activity/3').filter(req => !req.cancelled)) req.flush({ success: true, data: actividad });
    harness.detectChanges();
    await harness.fixture.whenStable(); harness.detectChanges();
    expect(vista().querySelector('app-dialogo .detalle')?.textContent).toContain('Procedente de solicitud aprobada');
    boton('Gestionar actividad').click(); harness.detectChanges(); await harness.fixture.whenStable(); harness.detectChanges();
    expect(vista().querySelector('a[href="/certificaciones/participantes?id_actividad=3"]')).not.toBeNull();
    expect(vista().querySelector('a[href="/certificaciones/sesiones-asistencia?id_actividad=3"]')).not.toBeNull();
    const solicitud = vista().querySelector<HTMLAnchorElement>('a[href="/solicitudes/revision?solicitud=1"]')!;
    expect(solicitud).not.toBeNull(); await harness.navigateByUrl(solicitud.getAttribute('href')!); harness.detectChanges();
    http.expectOne(req => req.url === solicitudes).flush(pagina([]));
    http.expectOne(solicitudes + '/1/review-detail').flush({ success: true, data: aprobada }); harness.detectChanges();
    http.expectOne(base + '/activity/3').flush({ success: true, data: actividad }); harness.detectChanges();
    expect(vista().querySelector('app-solicitud-detalle .estado')?.textContent).toBe('Aprobada');
    http.expectNone(req => req.method === 'POST');
  });

  it('selecciona automáticamente el ID real cuando Laravel devuelve una sola área', async () => {
    sesion(); await abrirFormulario([{ id_area: 5, nombre: 'Oficina General de Administración' }]);
    const select = vista().querySelector<HTMLSelectElement>('#solicitud-area')!;
    expect(select.value).toBe('5'); expect(modelo().form.getRawValue().areaId).toBe('5');
    expect(select.options.length).toBe(1); expect(select.options[0].text).toBe('Oficina General de Administración');
    http.expectNone(req => req.url.startsWith(base + '/areas/list'));
  });
  it('permite elegir exclusivamente entre varias áreas autorizadas', async () => {
    sesion(); await abrirFormulario([{ id_area: 5, nombre: 'Área A de prueba' }, { id_area: 7, nombre: 'Área B de prueba' }]);
    const select = vista().querySelector<HTMLSelectElement>('#solicitud-area')!;
    expect(select.value).toBe(''); expect(Array.from(select.options, option => option.value)).toEqual(['', '5', '7']);
    cambiar('area', '7'); expect(modelo().form.getRawValue().areaId).toBe('7'); http.expectNone(req => req.url.startsWith(base + '/areas/list'));
  });
  it('bloquea un área manipulada aunque el resto del formulario sea válido', async () => {
    sesion(); await formulario(); modelo().form.controls['areaId'].setValue('999'); harness.detectChanges();
    expect(modelo().form.valid).toBeTrue(); expect(boton('Enviar solicitud').disabled).toBeTrue();
    expect(boton('Guardar borrador').disabled).toBeTrue(); modelo().guardar(true); modelo().guardar();
    http.expectNone(req => req.method === 'POST'); http.expectNone(req => req.url.startsWith(base + '/areas/list'));
  });
  it('no usa respaldo si no hay áreas y bloquea el guardado incluso con valores inyectados', async () => {
    sesion(); await abrirFormulario([]);
    expect(vista().textContent).toContain('No tienes un área habilitada para registrar solicitudes');
    modelo().form.patchValue({ areaId: '5', tipoId: '3', nombre: 'Prueba', inicio: '2026-12-10', fin: '2026-12-10', objetivo: 'Prueba' });
    expect(modelo().form.valid).toBeTrue(); harness.detectChanges();
    expect(boton('Guardar borrador').disabled).toBeTrue(); modelo().guardar();
    http.expectNone(req => req.method === 'POST'); http.expectNone(req => req.url.startsWith(base + '/areas/list'));
  });
  for (const status of [403, 500, 0]) {
    it('bloquea al fallar las áreas con ' + status + ' y permite reintentar sin perder datos', async () => {
      sesion(); harness = await RouterTestingHarness.create('/solicitudes/nueva');
      http.expectOne(base + '/ativicty-type?estado=1').flush({ success: true, data: [{ id_tipo_actividad: 3, nombre: 'Tipo de prueba', estado: true }] });
      const req = http.expectOne(solicitudes + '/authorized-areas');
      if (status === 0) req.error(new ProgressEvent('error'));
      else req.flush({ success: false, data: null, message: 'Detalle interno que no debe mostrarse' }, { status, statusText: 'Error' });
      harness.detectChanges();
      expect(vista().textContent).toContain(status === 403 ? 'Tu usuario no tiene permiso para crear solicitudes' : status === 0 ? 'No se pudo conectar' : 'No se pudo completar');
      expect(vista().textContent).not.toContain('Detalle interno');
      cambiar('nombre', 'Datos conservados'); expect(boton('Guardar borrador').disabled).toBeTrue();
      boton('Actualizar catálogos').click(); harness.detectChanges();
      http.expectOne(solicitudes + '/authorized-areas').flush({ success: true, data: [{ id_area: 5, nombre: 'Oficina General de Administración' }] });
      http.expectOne(base + '/ativicty-type?estado=1').flush({ success: true, data: [{ id_tipo_actividad: 3, nombre: 'Tipo de prueba', estado: true }] });
      harness.detectChanges();
      expect(vista().querySelector<HTMLInputElement>('#solicitud-nombre')?.value).toBe('Datos conservados');
      expect(vista().querySelector<HTMLSelectElement>('#solicitud-area')?.value).toBe('5');
      http.expectNone(req => req.method === 'POST'); http.expectNone(req => req.url.startsWith(base + '/areas/list'));
    });
  }
  it('el 401 de áreas sigue el cierre de sesión existente y no intenta crear', async () => {
    sesion(); harness = await RouterTestingHarness.create('/solicitudes/nueva');
    http.expectOne(base + '/ativicty-type?estado=1').flush({ success: true, data: [] });
    http.expectOne(solicitudes + '/authorized-areas').flush({ success: false, data: [] }, { status: 401, statusText: 'Unauthorized' });
    await harness.fixture.whenStable(); harness.detectChanges();
    expect(auth.usuario()).toBeNull(); expect(TestBed.inject(Router).url).toContain('/login');
    http.expectNone(req => req.method === 'POST'); http.expectNone(req => req.url.startsWith(base + '/areas/list'));
  });
  it('descarta las áreas y el ID del borrador al cambiar de sesión, conservando los otros campos', async () => {
    sesion(); await formulario(); boton('Guardar borrador').click(); harness.detectChanges();
    http.expectOne(solicitudes).flush({ success: true, data: SOLICITUD_API_TEST }); harness.detectChanges();
    sesion(claves, 9); modelo().guardar(); http.expectNone(req => req.method === 'POST' || req.method === 'PUT');
    harness.detectChanges(); expect(modelo().form.controls['areaId'].value).toBe('');
    http.expectOne(solicitudes + '/authorized-areas').flush({ success: true, data: [{ id_area: 7, nombre: 'Área del nuevo usuario de prueba' }] });
    harness.detectChanges();
    expect(modelo().form.controls['nombre'].value).toBe('Actividad de prueba HTTP'); expect(modelo().form.controls['areaId'].value).toBe('7');
    boton('Guardar borrador').click(); harness.detectChanges();
    const crear = http.expectOne(solicitudes); expect(crear.request.method).toBe('POST'); expect(crear.request.body.id_area).toBe(7);
    http.expectNone(solicitudes + '/4'); crear.flush({ success: true, data: { ...SOLICITUD_API_TEST, id_solicitud_actividad: 6, id_usuario_solicitante: 9, id_area: 7 } });
  });
  it('cancela consultas de áreas de la sesión anterior y no reutiliza sus opciones', async () => {
    sesion(); harness = await RouterTestingHarness.create('/solicitudes/nueva');
    const anterior = http.expectOne(solicitudes + '/authorized-areas');
    http.expectOne(base + '/ativicty-type?estado=1').flush({ success: true, data: [] });
    sesion(claves, 9); harness.detectChanges(); expect(anterior.cancelled).toBeTrue();
    http.expectOne(solicitudes + '/authorized-areas').flush({ success: true, data: [{ id_area: 7, nombre: 'Área del nuevo usuario de prueba' }] });
    harness.detectChanges(); expect(modelo().form.controls['areaId'].value).toBe('7');
    http.expectNone(req => req.url.startsWith(base + '/areas/list'));
  });
  it('bloquea al revocarse crear y no consulta áreas con el permiso anterior', async () => {
    sesion(); await formulario(); sesion(claves.filter(clave => clave !== 'crear')); harness.detectChanges();
    expect(modelo().form.controls['areaId'].value).toBe('');
    expect(vista().textContent).toContain('Tu usuario no tiene permiso para crear solicitudes');
    expect(boton('Guardar borrador').disabled).toBeTrue(); modelo().guardar();
    http.expectNone(solicitudes + '/authorized-areas'); http.expectNone(req => req.method === 'POST');
  });
  it('revalida áreas al recargar la misma sesión sin perder el ID confirmado del borrador', async () => {
    sesion(); await formulario(); boton('Guardar borrador').click(); harness.detectChanges();
    http.expectOne(solicitudes).flush({ success: true, data: SOLICITUD_API_TEST }); harness.detectChanges();
    sesion(); modelo().guardar(); http.expectNone(req => req.method === 'POST' || req.method === 'PUT');
    harness.detectChanges();
    http.expectOne(solicitudes + '/authorized-areas').flush({ success: true, data: [{ id_area: 7, nombre: 'Área revalidada de prueba' }] });
    harness.detectChanges(); boton('Guardar borrador').click(); harness.detectChanges();
    const actualizar = http.expectOne(solicitudes + '/4'); expect(actualizar.request.method).toBe('PUT'); expect(actualizar.request.body.id_area).toBe(7);
    http.expectNone(solicitudes); actualizar.flush({ success: true, data: { ...SOLICITUD_API_TEST, id_area: 7 } });
  });
  it('refresca las áreas si Laravel revoca el área al guardar, sin perder los otros datos', async () => {
    sesion(); await formulario(); boton('Guardar borrador').click(); harness.detectChanges();
    http.expectOne(solicitudes).flush({ success: false, data: { codigo: 'SOLICITUD_AREA_NO_AUTORIZADA', id_area_solicitada: 2, id_areas_autorizadas: [7] } }, { status: 403, statusText: 'Forbidden' });
    http.expectOne(solicitudes + '/authorized-areas').flush({ success: true, data: [{ id_area: 7, nombre: 'Área vigente de prueba' }] }); harness.detectChanges();
    expect(vista().textContent).toContain('El área seleccionada ya no está autorizada');
    expect(modelo().form.controls['areaId'].value).toBe('7'); expect(modelo().form.controls['nombre'].value).toBe('Actividad de prueba HTTP');
    http.expectNone(req => req.url.startsWith(base + '/areas/list')); http.expectNone(req => req.method === 'POST');
  });
  it('conserva campos e ID tras un 409 de envío y reintenta sin crear otro borrador', async () => {
    sesion(); await formulario(); boton('Volver al formulario').click(); harness.detectChanges();
    cambiar('lugar', 'Sede de prueba'); cambiar('descripcion', 'Descripción de prueba');
    const datos = modelo().form.getRawValue(); boton('Revisar datos').click(); harness.detectChanges();
    boton('Enviar solicitud').click(); harness.detectChanges();
    const crear = http.expectOne(solicitudes); crear.flush({ success: true, data: SOLICITUD_API_TEST });
    http.expectOne(solicitudes + '/4/submit').flush({ success: false, data: null }, { status: 409, statusText: 'Conflict' }); harness.detectChanges();
    expect(vista().textContent).toContain('El borrador se guardó, pero no se confirmó el envío.');
    boton('Volver al formulario').click(); harness.detectChanges(); expect(modelo().form.getRawValue()).toEqual(datos);
    boton('Revisar datos').click(); harness.detectChanges(); boton('Enviar solicitud').click(); harness.detectChanges();
    const actualizar = http.expectOne(solicitudes + '/4'); expect(actualizar.request.method).toBe('PUT'); http.expectNone(solicitudes);
    actualizar.flush({ success: true, data: SOLICITUD_API_TEST });
    http.expectOne(solicitudes + '/4/submit').flush({ success: true, data: { ...SOLICITUD_API_TEST, estado: 'Enviada' } });
    await harness.fixture.whenStable(); harness.detectChanges();
    http.expectOne(req => req.url === solicitudes + '/mine').flush(pagina([]));
    expect(TestBed.inject(Router).url).toBe('/solicitudes/mis-solicitudes');
  });

  it('login obtiene /me con cookie, conserva permisos exactos y logout usa la ruta institucional', async () => {
    auth.login('solicitante@example.test', 'clave-solo-prueba').subscribe(resultado => expect(resultado.tipo).toBe('exito'));
    const login = http.expectOne(base + '/auth/login'); expect(login.request.withCredentials).toBeTrue();
    expect(login.request.body).toEqual({ email: 'solicitante@example.test', password: 'clave-solo-prueba' });
    login.flush({ user: usuario });
    const me = http.expectOne(base + '/auth/me'); expect(me.request.withCredentials).toBeTrue();
    me.flush({ user: usuario, modulos: [{ id: 16, nombre: 'Solicitudes', url: '/solicitudes', imagen: 'inbox' }], permisos: ['solicitudes.crear'], capacidades_solicitudes: SIN_CAPACIDADES_SOLICITUDES_TEST });
    expect(auth.usuario()?.email).toBe(usuario.email); expect(auth.tienePermiso('solicitudes.aprobar')).toBeFalse();
    expect(auth.rutaInicial()).toBe('/solicitudes');
    auth.logout().subscribe(); const logout = http.expectOne(base + '/auth/logout');
    expect(logout.request.method).toBe('POST'); expect(logout.request.withCredentials).toBeTrue(); logout.flush({ message: 'Sesión cerrada' });
    expect(auth.usuario()).toBeNull(); await TestBed.inject(Router).navigateByUrl('/login');
  });
  it('conserva sesión y reporta el error si Laravel no confirma logout', () => {
    sesion(); let fallo = false;
    auth.logout().subscribe({ error: () => fallo = true });
    http.expectOne(base + '/auth/logout').flush({}, { status: 500, statusText: 'Error' });
    expect(fallo).toBeTrue(); expect(auth.usuario()?.id).toBe(8);
  });
  it('crea una sola vez, usa el ID devuelto para submit y recarga Mis solicitudes después de confirmarlo', async () => {
    sesion(); await formulario();
    expect(vista().querySelector<HTMLInputElement>('#solicitud-responsable')).toBeNull();
    expect(vista().textContent).toContain(usuario.nombre);
    boton('Enviar solicitud').click(); harness.detectChanges();
    expect(boton('Procesando…').disabled).toBeTrue(); boton('Guardar borrador').click();
    const crear = http.expectOne(solicitudes); expect(crear.request.method).toBe('POST'); expect(crear.request.withCredentials).toBeTrue();
    expect(crear.request.body.id_usuario_solicitante).toBeUndefined();
    http.expectNone(solicitudes + '/4/submit'); crear.flush({ success: true, data: SOLICITUD_API_TEST }, { status: 201, statusText: 'Created' });
    const enviar = http.expectOne(solicitudes + '/4/submit'); expect(enviar.request.method).toBe('POST'); expect(enviar.request.body).toBeNull();
    expect(TestBed.inject(Router).url).toBe('/solicitudes/nueva'); enviar.flush({ success: true, data: { ...SOLICITUD_API_TEST, estado: 'Enviada' } });
    await harness.fixture.whenStable(); harness.detectChanges();
    const listado = http.expectOne(req => req.url === solicitudes + '/mine'); expect(listado.request.withCredentials).toBeTrue();
    listado.flush(pagina([{ ...SOLICITUD_API_TEST, estado: 'Enviada' }])); harness.detectChanges();
    expect(TestBed.inject(Router).url).toBe('/solicitudes/mis-solicitudes');
    expect(vista().textContent).toContain('Solicitud enviada y confirmada por Laravel.');
    expect(vista().querySelector('tbody')?.textContent).toContain('Enviada');
  });
  it('vuelve al formulario con el 422 al lado del campo, sin enviar ni perder los datos', async () => {
    sesion(); await formulario(); boton('Enviar solicitud').click(); harness.detectChanges();
    http.expectOne(solicitudes).flush({ success: false, message: 'Validación', data: { id_area: ['El área no pertenece al solicitante.'] } }, { status: 422, statusText: 'Unprocessable' });
    harness.detectChanges();
    expect(vista().querySelector('#error-area')?.textContent).toContain('El área no pertenece al solicitante.');
    expect(vista().querySelector<HTMLInputElement>('#solicitud-nombre')?.value).toBe('Actividad de prueba HTTP');
    http.expectNone(solicitudes + '/4/submit');
    cambiar('area', ''); cambiar('area', '2'); boton('Revisar datos').click(); harness.detectChanges();
    expect(vista().querySelector('app-solicitud-detalle')).not.toBeNull();
  });
  it('Mis solicitudes conserva Enviada sin traducir el estado real', async () => {
    sesion(); harness = await RouterTestingHarness.create('/solicitudes/mis-solicitudes');
    http.expectOne(req => req.url === solicitudes + '/mine').flush(pagina([{ ...SOLICITUD_API_TEST, estado: 'Enviada' }])); harness.detectChanges();
    expect(vista().querySelector('tbody .estado')?.textContent?.trim()).toBe('Enviada');
    expect(vista().querySelector('tbody')?.textContent).toContain('Pendiente de asignación de revisor');
    expect(vista().textContent).not.toContain('Revisor no informado por la API');
    http.expectNone(req => req.method === 'POST');
  });
  it('muestra una enviada a RR. HH., consulta su detalle y recarga cada etapa hasta derivar', async () => {
    sesion();
    const enviada = { ...SOLICITUD_API_TEST, id_solicitud_actividad: 1, id_area: 5, estado: 'Enviada',
      area_nombre: 'Área devuelta por API de prueba', solicitante_nombre: 'Solicitante devuelto por API de prueba', tipo_actividad_nombre: 'Tipo devuelto por API de prueba' };
    harness = await RouterTestingHarness.create('/solicitudes/revision');
    const listado = http.expectOne(req => req.url === solicitudes);
    expect(listado.request.params.get('estado')).toBe('Enviada');
    listado.flush(pagina([enviada])); harness.detectChanges();
    expect(vista().querySelector('tbody .estado')?.textContent?.trim()).toBe('Pendiente de revisión');
    expect(vista().querySelector('tbody .estado')?.getAttribute('data-estado')).toBe('Enviada');
    expect(vista().querySelector('tbody')?.textContent).toContain('Pendiente de asignación de revisor');
    expect(Array.from(vista().querySelectorAll('tbody button'), boton => nombreBoton(boton)))
      .toEqual(['Ver detalle', 'Iniciar revisión', 'Observar']);
    expect(vista().querySelector('#submenu-recursos-humanos a[href="/solicitudes/revision"]')).not.toBeNull();
    expect(vista().querySelector('tbody')?.textContent).toContain('Solicitud #1');
    expect(vista().querySelector('tbody')?.textContent).toContain(enviada.area_nombre);
    expect(vista().querySelector('tbody')?.textContent).toContain(enviada.solicitante_nombre);
    expect(vista().querySelector('tbody')?.textContent).not.toContain('Área #5');
    boton('Ver detalle').click(); harness.detectChanges();
    http.expectOne(solicitudes + '/1/review-detail').flush({ success: true, data: enviada }); harness.detectChanges();
    expect(vista().querySelector('app-solicitud-detalle .estado')?.textContent?.trim()).toBe('Pendiente de revisión');
    expect(vista().querySelector('app-solicitud-detalle')?.textContent).toContain('Pendiente de asignación de revisor');
    expect(vista().querySelector('app-solicitud-detalle')?.textContent).toContain(enviada.tipo_actividad_nombre);
    boton('Cerrar').click(); harness.detectChanges();
    boton('Iniciar revisión').click(); harness.detectChanges(); boton('Confirmar Iniciar revisión').click();
    const revision = http.expectOne(solicitudes + '/1/review'); expect(revision.request.method).toBe('POST');
    harness.detectChanges();
    expect(vista().querySelector('tbody .estado')?.getAttribute('data-estado')).toBe('Enviada');
    revision.flush({ success: true, data: { ...enviada, estado: 'En revisión' } });
    const recarga = http.expectOne(req => req.url === solicitudes); expect(recarga.request.params.get('estado')).toBe('En revisión');
    recarga.flush(pagina([{ ...enviada, estado: 'En revisión' }])); harness.detectChanges();
    expect(vista().querySelector('tbody .estado')?.textContent?.trim()).toBe('En revisión');
    expect(vista().querySelector('tbody')?.textContent).toContain('Identidad del revisor no disponible');
    expect(Array.from(vista().querySelectorAll('tbody button'), boton => nombreBoton(boton)))
      .toEqual(['Ver detalle', 'Derivar a Gerencia', 'Observar']);
    boton('Derivar a Gerencia').click(); harness.detectChanges(); boton('Confirmar Derivar').click();
    const derivacion = http.expectOne(solicitudes + '/1/derive'); expect(derivacion.request.method).toBe('POST');
    derivacion.flush({ success: true, data: { ...enviada, estado: 'Pendiente de aprobación' } });
    http.expectOne(req => req.url === solicitudes).flush(pagina([])); harness.detectChanges();
    expect(vista().textContent).toContain('Estado: Pendiente de aprobación');
    expect(vista().querySelector('tbody')).toBeNull();
  });
  it('Gerencia consulta pendientes por defecto y no aprueba una solicitud Enviada', async () => {
    sesion(['consultar', 'aprobar', 'rechazar'], 9, 'Gerencial');
    harness = await RouterTestingHarness.create('/pendientes/pendientes-aprobacion');
    const listado = http.expectOne(req => req.url === solicitudes);
    expect(listado.request.params.get('estado')).toBe('Pendiente de aprobación');
    listado.flush(pagina([])); harness.detectChanges();
    expect(vista().querySelector('tbody')).toBeNull();
    const api = TestBed.inject(SolicitudesService);
    api.detalle('4', true).subscribe(fila => expect(fila.acciones).not.toContain('Aprobar'));
    http.expectOne(solicitudes + '/4/review-detail').flush({ success: true, data: { ...SOLICITUD_API_TEST, estado: 'Enviada' } });
    api.decidir('4', '', 'Aprobar', '').subscribe({ next: () => fail('No debe aprobar una enviada'), error: error => expect(error instanceof AccesoSolicitudLocal).toBeTrue() });
    http.expectNone(req => req.method === 'POST');
  });
  it('Gerencia presenta iconos accesibles en una fila y solo decisiones formales', async () => {
    sesion([...claves, 'aprobar', 'rechazar'], 9, 'Administrador');
    harness = await RouterTestingHarness.create('/pendientes/pendientes-aprobacion');
    http.expectOne(req => req.url === solicitudes).flush(pagina([{ ...SOLICITUD_API_TEST, estado: 'Pendiente de aprobación' }])); harness.detectChanges();
    const fila = vista().querySelector('tbody tr')!;
    expect(fila.textContent).not.toContain('Identidad del revisor no disponible');
    expect(fila.textContent).not.toContain('Observar');
    const controles = Array.from(fila.querySelectorAll<HTMLButtonElement>('button'));
    expect(controles.map(boton => boton.getAttribute('aria-label'))).toEqual(['Ver detalle', 'Aprobar solicitud', 'Rechazar solicitud']);
    expect(controles.map(boton => boton.title)).toEqual(['Ver detalle', 'Aprobar solicitud', 'Rechazar solicitud']);
    expect(controles.map(boton => boton.querySelector('span')?.textContent?.trim())).toEqual(['visibility', 'check_circle', 'cancel']);
    expect(controles.every(boton => boton.querySelector('span')?.getAttribute('aria-hidden') === 'true')).toBeTrue();
    expect(controles.map(boton => getComputedStyle(boton).color)).toEqual(['rgb(7, 90, 155)', 'rgb(35, 102, 65)', 'rgb(165, 45, 45)']);
    const acciones = fila.querySelector<HTMLElement>('.acciones-gerencia')!;
    expect(getComputedStyle(acciones).display).toBe('flex'); expect(getComputedStyle(acciones).flexWrap).toBe('nowrap');
    for (const ancho of [320, 1280]) {
      vista().style.width = ancho + 'px'; harness.detectChanges();
      expect(controles.every(boton => boton.getBoundingClientRect().width >= 44 && boton.getBoundingClientRect().height >= 44)).toBeTrue();
      expect(controles[0].getBoundingClientRect().top).toBe(controles[2].getBoundingClientRect().top);
    }
    controles[0].focus(); expect(document.activeElement).toBe(controles[0]);
    http.expectNone(req => req.method === 'POST');
  });
  it('Gerencia aplica Todos los estados sin parámetro y conserva búsqueda, fechas, paginación y limpieza', async () => {
    sesion([...claves, 'aprobar', 'rechazar'], 9, 'Administrador');
    harness = await RouterTestingHarness.create('/pendientes/pendientes-aprobacion');
    const inicial = http.expectOne(req => req.url === solicitudes); expect(inicial.request.params.get('estado')).toBe('Pendiente de aprobación');
    inicial.flush(pagina([])); harness.detectChanges();
    const estado = vista().querySelector<HTMLSelectElement>('#filtro-estado')!;
    expect(estado.options[0].text).toBe('Todos los estados'); expect(estado.options[0].value).toBe('');
    expect(Array.from(estado.options).slice(1).map(opcion => opcion.value)).toEqual(['Borrador', 'Enviada', 'En revisión', 'Observada', 'Pendiente de aprobación', 'Aprobada', 'Rechazada']);
    expect(estado.value).toBe('Pendiente de aprobación');
    estado.value = ''; estado.dispatchEvent(new Event('change'));
    for (const [id, valor] of [['filtro-desde', '2026-11-01'], ['filtro-hasta', '2026-11-30']]) {
      const campo = vista().querySelector<HTMLInputElement>('#' + id)!; campo.value = valor; campo.dispatchEvent(new Event('input'));
    }
    boton('Buscar').click();
    const todos = http.expectOne(req => req.url === solicitudes);
    expect(todos.request.params.has('estado')).toBeFalse(); expect(todos.request.params.get('fecha_desde')).toBe('2026-11-01');
    expect(todos.request.params.get('fecha_hasta')).toBe('2026-11-30');
    todos.flush({ success: true, data: { data: [], total: 21, current_page: 1, last_page: 2, per_page: 20 } }); harness.detectChanges();
    boton('Siguiente').click();
    const siguiente = http.expectOne(req => req.url === solicitudes); expect(siguiente.request.params.get('page')).toBe('2');
    expect(siguiente.request.params.has('estado')).toBeFalse(); expect(siguiente.request.params.get('fecha_desde')).toBe('2026-11-01'); siguiente.flush(pagina([])); harness.detectChanges();
    const busqueda = vista().querySelector<HTMLInputElement>('#filtro-busqueda')!;
    busqueda.value = 'Actividad'; busqueda.dispatchEvent(new Event('input')); boton('Buscar').click();
    const buscar = http.expectOne(req => req.url === solicitudes); expect(buscar.request.params.has('estado')).toBeFalse();
    expect(buscar.request.params.has('busqueda')).toBeFalse(); buscar.flush(pagina([])); harness.detectChanges();
    boton('Limpiar filtros').click();
    const limpiar = http.expectOne(req => req.url === solicitudes); expect(limpiar.request.params.get('estado')).toBe('Pendiente de aprobación');
    expect(limpiar.request.params.has('fecha_desde')).toBeFalse(); expect(limpiar.request.params.has('fecha_hasta')).toBeFalse();
    expect(limpiar.request.params.get('page')).toBe('1'); limpiar.flush(pagina([])); harness.detectChanges();
    expect(estado.value).toBe('Pendiente de aprobación'); expect(busqueda.value).toBe('');
  });
  for (const final of ['Aprobada', 'Rechazada'] as const) it(`Gerencia permite consultar ${final} sin acciones de decisión`, async () => {
    sesion([...claves, 'aprobar', 'rechazar'], 9, 'Administrador');
    harness = await RouterTestingHarness.create('/pendientes/pendientes-aprobacion');
    http.expectOne(req => req.url === solicitudes).flush(pagina([])); harness.detectChanges();
    const estado = vista().querySelector<HTMLSelectElement>('#filtro-estado')!;
    estado.value = final; estado.dispatchEvent(new Event('change')); boton('Buscar').click();
    const consulta = http.expectOne(req => req.url === solicitudes); expect(consulta.request.params.get('estado')).toBe(final);
    consulta.flush(pagina([{ ...SOLICITUD_API_TEST, estado: final }])); harness.detectChanges();
    expect(vista().querySelector('tbody .estado')?.textContent).toBe(final);
    expect(getComputedStyle(vista().querySelector('tbody .estado')!).color).toBe(final === 'Aprobada' ? 'rgb(35, 102, 65)' : 'rgb(155, 48, 48)');
    expect(Array.from(vista().querySelectorAll('tbody button'), boton => nombreBoton(boton))).toEqual(['Ver detalle']);
    http.expectNone(req => req.method === 'POST');
  });
  it('revisa, observa y deriva usando los endpoints reales y permisos de /me', () => {
    sesion(); const api = TestBed.inject(SolicitudesService);
    api.detalle('4', true).subscribe(); http.expectOne(solicitudes + '/4/review-detail').flush({ success: true, data: { ...SOLICITUD_API_TEST, estado: 'Enviada' } });
    for (const [accion, endpoint, estado, motivo] of [
      ['Iniciar revisión', 'review', 'En revisión', ''], ['Observar', 'observe', 'Observada', 'Precisar datos'],
    ] as const) {
      api.decidir('4', '', accion, motivo).subscribe(); const req = http.expectOne(solicitudes + '/4/' + endpoint);
      expect(req.request.body).toEqual(motivo ? { observacion: motivo } : {});
      req.flush({ success: true, data: { ...SOLICITUD_API_TEST, estado } });
    }
    api.detalle('4', true).subscribe(); http.expectOne(solicitudes + '/4/review-detail').flush({ success: true, data: { ...SOLICITUD_API_TEST, estado: 'En revisión' } });
    api.decidir('4', '', 'Derivar', '').subscribe(); http.expectOne(solicitudes + '/4/derive').flush({ success: true, data: { ...SOLICITUD_API_TEST, estado: 'Pendiente de aprobación' } });
  });
  it('no permite aprobar por el nombre Administrador ni decidir una solicitud propia', async () => {
    sesion(claves, 8, 'Administrador'); harness = await RouterTestingHarness.create('/pendientes/pendientes-aprobacion'); harness.detectChanges();
    const consulta = http.expectOne(req => req.url === solicitudes);
    expect(consulta.request.params.get('estado')).toBe('Pendiente de aprobación');
    consulta.flush(pagina([{ ...SOLICITUD_API_TEST, id_usuario_solicitante: 20, estado: 'Pendiente de aprobación' }])); harness.detectChanges();
    expect(vista().querySelector('[role="alert"]')).toBeNull();
    expect(vista().querySelector('tbody')?.textContent).not.toContain('Aprobar');
    expect(vista().querySelector('tbody')?.textContent).not.toContain('Rechazar');
    expect(vista().querySelector('tbody button[aria-label="Ver detalle"]')).not.toBeNull();
    const api = TestBed.inject(SolicitudesService);
    api.decidir('4', '', 'Aprobar', '').subscribe({ next: () => fail('No debe aprobar'), error: error => { expect(error instanceof AccesoSolicitudLocal).toBeTrue(); expect(error.status).toBeUndefined(); } });
    http.expectNone(req => req.method === 'POST');
    sesion(['consultar', 'aprobar', 'rechazar'], 8);
    api.detalle('4', true).subscribe(fila => { expect(fila.acciones).not.toContain('Aprobar'); expect(fila.acciones).not.toContain('Rechazar'); });
    http.expectOne(solicitudes + '/4/review-detail').flush({ success: true, data: { ...SOLICITUD_API_TEST, estado: 'Pendiente de aprobación' } });
  });
  it('permite consultar Gerencia con su capacidad aunque los permisos antiguos no incluyan consultar', async () => {
    sesion([], 9, 'Administrador', { consultar_gerencia: true, consulta_administrativa_global: true });
    harness = await RouterTestingHarness.create('/pendientes/pendientes-aprobacion');
    const req = http.expectOne(req => req.url === solicitudes);
    expect(req.request.params.get('estado')).toBe('Pendiente de aprobación'); expect(req.request.withCredentials).toBeTrue();
    req.flush(pagina([{ ...SOLICITUD_API_TEST, estado: 'Pendiente de aprobación' }])); harness.detectChanges();
    expect(TestBed.inject(Router).url).toBe('/pendientes/pendientes-aprobacion');
    expect(vista().querySelector('app-sidebar a[href="/pendientes/pendientes-aprobacion"]')).not.toBeNull();
    const textos = Array.from(vista().querySelectorAll('tbody button'), boton => nombreBoton(boton));
    expect(textos).toEqual(['Ver detalle']);
    const api = TestBed.inject(SolicitudesService);
    for (const accion of ['Aprobar', 'Rechazar'] as const) api.decidir('4', '', accion, 'Motivo de prueba').subscribe({
      next: () => fail('La lectura no concede decisiones'), error: error => { expect(error instanceof AccesoSolicitudLocal).toBeTrue(); expect(error.operacion).toBe('accion'); expect(error.status).toBeUndefined(); },
    });
    http.expectNone(req => req.method === 'POST');
  });
  it('las capacidades falsas prevalecen sobre permisos formales antiguos', () => {
    sesion(['consultar', 'aprobar', 'rechazar'], 9, 'Administrador', { consultar_gerencia: true, aprobar: false, rechazar: false });
    const api = TestBed.inject(SolicitudesService);
    api.listar('gerencia', { busqueda: '', estado: '', desde: '', hasta: '', pagina: 1 }).subscribe(pagina => {
      expect(pagina.registros[0].acciones).not.toContain('Aprobar'); expect(pagina.registros[0].acciones).not.toContain('Rechazar');
    });
    http.expectOne(req => req.url === solicitudes).flush(pagina([{ ...SOLICITUD_API_TEST, estado: 'Pendiente de aprobación' }]));
    api.decidir('4', '', 'Aprobar', '').subscribe({ next: () => fail('No debe aprobar'), error: error => expect(error.origen).toBe('frontend') });
    http.expectNone(req => req.method === 'POST');
  });
  it('una capacidad de consulta falsa bloquea la ruta y produce una denegación local sin status HTTP', async () => {
    sesion(['consultar', 'aprobar'], 9, 'Administrador', { consultar_gerencia: false });
    harness = await RouterTestingHarness.create('/pendientes/pendientes-aprobacion');
    expect(TestBed.inject(Router).url).toBe('/acceso-denegado');
    const api = TestBed.inject(SolicitudesService);
    api.listar('gerencia', { busqueda: '', estado: '', desde: '', hasta: '', pagina: 1 }).subscribe({
      next: () => fail('No debe devolver una lista'), error: error => { expect(error instanceof AccesoSolicitudLocal).toBeTrue(); expect(error.operacion).toBe('consulta'); expect(error.status).toBeUndefined(); },
    });
    http.expectNone(req => req.url === solicitudes);
  });
  it('la consulta de revisión es independiente de la facultad de revisar', async () => {
    sesion([], 9, 'Digitador', { consultar_revision: true, revisar: false, derivar: false });
    harness = await RouterTestingHarness.create('/solicitudes/revision');
    http.expectOne(req => req.url === solicitudes).flush(pagina([{ ...SOLICITUD_API_TEST, estado: 'Enviada' }])); harness.detectChanges();
    expect(TestBed.inject(Router).url).toBe('/solicitudes/revision');
    expect(Array.from(vista().querySelectorAll('tbody button'), boton => nombreBoton(boton))).toEqual(['Ver detalle']);
  });
  it('consultar historial no necesita capacidad de Gerencia ni permisos de escritura', async () => {
    sesion([], 9, 'Digitador', { consultar_historial: true, consultar_gerencia: false, aprobar: false, rechazar: false });
    harness = await RouterTestingHarness.create('/pendientes/historial-decisiones');
    http.expectOne(req => req.url === solicitudes + '/decisions/history').flush(pagina([])); harness.detectChanges();
    expect(TestBed.inject(Router).url).toBe('/pendientes/historial-decisiones');
    expect(vista().querySelector('app-sidebar a[href="/pendientes/historial-decisiones"]')).not.toBeNull();
    http.expectNone(req => req.method === 'POST');
  });
  it('conserva un 403 real de Laravel y muestra su motivo sin convertirlo en una denegación local', async () => {
    sesion([], 9, 'Administrador', { consultar_gerencia: true });
    harness = await RouterTestingHarness.create('/pendientes/pendientes-aprobacion');
    http.expectOne(req => req.url === solicitudes).flush({ success: false, message: 'Solicitud fuera del ámbito autorizado.', data: null }, { status: 403, statusText: 'Forbidden' });
    harness.detectChanges();
    expect(vista().querySelector('[role="alert"]')?.textContent).toContain('Laravel rechazó el acceso (403)');
    expect(vista().querySelector('[role="alert"]')?.textContent).toContain('Solicitud fuera del ámbito autorizado.');
    expect(vista().querySelector('tbody')).toBeNull(); expect(auth.usuario()?.id).toBe(9);
    expect(vista().textContent).not.toContain('No se encontraron solicitudes');
  });
  it('no confirma un modal de aprobación después de revocar la capacidad en /me', async () => {
    sesion(['consultar', 'aprobar'], 9); harness = await RouterTestingHarness.create('/pendientes/pendientes-aprobacion');
    http.expectOne(req => req.url === solicitudes).flush(pagina([{ ...SOLICITUD_API_TEST, estado: 'Pendiente de aprobación' }])); harness.detectChanges();
    boton('Aprobar').click(); harness.detectChanges(); expect(boton('Confirmar Aprobar').disabled).toBeFalse();
    sesion(['consultar', 'aprobar'], 9, 'Gerencial', { consultar_gerencia: true, aprobar: false }); harness.detectChanges();
    expect(auth.tienePermiso('solicitudes.aprobar')).toBeTrue(); expect(auth.capacidadesSolicitudes()?.aprobar).toBeFalse();
    expect(boton('Confirmar Aprobar').disabled).toBeTrue(); boton('Confirmar Aprobar').click();
    http.expectNone(req => req.method === 'POST');
    expect(vista().querySelector('tbody')?.textContent).not.toContain('Aprobar');
  });
  it('recargar /me reemplaza las diez capacidades y no conserva autorizaciones previas', () => {
    sesion(['consultar', 'aprobar', 'rechazar', 'revisar', 'derivar', 'historial'], 9, 'Administrador', { decidir_propias: true, decidir_ambito_institucional: true });
    expect(auth.capacidadesSolicitudes()?.aprobar).toBeTrue();
    expect(auth.capacidadesSolicitudes()?.decidir_propias).toBeTrue();
    expect(auth.capacidadesSolicitudes()?.decidir_ambito_institucional).toBeTrue();
    auth.recargarSesion().subscribe(); expect(auth.capacidadesSolicitudes()).toBeNull();
    expect(auth.permisos()).toEqual([]); expect(auth.modulos()).toEqual([]);
    expect(auth.tienePermiso('solicitudes.aprobar')).toBeFalse();
    http.expectOne(base + '/auth/me').flush({ user: { ...usuario, id: 9 }, modulos: [], permisos: [], capacidades_solicitudes: SIN_CAPACIDADES_SOLICITUDES_TEST });
    expect(auth.capacidadesSolicitudes()).toEqual(SIN_CAPACIDADES_SOLICITUDES_TEST); expect(auth.permisos()).toEqual([]);
    auth.limpiarSesion(); expect(auth.capacidadesSolicitudes()).toBeNull();
  });
  it('no infiere capacidades de un contrato antiguo o de valores que no sean booleanos', () => {
    auth.recargarSesion().subscribe();
    http.expectOne(base + '/auth/me').flush({ user: usuario, modulos: [], permisos: ['solicitudes.aprobar', 'solicitudes.consultar'] });
    expect(auth.capacidadesSolicitudes()).toBeNull();
    const api = TestBed.inject(SolicitudesService);
    api.listar('gerencia', { busqueda: '', estado: '', desde: '', hasta: '', pagina: 1 }).subscribe({ next: () => fail('No debe inferir consulta'), error: error => expect(error.status).toBeUndefined() });
    auth.recargarSesion().subscribe();
    http.expectOne(base + '/auth/me').flush({ user: usuario, modulos: [], permisos: ['solicitudes.aprobar'], capacidades_solicitudes: { consultar_gerencia: 'true', aprobar: 1, decidir_propias: 'true', decidir_ambito_institucional: 1, permiso_inventado: true } });
    expect(auth.capacidadesSolicitudes()).toEqual(SIN_CAPACIDADES_SOLICITUDES_TEST); http.expectNone(req => req.url === solicitudes);
  });
  for (const caso of [
    { nombre: 'propia autorizada', propias: true, institucional: true, aprobar: true, rechazar: true, enviada: false, acciones: ['Aprobar', 'Rechazar'] },
    { nombre: 'propia sin excepción', propias: false, institucional: true, aprobar: true, rechazar: true, enviada: false, acciones: [] },
    { nombre: 'sin aprobación', propias: true, institucional: true, aprobar: false, rechazar: true, enviada: false, acciones: ['Rechazar'] },
    { nombre: 'sin rechazo', propias: true, institucional: true, aprobar: true, rechazar: false, enviada: false, acciones: ['Aprobar'] },
    { nombre: 'excepciones sin facultades formales', propias: true, institucional: true, aprobar: false, rechazar: false, enviada: false, acciones: [] },
    { nombre: 'enviada con excepciones', propias: true, institucional: true, aprobar: true, rechazar: true, enviada: true, acciones: [] },
  ]) it(`capacidades efectivas de Administrador: ${caso.nombre}`, async () => {
    sesion(['consultar', 'aprobar', 'rechazar'], 8, 'Administrador', {
      consultar_gerencia: true, aprobar: caso.aprobar, rechazar: caso.rechazar,
      decidir_propias: caso.propias, decidir_ambito_institucional: caso.institucional,
    });
    harness = await RouterTestingHarness.create('/pendientes/pendientes-aprobacion');
    http.expectOne(req => req.url === solicitudes).flush(pagina([{ ...SOLICITUD_API_TEST, estado: caso.enviada ? 'Enviada' : 'Pendiente de aprobación' }])); harness.detectChanges();
    expect(Array.from(vista().querySelectorAll('tbody button'), boton => nombreBoton(boton))).toEqual(['Ver detalle', ...caso.acciones]);
    const api = TestBed.inject(SolicitudesService);
    for (const accion of ['Aprobar', 'Rechazar'] as const) if (!caso.acciones.includes(accion)) {
      api.decidir('4', '', accion, 'Motivo').subscribe({ next: () => fail('No debe decidir'), error: error => expect(error instanceof AccesoSolicitudLocal).toBeTrue() });
    }
    http.expectNone(req => req.method === 'POST');
  });
  it('el ámbito institucional permite presentar decisiones de otra área sin usar áreas de creación', async () => {
    sesion(['consultar', 'aprobar', 'rechazar'], 9, 'Administrador', { decidir_propias: true, decidir_ambito_institucional: true });
    harness = await RouterTestingHarness.create('/pendientes/pendientes-aprobacion');
    const listado = http.expectOne(req => req.url === solicitudes);
    expect(listado.request.params.has('id_area')).toBeFalse();
    listado.flush(pagina([{ ...SOLICITUD_API_TEST, id_area: 101, estado: 'Pendiente de aprobación' }])); harness.detectChanges();
    expect(Array.from(vista().querySelectorAll('tbody button'), boton => nombreBoton(boton))).toEqual(['Ver detalle', 'Aprobar', 'Rechazar']);
    http.expectNone(solicitudes + '/authorized-areas'); http.expectNone(req => req.method === 'POST');
  });
  it('revocar decidir_propias en /me bloquea un modal abierto aunque aprobar siga habilitado', async () => {
    sesion(['consultar', 'aprobar'], 8, 'Administrador', { decidir_propias: true, decidir_ambito_institucional: true });
    harness = await RouterTestingHarness.create('/pendientes/pendientes-aprobacion');
    http.expectOne(req => req.url === solicitudes).flush(pagina([{ ...SOLICITUD_API_TEST, estado: 'Pendiente de aprobación' }])); harness.detectChanges();
    boton('Aprobar').click(); harness.detectChanges(); expect(boton('Confirmar Aprobar').disabled).toBeFalse();
    sesion(['consultar', 'aprobar'], 8, 'Administrador', { decidir_propias: false, decidir_ambito_institucional: false }); harness.detectChanges();
    expect(auth.capacidadesSolicitudes()?.aprobar).toBeTrue();
    expect(boton('Confirmar Aprobar').disabled).toBeTrue(); boton('Confirmar Aprobar').click();
    http.expectNone(req => req.method === 'POST');
  });
  for (const propia of [false, true]) for (const [accion, endpoint, estado, tipoDecision] of [
    ['Aprobar', 'approve', 'Aprobada', 'APROBAR'], ['Rechazar', 'reject', 'Rechazada', 'RECHAZAR'],
  ] as const) it(`${accion} solicitud ${propia ? 'propia con excepción explícita' : 'ajena'} y refresca las bandejas`, async () => {
    sesion([...claves, 'aprobar', 'rechazar'], propia ? 8 : 9, propia ? 'Administrador' : 'Gerencial', {
      decidir_propias: propia, decidir_ambito_institucional: propia,
    });
    harness = await RouterTestingHarness.create('/pendientes/pendientes-aprobacion');
    const pendiente = { ...SOLICITUD_API_TEST, estado: 'Pendiente de aprobación', area_nombre: 'Área de prueba de Gerencia', solicitante_nombre: 'Solicitante recibido de Laravel' };
    http.expectOne(req => req.url === solicitudes).flush(pagina([pendiente])); harness.detectChanges();
    expect(vista().querySelector('tbody button[aria-label="Aprobar solicitud"]')).not.toBeNull();
    expect(vista().querySelector('tbody button[aria-label="Rechazar solicitud"]')).not.toBeNull();
    boton(accion).click(); harness.detectChanges();
    expect(vista().querySelector('app-decision-modal')?.textContent).toContain(pendiente.area_nombre);
    expect(vista().querySelector('app-decision-modal')?.textContent).toContain(pendiente.solicitante_nombre);
    expect(vista().querySelector('app-decision-modal')?.textContent?.includes('Ámbito institucional autorizado.')).toBe(propia);
    if (accion === 'Rechazar') {
      boton('Confirmar Rechazar').click(); harness.detectChanges(); http.expectNone(req => req.method === 'POST');
      const motivo = vista().querySelector<HTMLTextAreaElement>('#motivo-decision')!;
      motivo.value = 'Motivo confirmado de prueba'; motivo.dispatchEvent(new Event('input')); harness.detectChanges();
    }
    if (accion === 'Aprobar' && propia) {
      const observacion = vista().querySelector<HTMLTextAreaElement>('#motivo-decision')!;
      observacion.value = 'Conforme'; observacion.dispatchEvent(new Event('input')); harness.detectChanges();
    }
    let cambios = 0; const escucha = TestBed.inject(SolicitudesService).cambios$.subscribe(() => cambios++);
    boton('Confirmar ' + accion).click(); harness.detectChanges(); boton('Confirmar ' + accion).click();
    expect(boton('Confirmar ' + accion).disabled).toBeTrue();
    expect(vista().textContent).not.toContain('Estado: ' + estado); expect(cambios).toBe(0);
    const decision = http.expectOne(solicitudes + '/4/' + endpoint);
    expect(decision.request.withCredentials).toBeTrue();
    expect(decision.request.body).toEqual(accion === 'Rechazar' ? { observacion: 'Motivo confirmado de prueba' } : propia ? { observacion: 'Conforme' } : {});
    const final = { ...pendiente, estado, id_actividad: accion === 'Aprobar' ? 20 : null };
    decision.flush({ success: true, data: final });
    http.expectOne(req => req.url === solicitudes).flush(pagina([])); harness.detectChanges();
    expect(cambios).toBe(1); escucha.unsubscribe();
    expect(vista().querySelector('tbody')).toBeNull(); expect(vista().textContent).toContain('Estado: ' + estado);
    http.expectNone(req => req.method === 'POST' && req.url.includes('/activity'));
    sesion([...claves, 'actividades.ver']);
    await harness.navigateByUrl('/solicitudes/mis-solicitudes');
    http.expectOne(req => req.url === solicitudes + '/mine').flush(pagina([final])); harness.detectChanges();
    expect(vista().querySelector('tbody .estado')?.textContent).toBe(estado);
    boton('Ver detalle').click(); harness.detectChanges();
    http.expectOne(solicitudes + '/4').flush({ success: true, data: final }); harness.detectChanges();
    boton('Consultar historial').click(); harness.detectChanges();
    const evento = { id_solicitud_decision: 11, id_solicitud_actividad: 4, id_usuario_responsable: propia ? 8 : 9,
      responsable_nombre: 'Funcionario autorizado de prueba', tipo_decision: tipoDecision, estado_anterior: 'Pendiente de aprobación', estado_nuevo: estado,
      fecha_decision: '2026-11-03T18:00:00Z', observacion: accion === 'Rechazar' ? 'Motivo confirmado de prueba' : null };
    http.expectOne(solicitudes + '/4/history').flush({ success: true, data: [evento] }); harness.detectChanges();
    expect(vista().querySelector('app-solicitud-detalle')?.textContent).toContain('Funcionario autorizado de prueba');
    expect(vista().querySelector('app-solicitud-detalle')?.textContent).toContain(accion === 'Aprobar' ? 'Aprobación de Gerencia' : 'Rechazo de Gerencia');
    expect(vista().querySelector('app-solicitud-detalle a') !== null).toBe(accion === 'Aprobar');
    await harness.navigateByUrl('/solicitudes/revision');
    http.expectOne(req => req.url === solicitudes).flush(pagina([])); harness.detectChanges();
    const filtroEstado = vista().querySelector<HTMLSelectElement>('#filtro-estado')!;
    filtroEstado.value = estado; filtroEstado.dispatchEvent(new Event('change')); boton('Buscar').click();
    const revision = http.expectOne(req => req.url === solicitudes); expect(revision.request.params.get('estado')).toBe(estado);
    revision.flush(pagina([final])); harness.detectChanges();
    expect(vista().querySelector('tbody .estado')?.textContent).toBe(estado);
    expect(Array.from(vista().querySelectorAll('tbody button'), boton => nombreBoton(boton))).toEqual(['Ver detalle']);
    await harness.navigateByUrl('/pendientes/historial-decisiones');
    http.expectOne(req => req.url === solicitudes + '/decisions/history').flush(pagina([{ ...evento,
      solicitud_nombre: final.nombre, id_area: final.id_area, area_nombre: final.area_nombre, id_usuario_solicitante: final.id_usuario_solicitante }])); harness.detectChanges();
    expect(vista().querySelector('tbody')?.textContent).toContain('Funcionario autorizado de prueba');
    expect(vista().querySelector('tbody')?.textContent).toContain(estado);
    if (accion === 'Aprobar') {
      await harness.navigateByUrl('/certificaciones/actividades?actividad=20'); harness.detectChanges();
      const actividad = { id_actividad: 20, id_area: final.id_area, id_tipo_actividad: final.id_tipo_actividad, nombre: final.nombre,
        fecha_inicio: final.fecha_inicio_propuesta, fecha_fin: final.fecha_fin_propuesta, descripcion: null, sede: null, estado: 'Activa' };
      http.expectOne(base + '/activity').flush({ success: true, data: [actividad] });
      http.expectOne(base + '/areas/list').flush({ success: true, data: [] });
      http.expectOne(base + '/ativicty-type').flush({ success: true, data: [] });
      for (const req of http.match(base + '/activity/20').filter(req => !req.cancelled)) req.flush({ success: true, data: actividad });
      harness.detectChanges();
      expect(vista().querySelector('app-dialogo .detalle')?.textContent).toContain(final.nombre);
    } else http.expectNone(req => req.url.includes('/activity/'));
  });
  for (const status of [409, 422, 0]) it(`una decisión con error ${status} no cambia el estado ni publica éxito`, async () => {
    sesion(['consultar', 'aprobar'], 9, 'Gerencial');
    harness = await RouterTestingHarness.create('/pendientes/pendientes-aprobacion');
    http.expectOne(req => req.url === solicitudes).flush(pagina([{ ...SOLICITUD_API_TEST, estado: 'Pendiente de aprobación' }])); harness.detectChanges();
    let cambios = 0; const escucha = TestBed.inject(SolicitudesService).cambios$.subscribe(() => cambios++);
    boton('Aprobar').click(); harness.detectChanges(); boton('Confirmar Aprobar').click();
    const req = http.expectOne(solicitudes + '/4/approve');
    if (status === 0) req.error(new ProgressEvent('error'));
    else req.flush({ success: false, message: 'Validación rechazada por Laravel', data: status === 422 ? { observacion: ['Observación inválida'] } : null }, { status, statusText: 'Error' });
    harness.detectChanges(); expect(vista().querySelector('[role="alert"]')).not.toBeNull();
    expect(vista().querySelector('tbody .estado')?.textContent).toBe('Pendiente de aprobación');
    expect(vista().textContent).not.toContain('Estado: Aprobada'); expect(cambios).toBe(0); escucha.unsubscribe();
    http.expectNone(req => req.url === solicitudes);
  });
  it('no publica aprobación si la respuesta no confirma una actividad vinculada', () => {
    sesion(['consultar', 'aprobar'], 9); const api = TestBed.inject(SolicitudesService);
    api.detalle('4', true).subscribe(); http.expectOne(solicitudes + '/4/review-detail').flush({ success: true, data: { ...SOLICITUD_API_TEST, estado: 'Pendiente de aprobación' } });
    let cambios = 0; const escucha = api.cambios$.subscribe(() => cambios++);
    api.decidir('4', '', 'Aprobar', '').subscribe({ next: () => fail('No confirmó el vínculo'), error: error => expect(error.message).toContain('no confirmó') });
    http.expectOne(solicitudes + '/4/approve').flush({ success: true, data: { ...SOLICITUD_API_TEST, estado: 'Aprobada', id_actividad: null } });
    expect(cambios).toBe(0); escucha.unsubscribe();
  });
  it('Mis solicitudes vuelve a consultar Laravel al recuperar el foco', async () => {
    sesion(); harness = await RouterTestingHarness.create('/solicitudes/mis-solicitudes');
    http.expectOne(req => req.url === solicitudes + '/mine').flush(pagina([{ ...SOLICITUD_API_TEST, estado: 'Pendiente de aprobación' }])); harness.detectChanges();
    window.dispatchEvent(new Event('focus'));
    http.expectOne(req => req.url === solicitudes + '/mine').flush(pagina([{ ...SOLICITUD_API_TEST, estado: 'Rechazada' }])); harness.detectChanges();
    expect(vista().querySelector('tbody .estado')?.textContent).toBe('Rechazada');
  });
  it('un 403 de decisión conserva Pendiente y retira las acciones del expediente sin competencia', async () => {
    sesion(['consultar', 'aprobar', 'rechazar'], 9, 'Gerencial');
    harness = await RouterTestingHarness.create('/pendientes/pendientes-aprobacion');
    http.expectOne(req => req.url === solicitudes).flush(pagina([{ ...SOLICITUD_API_TEST, estado: 'Pendiente de aprobación' }])); harness.detectChanges();
    boton('Aprobar').click(); harness.detectChanges(); boton('Confirmar Aprobar').click();
    http.expectOne(solicitudes + '/4/approve').flush({ success: false, message: 'Sin competencia sobre el área.', data: null }, { status: 403, statusText: 'Forbidden' }); harness.detectChanges();
    expect(vista().querySelector('[role="alert"]')?.textContent).toContain('Sin competencia sobre el área.');
    expect(Array.from(vista().querySelectorAll('tbody button'), boton => nombreBoton(boton))).toEqual(['Ver detalle']);
    expect(vista().querySelector('tbody .estado')?.textContent).toBe('Pendiente de aprobación');
    http.expectNone(req => req.url === solicitudes);
  });
  it('un 403 de detalle retira acciones de una fila cargada antes de revocar la competencia', async () => {
    sesion(['consultar', 'aprobar', 'rechazar'], 9, 'Gerencial');
    harness = await RouterTestingHarness.create('/pendientes/pendientes-aprobacion');
    http.expectOne(req => req.url === solicitudes).flush(pagina([{ ...SOLICITUD_API_TEST, estado: 'Pendiente de aprobación' }])); harness.detectChanges();
    boton('Ver detalle').click(); harness.detectChanges();
    http.expectOne(solicitudes + '/4/review-detail').flush({ success: false, message: 'Competencia revocada.', data: null }, { status: 403, statusText: 'Forbidden' }); harness.detectChanges();
    expect(Array.from(vista().querySelectorAll('tbody button'), boton => nombreBoton(boton))).toEqual(['Ver detalle']);
    expect(vista().querySelector('[role="alert"]')?.textContent).toContain('Competencia revocada.');
    http.expectNone(req => req.method === 'POST');
  });
  it('aprobar exige confirmación, no envía aprobador ni crea actividad y recarga desde Laravel', async () => {
    sesion(['consultar', 'aprobar', 'rechazar', 'historial'], 9);
    harness = await RouterTestingHarness.create('/pendientes/pendientes-aprobacion');
    const listado = http.expectOne(req => req.url === solicitudes); expect(listado.request.params.get('estado')).toBe('Pendiente de aprobación');
    listado.flush(pagina([{ ...SOLICITUD_API_TEST, estado: 'Pendiente de aprobación' }])); harness.detectChanges();
    boton('Aprobar').click(); harness.detectChanges(); http.expectNone(req => req.method === 'POST');
    boton('Confirmar Aprobar').click(); harness.detectChanges();
    const aprobar = http.expectOne(solicitudes + '/4/approve'); expect(aprobar.request.body).toEqual({}); expect(aprobar.request.withCredentials).toBeTrue();
    aprobar.flush({ success: true, data: { ...SOLICITUD_API_TEST, estado: 'Aprobada', id_actividad: 20 } });
    http.expectOne(req => req.url === solicitudes).flush(pagina([])); harness.detectChanges();
    expect(vista().textContent).toContain('Estado: Aprobada'); http.expectNone(req => req.url.includes('/activity/'));
  });
  it('historial consulta el paginador global incluso sin permiso formal de aprobación', async () => {
    sesion(['historial']); harness = await RouterTestingHarness.create('/pendientes/historial-decisiones');
    const historial = http.expectOne(req => req.url === solicitudes + '/decisions/history'); expect(historial.request.withCredentials).toBeTrue();
    historial.flush(pagina([{ id_solicitud_decision: 1, id_solicitud_actividad: 4, id_usuario_responsable: 9, id_usuario_solicitante: 8, id_area: 2,
      solicitud_nombre: 'Solicitud HTTP de prueba', tipo_decision: 'APROBAR', estado_anterior: 'Pendiente de aprobación', estado_nuevo: 'Aprobada', observacion: 'Conforme', fecha_decision: '2026-12-10' }]));
    harness.detectChanges(); expect(vista().querySelector('tbody')?.textContent).toContain('Solicitud HTTP de prueba'); expect(vista().querySelector('tbody')?.textContent).toContain('Conforme');
  });
  it('rechazar exige motivo y nunca envía la identidad del responsable', () => {
    sesion(['consultar', 'rechazar'], 9); const api = TestBed.inject(SolicitudesService);
    api.detalle('4', true).subscribe(); http.expectOne(solicitudes + '/4/review-detail').flush({ success: true, data: { ...SOLICITUD_API_TEST, estado: 'Pendiente de aprobación' } });
    let denegado = false; api.decidir('4', '', 'Rechazar', ' ').subscribe({ error: () => denegado = true });
    expect(denegado).toBeTrue(); http.expectNone(req => req.method === 'POST');
    api.decidir('4', '', 'Rechazar', 'Motivo de prueba').subscribe();
    const rechazar = http.expectOne(solicitudes + '/4/reject'); expect(rechazar.request.body).toEqual({ observacion: 'Motivo de prueba' });
    rechazar.flush({ success: true, data: { ...SOLICITUD_API_TEST, estado: 'Rechazada' } });
  });
  it('401 termina la sesión sin convertir la respuesta en una lista vacía', async () => {
    sesion(); const api = TestBed.inject(ActivityRequestsApiService); let status = 0;
    api.listar({}, true).subscribe({ next: () => fail('No debe devolver una lista'), error: error => status = error.status });
    http.expectOne(req => req.url === solicitudes + '/mine').flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(status).toBe(401); expect(auth.usuario()).toBeNull(); await TestBed.inject(Router).navigateByUrl('/login');
    expect(auth.capacidadesSolicitudes()).toBeNull();
  });
});
