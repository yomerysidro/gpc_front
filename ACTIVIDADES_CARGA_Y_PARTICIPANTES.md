# Actividades: carga estable y consulta de participantes

## Listado y detalle

La primera columna N.º es una posición visual: `(paginaActual() - 1) * porPagina() + indice + 1`. paginaActual está indexada desde 1 y se limita a las páginas reales del conjunto filtrado. Los IDs no cambiaron.

La aparición temporal de Área #ID y Tipo #ID procedía de los métodos nombreArea/nombreTipo y de opciones construidas por el componente mientras las tres consultas independientes seguían pendientes. Ahora el primer renderizado de filas espera el término de actividades, áreas y tipos, incluidos sus errores. Se priorizan los nombres relacionados devueltos por Laravel; si faltan, se utilizan los catálogos autorizados. Si tampoco resuelven el nombre, se muestra Nombre no disponible y se conserva el error y reintento de catálogo. No hay consultas por fila ni temporizadores.

Después de la primera carga se mantienen filas, catálogos y rango durante las actualizaciones; las suscripciones siguen ligadas a DestroyRef. Se evitan consultas simultáneas duplicadas y se retiró window:focus del listado. Editar y cerrar conservan su actualización real. Las pestañas ocultan el listado sin destruirlo, conservando filtros y paginación. El ojo conserva la consulta GET /api/activity/{id}. El tooltip Selecciona una actividad para ver sus detalles tiene role tooltip, aria-describedby y aparece con hover o foco. Cuando la pestaña está deshabilitada, su contenedor recibe foco para presentar la ayuda.

## Causa comprobada del mensaje de participantes

El código anterior unía mediante forkJoin participaciones, personas, documentos y tipos de documento. Cualquier error auxiliar se propagaba al bloque entero. El componente convertía todos los HTTP 403 en el mismo mensaje sobre participantes o catálogos, ocultando el origen del error. No se encontró un guard local por rol, área, propiedad o capacidad de creación en esta consulta.

No se dispone de una captura HTTP de la sesión real del usuario: no puede afirmarse qué endpoint produjo su 403 histórico. Se reprodujeron errores auxiliares con respuestas HTTP controladas y el código corregido muestra la ruta y el status del recurso que falla. No se fabricó una respuesta exitosa del endpoint principal.

## Contratos inspeccionados, sin cambios

- GET /api/participation obtiene participaciones autorizadas. ParticipationController.list usa el ámbito activity_module_areas de Laravel; no acepta un filtro id_actividad en esta operación. Angular filtra la respuesta por el ID real de la actividad seleccionada.
- GET /api/persons/list resuelve nombres autorizados, compartido con ponentes mediante el observable existente.
- GET /api/participation-type resuelve los tipos de participación.
- Ya no se consultan /api/person-documents/list ni /api/document-types/list para esta tabla: las cinco columnas solicitadas no incluyen DNI y no requieren documentos. No se modificó ningún formulario de escritura.
- Las peticiones conservan AUTHENTICATED_REQUEST. authInterceptor usa SessionAuthService.authorizeRequest para enviar withCredentials al destino API autorizado y mantener el tratamiento de 401. No se tocó JWT, cookies ni RBAC.

Los catálogos de personas y tipos capturan sus errores por separado. Su ausencia deja visibles las inscripciones confirmadas, con valores neutrales para los nombres no disponibles. Cada reintento vuelve a consultar únicamente el catálogo fallido y vuelve a resolver las filas conservadas; no repite actividad, participaciones ni los catálogos que funcionaron. Una consulta principal fallida no se transforma en listado vacío. Un 403 principal muestra expresamente `/participation` y HTTP 403; un error de red tiene su propio mensaje. En vacío real no se consultan catálogos innecesarios.

En caso de un 403 principal real, revisar en Laravel la capacidad efectiva `participantes.ver` y el ámbito de áreas permitido por AuthorizeModuleOperation para Participation. La misma configuración asigna ParticipationType al módulo participantes y Persona al módulo personas (alias verpersonas). No se otorgaron facultades basadas en la palabra Administrador. La confirmación de permisos de la sesión real debe hacerse con su respuesta /api/auth/me.

## Tabla y navegación

N.º | Participante | Tipo de participación | Fecha de inscripción | Estado. Los IDs originales se conservan para relacionar personas y tipos, sin mostrarlos como nombres. El estado procede de la inscripción. El enlace Abrir participantes aparece con participantes.ver y navega al módulo existente con queryParam id_actividad; no inscribe a nadie al abrir.

## Archivos

- `src/app/pages/actividades/listar-actividades/listar-actividades.component.{ts,html,scss}`.
- `src/app/pages/actividades/listar-actividades/actividades-pestanas.scss` (estilos del tooltip).
- `src/app/pages/actividades/detalle-actividad/detalle-actividad.{service.ts,component.ts,component.html}`.
- Pruebas de listar-actividades y detalle-actividad.
- `src/app/pages/emision-certificados/actividades/sesiones-asistencia.component.spec.ts`: actualizada una expectativa anterior a las pestañas integradas desde dev-isait.
- `src/app/pages/solicitudes/solicitudes.component.spec.ts`: retirado un carácter x suelto que impedía compilar las pruebas.

No se crearon componentes, servicios duplicados ni endpoints. Laravel y PostgreSQL solo se inspeccionaron, sin modificaciones. No se hizo commit ni push.

Validación final: 743/743 pruebas correctas en ChromeHeadless; TypeScript (`tsc -p tsconfig.spec.json --noEmit`) correcto; compilación de producción correcta con advertencias de presupuesto de estilos; git diff --check sin errores.
