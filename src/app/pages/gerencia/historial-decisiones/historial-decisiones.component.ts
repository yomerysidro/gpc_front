import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DecisionSolicitud, PaginaSolicitudes, Solicitud } from '../../../core/interfaces/solicitudes/solicitud.interface';
import { SolicitudesService, mensajeSolicitudes } from '../../../core/services/solicitudes/solicitudes.service';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { PageTitleComponent } from '../../../shared/components/page-title/page-title.component';
import { DialogoComponent } from '../../../shared/components/dialogo/dialogo.component';
import { IntegracionAvisoComponent } from '../../solicitudes/compartidos/integracion-aviso.component';
import { SolicitudDetalleComponent } from '../../solicitudes/compartidos/solicitud-detalle.component';
import { SolicitudEstadoBadgeComponent } from '../../solicitudes/compartidos/solicitud-estado-badge.component';
@Component({
  selector: 'app-historial-decisiones', standalone: true,
  imports: [DatePipe, ReactiveFormsModule, PageTitleComponent, DialogoComponent, IntegracionAvisoComponent, SolicitudDetalleComponent, SolicitudEstadoBadgeComponent],
  templateUrl: './historial-decisiones.component.html', styleUrl: '../../solicitudes/compartidos/solicitudes.scss',
})
export class HistorialDecisionesComponent implements OnInit {
  protected readonly api = inject(SolicitudesService);
  protected readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly filtros = inject(NonNullableFormBuilder).group({ solicitudId: [''], responsableId: [''], busqueda: [''], estado: [''], desde: [''], hasta: [''] });
  protected readonly pagina = signal<PaginaSolicitudes<DecisionSolicitud> | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly cargando = signal(false);
  protected readonly detalle = signal<Solicitud | null>(null);
  protected readonly decision = signal<DecisionSolicitud | null>(null);
  protected readonly errorDetalle = signal<string | null>(null);
  protected readonly cargandoDetalle = signal(false);
  protected readonly dialogo = viewChild.required(DialogoComponent);
  private carga?: Subscription;
  private cargaDetalle?: Subscription;
  ngOnInit(): void { this.cargar(); }
  protected puedeConsultarDetalle(): boolean {
    const capacidades = this.auth.capacidadesSolicitudes?.();
    return this.auth.tienePermiso('solicitudes.consultar') || capacidades?.consulta_administrativa_global === true
      || capacidades?.consultar_revision === true || capacidades?.consultar_gerencia === true;
  }
  protected cargar(numero = 1): void {
    if (!this.api.integrado) { this.pagina.set(null); this.cargando.set(false); this.error.set(null); return; }
    const filtros = this.filtros.getRawValue();
    if (filtros.desde && filtros.hasta && filtros.hasta < filtros.desde) { this.error.set('Revisa el intervalo de fechas.'); return; }
    this.carga?.unsubscribe(); this.error.set(null); this.cargando.set(true); this.pagina.set(null);
    this.carga = this.api.historial({ ...filtros, busqueda: filtros.busqueda.trim(), pagina: numero }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: pagina => { this.pagina.set(pagina); this.cargando.set(false); }, error: error => { this.error.set(mensajeSolicitudes(error)); this.cargando.set(false); },
    });
  }
  protected ver(decision: DecisionSolicitud): void {
    if (!this.puedeConsultarDetalle()) return;
    this.cargaDetalle?.unsubscribe(); this.detalle.set(null); this.decision.set(decision); this.errorDetalle.set(null); this.cargandoDetalle.set(true); this.dialogo().abrir();
    this.cargaDetalle = this.api.detalle(decision.solicitudId, true).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: detalle => { this.detalle.set(detalle); this.cargandoDetalle.set(false); }, error: error => { this.errorDetalle.set(mensajeSolicitudes(error)); this.cargandoDetalle.set(false); },
    });
  }
  protected cerrar(): void { this.cargaDetalle?.unsubscribe(); this.detalle.set(null); this.decision.set(null); }
}
