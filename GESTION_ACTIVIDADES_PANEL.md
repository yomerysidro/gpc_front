# Gestión de Actividades: panel de acciones

La tabla presenta un solo botón «Gestionar actividad» por registro. Abre un único
`DialogoComponent` reutilizado para la actividad seleccionada, con seis tarjetas:
Ver detalle, Editar, Participantes, Ponentes, Sesiones y asistencia y Cerrar actividad.
La cuadrícula tiene tres columnas en escritorio, dos en móviles y una en pantallas
muy estrechas. Usa Material Symbols, botones/enlaces nativos y foco visible; el
diálogo nativo contiene el foco y admite Escape. Las tarjetas sin permiso quedan
deshabilitadas. No se añadieron rutas ni módulos al Sidebar.

## Componentes y navegación reutilizados

- `ListarActividadesComponent`: tabla, filtros, paginación, detalle y edición.
- `DialogoComponent` y `DialogoConfirmacionComponent`: panel, formularios y confirmaciones.
- Participantes: `/certificaciones/participantes?id_actividad=<id_actividad>`.
- Sesiones y asistencia: `/certificaciones/sesiones-asistencia?id_actividad=<id_actividad>`.
  Conserva las dos pestañas existentes y sus componentes.
- Catálogo de Recursos Humanos: `/gestion/ponentes`, sin crear un segundo catálogo.
- Nueva solicitud: `/solicitudes/nueva`, visible con `solicitudes.crear`.

El ID se toma del registro de Laravel, nunca de una posición de la tabla. El filtro
de Participantes conserva ese ID y lo preselecciona al registrar una inscripción.

## Simplificación y navegación contextual

El listado principal conserva búsqueda por nombre, filtro por área, tabla y paginación.
Se retiraron sus selectores de tipo y estado; las columnas permanecen y el modelo de
filtrado por estado no se eliminó. El nombre de la actividad se presenta limpio.
`origen` e `id_solicitud_actividad` se conservan y se muestran en Ver detalle.

Los enlaces usan `id_actividad`; se admite `actividad` para compatibilidad con URL
anteriores. El parámetro debe ser un entero positivo seguro. No se transmite el
objeto como fuente de verdad: cada destino valida el ID mediante `GET /api/activity/{id}`.

Participantes conserva un único componente y formulario:

- En modo contextual consulta el detalle, comprueba su ID/nombre y carga los catálogos
  reales de Personas, Tipos de participación y Documentos. No pide además el catálogo
  general de Actividades. Solo abre automáticamente Inscribir participante si la
  actividad es accesible, existe permiso `participantes.crear` y los catálogos
  obligatorios se han cargado correctamente.
- La actividad tiene una sola opción real y su control se deshabilita. El envío usa
  `getRawValue()` y vuelve a comprobar la coincidencia con el ID validado.
- Cancelar deja el listado filtrado; guardar cierra y consulta nuevamente Laravel,
  conservando el filtro. No hay POST al abrir o cancelar.
- La entrada desde Sidebar sin ID limpia el contexto, consulta las opciones
  autorizadas y permite seleccionar manualmente actividad, persona y tipo.
- Cambiar el ID cancela lecturas antiguas y descarta formularios anteriores. Cambiar
  parámetros ajenos a la actividad no repite consultas ni reabre la inscripción.
- Se diferencian errores de catálogos y listas vacías, tanto en el listado como en
  el modal. Los errores 401/403/409/422 conservan su mensaje o sus errores de campo.

`GET /api/participation` no implementa un filtro por actividad en el controlador
local inspeccionado. Se conserva esa ruta sin parámetros inventados y se filtra
localmente su respuesta autorizada. Las consultas de catálogos son por lotes.

Sesiones y asistencia reutiliza sus dos pestañas y CRUD. Un contexto válido muestra
el nombre real, protege el filtro de actividad en ambas pestañas y lo conserva al
limpiar otros filtros. La actividad se preselecciona en el formulario de sesión;
la asistencia ofrece solo sesiones y participaciones de esa actividad. Las personas
se consultan mediante un listado por lotes, sin una petición por fila. La validación
del detalle de actividad no se repite al cambiar de pestaña. En modo general sigue
disponible la selección manual, que se conserva al pasar entre pestañas.

Ponentes mantiene el modal contextual y los contratos confirmados de asociación
descritos más abajo; no se confunde el catálogo de RR. HH. con una asignación.

## Contratos comprobados por lectura del backend local

Se inspeccionaron `routes/api.php`, `config/module_permissions.php`, los controladores
y Data de Activity, ActivitySpeaker y Area. No se modificó ningún archivo del backend.

| Operación | Contrato existente | Permiso efectivo |
| --- | --- | --- |
| Listado/detalle | `GET /api/activity`, `GET /api/activity/{id}` | `actividades.ver` |
| Edición | `PUT /api/activity/{id}` | `actividades.editar` |
| Cierre | `PATCH /api/activity/{id}`, `{ "estado": "Cerrada" }` | `actividades.editar` |
| Catálogos de consulta/edición | `GET /api/areas/list`, `GET /api/ativicty-type` | `areas.ver`, `actividades.ver` |
| Asignaciones de ponentes | `GET /api/activity-speaker` | `ponentes-firmantes.ver` |
| Catálogo de ponentes/personas | `GET /api/person-speakers/list`, `GET /api/persons/list` | `ponentes-firmantes.ver`, `personas.ver` |
| Nombres de asignaciones | `GET /api/person-speakers/detail/{id}`, `GET /api/persons/detail/{id}` | Permisos de lectura correspondientes |
| Vincular ponente | `POST /api/activity-speaker`, `{ "id_actividad": number, "id_persona_ponente": number }` | `ponentes-firmantes.crear` |
| Desvincular ponente | `DELETE /api/activity-speaker/{id_actividad_ponente}` | `ponentes-firmantes.eliminar` |

