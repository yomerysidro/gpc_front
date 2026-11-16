import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ListarFirmasComponent } from './listar-firmas.component';
import { TrabajadorMunicipal } from '../../../../core/interfaces/emision-certificados/trabajador-municipal.interface';
import { AUTHENTICATED_REQUEST } from '../../../../core/security/auth-request.context';
import { AuthService } from '../../../../core/services/autenticacion/auth.service';

describe('Habilitación persistida de firmantes municipales', () => {
  let http: HttpTestingController;
  let f: ComponentFixture<ListarFirmasComponent>;
  let administrar: boolean;
  const base = '/api/funcionarios-firmantes';
  const url = base + '/trabajadores';
  const maria: TrabajadorMunicipal = { id_persona_trabajador: 2, id_persona: 8, nombre: 'Maria Perez', cargo: 'Especialista de RR. HH.', id_area: 2, area: 'Recursos Humanos', vigente: true, estado_laboral: 'Vigente', disponible_asignacion: false, elegible_laboralmente: true, habilitado_firma_certificados: false };
  const supervisora = { ...maria, id_persona_trabajador: 4, cargo: 'Supervisora', id_area: 3, area: 'Administración' };
  const anton = { ...maria, id_persona_trabajador: 1, id_persona: 7, nombre: 'Antón Talián', cargo: 'Jefe de Informática', area: 'Informática' };
  const alcalde = { ...maria, id_persona_trabajador: 3, id_persona: 9, nombre: 'Juan Alcalde', cargo: 'Alcalde', area: 'Alcaldía' };
  const habilitada = { ...maria, habilitado_firma_certificados: true, disponible_asignacion: true };
  beforeEach(() => {
    administrar = true;
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(),
      { provide: AuthService, useValue: { tienePermiso: (p: string) => administrar && p === 'ponentes-firmantes.editar' } },
    ] });
    http = TestBed.inject(HttpTestingController); f = TestBed.createComponent(ListarFirmasComponent); f.detectChanges();
  });
  afterEach(() => { http.expectNone(r => r.url.includes('certificados-documentos')); http.verify(); });
  const vista = (): HTMLElement => f.nativeElement;
  function cargar(trabajadores = [anton, maria, alcalde, supervisora]) {
    const r = http.expectOne(url);
    expect(r.request.withCredentials).toBeTrue(); expect(r.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue();
    expect(r.request.headers.get('Cache-Control')).toContain('no-cache');
    r.flush({ success: true, data: { funcionarios: trabajadores } }); f.detectChanges();
  }
  function boton(texto: string): HTMLButtonElement {
    return Array.from(vista().querySelectorAll('button')).find(b => b.textContent?.trim() === texto)!;
  }
  function confirmar(trabajador: TrabajadorMunicipal, reintento = false) {
    const r = http.expectOne(trabajador.habilitado_firma_certificados ? base + '/habilitar' : base + '/' + trabajador.id_persona_trabajador + '/habilitacion');
    expect(r.request.withCredentials).toBeTrue(); expect(r.request.context.get(AUTHENTICATED_REQUEST)).toBeTrue();
    expect(r.request.method).toBe(trabajador.habilitado_firma_certificados ? 'POST' : 'DELETE');
    expect(r.request.body).toEqual(trabajador.habilitado_firma_certificados ? { id_persona_trabajador: trabajador.id_persona_trabajador } : null);
    r.flush({ success: true, data: { completada: true, persistido: true, reintento, funcionario: trabajador } });
  }
  it('consulta los cuatro vínculos reales y las seis columnas sin habilitar automáticamente', () => {
    cargar(); expect(vista().querySelector('h1')?.textContent).toBe('Gestión de firmantes municipales');
    expect(vista().querySelectorAll('tbody tr').length).toBe(4);
    expect(Array.from(vista().querySelectorAll('th')).map(t => t.textContent)).toEqual(['Nombre completo', 'Cargo', 'Área municipal', 'Estado laboral', 'Habilitación de firma', 'Acciones']);
    expect(vista().querySelectorAll('[title="Habilitar firmante"]').length).toBe(4); http.expectNone(() => true);
  });
  it('mantiene ambas Maria por ID laboral y muestra cargo y área independientes', () => {
    cargar(); f.componentInstance.busqueda.set('maria'); f.detectChanges();
    expect(f.componentInstance.filtrados().map(t => t.id_persona_trabajador)).toEqual([2, 4]);
    expect(vista().textContent).toContain('Especialista de RR. HH.'); expect(vista().textContent).toContain('Supervisora');
    expect(vista().textContent).toContain('Administración');
    const acciones = vista().querySelectorAll<HTMLButtonElement>('.interruptor');
    expect(acciones[0].getAttribute('aria-label')).toBe('Habilitar firmante'); expect(acciones[1].getAttribute('aria-label')).toBe('Habilitar firmante');
    acciones[1].click(); confirmar({ ...supervisora, habilitado_firma_certificados: true });
    cargar([maria, { ...supervisora, habilitado_firma_certificados: true }]);
    expect(f.componentInstance.trabajadores().map(t => t.habilitado_firma_certificados)).toEqual([false, true]);
  });
  for (const [consulta, esperado] of [['anton talian', 'Antón Talián'], ['supervisora', 'Supervisora'], ['administracion', 'Administración']]) {
    it('filtra localmente por nombre, cargo o área: ' + consulta, () => {
      cargar(); f.componentInstance.busqueda.set(consulta); f.detectChanges();
      expect(vista().querySelectorAll('tbody tr').length).toBe(1); expect(vista().querySelector('tbody')?.textContent).toContain(esperado); http.expectNone(() => true);
    });
  }
  it('el buscador acepta cambios desde el control y permite restablecer resultados', async () => {
    cargar(); await f.whenStable(); const buscar = vista().querySelector<HTMLInputElement>('input[type=search]')!;
    buscar.value = 'Supervisora'; buscar.dispatchEvent(new Event('input')); f.detectChanges();
    expect(f.componentInstance.filtrados().map(t => t.id_persona_trabajador)).toEqual([4]);
    buscar.value = ''; buscar.dispatchEvent(new Event('input')); f.detectChanges(); expect(vista().querySelectorAll('tbody tr').length).toBe(4);
  });
  it('separa la habilitación real del estado laboral y de los campos históricos de compatibilidad', () => {
    cargar([{ ...maria, habilitado: true, tiene_asignacion_documental: true } as TrabajadorMunicipal,
      { ...supervisora, vigente: false, elegible_laboralmente: false, habilitado_firma_certificados: true }]);
    expect(Array.from(vista().querySelectorAll('td[data-label="Estado laboral"]')).map(t => t.textContent)).toEqual(['Activo', 'Inactivo']);
    expect(Array.from(vista().querySelectorAll('td[data-label="Habilitación de firma"]')).map(t => t.textContent)).toEqual(['No habilitado', 'Habilitado']);
  });
  it('permite deshabilitar a inactivos habilitados pero bloquea nuevas habilitaciones no elegibles', () => {
    cargar([{ ...maria, vigente: false, elegible_laboralmente: false }, { ...supervisora, vigente: false, habilitado_firma_certificados: true }]);
    const acciones = vista().querySelectorAll<HTMLButtonElement>('.interruptor'); expect(acciones[0].disabled).toBeTrue(); expect(acciones[1].disabled).toBeFalse();
    f.componentInstance.habilitar(f.componentInstance.trabajadores()[0]); http.expectNone(r => r.method !== 'GET');
  });
  it('muestra iconos apagado y encendido con nombre accesible para la acción', () => {
    cargar([maria, { ...supervisora, habilitado_firma_certificados: true }]);
    const acciones = vista().querySelectorAll<HTMLButtonElement>('.interruptor');
    expect(acciones[0].querySelector('.material-symbols-outlined')?.textContent).toBe('toggle_off'); expect(acciones[0].title).toBe('Habilitar firmante');
    expect(acciones[1].querySelector('.material-symbols-outlined')?.textContent).toBe('toggle_on'); expect(acciones[1].title).toBe('Deshabilitar firmante');
    expect(acciones[0].textContent?.trim()).toBe('toggle_off'); expect(acciones[1].textContent?.trim()).toBe('toggle_on');
    expect(acciones[0].getAttribute('aria-label')).toBe('Habilitar firmante'); expect(acciones[1].getAttribute('aria-label')).toBe('Deshabilitar firmante');
  });
  it('habilita solo tras confirmación persistida y refresca sin perder el filtro', () => {
    cargar([maria]); f.componentInstance.busqueda.set('maria');
    vista().querySelector<HTMLButtonElement>('[title="Habilitar firmante"]')!.click(); f.detectChanges();
    expect(f.componentInstance.trabajadores()[0].habilitado_firma_certificados).toBeFalse(); expect(f.componentInstance.aviso()).toBe('');
    confirmar(habilitada); expect(f.componentInstance.trabajadores()[0].habilitado_firma_certificados).toBeTrue();
    cargar([habilitada]); expect(f.componentInstance.busqueda()).toBe('maria'); expect(vista().textContent).toContain('Funcionario habilitado.');
  });
  it('exige confirmación sencilla para deshabilitar y permite cancelarla sin escribir', () => {
    cargar([habilitada]); vista().querySelector<HTMLButtonElement>('[title="Deshabilitar firmante"]')!.click(); f.detectChanges();
    expect(vista().querySelector('[role=alertdialog]')?.textContent).toContain('Maria Perez'); http.expectNone(r => r.method !== 'GET');
    boton('Cancelar').click(); f.detectChanges(); expect(vista().querySelector('[role=alertdialog]')).toBeNull(); http.expectNone(() => true);
  });
  it('deshabilita y rehabilita conservando identidad y estado laboral', () => {
    cargar([habilitada]); f.componentInstance.solicitarBaja(habilitada); f.detectChanges(); boton('Confirmar deshabilitación').click();
    confirmar(maria); cargar([maria]); expect(f.componentInstance.trabajadores()[0].vigente).toBeTrue();
    vista().querySelector<HTMLButtonElement>('[title="Habilitar firmante"]')!.click(); confirmar(habilitada); cargar([habilitada]);
    expect(f.componentInstance.trabajadores()[0].id_persona_trabajador).toBe(2);
  });
  for (const reintento of [false, true]) it('acepta confirmación idempotente sin duplicados: ' + reintento, () => {
    cargar([maria]); f.componentInstance.habilitar(maria); confirmar(habilitada, reintento); cargar([habilitada]);
    expect(f.componentInstance.trabajadores().length).toBe(1); http.expectNone(() => true);
  });
  it('impide dobles clics y operaciones simultáneas', () => {
    cargar([maria, supervisora]); f.componentInstance.habilitar(maria); f.componentInstance.habilitar(maria); f.componentInstance.habilitar(supervisora); f.componentInstance.cargar();
    confirmar(habilitada); cargar([habilitada, supervisora]); http.expectNone(() => true);
  });
  it('no presenta acciones ni permite escribir a usuarios de solo lectura', () => {
    administrar = false; cargar([maria, habilitada]);
    expect(vista().querySelector('.interruptor')).toBeNull(); expect(vista().textContent).toContain('Solo lectura');
    f.componentInstance.habilitar(maria); f.componentInstance.solicitarBaja(habilitada); f.componentInstance.deshabilitar(); http.expectNone(() => true);
  });
  it('vuelve a comprobar permiso antes de confirmar la baja', () => {
    cargar([habilitada]); f.componentInstance.solicitarBaja(habilitada); administrar = false; f.componentInstance.deshabilitar(); http.expectNone(() => true);
  });
  for (const status of [401, 403, 404, 409, 422]) {
    it('mantiene el estado anterior ante error de habilitación ' + status, () => {
      cargar([maria]); f.componentInstance.habilitar(maria);
      http.expectOne(base + '/habilitar').flush({ message: 'Detalle técnico privado' }, { status, statusText: 'Error' }); f.detectChanges();
      expect(f.componentInstance.trabajadores()[0].habilitado_firma_certificados).toBeFalse(); expect(f.componentInstance.aviso()).toBe('');
      expect(vista().querySelector('[role=alert]')).not.toBeNull(); expect(vista().textContent).not.toContain('Detalle técnico'); http.expectNone(() => true);
    });
    it('respeta errores de consulta ' + status + ' sin inventar estados', () => {
      http.expectOne(url).flush({}, { status, statusText: 'Error' }); f.detectChanges();
      expect(f.componentInstance.cargando()).toBeFalse(); expect(f.componentInstance.trabajadores()).toEqual([]); expect(vista().querySelector('[role=alert]')).not.toBeNull();
    });
  }
  it('no elimina el registro ni anuncia baja ante error del servidor', () => {
    cargar([habilitada]); f.componentInstance.solicitarBaja(habilitada); f.componentInstance.deshabilitar();
    http.expectOne(base + '/2/habilitacion').flush({}, { status: 409, statusText: 'Conflict' }); f.detectChanges();
    expect(f.componentInstance.trabajadores()[0].habilitado_firma_certificados).toBeTrue(); expect(f.componentInstance.aviso()).toBe(''); expect(vista().querySelector('[role=alertdialog]')).not.toBeNull();
  });
  for (const datos of [
    { completada: true, persistido: false, funcionario: habilitada },
    { completada: false, persistido: true, funcionario: habilitada },
    { completada: true, persistido: true, funcionario: maria },
    { completada: true, persistido: true, funcionario: { ...habilitada, id_persona_trabajador: 4 } },
  ]) it('rechaza confirmaciones incompletas o de otro vínculo sin falso éxito', () => {
    cargar([maria]); f.componentInstance.habilitar(maria); http.expectOne(base + '/habilitar').flush({ success: true, data: datos }); f.detectChanges();
    expect(f.componentInstance.trabajadores()[0].habilitado_firma_certificados).toBeFalse(); expect(f.componentInstance.aviso()).toBe(''); http.expectNone(() => true);
  });
  it('ante timeout no reintenta automáticamente ni cambia el estado visual', fakeAsync(() => {
    cargar([maria]); f.componentInstance.habilitar(maria); const r = http.expectOne(base + '/habilitar'); tick(30001); f.detectChanges();
    expect(r.cancelled).toBeTrue(); expect(f.componentInstance.guardando()).toBeNull(); expect(f.componentInstance.trabajadores()[0].habilitado_firma_certificados).toBeFalse(); http.expectNone(() => true);
  }));
  it('actualiza mediante GET y bloquea clics repetidos', () => {
    cargar(); vista().querySelector<HTMLButtonElement>('.actualizar')!.click(); f.componentInstance.cargar(); cargar([supervisora]); expect(vista().querySelectorAll('tbody tr').length).toBe(1);
  });
  it('renueva datos laborales sin perder el filtro ni inferir habilitación', () => {
    cargar(); f.componentInstance.busqueda.set('Supervisora'); f.componentInstance.cargar(); cargar([{ ...supervisora, area: 'Área actualizada' }]);
    expect(vista().textContent).toContain('Área actualizada'); expect(f.componentInstance.busqueda()).toBe('Supervisora'); expect(f.componentInstance.trabajadores()[0].habilitado_firma_certificados).toBeFalse();
  });
  it('presenta resultados vacíos y campos laborales nulos', () => {
    cargar([]); expect(vista().textContent).toContain('No hay trabajadores con estos criterios.');
    f.componentInstance.cargar(); cargar([{ ...maria, cargo: null, area: null, elegible_laboralmente: false }]); expect(vista().textContent).toContain('Cargo no informado'); expect(vista().textContent).toContain('Área no informada');
  });
  for (const data of [{ funcionarios: null }, { funcionarios: [{ ...maria, vigente: undefined }] }, { funcionarios: [{ ...maria, id_persona_trabajador: 0 }] }, { funcionarios: [{ ...maria, habilitado_firma_certificados: undefined }] }]) {
    it('rechaza respuestas incompletas sin inventar estado', () => {
      http.expectOne(url).flush({ success: true, data }); f.detectChanges(); expect(vista().querySelector('[role=alert]')).not.toBeNull(); expect(f.componentInstance.trabajadores()).toEqual([]);
    });
  }
  it('conserva datos ante fallo al refrescar y permite reconsulta real', () => {
    cargar(); f.componentInstance.cargar(); http.expectOne(url).flush({}, { status: 409, statusText: 'Conflict' }); f.detectChanges();
    expect(f.componentInstance.trabajadores().length).toBe(4); f.componentInstance.cargar(); cargar([anton]); expect(f.componentInstance.error()).toBe('');
  });
  it('retira selección temporal y credenciales sin almacenar habilitaciones en el navegador', () => {
    const local = spyOn(localStorage, 'setItem'); const sesion = spyOn(sessionStorage, 'setItem');
    cargar([maria]); expect(vista().querySelector('form, select, input[type=file], input[type=password], .responsables, .seleccionar')).toBeNull();
    for (const texto of ['Selección temporal', 'Responsables seleccionados', 'Seleccionado', 'PFX', 'Contraseña', 'Firmado digitalmente']) expect(vista().textContent).not.toContain(texto);
    f.componentInstance.habilitar(maria); confirmar(habilitada); cargar([habilitada]); expect(local).not.toHaveBeenCalled(); expect(sesion).not.toHaveBeenCalled();
  });
});
