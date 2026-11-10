# Certificación por sesión: integración frontend preparada

## Actualización: contrato Laravel del 5 de noviembre de 2026

La auditoría original que sigue debajo es histórica. Se revisó el contrato actualizado en `../gpc_back/docs/session-certification-api-contract.md`, su informe y las rutas/controladores del backend, sin modificarlos. No existe una copia en `gpc_front/docs`.

Angular ya consume pendientes, beneficiarios y finalización:

- Asistencia nueva: `POST /api/attendance/create`, con `ID_PARTICIPACION`, `ID_ACTIVIDAD_SESION` y `ESTADO`. La selección rápida usa `PRESENTE`/`AUSENTE`; consulta luego `GET /api/attendance/{id}` para confirmar. Regularizar usa `PATCH /api/attendance/update/{id}` con los campos cambiados. Los borradores fallidos se conservan y no se repite un POST ambiguo sin consultar. Las marcas, cantidades, modal y sesión seleccionada se actualizan sin refrescar la página.
- Cierre: capacidades desde `GET /api/activity-session/{id}` y `POST /api/activity-session/{id}/finalizar` con contexto consistente. Requiere permiso efectivo y `puede_finalizarse` del servidor. Muestra los motivos exactos, incluidos los del 409. Tras el POST confirmado conserva Finalizada aunque falle la consulta posterior de capacidades. La actividad mantiene su estado.
- Certificar participantes depende de `puede_certificarse`, nunca de las marcas presentes ni del rol Administrador. El backend actual mantiene esa capacidad en false por falta del procedimiento y la relación persistente. Se ofrece consultar elegibilidad con los permisos efectivos.
- Generar y emitir conserva actividad/sesión y consulta `GET /api/certificaciones/pendientes`, `GET /api/activity-session/{id}/beneficiarios` y, para modalidad global, `GET /api/activity/{id}/beneficiarios-certificacion`. Usa filtros y paginación documentados, comprueba contexto y rechaza beneficiarios ajenos. Muestra contadores, tipos compatibles, registros administrativos y bloqueos reales.
- Preparar por sesión permanece bloqueado por falta de identidad persistente y procedimiento oficial. El contrato actualizado sí publica `POST /api/activity-session/{id}/preparar-certificados`, que devuelve 409 sin escrituras. Angular conserva la acción deshabilitada y no llama a certificados/create como alternativa. Se conservan prácticas, reconocimientos, preparaciones generales y el asistente único de cuatro pasos.
- Se mantienen cookie HttpOnly, interceptor autenticado y permisos efectivos. Los motivos funcionales y códigos HTTP se conservan.

Las pruebas verifican las peticiones con el controlador HTTP de Angular; no se añadieron mocks a la aplicación. No se realizaron escrituras institucionales para validar el flujo con un usuario real. Las políticas y la preparación por sesión pendientes pertenecen al backend y no pueden suplirse desde Angular.

### Verificación de la actualización

- TypeScript de aplicación y pruebas: correcto con `tsc --noEmit`.
- Pruebas de emisión, asistencia, servicios y detalle de actividad: **228/228 aprobadas**, salida 0. Registro: `integracion-sesion-tests-focalizados-final.log`.
- Suite completa ejecutada: **800/801 aprobadas**. Falló una prueba intermitente ajena de Solicitudes (`una decisión con error 0 no cambia el estado ni publica éxito`); otra ejecución falló en su variante 422. Se conserva la evidencia en `integracion-sesion-tests-final.log`; no se declara la suite completa aprobada.
- Compilación de producción: correcta, salida 0; advertencias existentes de presupuestos de bundle y estilos. Registro: `integracion-sesion-build-final.log`.
- `git diff --check`: correcto. Sin cambios en Laravel/PostgreSQL, sin commit ni push.

## Auditoría y alcance (histórico anterior al contrato actualizado)

Se revisaron las rutas Angular, Actividades y su detalle, tarjetas y formularios de sesión, inscripción contextual, matriz/modal de asistencia, GenerarEmitirComponent, FormularioCertificadoComponent, ListarCertificadosComponent, documentos emitidos, EmisionCertificadosService, guards, AuthService y el contrato de /api/auth/me. También se leyeron las rutas y contratos locales de Laravel sin modificarlos.

El backend local ofrece GET de actividad y sesión, inscripciones y marcas individuales de asistencia. Las sesiones tienen estado de texto editable mediante CRUD genérico, sin operación formal de finalización. No hay endpoint de elegibilidad ni bandeja de pendientes de certificación. El certificado administrativo admite id_participacion, id_practica o id_reconocimiento; no dispone de referencia a sesión ni de especialización contractual publicada para certificar una sesión. /api/auth/me proporciona permisos efectivos y capacidades de Solicitudes, sin capacidades específicas de certificación por sesión.