Las consultas y mutaciones usan el contexto autenticado existente; el interceptor
envía cookies a la API. Las mutaciones de Actividades especifican además
`withCredentials: true`. Los servicios no leen tokens ni simulan respuestas exitosas.
La consulta de asignaciones filtra por el ID de actividad en la respuesta real,
porque el endpoint existente no declara un filtro por actividad.

El cierre requiere confirmación y un registro en estado `Activa`; el cliente no cambia
el estado antes de una respuesta exitosa con el mismo ID y estado `Cerrada`. Después
vuelve a consultar el listado. Una actividad cerrada conserva el detalle y las demás
operaciones permitidas por Laravel. Los errores 403/409/422 se conservan.

## Áreas y permisos

`GET /api/areas/list?uso=actividades` devolvía 403 expresamente en `AreaController`,
por estar asociado al alta directa deshabilitada. Se sustituye por el catálogo
existente `GET /api/areas/list` únicamente en la gestión de actividades.
Solicitudes conserva exclusivamente `GET /api/activity-requests/authorized-areas`.

`area_nombre` y `tipo_actividad_nombre`, cuando estén incluidos en un registro, tienen
prioridad en tabla y detalle. Si falla el catálogo, se conservan esos nombres y se
muestra el error; a falta de un nombre real se muestra el identificador. Los filtros
pueden usar los IDs y nombres de las actividades realmente recibidas.

La edición conserva los IDs actuales del detalle aunque un catálogo falle. Esto
permite editar los demás campos sin exigir acceso a un catálogo ajeno a la operación.
No se aplican restricciones por propietario, rol o área de la sesión en Angular.
Laravel determina el ámbito y valida cualquier cambio. En el backend local, cambiar
los datos autorizados de una actividad vinculada a solicitud puede devolver 409;
Angular muestra ese rechazo sin inventar un procedimiento alternativo.

## Integración pendiente y límites

No falta un endpoint de asociación de ponentes en el backend local: se confirmó y
se implementó su consumo. Si la API desplegada devuelve 403/404 o el catálogo no
está disponible, se muestra el error real y no se simula una vinculación. Debe
verificarse que ese despliegue publique el contrato y los permisos descritos.

No se crean actividades por POST, no se generan certificados al aprobar, cerrar o
vincular ponentes, y no se considera la asignación de un ponente como acreditación
de requisitos de certificación. El panel no ofrece eliminación de actividades.

Las pruebas automatizadas usan HTTP simulado; no escriben en Laravel ni PostgreSQL.

## Archivos modificados para este panel

- `src/app/core/interfaces/actividades/actividad.interface.ts`
- `src/app/core/services/actividades/actividades.service.ts`
- `src/app/core/services/actividades/actividades.service.spec.ts`
- `src/app/pages/actividades/listar-actividades/listar-actividades.component.ts`
- `src/app/pages/actividades/listar-actividades/listar-actividades.component.html`
- `src/app/pages/actividades/listar-actividades/listar-actividades.component.scss`
- `src/app/pages/actividades/listar-actividades/listar-actividades.component.spec.ts`
- `src/app/pages/solicitudes/solicitudes-real.integration.spec.ts`
- `src/app/pages/emision-certificados/actividades/sesiones-asistencia.component.spec.ts`
- `src/app/core/services/participantes/participantes.service.ts`
- `src/app/core/services/participantes/participantes.service.spec.ts`
- `src/app/pages/participantes/listar-participantes/listar-participantes.component.ts`
- `src/app/pages/participantes/listar-participantes/listar-participantes.component.html`
- `src/app/pages/participantes/listar-participantes/listar-participantes.component.spec.ts`
- `src/app/pages/emision-certificados/actividades/actividades.component.ts`
- `src/app/pages/emision-certificados/actividades/actividades.component.html`
- `src/app/pages/emision-certificados/actividades/sesiones-asistencia-listado.ts`
- `src/app/pages/emision-certificados/compartidos/listado-emision.component.ts`
- `src/app/pages/emision-certificados/compartidos/listado-emision.component.html`
- `src/app/pages/emision-certificados/compartidos/formulario-emision.component.ts`
- `src/app/pages/emision-certificados/compartidos/formulario-emision.component.html`
- Este documento.

## Validación

- Compilación Angular de desarrollo y producción completadas.
- Suite completa: **702 pruebas correctas**, en ChromeHeadless.
- `tsc -p tsconfig.spec.json --noEmit` sin errores.
- La compilación de las pruebas comprueba también TypeScript.
- `git diff --check` sin errores de espacios.
- Producción conserva advertencias de presupuesto para el bundle inicial y algunos
  estilos. No se aumentaron los presupuestos ni se superaron los límites de error.
- Sin modificaciones de Laravel/PostgreSQL, instalaciones, commit ni push.
