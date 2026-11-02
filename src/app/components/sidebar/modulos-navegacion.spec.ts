import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';
import { routes } from '../../app.routes';
import { AuthService } from '../../core/services/autenticacion/auth.service';
import { EmisionCertificadosService } from '../../core/services/emision-certificados/emision-certificados.service';
import { DASHBOARD_SIDEBAR, resolverGruposSidebar, SIDEBAR_CONFIG } from './modulos-navegacion';
import { SidebarComponent } from './sidebar.component';

@Component({ standalone: true, template: '' })
class DestinoPruebaComponent {}

const permisosLectura = [DASHBOARD_SIDEBAR.permiso, ...SIDEBAR_CONFIG.flatMap(grupo => grupo.hijos.map(hijo => hijo.permiso))]
  .filter((clave): clave is string => clave !== undefined);

describe('Configuración única del Sidebar institucional', () => {
  it('conserva el orden funcional y no activa procesos inexistentes', () => {
    expect(SIDEBAR_CONFIG.map(grupo => grupo.id)).toEqual([
      'seguridad', 'recursos-humanos', 'solicitudes', 'actividades', 'emision', 'gerencia', 'reportes', 'configuracion',
    ]);
    for (const grupo of SIDEBAR_CONFIG.filter(grupo => ['solicitudes', 'gerencia', 'reportes'].includes(grupo.id))) {
      expect(grupo.hijos.every(hijo => !hijo.habilitado && !hijo.path && !!hijo.pendiente)).toBeTrue();
    }
    expect(SIDEBAR_CONFIG.flatMap(grupo => grupo.hijos).find(hijo => hijo.id === 'generar-emitir')?.habilitado).toBeFalse();
  });

  it('no duplica rutas con los mismos parámetros, IDs ni grupos', () => {
    const entradas = SIDEBAR_CONFIG.flatMap(grupo => grupo.hijos);
    expect(new Set(entradas.map(entrada => entrada.id)).size).toBe(entradas.length);
    const enlaces = entradas.filter(entrada => entrada.habilitado).map(entrada => entrada.path + JSON.stringify(entrada.queryParams ?? {}));
    expect(new Set(enlaces).size).toBe(enlaces.length);
    expect(new Set(SIDEBAR_CONFIG.map(grupo => grupo.id)).size).toBe(SIDEBAR_CONFIG.length);
  });

  it('coloca todos los catálogos en Configuración y conserva las pantallas con pestañas', () => {
    const seguridad = SIDEBAR_CONFIG.find(grupo => grupo.id === 'seguridad')!;
    expect(seguridad.hijos.map(hijo => hijo.id)).toEqual(['usuarios', 'roles']);
    const configuracion = SIDEBAR_CONFIG.find(grupo => grupo.id === 'configuracion')!;
    expect(configuracion.hijos.map(hijo => hijo.id)).toEqual(['areas', 'instituciones', 'tipos-documento', 'tipos-actividad', 'tipos-participacion', 'tipos-certificado']);
    expect(configuracion.hijos.slice(0, 3).every(hijo => hijo.path === '/gestion/configuracion' && !!hijo.queryParams?.['pestana'])).toBeTrue();
    const personas = SIDEBAR_CONFIG.flatMap(grupo => grupo.hijos).find(hijo => hijo.id === 'personas')!;
    expect(personas.path).toBe('/gestion/personas');
    expect(SIDEBAR_CONFIG.flatMap(grupo => grupo.hijos).some(hijo => hijo.path?.includes('verificacion'))).toBeFalse();
  });

  it('conserva el metadato de Laravel sin usarlo para conceder capacidades ni duplicar enlaces', () => {
    const backend = { label: 'Nombre del módulo recibido', path: '/emision', icon: 'workspace_premium' };
    const grupos = resolverGruposSidebar(clave => ['emision.ver', 'emision.crear'].includes(clave), [backend, backend, { label: 'No desarrollado', path: '/reportes' }]);
    const preparar = grupos.flatMap(grupo => grupo.hijos).find(entrada => entrada.id === 'preparar')!;
    expect(preparar.backend).toBe(backend);
    expect(preparar.label).toBe('Preparar certificados');
    expect(grupos.flatMap(grupo => grupo.hijos).filter(entrada => entrada.id === 'preparar').length).toBe(1);
    expect(resolverGruposSidebar(() => false, [backend])).toEqual([]);
  });
});

