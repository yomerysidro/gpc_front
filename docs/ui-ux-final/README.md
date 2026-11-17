# Rediseño institucional final — GPC Front

Se continuó el diseño existente y se completaron Inicio, la identidad del menú, la numeración y las acciones de los listados. Los cambios están aplicados en los archivos Angular, sin cambiar rutas, endpoints, dependencias ni procesos administrativos o documentales. No se modificó el backend, PostgreSQL, PDF, QR o hashes. No se hizo commit ni push.

## Implementación

- Por indicación final del usuario se retiró la flecha de retroceso del sidebar y se unificaron los dos botones de menú del header en un único control. El mismo botón contrae/expande en escritorio y abre/cierra el cajón nativo en móvil, con tooltip y estado accesible.
- Header y sidebar comparten el azul institucional `#075A96`. Se conserva el escudo, la sesión, los roles, los permisos, los grupos expandibles y la navegación móvil.
- Paleta global: `--azul-institucional`, `--azul-oscuro`, `--dorado-accion`, `--color-primario`, `--neutro-50` y los tokens existentes de controles, radios, sombras y estados. Los alias de botones y color primario apuntan a los tokens institucionales. Se agregó `--neutro-600` para textos secundarios.
- Inicio contiene bienvenida institucional, nombre y rol de la sesión, indicadores reales, accesos rápidos autorizados y una explicación breve de las etapas documentales. Cuadrícula de tres, dos o una columna según el ancho.
- Los accesos reutilizan `resolverEntradaSidebar` y sus capacidades efectivas: actividades, generar y emitir, emitidos, bandejas de Gerencia y portal público. No se modificó el router.
- Se conserva el trabajo previo de formularios, filtros, alertas, diálogos, asistentes y portal. Se completaron alineación de columnas, estados semánticos y botones de iconos de 44 px con nombre accesible y tooltip nativo.
- Las acciones Ver, Ver detalle, Ver documento, Editar, Eliminar, Detalles y Configurar accesos usan los iconos Material existentes donde son inequívocas. Se conservan eventos, permisos, rutas, confirmaciones y acciones documentales explícitas. El texto de los botones convertidos queda disponible para tecnologías de asistencia.

La relación completa de archivos fuente y pruebas modificados se encuentra en [archivos-modificados.txt](archivos-modificados.txt). Incluye los cambios visuales previos que se conservaron.

## Numeración

Se agregó o completó `N.º` en:

- Gestión compartida: personas, documentos, trabajadores, practicantes, prácticas, supervisores, ponentes y demás catálogos que reutilizan `GestionTable`.
- Participantes, usuarios, roles y permisos del catálogo de módulos.
- Listado compartido de emisión: sesiones, reconocimientos y clasificaciones que reutilizan `ListadoEmision`.
- Firmantes municipales, certificados emitidos y documentos del detalle de certificado.
- Reportes de actividades y certificados.
- Beneficiarios de generar y emitir, preparación por origen, ponentes de sesión, reconocimientos por actividad, prácticas y certificados municipales individuales.
- Solicitudes, certificados preparados de Gerencia y pendientes de firma.

Se conservaron los correlativos correctos que ya existían en Actividades, asistencia y pendientes de certificación. Los IDs o números de solicitud se mantienen como datos separados cuando corresponden; no se usan como correlativo. La matriz de asignación de accesos conserva su estructura funcional.

Los listados paginados usan el índice visible y el tamaño real de página. Las tablas filtradas localmente enumeran el orden filtrado. Los beneficiarios con filtro de elegibilidad calculan el índice entre las filas visibles. No se cambió la paginación ni los datos originales.

**Límite del contrato de Gerencia:** el tipo actual de pendientes de firma solo garantiza `current_page` y `last_page`. La presentación utiliza `from` o `per_page` si Laravel los incluye. En la primera página puede numerar directamente; en páginas posteriores sin ambos metadatos muestra `—` para evitar inventar un correlativo. No se cambió el servicio ni se asumió un tamaño de página no garantizado.

## Dashboard y datos

Se reutiliza `AuthService` para la identidad y los permisos, y `ReportesService.totalRegistrados()` para consultas pequeñas agregadas. Cada indicador autorizado se consulta una sola vez al abrir Inicio, sin recorrer páginas ni descargar listas completas. El servicio no ofrece una caché compartida de estos conteos.

| Indicador | Endpoint existente | Permisos de lectura |
| --- | --- | --- |
| Certificados registrados | `/api/reportes/indicadores/certificados` | `reportes.ver` y `emision.ver` |
| Actividades registradas | `/api/reportes/indicadores/actividades` | `reportes.ver` y `actividades.ver` |
| Participaciones registradas | `/api/reportes/indicadores/participaciones` | `reportes.ver` y `participantes.ver` |
| Asistencias registradas | `/api/reportes/indicadores/asistencias` | `reportes.ver` y `participantes.ver` |

