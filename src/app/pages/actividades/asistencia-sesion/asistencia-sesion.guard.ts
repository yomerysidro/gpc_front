import { CanDeactivateFn } from '@angular/router';
import type { AsistenciaSesionComponent } from './asistencia-sesion.component';

export const salirDeAsistencia: CanDeactivateFn<AsistenciaSesionComponent> = componente => componente.puedeSalir();
