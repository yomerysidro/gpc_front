import { afterNextRender, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, forkJoin, map, Observable, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { ErrorApi } from '../../../../core/interfaces/api/api-response.interface';
import { CertificadoDocumento, CertificadoFirma, CertificadoRow, ConsultaCertificado, Reconocimiento } from '../../../../core/interfaces/emision-certificados/emision-certificados.interface';
import { AuthService } from '../../../../core/services/autenticacion/auth.service';
import { EmisionCertificadosService } from '../../../../core/services/emision-certificados/emision-certificados.service';
import { PageTitleComponent } from '../../../../shared/components/page-title/page-title.component';
import { HasPermissionDirective } from '../../../../shared/directives/has-permission.directive';
import { FirmanteVista, VisorCertificadoComponent } from '../../compartidos/visor-certificado.component';
import { etiquetaEstado } from '../../compartidos/estado-emision';

@Component({
  selector: 'app-detalle-certificado', standalone: true, imports: [RouterLink, PageTitleComponent, HasPermissionDirective, VisorCertificadoComponent],
  templateUrl: './detalle-certificado.component.html', styleUrl: '../../compartidos/emision.scss',
})
export class DetalleCertificadoComponent {
  private readonly api = inject(EmisionCertificadosService);
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly certificado = signal<CertificadoRow | null>(null);
  protected readonly documentos = signal<readonly CertificadoDocumento[]>([]);
  protected readonly firmas = signal<ReadonlyMap<number, readonly CertificadoFirma[]>>(new Map());
  protected readonly consultas = signal<ReadonlyMap<number, readonly ConsultaCertificado[]>>(new Map());
  protected readonly cargando = signal(true);
  protected readonly cargandoDocumentos = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly errorDocumentos = signal<string | null>(null);
  protected readonly errorFirmas = signal<string | null>(null);
  protected readonly errorConsultas = signal<string | null>(null);
  protected readonly tienePermisoDocumentos = this.auth.tienePermiso('emision.ver');
  protected readonly tipoNombre = signal<string | null>(null);
  protected readonly origenNombre = signal<string | null>(null);
  private readonly cambio = new Subject<void>();
  protected readonly reconocimiento = signal<Reconocimiento | null>(null);
  protected readonly firmantes = signal<Readonly<Record<number, FirmanteVista>>>({});
  protected readonly documentoId = signal<number | null>(null);
  protected readonly documentoSeleccionado = computed(() => this.documentos().find(documento => documento.id_certificado_documento === this.documentoId()) ?? null);
  protected readonly cargandoFirmas = signal(false);
  protected readonly errorFirmantes = signal<string | null>(null);
  protected readonly beneficiario = signal<string | null>(null);
  protected readonly dni = signal<string | null>(null);
  protected readonly errorRelaciones = signal<string | null>(null);
  protected readonly estadoRegistro = etiquetaEstado;

  constructor() {
    afterNextRender(() => {
      this.route.paramMap.pipe(
        tap(parametros => {
          this.cambio.next();
          this.certificado.set(null); this.documentos.set([]); this.cargando.set(true); this.error.set(null);
          this.firmas.set(new Map()); this.consultas.set(new Map()); this.firmantes.set({});
          this.errorDocumentos.set(null); this.errorFirmas.set(null); this.errorConsultas.set(null); this.errorFirmantes.set(null);
          this.cargandoDocumentos.set(false); this.cargandoFirmas.set(false);
          this.tipoNombre.set(null); this.origenNombre.set(null); this.reconocimiento.set(null);
          this.beneficiario.set(null); this.dni.set(null); this.errorRelaciones.set(null);
          this.documentoId.set(parametros.has('documentoId') ? Number(parametros.get('documentoId')) : null);
        }),
        switchMap(parametros => {
          const id = Number(parametros.get('id'));
          if (!Number.isSafeInteger(id) || id <= 0) { this.error.set('El identificador no es válido.'); return of(null); }
          return this.api.obtener('certificados', id).pipe(catchError((error: ErrorApi) => { this.error.set(error.mensaje); return of(null); }));
        }), takeUntilDestroyed(this.destroyRef),
      ).subscribe(certificado => {
        this.certificado.set(certificado); this.cargando.set(false);
        if (certificado) { this.cargarRelaciones(certificado); this.cargarDocumentos(certificado.id_certificado); }
      });
    });
  }

  private cargarRelaciones(certificado: CertificadoRow): void {
    this.api.personaReconocimiento(certificado.id_persona).pipe(takeUntil(this.cambio), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: persona => this.beneficiario.set([persona.nombres, persona.apellido_paterno, persona.apellido_materno].filter(Boolean).join(' ')),
      error: (error: ErrorApi) => this.errorRelaciones.set('Beneficiario: ' + error.mensaje),
    });
    this.api.documentosIdentidad().pipe(takeUntil(this.cambio), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: documentos => this.dni.set(documentos[certificado.id_persona] ?? null),
      error: (error: ErrorApi) => this.errorRelaciones.update(actual => [actual, 'DNI: ' + error.mensaje].filter(Boolean).join(' · ')),
    });
    type Fila = Readonly<Record<string, string | number | boolean | null>>;
    let origenes$: Observable<readonly Fila[]> = of([]);
    if (certificado.id_participacion && this.auth.tienePermiso('participantes.ver')) {
      origenes$ = this.api.relacionRegistros('participation').pipe(catchError((error: ErrorApi) => { this.errorRelaciones.set(error.mensaje); return of([] as readonly Fila[]); }));
    } else if (certificado.id_practica && this.auth.tienePermiso('practicantes.ver')) {
      origenes$ = this.api.relacionRegistros('practices/list').pipe(catchError((error: ErrorApi) => { this.errorRelaciones.set(error.mensaje); return of([] as readonly Fila[]); }));
    } else if (certificado.id_reconocimiento && this.auth.tienePermiso('reconocimientos.ver')) {
      origenes$ = this.api.obtener('reconocimientos', certificado.id_reconocimiento).pipe(
        tap(registro => this.reconocimiento.set(registro)), map(registro => [registro] as readonly Fila[]), catchError((error: ErrorApi) => { this.errorRelaciones.set(error.mensaje); return of([] as readonly Fila[]); }));
    }
    forkJoin({
      tipo: this.api.obtener('tipos-certificado', certificado.id_tipo_certificado).pipe(catchError((error: ErrorApi) => { this.errorRelaciones.set(error.mensaje); return of(null); })),
      origenes: origenes$,
    }).pipe(takeUntil(this.cambio), takeUntilDestroyed(this.destroyRef)).subscribe(({ tipo, origenes }) => {
      this.tipoNombre.set(tipo?.nombre_tipo ?? null);
      if (certificado.id_participacion) {
        this.origenNombre.set(origenes.find(fila => Number(fila['id_participacion']) === certificado.id_participacion) ? `Participación #${certificado.id_participacion}` : null);
      } else if (certificado.id_practica) {
        const practica = origenes.find(fila => Number(fila['id_practica']) === certificado.id_practica);
        this.origenNombre.set(practica ? `Práctica: ${String(practica['carrera'] ?? '')}` : null);
      } else if (certificado.id_reconocimiento) {
        const reconocimiento = origenes.find(fila => Number(fila['id_reconocimiento']) === certificado.id_reconocimiento);
        this.origenNombre.set(reconocimiento ? `Reconocimiento: ${String(reconocimiento['titulo'] ?? '')}` : null);
      }
    });
  }

  private cargarDocumentos(idCertificado: number): void {
    if (!this.tienePermisoDocumentos) { this.errorDocumentos.set('No tienes permiso para consultar los documentos asociados.'); return; }
    this.cargandoDocumentos.set(true); this.errorDocumentos.set(null);
    this.api.listarTodos('certificados-documentos', { id_certificado: idCertificado })
      .pipe(takeUntil(this.cambio), takeUntilDestroyed(this.destroyRef)).subscribe({
        next: documentos => {
          this.documentos.set(documentos); this.cargandoDocumentos.set(false);
          if (!documentos.length) return;
          this.cargandoFirmas.set(true);
          forkJoin({
            firmas: forkJoin(documentos.map(documento => this.api.listarTodos('certificados-firmas', { id_certificado_documento: documento.id_certificado_documento })
              .pipe(catchError((error: ErrorApi) => { this.errorFirmas.set(error.mensaje); return of([] as readonly CertificadoFirma[]); })))),
            consultas: forkJoin(documentos.map(documento => this.api.listarTodos('consultas-certificado', { id_certificado_documento: documento.id_certificado_documento })
              .pipe(catchError((error: ErrorApi) => { this.errorConsultas.set(error.mensaje); return of([] as readonly ConsultaCertificado[]); })))),
          }).pipe(takeUntil(this.cambio), takeUntilDestroyed(this.destroyRef)).subscribe(({ firmas: firmasPorDocumento, consultas: consultasPorDocumento }) => {
              const agrupadas = new Map<number, readonly CertificadoFirma[]>();
              const historial = new Map<number, readonly ConsultaCertificado[]>();
              documentos.forEach((documento, indice) => {
                agrupadas.set(documento.id_certificado_documento, firmasPorDocumento[indice] ?? []);
                historial.set(documento.id_certificado_documento, consultasPorDocumento[indice] ?? []);
              });
              this.firmas.set(agrupadas);
              this.consultas.set(historial);
              this.cargandoFirmas.set(false);
              this.cargarFirmantes(firmasPorDocumento.flat());
            });
        },
        error: (error: ErrorApi) => { this.cargandoDocumentos.set(false); this.errorDocumentos.set(error.mensaje); },
      });
  }

  private cargarFirmantes(firmas: readonly CertificadoFirma[]): void {
    if (!firmas.length || !this.auth.tienePermiso('ponentes-firmantes.ver')) return;
    forkJoin({
      trabajadores: this.api.trabajadores(),
      firmas: forkJoin([...new Set(firmas.map(fila => fila.id_firma))].map(id => this.api.obtener('firmas', id))),
    }).pipe(takeUntil(this.cambio), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: ({ trabajadores, firmas: registros }) => {
        const firmantes: Record<number, FirmanteVista> = {};
        for (const firma of registros) {
          const trabajador = trabajadores.find(fila => fila.id_persona_trabajador === firma.id_persona_trabajador);
          if (trabajador) firmantes[firma.id_firma] = { cargo: trabajador.cargo, trabajador: trabajador.id_persona_trabajador };
        }
        this.firmantes.set(firmantes);
      },
      error: (error: ErrorApi) => this.errorFirmantes.set(error.mensaje),
    });
  }

  protected mostrar(valor: CertificadoRow[keyof CertificadoRow]): string {
    return valor === null ? '—' : typeof valor === 'boolean' ? valor ? 'Sí' : 'No' : String(valor);
  }
  protected firmasDocumento(id: number): readonly CertificadoFirma[] { return this.firmas().get(id) ?? []; }
  protected consultasDocumento(id: number): readonly ConsultaCertificado[] { return this.consultas().get(id) ?? []; }
  protected tieneConsultasHistorial(): boolean { return [...this.consultas().values()].some(consultas => consultas.length > 0); }
  protected nombreBeneficiario(id: number): string { return this.beneficiario() ?? `Persona #${id} · Nombre no disponible`; }
  protected nombreTipoCertificado(id: number): string { return this.tipoNombre() ?? `Tipo #${id}`; }
  protected nombreOrigenCertificado(registro: CertificadoRow): string {
    return this.origenNombre() ?? (registro.id_participacion ? `Participación #${registro.id_participacion}` : registro.id_practica ? `Práctica #${registro.id_practica}` : registro.id_reconocimiento ? `Reconocimiento #${registro.id_reconocimiento}` : 'Sin origen asociado');
  }
}
