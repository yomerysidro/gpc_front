# Preparación y emisión unificadas

La pantalla principal es `/certificaciones/generar-emitir`. El grupo Emisión del Sidebar contiene únicamente Generar y emitir, Certificados emitidos y Firmas digitales.

## Flujo implementado

1. Continuar una preparación existente desde el listado reutilizado o iniciar una nueva. Para la nueva preparación se seleccionan origen, registro y beneficiario verificado con Gestión.
2. Preparar el certificado con el formulario reactivo original: tipo, fecha opcional y estado booleano. El origen es excluyente. Si se encuentra un certificado existente para persona, tipo y origen, se continúa con él sin crear otro.
3. Revisar identidad, origen, datos institucionales, estado, previsualización HTML y asignaciones disponibles. Una preparación sin guardar tiene identificador `null` y se presenta explícitamente como borrador local. Guardar preparación queda condicionado a la autorización efectiva existente.
4. Consultar el resumen y los pendientes de emisión. Generar documento oficial permanece deshabilitado. No se crean documentos, códigos, hashes, QR ni firmas ficticias.

El listado conserva su instancia y sus filtros al avanzar y regresar. El formulario conserva su instancia y valores entre sus pasos. Al iniciar una preparación nueva se desmonta el listado; no se montan formularios duplicados. Los cambios de parámetros de creación/edición actualizan el contexto de la pantalla y vuelven a comprobar los permisos correspondientes.

## Componentes reutilizados y consolidados

- `GenerarEmitirComponent`: coordina el flujo único.
- `FormularioCertificadoComponent`: incorpora modo integrado y salidas de preparación, cambio de paso, cancelación y error de guardado. Mantiene sus validaciones y contrato HTTP.
- `ListarCertificadosComponent`: conserva búsqueda, filtros, actualización, carga, estados vacíos, paginación, detalle y edición. Ahora también ofrece detalle y edición al seleccionar dentro del flujo.
- `VisorCertificadoComponent`: admite tanto datos administrativos persistidos como datos de un borrador sin identificador inventado.
- Servicios existentes de Emisión, Gestión y Prácticas: sin endpoints nuevos ni cambios de contratos.

No se eliminaron componentes ni se crearon pantallas alternativas. Se eliminó la entrada independiente Preparar certificados del Sidebar y se consolidaron sus rutas en el flujo principal. Certificados emitidos y Firmas digitales conservan sus componentes y diseño.

## Compatibilidad de rutas

| Ruta anterior | Destino |
| --- | --- |
| `/certificaciones/certificados` | `/certificaciones/generar-emitir` |
| `/emision`, `/certificados` | Redirecciones existentes encadenadas hacia el flujo principal |
| `/certificaciones/certificados/nuevo` | `/certificaciones/generar-emitir?nuevo=1`, paso de selección de origen |
| `/certificaciones/certificados/:id/editar` | `/certificaciones/generar-emitir?editar=:id`, paso de preparación y permiso `emision.editar` |

Las rutas de detalle, historial, visor y documentos conservan sus destinos. La creación requiere `emision.crear`, la edición `emision.editar` y la pantalla `emision.ver`. No se modificaron los archivos de autenticación ni los guards existentes.

## Archivos intervenidos en esta unificación

Rutas relativas a `src/app`:

- `components/sidebar/modulos-navegacion.ts` y `.spec.ts`.
- `components/sidebar/pantallas-pendientes.spec.ts` (cantidad de enlaces tras retirar una opción).
- `base-architecture.spec.ts` (expectativa del enlace único del Sidebar).
- `core/interfaces/emision-certificados/preparacion-documental.interface.ts`.
- `pages/emision-certificados/emision-certificados.routes.ts` y `.spec.ts`.
- `pages/emision-certificados/generar-emitir/generar-emitir.component.ts`, `.html` y `.spec.ts`.
- `pages/emision-certificados/certificados/formulario-certificado/formulario-certificado.component.ts`, `.html`, `.spec.ts` y nuevo `.scss` propio del formulario.
- `pages/emision-certificados/certificados/listar-certificados/listar-certificados.component.html`.
- `pages/emision-certificados/compartidos/visor-certificado.component.ts`.
- Este documento.

Los demás cambios previos presentes en Git se conservaron. No se hicieron commits ni push.

## Validación

- Compilación Angular de producción: correcta (`.angular/unificacion-build.log`).
- TypeScript de aplicación y tests: correcto, `tsc --noEmit` con `tsconfig.app.json` y `tsconfig.spec.json`.
- Suite de Emisión, sus servicios y Sidebar: **184 pruebas correctas**, sin fallos (`.angular/unificacion-tests.log`).
- Cobertura nueva: tres orígenes, formulario integrado conservado entre pasos, selección de registros existentes, prevención de duplicados, borrador sin persistencia, origen único, redirecciones antiguas, edición por parámetros, permisos, Sidebar de tres opciones y conservación del listado sin repetir su carga.
- Se mantuvieron las pruebas de documentos emitidos, firmantes, modal, archivos y ausencia de emisión ficticia.
- Suite general final: **462 pruebas correctas y 13 fallidas**, todas las fallidas en Gestión y servicios de seguridad, con los mismos fallos identificados antes de la unificación (expectativas de URLs `/api` frente a la base configurada y configuración de campos Estado). No se modificaron esos módulos. Registro: `.angular/unificacion-regresion-tests.log`. La suite general todavía no está completamente en verde.

## Pendientes del backend

Se mantiene el bloqueo de escrituras por la ausencia de autorización efectiva detectada en la revisión anterior. No se cambió Laravel para resolverlo. La emisión oficial requiere una API segura que produzca PDF, código, hash y QR y verifique facultades y elegibilidad. La firma digital y la carga privada PKCS#12 siguen sujetas a sus operaciones oficiales; asignar un firmante no aplica una firma.
