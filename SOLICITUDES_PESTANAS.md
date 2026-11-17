# Solicitudes: presentación en dos pestañas

## Menú y rutas

El grupo SOLICITUDES del Sidebar conserva únicamente «Mis solicitudes».
Se retiró su entrada visual «Nueva solicitud de actividad». Las opciones de
Recursos Humanos, Gerencia y los demás grupos no cambian.

Se conservan las URL y sus permisos:

- `/solicitudes` redirige a `/solicitudes/mis-solicitudes`.
- `/solicitudes/mis-solicitudes`: `solicitudes.propias`.
- `/solicitudes/nueva`: `solicitudes.crear`; la edición por `?editar=ID` conserva
  el guard existente de `solicitudes.editar`.
- `/solicitudes/revision` continúa como la vista independiente de RR. HH.

Nueva solicitud ya no depende de la definición del Sidebar para registrar su ruta.
Mis solicitudes permanece resaltada en el Sidebar también al visitar Nueva solicitud.

## Componentes reutilizados

`MisSolicitudesComponent` organiza las dos vistas originales, sin crear una página,
un formulario o un CRUD alternativo:

- `BandejaSolicitudesComponent` mantiene título, información, indicadores, filtros,
  búsqueda, tabla, estados, paginación, detalle e historial. Se instancia al activar
  Mis solicitudes y vuelve a consultar Laravel al regresar desde Nueva solicitud.
- `NuevaSolicitudComponent` conserva íntegros sus dos pasos, campos, validaciones,
  catálogos autorizados, borradores y envío. No se modificó su implementación.

La presentación utiliza las mismas clases globales `.pestanas` y el archivo de
estilos de `GestionTabsComponent`, usado por Configuración General. Incluye roles
tab/tablist/tabpanel, selección accesible y navegación con flechas, Home y End.

## Estado y permisos

El formulario se crea al visitar Nueva solicitud por primera vez y se mantiene
oculto al volver a Mis solicitudes dentro del módulo. No se duplica su instancia.
Alternar las pestañas conserva los campos, el paso de revisión, el ID/versionado
del borrador y el parámetro `editar`, sin volver a guardar ni recargar sus catálogos.

El envío sigue siendo el del componente original. Después de una confirmación real
del servidor, su navegación existente a Mis solicitudes activa el listado y elimina
la instancia del formulario enviado; una nueva solicitud empieza de nuevo.
Salir del módulo destruye su estado de presentación. No se guardan formularios en
localStorage ni se incorpora una estrategia global de reutilización de rutas.

La pestaña Nueva solicitud requiere el permiso efectivo `solicitudes.crear`.
El botón correspondiente del listado también se oculta sin ese permiso y conserva
la habilitación de creación que ya devolvía el contexto del backend.
La consulta no exige permiso de creación. Los guards y las claves RBAC se conservan.

No se cambiaron servicios HTTP, DTO, endpoints, JWT, interceptores, permisos del
backend, Laravel ni PostgreSQL. No se instalaron dependencias.

## Archivos modificados

- `src/app/app.routes.ts`
- `src/app/components/sidebar/modulos-navegacion.ts`
- `src/app/components/sidebar/modulos-navegacion.spec.ts`
- `src/app/components/sidebar/pantallas-pendientes.spec.ts`
- `src/app/pages/solicitudes/mis-solicitudes/mis-solicitudes.component.ts`
- `src/app/pages/solicitudes/mis-solicitudes/mis-solicitudes.component.html`
- `src/app/pages/solicitudes/compartidos/bandeja-solicitudes.component.ts`
- `src/app/pages/solicitudes/compartidos/bandeja-solicitudes.component.html`
- `src/app/pages/solicitudes/solicitudes.component.spec.ts`
- Este documento.

## Verificación

Las pruebas cubren el enlace único del Sidebar, URL directas, pestaña inicial,
formulario original, botón de navegación, conservación del paso de revisión y del
borrador, recarga del listado, retorno tras el envío y usuarios de solo consulta.
Las verificaciones HTTP usan el arnés existente, sin escrituras en Laravel.

Resultado: **712 pruebas correctas** en ChromeHeadless y compilación Angular de
producción completada con código de salida 0. Se mantienen advertencias de tamaño
de bundles/estilos, sin errores de compilación. `git diff --check` sin errores.
