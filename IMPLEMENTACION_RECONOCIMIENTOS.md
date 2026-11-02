# Reconocimientos, visor y consulta de documentos

La ampliación vigente de las tarjetas y la integración de lectura con Gestión se documenta en [RECONOCIMIENTOS_INTEGRACION_GESTION.md](RECONOCIMIENTOS_INTEGRACION_GESTION.md). Incorpora `reconocimiento-card`, lecturas de personas y áreas con manejo de 403 y 59 pruebas pertinentes correctas. Sustituye las limitaciones de lectura de Gestión descritas en la integración inicial de este documento; los permisos siguen siendo decididos por Laravel.

Implementación exclusivamente Angular. Se inspeccionaron, en modo lectura, las rutas, controladores, Data y configuración de permisos de `../gpc_back`. No se modificaron Laravel ni PostgreSQL. No se hicieron commits ni push.

## Pantallas

| Ruta | Implementación |
| --- | --- |
| `/certificaciones/reconocimientos` | Tarjetas paginadas con título, descripción, motivo, fecha y estado recibidos de Laravel. Indicador de certificados asociados, sujeto a permiso. Filtros exactos de título, estado y trabajador. Búsqueda local por cargo o ID en el catálogo real de trabajadores. |
| `/certificaciones/reconocimientos/nuevo` | Formulario compartido existente, con selección de trabajador registrado. POST real; validaciones y errores por campo de Laravel. |
| `/certificaciones/reconocimientos/:id` | Detalle, trabajador relacionado cuando está autorizado, certificados y documentos asociados, y enlaces al historial y al visor. |
| `/certificaciones/reconocimientos/:id/editar` | Formulario compartido con PATCH de campos modificados. Laravel conserva la autoridad para rechazar cambios con dependencias históricas mediante 409. |
| `/certificaciones/certificados/:id` | Detalle existente ampliado con historial completo, firmas asociadas, disponibilidad de archivo explícitamente desconocida y acceso a cada documento. Si no hay documentos, muestra previsualización y código pendientes. |
| `/certificaciones/certificados/:id/documentos/:documentoId/visor` | Reutiliza el detalle y un visor independiente. Selecciona exclusivamente un documento del certificado consultado, sin sustituirlo por otra versión cuando no existe. |
| `/certificaciones/verificacion?codigo=...` | Consulta administrativa exacta del código del documento, con JWT y permiso. Distingue documento generado, anulado, no encontrado, error y estado indeterminado. No declara vigencia ni validez criptográfica. |
| `/verificar` y `/verificar/:codigo` | Página pública sin guards de sesión, sin servicios administrativos y sin solicitudes HTTP. Identifica la integración como pendiente y mantiene deshabilitada la consulta. |

Los enlaces antiguos de Reconocimientos bajo `/certificaciones/certificados/reconocimientos` se conservan mediante redirecciones. No se cambió el Sidebar, el Header ni los módulos de Actividades, Participantes o Asistencia. Solo se ajustaron los mocks y expectativas de las pruebas de navegación del Sidebar para las pantallas reales.

## Servicios e interfaces

Se reutilizan `EmisionCertificadosService`, `AuthService`, `authInterceptor`, `AUTHENTICATED_REQUEST`, `permissionGuard`, `FormularioEmisionComponent`, `PageTitleComponent` y los estilos compartidos existentes. No se añadió un servicio paralelo ni dependencias npm.

Interfaces reutilizadas: `Reconocimiento`, `CertificadoRow`, `CertificadoDocumento`, `CertificadoFirma`, `ConsultaCertificado`, `PaginaEmision`, `OpcionRelacion`, `PayloadEmision` y `ErrorApi`. Se añade `TrabajadorEmision` para los campos mínimos de relación y `FirmanteVista` para el cargo real disponible en el visor.

El servicio incorpora:

- `trabajadores()`: consulta autenticada a la operación real y proyección de campos necesarios, sin solicitar personas ni documentos de identidad.
- `listarTodos()`: recorre todas las páginas manteniendo los filtros. No entrega un historial parcial como completo si falla una página.

## Operaciones confirmadas en Laravel y conectadas

Todas las rutas siguientes son relativas a `environment.apiBaseUrl` y usan la autenticación existente.

