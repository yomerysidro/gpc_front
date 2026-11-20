import { Component, inject } from '@angular/core';
import { AvisoOperacion } from './core/interceptors/operacion-aviso.interceptor';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  protected readonly avisos = inject(AvisoOperacion);
}
