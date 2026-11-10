import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from '../../core/services/autenticacion/auth.service';
import { ListarActividadesComponent } from './listar-actividades/listar-actividades.component';

describe('Pestañas de Actividades con detalle y servicios reales', () => {
  let fixture: ComponentFixture<ListarActividadesComponent>;
  let http: HttpTestingController;
  const actividad = { id_actividad: 7, id_area: 2, id_tipo_actividad: 3, nombre: 'Jornada municipal',
    area_nombre: 'Desarrollo social', tipo_actividad_nombre: 'Taller', descripcion: null,
    fecha_inicio: '2026-11-04', fecha_fin: '2026-11-05', sede: 'Auditorio', estado: 'Activa',
    origen: 'sin_solicitud', id_solicitud_actividad: null };
  const $ = <T extends HTMLElement = HTMLElement>(selector: string): T => fixture.nativeElement.querySelector(selector);
  const responder = (ruta: string, data: unknown, sesiones: unknown[] = []) => { http.expectOne('/api' + ruta).flush({ success: true, message: 'OK', data }); if (ruta.startsWith('/activity/')) { http.expectOne('/api/activity-session').flush({ success: true, data: sesiones }); http.expectOne('/api/attendance/list').flush({ success: true, data: [] }); } };

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [ListarActividadesComponent], providers: [
      provideRouter([]), provideHttpClient(), provideHttpClientTesting(),
      { provide: AuthService, useValue: { tienePermiso: () => true } },
    ] });
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ListarActividadesComponent); fixture.autoDetectChanges();
    await fixture.whenStable();
    responder('/activity', [actividad, { ...actividad, id_actividad: 19, nombre: 'Otra jornada' }]);
    responder('/areas/list', [{ id_area: 2, nombre: 'Desarrollo social' }]);
    responder('/ativicty-type', [{ id_tipo_actividad: 3, nombre: 'Taller', estado: true }]);
    await fixture.whenStable();
  });
  afterEach(() => { fixture.destroy(); http.verify(); });

  it('abre el detalle en el panel y vuelve sin recargar el listado ni cambiar la URL', async () => {
    const url = TestBed.inject(Router).url;
    const tabla = $('#actividades-panel-listado table');
    const listado = $('#actividades-panel-listado');
    const detalle = $('#actividades-panel-detalle');
    expect($<HTMLButtonElement>('#actividades-tab-detalle').disabled).toBeTrue();
    http.expectNone('/api/activity/7');
    $('tbody button[aria-label="Ver actividad"]').click(); await fixture.whenStable();
    expect(listado.hidden).toBeTrue(); expect(detalle.hidden).toBeFalse();
    expect(detalle.textContent).toContain('Cargando actividad');
    responder('/activity/7', actividad); responder('/participation', []);
    await fixture.whenStable();
    expect(detalle.textContent).toContain('Jornada municipal');
    expect(detalle.querySelectorAll('.tarjetas-detalle > section').length).toBe(2);
    expect(detalle.querySelector('.consulta-inscritos')).toBeNull();
    expect(detalle.querySelector('app-listado-emision')).toBeNull();
    expect(fixture.nativeElement.querySelectorAll('app-page-title').length).toBe(1);
    expect(fixture.nativeElement.querySelector('dialog[open]')).toBeNull();
    $('app-detalle-actividad .encabezado button').click(); await fixture.whenStable();
    expect(listado.hidden).toBeFalse(); expect(detalle.hidden).toBeTrue();
    expect($('#actividades-panel-listado table')).toBe(tabla);
    http.expectNone('/api/activity');
    $('#actividades-tab-detalle').click(); await fixture.whenStable();
    expect(detalle.hidden).toBeFalse(); http.expectNone('/api/activity/7');
    $('#actividades-tab-listado').click(); await fixture.whenStable();
    const ojos = fixture.nativeElement.querySelectorAll('tbody button[aria-label="Ver actividad"]');
    ojos[1].click(); await fixture.whenStable();
    expect(detalle.textContent).not.toContain('Jornada municipal');
    responder('/activity/19', { ...actividad, id_actividad: 19, nombre: 'Otra jornada' });
    responder('/participation', []); await fixture.whenStable();
    expect(detalle.textContent).toContain('Otra jornada');
    expect(TestBed.inject(Router).url).toBe(url);
  });

  it('ofrece los cuatro accesos contextuales, origen y solicitud real sin crear inscripciones', async () => {
    $('tbody button[aria-label="Ver actividad"]').click(); await fixture.whenStable();
    responder('/activity/7', { ...actividad, origen: 'solicitud', id_solicitud_actividad: 42 }, [{ id_actividad_sesion: 15, id_actividad: 7, nombre: 'Jornada real' }]);
    responder('/participation', []); await fixture.whenStable();
    const detalle = $('#actividades-panel-detalle');
    expect(detalle.textContent).toContain('Solicitud aprobada');
    expect(detalle.textContent).toContain('Solicitud #42');
    const enlaces = Array.from(detalle.querySelectorAll<HTMLAnchorElement>('nav a'));
    expect(enlaces.length).toBe(0);
    const botonPonentes = detalle.querySelector<HTMLButtonElement>('button[aria-label="Ponentes de la actividad"]')!;
    expect(botonPonentes.title).toBe('Ponentes de la actividad'); botonPonentes.click(); await fixture.whenStable();
    responder('/activity-speaker', []); responder('/person-speakers/list', []); responder('/persons/list', []);
    await fixture.whenStable();
    expect($<HTMLDialogElement>('.modal-ponentes dialog').open).toBeTrue();
    expect($('.modal-ponentes .contexto-actividad').textContent).toContain('Jornada municipal');
    expect($('.modal-ponentes a')).toBeNull();
    $<HTMLButtonElement>('.modal-ponentes .dialogo-acciones button').click(); await fixture.whenStable();
    botonPonentes.click(); await fixture.whenStable();
    http.expectNone('/api/activity-speaker'); http.expectNone('/api/person-speakers/list');
    http.expectNone(req => req.method !== 'GET');
  });

  it('el retorno por URL abre Detalles con el ID real y permite editar o pedir cierre', async () => {
    await TestBed.inject(Router).navigate([], { queryParams: { id_actividad: 7 } }); await fixture.whenStable();
    responder('/activity/7', actividad); responder('/participation', []);
    await fixture.whenStable();
    expect($('#actividades-panel-detalle').hidden).toBeFalse();
    expect($('#actividades-tab-detalle').getAttribute('aria-selected')).toBe('true');
    expect(fixture.nativeElement.querySelector('app-dialogo.modal-detalle dialog[open]')).toBeNull();
    const acciones = Array.from($('#actividades-panel-detalle').querySelectorAll<HTMLButtonElement>('[aria-label="Acciones de la actividad"] button'));
    expect(acciones.length).toBe(1); expect(acciones[0].disabled).toBeFalse();
    const cierre = $('#actividades-panel-detalle').querySelector<HTMLButtonElement>('[aria-label="Cierre de la actividad"] button')!;
    expect(cierre.disabled).toBeFalse();
    cierre.click(); await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('app-dialogo-confirmacion dialog[open]')).not.toBeNull();
    http.expectNone(req => req.method !== 'GET');
  });
});
