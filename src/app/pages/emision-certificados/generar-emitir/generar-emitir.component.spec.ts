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
    api = jasmine.createSpyObj('api', ['pendientesCertificacion', 'listarTodos', 'personaReconocimiento', 'documentosIdentidad', 'obtener', 'relacionRegistros', 'crear']);
    api.pendientesCertificacion.and.returnValue(of({ data: [], total: 0, current_page: 1, last_page: 1, per_page: 20 }));
    api.listarTodos.and.returnValue(of([])); api.documentosIdentidad.and.returnValue(of({}));
    api.obtener.and.returnValue(of({ id_reconocimiento: 3, titulo: 'Logro recibido', descripcion: 'Descripción del servidor', motivo: 'Motivo registrado', fecha_reconocimiento: '2026-10-20', estado: 'Activo', id_persona_trabajador: 4 }));
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(),
      { provide: EmisionCertificadosService, useValue: api }, { provide: AuthService, useValue: { tienePermiso: () => true, cargarSesion: () => of(true) } },
      { provide: PracticeService, useValue: { obtener: () => of({ id_practica: 8, carrera: 'Carrera registrada', fecha_inicio: '2026-01-01', fecha_fin: '2026-10-01' }) } },
    ] });
    http = TestBed.inject(HttpTestingController); fixture = TestBed.createComponent(GenerarEmitirComponent); fixture.detectChanges();
  });
  afterEach(() => http.verify());
  function seleccionar(fila = certificado): void { (fixture.componentInstance as any).seleccionar({ registro: fila, beneficiario: 'Nombre autorizado de prueba', tipo: 'Tipo del servidor', dni: '12345678' }); fixture.detectChanges(); }
  function pulsar(texto: string): void { const vista: HTMLElement = fixture.nativeElement; const boton = Array.from(vista.querySelectorAll<HTMLButtonElement>('button')).find(boton => boton.textContent?.trim() === texto && !boton.closest('[hidden]'))!; boton.click(); fixture.detectChanges(); }
  function prepararGeneracion(): void {
    api.obtener.and.callFake(((recurso: string) => of(recurso === 'participation' ? { id_participacion: 30, id_actividad: 7 } : { id_actividad: 7, nombre: 'Actividad del servidor' })) as never);
    seleccionar({ ...certificado, id_participacion: 30, id_reconocimiento: null });
    for (const c of Array.from(fixture.nativeElement.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>)) c.click();
    fixture.detectChanges(); pulsar('Siguiente'); pulsar('Siguiente');
  }
  it('genera un PDF real por participación y mantiene bloqueada la emisión oficial', async () => {
    prepararGeneracion(); pulsar('Generar PDF de desarrollo');
    const req = http.expectOne('/api/certificados/9/generar-documento'); expect(req.request.body).toEqual({}); expect(req.request.withCredentials).toBeTrue();
    expect(fixture.nativeElement.querySelector('app-visor-pdf')).toBeNull();
    req.flush({ success: true, data: { id_certificado: 9, id_certificado_documento: 51, codigo_verificacion: 'a'.repeat(30),
      url_verificacion: 'https://municipalidad.test/verificar/' + 'a'.repeat(30), modo: 'desarrollo', oficial: false, puede_emitir: false, puede_firmar: false } });
    fixture.detectChanges(); http.expectOne('/api/certificados-documentos/51/archivo').flush(new Blob(['%PDF-1.4'], { type: 'application/pdf' }));
    await fixture.whenStable(); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-visor-pdf')).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Documento disponible para consulta');
    expect(Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>).find(b => b.textContent === 'Generar documento oficial')!.disabled).toBeTrue();
  });
  it('conserva el conflicto de generación sin mostrar un documento ficticio y permite reintentar', () => {
    prepararGeneracion(); pulsar('Generar PDF de desarrollo');
    http.expectOne('/api/certificados/9/generar-documento').flush({ message: 'Tipo no autorizado por Laravel' }, { status: 409, statusText: 'Conflict' }); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Operaci\u00f3n en conflicto o bloqueada.');
    expect(fixture.nativeElement.querySelector('app-visor-pdf')).toBeNull();
    expect(Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>).find(b => b.textContent === 'Generar PDF de desarrollo')!.disabled).toBeFalse();
  });
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
    expect(fixture.nativeElement.textContent).toContain('No tiene permisos para realizar esta acción'); const vista: HTMLElement = fixture.nativeElement;
    expect(Array.from(vista.querySelectorAll<HTMLButtonElement>('button')).find(boton => boton.textContent?.trim() === 'Siguiente' && !boton.closest('[hidden]'))?.disabled).toBeTrue(); http.expectNone(() => true);
  });

  it('rechaza certificados con más de un origen y no consulta relaciones ambiguas', () => {
    seleccionar({ ...certificado, id_practica: 8 });
    expect(fixture.nativeElement.textContent).toContain('exactamente un origen');
    expect(api.obtener).not.toHaveBeenCalled();
  });

  it('conserva el listado y sus filtros al volver sin repetir solicitudes de carga', () => {
    const lista = (fixture.componentInstance as any).pendientes();
    const filtros = (fixture.componentInstance as any).filtrosPendientes.getRawValue();
    api.listarTodos.calls.reset();
    seleccionar(); pulsar('Anterior');
    expect((fixture.componentInstance as any).pendientes()).toBe(lista);
    expect((fixture.componentInstance as any).filtrosPendientes.getRawValue()).toEqual(filtros);
    expect(fixture.nativeElement.querySelector('#emision-pendientes')).not.toBeNull();
    expect(fixture.nativeElement.querySelectorAll('app-listar-certificados').length).toBe(0);
    expect(api.listarTodos).not.toHaveBeenCalled();
  });
});
