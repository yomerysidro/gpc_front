# Certificación de prácticas — frontend

**Estado vigente:** la integración con mensajes editables ya está implementada. El contrato actualizado sustituye la incompatibilidad histórica de edición descrita más abajo. Consultar [la entrega de mensaje editable](practicas-mensaje-editable-integracion.md) para archivos, payloads y resultados actuales.

Implementación del 16/11/2026. Solo Angular; sin dependencias nuevas ni cambios en Laravel, base de datos, plantillas o documentos históricos.

## Archivos de esta implementación

- `src/app/core/interfaces/emision-certificados/origenes-certificado.interface.ts`: evaluación específica de prácticas.
- `src/app/core/services/practice/practice.service.ts`: evaluación colectiva, individual y finalización.
- `src/app/core/services/emision-certificados/documentos-digitales.service.ts`: consulta puntual de preparación de prácticas; se reutilizan revisión, confirmación, archivo, validación de hash y envío existentes.
- `src/app/shared/components/gestion-table/gestion-table.component.ts` y `.html`: acción de finalización exclusiva de filas de prácticas, confirmación, bloqueo de solicitudes simultáneas, motivos del 409 y actualización de fila.
- `src/app/pages/emision-certificados/emision-certificados.routes.ts`: ruta protegida con identificador de práctica, sin datos sensibles.
- `src/app/pages/emision-certificados/generar-emitir/generar-emitir.component.ts` y `.html`: integración de la pestaña.
- `src/app/pages/emision-certificados/generar-emitir/practicas-certificacion.component.ts`: tabla basada en las decisiones del backend.
- `src/app/pages/emision-certificados/generar-emitir/preparar-practica.component.ts`: asistente de cuatro pasos con estilos institucionales y visor compartidos.
- `src/app/pages/emision-certificados/generar-emitir/practicas-certificacion.spec.ts`: pruebas de contrato, bloqueo, recuperación, navegación, reutilización y envío explícito.
- `src/app/pages/emision-certificados/generar-emitir/bandeja-certificacion.spec.ts`: adaptación de la integración de prácticas al endpoint de evaluación.

Se conservaron los cambios preexistentes del árbol de trabajo en Reconocimientos.

## Endpoints existentes

Todas las rutas tienen prefijo `/api` y usan el mecanismo de autenticación del proyecto.

| Método y ruta | Uso / cuerpo |
| --- | --- |
| `POST /practices/{id}/finalizar` | `{}`; solo actualiza tras confirmación de `practica_finalizada` y `finalizacion_registrada` |
| `GET /practices/detail/{id}` | Recarga de la fila finalizada |
| `GET /practices/evaluacion-certificacion` | Lee `data.practicas` |
| `GET /practices/{id}/evaluacion-certificacion` | Recuperación al abrir directamente o recargar la página |
| `POST /certificaciones/practica/{id}/preparar` | `{ accion: 'revisar_documento' }` para texto institucional y PDF real |
| `POST /certificaciones/practica/{id}/preparar` | `{ accion: 'confirmar_preparacion', token_revision, confirmar: true }` |
| `GET /certificaciones/practica/{id}/preparar?accion=consultar_preparacion` | Preparación existente o resultado incierto, sin generar PDF |
| `GET /certificados-documentos/detail/{id}?flujo=firmas` | Verificación del documento confirmado y estado posterior al envío |
| `GET /certificados-documentos/{id}/archivo` | PDF persistido, comprobado contra el hash del servidor |
| `POST /certificados-documentos/{id}/revisar-envio` | `{}` |
| `POST /certificados-documentos/{id}/enviar-gerencia` | `{ token_revision, confirmar: true }`; solo por confirmación explícita |

El texto de prácticas es de solo lectura porque el contrato de prácticas no admite los campos editables propios de los reconocimientos por sesión. Si una preparación recuperada no expone texto estructurado, Mensaje muestra el PDF almacenado para revisar el texto original. No se reconstruye ni se vuelve a generar el documento.

La fila viaja mediante el estado de navegación de Angular. Una recarga consulta únicamente la evaluación individual y, si hay certificado existente, su preparación. Volver entre pasos conserva la revisión y los bytes del PDF en memoria. Los resultados inciertos de una confirmación exigen recuperar el estado antes de intentar otra preparación.

## Validación y límites

