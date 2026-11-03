# Integración real de Solicitudes y Gerencia

## Sincronización de capacidades de Solicitudes

El contrato actualizado está en `../gpc_back/docs/activity-requests-api-contracts.md` (lectura únicamente). `/auth/me` añade exactamente ocho claves: `consultar_revision`, `consultar_gerencia`, `consultar_historial`, `consulta_administrativa_global`, `revisar`, `derivar`, `aprobar` y `rechazar`. Se conservan en memoria, aceptando únicamente booleanos verdaderos; no se infieren capacidades ausentes a partir del rol o de permisos anteriores.

El Sidebar único, las rutas y el gateway usan las capacidades de consulta independientemente de las acciones. Aprobar y Rechazar dependen de su capacidad específica, estado Pendiente de aprobación y separación del propietario. Observar conserva `solicitudes.observar` junto con `revisar` antes de Gerencia o `aprobar` en Gerencia, conforme al contrato. Crear, editar, enviar y consultar las propias conservan sus claves `solicitudes.*`: el objeto de capacidades no incluye sustitutos para ellas.

Las denegaciones locales usan `AccesoSolicitudLocal`, sin estado HTTP, distinguiendo consulta y acción. Los 401/403 recibidos por HTTP, los errores de conexión y los 5xx conservan su tratamiento diferenciado; el 403 muestra el motivo de Laravel. El modal y el gateway vuelven a comprobar la autorización al decidir. Durante la recarga de `/auth/me` se retiran las capacidades, permisos y módulos anteriores; después se reemplazan con la respuesta actual. Se mantienen cookie HttpOnly y `withCredentials: true`.

La suite de integración comprueba consulta administrativa de Gerencia sin aprobar/rechazar, capacidades falsas frente a permisos antiguos, bloqueo sin consulta, revisión e historial independientes de escritura, aprobación explícita, 401/403, revocación con modal abierto y reemplazo de sesión. Utiliza HTTP simulado: no acredita un recorrido autenticado contra una instancia Laravel en ejecución.

## Contrato comprobado

La integración reutiliza las cinco pantallas, ActivityRequestsApiService, SolicitudesHttpGateway y SolicitudesService. Se verificaron en lectura `gpc_back/docs/activity-requests-api-contracts.md`, AuthController, AuthorizeActivityRequest, ActivityRequestController y las 15 rutas registradas en `routes/api.php`, incluida la consulta de áreas autorizadas. No se modificó Laravel ni PostgreSQL.

`ACTIVITY_REQUESTS_API_ACTIVA` está habilitada por defecto y `AUTORIZACION_SOLICITUDES` utiliza el usuario y los permisos efectivos de `/auth/me`. No existe almacén DEMO, respaldo con fixtures, token en localStorage, actor enviado en cuerpos ni actividad creada por Angular. Las pruebas pueden deshabilitar el adaptador explícitamente para comprobar el cierre de operaciones sin API.

## Cookies y sesión

- POST `/api/auth/login`: JSON `{email, password}`; luego GET `/api/auth/me` carga user, modulos y permisos.
- POST `/api/auth/logout`: limpia el estado local cuando Laravel confirma, o cuando devuelve 401. Un fallo de red/servidor se informa y no se presenta como cierre confirmado de la cookie.
- Las peticiones de sesión y de Solicitudes llevan `withCredentials: true`. Los catálogos usan el contexto autenticado existente y el interceptor habilita credenciales solo para apiBaseUrl.
- Se conserva el interceptor, la cookie HttpOnly, los guards y la exclusión de la API del caché de transferencia SSR. JavaScript no lee cookies ni fabrica Bearer.
- Desarrollo usa `/api` mediante el proxy existente; producción usa `/api` en el mismo sitio. La configuración de CORS/cookie corresponde al backend y al despliegue.

## Rutas reutilizadas

Todas las rutas siguientes son relativas a `/api/activity-requests` y mantienen el contrato `{success, message, data}`.

| Operación | Método y sufijo | Permisos `solicitudes.*` |
|---|---|---|
| Áreas habilitadas para crear | GET `/authorized-areas` | crear |
| Crear borrador | POST raíz | crear |
| Editar Borrador/Observada propia | PUT `/{id}` | editar |
| Enviar/reenviar | POST `/{id}/submit`, sin cuerpo | enviar |
| Mis solicitudes | GET `/mine` | propias |
| Cola por estado | GET raíz | consultar |
| Detalle | GET `/{id}` | propias/consultar según propietario |
| Detalle administrativo | GET `/{id}/review-detail` | consultar |
| Historial individual | GET `/{id}/history` | propias/historial |
| Historial global paginado | GET `/decisions/history` | historial |
| Revisar | POST `/{id}/review` | revisar |
| Observar | POST `/{id}/observe` | observar + revisar antes de Gerencia, observar + aprobar en Gerencia |
| Derivar | POST `/{id}/derive` | revisar + derivar |
| Aprobar | POST `/{id}/approve` | aprobar explícito |
| Rechazar | POST `/{id}/reject` | rechazar explícito |

