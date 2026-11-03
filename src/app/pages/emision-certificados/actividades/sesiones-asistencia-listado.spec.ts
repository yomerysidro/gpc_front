import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { EmisionCertificadosService } from '../../../core/services/emision-certificados/emision-certificados.service';
import { PersonService } from '../../../core/services/person/person.service';
import { FILTROS_SESIONES_VACIOS, SesionesAsistenciaListado } from './sesiones-asistencia-listado';
import { RegistroEmision } from '../../../core/interfaces/emision-certificados/emision-certificados.interface';

describe('Catálogos completos de Sesiones y Asistencias', () => {
  let modelo: SesionesAsistenciaListado;
  let api: jasmine.SpyObj<EmisionCertificadosService>;
  let personas: jasmine.SpyObj<PersonService>;
  const sesiones = Array.from({ length: 125 }, (_, indice) => ({ id_actividad_sesion: indice + 300, id_actividad: indice % 2 ? 8 : 7,
    nombre: `Sesión ${indice + 1}`, fecha: '2026-11-03', estado: indice % 2 ? 'Cerrada' : 'Activa' }));
  beforeEach(() => {
    api = jasmine.createSpyObj('EmisionCertificadosService', ['listarTodos']);
    personas = jasmine.createSpyObj('PersonService', ['listar']);
    const catalogos: Record<string, readonly RegistroEmision[]> = {
      'activity-session': sesiones,
      activity: [{ id_actividad: 7, nombre: 'Actividad A' }, { id_actividad: 8, nombre: 'Actividad B' }],
      participation: [{ id_participacion: 21, id_persona: 9 }],
      attendance: [{ id_asistencia: 87, id_participacion: 21, id_actividad_sesion: 300, estado: 'Registrada' },
        { id_asistencia: 88, id_participacion: 21, id_actividad_sesion: 301, estado: 'Justificada' }],
    };
    api.listarTodos.and.callFake(((recurso: string) => of(catalogos[recurso])) as EmisionCertificadosService['listarTodos']);
    personas.listar.and.returnValue(of([{ id_persona: 9, nombres: 'María', apellido_paterno: 'Pérez', apellido_materno: 'Ruiz',
      telefono: null, direccion: null, correo: null, fecha_registro: '' }]));
    TestBed.configureTestingModule({ providers: [SesionesAsistenciaListado,
      { provide: EmisionCertificadosService, useValue: api }, { provide: PersonService, useValue: personas }] });
    modelo = TestBed.inject(SesionesAsistenciaListado);
  });

  it('pagina la lista completa más allá de cien registros, con total real y última página incompleta', () => {
    modelo.cargar(false).subscribe();
    const pagina = modelo.paginar(FILTROS_SESIONES_VACIOS, false, 3, 50);
    expect(pagina.total).toBe(125); expect(pagina.data.length).toBe(25);
    expect(pagina.current_page).toBe(3); expect(pagina.last_page).toBe(3);
    expect(pagina.data[0]['id_actividad_sesion']).toBe(400);
    expect(personas.listar).not.toHaveBeenCalled();
  });

  it('resuelve participante y sesión con catálogos y combina filtros respetando la actividad de la sesión', () => {
    modelo.cargar(true).subscribe();
    const filtros = { ...FILTROS_SESIONES_VACIOS, nombre: 'maria perez', actividad: '7', sesion: '300', estado: 'Registrada' };
    const pagina = modelo.paginar(filtros, true, 1, 10);
    expect(pagina.total).toBe(1);
    expect(pagina.data[0]['participanteNombre']).toBe('María Pérez Ruiz');
    expect(pagina.data[0]['sesionNombre']).toBe('Sesión 1');
    expect(pagina.data[0]['actividadNombre']).toBe('Actividad A');
    expect(modelo.paginar({ ...filtros, actividad: '8' }, true, 1, 10).total).toBe(0);
    expect(modelo.sesionesDisponibles('7').every(sesion => sesion['id_actividad'] === 7)).toBeTrue();
    expect(modelo.estados).toEqual(['Justificada', 'Registrada']);
  });

  it('reutiliza las lecturas al filtrar y paginar y las renueva después de guardar', () => {
    modelo.cargar(true).subscribe();
    modelo.cargar(true).subscribe();
    modelo.paginar(FILTROS_SESIONES_VACIOS, true, 1, 5);
    expect(api.listarTodos).toHaveBeenCalledTimes(4); expect(personas.listar).toHaveBeenCalledTimes(1);
    modelo.invalidar(); modelo.cargar(true).subscribe();
    expect(api.listarTodos).toHaveBeenCalledTimes(8); expect(personas.listar).toHaveBeenCalledTimes(2);
  });

  it('mantiene los estados de sesiones sin inventar equivalencias y no sustituye nombres ausentes por IDs', () => {
    api.listarTodos.and.callFake(((recurso: string) => of(recurso === 'activity-session' ? sesiones : [])) as EmisionCertificadosService['listarTodos']);
    modelo.cargar(false).subscribe();
    expect(modelo.estados).toEqual(['Activa', 'Cerrada']);
    expect(modelo.filas[0]['actividadNombre']).toBe('Nombre no disponible');
    expect(modelo.filas[0]['id_actividad']).toBe(7);
  });
});
