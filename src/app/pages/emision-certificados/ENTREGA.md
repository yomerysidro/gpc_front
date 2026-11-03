# Emisión de certificados — revisión y cierre de faltantes

Se conservaron las cuatro pantallas existentes y los cambios previos del workspace. No se crearon pantallas duplicadas ni se modificaron Laravel, Gestión, autenticación, guards, interceptores o el Sidebar. No se hicieron commits ni push.

## Pantallas conservadas y comprobadas

| Pantalla | Implementación existente reutilizada | Resultado |
| --- | --- | --- |
| Preparar certificados | ListarCertificadosComponent, FormularioCertificadoComponent, DetalleCertificadoComponent | Tres orígenes excluyentes, beneficiario derivado, búsqueda, filtros, paginación y revisión. Se reforzó la validación y el guardado. |
| Generar y emitir | GenerarEmitirComponent, listado seleccionable y VisorCertificadoComponent | Cuatro pasos, revisión reactiva, origen real y previsualización identificada como borrador. Emisión oficial deshabilitada. |
| Certificados emitidos | ListarDocumentosComponent y DialogoComponent | Documentos consultados por API, relaciones, filtros, paginación, detalle y estados vacíos. Sin descarga ni URL privada inventada. |
| Firmas digitales | ListarFirmasComponent, FirmanteCardComponent, FormularioFirmanteComponent, AsignarFirmantesComponent | Tarjetas municipales, DNI enmascarado, modal, búsqueda de trabajadores y pestaña de asignaciones. Sin afirmaciones de validez criptográfica. |

No se añadieron componentes de pantalla nuevos. Se añadió una política frontend de bloqueo de escrituras y su prueba.

## Contratos consultados, solo lectura

Se inspeccionaron `gpc_back/routes/api.php`, `CertificateController`, `SignatureController`, `CertificateData`, `SignatureData` y `config/module_permissions.php`.

- Certificados: `fecha_emision` es nullable y tiene formato `Y-m-d`; `estado` es booleano. No hay campo de observaciones en ese contrato.
- Firmas: se exige `ruta_archivo_pfx` de un archivo ya existente en almacenamiento privado, `passphrase`, trabajador y fecha. Esto no constituye una API de subida multipart.
- **Bloqueo real encontrado:** la autenticación del grupo de rutas y las comprobaciones de autorización de los controladores están comentadas como temporalmente desactivadas. Los permisos visibles en Angular no resuelven esto.

Las lecturas existentes siguen usando EmisionCertificadosService: `certificados/list`, `certificados/detail/{id}`, `tipos-certificado/list`, `certificados-documentos/list`, `firmas/list`, `actividades-firmas/list` y las relaciones de Gestión, participaciones, actividades, reconocimientos y prácticas. No se añadieron endpoints. La comprobación se hizo contra código local y HTTP simulado en tests, no contra una sesión productiva ni datos municipales en vivo.

## Faltantes corregidos en esta intervención

- Fecha de emisión opcional conforme al contrato, enviada como `null` cuando está vacía.
- Rechazo de fechas imposibles y mensajes visuales para fecha, tipo y registro.
- Invalidación de la revisión cuando cambia el formulario.
- Guardado condicionado a revisión, permiso, formulario válido, beneficiario y tipo existente.
- Bloqueo de creación, edición y eliminación de certificados, documentos, firmas y asignaciones de actividad antes de realizar HTTP, mientras no se verifique autorización efectiva del servidor.
- Avisos visibles y confirmaciones deshabilitadas en formularios; asignaciones en modo consulta y eliminación de credenciales no disponible.
- Corrección de expectativas antiguas en pruebas de títulos, DNI enmascarado y consulta de detalle sin permiso de edición.

`ESCRITURA_EMISION_AUTORIZADA` permanece en `false`. Solo las pruebas de contratos futuros lo sustituyen por `true`; no hay activación mediante navegador, almacenamiento o parámetros. No sustituye la seguridad del backend.

## Archivos intervenidos

Rutas relativas a `src/app`:

- `core/services/emision-certificados/emision-certificados.service.ts` y `.spec.ts`.
- `core/services/emision-certificados/operaciones-emision.ts` y `.spec.ts` (nuevos).
- `pages/emision-certificados/certificados/formulario-certificado/formulario-certificado.component.ts`, `.html` y `.spec.ts`.
- `pages/emision-certificados/firmas/formulario-firmante/formulario-firmante.component.ts`, `.html` y `.spec.ts`.
- `pages/emision-certificados/firmas/listar-firmas/listar-firmas.component.ts`, `.html` y `.spec.ts`.
- `pages/emision-certificados/firmas/asignar-firmantes/asignar-firmantes.component.ts` y `.html`.
- `pages/emision-certificados/compartidos/entradas-tarjetas.component.spec.ts`.
- `pages/emision-certificados/emision-certificados.routes.spec.ts`.
- Este documento. Los demás cambios ya presentes en Git no son atribuibles a esta intervención.

## Validaciones y comprobaciones

- Compilación Angular de producción: correcta; registro en `.angular/emision-auditoria-build.log`.
- TypeScript de aplicación y tests: correcto con `tsc --noEmit` para ambos tsconfig.
- Suite del módulo, servicios y Sidebar: **175 pruebas correctas**; registro en `.angular/emision-auditoria-modulo-tests.log`.
- Incluye rutas y permisos, formularios, selección PFX/P12, extensión/tamaño/archivo vacío, trabajador válido, limpieza de contraseña, modal, listados, tarjetas, estados vacíos y ausencia de emisión ficticia.
- La suite general inicial tenía 17 fallos y 446 pruebas correctas. Cuatro fallos del módulo correspondían a expectativas antiguas y se corrigieron. Los restantes pertenecían a Gestión y servicios de seguridad; no se modificaron esos módulos.
- Suite general final: **451 pruebas correctas y 15 fallidas**, todas fuera de Emisión. Persisten los 13 fallos de Gestión/servicios de seguridad de la ejecución inicial; además hubo dos errores `ChunkLoadError` al cargar Mis solicitudes. No se puede declarar toda la aplicación libre de regresiones con esta suite en rojo. Registro: `.angular/emision-auditoria-regresion-tests.log`.
- No se comparó visualmente con imágenes de referencia: no están adjuntas en esta conversación. Se conservó el diseño ya implementado.

## Pendiente de integración oficial

1. Restablecer y verificar la autenticación y autorización del servidor antes de habilitar escrituras; esa tarea queda fuera del alcance Angular.
2. Definir carga privada autorizada de PKCS#12, con límite de tamaño. El adaptador existente permanece sin implementación HTTP y no envía secretos.
3. Proporcionar servicio oficial de emisión: plantilla, PDF, código, hash, QR y facultades institucionales, calculados y comprobados por el servidor.
4. Proporcionar acceso seguro al documento y verificación criptográfica. Los registros administrativos de firmas no acreditan firma válida.

Los datos ficticios se limitan a tests. El frontend no genera códigos ni hashes oficiales, no presenta un PDF inventado y no permite firmar en nombre de terceros.
