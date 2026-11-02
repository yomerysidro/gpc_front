import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../core/services/autenticacion/auth.service';
import { DialogoConfirmacionComponent } from '../../../../shared/components/dialogo-confirmacion/dialogo-confirmacion.component';
import { ListarFirmasComponent } from './listar-firmas.component';

describe('Pantalla integrada de Gestión de Firmantes Municipales', () => {
  let fixture: ComponentFixture<ListarFirmasComponent>;
  let http: HttpTestingController;
  let permisos: Set<string>;
  const base = environment.apiBaseUrl;
  const firma = { id_firma: 8, id_persona_trabajador: 4, fecha_firma: '2026-10-30', ruta_archivo_pfx: 'NO-MOSTRAR-PFX', passphrase_cifrada: 'NO-MOSTRAR-SECRETO' };
  const trabajador = { id_persona_trabajador: 4, id_persona: 6, id_area: 2, cargo: 'Cargo institucional de prueba', estado: true };
  const pagina = (data: readonly unknown[]) => ({ success: true, data: { data, current_page: 1, last_page: 1, total: data.length, per_page: 100 } });

  beforeEach(() => {
    permisos = new Set(['ponentes-firmantes.ver', 'ponentes-firmantes.crear', 'ponentes-firmantes.editar', 'ponentes-firmantes.eliminar', 'emision.ver']);
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(),
      { provide: AuthService, useValue: { tienePermiso: (permiso: string) => permisos.has(permiso) } },
    ] });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  function crear(): void { fixture = TestBed.createComponent(ListarFirmasComponent); fixture.detectChanges();
    for (const request of http.match(req => req.url.endsWith('/person-documents/list') || req.url.endsWith('/document-types/list'))) {
      request.flush({ success: true, data: [] });
    }
  }
  function cargar(filas: readonly unknown[] = [firma], trabajadores: readonly unknown[] = [trabajador]): void {
    crear();
    http.expectOne(req => req.url.endsWith('/firmas/list')).flush(pagina(filas));
    http.expectOne(`${base}/person-workers/list`).flush({ success: true, data: trabajadores });
  }
  function relaciones(): void {
    for (const request of http.match(req => req.url.endsWith('/person-documents/list') || req.url.endsWith('/document-types/list'))) {
      request.flush({ success: true, data: [] });
    }

    http.expectOne(`${base}/persons/detail/6`).flush({ success: true, data: { id_persona: 6, nombres: 'Nombre de prueba', apellido_paterno: 'Apellido de prueba', apellido_materno: null } });
    http.expectOne(`${base}/areas/detail/2`).flush({ success: true, data: { id_area: 2, nombre: 'Área de prueba' } }); fixture.detectChanges();
  }

  it('reemplaza realmente el CRUD generico por tarjetas con datos reales recibidos y sin secretos', () => {
    cargar(); relaciones();
    expect(fixture.nativeElement.querySelector('h1').textContent).toBe('Gestión de Firmantes Municipales');
    expect(fixture.nativeElement.querySelector('app-listado-emision, table')).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('Nuevo registro');
    expect(fixture.nativeElement.textContent).not.toContain('Valor exacto');
    expect(fixture.nativeElement.textContent).not.toContain('Filtrar por');
    const tarjeta = fixture.nativeElement.querySelector('app-firmante-card');
    expect(tarjeta.textContent).toContain('Nombre de prueba Apellido de prueba');
    expect(tarjeta.textContent).toContain(trabajador.cargo);
    expect(tarjeta.textContent).toContain('Área de prueba');
    expect(tarjeta.textContent).toContain('Trabajador activo');
    expect(tarjeta.textContent).toContain('2026-10-30');
    expect(tarjeta.textContent).toContain('No informadas por el servicio');
    expect(fixture.nativeElement.textContent).not.toContain('NO-MOSTRAR');
    expect(tarjeta.textContent).not.toContain('Firmado digitalmente');
  });

  it('respeta los 403 de Gestion y no repite las lecturas denegadas para otros trabajadores', () => {
    cargar([firma, { ...firma, id_firma: 9, id_persona_trabajador: 5 }], [trabajador, { ...trabajador, id_persona_trabajador: 5, id_persona: 10, id_area: 3 }]);
    for (const ruta of ['persons/detail/6', 'areas/detail/2']) http.expectOne(`${base}/${ruta}`).flush({ message: 'No autorizado.' }, { status: 403, statusText: 'Forbidden' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('app-firmante-card').length).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('Nombre restringido por Gestión');
    expect(fixture.nativeElement.textContent).toContain('Área restringida por Gestión');
    http.expectNone(`${base}/persons/detail/10`); http.expectNone(`${base}/areas/detail/3`);
  });

  it('no hace llamadas ni ofrece acciones de administracion sin el permiso de lectura', () => {
    permisos.clear(); crear(); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No tienes permiso');
    expect(fixture.nativeElement.querySelector('app-firmante-card')).toBeNull();
    http.expectNone(() => true);
  });

  it('mantiene las tarjetas de solo lectura cuando faltan los permisos de administracion', () => {
    permisos = new Set(['ponentes-firmantes.ver']); cargar(); relaciones();
    expect(fixture.nativeElement.querySelector('app-firmante-card button')).toBeNull();
    expect(Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>).some(boton => boton.textContent?.trim() === 'Registrar firmante')).toBeFalse();
    expect(fixture.nativeElement.querySelector('a[href="/certificaciones/firmas/aplicadas"]')).toBeNull();
  });

  it('busca localmente por nombre, cargo y area y filtra el estado real del trabajador', () => {
    cargar(); relaciones();
    const buscar = fixture.nativeElement.querySelector('#buscar-firmante') as HTMLInputElement;
    buscar.value = 'area de prueba'; buscar.dispatchEvent(new Event('input')); fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('app-firmante-card').length).toBe(1);
    const estado = fixture.nativeElement.querySelector('#estado-firmante') as HTMLSelectElement;
    estado.value = 'inactivo'; estado.dispatchEvent(new Event('change')); fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('app-firmante-card').length).toBe(0);
    expect(fixture.nativeElement.textContent).toContain('No hay firmantes con estos criterios');
    http.expectNone(() => true);
  });

  it('muestra un estado vacio institucional sin crear firmantes ficticios', () => {
    cargar([], []); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Aún no hay credenciales');
    expect(fixture.nativeElement.querySelector('app-firmante-card')).toBeNull();
    expect(fixture.nativeElement.querySelector('app-listado-emision')).toBeNull();
  });

  it('maneja error HTTP y conserva las credenciales cuando falla la consulta de trabajadores', () => {
    crear();
    http.expectOne(req => req.url.endsWith('/firmas/list')).flush(pagina([firma]));
    http.expectOne(`${base}/person-workers/list`).flush({ message: 'Gestión no disponible.' }, { status: 503, statusText: 'Unavailable' }); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Gestión no disponible');
    expect(fixture.nativeElement.querySelectorAll('app-firmante-card').length).toBe(1);
    expect(fixture.nativeElement.querySelector('.encabezado-firmantes > button').disabled).toBeTrue();
  });

  it('abre el formulario especifico para registrar un firmante y no monta el CRUD generico', async () => {
    cargar([], [trabajador]); relaciones(); fixture.detectChanges();
    fixture.nativeElement.querySelector('.encabezado-firmantes > button').click(); fixture.detectChanges(); await fixture.whenStable(); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('dialog[open] app-formulario-firmante')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('app-formulario-emision, app-listado-emision')).toBeNull();
    expect(fixture.nativeElement.querySelector('#firmante-clave').type).toBe('password');
  });

  it('no rellena rutas privadas ni contrasenas al administrar una credencial', async () => {
    cargar(); relaciones();
    fixture.nativeElement.querySelector('app-firmante-card button').click(); fixture.detectChanges(); await fixture.whenStable(); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#firmante-referencia').value).toBe('');
    expect(fixture.nativeElement.querySelector('#firmante-clave').value).toBe('');
    expect(fixture.nativeElement.textContent).not.toContain('NO-MOSTRAR');
    http.expectNone(req => req.url.includes('/firmas/detail/'));
  });

  it('conserva el registro cuando Laravel rechaza su eliminacion por historial', async () => {
    cargar(); relaciones();
    spyOn(DialogoConfirmacionComponent.prototype, 'abrir').and.resolveTo(true);
    fixture.nativeElement.querySelector('app-firmante-card .btn-danger').click(); await Promise.resolve();
    const request = http.expectOne(`${base}/firmas/delete/8`);
    expect(request.request.method).toBe('DELETE');
    request.flush({ message: 'El registro tiene dependencias históricas.' }, { status: 409, statusText: 'Conflict' }); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('dependencias históricas');
    expect(fixture.nativeElement.querySelectorAll('app-firmante-card').length).toBe(1);
  });

  it('distribuye las tarjetas en 320px sin desbordamiento horizontal', () => {
    cargar(); relaciones(); fixture.nativeElement.style.width = '320px'; fixture.detectChanges();
    const tarjeta = fixture.nativeElement.querySelector('app-firmante-card article') as HTMLElement;
    expect(tarjeta.getBoundingClientRect().width).toBeLessThanOrEqual(321);
    expect(tarjeta.scrollWidth).toBeLessThanOrEqual(tarjeta.clientWidth + 1);
  });
});
