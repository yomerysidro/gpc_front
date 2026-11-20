import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, distinctUntilChanged, map, of, startWith, switchMap, tap } from 'rxjs';
import { EmisionCertificadosService } from '../../../core/services/emision-certificados/emision-certificados.service';
import { aErrorApi } from '../../../shared/utils/error-api';
import { ErrorApi } from '../../../core/interfaces/api/api-response.interface';
import { RecursoEmision } from '../../../core/interfaces/emision-certificados/emision-certificados.interface';
import { PageTitleComponent } from '../../../shared/components/page-title/page-title.component';
import { EstadoNavegacionListado, ListadoEmisionComponent } from '../compartidos/listado-emision.component';
import { FILTROS_SESIONES_VACIOS } from './sesiones-asistencia-listado';

interface PestanaActividad {
  readonly id: string;
  readonly etiqueta: string;
  readonly recurso: RecursoEmision;
}
interface ConfiguracionActividades {
  readonly titulo: string;
  readonly secciones: readonly { titulo: string; recurso: RecursoEmision }[];
  readonly pestanas?: readonly PestanaActividad[];
}

/** Conserva los CRUD existentes; solo Sesiones/asistencia configura navegación por pestañas. */
@Component({
  selector: 'app-actividades', standalone: true, imports: [RouterLink, PageTitleComponent, ListadoEmisionComponent],
  templateUrl: './actividades.component.html',
  styleUrls: ['../compartidos/emision.scss', '../../../shared/components/gestion-tabs/gestion-tabs.component.scss'],
})
export class ActividadesComponent {
  private readonly api = inject(EmisionCertificadosService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly listado = viewChild(ListadoEmisionComponent);
  protected readonly estados = new Map<RecursoEmision, EstadoNavegacionListado>();
  private actividadContexto: string | null = null;
  private teniaSeleccion = false;
  protected readonly revisionNavegacion = signal(0);
  protected readonly contexto = toSignal(this.route.queryParamMap.pipe(
    map(params => params.get('id_actividad') ?? params.get('actividad')), distinctUntilChanged(),
    switchMap(valor => {
      if (valor === null) return of({ cargando: false, error: null, actividad: null });
      if (!/^[1-9]\d*$/.test(valor) || !Number.isSafeInteger(Number(valor))) return of({ cargando: false, error: 'El identificador de actividad no es válido.', actividad: null });
      return this.api.obtener('activity', Number(valor)).pipe(map(fila => {
        if (Number(fila['id_actividad']) !== Number(valor) || typeof fila['nombre'] !== 'string' || !fila['nombre'].trim()) throw new Error('Laravel no confirmó la actividad solicitada.');
        return { cargando: false, error: null, actividad: { id_actividad: Number(fila['id_actividad']), nombre: fila['nombre'], fecha_inicio: typeof fila['fecha_inicio'] === 'string' ? fila['fecha_inicio'] : null } };
      }), catchError((error: ErrorApi) => of({ cargando: false, error: error?.mensaje || aErrorApi(error).mensaje, actividad: null })),
        startWith({ cargando: true, error: null, actividad: null }));
    }),
  ), { initialValue: { cargando: false, error: null, actividad: null } });
  protected readonly configuracion = toSignal(this.route.data.pipe(map(data => data as ConfiguracionActividades)), { requireSync: true });
  private readonly parametros = toSignal(this.route.queryParamMap.pipe(
    tap(parametros => {
      const tieneSeleccion = ['id_actividad', 'actividad', 'actividad_filtro', 'id_sesion', 'sesion_filtro'].some(clave => parametros.has(clave));
      const limpiar = this.teniaSeleccion && !tieneSeleccion && !!this.listado()?.obtenerEstadoNavegacion().filtrosSesiones?.actividad;
      this.teniaSeleccion = tieneSeleccion;
      if (limpiar) {
        this.estados.clear();
        this.revisionNavegacion.update(revision => revision + 1);
      }
      const contexto = parametros.get('id_actividad') ?? parametros.get('actividad');
      if (this.actividadContexto !== contexto) {
        this.actividadContexto = contexto; this.estados.clear(); return;
      }
      if (limpiar) return;
      const opciones = this.configuracion().pestanas;
      const destino = opciones?.find(opcion => opcion.id === parametros.get('pestana')) ?? opciones?.[0];
      const actual = this.listado();
      if (destino && actual && destino.recurso !== actual.recurso()) {
        const estado = actual.obtenerEstadoNavegacion();
        this.estados.set(actual.recurso(), estado);
        if (contexto === null) {
          const previo = this.estados.get(destino.recurso);
          const actividad = estado.filtrosSesiones?.actividad ?? '';
          this.estados.set(destino.recurso, { campo: previo?.campo ?? '', valor: previo?.valor ?? '', pagina: previo?.pagina ?? 1,
            filtrosSesiones: { ...(previo?.filtrosSesiones ?? FILTROS_SESIONES_VACIOS), actividad,
              sesion: previo?.filtrosSesiones?.actividad === actividad ? previo.filtrosSesiones.sesion : '' } });
        }
      }
    }),
  ), { initialValue: this.route.snapshot.queryParamMap });
  protected readonly pestana = computed(() => this.configuracion().pestanas?.find(opcion => opcion.id === this.parametros().get('pestana'))
    ?? this.configuracion().pestanas?.[0]);
  private readonly estadoActividad = computed<EstadoNavegacionListado | null>(() => {
    const id = Number(this.parametros().get('id_actividad') ?? this.parametros().get('actividad') ?? this.parametros().get('actividad_filtro'));
    return Number.isSafeInteger(id) && id > 0 ? { campo: '', valor: '', pagina: 1,
      filtrosSesiones: { ...FILTROS_SESIONES_VACIOS, actividad: String(id), sesion: this.parametros().get('id_sesion') ?? this.parametros().get('sesion_filtro') ?? '' } } : null;
  });
  protected estadoInicial(recurso: RecursoEmision): EstadoNavegacionListado | null {
    const actual = this.listado();
    if (actual?.inicializado && actual.recurso() === recurso) {
      return actual.estadoInicial();
    }
    const previo = this.estados.get(recurso);
    if (previo && previo.filtrosSesiones?.actividad === this.estadoActividad()?.filtrosSesiones?.actividad) return previo;
    if (recurso === 'attendance' && this.parametros().get('id_sesion')) return this.estadoActividad();
    const inicial = this.estadoActividad();
    return recurso === 'activity-session' && inicial?.filtrosSesiones
      ? { ...inicial, filtrosSesiones: { ...inicial.filtrosSesiones, sesion: '' } }
      : previo ?? inicial;
  }

  protected seleccionar(id: string): void {
    const opciones = this.configuracion().pestanas;
    if (!opciones?.some(opcion => opcion.id === id) || this.pestana()?.id === id) return;
    void this.router.navigate([], {
      relativeTo: this.route, queryParams: { pestana: id === opciones[0].id ? null : id },
      queryParamsHandling: 'merge', replaceUrl: true,
    });
  }

  protected alTeclear(evento: KeyboardEvent): void {
    const opciones = this.configuracion().pestanas;
    if (!opciones?.length || !(evento.currentTarget instanceof HTMLElement)) return;
    const actual = opciones.findIndex(opcion => opcion.id === this.pestana()?.id);
    const destino = {
      ArrowRight: (actual + 1) % opciones.length, ArrowLeft: (actual - 1 + opciones.length) % opciones.length,
      Home: 0, End: opciones.length - 1,
    }[evento.key];
    if (destino === undefined) return;
    evento.preventDefault();
    this.seleccionar(opciones[destino].id);
    evento.currentTarget.querySelector<HTMLElement>('#actividad-tab-' + opciones[destino].id)?.focus();
  }

  protected etiquetaPanel(recurso: RecursoEmision): string | null {
    const opcion = this.configuracion().pestanas?.find(opcion => opcion.recurso === recurso);
    return opcion ? 'actividad-tab-' + opcion.id : null;
  }
}
