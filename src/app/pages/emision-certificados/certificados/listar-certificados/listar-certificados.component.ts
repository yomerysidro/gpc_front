import { DatePipe } from '@angular/common';
import { afterNextRender, Component, computed, DestroyRef, inject, input, output, signal } from '@angular/core';
import { SeleccionCertificado } from '../../../../core/interfaces/emision-certificados/preparacion-documental.interface';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { catchError, forkJoin, from, map, mergeMap, of, Subscription, switchMap, toArray } from 'rxjs';
import { ErrorApi } from '../../../../core/interfaces/api/api-response.interface';
import { CertificadoDocumento, CertificadoRow } from '../../../../core/interfaces/emision-certificados/emision-certificados.interface';
import { AuthService } from '../../../../core/services/autenticacion/auth.service';
import { EmisionCertificadosService } from '../../../../core/services/emision-certificados/emision-certificados.service';
import { PageTitleComponent } from '../../../../shared/components/page-title/page-title.component';
import { etiquetaEstado } from '../../compartidos/estado-emision';

interface CertificadoVista {
  readonly registro: CertificadoRow;
  readonly beneficiario: string;
  readonly tipo: string;
  readonly documentos: readonly CertificadoDocumento[];
  readonly errorDocumentos: string | null;
  readonly firmas: number | null;
}
@Component({
  selector: 'app-listar-certificados', standalone: true,
  imports: [RouterLink, PageTitleComponent, ReactiveFormsModule, DatePipe],
  templateUrl: './listar-certificados.component.html',
  styleUrls: ['../../compartidos/emision.scss', './listar-certificados.component.scss'],
})
export class ListarCertificadosComponent {
  readonly seleccionable = input(false);
  readonly seleccionado = output<SeleccionCertificado>();
  private readonly api = inject(EmisionCertificadosService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly auth = inject(AuthService);
  private carga?: Subscription;
  protected readonly filas = signal<readonly CertificadoVista[]>([]);
  protected readonly dni = signal<Readonly<Partial<Record<number, string>>>>({});
  protected readonly errorDni = signal<string | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly cargando = signal(false);
  protected readonly pagina = signal(1);
  protected readonly filtroBeneficiario = new FormControl('', { nonNullable: true });
  protected readonly filtroTipo = new FormControl('', { nonNullable: true });
  protected readonly filtroOrigen = new FormControl('', { nonNullable: true });
  protected readonly filtroEstado = new FormControl('', { nonNullable: true });
  private readonly busqueda = toSignal(this.filtroBeneficiario.valueChanges, { initialValue: '' });
  private readonly tipo = toSignal(this.filtroTipo.valueChanges, { initialValue: '' });
  private readonly origen = toSignal(this.filtroOrigen.valueChanges, { initialValue: '' });
  private readonly estado = toSignal(this.filtroEstado.valueChanges, { initialValue: '' });
  protected readonly tipos = signal<readonly { id_tipo_certificado: number; nombre_tipo: string }[]>([]);
  protected readonly estados = computed(() => [...new Set(this.filas().map(fila => etiquetaEstado(fila.registro.estado)))]);
  protected readonly certificados = computed(() => {
    const texto = this.normalizar(this.busqueda());
    return this.filas().filter(fila => (!this.tipo() || String(fila.registro.id_tipo_certificado) === this.tipo())
      && (!this.origen() || this.nombreOrigen(fila.registro) === this.origen())
      && (!this.estado() || etiquetaEstado(fila.registro.estado) === this.estado())
      && (!texto || this.normalizar([fila.beneficiario, this.dni()[fila.registro.id_persona] ?? '', ...fila.documentos.map(d => d.codigo_verificacion)].join(' ')).includes(texto)));
  });
  protected readonly totalPaginas = computed(() => Math.max(1, Math.ceil(this.certificados().length / 12)));
  protected readonly visibles = computed(() => this.certificados().slice((this.pagina() - 1) * 12, this.pagina() * 12));
  protected readonly estadoRegistro = etiquetaEstado;

  constructor() {
    afterNextRender(() => this.cargar());
    for (const control of [this.filtroBeneficiario, this.filtroTipo, this.filtroOrigen, this.filtroEstado]) {
      control.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.pagina.set(1));
    }
  }

