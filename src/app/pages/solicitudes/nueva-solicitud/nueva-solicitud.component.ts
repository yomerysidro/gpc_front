import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { distinctUntilChanged, map, Subscription } from 'rxjs';
import { ContextoSolicitud, DatosSolicitud, Solicitud } from '../../../core/interfaces/solicitudes/solicitud.interface';
import { SolicitudesService, mensajeSolicitudes } from '../../../core/services/solicitudes/solicitudes.service';
import { EmisionCertificadosService } from '../../../core/services/emision-certificados/emision-certificados.service';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { AreaService } from '../../../core/services/area/area.service';
import { LIMITES_SOLICITUD } from '../../../core/interfaces/solicitudes/activity-requests-api.interface';
import { PageTitleComponent } from '../../../shared/components/page-title/page-title.component';
import { IntegracionAvisoComponent } from '../compartidos/integracion-aviso.component';
import { SolicitudDetalleComponent } from '../compartidos/solicitud-detalle.component';

/** Fechas Y-m-d y orden exigidos por ActivityRequestWorkflow. */
export function fechasSolicitud(control: AbstractControl): ValidationErrors | null {
  const inicio: unknown = control.get('inicio')?.value;
  const fin: unknown = control.get('fin')?.value;
  const valida = (valor: string) => /^\d{4}-\d{2}-\d{2}$/.test(valor) && !Number.isNaN(Date.parse(valor)) && new Date(valor).toISOString().slice(0, 10) === valor;
  if ((typeof inicio === 'string' && inicio && !valida(inicio)) || (typeof fin === 'string' && fin && !valida(fin))) return { fechaInvalida: true };
  return typeof inicio === 'string' && typeof fin === 'string' && inicio && fin && fin < inicio ? { ordenFechas: true } : null;
}
const textoObligatorio = (maximo: number) => [Validators.required, Validators.pattern(/\S/), Validators.maxLength(maximo)];
@Component({
  selector: 'app-nueva-solicitud', standalone: true,
  imports: [ReactiveFormsModule, RouterLink, PageTitleComponent, IntegracionAvisoComponent, SolicitudDetalleComponent],
  templateUrl: './nueva-solicitud.component.html', styleUrls: ['../compartidos/solicitudes.scss', './nueva-solicitud.component.scss'],
})
export class NuevaSolicitudComponent implements OnInit {
  protected readonly api = inject(SolicitudesService);
  private readonly catalogos = inject(EmisionCertificadosService);
  private readonly areasApi = inject(AreaService);
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private cargaRegistro?: Subscription;
  protected readonly contexto = signal<ContextoSolicitud | null>(null);
  protected readonly registro = signal<Solicitud | null>(null);
  protected readonly tipos = signal<readonly { id: string; nombre: string }[]>([]);
  protected readonly areasCatalogo = signal<readonly { id: string; nombre: string }[]>([]);
  protected readonly areasDisponibles = computed(() => this.api.integrado ? this.contexto()?.areasAutorizadas ?? [] : this.areasCatalogo());
  protected readonly cargandoTipos = signal(false);
  protected readonly cargandoAreas = signal(false);
  protected readonly errorTipos = signal<string | null>(null);
  protected readonly errorAreas = signal<string | null>(null);
  protected readonly cargando = signal(false);
  protected readonly ocupado = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly aviso = signal<string | null>(null);
  protected readonly confirmar = signal<DatosSolicitud | null>(null);
  protected puedeGuardar(): boolean {
    if (this.form.invalid || this.form.pending || this.cargando() || this.ocupado() || this.cargandoTipos() || this.cargandoAreas()) return false;
    return this.api.integrado ? !!this.contexto() && (this.registro()?.puedeEditar ?? this.contexto()?.puedeCrear ?? false)
      : false;
  }
  protected readonly form = inject(NonNullableFormBuilder).group({
    areaId: ['', Validators.required], nombre: ['', textoObligatorio(LIMITES_SOLICITUD.nombre)], tipoId: ['', Validators.required],
    descripcion: ['', Validators.maxLength(LIMITES_SOLICITUD.descripcion)], objetivo: ['', [Validators.required, Validators.pattern(/\S/)]],
    inicio: ['', Validators.required], fin: ['', Validators.required], lugar: ['', Validators.maxLength(LIMITES_SOLICITUD.sede)],
  }, { validators: fechasSolicitud });
  protected readonly camposTexto = [
    { clave: 'nombre', label: 'Nombre de la actividad', maximo: LIMITES_SOLICITUD.nombre, obligatorio: true },
    { clave: 'lugar', label: 'Sede propuesta', maximo: LIMITES_SOLICITUD.sede, obligatorio: false },
  ] as const;
  protected readonly camposLargos = [
    { clave: 'descripcion', label: 'Descripción', obligatorio: false, maximo: LIMITES_SOLICITUD.descripcion },
    { clave: 'objetivo', label: 'Objetivo o justificación', obligatorio: true, maximo: null },
  ] as const;

