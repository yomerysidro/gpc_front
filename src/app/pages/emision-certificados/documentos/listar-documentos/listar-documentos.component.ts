import { CambiosCertificadosService } from '../../../../core/services/emision-certificados/cambios-certificados.service';
﻿import { afterNextRender, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CertificadoCatalogo, estadoCatalogo, origenCatalogo } from '../../../../core/interfaces/emision-certificados/catalogo-certificados.interface';
import { ErrorApi } from '../../../../core/interfaces/api/api-response.interface';
import { EmisionCertificadosService } from '../../../../core/services/emision-certificados/emision-certificados.service';
import { mensajeEtapaA } from '../../../../core/services/emision-certificados/documentos-digitales.service';
import { PageTitleComponent } from '../../../../shared/components/page-title/page-title.component';

@Component({
  selector: 'app-listar-documentos', standalone: true, imports: [PageTitleComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './listar-documentos.component.html', styleUrls: ['../../compartidos/emision.scss', './listar-documentos.component.scss'],
})
export class ListarDocumentosComponent {
  private readonly api = inject(EmisionCertificadosService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroy = inject(DestroyRef);
  private carga?: Subscription;
  protected readonly filas = signal<readonly CertificadoCatalogo[]>([]);
  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly pagina = signal(1);
  protected readonly estadoTexto = estadoCatalogo;
  protected readonly origenTexto = origenCatalogo;
  protected readonly tipos = computed(() => [...new Set(this.filas().map(f => f.tipo_certificado).filter(Boolean))].sort());
  protected readonly filtros = inject(NonNullableFormBuilder).group({ actividad: [''], sesion: [''], nombre: [''], tipo: [''] });
  private readonly valores = toSignal(this.filtros.valueChanges, { initialValue: this.filtros.getRawValue() });
  protected readonly actividades = computed(() => [...new Map(this.filas().filter(f => f.id_actividad && f.actividad).map(f => [f.id_actividad!, f.actividad!])).entries()].sort((a,b) => a[1].localeCompare(b[1], 'es')));
  protected readonly sesiones = computed(() => [...new Map(this.filas().filter(f => String(f.id_actividad) === this.valores().actividad && f.id_sesion && f.sesion).map(f => [f.id_sesion!, f.sesion!])).entries()].sort((a,b) => a[1].localeCompare(b[1], 'es')));
  protected readonly filtrados = computed(() => {
    const f = this.valores(); const nombre = this.normalizar(f.nombre ?? '');
    return this.filas().filter(r => (!f.actividad || String(r.id_actividad) === f.actividad)
      && (!f.sesion || String(r.id_sesion) === f.sesion) && (!f.tipo || r.tipo_certificado === f.tipo) && (!nombre || this.normalizar(r.nombre_completo ?? '').includes(nombre)));
  });
  protected readonly totalPaginas = computed(() => Math.max(1, Math.ceil(this.filtrados().length / 20)));
  protected readonly paginaActual = computed(() => Math.min(this.pagina(), this.totalPaginas()));
  protected readonly visibles = computed(() => this.filtrados().slice((this.paginaActual() - 1) * 20, this.paginaActual() * 20));
  constructor() {
    inject(CambiosCertificadosService).cambios$.pipe(takeUntilDestroyed(this.destroy)).subscribe(() => this.cargar());
    afterNextRender(() => this.cargar());
    this.filtros.controls.actividad.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.filtros.controls.sesion.setValue(''));
    this.filtros.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.pagina.set(1));
  }
  protected cargar(): void {
    this.carga?.unsubscribe(); this.filas.set([]); this.error.set(null); this.cargando.set(true);
    const id = this.route.snapshot.queryParamMap.get('id_certificado');
    this.carga = this.api.catalogoAutorizado(id ? { id_certificado: id } : {}).pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: filas => { this.filas.set(filas); this.cargando.set(false); },
      error: (e: ErrorApi) => { this.error.set(mensajeEtapaA(e)); this.cargando.set(false); },
    });
  }
  protected tienePdf(fila: CertificadoCatalogo): boolean { return !!fila.id_certificado_documento && !!fila.hash_pdf && !!fila.codigo_verificacion; }
  private normalizar(texto: string): string { return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLocaleLowerCase('es'); }
}
