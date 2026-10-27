/** Entrada de navegación proporcionada por el consumidor del layout. */
export interface NavigationItem {
  readonly label: string;
  readonly path: string;
  /** Nombre de un Material Icon; el sidebar no muestra ícono si falta. */
  readonly icon?: string;
}
