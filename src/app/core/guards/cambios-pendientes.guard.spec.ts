import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { cambiosPendientesGuard, ConCambiosPendientes } from './cambios-pendientes.guard';

describe('cambiosPendientesGuard', () => {
  const ejecutar = (componente: ConCambiosPendientes) => TestBed.runInInjectionContext(() => cambiosPendientesGuard(
    componente, {} as ActivatedRouteSnapshot, {} as RouterStateSnapshot, {} as RouterStateSnapshot));

  it('delega en la pantalla la confirmación de salida', async () => {
    expect(ejecutar({ confirmarSalida: () => true })).toBeTrue();
    expect(await ejecutar({ confirmarSalida: () => Promise.resolve(false) })).toBeFalse();
  });
});
