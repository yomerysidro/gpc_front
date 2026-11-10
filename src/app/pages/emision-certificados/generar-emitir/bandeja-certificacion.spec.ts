import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { GenerarEmitirComponent } from './generar-emitir.component';

describe('Bandeja de certificación y beneficiarios', () => {
  let http: HttpTestingController;
  const pagina = (data: unknown[]) => ({ data, total: data.length, current_page: 1, last_page: 1, per_page: 20 });
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(),
      { provide: AuthService, useValue: { tienePermiso: () => true } }] });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  function iniciar() {
    const fixture = TestBed.createComponent(GenerarEmitirComponent);
    http.expectOne(r => r.url === '/api/certificaciones/pendientes').flush({ success: true, data: pagina([
      { origen: 'sesion', id_actividad: 7, id_sesion: 15, nombre_actividad: 'Actividad real', nombre_sesion: 'Sesión real',
        total_participantes_inscritos: 2, total_elegibles: 2, total_pendientes: 0, estado_sesion: 'Finalizada', motivos_bloqueo: [] },
    ]) });
    http.expectOne(r => r.url === '/api/tipos-certificado/list').flush({ success: true, data: pagina([{ id_tipo_certificado: 4, nombre_tipo: 'Asistencia' }]) });
    http.expectOne('/api/activity').flush({ success: true, data: [] });
    http.expectOne('/api/activity-session').flush({ success: true, data: [] });
    fixture.detectChanges(); return fixture;
  }
  it('abre dos pestañas, oculta el asistente y no carga certificados generales al entrar', () => {
    const f = iniciar();
    expect(f.nativeElement.querySelectorAll('[role="tab"]').length).toBe(2);
    expect(f.nativeElement.querySelector('.pasos')).toBeNull();
    expect(f.nativeElement.querySelector('app-formulario-certificado')).toBeNull();
    http.expectNone(r => r.url.includes('/certificados/'));
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
    expect(f.nativeElement.textContent).toContain('2 presentes');
    expect(f.nativeElement.textContent).toContain('No determinable');
    expect(f.nativeElement.querySelector('.pasos')).toBeNull();
    const volver = Array.from(f.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>).find(b => b.textContent === 'Volver a pendientes')!;
    volver.click(); f.detectChanges();
    expect(f.nativeElement.querySelector('.pendientes-certificacion')).not.toBeNull();
    http.expectNone(r => r.url.includes('pendientes'));
    f.destroy();
  });
});