No se modificaron Laravel, PostgreSQL, rutas, guards, autenticación, interceptores, permisos ni el interruptor preexistente de escritura de emisión. No se crearon endpoints, servicios HTTP paralelos, datos de demostración, certificados ni documentos. No se hizo commit ni push.

## Archivos modificados

- `src/app/pages/actividades/detalle-actividad/detalle-actividad.component.html`: IDs reales en las tarjetas, pendientes y regularizaciones, espacio plegado de certificación, acciones reservadas e ingreso contextual de consulta.
- `src/app/pages/actividades/detalle-actividad/detalle-actividad.component.scss`: presentación compacta de ese espacio.
- `src/app/pages/actividades/detalle-actividad/detalle-actividad.component.spec.ts`: acciones deshabilitadas, ausencia de escrituras y contexto de sesión con actividad Activa.
- `src/app/pages/emision-certificados/generar-emitir/generar-emitir.component.{ts,html,scss}`: dos bandejas, validación de contexto mediante APIs existentes, modalidades diferenciadas y protección del asistente frente a URLs contextuales no respaldadas.
- `src/app/pages/emision-certificados/generar-emitir/certificacion-sesion-contexto.spec.ts`: validación HTTP, aislamiento, errores, cancelación de lecturas, limpieza desde ingreso general y prevención de preparación contextual prematura.
- Este documento y registros `certificacion-sesion-*.log`.

Se reutilizan DetalleActividadComponent, GenerarEmitirComponent, su único asistente de cuatro pasos, FormularioCertificadoComponent, ListarCertificadosComponent, EmisionCertificadosService, RouterLink/Angular Router y los modales de asistencia y ponentes existentes. No hay opción adicional en el Sidebar.

## Interfaz y navegación

Las cuatro acciones de sesión permanecen: Detalle, Ponentes, Inscribir participante y Asistencia. La asistencia sigue en su modal. Los contadores usan inscripciones y asistencias reales, distinguiendo presentes, ausentes, pendientes y registros por regularizar. No se deduce finalización por horario, estado de actividad, asistencia o ausencia de pendientes.

Cada tarjeta reserva Finalizar sesión y Certificar participantes dentro de un desplegable compacto. Ambas acciones permanecen deshabilitadas con explicación porque no hay contrato operativo de Laravel. El texto literal de estado de sesión se conserva: un valor histórico como culminado no habilita por sí solo la certificación.

Con el permiso efectivo emision.ver se ofrece Consultar certificación. Este enlace abre la pantalla existente:

`/certificaciones/generar-emitir?id_actividad=ID&id_sesion=ID&origen=participacion&modalidad=sesion`

Es un acceso de consulta, no una emisión ni una certificación habilitada. origen=participacion reutiliza el origen administrativo existente. modalidad=sesion es contexto interno de Angular; no se envía como un nuevo origen a la API. Nunca se exige cerrar toda la actividad para abrir esta consulta.

Generar y emitir valida IDs enteros positivos seguros, rechaza parámetros repetidos y exige el origen de participación para un contexto de actividad/sesión. Verifica mediante GET los IDs devueltos, nombres reales y pertenencia de sesión a actividad. Respeta actividades.ver y las respuestas de autorización del servidor. Un error no se transforma en un resultado vacío exitoso. Cambiar el contexto cancela las consultas anteriores y limpia la identidad previa.

En modo contextual solo se muestra la actividad/sesión confirmada y una explicación de integración pendiente. No se consulta una lista general para presentarla como si perteneciera a esa sesión. Aunque se añadan nuevo o editar a la URL, no se monta el formulario ni se prepara un certificado por sesión. Esta protección permanece incluso si se autoriza la escritura administrativa general.

La modalidad global se puede consultar mediante id_actividad, origen=participacion y modalidad=actividad. No reutiliza la sesión de otro contexto. Su cumplimiento y necesidad de cierre dependerán de la política global que publique Laravel.

## Las dos bandejas del módulo

- Pendientes de certificación: estado informativo de integración pendiente, sin cifras, beneficiarios ni elegibilidad calculados en Angular. No se invocan URLs de pendientes que no existen. Los filtros, paginación y selección de beneficiarios de esta bandeja requieren un contrato real.
- Preparaciones existentes: reutiliza ListarCertificadosComponent y sus filtros. El ingreso general conserva el comportamiento anterior y el listado no se destruye ni repite consultas al alternar bandejas. En contexto de sesión no se atribuyen certificados de actividad a una sesión: se ofrece salir explícitamente a las preparaciones generales.

El asistente de cuatro pasos se conserva: Seleccionar origen y registro, Preparar certificado, Revisar documento, Generar y emitir. Los orígenes participación, práctica y reconocimiento mantienen sus operaciones existentes. No se exigen sesiones o cierre de actividad a prácticas y reconocimientos.

Las preparaciones son registros administrativos; no prueban PDF, QR, código oficial, publicación ni firma aplicada. Se mantienen las advertencias y bloqueos existentes. La prevención definitiva de duplicados y las autorizaciones pertenecen a Laravel.

