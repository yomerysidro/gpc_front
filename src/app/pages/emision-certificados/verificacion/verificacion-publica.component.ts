import { afterNextRender, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, distinctUntilChanged, map, Subscription } from 'rxjs';
import { DocumentosDigitalesService, mensajeDocumento } from '../../../core/services/emision-certificados/documentos-digitales.service';
import { VerificacionDocumento } from '../../../core/interfaces/emision-certificados/documento-digital.interface';
import { ErrorApi } from '../../../core/interfaces/api/api-response.interface';
import { VisorPdfComponent } from '../compartidos/visor-pdf.component';

/** Consulta pública sin servicios administrativos, auth/me ni credenciales JWT. */
@Component({
  selector: 'app-verificacion-publica', standalone: true, imports: [ReactiveFormsModule, DatePipe, VisorPdfComponent],
  template: `
    <main class="verificacion-publica">
      <header><img src="/marca/escudo-160.webp" alt="Escudo de la Municipalidad Distrital de Morales" width="72" height="72" /><div><p>Municipalidad Distrital de Morales</p><h1>Consulta de certificados</h1></div></header>
      <section class="card" aria-labelledby="consulta-publica-titulo">
        <h2 id="consulta-publica-titulo">Consultar el registro del documento</h2>
        <form [formGroup]="form" (ngSubmit)="consultar()">
          <label for="codigo-publico">Código de verificación</label><div class="consulta"><input id="codigo-publico" class="input" formControlName="codigo" maxlength="30" autocomplete="off" autocapitalize="none" spellcheck="false" aria-describedby="codigo-ayuda" [attr.aria-invalid]="form.controls.codigo.touched && form.invalid" /><button class="btn btn-consulta" [disabled]="cargando() || form.invalid">Consultar autenticidad</button></div>
          <small id="codigo-ayuda">Ingresa el código de 30 caracteres del documento. El QR por sí solo no acredita validez.</small>
        </form>
        @if (cargando()) { <p role="status">Consultando el registro en Laravel…</p> }
        @if (error()) { <p class="alert alert-error" role="alert">{{ error() }}</p> }
      </section>
      @if (resultado(); as r) {
        <section class="card resultado" aria-live="polite"><h2>{{ estado() }}</h2>
          <dl><dt>Código</dt><dd>{{ r.codigo_verificacion }}</dd><dt>Estado del certificado</dt><dd>{{ r.estado_certificado }}</dd><dt>Estado del documento</dt><dd>{{ r.estado_documento }}</dd><dt>Fecha de emisión</dt><dd>{{ r.fecha_emision ? (r.fecha_emision | date:'dd/MM/yyyy') : 'No informada' }}</dd><dt>Generación</dt><dd>{{ r.fecha_generacion | date:'dd/MM/yyyy HH:mm' }}</dd><dt>Integridad del archivo</dt><dd>{{ r.integridad_verificada ? 'Confirmada por Laravel' : 'No confirmada' }}</dd><dt>Emisión oficial</dt><dd>{{ r.emision_oficial_verificada ? 'Confirmada por Laravel' : 'No acreditada' }}</dd><dt>Firma criptográfica</dt><dd>{{ r.firma_verificada ? 'Confirmada por Laravel' : 'No acreditada' }}</dd></dl>
          @for (motivo of r.motivos; track motivo) { <p class="motivo">{{ motivo }}</p> }
          @if (r.registro_encontrado && r.integridad_verificada && r.vigente && r.puede_ver_documento && r.url_documento) {
            <button class="btn" (click)="verPdf.set(!verPdf())">{{ verPdf() ? 'Ocultar PDF' : 'Ver PDF auténtico' }}</button>
            @if (verPdf()) { <app-visor-pdf [urlPublica]="r.url_documento" [codigo]="r.codigo_verificacion" /> }
          }
          <p class="privacidad">Solo se presentan los datos públicos autorizados por Laravel.</p>
        </section>
      }
    </main>`,
  styles: `:host{display:block;background:#f3f6fa;min-height:100vh;color:#173049}.verificacion-publica{max-width:64rem;margin:auto;padding:clamp(1rem,4vw,3rem)}header{display:flex;gap:1rem;align-items:center;margin-bottom:2rem}header img{object-fit:contain}h1{font-size:clamp(1.3rem,3vw,2rem);margin:0}header p{margin:0 0 .4rem}.card{padding:clamp(1rem,3vw,2rem);background:#fff;border:1px solid #dae3ec;border-radius:1rem;margin-bottom:1rem;box-shadow:0 8px 24px #12345608}.consulta{display:flex;gap:.7rem;margin:.5rem 0}.input{min-width:0;flex:1}dl{display:grid;grid-template-columns:minmax(9rem,1fr) 2fr;gap:.8rem}dt{font-weight:600}dd{margin:0;overflow-wrap:anywhere}.motivo,.privacidad,small{color:#4d6072}.resultado{border-top:4px solid #075a9b}@media(max-width:560px){.consulta{flex-direction:column}dl{grid-template-columns:1fr;gap:.4rem}dd{margin-bottom:.7rem}}`,
})
export class VerificacionPublicaComponent {
  private readonly api = inject(DocumentosDigitalesService);
  private readonly destroyRef = inject(DestroyRef);
  private peticion?: Subscription;
  protected readonly form = inject(NonNullableFormBuilder).group({ codigo: ['', [Validators.required, Validators.pattern(/^[a-f0-9]{30}$/)]] });
  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly resultado = signal<VerificacionDocumento | null>(null);
  protected readonly verPdf = signal(false);
  protected readonly estado = computed(() => {
    const r = this.resultado(); if (!r?.registro_encontrado) return 'Registro no encontrado';
    const estados = [r.estado_documento, r.estado_certificado].map(e => e.trim().toLowerCase());
    if (estados.includes('revocado')) return 'Certificado revocado';
    if (estados.includes('anulado')) return 'Documento anulado';
    if (!r.integridad_verificada) return 'Integridad del archivo no confirmada';
    if (r.vigente) return 'Documento vigente según Laravel';
    return 'Registro encontrado · vigencia no acreditada';
  });
  constructor() {
    const route = inject(ActivatedRoute);
    afterNextRender(() => combineLatest([route.paramMap, route.queryParamMap]).pipe(map(([p, q]) => p.get('codigo') ?? q.get('codigo') ?? ''), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef)).subscribe(codigo => {
      this.peticion?.unsubscribe(); this.resultado.set(null); this.error.set(null); this.cargando.set(false); this.verPdf.set(false);
      this.form.controls.codigo.setValue(codigo);
      if (codigo && this.form.valid) this.consultar();
    }));
    this.form.controls.codigo.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.peticion?.unsubscribe(); this.cargando.set(false); this.resultado.set(null); this.error.set(null); this.verPdf.set(false);
    });
  }
  protected consultar(): void {
    if (this.form.invalid || this.cargando()) { this.form.markAllAsTouched(); return; }
    const codigo = this.form.controls.codigo.value;
    this.peticion?.unsubscribe(); this.resultado.set(null); this.verPdf.set(false); this.error.set(null); this.cargando.set(true);
    this.peticion = this.api.verificar(codigo).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: r => { this.resultado.set(r); this.cargando.set(false); },
      error: (e: ErrorApi) => { this.error.set(e.status === 404 ? 'Código inexistente: Laravel no encontró el certificado.' : mensajeDocumento(e)); this.cargando.set(false); },
    });
  }
}
