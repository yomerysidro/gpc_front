# Reconocimientos municipales individuales — integración Angular actualizada

## Estado de entrega

Frontend actualizado conforme a `../gpc_back/docs/certificate-origins-api-contract.md`, especialmente el apartado final «Mensaje individual sin motivo obligatorio y consulta del documento original». No se modificaron Laravel, PostgreSQL, dependencias, Capacitación, Prácticas ni Gerencia. No se hizo commit ni push. El checkout contenía modificaciones previas que se conservaron.

La integración real autenticada sigue pendiente. Las comprobaciones locales de `GET /api/auth/me` y `GET /api/reconocimientos/1/evaluacion-certificacion` respondieron **401** desde una ejecución sin cookie de sesión. La autenticación existente usa una cookie HTTP-only; no hay una sesión de navegador autenticada accesible desde las herramientas de esta ejecución. Esto no acredita un fallo documental ni de permisos del endpoint. No se generó, confirmó ni remitió un certificado real en esta sesión.

## Archivos Angular modificados en esta actualización

- `src/app/core/interfaces/emision-certificados/origenes-certificado.interface.ts`: mensaje, capacidad de edición y metadata administrativa del documento original.
- `src/app/core/services/emision-certificados/documentos-digitales.service.ts`: consulta ligera individual, mensaje sin motivo, confirmación del mensaje aprobado y facultades de visualización.
- `src/app/pages/emision-certificados/emision-certificados.routes.ts`: ruta administrativa limpia del documento original.
- `src/app/pages/emision-certificados/generar-emitir/municipales-individuales.component.ts` y `.spec.ts`: acciones calculadas dinámicamente desde Laravel; detalle técnico fuera del botón principal.
- `src/app/pages/emision-certificados/generar-emitir/preparar-municipal.component.ts`: entrada directa al asistente o al visor original según la modalidad persistida; recuperación ligera.
- `src/app/pages/emision-certificados/generar-emitir/preparacion-origen.component.ts`, `.html` y `.spec.ts`: cuatro pasos, mensaje editable, revisión invalidada al editar, recuperación visual desde Datos, confirmación única y envío explícito.
- `src/app/pages/emision-certificados/compartidos/visor-pdf.component.ts` y `.spec.ts`: entrada opcional `permitirDescarga`, con valor predeterminado true para conservar los consumidores existentes; el flujo municipal aplica las facultades de Laravel.
- `src/app/pages/emision-certificados/generar-emitir/municipales-contrato.spec.ts`: nuevos escenarios HTTP del contrato actualizado.

Se conservan los archivos de la primera intervención: `municipal-contexto.service.ts`, el montaje de la tabla en `generar-emitir.component.ts/.html` y sus pruebas de entrada y bandeja. La metadata se mantiene en memoria y se consume una sola vez; no se persisten tokens ni datos personales en almacenamiento o URL.

## Infraestructura reutilizada

`PreparacionOrigenComponent`, `VisorPdfComponent`/PDF.js, `reconocimiento-asistente.scss`, estilos institucionales, `EmisionCertificadosService`, `DocumentosDigitalesService`, `CambiosCertificadosService`, `validarMensajeCertificado` y el mapeo administrativo compartido `estadoDocumentalPractica`.

No hay un segundo asistente ni otro servicio documental. La página municipal representa alternativamente el asistente compartido o el visor compartido. Los consumidores de Capacitación, Prácticas, Ponentes y Gerencia mantienen su comportamiento predeterminado.

## Identidad y clasificación

La persona procede de `id_persona` y `reconocimiento.nombres`/apellidos. El ID de la evaluación es `id_origen = id_reconocimiento`; no se usa como persona, certificado ni asignación.

`documento_existente.origen`, `modalidad_reconocimiento`, los IDs documentales, `beneficiario`, estados, `url_documento` y facultades deciden la acción. El origen superior `reconocimiento` identifica la evaluación y no convierte un documento `ponente_actividad` o `ponente_sesion` en individual.

