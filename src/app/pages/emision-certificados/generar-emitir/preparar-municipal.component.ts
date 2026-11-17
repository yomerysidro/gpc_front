import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DocumentoOrigenAdministrativo, EvaluacionOrigen, puedeVerDocumentoAdministrativo, puedeDescargarDocumentoAdministrativo } from '../../../core/interfaces/emision-certificados/origenes-certificado.interface';
import { EmisionCertificadosService } from '../../../core/services/emision-certificados/emision-certificados.service';
import { DocumentoFirmas, DocumentosDigitalesService, mensajeEtapaA } from '../../../core/services/emision-certificados/documentos-digitales.service';
import { PreparacionOrigenComponent } from './preparacion-origen.component';
import { MunicipalContextoService } from './municipal-contexto.service';
import { recuperarMunicipal } from './municipales-individuales.component';
import { estadoDocumentalPractica } from '../../../core/interfaces/emision-certificados/catalogo-certificados.interface';
import { VisorPdfComponent } from '../compartidos/visor-pdf.component';

@Component({
  standalone: true, imports: [PreparacionOrigenComponent, RouterLink, VisorPdfComponent],
  styleUrls: ['../compartidos/emision.scss', './reconocimiento-asistente.scss'],
  template: `@if (original(); as o) {
    <section class="reconocimiento-asistente"><header class="titulo-asistente"><a class="btn regreso-asistente" routerLink="/certificaciones/generar-emitir" [queryParams]="{ origen_documental: 'reconocimiento' }" aria-label="Volver al listado"><span class="material-symbols-outlined" aria-hidden="true">arrow_back</span></a><h1>Certificado</h1></header>
      <h2>{{ o.beneficiario.nombre }}</h2><p>Estado documental: {{ o.estado_certificado }} · {{ o.estado_documento }}</p>
      @if (detalleOriginal(); as d) { <app-visor-pdf [documentoId]="d.id_certificado_documento" [urlAdministrativa]="o.url_documento" [hashEsperado]="d.hash_pdf" [permitirDescarga]="descargaPermitida(o, d)" [persistido]="true" [integrado]="true" [ajustarAncho]="true" [controlesZoom]="true" /> }
    </section>
  } @else { @if (evaluacion(); as e) {
    <app-preparacion-origen origen="reconocimiento" [municipal]="e" [asistente]="true" [consultaExterna]="true"
      [consultaPendiente]="recuperando()" [documentoRecuperado]="documento()" [retorno]="{ origen_documental: 'reconocimiento' }" />
  } @else {
    <section class="card"><a routerLink="/certificaciones/generar-emitir" [queryParams]="{ origen_documental: 'reconocimiento' }">← Volver al listado</a><h1>Datos del certificado</h1>
    </section>
  } } @if (error()) { <p role="alert">{{ error() }}</p> }`,
})
export class PrepararMunicipalComponent {
  private readonly api = inject(EmisionCertificadosService);
  private readonly documentos = inject(DocumentosDigitalesService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroy = inject(DestroyRef);
  protected readonly evaluacion = signal<EvaluacionOrigen | null>(null);
  protected readonly documento = signal<DocumentoFirmas | null>(null);
  protected readonly error = signal('');
  protected readonly recuperando = signal(false);
  protected readonly original = signal<DocumentoOrigenAdministrativo | null>(null);
  protected readonly detalleOriginal = signal<DocumentoFirmas | null>(null);
  protected descargaPermitida(o: DocumentoOrigenAdministrativo, d: DocumentoFirmas): boolean {
    return puedeDescargarDocumentoAdministrativo(o) && puedeDescargarDocumentoAdministrativo(d);
  }
  constructor() {
    const contexto = inject(MunicipalContextoService);
    const id = Number(this.route.snapshot.paramMap.get('reconocimientoId'));
    const seleccionado = contexto.seleccionado; contexto.seleccionado = null;
    if (!Number.isSafeInteger(id) || id < 1) { this.error.set('Reconocimiento no válido.'); return; }
    if (seleccionado?.evaluacion.id_origen === id) { this.aplicar(seleccionado.evaluacion, seleccionado.documento); return; }
    this.api.evaluarOrigen('reconocimiento', id).pipe(takeUntilDestroyed(this.destroy))
      .subscribe({ next: e => this.aplicar(e, null), error: e => this.error.set(mensajeEtapaA(e)) });
  }
  private aplicar(e: EvaluacionOrigen, d: DocumentoFirmas | null): void {
    if (e.origen !== 'reconocimiento' || !Number.isSafeInteger(e.id_persona) || e.id_persona < 1 || !e.reconocimiento?.nombres) {
      this.error.set('No se pudo identificar al beneficiario municipal.'); return;
    }
    if (e.documento_existente && (e.documento_existente.origen !== 'reconocimiento'
      || e.documento_existente.estado_certificado !== 'PREPARADO' || this.route.snapshot.data?.['visorMunicipal'])) {
      this.abrirOriginal(e, e.documento_existente); return;
    }
    if (e.modalidad_reconocimiento && e.modalidad_reconocimiento !== 'individual') { this.error.set('Documento no disponible.'); return; }
    if (d && estadoDocumentalPractica(d) === 'Certificado confirmado') {
      void this.router.navigate(['/certificaciones/certificados', d.id_certificado, 'documentos', d.id_certificado_documento, 'visor'], { replaceUrl: true }); return;
    }
    this.documento.set(d); this.evaluacion.set(e);
    if (!d && (e.certificados_existentes.length || e.documento_existente)) {
      this.recuperando.set(true);
      recuperarMunicipal(this.api, this.documentos, e).pipe(takeUntilDestroyed(this.destroy)).subscribe({
        next: doc => { this.documento.set(doc); this.recuperando.set(false); },
        error: err => { this.error.set(mensajeEtapaA(err)); /* Mantener preparación bloqueada hasta recuperar. */ },
      });
    }
  }
  private abrirOriginal(e: EvaluacionOrigen, o: DocumentoOrigenAdministrativo): void {
    if (o.id_reconocimiento !== e.id_origen || o.beneficiario.id_persona !== e.id_persona
      || !puedeVerDocumentoAdministrativo(o) || estadoDocumentalPractica(o) === 'Anulado') {
      this.error.set('Sin acceso al PDF.'); return;
    }
    this.original.set(o);
    this.documentos.detalleFirmas(o.id_certificado_documento).pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: d => {
        if (d.id_certificado !== o.id_certificado || d.id_certificado_documento !== o.id_certificado_documento
          || d.origen !== o.origen || d.beneficiario?.id_persona !== o.beneficiario.id_persona
          || (d.id_actividad ?? null) !== o.id_actividad || (d.id_sesion ?? null) !== o.id_sesion
          || !puedeVerDocumentoAdministrativo(d) || d.url_documento !== o.url_documento
          || estadoDocumentalPractica(d) === 'Anulado') { this.error.set('No se pudo autorizar el documento original.'); return; }
        this.original.set({ ...o, estado_certificado: d.estado_certificado, estado_documento: d.estado_documento ?? o.estado_documento });
        this.detalleOriginal.set(d);
      }, error: err => this.error.set(mensajeEtapaA(err)),
    });
  }
}
