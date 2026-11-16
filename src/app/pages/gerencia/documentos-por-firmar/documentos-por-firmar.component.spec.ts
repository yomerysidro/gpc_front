import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';
import { DocumentosPorFirmarComponent } from './documentos-por-firmar.component';
import { DetalleDocumentoComponent } from './detalle-documento.component';
import { VerDocumentoComponent } from '../../emision-certificados/documentos/ver-documento.component';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { permissionGuard } from '../../../core/guards/permission.guard';
import { CambiosCertificadosService } from '../../../core/services/emision-certificados/cambios-certificados.service';
import { pdfPrueba } from '../../emision-certificados/compartidos/pdf-prueba.fixture';

@Component({ standalone: true, template: 'Acceso denegado' })
class DenegadoPrueba {}

describe('Pestañas persistidas de Gerencia', () => {
  const ruta = '/pendientes/documentos-firmar';
  const base = '/api/certificados-documentos';
  const hash = '4f1949e95440af0ece666ebd5f399c1d77d22de639950784d349fa5feb47dca5';
  const pendiente = { id_certificado_documento: 31, id_certificado: 12, codigo_verificacion: 'ABC123', hash_pdf: hash,
    estado_certificado: 'PENDIENTE_FIRMA', beneficiario: { nombre: 'Persona de prueba' }, actividad: 'Actividad', sesion: 'Sesión 001',
    firmantes: [], tipo_certificado: 'Constancia', facultades: { descargar: false, remitir: false } };
  const preparado = { ...pendiente, nombre_completo: 'Persona de prueba', id_sesion: 1, estado_preparacion: 'PREPARADO_ENTREGA',
    pdf_confirmado: true, disponible_rrhh: true, revision_pdf: 'revision-vigente', responsables_administrativos: [{ nombre: 'Responsable', cargo: 'Gerente', orden_firma: 1 }] };
  let http: HttpTestingController;
  let h: RouterTestingHarness;
  let permitido: boolean;
  const pagina = (data: unknown[]) => ({ success: true, data: { data, current_page: 1, last_page: 1, per_page: 100, total: data.length } });
  const vista = () => h.routeNativeElement!;
  function pendientes(data: unknown[] = []) {
    http.expectOne(r => r.url === base + '/list' && r.params.get('bandeja') === 'por_firmar').flush(pagina(data));
  }
  function catalogo(data: unknown[]) {
    const req = http.expectOne(r => r.url === base + '/list' && !r.params.has('bandeja'));
    expect(req.request.withCredentials).toBeTrue(); expect(req.request.headers.get('Cache-Control')).toContain('no-store');
    req.flush(pagina(data)); h.detectChanges();
  }
  beforeEach(() => {
    permitido = true;
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([
      { path: 'pendientes/documentos-firmar', component: DocumentosPorFirmarComponent, canActivate: [permissionGuard], data: { permiso: 'emision.ver' } },
      { path: 'pendientes/documentos-firmar/:id', component: DetalleDocumentoComponent },
      { path: 'certificaciones/certificados/:id/documentos/:documentoId/visor', component: VerDocumentoComponent },
      { path: 'acceso-denegado', component: DenegadoPrueba },
    ]), { provide: AuthService, useValue: { cargarSesion: () => of(true), tienePermiso: () => permitido } }] });
    TestBed.overrideComponent(DetalleDocumentoComponent, { set: { template: '' } });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('muestra reconocimiento y prácticas sin sesión en las mismas dos pestañas', async () => {
    const reconocimiento = { ...pendiente, origen: 'reconocimiento', actividad: null, sesion: null };
    const practica = { ...pendiente, origen: 'practica', id_certificado_documento: 32, id_certificado: 13, actividad: null, sesion: null };
    h = await RouterTestingHarness.create(ruta); pendientes([reconocimiento, practica]);
    http.expectOne(base + '/31/firma/progreso').flush({ success: true, data: { documento: reconocimiento, disponible_rrhh: false } });
    http.expectOne(base + '/32/firma/progreso').flush({ success: true, data: { documento: practica, disponible_rrhh: false } }); h.detectChanges();
    expect(vista().querySelectorAll('#bandeja-certificados tbody tr').length).toBe(2);
    expect(vista().querySelector('#bandeja-certificados')!.textContent).toContain('Reconocimiento municipal');
    expect(vista().querySelector('#bandeja-certificados')!.textContent).toContain('Registro de prácticas');
    vista().querySelector<HTMLButtonElement>('#certificados-preparados')!.click(); await h.fixture.whenStable();
    catalogo([{ ...preparado, origen: 'reconocimiento', id_reconocimiento: 77, actividad: null, sesion: null, id_sesion: null, titulo_reconocimiento: 'Servicio destacado' },
      { ...preparado, origen: 'practica', id_practica: 78, id_certificado: 13, id_certificado_documento: 32, actividad: null, sesion: null, id_sesion: null,
        fecha_inicio_practica: '2026-01-01', fecha_fin_practica: '2026-06-30' }]);
    expect(vista().querySelectorAll('#bandeja-preparados tbody tr').length).toBe(2);
    expect(vista().querySelector('#bandeja-preparados')!.textContent).toContain('Servicio destacado');
    expect(vista().querySelector('#bandeja-preparados')!.textContent).toContain('2026-06-30');
    expect(vista().querySelectorAll('[role=tab]').length).toBe(2); http.expectNone(r => r.method !== 'GET');
  });

  it('cambia de pestaña sin recrear la pantalla y elimina todos los controles de lote', async () => {
    h = await RouterTestingHarness.create(ruta); pendientes([pendiente, { ...pendiente, id_certificado_documento: 32 }, { ...preparado, id_certificado_documento: 35 }]);
    http.expectOne(base + '/31/firma/progreso').flush({ success: true, data: { documento: pendiente, disponible_rrhh: false } });
    http.expectOne(base + '/32/firma/progreso').flush({ success: true, data: { documento: { ...pendiente, id_certificado_documento: 32 }, disponible_rrhh: true, pdf_confirmado: true } });
    // Una respuesta parcial del progreso no borra la disponibilidad persistida del listado.
    http.expectOne(base + '/35/firma/progreso').flush({ success: true, data: { documento: { ...pendiente, id_certificado_documento: 35 } } }); h.detectChanges();
    const componente = h.routeDebugElement!.componentInstance;
    expect(vista().querySelectorAll('[role=tab]').length).toBe(2);
    expect(vista().querySelectorAll('#bandeja-certificados tbody tr').length).toBe(1);
    const firmar = vista().querySelector<HTMLAnchorElement>('#bandeja-certificados tbody a')!;
    expect(firmar.textContent).toBe('Ver documento');
    expect(firmar.getAttribute('href')).toBe('/pendientes/documentos-firmar/31?page=1');
    expect(vista().querySelector('input[type=checkbox]')).toBeNull(); expect(vista().textContent).not.toContain('Consulta por lote');
    vista().querySelector<HTMLButtonElement>('#certificados-preparados')!.click(); await h.fixture.whenStable();
    const noConfirmado = { ...preparado, id_certificado_documento: 33, estado_preparacion: null, pdf_confirmado: false, disponible_rrhh: false, etiqueta_estado: 'Listo para entrega' };
    catalogo([preparado, noConfirmado, { ...preparado, id_certificado: 13, id_certificado_documento: 34, id_sesion: 2, sesion: 'Sesión 002' }]);
    expect(h.routeDebugElement!.componentInstance).toBe(componente);
    expect(vista().querySelector('#certificados-preparados')!.getAttribute('aria-selected')).toBe('true');
    expect(vista().querySelectorAll('#bandeja-preparados tbody tr').length).toBe(2);
    expect(vista().querySelector('#bandeja-preparados')!.textContent).toContain('Listo para entrega');
    expect(vista().querySelector('#bandeja-preparados')!.textContent).not.toContain('Guardar');
    vista().querySelector<HTMLButtonElement>('#certificados-pendientes')!.click(); await h.fixture.whenStable(); h.detectChanges();
    expect(vista().querySelector('#certificados-pendientes')!.getAttribute('aria-selected')).toBe('true');
    http.expectNone(r => r.method !== 'GET');
  });

  it('recupera preparados desde la URL y excluye históricos que ya no están disponibles para RR. HH.', async () => {
    h = await RouterTestingHarness.create(ruta + '?pestana=preparados'); pendientes();
    catalogo([preparado, { ...preparado, id_certificado: 13, id_certificado_documento: 32, estado_preparacion: null, disponible_rrhh: false,
      pdf_confirmado: false, estado_certificado: 'EMITIDO', firma_verificada: true, emision_oficial_verificada: true }]);
    expect(vista().querySelectorAll('#bandeja-preparados tbody tr').length).toBe(1);
    expect(vista().textContent).not.toContain('Emitido'); expect(vista().textContent).not.toContain('Entregado');
    const href = vista().querySelector<HTMLAnchorElement>('#bandeja-preparados tbody a')!.getAttribute('href')!;
    expect(href).toContain('/12/documentos/31/visor?origen=gerencia&page=1');
    await h.navigateByUrl(href);
    catalogo([preparado]);
    // No descargar sin el documento autorizado: el visor solicita el mismo ID y hash.
    http.expectOne(base + '/31/archivo').flush(new Blob(['No autorizado']), { status: 403, statusText: 'Forbidden' });
    await h.fixture.whenStable(); h.detectChanges();
    expect(vista().querySelector('app-dialogo')).toBeNull(); expect(vista().textContent).not.toContain('Seleccionar firmantes');
    expect(vista().querySelector('a')!.getAttribute('href')).toBe(ruta + '?pestana=preparados&page=1');
    expect(vista().querySelector('a[download]')).toBeNull(); http.expectNone(r => r.method !== 'GET');
  });

  it('clasifica el documento 7 confirmado por sus campos administrativos y conserva la sesión N°003', async () => {
    const siete = { ...preparado, id_certificado_documento: 7, id_certificado: 17, nombre_completo: 'Juan Alcalde',
      id_actividad: 9, actividad: 'Capacitación Personal', id_sesion: 3, sesion: 'N°003', estado_preparacion: null,
      responsables_administrativos: [{ nombre: 'Maria Perez', cargo: 'Especialista de RR. HH.', orden_firma: 1 }] };
    const otraSesion = { ...pendiente, id_certificado_documento: 8, id_certificado: 18, id_sesion: 4, sesion: 'N°004', pdf_confirmado: false, disponible_rrhh: false };
    h = await RouterTestingHarness.create(ruta + '?pestana=preparados'); pendientes([siete, otraSesion]);
    http.expectOne(base + '/7/firma/progreso').flush({ success: true, data: { documento: siete, pdf_confirmado: true, disponible_rrhh: true } });
    http.expectOne(base + '/8/firma/progreso').flush({ success: true, data: { documento: otraSesion, pdf_confirmado: false, disponible_rrhh: false } });
    catalogo([siete, otraSesion,
      { ...siete, id_certificado_documento: 9, pdf_confirmado: false, estado_preparacion: 'PREPARADO_ENTREGA' },
      { ...siete, id_certificado_documento: 10, disponible_rrhh: false },
    ]);
    expect(vista().querySelectorAll('#bandeja-preparados tbody tr').length).toBe(1);
    expect(vista().querySelector('#bandeja-preparados tbody')?.textContent).toContain('Juan Alcalde');
    expect(vista().querySelector('#bandeja-preparados tbody')?.textContent).toContain('N°003');
    expect(vista().querySelector('#bandeja-preparados tbody')?.textContent).not.toContain('N°004');
    expect(vista().querySelector('#bandeja-certificados tbody')?.textContent).toContain('N°004');
    expect(vista().querySelector('#bandeja-certificados tbody')?.textContent).not.toContain('N°003');
    expect(vista().querySelector('#bandeja-preparados .estado-listo')?.textContent).toBe('Listo para entrega');
    expect(vista().querySelector('#bandeja-preparados tbody a')?.textContent).toBe('Ver documento');
    http.expectNone(r => r.method !== 'GET');
  });

  it('refresca las dos consultas tras un cambio confirmado sin agregar filas desde memoria', async () => {
    h = await RouterTestingHarness.create(ruta + '?pestana=preparados'); pendientes(); catalogo([]);
    TestBed.inject(CambiosCertificadosService).confirmar(); pendientes(); catalogo([preparado]);
    expect(vista().querySelectorAll('#bandeja-preparados tbody tr').length).toBe(1);
    expect(vista().querySelector('#bandeja-certificados tbody tr')).toBeNull(); http.expectNone(r => r.method !== 'GET');
  });

  for (const status of [401, 403, 404, 409]) it('conserva el error de ámbito HTTP ' + status, async () => {
    h = await RouterTestingHarness.create(ruta + '?pestana=preparados'); pendientes();
    http.expectOne(r => r.url === base + '/list' && !r.params.has('bandeja')).flush({ message: 'No disponible' }, { status, statusText: 'Error' }); h.detectChanges();
    expect(vista().querySelector('#bandeja-preparados [role=alert]')).not.toBeNull();
    expect(vista().querySelector('#bandeja-preparados a')).toBeNull(); http.expectNone(r => r.method !== 'GET');
  });

  it('respeta el permiso existente antes de consultar preparados', async () => {
    permitido = false; h = await RouterTestingHarness.create(ruta + '?pestana=preparados');
    expect(TestBed.inject(Router).url).toBe('/acceso-denegado'); http.expectNone(() => true);
  });

  for (const reintento of [false, true]) it('guarda y confirma el mismo PDF antes de volver automáticamente a preparados; idempotente=' + reintento, async () => {
    // PDF.js se valida con su plantilla real en detalle-documento-pdf.integration.spec.ts.
    const archivo = pdfPrueba();
    const digest = await crypto.subtle.digest('SHA-256', await archivo.blob.arrayBuffer());
    const hash = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
    const documento = { ...pendiente, hash_pdf: hash };
    h = await RouterTestingHarness.create(ruta + '/31');
    http.expectOne(base + '/detail/31?flujo=firmas').flush({ success: true, data: documento });
    const inicial = { documento, modalidad: 'PARALELA', asignacion_documental_persistida: false, firmantes_asignados: [], facultades: { asignar: true } };
    http.expectOne(base + '/31/firma/progreso').flush({ success: true, data: inicial });
    http.expectOne(base + '/31/firma/verificacion').flush({ success: true, data: { id_certificado_documento: 31, hash_pdf: hash, integridad_verificada: true } });
    const c = h.routeDebugElement!.componentInstance as any;
    const firmantes = [{ id_persona_trabajador: 45, orden_firma: 1 }];
    c.documento.set({ ...documento, facultades: { descargar: true, remitir: false } }); c.seleccionando.set(true); c.seleccion.set(firmantes);
    c.claveRevision = JSON.stringify(c.plan()); c.revision.set({ token_revision: 'token-elegido', hash_pdf: hash, expires_at: new Date(Date.now() + 60000).toISOString() });
    c.previa.set(archivo); c.previaVisible.set(true); c.guardar();
    const asignado = { ...inicial, asignacion_documental_persistida: true, firmantes_asignados: firmantes, persistido: true, completada: true };
    http.expectOne(base + '/31/firma/asignar').flush({ success: true, data: asignado });
    const confirmar = http.expectOne(base + '/31/firma/confirmar-pdf'); expect(confirmar.request.body.token_revision).toBe('token-elegido');
    expect(TestBed.inject(Router).url).toBe(ruta + '/31');
    const confirmado = { ...asignado, documento: { ...documento, disponible_rrhh: true }, pdf_confirmado: true, disponible_rrhh: true, reintento,
      id_certificado_documento: 31, id_certificado: 12, codigo_verificacion: 'ABC123', hash_pdf: hash, revision_pdf: 'revision-vigente' };
    confirmar.flush({ success: true, data: confirmado });
    http.expectOne(base + '/31/firma/firmantes-asignados').flush({ success: true, data: confirmado });
    http.expectOne(base + '/31/firma/pdf-autorizado').flush(archivo.blob);
    for (let i = 0; i < 150 && TestBed.inject(Router).url !== ruta + '?pestana=preparados'; i++) await new Promise(r => setTimeout(r, 20));
    for (const req of http.match(base + '/31/firma/verificacion')) if (!req.cancelled) req.flush({ success: true, data: { id_certificado_documento: 31, hash_pdf: hash, integridad_verificada: true } });
    await h.fixture.whenStable(); h.detectChanges();
    expect(TestBed.inject(Router).url).toBe(ruta + '?pestana=preparados');
    pendientes(); catalogo([{ ...preparado, hash_pdf: hash }]);
    expect(vista().querySelector('#certificados-preparados')!.getAttribute('aria-selected')).toBe('true');
    expect(vista().textContent).toContain('Certificado listo para entrega');
    expect(vista().querySelectorAll('#bandeja-preparados tbody tr').length).toBe(1); http.expectNone(r => r.method !== 'GET');
  });
});
