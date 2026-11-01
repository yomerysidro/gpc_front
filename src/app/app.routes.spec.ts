import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { firstValueFrom, isObservable, of } from 'rxjs';
import { routes } from './app.routes';
import { authGuard } from './core/guards/auth.guard';
import { permissionGuard } from './core/guards/permission.guard';
import { AuthService } from './core/services/autenticacion/auth.service';

describe('Autorización de las rutas de Gestión', () => {
  async function evaluar(url: string, permisos: string[]) {
    TestBed.configureTestingModule({ providers: [provideRouter([]), {
      provide: AuthService, useValue: { cargarSesion: () => of(true), tienePermiso: (p: string) => permisos.includes(p) },
    }] });
    const resultado = TestBed.runInInjectionContext(() => permissionGuard(
      { data: { permiso: 'personas.verpersonas' } } as unknown as ActivatedRouteSnapshot, { url } as RouterStateSnapshot));
    return isObservable(resultado) ? firstValueFrom(resultado) : resultado;
  }
  it('permite Documentos con personas.verpersonas', async () => {
    expect(await evaluar('/gestion/personas?pestana=documentos', ['personas.verpersonas'])).toBeTrue();
  });
  it('rechaza Documentos si solo existe la clave anterior personas.ver', async () => {
    const resultado = await evaluar('/gestion/personas?pestana=documentos', ['personas.ver']);
    expect(TestBed.inject(Router).serializeUrl(resultado as UrlTree)).toBe('/acceso-denegado');
  });
  it('permite Personas con la misma clave de lectura', async () => {
    expect(await evaluar('/gestion/personas', ['personas.verpersonas'])).toBeTrue();
  });
  it('Personas requiere personas.verpersonas', async () => {
    const resultado = await evaluar('/gestion/personas', ['personas.ver']);
    expect(TestBed.inject(Router).serializeUrl(resultado as UrlTree)).toBe('/acceso-denegado');
  });
  it('conserva guards y reevalúa al cambiar la pestaña', () => {
    const privada = routes.find(r => r.canActivate?.includes(authGuard))!;
    const gestion = privada.children!.find(r => r.path === 'gestion')!;
    const personas = gestion.children!.find(r => r.path === 'personas')!;
    expect(personas.canActivate).toEqual([permissionGuard]);
    expect(personas.runGuardsAndResolvers).toBe('paramsOrQueryParamsChange');
    for (const path of ['trabajadores', 'practicas', 'ponentes']) {
      expect(gestion.children!.find(r => r.path === path)?.canActivate).toEqual([permissionGuard]);
    }
    expect(gestion.children!.find(r => r.path === 'practicantes')?.redirectTo).toBe('/gestion/practicas?pestana=practicantes');
  });
});