  ngOnInit(): void {
    this.cargarCatalogos();
    if (!this.api.integrado) {
      this.route.queryParamMap.pipe(map(parametros => parametros.get('editar')), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef)).subscribe(id => {
        this.cargaRegistro?.unsubscribe(); this.registro.set(null); this.confirmar.set(null); this.form.reset(); this.aviso.set(null); this.error.set(null);
        this.cargando.set(false);
        if (id) this.error.set('La consulta y edición de solicitudes están pendientes de habilitación.');
      });
      return;
    }
    this.cargando.set(true);
    this.api.contexto().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: contexto => {
        this.contexto.set(contexto);
        this.route.queryParamMap.pipe(map(parametros => parametros.get('editar')), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef)).subscribe(id => {
          this.cargaRegistro?.unsubscribe(); this.registro.set(null); this.confirmar.set(null); this.form.reset(); this.aviso.set(null); this.error.set(null);
          if (contexto.areasAutorizadas.length === 1) this.form.controls.areaId.setValue(contexto.areasAutorizadas[0].id);
          if (id) { this.cargando.set(true); this.cargarRegistro(id); } else this.cargando.set(false);
        });
      }, error: error => { this.error.set(mensajeSolicitudes(error)); this.cargando.set(false); },
    });
  }
  protected cargarCatalogos(): void {
    if (!this.api.integrado && !this.cargandoAreas()) {
      this.errorAreas.set(null);
      if (this.auth.tienePermiso('areas.ver')) {
        this.cargandoAreas.set(true);
        this.areasApi.listar().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: filas => { this.areasCatalogo.set(filas.filter(fila => Number.isSafeInteger(fila.id_area) && fila.id_area > 0 && typeof fila.nombre === 'string' && !!fila.nombre.trim()).map(fila => ({ id: String(fila.id_area), nombre: fila.nombre }))); this.cargandoAreas.set(false); },
          error: error => { this.areasCatalogo.set([]); this.errorAreas.set(mensajeSolicitudes(error)); this.cargandoAreas.set(false); },
        });
      } else this.errorAreas.set('La consulta del catálogo requiere el permiso de Áreas.');
    }
    if (this.cargandoTipos()) return;
    this.errorTipos.set(null);
    if (this.auth.tienePermiso('actividades.ver')) {
      this.cargandoTipos.set(true);
      this.catalogos.listarTodos('ativicty-type', { estado: 1 }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: filas => { this.tipos.set(filas.flatMap(fila => {
          const nombre = fila['nombre']; const id = fila['id_tipo_actividad'];
          return [true, 1, '1'].includes(fila['estado'] as boolean | number | string) && typeof nombre === 'string' && !!nombre.trim() && Number.isSafeInteger(Number(id)) && Number(id) > 0
            ? [{ id: String(id), nombre }] : [];
        })); this.cargandoTipos.set(false); },
        error: error => { this.tipos.set([]); this.errorTipos.set(mensajeSolicitudes(error)); this.cargandoTipos.set(false); },
      });
    } else this.errorTipos.set('La consulta de tipos requiere el permiso de Actividades.');
  }
  private cargarRegistro(id: string): void {
    this.cargaRegistro = this.api.detalle(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: fila => {
        this.registro.set(fila); this.cargando.set(false);
        if (fila.puedeEditar) this.form.patchValue(fila);
        else this.error.set('El servidor no autoriza la edición de esta solicitud.');
      }, error: error => { this.error.set(mensajeSolicitudes(error)); this.cargando.set(false); },
    });
  }
  protected revisar(): void {
    this.form.markAllAsTouched(); this.error.set(null);
    if (this.form.invalid || this.form.pending || this.cargandoAreas() || this.cargandoTipos()) { this.error.set('Completa los campos obligatorios y revisa las fechas y catálogos.'); return; }
    if (!this.areasDisponibles().some(area => area.id === this.form.controls.areaId.value) || !this.tipos().some(tipo => tipo.id === this.form.controls.tipoId.value)) {
      this.error.set('Selecciona un área y un tipo de actividad de los catálogos disponibles.'); return;
    }
    this.confirmar.set(this.datos());
  }
  protected editar(): void { this.confirmar.set(null); }
  protected nombreArea(id: string): string { return this.areasDisponibles().find(area => area.id === id)?.nombre ?? 'Área pendiente de consulta'; }
  protected nombreTipo(id: string): string { return this.tipos().find(tipo => tipo.id === id)?.nombre ?? 'Tipo pendiente de consulta'; }
  private datos(): DatosSolicitud {
    const datos = this.form.getRawValue();
    return { ...datos, nombre: datos.nombre.trim(), lugar: datos.lugar.trim(), descripcion: datos.descripcion.trim(), objetivo: datos.objetivo.trim(), observaciones: '' };
  }
  protected guardar(enviar = false): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.error.set('Completa los campos obligatorios del borrador y revisa las longitudes y fechas. Laravel exige los mismos datos al crear un borrador.'); return;
    }
    if (!this.puedeGuardar()) return;
    const datos = this.datos();
    if (!this.areasDisponibles().some(area => area.id === datos.areaId) || !this.tipos().some(tipo => tipo.id === datos.tipoId)) {
      this.error.set('Selecciona un área autorizada y un tipo activo.'); return;
    }
    if (enviar && !this.confirmar()) return;
    this.ocupado.set(true); this.error.set(null); this.aviso.set(null);
    const existente = this.registro();
    this.api.guardar(datos, existente ? { id: existente.id, version: existente.version } : null).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: fila => {
        this.registro.set(fila);
        if (enviar && fila.acciones.includes('Enviar')) {
          this.api.decidir(fila.id, fila.version, 'Enviar', '').pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => { this.ocupado.set(false); void this.router.navigateByUrl('/solicitudes/mis-solicitudes'); },
            error: error => { this.ocupado.set(false); this.error.set((fila.estado === 'Observada' ? 'La corrección' : 'El borrador') + ' se guardó, pero no se confirmó el envío. ' + mensajeSolicitudes(error)); },
          });
        } else {
          this.ocupado.set(false);
          this.aviso.set(enviar ? 'Cambios confirmados por el servidor. No se autorizó su envío.' : fila.estado === 'Observada' ? 'Corrección guardada y confirmada por el servidor.' : 'Borrador guardado y confirmado por el servidor.');
        }
      }, error: error => { this.ocupado.set(false); this.error.set(mensajeSolicitudes(error)); },
    });
  }
}
