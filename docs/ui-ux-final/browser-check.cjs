// Verificación local con Chrome DevTools Protocol; no instala dependencias.
const fs = require('node:fs/promises');
const path = require('node:path');
const stage = process.argv[2] || 'antes';
const widths = [1920, 1440, 1366, 1024, 768, 390];
const pause = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const tabs = await (await fetch('http://127.0.0.1:9223/json')).json();
  const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r, { once: true }));
  let id = 0;
  const pending = new Map(), errors = [];
  ws.addEventListener('message', e => {
    const m = JSON.parse(e.data);
    if (m.id) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.reject(m.error) : p.resolve(m.result); }
    if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.text);
    if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') errors.push(m.params.entry.text);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => { pending.set(++id, {resolve, reject}); ws.send(JSON.stringify({id, method, params})); });
  const evaluate = async expression => (await send('Runtime.evaluate', {expression, returnByValue: true, awaitPromise: true})).result.value;
  await send('Page.enable'); await send('Runtime.enable'); await send('Log.enable');
  const dir = path.join(__dirname, 'evidencias'); await fs.mkdir(dir, {recursive: true});
  const results = [];
  for (const route of ['login', 'portal-certificados', 'recuperar-password', 'reset-password', 'acceso-denegado']) {
    await send('Page.navigate', {url: 'http://127.0.0.1:4200/' + route}); await pause(2200);
    await evaluate('document.fonts.ready.then(() => true)');
    for (const width of widths) {
      await send('Emulation.setDeviceMetricsOverride', {width, height: 900, deviceScaleFactor: 1, mobile: false}); await pause(150);
      results.push({route, width, ...await evaluate(`({url:location.pathname,title:document.querySelector('h1')?.textContent,viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,focusable:document.querySelectorAll('button,input,a[href],select').length})`)});
      if (['login','portal-certificados'].includes(route)) {
        const shot = await send('Page.captureScreenshot', {format:'png', captureBeyondViewport:false});
        await fs.writeFile(path.join(dir, `${stage}-${route}-${width}.png`), Buffer.from(shot.data,'base64'));
      }
    }
    if (route === 'login') {
      await evaluate(`document.querySelector('button[type=submit]').click()`); await pause(200);
      results.push({route, interaction:'submit vacío', validations:await evaluate(`Array.from(document.querySelectorAll('.error-text')).map(e=>e.textContent.trim())`)});
      const shot = await send('Page.captureScreenshot', {format:'png'});
      await fs.writeFile(path.join(dir, `${stage}-login-validacion-390.png`), Buffer.from(shot.data,'base64'));
    }
    if (route === 'portal-certificados') {
      await evaluate(`Array.from(document.querySelectorAll('.selector button')).find(e=>e.textContent.includes('código')).click()`); await pause(150);
      results.push({route, interaction:'seleccionar código', codeInput:await evaluate(`!!document.querySelector('#codigo-portal')`), dniInput:await evaluate(`!!document.querySelector('#dni-publico')`)});
      await evaluate(`document.querySelector('button[type=submit]').click()`); await pause(150);
      const shot = await send('Page.captureScreenshot', {format:'png'});
      await fs.writeFile(path.join(dir, `${stage}-portal-validacion-390.png`), Buffer.from(shot.data,'base64'));
    }
  }
  for (const route of ['inicio', 'certificaciones/actividades', 'certificaciones/generar-emitir', 'certificaciones/certificados/documentos', 'pendientes/documentos-firmar']) {
    await send('Page.navigate', {url:'http://127.0.0.1:4200/' + route}); await pause(1800);
    for (let intento = 0; intento < 80 && await evaluate('location.pathname') !== '/login'; intento++) await pause(150);
    results.push({route, actual:await evaluate('location.pathname'), title:await evaluate("document.querySelector('h1')?.textContent"), note:'Comprobación de guard real, sin simular autenticación.'});
  }
  await fs.writeFile(path.join(__dirname, `${stage}-browser.json`),JSON.stringify({results,errors},null,2));
  console.log(JSON.stringify({stage,checks:results.length,overflow:results.filter(r=>r.scrollWidth>r.viewport),errors}));
  ws.close();
})().catch(e=>{console.error(e);process.exitCode=1});
