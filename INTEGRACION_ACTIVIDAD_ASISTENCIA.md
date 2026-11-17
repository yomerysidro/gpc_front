# Integración contextual de actividades y asistencia

## Control de Presente y Ausente con círculos

Participantes conserva su tabla y estado de inscripción. El acceso contextual «Controlar asistencia» abre `/certificaciones/sesiones-asistencia?id_actividad=ID&pestana=asistencias`, la misma pestaña utilizada desde el detalle. El Sidebar conserva sus tres opciones.

La matriz reutilizada presenta N.º, Participante, Presente (check verde), Ausente (X roja) y Resultado. Los controles son botones nativos con tooltip, aria-label y aria-pressed, utilizables mediante teclado. El relleno del círculo y el texto del resultado confirman el estado, además del color.

El backend local permite persistir `ESTADO` como texto de hasta 30 caracteres; no exige horas en el alta. Se revisaron también `AttendanceTest`, `PostgresModuleContractTest` y `ModuleIntegrationTest`, que utilizan `Presente`/`PRESENTE`, `AUSENTE` y protegen asistencias que sustentan certificados. No existe un enum institucional en el contrato actual.

Ambas marcas utilizan **`POST /api/attendance/create`**, con `ID_PARTICIPACION`, `ID_ACTIVIDAD_SESION` y `ESTADO: "PRESENTE"` o `"AUSENTE"`. No envían ni generan horas. Tras el POST se consulta **`GET /api/attendance/{id}`** y se comprueba la coincidencia de participación, sesión y estado antes de marcar visualmente o publicar éxito. Se bloquean clics repetidos durante la escritura y confirmación.

Un registro existente se corrige mediante «Regularizar», usando **`PATCH /api/attendance/update/{id}`** con los campos editados; cambiar únicamente el estado no envía las horas. Los círculos no sobrescriben registros históricos silenciosamente. Las respuestas 401, 403, 409 y 422 se muestran; si el guardado no puede confirmarse, se bloquean nuevas escrituras hasta actualizar la consulta mediante GET, evitando reintentos POST ambiguos.

La inscripción se cruza por `id_participacion` y `id_actividad_sesion`, nunca solamente por persona. Sin registro se muestra Pendiente. `activo`, `inactivo`, `nn`, otros estados históricos y las horas no se convierten automáticamente en presente o ausente. Los estados históricos o duplicados se cuentan como «Por regularizar». El resumen usa todos los inscritos de la sesión, independientemente de filtros de texto y paginación: Inscritos, Presentes, Ausentes, Pendientes y, cuando corresponde, Por regularizar.

Las horas de entrada y salida se mantienen en «Horas y regularización», junto con el formulario existente para registrarlas. La operación aún pendiente en Laravel es la captura de hora oficial para entrada/salida; **no falta un endpoint para persistir presencia o ausencia mediante ESTADO**. También queda por formalizar el catálogo de estados y las reglas institucionales de elegibilidad; Angular no declara elegible ni emite certificados por marcar presencia.

Sin sesiones se informa «Esta actividad todavía no tiene sesiones registradas. Registra una sesión para comenzar a controlar la asistencia» y se ofrece el formulario existente de sesión con actividad protegida cuando hay permiso. No se crean sesiones, participaciones ni asistencias al consultar.

## Sidebar restaurado: tres opciones y dos modos de acceso

Se restauraron en `src/app/components/sidebar/modulos-navegacion.ts` las entradas «Actividades», «Participantes» y «Sesiones y asistencia», en ese orden, con sus iconos `event`, `group` y `how_to_reg` y permisos anteriores. Cada ruta resalta exclusivamente su propia opción y expande Gestión de Actividades. No se cambiaron URLs, guards, servicios HTTP ni autenticación.

