import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { of, Subject, throwError } from 'rxjs';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { EmisionCertificadosService } from '../../../core/services/emision-certificados/emision-certificados.service';
import { FormularioEmisionComponent } from './formulario-emision.component';

describe('Formularios y relaciones reales de Emisión', () => {
  let fixture: ComponentFixture<FormularioEmisionComponent>;
  let api: jasmine.SpyObj<EmisionCertificadosService>;
  let permitido: boolean;
  const certificado = { id_certificado: 1, id_persona: 1, id_tipo_certificado: 1, id_reconocimiento: null,
    id_participacion: 2, id_practica: null, fecha_emision: '2026-10-27', estado: true, notificado: false, fecha_notificacion: null };
  beforeEach(() => {
    permitido = true;
    api = jasmine.createSpyObj('EmisionCertificadosService', ['obtener', 'listarTodos', 'trabajadores', 'personaReconocimiento', 'areaReconocimiento', 'relaciones', 'crear', 'actualizar']);
    api.listarTodos.and.callFake((recurso: any) => of((recurso === 'reconocimientos' ? [{ estado: 'Activo' }] : [{ id_tipo_certificado: 1, nombre_tipo: 'Tipo registrado', estado: true }]) as any));
    api.areaReconocimiento.and.returnValue(of({ id_area: 2, nombre: 'Area registrada' }));
    api.relaciones.and.returnValue(of([{ id: 1, texto: 'Registro existente' }, { id: 2, texto: 'Otro registro existente' }]));
    api.trabajadores.and.returnValue(of([{ id_persona_trabajador: 4, id_persona: 6, id_area: 2, cargo: 'Cargo registrado', estado: true }]));
    api.personaReconocimiento.and.returnValue(of({ id_persona: 6, nombres: 'Nombre', apellido_paterno: 'Registrado', apellido_materno: null }));
    api.crear.and.returnValue(of({ id_reconocimiento: 7 } as any));
    api.actualizar.and.returnValue(of(certificado));
    api.obtener.and.returnValue(of(certificado));
    TestBed.configureTestingModule({ providers: [provideHttpClient(),
      { provide: EmisionCertificadosService, useValue: api }, { provide: AuthService, useValue: { tienePermiso: () => permitido } },
    ] });
    fixture = TestBed.createComponent(FormularioEmisionComponent);
  });
  function iniciar(recurso = 'reconocimientos', id: number | null = null): void {
    fixture.componentRef.setInput('recurso', recurso); fixture.componentRef.setInput('id', id); fixture.detectChanges();
  }
  function completar(): void {
    const form = (fixture.componentInstance as any).form();
    form.patchValue({ id_persona_trabajador: '4', titulo: 'Título', descripcion: 'Descripción', motivo: 'Motivo', fecha_reconocimiento: '2026-10-30', estado: 'Activo' });
  }
  function enviar(): void { fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit')); fixture.detectChanges(); }

  it('selecciona trabajadores existentes y muestra el nombre de Gestión sin crear personas', () => {
    iniciar(); completar(); enviar();
    expect(fixture.nativeElement.textContent).toContain('Nombre Registrado');
    expect(api.crear).toHaveBeenCalledOnceWith('reconocimientos', { id_persona_trabajador: 4, titulo: 'Título', descripcion: 'Descripción', motivo: 'Motivo', fecha_reconocimiento: '2026-10-30', estado: 'Activo' });
  });
  it('rechaza una relación que no pertenece al catálogo HTTP', () => {
    iniciar(); completar(); (fixture.componentInstance as any).form().controls.id_persona_trabajador.setValue('999');
    enviar(); expect(api.crear).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('registro existente');
  });
  it('carga el reconocimiento y envía únicamente los campos editados con su ID real', () => {
    api.obtener.and.returnValue(of({ id_reconocimiento: 7, id_persona_trabajador: 4, titulo: 'Original', descripcion: 'Descripción', motivo: 'Motivo', fecha_reconocimiento: '2026-10-30', estado: 'Activo' } as any));
    iniciar('reconocimientos', 7);
    expect(api.obtener).toHaveBeenCalledWith('reconocimientos', 7);
    expect(fixture.nativeElement.querySelector('#reconocimientos-id_persona_trabajador').value).toBe('4');
    expect(fixture.nativeElement.querySelector('#reconocimientos-estado').value).toBe('Activo');
    const control = (fixture.componentInstance as any).form().controls.titulo;
    control.setValue('Actualizado'); control.markAsDirty(); enviar();
    expect(api.actualizar).toHaveBeenCalledOnceWith('reconocimientos', 7, { titulo: 'Actualizado' });
  });
  it('bloquea envíos duplicados hasta completar la respuesta y emite éxito', () => {
    const respuesta = new Subject<any>(); api.crear.and.returnValue(respuesta);
    iniciar(); completar();
    const guardado = jasmine.createSpy('guardado'); fixture.componentInstance.guardado.subscribe(guardado);
    enviar(); enviar(); expect(api.crear).toHaveBeenCalledTimes(1);
    expect(guardado).not.toHaveBeenCalled();
    respuesta.next({ id_reconocimiento: 7 }); respuesta.complete();
    expect(guardado).toHaveBeenCalledOnceWith({ id_reconocimiento: 7 });
  });
  it('valida longitudes, fechas y espacios sin enviar escrituras', () => {
    iniciar(); completar();
    const form = (fixture.componentInstance as any).form();
    for (const [campo, valor] of [['titulo', 'a'.repeat(151)], ['descripcion', 'a'.repeat(501)], ['motivo', ' '], ['fecha_reconocimiento', '2026-02-30']]) {
      completar(); form.controls[campo].setValue(valor); enviar();
      expect(form.controls[campo].invalid).toBeTrue();
    }
    expect(api.crear).not.toHaveBeenCalled();
  });
  it('muestra solo los estados devueltos por Reconocimientos sin inventar Activo/Inactivo', () => {
    api.listarTodos.and.returnValue(of([{ estado: 'Otorgado' }, { estado: 'Revocado' }] as any)); iniciar();
    const selector = fixture.nativeElement.querySelector('#reconocimientos-estado') as HTMLSelectElement;
    expect(Array.from(selector.options).map(opcion => opcion.value)).toEqual(['', 'Otorgado', 'Revocado']);
    expect(fixture.nativeElement.querySelector('#reconocimientos-id_persona_trabajador').textContent).toContain('Area registrada');
  });
  it('no comunica éxito ni emite guardado cuando Laravel rechaza el registro', () => {
    api.crear.and.returnValue(throwError(() => ({ status: 422, mensaje: 'Datos rechazados', errores: { titulo: ['Título rechazado'] } })));
    iniciar(); completar();
    const guardado = jasmine.createSpy('guardado'); fixture.componentInstance.guardado.subscribe(guardado);
    enviar();
    expect(guardado).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Título rechazado');
  });
  it('maneja un catálogo vacío sin ofrecer registrar trabajadores desde Certificaciones', () => {
    api.trabajadores.and.returnValue(of([])); iniciar();
    expect(fixture.nativeElement.textContent).toContain('Los trabajadores se registran exclusivamente desde Gestión');
    completar(); enviar(); expect(api.crear).not.toHaveBeenCalled();
  });
  it('respeta el 403 al cargar relaciones y bloquea el envío', () => {
    api.trabajadores.and.returnValue(throwError(() => ({ status: 403, mensaje: 'No autorizado', errores: {} })));
    iniciar(); completar(); enviar();
    expect(fixture.nativeElement.textContent).toContain('No autorizado');
    expect(api.crear).not.toHaveBeenCalled();
  });
  it('envía solo campos cambiados con PATCH y permite reintentar un 422', () => {
    iniciar('certificados', 1);
    const control = (fixture.componentInstance as any).form().controls.estado;
    control.setValue(false); control.markAsDirty();
    api.actualizar.and.returnValue(throwError(() => ({ status: 422, mensaje: 'Revisar', errores: { estado: ['Estado rechazado'] } })));
    enviar(); expect(api.actualizar).toHaveBeenCalledWith('certificados', 1, { estado: false });
    expect(fixture.nativeElement.textContent).toContain('Estado rechazado');
    api.actualizar.and.returnValue(of({ ...certificado, estado: false }));
    enviar(); expect(api.actualizar).toHaveBeenCalledTimes(2);
  });
  it('conserva rutas PFX y contraseñas ocultas cuando solo cambia la fecha', () => {
    api.obtener.and.returnValue(of({ id_firma: 2, id_persona_trabajador: 1, fecha_firma: '2026-10-20' } as any));
    iniciar('firmas', 2);
    const control = (fixture.componentInstance as any).form().controls.fecha_firma;
    control.setValue('2026-10-27'); control.markAsDirty(); enviar();
    expect(api.actualizar).toHaveBeenCalledWith('firmas', 2, { fecha_firma: '2026-10-27' });
    expect(fixture.nativeElement.querySelector('input[type=password]').value).toBe('');
  });
  it('no carga ni presenta formularios sin autorización', () => {
    permitido = false; iniciar('firmas', 2);
    expect(fixture.nativeElement.querySelector('form')).toBeNull();
    expect(api.obtener).not.toHaveBeenCalled(); expect(api.relaciones).not.toHaveBeenCalled();
  });
  it('exige exactamente un origen de certificado', () => {
    iniciar('certificados');
    const form = (fixture.componentInstance as any).form();
    form.patchValue({ id_persona: '1', id_tipo_certificado: '1' }); enviar();
    expect(api.crear).not.toHaveBeenCalled();
    form.patchValue({ id_participacion: '2', id_practica: '1' }); enviar();
    expect(api.crear).not.toHaveBeenCalled();
  });
});
