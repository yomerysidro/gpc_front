# Solicitudes y Gerencia: sincronización con el contrato Laravel actualizado

## Corrección de botones y flujo temporal en memoria

El bloqueo anterior de Nueva solicitud no provenía de la validación: `puedeGuardar()` exigía `api.integrado === true`, contexto autorizado y facultad de creación/edición. Con las rutas comentadas, `api.integrado` es false y no existe ese contexto. El HTML deshabilitaba ambos botones con `!puedeGuardar()`. También impedían guardar los indicadores de carga de registro/catálogos y `ocupado`; antes no se incluían `form.invalid` ni `form.pending` en esa condición, aunque se validaba al revisar/guardar.

Ahora la habilitación exige un formulario válido, sin validaciones pendientes, sin cargas ni envío en curso. En modo HTTP mantiene contexto y facultades autorizadas. Sin gateway HTTP, permite el flujo visual a la sesión actual mediante un almacén separado (`SolicitudesDemoService`), sin cambiar la configuración de autenticación ni activar rutas.

- Guardar crea o actualiza un Borrador temporal con identificador `demo-N`.
- Enviar actualiza ese mismo registro a Enviada en memoria; no hace POST/PUT ni genera decisiones administrativas.
- El formulario conserva valores al pasar entre los dos pasos. Guardar desde la revisión no crea duplicados al enviar después.
- Mis solicitudes muestra los registros temporales, permite filtrarlos, ver detalle y editar/enviar borradores. No los mezcla con la cola de revisión, Gerencia ni los datos del modo real.
- Se muestra «Solicitud de demostración. No registrada en el sistema oficial» al revisar, guardar y consultar la bandeja temporal. No se presenta una confirmación del servidor por operaciones locales.
- Los datos viven solo en la memoria de esta aplicación; desaparecen al recargar, cerrar sesión o cambiar de usuario. No se usa localStorage, sessionStorage ni PostgreSQL.
- En modo real, los errores HTTP nunca crean una solicitud de demostración como respaldo. Los DTO y las rutas oficiales se conservan intactos.

Archivos de esta corrección: nuevos `solicitudes-demo.service.ts` y `.spec.ts`; adaptados `solicitudes.service.ts`, modelo de presentación Solicitud, Nueva solicitud (`.ts`/`.html`), bandeja compartida (`.ts`/`.html`), modal de decisión y pruebas existentes de Solicitudes. No se crearon formularios, pantallas ni endpoints duplicados.

Compilación de producción correcta (`.angular/solicitudes-demo-build.log`), TypeScript correcto y primera suite específica con 106 pruebas correctas (`.angular/solicitudes-demo-tests.log`). La suite general final incluye además tres pruebas del almacén temporal, aislamiento entre usuarios, validación y ausencia total de HTTP de ese almacén.

Resultado general de esta corrección: **494 pruebas correctas y los mismos 13 fallos preexistentes externos a Solicitudes**, en Gestión y servicios de seguridad. Registro: `.angular/solicitudes-demo-regresion-tests.log`.

## Contratos y revisión previa del modo HTTP

Las cinco pantallas existentes se conservan, con sus formularios, filtros, tablas, modales, navegación y aviso compacto. El workflow permanece en demostración sin persistencia: `ACTIVITY_REQUESTS_API_ACTIVA` sigue en `false` y `AUTORIZACION_SOLICITUDES` en `null`. El Sidebar muestra los nombres de las pantallas desarrolladas sin la etiqueta repetida «Integración pendiente»; el aviso de modo demostración permanece dentro de cada pantalla. No se modificaron autenticación, roles, permisos, guards, Header, Laravel o PostgreSQL. Sin commit ni push.

Se consultaron únicamente en lectura `gpc_back/docs/activity-requests-api-contracts.md`, `app/Http/Data/ActivityRequests/ActivityRequestData.php`, los controladores y `routes/api.php`. La consulta, validación y persistencia ahora residen en ActivityRequestData; ActivityRequestWorkflow es una fachada de compatibilidad. El contrato HTTP no cambió por ese traslado, por lo que los servicios y DTO existentes se reutilizan sin reimplementarlos. Las rutas permanecen en un grupo comentado junto a Actividades en routes/api.php. Su activación y el alcance por área deben resolverse en el servidor; Angular no registra esas rutas ni asigna roles o permisos.

## Contrato sincronizado

- Estados exactos: Borrador, Enviada, En revisión, Observada, Pendiente de aprobación, Aprobada y Rechazada.
- Nombre y sede: máximo 100 caracteres. Descripción opcional: máximo 255. Justificación requerida. Fechas Y-m-d y fin igual o posterior al inicio.
- Aunque PostgreSQL admite 200 caracteres para nombre/sede de solicitud, el contrato limita ambos a 100 por compatibilidad con la actividad que se crea al aprobar.
- Borrador y Observada pueden editarse por el propietario y enviarse a Enviada. Los demás estados permanecen ineditables.
- Las decisiones válidas siguen siendo REVISION_CONFORME, OBSERVAR, DERIVAR_GERENCIA, APROBAR y RECHAZAR. Enviar no inserta una decisión ENVIAR.
- Las respuestas se aceptan solo con `success === true` y datos presentes. Se conservan errores 401/403/404/409 y 422 por campo, sin fabricar confirmaciones ni resultados vacíos.

