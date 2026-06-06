import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import heroImg from "@/assets/fairy-hero.jpeg";
import lily1 from "@/assets/lily1.png";
import lily2 from "@/assets/lily2.png";
import { Sparkles } from "@/components/Sparkles";
import { Reveal } from "@/components/Reveal";
import { CountdownTimer } from "@/components/CountdownTimer";
import { LightboxImage } from "@/components/Lightbox";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Happy Birthday Vanya ✦ A Whimsy Wish" },
      {
        name: "description",
        content: "A dreamy birthday tribute for Vanya Bharti — 16 June 2026.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-dreamy">
        <Sparkles count={30} />
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center relative">
          <div className="animate-fade-up space-y-6">
            <p className="font-script text-3xl text-primary">
              a little wish for you
            </p>
            <h1 className="font-display text-5xl md:text-7xl text-twilight leading-[1.05] text-balance">
              Happy Birthday,
              <br />
              <span className="italic text-primary">Vanya Bharti</span>
            </h1>
            <p className="text-lg text-foreground/70 max-w-md leading-relaxed">
              A whimsical little corner of the internet woven from stars, tarot
              cards, and lavender skies — made just for you.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/calendar"
                className="rounded-full bg-primary text-primary-foreground px-7 py-3 shadow-soft hover:scale-105 transition-transform"
              >
                See the day ✦
              </Link>
              <Link
                to="/tarot"
                className="rounded-full border border-primary/30 text-primary px-7 py-3 hover:bg-primary/5 transition-colors"
              >
                Draw a card
              </Link>
            </div>
          </div>

          <div className="relative animate-float">
            <div className="absolute -inset-6 bg-gold blur-3xl opacity-30 rounded-full" />
            <div className="relative rounded-3xl overflow-hidden shadow-soft border-4 border-card">
              <LightboxImage
                src={heroImg}
                alt="A whimsical fairy under a starry purple sky"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 animate-shimmer pointer-events-none" />
            </div>
            <p className="text-center font-script text-xl text-primary mt-4">
              ✦ to the fairy of our world ✦
            </p>
          </div>
        </div>
      </section>

      {/* COUNTDOWN */}
      <section className="py-16 px-6">
        <Reveal className="mx-auto max-w-3xl">
          <CountdownTimer />
        </Reveal>
      </section>

      {/* QUOTE */}
      <section className="py-16 px-6">
        <Reveal className="mx-auto max-w-3xl text-center space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            a verse
          </p>
          <p className="font-display italic text-3xl md:text-4xl text-twilight text-balance leading-snug">
            "She wears the stars as a crown, reads the moon like a book, and
            turns every birthday into a small bit of magic."
          </p>
        </Reveal>
      </section>

      {/* LILY OF THE DAY ORACLE */}
      <LilyOracleWidget />

      {/* CARDS GRID */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="font-display text-4xl text-center text-twilight mb-12">
              Wander through the pages ✦
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              {
                to: "/about",
                title: "About Her",
                desc: "The little universe that is Vanya.",
                emoji: "✿",
              },
              {
                to: "/matcha",
                title: "Matcha Corner",
                desc: "Tea, foam, and quiet rituals.",
                emoji: "🍵",
              },
              {
                to: "/lilies",
                title: "Lily Pond",
                desc: "A serene garden of floating wishes and chimes.",
                emoji: "🪷",
              },
              {
                to: "/tarot",
                title: "Tarot Garden",
                desc: "Cards drawn just for her day.",
                emoji: "✦",
              },
              {
                to: "/moodboard",
                title: "Moodboard",
                desc: "A pinterest of soft little things.",
                emoji: "✧",
              },
              {
                to: "/wishbook",
                title: "Wishbook",
                desc: "Leave a birthday message for Vanya.",
                emoji: "📖",
              },
              {
                to: "/calendar",
                title: "The Day",
                desc: "Sixteenth of June, marked in gold.",
                emoji: "❀",
              },
              {
                to: "/starmap",
                title: "Star Map",
                desc: "The sky on the night you were born.",
                emoji: "🌠",
              },
              {
                to: "/wishes",
                title: "A Wish",
                desc: "A small letter, just for you.",
                emoji: "♡",
              },
            ].map((c, i) => (
              <Reveal key={i} variant="float-in" delay={i * 80}>
                <Link
                  to={c.to}
                  className="block group rounded-2xl bg-card p-6 shadow-soft hover:-translate-y-1 transition-transform border border-border/50"
                >
                  <div className="text-3xl text-primary mb-3 group-hover:rotate-12 transition-transform inline-block">
                    {c.emoji}
                  </div>
                  <h3 className="font-display text-2xl text-twilight">
                    {c.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {c.desc}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ── Lily of the Day Oracle Widget ──────────────────────────────────────────
const LILY_ORACLE_MESSAGES = [
  { text: "Today, like a water lily, you are asked to bloom above still waters — effortlessly, gracefully.", author: "The Lily Pond" },
  { text: "The lily doesn't chase the sun. It simply opens, and the light finds it. So shall you.", author: "Whispers of the Pond" },
  { text: "Your gentleness is not weakness — it is the lily's quiet power, floating unshaken.", author: "Garden of Stars" },
  { text: "Today holds something beautiful. Open your petals wide and receive it.", author: "The Lily Pond" },
  { text: "Stillness is wisdom. The lily knows this — it makes its home in calm waters.", author: "Moon Garden" },
  { text: "You are rooted in something deep. That is why you float so beautifully.", author: "Garden of Stars" },
  { text: "Like a lily at dusk, let today close softly. Rest is not retreat — it is preparation.", author: "Whispers of the Pond" },
];

function LilyOracleWidget() {
  const [revealed, setRevealed] = useState(false);
  const [hovering, setHovering] = useState(false);

  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const oracle = LILY_ORACLE_MESSAGES[dayOfYear % LILY_ORACLE_MESSAGES.length];
  const lilyImg = dayOfYear % 2 === 0 ? lily1 : lily2;

  return (
    <section className="py-10 px-6">
      <Reveal className="mx-auto max-w-4xl">
        <div className="text-center mb-6">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">daily oracle</p>
          <h2 className="font-display text-3xl md:text-4xl text-twilight mt-1">Lily of the Day ✦</h2>
        </div>
        <div className="relative grid md:grid-cols-2 gap-0 rounded-[2rem] overflow-hidden shadow-glow border-2 border-primary/20">
          {/* Lily photo side */}
          <div
            className="relative overflow-hidden cursor-pointer"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            onClick={() => setRevealed(true)}
          >
            <img
              src={lilyImg}
              alt="Lily of the Day"
              className={`w-full h-64 md:h-full object-cover transition-all duration-700 ${
                hovering || revealed ? "scale-105 brightness-90" : "scale-100 brightness-75"
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-card/60 md:to-card/90 pointer-events-none" />
            {!revealed && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center gap-3">
                <div className="text-5xl animate-float">🪷</div>
                <p className="font-script text-xl text-white drop-shadow-lg">tap to reveal today's lily</p>
              </div>
            )}
          </div>

          {/* Oracle message side */}
          <div className="bg-card/90 backdrop-blur-xl p-8 md:p-10 flex flex-col justify-center space-y-5">
            {revealed ? (
              <div className="animate-fade-up space-y-4">
                <span className="inline-block text-3xl animate-heartbeat">🌸</span>
                <p className="font-display italic text-2xl md:text-3xl text-twilight leading-relaxed text-balance">
                  "{oracle.text}"
                </p>
                <p className="font-script text-lg text-primary">— {oracle.author}</p>
                <div className="h-px bg-border/50 w-16" />
                <Link
                  to="/lilies"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  🪷 Visit the Lily Pond →
                </Link>
              </div>
            ) : (
              <div className="space-y-4 text-center text-muted-foreground">
                <p className="font-script text-2xl text-primary">your oracle awaits</p>
                <p className="text-sm italic">tap the lily to reveal today's message for you</p>
                <div className="flex justify-center gap-1 pt-2">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-2 h-2 rounded-full bg-primary/30 animate-pulse"
                      style={{ animationDelay: `${i * 0.3}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
