import { useEffect, useState } from "react";

const BIRTHDAY = new Date("2026-06-16T00:00:00").getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(): TimeLeft | null {
  const now = Date.now();
  const diff = BIRTHDAY - now;
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function FlipDigit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-2xl bg-card/80 backdrop-blur border border-border/50 shadow-soft overflow-hidden flex items-center justify-center animate-glow-pulse">
        <span
          key={display}
          className="font-display text-3xl sm:text-4xl text-twilight animate-slide-up"
        >
          {display}
        </span>
        {/* Decorative divider */}
        <div className="absolute inset-x-0 top-1/2 h-px bg-border/30" />
      </div>
      <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export function CountdownTimer({ compact = false }: { compact?: boolean }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  if (timeLeft === null) {
    return (
      <div className="text-center space-y-3 animate-bounce-in">
        <p className="text-5xl sm:text-6xl">🎂</p>
        <p className="font-script text-4xl sm:text-5xl text-primary">
          Happy Birthday, Vanya!
        </p>
        <p className="text-muted-foreground italic">
          today is your day — the whole world celebrates you ✦
        </p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground font-display">
        <span className="text-primary font-medium">{timeLeft.days}d</span>
        <span>:</span>
        <span className="text-primary font-medium">{timeLeft.hours}h</span>
        <span>:</span>
        <span className="text-primary font-medium">{timeLeft.minutes}m</span>
        <span>:</span>
        <span className="text-primary font-medium">{timeLeft.seconds}s</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-center">
      <p className="font-script text-2xl sm:text-3xl text-primary">
        counting down to something magical ✦
      </p>
      <div className="flex justify-center gap-3 sm:gap-5">
        <FlipDigit value={timeLeft.days} label="days" />
        <span className="font-display text-3xl text-primary/50 self-center pb-7">:</span>
        <FlipDigit value={timeLeft.hours} label="hours" />
        <span className="font-display text-3xl text-primary/50 self-center pb-7">:</span>
        <FlipDigit value={timeLeft.minutes} label="mins" />
        <span className="font-display text-3xl text-primary/50 self-center pb-7">:</span>
        <FlipDigit value={timeLeft.seconds} label="secs" />
      </div>
    </div>
  );
}
