import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles } from "@/components/Sparkles";
import { Reveal } from "@/components/Reveal";
import { ParallaxTilt } from "@/components/ParallaxTilt";
import hironoImg from "@/assets/hirono.jpeg";

export const Route = createFileRoute("/wishbook")({
  head: () => ({
    meta: [
      { title: "Hirono ♡ For Vanya" },
      {
        name: "description",
        content: "A soft little corner dedicated to Hirono — Vanya's favourite plush.",
      },
    ],
  }),
  component: HironoPage,
});

const PLUSH_MESSAGES = [
  "✦ she loves you",
  "🌸 make a wish!",
  "🪷 be gentle today",
  "♡ you're doing great",
  "✧ the world is soft",
  "🌙 dream big, little one",
  "☾ you are enough",
];

const HIRONO_FACTS = [
  {
    icon: "🧸",
    title: "The Original",
    body: "Hirono is the dreamy plush that started it all — soft, round, and impossibly cute, just like the person who loves it.",
  },
  {
    icon: "🌸",
    title: "Collector's Heart",
    body: "Vanya doesn't just love Hirono — she feels it. Every plush she picks is chosen with the same care she gives to everything she loves.",
  },
  {
    icon: "✦",
    title: "A Quiet Companion",
    body: "There's something about a plush that understands you without a single word. Hirono is that friend — always there, always soft.",
  },
  {
    icon: "🪷",
    title: "Same Energy",
    body: "Gentle. Cozy. A little magical. The Hirono plush and Vanya are cut from the same whimsical cloth.",
  },
];

function HironoPage() {
  const [msgIdx, setMsgIdx] = useState(0);
  const [wiggling, setWiggling] = useState(false);
  const [showBubble, setShowBubble] = useState(false);

  const handlePlushClick = () => {
    setWiggling(true);
    setShowBubble(true);
    setMsgIdx((prev) => (prev + 1) % PLUSH_MESSAGES.length);
    setTimeout(() => setWiggling(false), 500);
    setTimeout(() => setShowBubble(false), 2800);
  };

  return (
    <section className="relative py-20 overflow-hidden min-h-[80vh] bg-aurora">
      <Sparkles count={28} />

      {/* Decorative petal blobs */}
      <div
        className="absolute top-0 -left-20 w-72 h-72 rounded-full pointer-events-none opacity-20"
        style={{ background: "radial-gradient(circle, oklch(0.82 0.12 85) 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 -right-16 w-64 h-64 rounded-full pointer-events-none opacity-15"
        style={{ background: "radial-gradient(circle, oklch(0.75 0.12 310) 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-5xl px-6 space-y-16">

        {/* Header */}
        <Reveal className="text-center space-y-3">
          <p className="font-script text-3xl text-primary">a soft little corner for</p>
          <h1 className="font-display text-5xl md:text-7xl text-twilight leading-[1.05]">
            Hirono ♡
          </h1>
          <p className="text-muted-foreground italic max-w-md mx-auto leading-relaxed">
            The plush that lives in her heart — round, warm, and inexplicably magical.
          </p>
        </Reveal>

        {/* Hero — Plush photo + interactive mascot */}
        <div className="grid md:grid-cols-2 gap-14 items-center">
          {/* Photo */}
          <Reveal variant="float-in">
            <ParallaxTilt max={8}>
              <div className="relative group">
                <div className="absolute -inset-6 blur-3xl opacity-40 rounded-full animate-float"
                  style={{ background: "radial-gradient(circle, oklch(0.82 0.12 85), oklch(0.75 0.12 310))" }}
                />
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-glow border-4 border-card">
                  <img
                    src={hironoImg}
                    alt="Hirono plush — Vanya's favourite"
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 animate-shimmer pointer-events-none opacity-50" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-twilight/70 to-transparent">
                    <p className="font-script text-2xl text-white drop-shadow">
                      ✦ the plush of her dreams ✦
                    </p>
                  </div>
                </div>
              </div>
            </ParallaxTilt>
          </Reveal>

          {/* Interactive mascot + copy */}
          <Reveal variant="float-in" delay={150} className="space-y-7">
            {/* Clickable Hirono mascot */}
            <div className="flex flex-col items-center gap-3 select-none">
              <div className="relative inline-block">
                {/* Speech bubble */}
                {showBubble && (
                  <div
                    className="speech-bubble absolute -top-16 left-1/2 -translate-x-1/2 glass-card rounded-xl px-4 py-2 whitespace-nowrap animate-speech-pop z-10"
                  >
                    <p className="font-script text-base text-primary">{PLUSH_MESSAGES[msgIdx]}</p>
                  </div>
                )}
                <button
                  onClick={handlePlushClick}
                  aria-label="Poke Hirono"
                  className={`w-28 h-28 rounded-full overflow-hidden border-4 border-primary/30 shadow-glow focus:outline-none focus:ring-2 focus:ring-primary/40 transition-transform hover:scale-105 ${
                    wiggling ? "animate-hirono-wiggle" : "animate-hirono-bob"
                  }`}
                >
                  <img
                    src={hironoImg}
                    alt="Hirono plush"
                    className="w-full h-full object-cover"
                  />
                </button>
              </div>
              <p className="text-xs text-muted-foreground italic text-center">
                tap to hear a little something ✦
              </p>
            </div>

            <div className="space-y-4">
              <p className="font-display italic text-2xl md:text-3xl text-twilight leading-relaxed">
                "Some things don't need explaining — you just hold them and feel better."
              </p>
              <p className="font-script text-xl text-primary">
                — that's Hirono
              </p>
              <p className="text-foreground/70 leading-relaxed">
                Vanya has a way of loving things deeply and quietly. Her Hirono plush isn't
                just a soft toy — it's a little universe of comfort she keeps close.
                Soft around the edges. Full of warmth. Exactly like her.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Hirono Fact Cards */}
        <div className="space-y-8">
          <Reveal>
            <h2 className="font-display text-4xl text-center text-twilight">
              Why Hirono? ✦
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-5">
            {HIRONO_FACTS.map((f, i) => (
              <Reveal key={i} variant="float-in" delay={i * 90}>
                <div className="glass-card rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 hover:shadow-glow group">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl mt-0.5 group-hover:scale-110 transition-transform inline-block">
                      {f.icon}
                    </span>
                    <div>
                      <p className="font-display text-xl text-twilight">{f.title}</p>
                      <p className="text-sm text-foreground/70 mt-1 leading-relaxed">{f.body}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Plush Messages Gallery */}
        <Reveal className="space-y-6">
          <h2 className="font-display text-3xl text-center text-twilight">
            Things Hirono Would Say ✦
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {PLUSH_MESSAGES.map((msg, i) => (
              <span
                key={i}
                className="glass-card rounded-full px-5 py-2 font-script text-lg text-primary hover:shadow-glow transition-all duration-300 hover:scale-105 cursor-default"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {msg}
              </span>
            ))}
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal className="text-center space-y-5 pt-4 border-t border-border/30">
          <p className="font-display italic text-3xl md:text-4xl text-twilight text-balance max-w-xl mx-auto">
            "May your life be as soft and full as a Hirono plush."
          </p>
          <p className="font-script text-2xl text-primary">— with the softest love ♡</p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              to="/about"
              className="rounded-full bg-primary text-primary-foreground px-6 py-2.5 shadow-soft hover:scale-105 transition-transform text-sm"
            >
              ✿ About Vanya
            </Link>
            <Link
              to="/lilies"
              className="rounded-full border border-primary/30 text-primary px-6 py-2.5 hover:bg-primary/5 transition-colors text-sm"
            >
              🪷 Lily Pond
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
