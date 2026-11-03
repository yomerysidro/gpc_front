import { Component, DestroyRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { DocumentoPendiente, PaginaSolicitudes } from '../../../core/interfaces/solicitudes/solicitud.interface';
import { SolicitudesService, mensajeSolicitudes } from '../../../core/services/solicitudes/solicitudes.service';
import { PageTitleComponent } from '../../../shared/components/page-title/page-title.component';
import { DialogoComponent } from '../../../shared/components/dialogo/dialogo.component';
import { IntegracionAvisoComponent } from '../../solicitudes/compartidos/integracion-aviso.component';
import { DocumentoPendienteCardComponent } from './documento-pendiente-card.component';
@Component({
  selector: 'app-documentos-por-firmar', standalone: true,
  imports: [PageTitleComponent, DialogoComponent, IntegracionAvisoComponent, DocumentoPendienteCardComponent],
  templateUrl: './documentos-por-firmar.component.html', styleUrl: '../../solicitudes/compartidos/solicitudes.scss',
})
export class DocumentosPorFirmarComponent implements OnInit {
  protected readonly api = inject(SolicitudesService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly sanitizer = inject(DomSanitizer);
  protected readonly pagina = signal<PaginaSolicitudes<DocumentoPendiente> | null>(null);
  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly errorDocumento = signal<string | null>(null);
  protected readonly cargandoDocumento = signal(false);
  protected readonly documentoUrl = signal<SafeResourceUrl | null>(null);
  protected readonly dialogo = viewChild.required(DialogoComponent);
  private url: string | null = null;
  private carga?: Subscription;
  private cargaDocumento?: Subscription;
  constructor() { this.destroyRef.onDestroy(() => this.liberar()); }
  ngOnInit(): void { this.cargar(); }
  protected cargar(numero = 1): void {
    this.carga?.unsubscribe(); this.error.set(null); this.cargando.set(true); this.pagina.set(null);
    this.carga = this.api.documentos(numero).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: pagina => { this.pagina.set(pagina); this.cargando.set(false); }, error: error => { this.error.set(mensajeSolicitudes(error)); this.cargando.set(false); },
    });
  }
  protected ver(documento: DocumentoPendiente): void {
    if (!documento.puedeVer) return;
    this.cargaDocumento?.unsubscribe(); this.liberar(); this.errorDocumento.set(null); this.cargandoDocumento.set(true); this.dialogo().abrir();
    this.cargaDocumento = this.api.documento(documento.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: archivo => {
        this.cargandoDocumento.set(false);
        if (archivo.type !== 'application/pdf' || !archivo.size) { this.errorDocumento.set('El servidor no devolvió un PDF válido.'); return; }
        this.url = URL.createObjectURL(archivo);
        // Únicamente Blob PDF autenticado; nunca una URL privada recibida como cadena.
        this.documentoUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(this.url));
      }, error: error => { this.errorDocumento.set(mensajeSolicitudes(error)); this.cargandoDocumento.set(false); },
    });
  }
  protected cerrar(): void { this.cargaDocumento?.unsubscribe(); this.liberar(); }
  private liberar(): void { if (this.url) URL.revokeObjectURL(this.url); this.url = null; this.documentoUrl.set(null); }
}
