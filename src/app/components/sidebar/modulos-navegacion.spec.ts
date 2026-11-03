import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';
import { routes } from '../../app.routes';
import { AuthService } from '../../core/services/autenticacion/auth.service';
import { GestionService } from '../../core/services/gestion/gestion.service';
import { MODULOS_NAVEGACION } from './modulos-navegacion';
import { EmisionCertificadosService } from '../../core/services/emision-certificados/emision-certificados.service';

describe('Navegación de Gestión y Certificaciones', () => {
  let autenticado: boolean;
  let modulosBackend: ReturnType<typeof signal<readonly { id: number; nombre: string; url: string; imagen: string }[]>>;

  beforeEach(() => {
    autenticado = true;
    modulosBackend = signal([
      { id: 1, nombre: 'Usuarios', url: '/usuarios', imagen: 'people' },
      { id: 2, nombre: 'Roles', url: '/roles', imagen: 'admin_panel_settings' },
      { id: 3, nombre: 'Actividades', url: '/actividades', imagen: 'event' },
      { id: 4, nombre: 'Ponentes y Firmantes', url: '/ponentes-firmantes', imagen: 'campaign' },
      { id: 5, nombre: 'Reportes', url: '/reportes', imagen: 'bar_chart' },
    ]);
    TestBed.configureTestingModule({
      providers: [provideRouter(routes), { provide: GestionService, useValue: { listar: () => of([]) } }, {
        provide: EmisionCertificadosService,
        useValue: {
          listar: () => of({ data: [], total: 0, current_page: 1, last_page: 1, per_page: 20 }),
          obtener: () => of({ id_certificado: 1 }),
        },
      }, {
        provide: AuthService,
        useValue: {
          cargarSesion: () => of(autenticado),
          tienePermiso: () => true,
          usuario: signal(null),
          modulos: modulosBackend,
        },
      }],
    });
  });

  it('navega las opciones principales y activa el acordeón correspondiente', async () => {
    const harness = await RouterTestingHarness.create();
    for (const modulo of MODULOS_NAVEGACION) {
      for (const opcion of modulo.opciones) {
        const url = `/${modulo.path}/${opcion.path}`;
        await harness.navigateByUrl(url);
        harness.detectChanges();
        const vista: HTMLElement = harness.routeNativeElement!;
        expect(TestBed.inject(Router).url).toBe(url);
        expect(vista.querySelector('main h1')?.textContent?.trim()).toBe(opcion.label);
        if (modulo.path === 'gestion') {
          expect(vista.querySelector('app-registro-gestion')).not.toBeNull();
          expect(vista.querySelector('app-vista-temporal')).toBeNull();
        }
        expect(vista.querySelectorAll('main h1').length).toBe(1);
        expect(vista.querySelector('app-sidebar a.active')?.getAttribute('href')).toBe(url);
        const boton = vista.querySelector<HTMLButtonElement>(`[aria-controls="submenu-${modulo.path}"]`)!;
        const submenu = vista.querySelector<HTMLElement>(`#submenu-${modulo.path}`)!;
        expect(boton.getAttribute('aria-expanded')).toBe('true');
        expect(submenu.hidden).toBeFalse();
        boton.click();
        harness.detectChanges();
        expect(submenu.hidden).toBeTrue();
        boton.click();
        harness.detectChanges();
        expect(submenu.hidden).toBeFalse();
        expect(vista.querySelectorAll(`app-sidebar a[href="${url}"]`).length).toBe(1);
        expect(vista.querySelector('a[href="/actividades"]')).toBeNull();
        expect(vista.querySelector('a[href="/usuarios"]')).not.toBeNull();
        expect(vista.querySelector('a[href="/roles"]')).not.toBeNull();
      }
    }
  });

  it('abre las cinco tablas agrupadas y conserva activa la opción principal del sidebar', async () => {
    const harness = await RouterTestingHarness.create();
    for (const [url, entidad, principal] of [
      ['/gestion/personas/documentos', 'persona_documento', '/gestion/personas'],
      ['/gestion/practicas/practicantes', 'persona_practicante', '/gestion/practicas'],
      ['/gestion/practicas/supervisores', 'practica_supervisor', '/gestion/practicas'],
      ['/gestion/configuracion/tipos-documento', 'tipo_documento', '/gestion/configuracion'],
      ['/gestion/configuracion/instituciones', 'institucion', '/gestion/configuracion'],
    ]) {
      await harness.navigateByUrl(url);
      harness.detectChanges();
      const vista: HTMLElement = harness.routeNativeElement!;
      expect(vista.querySelector(`app-${entidad.replaceAll('_', '-')}-gestion`)).not.toBeNull();
      expect(vista.querySelector('app-vista-temporal')).toBeNull();
      expect(vista.querySelector('app-sidebar a.active')?.getAttribute('href')).toBe(principal);
      expect(vista.querySelector('main a[aria-current="page"]')?.getAttribute('href')).toBe(url);
    }
  });

  it('conserva la protección del layout privado', async () => {
    autenticado = false;
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/gestion/personas');
    expect(TestBed.inject(Router).url).toBe('/login?returnUrl=%2Fgestion%2Fpersonas');
  });

  it('agrupa Reportes sin duplicar Ponentes y Firmas del menú principal', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/reportes');
    harness.detectChanges();
    const vista: HTMLElement = harness.routeNativeElement!;
    const submenu = vista.querySelector<HTMLElement>('#submenu-reportes')!;
    const boton = vista.querySelector<HTMLButtonElement>('[aria-controls="submenu-reportes"]')!;
    expect(submenu.hidden).toBeFalse();
    expect(boton.classList.contains('active')).toBeTrue();
    expect(submenu.querySelector('a.active')?.getAttribute('href')).toBe('/reportes');
    expect(vista.querySelectorAll('a[href="/reportes"]').length).toBe(1);
    expect(vista.querySelector('a[href="/ponentes-firmantes"]')).toBeNull();
    expect(vista.querySelectorAll('a[href="/gestion/ponentes"]').length).toBe(1);
    expect(vista.querySelectorAll('a[href="/certificaciones/firmas"]').length).toBe(1);
    boton.click();
    harness.detectChanges();
    expect(submenu.hidden).toBeTrue();
    boton.click();
    harness.detectChanges();
    expect(submenu.hidden).toBeFalse();
  });

  it('oculta Emisión de Certificados del grupo Seguridad y conserva Certificaciones → Certificados', async () => {
    modulosBackend.set([
      { id: 1, nombre: 'Usuarios', url: '/usuarios', imagen: 'people' },
      { id: 2, nombre: 'Emisión de Certificados', url: '/emision', imagen: 'workspace_premium' },
      { id: 3, nombre: 'Roles', url: '/roles', imagen: 'admin_panel_settings' },
      { id: 4, nombre: 'Actividades', url: '/actividades', imagen: 'event' },
    ]);

    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/certificaciones/certificados');
    harness.detectChanges();
    const vista: HTMLElement = harness.routeNativeElement!;

    expect(vista.querySelector('#submenu-seguridad a[href="/emision"]')).toBeNull();
    expect(vista.querySelectorAll('a[href="/certificaciones/certificados"]').length).toBe(1);
    vista.querySelector<HTMLAnchorElement>('#submenu-certificaciones a[href="/certificaciones/certificados"]')!.click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(TestBed.inject(Router).url).toBe('/certificaciones/certificados');
    expect(vista.querySelector('main h1')?.textContent?.trim()).toBe('Certificados');
  });

  it('contrae el sidebar, conserva la opción activa y abre un módulo desde su icono', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/gestion/personas');
    harness.detectChanges();
    const vista: HTMLElement = harness.routeNativeElement!;
    const layout = vista.querySelector('app-main-layout')!;
    const sidebar = vista.querySelector('app-sidebar')!;
    const toggle = vista.querySelector<HTMLButtonElement>('.menu-escritorio')!;
    const gestion = sidebar.querySelector<HTMLButtonElement>('[aria-controls="submenu-gestion"]')!;
    const certificaciones = sidebar.querySelector<HTMLButtonElement>('[aria-controls="submenu-certificaciones"]')!;
    const submenu = sidebar.querySelector<HTMLElement>('#submenu-gestion')!;
    const anchoExpandido = layout.getBoundingClientRect().width;
    expect(sidebar.classList.contains('contraido')).toBeFalse();
    toggle.click();
    harness.detectChanges();
    expect(sidebar.classList.contains('contraido')).toBeTrue();
    expect(layout.classList.contains('sidebar-contraido')).toBeTrue();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(gestion.title).toBe('GESTIÓN');
    expect(gestion.getAttribute('aria-label')).toBe('GESTIÓN');
    expect(gestion.getAttribute('aria-expanded')).toBe('false');
    expect(sidebar.querySelector('a.active')?.getAttribute('href')).toBe('/gestion/personas');
    if (matchMedia('(min-width: 769px)').matches) {
      expect(getComputedStyle(submenu).display).toBe('none');
      expect(getComputedStyle(gestion.querySelector('.titulo-modulo')!).display).toBe('none');
      expect(getComputedStyle(gestion.querySelector('.flecha')!).display).toBe('none');
      expect(sidebar.getBoundingClientRect().width).toBeCloseTo(72, 0);
      expect(vista.querySelector('main')!.getBoundingClientRect().left)
        .toBeGreaterThanOrEqual(sidebar.getBoundingClientRect().right);
    }
    certificaciones.click();
    harness.detectChanges();
    expect(sidebar.classList.contains('contraido')).toBeFalse();
    expect(certificaciones.getAttribute('aria-expanded')).toBe('true');
    expect(certificaciones.hasAttribute('title')).toBeFalse();
    expect(layout.getBoundingClientRect().width).toBe(anchoExpandido);
    expect(sidebar.querySelectorAll('a[href$="/configuracion"]').length).toBe(2);
    expect(vista.querySelectorAll('app-sidebar').length).toBe(1);
    toggle.click();
    harness.detectChanges();
    toggle.click();
    harness.detectChanges();
    expect(sidebar.classList.contains('contraido')).toBeFalse();
  });

  it('abre y cierra el cajón móvil y conserva los acordeones sin cerrar el cajón', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/gestion/personas');
    harness.detectChanges();
    const vista: HTMLElement = harness.routeNativeElement!;
    const sidebar = vista.querySelector<HTMLElement>('app-sidebar')!;
    const abrir = vista.querySelector<HTMLButtonElement>('.menu-movil')!;
    abrir.click();
    await new Promise(resolve => setTimeout(resolve, 30));
    harness.detectChanges();
    expect(sidebar.matches(':popover-open')).toBeTrue();
    expect(abrir.getAttribute('aria-expanded')).toBe('true');
    sidebar.querySelector<HTMLButtonElement>('[aria-controls="submenu-certificaciones"]')!.click();
    harness.detectChanges();
    expect(sidebar.matches(':popover-open')).toBeTrue();
    sidebar.querySelector<HTMLButtonElement>('.cerrar-menu')!.click();
    await new Promise(resolve => setTimeout(resolve, 30));
    harness.detectChanges();
    expect(sidebar.matches(':popover-open')).toBeFalse();
    expect(abrir.getAttribute('aria-expanded')).toBe('false');
  });
});
