# Mis solicitudes: tabla y actualizaciones

## Causa comprobada

`BandejaSolicitudesComponent.actualizarAlVolver` escucha `window:focus` y ejecutaba `cargar` incluso sin cambios. Se desactivó para la bandeja propia; revisión y Gerencia conservan su comportamiento. No hay listener de visibilitychange en esta bandeja. El NavigationEnd del contenedor de pestañas solo selecciona la vista y no consulta HTTP por recuperar el foco.

Además, `cargar` asignaba null a la página antes de cada consulta. En Mis solicitudes se conserva la última respuesta durante la actualización y ante errores. El estado de carga distingue la carga inicial de «Actualizando solicitudes…» y la tabla expone aria-busy. Los indicadores conservan los valores válidos. La suscripción anterior sigue cancelándose y las suscripciones mantienen takeUntilDestroyed.

Se conserva el mecanismo `SolicitudesService.cambios$`. Una operación propia evita la recarga duplicada mediante el guard ocupado y actualiza una sola vez al completarse. El formulario conserva su navegación tras enviar y el listado consulta al volver a su pestaña. Búsqueda y paginación siguen utilizando sus mecanismos existentes. Cerrar un buscador ya vacío no emite cambios innecesarios.

## Tabla

Solo Mis solicitudes presenta Solicitud | Actividad | Área solicitante | Responsable | Fecha | Estado | Acciones. Inicio y fin propuestos, revisión e historial siguen disponibles en detalle. El ojo utiliza el Material Symbol visibility local, con tooltip, nombre accesible, área de 44px y estados de interacción. Se conservan las demás acciones permitidas.

El adaptador presenta «Solicitud 1», sin #, partiendo de id_solicitud_actividad real. El DTO HTTP mantiene su ID numérico; el modelo de presentación conserva además ese número en idSolicitudActividad. El campo id textual previo sigue disponible para compatibilidad con las rutas y el resto de componentes; no se cambió ningún identificador almacenado ni se generaron IDs.

area_nombre se mapea a area y solicitante_nombre a responsable. Si faltan, son null o contienen solo espacios, se muestra «No informado», sin construir nombres desde IDs. Esos son los campos que Laravel debe proporcionar si se requiere mostrar los nombres. No se añadieron consultas por fila. La fecha mostrada procede de fecha_solicitud.

## Archivos

- `src/app/pages/solicitudes/compartidos/bandeja-solicitudes.component.{ts,html}`.
- `src/app/pages/solicitudes/compartidos/bandeja-acciones.scss`.
- `src/app/core/interfaces/solicitudes/solicitud.interface.ts`.
- `src/app/core/services/solicitudes/solicitudes-http.gateway.ts`.
- Pruebas: `solicitudes.component.spec.ts`, `solicitudes-real.integration.spec.ts` y `solicitudes-http.gateway.spec.ts`.

No se modificaron endpoints, permisos, Laravel ni PostgreSQL. Sin componentes nuevos, commit ni push.

Validación: ng build correcto, con advertencias de presupuesto de estilos; 724/724 pruebas correctas en ChromeHeadless; git diff --check sin errores.
