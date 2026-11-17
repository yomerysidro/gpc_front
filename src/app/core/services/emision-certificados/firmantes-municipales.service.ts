import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError, timeout } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../interfaces/api/api-response.interface';
import { TrabajadorMunicipal } from '../../interfaces/emision-certificados/trabajador-municipal.interface';
import { AUTHENTICATED_REQUEST } from '../../security/auth-request.context';
import { aErrorApi } from '../../../shared/utils/error-api';

@Injectable({ providedIn: 'root' })
export class FirmantesMunicipalesService {
  private readonly http = inject(HttpClient);
  private readonly url = environment.apiBaseUrl.replace(/\/$/, '') + '/funcionarios-firmantes/trabajadores';
  private readonly base = environment.apiBaseUrl.replace(/\/$/, '') + '/funcionarios-firmantes';
  private readonly privado = { withCredentials: true, context: new HttpContext().set(AUTHENTICATED_REQUEST, true) };

  habilitar(id: number) {
    return this.confirmar(this.http.post<ApiResponse<ConfirmacionHabilitacion>>(this.base + '/habilitar', { id_persona_trabajador: id }, this.privado), id, true);
  }
  deshabilitar(id: number) {
    return this.confirmar(this.http.delete<ApiResponse<ConfirmacionHabilitacion>>(`${this.base}/${id}/habilitacion`, this.privado), id, false);
  }
  private confirmar(operacion: Observable<ApiResponse<ConfirmacionHabilitacion>>, id: number, habilitado: boolean) {
    return operacion.pipe(timeout(30000), map(r => {
      const d = r.data;
      if (!r.success || d?.completada !== true || d.persistido !== true || !this.valido(d.funcionario)
        || d.funcionario.id_persona_trabajador !== id || d.funcionario.habilitado_firma_certificados !== habilitado) {
        throw new Error('No se confirmó la habilitación solicitada.');
      }
      return d.funcionario;
    }), catchError(e => throwError(() => aErrorApi(e))));
  }
  private valido(t: TrabajadorMunicipal): boolean {
    return !!t && Number.isSafeInteger(t.id_persona_trabajador) && t.id_persona_trabajador > 0
      && typeof t.nombre === 'string' && typeof t.vigente === 'boolean'
      && typeof t.habilitado_firma_certificados === 'boolean' && typeof t.elegible_laboralmente === 'boolean';
  }

  cargar() {
    return this.http.get<ApiResponse<{ funcionarios: TrabajadorMunicipal[] }>>(this.url, {
      withCredentials: true, context: new HttpContext().set(AUTHENTICATED_REQUEST, true),
      headers: { 'Cache-Control': 'no-cache, no-store, max-age=0', Pragma: 'no-cache' },
    }).pipe(timeout(30000), map(r => {
      if (!r.success || !Array.isArray(r.data?.funcionarios)) throw new Error('Consulta incompleta.');
      const trabajadores = r.data.funcionarios;
      if (trabajadores.some(t => !this.valido(t))) throw new Error('Datos laborales incompletos.');
      return trabajadores;
    }), catchError(e => throwError(() => aErrorApi(e))));
  }
}

interface ConfirmacionHabilitacion { completada: boolean; persistido: boolean; reintento: boolean; funcionario: TrabajadorMunicipal }
