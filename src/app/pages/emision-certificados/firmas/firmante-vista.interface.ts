import { Firma, TrabajadorEmision } from '../../../core/interfaces/emision-certificados/emision-certificados.interface';

export type DatoFirmante<T> = { readonly estado: 'disponible'; readonly datos: T }
  | { readonly estado: 'cargando' | 'restringido' | 'error' | 'no-encontrado'; readonly mensaje: string };
export interface FirmanteVistaMunicipal {
  readonly firma: Firma;
  readonly trabajador: TrabajadorEmision | null;
  readonly nombre: DatoFirmante<string>;
  readonly area: DatoFirmante<string>;
}
