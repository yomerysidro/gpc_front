# Prácticas: estados coherentes y continuación documental

## Cambio realizado

Se eliminó la deducción «Disponible para entrega» basada en la existencia de un PDF. Generar y emitir y Certificados emitidos usan ahora `estadoDocumentalPractica`, a través de `estadoCatalogo` cuando corresponde. El cambio de etiquetas se limita a prácticas: Capacitación, Reconocimientos y Gerencia conservan sus flujos.

| Evidencia real | Presentación | Acción en Prácticas |
| --- | --- | --- |
| Sin certificado | Pendiente de preparación | Preparar certificado, si la evaluación lo autoriza |
| Documento `PREPARADO` | Pendiente de envío a Gerencia | Continuar preparación |
| Documento `PENDIENTE_FIRMA`, sin ambas confirmaciones | Pendiente de firma | En revisión por Gerencia; abre el visor existente |
| Documento existente con `pdf_confirmado:true` y `disponible_rrhh:true`, sin anulación ni contradicciones | Certificado confirmado | Ver certificado; abre el visor existente |
| Certificado o documento anulado | Anulado | Sin nueva preparación ni envío |
| IDs ambiguos, estado desconocido o indicadores contradictorios | Estado documental por verificar / Sin documento | No elegir ni preparar un documento arbitrario |

La anulación prevalece sobre los indicadores positivos. `PREPARADO` con indicadores de confirmación/disponibilidad positivos se trata como contradictorio; también una discrepancia explícita entre `estado_certificado` y `estado_flujo`. Un PDF, QR, hash, etiqueta libre o `estado_preparacion` aislado no acredita confirmación administrativa. No se modifica ningún estado en Laravel.

## Fuentes de datos y consultas

La evaluación `GET /api/practices/evaluacion-certificacion` devuelve en `data.practicas[].certificados_existentes[]` el estado del certificado y su ID documental vigente, pero no todos los indicadores de confirmación administrativa. Es insuficiente para afirmar disponibilidad por la mera presencia del ID.

Para documentos ya procesados se consulta el mismo catálogo autorizado utilizado por Certificados emitidos: `GET /api/certificados-documentos/list`, mediante `catalogoAutorizado`. Se agrupa por `id_tipo_certificado` real para no solicitar la práctica completa por cada fila. Si no hay tipo disponible, se usa el filtro existente `id_practica`. Se exige coincidencia de `id_certificado`, `id_certificado_documento`, `id_persona` e `id_practica`. No se elige una fila ambigua. Las prácticas sin certificado o con certificado `PREPARADO` no requieren esa consulta adicional para mostrar su estado conocido.

Al abrir el visor se reutiliza la ruta existente `/certificaciones/certificados/{id}/documentos/{documentoId}/visor?origen=practicas` y `VerDocumentoComponent`. Este consulta el catálogo filtrado por el certificado y el visor descarga su archivo administrativo existente con el hash esperado. El regreso apunta a Generar y emitir, pestaña Prácticas. No abre ni inicializa el asistente, ni consulta nuevamente toda la práctica.

El acceso directo a una ruta antigua del asistente también comprueba el contexto recuperado: un documento ya enviado se redirige al visor. Si el estado cambió mientras se recuperaba una preparación, se consulta el documento existente sin revisar ni confirmar otro PDF.

## Confirmación y envío únicos

El paso 3 se llama «Previsualización y confirmación». Una única confirmación exitosa de Laravel avanza automáticamente al paso 4. La navegación no admite un quinto paso. Un documento ya preparado no se vuelve a confirmar.

El paso 4 tiene un único botón principal, «Enviar a Gerencia». Ese clic constituye la acción explícita de envío. Dentro de la misma operación se conserva la secuencia obligatoria:

1. `POST /api/certificados-documentos/{id}/revisar-envio`, cuerpo `{}`.
2. Validación existente de identidad, hash y bytes persistidos; obtención del token de envío.
3. `POST /api/certificados-documentos/{id}/enviar-gerencia`, cuerpo `{ "token_revision": "<token de envío>", "confirmar": true }`.
4. Recuperación y comprobación del estado confirmado por Laravel mediante el servicio documental existente.

