import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ErrorApi } from '../../../../core/interfaces/api/api-response.interface';
import { CertificadoDocumento } from '../../../../core/interfaces/emision-certificados/emision-certificados.interface';
import { EmisionCertificadosService } from '../../../../core/services/emision-certificados/emision-certificados.service';
import { PageTitleComponent } from '../../../../shared/components/page-title/page-title.component';
import { ListadoEmisionComponent } from '../../compartidos/listado-emision.component';

@Component({
  selector: 'app-consultar-certificado', standalone: true,
  imports: [ReactiveFormsModule, PageTitleComponent, ListadoEmisionComponent],
  templateUrl: './consultar-certificado.component.html', styleUrl: '../../compartidos/emision.scss',
})
export class ConsultarCertificadoComponent {
  private readonly api = inject(EmisionCertificadosService);
  private readonly destroyRef = inject(DestroyRef);
  private peticion?: Subscription;
  protected readonly form = inject(NonNullableFormBuilder).group({ codigo: ['', [Validators.required, Validators.maxLength(30)]] });
  protected readonly cargando = signal(false);
  protected readonly consultado = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly documentos = signal<readonly CertificadoDocumento[]>([]);
  protected readonly historial = signal(false);

  protected consultar(): void {
    if (this.form.invalid || !this.form.controls.codigo.value.trim()) { this.form.markAllAsTouched(); return; }
    this.peticion?.unsubscribe();
    this.cargando.set(true); this.error.set(null); this.documentos.set([]); this.consultado.set(false);
    this.peticion = this.api.listar('certificados-documentos', { codigo_verificacion: this.form.controls.codigo.value.trim() })
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: pagina => { this.documentos.set(pagina.data); this.cargando.set(false); this.consultado.set(true); },
        error: (error: ErrorApi) => { this.error.set(error.mensaje); this.cargando.set(false); },
      });
  }
}
