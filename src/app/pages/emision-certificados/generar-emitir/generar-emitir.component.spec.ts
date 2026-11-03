import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CertificadoRow } from '../../../core/interfaces/emision-certificados/emision-certificados.interface';
import { EmisionCertificadosService } from '../../../core/services/emision-certificados/emision-certificados.service';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { PracticeService } from '../../../core/services/practice/practice.service';
import { ListarCertificadosComponent } from '../certificados/listar-certificados/listar-certificados.component';
import { GenerarEmitirComponent } from './generar-emitir.component';
import { FormularioCertificadoComponent } from '../certificados/formulario-certificado/formulario-certificado.component';
describe('Generar y emitir sin emisión ficticia', () => {
  let fixture: ComponentFixture<GenerarEmitirComponent>; let http: HttpTestingController; let api: jasmine.SpyObj<EmisionCertificadosService>;
  const certificado: CertificadoRow = { id_certificado: 9, id_persona: 6, id_tipo_certificado: 2, id_reconocimiento: 3, id_participacion: null, id_practica: null, estado: true, fecha_emision: '2026-10-30', notificado: false, fecha_notificacion: null };
  beforeEach(() => {
    api = jasmine.createSpyObj('api', ['listarTodos', 'personaReconocimiento', 'documentosIdentidad', 'obtener', 'relacionRegistros', 'crear']);
    api.listarTodos.and.returnValue(of([])); api.documentosIdentidad.and.returnValue(of({}));
    api.obtener.and.returnValue(of({ id_reconocimiento: 3, titulo: 'Logro recibido', descripcion: 'Descripción del servidor', motivo: 'Motivo registrado', fecha_reconocimiento: '2026-10-20', estado: 'Activo', id_persona_trabajador: 4 }));
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(),
      { provide: EmisionCertificadosService, useValue: api }, { provide: AuthService, useValue: { tienePermiso: () => true, cargarSesion: () => of(true) } },
      { provide: PracticeService, useValue: { obtener: () => of({ id_practica: 8, carrera: 'Carrera registrada', fecha_inicio: '2026-01-01', fecha_fin: '2026-10-01' }) } },
    ] });
    http = TestBed.inject(HttpTestingController); fixture = TestBed.createComponent(GenerarEmitirComponent); fixture.detectChanges();
  });
  afterEach(() => http.verify());
  function seleccionar(fila = certificado): void { const lista: ListarCertificadosComponent = fixture.debugElement.query(By.directive(ListarCertificadosComponent)).componentInstance; lista.seleccionado.emit({ registro: fila, beneficiario: 'Nombre autorizado de prueba', tipo: 'Tipo del servidor', dni: '12345678' }); fixture.detectChanges(); }
  function pulsar(texto: string): void { const vista: HTMLElement = fixture.nativeElement; const boton = Array.from(vista.querySelectorAll<HTMLButtonElement>('button')).find(boton => boton.textContent?.trim() === texto && !boton.closest('[hidden]'))!; boton.click(); fixture.detectChanges(); }
  it('reutiliza el listado real, exige revisión y llega al resumen con la emisión oficial bloqueada', () => {
    seleccionar(); expect(api.obtener).toHaveBeenCalledWith('reconocimientos', 3); expect(fixture.nativeElement.textContent).toContain('Logro recibido');
    pulsar('Siguiente'); expect(fixture.nativeElement.querySelector('app-visor-certificado')).toBeNull();
    const vista: HTMLElement = fixture.nativeElement;
    for (const checkbox of Array.from(vista.querySelectorAll<HTMLInputElement>('input[type="checkbox"]'))) { checkbox.click(); }
    fixture.detectChanges(); pulsar('Siguiente'); expect(fixture.nativeElement.querySelector('app-visor-certificado')).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain('PREVISUALIZACIÓN'); expect(fixture.nativeElement.querySelector('canvas, img[alt="QR"]')).toBeNull();
    pulsar('Siguiente'); const emitir = Array.from(vista.querySelectorAll<HTMLButtonElement>('button')).find(boton => boton.textContent?.includes('Generar documento oficial'))!;
    expect(emitir.disabled).toBeTrue(); expect(vista.textContent).toContain('no se ha emitido ningún documento'); http.expectNone(() => true);
  });
  it('consulta prácticas sin exigir actividad ni reconocimiento', () => {
    seleccionar({ ...certificado, id_reconocimiento: null, id_practica: 8 }); expect(fixture.nativeElement.textContent).toContain('Carrera registrada');
    expect(api.obtener).not.toHaveBeenCalled(); expect(api.listarTodos).not.toHaveBeenCalledWith('actividades-firmas', jasmine.anything());
  });
  it('un error del origen impide continuar y no crea documentos de respaldo', () => {
    api.obtener.and.returnValue(throwError(() => ({ status: 403, mensaje: 'Origen no autorizado' }))); seleccionar();
    expect(fixture.nativeElement.textContent).toContain('Origen no autorizado'); const vista: HTMLElement = fixture.nativeElement;
    expect(Array.from(vista.querySelectorAll<HTMLButtonElement>('button')).find(boton => boton.textContent?.trim() === 'Siguiente' && !boton.closest('[hidden]'))?.disabled).toBeTrue(); http.expectNone(() => true);
  });

  function nuevaPreparacion(): FormularioCertificadoComponent {
    api.listarTodos.and.callFake(((recurso: string) => of(recurso === 'tipos-certificado'
      ? [{ id_tipo_certificado: 2, nombre_tipo: 'Tipo del servidor', estado: true }]
      : recurso === 'reconocimientos' ? [{ id_reconocimiento: 3, id_persona_trabajador: 4, titulo: 'Logro recibido' }] : [])) as never);
    api.relacionRegistros.and.returnValue(of([{ id_persona_trabajador: 4, id_persona: 6 }]));
    api.personaReconocimiento.and.returnValue(of({ id_persona: 6, nombres: 'Nombre autorizado', apellido_paterno: 'Prueba', apellido_materno: null }));
    pulsar('Preparar nuevo certificado');
    return fixture.debugElement.query(By.directive(FormularioCertificadoComponent)).componentInstance;
  }
  function enviarFormulario(): void { fixture.nativeElement.querySelector('app-formulario-certificado form').dispatchEvent(new Event('submit')); fixture.detectChanges(); }

  it('reutiliza un solo formulario entre pasos, conserva valores y no crea registros al revisar un borrador', () => {
    const form = nuevaPreparacion();
    expect(fixture.nativeElement.querySelector('app-listar-certificados')).toBeNull();
    form.formulario.patchValue({ origen: 'reconocimiento', registro: 3 }); fixture.detectChanges(); enviarFormulario();
    expect(fixture.nativeElement.querySelector('li.actual').textContent).toContain('Preparar certificado');
    form.formulario.patchValue({ tipo: 2, fechaEmision: '2026-10-30' }); enviarFormulario();
    expect(fixture.nativeElement.querySelector('app-visor-certificado')).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Preparación local sin guardar');
    expect(fixture.nativeElement.querySelectorAll('app-formulario-certificado').length).toBe(1);
    expect(fixture.nativeElement.querySelector('app-formulario-certificado').parentElement.hidden).toBeTrue();
    expect(api.listarTodos.calls.allArgs().filter(args => args[0] === 'tipos-certificado').length).toBe(2); // listado inicial + formulario, sin instancias duplicadas
    expect(api.crear).not.toHaveBeenCalled();
    const botones: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    const anterior = botones.filter(boton => boton.textContent?.trim() === 'Anterior').at(-1)!;
    anterior.click(); fixture.detectChanges();
    expect(form.formulario.controls.tipo.value).toBe(2);
    expect(fixture.debugElement.query(By.directive(FormularioCertificadoComponent)).componentInstance).toBe(form);
  });

  it('continúa el certificado encontrado por origen y tipo sin crear un duplicado', () => {
    const form = nuevaPreparacion();
    form.formulario.patchValue({ origen: 'reconocimiento', registro: 3 }); enviarFormulario();
    api.listarTodos.and.returnValue(of([certificado]));
    form.formulario.patchValue({ tipo: 2 }); enviarFormulario();
    expect(fixture.nativeElement.querySelector('app-visor-certificado')).not.toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('Preparación local sin guardar');
    expect(api.crear).not.toHaveBeenCalled();
  });

  it('rechaza certificados con más de un origen y no consulta relaciones ambiguas', () => {
    seleccionar({ ...certificado, id_practica: 8 });
    expect(fixture.nativeElement.textContent).toContain('exactamente un origen');
    expect(api.obtener).not.toHaveBeenCalled();
  });

  it('conserva el listado y sus filtros al volver sin repetir solicitudes de carga', () => {
    const lista = fixture.debugElement.query(By.directive(ListarCertificadosComponent)).componentInstance;
    api.listarTodos.calls.reset();
    seleccionar(); pulsar('Anterior');
    expect(fixture.debugElement.query(By.directive(ListarCertificadosComponent)).componentInstance).toBe(lista);
    expect(fixture.nativeElement.querySelectorAll('app-listar-certificados').length).toBe(1);
    expect(api.listarTodos).not.toHaveBeenCalled();
  });
});
