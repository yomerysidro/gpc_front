import { Component, DestroyRef, effect, inject, input, signal, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription, catchError, finalize, forkJoin, map, of, switchMap } from 'rxjs';
import { DocumentoFirmas, DocumentosDigitalesService } from '../../../core/services/emision-certificados/documentos-digitales.service';
import { PonenteSesion, PonentesCertificacion } from '../../../core/interfaces/emision-certificados/origenes-certificado.interface';
import { ErrorApi } from '../../../core/interfaces/api/api-response.interface';
import { EmisionCertificadosService } from '../../../core/services/emision-certificados/emision-certificados.service';
import { mensajeEtapaA } from '../../../core/services/emision-certificados/documentos-digitales.service';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { Router } from '@angular/router';

/**
 * Grupo PARTICIPANTES/PONENTES de una sesión real. Los ponentes se leen exclusivamente de
 * `activity-session/{id}/ponentes-certificacion`; nunca de los candidatos de la actividad.
 */
@Component({
  selector: 'app-ponentes-sesion', standalone: true,
  template: `<section class="grupo-ponentes" aria-label="Ponentes de la sesión">
    <header class="cabecera-grupo"><h2>Ponentes</h2></header>
    @if (!autorizado()) { <p role="status">No tienes permiso para consultar los ponentes de esta sesión.</p> }
    @if (cargando() && !datos()) { <p role="status">Cargando ponentes de la sesión…</p> }
    @if (error()) { <p role="alert">{{ error() }}</p><button class="btn" type="button" (click)="cargar()">Reintentar ponentes</button> }
    @if (datos(); as d) {
      @if (!d.ponentes_sesion?.length) {
        <p class="sin-ponentes" role="status">No hay ponentes asignados</p>
      } @else {
        <div class="tabla"><table class="table"><caption class="sr-only">Ponentes vinculados a esta sesión</caption>
          <thead><tr><th scope="col" class="col-numero">N.º</th><th>Ponente</th><th>Actividad</th><th>Sesión acreditada</th><th>Elegibilidad</th><th>Preparación</th><th>Acción</th></tr></thead>
          <tbody>
            @for (p of d.ponentes_sesion; track p.id_actividad_ponente; let numeroVisual = $index) {
              <tr><td class="col-numero">{{ numeroVisual + 1 }}</td>
                <th scope="row">{{ nombre(p) }}
                  @if (p.cargo || p.institucion) { <small>{{ p.cargo || '' }}{{ p.cargo && p.institucion ? ' · ' : '' }}{{ p.institucion || '' }}</small> }
                </th>
                <td>{{ p.reconocimiento.actividad || actividadNombre() }}</td>
                <td>{{ p.reconocimiento.sesion || sesionNombre() || 'Sesión ' + sesionId() }}
                  @if (p.reconocimiento.fecha_sesion) { <small>{{ p.reconocimiento.fecha_sesion }}</small> }
                </td>
                <td>{{ p.reconocimiento.estado_elegibilidad }}
                  @for (motivo of p.reconocimiento.motivos_bloqueo; track motivo) { <small>{{ motivo }}</small> }
                </td>
                <td>{{ estadoPreparacion(p) }}
                  @if (erroresConsulta().get(p.id_actividad_ponente); as fallo) { <small role="alert">{{ fallo }}</small>
                    <button class="btn" type="button" [disabled]="cargando()" (click)="cargar()">Reintentar consulta</button> }
                </td>
                <td><button type="button" class="btn" [disabled]="!puedeAbrir(p) || cargando()" [attr.title]="puedeAbrir(p) ? null : motivoBloqueo(p)"
                  (click)="abrir(p)">{{ accion(p) }}</button></td>
              </tr>
            }
          </tbody>
        </table></div>
      }
      @if (d.motivos_bloqueo.length) { <p class="motivos" role="status">{{ d.motivos_bloqueo[0] }}</p> }
    }
  </section>`,
  styles: `
    :host { display: block; min-width: 0; margin-top: 1.25rem; }
    .cabecera-grupo { display: flex; align-items: baseline; gap: .5rem; }
    h2 { margin: 0 0 .5rem; color: #075a9b; font-size: 1.05rem; }
    .cabecera-grupo small { color: #53657a; }
    .tabla { overflow-x: auto; }
    .table { min-width: 44rem; }
    th, td { vertical-align: top; }
    td small, th small { display: block; color: #53657a; font-size: .82rem; margin-top: .15rem; }
    .sin-ponentes { margin: .25rem 0; color: #53657a; }
    .motivos { font-size: .85rem; color: #53657a; }
  `,
})
export class PonentesSesionComponent {
  readonly actividadNombre = input('');
  readonly sesionNombre = input('');
  readonly actividadId = input.required<number>();
  readonly sesionId = input.required<number>();
  private readonly api = inject(EmisionCertificadosService);
  private readonly documentos = inject(DocumentosDigitalesService);
  private readonly estados = signal<ReadonlyMap<number, DocumentoFirmas>>(new Map());
  protected readonly erroresConsulta = signal<ReadonlyMap<number, string>>(new Map());
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroy = inject(DestroyRef);
  private consulta?: Subscription;
  protected readonly datos = signal<PonentesCertificacion | null>(null);
  protected readonly cargando = signal(false);
  protected readonly error = signal('');
  constructor() {
    effect(() => {
      this.actividadId(); this.sesionId();
      untracked(() => {
        this.consulta?.unsubscribe();
        this.datos.set(null); this.error.set(''); this.cargando.set(false);
        this.cargar();
      });
    }, { allowSignalWrites: true });
  }
  protected autorizado(): boolean {
    return ['emision.ver', 'actividades.ver', 'ponentes-firmantes.ver'].every(p => this.auth.tienePermiso(p));
  }
  protected cargar(): void {
    if (!this.autorizado() || this.cargando()) return;
    const actividad = Number(this.actividadId()); const sesion = Number(this.sesionId());
    if (!Number.isSafeInteger(actividad) || actividad < 1 || !Number.isSafeInteger(sesion) || sesion < 1) return;
    this.consulta?.unsubscribe(); this.error.set(''); this.cargando.set(true);
    this.estados.set(new Map());
    this.erroresConsulta.set(new Map());
    this.consulta = this.api.ponentesCertificacion(sesion).pipe(switchMap(d => {
      if (Number(d.id_actividad) !== actividad || Number(d.id_sesion) !== sesion) return of(d);
      this.datos.set(d); this.cargando.set(false);
      const consultas = (d.ponentes_sesion ?? []).filter(p => p.reconocimiento.puede_consultar_certificado_existente
        && p.reconocimiento.certificados_existentes?.length === 1).map(p =>
        this.documentos.recuperarReconocimientoSesion(p.reconocimiento, p.reconocimiento.certificados_existentes![0].id_certificado)
          .pipe(map(doc => ({ id: p.id_actividad_ponente, doc, error: null })),
            catchError((error: ErrorApi) => of({ id: p.id_actividad_ponente, doc: null, error }))));
      return consultas.length ? forkJoin(consultas).pipe(map(resultados => {
        this.estados.set(new Map(resultados.flatMap(r => r.doc ? [[r.id, r.doc] as const] : [])));
        this.erroresConsulta.set(new Map(resultados.flatMap(r => r.error ? [[r.id,
          `No se pudo consultar la preparación (${r.error.errores?.['endpoint']?.[0] ?? 'recuperación documental autenticada'}, HTTP ${r.error.status}).`] as const] : [])));
        return d;
      })) : of(d);
    }), takeUntilDestroyed(this.destroy), finalize(() => this.cargando.set(false))).subscribe({
      next: d => {
        this.cargando.set(false);
        if (Number(d.id_actividad) !== actividad || Number(d.id_sesion) !== sesion) {
          this.error.set('No se pudo confirmar la sesión de los ponentes consultados.'); return;
        }
        this.datos.set(d);
      },
      error: (e: ErrorApi) => {
        this.cargando.set(false);
        this.error.set(e?.status === 409 ? e?.mensaje || 'El servidor no acredita los ponentes de esta sesión.' : mensajeEtapaA(e));
      },
    });
  }
  protected nombre(p: PonenteSesion): string {
    return [p.nombres, p.apellido_paterno, p.apellido_materno].filter(Boolean).join(' ') || 'Nombre no disponible';
  }
  protected estadoPreparacion(p: PonenteSesion): string {
    const d = this.estados().get(p.id_actividad_ponente);
    if (d?.estado_certificado === 'PREPARADO') return 'Pendiente de envío a Gerencia';
    if (d?.disponible_rrhh === true || d?.estado_preparacion === 'PREPARADO_ENTREGA') return 'Listo para entrega';
    if (d?.estado_certificado === 'PENDIENTE_FIRMA' && (d.enviado === true || d.remision?.estado_persistido === 'PENDIENTE_FIRMA')) return 'Enviado a Gerencia';
    if (p.reconocimiento.puede_consultar_certificado_existente) return 'Estado documental pendiente de consulta';
    if (p.reconocimiento.puede_preparar && p.reconocimiento.estado_elegibilidad === 'Elegible') return 'Pendiente de preparación';
    return 'Pendiente de validación';
  }
  protected accion(p: PonenteSesion): string {
    const estado = this.estadoPreparacion(p);
    if (estado === 'Listo para entrega') return 'Ver certificado';
    if (estado === 'Pendiente de envío a Gerencia' || this.erroresConsulta().has(p.id_actividad_ponente)) return 'Continuar preparación';
    return p.reconocimiento.puede_consultar_certificado_existente ? 'Ver reconocimiento' : 'Preparar certificado';
  }
  protected motivoBloqueo(p: PonenteSesion): string {
    return p.reconocimiento.motivos_bloqueo[0] || 'El reconocimiento de esta sesión aún no está habilitado.';
  }
  /** Solo habilita la preparación que el servidor acredita para este vínculo y esta sesión. */
  protected puedeAbrir(p: PonenteSesion): boolean {
    const e = p.reconocimiento;
    return e?.origen === 'ponente_sesion' && e.modalidad_reconocimiento === 'sesion'
      && Number(e.id_sesion) === Number(this.sesionId()) && e.id_origen === p.id_actividad_ponente
      && Number(e.id_actividad) === Number(this.actividadId()) && Number(e.id_persona) === Number(p.id_persona)
      && Number.isSafeInteger(e.id_tipo_certificado) && e.id_tipo_certificado! > 0
      && (e.puede_preparar === true && e.puede_generar_pdf === true && e.estado_elegibilidad === 'Elegible'
        || e.puede_consultar_certificado_existente === true && (e.certificados_existentes?.length ?? 0) === 1);
  }
  protected abrir(p: PonenteSesion): void {
    if (this.cargando() || !this.puedeAbrir(p) || !this.datos()?.ponentes_sesion?.includes(p)) return;
    void this.router.navigate(
      ['/certificaciones/generar-emitir/reconocimientos/preparar'],
      { state: { reconocimientoSesion: p.reconocimiento } });
  }
}
