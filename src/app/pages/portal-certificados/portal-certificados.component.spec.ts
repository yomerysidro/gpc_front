import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../app.routes';
import { AuthService } from '../../core/services/autenticacion/auth.service';
import { authInterceptor } from '../../core/interceptors/auth.interceptor';
import { AUTHENTICATED_REQUEST } from '../../core/security/auth-request.context';
import { PortalCertificadosComponent } from './portal-certificados.component';
import { PdfContinuoComponent } from '../emision-certificados/compartidos/pdf-continuo.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { SessionAuthService } from '../../core/services/autenticacion/session-auth.service';
import { PortalCertificadosService } from '../../core/services/emision-certificados/portal-certificados.service';

describe('Portal público sin autenticación', () => {
  let http: HttpTestingController;
  const codigo = 'a'.repeat(30);
  const datos = {
    codigo_verificacion: codigo, estado_documento: 'Vigente', estado_certificado: 'Vigente',
    fecha_generacion: '2026-01-01', fecha_emision: '2026-01-02', registro_encontrado: true,
    integridad_verificada: true, vigente: true, puede_ver_documento: true,
    url_documento: `/api/certificados/verificar/${codigo}?archivo=1`,
    emision_oficial_verificada: false, firma_verificada: false, motivos: ['Información interna no publicable'],
    id_persona: 99, beneficiario: 'Persona privada', ruta_archivo: '/privado/archivo.pdf',
  };
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes),
      provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting(),
      { provide: AuthService, useValue: (() => {
        const usuario = signal<unknown>(null);
        return { usuario, isAuthenticated: () => usuario() !== null, modulos: signal([]), tienePermiso: () => false,
          cargarSesion: jasmine.createSpy('cargarSesion').and.returnValue(of(false)) };
      })() },
    ] });
    // El render PDF.js tiene su suite propia; aquí se comprueba transporte, autorización e identidad.
    TestBed.overrideComponent(PdfContinuoComponent, { set: { template: '<div>PDF autorizado</div>' } });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify({ ignoreCancelled: true }));
  function crear() { const f = TestBed.createComponent(PortalCertificadosComponent); f.detectChanges(); return f; }
  function consultar(c: any) { c.cambiarModo('codigo'); c.codigo.setValue(codigo); c.buscar(); return http.expectOne(`/api/certificados/verificar/${codigo}`); }

  for (const autenticado of [false, true]) {
    it(`pulsar Consultar envía el POST DNI y renderiza resultados con sesión ${autenticado}`, async () => {
      const auth = TestBed.inject(AuthService) as any;
      if (autenticado) auth.usuario.set({ nombre: 'Administrador', rol: 'Administrador', email: 'admin@institucional.test' });
      const h = await RouterTestingHarness.create('/portal-certificados'); h.detectChanges();
      const vista = h.routeNativeElement!;
      const sidebar = vista.querySelector('app-sidebar');
      expect(!!sidebar).toBe(autenticado);
      const input = vista.querySelector<HTMLInputElement>('#dni-publico')!;
      input.value = '01234567'; input.dispatchEvent(new Event('input')); h.detectChanges();
      vista.querySelector<HTMLButtonElement>('button[type="submit"]')!.click(); h.detectChanges();
      const req = http.expectOne('/api/portal-certificados/consultar-dni');
      expect(req.request.method).toBe('POST'); expect(req.request.body).toEqual({ dni: '01234567' });
      expect(req.request.headers.has('Authorization')).toBeFalse(); expect(req.request.withCredentials).toBeFalse();
      expect(req.request.context.get(AUTHENTICATED_REQUEST)).toBeFalse();
      req.flush({ success: true, data: { certificados: [filaDni('a'), filaDni('b')] } }); h.detectChanges();
      expect(vista.querySelectorAll('.resultados').length).toBe(2);
      expect(vista.textContent).toContain('Disponible');
      expect(vista.querySelector('app-sidebar')).toBe(sidebar);
      expect(TestBed.inject(Router).url).toBe('/portal-certificados'); h.fixture.destroy();
    });
  }
  it('enviar con Enter evita la navegación nativa y consulta solo el código activo', () => {
    const f = crear(); const c = f.componentInstance as any; c.cambiarModo('codigo'); f.detectChanges();
    const input = f.nativeElement.querySelector('#codigo-portal') as HTMLInputElement;
    input.value = codigo; input.dispatchEvent(new Event('input')); f.detectChanges();
    const envio = new Event('submit', { bubbles: true, cancelable: true });
    f.nativeElement.querySelector('form').dispatchEvent(envio);
    expect(envio.defaultPrevented).toBeTrue();
    http.expectOne('/api/certificados/verificar/' + codigo).flush({ success: true, data: datos });
    http.expectNone('/api/portal-certificados/consultar-dni'); f.destroy();
  });

  it('abre la ruta pública sin activar el guard privado ni obligar a autenticar', async () => {
    const h = await RouterTestingHarness.create('/portal-certificados');
    h.detectChanges();
    expect(TestBed.inject(Router).url).toBe('/portal-certificados');
    expect(h.routeNativeElement!.textContent).toContain('Portal Público de Certificados');
    expect(h.routeNativeElement!.querySelector('a[href="/login"]')?.textContent).toContain('Iniciar sesión');
    expect(h.routeNativeElement!.querySelector('app-sidebar')).toBeNull();
    http.expectNone(() => true); h.fixture.destroy();
  });

  it('conserva el sidebar para la sesión administrativa ya cargada y lo retira al pasar a visitante', async () => {
    const auth = TestBed.inject(AuthService) as any;
    auth.usuario.set({ nombre: 'Administrador', rol: 'Administrador', email: 'admin@institucional.test' });
    const h = await RouterTestingHarness.create('/portal-certificados'); h.detectChanges();
    expect(h.routeNativeElement!.querySelector('app-sidebar')).not.toBeNull();
    expect(h.routeNativeElement!.textContent).toContain('Portal Público de Certificados');
    expect(h.routeNativeElement!.querySelector('a[href="/portal-certificados"]')).not.toBeNull();
    auth.usuario.set(null); h.detectChanges();
    expect(h.routeNativeElement!.querySelector('app-sidebar')).toBeNull();
    expect(h.routeNativeElement!.textContent).toContain('Portal Público de Certificados');
    http.expectNone(() => true); h.fixture.destroy();
  });

  it('valida DNI independiente de código y envía solo sus ocho dígitos como string en el body público', () => {
    const f = crear(); const c = f.componentInstance as any;
    for (const valor of ['', '1234567', '123456789', '1234a678']) { c.dni.setValue(valor); expect(c.dni.invalid).toBeTrue(); }
    c.dni.setValue('01234567'); expect(c.dni.valid).toBeTrue(); expect(c.codigo.invalid).toBeTrue();
    c.buscar(); f.detectChanges(); expect(c.cargando()).toBeTrue();
    const req = http.expectOne('/api/portal-certificados/consultar-dni');
    expect(req.request.method).toBe('POST'); expect(req.request.body).toEqual({ dni: '01234567' });
    expect(req.request.withCredentials).toBeFalse(); expect(req.request.headers.has('Authorization')).toBeFalse();
    expect(req.request.context.get(AUTHENTICATED_REQUEST)).toBeFalse(); expect(req.request.params.keys()).toEqual([]);
    req.flush({ success: true, data: { certificados: [] } }); f.detectChanges();
    expect(c.cargando()).toBeFalse(); expect(c.resultadosDni()).toEqual([]);
    expect(f.nativeElement.textContent).toContain('No hay certificados disponibles para esta consulta');
    c.nuevaConsulta(); expect(c.dni.value).toBe(''); f.destroy();
  });

  it('consulta exclusivamente por código sin JWT ni credenciales obligatorias y proyecta datos públicos mínimos', () => {
    const f = crear(); const c = f.componentInstance as any;
    const req = consultar(c);
    expect(c.dni.invalid).toBeTrue(); expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeFalse(); expect(req.request.headers.has('Authorization')).toBeFalse();
    expect(req.request.context.get(AUTHENTICATED_REQUEST)).toBeFalse();
    req.flush({ success: true, data: datos }); f.detectChanges();
    expect(f.nativeElement.textContent).toContain('Ver certificado');
    for (const privado of ['Persona privada', '/privado/archivo.pdf', 'Información interna no publicable', 'Firmado digitalmente', 'Emitido oficialmente']) {
      expect(f.nativeElement.textContent).not.toContain(privado);
    }
    expect(Object.keys(c.resultado()).sort()).toEqual(['actividad', 'codigo', 'estado', 'estadoPublico', 'fecha', 'sesion', 'tipo', 'urlPdf', 'verificado']);
    c.nuevaConsulta(); f.detectChanges(); expect(c.resultado()).toBeNull(); f.destroy();
  });

  for (const estado of ['Anulado', 'Revocado']) {
    it(`no publica el documento ${estado} aunque existan datos contradictorios`, () => {
      const f = crear(); const c = f.componentInstance as any;
      consultar(c).flush({ success: true, data: { ...datos, estado_certificado: estado } }); f.detectChanges();
      expect(c.resultado().urlPdf).toBeNull();
      expect(f.nativeElement.textContent).not.toContain('Ver certificado');
      c.verCertificado(); http.expectNone(r => r.url.includes('?archivo=')); f.destroy();
    });
  }
  for (const estado of ['PREPARADO', 'Listo para entrega', 'PREPARADO_ENTREGA', 'PENDIENTE_FIRMA', 'Vigente', 'FIRMADO', 'EMITIDO']) {
    it(`presenta ${estado} cuando la API autoriza, sin exigir firma digital ni emisión oficial`, () => {
      const f = crear(); const c = f.componentInstance as any;
      consultar(c).flush({ success: true, data: { ...datos, estado_certificado: estado,
        firma_verificada: false, emision_oficial_verificada: false,
        tipo_certificado: 'Certificado de Capacitación', actividad: 'Jornada municipal',
        sesion: 'Sesión N.º 001', fecha_sesion: '2026-01-01',
      } }); f.detectChanges();
      const texto = f.nativeElement.textContent;
      expect(c.resultado().estado).toBe('disponible');
      expect(texto).toContain('Certificado de Capacitación'); expect(texto).toContain('Jornada municipal');
      expect(texto).toContain('Sesión N.º 001'); expect(texto).toContain('01/01/2026');
      expect(texto).toContain('Ver certificado');
      expect(texto).toContain('Certificado verificado');
      expect(texto).not.toContain('criptográfica'); expect(texto).not.toContain('Laravel');
      f.destroy();
    });
  }
  it('Listo para entrega no sustituye una autorización pública denegada', () => {
    const f = crear(); const c = f.componentInstance as any;
    consultar(c).flush({ success: true, data: { ...datos, estado_certificado: 'Listo para entrega',
      puede_ver_documento: false, vigente: false, url_documento: null } }); f.detectChanges();
    expect(c.resultado().estado).toBe('disponible');
    expect(f.nativeElement.textContent).not.toContain('Ver certificado'); f.destroy();
  });
  it('no ofrece un PDF sin autorización explícita y no infiere disponibilidad de la integridad', () => {
    const f = crear(); const c = f.componentInstance as any;
    consultar(c).flush({ success: true, data: { ...datos, puede_ver_documento: false } }); f.detectChanges();
    expect(f.nativeElement.textContent).toContain('Certificado verificado');
    expect(c.resultado().urlPdf).toBeNull(); f.destroy();
  });
  it('rechaza una URL privada o externa aunque el servidor la devuelva', () => {
    const f = crear(); const c = f.componentInstance as any;
    consultar(c).flush({ success: true, data: { ...datos, url_documento: 'https://ajeno.test/privado.pdf' } }); f.detectChanges();
    c.verCertificado(); http.expectNone(r => r.url.includes('ajeno.test'));
    expect(c.resultado().urlPdf).toBeNull();
    expect(f.nativeElement.querySelector('.resultados a')).toBeNull();
    expect(f.nativeElement.textContent).not.toContain('Ver certificado'); f.destroy();
  });
  it('recupera solo el PDF público original y no ofrece descarga si el backend la rechaza', () => {
    const f = crear(); const c = f.componentInstance as any;
    consultar(c).flush({ success: true, data: datos }); c.verCertificado(); f.detectChanges();
    expect(f.nativeElement.querySelector('a[download]')).toBeNull();
    const pdf = http.expectOne(datos.url_documento);
    expect(pdf.request.withCredentials).toBeFalse(); expect(pdf.request.responseType).toBe('blob');
    expect(pdf.request.headers.has('Authorization')).toBeFalse();
    pdf.flush(null, { status: 403, statusText: 'Forbidden' }); f.detectChanges();
    expect(f.nativeElement.querySelector('a[download]')).toBeNull();
    expect(f.nativeElement.textContent).toContain('no está autorizado'); f.destroy();
  });
  it('muestra y descarga los mismos bytes públicos, con el QR original dentro del PDF', async () => {
    const crearUrl = URL.createObjectURL.bind(URL);
    const listo = new Promise<void>(resolve => {
      spyOn(URL, 'createObjectURL').and.callFake(blob => { const url = crearUrl(blob); resolve(); return url; });
    });
    const f = crear(); const c = f.componentInstance as any;
    consultar(c).flush({ success: true, data: datos }); c.verCertificado();
    const bytes = '%PDF-1.4\narchivo original con su QR';
    http.expectOne(datos.url_documento).flush(new Blob([bytes], { type: 'application/pdf' }));
    await listo; await f.whenStable(); f.detectChanges();
    expect(await c.archivo().blob.text()).toBe(bytes);
    expect(f.nativeElement.querySelector('app-pdf-continuo')).not.toBeNull();
    expect(f.nativeElement.querySelector('a[download]').getAttribute('href')).toBe(datos.url_documento + '&descargar=1');
    const revocar = spyOn(URL, 'revokeObjectURL').and.callThrough();
    c.volver(); f.detectChanges(); expect(revocar).toHaveBeenCalled();
    expect(f.nativeElement.querySelector('a[download]')).toBeNull(); f.destroy();
  });
  for (const status of [0, 401, 403, 404, 409, 422, 429, 500]) {
    it(`maneja HTTP ${status} sin filtrar errores internos ni redirigir al login`, () => {
      const f = crear(); const c = f.componentInstance as any;
      const req = consultar(c);
      req.flush({ message: 'SQLSTATE información privada' }, { status, statusText: 'Error' }); f.detectChanges();
      expect(c.cargando()).toBeFalse(); expect(c.resultado()).toBeNull();
      expect(f.nativeElement.textContent).not.toContain('SQLSTATE');
      expect(TestBed.inject(Router).url).not.toContain('login'); f.destroy();
    });
  }
  it('termina consultas que no responden y permite una nueva consulta', fakeAsync(() => {
    const f = crear(); const c = f.componentInstance as any;
    const req = consultar(c); tick(30001); f.detectChanges();
    expect(c.cargando()).toBeFalse(); expect(req.cancelled).toBeTrue();
    expect(c.mensaje()).toContain('No se pudo conectar'); f.destroy();
  }));
  it('cancela resultados obsoletos al cambiar de búsqueda', () => {
    const f = crear(); const c = f.componentInstance as any;
    const req = consultar(c); c.cambiarModo('dni');
    expect(req.cancelled).toBeTrue(); expect(c.codigo.value).toBe(codigo); expect(c.resultado()).toBeNull(); f.destroy();
  });
  it('mantiene pestaña y código al recibir un 404, sin resultados DNI', () => {
    const f = crear(); const c = f.componentInstance as any;
    consultar(c).flush({}, { status: 404, statusText: 'Not Found' }); f.detectChanges();
    expect(c.modo()).toBe('codigo'); expect(c.codigo.value).toBe(codigo);
    expect(f.nativeElement.querySelector('#dni-publico')).toBeNull();
    expect(f.nativeElement.textContent).toContain('No se encontró un certificado con ese código. Verifica que esté escrito correctamente');
    http.expectNone('/api/portal-certificados/consultar-dni'); f.destroy();
  });

  function filaDni(letra: string, publicado = false) {
    return { referencia_publica: letra.repeat(64), codigo_verificacion: letra.repeat(30), origen: 'sesion',
      tipo_certificado: 'Capacitación', actividad: 'Jornada municipal', sesion: 'Sesión ' + letra,
      fecha_sesion: '2026-11-03', estado_disponibilidad: 'Listo para entrega', disponible_rrhh: true,
      pdf_publicado: publicado, url_documento: publicado ? `/api/certificados/verificar/${letra.repeat(30)}?archivo=1` : null };
  }
  it('comparte el diseño entre DNI y código y mantiene completos los iconos en pantallas estrechas', () => {
    const f = crear();
    const c = f.componentInstance as any;
    const vista: HTMLElement = f.nativeElement;
    const tipo = 'Capacitación ' + 'Institucional'.repeat(8);
    const tarjetas = () => Array.from(vista.querySelectorAll<HTMLElement>('.resultados'));
    const medir = (ancho: number) => {
      vista.style.width = ancho + 'px';
      return tarjetas().map(tarjeta => {
        expect(tarjeta.scrollWidth).toBeLessThanOrEqual(tarjeta.clientWidth);
        const iconos = tarjeta.querySelectorAll<SVGSVGElement>('.insignia svg, .badge-check');
        for (const icono of Array.from(iconos)) {
          const caja = icono.getBoundingClientRect();
          const contenedor = icono.parentElement!.getBoundingClientRect();
          expect(caja.width).toBeGreaterThan(20);
          expect(caja.height).toBe(caja.width);
          expect(caja.left).toBeGreaterThanOrEqual(contenedor.left);
          expect(caja.right).toBeLessThanOrEqual(contenedor.right);
          expect(caja.top).toBeGreaterThanOrEqual(contenedor.top);
          expect(caja.bottom).toBeLessThanOrEqual(contenedor.bottom);
        }
        return tarjeta.getBoundingClientRect().width;
      });
    };

    c.dni.setValue('01234567');
    c.buscar();
    http.expectOne('/api/portal-certificados/consultar-dni').flush({ success: true, data: {
      certificados: [{ ...filaDni('a'), tipo_certificado: tipo }, filaDni('b')],
    } });
    f.detectChanges();
    expect(tarjetas().length).toBe(2);
    expect(tarjetas()[0].querySelector('h2')?.textContent).toBe(tipo);
    expect(vista.querySelector('.badge-check')).toBeNull();
    expect(tarjetas()[0].querySelector('.estado')?.textContent?.trim()).toBe('Disponible');
    const anchos = [320, 768, 1280];
    const porDni = anchos.map(ancho => medir(ancho)[0]);

    const verificacionesDni = http.match(r => r.method === 'GET' && r.url.startsWith('/api/certificados/verificar/'));
    expect(verificacionesDni.length).toBe(2);
    consultar(c).flush({ success: true, data: { ...datos, tipo_certificado: tipo } });
    expect(verificacionesDni.every(req => req.cancelled)).toBeTrue();
    f.detectChanges();
    expect(tarjetas().length).toBe(1);
    expect(tarjetas()[0].querySelector('h2')?.textContent).toBe(tipo);
    expect(vista.querySelectorAll('.badge-check').length).toBe(1);
    expect(anchos.map(ancho => medir(ancho)[0])).toEqual(porDni);
    f.destroy();
  });
  it('agrega el sello únicamente al resultado DNI vigente e íntegro y conserva sus datos y disponibilidad', () => {
    const f = crear();
    const c = f.componentInstance as any;
    c.dni.setValue('01234567');
    c.buscar();
    http.expectOne('/api/portal-certificados/consultar-dni').flush({ success: true, data: {
      certificados: [filaDni('a'), { ...filaDni('b'), tipo_certificado: 'Reconocimiento' }, filaDni('c'), filaDni('d'), filaDni('e')],
    } });
    f.detectChanges();
    const tarjetas = Array.from(f.nativeElement.querySelectorAll('.resultados') as NodeListOf<HTMLElement>);
    expect(tarjetas.length).toBe(5);
    expect(f.nativeElement.querySelector('.badge-check')).toBeNull();
    const original = c.resultadosDni();
    const verificar = (letra: string, cambios: object) => {
      const codigoVerificado = letra.repeat(30);
      const req = http.expectOne('/api/certificados/verificar/' + codigoVerificado);
      expect(req.request.withCredentials).toBeFalse();
      expect(req.request.headers.has('Authorization')).toBeFalse();
      req.flush({ success: true, data: { ...datos, codigo_verificacion: codigoVerificado, ...cambios } });
    };
    verificar('a', { actividad: 'Respuesta de verificación', url_documento: null });
    verificar('b', { integridad_verificada: false });
    verificar('c', { estado_certificado: 'Revocado' });
    verificar('d', { vigente: false });
    http.expectOne('/api/certificados/verificar/' + 'e'.repeat(30))
      .flush({}, { status: 503, statusText: 'Service Unavailable' });
    f.detectChanges();
    expect(c.resultadosDni()).toBe(original);
    expect(tarjetas[0].textContent).toContain('Jornada municipal');
    expect(tarjetas[0].textContent).not.toContain('Respuesta de verificación');
    expect(tarjetas[0].textContent).toContain('Certificado verificado');
    expect(tarjetas[0].querySelector('.badge-check')).not.toBeNull();
    expect(tarjetas[0].querySelector('a')).toBeNull();
    expect(tarjetas.every(tarjeta => tarjeta.textContent?.includes('Disponible'))).toBeTrue();
    expect(tarjetas.slice(1).every(tarjeta => !tarjeta.querySelector('.badge-check'))).toBeTrue();
    f.destroy();
  });
  for (const cantidad of [1, 2]) {
    it(`presenta ${cantidad} documentos del contrato DNI sin atribuir publicación a disponible_rrhh`, () => {
      const f = crear(); const c = f.componentInstance as any; c.dni.setValue('01234567'); c.buscar();
      http.expectOne('/api/portal-certificados/consultar-dni').flush({ success: true, data: {
        certificados: [filaDni('a'), filaDni('b')].slice(0, cantidad),
      } }); f.detectChanges();
      const tarjetas = f.nativeElement.querySelectorAll('.resultados'); expect(tarjetas.length).toBe(cantidad);
      expect(tarjetas[0].textContent).toContain('Capacitación'); expect(tarjetas[0].textContent).toContain('Jornada municipal');
      expect(tarjetas[0].textContent).toContain('03/11/2026'); expect(tarjetas[0].textContent).toContain('Disponible');
      expect(tarjetas[0].querySelector('a')).toBeNull();
      expect(tarjetas[0].textContent).toContain('a'.repeat(30));
      expect(Array.from(f.nativeElement.querySelectorAll('button')).some((b: any) => b.textContent === 'Ver certificado')).toBeFalse();
      expect(f.nativeElement.querySelector('a[download]')).toBeNull();
      c.verCertificado(c.resultadosDni()[0]); http.expectNone(r => r.url.includes('?archivo=1')); f.destroy();
    });
  }
  it('abre exclusivamente el PDF publicado de la tarjeta elegida y conserva la lista al regresar', () => {
    const f = crear(); const c = f.componentInstance as any; c.dni.setValue('01234567'); c.buscar();
    const publico = filaDni('b', true);
    http.expectOne('/api/portal-certificados/consultar-dni').flush({ success: true, data: { certificados: [filaDni('a'), publico] } }); f.detectChanges();
    const botones = Array.from(f.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];
    botones.find(b => b.textContent === 'Ver certificado')!.click(); f.detectChanges();
    const req = http.expectOne(publico.url_documento!); expect(req.request.withCredentials).toBeFalse();
    req.flush(null, { status: 403, statusText: 'Forbidden' }); f.detectChanges();
    expect(f.nativeElement.querySelector('a[download]')).toBeNull(); c.volver(); f.detectChanges();
    expect(f.nativeElement.querySelectorAll('.resultados').length).toBe(2); f.destroy();
  });
  it('no habilita PDF si pdf_publicado es false aunque se reciba una URL, ni muestra disponibilidad negada', () => {
    const f = crear(); const c = f.componentInstance as any; c.dni.setValue('01234567'); c.buscar();
    http.expectOne('/api/portal-certificados/consultar-dni').flush({ success: true, data: { certificados: [
      { ...filaDni('a', true), pdf_publicado: false }, { ...filaDni('b'), disponible_rrhh: false },
    ] } }); f.detectChanges(); expect(c.resultadosDni().length).toBe(2);
    expect(c.resultadosDni()[1].urlPdf).toBeNull();
    expect(c.resultadosDni()[0].urlPdf).toBeNull(); f.destroy();
  });
  for (const status of [401, 403, 422, 429, 503]) {
    it(`no transforma HTTP ${status} de DNI en una lista vacía ni expone el error técnico`, () => {
      const f = crear(); const c = f.componentInstance as any; c.dni.setValue('01234567'); c.buscar();
      http.expectOne('/api/portal-certificados/consultar-dni').flush({ message: 'SQLSTATE privado' }, { status, statusText: 'Error' }); f.detectChanges();
      expect(c.cargando()).toBeFalse(); expect(c.resultadosDni()).toBeNull();
      expect(f.nativeElement.textContent).not.toContain('No hay certificados'); expect(f.nativeElement.textContent).not.toContain('SQLSTATE');
      expect(c.mensaje()).not.toBe(''); f.destroy();
    });
  }
  it('una respuesta incompleta de DNI es un error de integración, nunca ausencia de certificados', () => {
    const f = crear(); const c = f.componentInstance as any; c.dni.setValue('01234567'); c.buscar();
    http.expectOne('/api/portal-certificados/consultar-dni').flush({ success: true, data: {} }); f.detectChanges();
    expect(c.resultadosDni()).toBeNull(); expect(c.mensaje()).not.toBe(''); f.destroy();
  });
});

