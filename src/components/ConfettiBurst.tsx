import { useEffect, useRef, useState } from "react";

interface Piece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  gravity: number;
  opacity: number;
}

const COLORS = [
  "oklch(0.82 0.12 85)",   // gold
  "oklch(0.78 0.1 10)",    // rose
  "oklch(0.78 0.08 300)",  // lavender
  "oklch(0.95 0.02 320)",  // white-ish
  "oklch(0.45 0.13 310)",  // primary purple
  "oklch(0.6 0.12 310)",   // ring purple
];

export function ConfettiBurst() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleTrigger = () => {
      setActive(true);
    };

    window.addEventListener("trigger-confetti", handleTrigger);

    let waitTimer: ReturnType<typeof setTimeout> | undefined;
    if (sessionStorage.getItem("confetti-done") !== "1") {
      // Wait for aura intro to finish (~4.8s)
      waitTimer = setTimeout(() => {
        setActive(true);
        sessionStorage.setItem("confetti-done", "1");
      }, 5000);
    }

    return () => {
      window.removeEventListener("trigger-confetti", handleTrigger);
      if (waitTimer) clearTimeout(waitTimer);
    };
  }, []);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces: Piece[] = [];
    const PIECE_COUNT = 200;

    for (let i = 0; i < PIECE_COUNT; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * canvas.height * 0.5,
        vx: (Math.random() - 0.5) * 8,
        vy: Math.random() * 3 + 2,
        w: Math.random() * 8 + 4,
        h: Math.random() * 6 + 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        gravity: 0.05 + Math.random() * 0.05,
        opacity: 1,
      });
    }

    let frame = 0;
    const maxFrames = 180; // ~3 seconds

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      for (const p of pieces) {
        p.x += p.vx;
        p.vy += p.gravity;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.vx *= 0.99;

        if (frame > maxFrames * 0.6) {
          p.opacity -= 0.015;
        }

        if (p.opacity <= 0) continue;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }

      if (frame < maxFrames) {
        requestAnimationFrame(animate);
      } else {
        setActive(false);
      }
    };

    requestAnimationFrame(animate);
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[99] pointer-events-none"
      aria-hidden="true"
    />
  );
}
