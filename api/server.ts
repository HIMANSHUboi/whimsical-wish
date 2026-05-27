import type { IncomingMessage, ServerResponse } from "http";
import { Readable } from "stream";
import { pathToFileURL } from "url";
import path from "path";

let server: any = null;
let initError: any = null;

async function initServer() {
  if (server) return server;
  if (initError) throw initError;

  try {
    const serverPath = path.join(process.cwd(), "dist/server/server.js");
    const module = await import(pathToFileURL(serverPath).href);
    server = module.default || module;
    return server;
  } catch (err: any) {
    initError = err;
    console.error("Initialization error in api/server.ts:", err);
    throw err;
  }
}

function toWebRequest(req: IncomingMessage): Request {
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost";
  const url = new URL(req.url || "", `${protocol}://${host}`);

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach((v) => headers.append(key, v));
      } else {
        headers.set(key, value);
      }
    }
  }

  const init: RequestInit = {
    method: req.method,
    headers,
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = Readable.toWeb(req) as any;
    (init as any).duplex = "half";
  }

  return new Request(url.toString(), init);
}

async function sendWebResponse(res: ServerResponse, response: Response) {
  res.statusCode = response.status;
  res.statusMessage = response.statusText;

  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  if (response.body) {
    const reader = response.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
  }
  res.end();
}

function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    const srv = await initServer();
    const webRequest = toWebRequest(req);
    const webResponse = await srv.fetch(webRequest, {}, {});
    await sendWebResponse(res, webResponse);
  } catch (error: any) {
    console.error("Error in serverless handler:", error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(renderErrorPage());
  }
}
