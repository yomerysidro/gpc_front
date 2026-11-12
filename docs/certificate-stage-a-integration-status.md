# Integración Angular de Etapa A

Contrato consultado en el repositorio local de Laravel, en
../gpc_back/docs/certificate-stage-a-api-contract.md.
La implementación reutiliza GenerarEmitirComponent, DocumentosDigitalesService,
VisorPdfComponent, DialogoComponent y DocumentosPorFirmarComponent.

## Flujo conectado

1. La selección conserva sesión, participación, beneficiario, tipo y mensaje.
2. revisar_documento envía id_participacion, id_tipo_certificado, mensaje y
   modalidad_firma. Laravel admite Paralela y Secuencial.
3. Angular muestra los bytes del PDF de revisión y comprueba su SHA-256.
   Los tokens y su caducidad se mantienen en memoria.
4. confirmar_preparacion envía token_revision y confirmar=true. La respuesta
   debe contener IDs reales y estado PREPARADO. El detalle autenticado debe
   corresponder al certificado, beneficiario, actividad, sesión, tipo y hash.
   Los reintentos conservan el token de la misma revisión.
5. revisar-envio usa el ID documental devuelto y cuerpo vacío. Se valida la
   identidad documental, facultades.remitir, estado PREPARADO y el hash del PDF
   persistido antes de mostrarlo.
6. La confirmación modal remite token_revision y confirmar=true.
   El estado PENDIENTE_FIRMA se consulta de nuevo antes de mostrar el éxito.
7. El enlace a Gerencia abre el documento mediante consulta autorizada de detalle.
   La bandeja y el visor utilizan las rutas de list, detail y archivo existentes,
   con bandeja=por_firmar o flujo=firmas según el contrato.

Cambiar el mensaje o la modalidad invalida la revisión anterior. El mensaje y la
modalidad elegida se conservan al volver a editar. Las peticiones en curso bloquean
las acciones repetidas. Un fallo de red conserva el token para reintentar la misma
operación. Un 409 retira la revisión rechazada y permite solicitar otra.
Los errores visibles ocultan diagnósticos SQL.

## Campos ausentes del contrato actual

El detalle de CertificateDocumentWorkflow no devuelve id_participacion.
La participación se envía al revisar y Laravel la vincula al manifiesto y la
comprueba al confirmar. Angular valida los campos de identidad que sí recibe,
sin sustituir la participación por el ID de sesión.

modalidad_firma es aceptada y queda en el manifiesto de revisión. En el esquema
mínimo, CertificateManagement.confirm no la escribe en certificado_documento y
CertificateDocumentWorkflow no la devuelve en detalle ni bandeja. Angular conserva
la selección en el asistente, envía exactamente el valor aprobado y muestra la
modalidad en Gerencia cuando la API la incluya. Su consulta persistente posterior
requiere soporte de Laravel y un contrato de almacenamiento. Esta entrega no puede
acreditar su persistencia con el contrato actual.

## Verificación

Revisión final: se impide iniciar otra revisión durante una operación o después
de preparar el documento. Antes de abrir la confirmación y antes de remitir se
comprueba expires_at; una revisión vencida se retira y exige revisar nuevamente,
conservando el documento preparado. Los errores de validación también se filtran
para no exponer diagnósticos SQL.

TypeScript de aplicación aprobado con tsc --noEmit. Build de producción aprobado;
mantiene advertencias de presupuestos de estilos del proyecto. La ejecución de
Karma iniciada antes de la instrucción de no usar simulados no llegó a ejecutar
casos: ChromeHeadless no pudo arrancar en el entorno aislado. No se añadieron
pruebas ni datos simulados en esta revisión final. No se acredita una prueba
institucional completa: requiere la confirmación manual del usuario autenticado.

Las pruebas automatizadas usan HttpTestingController y datos de prueba.
La primera creación y remisión institucional quedan pendientes de la confirmación
manual del usuario. No se ejecutaron operaciones institucionales de escritura
durante la validación del frontend.
