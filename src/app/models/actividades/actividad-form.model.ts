import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Actividad, FiltrosActividad } from '../../core/interfaces/actividades/actividad.interface';

/** Valores del CHECK actividad_estado_check de certificado.actividad. */
export const ESTADOS_ACTIVIDAD = ['Activa', 'Cerrada'] as const;

export function textoObligatorio(control: AbstractControl): ValidationErrors | null {
  return typeof control.value === 'string' && control.value.trim() ? null : { required: true };
}

export function periodoActividad(control: AbstractControl): ValidationErrors | null {
  const inicio = control.get('fecha_inicio')?.value as string;
  const fin = control.get('fecha_fin')?.value as string;
  return inicio && fin && fin < inicio ? { periodo: true } : null;
}

export function filtrarActividades(actividades: readonly Actividad[], filtros: FiltrosActividad): readonly Actividad[] {
  const texto = (valor: string) => valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es');
  const nombre = texto(filtros.nombre.trim());
  return actividades.filter(actividad => texto(actividad.nombre).includes(nombre)
    && (!filtros.area || String(actividad.id_area) === filtros.area)
    && (!filtros.tipo || String(actividad.id_tipo_actividad) === filtros.tipo)
    && (!filtros.estado || actividad.estado === filtros.estado));
}
