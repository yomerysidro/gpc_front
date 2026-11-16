import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FirmantesMunicipalesService } from './firmantes-municipales.service';
import { FirmaDocumentalService } from './firma-documental.service';

describe('Configuración de habilitación y candidatos de Gerencia', () => {
  let http: HttpTestingController;
  let municipales: FirmantesMunicipalesService;
  let firmas: FirmaDocumentalService;
  const base = '/api/funcionarios-firmantes';
  const candidatos = '/api/certificados-documentos/31/firma/firmantes-disponibles';
  const anton = { id_persona_trabajador: 1, id_persona: 7, nombre: 'Antón Talián', cargo: 'Jefe de Informática', area: 'Informática', id_area: 2,
    vigente: true, estado_laboral: 'Vigente', elegible_laboralmente: true, habilitado_firma_certificados: false, disponible_asignacion: false };
  const maria = { ...anton, id_persona_trabajador: 2, id_persona: 8, nombre: 'Maria Perez', cargo: 'Especialista de RR. HH.' };
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController); municipales = TestBed.inject(FirmantesMunicipalesService); firmas = TestBed.inject(FirmaDocumentalService);
  });
  afterEach(() => http.verify());
  it('refleja alta, baja y reconsulta usando solo autorización persistida y candidatos por documento', () => {
    firmas.disponibles(31).subscribe(filas => expect(filas).toEqual([]));
    http.expectOne(candidatos).flush({ success: true, data: [] });
    const a = { ...anton, habilitado_firma_certificados: true, disponible_asignacion: true };
    const m = { ...maria, habilitado_firma_certificados: true, disponible_asignacion: true };
    for (const t of [a, m]) {
      municipales.habilitar(t.id_persona_trabajador).subscribe(f => expect(f.habilitado_firma_certificados).toBeTrue());
      const r = http.expectOne(base + '/habilitar'); expect(r.request.body).toEqual({ id_persona_trabajador: t.id_persona_trabajador });
      r.flush({ success: true, data: { completada: true, persistido: true, reintento: false, funcionario: t } });
    }
    municipales.cargar().subscribe(filas => expect(filas.map(t => t.habilitado_firma_certificados)).toEqual([true, true]));
    http.expectOne(base + '/trabajadores').flush({ success: true, data: { funcionarios: [a, m] } });
    firmas.disponibles(31).subscribe(filas => expect(filas.map(t => t.id_persona_trabajador)).toEqual([1, 2]));
    http.expectOne(candidatos).flush({ success: true, data: [a, m] });
    municipales.deshabilitar(1).subscribe(f => expect(f.habilitado_firma_certificados).toBeFalse());
    const baja = http.expectOne(base + '/1/habilitacion'); expect(baja.request.method).toBe('DELETE');
    baja.flush({ success: true, data: { completada: true, persistido: true, reintento: false, funcionario: anton } });
    firmas.disponibles(31).subscribe(filas => expect(filas.map(t => t.id_persona_trabajador)).toEqual([2]));
    const nueva = http.expectOne(candidatos); expect(nueva.request.headers.get('Cache-Control')).toContain('no-cache');
    nueva.flush({ success: true, data: [m] });
    http.expectNone(r => r.url.includes('/asignar') || r.url.includes('/confirmar-pdf'));
  });
  it('no filtra responsables históricos deshabilitados al consultar asignaciones de un documento', () => {
    firmas.asignados(31).subscribe(p => expect(p.firmantes_asignados?.map(t => t.id_persona_trabajador)).toEqual([1]));
    http.expectOne('/api/certificados-documentos/31/firma/firmantes-asignados').flush({ success: true, data: {
      firmantes_asignados: [{ ...anton, orden_firma: 1, id_firma: null }], pdf_revisado_disponible: true, disponible_rrhh: true,
    } });
    http.expectNone(r => r.method !== 'GET');
  });
});
