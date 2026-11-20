import { Component, DestroyRef, inject, OnInit, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { FirmantesMunicipalesService } from '../../../../core/services/emision-certificados/firmantes-municipales.service';
import { TrabajadorMunicipal } from '../../../../core/interfaces/emision-certificados/trabajador-municipal.interface';
import { ErrorApi } from '../../../../core/interfaces/api/api-response.interface';
import { AuthService } from '../../../../core/services/autenticacion/auth.service';

@Component({ selector: 'app-listar-firmas', standalone: true, imports: [FormsModule], templateUrl: './listar-firmas.component.html', styleUrls: ['../../compartidos/emision.scss', './listar-firmas.component.scss'] })
export class ListarFirmasComponent implements OnInit {
  private readonly api = inject(FirmantesMunicipalesService);
  private readonly auth = inject(AuthService);
  private readonly destroy = inject(DestroyRef);
  readonly trabajadores = signal<TrabajadorMunicipal[]>([]);
  readonly cargando = signal(false);
  readonly guardando = signal<number | null>(null);
  readonly confirmarBaja = signal<TrabajadorMunicipal | null>(null);
  readonly firmanteImagen = signal<TrabajadorMunicipal | null>(null);
  readonly vistaFirma = signal('');
  private imagenFirma: File | null = null;
  readonly error = signal('');
  readonly aviso = signal('');
  readonly busqueda = signal('');
  readonly filtrados = computed(() => {
    const normalizar = (texto: string) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();
    const consulta = normalizar(this.busqueda().trim());
    return this.trabajadores().filter(t => normalizar(`${t.nombre} ${t.cargo ?? ''} ${t.area ?? ''}`).includes(consulta));
  });
  ngOnInit(): void {
    this.destroy.onDestroy(() => this.limpiarImagen());
    this.cargar();
  }
  puedeAdministrar(): boolean { return this.auth.tienePermiso('ponentes-firmantes.editar'); }
  ocupada(): boolean { return this.cargando() || this.guardando() !== null; }
  puedeHabilitar(t: TrabajadorMunicipal): boolean { return t.vigente && t.elegible_laboralmente; }
  habilitar(t: TrabajadorMunicipal): void {
    if (!this.puedeAdministrar() || this.ocupada() || this.confirmarBaja()) return;
    const actual = this.trabajadores().find(f => f.id_persona_trabajador === t.id_persona_trabajador);
    if (!actual || actual.habilitado_firma_certificados || !this.puedeHabilitar(actual)) return;
    this.persistir(actual, true);
  }
  solicitarBaja(t: TrabajadorMunicipal): void {
    if (!this.puedeAdministrar() || this.ocupada()) return;
    const actual = this.trabajadores().find(f => f.id_persona_trabajador === t.id_persona_trabajador);
    if (!actual?.habilitado_firma_certificados) return;
    this.aviso.set(''); this.error.set(''); this.confirmarBaja.set(actual);
  }
  cancelarBaja(): void { if (!this.ocupada()) this.confirmarBaja.set(null); }
  deshabilitar(): void {
    const t = this.confirmarBaja();
    if (!t || !this.puedeAdministrar() || this.ocupada()) return;
    this.persistir(t, false);
  }
  abrirImagen(t: TrabajadorMunicipal): void {
    if (!this.puedeAdministrar() || this.ocupada() || !this.puedeHabilitar(t)) return;
    this.limpiarImagen();
    this.error.set(''); this.aviso.set('');
    this.firmanteImagen.set(t);
  }
  elegirImagen(input: HTMLInputElement): void {
    this.limpiarImagen();
    this.error.set('');
    const imagen = input.files?.[0];
    if (!imagen) return;
    if (!['image/png', 'image/jpeg'].includes(imagen.type) || !imagen.size || imagen.size > 1024 * 1024) {
      input.value = '';
      this.error.set('Selecciona una imagen PNG o JPEG de hasta 1 MB.');
      return;
    }
    this.imagenFirma = imagen;
    this.vistaFirma.set(URL.createObjectURL(imagen));
  }
  cancelarImagen(): void {
    if (this.ocupada()) return;
    this.limpiarImagen();
    this.firmanteImagen.set(null);
    this.error.set('');
  }
  guardarImagen(): void {
    const trabajador = this.firmanteImagen();
    if (!trabajador || !this.imagenFirma || !this.puedeAdministrar() || this.ocupada()) return;
    this.persistir(trabajador, true, this.imagenFirma);
  }
  private limpiarImagen(): void {
    const vista = this.vistaFirma();
    if (vista) URL.revokeObjectURL(vista);
    this.vistaFirma.set('');
    this.imagenFirma = null;
  }
  private persistir(t: TrabajadorMunicipal, habilitado: boolean, imagen?: File): void {
    this.guardando.set(t.id_persona_trabajador); this.error.set(''); this.aviso.set('');
    const operacion = habilitado
      ? (imagen ? this.api.habilitar(t.id_persona_trabajador, imagen) : this.api.habilitar(t.id_persona_trabajador))
      : this.api.deshabilitar(t.id_persona_trabajador);
    operacion.pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: actualizado => {
        this.trabajadores.update(filas => filas.map(f => f.id_persona_trabajador === actualizado.id_persona_trabajador ? actualizado : f));
        this.guardando.set(null); this.confirmarBaja.set(null);
        if (imagen) {
          this.limpiarImagen();
          this.firmanteImagen.set(null);
        }
        this.aviso.set(imagen ? 'Imagen de firma guardada.' : habilitado ? 'Funcionario habilitado.' : 'Funcionario deshabilitado.');
        this.cargar();
      },
      error: e => {
        this.guardando.set(null);
        this.error.set(imagen && e.status === 422
          ? 'No se pudo guardar la imagen. Usa un PNG o JPEG de hasta 1 MB y 1600 × 800 píxeles.'
          : this.mensaje(e));
      },
    });
  }
  cargar(): void {
    if (this.ocupada()) return;
    this.cargando.set(true); this.error.set('');
    this.api.cargar().pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: trabajadores => { this.trabajadores.set(trabajadores); this.cargando.set(false); this.confirmarBaja.set(null); },
      error: e => { this.cargando.set(false); this.error.set(this.mensaje(e)); },
    });
  }
  private mensaje(e: Partial<ErrorApi>): string {
    switch (e.status) {
      case 401: return 'Su sesión ha vencido. Inicie sesión nuevamente.';
      case 403: return 'No tiene permiso para administrar firmantes municipales.';
      case 404: return 'El trabajador no está disponible o está fuera de su ámbito.';
      case 409: return 'No se pudo completar el cambio. Actualice el listado y revise el estado laboral.';
      case 422: return 'No se pudo procesar el trabajador seleccionado. Actualice el listado.';
      default: return 'No se pudo confirmar la operación. Actualice el listado antes de reintentar.';
    }
  }
}
