import { InstitutionService } from '../../../core/services/institution/institution.service';
import { DocumentTypeService } from '../../../core/services/document-type/document-type.service';
import { AreaService } from '../../../core/services/area/area.service';
import { PersonSpeakerService } from '../../../core/services/person-speaker/person-speaker.service';
import { PracticeSupervisorService } from '../../../core/services/practice-supervisor/practice-supervisor.service';
import { PracticeService } from '../../../core/services/practice/practice.service';
import { PersonInternService } from '../../../core/services/person-intern/person-intern.service';
import { PersonWorkerService } from '../../../core/services/person-worker/person-worker.service';
import { PersonDocumentService } from '../../../core/services/person-document/person-document.service';
import { PersonService } from '../../../core/services/person/person.service';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { GESTION_CONFIG, GestionCampo } from './gestion-config';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, DestroyRef, inject, input, OnInit, PLATFORM_ID, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, Observable, Subscription } from 'rxjs';
import { DialogoComponent } from '../dialogo/dialogo.component';
import { PageTitleComponent } from '../page-title/page-title.component';

export type GestionRecord = Record<string, unknown>;
export type GestionColumn = { clave: string; etiqueta: string; formato?: 'fecha' | 'booleano' };
export type GestionReadSource = {
  listar(): Observable<readonly GestionRecord[]>;
  obtener(id: number): Observable<GestionRecord>;
  crear?(payload: GestionRecord): Observable<{ message: string }>;
  actualizar?(id: number, payload: GestionRecord): Observable<{ message: string }>;
  eliminar?(id: number): Observable<{ message: string }>;
};

/** Tabla y formularios compartidos de Gestión. */
@Component({
  selector: 'app-gestion-table',
  standalone: true,
  imports: [DialogoComponent, PageTitleComponent, ReactiveFormsModule],
  templateUrl: './gestion-table.component.html',
  styleUrl: './gestion-table.component.scss',
})
export class GestionTableComponent implements OnInit {
  readonly titulo = input.required<string>();
  readonly descripcion = input.required<string>();
  readonly columnas = input.required<readonly GestionColumn[]>();
  readonly clavePrimaria = input.required<string>();
  readonly servicio = input.required<GestionReadSource>();
  readonly embedded = input(false);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly fechas = new DatePipe('en-US');
  private readonly dialogo = viewChild.required(DialogoComponent);
  private consultaDetalle?: Subscription;

  protected readonly registros = signal<readonly GestionRecord[]>([]);
  protected readonly busqueda = signal('');
  protected readonly cargando = signal(false);
  protected readonly errorCarga = signal('');
  protected readonly detalle = signal<GestionRecord | null>(null);
  protected readonly cargandoDetalle = signal(false);
  protected readonly errorDetalle = signal('');
  protected readonly filtrados = computed(() => {
    const terminos = this.normalizar(this.busqueda()).trim().split(/\s+/);
    return this.registros().filter(registro => {
      const texto = this.normalizar(this.columnas().map(columna => this.mostrar(registro, columna)).join(' '));
      return terminos.every(termino => texto.includes(termino));
    });
  });

  protected readonly auth = inject(AuthService);
  protected readonly config = computed(() => GESTION_CONFIG[this.clavePrimaria()]);
  protected readonly modo = signal<'detalle' | 'nuevo' | 'editar' | 'eliminar'>('detalle');
  protected readonly guardando = signal(false);
  protected readonly confirmando = signal(false);
  protected readonly mensaje = signal('');
  protected readonly errorOperacion = signal('');
  protected readonly opcionesRelacion = signal<Record<string, readonly GestionRecord[]>>({});
  protected readonly erroresRelacion = signal<Record<string, string>>({});
  protected readonly cargandoRelaciones = signal(false);
  protected formulario = new FormGroup<Record<string, FormControl>>({});
  private seleccion: GestionRecord | null = null;
  private generacion = 0;
  private readonly catalogos = signal<Record<string, readonly GestionRecord[]>>({});
  private readonly consultasCatalogo = new Set<string>();
  private readonly relaciones: Record<string, GestionReadSource> = {
    'id_persona': inject(PersonService),
    'id_persona_documento': inject(PersonDocumentService),
    'id_persona_trabajador': inject(PersonWorkerService),
    'id_persona_practicante': inject(PersonInternService),
    'id_practica': inject(PracticeService),
    'id_practica_supervisor': inject(PracticeSupervisorService),
    'id_persona_ponente': inject(PersonSpeakerService),
    'id_area': inject(AreaService),
    'id_tipo_documento': inject(DocumentTypeService),
    'id_institucion': inject(InstitutionService),
  };

