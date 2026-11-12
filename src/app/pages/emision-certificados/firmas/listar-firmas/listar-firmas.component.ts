import { Component, DestroyRef, inject, OnInit, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { timeout } from 'rxjs';
import { RouterLink } from '@angular/router';
import { FirmaDocumentalService, FuncionarioMunicipal } from '../../../../core/services/emision-certificados/firma-documental.service';
import { mensajeEtapaA } from '../../../../core/services/emision-certificados/documentos-digitales.service';
@Component({ selector: 'app-listar-firmas', standalone: true, imports: [FormsModule, RouterLink], templateUrl: './listar-firmas.component.html', styleUrls: ['../../compartidos/emision.scss', './listar-firmas.component.scss'] })
export class ListarFirmasComponent implements OnInit {
  private readonly api = inject(FirmaDocumentalService);
  private readonly destroy = inject(DestroyRef);
  readonly trabajadores = signal<FuncionarioMunicipal[]>([]);
  readonly cargando = signal(false);
  readonly error = signal('');
  readonly busqueda = signal('');
  readonly filtrados = computed(() => {
    const normalizar = (texto: string) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const busqueda = normalizar(this.busqueda().trim());
    return this.trabajadores().filter(t => normalizar(`${t.nombre} ${t.cargo} ${t.area ?? ''}`).includes(busqueda));
  });

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    if (this.cargando()) return;
    this.cargando.set(true);
    this.error.set('');
    this.trabajadores.set([]);
    this.api.trabajadores().pipe(timeout(30000), takeUntilDestroyed(this.destroy)).subscribe({
      next: trabajadores => {
        this.trabajadores.set(trabajadores);
        this.cargando.set(false);
      },
      error: error => {
        this.error.set(error instanceof Error ? 'No se pudo consultar los funcionarios. Intente nuevamente.' : mensajeEtapaA(error));
        this.cargando.set(false);
      },
    });
  }
}
