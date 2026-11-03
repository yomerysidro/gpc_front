import { effect, inject, Injectable } from '@angular/core';
import { defer, Observable } from 'rxjs';
import { AuthService } from '../autenticacion/auth.service';
import { DatosSolicitud, FiltroSolicitudes, PaginaSolicitudes, Solicitud } from '../../interfaces/solicitudes/solicitud.interface';
import { LIMITES_SOLICITUD } from '../../interfaces/solicitudes/activity-requests-api.interface';

export const MENSAJE_SOLICITUD_DEMO = 'Solicitud de demostración. No registrada en el sistema oficial';

/** Estado efímero del flujo visual. Sin HttpClient, almacenamiento del navegador ni identidad enviada. */
@Injectable({ providedIn: 'root' })
export class SolicitudesDemoService {
  private readonly auth = inject(AuthService);
  private usuarioId: number | null = null;
  private secuencia = 0;
  private readonly filas = new Map<string, Solicitud>();
  constructor() { effect(() => this.sincronizarUsuario()); }
  get disponible(): boolean { return this.sincronizarUsuario() !== null; }
  private sincronizarUsuario(): number | null {
    const id = this.auth.usuario()?.id ?? null;
    if (id !== this.usuarioId) { this.filas.clear(); this.secuencia = 0; this.usuarioId = id; }
    return id;
  }
  private ejecutar<T>(operacion: () => T): Observable<T> {
    return defer(() => {
      if (!this.disponible) throw new Error('Inicia sesión para probar el flujo temporal.');
      return [operacion()];
    });
  }
  guardar(datos: DatosSolicitud, existente: { id: string; version: string } | null, etiquetas?: { area: string; tipo: string }): Observable<Solicitud> {
    return this.ejecutar(() => {
      const fechaValida = (valor: string) => /^\d{4}-\d{2}-\d{2}$/.test(valor) && !Number.isNaN(Date.parse(valor)) && new Date(valor).toISOString().slice(0, 10) === valor;
      if (!datos.areaId || !datos.tipoId || !datos.nombre.trim() || !datos.objetivo.trim() || !fechaValida(datos.inicio) || !fechaValida(datos.fin) || datos.fin < datos.inicio
        || datos.nombre.length > LIMITES_SOLICITUD.nombre || datos.lugar.length > LIMITES_SOLICITUD.sede || datos.descripcion.length > LIMITES_SOLICITUD.descripcion) throw new Error('Completa los campos y revisa las longitudes y fechas.');
      const anterior = existente ? this.obtener(existente.id) : null;
      if (anterior && !anterior.puedeEditar) throw new Error('La solicitud temporal enviada ya no admite edición.');
      const id = anterior?.id ?? `demo-${++this.secuencia}`;
      const fila: Solicitud = { ...datos, id, numero: `DEMOSTRACIÓN #${id.slice(5)}`, area: etiquetas?.area ?? anterior?.area ?? `Área #${datos.areaId}`,
        tipo: etiquetas?.tipo ?? anterior?.tipo ?? `Tipo #${datos.tipoId}`, responsable: this.auth.usuario()!.nombre,
        fecha: anterior?.fecha ?? new Date().toISOString(), estado: 'Borrador', version: '', puedeEditar: true, puedeVerDetalle: true,
        acciones: ['Enviar'], revisor: null, ultimaObservacion: null, resultadoRevision: null, demostracion: true };
      this.filas.set(id, this.copia(fila)); return this.copia(fila);
    });
  }
  enviar(id: string): Observable<Solicitud> {
    return this.ejecutar(() => {
      const fila = this.obtener(id);
      if (fila.estado !== 'Borrador') throw new Error('La solicitud temporal ya fue enviada.');
      const enviada: Solicitud = { ...fila, estado: 'Enviada', puedeEditar: false, acciones: [] };
      this.filas.set(id, enviada); return this.copia(enviada);
    });
  }
  detalle(id: string): Observable<Solicitud> { return this.ejecutar(() => this.copia(this.obtener(id))); }
  listar(filtro: FiltroSolicitudes): Observable<PaginaSolicitudes<Solicitud>> {
    return this.ejecutar(() => {
      const texto = filtro.busqueda.trim().toLocaleLowerCase();
      const filas = [...this.filas.values()].reverse().filter(fila => (!filtro.estado || fila.estado === filtro.estado)
        && (!filtro.desde || fila.fecha.slice(0, 10) >= filtro.desde) && (!filtro.hasta || fila.fecha.slice(0, 10) <= filtro.hasta)
        && (!texto || `${fila.nombre} ${fila.numero}`.toLocaleLowerCase().includes(texto)));
      const ultimaPagina = Math.max(1, Math.ceil(filas.length / 20)); const pagina = Math.min(ultimaPagina, Math.max(1, filtro.pagina));
      return { registros: filas.slice((pagina - 1) * 20, pagina * 20).map(fila => this.copia(fila)), total: filas.length, pagina, ultimaPagina };
    });
  }
  private obtener(id: string): Solicitud {
    const fila = this.filas.get(id); if (!fila) throw new Error('Solicitud temporal no encontrada en esta sesión.'); return fila;
  }
  private copia(fila: Solicitud): Solicitud { return { ...fila, acciones: [...fila.acciones] }; }
}
