import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AUTHENTICATED_REQUEST } from '../../../core/security/auth-request.context';
import { DetalleActividadComponent } from './detalle-actividad.component';

describe('Detalle de actividad con las APIs existentes', () => {
  let fixture: ComponentFixture<DetalleActividadComponent>;
  let http: HttpTestingController;
  const seleccionar = (id: number | null) => {
    fixture.componentRef.setInput('actividadId', id); fixture.detectChanges();
  };
  const actividad = { id_actividad: 7, id_area: 2, id_tipo_actividad: 3, nombre: 'Jornada municipal',
    descripcion: 'Capacitación institucional', fecha_inicio: '2026-11-04', fecha_fin: '2026-11-05',
    sede: 'Auditorio', estado: 'Activa', origen: 'sin_solicitud', id_solicitud_actividad: null };
  const responder = (ruta: string, data: unknown) => {
    const peticion = http.expectOne('/api' + ruta);
    expect(peticion.request.method).toBe('GET');
    expect(peticion.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue();
    peticion.flush({ success: true, message: 'OK', data });
  };
  const texto = () => fixture.nativeElement.textContent as string;
  const catalogos = () => {
    responder('/areas/list', [{ id_area: 2, nombre: 'Desarrollo social' }]);
    responder('/ativicty-type', [{ id_tipo_actividad: 3, nombre: 'Taller' }]);
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [DetalleActividadComponent], providers: [
      provideHttpClient(), provideHttpClientTesting(),
    ] });
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(DetalleActividadComponent);
    fixture.componentRef.setInput('actividadId', 7);
    fixture.autoDetectChanges();
    await fixture.whenStable();
  });
  afterEach(() => { fixture.destroy(); http.verify(); });

  it('muestra solo las relaciones de la actividad y resuelve nombres con una consulta por catálogo', async () => {
    responder('/activity/7', actividad); catalogos();
    responder('/activity-speaker', [
      { id_actividad_ponente: 10, id_actividad: 7, id_persona_ponente: 20 },
      { id_actividad_ponente: 11, id_actividad: 8, id_persona_ponente: 21 },
      { id_actividad_ponente: 12, id_actividad: 7, id_persona_ponente: 22 },
    ]);
    responder('/participation', [
      { id_participacion: 30, id_actividad: 7, id_persona: 41, id_tipo_participacion: 5, fecha_inscripcion: '2026-11-03', estado: 'Inscrito' },
      { id_participacion: 31, id_actividad: 8, id_persona: 42, id_tipo_participacion: 5, estado: 'Inscrito' },
    ]);
    responder('/persons/list', [
      { id_persona: 40, nombres: 'Ana', apellido_paterno: 'Pérez', apellido_materno: 'Ríos' },
      { id_persona: 41, nombres: 'Luis', apellido_paterno: 'García', apellido_materno: null },
      { id_persona: 42, nombres: 'Otra actividad', apellido_paterno: 'No mostrar' },
      { id_persona: 43, nombres: 'María', apellido_paterno: 'Rojas', apellido_materno: null },
    ]);
    responder('/person-speakers/list', [
      { id_persona_ponente: 20, id_persona: 40, cargo: 'Especialista', especialidad: 'Gestión' },
      { id_persona_ponente: 22, id_persona: 43, id_institucion: 999, especialidad: null },
    ]);
    responder('/document-types/list', [{ id_tipo_documento: 6, nombre: 'DNI' }, { id_tipo_documento: 8, nombre: 'Pasaporte' }]);
    responder('/person-documents/list', [
      { id_persona_documento: 1, id_persona: 41, id_tipo_documento: 8, numero_documento: 'PASAPORTE-NO-DNI' },
      { id_persona_documento: 2, id_persona: 41, id_tipo_documento: 6, numero_documento: '01234567' },
      { id_persona_documento: 3, id_persona: 42, id_tipo_documento: 6, numero_documento: '87654321' },
    ]);
    await fixture.whenStable();
    expect(texto()).toContain('Jornada municipal');
    expect(texto()).toContain('Desarrollo social'); expect(texto()).toContain('Taller');
    expect(texto()).toContain('Ana Pérez Ríos'); expect(texto()).toContain('Gestión');
    const ponente = fixture.nativeElement.querySelector('.tarjeta-ponente');
    expect(ponente.textContent).toContain('ProcedenciaNo disponible');
    expect(fixture.nativeElement.querySelectorAll('.tarjeta-ponente').length).toBe(2);
    expect(texto()).toContain('María Rojas');
    const columnas = Array.from(fixture.nativeElement.querySelectorAll('tbody tr:first-child > *') as NodeListOf<HTMLElement>).map(celda => celda.textContent?.trim());
    expect(columnas).toEqual(['1', 'Luis', 'García', '01234567']);
    expect(texto()).not.toContain('PASAPORTE-NO-DNI'); expect(texto()).not.toContain('87654321');
    expect(texto()).not.toContain('Otra actividad');
    expect(fixture.nativeElement.querySelector('app-listar-actividades')).toBeNull();
    expect(fixture.nativeElement.querySelector('dialog')).toBeNull();
    const volver = jasmine.createSpy('volver'); fixture.componentInstance.volver.subscribe(volver);
    fixture.nativeElement.querySelector('.encabezado button').click();
    expect(volver).toHaveBeenCalledTimes(1);
    expect(fixture.nativeElement.querySelector('a')).toBeNull();
    http.expectNone(peticion => peticion.url.includes('/detail/'));
  });

  it('distingue listas vacías de errores sin solicitar catálogos de personas innecesarios', async () => {
    responder('/activity/7', actividad); catalogos();
    responder('/activity-speaker', []); responder('/participation', []);
    await fixture.whenStable();
    expect(texto()).toContain('No hay ponentes asignados a esta actividad.');
    expect(texto()).toContain('No hay participantes inscritos en esta actividad.');
    http.expectNone('/api/persons/list'); http.expectNone('/api/person-speakers/list');
  });

  it('no presenta una consulta denegada como ausencia de participantes', async () => {
    responder('/activity/7', actividad); catalogos(); responder('/activity-speaker', []);
    http.expectOne('/api/participation').flush({ message: 'Denegado' }, { status: 403, statusText: 'Forbidden' });
    await fixture.whenStable();
    expect(texto()).toContain('No tienes autorización para consultar los participantes');
    expect(texto()).not.toContain('No hay participantes inscritos');
  });

  it('limpia la actividad anterior y cancela sus solicitudes al cambiar de ID', async () => {
    responder('/activity/7', actividad); catalogos();
    const anterior = http.expectOne('/api/activity-speaker');
    const participaciones = http.expectOne('/api/participation');
    seleccionar(8);
    expect(anterior.cancelled).toBeTrue(); expect(participaciones.cancelled).toBeTrue();
    await fixture.whenStable(); expect(texto()).not.toContain('Jornada municipal');
    responder('/activity/8', { ...actividad, id_actividad: 8, nombre: 'Segunda actividad' });
    catalogos(); responder('/activity-speaker', []); responder('/participation', []);
    await fixture.whenStable(); expect(texto()).toContain('Segunda actividad');
  });

  it('rechaza un detalle cuyo ID no coincide y no consulta sus relaciones', async () => {
    responder('/activity/7', { ...actividad, id_actividad: 8 });
    await fixture.whenStable();
    expect(texto()).toContain('No se pudo verificar la actividad solicitada.');
    expect(texto()).not.toContain('Jornada municipal'); http.expectNone('/api/activity-speaker');
  });

  it('muestra la indicación sin seleccionar el primer registro al acceder sin actividad', async () => {
    const peticion = http.expectOne('/api/activity/7');
    seleccionar(null);
    expect(peticion.cancelled).toBeTrue();
    await fixture.whenStable();
    expect(texto()).toContain('Selecciona una actividad para ver su detalle');
    expect(fixture.nativeElement.querySelector('.tarjetas-detalle')).toBeNull();
    expect(fixture.nativeElement.querySelector('.encabezado button').textContent).toContain('Volver a actividades');
    http.expectNone('/api/activity'); http.expectNone('/api/activity/1');
  });

  it('limpia las tarjetas y las peticiones cuando se elimina la selección', async () => {
    responder('/activity/7', actividad); catalogos(); responder('/activity-speaker', []);
    const anterior = http.expectOne('/api/participation');
    seleccionar(null);
    expect(anterior.cancelled).toBeTrue();
    await fixture.whenStable();
    expect(texto()).toContain('Selecciona una actividad para ver su detalle');
    expect(texto()).not.toContain('Jornada municipal');
    expect(fixture.nativeElement.querySelector('.panel')).toBeNull();
  });

  it('pagina participantes con numeración correlativa y conserva la distribución de las tres tarjetas', async () => {
    responder('/activity/7', actividad); catalogos(); responder('/activity-speaker', []);
    responder('/participation', Array.from({ length: 12 }, (_, i) => ({ id_participacion: 100 + i, id_actividad: 7, id_persona: 40 + i })));
    responder('/persons/list', Array.from({ length: 12 }, (_, i) => ({ id_persona: 40 + i, nombres: 'Nombre ' + i, apellido_paterno: 'Apellido', apellido_materno: null })));
    responder('/document-types/list', [{ id_tipo_documento: 6, nombre: 'DNI' }]);
    responder('/person-documents/list', []);
    await fixture.whenStable();
    const tarjetas = fixture.nativeElement.querySelector('.tarjetas-detalle').children;
    expect(tarjetas.length).toBe(3);
    expect(tarjetas[0].getAttribute('aria-labelledby')).toBe('titulo-informacion');
    expect(tarjetas[1].getAttribute('aria-labelledby')).toBe('titulo-ponentes');
    expect(tarjetas[2].classList.contains('participantes')).toBeTrue();
    const izquierda = tarjetas[0].getBoundingClientRect();
    const derecha = tarjetas[1].getBoundingClientRect();
    const inferior = tarjetas[2].getBoundingClientRect();
    if (window.innerWidth > 800) {
      expect(izquierda.top).toBeCloseTo(derecha.top, 0);
      expect(izquierda.width).toBeCloseTo(derecha.width, 0);
      expect(derecha.left).toBeGreaterThan(izquierda.right);
    } else {
      expect(derecha.top).toBeGreaterThan(izquierda.bottom);
    }
    expect(inferior.top).toBeGreaterThan(derecha.bottom);
    expect(inferior.width).toBeCloseTo(tarjetas[0].parentElement.getBoundingClientRect().width, 0);
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(10);
    const siguiente = Array.from(fixture.nativeElement.querySelectorAll('.paginacion-botones button') as NodeListOf<HTMLButtonElement>)[1];
    siguiente.click(); await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(2);
    expect(fixture.nativeElement.querySelector('tbody td').textContent.trim()).toBe('11');
    expect(siguiente.disabled).toBeTrue();
    const tamano = fixture.nativeElement.querySelector('#tamano-detalle') as HTMLSelectElement;
    tamano.value = '20'; tamano.dispatchEvent(new Event('change')); await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(12);
    expect(fixture.nativeElement.querySelector('tbody td').textContent.trim()).toBe('1');
  });
});
