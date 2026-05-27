import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles } from "@/components/Sparkles";
import { ParallaxTilt } from "@/components/ParallaxTilt";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/tarot")({
  head: () => ({
    meta: [
      { title: "Tarot Garden ✦ For Vanya" },
      { name: "description", content: "A little tarot draw for the birthday girl." },
    ],
  }),
  component: Tarot,
});

const cards = [
  { name: "The Star", emoji: "✦", meaning: "Hope, renewal, and a year of soft light ahead.", detail: "The Star brings healing and serenity. After storms, you find calm waters and a sky full of promises. Your wish is heard by the universe." },
  { name: "The Moon", emoji: "☾", meaning: "Trust the mystery — your intuition is golden.", detail: "The Moon illuminates what hides in shadow. Your dreams carry messages. Trust the pull of the tides within you." },
  { name: "The Sun", emoji: "☀", meaning: "Joy is finding you everywhere this year.", detail: "Radiance and vitality. Children dance under the Sun — and so shall you. This is a year of golden, unguarded happiness." },
  { name: "The Empress", emoji: "♛", meaning: "Abundance, beauty, and creative blooming.", detail: "Lush. Fertile. Overflowing. The Empress asks you to receive all that life is offering you right now. You are worthy of softness." },
  { name: "The Lovers", emoji: "♡", meaning: "Love in every form gathers around you.", detail: "Not just romance — this is a card of alignment. Your values, your heart, your choices. When they align, magic unfolds." },
  { name: "The World", emoji: "✧", meaning: "Completion — and a brand new chapter.", detail: "You have arrived. Take a breath and feel how far you've come. The World card signals that a beautiful cycle is complete." },
  { name: "The Magician", emoji: "⚡", meaning: "You have everything you need. Create.", detail: "All four elements rest on the Magician's table — fire, water, air, earth. You are the conduit. What will you build?" },
  { name: "The High Priestess", emoji: "🌙", meaning: "Deep knowing lives in you. Trust it.", detail: "She sits between the pillars of mystery, veiled and knowing. The answers you seek are already inside you." },
  { name: "Wheel of Fortune", emoji: "✸", meaning: "A beautiful turn of fate awaits you.", detail: "The wheel spins, and for you, it rises. This is a moment of lucky change, of alignment with something larger than yourself." },
  { name: "Strength", emoji: "🦁", meaning: "Gentle power. You are stronger than you know.", detail: "Not brute force — this is the strength of compassion, patience, and heart. You tame the lion with love." },
  { name: "Temperance", emoji: "⚖", meaning: "Balance is coming — harmony in all things.", detail: "Pour between cups, mixing and blending. Temperance is the art of finding your middle path — the one that feels like home." },
  { name: "The Chariot", emoji: "⭐", meaning: "Victory through willpower. Keep going, queen.", detail: "Two opposing forces, guided by one will. You are in the driver's seat. Determination is your compass." },
];

type SpreadCard = { index: number; position: string; flipped: boolean };

// Get today's card (changes daily)
function getDailyCardIndex(): number {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return seed % cards.length;
}

