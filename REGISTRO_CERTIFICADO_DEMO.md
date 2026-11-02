# Registro guiado de certificados DEMO

`/certificaciones/certificados/nuevo` carga `FormularioCertificadoDemoComponent`, separado del formulario real. Se conservaron la URL, los guards y los permisos existentes: `emision.ver` en el grupo y `emision.crear` para el alta. No se ofrece un selector para habilitar escrituras reales desde esta demostración.

El código del formulario real `formulario-certificado.component.ts/html` y sus servicios no se modificó. Su componente continúa separado y la ruta existente de edición mantiene su configuración anterior. La integración futura del alta real requerirá un cambio explícito del componente cargado por la ruta, sin reutilizar referencias ficticias como datos del servidor.

## Recorrido

1. Elegir reconocimiento, participación o práctica.
2. Elegir uno de los dos registros ficticios del origen. El beneficiario se completa automáticamente y es de solo lectura.
3. Seleccionar el tipo DEMO compatible y una fecha válida.
4. «Revisar datos» muestra la confirmación, sin realizar ninguna operación de registro.
5. «Simular registro» construye una respuesta exitosa en memoria y muestra exactamente: **Registro simulado correctamente. No se guardaron datos en el servidor**.
6. «Volver a editar» conserva las selecciones; «Reiniciar formulario» y «Simular otro registro» limpian todos los campos y el resultado. «Volver al listado» conserva la ruta de certificados existente.

No se añade un certificado al listado estático. El resultado desaparece al salir o reiniciar; no hay persistencia ni modificaciones en los fixtures.

## Datos y validaciones

Los tres orígenes tienen fixtures en archivos separados, con nombres inventados y códigos `DEMO-*`. El catálogo de tipos también es local. Las referencias numéricas de fixtures son datos internos de simulación y nunca se muestran como campos técnicos ni se consultan en PostgreSQL.

Se reutiliza únicamente el tipo existente `PayloadEmision['certificados']`, sin modificar los modelos de Laravel. El payload local contiene `id_persona` derivado del beneficiario del registro, el tipo elegido, la fecha, los tres campos de origen y los campos de estado/notificación del contrato existente. Exactamente un origen es distinto de `null`.

La respuesta de demostración usa un envoltorio propio marcado con `modo: 'DEMO'`. No se genera un código de documento, un identificador de certificado, QR, PDF ni firma.

El formulario reactivo comprueba campos requeridos, fecha válida de calendario, pertenencia del registro al origen y compatibilidad del tipo. Cambiar el origen limpia registro, beneficiario y tipo. Alterar datos tras la revisión invalida la confirmación; al simular también se comprueba nuevamente el payload, incluso si hubo cambios sin emitir eventos de formulario.

El componente no inyecta `HttpClient`, `EmisionCertificadosService` ni servicios de persistencia. Los servicios de producción no importan los fixtures. Las comprobaciones institucionales de sesión de los guards permanecen vigentes; la ausencia de HTTP corresponde al formulario y su simulación.

## Comprobaciones

- Compilación Angular de producción: correcta, sin advertencias.
- TypeScript de aplicación y pruebas: correcto.
- Pruebas pertinentes de Emisión: **81 correctas en Chrome Headless**.
- Se comprueban los tres orígenes, cambio de catálogo, beneficiario automático, errores, fecha imposible, tipo incompatible, revisión, simulación por cada origen, mensaje de éxito, edición, reinicio y conservación del formulario real.
- Las pruebas usan `HttpTestingController` para exigir ausencia de solicitudes y espías de `HttpClient.post` y `Storage.setItem` para comprobar que no se llama a POST ni se persiste en almacenamiento web.
- `git diff --check`: correcto.

```powershell
npm.cmd run build
node node_modules/typescript/bin/tsc -p tsconfig.spec.json --noEmit
npm.cmd test -- --watch=false --browsers=ChromeHeadless --progress=false --include=src/app/pages/emision-certificados/**/*.spec.ts --include=src/app/core/services/emision-certificados/*.spec.ts
```

## Archivos creados

Dentro de `src/app/pages/emision-certificados/certificados/demo/`:

- `formulario-certificado-demo.component.ts`
- `formulario-certificado-demo.component.html`
- `formulario-certificado-demo.component.scss`
- `formulario-certificado-demo.component.spec.ts`
- `registro-certificado-demo.interface.ts`
- `registro-certificado-demo.fixtures.ts`
- `reconocimientos-registro-demo.fixtures.ts`
- `participaciones-registro-demo.fixtures.ts`
- `practicas-registro-demo.fixtures.ts`

También se crea este informe, `REGISTRO_CERTIFICADO_DEMO.md`.

Modificados en esta ampliación:

- `src/app/pages/emision-certificados/emision-certificados.routes.ts`: solo el componente cargado por `certificados/nuevo`.
- `src/app/pages/emision-certificados/emision-certificados.routes.spec.ts`: navegación y permiso del alta DEMO.
- `src/app/pages/emision-certificados/certificados/listar-certificados/listar-certificados.component.html`: texto informativo del enlace de alta.
- `CERTIFICADOS_DEMO.md`: documentación actualizada sobre el nuevo flujo.

No se modificaron Laravel, PostgreSQL, migraciones, JWT, guards, Sidebar, Header ni los otros módulos. Se preservaron los cambios previos del workspace. No se hizo commit ni push.
