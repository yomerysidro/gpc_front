import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { FormularioEmisionComponent } from './formulario-emision.component';

describe('Formularios de Emisión', () => {
  let fixture: ComponentFixture<FormularioEmisionComponent>;
  let http: HttpTestingController;
  let permitido: boolean;
  const certificado = { id_certificado: 1, id_persona: 1, id_tipo_certificado: 1, id_reconocimiento: null,
    id_participacion: 2, id_practica: null, fecha_emision: '2026-10-27', estado: true,
    notificado: false, fecha_notificacion: null };

  beforeEach(() => {
    permitido = true;
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(),
      { provide: AuthService, useValue: { tienePermiso: () => permitido } },
    ] });
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(FormularioEmisionComponent);
  });
  afterEach(() => http.verify());

  function escribir(nombre: string, valor: string | boolean): void {
    const input = fixture.nativeElement.querySelector(`input[id$="-${nombre}"]`) as HTMLInputElement;
    if (typeof valor === 'boolean') { input.checked = valor; input.dispatchEvent(new Event('change')); }
    else { input.value = valor; input.dispatchEvent(new Event('input')); }
    fixture.detectChanges();
  }
  function enviar(): void {
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    fixture.detectChanges();
  }

  it('envía solo los cambios con PATCH y permite reintentar después de un 422', () => {
    fixture.componentRef.setInput('recurso', 'certificados');
    fixture.componentRef.setInput('id', 1);
    fixture.detectChanges();
    http.expectOne(`${environment.apiBaseUrl}/certificados/detail/1`).flush({ data: certificado });
    fixture.detectChanges();
    escribir('estado', false); enviar();
    const request = http.expectOne(`${environment.apiBaseUrl}/certificados/update/1`);
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({ estado: false });
    request.flush({ message: 'Invalid validation data.', data: { estado: ['Revisa el estado.'] } }, { status: 422, statusText: '' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Revisa el estado.');
    enviar();
    const reintento = http.expectOne(`${environment.apiBaseUrl}/certificados/update/1`);
    expect(reintento.request.body).toEqual({ estado: false });
    reintento.flush({ data: { ...certificado, estado: false } });
  });

  it('rechaza orígenes múltiples sin enviar una petición y convierte los IDs al crear', () => {
    fixture.componentRef.setInput('recurso', 'certificados'); fixture.detectChanges();
    escribir('id_persona', '1'); escribir('id_tipo_certificado', '1');
    escribir('id_participacion', '2'); escribir('id_practica', '3');
    enviar();
    expect(fixture.nativeElement.textContent).toContain('Selecciona como máximo un origen');
    http.expectNone(request => request.method === 'POST');
    escribir('id_practica', ''); enviar();
    const request = http.expectOne(`${environment.apiBaseUrl}/certificados/create`);
    expect(request.request.body.id_persona).toBe(1);
    expect(request.request.body.id_participacion).toBe(2);
    expect(request.request.body.id_practica).toBeNull();
    expect(request.request.body.id_certificado).toBeUndefined();
    request.flush({ data: certificado });
  });

  it('permite crear sin origen como permite Laravel', () => {
    fixture.componentRef.setInput('recurso', 'certificados'); fixture.detectChanges();
    escribir('id_persona', '1'); escribir('id_tipo_certificado', '1'); enviar();
    const request = http.expectOne(`${environment.apiBaseUrl}/certificados/create`);
    expect(request.request.body.id_reconocimiento).toBeNull();
    expect(request.request.body.id_participacion).toBeNull();
    expect(request.request.body.id_practica).toBeNull();
    request.flush({ data: { ...certificado, id_participacion: null } });
  });

  it('no reconstruye rutas PFX ni contraseñas ocultas en la edición de una firma', () => {
    fixture.componentRef.setInput('recurso', 'firmas'); fixture.componentRef.setInput('id', 2); fixture.detectChanges();
    http.expectOne(`${environment.apiBaseUrl}/firmas/detail/2`).flush({ data: { id_firma: 2, id_persona_trabajador: 3, fecha_firma: '2026-10-20' } });
    fixture.detectChanges();
    escribir('fecha_firma', '2026-10-27'); enviar();
    const request = http.expectOne(`${environment.apiBaseUrl}/firmas/update/2`);
    expect(request.request.body).toEqual({ fecha_firma: '2026-10-27' });
    request.flush({ data: { id_firma: 2, id_persona_trabajador: 3, fecha_firma: '2026-10-27' } });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('input[type="password"]').value).toBe('');
  });

  it('no carga ni permite formularios para usuarios sin autorización', () => {
    permitido = false;
    fixture.componentRef.setInput('recurso', 'firmas'); fixture.componentRef.setInput('id', 2); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('form')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('No tienes permiso');
    http.expectNone(() => true);
  });
});
