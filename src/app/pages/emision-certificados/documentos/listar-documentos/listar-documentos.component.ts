import { DatePipe } from '@angular/common';
import { afterNextRender, Component, computed, DestroyRef, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, forkJoin, from, map, mergeMap, of, Subscription, switchMap, toArray } from 'rxjs';
import { CertificadoDocumento, CertificadoRow } from '../../../../core/interfaces/emision-certificados/emision-certificados.interface';
import { ErrorApi } from '../../../../core/interfaces/api/api-response.interface';
import { EmisionCertificadosService } from '../../../../core/services/emision-certificados/emision-certificados.service';
import { PageTitleComponent } from '../../../../shared/components/page-title/page-title.component';
import { DialogoComponent } from '../../../../shared/components/dialogo/dialogo.component';
interface DocumentoVista { readonly documento: CertificadoDocumento; readonly certificado: CertificadoRow | null; readonly beneficiario: string; readonly tipo: string; readonly origen: string; readonly aviso: string | null; }
@Component({
  selector: 'app-listar-documentos', standalone: true,
  imports: [RouterLink, PageTitleComponent, DialogoComponent, DatePipe, ReactiveFormsModule],
  templateUrl: './listar-documentos.component.html', styleUrls: ['../../compartidos/emision.scss', './listar-documentos.component.scss'],
})
export class ListarDocumentosComponent {
  private readonly parametros = toSignal(inject(ActivatedRoute).queryParamMap, { requireSync: true });
  private readonly api = inject(EmisionCertificadosService);
  private readonly destroyRef = inject(DestroyRef);
  private carga?: Subscription;
  protected readonly filas = signal<readonly DocumentoVista[]>([]);
  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly aviso = signal<string | null>(null);
  protected readonly pagina = signal(1);
  protected readonly detalle = signal<DocumentoVista | null>(null);
  protected readonly dialogo = viewChild.required(DialogoComponent);
  protected readonly filtros = inject(NonNullableFormBuilder).group({ busqueda: [''], estado: [''], tipo: [''], origen: [''] });
  private readonly valores = toSignal(this.filtros.valueChanges, { initialValue: this.filtros.getRawValue() });
  protected readonly estados = computed(() => [...new Set(this.filas().map(fila => fila.documento.estado))]);
  protected readonly tipos = computed(() => [...new Set(this.filas().map(fila => fila.tipo))]);
  protected readonly filtrados = computed(() => {
    const filtro = this.valores(); const id = this.parametros().get('id_certificado'); const texto = this.normalizar(filtro.busqueda ?? '');
    return this.filas().filter(fila => (!id || String(fila.documento.id_certificado) === id) && (!filtro.estado || fila.documento.estado === filtro.estado)
      && (!filtro.tipo || fila.tipo === filtro.tipo) && (!filtro.origen || fila.origen === filtro.origen)
      && (!texto || this.normalizar(`${fila.beneficiario} ${fila.documento.codigo_verificacion}`).includes(texto)));
  });
  protected readonly totalPaginas = computed(() => Math.max(1, Math.ceil(this.filtrados().length / 12)));
  protected readonly paginaActual = computed(() => Math.min(this.pagina(), this.totalPaginas()));
  protected readonly visibles = computed(() => this.filtrados().slice((this.paginaActual() - 1) * 12, this.paginaActual() * 12));
  constructor() { afterNextRender(() => this.cargar()); this.filtros.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.pagina.set(1)); }
  protected cargar(): void {
    this.carga?.unsubscribe(); this.filas.set([]); this.error.set(null); this.aviso.set(null); this.cargando.set(true); this.pagina.set(1);
    this.carga = forkJoin({ documentos: this.api.listarTodos('certificados-documentos'),
      tipos: this.api.listarTodos('tipos-certificado').pipe(catchError((error: ErrorApi) => { this.aviso.set('Tipos: ' + error.mensaje); return of([]); })),
    }).pipe(switchMap(({ documentos, tipos }) => from([...new Set(documentos.map(documento => documento.id_certificado))]).pipe(
      mergeMap(id => this.api.obtener('certificados', id).pipe(
        switchMap(certificado => this.api.personaReconocimiento(certificado.id_persona).pipe(
          map(persona => ({ id, certificado, beneficiario: [persona.nombres, persona.apellido_paterno, persona.apellido_materno].filter(Boolean).join(' '), aviso: null })),
          catchError((error: ErrorApi) => of({ id, certificado, beneficiario: 'Beneficiario no disponible', aviso: error.mensaje })),
        )), catchError((error: ErrorApi) => of({ id, certificado: null, beneficiario: 'Beneficiario no disponible', aviso: error.mensaje })),
      ), 4), toArray(), map(relaciones => documentos.map(documento => {
        const relacion = relaciones.find(fila => fila.id === documento.id_certificado); const certificado = relacion?.certificado ?? null;
        return { documento, certificado, beneficiario: relacion?.beneficiario ?? 'Beneficiario no disponible', aviso: relacion?.aviso ?? null,
          tipo: tipos.find(tipo => tipo.id_tipo_certificado === certificado?.id_tipo_certificado)?.nombre_tipo ?? 'Tipo no disponible',
          origen: certificado?.id_participacion ? 'Participación' : certificado?.id_reconocimiento ? 'Reconocimiento' : certificado?.id_practica ? 'Prácticas' : 'Origen no disponible' };
      })),
    )), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: filas => { this.filas.set(filas); this.cargando.set(false); }, error: (error: ErrorApi) => { this.error.set(error.mensaje); this.cargando.set(false); },
    });
  }
  protected ver(fila: DocumentoVista): void { this.detalle.set(fila); this.dialogo().abrir(); }
  private normalizar(texto: string): string { return texto.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase(); }
}