- Individual elegible sin documento: **Preparar certificado**.
- Individual PREPARADO y consultable: **Continuar preparación**.
- Documento original autorizado de otra modalidad: **Ver certificado**, aun en PREPARADO o PENDIENTE_FIRMA.
- Individual enviado o confirmado con visualización autorizada: **Ver certificado**, con el estado SQL real indicado por separado.
- Anulado: acción bloqueada.
- Sin facultad/URL: **Sin acceso al PDF**, sin enlace habilitado.
- Sin elegibilidad, metadata ambigua o error: estado breve; motivos en Detalles.

Los IDs 1, 28, 2, 24 y 27 aparecen únicamente en escenarios de prueba, nunca como reglas de producción. PREPARADO del reconocimiento sin documento no se interpreta como una preparación documental. Existir un PDF no acredita confirmación administrativa ni disponibilidad para entrega.

## Endpoints utilizados

Relativos a `environment.apiBaseUrl`, `/api` en desarrollo:

| Método | Ruta | Uso |
| --- | --- | --- |
| GET | `/reconocimientos/list` | Listado con la paginación del servicio existente |
| GET | `/reconocimientos/{id}/evaluacion-certificacion` | Beneficiario, mensaje predeterminado, capacidad editable y metadata documental original |
| GET | `/certificaciones/reconocimiento/{id}/preparar?accion=consultar_preparacion` | Recuperar la preparación individual, mensaje aprobado, hash, URL y estado sin generar PDF |
| POST | `/certificaciones/reconocimiento/{id}/preparar` | Revisar y confirmar el PDF |
| GET | `/certificados-documentos/detail/{id}?flujo=firmas` | Confirmar identidad, origen, estado y facultades del documento original o recién guardado |
| GET | `/certificados-documentos/{id}/archivo?flujo=firmas` | Leer el PDF privado original mediante la URL autorizada devuelta por Laravel |
| POST | `/certificados-documentos/{id}/revisar-envio` | Obtener revisión de remisión para los bytes persistidos |
| POST | `/certificados-documentos/{id}/enviar-gerencia` | Remitir explícitamente |

No se consulta la lista completa al entrar al asistente, cambiar de paso o abrir un certificado original. Las evaluaciones de la tabla usan concurrencia máxima de cuatro. La tabla no descarga PDFs, no genera revisiones y no pide el detalle completo de firmas. Una recarga directa consulta únicamente el reconocimiento solicitado.

## Payloads exactos

Revisión individual, tanto para el predeterminado conservado como para el personalizado seleccionado:

```json
{"accion":"revisar_documento","mensaje":"<contenido seleccionado>"}
```

Confirmación:

```json
{"accion":"confirmar_preparacion","token_revision":"<token devuelto por Laravel>","confirmar":true,"mensaje":"<mismo contenido aprobado>"}
```

No se envían motivo, persona, tipo, actividad, QR ni código en la preparación individual. El motivo histórico no se altera.

Revisión de envío: `{}`. Remisión:

```json
{"token_revision":"<token de revisión de envío>","confirmar":true}
```

Las credenciales viajan por los mecanismos de autenticación existentes. Los tokens y hashes nunca van en la ruta Angular.

## Cuatro pasos y recuperación

1. **Datos del certificado:** contexto real del listado, beneficiario, tipo, origen, motivo y elegibilidad; sin mensaje completo ni nueva consulta general.
2. **Mensaje:** `mensaje_predeterminado` de Laravel, textarea editable según `texto_editable`, contador Unicode y límite de 1.200 caracteres. No se generan PDFs ni se consulta mientras se escribe. Se conserva el borrador al retroceder; las respuestas tardías de revisión no lo reemplazan.
3. **Previsualización y confirmación:** PDF devuelto por Laravel, validación de SHA-256 y visualización explícita antes de guardar. Cambiar el texto invalida token y PDF; confirmar espera la respuesta HTTP y no permite otro clic simultáneo ni posterior para el mismo documento.
4. **Enviar a Gerencia:** mensaje y botón único. El clic solicita la revisión y remite; confirmar preparación por sí solo no envía. El estado cambia sólo tras la respuesta de Laravel.