## Operaciones preparadas

Rutas relativas a `environment.apiBaseUrl`, que ya incluye `/api`:

| Operación | Método y ruta |
| --- | --- |
| Crear borrador | POST `/activity-requests` |
| Editar Borrador u Observada propia | PUT `/activity-requests/{id}` |
| Enviar o reenviar | POST `/activity-requests/{id}/submit`, sin cuerpo |
| Mis solicitudes | GET `/activity-requests/mine` |
| Cola general | GET `/activity-requests` |
| Detalle del propietario | GET `/activity-requests/{id}` |
| Detalle administrativo | GET `/activity-requests/{id}/review-detail` |
| Revisar, observar, derivar, aprobar, rechazar | POST `/activity-requests/{id}/review`, `/observe`, `/derive`, `/approve`, `/reject` |
| Historial propio por solicitud | GET `/activity-requests/{id}/history` |
| Historial global paginado de Gerencia | GET `/activity-requests/decisions/history` |

Los cuerpos de creación/edición mantienen la lista blanca: `id_area`, `id_tipo_actividad`, `nombre`, `descripcion`, `justificacion`, `fecha_inicio_propuesta`, `fecha_fin_propuesta`, `sede_propuesta`. No envían identidades de solicitante/aprobador, estado, actividad vinculada, fecha de solicitud, versión ni observaciones adicionales. Las decisiones solo envían `observacion`; enviar no lleva cuerpo.

## Solicitudes observadas

Se reutiliza Nueva solicitud para cargar la Observada propia, mostrar Guardar corrección, validar y actualizar el mismo identificador mediante PUT. El adaptador exige propiedad y facultad de edición verificadas. Solo después de confirmar el guardado puede reenviar con `/submit`. Si guardar falla, no se envía; si enviar falla, se conserva el registro confirmado y se informa del fallo. Los mensajes distinguen corrección de borrador. No se crea una nueva solicitud al corregir.

## Historial y detalle administrativo

La tabla de Historial de decisiones ahora consulta el endpoint global real sin exigir un identificador de solicitud. Conserva los filtros existentes y añade el identificador de responsable como **filtro de auditoría**, nunca como identidad autenticada.

Se envían únicamente filtros documentados: `id_solicitud_actividad`, `id_usuario_responsable`, `tipo_decision`, `fecha_desde`, `fecha_hasta`, `per_page` y el parámetro estándar `page` del paginador Laravel. Los nombres visuales de resultado se mapean a los cinco valores reales de tipo_decision.

Sin búsqueda textual se respeta directamente total, página y última página del servidor. Como no existe filtro de texto en Laravel, al buscar por nombre/número/área se recorren las páginas autorizadas antes de filtrar y paginar localmente. No se envían parámetros de texto inventados ni se confunde una página con todo el historial.

El DTO de historial global incluye los campos exactos seleccionados por ActivityRequestData: ID de decisión, solicitud y responsable; tipo, transición anterior/nueva, observación, fecha; ID de solicitante y área; y `solicitud_nombre`. La tabla conserva el nombre de la solicitud y la transición histórica. Las etiquetas Usuario #ID y Área #ID identifican registros recibidos; no inventan nombres personales.

Revisión de solicitudes, Pendientes de aprobación e Historial usan `/review-detail` para su modal administrativo, condicionado a facultades verificadas. Mis solicitudes y la edición conservan el detalle del propietario. El historial propio sigue disponible en el servicio HTTP; no se sustituye por acceso administrativo.

## Separación de demostración y HTTP

`ActivityRequestsApiService` contiene los DTO y métodos HTTP documentados, sin fixtures. `SolicitudesHttpGateway` adapta el contrato a las vistas existentes y comprueba el contexto autorizado. `SolicitudesService` conserva la separación de modo demostración/API.

Para activar se requiere publicar las rutas con autenticación confiable, comprobar autorización por rol/área/propiedad y suministrar el contexto de áreas y capacidades verificadas. Los estados por sí solos no conceden permisos. No hay activación por URL, rol, localStorage ni visibilidad del menú. Las trece operaciones HTTP del servicio permanecen bloqueadas por defecto, incluidas las dos nuevas lecturas administrativas.

Las consultas existentes a catálogos de áreas y tipos siguen siendo independientes del workflow y sujetas a los permisos actuales. Un catálogo general de áreas no sustituye el contexto de áreas autorizadas. Documentos por firmar sigue fuera de este contrato.

