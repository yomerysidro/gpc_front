import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { catchError, from, map, mergeMap, Observable, of, switchMap, timeout } from 'rxjs';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { EvaluacionOrigen, puedeVerDocumentoAdministrativo } from '../../../core/interfaces/emision-certificados/origenes-certificado.interface';
import { estadoDocumentalPractica } from '../../../core/interfaces/emision-certificados/catalogo-certificados.interface';
import { EmisionCertificadosService } from '../../../core/services/emision-certificados/emision-certificados.service';
import { DocumentoFirmas, DocumentosDigitalesService, mensajeEtapaA } from '../../../core/services/emision-certificados/documentos-digitales.service';
import { MunicipalContextoService } from './municipal-contexto.service';

export function recuperarMunicipal(api: EmisionCertificadosService, documentos: DocumentosDigitalesService, e: EvaluacionOrigen): Observable<DocumentoFirmas | null> {
  if (!e.certificados_existentes.length && !e.documento_existente) return of(null);
  const c = e.certificados_existentes[0];
  if (e.certificados_existentes.length !== 1 || !e.puede_consultar_certificado_existente || c.id_persona !== e.id_persona
    || c.id_reconocimiento !== e.id_origen || c.id_tipo_certificado !== e.id_tipo_certificado) throw new Error('No se pudo acreditar un único certificado municipal.');
  return documentos.consultarReconocimiento(e.id_origen).pipe(map(d => {
    if (!('id_certificado_documento' in d) || d.id_certificado !== c.id_certificado || d.origen !== 'reconocimiento' || d.beneficiario?.id_persona !== e.id_persona
      || d.id_tipo_certificado !== e.id_tipo_certificado || d.id_sesion != null) throw new Error('El documento no corresponde al beneficiario municipal.');
    return d;
  }));
}

interface Fila { id: number; nombre: string; estado: string; evaluacion?: EvaluacionOrigen; documento?: DocumentoFirmas | null; error?: string }
@Component({
  standalone: true, selector: 'app-municipales-individuales',
  template: `<button class="btn" [disabled]="cargando()" (click)="cargar()">Actualizar</button>
    @if (error()) { <p role="alert">{{ error() }}</p> }
    <div class="tabla"><table class="table"><thead><tr><th>Origen</th><th>Estado del origen</th><th>Acción</th></tr></thead><tbody>
    @for (f of filas(); track f.id) { <tr><td>{{ f.nombre }}</td><td>{{ f.estado }}</td><td><button class="btn" [disabled]="!habilitada(f)" (click)="abrir(f)">{{ accion(f) }}</button>
      @if (f.evaluacion?.documento_existente; as d) { <small>Estado documental: {{ d.estado_certificado }} · {{ d.estado_documento }}</small> }
      @if (f.error || f.evaluacion?.motivo_documento || f.evaluacion?.motivos_bloqueo?.length) { <details><summary>Detalles</summary><p>{{ f.error || f.evaluacion?.motivo_documento }}</p>@for (motivo of f.evaluacion?.motivos_bloqueo ?? []; track motivo) { <p>{{ motivo }}</p> }</details> }
    </td></tr> }
    </tbody></table></div>`,
})
export class MunicipalesIndividualesComponent {
  private readonly api = inject(EmisionCertificadosService);
  private readonly documentos = inject(DocumentosDigitalesService);
  private readonly contexto = inject(MunicipalContextoService);
  private readonly router = inject(Router);
  private readonly destroy = inject(DestroyRef);
  private readonly auth = inject(AuthService);
  protected readonly filas = signal<readonly Fila[]>([]);
  protected readonly cargando = signal(false);
  protected readonly error = signal('');
  constructor() { this.cargar(); }
  protected cargar(): void {
    if (this.cargando()) return;
    if (!this.auth.tienePermiso('reconocimientos.ver')) { this.error.set('No tienes permiso para consultar reconocimientos.'); return; }
    this.cargando.set(true); this.error.set(''); this.filas.set([]);
    this.api.listarTodos('reconocimientos').pipe(timeout(30000), switchMap(datos => {
      const filas = datos.map(r => ({ id: r.id_reconocimiento, nombre: r.titulo, estado: r.estado }));
      this.filas.set(filas);
      // Solo evaluaciones del origen y metadatos documentales. Nunca descarga PDF en la tabla.
      return from(filas).pipe(mergeMap(f => this.api.evaluarOrigen('reconocimiento', f.id).pipe(
        map(e => ({ ...f, evaluacion: e })),
        timeout(30000), catchError(() => of({ ...f, error: 'No se pudo verificar el reconocimiento. Actualiza el listado.' })),
      ), 4));
    }), takeUntilDestroyed(this.destroy)).subscribe({
      next: fila => this.filas.update(filas => filas.map(f => f.id === fila.id ? fila : f)),
      complete: () => this.cargando.set(false),
      error: e => { this.cargando.set(false); this.error.set(mensajeEtapaA(e)); },
    });
  }
  protected accion(f: Fila): string {
    if (f.error) return 'No disponible';
    const e = f.evaluacion; if (!e) return 'Verificando elegibilidad';
    if (!Number.isSafeInteger(e.id_persona) || e.id_persona < 1 || !e.reconocimiento?.nombres) return 'Beneficiario no identificado';
    const original = e.documento_existente;
    if (original) {
      if (estadoDocumentalPractica(original) === 'Anulado') return 'Anulado';
      const visible = original.beneficiario.id_persona === e.id_persona && original.id_reconocimiento === e.id_origen
        && puedeVerDocumentoAdministrativo(original);
      if (!visible) return 'Sin acceso al PDF';
      if (original.origen === 'reconocimiento' && original.estado_certificado === 'PREPARADO') return 'Continuar preparación';
      return 'Ver certificado';
    }
    if (e.documentos_existentes?.length || e.puede_consultar_documento_original || e.modalidad_reconocimiento && e.modalidad_reconocimiento !== 'individual') return 'Documento no disponible';
    if (f.documento) {
      const estado = estadoDocumentalPractica(f.documento);
      if (estado === 'Pendiente de envío a Gerencia') return 'Continuar preparación';
      if (estado === 'Certificado confirmado') return 'Ver certificado';
      if (estado === 'Pendiente de firma') return 'En revisión por Gerencia';
      return estado;
    }
    return e.puede_preparar && e.puede_generar_pdf && e.estado_elegibilidad === 'Elegible' && !e.certificados_existentes.length
      ? 'Preparar certificado' : 'No elegible';
  }
  protected habilitada(f: Fila): boolean { return ['Preparar certificado', 'Continuar preparación', 'Ver certificado'].includes(this.accion(f)); }
  protected abrir(f: Fila): void {
    if (!f.evaluacion || !this.habilitada(f)) return;
    if (this.accion(f) === 'Ver certificado' && f.evaluacion.documento_existente) {
      this.contexto.seleccionado = { evaluacion: f.evaluacion, documento: null };
      void this.router.navigate(['/certificaciones/generar-emitir/reconocimientos/documento-original', f.id]); return;
    }
    if (this.accion(f) === 'Ver certificado' && f.documento) {
      void this.router.navigate(['/certificaciones/certificados', f.documento.id_certificado, 'documentos', f.documento.id_certificado_documento, 'visor']); return;
    }
    this.contexto.seleccionado = { evaluacion: f.evaluacion, documento: f.documento ?? null };
    void this.router.navigate(['/certificaciones/generar-emitir/reconocimientos/individual', f.id]);
  }
}
