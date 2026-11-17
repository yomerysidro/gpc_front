# Mejoras visuales de Solicitudes

## Presentación y filtros

Mis solicitudes conserva indicadores, tabla, paginación y las dos pestañas existentes. Solo su bandeja muestra Buscar solicitud con lupa y Estado, inicialmente Todos los estados. El texto se consulta tras 300 ms; cambiar estado cancela la espera pendiente y aplica ambos valores inmediatamente. Borrar el texto conserva el estado seleccionado. Las consultas anteriores se cancelan mediante el mecanismo existente.

No se cambiaron servicios ni endpoints. La búsqueda utiliza la estrategia existente del servicio (consulta de las páginas autorizadas y filtrado de texto); no se añadió un parámetro de búsqueda inexistente en Laravel. Las fechas y los filtros originales continúan disponibles en las otras bandejas y en los contratos.

## Layout compartido

MainLayout utiliza una cuadrícula fija al viewport, con fila automática para el Header y espacio restante para Sidebar y contenido. Cada columna tiene desplazamiento vertical independiente. ResizeObserver mide el Header real en `--alto-header-real`; el cajón móvil comienza debajo de esa altura. Se conserva el comportamiento del popover, los grupos y las rutas activas. El menú del usuario limita su altura al espacio disponible y admite scroll. Los diálogos nativos conservan su capa superior.

## Formulario y sede

El formulario original mantiene sus dos pasos, borrador, validaciones y envío. Se compactaron secciones, dos columnas y fechas de hasta 240 px en escritorio, con una columna en móvil. Actualizar catálogos muestra un icono real, estado de carga y permanece deshabilitado mientras se ejecuta.

Se inspeccionó sin modificar `gpc_back/app/Http/Data/ActivityRequests/ActivityRequestData.php`: `sede_propuesta` admite `sometimes`, `nullable`, `string`, `max:100`. Se retiró el campo visual, pero permanece el control y su validación. El gateway existente convierte la cadena vacía de una solicitud nueva en null; una sede histórica cargada se conserva al editar y sigue visible en su revisión. No se asignó ninguna sede ficticia.

## Archivos de esta mejora

- `src/app/pages/solicitudes/compartidos/bandeja-solicitudes.component.{ts,html}`: filtros automáticos de la bandeja propia.
- `src/app/pages/solicitudes/compartidos/solicitudes.scss`: filtros, lupa y ajuste de iconos.
- `src/app/pages/solicitudes/compartidos/solicitud-detalle.component.ts`: visibilidad de sede en revisión, conservando el detalle histórico.
- `src/app/pages/solicitudes/nueva-solicitud/nueva-solicitud.component.{ts,html,scss}`: campo visual retirado, distribución y actualización de catálogos.
- `src/app/components/layouts/main-layout/main-layout.component.{ts,html,scss}` y `private-layout/private-layout.component.scss`: distribución y scroll compartidos.
- `src/app/shared/utils/iconos-disponibles.ts`, `public/fonts/material-symbols-outlined.ttf`, `public/fonts/README.md`: ampliación de la fuente local existente con lupa, actualización e iconos de Solicitudes. Sin dependencias nuevas.
- `src/app/pages/solicitudes/solicitudes.component.spec.ts`, `solicitudes-real.integration.spec.ts` y `src/app/components/layouts/main-layout/main-layout.component.spec.ts`: verificaciones de filtrado, formulario, payload, catálogos y layout.

Las modificaciones previas de rutas, Sidebar y contenedor de pestañas permanecen conservadas.

## Validación

- TypeScript: `tsc -p tsconfig.spec.json --noEmit`.
- Producción: `ng build`; finaliza con advertencias de presupuesto de estilos, sin errores.
- Suite Angular: `ng test --watch=false --browsers=ChromeHeadless --reporters=dots`.
- Verificación visual adicional en Chrome: escritorio, móvil, contenido desplazado y ausencia de desbordamiento horizontal. Las capturas están en `artifacts/solicitudes-ux`; usan datos de pruebas y no representan registros reales. El arnés temporal de captura se retiró.

No se modificaron Laravel, PostgreSQL, autenticación, permisos ni endpoints. No se instalaron librerías ni se realizó commit o push.
