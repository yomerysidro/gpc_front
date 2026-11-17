# Gerencia y consultas Etapa B

Contratos leídos desde `../gpc_back/docs/certificate-stage-a-api-contract.md` y
`../gpc_back/docs/certificate-stage-b-api-contract.md`, y respuestas comprobadas
contra CertificateSigningStageB y CertificateSigningDemo (solo lectura).

La ruta `/pendientes/documentos-firmar/:id` conserva el layout privado y exige
`emision.ver`. El ID es `id_certificado_documento`. La bandeja guarda su paginación
en `page`; el regreso la recupera sin recargar. Los enlaces anteriores con
`?documento=id` se redirigen al detalle. No se modificaron los modales compartidos
ni las vistas de otros documentos.

Se reutilizan DocumentosDigitalesService y VisorPdfComponent. El PDF se recupera
con cookies privadas desde `/{id}/archivo?flujo=firmas`, se valida como PDF y se
comprueba su SHA-256. El visor permite zoom, descarga, apertura e impresión. La
actualización del progreso conserva el visor cuando la identidad y hash no cambian.
Se cancelan las consultas y se liberan los Blob URLs al salir.

FirmaDocumentalService conecta las consultas reales de progreso, verificación y
responsables institucionales bajo `/{id}/firma/`. El catálogo disponible exige
además permisos de gestión en Laravel; un rechazo se muestra sin sustituirlo por
datos de prueba. La modalidad solo se muestra como real con modalidad_persistida.
La consulta por lote POST `/firmas/lote/progreso` envía únicamente ids_documentos
y presenta cada resultado por separado, sin afirmar integridad a partir del lote.

## DEMO

El servidor debe devolver demo_disponible=true y autorizar GET
`/{id}/firma/demo/progreso`. No se deduce disponibilidad desde el entorno Angular.
Además se exige permiso de gestión e integridad confirmada. Los responsables
ficticios se obtienen exclusivamente de firmantes_disponibles de esa respuesta.
La sección mantiene el aviso «DEMOSTRACIÓN — SIN FIRMA DIGITAL VÁLIDA».

El usuario elige PARALELA o SECUENCIAL y los responsables de prueba. El orden es
el de selección y se muestra antes de confirmar. POST `/firma/demo/asignar` envía
modalidad, firmantes con id_demo/orden_firma, clave_operacion UUID y confirmar=true.
POST `/firma/demo/simular` envía id_demo, clave_operacion y confirmar=true. Cada
acción necesita un clic explícito. Un fallo incierto conserva en memoria el mismo
cuerpo y UUID para reintentar sin duplicar. Un rechazo de autorización o contexto
retira el DEMO consultado. No se guardan tokens, credenciales ni claves en localStorage.

SECUENCIAL habilita el menor orden pendiente devuelto por el servidor. PARALELA
permite cualquier pendiente. El progreso DEMO no modifica el documento real que
se muestra en el panel. Laravel impide reasignar una demostración ya comenzada;
el contrato no ofrece reinicio y Angular no lo inventa.

## Límites reales

La modalidad documental no está persistida en el esquema actual. Las asignaciones
documentales reales, la firma criptográfica, la emisión y la entrega siguen
bloqueadas. Angular no invoca las rutas reales bloqueadas ni genera fechas de
emisión. No se solicitan PFX/P12, contraseñas ni firmas gráficas. Las tablas y el
PDF institucional se conservan. Las pruebas automatizadas usan datos exclusivos
del entorno de pruebas y nunca ejecutan operaciones contra la base institucional.

## Verificación de Angular

145 pruebas aprobadas en Chrome Headless 157 (Windows), incluyendo detalle,
navegación, conservación de paginación, PDF y hash, zoom, impresión, liberación
de Blob URLs, progreso, catálogo, autorización y rechazo DEMO, ambas modalidades,
reintentos con UUID conservado, finalización sin emisión y resultados por lote.
La selección también incluye servicios documentales, rutas, permisos y las
pruebas existentes de Solicitudes afectadas por la sustitución del modal.

TypeScript de aplicación y pruebas aprobado con `tsc --noEmit`. Build de producción
aprobado con código de salida 0; permanecen advertencias de presupuestos de
estilos/tamaño del proyecto. ChromeHeadless se ejecutó fuera del aislamiento que
anteriormente impedía iniciar su proceso; no se desactivaron controles de la app.
No se ejecutaron asignaciones o simulaciones contra el documento institucional
durante la validación automática. Su operación manual requiere sesión y
autorización del servidor.
