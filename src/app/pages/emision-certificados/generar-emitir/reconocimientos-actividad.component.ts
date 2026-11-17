import { Component, DestroyRef, effect, inject, input, signal, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, forkJoin, Subscription, timeout } from 'rxjs';
import { PonenteReconocimiento } from '../../../core/interfaces/emision-certificados/origenes-certificado.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistroEmision } from '../../../core/interfaces/emision-certificados/emision-certificados.interface';
import { EmisionCertificadosService } from '../../../core/services/emision-certificados/emision-certificados.service';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { mensajeEtapaA } from '../../../core/services/emision-certificados/documentos-digitales.service';

@Component({
  selector: 'app-reconocimientos-actividad', standalone: true,
  template: `<section aria-label="Reconocimientos por actividad">
      <h3>Reconocimiento por actividad</h3>
      @if (!actividadId()) {
        <label>Actividad<select class="input" [value]="actividadSeleccionada() ?? ''" [disabled]="cargando()" (change)="cargarActividad(+$any($event.target).value)">
          <option value="">Seleccionar actividad</option>@for (a of actividades(); track a['id_actividad']) { <option [value]="a['id_actividad']">{{ a['nombre'] }}</option> }
        </select></label>
      }
      @if (cargando()) { <p role="status">Cargando reconocimientos…</p> }
      @if (error()) { <p role="alert">{{ error() }}</p> }
      @if (actividadSeleccionada()) { <button class="btn" type="button" [disabled]="cargando()" (click)="cargarActividad(actividadSeleccionada()!)">Actualizar reconocimientos</button> }
      @if (filas().length) {
        <div class="tabla"><table class="table"><thead><tr><th scope="col" class="col-numero">N.º</th><th>Beneficiario</th><th>Actividad</th><th>Tipo de reconocimiento</th><th>Elegibilidad</th><th>Preparación</th><th>Acción</th></tr></thead><tbody>
          @for (p of filas(); track p.id_actividad_ponente; let numeroVisual = $index) {
            <tr><td class="col-numero">{{ numeroVisual + 1 }}</td><th scope="row">{{ nombre(p) }}</th><td>{{ p.reconocimiento.actividad || nombreActividad() }}</td>
              <td>{{ p.reconocimiento.tipo_certificado || 'No determinado' }}<small>Reconocimiento por actividad</small></td>
              <td>{{ p.reconocimiento.estado_elegibilidad }}@for (motivo of p.reconocimiento.motivos_bloqueo; track motivo) { <p>{{ motivo }}</p> }</td>
              <td>{{ p.reconocimiento.puede_consultar_certificado_existente ? 'Preparación existente' : p.reconocimiento.puede_preparar ? 'Pendiente de preparación' : 'Pendiente de validación' }}</td>
              <td><button type="button" class="btn btn-primary" [disabled]="cargando() || !puedeAbrir(p)" (click)="continuar(p)">{{ p.reconocimiento.puede_consultar_certificado_existente ? 'Ver reconocimiento' : 'Preparar reconocimiento' }}</button></td></tr>
          }
        </tbody></table></div>
      } @else if (actividadSeleccionada() && !cargando() && !error()) { <p>No hay ponentes autorizados para esta actividad.</p> }
  </section>`,
  styles: `:host{display:block;min-width:0}h3{color:#075a9b}label{display:grid;gap:.3rem;max-width:28rem;margin-bottom:.7rem}.tabla{overflow-x:auto}.table{min-width:45rem}th,td{vertical-align:top}small{display:block}td p{font-size:.85rem;margin:.3rem 0}`,
})
export class ReconocimientosActividadComponent {
  readonly actividadId = input<number | null>(null);
  readonly candidatos = input<readonly PonenteReconocimiento[] | null>(null);
  readonly sesionRetorno = input<number | null>(null);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(EmisionCertificadosService);
  private readonly auth = inject(AuthService);
  private readonly destroy = inject(DestroyRef);
  private consulta?: Subscription;
  protected readonly actividades = signal<readonly RegistroEmision[]>([]);
  protected readonly filas = signal<readonly PonenteReconocimiento[]>([]);
  protected readonly actividadSeleccionada = signal<number | null>(null);
  protected readonly cargando = signal(false);
  protected readonly error = signal('');
  constructor() {
    effect(() => { const actividad = this.actividadId(); const filas = this.candidatos(); untracked(() => {
      this.consulta?.unsubscribe(); this.cargando.set(false); this.error.set(''); this.filas.set([]); this.actividadSeleccionada.set(actividad);
      if (!['emision.ver', 'actividades.ver', 'ponentes-firmantes.ver'].every(p => this.auth.tienePermiso(p))) {
        this.error.set('No tienes permiso para consultar reconocimientos por actividad.'); return;
      }
      if (actividad && filas) this.filas.set(filas.filter(p => p.id_actividad === actividad));
      else if (actividad) this.cargarActividad(actividad);
      else if (Number(this.route.snapshot.queryParamMap.get('actividad_reconocimiento')) > 0) {
        const id = Number(this.route.snapshot.queryParamMap.get('actividad_reconocimiento'));
        if (!Number.isSafeInteger(id)) return;
        this.actividadSeleccionada.set(id); this.cargando.set(true);
        this.consulta = forkJoin({ actividades: this.api.listarTodos('activity'), ponentes: this.api.ponentesActividad(id) })
          .pipe(timeout(30000), takeUntilDestroyed(this.destroy), finalize(() => this.cargando.set(false))).subscribe({
            next: d => { this.actividades.set(d.actividades); this.filas.set(d.ponentes.ponentes); },
            error: e => this.error.set(mensajeEtapaA(e)),
          });
      } else {
        this.cargando.set(true);
        this.consulta = this.api.listarTodos('activity').pipe(timeout(30000), takeUntilDestroyed(this.destroy), finalize(() => this.cargando.set(false))).subscribe({
          next: datos => this.actividades.set(datos), error: e => this.error.set(mensajeEtapaA(e)),
        });
      }
    }); }, { allowSignalWrites: true });
  }
  protected nombre(p: PonenteReconocimiento): string { return [p.nombres, p.apellido_paterno, p.apellido_materno].filter(Boolean).join(' '); }
  protected nombreActividad(): string { return String(this.actividades().find(a => Number(a['id_actividad']) === this.actividadSeleccionada())?.['nombre'] ?? ''); }
  protected puedeAbrir(p: PonenteReconocimiento): boolean {
    const e = p.reconocimiento;
    return e?.origen === 'ponente_actividad' && e.modalidad_reconocimiento === 'actividad' && e.id_sesion === null
      && Number.isSafeInteger(e.id_tipo_certificado) && e.id_tipo_certificado! > 0
      && e.id_origen === p.id_actividad_ponente && e.id_actividad === p.id_actividad && e.id_persona === p.id_persona
      && (e.puede_preparar === true && e.puede_generar_pdf === true && e.estado_elegibilidad === 'Elegible'
        || e.puede_consultar_certificado_existente === true && e.certificados_existentes?.length === 1);
  }
  protected cargarActividad(id: number): void {
    this.consulta?.unsubscribe(); this.error.set(''); this.filas.set([]); this.actividadSeleccionada.set(Number.isSafeInteger(id) && id > 0 ? id : null);
    if (!this.actividadSeleccionada()) return;
    this.cargando.set(true);
    this.consulta = this.api.ponentesActividad(id).pipe(timeout(30000), takeUntilDestroyed(this.destroy), finalize(() => this.cargando.set(false))).subscribe({
      next: d => this.filas.set(d.ponentes), error: e => this.error.set(mensajeEtapaA(e)),
    });
  }
  protected continuar(p: PonenteReconocimiento): void {
    if (this.cargando() || !this.puedeAbrir(p) || !this.filas().includes(p)) return;
    this.cargando.set(true); this.error.set('');
    this.consulta = this.api.ponentesActividad(p.id_actividad).pipe(timeout(30000), takeUntilDestroyed(this.destroy), finalize(() => this.cargando.set(false))).subscribe({
      next: d => {
        this.filas.set(d.ponentes); const vigente = d.ponentes.find(f => f.id_actividad_ponente === p.id_actividad_ponente);
        if (vigente && this.puedeAbrir(vigente)) {
          const retorno = this.sesionRetorno()
            ? { id_actividad: p.id_actividad, id_sesion: this.sesionRetorno(), modalidad: 'sesion', origen: 'participacion' }
            : { origen_documental: 'reconocimiento', actividad_reconocimiento: p.id_actividad };
          void this.router.navigate(['/certificaciones/generar-emitir/reconocimientos/actividad', p.id_actividad, 'ponentes', p.id_actividad_ponente],
            { queryParams: retorno });
        }
      }, error: e => this.error.set(mensajeEtapaA(e)),
    });
  }
}
