import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { of, Subject, throwError } from 'rxjs';
import { ApiResponse } from '../../../core/interfaces/api/api-response.interface';
import { Actividad } from '../../../core/interfaces/actividades/actividad.interface';
import { ActividadesService } from '../../../core/services/actividades/actividades.service';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { ListarActividadesComponent } from './listar-actividades.component';

const ACTIVIDAD: Actividad = {
  origen: 'sin_solicitud', id_solicitud_actividad: null,
  id_actividad: 7, id_area: 2, id_tipo_actividad: 3, nombre: 'Jornada de formación',
  descripcion: 'Formación para el equipo.', fecha_inicio: '2026-10-01', fecha_fin: '2026-10-02', sede: 'Auditorio', estado: 'Activa',
};

describe('Pantalla de Actividades', () => {
  let fixture: ComponentFixture<ListarActividadesComponent>;
  let servicio: jasmine.SpyObj<ActividadesService>;
  let permisos: WritableSignal<readonly string[]>;
  const $ = <T extends HTMLElement = HTMLElement>(selector: string): T => fixture.nativeElement.querySelector(selector);
  const boton = (texto: string): HTMLButtonElement => Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
    .find(item => item.textContent?.replace(/chevron_left|chevron_right/g, '').trim() === texto)!;
  async function escribir(selector: string, valor: string): Promise<void> {
    const campo = $<HTMLInputElement | HTMLSelectElement>(selector);
    campo.value = valor;
    campo.dispatchEvent(new Event(campo.tagName === 'SELECT' ? 'change' : 'input'));
    await fixture.whenStable();
  }
  async function abrirPanel(): Promise<void> {
    if (!$<HTMLDialogElement>('.modal-acciones dialog')?.open) {
      $<HTMLButtonElement>('tbody button[title="Gestionar actividad"]').click(); await fixture.whenStable();
    }
  }
  async function accion(titulo: string): Promise<void> {
    await abrirPanel(); $<HTMLButtonElement>('.panel-acciones button[title="' + titulo + '"]').click(); await fixture.whenStable();
  }
  async function completar(): Promise<void> {
    for (const [selector, valor] of Object.entries({
      '#actividad-area': '2', '#actividad-tipo': '3', '#actividad-nombre': ' Nueva jornada ',
      '#actividad-inicio': '2026-10-01', '#actividad-fin': '2026-10-02', '#actividad-estado': 'Activa',
    })) await escribir(selector, valor);
  }
  async function guardar(): Promise<void> {
    $('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
  }

  beforeEach(async () => {
    permisos = signal<readonly string[]>(['actividades.ver', 'actividades.crear', 'actividades.editar', 'actividades.eliminar', 'participantes.ver', 'ponentes-firmantes.ver', 'ponentes-firmantes.crear', 'ponentes-firmantes.eliminar']);
    servicio = jasmine.createSpyObj<ActividadesService>('ActividadesService', [
      'listar', 'listarAreas', 'listarTipos', 'obtener', 'crear', 'actualizar', 'eliminar', 'consultarPonentes', 'cambiarEstado', 'listarCatalogoPonentes', 'vincularPonente', 'desvincularPonente',
    ]);
    servicio.listar.and.returnValue(of([ACTIVIDAD]));
    servicio.listarAreas.and.returnValue(of([{ id_area: 2, nombre: 'Capacitación' }]));
    servicio.listarTipos.and.returnValue(of([{ id_tipo_actividad: 3, nombre: 'Jornada', descripcion: null, estado: true }]));
    servicio.obtener.and.returnValue(of(ACTIVIDAD));
    servicio.crear.and.returnValue(of({ success: true, message: 'Actividad registrada.', data: ACTIVIDAD }));
    servicio.actualizar.and.returnValue(of({ success: true, message: 'Actividad actualizada.', data: ACTIVIDAD }));
    servicio.consultarPonentes.and.returnValue(of([]));
    servicio.listarCatalogoPonentes.and.returnValue(of([{ id_persona_ponente: 8, nombre: 'Ana Perez' }]));
    TestBed.configureTestingModule({ imports: [ListarActividadesComponent], providers: [
      provideRouter([]),
      { provide: ActividadesService, useValue: servicio },
      { provide: AuthService, useValue: { tienePermiso: (clave: string) => permisos().includes(clave) } },
    ] });
    fixture = TestBed.createComponent(ListarActividadesComponent);
    fixture.autoDetectChanges();
    await fixture.whenStable();
  });

  it('impide crear directamente incluso con permiso de creaci?n', async () => {
    expect(fixture.nativeElement.textContent).not.toContain('Nueva actividad');
    const modelo = fixture.componentInstance as unknown as { abrirFormulario(a: null): void; guardar(): void; formularioAbierto(): boolean };
    modelo.abrirFormulario(null); modelo.guardar(); await fixture.whenStable();
    expect(modelo.formularioAbierto()).toBeFalse(); expect(servicio.crear).not.toHaveBeenCalled();
    await abrirPanel(); expect($('button[title=Editar]')).not.toBeNull();
  });
  it('rechaza un área fuera del catálogo también al editar', async () => {
    await accion('Editar');
    const modelo = fixture.componentInstance as unknown as { form: FormGroup };
    modelo.form.controls['id_area'].setValue('999'); await guardar();
    expect(servicio.actualizar).not.toHaveBeenCalled(); expect($('.formulario [role=alert]').textContent).toContain('autorizados');
  });
  it('muestra el origen de solicitud y protege su eliminación, conservando ID y navegación', async () => {
    fixture.destroy();
    const vinculada: Actividad = { ...ACTIVIDAD, origen: 'solicitud', id_solicitud_actividad: 12 };
    servicio.listar.and.returnValue(of([vinculada])); servicio.obtener.and.returnValue(of(vinculada));
    fixture = TestBed.createComponent(ListarActividadesComponent); fixture.autoDetectChanges(); await fixture.whenStable();
    expect($('tbody .nombre-actividad').textContent?.trim()).toBe(vinculada.nombre);
    expect($('tbody button[title=Eliminar]')).toBeNull();
    await accion('Ver detalle'); await fixture.whenStable();
    expect($('app-dialogo .detalle').textContent).toContain('Solicitud #12');
    await abrirPanel();
    expect($('a[href="/certificaciones/participantes?id_actividad=7"]')).not.toBeNull();
    expect($('a[href="/certificaciones/sesiones-asistencia?id_actividad=7"]')).not.toBeNull();
    expect(servicio.crear).not.toHaveBeenCalled();
  });
  it('resuelve los nombres reales y busca sin distinguir tildes; no crea Header ni Sidebar', async () => {
    expect($('tbody').textContent).toContain('Capacitación');
    expect($('tbody').textContent).toContain('Jornada');
    expect($('tbody').textContent).toContain('01/10/2026');
    expect($('tbody').textContent).not.toContain('ID área: 2');
    expect($('tbody').textContent).not.toContain('ID tipo: 3');
    expect($('app-sidebar')).toBeNull();
    expect($('app-header')).toBeNull();
    await escribir('#buscar-actividad', 'no existe');
    expect($('.estado-vacio').textContent).toContain('No se encontraron');
    await escribir('#buscar-actividad', 'FORMACION');
    expect($('tbody').textContent).toContain(ACTIVIDAD.nombre);
  });

  it('restablece los filtros combinados y la página al limpiar', async () => {
    fixture.destroy();
    servicio.listar.and.returnValue(of(Array.from({ length: 11 }, (_, indice) => ({ ...ACTIVIDAD, id_actividad: indice + 1 }))));
    fixture = TestBed.createComponent(ListarActividadesComponent);
    fixture.autoDetectChanges();
    await fixture.whenStable();
    boton('Siguiente').click();
    await fixture.whenStable();
    expect($('.paginacion').textContent).toContain('Página 2 de 2');
    boton('Limpiar filtros').click();
    await fixture.whenStable();
    expect($('.paginacion').textContent).toContain('Página 1 de 2');
    await escribir('#buscar-actividad', 'FORMACION');
    await escribir('#filtrar-area', '2');
    expect($('tbody').textContent).toContain(ACTIVIDAD.nombre);
    boton('Limpiar filtros').click();
    await fixture.whenStable();
    expect($<HTMLInputElement>('#buscar-actividad').value).toBe('');
    for (const selector of ['#filtrar-area']) {
      expect($<HTMLSelectElement>(selector).value).toBe('');
    }
    expect($('tbody').textContent).toContain(ACTIVIDAD.nombre);
  });

  it('muestra el estado vacío únicamente cuando Laravel devuelve una lista vacía', async () => {
    fixture.destroy();
    servicio.listar.and.returnValue(of([]));
    fixture = TestBed.createComponent(ListarActividadesComponent);
    fixture.autoDetectChanges();
    await fixture.whenStable();
    expect($('.estado-vacio').textContent).toContain('Aún no hay actividades registradas.');
    expect($('.estado-vacio').textContent).toContain('Las actividades nuevas se originan en solicitudes aprobadas por Gerencia.');
    expect($('[role=alert]')).toBeNull();
  });

  it('pagina el conjunto completo con 10, 20 y 50 y vuelve al inicio al cambiar el tamaño', async () => {
    fixture.destroy();
    servicio.listar.and.returnValue(of(Array.from({ length: 55 }, (_, indice) => ({ ...ACTIVIDAD, id_actividad: indice + 1 }))));
    fixture = TestBed.createComponent(ListarActividadesComponent);
    fixture.autoDetectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(10);
    expect($('.paginacion').textContent).toContain('1–10 de 55');
    boton('Siguiente').click();
    await fixture.whenStable();
    expect($('.paginacion').textContent).toContain('11–20 de 55');
    await escribir('#tamano-pagina', '20');
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(20);
    expect($('.paginacion').textContent).toContain('1–20 de 55');
    await escribir('#tamano-pagina', '50');
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(50);
    boton('Siguiente').click();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(5);
    expect($('.paginacion').textContent).toContain('51–55 de 55');
    expect(boton('Siguiente').disabled).toBeTrue();
  });

  it('confirma cerrar, actualiza solo con respuesta del servidor y no ofrece reactivación en el panel', async () => {
    const respuesta = new Subject<ApiResponse<Actividad>>();
    servicio.cambiarEstado.and.returnValue(respuesta);
    await accion('Cerrar actividad');
    await fixture.whenStable();
    expect(servicio.cambiarEstado).not.toHaveBeenCalled();
    boton('Cancelar').click();
    await fixture.whenStable();
    expect(servicio.cambiarEstado).not.toHaveBeenCalled();
    await accion('Cerrar actividad');
    await fixture.whenStable();
    boton('Cerrar actividad').click();
    await fixture.whenStable();
    expect(servicio.cambiarEstado).toHaveBeenCalledOnceWith(7, 'Cerrada');
    expect($('.badge-exito').textContent).toBe('Activa');
    servicio.listar.and.returnValue(of([{ ...ACTIVIDAD, estado: 'Cerrada' }]));
    respuesta.next({ success: true, message: 'Actividad actualizada.', data: { ...ACTIVIDAD, estado: 'Cerrada' } });
    respuesta.complete();
    await fixture.whenStable();
    expect($('tbody .badge-exito')).toBeNull();
    expect($('tbody .badge').textContent).toBe('Cerrada');
    await abrirPanel();
    expect($<HTMLButtonElement>('button[title="Cerrar actividad"]').disabled).toBeTrue();
  });

  it('conserva el estado si Laravel rechaza el cambio y oculta la acción sin permiso de edición', async () => {
    servicio.cambiarEstado.and.returnValue(throwError(() => ({ status: 403, mensaje: 'No autorizado.', errores: {} })));
    await accion('Cerrar actividad');
    await fixture.whenStable();
    boton('Cerrar actividad').click();
    await fixture.whenStable();
    expect($('tbody .badge-exito').textContent).toBe('Activa');
    expect($('[role=status]').textContent).toContain('No autorizado.');
    permisos.set(['actividades.ver']);
    await fixture.whenStable();
    await abrirPanel(); expect($<HTMLButtonElement>('button[title="Cerrar actividad"]').disabled).toBeTrue();
  });

  it('recupera el detalle al editar y muestra los errores 422 junto al campo', async () => {
    servicio.actualizar.and.returnValue(throwError(() => ({ status: 422, mensaje: 'Datos incorrectos.', errores: { nombre: ['Nombre inválido.'] } })));
    await accion('Editar');
    await fixture.whenStable();
    expect(servicio.obtener).toHaveBeenCalledOnceWith(7);
    expect($<HTMLInputElement>('#actividad-nombre').value).toBe(ACTIVIDAD.nombre);
    expect($('#actividad-id')).toBeNull();
    expect($<HTMLTextAreaElement>('#actividad-descripcion').value).toBe(ACTIVIDAD.descripcion!);
    await guardar();
    expect(servicio.actualizar).toHaveBeenCalled();
    expect($('#actividad-nombre-error').textContent).toBe('Nombre inválido.');
    expect($<HTMLInputElement>('#actividad-nombre').disabled).toBeFalse();
  });

  it('consulta el detalle sin exigir permisos ni catalogos de ponentes', async () => {
    permisos.set(['actividades.ver']); await fixture.whenStable();
    await accion('Ver detalle');
    expect(servicio.consultarPonentes).not.toHaveBeenCalled();
    expect($('dialog[open]').textContent).toContain(ACTIVIDAD.descripcion!);
    boton('Cerrar').click();
  });

  it('edita con el mismo modal, mantiene los IDs y actualiza el listado al guardar', async () => {
    await accion('Editar');
    await fixture.whenStable();
    expect($<HTMLDialogElement>('.modal-actividad dialog').open).toBeTrue();
    expect($('.modal-actividad h2').textContent).toBe('Editar actividad');
    expect($('table')).not.toBeNull();
    await guardar();
    expect(servicio.actualizar).toHaveBeenCalledWith(7, jasmine.objectContaining({ id_area: 2, id_tipo_actividad: 3 }));
    expect($<HTMLDialogElement>('.modal-actividad dialog').open).toBeFalse();
    expect(servicio.listar).toHaveBeenCalledTimes(2);
  });

  it('ofrece un solo botón por fila y seis tarjetas en orden con navegación por ID real', async () => {
    expect($('#filtrar-tipo')).toBeNull(); expect($('#filtrar-estado')).toBeNull();
    expect($('#buscar-actividad')).not.toBeNull(); expect($('#filtrar-area')).not.toBeNull();
    expect($('tbody .nombre-actividad').textContent?.trim()).toBe(ACTIVIDAD.nombre);
    expect($('tbody .badge').textContent?.trim()).toBe('Activa');
    expect(fixture.nativeElement.querySelectorAll('tbody button').length).toBe(1);
    expect(fixture.nativeElement.querySelectorAll('tbody a').length).toBe(0);
    await abrirPanel();
    expect($('.modal-acciones h2').textContent).toBe('Acciones de la actividad');
    const tarjetas = Array.from(fixture.nativeElement.querySelectorAll('.tarjeta-accion') as NodeListOf<HTMLElement>);
    expect(tarjetas.map(t => t.lastElementChild?.textContent?.trim())).toEqual([
      'Ver detalle', 'Editar', 'Participantes', 'Ponentes', 'Sesiones y asistencia', 'Cerrar actividad',
    ]);
    expect(tarjetas[2].getAttribute('href')).toBe('/certificaciones/participantes?id_actividad=7');
    expect(tarjetas[4].getAttribute('href')).toBe('/certificaciones/sesiones-asistencia?id_actividad=7');
    expect($<HTMLDialogElement>('.modal-acciones dialog').open).toBeTrue();
  });

  it('respeta permisos efectivos sin conceder privilegios por rol y condiciona Solicitar actividad', async () => {
    expect($('a[href="/solicitudes/nueva"]')).toBeNull();
    permisos.set(['actividades.ver', 'solicitudes.crear']); await fixture.whenStable();
    expect($('a[href="/solicitudes/nueva"]')).not.toBeNull();
    await abrirPanel();
    expect($<HTMLButtonElement>('button[title=Editar]').disabled).toBeTrue();
    expect($<HTMLButtonElement>('button[title="Cerrar actividad"]').disabled).toBeTrue();
    expect($('a[href="/certificaciones/participantes?id_actividad=7"]')).toBeNull();
    $<HTMLButtonElement>('button[title=Editar]').click(); await fixture.whenStable();
    expect(servicio.obtener).not.toHaveBeenCalled();
    permisos.set(['actividades.ver', 'actividades.editar']); await fixture.whenStable();
    expect($<HTMLButtonElement>('button[title=Editar]').disabled).toBeFalse();
  });

  it('conserva nombres recibidos y permite editar otros campos si falla el catálogo de áreas', async () => {
    fixture.destroy();
    const registro = { ...ACTIVIDAD, area_nombre: 'Área entregada por Laravel', tipo_actividad_nombre: 'Tipo entregado por Laravel' };
    servicio.listar.and.returnValue(of([registro])); servicio.obtener.and.returnValue(of(registro));
    servicio.listarAreas.and.returnValue(throwError(() => ({ status: 403, mensaje: 'Catálogo denegado.', errores: {} })));
    fixture = TestBed.createComponent(ListarActividadesComponent); fixture.autoDetectChanges(); await fixture.whenStable();
    expect($('tbody').textContent).toContain(registro.area_nombre);
    expect($('tbody').textContent).toContain(registro.tipo_actividad_nombre);
    expect($('[role=status]').parentElement?.textContent).toContain('Catálogo denegado.');
    await accion('Editar');
    expect($<HTMLSelectElement>('#actividad-area').value).toBe('2');
    await escribir('#actividad-sede', 'Sede operativa'); await guardar();
    expect(servicio.actualizar).toHaveBeenCalledWith(7, jasmine.objectContaining({ id_area: 2, sede: 'Sede operativa' }));
  });

  it('gestiona ponentes desde la actividad y espera confirmación real antes de refrescar', async () => {
    const respuesta = new Subject<ApiResponse<{ id_actividad_ponente: number; id_actividad: number; id_persona_ponente: number }>>();
    servicio.vincularPonente.and.returnValue(respuesta);
    await accion('Gestionar ponentes de esta actividad');
    expect(servicio.consultarPonentes).toHaveBeenCalledWith(7);
    expect(servicio.listarCatalogoPonentes).toHaveBeenCalledTimes(1);
    await escribir('#actividad-ponente', '8');
    $('.modal-ponentes form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })); await fixture.whenStable();
    expect(servicio.vincularPonente).toHaveBeenCalledOnceWith(7, 8);
    expect(servicio.consultarPonentes).toHaveBeenCalledTimes(1);
    respuesta.next({ success: true, message: 'Vinculado por Laravel', data: { id_actividad_ponente: 21, id_actividad: 7, id_persona_ponente: 8 } }); respuesta.complete();
    await fixture.whenStable();
    expect(servicio.consultarPonentes).toHaveBeenCalledTimes(2);
    expect($('.modal-ponentes').textContent).toContain('Vinculado por Laravel');
    expect(servicio.crear).not.toHaveBeenCalled();
  });

  it('no inventa asignaciones cuando Laravel rechaza la vinculación', async () => {
    servicio.vincularPonente.and.returnValue(throwError(() => ({ status: 409, mensaje: 'El ponente ya está asignado.', errores: {} })));
    await accion('Gestionar ponentes de esta actividad'); await escribir('#actividad-ponente', '8');
    $('.modal-ponentes form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })); await fixture.whenStable();
    expect($('.modal-ponentes').textContent).toContain('El ponente ya está asignado.');
    expect(servicio.consultarPonentes).toHaveBeenCalledTimes(1);
  });

  it('confirma la desvinculación y envía el ID de asignación, conservando el catálogo de RR. HH.', async () => {
    servicio.consultarPonentes.and.returnValue(of([{ id_actividad_ponente: 21, id_actividad: 7, id_persona_ponente: 8, nombre: 'Ana Pérez', errorNombre: null }]));
    servicio.desvincularPonente.and.returnValue(of({ success: true, message: 'Desvinculado', data: null }));
    await accion('Gestionar ponentes de esta actividad');
    boton('Desvincular').click(); await fixture.whenStable();
    expect(servicio.desvincularPonente).not.toHaveBeenCalled();
    const confirmacion = Array.from(fixture.nativeElement.querySelectorAll('app-dialogo-confirmacion dialog[open] button') as NodeListOf<HTMLButtonElement>)
      .find(b => b.textContent?.trim() === 'Desvincular')!;
    confirmacion.click(); await fixture.whenStable();
    expect(servicio.desvincularPonente).toHaveBeenCalledOnceWith(21);
    expect(servicio.listarCatalogoPonentes).toHaveBeenCalledTimes(1);
    expect(servicio.consultarPonentes).toHaveBeenCalledTimes(2);
  });

});