Los enlaces del Sidebar navegan sin queryParams contextuales: Participantes abre el listado general y permite elegir actividad; Sesiones y asistencia abre sus pestañas en modo general. Al regresar a la URL general desde una selección previa de Sesiones se reinicia su estado de navegación, incluso permaneciendo en el mismo componente. Los accesos desde una actividad conservan `id_actividad`, los filtros contextuales, la inscripción preseleccionada y el retorno a la actividad. No se revierten las mejoras de detalle, nombres, carga, ponentes, asistencia ni Solicitudes.

En Detalles se ofrecen Participantes, Sesiones, Asistencias y el modal contextual de Ponentes. Participantes abre el listado contextual con `id_actividad` e `inscribir=no`: consultar no abre automáticamente el formulario, y «Inscribir participante» permite utilizar el formulario existente con la actividad protegida. Sesiones y Asistencias reutilizan `ActividadesComponent` y sus dos pestañas. Ambos módulos ofrecen «Volver a actividad», enlazado a `/certificaciones/actividades?id_actividad=ID`. Esa URL carga el ID real en la pestaña Detalles y soporta recarga; el parámetro histórico `actividad` conserva su comportamiento anterior.

Detalles presenta el origen devuelto por Laravel y `id_solicitud_actividad` cuando existe; el enlace a consultar la solicitud respeta las capacidades de la sesión. Editar y Cerrar actividad invocan los formularios y la confirmación existentes del listado. Después de editar o cerrar se actualiza únicamente la información general. Las asociaciones de ponentes se actualizan en su modal, sin recargar el detalle.

## Orden del detalle y asistencia integrada

El detalle presenta cuatro secciones verticales: Información general, Sesiones programadas, Participantes inscritos y Control de asistencia. El retorno utiliza el glifo real `arrow_back` de la misma fuente Material Symbols local, con tooltip y aria-label «Volver a actividades». El listado permanece montado y conserva filtros y paginación.

Se retiró la tarjeta permanente de ponentes y su consulta inicial. «Ponentes» mantiene el modal contextual existente, sus catálogos autorizados, validaciones de duplicados y endpoints de asociación. El Sidebar continúa mostrando sus tres opciones.

Área y tipo tienen estados de carga separados: «Cargando área…» y «Cargando tipo…» se muestran hasta concluir sus consultas. «No disponible» queda reservado a datos ausentes o catálogos fallidos.

Las sesiones se filtran con `Number(id_actividad)` para respetar IDs serializados como número o texto. Una respuesta vacía válida presenta «No hay sesiones programadas para esta actividad». «Registrar sesión» reutiliza `FormularioEmisionComponent` dentro de `DialogoComponent`, protege la actividad seleccionada y guarda mediante `POST /api/activity-session`. Al confirmar, se actualiza solamente el listado de sesiones. Escape y Cancelar respetan el guardado en curso.

La asistencia se carga al seleccionar una sesión real de la actividad. Se monta el mismo `ListadoEmisionComponent` que utiliza la pestaña Asistencias, con `enDetalle=true`; no se creó otro CRUD ni otra matriz. Conserva `SesionesAsistenciaListado`, cruza todas las inscripciones con las marcas existentes y presenta Presente/Ausente según el estado explícito, con las horas conservadas en el detalle desplegable. Los filtros internos no cambian la ruta del detalle. «Abrir Asistencias» conserva tanto `id_actividad` como la sesión seleccionada.

La captura automática de hora oficial sigue pendiente en Laravel. Los controles de entrada/salida abren el formulario existente. Los círculos de presencia/ausencia sí guardan su ESTADO mediante el endpoint actual y se confirman por GET. Al guardar asistencia se renueva su matriz y el resumen; no se recargan información general ni participantes. No se modificaron endpoints, Laravel o PostgreSQL.

Archivos principales de este ajuste: `detalle-actividad.component.{ts,html,scss}`, `listado-emision.component.{ts,html}` (modo integrado y notificación de guardado), `listar-actividades.component.ts` (evita recargar al asociar ponentes), la fuente local Material Symbols y su catálogo de iconos. El manejo de Escape se limita al modal de sesión del detalle; el diálogo compartido conserva su comportamiento. Las pruebas de detalle y pestañas verifican la distribución, carga, aislamiento de relaciones y reutilización de formularios.

