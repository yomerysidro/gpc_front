# Integración real de Solicitudes y Gerencia

## Presentación y filtros de Gerencia

La bandeja compartida conserva su ruta, modales y servicios. En Gerencia solo presenta Ver detalle, Aprobar y Rechazar según las acciones efectivas; Observar sigue disponible en RR. HH. y no se elimina ninguna API o decisión previa. Los controles de Gerencia reutilizan Material Symbols (`visibility`, `check_circle`, `cancel`) en una fila sin envoltura, con objetivos táctiles de 44 px, colores azul institucional/verde/rojo, title y aria-label, foco visible, hover y estado deshabilitado. Sus estilos se cargan únicamente en la bandeja mediante `bandeja-acciones.scss`.

La tabla de Gerencia omite el mensaje de identidad desconocida del revisor y conserva solo nombres o información real de revisión cuando existan. No se sustituye al revisor por el solicitante o el usuario autenticado.

Estado ofrece «Todos los estados» primero (valor vacío) y después los valores reales de `ESTADOS_SOLICITUD`. Al entrar o limpiar, Gerencia selecciona Pendiente de aprobación. Buscar y paginar respetan el estado seleccionado; Todos omite el parámetro en HTTP y Laravel aplica su ámbito. Se mantienen fechas y búsqueda autorizada. Las filas Aprobada y Rechazada siguen consultables, con su badge y solo Ver detalle. Las decisiones se siguen confirmando por HTTP antes de actualizar la bandeja.

Las pruebas comprueban iconos, colores, accesibilidad, disposición horizontal y tamaño táctil, ausencia de Observar y del texto de revisor en Gerencia, observación desde RR. HH., filtros, fechas, búsqueda, paginación, limpieza, consulta de estados finales y recorridos de aprobación/rechazo existentes. No se modifican Sidebar, Header, backend ni PostgreSQL, ni se añaden componentes o servicios.

## Excepciones explícitas de decisión del contrato actualizado

Se verificaron el contrato Laravel y `ModulePermissions::activityRequestCapabilities`. El backend incorpora `decidir_ambito_institucional` y `decidir_propias` dentro de `capacidades_solicitudes`. Angular ahora las tipa y conserva en memoria, aceptando únicamente `true` booleano; si faltan o vienen con otro tipo quedan en false. Login consulta de nuevo `/auth/me`; `recargarSesion()` descarta permisos, módulos y capacidades anteriores y reemplaza las diez claves. Se conservan cookie HttpOnly, credenciales HTTP y guards.

La causa del bloqueo era doble: el adaptador de sesión descartaba las dos claves nuevas, y el gateway exigía `!propia && aprobar/rechazar` sin excepción. Ahora cada decisión exige `(!propia || decidir_propias === true)` y su capacidad formal específica, además del estado real Pendiente de aprobación. `decidir_ambito_institucional` describe la excepción de área otorgada por Laravel y se informa en el modal; no concede por sí sola aprobar, rechazar ni decidir propias. Sin esa excepción se conserva el ámbito laboral aplicado por Laravel a listados/detalles/decisiones; no se inventan áreas de competencia a partir de `authorized-areas`, que corresponde a creación.

El nombre de rol, los IDs institucionales y `consulta_administrativa_global` no conceden ninguna excepción. Un 403 real conserva su tratamiento y bloqueo por expediente para la autorización vigente; recargar `/auth/me` permite reevaluarlo con capacidades actualizadas. El modal reutilizado muestra número, actividad, área y solicitante; la observación de aprobación es opcional y el motivo de rechazo obligatorio. No se envían identidades de actor en el cuerpo ni se crean actividades desde Angular.

Las pruebas incluyen decisiones propias con excepción explícita, bloqueo sin `decidir_propias`, aprobación y rechazo independientes, ámbitos institucional/laboral, estado Enviada, revocación con modal abierto, normalización estricta y recarga de sesión. Los recorridos propios y ajenos comprueban un solo POST ante doble clic, cuerpos reales, confirmación previa al éxito y consultas posteriores de propias, revisión, historial y actividad vinculada. Son pruebas HTTP simuladas; no deciden la Solicitud #1 institucional. En este ajuste no se modificó el Sidebar, Laravel ni PostgreSQL.

