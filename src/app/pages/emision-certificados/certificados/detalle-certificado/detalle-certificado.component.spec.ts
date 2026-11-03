import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../core/services/autenticacion/auth.service';
import { DetalleCertificadoComponent } from './detalle-certificado.component';

describe('Detalle y visor por documento de certificado', () => {
  let fixture: ComponentFixture<DetalleCertificadoComponent>;
  let http: HttpTestingController;
  let parametros: BehaviorSubject<ReturnType<typeof convertToParamMap>>;
  const certificado = { id_certificado: 9, id_persona: 3, id_tipo_certificado: 1, id_reconocimiento: null,
    id_participacion: null, id_practica: null, fecha_emision: '2026-10-30', estado: true, notificado: false, fecha_notificacion: null };
  const documentos = [
    { id_certificado_documento: 12, id_certificado: 9, codigo_verificacion: 'VERSION-2', estado: 'ANULADO', fecha_generacion: '2026-10-30', motivo_reemision: 'Corrección', hash_certificado: 'HASH-PRIVADO' },
    { id_certificado_documento: 11, id_certificado: 9, codigo_verificacion: 'VERSION-1', estado: 'GENERADO', fecha_generacion: '2026-10-29', motivo_reemision: null },
  ];
  const pagina = (data: readonly unknown[]) => ({ success: true, data: { data, current_page: 1, last_page: 1, per_page: 100, total: data.length } });

  beforeEach(() => {
    parametros = new BehaviorSubject(convertToParamMap({ id: '9', documentoId: '12' }));
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(),
      { provide: ActivatedRoute, useValue: { paramMap: parametros } },
      { provide: AuthService, useValue: { tienePermiso: (permiso: string) => permiso === 'emision.ver' } },
    ] });
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(DetalleCertificadoComponent);
    fixture.detectChanges();
  });
  afterEach(() => { identidad(); http.verify(); });

  function identidad(): void {
    for (const request of http.match(req => req.url.endsWith('/persons/detail/3') || req.url.endsWith('/person-documents/list') || req.url.endsWith('/document-types/list'))) {
      request.flush({ success: true, data: request.request.url.endsWith('/persons/detail/3')
        ? { id_persona: 3, nombres: 'Persona', apellido_paterno: 'Registrada', apellido_materno: null } : [] });
    }
  }
  function cargar(data = documentos): void {
    http.expectOne(`${environment.apiBaseUrl}/certificados/detail/9`).flush({ success: true, data: certificado });
    http.expectOne(`${environment.apiBaseUrl}/tipos-certificado/detail/1`).flush({ success: true, data: { id_tipo_certificado: 1, nombre_tipo: 'Reconocimiento', estado: 'ACTIVO' } });
    const request = http.expectOne(req => req.url.endsWith('/certificados-documentos/list'));
    expect(request.request.params.get('id_certificado')).toBe('9');
    request.flush(pagina(data));
  }

  function firmasYConsultas(): void {
    identidad();
    for (const recurso of ['certificados-firmas', 'consultas-certificado']) {
      for (const documento of documentos) {
        http.expectOne(req => req.url.endsWith(`/${recurso}/list`) && req.params.get('id_certificado_documento') === String(documento.id_certificado_documento)).flush(pagina([]));
      }
    }
    fixture.detectChanges();
  }

  it('muestra el codigo de la version seleccionada y preserva ambas versiones del historial', () => {
    cargar(); firmasYConsultas();
    const visor = fixture.nativeElement.querySelector('app-visor-certificado');
    expect(visor.textContent).toContain('VERSION-2');
    expect(visor.textContent).not.toContain('VERSION-1');
    expect(visor.textContent).toContain('DOCUMENTO ANULADO');
    expect(visor.querySelector('button').disabled).toBeTrue();
    expect(fixture.nativeElement.querySelector('table').textContent).toContain('VERSION-1');
    expect(fixture.nativeElement.textContent).not.toContain('HASH-PRIVADO');
    http.expectNone(req => req.method !== 'GET');
  });

  it('no usa otro documento cuando el solicitado no pertenece al certificado', () => {
    cargar(); firmasYConsultas();
    parametros.next(convertToParamMap({ id: '9', documentoId: '999' }));
    cargar(); firmasYConsultas();
    expect(fixture.nativeElement.querySelector('app-visor-certificado')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('no existe entre los documentos autorizados');
  });

  it('maneja el 404 sin presentar un certificado de muestra', () => {
    http.expectOne(`${environment.apiBaseUrl}/certificados/detail/9`).flush({ message: 'Registro no encontrado.' }, { status: 404, statusText: 'Not Found' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Registro no encontrado.');
    expect(fixture.nativeElement.querySelector('app-visor-certificado')).toBeNull();
  });

  it('presenta el codigo pendiente cuando no hay documentos generados', () => {
    parametros.next(convertToParamMap({ id: '9' }));
    // La peticion anterior se cancela al cambiar de documento o certificado.
    const peticiones = http.match(`${environment.apiBaseUrl}/certificados/detail/9`);
    const activa = peticiones.find(request => !request.cancelled)!;
    activa.flush({ success: true, data: certificado });
    http.expectOne(`${environment.apiBaseUrl}/tipos-certificado/detail/1`).flush({ success: true, data: { nombre_tipo: 'Reconocimiento' } });
    http.expectOne(req => req.url.endsWith('/certificados-documentos/list')).flush(pagina([]));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-visor-certificado').textContent).toContain('Pendiente: no hay código');
  });
});
