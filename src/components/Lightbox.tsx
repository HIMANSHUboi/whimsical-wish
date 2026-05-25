import { useEffect, useState, useCallback, type ReactNode } from "react";

interface LightboxContextValue {
  open: (src: string, alt?: string) => void;
}

// Simple module-level state for the lightbox
let lightboxOpen: ((src: string, alt?: string) => void) | null = null;

export function openLightbox(src: string, alt?: string) {
  lightboxOpen?.(src, alt);
}

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [src, setSrc] = useState<string | null>(null);
  const [alt, setAlt] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    lightboxOpen = (s, a = "") => {
      setSrc(s);
      setAlt(a);
      setVisible(true);
    };
    return () => { lightboxOpen = null; };
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    setTimeout(() => { setSrc(null); setAlt(""); }, 300);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, close]);

  return (
    <>
      {children}
      {src && (
        <div
          className={`fixed inset-0 z-[95] flex items-center justify-center p-6 transition-all duration-300 lightbox-overlay ${
            visible ? "bg-black/60 opacity-100" : "bg-black/0 opacity-0 pointer-events-none"
          }`}
          onClick={close}
          role="dialog"
          aria-label="Image viewer"
        >
          <button
            onClick={close}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-card/90 backdrop-blur border border-border/50 text-foreground flex items-center justify-center hover:scale-110 transition-transform z-10"
            aria-label="Close"
          >
            ✕
          </button>
          <img
            src={src}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            className={`max-w-full max-h-[85vh] rounded-2xl shadow-glow object-contain transition-all duration-500 ${
              visible ? "scale-100 opacity-100" : "scale-90 opacity-0"
            }`}
          />
          {alt && (
            <p className={`absolute bottom-8 left-1/2 -translate-x-1/2 font-script text-xl text-white/90 bg-black/40 backdrop-blur px-6 py-2 rounded-full transition-all duration-500 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}>
              {alt}
            </p>
          )}
        </div>
      )}
    </>
  );
}

/** Wrapper that makes an image clickable to open in lightbox */
export function LightboxImage({
  src,
  alt = "",
  className = "",
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src={src}
      alt={alt}
      className={`cursor-zoom-in ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        if (src) openLightbox(src, alt);
      }}
      {...props}
    />
  );
}
