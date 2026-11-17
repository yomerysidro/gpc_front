import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, startWith } from 'rxjs';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { BandejaSolicitudesComponent } from '../compartidos/bandeja-solicitudes.component';
import { NuevaSolicitudComponent } from '../nueva-solicitud/nueva-solicitud.component';

/** Presentación de las dos vistas existentes; no contiene formularios ni operaciones HTTP. */
@Component({
  selector: 'app-mis-solicitudes', standalone: true,
  imports: [BandejaSolicitudesComponent, NuevaSolicitudComponent],
  templateUrl: './mis-solicitudes.component.html',
  styleUrl: '../../../shared/components/gestion-tabs/gestion-tabs.component.scss',
})
export class MisSolicitudesComponent {
  protected readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly pestana = signal<'mis-solicitudes' | 'nueva'>('mis-solicitudes');
  protected readonly formularioVisitado = signal(false);

  constructor() {
    this.router.events.pipe(filter(evento => evento instanceof NavigationEnd), startWith(null), takeUntilDestroyed()).subscribe(() => {
      const nueva = this.route.snapshot.firstChild?.routeConfig?.path === 'nueva';
      this.pestana.set(nueva ? 'nueva' : 'mis-solicitudes');
      if (this.router.getCurrentNavigation()?.extras.state?.['solicitudEnviada']) this.formularioVisitado.set(false);
      else if (nueva) this.formularioVisitado.set(true);
    });
  }

  protected seleccionar(pestana: 'mis-solicitudes' | 'nueva'): void {
    if (pestana === this.pestana() || (pestana === 'nueva' && !this.auth.tienePermiso('solicitudes.crear'))) return;
    void this.router.navigate(['/solicitudes', pestana], { queryParamsHandling: 'preserve' });
  }

  protected alTeclear(evento: KeyboardEvent): void {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(evento.key)) return;
    evento.preventDefault();
    const opciones = this.auth.tienePermiso('solicitudes.crear') ? ['mis-solicitudes', 'nueva'] as const : ['mis-solicitudes'] as const;
    const actual = opciones.findIndex(opcion => opcion === this.pestana());
    const indice = evento.key === 'Home' ? 0 : evento.key === 'End' ? opciones.length - 1
      : (actual + (evento.key === 'ArrowLeft' ? -1 : 1) + opciones.length) % opciones.length;
    const destino = opciones[indice]; this.seleccionar(destino);
    (evento.currentTarget as HTMLElement).querySelector<HTMLElement>('#solicitudes-tab-' + destino)?.focus();
  }
}