describe('Acceso adicional al portal público', () => {
  it('muestra un enlace independiente aun sin permisos administrativos', () => {
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: AuthService,
      useValue: { usuario: signal(null), tienePermiso: () => false } }] });
    const f = TestBed.createComponent(SidebarComponent); f.detectChanges();
    const enlace = f.nativeElement.querySelector('a[href="/portal-certificados"]');
    expect(enlace.textContent).toContain('Portal público');
    expect(enlace.querySelector('.material-symbols-outlined').textContent).toBe('verified');
    f.destroy();
  });
});

describe('Sesión real y layout estable durante la consulta pública', () => {
  let http: HttpTestingController;
  let h: RouterTestingHarness;
  const codigo = 'a'.repeat(30);
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes),
      provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting(),
      { provide: AuthService, useClass: SessionAuthService },
    ] });
    TestBed.overrideComponent(PdfContinuoComponent, { set: { template: '<div>PDF original</div>' } });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => { h?.fixture.destroy(); http.verify({ ignoreCancelled: true }); });
  function componente(): any { return h.fixture.debugElement.query(By.directive(PortalCertificadosComponent)).componentInstance; }
  it('recupera sesión antes de consultar un QR y conserva formulario y sidebar ante un error público', async () => {
    h = await RouterTestingHarness.create('/verificar/' + codigo);
    http.expectNone('/api/certificados/verificar/' + codigo);
    http.expectOne('/api/auth/me').flush({ user: { id: 1, nombre: 'Administrador', rol: 'Administrador', email: 'admin@institucional.test' },
      modulos: [], permisos: [], capacidades_solicitudes: {} }); h.detectChanges(); h.detectChanges();
    const c = componente(); const sidebar = h.routeNativeElement!.querySelector('app-sidebar');
    expect(sidebar).not.toBeNull(); expect(c.modo()).toBe('codigo'); expect(c.codigo.value).toBe(codigo);
    http.expectOne('/api/certificados/verificar/' + codigo).flush({}, { status: 404, statusText: 'Not Found' }); h.detectChanges();
    expect(componente()).toBe(c); expect(c.modo()).toBe('codigo'); expect(c.codigo.value).toBe(codigo);
    expect(h.routeNativeElement!.querySelector('app-sidebar')).toBe(sidebar);
    expect(h.routeNativeElement!.querySelector('#dni-publico')).toBeNull();
    http.expectNone('/api/auth/me'); http.expectNone('/api/portal-certificados/consultar-dni');
  });
  it('recupera la sesión al recargar y conserva el mismo sidebar al buscar DNI, abrir PDF, descargar, regresar y recibir un 401 público', async () => {
    h = await RouterTestingHarness.create('/portal-certificados');
    http.expectOne('/api/auth/me').flush({ user: { id: 1, nombre: 'Administrador', rol: 'Administrador', email: 'admin@institucional.test' },
      modulos: [], permisos: [], capacidades_solicitudes: {} }); h.detectChanges();
    const sidebar = h.routeNativeElement!.querySelector('app-sidebar');
    expect(sidebar).not.toBeNull();
    const c = componente(); c.dni.setValue('01234567'); c.buscar(); h.detectChanges();
    http.expectOne('/api/portal-certificados/consultar-dni').flush({ success: true, data: { certificados: [{
      referencia_publica: 'a'.repeat(64), codigo_verificacion: codigo, origen: 'sesion', tipo_certificado: 'Capacitación',
      actividad: 'Jornada municipal', sesion: 'Sesión 001', fecha_sesion: '2026-11-03',
      estado_disponibilidad: 'Listo para entrega', disponible_rrhh: true, pdf_publicado: true,
      url_documento: `/api/certificados/verificar/${codigo}?archivo=1`,
    }] } }); h.detectChanges();
    expect(c.resultadosDni().length).toBe(1);
    expect(c.resultado()).toBeNull();
    expect(h.routeNativeElement!.querySelector('app-sidebar')).toBe(sidebar);
    // La autorización y el transporte HTTP del PDF se cubren también en los casos anteriores.
    spyOn(TestBed.inject(PortalCertificadosService), 'archivo').and.returnValue(of({
      blob: new Blob(['%PDF-1.4 original'], { type: 'application/pdf' }), nombre: 'certificado.pdf',
    }));
    c.verCertificado(c.resultadosDni()[0]); h.detectChanges();
    expect(h.routeNativeElement!.querySelector('app-pdf-continuo')).not.toBeNull();
    expect(h.routeNativeElement!.querySelector('a[download]')).not.toBeNull();
    expect(h.routeNativeElement!.querySelector('app-sidebar')).toBe(sidebar);
    c.volver(); h.detectChanges();
    expect(h.routeNativeElement!.querySelector('app-sidebar')).toBe(sidebar);
    c.buscar(); http.expectOne('/api/portal-certificados/consultar-dni').flush({}, { status: 401, statusText: 'Unauthorized' }); h.detectChanges();
    expect(TestBed.inject(AuthService).isAuthenticated()).toBeTrue();
    expect(h.routeNativeElement!.querySelector('app-sidebar')).toBe(sidebar);
    expect(TestBed.inject(Router).url).toBe('/portal-certificados');
    http.expectNone('/api/auth/logout'); http.expectNone('/api/auth/me');
  });
  it('una comprobación de sesión 401 permite consultar anónimamente sin login ni sidebar', async () => {
    h = await RouterTestingHarness.create('/portal-certificados');
    expect(h.routeNativeElement!.textContent).toContain('Portal Público de Certificados');
    expect(h.routeNativeElement!.textContent).not.toContain('Abriendo Portal');
    expect(h.routeNativeElement!.querySelector('[role="status"]')).not.toBeNull();
    http.expectOne('/api/auth/me').flush({}, { status: 401, statusText: 'Unauthorized' }); h.detectChanges();
    expect(h.routeNativeElement!.querySelector('app-sidebar')).toBeNull();
    expect(TestBed.inject(Router).url).toBe('/portal-certificados');
    const c = componente(); c.dni.setValue('01234567'); c.buscar(); h.detectChanges();
    http.expectOne('/api/portal-certificados/consultar-dni').flush({ success: true, data: { certificados: [] } }); h.detectChanges();
    expect(c.resultado()).toBeNull(); expect(c.resultadosDni()).toEqual([]);
    http.expectNone(() => true);
  });
});