Se reutilizan `obtenerRevisionEnvio` y `confirmarEnvio`. Se bloquean clics simultáneos durante toda la secuencia. El PDF validado por la revisión de envío debe coincidir con el hash del documento ya aprobado en el paso 3. No se crea otro formulario, visor o confirmación visual. El envío nunca ocurre automáticamente al preparar. Si el backend no confirma, no se muestra un estado exitoso; los mecanismos existentes resuelven resultados inciertos mediante lectura.

Consultas y operaciones eliminadas del recorrido de visualización:

- Carga del asistente y consulta ligera de preparación para documentos ya enviados o confirmados.
- Consulta de toda la práctica cuando solo se quiere ver el PDF.
- Cualquier `revisar_documento` o `confirmar_preparacion` desde «Ver certificado».
- Segunda visualización del mismo PDF y segundo clic de confirmación en el paso 4.
- Confirmaciones repetidas del paso 3 y posibilidad de avanzar a un quinto paso.

Las dos solicitudes POST de revisión/envío exigidas por Laravel se conservan; no son duplicados.

## Archivos modificados en este ajuste

- `src/app/core/interfaces/emision-certificados/catalogo-certificados.interface.ts`: función compartida y aplicación a prácticas en el catálogo.
- `src/app/core/interfaces/emision-certificados/origenes-certificado.interface.ts`: tipado del ID documental ya entregado por el backend.
- `src/app/pages/emision-certificados/generar-emitir/practicas-certificacion.component.ts`: estado desde el catálogo, acciones por estado y visor directo.
- `src/app/pages/emision-certificados/generar-emitir/preparar-practica.component.ts`: confirmación con avance automático, cuatro pasos, envío explícito único y redirección de documentos procesados.
- `src/app/pages/emision-certificados/documentos/ver-documento.component.ts`: regreso al listado de prácticas mediante el visor compartido existente.
- `src/app/pages/emision-certificados/documentos/listar-documentos/listar-documentos.component.html`: color de estado consistente con la confirmación real de prácticas.
- `src/app/pages/emision-certificados/generar-emitir/practicas-certificacion.spec.ts`: estados, acciones, catálogo agrupado, visor y ausencia de confirmaciones duplicadas.
- `src/app/pages/emision-certificados/documentos/ver-documento.component.spec.ts`: apertura directa y regreso, sin operaciones de preparación/envío.
- `src/app/pages/emision-certificados/documentos/listar-documentos/listar-documentos.component.spec.ts`: etiqueta coherente de prácticas confirmadas, preservando los demás orígenes.
- Este informe y la referencia en `docs/practicas-mensaje-editable-integracion.md`.

## Validación y límites de integración

- TypeScript de aplicación y pruebas: correcto.
- Pruebas focalizadas: **66 correctas**, resultado en `practicas-estados-focused.log`.
- Suite Angular completa: **1.393 correctas**, sin fallos, incluidas las regresiones de Capacitación, Reconocimientos y Gerencia; resultado en `practicas-estados-suite.log`.
- Build de producción: correcto, con advertencias existentes de tamaño de bundles y estilos; no se cambiaron presupuestos.
- `git diff --check`: correcto.

La consulta real a `http://127.0.0.1:8000/api/practices/evaluacion-certificacion` agotó 10 segundos sin recibir respuesta, tanto dentro como fuera del aislamiento. **No se dispone de una respuesta real actual del certificado de Juan Alcalde en esta sesión**. No se atribuye una contradicción al backend sin esa evidencia.

Las fuentes que hay que comparar en una sesión autenticada son `data.practicas[].certificados_existentes[].estado` e `id_certificado_documento`, frente a `data.data[].estado_certificado`, `estado_documental`, `pdf_confirmado` y `disponible_rrhh` del catálogo autorizado para esa misma identidad documental. La incoherencia comprobada en el frontend era inferir disponibilidad solo por el ID del PDF; esa inferencia fue eliminada. Las pruebas funcionales utilizan respuestas HTTP simuladas y no equivalen a un envío real a Gerencia.

No se modificaron Laravel, PostgreSQL, PDFs, QR, hashes, firmantes ni el proceso de Gerencia. No se instalaron dependencias ni se hicieron commit o push. Se conservaron los cambios preexistentes del árbol de trabajo.
