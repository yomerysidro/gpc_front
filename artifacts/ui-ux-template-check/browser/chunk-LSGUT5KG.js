import {
  HttpErrorResponse
} from "./chunk-IJ23LC2U.js";

// src/app/shared/utils/error-api.ts
var MENSAJE_GENERICO = "No se pudo completar la operaci\xF3n. Intenta nuevamente.";
function aErrorApi(error) {
  if (!(error instanceof HttpErrorResponse)) {
    return { status: 0, mensaje: MENSAJE_GENERICO, errores: {} };
  }
  const cuerpo = error.error;
  const mensaje = typeof cuerpo?.message === "string" && cuerpo.message ? cuerpo.message : MENSAJE_GENERICO;
  return { status: error.status, mensaje, errores: error.status === 422 ? erroresPorCampo(cuerpo) : {} };
}
function erroresPorCampo(cuerpo) {
  if (cuerpo?.errors && typeof cuerpo.errors === "object") {
    return cuerpo.errors;
  }
  if (cuerpo?.data && typeof cuerpo.data === "object" && !Array.isArray(cuerpo.data)) {
    return Object.fromEntries(Object.entries(cuerpo.data).filter((par) => typeof par[1] === "string").map(([campo, texto]) => [campo, [texto]]));
  }
  return {};
}

export {
  aErrorApi
};
//# sourceMappingURL=chunk-LSGUT5KG.js.map
