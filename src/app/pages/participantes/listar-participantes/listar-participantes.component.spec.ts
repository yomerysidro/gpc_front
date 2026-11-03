import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of, Subject, throwError } from 'rxjs';
import { routes } from '../../../app.routes';
import { ApiResponse } from '../../../core/interfaces/api/api-response.interface';
import { Inscripcion } from '../../../core/interfaces/participantes/participante.interface';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { ParticipantesService } from '../../../core/services/participantes/participantes.service';
import { ListarParticipantesComponent } from './listar-participantes.component';

const INSCRIPCION: Inscripcion = { id_participacion: 7, id_persona: 1, id_actividad: 10, id_tipo_participacion: 3, fecha_inscripcion: '2026-11-01', estado: 'ACTIVO' };

describe('Participantes: interfaz e inscripción', () => {
  let fixture: ComponentFixture<ListarParticipantesComponent>;
  let servicio: jasmine.SpyObj<ParticipantesService>;
  let permitido: boolean;
  const $ = <T extends HTMLElement = HTMLElement>(selector: string): T => fixture.nativeElement.querySelector(selector);
  const boton = (texto: string): HTMLButtonElement => Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
    .find(item => item.textContent?.replace(/chevron_left|chevron_right|add/g, '').trim() === texto)!;
  async function escribir(selector: string, valor: string) {
    const campo = $<HTMLInputElement | HTMLSelectElement>(selector);
    campo.value = valor; campo.dispatchEvent(new Event(campo.tagName === 'SELECT' ? 'change' : 'input'));
    await fixture.whenStable();
  }
  async function abrir() { $('.encabezado .btn-primary').click(); await fixture.whenStable(); }
  async function completar(persona = '2') {
    await escribir('#inscripcion-persona', persona); await escribir('#inscripcion-actividad', '10');
    await escribir('#inscripcion-tipo', '3'); await escribir('#inscripcion-fecha', '2026-11-02'); await escribir('#inscripcion-estado', 'ACTIVO');
  }
  async function guardar() { $('form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })); await fixture.whenStable(); }
  async function montar() { fixture = TestBed.createComponent(ListarParticipantesComponent); fixture.autoDetectChanges(); await fixture.whenStable(); }
  beforeEach(async () => {
    permitido = true;
    servicio = jasmine.createSpyObj('ParticipantesService', ['listar', 'personas', 'actividades', 'tipos', 'documentos', 'obtener', 'crear', 'actualizar', 'cambiarEstado']);
    servicio.listar.and.returnValue(of([INSCRIPCION]));
    servicio.personas.and.returnValue(of([
      { id_persona: 1, nombres: 'María', apellido_paterno: 'Pérez', apellido_materno: null },
      { id_persona: 2, nombres: 'Ana', apellido_paterno: 'Ruiz', apellido_materno: null },
    ]));
    servicio.documentos.and.returnValue(of([{ id_persona: 1, numero_documento: '12345678' }]));
    servicio.actividades.and.returnValue(of([{ id_actividad: 10, nombre: 'Jornada institucional' }]));
    servicio.tipos.and.returnValue(of([{ id_tipo_participacion: 3, nombre: 'Asistente', estado: true }]));
    servicio.obtener.and.returnValue(of(INSCRIPCION));
    servicio.crear.and.returnValue(of({ success: true, message: 'Inscripción registrada.', data: { ...INSCRIPCION, id_persona: 2, id_participacion: 8 } }));
    servicio.actualizar.and.returnValue(of({ success: true, message: 'Inscripción actualizada.', data: INSCRIPCION }));
    TestBed.configureTestingModule({ imports: [ListarParticipantesComponent], providers: [
      provideRouter(routes),
      { provide: ParticipantesService, useValue: servicio },
      { provide: AuthService, useValue: { tienePermiso: () => permitido, cargarSesion: () => of(true), usuario: signal(null), modulos: signal([]) } },
    ] });
    await montar();
  });

  it('abre desde el menú existente sin duplicar Sidebar ni Header', async () => {
    fixture.destroy();
    const harness = await RouterTestingHarness.create('/certificaciones/participantes');
    harness.detectChanges();
    expect(TestBed.inject(Router).url).toBe('/certificaciones/participantes');
    const vista = harness.routeNativeElement!;
    expect(vista.querySelector('app-listar-participantes')).not.toBeNull();
    expect(vista.querySelector('main h1')?.textContent).toBe('Participantes');
    expect(vista.querySelectorAll('app-sidebar').length).toBe(1);
    expect(vista.querySelectorAll('app-header').length).toBe(1);
  });
  it('resuelve nombres y documentos reales y no inventa estados', async () => {
    expect($('tbody').textContent).toContain('María Pérez');
    expect($('tbody').textContent).toContain('12345678');
    expect($('tbody').textContent).toContain('Jornada institucional');
    expect($('tbody').textContent).toContain('Asistente');
    expect(Array.from($<HTMLSelectElement>('#filtro-estado').options).map(item => item.value)).toEqual(['', 'ACTIVO']);
    expect($('.aviso-catalogos')).toBeNull();
    await escribir('#buscar-participante', 'maria');
    await escribir('#filtro-actividad', '10'); await escribir('#filtro-tipo', '3'); await escribir('#filtro-estado', 'ACTIVO');
    expect($('tbody').textContent).toContain('María Pérez');
    await escribir('#buscar-participante', '12345678'); expect($('tbody').textContent).toContain('María Pérez');
    await escribir('#buscar-participante', 'inexistente'); expect($('.estado-vacio').textContent).toContain('No se encontraron');
    boton('Limpiar filtros').click(); await fixture.whenStable();
    for (const selector of ['#buscar-participante', '#filtro-actividad', '#filtro-tipo', '#filtro-estado']) expect($<HTMLInputElement>(selector).value).toBe('');
  });
  it('muestra formulario y listado de forma excluyente y Cancelar no guarda', async () => {
    await abrir();
    expect($('#titulo-formulario').textContent).toBe('Inscribir participante');
    expect($('.filtros')).toBeNull(); expect($('table')).toBeNull(); expect($('.paginacion')).toBeNull();
    expect(fixture.nativeElement.querySelectorAll('form [formControlName]').length).toBe(5);
    expect($<HTMLInputElement>('#inscripcion-fecha').value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    boton('Cancelar').click(); await fixture.whenStable();
    expect($('form')).toBeNull(); expect($('table')).not.toBeNull(); expect(servicio.crear).not.toHaveBeenCalled();
  });
  it('valida campos, IDs de catálogo y duplicados antes de guardar', async () => {
    await abrir(); await guardar(); expect($('#inscripcion-persona-error')).not.toBeNull();
    expect(servicio.crear).not.toHaveBeenCalled();
    await completar('1'); await guardar(); expect($('.formulario [role=alert]').textContent).toContain('ya está inscrita');
    expect(servicio.crear).not.toHaveBeenCalled();
    const instancia = fixture.componentInstance as unknown as { form: { controls: { id_persona: FormControl<string> } } };
    instancia.form.controls.id_persona.setValue('999'); await guardar();
    expect($('.formulario [role=alert]').textContent).toContain('catálogos disponibles'); expect(servicio.crear).not.toHaveBeenCalled();
  });
  it('evita envíos duplicados, espera confirmación y recarga el listado tras inscribir', async () => {
    const respuesta = new Subject<ApiResponse<Inscripcion>>(); servicio.crear.and.returnValue(respuesta);
    await abrir(); await completar(); await guardar(); await guardar();
    expect(servicio.crear).toHaveBeenCalledOnceWith({ id_persona: 2, id_actividad: 10, id_tipo_participacion: 3, fecha_inscripcion: '2026-11-02', estado: 'ACTIVO' });
    expect($<HTMLInputElement>('#inscripcion-estado').disabled).toBeTrue();
    servicio.listar.and.returnValue(of([{ ...INSCRIPCION, id_participacion: 8, id_persona: 2 }]));
    respuesta.next({ success: true, message: 'Inscripción registrada.', data: { ...INSCRIPCION, id_persona: 2 } }); respuesta.complete();
    await fixture.whenStable();
    expect($('form')).toBeNull(); expect($('tbody').textContent).toContain('Ana Ruiz');
    expect(servicio.listar).toHaveBeenCalledTimes(2);
  });
  it('conserva datos y formulario ante un 409 o errores por campo 422', async () => {
    servicio.crear.and.returnValue(throwError(() => ({ status: 409, mensaje: 'Inscripción duplicada.', errores: {} })));
    await abrir(); await completar(); await guardar();
    expect($<HTMLSelectElement>('#inscripcion-persona').value).toBe('2');
    expect($('.formulario [role=alert]').textContent).toContain('Inscripción duplicada.'); expect($('table')).toBeNull();
    servicio.crear.and.returnValue(throwError(() => ({ status: 422, mensaje: 'Datos inválidos.', errores: { estado: ['Estado no permitido.'] } })));
    await guardar(); expect($('#inscripcion-estado-error').textContent).toBe('Estado no permitido.');
  });
  it('conserva la interfaz si todas las consultas fallan y no concede permisos al abrir el alta', async () => {
    fixture.destroy(); permitido = false;
    for (const metodo of ['listar', 'personas', 'actividades', 'tipos', 'documentos'] as const) servicio[metodo].and.returnValue(throwError(() => ({ status: 403, mensaje: 'No autorizado.', errores: {} })));
    await montar(); expect($('.encabezado .btn-primary')).not.toBeNull(); expect($('table')).not.toBeNull(); expect($('.paginacion')).not.toBeNull();
    expect($('.estado-vacio').textContent).not.toContain('Aún no hay participantes inscritos.');
    await abrir(); expect($<HTMLSelectElement>('#inscripcion-persona').options.length).toBe(1);
    await guardar(); expect(servicio.crear).not.toHaveBeenCalled();
  });
  it('muestra el vacío solo tras consulta correcta', async () => {
    fixture.destroy(); servicio.listar.and.returnValue(of([])); await montar();
    expect($('.estado-vacio').textContent).toContain('Aún no hay participantes inscritos.');
  });
  it('permite abrir el formulario sin permiso pero impide enviar una inscripción válida', async () => {
    permitido = false;
    await abrir(); await completar(); await guardar();
    expect($('.formulario [role=alert]').textContent).toContain('no tiene permiso');
    expect(servicio.crear).not.toHaveBeenCalled(); expect($('form')).not.toBeNull();
  });
  it('no bloquea la inscripción si únicamente falla el catálogo opcional de documentos', async () => {
    fixture.destroy(); servicio.documentos.and.returnValue(throwError(() => ({ status: 403, mensaje: 'No autorizado.', errores: {} })));
    await montar(); await abrir(); await completar(); await guardar();
    expect(servicio.crear).toHaveBeenCalled();
  });
  it('mantiene el estado anterior si Laravel rechaza su actualización', async () => {
    servicio.cambiarEstado.and.returnValue(throwError(() => ({ status: 409, mensaje: 'Cambio rechazado.', errores: {} })));
    $('button[title="Cambiar estado"]').click(); await fixture.whenStable();
    await escribir('#nuevo-estado', 'RETIRADO'); boton('Confirmar cambio').click(); await fixture.whenStable();
    expect($('tbody .badge').textContent).toBe('ACTIVO');
    expect($('dialog[open] [role=alert]').textContent).toContain('Cambio rechazado.');
  });
  it('pagina 10, 20 y 50 y reinicia página al limpiar o cambiar filtros', async () => {
    fixture.destroy(); servicio.listar.and.returnValue(of(Array.from({ length: 55 }, (_, i) => ({ ...INSCRIPCION, id_participacion: i + 1 })))); await montar();
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(10);
    boton('Siguiente').click(); await fixture.whenStable(); expect($('.paginacion').textContent).toContain('11–20 de 55');
    await escribir('#tamano-participantes', '20'); expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(20);
    await escribir('#tamano-participantes', '50'); expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(50);
    boton('Siguiente').click(); await fixture.whenStable(); expect($('.paginacion').textContent).toContain('51–55 de 55');
    boton('Limpiar filtros').click(); await fixture.whenStable(); expect($('.paginacion').textContent).toContain('1–50 de 55');
  });
  it('consulta detalle y edita conservando la inscripción existente en la validación de duplicados', async () => {
    $('button[title="Ver detalle"]').click(); await fixture.whenStable(); expect($('dialog[open]').textContent).toContain('María Pérez');
    boton('Cerrar').click(); await fixture.whenStable(); $('button[title="Editar inscripción"]').click(); await fixture.whenStable();
    expect($<HTMLSelectElement>('#inscripcion-persona').value).toBe('1');
    await guardar(); expect(servicio.actualizar).toHaveBeenCalledWith(7, jasmine.objectContaining({ id_persona: 1 })); expect($('form')).toBeNull();
  });
  it('cambia estado únicamente después de confirmar y recibir Laravel', async () => {
    servicio.cambiarEstado.and.returnValue(of({ success: true, message: 'Actualizada.', data: { ...INSCRIPCION, estado: 'RETIRADO' } }));
    $('button[title="Cambiar estado"]').click(); await fixture.whenStable(); expect(servicio.cambiarEstado).not.toHaveBeenCalled();
    await escribir('#nuevo-estado', 'RETIRADO'); boton('Confirmar cambio').click(); await fixture.whenStable();
    expect(servicio.cambiarEstado).toHaveBeenCalledOnceWith(7, 'RETIRADO'); expect($('tbody .badge').textContent).toBe('RETIRADO');
  });
});
