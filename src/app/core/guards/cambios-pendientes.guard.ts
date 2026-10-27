import { CanDeactivateFn } from '@angular/router';
import { Observable } from 'rxjs';

/** Pantalla con cambios que se perderían al salir (p. ej., la matriz de accesos). */
export interface ConCambiosPendientes {
  /** true si se puede salir; con cambios, la pantalla pregunta y responde según la persona. */
  confirmarSalida(): boolean | Promise<boolean> | Observable<boolean>;
}

/** Pide confirmación antes de abandonar una pantalla con cambios sin guardar. */
export const cambiosPendientesGuard: CanDeactivateFn<ConCambiosPendientes> = componente =>
  componente.confirmarSalida();
