# Estados documentales de reconocimientos por sesión

La tabla de ponentes consulta el reconocimiento existente mediante el servicio de recuperación autorizado, que valida certificado, beneficiario, actividad, sesión, documento y hash. No usa la existencia del PDF ni la etiqueta de preparación como prueba de remisión.

| Respuesta documental | Preparación | Acción |
| --- | --- | --- |
| `PREPARADO` | Pendiente de envío a Gerencia | Continuar preparación |
| `PENDIENTE_FIRMA` | Enviado a Gerencia | Ver reconocimiento |
| `disponible_rrhh=true` o `estado_preparacion=PREPARADO_ENTREGA` | Listo para entrega | Ver certificado |
| Consulta documental fallida | Estado documental pendiente de consulta | Continuar preparación y reintento de consulta |

PREPARADO conserva siempre la acción pendiente de envío, incluso ante indicadores contradictorios. Fuera de ese estado, la disponibilidad administrativa no exige FIRMADO, EMITIDO ni un segundo indicador de confirmación PDF.

El asistente conserva los cuatro pasos. Recuperar un documento existente abre el paso 4, recupera sus textos de solo lectura y permite revisar el PDF persistido. Confirmar preparación usa `accion=confirmar_preparacion`; no remite. El clic explícito de envío revisa el documento guardado y remite usando `id_certificado_documento`. Solo la confirmación real de PENDIENTE_FIRMA muestra éxito; los errores conservan la preparación y permiten reintentar. Una remisión ya realizada se recupera sin repetirla.

Las pruebas usan HTTP simulado y dobles de servicios de Angular. No constituyen una prueba autenticada contra datos reales de Laravel o PostgreSQL. Registros de validación: `reconocimientos-estados-suite.log` y `reconocimientos-estados-build.log`.

## Continuidad de una preparación persistida

La evaluación de sesión que acredita un certificado existente activa automáticamente la recuperación autenticada mediante `POST /api/certificaciones/ponente_sesion/{id_actividad_ponente}/preparar`, con `accion=revisar_documento`, modalidad y sesión, sin enviar textos nuevos. El contrato de Laravel recupera el PDF guardado; Angular exige `recuperado=true`, `persistido=true` y `texto_editable=false`, valida el SHA-256 y consulta el detalle documental por el ID real devuelto. No usa verificación pública, generación de demostración, confirmación de preparación ni remisión para recuperar el documento.

No existe botón de recuperación manual en el asistente. La consulta se inicia en el paso 4; un error mantiene ese paso y el contexto, conserva el estado HTTP y muestra el endpoint fallido junto a Reintentar consulta. La tabla conserva también el error de consulta sin convertirlo en una respuesta vacía. Revisar información permite volver al paso 1 y continuar al 4 con el mismo documento y los textos originales de solo lectura.

Registros de esta corrección: `reconocimiento-continuidad-focused.log`, `reconocimiento-continuidad-suite.log` y `reconocimiento-continuidad-build.log`. El PDF de la aplicación procede de Laravel y no se generan datos o documentos de demostración en este recorrido.

Validación: 89 pruebas focalizadas y 1.327 pruebas de la suite Angular aprobadas. TypeScript de aplicación y pruebas sin errores. Build de producción completado, con advertencias de presupuesto de tamaño. No se ejecutaron envíos reales ni se modificaron Laravel, PostgreSQL, Portal Público o PDFs históricos.
