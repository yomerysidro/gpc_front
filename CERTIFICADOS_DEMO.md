# Listado y previsualización DEMO de certificados

La ruta `/certificaciones/certificados` muestra tres ejemplos estáticos: reconocimiento, participación y prácticas. Cada tarjeta utiliza un nombre inventado identificado como DEMO, una fecha ficticia, un código `DEMO-*` y el estado **DEMO — SIN VALIDEZ OFICIAL**.

La búsqueda por beneficiario o código y el filtro por tipo funcionan localmente, sin solicitudes HTTP. La búsqueda no distingue mayúsculas ni tildes. Limpiar restablece los tres ejemplos.

## Visor y navegación

«Ver certificado» abre el modo de demostración del visor compartido mediante un parámetro de consulta en la misma ruta:

```text
/certificaciones/certificados?demo=DEMO-REC-001
/certificaciones/certificados?demo=DEMO-PAR-002
/certificaciones/certificados?demo=DEMO-PRA-003
```

«Volver al listado» retira el parámetro y conserva los filtros mientras se mantiene la misma instancia de pantalla. Un código DEMO inexistente muestra un aviso sin consultar Laravel.

El visor reutiliza el escudo existente y presenta el contenido propio de cada tipo, con avisos DEMO visibles en cabecera, contenido y pie. Las firmas son espacios vacíos y el QR es únicamente un recuadro de texto no escaneable. No se crean archivos, firmas ni códigos funcionales. Imprimir y Descargar PDF están deshabilitados. El documento DEMO también se oculta mediante estilos al imprimir desde el navegador.

No se modificaron las definiciones de rutas, JWT, guards, Sidebar, Header, servicios HTTP ni los componentes de Reconocimientos. El visor conserva su presentación anterior cuando recibe datos reales en lugar del input `demostracion`; esa compatibilidad se cubre con las pruebas existentes.

«Nuevo certificado» conserva `/certificaciones/certificados/nuevo` y ahora carga un formulario DEMO guiado independiente, con revisión y simulación local sin HTTP ni persistencia. El formulario real y sus servicios se conservan intactos como componentes separados. El recorrido y sus archivos están documentados en [REGISTRO_CERTIFICADO_DEMO.md](REGISTRO_CERTIFICADO_DEMO.md).

## Separación de datos

`certificados-demo.fixtures.ts` contiene todos los datos ficticios y solo se importa desde la página de demostración. `CertificadoDemostracion` es un modelo de presentación independiente de los DTO y payloads de Laravel. No se inventaron IDs numéricos, hashes o relaciones de backend para adaptar los ejemplos al visor.

Los servicios de producción no importan los fixtures. Para la integración posterior, se podrá proporcionar un modelo visual adaptado desde las respuestas reales, conservando la distribución de las tarjetas; el modo y las advertencias DEMO deben permanecer asociados exclusivamente a datos de demostración.

Las comprobaciones de sesión y permisos existentes siguen aplicándose al acceso administrativo. La ausencia de HTTP indicada aquí corresponde al listado, filtros y visor DEMO, no al funcionamiento de esos guards ni al formulario real de alta.

## Verificación

- `npm.cmd run build`: correcto, sin advertencias.
- `node node_modules/typescript/bin/tsc -p tsconfig.spec.json --noEmit`: correcto.
- **68 pruebas pertinentes correctas en Chrome Headless**, incluyendo la presentación real preexistente del visor.
- Las pruebas DEMO verifican carga de tres tarjetas, búsqueda por nombre/código, filtros combinados, estado vacío, los tres tipos de vista previa, regreso con filtros conservados, código inexistente, botones deshabilitados y ausencia de solicitudes HTTP.
- Comprobación de tarjetas y visor en un contenedor de 320 px: sin desbordamiento horizontal.
- Navegación bajo las rutas y guards reales: acceso DEMO y conservación del componente real de Nuevo certificado.
- `git diff --check`: correcto.

Comando de pruebas:

```powershell
npm.cmd test -- --watch=false --browsers=ChromeHeadless --progress=false --include=src/app/pages/emision-certificados/**/*.spec.ts --include=src/app/core/services/emision-certificados/*.spec.ts
```

## Archivos creados

- `src/app/pages/emision-certificados/certificados/demo/certificados-demo.fixtures.ts`
- `src/app/pages/emision-certificados/compartidos/certificado-demostracion.interface.ts`
- `src/app/pages/emision-certificados/certificados/listar-certificados/listar-certificados.component.scss`
- `src/app/pages/emision-certificados/certificados/listar-certificados/listar-certificados.component.spec.ts`
- `CERTIFICADOS_DEMO.md`

## Archivos modificados en esta tarea

- `src/app/pages/emision-certificados/certificados/listar-certificados/listar-certificados.component.ts`
- `src/app/pages/emision-certificados/certificados/listar-certificados/listar-certificados.component.html`
- `src/app/pages/emision-certificados/compartidos/visor-certificado.component.ts`
- `src/app/pages/emision-certificados/compartidos/visor-certificado.component.html`
- `src/app/pages/emision-certificados/compartidos/visor-certificado.component.scss`
- `src/app/pages/emision-certificados/emision-certificados.routes.spec.ts` (solo pruebas de navegación; ninguna ruta fue modificada)

Los cambios que ya existían en el workspace se conservaron. No se modificaron Laravel ni PostgreSQL. No se hizo commit ni push.
