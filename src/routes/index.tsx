import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import heroImg from "@/assets/fairy-hero.jpeg";
import lily1 from "@/assets/lily1.png";
import lily2 from "@/assets/lily2.png";
import { Sparkles } from "@/components/Sparkles";
import { Reveal } from "@/components/Reveal";
import { CountdownTimer } from "@/components/CountdownTimer";
import { LightboxImage } from "@/components/Lightbox";
import { ShootingStars } from "@/components/ShootingStars";

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
        <ShootingStars />
        <Sparkles count={30} />
        <p className="absolute top-4 left-1/2 -translate-x-1/2 z-[2] text-[10px] text-muted-foreground/50 tracking-widest uppercase pointer-events-none animate-pulse">click anywhere for a shooting star ✦</p>
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center relative z-[2]">
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
                title: "Hirono ♡",
                desc: "A soft corner for her favourite plush.",
                emoji: "🧸",
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
                  className="block group rounded-2xl bg-card p-6 shadow-soft hover:-translate-y-2 hover:shadow-glow transition-all duration-300 border border-border/50 hover:border-primary/30"
                >
                  <div className="text-3xl text-primary mb-3 group-hover:rotate-12 group-hover:scale-110 transition-transform inline-block">
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

      {/* DEVICE SHOWCASE */}
      <DeviceShowcase />
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

// ── Device Showcase ──────────────────────────────────────────────────────────
function DeviceShowcase() {
  const devices = [
    {
      label: "iPhone",
      sub: "held in your hand",
      note: "The whole garden, in your pocket.",
      frame: "iphone",
    },
    {
      label: "iPad",
      sub: "beside your morning tea",
      note: "Cozy, lush, and made for slow scrolling.",
      frame: "ipad",
    },
    {
      label: "MacBook",
      sub: "open on your desk",
      note: "Every star visible from where you sit.",
      frame: "macbook",
    },
  ];

  return (
    <section className="py-20 px-6 bg-aurora overflow-hidden">
      <div className="mx-auto max-w-5xl">
        <Reveal className="text-center space-y-3 mb-14">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            wherever you are
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-twilight">
            Made for every screen ✦
          </h2>
          <p className="text-muted-foreground italic max-w-md mx-auto">
            Whether you're curled up with your phone or at your desk with a warm cup — this is for you.
          </p>
        </Reveal>

        <div className="flex flex-col md:flex-row items-end justify-center gap-10 md:gap-6">
          {/* iPhone */}
          <Reveal variant="float-in" delay={0}>
            <div className="flex flex-col items-center gap-5 group">
              <div className="relative w-[120px] h-[240px] rounded-[28px] border-4 border-foreground/20 bg-card shadow-soft animate-device-glow group-hover:border-primary/40 transition-colors duration-500 overflow-hidden flex flex-col">
                {/* Notch */}
                <div className="w-12 h-4 bg-foreground/15 rounded-b-xl mx-auto mt-1 flex-shrink-0" />
                {/* Screen content */}
                <div className="flex-1 bg-dreamy flex flex-col items-center justify-center gap-1 px-2">
                  <span className="text-2xl animate-hirono-bob inline-block">🧸</span>
                  <p className="text-[7px] text-center font-script text-primary leading-tight">Vanya ✦</p>
                  <p className="text-[5px] text-center text-muted-foreground">a whimsy wish</p>
                </div>
                {/* Home indicator */}
                <div className="w-10 h-1 bg-foreground/20 rounded-full mx-auto mb-2 flex-shrink-0" />
              </div>
              <div className="text-center">
                <p className="font-display text-lg text-twilight">iPhone</p>
                <p className="text-xs text-muted-foreground italic">{devices[0].sub}</p>
                <p className="text-[11px] text-muted-foreground/70 mt-1 max-w-[120px] text-center">{devices[0].note}</p>
              </div>
            </div>
          </Reveal>

          {/* iPad — taller, center */}
          <Reveal variant="float-in" delay={100}>
            <div className="flex flex-col items-center gap-5 group md:-mt-8">
              <div className="relative w-[180px] h-[240px] rounded-[22px] border-4 border-foreground/20 bg-card shadow-glow animate-device-glow group-hover:border-primary/40 transition-colors duration-500 overflow-hidden flex flex-col">
                {/* Camera dot */}
                <div className="w-2 h-2 bg-foreground/15 rounded-full mx-auto mt-2 flex-shrink-0" />
                {/* Screen */}
                <div className="flex-1 bg-dreamy flex flex-col items-center justify-center gap-2 px-3">
                  <span className="text-3xl animate-float inline-block">🪷</span>
                  <p className="text-[9px] text-center font-script text-primary">Happy Birthday, Vanya</p>
                  <div className="flex gap-1">
                    {["✦","♡","✧"].map((s,i)=> (
                      <span key={i} className="text-[8px] text-primary/60">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="font-display text-lg text-twilight">iPad</p>
                <p className="text-xs text-muted-foreground italic">{devices[1].sub}</p>
                <p className="text-[11px] text-muted-foreground/70 mt-1 max-w-[160px] text-center">{devices[1].note}</p>
              </div>
            </div>
          </Reveal>

          {/* MacBook */}
          <Reveal variant="float-in" delay={200}>
            <div className="flex flex-col items-center gap-5 group">
              <div className="flex flex-col items-center">
                {/* Screen */}
                <div className="relative w-[220px] h-[140px] rounded-t-xl border-4 border-foreground/20 bg-card shadow-soft animate-device-glow group-hover:border-primary/40 transition-colors duration-500 overflow-hidden flex flex-col">
                  {/* Menubar */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-foreground/5 border-b border-foreground/10 flex-shrink-0">
                    {["bg-red-400","bg-yellow-400","bg-green-400"].map((c,i)=>(
                      <div key={i} className={`w-2 h-2 rounded-full ${c} opacity-70`} />
                    ))}
                  </div>
                  {/* Content */}
                  <div className="flex-1 bg-dreamy flex flex-col items-center justify-center gap-1">
                    <span className="text-xl animate-twinkle inline-block">🌠</span>
                    <p className="text-[8px] font-script text-primary text-center">Vanya's Whimsical Wish</p>
                    <p className="text-[6px] text-muted-foreground">16 · 06 · 2026</p>
                  </div>
                </div>
                {/* Hinge + base */}
                <div className="w-[240px] h-2 bg-foreground/15 rounded-b-sm" />
                <div className="w-[260px] h-3 bg-foreground/10 rounded-b-xl" />
              </div>
              <div className="text-center">
                <p className="font-display text-lg text-twilight">MacBook</p>
                <p className="text-xs text-muted-foreground italic">{devices[2].sub}</p>
                <p className="text-[11px] text-muted-foreground/70 mt-1 max-w-[180px] text-center">{devices[2].note}</p>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal className="text-center mt-14">
          <p className="font-script text-2xl text-primary">✦ always with you ✦</p>
        </Reveal>
      </div>
    </section>
  );
}
