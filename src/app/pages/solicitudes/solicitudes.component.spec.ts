import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { of, Subject, throwError } from 'rxjs';
import { routes } from '../../app.routes';
import { Solicitud, PaginaSolicitudes } from '../../core/interfaces/solicitudes/solicitud.interface';
import { AuthService } from '../../core/services/autenticacion/auth.service';
import { IntegracionSolicitudesPendiente, SOLICITUDES_GATEWAY, SolicitudesGateway, SolicitudesService } from '../../core/services/solicitudes/solicitudes.service';
import { environment } from '../../../environments/environment';
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
  function configurar(integrado = true, consultarCatalogos = integrado): void {
    gateway = jasmine.createSpyObj<SolicitudesGateway>('gateway', ['contexto', 'listar', 'detalle', 'guardar', 'decidir', 'historial', 'documentos', 'documento']);
    gateway.contexto.and.returnValue(of({ responsable: 'Usuario de prueba', areasAutorizadas: [{ id: '9', nombre: 'Área de prueba unitaria' }], puedeCrear: true }));
    gateway.listar.and.returnValue(of(pagina)); gateway.detalle.and.returnValue(of(solicitud));
    gateway.guardar.and.returnValue(of({ ...solicitud, estado: 'Borrador', puedeEditar: true, acciones: ['Enviar'] }));
    gateway.decidir.and.returnValue(of({ ...solicitud, estado: 'Aprobada', acciones: [] }));
    gateway.historial.and.returnValue(of({ registros: [], total: 0, pagina: 1, ultimaPagina: 1 }));
    gateway.documentos.and.returnValue(of({ registros: [], total: 0, pagina: 1, ultimaPagina: 1 }));
    TestBed.configureTestingModule({ providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting(),
      { provide: SOLICITUDES_GATEWAY, useValue: integrado ? gateway : null },
      { provide: AuthService, useValue: { cargarSesion: () => of(true), tienePermiso: (clave: string) => !['areas.ver', 'actividades.ver'].includes(clave) || consultarCatalogos,
        usuario: signal({ id: 1, nombre: 'Usuario de prueba', email: 'prueba@example.test', rol: 'Administrador' }), modulos: signal([]) } },
    ] });
    http = TestBed.inject(HttpTestingController);
  }
  afterEach(() => http?.verify());
  const vista = () => harness.routeNativeElement!;
  async function navegar(url: string): Promise<void> { harness = await RouterTestingHarness.create(url); harness.detectChanges(); }
  function boton(texto: string): HTMLButtonElement {
    const boton = Array.from(vista().querySelectorAll<HTMLButtonElement>('button')).find(boton => boton.textContent?.trim() === texto);
    if (!boton) throw new Error('No se encontró el botón ' + texto);
    return boton;
  }
  async function pulsar(texto: string): Promise<void> { boton(texto).click(); harness.detectChanges(); await harness.fixture.whenStable(); harness.detectChanges(); }
  function cambiar(selector: string, valor: string): void {
    const control = vista().querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(selector)!;
    control.value = valor; control.dispatchEvent(new Event(control instanceof HTMLSelectElement ? 'change' : 'input')); harness.detectChanges();
  }
  function catalogos(): void { http.expectOne(environment.apiBaseUrl + '/ativicty-type').flush({ success: true, data: [{ id_tipo_actividad: 3, nombre: 'Tipo de prueba', estado: true }] }); harness.detectChanges(); }
  function completar(): void {
    cambiar('#solicitud-nombre', solicitud.nombre); cambiar('#solicitud-lugar', solicitud.lugar);
    cambiar('#solicitud-tipo', '3'); cambiar('#solicitud-inicio', solicitud.inicio); cambiar('#solicitud-fin', solicitud.fin);
    cambiar('#solicitud-descripcion', solicitud.descripcion); cambiar('#solicitud-objetivo', solicitud.objetivo);
  }

  it('sin adaptador no autoriza operaciones administrativas ni simula respuestas del servidor', () => {
    configurar(false); const api = TestBed.inject(SolicitudesService);
    expect(api.integrado).toBeFalse();
    let error: unknown;
    api.listar('revision', { busqueda: '', estado: '', desde: '', hasta: '', pagina: 1 }).subscribe({ error: valor => error = valor });
    expect(error instanceof IntegracionSolicitudesPendiente).toBeTrue(); expect(gateway.listar).not.toHaveBeenCalled(); http.expectNone(() => true);
  });
  it('guarda y envía la demostración en memoria y la muestra en Mis solicitudes sin escrituras HTTP', async () => {
    configurar(false, true); await navegar('/solicitudes/nueva');
    expect(boton('Actualizar catálogos').disabled).toBeTrue();
    http.expectOne(environment.apiBaseUrl + '/areas/list').flush({ success: true, data: [{ id_area: 9, nombre: 'Área recibida del catálogo' }] });
    catalogos(); cambiar('#solicitud-area', '9'); completar();
    expect(vista().textContent).toContain('Área recibida del catálogo');
    expect(vista().textContent).toContain('Catálogo real de referencia');
    expect(vista().querySelector<HTMLInputElement>('#solicitud-responsable')?.readOnly).toBeTrue();
    await pulsar('Revisar datos');
    expect(vista().querySelector('app-solicitud-detalle')).not.toBeNull();
    expect(boton('Enviar solicitud').disabled).toBeFalse(); expect(boton('Guardar borrador').disabled).toBeFalse();
    await pulsar('Guardar borrador');
    expect(vista().textContent).toContain('Solicitud de demostración. No registrada en el sistema oficial');
    expect(vista().textContent).not.toContain('confirmado por el servidor');
    await pulsar('Volver al formulario'); expect(vista().querySelector<HTMLInputElement>('#solicitud-nombre')?.value).toBe(solicitud.nombre);
    await pulsar('Revisar datos'); await pulsar('Enviar solicitud');
    expect(TestBed.inject(Router).url).toBe('/solicitudes/mis-solicitudes');
    expect(vista().querySelectorAll('tbody tr').length).toBe(1);
    expect(vista().querySelector('tbody')?.textContent).toContain('DEMOSTRACIÓN'); expect(vista().querySelector('tbody')?.textContent).toContain('Enviada');
    expect(vista().querySelector('tbody')?.textContent).toContain(solicitud.nombre);
    expect(gateway.guardar).not.toHaveBeenCalled(); http.expectNone(req => req.method !== 'GET');
  });
  it('distingue error y carga de catálogos y permite reintentar sin sustituirlos por datos ficticios', async () => {
    configurar(false, true); await navegar('/solicitudes/nueva');
    http.expectOne(environment.apiBaseUrl + '/areas/list').flush({ message: 'Área restringida' }, { status: 403, statusText: 'Forbidden' });
    http.expectOne(environment.apiBaseUrl + '/ativicty-type').flush({ message: 'Catálogo no disponible' }, { status: 503, statusText: 'Unavailable' }); harness.detectChanges();
    expect(vista().textContent).toContain('No tienes permiso'); expect(boton('Guardar borrador').disabled).toBeTrue();
    expect(vista().querySelector<HTMLSelectElement>('#solicitud-area')?.options.length).toBe(1);
    await pulsar('Actualizar catálogos');
    http.expectOne(environment.apiBaseUrl + '/areas/list').flush({ success: true, data: [] }); catalogos();
    expect(vista().textContent).toContain('No hay áreas disponibles');
  });
  it('valida fechas imposibles, años bisiestos e intervalos invertidos', () => {
    configurar(false);
    const form = new FormGroup({ inicio: new FormControl('2026-02-30'), fin: new FormControl('2026-03-01') }, { validators: fechasSolicitud });
    expect(form.hasError('fechaInvalida')).toBeTrue();
    form.setValue({ inicio: '2028-02-29', fin: '2028-03-01' }); expect(form.valid).toBeTrue();
    form.setValue({ inicio: '2028-03-02', fin: '2028-03-01' }); expect(form.hasError('ordenFechas')).toBeTrue();
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
  it('abre las seis vistas reales sin datos inventados, placeholders ni llamadas HTTP cuando falta el contrato', async () => {
    configurar(false);
    await navegar('/solicitudes/nueva');
    for (const url of ['/solicitudes/nueva', '/solicitudes/mis-solicitudes', '/solicitudes/revision', '/pendientes/pendientes-aprobacion', '/pendientes/documentos-firmar', '/pendientes/historial-decisiones']) {
      await harness.navigateByUrl(url); harness.detectChanges();
      expect(TestBed.inject(Router).url).toBe(url);
      expect(vista().querySelector('app-vista-temporal')).toBeNull();
      expect(vista().querySelector('app-integracion-solicitudes')?.textContent?.trim()).toBe('');
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
    expect(gateway.guardar.calls.mostRecent().args[0]).toEqual({ areaId: '9', nombre: solicitud.nombre, tipoId: '3', descripcion: solicitud.descripcion, objetivo: solicitud.objetivo, inicio: solicitud.inicio, fin: solicitud.fin, lugar: solicitud.lugar, observaciones: '' });
    expect(gateway.decidir).toHaveBeenCalledWith('test-1', 'v1', 'Enviar', '');
    expect(TestBed.inject(Router).url).toBe('/solicitudes/mis-solicitudes'); http.expectNone(req => req.method !== 'GET');
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
    cambiar('#solicitud-nombre', 'a'.repeat(100)); cambiar('#solicitud-lugar', 's'.repeat(100)); cambiar('#solicitud-descripcion', 'd'.repeat(255));
    await pulsar('Revisar datos'); expect(vista().querySelector('app-solicitud-detalle')).not.toBeNull(); await pulsar('Volver al formulario');
    for (const [selector, longitud] of [['#solicitud-nombre', 101], ['#solicitud-lugar', 101], ['#solicitud-descripcion', 256]] as const) {
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
  it('exige motivo en el modal, transmite la versión y recarga solo tras confirmación real', async () => {
    configurar(); await navegar('/pendientes/pendientes-aprobacion'); await pulsar('Observar');
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
    expect(vista().textContent).toContain('La solicitud ya fue decidida.'); expect(vista().textContent).not.toContain('Operación confirmada por el servidor');
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
  it('conserva la vista de historial vacía solo cuando el servidor confirma cero resultados', async () => {
    configurar(); await navegar('/pendientes/historial-decisiones'); expect(vista().textContent).toContain('No se encontraron decisiones');
    cambiar('#historial-resultado', 'Aprobada'); await pulsar('Buscar');
    expect(gateway.historial.calls.mostRecent().args[0].estado).toBe('Aprobada'); expect(gateway.guardar).not.toHaveBeenCalled();
  });
  it('construye tarjetas de documentos con datos recibidos y mantiene la firma deshabilitada', async () => {
    configurar(); gateway.documentos.and.returnValue(of({ registros: [{ id: 'doc-test', beneficiario: 'Beneficiario de prueba unitaria', tipo: 'Certificado de prueba', fecha: '2026-11-02', codigo: 'codigo-devuelto-por-api', estado: 'Pendiente', puedeVer: true }], total: 1, pagina: 1, ultimaPagina: 1 }));
    gateway.documento.and.returnValue(of(new Blob(['%PDF-1.4'], { type: 'application/pdf' })));
    await navegar('/pendientes/documentos-firmar'); expect(vista().querySelectorAll('app-documento-pendiente-card').length).toBe(1);
    expect(vista().querySelector('app-documento-pendiente-card')?.textContent).toContain('codigo-devuelto-por-api'); expect(boton('Firmar').disabled).toBeTrue();
    await pulsar('Ver documento'); expect(gateway.documento).toHaveBeenCalledWith('doc-test'); expect(vista().querySelector('iframe')).not.toBeNull();
    const dialogo = vista().querySelector<HTMLDialogElement>('app-dialogo dialog')!;
    const cerrado = new Promise<Event>(resolve => dialogo.addEventListener('close', resolve, { once: true }));
    await pulsar('Cerrar'); await cerrado; harness.detectChanges(); expect(vista().querySelector('iframe')).toBeNull();
  });
});
