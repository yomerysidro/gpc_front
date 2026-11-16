import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { Subscription, combineLatest, finalize, timeout } from 'rxjs';
import { EvaluacionPonenteSesion } from '../../../core/interfaces/emision-certificados/origenes-certificado.interface';
import { ErrorApi } from '../../../core/interfaces/api/api-response.interface';
import { EmisionCertificadosService } from '../../../core/services/emision-certificados/emision-certificados.service';
import { mensajeEtapaA } from '../../../core/services/emision-certificados/documentos-digitales.service';
import { PreparacionOrigenComponent } from './preparacion-origen.component';

/**
 * Página completa del reconocimiento de un ponente vinculado a una sesión real.
 * Nunca reutiliza la evaluación de otra sesión ni de la modalidad por actividad.
 */
@Component({
  standalone: true, selector: 'app-preparar-reconocimiento-sesion', imports: [PreparacionOrigenComponent, RouterLink],
  template: `@if (cargando()) { <p role="status">Cargando reconocimiento de la sesión…</p> }
    @if (error()) { <section class="card"><h1>Preparar reconocimiento</h1><p role="alert">{{ error() }}</p>
      <a class="btn" routerLink="/certificaciones/generar-emitir" [queryParams]="retorno">Volver a la lista</a>
      <button class="btn" type="button" [disabled]="cargando()" (click)="cargar()">Actualizar estado</button></section> }
    @if (evaluacion(); as e) { <app-preparacion-origen origen="reconocimiento" [ponente]="e" [asistente]="true" [retorno]="retorno" /> }`,
})
export class PrepararReconocimientoSesionComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(EmisionCertificadosService);
  private readonly destroy = inject(DestroyRef);
  private consulta?: Subscription;
  protected readonly evaluacion = signal<EvaluacionPonenteSesion | null>(null);
  protected readonly cargando = signal(false);
  protected readonly error = signal('');
  // El contexto de retorno restaura actividad y sesión; no altera el origen preparado.
  protected get retorno(): Params { return this.contextoRetorno(); }
  constructor() { combineLatest([this.route.paramMap, this.route.queryParamMap])
    .pipe(takeUntilDestroyed(this.destroy)).subscribe(() => this.cargar()); }
  private contextoRetorno(): Params {
    const q = this.route.snapshot.queryParamMap;
    const sesion = Number(this.route.snapshot.paramMap.get('sesionId'));
    const e = this.evaluacion();
    const actividad = Number(e?.id_actividad ?? q.get('id_actividad'));
    return Number.isSafeInteger(sesion) && sesion > 0 && Number.isSafeInteger(actividad) && actividad > 0
      ? { origen: 'ponente_sesion', modalidad: 'sesion', id_actividad: actividad, id_sesion: String(sesion),
        ...(e?.id_tipo_certificado ? { id_tipo_certificado: e.id_tipo_certificado } : {}) }
      : {};
  }
  protected cargar(): void {
    this.consulta?.unsubscribe();
    this.error.set(''); this.evaluacion.set(null); this.cargando.set(false);
    const sesion = this.route.snapshot.paramMap.get('sesionId'); const ponente = this.route.snapshot.paramMap.get('ponenteId');
    const q = this.route.snapshot.queryParamMap;
    if (![sesion, ponente].every(id => /^[1-9]\d*$/.test(id ?? '') && Number.isSafeInteger(Number(id)))) {
      this.error.set('El reconocimiento solicitado no es válido.'); return;
    }
    if (['origen', 'id_actividad', 'id_sesion', 'modalidad', 'id_actividad_ponente', 'id_persona'].some(k => q.getAll(k).length > 1)
      || q.has('id_participacion') || q.has('id_asistencia')
      || q.has('origen') && !['ponente_sesion', 'participacion'].includes(q.get('origen')!)
      || q.has('modalidad') && q.get('modalidad') !== 'sesion'
      || q.has('id_sesion') && q.get('id_sesion') !== sesion
      || q.has('id_actividad_ponente') && q.get('id_actividad_ponente') !== ponente) {
      this.error.set('El contexto no corresponde a un reconocimiento de ponente por sesión.'); return;
    }
    this.cargando.set(true);
    this.consulta = this.api.ponentesCertificacion(Number(sesion)).pipe(timeout(30000), takeUntilDestroyed(this.destroy),
      finalize(() => this.cargando.set(false))).subscribe({
      next: d => {
        const p = d.ponentes_sesion?.find(f => f.id_actividad_ponente === Number(ponente));
        const e = p?.reconocimiento;
        if (!p || !e || Number(d.id_sesion) !== Number(sesion) || e.id_origen !== Number(ponente)
          || Number(e.id_sesion) !== Number(sesion) || Number(e.id_actividad) !== Number(d.id_actividad)
          || Number(e.id_persona) !== Number(p.id_persona) || Number(p.id_actividad) !== Number(d.id_actividad)
          || !Number.isSafeInteger(p.id_persona) || p.id_persona < 1
          || Number(e.id_persona_ponente) !== Number(p.id_persona_ponente)
          || e.id_actividad_ponente !== p.id_actividad_ponente
          || e.nombres !== p.nombres || e.apellido_paterno !== p.apellido_paterno || e.apellido_materno !== p.apellido_materno
          || q.has('id_actividad') && q.get('id_actividad') !== String(d.id_actividad)
          || q.has('id_persona') && q.get('id_persona') !== String(p.id_persona)
          || e.origen !== 'ponente_sesion' || e.modalidad_reconocimiento !== 'sesion') {
          this.error.set('No se encontró el reconocimiento en esta sesión.'); return;
        }
        this.evaluacion.set(e);
        if (q.get('origen') !== 'ponente_sesion' || q.get('id_actividad_ponente') !== ponente) {
          void this.router.navigate([], { relativeTo: this.route, replaceUrl: true, queryParamsHandling: 'merge',
            queryParams: { origen: 'ponente_sesion', modalidad: 'sesion', id_actividad: d.id_actividad,
              id_sesion: Number(sesion), id_actividad_ponente: Number(ponente) } });
        }
      },
      error: (e: ErrorApi) => this.error.set(
        e?.status === 409 ? e?.mensaje || 'El servidor no acredita este reconocimiento por sesión.' : mensajeEtapaA(e)),
    });
  }
}
