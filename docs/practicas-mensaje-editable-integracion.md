# Prácticas: integración del mensaje editable

Actualización posterior: [estados, visor directo y envío único](practicas-estados-navegacion.md). Esa entrega sustituye la segunda confirmación visual de envío descrita en el recorrido inicial.

Contrato contrastado con `gpc_back/docs/certificate-origins-api-contract.md`, `CertificationReadinessController`, `CertificateOrigins` y `CertificateManagement`, solo mediante lectura. El contrato vigente acepta `mensaje` para prácticas; sustituye la limitación documentada en entregas anteriores.

## Archivos Angular modificados

- `src/app/core/interfaces/emision-certificados/origenes-certificado.interface.ts`: campos reales `mensaje_predeterminado`, `mensaje`, `texto_editable`, `mensaje_estructurado_disponible` de la evaluación de prácticas.
- `src/app/core/services/emision-certificados/documentos-digitales.service.ts`: extensión del servicio existente para enviar el mensaje de prácticas al revisar y confirmar; comprobación de coincidencia exacta en revisión y mensaje aprobado del documento recuperado. Las llamadas y payloads de los demás orígenes conservan su comportamiento.
- `src/app/pages/emision-certificados/generar-emitir/preparar-practica.component.ts`: formulario, contador Unicode y validación de 1.200 caracteres, navegación inmediata de Datos a Mensaje, consulta secundaria independiente, invalidación de revisión al editar, recuperación inmutable y envío explícito.
- `src/app/pages/emision-certificados/generar-emitir/practicas-certificacion.spec.ts`: presentación, navegación, carreras de respuestas HTTP, límites, payloads, mensajes, tokens, recuperación, duplicados y envío.

Se actualizaron también este informe y la referencia de estado vigente en `docs/certificacion-practicas-frontend.md`. La salida de la suite completa está en `practicas-integracion-suite.log`.

## Componentes y mecanismos reutilizados

Se conserva `PrepararPracticaComponent`, sin crear otro asistente. Reutiliza `DocumentosDigitalesService`, `PracticeService`, `VisorPdfComponent`, estilos institucionales `emision.scss` y `reconocimiento-asistente.scss`, autenticación existente y el validador compartido `validarMensajeCertificado`. Se añade al control de prácticas la comprobación de contenido visible exigida por Laravel (no solo separadores o caracteres de formato). Se cuenta por puntos de código Unicode, sin truncar el texto ni normalizar espacios o saltos de línea.

Datos no muestra supervisores ni mensajes del certificado. El paso 2 permite editar antes de confirmar; el documento confirmado siempre se presenta en solo lectura. El paso 3 conserva el visor y la exigencia de visualizar el PDF antes de confirmar. El paso 4 conserva la revisión de envío y la confirmación explícita; nunca envía automáticamente.

## Endpoints y payloads reales

Todos usan el prefijo `/api` y la autenticación existente.

| Endpoint | Uso |
| --- | --- |
| `GET /practices/{id}/evaluacion-certificacion` | Recuperación puntual de datos al acceder directamente o recargar el navegador |
| `GET /certificaciones/practica/{id}/preparar?accion=consultar_preparacion` | Obtener mensaje si falta en el contexto o recuperar el documento confirmado; sin generar PDF |
| `POST /certificaciones/practica/{id}/preparar` | Revisar y confirmar con los cuerpos descritos abajo |
| `GET /certificados-documentos/detail/{id}?flujo=firmas` | Verificar documento, identidad, hash y mensaje aprobado después de confirmar |
| `GET /certificados-documentos/{id}/archivo` | Descargar una única vez los bytes persistidos para el visor; verificar su hash |
| `POST /certificados-documentos/{id}/revisar-envio` | Cuerpo `{}`; revisión del documento guardado |
| `POST /certificados-documentos/{id}/enviar-gerencia` | Cuerpo `{ "token_revision": "<token de envío>", "confirmar": true }`; envío explícito |

