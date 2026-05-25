import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  life: number;
  maxLife: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
}

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: -100, y: -100 });
  const raf = useRef<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Skip on touch-only devices
    if ("ontouchstart" in window && !window.matchMedia("(pointer: fine)").matches) return;

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

    const isClickable = (el: HTMLElement | null): boolean => {
      if (!el) return false;
      try {
        const cursor = window.getComputedStyle(el).cursor;
        return (
          cursor === "pointer" ||
          el.tagName === "A" ||
          el.tagName === "BUTTON" ||
          el.closest("a") !== null ||
          el.closest("button") !== null ||
          el.getAttribute("role") === "button"
        );
      } catch {
        return false;
      }
    };

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      const target = e.target as HTMLElement | null;
      const hoveringClickable = isClickable(target);
      
      const count = hoveringClickable ? 3 : 1;
      const sizeMult = hoveringClickable ? 1.5 : 1.0;

      for (let i = 0; i < count; i++) {
        particles.current.push({
          x: e.clientX + (Math.random() - 0.5) * 6,
          y: e.clientY + (Math.random() - 0.5) * 6,
          size: (Math.random() * 4 + 2.5) * sizeMult,
          life: Math.random() * 0.3 + 0.7,
          maxLife: 1,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.4,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.15,
        });
      }
    };

    const onClick = (e: MouseEvent) => {
      for (let i = 0; i < 15; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1.5;
        particles.current.push({
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 5 + 3,
          life: Math.random() * 0.4 + 0.7,
          maxLife: 1,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.3,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.25,
        });
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onClick);

    const drawStar = (cx: number, cy: number, r: number, rot: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
      }
      ctx.moveTo(-r * 0.3, -r * 0.3);
      ctx.lineTo(r * 0.3, r * 0.3);
      ctx.moveTo(r * 0.3, -r * 0.3);
      ctx.lineTo(-r * 0.3, r * 0.3);
      ctx.stroke();
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const ps = particles.current;

      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        p.life -= 0.025;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        if (p.life <= 0) {
          ps.splice(i, 1);
          continue;
        }

        const alpha = p.life * 0.7;
        ctx.strokeStyle = `rgba(212, 180, 100, ${alpha})`;
        ctx.lineWidth = 1;
        drawStar(p.x, p.y, p.size * p.life, p.rotation);
      }

      // Limit particle count
      if (ps.length > 150) ps.splice(0, ps.length - 150);

      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onClick);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[90] pointer-events-none"
      aria-hidden="true"
    />
  );
}