## Archivos intervenidos

- `src/app/core/interfaces/solicitudes/activity-requests-api.interface.ts`: límites, DTO y filtros del historial global.
- `src/app/core/interfaces/solicitudes/solicitud.interface.ts`: campos de presentación para responsable, nombre y transición histórica.
- `src/app/core/services/solicitudes/activity-requests-api.service.ts` y `.spec.ts`: endpoints y contratos de detalle administrativo/historial global.
- `src/app/core/services/solicitudes/solicitudes-http.gateway.ts` y `.spec.ts`: edición de Observadas, contexto de detalle, filtros/paginación global y restricciones.
- `src/app/core/services/solicitudes/solicitudes.service.ts`: contexto de consulta administrativa para el mismo modal existente.
- `src/app/pages/solicitudes/nueva-solicitud/nueva-solicitud.component.ts` y `.html`: límites, etiqueta y mensajes de corrección.
- `src/app/pages/solicitudes/compartidos/bandeja-solicitudes.component.ts` y `.html`: selección del detalle administrativo y aviso de autorización.
- `src/app/pages/gerencia/historial-decisiones/historial-decisiones.component.ts` y `.html`: filtros globales, transición y detalle.
- `src/app/pages/solicitudes/solicitudes.component.spec.ts`: corrección/reenvío y límites exactos.
- Este documento. No se crearon pantallas ni componentes duplicados.

## Verificación

- Compilación Angular de producción correcta: `.angular/solicitudes-sync-build.log`.
- TypeScript de aplicación y tests comprobado con `tsc --noEmit` para ambos tsconfig.
- Primera suite específica: 104 pruebas correctas (`.angular/solicitudes-sync-tests.log`). Después se añadieron dos casos de restricciones administrativas y conflictos de corrección, incluidos en la suite general final.
- Cobertura: Observada propia por PUT y posterior submit, ausencia de submit al fallar la corrección, estados ineditables, detalle administrativo separado del propietario, historial global paginado, filtros exactos, límites 100/100/255, ausencia de identidades en payloads y bloqueo de las trece operaciones con API desactivada.
- Las respuestas simuladas se limitan a tests; no se validó una sesión productiva ni se accedió a datos institucionales remotos.
- Suite general final: **491 pruebas correctas y 13 fallidas**, todas las fallidas en Gestión y servicios de seguridad con los mismos fallos preexistentes de las ejecuciones anteriores. Las nuevas pruebas de Solicitudes y Gerencia pasaron. Registro: `.angular/solicitudes-sync-regresion-tests.log`.

## Revisión frente a ActivityRequestData y corrección del Sidebar

Se volvió a comparar el frontend con el contrato actual, los métodos estáticos de ActivityRequestData y el grupo comentado de routes/api.php. Coinciden endpoints, verbos, campos de escritura, estados, filtros, paginación, detalle administrativo e historial global. Los DTO y servicios funcionales ya estaban sincronizados y no se rehicieron.

En esta revisión se modificaron únicamente:

- `src/app/components/sidebar/sidebar.component.html`: las pantallas desarrolladas muestran solo su nombre, sin la etiqueta Integración pendiente. Los módulos sin pantalla conservan En desarrollo.
- `src/app/components/sidebar/modulos-navegacion.ts`: descripciones internas actualizadas de aprobación e historial, sin cambiar rutas, habilitación, visibilidad o permisos.
- `src/app/components/sidebar/pantallas-pendientes.spec.ts`: comprueba los nombres limpios del menú y conserva las pruebas de acceso y navegación.
- `src/app/core/services/solicitudes/activity-requests-api.service.spec.ts`: amplía la comprobación HTTP a 403 y 404, además de 401, 409 y 422.
- Este informe: actualiza la ubicación de la lógica y de las rutas del backend.

Se reutilizan NuevaSolicitudComponent, MisSolicitudesComponent, RevisionSolicitudesComponent, PendientesAprobacionComponent, HistorialDecisionesComponent, BandejaSolicitudesComponent y sus modales. Se conservan ActivityRequestsApiService, SolicitudesHttpGateway y SolicitudesService. Continúan preparados corrección y reenvío de Observadas, revisión/derivación, decisiones de Gerencia e historial global; todas las operaciones del workflow siguen bloqueadas hasta publicar las rutas con autenticación y autorización confiables. El formulario y los catálogos de referencia mantienen su comportamiento existente.

Verificación de esta revisión: compilación de producción y TypeScript de aplicación/tests correctos; suite general **491 correctas y 13 fallos preexistentes externos al módulo**. Registros: `.angular/solicitudes-data-sidebar-build.log` y `.angular/solicitudes-data-sidebar-tests.log`. Las pruebas existentes cubren DTO/payloads, formularios, límites, Observadas, paginación, historial, modales, navegación y ausencia de llamadas del workflow cuando REAL está desactivado. Sin consultas de negocio contra una API institucional remota.
