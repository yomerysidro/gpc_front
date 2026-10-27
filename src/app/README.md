# Organización de la aplicación

Base Angular 18 standalone con SSR e hidratación. AppComponent solo contiene
`<router-outlet />`; las pantallas se registran en app.routes.ts.

## Estructura y responsabilidades

- components/header: HeaderComponent con proyección de contenido.
- components/sidebar: SidebarComponent recibe entradas NavigationItem; no inventa enlaces.
  Muestra el ícono solo si la entrada trae `icon`.
- components/layouts/main-layout: MainLayoutComponent compone header, sidebar y
  router-outlet. Es de **presentación**: recibe `navigation` por input y proyecta
  `[layout-header]`; no inyecta servicios.
- components/layouts/private-layout: PrivateLayoutComponent es el **contenedor**
  de las rutas privadas. Inyecta AuthService, mapea modulos → NavigationItem
  (nombre → label, url → path, imagen → icon), muestra nombre, rol y el botón de
  cerrar sesión, y envuelve main-layout.
- core/guards: authGuard, guestGuard, permissionGuard e inicioGuard (ruta raíz).
- core/interceptors/auth.interceptor.ts: autorización explícita por solicitud y
  manejo del 401.
- core/interfaces/autenticacion/auth.interface.ts: contratos de AuthController de gpc_back.
- core/interfaces/navigation/navigation-item.interface.ts: contrato de entradas del menú.
- core/interfaces/certificado/certificado.interface.ts: CertificadoRow inicial,
  según los campos proporcionados; pendiente de validar contra Laravel.
- core/security/auth-request.context.ts: contexto AUTHENTICATED_REQUEST, desactivado por defecto.
- core/services/autenticacion/auth.service.ts: contrato abstracto de autenticación.
- core/services/autenticacion/session-auth.service.ts: implementación registrada en app.config.ts.
- models: reservado para modelos con comportamiento real; README explica su criterio.
- pages/autenticacion: login, recuperar-password, restablecer-password (ruta
  /reset-password) y acceso-denegado.
- pages/home: HomeComponent, ruta /inicio (destino si el usuario no tiene módulos).
- pages/en-construccion: destino provisional de /usuarios, /roles y de los
  módulos del menú cuyas pantallas aún no existen.
- pages/certificados/listar-certificados: ListarCertificadosComponent base, sin API ni CRUD.
- shared/components/page-title: título reutilizable mediante input obligatorio.
- shared/directives, shared/pipes y shared/utils: sin implementaciones hasta tener
  consumidores reales.
- src/assets: recursos reales de la aplicación, publicados bajo /assets/.

No se crean imágenes ni modelos de certificados con campos supuestos: assets y
models tienen instrucciones hasta disponer de recursos y contratos reales.

## Autenticación

gpc_back emite un JWT en la cookie httpOnly `access_token` (SameSite=Strict).
El front **nunca lee el token**: no hay localStorage ni cabecera Authorization.

- La API se consume en `environment.apiBaseUrl` (`/api`). En desarrollo,
  proxy.conf.json reenvía /api a http://localhost:5017, así la cookie es del
  mismo origen. En producción, el Nginx del host debe enrutar /api al backend
  (ver deploy/README.md).
- SessionAuthService guarda usuario, modulos y permisos en signals;
  `isAuthenticated` es un computed. `cargarSesion()` consulta GET /auth/me una
  sola vez y cachea el resultado; un 401 deja la sesión vacía. `login()` hace
  POST /auth/login y recarga /auth/me (el login no trae menú ni permisos).
- Todas las llamadas del servicio llevan AUTHENTICATED_REQUEST. El interceptor
  solo actúa sobre solicitudes marcadas y delega en `authorizeRequest`, que añade
  `withCredentials` únicamente si la URL empieza por apiBaseUrl.
- Un 401 en una solicitud marcada, salvo /auth/login y /auth/me, limpia la sesión
  y lleva a /login?returnUrl=<ruta actual>.
- Sin proveedor de AuthService los guards fallan por inyección: no hay acceso
  permitido por defecto. permissionGuard deniega si la ruta no declara
  `data.permiso`. El backend vuelve a validar cada permiso.