Nueva solicitud utiliza exclusivamente GET `/api/activity-requests/authorized-areas` para seleccionar área. GET `/api/areas/list` queda reservado a otras pantallas administrativas: no es fuente ni respaldo de este formulario. Los tipos se consultan mediante GET `/api/ativicty-type?estado=1`, conservando esa escritura, los IDs reales y las opciones activas.

## Alcance y autorización

El Sidebar único y las rutas reales de las cinco pantallas usan permisos efectivos, no el nombre de rol. `/solicitudes` redirige a Mis solicitudes, conservando la URL institucional del módulo. La edición utiliza `solicitudes.editar`; la creación exige crear; Revisión, Gerencia e Historial consultan respectivamente consultar_revision, consultar_gerencia y consultar_historial de capacidades_solicitudes. La consulta de Gerencia no exige aprobar ni rechazar. Nueva solicitud y Mis solicitudes conservan solicitudes.crear y solicitudes.propias porque Laravel no devuelve capacidades nuevas para ellas.

Se corrigió además la correspondencia antigua de Trabajadores en el menú, la ruta y su configuración CRUD: utiliza `trabajadores.*`, como `config/module_permissions.php` de Laravel. Ponentes conserva `ponentes-firmantes.*`. No se conceden ambos permisos por tener uno de ellos.

El endpoint `authorized-areas` entrega las áreas laborales vigentes del principal con permiso crear; `/auth/me` sigue proporcionando su identidad y permisos. Antes de guardar, el formulario exige pertenencia a esa lista, obtenida para la sesión actual. Laravel vuelve a validar el área al persistir. Los botones administrativos consideran permisos efectivos, propietario y estado; la competencia laboral, las asignaciones actuales y el alcance de las consultas se vuelven a validar en SQL/middleware, nunca solo en Angular. Aprobar/rechazar una solicitud propia se impide también en la vista.

Si solo hay un área, se selecciona su ID automáticamente y el selector solo contiene esa opción. Con varias áreas se permite elegir únicamente entre las recibidas. Con ninguna se muestra «No tienes un área habilitada para registrar solicitudes» y se impide guardar/enviar. Un 403 de la consulta muestra «Tu usuario no tiene permiso para crear solicitudes»; 401 sigue el flujo de sesión vencida; errores de conexión, 500 o respuesta mal formada permiten reintentar sin áreas de respaldo.

Al cambiar la sesión se descartan las opciones anteriores y se cancelan consultas en curso. Los valores obsoletos quedan bloqueados antes del siguiente ciclo de renderizado. Un cambio de principal invalida el ID del borrador anterior sin borrar nombre, tipo, fechas, sede, descripción ni justificación. Una recarga de sesión del mismo usuario revalida áreas y conserva el ID ya confirmado. Los códigos de rechazo `SOLICITUD_AREA_NO_AUTORIZADA` y `SOLICITUD_SIN_AREA_VIGENTE` se conservan y provocan una nueva consulta de elegibilidad, sin construir opciones a partir del error.

Mis solicitudes siempre consulta `/mine`, sin sustituir la propiedad con filtrado local. El historial no depende del permiso formal de aprobación. Si falta consultar, su botón de detalle administrativo permanece deshabilitado. No se concede firma digital por nombre de rol; Documentos por firmar continúa fuera de este contrato.

## Flujo y validación

Se conservan los dos pasos y los límites de nombre 100, sede 100 y descripción 255. Justificación, área, tipo y fechas son obligatorios; se rechazan espacios y fechas inválidas o invertidas.

El borrador se crea primero; su `data.id_solicitud_actividad` se valida y conserva antes de submit. Los dobles clics se bloquean durante ambas operaciones. Las correcciones guardan mediante PUT el mismo ID. Un fallo de envío conserva el borrador confirmado y no crea otro al reintentar. El éxito de envío exige estado Enviada confirmado; después se navega a Mis solicitudes, se muestra el aviso y se consulta nuevamente Laravel. Las transiciones administrativas también recargan el listado.

Los cuerpos de borrador solo incluyen id_area, id_tipo_actividad, nombre, descripcion, justificacion, fecha_inicio_propuesta, fecha_fin_propuesta y sede_propuesta. Las decisiones solo incluyen observacion. No se envían solicitante, aprobador, estado, versión ni actividad vinculada.

Los errores 422 de `data` se muestran junto a su campo y persisten al regresar del paso de revisión; se retiran al modificar ese campo. Un 401 termina la sesión; 403, 404 y 409 se distinguen de un resultado vacío. Los errores 5xx no muestran SQL ni mensajes internos. Una lista vacía solo se presenta tras una respuesta real confirmada con cero filas.

