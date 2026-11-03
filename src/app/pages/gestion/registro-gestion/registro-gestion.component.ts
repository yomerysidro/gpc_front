import { afterNextRender, Component, computed, DestroyRef, inject, Injector, input, OnInit, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormRecord, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { finalize, Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { GestionService } from '../../../core/services/gestion/gestion.service';
import {
  GESTION_RECURSOS, GESTION_PERMISOS_LECTURA_CATALOGO, GestionEntidad, GestionError, GestionPayload, GestionRegistro,
} from '../../../core/services/gestion/gestion.models';
import { DialogoComponent } from '../../../shared/components/dialogo/dialogo.component';
import { DialogoConfirmacionComponent } from '../../../shared/components/dialogo-confirmacion/dialogo-confirmacion.component';
import { CampoGestion, GESTION_CONFIG } from '../gestion.config';

type ValorFormulario = string | number | boolean | null;

@Component({
  selector: 'app-registro-gestion',
  standalone: true,
  imports: [ReactiveFormsModule, DialogoComponent, DialogoConfirmacionComponent],
  templateUrl: './registro-gestion.component.html',
  styleUrl: './registro-gestion.component.scss',
})
export class RegistroGestionComponent implements OnInit {
  readonly entidad = input.required<GestionEntidad>();
  protected readonly config = computed(() => GESTION_CONFIG[this.entidad()]);
  protected readonly recurso = computed(() => GESTION_RECURSOS[this.entidad()]);
  private readonly api = inject(GestionService);
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);
  private readonly editor = viewChild.required<DialogoComponent>('editor');
  private readonly confirmacion = viewChild.required(DialogoConfirmacionComponent);
  private cargaLista?: Subscription;
  private consultaDetalle?: Subscription;
  private destruido = false;

  protected readonly registros = signal<GestionRegistro[]>([]);
  protected readonly relaciones = signal<Partial<Record<GestionEntidad, GestionRegistro[]>>>({});
  protected readonly erroresRelacion = signal<Partial<Record<GestionEntidad, string>>>({});
  protected readonly cargandoRelaciones = signal(0);
  protected readonly cargando = signal(false);
  protected readonly listaCargada = signal(false);
  protected readonly guardando = signal(false);
  protected readonly eliminando = signal(false);
  protected readonly cargandoDetalle = signal(false);
  protected readonly detalleDisponible = signal(false);
  protected readonly errorCarga = signal('');
  protected readonly errorOperacion = signal('');
  protected readonly errorFormulario = signal('');
  protected readonly erroresServidor = signal<Record<string, string[]>>({});
  protected readonly aviso = signal('');
  protected readonly busqueda = signal('');
  protected readonly pagina = signal(1);
  protected readonly tamanoPagina = 10;
  protected readonly modo = signal<'nuevo' | 'editar' | 'detalle'>('nuevo');
  protected readonly seleccionado = signal<GestionRegistro | null>(null);
  protected readonly porEliminar = signal<GestionRegistro | null>(null);
  protected readonly formulario = new FormRecord<FormControl<ValorFormulario>>({});

  protected readonly avisoAutorizacion = computed(() => {
    const permiso = this.recurso().permiso;
    if (!permiso) {
      return GESTION_PERMISOS_LECTURA_CATALOGO.some(clave => this.auth.tienePermiso(clave))
        ? 'Consulta de catálogo habilitada por tu módulo. La creación, edición y eliminación de este catálogo requieren una configuración de permisos de escritura en el backend.'
        : `Para consultar ${this.config().titulo}, tu rol necesita ${GESTION_PERMISOS_LECTURA_CATALOGO.join(' o ')} y acceso al módulo correspondiente.`;
    }
    return this.auth.tienePermiso(`${permiso}.ver`) ? ''
      : `Tu rol necesita el permiso ${permiso}.ver y acceso a su módulo para consultar esta página.`;
  });
  protected readonly problemasRelacion = computed(() => Object.entries(this.erroresRelacion())
    .map(([entidad, mensaje]) => ({ entidad: entidad as GestionEntidad, titulo: GESTION_CONFIG[entidad as GestionEntidad].titulo, mensaje })));
  protected readonly relacionesRequeridasIncompletas = computed(() => this.config().campos
    .filter(campo => campo.relacion && campo.requerido)
    .some(campo => !this.relaciones()[campo.relacion!]?.length));
  protected readonly filtrados = computed(() => {
    const texto = this.normalizar(this.busqueda().trim());
    return this.registros().filter(registro => !texto || this.config().columnas
      .some(columna => this.normalizar(this.valor(registro, columna.key)).includes(texto)));
  });
  protected readonly totalPaginas = computed(() => Math.max(1, Math.ceil(this.filtrados().length / this.tamanoPagina)));
  protected readonly paginaActual = computed(() => Math.min(this.pagina(), this.totalPaginas()));
  protected readonly visibles = computed(() => this.filtrados().slice(
    (this.paginaActual() - 1) * this.tamanoPagina, this.paginaActual() * this.tamanoPagina));

  constructor() {
    this.destroyRef.onDestroy(() => this.destruido = true);
  }

  ngOnInit(): void {
    for (const campo of this.config().campos) {
      const validadores: ValidatorFn[] = [];
      if (campo.requerido) {
        validadores.push(Validators.required);
        if (!campo.tipo || campo.tipo === 'texto') {
          validadores.push(control => typeof control.value === 'string' && !control.value.trim() ? { required: true } : null);
        }
      }
      if (campo.max) validadores.push(Validators.maxLength(campo.max));
      this.formulario.addControl(campo.key, new FormControl<ValorFormulario>(null, validadores));
    }
    this.formulario.addValidators(() => {
      for (const campo of this.config().campos) {
        if (!campo.despuesDe) continue;
        const fin = this.formulario.controls[campo.key]?.value;
        const inicio = this.formulario.controls[campo.despuesDe]?.value;
        if (fin && inicio && String(fin) < String(inicio)) return { fechas: true };
      }
      return null;
    });
    // Registrar después de recibir entidad; no consultar datos privados durante SSR.
    afterNextRender(() => this.recargar(), { injector: this.injector });
  }

  protected permitido(accion: 'crear' | 'editar' | 'eliminar'): boolean {
    const permiso = this.recurso().permiso;
    return !!permiso && this.auth.tienePermiso(`${permiso}.ver`) && this.auth.tienePermiso(`${permiso}.${accion}`);
  }

  protected recargar(): void {
    if (this.guardando() || this.eliminando()) return;
    this.cargaLista?.unsubscribe();
    this.cargando.set(true);
    this.listaCargada.set(false);
    this.errorCarga.set('');
    this.cargaLista = this.api.listar(this.entidad()).pipe(
      takeUntilDestroyed(this.destroyRef), finalize(() => this.cargando.set(false)),
    ).subscribe({
      next: registros => {
        this.registros.set(registros);
        this.listaCargada.set(true);
      },
      error: (error: GestionError) => {
        this.errorCarga.set(this.mensaje(error, this.entidad(), 'ver'));
      },
    });
    if (!this.cargandoRelaciones()) this.cargarRelaciones();
  }

  private cargarRelaciones(): void {
    const entidades = new Set<GestionEntidad>([
      ...this.config().campos.flatMap(campo => campo.relacion ? [campo.relacion] : []),
      ...(this.config().relacionados ?? []),
    ]);
    this.relaciones.set({});
    this.erroresRelacion.set({});
    this.cargandoRelaciones.set(entidades.size);
    for (const entidad of entidades) {
      this.api.listar(entidad).pipe(takeUntilDestroyed(this.destroyRef),
        finalize(() => this.cargandoRelaciones.update(total => total - 1)),
      ).subscribe({
        next: registros => this.relaciones.update(actual => ({ ...actual, [entidad]: registros })),
        error: (error: GestionError) => this.erroresRelacion.update(actual => ({
          ...actual, [entidad]: this.mensaje(error, entidad, 'ver'),
        })),
      });
    }
  }

  protected buscar(texto: string): void {
    this.busqueda.set(texto);
    this.pagina.set(1);
  }

  protected id(registro: GestionRegistro): number {
    return Number(registro[this.recurso().id]);
  }

  protected nombre(registro: GestionRegistro): string {
    return this.etiqueta(this.entidad(), registro);
  }

  protected opciones(campo: CampoGestion): GestionRegistro[] {
    return campo.relacion ? this.relaciones()[campo.relacion] ?? [] : [];
  }

  protected idRelacion(campo: CampoGestion, registro: GestionRegistro): number {
    return Number(registro[GESTION_RECURSOS[campo.relacion!].id]);
  }

  protected etiqueta(entidad: GestionEntidad, registro: GestionRegistro): string {
    switch (entidad) {
      case 'persona': return [registro['nombres'], registro['apellido_paterno'], registro['apellido_materno']].filter(Boolean).join(' ');
      case 'persona_trabajador': return `${this.relacion('persona', registro['id_persona'])} · ${registro['cargo'] ?? 'Sin cargo'}`;
      case 'persona_practicante': return `${this.relacion('persona', registro['id_persona'])} · ${registro['codigo'] ?? 'Sin código'}`;
      case 'practica': return `${registro['carrera'] ?? 'Práctica'} · ${this.relacion('persona_practicante', registro['id_persona_practicante'])} · ${registro['fecha_inicio'] ?? ''}`;
      case 'persona_ponente': return this.relacion('persona', registro['id_persona']);
      case 'persona_documento': return `${this.relacion('tipo_documento', registro['id_tipo_documento'])} ${registro['numero_documento'] ?? ''}`;
      case 'practica_supervisor': return `${this.relacion('persona_trabajador', registro['id_persona_trabajador'])} · ${registro['tipo_supervision'] ?? ''}`;
      case 'institucion': return String(registro['nombre_institucion'] ?? 'Sin nombre');
      default: return String(registro['nombre'] ?? 'Sin nombre');
    }
  }

  protected relacion(entidad: GestionEntidad, id: ValorFormulario | undefined): string {
    if (id === null || id === undefined || id === '') return 'Sin asignar';
    const referencia = `${GESTION_CONFIG[entidad].singular} #${id}`;
    if (this.erroresRelacion()[entidad]) return `${referencia} (no se pudo cargar la lista)`;
    const registros = this.relaciones()[entidad];
    if (!registros) return `${referencia} (cargando lista)`;
    if (!registros.length) return `${referencia} (lista cargada sin registros)`;
    const registro = registros.find(item => String(item[GESTION_RECURSOS[entidad].id]) === String(id));
    return registro ? this.etiqueta(entidad, registro) : `${referencia} (registro no encontrado en la lista)`;
  }

  protected estadoRelacion(campo: CampoGestion): string {
    if (!campo.relacion) return '';
    const error = this.erroresRelacion()[campo.relacion];
    if (error) return `No se pudo cargar esta lista. ${error}`;
    const registros = this.relaciones()[campo.relacion];
    if (!registros) return 'Cargando lista relacionada…';
    if (!registros.length) return 'La lista se cargó correctamente, pero no contiene registros.';
    return '';
  }

  protected valor(registro: GestionRegistro, key: string): string {
    if (key === 'nombre_completo') return this.etiqueta('persona', registro);
    if (key === 'documentos') {
      if (this.erroresRelacion()['persona_documento']) return 'Documentos no disponibles';
      if (!this.relaciones()['persona_documento']) return 'Cargando documentos…';
      const documentos = this.relaciones()['persona_documento']!.filter(doc => String(doc['id_persona']) === String(registro['id_persona']));
      return documentos.length ? documentos.map(doc => this.etiqueta('persona_documento', doc)).join(' · ') : 'Sin documentos registrados';
    }
    const campo = this.config().campos.find(item => item.key === key);
    if (campo?.relacion) return this.relacion(campo.relacion, registro[key]);
    if (campo?.tipo === 'booleano') return this.esVerdadero(registro[key]) ? 'Activo' : 'Inactivo';
    const valor = registro[key];
    if (valor === null || valor === undefined || valor === '') return 'Sin registrar';
    if (campo?.tipo === 'fecha') {
      const fecha = String(valor).slice(0, 10).split('-');
      return fecha.length === 3 ? fecha.reverse().join('/') : String(valor);
    }
    return String(valor);
  }

  protected nuevo(): void {
    if (this.guardando() || !this.permitido('crear') || this.relacionesRequeridasIncompletas()) return;
    this.modo.set('nuevo');
    this.detalleDisponible.set(true);
    this.seleccionado.set(null);
    this.limpiarErrores();
    this.formulario.enable();
    this.formulario.reset();
    for (const campo of this.config().campos) {
      this.formulario.controls[campo.key].setValue(campo.tipo === 'booleano' ? true : '');
    }
    this.editor().abrir();
  }

  protected abrir(registro: GestionRegistro, modo: 'editar' | 'detalle'): void {
    if (this.guardando()) return;
    if (modo === 'editar' && !this.permitido('editar')) return;
    this.modo.set(modo);
    this.seleccionado.set(registro);
    this.limpiarErrores();
    this.consultaDetalle?.unsubscribe();
    this.detalleDisponible.set(false);
    this.cargandoDetalle.set(true);
    this.editor().abrir();
    this.consultaDetalle = this.api.obtener(this.entidad(), this.id(registro)).pipe(
      takeUntilDestroyed(this.destroyRef), finalize(() => this.cargandoDetalle.set(false)),
    ).subscribe({
      next: detalle => {
        this.detalleDisponible.set(true);
        this.seleccionado.set(detalle);
        this.formulario.enable();
        this.formulario.reset();
        for (const campo of this.config().campos) {
          const valor = detalle[campo.key];
          this.formulario.controls[campo.key].setValue(campo.tipo === 'booleano' ? this.esVerdadero(valor)
            : campo.tipo === 'fecha' && valor ? String(valor).slice(0, 10) : valor ?? '');
        }
      },
      error: (error: GestionError) => this.errorFormulario.set(this.mensaje(error, this.entidad(), 'ver')),
    });
  }

  protected guardar(): void {
    if (this.guardando() || this.cargandoDetalle() || !this.detalleDisponible() || this.modo() === 'detalle' || this.relacionesRequeridasIncompletas()) return;
    const accion = this.modo() === 'nuevo' ? 'crear' : 'editar';
    if (!this.permitido(accion)) return;
    this.formulario.markAllAsTouched();
    this.limpiarErrores();
    if (this.formulario.invalid) {
      this.errorFormulario.set('Revisa los campos marcados antes de guardar.');
      return;
    }
    const payload: GestionPayload = {};
    for (const campo of this.config().campos) {
      const valor = this.formulario.controls[campo.key].value;
      payload[campo.key] = valor === '' || valor === null ? null
        : campo.tipo === 'relacion' ? Number(valor)
          : typeof valor === 'string' ? valor.trim() || null : valor;
    }
    const peticion = accion === 'crear' ? this.api.crear(this.entidad(), payload)
      : this.api.actualizar(this.entidad(), this.id(this.seleccionado()!), payload);
    this.guardando.set(true);
    this.formulario.disable();
    peticion.pipe(takeUntilDestroyed(this.destroyRef), finalize(() => {
      this.guardando.set(false);
      this.formulario.enable();
    })).subscribe({
      next: respuesta => {
        if (!respuesta.success) {
          this.errorFormulario.set(respuesta.message);
          return;
        }
        this.editor().cerrar();
        this.aviso.set(respuesta.message);
        // finalize corre después de next; liberar la carga antes de refrescar.
        this.guardando.set(false);
        this.recargar();
      },
      error: (error: GestionError) => {
        this.errorFormulario.set(this.mensaje(error, this.entidad(), accion));
        this.erroresServidor.set(error.campos);
      },
    });
  }

  protected async pedirEliminar(registro: GestionRegistro): Promise<void> {
    if (!this.permitido('eliminar') || this.eliminando()) return;
    this.porEliminar.set(registro);
    if (!await this.confirmacion().abrir() || this.destruido) return;
    this.eliminando.set(true);
    this.aviso.set('');
    this.errorOperacion.set('');
    this.api.eliminar(this.entidad(), this.id(registro)).pipe(
      takeUntilDestroyed(this.destroyRef), finalize(() => this.eliminando.set(false)),
    ).subscribe({
      next: respuesta => {
        if (!respuesta.success) {
          this.errorOperacion.set(respuesta.message);
          return;
        }
        this.aviso.set(respuesta.message);
        this.eliminando.set(false);
        this.recargar();
      },
      error: (error: GestionError) => this.errorOperacion.set(this.mensaje(error, this.entidad(), 'eliminar')),
    });
  }

  protected cerrarEditor(): void {
    if (!this.guardando()) this.editor().cerrar();
  }

  protected alCerrarEditor(): void {
    this.consultaDetalle?.unsubscribe();
  }

  protected errorCampo(campo: CampoGestion): string {
    const servidor = this.erroresServidor()[campo.key];
    if (servidor?.length) return servidor.join(' ');
    const control = this.formulario.controls[campo.key];
    if (!control?.touched) return '';
    if (control.hasError('required')) return `${campo.label} es obligatorio.`;
    if (control.hasError('maxlength')) return `Usa como máximo ${campo.max} caracteres.`;
    if (campo.despuesDe && this.formulario.hasError('fechas')) return 'La fecha de fin debe ser igual o posterior a la fecha de inicio.';
    return '';
  }

  protected relacionNoSeleccionable(campo: CampoGestion): boolean {
    const valor = this.formulario.controls[campo.key]?.value;
    return valor !== '' && valor !== null && valor !== undefined
      && !this.opciones(campo).some(registro => String(this.idRelacion(campo, registro)) === String(valor));
  }

  private limpiarErrores(): void {
    this.errorFormulario.set('');
    this.erroresServidor.set({});
  }

  private mensaje(error: GestionError, entidad: GestionEntidad, accion: string): string {
    const endpoint = `${GESTION_RECURSOS[entidad].endpoint}/list`;
    if (error.status !== 403) return `${error.mensaje} (${accion === 'ver' ? endpoint : GESTION_RECURSOS[entidad].endpoint}, ${error.status ? 'HTTP ' + error.status : 'sin respuesta HTTP'})`;
    const permiso = GESTION_RECURSOS[entidad].permiso;
    return permiso ? `Acceso denegado. Solicita al administrador el permiso ${permiso}.${accion} y acceso a su módulo.`
      : accion === 'ver'
        ? `Acceso denegado (HTTP 403, ${endpoint}). La lectura de ${GESTION_CONFIG[entidad].titulo} requiere ${GESTION_PERMISOS_LECTURA_CATALOGO.join(' o ')}. Si tu rol ya tiene uno, comprueba que el backend incluya la corrección de autorización de catálogos.`
        : 'Acceso denegado (HTTP 403). Este catálogo no tiene permisos de escritura configurados.';
  }

  private normalizar(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es');
  }

  private esVerdadero(valor: ValorFormulario | undefined): boolean {
    return valor === true || valor === 1 || valor === '1' || valor === 'true';
  }
}