| Operación | Uso | Permiso de lectura / escritura |
| --- | --- | --- |
| `GET reconocimientos/list` | Tarjetas; filtros exactos soportados por `RecognitionData` y paginación | `reconocimientos.ver` |
| `GET reconocimientos/detail/{id}` | Detalle, edición y contenido de reconocimiento del visor | `reconocimientos.ver` |
| `POST reconocimientos/create` | Registro sin generar códigos ni documentos desde Angular | `reconocimientos.crear`, además de lectura para la pantalla |
| `PATCH reconocimientos/update/{id}` | Solo cambios del formulario existente | `reconocimientos.editar`, además de lectura |
| `GET person-workers/list` | Relación `id_persona_trabajador → id_persona`, cargo y selección de trabajadores existentes | `ponentes-firmantes.ver` |
| `GET certificados/list?id_reconocimiento=...` | Indicador y certificados asociados al reconocimiento | `emision.ver` |
| `GET certificados/detail/{id}` | Metadatos reales del certificado | `emision.ver` |
| `GET tipos-certificado/detail/{id}` | Nombre real del tipo en el visor | `emision.ver` |
| `GET certificados-documentos/list?id_certificado=...` | Todas las versiones del documento con su propio código, estado, fecha y motivo | `emision.ver` |
| `GET certificados-documentos/list?codigo_verificacion=...` | Consulta administrativa del código exacto | `emision.ver` |
| `GET certificados-firmas/list?id_certificado_documento=...` | Firmas asociadas a cada versión | `emision.ver` |
| `GET firmas/detail/{id}` | Relación de firma con trabajador y cargo, cuando está autorizada | `ponentes-firmantes.ver` |
| `GET consultas-certificado/list?id_certificado_documento=...` | Historial administrativo existente; nunca se utiliza en la página pública | `emision.ver` |

El código de verificación se muestra en texto, sin campo editable. Procede del documento de Laravel y nunca se deriva del certificado ni se genera en Angular. No se ofrecen acciones para crear, eliminar o reemplazar documentos en estas pantallas.

## Límites concretos del backend inspeccionado

1. **Verificación pública:** no existe un endpoint público de autenticidad en las rutas Laravel inspeccionadas. Los recursos de documentos y consultas están bajo `auth.cookie`. Hace falta una operación pública con una respuesta de datos explícitamente autorizados, estados de documento no encontrado/anulado/vigente/indeterminado y errores de servicio. La validez criptográfica debe comunicarse de forma independiente del hallazgo del código.
2. **URL oficial y QR:** los entornos solo configuran la base de API; no existe una URL pública oficial de verificación confirmada. Hace falta confirmar y configurar esa URL junto con el contrato público antes de generar un QR. No se deduce del hostname del navegador ni se usa localhost.
3. **PDF oficial:** las rutas de `certificados-documentos` solo ofrecen CRUD de metadatos; `ruta_archivo` está oculta. Hace falta una operación de visualización/descarga autorizada vinculada a un documento concreto y una indicación de disponibilidad. Descargar PDF permanece deshabilitado; no se usan rutas privadas ni se convierte el borrador en un supuesto PDF oficial.
4. **Emisión y código:** el CRUD actual recibe `codigo_verificacion` y la ruta privada de un PDF existente. No hay una operación de emisión que genere el PDF y asigne automáticamente su código en el servidor. Esta implementación no utiliza ese CRUD para introducir códigos manuales ni crea códigos en Angular.
5. **Nombres del beneficiario y firmantes:** `person-workers/list` devuelve IDs y cargo, sin nombres. `Persona::class` y `Area::class` tienen ámbito `null` en `config/module_permissions.php`. La ampliación de las tarjetas ya consulta `persons/detail/{id}` y `areas/detail/{id}`, mostrando sus restricciones cuando Laravel devuelve 403. Hace falta autorizar estas lecturas en el backend para mostrar los nombres y áreas reales. Los nombres de firmantes en el visor continúan sujetos a la limitación de la integración inicial.
6. **Firma criptográfica:** las filas de `certificados-firmas` contienen relación, orden y fecha, pero no un resultado de validación criptográfica ni un estado de firma validado. No se muestran sellos de acreditación, firmas simuladas ni afirmaciones de firma válida.

El visor reutilizable diferencia el reconocimiento mediante sus datos de origen, y para participación/prácticas utiliza los metadatos y la descripción del origen existente sin introducir contenido de reconocimiento. Toda vista HTML lleva la advertencia de previsualización. Imprimir conserva esa advertencia, el código y el estado, y omite el resto de la pantalla. Está deshabilitado para documentos anulados y mientras se consultan firmas. Los hashes internos se retiraron de las vistas administrativas de detalle y consulta.

## Verificaciones

