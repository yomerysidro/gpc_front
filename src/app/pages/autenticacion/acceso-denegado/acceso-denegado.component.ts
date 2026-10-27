import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthLayoutComponent } from '../../../components/layouts/auth-layout/auth-layout.component';

@Component({
  selector: 'app-acceso-denegado',
  standalone: true,
  imports: [RouterLink, AuthLayoutComponent],
  templateUrl: './acceso-denegado.component.html',
  styleUrl: './acceso-denegado.component.scss'
})
export class AccesoDenegadoComponent {}
