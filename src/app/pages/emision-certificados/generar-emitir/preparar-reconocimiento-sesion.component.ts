import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Params, Router, RouterLink } from '@angular/router';
import { Subscription, finalize } from 'rxjs';
import { EvaluacionPonenteSesion } from '../../../core/interfaces/emision-certificados/origenes-certificado.interface';
import { ErrorApi } from '../../../core/interfaces/api/api-response.interface';
import { DocumentoFirmas, DocumentosDigitalesService, mensajeEtapaA } from '../../../core/services/emision-certificados/documentos-digitales.service';
import { PreparacionOrigenComponent } from './preparacion-origen.component';

@Component({
  standalone: true, selector: 'app-preparar-reconocimiento-sesion', imports: [PreparacionOrigenComponent, RouterLink],
  template: `
    @if (evaluacion(); as e) {
      <app-preparacion-origen origen="reconocimiento" [ponente]="e" [asistente]="true" [retorno]="retorno"
        [evaluacionVigente]="vigente()" [consultaExterna]="true" [consultaPendiente]="cargando() || !!error()" [documentoRecuperado]="documento()" />
    } @else {
      <section class="card"><h1>Preparar reconocimiento</h1>
        <a class="btn" routerLink="/certificaciones/generar-emitir" [queryParams]="retorno">Volver a la lista</a>
        @if (cargando()) { <p role="status">Recuperando información del ponente…</p> }
      </section>
    }
    @if (evaluacion() && cargando()) { <small role="status">Consultando preparación guardada…</small> }
    @if (error()) { <p role="alert">{{ error() }}</p>
      <button class="btn" type="button" [disabled]="cargando()" (click)="cargar()">Reintentar consulta</button> }
  `,
})
export class PrepararReconocimientoSesionComponent {
  private readonly router = inject(Router);
  private readonly documentos = inject(DocumentosDigitalesService);
  private readonly destroy = inject(DestroyRef);
  private consulta?: Subscription;
  // No reutilizar history.state en recargas ni navegaciones del historial.
  private readonly contexto = (() => {
    const navegacion = this.router.getCurrentNavigation();
    return navegacion?.trigger === 'imperative' && navegacion.previousNavigation
      ? navegacion.extras.state?.['reconocimientoSesion'] as EvaluacionPonenteSesion | undefined : undefined;
  })();
  protected readonly evaluacion = signal<EvaluacionPonenteSesion | null>(null);
  protected readonly vigente = signal<EvaluacionPonenteSesion | null>(null);
  protected readonly documento = signal<DocumentoFirmas | null>(null);
  protected readonly cargando = signal(false);
  protected readonly error = signal('');
  protected get retorno(): Params {
    const e = this.contexto;
    return e ? { origen: 'ponente_sesion', modalidad: 'sesion', id_actividad: e.id_actividad,
      id_sesion: e.id_sesion, id_tipo_certificado: e.id_tipo_certificado } : { origen_documental: 'reconocimiento' };
  }
  constructor() { this.cargar(); }
  private contextoValido(e: EvaluacionPonenteSesion | undefined): e is EvaluacionPonenteSesion {
    return !!e && e.origen === 'ponente_sesion' && e.modalidad_reconocimiento === 'sesion'
      && e.id_actividad_ponente === e.id_origen
      && [e.id_origen, e.id_sesion, e.id_actividad, e.id_persona, e.id_persona_ponente, e.id_tipo_certificado]
        .every(id => Number.isSafeInteger(id) && Number(id) > 0);
  }
  private coincide(e: EvaluacionPonenteSesion): boolean {
    const contexto = this.contexto;
    return !!contexto && e.origen === 'ponente_sesion' && e.modalidad_reconocimiento === 'sesion'
      && e.id_origen === contexto.id_origen && e.id_actividad_ponente === contexto.id_actividad_ponente
      && e.id_sesion === contexto.id_sesion && e.id_actividad === contexto.id_actividad
      && e.id_persona === contexto.id_persona && e.id_tipo_certificado === contexto.id_tipo_certificado;
  }
  protected cargar(): void {
    this.consulta?.unsubscribe(); this.cargando.set(false); this.error.set('');
    const contexto = this.contexto;
    if (!this.contextoValido(contexto)) {
      this.evaluacion.set(null); this.vigente.set(null); this.documento.set(null);
      void this.router.navigate(['/certificaciones/generar-emitir'], {
        replaceUrl: true, queryParams: { origen_documental: 'reconocimiento' }, state: { seleccionarPonente: true },
      });
      return;
    }
    if (!this.evaluacion()) this.evaluacion.set(contexto);
    this.cargando.set(true);
    this.consulta = this.documentos.consultarReconocimientoSesion(contexto.id_origen, contexto.id_sesion).pipe(
      takeUntilDestroyed(this.destroy), finalize(() => this.cargando.set(false)),
    ).subscribe({
      next: resultado => {
        const guardado = 'id_certificado_documento' in resultado ? resultado : null;
        const e: EvaluacionPonenteSesion = guardado ? {
          origen: 'ponente_sesion', modalidad_reconocimiento: 'sesion', id_origen: guardado.id_actividad_ponente!,
          id_actividad_ponente: guardado.id_actividad_ponente, id_sesion: guardado.id_sesion!,
          id_actividad: guardado.id_actividad, id_persona: guardado.beneficiario?.id_persona,
          id_tipo_certificado: guardado.id_tipo_certificado, tipo_certificado: guardado.tipo_certificado,
          nombres: guardado.beneficiario?.nombre, actividad: guardado.actividad ?? undefined,
          sesion: guardado.sesion ?? undefined, fecha_sesion: guardado.fecha_sesion,
          estado_elegibilidad: 'Pendiente de validación', puede_preparar: false, puede_generar_pdf: false,
          puede_emitir: false, puede_consultar_certificado_existente: true, motivos_bloqueo: [],
          certificados_existentes: [],
        } : resultado as EvaluacionPonenteSesion;
        const anterior = this.evaluacion();
        if (!this.coincide(e) || !guardado && (!Number.isSafeInteger(e.id_persona_ponente)
          || e.id_persona_ponente !== contexto.id_persona_ponente)
          || anterior && (anterior.id_persona !== e.id_persona || anterior.id_actividad !== e.id_actividad
            || anterior.id_tipo_certificado !== e.id_tipo_certificado)
          || guardado && (!Number.isSafeInteger(guardado.id_certificado_documento)
          || guardado.id_certificado_documento < 1 || !guardado.id_certificado)) {
          this.error.set('No se encontró el reconocimiento en esta sesión.'); return;
        }
        // No sustituir el input durante una lectura secundaria: conservar paso y edición local.
        if (!this.evaluacion()) this.evaluacion.set(e);
        this.vigente.set(guardado ? null : e);
        this.documento.set(guardado);
      },
      error: (e: ErrorApi) => this.error.set(e?.status === 409
        ? e.mensaje || 'El servidor no acredita este reconocimiento por sesión.' : mensajeEtapaA(e)),
    });
  }
}
