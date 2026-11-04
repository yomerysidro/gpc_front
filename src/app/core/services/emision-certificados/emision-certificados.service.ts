import { HttpClient, HttpContext, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, EMPTY, expand, forkJoin, map, Observable, reduce, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse, ErrorApi } from '../../interfaces/api/api-response.interface';
import {
  EntidadesEmision, FiltrosEmision, OpcionRelacion, PaginaEmision, PayloadEmision,
  RecursoEditable, RecursoEliminable, RecursoEmision, TrabajadorEmision, PersonaReconocimiento, AreaReconocimiento,
} from '../../interfaces/emision-certificados/emision-certificados.interface';
import { AUTHENTICATED_REQUEST } from '../../security/auth-request.context';
import { aErrorApi } from '../../../shared/utils/error-api';
import { PersonService } from '../person/person.service';
import { PersonWorkerService } from '../person-worker/person-worker.service';
import { AreaService } from '../area/area.service';
import { PersonDocumentService } from '../person-document/person-document.service';
import { DocumentTypeService } from '../document-type/document-type.service';
import { BLOQUEO_ESCRITURA_EMISION, ESCRITURA_EMISION_AUTORIZADA } from './operaciones-emision';

/** Ámbitos reales de config/module_permissions.php; no se deducen del nombre de la URL. */
export const PERMISOS_EMISION: Record<RecursoEmision, string> = {
  activity: 'actividades', 'activity-session': 'actividades', 'ativicty-type': 'actividades',
  'activity-speaker': 'ponentes-firmantes', participation: 'participantes',
  'participation-type': 'participantes', attendance: 'participantes',
  certificados: 'emision', 'tipos-certificado': 'emision', reconocimientos: 'reconocimientos',
  'certificados-documentos': 'emision', firmas: 'ponentes-firmantes',
  'certificados-firmas': 'emision', 'consultas-certificado': 'emision',
  'actividades-firmas': 'ponentes-firmantes',
};

@Injectable({ providedIn: 'root' })
export class EmisionCertificadosService {
  private readonly escrituraAutorizada = inject(ESCRITURA_EMISION_AUTORIZADA);
  private escrituraBloqueada(recurso: RecursoEmision): boolean {
    return !this.escrituraAutorizada && ['certificados', 'certificados-documentos', 'firmas', 'actividades-firmas'].includes(recurso);
  }
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiBaseUrl;
  private readonly personas = inject(PersonService);
  private readonly personal = inject(PersonWorkerService);
  private readonly areas = inject(AreaService);
  private readonly documentosPersona = inject(PersonDocumentService);
  private readonly tiposDocumento = inject(DocumentTypeService);

  listar<K extends RecursoEmision>(recurso: K, filtros: FiltrosEmision = {}): Observable<PaginaEmision<EntidadesEmision[K]>> {
    if (this.esListaSimple(recurso)) {
      return this.http.get<ApiResponse<readonly EntidadesEmision[K][]>>(this.ruta(recurso, 'listar'), this.opciones()).pipe(
        map(respuesta => {
          const filas = this.datos(respuesta).map(fila => this.registro(recurso, fila)).filter(fila => Object.entries(filtros).every(([campo, valor]) =>
            ['page', 'per_page'].includes(campo) || valor === null || valor === undefined || valor === '' || String(fila[campo]) === String(valor)));
          const perPage = Math.min(100, Math.max(1, Number(filtros['per_page']) || 20));
          const ultima = Math.max(1, Math.ceil(filas.length / perPage));
          const pagina = Math.min(ultima, Math.max(1, Number(filtros['page']) || 1));
          return { data: filas.slice((pagina - 1) * perPage, pagina * perPage), total: filas.length, current_page: pagina, last_page: ultima, per_page: perPage };
        }), catchError(error => this.error(error)),
      );
    }
    let params = new HttpParams();
    for (const [campo, valor] of Object.entries(filtros)) {
      if (valor !== undefined && valor !== null && valor !== '') {
        params = params.set(campo, typeof valor === 'boolean' ? Number(valor) : valor);
      }
    }
    return this.http.get<ApiResponse<PaginaEmision<EntidadesEmision[K]>>>(`${this.api}/${recurso}/list`, {
      ...this.opciones(), params,
    }).pipe(map(respuesta => this.datos(respuesta)), catchError(error => this.error(error)));
  }

  obtener<K extends RecursoEmision>(recurso: K, id: number): Observable<EntidadesEmision[K]> {
    return this.http.get<ApiResponse<EntidadesEmision[K]>>(this.ruta(recurso, 'obtener', id), this.opciones())
      .pipe(map(respuesta => this.registro(recurso, this.datos(respuesta))), catchError(error => this.error(error)));
  }

