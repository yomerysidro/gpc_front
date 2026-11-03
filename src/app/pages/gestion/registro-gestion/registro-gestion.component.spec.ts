import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { GestionEntidad, GestionRegistro } from '../../../core/services/gestion/gestion.models';
import { GestionService } from '../../../core/services/gestion/gestion.service';
import { DialogoConfirmacionComponent } from '../../../shared/components/dialogo-confirmacion/dialogo-confirmacion.component';
import { By } from '@angular/platform-browser';
import { RegistroGestionComponent } from './registro-gestion.component';

describe('RegistroGestionComponent', () => {
  let fixture: ComponentFixture<RegistroGestionComponent>;
  let api: jasmine.SpyObj<GestionService>;
  let permiso: boolean;
  const datos: Partial<Record<GestionEntidad, GestionRegistro[]>> = {
    persona_trabajador: [{ id_persona_trabajador: 7, id_persona: 3, id_area: 4, cargo: 'Analista', estado: true }],
    persona: [{ id_persona: 3, nombres: 'Ana', apellido_paterno: 'Pérez' }],
    area: [{ id_area: 4, nombre: 'Informática' }],
  };

  beforeEach(async () => {
    permiso = true;
    api = jasmine.createSpyObj<GestionService>('GestionService', ['listar', 'obtener', 'crear', 'actualizar', 'eliminar']);
    api.listar.and.callFake(entidad => of(datos[entidad] ?? []));
    api.crear.and.returnValue(of({ success: true, message: 'Guardado', data: {} }));
    await TestBed.configureTestingModule({
      imports: [RegistroGestionComponent],
      providers: [{ provide: GestionService, useValue: api },
        { provide: AuthService, useValue: { tienePermiso: () => permiso } }],
    }).compileComponents();
    fixture = TestBed.createComponent(RegistroGestionComponent);
    fixture.componentRef.setInput('entidad', 'persona_trabajador');
    fixture.detectChanges();
    fixture.componentInstance['recargar']();
    fixture.detectChanges();
  });

  it('muestra los nombres relacionados y no oculta trabajadores si el catálogo falla', () => {
    const component = fixture.componentInstance;
    expect(fixture.nativeElement.textContent).toContain('Ana Pérez');
    expect(fixture.nativeElement.textContent).toContain('Informática');
    api.listar.and.callFake(entidad => entidad === 'persona'
      ? throwError(() => ({ status: 403, mensaje: 'No autorizado', campos: {} })) : of(datos[entidad] ?? []));
    component['recargar']();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Analista');
    expect(fixture.nativeElement.textContent).toContain('datos no disponibles');
    expect(fixture.nativeElement.textContent).toContain('sin configurar');
    expect(component['relacionesRequeridasIncompletas']()).toBeTrue();
  });

  it('valida el rango de fechas antes de escribir y envía el estado inactivo como false', () => {
    const component = fixture.componentInstance;
    component['nuevo']();
    component['formulario'].patchValue({ id_persona: 3, id_area: 4, cargo: ' Analista ',
      fecha_ingreso: '2026-10-20', fecha_fin: '2026-10-01', estado: false });
    component['guardar']();
    expect(api.crear).not.toHaveBeenCalled();
    expect(component['formulario'].hasError('fechas')).toBeTrue();
    component['formulario'].patchValue({ fecha_fin: '' });
    component['guardar']();
    expect(api.crear).toHaveBeenCalledWith('persona_trabajador', {
      id_persona: 3, id_area: 4, cargo: 'Analista', fecha_ingreso: '2026-10-20', fecha_fin: null, estado: false,
    });
  });

  it('compone documentos con datos relacionados sin agregar personas ficticias', () => {
    api.listar.and.callFake(entidad => of(entidad === 'persona_documento'
      ? [{ id_persona_documento: 1, id_persona: 3, id_tipo_documento: 2, numero_documento: '12345678', estado: 'vigente' }]
      : entidad === 'tipo_documento' ? [{ id_tipo_documento: 2, nombre: 'DNI', estado: true }] : datos[entidad] ?? []));
    const personasFixture = TestBed.createComponent(RegistroGestionComponent);
    personasFixture.componentRef.setInput('entidad', 'persona');
    personasFixture.detectChanges();
    personasFixture.componentInstance['recargar']();
    personasFixture.detectChanges();
    expect(personasFixture.nativeElement.textContent).toContain('Ana Pérez');
    expect(personasFixture.nativeElement.textContent).toContain('DNI 12345678');
    expect(personasFixture.componentInstance['registros']().length).toBe(1);
    expect(personasFixture.componentInstance['permitido']('crear')).toBeFalse();
    personasFixture.destroy();
  });

  it('no elimina si se cancela la confirmación', async () => {
    const confirmacion = fixture.debugElement.query(By.directive(DialogoConfirmacionComponent)).componentInstance as DialogoConfirmacionComponent;
    spyOn(confirmacion, 'abrir').and.resolveTo(false);
    await fixture.componentInstance['pedirEliminar'](datos.persona_trabajador![0]);
    expect(api.eliminar).not.toHaveBeenCalled();
  });

  it('no guarda un formulario si falla la carga del detalle', () => {
    api.obtener.and.returnValue(throwError(() => ({ status: 404, mensaje: 'Registro no encontrado.', campos: {} })));
    fixture.componentInstance['abrir'](datos.persona_trabajador![0], 'editar');
    fixture.componentInstance['guardar']();
    expect(api.actualizar).not.toHaveBeenCalled();
    expect(fixture.componentInstance['errorFormulario']()).toContain('no encontrado');
  });

  it('oculta las acciones de escritura cuando el rol no tiene permisos', () => {
    permiso = false;
    fixture.detectChanges();
    const textos = Array.from(fixture.nativeElement.querySelectorAll('section button') as NodeListOf<HTMLButtonElement>, boton => boton.textContent?.trim());
    expect(textos).not.toContain('Editar');
    expect(textos).not.toContain('Eliminar');
    expect(fixture.componentInstance['permitido']('crear')).toBeFalse();
  });
});
