import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  Link,
} from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { AuraIntro } from "@/components/AuraIntro";
import { CursorTrail } from "@/components/CursorTrail";
import { MusicPlayer } from "@/components/MusicPlayer";
import { ConfettiBurst } from "@/components/ConfettiBurst";
import { LightboxProvider } from "@/components/Lightbox";
import { ScrollProgress } from "@/components/ScrollProgress";
import { FloatingElements } from "@/components/FloatingElements";
import { CountdownLockScreen } from "@/components/CountdownLockScreen";

import appCss from "../styles.css?url";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-dreamy px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl text-primary">404</h1>
        <p className="mt-4 text-muted-foreground">This page drifted into the stars.</p>
        <Link to="/" className="mt-6 inline-block rounded-full bg-primary px-6 py-2 text-primary-foreground">
          Return home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="font-display text-2xl">Something sparkled wrong</h1>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 rounded-full bg-primary px-6 py-2 text-primary-foreground"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: "Happy Birthday, Vanya Bharti ✦" },
        {
          name: "description",
          content:
            "A whimsical birthday wish for Vanya Bharti — 16 June 2026.",
        },
      ],
      links: [{ rel: "stylesheet", href: appCss }],
    }),
    shellComponent: RootShell,
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
    errorComponent: ErrorComponent,
  },
);

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const BIRTHDAY = new Date("2026-06-16T00:00:00").getTime();
    const isPastBirthday = Date.now() >= BIRTHDAY;
    const hasSecretLS = localStorage.getItem("vanya_site_unlocked") === "true";
    
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get("code")?.toLowerCase() || params.get("secret")?.toLowerCase();
    const hasSecretUrl = codeParam === "braydenimissyou";

    if (hasSecretUrl) {
      localStorage.setItem("vanya_site_unlocked", "true");
      // Clean up URL parameter to keep it clean
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete("code");
        url.searchParams.delete("secret");
        window.history.replaceState({}, document.title, url.pathname + url.search);
      } catch (e) {
        console.warn(e);
      }
    }

    if (isPastBirthday || hasSecretLS || hasSecretUrl) {
      setIsUnlocked(true);
    }
  }, []);

  const handleUnlock = () => {
    setIsUnlocked(true);
    if (typeof window !== "undefined") {
      // Fire confetti burst upon successful passcode entry
      window.dispatchEvent(new Event("trigger-confetti"));
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <LightboxProvider>
        <AuraIntro />
        <ConfettiBurst />
        <CursorTrail />
        <ScrollProgress />
        <FloatingElements />
        <div className="min-h-screen flex flex-col font-body">
          {isUnlocked ? (
            <>
              <SiteNav />
              <main className="flex-1">
                <Outlet />
              </main>
              <SiteFooter />
            </>
          ) : (
            <CountdownLockScreen onUnlock={handleUnlock} />
          )}
        </div>
        <MusicPlayer />
      </LightboxProvider>
    </QueryClientProvider>
  );
}

