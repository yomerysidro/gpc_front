import { CAPACIDADES_ADMIN_SOLICITUDES_TEST, SIN_CAPACIDADES_SOLICITUDES_TEST } from '../../core/interfaces/autenticacion/auth-fixtures.spec';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { computed, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';
import { routes } from '../../app.routes';
import { UsuarioSesion } from '../../core/interfaces/autenticacion/auth.interface';
import { AuthService } from '../../core/services/autenticacion/auth.service';
import { ReportesService } from '../../core/services/reportes/reportes.service';
import { SOLICITUDES_GATEWAY } from '../../core/services/solicitudes/solicitudes.service';
import { DASHBOARD_SIDEBAR, resolverGruposSidebar, rutaPantallaPendiente, SIDEBAR_CONFIG } from './modulos-navegacion';
import { pantallasPendientesGuard, puedeConsultarPantallasPendientes } from './pantallas-pendientes.guard';

describe('Páginas preliminares del Administrador sin privilegios operativos nuevos', () => {
  const administrador: UsuarioSesion = { id: 1, nombre: 'Cuenta de prueba', email: 'prueba@example.test', rol: 'Administrador' };
  const pendientes = SIDEBAR_CONFIG.flatMap(grupo => grupo.hijos).filter(entrada => !entrada.habilitado && !!entrada.pendiente);
  let usuario: ReturnType<typeof signal<UsuarioSesion | null>>;
  let permisos: ReturnType<typeof signal<readonly string[]>>;
  let autenticado: boolean;
  let http: HttpTestingController;

  beforeEach(() => {
    usuario = signal<UsuarioSesion | null>(administrador);
    permisos = signal<readonly string[]>([
      ...[DASHBOARD_SIDEBAR.permiso, ...SIDEBAR_CONFIG.flatMap(grupo => grupo.hijos.map(entrada => entrada.permiso))]
        .filter((clave): clave is string => clave !== undefined), 'roles.editar', 'solicitudes.revisar', 'solicitudes.crear',
    ]);
    autenticado = true;
    TestBed.configureTestingModule({ providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting(),
      { provide: ReportesService, useValue: { totalRegistrados: () => of(0) } },
      { provide: SOLICITUDES_GATEWAY, useValue: null },
      { provide: AuthService, useValue: {
        usuario, permisos, modulos: signal([]), cargarSesion: () => of(autenticado),
        capacidadesSolicitudes: computed(() => permisos().includes('solicitudes.consultar') ? CAPACIDADES_ADMIN_SOLICITUDES_TEST : SIN_CAPACIDADES_SOLICITUDES_TEST), tienePermiso: (clave: string) => permisos().includes(clave),
      } },
    ] });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  function resolverCatalogos(): void {
    for (const peticion of http.match(req => req.method === 'GET' && (req.url.endsWith('/authorized-areas') || req.url.endsWith('/ativicty-type')))) {
      peticion.flush({ success: true, data: [] });
    }
  }

  it('muestra un enlace de Solicitudes y una única Revisión bajo Recursos Humanos', async () => {
    const harness = await RouterTestingHarness.create('/inicio');
    const vista = harness.routeNativeElement!;
    expect(vista.querySelectorAll('app-sidebar button.modulo').length).toBe(8);
    expect(vista.querySelector('app-sidebar a[href="/inicio"]')).not.toBeNull();
    const solicitudes = vista.querySelector('#submenu-solicitudes')!;
    expect(solicitudes.querySelectorAll('a').length).toBe(1);
    expect(solicitudes.textContent).not.toContain('Nueva solicitud de actividad');
    expect(solicitudes.textContent).toContain('Mis solicitudes');
    expect(solicitudes.textContent).not.toContain('Revisión de solicitudes');
    expect(vista.querySelectorAll('app-sidebar a[href="/solicitudes/revision"]').length).toBe(1);
    expect(vista.querySelector('#submenu-recursos-humanos a[href="/solicitudes/revision"]')?.textContent).toContain('Revisión de solicitudes');
    expect(Array.from(vista.querySelectorAll('#submenu-gerencia a'), enlace => enlace.getAttribute('href')))
      .toEqual(['/pendientes/pendientes-aprobacion', '/pendientes/documentos-firmar']);
    for (const entrada of pendientes.filter(entrada => entrada.interfazDisponible)) {
      const enlace = vista.querySelector(`app-sidebar a[href="${rutaPantallaPendiente(entrada)}"]`)!;
      expect(enlace.querySelector('.texto-enlace')?.textContent?.trim()).toBe(entrada.label);
      expect(enlace.querySelector('.etiqueta-desarrollo')).toBeNull();
    }
    expect(vista.querySelector('app-sidebar')?.textContent).not.toContain('Integración pendiente');
    expect(vista.querySelector('#submenu-reportes .etiqueta-desarrollo')).toBeNull();
    http.expectNone(() => true);
  });

  for (const entrada of pendientes) {
    it('abre la página informativa ' + entrada.id + ' sin peticiones de negocio', async () => {
      const url = rutaPantallaPendiente(entrada);
      const harness = await RouterTestingHarness.create(url);
      resolverCatalogos();
      harness.detectChanges();
      expect(TestBed.inject(Router).url).toBe(url);
      const vista = harness.routeNativeElement!;
      if (entrada.interfazDisponible) {
        expect(vista.querySelector('app-vista-temporal')).toBeNull();
        expect(vista.querySelector('app-integracion-solicitudes')?.textContent).toContain('pendiente de habilitación');
        expect(vista.querySelector('h1')).not.toBeNull();
        expect(vista.querySelectorAll('tbody tr, app-documento-pendiente-card').length).toBe(0);
      } else {
        const pagina = vista.querySelector('app-vista-temporal')!;
        expect(pagina).not.toBeNull();
        expect(pagina.querySelector('h1')?.textContent).toBe(entrada.label);
        expect(pagina.textContent).toContain('En desarrollo');
        expect(pagina.textContent).toContain('Funcionalidad pendiente de integración');
        expect(pagina.querySelector('form, input, table, button')).toBeNull();
      }
      expect(vista.querySelectorAll('app-sidebar a[aria-current="page"]').length).toBe(1);
      expect(vista.querySelector('app-sidebar a[aria-current="page"]')?.getAttribute('href')).toBe(url === '/solicitudes/nueva' ? '/solicitudes/mis-solicitudes' : url);
      const grupo = SIDEBAR_CONFIG.find(grupo => grupo.hijos.some(hijo => hijo.id === entrada.id))!;
      expect(vista.querySelector<HTMLDivElement>('#submenu-' + grupo.id)?.hidden).toBeFalse();
      http.expectNone(() => true);
    });
  }

  it('mantiene separadas las tres pantallas de Solicitudes al navegar entre ellas', async () => {
    const harness = await RouterTestingHarness.create('/solicitudes/nueva');
    resolverCatalogos();
    for (const url of ['/solicitudes/mis-solicitudes', '/solicitudes/revision', '/solicitudes/nueva']) {
      await harness.navigateByUrl(url); harness.detectChanges();
      resolverCatalogos();
      const panel = harness.routeNativeElement!.querySelector('[role="tabpanel"]:not([hidden])') ?? harness.routeNativeElement!;
      expect(panel.querySelectorAll('app-integracion-solicitudes').length).toBe(1);
      expect(harness.routeNativeElement!.querySelectorAll('app-nueva-solicitud').length).toBeLessThanOrEqual(1);
      expect(harness.routeNativeElement!.querySelector('app-vista-temporal')).toBeNull();
      expect(harness.routeNativeElement!.querySelector('app-sidebar a.active')?.getAttribute('href'))
        .toBe(url === '/solicitudes/nueva' ? '/solicitudes/mis-solicitudes' : url);
    }
    http.expectNone(() => true);
  });

  it('oculta preliminares a otros usuarios aunque tengan las mismas capacidades y conserva sus enlaces reales', async () => {
    usuario.set({ ...administrador, rol: 'Digitador' });
    const harness = await RouterTestingHarness.create('/inicio');
    expect(harness.routeNativeElement!.querySelector('#submenu-solicitudes')).not.toBeNull();
    expect(harness.routeNativeElement!.querySelector('a[href="/certificaciones/actividades"]')).not.toBeNull();
    await harness.navigateByUrl('/solicitudes/nueva');
    resolverCatalogos();
    expect(TestBed.inject(Router).url).toBe('/solicitudes/nueva');
    http.expectNone(() => true);
  });

  it('no permite acceso solo por llamarse Administrador si faltan las capacidades de gestión', async () => {
    permisos.set([]);
    const harness = await RouterTestingHarness.create('/solicitudes/revision');
    expect(TestBed.inject(Router).url).toBe('/acceso-denegado');
    expect(harness.routeNativeElement!.querySelector('app-vista-temporal')).toBeNull();
    expect(puedeConsultarPantallasPendientes(administrador, () => false)).toBeFalse();
    expect(puedeConsultarPantallasPendientes(null, () => true)).toBeFalse();
  });

  it('consultar una página preliminar no concede acceso a Reportes, Usuarios ni a otros CRUD', async () => {
    permisos.set(['roles.ver', 'roles.editar']);
    const harness = await RouterTestingHarness.create('/pendientes/documentos-firmar');
    expect(TestBed.inject(Router).url).toBe('/acceso-denegado');
    await harness.navigateByUrl('/pendientes/indicadores');
    expect(TestBed.inject(Router).url).toBe('/acceso-denegado');
    await harness.navigateByUrl('/usuarios');
    expect(TestBed.inject(Router).url).toBe('/acceso-denegado');
    http.expectNone(() => true);
  });

  it('exige sesión antes de abrir cualquier pantalla preliminar', async () => {
    autenticado = false; usuario.set(null);
    const harness = await RouterTestingHarness.create('/solicitudes/nueva');
    expect(TestBed.inject(Router).url).toBe('/login?returnUrl=%2Fsolicitudes%2Fnueva');
    expect(harness.routeNativeElement!.querySelector('app-vista-temporal')).toBeNull();
  });

  it('las rutas preliminares tienen un guard propio y no habilitan operaciones ni duplican enlaces', () => {
    const privada = routes.find(ruta => ruta.children?.some(hija => hija.path === 'inicio'))!;
    for (const entrada of pendientes) {
      expect(privada.children?.find(ruta => ruta.path === rutaPantallaPendiente(entrada).slice(1))?.canActivate).toEqual([pantallasPendientesGuard]);
    }
    const visibles = resolverGruposSidebar(() => true, [], true).flatMap(grupo => grupo.hijos);
    const destinos = visibles.map(entrada => entrada.path + JSON.stringify(entrada.queryParams ?? {}));
    expect(new Set(destinos).size).toBe(destinos.length);
    expect(visibles.filter(entrada => entrada.preliminar).every(entrada => !entrada.habilitado && !entrada.permiso)).toBeTrue();
  });
});