Operaciones reutilizadas (prefijo `/api`):

| Acción | Endpoints existentes |
| --- | --- |
| Listado y detalle de actividad | `GET /activity`, `GET /activity/{id}` |
| Editar / cerrar actividad | `PUT /activity/{id}`, `PATCH /activity/{id}` con `estado` |
| Consultar e inscribir participantes | `GET /participation`, `POST /participation`; editar con `PUT /participation/{id}` y estado con `PATCH /participation/{id}` |
| Consultar y programar sesiones | `GET /activity-session`, `POST /activity-session`; consultar y editar con `GET` / `PATCH /activity-session/{id}` |
| Consultar / registrar / regularizar asistencia | `GET /attendance/list`, `GET /attendance/{id}`, `POST /attendance/create`, `PATCH /attendance/update/{id}` |
| Asociados y catálogo de ponentes existentes | `GET /activity-speaker`, `GET /person-speakers/list`, `GET /persons/list`; la gestión también resuelve nombres mediante `/person-speakers/detail/{id}` y `/persons/detail/{id}` |
| Asociar / desvincular ponente | `POST /activity-speaker`, `DELETE /activity-speaker/{id_asignacion}` |

Los listados que no admiten un filtro contextual en su contrato conservan la consulta autorizada y filtran por el ID real antes de presentar filas. No se inventaron endpoints de consulta filtrada ni se crearon personas ponentes. El catálogo maestro de Recursos Humanos permanece intacto.

Archivos de esta reorganización:

- `src/app/components/sidebar/modulos-navegacion.ts` y sus pruebas; `pantallas-pendientes.spec.ts` actualiza el total esperado de enlaces.
- `src/app/pages/actividades/listar-actividades/listar-actividades.component.{ts,html}` y sus pruebas: retorno contextual, conexión de las acciones existentes y actualización del detalle.
- `src/app/pages/actividades/detalle-actividad/detalle-actividad.component.{ts,html}`: origen, solicitud vinculada, accesos y acciones.
- `src/app/pages/actividades/actividades-pestanas.spec.ts`: navegación contextual y modal de ponentes desde Detalles.
- `src/app/pages/participantes/listar-participantes/listar-participantes.component.{ts,html}` y sus pruebas: retorno a la actividad.
- `src/app/pages/emision-certificados/actividades/actividades.component.{ts,html}` y `sesiones-asistencia.component.spec.ts`: retorno contextual y navegación central activa.

No se borraron pruebas, componentes ni servicios. Para restaurar el menú se actualizaron la configuración y pruebas del Sidebar, el conteo esperado de enlaces, las pruebas de retorno al modo general de Participantes y Sesiones y el reinicio del estado de navegación de Sesiones. Los iconos de asistencia y retorno utilizan nombres incluidos en la fuente local (`how_to_reg` y `chevron_left`).

La actividad se identifica por `id_actividad`. Una participación (`id_participacion`) representa una inscripción existente en esa actividad. Una sesión (`id_actividad_sesion`) pertenece a una actividad. La matriz cruza todas las participaciones autorizadas de la actividad con las asistencias de la sesión; las filas sin marca no generan registros. Nunca se utiliza solamente `id_persona` como identificador de inscripción.

Los accesos del detalle conservan `id_actividad` mediante queryParams. «Controlar asistencia» añade `id_sesion` y `pestana=asistencias`. El ingreso general conserva sus selectores y guarda `actividad_filtro` y `sesion_filtro` en la URL para sobrevivir a una recarga. La actividad contextual se presenta por su nombre y no se vuelve a solicitar.

## Contrato comprobado en el backend local

Se inspeccionaron `routes/api.php`, `AttendanceController.php` y `AttendanceData.php`, sin modificarlos.

