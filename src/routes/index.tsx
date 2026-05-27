import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/fairy-hero.jpeg";
import { Sparkles } from "@/components/Sparkles";
import { Reveal } from "@/components/Reveal";
import { CountdownTimer } from "@/components/CountdownTimer";
import { LightboxImage } from "@/components/Lightbox";

export const Route = createFileRoute("/")(
  {
    head: () => ({
      meta: [
        { title: "Happy Birthday Vanya ✦ A Whimsy Wish" },
        {
          name: "description",
          content:
            "A dreamy birthday tribute for Vanya Bharti — 16 June 2026.",
        },
      ],
    }),
    component: Index,
  },
);

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
