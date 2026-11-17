import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../../../core/services/autenticacion/auth.service';
import { EmisionCertificadosService } from '../../../../core/services/emision-certificados/emision-certificados.service';
import { DetalleReconocimientoComponent } from './detalle-reconocimiento.component';

describe('Detalle de Reconocimientos con relaciones autorizadas', () => {
  let permisos: Set<string>;
  let api: jasmine.SpyObj<EmisionCertificadosService>;
  beforeEach(() => {
    permisos = new Set(['reconocimientos.ver', 'ponentes-firmantes.ver', 'personas.verpersonas', 'areas.ver', 'tipos-documento.ver', 'emision.ver']);
    api = jasmine.createSpyObj('api', ['obtener', 'trabajadores', 'personaReconocimiento', 'areaReconocimiento', 'documentosIdentidad', 'listarTodos']);
    api.obtener.and.returnValue(of({ id_reconocimiento: 7, id_persona_trabajador: 4, titulo: 'Mérito', descripcion: 'Servicio', motivo: 'Trabajo', fecha_reconocimiento: '2026-10-30', estado: 'Otorgado' } as any));
    api.trabajadores.and.returnValue(of([{ id_persona_trabajador: 4, id_persona: 6, id_area: 2, cargo: 'Analista', estado: true }]));
    api.personaReconocimiento.and.returnValue(of({ id_persona: 6, nombres: 'María', apellido_paterno: 'Pérez', apellido_materno: null }));
    api.areaReconocimiento.and.returnValue(of({ id_area: 2, nombre: 'Administración' }));
    api.documentosIdentidad.and.returnValue(of({ 6: '12345678' }));
    api.listarTodos.and.returnValue(of([]));
    TestBed.configureTestingModule({ providers: [provideRouter([]),
      { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ id: '7' })) } },
      { provide: EmisionCertificadosService, useValue: api },
      { provide: AuthService, useValue: { tienePermiso: (clave: string) => permisos.has(clave) } },
    ] });
  });
  function crear() {
    const fixture = TestBed.createComponent(DetalleReconocimientoComponent);
    fixture.detectChanges(); fixture.detectChanges(); return fixture;
  }
  it('consulta el ID real y presenta identidad, área y ausencia de certificado', () => {
    const fixture = crear();
    expect(api.obtener).toHaveBeenCalledWith('reconocimientos', 7);
    expect(fixture.nativeElement.textContent).toContain('María Pérez');
    expect(fixture.nativeElement.textContent).toContain('12345678');
    expect(fixture.nativeElement.textContent).toContain('Administración');
    expect(fixture.nativeElement.textContent).toContain('Sin certificado asociado');
  });
  it('no consulta identidades ni documentos cuando faltan permisos', () => {
    permisos.delete('personas.verpersonas'); permisos.delete('areas.ver'); permisos.delete('emision.ver');
    const fixture = crear();
    expect(api.personaReconocimiento).not.toHaveBeenCalled(); expect(api.areaReconocimiento).not.toHaveBeenCalled();
    expect(api.documentosIdentidad).not.toHaveBeenCalled(); expect(api.listarTodos).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Falta el permiso');
    expect(fixture.nativeElement.textContent).not.toContain('12345678');
  });
  it('distingue el error de consulta de certificados de la ausencia de asociación', () => {
    api.listarTodos.and.returnValue(throwError(() => ({ status: 403, mensaje: 'Certificados restringidos', errores: {} })));
    const fixture = crear();
    expect(fixture.nativeElement.textContent).toContain('Certificados restringidos');
    expect(fixture.nativeElement.textContent).not.toContain('Sin certificado asociado');
  });
});
