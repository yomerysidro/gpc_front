# Portal público de certificados

## Portal unificado — actualización

`/portal-certificados` es la única interfaz. `/verificar/{codigo}` y `/verificar?codigo=...` redirigen a `/portal-certificados?codigo=...`, preservando los QR impresos. Se selecciona código, se consulta automáticamente y se abre el PDF autorizado debajo de las tarjetas, sin ocultar pestañas ni formulario.

La recuperación de sesión termina antes de montar la consulta, con un límite de diez segundos y acceso anónimo si falla. Así no se destruye una búsqueda al incorporar el contenedor administrativo. Errores públicos, cambios de resultados y rechazos del PDF conservan la pestaña y los valores ingresados.

La vigencia documental y la integridad se separan de la publicación. Un registro vigente e íntegro muestra «Certificado registrado y verificado» incluso si el archivo es privado. Anulación, revocación o integridad fallida impiden ese resultado. No se exponen estados internos ni se atribuye firma criptográfica o emisión oficial.

Todas las filas devueltas por DNI se muestran; las acciones de PDF requieren publicación y URL pública del mismo código. Descargar usa `?archivo=1&descargar=1`. El servidor vuelve a autorizar cada acceso. Un rechazo conserva los datos de la tarjeta y retira las acciones del PDF. La fecha de generación se etiqueta como fecha del documento; si DNI solo devuelve fecha de sesión se usa esa etiqueta específica.

Los apartados siguientes conservan antecedentes de integración; esta actualización sustituye sus referencias anteriores a filtrado de filas, pantallas de verificación independientes y descarga mediante blob.

## Contrato integrado

Corrección del formulario: `(ngSubmit)` no se emitía porque no había NgForm ni FormGroupDirective; ReactiveFormsModule con controles individuales no proporciona esa directiva al form. Se utiliza ahora submit nativo con preventDefault para impedir recargas y ejecutar el criterio activo. Las pruebas pulsan Consultar con y sin sesión y verifican el POST y las tarjetas; las anteriores llamaban a buscar() directamente.

Comprobación HTTP real local autorizada: scripts/verificar-portal-http-real.cjs seleccionó en memoria un DNI de documento confirmado mediante una transacción PostgreSQL READ ONLY con rollback, sin imprimir ni persistir datos personales o credenciales. Laravel en 127.0.0.1:8000 y el proxy Angular en localhost:4200 devolvieron ambos HTTP 200, contrato válido y un certificado disponible. Las peticiones no enviaron JWT ni cookies. El PDF tenía pdf_publicado:false: no se intentó descargarlo. Esto no garantiza resultados de otros DNI ni otros entornos. La consulta administrativa real de navegador no se automatizó; su clic, layout y conservación de sesión se comprobaron mediante pruebas Angular con estado autenticado. Ambos layouts usan la misma API pública comprobada. Las 127 pruebas pasaron y el build generó artefactos con advertencias de tamaño.

Fuente: gpc_back/docs/certificate-stage-a-api-contract.md, sección Consulta pública por DNI; comprobado también en routes/api.php y PublicCertificateLookup.

POST /api/portal-certificados/consultar-dni recibe exclusivamente { "dni": "<ocho dígitos>" }. Angular lo envía como cadena para conservar ceros iniciales, sin JWT, con withCredentials:false y transferCache:false. No se incluyen parámetros de URL, ni se guarda el DNI en almacenamiento o logs. No se invoca el alias compatible /api/certificados/consulta-dni.

La respuesta real es { success, message, data: { certificados: [...] } }. Cada documento contiene referencia_publica (HMAC), codigo_verificacion, origen, tipo_certificado, actividad, sesion, fecha_sesion, estado_disponibilidad, disponible_rrhh, pdf_publicado y url_documento. PortalCertificadosService valida esta estructura y proyecta exclusivamente los datos necesarios. La referencia se utiliza como clave de la tarjeta; no se muestran identificadores internos ni se consultan catálogos privados.

Cada documento con disponible_rrhh:true aparece en una tarjeta independiente. No se exige FIRMADO ni EMITIDO. Un HTTP 200 con certificados:[] es un estado vacío normal. Un error HTTP, timeout o respuesta incompleta se muestra como error de consulta, nunca como ausencia de certificados. No se reintenta automáticamente el POST ni se realizan consultas masivas. Laravel aplica los límites documentados por IP/DNI y devuelve 429.

## Publicación del PDF

La disponibilidad administrativa no implica publicación del archivo. La tarjeta presenta sus datos incluso si pdf_publicado:false y url_documento:null; en ese caso informa: "El documento requiere autorización para visualizarse".

Solo pdf_publicado:true junto con la URL pública exacta del mismo código permite Ver certificado. La ruta admitida es GET /api/certificados/verificar/{codigo}?archivo=1, relativa o sobre la base API configurada. No se usan rutas privadas de Gerencia, RR. HH. ni documentos administrativos como alternativa. La autorización se vuelve a comprobar en el servidor cuando se solicita el archivo. Un rechazo no permite descargarlo.

El visor utiliza PdfContinuoComponent con PDF.js ya instalado. Descarga y visualización usan los mismos bytes PDF originales validados por DocumentosDigitalesService.archivoPublico. No se regeneran PDF ni QR. La descarga se ofrece después de recuperar correctamente el archivo público. La consulta por código conserva GET /api/certificados/verificar/{codigo}; las URL /verificar y /verificar/:codigo y los QR históricos no cambian.

## Sesión y presentación

/portal-certificados sigue fuera de los guards privados. El mismo componente de consulta sirve a ambos públicos. AuthService.isAuthenticated decide si se conserva el layout administrativo completo o se muestra el encabezado institucional sin sidebar. La consulta documental no cambia la identidad ni navega a otra ruta.

Al abrir o recargar sin identidad cargada, el contenedor comprueba la sesión existente mediante GET /api/auth/me en segundo plano (límite de 10 segundos). La página pública se presenta inmediatamente, sin bloquear con "Abriendo Portal Público de Certificados". Un 401 de identidad permite continuar como visitante sin redirección al login. Con sesión ya autenticada no se repite esta comprobación. Las búsquedas, errores públicos, resultados, visor y regreso no vuelven a comprobar la sesión ni la cierran.

El contenido conserva el ancho completo y los estilos responsive del portal. Al regresar del visor permanece la lista consultada. Nueva consulta y el cambio de pestaña cancelan consultas anteriores, borran resultados y limpian los datos del formulario y las URL blob.

## Límites de la validación local

Las pruebas Angular verifican el contrato HTTP, múltiples resultados, estados vacíos y errores, independencia de las búsquedas, bloqueo de PDF privado y conservación del sidebar. Sus respuestas de prueba son fixtures exclusivamente de pruebas; la aplicación no contiene certificados simulados. La disponibilidad e integridad reales y la política de publicación las determina Laravel. No se ejecutan consultas con DNI reales ni cambios en Laravel, PostgreSQL o archivos documentales desde esta entrega frontend.

Validación de la unificación: TypeScript app/spec correcto; suite completa de 1310 pruebas aprobada, seguida de 59 pruebas de portal/QR sobre el ajuste final de sesión, también aprobadas. Build final completado con advertencias de presupuesto. Evidencia: portal-unificado-suite-final.log, portal-unificado-focused-final.log y portal-unificado-build-final.log. Esta entrega no ejecutó consultas contra datos reales ni modificó backend, base de datos, PDFs o QR.