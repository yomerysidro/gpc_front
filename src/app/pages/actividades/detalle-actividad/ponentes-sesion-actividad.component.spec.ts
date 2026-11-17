import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { PonentesSesionActividadComponent } from './ponentes-sesion-actividad.component';

describe('Ponentes de una sesión en Gestión de actividades', () => {
  let fixture: ComponentFixture<PonentesSesionActividadComponent>;
  let http: HttpTestingController;
  let permisos: Set<string>;
  const actividad = { id_actividad: 7, nombre: 'Capacitación Personal' };
  const sesion = { id_actividad_sesion: 15, numero: '001', fecha: '10/02/2026' };
  const disponibles = [
    { id_persona_ponente: 61, id_persona: 31, nombres: 'Maria', apellido_paterno: 'Perez', apellido_materno: null },
    { id_persona_ponente: 62, id_persona: 31, nombres: 'Maria', apellido_paterno: 'Perez', apellido_materno: null },
    { id_persona_ponente: 63, id_persona: 33, nombres: 'Ana', apellido_paterno: 'Rojas', apellido_materno: null },
  ];
  const gestion = (vinculos = [{ id_actividad_ponente: 71, id_actividad: 7, id_actividad_sesion: 15, id_persona_ponente: 61 }]) =>
    ({ id_actividad: 7, id_sesion: 15, ponentes_disponibles: disponibles, vinculos });
  const cargos = [
    { id_persona_ponente: 61, id_persona: 31, id_institucion: null, cargo: 'Especialista', especialidad: null },
    { id_persona_ponente: 62, id_persona: 31, id_institucion: null, cargo: 'Especialista', especialidad: null },
    { id_persona_ponente: 63, id_persona: 33, id_institucion: null, cargo: 'Analista', especialidad: null },
  ];
  const documentos = [{ id_persona_documento: 1, id_persona: 31, id_tipo_documento: 1, numero_documento: '12345678', estado: 'Activo' }];
  const tiposDocumento = [{ id_tipo_documento: 1, nombre: 'DNI', estado: true }];

  beforeEach(() => {
    permisos = new Set(['ponentes-firmantes.ver', 'ponentes-firmantes.crear', 'ponentes-firmantes.eliminar']);
    TestBed.configureTestingModule({ imports: [PonentesSesionActividadComponent], providers: [
      provideHttpClient(), provideHttpClientTesting(),
      { provide: AuthService, useValue: { tienePermiso: (permiso: string) => permisos.has(permiso) } },
    ] });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => { fixture?.destroy(); http.verify(); });
  function iniciar(datos = gestion(), crear = true): void {
    const personas = crear ? disponibles : [];
    fixture = TestBed.createComponent(PonentesSesionActividadComponent);
    fixture.componentRef.setInput('actividad', actividad); fixture.componentRef.setInput('sesion', sesion);
    fixture.detectChanges();
    http.expectOne('/api/activity/7/sessions/15/ponentes').flush({ success: true, data: { ...datos, ponentes_disponibles: personas } });
    http.expectOne('/api/person-speakers/list').flush({ success: true, data: cargos });
    http.expectOne('/api/person-documents/list').flush({ success: true, data: documentos });
    http.expectOne('/api/document-types/list').flush({ success: true, data: tiposDocumento });
    fixture.detectChanges();
  }
  const texto = () => fixture.nativeElement.textContent as string;

  it('muestra la actividad, la sesión, la fecha y los vínculos reales de esa sesión', () => {
    iniciar();
    expect(texto()).toContain('Capacitación Personal'); expect(texto()).toContain('Sesión 001'); expect(texto()).toContain('10/02/2026');
    expect(texto()).toContain('Maria Perez'); expect(texto()).toContain('DNI 12345678'); expect(texto()).toContain('Especialista');
    http.expectNone(r => r.method !== 'GET');
  });

  it('recupera al recargar el nombre real del vínculo aunque no figure entre disponibles', () => {
    const datos = { ...gestion(), ponentes_disponibles: [], vinculos: [{
      id_actividad_ponente: 71, id_actividad: 7, id_actividad_sesion: 15, id_persona_ponente: 61,
      id_persona: 31, nombres: 'Maria', apellido_paterno: 'Perez', apellido_materno: null,
    }] };
    iniciar(datos, false);
    expect(texto()).toContain('Maria Perez');
    fixture.destroy(); iniciar(datos, false);
    expect(texto()).toContain('Maria Perez');
    expect(texto()).not.toContain('Ponente #61');
    http.expectNone(r => r.method !== 'GET');
  });

  it('declara la sesión sin ponentes sin atribuir los de la actividad', () => {
    iniciar(gestion([]));
    expect(texto()).toContain('No hay ponentes asignados');
    expect(texto()).not.toContain('Ana Rojas');
  });

  it('vincula un ponente del catálogo y recupera la lista persistida del servidor', () => {
    iniciar();
    const agregar = Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .find(b => b.textContent?.trim() === 'Asignar ponente a esta sesión')!;
    agregar.click(); fixture.detectChanges();
    const selector = fixture.nativeElement.querySelector('#ponente-sesion-actividad') as HTMLSelectElement;
    expect(Array.from(selector.options).map(o => o.value)).toEqual(['', '61', '62', '63']);
    expect(selector.options[1].disabled).toBeTrue(); expect(selector.options[2].disabled).toBeTrue();
    selector.value = '63'; selector.dispatchEvent(new Event('change')); fixture.detectChanges();
    Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .find(b => b.textContent?.trim() === 'Asignar ponente')!.click();
    const alta = http.expectOne(r => r.url === '/api/activity/7/sessions/15/ponentes' && r.method === 'POST');
    expect(alta.request.body).toEqual({ id_persona_ponente: 63 }); expect(alta.request.withCredentials).toBeTrue();
    alta.flush({ success: true, data: { vinculo: { id_actividad_ponente: 72, id_actividad: 7, id_actividad_sesion: 15, id_persona_ponente: 63 } } });
    http.expectOne('/api/activity/7/sessions/15/ponentes').flush({ success: true, data: gestion([
      { id_actividad_ponente: 71, id_actividad: 7, id_actividad_sesion: 15, id_persona_ponente: 61 },
      { id_actividad_ponente: 72, id_actividad: 7, id_actividad_sesion: 15, id_persona_ponente: 63 },
    ]) });
    fixture.detectChanges();
    expect(texto()).toContain('Ana Rojas'); expect(texto()).toContain('Ponente vinculado a esta sesión.');
    http.expectNone(r => r.method !== 'GET');
  });

  it('impide duplicar a la misma persona en la sesión aunque tenga otro registro de ponente', () => {
    iniciar();
    Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .find(b => b.textContent?.trim() === 'Asignar ponente a esta sesión')!.click(); fixture.detectChanges();
    const selector = fixture.nativeElement.querySelector('#ponente-sesion-actividad') as HTMLSelectElement;
    selector.value = '62'; selector.dispatchEvent(new Event('change')); fixture.detectChanges();
    const vincular = Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .find(b => b.textContent?.trim() === 'Asignar ponente')!;
    expect(vincular.disabled).toBeTrue(); vincular.click();
    http.expectNone(r => r.method === 'POST');
  });

  it('permite vincular el mismo ponente a otra sesión con el endpoint de esa sesión', () => {
    fixture = TestBed.createComponent(PonentesSesionActividadComponent);
    fixture.componentRef.setInput('actividad', actividad);
    fixture.componentRef.setInput('sesion', { id_actividad_sesion: 16, numero: '002', fecha: '11/02/2026' });
    fixture.detectChanges();
    http.expectOne('/api/activity/7/sessions/16/ponentes').flush({ success: true, data: {
      id_actividad: 7, id_sesion: 16, ponentes_disponibles: disponibles, vinculos: [] } });
    http.expectOne('/api/person-speakers/list').flush({ success: true, data: cargos });
    http.expectOne('/api/person-documents/list').flush({ success: true, data: documentos });
    http.expectOne('/api/document-types/list').flush({ success: true, data: tiposDocumento });
    fixture.detectChanges();
    expect(texto()).toContain('No hay ponentes asignados');
    Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .find(b => b.textContent?.trim() === 'Asignar ponente a esta sesión')!.click(); fixture.detectChanges();
    const selector = fixture.nativeElement.querySelector('#ponente-sesion-actividad') as HTMLSelectElement;
    expect(selector.options[1].disabled).toBeFalse();
    selector.value = '61'; selector.dispatchEvent(new Event('change')); fixture.detectChanges();
    Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .find(b => b.textContent?.trim() === 'Asignar ponente')!.click();
    const alta = http.expectOne(r => r.url === '/api/activity/7/sessions/16/ponentes' && r.method === 'POST');
    expect(alta.request.body).toEqual({ id_persona_ponente: 61 });
    alta.flush({ success: true, data: { vinculo: { id_actividad_ponente: 73 } } });
    http.expectOne('/api/activity/7/sessions/16/ponentes').flush({ success: true, data: {
      id_actividad: 7, id_sesion: 16, ponentes_disponibles: disponibles,
      vinculos: [{ id_actividad_ponente: 73, id_actividad: 7, id_actividad_sesion: 16, id_persona_ponente: 61 }] } });
    fixture.detectChanges();
    expect(texto()).toContain('Maria Perez');
  });

  it('desvincula con confirmación y recupera la lista persistida', () => {
    iniciar();
    const desvincular = Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .find(b => b.textContent?.trim() === 'Desvincular')!;
    desvincular.click(); fixture.detectChanges();
    http.expectNone(r => r.method === 'DELETE');
    Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .find(b => b.textContent?.trim() === 'Confirmar desvincular')!.click();
    const baja = http.expectOne(r => r.url === '/api/activity/7/sessions/15/ponentes' && r.method === 'DELETE');
    expect(baja.request.body).toEqual({ id_actividad_ponente: 71 });
    baja.flush({ success: true, data: { desvinculado: true } });
    http.expectOne('/api/activity/7/sessions/15/ponentes').flush({ success: true, data: gestion([]) });
    fixture.detectChanges();
    expect(texto()).toContain('Ponente desvinculado de esta sesión.');
    expect(texto()).toContain('No hay ponentes asignados');
  });

  it('conserva el motivo real cuando Laravel impide desvincular un vínculo con reconocimiento', () => {
    iniciar();
    Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .find(b => b.textContent?.trim() === 'Desvincular')!.click(); fixture.detectChanges();
    Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .find(b => b.textContent?.trim() === 'Confirmar desvincular')!.click();
    http.expectOne(r => r.method === 'DELETE').flush({ message: 'El vínculo sustenta un reconocimiento y debe conservarse.' },
      { status: 409, statusText: 'Conflict' });
    http.expectOne('/api/activity/7/sessions/15/ponentes').flush({ success: true, data: gestion() });
    fixture.detectChanges();
    expect(texto()).toContain('El vínculo sustenta un reconocimiento y debe conservarse.');
    expect(texto()).toContain('Maria Perez');
  });

  it('solo ofrece acciones autorizadas y no registra personas nuevas', () => {
    permisos = new Set(['ponentes-firmantes.ver']);
    iniciar();
    expect(texto()).toContain('Maria Perez');
    expect(Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .some(b => ['Asignar ponente a esta sesión', 'Desvincular'].includes(b.textContent?.trim() ?? ''))).toBeFalse();
    expect(fixture.nativeElement.querySelector('form, input[type="text"], a[href*="person"]')).toBeNull();
  });

  it('presenta el bloqueo real del servidor sin inventar vínculos', () => {
    fixture = TestBed.createComponent(PonentesSesionActividadComponent);
    fixture.componentRef.setInput('actividad', actividad); fixture.componentRef.setInput('sesion', sesion);
    fixture.detectChanges();
    http.expectOne('/api/person-speakers/list').flush({ success: true, data: [] });
    http.expectOne('/api/person-documents/list').flush({ success: true, data: [] });
    http.expectOne('/api/document-types/list').flush({ success: true, data: [] });
    http.expectOne('/api/activity/7/sessions/15/ponentes').flush({ message: 'Se requiere aplicar previamente el SQL autorizado de ponentes por sesión.' },
      { status: 409, statusText: 'Conflict' });
    fixture.detectChanges();
    expect(texto()).not.toContain('SQL');
    expect(fixture.nativeElement.querySelector('.vinculados')).toBeNull();
    http.expectNone(r => r.method !== 'GET');
  });
});
