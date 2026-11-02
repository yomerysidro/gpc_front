# Gestión de Firmantes Municipales

## Ruta y causa corregida

El enlace «Firmas» de `src/app/components/sidebar/modulos-navegacion.ts` pertenece al grupo `certificaciones` y apunta a **`/certificaciones/firmas`**.

`app.routes.ts` incorpora las rutas de Emisión y excluye esta opción de las vistas temporales. En `emision-certificados.routes.ts`, el hijo vacío de `firmas` carga **`ListarFirmasComponent`**. La plantilla que mostraba el CRUD era **`firmas/listar-firmas/listar-firmas.component.html`**, porque importaba y montaba `<app-listado-emision recurso="firmas">`.

Se reemplazaron esa plantilla y su componente, retirando la importación y el uso de `ListadoEmisionComponent`. No había una pantalla alternativa de firmantes creada y desconectada. No fue necesario cambiar la URL, el Sidebar o el cargador de rutas: la implementación nueva está en el componente que ya carga la opción real.

## Pantalla conectada

- Icono de seguridad, título «Gestión de Firmantes Municipales», descripción institucional y botón «Registrar firmante», condicionado al permiso de creación.
- Resumen de credenciales y trabajadores vinculados, calculado con los registros recibidos, sin cifras ficticias.
- Grid responsive con tarjetas: cargo, nombre y área cuando están autorizados, estado del trabajador, referencia administrativa de la credencial y fecha registrada.
- Búsqueda local por nombre, cargo o área disponibles, filtro por estado del trabajador y paginación de nueve tarjetas. Se recorren las páginas reales de Laravel antes de la búsqueda local, para no limitarla a la primera página.
- Carga, falta de registros, filtros sin coincidencias, errores HTTP y restricciones de Gestión diferenciados.
- «Registrar firmante» y «Administrar credencial» abren un formulario específico dentro del diálogo existente; no abren el formulario CRUD genérico.
- La eliminación requiere permiso y confirmación. Los conflictos históricos 409 se muestran sin retirar la tarjeta.
- Las rutas existentes de asignación y firmas asociadas se conservan, con el enlace de firmas de documentos sujeto a `emision.ver`. Esas subpantallas no se modificaron.

La información presentada no declara firma válida, vencimiento o vigencia, porque Laravel no devuelve esos resultados en el contrato actual. «Trabajador activo/inactivo» representa exclusivamente `persona_trabajador.estado`; «Credencial registrada» indica existencia de su registro administrativo.

## APIs e información sensible

Se reutiliza **`EmisionCertificadosService`** y sus interfaces, sin añadir endpoints ni modificar sus métodos:

| Operación relativa a la API configurada | Uso |
| --- | --- |
| `GET firmas/list` | Metadatos de credenciales; se recorren todas sus páginas mediante `listarTodos`. |
| `GET person-workers/list` | Trabajador, cargo, estado, persona y área vinculados. |
| `GET persons/detail/{id}` | Nombre autorizado, reutilizando el método de lectura existente. |
| `GET areas/detail/{id}` | Área autorizada, reutilizando el método de lectura existente. |
| `POST firmas/create` | Registro de credencial con permiso `ponentes-firmantes.crear`. |
| `PATCH firmas/update/{id}` | Solo cambios introducidos, con permiso `ponentes-firmantes.editar`. |
| `DELETE firmas/delete/{id}` | Eliminación confirmada, con permiso `ponentes-firmantes.eliminar` y validación histórica de Laravel. |

El permiso de lectura de la ruta continúa siendo `ponentes-firmantes.ver`. JWT, interceptores y guards permanecen intactos.

El contenedor proyecta cada registro de firma a sus tres campos permitidos: `id_firma`, `id_persona_trabajador` y `fecha_firma`. Las tarjetas no reciben ni muestran rutas privadas, PFX, contraseñas cifradas, passphrases o hashes. El componente de tarjeta solo recibe datos y emite acciones; no realiza peticiones HTTP.

