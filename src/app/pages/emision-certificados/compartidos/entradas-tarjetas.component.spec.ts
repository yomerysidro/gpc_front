import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Reconocimiento, TrabajadorEmision } from '../../../core/interfaces/emision-certificados/emision-certificados.interface';
import { AuthService } from '../../../core/services/autenticacion/auth.service';
import { FirmanteCardComponent } from '../firmas/firmante-card/firmante-card.component';
import { FirmanteVistaMunicipal } from '../firmas/firmante-vista.interface';
import { FormularioFirmanteComponent } from '../firmas/formulario-firmante/formulario-firmante.component';
import { ReconocimientoCardComponent } from '../reconocimientos/components/reconocimiento-card/reconocimiento-card.component';

@Component({
  standalone: true,
  imports: [FirmanteCardComponent, FormularioFirmanteComponent, ReconocimientoCardComponent],
  template: `
    <app-firmante-card [firmante]="firmante" [dni]="dni()" />
    <app-formulario-firmante [trabajadores]="trabajadores" [nombres]="nombres()" />
    <app-reconocimiento-card [reconocimiento]="reconocimiento" [dni]="dni()" />
  `,
})
class EntradasTarjetasPruebaComponent {
  readonly dni = signal<string | null>('12345678');
  readonly nombres = signal<Readonly<Partial<Record<number, string>>>>({ 6: 'Nombre recibido del servidor' });
  readonly trabajadores: readonly TrabajadorEmision[] = [
    { id_persona_trabajador: 4, id_persona: 6, id_area: 2, cargo: 'Cargo registrado', estado: true },
  ];
  readonly firmante: FirmanteVistaMunicipal = {
    firma: { id_firma: 8, id_persona_trabajador: 4, fecha_firma: '2026-10-30' },
    trabajador: this.trabajadores[0],
    nombre: { estado: 'disponible', datos: 'Nombre recibido del servidor' },
    area: { estado: 'disponible', datos: 'Área registrada' },
  };
  readonly reconocimiento: Reconocimiento = {
    id_reconocimiento: 7, id_persona_trabajador: 4, titulo: 'Reconocimiento registrado',
    descripcion: 'Descripción registrada', motivo: 'Motivo registrado', fecha_reconocimiento: '2026-10-30', estado: 'Activo',
  };
}

describe('Contratos de inputs de las tarjetas de Certificaciones', () => {
  let fixture: ComponentFixture<EntradasTarjetasPruebaComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      provideHttpClient(), provideHttpClientTesting(), provideRouter([]),
      { provide: AuthService, useValue: { tienePermiso: () => true } },
    ] });
    fixture = TestBed.createComponent(EntradasTarjetasPruebaComponent);
    fixture.detectChanges();
  });
  afterEach(() => TestBed.inject(HttpTestingController).verify());

  it('acepta dni y nombres desde una plantilla padre sin esquemas que oculten errores', () => {
    const vista: HTMLElement = fixture.nativeElement;
    expect(vista.querySelector('app-firmante-card')?.textContent).toContain('12345678');
    expect(vista.querySelector('app-reconocimiento-card')?.textContent).toContain('12345678');
    expect(vista.querySelector('#firmante-trabajador')?.textContent).toContain('Nombre recibido del servidor');
  });

  it('actualiza los inputs y conserva los estados de datos ausentes', () => {
    fixture.componentInstance.dni.set(null);
    fixture.componentInstance.nombres.set({});
    fixture.detectChanges();
    const vista: HTMLElement = fixture.nativeElement;
    expect(vista.querySelector('app-firmante-card')?.textContent).toContain('DNI: No disponible');
    expect(vista.querySelector('app-reconocimiento-card')?.textContent).toContain('DNI: No disponible');
    expect(vista.querySelector('#firmante-trabajador')?.textContent).not.toContain('Nombre recibido del servidor');
  });
});
