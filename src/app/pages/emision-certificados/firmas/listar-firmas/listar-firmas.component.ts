import { afterNextRender, Component, computed, DestroyRef, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AsignarFirmantesComponent } from '../asignar-firmantes/asignar-firmantes.component';
import { catchError, concatMap, defer, forkJoin, from, map, Observable, of, shareReplay, Subscription, switchMap, tap, toArray } from 'rxjs';
import { ErrorApi } from '../../../../core/interfaces/api/api-response.interface';
import { Firma, TrabajadorEmision } from '../../../../core/interfaces/emision-certificados/emision-certificados.interface';
import { AuthService } from '../../../../core/services/autenticacion/auth.service';
import { EmisionCertificadosService } from '../../../../core/services/emision-certificados/emision-certificados.service';
import { DialogoComponent } from '../../../../shared/components/dialogo/dialogo.component';
import { DialogoConfirmacionComponent } from '../../../../shared/components/dialogo-confirmacion/dialogo-confirmacion.component';
import { PageTitleComponent } from '../../../../shared/components/page-title/page-title.component';
import { DatoFirmante, FirmanteVistaMunicipal } from '../firmante-vista.interface';
import { FirmanteCardComponent } from '../firmante-card/firmante-card.component';
import { FormularioFirmanteComponent } from '../formulario-firmante/formulario-firmante.component';
import { ESCRITURA_EMISION_AUTORIZADA } from '../../../../core/services/emision-certificados/operaciones-emision';

@Component({
  selector: 'app-listar-firmas', standalone: true,
  imports: [RouterLink, ReactiveFormsModule, PageTitleComponent, FirmanteCardComponent, FormularioFirmanteComponent, DialogoComponent, DialogoConfirmacionComponent, AsignarFirmantesComponent],
  templateUrl: './listar-firmas.component.html',
  styleUrls: ['../../compartidos/emision.scss', './listar-firmas.component.scss', './modal-firmante.scss'],
})
export class ListarFirmasComponent {
  protected readonly escrituraAutorizada = inject(ESCRITURA_EMISION_AUTORIZADA);
  private readonly api = inject(EmisionCertificadosService);
  protected readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogo = viewChild.required<DialogoComponent>('credencial');
  protected readonly detalleDialogo = viewChild.required<DialogoComponent>('detalleCredencial');
  private readonly formularioFirmante = viewChild(FormularioFirmanteComponent);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly parametros = toSignal(this.route.queryParamMap, { requireSync: true });
  protected readonly pestana = computed(() => this.parametros().get('pestana') === 'asignaciones' ? 'asignaciones' : 'firmantes');
  protected readonly detalle = signal<FirmanteVistaMunicipal | null>(null);
  private readonly confirmacion = viewChild.required(DialogoConfirmacionComponent);
  private carga?: Subscription;
  private readonly cache = new Map<string, Observable<DatoFirmante<string>>>();
  private readonly denegados = new Set<string>();
  protected readonly filas = signal<readonly Firma[]>([]);
  protected readonly trabajadores = signal<readonly TrabajadorEmision[]>([]);
  protected readonly nombres = signal<Readonly<Partial<Record<number, DatoFirmante<string>>>>>({});
  protected readonly areas = signal<Readonly<Partial<Record<number, DatoFirmante<string>>>>>({});
  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly errorGestion = signal<string | null>(null);
  protected readonly dni = signal<Readonly<Partial<Record<number, string>>>>({});
  protected readonly errorDni = signal<string | null>(null);
  protected readonly aviso = signal<string | null>(null);
  protected readonly errorOperacion = signal<string | null>(null);
  protected readonly eliminando = signal<number | null>(null);
  protected readonly formularioActivo = signal(false);
  protected readonly editar = signal<Firma | null>(null);
  protected readonly pagina = signal(1);
  protected readonly busqueda = new FormControl('', { nonNullable: true });
  protected readonly filtroEstado = new FormControl('', { nonNullable: true });
  private readonly texto = toSignal(this.busqueda.valueChanges, { initialValue: '' });
  private readonly estado = toSignal(this.filtroEstado.valueChanges, { initialValue: '' });
  protected readonly firmantes = computed<readonly FirmanteVistaMunicipal[]>(() => {
    const trabajadores = new Map(this.trabajadores().map(fila => [fila.id_persona_trabajador, fila]));
    return this.filas().map(firma => {
      const trabajador = trabajadores.get(firma.id_persona_trabajador) ?? null;
      const pendiente = { estado: 'cargando', mensaje: 'Consultando Gestión…' } as const;
      const sinTrabajador = { estado: 'error', mensaje: this.errorGestion() || 'Trabajador no encontrado en el catálogo autorizado.' } as const;
      return { firma, trabajador,
        nombre: trabajador ? this.nombres()[trabajador.id_persona] ?? pendiente : sinTrabajador,
        area: trabajador ? this.areas()[trabajador.id_area] ?? pendiente : sinTrabajador,
      };
    });
  });
  protected readonly filtrados = computed(() => {
    const texto = this.normalizar(this.texto()); const estado = this.estado();
    return this.firmantes().filter(fila => {
      const nombre = fila.nombre.estado === 'disponible' ? fila.nombre.datos : '';
      const area = fila.area.estado === 'disponible' ? fila.area.datos : '';
      return (!estado || (fila.trabajador !== null && Boolean(fila.trabajador.estado) === (estado === 'activo')))
        && (!texto || this.normalizar(`${nombre} ${area} ${fila.trabajador?.cargo ?? ''} ${fila.trabajador ? this.dni()[fila.trabajador.id_persona] ?? '' : ''}`).includes(texto));
    });
  });
  protected readonly totalPaginas = computed(() => Math.max(1, Math.ceil(this.filtrados().length / 9)));
  protected readonly visibles = computed(() => this.filtrados().slice((this.pagina() - 1) * 9, this.pagina() * 9));
  protected readonly totalTrabajadores = computed(() => new Set(this.filas().map(fila => fila.id_persona_trabajador)).size);
  protected readonly nombresFormulario = computed(() => Object.fromEntries(Object.entries(this.nombres()).flatMap(([id, nombre]) => nombre?.estado === 'disponible' ? [[Number(id), nombre.datos]] : [])));

