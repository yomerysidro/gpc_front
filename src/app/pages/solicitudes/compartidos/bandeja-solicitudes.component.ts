import { DatePipe, Location } from '@angular/common';
import { afterNextRender, Component, computed, DestroyRef, HostListener, ElementRef, inject, input, OnInit, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { distinctUntilChanged, map, merge, of, Subscription, switchMap, timer } from 'rxjs';
import { AccionSolicitud, BandejaSolicitud, ESTADOS_SOLICITUD, PaginaSolicitudes, Solicitud, textoRevisorSolicitud } from '../../../core/interfaces/solicitudes/solicitud.interface';
import { SolicitudesService, mensajeSolicitudes } from '../../../core/services/solicitudes/solicitudes.service';
import { PageTitleComponent } from '../../../shared/components/page-title/page-title.component';
import { DialogoComponent } from '../../../shared/components/dialogo/dialogo.component';
import { ConfirmacionDecision, DecisionModalComponent } from './decision-modal.component';
import { IntegracionAvisoComponent } from './integracion-aviso.component';
import { SolicitudDetalleComponent } from './solicitud-detalle.component';
import { SolicitudEstadoBadgeComponent } from './solicitud-estado-badge.component';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
@Component({
  selector: 'app-bandeja-solicitudes', standalone: true,
  imports: [DatePipe, RouterLink, ReactiveFormsModule, PageTitleComponent, DialogoComponent, DecisionModalComponent, IntegracionAvisoComponent, SolicitudDetalleComponent, SolicitudEstadoBadgeComponent],
  templateUrl: './bandeja-solicitudes.component.html', styleUrls: ['./solicitudes.scss', './bandeja-acciones.scss'],
})
export class BandejaSolicitudesComponent implements OnInit {
  protected readonly busquedaAbierta = signal(false);
  private readonly campoBusqueda = viewChild<ElementRef<HTMLInputElement>>('campoBusqueda');
  private readonly botonBusqueda = viewChild<ElementRef<HTMLButtonElement>>('botonBusqueda');
  protected abrirBusqueda(): void {
    this.busquedaAbierta.set(true);
    // El input ya existe; retirar hidden permite enfocar sin temporizadores.
    const campo = this.campoBusqueda()?.nativeElement;
    if (campo) { campo.closest<HTMLElement>('[role="search"]')!.hidden = false; campo.focus(); }
  }
  protected cerrarBusqueda(devolverFoco = true): void {
    this.busquedaAbierta.set(false);
    if (this.filtros.controls.busqueda.value !== '') this.filtros.controls.busqueda.setValue('');
    if (devolverFoco) this.botonBusqueda()?.nativeElement.focus();
  }
  @HostListener('document:click', ['$event'])
  protected ocultarBusquedaAlSalir(evento: MouseEvent): void {
    if (!this.busquedaAbierta()) return;
    const destino = evento.composedPath();
    const campo = this.campoBusqueda()?.nativeElement.closest('[role="search"]');
    const boton = this.botonBusqueda()?.nativeElement;
    if ((!campo || !destino.includes(campo)) && (!boton || !destino.includes(boton))) this.cerrarBusqueda(false);
  }
  protected readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute, { optional: true });
  constructor() {
    afterNextRender(() => this.route?.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const id = Number(params.get('solicitud'));
      if (Number.isSafeInteger(id) && id > 0) this.abrirDetalle(String(id));
    }));
  }
  protected readonly textoRevisor = textoRevisorSolicitud;
  readonly bandeja = input.required<BandejaSolicitud>();
  readonly titulo = input.required<string>();
  protected readonly api = inject(SolicitudesService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  protected readonly filtros = inject(NonNullableFormBuilder).group({ busqueda: [''], estado: [''], desde: [''], hasta: [''] });
  protected readonly estados = ESTADOS_SOLICITUD;
  protected readonly pagina = signal<PaginaSolicitudes<Solicitud> | null>(null);
  protected readonly cargando = signal(false);
  protected readonly ocupado = signal(false);
  protected readonly pestanaGerencia = signal<'pendientes' | 'aprobadas'>('pendientes');
  protected readonly error = signal<string | null>(null);
  protected readonly aviso = signal<string | null>(null);
  protected readonly detalle = signal<Solicitud | null>(null);
  protected readonly errorDetalle = signal<string | null>(null);
  protected readonly cargandoDetalle = signal(false);
  protected readonly puedeCrear = signal(false);
  protected readonly modal = viewChild.required(DecisionModalComponent);
  protected readonly dialogo = viewChild.required(DialogoComponent);
  protected readonly observadas = computed(() => this.pagina()?.registros.filter(fila => fila.estado === 'Observada').length ?? null);
  protected readonly pendientes = computed(() => this.pagina()?.registros.filter(fila => ['Enviada', 'En revisión', 'Pendiente de aprobación'].includes(fila.estado)).length ?? null);
  private carga?: Subscription;
  private cargaDetalle?: Subscription;
  protected operativo(): boolean { return this.api.integrado; }
  ngOnInit(): void {
    this.api.cambios$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (!this.ocupado()) {
        if (this.detalle()) this.dialogo().cerrar();
        this.cerrarDetalle(); this.cargar(this.pagina()?.pagina ?? 1);
      }
    });
    if (this.bandeja() === 'revision') this.filtros.controls.estado.setValue('Enviada');
    if (this.bandeja() === 'gerencia') {
      this.route?.queryParamMap.pipe(
        map(params => params.get('pestana') === 'aprobadas' ? 'aprobadas' as const : 'pendientes' as const),
        distinctUntilChanged(), takeUntilDestroyed(this.destroyRef),
      ).subscribe(pestana => {
        this.pestanaGerencia.set(pestana);
        this.filtros.controls.estado.setValue(pestana === 'aprobadas' ? 'Aprobada' : 'Pendiente de aprobación');
        this.cargar();
      });
    }
    if (this.bandeja() === 'propias') {
      // Un cambio de estado cancela la espera de búsqueda y consulta ambos valores actuales.
      merge(
        this.filtros.controls.busqueda.valueChanges.pipe(map(valor => valor.trim()), distinctUntilChanged(), map(() => 300)),
        this.filtros.controls.estado.valueChanges.pipe(distinctUntilChanged(), map(() => 0)),
      ).pipe(switchMap(espera => espera ? timer(espera) : of(0)), takeUntilDestroyed(this.destroyRef))
        .subscribe(() => { if (!this.ocupado()) this.cargar(); });
    }
    const estado = this.router.getCurrentNavigation()?.extras.state ?? this.location.getState() as Record<string, unknown>;
    if (this.bandeja() === 'propias' && estado?.['solicitudEnviada']) {
      this.aviso.set('Solicitud enviada y confirmada por Laravel.');
    }
    if (this.bandeja() !== 'gerencia' || !this.route) this.cargar();
    if (this.bandeja() === 'propias' && this.api.integrado) this.api.contexto().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: contexto => this.puedeCrear.set(contexto.puedeCrear), error: error => this.error.set(mensajeSolicitudes(error)),
    });
  }
  @HostListener('window:focus')
  protected actualizarAlVolver(): void {
    if (this.bandeja() !== 'propias' || this.ocupado() || this.cargando()) return;
    this.cargar(this.pagina()?.pagina ?? 1);
    const detalle = this.detalle();
    if (detalle) this.abrirDetalle(detalle.id);
  }

  protected cargar(numero = 1): void {
    if (!this.api.integrado) { this.pagina.set(null); this.cargando.set(false); this.error.set(null); return; }
    const filtros = this.filtros.getRawValue();
    if (this.bandeja() === 'gerencia') filtros.estado = this.pestanaGerencia() === 'aprobadas' ? 'Aprobada' : 'Pendiente de aprobación';
    if (filtros.desde && filtros.hasta && filtros.hasta < filtros.desde) { this.error.set('La fecha final del filtro no puede preceder a la inicial.'); return; }
    this.carga?.unsubscribe(); this.cargando.set(true); this.error.set(null);
    if (this.bandeja() !== 'propias') this.pagina.set(null);
    this.carga = this.api.listar(this.bandeja(), { ...filtros, busqueda: filtros.busqueda.trim(), pagina: numero }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: pagina => { this.pagina.set(pagina); this.cargando.set(false); },
      error: error => { this.error.set(mensajeSolicitudes(error)); this.cargando.set(false); },
    });
  }
  protected limpiar(): void {
    this.filtros.reset();
    if (this.bandeja() === 'revision') this.filtros.controls.estado.setValue('Enviada');
    if (this.bandeja() === 'gerencia') this.filtros.controls.estado.setValue(this.pestanaGerencia() === 'aprobadas' ? 'Aprobada' : 'Pendiente de aprobación');
    this.cargar();
  }
  protected acciones(fila: Solicitud): readonly AccionSolicitud[] {
    if (this.bandeja() === 'gerencia' && (this.pestanaGerencia() === 'aprobadas' || fila.estado !== 'Pendiente de aprobación')) return [];
    const permitidas: readonly AccionSolicitud[] = this.bandeja() === 'propias' ? ['Enviar'] : this.bandeja() === 'revision'
      ? ['Iniciar revisión', 'Derivar'] : ['Aprobar', 'Rechazar'];
    return this.api.accionesPermitidas(fila).filter(accion => permitidas.includes(accion));
  }
  protected ver(fila: Solicitud): void {
    if (fila.puedeVerDetalle === false) return;
    this.abrirDetalle(fila.id);
  }
  protected cambiarPestanaGerencia(pestana: 'pendientes' | 'aprobadas'): void {
    if (this.ocupado() || this.pestanaGerencia() === pestana) return;
    if (this.detalle() || this.cargandoDetalle()) this.dialogo().cerrar();
    this.aviso.set(null);
    void this.router.navigate([], { relativeTo: this.route!, queryParams: { pestana: pestana === 'aprobadas' ? pestana : null }, queryParamsHandling: 'merge' });
  }
  protected teclearPestanasGerencia(evento: KeyboardEvent): void {
    if (this.ocupado() || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(evento.key)) return;
    evento.preventDefault();
    const destino = evento.key === 'Home' ? 'pendientes' : evento.key === 'End' ? 'aprobadas' : this.pestanaGerencia() === 'pendientes' ? 'aprobadas' : 'pendientes';
    this.cambiarPestanaGerencia(destino);
    (evento.currentTarget as HTMLElement).querySelector<HTMLButtonElement>('#gerencia-' + destino)?.focus();
  }
  private abrirDetalle(id: string): void {
    this.cargaDetalle?.unsubscribe(); this.detalle.set(null); this.errorDetalle.set(null); this.cargandoDetalle.set(true); this.dialogo().abrir();
    this.cargaDetalle = this.api.detalle(id, this.bandeja() !== 'propias').pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: detalle => { this.detalle.set(detalle); this.cargandoDetalle.set(false); },
      error: error => { this.errorDetalle.set(mensajeSolicitudes(error)); this.cargandoDetalle.set(false); },
    });
  }
  protected cerrarDetalle(): void { this.cargaDetalle?.unsubscribe(); this.detalle.set(null); }
  protected decidir(confirmacion: ConfirmacionDecision): void {
    if (this.ocupado() || (!this.api.integrado) || !this.acciones(confirmacion.registro).includes(confirmacion.accion)) return;
    this.ocupado.set(true); this.error.set(null); this.aviso.set(null);
    const pagina = this.pagina()?.pagina ?? 1;
    this.api.decidir(confirmacion.registro.id, confirmacion.registro.version, confirmacion.accion, confirmacion.motivo).pipe(
      switchMap(fila => {
        if (confirmacion.accion !== 'Iniciar revisión' || !this.acciones(fila).includes('Derivar')) return of(fila);
        if (this.detalle()?.id === fila.id) this.detalle.set(fila);
        this.modal().abrir('Derivar', fila, confirmacion.motivo);
        this.filtros.controls.estado.setValue('En revisión');
        return this.api.decidir(fila.id, fila.version, 'Derivar', confirmacion.motivo);
      }),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: fila => {
        this.ocupado.set(false); this.aviso.set(`Operación confirmada por el servidor. Estado: ${fila.estado}.`);
        if (this.bandeja() === 'gerencia' && this.detalle()) { this.dialogo().cerrar(); this.cerrarDetalle(); }

        if (this.bandeja() === 'revision' && fila.estado === 'En revisión') {
          this.filtros.controls.estado.setValue('En revisión');
          if (this.detalle()?.id === fila.id) this.detalle.set(fila);
          this.modal().cerrar();

        } else {
          this.modal().cerrar();
          if (this.detalle()?.id === fila.id && this.bandeja() !== 'gerencia') this.dialogo().cerrar();
        }
        this.cargar(pagina);
      },
      error: error => { this.ocupado.set(false); this.modal().error.set(mensajeSolicitudes(error)); },
    });
  }
}
