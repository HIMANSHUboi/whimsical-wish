import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "@/components/Sparkles";
import { Reveal } from "@/components/Reveal";
import { CountdownTimer } from "@/components/CountdownTimer";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "The Day ✦ 16 June 2026" },
      { name: "description", content: "Vanya's birthday, marked in gold." },
    ],
  }),
  component: CalendarPage,
});

function CalendarPage() {
  // June 2026: starts on Monday (June 1 2026 = Monday)
  const firstDayOffset = 1; // Mon
  const daysInMonth = 30;
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <section className="relative bg-dreamy py-20 overflow-hidden">
      <Sparkles count={20} />
      <div className="relative mx-auto max-w-3xl px-6 space-y-10">
        <Reveal className="text-center space-y-3">
          <p className="font-script text-3xl text-primary">save the date</p>
          <h1 className="font-display text-5xl md:text-6xl text-twilight">
            June 2026
          </h1>
          <p className="text-muted-foreground">
            The day Vanya turns 22 — one day painted gold among thirty.
          </p>
        </Reveal>

        {/* Countdown */}
        <Reveal variant="float-in" delay={100}>
          <CountdownTimer />
        </Reveal>

        <Reveal variant="float-in" delay={200}>
          <div className="rounded-3xl bg-card/90 backdrop-blur p-6 md:p-10 shadow-soft border border-border/50">
            <div className="grid grid-cols-7 gap-2 text-center">
              {weekdays.map((w, i) => (
                <div key={i} className="text-xs uppercase tracking-widest text-primary/70 py-2">
                  {w}
                </div>
              ))}
              {cells.map((d, i) => {
                const isBday = d === 16;
                return (
                  <div
                    key={i}
                    className={`aspect-square flex items-center justify-center rounded-xl text-sm transition-all
                      ${d === null ? "" : "hover:bg-secondary/50"}
                      ${isBday ? "bg-gold text-twilight font-display text-2xl shadow-glow animate-float relative" : "text-foreground/70"}
                    `}
                  >
                    {isBday && (
                      <span className="absolute -top-2 -right-2 text-lg animate-twinkle">✦</span>
                    )}
                    {d ?? ""}
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        <Reveal className="text-center space-y-2">
          <p className="font-script text-4xl text-primary">16 · 06 · 2026</p>
          <p className="text-muted-foreground italic">
            the day the world got a little softer — 22 years ago, she arrived
          </p>
        </Reveal>
      </div>
    </section>
  );
}
