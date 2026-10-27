import { afterNextRender, Component, computed, DestroyRef, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiResponse, ErrorApi } from '../../../../core/interfaces/api/api-response.interface';
import { Modulo, Permiso } from '../../../../core/interfaces/roles/modulo.interface';
import { ModulosService } from '../../../../core/services/modulos/modulos.service';
import {
  accionDeClave,
  accionDesdeNombre,
  componerClave,
  LARGO_MAXIMO_CLAVE,
  PATRON_ACCION_PERMISO,
  PATRON_URL_MODULO,
  slugModulo,
} from '../../../../models/roles/clave-permiso.model';
import { DialogoConfirmacionComponent } from '../../../../shared/components/dialogo-confirmacion/dialogo-confirmacion.component';
import { DialogoComponent } from '../../../../shared/components/dialogo/dialogo.component';
import { HasPermissionDirective } from '../../../../shared/directives/has-permission.directive';
import { ICONOS_DISPONIBLES } from '../../../../shared/utils/iconos-disponibles';

interface Aviso {
  readonly tipo: 'exito' | 'error';
  readonly texto: string;
}

interface PorConfirmar {
  readonly tipo: 'módulo' | 'permiso';
  readonly nombre: string;
  readonly estado: boolean;
}

/** Mensajes de validación del navegador por campo; los del backend (422) tienen prioridad. */
const MENSAJES: Record<string, Record<string, string>> = {
  nombre: { required: 'Ingresa el nombre.', maxlength: 'Es demasiado largo.' },
  url: { required: 'Ingresa la URL.', pattern: 'Usa "/" y minúsculas, p. ej. /reportes.', maxlength: 'Es demasiado larga.' },
  accion: { required: 'Ingresa la acción.', pattern: 'Usa minúsculas, dígitos y guiones, p. ej. exportar.', maxlength: 'La clave completa no puede pasar de 50 caracteres.' },
  valor: { maxlength: 'Máximo 50 caracteres.' },
  comentario: { maxlength: 'Máximo 50 caracteres.' },
};

/** Pestaña "Módulos y permisos" de /roles: catálogo de módulos con sus permisos desplegables. */
@Component({
  selector: 'app-catalogo-modulos',
  standalone: true,
  imports: [ReactiveFormsModule, HasPermissionDirective, DialogoComponent, DialogoConfirmacionComponent],
  templateUrl: './catalogo-modulos.component.html',
  styleUrl: './catalogo-modulos.component.scss'
})
export class CatalogoModulosComponent {
  private readonly modulosService = inject(ModulosService);
  private readonly dialogoModulo = viewChild.required<DialogoComponent>('dialogoModulo');
  private readonly dialogoPermiso = viewChild.required<DialogoComponent>('dialogoPermiso');
  private readonly confirmacion = viewChild.required(DialogoConfirmacionComponent);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly iconos = [...ICONOS_DISPONIBLES];
  protected readonly modulos = signal<readonly Modulo[]>([]);
  protected readonly cargando = signal(true);
  protected readonly errorCarga = signal<string | null>(null);
  protected readonly aviso = signal<Aviso | null>(null);
  protected readonly procesando = signal<string | null>(null);
  protected readonly porConfirmar = signal<PorConfirmar | null>(null);

  protected readonly enviando = signal(false);
  protected readonly errorDialogo = signal<string | null>(null);
  protected readonly erroresServidor = signal<Readonly<Record<string, readonly string[]>>>({});

