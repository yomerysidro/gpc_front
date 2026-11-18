# CI y despliegue del frontend en Railway

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

Angular usa `https://api-certificados-morales.aiyond.org/api` en producción. El portal público está en `https://certificados-morales.aiyond.org`. Ambos dominios están asociados a Railway. Laravel controla CORS, las cookies de sesión y los destinos oficiales de verificación.

Para solicitudes a `/api` en el propio dominio del frontend, Express conserva el proxy definido por `BACKEND_ORIGIN`. La variable recibe el origen HTTPS de Laravel sin ruta, credenciales, query ni fragmento. Si falta ese origen, el proxy responde 503 aunque `/healthz` siga respondiendo 200.

## CI y aprobación

`frontend-ci.yml` se ejecuta únicamente en `push` a `main`. La plantilla de ruleset de `main` exige Pull Request y revisión aprobada. El ruleset debe estar activo en GitHub para aplicar esa protección. Los trabajos de este CI corren después del merge y solo condicionan el despliegue.

**Ejecutar** comprueba TypeScript y corre las pruebas. **Construir** compila Angular para producción y sube el artefacto. **Verificar** descarga ese artefacto, inicia SSR con un puerto dinámico y comprueba `/healthz`, `/portal-certificados` y `/login`. Cada trabajo depende del éxito del anterior mediante `needs`.

## Despliegue con la integración de Railway

El servicio frontend en Railway debe estar conectado a `main` con **Wait for CI** activado. La integración nativa espera el resultado de **Frontend CI** y Railway usa el Dockerfile para desplegar el commit aprobado. [Integración GitHub de Railway](https://docs.railway.com/deployments/github-autodeploys)

Para verificar una publicación, comprobar en Railway el SHA y el estado del despliegue y consultar `/healthz`, `/portal-certificados` y `/login`. La validación autenticada de sesión, permisos y PDFs requiere una cuenta autorizada.

## Diagnóstico y reversión

- 503 en `/api`: revisar `BACKEND_ORIGIN`; 502 indica fallo de conexión o TLS con Laravel.
- Login sin sesión: revisar atributos `Set-Cookie` y configuración de Laravel; no desactivar protecciones.
- Fallo de build por tamaño: revisar CSS y advertencias; el límite de estilos se ajustó a 8 kB para el estado actual.
- Fallo de salud: revisar puerto, logs SSR y `/healthz`.
- Para volver a una versión, seleccionar un despliegue anterior conocido en Railway y usar rollback/redeploy. Verificar salud, API y sesión. Es una operación privilegiada aparte; luego corregir `main` mediante PR. No reescribir historia.

[Compatibilidad Angular](https://angular.dev/reference/versions) · [Dockerfile Railway](https://docs.railway.com/builds/dockerfiles) · [Healthchecks](https://docs.railway.com/deployments/healthchecks)
