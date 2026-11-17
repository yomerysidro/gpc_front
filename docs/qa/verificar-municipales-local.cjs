// Diagnóstico de sólo lectura del servidor y navegador local. No obtiene cookies ni crea documentos.
const fs = require('node:fs');
const path = require('node:path');
const WebSocket = require('ws');
const base = 'http://localhost:4200/';
const destino = __dirname;
async function servido() {
  const cola = ['main.js']; const vistos = new Set(); const componentes = [];
  while (cola.length && vistos.size < 200) {
    const archivo = cola.shift(); if (vistos.has(archivo)) continue; vistos.add(archivo);
    const r = await fetch(new URL(archivo, base)); if (!r.ok) continue;
    const texto = await r.text();
    if (/mensajeMunicipalEditable|contrato actual no admite|Reconocimientos municipales individuales/.test(texto)) {
      componentes.push({ archivo, editorActual: texto.includes('mensajeMunicipalEditable'),
        consultaLigera: texto.includes('iniciarMunicipal'), avisoAntiguo: texto.includes('contrato actual no admite'),
        permisoAdministrativo: texto.includes('puedeVerDocumentoAdministrativo') });
    }
    for (const m of texto.matchAll(/\/(chunk-[\w-]+\.js)/g)) if (!vistos.has(m[1])) cola.push(m[1]);
  }
  return { servidor: base, chunks: vistos.size, componentes };
}
async function navegador() {
  const targets = await (await fetch('http://127.0.0.1:9333/json/list')).json();
  const target = targets.find(t => t.type === 'page'); if (!target) throw Error('No hay página de verificación.');
  const ws = new WebSocket(target.webSocketDebuggerUrl); await new Promise((ok, mal) => { ws.once('open', ok); ws.once('error', mal); });
  let id = 0; const pendientes = new Map(); const respuestas = [];
  ws.on('message', raw => {
    const m = JSON.parse(raw);
    if (m.id) { const p = pendientes.get(m.id); if (p) { pendientes.delete(m.id); m.error ? p.reject(Error(m.error.message)) : p.resolve(m.result); } }
    if (m.method === 'Network.responseReceived') {
      const u = new URL(m.params.response.url);
      if (u.pathname.startsWith('/api/')) respuestas.push({ ruta: u.pathname, http: m.params.response.status });
    }
  });
  function cmd(method, params = {}) {
    return new Promise((resolve, reject) => {
      const actual = ++id; pendientes.set(actual, { resolve, reject }); ws.send(JSON.stringify({ id: actual, method, params }));
      const timeout = setTimeout(() => { if (pendientes.delete(actual)) reject(Error('CDP timeout: ' + method)); }, 15000); timeout.unref();
    });
  }
  await cmd('Page.enable'); await cmd('Runtime.enable'); await cmd('Network.enable');
  await cmd('Network.setCacheDisabled', { cacheDisabled: true });
  const paginas = [];
  for (const [nombre, ruta] of [
    ['listado', 'certificaciones/generar-emitir?origen_documental=reconocimiento'],
    ['mensaje-28', 'certificaciones/generar-emitir/reconocimientos/individual/28'],
    ['documento-24', 'certificaciones/generar-emitir/reconocimientos/documento-original/24'],
  ]) {
    await cmd('Page.navigate', { url: new URL(ruta, base).href });
    const limite = Date.now() + 15000;
    let pantalla;
    do {
      await new Promise(ok => setTimeout(ok, 250));
      const r = await cmd('Runtime.evaluate', { expression: `JSON.stringify({ruta:location.pathname+location.search, titulo:document.title, listo:document.readyState, encabezados:[...document.querySelectorAll('h1,h2')].map(n=>n.textContent.trim()), login:!!document.querySelector('input[type=password]'), editor:!!document.querySelector('#mensaje-municipal'), editable:!!document.querySelector('#mensaje-municipal')&&!document.querySelector('#mensaje-municipal').readOnly&&!document.querySelector('#mensaje-municipal').disabled, avisoAntiguo:document.body.innerText.includes('contrato actual no admite')})`, returnByValue: true });
      pantalla = JSON.parse(r.result.value);
      if (pantalla.listo === 'complete' && (pantalla.login || pantalla.editor || pantalla.encabezados.includes('Certificado'))) break;
    } while (Date.now() < limite);
    const captura = await cmd('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    fs.writeFileSync(path.join(destino, `municipales-real-${nombre}.png`), Buffer.from(captura.data, 'base64'));
    paginas.push({ solicitada: ruta, ...pantalla, captura: `municipales-real-${nombre}.png` });
  }
  ws.close(); return { paginas, respuestas };
}
(async () => {
  const fuente = await servido(); const visual = await navegador();
  const informe = { fecha: new Date().toISOString(), fuente, visual,
    integracionAutenticada: visual.paginas.some(p => !p.login && (p.editor || p.encabezados.includes('Certificado'))),
    nota: 'No se simulan autenticación ni respuestas de Laravel; las redirecciones a login se reportan como bloqueo, no como validación del módulo.' };
  fs.writeFileSync(path.join(destino, 'municipales-local-verificacion.json'), JSON.stringify(informe, null, 2));
  console.log(JSON.stringify(informe, null, 2));
})().catch(e => { console.error(e.message); process.exitCode = 1; });
