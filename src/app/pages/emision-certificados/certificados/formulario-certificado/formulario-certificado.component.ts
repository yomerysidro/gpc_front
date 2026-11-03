import { afterNextRender, Component, DestroyRef, computed, inject, input, output, signal } from '@angular/core';
import { SeleccionCertificado } from '../../../../core/interfaces/emision-certificados/preparacion-documental.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, FormControl, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { PersonService } from '../../../../core/services/person/person.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, forkJoin, map, Observable, of, Subscription } from 'rxjs';
import { ErrorApi } from '../../../../core/interfaces/api/api-response.interface';
import { CertificadoRow, PayloadEmision, TipoCertificado } from '../../../../core/interfaces/emision-certificados/emision-certificados.interface';
import { AuthService } from '../../../../core/services/autenticacion/auth.service';
import { EmisionCertificadosService } from '../../../../core/services/emision-certificados/emision-certificados.service';
import { PageTitleComponent } from '../../../../shared/components/page-title/page-title.component';
import { estadoActivo } from '../../compartidos/estado-emision';
import { BLOQUEO_ESCRITURA_EMISION, ESCRITURA_EMISION_AUTORIZADA } from '../../../../core/services/emision-certificados/operaciones-emision';

type Origen = 'participacion' | 'practica' | 'reconocimiento';
type FilaRelacion = Readonly<Record<string, string | number | boolean | null>>;
interface OpcionRegistro { readonly id: number; readonly titulo: string; readonly idPersona: number | null }

function fechaCalendario(control: AbstractControl): ValidationErrors | null {
  const valor = String(control.value ?? '');
  if (!valor) return null;
  const fecha = new Date(valor);
  return /^\d{4}-\d{2}-\d{2}$/.test(valor) && !Number.isNaN(fecha.getTime())
    && fecha.toISOString().slice(0, 10) === valor ? null : { fechaInvalida: true };
}

@Component({
  selector: 'app-formulario-certificado', standalone: true,
  imports: [ReactiveFormsModule, RouterLink, PageTitleComponent],
  templateUrl: './formulario-certificado.component.html', styleUrls: ['../../compartidos/emision.scss', './formulario-certificado.component.scss'],
})
export class FormularioCertificadoComponent {
  readonly integrado = input(false);
  readonly paso = input(1);
  readonly cambioPaso = output<number>();
  readonly preparado = output<SeleccionCertificado>();
  readonly cancelado = output<void>();
  readonly falloGuardado = output<string>();
  puedeGuardarPreparacion(): boolean { return this.escrituraAutorizada && this.revision() && !this.guardando() && this.formulario.valid; }
  protected readonly escrituraAutorizada = inject(ESCRITURA_EMISION_AUTORIZADA);
  protected readonly bloqueoEscritura = BLOQUEO_ESCRITURA_EMISION;
  private readonly api = inject(EmisionCertificadosService);
  private readonly personas = inject(PersonService);
  protected readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  protected readonly editarId = Number(this.route.snapshot.queryParamMap.get('editar') ?? this.route.snapshot.paramMap.get('id')) || null;
  private certificadoOriginal: CertificadoRow | null = null;
  private registroEditarPendiente: number | null = null;
  private cargaOrigen?: Subscription;
  private cargaPersona?: Subscription;
  protected readonly comprobando = signal(false);
  protected readonly busquedaBeneficiario = new FormControl('', { nonNullable: true });
  protected readonly buscandoPersonas = signal(false);
  protected readonly nombresOrigen = signal<ReadonlyMap<number, string>>(new Map());
  private readonly idsEncontrados = signal<ReadonlySet<number> | null>(null);
  protected readonly opcionesVisibles = computed(() => this.opciones().filter(opcion => !this.idsEncontrados() || this.idsEncontrados()?.has(opcion.idPersona ?? 0)));
  readonly formulario = this.fb.nonNullable.group({
    origen: this.fb.nonNullable.control<Origen | ''>('', Validators.required),
    registro: this.fb.control<number | null>(null, Validators.required),
    tipo: this.fb.control<number | null>(null, Validators.required),
    fechaEmision: this.fb.nonNullable.control('', fechaCalendario),
    estado: this.fb.nonNullable.control(true),
  });
  protected readonly tipos = signal<readonly TipoCertificado[]>([]);
  protected readonly opciones = signal<readonly OpcionRegistro[]>([]);
  protected readonly beneficiario = signal<string | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly erroresValidacion = signal<Readonly<Record<string, readonly string[]>>>({});
  protected readonly cargando = signal(false);
  protected readonly cargandoOrigen = signal(false);
  protected readonly guardando = signal(false);
  protected readonly revision = signal(false);
  protected readonly accesible = computed(() => this.auth.tienePermiso(this.editarId ? 'emision.editar' : 'emision.crear'));

