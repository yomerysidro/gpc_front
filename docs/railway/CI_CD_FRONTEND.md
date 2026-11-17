# CI y despliegue manual del frontend en Railway

## Arquitectura y requisitos

Angular 18.2 compila SSR con el builder de aplicación. Se conserva Node 22 y el Dockerfile existente de dos etapas. El build produce `dist/gpc_front/browser` y `dist/gpc_front/server/server.mjs`; Express sirve archivos y renderiza rutas. Railway inyecta `PORT` (4000 localmente) y Node escucha en `0.0.0.0`. `/healthz` comprueba el proceso, no Laravel. Angular 18 está fuera de soporte y debe actualizarse por separado.

Con Node 22 y Chrome/Chromium:

```sh
npm ci
npx tsc --project tsconfig.app.json --noEmit
npx tsc --project tsconfig.spec.json --noEmit
npm test -- --watch=false --browsers=ChromeHeadless
npm run build -- --configuration production
npm run serve:ssr:gpc_front
docker build -t gpc-frontend .
docker run --rm -p 4000:4000 -e BACKEND_ORIGIN=https://ORIGEN-REAL-DEL-BACKEND gpc-frontend
```

Sustituir el marcador por el dominio real, sin `/api`. Desarrollo usa `npm start` y el proxy local existente. No usar `ng serve` en producción.

## Laravel y cookies

El navegador sigue usando `/api`. Express reenvía esa ruta y query al origen HTTPS fijo `BACKEND_ORIGIN`, incluyendo cookies y respuestas PDF. Se necesita porque el contenedor Railway no incluye el Nginx de Compose. Así se conserva el mismo origen del frontend y el token no queda accesible a JavaScript. Laravel debe aceptar el host y emitir cookies `HttpOnly`, `Secure` y `Path` adecuados; no fijar `Domain` al dominio separado del backend. Comprobar `SameSite`, CORS y CSRF según la configuración real de Laravel. Configurar en Laravel la URL pública del frontend para enlaces de correo, recuperación de contraseña y QR cuando corresponda, y verificar los destinos generados. Los contratos y el backend no fueron cambiados.

Configurar `BACKEND_ORIGIN` en el servicio frontend con el origen HTTPS real de Laravel, sin ruta, credenciales, query ni fragmento. Railway proporciona `PORT`. Sin un origen válido `/api` devuelve 503, aunque `/healthz` responda 200. Validar login, logout, cookies, permisos, consultas por DNI/código/QR y PDF con el backend real. No guardar secretos en el frontend ni en Git.

## CI y aprobación

`frontend-ci.yml` valida la política de ramas, `npm ci`, TypeScript, pruebas Angular, build de producción y Docker; no publica imágenes ni despliega. Se ejecuta en pushes de `main`, `development`, `dev-*`, `dev/**`, `feature/**`, PR hacia `main`/`development` y manualmente. El flujo existente promueve `development` a `main`. Activar los rulesets adecuados y exigir `Flujo de ramas`, `TypeScript y pruebas` y `Build de producción`. Los archivos de rulesets no los activan por sí solos.

`frontend-deploy-railway.yml` solo acepta `workflow_dispatch` en `main`: exige que la rama esté protegida, que el SHA sea el HEAD actual y que el último CI **push** del mismo SHA haya terminado correctamente. Serializa despliegues y usa Railway CLI 5.71.0 con el Dockerfile del checkout. `railway.json` selecciona Dockerfile y `/healthz`. Railway comprueba salud antes de activar la versión; luego el workflow consulta el dominio público y registra SHA y resultado. La comprobación HTTP no demuestra por sí sola el SHA servido: confirmar el mensaje y estado en Railway. Si falla después de enviar el despliegue, Railway podría haberlo activado: investigar o revertir.

En GitHub, restringir el entorno `production` a `main`. Si el plan y visibilidad admiten **Required reviewers**, configurarlos en Settings → Environments → production como protección adicional y revisar la opción de impedir autoaprobación. De lo contrario, `workflow_dispatch` por alguien con permiso de escritura es la autorización; restringir permisos y proteger `main` y los workflows.

## Configuración inicial sin publicar

1. Crear o seleccionar proyecto, entorno `production` y servicio frontend en Railway. Configurar `BACKEND_ORIGIN`, dominio HTTPS y asegurarse de que ningún comando de inicio del panel anule el `CMD` del Dockerfile.
2. Si el servicio está conectado a GitHub, ir a Service Settings → GitHub Integration y pulsar **Disable** para autodeploy. Evitar también otros disparadores, webhooks o despliegues externos. **Un push podría publicar si alguna integración automática permanece activa**; deshabilitarla es un paso externo obligatorio. Wait for CI no equivale a autorización manual.
3. Crear un project token de Railway limitado al entorno production y guardarlo como GitHub Environment Secret `RAILWAY_TOKEN` en `production`. Definir allí las variables `RAILWAY_SERVICE_ID` (ID exacto del servicio frontend) y `FRONTEND_URL` (origen HTTPS público del frontend, sin ruta). El token identifica proyecto y entorno. Verificar el destino.
4. Integrar mediante PR a `development` y luego a `main`, con revisión y CI. El workflow debe existir en la rama predeterminada para iniciarlo manualmente. No se han creado reglas, secretos ni servicios automáticamente.

## Publicar y verificar

1. Confirmar que el commit de `main` revisado tiene una ejecución **Frontend CI** de push exitosa y que autodeploy sigue desactivado.
2. En GitHub → Actions → **Despliegue manual frontend Railway** → **Run workflow**, seleccionar `main` y ejecutar. Aprobar el entorno si existe protección adicional. Si `main` cambió, iniciar una ejecución nueva.
3. Revisar el resumen, logs y detalles en Railway. Ante un fallo posterior al envío, verificar el estado real antes de actuar.
4. Abrir `/healthz`, `/portal-certificados` y `/login`, recargar rutas y comprobar sesión, permisos, búsqueda por DNI/código/QR y PDF. `/healthz` no valida API ni sesión.

## Diagnóstico y reversión

- 503 en `/api`: revisar `BACKEND_ORIGIN`; 502 indica fallo de conexión o TLS con Laravel.
- Login sin sesión: revisar atributos `Set-Cookie` y configuración de Laravel; no desactivar protecciones.
- Fallo de build por tamaño: revisar CSS y advertencias; el límite de estilos se ajustó a 8 kB para el estado actual.
- Fallo de salud: revisar puerto, logs SSR y `/healthz`.
- Para volver a una versión, seleccionar un despliegue anterior conocido en Railway y usar rollback/redeploy. Verificar salud, API y sesión. Es una operación privilegiada aparte; luego corregir `main` mediante PR. No reescribir historia.

Referencias: [compatibilidad Angular](https://angular.dev/reference/versions), [Dockerfile Railway](https://docs.railway.com/builds/dockerfiles), [desactivar autodeploy](https://docs.railway.com/deployments/github-autodeploys), [healthchecks](https://docs.railway.com/deployments/healthchecks), [ejecución manual GitHub](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow).