## Decisiones formales y actualización de bandejas

El modal existente de Aprobar/Rechazar muestra número, actividad y área. Aprobar admite observación opcional; Rechazar exige un motivo no vacío. Las capacidades `aprobar` y `rechazar` se comprueban por separado, junto con estado y regla de propiedad (`!propia || decidir_propias === true`), incluso al confirmar el modal. Un Administrador con lectura conserva solo las consultas autorizadas.

El gateway exige que Laravel confirme el mismo ID y el estado final esperado: Aprobar debe devolver Aprobada e `id_actividad` positivo; Rechazar debe devolver Rechazada e `id_actividad=null`. Solo entonces `SolicitudesService.cambios$` notifica a las vistas activas para consultar de nuevo. La bandeja que ejecuta la decisión recarga después de la confirmación sin duplicar la consulta. Al navegar se consultan nuevamente las bandejas; al recuperar el foco se actualizan Mis solicitudes, Revisión, Historial y Actividades, conservando filtros y evitando interrumpir escrituras. No se implementa comunicación en tiempo real entre sesiones ni se promete una actualización instantánea en otros equipos.

La consulta individual de trazabilidad usa GET `/{id}/history`, desde «Consultar historial» en el detalle reutilizado. Requiere permiso de propias para el propietario o capacidad de historial para expedientes administrativos; Laravel vuelve a verificar área y propietario. Se muestran decisiones, nombres recibidos, fechas, estados y observaciones. Un error de historial se muestra separado del detalle y nunca como historial vacío. No se infiere un aprobador ni revisor a partir del usuario autenticado.

El detalle conserva `id_actividad` como vínculo recibido y, con `actividades.ver`, enlaza al listado existente `/certificaciones/actividades?actividad=ID`. Este abre su modal existente consultando GET `/api/activity/{id}`; el listado también se carga mediante GET `/api/activity`. Angular no crea actividades al aprobar ni al rechazar.

El contrato de `/auth/me` no incluye áreas de competencia formal ni capacidades por fila. Se respeta el ámbito de listados/detalles de Laravel, sin deducirlo del rol o de las áreas habilitadas para crear solicitudes. Si Laravel devuelve 403 al decidir o consultar el detalle, se comunica el motivo y se retiran las acciones de ese expediente para esa respuesta de autorización; una nueva carga de `/auth/me` permite reevaluar la autorización. No se amplía el ámbito institucional del Gerencial del área 1 a expedientes del área 5.

Las pruebas HTTP simuladas recorren aprobación/rechazo, consulta posterior de propias, revisión e historial y apertura de la actividad confirmada. También comprueban ausencia de POST de actividad, motivo obligatorio, bloqueo durante procesamiento, denegación de área, conflictos, validación, conexión y ausencia de éxito ante una respuesta inconsistente. No se ejecutan escrituras contra Laravel o PostgreSQL institucionales.

## Sincronización de capacidades de Solicitudes

El contrato actualizado está en `../gpc_back/docs/activity-requests-api-contracts.md` (lectura únicamente). `/auth/me` añade exactamente diez claves: `consultar_revision`, `consultar_gerencia`, `consultar_historial`, `consulta_administrativa_global`, `revisar`, `derivar`, `aprobar`, `rechazar`, `decidir_ambito_institucional` y `decidir_propias`. Se conservan en memoria, aceptando únicamente booleanos verdaderos; no se infieren capacidades ausentes a partir del rol o de permisos anteriores.

El Sidebar único, las rutas y el gateway usan las capacidades de consulta independientemente de las acciones. Aprobar y Rechazar dependen de su capacidad específica, estado Pendiente de aprobación y `(!propia || decidir_propias === true)`. Observar conserva `solicitudes.observar` junto con `revisar` antes de Gerencia o `aprobar` en Gerencia, conforme al contrato. Crear, editar, enviar y consultar las propias conservan sus claves `solicitudes.*`: el objeto de capacidades no incluye sustitutos para ellas.

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