## Endpoints reales utilizados

| Finalidad | API existente |
| --- | --- |
| Identidad contextual de actividad | GET /api/activity/{id_actividad} |
| Identidad y pertenencia de sesión | GET /api/activity-session/{id_actividad_sesion} |
| Consultar preparaciones generales | GET /api/certificados/list, con paginación existente |
| Revisar preparación existente | GET /api/certificados/detail/{id} |
| Catálogo real de tipos | GET /api/tipos-certificado/list |
| Revisar orígenes administrativos | GET /api/participation/{id}, GET /api/practices/detail/{id} mediante su servicio existente, GET /api/reconocimientos/detail/{id} |

No se añadieron llamadas de finalización, elegibilidad ni preparación por sesión. Se conservan JWT HttpOnly, AUTHENTICATED_REQUEST, withCredentials mediante el interceptor existente y el manejo de 401/403/409/422. Angular no envía identidad del actor.

## Contratos que Laravel debe publicar

Las siguientes son condiciones para una integración futura; no son endpoints existentes ni rutas que Angular invoque:

1. Finalización independiente: operación transaccional para id_actividad_sesion, validación de actividad y autorización efectiva, incidencias de asistencia, transición institucional y auditoría del actor autenticado. Debe devolver el estado persistido y las operaciones autorizadas. No debe cerrar la actividad ni emitir certificados. El método y URL deben definirse y verificarse con Laravel antes de añadirlos al servicio HTTP.
2. Contexto certificable por sesión: id_actividad e id_actividad_sesion reales, confirmación explícita de finalización, tipo de certificado aplicable con su ID real y capacidades efectivas para consultar elegibilidad y preparar. No basta un nombre de rol ni inferir significado de un texto de estado. Una actividad Activa no debe invalidar por sí sola la certificación de una sesión finalizada.
3. Bandeja autorizada y paginada: actividad, área, tipo de actividad, sesión cuando corresponda, modalidad, origen real, estados de cierre y preparación, tipo de certificado determinado y cantidades de beneficiarios/elegibles/no elegibles/pendientes. Filtros por origen y actividad/sesión aplicados por el servidor y ámbito de áreas efectivo. No debe escribir certificados al consultarse.
4. Beneficiarios de sesión: id_persona e id_participacion reales, contexto de sesión, estado de elegibilidad y razones de validación faltante, tipo permitido, certificado existente y acciones autorizadas. Si no hay reglas institucionales suficientes debe devolver Pendiente de validación, sin porcentajes inventados ni equivalencia entre Presente y Elegible.
5. Preparación vinculada a sesión: la referencia a sesión debe persistirse y devolverse de forma inequívoca, como origen admitido o especialización real de participación. Laravel debe validar sesión finalizada, elegibilidad vigente, beneficiario, origen y tipo, con unicidad y concurrencia que distingan certificado por sesión de certificado global por actividad. Nunca debe reutilizarse silenciosamente un certificado global como certificado de sesión.
6. Histórico y emisión: definir restricciones y regularización autorizada después del cierre, trazabilidad del actor y operaciones independientes para preparar, generar documento oficial, emitir, firmar y publicar/verificar. Cada resultado debe estar respaldado por datos persistidos. Los servicios actuales no acreditan una generación oficial de PDF/QR ni firma criptográfica.

La institución debe aprobar estados finales, sesiones exigibles, tratamiento de ausencias, horas obligatorias, regularizaciones, compatibilidad entre tipos y orígenes, elegibilidad por sesión/global y política de reemisión. Esas reglas no se calculan ni se deciden en Angular.

## Verificación final

- Pruebas focalizadas de actividades e integración contextual de emisión: **70/70 correctas**. Registro: `certificacion-sesion-tests.log`.
- Suite completa ChromeHeadless: **795/795 correctas**, salida 0. Registro: `certificacion-sesion-tests-completos.log`.
- Compilación Angular de producción: correcta, salida 0, con advertencias de presupuesto de bundle y estilos. No se ampliaron presupuestos. Registro: `certificacion-sesion-build.log`.
- TypeScript de aplicación y pruebas con --noEmit: correcto; compiladores de pruebas y producción también correctos.
- `git diff --check`: sin errores. El repositorio backend permanece sin cambios.

Se probaron IDs y pertenencia verificadas por Laravel, sesiones de otras actividades, parámetros inválidos y repetidos, actividad Activa en contexto de sesión, diferencias entre modalidad global y de sesión, 401/403/409/422, cancelación de consultas al cambiar de contexto, limpieza al volver al ingreso general, preservación del listado entre bandejas, protección ante nuevo/editar manipulados y ausencia de escrituras o rutas inexistentes. Las pruebas existentes cubren Sidebar, asistencia en modal, inscripción, prácticas, reconocimientos, duplicados administrativos y el asistente de cuatro pasos.
