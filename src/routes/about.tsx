import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles } from "@/components/Sparkles";
import { Reveal } from "@/components/Reveal";
import { ParallaxTilt } from "@/components/ParallaxTilt";
import { LightboxImage } from "@/components/Lightbox";
import vanyaPortrait from "@/assets/vanya-portrait.png";
import vanyaGreenShirt from "@/assets/vanya-green-shirt.png";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Vanya ✦ A Whimsy Wish" },
      { name: "description", content: "A little glimpse of who Vanya Bharti is — turning 22 on June 16, 2026." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <section className="relative bg-dreamy py-20 overflow-hidden">
      <Sparkles count={25} />
      <div className="relative mx-auto max-w-5xl px-6 space-y-16">

        {/* Header */}
        <Reveal className="space-y-4 text-center">
          <p className="font-script text-2xl text-primary">about the birthday girl</p>
          <h1 className="font-display text-5xl md:text-6xl text-twilight text-balance">
            Vanya Bharti
          </h1>
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-16 bg-border/50" />
            <span className="font-script text-xl text-primary">turning 22 ✦ 16 June 2026</span>
            <span className="h-px w-16 bg-border/50" />
          </div>
        </Reveal>

        {/* Portrait + Description */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
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
                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gold text-twilight font-script text-xl px-5 py-1 rounded-full shadow-glow whitespace-nowrap">
                  ✦ the muse ✦
                </span>
              </div>
            </ParallaxTilt>
          </Reveal>

          <Reveal variant="float-in" delay={150} className="space-y-5">
            <p className="text-lg leading-relaxed text-foreground/80">
              I need to edit this text later on till then this is just a sample unlike gpt generated text iykyk .
            </p>
            <p className="text-lg leading-relaxed text-foreground/80">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsam consequuntur accusantium molestiae numquam modi sapiente optio enim ex nesciunt. In, consequuntur!.
            </p>
            <p className="text-lg leading-relaxed text-foreground/80">
              Twenty-two years of turning ordinary moments into constellations.
              Each one deliberate. Each one luminous. Each one, unmistakably, <em>her</em>.
            </p>
            <p className="font-script text-2xl text-primary pt-2">
              — radiant, in every light.
            </p>
          </Reveal>
        </div>

        {/* Detail cards */}
        <div className="grid sm:grid-cols-2 gap-6">
          {[
            { label: "born", value: "16 June 2004", icon: "☾" },
            { label: "turning", value: "22 years young ✦", icon: "🎂" },
            { label: "loves", value: "tarot, lavender skies, vintage things", icon: "✿" },
            { label: "vibe", value: "pinterest-core · whimsical · ethereal", icon: "✧" },
            { label: "energy", value: "soft, starry, a little mystical", icon: "🌙" },
            { label: "sun sign", value: "Gemini ♊ — twins of light & shadow", icon: "✦" },
          ].map((b, i) => (
            <Reveal key={b.label} variant="float-in" delay={i * 80}>
              <div className="group rounded-2xl bg-card/80 backdrop-blur p-6 shadow-soft border border-border/50 hover:-translate-y-1 transition-all duration-300 hover:shadow-glow hover:border-primary/30">
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5 group-hover:scale-110 transition-transform inline-block">{b.icon}</span>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-primary">{b.label}</p>
                    <p className="font-display text-xl text-twilight mt-1">{b.value}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Second portrait */}
        <Reveal variant="float-in" className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-5 order-2 md:order-1">
            <p className="font-script text-2xl text-primary">twenty-two things she is</p>
            <ul className="space-y-2 text-foreground/75">
              {[
                "Endlessly curious about things that shimmer",
                "The kind of person who makes rooms feel warmer",
                "A collector of songs that hit exactly right",
                "Someone who believes in small rituals and big skies",
                "A little bit moon, a little bit sun, entirely herself",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary mt-1 shrink-0">✦</span>
                  <span className="italic">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <ParallaxTilt max={6} className="order-1 md:order-2">
            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/20 blur-3xl opacity-50 rounded-full" />
              <div className="relative rounded-[2rem] overflow-hidden border-4 border-card shadow-soft">
                <LightboxImage
                  src={vanyaGreenShirt}
                  alt="Vanya — green shirt, natural light"
                  className="w-full h-auto object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 animate-shimmer pointer-events-none opacity-40" />
              </div>
            </div>
          </ParallaxTilt>
        </Reveal>

        {/* CTA */}
        <Reveal className="text-center space-y-6 pt-4 border-t border-border/30">
          <p className="font-display italic text-3xl md:text-4xl text-twilight text-balance max-w-2xl mx-auto">
            "She is the kind of rare that the world needs more of."
          </p>
          <p className="font-script text-2xl text-primary">
            ✦ here's to 22 ✦
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              to="/starmap"
              className="rounded-full bg-primary text-primary-foreground px-6 py-2.5 shadow-soft hover:scale-105 transition-transform text-sm"
            >
              🌠 See your birth star map
            </Link>
            <Link
              to="/tarot"
              className="rounded-full border border-primary/30 text-primary px-6 py-2.5 hover:bg-primary/5 transition-colors text-sm"
            >
              ✦ Draw a birthday card
            </Link>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
