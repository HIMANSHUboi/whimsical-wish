import { useEffect, useState } from "react";
import tarotAltar from "@/assets/tarot-altar.jpeg";

export function AuraIntro() {
  const [mounted, setMounted] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("aura-cleansed") === "1") return;
    setMounted(true);
    const t1 = setTimeout(() => setLeaving(true), 3800);
    const t2 = setTimeout(() => {
      setMounted(false);
      sessionStorage.setItem("aura-cleansed", "1");
    }, 4800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden"
      style={{ animation: leaving ? "veil-out 1s ease forwards" : undefined }}
    >
      <img
        src={tarotAltar}
        alt=""
        className="absolute inset-0 w-full h-full object-cover scale-110"
        style={{ animation: "fade-up 1.6s ease-out both" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/85" />

      <span className="smoke-plume" style={{ left: "28%", animationDelay: "0s" }} />
      <span className="smoke-plume" style={{ left: "50%", animationDelay: "1.2s" }} />
      <span className="smoke-plume" style={{ left: "72%", animationDelay: "2.4s" }} />
      <span className="smoke-plume" style={{ left: "40%", animationDelay: "3.2s", width: 160, height: 160 }} />
      <span className="smoke-plume" style={{ left: "62%", animationDelay: "0.6s", width: 280, height: 280 }} />

      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className="absolute text-gold animate-twinkle pointer-events-none"
          style={{
            left: `${(i * 53) % 100}%`,
            top: `${(i * 37) % 100}%`,
            fontSize: `${10 + (i % 5) * 3}px`,
            animationDelay: `${(i % 6) * 0.4}s`,
          }}
        >
          ✦
        </span>
      ))}

      <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
        <p className="font-script text-gold text-3xl md:text-4xl mb-4"
           style={{ animation: "fade-up 1.2s ease-out 0.2s both" }}>
          a moment, dear one
        </p>
        <h2 className="font-display italic text-white text-4xl md:text-6xl text-balance max-w-2xl leading-tight"
            style={{ animation: "fade-up 1.4s ease-out 0.6s both" }}>
          cleansing your aura<br />before you enter
        </h2>
        <p className="mt-8 text-xs uppercase text-white/70"
           style={{ animation: "aura-pulse 2.4s ease-in-out infinite", letterSpacing: "0.4em" }}>
          ✦ breathe ✦
        </p>
      </div>
    </div>
  );
}
