import { inject, Injectable, InjectionToken } from '@angular/core';
import { EMPTY, expand, map, Observable, of, reduce, switchMap, throwError } from 'rxjs';
import { AuthService } from '../autenticacion/auth.service';
import { ActivityRequestGlobalDecisionRow, ActivityRequestHistoryFilters } from '../../interfaces/solicitudes/activity-requests-api.interface';
import { ActivityRequestDraft, ActivityRequestFilters, ActivityRequestRow, TipoDecisionSolicitud } from '../../interfaces/solicitudes/activity-requests-api.interface';
import { AccionSolicitud, BandejaSolicitud, ContextoSolicitud, DatosSolicitud, DecisionSolicitud, DocumentoPendiente, ESTADOS_SOLICITUD, FiltroSolicitudes, PaginaSolicitudes, Solicitud } from '../../interfaces/solicitudes/solicitud.interface';
import { ActivityRequestsApiService } from './activity-requests-api.service';
import type { SolicitudesGateway } from './solicitudes.service';

/** Permisos efectivos de /auth/me. Laravel vuelve a validar área y competencia en cada operación. */
export interface AutorizacionSolicitudes {
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
    contexto: () => of({ responsable: auth.usuario()?.nombre ?? '', areasDisponibles: [], puedeCrear: permiso('crear') }),
    get consultaRevision() { return capacidades()?.consultar_revision === true; },
    get consultaGerencia() { return capacidades()?.consultar_gerencia === true; },
    get consultaHistorial() { return capacidades()?.consultar_historial === true; },
    get consultaDetalle() { return permiso('consultar') || capacidades()?.consulta_administrativa_global === true || capacidades()?.consultar_revision === true || capacidades()?.consultar_gerencia === true; },
    get consultaPropias() { return permiso('propias'); },
    capacidades: fila => {
      const propia = !!auth.usuario() && fila.id_usuario_solicitante === auth.usuario()!.id;
      const acciones: AccionSolicitud[] = [];
      if (propia && permiso('enviar')) acciones.push('Enviar');
      if (capacidades()?.revisar === true) acciones.push('Iniciar revisión');
      if (capacidades()?.derivar === true) acciones.push('Derivar');
      if (permiso('observar') && (fila.estado === 'Pendiente de aprobación' ? capacidades()?.aprobar : capacidades()?.revisar) === true) acciones.push('Observar');
      if (!propia && capacidades()?.aprobar === true) acciones.push('Aprobar');
      if (!propia && capacidades()?.rechazar === true) acciones.push('Rechazar');
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
const RESULTADOS: Record<TipoDecisionSolicitud, DecisionSolicitud['resultado']> = {
  REVISION_CONFORME: 'Revisión conforme', OBSERVAR: 'Observada', DERIVAR_GERENCIA: 'Derivada a Gerencia', APROBAR: 'Aprobada', RECHAZAR: 'Rechazada',
};
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
  contexto(): Observable<ContextoSolicitud> { return this.disponible && this.acceso ? this.acceso.contexto() : pendientes(); }

  listar(bandeja: BandejaSolicitud, filtro: FiltroSolicitudes): Observable<PaginaSolicitudes<Solicitud>> {
    if (!this.disponible || !this.acceso) return pendientes();
    if (bandeja === 'propias' && this.acceso.consultaPropias === false) return restringido();
    if (bandeja === 'revision' && !this.acceso.consultaRevision || bandeja === 'gerencia' && !this.acceso.consultaGerencia) return restringido();
    if (filtro.estado && !ESTADOS_SOLICITUD.includes(filtro.estado as ActivityRequestRow['estado'])) return throwError(() => new Error('Estado de solicitud no admitido por Laravel.'));
    const parametros: ActivityRequestFilters = {
      estado: bandeja === 'gerencia' ? 'Pendiente de aprobación' : filtro.estado as ActivityRequestRow['estado'] || undefined,
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
    return (administrativo ? this.api.detalleRevision(Number(id)) : this.api.detalle(Number(id))).pipe(map(fila => this.vista(fila)));
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
    return operacion.pipe(map(registro => this.vista(registro)));
  }
  historial(filtro: FiltroSolicitudes): Observable<PaginaSolicitudes<DecisionSolicitud>> {
    if (!this.disponible) return pendientes();
    if (!this.acceso?.consultaHistorial) return restringido();
    for (const valor of [filtro.solicitudId, filtro.responsableId]) {
      if (valor !== undefined && valor !== null && valor !== '' && (!Number.isSafeInteger(Number(valor)) || Number(valor) < 1)) return throwError(() => new Error('Los identificadores de filtro deben ser enteros positivos.'));
    }
    const tipo = (Object.keys(RESULTADOS) as TipoDecisionSolicitud[]).find(clave => RESULTADOS[clave] === filtro.estado);
    if (filtro.estado && !tipo) return throwError(() => new Error('Tipo de decisión no admitido por Laravel.'));
    const parametros: ActivityRequestHistoryFilters = {
      id_solicitud_actividad: filtro.solicitudId ? Number(filtro.solicitudId) : undefined,
      id_usuario_responsable: filtro.responsableId ? Number(filtro.responsableId) : undefined,
      tipo_decision: tipo, fecha_desde: filtro.desde || undefined, fecha_hasta: filtro.hasta || undefined, per_page: 20, page: filtro.pagina,
    };
    if (!filtro.busqueda.trim()) return this.api.historialGlobal(parametros).pipe(map(pagina => ({
      registros: pagina.data.map(fila => this.vistaDecision(fila)), total: pagina.total, pagina: pagina.current_page, ultimaPagina: pagina.last_page,
    })));
    return this.api.historialGlobal({ ...parametros, page: 1, per_page: 100 }).pipe(
      expand(pagina => pagina.current_page < pagina.last_page ? this.api.historialGlobal({ ...parametros, page: pagina.current_page + 1, per_page: 100 }) : EMPTY),
      reduce((filas, pagina) => [...filas, ...pagina.data], [] as ActivityRequestGlobalDecisionRow[]),
      map(filas => this.paginar(filas.map(fila => this.vistaDecision(fila)).filter(fila => `${fila.nombreSolicitud} ${fila.numero} ${fila.area}`.toLocaleLowerCase().includes(filtro.busqueda.trim().toLocaleLowerCase())), filtro.pagina)),
    );
  }
  private vistaDecision(fila: ActivityRequestGlobalDecisionRow): DecisionSolicitud {
    return { id: String(fila.id_solicitud_decision), solicitudId: String(fila.id_solicitud_actividad), numero: `Solicitud #${fila.id_solicitud_actividad}`,
      nombreSolicitud: fila.solicitud_nombre, solicitanteId: fila.id_usuario_solicitante, area: `Área #${fila.id_area}`,
      fecha: fila.fecha_decision, resultado: RESULTADOS[fila.tipo_decision], responsable: `Usuario #${fila.id_usuario_responsable}`,
      motivo: fila.observacion ?? '', estadoAnterior: fila.estado_anterior, estadoPosterior: fila.estado_nuevo };
  }
  documentos(_pagina: number): Observable<PaginaSolicitudes<DocumentoPendiente>> { return throwError(() => new Error('La bandeja de documentos por firmar no forma parte del contrato de solicitudes.')); }
  documento(_id: string): Observable<Blob> { return throwError(() => new Error('El contrato de solicitudes no proporciona descarga de documentos.')); }
  accionesPermitidas(fila: Solicitud): readonly AccionSolicitud[] {
    const original = this.registros.get(fila.id);
    return original ? this.vista(original).acciones : [];
  }

  private vista(fila: ActivityRequestRow): Solicitud {
    this.registros.set(String(fila.id_solicitud_actividad), fila);
    const facultades = this.acceso?.capacidades(fila);
    return { id: String(fila.id_solicitud_actividad), numero: `Solicitud #${fila.id_solicitud_actividad}`, areaId: String(fila.id_area), area: `Área #${fila.id_area}`,
      responsable: `Usuario #${fila.id_usuario_solicitante}`, tipoId: String(fila.id_tipo_actividad), tipo: `Tipo #${fila.id_tipo_actividad}`,
      nombre: fila.nombre, descripcion: fila.descripcion ?? '', objetivo: fila.justificacion, inicio: fila.fecha_inicio_propuesta, fin: fila.fecha_fin_propuesta,
      lugar: fila.sede_propuesta ?? '', observaciones: '', fecha: fila.fecha_solicitud, estado: fila.estado, revisor: null, ultimaObservacion: null, resultadoRevision: null,
      version: '', puedeVerDetalle: facultades?.propia === true && this.acceso?.consultaPropias === true || this.acceso?.consultaDetalle === true, puedeEditar: facultades?.propia === true && facultades.puedeEditar && ['Borrador', 'Observada'].includes(fila.estado),
      acciones: (facultades?.acciones ?? []).filter(accion => ESTADOS_ACCION[accion].includes(fila.estado) && (accion !== 'Enviar' || facultades?.propia)),
    };
  }
  private paginar<T>(filas: readonly T[], pagina: number): PaginaSolicitudes<T> {
    const ultimaPagina = Math.max(1, Math.ceil(filas.length / 20)); const actual = Math.min(ultimaPagina, Math.max(1, pagina));
    return { registros: filas.slice((actual - 1) * 20, actual * 20), total: filas.length, pagina: actual, ultimaPagina };
  }
}
