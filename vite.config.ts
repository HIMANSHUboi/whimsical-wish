import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(async ({ command, mode }) => {
  const loadedEnv = loadEnv(mode, process.cwd(), "VITE_");
  const envDefine: Record<string, string> = {};
  for (const [key, value] of Object.entries(loadedEnv)) {
    envDefine[`import.meta.env.${key}`] = JSON.stringify(value);
  }

  const plugins = [
    tailwindcss(),
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      server: {
        entry: "server",
      },
      importProtection: {
        behavior: "error",
        client: {
          files: ["**/server/**"],
          specifiers: ["server-only"],
        },
      },
    }),
    react(),
    {
      name: "tanstack-start-injected-head-scripts-mock",
      resolveId(id: string) {
        if (id === "tanstack-start-injected-head-scripts:v") {
          return "\0" + id;
        }
      },
      load(id: string) {
        if (id === "\0tanstack-start-injected-head-scripts:v") {
          return 'export const injectedHeadScripts = "";';
        }
      },
    },
  ];

  if (command === "build" && !process.env.VERCEL) {
    try {
      const { cloudflare } = await import("@cloudflare/vite-plugin");
      plugins.push(
        cloudflare({
          viteEnvironment: { name: "ssr" },
        })
      );
    } catch (e) {
      console.warn("Could not load cloudflare plugin:", e);
    }
  }

  return {
    define: envDefine,
    ssr: {
      noExternal: true,
    },
    environments: {
      ssr: {
        build: {
          rollupOptions: {
            output: {
              inlineDynamicImports: true,
              entryFileNames: "server.js",
            },
          },
        },
      },
    },
    resolve: {
      alias: {
        "@": `${process.cwd()}/src`,
      },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    plugins,
    server: {
      host: "::",
      port: 8080,
      watch: {
        awaitWriteFinish: {
          stabilityThreshold: 1000,
          pollInterval: 100,
        },
      },
    },
  };
});
