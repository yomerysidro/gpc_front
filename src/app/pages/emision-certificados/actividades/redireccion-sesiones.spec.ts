import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, convertToParamMap, provideRouter, Router } from '@angular/router';
import { firstValueFrom, isObservable, of, throwError } from 'rxjs';
import { EmisionCertificadosService } from '../../../core/services/emision-certificados/emision-certificados.service';
import { redirigirSesionesAnteriores } from '../emision-certificados.routes';

describe('Compatibilidad de rutas de sesiones', () => {
  let api: jasmine.SpyObj<EmisionCertificadosService>;
  beforeEach(() => {
    api = jasmine.createSpyObj('api', ['obtener']);
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: EmisionCertificadosService, useValue: api }] });
  });
  async function destino(params: Record<string, string>) {
    const route = { queryParams: params, queryParamMap: convertToParamMap(params) } as ActivatedRouteSnapshot;
    const resultado = TestBed.runInInjectionContext(() => redirigirSesionesAnteriores(route));
    return TestBed.inject(Router).serializeUrl(isObservable(resultado) ? await firstValueFrom(resultado) : resultado);
  }
  it('abre actividades sin mostrar la pantalla retirada', async () => {
    expect(await destino({})).toBe('/certificaciones/actividades'); expect(api.obtener).not.toHaveBeenCalled();
  });
  it('conserva actividad y parametros recibidos', async () => {
    expect(await destino({ actividad_filtro: '7', pagina: '2' })).toBe('/certificaciones/actividades?actividad_filtro=7&pagina=2&id_actividad=7');
  });
  it('abre asistencia de la sesion exacta', async () => {
    expect(await destino({ id_actividad: '7', id_sesion: '15' })).toBe('/certificaciones/actividades/7/sesiones/15/asistencia?id_actividad=7&id_sesion=15');
  });
  it('resuelve la actividad cuando solo existe una sesion', async () => {
    api.obtener.and.returnValue(of({ id_actividad: 7, id_actividad_sesion: 15 }));
    expect(await destino({ id_sesion: '15' })).toContain('/actividades/7/sesiones/15/asistencia');
    expect(api.obtener).toHaveBeenCalledWith('activity-session', 15);
  });
  it('no inventa una actividad ante una consulta denegada', async () => {
    api.obtener.and.returnValue(throwError(() => ({ status: 403 })));
    expect(await destino({ id_sesion: '15' })).toBe('/certificaciones/actividades?id_sesion=15');
  });
});
