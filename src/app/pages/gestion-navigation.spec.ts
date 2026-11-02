import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';
import { routes } from '../app.routes';
import { AuthService } from '../core/services/autenticacion/auth.service';
import { environment } from '../../environments/environment';

const CASOS = [
  {
    "path": "personas",
    "tab": "",
    "endpoint": "persons",
    "tag": "app-person"
  },
  {
    "path": "personas",
    "tab": "documentos",
    "endpoint": "person-documents",
    "tag": "app-person-document"
  },
  {
    "path": "trabajadores",
    "tab": "",
    "endpoint": "person-workers",
    "tag": "app-person-worker"
  },
  {
    "path": "practicas",
    "tab": "practicantes",
    "endpoint": "practicing-individuals",
    "tag": "app-person-intern"
  },
  {
    "path": "practicas",
    "tab": "practicas",
    "endpoint": "practices",
    "tag": "app-practice"
  },
  {
    "path": "practicas",
    "tab": "supervisores",
    "endpoint": "supervisory-internships",
    "tag": "app-practice-supervisor"
  },
  {
    "path": "ponentes",
    "tab": "",
    "endpoint": "person-speakers",
    "tag": "app-person-speaker"
  },
  {
    "path": "configuracion",
    "tab": "areas",
    "endpoint": "areas",
    "tag": "app-area"
  },
  {
    "path": "configuracion",
    "tab": "tipos-documento",
    "endpoint": "document-types",
    "tag": "app-document-type"
  },
  {
    "path": "configuracion",
    "tab": "instituciones",
    "endpoint": "institutions",
    "tag": "app-institution"
  }
];

