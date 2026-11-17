# Distribución de Solicitudes

Esta revisión sustituye el buscador permanente y la distribución del formulario descritos en los documentos visuales anteriores.

## Cambios

- `src/app/pages/solicitudes/compartidos/bandeja-solicitudes.component.html`: botón de lupa junto a Nueva solicitud, con nombre accesible, estado expandido y campo único debajo del encabezado. La tabla conserva su tarjeta, indicadores y paginación; el buscador ya no se aloja dentro de la tarjeta del listado.
- `src/app/pages/solicitudes/compartidos/bandeja-solicitudes.component.ts`: estado exclusivamente visual del buscador, foco al abrir, cierre mediante botón o Escape, limpieza del término al cerrar y devolución del foco al botón de lupa. Se conserva el debounce de 300 ms y el mismo control reactivo.
- `src/app/pages/solicitudes/compartidos/solicitudes.scss`: acciones agrupadas en el encabezado y buscador desplegable compacto.
- `src/app/pages/solicitudes/nueva-solicitud/nueva-solicitud.component.html`: botón único Actualizar catálogos junto al título, manteniendo carga/deshabilitado y manejador HTTP existentes. Los tres fieldsets originales se agrupan en una cuadrícula, conservando todos sus controles, bindings y validaciones. Descripción y justificación quedan debajo.
- `src/app/pages/solicitudes/nueva-solicitud/nueva-solicitud.component.scss`: tres columnas iguales con tarjetas discretas y controles verticales. Container queries según el ancho real del formulario: tres columnas por encima de 800px, dos hasta 800px y una hasta 520px. Fechas limitadas al ancho de su tarjeta y a 240px.
- `src/app/pages/solicitudes/solicitudes.component.spec.ts`: comprobación de apertura/cierre, foco, término limpiado, debounce, campo único, botón de catálogos único en el título y distribución 3/2/1 con fechas contenidas.

Se conserva el componente del formulario, sin reiniciarlo para aplicar el diseño. No se modificaron FormGroups, FormControlName, servicios, endpoints, permisos, autenticación ni backend. No se agregó sede ni se alteró el Sidebar en esta revisión.

Las capturas previas en artifacts corresponden al diseño anterior.

Ajuste posterior: el campo de búsqueda se despliega en el encabezado, a la izquierda de la lupa, con salto de línea cuando falta espacio. Programación conserva las dos fechas una al lado de otra dentro de su tarjeta, con columnas flexibles y controles compactos.

Corrección del buscador: se eliminó el botón Cerrar. La misma lupa alterna apertura y cierre, y Escape sigue disponible. El campo se ancla con posición absoluta a la izquierda del grupo de acciones, centrado verticalmente; no participa en el flujo ni mueve Nueva solicitud. La apertura revela el campo de derecha a izquierda mediante clip-path, respetando prefers-reduced-motion. El ancho se adapta a móvil.

El buscador también se oculta al pulsar fuera del campo y de la lupa (incluidos Sidebar y Header), sin devolver el foco a la lupa cuando el usuario elige otro elemento. Se conserva la limpieza del término y la consulta con debounce.

Responsable solicitante utiliza el nombre no vacío de la sesión `/auth/me`, con el contexto existente como respaldo. Se ignoran espacios y se enlazan tanto value como el valor inicial del input de solo lectura para conservar el nombre tras un reset nativo. El mismo nombre se muestra en revisión. El contrato Laravel inspeccionado devuelve `user.nombre`; no se añadieron consultas de personas ni se enviaron identidades elegidas por el frontend. Las pruebas cubren un contexto con espacios y el reset del formulario.

Validación final: compilación de producción `ng build` correcta, con advertencias de presupuesto de estilos; suite de ChromeHeadless con 721/721 pruebas correctas y `git diff --check` sin errores. Sin commit ni push.
