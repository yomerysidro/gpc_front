import { TestBed } from '@angular/core/testing';
import { OrigenesTabsComponent } from './origenes-tabs.component';

describe('Pestañas compactas de orígenes', () => {
  it('distingue tres orígenes y permite seleccionar con teclado', () => {
    const f = TestBed.createComponent(OrigenesTabsComponent); const cambios: string[] = [];
    f.componentInstance.seleccion.subscribe(id => cambios.push(id)); f.detectChanges();
    expect(f.nativeElement.querySelectorAll('[role=tab]').length).toBe(3);
    const nav: HTMLElement = f.nativeElement.querySelector('nav'); nav.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(cambios).toEqual(['reconocimiento']); f.componentRef.setInput('actual', 'reconocimiento'); f.detectChanges();
    expect(f.nativeElement.querySelector('#origen-tab-reconocimiento').getAttribute('aria-selected')).toBe('true');
    nav.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true })); expect(cambios[1]).toBe('practica');
  });
  it('bloquea cambios de teclado durante una operación documental', () => {
    const f = TestBed.createComponent(OrigenesTabsComponent); const cambio = jasmine.createSpy(); f.componentInstance.seleccion.subscribe(cambio);
    f.componentRef.setInput('bloqueado', true); f.detectChanges();
    f.nativeElement.querySelector('nav').dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    expect(cambio).not.toHaveBeenCalled(); expect(f.nativeElement.querySelectorAll('button:disabled').length).toBe(3);
  });
});