  protected puede(accion: string): boolean {
    const clave = this.config()?.permisos[accion];
    const ver = this.config()?.permisos['ver'];
    return !!clave && this.auth.tienePermiso(clave)
      && (accion === 'crear' || (!!ver && this.auth.tienePermiso(ver)));
  }

  protected estadoPermisos(): string {
    return ['ver', 'crear', 'editar', 'eliminar'].filter(a => !this.puede(a)).map(a => {
      const clave = this.config()?.permisos[a];
      if (!clave) return `${a}: sin asignación habilitada en Laravel`;
      const lectura = this.config()?.permisos['ver'];
      const faltante = !this.auth.tienePermiso(clave) ? clave : lectura;
      return `${a}: falta el permiso efectivo ${faltante}`;
    }).join('. ');
  }

  protected etiqueta(campo: GestionCampo): string {
    const relaciones: Record<string, string> = { id_persona: 'Persona', id_area: 'Área', id_institucion: 'Institución', id_tipo_documento: 'Tipo de documento', id_persona_practicante: 'Practicante', id_persona_trabajador: 'Trabajador', id_practica: 'Práctica' };
    return relaciones[campo.clave] ?? this.columnas().find(c => c.clave === campo.clave)?.etiqueta ?? campo.clave;
  }

  protected estados(campo: GestionCampo): readonly { etiqueta: string; valor: string | boolean }[] {
    return campo.tipo === 'boolean'
      ? [{ etiqueta: 'Activo', valor: true }, { etiqueta: 'Inactivo', valor: false }]
      : [...new Set([...this.registros().map(registro => registro[campo.clave]), this.seleccion?.[campo.clave]]
        .filter((valor): valor is string => typeof valor === 'string' && valor.trim().length > 0))]
        .map(valor => ({ etiqueta: valor, valor }));
  }

  protected relacionActual(campo: GestionCampo): unknown {
    return this.modo() === 'editar' ? this.seleccion?.[campo.clave] : null;
  }

  protected relacionSinOpcion(campo: GestionCampo): boolean {
    const id = this.relacionActual(campo);
    return id !== null && id !== undefined && !this.opcionesRelacion()[campo.clave]?.some(r => Number(r[campo.clave]) === Number(id));
  }

  protected relacionesInvalidas(): boolean {
    return this.config().campos.some(c => c.relacion && c.obligatorio
      && !this.opcionesRelacion()[c.clave]?.length && !this.relacionActual(c));
  }

  protected columnasDetalle(): readonly GestionColumn[] {
    const columnas = [...this.columnas()];
    for (const clave of Object.keys(this.detalle() ?? {})) {
      if (!columnas.some(c => c.clave === clave)) columnas.push({ clave, etiqueta: clave.replace(/_/g, ' ') });
    }
    return columnas;
  }

  protected nombreRelacion(registro: GestionRecord, clave: string): string {
    const persona = this.catalogos()['id_persona']?.find(p => Number(p['id_persona']) === Number(registro['id_persona']));
    const datosPersona = persona ?? registro;
    const nombre = [datosPersona['nombres'], datosPersona['apellido_paterno'], datosPersona['apellido_materno']].filter(Boolean).join(' ')
      || String(registro['nombre'] ?? registro['nombre_institucion'] ?? registro['codigo'] ?? registro['carrera'] ?? registro['cargo'] ?? 'Registro');
    return `${nombre} (ID ${registro[clave]})`;
  }