Personas y áreas se consultan una vez por ID durante cada carga. Después de un 403 de un recurso no se insiste con otros IDs de ese recurso. No se inventan nombres o áreas ni se desactivan permisos. La configuración actual de Laravel mantiene los ámbitos de Persona y Área en `null`; estos datos pueden aparecer restringidos hasta que exista una autorización institucional real.

El formulario de credenciales utiliza únicamente los campos reales de `SignatureData`. Laravel requiere un PFX que ya exista en almacenamiento privado; no hay endpoint de carga de archivo. Por eso no se simula un selector de archivo ni una carga de PFX. La referencia privada se introduce exclusivamente en el formulario administrativo, no se recupera ni se muestra un valor existente. La contraseña utiliza un input de tipo password. Ambos valores se limpian al finalizar la solicitud, también cuando falla. No se guardan en almacenamiento del navegador.

En edición, dejar esos campos vacíos conserva la credencial existente; no se reconstruyen secretos ocultos ni se envían campos vacíos para sobrescribirlos. Laravel valida el contenedor y sus dependencias. Registrar una credencial no firma documentos ni confirma su vigencia criptográfica.

## Verificación

- Compilación Angular de producción: correcta, sin advertencias en la compilación final.
- TypeScript de pruebas: correcto.
- **103 pruebas pertinentes correctas en Chrome Headless**, incluyendo Emisión y navegación del Sidebar.
- Una prueba navega desde el enlace real del Sidebar y comprueba la URL, el nuevo título y la ausencia de `app-listado-emision`, «Nuevo registro», «Filtrar por» y «Valor exacto».
- Pruebas de tarjetas, datos relacionados, permisos, 403 de Gestión, búsqueda, vacío, formulario específico, ausencia de secretos, POST/PATCH, errores 422 y conservación del registro ante 409 de eliminación.
- Tarjetas en un contenedor de 320 px sin desbordamiento horizontal.
- `git diff --check`: correcto.

Las pruebas HTTP emplean `HttpTestingController`: no se registraron, modificaron ni eliminaron credenciales reales durante la implementación. No se validó un flujo con una sesión real y una credencial privada del servidor; la autorización y los datos disponibles quedan determinados por Laravel.

```powershell
npm.cmd run build
node node_modules/typescript/bin/tsc -p tsconfig.spec.json --noEmit
npm.cmd test -- --watch=false --browsers=ChromeHeadless --progress=false --include=src/app/pages/emision-certificados/**/*.spec.ts --include=src/app/core/services/emision-certificados/*.spec.ts --include=src/app/components/sidebar/modulos-navegacion.spec.ts
```

## Archivos de esta corrección

Creados:

- `src/app/pages/emision-certificados/firmas/firmante-vista.interface.ts`
- `src/app/pages/emision-certificados/firmas/firmante-card/firmante-card.component.ts`
- `src/app/pages/emision-certificados/firmas/firmante-card/firmante-card.component.html`
- `src/app/pages/emision-certificados/firmas/firmante-card/firmante-card.component.scss`
- `src/app/pages/emision-certificados/firmas/formulario-firmante/formulario-firmante.component.ts`
- `src/app/pages/emision-certificados/firmas/formulario-firmante/formulario-firmante.component.html`
- `src/app/pages/emision-certificados/firmas/formulario-firmante/formulario-firmante.component.spec.ts`
- `src/app/pages/emision-certificados/firmas/listar-firmas/listar-firmas.component.scss`
- `src/app/pages/emision-certificados/firmas/listar-firmas/listar-firmas.component.spec.ts`
- `GESTION_FIRMANTES_MUNICIPALES.md`

Modificados:

- `src/app/pages/emision-certificados/firmas/listar-firmas/listar-firmas.component.ts`
- `src/app/pages/emision-certificados/firmas/listar-firmas/listar-firmas.component.html`
- `src/app/pages/emision-certificados/emision-certificados.routes.spec.ts` (solo pruebas)
- `src/app/components/sidebar/modulos-navegacion.spec.ts` (solo expectativas de pruebas)

No se modificaron Laravel, PostgreSQL, permisos, rutas, Sidebar o Header en ejecución, ni otros módulos. Se conservaron los cambios previos del workspace. No se hizo commit ni push.
