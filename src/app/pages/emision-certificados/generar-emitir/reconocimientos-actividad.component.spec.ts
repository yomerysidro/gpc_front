import { Router, provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { NEVER, of, throwError } from 'rxjs';
import { ReconocimientosActividadComponent } from './reconocimientos-actividad.component';
import { ponenteActividadPrueba } from '../../../core/interfaces/emision-certificados/origenes-certificado.fixture';
import { EmisionCertificadosService } from '../../../core/services/emision-certificados/emision-certificados.service';
import { AuthService } from '../../../core/services/autenticacion/auth.service';

describe('Tabla de reconocimientos por actividad', () => {
  let api: jasmine.SpyObj<EmisionCertificadosService>; let navegar: jasmine.Spy;
  beforeEach(() => {
    api = jasmine.createSpyObj('api', ['listarTodos', 'ponentesActividad']); api.listarTodos.and.returnValue(of([{ id_actividad: 7, nombre: 'Capacitación Personal' }]));
    api.ponentesActividad.and.returnValue(of(ponenteActividadPrueba()));
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: EmisionCertificadosService, useValue: api }, { provide: AuthService, useValue: { tienePermiso: () => true } }] });
    navegar = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
  });
  function iniciar() { const f = TestBed.createComponent(ReconocimientosActividadComponent); f.detectChanges(); (f.componentInstance as any).cargarActividad(7); f.detectChanges(); return f; }
  it('limpia la carga al sustituir una consulta pendiente por candidatos autorizados de actividad', () => {
    api.listarTodos.and.returnValue(NEVER);
    const f = TestBed.createComponent(ReconocimientosActividadComponent); f.detectChanges();
    expect((f.componentInstance as any).cargando()).toBeTrue();
    f.componentRef.setInput('actividadId', 7);
    f.componentRef.setInput('candidatos', ponenteActividadPrueba().ponentes); f.detectChanges();
    expect((f.componentInstance as any).cargando()).toBeFalse();
    expect(f.nativeElement.querySelector('tbody button').disabled).toBeFalse();
  });
  it('muestra Maria Perez elegible por actividad y permite preparar solo después de consultar', () => {
    const f = iniciar(); expect(api.ponentesActividad).toHaveBeenCalledWith(7);
    expect(f.nativeElement.textContent).toContain('Maria Perez'); expect(f.nativeElement.textContent).toContain('Capacitación Personal');
    expect(f.nativeElement.textContent).toContain('Reconocimiento por actividad'); expect(f.nativeElement.textContent).not.toContain('no está vinculado a esta sesión');
    const boton: HTMLButtonElement = f.nativeElement.querySelector('tbody button'); expect(boton.disabled).toBeFalse(); boton.click(); f.detectChanges();
    expect(api.ponentesActividad).toHaveBeenCalledTimes(2);
    expect(navegar).toHaveBeenCalledWith(['/certificaciones/generar-emitir/reconocimientos/actividad', 7, 'ponentes', 71],
      { queryParams: { origen_documental: 'reconocimiento', actividad_reconocimiento: 7 } });
    expect(f.nativeElement.querySelector('app-preparacion-origen')).toBeNull();
    expect(f.nativeElement.querySelector('tbody')).not.toBeNull();
  });
  it('respeta una facultad de preparación falsa aunque la persona sea elegible', () => {
    const d = ponenteActividadPrueba(); d.ponentes[0].reconocimiento.puede_preparar = false;
    d.ponentes[0].reconocimiento.motivos_bloqueo = ['Falta autorización para preparar']; api.ponentesActividad.and.returnValue(of(d));
    const f = iniciar(); expect(f.nativeElement.querySelector('tbody button').disabled).toBeTrue(); expect(f.nativeElement.textContent).toContain('Falta autorización para preparar');
  });
  it('no convierte una evaluación de sesión en autorización por actividad', () => {
    const d = ponenteActividadPrueba(); (d.ponentes[0].reconocimiento as any).modalidad_reconocimiento = 'sesion';
    api.ponentesActividad.and.returnValue(of(d)); const f = iniciar(); expect(f.nativeElement.querySelector('tbody button').disabled).toBeTrue();
  });
  it('vuelve a consultar antes de continuar y respeta una autorización retirada', () => {
    const f = iniciar(); const d = ponenteActividadPrueba(); d.ponentes[0].reconocimiento.puede_preparar = false;
    api.ponentesActividad.and.returnValue(of(d)); f.nativeElement.querySelector('tbody button').click(); f.detectChanges();
    expect(navegar).not.toHaveBeenCalled(); expect(f.nativeElement.querySelector('tbody button').disabled).toBeTrue();
  });
  it('ofrece Ver reconocimiento para una preparación existente, sin crear otra raíz', () => {
    const d = ponenteActividadPrueba(); Object.assign(d.ponentes[0].reconocimiento, { puede_preparar: false, puede_consultar_certificado_existente: true,
      certificados_existentes: [{ id_certificado: 151, id_persona: 31, id_tipo_certificado: 47, id_reconocimiento: 81, id_practica: null, estado: 'PREPARADO' }] });
    api.ponentesActividad.and.returnValue(of(d)); const f = iniciar(); expect(f.nativeElement.querySelector('tbody button').textContent).toBe('Ver reconocimiento');
    f.nativeElement.querySelector('tbody button').click(); f.detectChanges(); expect(navegar).toHaveBeenCalled();
    expect(f.nativeElement.querySelector('app-preparacion-origen')).toBeNull();
  });
  for (const status of [401, 403, 404, 409, 422]) {
    it('termina la carga ante HTTP ' + status + ' sin un mensaje de procesamiento infinito', () => {
      api.ponentesActividad.and.returnValue(throwError(() => ({ status, mensaje: 'Rechazado', errores: {} })));
      const f = iniciar(); expect((f.componentInstance as any).cargando()).toBeFalse(); expect(f.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
    });
  }
});