Un individual PREPARADO se recupera mediante GET ligero y abre visualmente desde el paso 1; usa el mensaje aprobado y el mismo ID, URL y hash. Sus controles quedan bloqueados y el paso 3 utiliza el PDF persistido, sin revisar ni confirmar otra vez. Un resultado de confirmación incierto exige recuperar el estado antes de habilitar otro intento; no hace un segundo POST automático. Un documento enviado no permite otra remisión.

Para otras modalidades se abre directamente el visor. Antes de mostrar el PDF se contrasta el detalle original con el certificado, documento, persona, origen, actividad y sesión seleccionados. La URL procede de Laravel y el servicio existente valida la ruta administrativa del documento y su hash. No se llama a revisar_documento ni confirmar_preparacion. Descarga, impresión y apertura externa se ofrecen sólo cuando las facultades correspondientes permiten descargar. La flecha regresa al listado municipal, manteniendo el layout administrativo.

## Pruebas y build

- TypeScript de aplicación: aprobado, sin errores.
- TypeScript de pruebas: aprobado, sin errores.
- Angular focalizado: **112 aprobadas, 0 fallidas**, `municipales-actualizado-focused.log`.
- Suite completa Angular: **1.427 aprobadas, 0 fallidas**, `municipales-actualizado-suite.log`, incluyendo Capacitación, Prácticas y Ponentes por sesión.
- Build de producción: completado, `municipales-actualizado-build.log`, salida `dist/gpc_front`. Advertencias de presupuesto del bundle inicial y estilos; sin errores de compilación.
- `git diff --check`: sin errores.

Los escenarios HTTP incluyen 1/28 elegibles, documentos 10/22/26 de 2/24/27, mensaje predeterminado y personalizado sin motivo, límite Unicode, bytes PDF y hash, confirmación única, recuperación sin duplicados desde el paso 1, envío explícito, visualización original, PREPARADO/PENDIENTE_FIRMA/confirmado/anulado, facultades denegadas y errores 401/403/404/409/422/500/502. El 401 no provoca llamadas de logout ni revocación de sesiones remotas desde este flujo; se conserva el manejo de autenticación existente.

Las pruebas simuladas no equivalen a un recorrido autenticado real. No se declara el módulo completamente terminado hasta verificar ese recorrido con una sesión y permisos efectivos de Laravel.

## Corrección específica del paso 2 — Mensaje

Se separó la consulta ligera del estado de operación documental. Si el contexto ya contiene mensaje y capacidad de edición, se reutilizan; si falta alguno, se solicita una sola vez `GET /api/certificaciones/reconocimiento/{id}/preparar?accion=consultar_preparacion`. La lectura no genera PDF, no activa «Procesando documento» y no bloquea entrar a Mensaje o regresar a Datos.

El textarea usa las facultades vigentes de la evaluación y conserva las restricciones explícitas del backend. La ausencia del campo opcional `texto_editable` en un contexto que ya acredita preparación no se interpreta como una denegación: se consulta el contrato ligero. `texto_editable:false`, falta de elegibilidad/permisos o un documento persistido mantienen la edición bloqueada. La recuperación sólo bloquea el control como documento guardado cuando existe un ID documental válido y `persistido` no es false; una vista previa temporal nunca se interpreta como PREPARADO.

El predeterminado tardío sólo se aplica a un control sin modificaciones. La interacción real mediante eventos input marca el control como editado y protege su contenido al llegar HTTP. El paso 2 muestra únicamente los botones Anterior y Siguiente. No contiene revisión, reintento ni avisos de edición no disponible.

Siguiente cambia inmediatamente al paso 3 antes de ejecutar revisar_documento. Si token, PDF, mensaje y caducidad siguen vigentes, reutiliza esa revisión. Cambiar el texto invalida token y PDF. Anterior durante una revisión pendiente cancela la espera y devuelve el editor operativo. Confirmación y remisión permanecen exclusivamente en los pasos 3 y 4.

