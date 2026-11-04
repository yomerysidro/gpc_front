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
  const responder = (ruta: string, data: unknown) => http.expectOne('/api' + ruta).flush({ success: true, message: 'OK', data });

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
    responder('/activity/7', actividad); responder('/activity-speaker', []); responder('/participation', []);
    await fixture.whenStable();
    expect(detalle.textContent).toContain('Jornada municipal');
    expect(detalle.querySelectorAll('.tarjetas-detalle > section').length).toBe(3);
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
    responder('/activity-speaker', []); responder('/participation', []); await fixture.whenStable();
    expect(detalle.textContent).toContain('Otra jornada');
    expect(TestBed.inject(Router).url).toBe(url);
  });
});