  constructor() {
    this.formulario.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.revision.set(false));
    afterNextRender(() => this.inicializar());
  }

  private inicializar(): void {
    this.cargando.set(true);
    this.auth.cargarSesion().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: autenticado => {
        if (!autenticado) { this.error.set('No se pudo confirmar tu sesión. Vuelve a iniciar sesión e inténtalo otra vez.'); this.cargando.set(false); return; }
        const permiso = this.editarId ? 'emision.editar' : 'emision.crear';
        if (!this.auth.tienePermiso(permiso)) {
          this.error.set(`Tu sesión no incluye el permiso institucional ${permiso}. Solicita que asignen este permiso al rol correspondiente en Roles y Permisos.`);
          this.cargando.set(false); return;
        }
        this.cargarCatalogos();
      },
      error: () => { this.error.set('No se pudo cargar la sesión institucional.'); this.cargando.set(false); },
    });
  }

  private cargarCatalogos(): void {
    this.cargando.set(true);
    this.api.listarTodos('tipos-certificado').pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: tipos => { this.tipos.set(tipos.filter(tipo => estadoActivo(tipo.estado))); this.cargando.set(false); },
      error: (error: ErrorApi) => { this.error.set(error.mensaje); this.cargando.set(false); },
    });
    this.formulario.controls.origen.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(origen => this.cargarOrigen(origen));
    this.formulario.controls.registro.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(id => this.resolverBeneficiario(id));
    if (this.editarId) this.cargarCertificadoParaEditar(this.editarId);
  }

  private cargarCertificadoParaEditar(id: number): void {
    this.cargando.set(true);
    this.api.obtener('certificados', id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: certificado => {
        this.certificadoOriginal = certificado;
        const origen: Origen | '' = certificado.id_participacion ? 'participacion' : certificado.id_practica ? 'practica' : certificado.id_reconocimiento ? 'reconocimiento' : '';
        this.registroEditarPendiente = certificado.id_participacion ?? certificado.id_practica ?? certificado.id_reconocimiento;
        this.formulario.patchValue({ tipo: certificado.id_tipo_certificado, fechaEmision: certificado.fecha_emision ?? '', estado: estadoActivo(certificado.estado), origen });
        this.cargando.set(false);
      },
      error: (error: ErrorApi) => { this.error.set(error.mensaje); this.cargando.set(false); },
    });
  }

  private cargarOrigen(origen: Origen | ''): void {
    this.idsEncontrados.set(null); this.busquedaBeneficiario.reset(); this.nombresOrigen.set(new Map());
    this.cargaOrigen?.unsubscribe(); this.cargaPersona?.unsubscribe(); this.cargandoOrigen.set(false); this.registroEditarPendiente = this.certificadoOriginal && !this.opciones().length ? this.registroEditarPendiente : null;
    this.formulario.controls.registro.reset(null); this.opciones.set([]); this.beneficiario.set(null); this.error.set(null);
    if (!origen) return;
    const permiso = origen === 'participacion' ? 'participantes.ver' : origen === 'practica' ? 'practicantes.ver' : 'reconocimientos.ver';
    if (!this.auth.tienePermiso(permiso)) {
      this.error.set(`No tienes el permiso ${permiso} para consultar registros de este origen.`); return;
    }
    this.cargandoOrigen.set(true);
    const llamada: Observable<readonly FilaRelacion[]> = origen === 'participacion'
      ? this.api.relacionRegistros('participation')
      : origen === 'practica'
        ? this.api.relacionRegistros('practices/list')
        : this.api.listarTodos('reconocimientos');
    this.cargaOrigen = forkJoin({
      registros: llamada.pipe(catchError((error: ErrorApi) => { this.error.set(error.mensaje); return of(null); })),
      practicantes: origen === 'practica' && this.auth.tienePermiso('practicantes.ver')
        ? this.api.relacionRegistros('practicing-individuals/list').pipe(catchError((error: ErrorApi) => { this.error.set(error.mensaje); return of(null); })) : of([] as readonly FilaRelacion[]),
      trabajadores: origen === 'reconocimiento' && this.auth.tienePermiso('ponentes-firmantes.ver')
        ? this.api.relacionRegistros('person-workers/list').pipe(catchError((error: ErrorApi) => { this.error.set(error.mensaje); return of(null); })) : of([] as readonly FilaRelacion[]),
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(({ registros, practicantes, trabajadores }) => {
      if (!registros) { this.cargandoOrigen.set(false); return; }
      if (origen === 'practica' && !practicantes || origen === 'reconocimiento' && !trabajadores) { this.cargandoOrigen.set(false); return; }
      const filas: readonly FilaRelacion[] = registros;
      const personaPracticante = new Map<number, number>();
      for (const fila of practicantes ?? []) personaPracticante.set(Number(fila['id_persona_practicante']), Number(fila['id_persona']));
      const personaTrabajador = new Map<number, number>();
      for (const fila of trabajadores ?? []) personaTrabajador.set(Number(fila['id_persona_trabajador']), Number(fila['id_persona']));
      const opciones: OpcionRegistro[] = [];
      for (const fila of filas) {
        const id = Number(fila[`id_${origen}`]);
        const idPersona = origen === 'participacion' ? Number(fila['id_persona'])
          : origen === 'practica' ? personaPracticante.get(Number(fila['id_persona_practicante'])) ?? null
            : personaTrabajador.get(Number(fila['id_persona_trabajador'])) ?? null;
        if (!Number.isSafeInteger(id) || id <= 0 || !Number.isSafeInteger(idPersona) || (idPersona ?? 0) <= 0) continue;
        const titulo = origen === 'practica' ? String(fila['carrera'] ?? `Práctica #${id}`)
          : origen === 'reconocimiento' ? String(fila['titulo'] ?? `Reconocimiento #${id}`)
            : `Participación #${id} · Actividad #${fila['id_actividad'] ?? 'no disponible'}`;
        opciones.push({ id, titulo, idPersona });
      }
      this.opciones.set(opciones); this.cargandoOrigen.set(false);
      if (this.registroEditarPendiente !== null && opciones.some(opcion => opcion.id === this.registroEditarPendiente)) {
        this.formulario.controls.registro.setValue(this.registroEditarPendiente);
        this.registroEditarPendiente = null;
      }
      if (!opciones.length && !this.error()) this.error.set('No hay registros disponibles cuyo beneficiario pueda verificarse con tus permisos.');
    });
  }

  private resolverBeneficiario(id: number | null): void {
    this.cargaPersona?.unsubscribe(); this.beneficiario.set(null);
    const fila = this.opciones().find(opcion => opcion.id === Number(id));
    if (!fila?.idPersona) return;
    this.cargaPersona = this.api.personaReconocimiento(fila.idPersona).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: persona => this.beneficiario.set([persona.nombres, persona.apellido_paterno, persona.apellido_materno].filter(Boolean).join(' ')),
      error: (error: ErrorApi) => this.error.set('No se pudo verificar la persona beneficiaria: ' + error.mensaje),
    });
  }
  protected buscarBeneficiario(): void {
    const texto = this.busquedaBeneficiario.value.trim().toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (!texto) { this.idsEncontrados.set(null); return; }
    if (!this.auth.tienePermiso('personas.verpersonas') || this.buscandoPersonas()) return;
    this.buscandoPersonas.set(true);
    this.personas.listar().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: personas => {
        const nombres = new Map(personas.map(persona => [persona.id_persona, [persona.nombres, persona.apellido_paterno, persona.apellido_materno].filter(Boolean).join(' ')]));
        this.nombresOrigen.set(nombres);
        this.idsEncontrados.set(new Set([...nombres].filter(([, nombre]) => nombre.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(texto)).map(([id]) => id)));
        this.buscandoPersonas.set(false);
      }, error: () => { this.error.set('No se pudo consultar el catálogo autorizado de personas. Revisa tu conexión y permisos.'); this.buscandoPersonas.set(false); },
    });
  }

  protected prepararRevision(): void {
    if (this.comprobando() || this.cargando() || this.cargandoOrigen()) return;
    this.error.set(null); this.formulario.markAllAsTouched();
    const registro = this.opciones().find(opcion => opcion.id === this.formulario.controls.registro.value);
    if (this.formulario.invalid || !registro || !registro.idPersona || !this.tipos().some(tipo => tipo.id_tipo_certificado === this.formulario.controls.tipo.value)) {
      this.error.set('Completa los campos requeridos y selecciona un registro y tipo existentes.'); return;
    }
    if (!this.beneficiario()) { this.error.set('No se puede verificar el beneficiario con los permisos disponibles.'); return; }
    const valores = this.formulario.getRawValue();
    this.comprobando.set(true);
    this.api.listarTodos('certificados', { id_persona: registro.idPersona, id_tipo_certificado: valores.tipo,
      [`id_${valores.origen}`]: registro.id }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: certificados => {
        this.comprobando.set(false);
        if (JSON.stringify(valores) !== JSON.stringify(this.formulario.getRawValue())) return;
        const existente = certificados.find(certificado => certificado.id_certificado !== this.editarId);
        if (this.integrado() && existente) {
          this.preparado.emit({ registro: existente, beneficiario: this.beneficiario()!, tipo: this.nombreTipo(existente.id_tipo_certificado), dni: null });
          return;
        }
        if (certificados.some(certificado => certificado.id_certificado !== this.editarId)) {
          this.error.set('Ya existe un certificado para este beneficiario, tipo y origen. Consulta su detalle para gestionar el documento.'); return;
        }
        // Si el usuario cambió la selección durante la consulta, exige revisar de nuevo.
        if (JSON.stringify(valores) === JSON.stringify(this.formulario.getRawValue())) {
          this.revision.set(true);
          if (this.integrado()) this.preparado.emit({
            registro: { id_certificado: this.editarId, ...this.payloadPreparacion()! },
            beneficiario: this.beneficiario()!, tipo: this.nombreTipo(valores.tipo), dni: null,
          });
        }
      },
      error: (error: ErrorApi) => { this.comprobando.set(false); this.error.set(error.mensaje); },
    });
  }

  guardar(): void {
    if (!this.escrituraAutorizada || !this.revision() || this.guardando() || !this.accesible() || this.formulario.invalid || !this.beneficiario()) return;
    const payload = this.payloadPreparacion();
    if (!payload || !this.tipos().some(item => item.id_tipo_certificado === payload.id_tipo_certificado)) return;
    this.guardando.set(true); this.error.set(null); this.erroresValidacion.set({});
    const guardado = this.editarId ? this.api.actualizar('certificados', this.editarId, payload) : this.api.crear('certificados', payload);
    guardado.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: creado => {
        this.guardando.set(false);
        this.revision.set(false);
        if (this.integrado()) {
          this.certificadoOriginal = creado;
          this.preparado.emit({ registro: creado, beneficiario: this.beneficiario()!, tipo: this.nombreTipo(creado.id_tipo_certificado), dni: null });
        } else void this.router.navigate(['/certificaciones/certificados', creado.id_certificado]);
      },
      error: (error: ErrorApi) => { this.guardando.set(false); this.error.set(error.mensaje); this.erroresValidacion.set(error.errores); this.revision.set(false); this.falloGuardado.emit(error.mensaje); },
    });
  }

  protected cancelar(): void { if (this.integrado()) this.cancelado.emit(); else void this.router.navigateByUrl('/certificaciones/generar-emitir'); }
  protected siguienteOrigen(): void {
    this.formulario.controls.origen.markAsTouched(); this.formulario.controls.registro.markAsTouched();
    if (this.cargando() || this.cargandoOrigen() || !this.beneficiario() || !this.opciones().some(item => item.id === this.formulario.controls.registro.value)) {
      this.error.set('Selecciona un origen y un registro con beneficiario verificado.'); return;
    }
    this.cambioPaso.emit(2);
  }
  private payloadPreparacion(): PayloadEmision['certificados'] | null {
    const { origen, registro, tipo, fechaEmision, estado } = this.formulario.getRawValue();
    const persona = this.opciones().find(item => item.id === registro)?.idPersona;
    if (!persona || !tipo || !origen) return null;
    return { id_persona: persona, id_tipo_certificado: tipo, id_participacion: origen === 'participacion' ? registro : null,
      id_practica: origen === 'practica' ? registro : null, id_reconocimiento: origen === 'reconocimiento' ? registro : null,
      fecha_emision: fechaEmision || null, estado, notificado: this.certificadoOriginal?.notificado ?? false,
      fecha_notificacion: this.certificadoOriginal?.fecha_notificacion ?? null };
  }
  protected nombreTipo(id: number | null): string { return this.tipos().find(tipo => tipo.id_tipo_certificado === id)?.nombre_tipo ?? '—'; }
  protected nombreOrigen(origen: Origen | ''): string { return origen ? ({ participacion: 'Participación', practica: 'Práctica', reconocimiento: 'Reconocimiento' } as const)[origen] : '—'; }
  protected tituloSeleccionado(): string { return this.opciones().find(opcion => opcion.id === this.formulario.controls.registro.value)?.titulo ?? '—'; }
  protected volverEditar(): void { this.revision.set(false); }
  protected mensajesValidacion(): readonly string[] { return Object.values(this.erroresValidacion()).flat(); }
}
