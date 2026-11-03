# Gestión

Implementado sobre Angular 18.2, dentro del `PrivateLayoutComponent` existente.
Las diez páginas se cargan de forma diferida y comparten el componente de registros,
los controles de formulario, las tablas adaptables y los diálogos existentes.
Cada tabla tiene carpeta y archivos `.ts`, `.html` y `.scss` propios.

## Acceso

| Opción del sidebar | Tabla | Ruta del frontend |
| --- | --- | --- |
| Personas | persona | /gestion/personas |
| Personas / Documentos | persona_documento | /gestion/personas/documentos |
| Trabajadores | persona_trabajador | /gestion/trabajadores |
| Prácticas | practica | /gestion/practicas |
| Prácticas / Practicantes | persona_practicante | /gestion/practicas/practicantes |
| Prácticas / Supervisores | practica_supervisor | /gestion/practicas/supervisores |
| Ponentes | persona_ponente | /gestion/ponentes |
| Configuración / Áreas | area | /gestion/configuracion |
| Configuración / Tipos de documento | tipo_documento | /gestion/configuracion/tipos-documento |
| Configuración / Instituciones | institucion | /gestion/configuracion/instituciones |

Se conserva la agrupación solicitada. Un supervisor es un **trabajador asignado a
una práctica**, por eso la asignación se administra en Prácticas y selecciona a un
trabajador real. Un practicante se registra antes de crear su práctica.

## Contratos comprobados en gpc_back

Fuentes: `routes/api.php`, los diez controladores, sus clases `Http/Data`, modelos,
`Traits/ApiResponse.php`, `Services/Auth/ModulePermissions.php`,
`config/module_permissions.php` y `Http/Data/GestionIntegrity.php`.

Los prefijos son `persons`, `person-documents`, `person-workers`, `practices`,
`practicing-individuals`, `supervisory-internships`, `person-speakers`, `areas`,
`document-types` e `institutions`. Todos exponen:

- GET `/{prefijo}/list`: `{ success, message, data: Registro[] }` sin paginación de servidor.
- GET `/{prefijo}/detail/{id}`: `{ success, message, data: Registro }`.
- POST `/{prefijo}/create`.
- PUT `/{prefijo}/update/{id}`.
- DELETE `/{prefijo}/delete/{id}`.

El servicio usa exclusivamente `environment.apiBaseUrl` y marca las solicitudes
con `AUTHENTICATED_REQUEST`. El interceptor existente envía las cookies y maneja
la sesión expirada. No se leen tokens ni se omiten controles del backend.

Los nombres de campos, IDs, nulabilidad, tipos y longitudes están descritos en
`core/services/gestion/gestion.models.ts` y `gestion.config.ts`. Los estados son
texto libre donde Laravel valida `string`; solamente trabajadores y tipos de
documento usan booleanos. No se inventan catálogos de estados. Las fechas finales
deben ser iguales o posteriores a la fecha inicial. Los formularios preservan
`false`, envían IDs numéricos y convierten campos opcionales vacíos a `null`.

Los errores 422 de este módulo llegan en `data: { campo: string[] }`; también se
acepta el formato `errors` de Laravel. Los conflictos 409 se presentan con el
mensaje original (dependencias, identidad histórica o unicidad). El borrado
requiere confirmación y no elimina dependencias automáticamente.

El listado filtra y pagina en el navegador porque `/list` devuelve la colección
completa. Las relaciones se consultan de forma independiente: el fallo de un
catálogo no oculta la lista principal. Si falta una relación obligatoria o no
contiene registros, se bloquea guardar; no se inventan opciones. Los documentos
de las personas se obtienen de `person-documents/list` y `document-types/list`.
Si no están disponibles se informa de ello, sin presentar una lista ficticia.

## Bloqueos de autorización existentes en el backend

| Tablas | Módulo configurado | Permisos comprobados |
| --- | --- | --- |
| persona, persona_documento, area, tipo_documento, institucion | `null` | No hay clave autorizable configurada |
| persona_trabajador, persona_ponente | `ponentes-firmantes` | `.ver`, `.crear`, `.editar`, `.eliminar` |
| practica, persona_practicante, practica_supervisor | `practicantes` | `.ver`, `.crear`, `.editar`, `.eliminar` |

La configuración `null` hace que `ModulePermissions::allows()` devuelva `false`,
incluso para un administrador. Se necesita que el responsable del backend
defina el módulo institucional y sus accesos antes de poder consultar esas cinco
tablas. Después debe actualizarse el mapeo confirmado `GESTION_RECURSOS` del
frontend. Este trabajo **no** cambia esa configuración ni asigna permisos.
Los catálogos bloqueados también impiden completar formularios que dependen de
ellos. Los mensajes explican la causa y las acciones se limitan a los permisos
existentes del usuario.

## Verificación

- `npm.cmd run build`: correcto, incluyendo compilación del navegador, SSR y prerenderizado.
- 18 pruebas de Gestión y navegación correctas en ChromeHeadless: contratos HTTP,
  cookies, errores 422/409, fechas, estado inactivo, confirmación cancelada,
  catálogos no disponibles, unión de documentos y las diez rutas.
- `git diff --check`: correcto.

Las pruebas de servicio, formularios y navegación emplean respuestas simuladas;
no crean, editan ni eliminan registros reales. Una consulta GET sin cookie a
`persons/list` y `practices/list` devolvió 401, confirmando la protección. No hay
una sesión de navegador disponible para estas herramientas, por lo que la
validación de lectura con un usuario autorizado queda pendiente.
