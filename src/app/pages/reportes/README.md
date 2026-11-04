# Reportes: implementación y contrato pendiente

Revisión del código actual de `gpc_back`, 2026-11-03. Se agregaron consultas GET
de reportes en Laravel. No se modifican datos reales, dependencias, environment,
config/database.php ni autenticación.

## Funciones disponibles

- Las cuatro páginas tienen TS, HTML y SCSS separados, rutas lazy dentro del
  layout privado, `permissionGuard` con `reportes.ver` y las cuatro entradas
  originales del sidebar. Actividades ya no lleva etiqueta de desarrollo;
  las otras opciones conservan su estado existente.
- Indicadores: conteos de registros mediante los GET de indicadores, por módulo
  autorizado. Las tarjetas cuentan actividades, certificados, participaciones
  y asistencias, sin inferir firmas, entregas, personas únicas ni ausencias.
  Un conteo válido vacío muestra 0; una consulta fallida muestra error.
- Certificados: 20 registros por solicitud; estado booleano y tipo en el servidor.
  Fechas de emisión inclusivas y búsqueda son **solo de la página actual**,
  explícito en filtros, tabla, resumen y CSV. Registros sin fecha no coinciden
  con un rango de emisión. Se conserva el total del servidor separado del
  resultado local. Tipos: catálogo paginado, 20 por solicitud, navegación manual.
- Actividades: listado general paginado mediante `GET /reportes/actividades`.
  Código opcional dentro de la búsqueda por nombre o ID. `desde` y `hasta`
  filtran inclusivamente la fecha de inicio; `estado` exige coincidencia exacta.
  Todos los filtros, COUNT total y paginación se ejecutan en Laravel. Se devuelve
  el nombre del tipo con una subconsulta escalar, sin joins a sesiones o
  participaciones, sin duplicar actividades ni hacer consultas por fila.
  CSV únicamente de la página actual, con filtros y alcance explícitos.
- Asistencia: formulario y explicación de disponibilidad. No envía solicitudes
  a listados ilimitados, no presenta un vacío como una consulta exitosa, ni calcula
  ausencias o porcentajes sin una regla fiable de participantes esperados.
- Exportaciones disponibles solo con `reportes.exportar`: UTF-8 con BOM, comillas
  escapadas, neutralización de fórmulas incluso después de espacios o controles.
- Botones Consultar, Limpiar filtros y Actualizar, estados de carga/error/vacío,
  validación de fechas y cancelación de suscripciones al destruir componentes.

`ReportesService` reutiliza las lecturas de `EmisionCertificadosService`,
incluidos `environment.apiBaseUrl`, `AUTHENTICATED_REQUEST` y el interceptor
de cookies. No usa `listarTodos`, no hace consultas por fila ni altera permisos.
Además de `reportes.ver`, el usuario necesita `emision.ver` para esos datos y
`actividades.ver` para consultar una actividad. Laravel vuelve a autorizar cada
solicitud. Reportes no concede lectura de otros módulos. Un 401 lo gestiona
el interceptor existente; 403 y 500 tienen mensajes diferenciados.

## Evidencia del contrato actual

| Consulta real | Implementación Laravel | Restricción |
| --- | --- | --- |
| `GET /reportes/actividades` | `Http/Controllers/Report/ActivityReportController.php`, `Http/Data/Report/ActivityReportData.php` | `desde`, `hasta`, `estado`, `q`, `page`, `per_page`. Respuesta paginada en `data`, total filtrado, filtros aplicados y criterio `fecha_inicio`. Por defecto 20 filas; máximo 100. |
| `GET /activity`, `GET /activity/{id}` | `Http/Controllers/Activity/ActivityController.php`, `Http/Data/Activity/ActivityData.php` | Se conservan sin cambios para los otros módulos. |
| `GET /activity-session` | `Http/Data/ActivitySession/ActivitySessionData.php` | Listado global sin paginación ni filtro de actividad. |
| `GET /participation` | `Http/Data/Participation/ParticipationData.php` | Listado global; no es un conteo de personas únicas ni un padrón histórico por sesión. |
| `GET /attendance/list` | `Http/Controllers/Attendance/AttendanceController.php`, `Http/Data/Attendance/AttendanceData.php` | Listado global sin filtros/paginación. Incluye IDs de participación, sesión y persona, horas y estado; no incluye nombres ni regla de ausencias. |
| `GET /certificados/list` | `Data/Certificate/CertificateData.php` | `data: {data, total, current_page, last_page, per_page}`. Máximo 100. Filtros exactos de RULES; sin rango, búsqueda ni joins para nombres. |
| `GET /certificados-documentos/list` | `Data/CertificateDocument/CertificateDocumentData.php` | Paginado; estados GENERADO/ANULADO. Una reemisión es otro documento, no otro certificado único. |
| `GET /tipos-certificado/list` | `Data/CertificateType/CertificateTypeData.php` | Paginado; `id_tipo_certificado`, `nombre_tipo`, `estado`. |

Las relaciones de los Models de Certificate, CertificateDocument, Activity,
Attendance y Participation existen, pero las consultas Data no las expanden.
No se descargan personas/participaciones/actividades completas para resolver
nombres. La tabla comunica los nombres ausentes; no sustituye nombres por IDs.
`Certificate.estado` es booleano y `CertificateDocument.estado` es una cadena;
no hay equivalencia demostrada entre activo, emitido, pendiente y anulado.

