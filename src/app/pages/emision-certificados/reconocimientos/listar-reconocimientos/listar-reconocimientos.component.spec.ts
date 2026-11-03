import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../core/services/autenticacion/auth.service';
import { ListarReconocimientosComponent } from './listar-reconocimientos.component';

describe('Reconocimientos y relaciones autorizadas de Gestión', () => {
  let fixture: ComponentFixture<ListarReconocimientosComponent>;
  let http: HttpTestingController;
  let permisos: Set<string>;
  const base = environment.apiBaseUrl;
  const registro = { id_reconocimiento: 7, id_persona_trabajador: 4, titulo: 'Título devuelto por Laravel',
    descripcion: 'Descripción registrada', motivo: 'Motivo registrado', fecha_reconocimiento: '2026-10-30', estado: 'ACTIVO' };
  const trabajador = { id_persona_trabajador: 4, id_persona: 6, id_area: 2, cargo: 'Cargo registrado', estado: true };
  const certificado = { id_certificado: 9, id_persona: 6, id_reconocimiento: 7, estado: true };
  const documento = { id_certificado_documento: 11, id_certificado: 9, codigo_verificacion: 'CODIGO-LARAVEL', estado: 'GENERADO', fecha_generacion: '2026-10-30' };
  const pagina = (data: readonly unknown[], current = 1, last = 1, total = data.length) => ({ success: true, data: { data, current_page: current, last_page: last, total, per_page: 12 } });

  beforeEach(() => {
    permisos = new Set(['reconocimientos.ver', 'reconocimientos.crear', 'reconocimientos.editar', 'ponentes-firmantes.ver', 'emision.ver']);
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(),
      { provide: AuthService, useValue: { tienePermiso: (permiso: string) => permisos.has(permiso) } },
    ] });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    for (const request of http.match(req => req.url.endsWith('/person-documents/list') || req.url.endsWith('/document-types/list'))) {
      request.flush({ success: true, data: [] });
    }
    http.verify(); });

  function crear(): void {
    fixture = TestBed.createComponent(ListarReconocimientosComponent);
    fixture.detectChanges();
  }

  function iniciar(registros = [registro], current = 1, last = 1): void {
    crear();
    http.expectOne(req => req.url.endsWith('/reconocimientos/list')).flush(pagina(registros, current, last));
  }
  function gestion(): void {
    for (const request of http.match(req => req.url.endsWith('/person-documents/list') || req.url.endsWith('/document-types/list'))) {
      request.flush({ success: true, data: [] });
    }

    http.expectOne(`${base}/person-workers/list`).flush({ success: true, data: [trabajador] });
    http.expectOne(`${base}/persons/detail/6`).flush({ success: true, data: { id_persona: 6, nombres: 'Nombre de prueba', apellido_paterno: 'Apellido de prueba', apellido_materno: null } });
    http.expectOne(`${base}/areas/detail/2`).flush({ success: true, data: { id_area: 2, nombre: 'Área registrada' } });
  }
  function certificados(data: readonly unknown[] = []): void {
    http.expectOne(req => req.url.endsWith('/certificados/list')).flush(pagina(data));
  }

  it('renderiza la tarjeta reutilizable con nombre, area, cargo, certificado y codigo reales recibidos', () => {
    iniciar(); gestion(); certificados([certificado]);
    const documentos = http.expectOne(req => req.url.endsWith('/certificados-documentos/list'));
    expect(documentos.request.params.get('id_certificado')).toBe('9');
    documentos.flush(pagina([documento])); fixture.detectChanges();
    const tarjeta = fixture.nativeElement.querySelector('app-reconocimiento-card');
    expect(tarjeta.textContent).toContain(registro.titulo);
    expect(tarjeta.textContent).toContain('Nombre de prueba Apellido de prueba');
    expect(tarjeta.textContent).toContain('Área registrada');
    expect(tarjeta.textContent).toContain('Cargo registrado');
    expect(tarjeta.textContent).toContain('Certificado #9 · Activo');
    expect(tarjeta.textContent).toContain('CODIGO-LARAVEL');
    expect(tarjeta.querySelector('button').disabled).toBeTrue();
    expect(fixture.nativeElement.querySelector('a[href="/certificaciones/reconocimientos/nuevo"]').textContent).toContain('Registrar reconocimiento');
    http.expectNone(req => req.url.includes('/firmas/') || req.method !== 'GET');
  });

  it('envia solamente filtros exactos soportados por Laravel y permite buscar por trabajador seleccionado', () => {
    iniciar(); gestion(); certificados(); fixture.detectChanges();
    const titulo = fixture.nativeElement.querySelector('#reconocimiento-titulo') as HTMLInputElement;
    titulo.value = 'Título exacto'; titulo.dispatchEvent(new Event('input'));
    const busqueda = fixture.nativeElement.querySelector('#buscar-trabajador') as HTMLInputElement;
    busqueda.value = 'Cargo registrado'; busqueda.dispatchEvent(new Event('input')); fixture.detectChanges();
    const selector = fixture.nativeElement.querySelector('#reconocimiento-trabajador') as HTMLSelectElement;
    selector.value = '4'; selector.dispatchEvent(new Event('change'));
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    const request = http.expectOne(req => req.url.endsWith('/reconocimientos/list'));
    expect(request.request.params.get('titulo')).toBe('Título exacto');
    expect(request.request.params.get('id_persona_trabajador')).toBe('4');
    expect(request.request.params.has('search')).toBeFalse();
    request.flush(pagina([]));
    http.expectNone(req => req.url.includes('/person-workers/') || req.url.includes('/persons/') || req.url.includes('/areas/'));
  });

  it('muestra carga y estado vacio sin agregar registros ficticios', () => {
    crear(); expect(fixture.nativeElement.textContent).toContain('Cargando reconocimientos');
    http.expectOne(req => req.url.endsWith('/reconocimientos/list')).flush(pagina([]));
    http.expectOne(`${base}/person-workers/list`).flush({ success: true, data: [] }); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No hay reconocimientos con estos filtros');
    expect(fixture.nativeElement.querySelector('app-reconocimiento-card')).toBeNull();
    http.expectNone(req => req.url.includes('/certificados/') || req.url.includes('/persons/') || req.url.includes('/areas/'));
  });

  it('no realiza peticiones ni ofrece registro sin permiso de Reconocimientos', () => {
    permisos.clear(); crear();
    expect(fixture.nativeElement.textContent).toContain('Sin permiso de consulta');
    expect(fixture.nativeElement.querySelector('form, app-reconocimiento-card')).toBeNull();
    http.expectNone(() => true);
  });

  it('muestra el 403 del listado sin presentar tarjetas ficticias', () => {
    crear();
    http.expectOne(req => req.url.endsWith('/reconocimientos/list')).flush({ message: 'No autorizado.' }, { status: 403, statusText: 'Forbidden' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No autorizado.');
    expect(fixture.nativeElement.querySelector('app-reconocimiento-card')).toBeNull();
    http.expectNone(req => req.url.includes('/person-workers/'));
  });

  it('conserva reconocimientos cuando faltan los permisos de trabajadores y emision', () => {
    permisos.delete('ponentes-firmantes.ver'); permisos.delete('emision.ver'); permisos.delete('reconocimientos.editar');
    iniciar(); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Gestión restringida');
    const tarjeta = fixture.nativeElement.querySelector('app-reconocimiento-card');
    expect(tarjeta.textContent).toContain(registro.titulo);
    expect(tarjeta.textContent).toContain('Certificados: acceso restringido');
    expect(tarjeta.querySelector('a[href$="/editar"]')).toBeNull();
    http.expectNone(() => true);
  });

  it('respeta los 403 de personas y areas y evita repetir las solicitudes denegadas', () => {
    iniciar([registro, { ...registro, id_reconocimiento: 8, id_persona_trabajador: 5 }]);
    http.expectOne(`${base}/person-workers/list`).flush({ success: true, data: [trabajador, { ...trabajador, id_persona_trabajador: 5, id_persona: 10, id_area: 3 }] });
    for (const ruta of ['persons/detail/6', 'areas/detail/2']) {
      http.expectOne(`${base}/${ruta}`).flush({ message: 'No autorizado.' }, { status: 403, statusText: 'Forbidden' });
    }
    http.match(req => req.url.endsWith('/certificados/list')).forEach(request => request.flush(pagina([])));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('app-reconocimiento-card').length).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('Nombre: acceso restringido');
    expect(fixture.nativeElement.textContent).toContain('Área: acceso restringido');
    http.expectNone(`${base}/persons/detail/10`); http.expectNone(`${base}/areas/detail/3`);
  });

  it('reutiliza cada persona y area cuando varios reconocimientos pertenecen al mismo trabajador', () => {
    iniciar([registro, { ...registro, id_reconocimiento: 8 }]); gestion();
    http.match(req => req.url.endsWith('/certificados/list')).forEach(request => request.flush(pagina([])));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('app-reconocimiento-card').length).toBe(2);
    http.expectNone(req => req.url.includes('/persons/') || req.url.includes('/areas/') || req.url.includes('/person-workers/'));
  });

  it('distingue asociacion desconocida, ausencia de certificado y documento anulado', () => {
    iniciar(); gestion(); certificados([certificado]);
    http.expectOne(req => req.url.endsWith('/certificados-documentos/list')).flush(pagina([{ ...documento, estado: 'ANULADO' }]));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-reconocimiento-card').textContent).toContain('ANULADO');
    const actualizar = [...fixture.nativeElement.querySelectorAll('button')].find((boton: unknown) => (boton as HTMLButtonElement).textContent?.includes('Actualizar relaciones')) as HTMLButtonElement;
    actualizar.click();
    http.expectOne(req => req.url.endsWith('/reconocimientos/list')).flush(pagina([registro])); gestion();
    http.expectOne(req => req.url.endsWith('/certificados/list')).flush({ message: 'No disponible.' }, { status: 503, statusText: 'Unavailable' });
    fixture.detectChanges();
    const tarjeta = fixture.nativeElement.querySelector('app-reconocimiento-card');
    expect(tarjeta.textContent).toContain('Certificados: no se pudo consultar');
    expect(tarjeta.textContent).not.toContain('Sin certificado asociado');
  });

  it('pagina usando los metadatos del backend y conserva los filtros', () => {
    iniciar([registro], 1, 2); gestion(); certificados(); fixture.detectChanges();
    const siguiente = [...fixture.nativeElement.querySelectorAll('button')].find((boton: unknown) => (boton as HTMLButtonElement).textContent?.trim() === 'Siguiente') as HTMLButtonElement;
    siguiente.click();
    const request = http.expectOne(req => req.url.endsWith('/reconocimientos/list'));
    expect(request.request.params.get('page')).toBe('2');
    request.flush(pagina([registro], 2, 2)); certificados(); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Página 2 de 2');
    http.expectNone(req => req.url.includes('/persons/') || req.url.includes('/areas/') || req.url.includes('/person-workers/'));
  });
});
