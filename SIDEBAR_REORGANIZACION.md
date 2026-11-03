# Sidebar y pantallas preliminares del Administrador

## Resultado

El Administrador autorizado puede visualizar Dashboard y los ocho grupos del Sidebar, incluidos Solicitudes, Gerencia y Reportes. Las funciones pendientes están identificadas como **En desarrollo** y abren páginas informativas sin datos ni operaciones de negocio.

No se modificaron los CRUD, el Header, JWT, interceptores, guards institucionales existentes, Laravel, PostgreSQL, migraciones, roles ni asignaciones de permisos en esta intervención. No se hizo commit ni push.

## Diagnóstico de Solicitudes

| Aspecto | Estado encontrado |
| --- | --- |
| Registro del menú | Existía el grupo Solicitudes con tres opciones. |
| Configuración | Las opciones tenían `habilitado: false`, sin ruta operativa ni permiso. |
| Filtrado | El Sidebar descartaba esas opciones y después eliminaba el grupo por quedar vacío. |
| Rutas y componentes | No había rutas de Solicitudes conectadas a una pantalla inicial. |
| Permisos de Laravel | No se encontraron operaciones ni un ámbito de permisos de Solicitudes. Asignar Actividades no habilita este proceso. |
| Menú dinámico | Una entrada de backend no crea por sí misma rutas o permisos. |
| Sesión | `/auth/me` proporciona `user.rol` y `permisos`; el Sidebar consume el servicio institucional existente. |

La asignación de 15 módulos y 60 permisos al rol Administrador se verificó en la corrección anterior. La consulta de comprobación de la API local no pudo completarse en este turno; no se modificaron datos para resolver la visibilidad de las pantallas preliminares.

## Protección de las páginas informativas

Se usa una política exclusiva para consultar páginas pendientes:

- Usuario autenticado, comprobado por el `authGuard` existente del layout.
- Rol actual `Administrador`, recibido mediante el servicio de sesión.
- Capacidades existentes `roles.ver` y `roles.editar`, sin crear permisos nuevos.
- Guard adicional `pantallasPendientesGuard` en cada ruta preliminar.

El nombre del rol por sí solo no concede acceso. Esta política no habilita ninguna operación administrativa. Las entradas de funciones implementadas siguen exigiendo sus permisos originales, incluso para el Administrador. Otros usuarios mantienen su navegación real y no reciben los enlaces preliminares.

No hay modo de desarrollo que omita permisos, bandera de entorno ni excepción que abra los CRUD en producción. Las páginas preliminares pueden consultarse como información protegida; no sustituyen endpoints ni autorizaciones de negocio.

## Solicitudes

| Opción | Ruta | Función descrita |
| --- | --- | --- |
| Nueva solicitud de actividad | `/solicitudes/nueva` | Propuesta de actividad para evaluación institucional. |
| Mis solicitudes | `/solicitudes/mis-solicitudes` | Estado y seguimiento de solicitudes presentadas. |
| Revisión de solicitudes | `/solicitudes/revision` | Consulta de la evaluación de solicitudes de actividad. |

Las tres rutas reutilizan el componente inicial compartido `VistaTemporalComponent`, con título y descripción propios. Todas muestran **En desarrollo** y **Funcionalidad pendiente de integración**. Incluyen navegación de vuelta al inicio y no tienen formularios, botones de aprobación, registros ficticios ni llamadas HTTP de negocio.

## Estructura completa

Se conserva el orden:

1. Dashboard.
2. Seguridad y acceso.
3. Recursos humanos.
4. Solicitudes.
5. Gestión de actividades.
6. Emisión de certificados.
7. Gerencia.
8. Reportes.
9. Configuración general.

Se conservan las rutas de usuarios, roles, Personas y Documentos, Trabajadores, Prácticas y Supervisores, Ponentes, Reconocimientos, Actividades, Participantes, Sesiones/asistencia, Certificados, Firmas y catálogos.

Además de Solicitudes, las siguientes opciones pendientes abren el mismo componente informativo, con su título propio:

- `/pendientes/generar-emitir`.
- `/pendientes/pendientes-aprobacion`.
- `/pendientes/documentos-firmar`.
- `/pendientes/historial-decisiones`.
- `/pendientes/indicadores`.
- `/pendientes/reportes-actividades`.
- `/pendientes/reportes-certificados`.
- `/pendientes/reportes-asistencia`.

Estas páginas no generan documentos, no aplican firmas ni implementan reportes simulados. Si en el futuro se implementa una operación, tendrá que incorporar su permiso y contrato propios.

## Diseño

Se mantiene el Sidebar único, azul institucional, iconos, línea activa, modo contraído, tooltips y cajón móvil. Se añade únicamente la etiqueta **En desarrollo** a los enlaces preliminares.

Se conserva una sola opción activa según la URL y se expande su grupo padre. Los parámetros de pestañas existentes y las rutas anteriores permanecen disponibles.

## Archivos

Creados:

- `src/app/components/sidebar/pantallas-pendientes.guard.ts`.
- `src/app/components/sidebar/pantallas-pendientes.spec.ts`.

Modificados:

- `src/app/components/sidebar/modulos-navegacion.ts`.
- `src/app/components/sidebar/sidebar.component.ts`.
- `src/app/components/sidebar/sidebar.component.html`.
- `src/app/components/sidebar/sidebar.component.scss`.
- `src/app/app.routes.ts`.
- `src/app/pages/vista-temporal/vista-temporal.component.ts`.
- `src/app/components/sidebar/modulos-navegacion.spec.ts`.
- `src/app/base-architecture.spec.ts`.
- Este informe.

El árbol de trabajo contiene otros cambios de intervenciones anteriores. No se atribuyen a esta corrección.

## Verificación

- Compilación de producción: correcta, navegador y SSR.
- TypeScript de aplicación y pruebas: correcto.
- ChromeHeadless: **117 de 117 pruebas correctas**.
- Comprobados los ocho grupos y 31 enlaces para el Administrador con las capacidades existentes.
- Comprobadas las once rutas preliminares, sus títulos y estados, ausencia de peticiones de negocio, opción activa y expansión.
- Comprobadas las tres páginas de Solicitudes al navegar entre ellas.
- Comprobados el rechazo de usuarios no autorizados y de sesiones ausentes.
- Comprobado que consultar preliminares no da acceso a Usuarios ni a otros CRUD.
- Conservadas las pruebas de rutas reales, pestañas, modo contraído, teclado y cajón móvil.
- Sin rutas ni destinos de menú duplicados.

Las comprobaciones de sesión se realizaron con pruebas aisladas en Angular. No se inició sesión como un funcionario real ni se ejecutaron operaciones oficiales.
