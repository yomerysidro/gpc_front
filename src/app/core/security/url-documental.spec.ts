import { environment } from '../../../environments/environment';
import { enlaceVerificacionSeguro } from './url-documental';

describe('URL de verificación proporcionada por Laravel', () => {
  const produccion = environment.production;
  afterEach(() => { environment.production = produccion; });
  it('no genera un código ni acepta protocolos ejecutables', () => {
    expect(enlaceVerificacionSeguro(null)).toBeNull();
    expect(enlaceVerificacionSeguro('javascript:alert(1)')).toBeNull();
    expect(enlaceVerificacionSeguro('https://user:secret@municipalidad.test/verificar/a')).toBeNull();
  });
  it('conserva el destino público HTTPS recibido del backend', () => {
    environment.production = true;
    expect(enlaceVerificacionSeguro('https://certificados.municipalidad.test/verificar/abc')).toBe('https://certificados.municipalidad.test/verificar/abc');
    expect(enlaceVerificacionSeguro('http://localhost:4200/verificar/abc')).toBeNull();
    expect(enlaceVerificacionSeguro('https://127.0.0.1/verificar/abc')).toBeNull();
    expect(enlaceVerificacionSeguro('http://certificados.municipalidad.test/verificar/abc')).toBeNull();
  });
});
