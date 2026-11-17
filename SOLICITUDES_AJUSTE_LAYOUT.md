# Ajuste visual de Solicitudes

Esta revisión sustituye la presentación anterior del filtro Estado y del scroll propio del Sidebar descrita en SOLICITUDES_MEJORAS_VISUALES.md. Las capturas anteriores corresponden al diseño previo.

- `src/app/components/layouts/main-layout/main-layout.component.scss`: Sidebar con `overflow: clip`, sin scroll interno ni programático, tanto en escritorio como en móvil. El layout fijo conserva Header y Sidebar; el contenedor `main` mantiene `overflow-y: auto`. Los menús desplegables y el estado activo no cambiaron. Si se despliegan más opciones de las que caben en la pantalla, el exceso queda recortado conforme al requisito de no permitir scroll en el menú.
- `src/app/pages/solicitudes/compartidos/bandeja-solicitudes.component.html`: acción Nueva solicitud trasladada a la fila del título, conservando sus condiciones de permisos; eliminado únicamente el selector visual Estado de la bandeja propia. Las demás bandejas conservan sus filtros.
- `src/app/pages/solicitudes/compartidos/solicitudes.scss`: fila de título con Flexbox, tarjetas de resumen compactas (tres columnas en escritorio), buscador limitado a 36rem y adaptación a móvil.
- `src/app/pages/solicitudes/nueva-solicitud/nueva-solicitud.component.scss`: cuadrícula explícita de dos columnas para área/responsable y nombre/tipo; fechas de hasta 240px; separación horizontal y una columna en móvil. No se añadió sede.
- Pruebas actualizadas en `main-layout.component.spec.ts` y `solicitudes.component.spec.ts` para el Sidebar sin scroll y la búsqueda sin selector Estado.

No se modificaron TypeScript funcional, servicios, validaciones, permisos, rutas, contratos HTTP ni backend. Se conserva la búsqueda existente de 300ms, el formulario y el flujo de dos pasos.

Validación: `ng build` correcto (advertencias de presupuesto de estilos), 720/720 pruebas correctas en ChromeHeadless y `git diff --check` sin errores.
