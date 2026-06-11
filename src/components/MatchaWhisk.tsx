import { useState, useRef, useEffect } from "react";
import { Reveal } from "@/components/Reveal";

type WhiskStage = "prepare" | "sift" | "pour" | "whisk" | "ready" | "fortune";

const FORTUNES = [
  "Your year will be as smooth and beautifully blended as this cup. 🍵",
  "A quiet ritual brings big magic. Trust your slow progress. ✦",
  "Softness is a superpower. Bloom at your own pace today. 🌸",
  "Something sweet is brewing for you. Open your heart to it. ♡",
  "May your mornings be warm and your afternoons full of peace. 🌿",
  "Like matcha, life is best when frothed with love and patience. ✧",
];

export function MatchaWhisk() {
  const [stage, setStage] = useState<WhiskStage>("prepare");
  const [whiskProgress, setWhiskProgress] = useState(0);
  const [isWhisking, setIsWhisking] = useState(false);
  const [fortune, setFortune] = useState("");
  const whiskRef = useRef<HTMLDivElement>(null);
  const lastPos = useRef({ x: 0, y: 0 });

  const startRitual = () => {
    setStage("sift");
    setWhiskProgress(0);
  };

  const handleSifted = () => {
    setStage("pour");
  };

  const handlePoured = () => {
    setStage("whisk");
  };

  // Track cursor movement inside the bowl for whisking progress
  const handleMouseMove = (e: React.MouseEvent) => {
    if (stage !== "whisk") return;
    
    const { clientX, clientY } = e;
    if (lastPos.current.x !== 0 && lastPos.current.y !== 0) {
      const dx = Math.abs(clientX - lastPos.current.x);
      const dy = Math.abs(clientY - lastPos.current.y);
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist > 5) {
        setIsWhisking(true);
        setWhiskProgress((prev) => {
          const next = prev + dist * 0.08;
          if (next >= 100) {
            setStage("ready");
            setIsWhisking(false);
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("trigger-confetti"));
            }
            return 100;
          }
          return next;
        });
      }
    }
    lastPos.current = { x: clientX, y: clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (stage !== "whisk") return;
    const touch = e.touches[0];
    const { clientX, clientY } = touch;
    if (lastPos.current.x !== 0 && lastPos.current.y !== 0) {
      const dx = Math.abs(clientX - lastPos.current.x);
      const dy = Math.abs(clientY - lastPos.current.y);
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist > 5) {
        setIsWhisking(true);
        setWhiskProgress((prev) => {
          const next = prev + dist * 0.08;
          if (next >= 100) {
            setStage("ready");
            setIsWhisking(false);
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("trigger-confetti"));
            }
            return 100;
          }
          return next;
        });
      }
    }
    lastPos.current = { x: clientX, y: clientY };
  };

  const stopWhisking = () => {
    setIsWhisking(false);
    lastPos.current = { x: 0, y: 0 };
  };

  const takeSip = () => {
    const randomFortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
    setFortune(randomFortune);
    setStage("fortune");
  };

  const resetRitual = () => {
    setStage("prepare");
    setWhiskProgress(0);
    setFortune("");
  };

  return (
    <Reveal className="mx-auto max-w-2xl px-4 py-8">
      <div className="glass-card rounded-[2.5rem] p-8 md:p-10 shadow-glow border-2 border-primary/20 text-center relative overflow-hidden">
        {/* Floating background bubbles */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-300/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-6">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] uppercase tracking-[0.25em] text-primary font-medium">
              🌿 interactive ritual
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-twilight mt-2">
              Whisk Your Own Matcha ✦
            </h2>
            <p className="text-xs text-muted-foreground italic mt-1">
              Slow down and prepare a virtual ceremonial cup.
            </p>
          </div>

          {/* RITUAL CANVAS / INTERACTION STAGE */}
          <div className="relative min-h-[280px] bg-background/40 rounded-3xl border border-border/40 flex flex-col items-center justify-center p-6 transition-all duration-500 overflow-hidden">
            
            {/* Stage: Prepare */}
            {stage === "prepare" && (
              <div className="space-y-4 animate-fade-up">
                <div className="text-6xl animate-float">🍵</div>
                <p className="font-script text-2xl text-primary">begin the ceremony</p>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  Take a quiet breath and prepare a warm cup of ceremonial Uji matcha.
                </p>
                <button
                  onClick={startRitual}
                  className="rounded-full bg-primary text-primary-foreground px-6 py-2.5 shadow-soft hover:scale-105 transition-transform font-display text-sm"
                >
                  Start Whisking →
                </button>
              </div>
            )}

            {/* Stage: Sift Matcha Powder */}
            {stage === "sift" && (
              <div className="space-y-5 animate-fade-up">
                <div className="relative w-28 h-20 mx-auto">
                  <div className="absolute inset-0 text-5xl animate-bounce">🥄</div>
                  <div className="absolute bottom-0 inset-x-0 h-4 flex justify-center gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-emerald-600/60 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
                <p className="font-script text-2xl text-primary">sifting the vibrant green</p>
                <p className="text-xs text-muted-foreground">
                  Sifting removes the lumps for the smoothest froth.
                </p>
                <button
                  onClick={handleSifted}
                  className="rounded-full bg-primary text-primary-foreground px-6 py-2.5 shadow-soft hover:scale-105 transition-transform font-display text-sm"
                >
                  Add Hot Water ✦
                </button>
              </div>
            )}

            {/* Stage: Pour Water */}
            {stage === "pour" && (
              <div className="space-y-5 animate-fade-up">
                <div className="relative w-28 h-20 mx-auto">
                  <div className="absolute inset-0 text-5xl origin-bottom-right rotate-[30deg] animate-pulse">🫖</div>
                  <div className="absolute bottom-0 left-4 w-1 h-8 bg-sky-300/40 rounded-full animate-pulse mx-auto" />
                </div>
                <p className="font-script text-2xl text-primary">pouring warmth</p>
                <p className="text-xs text-muted-foreground">
                  Steeping at 80°C to preserve the gentle floral notes.
                </p>
                <button
                  onClick={handlePoured}
                  className="rounded-full bg-primary text-primary-foreground px-6 py-2.5 shadow-soft hover:scale-105 transition-transform font-display text-sm"
                >
                  Grab Bamboo Whisk 🪶
                </button>
              </div>
            )}

            {/* Stage: Whisking */}
            {stage === "whisk" && (
              <div
                className="w-full h-full flex flex-col items-center justify-center cursor-crosshair select-none relative"
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
                onMouseLeave={stopWhisking}
                onTouchEnd={stopWhisking}
              >
                {/* Steaming animations */}
                <div className="absolute top-4 flex gap-2 justify-center w-full">
                  {[1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className="w-1 h-6 bg-white/20 rounded-full blur-[1px]"
                      style={{
                        animation: "smoke 3s infinite",
                        animationDelay: `${i * 0.6}s`,
                      }}
                    />
                  ))}
                </div>

                {/* The Matcha Bowl */}
                <div className="relative w-40 h-40 rounded-full border-4 border-emerald-950/20 shadow-inner flex items-center justify-center overflow-hidden bg-emerald-900/40">
                  {/* Whisking fluid color */}
                  <div
                    className="absolute inset-0 transition-colors duration-1000"
                    style={{
                      backgroundColor: `oklch(${0.35 + (whiskProgress / 100) * 0.25} ${0.12 - (whiskProgress / 100) * 0.04} ${140 + (whiskProgress / 100) * 10} / 0.85)`,
                    }}
                  />

                  {/* Bubble / Froth textures */}
                  {whiskProgress > 20 && (
                    <div className="absolute inset-2 grid grid-cols-5 gap-1.5 opacity-60">
                      {Array.from({ length: Math.min(25, Math.floor(whiskProgress / 4)) }).map((_, i) => (
                        <div
                          key={i}
                          className="w-2.5 h-2.5 rounded-full bg-emerald-200/50 animate-pulse"
                          style={{
                            animationDelay: `${i * 0.1}s`,
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Wandering Whisk Cursor Visual inside the bowl */}
                  {isWhisking && (
                    <div className="absolute text-3xl pointer-events-none animate-bounce" style={{
                      left: lastPos.current.x ? `${(lastPos.current.x % 100) + 20}px` : "50%",
                      top: lastPos.current.y ? `${(lastPos.current.y % 80) + 30}px` : "50%",
                      transform: "translate(-50%, -50%)",
                    }}>
                      🧹
                    </div>
                  )}
                </div>

                {/* Helper text / Progress Bar */}
                <div className="mt-6 w-full max-w-xs space-y-2">
                  <p className="font-script text-xl text-primary animate-pulse">
                    {isWhisking ? "whisking with intent..." : "move your mouse/finger inside the bowl"}
                  </p>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${whiskProgress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                    Froth: {Math.round(whiskProgress)}%
                  </p>
                </div>
              </div>
            )}

            {/* Stage: Ready to Sip */}
            {stage === "ready" && (
              <div className="space-y-4 animate-fade-up">
                {/* Perfect frothed cup */}
                <div className="relative w-36 h-36 rounded-full border-4 border-emerald-950/20 shadow-glow flex items-center justify-center bg-emerald-300/80 animate-glow-pulse">
                  <span className="text-4xl animate-float">🌿</span>
                  {/* Floating steam */}
                  <div className="absolute top-2 w-full flex justify-center gap-1">
                    {[1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1 h-5 bg-white/40 rounded-full blur-[1px] animate-pulse"
                      />
                    ))}
                  </div>
                </div>
                <p className="font-script text-2xl text-primary">perfectly frothed!</p>
                <p className="text-xs text-muted-foreground">
                  The foam is thick and jade-green. Ready to take a sip?
                </p>
                <button
                  onClick={takeSip}
                  className="rounded-full bg-primary text-primary-foreground px-6 py-2.5 shadow-soft hover:scale-105 transition-transform font-display text-sm"
                >
                  Take a Sip 🍵
                </button>
              </div>
            )}

            {/* Stage: Fortune Cookie / Magic Reading */}
            {stage === "fortune" && (
              <div className="space-y-5 animate-fade-up max-w-sm">
                <span className="inline-block text-4xl animate-heartbeat">✨</span>
                <p className="font-display italic text-xl md:text-2xl text-twilight leading-relaxed">
                  "{fortune}"
                </p>
                <div className="h-px bg-border/40 w-16 mx-auto" />
                <button
                  onClick={resetRitual}
                  className="rounded-full border border-primary/30 text-primary px-6 py-2 hover:bg-primary/5 transition-colors text-xs font-medium"
                >
                  Whisk Another Cup ✦
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </Reveal>
  );
}
