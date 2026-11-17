import { Component, input } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, Params, convertToParamMap, provideRouter } from '@angular/router';
import { NEVER, of, throwError } from 'rxjs';
import { PrepararReconocimientoComponent } from './preparar-reconocimiento.component';
import { PreparacionOrigenComponent } from './preparacion-origen.component';
import { ponenteActividadPrueba } from '../../../core/interfaces/emision-certificados/origenes-certificado.fixture';
import { EvaluacionPonenteActividad } from '../../../core/interfaces/emision-certificados/origenes-certificado.interface';
import { EmisionCertificadosService } from '../../../core/services/emision-certificados/emision-certificados.service';

@Component({ selector: 'app-preparacion-origen', standalone: true, template: '{{ ponente()?.nombres }} · {{ ponente()?.actividad }}' })
class FormularioPrueba {
  readonly origen = input(''); readonly ponente = input<EvaluacionPonenteActividad>();
  readonly asistente = input(false); readonly retorno = input<Params>({});
}
describe('Página independiente de reconocimiento por actividad', () => {
  let api: jasmine.SpyObj<EmisionCertificadosService>;
  let snapshot: { paramMap: ReturnType<typeof convertToParamMap>; queryParamMap: ReturnType<typeof convertToParamMap> };
  beforeEach(() => {
    api = jasmine.createSpyObj('api', ['ponentesActividad']); api.ponentesActividad.and.returnValue(of(ponenteActividadPrueba()));
    snapshot = { paramMap: convertToParamMap({ actividadId: '7', ponenteId: '71' }), queryParamMap: convertToParamMap({}) };
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: EmisionCertificadosService, useValue: api },
      { provide: ActivatedRoute, useValue: { snapshot, paramMap: of(snapshot.paramMap) } }] })
      .overrideComponent(PrepararReconocimientoComponent, { remove: { imports: [PreparacionOrigenComponent] }, add: { imports: [FormularioPrueba] } });
  });
  function iniciar() { const f = TestBed.createComponent(PrepararReconocimientoComponent); f.detectChanges(); return f; }
  it('consulta el ID de asociación real al cargar y al recargar, sin operaciones de escritura', () => {
    let f = iniciar(); expect(api.ponentesActividad).toHaveBeenCalledWith(7);
    expect(f.nativeElement.textContent).toContain('Maria'); expect(f.nativeElement.textContent).toContain('Capacitación Personal');
    expect((f.componentInstance as any).evaluacion().id_origen).toBe(71);
    expect((f.componentInstance as any).evaluacion().id_sesion).toBeNull();
    f.destroy(); f = iniciar(); expect(api.ponentesActividad).toHaveBeenCalledTimes(2);
  });
  it('preserva actividad y pestaña al volver al listado general', () => {
    const f = iniciar(); expect((f.componentInstance as any).retorno).toEqual({ origen_documental: 'reconocimiento', actividad_reconocimiento: 7 });
  });
  it('conserva la sesión exclusivamente como contexto de regreso', () => {
    snapshot.queryParamMap = convertToParamMap({ id_actividad: '7', id_sesion: '15', modalidad: 'sesion' });
    const f = iniciar(); expect((f.componentInstance as any).retorno).toEqual({ origen: 'participacion', modalidad: 'sesion', id_actividad: 7, id_sesion: '15' });
    expect((f.componentInstance as any).evaluacion().id_sesion).toBeNull();
    expect(api.ponentesActividad).toHaveBeenCalledOnceWith(7);
  });
  it('rechaza un contexto de retorno de otra actividad y nunca permite destinos externos', () => {
    snapshot.queryParamMap = convertToParamMap({ id_actividad: '8', id_sesion: '15', modalidad: 'sesion', returnUrl: 'https://example.com' });
    expect((iniciar().componentInstance as any).retorno).toEqual({ origen_documental: 'reconocimiento', actividad_reconocimiento: 7 });
  });
  it('no utiliza el nombre para suplir una asociación inexistente', () => {
    snapshot.paramMap = convertToParamMap({ actividadId: '7', ponenteId: '999' }); const f = iniciar();
    expect(f.nativeElement.querySelector('app-preparacion-origen')).toBeNull();
    expect(f.nativeElement.textContent).toContain('No se encontró el reconocimiento');
  });
  it('rechaza identificadores inválidos sin consultar', () => {
    snapshot.paramMap = convertToParamMap({ actividadId: '0', ponenteId: 'Maria' }); const f = iniciar();
    expect(api.ponentesActividad).not.toHaveBeenCalled(); expect(f.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
  });
  it('no transforma una autorización de sesión en reconocimiento por actividad', () => {
    const d = ponenteActividadPrueba(); (d.ponentes[0].reconocimiento as any).modalidad_reconocimiento = 'sesion';
    api.ponentesActividad.and.returnValue(of(d)); const f = iniciar();
    expect(f.nativeElement.querySelector('app-preparacion-origen')).toBeNull();
  });
  it('termina la carga ante timeout y ofrece consultar el estado', fakeAsync(() => {
    api.ponentesActividad.and.returnValue(NEVER); const f = iniciar(); tick(30001); f.detectChanges();
    expect((f.componentInstance as any).cargando()).toBeFalse();
    expect(f.nativeElement.querySelector('[role="alert"]')).not.toBeNull(); expect(f.nativeElement.textContent).toContain('Actualizar estado');
  }));
  for (const status of [401, 403, 404, 409, 422]) {
    it('respeta HTTP ' + status + ' y termina la carga sin crear un formulario autorizado', () => {
      api.ponentesActividad.and.returnValue(throwError(() => ({ status, mensaje: 'Falta acreditación real', errores: {} })));
      const f = iniciar(); expect((f.componentInstance as any).cargando()).toBeFalse();
      expect(f.nativeElement.querySelector('app-preparacion-origen')).toBeNull(); expect(f.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
      if (status === 409) expect(f.nativeElement.textContent).toContain('Falta acreditación real');
    });
  }
});
