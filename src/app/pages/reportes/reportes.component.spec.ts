import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of, Subject } from 'rxjs';
import { AuthService } from '../../core/services/autenticacion/auth.service';
import { ReportesService } from '../../core/services/reportes/reportes.service';
import { PaginaEmision, CertificadoRow } from '../../core/interfaces/emision-certificados/emision-certificados.interface';
import { SIDEBAR_CONFIG, resolverGruposSidebar } from '../../components/sidebar/modulos-navegacion';
import { ReportesCertificadosComponent } from './reportes-certificados/reportes-certificados.component';
import { ReportesAsistenciaComponent } from './reportes-asistencia/reportes-asistencia.component';
import { ReportesActividadesComponent } from './reportes-actividades/reportes-actividades.component';
import { IndicadoresGeneralesComponent } from './indicadores-generales/indicadores-generales.component';
import { REPORTES_ROUTES } from './reportes.routes';

describe('Reportes: alcance y autorización', () => {
  let permisos: Set<string>;
  let http: HttpTestingController;
  beforeEach(() => {
    permisos = new Set(['reportes.ver']);
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([
      { path: 'reportes', children: REPORTES_ROUTES },
      { path: 'acceso-denegado', component: ReportesAsistenciaComponent },
    ]), { provide: AuthService, useValue: { cargarSesion: () => of(true), tienePermiso: (clave: string) => permisos.has(clave), usuario: signal(null), modulos: signal([]) } }] });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('reportes.ver por sí solo no consulta conteos sin permisos de origen', () => {
    const fixture = TestBed.createComponent(IndicadoresGeneralesComponent);
    fixture.detectChanges(); fixture.componentInstance.consultar();
    expect(fixture.componentInstance.indicadores().every(item => item.estado === 'sin-permiso' && item.valor === null)).toBeTrue();
    http.expectNone(() => true);
  });

  it('las cuatro opciones usan reportes.ver y Actividades ya no se marca pendiente', () => {
    const entradas = SIDEBAR_CONFIG.find(grupo => grupo.id === 'reportes')!.hijos;
    expect(entradas.length).toBe(4);
    expect(entradas.every(entrada => entrada.permiso === 'reportes.ver')).toBeTrue();
    expect(entradas.find(entrada => entrada.id === 'reportes-actividades')?.pendiente).toBeUndefined();
    expect(resolverGruposSidebar(() => false, []).some(grupo => grupo.id === 'reportes')).toBeFalse();
    expect(resolverGruposSidebar(clave => clave === 'reportes.ver', []).map(grupo => grupo.id)).toEqual(['reportes']);
  });

  it('deniega una URL de reportes sin su permiso', async () => {
    permisos.clear();
    await RouterTestingHarness.create('/reportes/certificados');
    expect(TestBed.inject(Router).url).toBe('/acceso-denegado');
    http.expectNone(() => true);
  });

  it('asistencia nunca descarga listados ilimitados ni calcula ausencias', () => {
    const fixture = TestBed.createComponent(ReportesAsistenciaComponent);
    fixture.detectChanges(); fixture.componentInstance.consultar(); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Consulta no disponible');
    expect(fixture.nativeElement.querySelector('table')).toBeNull();
    http.expectNone(() => true);
  });

  it('rechaza fechas invertidas antes de consultar una actividad', () => {
    const componente = TestBed.createComponent(ReportesActividadesComponent).componentInstance;
    componente.inicio = '2026-11-04'; componente.fin = '2026-11-03'; componente.consultar();
    expect(componente.error()).toContain('posterior');
    http.expectNone(() => true);
  });

  it('certificados sin permiso de Emisión no consulta el backend', () => {
    const fixture = TestBed.createComponent(ReportesCertificadosComponent);
    fixture.detectChanges(); fixture.componentInstance.consultar();
    expect(fixture.componentInstance.error()).toContain('emision.ver');
    http.expectNone(() => true);
  });

  it('no repite una solicitud en curso y elimina datos anteriores si falla', () => {
    permisos.add('emision.ver');
    const respuesta = new Subject<PaginaEmision<CertificadoRow>>();
    const servicio = TestBed.inject(ReportesService);
    spyOn(servicio, 'tipos').and.returnValue(of({ data: [], total: 0, current_page: 1, last_page: 1, per_page: 20 }));
    const consultar = spyOn(servicio, 'certificados').and.returnValue(respuesta);
    const componente = TestBed.createComponent(ReportesCertificadosComponent).componentInstance;
    componente.consultar(); componente.consultar();
    expect(consultar).toHaveBeenCalledTimes(1);
    respuesta.error({ status: 500 });
    expect(componente.pagina()).toBeNull();
    expect(componente.error()).toContain('servidor');
    expect(componente.cargando()).toBeFalse();
  });

  it('un filtro local nunca cambia el total global ni considera sin fecha como emitido', () => {
    const componente = TestBed.createComponent(ReportesCertificadosComponent).componentInstance;
    componente.pagina.set({ data: [
      { id_certificado: 1, fecha_emision: '2026-11-03', estado: true },
      { id_certificado: 2, fecha_emision: null, estado: true },
    ] as CertificadoRow[], total: 200, current_page: 1, last_page: 10, per_page: 20 });
    componente.aplicado = { inicio: '2026-11-01', fin: '2026-11-30', busqueda: '', tipo: '', estado: '' };
    expect(componente.filas().length).toBe(1);
    expect(componente.pagina()?.total).toBe(200);
    expect(componente.conFecha()).toBe(1);
  });

  it('conserva el tipo seleccionado al navegar el catálogo sin acumular páginas', () => {
    const componente = TestBed.createComponent(ReportesCertificadosComponent).componentInstance;
    componente.catalogo.set({ data: [{ id_tipo_certificado: 1, nombre_tipo: 'Constancia', estado: 'Activo' }], total: 2, current_page: 1, last_page: 2, per_page: 1 });
    componente.tipo = '1'; componente.seleccionarTipo('1');
    componente.catalogo.set({ data: [{ id_tipo_certificado: 2, nombre_tipo: 'Diploma', estado: 'Activo' }], total: 2, current_page: 2, last_page: 2, per_page: 1 });
    expect(componente.nombreTipo(1)).toBe('Constancia');
    expect(componente.tiposDisponibles().length).toBe(2);
    componente.seleccionarTipo('');
    expect(componente.tiposDisponibles().length).toBe(1);
    http.expectNone(() => true);
  });
});