- `GET /api/activity/{id}` valida la actividad contextual.
- `GET /api/activity`, `/api/activity-session`, `/api/participation` consultan los registros autorizados; el filtro contextual se aplica sobre sus IDs reales.
- `GET /api/persons/list` resuelve nombres. Su error se informa con ruta y estado HTTP sin descartar inscripciones.
- `GET /api/participation-type` resuelve tipos de participación en el módulo existente.
- `GET /api/attendance/list` obtiene las marcas guardadas.
- `GET /api/attendance/{id}` consulta el registro antes de regularizar.
- `POST /api/attendance/create` registra una asistencia con `ID_PARTICIPACION`, `ID_ACTIVIDAD_SESION`, `HORA_ENTRADA`, `HORA_SALIDA`, `ESTADO`.
- `PATCH /api/attendance/update/{id}` actualiza únicamente los campos editados del registro existente.

Laravel admite horas de entrada y salida independientes y valida la coincidencia de actividad y la unicidad de participación/sesión. **No existe una operación que genere la hora en el servidor:** crear y actualizar reciben horas explícitas opcionales en formato `H:i`. Los círculos guardan únicamente el estado; los controles de horas abren el formulario existente. Las horas no se toman del reloj del navegador ni se inventan. Una marca guardada se corrige mediante «Regularizar» y no mediante desmarcado o eliminación silenciosa.

Para ofrecer marcación inmediata con hora oficial falta implementar en Laravel una operación que obtenga la hora del servidor, aplique su zona horaria, valide entrada/salida y devuelva la marca persistida. Angular no inventa esa operación.

Los estados históricos desconocidos se presentan sin clasificación; no se deduce presencia o ausencia de códigos como `nn`, de Activo/Inactivo o de las horas. El resumen de presencia separa explícitamente pendientes y registros por regularizar. El indicador adicional «con entrada y salida» describe únicamente ambas horas guardadas; no constituye un criterio de certificación ni un porcentaje de cumplimiento.

Se reutilizan el detalle, la gestión contextual de ponentes, el módulo de participantes, las pestañas y el formulario de emisión existentes. Se mantienen los permisos institucionales y la autorización definitiva de Laravel, cookies HttpOnly, cierre manual y consulta posterior. No se emiten certificados automáticamente. No se modificaron Laravel ni PostgreSQL y no se hizo commit ni push.

## Archivos completados en esta revisión

- `src/app/pages/emision-certificados/actividades/actividades.component.ts`: recuperación del contexto general desde la URL.
- `src/app/pages/emision-certificados/compartidos/listado-emision.component.{ts,html}`: persistencia de selectores y presentación contextual.
- `src/app/pages/emision-certificados/actividades/sesiones-asistencia-listado.ts`: errores del catálogo auxiliar y reinicio al reintentar.
- `src/app/pages/actividades/detalle-actividad/detalle-actividad.component.{ts,html}`: resumen por inscripción, pendientes y estado de carga de asistencia.
- `src/app/pages/emision-certificados/compartidos/formulario-emision.component.html`: presentación comprensible del estado histórico desconocido.
- Pruebas de matriz, pestañas de actividades y sesiones/asistencia: adaptación a checks y regularización.

## Validación final

- Suite completa tras integrar círculos de presencia/ausencia: **765/765 pruebas correctas en ChromeHeadless**. Registro: `integracion-actividad-tests.log`.
- TypeScript: `tsconfig.app.json` y `tsconfig.spec.json` con `--noEmit`, sin errores.
- Compilación de producción generada en `dist/gpc_front`, con advertencias de presupuesto del bundle inicial y estilos. Registro: `integracion-actividad-build.log`.
- `git diff --check`: sin errores.
- Las pruebas HTTP usan respuestas controladas. No se realizaron escrituras contra una sesión autenticada de producción; los contratos se verificaron con el código Laravel local.
