import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { MainLayoutComponent } from './main-layout.component';

describe('Layout compartido con scroll independiente', () => {
  let fixture: ComponentFixture<MainLayoutComponent>;
  let marco: HTMLIFrameElement | undefined;
  const esperarFrame = () => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  const elemento = <T extends HTMLElement>(selector: string) => fixture.nativeElement.querySelector(selector) as T;
  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: AuthService, useValue: {
      tienePermiso: () => true, cargarSesion: () => of(true), usuario: () => null, modulos: () => [],
    } }] });
    fixture = TestBed.createComponent(MainLayoutComponent); fixture.autoDetectChanges(); await fixture.whenStable(); await esperarFrame();
    // Viewport propio: Karma puede ejecutar sus pruebas dentro de un iframe estrecho.
    marco = document.createElement('iframe'); marco.style.width = '1024px'; marco.style.height = '768px'; marco.style.border = '0';
    marco.style.position = 'fixed'; marco.style.inset = '0'; document.body.append(marco);
    const doc = marco.contentDocument!;
    for (const estilo of Array.from(document.head.querySelectorAll('style, link[rel="stylesheet"]'))) doc.head.append(estilo.cloneNode(true));
    doc.body.style.margin = '0'; doc.body.append(fixture.nativeElement);
    await doc.fonts.ready; await esperarFrame();
  });
  afterEach(() => { fixture.destroy(); marco?.remove(); marco = undefined; });

  it('mantiene Header y Sidebar en su sitio al desplazar el contenido y conserva los grupos abiertos', () => {
    const principal = elemento<HTMLElement>('main'), sidebar = elemento<HTMLElement>('app-sidebar'), header = elemento<HTMLElement>('app-header');
    const grupo = elemento<HTMLButtonElement>('app-sidebar button.modulo'); grupo.click(); fixture.detectChanges();
    const contenido = document.createElement('div'); contenido.style.height = '2500px'; principal.append(contenido);
    const posicion = sidebar.getBoundingClientRect(); principal.scrollTop = 500; principal.dispatchEvent(new Event('scroll')); fixture.detectChanges();
    expect(principal.scrollTop).toBe(500);
    expect(header.getBoundingClientRect().top).toBe(0);
    expect(sidebar.getBoundingClientRect().top).toBe(posicion.top);
    expect(sidebar.getBoundingClientRect().top).toBe(header.getBoundingClientRect().bottom);
    expect(grupo.getAttribute('aria-expanded')).toBe('true');
    expect(marco!.contentDocument!.documentElement.scrollWidth).toBeLessThanOrEqual(1024);
  });

  it('el Sidebar permite alcanzar todas las opciones y mantiene accesibles los diálogos nativos', () => {
    const sidebar = elemento<HTMLElement>('app-sidebar'), principal = elemento<HTMLElement>('main');
    for (const boton of Array.from(sidebar.querySelectorAll<HTMLButtonElement>('button.modulo'))) if (boton.getAttribute('aria-expanded') !== 'true') boton.click();
    fixture.detectChanges();
    expect(getComputedStyle(sidebar).overflowY).toBe('auto');
    if (sidebar.scrollHeight > sidebar.clientHeight) { sidebar.scrollTop = 150; expect(sidebar.scrollTop).toBeGreaterThan(0); }
    expect(principal.scrollTop).toBe(0);
    const dialogo = document.createElement('dialog'); dialogo.textContent = 'Verificación modal'; principal.append(dialogo); dialogo.showModal();
    expect(dialogo.matches(':modal')).toBeTrue(); expect(dialogo.getBoundingClientRect().height).toBeGreaterThan(0);
    dialogo.close(); dialogo.remove();
  });

  it('ajusta el alto disponible si cambia el alto real del Header', async () => {
    const header = elemento<HTMLElement>('app-header'); header.querySelector<HTMLElement>('header')!.style.minHeight = '96px';
    await esperarFrame();
    const altura = header.getBoundingClientRect().height;
    expect(altura).toBeGreaterThanOrEqual(96);
    expect(parseFloat((fixture.nativeElement as HTMLElement).style.getPropertyValue('--alto-header-real'))).toBe(altura);
    expect(elemento<HTMLElement>('app-sidebar').getBoundingClientRect().top).toBe(altura);
    expect(elemento<HTMLElement>('main').getBoundingClientRect().top).toBe(altura);
  });

  it('conserva el cajón móvil debajo del Header sin desbordamiento horizontal', async () => {
    marco!.style.width = '375px'; marco!.style.height = '640px';
    const doc = marco!.contentDocument!; await esperarFrame();
    const sidebar = elemento<HTMLElement>('app-sidebar'), header = elemento<HTMLElement>('app-header');
    expect(fixture.nativeElement.querySelectorAll('.menu-toggle').length).toBe(1);
    expect(fixture.nativeElement.querySelector('app-sidebar .cerrar-menu')).toBeNull();
    elemento<HTMLButtonElement>('.menu-toggle').click(); await esperarFrame();
    expect(sidebar.matches(':popover-open')).toBeTrue();
    expect(sidebar.getBoundingClientRect().top).toBe(header.getBoundingClientRect().bottom);
    expect(sidebar.getBoundingClientRect().bottom).toBeLessThanOrEqual(640);
    expect(doc.documentElement.scrollWidth).toBeLessThanOrEqual(375);
    elemento<HTMLButtonElement>('.menu-toggle').click(); await esperarFrame();
    expect(sidebar.matches(':popover-open')).toBeFalse();
  });
});
