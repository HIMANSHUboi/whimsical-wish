import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";

// CSRF protection middleware — guards server functions against cross-site requests
// by validating the Origin/Referer header matches the request host.
// Using createMiddleware directly to avoid the createCsrfMiddleware bundle-leak bug.
const csrfMiddleware = createMiddleware().server(async ({ next, context }) => {
  const request = (context as any).request as Request | undefined;

  if (request) {
    const handlerType = (context as any).handlerType as string | undefined;
    // Only enforce on server function RPC calls
    if (handlerType === "serverFn") {
      const origin = request.headers.get("origin");
      const referer = request.headers.get("referer");
      const host = request.headers.get("host") ?? "";

      const checkSource = origin ?? referer;
      if (checkSource) {
        try {
          const sourceHost = new URL(checkSource).host;
          if (sourceHost !== host) {
            return new Response("Forbidden", { status: 403 });
          }
        } catch {
          return new Response("Forbidden", { status: 403 });
        }
      }
    }
  }

  return next();
});

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

export const startInstance = createStart(() => ({
  requestMiddleware: [csrfMiddleware, errorMiddleware],
}));
