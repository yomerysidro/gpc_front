import { isPlatformBrowser } from '@angular/common';
import { Component, DestroyRef, inject, input, OnChanges, output, PLATFORM_ID, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { map, Observable, Subscription } from 'rxjs';
import { ErrorApi } from '../../../core/interfaces/api/api-response.interface';
import { OpcionRelacion, PayloadEmision, RecursoEditable, RegistroEmision } from '../../../core/interfaces/emision-certificados/emision-certificados.interface';
import { EmisionCertificadosService, PERMISOS_EMISION } from '../../../core/services/emision-certificados/emision-certificados.service';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { CampoEmision, CONFIGURACION_EMISION } from './emision.config';

@Component({
  selector: 'app-formulario-emision', standalone: true, imports: [ReactiveFormsModule],
  templateUrl: './formulario-emision.component.html', styleUrl: './emision.scss',
})
export class FormularioEmisionComponent implements OnChanges {
  readonly recurso = input.required<RecursoEditable>();
  readonly id = input<number | null>(null);
  readonly guardado = output<RegistroEmision>();
  readonly cancelar = output<void>();
  protected readonly api = inject(EmisionCertificadosService);
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly plataforma = inject(PLATFORM_ID);
  private carga?: Subscription;
  private original: RegistroEmision | null = null;
  protected readonly form = signal(new FormGroup<Record<string, FormControl<string | boolean>>>({}));
  protected readonly cargando = signal(false);
  protected readonly enviando = signal(false);
  protected readonly errorCarga = signal<string | null>(null);
  protected readonly errorGeneral = signal<string | null>(null);
  protected readonly errores = signal<Readonly<Record<string, readonly string[]>>>({});
  protected readonly opciones = signal<Readonly<Partial<Record<string, readonly OpcionRelacion[]>>>>({});
  protected readonly errorRelacion = signal<Readonly<Record<string, string>>>({});
  protected readonly cargandoRelacion = signal<ReadonlySet<string>>(new Set());

  protected get config() { return CONFIGURACION_EMISION[this.recurso()]; }
  protected get permitido(): boolean {
    return this.auth.tienePermiso(`${PERMISOS_EMISION[this.recurso()]}.${this.id() === null ? 'crear' : 'editar'}`);
  }

  ngOnChanges(): void {
    this.carga?.unsubscribe();
    this.original = null;
    this.errorCarga.set(null);
    this.errorGeneral.set(null);
    this.errores.set({});
    this.opciones.set({});
    this.errorRelacion.set({});
    const controles: Record<string, FormControl<string | boolean>> = {};
    for (const campo of this.config.campos) {
      const reglas: ValidatorFn[] = [];
      if (!this.opcional(campo) && campo.tipo !== 'booleano') reglas.push(Validators.required);
      if (campo.max) reglas.push(Validators.maxLength(campo.max));
      if (campo.tipo === 'numero') reglas.push(Validators.min(1), Validators.pattern(/^\d+$/));
      controles[campo.nombre] = new FormControl<string | boolean>(campo.tipo === 'booleano' ? false : '', { nonNullable: true, validators: reglas });
      controles[campo.nombre].valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.errores.update(actual => { const copia = { ...actual }; delete copia[campo.nombre]; return copia; });
      });
    }
    this.form.set(new FormGroup(controles));
    if (this.id() !== null && isPlatformBrowser(this.plataforma) && this.permitido) this.cargar();
  }

  protected cargar(): void {
    this.cargando.set(true);
    this.errorCarga.set(null);
    this.carga = this.api.obtener(this.recurso(), this.id()!).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: registro => {
        this.original = registro;
        const valores: Record<string, string | boolean> = {};
        for (const campo of this.config.campos) {
          const valor = registro[campo.nombre];
          valores[campo.nombre] = campo.tipo === 'booleano' ? valor === true || valor === 1 || valor === '1'
            : valor === null || valor === undefined ? ''
            : campo.tipo === 'fecha' ? String(valor).slice(0, 10)
            : campo.tipo === 'fecha-hora' ? String(valor).replace(' ', 'T').slice(0, 16) : String(valor);
        }
        this.form().patchValue(valores);
        this.cargando.set(false);
      },
      error: (error: ErrorApi) => { this.cargando.set(false); this.errorCarga.set(error.mensaje); },
    });
  }

  protected opcional(campo: CampoEmision): boolean {
    return !!campo.opcional || (this.id() !== null && ['passphrase', 'ruta_archivo', 'ruta_archivo_pfx'].includes(campo.nombre));
  }

  protected errorCampo(campo: CampoEmision): string | null {
    const control = this.form().controls[campo.nombre];
    if (this.errores()[campo.nombre]?.length) return this.errores()[campo.nombre][0];
    return control.touched && control.invalid ? 'Completa este campo con un valor válido.' : null;
  }

  protected cargarOpciones(campo: CampoEmision): void {
    this.cargandoRelacion.update(actual => new Set([...actual, campo.nombre]));
    const peticion: Observable<readonly OpcionRelacion[]> = campo.relacion === 'gestion'
      ? this.api.relaciones(campo.nombre)
      : this.api.listar(campo.relacion!, { per_page: 100 }).pipe(map(pagina => pagina.data.map(registro => {
        const cfg = CONFIGURACION_EMISION[campo.relacion as RecursoEditable];
        const id = Number(registro[cfg.clave]);
        return { id, texto: `#${id} · ${registro['nombre_tipo'] ?? registro['titulo'] ?? registro['codigo_verificacion'] ?? registro['id_persona_trabajador'] ?? registro['id_persona'] ?? ''}` };
      })));
    peticion.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: opciones => {
        this.opciones.update(actual => ({ ...actual, [campo.nombre]: opciones }));
        this.errorRelacion.update(actual => ({ ...actual, [campo.nombre]: '' }));
        this.finRelacion(campo.nombre);
      },
      error: (error: ErrorApi) => {
        this.errorRelacion.update(actual => ({ ...actual, [campo.nombre]: error.mensaje }));
        this.finRelacion(campo.nombre);
      },
    });
  }

  private finRelacion(nombre: string): void {
    this.cargandoRelacion.update(actual => { const copia = new Set(actual); copia.delete(nombre); return copia; });
  }

  protected guardar(): void {
    if (this.enviando() || !this.permitido || this.cargando() || this.errorCarga()) return;
    this.errorGeneral.set(null);
    if (this.form().invalid) { this.form().markAllAsTouched(); return; }
    const valores = this.form().getRawValue();
    const datos: Record<string, string | number | boolean | null> = {};
    for (const campo of this.config.campos) {
      const valor = valores[campo.nombre];
      if (this.id() !== null && ['passphrase', 'ruta_archivo', 'ruta_archivo_pfx'].includes(campo.nombre) && valor === '') continue;
      const normalizado = campo.tipo === 'secreto' ? String(valor) : typeof valor === 'string' ? valor.trim() : valor;
      datos[campo.nombre] = campo.tipo === 'numero' ? normalizado === '' ? null : Number(normalizado)
        : campo.opcional && normalizado === '' ? null : normalizado;
    }
    if (this.recurso() === 'certificados') {
      if (['id_reconocimiento', 'id_participacion', 'id_practica'].filter(campo => datos[campo] !== null).length > 1) {
        this.errorGeneral.set('Selecciona como máximo un origen para el certificado.'); return;
      }
      if (Boolean(datos['notificado']) !== Boolean(datos['fecha_notificacion'])) {
        this.errorGeneral.set('La fecha de notificación debe corresponder al estado Notificado.'); return;
      }
      if (datos['fecha_notificacion'] && (!datos['fecha_emision'] || String(datos['fecha_notificacion']) < String(datos['fecha_emision']))) {
        this.errorGeneral.set('La notificación requiere una fecha de emisión anterior o igual.'); return;
      }
    }
    // PATCH envía solo cambios: nunca se reconstruyen rutas privadas ocultas ni contraseñas.
    if (this.original) {
      for (const campo of this.config.campos) {
        if (!this.form().controls[campo.nombre].dirty) delete datos[campo.nombre];
      }
      if (!Object.keys(datos).length) { this.errorGeneral.set('No hay cambios para guardar.'); return; }
    }
    this.enviando.set(true);
    this.errores.set({});
    const payload = datos as unknown as PayloadEmision[RecursoEditable];
    const peticion = this.id() === null ? this.api.crear(this.recurso(), payload)
      : this.api.actualizar(this.recurso(), this.id()!, payload);
    peticion.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: registro => {
        this.enviando.set(false);
        this.form().controls['passphrase']?.reset('');
        this.guardado.emit(registro);
      },
      error: (error: ErrorApi) => {
        this.enviando.set(false); this.errorGeneral.set(error.mensaje); this.errores.set(error.errores);
        this.form().controls['passphrase']?.reset('');
      },
    });
  }
}
