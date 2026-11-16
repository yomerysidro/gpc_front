# Integración Angular de certificados por origen

Fecha: 13 de noviembre de 2026.

## Alcance implementado

Se mantiene `/certificaciones/generar-emitir` y se integran los orígenes `reconocimiento` y `practica` mediante pestañas compactas junto a Capacitación. No se crean rutas laterales, actividades, solicitudes ni sesiones para estos registros.

La consulta utiliza los registros reales y su evaluación individual. Beneficiario, título, motivo, fecha, periodo, área, institución y carrera se presentan únicamente cuando los proporciona la evaluación. El estado del origen se muestra separado de la elegibilidad y del estado documental. Las facultades y los motivos de bloqueo proceden del servidor; `ca`, `activo` y las asistencias no se usan como autorización para estos orígenes.

La preparación revisa el PDF de Laravel, verifica su SHA-256 y confirma el token de esa revisión sin enviar texto, beneficiario, actividad, sesión ni tipo desde el cliente. Después de guardar se recupera el detalle persistido y se muestra su PDF privado. Guardar no remite a Gerencia. La revisión de envío y su confirmación son acciones explícitas diferentes y reutilizan el servicio documental actual.

Un certificado existente se recupera mediante `/certificados/detail/{id}` y el detalle documental, incluso cuando todavía no aparece en el catálogo de disponibles. No se sustituye la ausencia en el catálogo por una nueva generación. La revisión se conserva tras un fallo de guardado para permitir confirmar de nuevo el mismo token; Laravel resuelve la idempotencia. Un documento ya remitido se consulta sin presentar otro envío habilitado.

Se reutiliza `VisorPdfComponent` con PDF.js, zoom, desplazamiento, descarga, impresión y apertura del PDF. No se reconstruye el documento en HTML ni se modifica su contenido, código, QR o versión desde Angular. La consulta de certificados conserva su visor en página completa.

Gerencia conserva sus dos pestañas y sus servicios de funcionarios habilitados, selección, modalidad, orden, revisión, asignación y confirmación. Los nuevos documentos no exigen sesión. La disponibilidad para RR. HH. depende de la confirmación persistida del PDF y continúa en el catálogo existente. No se registra una entrega ni se declara firma criptográfica o emisión oficial.

Los filtros de certificados conservan actividad, sesión y búsqueda de beneficiario y añaden un selector sencillo de tipo obtenido de los documentos autorizados. Los registros sin sesión permanecen visibles. Origen, reconocimiento o periodo sustituyen los textos de actividad/sesión ausentes.

En el detalle de actividad se añade una consulta compacta, desplegable y sin edición de ponentes. Se cruzan las asignaciones reales de `activity-speaker` con los catálogos existentes de ponentes y personas. No se atribuye una asociación de actividad a todas sus sesiones.

## Catálogos y Capacitación

Se consulta `/certificaciones/catalogos-origenes` al consultar los nuevos orígenes cuando el usuario cuenta con el permiso de Actividades. Sus catálogos son independientes; no se equiparan sus claves. Cada evaluación determina el tipo documental del origen y la autorización para prepararlo. La bandeja de Capacitación filtra los tipos documentales explícitamente activos sin asumir sus IDs.

`/solicitudes/nueva` conserva su asistente y su consulta existente de tipos de actividad activos a `/ativicty-type?estado=1`. No necesita opciones artificiales ni cambiar su selección. Según el contrato del backend, el catálogo de actividades comprobado contiene Capacitación; que existan los tipos documentales Reconocimiento y Prácticas no crea tipos de actividad equivalentes.

El flujo de sesiones, participantes, asistencia, elegibilidad, mensaje editable de Capacitación y preparación por participación/sesión/tipo se conserva. No se cambian la plantilla ni los PDFs de Capacitación.

## Bloqueos conservados

- La configuración predeterminada de Laravel no acredita los estados libres de reconocimientos y prácticas. Los casos reales siguen en consulta hasta que el servidor acredite autorización y requisitos mediante una política institucional aprobada y evidencia suficiente.
- Prácticas exige además periodo real concluido, identidad coherente y supervisión acreditada que cubra el periodo. Angular no deduce esos requisitos de las fechas o de un estado visual.
- Un reconocimiento para un ponente externo sin trabajador real no está respaldado por el origen actual.
- No existe la relación persistida necesaria para acreditar automáticamente un reconocimiento por ponencia o por sesión. Mostrar un ponente de actividad no habilita esa preparación.
- No se habilitan firma criptográfica, emisión oficial ni entrega registrada donde el backend no las acredita.

## Archivos de esta integración

Rutas relativas a `gpc_front`. El repositorio ya tenía cambios de trabajos anteriores; esta lista identifica exclusivamente los archivos tocados por esta integración.

Modelos y servicios:

