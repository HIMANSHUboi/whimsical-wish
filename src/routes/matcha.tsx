import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "@/components/Sparkles";
import { Reveal } from "@/components/Reveal";
import { ParallaxTilt } from "@/components/ParallaxTilt";
import matchaCart from "@/assets/matcha-cart.png";
import matchaTime from "@/assets/matcha-time.png";

export const Route = createFileRoute("/matcha")({
  head: () => ({
    meta: [
      { title: "Matcha & Tea ✦ For Vanya" },
      { name: "description", content: "A little matcha corner curated for Vanya." },
    ],
  }),
  component: Matcha,
});

const sips = [
  { name: "Iced Strawberry Matcha", note: "pink clouds in a glass" },
  { name: "Blueberry Cloud Matcha", note: "soft, dreamy, midnight-blue" },
  { name: "Lavender Honey Latte", note: "the one that tastes like a sigh" },
  { name: "Hojicha Cream", note: "toasty, warm, like an old library" },
  { name: "Mango Matcha", note: "sunshine in a tiny jar" },
  { name: "Classic Ceremonial", note: "a quiet morning ritual" },
];

function Matcha() {
  return (
    <section className="relative bg-dreamy py-20 overflow-hidden min-h-[80vh]">
      <Sparkles count={18} />
      <div className="relative mx-auto max-w-6xl px-6 space-y-16">
        {/* Hero */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <Reveal className="space-y-5">
            <p className="font-script text-3xl text-primary">a little matcha corner</p>
            <h1 className="font-display text-5xl md:text-6xl text-twilight leading-tight text-balance">
              Tea, but make it <span className="italic">whimsy</span>.
            </h1>
            <p className="text-foreground/70 leading-relaxed max-w-md">
              For the girl who measures her mornings in matcha and her afternoons
              in steeped silences. A collection of soft sips, curated like a
              Pinterest board you never want to close.
            </p>
            <a
              href="https://www.instagram.com/theleaforia/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3 shadow-soft hover:scale-105 transition-transform"
            >
              ✦ Visit @theleaforia
            </a>
          </Reveal>

          <Reveal variant="float-in" delay={150}>
            <div className="relative group">
              <div className="absolute -inset-6 bg-gold blur-3xl opacity-30 rounded-full animate-float" />
              <ParallaxTilt max={10}>
                <a
                  href="https://www.instagram.com/theleaforia/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative rounded-3xl overflow-hidden shadow-soft border-4 border-card"
                >
                  <img
                    src={matchaCart}
                    alt="A whimsical cart of matcha drinks"
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 animate-shimmer pointer-events-none opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/0 via-gold/0 to-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-twilight/80 to-transparent text-white">
                    <p className="font-script text-2xl">tap to wander → @theleaforia</p>
                  </div>
                </a>
              </ParallaxTilt>
            </div>
          </Reveal>
        </div>

        {/* Floating second image */}
        <div className="grid md:grid-cols-5 gap-10 items-center">
          <Reveal variant="float-in" className="md:col-span-2">
            <div className="relative animate-float">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/30 to-gold/30 blur-2xl rounded-full" />
              <ParallaxTilt max={12}>
                <div className="relative rounded-3xl overflow-hidden shadow-soft border-4 border-card group">
                  <img
                    src={matchaTime}
                    alt="A glass of matcha latte, dreamy"
                    className="w-full h-auto transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 animate-shimmer pointer-events-none opacity-70" />
                  <div className="absolute inset-0 bg-gradient-to-bl from-gold/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </div>
              </ParallaxTilt>
            </div>
          </Reveal>
          <Reveal delay={150} className="md:col-span-3 space-y-4">
            <p className="font-script text-2xl text-primary">matcha time, always</p>
            <h2 className="font-display text-4xl text-twilight text-balance">
              Whisked slowly, sipped slower.
            </h2>
            <p className="text-foreground/70 leading-relaxed">
              There's a quiet poetry in the way she holds a warm cup — like she's
              cradling a tiny green planet. May your year be full of unhurried
              mornings, foamy crowns, and the kind of tea that tastes like
              someone is thinking of you.
            </p>
          </Reveal>
        </div>

        {/* Menu grid */}
        <div className="space-y-8">
          <Reveal>
            <h2 className="font-display text-4xl text-center text-twilight">
              The Whimsy Menu ✦
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {sips.map((s, i) => (
              <Reveal key={i} variant="float-in" delay={i * 80}>
                <div className="group rounded-2xl bg-card/80 backdrop-blur p-6 shadow-soft border border-border/50 hover:-translate-y-1 transition-transform">
                  <div className="text-2xl mb-2 group-hover:rotate-12 transition-transform inline-block">🍵</div>
                  <p className="font-display text-xl text-twilight">{s.name}</p>
                  <p className="text-sm text-muted-foreground italic mt-1">{s.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal>
          <p className="text-center font-script text-3xl text-primary">
            ✦ steeped with love, just for you ✦
          </p>
        </Reveal>
      </div>
    </section>
  );
}
