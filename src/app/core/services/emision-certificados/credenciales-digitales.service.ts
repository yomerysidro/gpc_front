import { inject, Injectable, InjectionToken } from '@angular/core';
import { defer, Observable, throwError } from 'rxjs';
import { Firma } from '../../interfaces/emision-certificados/emision-certificados.interface';
/** Puerto para la futura carga privada. No es un endpoint ni un payload HTTP supuesto. */
export interface CargaCredencialDigital {
  readonly maximoBytes: number;
  registrar(datos: { trabajador: number; fecha: string; archivo: File; password: string }): Observable<Firma>;
}
export const CARGA_CREDENCIAL_DIGITAL = new InjectionToken<CargaCredencialDigital | null>('CARGA_CREDENCIAL_DIGITAL', { providedIn: 'root', factory: () => null });
@Injectable({ providedIn: 'root' })
export class CredencialesDigitalesService {
  private readonly carga = inject(CARGA_CREDENCIAL_DIGITAL);
  readonly maximoBytes = this.carga && Number.isSafeInteger(this.carga.maximoBytes) && this.carga.maximoBytes > 0 ? this.carga.maximoBytes : null;
  readonly disponible = !!this.carga && this.maximoBytes !== null;
  registrar(datos: { trabajador: number; fecha: string; archivo: File; password: string }): Observable<Firma> {
    return defer(() => this.carga && this.disponible ? this.carga.registrar(datos)
      : throwError(() => new Error('No existe una operación autorizada de carga privada de PFX/PKCS#12. No se ha enviado información.')));
  }
}
