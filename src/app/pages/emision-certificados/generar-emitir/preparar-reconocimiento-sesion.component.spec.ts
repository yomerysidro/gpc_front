import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { EmisionCertificadosService } from '../../../core/services/emision-certificados/emision-certificados.service';
import { PrepararReconocimientoSesionComponent } from './preparar-reconocimiento-sesion.component';
import { ponentesSesionPrueba } from '../../../core/interfaces/emision-certificados/origenes-certificado.fixture';

describe('Página completa del reconocimiento por sesión', () => {
  let api: jasmine.SpyObj<EmisionCertificadosService>;
  const ruta = (sesion = 15, ponente = 71, query = '?id_actividad=7&id_sesion=15&id_actividad_ponente=71&modalidad=sesion&origen=ponente_sesion') =>
    `/reconocimientos/sesion/${sesion}/ponentes/${ponente}${query}`;
  beforeEach(() => {
    api = jasmine.createSpyObj('EmisionCertificadosService', ['ponentesCertificacion', 'ponentesActividad']);
    api.ponentesCertificacion.and.returnValue(of(ponentesSesionPrueba()));
    TestBed.configureTestingModule({ providers: [
      provideRouter([{ path: 'reconocimientos/sesion/:sesionId/ponentes/:ponenteId', component: PrepararReconocimientoSesionComponent }]),
      provideHttpClient(), provideHttpClientTesting(),
      { provide: EmisionCertificadosService, useValue: api },
      { provide: AuthService, useValue: { tienePermiso: () => true } },
    ] });
  });
  async function iniciar(url = ruta()) {
    const harness = await RouterTestingHarness.create(url); harness.detectChanges();
    return harness;
  }
  it('carga el vínculo real de la sesión y muestra beneficiario, actividad, sesión y fecha', async () => {
    const harness = await iniciar(); const vista = harness.routeNativeElement!;
    expect(api.ponentesCertificacion).toHaveBeenCalledWith(15);
    expect(vista.querySelector('app-preparacion-origen')).not.toBeNull();
    expect(vista.textContent).toContain('Maria Perez');
    expect(vista.textContent).toContain('Capacitación Personal');
    expect(vista.textContent).toContain('Información');
    expect(vista.querySelectorAll('.pasos-reconocimiento li').length).toBe(4);
    expect(vista.textContent).toContain('Sesión N.º 001');
    expect(vista.textContent).toContain('10/02/2026');
    expect(vista.querySelector('textarea')).toBeNull();
  });
  it('conserva el contexto de sesión al volver a Generar y emitir', async () => {
    const harness = await iniciar(); const volver = harness.routeNativeElement!.querySelector('.titulo-asistente a')!;
    const href = volver.getAttribute('href')!;
    expect(href).toContain('id_sesion=15'); expect(href).toContain('modalidad=sesion');
    expect(href).toContain('origen=ponente_sesion'); expect(href).not.toContain('participacion');
    expect(href).toContain('id_actividad=7'); expect(href).toContain('id_tipo_certificado=47');
    expect(volver.querySelector('.material-symbols-outlined')!.textContent).toBe('arrow_back');
  });
  it('corrige una URL anterior después de acreditar el vínculo real, sin usar participación', async () => {
    const harness = await iniciar(ruta(15, 71, '?id_actividad=7&id_sesion=15&modalidad=sesion&origen=participacion'));
    await harness.fixture.whenStable();
    expect(TestBed.inject(Router).url).toContain('origen=ponente_sesion');
    expect(TestBed.inject(Router).url).toContain('id_actividad_ponente=71');
    expect(TestBed.inject(Router).url).not.toContain('origen=participacion');
  });
  for (const query of ['?id_actividad=9', '?id_persona=99']) {
    it('rechaza contexto de URL ajeno al beneficiario acreditado: ' + query, async () => {
      const harness = await iniciar(ruta(15, 71, query));
      expect(harness.routeNativeElement!.querySelector('app-preparacion-origen')).toBeNull();
      expect(harness.routeNativeElement!.textContent).toContain('No se encontró');
    });
  }
  for (const query of ['?id_participacion=71', '?id_actividad_ponente=99', '?id_sesion=16', '?origen=practica']) {
    it('rechaza identificadores o modalidades incompatibles: ' + query, async () => {
      const harness = await iniciar(ruta(15, 71, query));
      expect(harness.routeNativeElement!.querySelector('app-preparacion-origen')).toBeNull();
      expect(api.ponentesCertificacion).not.toHaveBeenCalled();
    });
  }
  it('rechaza otra persona o registro de ponente aunque coincidan actividad y sesión', async () => {
    const datos = ponentesSesionPrueba(); datos.ponentes_sesion![0].reconocimiento.id_persona_ponente = 99;
    api.ponentesCertificacion.and.returnValue(of(datos));
    const harness = await iniciar();
    expect(harness.routeNativeElement!.querySelector('app-preparacion-origen')).toBeNull();
  });
  it('rechaza una evaluación de otra sesión antes de mostrar el asistente', async () => {
    const datos = ponentesSesionPrueba(); (datos.ponentes_sesion![0].reconocimiento as any).id_sesion = 16;
    api.ponentesCertificacion.and.returnValue(of(datos));
    const harness = await iniciar(); const vista = harness.routeNativeElement!;
    expect(vista.textContent).toContain('No se encontró el reconocimiento en esta sesión.');
    expect(vista.querySelector('app-preparacion-origen')).toBeNull();
    expect(vista.textContent).not.toContain('Maria Perez');
  });
  it('rechaza un vínculo de otra actividad', async () => {
    const datos = ponentesSesionPrueba(); (datos.ponentes_sesion![0].reconocimiento as any).id_actividad = 9;
    api.ponentesCertificacion.and.returnValue(of(datos));
    const harness = await iniciar();
    expect(harness.routeNativeElement!.textContent).toContain('No se encontró el reconocimiento en esta sesión.');
  });
  it('rechaza identificadores inválidos sin consultar', async () => {
    const harness = await iniciar(ruta(0, 71));
    expect(harness.routeNativeElement!.textContent).toContain('El reconocimiento solicitado no es válido.');
    expect(api.ponentesCertificacion).not.toHaveBeenCalled();
  });
  it('conserva el motivo real cuando el servidor no acredita la sesión', async () => {
    api.ponentesCertificacion.and.returnValue(throwError(() => ({ status: 409,
      mensaje: 'La sesión debe estar Finalizada y tener fecha real no futura.', errores: {} })));
    const harness = await iniciar();
    expect(harness.routeNativeElement!.textContent).toContain('La sesión debe estar Finalizada y tener fecha real no futura.');
    expect(harness.routeNativeElement!.querySelector('app-preparacion-origen')).toBeNull();
  });
});
