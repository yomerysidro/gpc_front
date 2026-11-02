import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../core/services/autenticacion/auth.service';
import { FormularioFirmanteComponent } from './formulario-firmante.component';

describe('Administracion autorizada de credenciales de firmantes', () => {
  let fixture: ComponentFixture<FormularioFirmanteComponent>;
  let http: HttpTestingController;
  const base = environment.apiBaseUrl;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), { provide: AuthService, useValue: { tienePermiso: () => true } }] });
    fixture = TestBed.createComponent(FormularioFirmanteComponent); http = TestBed.inject(HttpTestingController);
    fixture.componentRef.setInput('trabajadores', [{ id_persona_trabajador: 4, id_persona: 6, id_area: 2, cargo: 'Cargo de prueba', estado: true }]);
    fixture.detectChanges();
  });
  afterEach(() => http.verify());
  function enviar(): void { fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit')); fixture.detectChanges(); }

  it('registra una credencial de un trabajador existente mediante el endpoint real y limpia sus valores privados', () => {
    const guardado = jasmine.createSpy('guardado'); fixture.componentInstance.guardado.subscribe(guardado);
    fixture.componentInstance.form.setValue({ trabajador: '4', fecha: '2026-10-30', referencia: 'firmas/prueba.pfx', clave: 'solo-fixture-de-prueba' }); enviar();
    const request = http.expectOne(`${base}/firmas/create`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ id_persona_trabajador: 4, fecha_firma: '2026-10-30', ruta_archivo_pfx: 'firmas/prueba.pfx', passphrase: 'solo-fixture-de-prueba' });
    request.flush({ success: true, data: { id_firma: 8, id_persona_trabajador: 4, fecha_firma: '2026-10-30' } });
    expect(guardado).toHaveBeenCalled(); expect(fixture.componentInstance.form.controls.clave.value).toBe('');
    expect(fixture.componentInstance.form.controls.referencia.value).toBe('');
  });

  it('envia solo los cambios al editar sin reconstruir secretos ocultos', () => {
    fixture.componentRef.setInput('firma', { id_firma: 8, id_persona_trabajador: 4, fecha_firma: '2026-10-30' }); fixture.detectChanges();
    fixture.componentInstance.form.controls.fecha.setValue('2026-10-31'); enviar();
    const request = http.expectOne(`${base}/firmas/update/8`);
    expect(request.request.method).toBe('PATCH'); expect(request.request.body).toEqual({ fecha_firma: '2026-10-31' });
    request.flush({ message: 'El registro tiene historial asociado.' }, { status: 409, statusText: 'Conflict' }); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('historial asociado');
  });

  it('preserva los errores 422 por campo y elimina el secreto al fallar', () => {
    fixture.componentInstance.form.setValue({ trabajador: '4', fecha: '2026-10-30', referencia: 'firmas/prueba.pfx', clave: 'solo-fixture' }); enviar();
    http.expectOne(`${base}/firmas/create`).flush({ message: 'Validación.', data: { ruta_archivo_pfx: ['Credencial no aceptada.'] } }, { status: 422, statusText: 'Unprocessable Entity' }); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Credencial no aceptada');
    expect(fixture.nativeElement.querySelector('#firmante-clave').value).toBe('');
  });

  it('no envia trabajadores inventados ni formularios incompletos', () => {
    enviar(); http.expectNone(() => true);
    fixture.componentInstance.form.setValue({ trabajador: '999', fecha: '2026-10-30', referencia: 'firmas/prueba.pfx', clave: 'solo-fixture' }); enviar();
    expect(fixture.nativeElement.textContent).toContain('Selecciona un trabajador existente'); http.expectNone(() => true);
  });
});
