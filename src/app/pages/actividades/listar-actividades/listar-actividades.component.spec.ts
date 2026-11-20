import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, input, output, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { of, Subject, throwError } from 'rxjs';
import { ApiResponse } from '../../../core/interfaces/api/api-response.interface';
import { Actividad } from '../../../core/interfaces/actividades/actividad.interface';
import { ActividadesService } from '../../../core/services/actividades/actividades.service';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { ListarActividadesComponent } from './listar-actividades.component';
import { DetalleActividadComponent } from '../detalle-actividad/detalle-actividad.component';

@Component({ selector: 'app-detalle-actividad', standalone: true,
  template: '<button type="button" (click)="volver.emit()">Volver a actividades</button>' })
class DetalleActividadPruebaComponent {
  readonly actividadId = input<number | null>(null);
  readonly revision = input(0);
  readonly solicitudRuta = input<string | null>(null);
  readonly operando = input(false);
  readonly volver = output<void>();
  readonly gestionarPonentes = output<Actividad>();
  readonly editarActividad = output<Actividad>();
  readonly cerrarActividad = output<Actividad>();
}

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
    TestBed.overrideComponent(ListarActividadesComponent, {
      remove: { imports: [DetalleActividadComponent] }, add: { imports: [DetalleActividadPruebaComponent] },
    });
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

  it('inicia en Mis actividades y bloquea Detalles sin una selección, también por teclado', async () => {
    const listado = $<HTMLButtonElement>('#actividades-tab-listado');
    const detalle = $<HTMLButtonElement>('#actividades-tab-detalle');
    expect(listado.textContent?.trim()).toBe('Mis actividades');
    expect(detalle.textContent?.trim()).toBe('Detalles de la actividad');
    expect(listado.getAttribute('aria-selected')).toBe('true');
    expect(detalle.disabled).toBeTrue();
    expect(detalle.getAttribute('aria-describedby')).toBe('ayuda-detalles-actividad');
    const ayuda = $<HTMLElement>('.ayuda-pestana'); ayuda.focus();
    expect($('#ayuda-detalles-actividad').textContent).toBe('Selecciona una actividad para ver sus detalles');
    expect(getComputedStyle($('#ayuda-detalles-actividad')).visibility).toBe('visible');
    detalle.click();
    listado.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await fixture.whenStable();
    expect(listado.getAttribute('aria-selected')).toBe('true');
    expect($('app-detalle-actividad')).toBeNull(); expect(servicio.obtener).not.toHaveBeenCalled();
  });

  it('numera posiciones del conjunto filtrado y continúa en la segunda página sin usar IDs', async () => {
    servicio.listar.and.returnValue(of(Array.from({ length: 23 }, (_, i) => ({ ...ACTIVIDAD, id_actividad: 100 + i }))));
    fixture.destroy(); fixture = TestBed.createComponent(ListarActividadesComponent); fixture.autoDetectChanges(); await fixture.whenStable();
    expect($('thead th').textContent).toBe('N.º'); expect($('tbody tr td').textContent?.trim()).toBe('1');
    const modelo = fixture.componentInstance as unknown as { pagina: WritableSignal<number> };
    modelo.pagina.set(2); await fixture.whenStable();
    expect($('tbody tr td').textContent?.trim()).toBe('11');
    await escribir('#buscar-actividad', 'Jornada'); expect($('tbody tr td').textContent?.trim()).toBe('1');
    expect(servicio.listar).toHaveBeenCalledTimes(2);
  });

  it('espera catálogos antes de mostrar filas y mantiene datos durante un refetch sin reaccionar al foco', async () => {
    const areas = new Subject<readonly { id_area: number; nombre: string }[]>();
    const tipos = new Subject<readonly { id_tipo_actividad: number; nombre: string; estado: boolean; descripcion: null }[]>();
    servicio.listarAreas.and.returnValue(areas); servicio.listarTipos.and.returnValue(tipos);
    fixture.destroy(); fixture = TestBed.createComponent(ListarActividadesComponent); fixture.autoDetectChanges(); await fixture.whenStable();
    expect($<HTMLElement>('.tabla-caja').hidden).toBeTrue(); expect($('tbody').textContent).not.toContain(ACTIVIDAD.nombre);
    expect(fixture.nativeElement.textContent).not.toContain('Área #'); expect(fixture.nativeElement.textContent).not.toContain('Tipo #');
    areas.next([{ id_area: 2, nombre: 'Área real' }]); areas.complete(); await fixture.whenStable();
    expect($<HTMLElement>('.tabla-caja').hidden).toBeTrue();
    tipos.next([{ id_tipo_actividad: 3, nombre: 'Tipo real', estado: true, descripcion: null }]); tipos.complete(); await fixture.whenStable();
    expect($<HTMLElement>('.tabla-caja').hidden).toBeFalse(); expect($('tbody').textContent).toContain('Área real');
    const consultas = servicio.listar.calls.count(); window.dispatchEvent(new Event('focus')); document.dispatchEvent(new Event('visibilitychange')); await fixture.whenStable();
    expect(servicio.listar).toHaveBeenCalledTimes(consultas);
    const respuesta = new Subject<readonly Actividad[]>(); servicio.listar.and.returnValue(respuesta);
    const modelo = fixture.componentInstance as unknown as { cargar(): void };
    modelo.cargar(); modelo.cargar(); await fixture.whenStable();
    expect(servicio.listar).toHaveBeenCalledTimes(consultas + 1); expect($('tbody').textContent).toContain(ACTIVIDAD.nombre);
    respuesta.error({ status: 500, mensaje: 'Error real', errores: {} }); await fixture.whenStable();
    expect($('tbody').textContent).toContain(ACTIVIDAD.nombre); expect(fixture.nativeElement.textContent).toContain('Error real');
  });

  it('sitúa Ver actividad antes del engranaje y activa el detalle sin cambiar la ruta', async () => {
    await escribir('#buscar-actividad', 'Jornada');
    const acciones = $('.acciones-fila');
    const enlace = acciones.querySelector<HTMLButtonElement>('button[aria-label="Ver actividad"]')!;
    expect(acciones.firstElementChild).toBe(enlace);
    expect(enlace.nextElementSibling?.getAttribute('aria-label')).toBe('Gestionar actividad');
    const ruta = TestBed.inject(Router).url;
    enlace.click(); await fixture.whenStable();
    expect($('#actividades-tab-detalle').getAttribute('aria-selected')).toBe('true');
    expect(TestBed.inject(Router).url).toBe(ruta);
    expect($<HTMLElement>('#actividades-panel-listado').hidden).toBeTrue();
    $('#actividades-tab-listado').click(); await fixture.whenStable();
    await abrirPanel();
    expect($<HTMLDialogElement>('.modal-acciones dialog').open).toBeTrue();
  });

  it('selecciona el ID real de cada fila y limpia la selección al solicitarlo', async () => {
    servicio.listar.and.returnValue(of([ACTIVIDAD, { ...ACTIVIDAD, id_actividad: 19, nombre: 'Otra jornada' }]));
    fixture.destroy();
    fixture = TestBed.createComponent(ListarActividadesComponent); fixture.autoDetectChanges(); await fixture.whenStable();
    const ojos = Array.from(fixture.nativeElement.querySelectorAll('tbody button[aria-label="Ver actividad"]') as NodeListOf<HTMLButtonElement>);
    const modelo = fixture.componentInstance as unknown as { actividadDetalle(): number | null; limpiarSeleccion(): void };
    ojos[0].click(); await fixture.whenStable(); expect(modelo.actividadDetalle()).toBe(7);
    $('#actividades-tab-listado').click(); await fixture.whenStable();
    ojos[1].click(); await fixture.whenStable(); expect(modelo.actividadDetalle()).toBe(19);
    modelo.limpiarSeleccion(); await fixture.whenStable();
    expect($('#actividades-tab-listado').getAttribute('aria-selected')).toBe('true');
    expect($<HTMLButtonElement>('#actividades-tab-detalle').disabled).toBeTrue();
    expect($('app-detalle-actividad')).toBeNull();
  });

  it('restaura filtros y paginación al regresar desde el detalle', async () => {
    fixture.destroy();
    Object.defineProperty(TestBed.inject(ActivatedRoute).snapshot, 'queryParamMap', {
      value: convertToParamMap({ nombre: 'Jornada', area: '2', pagina: '2', tamano: '20' }),
    });
    servicio.listar.and.returnValue(of(Array.from({ length: 25 }, (_, i) => ({ ...ACTIVIDAD, id_actividad: i + 1 }))));
    fixture = TestBed.createComponent(ListarActividadesComponent); fixture.autoDetectChanges(); await fixture.whenStable();
    expect($<HTMLInputElement>('#buscar-actividad').value).toBe('Jornada');
    expect($<HTMLSelectElement>('#filtrar-area').value).toBe('2');
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(5);
    const llamadas = servicio.listar.calls.count();
    const tabla = $('table');
    $<HTMLButtonElement>('tbody button[aria-label="Ver actividad"]').click(); await fixture.whenStable();
    $('app-detalle-actividad button').click(); await fixture.whenStable();
    expect($('table')).toBe(tabla);
    expect($<HTMLInputElement>('#buscar-actividad').value).toBe('Jornada');
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(5);
    expect(servicio.listar.calls.count()).toBe(llamadas);
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
    expect($('a[href="/certificaciones/actividades?id_actividad=7"]')).not.toBeNull();
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
    expect($('tbody .badge')).toBeNull();
    await escribir('#filtrar-estado', 'Cerrada');
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

  it('ofrece el enlace de detalle y el engranaje por fila y conserva las seis tarjetas de gestión', async () => {
    expect($('#filtrar-tipo')).toBeNull(); expect($('#filtrar-estado')).toBeNull();
    expect($('#buscar-actividad')).not.toBeNull(); expect($('#filtrar-area')).not.toBeNull();
    expect($('tbody .nombre-actividad').textContent?.trim()).toBe(ACTIVIDAD.nombre);
    expect($('tbody .badge').textContent?.trim()).toBe('Activa');
    expect(fixture.nativeElement.querySelectorAll('tbody button').length).toBe(2);
    expect(fixture.nativeElement.querySelectorAll('tbody button[aria-label="Ver actividad"]').length).toBe(1);
    await abrirPanel();
    expect($('.modal-acciones h2').textContent).toBe('Acciones de la actividad');
    const tarjetas = Array.from(fixture.nativeElement.querySelectorAll('.tarjeta-accion') as NodeListOf<HTMLElement>);
    expect(tarjetas.map(t => t.lastElementChild?.textContent?.trim())).toEqual([
      'Ver detalle', 'Editar', 'Participantes', 'Ponentes', 'Sesiones de la actividad', 'Cerrar actividad',
    ]);
    expect(tarjetas[2].getAttribute('href')).toBe('/certificaciones/participantes?id_actividad=7');
    expect(tarjetas[4].getAttribute('href')).toBe('/certificaciones/actividades?id_actividad=7');
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

  it('consulta los vínculos históricos de la actividad sin ofrecer el formulario de vinculación', async () => {
    servicio.consultarPonentes.and.returnValue(of([{ id_actividad_ponente: 21, id_actividad: 7, id_persona_ponente: 8, nombre: 'Ana Pérez', errorNombre: null }]));
    await accion('Consultar ponentes de la actividad');
    expect(servicio.consultarPonentes).toHaveBeenCalledWith(7);
    expect(servicio.listarCatalogoPonentes).not.toHaveBeenCalled();
    expect(servicio.vincularPonente).not.toHaveBeenCalled();
    expect($('.modal-ponentes form')).toBeNull();
    expect($('.modal-ponentes #actividad-ponente')).toBeNull();
    expect($('.modal-ponentes').textContent).toContain('Ana Pérez');
    expect($('.modal-ponentes').textContent).toContain('se realiza desde cada sesión');
    expect(servicio.crear).not.toHaveBeenCalled();
  });

  it('no inventa asignaciones cuando Laravel rechaza la consulta de vínculos', async () => {
    servicio.consultarPonentes.and.returnValue(throwError(() => ({ status: 409, mensaje: 'La consulta no está disponible.', errores: {} })));
    await accion('Consultar ponentes de la actividad');
    expect($('.modal-ponentes').textContent).toContain('La consulta no está disponible.');
    expect($('.modal-ponentes form')).toBeNull();
    expect(servicio.vincularPonente).not.toHaveBeenCalled();
    expect(servicio.consultarPonentes).toHaveBeenCalledTimes(1);
  });

  it('confirma la desvinculación y envía el ID de asignación, conservando el catálogo de RR. HH.', async () => {
    servicio.consultarPonentes.and.returnValue(of([{ id_actividad_ponente: 21, id_actividad: 7, id_persona_ponente: 8, nombre: 'Ana Pérez', errorNombre: null }]));
    servicio.desvincularPonente.and.returnValue(of({ success: true, message: 'Desvinculado', data: null }));
    await accion('Consultar ponentes de la actividad');
    boton('Desvincular').click(); await fixture.whenStable();
    expect(servicio.desvincularPonente).not.toHaveBeenCalled();
    const confirmacion = Array.from(fixture.nativeElement.querySelectorAll('app-dialogo-confirmacion dialog[open] button') as NodeListOf<HTMLButtonElement>)
      .find(b => b.textContent?.trim() === 'Desvincular')!;
    confirmacion.click(); await fixture.whenStable();
    expect(servicio.desvincularPonente).toHaveBeenCalledOnceWith(21);
    expect(servicio.listarCatalogoPonentes).not.toHaveBeenCalled();
    expect(servicio.consultarPonentes).toHaveBeenCalledTimes(2);
  });

  it('renderiza settings como glifo real de Material Symbols local, con foco y nombre accesible', async () => {
    const fuentes = await document.fonts.load('300 20px "Material Symbols Outlined"', 'settings');
    expect(fuentes.length).toBeGreaterThan(0);
    const botonGestion = $<HTMLButtonElement>('tbody button[aria-label="Gestionar actividad"]');
    expect(botonGestion.getAttribute('aria-label')).toBe('Gestionar actividad');
    expect(botonGestion.title).toBe('Gestionar actividad');
    expect(getComputedStyle(botonGestion).color).toBe('rgb(7, 90, 155)');
    const glifo = botonGestion.querySelector<HTMLElement>('.material-symbols-outlined')!;
    expect(getComputedStyle(glifo).fontFamily).toContain('Material Symbols Outlined');
    const canvas = document.createElement('canvas').getContext('2d')!;
    canvas.font = '300 20px "Material Symbols Outlined"';
    expect(canvas.measureText('settings').width).toBeCloseTo(20, 0);
    botonGestion.focus(); expect(document.activeElement).toBe(botonGestion);
    await abrirPanel(); expect($<HTMLDialogElement>('.modal-acciones dialog').open).toBeTrue();
  });

  it('Ponentes conserva el contexto y no presenta enlaces ni formularios del catálogo maestro', async () => {
    const ruta = TestBed.inject(Router).url;
    await accion('Consultar ponentes de la actividad');
    expect(TestBed.inject(Router).url).toBe(ruta);
    expect($('.modal-ponentes .contexto-actividad').textContent).toContain(ACTIVIDAD.nombre);
    expect($('.modal-ponentes a')).toBeNull();
    expect($('.modal-ponentes').textContent).toContain('se realiza desde cada sesión');
    expect($<HTMLSelectElement>('#actividad-ponente')).toBeNull();
    expect(servicio.vincularPonente).not.toHaveBeenCalled();
  });

  it('muestra los vínculos históricos del servidor sin crear datos locales', async () => {
    servicio.consultarPonentes.and.returnValue(of([{ id_actividad_ponente: 21, id_actividad: 7, id_persona_ponente: 8, nombre: 'Ana Pérez', errorNombre: null }]));
    await accion('Consultar ponentes de la actividad');
    expect($('.modal-ponentes').textContent).toContain('Ana Pérez');
    expect($('.modal-ponentes form')).toBeNull();
    expect(servicio.vincularPonente).not.toHaveBeenCalled();
    expect(servicio.crear).not.toHaveBeenCalled();
    expect(servicio.consultarPonentes).toHaveBeenCalledTimes(1);
  });

});
