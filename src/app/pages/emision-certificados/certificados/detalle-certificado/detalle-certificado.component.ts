import { afterNextRender, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, of, switchMap, tap } from 'rxjs';
import { ErrorApi } from '../../../../core/interfaces/api/api-response.interface';
import { CertificadoRow } from '../../../../core/interfaces/emision-certificados/emision-certificados.interface';
import { EmisionCertificadosService } from '../../../../core/services/emision-certificados/emision-certificados.service';
import { PageTitleComponent } from '../../../../shared/components/page-title/page-title.component';
import { HasPermissionDirective } from '../../../../shared/directives/has-permission.directive';
import { CONFIGURACION_EMISION } from '../../compartidos/emision.config';

@Component({
  selector: 'app-detalle-certificado', standalone: true,
  imports: [RouterLink, PageTitleComponent, HasPermissionDirective],
  templateUrl: './detalle-certificado.component.html', styleUrl: '../../compartidos/emision.scss',
})
export class DetalleCertificadoComponent {
  private readonly api = inject(EmisionCertificadosService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly certificado = signal<CertificadoRow | null>(null);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly campos = CONFIGURACION_EMISION.certificados.campos;

  constructor() {
    afterNextRender(() => {
      this.route.paramMap.pipe(
        tap(() => { this.certificado.set(null); this.cargando.set(true); this.error.set(null); }),
        switchMap(parametros => {
          const id = Number(parametros.get('id'));
          if (!Number.isSafeInteger(id) || id <= 0) {
            this.error.set('El identificador no es válido.'); return of(null);
          }
          return this.api.obtener('certificados', id).pipe(catchError((error: ErrorApi) => {
            this.error.set(error.mensaje); return of(null);
          }));
        }), takeUntilDestroyed(this.destroyRef),
      ).subscribe(certificado => { this.certificado.set(certificado); this.cargando.set(false); });
    });
  }

  protected mostrar(valor: CertificadoRow[string]): string {
    return valor === null ? '—' : typeof valor === 'boolean' ? valor ? 'Sí' : 'No' : String(valor);
  }
}
