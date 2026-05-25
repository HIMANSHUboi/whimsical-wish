import type { IncomingMessage, ServerResponse } from "http";
import { Readable } from "stream";
import { pathToFileURL } from "url";
import path from "path";

// Resolve the server entry dynamically relative to the runtime process directory
const serverPromise = import(
  pathToFileURL(path.join(process.cwd(), "dist/server/server.js")).href
).then((m) => m.default || m);

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
    const server = await serverPromise;
    const webRequest = toWebRequest(req);
    const webResponse = await server.fetch(webRequest, {}, {});
    await sendWebResponse(res, webResponse);
  } catch (error) {
    console.error("Error in serverless handler:", error);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
}
