import { ActividadesService } from '../../../core/services/actividades/actividades.service';
import { Actividad } from '../../../core/interfaces/actividades/actividad.interface';
import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, input, OnChanges, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { SolicitudesService, mensajeSolicitudes } from '../../../core/services/solicitudes/solicitudes.service';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { ActivityRequestDecisionRow } from '../../../core/interfaces/solicitudes/activity-requests-api.interface';
import { DatosSolicitud, Solicitud, textoRevisorSolicitud } from '../../../core/interfaces/solicitudes/solicitud.interface';
import { SolicitudEstadoBadgeComponent } from './solicitud-estado-badge.component';
@Component({
  selector: 'app-solicitud-detalle', standalone: true, imports: [DatePipe, RouterLink, SolicitudEstadoBadgeComponent],
  template: `@if (registro(); as fila) {
    <p><strong>{{ fila.numero }}</strong> <app-solicitud-estado-badge [estado]="fila.estado" [revision]="revision()" /></p>
    <p>Fecha de solicitud: {{ fila.fecha | date:'dd/MM/yyyy HH:mm' }}</p>
  }
  <dl class="detalle">
    <div><dt>Área solicitante</dt><dd>{{ area() }}</dd></div>
    <div><dt>Responsable solicitante</dt><dd>{{ responsable() }}</dd></div>
    <div><dt>Actividad</dt><dd>{{ datos().nombre }}</dd></div>
    <div><dt>Tipo de actividad</dt><dd>{{ tipo() }}</dd></div>
    <div><dt>Fecha de inicio</dt><dd>{{ datos().inicio | date:'dd/MM/yyyy' }}</dd></div>
    <div><dt>Fecha de fin</dt><dd>{{ datos().fin | date:'dd/MM/yyyy' }}</dd></div>
    <div><dt>Lugar</dt><dd>{{ datos().lugar }}</dd></div>
    <div class="ancho"><dt>Descripción</dt><dd>{{ datos().descripcion }}</dd></div>
    <div class="ancho"><dt>Objetivo o justificación</dt><dd>{{ datos().objetivo }}</dd></div>
    @if (registro(); as fila) {
      <div><dt>Responsable de revisión</dt><dd>{{ textoRevisor(fila) }}</dd></div>
      <div><dt>Resultado de RR. HH.</dt><dd>{{ fila.resultadoRevision || 'Consultar historial autorizado' }}</dd></div>
      <div class="ancho"><dt>Última observación autorizada</dt><dd>{{ fila.ultimaObservacion || 'Consultar historial autorizado' }}</dd></div>
    }
    @if (registro()?.actividadId; as actividadId) {
      <div><dt>Actividad vinculada</dt><dd>Actividad #{{ actividadId }}
        @if (puedeVerActividad()) { <a routerLink="/certificaciones/actividades" [queryParams]="{ actividad: actividadId }">Consultar actividad</a> }
      </dd></div>
    }
  </dl>
  @if (actividadVinculada(); as actividad) {
    <section aria-label="Actividad vinculada">
      <h3>{{ actividad.nombre }}</h3>
      <p>Área: {{ actividad.id_area.toString() === datos().areaId ? area() : 'Área #' + actividad.id_area }} · Tipo: {{ actividad.id_tipo_actividad.toString() === datos().tipoId ? tipo() : 'Tipo #' + actividad.id_tipo_actividad }}</p>
      <p>{{ actividad.fecha_inicio | date:'dd/MM/yyyy' }} – {{ actividad.fecha_fin | date:'dd/MM/yyyy' }} · Estado: {{ actividad.estado }}</p>
      <p>Origen: {{ actividad.origen || 'No informado por el servidor' }}</p>
    </section>
  }
  @if (errorActividad()) { <p role="alert">{{ errorActividad() }}</p> }
  @if (registro(); as fila) {
    <section aria-label="Historial de revisión y decisiones">
      <h3>Historial de revisión y decisiones</h3>
      @if (api.puedeConsultarHistorial(fila.id)) {
        <button class="btn" type="button" (click)="consultarHistorial()" [disabled]="cargandoHistorial()">{{ historial() === null ? 'Consultar historial' : 'Actualizar historial' }}</button>
      } @else { <p>La consulta del historial requiere autorización.</p> }
      @if (cargandoHistorial()) { <p role="status">Consultando historial…</p> }
      @if (errorHistorial()) { <p class="error" role="alert">{{ errorHistorial() }}</p> }
      @if (historial(); as decisiones) {
        @for (decision of decisiones; track decision.id_solicitud_decision) {
          <article><h4>{{ etiquetaDecision(decision) }}</h4>
            <p>{{ decision.estado_anterior }} → {{ decision.estado_nuevo }}</p>
            <p>Responsable de la decisión: {{ decision.responsable_nombre || ('Usuario #' + decision.id_usuario_responsable) }}</p>
            <p>Fecha: {{ decision.fecha_decision | date:'dd/MM/yyyy HH:mm' }}</p>
            <p>Observación: {{ decision.observacion || 'Sin observación registrada' }}</p>
          </article>
        } @empty { <p>No hay decisiones registradas.</p> }
      }
    </section>
  }`, styleUrl: './solicitudes.scss',
})
export class SolicitudDetalleComponent implements OnChanges {
  protected readonly api = inject(SolicitudesService);
  private readonly auth = inject(AuthService, { optional: true });
  private readonly destroyRef = inject(DestroyRef);
  protected readonly historial = signal<readonly ActivityRequestDecisionRow[] | null>(null);
  protected readonly cargandoHistorial = signal(false);
  protected readonly errorHistorial = signal<string | null>(null);
  private consulta?: Subscription;
  private consultaActividad?: Subscription;
  private readonly actividades = inject(ActividadesService);
  protected readonly actividadVinculada = signal<Actividad | null>(null);
  protected readonly errorActividad = signal<string | null>(null);
  ngOnChanges(): void {
    this.consultaActividad?.unsubscribe(); this.actividadVinculada.set(null); this.errorActividad.set(null);
    const id = this.registro()?.actividadId;
    if (id && this.puedeVerActividad()) {
      this.consultaActividad = this.actividades.obtener(Number(id)).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: actividad => this.actividadVinculada.set(actividad),
        error: () => this.errorActividad.set('No se pudo consultar la actividad vinculada. Puedes reintentar desde Consultar actividad.'),
      });
    }
    this.consulta?.unsubscribe(); this.historial.set(null); this.errorHistorial.set(null); this.cargandoHistorial.set(false);
  }
  protected puedeVerActividad(): boolean { return this.auth?.tienePermiso('actividades.ver') === true; }
  protected etiquetaDecision(fila: ActivityRequestDecisionRow): string {
    return { REVISION_CONFORME: 'Revisión conforme', OBSERVAR: 'Observación', DERIVAR_GERENCIA: 'Derivación a Gerencia', APROBAR: 'Aprobación de Gerencia', RECHAZAR: 'Rechazo de Gerencia' }[fila.tipo_decision];
  }
  protected consultarHistorial(): void {
    const fila = this.registro();
    if (!fila || this.cargandoHistorial() || !this.api.puedeConsultarHistorial(fila.id)) return;
    this.errorHistorial.set(null); this.historial.set(null); this.cargandoHistorial.set(true);
    this.consulta = this.api.historialSolicitud(fila.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: decisiones => { this.historial.set(decisiones); this.cargandoHistorial.set(false); },
      error: error => { this.errorHistorial.set(mensajeSolicitudes(error)); this.cargandoHistorial.set(false); },
    });
  }
  protected readonly textoRevisor = textoRevisorSolicitud;
  readonly revision = input(false);
  readonly datos = input.required<DatosSolicitud>();
  readonly area = input.required<string>();
  readonly responsable = input.required<string>();
  readonly tipo = input.required<string>();
  readonly registro = input<Solicitud | null>(null);
}
