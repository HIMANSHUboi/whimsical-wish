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
    
    // Check if the file exists
    if (!fs.existsSync(serverPath)) {
      throw new Error(`Server file not found at: ${serverPath}. Current directory: ${process.cwd()}. Files: ${fs.readdirSync(process.cwd()).join(", ")}`);
    }

    const module = await import(pathToFileURL(serverPath).href);
    server = module.default || module;
    return server;
  } catch (err: any) {
    initError = err;
    console.error("Initialization error:", err);
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
    
    // Provide a beautiful debug output on the page
    const errorDetails = error ? (error.stack || error.message || String(error)) : "Unknown error";
    const dirInfo = `
      <p><strong>process.cwd():</strong> ${process.cwd()}</p>
      <p><strong>__dirname:</strong> ${typeof __dirname !== "undefined" ? __dirname : "undefined"}</p>
      <p><strong>Files in process.cwd():</strong> ${fs.existsSync(process.cwd()) ? fs.readdirSync(process.cwd()).join(", ") : "directory does not exist"}</p>
      <p><strong>Files in process.cwd()/dist:</strong> ${fs.existsSync(path.join(process.cwd(), "dist")) ? fs.readdirSync(path.join(process.cwd(), "dist")).join(", ") : "dist does not exist"}</p>
    `;
    
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Application Error</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 2rem; background: #fafafa; color: #333; }
            .card { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 2rem; max-width: 800px; margin: 0 auto; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
            h1 { color: #e53e3e; margin-top: 0; }
            pre { background: #f7fafc; border: 1px solid #edf2f7; padding: 1rem; border-radius: 4px; overflow-x: auto; font-size: 0.875rem; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Serverless Function Error</h1>
            <p>The application failed to start on Vercel. Here are the details:</p>
            <pre><code>${errorDetails}</code></pre>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 2rem 0;" />
            <h3>Environment Diagnostics</h3>
            ${dirInfo}
          </div>
        </body>
      </html>
    `);
  }
}
