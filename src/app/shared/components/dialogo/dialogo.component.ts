import { afterNextRender, Component, ElementRef, inject, Injector, input, output, viewChild } from '@angular/core';

let siguienteId = 0;

/**
 * <dialog> nativo modal con título (patrón .dialogo de DESIGN.md) y contenido proyectado.
 * abrir() espera a que el contenido esté pintado: el foco y el lector de pantalla
 * encuentran el texto correcto. El navegador devuelve el foco al cerrar.
 */
@Component({
  selector: 'app-dialogo',
  standalone: true,
  imports: [],
  templateUrl: './dialogo.component.html',
  styleUrl: './dialogo.component.scss'
})
export class DialogoComponent {
  readonly titulo = input.required<string>();
  /** id del texto que describe el diálogo (aria-describedby), si lo hay. */
  readonly idDescripcion = input<string | null>(null);
  /** Se emite al cerrarse por cualquier vía (botón, Esc). */
  readonly cerrado = output<void>();

  protected readonly idTitulo = `dialogo-titulo-${++siguienteId}`;
  private readonly dialogo = viewChild.required<ElementRef<HTMLDialogElement>>('dialogo');
  private readonly injector = inject(Injector);

  abrir(): void {
    afterNextRender(() => {
      const dialogo = this.dialogo().nativeElement;

      if (!dialogo.open) dialogo.showModal();
    }, { injector: this.injector });
  }

  cerrar(): void {
    this.dialogo().nativeElement.close();
  }
}
