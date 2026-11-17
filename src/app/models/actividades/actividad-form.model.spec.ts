import { FormControl, FormGroup } from '@angular/forms';
import { Actividad } from '../../core/interfaces/actividades/actividad.interface';
import { filtrarActividades, periodoActividad, textoObligatorio } from './actividad-form.model';

describe('Reglas del formulario de actividad', () => {
  it('rechaza fechas invertidas y permite que inicio y fin sean el mismo día', () => {
    const form = new FormGroup({ fecha_inicio: new FormControl('2026-10-02'), fecha_fin: new FormControl('2026-10-01') }, periodoActividad);
    expect(form.hasError('periodo')).toBeTrue();
    form.controls.fecha_fin.setValue('2026-10-02');
    expect(form.valid).toBeTrue();
    form.controls.fecha_fin.setValue('2026-10-03');
    expect(form.valid).toBeTrue();
  });

  it('rechaza nombres y estados compuestos solo por espacios', () => {
    expect(textoObligatorio(new FormControl('   '))).toEqual({ required: true });
    expect(textoObligatorio(new FormControl(' Conferencia '))).toBeNull();
  });

  it('combina nombre sin tildes ni mayúsculas con los IDs y el estado exacto', () => {
    const base: Actividad = {
      id_actividad: 1, origen: 'sin_solicitud', id_solicitud_actividad: null, id_area: 2, id_tipo_actividad: 3, nombre: 'Capacitación técnica',
      fecha_inicio: '2026-10-01', fecha_fin: '2026-10-01', descripcion: null, sede: null, estado: 'Activa',
    };
    const actividades = [base, { ...base, id_actividad: 2, id_area: 4 }, { ...base, id_actividad: 3, estado: 'Cerrada' }];
    expect(filtrarActividades(actividades, { nombre: ' CAPACITACION ', area: '2', tipo: '3', estado: 'Activa' })).toEqual([base]);
    expect(filtrarActividades(actividades, { nombre: '', area: '', tipo: '99', estado: '' })).toEqual([]);
  });
});