### SSR

La sesión se decide solo en el navegador (la cookie no viaja al render del
servidor). En el servidor los guards devuelven true y nunca llaman a la API;
la ruta raíz no tiene componente, así que su HTML del servidor queda vacío.
`withHttpTransferCacheOptions` excluye las URLs de apiBaseUrl de la caché de
transferencia. Solo se prerenderizan las rutas públicas listadas en
prerender-routes.txt (`discoverRoutes: false`); el archivo no debe terminar en
línea vacía, porque el builder la interpreta como la ruta `/`.

### Rutas

| Ruta | Guard | Notas |
| --- | --- | --- |
| `/` | inicioGuard | Primer módulo del menú con sesión; /login sin ella |
| `/login`, `/recuperar-password` | guestGuard | Con sesión redirigen al primer módulo |
| `/reset-password` | — | Enlace del correo: `?token=…&email=…` |
| `/acceso-denegado` | — | |
| `/inicio`, `/usuarios`, `/roles`, `**` | authGuard (private-layout) | usuarios.ver y roles.ver con permissionGuard |

## Dependencias y estilos

Las páginas coordinan servicios y componentes. Shared no depende de páginas o
layouts; core no depende de componentes visuales. Los contratos simples viven
en core/interfaces; models no debe duplicarlos. Agrupar interfaces y servicios
por funcionalidad: no colocar interfaces directamente en core/interfaces ni
servicios específicos directamente en core/services. Para navegación usar
core/interfaces/navigation; para autenticación, core/interfaces/autenticacion y
core/services/autenticacion. Crear nuevas subcarpetas solo al implementar esa
funcionalidad. Guards e interceptores permanecen en sus carpetas actuales.

Los modelos, cuando aporten una representación o transformación necesaria, se
guardan en models/nombre-funcionalidad/nombre.model.ts, sin duplicar contratos de
core/interfaces. Las páginas siguen pages/módulo/funcionalidad y los servicios
específicos core/services/nombre-funcionalidad. Un archivo .interface.ts puede
agrupar varios contratos relacionados cuando existan consumidores reales.

NavigationItem es el único contrato del sidebar plano actual (label, path e
icon opcional). No se añade SidebarItem con id, children o isOpen porque el menú
no usa esos campos. CertificadoRow solo declara los diez campos proporcionados,
sin estados inventados, relaciones, payloads CRUD ni paginación; su contrato de
API sigue pendiente de contrastar con gpc_back.

Cada componente tiene carpeta propia, nombre kebab-case y TS, HTML y SCSS separados.
Angular CLI está configurado para generar standalone y SCSS externos por defecto.
Crear los componentes nuevos con, por ejemplo:

```sh
npx ng generate component pages/certificados/detalle-certificado --skip-tests
```

src/styles.scss define los tokens (`--color-primario`, `--color-error`,
`--color-exito`, `--gris-*`, `--radio-*`, `--espacio-*`) y las clases base
`.btn`, `.btn-primary`, `.form-field`, `.input`, `.error-text`, `.alert`, `.card`,
`.table`, `.badge` y `.auth-page`/`.auth-card`. Los SCSS de componente solo
contienen su disposición y usan esos tokens; el presupuesto avisa desde 2 kB.
Los íconos son Material Icons cargados con `<link>` en index.html (`display=block`).

Se conserva public/ para los recursos raíz, incluido favicon.ico. src/assets está
registrado en build y tests; evitar colisiones con public/assets.

## Validación

base-architecture.spec.ts renderiza los componentes base y verifica el sidebar
(con y sin ícono), los guards (asíncronos, SSR, returnUrl, guest y permisos),
el interceptor (delegación por solicitud y 401) y SessionAuthService con
HttpTestingController.

```sh
npx tsc -p tsconfig.spec.json --noEmit
npm test -- --watch=false --browsers=ChromeHeadless
npm run build -- --configuration production
```

Las carpetas sin archivos se mantienen localmente; Git no versiona carpetas vacías.
