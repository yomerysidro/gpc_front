# Organización de la aplicación

Base Angular 18 standalone con SSR e hidratación. AppComponent, el arranque,
las rutas y los proveedores actuales se conservan. Los componentes base existen
con archivos TS, HTML y SCSS, pero todavía no se registran en la navegación.

## Estructura y responsabilidades

- components/header: HeaderComponent con proyección de contenido.
- components/sidebar: SidebarComponent recibe entradas NavigationItem; no inventa enlaces.
- components/layouts/main-layout: MainLayoutComponent compone header, sidebar y router-outlet.
- core/guards/auth.guard.ts: punto de protección que consulta AuthService.
- core/interceptors/auth.interceptor.ts: autorización explícita por solicitud.
- core/interfaces/navigation/navigation-item.interface.ts: contrato de entradas del menú.
- core/interfaces/certificado/certificado.interface.ts: CertificadoRow inicial,
  según los campos proporcionados; pendiente de validar contra Laravel.
- core/security/auth-request.context.ts: contexto AUTHENTICATED_REQUEST, desactivado por defecto.
- core/services/autenticacion/auth.service.ts: contrato abstracto de autenticación, sin proveedor ficticio.
- models: reservado para modelos con comportamiento real; README explica su criterio.
- pages/home: HomeComponent base, sin lógica de negocio.
- pages/certificados/listar-certificados: ListarCertificadosComponent base, sin API ni CRUD.
- shared/components/page-title: título reutilizable mediante input obligatorio.
- shared/directives, shared/pipes y shared/utils: sin implementaciones hasta tener
  consumidores reales. Se retiraron los auxiliares de ejemplo sin uso en pantallas.
- src/assets: recursos reales de la aplicación, publicados bajo /assets/.

Los archivos .gitkeep de esta tarea fueron sustituidos. No se crean imágenes ni
modelos de certificados con campos supuestos: assets y models tienen instrucciones
hasta disponer de recursos y contratos reales.

## Autenticación pendiente de integración

No existían guards, interceptores ni autenticación en este checkout. Los nuevos
archivos son puntos de integración y no están registrados en app.config.ts ni
en las rutas. No constituyen una implementación completa de autenticación.

Antes de activarlos se debe implementar y proporcionar AuthService con los
métodos isAuthenticated y authorizeRequest, de acuerdo con el backend real.
Sin proveedor, el guard falla por inyección: no hay acceso permitido por defecto.
El interceptor solo delega cuando AUTHENTICATED_REQUEST es true en el contexto
HTTP; de lo contrario conserva la solicitud. La implementación de authorizeRequest
debe verificar destinos antes de enviar credenciales. No se presupone JWT,
localStorage, cookies ni URLs. La autorización del backend sigue siendo obligatoria.

## Dependencias y estilos

Las páginas coordinan servicios y componentes. Shared no depende de páginas o
layouts; core no depende de componentes visuales. Los contratos simples viven
en core/interfaces; models no debe duplicarlos. Agrupar interfaces y servicios
por funcionalidad: no colocar interfaces directamente en core/interfaces ni
servicios específicos directamente en core/services. Para navegación usar
core/interfaces/navigation; para autenticación, core/services/autenticacion.
Crear nuevas subcarpetas solo al implementar esa funcionalidad. Guards e
interceptores permanecen en sus carpetas actuales.

Los modelos, cuando aporten una representación o transformación necesaria, se
guardan en models/nombre-funcionalidad/nombre.model.ts, sin duplicar contratos de
core/interfaces. Las páginas siguen pages/módulo/funcionalidad y los servicios
específicos core/services/nombre-funcionalidad. Un archivo .interface.ts puede
agrupar varios contratos relacionados cuando existan consumidores reales.

NavigationItem es el único contrato del sidebar plano actual (label y path).
No se añade SidebarItem con id, children o isOpen porque el menú no usa esos
campos. CertificadoRow solo declara los diez campos proporcionados, sin estados
inventados, relaciones, payloads CRUD ni paginación. En el backend gpc_back
disponible no se encontraron migración, modelo ni endpoints de certificados;
su contrato de API, formato de fechas, booleanos y nulabilidad siguen pendientes
de contrastar. La interfaz no se conecta todavía a peticiones HTTP.

Cada componente tiene carpeta propia, nombre kebab-case y TS, HTML y SCSS separados.
Angular CLI está configurado para generar standalone y SCSS externos por defecto.
No regenerar los componentes base existentes; crear los futuros con, por ejemplo:

```sh
npx ng generate component pages/certificados/detalle-certificado
```

El ejemplo no se ha ejecutado ni crea una nueva funcionalidad automáticamente.
Definir navegación y contratos antes de incorporar pantallas al menú o las rutas.

src/styles.scss conserva los estilos globales. Las reglas iniciales de AppComponent
se trasladaron desde su bloque style al SCSS sin cambiar valores ni diseño.
El build avisa de 2,93 kB en ese SCSS frente a 2 kB de aviso (límite de error 4 kB).
No se alteran presupuestos para ocultarlo. No se realizó comparación visual.

Se conserva public/ para los recursos raíz, incluido favicon.ico. src/assets está
registrado en build y tests; evitar colisiones con public/assets. Los environments,
SSR, Docker, GitHub Actions y despliegue no se modifican en esta ampliación.

## Validación

base-architecture.spec.ts renderiza los componentes base y verifica que el guard
requiere proveedor, respeta el estado y que el interceptor delega solo por solicitud
explícita. No contacta endpoints reales ni simula una integración Laravel terminada.

```sh
npx tsc -p tsconfig.spec.json --noEmit
npm test -- --watch=false --browsers=ChromeHeadless
npm run build -- --configuration production
```

Los componentes nuevos fueron compilados y renderizados por las pruebas, aunque
todavía no forman parte del grafo de navegación del bundle de producción.

Se conserva page-title porque lo consumen home y listar-certificados. Se conserva
base-architecture.spec.ts para verificar esos componentes y los puntos de
integración de autenticación; se retiraron únicamente sus pruebas de auxiliares
eliminados. models/README.md documenta el criterio para futuros modelos sin
inventar clases ni contratos de base de datos.

Las carpetas sin archivos se mantienen localmente; Git no versiona carpetas vacías.
No se agregan .gitkeep ni implementaciones ficticias para conservarlas en Git.

Validación después de añadir CertificadoRow: TypeScript de aplicación, specs e
interfaz aislada correcto, 14 pruebas aprobadas en ChromeHeadless y build de producción correcto
con una ruta prerenderizada. Se mantiene el aviso de 2,93 kB del SCSS inicial.
Las rutas y los proveedores no cambiaron; todavía no hay rutas funcionales
de certificados que puedan comprobarse mediante navegación.
