import { Reveal } from "@/components/Reveal";

const timeline = [
  { emoji: "✦", label: "the stars aligned" },
  { emoji: "☾", label: "a wish was made" },
  { emoji: "🍵", label: "first sip of magic" },
  { emoji: "🧸", label: "hirono approved" },
  { emoji: "♡", label: "this page, for you" },
];

const devices = [
  { icon: "📱", label: "iPhone" },
  { icon: "🍃", label: "iPad" },
  { icon: "✦", label: "MacBook" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 pt-16 pb-10 mt-20 bg-aurora">
      <div className="mx-auto max-w-6xl px-6 space-y-10">
        {/* Love Timeline */}
        <Reveal className="flex justify-center">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
            {timeline.map((t, i) => (
              <div key={i} className="flex items-center gap-2 sm:gap-3">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-2xl">{t.emoji}</span>
                  <span className="text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                    {t.label}
                  </span>
                </div>
                {i < timeline.length - 1 && (
                  <div className="w-6 sm:w-10 h-px bg-gradient-to-r from-primary/30 to-gold/30" />
                )}
              </div>
            ))}
          </div>
        </Reveal>

        {/* Device mini-strip */}
        <Reveal className="flex justify-center">
          <div className="glass-card rounded-2xl px-6 py-3 flex items-center gap-6">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground hidden sm:block">
              made for
            </p>
            {devices.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <span className="text-lg">{d.icon}</span>
                <span className="text-[9px] uppercase tracking-wider text-muted-foreground">{d.label}</span>
              </div>
            ))}
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground hidden sm:block">
              · every screen ✦
            </p>
          </div>
        </Reveal>

        {/* Main footer text */}
        <div className="text-center space-y-3">
          <p className="font-script text-2xl text-primary flex items-center justify-center gap-2">
            Made with{" "}
            <span className="inline-block animate-heartbeat text-xl">♡</span>{" "}
            for Vanya
            <span className="inline-block animate-hirono-bob text-lg ml-1" title="Hirono says hi!">🧸</span>
          </p>
          <p className="text-xs text-muted-foreground tracking-widest uppercase">
            ✦ 16 · 06 · 2026 ✦
          </p>
        </div>

        {/* Share row */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              if (typeof navigator !== "undefined" && navigator.share) {
                navigator.share({
                  title: "Happy Birthday, Vanya ✦",
                  text: "A whimsical birthday tribute for Vanya Bharti",
                  url: window.location.origin,
                });
              } else if (typeof navigator !== "undefined" && navigator.clipboard) {
                navigator.clipboard.writeText(window.location.origin);
                alert("Link copied! ✦");
              }
            }}
            className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors border border-border/50 rounded-full px-5 py-2 hover:bg-primary/5 hover:border-primary/30"
          >
            share this wish ✦
          </button>
        </div>
      </div>
    </footer>
  );
}

