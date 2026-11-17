import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { evaluacionOrigenPrueba } from '../../../core/interfaces/emision-certificados/origenes-certificado.fixture';
import { EmisionCertificadosService } from '../../../core/services/emision-certificados/emision-certificados.service';
import { DocumentosDigitalesService } from '../../../core/services/emision-certificados/documentos-digitales.service';
import { MunicipalesIndividualesComponent, recuperarMunicipal } from './municipales-individuales.component';
import { MunicipalContextoService } from './municipal-contexto.service';
import { AuthService } from '../../../core/services/autenticacion/auth.service';

describe('Listado municipal individual', () => {
  let api: jasmine.SpyObj<EmisionCertificadosService>;
  let docs: jasmine.SpyObj<DocumentosDigitalesService>;
  beforeEach(() => {
    api = jasmine.createSpyObj('api', ['listarTodos', 'evaluarOrigen', 'obtener']);
    docs = jasmine.createSpyObj('docs', ['detalleFirmas', 'archivo', 'revisarOrigen', 'consultarReconocimiento']);
    api.listarTodos.and.returnValue(of([{ id_reconocimiento: 71, titulo: 'Servicio municipal', estado: 'PREPARADO' }]) as never);
    api.evaluarOrigen.and.returnValue(of(evaluacionOrigenPrueba('reconocimiento')));
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: AuthService, useValue: { tienePermiso: () => true } },
      { provide: EmisionCertificadosService, useValue: api }, { provide: DocumentosDigitalesService, useValue: docs }] });
  });
  it('verifica beneficiario sin confundir PREPARADO del origen con documento', () => {
    const f = TestBed.createComponent(MunicipalesIndividualesComponent); f.detectChanges();
    expect(f.nativeElement.textContent).toContain('Preparar certificado');
    expect(f.nativeElement.textContent).not.toContain('Continuar preparación');
    expect(api.evaluarOrigen).toHaveBeenCalledOnceWith('reconocimiento', 71);
    expect(docs.archivo).not.toHaveBeenCalled();
    const navegar = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    const c = f.componentInstance as any; c.abrir(c.filas()[0]);
    expect(navegar).toHaveBeenCalledOnceWith(['/certificaciones/generar-emitir/reconocimientos/individual', 71]);
    expect(TestBed.inject(MunicipalContextoService).seleccionado?.evaluacion.id_persona).toBe(31);
    expect(api.listarTodos).toHaveBeenCalledTimes(1);
  });
  it('muestra el bloqueo real sin habilitar preparación', () => {
    api.evaluarOrigen.and.returnValue(of(evaluacionOrigenPrueba('reconocimiento', false)));
    const f = TestBed.createComponent(MunicipalesIndividualesComponent); f.detectChanges();
    expect(f.nativeElement.textContent).toContain('Falta la aprobación institucional.');
    expect(f.nativeElement.querySelector('td button').disabled).toBeTrue();
  });
  it('rechaza documentos de otro beneficiario antes de descargar PDFs', () => {
    const e = evaluacionOrigenPrueba('reconocimiento');
    e.puede_consultar_certificado_existente = true;
    e.certificados_existentes = [{ id_certificado: 151, id_persona: 31, id_tipo_certificado: 47, id_reconocimiento: 71, id_practica: null, estado: 'PREPARADO' }];
    docs.consultarReconocimiento.and.returnValue(of({ origen: 'reconocimiento', id_certificado: 151, beneficiario: { id_persona: 99 }, id_reconocimiento: 71, id_certificado_documento: 201 }) as never);
    let error: unknown; recuperarMunicipal(api, docs, e).subscribe({ error: e => error = e });
    expect(error).toBeTruthy(); expect(docs.detalleFirmas).not.toHaveBeenCalled(); expect(docs.archivo).not.toHaveBeenCalled();
  });
  for (const [estado, confirmado, accion] of [
    ['PREPARADO', false, 'Continuar preparación'], ['PENDIENTE_FIRMA', false, 'En revisión por Gerencia'],
    ['PENDIENTE_FIRMA', true, 'Ver certificado'], ['ANULADO', false, 'Anulado'],
  ] as const) {
    it('mapea documento ' + estado + ' confirmado=' + confirmado, () => {
      const f = TestBed.createComponent(MunicipalesIndividualesComponent); const c = f.componentInstance as any;
      const fila = { evaluacion: evaluacionOrigenPrueba('reconocimiento'), documento: {
        id_certificado_documento: 201, estado_certificado: estado, pdf_confirmado: confirmado, disponible_rrhh: confirmado,
      } };
      expect(c.accion(fila)).toBe(accion);
      expect(c.habilitada(fila)).toBe(['Continuar preparación', 'Ver certificado'].includes(accion));
    });
  }
});