El endpoint `authorized-areas` entrega las áreas laborales vigentes del principal con permiso crear; `/auth/me` sigue proporcionando su identidad y permisos. Antes de guardar, el formulario exige pertenencia a esa lista, obtenida para la sesión actual. Laravel vuelve a validar el área al persistir. Los botones administrativos consideran permisos efectivos, propietario y estado; la competencia laboral, las asignaciones actuales y el alcance de las consultas se vuelven a validar en SQL/middleware, nunca solo en Angular. Aprobar/rechazar una solicitud propia se impide en la vista cuando `decidir_propias` no es true; la excepción explícita del backend permite decidirla con la capacidad formal correspondiente.

Si solo hay un área, se selecciona su ID automáticamente y el selector solo contiene esa opción. Con varias áreas se permite elegir únicamente entre las recibidas. Con ninguna se muestra «No tienes un área habilitada para registrar solicitudes» y se impide guardar/enviar. Un 403 de la consulta muestra «Tu usuario no tiene permiso para crear solicitudes»; 401 sigue el flujo de sesión vencida; errores de conexión, 500 o respuesta mal formada permiten reintentar sin áreas de respaldo.

Al cambiar la sesión se descartan las opciones anteriores y se cancelan consultas en curso. Los valores obsoletos quedan bloqueados antes del siguiente ciclo de renderizado. Un cambio de principal invalida el ID del borrador anterior sin borrar nombre, tipo, fechas, sede, descripción ni justificación. Una recarga de sesión del mismo usuario revalida áreas y conserva el ID ya confirmado. Los códigos de rechazo `SOLICITUD_AREA_NO_AUTORIZADA` y `SOLICITUD_SIN_AREA_VIGENTE` se conservan y provocan una nueva consulta de elegibilidad, sin construir opciones a partir del error.

Mis solicitudes siempre consulta `/mine`, sin sustituir la propiedad con filtrado local. El historial no depende del permiso formal de aprobación. Si falta consultar, su botón de detalle administrativo permanece deshabilitado. No se concede firma digital por nombre de rol; Documentos por firmar continúa fuera de este contrato.

## Flujo y validación

Se conservan los dos pasos y los límites de nombre 100, sede 100 y descripción 255. Justificación, área, tipo y fechas son obligatorios; se rechazan espacios y fechas inválidas o invertidas.

El borrador se crea primero; su `data.id_solicitud_actividad` se valida y conserva antes de submit. Los dobles clics se bloquean durante ambas operaciones. Las correcciones guardan mediante PUT el mismo ID. Un fallo de envío conserva el borrador confirmado y no crea otro al reintentar. El éxito de envío exige estado Enviada confirmado; después se navega a Mis solicitudes, se muestra el aviso y se consulta nuevamente Laravel. Las transiciones administrativas también recargan el listado.

Los cuerpos de borrador solo incluyen id_area, id_tipo_actividad, nombre, descripcion, justificacion, fecha_inicio_propuesta, fecha_fin_propuesta y sede_propuesta. Las decisiones solo incluyen observacion. No se envían solicitante, aprobador, estado, versión ni actividad vinculada.

Los errores 422 de `data` se muestran junto a su campo y persisten al regresar del paso de revisión; se retiran al modificar ese campo. Un 401 termina la sesión; 403, 404 y 409 se distinguen de un resultado vacío. Los errores 5xx no muestran SQL ni mensajes internos. Una lista vacía solo se presenta tras una respuesta real confirmada con cero filas.

La paginación sin búsqueda conserva los metadatos de Laravel. El contrato no ofrece búsqueda textual: esa función recorre las páginas autorizadas de Laravel y filtra por nombre/número (y área en historial), sin inventar parámetros ni ampliar el ámbito del servidor.

Los listados y detalles consumen `area_nombre`, `solicitante_nombre` y `tipo_actividad_nombre`; el historial consume `area_nombre` y `responsable_nombre`. Solo cuando Laravel no informa un nombre se conserva el identificador como respaldo. Las respuestas de transición no incluyen necesariamente nombres: la bandeja recarga los datos desde Laravel después de cada operación.

