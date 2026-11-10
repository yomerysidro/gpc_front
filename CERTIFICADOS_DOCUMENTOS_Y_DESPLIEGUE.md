# Certificados: documentos, verificación y despliegue

## Contratos comprobados

Se revisaron las rutas y las implementaciones locales de `CertificateDocumentController`, `CertificateDocumentGenerator`, `CertificationReadiness` y sus pruebas. Algunos documentos históricos del backend todavía indican que no existe PDF/verificación; prevalece el código actual. No se modificó ni ejecutó código Laravel, migraciones o consultas de PostgreSQL.

| Operación | API real | Comportamiento Angular |
|---|---|---|
| Catálogo | `GET /api/tipos-certificado/list` y `/detail/{id}` | Nombre dinámico del tipo, sin entrada manual ni ID fijo |
| Pendientes | `GET /api/certificaciones/pendientes` | Conserva origen, filtros y contexto |
| Beneficiarios | `GET /api/activity-session/{id}/beneficiarios?id_tipo_certificado={tipo}` | Lee `data.beneficiarios.data` y paginación de Laravel; nunca atribuye certificados de participación a una sesión |
| Documentos | `GET /api/certificados-documentos/list?id_certificado={id}` | Lista exclusivamente registros persistidos y conserva versiones |
| Generación provisional | `POST /api/certificados/{id}/generar-documento`, cuerpo `{}` | Solo se ofrece para un certificado persistido por participación, con permiso efectivo `emision.crear`; Laravel valida tipo, área y entorno |
| PDF privado | `GET /api/certificados-documentos/{id}/archivo` | Cookie HttpOnly, contexto autenticado y blob PDF validado; sin rutas de almacenamiento |
| Verificación pública | `GET /api/certificados/verificar/{code}` | Sin `auth/me`, marca administrativa ni credenciales cross-origin |
| PDF público | `url_documento` devuelta por la verificación | Solo si Laravel confirma registro, vigencia, integridad y `puede_ver_documento`; se valida correspondencia con el código |

La generación vigente devuelve `modo=desarrollo`, `oficial=false`, `puede_emitir=false` y `puede_firmar=false`. La UI lo indica y mantiene deshabilitada la emisión oficial. No habilita el CRUD genérico bloqueado por `ESCRITURA_EMISION_AUTORIZADA`. No existe un bypass de permisos por rol. Un POST puede recuperar un documento existente (`creado=false`) según Laravel; Angular no genera duplicados ni códigos propios.

## Componentes y funcionamiento

Se reutilizan GenerarEmitir, ListarCertificados, DetalleCertificado, VisorCertificado y ConsultarCertificado. Permanecen las dos bandejas, la vista independiente de beneficiarios y el asistente de cuatro pasos. El catálogo puede seleccionar automáticamente el único tipo compatible confirmado por la fila de pendientes; cuando hay varias alternativas, se elige en el catálogo. La evaluación final pertenece a Laravel.

`DocumentosDigitalesService` implementa generación, descarga y verificación. `VisorPdfComponent` es un visor reutilizable del archivo recuperado, no un módulo paralelo. Comprueba MIME y cabecera `%PDF-`, crea una URL blob local y la revoca al cambiar de documento o destruirse. La impresión y descarga actúan sobre ese PDF. No usa capturas HTML, rutas privadas, localStorage, QR aleatorios ni claves criptográficas.

La plantilla institucional conserva el escudo municipal real de `public/marca`, incorpora tipo/código en la parte superior derecha, identidad del beneficiario, documento autorizado, origen y fechas/lugar disponibles. No se inventan direcciones, funcionarios, sesiones ni firmas. La previsualización HTML está identificada como metadatos y no sustituye el PDF Laravel. No se encontró un documento de referencia adjunto en este turno ni un PDF de referencia en el repositorio; se conservó la identidad visual existente.

La ruta pública `/verificar/:codigo` y la consulta institucional reutilizan el mismo componente y contrato público. Un código no encontrado, un error de conexión y un certificado anulado/revocado son resultados distintos. Encontrar el registro o comprobar el hash no acredita una firma criptográfica ni una emisión oficial. La API actual no devuelve nombres/documentos de identidad públicamente: Angular no consulta endpoints administrativos para completar esos datos. Los PDF de desarrollo no están autorizados para descarga pública por Laravel.

