import { inject, Injectable, InjectionToken } from '@angular/core';
import { catchError, EMPTY, expand, map, Observable, of, reduce, switchMap, throwError } from 'rxjs';
import { AuthService } from '../autenticacion/auth.service';
import { ActivityRequestDraft, ActivityRequestFilters, ActivityRequestRow } from '../../interfaces/solicitudes/activity-requests-api.interface';
import { AccionSolicitud, BandejaSolicitud, ContextoSolicitud, DatosSolicitud, DocumentoPendiente, ESTADOS_SOLICITUD, FiltroSolicitudes, PaginaSolicitudes, Solicitud } from '../../interfaces/solicitudes/solicitud.interface';
import { ActivityRequestsApiService } from './activity-requests-api.service';
import type { SolicitudesGateway } from './solicitudes.service';

/** Permisos efectivos de /auth/me. Laravel vuelve a validar área y competencia en cada operación. */
export interface AutorizacionSolicitudes {
  readonly estadoAutorizacion?: unknown;
  contexto(): Observable<ContextoSolicitud>;
  capacidades(fila: ActivityRequestRow): { readonly propia: boolean; readonly puedeEditar: boolean; readonly acciones: readonly AccionSolicitud[] };
  readonly consultaRevision: boolean;
  readonly consultaGerencia: boolean;
  readonly consultaHistorial: boolean;
  readonly consultaDetalle: boolean;
  readonly consultaPropias: boolean;
}
export const AUTORIZACION_SOLICITUDES = new InjectionToken<AutorizacionSolicitudes | null>('AUTORIZACION_SOLICITUDES', { providedIn: 'root', factory: () => {
  const auth = inject(AuthService);
  const permiso = (clave: string) => !!auth.usuario() && auth.tienePermiso(`solicitudes.${clave}`);
  const capacidades = () => auth.usuario() ? auth.capacidadesSolicitudes?.() : null;
  return {
    get estadoAutorizacion() { return capacidades(); },
    contexto: () => of({ responsable: auth.usuario()?.nombre ?? '', areasDisponibles: [], puedeCrear: permiso('crear') }),
    get consultaRevision() { return capacidades()?.consultar_revision === true; },
    get consultaGerencia() { return capacidades()?.consultar_gerencia === true; },
    get consultaHistorial() { return capacidades()?.consultar_historial === true; },
    get consultaDetalle() { return permiso('consultar') || capacidades()?.consulta_administrativa_global === true || capacidades()?.consultar_revision === true || capacidades()?.consultar_gerencia === true; },
    get consultaPropias() { return permiso('propias'); },
    capacidades: fila => {
      const propia = !!auth.usuario() && fila.id_usuario_solicitante === auth.usuario()!.id;
      const facultades = capacidades();
      const puedeDecidirPorPropiedad = !propia || facultades?.decidir_propias === true;
      // decidir_ambito_institucional no sustituye aprobar/rechazar ni decidir_propias.
      // Sin esa excepción, Laravel limita las filas al ámbito laboral autorizado.
      const acciones: AccionSolicitud[] = [];
      if (propia && permiso('enviar')) acciones.push('Enviar');
      if (capacidades()?.revisar === true) acciones.push('Iniciar revisión');
      if (capacidades()?.derivar === true) acciones.push('Derivar');
      if (permiso('observar') && (fila.estado === 'Pendiente de aprobación' ? capacidades()?.aprobar : capacidades()?.revisar) === true) acciones.push('Observar');
      if (puedeDecidirPorPropiedad && facultades?.aprobar === true) acciones.push('Aprobar');
      if (puedeDecidirPorPropiedad && facultades?.rechazar === true) acciones.push('Rechazar');
      return { propia, puedeEditar: propia && permiso('editar'), acciones };
    },
  };
} });
const pendientes = () => throwError(() => new Error('El servicio de Solicitudes está temporalmente no disponible. No se ha enviado información.'));
export class AccesoSolicitudLocal extends Error {
  readonly origen = 'frontend';
  constructor(readonly operacion: 'consulta' | 'accion') {
    super(operacion === 'consulta' ? 'Tu sesión no tiene habilitada esta consulta de Solicitudes.' : 'Tu sesión no tiene habilitada esta acción o el estado de la solicitud no la permite.');
  }
}
const restringido = (operacion: 'consulta' | 'accion' = 'consulta') => throwError(() => new AccesoSolicitudLocal(operacion));
const ESTADOS_ACCION: Record<AccionSolicitud, readonly string[]> = {
  Enviar: ['Borrador', 'Observada'], 'Iniciar revisión': ['Enviada'], Observar: ['Enviada', 'En revisión', 'Pendiente de aprobación'],
  Derivar: ['En revisión'], Aprobar: ['Pendiente de aprobación'], Rechazar: ['Pendiente de aprobación'],
};

