import { Component, computed, inject, input, output, signal, viewChild } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccionSolicitud, Solicitud } from '../../../core/interfaces/solicitudes/solicitud.interface';
import { DialogoComponent } from '../../../shared/components/dialogo/dialogo.component';
import { SolicitudesService } from '../../../core/services/solicitudes/solicitudes.service';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
export interface ConfirmacionDecision { readonly registro: Solicitud; readonly accion: AccionSolicitud; readonly motivo: string; }
@Component({
  selector: 'app-decision-modal', standalone: true, imports: [DialogoComponent, ReactiveFormsModule],
  template: `<app-dialogo [titulo]="etiqueta()" [cierreControlado]="true" (cierreSolicitado)="cerrar()" (cerrado)="registro.set(null)">
    @if (registro(); as fila) {
      <dl class="datos-decision">
        <div><dt>Solicitud</dt><dd>{{ fila.numero }} · {{ fila.nombre }}</dd></div>
        <div><dt>Área</dt><dd>{{ fila.area }}</dd></div>
        <div><dt>Solicitante</dt><dd>{{ fila.responsable }}</dd></div>
      </dl>
    }
    @if (error(); as mensaje) { <p class="alert alert-error" role="alert">{{ mensaje }}</p> }
    @if (decisionFormal() && ambitoInstitucional()) { <p>Ámbito institucional autorizado.</p> }

    <form [formGroup]="form" (ngSubmit)="confirmar()">
      @if (accion() !== 'Enviar') {
        <div class="form-field"><label for="motivo-decision">{{ requiereMotivo() ? 'Motivo obligatorio' : 'Observación opcional' }}</label>
          <textarea id="motivo-decision" class="input" formControlName="motivo" rows="4" [required]="requiereMotivo()"
            [readOnly]="ocupado()"
            [attr.aria-invalid]="form.controls.motivo.touched && form.controls.motivo.invalid" aria-describedby="error-motivo"></textarea>
          @if (form.controls.motivo.touched && form.controls.motivo.invalid) {
            <p id="error-motivo" class="error" role="alert">Escribe un motivo válido, no solo espacios.</p>
          }
        </div>
      } @else { <p>Enviar cambia el estado de la solicitud; no registra una decisión ni una observación en el historial.</p> }

      <div class="acciones"><button class="btn" type="button" autofocus [disabled]="ocupado()" (click)="dialogo().cerrar()">Cancelar</button>
        <button class="btn btn-primary" type="submit" [disabled]="ocupado() || !autorizado() || !integrado()">{{ etiqueta() === 'Enviar a Gerencia' ? etiqueta() : 'Confirmar ' + etiqueta() }}</button></div>
    </form>
  </app-dialogo>`, styleUrl: './solicitudes.scss',
})
export class DecisionModalComponent {
  private readonly auth = inject(AuthService, { optional: true });
  protected readonly ambitoInstitucional = computed(() => this.auth?.capacidadesSolicitudes?.()?.decidir_ambito_institucional === true);
  protected readonly decisionFormal = computed(() => ['Aprobar', 'Rechazar'].includes(this.accion()));
  private readonly api = inject(SolicitudesService);
  readonly confirmado = output<ConfirmacionDecision>();
  readonly ocupado = input(false);
  readonly integrado = input(false);
  protected readonly registro = signal<Solicitud | null>(null);
  protected readonly accion = signal<AccionSolicitud>('Aprobar');
  readonly error = signal<string | null>(null);
  protected readonly etiqueta = computed(() => (this.accion() === 'Derivar' || this.accion() === 'Iniciar revisión' && this.auth?.capacidadesSolicitudes?.()?.derivar) ? 'Enviar a Gerencia' : this.accion());
  protected readonly requiereMotivo = computed(() => ['Observar', 'Rechazar'].includes(this.accion()));
  protected readonly dialogo = viewChild.required(DialogoComponent);
  protected readonly form = inject(NonNullableFormBuilder).group({ motivo: [''] });
  protected autorizado(): boolean {
    const registro = this.registro();
    return !!registro && this.api.accionesPermitidas(registro).includes(this.accion());
  }
  abrir(accion: AccionSolicitud, registro: Solicitud, motivo = ''): void {
    if (!this.api.accionesPermitidas(registro).includes(accion) || !this.integrado()) return;
    this.accion.set(accion); this.registro.set(registro); this.error.set(null); this.form.reset({ motivo });
    this.form.controls.motivo.setValidators(this.requiereMotivo() ? [Validators.required, Validators.pattern(/\S/)] : []);
    this.form.controls.motivo.updateValueAndValidity(); this.dialogo().abrir();
  }
  cerrar(): void { if (!this.ocupado()) this.dialogo().cerrar(); }
  protected confirmar(): void {
    this.form.markAllAsTouched();
    const registro = this.registro();
    if (!registro || !this.autorizado() || this.form.invalid || this.ocupado() || !this.integrado()) return;
    this.confirmado.emit({ registro, accion: this.accion(), motivo: this.form.controls.motivo.value.trim() });
  }
}