  /** null: módulo nuevo. */
  protected readonly moduloEditando = signal<Modulo | null>(null);
  /** Con permisos, la URL no cambia: las claves de sus permisos empiezan con ella (el backend responde 409). */
  protected readonly urlBloqueada = computed(() => (this.moduloEditando()?.permisos.length ?? 0) > 0);
  protected readonly formModulo = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(255)]],
    url: ['', [Validators.required, Validators.maxLength(255), Validators.pattern(PATRON_URL_MODULO)]],
    imagen: [''],
  });

  protected readonly moduloDelPermiso = signal<Modulo | null>(null);
  /** null: permiso nuevo. */
  protected readonly permisoEditando = signal<Permiso | null>(null);
  /** Prefijo fijo de la clave ("reportes."): solo se escribe la acción. */
  protected readonly prefijoClave = computed(() => {
    const modulo = this.moduloDelPermiso();
    return modulo ? `${slugModulo(modulo.url)}.` : '';
  });
  protected readonly formPermiso = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(50)]],
    accion: ['', [Validators.required, Validators.pattern(PATRON_ACCION_PERMISO)]],
    valor: ['', Validators.maxLength(50)],
    comentario: ['', Validators.maxLength(50)],
  });
  /** La acción se sugiere desde el nombre hasta que la persona la edita a mano. */
  private accionManual = false;

  constructor() {
    afterNextRender(() => this.cargar());

    const destroyRef = inject(DestroyRef);
    this.formPermiso.controls.nombre.valueChanges.pipe(takeUntilDestroyed(destroyRef)).subscribe(nombre => {
      const modulo = this.moduloDelPermiso();

      if (modulo && !this.permisoEditando() && !this.accionManual) {
        this.formPermiso.controls.accion.setValue(accionDesdeNombre(nombre), { emitEvent: false });
      }
    });

    for (const form of [this.formModulo, this.formPermiso]) {
      for (const [campo, control] of Object.entries(form.controls)) {
        // El backend reporta la acción como "clave" (la clave completa).
        const claveServidor = campo === 'accion' ? 'clave' : campo;
        control.valueChanges.pipe(takeUntilDestroyed(destroyRef)).subscribe(() => {
          if (this.erroresServidor()[claveServidor]) {
            const { [claveServidor]: _, ...resto } = this.erroresServidor();
            this.erroresServidor.set(resto);
          }
        });
      }
    }
  }

  protected iconoValido(nombre: string | null): boolean {
    return !!nombre && ICONOS_DISPONIBLES.has(nombre);
  }

  /** Error visible de un campo: el del backend (bajo `claveServidor`) o el del navegador. */
  protected error(control: AbstractControl, campo: string, claveServidor = campo): string | null {
    const servidor = this.erroresServidor()[claveServidor];

    if (servidor?.length) return servidor[0];
    if (!control.touched || control.valid || !control.errors) return null;

    return MENSAJES[campo]?.[Object.keys(control.errors)[0]] ?? 'Revisa este campo.';
  }

  protected abrirModulo(modulo: Modulo | null): void {
    this.moduloEditando.set(modulo);
    this.formModulo.reset({ nombre: modulo?.nombre ?? '', url: modulo?.url ?? '', imagen: modulo?.imagen ?? '' });
    this.limpiarErroresDialogo();
    this.dialogoModulo().abrir();
  }

  protected abrirPermiso(modulo: Modulo, permiso: Permiso | null): void {
    this.moduloDelPermiso.set(modulo);
    this.permisoEditando.set(permiso);
    this.accionManual = !!permiso;
    // La clave completa ("<slug>.<acción>") no puede pasar del máximo del backend.
    this.formPermiso.controls.accion.setValidators([
      Validators.required,
      Validators.pattern(PATRON_ACCION_PERMISO),
      Validators.maxLength(LARGO_MAXIMO_CLAVE - slugModulo(modulo.url).length - 1),
    ]);
    this.formPermiso.reset({
      nombre: permiso?.nombre ?? '',
      accion: permiso ? accionDeClave(modulo.url, permiso.clave) : '',
      valor: permiso?.valor ?? '',
      comentario: permiso?.comentario ?? '',
    });
    this.limpiarErroresDialogo();
    this.dialogoPermiso().abrir();
  }

  protected alEditarAccion(): void {
    this.accionManual = true;
  }

  protected cerrarModulo(): void {
    this.dialogoModulo().cerrar();
  }

  protected cerrarPermiso(): void {
    this.dialogoPermiso().cerrar();
  }

  protected guardarModulo(): void {
    if (this.formModulo.invalid) {
      this.formModulo.markAllAsTouched();
      return;
    }

    const valores = this.formModulo.getRawValue();
    const payload = { nombre: valores.nombre.trim(), url: valores.url.trim(), imagen: valores.imagen || null };
    const modulo = this.moduloEditando();
    const peticion = modulo ? this.modulosService.actualizar(modulo.id, payload) : this.modulosService.crear(payload);

    this.enviarDialogo(peticion, this.dialogoModulo(),
      modulo ? `Se guardó el módulo ${payload.nombre}.` : `Se creó el módulo ${payload.nombre}.`);
  }

  protected guardarPermiso(): void {
    const modulo = this.moduloDelPermiso();

    if (this.formPermiso.invalid || !modulo) {
      this.formPermiso.markAllAsTouched();
      return;
    }

    const valores = this.formPermiso.getRawValue();
    const payload = {
      nombre: valores.nombre.trim(),
      clave: componerClave(modulo.url, valores.accion.trim()),
      valor: valores.valor.trim() || null,
      comentario: valores.comentario.trim() || null,
    };
    const permiso = this.permisoEditando();
    const peticion = permiso
      ? this.modulosService.actualizarPermiso(permiso.id, payload)
      : this.modulosService.crearPermiso(modulo.id, payload);

    this.enviarDialogo(peticion, this.dialogoPermiso(),
      permiso ? `Se guardó el permiso ${payload.clave}.` : `Se creó el permiso ${payload.clave} en ${modulo.nombre}.`);
  }

  protected async cambiarEstadoModulo(modulo: Modulo): Promise<void> {
    this.porConfirmar.set({ tipo: 'módulo', nombre: modulo.nombre, estado: modulo.estado });

    if (!await this.confirmacion().abrir()) return;

    this.ejecutar(`m${modulo.id}`, this.modulosService.cambiarEstado(modulo.id, !modulo.estado),
      `El módulo ${modulo.nombre} fue ${modulo.estado ? 'desactivado' : 'activado'}.`);
  }

  protected async cambiarEstadoPermiso(permiso: Permiso): Promise<void> {
    this.porConfirmar.set({ tipo: 'permiso', nombre: permiso.clave, estado: permiso.estado });

    if (!await this.confirmacion().abrir()) return;

    this.ejecutar(`p${permiso.id}`, this.modulosService.cambiarEstadoPermiso(permiso.id, !permiso.estado),
      `El permiso ${permiso.clave} fue ${permiso.estado ? 'desactivado' : 'activado'}.`);
  }

  private enviarDialogo(peticion: Observable<ApiResponse<unknown>>, dialogo: DialogoComponent, exito: string): void {
    this.enviando.set(true);
    this.errorDialogo.set(null);

    peticion.subscribe({
      next: () => {
        this.enviando.set(false);
        dialogo.cerrar();
        this.aviso.set({ tipo: 'exito', texto: exito });
        this.cargar();
      },
      error: (error: ErrorApi) => {
        this.enviando.set(false);

        if (error.status === 422 && Object.keys(error.errores).length) {
          this.erroresServidor.set(error.errores);
        } else {
          this.errorDialogo.set(error.mensaje);
        }
      },
    });
  }

  private ejecutar(clave: string, accion: Observable<ApiResponse<unknown>>, exito: string): void {
    this.procesando.set(clave);
    this.aviso.set(null);

    accion.subscribe({
      next: () => {
        this.procesando.set(null);
        this.aviso.set({ tipo: 'exito', texto: exito });
        this.cargar();
      },
      error: (error: ErrorApi) => {
        this.procesando.set(null);
        this.aviso.set({ tipo: 'error', texto: error.mensaje });
      },
    });
  }

  private limpiarErroresDialogo(): void {
    this.erroresServidor.set({});
    this.errorDialogo.set(null);
  }

  private cargar(): void {
    this.modulosService.listar().subscribe({
      next: modulos => {
        this.modulos.set(modulos);
        this.cargando.set(false);
        this.errorCarga.set(null);
      },
      error: (error: ErrorApi) => {
        this.cargando.set(false);
        this.errorCarga.set(error.mensaje);
      },
    });
  }
}
