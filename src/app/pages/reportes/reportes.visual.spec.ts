import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from '../../core/services/autenticacion/auth.service';
import { IndicadoresGeneralesComponent } from './indicadores-generales/indicadores-generales.component';
import { ReportesActividadesComponent } from './reportes-actividades/reportes-actividades.component';
import { ReportesCertificadosComponent } from './reportes-certificados/reportes-certificados.component';
import { ReportesAsistenciaComponent } from './reportes-asistencia/reportes-asistencia.component';

describe('Presentación adaptable de Reportes', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [
    provideHttpClient(), provideHttpClientTesting(),
    { provide: AuthService, useValue: { tienePermiso: () => false } },
  ] }));

  for (const [ancho, columnas] of [[320, 1], [768, 2], [1280, 4]]) {
    it(`distribuye los indicadores en ${columnas} columnas a ${ancho}px sin desbordamiento`, () => {
      const fixture = TestBed.createComponent(IndicadoresGeneralesComponent);
      const host = fixture.nativeElement as HTMLElement;
      host.style.width = `${ancho}px`;
      fixture.detectChanges();
      const grid = host.querySelector<HTMLElement>('.tarjetas')!;
      expect(getComputedStyle(grid).gridTemplateColumns.split(' ').length).toBe(columnas);
      expect(host.scrollWidth).toBeLessThanOrEqual(host.clientWidth + 1);
      expect(host.querySelectorAll('.tarjetas .sin-dato').length).toBe(4);
      expect(host.querySelectorAll('.tarjetas .error').length).toBe(0);
      fixture.destroy();
    });
  }

  it('integra skeletons por tarjeta y permite desplegar el criterio del conteo', () => {
    const fixture = TestBed.createComponent(IndicadoresGeneralesComponent);
    fixture.detectChanges();
    fixture.componentInstance.cargando.set(true);
    fixture.componentInstance.indicadores.update(tarjetas => tarjetas.map(item => ({ ...item, estado: 'cargando' })));
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelectorAll('.skeleton').length).toBe(4);
    expect(host.querySelector('[aria-busy="true"]')).not.toBeNull();
    expect(host.querySelector('[role="status"]')?.getAttribute('aria-label')).toBe('Consultando Actividades registradas');
    const detalle = host.querySelector<HTMLDetailsElement>('.tarjeta details')!;
    expect(detalle.open).toBeFalse();
    detalle.querySelector('summary')!.click();
    expect(detalle.open).toBeTrue();
    fixture.destroy();
  });

  for (const componente of [ReportesActividadesComponent, ReportesCertificadosComponent, ReportesAsistenciaComponent]) {
    it(`${componente.name}: filtros y botones caben en un ancho móvil de 320px`, () => {
      const fixture = TestBed.createComponent<unknown>(componente);
      const host = fixture.nativeElement as HTMLElement;
      host.style.width = '320px';
      fixture.detectChanges();
      expect(host.scrollWidth).toBeLessThanOrEqual(host.clientWidth + 1);
      for (const boton of Array.from(host.querySelectorAll('button'))) {
        expect(boton.scrollWidth).toBeLessThanOrEqual(boton.clientWidth + 1);
      }
      fixture.destroy();
    });
  }

  it('la tabla conserva el desplazamiento horizontal dentro de su contenedor', () => {
    const fixture = TestBed.createComponent(ReportesCertificadosComponent);
    const host = fixture.nativeElement as HTMLElement;
    host.style.width = '320px';
    fixture.detectChanges();
    fixture.componentInstance.pagina.set({ data: [{ id_certificado: 1, id_tipo_certificado: 2, fecha_emision: null, estado: true } as never], total: 1, current_page: 1, last_page: 1, per_page: 20 });
    fixture.detectChanges();
    const tabla = host.querySelector<HTMLElement>('.tabla')!;
    expect(getComputedStyle(tabla).overflowX).toBe('auto');
    expect(tabla.scrollWidth).toBeGreaterThan(tabla.clientWidth);
    expect(host.scrollWidth).toBeLessThanOrEqual(host.clientWidth + 1);
    expect(host.querySelector('.badge-exito')?.textContent?.trim()).toBe('Activo');
    fixture.destroy();
  });
});