Archivos de esta corrección: `preparacion-origen.component.ts`, `.html` y `.spec.ts`; `municipales-contrato.spec.ts`; y la propiedad opcional `persistido` de `DocumentoFirmas` en el servicio existente. Sin cambios funcionales en otros módulos ni en Laravel/PostgreSQL.

Validación de esta corrección:

- TypeScript de aplicación y pruebas: sin errores.
- Pruebas focalizadas: **110 aprobadas, 0 fallidas**, `municipales-paso2-focused.log`.
- Interacción comprobada mediante clics y eventos input: edición real, payload del texto personalizado, navegación inmediata, predeterminado ligero, respuesta HTTP tardía, permisos explícitos, persistido false, recuperación, reutilización del token/PDF, cancelación y ausencia de solicitudes duplicadas.
- Build de producción: completado, `municipales-paso2-build.log`; advertencias de presupuesto, sin errores de compilación.
- git diff --check: sin errores.

Se trata de validación Angular con HTTP simulado; no de una confirmación real autenticada en Laravel. Los resultados de suite completa anteriores corresponden a la integración previa, no a una nueva ejecución completa de esta corrección puntual.

## Auditoría del servidor real localhost:4200 — 17/11/2026

Se encontró una divergencia concreta entre el checkout y la aplicación servida. El servidor Angular del puerto 4200, PID 12820, seguía entregando el chunk `chunk-JIN3MVCK.js` con el aviso «el contrato actual no admite su edición» y la versión antigua del editor. El recorrido HTTP de los chunks no contenía `mensajeMunicipalEditable` ni `iniciarMunicipal`. El HTML y los módulos Vite confirmaban que el servidor apuntaba a este mismo checkout; el problema no se dedujo de una prueba simulada.

Se detuvo únicamente ese proceso identificado de `ng serve` y se inició la CLI local de este proyecto en modo development, con proxy existente, host localhost y puerto 4200. No se eliminó caché ni se tocaron otros servicios. El servidor queda activo. Tras reiniciar y corregir los permisos, el recorrido de 70 chunks identificó el editor actual, la consulta ligera y el mapeo administrativo, sin el aviso antiguo. El cliente Vite notificó recarga. Los archivos originales de Laravel no se modificaron.

La tabla y el visor ahora comparten una comprobación de acceso sobre el objeto documental correspondiente. En la evaluación se usa `documento_existente.facultades.ver/descargar`; en el detalle, `facultades.ver/descargar` de la raíz. La condición anterior exigía simultáneamente `puede_visualizar`, `facultades.visualizar` y `facultades.ver` estrictamente true; los indicadores complementarios dejaron de ser campos obligatorios para aceptar el permiso principal. Si Laravel devuelve una denegación explícita de visualización, se conserva. Para descargar se exige `facultades.descargar:true` en ambas respuestas. El origen sigue tomándose de `documento_existente.origen`, sin reinterpretar el origen superior de la evaluación.

La corrección del editor existente permanece: el nivel data de la evaluación proporciona `texto_editable` y `mensaje_predeterminado`; las respuestas persistidas proporcionan `mensaje_aprobado`. El escenario 28 con `texto_editable:true` y `DESTACADO. E` se comprueba desde el listado HTTP simulado, consumiendo el contexto en la página real del componente y escribiendo, borrando y reemplazando mediante eventos input de Angular. Los cuatro rótulos se mantienen como Información, Mensaje, Previsualización y Enviar a Gerencia.

### Comprobación visual real y autenticación

Se inició Chrome con perfil temporal independiente, sin leer cookies del navegador habitual y sin simular la autenticación o respuestas de Laravel. Se navegaron las rutas reales del listado, del reconocimiento 28 y del documento original del 24. Las tres redirigieron al login; `/api/auth/me` a través del proxy real respondió 401. Se capturó e inspeccionó la pantalla real de inicio de sesión. Este resultado acredita que la aplicación y el proxy responden, pero no acredita una sesión autorizada ni una comprobación visual del editor o PDF protegidos.