- `src/app/core/interfaces/emision-certificados/origenes-certificado.interface.ts` (nuevo).
- `src/app/core/interfaces/emision-certificados/origenes-certificado.fixture.ts` (nuevo; datos sintéticos de pruebas).
- `src/app/core/interfaces/emision-certificados/catalogo-certificados.interface.ts`.
- `src/app/core/services/emision-certificados/emision-certificados.service.ts`.
- `src/app/core/services/emision-certificados/documentos-digitales.service.ts`.
- `src/app/core/services/emision-certificados/origenes-certificado.spec.ts` (nuevo).

Generar y emitir:

- `src/app/pages/emision-certificados/generar-emitir/generar-emitir.component.ts`.
- `src/app/pages/emision-certificados/generar-emitir/generar-emitir.component.html`.
- `src/app/pages/emision-certificados/generar-emitir/preparacion-origen.component.ts` (nuevo).
- `src/app/pages/emision-certificados/generar-emitir/preparacion-origen.component.html` (nuevo).
- `src/app/pages/emision-certificados/generar-emitir/preparacion-origen.component.spec.ts` (nuevo).
- `src/app/pages/emision-certificados/generar-emitir/bandeja-certificacion.spec.ts`.
- `src/app/pages/emision-certificados/generar-emitir/certificacion-sesion-contexto.spec.ts` (fixtures con tipo activo explícito).

Actividad y ponentes:

- `src/app/pages/actividades/detalle-actividad/detalle-actividad.component.ts`.
- `src/app/pages/actividades/detalle-actividad/detalle-actividad.component.html`.
- `src/app/pages/actividades/detalle-actividad/ponentes-actividad.component.ts` (nuevo).
- `src/app/pages/actividades/detalle-actividad/ponentes-actividad.component.spec.ts` (nuevo).

Catálogo y visor:

- `src/app/pages/emision-certificados/documentos/listar-documentos/listar-documentos.component.ts`.
- `src/app/pages/emision-certificados/documentos/listar-documentos/listar-documentos.component.html`.
- `src/app/pages/emision-certificados/documentos/listar-documentos/listar-documentos.component.spec.ts`.
- `src/app/pages/emision-certificados/documentos/ver-documento.component.ts`.

Gerencia:

- `src/app/pages/gerencia/documentos-por-firmar/documentos-por-firmar.component.html`.
- `src/app/pages/gerencia/documentos-por-firmar/documentos-por-firmar.component.spec.ts`.
- `src/app/pages/gerencia/documentos-por-firmar/detalle-documento.component.ts`.
- `src/app/pages/gerencia/documentos-por-firmar/detalle-documento.component.html`.
- `src/app/pages/gerencia/documentos-por-firmar/detalle-documento.component.spec.ts`.

Documentación: este archivo. Las ejecuciones generan registros `origenes-*.log` y el build en `dist/gpc_front`.

## Verificación

Los casos nuevos comprueban catálogos con IDs independientes, integración de ambos orígenes en la pantalla existente, consulta elegible/bloqueada, estados libres sin autorización, PDF recibido y hash, confirmación exacta, guardado sin envío, envío explícito, recuperación del documento existente, errores 401/403/404/409/422, catálogo común sin sesión y ambas pestañas de Gerencia.

También comprueban la confirmación de reconocimientos y prácticas sin sesión usando el plan actual de funcionarios y la misma identidad documental, hasta la disponibilidad para RR. HH. Las regresiones conservan solicitudes, Capacitación, asistencia, sesiones distintas para una persona, sidebar, PDF.js real, código/QR, zoom y posición al cambiar responsables, descarga y visor en página completa.

Las pruebas usan HTTP simulado y datos sintéticos. No certifican una política de producción ni constituyen una prueba autenticada de escritura contra registros municipales reales.

- TypeScript de aplicación y pruebas: sin errores.
- Pruebas focalizadas: 183 aprobadas en `origenes-focused-final.log`.
- Suite completa final: 1127 aprobadas en `origenes-suite-final.log`. Incluye las regresiones de solicitudes, Capacitación, Gerencia, PDF.js y sidebar.
- Build de producción final: compilación y prerender completados; salida en `dist/gpc_front`. Registro: `origenes-build-final.log`. Conserva advertencias de presupuesto del bundle inicial y de estilos; no se modificaron los límites para silenciarlas.
- `git diff --check` de los componentes y servicios revisados: sin errores.

No se modificaron Laravel, PostgreSQL, certificados históricos ni archivos PDF confirmados. No se instalaron dependencias ni se realizaron commits o push.

## Ampliación: participantes y ponentes de una sesión

La pantalla conserva el título «Generar y emitir» y ofrece las pestañas Capacitación, Reconocimientos y Prácticas, con navegación de teclado. Capacitación mantiene sus ámbitos por sesión y por actividad y su asistente documental. Cambiar de pestaña no transforma un reconocimiento individual o una práctica en un certificado de sesión. Se conservan los filtros de Capacitación al regresar desde otra pestaña.

