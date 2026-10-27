import { Component } from '@angular/core';

/**
 * Login dividido de las páginas de acceso: panel de marca a la izquierda y la
 * página proyectada a la derecha. En celular el panel se reduce a un encabezado.
 * Solo presentación: no inyecta servicios.
 */
@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss'
})
export class AuthLayoutComponent {}
