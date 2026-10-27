import { Component, input, viewChild } from '@angular/core';

let siguienteId = 0;
import { DialogoComponent } from '../dialogo/dialogo.component';

/**
 * Confirmación de una acción sobre un registro: `await confirmacion.abrir()` resuelve
 * true solo si se pulsa el botón de confirmar; Cancelar y Esc resuelven false.
 */
@Component({
  selector: 'app-dialogo-confirmacion',
  standalone: true,
  imports: [DialogoComponent],
  templateUrl: './dialogo-confirmacion.component.html',
  styleUrl: './dialogo-confirmacion.component.scss'
})
export class DialogoConfirmacionComponent {
  readonly titulo = input.required<string>();
  readonly texto = input.required<string>();
  readonly confirmar = input('Confirmar');
  readonly cancelar = input('Cancelar');

  protected readonly idTexto = `confirmacion-texto-${++siguienteId}`;
  private readonly dialogo = viewChild.required(DialogoComponent);
  private resolver: ((respuesta: boolean) => void) | null = null;

  abrir(): Promise<boolean> {
    this.resolver?.(false);
    this.dialogo().abrir();
    return new Promise(resolve => this.resolver = resolve);
  }

  protected responder(respuesta: boolean): void {
    const resolver = this.resolver;
    this.resolver = null;
    this.dialogo().cerrar();
    resolver?.(respuesta);
  }

  /** Esc o cierre externo cuentan como cancelar. */
  protected alCerrar(): void {
    const resolver = this.resolver;
    this.resolver = null;
    resolver?.(false);
  }
}