La paginación sin búsqueda conserva los metadatos de Laravel. El contrato no ofrece búsqueda textual: esa función recorre las páginas autorizadas de Laravel y filtra por nombre/número (y área en historial), sin inventar parámetros ni ampliar el ámbito del servidor.

El contrato de filas e historial devuelve IDs, no nombres relacionados de área, tipo ni responsable. Cuando no existe un nombre confirmado se muestra `Área #ID`, `Tipo #ID` o `Usuario #ID`, con el identificador recibido; no se inventan personas. El formulario utiliza los nombres reales del catálogo y del solicitante en sesión.

## Verificación y límites

- Lecturas HTTP anónimas de `/auth/me`, `/activity-requests`, `/mine`, historial global y `/authorized-areas` devolvieron 401: las rutas están publicadas y protegidas.
- Las pruebas automatizadas de sesión, credenciales, guards, catálogos, formulario, creación/submit, corrección, revisión/derivación, aprobación/rechazo e historial usan HttpTestingController. Sus fixtures solo existen en archivos `.spec.ts`.
- La prueba de creación/envío ejecuta las pantallas, servicios, adaptador, interceptor y guards reales contra respuestas HTTP de prueba; comprueba un único POST, el ID devuelto, confirmación previa a navegar y GET `/mine` posterior.
- Se comprueban motivos obligatorios, ausencia de identidades en cuerpos, bloqueo de aprobación por nombre de rol o propiedad, errores por campo y ausencia de respuesta vacía fabricada ante 401/403.
- Se corrigieron expectativas antiguas de tests del Sidebar preliminar y del enlace canónico de Configuración, sin cambiar las pantallas de Gestión.
- La compilación Angular y las verificaciones TypeScript se ejecutan con las configuraciones del proyecto. El resumen final de la tarea contiene sus resultados.

No se han creado solicitudes, decisiones ni actividades en la base institucional. Un recorrido con usuarios reales y escrituras, o la comprobación de concurrencia PostgreSQL, requiere un entorno de pruebas expresamente autorizado. No se modifican ni se preparan permisos desde Angular. Si la sesión carece de vínculo laboral vigente o de permiso formal, Laravel devolverá 403 y la interfaz lo comunicará.

## Resultado y archivos modificados

Suite completa: **587 pruebas correctas, cero fallos**. Incluye consulta de áreas con credenciales, selección única/múltiple/vacía, 401/403/500/conexión, respuestas mal formadas, revocación, cancelación al cambiar de sesión, recarga del mismo principal, rechazo de áreas manipuladas y reintento de envío 409 con el mismo ID y todos los campos conservados. Las verificaciones TypeScript de aplicación y tests y la compilación Angular de producción son correctas. La compilación conserva dos advertencias de presupuesto CSS ya existentes en PrivateLayout y ListarActividades; no impiden generar los bundles.

Producción y documentación:

- `SOLICITUDES_INTEGRACION.md`.
- `src/app/app.routes.ts`.
- `src/app/components/sidebar/modulos-navegacion.ts`.
- `src/app/core/guards/permission.guard.ts`.
- `src/app/core/interfaces/solicitudes/activity-requests-api.interface.ts` y `solicitud.interface.ts`.
- `src/app/core/services/autenticacion/session-auth.service.ts`.
- `src/app/core/services/solicitudes/activity-requests-api.service.ts`, `solicitudes-http.gateway.ts` y `solicitudes.service.ts`.
- `src/app/pages/solicitudes/nueva-solicitud/nueva-solicitud.component.ts` y `.html`.
- `src/app/pages/solicitudes/compartidos/bandeja-solicitudes.component.ts`.
- `src/app/pages/gerencia/historial-decisiones/historial-decisiones.component.ts` y `.html`.
- `src/app/shared/components/gestion-table/gestion-config.ts`.

Pruebas modificadas:

- `src/app/base-architecture.spec.ts`.
- `src/app/components/sidebar/modulos-navegacion.spec.ts` y `pantallas-pendientes.spec.ts`.
- `src/app/core/services/solicitudes/activity-requests-api.service.spec.ts`, `solicitudes-http.gateway.spec.ts` y `solicitudes.service.spec.ts`.
- `src/app/pages/gestion-navigation.spec.ts`.
- `src/app/pages/solicitudes/solicitudes.component.spec.ts`.
- `src/app/shared/components/gestion-table/gestion-table.component.spec.ts`.

Prueba nueva: `src/app/pages/solicitudes/solicitudes-real.integration.spec.ts`.

Sin commit ni push. El Header, los colores, los formularios, tablas y modales existentes se conservan.
