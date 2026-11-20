import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { afterNextRender, Component, computed, DestroyRef, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, debounceTime, distinctUntilChanged, map, merge, Observable, of, Subject, switchMap } from 'rxjs';
import { ApiResponse, ErrorApi, PaginacionMeta } from '../../../../core/interfaces/api/api-response.interface';
import { Rol } from '../../../../core/interfaces/roles/rol.interface';
import { Usuario, UsuarioFiltros } from '../../../../core/interfaces/usuarios/usuario.interface';
import { RolesService } from '../../../../core/services/roles/roles.service';
import { UsuariosService } from '../../../../core/services/usuarios/usuarios.service';
import { DialogoConfirmacionComponent } from '../../../../shared/components/dialogo-confirmacion/dialogo-confirmacion.component';
import { PageTitleComponent } from '../../../../shared/components/page-title/page-title.component';
import { HasPermissionDirective } from '../../../../shared/directives/has-permission.directive';
import { ZONA_HORARIA_LIMA } from '../../../../shared/utils/zona-horaria';

/** Aviso que deja otra pantalla al volver al listado (navigation state). */
export interface AvisoUsuarios {
  readonly tipo: 'exito' | 'error' | 'advertencia';
  readonly texto: string;
}

type ResultadoCarga =
  | { readonly ok: true; readonly usuarios: readonly Usuario[]; readonly meta: PaginacionMeta }
  | { readonly ok: false; readonly mensaje: string };

const ESPERA_BUSQUEDA_MS = 350;
const MENSAJE_429 = 'Ya se envió un enlace hace menos de un minuto. Espera un momento antes de reenviarlo.';

import { DialogoComponent } from '../../../../shared/components/dialogo/dialogo.component';
import { FormularioUsuarioComponent } from '../formulario-usuario/formulario-usuario.component';

@Component({
  selector: 'app-listar-usuarios',
  standalone: true,
  imports: [DatePipe, NgTemplateOutlet, ReactiveFormsModule, RouterLink, PageTitleComponent, HasPermissionDirective, DialogoConfirmacionComponent, DialogoComponent, FormularioUsuarioComponent],
  templateUrl: './listar-usuarios.component.html',
  styleUrl: './listar-usuarios.component.scss'
})
export class ListarUsuariosComponent {
  protected readonly editorUsuario = viewChild<FormularioUsuarioComponent>('editorUsuario');
  protected readonly nuevoUsuario = signal(false);
  protected abrirNuevo(dialogo: DialogoComponent): void {
    this.nuevoUsuario.set(true);
    dialogo.abrir();
  }

  protected usuarioCreado(aviso: AvisoUsuarios, dialogo: DialogoComponent): void {
    dialogo.cerrar();
    this.aviso.set(aviso);
    this.cargar();
  }
  private readonly usuariosService = inject(UsuariosService);
  private readonly rolesService = inject(RolesService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly consultas = new Subject<UsuarioFiltros>();
  private readonly confirmacion = viewChild.required(DialogoConfirmacionComponent);

  protected readonly zonaLima = ZONA_HORARIA_LIMA;
  protected readonly filtros = inject(NonNullableFormBuilder).group({ search: '', idRol: '', estado: '' });
  protected readonly roles = signal<readonly Rol[]>([]);
  protected readonly usuarios = signal<readonly Usuario[]>([]);
  protected readonly meta = signal<PaginacionMeta | null>(null);
  protected readonly cargando = signal(true);
  protected readonly errorCarga = signal<string | null>(null);
  protected readonly aviso = signal<AvisoUsuarios | null>(null);
  protected readonly procesando = signal<number | null>(null);
  protected readonly porConfirmar = signal<Usuario | null>(null);
  protected readonly activarConfirmacion = computed(() => this.porConfirmar()?.estado === false);
  private readonly pagina = signal(1);

  protected readonly rango = computed(() => {
    const meta = this.meta();

    if (!meta || meta.total === 0) return null;

    const desde = (meta.page - 1) * meta.perPage + 1;
    return { desde, hasta: Math.min(meta.page * meta.perPage, meta.total), total: meta.total };
  });
  protected readonly hayAnterior = computed(() => (this.meta()?.page ?? 1) > 1);
  protected readonly haySiguiente = computed(() => {
    const meta = this.meta();
    return !!meta && meta.page * meta.perPage < meta.total;
  });
  protected readonly hayFiltros = signal(false);

  constructor() {
    const aviso = inject(Router).getCurrentNavigation()?.extras.state?.['aviso'] as AvisoUsuarios | undefined;
    this.aviso.set(aviso ?? null);

    // La sesión vive en una cookie del navegador: el SSR solo pinta el estado de carga.
    afterNextRender(() => {
      this.rolesService.listar().subscribe({
        next: roles => this.roles.set(roles.filter(rol => rol.estado)),
      });

      this.consultas.pipe(
        switchMap(filtros => this.consultar(filtros)),
        takeUntilDestroyed(this.destroyRef),
      ).subscribe(resultado => {
        this.cargando.set(false);

        if (resultado.ok) {
          this.usuarios.set(resultado.usuarios);
          this.meta.set(resultado.meta);
          this.errorCarga.set(null);
        } else {
          this.errorCarga.set(resultado.mensaje);
        }
      });

      const { search, idRol, estado } = this.filtros.controls;
      merge(
        search.valueChanges.pipe(debounceTime(ESPERA_BUSQUEDA_MS), map(valor => valor.trim()), distinctUntilChanged()),
        idRol.valueChanges,
        estado.valueChanges,
      ).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.irAPagina(1));

      this.cargar();
    });
  }