describe('Sidebar compartido, capacidades efectivas y accesibilidad', () => {
  let fixture: ComponentFixture<SidebarComponent>;
  let permisos: ReturnType<typeof signal<readonly string[]>>;
  beforeEach(() => {
    permisos = signal<readonly string[]>(permisosLectura);
    TestBed.configureTestingModule({ providers: [provideRouter([{ path: '**', component: DestinoPruebaComponent }]),
      { provide: AuthService, useValue: { usuario: signal(null), tienePermiso: (clave: string) => permisos().includes(clave) } },
    ] });
    fixture = TestBed.createComponent(SidebarComponent);
    fixture.detectChanges();
  });
  const vista = () => fixture.nativeElement as HTMLElement;

  it('muestra una sola navegación para el administrador con las capacidades asignadas', () => {
    const grupos = Array.from(vista().querySelectorAll('button.modulo'), boton => boton.textContent?.replace('expand_more', '').trim());
    expect(grupos.length).toBe(5);
    expect(vista().querySelectorAll('nav').length).toBe(1);
    expect(vista().querySelector('a[href="/inicio"]')).not.toBeNull();
    for (const id of ['seguridad', 'recursos-humanos', 'actividades', 'emision', 'configuracion']) expect(vista().querySelector('#submenu-' + id)).not.toBeNull();
    for (const id of ['solicitudes', 'gerencia', 'reportes']) expect(vista().querySelector('#submenu-' + id)).toBeNull();
    const enlaces = Array.from(vista().querySelectorAll('a'), enlace => enlace.getAttribute('href'));
    expect(new Set(enlaces).size).toBe(enlaces.length);
  });

  it('filtra RR. HH. y no muestra Seguridad ni catálogos sin las capacidades correspondientes', () => {
    permisos.set(['personas.verpersonas', 'ponentes-firmantes.ver', 'practicantes.ver', 'reconocimientos.ver']);
    fixture.detectChanges();
    expect(vista().querySelector('#submenu-recursos-humanos')?.querySelectorAll('a').length).toBe(5);
    expect(vista().querySelector('#submenu-seguridad')).toBeNull();
    expect(vista().querySelector('a[href*="pestana=areas"]')).toBeNull();
    expect(vista().querySelector('a[href="/certificaciones/certificados"]')).toBeNull();
  });

  it('un consultor con lectura de Dashboard no obtiene escrituras ni enlaces a funciones pendientes', () => {
    permisos.set(['dashboard.ver', 'reportes.ver']); fixture.detectChanges();
    expect(vista().querySelectorAll('a').length).toBe(1);
    expect(vista().querySelector('a')?.getAttribute('href')).toBe('/inicio');
    expect(vista().querySelector('button.modulo')).toBeNull();
  });

  it('no permite acceso por el nombre Administrador ni por entradas recibidas sin permiso', () => {
    permisos.set([]);
    fixture.componentRef.setInput('items', [{ label: 'Administrador', path: '/usuarios' }, { label: 'Gerencia', path: '/gerencia' }]);
    fixture.detectChanges();
    expect(vista().querySelectorAll('a').length).toBe(0);
    expect(vista().textContent).toContain('No hay opciones habilitadas');
  });

  it('se actualiza cuando cambian las capacidades sin cambiar de componente', () => {
    permisos.set(['usuarios.ver']); fixture.detectChanges();
    expect(vista().querySelector('#submenu-seguridad a')?.textContent).toContain('Gestión de usuarios');
    permisos.set(['practicantes.ver']); fixture.detectChanges();
    expect(vista().querySelector('#submenu-seguridad')).toBeNull();
    expect(vista().querySelector('a[href="/gestion/practicas"]')).not.toBeNull();
  });

  it('marca una sola opción activa, reconoce versiones y expande el grupo al navegar', async () => {
    const router = TestBed.inject(Router);
    for (const [url, grupo, texto] of [
      ['/certificaciones/reconocimientos/17/editar', 'recursos-humanos', 'Reconocimientos'],
      ['/certificaciones/certificados/9/documentos/11/visor', 'emision', 'Certificados emitidos'],
      ['/certificaciones/firmas/asignar-firmantes', 'emision', 'Firmas digitales'],
      ['/certificaciones/configuracion/tipos-actividad', 'configuracion', 'Tipos de actividad'],
    ]) {
      await router.navigateByUrl(url); fixture.detectChanges();
      const activo = vista().querySelectorAll('a[aria-current="page"]');
      expect(activo.length).withContext(url).toBe(1);
      expect(activo[0].textContent).toContain(texto);
      expect(vista().querySelector<HTMLDivElement>('#submenu-' + grupo)?.hidden).toBeFalse();
      expect(vista().querySelector('[aria-controls="submenu-' + grupo + '"]')?.getAttribute('aria-expanded')).toBe('true');
    }
  });

  it('distingue los tres catálogos que comparten ruta y reconoce la pestaña predeterminada', async () => {
    const router = TestBed.inject(Router);
    for (const [query, texto] of [['', 'Áreas municipales'], ['?pestana=instituciones', 'Instituciones'], ['?pestana=tipos-documento', 'Tipos de documento']]) {
      await router.navigateByUrl('/gestion/configuracion' + query); fixture.detectChanges();
      expect(vista().querySelectorAll('a[aria-current="page"]').length).toBe(1);
      expect(vista().querySelector('a[aria-current="page"]')?.textContent).toContain(texto);
      expect(vista().querySelector('#submenu-seguridad a[aria-current]')).toBeNull();
    }
  });

  it('conserva iconos, tooltips y ARIA al contraer y permite abrir un grupo desde su icono', async () => {
    await TestBed.inject(Router).navigateByUrl('/gestion/personas'); fixture.detectChanges();
    fixture.componentRef.setInput('contraido', true); fixture.detectChanges();
    const grupo = vista().querySelector<HTMLButtonElement>('[aria-controls="submenu-recursos-humanos"]')!;
    expect(grupo.title).toBe('RECURSOS HUMANOS');
    expect(grupo.getAttribute('aria-expanded')).toBe('false');
    expect(vista().querySelector<HTMLDivElement>('#submenu-recursos-humanos')?.hidden).toBeTrue();
    expect(getComputedStyle(vista().querySelector('.titulo-modulo')!).display).toBe('none');
    grupo.click(); fixture.detectChanges();
    expect(fixture.componentInstance.contraido()).toBeFalse();
    expect(grupo.getAttribute('aria-expanded')).toBe('true');
    expect(grupo.hasAttribute('title')).toBeFalse();
  });

  it('permite recorrer controles visibles con teclado y no desborda un ancho de 240px', () => {
    vista().style.width = '240px';
    const botones = vista().querySelectorAll<HTMLButtonElement>('button.modulo');
    botones[0].focus();
    botones[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(document.activeElement).toBe(botones[1]);
    botones[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    expect(document.activeElement).toBe(vista().querySelector('a[href="/inicio"]'));
    expect(vista().scrollWidth).toBeLessThanOrEqual(vista().clientWidth + 1);
  });
});

describe('Rutas reales reutilizadas por el Sidebar', () => {
  let http: HttpTestingController;
  let permisos: ReturnType<typeof signal<readonly string[]>>;
  let autenticado: boolean;

  beforeEach(() => {
    permisos = signal<readonly string[]>(permisosLectura);
    autenticado = true;
    TestBed.configureTestingModule({ providers: [
      provideRouter(routes), provideHttpClient(), provideHttpClientTesting(),
      { provide: AuthService, useValue: {
        cargarSesion: () => of(autenticado), tienePermiso: (clave: string) => permisos().includes(clave),
        usuario: signal(null), modulos: signal([]),
      } },
      { provide: EmisionCertificadosService, useValue: {
        listar: () => of({ data: [], total: 0, current_page: 1, last_page: 1, per_page: 20 }),
        listarTodos: () => of([]), trabajadores: () => of([]), relacionRegistros: () => of([]),
        documentosIdentidad: () => of({}), relaciones: () => of([]),
      } },
    ] });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  function resolverLecturas(): void {
    for (const request of http.match(() => true)) {
      expect(request.request.method).toBe('GET');
      request.flush({ success: true, message: '', data: [] });
    }
  }

  const destinos = [
    ['/usuarios', 'app-listar-usuarios'],
    ['/roles', 'app-roles-permisos'],
    ['/gestion/personas', 'app-person'],
    ['/gestion/personas?pestana=documentos', 'app-person-document'],
    ['/gestion/trabajadores', 'app-person-worker'],
    ['/gestion/practicas', 'app-person-intern'],
    ['/gestion/practicas?pestana=practicas', 'app-practice'],
    ['/gestion/practicas?pestana=supervisores', 'app-practice-supervisor'],
    ['/gestion/ponentes', 'app-person-speaker'],
    ['/certificaciones/reconocimientos', 'app-listar-reconocimientos'],
    ['/certificaciones/actividades', 'app-actividades'],
    ['/certificaciones/participantes', 'app-actividades'],
    ['/certificaciones/sesiones-asistencia', 'app-actividades'],
    ['/certificaciones/certificados', 'app-listar-certificados'],
    ['/certificaciones/certificados/documentos', 'app-listar-documentos'],
    ['/certificaciones/firmas', 'app-listar-firmas'],
    ['/gestion/configuracion?pestana=areas', 'app-area'],
    ['/gestion/configuracion?pestana=instituciones', 'app-institution'],
    ['/gestion/configuracion?pestana=tipos-documento', 'app-document-type'],
    ['/certificaciones/configuracion/tipos-actividad', 'app-actividades'],
    ['/certificaciones/configuracion/tipos-participacion', 'app-actividades'],
    ['/certificaciones/configuracion', 'app-tipos-certificado'],
  ];
  for (const [url, selector] of destinos) {
    it('reutiliza el componente existente de ' + url, async () => {
      const harness = await RouterTestingHarness.create(url); resolverLecturas(); harness.detectChanges();
      expect(TestBed.inject(Router).url).toBe(url);
      expect(harness.routeNativeElement!.querySelector(selector)).withContext(url).not.toBeNull();
      expect(harness.routeNativeElement!.querySelectorAll('app-sidebar').length).toBe(1);
      expect(harness.routeNativeElement!.querySelectorAll('app-sidebar a[aria-current="page"]').length).toBe(1);
    });
  }

  it('mantiene el guard de Personas y las rutas de creación protegidas', async () => {
    permisos.set(['emision.ver']);
    const harness = await RouterTestingHarness.create('/gestion/personas');
    expect(TestBed.inject(Router).url).toBe('/acceso-denegado');
    await harness.navigateByUrl('/certificaciones/certificados/nuevo');
    expect(TestBed.inject(Router).url).toBe('/acceso-denegado');
    http.expectNone(() => true);
  });

  it('reevalúa el permiso del catálogo al cambiar la pestaña y no otorga escrituras', async () => {
    permisos.set(['areas.ver']);
    const harness = await RouterTestingHarness.create('/gestion/configuracion?pestana=areas');
    resolverLecturas(); harness.detectChanges();
    expect(harness.routeNativeElement!.querySelector('app-area')).not.toBeNull();
    expect(harness.routeNativeElement!.querySelector<HTMLButtonElement>('app-gestion-table .encabezado button')!.disabled).toBeTrue();
    await harness.navigateByUrl('/gestion/configuracion?pestana=instituciones');
    expect(TestBed.inject(Router).url).toBe('/acceso-denegado');
    http.expectNone(() => true);
  });

  it('mantiene las asignaciones y firmas aplicadas bajo los permisos existentes', async () => {
    const harness = await RouterTestingHarness.create('/certificaciones/firmas/asignar-firmantes'); resolverLecturas();
    expect(harness.routeNativeElement!.querySelector('app-asignar-firmantes')).not.toBeNull();
    await harness.navigateByUrl('/certificaciones/firmas/aplicadas'); resolverLecturas();
    expect(harness.routeNativeElement!.querySelector('app-firmas-aplicadas')).not.toBeNull();
  });

  it('conserva el acceso público fuera del layout administrativo', async () => {
    autenticado = false; permisos.set([]);
    const harness = await RouterTestingHarness.create('/verificar/CODIGO');
    expect(harness.routeNativeElement!.querySelector('app-sidebar, app-header')).toBeNull();
    expect(TestBed.inject(Router).url).toBe('/verificar/CODIGO');
    await harness.navigateByUrl('/gestion/personas');
    expect(TestBed.inject(Router).url).toBe('/login?returnUrl=%2Fgestion%2Fpersonas');
  });

  it('redirige los enlaces institucionales anteriores al componente correspondiente', async () => {
    const harness = await RouterTestingHarness.create('/actividades'); resolverLecturas();
    expect(TestBed.inject(Router).url).toBe('/certificaciones/actividades');
    await harness.navigateByUrl('/emision'); resolverLecturas();
    expect(TestBed.inject(Router).url).toBe('/certificaciones/certificados');
    await harness.navigateByUrl('/gestion/practicantes'); resolverLecturas();
    expect(TestBed.inject(Router).url).toBe('/gestion/practicas?pestana=practicantes');
    await harness.navigateByUrl('/areas'); resolverLecturas();
    expect(TestBed.inject(Router).url).toBe('/gestion/configuracion?pestana=areas');
    await harness.navigateByUrl('/documentos'); resolverLecturas();
    expect(TestBed.inject(Router).url).toBe('/gestion/configuracion?pestana=tipos-documento');
  });

  it('no crea rutas duplicadas al separar la organización del menú de los módulos de Angular', () => {
    function comprobar(nodos: typeof routes): void {
      const claves = nodos.map(nodo => [nodo.path ?? '', nodo.pathMatch ?? '', !!nodo.redirectTo].join('|'));
      expect(new Set(claves).size).toBe(claves.length);
      for (const nodo of nodos) if (nodo.children) comprobar(nodo.children);
    }
    comprobar(routes);
  });

  it('conserva el cajón móvil al abrir un grupo y permite cerrarlo por el control existente', async () => {
    const harness = await RouterTestingHarness.create('/inicio');
    const vista = harness.routeNativeElement!;
    const sidebar = vista.querySelector<HTMLElement>('app-sidebar')!;
    vista.querySelector<HTMLButtonElement>('.menu-movil')!.click();
    harness.detectChanges();
    expect(sidebar.matches(':popover-open')).toBeTrue();
    sidebar.querySelector<HTMLButtonElement>('button.modulo')!.click();
    harness.detectChanges();
    expect(sidebar.matches(':popover-open')).toBeTrue();
    sidebar.querySelector<HTMLButtonElement>('.cerrar-menu')!.click();
    harness.detectChanges();
    expect(sidebar.matches(':popover-open')).toBeFalse();
  });
});