  /** Historial completo: no confundir los primeros 100 registros con todo el historial. */
  listarTodos<K extends RecursoEmision>(recurso: K, filtros: FiltrosEmision = {}): Observable<readonly EntidadesEmision[K][]> {
    if (this.esListaSimple(recurso)) {
      let params = new HttpParams();
      for (const [campo, valor] of Object.entries(filtros)) {
        if (valor !== undefined && valor !== null && valor !== '') params = params.set(campo, typeof valor === 'boolean' ? Number(valor) : valor);
      }
      return this.http.get<ApiResponse<readonly EntidadesEmision[K][]>>(this.ruta(recurso, 'listar'), { ...this.opciones(), params })
        .pipe(map(respuesta => {
          const filas = this.datos(respuesta);
          if (!Array.isArray(filas)) throw new Error('Respuesta de catálogo inválida.');
          return filas.map(fila => this.registro(recurso, fila));
        }), catchError(error => this.error(error)));
    }
    return this.listar(recurso, { ...filtros, page: 1, per_page: 100 }).pipe(
      expand(pagina => pagina.current_page < pagina.last_page
        ? this.listar(recurso, { ...filtros, page: pagina.current_page + 1, per_page: 100 }) : EMPTY),
      reduce((filas, pagina) => [...filas, ...pagina.data], [] as EntidadesEmision[K][]),
    );
  }

  trabajadores(): Observable<readonly TrabajadorEmision[]> {
    return this.personal.listar()
      .pipe(map(filas => filas.map(fila => ({
        id_persona_trabajador: fila.id_persona_trabajador, id_persona: fila.id_persona, id_area: fila.id_area,
        cargo: fila.cargo, estado: fila.estado,
      }))), catchError(error => this.error(error)));
  }

  /** Lecturas existentes de Gestion. Laravel decide el acceso; un 403 nunca se omite. */
  personaReconocimiento(id: number): Observable<PersonaReconocimiento> {
    return this.personas.obtener(id).pipe(
      map(data => ({ id_persona: data.id_persona, nombres: data.nombres,
        apellido_paterno: data.apellido_paterno, apellido_materno: data.apellido_materno })),
      catchError(error => this.error(error)),
    );
  }

  areaReconocimiento(id: number): Observable<AreaReconocimiento> {
    return this.areas.obtener(id).pipe(
      map(data => ({ id_area: data.id_area, nombre: data.nombre })), catchError(error => this.error(error)),
    );
  }

  /** DNI identificado por el catálogo real, nunca por un ID de tipo supuesto. */
  documentosIdentidad(): Observable<Readonly<Partial<Record<number, string>>>> {
    return forkJoin({
      documentos: this.documentosPersona.listar(),
      tipos: this.tiposDocumento.listar(),
    }).pipe(map(({ documentos, tipos }) => {
      const ids = new Set(tipos.filter(tipo => tipo.nombre.trim().toUpperCase() === 'DNI' || tipo.nombre.trim().toUpperCase() === 'DOCUMENTO NACIONAL DE IDENTIDAD').map(tipo => tipo.id_tipo_documento));
      const resultado: Partial<Record<number, string>> = {};
      for (const fila of documentos) {
        if (ids.has(fila.id_tipo_documento) && !resultado[fila.id_persona]) resultado[fila.id_persona] = fila.numero_documento;
      }
      return resultado;
    }), catchError(error => this.error(error)));
  }

  crear<K extends RecursoEditable>(recurso: K, payload: PayloadEmision[K]): Observable<EntidadesEmision[K]> {
    if (recurso === 'activity') return throwError(() => ({ status: 403, mensaje: 'Las actividades nuevas requieren una solicitud aprobada.', errores: {} }));
    if (this.escrituraBloqueada(recurso)) return throwError(() => ({ status: 403, mensaje: BLOQUEO_ESCRITURA_EMISION, errores: {} }));
    return this.http.post<ApiResponse<EntidadesEmision[K]>>(this.ruta(recurso, 'crear'), this.payload(recurso, payload), this.opciones())
      .pipe(map(respuesta => this.datos(respuesta)), catchError(error => this.error(error)));
  }

  actualizar<K extends RecursoEditable>(recurso: K, id: number, payload: Partial<PayloadEmision[K]>): Observable<EntidadesEmision[K]> {
    if (this.escrituraBloqueada(recurso)) return throwError(() => ({ status: 403, mensaje: BLOQUEO_ESCRITURA_EMISION, errores: {} }));
    return this.http.patch<ApiResponse<EntidadesEmision[K]>>(this.ruta(recurso, 'actualizar', id), this.payload(recurso, payload), this.opciones())
      .pipe(map(respuesta => this.datos(respuesta)), catchError(error => this.error(error)));
  }

  eliminar(recurso: RecursoEliminable, id: number): Observable<void> {
    if (this.escrituraBloqueada(recurso)) return throwError(() => ({ status: 403, mensaje: BLOQUEO_ESCRITURA_EMISION, errores: {} }));
    return this.http.delete<ApiResponse<null>>(this.ruta(recurso, 'eliminar', id), this.opciones())
      .pipe(map(respuesta => { this.datos(respuesta); }), catchError(error => this.error(error)));
  }