describe('Las diez tablas de Gestión y su navegación', () => {
  let http: HttpTestingController;
  let autenticado: boolean;
  let autorizado: boolean;
  let permisos: readonly string[] | null;
  beforeEach(() => {
    autenticado = true;
    autorizado = true;
    permisos = null;
    TestBed.configureTestingModule({ providers: [
      provideRouter(routes), provideHttpClient(), provideHttpClientTesting(),
      { provide: AuthService, useValue: {
        cargarSesion: () => of(autenticado),
        tienePermiso: (clave: string) => autorizado && (permisos === null || permisos.includes(clave)),
        usuario: signal(null), modulos: signal([]),
      } },
    ] });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  for (const caso of CASOS) {
    it('abre ' + caso.endpoint + ' con GET real, una sola tabla y el enlace activo', async () => {
      const url = '/gestion/' + caso.path + (caso.tab ? '?pestana=' + caso.tab : '');
      const harness = await RouterTestingHarness.create(url);
      const consulta = http.expectOne(environment.apiBaseUrl + '/' + caso.endpoint + '/list');
      expect(consulta.request.method).toBe('GET');
      consulta.flush({ success: true, message: '', data: [] });
      harness.detectChanges();
      const vista = harness.routeNativeElement!;
      expect(TestBed.inject(Router).url).toBe(url);
      expect(vista.querySelector(caso.tag)).not.toBeNull();
      expect(vista.querySelectorAll('main table').length).toBe(1);
      expect(vista.querySelectorAll('main h1').length).toBe(1);
      expect(vista.querySelector('app-sidebar a.active')?.getAttribute('href')).toBe('/gestion/' + caso.path);
      expect(vista.querySelector<HTMLInputElement>('main input[type="search"]')).not.toBeNull();
      expect(vista.querySelector<HTMLButtonElement>('main .encabezado button')?.disabled).toBeFalse();
      http.expectNone(peticion => peticion.method !== 'GET');
    });
  }

  it('Practicantes del sidebar redirige al listado existente', async () => {
    const harness = await RouterTestingHarness.create('/gestion/practicantes');
    expect(TestBed.inject(Router).url).toBe('/gestion/practicas?pestana=practicantes');
    http.expectOne(environment.apiBaseUrl + '/practicing-individuals/list').flush({ success: true, message: '', data: [] });
    harness.detectChanges();
    expect(harness.routeNativeElement?.querySelector('app-person-intern')).not.toBeNull();
  });

  it('abre ambas pestañas con personas.verpersonas y resuelve los nombres de Documentos con GET autorizados', async () => {
    permisos = ['personas.verpersonas', 'personas.crear', 'personas.editar', 'personas.eliminar', 'tipos-documento.ver'];
    const harness = await RouterTestingHarness.create('/gestion/personas');
    http.expectOne(environment.apiBaseUrl + '/persons/list').flush({ success: true, message: '', data: [] });
    await harness.navigateByUrl('/gestion/personas?pestana=documentos');
    http.expectOne(environment.apiBaseUrl + '/person-documents/list').flush({ success: true, message: '', data: [
      { id_persona_documento: 5, id_persona: 2, id_tipo_documento: 3, numero_documento: '12345678', estado: 'Activo' },
    ] });
    http.expectOne(environment.apiBaseUrl + '/persons/list').flush({ success: true, message: '', data: [
      { id_persona: 2, nombres: 'Ana María', apellido_paterno: 'Pérez', apellido_materno: 'Ríos' },
    ] });
    http.expectOne(environment.apiBaseUrl + '/document-types/list').flush({ success: true, message: '', data: [
      { id_tipo_documento: 3, nombre: 'DNI', estado: true },
    ] });
    harness.detectChanges();
    expect(TestBed.inject(Router).url).toBe('/gestion/personas?pestana=documentos');
    const tabla = harness.routeNativeElement!.querySelector('main table')!;
    expect(tabla.textContent).toContain('Ana María Pérez Ríos');
    expect(tabla.textContent).toContain('DNI');
    expect(tabla.textContent).toContain('12345678');
    for (const boton of Array.from(tabla.querySelectorAll<HTMLButtonElement>('tbody button'))) expect(boton.disabled).toBeFalse();
    http.expectNone(r => r.method !== 'GET');
  });

  it('un 403 de Documentos no redirige ni impide volver a Personas', async () => {
    const harness = await RouterTestingHarness.create('/gestion/personas');
    http.expectOne(environment.apiBaseUrl + '/persons/list').flush({ success: true, message: '', data: [] });
    harness.detectChanges();
    harness.routeNativeElement!.querySelector<HTMLButtonElement>('#gestion-tab-documentos')!.click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    http.expectOne(environment.apiBaseUrl + '/person-documents/list').flush(
      { success: false, message: 'No autorizado.', data: [] }, { status: 403, statusText: 'Forbidden' },
    );
    harness.detectChanges();
    expect(TestBed.inject(Router).url).toBe('/gestion/personas?pestana=documentos');
    expect(harness.routeNativeElement?.textContent).toContain('No tienes permiso');
    harness.routeNativeElement!.querySelector<HTMLButtonElement>('#gestion-tab-personas')!.click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    http.expectOne(environment.apiBaseUrl + '/persons/list').flush({ success: true, message: '', data: [] });
    harness.detectChanges();
    expect(harness.routeNativeElement?.querySelector('app-person')).not.toBeNull();
  });

  it('cancela la consulta de la pestaña que deja de estar seleccionada y admite teclado', async () => {
    const harness = await RouterTestingHarness.create('/gestion/configuracion');
    const areas = http.expectOne(environment.apiBaseUrl + '/areas/list');
    harness.detectChanges();
    const tabs = harness.routeNativeElement!.querySelector<HTMLElement>('[role="tablist"]')!;
    tabs.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(areas.cancelled).toBeTrue();
    http.expectOne(environment.apiBaseUrl + '/institutions/list').flush({ success: true, message: '', data: [] });
    harness.detectChanges();
    expect(harness.routeNativeElement?.querySelector('#gestion-tab-instituciones')?.getAttribute('aria-selected')).toBe('true');
    expect(harness.routeNativeElement?.querySelector('app-area')).toBeNull();
  });

  it('rechaza los módulos con permiso conocido cuando falta la autorización', async () => {
    autorizado = false;
    const harness = await RouterTestingHarness.create();
    for (const path of ['trabajadores', 'practicas', 'ponentes']) {
      await harness.navigateByUrl('/gestion/' + path);
      expect(TestBed.inject(Router).url).toBe('/acceso-denegado');
    }
    http.expectNone(() => true);
  });

  it('exige sesión para las cinco opciones antes de consultar datos', async () => {
    autenticado = false;
    const harness = await RouterTestingHarness.create();
    for (const path of ['personas', 'trabajadores', 'practicas', 'ponentes', 'configuracion']) {
      await harness.navigateByUrl('/gestion/' + path);
      expect(TestBed.inject(Router).url).toContain('/login?returnUrl=');
    }
    http.expectNone(() => true);
  });
});