El selector de sesiones utiliza las sesiones reales ya consultadas y filtradas por actividad. Cambiar de actividad borra la selección de sesión anterior. En beneficiarios se muestran la actividad, sesión, estado y los contadores recibidos; fecha y número se presentan cuando están disponibles en la sesión consultada.

La sección Participantes conserva la tabla y las acciones actuales. La sección desplegable Ponentes consulta exclusivamente `GET /activity-session/{id}/ponentes-certificacion` al abrirla. Esta carga independiente permite seguir certificando participantes cuando falta el permiso o la acreditación de ponentes. Cada respuesta debe corresponder a la actividad y sesión seleccionadas; cambiar de contexto cancela la consulta anterior y descarta sus datos. Recargar la pantalla obliga a consultar nuevamente al servidor.

El contrato vigente devuelve `ponentes_actividad` y `ponentes_sesion: null`, `relacion_ponente_sesion_disponible: false`, `puede_preparar: false`. Por eso la tabla presenta candidatos de actividad, «Sin acreditación registrada», tipo de reconocimiento «No determinado» y «Preparar reconocimiento» deshabilitado. El aviso es «El ponente aún no está vinculado a esta sesión». No se asigna a esos candidatos una sesión ni un tipo documental acreditado desde Angular, ni se genera un mensaje o PDF de ponencia. Una respuesta de un futuro contrato no interpretado tampoco habilita una operación inexistente.

### Capacidad exacta pendiente de Laravel

Para completar el reconocimiento por sesión faltan las referencias persistidas entre reconocimiento y `actividad_ponente`, y entre ese reconocimiento/intervención y `actividad_sesion`. Debe verificarse que la sesión pertenezca a la misma actividad, que el ponente corresponda a la persona beneficiaria y que el origen del reconocimiento acredite esa intervención, con unicidad de beneficiario/sesión/origen/tipo. Para externos sin trabajador real falta además que el origen admita su identidad real.

El backend deberá exponer esa acreditación, su elegibilidad, tipo documental, certificados existentes y facultades junto con una operación de preparación documentada que valide el vínculo y utilice la plantilla autorizada. Hoy la preparación de reconocimiento municipal acepta únicamente el ID del reconocimiento y no acredita una sesión. En consecuencia, las pruebas de ponente elegible y PDF de reconocimiento por sesión no pueden declararse operativas con este contrato; se prueba su bloqueo y la conservación de la preparación de participantes.

### Archivos de esta ampliación

- `src/app/pages/emision-certificados/generar-emitir/generar-emitir.component.ts`.
- `src/app/pages/emision-certificados/generar-emitir/generar-emitir.component.html`.
- `src/app/pages/emision-certificados/generar-emitir/origenes-tabs.component.ts` (nuevo).
- `src/app/pages/emision-certificados/generar-emitir/origenes-tabs.component.spec.ts` (nuevo).
- `src/app/pages/emision-certificados/generar-emitir/ponentes-sesion.component.ts` (nuevo).
- `src/app/pages/emision-certificados/generar-emitir/ponentes-sesion.component.spec.ts` (nuevo).
- `src/app/pages/emision-certificados/generar-emitir/bandeja-certificacion.spec.ts`.
- `src/app/pages/emision-certificados/generar-emitir/certificacion-sesion-contexto.spec.ts`.
- Este informe.

No se modificaron las pantallas de Gerencia, RR. HH., Certificados emitidos ni sus visores o servicios durante esta ampliación. Sus regresiones se incluyen en la suite completa. No se eliminaron pruebas; dos expectativas visuales anteriores se adaptaron a las tres pestañas solicitadas.

Verificación de esta ampliación:

- TypeScript de aplicación y pruebas: sin errores, código de salida 0.
- Pruebas focalizadas: 196 aprobadas en `ponentes-sesion-focused.log`.
- Suite completa final: 1146 aprobadas, código de salida 0, en `ponentes-sesion-suite.log`. Incluye los dos casos adicionales que mantienen preparable al participante ante bloqueos de ponentes, más las regresiones de mensaje, PDF/código/QR, guardado separado del envío, responsables habilitados, confirmación, disponibilidad, catálogo, visor y sidebar.
- Build de producción: correcto, código de salida 0, con cuatro rutas prerenderizadas. Mantiene advertencias de presupuesto del bundle inicial y estilos. Registro: `ponentes-sesion-build.log`. No se modificaron los límites del build.
- `git diff --check` del área modificada: sin errores.

Estas verificaciones usan datos sintéticos y HTTP simulado; no generan certificados municipales reales. La preparación de ponentes elegibles por sesión y su plantilla siguen sin poder verificarse como flujo operativo hasta que Laravel ofrezca la acreditación y preparación descritas arriba.
