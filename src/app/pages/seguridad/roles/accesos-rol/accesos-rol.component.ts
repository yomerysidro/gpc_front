import { afterNextRender, Component, computed, HostListener, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin, switchMap } from 'rxjs';
import { ConCambiosPendientes } from '../../../../core/guards/cambios-pendientes.guard';
import { ErrorApi } from '../../../../core/interfaces/api/api-response.interface';
import { Modulo, Permiso } from '../../../../core/interfaces/roles/modulo.interface';
import { Rol } from '../../../../core/interfaces/roles/rol.interface';
import { AuthService } from '../../../../core/services/autenticacion/auth.service';
import { ModulosService } from '../../../../core/services/modulos/modulos.service';
import { RolesService } from '../../../../core/services/roles/roles.service';
import {
  ACCIONES_BASICAS,
  aPayload,
  cambiarAccesoModulo,
  cambiarPermiso,
  crearEstado,
  EstadoAccesos,
  filasDeMatriz,
  mismoEstado,
} from '../../../../models/roles/matriz-accesos.model';
import { DialogoConfirmacionComponent } from '../../../../shared/components/dialogo-confirmacion/dialogo-confirmacion.component';
import { PageTitleComponent } from '../../../../shared/components/page-title/page-title.component';

interface Aviso {
  readonly tipo: 'exito' | 'error';
  readonly texto: string;
  readonly detalle: readonly string[];
}

const ROL_ADMINISTRADOR = 'Administrador';
const TITULOS = { ver: 'Ver', crear: 'Crear', editar: 'Editar', eliminar: 'Eliminar' } as const;

/** /roles/:id/accesos: matriz de módulos y permisos del rol (reglas en models/roles/matriz-accesos.model.ts). */
@Component({
  selector: 'app-accesos-rol',
  standalone: true,
  imports: [RouterLink, PageTitleComponent, DialogoConfirmacionComponent],
  templateUrl: './accesos-rol.component.html',
  styleUrl: './accesos-rol.component.scss'
})
export class AccesosRolComponent implements ConCambiosPendientes {
  private readonly rolesService = inject(RolesService);
  private readonly modulosService = inject(ModulosService);
  private readonly auth = inject(AuthService);
  private readonly idRol = Number(inject(ActivatedRoute).snapshot.paramMap.get('id'));
  private readonly confirmacion = viewChild.required(DialogoConfirmacionComponent);

  protected readonly acciones = ACCIONES_BASICAS;
  protected readonly titulos = TITULOS;
  protected readonly rol = signal<Rol | null>(null);
  protected readonly catalogo = signal<readonly Modulo[]>([]);
  protected readonly filas = computed(() => filasDeMatriz(this.catalogo()));
  private readonly inicial = signal<EstadoAccesos>(crearEstado([], []));
  protected readonly estado = signal<EstadoAccesos>(crearEstado([], []));
  protected readonly hayCambios = computed(() => !mismoEstado(this.inicial(), this.estado()));
  protected readonly esAdministrador = computed(() => this.rol()?.nombre === ROL_ADMINISTRADOR);

  protected readonly cargando = signal(true);
  protected readonly errorCarga = signal<string | null>(null);
  protected readonly guardando = signal(false);
  protected readonly aviso = signal<Aviso | null>(null);

  constructor() {
    afterNextRender(() => this.cargar());
  }

  protected tieneModulo(modulo: Modulo): boolean {
    return this.estado().modulos.has(modulo.id);
  }

  protected tienePermiso(permiso: Permiso): boolean {
    return this.estado().permisos.has(permiso.id);
  }

  protected alternarModulo(modulo: Modulo, evento: Event): void {
    this.estado.update(estado => cambiarAccesoModulo(estado, modulo, (evento.target as HTMLInputElement).checked));
  }

  protected alternarPermiso(modulo: Modulo, permiso: Permiso, evento: Event): void {
    this.estado.update(estado => cambiarPermiso(estado, modulo, permiso, (evento.target as HTMLInputElement).checked));
  }

  protected descartar(): void {
    this.estado.set(this.inicial());
    this.aviso.set(null);
  }

  /** PUT de módulos y, después, PUT de permisos (el backend exige que los módulos ya estén asignados). */
  protected guardar(): void {
    const rol = this.rol();

    if (!rol || !this.hayCambios()) return;

    const guardado = this.estado();
    const payload = aPayload(guardado, this.catalogo());
    this.guardando.set(true);
    this.aviso.set(null);

    this.rolesService.actualizarModulos(rol.id, payload.modulos).pipe(
      switchMap(() => this.rolesService.actualizarPermisos(rol.id, payload.permisos)),
    ).subscribe({
      next: () => {
        this.guardando.set(false);
        this.inicial.set(guardado);
        this.aviso.set({ tipo: 'exito', texto: `Se guardaron los accesos del rol ${rol.nombre}.`, detalle: [] });

        // El propio rol: el menú lateral y los permisos de la sesión cambian al momento.
        if (this.auth.usuario()?.rol === rol.nombre) {
          this.auth.recargarSesion().subscribe();
        }
      },
      error: (error: ErrorApi) => {
        this.guardando.set(false);
        this.aviso.set({ tipo: 'error', texto: error.mensaje, detalle: Object.values(error.errores).flat() });
      },
    });
  }

  confirmarSalida(): boolean | Promise<boolean> {
    return !this.hayCambios() || this.confirmacion().abrir();
  }

  /** Cerrar o recargar la pestaña con cambios: el navegador muestra su propia confirmación. */
  @HostListener('window:beforeunload', ['$event'])
  protected alDescargar(evento: BeforeUnloadEvent): void {
    if (this.hayCambios()) evento.preventDefault();
  }

  private cargar(): void {
    if (!Number.isInteger(this.idRol) || this.idRol <= 0) {
      this.cargando.set(false);
      this.errorCarga.set('El rol no existe.');
      return;
    }

    forkJoin({
      roles: this.rolesService.listar(),
      modulos: this.modulosService.listar(),
      asignados: this.rolesService.obtenerModulos(this.idRol),
      permisos: this.rolesService.obtenerPermisos(this.idRol),
    }).subscribe({
      next: ({ roles, modulos, asignados, permisos }) => {
        const rol = roles.find(candidato => candidato.id === this.idRol) ?? null;
        const estado = crearEstado(asignados, permisos);
        this.rol.set(rol);
        this.catalogo.set(modulos);
        this.inicial.set(estado);
        this.estado.set(estado);
        this.cargando.set(false);
        this.errorCarga.set(rol ? null : 'El rol no existe.');
      },
      error: (error: ErrorApi) => {
        this.cargando.set(false);
        this.errorCarga.set(error.status === 404 ? 'El rol no existe.' : error.mensaje);
      },
    });
  }
}
