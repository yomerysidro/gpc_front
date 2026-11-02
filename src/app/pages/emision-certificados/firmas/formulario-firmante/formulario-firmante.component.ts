import { Component, DestroyRef, inject, input, OnChanges, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorApi } from '../../../../core/interfaces/api/api-response.interface';
import { Firma, PayloadEmision, TrabajadorEmision } from '../../../../core/interfaces/emision-certificados/emision-certificados.interface';
import { AuthService } from '../../../../core/services/autenticacion/auth.service';
import { EmisionCertificadosService } from '../../../../core/services/emision-certificados/emision-certificados.service';

@Component({
  selector: 'app-formulario-firmante', standalone: true, imports: [ReactiveFormsModule],
  templateUrl: './formulario-firmante.component.html',
  styles: `:host { display: block; } .acciones { display: flex; flex-wrap: wrap; gap: var(--espacio-3); } .nota { color: var(--neutro-700); font-size: .875rem; } fieldset { padding: 0; margin: 0; border: 0; min-width: 0; }`,
})
export class FormularioFirmanteComponent implements OnChanges {
  readonly firma = input<Firma | null>(null);
  readonly trabajadores = input<readonly TrabajadorEmision[]>([]);
  readonly nombres = input<Readonly<Partial<Record<number, string>>>>({});
  readonly guardado = output<Firma>();
  readonly cancelar = output<void>();
  private readonly api = inject(EmisionCertificadosService);
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(NonNullableFormBuilder);
  readonly form = this.fb.group({
    trabajador: ['', Validators.required], fecha: ['', [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]],
    referencia: ['', Validators.maxLength(255)], clave: ['', Validators.maxLength(255)],
  });
  protected readonly enviando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly errores = signal<Readonly<Partial<Record<string, readonly string[]>>>>({});
  protected get permitido(): boolean { return this.auth.tienePermiso(`ponentes-firmantes.${this.firma() ? 'editar' : 'crear'}`); }

  ngOnChanges(): void {
    const firma = this.firma();
    this.form.reset({ trabajador: firma ? String(firma.id_persona_trabajador) : '', fecha: firma?.fecha_firma?.slice(0, 10) ?? '', referencia: '', clave: '' });
    this.form.controls.referencia.setValidators(firma ? [Validators.maxLength(255)] : [Validators.required, Validators.maxLength(255)]);
    this.form.controls.clave.setValidators(firma ? [Validators.maxLength(255)] : [Validators.required, Validators.maxLength(255)]);
    this.form.controls.referencia.updateValueAndValidity(); this.form.controls.clave.updateValueAndValidity();
    this.error.set(null); this.errores.set({});
  }

  protected guardar(): void {
    if (!this.permitido || this.enviando()) return;
    this.error.set(null); this.errores.set({}); this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const valores = this.form.getRawValue();
    const id = Number(valores.trabajador);
    if (!this.trabajadores().some(fila => fila.id_persona_trabajador === id) && id !== this.firma()?.id_persona_trabajador) {
      this.error.set('Selecciona un trabajador existente del catálogo autorizado.'); return;
    }
    const cambios: Partial<PayloadEmision['firmas']> = {};
    const original = this.firma();
    if (!original || id !== original.id_persona_trabajador) cambios.id_persona_trabajador = id;
    if (!original || valores.fecha !== original.fecha_firma?.slice(0, 10)) cambios.fecha_firma = valores.fecha;
    if (valores.referencia.trim()) cambios.ruta_archivo_pfx = valores.referencia.trim();
    if (valores.clave) cambios.passphrase = valores.clave;
    if (!Object.keys(cambios).length) { this.error.set('No hay cambios para guardar.'); return; }
    this.enviando.set(true);
    const peticion = original ? this.api.actualizar('firmas', original.id_firma, cambios)
      : this.api.crear('firmas', cambios as PayloadEmision['firmas']);
    peticion.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: firma => { this.limpiarCredencial(); this.enviando.set(false); this.guardado.emit(firma); },
      error: (error: ErrorApi) => { this.limpiarCredencial(); this.enviando.set(false); this.error.set(error.mensaje); this.errores.set(error.errores); },
    });
  }

  private limpiarCredencial(): void { this.form.controls.clave.reset(''); this.form.controls.referencia.reset(''); }
  protected salir(): void { if (!this.enviando()) { this.limpiarCredencial(); this.cancelar.emit(); } }
}