## Cambios requeridos en Laravel (propuesta; no implementados aquí)

Todos los endpoints propuestos deben exigir cookie de sesión, `reportes.ver`,
permisos de origen y alcance de filas del usuario. Exportar requiere también
`reportes.exportar`. No basta con comprobar el nombre del rol.

1. **Indicadores**: endpoint agregado que devuelva conteos y criterios de
   actividades, certificados emitidos únicos, personas únicas, participaciones
   y marcas de asistencia. Definir qué documento vigente acredita emisión,
   cómo tratar anulaciones, reemisiones, estados y fechas nulas. Series mensuales
   de actividades por `fecha_inicio` y certificados por fecha de emisión
   confirmada. Meses sin registros y zona horaria deben quedar definidos.
2. **Actividades**: el listado general solicitado ya está implementado, con
   filtros, nombres de tipos y total filtrado. Conteos de participantes/asistentes,
   filtro por tipo o área serían ampliaciones adicionales; no se inventan esas
   cifras ni se descargan relaciones completas para calcularlas.
3. **Certificados**: listado paginado con rango de emisión y búsqueda del lado
   servidor; traer beneficiario, tipo, actividad vía participación, número o
   código del documento vigente, emisión confirmada y estado documental. Resolver
   múltiples versiones de documento antes de contar. No inferir que una práctica
   o un reconocimiento siempre tienen actividad. Agregar resumen global filtrado.
4. **Asistencia**: selector de actividades paginado con búsqueda por nombre;
   sesiones filtradas por actividad; consulta paginada por actividad, sesión y
   rango de **fecha de sesión**, con nombres y estados originales. Rechazar una
   sesión de otra actividad. Separar marcas registradas, personas únicas y
   participaciones. Para ausencias, aportar padrón fiable de esperados por sesión,
   vigencia histórica y regla de estados. Porcentaje = esperados con asistencia
   válida / esperados × 100; denominador cero = no aplicable.
5. **CSV global**: endpoint de exportación con idénticos filtros y autorización,
   ejecución acotada o streaming y neutralización de fórmulas. Hasta entonces el
   frontend exporta solo la página filtrada indicada.

No se han programado URLs ficticias para estos contratos propuestos. Los filtros
que el backend ignora nunca se anuncian como globales.

## Prueba manual sin modificar datos

1. Iniciar Laravel y Angular con la configuración existente. Entrar con una cuenta
   autorizada y abrir REPORTES. Sin `reportes.ver`, no aparecen enlaces y una URL
   directa se deniega. Comprobar también una cuenta con Reportes pero sin Emisión.
2. `/reportes/indicadores`: contrastar totales con los paginadores de las lecturas
   autorizadas. Los no disponibles muestran guion/explicación, nunca cero ficticio.
3. `/reportes/certificados`: consultar, paginar, filtrar estado/tipo y usar un rango.
   Ver que rango y búsqueda solo afectan 20 registros recibidos. Probar rango
   invertido, resultados vacíos, Actualizar y Limpiar. Navegar el catálogo de tipos.
4. `/reportes/actividades`: abrir sin código y comprobar el listado general.
   Consultar con rango, estado o nombre/código; paginar y confirmar que se
   mantienen los filtros. Limpiar devuelve la primera página sin filtros.
   Actualizar repite la página aplicada. CSV exporta solo las filas visibles.
5. `/reportes/asistencia`: comprobar el aviso de dependencia, selectores desactivados
   y que Consultar no descarga listados de asistencias.
6. Con `reportes.exportar`, abrir el CSV y comprobar tildes y alcance de exportación.
   Sin el permiso, no aparece el botón de descarga. En desarrollo, simular 401,
   403 y 500 con mocks de pruebas; no alterar registros o permisos reales.

Pruebas automatizadas en `reportes.utils.spec.ts`, `reportes.component.spec.ts` y
`core/services/reportes/reportes.service.spec.ts`; usan HttpTestingController,
no credenciales ni escrituras reales.

`tests/Feature/ActivityReportTest.php` en Laravel ejecuta SQL real únicamente en
SQLite `:memory:` (con esquema `certificado` adjunto también en memoria). Comprueba
conexión y base antes de crear las tablas temporales. No ejecuta migraciones,
seeders ni limpieza de tablas; las escrituras de fixtures son exclusivamente
temporales. Fuerza `APP_ENV=testing`, `DB_CONNECTION=sqlite`, `DB_DATABASE=:memory:`,
`DB_URL` vacío y una ruta inexistente de `APP_CONFIG_CACHE` al ejecutar PHPUnit.
El PHP local necesita cargar `php_pdo_sqlite.dll` con `-d extension=...` solo para
el proceso de prueba; no requiere editar php.ini. Las pruebas Angular simulan HTTP.

Ejecución aislada (el spec local previo del sidebar importa una exportación
eliminada y bloquea el tsconfig general):

```sh
npm.cmd test -- --watch=false --browsers=ChromeHeadless --ts-config=tsconfig.reportes.spec.json --include=src/app/pages/reportes/**/*.spec.ts --include=src/app/core/services/reportes/**/*.spec.ts
```
