import { useEffect, useRef, useCallback } from "react";

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  opacity: number;
  life: number;
  maxLife: number;
  width: number;
  hue: number;
}

export function ShootingStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<ShootingStar[]>([]);
  const frameRef = useRef<number>(0);
  const lastAutoRef = useRef(Date.now());

  const spawnStar = useCallback((fromX?: number, fromY?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = canvas.width;
    const h = canvas.height;

    // Direction: generally top-right to bottom-left with variation
    const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.8; // ~45deg ± variation
    const speed = 4 + Math.random() * 6;

    const star: ShootingStar = {
      x: fromX ?? Math.random() * w * 0.8 + w * 0.1,
      y: fromY ?? Math.random() * h * 0.3,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      length: 40 + Math.random() * 80,
      opacity: 0.8 + Math.random() * 0.2,
      life: 0,
      maxLife: 40 + Math.random() * 30,
      width: 1.5 + Math.random() * 1.5,
      hue: Math.random() > 0.5 ? 45 : 270, // gold or purple
    };

    starsRef.current.push(star);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };

    resizeCanvas();
    const resizeObs = new ResizeObserver(resizeCanvas);
    if (canvas.parentElement) resizeObs.observe(canvas.parentElement);

    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Auto-spawn shooting stars every 3-6 seconds
      const now = Date.now();
      if (now - lastAutoRef.current > 3000 + Math.random() * 3000) {
        spawnStar();
        lastAutoRef.current = now;
      }

      // Update & draw stars
      starsRef.current = starsRef.current.filter((star) => {
        star.x += star.vx;
        star.y += star.vy;
        star.life++;

        const progress = star.life / star.maxLife;
        const fadeIn = Math.min(progress * 4, 1);
        const fadeOut = Math.max(1 - (progress - 0.6) / 0.4, 0);
        const alpha = star.opacity * fadeIn * (progress > 0.6 ? fadeOut : 1);

        if (alpha <= 0 || star.x > w + 100 || star.y > h + 100 || star.x < -100 || star.y < -100) {
          return false;
        }

        // Draw trail
        const trailLen = star.length * fadeIn;
        const tailX = star.x - (star.vx / Math.sqrt(star.vx ** 2 + star.vy ** 2)) * trailLen;
        const tailY = star.y - (star.vy / Math.sqrt(star.vx ** 2 + star.vy ** 2)) * trailLen;

        const gradient = ctx.createLinearGradient(tailX, tailY, star.x, star.y);
        gradient.addColorStop(0, `hsla(${star.hue}, 80%, 85%, 0)`);
        gradient.addColorStop(0.6, `hsla(${star.hue}, 80%, 85%, ${alpha * 0.4})`);
        gradient.addColorStop(1, `hsla(${star.hue}, 90%, 95%, ${alpha})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(star.x, star.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = star.width;
        ctx.lineCap = "round";
        ctx.stroke();

        // Head glow
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.width * 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${star.hue}, 90%, 95%, ${alpha * 0.6})`;
        ctx.fill();

        return true;
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    // Click to spawn
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spawnStar(x, y);
    };

    canvas.addEventListener("click", handleClick);

    return () => {
      cancelAnimationFrame(frameRef.current);
      canvas.removeEventListener("click", handleClick);
      resizeObs.disconnect();
    };
  }, [spawnStar]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto z-[1]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