- Suite ChromeHeadless: **56 pruebas correctas**, incluyendo prácticas, bandeja de capacitación y reconocimientos por sesión. Se actualizaron las expectativas de la antigua consulta de prácticas para exigir el contrato nuevo.
- `node node_modules/typescript/bin/tsc --noEmit -p tsconfig.app.json`: correcto.
- `node node_modules/@angular/cli/bin/ng.js build`: correcto; advertencias de presupuestos de bundles y estilos.
- `git diff --check`: correcto.
- El aislamiento inicialmente impedía al compilador leer directorios y a Chrome arrancar; build y pruebas se ejecutaron fuera del aislamiento con autorización.
- En la primera validación el backend local agotó el tiempo de espera. En la comprobación posterior indicada abajo ya responde, pero requiere una sesión autenticada. No se ejecutaron escrituras reales ni se modificaron documentos históricos.

El contrato se contrastó leyendo `CertificateOrigins`, `CertificateManagement`, `CertificateDocumentWorkflow`, `CertificationReadinessController` y `PracticeCertificatesNeonTest` del backend, sin modificarlos ni ejecutar pruebas de Laravel.

## Ajuste de supervisión informativa

Archivos modificados en este ajuste:

- `src/app/core/interfaces/emision-certificados/origenes-certificado.interface.ts`: tipado de la colección `supervisores` ya devuelta por Laravel.
- `src/app/pages/emision-certificados/generar-emitir/preparar-practica.component.ts`: supervisores, tipo, estado y fechas registradas en Datos del certificado; conserva los cuatro pasos, el visor, la recuperación y la confirmación explícita del envío.
- `src/app/pages/emision-certificados/generar-emitir/practicas-certificacion.component.ts`: actualización manual del listado sin recargar la página y consulta desplegable de la respuesta del servidor fuera de la columna de estado.
- `src/app/shared/components/gestion-table/gestion-table.component.ts` y `.html`: reconoce `finalizado` con cualquier combinación de mayúsculas y minúsculas, conserva el valor confirmado por Laravel y evita identificadores en la confirmación de finalización.
- `src/app/pages/emision-certificados/generar-emitir/practicas-certificacion.spec.ts`: pruebas de supervisión ausente, periodo parcial y autorización del servidor.
- `src/app/shared/components/gestion-table/gestion-table.component.spec.ts`: pruebas de finalización confirmada, actualización de una fila y rechazo por supervisión sin cambio de estado.
- Este documento.

No se validan cantidad de supervisores, cobertura, fechas de supervisión ni `supervision_acreditada` en el frontend. Si Laravel autoriza preparar y generar PDF, se permite continuar aun sin asignaciones o con un periodo parcial. Los motivos se conservan como información del servidor; su texto no añade un veto local a una autorización positiva. No se modifica la autenticación ni se añade una excepción local de administrador: las operaciones siguen sujetas a la autorización real de Laravel.

### Incompatibilidad comprobada en el código actual de Laravel (solo lectura)

`CertificateOrigins::finalizePractice()` sigue rechazando la operación cuando `supervision_acreditada` es falso. El controlador responde HTTP **409**, con `data.practica_finalizada: false`, `message: "No se puede finalizar la práctica."` y este texto en `data.motivos_bloqueo`:

> Se requiere supervisión acreditada que cubra todo el periodo y estados institucionales de supervisión autorizados.

`CertificateOrigins::practice()` sigue calculando cobertura de todo el periodo y añade este motivo a la evaluación cuando no está acreditada:

> No existe un responsable de supervisión que cubra el periodo según la política institucional.

También puede devolver:

> Falta configurar los estados de supervisión autorizados por la política institucional.

Esto deja `puede_preparar` y `puede_generar_pdf` deshabilitados en la evaluación. No se eliminan esos motivos ni se convierte una denegación en un éxito. Aplicar la nueva regla también en el servidor requiere un cambio de backend, excluido expresamente de este trabajo. Los textos anteriores proceden de inspección del código; **no se presentan como una respuesta 409 obtenida con una sesión real en esta validación**.

### Petición real realizada

