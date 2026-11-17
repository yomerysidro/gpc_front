# Verificación autenticada pendiente: Capacitación Personal

La comprobación local no dispone de la cookie HttpOnly del navegador ni de una
sesión de navegador conectada. La consulta sin credenciales al catálogo respondió
HTTP 401. Esto no acredita una restricción del administrador ni permite afirmar
el estado persistido de ninguno de los cuatro certificados.

| Beneficiario | Sesión | Estado persistido comprobado |
| --- | --- | --- |
| Antón Talián | 001 | Pendiente de consulta autenticada |
| Maria Perez | 001 | Pendiente de consulta autenticada |
| Juan Alcalde | 002 | Pendiente de consulta autenticada |
| Antón Talián | 002 | Pendiente de consulta autenticada |

## Comprobación desde el navegador del administrador

Las siguientes consultas son de lectura y usan la sesión ya iniciada. Los IDs
deben obtenerse de las respuestas reales, sin deducirlos de los nombres 001/002.

1. Abrir **Generar y emitir → Capacitación Personal → Sesión N.º 002**.
   En Red, comprobar `/api/auth/me`, la actividad, el ID real de sesión y el tipo
   seleccionado. El listado general de certificados no debe enviar filtros de
   propietario o área del administrador.
2. Revisar `GET /api/activity-session/{sesion}/beneficiarios` y, para cada
   participante, `GET /api/certificados/list` con `id_participacion`, `id_sesion`
   e `id_tipo_certificado`. Recorrer todas las páginas y comprobar también la
   persona y actividad. Contar los certificados/documentos distintos para esa
   combinación; dos personas con el mismo nombre no se identifican por su nombre.
3. Abrir **Ver certificado** y comprobar
   `GET /api/certificados-documentos/detail/{documento}?flujo=firmas`.
   Deben coincidir certificado, documento, beneficiario, sesión, tipo y actividad.
   Consultar `GET /api/certificados-documentos/{documento}/firma/progreso` para
   verificar asignación, revisión del PDF y disponibilidad.
4. Comprobar la representación del estado: `PREPARADO` sin disponibilidad y con
   facultad de remisión permite **Enviar a Gerencia**; `PENDIENTE_FIRMA` muestra
   **Enviado a Gerencia**; la disponibilidad confirmada muestra **Listo para
   entrega** y retira el envío. Un marcador de preparación sin disponibilidad
   no acredita entrega.
5. En el PDF autorizado del mismo ID documental, comprobar beneficiario,
   actividad, sesión, firmantes, código y QR. Comparar el hash del PDF con el
   detalle. El QR debe consultar `/api/certificados/verificar/{codigo}` con el
   código de ese documento; comprobar los identificadores que aporte la respuesta.
6. En **Certificados emitidos**, pulsar **Actualizar** y comprobar la nueva
   respuesta de `/api/certificados/list`, sin caché. Repetir tras recargar y filtrar
   cada sesión. Solo acreditar cuatro listos si la API confirma disponibilidad
   de los cuatro documentos. Un cuarto documento pendiente no equivale a un
   cuarto listo para entrega.

Las pruebas Angular usan datos de prueba. No acreditan persistencia, QR reales
ni ausencia de duplicados en los registros institucionales. Esta comprobación
local no ejecutó preparación, remisión ni confirmación sobre registros reales.
