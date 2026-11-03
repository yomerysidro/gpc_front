import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { of, Subject, throwError } from 'rxjs';
import { ApiResponse } from '../../../core/interfaces/api/api-response.interface';
import { Actividad } from '../../../core/interfaces/actividades/actividad.interface';
import { ActividadesService } from '../../../core/services/actividades/actividades.service';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { ListarActividadesComponent } from './listar-actividades.component';

const ACTIVIDAD: Actividad = {
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
  async function nueva(): Promise<void> { $<HTMLButtonElement>('.encabezado .btn-primary').click(); await fixture.whenStable(); }
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
    permisos = signal<readonly string[]>(['actividades.ver', 'actividades.crear', 'actividades.editar', 'actividades.eliminar']);
    servicio = jasmine.createSpyObj<ActividadesService>('ActividadesService', [
      'listar', 'listarAreas', 'listarTipos', 'obtener', 'crear', 'actualizar', 'eliminar', 'consultarPonentes', 'cambiarEstado',
    ]);
    servicio.listar.and.returnValue(of([ACTIVIDAD]));
    servicio.listarAreas.and.returnValue(of([{ id_area: 2, nombre: 'Capacitación' }]));
    servicio.listarTipos.and.returnValue(of([{ id_tipo_actividad: 3, nombre: 'Jornada', descripcion: null, estado: true }]));
    servicio.obtener.and.returnValue(of(ACTIVIDAD));
    servicio.crear.and.returnValue(of({ success: true, message: 'Actividad registrada.', data: ACTIVIDAD }));
    servicio.actualizar.and.returnValue(of({ success: true, message: 'Actividad actualizada.', data: ACTIVIDAD }));
    servicio.consultarPonentes.and.returnValue(of([]));
    TestBed.configureTestingModule({ imports: [ListarActividadesComponent], providers: [
      { provide: ActividadesService, useValue: servicio },
      { provide: AuthService, useValue: { tienePermiso: (clave: string) => permisos().includes(clave) } },
    ] });
    fixture = TestBed.createComponent(ListarActividadesComponent);
    fixture.autoDetectChanges();
    await fixture.whenStable();
  });

  it('resuelve los nombres reales y busca sin distinguir tildes; no crea Header ni Sidebar', async () => {
    expect($('tbody').textContent).toContain('Capacitación');
    expect($('tbody').textContent).toContain('Jornada');
    expect($('tbody').textContent).toContain('01/10/2026');
    expect($('tbody').textContent).toContain('ID área: 2');
    expect($('tbody').textContent).toContain('ID tipo: 3');
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
    await escribir('#filtrar-tipo', '3');
    await escribir('#filtrar-estado', 'Activa');
    expect($('tbody').textContent).toContain(ACTIVIDAD.nombre);
    await escribir('#filtrar-estado', 'Cerrada');
    expect($('.estado-vacio').textContent).toContain('No se encontraron');
    boton('Limpiar filtros').click();
    await fixture.whenStable();
    expect($<HTMLInputElement>('#buscar-actividad').value).toBe('');
    for (const selector of ['#filtrar-area', '#filtrar-tipo', '#filtrar-estado']) {
      expect($<HTMLSelectElement>(selector).value).toBe('');
    }
    expect($('tbody').textContent).toContain(ACTIVIDAD.nombre);
  });

  it('quita los filtros tras crear y vuelve a consultar Laravel para mostrar el registro', async () => {
    await escribir('#buscar-actividad', 'otra actividad');
    await nueva();
    await completar();
    servicio.listar.calls.reset();
    servicio.listar.and.returnValue(of([ACTIVIDAD]));
    await guardar();
    expect(servicio.listar).toHaveBeenCalledTimes(1);
    expect($<HTMLInputElement>('#buscar-actividad').value).toBe('');
    expect($('tbody').textContent).toContain(ACTIVIDAD.nombre);
  });

  it('conserva el formulario y sus datos si Laravel rechaza la creación', async () => {
    servicio.crear.and.returnValue(throwError(() => ({ status: 403, mensaje: 'No autorizado.', errores: {} })));
    await nueva();
    await completar();
    servicio.listar.calls.reset();
    await guardar();
    expect($('form')).not.toBeNull();
    expect($<HTMLInputElement>('#actividad-nombre').value).toBe(' Nueva jornada ');
    expect($('.formulario [role=alert]').textContent).toContain('No autorizado.');
    expect(servicio.listar).not.toHaveBeenCalled();
    expect($('[role=status]').textContent).not.toContain('Actividad registrada.');
  });

  it('muestra el estado vacío únicamente cuando Laravel devuelve una lista vacía', async () => {
    fixture.destroy();
    servicio.listar.and.returnValue(of([]));
    fixture = TestBed.createComponent(ListarActividadesComponent);
    fixture.autoDetectChanges();
    await fixture.whenStable();
    expect($('.estado-vacio').textContent).toContain('Aún no hay actividades registradas.');
    expect($('.estado-vacio').textContent).toContain('Comienza creando una nueva actividad.');
    expect($('[role=alert]')).toBeNull();
  });

  it('impide guardar campos vacíos o un periodo invertido', async () => {
    await nueva();
    await guardar();
    expect(servicio.crear).not.toHaveBeenCalled();
    expect($('#actividad-nombre-error').textContent).toContain('Completa');
    await completar();
    await escribir('#actividad-fin', '2026-09-30');
    await guardar();
    expect(servicio.crear).not.toHaveBeenCalled();
    expect($('#actividad-fin-error').textContent).toContain('no puede ser anterior');
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

  it('confirma cerrar y reactivar, y actualiza el indicador solo con la respuesta del servidor', async () => {
    const respuesta = new Subject<ApiResponse<Actividad>>();
    servicio.cambiarEstado.and.returnValue(respuesta);
    $<HTMLButtonElement>('button[title="Cerrar actividad"]').click();
    await fixture.whenStable();
    expect(servicio.cambiarEstado).not.toHaveBeenCalled();
    boton('Cancelar').click();
    await fixture.whenStable();
    expect(servicio.cambiarEstado).not.toHaveBeenCalled();
    $<HTMLButtonElement>('button[title="Cerrar actividad"]').click();
    await fixture.whenStable();
    boton('Cerrar actividad').click();
    await fixture.whenStable();
    expect(servicio.cambiarEstado).toHaveBeenCalledOnceWith(7, 'Cerrada');
    expect($('.badge-exito').textContent).toBe('Activa');
    respuesta.next({ success: true, message: 'Actividad actualizada.', data: { ...ACTIVIDAD, estado: 'Cerrada' } });
    respuesta.complete();
    await fixture.whenStable();
    expect($('tbody .badge-exito')).toBeNull();
    expect($('tbody .badge').textContent).toBe('Cerrada');
    servicio.cambiarEstado.and.returnValue(of({ success: true, message: 'Actividad actualizada.', data: ACTIVIDAD }));
    $<HTMLButtonElement>('button[title="Activar actividad"]').click();
    await fixture.whenStable();
    boton('Activar actividad').click();
    await fixture.whenStable();
    expect(servicio.cambiarEstado).toHaveBeenCalledWith(7, 'Activa');
    expect($('tbody .badge-exito').textContent).toBe('Activa');
  });

  it('conserva el estado si Laravel rechaza el cambio y oculta la acción sin permiso de edición', async () => {
    servicio.cambiarEstado.and.returnValue(throwError(() => ({ status: 403, mensaje: 'No autorizado.', errores: {} })));
    $<HTMLButtonElement>('button[title="Cerrar actividad"]').click();
    await fixture.whenStable();
    boton('Cerrar actividad').click();
    await fixture.whenStable();
    expect($('tbody .badge-exito').textContent).toBe('Activa');
    expect($('[role=status]').textContent).toContain('No autorizado.');
    permisos.set(['actividades.ver']);
    await fixture.whenStable();
    expect($('button[title="Cerrar actividad"]')).toBeNull();
  });

  it('envía IDs numéricos y nulos opcionales, y bloquea envíos duplicados', async () => {
    const respuesta = new Subject<ApiResponse<Actividad>>();
    servicio.crear.and.returnValue(respuesta);
    await nueva();
    await completar();
    await guardar();
    await guardar();
    expect(servicio.crear).toHaveBeenCalledOnceWith({
      id_area: 2, id_tipo_actividad: 3, nombre: 'Nueva jornada', descripcion: null, sede: null,
      fecha_inicio: '2026-10-01', fecha_fin: '2026-10-02', estado: 'Activa',
    });
    expect($<HTMLInputElement>('#actividad-nombre').disabled).toBeTrue();
    respuesta.next({ success: true, message: 'Actividad registrada.', data: ACTIVIDAD });
    respuesta.complete();
    await fixture.whenStable();
    expect($('[role=status]').textContent).toContain('Actividad registrada.');
  });

  it('recupera el detalle al editar y muestra los errores 422 junto al campo', async () => {
    servicio.actualizar.and.returnValue(throwError(() => ({ status: 422, mensaje: 'Datos incorrectos.', errores: { nombre: ['Nombre inválido.'] } })));
    $<HTMLButtonElement>('button[title=Editar]').click();
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

  it('pide confirmación antes de eliminar y conserva el registro si Laravel responde 409', async () => {
    servicio.eliminar.and.returnValue(throwError(() => ({ status: 409, mensaje: 'Tiene registros relacionados.', errores: {} })));
    $<HTMLButtonElement>('button[title=Eliminar]').click();
    await fixture.whenStable();
    expect(servicio.eliminar).not.toHaveBeenCalled();
    boton('Cancelar').click();
    await fixture.whenStable();
    expect(servicio.eliminar).not.toHaveBeenCalled();
    $<HTMLButtonElement>('button[title=Eliminar]').click();
    await fixture.whenStable();
    boton('Eliminar actividad').click();
    await fixture.whenStable();
    expect(servicio.eliminar).toHaveBeenCalledOnceWith(7);
    expect($('[role=status]').textContent).toContain('Tiene registros relacionados.');
    expect($('tbody').textContent).toContain(ACTIVIDAD.nombre);
  });

  it('consulta los ponentes de la actividad desde su detalle', async () => {
    $<HTMLButtonElement>('button[title="Ver detalle"]').click();
    await fixture.whenStable();
    expect(servicio.consultarPonentes).toHaveBeenCalledOnceWith(7);
    expect($('dialog[open]').textContent).toContain('No hay ponentes asignados');
    expect($('dialog[open]').textContent).toContain('ID área: 2');
    expect($('dialog[open]').textContent).toContain('ID tipo: 3');
    expect($('dialog[open]').textContent).toContain(ACTIVIDAD.descripcion!);
    boton('Cerrar').click();
  });

  it('muestra todos los campos de ACTIVIDAD y mantiene el ID automático fuera del payload', async () => {
    expect(fixture.nativeElement.querySelectorAll('thead th').length).toBe(7);
    await nueva();
    expect($('#actividad-id')).toBeNull();
    expect(fixture.nativeElement.querySelectorAll('form [formControlName]').length).toBe(8);
    await completar();
    await escribir('#actividad-descripcion', ' Descripción completa ');
    await escribir('#actividad-sede', ' Sala principal ');
    await guardar();
    expect(servicio.crear).toHaveBeenCalledOnceWith({
      id_area: 2, id_tipo_actividad: 3, nombre: 'Nueva jornada', descripcion: 'Descripción completa',
      fecha_inicio: '2026-10-01', fecha_fin: '2026-10-02', sede: 'Sala principal', estado: 'Activa',
    });
  });

  it('crea como Activa y permite seleccionar Cerrada al editar', async () => {
    await nueva();
    expect($<HTMLSelectElement>('#actividad-estado').value).toBe('Activa');
    expect(Array.from($<HTMLSelectElement>('#actividad-estado').options).map(opcion => opcion.value)).toEqual(['Activa', 'Cerrada']);
    await completar();
    await escribir('#actividad-estado', 'PROGRAMADA');
    await guardar();
    expect(servicio.crear).not.toHaveBeenCalled();
    await escribir('#actividad-estado', 'Cerrada');
    await guardar();
    expect(servicio.crear).toHaveBeenCalledWith(jasmine.objectContaining({ estado: 'Activa' }));
    $<HTMLButtonElement>('button[title=Editar]').click();
    await fixture.whenStable();
    await escribir('#actividad-estado', 'Cerrada');
    await guardar();
    expect(servicio.actualizar).toHaveBeenCalledWith(7, jasmine.objectContaining({ estado: 'Cerrada' }));
  });

  it('usa los permisos de la sesión para cada acción, sin conceder acceso por nombre de rol', async () => {
    permisos.set(['actividades.ver']);
    await fixture.whenStable();
    expect($('.encabezado .btn-primary')).not.toBeNull();
    expect($('button[title=Editar]')).toBeNull();
    expect($('button[title=Eliminar]')).toBeNull();
    expect($('button[title="Ver detalle"]')).not.toBeNull();
    expect($('tbody').textContent).toContain(ACTIVIDAD.nombre);
    await nueva();
    expect($('form')).not.toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('Guardado pendiente de autorización');
    await completar();
    await guardar();
    expect(servicio.crear).not.toHaveBeenCalled();
    expect($('.formulario [role=alert]').textContent).toContain('Guardado pendiente de autorización');
    permisos.set(['actividades.ver', 'actividades.crear']);
    await fixture.whenStable();
    expect($('.encabezado .btn-primary')).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('El guardado está pendiente de autorización');
  });

  it('mantiene el listado visible y bloquea guardar si Laravel deniega los catálogos', async () => {
    fixture.destroy();
    const denegado = () => throwError(() => ({ status: 403, mensaje: 'No autorizado.', errores: {} }));
    servicio.listarAreas.and.returnValue(denegado());
    servicio.listarTipos.and.returnValue(denegado());
    fixture = TestBed.createComponent(ListarActividadesComponent);
    fixture.autoDetectChanges();
    await fixture.whenStable();
    expect($('tbody').textContent).toContain(ACTIVIDAD.nombre);
    expect($('.aviso-datos').textContent).toContain('El servidor denegó');
    expect($('.aviso-datos').textContent).toContain('permiso de lectura de Actividades');
    await nueva();
    expect($<HTMLButtonElement>('button[type=submit]').disabled).toBeFalse();
    await guardar();
    expect(servicio.crear).not.toHaveBeenCalled();
  });

  it('muestra un rechazo de lectura como error y no como una lista vacía', async () => {
    fixture.destroy();
    servicio.listar.and.returnValue(throwError(() => ({ status: 403, mensaje: 'No autorizado.', errores: {} })));
    fixture = TestBed.createComponent(ListarActividadesComponent);
    fixture.autoDetectChanges();
    await fixture.whenStable();
    expect($('.aviso-datos').textContent).toContain('No se pudo cargar el listado de actividades.');
    expect($('.estado-vacio').textContent).toContain('Datos del listado no disponibles.');
    expect($('.estado-vacio').textContent).not.toContain('Aún no hay actividades registradas.');
    expect($('table')).not.toBeNull();
    expect($('#tamano-pagina')).not.toBeNull();
    expect($('.encabezado .btn-primary')).not.toBeNull();
    await nueva();
    expect($('form')).not.toBeNull();
    expect($<HTMLButtonElement>('button[type=submit]').disabled).toBeFalse();
  });

  it('mantiene toda la interfaz sin permisos ni datos y permite abrir, validar y cancelar el alta', async () => {
    fixture.destroy();
    permisos.set([]);
    const fallo = () => throwError(() => ({ status: 403, mensaje: 'No autorizado.', errores: {} }));
    servicio.listar.and.returnValue(fallo());
    servicio.listarAreas.and.returnValue(fallo());
    servicio.listarTipos.and.returnValue(fallo());
    fixture = TestBed.createComponent(ListarActividadesComponent);
    fixture.autoDetectChanges();
    await fixture.whenStable();
    expect($('.encabezado .btn-primary')).not.toBeNull();
    expect($('table')).not.toBeNull();
    expect($('#tamano-pagina')).not.toBeNull();
    expect($('.estado-vacio').textContent).not.toContain('Aún no hay actividades registradas.');
    await nueva();
    expect(fixture.nativeElement.querySelectorAll('form [formControlName]').length).toBe(8);
    expect($<HTMLSelectElement>('#actividad-area').options.length).toBe(1);
    expect($<HTMLSelectElement>('#actividad-tipo').options.length).toBe(1);
    expect($<HTMLSelectElement>('#actividad-estado').value).toBe('Activa');
    expect($('#buscar-actividad')).toBeNull();
    expect($('table')).toBeNull();
    expect($('.paginacion')).toBeNull();
    await escribir('#actividad-nombre', 'Actividad por completar');
    await guardar();
    expect($('#actividad-area-error').textContent).toContain('Completa');
    expect(servicio.crear).not.toHaveBeenCalled();
    boton('Cancelar').click();
    await fixture.whenStable();
    expect($('form')).toBeNull();
    expect($<HTMLButtonElement>('.encabezado .btn-primary').disabled).toBeFalse();
    expect($('table')).not.toBeNull();
  });

  it('alterna exclusivamente entre listado y formulario, y Cancelar conserva los filtros sin guardar', async () => {
    expect($('.encabezado').textContent).toContain('Actividades');
    expect($('form')).toBeNull();
    expect($('table')).not.toBeNull();
    await escribir('#buscar-actividad', 'FORMACION');
    await nueva();
    expect($('#titulo-formulario').textContent).toBe('Nueva actividad');
    expect($('.encabezado')).toBeNull();
    expect($('.filtros')).toBeNull();
    expect($('table')).toBeNull();
    expect($('.paginacion')).toBeNull();
    boton('Cancelar').click();
    await fixture.whenStable();
    expect($('form')).toBeNull();
    expect($('.encabezado .btn-primary')).not.toBeNull();
    expect($('table')).not.toBeNull();
    expect($('.paginacion')).not.toBeNull();
    expect($<HTMLInputElement>('#buscar-actividad').value).toBe('FORMACION');
    expect(servicio.crear).not.toHaveBeenCalled();
  });
});