  constructor() {
    afterNextRender(() => this.cargar());
    this.busqueda.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.pagina.set(1));
    this.filtroEstado.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.pagina.set(1));
  }

  protected cargar(): void {
    this.carga?.unsubscribe(); this.cache.clear(); this.denegados.clear();
    this.filas.set([]); this.trabajadores.set([]); this.nombres.set({}); this.areas.set({}); this.pagina.set(1);
    this.error.set(null); this.errorGestion.set(null); this.dni.set({}); this.errorDni.set(null);
    if (!this.auth.tienePermiso('ponentes-firmantes.ver')) { this.error.set('No tienes permiso para consultar los firmantes municipales.'); return; }
    this.cargando.set(true);
    this.carga = forkJoin({
      firmas: this.api.listarTodos('firmas'),
      dni: this.api.documentosIdentidad().pipe(catchError((error: ErrorApi) => { this.errorDni.set(error.mensaje); return of({} as Readonly<Partial<Record<number, string>>>); })),
      trabajadores: this.api.trabajadores().pipe(catchError((error: ErrorApi) => { this.errorGestion.set(error.mensaje); return of([] as readonly TrabajadorEmision[]); })),
    }).pipe(
      tap(({ firmas, trabajadores, dni }) => {
        this.dni.set(dni);
        // Conserva solo metadatos permitidos: nunca propaga referencias privadas o contraseñas.
        this.filas.set(firmas.map(fila => ({ id_firma: fila.id_firma, id_persona_trabajador: fila.id_persona_trabajador, fecha_firma: fila.fecha_firma })));
        this.trabajadores.set(trabajadores);
      }),
      switchMap(({ firmas, trabajadores }) => {
        const vinculados = trabajadores;
        return forkJoin({
          nombres: from([...new Set(vinculados.map(fila => fila.id_persona))]).pipe(concatMap(id => this.relacion('persona', id).pipe(tap(valor => this.nombres.update(actual => ({ ...actual, [id]: valor }))))), toArray()),
          areas: from([...new Set(vinculados.map(fila => fila.id_area))]).pipe(concatMap(id => this.relacion('area', id).pipe(tap(valor => this.areas.update(actual => ({ ...actual, [id]: valor }))))), toArray()),
        });
      }), takeUntilDestroyed(this.destroyRef),
    ).subscribe({ next: () => this.cargando.set(false), error: (error: ErrorApi) => { this.error.set(error.mensaje); this.cargando.set(false); } });
  }

  private relacion(tipo: 'persona' | 'area', id: number): Observable<DatoFirmante<string>> {
    const clave = `${tipo}:${id}`;
    const existente = this.cache.get(clave); if (existente) return existente;
    const peticion = defer((): Observable<DatoFirmante<string>> => {
      const campo = tipo === 'persona' ? 'Nombre' : 'Área';
      const restriccion = tipo === 'persona' ? 'Nombre restringido por Gestión.' : 'Área restringida por Gestión.';
      if (!Number.isSafeInteger(id) || id < 1) return of({ estado: 'no-encontrado', mensaje: `${campo} no disponible.` });
      if (this.denegados.has(tipo)) return of({ estado: 'restringido', mensaje: restriccion });
      const consulta = tipo === 'persona' ? this.api.personaReconocimiento(id).pipe(map(persona => [persona.nombres, persona.apellido_paterno, persona.apellido_materno].filter(Boolean).join(' ').trim()))
        : this.api.areaReconocimiento(id).pipe(map(area => area.nombre));
      return consulta.pipe(map(datos => datos ? { estado: 'disponible', datos } as DatoFirmante<string> : { estado: 'no-encontrado', mensaje: `${campo} no informado.` } as DatoFirmante<string>),
        catchError((error: ErrorApi) => {
          if (error.status === 403 || error.status === 401) this.denegados.add(tipo);
          return of<DatoFirmante<string>>({ estado: error.status === 403 || error.status === 401 ? 'restringido' : error.status === 404 ? 'no-encontrado' : 'error',
            mensaje: error.status === 403 ? restriccion : `No se pudo consultar ${campo.toLocaleLowerCase()}.` });
        }));
    }).pipe(shareReplay({ bufferSize: 1, refCount: true }));
    this.cache.set(clave, peticion); return peticion;
  }

  protected abrirFormulario(firma: Firma | null = null): void {
    if (!this.auth.tienePermiso(`ponentes-firmantes.${firma ? 'editar' : 'crear'}`)) return;
    this.editar.set(firma); this.formularioActivo.set(true); this.dialogo().abrir();
  }
  protected cerrarFormulario(): void { this.formularioFirmante()?.limpiar(); this.formularioActivo.set(false); this.editar.set(null); this.dialogo().cerrar(); }
  protected consultar(firmante: FirmanteVistaMunicipal): void { this.detalle.set(firmante); this.detalleDialogo().abrir(); }
  protected seleccionarPestana(pestana: 'firmantes' | 'asignaciones'): void {
    void this.router.navigate([], { relativeTo: this.route, queryParams: { pestana: pestana === 'firmantes' ? null : pestana }, queryParamsHandling: 'merge', replaceUrl: true });
  }
  protected teclaPestana(evento: KeyboardEvent): void {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(evento.key) || !(evento.currentTarget instanceof HTMLElement)) return;
    evento.preventDefault(); const destino = evento.key === 'Home' ? 'firmantes' : evento.key === 'End' ? 'asignaciones' : this.pestana() === 'firmantes' ? 'asignaciones' : 'firmantes';
    this.seleccionarPestana(destino); evento.currentTarget.querySelector<HTMLElement>('#firmas-tab-' + destino)?.focus();
  }
  protected alGuardar(): void { this.cerrarFormulario(); this.aviso.set('La credencial del firmante se guardó correctamente.'); this.cargar(); }
  protected async eliminar(firma: Firma): Promise<void> {
    if (!this.escrituraAutorizada) return;
    if (!this.auth.tienePermiso('ponentes-firmantes.eliminar') || this.eliminando() !== null) return;
    if (!await this.confirmacion().abrir()) return;
    this.eliminando.set(firma.id_firma); this.errorOperacion.set(null);
    this.api.eliminar('firmas', firma.id_firma).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => { this.eliminando.set(null); this.aviso.set('El registro de credencial se eliminó correctamente.'); this.cargar(); },
      error: (error: ErrorApi) => { this.eliminando.set(null); this.errorOperacion.set(error.mensaje); },
    });
  }
  protected limpiar(): void { this.busqueda.reset(); this.filtroEstado.reset(); }
  private normalizar(texto: string): string { return texto.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase(); }
}
