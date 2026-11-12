import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ListarFirmasComponent } from './listar-firmas.component';
describe('Funcionarios administrativos sin credenciales', () => {
 let http: HttpTestingController;
 beforeEach(() => { TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()] }); http = TestBed.inject(HttpTestingController); });
 afterEach(() => http.verify());
 it('consulta trabajadores con nombre, cargo, área y disponibilidad y permite buscarlos sin PFX', () => {
 const f = TestBed.createComponent(ListarFirmasComponent); f.detectChanges();
 const r = http.expectOne('/api/funcionarios-firmantes/trabajadores'); expect(r.request.withCredentials).toBeTrue();
 r.flush({ success: true, data: { funcionarios: [{ id_persona_trabajador: 4, nombre: 'Funcionario de prueba', cargo: 'Gerente', area: 'Gerencia', disponible_asignacion: true, habilitado: false }] } }); f.detectChanges();
 const el: HTMLElement = f.nativeElement; expect(el.textContent).toContain('Funcionario de prueba'); expect(el.textContent).toContain('Gerente'); expect(el.textContent).toContain('Gerencia'); expect(el.textContent).toContain('Disponible para asignación');
 expect(el.querySelector('input[type=file]')).toBeNull(); expect(el.querySelector('input[type=password]')).toBeNull(); expect(el.textContent).not.toContain('REGISTRAR FIRMANTE'); expect(el.querySelector('a')?.getAttribute('href')).toBe('/pendientes/documentos-firmar');
 f.componentInstance.busqueda.set('inexistente'); f.detectChanges(); expect(el.textContent).not.toContain('Funcionario de prueba');
 });
 for (const status of [401,403,404]) it('finaliza la carga ante HTTP ' + status, () => { const f=TestBed.createComponent(ListarFirmasComponent); f.detectChanges(); http.expectOne('/api/funcionarios-firmantes/trabajadores').flush({message:'Rechazado'}, {status, statusText:'Error'}); f.detectChanges(); expect(f.componentInstance.cargando()).toBeFalse(); expect(f.nativeElement.querySelector('[role=alert]')).not.toBeNull(); });
});