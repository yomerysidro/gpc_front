import { ESCRITURA_EMISION_AUTORIZADA } from '../../../../core/services/emision-certificados/operaciones-emision';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../core/services/autenticacion/auth.service';
import { CARGA_CREDENCIAL_DIGITAL, CargaCredencialDigital } from '../../../../core/services/emision-certificados/credenciales-digitales.service';
import { FormularioFirmanteComponent } from './formulario-firmante.component';
describe('Credenciales sin rutas privadas inventadas', () => {
  let fixture: ComponentFixture<FormularioFirmanteComponent>;
  let http: HttpTestingController;
  let registrar: jasmine.Spy<CargaCredencialDigital['registrar']>;
  function iniciar(integrado = false): void {
    registrar = jasmine.createSpy('registrar').and.returnValue(of({ id_firma: 8, id_persona_trabajador: 4, fecha_firma: '2026-10-30' }));
    TestBed.configureTestingModule({ providers: [{ provide: ESCRITURA_EMISION_AUTORIZADA, useValue: true },provideHttpClient(), provideHttpClientTesting(),
      { provide: AuthService, useValue: { tienePermiso: () => true } },
      { provide: CARGA_CREDENCIAL_DIGITAL, useValue: integrado ? { maximoBytes: 8, registrar } : null },
    ] });
    http = TestBed.inject(HttpTestingController); fixture = TestBed.createComponent(FormularioFirmanteComponent);
    fixture.componentRef.setInput('trabajadores', [{ id_persona_trabajador: 4, id_persona: 6, id_area: 2, cargo: 'Cargo de prueba', estado: true }]);
    fixture.componentRef.setInput('nombres', { 6: 'Persona de prueba' }); fixture.componentRef.setInput('documentos', { 6: '12345678' }); fixture.detectChanges();
  }
  afterEach(() => http?.verify());
  function archivo(nombre: string, contenido = 'test'): void {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('#firmante-archivo'); const transferencia = new DataTransfer();
    transferencia.items.add(new File([contenido], nombre)); input.files = transferencia.files; input.dispatchEvent(new Event('change')); fixture.detectChanges();
  }
  function completar(): void { fixture.componentInstance.form.setValue({ trabajador: '4', fecha: '2026-10-30', clave: 'clave-solo-test' }); fixture.detectChanges(); }
  function enviar(): void { fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); fixture.detectChanges(); }
  it('sin API de carga deshabilita el registro y no envía archivos, secretos ni rutas locales', () => {
    iniciar(); completar(); archivo('credencial.pfx'); enviar();
    expect(fixture.nativeElement.querySelector('button[type="submit"]').disabled).toBeTrue();
    expect(fixture.nativeElement.textContent).toContain('Falta una API autorizada'); expect(fixture.nativeElement.querySelector('#firmante-referencia')).toBeNull();
    expect(registrar).not.toHaveBeenCalled(); http.expectNone(() => true);
  });
  for (const extension of ['pfx', 'p12']) {
    it('acepta ' + extension + ' y limpia el secreto únicamente tras respuesta del adaptador autorizado', () => {
      iniciar(true); completar(); archivo('credencial.' + extension); const guardado = jasmine.createSpy('guardado'); fixture.componentInstance.guardado.subscribe(guardado);
      enviar(); expect(registrar).toHaveBeenCalledTimes(1); expect(registrar.calls.mostRecent().args[0].archivo.name).toBe('credencial.' + extension);
      expect(guardado).toHaveBeenCalled(); expect(fixture.componentInstance.form.controls.clave.value).toBe(''); expect(fixture.nativeElement.querySelector('#firmante-archivo').value).toBe('');
      http.expectNone(() => true);
    });
  }
  it('rechaza extensiones, archivos vacíos y exceso del límite informado por el adaptador', () => {
    iniciar(true); completar(); archivo('archivo.txt'); expect(fixture.nativeElement.textContent).toContain('.pfx o .p12');
    archivo('archivo.pfx', ''); expect(fixture.nativeElement.textContent).toContain('no vacío');
    archivo('archivo.p12', '123456789'); expect(fixture.nativeElement.textContent).toContain('tamaño máximo'); enviar(); expect(registrar).not.toHaveBeenCalled();
  });
  it('al fallar la carga elimina el archivo y contraseña sin anunciar éxito', () => {
    iniciar(true); registrar.and.returnValue(throwError(() => ({ mensaje: 'PFX no válido', errores: { passphrase: ['Contraseña incorrecta'] } })));
    completar(); archivo('archivo.pfx'); enviar(); expect(fixture.nativeElement.textContent).toContain('PFX no válido'); expect(fixture.componentInstance.form.controls.clave.value).toBe('');
    expect(fixture.nativeElement.querySelector('#firmante-archivo').value).toBe('');
  });
  it('limpia credenciales al cancelar y destruir el formulario', () => {
    iniciar(); completar(); archivo('archivo.pfx'); const vista: HTMLElement = fixture.nativeElement; const cancelar = Array.from(vista.querySelectorAll<HTMLButtonElement>('button')).find(boton => boton.textContent?.trim() === 'Cancelar')!;
    cancelar.click(); expect(fixture.componentInstance.form.controls.clave.value).toBe(''); completar(); fixture.destroy(); expect(fixture.componentInstance.form.controls.clave.value).toBe('');
  });
  it('edita solo metadatos admitidos y conserva conflictos históricos', () => {
    iniciar(); fixture.componentRef.setInput('firma', { id_firma: 8, id_persona_trabajador: 4, fecha_firma: '2026-10-30' }); fixture.detectChanges();
    fixture.componentInstance.form.controls.fecha.setValue('2026-10-31'); enviar();
    const request = http.expectOne(environment.apiBaseUrl + '/firmas/update/8'); expect(request.request.body).toEqual({ fecha_firma: '2026-10-31' });
    request.flush({ message: 'El registro tiene historial asociado.' }, { status: 409, statusText: 'Conflict' }); fixture.detectChanges(); expect(fixture.nativeElement.textContent).toContain('historial asociado');
  });
  it('no permite crear con un trabajador inexistente ni fecha imposible', () => {
    iniciar(true); completar(); archivo('archivo.pfx'); fixture.componentInstance.form.controls.trabajador.setValue('999'); enviar(); expect(registrar).not.toHaveBeenCalled();
    fixture.componentInstance.form.controls.trabajador.setValue('4'); fixture.componentInstance.form.controls.fecha.setValue('2026-02-30'); enviar(); expect(registrar).not.toHaveBeenCalled();
  });
});
