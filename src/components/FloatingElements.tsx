import { useEffect, useRef } from "react";

interface Element {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  maxOpacity: number;
  fadeSpeed: number;
  drift: number;
  driftSpeed: number;
  type: "bubble" | "star";
  color: string;
}

const colors = [
  "rgba(251, 207, 232, 0.35)", // light pink
  "rgba(233, 213, 255, 0.35)", // light purple
  "rgba(199, 210, 254, 0.35)", // light indigo
  "rgba(253, 244, 201, 0.35)", // light gold
];

export function FloatingElements() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const elements = useRef<Element[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const createElement = (randomY = false): Element => {
      const type = Math.random() > 0.4 ? "bubble" : "star";
      return {
        x: Math.random() * window.innerWidth,
        y: randomY ? Math.random() * window.innerHeight : window.innerHeight + 20,
        size: Math.random() * 6 + 3,
        speed: Math.random() * 0.25 + 0.1,
        opacity: 0,
        maxOpacity: Math.random() * 0.25 + 0.15,
        fadeSpeed: 0.003 + Math.random() * 0.003,
        drift: Math.random() * 100,
        driftSpeed: 0.001 + Math.random() * 0.002,
        type,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    };

    // Initial elements
    const count = Math.min(20, Math.floor(window.innerWidth / 60));
    for (let i = 0; i < count; i++) {
      elements.current.push(createElement(true));
    }

    const drawStar = (cx: number, cy: number, r: number, fillStyle: string) => {
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = fillStyle;
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
        ctx.lineTo(
          cx + Math.cos(angle + Math.PI / 4) * (r * 0.3),
          cy + Math.sin(angle + Math.PI / 4) * (r * 0.3)
        );
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const els = elements.current;

      for (let i = els.length - 1; i >= 0; i--) {
        const el = els[i];

        // Move upward
        el.y -= el.speed;
        // Horizontal drift
        el.x += Math.sin(el.y * el.driftSpeed + el.drift) * 0.2;

        if (el.y < -20 || el.x < -20 || el.x > canvas.width + 20) {
          els[i] = createElement(false);
          continue;
        }

        // Fade in / out
        if (el.y > canvas.height - 100) {
          if (el.opacity < el.maxOpacity) el.opacity += el.fadeSpeed;
        } else if (el.y < 120) {
          if (el.opacity > 0) el.opacity -= el.fadeSpeed;
        } else {
          el.opacity = el.maxOpacity;
        }

        if (el.opacity <= 0 && el.y < 120) {
          els[i] = createElement(false);
          continue;
        }

        ctx.save();
        if (el.type === "bubble") {
          ctx.beginPath();
          ctx.arc(el.x, el.y, el.size, 0, Math.PI * 2);
          ctx.fillStyle = el.color.replace("0.35", Math.min(el.opacity, 0.35).toString());
          ctx.shadowBlur = 6;
          ctx.shadowColor = el.color;
          ctx.fill();
        } else {
          drawStar(el.x, el.y, el.size, `rgba(251, 191, 36, ${Math.min(el.opacity, 0.6)})`);
        }
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-60"
      aria-hidden="true"
    />
  );
}
