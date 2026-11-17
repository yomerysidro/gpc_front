# Asistente de revisión: interfaz y límites

El asistente de beneficiario conserva los pasos Datos, Mensaje, Previsualizar y
Confirmar. Los contadores de asistencia y la evaluación de preparación permanecen
en la bandeja; al revisar se presenta beneficiario, tipo, actividad/sesión y estado
administrativo. Los motivos de bloqueo y los errores de PDF siguen accesibles en
«Ver detalles». Los errores de autorización y de consulta no se eliminan.

El visor existente ofrece un modo compacto para este asistente, con descarga del
Blob original y una indicación «Borrador pendiente de emisión». No se modifican los
bytes de Laravel, ni se reconstruye el PDF desde HTML. Los demás usos del visor
conservan sus acciones de impresión y apertura. La edición sigue conservando el
borrador e invalidando el PDF anterior mediante el flujo existente.

## Cambio necesario en Laravel (no implementado en este repositorio)

En la plantilla del generador PDF, condicionar el texto incrustado
«Vista previa · Sin emisión ni firma digital institucional» al estado real del
documento. Para vistas previas no emitidas, sustituirlo por una identificación
discreta «Borrador» o marca de agua equivalente. Para documentos cuya emisión o
firma haya confirmado el backend, retirar esa leyenda de vista previa y representar
únicamente los datos y evidencias reales de emisión/firma. No basar esa decisión
en un parámetro libre del navegador. El frontend no puede retirar ese texto del
PDF recibido mediante CSS.

## Remisión a Gerencia

No hay contrato de respuesta `certificate-stage-a-api-contract.md` en este checkout.
Los métodos de transporte confirmados en `DocumentosDigitalesService` permanecen
sin conectar a operaciones del asistente. La vista previa temporal no dispone de
un `id_certificado_documento` persistido y no puede remitirse. No se crean tokens,
estados de emisión ni firmas locales.

## Presentación adaptable

El encabezado permite partir nombres largos; las acciones se distribuyen en varias
líneas. Se conserva el diseño adaptable del visor y de los pasos/datos existentes.

## Verificación

- Suite Angular completa: 880 pruebas correctas en ChromeHeadless.
- TypeScript de aplicación y pruebas: correcto.
- Build de producción: correcto, con advertencias de tamaño.
- Verificación a 360 px del encabezado y visor: correcta en prueba de navegador.
- Pruebas de conservación del borrador, invalidación del PDF, bytes originales,
  descarga, errores HTTP y autenticación existentes conservadas.
- Sin validación visual manual en dispositivos físicos ni integración Laravel nueva.

Resultados en `limpieza-asistente-tests.log` y `limpieza-asistente-build.log`.