## Configuración local

`src/environments/environment.ts`: `apiBaseUrl='/api'`. `proxy.conf.json` conserva el destino local existente. `ng serve` usa ese proxy. Los componentes no contienen URLs de localhost. La consulta pública usa un código real de 30 caracteres hexadecimales en minúsculas, tal como exige la ruta Laravel.

## Despliegue HTTPS

1. **Mismo origen:** conservar `apiBaseUrl='/api'` en `environment.production.ts`, compilar con `npm run build` y enrutar `/api/*` al backend mediante proxy inverso. `/verificar/*` debe llegar al router Angular/SSR, incluso tras una recarga; las rutas API no deben caer en el fallback HTML. Servir frontend y backend con HTTPS, preservando esquema/host reenviados solo desde proxies confiables.
2. **Subdominio API del mismo sitio:** configurar `apiBaseUrl` con la URL HTTPS completa terminada en `/api` en `environment.production.ts` y recompilar. Laravel debe autorizar el origen exacto del frontend mediante CORS con credenciales. Mantener la cookie HttpOnly, Secure y limitada al host del backend; no es necesario compartir el JWT con todo el dominio. Angular envía `withCredentials` exclusivamente en operaciones privadas. Las URLs relativas públicas devueltas como `/api/...` se resuelven contra la base API configurada.
3. **Dominios de sitios diferentes:** el frontend permite configurar otro origen, pero el backend actual construye el JWT con `SameSite=Strict`, dominio host-only y `Secure` fuera de `local`, en `JwtService::cookie`. **Cambiar `SESSION_SAME_SITE`, `SESSION_DOMAIN`, APP_URL y FRONTEND_URL no cambia esa cookie JWT.** La autenticación cross-site no puede resolverse solo desde Angular ni está operativa por cambiar environment. Dentro del alcance actual, usar el proxy inverso del mismo origen; una futura política cross-site requerirá un cambio backend autorizado, protección CSRF y pruebas reales. No se debilitó Strict ni se trasladó el token a JavaScript. Incluso `SameSite=None; Secure` depende de las restricciones del navegador sobre cookies de terceros.