- Compilación final de producción mediante `npm.cmd run build`: correcta, sin advertencias, incluyendo el ajuste de impresión.
- Pruebas en Chrome Headless del submódulo, servicio HTTP y navegación: **49 correctas**. Cubren permisos y rutas, acceso público sin sesión ni solicitudes privadas, tarjetas y asociaciones, POST del reconocimiento y errores 422, filtros reales, paginación completa del historial, errores 403/404/503, selección por versión, documento anulado/inexistente, ausencia de código, bloqueo de PDF, impresión preliminar y escape de HTML procedente del API.
- Suite general ejecutada: **94 correctas y 18 fallidas**. Se observaron expectativas de URLs `/api/...` codificadas en pruebas ajenas al submódulo (roles, usuarios y arquitectura/autenticación), incompatibles con la base de desarrollo `http://localhost:8000/api`. No se alteraron esos módulos para cambiar este resultado.
- Petición real de lectura a Laravel en `GET /api/reconocimientos/list`: **401 sin sesión**, confirmando que el servidor está activo y exige autenticación. No se contó con una sesión institucional autorizada en esta ejecución para validar registros reales extremo a extremo. Las pruebas HTTP utilizan fixtures exclusivamente de test y no crean ni modifican registros en Laravel.
- `git diff --check`: correcto.

Comando de pruebas focalizadas:

```powershell
npm.cmd test -- --watch=false --browsers=ChromeHeadless --progress=false --include=src/app/pages/emision-certificados/**/*.spec.ts --include=src/app/core/services/emision-certificados/*.spec.ts --include=src/app/components/sidebar/modulos-navegacion.spec.ts
```

## Archivos de esta implementación

Nuevos:

- `src/app/pages/emision-certificados/reconocimientos/detalle-reconocimiento/detalle-reconocimiento.component.ts`
- `src/app/pages/emision-certificados/reconocimientos/detalle-reconocimiento/detalle-reconocimiento.component.html`
- `src/app/pages/emision-certificados/reconocimientos/listar-reconocimientos/listar-reconocimientos.component.spec.ts`
- `src/app/pages/emision-certificados/compartidos/visor-certificado.component.ts`
- `src/app/pages/emision-certificados/compartidos/visor-certificado.component.html`
- `src/app/pages/emision-certificados/compartidos/visor-certificado.component.scss`
- `src/app/pages/emision-certificados/compartidos/visor-certificado.component.spec.ts`
- `src/app/pages/emision-certificados/certificados/detalle-certificado/detalle-certificado.component.spec.ts`
- `src/app/pages/emision-certificados/verificacion/verificacion-publica.component.ts`
- `IMPLEMENTACION_RECONOCIMIENTOS.md`

Modificados respecto del estado al comenzar esta tarea (se conservaron los cambios que ya existían):

- `src/app/app.routes.ts`
- `src/app/core/interfaces/emision-certificados/emision-certificados.interface.ts`
- `src/app/core/services/emision-certificados/emision-certificados.service.ts`
- `src/app/core/services/emision-certificados/emision-certificados.service.spec.ts`
- `src/app/pages/emision-certificados/emision-certificados.routes.ts`
- `src/app/pages/emision-certificados/emision-certificados.routes.spec.ts`
- `src/app/pages/emision-certificados/reconocimientos/listar-reconocimientos/listar-reconocimientos.component.ts`
- `src/app/pages/emision-certificados/reconocimientos/listar-reconocimientos/listar-reconocimientos.component.html`
- `src/app/pages/emision-certificados/reconocimientos/formulario-reconocimiento/formulario-reconocimiento.component.ts`
- `src/app/pages/emision-certificados/compartidos/formulario-emision.component.ts`
- `src/app/pages/emision-certificados/compartidos/formulario-emision.component.html`
- `src/app/pages/emision-certificados/compartidos/formulario-emision.component.spec.ts`
- `src/app/pages/emision-certificados/compartidos/listado-emision.component.html`
- `src/app/pages/emision-certificados/compartidos/emision.scss`
- `src/app/pages/emision-certificados/certificados/detalle-certificado/detalle-certificado.component.ts`
- `src/app/pages/emision-certificados/certificados/detalle-certificado/detalle-certificado.component.html`
- `src/app/pages/emision-certificados/certificados/listar-certificados/listar-certificados.component.html`
- `src/app/pages/emision-certificados/verificacion/consultar-certificado/consultar-certificado.component.ts`
- `src/app/pages/emision-certificados/verificacion/consultar-certificado/consultar-certificado.component.html`
- `src/app/components/sidebar/modulos-navegacion.spec.ts` (solo pruebas)
- `src/styles.scss` (solo reglas de impresión en esta tarea)
