import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../../../core/services/autenticacion/auth.service';
import { EmisionCertificadosService } from '../../../../core/services/emision-certificados/emision-certificados.service';
import { FormularioCertificadoComponent } from './formulario-certificado.component';

describe('FormularioCertificadoComponent', () => {
  let fixture: ComponentFixture<FormularioCertificadoComponent>;
  let api: jasmine.SpyObj<EmisionCertificadosService>;

  beforeEach(() => {
    api = jasmine.createSpyObj('EmisionCertificadosService', ['listar', 'listarTodos', 'personaReconocimiento', 'relacionRegistros', 'crear']);
    api.listar.and.callFake(((recurso: string) => of(recurso === 'tipos-certificado'
      ? { data: [{ id_tipo_certificado: 2, nombre_tipo: 'Participación', estado: 'ACTIVO' }], current_page: 1, last_page: 1, per_page: 100, total: 1 }
      : { data: [], current_page: 1, last_page: 1, per_page: 100, total: 0 })) as never);
    api.listarTodos.and.callFake(((recurso: string) => of(recurso === 'tipos-certificado' ? [{ id_tipo_certificado: 2, nombre_tipo: 'Participaci?n', estado: true }] : [])) as never);
    api.personaReconocimiento.and.returnValue(of({ id_persona: 7, nombres: 'Beneficiario', apellido_paterno: 'Registrado', apellido_materno: null }));
    api.relacionRegistros.and.callFake(((ruta: string) => of(ruta === 'participation' ? [{ id_participacion: 11, id_persona: 7, id_actividad: 1, id_tipo_participacion: 1, fecha_inscripcion: '2026-10-27', estado: 'ACTIVO' }]
      : [])) as never);
    api.crear.and.returnValue(of({ id_certificado: 41, id_persona: 7, id_tipo_certificado: 2, id_reconocimiento: null, id_participacion: 11, id_practica: null, fecha_emision: '2026-10-27', estado: true, notificado: false, fecha_notificacion: null }));
    TestBed.configureTestingModule({ imports: [FormularioCertificadoComponent], providers: [
      provideRouter([]), provideHttpClient(),
      { provide: AuthService, useValue: { tienePermiso: () => true, cargarSesion: () => of(true) } },
      { provide: EmisionCertificadosService, useValue: api },
    ] });
    fixture = TestBed.createComponent(FormularioCertificadoComponent);
    fixture.detectChanges();
  });

  it('carga registros autorizados del origen y deriva su beneficiario sin llamar a persons/list', () => {
    fixture.componentInstance.formulario.controls.origen.setValue('participacion');
    fixture.detectChanges();
    expect(api.relacionRegistros).toHaveBeenCalledOnceWith('participation');
    fixture.componentInstance.formulario.controls.registro.setValue(11);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Beneficiario Registrado');
    expect(fixture.nativeElement.querySelector('#registro').options.length).toBe(2);
  });

  it('valida antes de la revisión y registra solo el origen seleccionado y su persona asociada', () => {
    const component = fixture.componentInstance;
    component.formulario.controls.origen.setValue('participacion');
    component.formulario.controls.registro.setValue(11);
    component.formulario.controls.tipo.setValue(2);
    component.formulario.controls.fechaEmision.setValue('2026-10-27');
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Revisa antes de registrar');
    fixture.nativeElement.querySelector('button.btn-primary').click();
    expect(api.crear).toHaveBeenCalledWith('certificados', {
      id_persona: 7, id_tipo_certificado: 2, id_reconocimiento: null, id_participacion: 11,
      id_practica: null, fecha_emision: '2026-10-27', estado: true, notificado: false, fecha_notificacion: null,
    });
  });

  it('no permite avanzar si faltan selecciones requeridas', () => {
    const component = fixture.componentInstance;
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).not.toContain('Revisa antes de registrar');
    expect(api.crear).not.toHaveBeenCalled();
  });
});