`GET http://127.0.0.1:8000/api/practices/evaluacion-certificacion`, con `Accept: application/json`, respondió:

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json
```

```json
{"success":false,"message":"No autenticado.","data":[]}
```

Por tanto, el recorrido autenticado completo (finalizar, preparar, recuperar PDF y enviar a Gerencia) no se puede dar por validado contra datos reales desde esta sesión. No se enviaron solicitudes de escritura sin identidad autenticada ni se utilizaron datos ficticios en la aplicación.

### Pruebas del ajuste

- Suite de prácticas, bandeja de certificación, reconocimiento por sesión y contrato de ponentes: **59 correctas** en ChromeHeadless.
- Suite final de Gestión de Prácticas y asistente de prácticas: **42 correctas** en ChromeHeadless (incluye pruebas compartidas con la suite anterior).
- `ng build`: correcto, con advertencias de presupuesto de tamaño de bundles y estilos.
- `git diff --check`: correcto.

## Datos del beneficiario y compatibilidad de mensaje editable

Se retiró exclusivamente la sección visual de supervisión del asistente. El paso Datos muestra una tarjeta con practicante, tipo de certificado, institución, área municipal, carrera, inicio, finalización, estado y elegibilidad. La colección de supervisores permanece intacta en el modelo y en las respuestas. No se tocaron el visor, los tokens, la confirmación ni el envío a Gerencia.

Se revisaron `gpc_back/docs/certificate-origins-api-contract.md` y `CertificationReadinessController::prepareOrigin`. **El contrato vigente no admite `mensaje` personalizado para prácticas en ninguna de las dos acciones.** Los campos de texto se agregan a la validación únicamente si el origen es `ponente_sesion`. Para `practica`, un campo extra provoca HTTP 422, `La acción contiene campos no admitidos.`. Además, el servicio de composición y la confirmación del contenido editable están limitados a `ponente_sesion`. No basta con agregar un textarea o enviar un campo ignorado.

Por ello, el paso Mensaje muestra el texto real en un textarea de solo lectura, conservando exactamente espacios y saltos de línea, sin prometer edición. Los documentos existentes siguen siendo inmutables; si no hay texto estructurado persistido, se conserva la consulta del PDF original. No se enviaron campos nuevos al API. La edición real y las pruebas de PDF con texto personalizado quedan pendientes de compatibilidad de Laravel, conforme a la alternativa expresamente solicitada.

### Ajuste mínimo propuesto para Laravel — no implementado

1. Admitir un `mensaje` opcional exclusivamente para prácticas en `revisar_documento` y `confirmar_preparacion`. Cuando se omita, usar el mensaje institucional actual sin alterarlo. Reutilizar la validación de texto plano existente (no vacío, máximo 1.200 caracteres, sin HTML, controles o marcas bidireccionales) y la comprobación de que el contenido cabe en la página. Documentar estos límites expresamente para prácticas.
2. Incorporar ese mensaje al contexto aprobado/manifiesto temporal de prácticas y a la composición del PDF real. Devolver el mensaje exacto aprobado junto al token, caducidad y hash. En confirmación, exigir coincidencia exacta entre texto solicitado, revisión y contenido aprobado; rechazar un token de otro texto, sin sobrescribir preparaciones existentes.
3. Recuperar `mensaje`/`mensaje_aprobado` del contenido persistido y devolver `texto_editable:false` para documentos confirmados. No reconstruir mensajes históricos desde datos actuales ni regenerar sus archivos. Puede aprovecharse el almacenamiento de manifiestos existente, sin exigir nuevas tablas o columnas.
4. Tras habilitar ese contrato, Angular podrá reutilizar el control y validador de texto existentes, conservar el borrador en memoria e invalidar revisión/PDF/token al editar. Revisar solo por acción explícita al avanzar, nunca durante la escritura; confirmar con el mismo mensaje aprobado. No extender el cambio a otros orígenes.

Archivos de este último ajuste: `preparar-practica.component.ts`, `practicas-certificacion.spec.ts` y este documento. Las pruebas visuales comprueban que no se muestra supervisión aunque venga en la respuesta, que la tarjeta contiene los datos reales del beneficiario y que el mensaje de solo lectura conserva el texto al volver entre pasos sin otra revisión ni envío automático.

Validación de este último ajuste: TypeScript (`tsc --noEmit -p tsconfig.app.json`) correcto; **61 pruebas Angular correctas** en ChromeHeadless, incluyendo regresión de Capacitación y Reconocimientos; `ng build --configuration production` correcto con advertencias de presupuesto de tamaño existentes. No se hicieron commit ni push.
