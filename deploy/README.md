# Dockerización del frontend Angular

## Diagnóstico y arquitectura

Lockfile: Angular core **18.2.14**, CLI/builder **18.2.21**, TypeScript **5.5.4**.
Builder: `@angular-devkit/build-angular:application`; outputPath: `dist/gpc_front`.
SSR y prerender están activos, con hidratación. La salida incluye
`dist/gpc_front/browser/index.html` y `dist/gpc_front/server/server.mjs`.
Node 22 es compatible: https://angular.dev/reference/versions.
Angular 18 está fuera de soporte; su actualización queda como tarea separada.

El Dockerfile conserva dos etapas Node Alpine: compilación con npm ci y caché
BuildKit, y runtime SSR como usuario node. Compose añade Nginx oficial estable
como gateway en puerto interno 80, con su comando oficial en primer plano.
Solo Nginx publica un puerto de loopback. No modifica backend, MySQL, redes ni
volúmenes existentes; crea una red propia por proyecto Compose.

Para conservar SSR, las rutas pasan al motor Angular. No corresponde usar
`try_files ... /index.html`: ese fallback sirve una SPA estática y omitiría SSR.
Express sirve recursos con hash con caché larga; HTML y recursos sin hash
revalidan. Nginx añade gzip, encabezados básicos y `/healthz` que consulta Node.

El código actual contiene la plantilla inicial Angular y ninguna ruta declarada,
llamada HTTP, API o autenticación. Los environments solo contienen `production`;
no hacen falta set-envs.js, build args ni variables GitHub por ahora. Producción
reemplaza environment.ts por environment.production.ts sin alterar desarrollo.
No se inventaron endpoints. Cambiar Compose no cambia environments compilados.
Nunca agregar contraseñas, claves JWT ni tokens privados al frontend.

Git solo tiene master local y ningún remoto configurado. El usuario confirmó que
`main` es la rama de producción: el workflow usa `main` aunque este checkout
conserve otra rama local. No se cambian ni fusionan ramas automáticamente.
El nombre GHCR se obtiene de github.repository y se convierte a minúsculas.

## Estructura

```text
.github/workflows/frontend-docker.yml
Dockerfile
.dockerignore
.env.example
deploy/docker-compose.dev.yml
deploy/docker-compose.prod.yml
deploy/nginx/default.conf
deploy/README.md
src/environments/environment.ts
src/environments/environment.production.ts
server.ts
```

## Windows: probar producción

Iniciar Docker Desktop con contenedores Linux. Desde la raíz, PowerShell:

```powershell
npm.cmd ci --no-audit --no-fund
npm.cmd run build -- --configuration production
Test-Path dist/gpc_front/browser/index.html
Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue
docker compose -f deploy/docker-compose.dev.yml config
docker compose -f deploy/docker-compose.dev.yml up -d --build
docker compose -f deploy/docker-compose.dev.yml ps
curl.exe -I http://localhost:8080/
curl.exe http://localhost:8080/healthz
docker compose -f deploy/docker-compose.dev.yml exec nginx nginx -t
docker compose -f deploy/docker-compose.dev.yml logs --tail=100
```

Abrir http://localhost:8080. Al implementar rutas Angular, abrirlas directamente
y recargarlas para probar SSR; hoy no hay rutas internas válidas que comprobar.
Verificar no-cache para HTML e immutable para JS con hash. Para desarrollo
normal usar npm start; para detener solo este proyecto:

```powershell
docker compose -f deploy/docker-compose.dev.yml down
```

## GitHub y GHCR

Configurar el remoto real y subir los archivos a la rama principal. Habilitar
Actions y permitir escritura de paquetes. No se necesitan GitHub Variables ni
PAT: el workflow usa GITHUB_TOKEN efímero, contents: read y packages: write.
El token nunca se pasa al build. Si un paquete ya existe, autorizar acceso de
Actions al repositorio en la configuración del paquete.

Solo push a main publica latest y sha-<SHA-completo> en
ghcr.io/<propietario-real>/<repositorio-real>, después de pasar los checks.
PRs hacia development/main, pushes a development y ejecuciones manuales validan
sin publicar. Una ejecución manual sobre main tampoco publica.
Revisar ejecución del workflow y pestaña Packages para confirmar publicación.
GHCR puede ser privado; configurar visibilidad y permisos según corresponda.
**Publicar en GHCR no despliega automáticamente en Ubuntu.**

### Trabajo colaborativo y control de producción

Flujo acordado:

```text
feature/... -> PR a development -> validaciones + aprobación -> merge
development -> PR a main -> nuevas validaciones + nueva aprobación -> merge
main -> validaciones del commit integrado -> publicar GHCR latest y sha-...
```

`development` es la integración del equipo y `main` es producción. No se publica
imagen de desarrollo ni se despliega al servidor por integrar en development.
La revisión del PR de development no sustituye la revisión del PR hacia main.
La aprobación del equipo es manual; pasar checks no garantiza ausencia de bugs.

Checks obligatorios, con nombres estables:

