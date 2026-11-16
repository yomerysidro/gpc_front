import { Component, input, output } from '@angular/core';

export type PestanaOrigen = 'capacitacion' | 'reconocimiento' | 'practica';
@Component({
  selector: 'app-origenes-tabs', standalone: true,
  template: `<nav role="tablist" aria-label="Origen del certificado" (keydown)="teclear($event)">
    @for (opcion of opciones; track opcion.id) {
      <button type="button" role="tab" [id]="'origen-tab-' + opcion.id" aria-controls="emision-pendientes"
        [attr.aria-selected]="actual() === opcion.id" [attr.tabindex]="actual() === opcion.id ? 0 : -1"
        [disabled]="bloqueado()" (click)="seleccion.emit(opcion.id)">{{ opcion.nombre }}</button>
    }
  </nav>`,
  styles: `nav{display:flex;gap:.3rem;border-bottom:1px solid #dfe6ef;margin-bottom:1rem;overflow-x:auto}button{border:0;border-bottom:3px solid transparent;background:transparent;padding:.65rem .85rem;color:#526477;cursor:pointer;white-space:nowrap;font:inherit}button[aria-selected=true]{border-color:#075a9b;color:#075a9b;font-weight:600}button:focus-visible{outline:2px solid #075a9b;outline-offset:-2px}button:disabled{opacity:.5;cursor:default}`,
})
export class OrigenesTabsComponent {
  readonly actual = input<PestanaOrigen>('capacitacion');
  readonly bloqueado = input(false);
  readonly seleccion = output<PestanaOrigen>();
  protected readonly opciones = [{ id: 'capacitacion', nombre: 'Capacitación' },
    { id: 'reconocimiento', nombre: 'Reconocimientos' }, { id: 'practica', nombre: 'Prácticas' }] as const;
  protected teclear(evento: KeyboardEvent): void {
    if (this.bloqueado()) return;
    const actual = this.opciones.findIndex(o => o.id === this.actual());
    const destinos: Record<string, number> = { ArrowRight: (actual + 1) % 3, ArrowLeft: (actual + 2) % 3, Home: 0, End: 2 };
    if (destinos[evento.key] === undefined) return;
    evento.preventDefault(); const id = this.opciones[destinos[evento.key]].id; this.seleccion.emit(id);
    (evento.currentTarget as HTMLElement).querySelector<HTMLElement>('#origen-tab-' + id)?.focus();
  }
}
