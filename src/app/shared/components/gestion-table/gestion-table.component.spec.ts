import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { GestionRecord, GestionTableComponent } from './gestion-table.component';
import { GESTION_CONFIG } from './gestion-config';

type Acceso = {
  abrirFormulario(modo: 'nuevo' | 'editar', r?: GestionRecord): void;
  solicitarEliminar(r: GestionRecord): void;
  validar(): void; ejecutar(): void;
  formulario: FormGroup;
  puede(a: string): boolean;
  nombreRelacion(registro: GestionRecord, clave: string): string;
};
describe('CRUD de Gestion aislado de Laravel y Neon', () => {
  let fixture: ComponentFixture<GestionTableComponent>;
  let componente: Acceso;
  let permisos: ReturnType<typeof signal<string[]>>;
  let servicio: { listar: jasmine.Spy; obtener: jasmine.Spy; crear: jasmine.Spy; actualizar: jasmine.Spy; eliminar: jasmine.Spy };
  let http: HttpTestingController;
  const registro = { id_persona_practicante: 7, id_persona: 2, codigo: 'P01', estado: 'Activo' };
  const vista = () => fixture.nativeElement as HTMLElement;
  beforeEach(async () => {
    permisos = signal(['personas.verpersonas', 'practicantes.ver', 'practicantes.crear', 'practicantes.editar', 'practicantes.eliminar']);
    servicio = {
      listar: jasmine.createSpy().and.returnValue(of([registro])),
      obtener: jasmine.createSpy().and.returnValue(of(registro)),
      crear: jasmine.createSpy().and.returnValue(of({ message: 'Creado' })),
      actualizar: jasmine.createSpy().and.returnValue(of({ message: 'Actualizado' })),
      eliminar: jasmine.createSpy().and.returnValue(of({ message: 'Eliminado' })),
    };
    await TestBed.configureTestingModule({ imports: [GestionTableComponent], providers: [
      provideHttpClient(), provideHttpClientTesting(),
      { provide: AuthService, useValue: { tienePermiso: (clave: string) => permisos().includes(clave) } },
    ] }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(GestionTableComponent);
    fixture.componentRef.setInput('titulo', 'Practicantes');
    fixture.componentRef.setInput('descripcion', 'Listado');
    fixture.componentRef.setInput('clavePrimaria', 'id_persona_practicante');
    fixture.componentRef.setInput('columnas', [{ clave: 'id_persona_practicante', etiqueta: 'ID' }, { clave: 'codigo', etiqueta: 'Codigo' }, { clave: 'estado', etiqueta: 'Estado' }]);
    fixture.componentRef.setInput('servicio', servicio);
    componente = fixture.componentInstance as unknown as Acceso;
    fixture.detectChanges();
    http.expectOne(r => r.url.endsWith('/persons/list')).flush({ success: true, data: [{ id_persona: 2, nombres: 'Persona del test' }], message: '' });
  });
  afterEach(() => http.verify());
  function opcionesPersona() {
    http.expectOne(r => r.url.endsWith('/persons/list')).flush({ success: true, data: [{ id_persona: 2, nombres: 'Persona del test' }], message: '' });
    fixture.detectChanges();
  }
  function completar() { componente.formulario.patchValue({ id_persona: 2, codigo: 'P02', estado: 'Activo' }); }

  it('omite solo el sufijo construido y conserva los números y paréntesis del dato original', () => {
    for (const nombre of ['Universidad Peruana Unión', 'DNI', 'sistemas', 'supervisor', 'Área 2 (piso 3)', 'Nombre (ID 25) original']) {
      expect(componente.nombreRelacion({ id_area: 4, nombre }, 'id_area')).toBe(nombre);
    }
    expect(componente.nombreRelacion({ id_persona: 2 }, 'id_persona')).toBe('Persona del test');
    expect(componente.nombreRelacion({ id_area: 4 }, 'id_area')).toBe('Registro');
    expect(componente.nombreRelacion({ id_practica: 9, codigo: 'P01' }, 'id_practica')).toBe('P01');
    expect(vista().querySelector('tbody td')?.textContent?.trim()).toBe('7');
  });

  it('lista, filtra y conecta Ver al detalle real del servicio', () => {
    expect(vista().querySelector('tbody')?.textContent).toContain('P01');
    const buscar = vista().querySelector<HTMLInputElement>('input[type=search]')!;
    buscar.value = 'no existe'; buscar.dispatchEvent(new Event('input')); fixture.detectChanges();
    expect(vista().querySelector('tbody')?.textContent).not.toContain('P01');
    buscar.value = ''; buscar.dispatchEvent(new Event('input')); fixture.detectChanges();
    vista().querySelector<HTMLButtonElement>('tbody button')!.click(); fixture.detectChanges();
    expect(servicio.obtener).toHaveBeenCalledWith(7);
  });
  it('valida obligatorios, espacios, longitud y no envia un formulario invalido', () => {
    componente.abrirFormulario('nuevo'); opcionesPersona();
    componente.validar(); componente.ejecutar();
    expect(servicio.crear).not.toHaveBeenCalled();
    completar(); componente.formulario.patchValue({ codigo: ' '.repeat(51) });
    expect(componente.formulario.invalid).toBeTrue();
    componente.validar(); componente.ejecutar(); expect(servicio.crear).not.toHaveBeenCalled();
  });
  it('crea solamente despues de confirmar con IDs reales y recarga', () => {
    vista().querySelector<HTMLButtonElement>('.encabezado button')!.click(); opcionesPersona(); completar();
    componente.validar(); expect(servicio.crear).not.toHaveBeenCalled();
    componente.ejecutar();
    expect(servicio.crear).toHaveBeenCalledOnceWith({ id_persona: 2, codigo: 'P02', estado: 'Activo' });
    expect(servicio.listar).toHaveBeenCalledTimes(2);
  });
  it('carga detalle para editar y excluye la clave primaria del payload', () => {
    componente.abrirFormulario('editar', registro); opcionesPersona(); completar(); componente.validar(); componente.ejecutar();
    expect(servicio.obtener).toHaveBeenCalledWith(7);
    expect(servicio.actualizar).toHaveBeenCalledOnceWith(7, { id_persona: 2, codigo: 'P02', estado: 'Activo' });
  });
  it('cancelar la eliminacion no llama al servicio; confirmar elimina y recarga', () => {
    componente.solicitarEliminar(registro); fixture.detectChanges();
    expect(servicio.eliminar).not.toHaveBeenCalled();
    const botones = Array.from(vista().querySelectorAll<HTMLButtonElement>('app-dialogo button'));
    botones.find(b => b.textContent?.includes('Cancelar'))!.click();
    expect(servicio.eliminar).not.toHaveBeenCalled();
    componente.solicitarEliminar(registro); componente.ejecutar();
    expect(servicio.eliminar).toHaveBeenCalledOnceWith(7);
    expect(servicio.listar).toHaveBeenCalledTimes(2);
  });
  it('revocar permiso despues de confirmar impide escribir incluso llamando al metodo', () => {
    componente.abrirFormulario('nuevo'); opcionesPersona(); completar(); componente.validar();
    permisos.set(['practicantes.ver']); componente.ejecutar();
    expect(servicio.crear).not.toHaveBeenCalled();
    componente.solicitarEliminar(registro); expect(servicio.eliminar).not.toHaveBeenCalled();
  });
  it('no consulta relaciones sin permiso ni permite inventar IDs', () => {
    permisos.set(['practicantes.ver', 'practicantes.crear']);
    componente.abrirFormulario('nuevo'); completar(); componente.validar(); componente.ejecutar();
    http.expectNone(() => true); expect(servicio.crear).not.toHaveBeenCalled();
  });
  for (const estado of [403, 409, 422]) {
    it('conserva el listado y los valores ante error HTTP ' + estado, () => {
      servicio.actualizar.and.returnValue(throwError(() => new HttpErrorResponse({ status: estado, error: {
        message: 'Rechazado por Laravel', data: estado === 422 ? { codigo: ['Codigo duplicado'] } : [],
      } })));
      componente.abrirFormulario('editar', registro); opcionesPersona(); completar(); componente.validar(); componente.ejecutar(); fixture.detectChanges();
      expect(servicio.listar).toHaveBeenCalledTimes(1);
      expect(componente.formulario.value.codigo).toBe('P02');
      expect(vista().querySelector('tbody')?.textContent).toContain('P01');
      expect(vista().querySelector('app-dialogo [role=alert]')).not.toBeNull();
      if (estado === 422) expect(componente.formulario.get('codigo')?.getError('servidor')).toBe('Codigo duplicado');
    });
  }
  it('valida fechas y orden cronologico en Supervisores', () => {
    permisos.set([...permisos(), 'trabajadores.ver']);
    fixture.componentRef.setInput('clavePrimaria', 'id_practica_supervisor'); fixture.detectChanges();
    componente.abrirFormulario('nuevo');
    for (const endpoint of ['practices', 'person-workers']) {
      http.expectOne(r => r.url.endsWith('/' + endpoint + '/list')).flush({ success: true, message: '', data: [{ id_practica: 3, id_persona_trabajador: 4 }] });
    }
    componente.formulario.patchValue({ id_practica: 3, id_persona_trabajador: 4, tipo_supervision: 'Academica', fecha_inicio: '2026-03-01', fecha_fin: '2026-02-01', estado: 'Activo' });
    componente.validar(); componente.ejecutar(); expect(servicio.crear).not.toHaveBeenCalled();
    componente.formulario.patchValue({ fecha_fin: '2026-02-30' }); expect(componente.formulario.invalid).toBeTrue();
  });
  it('carga nombres de Personas y Áreas y envía sus IDs en Trabajadores', () => {
    permisos.set([...permisos(), 'trabajadores.ver', 'trabajadores.crear', 'areas.ver']);
    fixture.componentRef.setInput('clavePrimaria', 'id_persona_trabajador'); fixture.detectChanges();
    componente.abrirFormulario('nuevo'); opcionesPersona();
    http.expectOne(r => r.url.endsWith('/areas/list')).flush({ success: true, message: '', data: [{ id_area: 3, nombre: 'Informática' }] });
    componente.formulario.patchValue({ id_persona: 2, id_area: 3, cargo: 'Analista', fecha_ingreso: '2026-01-01', estado: true });
    fixture.detectChanges();
    expect(vista().querySelector('app-dialogo')?.textContent).toContain('Informática');
    expect(vista().querySelector('app-dialogo')?.textContent).toContain('Persona del test');
    componente.validar(); componente.ejecutar();
    expect(servicio.crear).toHaveBeenCalledWith({ id_persona: 2, id_area: 3, cargo: 'Analista', fecha_ingreso: '2026-01-01', fecha_fin: null, estado: true });
    http.expectOne(r => r.url.endsWith('/areas/list')).flush({ success: true, message: '', data: [] });
  });
  it('identifica areas.ver y deshabilita Guardar si falta el catálogo obligatorio', () => {
    permisos.set([...permisos(), 'trabajadores.ver', 'trabajadores.crear']);
    fixture.componentRef.setInput('clavePrimaria', 'id_persona_trabajador'); fixture.detectChanges();
    componente.abrirFormulario('nuevo'); opcionesPersona(); fixture.detectChanges();
    expect(vista().querySelector('app-dialogo')?.textContent).toContain('areas.ver');
    expect(vista().querySelector<HTMLButtonElement>('button[type=submit]')?.disabled).toBeTrue();
    http.expectNone(r => r.url.endsWith('/areas/list'));
  });
  it('conserva Institución opcional al editar Ponentes sin permiso para el catálogo', () => {
    permisos.set([...permisos(), 'ponentes-firmantes.ver', 'ponentes-firmantes.editar']);
    const ponente = { id_persona_ponente: 8, id_persona: 2, id_institucion: 12, cargo: null, especialidad: 'Sistemas' };
    servicio.obtener.and.returnValue(of(ponente));
    fixture.componentRef.setInput('clavePrimaria', 'id_persona_ponente'); fixture.detectChanges();
    componente.abrirFormulario('editar', ponente); opcionesPersona(); fixture.detectChanges();
    expect(componente.formulario.value.id_institucion).toBe(12);
    expect(vista().querySelector('app-dialogo')?.textContent).toContain('instituciones.ver');
    componente.validar(); componente.ejecutar();
    expect(servicio.actualizar).toHaveBeenCalledWith(8, { id_persona: 2, id_institucion: 12, cargo: null, especialidad: 'Sistemas' });
    http.expectNone(r => r.url.endsWith('/institutions/list'));
  });
  for (const [clave, config] of Object.entries(GESTION_CONFIG).filter(([, config]) => config.campos.some(c => c.clave === 'estado'))) {
    it('Estado conserva el tipo y las restricciones reales de Laravel en ' + clave, () => {
      const campo = config.campos.find(c => c.clave === 'estado')!;
      const valor = campo.tipo === 'boolean' ? false : 'Inactivo';
      permisos.set(Object.values(config.permisos).filter((p): p is string => !!p));
      const actual = { ...registro, [clave]: 9, estado: valor };
      servicio.obtener.and.returnValue(of(actual));
      fixture.componentRef.setInput('clavePrimaria', clave); fixture.detectChanges();
      componente.abrirFormulario('editar', actual);
      for (const consulta of http.match(r => r.method === 'GET')) consulta.flush({ success: true, message: '', data: [] });
      fixture.detectChanges();
      const selector = vista().querySelector<HTMLInputElement | HTMLSelectElement>('#' + clave + '-estado')!;
      expect(selector).not.toBeNull();
      if (campo.tipo === 'boolean') {
        expect((selector as HTMLSelectElement).selectedOptions[0].textContent?.trim()).toBe('Inactivo');
        expect(selector.tagName).toBe('SELECT');
      } else {
        expect(selector.tagName).toBe('INPUT');
        expect(selector.value).toBe('Inactivo');
      }
      const control = componente.formulario.get('estado')!;
      expect(control.value).toBe(valor);
      expect(control.valid).toBeTrue();
      control.setValue(null); expect(control.invalid).toBeTrue();
      control.setValue('Otro estado'); expect(control.invalid).toBe(campo.tipo === 'boolean');
      control.setValue(null);
      componente.validar(); componente.ejecutar(); expect(servicio.actualizar).not.toHaveBeenCalled();
    });
  }

  it('Tipos de documento crea y edita enviando false como booleano, con Nombre obligatorio', () => {
    permisos.set(['tipos-documento.ver', 'tipos-documento.crear', 'tipos-documento.editar']);
    fixture.componentRef.setInput('clavePrimaria', 'id_tipo_documento'); fixture.detectChanges();
    componente.abrirFormulario('nuevo');
    componente.formulario.patchValue({ nombre: '', estado: false });
    expect(componente.formulario.invalid).toBeTrue();
    componente.formulario.patchValue({ nombre: 'DNI' });
    servicio.listar.and.returnValue(of([]));
    componente.validar(); componente.ejecutar();
    expect(servicio.crear).toHaveBeenCalledOnceWith({ nombre: 'DNI', estado: false });
    const actual = { id_tipo_documento: 4, nombre: 'DNI', estado: false };
    servicio.obtener.and.returnValue(of(actual));
    componente.abrirFormulario('editar', actual); componente.validar(); componente.ejecutar();
    expect(servicio.actualizar).toHaveBeenCalledOnceWith(4, { nombre: 'DNI', estado: false });
  });

  it('Documentos conserva ambas relaciones, muestra nombres y envía Estado como texto', () => {
    permisos.set(['personas.verpersonas', 'personas.editar', 'tipos-documento.ver']);
    const actual = { id_persona_documento: 6, id_persona: 2, id_tipo_documento: 3, numero_documento: '12345678', estado: 'Inactivo' };
    servicio.obtener.and.returnValue(of(actual));
    servicio.listar.and.returnValue(of([]));
    fixture.componentRef.setInput('clavePrimaria', 'id_persona_documento'); fixture.detectChanges();
    componente.abrirFormulario('editar', actual); opcionesPersona();
    http.expectOne(r => r.url.endsWith('/document-types/list')).flush({ success: true, message: '', data: [{ id_tipo_documento: 3, nombre: 'DNI', estado: true }] });
    fixture.detectChanges();
    expect(vista().querySelector<HTMLSelectElement>('#id_persona_documento-id_persona')?.selectedOptions[0].textContent?.trim()).toBe('Persona del test');
    expect(vista().querySelector<HTMLSelectElement>('#id_persona_documento-id_tipo_documento')?.selectedOptions[0].textContent?.trim()).toBe('DNI');
    expect(vista().querySelector<HTMLInputElement>('#id_persona_documento-estado')?.value).toBe('Inactivo');
    componente.validar(); componente.ejecutar();
    expect(servicio.actualizar).toHaveBeenCalledOnceWith(6, { id_persona: 2, id_tipo_documento: 3, numero_documento: '12345678', estado: 'Inactivo' });
  });

  it('documentos.* no sustituye los permisos que exige actualmente Laravel', () => {
    permisos.set(['documentos.ver', 'documentos.crear', 'documentos.editar', 'documentos.eliminar']);
    for (const clave of ['id_tipo_documento', 'id_persona_documento']) {
      fixture.componentRef.setInput('clavePrimaria', clave); fixture.detectChanges();
      for (const accion of ['ver', 'crear', 'editar', 'eliminar']) expect(componente.puede(accion)).toBeFalse();
    }
  });

  it('Personas y Documentos comparten exactamente los cuatro permisos y los respetan por acción', () => {
    expect(GESTION_CONFIG['id_persona_documento'].permisos).toEqual(GESTION_CONFIG['id_persona'].permisos);
    const esperados = { ver: 'personas.verpersonas', crear: 'personas.crear', editar: 'personas.editar', eliminar: 'personas.eliminar' };
    expect(GESTION_CONFIG['id_persona_documento'].permisos).toEqual(esperados);
    for (const clave of ['id_persona', 'id_persona_documento']) {
      fixture.componentRef.setInput('clavePrimaria', clave); fixture.detectChanges();
      for (const [accion, permiso] of Object.entries(esperados)) {
        permisos.set(['personas.verpersonas', permiso]);
        expect(componente.puede(accion)).toBeTrue();
        permisos.set(accion === 'ver' ? [] : ['personas.verpersonas']);
        expect(componente.puede(accion)).toBeFalse();
      }
    }
  });

  it('habilita las diez tablas con los permisos exactos y deniega sin ellos', () => {
    for (const [clave, config] of Object.entries(GESTION_CONFIG)) {
      fixture.componentRef.setInput('clavePrimaria', clave);
      permisos.set(Object.values(config.permisos).filter((p): p is string => !!p));
      fixture.detectChanges();
      for (const accion of ['ver', 'crear', 'editar', 'eliminar']) expect(componente.puede(accion)).toBeTrue();
      permisos.set([]); fixture.detectChanges();
      for (const accion of ['ver', 'crear', 'editar', 'eliminar']) expect(componente.puede(accion)).toBeFalse();
    }
    expect(Object.keys(GESTION_CONFIG).length).toBe(10);
  });
});