- `Flujo de ramas`: hacia main solo admite development del mismo repositorio.
- `TypeScript y pruebas`: npm ci, pruebas de la política de ramas, TypeScript
  de aplicación/specs y pruebas Angular en ChromeHeadless.
- `Build de producción`: Dockerfile de producción, arranque con Compose,
  salud SSR/Nginx, nginx -t y comprobación HTTP de la página inicial.

Los dos últimos checks se ejecutan en paralelo tras validar el flujo. El job
`Publicar GHCR` espera a todos, y solo corre en push a main. Recibe un artefacto
temporal con la imagen que pasó el check Docker en esa ejecución: no reconstruye
otra imagen para publicar. Usa etiquetas SHA completo y latest, nombre en
minúsculas y etiquetas OCI de origen y revisión. Solo ese job tiene packages: write.
El artefacto temporal se conserva un día; las versiones publicadas están en GHCR.
Las ejecuciones de cada rama se serializan para evitar publicar latest fuera de
orden; los PR cancelan validaciones anteriores al recibir cambios nuevos.

#### Activar las dos aprobaciones en GitHub

Hay dos reglas listas para importar:

- `.github/rulesets/development.json`
- `.github/rulesets/main.json`

En el repositorio: Settings > Rules > Rulesets > New ruleset > Import a ruleset.
Importar cada JSON, revisar la rama de destino y crear la regla en estado Active.
Versionar estos JSON **no activa** las reglas. Comprobar que el plan y la
visibilidad del repositorio permiten rulesets (en repositorios privados depende
del plan de GitHub).

Ambas reglas exigen PR, al menos una aprobación, aprobación del último push por
otra persona, descartan aprobaciones obsoletas y exigen resolver conversaciones.
Exigen los tres checks anteriores con la rama actualizada, bloquean force pushes
y eliminación, y no incluyen actores con bypass. No requieren CODEOWNERS porque
todavía no se conocen los usuarios/equipos reales. Revisar especialmente cambios
de .github/ y scripts de CI al aprobar; no confiar solo en checks editables.

Ejecutar primero un PR para que GitHub reconozca los nombres de checks. Si ya
existían protecciones con otros nombres, actualizarlas para no bloquear los PRs.
No exigir `Publicar GHCR` antes del merge: ese job se omite en PR y solo publica
después de integrar en main. No habilitar merge queue con este workflow sin
añadir y configurar antes merge_group.

La regla de origen development -> main está en el check obligatorio. Los rulesets
son los que impiden omitirlo y hacer pushes directos. No se activaron remotamente:
este checkout no tiene remoto configurado y solo tiene master local. No se han
renombrado, creado ni subido ramas automáticamente.

#### Preparación inicial y trabajo diario

Configurar el remoto con la URL real del repositorio. Si ya existe main en GitHub,
coordinar la incorporación mediante PR; no reemplazarlo ni usar force push. Para
un repositorio nuevo y vacío, subir el commit inicial con esta configuración,
crear main/development desde esa base y activar después las dos reglas. La carga
inicial de main disparará la publicación si pasa las validaciones.

Una vez creadas las ramas remotas, cada colaborador parte de development:

```sh
git fetch origin
git switch development
git pull --ff-only origin development
git switch -c feature/nombre-funcionalidad
# Editar, validar, añadir archivos concretos y crear el commit.
git push -u origin feature/nombre-funcionalidad
```

Abrir PR hacia development, obtener revisión y checks verdes. Cuando la versión
esté revisada funcionalmente, abrir otro PR desde development hacia main. No
congelar el trabajo de todo el equipo: acordar qué versión se está promoviendo;
un nuevo push a development modifica el PR de promoción e invalida su aprobación.
Preferir merge commit al promover la rama compartida development a main y luego
sincronizar main hacia development mediante otro PR si es necesario. No reescribir
la historia de development/main para corregir divergencias.

Ubuntu se actualiza aparte con un tag SHA aprobado, según los comandos siguientes.
No hay despliegue automático al servidor ni se añadieron credenciales SSH.

Referencias oficiales:
[GHCR](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry),
[reglas](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets),
[importación de rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/managing-rulesets-for-a-repository).

## Ubuntu: desplegar sin tocar el backend

Con Docker Engine y Compose plugin instalados, copiar .env.example y deploy/
con su estructura a un directorio exclusivo, por ejemplo /opt/gpc-frontend.

```sh
cd /opt/gpc-frontend
cp .env.example .env
ss -ltn '( sport = :8080 )'
```

Editar .env: FRONTEND_IMAGE debe contener el nombre real publicado, preferiblemente
con tag sha-<SHA-completo>. Mantener FRONTEND_BIND=127.0.0.1 y escoger un
FRONTEND_PORT libre. La disponibilidad en Ubuntu debe comprobarse en ese servidor.
Compose falla con un mensaje claro si FRONTEND_IMAGE está vacío.

Para paquetes privados, iniciar sesión con usuario GitHub y token read:packages
con acceso al paquete (y autorización SSO si corresponde), ingresado al pedir
contraseña. No guardar tokens en Git, Angular o .env. Para paquetes públicos
no se necesita login.

