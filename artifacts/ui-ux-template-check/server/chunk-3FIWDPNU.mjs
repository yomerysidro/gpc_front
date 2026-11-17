import './polyfills.server.mjs';

// src/app/pages/reportes/reportes.utils.ts
function mensajeReporte(error) {
  const status = error?.status;
  if (status === 401)
    return "Tu sesi\xF3n venci\xF3. Inicia sesi\xF3n nuevamente para consultar el reporte.";
  if (status === 403)
    return "No tienes permiso para consultar estos datos. El permiso de Reportes no concede acceso a los otros m\xF3dulos.";
  if (status === 500)
    return "El servidor no pudo consultar los datos. Intenta actualizar m\xE1s tarde.";
  if (status === 404)
    return "No se encontr\xF3 el registro solicitado.";
  if (status === 0)
    return "No se pudo conectar con el servidor. Comprueba la conexi\xF3n e intenta nuevamente.";
  return error instanceof Error ? error.message : "No se pudo consultar el reporte. Intenta nuevamente.";
}
function fechasValidas(inicio, fin) {
  return !inicio || !fin || inicio <= fin;
}
function crearCsv(encabezados, filas) {
  const celda = (valor) => {
    let texto = String(valor ?? "");
    if (/^[\s\u0000-\u0020]*[=+@-]/u.test(texto) || /^[\t\r\n]/u.test(texto))
      texto = "'" + texto;
    return '"' + texto.replace(/"/g, '""') + '"';
  };
  return "\uFEFF" + [encabezados, ...filas].map((fila) => fila.map(celda).join(",")).join("\r\n");
}
function descargarCsv(nombre, encabezados, filas) {
  const url = URL.createObjectURL(new Blob([crearCsv(encabezados, filas)], { type: "text/csv;charset=utf-8;" }));
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombre;
  enlace.click();
  setTimeout(() => URL.revokeObjectURL(url), 1e3);
}
function estadoCertificado(valor) {
  if (valor === true || valor === 1 || valor === "1")
    return "Activo";
  if (valor === false || valor === 0 || valor === "0")
    return "Inactivo";
  return "Estado no reconocido";
}

export {
  mensajeReporte,
  fechasValidas,
  descargarCsv,
  estadoCertificado
};
//# sourceMappingURL=chunk-3FIWDPNU.mjs.map
