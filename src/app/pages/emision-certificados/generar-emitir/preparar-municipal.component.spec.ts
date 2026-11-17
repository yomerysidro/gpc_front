import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { evaluacionOrigenPrueba } from '../../../core/interfaces/emision-certificados/origenes-certificado.fixture';
import { EmisionCertificadosService } from '../../../core/services/emision-certificados/emision-certificados.service';
import { DocumentosDigitalesService } from '../../../core/services/emision-certificados/documentos-digitales.service';
import { MunicipalContextoService } from './municipal-contexto.service';
import { PrepararMunicipalComponent } from './preparar-municipal.component';

describe('Entrada directa al asistente municipal', () => {
  let api: jasmine.SpyObj<EmisionCertificadosService>;
  beforeEach(() => {
    api = jasmine.createSpyObj('api', ['evaluarOrigen', 'listarTodos']);
    api.evaluarOrigen.and.returnValue(of(evaluacionOrigenPrueba('reconocimiento')));
    TestBed.configureTestingModule({ providers: [provideRouter([]),
      { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ reconocimientoId: '71' }) } } },
      { provide: EmisionCertificadosService, useValue: api },
      { provide: DocumentosDigitalesService, useValue: {} },
    ] }).overrideComponent(PrepararMunicipalComponent, { set: { template: '', imports: [] } });
  });
  it('consume contexto efímero sin consultar listas ni repetir la evaluación', () => {
    TestBed.inject(MunicipalContextoService).seleccionado = { evaluacion: evaluacionOrigenPrueba('reconocimiento'), documento: null };
    const c = TestBed.createComponent(PrepararMunicipalComponent).componentInstance as any;
    expect(c.evaluacion().id_persona).toBe(31);
    expect(api.evaluarOrigen).not.toHaveBeenCalled(); expect(api.listarTodos).not.toHaveBeenCalled();
    expect(TestBed.inject(MunicipalContextoService).seleccionado).toBeNull();
  });
  it('al recargar consulta exclusivamente el origen seleccionado', () => {
    TestBed.createComponent(PrepararMunicipalComponent);
    expect(api.evaluarOrigen).toHaveBeenCalledOnceWith('reconocimiento', 71);
    expect(api.listarTodos).not.toHaveBeenCalled();
  });
  it('abre el visor directamente para un certificado confirmado', () => {
    const navegar = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    TestBed.inject(MunicipalContextoService).seleccionado = { evaluacion: evaluacionOrigenPrueba('reconocimiento'), documento: {
      id_certificado: 151, id_certificado_documento: 201, estado_certificado: 'PENDIENTE_FIRMA', pdf_confirmado: true, disponible_rrhh: true,
    } as never };
    const c = TestBed.createComponent(PrepararMunicipalComponent).componentInstance as any;
    expect(navegar).toHaveBeenCalledOnceWith(['/certificaciones/certificados', 151, 'documentos', 201, 'visor'], { replaceUrl: true });
    expect(c.evaluacion()).toBeNull();
  });
});
