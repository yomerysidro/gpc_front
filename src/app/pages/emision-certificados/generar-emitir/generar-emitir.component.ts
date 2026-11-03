import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { FormularioCertificadoComponent } from '../certificados/formulario-certificado/formulario-certificado.component';
import { ESCRITURA_EMISION_AUTORIZADA } from '../../../core/services/emision-certificados/operaciones-emision';
import { catchError, forkJoin, map, Observable, of, Subscription, switchMap } from 'rxjs';
import { ErrorApi } from '../../../core/interfaces/api/api-response.interface';
import { Reconocimiento } from '../../../core/interfaces/emision-certificados/emision-certificados.interface';
import { SeleccionCertificado } from '../../../core/interfaces/emision-certificados/preparacion-documental.interface';
import { EmisionCertificadosService } from '../../../core/services/emision-certificados/emision-certificados.service';
import { PracticeService } from '../../../core/services/practice/practice.service';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { PageTitleComponent } from '../../../shared/components/page-title/page-title.component';
import { ListarCertificadosComponent } from '../certificados/listar-certificados/listar-certificados.component';
import { VisorCertificadoComponent } from '../compartidos/visor-certificado.component';
import { etiquetaEstado } from '../compartidos/estado-emision';
function contextoParametros(parametros: ParamMap): string {
  return JSON.stringify([...parametros.keys].sort().map(clave => [clave, parametros.getAll(clave)]));
}
@Component({
  selector: 'app-generar-emitir', standalone: true,
  imports: [DatePipe, ReactiveFormsModule, RouterLink, PageTitleComponent, ListarCertificadosComponent, VisorCertificadoComponent, FormularioCertificadoComponent],
  templateUrl: './generar-emitir.component.html', styleUrls: ['../compartidos/emision.scss', './generar-emitir.component.scss'],
})
export class GenerarEmitirComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly escrituraAutorizada = inject(ESCRITURA_EMISION_AUTORIZADA);
  protected readonly formulario = viewChild(FormularioCertificadoComponent);
  protected readonly contextosFormulario = signal([contextoParametros(this.route.snapshot.queryParamMap)]);
  protected readonly modo = signal<'existente' | 'nuevo'>(this.route.snapshot.queryParamMap.has('nuevo') || this.route.snapshot.queryParamMap.has('editar') ? 'nuevo' : 'existente');
  private readonly api = inject(EmisionCertificadosService);
  private readonly practicas = inject(PracticeService);
  protected readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private carga?: Subscription;
  protected readonly paso = signal(this.route.snapshot.queryParamMap.has('editar') ? 2 : 1);
  protected readonly seleccion = signal<SeleccionCertificado | null>(null);
  protected readonly origen = signal<string | null>(null);
  protected readonly reconocimiento = signal<Reconocimiento | null>(null);
  protected readonly asignaciones = signal<readonly { firma: number; orden: number }[]>([]);
  protected readonly error = signal<string | null>(null);
  protected readonly cargando = signal(false);
  protected readonly estado = etiquetaEstado;
  protected readonly pasos = ['Seleccionar origen y registro', 'Preparar certificado', 'Revisar documento', 'Generar y emitir'];
  protected readonly revision = inject(NonNullableFormBuilder).group({ datos: [false, Validators.requiredTrue], origen: [false, Validators.requiredTrue] });
  constructor() {
    let contexto = contextoParametros(this.route.snapshot.queryParamMap);
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(parametros => {
      const siguiente = contextoParametros(parametros);
      if (siguiente === contexto) return;
      contexto = siguiente; this.carga?.unsubscribe(); this.seleccion.set(null); this.error.set(null); this.cargando.set(false);
      this.contextosFormulario.set([siguiente]);
      this.modo.set(parametros.has('nuevo') || parametros.has('editar') ? 'nuevo' : 'existente');
      this.paso.set(parametros.has('editar') ? 2 : 1);
    });
  }
  protected seleccionar(seleccion: SeleccionCertificado, preparado = false): void {
    this.carga?.unsubscribe(); this.seleccion.set(seleccion); this.origen.set(null); this.reconocimiento.set(null); this.asignaciones.set([]);
    this.error.set(null); this.revision.reset(); this.paso.set(preparado ? 3 : 2); this.cargando.set(true);
    const fila = seleccion.registro;
    if ([fila.id_participacion, fila.id_practica, fila.id_reconocimiento].filter(id => id !== null).length !== 1) {
      this.error.set('El certificado debe tener exactamente un origen válido.'); this.cargando.set(false); return;
    }
    const permisos = fila.id_participacion ? 'participantes.ver' : fila.id_practica ? 'practicantes.ver' : 'reconocimientos.ver';
    if (!this.auth.tienePermiso(permisos)) { this.error.set(`No tienes el permiso ${permisos} para revisar este origen.`); this.cargando.set(false); return; }
    const origen: Observable<{ texto: string; actividad: number | null; reconocimiento: Reconocimiento | null }> = fila.id_participacion ? this.api.obtener('participation', fila.id_participacion).pipe(
      switchMap(participacion => this.api.obtener('activity', Number(participacion['id_actividad'])).pipe(map(actividad => ({ texto: `Participación #${fila.id_participacion} · ${actividad['nombre']}`, actividad: Number(actividad['id_actividad']), reconocimiento: null })))),
    ) : fila.id_reconocimiento ? this.api.obtener('reconocimientos', fila.id_reconocimiento).pipe(map(registro => ({ texto: `Reconocimiento #${registro.id_reconocimiento} · ${registro.titulo}`, actividad: null, reconocimiento: registro })))
      : fila.id_practica ? this.practicas.obtener(fila.id_practica).pipe(map(practica => ({ texto: `Práctica #${practica.id_practica} · ${practica.carrera} · ${practica.fecha_inicio} – ${practica.fecha_fin ?? 'Sin fin registrado'}`, actividad: null, reconocimiento: null })))
        : of({ texto: 'No hay origen asociado', actividad: null, reconocimiento: null });
    this.carga = origen.pipe(switchMap(datos => forkJoin({
      documentos: preparado ? this.api.documentosIdentidad().pipe(catchError(() => of({} as Readonly<Partial<Record<number, string>>>))) : of(null),
      datos: of(datos), asignaciones: datos.actividad && this.auth.tienePermiso('ponentes-firmantes.ver')
        ? this.api.listarTodos('actividades-firmas', { id_actividad: datos.actividad }).pipe(catchError((error: ErrorApi) => { this.error.set('Asignaciones: ' + error.mensaje); return of(null); })) : of(null),
    })), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: ({ datos, asignaciones, documentos }) => { if (documentos) this.seleccion.set({ ...seleccion, dni: documentos[fila.id_persona] ?? null }); this.origen.set(datos.texto); this.reconocimiento.set(datos.reconocimiento); this.asignaciones.set((asignaciones ?? []).map(firma => ({ firma: firma.id_firma, orden: firma.orden_firma })).sort((a, b) => a.orden - b.orden)); this.cargando.set(false); },
      error: (error: ErrorApi | Error) => { this.error.set(error instanceof Error ? error.message : error.mensaje); this.cargando.set(false); },
    });
  }
  protected avanzar(): void {
    if (!this.seleccion() || this.cargando() || this.error()) return;
    if (this.paso() === 2) { this.revision.markAllAsTouched(); if (this.revision.invalid || !this.origen() || this.error()) return; }
    this.paso.update(paso => Math.min(4, paso + 1));
  }
  protected volver(): void { this.paso.update(paso => Math.max(1, paso - 1)); }
  protected cancelar(): void {
    this.carga?.unsubscribe(); this.seleccion.set(null); this.error.set(null); this.cargando.set(false); this.revision.reset();
    this.modo.set('existente'); this.paso.set(1);
    void this.router.navigate([], { relativeTo: this.route, queryParams: {}, replaceUrl: true });
  }
  protected nuevo(): void { this.seleccion.set(null); this.modo.set('nuevo'); this.paso.set(1); }
}