@Injectable({ providedIn: 'root' })
export class SolicitudesHttpGateway implements SolicitudesGateway {
  private readonly api = inject(ActivityRequestsApiService);
  private readonly acceso = inject(AUTORIZACION_SOLICITUDES);
  readonly disponible = this.api.disponible && this.acceso !== null;
  private readonly registros = new Map<string, ActivityRequestRow>();
  private readonly decisionesDenegadas = new Map<string, unknown>();
  contexto(): Observable<ContextoSolicitud> { return this.disponible && this.acceso ? this.acceso.contexto() : pendientes(); }

  listar(bandeja: BandejaSolicitud, filtro: FiltroSolicitudes): Observable<PaginaSolicitudes<Solicitud>> {
    if (!this.disponible || !this.acceso) return pendientes();
    if (bandeja === 'propias' && this.acceso.consultaPropias === false) return restringido();
    if (bandeja === 'revision' && !this.acceso.consultaRevision || bandeja === 'gerencia' && !this.acceso.consultaGerencia) return restringido();
    if (filtro.estado && !ESTADOS_SOLICITUD.includes(filtro.estado as ActivityRequestRow['estado'])) return throwError(() => new Error('Estado de solicitud no admitido por Laravel.'));
    const parametros: ActivityRequestFilters = {
      estado: filtro.estado as ActivityRequestRow['estado'] || (bandeja === 'revision' ? 'Enviada' : undefined),
      fecha_desde: filtro.desde || undefined, fecha_hasta: filtro.hasta || undefined, per_page: 20, page: filtro.pagina,
    };
    if (!filtro.busqueda.trim()) return this.api.listar(parametros, bandeja === 'propias').pipe(map(pagina => ({
      registros: pagina.data.map(fila => this.vista(fila)), total: pagina.total, pagina: pagina.current_page, ultimaPagina: pagina.last_page,
    })));
    // Laravel no admite búsqueda por texto: consultar todas las páginas antes de filtrar/paginar localmente.
    return this.api.listar({ ...parametros, page: 1, per_page: 100 }, bandeja === 'propias').pipe(
      expand(pagina => pagina.current_page < pagina.last_page ? this.api.listar({ ...parametros, page: pagina.current_page + 1, per_page: 100 }, bandeja === 'propias') : EMPTY),
      reduce((filas, pagina) => [...filas, ...pagina.data], [] as ActivityRequestRow[]),
      map(filas => this.paginar(filas.map(fila => this.vista(fila)).filter(fila => `${fila.nombre} ${fila.numero}`.toLocaleLowerCase().includes(filtro.busqueda.trim().toLocaleLowerCase())), filtro.pagina)),
    );
  }
  detalle(id: string, administrativo = false): Observable<Solicitud> {
    if (!this.disponible) return pendientes();
    if (administrativo && !this.acceso?.consultaDetalle) return restringido();
    return (administrativo ? this.api.detalleRevision(Number(id)) : this.api.detalle(Number(id))).pipe(
      map(fila => this.vista(fila)),
      catchError((error: unknown) => {
        if (typeof error === 'object' && error !== null && 'status' in error && error.status === 403) this.decisionesDenegadas.set(id, this.acceso?.estadoAutorizacion);
        return throwError(() => error);
      }),
    );
  }
  guardar(datos: DatosSolicitud, existente: { id: string; version: string } | null): Observable<Solicitud> {
    if (!this.disponible || !this.acceso) return pendientes();
    if (existente) {
      const fila = this.registros.get(existente.id);
      if (!fila || !['Borrador', 'Observada'].includes(fila.estado) || !this.acceso.capacidades(fila).puedeEditar || !this.acceso.capacidades(fila).propia) return restringido('accion');
    }
    const dto: ActivityRequestDraft = {
      id_area: Number(datos.areaId), id_tipo_actividad: Number(datos.tipoId), nombre: datos.nombre,
      descripcion: datos.descripcion || null, justificacion: datos.objetivo, fecha_inicio_propuesta: datos.inicio,
      fecha_fin_propuesta: datos.fin, sede_propuesta: datos.lugar || null,
    };
    // No existe versión en el contrato; nunca se envía. La concurrencia se resuelve en Laravel.
    return this.contexto().pipe(switchMap(contexto => {
      if (!existente && !contexto.puedeCrear) return restringido('accion');
      return (existente ? this.api.editarBorrador(Number(existente.id), dto) : this.api.crearBorrador(dto)).pipe(map(fila => this.vista(fila)));
    }));
  }
  decidir(id: string, _version: string, accion: AccionSolicitud, motivo: string): Observable<Solicitud> {
    const fila = this.registros.get(id);
    if (!this.disponible) return pendientes();
    if (!fila || !this.vista(fila).acciones.includes(accion)) return restringido('accion');
    if (['Observar', 'Rechazar'].includes(accion) && !motivo.trim()) return throwError(() => new Error('La observación es obligatoria.'));
    const observacion = motivo.trim() ? { observacion: motivo.trim() } : {};
    const operacion = accion === 'Enviar' ? this.api.enviar(Number(id)) : accion === 'Iniciar revisión' ? this.api.revisar(Number(id), observacion)
      : accion === 'Observar' ? this.api.observar(Number(id), motivo.trim()) : accion === 'Derivar' ? this.api.derivar(Number(id), observacion)
        : accion === 'Aprobar' ? this.api.aprobar(Number(id), observacion) : this.api.rechazar(Number(id), motivo.trim());
    return operacion.pipe(map(registro => {
      if (registro.id_solicitud_actividad !== Number(id)
        || accion === 'Aprobar' && (registro.estado !== 'Aprobada' || !Number.isSafeInteger(registro.id_actividad) || registro.id_actividad! < 1)
        || accion === 'Rechazar' && (registro.estado !== 'Rechazada' || registro.id_actividad !== null)) {
        throw new Error('El servidor no confirmó el resultado esperado. Actualiza la solicitud antes de reintentar.');
      }
      return this.vista(registro);
    }), catchError((error: unknown) => {
      if (typeof error === 'object' && error !== null && 'status' in error && error.status === 403) this.decisionesDenegadas.set(id, this.acceso?.estadoAutorizacion);
      return throwError(() => error);
    }));
  }
  puedeConsultarHistorial(id: string): boolean {
    const fila = this.registros.get(id);
    return !!fila && (this.acceso?.consultaHistorial === true || this.acceso?.consultaPropias === true && this.acceso.capacidades(fila).propia);
  }
  historialSolicitud(id: string) {
    if (!this.disponible) return pendientes();
    if (!this.puedeConsultarHistorial(id)) return restringido();
    return this.api.historial(Number(id));
  }
  documentos(_pagina: number): Observable<PaginaSolicitudes<DocumentoPendiente>> { return throwError(() => new Error('La bandeja de certificados por firmar no forma parte del contrato de solicitudes.')); }
  documento(_id: string): Observable<Blob> { return throwError(() => new Error('El contrato de solicitudes no proporciona descarga de documentos.')); }
  accionesPermitidas(fila: Solicitud): readonly AccionSolicitud[] {
    const original = this.registros.get(fila.id);
    return original ? this.vista(original).acciones : [];
  }