```sh
docker login ghcr.io -u TU_USUARIO_GITHUB
docker compose --env-file .env -f deploy/docker-compose.prod.yml config
docker compose --env-file .env -f deploy/docker-compose.prod.yml pull
docker compose --env-file .env -f deploy/docker-compose.prod.yml up -d
docker compose --env-file .env -f deploy/docker-compose.prod.yml ps
curl -f http://127.0.0.1:8080/healthz
```

## Nginx del host y HTTPS

Crear un virtual host exclusivo en /etc/nginx/sites-available/gpc-frontend.
Reemplazar dominio y puerto por los reales; no reemplazar los de otras apps:

```nginx
server {
    listen 80;
    server_name frontend.example.com;
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Apuntar DNS al servidor, instalar Certbot si falta, permitir validación ACME:

```sh
sudo ln -s /etc/nginx/sites-available/gpc-frontend /etc/nginx/sites-enabled/gpc-frontend
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d frontend.example.com
sudo certbot renew --dry-run
curl -I https://frontend.example.com/
```

HTTPS termina en el host. El SSR actual no depende de cookies ni del protocolo
del proxy; revisar confianza en proxies y cabeceras si se incorpora autenticación
SSR en el futuro.

## Integración futura con Laravel

No hay URL real ni consumidores actuales para validar la conexión. Opciones:

- URL pública HTTPS en el environment de producción: configurar CORS en Laravel
  para el dominio frontend y revisar cookies/Sanctum, CSRF y credenciales si aplica.
- Mismo origen /api: añadir una location específica en Nginx del host hacia el
  backend real, conservando o eliminando el prefijo según sus rutas. Evita CORS
  del navegador y no requiere unir redes Docker.

No se añadió proxy /api sin conocer el destino; hoy esa ruta llegaría a Angular.
El navegador no puede usar nombres de contenedores; localhost representa la
máquina del usuario. Las peticiones SSR con rutas relativas necesitarán resolver
el origen o una URL absoluta accesible desde el contenedor.

En DevTools > Network revisar URL, HTTPS, respuesta JSON, errores CORS, cookies y
contenido mixto. Cambios de environments requieren reconstruir y publicar imagen.
La comunicación con Laravel no está validada hasta implementar sus consumidores.

## Actualizar, logs, salud y rollback

Guardar el SHA anterior, editar FRONTEND_IMAGE en .env y ejecutar:

```sh
docker compose --env-file .env -f deploy/docker-compose.prod.yml pull
docker compose --env-file .env -f deploy/docker-compose.prod.yml up -d
docker compose --env-file .env -f deploy/docker-compose.prod.yml ps
docker compose --env-file .env -f deploy/docker-compose.prod.yml logs --tail=100 -f
docker compose --env-file .env -f deploy/docker-compose.prod.yml exec nginx nginx -t
curl -f http://127.0.0.1:8080/healthz
```

Rollback: restaurar el tag SHA anterior y repetir pull/up. Conservar esas imágenes
en GHCR. No ejecutar docker system prune ni comandos globales. Puede haber una
breve interrupción al recrear SSR; no se garantiza despliegue sin downtime.

Despliegue automático por SSH: ampliación pendiente, con usuario dedicado,
clave en GitHub Secrets, host key verificada y comandos limitados al directorio
del frontend. No está configurado por este workflow.

## Validaciones realizadas en este checkout

- npm ci: correcto después de reparar las resoluciones chokidar/readdirp del
  lockfile. npm mostró avisos de dependencias obsoletas y limpieza EPERM en Windows;
  terminó con código 0. No se actualizaron las versiones declaradas de Angular.
- Build production: correcto con Node 22.22.2; 254.44 kB iniciales y una ruta
  prerenderizada. Confirmados browser/index.html y server/server.mjs.
- Servidor SSR compilado ejecutado directamente: /healthz, / e /index.html
  respondieron 200. HTML con no-cache, JS con hash con immutable; sin X-Powered-By.
  Proceso de prueba detenido al terminar.
- Compose dev y prod: configuración válida (prod con imagen de prueba solo para
  validar sintaxis); sin FRONTEND_IMAGE, prod falla con mensaje explícito.
- Workflow: YAML parseado correctamente; revisión estática de permisos, tags,
  autenticación y caché. No ejecutado en GitHub ni publicación GHCR comprobada.
- Docker CLI instalado, pero motor Docker Desktop Linux no disponible, también
  comprobado fuera del sandbox. No se construyó la imagen ni ejecutó Nginx;
  nginx -t, gzip y cabeceras del gateway quedan pendientes de prueba con Docker.
- Rutas internas y backend: no comprobables, no existen consumidores ni rutas
  de aplicación. No se alteraron servicios del backend.
- No se encontraron credenciales en el código frontend revisado. No equivale a
  una auditoría de secretos del historial Git ni de dependencias.
- Puerto Ubuntu: pendiente comprobar en el servidor; el enlace por defecto usa
  127.0.0.1:8080 y es configurable. No se garantiza ausencia de conflictos remotos.
