# Finalización y bandejas de certificación

La finalización utiliza `POST /api/activity-session/{id}/finalizar` con `{}` y el contexto de autenticación existente. El interceptor conserva la cookie HttpOnly (`withCredentials`). La capacidad efectiva `puede_finalizarse`, junto con `finalizada`, determina la disponibilidad. La actividad no se actualiza ni se cierra desde esta operación.

Después del POST confirmado se consulta nuevamente el detalle de sesión para recuperar capacidades y contadores. Si falla esa consulta, se conserva el estado que confirmó el POST y se ofrece actualizar capacidades. Los errores de validación y conflictos conservan los motivos de Laravel.

Las tarjetas leen `contadores` del listado o del detalle. Un valor nulo de `por_regularizar` se presenta como «No determinable». La ausencia de contadores no se sustituye con conteos de asistencias o participantes calculados por Angular.

Generar y emitir inicia en Pendientes de certificación. Preparaciones existentes se consulta al visitar su pestaña. Los certificados administrativos generales se identifican como tales y no se atribuyen a una sesión. Las prácticas y reconocimientos mantienen accesos a sus módulos y procedimientos independientes.

La consulta de beneficiarios usa el ID de sesión seleccionado y exige un tipo del catálogo real. Su detalle reemplaza la bandeja, conserva sus filtros y ofrece Volver a pendientes. El filtro de elegibilidad se aplica a la página recibida; la interfaz lo indica expresamente.

El contrato disponible no ofrece operaciones para preparar o recuperar certificados por sesión. Su acción permanece bloqueada, sin montar el asistente ni producir documentos ficticios. El código `ESQUEMA_PREPARACION_NO_DISPONIBLE` en un HTTP 409 muestra el mensaje de estructura de datos y conserva el detalle técnico. No se interpreta como denegación de permisos.

## Revisión de beneficiarios sin emisión

El botón anterior «Preparar certificado» tenía `disabled` fijo en la plantilla. Se sustituyó por dos acciones: «Revisar certificado», que reutiliza los datos autorizados y la plantilla institucional sin crear registros, y «Generar y emitir», que conserva el bloqueo real y explica su motivo. No se transforma una persona elegible en un certificado administrativo ficticio para abrir la revisión.

La implementación actual de `CertificationReadiness::beneficiaries` devuelve `identidad_sesion_disponible=false`, `preparacion_persistida=false`, `puede_generar_pdf=false`, `puede_emitir=false` y `estado_generacion='No determinable por esquema'` para sesiones. `puede_preparar` puede indicar una evaluación provisional disponible sin persistencia; por sí solo no habilita emisión. El campo de motivos disponible actualmente es `motivos_bloqueo`, complementado por `motivos_bloqueo_emision`; la UI también admite `motivos_bloqueo_preparacion` si se entrega, sin exigir una clave que el contrato actual no devuelve. La elegibilidad individual y `tipo_certificado_compatible` se muestran separadas del estado de generación.

Los estados de la fila exigen evidencia: «Preparación no disponible» ante bloqueo estructural, «Pendiente de generación» ante ausencia determinable (`No generado` sin IDs), «Preparado» con ID y persistencia confirmados y «Emitido» con estado explícito e identificadores de certificado/documento del mismo contexto. La ausencia de información se conserva como «Estado no informado». Los certificados administrativos de participación no se atribuyen a la sesión.

La revisión muestra «No emitida», el tipo del catálogo, nombre, actividad, sesión, fecha, lugar y elegibilidad disponibles. Recupera detalles mediante GET solo cuando faltan datos y hay permiso, verifica los IDs y reutiliza las respuestas al volver. No muestra código, QR, firmas ni fecha de emisión. Un error HTTP conserva su estado y motivo, sin abrir una previsualización de respaldo ni enviar POST.

En esta corrección no había un backend escuchando en los puertos locales consultados; se inspeccionó la implementación real del endpoint y se probó su estructura mediante respuestas HTTP controladas. La comprobación autenticada de los dos registros de la Sesión N.° 001 sigue siendo una validación en vivo pendiente. Los logs de compilación y pruebas están en `revision-beneficiarios-build.log` y `revision-beneficiarios-tests.log`.

Validación de la corrección: build de producción completado (con avisos de presupuesto de tamaño), **846 pruebas aprobadas** y `git diff --check` sin problemas.

## Asistente con redacción del mensaje

La acción principal actual es «Preparar certificado». Con el contexto autorizado del beneficiario abre primero Datos del certificado (solo lectura), después Redactar mensaje y, únicamente por acción del usuario, Previsualizar certificado. No repite selección de persona, actividad, sesión o tipo. La redacción sugerida se compone con datos reales disponibles; no inserta placeholders o fechas inexistentes ni obliga a repetir el nombre.

El texto se valida como mensaje no vacío y sin etiquetas HTML, se representa mediante interpolación de texto plano y se conserva exactamente al retroceder. Los borradores se mantienen únicamente en memoria, separados por persona, participación, actividad, sesión y tipo. Se reutilizan al volver al mismo beneficiario mientras el componente continúe abierto; no persisten tras recargar la página. Navegar, editar y previsualizar no crean registros ni realizan POST.

La variante formal de la plantilla reutilizada presenta escudo, institución, tipo, frase de otorgamiento, nombre, mensaje y fechas/lugar disponibles. Las líneas de firma quedan vacías cuando no se reciben firmantes confirmados. Los espacios de código y QR no contienen identificadores ni imágenes inventados. La advertencia de borrador y los bloqueos se sitúan fuera del diseño del documento; dentro no se imprime elegibilidad, asistencia ni estado técnico.

