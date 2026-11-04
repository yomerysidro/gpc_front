import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { fechasValidas } from '../reportes.utils';

@Component({
  selector: 'app-reportes-asistencia', standalone: true, imports: [FormsModule],
  templateUrl: './reportes-asistencia.component.html', styleUrl: './reportes-asistencia.component.scss',
})
export class ReportesAsistenciaComponent {
  inicio = ''; fin = '';
  readonly mensaje = signal('');
  consultar(): void {
    this.mensaje.set(!fechasValidas(this.inicio, this.fin)
      ? 'La fecha de inicio no puede ser posterior a la fecha de fin.'
      : 'Consulta no disponible: Laravel no permite filtrar ni paginar asistencias por actividad y sesión. No se realizó ninguna descarga de registros.');
  }
  limpiar(): void { this.inicio = ''; this.fin = ''; this.mensaje.set(''); }
}