  private cargarDescripciones(claves: readonly string[]): void {
    for (const clave of claves) {
      const config = GESTION_CONFIG[clave];
      if (!config || this.consultasCatalogo.has(clave) || !this.auth.tienePermiso(config.permisos['ver'] ?? '')) continue;
      this.consultasCatalogo.add(clave);
      this.relaciones[clave].listar().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: registros => {
          this.catalogos.update(c => ({ ...c, [clave]: registros }));
          if (registros.length) this.cargarDescripciones(config.campos.filter(c => c.relacion).map(c => c.relacion!));
        },
        error: () => { this.consultasCatalogo.delete(clave); },
      });
    }
  }

  protected identificar(registro: GestionRecord): string {
    return this.columnas().filter(c => c.formato !== 'booleano').slice(0, 4).map(c => `${c.etiqueta}: ${this.mostrar(registro, c)}`).join(' - ');
  }

  protected abrirFormulario(modo: 'nuevo' | 'editar', registro?: GestionRecord): void {
    if (this.guardando() || !this.puede(modo === 'nuevo' ? 'crear' : 'editar') || (modo === 'editar' && !registro)) return;
    this.cancelarDetalle();
    this.modo.set(modo);
    this.seleccion = registro ?? null;
    this.mensaje.set('');
    this.errorOperacion.set(''); this.errorDetalle.set(''); this.confirmando.set(false);
    const controles: Record<string, FormControl> = {};
    for (const campo of this.config().campos) {
      const validadores = [];
      if (campo.clave === 'estado' && campo.tipo === 'boolean') validadores.push((control: AbstractControl) =>
        this.estados(campo).some(opcion => opcion.valor === control.value) ? null : { estado: true });
      if (campo.obligatorio && campo.tipo !== 'boolean') validadores.push(Validators.required);
      if (campo.tipo === 'text' && campo.obligatorio) validadores.push(Validators.pattern(/\S/));
      if (campo.maximo) validadores.push(Validators.maxLength(campo.maximo));
      if (campo.tipo === 'number') validadores.push(Validators.min(1), Validators.pattern(/^\d+$/));
      if (campo.tipo === 'date') validadores.push((c: AbstractControl) => {
        if (!c.value) return null;
        const fecha = new Date(`${c.value}T00:00:00Z`);
        return !Number.isNaN(fecha.getTime()) && fecha.toISOString().slice(0, 10) === c.value ? null : { fecha: true };
      });
      controles[campo.clave] = new FormControl(campo.relacion ? null : campo.tipo === 'boolean' ? true : '', validadores);
    }
    this.formulario = new FormGroup(controles, { validators: grupo => {
      const inicio = grupo.get('fecha_inicio')?.value || grupo.get('fecha_ingreso')?.value;
      const fin = grupo.get('fecha_fin')?.value;
      return inicio && fin && fin < inicio ? { ordenFechas: true } : null;
    } });
    this.dialogo().abrir();
    this.cargarRelaciones();
    if (registro) {
      this.cargandoDetalle.set(true);
      this.consultaDetalle = this.servicio().obtener(Number(registro[this.clavePrimaria()])).pipe(
        takeUntilDestroyed(this.destroyRef), finalize(() => this.cargandoDetalle.set(false)),
      ).subscribe({ next: r => {
        this.seleccion = { ...r, [this.clavePrimaria()]: registro[this.clavePrimaria()] };
        for (const campo of this.config().campos) {
          let valor = r[campo.clave] ?? '';
          if (campo.tipo === 'date' && typeof valor === 'string') valor = valor.slice(0, 10);
          this.formulario.controls[campo.clave].setValue(valor);
        }
      }, error: e => this.errorDetalle.set(this.mensajeError(e)) });
    }
  }

  private cargarRelaciones(): void {
    const generacion = ++this.generacion;
    this.opcionesRelacion.set({}); this.erroresRelacion.set({});
    const campos = this.config().campos.filter(c => c.relacion);
    let pendientes = campos.length;
    this.cargandoRelaciones.set(pendientes > 0);
    for (const campo of campos) {
      const clave = campo.relacion!;
      const permiso = GESTION_CONFIG[clave]?.permisos['ver'];
      const terminar = () => { if (generacion === this.generacion && --pendientes === 0) this.cargandoRelaciones.set(false); };
      if (!permiso || !this.auth.tienePermiso(permiso)) {
        this.erroresRelacion.update(e => ({ ...e, [clave]: `No autorizado para consultar este catálogo. Se necesita el permiso efectivo ${permiso ?? 'no configurado'}.` }));
        terminar(); continue;
      }
      this.relaciones[clave].listar().pipe(takeUntilDestroyed(this.destroyRef), finalize(terminar)).subscribe({
        next: r => { if (generacion === this.generacion) this.opcionesRelacion.update(o => ({ ...o, [clave]: r })); },
        error: e => { if (generacion === this.generacion) this.erroresRelacion.update(o => ({ ...o, [clave]: `${this.mensajeError(e)} Permiso de lectura requerido: ${permiso}.` })); },
      });
    }
  }

  protected solicitarEliminar(registro: GestionRecord): void {
    if (!this.puede('eliminar') || this.guardando()) return;
    this.cancelarDetalle(); this.seleccion = registro; this.detalle.set(registro);
    this.mensaje.set('');
    this.modo.set('eliminar'); this.confirmando.set(true); this.errorOperacion.set(''); this.errorDetalle.set('');
    this.dialogo().abrir();
  }

  protected validar(): void {
    this.confirmando.set(false);
    this.formulario.markAllAsTouched();
    this.errorOperacion.set('');
    if (this.formulario.invalid || this.relacionesInvalidas() || this.cargandoDetalle() || this.cargandoRelaciones() || this.errorDetalle()) return;
    const valores = this.formulario.value;
    const inicio = valores['fecha_inicio'] || valores['fecha_ingreso'];
    if (inicio && valores['fecha_fin'] && valores['fecha_fin'] < inicio) {
      this.errorOperacion.set('La fecha final debe ser igual o posterior a la fecha inicial.'); return;
    }
    for (const campo of this.config().campos.filter(c => c.relacion)) {
      const valor = valores[campo.clave];
      const original = this.seleccion?.[campo.clave];
      if (valor !== null && valor !== '' && valor !== undefined && !this.opcionesRelacion()[campo.clave]?.some(r => Number(r[campo.clave]) === Number(valor))) {
        if (this.modo() === 'editar' && Number(original) === Number(valor)) continue;
        this.errorOperacion.set('Selecciona un registro relacionado autorizado.'); return;
      }
    }
    this.confirmando.set(true);
  }

  protected ejecutar(): void {
    if (this.modo() === 'detalle') return;
    const accion = this.modo() === 'nuevo' ? 'crear' : this.modo() === 'editar' ? 'editar' : 'eliminar';
    if (!this.confirmando() || !this.puede(accion) || this.guardando()) return;
    if (accion !== 'eliminar') { this.confirmando.set(false); this.validar(); if (!this.confirmando()) return; }
    const servicio = this.servicio();
    const payload: GestionRecord = {};
    for (const campo of this.config().campos) {
      const valor = this.formulario.controls[campo.clave]?.value;
      payload[campo.clave] = valor === '' || valor === undefined ? null : campo.tipo === 'number' ? Number(valor) : typeof valor === 'string' ? valor.trim() : valor;
    }
    const id = Number(this.seleccion?.[this.clavePrimaria()]);
    if (accion !== 'crear' && (!Number.isSafeInteger(id) || id <= 0)) return;
    const solicitud = accion === 'crear' ? servicio.crear?.(payload) : accion === 'editar' ? servicio.actualizar?.(id, payload) : servicio.eliminar?.(id);
    if (!solicitud) { this.errorOperacion.set('Servicio no disponible.'); return; }
    this.guardando.set(true); this.errorOperacion.set('');
    solicitud.pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.guardando.set(false))).subscribe({
      next: r => { this.mensaje.set(r.message); this.dialogo().cerrar(); this.cargar(); },
      error: e => {
        this.errorOperacion.set(this.mensajeError(e)); this.confirmando.set(false);
        if (e instanceof HttpErrorResponse && e.status === 422) {
          const errores = e.error?.data ?? e.error?.errors;
          if (errores && typeof errores === 'object') {
            for (const [clave, mensajes] of Object.entries(errores)) {
              this.formulario.controls[clave]?.setErrors({ servidor: Array.isArray(mensajes) ? mensajes.join(' ') : String(mensajes) });
            }
          }
        }
      },
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) this.cargar();
  }

  protected cargar(): void {
    if (this.cargando() || !this.puede('ver')) return;
    this.cargando.set(true);
    this.errorCarga.set('');
    this.registros.set([]);
    this.servicio().listar().pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.cargando.set(false)),
    ).subscribe({
      next: registros => {
        this.registros.set(registros);
        if (registros.length) this.cargarDescripciones(this.config().campos.filter(c => c.relacion).map(c => c.relacion!));
      },
      error: error => this.errorCarga.set(this.mensajeError(error)),
    });
  }

  protected ver(registro: GestionRecord): void {
    if (!this.puede('ver') || this.guardando()) return;
    this.cancelarDetalle();
    this.modo.set('detalle');
    this.errorOperacion.set('');
    this.detalle.set(null);
    this.errorDetalle.set('');
    this.dialogo().abrir();
    const id = Number(registro[this.clavePrimaria()]);
    if (!Number.isSafeInteger(id) || id <= 0) {
      this.errorDetalle.set('El registro no tiene un identificador válido para consultar su detalle.');
      return;
    }
    this.cargandoDetalle.set(true);
    this.consultaDetalle = this.servicio().obtener(id).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.cargandoDetalle.set(false)),
    ).subscribe({
      next: detalle => this.detalle.set(detalle),
      error: error => this.errorDetalle.set(this.mensajeError(error)),
    });
  }

  protected cancelarDetalle(): void {
    this.consultaDetalle?.unsubscribe();
  }

  protected mostrar(registro: GestionRecord, columna: GestionColumn): string {
    const valor = registro[columna.clave];
    if (valor === null || valor === undefined || valor === '') return '—';
    if (columna.clave !== this.clavePrimaria() && this.config().campos.some(c => c.clave === columna.clave && c.relacion)) {
      const relacionado = this.catalogos()[columna.clave]?.find(r => Number(r[columna.clave]) === Number(valor));
      if (relacionado) return this.nombreRelacion(relacionado, columna.clave);
    }
    if (columna.formato === 'booleano') return valor === true ? 'Activo' : valor === false ? 'Inactivo' : String(valor);
    if (columna.formato === 'fecha' && typeof valor === 'string' && !Number.isNaN(Date.parse(valor))) {
      return this.fechas.transform(valor, 'dd/MM/yyyy', 'UTC') ?? '—';
    }
    return String(valor);
  }

  private normalizar(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es');
  }

  private mensajeError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 403) return 'No tienes permiso para realizar esta operación. El registro no fue modificado.';
      if (error.status === 401) return 'Tu sesión ha vencido. Inicia sesión nuevamente.';
      if (error.status === 404) return 'No se encontró el recurso solicitado.';
      if (error.status === 409) return error.error?.message || 'No se puede completar la operación: existen registros relacionados.';
      if (error.error?.message && error.status !== 0) return String(error.error.message);
      if (error.status === 0) return 'No se pudo conectar con el servidor. Comprueba la conexión e intenta nuevamente.';
    }
    if (error instanceof Error) return error.message;
    return 'No se pudo consultar la información. Intenta nuevamente con Recargar listado.';
  }
}
