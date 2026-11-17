import './polyfills.server.mjs';

// src/app/pages/emision-certificados/compartidos/estado-emision.ts
function estadoActivo(valor) {
  return valor === true || valor === 1 || ["1", "true", "activo", "activa"].includes(String(valor).trim().toLowerCase());
}
function documentoAnulado(estado) {
  return estado?.trim().toUpperCase() === "ANULADO";
}
function etiquetaEstado(valor) {
  if (typeof valor === "boolean" || valor === 0 || valor === 1)
    return estadoActivo(valor) ? "Activo" : "Inactivo";
  return valor === null || valor === void 0 || valor === "" ? "No informado" : String(valor);
}

export {
  estadoActivo,
  documentoAnulado,
  etiquetaEstado
};
//# sourceMappingURL=chunk-UBX3EAES.mjs.map