  protected irAPagina(pagina: number): void {
    this.pagina.set(pagina);
    this.cargar();
  }

  protected limpiarFiltros(): void {
    this.filtros.reset({ search: '', idRol: '', estado: '' }, { emitEvent: false });
    this.irAPagina(1);
  }

  protected async pedirCambioEstado(usuario: Usuario): Promise<void> {
    this.porConfirmar.set(usuario);

    if (!await this.confirmacion().abrir()) return;

    const activar = !usuario.estado;
    this.ejecutar(usuario, this.usuariosService.cambiarEstado(usuario.id, activar),
      `${usuario.nombre} fue ${activar ? 'activado' : 'desactivado'}.`);
  }

  protected desbloquear(usuario: Usuario): void {
    this.ejecutar(usuario, this.usuariosService.desbloquear(usuario.id), `${usuario.nombre} fue desbloqueado.`);
  }

  protected reenviarEnlace(usuario: Usuario): void {
    this.ejecutar(usuario, this.usuariosService.restablecerPassword(usuario.id),
      `Se envió a ${usuario.correo} un enlace para crear su contraseña.`);
  }

  private ejecutar(usuario: Usuario, accion: Observable<ApiResponse<unknown>>, exito: string): void {
    this.procesando.set(usuario.id);
    this.aviso.set(null);

    accion.subscribe({
      next: () => {
        this.procesando.set(null);
        this.aviso.set({ tipo: 'exito', texto: exito });
        this.cargar();
      },
      error: (error: ErrorApi) => {
        this.procesando.set(null);
        this.aviso.set(error.status === 429
          ? { tipo: 'advertencia', texto: MENSAJE_429 }
          : { tipo: 'error', texto: error.mensaje });
      },
    });
  }

  private cargar(): void {
    const { search, idRol, estado } = this.filtros.getRawValue();
    const filtros: UsuarioFiltros = {
      search: search.trim() || undefined,
      idRol: idRol ? Number(idRol) : undefined,
      estado: estado ? estado === 'true' : undefined,
      page: this.pagina(),
    };

    this.hayFiltros.set(!!(filtros.search || filtros.idRol || filtros.estado !== undefined));
    this.cargando.set(true);
    this.consultas.next(filtros);
  }

  private consultar(filtros: UsuarioFiltros): Observable<ResultadoCarga> {
    return this.usuariosService.listar(filtros).pipe(
      map((respuesta): ResultadoCarga => ({ ok: true, usuarios: respuesta.data, meta: respuesta.meta })),
      catchError((error: ErrorApi) => of<ResultadoCarga>({ ok: false, mensaje: error.mensaje })),
    );
  }
}
