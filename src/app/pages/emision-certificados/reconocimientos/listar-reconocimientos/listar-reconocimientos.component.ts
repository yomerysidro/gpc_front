import { afterNextRender, Component, computed, DestroyRef, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, concatMap, defer, forkJoin, from, map, mergeMap, Observable, of, shareReplay, Subscription, switchMap, tap, throwError, toArray } from 'rxjs';
import { ErrorApi } from '../../../../core/interfaces/api/api-response.interface';
import { AreaReconocimiento, CertificadoDocumento, PaginaEmision, PersonaReconocimiento, Reconocimiento, TrabajadorEmision } from '../../../../core/interfaces/emision-certificados/emision-certificados.interface';
import { AuthService } from '../../../../core/services/autenticacion/auth.service';
import { EmisionCertificadosService } from '../../../../core/services/emision-certificados/emision-certificados.service';
import { PageTitleComponent } from '../../../../shared/components/page-title/page-title.component';
import { ReconocimientoCardComponent } from '../components/reconocimiento-card/reconocimiento-card.component';
import { CertificadoReconocimientoVista, RelacionReconocimiento } from '../reconocimiento-vista.interface';

import { DialogoComponent } from '../../../../shared/components/dialogo/dialogo.component';
import { FormularioEmisionComponent } from '../../compartidos/formulario-emision.component';

@Component({
  selector: 'app-listar-reconocimientos', standalone: true,
  imports: [RouterLink, ReactiveFormsModule, PageTitleComponent, ReconocimientoCardComponent, DialogoComponent, FormularioEmisionComponent],
  templateUrl: './listar-reconocimientos.component.html',
  styleUrls: ['../../compartidos/emision.scss', './listar-reconocimientos.component.scss'],
})
export class ListarReconocimientosComponent {
  protected readonly registroAbierto = signal(false);
  protected readonly modalRegistro = viewChild.required<DialogoComponent>('modalRegistro');
  protected readonly editorRegistro = viewChild<FormularioEmisionComponent>('editorRegistro');

  protected abrirRegistro(): void {
    this.registroAbierto.set(true);
    this.modalRegistro().abrir();
  }

  protected cerrarRegistro(): void {
    if (!this.editorRegistro()?.enviando()) this.modalRegistro().cerrar();
  }

  protected registroGuardado(): void {
    this.modalRegistro().cerrar();
    this.mensaje.set('Reconocimiento registrado correctamente.');
    this.cargarEstados();
    this.cargar();
  }

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

  protected readonly estados = signal<readonly string[]>([]);
  protected readonly mensaje = signal<string | null>(inject(Router).getCurrentNavigation()?.extras.state?.['mensaje'] ?? null);
  protected readonly eliminando = signal(false);
  protected readonly pendienteEliminar = signal<Reconocimiento | null>(null);

  constructor() { afterNextRender(() => { this.cargarEstados(); this.cargar(); }); }

  private cargarEstados(): void {
    if (!this.auth.tienePermiso('reconocimientos.ver')) return;
    this.api.listarTodos('reconocimientos').pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: filas => this.estados.set([...new Set(filas.map(fila => fila.estado).filter(Boolean))].sort()),
      error: (error: ErrorApi) => this.mensaje.set('No se pudieron consultar los estados: ' + error.mensaje),
    });
  }

  protected solicitarEliminar(registro: Reconocimiento): void {
    if (this.auth.tienePermiso('reconocimientos.eliminar') && !this.eliminando()) this.pendienteEliminar.set(registro);
  }

  protected eliminar(): void {
    const registro = this.pendienteEliminar();
    if (!registro || this.eliminando() || !this.auth.tienePermiso('reconocimientos.eliminar')) return;
    this.eliminando.set(true); this.mensaje.set(null);
    this.api.eliminar('reconocimientos', registro.id_reconocimiento).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.eliminando.set(false); this.pendienteEliminar.set(null); this.mensaje.set('Reconocimiento eliminado correctamente.');
        const pagina = this.pagina();
        this.cargar(pagina?.data.length === 1 ? Math.max(1, pagina.current_page - 1) : pagina?.current_page ?? 1);
        this.cargarEstados();
      },
      error: (error: ErrorApi) => { this.eliminando.set(false); this.mensaje.set(error.mensaje); },
    });
  }

  protected opcionesTrabajador(): readonly TrabajadorEmision[] {
    const texto = this.filtro.controls.buscarTrabajador.value.trim().toLocaleLowerCase();
    const seleccionado = this.filtro.controls.trabajador.value;
    return this.trabajadores().filter(fila => String(fila.id_persona_trabajador) === seleccionado || this.trabajador(fila.id_persona_trabajador).toLocaleLowerCase().includes(texto));
  }

  protected trabajador(id: number): string {
    const fila = this.trabajadoresPorId().get(id);
    if (!fila) return `Trabajador #${id}`;
    const persona = this.personas()[fila.id_persona];
    const area = this.areas()[fila.id_area];
    const nombre = persona?.estado === 'disponible'
      ? [persona.datos.nombres, persona.datos.apellido_paterno, persona.datos.apellido_materno].filter(Boolean).join(' ') : 'Nombre no disponible';
    return `${nombre} — ${fila.cargo || 'Cargo no registrado'} — ${area?.estado === 'disponible' ? area.datos.nombre : 'Área no disponible'} — #${id}`;
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
        dni: pagina.data.length && this.auth.tienePermiso('ponentes-firmantes.ver') && this.auth.tienePermiso('personas.verpersonas') && this.auth.tienePermiso('tipos-documento.ver') ? this.api.documentosIdentidad().pipe(tap(dni => this.dni.set(dni)), catchError((error: ErrorApi) => { this.errorDni.set(error.mensaje); return of(null); })) : of(null),
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
        const trabajadores = resultado.datos;
        const personas = [...new Set(trabajadores.map(fila => fila.id_persona))];
        const areas = [...new Set(trabajadores.map(fila => fila.id_area))];
        return forkJoin({
          personas: from(personas).pipe(concatMap(id => this.referencia(id, this.personasCache, () => this.auth.tienePermiso('personas.verpersonas') ? this.api.personaReconocimiento(id) : this.denegado('personas.verpersonas'),
            () => this.personaDenegada, rechazo => { this.personaDenegada = rechazo; }).pipe(
            tap(fila => this.personas.update(actual => ({ ...actual, [id]: fila }))),
          )), toArray()),
          areas: from(areas).pipe(concatMap(id => this.referencia(id, this.areasCache, () => this.auth.tienePermiso('areas.ver') ? this.api.areaReconocimiento(id) : this.denegado('areas.ver'),
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

  private denegado(permiso: string): Observable<never> {
    return throwError(() => ({ status: 403, mensaje: `Se requiere ${permiso}.`, errores: {} }));
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
    this.cargarEstados(); this.cargar(this.pagina()?.current_page ?? 1);
  }
  protected limpiar(): void { this.filtro.reset(); this.cargar(); }
}
