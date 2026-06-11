import { useState, useCallback } from "react";

const TOTAL_CANDLES = 22;

const CAKE_MESSAGES = [
  "✦ make a wish, birthday girl ✦",
  "blow gently... each flame holds a year of magic",
  "22 candles for 22 beautiful years",
];

const REVEAL_MESSAGE = `Happy 22nd Birthday, Vanya! 🎂✨\nMay this year be your most magical chapter yet — full of matcha mornings, starry evenings, and all the love your heart can hold.`;

export function BirthdayCake() {
  const [candles, setCandles] = useState<boolean[]>(Array(TOTAL_CANDLES).fill(true));
  const [allBlown, setAllBlown] = useState(false);
  const [showReveal, setShowReveal] = useState(false);

  const litCount = candles.filter(Boolean).length;
  const blownCount = TOTAL_CANDLES - litCount;

  const blowCandle = useCallback((index: number) => {
    if (!candles[index] || allBlown) return;
    
    const next = [...candles];
    next[index] = false;
    setCandles(next);
    
    const remaining = next.filter(Boolean).length;
    if (remaining === 0) {
      setAllBlown(true);
      setTimeout(() => {
        setShowReveal(true);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("trigger-confetti"));
        }
      }, 600);
    }
  }, [candles, allBlown]);

  const resetCake = () => {
    setCandles(Array(TOTAL_CANDLES).fill(true));
    setAllBlown(false);
    setShowReveal(false);
  };

  // Arrange candles in rows: back row (10), front row (12)
  const backRow = candles.slice(0, 10);
  const frontRow = candles.slice(10, 22);

  return (
    <div className="relative w-full max-w-lg mx-auto select-none">
      {/* Ambient glow behind the cake */}
      <div className="absolute inset-0 -bottom-10 bg-gradient-to-t from-gold/10 via-gold/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Progress indicator */}
      <div className="text-center mb-6 space-y-2">
        <p className="font-script text-xl text-primary animate-pulse">
          {allBlown ? "✦ all candles blown! ✦" : CAKE_MESSAGES[Math.min(blownCount, 2)]}
        </p>
        <div className="flex items-center justify-center gap-2">
          <div className="h-1.5 w-32 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold to-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(blownCount / TOTAL_CANDLES) * 100}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground font-medium">{blownCount}/{TOTAL_CANDLES}</span>
        </div>
      </div>

      {/* THE CAKE */}
      <div className="relative">
        {/* Candle area */}
        <div className="relative z-10 px-6 pb-2">
          {/* Back row */}
          <div className="flex justify-center gap-1 mb-1">
            {backRow.map((lit, i) => (
              <Candle key={`b-${i}`} lit={lit} onClick={() => blowCandle(i)} index={i} />
            ))}
          </div>
          {/* Front row */}
          <div className="flex justify-center gap-1">
            {frontRow.map((lit, i) => (
              <Candle key={`f-${i}`} lit={lit} onClick={() => blowCandle(i + 10)} index={i + 10} />
            ))}
          </div>
        </div>

        {/* Cake layers */}
        <div className="relative z-0">
          {/* Top frosting */}
          <div className="mx-auto w-[85%] h-5 bg-gradient-to-b from-white/90 to-pink-100 dark:from-pink-200 dark:to-pink-300 rounded-t-[100%] border-x-2 border-t-2 border-pink-200/60 dark:border-pink-400/40" />
          
          {/* Layer 1 — top */}
          <div className="mx-auto w-[85%] h-14 bg-gradient-to-b from-pink-300 to-pink-400 dark:from-pink-600 dark:to-pink-700 relative overflow-hidden">
            {/* Sprinkles */}
            <div className="absolute inset-0 flex flex-wrap items-center justify-around px-4 gap-y-1 opacity-60">
              {Array.from({ length: 18 }).map((_, i) => (
                <span
                  key={i}
                  className="inline-block w-1.5 h-3 rounded-full"
                  style={{
                    backgroundColor: ["#fbbf24", "#f472b6", "#c084fc", "#67e8f9", "#86efac", "#fca5a5"][i % 6],
                    transform: `rotate(${(i * 37) % 180 - 90}deg)`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Middle frosting drip */}
          <div className="mx-auto w-[92%] h-4 bg-gradient-to-b from-white/85 to-pink-50 dark:from-pink-100 dark:to-pink-200 relative">
            {/* Drips */}
            {[15, 30, 50, 68, 82].map((left, i) => (
              <div
                key={i}
                className="absolute bg-white/85 dark:bg-pink-100 rounded-b-full"
                style={{
                  left: `${left}%`,
                  top: "100%",
                  width: `${8 + (i % 3) * 4}px`,
                  height: `${10 + (i % 4) * 5}px`,
                }}
              />
            ))}
          </div>

          {/* Layer 2 — bottom */}
          <div className="mx-auto w-[92%] h-16 bg-gradient-to-b from-pink-400 to-rose-500 dark:from-pink-700 dark:to-rose-800 relative overflow-hidden rounded-b-2xl border-b-4 border-rose-600/40 dark:border-rose-900/50">
            {/* Decorative dots */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-white/40" />
              ))}
            </div>
          </div>

          {/* Cake plate */}
          <div className="mx-auto w-[100%] h-3 bg-gradient-to-b from-neutral-200 to-neutral-300 dark:from-neutral-600 dark:to-neutral-700 rounded-b-xl border-b-2 border-neutral-400/40" />
        </div>
      </div>

      {/* Reveal message */}
      {showReveal && (
        <div className="mt-8 text-center space-y-4 animate-fade-up">
          <div className="text-5xl animate-bounce-in">🎉</div>
          <p className="font-display text-2xl md:text-3xl text-twilight leading-relaxed whitespace-pre-line">
            {REVEAL_MESSAGE}
          </p>
          <button
            onClick={resetCake}
            className="text-xs text-primary/70 underline underline-offset-4 hover:text-primary transition-colors cursor-pointer"
          >
            relight the candles ✦
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Individual Candle Component ─────────────────────── */
function Candle({ lit, onClick, index }: { lit: boolean; onClick: () => void; index: number }) {
  return (
    <button
      onClick={onClick}
      className="relative flex flex-col items-center cursor-pointer group focus:outline-none transition-transform hover:scale-110 active:scale-95"
      title={lit ? "Tap to blow out" : "Already blown"}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Flame */}
      <div className={`relative w-3 h-5 mb-[-2px] transition-all duration-500 ${lit ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}>
        {/* Outer glow */}
        <div className="absolute -inset-2 bg-gold/40 rounded-full blur-md animate-pulse" />
        {/* Flame body */}
        <div
          className="relative w-full h-full rounded-full"
          style={{
            background: "linear-gradient(to top, #f59e0b 0%, #fbbf24 40%, #fef3c7 75%, transparent 100%)",
            animation: `candle-flicker ${0.8 + (index % 5) * 0.15}s ease-in-out infinite alternate`,
          }}
        />
        {/* Inner bright core */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-2 rounded-full bg-white/90" />
      </div>

      {/* Smoke wisp (shown when blown out) */}
      {!lit && (
        <div className="absolute -top-4 w-1 h-6 pointer-events-none">
          <div
            className="w-full h-full bg-gradient-to-t from-neutral-400/40 to-transparent rounded-full blur-[1px]"
            style={{ animation: "smoke-rise 2s ease-out forwards" }}
          />
        </div>
      )}

      {/* Wick */}
      <div className="w-[2px] h-2 bg-neutral-700 dark:bg-neutral-400 rounded-t-full" />

      {/* Candle body */}
      <div
        className="w-3 h-8 rounded-b-sm relative overflow-hidden"
        style={{
          background: `linear-gradient(to right, 
            hsl(${(index * 47) % 360}, 70%, 75%) 0%, 
            hsl(${(index * 47 + 30) % 360}, 80%, 82%) 50%, 
            hsl(${(index * 47) % 360}, 70%, 75%) 100%)`,
        }}
      >
        {/* Wax drip */}
        <div
          className="absolute -top-0.5 left-0 w-full h-1.5 rounded-b-full"
          style={{
            background: `hsl(${(index * 47 + 15) % 360}, 75%, 85%)`,
          }}
        />
      </div>

      {/* Candle number label on hover */}
      <span className="absolute -bottom-5 text-[8px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity font-bold">
        {index + 1}
      </span>

      {/* Inline keyframes */}
      <style>{`
        @keyframes candle-flicker {
          0% { transform: scaleX(0.85) scaleY(0.95) translateY(0); }
          25% { transform: scaleX(1.1) scaleY(1.05) translateY(-1px); }
          50% { transform: scaleX(0.9) scaleY(1) translateY(0.5px); }
          75% { transform: scaleX(1.05) scaleY(0.98) translateY(-0.5px); }
          100% { transform: scaleX(0.95) scaleY(1.02) translateY(0); }
        }
        @keyframes smoke-rise {
          0% { opacity: 0.6; transform: translateY(0) scaleX(1); }
          50% { opacity: 0.3; transform: translateY(-8px) scaleX(1.5); }
          100% { opacity: 0; transform: translateY(-20px) scaleX(2); }
        }
      `}</style>
    </button>
  );
}
