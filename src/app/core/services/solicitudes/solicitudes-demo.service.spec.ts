import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DatosSolicitud, Solicitud } from '../../interfaces/solicitudes/solicitud.interface';
import { AuthService } from '../autenticacion/auth.service';
import { SOLICITUDES_GATEWAY, SolicitudesService } from './solicitudes.service';

describe('Solicitudes temporales separadas de Laravel', () => {
  const usuario = signal<{ id: number; nombre: string } | null>(null);
  const datos: DatosSolicitud = { areaId: '2', tipoId: '3', nombre: 'Propuesta de prueba', descripcion: '', objetivo: 'Comprobar el flujo', inicio: '2026-12-01', fin: '2026-12-02', lugar: '', observaciones: '' };
  const filtro = { busqueda: '', estado: '', desde: '', hasta: '', pagina: 1 };
  let api: SolicitudesService; let http: HttpTestingController;
  beforeEach(() => {
    usuario.set({ id: 1, nombre: 'Cuenta de prueba' });
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(),
      { provide: AuthService, useValue: { usuario } }, { provide: SOLICITUDES_GATEWAY, useValue: null }] });
    api = TestBed.inject(SolicitudesService); http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => { http.expectNone(() => true); http.verify(); });
  it('guarda, edita y envía un único registro en memoria sin HttpClient ni persistencia oficial', () => {
    let fila!: Solicitud;
    api.guardar(datos, null, { area: 'Área del catálogo de prueba', tipo: 'Tipo del catálogo de prueba' }).subscribe(valor => fila = valor);
    expect(api.integrado).toBeFalse(); expect(fila.id).toMatch(/^demo-/); expect(fila.demostracion).toBeTrue(); expect(fila.estado).toBe('Borrador');
    api.listar('propias', filtro).subscribe(pagina => { expect(pagina.total).toBe(1); expect(pagina.registros[0].estado).toBe('Borrador'); });
    api.guardar({ ...datos, nombre: 'Corrección temporal' }, { id: fila.id, version: '' }).subscribe(valor => expect(valor.id).toBe(fila.id));
    api.decidir(fila.id, '', 'Enviar', '').subscribe(valor => { expect(valor.estado).toBe('Enviada'); expect(valor.puedeEditar).toBeFalse(); });
    api.listar('propias', { ...filtro, estado: 'Enviada' }).subscribe(pagina => { expect(pagina.total).toBe(1); expect(pagina.registros[0].nombre).toBe('Corrección temporal'); });
  });
  it('rechaza un formulario inválido, el envío duplicado y las decisiones administrativas', () => {
    let errores = 0; let fila!: Solicitud;
    api.guardar({ ...datos, nombre: '', inicio: '2026-02-30' }, null).subscribe({ error: () => errores++ });
    api.listar('propias', filtro).subscribe(pagina => expect(pagina.total).toBe(0));
    api.guardar(datos, null).subscribe(valor => fila = valor); api.decidir(fila.id, '', 'Enviar', '').subscribe();
    api.decidir(fila.id, '', 'Enviar', '').subscribe({ error: () => errores++ });
    api.decidir(fila.id, '', 'Aprobar', '').subscribe({ error: () => errores++ });
    api.guardar(datos, { id: fila.id, version: '' }).subscribe({ error: () => errores++ }); expect(errores).toBe(4);
  });
  it('elimina los temporales al cambiar de usuario o cerrar sesión', () => {
    let id = ''; api.guardar(datos, null).subscribe(fila => id = fila.id);
    usuario.set({ id: 2, nombre: 'Otra cuenta de prueba' });
    api.listar('propias', filtro).subscribe(pagina => expect(pagina.total).toBe(0));
    api.detalle(id).subscribe({ next: () => fail('No debe acceder a otro usuario'), error: () => {} });
    api.guardar(datos, null).subscribe(); usuario.set(null); expect(api.demostracionDisponible).toBeFalse();
    usuario.set({ id: 2, nombre: 'Otra cuenta de prueba' }); api.listar('propias', filtro).subscribe(pagina => expect(pagina.total).toBe(0));
  });
});
