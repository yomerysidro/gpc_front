# Recuperación ligera de reconocimientos por sesión

Contrato consultado: `../gpc_back/docs/certificate-origins-api-contract.md`.

La recuperación y las filas con preparación existente usan exclusivamente
`GET /api/certificaciones/ponente_sesion/{id_actividad_ponente}/preparar`
con `accion=consultar_preparacion`, `modalidad_reconocimiento=sesion` e
`id_sesion` real. Se interpreta el envoltorio `success/data` y se valida la
identidad del certificado, documento, persona, actividad y sesión. Las
consultas concurrentes de la misma identidad comparten una solicitud; al
terminar se libera para permitir refrescos tras operaciones.

La consulta no descarga Base64. El visor recibe `url_documento`, restringida
al archivo administrativo del ID recuperado, con autenticación y cookies.
Se conserva la comprobación SHA-256 del visor existente. Un fallo de consulta
no abre el paso 4 ni habilita preparar otro documento. Reintentar vuelve a
consultar por GET. La respuesta explícita `recuperado:false,persistido:false`
restaura la evaluación y el paso Información.

El paso 4 se muestra cuando existe un documento recuperado. Remitir exige
PREPARADO, facultad remitir y que el servidor no haya deshabilitado
`puede_enviar_gerencia`. Solo el clic inicia revisar-envio y enviar-gerencia,
usando el ID documental y el token contractual; se bloquean clics concurrentes.
PREPARADO no acredita remisión. El listado exige enviado o evidencia de
remisión persistida para mostrar Enviado a Gerencia.

Validación local: TypeScript de aplicación y pruebas aprobado; suite Angular
completa aprobada, 1.334 pruebas. Build generado con advertencias de presupuesto
de estilos. Resultados en `recuperacion-get-tests-final.log` y
`recuperacion-get-build-exit.log`.

Integración real pendiente: la API local responde HTTP 401 sin sesión
autenticada. No se verificaron con credenciales un reconocimiento real, sus
bytes PDF ni una remisión real. Las pruebas automatizadas usan HttpTestingController
y componentes simulados; no sustituyen esa comprobación.

No se modificaron Laravel, PostgreSQL, Portal Público ni archivos PDF históricos.
No se instalaron dependencias ni se realizó commit o push.
