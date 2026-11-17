import { TODAS_CAPACIDADES_SOLICITUDES_TEST } from '../../core/interfaces/autenticacion/auth-fixtures.spec';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of, Subject, throwError } from 'rxjs';
import { routes } from '../../app.routes';
import { Solicitud, PaginaSolicitudes } from '../../core/interfaces/solicitudes/solicitud.interface';
import { AuthService } from '../../core/services/autenticacion/auth.service';
import { IntegracionSolicitudesPendiente, SOLICITUDES_GATEWAY, SolicitudesGateway, SolicitudesService } from '../../core/services/solicitudes/solicitudes.service';
import { environment } from '../../../environments/environment';
import { ACTIVITY_REQUESTS_API_ACTIVA } from '../../core/services/solicitudes/activity-requests-api.service';
import { fechasSolicitud, NuevaSolicitudComponent } from './nueva-solicitud/nueva-solicitud.component';

/** Datos exclusivos de pruebas, inyectados en el puerto; nunca se incluyen en las vistas productivas. */
describe('Solicitudes y Gerencia preparadas para integración real', () => {
  const solicitud: Solicitud = { id: 'test-1', numero: 'TEST-1', areaId: '9', area: 'Área de prueba unitaria', responsable: 'Usuario de prueba',
    nombre: 'Actividad para prueba unitaria', tipoId: '3', tipo: 'Tipo de prueba', descripcion: 'Descripción de la prueba', objetivo: 'Verificar la interfaz',
    inicio: '2026-12-01', fin: '2026-12-02', lugar: 'Lugar de prueba', observaciones: '', fecha: '2026-11-02T10:00:00Z',
    estado: 'Pendiente de aprobación', revisor: 'Revisor de prueba', ultimaObservacion: null, resultadoRevision: 'Conforme', version: 'v1', puedeEditar: false,
    acciones: ['Aprobar', 'Observar', 'Rechazar'] };
  const pagina: PaginaSolicitudes<Solicitud> = { registros: [solicitud], total: 1, pagina: 1, ultimaPagina: 1 };
  let gateway: jasmine.SpyObj<SolicitudesGateway>;
  let http: HttpTestingController;
  let harness: RouterTestingHarness;
  function configurar(integrado = true, consultarCatalogos = integrado, rol = 'Administrador', permisos?: readonly string[]): void {
    gateway = jasmine.createSpyObj<SolicitudesGateway>('gateway', ['contexto', 'listar', 'detalle', 'guardar', 'decidir', 'documentos', 'documento']);
    gateway.contexto.and.returnValue(of({ responsable: 'Usuario de prueba', areasDisponibles: [{ id: '9', nombre: 'Área de prueba unitaria' }], puedeCrear: true }));
    gateway.listar.and.returnValue(of(pagina)); gateway.detalle.and.returnValue(of(solicitud));
    gateway.guardar.and.returnValue(of({ ...solicitud, estado: 'Borrador', puedeEditar: true, acciones: ['Enviar'] }));
    gateway.decidir.and.returnValue(of({ ...solicitud, estado: 'Aprobada', acciones: [] }));
    gateway.documentos.and.returnValue(of({ registros: [], total: 0, pagina: 1, ultimaPagina: 1 }));
    TestBed.configureTestingModule({ providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting(),
      { provide: ACTIVITY_REQUESTS_API_ACTIVA, useValue: integrado || consultarCatalogos },
      { provide: SOLICITUDES_GATEWAY, useValue: integrado ? gateway : null },
      { provide: AuthService, useValue: { cargarSesion: () => of(true), tienePermiso: (clave: string) => permisos ? permisos.includes(clave) : !['areas.ver', 'actividades.ver'].includes(clave) || consultarCatalogos,
        capacidadesSolicitudes: signal(TODAS_CAPACIDADES_SOLICITUDES_TEST), usuario: signal({ id: 1, nombre: 'Usuario de prueba', email: 'prueba@example.test', rol }), modulos: signal([]) } },
    ] });
    http = TestBed.inject(HttpTestingController);
  }
  afterEach(() => http?.verify());
  const vista = () => harness.routeNativeElement!;
  async function navegar(url: string): Promise<void> { harness = await RouterTestingHarness.create(url); harness.detectChanges(); }
  function boton(texto: string): HTMLButtonElement {
    const boton = Array.from(vista().querySelectorAll<HTMLButtonElement>('button')).find(boton => (boton.getAttribute('aria-label')?.replace(/ solicitud$/, '') ?? boton.textContent?.trim()) === texto);
    if (!boton) throw new Error('No se encontró el botón ' + texto);
    return boton;
  }
  async function pulsar(texto: string): Promise<void> { boton(texto).click(); harness.detectChanges(); await harness.fixture.whenStable(); harness.detectChanges(); }
  function cambiar(selector: string, valor: string): void {
    const control = vista().querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(selector)!;
    control.value = valor; control.dispatchEvent(new Event(control instanceof HTMLSelectElement ? 'change' : 'input')); harness.detectChanges();
  }
  function catalogos(): void { for (const req of http.match(environment.apiBaseUrl + '/activity-requests/authorized-areas')) req.flush({ success: true, data: [{ id_area: 9, nombre: 'Area HTTP de prueba' }] }); http.expectOne(environment.apiBaseUrl + '/ativicty-type?estado=1').flush({ success: true, data: [{ id_tipo_actividad: 3, nombre: 'Tipo de prueba', estado: true }] }); harness.detectChanges(); }
  function completar(): void {
    cambiar('#solicitud-nombre', solicitud.nombre);
    cambiar('#solicitud-tipo', '3'); cambiar('#solicitud-inicio', solicitud.inicio); cambiar('#solicitud-fin', solicitud.fin);
    cambiar('#solicitud-descripcion', solicitud.descripcion); cambiar('#solicitud-objetivo', solicitud.objetivo);
  }

  it('muestra el nombre del revisor solo si el modelo autorizado lo proporciona', async () => {
    configurar(); await navegar('/solicitudes/revision');
    expect(vista().querySelector('tbody')?.textContent).toContain('Revisor de prueba');
    await pulsar('Ver detalle');
    expect(vista().querySelector('app-solicitud-detalle')?.textContent).toContain('Revisor de prueba');
    expect(vista().textContent).not.toContain('Revisor no informado por la API');
    expect(vista().textContent).not.toContain('No informado en el contrato de detalle');
  });
  it('sin adaptador no autoriza operaciones administrativas ni simula respuestas del servidor', () => {
    configurar(false); const api = TestBed.inject(SolicitudesService);
    expect(api.integrado).toBeFalse();
    let error: unknown;
    api.listar('revision', { busqueda: '', estado: '', desde: '', hasta: '', pagina: 1 }).subscribe({ error: valor => error = valor });
    expect(error instanceof IntegracionSolicitudesPendiente).toBeTrue(); expect(gateway.listar).not.toHaveBeenCalled(); http.expectNone(() => true);
  });

  it('Mis solicitudes separa el correlativo y el número de solicitud y abre el detalle con el ojo', async () => {
    configurar(); gateway.listar.and.returnValue(of({ ...pagina, registros: [{ ...solicitud, id: '1', idSolicitudActividad: 1, numero: 'Solicitud 1' }] }));
    await navegar('/solicitudes/mis-solicitudes');
    expect(Array.from(vista().querySelectorAll('thead th'), celda => celda.textContent?.trim())).toEqual(['N.º', 'Solicitud', 'Actividad', 'Área solicitante', 'Responsable', 'Fecha', 'Estado', 'Acciones']);
    const celdas = vista().querySelectorAll('tbody tr:first-child > td');
    expect(celdas.length).toBe(8); expect(celdas[0].textContent?.trim()).toBe('1');
    expect(celdas[1].textContent?.trim()).toBe('1');
    expect(celdas[2].textContent?.trim()).toBe(solicitud.nombre); expect(celdas[3].textContent?.trim()).toBe(solicitud.area);
    expect(celdas[4].textContent?.trim()).toBe(solicitud.responsable); expect(celdas[5].textContent?.trim()).toBe('02/11/2026');
    expect(celdas[6].textContent?.trim()).toBe(solicitud.estado); expect(vista().querySelector('tbody')?.textContent).not.toContain(solicitud.revisor!);
    expect(celdas[7].querySelector('[aria-label="Ver detalle"] .material-symbols-outlined')?.textContent).toBe('visibility');
    await pulsar('Ver detalle'); expect(gateway.detalle).toHaveBeenCalledWith('1', false);
    expect(vista().querySelector('app-solicitud-detalle')?.textContent).toContain(solicitud.revisor!);
  });

  it('Mis solicitudes mantiene registros e indicadores durante refetch y después de un error real', async () => {
    configurar(); gateway.listar.and.returnValue(of({ ...pagina, total: 30, ultimaPagina: 2 }));
    await navegar('/solicitudes/mis-solicitudes');
    window.dispatchEvent(new Event('focus')); document.dispatchEvent(new Event('visibilitychange'));
    expect(gateway.listar).toHaveBeenCalledTimes(1);
    const respuesta = new Subject<PaginaSolicitudes<Solicitud>>(); gateway.listar.and.returnValue(respuesta);
    await pulsar('Siguiente'); expect(gateway.listar).toHaveBeenCalledTimes(2);
    expect(vista().querySelector('tbody')?.textContent).toContain(solicitud.nombre);
    expect(vista().querySelector('.indicador strong')?.textContent).toBe('30'); expect(vista().querySelector('.estado-carga')?.textContent).toContain('Actualizando');
    respuesta.error(new Error('Error de consulta')); harness.detectChanges();
    expect(vista().querySelector('[role="alert"]')).not.toBeNull();
    expect(vista().querySelector('tbody')?.textContent).toContain(solicitud.nombre);
    expect(vista().querySelector('.indicador strong')?.textContent).toBe('30');
    expect(vista().textContent).not.toContain('No se encontraron solicitudes');
  });
  for (const caso of [{ rol: 'Administrador', cantidad: 10 }, { rol: 'Usuario', cantidad: 1 }]) {
    it('muestra exclusivamente las areas autorizadas por Laravel para ' + caso.rol, async () => {
      configurar(true, true, caso.rol); await navegar('/solicitudes/nueva');
      const areas = Array.from({ length: caso.cantidad }, (_, i) => ({ id_area: i + 1, nombre: 'Area autorizada ' + (i + 1) }));
      for (const req of http.match(environment.apiBaseUrl + '/activity-requests/authorized-areas')) req.flush({ success: true, data: areas });
      http.expectOne(environment.apiBaseUrl + '/ativicty-type?estado=1').flush({ success: true, data: [] }); harness.detectChanges();
      const opciones = Array.from(vista().querySelector<HTMLSelectElement>('#solicitud-area')!.options).filter(o => o.value);
      expect(opciones.map(o => o.value)).toEqual(areas.map(a => String(a.id_area)));
      http.expectNone(req => req.url.includes('/areas/list'));
    });
  }
  it('carga solo las opciones HTTP y permite revisar sin simular persistencia', async () => {
    configurar(false, true); await navegar('/solicitudes/nueva');
    expect(boton('Guardar borrador').disabled).toBeTrue();
    const areas = [{ id_area: 9, nombre: 'Area de prueba HTTP' }, { id_area: 27, nombre: 'Otra area de prueba HTTP' }];
    http.expectOne(environment.apiBaseUrl + '/activity-requests/authorized-areas').flush({ success: true, message: '', data: areas });
    const tipos = http.expectOne(environment.apiBaseUrl + '/ativicty-type?estado=1');
    expect(tipos.request.method).toBe('GET');
    tipos.flush({ success: true, data: [{ id_tipo_actividad: 3, nombre: 'Tipo activo HTTP', estado: 1 }, { id_tipo_actividad: 77, nombre: 'Inactivo', estado: false }] });
    harness.detectChanges();
    expect(Array.from(vista().querySelector<HTMLSelectElement>('#solicitud-area')!.options).slice(1).map(o => [o.value, o.text])).toEqual(areas.map(a => [String(a.id_area), a.nombre]));
    expect(vista().querySelector<HTMLSelectElement>('#solicitud-tipo')!.options.length).toBe(2);
    cambiar('#solicitud-area', '9'); completar();
    await pulsar('Revisar datos');
    expect(vista().querySelector('app-solicitud-detalle')).not.toBeNull();
    expect(boton('Enviar solicitud').disabled).toBeTrue(); expect(boton('Guardar borrador').disabled).toBeTrue();
    expect(vista().textContent).toContain('pendiente de habilitaci');
    expect(vista().textContent).not.toContain('confirmado por el servidor');
    await pulsar('Volver al formulario'); expect(vista().querySelector<HTMLInputElement>('#solicitud-nombre')?.value).toBe(solicitud.nombre);
    await harness.navigateByUrl('/solicitudes/mis-solicitudes'); harness.detectChanges();
    expect(vista().querySelector('tbody')).toBeNull();
    expect(vista().textContent).not.toContain('No se encontraron solicitudes');
    expect(gateway.guardar).not.toHaveBeenCalled(); expect(gateway.decidir).not.toHaveBeenCalled(); http.expectNone(() => true);
  });
  it('distingue error y carga de catálogos y permite reintentar sin sustituirlos por datos ficticios', async () => {
    configurar(false, true); await navegar('/solicitudes/nueva');
    http.expectOne(environment.apiBaseUrl + '/activity-requests/authorized-areas').flush({ message: 'Área restringida' }, { status: 403, statusText: 'Forbidden' });
    http.expectOne(environment.apiBaseUrl + '/ativicty-type?estado=1').flush({ message: 'Catálogo no disponible' }, { status: 503, statusText: 'Unavailable' }); harness.detectChanges();
    expect(vista().textContent).toContain('Tu usuario no tiene permiso para crear solicitudes'); expect(boton('Guardar borrador').disabled).toBeTrue();
    expect(vista().querySelector<HTMLSelectElement>('#solicitud-area')?.options.length).toBe(1);
    await pulsar('Actualizar catálogos');
    http.expectOne(environment.apiBaseUrl + '/activity-requests/authorized-areas').flush({ success: true, data: [] }); catalogos();
    expect(vista().textContent).toContain('No tienes un área habilitada para registrar solicitudes');
  });
  it('valida fechas imposibles, años bisiestos e intervalos invertidos', () => {
    configurar(false);
    const form = new FormGroup({ inicio: new FormControl('2026-02-30'), fin: new FormControl('2026-03-01') }, { validators: fechasSolicitud });
    expect(form.hasError('fechaInvalida')).toBeTrue();
    form.setValue({ inicio: '2028-02-29', fin: '2028-03-01' }); expect(form.valid).toBeTrue();
    form.setValue({ inicio: '2028-03-02', fin: '2028-03-01' }); expect(form.hasError('ordenFechas')).toBeTrue();
  });
  it('muestra catálogos vacíos sin opciones de respaldo ni acceso a Solicitudes', async () => {
    configurar(false, true); await navegar('/solicitudes/nueva');
    http.expectOne(environment.apiBaseUrl + '/activity-requests/authorized-areas').flush({ success: true, data: [] });
    http.expectOne(environment.apiBaseUrl + '/ativicty-type?estado=1').flush({ success: true, data: [] }); harness.detectChanges();
    expect(vista().querySelector<HTMLSelectElement>('#solicitud-area')!.options.length).toBe(1);
    expect(vista().querySelector<HTMLSelectElement>('#solicitud-tipo')!.options.length).toBe(1);
    expect(vista().textContent).toContain('No tienes un área habilitada para registrar solicitudes');
    expect(vista().textContent).toContain('No hay tipos activos disponibles');
    await pulsar('Revisar datos');
    for (const campo of ['area', 'tipo', 'nombre', 'inicio', 'fin', 'objetivo']) expect(vista().querySelector('#error-' + campo)).not.toBeNull();
    expect(vista().querySelector('app-solicitud-detalle')).toBeNull(); http.expectNone(() => true);
  });
  it('rechaza una respuesta de catálogo mal formada y permite reintentar', async () => {
    configurar(false, true); await navegar('/solicitudes/nueva');
    http.expectOne(environment.apiBaseUrl + '/activity-requests/authorized-areas').flush({ success: true, data: {} });
    http.expectOne(environment.apiBaseUrl + '/ativicty-type?estado=1').flush({ success: true, data: {} }); harness.detectChanges();
    expect(vista().querySelector<HTMLSelectElement>('#solicitud-area')!.options.length).toBe(1);
    expect(vista().querySelector<HTMLSelectElement>('#solicitud-tipo')!.options.length).toBe(1);
    expect(vista().querySelectorAll('.error').length).toBeGreaterThanOrEqual(2);
    await pulsar('Actualizar catálogos');
    http.expectOne(environment.apiBaseUrl + '/activity-requests/authorized-areas').flush({ success: true, data: [{ id_area: 9, nombre: 'Área HTTP de prueba' }] });
    catalogos();
    expect(vista().querySelector<HTMLSelectElement>('#solicitud-area')!.options.length).toBe(1);
  });
  it('mantiene el formulario sin desbordamiento en un contenedor estrecho y ancho', () => {
    configurar(false); const fixture = TestBed.createComponent(NuevaSolicitudComponent);
    const host: HTMLElement = fixture.nativeElement;
    fixture.detectChanges();
    for (const ancho of [320, 1100]) {
      host.style.width = ancho + 'px'; fixture.detectChanges();
      expect(host.scrollWidth).toBeLessThanOrEqual(host.clientWidth + 1);
      for (const control of Array.from(host.querySelectorAll<HTMLElement>('input, select, textarea'))) {
        expect(control.getBoundingClientRect().right).toBeLessThanOrEqual(host.getBoundingClientRect().right + 1);
      }
    }
    fixture.destroy();
  });
  it('abre las vistas de solicitudes sin datos inventados, placeholders ni llamadas HTTP cuando falta el contrato', async () => {
    configurar(false);
    await navegar('/solicitudes/nueva');
    for (const url of ['/solicitudes/nueva', '/solicitudes/mis-solicitudes', '/solicitudes/revision', '/pendientes/pendientes-aprobacion']) {
      await harness.navigateByUrl(url); harness.detectChanges();
      expect(TestBed.inject(Router).url).toBe(url);
      expect(vista().querySelector('app-vista-temporal')).toBeNull();
      expect(vista().querySelector('app-integracion-solicitudes')?.textContent).toContain('pendiente de habilitaci');
      expect(vista().textContent).not.toContain('DEMOSTRACI');
      expect(vista().querySelector('tbody, .paginacion')).toBeNull();
      expect(vista().querySelector('tbody tr, app-documento-pendiente-card')).toBeNull();
      expect(vista().querySelectorAll('app-sidebar a[aria-current="page"]').length).toBe(1);
    }
    expect(gateway.guardar).not.toHaveBeenCalled(); expect(gateway.decidir).not.toHaveBeenCalled(); http.expectNone(() => true);
  });
  it('valida campos, longitudes, espacios y fechas antes de la confirmación separada', async () => {
    configurar(); await navegar('/solicitudes/nueva'); catalogos();
    await pulsar('Revisar datos'); expect(vista().textContent).toContain('Completa los campos obligatorios');
    completar(); cambiar('#solicitud-fin', '2026-11-30'); await pulsar('Revisar datos');
    expect(vista().textContent).toContain('no puede preceder'); expect(vista().querySelector('app-solicitud-detalle')).toBeNull();
    cambiar('#solicitud-fin', solicitud.fin); cambiar('#solicitud-nombre', ' '.repeat(5)); await pulsar('Revisar datos');
    expect(vista().querySelector('app-solicitud-detalle')).toBeNull();
    cambiar('#solicitud-nombre', 'a'.repeat(101)); await pulsar('Revisar datos'); expect(vista().querySelector('app-solicitud-detalle')).toBeNull();
    cambiar('#solicitud-nombre', solicitud.nombre); await pulsar('Revisar datos');
    expect(vista().querySelector('form')).toBeNull(); expect(vista().querySelector('app-solicitud-detalle')).not.toBeNull();
    expect(gateway.guardar).not.toHaveBeenCalled(); await pulsar('Volver al formulario');
    expect(vista().querySelector<HTMLInputElement>('#solicitud-nombre')?.value).toBe(solicitud.nombre);
  });
  it('guarda y envía solo con confirmación del adaptador, sin enviar una identidad de aprobador', async () => {
    configurar(); gateway.decidir.and.returnValue(of({ ...solicitud, estado: 'Enviada', acciones: [] }));
    await navegar('/solicitudes/nueva'); catalogos(); completar(); await pulsar('Revisar datos'); await pulsar('Enviar solicitud');
    expect(gateway.guardar).toHaveBeenCalledTimes(1);
    expect(gateway.guardar.calls.mostRecent().args[0]).toEqual({ areaId: '9', nombre: solicitud.nombre, tipoId: '3', descripcion: solicitud.descripcion, objetivo: solicitud.objetivo, inicio: solicitud.inicio, fin: solicitud.fin, lugar: '', observaciones: '' });
    expect(gateway.decidir).toHaveBeenCalledWith('test-1', 'v1', 'Enviar', '');
    expect(TestBed.inject(Router).url).toBe('/solicitudes/mis-solicitudes'); http.expectNone(req => req.method !== 'GET');
    expect(vista().querySelector('#solicitudes-tab-mis-solicitudes')?.getAttribute('aria-selected')).toBe('true');
    expect(vista().querySelector('app-nueva-solicitud')).toBeNull();
    expect(gateway.listar).toHaveBeenCalledTimes(1);
  });
  it('exige un borrador completo según Laravel y conserva el error del servidor', async () => {
    configurar(); gateway.guardar.and.returnValue(throwError(() => ({ status: 422, mensaje: 'El área no está autorizada.' })));
    await navegar('/solicitudes/nueva'); catalogos(); cambiar('#solicitud-nombre', solicitud.nombre); await pulsar('Guardar borrador');
    expect(gateway.guardar).not.toHaveBeenCalled();
    completar(); await pulsar('Guardar borrador');
    expect(gateway.guardar).toHaveBeenCalledTimes(1); expect(vista().textContent).toContain('El área no está autorizada.');
    expect(vista().textContent).not.toContain('Borrador guardado y confirmado'); expect(gateway.decidir).not.toHaveBeenCalled();
  });
  it('no habilita edición cuando el servidor no la autoriza, aunque sea Administrador', async () => {
    configurar(); await navegar('/solicitudes/nueva?editar=test-1'); catalogos();
    expect(boton('Guardar borrador').disabled).toBeTrue(); expect(vista().textContent).toContain('no autoriza la edición');
    await pulsar('Guardar borrador'); expect(gateway.guardar).not.toHaveBeenCalled();
    await harness.navigateByUrl('/solicitudes/nueva'); harness.detectChanges();
    expect(vista().querySelector<HTMLInputElement>('#solicitud-nombre')?.value).toBe('');
  });
  it('edita y reenvía una solicitud Observada conservando su identificador', async () => {
    configurar(); const observada: Solicitud = { ...solicitud, estado: 'Observada', puedeEditar: true, acciones: ['Enviar'] };
    gateway.detalle.and.returnValue(of(observada)); gateway.guardar.and.returnValue(of(observada));
    gateway.decidir.and.returnValue(of({ ...observada, estado: 'Enviada', acciones: [], puedeEditar: false }));
    await navegar('/solicitudes/nueva?editar=test-1'); catalogos();
    expect(boton('Guardar corrección').disabled).toBeFalse();
    cambiar('#solicitud-objetivo', 'Justificación corregida'); await pulsar('Revisar datos'); await pulsar('Enviar solicitud');
    expect(gateway.guardar.calls.mostRecent().args[1]).toEqual({ id: 'test-1', version: 'v1' });
    expect(gateway.decidir).toHaveBeenCalledWith('test-1', 'v1', 'Enviar', ''); expect(TestBed.inject(Router).url).toBe('/solicitudes/mis-solicitudes');
  });
  it('aplica los límites de nombre 100, sede 100 y descripción 255 del contrato definitivo', async () => {
    configurar(); await navegar('/solicitudes/nueva'); catalogos(); completar();
    const modelo = harness.fixture.debugElement.query(By.directive(NuevaSolicitudComponent)).componentInstance as { form: FormGroup };
    modelo.form.controls['lugar'].setValue('s'.repeat(101)); expect(modelo.form.controls['lugar'].hasError('maxlength')).toBeTrue();
    modelo.form.controls['lugar'].setValue('');
    cambiar('#solicitud-nombre', 'a'.repeat(100)); cambiar('#solicitud-descripcion', 'd'.repeat(255));
    await pulsar('Revisar datos'); expect(vista().querySelector('app-solicitud-detalle')).not.toBeNull(); await pulsar('Volver al formulario');
    for (const [selector, longitud] of [['#solicitud-nombre', 101], ['#solicitud-descripcion', 256]] as const) {
      cambiar(selector, 'a'.repeat(longitud)); await pulsar('Revisar datos');
      expect(vista().querySelector('app-solicitud-detalle')).toBeNull(); cambiar(selector, 'Valor válido');
    }
    expect(vista().querySelector<HTMLTextAreaElement>('#solicitud-descripcion')?.maxLength).toBe(255);
    expect(gateway.guardar).not.toHaveBeenCalled();
  });
  it('informa si se guarda el borrador pero falla el envío, sin volver a crearlo', async () => {
    configurar(); gateway.decidir.and.returnValue(throwError(() => ({ status: 409, mensaje: 'La versión cambió.' })));
    await navegar('/solicitudes/nueva'); catalogos(); completar(); await pulsar('Revisar datos'); await pulsar('Enviar solicitud');
    expect(vista().textContent).toContain('El borrador se guardó, pero no se confirmó el envío.');
    await pulsar('Enviar solicitud'); expect(gateway.guardar.calls.mostRecent().args[1]).toEqual({ id: 'test-1', version: 'v1' });
  });
  it('filtra y pagina a través del adaptador y no ofrece aprobación definitiva en RR. HH.', async () => {
    configurar(); await navegar('/solicitudes/revision');
    expect(vista().querySelector('tbody')?.textContent).not.toContain('Aprobar'); expect(vista().querySelector('tbody')?.textContent).toContain('Observar');
    cambiar('#filtro-busqueda', 'Actividad'); cambiar('#filtro-estado', 'En revisión'); await pulsar('Buscar');
    expect(gateway.listar.calls.mostRecent().args).toEqual(['revision', { busqueda: 'Actividad', estado: 'En revisión', desde: '', hasta: '', pagina: 1 }]);
    gateway.listar.and.returnValue(of({ ...pagina, total: 30, ultimaPagina: 2 })); await pulsar('Buscar'); await pulsar('Siguiente');
    expect(gateway.listar.calls.mostRecent().args[1].pagina).toBe(2);
  });
  it('RR. HH. exige motivo al observar, transmite la versión y recarga solo tras confirmación real', async () => {
    configurar(); await navegar('/solicitudes/revision'); await pulsar('Observar');
    expect(vista().querySelector('app-decision-modal dialog')?.hasAttribute('open')).toBeTrue();
    await pulsar('Confirmar Observar'); expect(gateway.decidir).not.toHaveBeenCalled();
    cambiar('#motivo-decision', '  '); await pulsar('Confirmar Observar'); expect(gateway.decidir).not.toHaveBeenCalled();
    cambiar('#motivo-decision', 'Precisar el objetivo de la actividad');
    gateway.decidir.and.returnValue(of({ ...solicitud, estado: 'Observada', acciones: [] }));
    await pulsar('Confirmar Observar');
    expect(gateway.decidir).toHaveBeenCalledWith('test-1', 'v1', 'Observar', 'Precisar el objetivo de la actividad');
    expect(gateway.listar).toHaveBeenCalledTimes(2); expect(vista().textContent).toContain('Estado: Observada');
  });
  it('cancelar la aprobación no decide y un conflicto posterior no muestra éxito', async () => {
    configurar(); await navegar('/pendientes/pendientes-aprobacion'); await pulsar('Aprobar'); await pulsar('Cancelar');
    expect(gateway.decidir).not.toHaveBeenCalled();
    gateway.decidir.and.returnValue(throwError(() => ({ status: 409, mensaje: 'La solicitud ya fue decidida.' })));
    await pulsar('Aprobar'); await pulsar('Confirmar Aprobar');
    expect(vista().textContent).toContain('transición ya no es compatible'); expect(vista().textContent).not.toContain('Operación confirmada por el servidor');
  });
  it('no duplica decisiones mientras el servidor responde', async () => {
    configurar(); const respuesta = new Subject<Solicitud>(); gateway.decidir.and.returnValue(respuesta);
    await navegar('/pendientes/pendientes-aprobacion'); await pulsar('Aprobar'); await pulsar('Confirmar Aprobar');
    expect(boton('Confirmar Aprobar').disabled).toBeTrue(); await pulsar('Confirmar Aprobar'); expect(gateway.decidir).toHaveBeenCalledTimes(1);
    respuesta.next({ ...solicitud, estado: 'Aprobada', acciones: [] }); respuesta.complete(); harness.detectChanges();
  });
  for (const status of [401, 403, 0]) {
    it('distingue el error ' + status + ' de una bandeja vacía y no conserva registros', async () => {
      configurar(); gateway.listar.and.returnValue(throwError(() => ({ status, mensaje: 'Error autorizado de prueba' })));
      await navegar('/solicitudes/mis-solicitudes');
      expect(vista().querySelector('[role="alert"]')).not.toBeNull(); expect(vista().querySelector('tbody')).toBeNull();
      expect(vista().textContent).not.toContain('No se encontraron solicitudes');
    });
  }
  it('abre Mis solicitudes por defecto, con las dos pestañas y una sola entrada en el Sidebar', async () => {
    configurar(); await navegar('/solicitudes');
    expect(TestBed.inject(Router).url).toBe('/solicitudes/mis-solicitudes');
    expect(vista().querySelectorAll('[role=tab]').length).toBe(2);
    expect(vista().querySelector('#solicitudes-tab-mis-solicitudes')?.getAttribute('aria-selected')).toBe('true');
    expect(vista().querySelector('app-nueva-solicitud')).toBeNull();
    const menu = vista().querySelector('#submenu-solicitudes')!;
    expect(menu.querySelectorAll('a').length).toBe(1);
    expect(menu.textContent).toContain('Mis solicitudes'); expect(menu.textContent).not.toContain('Nueva solicitud');
    expect(gateway.listar).toHaveBeenCalledTimes(1); http.expectNone(() => true);
  });

  it('el botón del listado activa Nueva solicitud y reutiliza exactamente el formulario original', async () => {
    configurar(); await navegar('/solicitudes/mis-solicitudes');
    const buscador = vista().querySelector<HTMLElement>('#busqueda-solicitudes')!;
    expect(buscador.hidden).toBeTrue();
    await pulsar('Abrir búsqueda');
    expect(buscador.hidden).toBeFalse();
    expect(document.activeElement).toBe(vista().querySelector('#filtro-busqueda'));
    const enlace = vista().querySelector<HTMLAnchorElement>('#solicitudes-panel-mis-solicitudes a[href="/solicitudes/nueva"]')!;
    expect(enlace).not.toBeNull(); enlace.click(); harness.detectChanges(); await harness.fixture.whenStable(); harness.detectChanges();
    catalogos();
    expect(TestBed.inject(Router).url).toBe('/solicitudes/nueva');
    expect(vista().querySelector('#solicitudes-tab-nueva')?.getAttribute('aria-selected')).toBe('true');
    expect(vista().querySelectorAll('app-nueva-solicitud').length).toBe(1);
    expect(vista().querySelector('app-bandeja-solicitudes')).toBeNull();
    expect(vista().querySelectorAll('#solicitud-nombre').length).toBe(1);
    expect(vista().textContent).toContain('Completar solicitud');
    expect(gateway.guardar).not.toHaveBeenCalled();
  });

  it('conserva la instancia y el paso de revisión al alternar pestañas, y recarga el listado real', async () => {
    configurar(); await navegar('/solicitudes/nueva'); catalogos(); completar(); await pulsar('Revisar datos');
    const original = harness.fixture.debugElement.query(By.directive(NuevaSolicitudComponent)).componentInstance;
    await pulsar('Mis solicitudes');
    expect(gateway.listar).toHaveBeenCalledTimes(1);
    expect(vista().querySelector('#solicitudes-panel-nueva')?.hasAttribute('hidden')).toBeTrue();
    await pulsar('Nueva solicitud');
    expect(harness.fixture.debugElement.query(By.directive(NuevaSolicitudComponent)).componentInstance).toBe(original);
    expect(vista().querySelector('app-nueva-solicitud')?.textContent).toContain('Revisa los datos de tu solicitud');
    await pulsar('Mis solicitudes'); expect(gateway.listar).toHaveBeenCalledTimes(2);
    expect(vista().querySelectorAll('app-bandeja-solicitudes').length).toBe(1);
    expect(vista().querySelectorAll('app-nueva-solicitud').length).toBe(1);
    expect(gateway.guardar).not.toHaveBeenCalled(); http.expectNone(() => true);
  });

  it('conserva ID y versión del borrador y no duplica el alta al regresar a Nueva solicitud', async () => {
    configurar(); await navegar('/solicitudes/nueva'); catalogos(); completar(); await pulsar('Guardar borrador');
    expect(gateway.guardar).toHaveBeenCalledTimes(1);
    await pulsar('Mis solicitudes'); await pulsar('Nueva solicitud');
    await pulsar('Guardar borrador');
    expect(gateway.guardar).toHaveBeenCalledTimes(2);
    expect(gateway.guardar.calls.mostRecent().args[1]).toEqual({ id: 'test-1', version: 'v1' });
    http.expectNone(() => true);
  });

  it('mantiene el ID de edición de la URL al alternar sin volver a consultar ni reconstruir el formulario', async () => {
    configurar(); gateway.detalle.and.returnValue(of({ ...solicitud, estado: 'Borrador', puedeEditar: true, acciones: ['Enviar'] }));
    await navegar('/solicitudes/nueva?editar=test-1'); catalogos();
    const original = harness.fixture.debugElement.query(By.directive(NuevaSolicitudComponent)).componentInstance;
    await pulsar('Mis solicitudes'); await pulsar('Nueva solicitud');
    expect(TestBed.inject(Router).url).toBe('/solicitudes/nueva?editar=test-1');
    expect(harness.fixture.debugElement.query(By.directive(NuevaSolicitudComponent)).componentInstance).toBe(original);
    expect(gateway.detalle).toHaveBeenCalledTimes(1);
    expect(vista().querySelector<HTMLInputElement>('#solicitud-nombre')?.value).toBe(solicitud.nombre);
    http.expectNone(() => true);
  });

  it('sin permiso de creación conserva el listado y oculta la pestaña y el botón de Nueva solicitud', async () => {
    configurar(true, true, 'Consulta', ['solicitudes.propias']); await navegar('/solicitudes/mis-solicitudes');
    expect(vista().querySelectorAll('[role=tab]').length).toBe(1);
    expect(vista().querySelector('#solicitudes-tab-nueva')).toBeNull();
    expect(vista().querySelector('#solicitudes-panel-mis-solicitudes a[href="/solicitudes/nueva"]')).toBeNull();
    expect(vista().querySelector('app-nueva-solicitud')).toBeNull();
    expect(vista().querySelector('tbody')).not.toBeNull();
    expect(gateway.listar).toHaveBeenCalledTimes(1);
    await harness.navigateByUrl('/solicitudes/nueva'); harness.detectChanges();
    expect(TestBed.inject(Router).url).toBe('/acceso-denegado'); http.expectNone(() => true);
  });

  it('Mis solicitudes filtra automáticamente con debounce de 300 ms, sin botones ni fechas', async () => {
    configurar(); await navegar('/solicitudes/mis-solicitudes');
    const nueva = vista().querySelector<HTMLAnchorElement>('.acciones-cabecera a')!;
    const posicionNueva = nueva.getBoundingClientRect();
    const buscador = vista().querySelector<HTMLElement>('#busqueda-solicitudes')!;
    expect(buscador.hidden).toBeTrue();
    await pulsar('Abrir búsqueda');
    expect(buscador.hidden).toBeFalse();
    expect(nueva.getBoundingClientRect().left).toBe(posicionNueva.left);
    expect(nueva.getBoundingClientRect().top).toBe(posicionNueva.top);
    expect(buscador.getBoundingClientRect().right).toBeLessThanOrEqual(vista().querySelector('.boton-busqueda')!.getBoundingClientRect().left);
    expect((await document.fonts.load('300 20px "Material Symbols Outlined"', 'search')).length).toBeGreaterThan(0);
    const contexto = document.createElement('canvas').getContext('2d')!; contexto.font = '300 20px "Material Symbols Outlined"';
    expect(contexto.measureText('search').width).toBeCloseTo(20, 0); expect(contexto.measureText('refresh').width).toBeCloseTo(20, 0);
    expect(vista().querySelector('#filtro-desde')).toBeNull(); expect(vista().querySelector('#filtro-hasta')).toBeNull();
    const textos = Array.from(vista().querySelectorAll('button'), b => b.textContent?.trim());
    expect(textos).not.toContain('Buscar'); expect(textos).not.toContain('Limpiar filtros');
    expect(vista().querySelector('.busqueda-con-icono .material-symbols-outlined')?.textContent).toBe('search');
    expect(vista().querySelector('#filtro-estado')).toBeNull();
    fakeAsync(() => {
      expect(gateway.listar).toHaveBeenCalledTimes(1);
      cambiar('#filtro-busqueda', 'Capa'); tick(100);
      cambiar('#filtro-busqueda', 'Capacitación'); tick(299); expect(gateway.listar).toHaveBeenCalledTimes(1);
      tick(1); expect(gateway.listar).toHaveBeenCalledTimes(2);
      expect(gateway.listar.calls.mostRecent().args[1].busqueda).toBe('Capacitación');
      cambiar('#filtro-busqueda', ''); tick(300); expect(gateway.listar).toHaveBeenCalledTimes(3);
      expect(gateway.listar.calls.mostRecent().args[1]).toEqual({ busqueda: '', estado: '', desde: '', hasta: '', pagina: 1 });
      cambiar('#filtro-busqueda', 'Temporal'); tick(300);
      expect(vista().querySelector('[aria-label="Cerrar búsqueda"]')).toBeNull();
      vista().querySelector<HTMLButtonElement>('.boton-busqueda')!.click(); harness.fixture.detectChanges();
      expect(buscador.hidden).toBeTrue(); expect(vista().querySelectorAll('#filtro-busqueda').length).toBe(1);
      tick(300); expect(gateway.listar.calls.mostRecent().args[1].busqueda).toBe('');
      vista().querySelector<HTMLButtonElement>('.boton-busqueda')!.click(); harness.detectChanges();
      vista().querySelector<HTMLInputElement>('#filtro-busqueda')!.click(); harness.detectChanges();
      expect(buscador.hidden).toBeFalse();
      document.body.click(); harness.detectChanges();
      expect(buscador.hidden).toBeTrue();
    })();
    http.expectNone(() => true);
  });

  it('oculta sede manual y revisión vacía, mantiene fechas compactas y el payload nuevo sin sede ficticia', async () => {
    configurar(); await navegar('/solicitudes/nueva'); catalogos(); completar();
    expect(vista().querySelector('#solicitud-lugar')).toBeNull();
    const fechas = Array.from(vista().querySelectorAll<HTMLInputElement>('.programacion input'));
    expect(fechas.length).toBe(2); for (const fecha of fechas) expect(fecha.getBoundingClientRect().width).toBeLessThanOrEqual(260);
    await pulsar('Revisar datos');
    expect(vista().querySelector('app-solicitud-detalle')?.textContent).not.toContain('Lugar');
    await pulsar('Volver al formulario'); expect(vista().querySelector<HTMLInputElement>('#solicitud-nombre')?.value).toBe(solicitud.nombre);
    await pulsar('Guardar borrador'); expect(gateway.guardar.calls.mostRecent().args[0].lugar).toBe('');
  });

  it('conserva sede histórica al editar y revisar aunque no exista un campo manual', async () => {
    configurar(); gateway.detalle.and.returnValue(of({ ...solicitud, estado: 'Borrador', puedeEditar: true, acciones: ['Enviar'] }));
    await navegar('/solicitudes/nueva?editar=test-1'); catalogos();
    expect(vista().querySelector('#solicitud-lugar')).toBeNull();
    await pulsar('Revisar datos'); expect(vista().querySelector('app-solicitud-detalle')?.textContent).toContain(solicitud.lugar);
    await pulsar('Guardar borrador'); expect(gateway.guardar.calls.mostRecent().args[0].lugar).toBe(solicitud.lugar);
  });

  it('muestra el responsable real de la sesión aunque el contexto contenga espacios y conserva el valor al resetear el formulario nativo', async () => {
    configurar(); gateway.contexto.and.returnValue(of({ responsable: '   ', areasDisponibles: [], puedeCrear: true }));
    await navegar('/solicitudes/nueva'); catalogos();
    const responsable = vista().querySelector<HTMLInputElement>('#solicitud-responsable')!;
    expect(responsable.value).toBe('Usuario de prueba'); expect(responsable.readOnly).toBeTrue();
    responsable.form!.reset(); harness.detectChanges();
    expect(responsable.value).toBe('Usuario de prueba');
  });

  it('distribuye las tres secciones según el ancho real y mantiene fechas dentro de sus tarjetas', async () => {
    configurar(); await navegar('/solicitudes/nueva'); catalogos();
    const tarjeta = vista().querySelector<HTMLElement>('.formulario-solicitud')!;
    const secciones = tarjeta.querySelector<HTMLElement>('.secciones-principales')!;
    expect(secciones.querySelectorAll(':scope > fieldset').length).toBe(3);
    expect(vista().querySelectorAll('.actualizar-catalogos').length).toBe(1);
    expect(vista().querySelector('.fila-titulo .actualizar-catalogos')).not.toBeNull();
    const estilo = tarjeta.getAttribute('style');
    try {
      for (const [ancho, columnas] of [[1050, 3], [740, 2], [480, 1]]) {
        tarjeta.style.cssText = `position: fixed; width: ${ancho}px; max-width: none; box-sizing: content-box;`;
        await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
        expect(getComputedStyle(secciones).gridTemplateColumns.split(' ').length).toBe(columnas);
        for (const input of Array.from(secciones.querySelectorAll<HTMLInputElement>('input[type="date"]'))) {
          const borde = input.closest('fieldset')!.getBoundingClientRect();
          expect(input.getBoundingClientRect().right).toBeLessThanOrEqual(borde.right);
        }
      }
      expect(secciones.nextElementSibling?.querySelector('legend')?.textContent).toBe('Descripción y justificación');
    } finally {
      if (estilo === null) tarjeta.removeAttribute('style'); else tarjeta.setAttribute('style', estilo);
    }
    http.expectNone(() => true);
  });

  it('actualiza catálogos con icono y estado de carga e impide clics repetidos', async () => {
    configurar(); await navegar('/solicitudes/nueva'); catalogos();
    const actualizar = vista().querySelector<HTMLButtonElement>('.actualizar-catalogos')!;
    expect(actualizar.querySelector('.material-symbols-outlined')?.textContent).toBe('refresh');
    actualizar.click(); harness.detectChanges();
    const areas = http.expectOne(environment.apiBaseUrl + '/activity-requests/authorized-areas');
    const tipos = http.expectOne(environment.apiBaseUrl + '/ativicty-type?estado=1');
    expect(actualizar.disabled).toBeTrue(); expect(actualizar.getAttribute('aria-busy')).toBe('true');
    actualizar.click(); http.expectNone(() => true);
    areas.flush({ success: true, data: [{ id_area: 9, nombre: 'Área autorizada' }] });
    tipos.flush({ success: true, data: [{ id_tipo_actividad: 3, nombre: 'Tipo real', estado: true }] }); harness.detectChanges();
    expect(actualizar.disabled).toBeFalse(); expect(actualizar.getAttribute('aria-busy')).toBe('false');
  });

  it('abre un documento desde el enlace de Gerencia y permite reintentar su consulta', async () => {
    configurar();
    const base = environment.apiBaseUrl + '/certificados-documentos';
    await navegar('/pendientes/documentos-firmar/31');
    http.expectOne(base + '/detail/31?flujo=firmas').flush({ message: 'Error interno' }, { status: 500, statusText: 'Error' });
    harness.detectChanges();
    expect(vista().querySelector('app-detalle-documento [role="alert"]')?.textContent).toContain('Intente nuevamente');
    boton('Reintentar documento').click(); harness.detectChanges();
    http.expectOne(base + '/detail/31?flujo=firmas').flush({ success: true, data: {
      id_certificado_documento: 31, estado_certificado: 'PENDIENTE_FIRMA', beneficiario: { nombre: 'Beneficiario autorizado' },
      actividad: 'Actividad', sesion: 'Sesión', tipo_certificado: 'Participación', modalidad_firma: 'Secuencial',
      firmantes: [], facultades: { descargar: false },
    } });
    http.expectOne(base + '/31/firma/progreso').flush({ success: true, data: { documento: { id_certificado_documento: 31, estado_certificado: 'PENDIENTE_FIRMA', beneficiario: { nombre: 'Beneficiario autorizado' }, actividad: 'Actividad', sesion: 'Sesión', tipo_certificado: 'Participación', firmantes: [], facultades: { descargar: false } }, modalidad: null, modalidad_persistida: false, demo_disponible: false } });
    http.expectOne(base + '/31/firma/verificacion').flush({ success: true, data: { id_certificado_documento: 31, integridad_verificada: true } });
    harness.detectChanges();
    expect(vista().querySelector('app-dialogo')).toBeNull();
    expect(vista().textContent).toContain('Pendiente de firma');
    expect(vista().querySelector('details')).toBeNull();
    expect(vista().textContent).toContain('Firmantes pendientes de asignación');
    expect(TestBed.inject(Router).url).toBe('/pendientes/documentos-firmar/31');
    http.expectNone(req => req.method !== 'GET');
  });

  it('muestra los certificados remitidos y abre el PDF almacenado', async () => {
    configurar();
    const base = environment.apiBaseUrl + '/certificados-documentos';
    const doc = { id_certificado_documento: 31, beneficiario: { nombre: 'Beneficiario de prueba' },
      actividad: 'Actividad de prueba', sesion: 'Sesión de prueba', tipo_certificado: 'Participación',
      estado_certificado: 'PENDIENTE_FIRMA', firmantes: [], facultades: { descargar: true } };
    await navegar('/pendientes/documentos-firmar');
    http.expectOne(r => r.url === base + '/list' && r.params.get('bandeja') === 'por_firmar')
      .flush({ success: true, data: { data: [doc], current_page: 1, last_page: 1 } });
    http.expectOne(base + '/31/firma/progreso').flush({ success: true, data: { documento: doc, disponible_rrhh: false } });
    harness.detectChanges();
    expect(vista().querySelector('tbody')?.textContent).toContain('Pendiente de firma');
    expect(vista().querySelector('tbody')?.textContent).toContain('Asignación de firmantes pendiente');
    vista().querySelector<HTMLAnchorElement>('tbody a')!.click();
    await harness.fixture.whenStable(); harness.detectChanges();
    http.expectOne(base + '/detail/31?flujo=firmas').flush({ success: true, data: doc });
    http.expectOne(base + '/31/firma/progreso').flush({ success: true, data: { documento: doc, modalidad: null, modalidad_persistida: false, demo_disponible: false } });
    http.expectOne(base + '/31/firma/verificacion').flush({ success: true, data: { id_certificado_documento: 31, integridad_verificada: true } });
    harness.detectChanges();
    const crearUrl = URL.createObjectURL.bind(URL);
    const pdfListo = new Promise<void>(resolve => {
      spyOn(URL, 'createObjectURL').and.callFake(blob => { resolve(); return crearUrl(blob); });
    });
    http.expectOne(base + '/31/firma/pdf-autorizado').flush(new Blob(['%PDF-1.4'], { type: 'application/pdf' }));
    await pdfListo; harness.detectChanges();
    expect(vista().querySelector('app-visor-pdf app-pdf-continuo')).not.toBeNull();
  });
});
