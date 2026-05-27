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
  shape: "rect" | "circle" | "star";
}

const COLORS = [
  "oklch(0.82 0.12 85)",   // gold
  "oklch(0.78 0.1 10)",    // rose
  "oklch(0.78 0.08 300)",  // lavender
  "oklch(0.95 0.02 320)",  // white-ish
  "oklch(0.45 0.13 310)",  // primary purple
  "oklch(0.6 0.12 310)",   // ring purple
  "oklch(0.88 0.14 60)",   // warm amber
];

// Check if it's Vanya's birthday (June 16)
function isBirthdayMidnight(): boolean {
  const now = new Date();
  const isBirthday = now.getMonth() === 5 && now.getDate() === 16; // June 16
  const isMidnight = now.getHours() === 0 && now.getMinutes() < 3; // first 3 min
  return isBirthday && isMidnight;
}

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  const spikes = 5;
  const outerRadius = r;
  const innerRadius = r * 0.4;
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fill();
}

export function ConfettiBurst() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(false);
  const [showBirthdayOverlay, setShowBirthdayOverlay] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleTrigger = () => {
      setActive(true);
    };

    window.addEventListener("trigger-confetti", handleTrigger);

    // Birthday midnight check
    if (isBirthdayMidnight()) {
      const birthdayDone = sessionStorage.getItem("birthday-midnight-done");
      if (!birthdayDone) {
        setTimeout(() => {
          setActive(true);
          setShowBirthdayOverlay(true);
          setTimeout(() => setOverlayVisible(true), 100);
          setTimeout(() => {
            setOverlayVisible(false);
            setTimeout(() => setShowBirthdayOverlay(false), 800);
          }, 6000);
          sessionStorage.setItem("birthday-midnight-done", "1");
        }, 800);
      }
    }

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
    const PIECE_COUNT = isBirthdayMidnight() ? 350 : 200;
    const shapes: Piece["shape"][] = ["rect", "circle", "star"];

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
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      });
    }

    let frame = 0;
    const maxFrames = isBirthdayMidnight() ? 300 : 180;

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
          p.opacity -= 0.012;
        }

        if (p.opacity <= 0) continue;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.opacity);

        if (p.shape === "rect") {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        } else if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          drawStar(ctx, 0, 0, p.w);
        }
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

  return (
    <>
      {active && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 z-[99] pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* Birthday midnight overlay */}
      {showBirthdayOverlay && (
        <div
          className={`fixed inset-0 z-[98] flex items-center justify-center pointer-events-none transition-all duration-700 ${
            overlayVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="text-center space-y-4 px-8">
            <div
              className="font-script text-gold leading-tight text-balance animate-glow-pulse"
              style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", textShadow: "0 0 40px oklch(0.82 0.12 85 / 0.8), 0 0 80px oklch(0.82 0.12 85 / 0.4)" }}
            >
              Happy Birthday,<br />
              <span style={{ fontSize: "clamp(3rem, 10vw, 6.5rem)" }}>Vanya! 🎂</span>
            </div>
            <p
              className="font-display italic text-white/80 animate-fade-up"
              style={{ fontSize: "clamp(1rem, 3vw, 1.5rem)", textShadow: "0 2px 20px rgba(0,0,0,0.5)", animationDelay: "0.5s" }}
            >
              It's officially your day ✦ the stars shine for you
            </p>
          </div>
        </div>
      )}
    </>
  );
}
