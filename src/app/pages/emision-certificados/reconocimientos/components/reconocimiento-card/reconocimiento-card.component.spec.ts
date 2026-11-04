import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ReconocimientoCardComponent } from './reconocimiento-card.component';

describe('ReconocimientoCardComponent sin HTTP', () => {
  let fixture: ComponentFixture<ReconocimientoCardComponent>;
  const registro = { id_reconocimiento: 7, id_persona_trabajador: 4, titulo: 'Título de prueba', descripcion: 'Descripción registrada', motivo: 'Motivo registrado', fecha_reconocimiento: '2026-10-30', estado: 'ACTIVO' };
  const certificado = { id_certificado: 9, id_persona: 6, id_reconocimiento: 7, estado: false };
  const documento = { id_certificado_documento: 11, id_certificado: 9, codigo_verificacion: 'CODIGO-DEL-DOCUMENTO', estado: 'ANULADO', fecha_generacion: '2026-10-30', hash_certificado: 'NO-MOSTRAR' };

  beforeEach(() => {
    // No se proporciona HttpClient: la tarjeta debe poder renderizar sin él.
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    fixture = TestBed.createComponent(ReconocimientoCardComponent);
    fixture.componentRef.setInput('reconocimiento', registro);
    fixture.detectChanges();
  });

  it('presenta los datos recibidos y estados de carga sin obtener relaciones por si misma', () => {
    expect(fixture.nativeElement.textContent).toContain('Título de prueba');
    expect(fixture.nativeElement.textContent).toContain('Consultando Nombre');
    expect(fixture.nativeElement.textContent).toContain('Consultando Certificados');
    expect(fixture.nativeElement.querySelector('a')).toBeNull();
  });

  it('presenta nombre, area y cargo solo cuando los recibe autorizados', () => {
    fixture.componentRef.setInput('persona', { estado: 'disponible', datos: { id_persona: 6, nombres: 'Nombre de prueba', apellido_paterno: 'Apellido de prueba', apellido_materno: null } });
    fixture.componentRef.setInput('area', { estado: 'disponible', datos: { id_area: 2, nombre: 'Área de prueba' } });
    fixture.componentRef.setInput('trabajador', { estado: 'disponible', datos: { id_persona_trabajador: 4, id_persona: 6, id_area: 2, cargo: 'Cargo de prueba' } });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Nombre de prueba Apellido de prueba');
    expect(fixture.nativeElement.textContent).toContain('Área de prueba');
    expect(fixture.nativeElement.textContent).toContain('Cargo de prueba');
  });

  it('distingue las restricciones de Gestion y no las presenta como registros inexistentes', () => {
    fixture.componentRef.setInput('persona', { estado: 'sin-permiso', mensaje: 'No autorizado.' });
    fixture.componentRef.setInput('area', { estado: 'sin-permiso', mensaje: 'No autorizado.' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Nombre: acceso restringido');
    expect(fixture.nativeElement.textContent).toContain('Área: acceso restringido');
    expect(fixture.nativeElement.textContent).not.toContain('registro no encontrado');
  });

  it('asocia los codigos a sus documentos y no acredita firmas ni permite ver un PDF inexistente', () => {
    fixture.componentRef.setInput('certificacion', { estado: 'disponible', datos: [{ certificado, documentos: { estado: 'disponible', datos: [documento, { ...documento, id_certificado_documento: 12, codigo_verificacion: 'OTRA-VERSION', estado: 'GENERADO' }] } }] });
    fixture.detectChanges();
    const texto = fixture.nativeElement.textContent;
    expect(texto).toContain('Certificado #9 · Inactivo');
    expect(texto).toContain('CODIGO-DEL-DOCUMENTO');
    expect(texto).toContain('OTRA-VERSION');
    expect(texto).toContain('ANULADO');
    expect(texto).not.toContain('NO-MOSTRAR');
    expect(texto).not.toContain('Firmado digitalmente');
    expect(texto).not.toContain('Firmar y emitir');
    expect(fixture.nativeElement.querySelector('button')).toBeNull();
    expect(fixture.nativeElement.querySelector('iframe, canvas, a[download]')).toBeNull();
  });

  it('distingue un certificado sin documentos de un reconocimiento sin certificado', () => {
    fixture.componentRef.setInput('certificacion', { estado: 'disponible', datos: [] }); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Sin certificado asociado');
    fixture.componentRef.setInput('certificacion', { estado: 'disponible', datos: [{ certificado, documentos: { estado: 'disponible', datos: [] } }] }); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Documento pendiente de generación');
    expect(fixture.nativeElement.textContent).not.toContain('Sin certificado asociado');
  });

  it('escapa contenido de Laravel y muestra solo acciones habilitadas por la pagina', () => {
    fixture.componentRef.setInput('reconocimiento', { ...registro, titulo: '<script>alert(1)</script>' });
    fixture.componentRef.setInput('puedeVerDetalle', true); fixture.componentRef.setInput('puedeEditar', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('script')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('<script>alert(1)</script>');
    expect(fixture.nativeElement.querySelector('a[href="/certificaciones/reconocimientos/7"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('a[href="/certificaciones/reconocimientos/7/editar"]')).not.toBeNull();
  });
});
