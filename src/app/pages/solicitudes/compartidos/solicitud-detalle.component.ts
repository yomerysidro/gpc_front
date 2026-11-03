import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { DatosSolicitud, Solicitud } from '../../../core/interfaces/solicitudes/solicitud.interface';
import { SolicitudEstadoBadgeComponent } from './solicitud-estado-badge.component';
@Component({
  selector: 'app-solicitud-detalle', standalone: true, imports: [DatePipe, SolicitudEstadoBadgeComponent],
  template: `@if (registro(); as fila) {
    <p><strong>{{ fila.numero }}</strong> <app-solicitud-estado-badge [estado]="fila.estado" /></p>
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
      <div><dt>Responsable de revisión</dt><dd>{{ fila.revisor || 'No informado en el contrato de detalle' }}</dd></div>
      <div><dt>Resultado de RR. HH.</dt><dd>{{ fila.resultadoRevision || 'Consultar historial autorizado' }}</dd></div>
      <div class="ancho"><dt>Última observación autorizada</dt><dd>{{ fila.ultimaObservacion || 'Consultar historial autorizado' }}</dd></div>
    }
  </dl>`, styleUrl: './solicitudes.scss',
})
export class SolicitudDetalleComponent {
  readonly datos = input.required<DatosSolicitud>();
  readonly area = input.required<string>();
  readonly responsable = input.required<string>();
  readonly tipo = input.required<string>();
  readonly registro = input<Solicitud | null>(null);
}
