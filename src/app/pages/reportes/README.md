# Reportes

Las cuatro pantallas consumen consultas autenticadas de `gpc_back`. Requieren
`reportes.ver` y el permiso de lectura del módulo de origen. El servidor aplica
el alcance por áreas y vuelve a autorizar cada consulta y exportación.

| Pantalla | Endpoints | Comportamiento |
| --- | --- | --- |
| Indicadores | `GET /reportes/indicadores/{indicador}`, `GET /reportes/series/{indicador}?anio=2026` | Totales de registros autorizados y doce meses del año, incluidos meses sin registros. Las series usan inicio de actividad o emisión registrada; excluyen fechas nulas. |
| Actividades | `GET /reportes/actividades` | Nombre/código/área, estado y rango inclusivo de inicio; nombres de tipos y áreas, conteos de sesiones y participaciones. |
| Certificados | `GET /reportes/certificados` | Búsqueda global por beneficiario, actividad, tipo o código; filtros de estado, tipo, último documento y emisión. Una fila por certificado, con su documento más reciente. |
| Asistencia | `GET /reportes/asistencia`, `GET /reportes/sesiones?id_actividad=...` | Actividad, sesión, estado, participante y rango inclusivo de fecha de sesión; nombres, entrada y salida. El servidor rechaza sesiones ajenas a la actividad seleccionada. |

Los listados usan `page` y `per_page` (20 por defecto, máximo 100), devuelven
el total filtrado y resúmenes globales independientes de la página. La interfaz
no vuelve a filtrar ni calcular conteos sobre las filas descargadas.

La asistencia distingue registros, personas únicas y registros PRESENTE; no
deduce ausencias a partir de registros inexistentes. Los certificados conservan
los estados del sistema, incluidos PREPARADO, PENDIENTE_FIRMA, FIRMADO y EMITIDO.
El último documento no se presenta como prueba automática de firma o entrega.

Los tres listados exportan todos los resultados filtrados con `exportar=csv`.
El backend exige adicionalmente `reportes.exportar`, procesa las filas en lotes
y genera CSV UTF-8 con BOM, escape de comillas y neutralización de fórmulas.
No se cambian asignaciones de permisos existentes para habilitar exportaciones.

Las pruebas de Laravel están en `tests/Feature/ReportsTest.php` y
`tests/Feature/RegisteredIndicatorsTest.php`; usan SQLite en memoria, sin
migraciones ni escrituras sobre la base real. Los specs Angular verifican
autorización, filtros, paginación, resúmenes, exportación, errores y adaptación
a pantallas pequeñas mediante HTTP simulado.
