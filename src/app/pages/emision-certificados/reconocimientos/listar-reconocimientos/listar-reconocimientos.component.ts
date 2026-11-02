import { afterNextRender, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { catchError, concatMap, defer, forkJoin, from, map, mergeMap, Observable, of, shareReplay, Subscription, switchMap, tap, toArray } from 'rxjs';
import { ErrorApi } from '../../../../core/interfaces/api/api-response.interface';
import { AreaReconocimiento, CertificadoDocumento, PaginaEmision, PersonaReconocimiento, Reconocimiento, TrabajadorEmision } from '../../../../core/interfaces/emision-certificados/emision-certificados.interface';
import { AuthService } from '../../../../core/services/autenticacion/auth.service';
import { EmisionCertificadosService } from '../../../../core/services/emision-certificados/emision-certificados.service';
import { PageTitleComponent } from '../../../../shared/components/page-title/page-title.component';
import { ReconocimientoCardComponent } from '../components/reconocimiento-card/reconocimiento-card.component';
import { CertificadoReconocimientoVista, RelacionReconocimiento } from '../reconocimiento-vista.interface';

@Component({
  selector: 'app-listar-reconocimientos', standalone: true,
  imports: [RouterLink, ReactiveFormsModule, PageTitleComponent, ReconocimientoCardComponent],
  templateUrl: './listar-reconocimientos.component.html',
  styleUrls: ['../../compartidos/emision.scss', './listar-reconocimientos.component.scss'],
})
export class ListarReconocimientosComponent {
  private readonly api = inject(EmisionCertificadosService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly auth = inject(AuthService);
  private carga?: Subscription;
  private trabajadoresCache?: Observable<RelacionReconocimiento<readonly TrabajadorEmision[]>>;
  private readonly personasCache = new Map<number, Observable<RelacionReconocimiento<PersonaReconocimiento>>>();
  private readonly areasCache = new Map<number, Observable<RelacionReconocimiento<AreaReconocimiento>>>();
  private readonly documentosCache = new Map<number, Observable<RelacionReconocimiento<readonly CertificadoDocumento[]>>>();
  private personaDenegada: RelacionReconocimiento<PersonaReconocimiento> | null = null;
  private areaDenegada: RelacionReconocimiento<AreaReconocimiento> | null = null;
  protected readonly pagina = signal<PaginaEmision<Reconocimiento> | null>(null);
  protected readonly trabajadores = signal<readonly TrabajadorEmision[]>([]);
  protected readonly estadoTrabajadores = signal<RelacionReconocimiento<readonly TrabajadorEmision[]>>({ estado: 'cargando' });
  protected readonly personas = signal<Readonly<Partial<Record<number, RelacionReconocimiento<PersonaReconocimiento>>>>>({});
  protected readonly areas = signal<Readonly<Partial<Record<number, RelacionReconocimiento<AreaReconocimiento>>>>>({});
  protected readonly certificaciones = signal<Readonly<Partial<Record<number, RelacionReconocimiento<readonly CertificadoReconocimientoVista[]>>>>>({});
  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly dni = signal<Readonly<Partial<Record<number, string>>>>({});
  protected readonly errorDni = signal<string | null>(null);
  protected readonly sinPermiso = signal(false);
  protected readonly trabajadoresPorId = computed(() => new Map(this.trabajadores().map(fila => [fila.id_persona_trabajador, fila])));
  protected readonly filtro = inject(NonNullableFormBuilder).group({ titulo: '', trabajador: '', estado: '', fecha: '', buscarTrabajador: '' });

  constructor() { afterNextRender(() => this.cargar()); }

  protected opcionesTrabajador(): readonly TrabajadorEmision[] {
    const texto = this.filtro.controls.buscarTrabajador.value.trim().toLocaleLowerCase();
    const seleccionado = this.filtro.controls.trabajador.value;
    return this.trabajadores().filter(fila => String(fila.id_persona_trabajador) === seleccionado || `${fila.id_persona_trabajador} ${fila.cargo}`.toLocaleLowerCase().includes(texto));
  }

  protected trabajador(id: number): string {
    const fila = this.trabajadoresPorId().get(id);
    return fila ? `Trabajador #${id} · ${fila.cargo}` : `Trabajador #${id}`;
  }

  protected trabajadorRelacion(registro: Reconocimiento): RelacionReconocimiento<TrabajadorEmision> {
    const estado = this.estadoTrabajadores();
    if (estado.estado !== 'disponible') return estado;
    const fila = this.trabajadoresPorId().get(registro.id_persona_trabajador);
    return fila ? { estado: 'disponible', datos: fila } : { estado: 'no-encontrado', mensaje: 'El trabajador no figura en el catálogo autorizado.' };
  }

  protected personaRelacion(registro: Reconocimiento): RelacionReconocimiento<PersonaReconocimiento> {
    const trabajador = this.trabajadorRelacion(registro);
    if (trabajador.estado !== 'disponible') return trabajador;
    return this.personas()[trabajador.datos.id_persona] ?? { estado: 'cargando' };
  }

  protected areaRelacion(registro: Reconocimiento): RelacionReconocimiento<AreaReconocimiento> {
    const trabajador = this.trabajadorRelacion(registro);
    if (trabajador.estado !== 'disponible') return trabajador;
    return this.areas()[trabajador.datos.id_area] ?? { estado: 'cargando' };
  }

  protected certificacionRelacion(id: number): RelacionReconocimiento<readonly CertificadoReconocimientoVista[]> {
    return this.certificaciones()[id] ?? (this.auth.tienePermiso('emision.ver')
      ? { estado: 'cargando' } : { estado: 'sin-permiso', mensaje: 'Se requiere emision.ver.' });
  }

  protected cargar(page = 1): void {
    this.carga?.unsubscribe();
    this.pagina.set(null); this.error.set(null); this.certificaciones.set({}); this.personas.set({}); this.areas.set({});
    this.documentosCache.clear();
    this.sinPermiso.set(!this.auth.tienePermiso('reconocimientos.ver'));
    if (this.sinPermiso()) { this.cargando.set(false); return; }
    this.cargando.set(true);
    this.errorDni.set(null); this.dni.set({});
    const filtros = this.filtro.getRawValue();
    this.carga = this.api.listar('reconocimientos', {
      page, per_page: 12, titulo: filtros.titulo.trim(), estado: filtros.estado.trim(),
      fecha_reconocimiento: filtros.fecha, id_persona_trabajador: filtros.trabajador || null,
    }).pipe(
      tap(pagina => this.pagina.set(pagina)),
      switchMap(pagina => forkJoin({
        dni: this.auth.tienePermiso('ponentes-firmantes.ver') ? this.api.documentosIdentidad().pipe(tap(dni => this.dni.set(dni)), catchError((error: ErrorApi) => { this.errorDni.set(error.mensaje); return of(null); })) : of(null),
        gestion: this.cargarGestion(pagina.data),
        certificados: this.auth.tienePermiso('emision.ver') ? from(pagina.data).pipe(
          mergeMap(registro => this.cargarCertificacion(registro.id_reconocimiento).pipe(
            tap(resultado => this.certificaciones.update(actual => ({ ...actual, [registro.id_reconocimiento]: resultado }))),
          ), 3), toArray(),
        ) : of([]),
      })),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => this.cargando.set(false),
      error: (error: ErrorApi) => { this.sinPermiso.set(error.status === 403); this.error.set(error.mensaje); this.cargando.set(false); },
    });
  }

  private cargarGestion(registros: readonly Reconocimiento[]): Observable<unknown> {
    if (!this.trabajadoresCache) {
      this.trabajadoresCache = this.auth.tienePermiso('ponentes-firmantes.ver')
        ? this.resultado(this.api.trabajadores()).pipe(shareReplay({ bufferSize: 1, refCount: true }))
        : of({ estado: 'sin-permiso', mensaje: 'Se requiere el permiso ponentes-firmantes.ver para consultar trabajadores.' });
    }
    return this.trabajadoresCache.pipe(
      tap(resultado => {
        this.estadoTrabajadores.set(resultado);
        this.trabajadores.set(resultado.estado === 'disponible' ? resultado.datos : []);
      }),
      switchMap(resultado => {
        if (resultado.estado !== 'disponible') return of(null);
        const ids = new Set(registros.map(fila => fila.id_persona_trabajador));
        const trabajadores = resultado.datos.filter(fila => ids.has(fila.id_persona_trabajador));
        const personas = [...new Set(trabajadores.map(fila => fila.id_persona))];
        const areas = [...new Set(trabajadores.map(fila => fila.id_area))];
        return forkJoin({
          personas: from(personas).pipe(concatMap(id => this.referencia(id, this.personasCache, () => this.api.personaReconocimiento(id),
            () => this.personaDenegada, rechazo => { this.personaDenegada = rechazo; }).pipe(
            tap(fila => this.personas.update(actual => ({ ...actual, [id]: fila }))),
          )), toArray()),
          areas: from(areas).pipe(concatMap(id => this.referencia(id, this.areasCache, () => this.api.areaReconocimiento(id),
            () => this.areaDenegada, rechazo => { this.areaDenegada = rechazo; }).pipe(
            tap(fila => this.areas.update(actual => ({ ...actual, [id]: fila }))),
          )), toArray()),
        });
      }),
    );
  }

  /** Cache limitada a esta pagina. Tras un 403 no insiste con otros IDs del mismo recurso. */
  private referencia<T>(id: number, cache: Map<number, Observable<RelacionReconocimiento<T>>>, consulta: () => Observable<T>,
    denegado: () => RelacionReconocimiento<T> | null, denegar: (rechazo: RelacionReconocimiento<T>) => void): Observable<RelacionReconocimiento<T>> {
    const existente = cache.get(id);
    if (existente) return existente;
    const peticion = defer(() => {
      if (!Number.isSafeInteger(id) || id < 1) return of<RelacionReconocimiento<T>>({ estado: 'no-encontrado', mensaje: 'No hay una relación válida disponible.' });
      const rechazo = denegado();
      return rechazo ? of(rechazo) : this.resultado(consulta()).pipe(tap(resultado => { if (resultado.estado === 'sin-permiso') denegar(resultado); }));
    }).pipe(shareReplay({ bufferSize: 1, refCount: true }));
    cache.set(id, peticion);
    return peticion;
  }

  private cargarCertificacion(id: number): Observable<RelacionReconocimiento<readonly CertificadoReconocimientoVista[]>> {
    return this.resultado(this.api.listarTodos('certificados', { id_reconocimiento: id }).pipe(
      switchMap(certificados => from(certificados).pipe(
        mergeMap(certificado => {
          let documentos = this.documentosCache.get(certificado.id_certificado);
          if (!documentos) {
            documentos = this.resultado(this.api.listarTodos('certificados-documentos', { id_certificado: certificado.id_certificado }))
              .pipe(shareReplay({ bufferSize: 1, refCount: true }));
            this.documentosCache.set(certificado.id_certificado, documentos);
          }
          return documentos.pipe(map(filas => ({ certificado, documentos: filas })));
        }, 3), toArray(), map(filas => filas.sort((a, b) => b.certificado.id_certificado - a.certificado.id_certificado)),
      )),
    ));
  }

  private resultado<T>(peticion: Observable<T>): Observable<RelacionReconocimiento<T>> {
    return peticion.pipe(map(datos => ({ estado: 'disponible', datos }) as RelacionReconocimiento<T>),
      catchError((error: ErrorApi) => of<RelacionReconocimiento<T>>({
        estado: error.status === 403 || error.status === 401 ? 'sin-permiso' : error.status === 404 ? 'no-encontrado' : 'error', mensaje: error.mensaje,
      })),
    );
  }

  protected reintentar(): void {
    this.carga?.unsubscribe(); this.trabajadoresCache = undefined; this.personasCache.clear(); this.areasCache.clear();
    this.personaDenegada = null; this.areaDenegada = null;
    this.estadoTrabajadores.set({ estado: 'cargando' }); this.trabajadores.set([]);
    this.cargar(this.pagina()?.current_page ?? 1);
  }
  protected limpiar(): void { this.filtro.reset(); this.cargar(); }
}