Un error muestra información no disponible, nunca cero artificial. Sin permisos no se envían esas consultas. Los conteos respetan las validaciones del servicio existente y el alcance del servidor.

No se presentan como equivalentes certificados registrados, preparados, pendientes de firma, confirmados o disponibles para entrega. Se omitieron indicadores de firma, confirmación, prácticas finalizadas y reconocimientos porque los agregados reutilizados no ofrecen esos conteos. Tampoco se inventó actividad reciente ni historial de auditoría: no se identificó un contrato agregado adecuado para esa sección sin consultas adicionales de listados.

## Validación y evidencias

- Compilación de desarrollo y compilación de producción realizadas con la configuración y presupuestos originales. El build conserva advertencias de tamaño; no se ampliaron límites. Registro: [build-final.log](build-final.log).
- Pruebas Angular: **1439 aprobadas** en la suite completa del rediseño. Las **51 pruebas** de layout y navegación posteriores al ajuste del único control de menú también aprobaron; se registran en [tests-menu-final.log](tests-menu-final.log). Registro de la suite completa en [tests-final.log](tests-final.log). Se añadieron tres pruebas de dashboard: valores del servicio, ausencia de consultas/accesos sin permiso y errores independientes sin ceros ficticios.
- Las pruebas existentes se adaptaron únicamente a las columnas y nombres accesibles nuevos. Dos fixtures asíncronos se estabilizaron: vigencia de la revisión creada por prueba y espera de recuperación de descarga binaria. No se alteraron procesos de producción para satisfacer pruebas.
- Las dos pruebas de ligaduras de iconos del sidebar aprobaron. `git diff --check -- src` sin errores.
- Chrome real sobre `http://127.0.0.1:4200`: login, recuperación, restablecimiento, acceso denegado y portal a 1920, 1440, 1366, 1024, 768 y 390 px. Sin desbordamiento horizontal en las páginas comprobadas. Interacciones reales: envío vacío de login, alternancia DNI/código y validación de consulta vacía en el portal.
- Se comprobó que las rutas privadas de Inicio, Actividades, Generar y emitir, Emitidos y Gerencia redirigen a login al no existir sesión. Los 401 de `/auth/me` corresponden a esa ausencia de sesión. Mediciones y errores: [final-browser.json](final-browser.json).

Las capturas reales están en [evidencias/](evidencias/). Se conservaron las imágenes previas y se agregaron las de la aplicación actual en el puerto 4200:

- [Portal escritorio](evidencias/final-portal-certificados-1440.png).
- [Portal móvil](evidencias/final-portal-certificados-390.png).
- [Login escritorio](evidencias/final-login-1440.png).
- [Validación de login](evidencias/final-login-validacion-390.png).
- [Validación del portal](evidencias/final-portal-validacion-390.png).

Se leyeron los skills `playwright` y `screenshot`. Playwright CLI no está instalado ni disponible en la caché local; el intento sin instalación produjo `ENOTCACHED`. Se respetó la prohibición de instalar dependencias y se reutilizó el script de Chrome DevTools Protocol del trabajo previo: [browser-check.cjs](browser-check.cjs). Se priorizó la captura específica del navegador según el skill screenshot.

## Validación privada pendiente

No hay una sesión administrativa autorizada en el navegador de prueba. Por ello no se certifican visualmente el dashboard con datos reales, header/sidebar privados, tablas pobladas y su paginación, ni modales de registro/confirmación, alertas de operaciones y asistentes con documentos. No se realizaron escrituras, firmas, eliminaciones o envíos reales. Las pruebas Angular no sustituyen esa validación con sesión.

No se fabricaron capturas de dashboard antes/después ni de pantallas privadas. La implementación y los controles automatizados están disponibles; esas evidencias requieren una sesión autenticada y registros autorizados.



## Ajuste posterior: iconos del dashboard y aviso de sesión

Se corrigieron los símbolos que no existían en la fuente local: las flechas usan `chevron_right`, el portal usa `search` y la nota documental usa `verified`. Las tarjetas y los accesos reservan 48 × 48 px para iconos de 28 px, evitando que el ancho de una letra o el padding recorten el glifo.

El login transmite una indicación visual transitoria mediante `NavigationExtras.info` solo después del resultado exitoso del servicio de sesión. El layout privado muestra «Inicio de sesión exitoso.» con los estilos existentes de alerta de éxito, anuncio accesible y cierre manual. No se escribe en localStorage ni en el historial y no se modifica la autenticación, el destino, los permisos ni los mensajes de error.

Validación: tres pruebas de ligaduras de la fuente local y siete pruebas Angular de dashboard, login y presentación/cierre del aviso aprobadas. Registros: [tests-iconos-sesion.log](tests-iconos-sesion.log) y [build-iconos-sesion.log](build-iconos-sesion.log). El acceso real con credenciales y su captura continúan requiriendo una sesión autorizada; las pruebas usan dobles explícitos del servicio y no fabrican evidencias de una sesión real.
