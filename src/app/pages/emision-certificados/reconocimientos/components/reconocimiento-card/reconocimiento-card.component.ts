import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AreaReconocimiento, PersonaReconocimiento, Reconocimiento, TrabajadorEmision } from '../../../../../core/interfaces/emision-certificados/emision-certificados.interface';
import { CertificadoReconocimientoVista, RelacionReconocimiento } from '../../reconocimiento-vista.interface';
import { documentoAnulado, etiquetaEstado } from '../../../compartidos/estado-emision';

/** Presentacion exclusivamente: la pagina contenedora resuelve todas las relaciones. */
@Component({
  selector: 'app-reconocimiento-card', standalone: true, imports: [RouterLink],
  templateUrl: './reconocimiento-card.component.html', styleUrl: './reconocimiento-card.component.scss',
})
export class ReconocimientoCardComponent {
  readonly reconocimiento = input.required<Reconocimiento>();
  readonly trabajador = input<RelacionReconocimiento<TrabajadorEmision>>({ estado: 'cargando' });
  readonly persona = input<RelacionReconocimiento<PersonaReconocimiento>>({ estado: 'cargando' });
  readonly area = input<RelacionReconocimiento<AreaReconocimiento>>({ estado: 'cargando' });
  readonly certificacion = input<RelacionReconocimiento<readonly CertificadoReconocimientoVista[]>>({ estado: 'cargando' });
  readonly puedeEditar = input(false);
  readonly puedeVerDetalle = input(false);
  readonly dni = input<string | null>(null);
  protected readonly anulado = documentoAnulado;
  protected readonly estadoRegistro = etiquetaEstado;
  protected readonly nombre = computed(() => {
    const persona = this.persona();
    return persona.estado === 'disponible'
      ? [persona.datos.nombres, persona.datos.apellido_paterno, persona.datos.apellido_materno].filter(Boolean).join(' ').trim() : '';
  });
  protected readonly trabajadorActual = computed(() => { const fila = this.trabajador(); return fila.estado === 'disponible' ? fila.datos : null; });
  protected readonly areaActual = computed(() => { const fila = this.area(); return fila.estado === 'disponible' ? fila.datos : null; });
  protected readonly certificados = computed(() => { const filas = this.certificacion(); return filas.estado === 'disponible' ? filas.datos : []; });

  protected estadoRelacion<T>(relacion: RelacionReconocimiento<T>, campo: string): string {
    switch (relacion.estado) {
      case 'cargando': return `Consultando ${campo}…`;
      case 'sin-permiso': return `${campo}: acceso restringido.`;
      case 'no-encontrado': return `${campo}: registro no encontrado.`;
      case 'error': return `${campo}: no se pudo consultar.`;
      default: return '';
    }
  }
}
