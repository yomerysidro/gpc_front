import { afterNextRender, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../../core/services/autenticacion/auth.service';
import { IndicadorRegistrado, ReportesService } from '../../core/services/reportes/reportes.service';
import { SIDEBAR_CONFIG, resolverEntradaSidebar } from '../../components/sidebar/modulos-navegacion';

type Indicador = { clave: IndicadorRegistrado; nombre: string; icono: string; permiso: string; valor: number | null; estado: 'cargando' | 'disponible' | 'error' };

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly auth = inject(AuthService);
  private readonly reportes = inject(ReportesService);
  private readonly destroyRef = inject(DestroyRef);
  readonly indicadores = signal<readonly Indicador[]>([]);
  readonly accesos = computed(() => SIDEBAR_CONFIG.flatMap(grupo => grupo.hijos)
    .filter(entrada => ['actividades', 'generar-emitir', 'emitidos', 'documentos-firmar', 'pendientes-aprobacion'].includes(entrada.id))
    .flatMap(entrada => {
      const visible = resolverEntradaSidebar(entrada, clave => this.auth.tienePermiso(clave), [], false, this.auth.capacidadesSolicitudes());
      return visible ? [visible] : [];
    }));

  constructor() { afterNextRender(() => this.cargar()); }

  private cargar(): void {
    if (!this.auth.tienePermiso('reportes.ver')) return;
    const definiciones: Omit<Indicador, 'valor' | 'estado'>[] = [
      { clave: 'certificados', nombre: 'Certificados registrados', icono: 'workspace_premium', permiso: 'emision.ver' },
      { clave: 'actividades', nombre: 'Actividades registradas', icono: 'calendar_month', permiso: 'actividades.ver' },
      { clave: 'participaciones', nombre: 'Participaciones registradas', icono: 'groups', permiso: 'participantes.ver' },
      { clave: 'asistencias', nombre: 'Asistencias registradas', icono: 'how_to_reg', permiso: 'participantes.ver' },
    ];
    const tarjetas: Indicador[] = definiciones.filter(item => this.auth.tienePermiso(item.permiso))
      .map(item => ({ ...item, valor: null, estado: 'cargando' }));
    this.indicadores.set(tarjetas);
    for (const item of tarjetas) {
      this.reportes.totalRegistrados(item.clave).pipe(
        map(valor => ({ ...item, valor, estado: 'disponible' as const })),
        catchError(() => of({ ...item, valor: null, estado: 'error' as const })),
        takeUntilDestroyed(this.destroyRef),
      ).subscribe(resultado => this.indicadores.update(actuales => actuales.map(actual => actual.clave === item.clave ? resultado : actual)));
    }
  }
}
