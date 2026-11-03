import { DatePipe, isPlatformBrowser } from '@angular/common';
import { Component, inject, input, PLATFORM_ID } from '@angular/core';
import { CertificadoDocumento, CertificadoFirma, Reconocimiento } from '../../../core/interfaces/emision-certificados/emision-certificados.interface';
import { documentoAnulado, etiquetaEstado } from './estado-emision';
import { DatosPreparacion } from '../../../core/interfaces/emision-certificados/preparacion-documental.interface';

export interface FirmanteVista { readonly cargo: string; readonly trabajador: number }

/** Vista preliminar de datos autorizados. No representa el contenido de un PDF oficial. */
@Component({
  selector: 'app-visor-certificado', standalone: true, imports: [DatePipe],
  templateUrl: './visor-certificado.component.html', styleUrl: './visor-certificado.component.scss',
})
export class VisorCertificadoComponent {
  readonly certificado = input<DatosPreparacion | null>(null);
  readonly beneficiario = input<string | null>(null);
  protected readonly anulado = documentoAnulado;
  protected readonly estadoRegistro = etiquetaEstado;
  readonly documento = input<CertificadoDocumento | null>(null);
  readonly tipo = input<string | null>(null);
  readonly origen = input<string | null>(null);
  readonly reconocimiento = input<Reconocimiento | null>(null);
  readonly firmas = input<readonly CertificadoFirma[]>([]);
  readonly firmantes = input<Readonly<Record<number, FirmanteVista>>>({});
  readonly errorFirmas = input<string | null>(null);
  readonly cargandoFirmas = input(false);
  private readonly plataforma = inject(PLATFORM_ID);

  protected imprimir(): void {
    if (isPlatformBrowser(this.plataforma) && this.certificado() && !documentoAnulado(this.documento()?.estado) && !this.cargandoFirmas()) window.print();
  }
}
