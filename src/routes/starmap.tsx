import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Sparkles } from "@/components/Sparkles";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/starmap")({
  head: () => ({
    meta: [
      { title: "Star Map ✦ June 16, 2004" },
      { name: "description", content: "The stars on the night Vanya was born — June 16, 2004." },
    ],
  }),
  component: StarMap,
});

// Hand-crafted constellation data for a romantic birthday star map
// Based on the approximate night sky for June 16
const CONSTELLATIONS = [
  {
    name: "Gemini",
    emoji: "♊",
    meaning: "Your sun sign — twins of light and shadow, eternally curious.",
    stars: [
      { x: 0.22, y: 0.28, r: 3.5, bright: true },
      { x: 0.26, y: 0.22, r: 4, bright: true },
      { x: 0.19, y: 0.35, r: 2.5, bright: false },
      { x: 0.30, y: 0.30, r: 2, bright: false },
      { x: 0.23, y: 0.42, r: 2.5, bright: false },
      { x: 0.28, y: 0.38, r: 2, bright: false },
    ],
    lines: [
      [0, 2], [2, 4], [1, 3], [3, 5],
    ],
    color: "#c4b5fd",
  },
  {
    name: "Virgo",
    emoji: "♍",
    meaning: "Rising in the east — grace, precision, and a quiet inner fire.",
    stars: [
      { x: 0.58, y: 0.34, r: 4.5, bright: true },
      { x: 0.63, y: 0.28, r: 2.5, bright: false },
      { x: 0.55, y: 0.42, r: 2, bright: false },
      { x: 0.65, y: 0.44, r: 3, bright: true },
      { x: 0.60, y: 0.50, r: 2, bright: false },
    ],
    lines: [
      [0, 1], [0, 2], [0, 3], [3, 4],
    ],
    color: "#fbbf24",
  },
  {
    name: "Leo",
    emoji: "♌",
    meaning: "Overhead — regal courage and a mane full of stars.",
    stars: [
      { x: 0.40, y: 0.18, r: 5, bright: true },
      { x: 0.35, y: 0.25, r: 2.5, bright: false },
      { x: 0.44, y: 0.26, r: 2, bright: false },
      { x: 0.38, y: 0.32, r: 2.5, bright: false },
      { x: 0.47, y: 0.30, r: 2, bright: false },
      { x: 0.42, y: 0.38, r: 3, bright: true },
    ],
    lines: [
      [0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 5],
    ],
    color: "#f9a8d4",
  },
  {
    name: "Ursa Minor",
    emoji: "⭐",
    meaning: "The North Star shines directly above — your constant compass.",
    stars: [
      { x: 0.75, y: 0.12, r: 5.5, bright: true }, // Polaris
      { x: 0.78, y: 0.20, r: 2, bright: false },
      { x: 0.82, y: 0.17, r: 2, bright: false },
      { x: 0.85, y: 0.22, r: 2.5, bright: false },
    ],
    lines: [
      [0, 1], [1, 2], [2, 3],
    ],
    color: "#93c5fd",
  },
  {
    name: "Boötes",
    emoji: "✦",
    meaning: "The Herdsman — Arcturus blazes orange, the fourth-brightest star.",
    stars: [
      { x: 0.50, y: 0.55, r: 5, bright: true }, // Arcturus
      { x: 0.45, y: 0.48, r: 2, bright: false },
      { x: 0.55, y: 0.48, r: 2, bright: false },
      { x: 0.48, y: 0.62, r: 2.5, bright: false },
      { x: 0.53, y: 0.62, r: 2, bright: false },
    ],
    lines: [
      [0, 1], [0, 2], [0, 3], [0, 4], [3, 4],
    ],
    color: "#fb923c",
  },
];

// Background stars
function generateBgStars(count: number) {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.6 + 0.2,
      twinkleDelay: Math.random() * 3,
    });
  }
  return stars;
}

const BG_STARS = generateBgStars(200);

function StarMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeConst, setActiveConst] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState({ w: 600, h: 500 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Draw on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    // Clear
    ctx.clearRect(0, 0, W, H);

    // Background gradient
    const bg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.7);
    bg.addColorStop(0, "oklch(0.16 0.08 300)");
    bg.addColorStop(0.6, "oklch(0.12 0.06 290)");
    bg.addColorStop(1, "oklch(0.08 0.04 280)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Milky Way soft glow
    const mw = ctx.createLinearGradient(0, H * 0.2, W, H * 0.8);
    mw.addColorStop(0, "transparent");
    mw.addColorStop(0.4, "oklch(0.4 0.04 280 / 0.06)");
    mw.addColorStop(0.6, "oklch(0.5 0.06 300 / 0.08)");
    mw.addColorStop(1, "transparent");
    ctx.fillStyle = mw;
    ctx.fillRect(0, 0, W, H);

    // Draw background stars
    BG_STARS.forEach((s) => {
      const x = s.x * W;
      const y = s.y * H;
      ctx.beginPath();
      ctx.arc(x, y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `oklch(0.95 0.02 320 / ${s.opacity})`;
      ctx.fill();
    });

    // Draw constellations
    CONSTELLATIONS.forEach((c, ci) => {
      const isActive = activeConst === ci;
      const alpha = activeConst === null ? 1 : isActive ? 1 : 0.3;

      // Lines
      ctx.lineWidth = isActive ? 1.5 : 0.8;
      c.lines.forEach(([a, b]) => {
        const s1 = c.stars[a];
        const s2 = c.stars[b];
        ctx.beginPath();
        ctx.moveTo(s1.x * W, s1.y * H);
        ctx.lineTo(s2.x * W, s2.y * H);
        ctx.strokeStyle = `${c.color}${Math.round(alpha * (isActive ? 90 : 60)).toString(16).padStart(2, "0")}`;
        ctx.stroke();
      });

      // Stars
      c.stars.forEach((s) => {
        const x = s.x * W;
        const y = s.y * H;
        const r = s.r * (isActive ? 1.4 : 1);

        // Glow
        if (s.bright) {
          const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
          glow.addColorStop(0, `${c.color}${Math.round(alpha * 80).toString(16).padStart(2, "0")}`);
          glow.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(x, y, r * 4, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }

        // Star body
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `${c.color}${Math.round(alpha * 255).toString(16).padStart(2, "0")}`;
        ctx.fill();
      });
    });
  }, [activeConst, dimensions]);

  // Resize observer
  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      setDimensions({ w: rect.width, h: Math.min(rect.width * 0.75, 520) });
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const activeData = activeConst !== null ? CONSTELLATIONS[activeConst] : null;

  return (
    <section className="relative bg-twilight text-primary-foreground py-20 overflow-hidden min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.15_0.08_300)] via-[oklch(0.18_0.07_290)] to-[oklch(0.12_0.05_280)]" aria-hidden />
      <Sparkles count={20} />

      <div className="relative mx-auto max-w-5xl px-6 space-y-12">
        <Reveal className="text-center space-y-3">
          <p className="font-script text-3xl text-gold">the sky remembers</p>
          <h1 className="font-display text-5xl md:text-6xl text-balance">
            Your Birth Star Map
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto italic">
            June 16, 2004 · The heavens as they stood on the night you arrived — 22 years ago.
            Every star placed exactly as it shone above the world that made room for you.
          </p>
        </Reveal>

        {/* Star Map Canvas */}
        <Reveal variant="float-in">
          <div ref={containerRef} className="relative w-full">
            <canvas
              ref={canvasRef}
              width={dimensions.w}
              height={dimensions.h}
              className="w-full rounded-3xl border border-white/10 shadow-glow"
              style={{ background: "oklch(0.1 0.05 290)" }}
            />

            {/* Clickable constellation overlays */}
            {CONSTELLATIONS.map((c, ci) => {
              const cx = c.stars.reduce((s, st) => s + st.x, 0) / c.stars.length;
              const cy = c.stars.reduce((s, st) => s + st.y, 0) / c.stars.length;
              return (
                <button
                  key={ci}
                  onClick={() => setActiveConst(activeConst === ci ? null : ci)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${cx * 100}%`, top: `${cy * 100}%` }}
                  title={c.name}
                >
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-300 backdrop-blur-sm ${
                      activeConst === ci
                        ? "bg-white/20 border-white/40 text-white scale-110"
                        : "bg-black/30 border-white/10 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/30"
                    }`}
                  >
                    {c.emoji} {c.name}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Constellation details */}
        <div className="min-h-[100px]">
          {activeData ? (
            <Reveal className="mx-auto max-w-2xl text-center space-y-3 animate-fade-up">
              <p className="font-display text-3xl text-gold">
                {activeData.emoji} {activeData.name}
              </p>
              <p className="text-white/70 italic leading-relaxed text-lg">
                {activeData.meaning}
              </p>
            </Reveal>
          ) : (
            <p className="text-center text-white/40 italic animate-fade-up">
              ✦ tap a constellation label to learn its meaning
            </p>
          )}
        </div>

        {/* Constellations grid */}
        <div className="grid sm:grid-cols-3 md:grid-cols-5 gap-3">
          {CONSTELLATIONS.map((c, ci) => (
            <button
              key={ci}
              onClick={() => setActiveConst(activeConst === ci ? null : ci)}
              className={`rounded-2xl border p-4 text-center transition-all duration-300 hover:scale-105 ${
                activeConst === ci
                  ? "bg-white/15 border-white/30 shadow-glow"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <div className="text-3xl mb-2">{c.emoji}</div>
              <p className="text-sm font-display text-white/90">{c.name}</p>
            </button>
          ))}
        </div>

        {/* Poetic footer */}
        <Reveal className="text-center pt-8 border-t border-white/10">
          <p className="font-display italic text-2xl md:text-3xl text-gold/80 text-balance max-w-2xl mx-auto">
            "On the night you were born, the stars didn't fall — they stayed, just to watch."
          </p>
          <p className="text-white/30 text-sm mt-4 font-script text-lg">
            16 June 2004 ✦ forever written in the sky
          </p>
        </Reveal>
      </div>
    </section>
  );
}
