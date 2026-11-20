import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { GenerarEmitirComponent } from './generar-emitir.component';
import { evaluacionOrigenPrueba, ponentesSesionPrueba } from '../../../core/interfaces/emision-certificados/origenes-certificado.fixture';

describe('Bandeja de certificación y beneficiarios', () => {
  let http: HttpTestingController;
  const pagina = (data: unknown[]) => ({ data, total: data.length, current_page: 1, last_page: 1, per_page: 20 });
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(),
      { provide: AuthService, useValue: { tienePermiso: () => true } }] });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  function iniciar(incluirOtraSesion = false) {
    const fixture = TestBed.createComponent(GenerarEmitirComponent);
    const filas = [
      { origen: 'sesion', id_actividad: 7, id_sesion: 15, nombre_actividad: 'Actividad real', nombre_sesion: 'Sesión real',
        total_participantes_inscritos: 2, total_elegibles: 2, total_pendientes: 0, estado_sesion: 'Finalizada', motivos_bloqueo: [] },
    ];
    if (incluirOtraSesion) filas.push({ ...filas[0], id_sesion: 16, nombre_sesion: 'Segunda sesión' });
    http.expectOne(r => r.url === '/api/certificaciones/pendientes').flush({ success: true, data: pagina(filas) });
    http.expectOne(r => r.url === '/api/tipos-certificado/list').flush({ success: true, data: pagina([{ id_tipo_certificado: 4, nombre_tipo: 'Asistencia', estado: true }]) });
    http.expectOne('/api/activity').flush({ success: true, data: [] });
    http.expectOne('/api/activity-session').flush({ success: true, data: [] });
    fixture.detectChanges(); return fixture;
  }
  it('muestra una sola cabecera con tres orígenes compactos y no carga certificados generales al entrar', () => {
    const f = iniciar();
    expect(f.nativeElement.querySelectorAll('[role="tab"]').length).toBe(3);
    expect(f.nativeElement.querySelector('#origen-tab-capacitacion').getAttribute('aria-selected')).toBe('true');
    expect(f.nativeElement.querySelector('.pasos')).toBeNull();
    expect(f.nativeElement.querySelector('app-formulario-certificado')).toBeNull();
    http.expectNone(r => r.url.includes('/certificados/'));
    f.destroy();
  });
  it('ofrece solo tipos documentales activos con sus claves reales', () => {
    const f = TestBed.createComponent(GenerarEmitirComponent);
    http.expectOne(r => r.url === '/api/certificaciones/pendientes').flush({ success: true, data: pagina([]) });
    http.expectOne(r => r.url === '/api/tipos-certificado/list').flush({ success: true, data: pagina([
      { id_tipo_certificado: 47, nombre_tipo: 'Capacitación', estado: true }, { id_tipo_certificado: 93, nombre_tipo: 'Prácticas', estado: true },
      { id_tipo_certificado: 999, nombre_tipo: 'Inactivo', estado: false },
    ]) });
    http.expectOne('/api/activity').flush({ success: true, data: [] }); http.expectOne('/api/activity-session').flush({ success: true, data: [] });
    f.detectChanges();
    const tipo: HTMLSelectElement = f.nativeElement.querySelector('[formControlName="tipo"]');
    expect(Array.from(tipo.options).map(o => o.value)).toEqual(['', '47', '93']); expect(tipo.textContent).not.toContain('Inactivo');
    expect((f.componentInstance as any).filtrosPendientes.controls.origen.value).toBe('sesion'); f.destroy();
  });
  for (const origen of ['reconocimiento', 'practica'] as const) {
    it('integra consulta de ' + origen + ' en la pantalla existente sin crear solicitudes ni sesiones', () => {
      const f = iniciar(); f.nativeElement.querySelector('#origen-tab-' + origen).click(); f.detectChanges();
      if (origen === 'reconocimiento') {
        http.expectOne('/api/activity').flush({ success: true, data: [] });
        http.expectOne(r => r.url === '/api/reconocimientos/list').flush({ success: true, data: pagina([{ id_reconocimiento: 71, titulo: 'Servicio municipal', estado: 'ca' }]) });
      } else {
        http.expectOne('/api/practices/evaluacion-certificacion').flush({ success: true, data: { practicas: [{
          ...evaluacionOrigenPrueba(origen, false), finalizacion_registrada: false, situacion_constancia: 'activa',
        }] } });
        f.detectChanges();
        expect(f.nativeElement.textContent).toContain('Ana Municipal');
        expect(f.nativeElement.textContent).toContain('Primero debe finalizarse la práctica');
        expect(f.nativeElement.querySelector('app-practicas-certificacion')).not.toBeNull();
        http.expectNone(r => r.method !== 'GET' || /practices\/list|catalogos-origenes|activity-requests|attendance|beneficiarios/.test(r.url));
        f.destroy(); return;
      }
      http.expectOne('/api/reconocimientos/71/evaluacion-certificacion').flush({ success: true, data: evaluacionOrigenPrueba(origen, false) });
      f.detectChanges(); expect(f.nativeElement.textContent).toContain('Servicio municipal'); expect(f.nativeElement.textContent).toContain('Falta la aprobación institucional.');
      expect(f.nativeElement.textContent).not.toContain('Consultar beneficiario');
      expect(f.nativeElement.querySelector('app-municipales-individuales')).not.toBeNull();
      http.expectNone('/api/certificaciones/catalogos-origenes');
      http.expectNone(r => r.method !== 'GET' || /activity-requests|attendance|beneficiarios/.test(r.url)); f.destroy();
    });
  }
  for (const estadoPonentes of [200, 403]) {
    it('mantiene el participante preparable aunque ponentes esté bloqueado: HTTP ' + estadoPonentes, () => {
      const f = iniciar(); const c = f.componentInstance as any; c.filtrosPendientes.controls.tipo.setValue('4');
      f.nativeElement.querySelector('[aria-label="Consultar beneficiarios"]').click(); f.detectChanges();
      http.expectOne(r => r.url === '/api/activity-session/15/beneficiarios').flush({ success: true, data: {
        origen: 'sesion', contexto: { id_actividad: 7, id_sesion: 15, nombre_actividad: 'Actividad real', nombre_sesion: 'Sesión real', estado_sesion: 'Finalizada' },
        beneficiarios: pagina([{ id_participacion: 8, id_persona: 10, id_actividad: 7, id_sesion: 15, id_tipo_certificado: 4,
          nombre_completo: 'Participante elegible', estado_asistencia: 'PRESENTE', estado_elegibilidad: 'Elegible', motivos: [] }]),
        puede_preparar: true, puede_generar_pdf: true, tipo_certificado_compatible: true, motivos_bloqueo: [],
      } });
      http.expectOne(r => r.url === '/api/certificados/list').flush({ success: true, data: pagina([]) }); f.detectChanges();
      const preparar = () => Array.from(f.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>).find(b => b.textContent === 'Preparar certificado')!;
      expect(preparar().disabled).toBeFalse(); expect(f.nativeElement.textContent).toContain('Participantes');
      const req = http.expectOne('/api/activity-session/15/ponentes-certificacion');
      if (estadoPonentes === 403) req.flush({ message: 'Fuera del ámbito' }, { status: 403, statusText: 'Forbidden' });
      else req.flush({ success: true, data: ponentesSesionPrueba(15, 7) });
      f.detectChanges(); expect(preparar().disabled).toBeFalse(); expect(f.nativeElement.textContent).toContain('Participante elegible');
      expect(f.nativeElement.textContent).toContain('Ponentes');
      if (estadoPonentes === 200) {
        expect(f.nativeElement.textContent).toContain('Maria Perez');
        expect(f.nativeElement.querySelector('app-ponentes-sesion tbody button')).not.toBeNull();
      } else expect(f.nativeElement.querySelector('app-ponentes-sesion [role="alert"]')).not.toBeNull();
      http.expectNone(r => r.method !== 'GET'); f.destroy();
    });
  }
  it('respeta la clasificación, los conteos y la paginación de Laravel para cada sesión', () => {
    const f = iniciar(true);
    (f.componentInstance as any).filtrosPendientes.controls.tipo.setValue('4');
    const abrirSesion = (indice: number) => {
      f.nativeElement.querySelectorAll('[aria-label="Consultar beneficiarios"]')[indice].click();
      f.detectChanges();
    };
    const responderParticipantes = (sesion: number, page: number, nombre: string, persona: number) => {
      const req = http.expectOne(r => r.url === `/api/activity-session/${sesion}/beneficiarios`);
      expect(req.request.params.get('page')).toBe(String(page));
      req.flush({ success: true, data: {
        origen: 'sesion', contexto: { id_actividad: 7, id_sesion: sesion, nombre_sesion: `Sesión ${sesion}` },
        contadores: { inscritos_actividad_vigentes: 45, participantes_sesion: 23, presentes: 21, ausentes: 2, pendientes: 0 },
        beneficiarios: { ...pagina([{ id_participacion: persona, id_persona: persona, id_actividad: 7, id_sesion: sesion,
          nombre_completo: nombre, estado_asistencia: 'PRESENTE', estado_elegibilidad: 'Elegible', motivos: [] }]),
          total: 21, current_page: page, last_page: 2 },
        motivos_bloqueo: [],
      } });
      f.detectChanges();
    };
    const participantes = () => f.nativeElement.querySelector('.beneficiarios-certificacion tbody');
    abrirSesion(0);
    http.expectOne('/api/activity-session/15/ponentes-certificacion').flush({ success: true, data: ponentesSesionPrueba() });
    responderParticipantes(15, 1, 'Participante de la primera sesión', 10);
    expect(f.nativeElement.querySelector('app-ponentes-sesion tbody').textContent).toContain('Maria Perez');
    expect(participantes().textContent).not.toContain('Maria Perez');
    expect(f.nativeElement.querySelector('[aria-label="Resumen de asistencia"]').textContent).toContain('23Inscritos en la sesión');
    const siguiente = Array.from(f.nativeElement.querySelectorAll('nav button') as NodeListOf<HTMLButtonElement>)
      .find(button => button.textContent === 'Siguiente')!;
    siguiente.click();
    responderParticipantes(15, 2, 'Último participante', 11);
    expect(participantes().querySelector('td').textContent.trim()).toBe('21');
    expect(f.nativeElement.textContent).toContain('2 / 2 / 21 beneficiarios');
    f.nativeElement.querySelector('[aria-label="Volver a pendientes"]').click();
    f.detectChanges();

    abrirSesion(1);
    http.expectOne('/api/activity-session/16/ponentes-certificacion').flush({ success: true, data: {
      ...ponentesSesionPrueba(16), ponentes_sesion: [],
    } });
    responderParticipantes(16, 1, 'Maria Perez', 31);
    expect(participantes().textContent).toContain('Maria Perez');
    expect(f.nativeElement.querySelector('app-ponentes-sesion').textContent).toContain('No hay ponentes asignados');
    f.destroy();
  });
  it('exige tipo válido, consulta los IDs reales y vuelve conservando la bandeja', () => {
    const f = iniciar();
    f.nativeElement.querySelector('[aria-label="Consultar beneficiarios"]').click(); f.detectChanges();
    http.expectNone(r => r.url.includes('/beneficiarios'));
    const tipo: HTMLSelectElement = f.nativeElement.querySelector('select');
    tipo.value = '4'; tipo.dispatchEvent(new Event('change')); f.detectChanges();
    const req = http.expectOne(r => r.url === '/api/activity-session/15/beneficiarios');
    expect(req.request.params.get('id_tipo_certificado')).toBe('4');
    req.flush({ success: true, data: { origen: 'sesion', contexto: { id_actividad: 7, id_sesion: 15, nombre_sesion: 'Sesión real' },
      contadores: { inscritos_actividad_vigentes: 2, participantes_sesion: 2, presentes: 2, ausentes: 0, pendientes: 0, por_regularizar: null },
      beneficiarios: pagina([{ id_participacion: 8, id_persona: 10, id_actividad: 7, id_sesion: 15, nombre_completo: 'Persona real', estado_elegibilidad: 'Elegible', motivos: [] }]),
      puede_preparar: false, motivos_bloqueo: ['Preparación no disponible por esquema.'] } });
    f.detectChanges();
    for (const ponentes of http.match(r => r.url === '/api/activity-session/15/ponentes-certificacion')) {
      ponentes.flush({ success: true, data: { origen: 'ponente_sesion', id_actividad: 7, id_sesion: 15,
        ponentes_actividad: [], ponentes_sesion: [], relacion_ponente_sesion_disponible: true,
        puede_preparar: false, motivos_bloqueo: [] } });
    }
    f.detectChanges();
    expect(f.nativeElement.querySelectorAll('.asistencia-tarjeta')[2].querySelector('strong').textContent).toBe('2');
    expect(f.nativeElement.textContent).not.toContain('No determinable');
    expect(f.nativeElement.querySelector('.aviso-asistencia')).toBeNull();
    expect(Array.from(f.nativeElement.querySelectorAll('.asistencia-tarjeta strong')).map((n: any) => n.textContent)).toEqual(['2', '2', '2', '0', '0']);
    expect(f.nativeElement.querySelector('.pasos')).toBeNull();
    const volver = Array.from(f.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>).find(b => b.getAttribute('aria-label') === 'Volver a pendientes')!;
    volver.click(); f.detectChanges();
    expect(f.nativeElement.querySelector('.pendientes-certificacion')).not.toBeNull();
    http.expectNone(r => r.url.includes('pendientes'));
    f.destroy();
  });
});
