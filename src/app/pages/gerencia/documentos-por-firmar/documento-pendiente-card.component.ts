import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { DocumentoPendiente } from '../../../core/interfaces/solicitudes/solicitud.interface';
@Component({
  selector: 'app-documento-pendiente-card', standalone: true, imports: [DatePipe],
  template: `<article class="card"><span class="material-symbols-outlined" aria-hidden="true">description</span><h2>{{ documento().beneficiario }}</h2>
    <p>{{ documento().tipo }}</p><p>Fecha: {{ documento().fecha | date:'dd/MM/yyyy' }}</p>
    <p>Código: {{ documento().codigo || 'No proporcionado por el servidor' }}</p><p><strong>{{ documento().estado }}</strong></p>
    <div class="acciones"><button class="btn" type="button" [disabled]="!documento().puedeVer" (click)="ver.emit(documento())">Ver documento</button>
      <button class="btn btn-primary" type="button" disabled title="Requiere integración criptográfica y autorización del backend">Firmar</button></div>
    <small>La firma solo se habilitará mediante el mecanismo institucional autorizado.</small></article>`,
  styleUrl: '../../solicitudes/compartidos/solicitudes.scss',
  styles: `:host { height: 100%; } article { height: 100%; display: flex; flex-direction: column; gap: .65rem; }
    h2 { color: #075a9b; font-size: 1.15rem; } .acciones { margin-top: auto; }`,
})
export class DocumentoPendienteCardComponent {
  readonly documento = input.required<DocumentoPendiente>();
  readonly ver = output<DocumentoPendiente>();
}
