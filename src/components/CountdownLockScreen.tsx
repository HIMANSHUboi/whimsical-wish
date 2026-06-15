import { useEffect, useState, useRef, useMemo } from "react";
import { Sparkles } from "@/components/Sparkles";
import { Lock, Unlock, Music, Heart, Volume2 } from "lucide-react";
import lily1 from "@/assets/lily1.png";
import lily2 from "@/assets/lily2.png";

// Target date: June 16, 2026
const BIRTHDAY_IST = new Date("2026-06-16T00:00:00+05:30").getTime();
const SECRET_PASSCODE = "braydenimissyou";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(): TimeLeft | null {
  const now = Date.now();
  const diff = BIRTHDAY_IST - now;
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

interface CountdownLockScreenProps {
  onUnlock: () => void;
}

export function CountdownLockScreen({ onUnlock }: CountdownLockScreenProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(getTimeLeft);
  const [passcode, setPasscode] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [typedKeys, setTypedKeys] = useState("");

  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update countdown every second
  useEffect(() => {
    const id = setInterval(() => {
      const remaining = getTimeLeft();
      setTimeLeft(remaining);
      if (remaining === null) {
        clearInterval(id);
        // Automatically unlock when time is up
        onUnlock();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [onUnlock]);

  // Keyboard shortcut (cheat code) listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid intercepting keystrokes if the input is focused
      if (document.activeElement?.tagName === "INPUT") return;

      const key = e.key.toLowerCase();
      // Keep track of the last N characters where N is the secret passcode length
      setTypedKeys((prev) => {
        const next = (prev + key).slice(-SECRET_PASSCODE.length);
        if (next === SECRET_PASSCODE) {
          triggerUnlock();
        }
        return next;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const triggerUnlock = () => {
    setIsUnlocking(true);
    setTimeout(() => {
      onUnlock();
    }, 1500); // 1.5s delay for transition animation
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.toLowerCase().trim() === SECRET_PASSCODE) {
      setError(false);
      setShowModal(false);
      triggerUnlock();
    } else {
      setError(true);
      // Reset error after animation
      setTimeout(() => setError(false), 600);
      setPasscode("");
    }
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowModal(false);
      }
    };
    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
      // Auto focus input
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showModal]);

  // Falling lily petals
  const petals = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 20 + 14,
      duration: Math.random() * 8 + 8,
      delay: Math.random() * 10,
      rotation: Math.random() * 360,
      drift: Math.random() * 80 - 40,
      color: ["#c4b5fd", "#f9a8d4", "#fde68a", "#a5f3fc", "#d8b4fe", "#fbcfe8"][i % 6],
    })),
  []);

  return (
    <div className={`relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-twilight select-none transition-all duration-1000 ${isUnlocking ? "opacity-0 scale-105 pointer-events-none" : "opacity-100"}`}>
      {/* Background Sparkles */}
      <Sparkles count={15} />

      {/* Falling Lily Petals */}
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute pointer-events-none"
          style={{
            left: `${petal.left}%`,
            top: `-${petal.size + 10}px`,
            animation: `petal-fall ${petal.duration}s ${petal.delay}s ease-in-out infinite`,
            "--petal-drift": `${petal.drift}px`,
          } as React.CSSProperties}
        >
          <svg
            width={petal.size}
            height={petal.size * 1.4}
            viewBox="0 0 24 34"
            fill="none"
            style={{ transform: `rotate(${petal.rotation}deg)`, opacity: 0.75 }}
          >
            <ellipse cx="12" cy="20" rx="7" ry="11" fill={petal.color} opacity="0.85" />
            <ellipse cx="12" cy="8" rx="4.5" ry="7" fill={petal.color} opacity="0.95" />
            <ellipse cx="12" cy="12" rx="3" ry="5" fill="white" opacity="0.4" />
          </svg>
        </div>
      ))}

      {/* Lily corner accents on lock screen */}
      <div className="absolute -left-10 bottom-16 w-36 opacity-20 pointer-events-none select-none animate-float">
        <img src={lily1} alt="" className="w-full h-auto object-contain" />
      </div>
      <div className="absolute -right-8 top-28 w-28 opacity-15 pointer-events-none select-none animate-float" style={{ animationDelay: "3s" }}>
        <img src={lily2} alt="" className="w-full h-auto object-contain" style={{ transform: "scaleX(-1)" }} />
      </div>

      {/* Decorative Orbits & Nebulas (Optimized with radial gradients, avoiding expensive CSS blur filters) */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-10" 
        style={{ background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)" }}
      />
      <div 
        className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full pointer-events-none opacity-5" 
        style={{ background: "radial-gradient(circle, var(--color-gold) 0%, transparent 70%)" }}
      />
      
      {/* Mystical Celestial Rings (Optimized for GPU acceleration, avoiding layout recalculations by separating centering from rotation) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="relative w-[350px] h-[350px] sm:w-[450px] sm:h-[450px]">
          {/* Inner Ring */}
          <div 
            className="absolute inset-0 rounded-full border border-primary/20 animate-spin-slow"
            style={{ willChange: "transform", transform: "translate3d(0,0,0)" }}
          />
          {/* Outer Ring */}
          <div 
            className="absolute inset-[-75px] sm:inset-[-100px] rounded-full border border-dashed border-gold/15" 
            style={{ 
              animation: "spin-slow 40s linear infinite reverse",
              willChange: "transform",
              transform: "translate3d(0,0,0)"
            }} 
          />
        </div>
      </div>

      {/* Header */}
      <header className="w-full text-center py-8 z-10 animate-fade-up">
        <p className="font-script text-gold text-2xl sm:text-3xl">Vanya's Whimsical Wish</p>
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold/40 to-transparent mx-auto mt-2" />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 z-10 max-w-4xl mx-auto w-full">
        {isUnlocking ? (
          <div className="text-center space-y-6 animate-pulse">
            <Heart className="w-16 h-16 text-gold fill-gold mx-auto animate-heartbeat" />
            <h2 className="font-display text-4xl sm:text-5xl text-white italic leading-tight">
              The stars align for you...
            </h2>
            <p className="text-muted-foreground font-body text-sm tracking-widest uppercase">
              opening the whimsical gates ✦
            </p>
          </div>
        ) : (
          <div className="w-full text-center space-y-12">
            <div className="space-y-4 animate-fade-up">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-gold text-xs uppercase tracking-[0.3em] backdrop-blur-sm">
                ✦ Celestial Countdown ✦
              </span>
              <h1 className="font-display text-4xl sm:text-6xl text-white leading-tight font-medium max-w-2xl mx-auto text-balance">
                Her Whimsical Garden <br />
                <span className="italic text-gold font-normal">will bloom in</span>
              </h1>
            </div>

            {/* Countdown Grid */}
            {timeLeft && (
              <div className="grid grid-cols-4 gap-3 sm:gap-6 max-w-2xl mx-auto items-center justify-center animate-fade-up" style={{ animationDelay: "0.2s" }}>
                {[
                  { value: timeLeft.days, label: "Days" },
                  { value: timeLeft.hours, label: "Hours" },
                  { value: timeLeft.minutes, label: "Mins" },
                  { value: timeLeft.seconds, label: "Secs" },
                ].map((unit, i) => (
                  <div key={unit.label} className="flex flex-col items-center">
                    <div className="relative w-full aspect-square max-w-[120px] rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-soft overflow-hidden flex items-center justify-center group hover:border-gold/30 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                      <span className="font-display text-3xl sm:text-5xl text-white font-semibold">
                        {String(unit.value).padStart(2, "0")}
                      </span>
                      {/* Decorative Divider */}
                      <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
                    </div>
                    <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-gold/80 mt-3 font-medium">
                      {unit.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Subtitle/Hint */}
            <div className="space-y-4 max-w-lg mx-auto animate-fade-up" style={{ animationDelay: "0.4s" }}>
              <p className="text-muted-foreground text-sm leading-relaxed text-balance">
                This whimsical corner of the universe is being woven from stars, tarot cards, and lavender skies. It will unlock automatically on her birthday, <span className="text-gold font-semibold">June 16, 2026</span>.
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-gold/60">
                <Music className="w-3.5 h-3.5" />
                <span>Play the ambient vibes in the bottom right while you wait</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer / Secret Trigger */}
      <footer className="w-full flex justify-between items-center px-8 py-6 z-10">
        {/* Subtle, hidden corner secret access trigger */}
        <button
          onClick={() => setShowModal(true)}
          className="text-white/15 hover:text-gold/40 transition-colors duration-500 cursor-pointer text-sm"
          title="✦"
          aria-label="Secret Access"
        >
          ✦
        </button>

        <p className="text-xs text-muted-foreground/60 tracking-wider">
          love for vanya
        </p>
      </footer>

      {/* Secret Passcode Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in">
          <div
            ref={modalRef}
            className={`w-full max-w-sm bg-card/95 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-glow transition-all duration-300 ${
              error ? "animate-shake border-destructive/50" : ""
            }`}
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Lock className="w-5 h-5 text-gold" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display text-xl text-twilight font-semibold">Enter Golden Key</h3>
                <p className="text-xs text-muted-foreground">Unlock the whimsical gates early</p>
              </div>
              
              <form onSubmit={handleSubmit} className="w-full space-y-4 mt-2">
                <input
                  ref={inputRef}
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter the secret phrase..."
                  className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-center outline-none transition-all placeholder:text-muted-foreground/50 text-foreground text-sm"
                />
                
                {error && (
                  <p className="text-xs text-destructive font-medium animate-pulse">
                    The stars remain silent. Try again.
                  </p>
                )}

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-border text-xs text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 shadow-soft cursor-pointer font-medium"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    Unlock
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add custom CSS animations needed for modal shake */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15%, 45%, 75% { transform: translateX(-6px); }
          30%, 60%, 90% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