Las solicitudes con credenciales requieren un origen CORS explícito, no `Access-Control-Allow-Origin: *`. Mantener `supports_credentials=true`; revisar OPTIONS y encabezados permitidos. No cachear respuestas PDF privadas ni la verificación; conservar los encabezados `private/no-store`, `nosniff` y las restricciones de acceso Laravel. La CSP de despliegue debe permitir el origen API en `connect-src` y los blobs PDF creados por la app en `frame-src`; no habilitar orígenes arbitrarios ni HTML del servidor como recurso confiable. Estos requisitos están descritos en [MDN CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS), [MDN Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie) y [seguridad Angular](https://angular.dev/best-practices/security).

### Variables Laravel a verificar al desplegar, sin modificarlas en esta entrega

- `APP_ENV=production`, `APP_URL=https://<host-backend>` y `FRONTEND_URL=https://<host-frontend>`.
- `CERTIFICATION_PUBLIC_VERIFICATION_BASE_URL=https://<dominio-publico-estable>/verificar`. Si está vacía, el generador usa `FRONTEND_URL/verificar`. El código y esa URL los asigna Laravel. Angular no dibuja ni reconstruye el QR.
- Conservar `JWT_SECRET` y revisar duración y rotación del JWT con la operación institucional. No incluirlo en Angular, bundles o documentación pública.
- Las banderas `CERTIFICATION_DEVELOPMENT_*` son exclusivamente de desarrollo autorizado. No habilitarlas automáticamente en producción para forzar la generación. El backend actual puede rechazar generación/descarga provisional en producción; es un bloqueo que el frontend conserva.

Un QR ya impreso contiene una URL inmutable dentro del PDF. Cambiar variables solo afecta generaciones posteriores: no reescribe el documento guardado. Conservar un dominio público estable o mantener una redirección HTTPS confiable del dominio anterior que preserve `/verificar/{codigo}` y el código íntegro. No regenerar silenciosamente PDF/hash/código existentes. Si el dominio anterior deja de estar bajo control institucional, un redirect nuevo no puede reparar los QR antiguos; se requiere el procedimiento institucional de reemisión. En producción la app rechaza enlaces de verificación HTTP o loopback recibidos como enlace de generación, y Laravel valida el destino al generar.

Un PDF de desarrollo cuyo QR apunta a localhost tampoco cambia al desplegar: localhost resuelve a la máquina de quien escanea. No puede repararse con una redirección desde el dominio público nuevo. Ese borrador no debe publicarse como certificado oficial; corresponde seguir el procedimiento de generación o reemisión institucional habilitado posteriormente.

## Bloqueos y límites reales

- Sin identidad persistente certificado–sesión, no hay preparación ni emisión independiente por sesión. Los beneficiarios siguen consultables.
- No se habilita firma criptográfica ni emisión oficial; los registros administrativos de firmas son evidencia distinta.
- El generador actual admite participación en actividad y tipos autorizados por Laravel. Prácticas y reconocimientos conservan sus procedimientos separados; Angular no los remapea a participación.
- Un documento no vigente, archivo ausente o hash inconsistente puede ser rechazado por Laravel con 409 aunque exista un registro. No se presenta un PDF sustituto.
- La UI mantiene los motivos reales y diferencia 401, 403, 409, 422, 404, 429, desconexión, error de generación y archivo inválido.

## Validación

Los contratos se prueban mediante respuestas HTTP controladas, incluidos blobs PDF y errores JSON binarios. No se añadieron fixtures a la aplicación real. Las pruebas cubren la separación de credenciales, identidad/código, rutas API configurables, estados públicos, navegación, bloqueo de emisión oficial y ciclo de vida de recursos PDF. Los logs de build y suite de esta entrega se guardan en `certificados-digitales-build.log` y `certificados-digitales-tests.log`.

Resultado final: TypeScript de aplicación y pruebas sin errores; build de producción completado; **838 pruebas Angular aprobadas**. El build informa avisos de presupuesto: bundle inicial de 519,36 kB frente a advertencia de 512 kB y estilos de pantallas existentes por encima de su umbral de advertencia. No se aumentaron los presupuestos para ocultarlos. `git diff --check` no informa problemas.

La generación, descarga y consulta con JWT de un registro real, los QR históricos y el funcionamiento de cookies bajo los dominios definitivos requieren validación de integración en ese entorno; no se emitieron documentos reales durante las pruebas automatizadas.

Se revisó la página pública del build de producción en Chrome headless con viewports reales de 390×844 y 1440×1000: `scrollWidth` coincidió con el ancho del viewport en ambos. Capturas: `artifacts/certificados-digitales/verificacion-movil.png` y `verificacion-escritorio.png`. No se añadieron datos de prueba a la aplicación para estas capturas.

## Archivos de esta entrega

- Nuevos contratos y servicios: `core/interfaces/emision-certificados/documento-digital.interface.ts`, `core/services/emision-certificados/documentos-digitales.service.ts`, `core/security/url-documental.ts`, con sus pruebas.
- Contrato ampliado: `core/interfaces/emision-certificados/certificacion-sesion.interface.ts`.
- Visor reutilizable nuevo: `pages/emision-certificados/compartidos/visor-pdf.component.ts` y sus pruebas.
- Plantilla existente: `compartidos/visor-certificado.component.{ts,html,scss}`.
- Asistente existente: `generar-emitir/generar-emitir.component.{ts,html,spec.ts}`.
- Detalle existente: `certificados/detalle-certificado/detalle-certificado.component.{ts,html}`.
- Listado existente: `certificados/listar-certificados/listar-certificados.component.html`.
- Consulta pública: `verificacion/verificacion-publica.component.ts` y sus pruebas.
- Consulta institucional reutilizada: `verificacion/consultar-certificado/consultar-certificado.component.{ts,html}`.
- Expectativas de rutas: `pages/emision-certificados/emision-certificados.routes.spec.ts`.
- Configuración documentada: `src/environments/environment.ts`, `environment.production.ts` y este documento.

Los caminos `core/` y `pages/` anteriores son relativos a `src/app/`. Se conservaron los cambios previos del espacio de trabajo; este listado no atribuye a esta entrega modificaciones anteriores.
