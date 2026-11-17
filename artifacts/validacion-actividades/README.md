# Capturas de verificación en Chrome

Estas imágenes muestran los componentes Angular reales en un arnés de pruebas:

- `tabla-icono.png`: columna Acciones con el engranaje Material Symbols `settings`.
- `seis-acciones.png`: modal existente de seis acciones, con sus glifos cargados.
- `asociar-ponentes.png`: asociación contextual, sin navegación a RR. HH.

Los registros visibles son fixtures exclusivos de la prueba visual, no datos
extraídos de PostgreSQL ni datos de demostración incorporados a la aplicación.
No se enviaron escrituras a Laravel. Las imágenes se inspeccionaron después de
capturarlas. La suite permanente comprueba además la carga de la fuente local,
el ancho del glifo (20 px), el color, el nombre accesible y el foco del botón.
