import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
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
  let puedeCrear: boolean;
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
    await escribir('#inscripcion-tipo', '3'); await escribir('#inscripcion-fecha', '2026-11-02'); await escribir('#inscripcion-estado', 'Activo');
  }
  async function guardar() { $('form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })); await fixture.whenStable(); }
  async function montar() { fixture = TestBed.createComponent(ListarParticipantesComponent); fixture.autoDetectChanges(); await fixture.whenStable(); }
  beforeEach(async () => {
    permitido = true;
    puedeCrear = true;
    servicio = jasmine.createSpyObj('ParticipantesService', ['listar', 'personas', 'actividades', 'tipos', 'documentos', 'obtener', 'crear', 'actualizar', 'cambiarEstado', 'actividad']);
    servicio.actividad.and.returnValue(of({ id_actividad: 10, nombre: 'Actividad validada por Laravel' }));
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
      { provide: AuthService, useValue: { tienePermiso: (clave: string) => permitido && (clave !== 'participantes.crear' || puedeCrear), cargarSesion: () => of(true), usuario: signal(null), modulos: signal([]) } },
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
  it('recibe la actividad de navegación y la conserva al abrir una inscripción sin guardarla', async () => {
    fixture.destroy();
    const harness = await RouterTestingHarness.create('/certificaciones/participantes?id_actividad=10'); harness.detectChanges(); await harness.fixture.whenStable(); harness.detectChanges();
    const vista = harness.routeNativeElement!;
    expect(vista.querySelector<HTMLSelectElement>('#filtro-actividad')?.value).toBe('10');
    expect(vista.querySelector<HTMLDialogElement>('.modal-participante dialog')?.open).toBeTrue();
    expect(vista.querySelector<HTMLSelectElement>('#inscripcion-actividad')?.value).toBe('10');
    expect(servicio.crear).not.toHaveBeenCalled();
  });
  it('resuelve nombres y documentos reales y no inventa estados', async () => {
    expect($('tbody').textContent).toContain('María Pérez');
    expect($('tbody').textContent).toContain('12345678');
    expect($('tbody').textContent).toContain('Jornada institucional');
    expect($('tbody').textContent).toContain('Asistente');
    expect(Array.from($<HTMLSelectElement>('#filtro-estado').options).map(item => item.value)).toEqual(['', 'Activo', 'Cerrado']);
    expect($('.aviso-catalogos')).toBeNull();
    await escribir('#buscar-participante', 'maria');
    await escribir('#filtro-actividad', '10'); await escribir('#filtro-tipo', '3'); await escribir('#filtro-estado', 'Activo');
    expect($('tbody').textContent).toContain('María Pérez');
    await escribir('#buscar-participante', '12345678'); expect($('tbody').textContent).toContain('María Pérez');
    await escribir('#buscar-participante', 'inexistente'); expect($('.estado-vacio').textContent).toContain('No se encontraron');
    boton('Limpiar filtros').click(); await fixture.whenStable();
    for (const selector of ['#buscar-participante', '#filtro-actividad', '#filtro-tipo', '#filtro-estado']) expect($<HTMLInputElement>(selector).value).toBe('');
  });
  it('abre el formulario sobre el listado y Cancelar no guarda', async () => {
    await abrir();
    expect($('.modal-participante h2').textContent).toBe('Inscribir participante');
    expect($('.filtros')).not.toBeNull(); expect($('table')).not.toBeNull(); expect($('.paginacion')).not.toBeNull();
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
    expect(servicio.crear).toHaveBeenCalledOnceWith({ id_persona: 2, id_actividad: 10, id_tipo_participacion: 3, fecha_inscripcion: '2026-11-02', estado: 'Activo' });
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
    expect($('.formulario [role=alert]').textContent).toContain('Inscripción duplicada.'); expect($('table')).not.toBeNull();
    servicio.crear.and.returnValue(throwError(() => ({ status: 422, mensaje: 'Datos inválidos.', errores: { estado: ['Estado no permitido.'] } })));
    await guardar(); expect($('#inscripcion-estado-error').textContent).toBe('Estado no permitido.');
  });
  it('conserva la interfaz si todas las consultas fallan y no concede permisos al abrir el alta', async () => {
    fixture.destroy(); permitido = false;
    for (const metodo of ['listar', 'personas', 'actividades', 'tipos', 'documentos'] as const) servicio[metodo].and.returnValue(throwError(() => ({ status: 403, mensaje: 'No autorizado.', errores: {} })));
    await montar(); expect($('.encabezado .btn-primary')).not.toBeNull(); expect($('table')).not.toBeNull(); expect($('.paginacion')).not.toBeNull();
    expect($('.estado-vacio').textContent).not.toContain('Aún no hay participantes inscritos.');
    await abrir(); expect($('form')).toBeNull(); expect(servicio.crear).not.toHaveBeenCalled();
  });
  it('muestra el vacío solo tras consulta correcta', async () => {
    fixture.destroy(); servicio.listar.and.returnValue(of([])); await montar();
    expect($('.estado-vacio').textContent).toContain('Aún no hay participantes inscritos.');
  });
  it('no abre inscripcion sin permiso efectivo', async () => {
    permitido = false; fixture.detectChanges(); await abrir();
    expect($('form')).toBeNull(); expect(servicio.crear).not.toHaveBeenCalled();
  });
  it('no bloquea la inscripción si únicamente falla el catálogo opcional de documentos', async () => {
    fixture.destroy(); servicio.documentos.and.returnValue(throwError(() => ({ status: 403, mensaje: 'No autorizado.', errores: {} })));
    await montar(); await abrir(); await completar(); await guardar();
    expect(servicio.crear).toHaveBeenCalled();
  });
  it('mantiene el estado anterior si Laravel rechaza su actualización', async () => {
    servicio.cambiarEstado.and.returnValue(throwError(() => ({ status: 409, mensaje: 'Cambio rechazado.', errores: {} })));
    $('button[title="Cambiar estado"]').click(); await fixture.whenStable();
    await escribir('#nuevo-estado', 'Cerrado'); boton('Confirmar cambio').click(); await fixture.whenStable();
    expect($('tbody .badge').textContent).toBe('Activo');
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
    servicio.cambiarEstado.and.returnValue(of({ success: true, message: 'Actualizada.', data: { ...INSCRIPCION, estado: 'Cerrado' } }));
    $('button[title="Cambiar estado"]').click(); await fixture.whenStable(); expect(servicio.cambiarEstado).not.toHaveBeenCalled();
    await escribir('#nuevo-estado', 'Cerrado'); boton('Confirmar cambio').click(); await fixture.whenStable();
    expect(servicio.cambiarEstado).toHaveBeenCalledOnceWith(7, 'Cerrado'); expect($('tbody .badge').textContent).toBe('Cerrado');
  });

  it('ofrece solo Todos, Activo y Cerrado; filtra variantes de mayusculas sin reinterpretar sd', async () => {
    fixture.destroy();
    const datos = ['sd', 'Activo', 'ACTIVO', 'Cerrado', 'CERRADO'].map((estado, i) => ({ ...INSCRIPCION, id_participacion: i + 1, estado }));
    servicio.listar.and.returnValue(of(datos)); await montar();
    const opciones = Array.from($<HTMLSelectElement>('#filtro-estado').options);
    expect(opciones.map(opcion => opcion.textContent?.trim())).toEqual(['Todos los estados', 'Activo', 'Cerrado']);
    expect(opciones.map(opcion => opcion.value)).toEqual(['', 'Activo', 'Cerrado']);
    await escribir('#filtro-estado', 'Activo');
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(2);
    expect($('tbody').textContent).not.toContain('Estado sin');
    await escribir('#filtro-estado', 'Cerrado');
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(2);
    expect($('tbody .badge').textContent).toBe('Cerrado');
    await escribir('#filtro-estado', '');
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(5);
    await escribir('#filtro-estado', 'Activo');
    boton('Limpiar filtros').click(); await fixture.whenStable();
    expect($<HTMLSelectElement>('#filtro-estado').value).toBe('');
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(5);
    expect(datos[0].estado).toBe('sd');
  });

  it('inicia Activo y conserva el estado anterior al editar, incluyendo sd', async () => {
    fixture.destroy();
    servicio.listar.and.returnValue(of([{ ...INSCRIPCION, estado: 'sd' }]));
    servicio.obtener.and.returnValue(of({ ...INSCRIPCION, estado: 'sd' }));
    await montar(); await abrir();
    expect($<HTMLSelectElement>('#inscripcion-estado').value).toBe('Activo');
    expect(Array.from($<HTMLSelectElement>('#inscripcion-estado').options).map(opcion => opcion.textContent?.trim())).toEqual(['Activo', 'Cerrado']);
    boton('Cancelar').click(); await fixture.whenStable();
    $('button[title="Editar inscripci\u00f3n"]').click(); await fixture.whenStable();
    expect($<HTMLSelectElement>('#inscripcion-estado').value).toBe('sd');
    expect($('#estado-ayuda').textContent).toContain('se conserva');
    await guardar();
    expect(servicio.actualizar).toHaveBeenCalledWith(7, jasmine.objectContaining({ estado: 'sd' }));
    expect($<HTMLDialogElement>('.modal-participante dialog').open).toBeFalse();
  });

  it('abre un unico modal sin cambiar URL, conserva tabla y filtros, bloquea fondo y restaura foco', async () => {
    const url = TestBed.inject(Router).url;
    const overflow = document.body.style.overflow;
    const abrirBoton = $<HTMLButtonElement>('.encabezado .btn-primary');
    await escribir('#buscar-participante', 'Maria');
    abrirBoton.focus(); await abrir();
    const dialogo = $<HTMLDialogElement>('.modal-participante dialog');
    expect(dialogo.open).toBeTrue(); expect(dialogo.matches(':modal')).toBeTrue();
    expect(document.activeElement?.id).toBe('inscripcion-persona');
    expect(TestBed.inject(Router).url).toBe(url);
    expect(document.body.style.overflow).toBe('hidden');
    expect(fixture.nativeElement.querySelectorAll('table').length).toBe(1);
    expect(fixture.nativeElement.querySelectorAll('form').length).toBe(1);
    await escribir('#inscripcion-persona', '2');
    boton('Cancelar').click(); await fixture.whenStable();
    expect(dialogo.open).toBeFalse(); expect($('form')).toBeNull();
    expect(document.body.style.overflow).toBe(overflow);
    expect(document.activeElement).toBe(abrirBoton);
    expect($<HTMLInputElement>('#buscar-participante').value).toBe('Maria');
    await abrir(); expect($<HTMLSelectElement>('#inscripcion-persona').value).toBe('');
  });

  it('cierra con Escape salvo mientras guarda, conserva datos ante error y cierra al confirmar', async () => {
    await abrir();
    const dialogo = $<HTMLDialogElement>('.modal-participante dialog');
    dialogo.dispatchEvent(new Event('cancel', { cancelable: true })); await fixture.whenStable();
    expect(dialogo.open).toBeFalse(); expect($('form')).toBeNull();
    await abrir(); await completar();
    const respuesta = new Subject<ApiResponse<Inscripcion>>(); servicio.crear.and.returnValue(respuesta);
    await guardar(); await guardar();
    expect(servicio.crear).toHaveBeenCalledTimes(1);
    dialogo.dispatchEvent(new Event('cancel', { cancelable: true })); await fixture.whenStable();
    expect(dialogo.open).toBeTrue(); expect(boton('Cancelar').disabled).toBeTrue();
    respuesta.error({ status: 422, mensaje: 'No permitido.', errores: {} }); await fixture.whenStable();
    expect(dialogo.open).toBeTrue(); expect($<HTMLSelectElement>('#inscripcion-persona').value).toBe('2');
    servicio.crear.and.returnValue(of({ success: true, message: 'Registrado.', data: INSCRIPCION }));
    await guardar();
    expect(dialogo.open).toBeFalse(); expect($('form')).toBeNull();
    expect(servicio.listar).toHaveBeenCalledTimes(2);
  });

  it('reinicia la pagina al seleccionar un estado', async () => {
    fixture.destroy();
    servicio.listar.and.returnValue(of(Array.from({ length: 25 }, (_, i) => ({ ...INSCRIPCION, id_participacion: i + 1, estado: i < 12 ? 'Activo' : 'Cerrado' }))));
    await montar(); boton('Siguiente').click(); await fixture.whenStable();
    expect($('.paginacion').textContent).toContain('11');
    await escribir('#filtro-estado', 'Cerrado');
    expect($('.paginacion').textContent).toContain('1\u201310 de 13');
    boton('Limpiar filtros').click(); await fixture.whenStable();
    expect($('.paginacion').textContent).toContain('1\u201310 de 25');
  });

  async function navegarContexto(parametro = '10'): Promise<RouterTestingHarness> {
    fixture.destroy();
    const harness = await RouterTestingHarness.create('/certificaciones/participantes?id_actividad=' + parametro);
    harness.detectChanges(); await harness.fixture.whenStable(); harness.detectChanges(); return harness;
  }
  async function campoContexto(h: RouterTestingHarness, id: string, valor: string): Promise<void> {
    const campo = h.routeNativeElement!.querySelector<HTMLInputElement | HTMLSelectElement>(id)!;
    campo.value = valor; campo.dispatchEvent(new Event(campo.tagName === 'SELECT' ? 'change' : 'input'));
    h.detectChanges(); await h.fixture.whenStable(); h.detectChanges();
  }

  it('valida por GET antes de abrir, bloquea actividad y envía su ID incluso con control deshabilitado', async () => {
    const respuesta = new Subject<{ id_actividad: number; nombre: string }>();
    servicio.actividad.and.returnValue(respuesta);
    const h = await navegarContexto();
    expect(h.routeNativeElement!.querySelector('form')).toBeNull();
    expect(servicio.actividad).toHaveBeenCalledOnceWith(10);
    respuesta.next({ id_actividad: 10, nombre: 'Actividad real del detalle' }); respuesta.complete();
    h.detectChanges(); await h.fixture.whenStable(); h.detectChanges();
    expect(h.routeNativeElement!.textContent).toContain('Inscribir participante en: Actividad real del detalle');
    const actividad = h.routeNativeElement!.querySelector<HTMLSelectElement>('#inscripcion-actividad')!;
    expect(actividad.disabled).toBeTrue(); expect(actividad.value).toBe('10');
    await campoContexto(h, '#inscripcion-persona', '2'); await campoContexto(h, '#inscripcion-tipo', '3');
    const modelo = h.fixture.debugElement.query(By.directive(ListarParticipantesComponent)).componentInstance as { form: { value: object; getRawValue(): { id_actividad: string } } };
    expect('id_actividad' in modelo.form.value).toBeFalse(); expect(modelo.form.getRawValue().id_actividad).toBe('10');
    h.routeNativeElement!.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    h.detectChanges(); await h.fixture.whenStable(); h.detectChanges();
    expect(servicio.crear).toHaveBeenCalledOnceWith(jasmine.objectContaining({ id_persona: 2, id_actividad: 10, id_tipo_participacion: 3 }));
    expect(servicio.documentos).toHaveBeenCalledTimes(1); // Solo el listado general previo: el modo contextual no solicita documentos.
    expect(h.routeNativeElement!.querySelector('form')).toBeNull();
    expect(h.routeNativeElement!.querySelector<HTMLSelectElement>('#filtro-actividad')?.value).toBe('10');
    expect(servicio.actividades).toHaveBeenCalledTimes(1); // Solo el montaje general previo de esta prueba.
  });

  it('cancelar conserva el contexto y navegar desde Sidebar lo limpia y permite seleccionar actividad', async () => {
    const h = await navegarContexto();
    const cancelar = Array.from(h.routeNativeElement!.querySelectorAll<HTMLButtonElement>('button')).find(b => b.textContent?.trim() === 'Cancelar')!;
    cancelar.click(); h.detectChanges(); await h.fixture.whenStable(); h.detectChanges();
    expect(h.routeNativeElement!.querySelector<HTMLSelectElement>('#filtro-actividad')?.value).toBe('10');
    expect(h.routeNativeElement!.querySelector('form')).toBeNull(); expect(servicio.crear).not.toHaveBeenCalled();
    await h.navigateByUrl('/certificaciones/participantes'); h.detectChanges(); await h.fixture.whenStable(); h.detectChanges();
    expect(h.routeNativeElement!.querySelector<HTMLSelectElement>('#filtro-actividad')?.disabled).toBeFalse();
    expect(h.routeNativeElement!.querySelector<HTMLSelectElement>('#filtro-actividad')?.value).toBe('');
    h.routeNativeElement!.querySelector<HTMLButtonElement>('.encabezado .btn-primary')!.click();
    h.detectChanges(); await h.fixture.whenStable(); h.detectChanges();
    expect(h.routeNativeElement!.querySelector<HTMLSelectElement>('#inscripcion-actividad')?.disabled).toBeFalse();
    expect(h.routeNativeElement!.querySelector<HTMLSelectElement>('#inscripcion-actividad')?.value).toBe('');
  });

  for (const status of [401, 403, 404]) it(`no abre inscripción contextual si la actividad devuelve HTTP ${status}`, async () => {
    servicio.actividad.and.returnValue(throwError(() => ({ status, mensaje: 'Actividad no accesible', errores: {} })));
    const h = await navegarContexto();
    expect(h.routeNativeElement!.querySelector('form')).toBeNull(); expect(h.routeNativeElement!.querySelector('[role=alert]')).not.toBeNull();
    expect(servicio.crear).not.toHaveBeenCalled();
  });
  for (const id of ['0', '-1', 'abc', '1e2', '9007199254740992']) it(`rechaza el ID contextual inválido ${id}`, async () => {
    const h = await navegarContexto(id);
    expect(servicio.actividad).not.toHaveBeenCalled(); expect(h.routeNativeElement!.querySelector('form')).toBeNull();
    expect(h.routeNativeElement!.textContent).toContain('identificador de actividad no es válido');
  });

  it('permite consultar contexto sin abrir inscripción si falta participantes.crear', async () => {
    puedeCrear = false; const h = await navegarContexto();
    expect(servicio.actividad).toHaveBeenCalledWith(10); expect(h.routeNativeElement!.querySelector('form')).toBeNull();
    expect(h.routeNativeElement!.querySelector<HTMLSelectElement>('#filtro-actividad')?.value).toBe('10');
  });

  it('no presenta un catálogo fallido como vacío ni abre automáticamente un formulario inutilizable', async () => {
    servicio.personas.and.returnValue(throwError(() => ({ status: 403, mensaje: 'Personas restringidas', errores: {} })));
    const h = await navegarContexto();
    expect(h.routeNativeElement!.querySelector('form')).toBeNull();
    expect(h.routeNativeElement!.textContent).toContain('Personas no disponibles');
    expect(servicio.crear).not.toHaveBeenCalled();
  });

  it('cambiar de actividad en la URL elimina la selección anterior sin duplicar consultas por otros parámetros', async () => {
    servicio.actividad.and.callFake(id => of({ id_actividad: id, nombre: 'Actividad real ' + id }));
    const h = await navegarContexto();
    await h.navigateByUrl('/certificaciones/participantes?id_actividad=22'); h.detectChanges(); await h.fixture.whenStable(); h.detectChanges();
    expect(h.routeNativeElement!.querySelector<HTMLSelectElement>('#inscripcion-actividad')?.value).toBe('22');
    expect(h.routeNativeElement!.textContent).toContain('Inscribir participante en: Actividad real 22');
    const cancelar = Array.from(h.routeNativeElement!.querySelectorAll<HTMLButtonElement>('button')).find(b => b.textContent?.trim() === 'Cancelar')!;
    cancelar.click(); h.detectChanges(); await h.fixture.whenStable(); h.detectChanges();
    await h.navigateByUrl('/certificaciones/participantes?id_actividad=22&referencia=tabla'); h.detectChanges();
    expect(servicio.actividad).toHaveBeenCalledTimes(2);
    expect(h.routeNativeElement!.querySelector('form')).toBeNull();
    expect(h.routeNativeElement!.querySelector<HTMLSelectElement>('#filtro-actividad')?.value).toBe('22');
  });

  it('errores 409 y 422 conservan el ID contextual protegido y los datos ingresados', async () => {
    servicio.crear.and.returnValue(throwError(() => ({ status: 409, mensaje: 'Inscripción duplicada en Laravel', errores: {} })));
    const h = await navegarContexto(); await campoContexto(h, '#inscripcion-persona', '2'); await campoContexto(h, '#inscripcion-tipo', '3');
    const enviar = async () => {
      h.routeNativeElement!.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      h.detectChanges(); await h.fixture.whenStable(); h.detectChanges();
    };
    await enviar();
    expect(h.routeNativeElement!.textContent).toContain('Inscripción duplicada en Laravel');
    expect(h.routeNativeElement!.querySelector<HTMLSelectElement>('#inscripcion-actividad')?.disabled).toBeTrue();
    expect(h.routeNativeElement!.querySelector<HTMLSelectElement>('#inscripcion-persona')?.value).toBe('2');
    servicio.crear.and.returnValue(throwError(() => ({ status: 422, mensaje: 'Validación real', errores: { id_tipo_participacion: ['Tipo no permitido por Laravel'] } })));
    await enviar();
    expect(h.routeNativeElement!.querySelector('#inscripcion-tipo-error')?.textContent).toContain('Tipo no permitido por Laravel');
    expect(h.routeNativeElement!.querySelector<HTMLSelectElement>('#inscripcion-actividad')?.value).toBe('10');
  });

  it('inscripción contextual no consulta Documentos aunque ese endpoint devolvería 403', async () => {
    servicio.documentos.calls.reset();
    servicio.documentos.and.returnValue(throwError(() => ({ status: 403, mensaje: 'No autorizado', errores: {} })));
    const h = await navegarContexto();
    expect(servicio.documentos).not.toHaveBeenCalled();
    expect(h.routeNativeElement!.querySelector<HTMLDialogElement>('.modal-participante dialog')?.open).toBeTrue();
    expect(h.routeNativeElement!.textContent).toContain('Inscribir participante en: Actividad validada por Laravel');
    expect(h.routeNativeElement!.querySelector('.modal-participante')?.textContent).not.toContain('Documentos');
    await campoContexto(h, '#inscripcion-persona', '2'); await campoContexto(h, '#inscripcion-tipo', '3');
    h.routeNativeElement!.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    h.detectChanges(); await h.fixture.whenStable(); h.detectChanges();
    expect(servicio.crear).toHaveBeenCalledWith(jasmine.objectContaining({ id_actividad: 10, id_persona: 2 }));
  });
});