  relacionRegistros(ruta: 'practices/list' | 'participation' | 'person-workers/list' | 'practicing-individuals/list'):
    Observable<readonly Record<string, string | number | boolean | null>[]> {
    return this.http.get<ApiResponse<readonly Record<string, string | number | boolean | null>[]>>(`${this.api}/${ruta}`, this.opciones())
      .pipe(map(respuesta => this.datos(respuesta)), catchError(error => this.error(error)));
  }

  /** Solo lecturas de Gestión y Actividades para elegir relaciones existentes. */
  relaciones(campo: string): Observable<readonly OpcionRelacion[]> {
    const rutas: Record<string, { url: string; clave: string; texto: string }> = {
      id_persona_trabajador: { url: 'person-workers/list', clave: 'id_persona_trabajador', texto: 'cargo' },
      id_practica: { url: 'practices/list', clave: 'id_practica', texto: 'carrera' },
      id_participacion: { url: 'participation', clave: 'id_participacion', texto: 'id_persona' },
      id_actividad: { url: 'activity', clave: 'id_actividad', texto: 'nombre' },
      id_persona: { url: 'persons/list', clave: 'id_persona', texto: 'nombres' },
      id_area: { url: 'areas/list', clave: 'id_area', texto: 'nombre' },
      id_persona_ponente: { url: 'person-speakers/list', clave: 'id_persona_ponente', texto: 'cargo' },
      id_tipo_actividad: { url: 'ativicty-type', clave: 'id_tipo_actividad', texto: 'nombre' },
      id_tipo_participacion: { url: 'participation-type', clave: 'id_tipo_participacion', texto: 'nombre' },
      id_actividad_sesion: { url: 'activity-session', clave: 'id_actividad_sesion', texto: 'nombre' },
    };
    const ruta = rutas[campo];
    if (!ruta) return throwError(() => new Error('Relación no configurada.'));
    return this.http.get<ApiResponse<readonly Record<string, string | number | null>[]>>(`${this.api}/${ruta.url}`, this.opciones())
      .pipe(map(respuesta => this.datos(respuesta).map(fila => ({
        id: Number(fila[ruta.clave]), texto: `#${fila[ruta.clave]} · ${fila[ruta.texto] ?? ''}`,
      }))), catchError(error => this.error(error)));
  }

  private opciones(): { context: HttpContext } {
    return { context: new HttpContext().set(AUTHENTICATED_REQUEST, true) };
  }

  private datos<T>(respuesta: ApiResponse<T>): T {
    if (respuesta.success !== true) throw new HttpErrorResponse({ status: 502, error: { message: respuesta.message || 'Laravel no confirmó la operación.' } });
    return respuesta.data;
  }

  private esListaSimple(recurso: RecursoEmision): boolean {
    return ['activity', 'activity-session', 'activity-speaker', 'ativicty-type', 'participation', 'participation-type', 'attendance'].includes(recurso);
  }

  private ruta(recurso: RecursoEmision, accion: 'listar' | 'obtener' | 'crear' | 'actualizar' | 'eliminar', id?: number): string {
    const base = `${this.api}/${recurso}`;
    if (this.esListaSimple(recurso) && recurso !== 'attendance') return accion === 'listar' || accion === 'crear' ? base : `${base}/${id}`;
    const operacion = { listar: 'list', obtener: recurso === 'attendance' ? '' : 'detail/', crear: 'create', actualizar: 'update/', eliminar: 'delete/' }[accion];
    return `${base}/${operacion}${id ?? ''}`;
  }

  /** AttendanceController valida nombres en mayúsculas; sus lecturas usan minúsculas. */
  private payload(recurso: RecursoEditable, datos: object): object {
    return recurso === 'attendance' ? Object.fromEntries(Object.entries(datos).map(([campo, valor]) => [campo.toUpperCase(), valor])) : datos;
  }

  private registro<T extends object>(recurso: RecursoEmision, datos: T): T {
    return recurso === 'attendance' ? Object.fromEntries(Object.entries(datos).map(([campo, valor]) => [campo.toLowerCase(), valor])) as T : datos;
  }

  private error(error: unknown): Observable<never> {
    const normalizado = aErrorApi(error);
    // Los Data de Emisión usan {data: {campo: [mensajes]}} para los 422.
    if (error instanceof HttpErrorResponse && error.status === 422) {
      const data: unknown = error.error?.data;
      const errores: Record<string, readonly string[]> = { ...normalizado.errores };
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        for (const [campo, mensajes] of Object.entries(data)) {
          if (Array.isArray(mensajes) && mensajes.every(mensaje => typeof mensaje === 'string')) errores[campo] = mensajes;
        }
      }
      const validacion: ErrorApi = { ...normalizado, mensaje: 'Revisa los campos indicados.', errores };
      return throwError(() => validacion);
    }
    return throwError(() => normalizado);
  }
}
