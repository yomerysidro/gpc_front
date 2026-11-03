import { Component, computed, DestroyRef, ElementRef, inject, input, OnChanges, OnDestroy, output, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorApi } from '../../../../core/interfaces/api/api-response.interface';
import { Firma, TrabajadorEmision } from '../../../../core/interfaces/emision-certificados/emision-certificados.interface';
import { AuthService } from '../../../../core/services/autenticacion/auth.service';
import { EmisionCertificadosService } from '../../../../core/services/emision-certificados/emision-certificados.service';
import { CredencialesDigitalesService } from '../../../../core/services/emision-certificados/credenciales-digitales.service';
import { BLOQUEO_ESCRITURA_EMISION, ESCRITURA_EMISION_AUTORIZADA } from '../../../../core/services/emision-certificados/operaciones-emision';
@Component({
  selector: 'app-formulario-firmante', standalone: true, imports: [ReactiveFormsModule],
  templateUrl: './formulario-firmante.component.html', styleUrl: './formulario-firmante.component.scss',
})
export class FormularioFirmanteComponent implements OnChanges, OnDestroy {
  protected readonly escrituraAutorizada = inject(ESCRITURA_EMISION_AUTORIZADA);
  protected readonly bloqueoEscritura = BLOQUEO_ESCRITURA_EMISION;
  readonly firma = input<Firma | null>(null);
  readonly trabajadores = input<readonly TrabajadorEmision[]>([]);
  readonly nombres = input<Readonly<Partial<Record<number, string>>>>({});
  readonly documentos = input<Readonly<Partial<Record<number, string>>>>({});
  readonly guardado = output<Firma>();
  readonly cancelar = output<void>();
  private readonly api = inject(EmisionCertificadosService);
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly carga = inject(CredencialesDigitalesService);
  private readonly archivoInput = viewChild<ElementRef<HTMLInputElement>>('archivoInput');
  readonly form = inject(NonNullableFormBuilder).group({ trabajador: ['', Validators.required],
    fecha: ['', [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]], clave: ['', Validators.maxLength(255)] });
  protected readonly busqueda = new FormControl('', { nonNullable: true });
  private readonly texto = toSignal(this.busqueda.valueChanges, { initialValue: '' });
  private readonly trabajadorId = toSignal(this.form.controls.trabajador.valueChanges, { initialValue: '' });
  protected readonly trabajador = computed(() => this.trabajadores().find(fila => String(fila.id_persona_trabajador) === this.trabajadorId()));
  protected readonly resultados = computed(() => this.trabajadores().filter(fila =>
    !this.texto().trim() || `${this.nombres()[fila.id_persona] ?? ''} ${fila.cargo} ${fila.id_persona_trabajador}`.toLocaleLowerCase().includes(this.texto().trim().toLocaleLowerCase())));
  protected readonly archivo = signal<File | null>(null);
  protected readonly errorArchivo = signal<string | null>(null);
  protected readonly enviando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly errores = signal<Readonly<Partial<Record<string, readonly string[]>>>>({});
  protected get permitido(): boolean { return this.auth.tienePermiso(`ponentes-firmantes.${this.firma() ? 'editar' : 'crear'}`); }
  ngOnChanges(): void {
    this.limpiar(); const firma = this.firma();
    this.form.reset({ trabajador: firma ? String(firma.id_persona_trabajador) : '', fecha: firma?.fecha_firma?.slice(0, 10) ?? '', clave: '' });
    if (firma) this.form.controls.trabajador.disable(); else this.form.controls.trabajador.enable();
    this.form.controls.clave.setValidators(firma ? [Validators.maxLength(255)] : [Validators.required, Validators.maxLength(255)]);
    this.form.controls.clave.updateValueAndValidity(); this.error.set(null); this.errores.set({});
  }
  protected elegir(evento: Event): void { const input = evento.target; if (input instanceof HTMLInputElement) this.validarArchivo(input.files?.[0] ?? null); }
  protected soltar(evento: DragEvent): void { evento.preventDefault(); if (!this.enviando() && !this.firma()) this.validarArchivo(evento.dataTransfer?.files[0] ?? null); }
  private validarArchivo(archivo: File | null): void {
    this.archivo.set(null); this.errorArchivo.set(null);
    if (!archivo) return;
    if (!/\.(pfx|p12)$/i.test(archivo.name) || !archivo.size) { this.errorArchivo.set('Selecciona un archivo .pfx o .p12 no vacío.'); return; }
    if (this.carga.maximoBytes && archivo.size > this.carga.maximoBytes) { this.errorArchivo.set('El archivo supera el tamaño máximo autorizado por el servicio.'); return; }
    this.archivo.set(archivo);
  }
  protected guardar(): void {
    if (!this.escrituraAutorizada || !this.permitido || this.enviando()) return;
    this.form.markAllAsTouched(); this.error.set(null); this.errores.set({});
    const original = this.firma(); const valores = this.form.getRawValue(); const id = Number(valores.trabajador);
    if (this.form.invalid) return;
    if (!this.trabajadores().some(fila => fila.id_persona_trabajador === id) && id !== original?.id_persona_trabajador) { this.error.set('Selecciona un trabajador existente del catálogo autorizado.'); return; }
    if (Number.isNaN(Date.parse(valores.fecha)) || new Date(valores.fecha).toISOString().slice(0, 10) !== valores.fecha) { this.error.set('La fecha de registro no es válida.'); return; }
    if (!original && (!this.carga.disponible || !this.archivo())) { this.error.set('Falta integrar la carga privada autorizada del archivo PKCS#12. No se ha enviado información.'); return; }
    if (original && (id !== original.id_persona_trabajador || valores.clave || this.archivo())) { this.error.set('La reasignación de identidad y el reemplazo de credenciales requieren una operación institucional específica.'); this.limpiar(); return; }
    if (original && valores.fecha === original.fecha_firma?.slice(0, 10)) { this.error.set('No hay cambios para guardar.'); return; }
    const archivo = this.archivo(); this.enviando.set(true);
    const peticion = original ? this.api.actualizar('firmas', original.id_firma, { fecha_firma: valores.fecha })
      : archivo ? this.carga.registrar({ trabajador: id, fecha: valores.fecha, archivo, password: valores.clave }) : null;
    if (!peticion) { this.enviando.set(false); return; }
    peticion.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: firma => { this.limpiar(); this.enviando.set(false); this.guardado.emit(firma); },
      error: (error: ErrorApi | Error) => { this.limpiar(); this.enviando.set(false); this.error.set(error instanceof Error ? error.message : error.mensaje); if (!(error instanceof Error)) this.errores.set(error.errores); },
    });
  }
  limpiar(): void { this.form.controls.clave.reset(''); this.archivo.set(null); this.errorArchivo.set(null); const input = this.archivoInput()?.nativeElement; if (input) input.value = ''; }
  ngOnDestroy(): void { this.limpiar(); }
  protected salir(): void { if (!this.enviando()) { this.limpiar(); this.cancelar.emit(); } }
}
