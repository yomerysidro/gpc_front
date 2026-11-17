import './polyfills.server.mjs';

// src/app/core/interfaces/emision-certificados/estado-revision.ts
function pdfConfirmado(estado) {
  return (estado?.pdf_confirmado ?? estado?.pdf_revisado_disponible ?? estado?.documento?.pdf_confirmado ?? estado?.documento?.pdf_revisado_disponible) === true;
}
function listoParaEntrega(estado) {
  return pdfConfirmado(estado) && (estado?.disponible_rrhh ?? estado?.documento?.disponible_rrhh) === true;
}

export {
  pdfConfirmado,
  listoParaEntrega
};
//# sourceMappingURL=chunk-7CXPU5UM.mjs.map
