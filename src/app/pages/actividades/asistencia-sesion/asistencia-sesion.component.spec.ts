import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { AsistenciaSesionComponent } from './asistencia-sesion.component';
import { EMISION_CERTIFICADOS_ROUTES } from '../../emision-certificados/emision-certificados.routes';

@Component({ standalone: true, template: 'Detalle de actividad' })
class RegresoPruebaComponent {}

describe('Control de asistencia como página de sesión', () => {
  let http: HttpTestingController; let harness: RouterTestingHarness;
  let permisos: Set<string>;
  const ruta = '/certificaciones/actividades/7/sesiones/15/asistencia';
  const actividad = { id_actividad: 7, nombre: 'Actividad municipal', estado: 'Activa' };
  const sesion = { id_actividad_sesion: 15, id_actividad: 7, nombre: 'Sesión N.º 003', estado: 'Activo', fecha: '2026-11-12', hora_inicio: '08:00', hora_fin: '10:00', puede_editar_asistencia: true,
    contadores: { inscritos_actividad_vigentes: 99, participantes_sesion: 2, presentes: 1, ausentes: 0, pendientes: 1, por_regularizar: null } };
  const participantes = [{ id_participacion: 30, id_actividad: 7, id_persona: 40 }, { id_participacion: 31, id_actividad: 7, id_persona: 41 }, { id_participacion: 32, id_actividad: 8, id_persona: 42 }];
  const marca = { id_asistencia: 80, id_participacion: 30, id_actividad_sesion: 15, estado: 'PRESENTE', hora_entrada: '08:00' };
  const responder = (url: string, data: unknown) => http.expectOne('/api' + url).flush({ success: true, data });
  const vista = (): HTMLElement => harness.routeNativeElement!;
  const pulsar = (texto: string) => { Array.from(vista().querySelectorAll('button')).find(b => b.textContent?.trim() === texto)!.click(); harness.detectChanges(); };
  beforeEach(() => {
    permisos = new Set(['actividades.ver', 'participantes.ver', 'participantes.crear', 'participantes.editar']);
    const rutaReal = EMISION_CERTIFICADOS_ROUTES.find(r => r.path?.endsWith('/asistencia'))!;
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([
      { ...rutaReal, path: 'certificaciones/actividades/:idActividad/sesiones/:idSesion/asistencia' },
      { path: 'certificaciones/actividades', component: RegresoPruebaComponent },
      { path: 'acceso-denegado', component: RegresoPruebaComponent },
    ]), { provide: AuthService, useValue: { tienePermiso: (p: string) => permisos.has(p), cargarSesion: () => of(true) } }] });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  async function iniciar(actual = sesion, filas = participantes, marcas: unknown[] = [marca], estados = false, conPonentes = true) {
    harness = await RouterTestingHarness.create(ruta);
    responder('/activity/7', actividad); responder('/activity-session/15', actual); harness.detectChanges();
    responder('/activity-session/15/participantes', {
      id_actividad: 7, id_actividad_sesion: 15,
      participantes: filas.filter(p => p.id_actividad === 7).map(p => {
        const asistencia = (marcas as typeof marca[]).find(m => m.id_participacion === p.id_participacion && m.id_actividad_sesion === 15);
        return {
          id_participacion: p.id_participacion, fecha_inscripcion: '2026-10-29', nombre_completo: p.id_persona === 40 ? 'Ana Pérez' : 'Luis Ríos',
          seleccionado: !!asistencia, id_asistencia: asistencia?.id_asistencia ?? null,
          estado_asistencia: asistencia?.estado ?? null, hora_entrada: asistencia?.hora_entrada ?? null,
        };
      }),
    });
    if (permisos.has('ponentes-firmantes.ver')) {
      responder('/activity/7/sessions/15/ponentes', { id_actividad: 7, id_sesion: 15, ponentes_disponibles: [], vinculos: conPonentes ? [
        { id_actividad: 7, id_actividad_sesion: 15, id_actividad_ponente: 1, id_persona_ponente: 10, id_persona: 40, nombres: 'Ana', apellido_paterno: 'Pérez', estado_asistencia: estados ? null : undefined },
        { id_actividad: 7, id_actividad_sesion: 15, id_actividad_ponente: 2, id_persona_ponente: 11, nombres: 'Celia', estado_asistencia: estados ? 'AUSENTE' : undefined },
      ] : [] });
      responder('/person-speakers/list', [{ id_persona_ponente: 10, cargo: 'Especialista' }, { id_persona_ponente: 11, cargo: 'Facilitadora' }]);
    }
    harness.detectChanges(); await harness.fixture.whenStable(); harness.detectChanges();
  }
  it('abre sin modal, usa el resumen de sesión de la API y mantiene la asistencia de otras sesiones independiente', async () => {
    permisos.add('ponentes-firmantes.ver');
    await iniciar(sesion, participantes, [marca, { ...marca, id_asistencia: 81, id_participacion: 31, id_actividad_sesion: 16, estado: 'AUSENTE' }]);
    expect(vista().querySelector('h1')!.textContent).toContain('Control de asistencia — Sesión N.º 003');
    expect(vista().textContent).toContain('Actividad municipal'); expect(vista().textContent).toContain('12/11/2026');
    expect(Array.from(vista().querySelectorAll('.indicadores strong')).map(e => e.textContent)).toEqual(['1', '1', '0', '1']);
    expect(vista().querySelectorAll('tbody tr').length).toBe(1);
    expect(vista().querySelector('tbody')?.textContent).toContain('Ana Pérez');
    expect(vista().querySelector('tbody')?.textContent).not.toContain('Celia');
    expect(vista().querySelector('tbody')?.textContent).not.toContain('Luis Ríos');
    expect(vista().querySelector('tbody')?.textContent).toContain('29/10/2026');
    expect(vista().querySelector('.ponentes')?.textContent).toContain('Ana Pérez');
    expect(vista().querySelector('.ponentes')?.textContent).toContain('Especialista');
    expect(vista().querySelector('.ponentes')?.textContent).toContain('Facilitadora');
    expect(vista().querySelectorAll('.circulo-ausente[aria-pressed="true"]').length).toBe(0);
    expect(vista().querySelector('dialog[open]')).toBeNull();
    expect(vista().querySelectorAll('thead th').length).toBe(7);
    expect(vista().textContent).not.toContain('No determinable');
    expect(vista().textContent).not.toContain('En el modal puedes');
  });
  it('una sesión nueva muestra cero participantes y ningún ponente asignado', async () => {
    permisos.add('ponentes-firmantes.ver');
    await iniciar({ ...sesion, contadores: { ...sesion.contadores, participantes_sesion: 0, presentes: 0, pendientes: 0 } }, participantes, [], false, false);
    expect(vista().querySelector('.indicadores strong')?.textContent).toBe('0');
    expect(vista().textContent).toContain('No hay participantes inscritos en esta sesión.');
    expect(vista().querySelector('.acciones-ponente')).toBeNull();
    http.expectNone('/api/activity-session/15/participantes/candidatos');
  });
  it('guarda la asistencia del ponente y mantiene separados los indicadores', async () => {
    permisos.add('ponentes-firmantes.ver');
    await iniciar(sesion, participantes, [{ ...marca, id_participacion: 31 }], true);
    const boton = vista().querySelector<HTMLButtonElement>('.acciones-ponente button')!;
    expect(vista().querySelector('tbody')?.textContent).toContain('Luis Ríos');
    expect(vista().querySelector('tbody')?.textContent).not.toContain('Ana Pérez');
    expect(vista().querySelector('.resumen-ponentes')?.textContent).toContain('1 pendientes');
    boton.click();
    harness.detectChanges();
    const peticion = http.expectOne('/api/activity/7/sessions/15/ponentes/1/asistencia');
    expect(peticion.request.method).toBe('PUT');
    expect(peticion.request.withCredentials).toBeTrue();
    expect(peticion.request.body).toEqual({ estado: 'PRESENTE' });
    expect(boton.getAttribute('aria-pressed')).toBe('false');
    peticion.flush({ success: true, data: { id_actividad_sesion: 15, id_actividad_ponente: 1, estado_asistencia: 'PRESENTE' } });
    harness.detectChanges();
    expect(boton.getAttribute('aria-pressed')).toBe('true');
    expect(vista().querySelector('.resumen-ponentes')?.textContent).toContain('1 presentes · 1 ausentes · 0 pendientes');
    expect(Array.from(vista().querySelectorAll('.indicadores strong')).map(e => e.textContent)).toEqual(['1', '1', '0', '1']);
  });
  it('guarda cambios autorizados una sola vez y conserva las horas confirmadas', async () => {
    await iniciar();
    (vista().querySelectorAll('.circulo-ausente')[0] as HTMLButtonElement).click(); harness.detectChanges();
    expect(vista().textContent).not.toContain('Guardar asistencia');
    expect(vista().querySelector('.circulo-ausente')?.getAttribute('aria-pressed')).toBe('false');
    (vista().querySelector('.circulo-ausente') as HTMLButtonElement).click();
    const patch = http.expectOne('/api/attendance/update/80'); expect(patch.request.method).toBe('PATCH'); expect(patch.request.body).toEqual({ estado: 'AUSENTE' });
    const salir = await (harness.routeDebugElement!.componentInstance as AsistenciaSesionComponent).puedeSalir(); expect(salir).toBeFalse();
    patch.flush({ success: true, data: { id_asistencia: 80 } });
    responder('/attendance/80', { ...marca, estado: 'AUSENTE' });
    responder('/activity-session/15', { ...sesion, contadores: { ...sesion.contadores, presentes: 0, ausentes: 1 } });
    harness.detectChanges();
    expect(vista().textContent).not.toContain('Sin guardar'); expect(vista().textContent).toContain('08:00');
    expect(vista().querySelectorAll('.circulo-ausente[aria-pressed="true"]').length).toBe(1);
    http.expectNone('/api/activity/7'); http.expectNone('/api/participation');
  });
  it('muestra los participantes de la sesión sin selector de inscritos', async () => {
    await iniciar();
    expect(vista().querySelectorAll('tbody tr').length).toBeGreaterThan(0);
    expect(vista().textContent).not.toContain('Seleccionar participante');
    expect(vista().querySelector('#participante-sesion')).toBeNull();
    http.expectNone('/api/activity-session/15/participantes/candidatos');
  });
  for (const actual of [{ ...sesion, estado: 'Finalizada', puede_editar_asistencia: false }, { ...sesion, puede_editar_asistencia: false }]) {
    it('respeta la consulta protegida: ' + actual.estado + ' sin edición', async () => {
      await iniciar(actual);
      expect(Array.from(vista().querySelectorAll('.circulo-asistencia') as NodeListOf<HTMLButtonElement>).every(b => b.disabled)).toBeTrue();
      expect(vista().textContent).not.toContain('Guardar asistencia');
      expect(vista().textContent).toContain('Asistencia de solo lectura.');
      expect(!!vista().querySelector('.estado.finalizada')).toBe(actual.estado === 'Finalizada');
      http.expectNone(r => r.method !== 'GET');
    });
  }
  it('no concede escritura si faltan permisos de crear y editar', async () => {
    permisos.delete('participantes.crear'); permisos.delete('participantes.editar'); await iniciar();
    expect(Array.from(vista().querySelectorAll('.circulo-asistencia') as NodeListOf<HTMLButtonElement>).every(b => b.disabled)).toBeTrue();
    http.expectNone(r => r.method !== 'GET');
  });
  it('conserva un bloqueo 409 por certificados y exige actualizar antes de reintentar', async () => {
    await iniciar(); (vista().querySelector('.circulo-ausente') as HTMLButtonElement).click(); harness.detectChanges();
    http.expectOne('/api/attendance/update/80').flush({ message: 'Asistencia protegida por certificado.' }, { status: 409, statusText: 'Conflict' }); harness.detectChanges();
    expect(vista().textContent).toContain('409'); expect(vista().textContent).toContain('Asistencia protegida por certificado.');
    expect(Array.from(vista().querySelectorAll('.circulo-asistencia') as NodeListOf<HTMLButtonElement>).every(b => b.disabled)).toBeTrue();
    http.expectNone(r => r.method !== 'GET');
  });
  it('busca por nombre, muestra el total de inscritos y registra Presente en la sesión', async () => {
    await iniciar(sesion, participantes, [marca, { ...marca, id_asistencia: 82, id_participacion: 31, estado: 'INSCRITO' }]);
    expect(Array.from(vista().querySelectorAll('.indicadores strong')).map(e => e.textContent)).toEqual(['2', '1', '0', '1']);
    const buscador = vista().querySelector<HTMLInputElement>('#attendance-buscar-nombre')!;
    buscador.value = 'luis rios';
    buscador.dispatchEvent(new Event('input'));
    harness.detectChanges();
    expect(vista().querySelectorAll('tbody tr').length).toBe(1);
    expect(vista().querySelector('tbody')?.textContent).toContain('Luis Ríos');
    expect(vista().querySelector('.indicadores strong')?.textContent).toBe('2');

    (vista().querySelector('.circulo-presente') as HTMLButtonElement).click();
    harness.detectChanges();
    const peticion = http.expectOne('/api/attendance/update/82');
    expect(peticion.request.body).toEqual({ estado: 'PRESENTE' });
    peticion.flush({ success: true, data: { id_asistencia: 82 } });
    responder('/attendance/82', { ...marca, id_asistencia: 82, id_participacion: 31 });
    responder('/activity-session/15', { ...sesion, contadores: { ...sesion.contadores, presentes: 2, pendientes: 0 } });
    harness.detectChanges();
    expect(vista().querySelector('.circulo-presente')?.getAttribute('aria-pressed')).toBe('true');
    expect(buscador.value).toBe('luis rios');
  });
  it('vuelve mediante Router al detalle de la actividad', async () => {
    await iniciar(); (vista().querySelector('.boton-volver') as HTMLButtonElement).click(); await harness.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/certificaciones/actividades?id_actividad=7');
  });
  it('mantiene regularización de horas autorizada y el contexto protegido del formulario', async () => {
    await iniciar(); pulsar('Regularizar');
    responder('/attendance/80', marca); harness.detectChanges();
    expect(vista().querySelector('.modal-registro dialog[open]')).not.toBeNull();
    expect(vista().querySelector<HTMLSelectElement>('#attendance-id_actividad_sesion')!.disabled).toBeTrue();
    expect(vista().querySelector<HTMLSelectElement>('#attendance-id_participacion')!.disabled).toBeTrue();
  });
  it('mantiene la paginación y se adapta al ancho disponible', async () => {
    const filas = Array.from({ length: 12 }, (_, i) => ({ id_participacion: 30 + i, id_actividad: 7, id_persona: 40 + i }));
    await iniciar(sesion, filas, filas.map((p, i) => ({ ...marca, id_asistencia: 80 + i, id_participacion: p.id_participacion })));
    pulsar('Siguiente');
    expect(vista().querySelectorAll('tbody tr').length).toBe(2); pulsar('Anterior');
    expect(vista().querySelectorAll('tbody tr').length).toBe(10);
    for (const ancho of [360, 768, 1200]) {
      vista().style.width = ancho + 'px';
      expect(vista().querySelector('.indicadores')!.scrollWidth).toBeLessThanOrEqual(ancho);
      expect(vista().querySelector('.tabla')!.scrollWidth).toBeLessThanOrEqual(ancho);
    }
  });
  for (const status of [401, 403, 404, 409]) {
    it('presenta HTTP ' + status + ' sin habilitar controles ni inventar datos', async () => {
      harness = await RouterTestingHarness.create(ruta); responder('/activity/7', actividad);
      http.expectOne('/api/activity-session/15').flush({ message: 'Consulta restringida' }, { status, statusText: 'Error' }); harness.detectChanges();
      expect(vista().textContent).toContain('HTTP ' + status); expect(vista().querySelector('app-listado-emision')).toBeNull();
      http.expectNone('/api/attendance/list');
    });
  }
  it('rechaza sesiones de otra actividad y rutas sin permiso', async () => {
    harness = await RouterTestingHarness.create(ruta); responder('/activity/7', actividad); responder('/activity-session/15', { ...sesion, id_actividad: 8 }); harness.detectChanges();
    expect(vista().textContent).toContain('No se pudo verificar la sesión'); http.expectNone('/api/attendance/list');
    permisos.delete('participantes.ver'); await harness.navigateByUrl('/certificaciones/actividades/7/sesiones/16/asistencia');
    expect(TestBed.inject(Router).url).toBe('/acceso-denegado');
  });
});