function Tarot() {
  const [spread, setSpread] = useState<SpreadCard[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [tab, setTab] = useState<"daily" | "spread">("daily");
  const [dailyFlipped, setDailyFlipped] = useState(false);
  const [dailyCopied, setDailyCopied] = useState(false);

  const dailyIndex = getDailyCardIndex();
  const dailyCard = cards[dailyIndex];

  const positions = ["past", "present", "future"];
  const posLabels: Record<string, string> = { past: "your past", present: "your present", future: "your future" };

  const drawSpread = () => {
    setDrawing(true);
    const indices: number[] = [];
    while (indices.length < 3) {
      const r = Math.floor(Math.random() * cards.length);
      if (!indices.includes(r)) indices.push(r);
    }
    const newSpread: SpreadCard[] = indices.map((idx, i) => ({
      index: idx, position: positions[i], flipped: false,
    }));
    setSpread(newSpread);
    newSpread.forEach((_, i) => {
      setTimeout(() => {
        setSpread((prev) => prev.map((c, j) => (j === i ? { ...c, flipped: true } : c)));
        if (i === 2) {
          setDrawing(false);
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("trigger-confetti"));
          }
        }
      }, 600 + i * 800);
    });
  };

  const shareReading = () => {
    const text = spread.map((s) => {
      const card = cards[s.index];
      return `${posLabels[s.position]}: ${card.name} ${card.emoji} — ${card.meaning}`;
    }).join("\n");
    const full = `✦ Vanya's Birthday Tarot Reading ✦\n\n${text}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(full);
    }
  };

  const copyDailyCard = () => {
    const text = `✦ Today's Tarot Card ✦\n${dailyCard.name} ${dailyCard.emoji}\n"${dailyCard.meaning}"`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setDailyCopied(true);
      setTimeout(() => setDailyCopied(false), 2000);
    }
  };

  return (
    <section className="relative bg-twilight text-primary-foreground py-20 overflow-hidden min-h-[80vh]">
      <div className="absolute inset-0 bg-gradient-to-b from-twilight/70 via-twilight/40 to-twilight/90" aria-hidden />
      <Sparkles count={40} />
      <div className="relative mx-auto max-w-5xl px-6 text-center space-y-10 animate-fade-up">
        <p className="font-script text-3xl text-gold">a card for you</p>
        <h1 className="font-display text-5xl md:text-6xl text-balance">The Tarot Garden</h1>

        {/* Tab switcher */}
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setTab("daily")}
            className={`px-6 py-2.5 rounded-full border text-sm font-medium transition-all duration-300 ${
              tab === "daily"
                ? "bg-gold text-twilight border-gold shadow-glow"
                : "border-gold/30 text-gold/70 hover:border-gold/60 hover:text-gold"
            }`}
          >
            ☀ Daily Pull
          </button>
          <button
            onClick={() => setTab("spread")}
            className={`px-6 py-2.5 rounded-full border text-sm font-medium transition-all duration-300 ${
              tab === "spread"
                ? "bg-gold text-twilight border-gold shadow-glow"
                : "border-gold/30 text-gold/70 hover:border-gold/60 hover:text-gold"
            }`}
          >
            ✦ Three-Card Spread
          </button>
        </div>

        {/* DAILY PULL */}
        {tab === "daily" && (
          <Reveal className="space-y-8">
            <p className="text-white/60 max-w-md mx-auto italic">
              One card pulled for today — {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.
              Let it guide you gently.
            </p>

            <div className="flex justify-center">
              <div className="flex flex-col items-center gap-4">
                <ParallaxTilt max={12} className="perspective-800 w-48 h-72">
                  <div
                    className="relative w-full h-full preserve-3d transition-transform duration-700 ease-out cursor-pointer"
                    style={{ transform: dailyFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
                    onClick={() => setDailyFlipped(true)}
                  >
                    {/* Card Back */}
                    <div className="absolute inset-0 backface-hidden rounded-2xl border-2 border-gold/50 shadow-glow flex items-center justify-center" style={{ background: "linear-gradient(135deg, #3b0764 0%, #1e1b4b 100%)" }}>
                      <div className="text-center space-y-3">
                        <div className="text-6xl text-gold animate-float">✦</div>
                        <p className="font-script text-xl text-gold/90">your card awaits</p>
                        <p className="text-xs text-gold/60">tap to reveal</p>
                      </div>
                      <div className="absolute inset-3 border border-gold/25 rounded-xl" />
                    </div>
                    {/* Card Front */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl border-2 border-gold/60 bg-gradient-to-br from-purple-900/80 to-indigo-900/80 shadow-glow flex flex-col items-center justify-center p-6 text-center">
                      <div className="text-6xl text-gold mb-4 animate-bounce-in">{dailyCard.emoji}</div>
                      <p className="font-display text-2xl text-gold mb-3">{dailyCard.name}</p>
                      <p className="text-sm text-white/80 italic leading-relaxed">{dailyCard.meaning}</p>
                      <div className="absolute -inset-1 rounded-2xl bg-gold/10 blur-xl -z-10 animate-glow-pulse" />
                    </div>
                  </div>
                </ParallaxTilt>

                {dailyFlipped && (
                  <div className="max-w-sm text-center space-y-4 animate-fade-up">
                    <p className="text-white/60 text-sm leading-relaxed italic">
                      {dailyCard.detail}
                    </p>
                    <button
                      onClick={copyDailyCard}
                      className="rounded-full border border-gold/40 text-gold px-5 py-2 text-sm hover:bg-gold/10 transition-all"
                    >
                      {dailyCopied ? "copied ✓" : "copy reading ✦"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        )}

        {/* THREE-CARD SPREAD */}
        {tab === "spread" && (
          <>
            <p className="text-white/70 max-w-xl mx-auto">
              Close your eyes, make a little birthday wish, and draw a three-card spread — past, present, and future.
            </p>

            {spread.length === 0 && (
              <button onClick={drawSpread} disabled={drawing}
                className="mx-auto w-56 h-80 rounded-2xl border-2 border-gold/60 shadow-glow flex items-center justify-center transition-all duration-500 hover:scale-105 animate-glow-pulse"
                style={{ background: "linear-gradient(135deg, #3b0764 0%, #1e1b4b 100%)" }}
              >
                <div className="text-center space-y-4">
                  <div className="text-6xl text-gold animate-float">✦</div>
                  <p className="font-script text-2xl text-gold">draw your spread</p>
                </div>
              </button>
            )}

            {spread.length > 0 && (
              <>
                <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-8 pt-4">
                  {spread.map((s, i) => {
                    const card = cards[s.index];
                    return (
                      <div key={i} className="flex flex-col items-center gap-3">
                        <p className="text-xs uppercase tracking-[0.25em] text-gold/70">{posLabels[s.position]}</p>
                        <ParallaxTilt max={12} className="perspective-800 w-44 h-64 sm:w-52 sm:h-72">
                          <div className="relative w-full h-full preserve-3d transition-transform duration-700 ease-out"
                            style={{ transform: s.flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>
                            {/* Card Back */}
                            <div className="absolute inset-0 backface-hidden rounded-2xl border-2 border-gold/50 shadow-glow flex items-center justify-center cursor-pointer" style={{ background: "linear-gradient(135deg, #3b0764 0%, #1e1b4b 100%)" }}>
                              <div className="text-center space-y-3">
                                <div className="text-5xl text-gold animate-float" style={{ animationDelay: `${i * 0.5}s` }}>✦</div>
                                <p className="font-script text-lg text-gold/90">tap to reveal</p>
                              </div>
                              <div className="absolute inset-3 border border-gold/25 rounded-xl" />
                            </div>
                            {/* Card Front */}
                            <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl border-2 border-gold/60 bg-gradient-to-br from-purple-900/80 to-indigo-900/80 shadow-glow flex flex-col items-center justify-center p-6 text-center">
                              <div className="text-5xl sm:text-6xl text-gold mb-4 animate-bounce-in">{card.emoji}</div>
                              <p className="font-display text-xl sm:text-2xl text-gold mb-3">{card.name}</p>
                              <p className="text-sm text-white/80 italic leading-relaxed">{card.meaning}</p>
                              <div className="absolute -inset-1 rounded-2xl bg-gold/10 blur-xl -z-10 animate-glow-pulse" />
                            </div>
                          </div>
                        </ParallaxTilt>
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-col items-center gap-3 pt-6">
                  <button onClick={drawSpread} disabled={drawing} className="text-sm text-gold/80 underline underline-offset-4 hover:text-gold disabled:opacity-50">draw a new spread</button>
                  {spread.every((s) => s.flipped) && (
                    <button onClick={shareReading} className="rounded-full border border-gold/40 text-gold px-6 py-2 text-sm hover:bg-gold/10 transition-colors">share your reading ✦</button>
                  )}
                </div>
              </>
            )}
          </>
        )}

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-12 max-w-3xl mx-auto opacity-60">
          {cards.map((c, i) => (
            <div key={i} className="aspect-[2/3] rounded-lg border border-gold/30 flex flex-col items-center justify-center gap-1 text-gold/60 hover:border-gold/60 hover:text-gold transition-colors">
              <span className="text-xl">{c.emoji}</span>
              <span className="text-[9px] uppercase tracking-wider">{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
