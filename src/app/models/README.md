# Modelos

Crear modelos solo cuando exista una necesidad real, dentro de una subcarpeta
por funcionalidad: `models/nombre-funcionalidad/nombre.model.ts`.
No colocar modelos directamente en esta carpeta ni crear subcarpetas por adelantado.

Los contratos simples pertenecen a `core/interfaces/nombre-funcionalidad/`.
El sidebar plano usa `NavigationItem` (`label`, `path`); no necesita otro modelo
equivalente. Si requiere jerarquía en el futuro, revisar ese contrato y sus
consumidores antes de crear tipos adicionales.

`CertificadoRow` está en `core/interfaces/certificado/certificado.interface.ts`.
No duplicarlo aquí ni añadir modelos de certificados con campos supuestos.
