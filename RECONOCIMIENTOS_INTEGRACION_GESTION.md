# Reconocimientos e integración de lectura con Gestión

La pantalla `/certificaciones/reconocimientos` reutiliza las rutas, autenticación, permisos, formulario reactivo y servicio de Emisión existentes. No depende de las pantallas Angular del Módulo 2 y no registra personas, trabajadores, practicantes, áreas ni documentos personales.

## Comportamiento implementado

- Tarjetas institucionales azules, doradas y blancas mediante `ReconocimientoCardComponent` (`app-reconocimiento-card`). Solo recibe datos y permisos de presentación; no inyecta servicios HTTP ni autenticación.
- La página contenedora consulta y relaciona reconocimientos, trabajadores, personas, áreas, certificados y documentos. Muestra nombre y área exclusivamente cuando las APIs autorizan su lectura. El cargo procede del trabajador registrado.
- Búsqueda con filtros reales exactos de título, estado, fecha y trabajador. La búsqueda por cargo o ID filtra el catálogo de trabajadores existentes. No se envía un parámetro de búsqueda libre inexistente en Laravel.
- Botón «Registrar reconocimiento» y formulario reactivo compartido con trabajador existente, título (máximo 150), descripción y motivo (máximo 500), fecha y estado (cadena de máximo 30). Laravel no define un enum de estados; no se inventó uno.
- Validación de selección contra el catálogo autorizado para nuevos reconocimientos o cambios de trabajador. El formulario no contiene acciones de alta de Gestión. Conserva POST, PATCH de campos modificados y errores 422/409 reales del backend.
- Paginación con los metadatos devueltos por Laravel. Estados de carga, lista vacía, falta de permisos, relación inexistente y error HTTP diferenciados.
- Estado activo/inactivo de cada certificado y códigos de sus documentos, incluyendo documentos anulados. No se confunde el ID del reconocimiento con el del certificado o documento. En las tarjetas se muestran hasta tres versiones por certificado y se enlaza al historial completo existente.
- «Ver certificado» permanece deshabilitado porque no existe un endpoint autorizado del PDF oficial. El enlace «Detalle del certificado» consulta la pantalla administrativa existente y no se presenta como apertura de un PDF oficial. No se ofrece «Firmar y emitir», ni se inventan QR, firmas o archivos.

## Contratos reales inspeccionados

Se revisaron `routes/api.php`, `config/module_permissions.php`, `RecognitionData`, `Person_WorkerData`, `PersonaData`, `AreaData`, `CertificateData`, `CertificateDocumentData`, `CertificateSignatureData`, sus controladores y el middleware de autorización. Laravel y PostgreSQL no fueron modificados.

| API relativa a `environment.apiBaseUrl` | Uso y autorización |
| --- | --- |
| `GET reconocimientos/list` | Listado y filtros exactos; `reconocimientos.ver`. |
| `GET reconocimientos/detail/{id}` | Edición y detalle existentes; `reconocimientos.ver`. |
| `POST reconocimientos/create` | Registro; `reconocimientos.crear`, además de acceso de lectura a la pantalla. |
| `PATCH reconocimientos/update/{id}` | Edición existente; `reconocimientos.editar`. Laravel decide sobre dependencias históricas. |
| `GET person-workers/list` | Catálogo completo existente, no paginado. Requiere `ponentes-firmantes.ver`; aporta `id_persona_trabajador`, `id_persona`, `id_area`, cargo y estado. |
| `GET persons/detail/{id}` | Lectura de la persona relacionada. Se conservan solo ID, nombres y apellidos. El permiso lo decide Laravel; actualmente el ámbito de `Persona` está en `null` y deniega el acceso. |
| `GET areas/detail/{id}` | Lectura del área relacionada. Se conservan solo ID y nombre. Actualmente el ámbito de `Area` está en `null` y deniega el acceso. |
| `GET certificados/list?id_reconocimiento=...` | Certificados de cada reconocimiento, con todas las páginas; `emision.ver`. |
| `GET certificados-documentos/list?id_certificado=...` | Documentos y códigos de cada certificado, con todas las páginas; `emision.ver`. |
| `GET certificados-firmas/list?id_certificado_documento=...` | Contrato existente revisado: relación, fecha y orden de firmas; no contiene un resultado de validación criptográfica. La tarjeta no hace esta consulta porque no necesita esas filas para presentar estados y códigos ni puede inferir una firma válida de ellas. |

Relaciones respetadas:

```text
reconocimiento.id_persona_trabajador -> persona_trabajador.id_persona_trabajador
persona_trabajador.id_persona -> persona.id_persona
persona_trabajador.id_area -> area.id_area
certificado.id_reconocimiento -> reconocimiento.id_reconocimiento
certificado_documento.id_certificado -> certificado.id_certificado
```

## Solicitudes y protección de datos

Se amplía `EmisionCertificadosService`; no se introduce un servicio paralelo de Gestión. Todas las lecturas nuevas utilizan el contexto de solicitud autenticada ya existente. No se cambiaron JWT, interceptores, guards ni claves de permisos.

La página consulta personas y áreas solo para trabajadores referenciados por los reconocimientos de la página cargada. No descarga el listado general de personas ni documentos de identidad. Las respuestas se proyectan a campos mínimos para evitar conservar teléfonos, correo, dirección u otros datos ajenos a la tarjeta.