  protected cargar(): void {
    this.carga?.unsubscribe(); this.filas.set([]); this.dni.set({}); this.error.set(null); this.errorDni.set(null); this.pagina.set(1);
    if (!this.auth.tienePermiso('emision.ver')) { this.error.set('No tienes permiso para consultar certificados.'); return; }
    this.cargando.set(true);
    // Laravel no admite búsqueda por nombre/DNI. Se recorren todas las páginas antes de filtrar.
    this.carga = forkJoin({
      certificados: this.api.listarTodos('certificados'),
      tipos: this.api.listarTodos('tipos-certificado'),
      dni: this.api.documentosIdentidad().pipe(catchError((error: ErrorApi) => { this.errorDni.set(error.mensaje); return of({} as Readonly<Partial<Record<number, string>>>); })),
    }).pipe(
      switchMap(({ certificados, tipos, dni }) => {
        this.tipos.set(tipos); this.dni.set(dni);
        return from([...new Set(certificados.map(fila => fila.id_persona))]).pipe(
          mergeMap(id => this.api.personaReconocimiento(id).pipe(
            map(persona => ({ id, nombre: [persona.nombres, persona.apellido_paterno, persona.apellido_materno].filter(Boolean).join(' ') })),
            catchError((error: ErrorApi) => of({ id, nombre: 'Persona #' + id + ' · ' + error.mensaje })),
          ), 4), toArray(),
          switchMap(personas => from(certificados).pipe(
            mergeMap(registro => this.api.listarTodos('certificados-documentos', { id_certificado: registro.id_certificado }).pipe(
              switchMap(documentos => (documentos.length
                ? forkJoin(documentos.map(documento => this.api.listarTodos('certificados-firmas', { id_certificado_documento: documento.id_certificado_documento })))
                : of([])).pipe(
                  map(firmas => ({ documentos, firmas: firmas.reduce((total, filas) => total + filas.length, 0), errorDocumentos: null })),
                  catchError((error: ErrorApi) => of({ documentos, firmas: null, errorDocumentos: 'Firmas: ' + error.mensaje })),
                )),
              catchError((error: ErrorApi) => of({ documentos: [] as readonly CertificadoDocumento[], firmas: null, errorDocumentos: error.mensaje })),
              map(relaciones => ({ registro, beneficiario: personas.find(persona => persona.id === registro.id_persona)?.nombre ?? 'Nombre no disponible',
                tipo: tipos.find(tipo => tipo.id_tipo_certificado === registro.id_tipo_certificado)?.nombre_tipo ?? 'Tipo #' + registro.id_tipo_certificado, ...relaciones })),
            ), 4), toArray(),
          )),
        );
      }), takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: filas => { this.filas.set(filas.sort((a, b) => b.registro.id_certificado - a.registro.id_certificado)); this.cargando.set(false); },
      error: (error: ErrorApi) => { this.error.set(error.mensaje); this.cargando.set(false); },
    });
  }

  protected nombreOrigen(registro: CertificadoRow): string {
    return registro.id_participacion ? 'Participación' : registro.id_reconocimiento ? 'Reconocimiento' : registro.id_practica ? 'Prácticas' : 'Sin origen';
  }
  protected seleccionar(item: CertificadoVista): void {
    this.seleccionado.emit({ registro: item.registro, beneficiario: item.beneficiario, tipo: item.tipo, dni: this.dni()[item.registro.id_persona] ?? null });
  }
  protected limpiar(): void { for (const control of [this.filtroBeneficiario, this.filtroTipo, this.filtroOrigen, this.filtroEstado]) control.reset(); }
  private normalizar(texto: string): string { return texto.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase(); }
}
