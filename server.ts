import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { request as httpsRequest } from 'node:https';
import { OutgoingHttpHeaders } from 'node:http';
import bootstrap from './src/main.server';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();
  server.disable('x-powered-by');
  server.get('/healthz', (_req, res) => res.type('text/plain').send('ok'));
  // /api mantiene el mismo origen para las cookies HttpOnly y las URL de PDF.
  server.use('/api', (req, res) => {
    const configured = process.env['BACKEND_ORIGIN'];
    let backend: URL;
    try {
      backend = new URL(configured || '');
      if (backend.protocol !== 'https:' || backend.username || backend.password || backend.pathname !== '/' || backend.search || backend.hash) throw new Error('invalid');
    } catch {
      res.status(503).type('text/plain').send('Backend no configurado');
      return;
    }
    const headers: OutgoingHttpHeaders = { ...req.headers, host: backend.host };
    delete headers['connection'];
    delete headers['forwarded'];
    delete headers['x-forwarded-host'];
    delete headers['x-forwarded-proto'];
    delete headers['x-forwarded-for'];
    const upstream = httpsRequest({ hostname: backend.hostname, port: backend.port || 443,
      method: req.method, path: req.originalUrl, headers, timeout: 60000 }, response => {
      res.writeHead(response.statusCode || 502, response.headers);
      response.pipe(res);
    });
    upstream.on('timeout', () => upstream.destroy());
    upstream.on('error', () => {
      if (!res.headersSent) res.status(502).type('text/plain').send('Backend no disponible');
      else res.destroy();
    });
    req.on('aborted', () => upstream.destroy());
    req.pipe(upstream);
  });
  // HTML and non-fingerprinted public assets must revalidate after deployment.
  server.use((_req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache');
    next();
  });

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('**', express.static(browserDistFolder, {
    maxAge: 0,
    setHeaders: (res, filePath) => {
      if (/-[A-Z0-9]{8,}\.(?:js|css|woff2?|png|jpe?g|gif|svg|webp)$/i.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    },
    index: 'index.html',
  }));

  // All regular routes use the Angular engine
  server.get('**', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = Number(process.env['PORT'] || 4000);

  // Start up the Node server
  const server = app();
  server.listen(port, '0.0.0.0', () => {
    console.log(`Node Express server listening on port ${port}`);
  });
}

run();
