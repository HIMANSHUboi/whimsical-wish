import { Link, useRouter } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/matcha", label: "Matcha" },
  { to: "/tarot", label: "Tarot" },
  { to: "/moodboard", label: "Moodboard" },
  { to: "/wishbook", label: "Wishbook" },
  { to: "/calendar", label: "The Day" },
  { to: "/wishes", label: "A Wish" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer on route change
  const router = useRouter();
  useEffect(() => {
    const unsub = router.subscribe("onBeforeNavigate", () => setOpen(false));
    return unsub;
  }, [router]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Prevent scroll when drawer open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border/50">
        <nav className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
          <Link to="/" className="font-script text-2xl text-primary">
            Vanya ✦
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-6 text-sm">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-foreground/70 hover:text-primary transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-px after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
                  activeProps={{ className: "text-primary font-medium" }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <ThemeToggle />
            </li>
          </ul>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setOpen(!open)}
              className="w-10 h-10 rounded-xl border border-border/50 bg-card/60 backdrop-blur flex flex-col items-center justify-center gap-[5px] hover:scale-105 transition-transform"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <span
                className={`w-5 h-[2px] bg-foreground rounded-full transition-all duration-300 ${
                  open ? "rotate-45 translate-y-[7px]" : ""
                }`}
              />
              <span
                className={`w-5 h-[2px] bg-foreground rounded-full transition-all duration-300 ${
                  open ? "opacity-0 scale-x-0" : ""
                }`}
              />
              <span
                className={`w-5 h-[2px] bg-foreground rounded-full transition-all duration-300 ${
                  open ? "-rotate-45 -translate-y-[7px]" : ""
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer overlay - Rendered outside header to bypass backdrop-filter fixed positioning bug */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div
            ref={drawerRef}
            className="absolute top-0 right-0 h-full w-72 border-l border-border/50 shadow-2xl p-8 flex flex-col"
            style={{ 
              backgroundColor: "var(--card)",
              animation: "slide-in-right 0.3s cubic-bezier(0.16, 1, 0.3, 1) both"
            }}
          >
            <div className="flex items-center justify-between mb-8">
              <p className="font-script text-2xl text-primary font-bold">✦ wander</p>
              <button
                onClick={() => setOpen(false)}
                className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center text-foreground/75 hover:text-primary hover:border-primary/50 transition-all cursor-pointer"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
            <ul className="space-y-2 flex-1 overflow-y-auto pr-2">
              {links.map((l, i) => (
                <li
                  key={l.to}
                  style={{ animation: `slide-up 0.4s ease-out ${i * 0.05}s both` }}
                >
                  <Link
                    to={l.to}
                    className="block py-3 px-5 rounded-xl text-lg text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all font-display border border-transparent hover:border-primary/10"
                    activeProps={{ className: "text-primary bg-primary/8 font-semibold border-primary/20" }}
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="pt-6 border-t border-border/30 text-center">
              <p className="font-script text-base text-primary/80 mb-1">
                made with ♡ for Vanya
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                16 June 2026
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
