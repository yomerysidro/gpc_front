import { DatePipe } from '@angular/common';
import { Component, computed, DestroyRef, inject, input, OnInit, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccionSolicitud, BandejaSolicitud, ESTADOS_SOLICITUD, PaginaSolicitudes, Solicitud } from '../../../core/interfaces/solicitudes/solicitud.interface';
import { SolicitudesService, mensajeSolicitudes } from '../../../core/services/solicitudes/solicitudes.service';
import { PageTitleComponent } from '../../../shared/components/page-title/page-title.component';
import { DialogoComponent } from '../../../shared/components/dialogo/dialogo.component';
import { ConfirmacionDecision, DecisionModalComponent } from './decision-modal.component';
import { IntegracionAvisoComponent } from './integracion-aviso.component';
import { SolicitudDetalleComponent } from './solicitud-detalle.component';
import { SolicitudEstadoBadgeComponent } from './solicitud-estado-badge.component';
import { MENSAJE_SOLICITUD_DEMO } from '../../../core/services/solicitudes/solicitudes-demo.service';
@Component({
  selector: 'app-bandeja-solicitudes', standalone: true,
  imports: [DatePipe, RouterLink, ReactiveFormsModule, PageTitleComponent, DialogoComponent, DecisionModalComponent, IntegracionAvisoComponent, SolicitudDetalleComponent, SolicitudEstadoBadgeComponent],
  templateUrl: './bandeja-solicitudes.component.html', styleUrl: './solicitudes.scss',
})
export class BandejaSolicitudesComponent implements OnInit {
  readonly bandeja = input.required<BandejaSolicitud>();
  readonly titulo = input.required<string>();
  protected readonly api = inject(SolicitudesService);
  protected readonly mensajeDemo = MENSAJE_SOLICITUD_DEMO;
  private readonly destroyRef = inject(DestroyRef);
  protected readonly filtros = inject(NonNullableFormBuilder).group({ busqueda: [''], estado: [''], desde: [''], hasta: [''] });
  protected readonly estados = ESTADOS_SOLICITUD;
  protected readonly pagina = signal<PaginaSolicitudes<Solicitud> | null>(null);
  protected readonly cargando = signal(false);
  protected readonly ocupado = signal(false);
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
  protected operativo(): boolean { return this.api.integrado || this.bandeja() === 'propias' && this.api.demostracionDisponible; }
  ngOnInit(): void {
    this.cargar();
    if (this.bandeja() === 'propias' && this.api.demostracionDisponible) this.puedeCrear.set(true);
    if (this.bandeja() === 'propias' && this.api.integrado) this.api.contexto().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: contexto => this.puedeCrear.set(contexto.puedeCrear), error: error => this.error.set(mensajeSolicitudes(error)),
    });
  }
  protected cargar(numero = 1): void {
    if (!this.api.integrado && this.bandeja() !== 'propias') { this.pagina.set(null); this.cargando.set(false); this.error.set(null); return; }
    const filtros = this.filtros.getRawValue();
    if (filtros.desde && filtros.hasta && filtros.hasta < filtros.desde) { this.error.set('La fecha final del filtro no puede preceder a la inicial.'); return; }
    this.carga?.unsubscribe(); this.cargando.set(true); this.error.set(null); this.pagina.set(null);
    this.carga = this.api.listar(this.bandeja(), { ...filtros, busqueda: filtros.busqueda.trim(), pagina: numero }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: pagina => { this.pagina.set(pagina); this.cargando.set(false); },
      error: error => { this.error.set(mensajeSolicitudes(error)); this.cargando.set(false); },
    });
  }
  protected limpiar(): void { this.filtros.reset(); this.cargar(); }
  protected acciones(fila: Solicitud): readonly AccionSolicitud[] {
    const permitidas: readonly AccionSolicitud[] = this.bandeja() === 'propias' ? ['Enviar'] : this.bandeja() === 'revision'
      ? ['Iniciar revisión', 'Observar', 'Derivar'] : ['Aprobar', 'Observar', 'Rechazar'];
    return fila.acciones.filter(accion => permitidas.includes(accion));
  }
  protected ver(fila: Solicitud): void {
    if (fila.puedeVerDetalle === false) return;
    this.cargaDetalle?.unsubscribe(); this.detalle.set(null); this.errorDetalle.set(null); this.cargandoDetalle.set(true); this.dialogo().abrir();
    this.cargaDetalle = this.api.detalle(fila.id, this.bandeja() !== 'propias').pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: detalle => { this.detalle.set(detalle); this.cargandoDetalle.set(false); },
      error: error => { this.errorDetalle.set(mensajeSolicitudes(error)); this.cargandoDetalle.set(false); },
    });
  }
  protected cerrarDetalle(): void { this.cargaDetalle?.unsubscribe(); this.detalle.set(null); }
  protected decidir(confirmacion: ConfirmacionDecision): void {
    if (this.ocupado() || (!this.api.integrado && this.bandeja() !== 'propias') || !this.acciones(confirmacion.registro).includes(confirmacion.accion)) return;
    this.ocupado.set(true); this.error.set(null); this.aviso.set(null);
    const pagina = this.pagina()?.pagina ?? 1;
    this.api.decidir(confirmacion.registro.id, confirmacion.registro.version, confirmacion.accion, confirmacion.motivo).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: fila => { this.ocupado.set(false); this.modal().cerrar(); this.aviso.set(this.api.integrado ? `Operación confirmada por el servidor. Estado: ${fila.estado}.` : MENSAJE_SOLICITUD_DEMO); this.cargar(pagina); },
      error: error => { this.ocupado.set(false); this.modal().cerrar(); this.error.set(mensajeSolicitudes(error)); },
    });
  }
}