El catálogo de trabajadores se reutiliza durante la vida del componente. Personas y áreas se consultan una vez por ID y se reutilizan al buscar o paginar. Después de un 403 del mismo recurso no se insiste con otros IDs: se presenta «acceso restringido». No se prueban otras rutas ni se otorgan permisos en Angular. «Actualizar relaciones» permite reintentar explícitamente, vaciando estas cachés. No hay cachés persistentes ni almacenamiento en el navegador.

Las consultas de certificados se limitan a tres reconocimientos concurrentes. Los documentos también se agrupan por certificado para evitar duplicados y conservar los estados parciales: un error documental no se interpreta como ausencia de documento.

## Pendientes concretos

1. Gestión debe contar con autorización institucional real para la lectura de personas y áreas, o proporcionar una proyección autorizada equivalente. La configuración actual `Persona::class => null` y `Area::class => null` deniega estas lecturas. El frontend ya consume las rutas existentes y muestra los 403, pero no modifica esa configuración ni inventa permisos como `personas.ver` o `areas.ver`.
2. El usuario necesita el permiso vigente de trabajadores (`ponentes-firmantes.ver`) para seleccionar uno desde el formulario. Sin ese catálogo no se permite crear el reconocimiento con un trabajador arbitrario.
3. Falta una operación autorizada que entregue el documento oficial de un `certificado_documento` concreto. El CRUD de metadatos oculta `ruta_archivo` y no incluye una URL autorizada ni descarga de PDF. Por eso no se habilita «Ver certificado».
4. No existe una operación real de emisión y firma criptográfica en los contratos revisados; tampoco un resultado criptográfico verificable en las firmas asociadas. No se ofrece esa acción ni se declara «Firmado digitalmente».

Estas dependencias son de Laravel y sus permisos, no de la finalización de las pantallas Angular de Gestión.

## Verificación

- `npm.cmd run build`: compilación correcta, sin advertencias.
- `node node_modules/typescript/bin/tsc -p tsconfig.spec.json --noEmit`: correcto.
- **59 pruebas pertinentes correctas en Chrome Headless**, con tarjetas, relaciones, permisos, búsqueda, paginación, registro válido, errores de validación, documentos anulados y estados sin datos. La tarjeta se prueba sin proporcionar `HttpClient`.
- `git diff --check`: correcto.
- Lectura real de `GET /api/reconocimientos/list` sin sesión: HTTP 401. No se dispone de una sesión institucional autorizada en esta ejecución para validar nombres o registros reales de extremo a extremo. Los fixtures de las pruebas solo se utilizan con `HttpTestingController`; no se insertaron datos en Laravel.

Comando de pruebas:

```powershell
npm.cmd test -- --watch=false --browsers=ChromeHeadless --progress=false --include=src/app/pages/emision-certificados/**/*.spec.ts --include=src/app/core/services/emision-certificados/*.spec.ts
```

## Archivos de esta ampliación

Creados:

- `src/app/pages/emision-certificados/reconocimientos/components/reconocimiento-card/reconocimiento-card.component.ts`
- `src/app/pages/emision-certificados/reconocimientos/components/reconocimiento-card/reconocimiento-card.component.html`
- `src/app/pages/emision-certificados/reconocimientos/components/reconocimiento-card/reconocimiento-card.component.scss`
- `src/app/pages/emision-certificados/reconocimientos/components/reconocimiento-card/reconocimiento-card.component.spec.ts`
- `src/app/pages/emision-certificados/reconocimientos/reconocimiento-vista.interface.ts`
- `src/app/pages/emision-certificados/reconocimientos/listar-reconocimientos/listar-reconocimientos.component.scss`
- `RECONOCIMIENTOS_INTEGRACION_GESTION.md`

Modificados respecto del estado al iniciar esta ampliación:

- `src/app/pages/emision-certificados/reconocimientos/listar-reconocimientos/listar-reconocimientos.component.ts`
- `src/app/pages/emision-certificados/reconocimientos/listar-reconocimientos/listar-reconocimientos.component.html`
- `src/app/pages/emision-certificados/reconocimientos/listar-reconocimientos/listar-reconocimientos.component.spec.ts`
- `src/app/pages/emision-certificados/reconocimientos/formulario-reconocimiento/formulario-reconocimiento.component.html`
- `src/app/pages/emision-certificados/compartidos/formulario-emision.component.ts` (validación limitada a Reconocimientos)
- `src/app/pages/emision-certificados/compartidos/formulario-emision.component.html` (presentación limitada a Reconocimientos)
- `src/app/pages/emision-certificados/compartidos/formulario-emision.component.spec.ts`
- `src/app/core/interfaces/emision-certificados/emision-certificados.interface.ts`
- `src/app/core/services/emision-certificados/emision-certificados.service.ts`
- `src/app/core/services/emision-certificados/emision-certificados.service.spec.ts`
- `IMPLEMENTACION_RECONOCIMIENTOS.md` (referencia a esta ampliación)

Se conservaron los cambios que ya existían en el workspace. Esta ampliación no modifica rutas, Header, Sidebar, pantallas de Gestión, Actividades, Participantes o Asistencia, ni estilos globales. No se hizo commit ni push.
