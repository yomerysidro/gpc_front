import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { AUTHENTICATED_REQUEST } from '../../../core/security/auth-request.context';
import { ListadoEmisionComponent } from '../compartidos/listado-emision.component';
import { DatosAsistenciaContextual, FILTROS_SESIONES_VACIOS } from './sesiones-asistencia-listado';

describe('Asistencia integrada: selección y guardado individual confirmado', () => {
  let fixture: ComponentFixture<ListadoEmisionComponent>;
  let http: HttpTestingController;
  let crear: boolean;
  const actividad = { id_actividad: 7, nombre: 'Jornada municipal' };
  const datos: DatosAsistenciaContextual = {
    actividad,
    sesiones: [{ id_actividad_sesion: 15, id_actividad: 7, nombre: 'Primera' }, { id_actividad_sesion: 17, id_actividad: 7, nombre: 'Segunda' }],
    participantes: [{ id: 30, nombres: 'Ana', apellidos: 'Pérez' }, { id: 31, nombres: 'Luis', apellidos: 'García' }],
    asistencias: [],
  };
  const estado = (sesion: number) => ({ campo: '', valor: '', pagina: 1, filtrosSesiones: { ...FILTROS_SESIONES_VACIOS, actividad: '7', sesion: String(sesion) } });
  const $ = <T extends HTMLElement = HTMLElement>(selector: string): T => fixture.nativeElement.querySelector(selector);
  const texto = () => fixture.nativeElement.textContent as string;
  const boton = (texto: string) => Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>).find(b => b.textContent?.trim() === texto)!;
  const seleccionar = async () => { $('.circulo-presente').click(); $('tbody tr:nth-child(2) .circulo-ausente').click(); await fixture.whenStable(); };
  const confirmar = (participacion: number, id: number, estado: string) => {
    const post = http.expectOne('/api/attendance/create');
    expect(post.request.method).toBe('POST');
    expect(post.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue();
    expect(post.request.body).toEqual({ id_participacion: participacion, id_actividad_sesion: 15, estado: estado });
    post.flush({ success: true, data: { ID_ASISTENCIA: id } });
    http.expectOne('/api/attendance/' + id).flush({ success: true, data: { ID_ASISTENCIA: id, ID_PARTICIPACION: participacion, ID_ACTIVIDAD_SESION: 15, ESTADO: estado } });
  };
  beforeEach(async () => {
    crear = true;
    TestBed.configureTestingModule({ imports: [ListadoEmisionComponent], providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(),
      { provide: AuthService, useValue: { tienePermiso: (permiso: string) => permiso !== 'participantes.crear' || crear } },
    ] });
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ListadoEmisionComponent);
    fixture.componentRef.setInput('recurso', 'attendance'); fixture.componentRef.setInput('enDetalle', true);
    fixture.componentRef.setInput('actividadContexto', actividad); fixture.componentRef.setInput('estadoInicial', estado(15));
    fixture.componentRef.setInput('datosContexto', datos); fixture.autoDetectChanges(); await fixture.whenStable();
  });
  afterEach(() => { fixture.destroy(); http.verify(); });

  it('reutiliza los datos confirmados, oculta filtros y selecciona marcas excluyentes sin guardar al pulsar círculos', async () => {
    expect(fixture.nativeElement.querySelector('form.filtros')).toBeNull();
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(2);
    expect(texto()).toContain('Ana Pérez'); expect(texto()).toContain('Luis García');
    expect(fixture.nativeElement.querySelectorAll('.circulo-asistencia[aria-pressed="true"]').length).toBe(0);
    $('.circulo-presente').click(); await fixture.whenStable();
    expect(texto()).toContain('Presente · Sin guardar');
    $('.circulo-ausente').click(); await fixture.whenStable();
    expect($('.circulo-presente').getAttribute('aria-pressed')).toBe('false');
    expect($('.circulo-ausente').getAttribute('aria-pressed')).toBe('true');
    expect(texto()).toContain('Ausente · Sin guardar');
    $('.circulo-ausente').click(); await fixture.whenStable();
    expect(texto()).not.toContain('Sin guardar');
    http.expectNone(() => true);
  });

  it('guarda secuencialmente con POST y GET por marca y evita doble envío', async () => {
    await seleccionar(); const guardar = boton('Guardar asistencia'); guardar.click(); guardar.click();
    confirmar(30, 80, 'PRESENTE'); confirmar(31, 81, 'AUSENTE'); await fixture.whenStable();
    expect(texto()).toContain('2 marcas confirmadas por Laravel.');
    expect(texto()).toContain('0 cambios pendientes'); expect(texto()).not.toContain('Sin guardar');
    expect($('tbody tr:first-child .circulo-presente').getAttribute('aria-pressed')).toBe('true');
    expect($('tbody tr:nth-child(2) .circulo-ausente').getAttribute('aria-pressed')).toBe('true');
    http.expectNone(() => true);
  });

  it('informa un fallo parcial, conserva solo el borrador fallido y no repite marcas confirmadas', async () => {
    await seleccionar(); boton('Guardar asistencia').click(); confirmar(30, 80, 'PRESENTE');
    http.expectOne('/api/attendance/create').flush({ message: 'No permitido', errors: { ESTADO: ['Revisa esta marca'] } }, { status: 422, statusText: 'Unprocessable' });
    await fixture.whenStable();
    expect(texto()).toContain('1 marcas confirmadas; 1 sin confirmar'); expect(texto()).toContain('Revisa esta marca');
    expect(texto()).not.toContain('2 marcas confirmadas por Laravel');
    expect(boton('Guardar asistencia').disabled).toBeTrue();
    boton('Actualizar asistencia').click();
    http.expectOne('/api/attendance/list').flush({ success: true, data: [{ ID_ASISTENCIA: 80, ID_PARTICIPACION: 30, ID_ACTIVIDAD_SESION: 15, ESTADO: 'PRESENTE' }] });
    await fixture.whenStable(); boton('Guardar asistencia').click(); confirmar(31, 81, 'AUSENTE'); await fixture.whenStable();
    expect(texto()).toContain('1 marcas confirmadas por Laravel'); http.expectNone(() => true);
  });

  it('consulta antes de reintentar un POST ambiguo y conserva el bloqueo al cambiar de sesión', async () => {
    $('.circulo-presente').click(); await fixture.whenStable(); boton('Guardar asistencia').click();
    http.expectOne('/api/attendance/create').flush({ success: true, data: { ID_ASISTENCIA: 80 } });
    http.expectOne('/api/attendance/80').flush({ message: 'Consulta fallida' }, { status: 500, statusText: 'Server error' }); await fixture.whenStable();
    fixture.componentRef.setInput('estadoInicial', estado(17)); await fixture.whenStable();
    fixture.componentRef.setInput('estadoInicial', estado(15)); await fixture.whenStable();
    expect(boton('Guardar asistencia').disabled).toBeTrue();
    boton('Actualizar asistencia').click();
    http.expectOne('/api/attendance/list').flush({ success: true, data: [{ ID_ASISTENCIA: 80, ID_PARTICIPACION: 30, ID_ACTIVIDAD_SESION: 15, ESTADO: 'PRESENTE' }] }); await fixture.whenStable();
    expect(texto()).toContain('0 cambios pendientes');
    expect($('.circulo-presente').getAttribute('aria-pressed')).toBe('true'); http.expectNone(() => true);
  });

  it('conserva borradores separados por sesión sin consultar otra vez ni mezclar participaciones', async () => {
    $('.circulo-presente').click(); await fixture.whenStable();
    fixture.componentRef.setInput('estadoInicial', estado(17)); await fixture.whenStable();
    expect(texto()).toContain('0 cambios pendientes');
    expect(fixture.nativeElement.querySelectorAll('.circulo-asistencia[aria-pressed="true"]').length).toBe(0);
    $('.circulo-ausente').click(); await fixture.whenStable();
    fixture.componentRef.setInput('estadoInicial', estado(15)); await fixture.whenStable();
    expect($('.circulo-presente').getAttribute('aria-pressed')).toBe('true');
    expect($('.circulo-ausente').getAttribute('aria-pressed')).toBe('false'); http.expectNone(() => true);
  });

  it('regulariza mediante el formulario existente con PATCH y conserva horas sin recargar catálogos', async () => {
    const registro = { id_asistencia: 80, id_participacion: 30, id_actividad_sesion: 15, estado: 'AUSENTE', hora_entrada: '08:00', hora_salida: '09:00' };
    fixture.componentRef.setInput('datosContexto', { ...datos, asistencias: [registro] }); await fixture.whenStable();
    expect($<HTMLButtonElement>('.circulo-presente').disabled).toBeFalse();
    const detalles = $<HTMLDetailsElement>('tbody details'); detalles.open = true;
    boton('Regularizar').click(); await fixture.whenStable();
    http.expectOne('/api/attendance/80').flush({ success: true, data: registro }); await fixture.whenStable();
    const campo = $<HTMLSelectElement>('#attendance-estado'); campo.value = 'presente'; campo.dispatchEvent(new Event('change'));
    $('app-formulario-emision form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    const patch = http.expectOne('/api/attendance/update/80');
    expect(patch.request.method).toBe('PATCH'); expect(patch.request.body).toEqual({ estado: 'presente' });
    patch.flush({ success: true, data: { ...registro, estado: 'presente' } }); await fixture.whenStable();
    expect($('.circulo-presente').getAttribute('aria-pressed')).toBe('true');
    expect(texto()).toContain('08:00'); expect(texto()).toContain('09:00'); http.expectNone(() => true);
  });

  it('corrige desde los iconos con PATCH, confirma el estado y conserva las horas', async () => {
    crear = false; // Corregir no requiere permiso de crear nuevas asistencias.
    const registro = { id_asistencia: 80, id_participacion: 30, id_actividad_sesion: 15, estado: 'AUSENTE', hora_entrada: '08:00:31', hora_salida: null };
    fixture.componentRef.setInput('datosContexto', { ...datos, asistencias: [registro] }); await fixture.whenStable();
    $('.circulo-presente').click(); await fixture.whenStable();
    expect(texto()).toContain('Presente · Sin guardar');
    boton('Guardar asistencia').click();
    const patch = http.expectOne('/api/attendance/update/80');
    expect(patch.request.method).toBe('PATCH');
    expect(patch.request.body).toEqual({ estado: 'PRESENTE' });
    expect(texto()).not.toContain('1 marcas confirmadas por Laravel');
    patch.flush({ success: true, data: { ...registro, estado: 'PRESENTE' } });
    http.expectOne('/api/attendance/80').flush({ success: true, data: { ...registro, estado: 'PRESENTE' } });
    await fixture.whenStable();
    expect(texto()).toContain('1 marcas confirmadas por Laravel');
    expect(texto()).toContain('08:00:31');
    http.expectNone('/api/attendance/create');
  });

  for (const status of [401, 403, 409, 422]) {
    it(`conserva la corrección pendiente y el motivo real ante HTTP ${status}`, async () => {
      const registro = { id_asistencia: 80, id_participacion: 30, id_actividad_sesion: 15, estado: 'AUSENTE' };
      fixture.componentRef.setInput('datosContexto', { ...datos, asistencias: [registro] }); await fixture.whenStable();
      $('.circulo-presente').click(); await fixture.whenStable(); boton('Guardar asistencia').click();
      http.expectOne('/api/attendance/update/80').flush({ message: 'Motivo real de Laravel' }, { status, statusText: 'Error' });
      await fixture.whenStable();
      expect(texto()).toContain('Presente · Sin guardar');
      expect(texto()).toContain(`HTTP ${status}`);
      expect(texto()).toContain('Motivo real de Laravel');
      expect(texto()).not.toContain('1 marcas confirmadas por Laravel');
      http.expectNone('/api/attendance/create');
    });
  }

  it('respeta permiso de creación y solo lectura', async () => {
    crear = false; fixture.detectChanges();
    expect($<HTMLButtonElement>('.circulo-presente').disabled).toBeTrue(); expect(boton('Guardar asistencia').disabled).toBeTrue();
    crear = true; fixture.componentRef.setInput('soloLectura', true); await fixture.whenStable();
    expect($<HTMLButtonElement>('.circulo-presente').disabled).toBeTrue(); http.expectNone(() => true);
  });
});