El contrato vigente de `CertificateDocumentController::generate` exige un cuerpo vacío `{}` y no admite un mensaje editable. Por ello, el editor y la previsualización avisan explícitamente que falta soporte de persistencia; «Confirmar y emitir» permanece deshabilitado. A ello se añaden los bloqueos reales de identidad por sesión, generación y emisión. No se envía el mensaje a otra ruta, no se descarta para generar un PDF con texto diferente y no se muestra un resultado de emisión ficticio. La confirmación y el resultado de este flujo no son alcanzables hasta que Laravel exponga un contrato compatible autorizado. El visor de documentos ya almacenados y la verificación pública existentes se conservan.

Logs de esta modificación: `asistente-mensaje-build.log` y `asistente-mensaje-tests.log`.

Resultado: TypeScript sin errores, build de producción completado con avisos de presupuesto de tamaño y **848 pruebas Angular aprobadas**. Se verifican el orden Datos → Mensaje → Previsualización, la conservación exacta del texto, la separación de borradores por beneficiario, el rechazo de HTML y texto vacío, la ausencia de solicitudes al navegar y el bloqueo explícito de confirmación.

## Integración posterior: vista previa PDF real con mensaje

El contrato actualizado de `docs/session-certification-api-contract.md`, `SessionCertificatePreparation::preview` y el controlador ahora admite mensaje personalizado en la vista previa. Esta sección reemplaza la limitación anterior para previsualizar; la persistencia y emisión por sesión continúan bloqueadas.

Se conecta `DocumentosDigitalesService.vistaPrevia` al POST existente `/api/activity-session/{id}/preparar-certificados`. El payload contiene únicamente `accion: 'vista_previa'`, `formato: 'pdf'`, `id_participacion`, `id_tipo_certificado` y `mensaje`, obtenidos del contexto y editor actuales. Se usan JWT HttpOnly, contexto autenticado y `withCredentials`. No se envía la acción de emisión ni se utiliza el generador global para confirmar la sesión.

Angular lee JSON `data.vista_previa_pdf.contenido_base64`: comprueba respuesta, identidad, mensaje exacto, `emitida=false`, `creado=false`, `mensaje_persistido=false` y PDF no persistido. La decodificación exige MIME PDF, Base64 canónico, contenido no vacío, máximo de 10 MiB decodificados, cabecera `%PDF-` y marcador final `%%EOF`. Se construyen bytes y `Blob application/pdf`; nunca se reconstruye el certificado con HTML. Son controles de compatibilidad del archivo, no una firma ni un parser completo de la estructura PDF. El PDF no se registra en consola.

El visor compartido acepta el archivo de vista previa separado de los IDs/URLs de documentos registrados. Crea su propia object URL, permite descargar la vista previa y la revoca al reemplazar o destruir la vista. No solicita un GET inexistente para recuperar un borrador. La UI identifica la vista previa como no emitida y no afirma que tenga QR, código o persistencia. Los documentos realmente registrados mantienen su circuito de recuperación autenticado/público previo.

El editor cuenta Unicode por puntos de código (no unidades UTF-16), con máximo de 1200, y reproduce las restricciones de texto plano y controles del backend, sin recortar o normalizar el mensaje. Un error 422 por desbordar una página se muestra sin truncar. Se conserva el borrador por beneficiario. Cambiar el mensaje cancela la solicitud pendiente, invalida el PDF y la aprobación anterior. La respuesta solo se acepta si coincide con el texto y contexto vigentes. La regeneración requiere una nueva acción explícita y evita doble solicitud mientras está en curso. No se muestra HTML de respaldo cuando falla el PDF.

Tras visualizar el PDF se puede avanzar a Confirmar emisión y marcar que se revisó la última vista previa. El botón final sigue bloqueado: el backend no conserva el cuerpo personalizado ni puede registrar inequívocamente un certificado independiente de sesión en el esquema actual. Se muestran los motivos reales de la respuesta sin simular éxito, código, QR o documento emitido.

Archivos de esta integración: `core/services/emision-certificados/documentos-digitales.service.ts`, nuevo `vista-previa-pdf.ts` y sus pruebas, `pages/emision-certificados/compartidos/visor-pdf.component.ts`, `generar-emitir/generar-emitir.component.{ts,html}` y `revision-beneficiarios.spec.ts` (rutas relativas a `src/app`), además de esta documentación. Logs: `vista-previa-real-build.log`, `vista-previa-real-tests.log`.

Resultado final: TypeScript de aplicación y pruebas sin errores, build de producción completado con avisos de presupuesto de tamaño, `git diff --check` correcto y **862 pruebas aprobadas**. Se cubren payload/contexto/mensaje exacto, Unicode y longitud, Base64 y PDF inválidos o ausentes, tamaño máximo, errores 401/403/409/422, invalidación y regeneración, cancelación de solicitudes y liberación de URLs. No se ejecutaron emisiones reales ni se modificaron Laravel o PostgreSQL. La integración autenticada con datos del entorno real sigue siendo una comprobación de despliegue; las pruebas HTTP controladas no se incorporaron a la aplicación.

No se ejecutaron migraciones, cambios de Laravel/PostgreSQL, commits ni push. La comprobación de la sesión 2 con credenciales reales y la revisión visual en navegador siguen siendo verificaciones de integración del entorno desplegado.