La tabla existente usa `GET /practices/evaluacion-certificacion`, cuya colección `data.practicas` ya incluye el mensaje predeterminado. Ese contexto se reutiliza sin volver a consultar la lista.

Revisión:

```json
{
  "accion": "revisar_documento",
  "mensaje": "<texto exacto del formulario>"
}
```

Confirmación:

```json
{
  "accion": "confirmar_preparacion",
  "mensaje": "<el mismo texto aprobado en la revisión>",
  "token_revision": "<token devuelto por esa revisión>",
  "confirmar": true
}
```

No se envían `motivo`, IDs del beneficiario, tipo, fechas, PDF, QR ni hash como campos nuevos de estos cuerpos.

## Estado, navegación y recuperación

- La fila seleccionada muestra Datos inmediatamente. Siguiente cambia al paso 2 sin esperar HTTP y sin revisar ni generar PDF.
- Si la evaluación contiene `mensaje` o `mensaje_predeterminado`, se inicializa el control sin otra petición. Si falta, se utiliza la consulta ligera existente con un indicador discreto solo dentro de Mensaje. Una consulta pendiente no bloquea Datos → Mensaje y no se duplica.
- El mensaje permanece en el control del componente, sin almacenamiento adicional. Las respuestas tardías no sustituyen un borrador editado. La consulta de un documento realmente confirmado sí restaura su contenido aprobado y lo hace inmutable.
- Al avanzar de Mensaje a Previsualización se envía el texto exacto para revisión. Escribir no hace peticiones. Volver sin cambios reutiliza los bytes y la revisión vigente.
- Al editar se descartan localmente revisión, token, vista previa y marca de visualización anteriores. Se exige otra revisión explícita al avanzar; el mensaje de esa revisión debe coincidir exactamente con el formulario para confirmar.
- Un rechazo de confirmación invalida la revisión y obliga a consultar el estado persistido antes de intentar otra preparación. Se conserva el borrador si aún no hay documento. Si la confirmación sí llegó al servidor, se recupera el documento existente sin repetir la preparación.
- Una preparación recuperada comienza visualmente en Datos, conserva mensaje aprobado, ID, estado, URL administrativa y hash. El PDF se descarga al llegar al paso 3 y se reutiliza al volver. No se sustituye el texto histórico por el predeterminado actual.
- El envío solo se habilita con documento `PREPARADO` y facultad de remisión. Se revisa, se visualiza y se confirma por una acción explícita. El estado administrativo mostrado procede de la confirmación HTTP y no habilita otro envío si ya está pendiente de firma.

## Validación realizada

- `node node_modules/typescript/bin/tsc --noEmit -p tsconfig.app.json`: correcto.
- `node node_modules/typescript/bin/tsc --noEmit -p tsconfig.spec.json`: correcto.
- Suite focalizada de prácticas y servicios de orígenes/ponentes: **61 correctas** en ChromeHeadless.
- Suite Angular completa: **1.374 correctas**, sin fallos, incluidas Capacitación, Reconocimientos y sus asistentes. Resultado en `practicas-integracion-suite.log`.
- `node node_modules/@angular/cli/bin/ng.js build --configuration production`: correcto, con advertencias de presupuestos de tamaño de bundles y estilos. No se cambiaron los presupuestos.
- `git diff --check`: correcto.

Las pruebas de interfaz y flujo usan mocks de servicios/HTTP; las pruebas del servicio conservan la comprobación de bytes/hash del PDF devuelto. No equivalen a completar el recorrido con una identidad real en Laravel.

Petición real comprobada: `GET http://127.0.0.1:8000/api/practices/evaluacion-certificacion` con `Accept: application/json`. Resultado:

```http
HTTP/1.1 401 Unauthorized
```

```json
{"success":false,"message":"No autenticado.","data":[]}
```

Queda pendiente la comprobación autenticada de extremo a extremo contra Laravel/Neon. No se probó un envío real a Gerencia ni se afirma esa validación. No se modificaron Laravel, PostgreSQL, PDFs históricos, QR, hashes ni firmantes. No se instalaron dependencias, ni se hicieron commit o push.
