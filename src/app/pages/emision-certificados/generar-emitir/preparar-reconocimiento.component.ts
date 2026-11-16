import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { Subscription, finalize, timeout } from 'rxjs';
import { EvaluacionPonenteActividad } from '../../../core/interfaces/emision-certificados/origenes-certificado.interface';
import { EmisionCertificadosService } from '../../../core/services/emision-certificados/emision-certificados.service';
import { mensajeEtapaA } from '../../../core/services/emision-certificados/documentos-digitales.service';
import { PreparacionOrigenComponent } from './preparacion-origen.component';

@Component({
  standalone: true, selector: 'app-preparar-reconocimiento', imports: [PreparacionOrigenComponent, RouterLink],
  template: `@if (cargando()) { <p role="status">Cargando reconocimiento…</p> }
    @if (error()) { <section class="card"><h1>Preparar reconocimiento</h1><p role="alert">{{ error() }}</p>
      <a class="btn" routerLink="/certificaciones/generar-emitir" [queryParams]="retorno">Volver a la lista</a>
      <button class="btn" type="button" [disabled]="cargando()" (click)="cargar()">Actualizar estado</button></section> }
    @if (evaluacion(); as e) { <app-preparacion-origen origen="reconocimiento" [ponente]="e" [asistente]="true" [retorno]="retorno" /> }`,
})
export class PrepararReconocimientoComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(EmisionCertificadosService);
  private readonly destroy = inject(DestroyRef);
  private consulta?: Subscription;
  protected readonly evaluacion = signal<EvaluacionPonenteActividad | null>(null);
  protected readonly cargando = signal(false);
  protected readonly error = signal('');
  // El contexto de sesión se utiliza exclusivamente para regresar, nunca para preparar.
  protected get retorno(): Params { return this.contextoRetorno(); }
  constructor() { this.route.paramMap.pipe(takeUntilDestroyed(this.destroy)).subscribe(() => this.cargar()); }
  private contextoRetorno(): Params {
    const q = this.route.snapshot.queryParamMap;
    const actividad = Number(this.route.snapshot.paramMap.get('actividadId'));
    const sesion = q.get('id_sesion');
    return q.get('modalidad') === 'sesion' && q.get('id_actividad') === String(actividad) && /^[1-9]\d*$/.test(sesion ?? '')
      && Number.isSafeInteger(Number(sesion))
      ? { origen: 'participacion', modalidad: 'sesion', id_actividad: actividad, id_sesion: sesion }
      : { origen_documental: 'reconocimiento', actividad_reconocimiento: actividad };
  }
  protected cargar(): void {
    this.consulta?.unsubscribe();
    this.cargando.set(false);
    this.error.set(''); this.evaluacion.set(null);
    const actividad = this.route.snapshot.paramMap.get('actividadId'); const ponente = this.route.snapshot.paramMap.get('ponenteId');
    if (![actividad, ponente].every(id => /^[1-9]\d*$/.test(id ?? '') && Number.isSafeInteger(Number(id)))) {
      this.error.set('El reconocimiento solicitado no es válido.'); return;
    }
    this.cargando.set(true);
    this.consulta = this.api.ponentesActividad(Number(actividad)).pipe(timeout(30000), takeUntilDestroyed(this.destroy),
      finalize(() => this.cargando.set(false))).subscribe({
      next: d => {
        const p = d.ponentes.find(f => f.id_actividad_ponente === Number(ponente));
        const e = p?.reconocimiento;
        if (!p || !e || e.id_origen !== Number(ponente) || e.id_actividad !== Number(actividad)
          || e.id_persona !== p.id_persona || e.origen !== 'ponente_actividad' || e.modalidad_reconocimiento !== 'actividad' || e.id_sesion !== null) {
          this.error.set('No se encontró el reconocimiento en esta actividad.'); return;
        }
        this.evaluacion.set(e);
      },
      error: e => this.error.set(e.status === 409 ? e.mensaje : mensajeEtapaA(e)),
    });
  }
}
