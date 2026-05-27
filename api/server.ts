import type { IncomingMessage, ServerResponse } from "http";
import { Readable } from "stream";
import { pathToFileURL } from "url";
import path from "path";
import fs from "fs";

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
    
    // Detailed error trace for debugging
    const errorDetails = error ? (error.stack || error.message || String(error)) : "Unknown error";
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Application Error</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 2rem; background: #fafafa; color: #333; }
            .card { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 2rem; max-width: 800px; margin: 0 auto; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
            pre { background: #f7fafc; border: 1px solid #edf2f7; padding: 1rem; border-radius: 4px; overflow-x: auto; font-size: 0.875rem; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Serverless Function Error (Diagnostics)</h1>
            <pre><code>${errorDetails}</code></pre>
          </div>
        </body>
      </html>
    `);
  }
}
