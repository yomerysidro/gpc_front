import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';
import { routes } from '../../../app.routes';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { resolverGruposSidebar } from '../../../components/sidebar/modulos-navegacion';
import { environment } from '../../../../environments/environment';

describe('Configuración General agrupada con CRUD existentes', () => {
  const base = environment.apiBaseUrl;
  const institucional = '/gestion/configuracion';
  const clasificaciones = '/gestion/tipos-clasificaciones';
  const tipos = [
    { id: 'tipos-actividad', titulo: 'Tipos de actividad', ruta: '/ativicty-type', clave: 'id_tipo_actividad', nombre: 'nombre', estado: true },
    { id: 'tipos-participacion', titulo: 'Tipos de participación', ruta: '/participation-type', clave: 'id_tipo_participacion', nombre: 'nombre', estado: true },
    { id: 'tipos-certificado', titulo: 'Tipos de certificado', ruta: '/tipos-certificado/list', clave: 'id_tipo_certificado', nombre: 'nombre_tipo', estado: true },
  ];
  let http: HttpTestingController;
  let harness: RouterTestingHarness;
  let permisos: Set<string>;
  beforeEach(() => {
    permisos = new Set(['areas', 'tipos-documento', 'instituciones', 'actividades', 'participantes', 'emision']
      .flatMap(modulo => ['ver', 'crear', 'editar', 'eliminar'].map(accion => `${modulo}.${accion}`)));
    TestBed.configureTestingModule({ providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting(),
      { provide: AuthService, useValue: { usuario: signal(null), modulos: signal([]), cargarSesion: () => of(true), tienePermiso: (clave: string) => permisos.has(clave) } },
    ] });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  const vista = () => harness.routeNativeElement!;
  function boton(texto: string, selector = 'main'): HTMLButtonElement {
    const resultado = Array.from(vista().querySelectorAll<HTMLButtonElement>(selector + ' button')).find(elemento => elemento.textContent?.replace(/^add/, '').trim() === texto);
    if (!resultado) throw new Error('Botón no encontrado: ' + texto);
    return resultado;
  }
  function listadoTipo(tipo: typeof tipos[number], filas = [{ [tipo.clave]: 17, [tipo.nombre]: 'Tipo existente', estado: tipo.estado }]): void {
    http.expectOne(req => req.url === base + tipo.ruta).flush({ success: true, data: tipo.id === 'tipos-certificado'
      ? { data: filas, total: filas.length, current_page: 1, last_page: 1, per_page: 20 } : filas });
    harness.detectChanges();
  }
  async function seleccionar(id: string): Promise<void> {
    vista().querySelector<HTMLButtonElement>('#gestion-tab-' + id)!.click();
    await harness.fixture.whenStable(); harness.detectChanges();
  }

  it('presenta firmantes y los dos catálogos y conserva las tres pestañas institucionales', async () => {
    harness = await RouterTestingHarness.create(institucional); harness.detectChanges();
    const opciones = vista().querySelectorAll('#submenu-configuracion a');
    expect(Array.from(opciones).map(opcion => opcion.querySelector('.texto-enlace')?.textContent?.trim()))
      .toEqual(['Firmantes municipales', 'Gestión institucional', 'Tipos y clasificaciones']);
    expect(vista().querySelector('main h1')?.textContent).toBe('Gestión institucional');
    expect(Array.from(vista().querySelectorAll('main [role="tab"]')).map(tab => tab.textContent)).toEqual(['Áreas municipales', 'Tipos de documento', 'Instituciones']);
    for (const [id, url, componente] of [['areas', '/areas/list', 'app-area'], ['tipos-documento', '/document-types/list', 'app-document-type'], ['instituciones', '/institutions/list', 'app-institution']]) {
      if (id !== 'areas') await seleccionar(id);
      http.expectOne(base + url).flush({ success: true, data: [] }); harness.detectChanges();
      expect(vista().querySelector(componente)).not.toBeNull();
      expect(vista().querySelectorAll('main app-gestion-table').length).toBe(1);
      const urlActual = TestBed.inject(Router).url;
      boton('Nuevo registro').click(); harness.detectChanges();
      expect(vista().querySelector('main dialog[open]')).not.toBeNull();
      expect(vista().querySelector('main table')).not.toBeNull();
      expect(TestBed.inject(Router).url).toBe(urlActual);
      boton('Cancelar', 'main dialog').click(); harness.detectChanges();
      expect(vista().querySelector('main dialog[open]')).toBeNull();
    }
  });

  it('reutiliza el contenedor visual y mantiene un único CRUD activo en las tres clasificaciones', async () => {
    harness = await RouterTestingHarness.create(clasificaciones); harness.detectChanges();
    expect(vista().querySelector('main h1')?.textContent).toBe('Tipos y clasificaciones');
    expect(Array.from(vista().querySelectorAll('main [role="tab"]')).map(tab => tab.textContent)).toEqual(tipos.map(tipo => tipo.titulo));
    for (const tipo of tipos) {
      if (tipo !== tipos[0]) await seleccionar(tipo.id);
      listadoTipo(tipo);
      expect(vista().querySelectorAll('main app-listado-emision').length).toBe(1);
      expect(vista().querySelector('main h2')?.textContent).toBe(tipo.titulo);
      expect(vista().querySelector('main tbody')?.textContent).toContain('Tipo existente');
      expect(vista().querySelectorAll('app-sidebar a[aria-current="page"]').length).toBe(1);
      const urlActual = TestBed.inject(Router).url;
      boton('Nuevo registro').click(); harness.detectChanges();
      expect(vista().querySelector('main dialog[open]')).not.toBeNull();
      expect(vista().querySelectorAll('main app-formulario-emision').length).toBe(1);
      expect(vista().querySelector('main table')).not.toBeNull();
      expect(TestBed.inject(Router).url).toBe(urlActual);
      boton('Cancelar', 'main app-formulario-emision').click(); harness.detectChanges();
      expect(vista().querySelector('main app-formulario-emision')).toBeNull();
    }
  });

  for (const tipo of tipos) {
    it('guarda ' + tipo.titulo + ' con el servicio existente, conserva el modal en errores y actualiza el listado al guardar', async () => {
      harness = await RouterTestingHarness.create(clasificaciones + '?pestana=' + tipo.id); harness.detectChanges(); listadoTipo(tipo);
      boton('Nuevo registro').click(); harness.detectChanges();
      const recurso = tipo.ruta.split('/')[1];
      const nombre = vista().querySelector<HTMLInputElement>('#' + recurso + '-' + tipo.nombre)!;
      nombre.value = 'Nuevo tipo'; nombre.dispatchEvent(new Event('input'));
      const enviar = () => vista().querySelector('app-formulario-emision form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      const url = base + (tipo.id === 'tipos-certificado' ? '/tipos-certificado/create' : tipo.ruta);
      enviar();
      const intento = http.expectOne(url); expect(intento.request.method).toBe('POST');
      expect(intento.request.body[tipo.nombre]).toBe('Nuevo tipo');
      expect(intento.request.body.estado).toBe(tipo.id === 'tipos-certificado' ? '1' : false);
      intento.flush({ message: 'Error de validación', errors: { [tipo.nombre]: ['Nombre duplicado'] } }, { status: 422, statusText: 'Unprocessable Entity' });
      harness.detectChanges();
      expect(vista().querySelector('main dialog[open]')).not.toBeNull(); expect(nombre.value).toBe('Nuevo tipo');
      expect(vista().textContent).toContain('Nombre duplicado');
      enviar(); http.expectOne(url).flush({ success: true, data: { [tipo.clave]: 18, [tipo.nombre]: 'Nuevo tipo', estado: tipo.estado } });
      harness.detectChanges(); listadoTipo(tipo);
      expect(vista().querySelector('main app-formulario-emision')).toBeNull();
      expect(vista().textContent).toContain('Cambios guardados');
    });
  }

  for (const tipo of tipos) {
    it(tipo.titulo + ': combina filtros, pagina 5/10/50 y conserva IDs solo para las acciones', async () => {
      harness = await RouterTestingHarness.create(clasificaciones + '?pestana=' + tipo.id); harness.detectChanges();
      listadoTipo(tipo, Array.from({ length: 36 }, (_, indice) => ({ [tipo.clave]: 100 + indice, [tipo.nombre]: 'Tipo ' + indice, estado: indice % 2 === 0 })));
      const elemento = <T extends HTMLElement>(selector: string) => vista().querySelector<T>(selector)!;
      expect(vista().querySelector('thead th')?.textContent).toBe('N.º');
      expect(vista().querySelectorAll('tbody tr').length).toBe(10);
      expect(vista().querySelector('tbody th')?.textContent).toBe('1');
      expect(vista().textContent).not.toContain('Valor exacto'); expect(vista().textContent).not.toContain('Filtrar por');
      expect(vista().querySelectorAll('main .encabezado-registro button').length).toBe(1);
      const encabezado = elemento<HTMLElement>('.encabezado-registro');
      expect(getComputedStyle(encabezado).justifyContent).toBe('space-between');
      const abrir = boton('Nuevo registro');
      expect(abrir.classList.contains('btn-primary')).toBeTrue();
      boton('Siguiente').click(); harness.detectChanges(); expect(vista().querySelector('tbody th')?.textContent).toBe('11');
      const estado = elemento<HTMLSelectElement>('.filtros-clasificacion select');
      expect(Array.from(estado.options).map(opcion => opcion.textContent)).toEqual(['Todos los estados', 'Activo', 'Inactivo']);
      estado.value = '0'; estado.dispatchEvent(new Event('change')); harness.detectChanges();
      expect(vista().querySelector('.paginacion')?.textContent).toContain('1–10 de 18');
      const buscar = elemento<HTMLInputElement>('.filtros-clasificacion input');
      buscar.value = 'tipo 1'; buscar.dispatchEvent(new Event('input')); harness.detectChanges();
      expect(vista().querySelector('.paginacion')?.textContent).toContain('1–6 de 6');
      for (const cantidad of [5, 50, 10]) {
        const selector = elemento<HTMLSelectElement>('.cantidad-sesiones select');
        selector.value = String(cantidad); selector.dispatchEvent(new Event('change')); harness.detectChanges();
        expect(vista().querySelectorAll('tbody tr').length).toBe(Math.min(cantidad, 6));
        expect(estado.value).toBe('0'); expect(buscar.value).toBe('tipo 1');
        expect(boton('Anterior').disabled).toBeTrue();
      }
      buscar.value = 'No coincide'; buscar.dispatchEvent(new Event('input')); harness.detectChanges();
      expect(vista().querySelector('.paginacion')?.textContent).toContain('0–0 de 0');
      boton('Limpiar filtros').click(); harness.detectChanges();
      expect(estado.value).toBe(''); expect(buscar.value).toBe('');
      expect(vista().querySelector('.paginacion')?.textContent).toContain('1–10 de 36');
      const filtros = elemento<HTMLElement>('.filtros-clasificacion');
      expect(getComputedStyle(filtros).alignItems).toBe('end');
      expect(new Set(Array.from(filtros.querySelectorAll<HTMLElement>('input, select, button')).map(control => control.getBoundingClientRect().height)).size).toBe(1);
      http.expectNone(() => true);
    });

    it(tipo.titulo + ': edita en modal, usa la clave real y no arrastra formularios a otra pestaña', async () => {
      harness = await RouterTestingHarness.create(clasificaciones + '?pestana=' + tipo.id); harness.detectChanges(); listadoTipo(tipo);
      const url = TestBed.inject(Router).url;
      boton('Editar', 'tbody').click(); harness.detectChanges();
      const recurso = tipo.ruta.split('/')[1];
      http.expectOne(base + (tipo.id === 'tipos-certificado' ? '/tipos-certificado/detail/17' : tipo.ruta + '/17'))
        .flush({ success: true, data: { [tipo.clave]: 17, [tipo.nombre]: 'Tipo existente', estado: true } });
      harness.detectChanges();
      const dialogo = vista().querySelector<HTMLDialogElement>('main dialog[open]')!;
      expect(dialogo.matches(':modal')).toBeTrue();
      expect(vista().querySelectorAll('app-formulario-emision').length).toBe(1);
      expect(vista().querySelector('table')).not.toBeNull(); expect(TestBed.inject(Router).url).toBe(url);
      const nombre = vista().querySelector<HTMLInputElement>('#' + recurso + '-' + tipo.nombre)!;
      expect(nombre.value).toBe('Tipo existente');
      nombre.value = 'Tipo actualizado'; nombre.dispatchEvent(new Event('input'));
      vista().querySelector('app-formulario-emision form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      const guardar = http.expectOne(base + (tipo.id === 'tipos-certificado' ? '/tipos-certificado/update/17' : tipo.ruta + '/17'));
      expect(guardar.request.method).toBe('PATCH'); expect(guardar.request.body).toEqual({ [tipo.nombre]: 'Tipo actualizado' });
      guardar.flush({ success: true, data: { [tipo.clave]: 17, [tipo.nombre]: 'Tipo actualizado', estado: true } });
      harness.detectChanges(); listadoTipo(tipo);
      expect(vista().querySelector('app-formulario-emision')).toBeNull();
      boton('Nuevo registro').click(); harness.detectChanges();
      const siguiente = tipos.find(opcion => opcion !== tipo)!;
      await seleccionar(siguiente.id); listadoTipo(siguiente);
      expect(vista().querySelector('dialog[open]')).toBeNull(); expect(vista().querySelector('app-formulario-emision')).toBeNull();
      expect(vista().querySelectorAll('main table').length).toBe(1);
    });
  }

  it('conserva los permisos por pestaña, sin exigir los del primer catálogo para mostrar la entrada agrupada', async () => {
    permisos = new Set(['instituciones.ver', 'participantes.ver']);
    const grupos = resolverGruposSidebar(clave => permisos.has(clave), []);
    const configuracion = grupos.find(grupo => grupo.id === 'configuracion')!;
    expect(configuracion.hijos.map(entrada => entrada.queryParams?.['pestana'])).toEqual(['instituciones', 'tipos-participacion']);
    harness = await RouterTestingHarness.create(institucional + '?pestana=instituciones');
    http.expectOne(base + '/institutions/list').flush({ success: true, data: [] }); harness.detectChanges();
    expect(boton('Nuevo registro').disabled).toBeTrue();
    await harness.navigateByUrl(clasificaciones + '?pestana=tipos-participacion'); listadoTipo(tipos[1]);
    expect(vista().querySelector('main .encabezado-registro button')).toBeNull();
    await seleccionar('tipos-certificado');
    expect(TestBed.inject(Router).url).toBe('/acceso-denegado');
    http.expectNone(() => true);
  });
});
