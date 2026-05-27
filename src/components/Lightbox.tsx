import { useEffect, useState, useCallback, useRef, type ReactNode } from "react";

// Simple module-level state for the lightbox
let lightboxOpen: ((src: string, alt?: string) => void) | null = null;

export function openLightbox(src: string, alt?: string) {
  lightboxOpen?.(src, alt);
}

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [src, setSrc] = useState<string | null>(null);
  const [alt, setAlt] = useState("");
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  // Drag-to-dismiss state
  const dragStartY = useRef<number | null>(null);
  const dragStartX = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    lightboxOpen = (s, a = "") => {
      setSrc(s);
      setAlt(a);
      setVisible(true);
      setDragOffset({ x: 0, y: 0 });
    };
    return () => { lightboxOpen = null; };
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    setDragOffset({ x: 0, y: 0 });
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

  // Pointer drag handlers on the image
  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartY.current = e.clientY;
    dragStartX.current = e.clientX;
    setIsDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragStartY.current === null || dragStartX.current === null) return;
    const dy = e.clientY - dragStartY.current;
    const dx = e.clientX - dragStartX.current;
    setDragOffset({ x: dx, y: dy });
  };

  const onPointerUp = () => {
    const { y } = dragOffset;
    setIsDragging(false);
    dragStartY.current = null;
    dragStartX.current = null;

    // Dismiss if dragged far enough
    if (Math.abs(y) > 100) {
      close();
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const copyAlt = () => {
    if (!alt) return;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(`✦ ${alt}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Opacity based on drag distance
  const dragProgress = Math.min(Math.abs(dragOffset.y) / 160, 1);
  const overlayOpacity = 0.6 * (1 - dragProgress * 0.8);
  const imgOpacity = 1 - dragProgress * 0.6;
  const imgScale = 1 - dragProgress * 0.08;

  return (
    <>
      {children}
      {src && (
        <div
          className={`fixed inset-0 z-[95] flex items-center justify-center p-6 transition-all duration-300 lightbox-overlay ${
            visible ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity})` }}
          onClick={close}
          role="dialog"
          aria-label="Image viewer"
        >
          {/* Close button */}
          <button
            onClick={close}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-card/90 backdrop-blur border border-border/50 text-foreground flex items-center justify-center hover:scale-110 transition-transform z-10"
            aria-label="Close"
          >
            ✕
          </button>

          {/* Drag hint */}
          {visible && !isDragging && (
            <p className="absolute top-6 left-1/2 -translate-x-1/2 text-white/40 text-xs font-body pointer-events-none select-none animate-fade-up">
              swipe up or down to dismiss
            </p>
          )}

          {/* Image with drag */}
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            style={{
              transform: `translate(${dragOffset.x * 0.3}px, ${dragOffset.y}px) scale(${imgScale})`,
              opacity: imgOpacity,
              transition: isDragging ? "none" : "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease",
            }}
            className={`max-w-full max-h-[80vh] rounded-2xl shadow-glow object-contain cursor-grab active:cursor-grabbing select-none transition-all duration-500 ${
              visible ? "scale-100 opacity-100" : "scale-90 opacity-0"
            }`}
          />

          {/* Caption + share button */}
          {alt && (
            <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-500 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}>
              <p className="font-script text-xl text-white/90 bg-black/40 backdrop-blur px-6 py-2 rounded-full">
                {alt}
              </p>
              <button
                onClick={(e) => { e.stopPropagation(); copyAlt(); }}
                className="text-xs text-white/50 hover:text-white/80 transition-colors border border-white/20 px-3 py-1 rounded-full hover:bg-white/10 backdrop-blur"
              >
                {copied ? "copied ✓" : "copy vibe ✦"}
              </button>
            </div>
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
