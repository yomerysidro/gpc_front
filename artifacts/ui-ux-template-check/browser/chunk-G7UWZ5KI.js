// src/app/core/interfaces/emision-certificados/catalogo-certificados.interface.ts
function origenCatalogo(fila) {
  if (fila.origen === "ponente_actividad")
    return [fila.actividad, "Reconocimiento por actividad"].filter(Boolean).join(" \xB7 ");
  if (fila.origen === "reconocimiento" || fila.id_reconocimiento)
    return fila.titulo_reconocimiento || "Reconocimiento municipal";
  if (fila.origen === "practica" || fila.id_practica)
    return ["Pr\xE1cticas", fila.fecha_inicio_practica, fila.fecha_fin_practica].filter(Boolean).join(" \xB7 ");
  return [fila.actividad, fila.sesion].filter(Boolean).join(" \xB7 ") || "Origen no informado";
}
function estadoCatalogo(fila) {
  if (fila.origen === "practica" || fila.id_practica)
    return estadoDocumentalPractica(fila);
  if (!fila.id_certificado_documento)
    return "Sin documento";
  if (fila.emision_oficial_verificada === true && fila.firma_verificada === true)
    return "Emitido";
  if (fila.firma_verificada === true)
    return "Firmado";
  if (fila.pdf_confirmado === true && fila.disponible_rrhh === true)
    return "Listo para entrega";
  if (fila.estado_certificado === "PENDIENTE_FIRMA")
    return "Pendiente de firma";
  if (fila.estado_certificado === "PREPARADO")
    return "Preparado";
  if (["FIRMADO", "EMITIDO"].includes(fila.estado_certificado))
    return "Documento hist\xF3rico";
  if (/listo para entrega|preparado para entrega|firmado|emitido|entregado/i.test(fila.etiqueta_estado ?? ""))
    return "Documento hist\xF3rico";
  return fila.etiqueta_estado || fila.estado_documental || "Documento hist\xF3rico";
}
function estadoDocumentalPractica(d) {
  const normalizar = (valor) => String(valor ?? "").trim().toUpperCase();
  const estado = normalizar(d.estado_certificado ?? d.estado_flujo);
  if ([estado, d.estado_flujo, d.estado_documental, d.estado_documento, d.estado].some((v) => normalizar(v) === "ANULADO"))
    return "Anulado";
  if (d.estado_certificado && d.estado_flujo && normalizar(d.estado_certificado) !== normalizar(d.estado_flujo))
    return "Estado documental por verificar";
  if (!Number.isSafeInteger(d.id_certificado_documento) || Number(d.id_certificado_documento) < 1)
    return "Sin documento";
  if (estado === "PREPARADO")
    return d.pdf_confirmado === true || d.disponible_rrhh === true ? "Estado documental por verificar" : "Pendiente de env\xEDo a Gerencia";
  if (d.pdf_confirmado === true && d.disponible_rrhh === true)
    return "Certificado confirmado";
  if (estado === "PENDIENTE_FIRMA")
    return "Pendiente de firma";
  return "Estado documental por verificar";
}

export {
  origenCatalogo,
  estadoCatalogo,
  estadoDocumentalPractica
};
//# sourceMappingURL=chunk-G7UWZ5KI.js.map
