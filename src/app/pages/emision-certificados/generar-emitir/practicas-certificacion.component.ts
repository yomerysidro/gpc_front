import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { PracticeService } from '../../../core/services/practice/practice.service';
import { EvaluacionPractica } from '../../../core/interfaces/emision-certificados/origenes-certificado.interface';
import { aErrorApi } from '../../../shared/utils/error-api';
import { catchError, forkJoin, of } from 'rxjs';
import { CertificadoCatalogo, estadoDocumentalPractica, FiltrosCatalogo } from '../../../core/interfaces/emision-certificados/catalogo-certificados.interface';
import { EmisionCertificadosService } from '../../../core/services/emision-certificados/emision-certificados.service';

@Component({
  selector: 'app-practicas-certificacion', standalone: true,
  styleUrls: ['../compartidos/emision.scss', './practicas-certificacion.component.scss'],
  template: `
    <h2>Certificación de prácticas</h2>
    <button type="button" class="btn" [disabled]="cargando()" (click)="cargar()">Actualizar prácticas</button>
    @if (cargando()) { <p role="status">Cargando prácticas…</p> }
    @if (error()) { <p role="alert">{{ error() }}</p><button class="btn" (click)="cargar()">Reintentar</button> }
    <div class="tabla-practicas" role="region" aria-label="Certificación de prácticas" tabindex="0"><table><thead><tr><th scope="col" class="col-numero">N.º</th><th scope="col">Practicante</th><th scope="col">Institución</th><th scope="col">Área</th><th scope="col">Carrera</th><th scope="col">Fecha de inicio</th><th scope="col">Fecha de fin</th><th scope="col">Estado</th><th scope="col">Situación de certificación</th><th scope="col">Acción</th></tr></thead><tbody>
    @for (e of filas(); track e.id_origen; let numeroVisual = $index) {
      <tr><td class="col-numero">{{ numeroVisual + 1 }}</td><td>{{ nombre(e) }}</td><td>{{ e.practica.institucion || '—' }}</td><td>{{ e.practica.area || '—' }}</td><td>{{ e.practica.carrera || '—' }}</td><td>{{ e.practica.fecha_inicio || '—' }}</td><td>{{ e.practica.fecha_fin || '—' }}</td><td>{{ e.practica.estado }}</td>
      <td><span class="estado-certificacion" [class.estado-disponible]="estado(e) === 'Certificado confirmado'">{{ estado(e) }}</span></td><td>
      @if (e.certificados_existentes.length) {
        @if (estado(e) === 'Anulado') { <span>Anulado</span> }
        @else { <button class="btn" [disabled]="!puedeAbrirExistente(e)" (click)="abrir(e)">{{ accion(e) }}</button> }
      }
      @else if (!e.finalizacion_registrada) { <span>Primero debe finalizarse la práctica</span> }
      @else { <button class="btn btn-primary" [disabled]="!e.puede_preparar || !e.puede_generar_pdf" (click)="abrir(e)">Preparar certificado</button> }
      </td></tr>
    } @empty { @if (!cargando() && !error()) { <tr><td colspan="10">No hay prácticas disponibles.</td></tr> } }
    </tbody></table></div>
  `,
})
export class PracticasCertificacionComponent {
  private readonly api = inject(PracticeService);
  private readonly catalogo = inject(EmisionCertificadosService);
  private readonly router = inject(Router);
  private readonly destroy = inject(DestroyRef);
  protected readonly filas = signal<readonly EvaluacionPractica[]>([]);
  protected readonly cargando = signal(false);
  protected readonly error = signal('');
  private readonly documentos = signal<ReadonlyMap<number, CertificadoCatalogo>>(new Map());
  constructor() { this.cargar(); }
  protected estado(e: EvaluacionPractica): string {
    const existentes = e.certificados_existentes;
    if (!existentes.length) return 'Pendiente de preparación';
    if (existentes.length !== 1) return 'Estado documental por verificar';
    const c = existentes[0];
    const d = this.documentos().get(c.id_certificado);
    // La evaluación solo informa el estado del certificado y su ID documental.
    // La confirmación administrativa procede del mismo catálogo que Certificados emitidos.
    return estadoDocumentalPractica(d ?? { id_certificado_documento: c.id_certificado_documento, estado_certificado: c.estado });
  }
  protected accion(e: EvaluacionPractica): string {
    const estado = this.estado(e);
    return estado === 'Pendiente de envío a Gerencia' ? 'Continuar preparación'
      : estado === 'Pendiente de firma' ? 'En revisión por Gerencia'
        : estado === 'Certificado confirmado' ? 'Ver certificado' : 'Estado por verificar';
  }
  protected puedeAbrirExistente(e: EvaluacionPractica): boolean {
    const estado = this.estado(e);
    return estado === 'Pendiente de envío a Gerencia'
      || ['Pendiente de firma', 'Certificado confirmado'].includes(estado)
        && !!this.documentos().get(e.certificados_existentes[0]?.id_certificado)?.id_certificado_documento;
  }
  protected nombre(e: EvaluacionPractica): string { return [e.practica.nombres, e.practica.apellido_paterno, e.practica.apellido_materno].filter(Boolean).join(' '); }
  protected cargar(): void {
    if (this.cargando()) return;
    this.cargando.set(true); this.error.set(''); this.documentos.set(new Map());
    this.api.evaluaciones().pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: filas => { this.filas.set(filas); this.cargarEstados(filas); },
      error: e => { this.error.set(aErrorApi(e).mensaje); this.cargando.set(false); },
    });
  }
  private cargarEstados(filas: readonly EvaluacionPractica[]): void {
    const filtros = new Map<string, FiltrosCatalogo>();
    for (const e of filas) {
      if (!e.certificados_existentes.some(c => !['PREPARADO', 'ANULADO'].includes(c.estado.toUpperCase()))) continue;
      const filtro: FiltrosCatalogo = e.id_tipo_certificado
        ? { id_tipo_certificado: String(e.id_tipo_certificado) } : { id_practica: String(e.id_origen) };
      filtros.set(JSON.stringify(filtro), filtro);
    }
    if (!filtros.size) { this.cargando.set(false); return; }
    // Una consulta por tipo documental, no una consulta de práctica por fila.
    forkJoin([...filtros.values()].map(f => this.catalogo.catalogoAutorizado(f, 'certificados-documentos').pipe(
      catchError(() => { this.error.set('No se pudo actualizar el estado de los certificados. Intenta nuevamente.'); return of([] as readonly CertificadoCatalogo[]); }),
    ))).pipe(takeUntilDestroyed(this.destroy)).subscribe(resultados => {
      const documentos = resultados.flat(); const mapa = new Map<number, CertificadoCatalogo>();
      for (const e of filas) for (const c of e.certificados_existentes) {
        const encontrados = documentos.filter(d => d.id_certificado === c.id_certificado
          && d.id_certificado_documento === c.id_certificado_documento && d.id_persona === e.id_persona && d.id_practica === e.id_origen);
        if (encontrados.length === 1) mapa.set(c.id_certificado, encontrados[0]);
      }
      this.documentos.set(mapa); this.cargando.set(false);
    });
  }
  protected abrir(e: EvaluacionPractica): void {
    if (e.certificados_existentes.length) {
      if (!this.puedeAbrirExistente(e)) return;
      if (this.estado(e) !== 'Pendiente de envío a Gerencia') {
        const d = this.documentos().get(e.certificados_existentes[0].id_certificado);
        if (!d?.id_certificado_documento) return;
        void this.router.navigate(['/certificaciones/certificados', d.id_certificado, 'documentos', d.id_certificado_documento, 'visor'], { queryParams: { origen: 'practicas' } });
        return;
      }
    }
    if (!e.certificados_existentes.length && (!e.finalizacion_registrada || !e.puede_preparar || !e.puede_generar_pdf)) return;
    void this.router.navigate(['/certificaciones/generar-emitir/practicas', e.id_origen, 'preparar'], { state: { practica: e } });
  }
}
