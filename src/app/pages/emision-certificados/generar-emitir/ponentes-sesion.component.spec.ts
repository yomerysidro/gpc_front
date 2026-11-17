import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { PonentesSesionComponent } from './ponentes-sesion.component';
import { Router, provideRouter } from '@angular/router';
import { ponentesSesionPrueba } from '../../../core/interfaces/emision-certificados/origenes-certificado.fixture';
import { DocumentoFirmas, DocumentosDigitalesService } from '../../../core/services/emision-certificados/documentos-digitales.service';
import { Subject, of, throwError } from 'rxjs';

describe('Ponentes vinculados a una sesión real', () => {
  let http: HttpTestingController; let fixture: ComponentFixture<PonentesSesionComponent>; let permitido: boolean;
  let docs: jasmine.SpyObj<DocumentosDigitalesService>;
  const respuesta = (sesion = 15, actividad = 7) => ({ success: true, data: ponentesSesionPrueba(sesion, actividad) });
  const sinPonentes = (sesion = 15, actividad = 7) => ({ success: true, data: { ...ponentesSesionPrueba(sesion, actividad),
    ponentes_sesion: [], puede_preparar: false } });
  beforeEach(() => {
    permitido = true;
    docs = jasmine.createSpyObj('docs', ['recuperarReconocimientoSesion']);
    docs.recuperarReconocimientoSesion.and.returnValue(of({ estado_certificado: 'PREPARADO' } as DocumentoFirmas));
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(),
      { provide: DocumentosDigitalesService, useValue: docs },
      { provide: AuthService, useValue: { tienePermiso: () => permitido } }] });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  function iniciar(actividad = 7, sesion = 15): PonentesSesionComponent {
    fixture = TestBed.createComponent(PonentesSesionComponent);
    fixture.componentRef.setInput('actividadId', actividad); fixture.componentRef.setInput('sesionId', sesion);
    fixture.detectChanges(); return fixture.componentInstance;
  }
  function consulta(sesion = 15) { return http.expectOne(`/api/activity-session/${sesion}/ponentes-certificacion`); }

  it('muestra la tabla y permite navegar mientras la consulta documental sigue pendiente', () => {
    const pendiente = new Subject<DocumentoFirmas>();
    docs.recuperarReconocimientoSesion.and.returnValue(pendiente);
    const navegar = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    const datos = respuesta();
    Object.assign(datos.data.ponentes_sesion![0].reconocimiento, {
      puede_preparar: false, puede_consultar_certificado_existente: true,
      certificados_existentes: [{ id_certificado: 151, id_tipo_certificado: 47, estado: 'PREPARADO' }] });
    iniciar(); consulta().flush(datos); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Maria Perez');
    expect(fixture.nativeElement.textContent).not.toContain('Cargando ponentes');
    expect((fixture.componentInstance as any).cargando()).toBeFalse();
    (fixture.nativeElement.querySelector('tbody button') as HTMLButtonElement).click();
    expect(navegar).toHaveBeenCalledTimes(1);
    http.expectNone(r => r.url.includes('ponentes-certificacion'));
    fixture.destroy();
  });

  it('finaliza loading al destruir el componente y cancelar la consulta inicial', () => {
    const componente = iniciar(); const req = consulta(); fixture.destroy();
    expect(req.cancelled).toBeTrue();
    expect((componente as any).cargando()).toBeFalse();
  });

  it('consulta al mostrar el grupo con autenticación y el ID real de sesión', () => {
    iniciar(); const req = consulta();
    expect(req.request.method).toBe('GET'); expect(req.request.withCredentials).toBeTrue();
    expect(req.request.headers.get('Cache-Control')).toContain('no-store');
    req.flush(respuesta()); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Maria Perez');
    expect(fixture.nativeElement.textContent).toContain('Sesión N.º 001');
    expect(fixture.nativeElement.textContent).toContain('Especialista');
    expect(fixture.nativeElement.querySelector('input, select, textarea, app-preparacion-origen')).toBeNull();
  });

  it('declara que no hay ponentes vinculados cuando la sesión no tiene vínculos', () => {
    iniciar(); consulta().flush(sinPonentes()); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No hay ponentes asignados');
    expect(fixture.nativeElement.querySelector('tbody tr')).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('Maria Perez');
  });

  it('no atribuye a la sesión los ponentes de la actividad', () => {
    iniciar();
    consulta().flush({ success: true, data: { ...ponentesSesionPrueba(), ponentes_sesion: [], puede_preparar: false,
      ponentes_actividad: [{ id_actividad_ponente: 51, id_actividad: 7, nombres: 'Candidato de actividad',
        apellido_paterno: null, apellido_materno: null, cargo: null, institucion: null }] } });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).not.toContain('Candidato de actividad');
    expect(fixture.nativeElement.textContent).toContain('No hay ponentes asignados');
  });

  it('navega a la página completa del asistente sin desplegar el formulario bajo la tabla', () => {
    const navegar = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    iniciar(); consulta().flush(respuesta()); fixture.detectChanges();
    const boton = fixture.nativeElement.querySelector('tbody button') as HTMLButtonElement;
    expect(boton.textContent?.trim()).toBe('Preparar certificado'); expect(boton.disabled).toBeFalse();
    boton.click(); http.expectNone(`/api/activity-session/15/ponentes-certificacion`); fixture.detectChanges();
    expect(navegar).toHaveBeenCalledWith(
      ['/certificaciones/generar-emitir/reconocimientos/preparar'],
      { state: { reconocimientoSesion: respuesta().data.ponentes_sesion![0].reconocimiento } });
    expect(fixture.nativeElement.querySelector('app-preparacion-origen')).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('Procesando documento');
  });

  it('ofrece ver el reconocimiento existente solo con una preparación real confirmada', () => {
    const navegar = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    const datos = respuesta(); const e = datos.data.ponentes_sesion![0].reconocimiento;
    Object.assign(e, { puede_preparar: false, puede_generar_pdf: false, puede_consultar_certificado_existente: true,
      certificados_existentes: [{ id_certificado: 151, id_persona: 31, id_tipo_certificado: 47, id_reconocimiento: 81, id_practica: null, estado: 'PREPARADO' }] });
    iniciar(); consulta().flush(datos); fixture.detectChanges();
    const boton = fixture.nativeElement.querySelector('tbody button') as HTMLButtonElement;
    expect(boton.textContent?.trim()).toBe('Continuar preparación'); expect(boton.disabled).toBeFalse();
    expect(fixture.nativeElement.textContent).toContain('Pendiente de envío a Gerencia');
    boton.click(); http.expectNone(`/api/activity-session/15/ponentes-certificacion`); fixture.detectChanges();
    expect(navegar).toHaveBeenCalledTimes(1);
  });

  for (const caso of [
    { estado_certificado: 'PENDIENTE_FIRMA', enviado: true, etiqueta: 'Enviado a Gerencia', accion: 'Ver reconocimiento' },
    { estado_certificado: 'PENDIENTE_FIRMA', disponible_rrhh: true, etiqueta: 'Listo para entrega', accion: 'Ver certificado' },
    { estado_certificado: 'PENDIENTE_FIRMA', estado_preparacion: 'PREPARADO_ENTREGA', etiqueta: 'Listo para entrega', accion: 'Ver certificado' },
  ]) {
    it('presenta el estado documental autorizado: ' + JSON.stringify(caso), () => {
      docs.recuperarReconocimientoSesion.and.returnValue(of({ ...caso, id_certificado_documento: 201,
        actividad: 'Actividad', sesion: 'Sesión', tipo_certificado: 'Reconocimiento', firmantes: [],
        facultades: { remitir: false, descargar: true } }));
      const datos = respuesta(); const e = datos.data.ponentes_sesion![0].reconocimiento;
      Object.assign(e, { puede_preparar: false, puede_consultar_certificado_existente: true,
        certificados_existentes: [{ id_certificado: 151, id_tipo_certificado: 47, estado: 'PREPARADO' }] });
      iniciar(); consulta().flush(datos); fixture.detectChanges();
      expect(docs.recuperarReconocimientoSesion).toHaveBeenCalledWith(e, 151);
      expect(fixture.nativeElement.textContent).toContain(caso.etiqueta);
      expect(fixture.nativeElement.querySelector('tbody button').textContent.trim()).toBe(caso.accion);
      http.expectNone(r => r.method !== 'GET');
    });
  }

  it('no inventa envío ni disponibilidad si falla la consulta documental', () => {
    docs.recuperarReconocimientoSesion.and.returnValue(throwError(() => ({ status: 403 })));
    const datos = respuesta(); Object.assign(datos.data.ponentes_sesion![0].reconocimiento, {
      puede_preparar: false, puede_consultar_certificado_existente: true,
      certificados_existentes: [{ id_certificado: 151, id_tipo_certificado: 47, estado: 'PREPARADO' }] });
    iniciar(); consulta().flush(datos); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Estado documental pendiente de consulta');
    expect(fixture.nativeElement.textContent).not.toContain('Enviado a Gerencia');
    expect(fixture.nativeElement.textContent).not.toContain('Listo para entrega');
  });

  it('deshabilita la preparación cuando la sesión no está acreditada y explica el motivo', () => {
    const datos = respuesta(); const e = datos.data.ponentes_sesion![0].reconocimiento;
    Object.assign(e, { puede_preparar: false, puede_generar_pdf: false, estado_elegibilidad: 'Pendiente de validación',
      motivos_bloqueo: ['La sesión debe estar Finalizada y tener fecha real no futura.'] });
    iniciar(); consulta().flush(datos); fixture.detectChanges();
    const boton = fixture.nativeElement.querySelector('tbody button') as HTMLButtonElement;
    expect(boton.disabled).toBeTrue(); expect(boton.title).toContain('La sesión debe estar Finalizada');
    expect(fixture.nativeElement.textContent).toContain('Pendiente de validación');
    boton.click(); http.expectNone(r => r.method !== 'GET');
  });

  it('muestra una evaluación bloqueada sin contexto opcional y conserva la identidad del vínculo', () => {
    const datos = respuesta();
    const e = datos.data.ponentes_sesion![0].reconocimiento;
    Object.assign(e, { puede_preparar: false, puede_generar_pdf: false, estado_elegibilidad: 'Pendiente de validación',
      motivos_bloqueo: ['La sesión debe estar Finalizada.'] });
    delete (e as any).id_sesion; delete e.id_actividad; delete e.id_persona;
    iniciar(); consulta().flush(datos); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Maria Perez');
    expect(fixture.nativeElement.textContent).toContain('La sesión debe estar Finalizada.');
    expect(fixture.nativeElement.querySelector('tbody button').disabled).toBeTrue();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();
  });

  it('cancela la consulta anterior y descarta sus datos al cambiar de sesión', () => {
    iniciar(); const anterior = consulta();
    fixture.componentRef.setInput('sesionId', 16); fixture.detectChanges();
    expect(anterior.cancelled).toBeTrue();
    expect((fixture.componentInstance as any).datos()).toBeNull();
    consulta(16).flush(respuesta(16)); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Maria Perez');
    expect((fixture.componentInstance as any).datos().id_sesion).toBe(16);
  });

  for (const cambio of ['sesion', 'actividad', 'fila'] as const) {
    it('rechaza datos de otro contexto: ' + cambio, () => {
      iniciar(); const d = respuesta();
      if (cambio === 'sesion') d.data.id_sesion = 16;
      if (cambio === 'actividad') d.data.id_actividad = 9;
      if (cambio === 'fila') d.data.ponentes_sesion![0].reconocimiento.id_sesion = 16;
      consulta().flush(d); fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
      expect(fixture.nativeElement.querySelector('tbody')).toBeNull();
      http.expectNone(r => r.method !== 'GET');
    });
  }

  it('no presenta la falta del esquema de vínculo como una sesión con ponentes', () => {
    iniciar(); consulta().flush({ success: true, data: { ...ponentesSesionPrueba(), ponentes_sesion: null,
      relacion_ponente_sesion_disponible: false, puede_preparar: false,
      motivos_bloqueo: ['Se requiere aplicar previamente el SQL autorizado de ponentes por sesión.'] } }); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('SQL');
    expect(fixture.nativeElement.querySelector('tbody')).toBeNull();
    http.expectNone(r => r.method !== 'GET');
  });

  it('termina la carga y permite reintentar cuando la consulta falla', () => {
    iniciar(); const req = consulta();
    req.flush({ message: 'No disponible' }, { status: 500, statusText: 'Error' }); fixture.detectChanges();
    expect((fixture.componentInstance as any).cargando()).toBeFalse();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Reintentar ponentes');
    fixture.nativeElement.querySelector('[role="alert"] + button').click(); fixture.detectChanges();
    consulta().flush(respuesta()); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Maria Perez');
    fixture.destroy();
  });

  it('respeta permisos sin consultar participantes ni ponentes', () => {
    permitido = false;
    fixture = TestBed.createComponent(PonentesSesionComponent);
    fixture.componentRef.setInput('actividadId', 7); fixture.componentRef.setInput('sesionId', 15); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No tienes permiso');
    http.expectNone(r => true);
  });

  for (const status of [401, 403, 404, 409, 422]) {
    it('muestra el rechazo HTTP ' + status + ' separado de una lista vacía', () => {
      iniciar(); consulta().flush({ message: 'Consulta rechazada' }, { status, statusText: 'Rechazado' }); fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
      expect(fixture.nativeElement.querySelector('tbody')).toBeNull();
      http.expectNone(r => r.method !== 'GET');
    });
  }
});
