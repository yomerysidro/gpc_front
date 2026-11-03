import { inject, Injectable } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { PaginaEmision, RegistroEmision } from '../../../../core/interfaces/emision-certificados/emision-certificados.interface';
import { EmisionCertificadosService } from '../../../../core/services/emision-certificados/emision-certificados.service';

export type CatalogoClasificacion = 'ativicty-type' | 'participation-type' | 'tipos-certificado';
export const ESTADOS_CLASIFICACIONES = [{ valor: '1', etiqueta: 'Activo' }, { valor: '0', etiqueta: 'Inactivo' }] as const;
export function estadoClasificacion(valor: unknown): string {
  if (valor === true || valor === 1 || valor === '1' || valor === 'true') return '1';
  if (valor === false || valor === 0 || valor === '0' || valor === 'false') return '0';
  return '';
}
const normalizar = (texto: string) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().trim();

/** Solo estos catálogos: listas completas, incluidas todas las páginas del catálogo de certificados. */
@Injectable()
export class ClasificacionesListado {
  private readonly api = inject(EmisionCertificadosService);
  private recurso?: CatalogoClasificacion;
  private filas: readonly RegistroEmision[] = [];

  invalidar(): void { this.recurso = undefined; }
  cargar(recurso: CatalogoClasificacion): Observable<void> {
    if (this.recurso === recurso) return of(undefined);
    return this.api.listarTodos(recurso).pipe(tap(filas => { this.filas = filas; this.recurso = recurso; }), map(() => undefined));
  }
  paginar(nombre: string, estado: string, numero: number, cantidad: number): PaginaEmision<RegistroEmision> {
    const campo = this.recurso === 'tipos-certificado' ? 'nombre_tipo' : 'nombre';
    const texto = normalizar(nombre);
    const filas = this.filas.filter(fila => (!texto || normalizar(String(fila[campo] ?? '')).includes(texto))
      && (!estado || estadoClasificacion(fila['estado']) === estado));
    const ultima = Math.max(1, Math.ceil(filas.length / cantidad));
    const pagina = Math.max(1, Math.min(numero, ultima));
    return { data: filas.slice((pagina - 1) * cantidad, pagina * cantidad), total: filas.length,
      current_page: pagina, last_page: ultima, per_page: cantidad };
  }
}
