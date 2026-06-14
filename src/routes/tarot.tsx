import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles } from "@/components/Sparkles";
import { ParallaxTilt } from "@/components/ParallaxTilt";
import { Reveal } from "@/components/Reveal";
import { X } from "lucide-react";

// Import Tarot Card illustrations
import tarotStar from "@/assets/tarot-star.jpeg";
import tarotMoon from "@/assets/tarot-moon.jpeg";
import tarotSun from "@/assets/tarot-sun.jpeg";
import tarotLovers from "@/assets/tarot-lovers.jpeg";
import tarotWorld from "@/assets/tarot-world.jpeg";
import tarotEmpress from "@/assets/tarot-empress.png";
import tarotMagician from "@/assets/tarot-magician.png";
import tarotHighPriestess from "@/assets/tarot-high-priestess.png";
import tarotWheelOfFortune from "@/assets/tarot-wheel-of-fortune.png";
import tarotStrength from "@/assets/tarot-strength.png";
import tarotTemperance from "@/assets/tarot-temperance.png";
import tarotChariot from "@/assets/tarot-chariot.png";

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
  { name: "The Star", emoji: "✦", meaning: "Hope, renewal, and a year of soft light ahead.", detail: "The Star brings healing and serenity. After storms, you find calm waters and a sky full of promises. Your wish is heard by the universe.", image: tarotStar },
  { name: "The Moon", emoji: "☾", meaning: "Trust the mystery — your intuition is golden.", detail: "The Moon illuminates what hides in shadow. Your dreams carry messages. Trust the pull of the tides within you.", image: tarotMoon },
  { name: "The Sun", emoji: "☀", meaning: "Joy is finding you everywhere this year.", detail: "Radiance and vitality. Children dance under the Sun — and so shall you. This is a year of golden, unguarded happiness.", image: tarotSun },
  { name: "The Empress", emoji: "♛", meaning: "Abundance, beauty, and creative blooming.", detail: "Lush. Fertile. Overflowing. The Empress asks you to receive all that life is offering you right now. You are worthy of softness.", image: tarotEmpress },
  { name: "The Lovers", emoji: "♡", meaning: "Love in every form gathers around you.", detail: "Not just romance — this is a card of alignment. Your values, your heart, your choices. When they align, magic unfolds.", image: tarotLovers },
  { name: "The World", emoji: "✧", meaning: "Completion — and a brand new chapter.", detail: "You have arrived. Take a breath and feel how far you've come. The World card signals that a beautiful cycle is complete.", image: tarotWorld },
  { name: "The Magician", emoji: "⚡", meaning: "You have everything you need. Create.", detail: "All four elements rest on the Magician's table — fire, water, air, earth. You are the conduit. What will you build?", image: tarotMagician },
  { name: "The High Priestess", emoji: "🌙", meaning: "Deep knowing lives in you. Trust it.", detail: "She sits between the pillars of mystery, veiled and knowing. The answers you seek are already inside you.", image: tarotHighPriestess },
  { name: "Wheel of Fortune", emoji: "✸", meaning: "A beautiful turn of fate awaits you.", detail: "The wheel spins, and for you, it rises. This is a moment of lucky change, of alignment with something larger than yourself.", image: tarotWheelOfFortune },
  { name: "Strength", emoji: "🦁", meaning: "Gentle power. You are stronger than you know.", detail: "Not brute force — this is the strength of compassion, patience, and heart. You tame the lion with love.", image: tarotStrength },
  { name: "Temperance", emoji: "⚖", meaning: "Balance is coming — harmony in all things.", detail: "Pour between cups, mixing and blending. Temperance is the art of finding your middle path — the one that feels like home.", image: tarotTemperance },
  { name: "The Chariot", emoji: "⭐", meaning: "Victory through willpower. Keep going, queen.", detail: "Two opposing forces, guided by one will. You are in the driver's seat. Determination is your compass.", image: tarotChariot },
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
  const [selectedCard, setSelectedCard] = useState<typeof cards[0] | null>(null);

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
    <section className="relative bg-background text-foreground py-20 overflow-hidden min-h-[80vh]">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-secondary/15" aria-hidden />
      <Sparkles count={40} />
      <div className="relative mx-auto max-w-5xl px-6 text-center space-y-10 animate-fade-up">
        <p className="font-script text-3xl text-primary animate-pulse">a card for you</p>
        <h1 className="font-display text-5xl md:text-6xl text-balance text-twilight animate-fade-in">The Tarot Garden</h1>

        {/* Tab switcher */}
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setTab("daily")}
            className={`px-6 py-2.5 rounded-full border text-sm font-medium transition-all duration-300 cursor-pointer ${
              tab === "daily"
                ? "bg-primary text-primary-foreground border-primary shadow-glow"
                : "border-primary/30 text-primary/70 hover:border-primary/60 hover:text-primary bg-card/40"
            }`}
          >
            ☀ Daily Pull
          </button>
          <button
            onClick={() => setTab("spread")}
            className={`px-6 py-2.5 rounded-full border text-sm font-medium transition-all duration-300 cursor-pointer ${
              tab === "spread"
                ? "bg-primary text-primary-foreground border-primary shadow-glow"
                : "border-primary/30 text-primary/70 hover:border-primary/60 hover:text-primary bg-card/40"
            }`}
          >
            ✦ Three-Card Spread
          </button>
        </div>

        {/* DAILY PULL */}
        {tab === "daily" && (
          <Reveal className="space-y-8">
            <p className="text-foreground/75 max-w-md mx-auto italic">
              One card pulled for today — {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.
              Let it guide you gently.
            </p>

            <div className="flex justify-center">
              <div className="flex flex-col items-center gap-4">
                <ParallaxTilt max={12} className="perspective-800 w-52 h-80">
                  <div
                    className="relative w-full h-full preserve-3d transition-transform duration-700 ease-out cursor-pointer"
                    style={{ transform: dailyFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
                    onClick={() => {
                      if (!dailyFlipped) {
                        setDailyFlipped(true);
                      }
                    }}
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
                    <div
                      onClick={(e) => {
                        if (dailyFlipped) {
                          e.stopPropagation();
                          setSelectedCard(dailyCard);
                        }
                      }}
                      className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl border-2 border-gold/60 overflow-hidden bg-gradient-to-br from-purple-900 to-indigo-950 shadow-glow flex flex-col justify-end cursor-zoom-in group/card"
                    >
                      {dailyCard.image && (
                        <img src={dailyCard.image} alt={dailyCard.name} className="absolute inset-0 w-full h-full object-cover opacity-85 transition-transform duration-500 group-hover/card:scale-105" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      
                      <div className="absolute inset-0 bg-black/70 backdrop-blur-xs opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                        <div className="text-4xl text-gold mb-2">{dailyCard.emoji}</div>
                        <p className="font-display text-lg text-gold mb-2">{dailyCard.name}</p>
                        <p className="text-xs text-white/90 italic leading-relaxed">{dailyCard.meaning}</p>
                        <p className="text-[10px] text-gold/80 mt-2">Click to open full card ✦</p>
                      </div>

                      <div className="relative z-10 bg-black/60 backdrop-blur-xs border-t border-gold/30 py-2.5 text-center">
                        <p className="font-display text-sm tracking-wider text-gold uppercase">{dailyCard.name}</p>
                      </div>
                      <div className="absolute -inset-1 rounded-2xl bg-gold/10 blur-xl -z-10 animate-glow-pulse" />
                    </div>
                  </div>
                </ParallaxTilt>

                {dailyFlipped && (
                  <div className="max-w-sm text-center space-y-4 animate-fade-up">
                    <p className="text-foreground/85 text-sm leading-relaxed italic">
                      {dailyCard.detail}
                    </p>
                    <button
                      onClick={copyDailyCard}
                      className="rounded-full border border-primary/40 text-primary px-5 py-2 text-sm hover:bg-primary/10 transition-all cursor-pointer"
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
            <p className="text-foreground/75 max-w-xl mx-auto">
              Close your eyes, make a little birthday wish, and draw a three-card spread — past, present, and future.
            </p>

            {spread.length === 0 && (
              <button onClick={drawSpread} disabled={drawing}
                className="mx-auto w-56 h-80 rounded-2xl border-2 border-gold/60 shadow-glow flex items-center justify-center transition-all duration-500 hover:scale-105 animate-glow-pulse cursor-pointer"
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
                        <p className="text-xs uppercase tracking-[0.25em] text-primary/80 font-medium">{posLabels[s.position]}</p>
                        <ParallaxTilt max={12} className="perspective-800 w-44 h-64 sm:w-52 sm:h-76">
                          <div className="relative w-full h-full preserve-3d transition-transform duration-700 ease-out"
                            style={{ transform: s.flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>
                            {/* Card Back */}
                            <div className="absolute inset-0 backface-hidden rounded-2xl border-2 border-gold/50 shadow-glow flex items-center justify-center cursor-pointer" style={{ background: "linear-gradient(135deg, #3b0764 0%, #1e1b4b 100%)" }}>
                              <div className="text-center space-y-3">
                                <div className="text-5xl text-gold animate-float" style={{ animationDelay: `${i * 0.5}s` }}>✦</div>
                                <p className="font-script text-lg text-gold/90">revealing...</p>
                              </div>
                              <div className="absolute inset-3 border border-gold/25 rounded-xl" />
                            </div>
                            {/* Card Front */}
                            <div
                              onClick={() => {
                                if (s.flipped) {
                                  setSelectedCard(card);
                                }
                              }}
                              className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl border-2 border-gold/60 overflow-hidden bg-gradient-to-br from-purple-900 to-indigo-950 shadow-glow flex flex-col justify-end cursor-zoom-in group/card"
                            >
                              {card.image && (
                                <img src={card.image} alt={card.name} className="absolute inset-0 w-full h-full object-cover opacity-85 transition-transform duration-500 group-hover/card:scale-105" />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                              
                              <div className="absolute inset-0 bg-black/70 backdrop-blur-xs opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                                <div className="text-4xl text-gold mb-2">{card.emoji}</div>
                                <p className="font-display text-lg text-gold mb-2">{card.name}</p>
                                <p className="text-xs text-white/90 italic leading-relaxed">{card.meaning}</p>
                                <p className="text-[10px] text-gold/80 mt-2">Click to open full card ✦</p>
                              </div>

                              <div className="relative z-10 bg-black/60 backdrop-blur-xs border-t border-gold/30 py-2 text-center">
                                <p className="font-display text-sm tracking-wider text-gold uppercase">{card.name}</p>
                              </div>
                              <div className="absolute -inset-1 rounded-2xl bg-gold/10 blur-xl -z-10 animate-glow-pulse" />
                            </div>
                          </div>
                        </ParallaxTilt>
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-col items-center gap-3 pt-6 animate-fade-up">
                  <button onClick={drawSpread} disabled={drawing} className="text-sm text-primary/80 underline underline-offset-4 hover:text-primary disabled:opacity-50 cursor-pointer">draw a new spread</button>
                  {spread.every((s) => s.flipped) && (
                    <button onClick={shareReading} className="rounded-full border border-primary/40 text-primary px-6 py-2 text-sm hover:bg-primary/10 transition-colors cursor-pointer">share your reading ✦</button>
                  )}
                </div>
              </>
            )}
          </>
        )}

        {/* Tarot Card Garden Grid - Clickable encyclopedia */}
        <div className="pt-16 space-y-4">
          <p className="font-script text-2xl text-primary/80">explore the garden</p>
          <p className="text-xs text-muted-foreground italic max-w-sm mx-auto">Click any card to read its full secrets and view its unique celestial illustration.</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-4 max-w-3xl mx-auto">
            {cards.map((c, i) => (
              <div
                key={i}
                onClick={() => setSelectedCard(c)}
                className="aspect-[2/3] rounded-lg border border-border/85 bg-card/40 flex flex-col items-center justify-center gap-1 text-primary/75 hover:border-gold/60 hover:text-gold hover:bg-card/75 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-soft"
              >
                <span className="text-xl">{c.emoji}</span>
                <span className="text-[10px] uppercase tracking-wider font-medium">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CARD DETAIL DIALOG MODAL */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-6 animate-fade-in">
          <div className="bg-[#1c1917] border-2 border-gold/50 rounded-3xl max-w-2xl w-full overflow-hidden shadow-glow grid md:grid-cols-2 animate-scale-up relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedCard(null)}
              aria-label="close modal"
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Left side: Illustration */}
            <div className="relative aspect-[3/4] md:aspect-auto md:h-full min-h-[300px] overflow-hidden bg-black/40">
              {selectedCard.image ? (
                <img
                  src={selectedCard.image}
                  alt={selectedCard.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-6xl text-gold font-script">
                  {selectedCard.emoji}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:hidden" />
            </div>

            {/* Right side: Explanation */}
            <div className="p-6 md:p-8 flex flex-col justify-center text-left space-y-6">
              <div className="space-y-1">
                <span className="text-3xl text-gold/90">{selectedCard.emoji}</span>
                <h2 className="font-display text-3xl text-gold tracking-wide uppercase leading-none">
                  {selectedCard.name}
                </h2>
              </div>

              <div className="h-px bg-gold/25" />

              <div className="space-y-4">
                <p className="font-display italic text-lg text-white/95 leading-relaxed">
                  "{selectedCard.meaning}"
                </p>
                <p className="text-sm text-white/75 leading-relaxed font-light">
                  {selectedCard.detail}
                </p>
              </div>

              <div className="h-px bg-gold/25 pt-2" />

              <button
                onClick={() => setSelectedCard(null)}
                className="w-full py-2.5 rounded-full bg-gold text-twilight font-semibold text-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              >
                Close & Return to Garden
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

