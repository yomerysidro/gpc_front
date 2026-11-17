import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { estadoDocumentalPractica } from '../../../core/interfaces/emision-certificados/catalogo-certificados.interface';
import { CambiosCertificadosService } from '../../../core/services/emision-certificados/cambios-certificados.service';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { validarMensajeCertificado } from '../../../core/services/emision-certificados/vista-previa-pdf';
import { EvaluacionPractica } from '../../../core/interfaces/emision-certificados/origenes-certificado.interface';
import { ArchivoPdf } from '../../../core/interfaces/emision-certificados/documento-digital.interface';
import { PracticeService } from '../../../core/services/practice/practice.service';
import { DocumentoFirmas, DocumentosDigitalesService, RevisionDocumental, mensajeEtapaA } from '../../../core/services/emision-certificados/documentos-digitales.service';
import { ErrorApi } from '../../../core/interfaces/api/api-response.interface';
import { aErrorApi } from '../../../shared/utils/error-api';
import { VisorPdfComponent } from '../compartidos/visor-pdf.component';

@Component({
  standalone: true, selector: 'app-preparar-practica', imports: [RouterLink, VisorPdfComponent, ReactiveFormsModule],
  styleUrls: ['../compartidos/emision.scss', './reconocimiento-asistente.scss'],
  template: `
  <section class="reconocimiento-asistente">
    <header class="titulo-asistente">
      <a class="btn regreso-asistente" routerLink="/certificaciones/generar-emitir" [queryParams]="{ origen_documental: 'practica' }" aria-label="Volver a prácticas"><span class="material-symbols-outlined">arrow_back</span></a>
      <h1>Preparar certificado de prácticas</h1>
    </header>
    <ol class="pasos-reconocimiento">@for (titulo of pasos; track $index) { <li [attr.aria-current]="paso() === $index + 1 ? 'step' : null">{{ $index + 1 }}. {{ titulo }}</li> }</ol>
    @if (ocupado()) { <p role="status">{{ operacion() }}</p> }
    @if (error()) { <p class="alert alert-error" role="alert">{{ error() }}</p><button class="btn" [disabled]="ocupado()" (click)="reintentar()">Reintentar</button> }
    @if (evaluacion(); as e) {
      <section class="contenido-paso">
      @if (paso() === 1) {
        <h2>Datos del certificado</h2><dl class="resumen-reconocimiento ficha-reconocimiento">
          <div><dt>Practicante</dt><dd>{{ nombre() }}</dd></div>
          <div><dt>Tipo de certificado</dt><dd>{{ e.tipo_certificado || 'Prácticas' }}</dd></div>
          <div><dt>Institución</dt><dd>{{ e.practica.institucion || '—' }}</dd></div>
          <div><dt>Área municipal</dt><dd>{{ e.practica.area || '—' }}</dd></div>
          <div><dt>Carrera</dt><dd>{{ e.practica.carrera || '—' }}</dd></div>
          <div><dt>Fecha de inicio</dt><dd>{{ e.practica.fecha_inicio || '—' }}</dd></div>
          <div><dt>Fecha de finalización</dt><dd>{{ e.practica.fecha_fin || '—' }}</dd></div>
          <div><dt>Estado</dt><dd>{{ e.finalizacion_registrada ? 'Finalizado' : e.practica.estado }}</dd></div>
          <div><dt>Elegibilidad</dt><dd>{{ e.estado_elegibilidad }}</dd></div>
        </dl>
      }
      @if (paso() === 2) {
        <h2>Mensaje del certificado</h2>
        <p id="mensaje-practicas-ayuda">{{ documento() ? 'Este es el mensaje aprobado del documento preparado. Su contenido se conserva sin cambios.' : 'Puedes conservar el texto predeterminado o personalizarlo antes de preparar el certificado.' }}</p>
        @if (cargandoMensaje()) { <small role="status">Cargando mensaje…</small> }
        @if (errorMensaje()) { <p role="alert">{{ errorMensaje() }}</p><button type="button" class="btn" [disabled]="cargandoMensaje()" (click)="consultarMensaje()">Reintentar consulta</button> }
        <label class="form-field">Mensaje
          <textarea class="input mensaje" rows="8" [formControl]="mensajeCertificado" [readonly]="!!documento() || evaluacion()?.texto_editable === false || ocupado()" aria-describedby="mensaje-practicas-ayuda mensaje-practicas-contador" [attr.aria-invalid]="mensajeCertificado.invalid && mensajeCertificado.dirty"></textarea>
        </label>
        <small id="mensaje-practicas-contador">{{ caracteresMensaje() }} / 1.200 caracteres</small>
        @if (mensajeCertificado.invalid && (mensajeCertificado.dirty || mensajeCertificado.touched) && !documento()) {
          <p role="alert">Escribe un mensaje de texto plano, no vacío y de hasta 1.200 caracteres, sin HTML ni caracteres de control.</p>
        }
        @if (documento() && !documento()?.mensaje_aprobado && !documento()?.mensaje && !revision()?.mensaje) {
          @if (archivo(); as pdf) { <app-visor-pdf [archivoPrevio]="pdf" [persistido]="true" [integrado]="true" [ajustarAncho]="true" /> }
        }
      }
      @if (paso() === 3) {
        <h2>Previsualización</h2>
        @if (archivo(); as pdf) { <app-visor-pdf [archivoPrevio]="pdf" [persistido]="!!documento()" [integrado]="true" [ajustarAncho]="true" (archivoVisualizado)="visualizado.set($event)" (errorVisualizacion)="visualizado.set(null)" /> }
        @if (!documento()) {
          <button class="btn confirmar" [disabled]="!puedeConfirmar()" (click)="confirmar()">Confirmar preparación</button>
          @if (revisionVencida()) { <p>La revisión venció. Solicite una nueva revisión para confirmar.</p><button class="btn" [disabled]="ocupado()" (click)="renovarRevision()">Revisar nuevamente</button> }
        }
        @else { <p role="status">Documento preparado: {{ documento()?.estado_certificado }}</p> }
      }
      @if (paso() === 4) {
        <h2>Enviar a Gerencia</h2>
        @if (puedeEnviar()) {
          <p>El certificado está listo para enviarse a Gerencia.</p>
          <button class="btn btn-primary" [disabled]="ocupado() || cargandoMensaje()" (click)="enviar()">Enviar a Gerencia</button>
        } @else { <p role="status">{{ estadoDocumento() }}</p> }
      }
      </section>
      <nav class="acciones-paso">
        <button class="btn" [disabled]="ocupado() || paso() === 1" (click)="anterior()">Anterior</button>
        @if (paso() < 4) { <button class="btn btn-primary" [disabled]="!puedeAvanzar()" (click)="siguiente()">Siguiente</button> }
      </nav>
    }
  </section>`,
})
export class PrepararPracticaComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(PracticeService);
  private readonly documentos = inject(DocumentosDigitalesService);
  private readonly cambios = inject(CambiosCertificadosService);
  private readonly destroy = inject(DestroyRef);
  private readonly id = Number(this.route.snapshot.paramMap.get('practicaId'));
  protected readonly pasos = ['Datos del certificado', 'Mensaje', 'Previsualización', 'Enviar a Gerencia'];
  protected readonly paso = signal(1);
  protected readonly evaluacion = signal<EvaluacionPractica | null>(null);
  protected readonly documento = signal<DocumentoFirmas | null>(null);
  protected readonly revision = signal<RevisionDocumental | null>(null);
  protected readonly archivo = signal<ArchivoPdf | null>(null);
  protected readonly visualizado = signal<ArchivoPdf | null>(null);
  protected readonly ocupado = signal(false);
  protected readonly operacion = signal('');
  protected readonly error = signal('');
  protected readonly mensajeCertificado = inject(NonNullableFormBuilder).control('', [validarMensajeCertificado,
    c => /[^\p{Z}\s\p{Cf}]/u.test(c.value) ? null : { mensaje: true }]);
  protected readonly cargandoMensaje = signal(false);
  protected readonly errorMensaje = signal('');
  private pendienteRecuperacion = false;
  private mensajeEditado = false;
  private repetir: () => void = () => this.cargar();

  constructor() {
    this.mensajeCertificado.valueChanges.pipe(takeUntilDestroyed(this.destroy)).subscribe(() => {
      if (!this.documento()) { this.mensajeEditado = true; this.revision.set(null); this.archivo.set(null); this.visualizado.set(null); }
    });
    const navigation = this.router.getCurrentNavigation();
    const e = navigation?.trigger === 'imperative' ? navigation.extras.state?.['practica'] as EvaluacionPractica | undefined : undefined;
    if (e?.origen === 'practica' && e.id_origen === this.id) {
      this.evaluacion.set(e);
      this.iniciarMensaje(e);
    } else this.cargar();
  }
  protected caracteresMensaje(): number { return Array.from(this.mensajeCertificado.value).length; }
  private iniciarMensaje(e: EvaluacionPractica): void {
    const certificado = e.certificados_existentes.length === 1 ? e.certificados_existentes[0] : null;
    if (certificado && String(certificado.estado).toUpperCase() !== 'PREPARADO' && certificado.id_certificado_documento) {
      this.verDocumento(certificado.id_certificado, certificado.id_certificado_documento); return;
    }
    if (e.certificados_existentes.length) { this.consultarMensaje(); return; }
    const mensaje = e.mensaje ?? e.mensaje_predeterminado;
    if (typeof mensaje === 'string') this.aplicarMensaje(mensaje);
    else this.consultarMensaje();
  }
  private aplicarMensaje(mensaje: string): void {
    if (!this.mensajeEditado && !this.mensajeCertificado.dirty) this.mensajeCertificado.setValue(mensaje, { emitEvent: false });
  }
  protected nombre(): string {
    const d = this.evaluacion()?.practica;
    return [d?.nombres, d?.apellido_paterno, d?.apellido_materno].filter(Boolean).join(' ');
  }
  private ejecutar<T>(fuente: Observable<T>, texto: string, exito: (valor: T) => void, repetir: () => void, fallo?: () => void): void {
    if (this.ocupado()) return;
    this.ocupado.set(true); this.operacion.set(texto); this.error.set(''); this.repetir = repetir;
    fuente.pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: v => { this.ocupado.set(false); exito(v); },
      error: err => {
        this.ocupado.set(false);
        fallo?.();
        const e: ErrorApi = err?.mensaje ? err : aErrorApi(err);
        this.error.set(e.status === 409 ? e.mensaje : mensajeEtapaA(e));
      },
    });
  }
  protected reintentar(): void { if (!this.ocupado()) { this.error.set(''); this.repetir(); } }
  private cargar(): void {
    if (!Number.isSafeInteger(this.id) || this.id < 1) { this.error.set('La práctica no es válida. Vuelva al listado.'); return; }
    this.ejecutar(this.api.evaluar(this.id), 'Recuperando práctica…', e => {
      this.evaluacion.set(e);
      this.iniciarMensaje(e);
    }, () => this.cargar());
  }
  private recuperar(): void { this.consultarMensaje(); }
  protected consultarMensaje(): void {
    if (this.cargandoMensaje()) return;
    this.cargandoMensaje.set(true); this.errorMensaje.set('');
    this.documentos.consultarPractica(this.id).pipe(takeUntilDestroyed(this.destroy)).subscribe({ next: resultado => {
      this.cargandoMensaje.set(false);
      if ('id_certificado_documento' in resultado) {
        const e = this.evaluacion();
        if (!e || resultado.beneficiario?.id_persona !== e.id_persona || resultado.id_tipo_certificado !== e.id_tipo_certificado) {
          this.errorMensaje.set('El documento no corresponde al practicante seleccionado.'); return;
        }
        if (resultado.estado_certificado !== 'PREPARADO' || estadoDocumentalPractica(resultado) !== 'Pendiente de envío a Gerencia') {
          if (resultado.id_certificado) this.verDocumento(resultado.id_certificado, resultado.id_certificado_documento);
          return;
        }
        this.documento.set(resultado); this.pendienteRecuperacion = false;
        this.mensajeCertificado.setValue(resultado.mensaje_aprobado ?? resultado.mensaje ?? '', { emitEvent: false });
        this.mensajeCertificado.markAsPristine();
        this.revision.set(null); this.archivo.set(null); this.visualizado.set(null);
        this.error.set('');
        if (this.paso() === 3) this.cargarArchivo();
      } else {
        const e = resultado as EvaluacionPractica;
        this.evaluacion.set(e); this.pendienteRecuperacion = false;
        this.aplicarMensaje(e.mensaje ?? e.mensaje_predeterminado ?? '');
        this.error.set('');
      }
    }, error: err => {
      this.cargandoMensaje.set(false);
      const e = err?.mensaje ? err : aErrorApi(err);
      this.errorMensaje.set(e.status === 409 ? e.mensaje : mensajeEtapaA(e));
    } });
  }
  protected puedeAvanzar(): boolean {
    if (this.ocupado() || this.paso() >= 4) return false;
    if (this.paso() === 1) return !!this.evaluacion();
    if (this.error() || this.cargandoMensaje() || this.errorMensaje()) return false;
    if (this.documento()) return this.paso() !== 3 || !!this.archivo() && this.visualizado() === this.archivo();
    const e = this.evaluacion();
    return this.paso() === 2 && this.mensajeCertificado.valid && e?.texto_editable !== false && !!e?.finalizacion_registrada && e.puede_preparar && e.puede_generar_pdf && !e.certificados_existentes.length && !this.pendienteRecuperacion;
  }
  protected siguiente(): void {
    if (!this.puedeAvanzar()) return;
    if (this.paso() === 1) { this.paso.set(2); return; }
    this.paso.update(p => p + 1);
    if (this.paso() === 3) {
      if (this.documento()) this.cargarArchivo();
      else if (!this.revision() || this.revisionVencida()) this.renovarRevision();
    }
  }
  private cargarArchivo(): void {
    const d = this.documento(); if (!d || this.archivo()) return;
    this.ejecutar(this.documentos.archivo(d.id_certificado_documento, false, d.hash_pdf), 'Cargando certificado…', pdf => this.archivo.set(pdf), () => this.cargarArchivo());
  }
  protected anterior(): void {
    if (!this.ocupado() && this.paso() > 1) {
      if (!this.pendienteRecuperacion) this.error.set('');
      this.paso.update(p => p - 1);
    }
  }
  protected puedeConfirmar(): boolean {
    const r = this.revision();
    return !this.ocupado() && !this.documento() && !!r && r.mensaje === this.mensajeCertificado.value && this.visualizado() === r.archivo && Date.parse(r.expiresAt) > Date.now() && !this.pendienteRecuperacion;
  }
  protected revisionVencida(): boolean { const r = this.revision(); return !!r && Date.parse(r.expiresAt) <= Date.now(); }
  protected renovarRevision(): void {
    if (this.ocupado() || this.documento() || this.pendienteRecuperacion || this.mensajeCertificado.invalid || this.paso() !== 3) return;
    const mensaje = this.mensajeCertificado.value;
    this.revision.set(null); this.archivo.set(null); this.visualizado.set(null);
    this.ejecutar(this.documentos.revisarOrigen('practica', this.id, undefined, mensaje), 'Generando vista previa…', r => {
      if (this.mensajeCertificado.value !== mensaje) return;
      if (r.mensaje !== mensaje) { this.error.set('La revisión no corresponde al mensaje escrito.'); return; }
      this.revision.set(r); this.archivo.set(r.archivo);
    }, () => this.renovarRevision());
  }
  protected confirmar(): void {
    const r = this.revision(); const e = this.evaluacion();
    if (!this.puedeConfirmar() || !r || !e) return;
    this.ejecutar(this.documentos.guardarOrigen(e, r), 'Confirmando preparación…', d => {
      this.documento.set(d); this.pendienteRecuperacion = false;
      this.mensajeCertificado.setValue(d.mensaje_aprobado ?? d.mensaje ?? r.mensaje ?? '', { emitEvent: false });
      this.paso.set(4); this.cambios.confirmar();
    }, () => this.recuperar(), () => {
      this.pendienteRecuperacion = true; this.revision.set(null); this.archivo.set(null); this.visualizado.set(null);
      this.repetir = () => { this.paso.set(2); this.recuperar(); };
    });
  }
  protected puedeEnviar(): boolean {
    const d = this.documento(); return !!d && estadoDocumentalPractica(d) === 'Pendiente de envío a Gerencia' && d.facultades?.remitir === true;
  }
  protected estadoDocumento(): string {
    const d = this.documento(); return d ? estadoDocumentalPractica(d) : 'Sin documento';
  }
  protected enviar(): void {
    const d = this.documento();
    if (!d || this.paso() !== 4 || this.ocupado() || this.cargandoMensaje() || !this.puedeEnviar()) return;
    // El único clic aprueba enviar los mismos bytes revisados en el paso 3.
    // La revisión de envío valida identidad/hash y entrega el token obligatorio.
    this.ejecutar(this.documentos.obtenerRevisionEnvio(d.id_certificado_documento, d.hash_pdf).pipe(
      switchMap(r => this.documentos.confirmarEnvio(d.id_certificado_documento, r.token, r.hash)),
    ), 'Enviando a Gerencia…', doc => {
      this.documento.set(doc); this.cambios.confirmar();
    }, () => this.recuperar());
  }
  private verDocumento(certificado: number, documento: number): void {
    void this.router.navigate(['/certificaciones/certificados', certificado, 'documentos', documento, 'visor'],
      { replaceUrl: true, queryParams: { origen: 'practicas' } });
  }
}
