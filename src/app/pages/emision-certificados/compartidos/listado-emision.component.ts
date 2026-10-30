import { isPlatformBrowser } from '@angular/common';
import { Component, computed, DestroyRef, inject, input, OnChanges, PLATFORM_ID, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorApi } from '../../../core/interfaces/api/api-response.interface';
import { FiltrosEmision, PaginaEmision, RecursoEmision, RegistroEmision } from '../../../core/interfaces/emision-certificados/emision-certificados.interface';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { EmisionCertificadosService, PERMISOS_EMISION } from '../../../core/services/emision-certificados/emision-certificados.service';
import { DialogoConfirmacionComponent } from '../../../shared/components/dialogo-confirmacion/dialogo-confirmacion.component';
import { CONFIGURACION_EMISION, esEditable, esEliminable } from './emision.config';
import { FormularioEmisionComponent } from './formulario-emision.component';

@Component({
  selector: 'app-listado-emision', standalone: true,
  imports: [RouterLink, ReactiveFormsModule, FormularioEmisionComponent, DialogoConfirmacionComponent],
  templateUrl: './listado-emision.component.html', styleUrl: './emision.scss',
})
export class ListadoEmisionComponent implements OnChanges {
  readonly recurso = input.required<RecursoEmision>();
  readonly nuevoUrl = input<string | null>(null);
  readonly editarBase = input<string | null>(null);
  readonly detalleBase = input<string | null>(null);
  readonly filtrosFijos = input<FiltrosEmision>({});
  readonly soloLectura = input(false);
  private readonly api = inject(EmisionCertificadosService);
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly plataforma = inject(PLATFORM_ID);
  private readonly confirmacion = viewChild.required(DialogoConfirmacionComponent);
  private carga?: Subscription;
  private detalleCarga?: Subscription;
  protected readonly config = computed(() => CONFIGURACION_EMISION[this.recurso()]);
  protected readonly editable = computed(() => { const recurso = this.recurso(); return esEditable(recurso) ? recurso : null; });
  protected readonly pagina = signal<PaginaEmision<RegistroEmision> | null>(null);
  protected readonly cargando = signal(false);
  protected readonly errorCarga = signal<string | null>(null);
  protected readonly aviso = signal<string | null>(null);
  protected readonly errorOperacion = signal<string | null>(null);
  protected readonly eliminando = signal(false);
  protected readonly editar = signal<number | null | undefined>(undefined);
  protected readonly detalle = signal<RegistroEmision | null>(null);
  protected readonly cargandoDetalle = signal(false);
  protected readonly filtro = inject(NonNullableFormBuilder).group({ campo: [''], valor: [''] });

  ngOnChanges(): void {
    this.editar.set(undefined);
    this.detalle.set(null);
    if (isPlatformBrowser(this.plataforma)) this.cargar(1);
  }

  protected permitido(accion: string): boolean {
    return this.auth.tienePermiso(`${PERMISOS_EMISION[this.recurso()]}.${accion}`);
  }

  protected puedeEliminar(): boolean { return !this.soloLectura() && esEliminable(this.recurso()) && this.permitido('eliminar'); }

  protected cargar(numero = 1): void {
    this.carga?.unsubscribe();
    this.errorCarga.set(null);
    this.pagina.set(null);
    if (!this.permitido('ver')) { this.errorCarga.set('No tienes permiso para consultar estos registros.'); return; }
    const { campo, valor } = this.filtro.getRawValue();
    const filtros: Record<string, string | number | boolean | null | undefined> = { page: numero, per_page: 20 };
    if (this.config().filtros.some(filtro => filtro.nombre === campo) && valor.trim()) filtros[campo] = valor.trim();
    Object.assign(filtros, this.filtrosFijos());
    this.cargando.set(true);
    this.carga = this.api.listar(this.recurso(), filtros).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: pagina => { this.pagina.set(pagina); this.cargando.set(false); },
      error: (error: ErrorApi) => { this.cargando.set(false); this.errorCarga.set(error.mensaje); },
    });
  }

  protected identificar(registro: RegistroEmision): number { return Number(registro[this.config().clave]); }
  protected mostrar(valor: RegistroEmision[string] | undefined): string {
    return valor === null || valor === undefined || valor === '' ? '—' : typeof valor === 'boolean' ? valor ? 'Sí' : 'No' : String(valor);
  }

  protected verDetalle(registro: RegistroEmision): void {
    this.detalleCarga?.unsubscribe();
    this.detalle.set(null);
    this.errorOperacion.set(null);
    this.cargandoDetalle.set(true);
    this.detalleCarga = this.api.obtener(this.recurso(), this.identificar(registro)).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: detalle => { this.detalle.set(detalle); this.cargandoDetalle.set(false); },
      error: (error: ErrorApi) => { this.errorOperacion.set(error.mensaje); this.cargandoDetalle.set(false); },
    });
  }

  protected camposDetalle() {
    return [...new Map([...this.config().columnas, ...this.config().campos]
      .filter(campo => !['passphrase', 'ruta_archivo', 'ruta_archivo_pfx'].includes(campo.nombre))
      .map(campo => [campo.nombre, campo])).values()];
  }

  protected alGuardar(): void {
    this.editar.set(undefined); this.detalle.set(null); this.aviso.set('Cambios guardados.'); this.cargar(1);
  }

  protected async eliminar(registro: RegistroEmision): Promise<void> {
    const recurso = this.recurso();
    if (this.eliminando() || !this.puedeEliminar() || !esEliminable(recurso)) return;
    if (!await this.confirmacion().abrir()) return;
    this.eliminando.set(true);
    this.errorOperacion.set(null);
    this.api.eliminar(recurso, this.identificar(registro)).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => { this.eliminando.set(false); this.detalle.set(null); this.aviso.set('Registro eliminado.'); this.cargar(1); },
      error: (error: ErrorApi) => { this.eliminando.set(false); this.errorOperacion.set(error.mensaje); },
    });
  }
}
