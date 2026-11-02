import { afterNextRender, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { ErrorApi } from '../../../../core/interfaces/api/api-response.interface';
import { CertificadoDocumento, CertificadoRow, Reconocimiento, TrabajadorEmision } from '../../../../core/interfaces/emision-certificados/emision-certificados.interface';
import { AuthService } from '../../../../core/services/autenticacion/auth.service';
import { EmisionCertificadosService } from '../../../../core/services/emision-certificados/emision-certificados.service';
import { PageTitleComponent } from '../../../../shared/components/page-title/page-title.component';
import { etiquetaEstado } from '../../compartidos/estado-emision';

@Component({
  selector: 'app-detalle-reconocimiento', standalone: true, imports: [RouterLink, PageTitleComponent],
  templateUrl: './detalle-reconocimiento.component.html', styleUrl: '../../compartidos/emision.scss',
})
export class DetalleReconocimientoComponent {
  private readonly api = inject(EmisionCertificadosService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly auth = inject(AuthService);
  protected readonly reconocimiento = signal<Reconocimiento | null>(null);
  protected readonly trabajador = signal<TrabajadorEmision | null>(null);
  protected readonly certificados = signal<readonly CertificadoRow[]>([]);
  protected readonly documentos = signal<Readonly<Partial<Record<number, readonly CertificadoDocumento[]>>>>({});
  protected readonly error = signal<string | null>(null);
  protected readonly errorRelacion = signal<string | null>(null);
  protected readonly errorCertificados = signal<string | null>(null);
  protected readonly errorDocumentos = signal<string | null>(null);
  protected readonly cargando = signal(true);
  protected readonly nombre = signal<string | null>(null);
  protected readonly dni = signal<string | null>(null);
  protected readonly area = signal<string | null>(null);
  protected readonly estadoRegistro = etiquetaEstado;

  constructor() {
    afterNextRender(() => this.route.paramMap.pipe(
      tap(() => {
        this.reconocimiento.set(null); this.trabajador.set(null); this.certificados.set([]); this.documentos.set({});
        this.error.set(null); this.errorRelacion.set(null); this.errorCertificados.set(null); this.errorDocumentos.set(null); this.cargando.set(true);
        this.nombre.set(null); this.dni.set(null); this.area.set(null);
      }),
      switchMap(params => {
        const id = Number(params.get('id'));
        if (!Number.isSafeInteger(id) || id <= 0) { this.error.set('El identificador no es válido.'); return of(null); }
        return this.api.obtener('reconocimientos', id).pipe(catchError((error: ErrorApi) => { this.error.set(error.mensaje); return of(null); }));
      }),
      switchMap(registro => {
        this.reconocimiento.set(registro);
        if (!registro) return of(null);
        return forkJoin({
          trabajadores: this.auth.tienePermiso('ponentes-firmantes.ver') ? this.api.trabajadores().pipe(
            catchError((error: ErrorApi) => { this.errorRelacion.set(error.mensaje); return of([] as readonly TrabajadorEmision[]); }),
          ) : of([] as readonly TrabajadorEmision[]),
          certificados: this.auth.tienePermiso('emision.ver') ? this.api.listarTodos('certificados', { id_reconocimiento: registro.id_reconocimiento }).pipe(
            catchError((error: ErrorApi) => { this.errorCertificados.set(error.mensaje); return of([] as readonly CertificadoRow[]); }),
          ) : of([] as readonly CertificadoRow[]),
        });
      }),
      switchMap(relaciones => {
        if (!relaciones) return of({});
        this.trabajador.set(relaciones.trabajadores.find(fila => fila.id_persona_trabajador === this.reconocimiento()?.id_persona_trabajador) ?? null);
        this.certificados.set(relaciones.certificados);
        const trabajador = this.trabajador();
        const identidad = trabajador ? forkJoin({
          persona: this.api.personaReconocimiento(trabajador.id_persona).pipe(tap(persona => this.nombre.set([persona.nombres, persona.apellido_paterno, persona.apellido_materno].filter(Boolean).join(' '))), catchError((error: ErrorApi) => { this.errorRelacion.set(error.mensaje); return of(null); })),
          area: this.api.areaReconocimiento(trabajador.id_area).pipe(tap(area => this.area.set(area.nombre)), catchError((error: ErrorApi) => { this.errorRelacion.set(error.mensaje); return of(null); })),
          dni: this.api.documentosIdentidad().pipe(tap(dni => this.dni.set(dni[trabajador.id_persona] ?? null)), catchError((error: ErrorApi) => { this.errorRelacion.set(error.mensaje); return of(null); })),
        }) : of(null);
        const documentos = relaciones.certificados.length ? forkJoin(relaciones.certificados.map(certificado => this.api.listarTodos('certificados-documentos', { id_certificado: certificado.id_certificado }).pipe(
          map(documentos => [certificado.id_certificado, documentos] as const),
          catchError((error: ErrorApi) => { this.errorDocumentos.set(error.mensaje); return of([certificado.id_certificado, [] as readonly CertificadoDocumento[]] as const); }),
        ))).pipe(map(filas => Object.fromEntries(filas))) : of({});
        return forkJoin({ identidad, documentos }).pipe(map(resultado => resultado.documentos));
      }), takeUntilDestroyed(this.destroyRef),
    ).subscribe(documentos => { this.documentos.set(documentos); this.cargando.set(false); }));
  }
}