  private vista(fila: ActivityRequestRow): Solicitud {
    this.registros.set(String(fila.id_solicitud_actividad), fila);
    const facultades = this.acceso?.capacidades(fila);
    const denegada = this.decisionesDenegadas.has(String(fila.id_solicitud_actividad))
      && this.decisionesDenegadas.get(String(fila.id_solicitud_actividad)) === this.acceso?.estadoAutorizacion;
    return { id: String(fila.id_solicitud_actividad), idSolicitudActividad: fila.id_solicitud_actividad, numero: `Solicitud ${fila.id_solicitud_actividad}`, areaId: String(fila.id_area), area: fila.area_nombre?.trim() || 'No informado',
      responsable: fila.solicitante_nombre?.trim() || 'No informado', tipoId: String(fila.id_tipo_actividad), tipo: fila.tipo_actividad_nombre || `Tipo #${fila.id_tipo_actividad}`,
      nombre: fila.nombre, descripcion: fila.descripcion ?? '', objetivo: fila.justificacion, inicio: fila.fecha_inicio_propuesta, fin: fila.fecha_fin_propuesta,
      lugar: fila.sede_propuesta ?? '', observaciones: '', fecha: fila.fecha_solicitud, estado: fila.estado, actividadId: fila.id_actividad, revisor: null, ultimaObservacion: null, resultadoRevision: null,
      version: '', puedeVerDetalle: facultades?.propia === true && this.acceso?.consultaPropias === true || this.acceso?.consultaDetalle === true, puedeEditar: facultades?.propia === true && facultades.puedeEditar && ['Borrador', 'Observada'].includes(fila.estado),
      acciones: (facultades?.acciones ?? []).filter(accion => !denegada && ESTADOS_ACCION[accion].includes(fila.estado) && (accion !== 'Enviar' || facultades?.propia)),
    };
  }
  private paginar<T>(filas: readonly T[], pagina: number): PaginaSolicitudes<T> {
    const ultimaPagina = Math.max(1, Math.ceil(filas.length / 20)); const actual = Math.min(ultimaPagina, Math.max(1, pagina));
    return { registros: filas.slice((actual - 1) * 20, actual * 20), total: filas.length, pagina: actual, ultimaPagina };
  }
}
