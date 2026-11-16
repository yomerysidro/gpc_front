# Cierre de reconocimientos por actividad — 13 de noviembre de 2026

Se contrastó la integración existente con `gpc_back/docs/certificate-origins-api-contract.md`. No se repitió la implementación previa ni se modificó Laravel, la base de datos, Capacitación, Gerencia o RR. HH.

La integración existente consulta `/activity/{id}/ponentes-certificacion`, utiliza el ID real de `actividad_ponente` y prepara mediante `/certificaciones/ponente_actividad/{id}/preparar` con `modalidad_reconocimiento: actividad`, sin sesión. El acceso desde una sesión distingue las facultades independientes de actividad. Se conserva el bloqueo de la modalidad por sesión y el HTTP 409.

El formulario documental existente revisa el mensaje y PDF del backend, conserva su hash y utiliza PDF.js. Guardar y continuar no remite el documento: Enviar a Gerencia exige una acción posterior. La recuperación de antecedentes y de operaciones persistidas evita otra preparación. El catálogo admite documentos por actividad con sesión NULL.

En esta revisión solo se completaron dos detalles de carga:

- La consulta de ponentes desde una sesión termina a los 30 segundos si no recibe respuesta y permite reintentar.
- La tabla de reconocimientos limpia el indicador de carga al recibir un nuevo contexto con candidatos ya consultados.
- Se añadieron dos pruebas para esos comportamientos, sin eliminar pruebas existentes.

Archivos de código modificados en esta revisión: `ponentes-sesion.component.ts`, `ponentes-sesion.component.spec.ts`, `reconocimientos-actividad.component.ts` y `reconocimientos-actividad.component.spec.ts`, en `src/app/pages/emision-certificados/generar-emitir/`.

Los bloqueos restantes del contrato corresponden a la acreditación persistente por sesión, externos sin referencia laboral compatible y políticas institucionales de reconocimientos genéricos/prácticas. No se sustituyen con autorizaciones locales. No hay un bloqueo adicional documentado para la modalidad por actividad elegible.

Las pruebas usan HTTP simulado y datos sintéticos; no acreditan una emisión real ni verifican el despliegue o los permisos de un usuario de producción. No se crearon documentos municipales ni se modificaron PDFs históricos. No se hizo commit ni push.

## Verificación final

- Suite Angular: **1176 aprobadas**, cero fallos, salida 0; `reconocimiento-final-tests-reintento.log`. Incluye regresiones de Capacitación, Prácticas, Gerencia, catálogo, visor, permisos y navegación. La primera ejecución tuvo 1175 aprobadas y un fallo de medición del layout que no se reprodujo al repetir la suite completa; no se modificó esa prueba.
- TypeScript de aplicación y pruebas: salida 0 en ambos casos.
- Build de producción: aplicación generada, cuatro rutas prerenderizadas y salida en `dist/gpc_front`; `reconocimiento-final-build.log`. Advertencias de presupuesto de bundle y estilos. PowerShell marcó su redirección de stderr como `NativeCommandError` y la envoltura devolvió 1 aunque Angular informó `Application bundle generation complete`; no se afirma salida 0 de esa envoltura.
- Los primeros intentos de Chrome/build dentro del aislamiento fallaron por restricciones del entorno; se ejecutaron nuevamente con autorización fuera del aislamiento.
