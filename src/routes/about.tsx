import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "@/components/Sparkles";
import { Reveal } from "@/components/Reveal";
import { ParallaxTilt } from "@/components/ParallaxTilt";
import { LightboxImage } from "@/components/Lightbox";
import vanyaPortrait from "@/assets/vanya-portrait.png";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Vanya ✦ A Whimsy Wish" },
      { name: "description", content: "A little glimpse of who Vanya Bharti is." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <section className="relative bg-dreamy py-20 overflow-hidden">
      <Sparkles count={20} />
      <div className="relative mx-auto max-w-5xl px-6 space-y-12">
        <Reveal className="space-y-4 text-center">
          <p className="font-script text-2xl text-primary">about the birthday girl</p>
          <h1 className="font-display text-5xl md:text-6xl text-twilight text-balance">
            Vanya Bharti
          </h1>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          <Reveal variant="float-in">
            <ParallaxTilt max={7}>
              <div className="relative group">
                <div className="absolute -inset-4 bg-gold blur-3xl opacity-40 rounded-full" />
                <div className="relative rounded-[2rem] overflow-hidden border-4 border-card shadow-soft">
                  <LightboxImage
                    src={vanyaPortrait}
                    alt="Vanya Bharti — gold and emerald jewels"
                    className="w-full h-auto object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 animate-shimmer pointer-events-none opacity-60" />
                </div>
                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gold text-twilight font-script text-xl px-5 py-1 rounded-full shadow-glow">
                  ✦ the muse ✦
                </span>
              </div>
            </ParallaxTilt>
          </Reveal>

          <Reveal variant="float-in" delay={150} className="space-y-5">
            <p className="text-lg leading-relaxed text-foreground/80">
              A soul stitched from moonlight and mystery — a lover of tarot,
              quiet Pinterest scrolls, and small, beautiful things.
            </p>
            <p className="text-lg leading-relaxed text-foreground/80">
              She finds poetry in dust on old books, magic in a perfectly
              steeped cup of matcha, and wears gold like she was born of it.
            </p>
            <p className="font-script text-2xl text-primary pt-2">
              — radiant, in every light.
            </p>
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 pt-4">
          {[
            { label: "loves", value: "tarot, lavender skies, vintage things" },
            { label: "vibe", value: "pinterest-core, whimsical, ethereal" },
            { label: "energy", value: "soft, starry, a little mystical" },
            { label: "birthday", value: "16 June 2026" },
          ].map((b, i) => (
            <Reveal key={b.label} variant="float-in" delay={i * 100}>
              <div className="rounded-2xl bg-card/80 backdrop-blur p-6 shadow-soft border border-border/50 hover:-translate-y-1 transition-transform">
                <p className="text-xs uppercase tracking-[0.25em] text-primary">{b.label}</p>
                <p className="font-display text-xl text-twilight mt-2">{b.value}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="text-center font-script text-3xl text-primary pt-4">
            ✦ this is your year ✦
          </p>
        </Reveal>
      </div>
    </section>
  );
}