Revisión de solicitudes aparece una sola vez, bajo Recursos Humanos, conservando `/solicitudes/revision` y su componente. Solicitudes contiene únicamente Nueva solicitud y Mis solicitudes. Revisión consulta inicialmente `estado=Enviada`; tras confirmar `/review`, consulta `estado=En revisión` para continuar con `/derive`. Limpiar filtros vuelve a Enviada. Gerencia selecciona inicialmente `estado=Pendiente de aprobación`; el selector permite consultar cualquier estado real autorizado o todos omitiendo `estado`. Limpiar filtros restablece Pendiente de aprobación. Aprobar/rechazar una Enviada sigue bloqueado por estado. Cada detalle administrativo utiliza el ID recibido y `/review-detail`.

Revisión queda al final de Recursos Humanos, después de Personas, Trabajadores, Practicantes, Ponentes y Reconocimientos. En esa bandeja y su detalle, el badge traduce visualmente `Enviada` a «Pendiente de revisión»; el DTO, `data-estado`, filtros y transiciones conservan `Enviada`. Mis solicitudes conserva la etiqueta original. El estado solo cambia después de confirmar la respuesta de Laravel y recargar el listado.

**Identidad del revisor pendiente en el contrato backend:** se verificaron `ActivityRequestRow`, el contrato actualizado y `ActivityRequestData::addRequestNames`: listados y detalles devuelven área, solicitante y tipo, pero ningún campo de identidad del revisor. `responsable_nombre` pertenece a cada decisión del historial; no se reutiliza como revisor ni se sustituye por el solicitante o usuario autenticado. La presentación admite el nombre en el modelo de vista si está disponible; en la integración actual permanece null. Borrador/Enviada muestran «Pendiente de asignación de revisor»; otras etapas sin identidad muestran «Identidad del revisor no disponible». Para mostrar un revisor real desde listados/detalles se requiere un campo backend documentado; este ajuste no lo añade ni inventa su nombre JSON.

La integración no amplía el ámbito de Gerencial del área 1 para consultar o decidir una solicitud del área 5. Laravel conserva la autoridad sobre pertenencia, competencia y derivación. La prueba del registro con ID 1 utiliza una respuesta HTTP simulada; no se lee ni modifica PostgreSQL para esa prueba.

## Verificación y límites

- Lecturas HTTP anónimas de `/auth/me`, `/activity-requests`, `/mine`, historial global y `/authorized-areas` devolvieron 401: las rutas están publicadas y protegidas.
- Las pruebas automatizadas de sesión, credenciales, guards, catálogos, formulario, creación/submit, corrección, revisión/derivación, aprobación/rechazo e historial usan HttpTestingController. Sus fixtures solo existen en archivos `.spec.ts`.
- La prueba de creación/envío ejecuta las pantallas, servicios, adaptador, interceptor y guards reales contra respuestas HTTP de prueba; comprueba un único POST, el ID devuelto, confirmación previa a navegar y GET `/mine` posterior.
- Se comprueban motivos obligatorios, ausencia de identidades en cuerpos, bloqueo de aprobación por nombre de rol o propiedad, errores por campo y ausencia de respuesta vacía fabricada ante 401/403.
- Se corrigieron expectativas antiguas de tests del Sidebar preliminar y del enlace canónico de Configuración, sin cambiar las pantallas de Gestión.
- La compilación Angular y las verificaciones TypeScript se ejecutan con las configuraciones del proyecto. El resumen final de la tarea contiene sus resultados.

No se han creado solicitudes, decisiones ni actividades en la base institucional. Un recorrido con usuarios reales y escrituras, o la comprobación de concurrencia PostgreSQL, requiere un entorno de pruebas expresamente autorizado. No se modifican ni se preparan permisos desde Angular. Laravel valida el permiso formal y el ámbito laboral o la excepción institucional explícita en cada decisión; la interfaz conserva sus rechazos 403.

## Resultado y archivos modificados

Suite completa: **673 pruebas correctas, cero fallos**. Incluye consulta de áreas con credenciales, selección única/múltiple/vacía, 401/403/500/conexión, respuestas mal formadas, revocación, cancelación al cambiar de sesión, recarga del mismo principal, rechazo de áreas manipuladas y reintento de envío 409 con el mismo ID y todos los campos conservados. Las verificaciones TypeScript de aplicación y tests y la compilación Angular de producción son correctas. La compilación conserva dos advertencias de presupuesto CSS ya existentes en PrivateLayout y ListarActividades; no impiden generar los bundles.

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