Evidencia reproducible:

- `docs/qa/municipales-local-verificacion.json`: rutas solicitadas, redirecciones, respuestas HTTP y verificación del bundle servido.
- `docs/qa/municipales-real-listado.png`, `municipales-real-mensaje-28.png` y `municipales-real-documento-24.png`: capturas reales de las redirecciones al login, no de pantallas autenticadas.
- `docs/qa/verificar-municipales-local.cjs`: auditoría de sólo lectura mediante CDP y HTTP local; no obtiene cookies, genera certificados ni modifica documentos. Utiliza el módulo ws ya instalado.
- `municipales-servidor-actual.log`: proceso local y recompilaciones del servidor reiniciado.

No se obtuvo una sesión de prueba autorizada durante esta comprobación. La revisión visual del textarea y PDF originales sigue pendiente de esa sesión. No se declara integración HTTP autenticada desde Angular ni se reutilizan los resultados de la auditoría backend como si fueran una verificación de este navegador.

### Archivos y resultados finales de esta auditoría

Angular corregido en esta intervención:

- `src/app/core/interfaces/emision-certificados/origenes-certificado.interface.ts`: campos complementarios opcionales y funciones de acceso basadas en facultades del objeto documental.
- `src/app/core/services/emision-certificados/documentos-digitales.service.ts`: tipo de modalidad del detalle incluye individual, actividad y sesion conforme al JSON real.
- `src/app/pages/emision-certificados/generar-emitir/municipales-individuales.component.ts`: acción calculada con documento_existente y sus facultades.
- `src/app/pages/emision-certificados/generar-emitir/preparar-municipal.component.ts`: autorización y descarga con facultades en la raíz del detalle, manteniendo identidad y origen originales.
- `src/app/pages/emision-certificados/generar-emitir/preparacion-origen.component.ts/.html`: rótulos de cuatro pasos solicitados y descarga municipal autorizada; conserva el editor y navegación ya corregidos.
- `src/app/pages/emision-certificados/generar-emitir/municipales-contrato.spec.ts`: escenario exacto de texto del 28, edición real mediante input y respuestas con facultades anidadas frente a facultades de raíz para los tres documentos originales.

Campos utilizados: `data.texto_editable`, `data.mensaje_predeterminado`, `data.mensaje_aprobado` en su respuesta de recuperación; `data.documento_existente.origen`, `.id_certificado`, `.id_certificado_documento`, `.beneficiario`, `.estado_certificado`, `.estado_documento`, `.url_documento` y `.facultades.ver/descargar`; para el detalle `data.facultades.ver/descargar`, junto a sus identificadores, origen y hash. El envoltorio success/message/data continúa siendo desenvuelto por los servicios existentes.

Resultados:

- TypeScript de aplicación y pruebas: aprobado, sin errores.
- Pruebas focalizadas: **121 aprobadas, 0 fallidas**, `municipales-final-local-focused.log`.
- Suite completa Angular: **1.436 aprobadas, 0 fallidas**, `municipales-final-local-suite.log`; incluye Capacitación, Prácticas y Ponentes por sesión.
- Build de producción: completado con advertencias de presupuesto y sin errores de compilación, `municipales-final-local-build.log`; salida en dist/gpc_front.
- git diff --check: sin errores.
- HTTP del servidor Angular real: 200 en localhost:4200, código actualizado comprobado después del reinicio.
- Navegador real: login visible en las tres rutas probadas; 401 real en auth/me a través del proxy. **Pendiente la inspección visual de ambas pantallas protegidas y una llamada autenticada desde esta sesión.** Las capturas del login no se presentan como prueba del textarea o del PDF.

El navegador temporal de inspección se cerró; el servidor de desarrollo actualizado permanece activo en localhost:4200. No se modificaron Laravel, PostgreSQL, PDFs, QR, hashes ni permisos de usuarios. No se instalaron dependencias ni se hizo commit/push.
