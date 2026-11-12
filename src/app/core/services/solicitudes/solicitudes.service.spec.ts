import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { IntegracionSolicitudesPendiente, SOLICITUDES_GATEWAY, SolicitudesService } from './solicitudes.service';

describe('Solicitudes con rutas pendientes y sin almacén temporal', () => {
  it('rechaza todas las operaciones sin HTTP, sin registros ni confirmaciones ficticias', () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), { provide: SOLICITUDES_GATEWAY, useValue: null }] });
    const api = TestBed.inject(SolicitudesService);
    const http = TestBed.inject(HttpTestingController);
    const filtro = { busqueda: '', estado: '', desde: '', hasta: '', pagina: 1 };
    const datos = { areaId: '2', tipoId: '3', nombre: 'Prueba', objetivo: 'Prueba', descripcion: '', lugar: '', inicio: '2026-12-01', fin: '2026-12-02', observaciones: '' };
    expect(api.integrado).toBeFalse(); expect(api.modo).toBe('pendiente');
    const operaciones: Observable<unknown>[] = [api.contexto(), api.listar('propias', filtro), api.listar('revision', filtro), api.listar('gerencia', filtro),
      api.detalle('1'), api.guardar(datos, null), api.decidir('1', '', 'Enviar', ''), api.decidir('1', '', 'Aprobar', ''),
      api.decidir('1', '', 'Rechazar', 'Prueba'), api.documentos(1), api.documento('1')];
    let errores = 0;
    for (const operacion of operaciones) operacion.subscribe({ next: () => fail('No debe devolver datos'), error: error => {
      expect(error instanceof IntegracionSolicitudesPendiente).toBeTrue(); errores++;
    } });
    expect(errores).toBe(operaciones.length);
    http.expectNone(() => true); http.verify();
  });
});
