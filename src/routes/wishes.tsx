import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles } from "@/components/Sparkles";
import { Reveal } from "@/components/Reveal";
import { ParallaxTilt } from "@/components/ParallaxTilt";
import usRide from "@/assets/us-ride.png";
import vanyaGreenShirt from "@/assets/vanya-green-shirt.png";
import { LightboxImage } from "@/components/Lightbox";

export const Route = createFileRoute("/wishes")({
  head: () => ({
    meta: [
      { title: "A Wish For You ✦ Vanya" },
      { name: "description", content: "A personal birthday wish for Vanya." },
    ],
  }),
  component: Wishes,
});

function Wishes() {
  const [opened, setOpened] = useState(false);
  const [envelopeAnimating, setEnvelopeAnimating] = useState(false);

  const openEnvelope = () => {
    if (opened || envelopeAnimating) return;
    setEnvelopeAnimating(true);
    setTimeout(() => {
      setOpened(true);
      setEnvelopeAnimating(false);
    }, 1200);
  };

  return (
    <section className="relative bg-dreamy py-20 overflow-hidden min-h-[80vh]">
      <Sparkles count={25} />

      {/* floating decorative hearts */}
      <span className="absolute top-20 left-10 text-4xl text-primary/30 animate-float">♡</span>
      <span className="absolute bottom-32 right-12 text-5xl text-gold/40 animate-float" style={{ animationDelay: "1s" }}>✦</span>
      <span className="absolute top-1/2 left-8 text-3xl text-primary/30 animate-twinkle">✿</span>

      <div className="relative mx-auto max-w-3xl px-6 space-y-12">
        <Reveal className="text-center space-y-3">
          <p className="font-script text-3xl text-primary">a letter, just for you</p>
          <h1 className="font-display text-5xl md:text-6xl text-twilight text-balance">
            Happiest Birthday, Vanya ♡
          </h1>
        </Reveal>

        {/* Envelope / Letter Section */}
        {!opened ? (
          <Reveal variant="float-in" delay={150} className="flex justify-center">
            <button onClick={openEnvelope} className="group relative focus:outline-none" aria-label="Open the envelope">
              {/* Envelope body */}
              <div className={`relative w-72 h-48 sm:w-96 sm:h-60 rounded-2xl bg-card shadow-soft border border-border/50 overflow-hidden transition-all duration-500 ${envelopeAnimating ? "scale-95" : "hover:scale-105 hover:shadow-glow"}`}>
                {/* Envelope back pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-primary/10" />

                {/* Inner letter peek */}
                <div className={`absolute inset-x-4 bottom-4 top-12 bg-white/80 rounded-lg border border-border/30 flex items-center justify-center transition-transform duration-700 ${envelopeAnimating ? "-translate-y-16 opacity-100" : ""}`}>
                  <p className="font-script text-lg text-primary/60">dear Vanya...</p>
                </div>

                {/* Envelope flap (triangle) */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1/2 bg-card border-b border-border/30 transition-all duration-700 origin-top ${
                    envelopeAnimating ? "rotate-x-180 opacity-0" : ""
                  }`}
                  style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)", transformStyle: "preserve-3d" }}
                />

                {/* Seal */}
                <div className={`absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-gold flex items-center justify-center shadow-glow z-10 transition-all duration-500 ${envelopeAnimating ? "scale-0 opacity-0" : "group-hover:animate-glow-pulse"}`}>
                  <span className="font-script text-twilight text-lg">V</span>
                </div>
              </div>

              {/* Instruction */}
              <p className={`text-center font-script text-xl text-primary mt-4 transition-opacity ${envelopeAnimating ? "opacity-0" : "animate-float"}`}>
                tap to open ✦
              </p>
            </button>
          </Reveal>
        ) : (
          <>
            {/* Polaroid photos */}
            <Reveal variant="float-in" delay={150} className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              {/* Photo 1: Vanya & Himanshu (Green Shirt) */}
              <ParallaxTilt max={9}>
                <figure className="bg-card p-3 pb-12 rounded-md shadow-soft -rotate-3 hover:rotate-0 transition-transform duration-500 max-w-[240px] relative group">
                  <div className="overflow-hidden rounded-sm">
                    <LightboxImage
                      src={vanyaGreenShirt}
                      alt="Vanya and Himanshu"
                      className="w-full h-auto object-cover aspect-[3/4] transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-3 animate-shimmer pointer-events-none opacity-60" />
                  </div>
                  <figcaption className="absolute bottom-2 left-0 right-0 text-center font-script text-2xl text-twilight">
                    sweet moments ♡
                  </figcaption>
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-gold/40 rounded-sm rotate-2 shadow-soft" />
                </figure>
              </ParallaxTilt>

              {/* Photo 2: Us Ride */}
              <ParallaxTilt max={9}>
                <figure className="bg-card p-3 pb-12 rounded-md shadow-soft rotate-3 hover:rotate-0 transition-transform duration-500 max-w-[240px] relative group">
                  <div className="overflow-hidden rounded-sm">
                    <LightboxImage
                      src={usRide}
                      alt="Vanya and Himanshu on ride"
                      className="w-full h-auto object-cover aspect-[3/4] transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-3 animate-shimmer pointer-events-none opacity-60" />
                  </div>
                  <figcaption className="absolute bottom-2 left-0 right-0 text-center font-script text-2xl text-twilight">
                    us ✦ forever
                  </figcaption>
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-gold/40 rounded-sm -rotate-2 shadow-soft" />
                </figure>
              </ParallaxTilt>
            </Reveal>

            <Reveal variant="float-in" delay={200}>
              <article className="relative rounded-3xl bg-card/90 backdrop-blur p-10 md:p-14 shadow-soft border border-border/50 space-y-6">
                <span className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gold flex items-center justify-center text-twilight text-xl animate-float shadow-glow">
                  ✦
                </span>
                <p className="font-script text-3xl text-primary">dear Vanya,</p>
                <p className="text-lg leading-relaxed text-foreground/80">
                  The day finally is here we all have been waiting for this very special day 
                  your presence in my life is a gift that i will cherish forever everytime we
                  met was really special to me. I really want to thank you for being with me 
                  when i was not having a good time. Everytime you pulled cards for me brought 
                  blessings in my life. You have capability to understand your close ones deeply.
                </p>
                <p className="text-lg leading-relaxed text-foreground/80">
                  Watching you turn 22 is one of my favourite things. You
                  carry the world so gently with your lavender playlists, your
                  little tea rituals, your Pinterest boards full of dreams. I hope
                  this year is kinder than the last, and louder in all the good ways.
                </p>
                <p className="text-lg leading-relaxed text-foreground/80">
                  May every cup you brew taste like a tiny celebration. May every card
                  you pull whisper something hopeful. May your sixteenth of June feel
                  exactly the way you deserve warm, golden, and entirely yours. All i 
                  want you to know is anything that brings you down was never meant for 
                  you May your life be filled with all the happiness in the world 💖
                </p>
                <p className="font-display italic text-2xl text-twilight pt-2 text-balance">
                  "Here's to 22 the softest kind of magic I know."
                </p>
                <div className="pt-4">
                  <p className="font-script text-3xl text-primary">always yours,</p>
                  <p className="font-script text-4xl text-twilight mt-1">— Himanshu Matta ♡</p>
                </div>
              </article>
            </Reveal>

            <Reveal>
              <p className="text-center text-muted-foreground italic">
                ✿ p.s. there's more hidden through these pages — go wander ✿
              </p>
            </Reveal>
          </>
        )}
      </div>
    </section>
  );
}
