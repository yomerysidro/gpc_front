import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { PonentesActividadComponent } from './ponentes-actividad.component';
import { EmisionCertificadosService } from '../../../core/services/emision-certificados/emision-certificados.service';
import { PersonService } from '../../../core/services/person/person.service';
import { PersonSpeakerService } from '../../../core/services/person-speaker/person-speaker.service';

describe('Ponentes asociados a la actividad', () => {
  let api: jasmine.SpyObj<EmisionCertificadosService>;
  beforeEach(() => {
    api = jasmine.createSpyObj('api', ['listarTodos']);
    api.listarTodos.and.returnValue(of([{ id_actividad_ponente: 51, id_actividad: 7, id_persona_ponente: 61 },
      { id_actividad_ponente: 52, id_actividad: 8, id_persona_ponente: 62 }]));
    TestBed.configureTestingModule({ providers: [{ provide: EmisionCertificadosService, useValue: api },
      { provide: PersonSpeakerService, useValue: { listar: () => of([{ id_persona_ponente: 61, id_persona: 71, cargo: 'Especialista' }]) } },
      { provide: PersonService, useValue: { listar: () => of([{ id_persona: 71, nombres: 'Ana', apellido_paterno: 'Real' }]) } }] });
  });
  it('consulta al desplegar, presenta solo la asociación real y no permite acreditar sesiones', () => {
    const f = TestBed.createComponent(PonentesActividadComponent); f.componentRef.setInput('actividad', 7); f.detectChanges();
    expect(api.listarTodos).not.toHaveBeenCalled(); const c = f.componentInstance as any;
    c.cargar(); f.detectChanges(); expect(api.listarTodos).toHaveBeenCalledWith('activity-speaker');
    expect(f.nativeElement.textContent).toContain('Ana Real'); expect(f.nativeElement.textContent).toContain('Especialista');
    expect(c.ponentes().length).toBe(1); expect(f.nativeElement.textContent).toContain('no acredita una intervención en cada sesión');
    expect(f.nativeElement.querySelector('table, input, select')).toBeNull(); expect(f.nativeElement.querySelector('button')).toBeNull();
  });
  it('un rechazo de consulta no se convierte en ausencia de ponentes', () => {
    api.listarTodos.and.returnValue(throwError(() => ({ status: 403, mensaje: 'Sin permiso', errores: {} })));
    const f = TestBed.createComponent(PonentesActividadComponent); f.componentRef.setInput('actividad', 7); (f.componentInstance as any).cargar(); f.detectChanges();
    expect(f.nativeElement.querySelector('[role="alert"]')).not.toBeNull(); expect(f.nativeElement.textContent).not.toContain('No hay ponentes asociados');
  });
});
