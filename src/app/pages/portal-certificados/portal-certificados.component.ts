import { afterNextRender, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, distinctUntilChanged, EMPTY, filter, from, map, mergeMap, Subscription, switchMap, tap, throwError } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CertificadoPublico, FORMATO_CODIGO_PUBLICO, PortalCertificadosService } from '../../core/services/emision-certificados/portal-certificados.service';
import { ArchivoPdf } from '../../core/interfaces/emision-certificados/documento-digital.interface';
import { PdfContinuoComponent } from '../emision-certificados/compartidos/pdf-continuo.component';

@Component({
  selector: 'app-portal-certificados', standalone: true,
  imports: [ReactiveFormsModule, DatePipe, PdfContinuoComponent, RouterLink],
  templateUrl: './portal-certificados.component.html',
  styleUrl: './portal-certificados.component.scss',
})
export class PortalCertificadosComponent {
  private readonly api = inject(PortalCertificadosService);
  private readonly destroy = inject(DestroyRef);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly route = inject(ActivatedRoute, { optional: true });
  private readonly codigoInicial = this.route?.snapshot.queryParamMap.get('codigo') ?? null;
  private consulta?: Subscription;
  private descarga?: Subscription;
  protected readonly dni = this.fb.control('', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]);
  protected readonly codigo = this.fb.control('', [Validators.required, Validators.pattern(FORMATO_CODIGO_PUBLICO)]);
  protected readonly modo = signal<'dni' | 'codigo'>('dni');
  protected readonly cargando = signal(false);
  private readonly pendienteQr = signal(this.codigoInicial !== null && FORMATO_CODIGO_PUBLICO.test(this.codigoInicial));
  protected readonly mostrandoCarga = computed(() => this.pendienteQr() || this.cargando());
  protected readonly cargandoPdf = signal(false);
  protected readonly mensaje = signal('');
  protected readonly reintento = signal<{ abrirPdf: boolean } | null>(null);
  protected readonly errorPdf = signal('');
  protected readonly resultado = signal<CertificadoPublico | null>(null);
  protected readonly resultadosDni = signal<readonly CertificadoPublico[] | null>(null);
  protected readonly codigosVerificadosDni = signal<ReadonlySet<string>>(new Set());
  protected readonly tarjetas = computed(() => this.modo() === 'dni' ? this.resultadosDni() ?? []
    : this.resultado() ? [this.resultado()!] : []);
  protected readonly detalle = signal(false);
  protected readonly archivo = signal<ArchivoPdf | null>(null);
  protected readonly urlDescarga = signal<string | null>(null);

  constructor() {
    if (this.codigoInicial !== null) {
      this.modo.set('codigo');
      this.codigo.setValue(this.codigoInicial);
    }
    afterNextRender(() => {
      this.route?.queryParamMap.pipe(map(q => q.get('codigo')), distinctUntilChanged(),
        takeUntilDestroyed(this.destroy)).subscribe(codigo => {
          if (codigo === null) return;
          this.cambiarModo('codigo'); this.codigo.setValue(codigo); this.buscar(true);
        });
      this.pendienteQr.set(false);
    });
    this.destroy.onDestroy(() => this.limpiarPdf());
    this.dni.valueChanges.pipe(takeUntilDestroyed(this.destroy)).subscribe(() => this.limpiar());
    this.codigo.valueChanges.pipe(takeUntilDestroyed(this.destroy)).subscribe(() => this.limpiar());
  }

  protected cambiarModo(modo: 'dni' | 'codigo'): void {
    if (this.modo() === modo) return;
    this.limpiar(); this.modo.set(modo);
  }

  protected nuevaConsulta(): void {
    this.limpiar(); this.dni.reset(''); this.codigo.reset('');
  }

  protected claveTarjeta(certificado: CertificadoPublico): string { return certificado.referencia ?? certificado.codigo; }

  protected buscar(abrirPdf = false): void {
    const control = this.modo() === 'dni' ? this.dni : this.codigo;
    control.markAsTouched();
    if (control.invalid || this.cargando()) return;
    this.limpiar(); this.cargando.set(true);
    if (this.modo() === 'dni') {
      this.consulta = this.api.consultarDni(this.dni.value).pipe(
        tap(certificados => {
          this.cargando.set(false);
          this.resultadosDni.set(certificados);
        }),
        switchMap(certificados => {
          const codigos = new Set(certificados.filter(r => r.estado === 'disponible').map(r => r.codigo));
          return from(codigos).pipe(
            mergeMap(codigo => this.api.confirmarVigenciaEIntegridad(codigo).pipe(
              filter(confirmado => confirmado),
              map(() => codigo),
              catchError(e => e?.status === 429 ? throwError(() => e) : EMPTY),
            ), 3),
            catchError(() => EMPTY),
          );
        }),
        takeUntilDestroyed(this.destroy),
      ).subscribe({
        next: codigo => this.codigosVerificadosDni.update(codigos => new Set([...codigos, codigo])),
        error: e => {
          this.cargando.set(false);
          this.registrarReintento(e?.status, false);
          this.mensaje.set(e?.status === 429 ? 'Has realizado varias consultas. Espera un momento antes de intentar nuevamente.'
            : e?.status === 422 ? 'Revisa que el DNI tenga ocho dígitos.'
            : e?.status === 401 || e?.status === 403 ? 'Esta consulta pública no está autorizada.'
            : 'No se pudo realizar la consulta. Intenta nuevamente en unos momentos.');
        },
      });
      return;
    }
    this.consulta = this.api.verificar(this.codigo.value).pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: r => {
        this.cargando.set(false); this.resultado.set(r);
        if (abrirPdf && r.urlPdf) this.verCertificado(r);
      },
      error: e => {
        this.cargando.set(false);
        this.registrarReintento(e?.status, abrirPdf);
        this.mensaje.set(e?.status === 404 ? 'No se encontró un certificado con ese código. Verifica que esté escrito correctamente.'
          : e?.status === 422 ? 'Revisa el código de verificación ingresado.'
          : e?.status === 429 ? 'Has realizado varias consultas. Espera un momento antes de intentar nuevamente.'
          : e?.status === 403 || e?.status === 401 ? 'Esta consulta pública no está autorizada.'
          : e?.status === 409 ? 'El certificado todavía no está disponible para consulta pública.'
          : 'No se pudo conectar con el servicio. Intenta nuevamente en unos momentos.');
      },
    });
  }

  protected verCertificado(certificado?: CertificadoPublico): void {
    const r = certificado ?? this.resultado();
    if (!r || r.estado !== 'disponible' || !r.urlPdf || this.cargandoPdf()) return;
    this.limpiarPdf();
    this.resultado.set(r); this.detalle.set(true); this.errorPdf.set(''); this.cargandoPdf.set(true);
    this.descarga = this.api.archivo(r).pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: archivo => {
        this.archivo.set(archivo); this.urlDescarga.set(URL.createObjectURL(archivo.blob)); this.cargandoPdf.set(false);
      },
      error: e => {
        this.cargandoPdf.set(false);
        if ([401, 403, 404, 409].includes(e?.status)) {
          const privado = { ...r, urlPdf: null };
          this.resultado.set(privado);
          this.resultadosDni.update(filas => filas?.map(fila => fila.codigo === r.codigo ? privado : fila) ?? null);
        }
        this.errorPdf.set([401, 403, 404, 409].includes(e?.status)
          ? 'El documento no está autorizado para visualización o descarga pública.'
          : 'No se pudo cargar el PDF. Intenta nuevamente.');
      },
    });
  }

  protected volver(): void { this.limpiarPdf(); this.detalle.set(false); if (this.modo() === 'dni') this.resultado.set(null); }
  protected falloVisor(): void { this.errorPdf.set('No se pudo visualizar el PDF. Puedes descargar el archivo autorizado.'); }

  private registrarReintento(estado: number | undefined, abrirPdf: boolean): void {
    if (!estado || estado >= 500) this.reintento.set({ abrirPdf });
  }

  private limpiarPdf(): void {
    this.descarga?.unsubscribe();
    const url = this.urlDescarga(); if (url) URL.revokeObjectURL(url);
    this.urlDescarga.set(null); this.archivo.set(null); this.errorPdf.set(''); this.cargandoPdf.set(false);
  }
  private limpiar(): void {
    this.consulta?.unsubscribe(); this.cargando.set(false); this.mensaje.set(''); this.resultado.set(null);
    this.resultadosDni.set(null);
    this.reintento.set(null);
    this.codigosVerificadosDni.set(new Set());
    this.limpiarPdf(); this.detalle.set(false);
  }
}
